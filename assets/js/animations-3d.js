/**
 * 4WaTT Cinematic Animations v3.0
 * Baseado no 3d-demo.html — GSAP + ScrollTrigger
 */

(function() {
  'use strict';

  // Verificar preferência por reduced motion
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════════════════════════════════════════════════════════════════════
     1. LOADING SCREEN
     ═══════════════════════════════════════════════════════════════════════════ */
  
  function initLoader() {
    // When the canvas scroll-video player is present, it owns the loading lifecycle.
    if (document.getElementById('hero-scrub-canvas')) return;

    var heroImg = document.getElementById('hero-image');
    var loaderFill = document.getElementById('loader-fill');
    var loaderText = document.getElementById('loader-text');
    var loadingScreen = document.getElementById('hero-loading-screen');

    if (!loadingScreen) {
      initCinematic();
      return;
    }

    var progress = 0;
    var loaded = false;

    function updateLoader() {
      if (loaded) return;
      progress += Math.random() * 12;
      if (heroImg && heroImg.complete) progress = Math.max(progress, 90);
      if (progress >= 100) {
        progress = 100;
        loaded = true;
        if (loaderFill) loaderFill.style.width = '100%';
        if (loaderText) loaderText.textContent = '100%';
        setTimeout(function () {
          loadingScreen.style.opacity = '0';
          setTimeout(function () {
            loadingScreen.style.display = 'none';
            initCinematic();
          }, 1000);
        }, 300);
        return;
      }
      if (loaderFill) loaderFill.style.width = progress + '%';
      if (loaderText) loaderText.textContent = Math.floor(progress) + '%';
      setTimeout(updateLoader, 60);
    }

    if (heroImg && !heroImg.complete) {
      heroImg.addEventListener('load', function () {
        progress = Math.max(progress, 90);
      });
    }
    updateLoader();
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     2. CINEMATIC SCROLL ANIMATIONS (GSAP)
     ═══════════════════════════════════════════════════════════════════════════ */
  
  function initCinematic() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP não carregado — animações desativadas');
      return;
    }
    
    gsap.registerPlugin(ScrollTrigger);

    var heroParallax = document.getElementById('hero-parallax');
    var heroContent = document.getElementById('hero-content');
    var heroScene = document.getElementById('hero-scene');

    if (!heroScene) return;

    var isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Hero image parallax + zoom (desktop); mobile: menos movimento para scroll estável
    if (heroParallax && !reducedMotion) {
      gsap.to(heroParallax, {
        yPercent: isMobile ? 4 : 15,
        scale: isMobile ? 1.04 : 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroScene,
          start: 'top top',
          end: 'bottom top',
          scrub: isMobile ? 2.2 : 1.2,
        }
      });
    }

    // Hero content fades out + lifts up
    if (heroContent) {
      gsap.to(heroContent, {
        opacity: 0,
        y: isMobile ? -36 : -80,
        ease: 'none',
        scrollTrigger: {
          trigger: heroScene,
          start: '5% top',
          end: isMobile ? '55% top' : '40% top',
          scrub: isMobile ? 1.4 : 1,
        }
      });
    }

    // Image brightness changes on scroll
    var heroImage = document.getElementById('hero-image');
    if (heroImage && !reducedMotion) {
      gsap.to(heroImage, {
        filter: isMobile ? 'brightness(0.55) saturate(0.9)' : 'brightness(0.4) saturate(0.8)',
        ease: 'none',
        scrollTrigger: {
          trigger: heroScene,
          start: '30% top',
          end: 'bottom top',
          scrub: isMobile ? 1.6 : 1,
        }
      });
    }

    // Scroll indicator disappears
    var scrollInd = document.querySelector('.scroll-indicator');
    if (scrollInd) {
      gsap.to(scrollInd, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroScene,
          start: '3% top',
          end: '10% top',
          scrub: 1,
        }
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     3. NAVBAR SCROLL BEHAVIOR
     ═══════════════════════════════════════════════════════════════════════════ */
  
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     4. REVEAL ON SCROLL (IntersectionObserver)
     ═══════════════════════════════════════════════════════════════════════════ */
  
  function initReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length === 0) return;

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     5. KARAOKE TEXT EFFECT
     ═══════════════════════════════════════════════════════════════════════════ */
  
  function initKaraoke() {
    var karaokeText = document.getElementById('karaoke-text');
    if (!karaokeText) return;

    var words = karaokeText.innerText.split(' ');
    karaokeText.innerHTML = words.map(function (w) {
      return '<span class="karaoke-word">' + w + '</span> ';
    }).join('');

    var spans = karaokeText.querySelectorAll('.karaoke-word');

    function handleKaraoke() {
      var rect = karaokeText.getBoundingClientRect();
      var vh = window.innerHeight;
      var prog = (vh * 0.85 - rect.top) / (vh * 0.55);
      prog = Math.max(0, Math.min(1, prog));
      var idx = Math.floor(prog * spans.length);
      
      spans.forEach(function (s, i) {
        if (i <= idx) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    }

    var karaokeVis = false;
    var kObs = new IntersectionObserver(function (entries) {
      karaokeVis = entries[0].isIntersecting;
      if (karaokeVis) {
        document.addEventListener('scroll', handleKaraoke, { passive: true });
      } else {
        document.removeEventListener('scroll', handleKaraoke);
      }
    });
    
    kObs.observe(karaokeText);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     6. COUNTER ANIMATION
     ═══════════════════════════════════════════════════════════════════════════ */
  
  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (counters.length === 0) return;

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.dataset.counter);
          var suffix = el.dataset.suffix || '';
          var duration = parseInt(el.dataset.duration) || 2000;
          
          animateCounter(el, target, suffix, duration);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  function animateCounter(element, target, suffix, duration) {
    var start = 0;
    var startTime = performance.now();

    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      
      // Ease out quart
      var easeProgress = 1 - Math.pow(1 - progress, 4);
      var current = Math.floor(start + (target - start) * easeProgress);
      
      element.textContent = current + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     7. MAGNETIC BUTTONS
     ═══════════════════════════════════════════════════════════════════════════ */
  
  function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (reducedMotion) return;

    var magneticButtons = document.querySelectorAll('[data-magnetic]');
    
    magneticButtons.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        var strength = parseFloat(btn.dataset.magnetic) || 0.3;
        
        btn.style.transform = 'translate(' + (x * strength) + 'px, ' + (y * strength) + 'px)';
      });
      
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     8. SMOOTH SCROLL
     ═══════════════════════════════════════════════════════════════════════════ */
  
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = anchor.getAttribute('href');
        if (href === '#') return;
        
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          var offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
          
          if (reducedMotion) {
            window.scrollTo(0, offset);
            return;
          }
          
          var start = window.pageYOffset;
          var distance = offset - start;
          var duration = 800;
          var startTime = performance.now();

          function scroll(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var easeProgress = 1 - Math.pow(1 - progress, 3);
            
            window.scrollTo(0, start + distance * easeProgress);
            
            if (progress < 1) {
              requestAnimationFrame(scroll);
            }
          }
          
          requestAnimationFrame(scroll);
        }
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     9. PARALLAX ELEMENTS
     ═══════════════════════════════════════════════════════════════════════════ */
  
  function initParallax() {
    if (reducedMotion) return;

    var parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    function updateParallax() {
      var scrollY = window.pageYOffset;
      
      parallaxElements.forEach(function (el) {
        var speed = parseFloat(el.dataset.parallax) || 0.5;
        var yPos = scrollY * speed;
        el.style.transform = 'translateY(' + yPos + 'px)';
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     10. TEXT SCRAMBLE EFFECT
     ═══════════════════════════════════════════════════════════════════════════ */
  
  function initTextScramble() {
    var scrambleElements = document.querySelectorAll('[data-scramble]');
    if (scrambleElements.length === 0) return;

    var chars = '!<>-_\\/[]{}—=+*^?#________';

    scrambleElements.forEach(function (el) {
      var originalText = el.textContent;
      var scrambleObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            scrambleText(el, originalText);
            scrambleObserver.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      
      scrambleObserver.observe(el);
    });

    function scrambleText(element, finalText) {
      var length = finalText.length;
      var iterations = 0;
      var maxIterations = length * 3;

      var interval = setInterval(function () {
        element.textContent = finalText
          .split('')
          .map(function (char, index) {
            if (index < iterations / 3) {
              return finalText[index];
            }
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        iterations++;
        
        if (iterations >= maxIterations) {
          clearInterval(interval);
          element.textContent = finalText;
        }
      }, 30);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     INICIALIZAÇÃO
     ═══════════════════════════════════════════════════════════════════════════ */
  
  function init() {
    // initEmojiIconsToImages(); // Desativado: não converter emojis para imagens

    // Loading primeiro
    initLoader();
    
    // Inicializar componentes
    initNavbar();
    initReveal();
    initKaraoke();
    initCounters();
    initMagneticButtons();
    initSmoothScroll();
    initParallax();
    initTextScramble();

    console.log('%c4WaTT Cinematic v3.0', 'color: #00A089; font-size: 14px; font-weight: bold;', 'Sistema de animações inicializado');
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     11. EMOJI ICONS -> IMAGES (anti-regression)
     Remove elementos que contenham apenas um emoji (ex.: ⚡ 🔥 ♻️) e troca por
     um <img> com placeholder de assets/img/. Mantém layout (tamanho baseado em font-size).
  ═══════════════════════════════════════════════════════════════════════════ */
  function initEmojiIconsToImages() {
    // Evita executar duas vezes (algumas páginas podem carregar script em múltiplas condições)
    if (document.documentElement.dataset.emojiIconsConverted === '1') return;
    document.documentElement.dataset.emojiIconsConverted = '1';

    if (!('createElement' in document)) return;

    function isEmojiOnly(text) {
      var t = (text || '').trim();
      if (!t) return false;
      // Estende pictográficos + variações + ZWJ (para emojis compostos).
      // Isso filtra elementos que têm apenas emoji e whitespace.
      return /^[\p{Extended_Pictographic}\uFE0F\u200D\s]+$/u.test(t);
    }

    function emojiToImageSrc(emojiText) {
      // Mapear alguns emojis mais comuns usados como "ícones" no site.
      switch (emojiText) {
        case '⚡':
          return '/assets/img/cano-biogas-barbosa.jpg';
        case '🔥':
          return '/assets/img/IA_usina.jpeg';
        case '♻️':
        case '♻':
          return '/assets/img/reciclo_bom.jpeg';
        case '🏭':
          return '/assets/img/usina_2IA.jpeg';
        case '📋':
        case '📄':
          return '/assets/img/projetos.png';
        case '🌿':
          return '/assets/img/CO2_floresta.jpeg';
        case '💹':
          return '/assets/img/projetos.png';
        case '🔗':
          return '/assets/img/orlando_usina.jpg';
        case '🔧':
          return '/assets/img/gerador_blumenau.jpg';
        case '🚌':
          return '/assets/img/usina_MS.jpg';
        case '⚙️':
          return '/assets/img/gerador_blumenau.jpg';
        default:
          return '/assets/img/residuo1.jpg';
      }
    }

    var candidates = document.querySelectorAll('div, span');
    var converted = 0;

    Array.prototype.slice.call(candidates).forEach(function (el) {
      // Só substitui elementos "vazios" além de emoji.
      if (!el || el.children.length !== 0) return;
      var txt = (el.textContent || '').trim();
      if (!txt) return;
      if (txt.length > 4) return;
      if (!isEmojiOnly(txt)) return;

      var src = emojiToImageSrc(txt);
      var fontSize = window.getComputedStyle(el).fontSize;
      var px = parseFloat(fontSize);

      var img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.style.display = 'inline-block';
      img.style.objectFit = 'contain';
      if (!isNaN(px) && px > 0) {
        img.style.width = px + 'px';
        img.style.height = px + 'px';
      }

      // Mantém o "espaço" do elemento original.
      el.replaceWith(img);
      converted++;
    });

    // console.log opcional (mantido desligado para não poluir)
    // console.log('Emoji icons converted:', converted);
  }

  // Aguardar DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expor API global
  window.WaTTAnimations = {
    refreshReveals: initReveal,
    refreshCounters: initCounters,
    scramble: function(element, text) {
      if (element && text) {
        element.textContent = text;
      }
    }
  };

})();
