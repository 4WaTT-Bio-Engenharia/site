/* ============================================================
   4WaTT — Site Premium · módulo único de interações + movimento
   reveal · headline mask · counters · parallax · navbar+progresso
   · menu mobile · hero · accordion (FAQ) · funil · âncoras suaves
   Vanilla ES6 · sem dependências
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ready = function (fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  };

  /* ---------- Reveal + headline mask + stagger ---------- */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal], .h-reveal, [data-stagger]');
    if (!els.length) return;
    if (reduce) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Counters ---------- */
  function initCounters() {
    var els = document.querySelectorAll('[data-counter]');
    if (!els.length) return;
    function fmt(el, v) {
      return (el.dataset.prefix || '') + v.toLocaleString('pt-BR') + (el.dataset.suffix || '');
    }
    function run(el) {
      var target = parseFloat(el.dataset.counter) || 0;
      if (reduce) { el.textContent = fmt(el, target); return; }
      var dur = 1600, t0 = performance.now();
      (function tick(now) {
        var p = Math.min((now - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(el, Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick); else el.textContent = fmt(el, target);
      })(t0);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !en.target.dataset.done) { en.target.dataset.done = '1'; run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Parallax ---------- */
  function initParallax() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (!els.length || reduce || window.innerWidth < 760) return;
    var ticking = false;
    function update() {
      var vh = window.innerHeight, vc = vh / 2;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var speed = parseFloat(el.dataset.parallax) || 0.15;
        var center = r.top + r.height / 2;
        var offset = (center - vc) * -speed;
        el.style.setProperty('--py', offset.toFixed(1) + 'px');
      });
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ---------- Navbar: scrolled + barra de progresso ---------- */
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var bar = nav.querySelector('.nav__progress');
    var ticking = false;
    function update() {
      var y = window.scrollY || document.documentElement.scrollTop;
      nav.classList.toggle('is-scrolled', y > 24);
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Seletor de idioma ---------- */
  function initLangSelector() {
    var buttons = document.querySelectorAll('.lang-btn[data-lang]');
    if (!buttons.length) return;

    function setActive(lang) {
      buttons.forEach(function (b) {
        var active = b.dataset.lang === lang;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
      });
    }

    var saved = localStorage.getItem('preferredLang') || 'pt';
    setActive(saved);

    // Se o dicionário já estiver carregado, aplica traduções iniciais
    if (typeof window.applyTranslations === 'function') {
      window.applyTranslations(saved);
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.dataset.lang;
        if (typeof window.setLanguage === 'function') {
          window.setLanguage(lang);
        } else if (typeof window.changeLanguage === 'function') {
          window.changeLanguage(lang);
        } else {
          localStorage.setItem('preferredLang', lang);
          if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
        }
        setActive(lang);
      });
    });
  }

  /* ---------- Menu mobile ---------- */
  function initMenu() {
    var toggle = document.querySelector('.nav__toggle');
    var links = document.querySelector('.nav__links');
    if (!toggle || !links) return;
    var backdrop = document.querySelector('.nav__backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav__backdrop';
      document.body.appendChild(backdrop);
    }
    function close() {
      links.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      var i = toggle.querySelector('i'); if (i) i.className = 'fas fa-bars';
    }
    function open() {
      links.classList.add('is-open');
      backdrop.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var i = toggle.querySelector('i'); if (i) i.className = 'fas fa-xmark';
    }
    toggle.addEventListener('click', function () { links.classList.contains('is-open') ? close() : open(); });
    backdrop.addEventListener('click', close);
    links.querySelectorAll('a[href]').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------- Hero ready (vídeo) ---------- */
  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;
    var video = hero.querySelector('video');
    function set() { hero.classList.remove('is-loading'); hero.classList.add('is-ready'); }
    if (!video) { set(); return; }
    if (video.readyState >= 2) set();
    video.addEventListener('loadeddata', set, { once: true });
    video.addEventListener('canplay', set, { once: true });
    window.setTimeout(set, 2600);
  }

  /* ---------- Accordion (FAQ) ---------- */
  function initAccordion() {
    document.querySelectorAll('[data-accordion]').forEach(function (acc) {
      var items = acc.querySelectorAll('.acc-item');
      items.forEach(function (item) {
        var head = item.querySelector('.acc-head');
        if (!head) return;
        head.setAttribute('aria-expanded', 'false');
        head.addEventListener('click', function () {
          var isOpen = item.classList.contains('open');
          items.forEach(function (o) { o.classList.remove('open'); var h = o.querySelector('.acc-head'); if (h) h.setAttribute('aria-expanded', 'false'); });
          if (!isOpen) { item.classList.add('open'); head.setAttribute('aria-expanded', 'true'); }
        });
      });
    });
  }

  /* ---------- Funil: ativa etapas no scroll ---------- */
  function initFunnel() {
    var track = document.querySelector('[data-funnel]');
    if (!track) return;
    var steps = Array.prototype.slice.call(track.querySelectorAll('.step'));
    if (!steps.length) return;
    function setFill(idx) {
      var frac = steps.length > 1 ? (idx / (steps.length - 1)) : 1;
      track.style.setProperty('--fill', frac.toFixed(3));
    }
    if (reduce) { steps.forEach(function (s) { s.classList.add('is-active'); }); setFill(steps.length - 1); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var idx = steps.indexOf(en.target);
          steps.forEach(function (s, i) { s.classList.toggle('is-active', i <= idx); });
          setFill(idx);
        }
      });
    }, { threshold: 0.55, rootMargin: '0px 0px -12% 0px' });
    steps.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Âncoras suaves com offset da navbar ---------- */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      a.addEventListener('click', function (e) {
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }

  /* ---------- Marquee arrastável: auto-scroll contínuo + arraste/toque do usuário ----------
     Padrão para qualquer carrossel do site: envolver o conteúdo (já duplicado 2x
     para o loop) num wrapper com [data-marquee]. Opcional: data-marquee-speed
     (px por frame; padrão 0.55). Mouse arrasta a esteira; toque/trackpad usam o
     scroll nativo do wrapper; ambos pausam o auto-scroll enquanto o usuário interage. */
  function initDraggableMarquee(wrapper) {
    var track = wrapper.firstElementChild;
    if (!track) return;

    var speed = parseFloat(wrapper.getAttribute('data-marquee-speed')) || 0.55;
    var half = track.scrollWidth / 2;
    function measure() { half = track.scrollWidth / 2; }
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);

    var paused = false;
    var dragging = false;
    var startX = 0, startScroll = 0;
    var resumeTimer = null;

    function pauseFor(ms) {
      paused = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(function () { if (!dragging) paused = false; }, ms);
    }

    wrapper.addEventListener('mouseenter', function () { paused = true; });
    wrapper.addEventListener('mouseleave', function () { if (!dragging) paused = false; });

    wrapper.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      dragging = true;
      paused = true;
      startX = e.clientX;
      startScroll = wrapper.scrollLeft;
      wrapper.classList.add('is-dragging');
      try { wrapper.setPointerCapture(e.pointerId); } catch (err) { /* ignore: pointer already released */ }
    });
    wrapper.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      wrapper.scrollLeft = startScroll - (e.clientX - startX);
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      wrapper.classList.remove('is-dragging');
      pauseFor(2200);
    }
    wrapper.addEventListener('pointerup', endDrag);
    wrapper.addEventListener('pointercancel', endDrag);
    wrapper.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    wrapper.addEventListener('touchend', function () { pauseFor(2200); }, { passive: true });
    wrapper.addEventListener('wheel', function () { pauseFor(2200); }, { passive: true });

    if (reduce) return; // sem auto-scroll; o arraste/scroll nativo continua funcionando

    function tick() {
      if (half > 0 && !paused && !dragging) {
        wrapper.scrollLeft += speed;
        if (wrapper.scrollLeft >= half) wrapper.scrollLeft -= half;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initMarquees() {
    document.querySelectorAll('[data-marquee]').forEach(initDraggableMarquee);
  }

  ready(function () {
    initReveal();
    initCounters();
    initParallax();
    initNav();
    initMenu();
    initLangSelector();
    initHero();
    initAccordion();
    initFunnel();
    initAnchors();
    initMarquees();
  });
})();
