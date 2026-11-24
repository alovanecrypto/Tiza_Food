// CAPTCHA local: solución solo en memoria del servidor, con caducidad y un uso.
const crypto = require("node:crypto");
const pictures = require("./captcha-pictures");
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const glyphs = {
  0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "+": ["00000", "00100", "00100", "11111", "00100", "00100", "00000"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  "=": ["00000", "11111", "00000", "00000", "11111", "00000", "00000"],
  "?": ["01110", "10001", "00001", "00010", "00100", "00000", "00100"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  J: ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  3: ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  5: ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  6: ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  9: ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
};
function imageFor(answer) {
  const paths = [...answer]
    .map((character, i) => {
      let d = "";
      glyphs[character].forEach((row, y) =>
        [...row].forEach((v, x) => {
          if (v === "1") d += `M${x * 4} ${y * 5}h4v5h-4z`;
        }),
      );
      return `<path d="${d}" fill="#3b2314" transform="translate(${18 + i * 35} ${18 + crypto.randomInt(0, 9)}) rotate(${crypto.randomInt(-9, 10)} 10 18)"/>`;
    })
    .join("");
  const noise = Array.from(
    { length: 5 },
    () =>
      `<path d="M0 ${crypto.randomInt(8, 72)} Q120 ${crypto.randomInt(0, 80)} 240 ${crypto.randomInt(8, 72)}" stroke="#bd8f65" stroke-opacity=".45" fill="none"/>`,
  ).join("");
  const width = Math.max(240, 18 + answer.length * 35);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="80" viewBox="0 0 ${width} 80"><rect width="${width}" height="80" rx="12" fill="#fff8ec"/>${noise}${paths}</svg>`;
}
function fail(message, status = 400) {
  const e = Error(message);
  e.status = status;
  throw e;
}
module.exports = function captcha({
  now = Date.now,
  makeAnswer,
  makeChallenge,
} = {}) {
  const characters =
    makeAnswer ||
    (() =>
      Array.from(
        { length: 6 },
        () => alphabet[crypto.randomInt(alphabet.length)],
      ).join(""));
  const grants = new Map();
  const challenges = new Map(),
    limits = new Map();
  const digest = (value) => crypto.createHash("sha256").update(value).digest();
  function binding(req) {
    return (
      (req.headers?.cookie || "")
        .split(";")
        .map((v) => v.trim())
        .find((v) => v.startsWith("tiza_captcha="))
        ?.slice(13) || ""
    );
  }
  function sameOrigin(req) {
    if (req.headers?.["sec-fetch-site"] === "cross-site")
      fail("Abre el formulario desde Tiza Food.", 403);
    if (req.headers?.origin) {
      let origin;
      try {
        origin = new URL(req.headers.origin);
      } catch {
        fail("Origen inválido.", 403);
      }
      if (origin.host !== req.headers.host)
        fail("Abre el formulario desde Tiza Food.", 403);
    }
  }
  function rate(req, kind, max) {
    const time = now();
    for (const [k, v] of limits) if (v.until <= time) limits.delete(k);
    const key = (req.socket?.remoteAddress || "local") + ":" + kind;
    let row = limits.get(key);
    if (!row) {
      if (limits.size >= 5000)
        fail("Espera un momento e inténtalo de nuevo.", 429);
      row = { count: 0, until: time + 60000 };
      limits.set(key, row);
    }
    if (++row.count > max)
      fail(
        "Demasiados intentos. Espera un minuto para volver a intentar.",
        429,
      );
  }
  return {
    issue(req, res, requestedType, purpose = "register", subject = "") {
      sameOrigin(req);
      if (!["register", "login", "review"].includes(purpose))
        fail("Verificación de seguridad inválida.");
      if (
        requestedType &&
        !["characters", "math", "images", "auto"].includes(requestedType)
      )
        fail("Elige un tipo de verificación válido.");
      rate(req, "issue", 20);
      const time = now();
      for (const [id, c] of challenges)
        if (c.expiresAt <= time) challenges.delete(id);
      if (challenges.size >= 2000)
        fail("Espera un momento para obtener otro código.", 429);
      let owner = binding(req);
      if (!/^[a-f0-9]{64}$/.test(owner)) {
        owner = crypto.randomBytes(32).toString("hex");
      }
      res.setHeader(
        "Set-Cookie",
        `tiza_captcha=${owner}; HttpOnly; SameSite=Strict; Path=/api/; Max-Age=600${req.socket?.encrypted ? "; Secure" : ""}`,
      );
      // Cada navegador conserva como máximo tres retos activos.
      const mine = [...challenges].filter(([, c]) =>
        c.owner.equals(digest(owner)),
      );
      while (mine.length >= 3) challenges.delete(mine.shift()[0]);
      const type =
        requestedType && requestedType !== "auto"
          ? requestedType
          : !requestedType || makeAnswer
            ? "characters"
            : ["characters", "math", "images"][crypto.randomInt(3)];
      let challenge;
      if (makeChallenge) challenge = makeChallenge(type);
      else if (type === "images") challenge = pictures();
      else if (type === "math") {
        const a = crypto.randomInt(10, 31),
          b = crypto.randomInt(1, 10),
          add = crypto.randomInt(2) === 1;
        const operation = String(a) + (add ? "+" : "-") + String(b) + "=?";
        challenge = {
          answer: String(add ? a + b : a - b),
          public: {
            type,
            prompt: "Resuelve la operación de la imagen.",
            length: 3,
            image:
              "data:image/svg+xml;base64," +
              Buffer.from(imageFor(operation)).toString("base64"),
          },
        };
      } else {
        const answer = characters();
        challenge = {
          answer,
          public: {
            type: "characters",
            prompt: "Escribe los 6 caracteres de la imagen.",
            length: 6,
            image:
              "data:image/svg+xml;base64," +
              Buffer.from(imageFor(answer)).toString("base64"),
          },
        };
      }
      const id = crypto.randomBytes(24).toString("hex"),
        expiresAt = time + 5 * 60000;
      challenges.set(id, {
        owner: digest(owner),
        purpose,
        subject,
        answer: digest(challenge.answer),
        type: challenge.public.type,
        ids: challenge.ids,
        expiresAt,
        attempts: 0,
      });
      return {
        id,
        expiresAt,
        ...challenge.public,
      };
    },
    verify(req, body) {
      sameOrigin(req);
      rate(req, "verify", 30);
      const c = challenges.get(body.captchaId);
      if (!c || c.expiresAt <= now()) {
        if (c) challenges.delete(body.captchaId);
        fail("El código de verificación venció o ya se usó. Obtén uno nuevo.");
      }
      if (!crypto.timingSafeEqual(c.owner, digest(binding(req))))
        fail("Obtén un código de verificación en este navegador.");
      let answer =
        typeof body.captchaAnswer === "string"
          ? body.captchaAnswer.trim().toUpperCase()
          : "";
      let valid =
        c.type === "math"
          ? /^(?:0|[1-9]\d{0,2})$/.test(answer)
          : /^[A-Z2-9]{6}$/.test(answer);
      if (c.type === "images") {
        const selected = body.captchaSelection;
        valid =
          Array.isArray(selected) &&
          selected.length > 0 &&
          selected.length <= 9 &&
          new Set(selected).size === selected.length &&
          selected.every((id) => typeof id === "string" && c.ids.includes(id));
        answer = valid ? [...selected].sort().join(",") : "";
      }
      if (++c.attempts > 5) {
        challenges.delete(body.captchaId);
        fail("Se agotaron los intentos. Obtén otro código.");
      }
      if (!valid || !crypto.timingSafeEqual(c.answer, digest(answer))) {
        if (c.attempts === 5) challenges.delete(body.captchaId);
        fail(
          c.type === "characters"
            ? "Los caracteres no coinciden. Revísalos o cambia el reto."
            : "La respuesta no coincide. Revisa el reto o cámbialo.",
        );
      }
      challenges.delete(body.captchaId);
      return { purpose: c.purpose, subject: c.subject };
    },
    ticket(req, body) {
      for (const [id, grant] of grants)
        if (grant.expiresAt <= now()) grants.delete(id);
      if (grants.size >= 2000) fail("Espera un momento para continuar.", 429);
      const scope = this.verify(req, body);
      const ticket = crypto.randomBytes(32).toString("hex");
      const expiresAt = now() + 2 * 60000;
      grants.set(ticket, { owner: digest(binding(req)), expiresAt, ...scope });
      return { ticket, expiresAt };
    },
    consume(req, body, purpose = "register", subject = "") {
      sameOrigin(req);
      const grant = grants.get(body.captchaTicket);
      if (!grant || grant.expiresAt <= now()) {
        if (grant) grants.delete(body.captchaTicket);
        fail("Completa de nuevo el código de verificación para continuar.");
      }
      if (!crypto.timingSafeEqual(grant.owner, digest(binding(req))))
        fail("Completa la verificación en este navegador.");
      if (grant.purpose !== purpose || grant.subject !== subject)
        fail("Completa la verificación de seguridad para esta acción.");
      grants.delete(body.captchaTicket);
    },
  };
};
