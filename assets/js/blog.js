/* Busca local, filtros compartilháveis e destaques com métricas agregadas do GA4. */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const catalogElement = document.getElementById('blog-catalog');
    if (!catalogElement) return;
    const catalog = JSON.parse(catalogElement.textContent);
    const input = document.getElementById('blog-search');
    const results = document.getElementById('blog-results');
    const sort = document.getElementById('blog-sort');
    const cards = Array.from(results.querySelectorAll('[data-post-id]'));
    const count = document.getElementById('blog-result-count');
    const empty = document.getElementById('blog-empty');
    const filters = document.getElementById('blog-active-filters');
    const featured = document.querySelector('.blog-featured');
    const archive = document.body.dataset.blogArchive;
    const group = document.body.dataset.blogGroup;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const language = () => document.documentElement.lang.startsWith('en') ? 'en' : 'pt';
    const translated = name => (window.translations?.[language()] || {})[name] || '';
    const posts = new Map(catalog.posts.map(post => [post.id, post]));
    let activeTheme = '';
    let activeTag = '';

    const searchable = new Map(catalog.posts.map(post => {
      const subjects = [catalog.themes.find(t => t.id === post.theme), ...catalog.tags.filter(t => post.tags.includes(t.id))];
      return [post.id, normalize([post.title.pt, post.title.en, post.excerpt.pt, post.excerpt.en, post.searchText, ...subjects.flatMap(t => [t.pt, t.en])].join(' '))];
    }));

    function applyFilters(updateUrl = false) {
      const tokens = normalize(input.value.trim()).split(/\s+/).filter(Boolean);
      const ordered = [...cards].sort((a, b) => {
        const delta = a.dataset.published.localeCompare(b.dataset.published);
        return sort.value === 'oldest' ? delta : -delta;
      });
      let visible = 0;
      ordered.forEach(card => {
        const post = posts.get(card.dataset.postId);
        const matches = tokens.every(token => searchable.get(post.id).includes(token)) && (!activeTheme || post.theme === activeTheme) && (!activeTag || post.tags.includes(activeTag));
        card.hidden = !matches;
        if (matches) visible += 1;
        results.append(card);
      });
      count.textContent = `${visible} ${translated(visible === 1 ? 'blog_result' : 'blog_results')}`;
      const filtered = Boolean(tokens.length || activeTheme || activeTag);
      empty.hidden = visible > 0 || (!cards.length && !filtered);
      filters.hidden = !filtered;
      const labels = [];
      if (input.value.trim()) labels.push(`“${input.value.trim()}”`);
      if (activeTheme) labels.push(catalog.themes.find(t => t.id === activeTheme)?.[language()] || activeTheme);
      if (activeTag) labels.push(catalog.tags.find(t => t.id === activeTag)?.[language()] || activeTag);
      filters.querySelector('[data-filter-description]').textContent = labels.join(' · ');
      if (featured) featured.hidden = filtered;
      if (updateUrl) {
        const url = new URL(window.location.href);
        for (const [name, value] of [['q', input.value.trim()], ['tema', activeTheme], ['tag', activeTag], ['ordem', sort.value === 'oldest' ? 'oldest' : '']]) {
          if (value) url.searchParams.set(name, value);
          else url.searchParams.delete(name);
        }
        window.history.replaceState(null, '', url);
      }
    }

    function fromUrl() {
      const params = new URLSearchParams(window.location.search);
      input.value = (params.get('q') || '').slice(0, 200);
      activeTheme = catalog.themes.some(t => t.id === params.get('tema')) ? params.get('tema') : '';
      activeTag = catalog.tags.some(t => t.id === params.get('tag')) ? params.get('tag') : '';
      sort.value = params.get('ordem') === 'oldest' ? 'oldest' : 'recent';
      applyFilters();
    }

    function clear() {
      input.value = '';
      activeTheme = '';
      activeTag = '';
      sort.value = 'recent';
      applyFilters(true);
      input.focus();
    }

    input.form.addEventListener('submit', event => { event.preventDefault(); applyFilters(true); });
    input.addEventListener('input', () => applyFilters(true));
    sort.addEventListener('change', () => applyFilters(true));
    document.getElementById('blog-clear').addEventListener('click', clear);
    document.querySelector('[data-clear-search]').addEventListener('click', clear);
    window.addEventListener('popstate', fromUrl);
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        input.focus();
      }
    });
    // Em telas pequenas, os assuntos ficam em um disclosure nativo e acessível.
    const mobile = window.matchMedia('(max-width: 991px)');
    const tagDetails = document.querySelector('.blog-tag-list');
    const syncTagDetails = () => { tagDetails.open = !mobile.matches; };
    syncTagDetails();
    mobile.addEventListener('change', syncTagDetails);
    fromUrl();

    const viewport = document.querySelector('.blog-featured__viewport');
    let syncCarousel = () => {};
    if (viewport) {
      const previous = document.querySelector('[data-feature-prev]');
      const next = document.querySelector('[data-feature-next]');
      const page = document.querySelector('[data-feature-page]');
      function metrics() {
        const first = viewport.firstElementChild.firstElementChild;
        const gap = parseFloat(getComputedStyle(viewport.firstElementChild).gap) || 0;
        const step = first.getBoundingClientRect().width + gap;
        const perPage = Math.max(1, Math.round((viewport.clientWidth + gap) / step));
        return { step, perPage, total: Math.ceil(viewport.firstElementChild.children.length / perPage) };
      }
      syncCarousel = () => {
        const { step, perPage, total } = metrics();
        const current = Math.min(total, Math.round(viewport.scrollLeft / (step * perPage)) + 1);
        page.textContent = `${current} / ${total}`;
        previous.disabled = viewport.scrollLeft < 4;
        next.disabled = viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 4;
      };
      function move(direction) {
        const { step, perPage } = metrics();
        viewport.scrollBy({ left: direction * step * perPage, behavior: reduce.matches ? 'instant' : 'smooth' });
      }
      previous.addEventListener('click', () => move(-1));
      next.addEventListener('click', () => move(1));
      viewport.addEventListener('scroll', syncCarousel, { passive: true });
      viewport.addEventListener('keydown', event => {
        if (event.target !== viewport) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
      });
      window.addEventListener('resize', syncCarousel, { passive: true });
      syncCarousel();
    }

    let isPopular = false;
    function syncLanguage() {
      applyFilters();
      const label = document.getElementById('blog-featured-mode');
      if (label) label.textContent = translated(isPopular ? 'blog_popular' : 'blog_editorial');
    }
    // O motor global traduz assincronamente; observar lang também cobre setLanguage().
    new MutationObserver(syncLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    async function loadFeatured() {
      if (!viewport) return;
      try {
        // O feed público do repositório mantém o ranking vivo sem novo upload do site.
        // Em desenvolvimento usamos o arquivo local para não mascarar alterações.
        const isProduction = ['4watt.tech', 'www.4watt.tech'].includes(window.location.hostname);
        const liveFeed = 'https://raw.githubusercontent.com/4WaTT-Bio-Engenharia/site/main/data/blog/destaques.json';
        let response;
        try {
          response = await fetch(isProduction ? liveFeed : '/data/blog/destaques.json', { cache: 'no-cache', signal: AbortSignal.timeout(5000) });
          if (!response.ok) throw new Error('Feed indisponível');
        } catch (error) {
          response = await fetch('/data/blog/destaques.json', { cache: 'no-cache', signal: AbortSignal.timeout(5000) });
        }
        if (!response.ok) return;
        const data = await response.json();
        const ids = data.articleIds;
        if (!Array.isArray(ids) || ids.length !== 6 || new Set(ids).size !== 6 || !ids.every(id => posts.has(id))) return;
        const age = Date.now() - Date.parse(data.updatedAt);
        isPopular = data.mode === 'ga4' && Number.isFinite(age) && age >= -60000 && age <= 7 * 86400000 && ids.every(id => Number.isSafeInteger(data.views?.[id]) && data.views[id] > 0);
        if (data.mode === 'ga4' && !isPopular) return;
        const templates = document.getElementById('blog-feature-pool').content;
        const track = viewport.firstElementChild;
        track.replaceChildren(...ids.map(id => templates.querySelector(`[data-post-id="${id}"]`).cloneNode(true)));
        // A resposta pode chegar após a troca PT/EN. Traduzir somente os novos cards.
        track.querySelectorAll('[data-i18n]').forEach(element => {
          const value = translated(element.dataset.i18n);
          if (value) element.innerHTML = value;
        });
        track.querySelectorAll('[data-i18n-alt]').forEach(element => {
          const value = translated(element.dataset.i18nAlt);
          if (value) element.alt = value;
        });
        viewport.scrollLeft = 0;
        syncLanguage();
        syncCarousel();
      } catch (error) {
        // A seleção editorial já está no HTML e permanece utilizável sem a rede.
      }
    }
    loadFeatured();
  });
})();
