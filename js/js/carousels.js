(function (root) {
  "use strict";
  const mounted = new WeakMap();
  function mount(section, viewport) {
    if (!section || !viewport || mounted.has(section)) return;
    const previous = section.querySelector("[data-carousel-prev]");
    const next = section.querySelector("[data-carousel-next]");
    const pause = section.querySelector("[data-carousel-pause]");
    const reduced = root.matchMedia("(prefers-reduced-motion: reduce)");
    let paused = false;
    let touchedUntil = 0;
    let touching = false;
    const originals = Array.from(viewport.firstElementChild?.children || []);
    const clones = originals.map((original) => {
      const clone = original.cloneNode(true);
      clone.classList.add("carousel-clone");
      clone.setAttribute("aria-hidden", "true");
      clone.tabIndex = -1;
      clone
        .querySelectorAll("button, a, input, select, textarea, [tabindex]")
        .forEach((element) => {
          element.tabIndex = -1;
        });
      if (original.getAttribute("role") === "button")
        clone.addEventListener("click", () => original.click());
      viewport.firstElementChild.appendChild(clone);
      return clone;
    });
    const cycleWidth = () =>
      !reduced.matches && clones.length
        ? clones[0].offsetLeft - originals[0].offsetLeft
        : 0;
    function move(direction) {
      const end = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const cards = originals;
      if (!cards.length || end < 2) return;
      const cycle = cycleWidth();
      const left = cycle ? viewport.scrollLeft % cycle : viewport.scrollLeft;
      const positions = cards.map(
        (card) => card.offsetLeft - cards[0].offsetLeft,
      );
      const target =
        direction > 0
          ? left >= positions[positions.length - 1] - 2
            ? 0
            : (positions.find((position) => position > left + 2) ?? end)
          : left <= 2
            ? positions[positions.length - 1]
            : (positions.filter((position) => position < left - 2).pop() ?? 0);
      viewport.scrollTo({
        left: target,
        behavior: reduced.matches ? "instant" : "smooth",
      });
      touchedUntil = Date.now() + 1400;
    }
    function paint() {
      pause.textContent = reduced.matches
        ? "Sin animación"
        : paused
          ? "Reanudar"
          : "Pausar";
      pause.disabled = reduced.matches;
      viewport.classList.toggle("carousel-moving", !paused && !reduced.matches);
      clones.forEach((clone) => {
        clone.hidden = reduced.matches;
      });
      pause.setAttribute("aria-pressed", String(paused || reduced.matches));
      pause.setAttribute(
        "aria-label",
        reduced.matches
          ? "Movimiento automático desactivado"
          : paused
            ? "Reanudar carrusel"
            : "Pausar carrusel",
      );
    }
    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    pause.addEventListener("click", () => {
      paused = !paused;
      paint();
    });
    section.addEventListener(
      "pointerdown",
      (event) => {
        touching = event.pointerType === "touch";
        touchedUntil = Date.now() + 1400;
      },
      { passive: true },
    );
    ["pointerup", "pointercancel"].forEach((name) =>
      root.addEventListener(
        name,
        () => {
          touching = false;
        },
        { passive: true },
      ),
    );
    viewport.addEventListener("keydown", (event) => {
      if (
        event.target !== viewport ||
        !["ArrowLeft", "ArrowRight"].includes(event.key)
      )
        return;
      event.preventDefault();
      move(event.key === "ArrowRight" ? 1 : -1);
    });
    viewport.addEventListener("wheel", () => {
      touchedUntil = Date.now() + 1400;
    }, {passive:true});
    reduced.addEventListener("change", paint);
    let lastFrame = null;
    let position = viewport.scrollLeft;
    function frame(now) {
      const elapsed = lastFrame === null ? 0 : Math.min(64, now - lastFrame);
      lastFrame = now;
      root.requestAnimationFrame(frame);
      if (
        paused ||
        reduced.matches ||
        touching ||
        Date.now() < touchedUntil ||
        document.hidden
      ) {
        position = viewport.scrollLeft;
        return;
      }
      const rect = viewport.getBoundingClientRect();
      if (!rect.width || rect.bottom <= 0 || rect.top >= root.innerHeight)
        return;
      const cycle = cycleWidth();
      if (cycle <= viewport.clientWidth) return;
      // Acumula fracciones para que también avance en pantallas con píxeles enteros.
      if (Math.abs(position - viewport.scrollLeft) > 2)
        position = viewport.scrollLeft;
      position = (position + elapsed * 0.028) % cycle;
      viewport.scrollLeft = position;
    }
    mounted.set(section, true);
    paint();
    root.requestAnimationFrame(frame);
  }
  root.FoodCarousels = { mount };
})(window);
