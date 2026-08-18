/* ============================================================
   4WaTT — projetos-biometano.html
   Complementos locais desta página. NÃO altera forms.js.

   Por que este arquivo existe:
   initInterestModal() (assets/js/forms.js:315) abre e fecha o
   modal e preenche [name="projeto"] a partir de data-project,
   mas não implementa Escape, focus trap nem retorno de foco.
   Em vez de editar um arquivo compartilhado por todas as páginas,
   os três comportamentos são adicionados aqui, por cima.
   ============================================================ */
(function () {
  'use strict';

  var overlay = document.getElementById('modal-interesse-overlay');
  var modal = document.getElementById('modal-interesse');
  if (!overlay || !modal) return;

  var lastFocused = null;

  var FOCUSABLE = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function focusables() {
    return Array.prototype.filter.call(
      modal.querySelectorAll(FOCUSABLE),
      function (el) { return el.offsetParent !== null || el === document.activeElement; }
    );
  }

  function isOpen() { return overlay.classList.contains('open'); }

  /* Fecha pelo mesmo caminho do forms.js, para não divergir de estado */
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    lastFocused = null;
  }

  /* --- Espelha o nome do projeto no chip visível ---
     forms.js preenche o input hidden; o chip é só desta página. */
  document.querySelectorAll('[data-open-modal="interesse"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      lastFocused = btn;
      var nome = btn.getAttribute('data-project') || '';
      var chip = document.getElementById('modal-projeto-nome');
      if (chip) chip.textContent = nome;

      /* forms.js só preenche [name="projeto"] se data-project não for vazio.
         Garante também o campo do formulário da seção final. */
      var hidden = modal.querySelector('input[name="projeto"]');
      if (hidden) hidden.value = nome;

      /* Foco no primeiro campo, depois que a transição de opacidade começa */
      window.setTimeout(function () {
        var first = modal.querySelector('input:not([type="hidden"]), select, textarea');
        if (first) first.focus();
      }, 60);
    });
  });

  /* --- Escape fecha --- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      close();
    }
  });

  /* --- Focus trap: Tab não escapa do modal enquanto ele está aberto --- */
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !isOpen()) return;
    var list = focusables();
    if (!list.length) return;

    var first = list[0];
    var last = list[list.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* --- Retorno de foco quando o fechamento vem do forms.js
         (botão .modal__close ou clique no overlay) --- */
  var closeBtn = modal.querySelector('.modal__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      lastFocused = null;
    });
  }
  overlay.addEventListener('click', function (e) {
    if (e.target !== overlay) return;
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    lastFocused = null;
  });

  /* --- Pino do mapa leva ao card correspondente ---
     Correlação número do pin ↔ ordem do card na grid. */
  var pins = document.querySelectorAll('.bmp-map__pin');
  var cards = document.querySelectorAll('.bmp-projects .bmp-proj');
  pins.forEach(function (pin, i) {
    var card = cards[i];
    if (!card) return;
    pin.style.cursor = 'pointer';
    pin.setAttribute('tabindex', '0');
    pin.setAttribute('role', 'link');

    function go() {
      var y = card.getBoundingClientRect().top + window.pageYOffset - 96;
      window.scrollTo({ top: y, behavior: 'smooth' });
      card.classList.add('is-highlight');
      window.setTimeout(function () { card.classList.remove('is-highlight'); }, 1600);
    }

    pin.addEventListener('click', go);
    pin.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });

})();
