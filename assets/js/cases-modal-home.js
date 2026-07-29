(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function getModal() {
    return {
      modal: document.getElementById('cases-modal'),
      backdrop: document.querySelector('.cases-modal__backdrop[data-close="true"]'),
      closeBtn: document.querySelector('.cases-modal__close[data-close="true"]'),
      image: document.getElementById('cases-modal-image'),
      location: document.getElementById('cases-modal-location'),
      title: document.getElementById('cases-modal-title'),
      description: document.getElementById('cases-modal-description'),
      stat: document.getElementById('cases-modal-stat'),
      cta: document.getElementById('cases-modal-cta')
    };
  }

  function openModal(mod, card) {
    if (!mod.modal) return;

    var dataset = card.dataset || {};
    mod.image.src = dataset.caseImage || '';
    mod.image.alt = dataset.caseTitle ? dataset.caseTitle : '';

    mod.location.textContent = dataset.caseLocation || '';
    mod.title.textContent = dataset.caseTitle || '';
    mod.description.textContent = dataset.caseDescription || '';
    mod.stat.textContent = dataset.caseStat || '';

    if (mod.cta) {
      var href = dataset.caseCta || '/projetos/';
      mod.cta.href = href;
    }

    mod.modal.setAttribute('aria-hidden', 'false');
    mod.modal.classList.add('open');

    mod.modal.dataset.lastFocus = '';
    if (card && typeof card.focus === 'function') mod.modal.dataset.lastFocus = '1';
  }

  function closeModal(mod) {
    if (!mod.modal) return;
    mod.modal.setAttribute('aria-hidden', 'true');
    mod.modal.classList.remove('open');
  }

  ready(function () {
    var mod = getModal();
    if (!mod.modal) return;

    var cards = document.querySelectorAll('.case-card[data-case-title]');
    if (!cards || cards.length === 0) return;

    var lastFocused = null;

    function openFromCard(card) {
      lastFocused = document.activeElement;
      openModal(mod, card);
      // Focus close button for accessibility
      if (mod.closeBtn) mod.closeBtn.focus();
    }

    function closeFromUI() {
      closeModal(mod);
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        openFromCard(card);
      });

      card.addEventListener('keydown', function (e) {
        var key = e.key || '';
        if (key === 'Enter' || key === ' ') {
          e.preventDefault();
          openFromCard(card);
        }
      });
    });

    if (mod.backdrop) {
      mod.backdrop.addEventListener('click', closeFromUI);
    }

    if (mod.closeBtn) {
      mod.closeBtn.addEventListener('click', closeFromUI);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mod.modal.getAttribute('aria-hidden') === 'false') {
        closeFromUI();
      }
    });
  });
})();

