/* Interações compartilhadas por artigos e arquivos do blog. Sem dependências. */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const selector = 'button, .social-btn, .blog-button, .btn, .btn-primary, .btn-secondary, .nav__cta, [data-ripple]';
    const translate = name => {
      const lang = document.documentElement.lang.startsWith('en') ? 'en' : 'pt';
      return window.translations?.[lang]?.[name] || window.translations?.pt?.[name] || '';
    };
    const markButtons = () => document.querySelectorAll(selector).forEach(button => button.classList.add('ripple-btn'));
    markButtons();
    // Delegação preserva o efeito quando os destaques são reordenados ou traduzidos.
    document.addEventListener('pointerdown', event => {
      const button = event.target.closest(selector);
      if (!button || button.disabled || event.button !== 0 || !event.isPrimary || reduce.matches) return;
      button.classList.add('ripple-btn');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.setAttribute('aria-hidden', 'true');
      Object.assign(ripple.style, {
        width: `${size}px`, height: `${size}px`,
        left: `${event.clientX - rect.left - size / 2}px`,
        top: `${event.clientY - rect.top - size / 2}px`
      });
      const previous = button.querySelectorAll('.ripple');
      if (previous.length >= 4) previous[0].remove();
      button.append(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
      // Também limpa em abas em segundo plano, onde a animação pode ser suspensa.
      window.setTimeout(() => ripple.remove(), 750);
    }, { passive: true });

    document.querySelectorAll('[data-copy-article]').forEach(button => {
      button.addEventListener('click', async () => {
        const label = button.querySelector('[data-copy-label]');
        const status = button.closest('.social-share').querySelector('[data-copy-status]');
        const url = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
        try {
          await navigator.clipboard.writeText(url);
          label.textContent = translate('blog_link_copied');
          status.textContent = translate('blog_link_copied');
          window.clearTimeout(button.copyFeedbackTimer);
          button.copyFeedbackTimer = window.setTimeout(() => { label.textContent = translate('blog_copy_link'); status.textContent = ''; }, 2000);
        } catch (error) {
          status.textContent = translate('blog_copy_failed');
        }
      });
    });
  });
})();
