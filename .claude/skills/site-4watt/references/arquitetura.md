# Arquitetura — inventário

Levantado em 2026-08-05 varrendo os 25 HTMLs do repositório.

## Stack

Site estático multipágina. **Sem build, sem bundler, sem framework.** Deploy é upload
direto dos arquivos. Cada HTML é autocontido: navbar e footer duplicados em 24 arquivos.

## Páginas

`linhas` = tamanho do HTML · `i18n` = chaves de tradução usadas · `inline` = linhas em
blocos `<style>` dentro do HTML.

| Página | linhas | i18n | inline | Papel |
|---|---|---|---|---|
| `index.html` | 640 | 144 | 0 | Home. Hero em vídeo, ecossistema, matriz de resíduos, jornada, cases |
| `investidor.html` | 872 | 173 | 133 | **Landing do investidor.** Usa o layout da home |
| `investidor-projetos.html` | 5.747 | 240 | **3.379** | Marketplace de projetos, modal de NDA, formulário |
| `solucao-biogas.html` | 319 | 151 | 1 | Página de solução |
| `solucao-biometano.html` | 298 | 137 | 1 | Página de solução |
| `solucao-gaseificacao.html` | 604 | 146 | 6 | Página de solução |
| `contato.html` | 235 | 60 | 6 | Formulário de contato |
| `biometano/index.html` | 2.395 | 125 | 1.665 | Página dedicada, usa Leaflet |
| `artigos/index.html` | 698 | 46 | 446 | Listagem de artigos |
| `artigo-*.html` (3) | 1.491–2.272 | ~20 | 955–1.595 | Artigos individuais |
| `viabilidade/comprar-biometano.html` | 1.179 | 25 | 355 | Viabilidade |
| `imprensa.html` | 504 | 47 | 311 | Imprensa |
| `noticias.html` / `blog.html` | 727 / 568 | 35 / 17 | 435 / 373 | Listagens |
| `politica-privacidade.html` | 438 | 70 | 14 | Legal |
| `academy.html`, `partners.html`, `saas.html`, `score.html` | 141–273 | 25–63 | 6 | Stubs "em breve" |
| `404.html`, `500.html` | 481 | 25–34 | 305 | Erro |
| `artigos.html`, `biometano.html` | 16 | 0 | 0 | Stubs de redirect |
| `case-ceasa-goias.html` | ~650 | ~120 | 0 | Case de sucesso (criado 2026-08-13). Pilha limpa + `assets/css/case-ceasa.css` própria. Carrosséis com `data-marquee` (ver `SKILL.md`) |

> **`investidor.html` não usa mais `home-premium.css`.** Em 2026-08-14 o repositório
> remoto (`origin/main`) já tinha reescrito essa página sobre a pilha legada
> (`style.css` + `custom_v2.css` + `theme-4watt.css`), divergindo do que este arquivo
> descrevia antes ("landing do investidor, usa o layout da home"). Confirme sempre com
> `grep -n "\.css?v=" investidor.html` antes de assumir que ela compartilha CSS com a
> home — a informação muda com o tempo e este arquivo pode ficar desatualizado.

**`simulador.html` não existe** — mas é linkado por `404`, `500`, `artigos/index`,
`biometano/index`, `viabilidade/comprar-biometano` e por `snippets/navbar-premium.html`
(que propaga o erro). O simulador real é externo:
`https://calculadora-zeta-sooty.vercel.app/`.

## Duas gerações de CSS convivendo

### Geração atual — pilha limpa

`theme-4watt.css` + folha da página + `mobile-fixes.css`

Páginas: `index`, `investidor`, `solucao-*`, `contato`, `academy`, `partners`,
`saas`, `score`, `imprensa`, `politica-privacidade`.

### Geração legada — pilha pesada

`style.css` + `custom_v2.css` + `p7-block.css` + `design-system.css` +
`components.css` + `footer.css` + `legacy-bridge.css`

Páginas: `investidor-projetos`, `biometano/index`, `artigos/index`, `artigo-*`,
`blog`, `noticias`, `404`, `500`.

> **Não remova essas folhas achando que são inúteis.** Elas carregam layout real.
> `cinematic-home.css` sustenta todo o hero de `investidor-projetos.html`; removê-la
> derruba o alinhamento. Se precisar neutralizar algo nocivo delas, sobrescreva
> depois do carregamento em vez de remover.

Duas regras legadas conhecidas por descaracterizar o tema:
`style.css:199` → `body { font-family: Montserrat !important }` e
`custom_v2.css:1161` → `body { background-color: #3a0940 !important }`.

### Folhas por página

| Folha | Quem usa |
|---|---|
| `theme-4watt.css?v=3.9` | **todas as 23** — tokens, botões, formulários, footer |
| `mobile-fixes.css?v=2` | todas — carregar por último |
| `home-premium.css?v=3.4` | `index.html` **e** `investidor.html` |
| `solucoes.css` | `solucao-*` (v2.1 / v2.2 — **inconsistente**), `academy` |
| `contato.css?v=2.0` | `contato.html` |
| `legacy-bridge.css?v=3.0` | páginas legadas |
| `viabilidade-skin.css` | `viabilidade/` |
| `investidor-skin.css` | **carregada por ninguém** — morta |

