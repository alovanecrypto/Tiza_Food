/* =====================================================
   Tiza Food - Servidor local (sin dependencias)
   Uso:  node server.js   ->  abre http://localhost:3000
   ===================================================== */
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const Delivery = require("./js/delivery");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DEMO_TRACKING = process.env.TIZA_DEMO_TRACKING !== "0";
const publicURL = process.env.TIZA_PUBLIC_ORIGIN
  ? new URL(process.env.TIZA_PUBLIC_ORIGIN)
  : null;
if (publicURL && publicURL.protocol !== "https:")
  throw Error("TIZA_PUBLIC_ORIGIN debe usar HTTPS.");
const secure = (req) =>
  !!req.socket?.encrypted ||
  !!(publicURL && req.headers.host === publicURL.host);
const contentPolicy = [
  "default-src 'self'",
  "script-src 'self' https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://unpkg.com",
  "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://postali.app https://nominatim.openstreetmap.org",
  "frame-src https://maps.google.com https://www.google.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
].join("; ");

// En Render los datos viven en un disco separado del código. Localmente se
// mantiene la carpeta data/ para que el proyecto siga abriendo igual.
const SEED_DATA_DIR = path.join(ROOT, "data");
const DATA_DIR = process.env.TIZA_DATA_DIR
  ? path.resolve(process.env.TIZA_DATA_DIR)
  : SEED_DATA_DIR;
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
for (const name of ["db", "usuarios"]) {
  const localFile = path.join(DATA_DIR, name + ".json");
  const example = path.join(SEED_DATA_DIR, name + ".example.json");
  if (!fs.existsSync(localFile) && fs.existsSync(example))
    fs.copyFileSync(example, localFile, fs.constants.COPYFILE_EXCL);
}
const DB_FILE = path.join(DATA_DIR, "db.json");
const USERS_FILE = path.join(DATA_DIR, "usuarios.json");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp3": "audio/mpeg",
};
const PRIVATE = new Set([
  "/db.json",
  "/usuarios.json",
  "/resenas.json",
  "/server.js",
  "/access.js",
  "/reviews.js",
]);
const PUBLIC_SCRIPTS = new Set([
  "app.js",
  "admin.js",
  "branches.js",
  "delivery-ui.js",
  "privacy.js",
  "hours.js",
  "management.js",
  "firebase-config.js",
  "firebase-auth.js",
  "firebase-session.js",
  "firebase-email.js",
  "notifications.js",
  "postal-code.js",
  "password-reset.js",
  "panel-animations.js",
  "captcha-ui.js",
  "review-moderation.js",
  "review-safety-ui.js",
  "server-entry.js",
  "carousels.js",
  "support-ui.js",
  "help.js",
]);

const readDB = () => {
  let db;
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, "utf8").replace(/^\uFEFF/, ""));
  } catch (error) {
    throw Error(
      "No se pudo leer data/db.json. Se conserva sin reemplazar tus pedidos.",
    );
  }
  db.tracking = {
    demo: DEMO_TRACKING,
    stageSeconds: FoodManagement.demoStageSeconds.slice(),
  };
  const previous = db.orders || [],
    now = Date.now(),
    updated = previous.map((order) =>
      FoodManagement.autoAdvance(
        Delivery.withHandoff(order),
        now,
        DEMO_TRACKING,
      ),
    );
  if (updated.some((order, index) => order !== previous[index])) {
    db.orders = updated;
    writeDB(db);
  }
  return db;
};
function writeDB(db) {
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}
const send = (res, code, data) => {
  res.writeHead(code, {
    "Content-Type": TYPES[".json"],
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
};
const clean = (v, n) => String(v == null ? "" : v).slice(0, n);

function readBody(req) {
  return new Promise((resolve, reject) => {
    const max = 1000000;
    const tooLarge = () =>
      reject(
        Object.assign(Error("La solicitud es demasiado grande."), {
          status: 413,
        }),
      );
    if (Number(req.headers["content-length"]) > max) {
      req.resume();
      return tooLarge();
    }
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      if (size > max) return;
      size += chunk.length;
      if (size <= max) chunks.push(chunk);
      else {
        chunks.length = 0;
        tooLarge();
      }
    });
    req.on("end", () => {
      if (size > max) return;
      try {
        const body = size
          ? JSON.parse(Buffer.concat(chunks).toString("utf8"))
          : {};
        if (!body || typeof body !== "object" || Array.isArray(body))
          throw Error();
        resolve(body);
      } catch {
        reject(
          Object.assign(Error("Envía un objeto JSON válido."), { status: 400 }),
        );
      }
    });
    req.on("error", reject);
  });
}

