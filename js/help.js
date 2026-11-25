(() => {
  const byId = (id) => document.getElementById(id);
  const guideModal = byId("quickGuideModal");
  if (!guideModal) return;

  const guideTitle = byId("guideTitle");
  const guideText = byId("guideText");
  const guideIcon = byId("guideIcon");
  const guideAudience = byId("guideAudience");
  const guideCount = byId("guideStepCount");
  const guideProgress = byId("guideProgress");
  const guideDots = byId("guideDots");
  const guideShot = byId("guideShot");
  const btnBack = byId("guideBack");
  const btnNext = byId("guideNext");
  const btnSkip = byId("guideSkip");

  const shots = {
    register: `
      <div class="guide-shot-frame">
        <div class="guide-shot-bar"><span></span><span></span><span></span></div>
        <div class="guide-shot-body guide-shot-form">
          <strong class="guide-shot-brand">Tiza Food</strong>
          <p class="guide-shot-label">Nombre</p><div class="guide-shot-field">María López</div>
          <p class="guide-shot-label">Correo</p><div class="guide-shot-field">maria@correo.com</div>
          <p class="guide-shot-label">Calle · Número · Colonia</p>
          <div class="guide-shot-row"><div class="guide-shot-field">Av. Juárez</div><div class="guide-shot-field">120</div></div>
          <div class="guide-shot-field">Centro</div>
          <p class="guide-shot-label">C.P. · Municipio · Estado</p>
          <div class="guide-shot-row"><div class="guide-shot-field">43800</div><div class="guide-shot-field">Tizayuca</div></div>
          <div class="guide-shot-btn">Entrar a la app</div>
        </div>
      </div>`,
    product: `
      <div class="guide-shot-frame">
        <div class="guide-shot-bar"><span></span><span></span><span></span></div>
        <div class="guide-shot-body">
          <div class="guide-shot-product">
            <div class="guide-shot-img">🍔</div>
            <b>Hamburguesa Clásica</b>
            <small>Carne, queso, lechuga y salsa especial</small>
            <div class="guide-shot-extras"><span>✓ Extra queso +$15</span><span>✓ Tocino +$20</span></div>
            <div class="guide-shot-qty">−  1  +</div>
            <div class="guide-shot-btn">Agregar · $74.00</div>
          </div>
        </div>
      </div>`,
    buy: `
      <div class="guide-shot-frame">
        <div class="guide-shot-bar"><span></span><span></span><span></span></div>
        <div class="guide-shot-body">
          <b>Tu carrito</b>
          <div class="guide-shot-card"><span>🍔</span><div><b>Clásica ×1</b><small>+ extra queso</small></div><em>$74</em></div>
          <div class="guide-shot-card"><span>🍟</span><div><b>Papas ×1</b><small>Grandes</small></div><em>$35</em></div>
          <div class="guide-shot-total">Subtotal $109 · Envío $19<br><strong>Total $128</strong></div>
          <div class="guide-shot-btn">Continuar pedido</div>
        </div>
      </div>`,
    pay: `
      <div class="guide-shot-frame">
        <div class="guide-shot-bar"><span></span><span></span><span></span></div>
        <div class="guide-shot-body">
          <b>Método de pago</b>
          <div class="guide-shot-pay on">💵 Efectivo <small>Pagas con $150 · cambio $22</small></div>
          <div class="guide-shot-pay">💳 Tarjeta <small>Demo · terminación 4242</small></div>
          <div class="guide-shot-pay">🏦 Transferencia <small>BBVA · referencia</small></div>
          <div class="guide-shot-btn">Confirmar pedido</div>
        </div>
      </div>`,
    ticket: `
      <div class="guide-shot-frame">
        <div class="guide-shot-bar"><span></span><span></span><span></span></div>
        <div class="guide-shot-body guide-shot-ticket">
          <strong>Ticket TF-2841</strong>
          <small>Entregado · Sucursal Centro</small>
          <hr>
          <p>1× Hamburguesa Clásica …… $74</p>
          <p>1× Papas Grandes …………… $35</p>
          <p>Envío ………………………… $19</p>
          <hr>
          <b>Total $128 · Efectivo</b>
          <div class="guide-shot-btn ghost">Guardar PDF</div>
        </div>
      </div>`,
    delivery: `
      <div class="guide-shot-frame">
        <div class="guide-shot-bar"><span></span><span></span><span></span></div>
        <div class="guide-shot-body">
          <b>Calificar entrega</b>
          <p class="guide-shot-label">Pedido TF-2841</p>
          <div class="guide-shot-stars">★ ★ ★ ★ ★</div>
          <p class="guide-shot-label">¿Cómo llegó el producto y el repartidor?</p>
          <div class="guide-shot-field tall">Llegó caliente y el repartidor fue muy amable.</div>
          <div class="guide-shot-btn">Guardar calificación</div>
        </div>
      </div>`,
    chat: `
      <div class="guide-shot-frame">
        <div class="guide-shot-bar"><span></span><span></span><span></span></div>
        <div class="guide-shot-body">
          <b>Chat de pedidos</b>
          <p class="guide-shot-label">Soporte Tiza Food</p>
          <div class="guide-shot-card"><span>🛵</span><div><b>¿Cómo va mi pedido?</b><small>Respuesta automática con el estado</small></div></div>
          <div class="guide-shot-btn">Abrir chat</div>
        </div>
      </div>`,
  };

  const steps = [
    {
      icon: "📝",
      title: "Crea tu cuenta e ingresa tus datos",
      text: "Escribe tu nombre, correo, contraseña y dirección completa (calle, número, colonia, C.P., municipio y estado). Con el C.P. se completan municipio y estado. Verifica tu correo con el enlace que recibes.",
      audience: "REGISTRO",
      shot: "register",
    },
    {
      icon: "🍔",
      title: "Explora el menú y el perfil del producto",
      text: "En Inicio elige una categoría o busca. Al tocar un platillo ves su descripción, precio, extras y reseñas. Personaliza cantidad y extras antes de agregarlo.",
      audience: "MENÚ",
      shot: "product",
    },
    {
      icon: "🛒",
      title: "Compra: carrito y entrega",
      text: "Revisa el carrito, elige sucursal y dirección. Puedes aplicar un cupón (TIZA10, ENVIOGRATIS, AHORRA20) y agregar instrucciones de entrega.",
      audience: "COMPRA",
      shot: "buy",
    },
    {
      icon: "💳",
      title: "Tipos de pago",
      text: "Paga con Efectivo (indica con cuánto pagas), Tarjeta (demo) o Transferencia (referencia). Antes de confirmar verás el resumen completo del pedido.",
      audience: "PAGO",
      shot: "pay",
    },
    {
      icon: "🎫",
      title: "Ticket y seguimiento",
      text: "Al confirmar se genera tu ticket. En Mis pedidos sigues el estado: Recibido → En preparación → En camino → Entregado. Puedes guardar el ticket en PDF.",
      audience: "TICKET",
      shot: "ticket",
    },
    {
      icon: "💬",
      title: "Chat de estado del pedido",
      text: "En la barra superior toca el ícono de mensaje para abrir el chat. Pregunta por el estado de tu pedido y recibirás una respuesta con el folio y la etapa actual.",
      audience: "CHAT",
      shot: "chat",
    },
    {
      icon: "⭐",
      title: "Califica producto y entrega",
      text: "En Reseñas calificas platillos. Cuando el pedido esté Entregado, en el seguimiento valoras al repartidor y cómo llegó el producto. Se guarda y lo ve el restaurante.",
      audience: "RESEÑAS",
      shot: "delivery",
    },
  ];

  let cur = 0;
  let previousFocus = null;

  function render(i) {
    cur = i;
    const s = steps[i];
    if (guideTitle) guideTitle.textContent = s.title;
    if (guideText) guideText.textContent = s.text;
    if (guideIcon) guideIcon.textContent = s.icon;
    if (guideAudience) guideAudience.textContent = s.audience;
    if (guideCount)
      guideCount.textContent = "PASO " + (i + 1) + " DE " + steps.length;
    if (guideProgress)
      guideProgress.style.width = ((i + 1) / steps.length) * 100 + "%";
    if (guideShot) {
      guideShot.innerHTML = shots[s.shot] || shots.product;
      guideShot.classList.add("step-in");
      setTimeout(function () {
        guideShot.classList.remove("step-in");
      }, 350);
    }
    const content = byId("guideContent");
    if (content) {
      content.classList.remove("step-in");
      void content.offsetWidth;
      content.classList.add("step-in");
    }
    if (guideDots) {
      guideDots.innerHTML = "";
      steps.forEach(function (_, idx) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "guide-dot" + (idx === i ? " active" : "");
        if (idx === i) b.setAttribute("aria-current", "step");
        b.setAttribute("aria-label", "Paso " + (idx + 1));
        b.addEventListener("click", function () {
          render(idx);
        });
        guideDots.appendChild(b);
      });
    }
    if (btnBack) {
      btnBack.style.visibility = i === 0 ? "hidden" : "visible";
      btnBack.disabled = i === 0;
    }
    if (btnNext)
      btnNext.textContent = i === steps.length - 1 ? "¡Listo!" : "Siguiente →";
  }

  function openGuide() {
    previousFocus = document.activeElement;
    render(0);
    guideModal.setAttribute("aria-hidden", "false");
    guideModal.classList.add("open");
    guideModal.style.zIndex = "220";
    document.body.classList.add("modal-open");
    try {
      if (btnNext) btnNext.focus();
    } catch (e) {
      /* */
    }
  }

  function closeGuide() {
    guideModal.setAttribute("aria-hidden", "true");
    guideModal.classList.remove("open", "show", "is-open");
    document.body.classList.remove("modal-open");
    try {
      localStorage.setItem("tizafood_quickguide_v2_cliente", "1");
    } catch (e) {
      /* */
    }
    if (previousFocus && typeof previousFocus.focus === "function") {
      try {
        previousFocus.focus();
      } catch (e) {
        /* */
      }
    }
  }

  if (btnBack)
    btnBack.addEventListener("click", function () {
      if (cur > 0) render(cur - 1);
    });
  if (btnNext)
    btnNext.addEventListener("click", function () {
      if (cur < steps.length - 1) render(cur + 1);
      else closeGuide();
    });
  if (btnSkip) btnSkip.addEventListener("click", closeGuide);
  guideModal.addEventListener("click", function (e) {
    if (e.target === guideModal) closeGuide();
  });
  document.querySelectorAll("[data-guide-close]").forEach(function (b) {
    b.addEventListener("click", closeGuide);
  });
  window.addEventListener("keydown", function (e) {
    if (!guideModal.classList.contains("open")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeGuide();
    } else if (e.key === "ArrowRight" && cur < steps.length - 1) {
      render(cur + 1);
    } else if (e.key === "ArrowLeft" && cur > 0) {
      render(cur - 1);
    }
  });

  function bindHelpButtons() {
    var selectors = [
      "#btnWelcomeGuide",
      "#btnRegisterGuide",
      "#btnAyuda",
      "#btnHelp",
      "#helpBtn",
      "#btnAppGuide",
      "#btnQuickGuide",
      ".help-fab",
      ".btn-ayuda",
      "[data-open-guide]",
    ];
    var seen = new Set();
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (btn) {
        if (seen.has(btn)) return;
        seen.add(btn);
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          openGuide();
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindHelpButtons);
  } else {
    bindHelpButtons();
  }
  setTimeout(bindHelpButtons, 500);

  // Primera visita del cliente: abrir la guía una sola vez (suave)
  setTimeout(function () {
    try {
      if (localStorage.getItem("tizafood_quickguide_v2_cliente") === "1")
        return;
      const app = byId("app");
      if (
        app &&
        !app.classList.contains("hidden") &&
        !guideModal.classList.contains("open")
      ) {
        openGuide();
      }
    } catch (e) {
      /* */
    }
  }, 1200);

  // Asegura el ? de bienvenida y registro aunque haya otros listeners
  function bindWelcomeGuideDirect() {
    ["btnWelcomeGuide", "btnRegisterGuide"].forEach(function (id) {
      var btn = byId(id);
      if (!btn || btn.dataset.guideBound === "1") return;
      btn.dataset.guideBound = "1";
      btn.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopPropagation();
          openGuide();
        },
        true,
      );
    });
  }
  bindWelcomeGuideDirect();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindWelcomeGuideDirect);
  }
  setTimeout(bindWelcomeGuideDirect, 300);
  setTimeout(bindWelcomeGuideDirect, 1200);

  window.openGuide = openGuide;
  window.closeGuide = closeGuide;
})();
