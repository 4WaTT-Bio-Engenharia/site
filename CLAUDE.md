# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static multi-page website for 4WaTT (biogas/biomethane energy solutions). No build system — all pages are plain HTML files with CSS/JS loaded via CDN or local `/assets/` folder. Deployment is direct file upload to static hosting.

> **Authoritative deep reference:** `AGENTS.md` (repo root, in Portuguese) is the most detailed guide for this codebase. Read it before non-trivial changes.

## Development

No build, compile, or test step. Serve the repo root with any static file server:

```bash
python3 -m http.server 5501
# or: npx serve -l 5501
```

Then open `http://localhost:5501/index.html`. Edit HTML/CSS/JS in place and refresh.

## Architecture

### Two Asset Hierarchies — Important

- **`assets/`** — modern code used by all active pages. **Edit here.**
- **`css/`**, **`js/`**, **`images/`** — legacy vendor copies from an old template (Bootstrap 4.5, jQuery 1.12.4). Not loaded by any active page. Do not edit.

### Page Structure

Each HTML page is self-contained. Navbar and footer markup are duplicated in every file (no templating engine). There are 20 HTML files in the root plus 3 active pages in subfolders:

| Active pages | Purpose |
|---|---|
| `index.html` | Homepage — hero video, ecosystem overview, proof of value |
| `investidor.html` | Investor area — project cards, lead form, ROI calculator |
| `solucao-biogas.html` / `solucao-biometano.html` / `solucao-gaseificacao.html` | Product detail pages |
| `contato.html` | Contact form |
| `artigos/index.html` | Article listing |
| `biometano/index.html` | Dedicated biometano page (uses Leaflet map, not Mapbox) |
| `viabilidade/comprar-biometano.html` | Viability page |
| `artigos.html` / `biometano.html` | Short redirect stubs only |
| `academy.html`, `simulador.html`, `partners.html`, `saas.html`, `score.html` | "Coming soon" stubs |

**Backup files:** `*.html.bak` and `assets/pages/` are manual backups — always edit the root/subfolder original. Do not deploy `.bak` files.

### Navbar

All active pages use the **premium navbar** (`<nav class="nav">`), driven by:
- `assets/css/theme-4watt.css?v=3.2`
- `assets/js/site-premium.js?v=2.2`

Reference snippet: `snippets/navbar-premium.html`. The navbar includes scroll progress, PT/EN language selector (`.lang-btn[data-lang]`), and a Soluções dropdown.

To add the subtle aurora background to a page with a white/plain background:
```html
<div class="bg-aurora bg-aurora--light"></div>
```
Place this immediately after `<body>`.

### Active JavaScript Files (`assets/js/`)

| File | Responsibility |
|---|---|
| `main.js` | Preloader, hero slider, FAQ accordion, mobile menu (legacy path), reveal animations, counters, WhatsApp bot, UTM capture, i18n system (`applyTranslations`, `changeLanguage`) |
| `site-premium.js` | **Premium navbar**: scroll behavior, progress bar, mobile menu, Soluções dropdown, PT/EN language selector, reveal, counters, parallax, FAQ, smooth anchors |
| `forms.js` | Form validation, phone masking, UTM propagation to `sessionStorage`, dual-submit (Formspree + Google Sheets), investor lead scoring, `#modal-interesse` |
| `animations.js` | IntersectionObserver for scroll-reveal and animated counters |
| `languages.js` | Full PT/EN translation dictionary (~810 lines, ~100 KB) |
| `languages-core.js` | Minimal PT/EN key subset for lightweight pages (individual articles) |
| `cases-modal-home.js` | Case-study modal — loaded by `index.html` |

**Dead code (in repo but not loaded by active pages):** `navbar.js`, `navbar-mobile.js`, `map.js`, `calculator.js`, `biogas-scene.js`, `scroll-video-canvas.js`, `hero-video-scrub.js`, `video-word-mask.js`, `cinematic.js`, `cinematic-animations.js`, `background-controller.js`, `languages-extended.js`, `home-premium.js`.

**Exception:** `investidor.html` loads `animations-3d.js` + `cinematic-home.css`.

Scripts use IIFEs `(function(){ ... })()` for scope isolation. New code uses vanilla ES6+; jQuery exists only via legacy plugins.

### Active CSS Files (`assets/css/`)

