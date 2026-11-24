/* Preferencias y sesión del prototipo. Nunca guarda contraseñas ni tokens de Firebase. */
(() => {
  const key = "tiza_remembered_session_v1",
    choice = "tiza_cookie_choice_v1",
    expiresKey = "tiza_school_session_expires_v1";
  const duration = 60 * 60 * 1000,
    sessionKeys = ["tiza_school_session_v1", "tiza_school_email_session_v1"];
  let watchedUntil = 0,
    watchTimer = null;
  function clearTabSession() {
    for (const name of sessionKeys) sessionStorage.removeItem(name);
    sessionStorage.removeItem(expiresKey);
  }
  function tabExpires() {
    const expires = Number(sessionStorage.getItem(expiresKey));
    if (!Number.isFinite(expires) || expires <= Date.now()) {
      clearTabSession();
      return 0;
    }
    return expires;
  }
  function saved() {
    try {
      const s = JSON.parse(localStorage.getItem(key) || "null");
      if (
        s &&
        s.values &&
        typeof s.values === "object" &&
        Number.isFinite(s.expires) &&
        s.expires > Date.now()
      )
        return s;
      localStorage.removeItem(key);
    } catch (e) {
      localStorage.removeItem(key);
    }
    return null;
  }
  function stopWatch() {
    clearTimeout(watchTimer);
    watchTimer = null;
    watchedUntil = 0;
  }
  function expire() {
    stopWatch();
    localStorage.removeItem(key);
    clearTabSession();
    window.dispatchEvent(new Event("tiza-session-expired"));
  }
  function checkDeadline() {
    if (!watchedUntil) return;
    if (Date.now() >= watchedUntil) {
      expire();
      return;
    }
    clearTimeout(watchTimer);
    watchTimer = setTimeout(checkDeadline, watchedUntil - Date.now());
  }
  window.FoodSession = {
    getItem(name) {
      const s = saved();
      return s
        ? s.values[name] || null
        : tabExpires()
          ? sessionStorage.getItem(name)
          : null;
    },
    removeItem(name) {
      const s = saved();
      if (s) {
        delete s.values[name];
        if (Object.keys(s.values).length)
          localStorage.setItem(key, JSON.stringify(s));
        else localStorage.removeItem(key);
      }
      sessionStorage.removeItem(name);
      if (!sessionStorage.getItem(sessionKeys[0]))
        sessionStorage.removeItem(expiresKey);
    },
    expiresAt() {
      const s = saved();
      return s ? s.expires : tabExpires();
    },
    save(user, proof, remember) {
      stopWatch();
      localStorage.removeItem(key);
      clearTabSession();
      const values = { tiza_school_session_v1: user.username };
      if (proof && proof.emailVerified)
        values.tiza_school_email_session_v1 = user.firebaseUid;
      const expires = Date.now() + duration;
      if (remember === true)
        localStorage.setItem(key, JSON.stringify({ expires, values }));
      else {
        for (const [name, value] of Object.entries(values))
          sessionStorage.setItem(name, value);
        sessionStorage.setItem(expiresKey, String(expires));
      }
    },
    watch(expiresAt) {
      stopWatch();
      if (Number.isFinite(expiresAt) && expiresAt > 0) {
        watchedUntil = expiresAt;
        checkDeadline();
      }
    },
    expire,
    stopWatch,
  };
  window.addEventListener("focus", checkDeadline);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) checkDeadline();
  });
  const banner = document.getElementById("cookieNotice"),
    status = document.getElementById("cookieChoiceStatus");
  function label() {
    const value = localStorage.getItem(choice);
    status.textContent =
      value === "accepted"
        ? "Preferencias aceptadas."
        : value === "rejected"
          ? "Cookies opcionales rechazadas."
          : "";
  }
  function choose(value) {
    localStorage.setItem(choice, value);
    banner.classList.add("hidden");
    label();
  }
  document
    .getElementById("cookieAccept")
    .addEventListener("click", () => choose("accepted"));
  document
    .getElementById("cookieReject")
    .addEventListener("click", () => choose("rejected"));
  document.getElementById("cookieSettings").addEventListener("click", () => {
    banner.classList.remove("hidden");
    document.getElementById("cookieReject").focus();
  });
  if (!["accepted", "rejected"].includes(localStorage.getItem(choice)))
    banner.classList.remove("hidden");
  label();
})();
