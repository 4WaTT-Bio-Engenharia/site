(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  /* ---------- Antes/Depois: slider por arraste ---------- */
  function initCompare(frame) {
    var setPos = function (clientX) {
      var rect = frame.getBoundingClientRect();
      var pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      frame.style.setProperty('--cc-pos', pct + '%');
    };

    var dragging = false;

    frame.addEventListener('pointerdown', function (e) {
      dragging = true;
      frame.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });
    frame.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      setPos(e.clientX);
    });
    frame.addEventListener('pointerup', function () { dragging = false; });
    frame.addEventListener('pointercancel', function () { dragging = false; });

    frame.setAttribute('tabindex', '0');
    frame.setAttribute('role', 'slider');
    frame.setAttribute('aria-valuemin', '0');
    frame.setAttribute('aria-valuemax', '100');
    frame.addEventListener('keydown', function (e) {
      var current = parseFloat(getComputedStyle(frame).getPropertyValue('--cc-pos')) || 50;
      if (e.key === 'ArrowLeft') { current = Math.max(0, current - 5); frame.style.setProperty('--cc-pos', current + '%'); e.preventDefault(); }
      if (e.key === 'ArrowRight') { current = Math.min(100, current + 5); frame.style.setProperty('--cc-pos', current + '%'); e.preventDefault(); }
    });
  }

  /* ---------- Galeria: lightbox ---------- */
  function initGallery() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.cc-g-item'));
    if (!items.length) return;

    var lightbox = document.getElementById('cc-lightbox');
    if (!lightbox) return;

    var imgEl = lightbox.querySelector('.cc-lightbox__img');
    var capEl = lightbox.querySelector('.cc-lightbox__cap');
    var closeBtn = lightbox.querySelector('.cc-lightbox__close');
    var prevBtn = lightbox.querySelector('.cc-lightbox__nav--prev');
    var nextBtn = lightbox.querySelector('.cc-lightbox__nav--next');
    var index = 0;
    var lastFocused = null;

    function show(i) {
      index = (i + items.length) % items.length;
      var item = items[index];
      var img = item.querySelector('img');
      imgEl.src = img.getAttribute('src');
      imgEl.alt = img.getAttribute('alt') || '';
      capEl.textContent = img.getAttribute('alt') || '';
    }

    function open(i) {
      lastFocused = document.activeElement;
      show(i);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    items.forEach(function (item, i) {
      item.addEventListener('click', function () { open(i); });
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(index - 1); });
    nextBtn.addEventListener('click', function () { show(index + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  ready(function () {
    document.querySelectorAll('[data-compare]').forEach(initCompare);
    initGallery();
  });
})();
