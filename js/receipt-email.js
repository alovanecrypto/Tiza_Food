const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const receiptPdf = require("./receipt-pdf");

function configuration(root) {
  const values = {};
  const file = path.join(root, ".env");
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(
        /^\s*(RESEND_API_KEY|TIZA_RECEIPT_FROM)\s*=\s*(.*?)\s*$/,
      );
      if (match) values[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
    }
  }
  return {
    key: process.env.RESEND_API_KEY || values.RESEND_API_KEY || "",
    from: process.env.TIZA_RECEIPT_FROM || values.TIZA_RECEIPT_FROM || "",
  };
}

const money = (value) => "$" + (Number(value) || 0).toFixed(2) + " MXN";
function printable(value, fallback = "No disponible") {
  const text = typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim() : "";
  return text ? text.slice(0, 300) : fallback;
}

function ticket(order, customerName) {
  const lines = (order.items || []).map((item) => {
    const options = Array.isArray(item.extras) ? item.extras : [];
    const extras = options
      .map((extra) => (typeof extra === "string" ? extra : extra?.name))
      .filter(Boolean);
    const detail = `${item.qty} × ${item.name}${extras.length ? " (" + extras.join(", ") + ")" : ""}`;
    const unit = Number(item.base);
    if (!Number.isFinite(unit)) return detail;
    const total =
      (unit +
        options.reduce((sum, extra) => sum + (Number(extra?.price) || 0), 0)) *
      item.qty;
    return detail + "  " + money(total);
  });
  return [
    "¡Gracias por tu compra en Tiza Food!",
    "",
    `Ticket del pedido ${order.folio}`,
    new Date(order.ts).toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
    }),
    order.branch,
    "",
    `Cliente ${printable(customerName)}`,
    `Dirección de entrega ${printable(order.address)}`,
    ...(order.deliveryNotes
      ? [`Indicaciones ${printable(order.deliveryNotes)}`]
      : []),
    "",
    ...lines,
    "",
    `Subtotal ${money(order.subtotal)}`,
    `Envío ${money(order.fee)}`,
    ...(order.discount > 0 ? [`Descuento ${money(order.discount)}`] : []),
    `Total ${money(order.total)}`,
    ...(order.walletApplied > 0
      ? [
          `Saldo aplicado ${money(order.walletApplied)}`,
          `Resto ${money(order.amountDue)}`,
        ]
      : []),
    `Método de pago ${order.payment?.method || "Sin especificar"}`,
    "",
    "Puedes consultar el seguimiento y tu ticket en Mis pedidos.",
  ].join("\n");
}

