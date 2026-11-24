(() => {
  const el = (id) => document.getElementById(id),
    token = new URLSearchParams(location.hash.slice(1)).get("token");
  let watch = null,
    busy = false,
    lastSent = 0,
    finished = false,
    arrivalSent = false,
    sharingId = "",
    starting = false;
  async function api(action, body = {}) {
    const response = await fetch("api/delivery/" + action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...body }),
      signal: AbortSignal.timeout(10000),
    });
    const data = await response.json();
    if (!response.ok)
      throw Object.assign(Error(data.error), { status: response.status });
    return data;
  }
  function stopWatch() {
    if (watch !== null) navigator.geolocation.clearWatch(watch);
    watch = null;
    el("deliveryStop").disabled = true;
    el("deliveryStart").disabled = finished;
  }
  async function info() {
    try {
      const order = await api("info");
      if (finished && order.status !== "Entregado") return;
      el("deliveryTitle").textContent = "Pedido " + order.folio;
      el("deliveryAddress").textContent = order.address;
      const waiting = order.status === "Listo para enviar";
      el("riderPickup").classList.toggle(
        "hidden",
        !waiting || !order.pickupCode,
      );
      el("riderPickupCode").textContent = waiting ? order.pickupCode || "" : "";
      el("riderDeliveryForm").classList.toggle(
        "hidden",
        order.status !== "En camino",
      );
      el("riderArrival").classList.toggle(
        "hidden",
        order.status !== "En camino",
      );
      if (order.riderArrived) showArrivalSent();
      if (waiting) {
        stopWatch();
        el("deliveryStart").disabled = true;
        el("deliveryStatus").textContent =
          "Pedido listo. Muestra tu código al empleado para confirmar el retiro.";
        return;
      }
      if (order.status !== "En camino") {
        finished = true;
        stopWatch();
        el("deliveryStatus").textContent =
          order.status === "Entregado"
            ? "Entrega completada. Se dejó de compartir la ubicación."
            : "El pedido ya no está en reparto.";
        return;
      }
      el("deliveryStart").disabled = watch !== null;
      if (watch === null)
        el("deliveryStatus").textContent =
          "Listo para compartir tu ubicación durante esta entrega.";
      el("deliveryDirections").classList.remove("hidden");
      el("deliveryDirections").href =
        "https://www.google.com/maps/dir/?api=1&destination=" +
        encodeURIComponent(order.coords || order.address);
    } catch (error) {
      el("deliveryError").textContent = error.message;
      if ([401, 409].includes(error.status)) {
        finished = true;
        stopWatch();
        el("riderArrival").classList.add("hidden");
        el("riderDeliveryForm").classList.add("hidden");
      }
    }
  }
  el("deliveryStart").addEventListener("click", async () => {
    if (watch !== null || finished || starting) return;
    if (!window.isSecureContext) {
      el("deliveryError").textContent =
        "Abre el enlace HTTPS de la app para compartir tu ubicación desde el celular.";
      return;
    }
    if (!navigator.geolocation) {
      el("deliveryError").textContent =
        "Este navegador no permite compartir ubicación.";
      return;
    }
    starting = true;
    try {
      sharingId = (await api("start")).sharingId;
      lastSent = 0;
    } catch (error) {
      el("deliveryError").textContent = error.message;
      return;
    } finally {
      starting = false;
    }
    el("deliveryError").textContent = "";
    el("deliveryStart").disabled = true;
    el("deliveryStop").disabled = false;
    el("deliveryStatus").textContent = "Buscando la señal GPS…";
    watch = navigator.geolocation.watchPosition(
      async (position) => {
        if (busy || Date.now() - lastSent < 8000 || watch === null) return;
        busy = true;
        try {
          const result = await api("location", {
            sharingId,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          if (watch === null) return;
          lastSent = Date.now();
          el("deliveryError").textContent = "";
          el("deliveryStatus").textContent =
            (result.arriving
              ? "Estás junto al destino. Entrega la comida y pide al cliente su código."
              : result.near
                ? "Estás cerca. El cliente ya puede ver el mapa."
                : "Ubicación compartida. El cliente verá el mapa cuando estés cerca.") +
            " Precisión: " +
            Math.round(position.coords.accuracy) +
            " m.";
        } catch (error) {
          if (watch === null) return;
          el("deliveryError").textContent = error.message;
          if ([401, 409].includes(error.status)) {
            finished = true;
            stopWatch();
          }
        } finally {
          busy = false;
        }
      },
      (error) => {
        el("deliveryError").textContent =
          error.code === 1
            ? "Permiso de ubicación denegado. Actívalo en el navegador para continuar."
            : "No se pudo obtener una señal GPS. Busca una zona con mejor recepción e inténtalo de nuevo.";
        stopWatch();
        void api("stop").catch(() => {});
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );
  });
  el("deliveryStop").addEventListener("click", async () => {
    stopWatch();
    try {
      await api("stop");
      el("deliveryStatus").textContent = "Dejaste de compartir tu ubicación.";
    } catch (error) {
      el("deliveryError").textContent = error.message;
    }
  });
  function showArrivalSent() {
    arrivalSent = true;
    el("riderArrive").disabled = true;
    el("riderArrive").textContent = "Llegada avisada";
    el("riderArrivalMessage").textContent =
      "Le avisamos al cliente que estás afuera. Cuando reciba su pedido, pídele el código.";
  }
  el("riderArrive").addEventListener("click", async () => {
    const button = el("riderArrive"),
      message = el("riderArrivalMessage");
    if (finished || button.disabled) return;
    button.disabled = true;
    message.textContent = "Avisando al cliente…";
    try {
      await api("arrive");
      if (!finished) showArrivalSent();
    } catch (error) {
      if (!finished && !arrivalSent) message.textContent = error.message;
    } finally {
      button.disabled = finished || arrivalSent;
    }
  });
  el("riderDeliveryForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = el("riderConfirmDelivery"),
      code = el("riderDeliveryCode").value.trim();
    if (button.disabled) return;
    if (!/^\d{4}$/.test(code)) {
      el("riderCodeMessage").textContent =
        "Escribe los 4 dígitos del código del cliente.";
      return;
    }
    button.disabled = true;
    el("riderCodeMessage").textContent = "Verificando entrega…";
    try {
      await api("confirm", { code });
      finished = true;
      stopWatch();
      el("riderDeliveryCode").value = "";
      el("riderArrival").classList.add("hidden");
      el("riderDeliveryForm").classList.add("hidden");
      el("deliveryStatus").textContent =
        "Entrega completada. Código del cliente verificado.";
      el("deliveryError").textContent = "";
      el("deliveryDirections").classList.add("hidden");
      el("riderCodeMessage").textContent = "";
    } catch (error) {
      el("riderCodeMessage").textContent = error.message;
      void info();
    } finally {
      button.disabled = false;
    }
  });
  window.addEventListener("pagehide", () => {
    if (watch !== null) {
      stopWatch();
      void fetch("api/delivery/stop", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }).catch(() => {});
    }
  });
  void info();
  setInterval(() => {
    if (!finished) void info();
  }, 5000);
})();
