console.log("4WaTT Script Initializing...");

const CORE_LANGS = ['pt', 'en'];
const EXTENDED_LANGS = ['es', 'it', 'fr', 'de', 'no'];
let extendedTranslationsPromise = null;

/* ================= PRELOADER ================= */

function initPreloader() {
    const loaderScreen = document.getElementById('hero-loading-screen');
    const loaderFill = document.getElementById('loader-fill');
    const loaderText = document.getElementById('loader-text');

    if (!loaderScreen) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loaderScreen.style.opacity = '0';
                loaderScreen.style.pointerEvents = 'none';
                setTimeout(() => {
                    loaderScreen.style.display = 'none';
                }, 1000);
            }, 500);
        }
        if (loaderFill) loaderFill.style.width = `${progress}%`;
        if (loaderText) loaderText.innerText = `${Math.floor(progress)}%`;
    }, 100);
}

/* ================= WHATSAPP BOT ================= */

function initWhatsAppBot() {
    const waBtn = document.getElementById('whatsapp-bot');
    if (!waBtn) return;

    // A lógica de pulso já está no CSS, aqui podemos adicionar tracking ou delay
    waBtn.addEventListener('click', () => {
        if (typeof trackEvent === 'function') {
            trackEvent('Conversion', 'Click Chat', 'WhatsApp Bot Flutuante');
        }
    });
}

let currentSlideIndex = 0;
let slides = [];
let dots = [];
let slideInterval;

/* ================= TRADUÇÕES ================= */

function getTranslationsStore() {
    return window.translations || null;
}

function getAssetsBase() {
    const script = document.querySelector('script[src*="main.js"]');
    if (script && script.src) {
        try {
            const url = new URL(script.src, window.location.href);
            return url.pathname.replace(/\/js\/main\.js.*$/, '/');
        } catch (e) { /* fall through */ }
    }
    return '/assets/';
}

async function loadExtendedTranslations() {
    if (window.__translationsExtendedLoaded) {
        return Promise.resolve(getTranslationsStore());
    }

    if (extendedTranslationsPromise) {
        return extendedTranslationsPromise;
    }

    const assetsBase = getAssetsBase();

    extendedTranslationsPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-translations="extended"]');
        if (existing) {
            existing.addEventListener('load', () => resolve(getTranslationsStore()), { once: true });
            existing.addEventListener('error', () => reject(new Error('Failed to load extended translations')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = assetsBase + 'js/languages-extended.js?v=1.2';
        script.defer = true;
        script.dataset.translations = 'extended';
        script.onload = () => resolve(getTranslationsStore());
        script.onerror = () => reject(new Error('Failed to load extended translations'));
        document.head.appendChild(script);
    });

    return extendedTranslationsPromise;
}

async function ensureTranslationsForLanguage(lang) {
    const store = getTranslationsStore();

    if (store && store[lang]) {
        return store;
    }

    if (EXTENDED_LANGS.includes(lang)) {
        await loadExtendedTranslations();
        return getTranslationsStore();
    }

    return store;
}

async function applyTranslations(lang) {
    const store = await ensureTranslationsForLanguage(lang);

    if (!store) {
        return;
    }

    const dict = store[lang] || store['pt'];

    // Tradução de textos normais (innerHTML para suportar <br>)
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (dict[key]) {
            element.innerHTML = dict[key];
        }
    });

    // Tradução de placeholders (formulários)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (dict[key]) {
            element.setAttribute('placeholder', dict[key]);
        }
    });

    // Tradução de títulos (title attribute)
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (dict[key]) {
            element.setAttribute('title', dict[key]);
        }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        if (dict[key]) {
            element.setAttribute('alt', dict[key]);
        }
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria-label');
        if (dict[key]) {
            element.setAttribute('aria-label', dict[key]);
        }
    });

    document.querySelectorAll('meta[data-i18n-content]').forEach(element => {
        const key = element.getAttribute('data-i18n-content');
        if (dict[key]) {
            element.setAttribute('content', dict[key]);
        }
    });

    document.querySelectorAll('.lang-btn[data-lang]').forEach(btn => {
        const active = btn.dataset.lang === lang;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // Atualizar bandeira no seletor
    const flags = {
        pt: 'https://flagcdn.com/w20/br.png',
        en: 'https://flagcdn.com/w20/us.png',
        es: 'https://flagcdn.com/w20/es.png',
        it: 'https://flagcdn.com/w20/it.png',
        fr: 'https://flagcdn.com/w20/fr.png',
        de: 'https://flagcdn.com/w20/de.png',
        no: 'https://flagcdn.com/w20/no.png'
    };

    const selectedFlagImg = document.querySelector('.selected-lang img');
    if (selectedFlagImg && flags[lang]) {
        selectedFlagImg.src = flags[lang];
    }

    // Atualizar Lang no HTML para SEO
    document.documentElement.lang = lang === 'pt' ? 'pt-br' : lang;
}

async function changeLanguage(lang) {
    localStorage.setItem('preferredLang', lang);
    await applyTranslations(lang);
    
    // Fecha o dropdown após selecionar (importante para mobile)
    const dropdown = document.querySelector('.lang-dropdown');
    if (dropdown) dropdown.style.display = 'none';
    
    // Pequeno delay para resetar o estilo inline e permitir que o :hover volte a funcionar no desktop
    setTimeout(() => {
        if (dropdown) dropdown.style.display = '';
    }, 100);
}

/* ================= LANGUAGE SELECTOR TOGGLE (MOBILE) ================= */

function initLanguageSelector() {
    const selector = document.querySelector('.selected-lang');
    const dropdown = document.querySelector('.lang-dropdown');
    
    if (!selector || !dropdown) return;

    selector.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
        dropdown.style.display = 'none';
    });
}

