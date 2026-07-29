/* ============================================================
   4WaTT — Animations JS
   Versão 1.0 · Março 2026
   IntersectionObserver nativo — sem dependências externas
   ============================================================ */

(function() {
  'use strict';

  // Respeitar preferência de movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Scroll Reveal ---
  function initScrollReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    if (prefersReducedMotion) {
      elements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  // --- Counter Animation ---
  function animateCounter(el, target, duration = 2000) {
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const start = 0;
    const startTime = performance.now();

    // Easing out cubic
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.round(start + (target - start) * easedProgress);

      el.textContent = prefix + current.toLocaleString('pt-BR') + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = prefix + target.toLocaleString('pt-BR') + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    if (prefersReducedMotion) {
      counters.forEach(el => {
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        el.textContent = prefix + target.toLocaleString('pt-BR') + suffix;
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          const target = parseInt(entry.target.dataset.counter, 10);
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    counters.forEach(el => observer.observe(el));
  }

  // --- Logo Marquee (fallback para CSS puro) ---
  function initLogoMarquee() {
    const strips = document.querySelectorAll('.logo-strip__track');
    strips.forEach(track => {
      // Duplicar os itens para criar o loop infinito
      const items = track.innerHTML;
      track.innerHTML = items + items;
    });
  }

  // --- Parallax suave no hero ---
  function initHeroParallax() {
    const heroVideo = document.querySelector('.hero-media');
    if (!heroVideo || prefersReducedMotion) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroVideo.style.transform = `translateY(${scrolled * 0.35}px)`;
    }, { passive: true });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCounters();
    initLogoMarquee();
    initHeroParallax();
  });

  // Expor para uso externo
  window.FourWaTT = window.FourWaTT || {};
  window.FourWaTT.initScrollReveal = initScrollReveal;
  window.FourWaTT.initCounters = initCounters;

})();
