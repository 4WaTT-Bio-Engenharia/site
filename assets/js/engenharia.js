/* ==========================================================================
   engenharia.js — efeitos exclusivos das páginas /engenharia/
   Padrão: mesmo motor rAF+scroll do [data-parallax] em site-premium.js —
   nenhuma dependência nova, sem framework de animação.
   Spec: docs/engineering-services/pages/index.md (Bloco 2 — scroll-stage)
   ========================================================================== */
(function () {
  /* ---------- Auto-duplicação do marquee de cases (Bloco 3) ----------
     O motor [data-marquee] de site-premium.js (initDraggableMarquee) espera a esteira
     JÁ vir duplicada 2x no HTML (era assim na home: cards reais + cópia com
     aria-hidden). Isso é frágil — cada vez que alguém adiciona/remove um case, tem que
     lembrar de duplicar à mão, e esquecer disso trava o carrossel (foi exatamente o bug
     relatado: só 3 cards reais, scrollWidth mal passava do clientWidth, o `tick()` batia
     no fim do scroll nativo do navegador e nunca soltava — carrossel "parado").

     Esta função resolve isso automaticamente: lê só os cases REAIS (marcados sem
     aria-hidden) direto do HTML, e monta a esteira final em runtime — repete o
     conjunto o quanto for preciso pra 1 "volta" cobrir pelo menos 1 largura de tela, e
     clona essa volta inteira mais uma vez (com aria-hidden) pra fechar o loop sem
     costura. Efeito prático: adicionar um novo case = só inserir um novo
     `<article class="case-card">` real na esteira no HTML; o script recalcula e
     duplica sozinho, sem precisar mexer em nada mais.

     Precisa rodar de forma SÍNCRONA (não dentro de DOMContentLoaded) porque
     site-premium.js já roda `initMarquees()` no DOMContentLoaded dele, registrado
     ANTES deste script — se eu esperar o mesmo evento, chego tarde e o motor já mediu
     a esteira errada. Rodando aqui, no topo do script (scripts no fim do <body> mas
     antes de `</html>`, ou seja, ainda durante o parse, sempre antes do
     DOMContentLoaded disparar), a esteira já está pronta quando o motor for medir. */
  function initAutoDuplicateMarquees() {
    var wrappers = document.querySelectorAll('[data-marquee]');
    wrappers.forEach(function (wrapper) {
      var track = wrapper.firstElementChild;
      if (!track || track.dataset.autoDup === '1') return;

      var originals = Array.prototype.slice.call(track.children).filter(function (el) {
        return el.getAttribute('aria-hidden') !== 'true';
      });
      if (originals.length < 1) return;

      var originalWidth = track.scrollWidth || 1;
      var wrapWidth = wrapper.clientWidth || originalWidth;
      var copiesPerHalf = Math.max(1, Math.ceil(wrapWidth / originalWidth));

      track.innerHTML = '';
      for (var i = 0; i < copiesPerHalf; i++) {
        originals.forEach(function (card) { track.appendChild(card.cloneNode(true)); });
      }
      // clona a "metade" inteira (real) mais uma vez — vira a 2ª metade do loop,
      // invisível para leitores de tela, só existe pro efeito visual contínuo.
      Array.prototype.slice.call(track.children).forEach(function (node) {
        var clone = node.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.removeAttribute('tabindex');
        track.appendChild(clone);
      });

      track.dataset.autoDup = '1';
    });
  }
  initAutoDuplicateMarquees();

  function initScrollStage() {
    var stages = Array.prototype.slice.call(document.querySelectorAll('[data-scroll-stage]'));
    if (!stages.length) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var frames = stages.map(function (s) { return s.querySelector('.eng-scroll-stage__frame'); });

    if (reduce) {
      frames.forEach(function (f) {
        if (!f) return;
        f.style.setProperty('--stage-rot', '0deg');
        f.style.setProperty('--stage-scale', '1');
        f.style.setProperty('--stage-y', '0px');
      });
      return;
    }

    var ticking = false;

    function progressFor(el) {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight;
      // 0 quando o topo do palco encosta em 85% da viewport (ainda embaixo);
      // 1 quando o topo passa de 35% da viewport (já perto do centro/topo).
      var start = vh * 0.85;
      var end = vh * 0.35;
      var raw = (start - r.top) / (start - end);
      return Math.min(1, Math.max(0, raw));
    }

    function update() {
      stages.forEach(function (stage, i) {
        var frame = frames[i];
        if (!frame) return;
        var p = progressFor(stage);
        var rot = (1 - p) * 14;      // 14deg (inclinado) -> 0deg (reto)
        var scale = 0.94 + p * 0.06; // 0.94 -> 1
        var y = (1 - p) * 40;        // 40px -> 0px
        frame.style.setProperty('--stage-rot', rot.toFixed(2) + 'deg');
        frame.style.setProperty('--stage-scale', scale.toFixed(3));
        frame.style.setProperty('--stage-y', y.toFixed(1) + 'px');
      });
      ticking = false;
    }

    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  function initVideoModal() {
    var modal = document.getElementById('engVideoModal');
    if (!modal) return;
    var embed = modal.querySelector('.eng-video-modal__embed');
    var triggers = document.querySelectorAll('[data-video-id]');
    var lastFocused = null;

    function open(videoId) {
      lastFocused = document.activeElement;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0';
      iframe.title = 'Vídeo 4WaTT';
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      embed.innerHTML = '';
      embed.appendChild(iframe);
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      var closeBtn = modal.querySelector('.eng-video-modal__close');
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      embed.innerHTML = ''; // remove o iframe -> para a reprodução
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    triggers.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        open(el.dataset.videoId);
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          open(el.dataset.videoId);
        }
      });
    });

    modal.querySelectorAll('[data-video-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollStage();
    initVideoModal();
  });
})();
