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

  /* ---------- Galeria do case Electrolux (#case-electrolux) ----------
     Dois comportamentos, os dois opcionais: se a secao nao existir na pagina, sai.

     1. Foto viva. Cada .elux__shot[data-live] tem um <video> curto por cima da foto,
        com preload="none" e opacity 0. So carrega e toca quando o usuario aponta pra
        ele, e some voltando pra foto ao sair. A foto continua sendo a verdade da tela:
        se o video falhar, nao sobra buraco preto.

        Nao usa CSS :hover para tocar porque play() precisa de JS de qualquer jeito, e
        assim o mesmo caminho serve para foco por teclado, que hover nao cobre.

     2. Arraste na tira. A tira e overflow-x nativo (toque ja funciona), mas no desktop
        a barra de rolagem esta escondida pelo mask, entao mouse ficaria sem afordancia.
        O arraste so vira arraste depois de 6px de movimento. Sem esse limiar, um clique
        parado seria capturado por setPointerCapture e nunca chegaria no elemento de
        baixo. Foi exatamente o bug que quebrou o botao dentro do card CEASA na home. */
  function initEluxGallery() {
    var strip = document.querySelector('.elux__strip');
    if (!strip) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* --- 1. Foto viva --- */
    if (!reduce) {
      Array.prototype.forEach.call(strip.querySelectorAll('.elux__shot[data-live]'), function (shot) {
        var video = shot.querySelector('video');
        if (!video) return;

        function play() {
          shot.classList.add('is-playing');
          var attempt = video.play();
          // Safari/iOS rejeitam play() sem gesto em alguns contextos. Se rejeitar,
          // desfaz a classe e a foto permanece — nada quebra na tela.
          if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(function () { shot.classList.remove('is-playing'); });
          }
        }

        function stop() {
          shot.classList.remove('is-playing');
          video.pause();
          try { video.currentTime = 0; } catch (e) { /* alguns navegadores travam antes do metadata */ }
        }

        // Focavel nos dois casos. Antes o tabindex so era aplicado no ramo de
        // toque, entao no desktop a foto viva era exclusiva de quem usa mouse e a
        // regra .elux__shot:focus-visible nunca chegava a valer.
        shot.setAttribute('tabindex', '0');

        if (finePointer) {
          shot.addEventListener('pointerenter', play);
          shot.addEventListener('pointerleave', stop);
        } else {
          // Toque: alterna. Sem hover, o usuario precisa de um jeito explicito.
          shot.addEventListener('click', function () {
            if (shot.classList.contains('is-playing')) stop(); else play();
          });
        }

        // Teclado: foco liga, blur desliga.
        shot.addEventListener('focus', play, true);
        shot.addEventListener('blur', stop, true);
      });
    }

    /* --- 2. Arraste na tira --- */
    var DRAG_THRESHOLD = 6;
    var down = false, dragging = false, startX = 0, startScroll = 0, pointerId = null;

    strip.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      down = true;
      dragging = false;
      pointerId = e.pointerId;
      startX = e.clientX;
      startScroll = strip.scrollLeft;
    });

    strip.addEventListener('pointermove', function (e) {
      if (!down || e.pointerId !== pointerId) return;
      var dx = e.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        dragging = true;
        strip.style.cursor = 'grabbing';
        strip.style.scrollSnapType = 'none'; // snap brigando com arraste da um solavanco
        try { strip.setPointerCapture(pointerId); } catch (err) { /* ok */ }
      }
      strip.scrollLeft = startScroll - dx;
    });

    function endDrag(e) {
      if (!down) return;
      if (e && pointerId !== null && e.pointerId !== pointerId) return;
      if (dragging) {
        try { strip.releasePointerCapture(pointerId); } catch (err) { /* ok */ }
      }
      down = false;
      dragging = false;
      pointerId = null;
      strip.style.cursor = '';
      strip.style.scrollSnapType = '';
    }

    strip.addEventListener('pointerup', endDrag);
    strip.addEventListener('pointercancel', endDrag);
    strip.addEventListener('lostpointercapture', endDrag);
  }

  /* ---------- Inclinacao 3D do cartao de resultado ([data-tilt]) ----------
     Decorativo, e assume isso. O cartao nao muda de estado nem executa acao:
     ele so responde ao ponteiro, para uma superficie escura parada no meio de
     um bloco claro parecer objeto e nao adesivo.

     Tres decisoes que valem registrar:

     1. Amortecimento em vez de acompanhar o ponteiro direto. Colar o angulo na
        posicao do mouse fica artificial porque nao tem inercia. O lerp de 0,12
        por quadro da o assentamento de uma mola criticamente amortecida: chega
        rapido e nao passa do ponto. Overshoot aqui seria errado, porque nenhum
        gesto de arremesso precedeu o movimento.

     2. Interrompivel de graca. Como o alvo e so uma variavel que o proximo
        pointermove sobrescreve, o movimento sempre parte do valor que esta na
        tela. Nao ha animacao para cancelar nem salto ao inverter a direcao.

     3. transform inline em vez de custom property. Mudar uma variavel CSS no
        cartao recalcularia o estilo de toda a subarvore a cada quadro. O
        transform direto afeta so o elemento e vai para o compositor. As
        variaveis --mx/--my do brilho vao no proprio .elux__result-sheen, que
        nao tem filhos, pelo mesmo motivo.

     Nao roda em toque (sem ponteiro para seguir) nem em prefers-reduced-motion. */
  function initTilt() {
    var cards = document.querySelectorAll('[data-tilt]');
    if (!cards.length) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var MAX = 7;        // graus no canto; acima disso vira brinquedo
    var EASE = 0.12;    // fracao da distancia percorrida por quadro

    Array.prototype.forEach.call(cards, function (card) {
      var sheen = card.querySelector('.elux__result-sheen');
      var targetX = 0, targetY = 0;   // alvo
      var curX = 0, curY = 0;         // valor na tela
      var raf = null;

      function frame() {
        curX += (targetX - curX) * EASE;
        curY += (targetY - curY) * EASE;
        card.style.transform =
          'rotateX(' + curY.toFixed(3) + 'deg) rotateY(' + curX.toFixed(3) + 'deg)';
        if (Math.abs(targetX - curX) > 0.01 || Math.abs(targetY - curY) > 0.01) {
          raf = requestAnimationFrame(frame);
        } else {
          // Assentou: zera o transform inline no repouso para o CSS voltar a
          // mandar, e solta o quadro.
          raf = null;
          if (targetX === 0 && targetY === 0) card.style.transform = '';
        }
      }

      function tick() { if (!raf) raf = requestAnimationFrame(frame); }

      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        targetX = (px - 0.5) * 2 * MAX;
        targetY = -(py - 0.5) * 2 * MAX;
        if (sheen) {
          sheen.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          sheen.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        }
        tick();
      });

      card.addEventListener('pointerleave', function () {
        targetX = 0;
        targetY = 0;
        tick();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollStage();
    initVideoModal();
    initEluxGallery();
    initTilt();
  });
})();