/* ================= SLIDER & VIDEO CONTROLS ================= */

function initVolumeControl() {
    const volumeBtn = document.getElementById('volume-btn');
    
    if (!volumeBtn) return;

    volumeBtn.addEventListener('click', () => {
        // Busca o vídeo no slide ativo ou por ID
        const video = document.getElementById('main-video');
        if (!video) return;

        video.muted = !video.muted;
        const icon = volumeBtn.querySelector('i');
        
        if (video.muted) {
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
        } else {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
        }
    });
}

function showSlide(index) {
    if (!slides || !slides.length) return;

    currentSlideIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
        const video = slide.querySelector('video');

        if (i === currentSlideIndex) {
            slide.classList.add('active');

            if (video) {
                video.currentTime = 0;
                video.play().catch(() => {});
                
                // Remove o timer automático enquanto o vídeo passa
                clearInterval(slideInterval);
                
                // Escuta o fim do vídeo para passar o slide
                video.onended = () => {
                    changeSlide(1);
                };
            } else {
                // Se for imagem, reinicia o timer normal
                startAutoSlide();
            }
        } else {
            slide.classList.remove('active');

            if (video) {
                video.pause();
                video.currentTime = 0;
                video.onended = null; // Limpa o evento
            }
        }
    });

    if (dots && dots.length) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlideIndex);
        });
    }
}

function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
}

function setSlide(index) {
    showSlide(index);
}

function startAutoSlide() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 8000); // 8 segundos para slides de imagem
}

/* ================= FAQ ACCORDION ================= */

function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.fa-chevron-down');

        if (!question || !answer) return;

        const closeItem = (target) => {
            const targetAnswer = target.querySelector('.faq-answer');
            const targetIcon = target.querySelector('.fa-chevron-down');
            const targetQuestion = target.querySelector('.faq-question');
            if (!targetAnswer || !targetQuestion) return;

            target.classList.remove('active');
            targetAnswer.style.maxHeight = '0';
            targetQuestion.setAttribute('aria-expanded', 'false');
            if (targetIcon) targetIcon.style.transform = 'rotate(0deg)';
        };

        const openItem = (target) => {
            const targetAnswer = target.querySelector('.faq-answer');
            const targetIcon = target.querySelector('.fa-chevron-down');
            const targetQuestion = target.querySelector('.faq-question');
            if (!targetAnswer || !targetQuestion) return;

            target.classList.add('active');
            targetAnswer.style.maxHeight = targetAnswer.scrollHeight + 'px';
            targetQuestion.setAttribute('aria-expanded', 'true');
            if (targetIcon) targetIcon.style.transform = 'rotate(180deg)';
        };

        closeItem(item);

        question.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isActive = item.classList.contains('active');

            if (isActive) {
                closeItem(item);
                return;
            }

            faqItems.forEach(otherItem => {
                if (otherItem !== item) closeItem(otherItem);
            });

            openItem(item);
        });
    });
}

/* ================= MOBILE MENU ================= */

function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav-links');
    const dropdownBtns = document.querySelectorAll('.dropbtn');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('active');
        toggle.querySelector('i').classList.toggle('fa-bars');
        toggle.querySelector('i').classList.toggle('fa-times');
    });

    // Lógica para Dropdowns no Mobile
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation(); // Impede que o clique feche o menu principal
                const parent = btn.parentElement;
                
                // Fecha outros dropdowns
                document.querySelectorAll('.dropdown').forEach(d => {
                    if (d !== parent) d.classList.remove('active');
                });

                parent.classList.toggle('active');
            }
        });
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && !nav.contains(e.target) && e.target !== toggle) {
            nav.classList.remove('active');
            toggle.querySelector('i').classList.add('fa-bars');
            toggle.querySelector('i').classList.remove('fa-times');
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        }
    });

    // Fecha o menu ao clicar em links (exceto nos botões de dropdown)
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!link.classList.contains('dropbtn')) {
                nav.classList.remove('active');
                toggle.querySelector('i').classList.add('fa-bars');
                toggle.querySelector('i').classList.remove('fa-times');
                document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            }
        });
    });
}

/* ================= REVEAL ON SCROLL ================= */

function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up, .stagger-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Se for um container stagger, anima os filhos com atraso
                if (entry.target.classList.contains('stagger-container')) {
                    const children = entry.target.querySelectorAll('.stagger-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('active');
                        }, index * 200);
                    });
                }
            }
        });
    }, {
        threshold: 0.15, // Dispara quando 15% do elemento estiver visível
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}