| File | Responsibility |
|---|---|
| `theme-4watt.css` | **Shared theme**: brand palette CSS vars, aurora background, editorial typography, utility classes |
| `style.css` | Main stylesheet — animations, hero utils, section layouts, cards, grids |
| `custom_v2.css` | Final overrides (must load last) |
| `components.css` | Reusable UI: buttons, cards, badges, forms, modals |
| `design-system.css` | Design tokens: semantic color/type/spacing vars |
| `mobile-fixes.css` | Global responsive corrections (load last) |
| `home-premium.css` | `index.html`-specific styles |
| `solucoes.css` | Solução detail page styles |
| `investidor.css` / `investidor-skin.css` | Investor page overrides |
| `contato.css` | Contact page |
| `cinematic-home.css` | Loaded only by `investidor.html` |
| `footer.css` | Footer styles |

LESS source files (`*.less`) in `/css/` are committed as reference. There is no build step — edit the compiled `.css` directly.

**Brand palette (defined in `theme-4watt.css` `:root`):**
- `--roxo: #3A0940`, `--roxo-soft: #6e2466`, `--plum: #2A0720`
- `--teal: #03A589`, `--gold: #DBAA0F`

### Internationalisation

Translation at runtime via `applyTranslations(lang)`, which reads `translations[lang][key]` from `languages.js`. Language persists in `localStorage.preferredLang`. Apply translations in HTML using:
- `data-i18n` → sets `innerHTML`
- `data-i18n-placeholder` → sets `placeholder`
- `data-i18n-title` → sets `title`

To add translatable content, add the key to **both** `pt` and `en` objects in `languages.js` (or `languages-core.js` for lightweight pages).

### Forms & Backend

Both endpoints fire on every form submit:

1. **Google Apps Script** — endpoint in `forms.js` as `GLOBAL_SHEETS_ENDPOINT` and in `investidor.html` as `window.__INVESTOR_AUTOMATION_ENDPOINT`. Classifies leads as `APTO`/`TRIAGEM`/`NAO_APTO`, writes to Google Sheets, emails alert on `APTO`. Logic in `apps-script/Code.gs`.
2. **Formspree** (`DEFAULT_ENDPOINT = https://formspree.io/f/xpwzdnkl`) — fallback/secondary capture.

Investor lead scoring: volume (`acima-50mi`=4 pts) + keywords (fundo, equity, NDA, etc.) + company/name → `APTO` (≥5 pts or volume ≥3), `TRIAGEM` (≥3), else `NAO_APTO`.

### Data

`data/projetos-investidor.json` — investor project cards loaded via `fetch()` in `investidor.html`. Edit to add/update listings. Key fields: `id`, `slug`, `nome_publico`, `tecnologia`, `estagio`, `investimento_estimado`, `tir_estimada_min/max`, `prazo_retorno`.

## Key Conventions

- **File naming:** kebab-case
- **CSS classes:** BEM-like (`.hero__video`, `.glass-card`, `.form-field`)
- **JS functions:** camelCase; constants: `SCREAMING_SNAKE_CASE`
- **Global state:** `window._usinaMap`, `window._usinasData`, `window._projetosMap`, `window._projetosData`, `window.translations`, `window.setLanguage`
- **Asset versioning:** bump query strings on `<link>`/`<script>` tags (`style.css?v=1.2`) after breaking CSS/JS changes

## Critical Gotchas

1. **Navbar/footer duplication:** any change must be replicated across all HTML files manually. Consider grep-replace or `assets/pages/update_footers.py` (update its file list first — it references old page names).

2. **Overlapping responsibilities:** `main.js`, `site-premium.js`, and `animations.js` each implement reveal/counters/FAQ. Prefer `site-premium.js` for navbar behavior and `main.js` for i18n/UTMs.

3. **Google Apps Script deploys:** editing `apps-script/Code.gs` has no effect until you deploy a new version in the Apps Script console.

4. **`assets/pages/` mirrors:** always edit the root/subfolder original; this folder is a manual backup only.

5. **Mapbox token:** `map.js` has placeholder `pk.MAPBOX_TOKEN_AQUI`. The file is not loaded by any active page — if reactivating, replace the token before deploying.

6. **`sitemap.xml`** is outdated (references `/sobre/`, `/projetos/` which don't exist). Update it when adding pages.

## Deploy Checklist

- [ ] Bump `?v=X.X` query strings on changed CSS/JS files
- [ ] Verify `GLOBAL_SHEETS_ENDPOINT` in `forms.js` and `window.__INVESTOR_AUTOMATION_ENDPOINT` in `investidor.html` are current
- [ ] Update `sitemap.xml` if pages were added/removed
- [ ] Exclude `*.html.bak` and `assets/pages/` from the upload if they contain stale content
- [ ] Repack `_public_html.zip` if that is the upload method