function publicDB(db, me) {
  // Solo el catálogo es público; los nuevos campos privados no se publican por defecto.
  const out = {};
  for (const key of ["products", "promos", "extras", "hours", "tracking"])
    if (db[key] !== undefined) out[key] = db[key];
  if (db.transfer)
    out.transfer = {
      bank: db.transfer.bank || "",
      holder: db.transfer.holder || "",
      clabe: db.transfer.clabe || "",
      demo: db.transfer.demo === true,
    };
  out.branches = Branches.catalog;
  out.reviews = reviews.public(db, me);
  return out;
}

const FoodManagement = require("./js/management");
const Branches = require("./js/branches");
const reviews = require("./js/reviews")(DATA_DIR, readDB());
const access = require("./js/access")(__dirname, {
  secure,
  send,
  readBody,
  readDB,
  writeDB,
  reviews,
  dataDir: DATA_DIR,
});
const support = require("./js/support")(__dirname, {
  send,
  readBody,
  readDB,
  current: access.current,
  dataDir: DATA_DIR,
});
const delivery = Delivery({
  send,
  readBody,
  readDB,
  writeDB,
  current: access.current,
  deliveryOrigin: (req) =>
    publicURL?.origin ||
    (secure(req) ? "https://" : "http://") + req.headers.host,
});
const receipts = require("./js/receipt-email")(__dirname, { readDB, writeDB });
const orderInput = require("./js/order-input");
async function api(req, res, url) {
  if (await delivery.handler(req, res, url)) return;
  if (await support.handler(req, res, url)) return;
  if (url.pathname === "/api/admin/receipts/status" && req.method === "GET") {
    const user = access.current(req);
    if (!user) return send(res, 401, { error: "Inicia sesión." });
    if (user.role !== "dueno")
      return send(res, 403, { error: "Solo el dueño puede consultar tickets." });
    return send(res, 200, receipts.status());
  }
  if (await access.handler(req, res, url)) return;
  if (req.method === "POST" && url.pathname === "/api/admin/receipts/retry") {
    const user = access.current(req);
    if (!user) return send(res, 401, { error: "Inicia sesión." });
    if (user.role !== "dueno")
      return send(res, 403, { error: "Solo el dueño puede reintentar tickets." });
    const queued = receipts.retryFailed();
    return send(res, 200, { queued, receiptStatus: receipts.status() });
  }
  const db = readDB();
  if (req.method === "GET" && url.pathname === "/api/coupons/eligibility") {
    const customer = access.current(req);
    if (!customer)
      return send(res, 401, { error: "Inicia sesión para usar cupones." });
    return send(res, 200, {
      firstPurchase: FoodManagement.firstPurchaseEligible(db, customer),
    });
  }
  if (req.method === "GET" && url.pathname === "/api/db") {
    const out = publicDB(db, access.current(req));
    return send(res, 200, out);
  }

  if (req.method === "GET" && url.pathname === "/api/reviews")
    return send(res, 200, { reviews: reviews.public(db, access.current(req)) });
  if (req.method === "GET" && url.pathname === "/api/reviews/eligible")
    return send(res, 200, {
      products: reviews.eligible(db, access.current(req)),
    });
  if (req.method === "POST" && url.pathname === "/api/reviews") {
    const b = await readBody(req);
    const me = access.current(req);
    reviews.assertPosting(me);
    access.consumeReviewCaptcha(req, b);
    const review = reviews.create(readDB(), me, b);
    return send(res, 201, { ok: true, review });
  }

  const del = url.pathname.match(/^\/api\/reviews\/([^/]+)$/);
  if (req.method === "DELETE" && del) {
    const id = decodeURIComponent(del[1]);
    const me = access.current(req);
    reviews.remove(me, id);
    return send(res, 200, { ok: true });
  }

  if (req.method === "POST" && url.pathname === "/api/orders") {
    const customer = access.current(req);
    if (!customer)
      return send(res, 401, { error: "Inicia sesión para pedir." });
    if (customer.role !== "cliente")
      return send(res, 403, { error: "Esta opción es para clientes." });
    const b = await readBody(req);
    if (typeof b.folio !== "string" || !/^[\p{L}\p{N}_-]{1,64}$/u.test(b.folio))
      return send(res, 400, { error: "pedido inválido" });
    const db = readDB();
    const previous = (db.orders || []).find((o) => o.folio === b.folio);
    if (previous && previous.owner !== customer.email)
      return send(res, 403, { error: "Pedido de otra cuenta." });
    if (!previous && b.cancelled === true)
      return send(res, 404, { error: "Pedido no encontrado." });
    if (previous && (b.cancelled !== true || previous.cancelled))
      return send(res, 201, {
        ok: true,
        order: Delivery.publicOrder(previous),
      });
    if (
      !previous &&
      (db.orders || []).filter(
        (order) =>
          order.owner === customer.email && order.ts > Date.now() - 3600000,
      ).length >= 12
    ) {
      return send(res, 429, {
        error: "Alcanzaste el límite de pedidos por hora.",
      });
    }
    const input = previous ? { cancelled: true } : orderInput(b, db, customer);
    const compensation = previous
      ? null
      : support.discount(db, customer, input.couponCode);
    if (!previous) {
      Object.assign(
        input,
        FoodManagement.pricing(
          input.items,
          input.fee,
          input.couponCode,
          compensation,
        ),
      );
      if (
        b.expectedTotal !== undefined &&
        (typeof b.expectedTotal !== "number" ||
          Math.round(b.expectedTotal * 100) !== Math.round(input.total * 100))
      )
        return send(res, 409, {
          code: "ORDER_PRICE_CHANGED",
          error:
            "Cambió el precio del pedido. Revisa el total actualizado antes de confirmar.",
        });
      if (
        !["Efectivo", "Transferencia", "Tarjeta", "Saldo a favor"].includes(
          b.payment?.method,
        )
      )
        return send(res, 400, {
          error: "Selecciona un método de pago válido.",
        });
    }
    const walletPayment = previous
      ? null
      : support.walletQuote(db, customer, input.total, b.useWallet === true);
    if (
      !previous &&
      b.useWallet === true &&
      (typeof b.expectedWalletApplied !== "number" ||
        Math.round(b.expectedWalletApplied * 100) !==
          Math.round(walletPayment.walletApplied * 100))
    )
      return send(res, 409, {
        error: "Tu saldo cambió. Actualiza el pedido antes de confirmar.",
      });
    if (
      !previous &&
      walletPayment.walletApplied > 0 &&
      walletPayment.amountDue > 0 &&
      b.payment?.method !== "Efectivo"
    )
      return send(res, 400, {
        error:
          "Completa en efectivo la diferencia de este pedido con saldo a favor.",
      });
    if (
      !previous &&
      b.payment?.method === "Saldo a favor" &&
      !(walletPayment.walletApplied > 0 && walletPayment.amountDue === 0)
    )
      return send(res, 400, {
        error:
          "El saldo debe cubrir todo el pedido para usar ese método de pago.",
      });

    let payment = previous
      ? previous.payment
      : b.payment
        ? {
            method: clean(b.payment.method, 20),
            brand: clean(b.payment.brand, 20),
            last4: clean(b.payment.last4, 4),
            demo: true,
            status:
              b.payment.method === "Efectivo"
                ? "Pendiente de cobro simulado"
                : b.payment.method === "Transferencia"
                  ? "Pendiente de verificación "
                  : "Pago simulado",
          }
        : null;
    if (
      !previous &&
      walletPayment.walletApplied > 0 &&
      walletPayment.amountDue === 0
    )
      payment = {
        method: "Saldo a favor",
        status: "Cubierto con saldo virtual",
        demo: true,
      };
    if (!previous && payment && payment.method === "Efectivo") {
      const amount = b.payment.cashAmount,
        total = walletPayment.amountDue;
      if (
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !Number.isSafeInteger(Math.round(amount * 100)) ||
        Math.abs(amount * 100 - Math.round(amount * 100)) > 0.00001 ||
        typeof total !== "number" ||
        !Number.isFinite(total) ||
        total < 0 ||
        !Number.isSafeInteger(Math.round(total * 100)) ||
        Math.round(amount * 100) < Math.round(total * 100)
      ) {
        return send(res, 400, {
          error: "La cantidad en efectivo debe ser válida y cubrir el total.",
        });
      }
      payment.cashAmount = Math.round(amount * 100) / 100;
      payment.change =
        (Math.round(amount * 100) - Math.round(total * 100)) / 100;
    }
    if (!previous && payment && payment.method === "Transferencia") {
      const config = db.transfer || {};
      if (
        !String(config.bank || "").trim() ||
        !String(config.holder || "").trim() ||
        (config.demo !== true &&
          !/^\d{18}$/.test(String(config.clabe || "").trim()))
      )
        return send(res, 400, {
          error: "Datos bancarios pendientes de configurar.",
        });
      const reference =
        typeof b.payment.reference === "string"
          ? b.payment.reference.trim()
          : "";
      if (
        reference.length < 3 ||
        reference.length > 100 ||
        /[\u0000-\u001f\u007f]/.test(reference)
      )
        return send(res, 400, {
          error: "Referencia de transferencia inválida.",
        });
      payment.reference = reference;
      payment.demo = true;
    }
    const order = Delivery.withHandoff(
      FoodManagement.accept(
        previous,
        { ...input, payment },
        db,
        customer,
        compensation,
      ),
    );
    if (!previous) {
      Object.assign(order, walletPayment, { useWallet: b.useWallet === true });
      support.spendWallet(db, customer, order);
    } else support.restoreWallet(db, customer, previous, order);
    if (!previous) {
      support.redeem(db, customer, order);
      FoodManagement.rememberPurchase(db, customer);
      receipts.enqueue(order, customer);
    }
    db.orders = [order].concat(
      (db.orders || []).filter((o) => o.folio !== order.folio),
    );
    writeDB(db);
    if (!previous) receipts.kick();
    return send(res, 201, {
      ok: true,
      order: Delivery.publicOrder(order),
    });
  }

  return send(res, 404, { error: "no existe" });
}

