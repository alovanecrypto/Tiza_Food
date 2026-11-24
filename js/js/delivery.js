const crypto = require("node:crypto");
const Management = require("./management");
const qrCode = require("./qrcode-generator");
const fail = (status, message) => {
  throw Object.assign(Error(message), { status });
};
const coordinates = (value) => {
  if (
    typeof value !== "string" ||
    !/^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/.test(value)
  )
    return null;
  const [lat, lng] = value.split(",").map(Number);
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null;
};
function distance(a, b) {
  const r = (x) => (x * Math.PI) / 180;
  const dlat = r(b.lat - a.lat),
    dlng = r(b.lng - a.lng);
  const value =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dlng / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(Math.min(1, value)));
}
function withHandoff(order) {
  const status = Management.statusOf(order);
  if (
    ["Entregado", "Cancelado"].includes(status) ||
    order.handoff?.required === true
  )
    return order;
  const pickup = crypto.randomInt(10000);
  const code = (value) => String(value).padStart(4, "0");
  return {
    ...order,
    trackingMode:
      status === "En camino"
        ? order.deliveryGps
          ? "gps"
          : "dispatch"
        : "manual",
    handoff: {
      required: true,
      version: 1,
      pickup: {
        ...(status === "En camino"
          ? { legacyReleased: true }
          : { code: code(pickup) }),
      },
      delivery: { code: code((pickup + crypto.randomInt(1, 10000)) % 10000) },
    },
  };
}
function publicOrder(order, staff = false, now = Date.now()) {
  const { deliveryGps, handoff, receiptJob, ...out } = order;
  if (!staff && receiptJob?.state) out.receiptStatus = receiptJob.state;
  if (handoff?.required)
    out.handoff = {
      required: true,
      pickupVerified: !!handoff.pickup?.verifiedAt,
      pickupReleased:
        !!handoff.pickup?.verifiedAt || !!handoff.pickup?.legacyReleased,
      deliveryVerified: !!handoff.delivery?.verifiedAt,
      riderArrived:
        Management.statusOf(order) === "En camino" &&
        !!handoff.delivery?.arrivalNoticeAt,
      ...(!staff &&
      Management.statusOf(order) === "En camino" &&
      !handoff.delivery?.verifiedAt
        ? { deliveryCode: handoff.delivery?.code }
        : {}),
    };
  if (!deliveryGps) return out;
  const fresh =
    !!deliveryGps.location &&
    !deliveryGps.stoppedAt &&
    now - deliveryGps.location.at <= 90000 &&
    Management.statusOf(order) === "En camino";
  out.delivery = {
    enabled: true,
    fresh,
    mapUnlocked: !!deliveryGps.mapUnlockedAt,
    ...(fresh && (staff || deliveryGps.mapUnlockedAt)
      ? { location: deliveryGps.location }
      : {}),
    ...(staff ? { expiresAt: deliveryGps.expiresAt } : {}),
  };
  return out;
}
module.exports = function delivery({
  current,
  readDB,
  writeDB,
  readBody,
  send,
  deliveryOrigin,
}) {
  const limits = new Map();
  function rate(req) {
    const now = Date.now(),
      key = req.socket?.remoteAddress || "local";
    for (const [ip, row] of limits) if (now - row.at > 60000) limits.delete(ip);
    if (limits.size > 5000) fail(429, "Espera un momento.");
    const row = limits.get(key) || { at: now, count: 0 };
    if (++row.count > 120)
      fail(429, "Espera un minuto antes de volver a intentar.");
    limits.set(key, row);
  }
  const hash = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");
  function find(db, token) {
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token))
      fail(401, "El enlace del reparto no es válido.");
    const digest = hash(token);
    const order = (db.orders || []).find(
      (o) => o.deliveryGps?.tokenHash === digest,
    );
    if (!order || order.deliveryGps.expiresAt <= Date.now())
      fail(401, "El enlace del reparto venció o fue reemplazado.");
    return order;
  }
  function verifyCode(order, kind, supplied, db, by) {
    const record = order.handoff?.[kind],
      now = Date.now();
    if (!order.handoff?.required || !record)
      fail(409, "Actualiza el pedido para preparar sus códigos.");
    if (record.verifiedAt || record.legacyReleased)
      fail(409, "Este código ya se utilizó.");
    if (record.blockedUntil > now)
      fail(
        429,
        "Se agotaron los intentos. Espera 15 minutos antes de volver a intentar.",
      );
    if (record.blockedUntil) {
      record.attempts = 0;
      delete record.blockedUntil;
    }
    const value = typeof supplied === "string" ? supplied.trim() : "";
    const valid =
      /^\d{4}$/.test(value) &&
      typeof record.code === "string" &&
      crypto.timingSafeEqual(
        Buffer.from(hash(value), "hex"),
        Buffer.from(hash(record.code), "hex"),
      );
    if (!valid) {
      record.attempts = (record.attempts || 0) + 1;
      if (record.attempts >= 5) record.blockedUntil = now + 15 * 60000;
      writeDB(db);
      fail(
        record.blockedUntil ? 429 : 400,
        record.blockedUntil
          ? "Se agotaron los intentos. Espera 15 minutos antes de volver a intentar."
          : "El código no coincide con este pedido. Revisa los 4 dígitos.",
      );
    }
    record.verifiedAt = now;
    record.verifiedBy = by;
    record.attempts = 0;
    delete record.code;
    delete record.blockedUntil;
  }
  return {
    async handler(req, res, url) {
      const pickupRoute = url.pathname.match(
        /^\/api\/admin\/orders\/([^/]+)\/pickup$/,
      );
      if (pickupRoute && req.method === "POST") {
        const user = current(req);
        if (!user) fail(401, "Inicia sesión.");
        if (!["dueno", "empleado"].includes(user.role))
          fail(403, "No tienes permiso.");
        const body = await readBody(req),
          db = readDB(),
          index = (db.orders || []).findIndex(
            (o) => o.folio === decodeURIComponent(pickupRoute[1]),
          );
        if (index < 0) fail(404, "Pedido no encontrado.");
        const order = db.orders[index];
        if (Management.statusOf(order) !== "Listo para enviar")
          fail(409, "El pedido debe estar listo para retirar.");
        verifyCode(order, "pickup", body.code, db, user.name || user.email);
        db.orders[index] = Management.advance(order, "En camino", user.name);
        writeDB(db);
        send(res, 200, {
          ok: true,
          order: publicOrder(db.orders[index], true),
        });
        return true;
      }
      const link = url.pathname.match(
        /^\/api\/admin\/orders\/([^/]+)\/delivery-link$/,
      );
      if (link && req.method === "POST") {
        const user = current(req);
        if (!user) fail(401, "Inicia sesión.");
        if (!["dueno", "empleado"].includes(user.role))
          fail(403, "No tienes permiso.");
        await readBody(req);
        const db = readDB(),
          order = (db.orders || []).find(
            (o) => o.folio === decodeURIComponent(link[1]),
          );
        if (!order) fail(404, "Pedido no encontrado.");
        if (
          !["Listo para enviar", "En camino"].includes(
            Management.statusOf(order),
          )
        )
          fail(
            409,
            "Marca el pedido como listo para generar el enlace del repartidor.",
          );
        const token = crypto.randomBytes(32).toString("hex"),
          expiresAt = Date.now() + 2 * 3600000;
        const path = "/reparto.html#token=" + token;
        const linkUrl = new URL(path, deliveryOrigin(req)).href;
        const qr = qrCode(0, "M");
        qr.addData(linkUrl);
        qr.make();
        const qrImage = qr.createDataURL(4, 16);
        order.deliveryGps = {
          tokenHash: hash(token),
          expiresAt,
          issuedAt: Date.now(),
          issuedBy: user.email,
        };
        if (Management.statusOf(order) === "En camino")
          order.trackingMode = "gps";
        writeDB(db);
        send(res, 200, { path, linkUrl, qrImage, expiresAt });
        return true;
      }
      const destination = url.pathname.match(
        /^\/api\/admin\/orders\/([^/]+)\/destination$/,
      );
      if (destination && req.method === "PATCH") {
        const user = current(req);
        if (!user) fail(401, "Inicia sesión.");
        if (!["dueno", "empleado"].includes(user.role))
          fail(403, "No tienes permiso.");
        const body = await readBody(req),
          point = coordinates(body.coords);
        if (!point) fail(400, "Selecciona un punto válido en el mapa.");
        const db = readDB(),
          order = (db.orders || []).find(
            (o) => o.folio === decodeURIComponent(destination[1]),
          );
        if (!order) fail(404, "Pedido no encontrado.");
        if (
          ![
            "Recibido",
            "En preparación",
            "Listo para enviar",
            "En camino",
          ].includes(Management.statusOf(order))
        )
          fail(409, "Este pedido ya finalizó.");
        order.coords = point.lat.toFixed(6) + "," + point.lng.toFixed(6);
        if (order.deliveryGps) {
          delete order.deliveryGps.mapUnlockedAt;
          delete order.deliveryGps.arrivedAt;
        }
        writeDB(db);
        send(res, 200, { ok: true });
        return true;
      }
      if (
        ![
          "/api/delivery/info",
          "/api/delivery/start",
          "/api/delivery/location",
          "/api/delivery/stop",
          "/api/delivery/arrive",
          "/api/delivery/confirm",
        ].includes(url.pathname)
      )
        return false;
      if (req.method !== "POST") fail(405, "Método no permitido.");
      rate(req);
      const body = await readBody(req),
        db = readDB(),
        order = find(db, body.token),
        gps = order.deliveryGps;
      if (url.pathname === "/api/delivery/info") {
        send(res, 200, {
          folio: order.folio,
          address: order.address,
          coords: order.coords,
          status: Management.statusOf(order),
          pickupCode:
            Management.statusOf(order) === "Listo para enviar" &&
            !order.handoff?.pickup?.verifiedAt
              ? order.handoff?.pickup?.code
              : undefined,
          pickupReleased:
            !!order.handoff?.pickup?.verifiedAt ||
            !!order.handoff?.pickup?.legacyReleased,
          requiresDeliveryCode: !!order.handoff?.required,
          riderArrived:
            Management.statusOf(order) === "En camino" &&
            !!order.handoff?.delivery?.arrivalNoticeAt,
          expiresAt: gps.expiresAt,
        });
        return true;
      }
      if (
        url.pathname === "/api/delivery/confirm" &&
        Management.statusOf(order) === "Entregado" &&
        order.handoff?.delivery?.verifiedAt
      ) {
        send(res, 200, { ok: true, status: "Entregado" });
        return true;
      }
      if (Management.statusOf(order) !== "En camino")
        fail(409, "El pedido ya no está en reparto. Se detuvo la ubicación.");
      if (url.pathname === "/api/delivery/arrive") {
        const handoff = order.handoff;
        if (
          !handoff?.delivery ||
          (!handoff.pickup?.verifiedAt && !handoff.pickup?.legacyReleased)
        )
          fail(409, "Primero debe confirmarse el retiro en la tienda.");
        if (!handoff.delivery.arrivalNoticeAt) {
          handoff.delivery.arrivalNoticeAt = Date.now();
          writeDB(db);
        }
        send(res, 200, { ok: true, riderArrived: true });
        return true;
      }
      if (url.pathname === "/api/delivery/confirm") {
        if (
          !order.handoff?.pickup?.verifiedAt &&
          !order.handoff?.pickup?.legacyReleased
        )
          fail(409, "Primero debe confirmarse el retiro en la tienda.");
        verifyCode(order, "delivery", body.code, db, "Repartidor");
        const delivered = Management.advance(
          order,
          "Entregado",
          "Repartidor · código del cliente verificado",
        );
        delivered.deliveryGps.stoppedAt = Date.now();
        delete delivered.deliveryGps.sharingHash;
        delete delivered.deliveryGps.location;
        delete delivered.deliveryGps.arrivedAt;
        db.orders[db.orders.findIndex((o) => o.folio === order.folio)] =
          delivered;
        writeDB(db);
        send(res, 200, { ok: true, status: "Entregado" });
        return true;
      }
      if (url.pathname === "/api/delivery/start") {
        if (!coordinates(order.coords))
          fail(
            409,
            "El empleado debe marcar el punto de entrega para activar el GPS.",
          );
        const sharingId = crypto.randomBytes(24).toString("hex");
        gps.sharingHash = hash(sharingId);
        delete gps.stoppedAt;
        delete gps.arrivedAt;
        writeDB(db);
        send(res, 200, { sharingId });
        return true;
      }
      if (url.pathname === "/api/delivery/stop") {
        gps.stoppedAt = Date.now();
        delete gps.arrivedAt;
        delete gps.sharingHash;
        writeDB(db);
        send(res, 200, { ok: true });
        return true;
      }
      if (
        typeof body.sharingId !== "string" ||
        hash(body.sharingId) !== gps.sharingHash ||
        gps.stoppedAt
      )
        fail(
          409,
          "La ubicación dejó de compartirse. Pulsa Compartir mi ubicación para continuar.",
        );
      const { lat, lng, accuracy } = body;
      if (
        ![lat, lng, accuracy].every(Number.isFinite) ||
        Math.abs(lat) > 90 ||
        Math.abs(lng) > 180 ||
        accuracy < 0 ||
        accuracy > 10000
      )
        fail(400, "La ubicación recibida no es válida.");
      const now = Date.now(),
        target = coordinates(order.coords);
      gps.location = { lat, lng, accuracy, at: now };
      delete gps.stoppedAt;
      const meters = target ? distance({ lat, lng }, target) : Infinity;
      if (accuracy <= 100 && meters <= 300) gps.mapUnlockedAt ||= now;
      if (accuracy <= 30 && meters <= 50) gps.arrivedAt ||= now;
      else delete gps.arrivedAt;
      writeDB(db);
      send(res, 200, {
        ok: true,
        near: meters <= 300 && accuracy <= 100,
        arriving: !!gps.arrivedAt,
      });
      return true;
    },
  };
};
module.exports.publicOrder = publicOrder;
module.exports.coordinates = coordinates;
module.exports.distance = distance;
module.exports.withHandoff = withHandoff;
