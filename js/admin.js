/* Paneles de dueño y empleado. Los permisos se verifican en el servidor. */
(() => {
  let staffUser = null,
    products = [],
    refreshTimer = null,
    staffOrders = [],
    orderFilter = "active",
    trackingFolio = "",
    ordersVersion = 0,
    appliedOrdersVersion = 0;
  const pendingOrders = new Set();
  let generatingDeliveryAccess = false;
  let staffReviews = [],
    reviewPoll = 0;
  let destinationMap = null,
    destinationMarker = null,
    destinationPoint = null;
  const el = (id) => document.getElementById(id);
  const escape = (value) =>
    String(value == null ? "" : value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const price = (n) => "$" + Number(n || 0).toFixed(2);
  async function request(route, method = "GET", body) {
    const response = await fetch("api/" + route, {
      method,
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (response.status === 401) {
      FoodSession.expire();
      throw Error("Tu sesión terminó. Vuelve a iniciar sesión.");
    }
    const data = await response.json();
    if (!response.ok)
      throw Error(data.error || "No se pudo completar la operación.");
    return data;
  }
  function message(text, error = false) {
    el("staffMessage").textContent = text;
    el("staffMessage").style.color = error ? "#b91c1c" : "#166534";
  }
  async function orders() {
    const version = ++ordersVersion;
    const data = await request("admin/orders");
    if (version <= appliedOrdersVersion) return;
    appliedOrdersVersion = version;
    staffOrders = data.orders;
    const latestDelivery = staffOrders.reduce((latest, order) => {
      if (FoodManagement.statusOf(order) !== "Entregado") return latest;
      const deliveredAt =
        order.statusHistory?.findLast((event) => event.status === "Entregado")
          ?.at ?? order.ts;
      return !latest || deliveredAt > latest.at
        ? { folio: order.folio, at: deliveredAt }
        : latest;
    }, null);
    el("staffDeliveredNotice").textContent = latestDelivery
      ? "Última entrega confirmada · " + latestDelivery.folio
      : "";
    renderOrderFilters();
    renderStaffOrders();
    renderStaffTracking();
    el("staffOrdersUpdated").textContent =
      "Actualización automática cada 5 segundos · Última consulta: " +
      new Date().toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
  }
  const labels = {
    Recibido: "Pendientes",
    "En preparación": "En preparación",
    "Listo para enviar": "Listos para enviar",
    "En camino": "En camino",
    Entregado: "Entregados",
    Cancelado: "Cancelados",
  };
  const actions = {
    "En preparación": "Aceptar y preparar",
    "Listo para enviar": "Marcar listo para enviar",
    "En camino": "Validar retiro y confirmar salida",
  };
  const active = (order) =>
    !["Entregado", "Cancelado"].includes(FoodManagement.statusOf(order));
  function renderOrderFilters() {
    const filters = [
      ["active", "Activos", staffOrders.filter(active).length],
      ...Object.entries(labels).map(([status, label]) => [
        status,
        label,
        staffOrders.filter((order) => FoodManagement.statusOf(order) === status)
          .length,
      ]),
    ];
    el("staffOrderFilters").innerHTML = filters
      .map(
        ([value, label, count]) =>
          '<button class="staff-order-filter" type="button" data-order-filter="' +
          escape(value) +
          '" aria-pressed="' +
          String(orderFilter === value) +
          '">' +
          escape(label) +
          "<span>" +
          count +
          "</span></button>",
      )
      .join("");
  }
  function orderProgress(order) {
    const index = FoodManagement.states.indexOf(FoodManagement.statusOf(order));
    if (index < 0)
      return '<p class="muted">Pedido cancelado. El seguimiento se detuvo.</p>';
    return (
      '<ol class="staff-order-progress" aria-label="Progreso del pedido">' +
      FoodManagement.states
        .map(
          (status, i) =>
            '<li class="' +
            (i < index ? "done" : i === index ? "current" : "") +
            '"' +
            (i === index ? ' aria-current="step"' : "") +
            '><span aria-hidden="true">' +
            (i < index ? "✓" : i + 1) +
            "</span>" +
            escape(status === "Recibido" ? "Pendiente" : status) +
            "</li>",
        )
        .join("") +
      "</ol>"
    );
  }
  function deliveryNote(order) {
    if (FoodManagement.statusOf(order) === "Entregado")
      return '<p class="staff-delivery-note">Entrega completada.</p>';
    if (
      order.handoff?.required &&
      FoodManagement.statusOf(order) === "En camino"
    )
      return order.handoff.riderArrived
        ? '<p class="staff-delivery-note">El repartidor avisó que llegó. Esperando el código del cliente.</p>'
        : '<p class="staff-delivery-note">Retiro registrado. La entrega se confirma únicamente con el código del cliente.</p>';
    if (
      order.trackingMode === "gps" &&
      FoodManagement.statusOf(order) === "En camino"
    )
      return '<p class="staff-delivery-note">Seguimiento GPS activado. La entrega se confirmará al llegar al destino.</p>';
    return FoodManagement.statusOf(order) === "En camino" && order.deliveryDueAt
      ? '<p class="staff-delivery-note">Salió de la tienda. Confirmación automática de entrega en aproximadamente ' +
          Math.max(1, Math.ceil((order.deliveryDueAt - Date.now()) / 60000)) +
          " min.</p>"
      : "";
  }
  function renderStaffOrders() {
    const data = {
      orders: staffOrders
        .filter((order) =>
          orderFilter === "active"
            ? active(order)
            : FoodManagement.statusOf(order) === orderFilter,
        )
        .sort((a, b) =>
          orderFilter === "active" || orderFilter === "Recibido"
            ? a.ts - b.ts
            : b.ts - a.ts,
        ),
    };
    el("staffOrderList").innerHTML = data.orders.length
      ? data.orders
          .map((o) => {
            const status = FoodManagement.statusOf(o),
              index = FoodManagement.states.indexOf(status),
              next =
                index >= 0 && status !== "En camino"
                  ? FoodManagement.states[index + 1]
                  : null;
            return (
              '<article class="staff-record"><h3>Pedido ' +
              escape(o.folio) +
              "</h3><p>" +
              escape(o.date) +
              " · " +
              escape(o.branch) +
              "</p><p>Cliente: " +
              escape(o.customer || o.owner) +
              "</p><p>Entrega: " +
              escape(o.address) +
              "</p>" +
              (o.timing
                ? '<p class="muted">Tiempo estimado total: ' +
                  escape(o.timing.totalMinutes) +
                  " min · Preparación: " +
                  escape(o.timing.preparationMinutes) +
                  " min · Entrega: " +
                  escape(o.timing.deliveryMinutes) +
                  " min</p>"
                : "") +
              (o.deliveryNotes
                ? "<p>Instrucciones: " + escape(o.deliveryNotes) + "</p>"
                : "") +
              "<ul>" +
              (o.items || [])
                .map(
                  (i) =>
                    "<li>" + escape(i.qty) + " × " + escape(i.name) + "</li>",
                )
                .join("") +
              "</ul><p><strong>Total: " +
              price(o.total) +
              "</strong></p>" +
              (o.walletApplied > 0
                ? "<p>Saldo aplicado: " +
                  price(o.walletApplied) +
                  " · Resto por cobrar: " +
                  price(o.amountDue) +
                  "</p>"
                : "") +
              "<p>Pago: " +
              escape(o.payment && o.payment.method) +
              " · " +
              escape(
                String((o.payment && o.payment.status) || "Sin estado de cobro")
                  .replace(/\s+simulad[oa]/gi, "")
                  .replace(/\s+virtual/gi, ""),
              ) +
              "</p>" +
              (o.payment && o.payment.reference
                ? "<p>Referencia: " + escape(o.payment.reference) + "</p>"
                : "") +
              (o.payment && o.payment.demo ? "" : "") +
              (o.payment && o.payment.method === "Efectivo"
                ? "<p>Paga con: " +
                  price(o.payment.cashAmount) +
                  " · Cambio: " +
                  price(o.payment.change) +
                  "</p>"
                : "") +
              (o.discount > 0
                ? "<p>Cupón " +
                  escape(o.couponCode) +
                  ": −" +
                  price(o.discount) +
                  "</p>"
                : "") +
              (o.deliveryRating
                ? "<p>Calificación de entrega: <strong>" +
                  o.deliveryRating.stars +
                  " de 5 ★</strong></p><p>" +
                  escape(o.deliveryRating.comment) +
                  "</p>"
                : "") +
              "<p>Estado: <strong>" +
              escape(status) +
              "</strong></p>" +
              orderProgress(o) +
              deliveryNote(o) +
              '<div class="staff-order-actions"><button type="button" class="btn btn-ghost" data-track-order="' +
              escape(o.folio) +
              '">Ver seguimiento y mapa</button>' +
              (next
                ? '<button type="button" class="btn btn-main" data-advance-order="' +
                  escape(o.folio) +
                  '" data-next-status="' +
                  escape(next) +
                  '"' +
                  (pendingOrders.has(o.folio) ? " disabled" : "") +
                  ">" +
                  escape(actions[next] || "Pasar a " + next) +
                  "</button>"
                : "") +
              "</div></article>"
            );
          })
          .join("")
      : '<div class="staff-record"><p>No hay pedidos ' +
        (orderFilter === "active"
          ? "activos"
          : escape((labels[orderFilter] || "").toLowerCase())) +
        " en este apartado.</p></div>";
  }
  function renderStaffTracking() {
    if (!trackingFolio || !el("staffTrackingModal").classList.contains("open"))
      return;
    const order = staffOrders.find((item) => item.folio === trackingFolio);
    if (!order) return;
    const canShare = ["Listo para enviar", "En camino"].includes(
      FoodManagement.statusOf(order),
    );
    if (
      !canShare ||
      (order.delivery?.expiresAt && order.delivery.expiresAt <= Date.now())
    )
      clearDeliveryAccess();
    el("staffTrackingTitle").textContent = "Pedido " + order.folio;
    el("staffTrackingAddress").textContent =
      order.branch + " → " + order.address;
    el("staffTrackingEta").textContent = order.timing
      ? "Tiempo estimado total: " +
        order.timing.totalMinutes +
        " min (" +
        order.timing.preparationMinutes +
        " de preparación + " +
        order.timing.deliveryMinutes +
        " de entrega)."
      : "";
    el("staffGenerateDeliveryLink").disabled =
      !canShare || generatingDeliveryAccess;
    el("staffPickupForm").classList.toggle(
      "hidden",
      FoodManagement.statusOf(order) !== "Listo para enviar",
    );
    el("staffGenerateDeliveryLink").textContent = order.delivery?.enabled
      ? "Generar otro QR y enlace"
      : "Generar QR y enlace privado";
    el("staffGpsStatus").textContent =
      FoodManagement.statusOf(order) === "Entregado"
        ? "La entrega terminó y el seguimiento GPS se cerró."
        : order.delivery?.fresh
          ? "El repartidor está compartiendo su ubicación."
          : order.delivery?.enabled
            ? "Esperando señal GPS del repartidor. Mantén su pantalla de reparto abierta."
            : "Cuando esté listo, genera el enlace del repartidor. En su pantalla verá el código para retirar este pedido.";
    el("staffTrackingProgress").innerHTML =
      orderProgress(order) + deliveryNote(order);
    el("staffTrackingHistory").innerHTML = (order.statusHistory || [])
      .map(
        (event) =>
          "<li><strong>" +
          escape(event.status) +
          "</strong><span>" +
          escape(new Date(event.at).toLocaleString("es-MX")) +
          " · " +
          escape(event.by || "Restaurante") +
          "</span></li>",
      )
      .join("");
    const branch = FoodBranches.forOrder(order);
    const origin = order.delivery?.location
      ? order.delivery.location.lat + "," + order.delivery.location.lng
      : branch.coords || branch.name + ", " + branch.zone;
    const coords =
      typeof order.coords === "string" &&
      /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/.test(order.coords)
        ? order.coords
        : null;
    const destination = coords || FoodBranches.addressQuery(order.address);
    const url =
      "https://maps.google.com/maps?saddr=" +
      encodeURIComponent(origin) +
      "&daddr=" +
      encodeURIComponent(destination) +
      "&output=embed";
    const frame = el("staffTrackingMap");
    if (frame.dataset.route !== url) {
      frame.dataset.route = url;
      frame.src = url;
    }
    el("staffTrackingMapLink").href =
      "https://www.google.com/maps/dir/?api=1&origin=" +
      encodeURIComponent(origin) +
      "&destination=" +
      encodeURIComponent(destination);
  }
  async function sales() {
    const data = await request(
      "admin/summary?period=" + el("salesPeriod").value,
    );
    const cards = [
      ["Pedidos recibidos", data.count],
      ["En proceso", data.active],
      ["Entregados", data.delivered],
      ["Cancelados", data.cancelled],
      ["Importe de pedidos sin cancelar", price(data.orderTotal)],
      ["Ventas entregadas", price(data.sales)],
    ];
    el("salesSummary").innerHTML = cards
      .map(
        ([label, value]) =>
          '<article class="staff-record sales-card"><span>' +
          escape(label) +
          "</span><strong>" +
          escape(value) +
          "</strong></article>",
      )
      .join("");
    el("salesMethods").innerHTML =
      '<h3>Pedidos sin cancelar por método de pago</h3><div class="sales-table-wrap"><table class="sales-table"><thead><tr><th>Método</th><th>Pedidos</th><th>Importe</th></tr></thead><tbody>' +
      Object.entries(data.methods)
        .map(
          ([method, value]) =>
            "<tr><td>" +
            escape(method) +
            "</td><td>" +
            value.count +
            "</td><td>" +
            price(value.total) +
            "</td></tr>",
        )
        .join("") +
      "</tbody></table></div>";
    const metric = (label, value, detail) =>
      '<article class="staff-record sales-card"><span>' +
      escape(label) +
      "</span><strong>" +
      escape(value) +
      "</strong><small>" +
      escape(detail) +
      "</small></article>";
    const service = data.service || {};
    const rated = (value, count) =>
      value == null ? "Sin calificaciones" : String(value) + " / 5 ★";
    el("reportService").innerHTML = [
      metric(
        "Calificación de entrega",
        rated(service.deliveryRating, service.deliveryRatingCount),
        (service.deliveryRatingCount || 0) + " calificaciones recibidas",
      ),
      metric(
        "Calificación de productos",
        rated(service.productRating, service.productRatingCount),
        (service.productRatingCount || 0) + " reseñas visibles",
      ),
      metric(
        "Tiempo promedio de entrega",
        service.averageDeliveryMinutes == null
          ? "Sin entregas medidas"
          : String(service.averageDeliveryMinutes) + " min",
        (service.timedDeliveries || 0) + " entregas con hora de salida y llegada",
      ),
    ].join("");
    el("reportProducts").innerHTML = data.products?.length
      ? '<table class="sales-table"><thead><tr><th>Producto</th><th>Unidades solicitadas</th></tr></thead><tbody>' +
        data.products
          .map(
            (product) =>
              "<tr><td>" +
              escape(product.name) +
              "</td><td>" +
              escape(product.quantity) +
              "</td></tr>",
          )
          .join("") +
        "</tbody></table>"
      : "<p>Aún no hay productos solicitados en este periodo.</p>";
    const refunds = data.refunds || {};
    el("reportRefunds").innerHTML =
      '<table class="sales-table"><thead><tr><th>Solicitudes</th><th>En revisión</th><th>Aprobadas</th><th>Completadas</th><th>Importe completado</th></tr></thead><tbody><tr><td>' +
      escape(refunds.requested || 0) +
      "</td><td>" +
      escape(refunds.pending || 0) +
      "</td><td>" +
      escape(refunds.approved || 0) +
      "</td><td>" +
      escape(refunds.completed || 0) +
      "</td><td>" +
      price(refunds.totalCompleted) +
      "</td></tr></tbody></table>";
    const email = await request("admin/receipts/status");
    el("receiptReportStatus").textContent = email.configured
      ? "Tickets aceptados: " +
        (email.accepted || 0) +
        " · Pendientes: " +
        (email.pending || 0) +
        " · Fallidos: " +
        (email.failed || 0) +
        " · Creados antes de configurar correo: " +
        (email.unconfigured || 0)
      : "El correo de tickets necesita una clave y un remitente válidos de Resend.";
    el("retryReceiptEmails").disabled = !email.configured || !((email.failed || 0) + (email.unconfigured || 0));
  }
  async function refunds() {
    if (staffUser?.role !== "dueno") return;
    const data = await request("admin/refunds");
    el("staffRefundList").innerHTML =
      data.requests
        .slice()
        .reverse()
        .map(
          (r) =>
            '<article class="staff-record"><h3>' +
            escape(r.orderFolio) +
            " · " +
            escape(r.product) +
            "</h3><p>" +
            escape(r.quantity) +
            " unidades · reembolso " +
            escape(r.refundPercent || 100) +
            "%: " +
            price(r.amount) +
            " · " +
            escape(r.statusLabel) +
            (r.productReturnRequired === false
              ? "</p><p>El cliente conserva el producto; no se solicita su devolución."
              : "") +
            (r.refundDestinationMessage
              ? "</p><p>" + escape(r.refundDestinationMessage)
              : "") +
            (r.walletCreditedAmount > 0
              ? "</p><p>Saldo a favor abonado a la cuenta: " +
                price(r.walletCreditedAmount)
              : "") +
            "</p><p>" +
            escape(r.reason) +
            "</p><p>" +
            escape(r.createdAt) +
            (r.evidenceCode
              ? "</p><p>Código que debe verse en la foto: <strong>" +
                escape(r.evidenceCode) +
                "</strong>"
              : "</p><p>Solicitud anterior sin código de verificación") +
            '</p><img class="refund-evidence" src="api/admin/refunds/' +
            encodeURIComponent(r.id) +
            '/photo" loading="lazy" alt="Foto enviada por el cliente"><p>Análisis: ' +
            escape(
              (r.analysis && r.analysis.reason) || "Pendiente de revisión",
            ) +
            "</p>" +
            (r.coupon
              ? "<p>Cupón personal del 10%: <strong>" +
                escape(r.coupon.code) +
                "</strong> · " +
                (r.coupon.usedBy
                  ? "Usado en " + escape(r.coupon.usedBy)
                  : "Disponible para el siguiente pedido") +
                "</p>"
              : "") +
            (r.decisionNote
              ? "<p>Nota: " + escape(r.decisionNote) + "</p>"
              : "") +
            (r.paymentReference
              ? "<p>Referencia registrada: " +
                escape(r.paymentReferenceLabel || r.paymentReference) +
                "</p>"
              : "") +
            (r.paymentMode === "demo"
              ? ""
              : "<p>La devolución se realiza fuera de la app por el medio correspondiente.</p>") +
            (r.status === "REVISION_MANUAL"
              ? (r.evidencePolicy === "owner-review-v1"
                  ? '<fieldset data-evidence-checks="' +
                    escape(r.id) +
                    '"><legend>Revisión del personal del restaurante</legend><label><input type="checkbox" data-evidence-check="codeVisible"> El código coincide y se lee en la foto</label><br><label><input type="checkbox" data-evidence-check="productMatches"> El producto y el empaque corresponden al reclamo</label><br><label><input type="checkbox" data-evidence-check="photoClear"> La foto es clara y permite revisar el problema</label></fieldset>'
                  : "") +
                '<button class="btn btn-main" type="button" data-refund-id="' +
                escape(r.id) +
                '" data-refund-status="APROBADO">Aprobar solicitud</button> <button class="btn btn-ghost" type="button" data-refund-id="' +
                escape(r.id) +
                '" data-refund-status="RECHAZADO">No aprobar</button> <button class="btn btn-ghost" type="button" data-refund-id="' +
                escape(r.id) +
                '" data-refund-status="FOTO_REQUERIDA">Pedir otra foto</button>'
              : r.status === "APROBADO"
                ? '<button class="btn btn-main" type="button" data-refund-id="' +
                  escape(r.id) +
                  '" data-refund-status="REEMBOLSADO">' +
                  (r.paymentMode === "demo"
                    ? "Registrar devolución"
                    : "Registrar devolución ya realizada") +
                  "</button>"
                : "") +
            "</article>",
        )
        .join("") || "<p>No hay solicitudes de reembolso.</p>";
  }
  async function productList() {
    products = (await request("admin/products")).products;
    el("staffProductList").innerHTML =
      products
        .map(
          (p) =>
            '<article class="staff-record"><h3>' +
            escape(p.name) +
            " · " +
            price(p.price) +
            "</h3><p>" +
            escape(p.cat) +
            "</p><p>" +
            escape(p.desc) +
            "</p><p><strong>" +
            (p.soldOut ? "Agotado" : "Disponible") +
            '</strong></p><button type="button" class="btn btn-ghost" data-toggle-stock="' +
            p.id +
            '">' +
            (p.soldOut ? "Marcar disponible" : "Marcar agotado") +
            '</button><button type="button" class="btn btn-ghost" data-edit-product="' +
            p.id +
            '">Editar</button><button type="button" class="btn btn-ghost" data-delete-product="' +
            p.id +
            '">Quitar</button></article>',
        )
        .join("") ||
      "<p>No hay productos. Agrega el primero con el formulario.</p>";
  }
  async function employees() {
    const data = await request("admin/employees");
    el("staffEmployeeList").innerHTML =
      data.users
        .map(
          (u) =>
            '<article class="staff-record"><strong>' +
            escape(u.name) +
            "</strong><p>Correo: " +
            escape(u.email) +
            (["firebase", "local-staff"].includes(u.authProvider)
              ? ""
              : " · Pendiente de vincular con Firebase") +
            "</p></article>",
        )
        .join("") || "<p>Aún no hay empleados.</p>";
  }
  async function hours() {
    const data = await request("admin/hours");
    el("hoursEnabled").checked = data.hours.enabled;
    el("hoursDays").innerHTML = FoodHours.days
      .map(
        (name, i) =>
          '<div class="hours-row"><strong>' +
          name +
          '</strong><label><input type="checkbox" data-day-closed="' +
          i +
          '" ' +
          (data.hours.days[i].closed ? "checked" : "") +
          '> Cerrado</label><label>Apertura <input type="time" data-day-open="' +
          i +
          '" value="' +
          data.hours.days[i].open +
          '" required></label><label>Cierre <input type="time" data-day-close="' +
          i +
          '" value="' +
          data.hours.days[i].close +
          '" required></label></div>',
      )
      .join("");
    el("hoursPreview").textContent = FoodHours.status(data.hours).text;
  }
  el("hoursForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = e.submitter;
    button.disabled = true;
    try {
      const value = {
        enabled: el("hoursEnabled").checked,
        days: FoodHours.days.map((_, i) => ({
          closed: document.querySelector('[data-day-closed="' + i + '"]')
            .checked,
          open: document.querySelector('[data-day-open="' + i + '"]').value,
          close: document.querySelector('[data-day-close="' + i + '"]').value,
        })),
      };
      await request("admin/hours", "PUT", FoodHours.validate(value));
      await hours();
      window.dispatchEvent(new Event("restaurant-hours-changed"));
      message("Horarios guardados.");
    } catch (err) {
      message(err.message, true);
    } finally {
      button.disabled = false;
    }
  });
  async function loadStaffReviews() {
    const data = await request("admin/reviews");
    staffReviews = data.reviews || [];
    const visible = staffReviews.filter((review) => !review.hidden).length;
    el("staffReviewsTab").textContent = visible
      ? `Reseñas (${visible})`
      : "Reseñas";
    if (el("staffReviews").classList.contains("hidden")) return;
    const action = (review, name, label) =>
      `<button type="button" class="btn btn-ghost" data-review-action="${name}" data-review-id="${escape(review.id)}">${label}</button>`;
    el("staffReviewList").innerHTML =
      staffReviews
        .map(
          (review) => `
      <article class="staff-record">
        <h3>${escape(review.product)} · ${escape(review.stars)} / 5</h3>
        <p>${escape(review.user)} · ${escape(review.orderFolio || "")} · ${escape(new Date(review.date).toLocaleDateString("es-MX"))}</p>
        <p>${escape(review.comment)}</p>
        <small>${review.hidden ? "Retirada" : "Visible"}${review.moderated ? " · Editada por moderación" : ""}${review.suspended ? " · Cuenta suspendida para reseñar" : ""}</small>
        ${review.reason ? `<p class="muted">Motivo de moderación · ${escape(review.reason)}</p>` : ""}
        <div class="staff-order-actions">${action(review, "edit", "Editar comentario")}${review.hidden ? action(review, "restore", "Restaurar reseña") : action(review, "hide", "Retirar reseña")}${review.suspended ? "" : action(review, "suspend", "Suspender reseñas de esta cuenta")}</div>
      </article>`,
        )
        .join("") || "<p>Aún no hay reseñas.</p>";
    el("staffReviewBlocks").innerHTML =
      (data.blocks || [])
        .map(
          (block) =>
            `<article class="staff-record"><strong>${escape(block.user)}</strong><p>${escape(block.reason)}</p><button type="button" class="btn btn-ghost" data-review-unblock="${escape(block.id)}">Levantar suspensión</button></article>`,
        )
        .join("") || "<p>No hay cuentas suspendidas para reseñar.</p>";
  }

  async function tab(name) {
    if (!["orders", "reviews"].includes(name) && staffUser.role !== "dueno")
      return;
    for (const key of [
      "orders",
      "reviews",
      "products",
      "employees",
      "sales",
      "hours",
      "refunds",
    ])
      el("staff" + key[0].toUpperCase() + key.slice(1)).classList.toggle(
        "hidden",
        key !== name,
      );
    document.querySelectorAll("[data-staff-tab]").forEach((b) => {
      if (b.dataset.staffTab === name) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    try {
      await {
        orders,
        reviews: loadStaffReviews,
        products: productList,
        employees,
        sales,
        hours,
        refunds,
      }[name]();
      message("");
    } catch (err) {
      message(err.message, true);
    }
  }
  window.showStaffPanel = async (user) => {
    staffUser = user;
    for (const id of ["splash", "welcome", "register", "app"])
      el(id).classList.add("hidden");
    el("staffPanel").classList.remove("hidden");
    el("staffTitle").textContent =
      user.role === "dueno" ? "Panel del dueño" : "Panel del empleado";
    el("staffUser").textContent = user.name + " · " + user.email;
    document
      .querySelectorAll(".owner-only")
      .forEach((e) => e.classList.toggle("hidden", user.role !== "dueno"));
    await tab("orders");
    void loadStaffReviews().catch(() => {});
    clearInterval(refreshTimer);
    refreshTimer = setInterval(() => {
      if (++reviewPoll % 3 === 0) loadStaffReviews().catch(() => {});
      if (!el("staffOrders").classList.contains("hidden"))
        orders().catch((err) => message(err.message, true));
      if (
        staffUser.role === "dueno" &&
        !el("staffRefunds").classList.contains("hidden")
      )
        refunds().catch((err) => message(err.message, true));
    }, 5000);
  };
  document
    .querySelectorAll("[data-staff-tab]")
    .forEach((b) => b.addEventListener("click", () => tab(b.dataset.staffTab)));
  el("salesPeriod").addEventListener("change", () =>
    sales().catch((err) => message(err.message, true)),
  );
  el("refreshSales").addEventListener("click", () =>
    sales().catch((err) => message(err.message, true)),
  );
  el("retryReceiptEmails").addEventListener("click", async (event) => {
    const button = event.currentTarget;
    if (button.disabled || !confirm("¿Reintentar los tickets fallidos?")) return;
    button.disabled = true;
    try {
      const result = await request("admin/receipts/retry", "POST");
      message(
        result.queued
          ? "Se pusieron " + result.queued + " tickets en la cola de envío."
          : "No hay tickets fallidos para reintentar.",
      );
      await sales();
    } catch (error) {
      message(error.message, true);
    } finally {
      button.disabled = false;
    }
  });
  el("refreshStaffReviews").addEventListener("click", () =>
    loadStaffReviews().catch((error) => message(error.message, true)),
  );
  el("staffReviewList").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-review-action]");
    if (!button || button.disabled) return;
    const review = staffReviews.find(
      (row) => row.id === button.dataset.reviewId,
    );
    if (!review) return;
    const action = button.dataset.reviewAction;
    const comment =
      action === "edit"
        ? prompt(
            "Edita el comentario. La calificación se conserva y la edición queda indicada.",
            review.comment,
          )
        : undefined;
    if (comment === null) return;
    const reason = prompt(
      action === "suspend"
        ? "Motivo para suspender las reseñas de esta cuenta. La cuenta seguirá pudiendo hacer pedidos."
        : "Motivo de la moderación (al menos 5 caracteres).",
    );
    if (reason === null) return;
    button.disabled = true;
    try {
      await request("admin/reviews/" + encodeURIComponent(review.id), "PATCH", {
        action,
        comment,
        reason,
      });
      await loadStaffReviews();
      message("Moderación guardada.");
    } catch (error) {
      message(error.message, true);
    } finally {
      button.disabled = false;
    }
  });
  el("staffReviewBlocks").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-review-unblock]");
    if (!button || button.disabled) return;
    button.disabled = true;
    try {
      await request(
        "admin/review-blocks/" +
          encodeURIComponent(button.dataset.reviewUnblock),
        "DELETE",
      );
      await loadStaffReviews();
      message("La cuenta puede volver a publicar reseñas.");
    } catch (error) {
      message(error.message, true);
    } finally {
      button.disabled = false;
    }
  });
  el("staffOrderList").addEventListener("click", async (e) => {
    const tracking = e.target.closest("[data-track-order]");
    if (tracking) {
      trackingFolio = tracking.dataset.trackOrder;
      el("staffPickupCode").value = "";
      el("staffPickupMessage").textContent = "";
      clearDeliveryAccess();
      el("staffDestinationEditor").classList.add("hidden");
      destinationPoint = null;
      el("staffTrackingModal").classList.add("open");
      el("staffTrackingModal").setAttribute("aria-hidden", "false");
      renderStaffTracking();
      return;
    }
    const button = e.target.closest("[data-advance-order]");
    if (!button) return;
    const folio = button.dataset.advanceOrder;
    if (button.dataset.nextStatus === "En camino") {
      trackingFolio = folio;
      clearDeliveryAccess();
      el("staffPickupCode").value = "";
      el("staffPickupMessage").textContent = "";
      el("staffTrackingModal").classList.add("open");
      el("staffTrackingModal").setAttribute("aria-hidden", "false");
      renderStaffTracking();
      el("staffPickupCode").focus();
      return;
    }
    if (pendingOrders.has(folio)) return;
    pendingOrders.add(folio);
    button.disabled = true;
    try {
      await request(
        "admin/orders/" +
          encodeURIComponent(button.dataset.advanceOrder) +
          "/status",
        "PATCH",
        { status: button.dataset.nextStatus },
      );
      await orders();
      message(
        "Estado actualizado. El cliente verá el cambio en su seguimiento.",
      );
    } catch (err) {
      message(err.message, true);
      button.disabled = false;
    } finally {
      pendingOrders.delete(folio);
      renderStaffOrders();
    }
  });
  el("staffOrderFilters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-order-filter]");
    if (!button) return;
    orderFilter = button.dataset.orderFilter;
    renderOrderFilters();
    renderStaffOrders();
  });
  el("staffPickupForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = el("staffConfirmPickup"),
      folio = trackingFolio;
    if (button.disabled) return;
    const code = el("staffPickupCode").value.trim();
    if (!/^\d{4}$/.test(code)) {
      el("staffPickupMessage").textContent =
        "Escribe los 4 dígitos que te muestra el repartidor.";
      return;
    }
    button.disabled = true;
    el("staffPickupMessage").textContent = "Verificando código de retiro…";
    try {
      await request(
        "admin/orders/" + encodeURIComponent(folio) + "/pickup",
        "POST",
        { code },
      );
      el("staffPickupCode").value = "";
      el("staffPickupMessage").textContent =
        "Retiro verificado. El pedido salió de la tienda.";
      await orders();
      message("Retiro confirmado con el código del repartidor.");
    } catch (error) {
      el("staffPickupMessage").textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });
  function clearDeliveryAccess() {
    el("staffDeliveryLinkBox").classList.add("hidden");
    el("staffDeliveryLink").value = "";
    el("staffDeliveryQr").removeAttribute("src");
    el("staffOpenDeliveryLink").removeAttribute("href");
  }
  el("staffGenerateDeliveryLink").addEventListener("click", async () => {
    const button = el("staffGenerateDeliveryLink"),
      folio = trackingFolio;
    if (!folio || generatingDeliveryAccess) return;
    generatingDeliveryAccess = true;
    button.disabled = true;
    try {
      const data = await request(
        "admin/orders/" + encodeURIComponent(folio) + "/delivery-link",
        "POST",
        {},
      );
      if (
        folio !== trackingFolio ||
        !el("staffTrackingModal").classList.contains("open")
      )
        return;
      const link = new URL(data.linkUrl);
      el("staffDeliveryLink").value = link.href;
      el("staffOpenDeliveryLink").href = link.href;
      el("staffDeliveryQr").src = data.qrImage;
      el("staffDeliveryLocalHint").classList.toggle(
        "hidden",
        !["localhost", "127.0.0.1", "[::1]"].includes(link.hostname),
      );
      el("staffDeliveryLinkBox").classList.remove("hidden");
      await orders();
      message("QR y enlace listos para el repartidor de este pedido.");
    } catch (error) {
      message(error.message, true);
    } finally {
      generatingDeliveryAccess = false;
      renderStaffTracking();
    }
  });
  el("staffCopyDeliveryLink").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(el("staffDeliveryLink").value);
      message("Enlace copiado.");
    } catch {
      el("staffDeliveryLink").select();
      message("Selecciona y copia el enlace privado del pedido.");
    }
  });
  el("staffEditDestination").addEventListener("click", async () => {
    if (typeof L === "undefined") {
      message("No se pudo cargar el mapa. Revisa tu conexión.", true);
      return;
    }
    const order = staffOrders.find((item) => item.folio === trackingFolio);
    if (!order) return;
    el("staffDestinationEditor").classList.remove("hidden");
    destinationPoint = null;
    el("staffSaveDestination").disabled = true;
    if (!destinationMap) {
      destinationMap = L.map(el("staffDestinationMap"));
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
      }).addTo(destinationMap);
      destinationMap.on("click", (event) => {
        destinationPoint = event.latlng;
        if (destinationMarker) destinationMarker.setLatLng(destinationPoint);
        else
          destinationMarker = L.marker(destinationPoint).addTo(destinationMap);
        el("staffSaveDestination").disabled = false;
      });
    }
    let point = order.coords?.split(",").map(Number);
    if (!point && typeof geocodeAddress === "function") {
      const result = await geocodeAddress(order.address);
      if (result) point = [result.lat, result.lng];
    }
    if (order.folio !== trackingFolio) return;
    destinationMap.setView(point || [19.8603, -98.9764], point ? 16 : 13);
    destinationMap.invalidateSize();
    if (point) {
      if (destinationMarker) destinationMarker.setLatLng(point);
      else destinationMarker = L.marker(point).addTo(destinationMap);
    }
  });
  el("staffSaveDestination").addEventListener("click", async () => {
    if (!destinationPoint) return;
    const button = el("staffSaveDestination");
    button.disabled = true;
    try {
      await request(
        "admin/orders/" + encodeURIComponent(trackingFolio) + "/destination",
        "PATCH",
        {
          coords:
            destinationPoint.lat.toFixed(6) +
            "," +
            destinationPoint.lng.toFixed(6),
        },
      );
      el("staffDestinationEditor").classList.add("hidden");
      await orders();
      message("Punto de entrega guardado.");
    } catch (error) {
      message(error.message, true);
      button.disabled = false;
    }
  });
  el("refreshOrders").addEventListener("click", () =>
    orders().catch((err) => message(err.message, true)),
  );
  el("refreshRefunds").addEventListener("click", () =>
    refunds().catch((err) => message(err.message, true)),
  );
  el("staffRefundList").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-refund-id]");
    if (!button) return;
    const checks = button
      .closest("article")
      .querySelector("[data-evidence-checks]");
    const evidenceChecks = checks
      ? Object.fromEntries(
          Array.from(checks.querySelectorAll("[data-evidence-check]")).map(
            (input) => [input.dataset.evidenceCheck, input.checked],
          ),
        )
      : null;
    if (
      button.dataset.refundStatus === "APROBADO" &&
      evidenceChecks &&
      Object.values(evidenceChecks).some((value) => value !== true)
    ) {
      message(
        "Revisa la foto y confirma las tres casillas antes de aprobar, o pide otra foto si falta evidencia.",
        true,
      );
      return;
    }
    const status = button.dataset.refundStatus,
      note = prompt(
        status === "REEMBOLSADO"
          ? "Describe la devolución que ya realizaste o simulaste:"
          : status === "FOTO_REQUERIDA"
            ? "Indica qué debe corregir el cliente en la nueva foto:"
            : "Explica al cliente el motivo de tu decisión:",
      );
    if (note === null) return;
    let paymentReference = "";
    if (status === "REEMBOLSADO") {
      paymentReference = prompt("Referencia del comprobante de devolución:");
      if (paymentReference === null) return;
    }
    button.disabled = true;
    try {
      await request(
        "admin/refunds/" + encodeURIComponent(button.dataset.refundId),
        "PATCH",
        { status, note, paymentReference, evidenceChecks },
      );
      await refunds();
      message("Estado de la solicitud guardado.");
    } catch (error) {
      message(error.message, true);
      button.disabled = false;
    }
  });
  el("staffLogout").addEventListener("click", async () => {
    try {
      await request("logout", "POST");
      [
        "tizafood_user",
        "tizafood_orders",
        "tizafood_cart",
        "tizafood_favs",
      ].forEach((k) => localStorage.removeItem(k));
      location.reload();
    } catch (err) {
      message(err.message, true);
    }
  });
  let imageSelection = 0,
    imageBusy = false;
  function showProductImage(name = "Imagen guardada") {
    const image = FoodManagement.imagePath(el("productImg").value);
    if (image) el("productImg").value = image;
    if (image) el("productImagePreview").src = image;
    else el("productImagePreview").removeAttribute("src");
    el("productImagePreview").classList.toggle("hidden", !image);
    el("removeProductImage").classList.toggle("hidden", !image);
    el("productImageName").textContent = image
      ? name
      : "Sin imagen seleccionada";
    el("productImageError").textContent = "";
  }
  function resetImageSelection() {
    imageSelection++;
    imageBusy = false;
    el("productImageFile").value = "";
    showProductImage();
  }
  el("chooseProductImage").addEventListener("click", () =>
    el("productImageFile").click(),
  );
  el("removeProductImage").addEventListener("click", () => {
    el("productImg").value = "";
    resetImageSelection();
  });
  el("productImageFile").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const selection = ++imageSelection;
    imageBusy = true;
    el("productImageError").textContent = "Preparando imagen…";
    let url = "";
    try {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
        throw Error("Elige una imagen JPG, PNG o WEBP.");
      if (file.size > 10 * 1024 * 1024)
        throw Error("Elige una imagen de hasta 10 MB.");
      url = URL.createObjectURL(file);
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () =>
          reject(Error("No se pudo abrir esa imagen. Elige otra."));
        image.src = url;
      });
      const scale = Math.min(
        1,
        640 / Math.max(image.naturalWidth, image.naturalHeight),
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      let data = canvas.toDataURL("image/jpeg", 0.8);
      if (data.length > 220000) data = canvas.toDataURL("image/jpeg", 0.5);
      if (!FoodManagement.validImage(data))
        throw Error("Esta imagen es demasiado pesada. Elige otra más pequeña.");
      if (selection !== imageSelection) return;
      el("productImg").value = data;
      showProductImage(file.name);
    } catch (error) {
      if (selection === imageSelection)
        el("productImageError").textContent = error.message;
    } finally {
      if (url) URL.revokeObjectURL(url);
      if (selection === imageSelection) {
        imageBusy = false;
        e.target.value = "";
      }
    }
  });
  el("cancelProduct").addEventListener("click", () => {
    el("productForm").reset();
    el("productId").value = "";
    el("productImg").value = "";
    resetImageSelection();
    message("Nuevo producto.");
  });
  el("staffProductList").addEventListener("click", async (e) => {
    const stock = e.target.closest("[data-toggle-stock]");
    if (stock) {
      const product = products.find(
        (p) => p.id === Number(stock.dataset.toggleStock),
      );
      if (!product) return;
      stock.disabled = true;
      try {
        await request(
          "admin/products/" + product.id + "/availability",
          "PATCH",
          { soldOut: !product.soldOut },
        );
        await productList();
        message("Disponibilidad actualizada.");
      } catch (err) {
        message(err.message, true);
        stock.disabled = false;
      }
      return;
    }
    const edit = e.target.closest("[data-edit-product]"),
      del = e.target.closest("[data-delete-product]");
    if (edit) {
      const p = products.find((p) => p.id === Number(edit.dataset.editProduct));
      if (!p) return;
      for (const [id, key] of [
        ["Id", "id"],
        ["Name", "name"],
        ["Cat", "cat"],
        ["Price", "price"],
        ["Img", "img"],
        ["Desc", "desc"],
      ])
        el("product" + id).value = p[key] || "";
      resetImageSelection();
      el("productName").focus();
      el("productForm").scrollIntoView({ behavior: "smooth" });
    }
    if (del && confirm("¿Quitar este producto del menú?")) {
      try {
        await request("admin/products/" + del.dataset.deleteProduct, "DELETE");
        await productList();
        message("Producto eliminado.");
      } catch (err) {
        message(err.message, true);
      }
    }
  });
  el("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (imageBusy) {
      message("Espera a que termine de prepararse la imagen.", true);
      return;
    }
    const button = e.submitter;
    button.disabled = true;
    try {
      const id = el("productId").value;
      await request(
        "admin/products" + (id ? "/" + id : ""),
        id ? "PUT" : "POST",
        {
          name: el("productName").value,
          cat: el("productCat").value,
          price: Number(el("productPrice").value),
          img: el("productImg").value,
          desc: el("productDesc").value,
        },
      );
      el("productForm").reset();
      el("productId").value = "";
      el("productImg").value = "";
      resetImageSelection();
      await productList();
      message(
        "Producto guardado. Los clientes verán el cambio al volver a abrir o recargar la tienda.",
      );
    } catch (err) {
      message(err.message, true);
    } finally {
      button.disabled = false;
    }
  });
  el("employeeForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (el("employeePassword").value !== el("employeePasswordConfirm").value) {
      message("Las contraseñas del empleado no coinciden.", true);
      el("employeePasswordConfirm").focus();
      return;
    }
    const button = e.submitter;
    button.disabled = true;
    try {
      await request("admin/employees", "POST", {
        name: el("employeeName").value,
        username: el("employeeUsername").value,
        password: el("employeePassword").value,
      });
      el("employeeForm").reset();
      await employees();
      message(
        "Empleado creado en Firebase. Ya puede entrar con su correo y contraseña.",
      );
    } catch (err) {
      message(err.message, true);
    } finally {
      button.disabled = false;
    }
  });
  el("authConnectionNotice").classList.toggle(
    "hidden",
    location.protocol !== "file:" || window.localSchoolDemo === true,
  );
  if (location.protocol !== "file:" || window.localSchoolDemo === true)
    request("setup-status")
      .then((data) =>
        el("btnOwnerSetup").classList.toggle("hidden", !data.needsOwner),
      )
      .catch(() => {});
})();