module.exports = function receipts(
  root,
  { readDB, writeDB, fetchEmail = (...args) => fetch(...args) },
) {
  const config = configuration(root);
  const enabled = Boolean(config.key && config.from);
  let running = false;

  function queue(order, email, customerName) {
    return {
      id: randomUUID(),
      state: "pending",
      to: email,
      text: ticket(order, customerName),
      pdf: true,
      attempts: 0,
      nextAt: Date.now(),
    };
  }

  function enqueue(order, user) {
    if (
      user.role !== "cliente" ||
      user.authProvider !== "firebase" ||
      !user.emailVerified
    )
      return;
    order.receiptJob = enabled
      ? queue(order, user.email, user.name)
      : { state: "unconfigured" };
  }

  async function sendOne(order) {
    const beforeSend = readDB();
    const queued = beforeSend.orders.find(
      (row) => row.receiptJob?.id === order.receiptJob.id,
    );
    if (!queued || queued.cancelled || queued.status === "Cancelado") return;
    const job = queued.receiptJob;
    // Conserva el cuerpo de los correos ya intentados con la misma clave.
    const attachments = job.pdf
      ? [
          {
            filename:
              "Ticket-Tiza-Food-" +
              String(order.folio).replace(/[^\p{L}\p{N}_-]/gu, "-") +
              ".pdf",
            content_type: "application/pdf",
            content: receiptPdf(job.text).toString("base64"),
          },
        ]
      : undefined;
    let result = "pending",
      failure = "";
    const firstAttempt = job.firstAttempt || Date.now();
    if (Date.now() - firstAttempt >= 23 * 3600000) result = "failed";
    else {
      // El primer intento se guarda antes de contactar al proveedor para limitar reintentos tras un reinicio.
      if (!job.firstAttempt) {
        job.firstAttempt = firstAttempt;
        writeDB(beforeSend);
      }
      try {
        const response = await fetchEmail("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + config.key,
            "Content-Type": "application/json",
            "Idempotency-Key": "tiza-ticket/" + job.id,
          },
          body: JSON.stringify({
            from: config.from,
            to: [job.to],
            subject: "Tu ticket de Tiza Food · " + order.folio,
            text: job.text,
            attachments,
          }),
          signal: AbortSignal.timeout(10000),
        });
        const responseData = await response.json().catch(() => ({}));
        if (response.ok && typeof responseData.id === "string") result = "accepted";
        else if (response.status < 500 && ![409, 429].includes(response.status)) {
          result = "failed";
          failure =
            response.status === 401
              ? "Resend rechazó la clave configurada. Reemplázala y reintenta los tickets."
              : typeof responseData.message === "string"
                ? responseData.message.slice(0, 220)
                : "Resend rechazó el envío del ticket.";
        }
      } catch {
        failure = "No se pudo contactar a Resend. Se reintentará automáticamente.";
        // Se mantiene pendiente para reintentar con la misma clave.
      }
    }

    const db = readDB();
    const current = db.orders.find((row) => row.receiptJob?.id === job.id);
    if (!current) return;
    const attempts = job.attempts + 1;
    if (result === "pending" && attempts < 5) {
      current.receiptJob = {
        ...job,
        firstAttempt,
        attempts,
        nextAt: Date.now() + Math.min(15, 2 ** attempts) * 60000,
      };
    } else if (result === "accepted") current.receiptJob = { state: "accepted" };
    else
      current.receiptJob = {
        state: "failed",
        attempts,
        failedAt: Date.now(),
        lastError:
          failure ||
          "No fue posible enviar el ticket después de varios intentos.",
      };
    writeDB(db);
  }

  async function flush() {
    if (!enabled || running) return;
    running = true;
    try {
      const pending = (readDB().orders || []).filter(
        (order) =>
          !order.cancelled &&
          order.status !== "Cancelado" &&
          order.receiptJob?.state === "pending" &&
          order.receiptJob.nextAt <= Date.now(),
      );
      for (const order of pending.slice(0, 4)) await sendOne(order);
    } finally {
      running = false;
    }
  }
  function kick() {
    void flush().catch(() =>
      console.error("No se pudo procesar la cola de tickets."),
    );
  }
  function retryFailed() {
    if (!enabled)
      throw Error(
        "Configura una clave y remitente válidos de Resend antes de reintentar tickets.",
      );
    const db = readDB();
    let queued = 0;
    for (const order of db.orders || []) {
      const state = order.receiptJob?.state;
      if (
        !["failed", "unconfigured"].includes(state) ||
        order.cancelled ||
        order.status === "Cancelado" ||
        typeof order.owner !== "string" ||
        !/^\S+@\S+\.\S+$/.test(order.owner)
      )
        continue;
      const customer = (db.users || []).find(
        (user) => user.email === order.owner && user.role === "cliente",
      );
      order.receiptJob = queue(order, order.owner, customer?.name);
      queued++;
    }
    if (queued) writeDB(db);
    kick();
    return queued;
  }
  return {
    enqueue,
    flush,
    kick,
    retryFailed,
    status() {
      const jobs = (readDB().orders || []).map((order) => order.receiptJob);
      const count = (state) => jobs.filter((job) => job?.state === state).length;
      return {
        configured: enabled,
        pending: count("pending"),
        accepted: count("accepted"),
        failed: count("failed"),
        unconfigured: count("unconfigured"),
      };
    },
    start() {
      if (enabled) {
        kick();
        setInterval(kick, 30000).unref();
      }
    },
  };
};
