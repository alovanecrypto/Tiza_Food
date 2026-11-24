(() => {
  const el = (id) => document.getElementById(id);
  let pending = null,
    current = null,
    version = 0,
    busy = false;
  const selected = new Set();
  const descriptions = {
    register: {
      step: "Crear cuenta · Paso 2 de 2",
      description:
        "Un último paso: completa el reto de seguridad para crear tu cuenta.",
      confirm: "Verificar y crear cuenta",
      back: "← Volver a mis datos",
    },
    login: {
      step: "Iniciar sesión",
      description: "Completa el reto de seguridad para acceder a tu cuenta.",
      confirm: "Verificar e iniciar sesión",
      back: "← Volver",
    },
    review: {
      step: "Publicar calificación",
      description: "Completa el reto de seguridad para enviar tu opinión.",
      confirm: "Verificar y publicar",
      back: "← Volver a mi comentario",
    },
  };
  let background = [],
    previousFocus = null;
  function renderChallenge(data) {
    selected.clear();
    el("captchaGrid").replaceChildren();
    const visual = data.type === "images",
      math = data.type === "math";
    el("captchaGrid").classList.toggle("hidden", !visual);
    el("captchaTextGroup").classList.toggle("hidden", visual);
    el("captchaImage").classList.toggle("hidden", visual);
    el("captchaPrompt").textContent =
      data.prompt || "Escribe los 6 caracteres de la imagen.";
    el("captchaAnswerLabel").textContent = math
      ? "Resultado de la operación"
      : "Caracteres de la imagen";
    el("captchaAnswer").maxLength = math ? 3 : 6;
    el("captchaAnswer").inputMode = math ? "numeric" : "text";
    if (visual) {
      data.cells.forEach((cell, index) => {
        const button = document.createElement("button"),
          img = document.createElement("img");
        button.type = "button";
        button.className = "captcha-tile";
        button.setAttribute("aria-label", "Imagen " + (index + 1));
        button.setAttribute("aria-pressed", "false");
        img.src = cell.image;
        img.alt = "";
        img.width = 100;
        img.height = 100;
        button.append(img);
        button.addEventListener("click", () => {
          if (busy) return;
          selected.has(cell.id)
            ? selected.delete(cell.id)
            : selected.add(cell.id);
          button.setAttribute("aria-pressed", String(selected.has(cell.id)));
        });
        el("captchaGrid").append(button);
      });
      el("captchaStatus").textContent =
        "Marca todas las imágenes que correspondan y pulsa Verificar.";
    } else {
      el("captchaImage").src = data.image;
      el("captchaImage").alt = math
        ? "Operación matemática para resolver"
        : "Código de verificación de seis caracteres";
      el("captchaStatus").textContent = math
        ? "Escribe solo el resultado en números."
        : "Son 6 caracteres. Puedes usar mayúsculas o minúsculas.";
    }
  }
  function close() {
    version++;
    current = null;
    selected.clear();
    el("captchaScreen").classList.add("hidden");
    el("captchaScreen").setAttribute("aria-hidden", "true");
    background.forEach((node) => node.removeAttribute("inert"));
    background = [];
    el("captchaAnswer").value = "";
    if (previousFocus?.isConnected) previousFocus.focus();
    const focusTarget = previousFocus;
    setTimeout(() => {
      if (!pending && focusTarget?.isConnected) focusTarget.focus();
    }, 0);
  }
  function cancel() {
    if (!pending) return;
    const task = pending;
    pending = null;
    close();
    busy = false;
    if (!previousFocus?.isConnected && task.purpose !== "review")
      el("rPassword").focus();
    task.reject(Error("Verificación cancelada. Tus datos se conservaron."));
  }
  async function refresh() {
    const generation = ++version;
    current = null;
    selected.clear();
    el("captchaGrid").replaceChildren();
    el("captchaAnswer").value = "";
    el("captchaImage").removeAttribute("src");
    el("captchaRefresh").disabled = true;
    el("captchaStatus").textContent = "Preparando código…";
    const controller = new AbortController(),
      timer = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(
        "api/captcha?type=auto&purpose=" + encodeURIComponent(pending.purpose),
        {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        },
      );
      const data = await res.json();
      if (!res.ok)
        throw Error(data.error || "No se pudo cargar la verificación.");
      if (generation !== version || !pending) return;
      current = data;
      renderChallenge(data);
    } catch (error) {
      if (generation === version && pending)
        el("captchaStatus").textContent =
          error.name === "AbortError"
            ? "La verificación tardó demasiado. Pulsa Cambiar código."
            : error.message || "No se pudo cargar. Pulsa Cambiar código.";
    } finally {
      clearTimeout(timer);
      if (generation === version) el("captchaRefresh").disabled = false;
    }
  }
  function request(purpose = "register") {
    if (pending)
      return Promise.reject(Error("Ya hay una verificación abierta."));
    if (!descriptions[purpose])
      return Promise.reject(Error("Verificación inválida."));
    return new Promise((resolve, reject) => {
      pending = { resolve, reject, purpose };
      busy = false;
      const copy = descriptions[purpose];
      el("captchaStep").textContent = copy.step;
      el("captchaDescription").textContent = copy.description;
      el("captchaConfirm").textContent = copy.confirm;
      el("captchaBack").textContent = copy.back;
      el("captchaConfirm").disabled = false;
      el("captchaRefresh").disabled = false;
      el("captchaError").textContent = "";
      previousFocus = document.activeElement;
      background = [...document.body.children].filter(
        (node) =>
          node !== el("captchaScreen") &&
          !node.hasAttribute("inert") &&
          !["SCRIPT", "STYLE"].includes(node.tagName),
      );
      background.forEach((node) => node.setAttribute("inert", ""));
      el("captchaScreen").classList.remove("hidden");
      el("captchaScreen").setAttribute("aria-hidden", "false");
      el("captchaScreen").scrollTop = 0;
      void refresh().then(() => {
        if (pending)
          (current?.type === "images"
            ? el("captchaConfirm")
            : el("captchaAnswer")
          ).focus();
      });
    });
  }
  function fields() {
    if (!pending || !current)
      throw Error("Obtén el código de verificación para continuar.");
    if (Date.now() >= current.expiresAt) {
      void refresh();
      throw Error("El código venció. Escribe el nuevo código.");
    }
    if (current.type === "images") {
      if (!selected.size)
        throw Error("Selecciona las imágenes que correspondan.");
      return { captchaId: current.id, captchaSelection: [...selected] };
    }
    const answer = el("captchaAnswer").value.trim();
    if (
      current.type === "math"
        ? !/^(?:0|[1-9]\d{0,2})$/.test(answer)
        : answer.length !== 6
    ) {
      el("captchaAnswer").focus();
      throw Error(
        current.type === "math"
          ? "Escribe el resultado de la operación."
          : "Escribe los 6 caracteres de la imagen.",
      );
    }
    return { captchaId: current.id, captchaAnswer: answer };
  }
  el("captchaForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy || !pending) return;
    const task = pending;
    el("captchaError").textContent = "";
    let body;
    try {
      body = fields();
    } catch (error) {
      el("captchaError").textContent = error.message;
      return;
    }
    busy = true;
    el("captchaConfirm").disabled = true;
    el("captchaRefresh").disabled = true;
    el("captchaConfirm").textContent = "Verificando…";
    const controller = new AbortController(),
      timer = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch("api/captcha/verify", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const data = await res.json();
      if (pending !== task) return;
      if (!res.ok) throw Error(data.error || "No se pudo verificar el código.");
      pending = null;
      close();
      task.resolve({ captchaTicket: data.ticket });
    } catch (error) {
      if (pending === task) {
        el("captchaError").textContent =
          error.name === "AbortError"
            ? "La verificación tardó demasiado. Inténtalo de nuevo."
            : error.message;
        if (/venció|usó|agotaron|navegador/.test(error.message)) void refresh();
      }
    } finally {
      clearTimeout(timer);
      if (!pending || pending === task) {
        busy = false;
        el("captchaConfirm").disabled = false;
        el("captchaRefresh").disabled = false;
        el("captchaConfirm").textContent =
          descriptions[pending?.purpose || task.purpose].confirm;
      }
    }
  });
  el("captchaRefresh").addEventListener("click", () => {
    if (busy) return;
    el("captchaError").textContent = "";
    void refresh().then(() => el("captchaAnswer").focus());
  });
  el("captchaBack").addEventListener("click", cancel);
  window.addEventListener(
    "keydown",
    (event) => {
      if (!pending) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        cancel();
      } else if (event.key === "Tab") {
        const controls = [
          ...el("captchaScreen").querySelectorAll(
            "button:not(:disabled), input:not(:disabled)",
          ),
        ].filter((node) => node.getClientRects().length);
        const first = controls[0],
          last = controls[controls.length - 1];
        if (
          first &&
          (event.shiftKey
            ? document.activeElement === first
            : document.activeElement === last)
        ) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }
    },
    true,
  );
  window.FoodCaptcha = {
    request,
    cancel,
    fields,
    refresh,
    isOpen: () => !!pending,
  };
})();
