/* Reglas compartidas por el servidor y la demostración escolar. */
(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(require("./hours"));
  else root.FoodManagement = factory(root.FoodHours);
})(typeof globalThis !== "undefined" ? globalThis : this, function (Hours) {
  const states = [
    "Recibido",
    "En preparación",
    "Listo para enviar",
    "En camino",
    "Entregado",
  ];
  const deliverySeconds = 15 * 60;
  function estimate(items, db) {
    let totalMinutes = 30;
    for (const item of items || []) {
      const product =
        (db.products || []).find((p) =>
          item.productId != null
            ? String(p.id) === String(item.productId)
            : p.name === item.name,
        ) || (db.promos || []).find((p) => p.name === item.name);
      const text = String(
        (product?.cat || "") + " " + (product?.name || item.name || ""),
      )
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .toLowerCase();
      const minutes = /pizza|combo|familiar|paquete/.test(text)
        ? 60
        : /hamburgues|hot dog|alita|boneless|taco|pollo|comida/.test(text)
          ? 45
          : 30;
      totalMinutes = Math.max(totalMinutes, minutes);
    }
    const deliveryMinutes =
      totalMinutes === 60 ? 20 : totalMinutes === 45 ? 15 : 10;
    return {
      totalMinutes,
      preparationMinutes: totalMinutes - deliveryMinutes,
      deliveryMinutes,
    };
  }
  // Los pedidos anteriores conservan su recorrido de cuatro etapas.
  const legacyStates = ["Recibido", "En preparación", "En camino", "Entregado"];
  const customerStage = (order) =>
    legacyStates.indexOf(
      statusOf(order) === "Listo para enviar"
        ? "En preparación"
        : statusOf(order),
    );
  const demoStageSeconds = Object.freeze([0, 6, 36, 96]);
  const statusOf = (o) =>
    o.cancelled || o.status === "Cancelado"
      ? "Cancelado"
      : o.status === "Pedido recibido"
        ? "Recibido"
        : states.includes(o.status)
          ? o.status
          : "Recibido";
  function usesDemoTracking(order, enabled = true) {
    if (!enabled || ["manual", "dispatch", "gps"].includes(order.trackingMode))
      return false;
    const history = Array.isArray(order.statusHistory)
      ? order.statusHistory
      : [];
    if (
      history.some(
        (event) =>
          event && states.indexOf(event.status) > 0 && event.source !== "demo",
      )
    )
      return false;
    if (
      order.trackingMode !== "demo" &&
      statusOf(order) !== "Recibido" &&
      !history.some((event) => event && event.source === "demo")
    )
      return false;
    return true;
  }
  function autoAdvance(order, now = Date.now(), enabled = true) {
    if (order.handoff?.required) return order;
    if (order.trackingMode === "gps") {
      const gps = order.deliveryGps;
      if (
        statusOf(order) !== "En camino" ||
        !gps?.arrivedAt ||
        !gps?.location ||
        gps.stoppedAt ||
        now - gps.location.at > 90000 ||
        now < gps.arrivedAt + 60000
      )
        return order;
      return {
        ...order,
        status: "Entregado",
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: "Entregado",
            at: now,
            by: "Llegada confirmada por ubicación",
            source: "delivery-gps",
          },
        ],
      };
    }
    if (order.trackingMode === "dispatch") {
      if (
        statusOf(order) !== "En camino" ||
        !Number.isFinite(order.deliveryDueAt) ||
        order.deliveryDueAt <= 0 ||
        now < order.deliveryDueAt
      )
        return order;
      return {
        ...order,
        status: "Entregado",
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: "Entregado",
            at: order.deliveryDueAt,
            by: "Seguimiento de entrega",
            source: "delivery-timer",
          },
        ],
      };
    }
    const status = statusOf(order),
      index = legacyStates.indexOf(status),
      started = Number(order.ts);
    if (
      !usesDemoTracking(order, enabled) ||
      index < 0 ||
      index === legacyStates.length - 1 ||
      !Number.isFinite(started) ||
      started <= 0 ||
      started > now
    )
      return order;
    let target = index;
    for (let next = index + 1; next < legacyStates.length; next++)
      if (now >= started + demoStageSeconds[next] * 1000) target = next;
    if (target === index) return order;
    const history = Array.isArray(order.statusHistory)
      ? order.statusHistory.slice()
      : [];
    if (!history.length)
      history.push({
        status: legacyStates[0],
        at: started,
        by: order.customer || "Cliente",
        source: "order",
      });
    for (let next = index + 1; next <= target; next++)
      history.push({
        status: legacyStates[next],
        at: started + demoStageSeconds[next] * 1000,
        by: "Demostración automática",
        source: "demo",
      });
    return {
      ...order,
      status: legacyStates[target],
      managed: true,
      trackingMode: "demo",
      statusHistory: history,
    };
  }
  function advance(order, status, by) {
    if (
      order.handoff?.required &&
      status === "En camino" &&
      !order.handoff.pickup?.verifiedAt
    )
      throw Error(
        "Valida el código de retiro del repartidor para confirmar la salida.",
      );
    if (
      order.handoff?.required &&
      status === "Entregado" &&
      !order.handoff.delivery?.verifiedAt
    )
      throw Error(
        "La entrega requiere el código del cliente en la pantalla del repartidor.",
      );
    const old = statusOf(order),
      index = states.indexOf(old);
    if (
      index < 0 ||
      index === states.length - 1 ||
      states[index + 1] !== status
    )
      throw Error(
        "El pedido cambió. Actualiza y avanza al siguiente estado disponible.",
      );
    return {
      ...order,
      status,
      managed: true,
      trackingMode:
        status === "En camino"
          ? order.deliveryGps
            ? "gps"
            : "dispatch"
          : "manual",
      ...(status === "En camino"
        ? {
            dispatchedAt: Date.now(),
            deliveryDueAt:
              Date.now() +
              (Number(order.timing?.deliveryMinutes) || 15) * 60000,
          }
        : {}),
      statusHistory: [
        ...(order.statusHistory || []),
        { status, at: Date.now(), by, source: "staff" },
      ],
    };
  }
  function available(items, db) {
    for (const line of items) {
      const product =
        line.productId != null
          ? (db.products || []).find(
              (p) => String(p.id) === String(line.productId),
            )
          : (db.products || []).find((p) => p.name === line.name);
      if (product && product.soldOut === true)
        throw Error(product.name + " está agotado. Retíralo del pedido.");
      if (
        !product &&
        !(
          line.productId == null &&
          (db.promos || []).some((p) => p.name === line.name)
        )
      )
        throw Error((line.name || "Producto") + " ya no está disponible.");
    }
  }
  function catalogItems(items, db, branchIdx) {
    if (!Array.isArray(items) || items.length < 1 || items.length > 50)
      throw Error("El pedido debe incluir entre 1 y 50 partidas.");
    return items.map((line) => {
      const qty = line?.qty;
      if (!Number.isInteger(qty) || qty < 1 || qty > 20)
        throw Error("Cada partida debe tener entre 1 y 20 unidades.");
      const product =
        line.productId != null
          ? (db.products || []).find(
              (p) => String(p.id) === String(line.productId),
            )
          : (db.promos || []).find((p) => p.name === line.name) ||
            (db.products || []).find((p) => p.name === line.name);
      if (!product || product.soldOut === true)
        throw Error("Un producto del pedido se agotó o ya no está disponible.");
      if (
        branchIdx !== undefined &&
        product.only &&
        !product.only.includes(branchIdx)
      )
        throw Error(
          product.name + " no está disponible en la sucursal asignada.",
        );
      const available = db.extras?.[product.cat] || db.extras?.Snacks || [];
      const selected = line.extras ?? [];
      if (!Array.isArray(selected) || selected.length > available.length)
        throw Error("Revisa los extras del pedido.");
      const names = selected.map((extra) =>
        typeof extra === "string" ? extra : extra?.name,
      );
      if (new Set(names).size !== names.length)
        throw Error("Un extra solo se puede agregar una vez por partida.");
      const extras = names.map((name) => {
        const extra = available.find((row) => row.name === name);
        if (!extra)
          throw Error("Un extra no está disponible para ese producto.");
        return { name: extra.name, price: extra.price };
      });
      return {
        productId: product.id ?? null,
        name: product.name,
        emoji: product.emoji,
        img: product.img,
        only: product.only || null,
        base: product.price,
        qty,
        extras,
      };
    });
  }
  function pricing(items, fee, code = "", compensation = null) {
    let subtotalCents = 0;
    for (const item of items) {
      const base = Number(item.base),
        qty = Number(item.qty);
      if (
        !Number.isFinite(base) ||
        base < 0 ||
        !Number.isInteger(qty) ||
        qty < 1 ||
        qty > 20
      )
        throw Error("Revisa cantidades y precios del pedido.");
      let unit = Math.round(base * 100);
      for (const extra of item.extras || []) {
        const value = Number(extra.price);
        if (!Number.isFinite(value) || value < 0)
          throw Error("Extra inválido.");
        unit += Math.round(value * 100);
      }
      subtotalCents += unit * qty;
    }
    const shipping = Math.round(Number(fee || 0) * 100);
    if (
      !Number.isSafeInteger(subtotalCents) ||
      !Number.isSafeInteger(shipping) ||
      shipping < 0
    )
      throw Error("Importe inválido.");
    const couponCode = String(code || "")
      .trim()
      .toUpperCase();
    let discountCents = 0;
    if (couponCode === "TIZA10")
      discountCents = Math.round(subtotalCents * 0.1);
    else if (couponCode === "ENVIOGRATIS") discountCents = shipping;
    else if (couponCode === "AHORRA20") {
      if (subtotalCents < 10000)
        throw Error("AHORRA20 requiere al menos $100 en comida, sin envío.");
      discountCents = 2000;
    } else if (
      couponCode.startsWith("TIZA-R-") &&
      compensation?.code === couponCode &&
      compensation.percent === 10
    ) {
      discountCents = Math.round(subtotalCents * 0.1);
    } else if (couponCode) throw Error("El cupón no existe. Revisa el código.");
    discountCents = Math.min(discountCents, subtotalCents + shipping);
    return {
      subtotal: subtotalCents / 100,
      fee: shipping / 100,
      discount: discountCents / 100,
      couponCode,
      total: (subtotalCents + shipping - discountCents) / 100,
    };
  }
  function rate(order, user, body) {
    if ((user.role || "cliente") !== "cliente" || order.owner !== user.email)
      throw Error("Solo el cliente de este pedido puede calificarlo.");
    if (statusOf(order) !== "Entregado")
      throw Error("Puedes calificar cuando el pedido esté entregado.");
    if (order.deliveryRating) throw Error("Ya calificaste esta entrega.");
    const stars = Number(body.stars),
      comment = String(body.comment || "").trim();
    if (
      !Number.isInteger(stars) ||
      stars < 1 ||
      stars > 5 ||
      comment.length > 300
    )
      throw Error(
        "Elige de 1 a 5 estrellas y un comentario de hasta 300 caracteres.",
      );
    return { ...order, deliveryRating: { stars, comment, at: Date.now() } };
  }
  const accountEmail = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();
  function firstPurchaseEligible(db, user) {
    const email = accountEmail(user && user.email);
    if (!email) return false;
    return (
      !(db.customerPurchases || []).some(
        (value) => accountEmail(value) === email,
      ) &&
      !(db.orders || []).some((order) => accountEmail(order.owner) === email)
    );
  }
  function checkCoupon(db, user, code) {
    if (
      String(code || "")
        .trim()
        .toUpperCase() === "ENVIOGRATIS" &&
      !firstPurchaseEligible(db, user)
    ) {
      const error = Error(
        "ENVIOGRATIS solo está disponible en tu primera compra.",
      );
      error.status = 409;
      error.code = "COUPON_FIRST_PURCHASE_ONLY";
      throw error;
    }
  }
  function rememberPurchase(db, user) {
    // Conserva también las compras anteriores antes de recortar el historial visible.
    db.customerPurchases = [
      ...new Set(
        [
          ...(db.customerPurchases || []),
          ...(db.orders || []).map((order) => order.owner),
          user.email,
        ]
          .map(accountEmail)
          .filter(Boolean),
      ),
    ];
  }
  function accept(previous, incoming, db, user, compensation = null) {
    if (previous) {
      if (incoming.cancelled === true && statusOf(previous) !== "Cancelado") {
        if (!["Recibido", "En preparación"].includes(statusOf(previous)))
          throw Error("El pedido ya no se puede cancelar.");
        const cancelFee = Math.round(Number(previous.total) * 20) / 100;
        return {
          ...previous,
          status: "Cancelado",
          cancelled: true,
          cancelledAt: new Date().toISOString(),
          cancelFee,
          refund: Math.round((Number(previous.total) - cancelFee) * 100) / 100,
        };
      }
      return previous;
    }
    checkCoupon(db, user, incoming.couponCode);
    if (!incoming.items || !incoming.items.length)
      throw Error("El pedido debe incluir productos.");
    const deliveryNotes = String(incoming.deliveryNotes || "").trim();
    if (
      deliveryNotes.length > 300 ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(deliveryNotes)
    )
      throw Error(
        "Revisa las instrucciones de entrega: máximo 300 caracteres.",
      );
    const service = Hours.status(db.hours);
    if (!service.open)
      throw Error(
        service.text + ". No se pueden confirmar pedidos fuera de horario.",
      );
    available(incoming.items, db);
    const now = Date.now();
    return {
      ...incoming,
      deliveryNotes,
      ...pricing(
        incoming.items,
        incoming.fee,
        incoming.couponCode,
        compensation,
      ),
      deliveryRating: undefined,
      timing: estimate(incoming.items, db),
      etaMin: estimate(incoming.items, db).totalMinutes,
      owner: user.email,
      customer: user.name,
      status: "Recibido",
      cancelled: false,
      managed: true,
      trackingMode: "manual",
      dispatchedAt: null,
      deliveryDueAt: null,
      deliveryGps: undefined,
      delivery: undefined,
      handoff: undefined,
      ts: now,
      date: new Date(now).toLocaleString("es-MX", {
        timeZone: "America/Mexico_City",
      }),
      statusHistory: [
        { status: "Recibido", at: now, by: user.name, source: "order" },
      ],
    };
  }
  const day = (ts) =>
    new Intl.DateTimeFormat("sv-SE", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(ts));
  function summary(orders, period = "today", now = Date.now()) {
    const list = orders.filter(
      (o) =>
        period === "all" || (Number.isFinite(o.ts) && day(o.ts) === day(now)),
    );
    const out = {
      count: list.length,
      cancelled: 0,
      active: 0,
      delivered: 0,
      orderTotal: 0,
      sales: 0,
      methods: {
        "Saldo a favor": { count: 0, total: 0 },
        Tarjeta: { count: 0, total: 0 },
        Efectivo: { count: 0, total: 0 },
        Transferencia: { count: 0, total: 0 },
      },
    };
    for (const o of list) {
      if (statusOf(o) === "Cancelado") {
        out.cancelled++;
        continue;
      }
      const cents = Math.round((Number(o.total) || 0) * 100);
      out.orderTotal += cents;
      const entry = out.methods[o.payment && o.payment.method];
      if (entry) {
        entry.count++;
        entry.total += cents;
      }
      if (statusOf(o) === "Entregado") {
        out.delivered++;
        out.sales += cents;
      } else out.active++;
    }
    out.orderTotal /= 100;
    out.sales /= 100;
    for (const entry of Object.values(out.methods)) entry.total /= 100;
    return out;
  }
  function validImage(value) {
    return (
      value === "" ||
      /^img\/[^\x00-\x1f]+$/.test(value) ||
      (value.length <= 220000 &&
        /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(
          value,
        ))
    );
  }
  const imageAliases = {
    "img/nuggets.jpg": "img/Nuggets.jpg",
    "img/alitas.jpg": "img/Alitas.jpg",
    "img/cafe-frio.jpg": "img/cafefrio.jpg",
    "img/mini-burgers.jpg": "img/mini-bu.jpg",
    "img/famili.jpg": "img/pizza-familiar.jpg",
    "img/combo-pareja.jpg": "img/combopareja.jpg",
    "img/combo-familiar.jpg": "img/combo-familiar-tiza.png",
    "img/combo-familiar.webp": "img/combo-familiar-tiza.png",
    "img/combofamiliar.jpg": "img/combo-familiar-tiza.png",
  };
  const imagePath = (value) => imageAliases[value] || value;
  return {
    imagePath,
    states,
    statusOf,
    customerStage,
    deliverySeconds,
    estimate,
    advance,
    autoAdvance,
    usesDemoTracking,
    demoStageSeconds,
    available,
    catalogItems,
    accept,
    summary,
    validImage,
    pricing,
    firstPurchaseEligible,
    checkCoupon,
    rememberPurchase,
    rate,
  };
});