function serveStatic(req, res, url) {
  let p;
  try {
    p = decodeURIComponent(url.pathname);
  } catch (error) {
    res.writeHead(400);
    return res.end("Solicitud inválida");
  }
  if (p === "/") p = "/index.html";

  const script = /^\/js\/([^/]+)$/.exec(p);
  const publicAsset =
    p === "/index.html" ||
    p === "/reparto.html" ||
    p === "/privacidad.html" ||
    p === "/terminos.html" ||
    p === "/manifest.webmanifest" ||
    p === "/service-worker.js" ||
    p === "/css/styles.css" ||
    (script && PUBLIC_SCRIPTS.has(script[1])) ||
    /^\/img\/[\p{L}\p{N}_ .-]+\.(?:png|jpg|jpeg|webp|gif|svg|ico)$/iu.test(p) ||
    /^\/audio\/[\w .-]+\.mp3$/iu.test(p);
  if (!["GET", "HEAD"].includes(req.method) || !publicAsset) {
    res.writeHead(404);
    return res.end("No encontrado");
  }

  const segments = p.replace(/\\/g, "/").split("/");
  if (
    segments.some(
      (part) => part.startsWith(".") || part.toLowerCase() === "data",
    ) ||
    /\/(?:support\.js|reembolsos(?:\.example)?\.json|.*\.(?:cmd|ps1))$/i.test(p)
  ) {
    res.writeHead(404);
    return res.end("No encontrado");
  }
  if (
    PRIVATE.has("/" + p.replace(/\\/g, "/").split("/").pop()) ||
    p.endsWith(".tmp")
  ) {
    res.writeHead(404);
    return res.end("No encontrado");
  }
  const file = path.resolve(ROOT, "." + p);
  if (!file.startsWith(ROOT + path.sep)) {
    res.writeHead(403);
    return res.end("Prohibido");
  }
  fs.realpath(file, (pathError, realFile) => {
    if (pathError || !realFile.startsWith(ROOT + path.sep)) {
      res.writeHead(404);
      return res.end("No encontrado");
    }
    fs.readFile(realFile, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end("No encontrado");
      }
      res.writeHead(200, {
        "Content-Type":
          TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(data);
    });
  });
}

