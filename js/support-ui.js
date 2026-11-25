/* Solicitudes del cliente. Las fotos solo se guardan en el servidor privado. */
(() => {
  const el = (id) => document.getElementById(id),
    panel = el("chatRefundPanel"),
    form = el("chatRefundForm");
  if (!panel || !form) return;
  let options = { orders: [], requests: [] },
    image = "",
    preparing = false,
    sending = false,
    selection = 0,
    challenge = null,
    challengeVersion = 0;
  const tell = (value) => {
    el("chatRefundMessage").textContent = value;
  };
  async function request(route, method = "GET", body) {
    const response = await fetch("api/support/" + route, {
      method,
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(25000),
    });
    if (response.status === 401) {
      FoodSession.expire();
      throw Error("Tu sesión terminó. Vuelve a iniciar sesión.");
    }
    const data = await response.json();
    if (!response.ok)
      throw Error(data.error || "No se pudo completar la solicitud.");
    return data;
  }
  function fill(select, rows, placeholder) {
    select.replaceChildren(new Option(placeholder, ""));
    for (const [value, label, disabled] of rows) {
      const option = new Option(label, value);
      option.disabled = !!disabled;
      select.add(option);
    }
  }
  function products() {
    clearEvidence();
    const order = options.orders.find(
      (o) => o.folio === el("chatRefundOrder").value,
    );
    fill(
      el("chatRefundProduct"),
      (order?.items || []).map((p) => [
        p.itemIndex,
        p.qty +
          " × " +
          p.name +
          " · reembolso 50%: $" +
          p.amount.toFixed(2) +
          (p.needsPhoto
            ? " · envía otra foto"
            : p.requested
              ? " · ya solicitado"
              : ""),
        p.requested || p.amount <= 0,
      ]),
      "Selecciona el producto",
    );
  }
  async function load() {
    options = await request("options");
    fill(
      el("chatRefundOrder"),
      options.orders.map((o) => [o.folio, o.folio]),
      "Selecciona un pedido entregado",
    );
    products();
    el("chatRefundNotice").textContent =
      "El jefe revisará tu foto y te avisaremos por este chat.";
    el("chatRefundPrivacy").textContent = options.aiAvailable
      ? "La foto se comparte con el restaurante y con Google para apoyar la revisión. Evita incluir datos personales."
      : "La foto solo estará disponible para ti y para el jefe. Evita incluir datos personales.";
    if (!options.orders.length)
      tell(
        "Aún no tienes pedidos entregados. Esta opción se habilita después de la entrega.",
      );
  }
  const summary = (r) =>
    "Solicitud " +
    r.id.slice(0, 8) +
    " · " +
    r.orderFolio +
    "\n" +
    (r.customerMessage || r.statusLabel) +
    (r.decisionNote && !["RECHAZADO", "FOTO_REQUERIDA"].includes(r.status)
      ? "\nMotivo: " + r.decisionNote
      : "") +
    (r.paymentReference
      ? "\nReferencia: " + (r.paymentReferenceLabel || r.paymentReference)
      : "");
  const account = () => window.TizaOrderChat?.customerAccount?.() || "";
  function clearEvidence() {
    challengeVersion++;
    selection++;
    challenge = null;
    image = "";
    preparing = false;
    el("chatRefundPhoto").value = "";
    el("chatRefundPhoto").disabled = true;
    el("chatRefundPreview").removeAttribute("src");
    el("chatRefundPreview").classList.add("hidden");
    el("chatRefundCode").textContent =
      "Selecciona un producto para obtener tu código.";
    el("chatRefundCodeExpiry").textContent = "";
  }
  async function prepareCode() {
    clearEvidence();
    const orderFolio = el("chatRefundOrder").value,
      selected = el("chatRefundProduct").value;
    if (!orderFolio || selected === "") return;
    const version = challengeVersion,
      email = account();
    el("chatRefundCode").textContent = "Obteniendo código…";
    try {
      const data = await request("evidence-code", "POST", {
        orderFolio,
        itemIndex: Number(selected),
      });
      if (version !== challengeVersion || account() !== email) return;
      challenge = data.challenge;
      el("chatRefundCode").textContent = challenge.code;
      el("chatRefundCodeExpiry").textContent =
        "Válido hasta " + new Date(challenge.expiresAt).toLocaleString("es-MX");
      el("chatRefundPhoto").disabled = false;
      tell(
        "Escribe este código en un papel y fotografíalo junto al producto y el empaque. El personal del restaurante debe poder leerlo.",
      );
    } catch (error) {
      if (version === challengeVersion) {
        el("chatRefundCode").textContent = "No se pudo obtener el código.";
        tell(error.message);
      }
    }
  }
  const stamp = (r) =>
    [r.status, r.updatedAt, r.coupon?.usedBy || ""].join(":");
  function seenRequests(email) {
    try {
      const value = JSON.parse(
        localStorage.getItem("tiza_refund_notices_v1:" + email) || "{}",
      );
      return value && typeof value === "object" && !Array.isArray(value)
        ? value
        : {};
    } catch (error) {
      return {};
    }
  }
  function remember(email, records) {
    const seen = seenRequests(email);
    for (const record of records) seen[record.id] = stamp(record);
    try {
      localStorage.setItem(
        "tiza_refund_notices_v1:" + email,
        JSON.stringify(seen),
      );
    } catch (error) {
      /* El servidor sigue conservando las solicitudes. */
    }
  }
  let checking = false;
  async function checkUpdates() {
    const email = account();
    if (!email || checking || sending || document.hidden) return;
    checking = true;
    try {
      const data = await request("options");
      if (account() !== email) return;
      window.TizaOrderChat.refreshRefundMessages?.(
        data.requests.map((r) => ({
          id: r.id,
          folio: r.orderFolio,
          text: summary(r),
        })),
      );
      if (data.wallet && el("clientWalletBalance"))
        el("clientWalletBalance").textContent =
          "Saldo a favor: $" + data.wallet.balance.toFixed(2);
      const seen = seenRequests(email);
      for (const record of data.requests)
        if (seen[record.id] !== stamp(record)) {
          window.TizaOrderChat.post(summary(record), {
            notify: true,
            folio: record.orderFolio,
            refundId: record.id,
            notifyText: record.customerMessage || record.statusLabel,
          });
        }
      remember(email, data.requests);
    } catch (error) {
      if (account() === email && el("clientWalletBalance"))
        el("clientWalletBalance").textContent =
          "Saldo a favor: no se pudo consultar. Vuelve a abrir Mis datos para actualizarlo.";
    } finally {
      checking = false;
    }
  }
  el("chatRefundOpen").addEventListener("click", async () => {
    panel.classList.remove("hidden");
    el("orderChatPanel").classList.add("refund-open");
    tell("Consultando tus pedidos…");
    try {
      await load();
      if (options.orders.length)
        tell("Selecciona el pedido y el producto que tuvo el problema.");
    } catch (error) {
      tell(error.message);
    }
  });
  el("chatRefundClose").addEventListener("click", () => {
    panel.classList.add("hidden");
    el("orderChatPanel").classList.remove("refund-open");
  });
  el("chatRefundHistory").addEventListener("click", async () => {
    const button = el("chatRefundHistory");
    button.disabled = true;
    try {
      const data = await request("options");
      window.TizaOrderChat.post(
        data.requests.length
          ? data.requests.map(summary).join("\n\n")
          : "Todavía no tienes solicitudes de reembolso.",
      );
      remember(account(), data.requests);
    } catch (error) {
      window.TizaOrderChat.post(error.message);
    } finally {
      button.disabled = false;
    }
  });
  el("chatRefundOrder").addEventListener("change", products);
  el("chatRefundProduct").addEventListener("change", prepareCode);
  el("chatRefundNewCode").addEventListener("click", prepareCode);
  el("chatRefundPhoto").addEventListener("change", async (event) => {
    const version = ++selection,
      file = event.target.files[0];
    image = "";
    preparing = !!file;
    el("chatRefundPreview").classList.add("hidden");
    el("chatRefundPreview").removeAttribute("src");
    if (!file) return;
    let url = "";
    try {
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 10 * 1024 * 1024
      )
        throw Error("Elige una foto JPG, PNG o WEBP de hasta 10 MB.");
      tell("Preparando foto…");
      url = URL.createObjectURL(file);
      const picture = new Image();
      await new Promise((resolve, reject) => {
        picture.onload = resolve;
        picture.onerror = () =>
          reject(Error("No se pudo abrir esa foto. Elige otra."));
        picture.src = url;
      });
      const scale = Math.min(
          1,
          1280 / Math.max(picture.naturalWidth, picture.naturalHeight),
        ),
        canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(picture.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(picture.naturalHeight * scale));
      const context = canvas.getContext("2d");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(picture, 0, 0, canvas.width, canvas.height);
      let prepared = canvas.toDataURL("image/jpeg", 0.78);
      if (prepared.length > 610000)
        prepared = canvas.toDataURL("image/jpeg", 0.45);
      if (prepared.length > 610000)
        throw Error("La foto sigue siendo muy pesada. Elige una más pequeña.");
      if (version !== selection) return;
      image = prepared;
      el("chatRefundPreview").src = image;
      el("chatRefundPreview").classList.remove("hidden");
      tell("Foto lista. Revisa el motivo antes de enviar.");
    } catch (error) {
      if (version === selection) {
        event.target.value = "";
        tell(error.message);
      }
    } finally {
      if (url) URL.revokeObjectURL(url);
      if (version === selection) preparing = false;
    }
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    if (!challenge || challenge.expiresAt <= Date.now()) {
      tell(
        "Obtén un código vigente e inclúyelo en una foto nueva junto al producto y el empaque.",
      );
      return;
    }
    if (preparing) {
      tell("Espera a que termine de prepararse la foto.");
      return;
    }
    if (!image) {
      tell("Adjunta una foto válida del producto.");
      return;
    }
    if (!el("chatRefundProduct").value || !el("chatRefundOrder").value) {
      tell("Selecciona un pedido entregado y un producto.");
      return;
    }
    const body = {
      orderFolio: el("chatRefundOrder").value,
      itemIndex: Number(el("chatRefundProduct").value),
      reason: el("chatRefundReason").value.trim(),
      photo: image,
      evidenceCodeId: challenge.id,
    };
    sending = true;
    el("chatRefundSubmit").disabled = true;
    tell("Guardando la evidencia para revisión del personal del restaurante…");
    try {
      const email = account();
      const data = await request("refunds", "POST", body);
      if (account() !== email) return;
      window.TizaOrderChat.post(summary(data.request), {
        notify: true,
        folio: data.request.orderFolio,
        refundId: data.request.id,
        notifyText: data.request.customerMessage || data.request.statusLabel,
      });
      remember(email, [data.request]);
      form.reset();
      image = "";
      selection++;
      el("chatRefundPreview").removeAttribute("src");
      el("chatRefundPreview").classList.add("hidden");
      await load();
      tell(
        data.duplicate
          ? "Esta solicitud ya estaba guardada. No se creó otra."
          : "Solicitud guardada. Consulta su estado en “Mis solicitudes”. Aprobar no significa que el dinero ya se devolvió.",
      );
    } catch (error) {
      tell(
        error.name === "TimeoutError"
          ? "La respuesta tardó demasiado. Consulta “Mis solicitudes” antes de volver a enviar; tu solicitud podría haberse guardado."
          : error.message,
      );
    } finally {
      sending = false;
      el("chatRefundSubmit").disabled = false;
    }
  });
  setTimeout(checkUpdates, 4000);
  setInterval(checkUpdates, 15000);
  window.addEventListener("focus", checkUpdates);
  window.addEventListener("tiza-chat-open", checkUpdates);
  window.addEventListener("tiza-account-open", checkUpdates);
  document.addEventListener("visibilitychange", checkUpdates);
})();