## JavaScript

| Arquivo | Papel | Onde |
|---|---|---|
| `languages.js` | Dicionário de traduções, 293 KB | todas |
| `languages-pages.js` | Complemento de traduções | todas |
| `main.js` | i18n, preloader, UTM, contadores, FAQ | todas |
| `site-premium.js` | Navbar, scroll, reveal, parallax, hero `is-ready`, **carrossel marquee arrastável** (`initDraggableMarquee`/`initMarquees`, ver `SKILL.md`) | todas |
| `forms.js` | Validação, máscara, envio duplo, scoring de lead | páginas com formulário |
| `cases-modal-home.js` | Modal de case | `index`, `investidor` |
| `case-ceasa.js` | Slider antes/depois (`data-compare`) e lightbox da galeria | `case-ceasa-goias.html` |
| `animations.js` | Reveal e contadores (sobrepõe main/site-premium) | artigos, `biometano/` |
| `animations-3d.js` | Efeitos 3D | `investidor-projetos` |
| GSAP + ScrollTrigger | CDN | `investidor-projetos`, `biometano/` |
| Leaflet | CDN, mapa | `biometano/` |

**Código morto:** `languages-core.js`, `navbar.js`, `navbar-mobile.js`, `map.js`,
`calculator.js`, `biogas-scene.js`, `hero-video-scrub.js`, `cinematic*.js`,
`home-premium.js` e demais não referenciados.

**Responsabilidades sobrepostas:** `main.js`, `site-premium.js` e `animations.js`
implementam reveal, contadores e FAQ cada um à sua maneira. Para navbar e hero, a
autoridade é `site-premium.js`; para i18n e UTM, `main.js`.

## Hero: o ciclo `is-loading` → `is-ready`

O markup nasce `<header class="hero-h is-loading" data-hero>`. Em
`site-premium.js:170`:

```js
function set() { hero.classList.remove('is-loading'); hero.classList.add('is-ready'); }
```

O vídeo do hero fica `opacity: 0` até a classe `is-ready` entrar
(`home-premium.css:11`). Se `site-premium.js` não rodar, o hero fica invisível.

## Versionamento de assets

Estado em 2026-08-14: `theme-4watt.css?v=3.9`, `main.js?v=1.5`,
`site-premium.js?v=2.4`, `languages.js?v=2.3`, `home-premium.css?v=3.8` (só
`index.html`), `case-ceasa.css?v=1.3`/`case-ceasa.js?v=1.2` (só
`case-ceasa-goias.html`). **Números mudam a cada sessão que edita esses arquivos —
não confie neles, rode `auditar.py` item `[5]` pra ver o estado real.**

Duas divergências conhecidas e ainda não resolvidas (pré-existentes, não são deste
arquivo): `mobile-fixes.css` (`index.html` em `v=2.1`, resto em `v=2`) e
`solucoes.css` (`academy.html`/`solucao-gaseificacao.html` em `v=2.1`, resto em
`v=2.2`).

Mexeu num `.css`/`.js` compartilhado? Suba a versão **em todas as páginas de uma vez**:

```bash
find . -name "*.html" -not -name "*.bak*" -print0 | xargs -0 sed -i 's/arquivo\.css?v=1\.0/arquivo.css?v=1.1/g'
```

> `sed -i` no Git Bash grava fim de linha LF em arquivos que estão em CRLF, o que
> gera diff de arquivo inteiro. Confira com `git diff --stat` antes de commitar.

## Dados e backend

- `data/projetos-investidor.json` — cards do marketplace, via `fetch()` em
  `investidor-projetos.html`
- `apps-script/Code.gs` — scoring do lead e escrita no Sheets. **Exige deploy manual**
  no console do Apps Script
- Formspree `https://formspree.io/f/xpwzdnkl` — captura secundária

## Convenções

- Arquivos e classes em **kebab-case**; CSS em BEM (`.hero-h__inner`, `.feed__desc`)
- JS em camelCase; constantes em `SCREAMING_SNAKE_CASE`; IIFE para isolamento
- Estado global: `window.translations`, `window.setLanguage`, `window._projetosData`,
  `window.__INVESTOR_AUTOMATION_ENDPOINT`

## Checklist de deploy

- [ ] `?v=` subido nos assets alterados, em todas as páginas
- [ ] Chaves novas em `pt` **e** `en` (`languages.js` ou `languages-pages.js`,
      nunca `languages-core.js` — é código morto); `node --check assets/js/languages.js`
- [ ] `python .claude/skills/site-4watt/scripts/auditar.py` sem erros
- [ ] Conferido no navegador em 1280px e 375px, PT e EN, console limpo
- [ ] Página nova e indexável: canonical + OG/Twitter Card no `<head>` + entrada em
      `sitemap.xml` com `lastmod` real (`git log -1 --format=%cd --date=short -- arquivo`,
      nunca `new Date()`) — ver `references/seo-geo.md`
- [ ] Página stub/institucional sem conteúdo pronto: `noindex, follow` no `<head>` e
      **fora** do `sitemap.xml` — as duas coisas juntas, nunca só uma
- [ ] `*.html.bak` fora do upload