const server = http.createServer((req, res) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Content-Security-Policy", contentPolicy);
  res.setHeader("X-Frame-Options", "DENY");
  const host = req.headers.host || "";
  // Render checks this non-sensitive endpoint from its internal network before
  // it accepts the public deployment. All other routes keep the host guard.
  const isHealthCheck = req.method === "GET" && req.url === "/api/health";
  if (
    !isHealthCheck &&
    (
      !/^(?:::1|::ffff:127\.0\.0\.1|127\.0\.0\.1)$/.test(
        req.socket.remoteAddress || "",
      ) ||
      !(
        /^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/i.test(host) ||
        host === publicURL?.host ||
        host === `${publicURL?.host}:${PORT}`
      )
    )
  )
    return send(res, 421, {
      error: "Abre Tiza Food desde su dirección autorizada.",
    });
  if (!req.url?.startsWith("/") || req.url.startsWith("//"))
    return send(res, 400, { error: "Ruta inválida." });
  const url = new URL(req.url, "http://localhost");
  if (url.pathname.startsWith("/api/")) {
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      const expected = (secure(req) ? "https://" : "http://") + host;
      if (
        req.headers["sec-fetch-site"] === "cross-site" ||
        (req.headers.origin && req.headers.origin !== expected)
      )
        return send(res, 403, {
          error: "Esta acción debe realizarse desde Tiza Food.",
        });
    }
    api(req, res, url).catch((err) => {
      if (res.destroyed) return;
      if (err.status === 413) res.setHeader("Connection", "close");
      send(res, err.syscall ? 500 : err.status || 400, {
        error: err.syscall
          ? "Error interno del servidor."
          : err.message || "Solicitud inválida.",
        ...(err.code === "COUPON_FIRST_PURCHASE_ONLY"
          ? { code: err.code }
          : {}),
      });
    });
  } else {
    serveStatic(req, res, url);
  }
});
server.headersTimeout = 10000;
server.requestTimeout = 30000;
function openBrowser() {
  if (process.platform === "win32" && process.argv.includes("--open"))
    require("child_process").execFile(
      "rundll32.exe",
      ["url.dll,FileProtocolHandler", "http://localhost:" + PORT],
      { windowsHide: true },
      () => {},
    );
}
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    const check = http
      .get("http://localhost:" + PORT + "/api/health", (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          let data;
          try {
            data = JSON.parse(body);
          } catch (e) {}
          if (res.statusCode === 200 && data && data.persistence === "json") {
            console.log(
              "Tiza Food ya está iniciado en http://localhost:" + PORT,
            );
            openBrowser();
          } else {
            console.error(
              "El puerto " +
                PORT +
                " está ocupado por otro servidor. Cierra ese servidor y vuelve a iniciar Tiza Food.",
            );
            process.exitCode = 1;
          }
        });
      })
      .on("error", () => {
        console.error(
          "El puerto " +
            PORT +
            " está ocupado. Cierra el servidor anterior y vuelve a intentar.",
        );
        process.exitCode = 1;
      });
    check.setTimeout(3000, () => check.destroy(Error("Tiempo agotado")));
  } else {
    console.error("No se pudo iniciar Tiza Food: " + err.message);
    process.exitCode = 1;
  }
});
server.listen(PORT, () => {
  console.log("Tiza Food listo en http://localhost:" + PORT);
  console.log("Usuarios: " + USERS_FILE);
  openBrowser();
  receipts.start();
});