/* ================= TRACKING & ANALYTICS ================= */

function trackEvent(category, action, label) {
    console.log(`[Tracking] Category: ${category}, Action: ${action}, Label: ${label}`);
    // Aqui seria disparado o gtag ou fbq:
    // if (typeof gtag !== 'undefined') gtag('event', action, { 'event_category': category, 'event_label': label });
}

function initTracking() {
    // View Hero (Dispara ao carregar)
    trackEvent('Engagement', 'View', 'Hero Carousel');

    // Cliques em CTAs Principais e Secundários
    document.querySelectorAll('.btn, .btn-primary, .btn-outline-white, .card-link, .floating-cta').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const label = e.currentTarget.innerText || e.currentTarget.getAttribute('data-i18n') || 'cta-link';
            const destination = e.currentTarget.getAttribute('href');
            trackEvent('Conversion', 'Click CTA', `${label} -> ${destination}`);
        });
    });

    // Cliques no Telegram Bot (Equivalente ao WhatsApp do doc)
    document.querySelectorAll('a[href*="t.me"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Conversion', 'Click Chat', 'Telegram Bot');
        });
    });

    // Envio de Formulário
    const form = document.getElementById('lead-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            trackEvent('Conversion', 'Submit Form', 'Lead Diagnostic');
            
            // Redirecionamento após tracking
            setTimeout(() => {
                window.location.href = "https://t.me/Proposta_4WaTTbot";
            }, 500);
        });
    }

    // Scroll Tracking Avançado (50%, 75%, 90%)
    let scrolled50 = false;
    let scrolled75 = false;
    let scrolled90 = false;
    
    window.addEventListener('scroll', () => {
        const h = document.documentElement, 
              b = document.body,
              st = 'scrollTop',
              sh = 'scrollHeight';
        const percent = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;

        if (percent > 50 && !scrolled50) {
            trackEvent('Behavior', 'Scroll', '50%');
            scrolled50 = true;
        }
        if (percent > 75 && !scrolled75) {
            trackEvent('Behavior', 'Scroll', '75%');
            scrolled75 = true;
        }
        if (percent > 90 && !scrolled90) {
            trackEvent('Behavior', 'Scroll', '90%');
            scrolled90 = true;
        }
    });
}

/* ================= COUNTER ANIMATION ================= */

function initCounters() {
    const counters = document.querySelectorAll('.stat-v-number, .stat-h-number');
    const speed = 200;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-counter'));
                const suffix = target.getAttribute('data-suffix') || '';
                let count = 0;
                
                // Reset to zero before starting animation
                target.innerText = '0' + suffix;
                
                const updateCount = () => {
                    const increment = Math.ceil(countTo / 100); // Smoother increment
                    if (count < countTo) {
                        count += increment;
                        if (count > countTo) count = countTo;
                        target.innerText = count + suffix;
                        requestAnimationFrame(updateCount); // Smoother than setTimeout
                    } else {
                        target.innerText = countTo + suffix;
                    }
                };
                
                setTimeout(updateCount, 300); // Brief delay to let reveal animation happen
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Preservar UTMs em links internos se necessário (UTM Keeper)
function preserveUTMs() {
    const urlParams = new URLSearchParams(window.location.search);
    const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    let paramsToKeep = {};

    utms.forEach(utm => {
        if (urlParams.get(utm)) paramsToKeep[utm] = urlParams.get(utm);
    });

    if (Object.keys(paramsToKeep).length > 0) {
        localStorage.setItem('4watt_utms', JSON.stringify(paramsToKeep));
    }
}

/* ================= INICIALIZAÇÃO ================= */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initWhatsAppBot();
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');

    const savedLang = localStorage.getItem('preferredLang') || 'pt';
    applyTranslations(savedLang);

    showSlide(0);
    startAutoSlide();
    initFaq();
    initLanguageSelector();
    initTracking();
    preserveUTMs();
    initVolumeControl();
    initRevealAnimations();
    initMobileMenu();
    initCounters();

    /* HEADER SCROLL EFFECT & FLOATING BTN */
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        const floatingBtn = document.getElementById('floating-btn');
        if (!header) return;

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Mostra os botões flutuantes após 300px e esconde antes do rodapé
        const floatingBtns = document.querySelectorAll('.floating-cta');
        if (floatingBtns.length > 0) {
            const footer = document.querySelector('footer');
            const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
            const windowHeight = window.innerHeight;

            floatingBtns.forEach(btn => {
                if (window.scrollY > 300) {
                    btn.classList.add('show');
                } else {
                    btn.classList.remove('show');
                }

                // Esconde se encostar no rodapé (margem de 50px)
                if (footerTop < windowHeight - 50) {
                    btn.classList.add('at-footer');
                } else {
                    btn.classList.remove('at-footer');
                }
            });
        }
    });
});

window.applyTranslations = applyTranslations;
window.setLanguage = changeLanguage;
