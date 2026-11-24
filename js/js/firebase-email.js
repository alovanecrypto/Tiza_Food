/* Verificación con Firebase a través de la API. Tokens solo en memoria. */
(() => {
  const el = (id) => document.getElementById(id);
  let active = null,
    starting = false;
  const serverMessage =
    "Abre INICIAR-TIZA-FOOD.cmd y entra en http://localhost:3000 para guardar los usuarios en data/usuarios.json.";

  async function api(route, body, method = "POST") {
    const controller = new AbortController(),
      timer = setTimeout(() => controller.abort(), 50000);
    try {
      const response = await fetch("api/" + route, {
        method,
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: method === "GET" ? undefined : JSON.stringify(body || {}),
        signal: controller.signal,
      });
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw Error("No se pudo conectar con el servidor. " + serverMessage);
      }
      if (!response.ok)
        throw Error(data.error || "No se pudo comprobar tu acceso.");
      return data;
    } catch (e) {
      if (e.name === "AbortError")
        throw Error("La solicitud tardó demasiado. Intenta nuevamente.");
      if (e instanceof TypeError)
        throw Error("No se pudo conectar con el servidor. " + serverMessage);
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }
  function expireAt(value) {
    const seconds = Number(value);
    return (
      Date.now() +
      ((Number.isFinite(seconds) && seconds > 0 ? seconds : 3600) - 60) * 1000
    );
  }
  async function token(s) {
    if (Date.now() >= s.expiresAt) {
      const refreshed = await api("firebase-refresh", {
        refreshToken: s.refreshToken,
      });
      if (active !== s) throw Error("Verificación cancelada.");
      s.token = refreshed.idToken;
      s.refreshToken = refreshed.refreshToken;
      s.expiresAt = expireAt(refreshed.expiresIn);
    }
    return s.token;
  }
  async function finish(s, result, error) {
    if (active !== s) return;
    active = null;
    clearInterval(s.timer);
    s.token = "";
    s.refreshToken = "";
    el("emailVerificationModal").classList.remove("open");
    el("emailVerificationModal").setAttribute("aria-hidden", "true");
    if (error) {
      await api("logout", {}).catch(() => {});
      s.reject(error);
    } else s.resolve(result);
  }
  function tick(s) {
    if (active !== s) return;
    const left = Math.max(0, Math.ceil((s.nextSend - Date.now()) / 1000));
    el("emailVerificationSend").disabled = s.busy || left > 0;
    el("emailVerificationSend").textContent = left
      ? "Reenviar en " + left + " s"
      : "Enviar enlace de verificación";
  }
  function busy(s, value) {
    if (active !== s) return;
    s.busy = value;
    el("emailVerificationCheck").disabled = value;
    tick(s);
  }
  const sentMessage =
    "Firebase aceptó el envío. Abre el enlace en tu correo (revisa spam) y después pulsa Ya verifiqué mi correo.";
  async function send(s) {
    if (active !== s || s.busy || Date.now() < s.nextSend) return;
    busy(s, true);
    el("emailVerificationError").textContent = "";
    el("emailVerificationStatus").textContent = "Enviando enlace…";
    try {
      const result = await api("firebase-send-verification", {
        idToken: await token(s),
      });
      if (active !== s) return;
      s.nextSend = Date.now() + (result.retryAfter || 0) * 1000;
      el("emailVerificationStatus").textContent = result.emailVerified
        ? "Tu correo ya está verificado. Pulsa Ya verifiqué mi correo."
        : sentMessage;
    } catch (e) {
      if (active === s) {
        el("emailVerificationStatus").textContent = "";
        el("emailVerificationError").textContent = e.message;
      }
    } finally {
      busy(s, false);
    }
  }
  async function authenticate(body, options = {}) {
    if (active || starting)
      throw Error("Termina o cancela la verificación actual.");
    starting = true;
    try {
      const health = await api("health", null, "GET");
      if (health.persistence !== "json") throw Error(serverMessage);
      const result = await api(options.register ? "register" : "login", body);
      body.password = "";
      el("rPassword").value = "";
      el("rPasswordConfirm").value = "";
      if (!result.requiresEmailVerification) return result;
      if (!result.idToken)
        throw Error(
          "No se pudo preparar la verificación. Vuelve a iniciar sesión.",
        );
      return new Promise((resolve, reject) => {
        const s = {
          remember: body.remember === true,
          token: result.idToken,
          refreshToken: result.refreshToken,
          expiresAt: expireAt(result.expiresIn),
          resolve,
          reject,
          nextSend: Date.now() + (result.retryAfter || 0) * 1000,
          busy: false,
        };
        active = s;
        el("emailVerificationAccount").textContent = "Cuenta: " + result.email;
        el("emailVerificationStatus").textContent = result.verificationSent
          ? sentMessage
          : "";
        el("emailVerificationError").textContent =
          result.verificationError || "";
        el("emailVerificationModal").classList.add("open");
        el("emailVerificationModal").setAttribute("aria-hidden", "false");
        s.timer = setInterval(() => tick(s), 1000);
        busy(s, false);
      });
    } finally {
      body.password = "";
      el("rPassword").value = "";
      el("rPasswordConfirm").value = "";
      starting = false;
    }
  }
  el("emailVerificationSend").addEventListener("click", () => {
    if (active) send(active);
  });
  el("emailVerificationCheck").addEventListener("click", async () => {
    const s = active;
    if (!s || s.busy) return;
    busy(s, true);
    el("emailVerificationError").textContent = "";
    try {
      const captcha = await window.FoodCaptcha.request("login");
      if (active !== s) return;
      const result = await api("firebase-session", {
        idToken: await token(s),
        remember: s.remember,
        ...captcha,
      });
      if (active !== s) {
        await api("logout", {}).catch(() => {});
        return;
      }
      await finish(s, result);
    } catch (e) {
      if (active === s) el("emailVerificationError").textContent = e.message;
    } finally {
      busy(s, false);
    }
  });
  function cancel() {
    if (active)
      finish(
        active,
        null,
        Error("Verificación cancelada. No se inició sesión."),
      );
  }
  el("emailVerificationModal").addEventListener("click", (e) => {
    if (
      e.target === el("emailVerificationModal") ||
      e.target.closest("[data-email-close]")
    )
      cancel();
  });
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape" && active && !window.FoodCaptcha?.isOpen()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        cancel();
      }
    },
    true,
  );
  window.FoodEmail = { authenticate, cancel };
})();
