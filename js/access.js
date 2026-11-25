const FoodManagement = require("./management");
const publicOrder = require("./delivery").publicOrder;
const fs = require("fs"),
  path = require("path"),
  crypto = require("crypto");
module.exports = function access(root, helpers) {
  const { send, readBody, readDB, writeDB, reviews, dataDir = path.join(root, "data") } = helpers;
  const usersFile = path.join(dataDir, "usuarios.json");
  const sessions = new Map();
  const captcha = require("./captcha")();
  const ReviewModeration = require("./review-moderation");
  const SESSION_SECONDS = 60 * 60;
  const FoodStaff = require("./staff-accounts");
  const FirebaseAuth = require("./firebase-auth");
  const FirebaseSession = require("./firebase-session");
  const firebase = FirebaseAuth.client((...args) => fetch(...args));
  // En producción el dueño se define por configuración, pero el rol solo se
  // concede después de validar la contraseña y la identidad con Firebase.
  const ownerEmail = String(process.env.TIZA_OWNER_EMAIL || "")
    .trim()
    .toLowerCase();
  const configuredRole = (identity) =>
    identity?.emailVerified === true &&
    ownerEmail &&
    String(identity?.email || "")
      .trim()
      .toLowerCase() === ownerEmail
      ? "dueno"
      : undefined;
  const reportDay = (value) =>
    new Intl.DateTimeFormat("sv-SE", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  const reportTimestamp = (value) => {
    const timestamp = typeof value === "number" ? value : Date.parse(value);
    return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;
  };
  const reportInPeriod = (value, period, now = Date.now()) => {
    const timestamp = reportTimestamp(value);
    return !!timestamp && (period === "all" || reportDay(timestamp) === reportDay(now));
  };
  const average = (values) =>
    values.length
      ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) /
          10
      : null;
  function ownerReport(period, user) {
    const db = readDB();
    const orders = (db.orders || []).filter((order) =>
      reportInPeriod(order.ts, period),
    );
    const report = FoodManagement.summary(db.orders || [], period);
    const deliveryRatings = orders
      .filter((order) => FoodManagement.statusOf(order) === "Entregado")
      .map((order) => Number(order.deliveryRating?.stars))
      .filter((stars) => Number.isInteger(stars) && stars >= 1 && stars <= 5);
    const deliveredMinutes = orders
      .filter((order) => FoodManagement.statusOf(order) === "Entregado")
      .map((order) => {
        const deliveredAt = (order.statusHistory || [])
          .slice()
          .reverse()
          .find((event) => event?.status === "Entregado")?.at;
        const startedAt = Number(order.dispatchedAt);
        const finishedAt = Number(deliveredAt);
        return Number.isFinite(startedAt) &&
          Number.isFinite(finishedAt) &&
          finishedAt >= startedAt
          ? (finishedAt - startedAt) / 60000
          : null;
      })
      .filter((minutes) => minutes !== null);
    const productRatings = reviews
      .staffList(db, user)
      .reviews.filter(
        (review) =>
          review.kind === "product" &&
          !review.hidden &&
          reportInPeriod(review.date, period),
      )
      .map((review) => Number(review.stars))
      .filter((stars) => Number.isInteger(stars) && stars >= 1 && stars <= 5);
    const productTotals = new Map();
    for (const order of orders) {
      if (FoodManagement.statusOf(order) === "Cancelado") continue;
      for (const item of order.items || []) {
        const name = String(item?.name || "Producto").trim();
        const quantity = Number(item?.qty);
        if (!name || !Number.isInteger(quantity) || quantity < 1) continue;
        productTotals.set(name, (productTotals.get(name) || 0) + quantity);
      }
    }
    let refundRequests = [];
    const refundsFile = path.join(dataDir, "reembolsos.json");
    if (fs.existsSync(refundsFile)) {
      try {
        const refundsData = JSON.parse(fs.readFileSync(refundsFile, "utf8"));
        if (!Array.isArray(refundsData.requests)) throw Error();
        refundRequests = refundsData.requests.filter((request) =>
          reportInPeriod(request.createdAt, period),
        );
      } catch (error) {
        throw Error("No se pudo leer el historial de reembolsos para el reporte.");
      }
    }
    const refunds = { requested: refundRequests.length, pending: 0, approved: 0, completed: 0, totalCompleted: 0 };
    for (const request of refundRequests) {
      if (request.status === "REEMBOLSADO") {
        refunds.completed++;
        const amount = Number(request.amount);
        if (Number.isFinite(amount) && amount > 0) refunds.totalCompleted += amount;
      } else if (request.status === "APROBADO") refunds.approved++;
      else refunds.pending++;
    }
    refunds.totalCompleted = Math.round(refunds.totalCompleted * 100) / 100;
    return {
      ...report,
      service: {
        deliveryRating: average(deliveryRatings),
        deliveryRatingCount: deliveryRatings.length,
        productRating: average(productRatings),
        productRatingCount: productRatings.length,
        averageDeliveryMinutes: average(deliveredMinutes),
        timedDeliveries: deliveredMinutes.length,
      },
      products: [...productTotals.entries()]
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name, "es"))
        .slice(0, 5),
      refunds,
    };
  }
  const allUsers = () => {
    const users = readUsers().users;
    return users.concat(
      FoodStaff.accounts.filter(
        (account) => !users.some((user) => user.email === account.email),
      ),
    );
  };
  const readUsers = () => {
    if (!fs.existsSync(usersFile)) return { users: [] };
    try {
      const raw = fs
        .readFileSync(usersFile, "utf8")
        .replace(/^\uFEFF/, "")
        .trim();
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.users)) throw Error("Formato inválido");
      return data;
    } catch (e) {
      throw Error(
        "No se pudo leer data/usuarios.json. Revisa el archivo; se conserva sin reemplazar tus usuarios.",
      );
    }
  };
  const writeUsers = (data) => {
    try {
      fs.writeFileSync(
        usersFile + ".tmp",
        JSON.stringify(data, null, 2),
        "utf8",
      );
      fs.renameSync(usersFile + ".tmp", usersFile);
    } catch (e) {
      throw Error(
        "No se pudo guardar data/usuarios.json. Revisa los permisos de la carpeta data.",
      );
    }
  };
  const saveUser = (user, legacyUsername) => {
    const data = readUsers();
    data.users = FirebaseAuth.store(data.users, user, legacyUsername);
    writeUsers(data);
  };
  const emailSends = new Map();
  async function sendVerification(identity, idToken) {
    if (identity.emailVerified)
      return { verificationSent: false, emailVerified: true, retryAfter: 0 };
    const pending = emailSends.get(identity.localId);
    if (pending && pending.until > Date.now()) {
      await pending.delivery;
      return {
        verificationSent: true,
        retryAfter: Math.max(0, Math.ceil((pending.until - Date.now()) / 1000)),
      };
    }
    // Las solicitudes simultáneas esperan el mismo envío confirmado por Firebase.
    const entry = {
      until: Date.now() + 60000,
      delivery: firebase.sendVerification(idToken),
    };
    emailSends.set(identity.localId, entry);
    try {
      await entry.delivery;
      return {
        verificationSent: true,
        retryAfter: Math.max(0, Math.ceil((entry.until - Date.now()) / 1000)),
      };
    } catch (e) {
      if (emailSends.get(identity.localId) === entry)
        emailSends.delete(identity.localId);
      throw e;
    }
  }
  async function completeFirebase(
    req,
    res,
    user,
    identity,
    credential,
    remember,
  ) {
    if (!identity.emailVerified) {
      let delivery;
      try {
        delivery = await sendVerification(identity, credential.idToken);
      } catch (e) {
        delivery = {
          verificationSent: false,
          verificationError: e.message,
          retryAfter: 0,
        };
      }
      send(res, 200, {
        requiresEmailVerification: true,
        email: user.email,
        idToken: credential.idToken,
        refreshToken: credential.refreshToken,
        expiresIn: credential.expiresIn,
        ...delivery,
      });
      return;
    }
    start(req, res, user, identity, remember);
    send(res, 200, { user: safe(user) });
  }
  const safe = (u) => ({
    name: u.name,
    email: u.email,
    username: u.username || u.email,
    role: u.role || "cliente",
    address: u.address || "",
    addressParts: u.addressParts || null,
    places: (Array.isArray(u.places) ? u.places : [])
      .filter((p) => p && typeof p.text === "string")
      .slice(-6)
      .map((p) => ({
        label: String(p.label || p.text).slice(0, 60),
        text: p.text.slice(0, 600),
        coords: typeof p.coords === "string" ? p.coords : null,
      })),
    authProvider: u.authProvider || "legacy",
  });
  const sessionOf = (req) => {
    const cookie = String((req.headers || {}).cookie || "")
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("tiza_session="));
    const token = cookie ? cookie.slice(13) : "";
    const session = sessions.get(token);
    if (!session || session.expires <= Date.now()) {
      sessions.delete(token);
      return null;
    }
    return session;
  };
  const current = (req) => {
    const session = sessionOf(req);
    if (!session) return null;
    if (session.provider === "local-staff")
      return (
        FoodStaff.accounts.find((u) => u.firebaseUid === session.uid) || null
      );
    return (
      readUsers().users.find(
        (u) =>
          u.authProvider === "firebase" &&
          u.firebaseUid === session.uid &&
          session.emailVerified === true,
      ) || null
    );
  };
  const secureCookie = (req) =>
    (helpers.secure ? helpers.secure(req) : req.socket?.encrypted)
      ? "; Secure"
      : "";
  const start = (req, res, u, proof, remember) => {
    FirebaseSession.requireEmail(u, proof);
    const now = Date.now();
    for (const [key, session] of sessions)
      if (session.expires <= now) sessions.delete(key);
    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, {
      uid: u.firebaseUid,
      provider: u.authProvider,
      emailVerified: !!(proof && proof.emailVerified),
      expires: now + SESSION_SECONDS * 1000,
    });
    res.setHeader(
      "Set-Cookie",
      "tiza_session=" +
        token +
        "; HttpOnly; SameSite=Strict; Path=/" +
        (remember === true ? "; Max-Age=" + SESSION_SECONDS : "") +
        secureCookie(req),
    );
  };
  const migrationAttempts = new Map();
  const authRequests = new Map();
  const authRoutes = new Set([
    "/api/firebase-prepare",
    "/api/firebase-session",
    "/api/firebase-refresh",
    "/api/firebase-send-verification",
    "/api/firebase-registration-check",
    "/api/firebase-migrate",
    "/api/login",
    "/api/register",
  ]);
  function limitAuth(req, route) {
    const now = Date.now();
    const key = route + ":" + (req.socket?.remoteAddress || "local");
    let window = authRequests.get(key);
    if (!window || now >= window.until) {
      window = { count: 0, until: now + 60000 };
      authRequests.set(key, window);
    }
    if (++window.count > 45)
      throw Object.assign(
        Error("Espera un minuto antes de volver a intentar."),
        { status: 429 },
      );
  }
  function end(req, res) {
    const cookie = String((req.headers || {}).cookie || "")
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("tiza_session="));
    if (cookie) sessions.delete(cookie.slice(13));
    res.setHeader(
      "Set-Cookie",
      "tiza_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0" +
        secureCookie(req),
    );
  }
  function legacyAccount(b) {
    const username = String(b.legacyUsername || "")
        .trim()
        .toLowerCase(),
      password = String(b.legacyPassword || ""),
      attempts = migrationAttempts.get(username) || { count: 0, until: 0 };
    if (attempts.until > Date.now())
      throw Error(
        "Espera 15 minutos antes de volver a intentar vincular esta cuenta.",
      );
    const u = allUsers().find(
      (u) => u.username === username || u.email === username,
    );
    let valid = false;
    if (
      u &&
      u.authProvider !== "firebase" &&
      (u.role || "cliente") === "cliente" &&
      u.salt &&
      u.passwordHash &&
      password.length >= 8 &&
      password.length <= 256
    ) {
      const hash = u.demoAccount
          ? crypto.pbkdf2Sync(password, u.salt, 100000, 32, "sha256")
          : crypto.scryptSync(password, u.salt, 64),
        saved = Buffer.from(u.passwordHash, "hex");
      valid =
        saved.length === hash.length && crypto.timingSafeEqual(hash, saved);
    }
    if (!valid) {
      attempts.count++;
      if (attempts.count >= 5) {
        attempts.count = 0;
        attempts.until = Date.now() + 900000;
      }
      migrationAttempts.set(username, attempts);
      throw Error(
        "Usuario o contraseña de la cuenta anterior incorrectos, o la cuenta ya está vinculada.",
      );
    }
    if (b.staffRole && b.staffRole !== (u.role || "cliente"))
      throw Error("La cuenta anterior no corresponde al acceso seleccionado.");
    if (
      (u.role || "cliente") === "cliente" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email) &&
      String(b.email || "")
        .trim()
        .toLowerCase() !== u.email.toLowerCase()
    )
      throw Error(
        "Usa el mismo correo de la cuenta anterior para conservar sus pedidos.",
      );
    migrationAttempts.delete(username);
    return { ...u, username: u.username || u.email, role: u.role || "cliente" };
  }
  const handler = async (req, res, url) => {
    if (req.method === "GET" && url.pathname === "/api/captcha") {
      const purpose = url.searchParams.get("purpose") || "register";
      const user = purpose === "review" ? current(req) : null;
      if (purpose === "review" && (!user || user.role !== "cliente")) {
        send(res, user ? 403 : 401, {
          error: "Inicia sesión como cliente para publicar una reseña.",
        });
        return true;
      }
      send(
        res,
        200,
        captcha.issue(
          req,
          res,
          url.searchParams.get("type"),
          purpose,
          user?.email || "",
        ),
      );
      return true;
    }
    if (req.method === "POST" && url.pathname === "/api/captcha/verify") {
      send(res, 200, captcha.ticket(req, await readBody(req)));
      return true;
    }
    const route = url.pathname;
    if (req.method === "POST" && authRoutes.has(route)) limitAuth(req, route);
    if (route === "/api/health" && req.method === "GET") {
      readUsers();
      send(res, 200, { ok: true, persistence: "json" });
      return true;
    }
    if (route === "/api/firebase-refresh" && req.method === "POST") {
      const b = await readBody(req);
      send(res, 200, await firebase.refresh(b.refreshToken));
      return true;
    }
    if (route === "/api/firebase-send-verification" && req.method === "POST") {
      const b = await readBody(req),
        identity = await FirebaseSession.identity(
          (...args) => fetch(...args),
          b.idToken,
        );
      send(res, 200, await sendVerification(identity, b.idToken));
      return true;
    }
    if (route === "/api/firebase-registration-check" && req.method === "POST") {
      FirebaseAuth.registration(await readBody(req));
      send(res, 200, { ok: true });
      return true;
    }
    if (
      ["/api/firebase-prepare", "/api/firebase-session"].includes(route) &&
      req.method === "POST"
    ) {
      const b = await readBody(req);
      captcha.consume(req, b, "login");
      end(req, res);
      const identity = await FirebaseSession.identity(
          (...args) => fetch(...args),
          b.idToken,
        ),
        details = b.details
          ? FirebaseAuth.registration(
              { ...b.details, email: identity.email },
              false,
            )
          : null;
      const user = FirebaseAuth.profile(
        identity,
        allUsers(),
        details,
        configuredRole(identity),
      );
      if (b.staffRole && b.staffRole !== user.role) {
        send(res, 403, {
          error: "Esta cuenta no tiene permiso para este panel.",
        });
        return true;
      }
      saveUser(user);
      if (route === "/api/firebase-prepare") {
        send(res, 200, {
          role: user.role,
          emailVerified: identity.emailVerified,
          requiresEmailVerification: true,
        });
        return true;
      }
      start(req, res, user, identity, b.remember);
      send(res, 200, { user: safe(user) });
      return true;
    }
    if (req.method === "GET" && route === "/api/setup-status") {
      send(res, 200, { needsOwner: false });
      return true;
    }
    if (route === "/api/setup-owner") {
      send(res, 403, {
        error:
          "Vincula la cuenta anterior del dueño con Pasar mi cuenta anterior a Firebase.",
      });
      return true;
    }
    if (
      req.method === "POST" &&
      ["/api/register", "/api/login", "/api/firebase-migrate"].includes(route)
    ) {
      const b = await readBody(req);
      if (
        route === "/api/login" ||
        (route === "/api/firebase-migrate" && b.createAccount !== true)
      )
        captcha.consume(req, b, "login");
      end(req, res);
      let user, identity, credential;
      if (route === "/api/login") {
        const staff = await FoodStaff.authenticate(b);
        if (staff) {
          saveUser(staff);
          start(req, res, staff, undefined, b.remember);
          send(res, 200, { user: safe(staff) });
          return true;
        }
      }
      if (route === "/api/firebase-migrate") {
        if (b.createAccount === true) captcha.consume(req, b);
        const legacy = legacyAccount(b);
        credential =
          b.createAccount === true
            ? await firebase.signUp(b.email, b.password)
            : await firebase.signIn(b.email, b.password);
        identity = await FirebaseSession.identity(
          (...args) => fetch(...args),
          credential.idToken,
        );
        const users = allUsers();
        if (
          !users.some(
            (user) =>
              (user.username || user.email) === legacy.username &&
              user.authProvider !== "firebase" &&
              user.passwordHash === legacy.passwordHash,
          )
        )
          throw Error("La cuenta anterior ya está vinculada.");
        user = FirebaseAuth.link(identity, users, legacy);
        saveUser(user, legacy.username);
      } else {
        if (route === "/api/register" && b.staffRole) {
          send(res, 403, {
            error:
              "Las cuentas del personal las vincula su titular o las crea el dueño.",
          });
          return true;
        }
        let details = null;
        if (route === "/api/register") {
          details = FirebaseAuth.registration(b);
          captcha.consume(req, b);
          FirebaseAuth.available(allUsers(), details);
        }
        credential =
          route === "/api/register"
            ? await firebase.signUp(details.email, b.password)
            : await firebase.signIn(b.email || b.username, b.password);
        identity = await FirebaseSession.identity(
          (...args) => fetch(...args),
          credential.idToken,
        );
        user = FirebaseAuth.profile(
          identity,
          allUsers(),
          details,
          configuredRole(identity),
        );
        if (b.staffRole && b.staffRole !== user.role) {
          send(res, 403, {
            error:
              "Esta cuenta no tiene permiso para este panel. Ingresa con una cuenta autorizada.",
          });
          return true;
        }
        saveUser(user);
      }
      await completeFirebase(req, res, user, identity, credential, b.remember);
      return true;
    }
    if (route === "/api/logout" && req.method === "POST") {
      end(req, res);
      send(res, 200, { ok: true });
      return true;
    }
    if (route === "/api/me" && req.method === "GET") {
      const session = sessionOf(req),
        u = session && current(req);
      send(
        res,
        u ? 200 : 401,
        u
          ? { user: safe(u), expiresAt: session.expires }
          : { error: "Inicia sesión con Firebase." },
      );
      return true;
    }
    if (
      (route === "/api/me" && req.method === "PATCH") ||
      (route === "/api/me/places" && ["POST", "DELETE"].includes(req.method))
    ) {
      if (!current(req)) {
        send(res, 401, {
          error: "Inicia sesión para guardar tus direcciones.",
        });
        return true;
      }
      const body = await readBody(req),
        user = current(req);
      if (!user) {
        send(res, 401, { error: "Tu sesión terminó." });
        return true;
      }
      if (user.role !== "cliente") {
        send(res, 403, {
          error: "Este formulario es para la cuenta del cliente.",
        });
        return true;
      }
      const allowed =
        route === "/api/me" ? ["name", "address"] : ["label", "text", "coords"];
      if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body) ||
        !Object.keys(body).length ||
        Object.keys(body).some((key) => !allowed.includes(key))
      )
        throw Error("Los datos enviados no corresponden a este formulario.");
      const data = readUsers(),
        index = data.users.findIndex(
          (u) =>
            u.firebaseUid === user.firebaseUid &&
            u.authProvider === user.authProvider,
        );
      if (index < 0) throw Error("No se encontró tu perfil guardado.");
      const profile = { ...data.users[index] };
      const validText = (value, minimum, maximum) =>
        typeof value === "string" &&
        value.trim().length >= minimum &&
        value.trim().length <= maximum &&
        !/[\u0000-\u001f\u007f]/.test(value);
      if (route === "/api/me") {
        if (Object.hasOwn(body, "name")) {
          if (!validText(body.name, 2, 100))
            throw Error("Escribe un nombre de 2 a 100 caracteres.");
          profile.name = body.name.trim();
        }
        if (Object.hasOwn(body, "address")) {
          if (!validText(body.address, 5, 600))
            throw Error(
              "Escribe una dirección completa de 5 a 600 caracteres.",
            );
          profile.address = body.address.trim();
          profile.addressParts = null;
        }
      } else {
        if (!validText(body.text, 5, 600))
          throw Error("Escribe una dirección completa de 5 a 600 caracteres.");
        const text = body.text.trim(),
          key = (value) =>
            String(value || "")
              .trim()
              .replace(/\s+/g, " ")
              .toLowerCase();
        const places = Array.isArray(profile.places) ? profile.places : [];
        if (req.method === "DELETE")
          profile.places = places.filter(
            (place) => key(place.text) !== key(text),
          );
        else {
          let coords = null;
          if (
            body.coords !== undefined &&
            body.coords !== null &&
            body.coords !== ""
          ) {
            if (
              typeof body.coords !== "string" ||
              !/^-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?$/.test(
                body.coords.trim(),
              )
            )
              throw Error("El punto del mapa no es válido.");
            const [lat, lng] = body.coords.split(",").map(Number);
            if (
              !Number.isFinite(lat) ||
              !Number.isFinite(lng) ||
              Math.abs(lat) > 90 ||
              Math.abs(lng) > 180
            )
              throw Error("El punto del mapa no es válido.");
            coords = lat.toFixed(6) + "," + lng.toFixed(6);
          }
          const label =
            body.label === undefined
              ? text.split(",")[0].slice(0, 60)
              : body.label;
          if (!validText(label, 1, 60))
            throw Error("El nombre del lugar debe tener de 1 a 60 caracteres.");
          profile.places = places
            .filter((place) => key(place.text) !== key(text))
            .concat({ label: label.trim(), text, coords })
            .slice(-6);
        }
      }
      data.users[index] = profile;
      writeUsers(data);
      send(res, 200, { ok: true, user: safe(profile) });
      return true;
    }
    if (route.startsWith("/api/admin/")) {
      const user = current(req),
        role = user && (user.role || "cliente");
      if (!user) {
        send(res, 401, { error: "Inicia sesión." });
        return true;
      }
      if (!["dueno", "empleado"].includes(role)) {
        send(res, 403, { error: "No tienes permiso." });
        return true;
      }
      if (route === "/api/admin/reviews" && req.method === "GET") {
        send(res, 200, reviews.staffList(readDB(), user));
        return true;
      }
      const reviewRoute = route.match(/^\/api\/admin\/reviews\/([\w-]+)$/);
      if (reviewRoute && req.method === "PATCH") {
        reviews.moderate(user, reviewRoute[1], await readBody(req));
        send(res, 200, { ok: true });
        return true;
      }
      const blockRoute = route.match(/^\/api\/admin\/review-blocks\/([\w-]+)$/);
      if (blockRoute && req.method === "DELETE") {
        reviews.liftBlock(user, blockRoute[1]);
        send(res, 200, { ok: true });
        return true;
      }
      if (route === "/api/admin/orders" && req.method === "GET") {
        send(res, 200, {
          orders: (readDB().orders || []).map((order) =>
            publicOrder(order, true),
          ),
        });
        return true;
      }
      const statusRoute = route.match(
        /^\/api\/admin\/orders\/([^/]+)\/status$/,
      );
      if (statusRoute && req.method === "PATCH") {
        const b = await readBody(req),
          db = readDB(),
          index = (db.orders || []).findIndex(
            (o) => o.folio === decodeURIComponent(statusRoute[1]),
          );
        if (index < 0) {
          send(res, 404, { error: "Pedido no encontrado." });
          return true;
        }
        db.orders[index] = FoodManagement.advance(
          db.orders[index],
          b.status,
          user.name,
        );
        writeDB(db);
        send(res, 200, { order: publicOrder(db.orders[index], true) });
        return true;
      }
      if (role !== "dueno") {
        send(res, 403, {
          error: "Solo el dueño puede administrar productos y empleados.",
        });
        return true;
      }
      if (route === "/api/admin/hours") {
        const Hours = require("./hours");
        if (req.method === "GET") {
          send(res, 200, { hours: readDB().hours || Hours.defaults() });
          return true;
        }
        if (req.method === "PUT") {
          const db = readDB();
          db.hours = Hours.validate(await readBody(req));
          writeDB(db);
          send(res, 200, { hours: db.hours });
          return true;
        }
      }
      if (route === "/api/admin/summary" && req.method === "GET") {
        send(res, 200, ownerReport(
          url.searchParams.get("period") === "all" ? "all" : "today",
          user,
        ));
        return true;
      }
      const availability = route.match(
        /^\/api\/admin\/products\/(\d+)\/availability$/,
      );
      if (availability && req.method === "PATCH") {
        const b = await readBody(req),
          db = readDB(),
          product = (db.products || []).find(
            (p) => p.id === Number(availability[1]),
          );
        if (!product) {
          send(res, 404, { error: "Producto no encontrado." });
          return true;
        }
        if (typeof b.soldOut !== "boolean")
          throw Error("Disponibilidad inválida.");
        product.soldOut = b.soldOut;
        writeDB(db);
        send(res, 200, { product });
        return true;
      }
      if (route === "/api/admin/employees") {
        if (req.method === "GET") {
          send(res, 200, {
            users: readUsers()
              .users.filter((u) => u.role === "empleado")
              .map(safe),
          });
          return true;
        }
        if (req.method === "POST") {
          const b = await readBody(req),
            details = FirebaseAuth.staffRegistration(b);
          FirebaseAuth.available(allUsers(), details);
          const identity = await firebase.signUp(details.email, b.password),
            data = readUsers(),
            u = FirebaseAuth.profile(identity, allUsers(), details, "empleado");
          data.users = FirebaseAuth.store(data.users, u);
          writeUsers(data);
          send(res, 201, { user: safe(u) });
          return true;
        }
      }
      if (route === "/api/admin/products" && req.method === "GET") {
        send(res, 200, { products: readDB().products || [] });
        return true;
      }
      const match = route.match(/^\/api\/admin\/products(?:\/(\d+))?$/);
      if (match && ["POST", "PUT", "DELETE"].includes(req.method)) {
        const b = req.method === "DELETE" ? null : await readBody(req);
        const db = readDB();
        db.products = db.products || [];
        const id = Number(match[1]),
          index = db.products.findIndex((p) => p.id === id);
        if (req.method !== "POST" && index < 0) {
          send(res, 404, { error: "Producto no encontrado." });
          return true;
        }
        if (req.method === "DELETE") {
          db.products.splice(index, 1);
        } else {
          const name = String(b.name || "").trim(),
            cat = String(b.cat || "").trim(),
            price = Number(b.price),
            img = String(b.img || "").trim();
          if (
            !name ||
            name.length > 100 ||
            !cat ||
            cat.length > 60 ||
            !Number.isFinite(price) ||
            price <= 0 ||
            price > 100000 ||
            !FoodManagement.validImage(img)
          )
            throw Error(
              "Revisa nombre, categoría, precio e imagen seleccionada.",
            );
          const product = Object.assign(
            {},
            index >= 0 ? db.products[index] : {},
            {
              id:
                req.method === "POST"
                  ? Math.max(0, ...db.products.map((p) => Number(p.id) || 0)) +
                    1
                  : id,
              name,
              cat,
              price: Math.round(price * 100) / 100,
              img,
              desc: String(b.desc || "").slice(0, 600),
              emoji: "🍽️",
            },
          );
          if (req.method === "POST") db.products.push(product);
          else db.products[index] = product;
        }
        writeDB(db);
        send(res, 200, { ok: true });
        return true;
      }
      send(res, 404, { error: "No existe." });
      return true;
    }
    const ratingRoute = route.match(/^\/api\/orders\/([^/]+)\/rating$/);
    if (ratingRoute && req.method === "POST") {
      const user = current(req);
      if (!user) {
        send(res, 401, { error: "Inicia sesión." });
        return true;
      }
      if ((user.role || "cliente") !== "cliente") {
        send(res, 403, { error: "Solo los clientes califican entregas." });
        return true;
      }
      const b = await readBody(req),
        db = readDB(),
        index = (db.orders || []).findIndex(
          (o) =>
            o.folio === decodeURIComponent(ratingRoute[1]) &&
            o.owner === user.email,
        );
      if (index < 0) {
        send(res, 404, { error: "Pedido no encontrado." });
        return true;
      }
      ReviewModeration.assertAllowed(b.comment);
      reviews.assertPosting(user);
      captcha.consume(req, b, "review", user.email);
      db.orders[index] = FoodManagement.rate(db.orders[index], user, b);
      writeDB(db);
      send(res, 200, { order: publicOrder(db.orders[index]) });
      return true;
    }
    if (route === "/api/orders" && req.method === "GET") {
      const user = current(req);
      if (!user) {
        send(res, 401, { error: "Inicia sesión." });
        return true;
      }
      send(res, 200, {
        orders: (readDB().orders || [])
          .filter((o) => o.owner === user.email)
          .map((order) => publicOrder(order)),
      });
      return true;
    }
    return false;
  };
  return {
    handler,
    current,
    safe,
    consumeReviewCaptcha(req, body) {
      const user = current(req);
      if (!user || user.role !== "cliente") {
        const error = Error(
          "Inicia sesión como cliente para publicar una reseña.",
        );
        error.status = user ? 403 : 401;
        throw error;
      }
      captcha.consume(req, body, "review", user.email);
    },
  };
};
