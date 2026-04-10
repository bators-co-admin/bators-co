/* ═══════════════════════════════════════════════════════════════
   Bators CO — main.js
   Extraído de bators_home_mockup.html y bators_eventos_mockup.html
═══════════════════════════════════════════════════════════════ */

/* ── COUNTER ANIMATION ─────────────────────────────────────────
   Usa IntersectionObserver para disparar el conteo cuando el
   elemento entra al viewport. Easing ease-out cúbico, 1.4s.
   Respeta prefers-reduced-motion.
────────────────────────────────────────────────────────────── */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1400;
    const start    = performance.now();

    if (reduced) { el.textContent = target + suffix; return; }

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('.stat-val-num[data-target]');
  const seen     = new Set();

  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          /* pequeño delay para que coincida con el fadeUp del panel */
          setTimeout(() => animateCounter(entry.target), 300);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(el => observer.observe(el));
  }
})();

/* ── FAQ ACCORDION ─────────────────────────────────────────────
   Un solo ítem abierto a la vez. Actualiza aria-expanded.
────────────────────────────────────────────────────────────── */
(function () {
  const questions = document.querySelectorAll('.faq-question');
  if (!questions.length) return;

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      /* Cierra todos */
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      /* Abre el clickeado si estaba cerrado */
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ── MOBILE NAV TOGGLE ─────────────────────────────────────────
   Activa/desactiva menú móvil. Maneja aria-expanded.
────────────────────────────────────────────────────────────── */
(function () {
  const toggle = document.querySelector('.bn-nav-toggle');
  const links  = document.querySelector('.bn-nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Cierra el menú al hacer click fuera */
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
