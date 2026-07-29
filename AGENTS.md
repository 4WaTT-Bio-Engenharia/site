<!-- AGENTS.md — 4WaTT Bio Engenharia S/A -->

> Arquivo de referência para agentes de codificação AI. Este projeto é um site estático multi-página para a 4WaTT, empresa de soluções em biogás/biometano. Leia este arquivo antes de fazer qualquer modificação.

---

## 1. Visão Geral do Projeto

Site institucional e comercial **estático**, sem sistema de build. Todas as páginas são arquivos HTML plain com CSS e JS carregados via CDN ou pasta local `/assets/`. O deploy é feito por upload direto de arquivos para hospedagem estática. A navbar premium (`<nav class="nav">`) e o seletor de idioma PT/EN são padrão nas páginas ativas.

**Idioma principal:** Português (pt-br) — todo o conteúdo, comentários e documentação interna estão em português. O site suporta múltiplos idiomas via sistema de tradução runtime (`pt`, `en`, `es`, `it`, `fr`, `de`, `no`).

**Não existe:** `package.json`, `pyproject.toml`, `Cargo.toml`, `composer.json`, `Gemfile`, `Makefile`, `.gitignore`, `.github/workflows/`, `docker-compose.yml`, `Dockerfile`, `.env`, `.vscode/settings.json`, testes automatizados, linters, CI/CD ou qualquer ferramenta de build. As páginas são editadas manualmente e enviadas diretamente ao servidor.

---

## 2. Tecnologias e Stack

| Tecnologia | Uso / Versão real observada |
|---|---|
| HTML5 | Estrutura das páginas (sem templating engine) |
| CSS3 | Estilização pura; arquivos LESS fonte não são usados atualmente |
| JavaScript ES6+ | Interatividade em vanilla JS |
| jQuery / Bootstrap | **Não carregados pelas páginas ativas**; apenas arquivos legados, se existirem em outro local |
| Font Awesome | `6.5.1` via CDN em praticamente todas as páginas ativas |
| Google Fonts | Montserrat, Inter, Syncopate, Roboto Mono, Bricolage Grotesque, Hanken Grotesque (varia por página) |
| GSAP + ScrollTrigger | `3.12.5` via CDN em `investidor.html` e `biometano/index.html` |
| Leaflet | `1.9.4` via CDN apenas em `biometano/index.html` |
| Google Apps Script | Backend de captura e triagem de leads para Google Sheets |
| Formspree | Fallback para envio de formulários (`xpwzdnkl`) |
| Google Analytics 4 | Measurement ID `G-N91NFD55MB`, inline no `<head>` das páginas comerciais |

### Padrões de código

- Novo código usa **vanilla ES6+** (arrow functions, const/let, async/await, template literals).
- Scripts usam **IIFE** `(function(){ ... })()` para isolamento de escopo.
- Funções nomeadas em **camelCase**: `maskPhone`, `applyTranslations`.
- Constantes em **SCREAMING_SNAKE_CASE**: `DEFAULT_ENDPOINT`, `GLOBAL_SHEETS_ENDPOINT`.
- Estado global exposto em `window.*` quando necessário: `window.translations`, `window.setLanguage`, `window.applyTranslations`.
- Inicialização no evento `DOMContentLoaded`.
- Event listeners passivos para scroll quando possível: `{ passive: true }`.

---

## 3. Estrutura de Diretórios

```
├── *.html                    # 22 arquivos .html na raiz (20 ativos + 2 redirecionamentos)
├── artigos/
│   ├── index.html            # /artigos/ (listagem de artigos)
│   └── index.html.bak        # backup manual
├── assets/
│   ├── css/                  # 18 folhas de estilo ativas
│   ├── js/                   # 10 scripts JS ativos
│   ├── img/                  # imagens atuais
│   │   └── partners/         # logos de parceiros
│   ├── img_old/              # imagens antigas (algumas ainda referenciadas)
│   └── biogas_fly2.mp4       # vídeo de hero
├── biometano/
│   ├── index.html            # /biometano/ (página dedicada com Leaflet)
│   └── index.html.bak
├── data/
│   ├── projetos-investidor.json   # cards de projetos da área do investidor
│   └── ...                        # documentos PDF/docx
├── scripts/
│   ├── inject_i18n_pages.py  # injeta languages-pages.js e corrige paths
│   └── update_navbar_logos.py # propaga navbar premium (referência/automação parcial)
├── snippets/
│   └── navbar-premium.html   # snippet de referência da navbar
├── viabilidade/
│   └── comprar-biometano.html    # calculadora de equivalência energética
├── sitemap.xml               # sitemap parcial
├── AGENTS.md                 # este arquivo
└── CLAUDE.md                 # guia rápido para Claude
```

> **Atenção:** no estado atual do repositório **não existem** as pastas legadas `/css/`, `/js/` e `/images/`, nem a pasta `assets/pages/`, nem o arquivo `_public_html.zip`. O código ativo está concentrado em `/assets/`.

### Navbar premium

Todas as páginas ativas usam a **navbar premium** (`<nav class="nav">`) controlada por:
- `assets/css/theme-4watt.css?v=3.4`
- `assets/js/site-premium.js?v=2.1`

A navbar atual inclui:
- Logo/link para home
- Links de âncora: Ecossistema, Resíduos, Equipamentos, Jornada
- Dropdown **Soluções**: Engenharia de Biogás, Biometano, Gaseificação de RSU
- Link **Área do Investidor**
- Link **Imprensa**
- Seletor de idioma **PT/EN** (`.lang-btn[data-lang]`)
- CTA primário (varia por página; padrão: "Simular Viabilidade")
- Barra de progresso de scroll (`.nav__progress`)

Snippet de referência: `snippets/navbar-premium.html`.

> **Cuidado:** os scripts `update_navbar_logos.py` e `inject_i18n_pages.py` são auxiliares, mas a navbar real das páginas foi editada manualmente e pode conter ajustes que os scripts não reproduzem fielmente. Sempre valide visualmente após rodá-los.

### Animações de fundo

Para páginas com fundo plano/branco, adicionar:
```html
<div class="bg-aurora bg-aurora--light"></div>
```
Logo após a tag `<body>`. O efeito é sutil, respeita `prefers-reduced-motion` e não interfere na leitura.

---

## 4. Páginas HTML Ativas

Cada página é **autocontida** — não há sistema de templates. Navbar e footer são duplicados em cada arquivo.

### Páginas ativas na raiz (20 arquivos)

| Arquivo | Propósito | GA4 | Formulário |
|---|---|---|---|
| `index.html` | Homepage premium — hero com vídeo, ecossistema, prova de valor | Sim | Não |
| `investidor.html` | Área do investidor — listagem de projetos, formulário de lead | Sim | Sim |
| `solucao-biogas.html` | Página de detalhe do produto — Biogás | Sim | Sim |
| `solucao-biometano.html` | Página de detalhe do produto — Biometano | Sim | Sim |
| `solucao-gaseificacao.html` | Página de detalhe do produto — Gaseificação | Sim | Sim |
| `contato.html` | Formulário de contato | Sim | Sim |
| `artigo-como-funciona-biodigestor.html` | Artigo individual | Não | Não* |
| `artigo-creditos-carbono.html` | Artigo individual | Não | Não* |
| `artigo-regulacao-biometano.html` | Artigo individual | Não | Não* |
| `blog.html` | Blog / conteúdo (`noindex`) | Sim | Não |
| `noticias.html` | Notícias e mídia (`noindex`) | Não | Não |
| `imprensa.html` | Sala de imprensa (`noindex`) | Sim | Não |
| `academy.html` | Stub "Em breve" — 4WaTT Academy (`noindex`) | Sim | Não |
| `simulador.html` | Stub "Em breve" — 4WaTT Simulador | Sim | Não |
| `partners.html` | Stub — Ecossistema de Parceiros (`noindex`) | Sim | Não |
| `saas.html` | Stub — Plataforma SaaS (`noindex`) | Sim | Não |
| `score.html` | Stub — Score/Análise (`noindex`) | Sim | Não |
| `404.html` | Página de erro 404 | Não | Não |
| `500.html` | Página de erro 500 | Não | Não |
| `artigos.html` | **Redirecionamento** para `/artigos/` | Não | Não |
| `biometano.html` | **Redirecionamento** para `/biometano/` | Não | Não |

\* Os artigos carregam `forms.js`, mas não possuem formulário `form-4watt` ativo.

### Páginas ativas em subpastas (3 arquivos)

- `artigos/index.html` — listagem de artigos
- `biometano/index.html` — página dedicada ao biometano (usa Leaflet, não Mapbox)
- `viabilidade/comprar-biometano.html` — calculadora de equivalência energética com script inline

**Total: 23 páginas HTML ativas** (excluindo `.bak`).

---

## 5. JavaScript — Organização e Arquivos Principais

### `assets/js/` (código moderno — prioridade)

| Arquivo | Responsabilidade real | Status |
|---|---|---|
| `languages.js` | Dicionário completo de traduções para **pt/en/es/it/fr/de/no** (~2.611 linhas, `window.translations`) | **Ativo — core** |
| `languages-pages.js` | Complemento de traduções para artigos, stubs e páginas de erro (apenas chaves `pt`) | **Ativo — core** |
| `languages-core.js` | Subconjunto mínimo de chaves i18n | **Não carregado** |
| `main.js` | Preloader, slider de hero, FAQ accordion, controle de volume de vídeo, mobile menu legado, reveal animations, contadores, WhatsApp bot, tracking, preservação de UTMs, internacionalização (`applyTranslations`, `setLanguage`) | **Ativo — core** |
| `site-premium.js` | **Navbar premium** (scroll, progresso, menu mobile, dropdown Soluções, seletor PT/EN), reveal, counters, parallax, FAQ, funil, âncoras suaves | **Ativo — core** |
| `forms.js` | Validação de formulários, máscara de telefone BR, captura de UTMs para `sessionStorage`, envio via fetch (Formspree + Google Sheets), classificação de leads investidor, modal de interesse | **Ativo — condicional** |
| `animations.js` | IntersectionObserver nativo para scroll reveal e contadores | **Ativo — biometano/artigos** |
| `cases-modal-home.js` | Modal dos cases da home | **Ativo — index.html** |
| `animations-3d.js` | Animações cinemáticas com GSAP + ScrollTrigger | **Ativo — investidor.html** |

### Outros arquivos em `assets/js/`

- `languages-extended.js`, `navbar.js`, `navbar-mobile.js`, `map.js`, `calculator.js`, `biogas-scene.js`, `scroll-video-canvas.js`, `hero-video-scrub.js`, `video-word-mask.js`, `cinematic.js`, `cinematic-animations.js`, `background-controller.js`, `home-premium.js`, `metrics-counter.js`, `deliverables-toggle.js`, `back-to-top.js` — **não existem ou não são carregados** pelas páginas ativas. Não modifique expectativas de deploy com base neles.

### Scripts por página (padrão atual)

Páginas na raiz e stubs carregam:
```html
<script src="assets/js/languages.js?v=1.8"></script>
<script src="assets/js/main.js?v=1.4"></script>
<script src="assets/js/site-premium.js?v=2.1"></script>
```

Páginas com formulário adicionam:
```html
<script src="assets/js/forms.js?v=1.3"></script>
```

Páginas em subpastas usam paths absolutos ou relativos (`/assets/js/...` ou `../assets/js/...`).

> **Atenção:** algumas páginas de artigo carregam `forms.js` duas vezes (uma com `?v=1.3` e outra sem versão), mesmo sem possuírem formulário. Isso é código morto que pode ser removido, mas não afeta o funcionamento.

---

## 6. CSS — Organização e Arquivos Principais

### `assets/css/` (folhas modernas)

| Arquivo | Responsabilidade | Status |
|---|---|---|
| `theme-4watt.css` | **Tema oficial compartilhado**: paleta (`--roxo`, `--teal`, `--gold`), fundo aurora, tipografia editorial, classes utilitárias `.t4`, botões, grades, responsividade base | **Ativo — core** |
| `style.css` | Folha principal moderna (~3.576 linhas): animações reveal, hero utils, layouts de seções, cards, FAQ, grids, componentes diversos | **Ativo — major** |
| `custom_v2.css` | Overrides finais e correções específicas (load order importa — carregar por último) | **Ativo — overrides** |
| `components.css` | Componentes reutilizáveis: botões, cards, badges, formulários, modais | **Ativo — componentes** |
| `design-system.css` | Tokens de estilo: cores, tipografia, espaçamentos, variáveis semânticas | **Ativo — tokens** |
| `footer.css` | Estilos do footer cinematic (`#footer`) | **Ativo — footer** |
| `mobile-fixes.css` | Correções responsivas globais carregadas por último | **Ativo — responsive** |
| `legacy-bridge.css` | Ponte de compatibilidade entre tema novo e classes legadas | **Ativo — bridge** |
| `home-premium.css` | Estilos específicos da home premium (`index.html`) | **Ativo — index.html** |
| `solucoes.css` | Estilos das páginas de solução (`solucao-biogas.html`, etc.) | **Ativo — soluções** |
| `investidor-skin.css` | Estilos da área do investidor | **Ativo — investidor.html** |
| `cinematic-home.css` | Estilos de experiências cinematográficas | **Ativo — investidor.html** |
| `contato.css` / `viabilidade-skin.css` | Estilos específicos de `contato.html` e `viabilidade/comprar-biometano.html` | **Ativo — específicos** |
| `page-common.css` / `design-system-3d.css` | Carregados por `biometano/index.html` | **Ativo — biometano** |
| `p7-block.css` | Blocos específicos de artigos e investidor | **Ativo — condicional** |

### Paleta de marca (`:root` em `theme-4watt.css`)

- `--roxo: #3A0940`
- `--roxo-soft: #6e2466`
- `--plum: #2A0720`
- `--teal: #03A589`
- `--gold: #DBAA0F`

### Padrões de CSS

- **Classes BEM-like**: `.hero__video`, `.glass-card`, `.nav-dropdown-wrapper`, `.form-field`, `.btn--primary`.
- **Mobile-first** com breakpoints principais em `992px`.
- **Easing padrão premium**: `cubic-bezier(0.2, 0.6, 0.2, 1)` e variações em `theme-4watt.css`.
- Classes de reveal: `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-up`, `.stagger-item`, `[data-reveal]`.
- **Versionamento de assets**: use query strings em tags `<link>` e `<script>` (`style.css?v=1.2`) — incremente quando fizer mudanças quebradoras em CSS/JS.

---

## 7. Dados

### `data/projetos-investidor.json`

Contém os cards de projetos exibidos na área do investidor. Carregado via `fetch()` em `investidor.html`.

Campos principais de cada projeto:
- `id`, `slug`, `nome_publico`, `confidencial`
- `estado`, `lat`, `lng`
- `tecnologia`, `tipo_residuo`, `capacidade`
- `estagio`, `investimento_estimado`
- `tir_estimada_min`, `tir_estimada_max`, `prazo_retorno`
- `documentos_disponiveis`, `descricao`, `destaques`

Para adicionar ou atualizar projetos, edite este arquivo JSON diretamente. Ele está validado como JSON bem-formado.

---

## 8. Formulários e Backend

Os formulários do site enviam dados para **dois destinos simultâneos**:

### 1. Google Apps Script (`apps-script/Code.gs`)

- **Endpoint real:** `https://script.google.com/macros/s/AKfycbzKxvU_dl3ycekvyhcNrS54cm3UvdyEeA6e7uX8QZ0/exec` (em `forms.js` e em `investidor.html` via `window.__INVESTOR_AUTOMATION_ENDPOINT`)
- **E-mail de alerta:** `4watt.tech@gmail.com`
- **Aba de leads:** `"Leads Investidor"`
- **Aba de aptos:** `"Leads Aptos"`
- **Spreadsheet ID:** lido de `PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID")`
- Classifica leads como `APTO` / `TRIAGEM` / `NAO_APTO`
- Leads `APTO` também são copiados para a aba `"Leads Aptos"`
- Envia e-mail de alerta quando um lead apto entra

A lógica de scoring no backend considera:
- Volume de interesse: `ate-5mi`=1, `5-20mi`=2, `20-50mi`=3, `acima-50mi`=4
- Palavras-chave na mensagem: `fundo`, `equity`, `family office`, `private equity`, `ticket`, `investimento`, `nda`, `memorando`, `capex`
- Pontos extras: empresa (+1), nome (+1)
- Status: `APTO` (score ≥5 ou volume ≥3), `TRIAGEM` (score ≥3), `NAO_APTO`

### 2. Formspree

- **Endpoint:** `https://formspree.io/f/xpwzdnkl`
- Fallback / captura secundária
- Usado quando o endpoint do Google Sheets não está configurado

### `assets/js/forms.js`

- Captura UTMs de `sessionStorage` e URL
- Adiciona metadados: `_page_url`, `_page_title`, `_timestamp`
- Classifica leads no frontend via `classifyInvestorLead(data)`
- Seleciona formulários com classe `form-4watt`
- Dispara evento `gtag('event', 'form_submit', ...)` no GA4
- Modal de interesse: `#modal-interesse` ativado por `[data-open-modal="interesse"]`

### Campos UTM

Todos os formulários capturam e propagam parâmetros UTM:
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- Armazenados em `sessionStorage` para persistência entre páginas
- `main.js` faz segunda preservação em `localStorage` sob a chave `4watt_utms`
- Incluídos no payload de envio junto com `_page_url`, `_page_title`, `_timestamp`

### Formulários ativos por página

Apenas **7 páginas ativas** contêm formulários `form-4watt`:

| Página | Form ID | `data-form-name` | Campos principais |
|---|---|---|---|
| `contato.html` | `contactForm` | Contato | nome, empresa, email, whatsapp, motivo, mensagem |
| `investidor.html` | `form-investidor` | Área do Investidor | nome, empresa, email, whatsapp, volume_interesse, mensagem, projeto_interesse |
| `investidor.html` | `mp-nda-form` | NDA - Marketplace | nome, empresa, email, whatsapp, cargo, projeto |
| `solucao-biogas.html` | `form-engenharia-biogas` | Engenharia de Biogás | nome, empresa, email, whatsapp, substrato, etapa |
| `solucao-biometano.html` | `form-biometano` | Produção de Biometano | nome, empresa, email, whatsapp, biogas_volume, situacao, mensagem |
| `solucao-gaseificacao.html` | `form-gaseificacao-rsu` | Gaseificação de RSU | nome, email, whatsapp, municipio |
| `biometano/index.html` | `form-biometano-comprador` | — | nome, empresa, email, whatsapp, volume_desejado, prazo_contrato, formato_entrega, localizacao_entrega, mensagem |

> **Atenção:** como `forms.js` envia todo formulário `form-4watt` tanto para o Formspree quanto para o `GLOBAL_SHEETS_ENDPOINT`, leads de contato/comercial também chegam à planilha "Leads Investidor". Avalie se essa união é intencional antes de alterar a lógica.

---

## 9. Internacionalização (i18n)

Suporte a múltiplos idiomas via tradução runtime.

### Arquivos

- `assets/js/languages.js` — dicionário completo para **pt/en/es/it/fr/de/no** (~2.611 linhas)
- `assets/js/languages-pages.js` — complemento de chaves para artigos, stubs e páginas de erro (apenas `pt`)
- `assets/js/languages-core.js` — subconjunto mínimo PT/EN (não carregado atualmente)

### Funcionamento

- `applyTranslations(lang)` aplica chaves via atributos:
  - `data-i18n` → `innerHTML`
  - `data-i18n-placeholder` → `placeholder`
  - `data-i18n-title` → `title`
  - `data-i18n-alt` → `alt`
  - `data-i18n-aria-label` → `aria-label`
  - `meta[data-i18n-content]` → `content`
- `changeLanguage(lang)` salva em `localStorage.setItem('preferredLang', lang)`
- Idioma padrão: `'pt'`
- `document.documentElement.lang` é atualizado dinamicamente
- **Seletor ativo:** `.lang-btn[data-lang="pt|en"]` na navbar premium (`site-premium.js`)

> **Observação:** embora `main.js` referencie `languages-extended.js` para os idiomas ES/IT/FR/DE/NO, esse arquivo **não existe** no repositório. Como todas as traduções já estão dentro de `languages.js`, os idiomas adicionais funcionam sem ele. Chaves ausentes em `languages-pages.js` para idiomas diferentes de PT usam fallback para PT.

---

## 10. Mapas

### Uso real: `biometano/index.html`

A única página com mapa ativo usa:
- **Leaflet 1.9.4** (CDN)
- Tiles CartoDB: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
- Mapa inline no próprio HTML
- Dados de usinas hardcoded no HTML

Não há `data/usinas.json` no repositório atual.

---

## 11. Analytics

Google Analytics 4 configurado inline no `<head>` das páginas comerciais:

- **Measurement ID:** `G-N91NFD55MB`
- **Stream ID:** `3217095081` (em algumas páginas via `window.__GA4_FLOW`)

**Páginas COM GA4:** `index.html`, `investidor.html`, `contato.html`, `solucao-biogas.html`, `solucao-biometano.html`, `solucao-gaseificacao.html`, `blog.html`, `imprensa.html`, `academy.html`, `simulador.html`, `partners.html`, `saas.html`, `score.html`.

**Páginas SEM GA4:** `404.html`, `500.html`, `artigos.html`, `biometano.html`, `noticias.html`, `artigo-*.html`, `artigos/index.html`, `biometano/index.html`, `viabilidade/comprar-biometano.html`.

Eventos de conversão disparados via `gtag()` em `forms.js`:
- `form_submit` — quando formulário é enviado com sucesso
- Status do lead (`APTO`, `TRIAGEM`, `NAO_APTO`) passado como parâmetro do evento

---

## 12. Desenvolvimento

### Como rodar localmente

Não há build. Sirva a pasta raiz com qualquer servidor estático:

```bash
# Opção 1: Python
python3 -m http.server 5501

# Opção 2: Node (se instalado globalmente)
npx serve -l 5501

# Opção 3: PHP
php -S localhost:5501
```

Depois acesse `http://localhost:5501/index.html`.

### Scripts utilitários

- `scripts/inject_i18n_pages.py` — injeta `languages-pages.js` nas páginas que já carregam `languages.js`, corrige paths de assets em subpastas (`assets/` → `/assets/`) e atualiza a versão de `main.js`.
- `scripts/update_navbar_logos.py` — substitui a navbar premium (`<nav class="nav">`) nas páginas da raiz e subpastas, normaliza paths dos logos e incrementa query strings de CSS. Use com cautela: a navbar real pode ter ajustes manuais não refletidos no script.

### Não existe

- `npm install` / `package.json`
- Scripts de build
- Testes automatizados
- Linting
- CI/CD pipelines
- Docker

---

## 13. Testes

**Não existem testes automatizados.** Não há:
- Arquivos de teste (`*.test.js`, `*_test.py`, etc.)
- Frameworks de teste
- Scripts de teste
- Linters ou formatters
- CI/CD

A validação ocorre manualmente via navegador após edições. Para testar:

1. Inicie um servidor estático local (`python3 -m http.server 5501`).
2. Abra a página alterada no navegador.
3. Verifique visualmente o layout em desktop e mobile.
4. Teste interações: menu mobile, FAQ, formulários, troca de idioma, mapa (em `biometano/index.html`).
5. Verifique o console do navegador por erros de JS.
6. Teste envios de formulário com cuidado para não poluir a planilha de produção.

---

## 14. Deploy

Deploy é feito por **upload direto de arquivos** para hospedagem estática. Não há processo automatizado.

> No momento, **não existe** `_public_html.zip` na raiz. Se a equipe usar esse pacote para deploy, será necessário compactar a pasta raiz manualmente quando for gerar o pacote.

### Checklist pré-deploy

- [ ] Verificar se o endpoint do Google Apps Script em `forms.js` está atualizado
- [ ] Verificar se o endpoint `window.__INVESTOR_AUTOMATION_ENDPOINT` em `investidor.html` está atualizado
- [ ] Atualizar `sitemap.xml` se novas páginas foram adicionadas (o arquivo atual cobre as principais páginas comerciais)
- [ ] Incrementar query strings de versionamento em CSS/JS (`?v=X.X`) para cache-busting
- [ ] Evitar enviar arquivos `.bak` para produção
- [ ] Compactar a pasta raiz em `_public_html.zip` se esse for o método de envio utilizado

---

## 15. Convenções de Código

### Nomenclatura

- **Arquivos e pastas:** kebab-case (`solucao-biogas.html`, `hero-video-text.css`)
- **Classes CSS:** BEM-like (`.hero__video`, `.glass-card`, `.nav-dropdown-wrapper`, `.form-field`)
- **Funções JS:** camelCase (`maskPhone`, `initUsinasMap`, `applyTranslations`)
- **Variáveis JS:** camelCase (`currentSlideIndex`, `leadData`)
- **Constantes:** SCREAMING_SNAKE_CASE (`DEFAULT_ENDPOINT`, `GLOBAL_SHEETS_ENDPOINT`)

### Organização de código

- IIFE para isolamento de escopo em arquivos JS
- Inicialização no evento `DOMContentLoaded`
- Event listeners passivos para scroll quando possível: `{ passive: true }`
- Preferir `const`/`let` ao invés de `var` em código novo
- Código novo vai para `assets/js/` e `assets/css/`

### CSS

- Variáveis CSS no `:root` para cores da marca
- Mobile-first com breakpoints principais em `992px`
- Animações usam easing premium
- Classes de reveal: `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-up`, `.stagger-item`, `[data-reveal]`

---

## 16. Considerações de Segurança

- **Tokens sensíveis:** não há token do Mapbox no repositório atual (`map.js` não existe).
- **Endpoints:** URLs de Google Apps Script e Formspree estão hardcoded em `forms.js`. Estes são endpoints públicos por natureza (webhooks), mas monitore o uso.
- **UTMs:** Dados de UTM são armazenados em `sessionStorage` e `localStorage` — não contêm dados pessoais sensíveis.
- **Formulários:** Validação básica de e-mail (regex simples) e telefone (mínimo 10 dígitos) no frontend. A validação real ocorre no backend do Google Sheets.
- **Backups `.bak`:** Evite expor arquivos `.bak` no deploy para produção — eles podem conter informações desatualizadas ou código de teste.
- **Dados de projetos:** `data/projetos-investidor.json` pode conter informações comerciais sensíveis; revise antes de expor novos campos publicamente.
- **Dupla submissão de formulários:** Todo `form-4watt` dispara POST para Formspree e para o Google Apps Script do investidor. Isso significa que leads de contato/comercial também alimentam a planilha "Leads Investidor". Avalie se essa união é intencional antes de alterar a lógica.
- **Scoring duplicado:** A classificação `APTO`/`TRIAGEM`/`NAO_APTO` ocorre tanto no frontend (`forms.js`) quanto no backend (`Code.gs`), com regras ligeiramente diferentes. Não assuma que o resultado será idêntico nos dois pontos.
- **Chatbot de terceiros:** `investidor.html` carrega o script `neurolead.min.js` da Neurologic. Mantenha o ID (`6564`) atualizado se houver troca de conta.

---

## 17. Pontos de Atenção para Modificações

1. **Duplicação de navbar/footer:** qualquer mudança nesses componentes precisa ser replicada manualmente em TODAS as páginas HTML. Considere buscar e substituir globalmente, ou usar `scripts/update_navbar_logos.py` como ponto de partida, validando visualmente depois.

2. **Duas hierarquias de assets:** no estado atual do repositório, o código ativo está apenas em `assets/`. A pasta `img_old/` ainda é referenciada em algumas páginas; prefira `assets/img/` para novos conteúdos.

3. **LESS vs CSS:** edite o `.css` compilado diretamente. Não há processo de build automático para recompilar arquivos `.less`.

4. **Google Apps Script:** se modificar `apps-script/Code.gs`, lembre-se de fazer o deploy de uma nova versão no console do Apps Script para que a URL do webhook seja atualizada.

5. **Código "morto":** arquivos como `map.js`, `calculator.js`, `biogas-scene.js`, `languages-extended.js` e a maioria dos efeitos cinematográficos **não existem ou não são carregados** pelas páginas ativas. Não crie dependências de deploy com base neles.

6. **Versionamento de assets:** ao alterar CSS/JS, incremente as query strings (`?v=X.X`) nas tags `<link>` e `<script>` das páginas HTML para evitar cache de navegadores.

7. **Sobreposição de funcionalidade:** `main.js`, `site-premium.js` e `animations.js` têm funções sobrepostas (reveal, counters, FAQ). Prefira `site-premium.js` para a navbar premium e `main.js` para internacionalização/UTMs.

8. **Duplicação de scripts:** algumas páginas carregam `forms.js` com e sem query string de versão. Verifique se há duplicidade antes de adicionar novos scripts.

9. **Páginas `noindex`:** várias páginas de stub e conteúdo (`blog.html`, `noticias.html`, `imprensa.html`, `academy.html`, `partners.html`, `saas.html`, `score.html`, `404.html`, `500.html`, artigos) possuem `<meta name="robots" content="noindex, follow">`. Ao tornar uma delas definitiva, remova a meta tag.

---

## 18. Dependências Externas (CDN)

As seguintes dependências são carregadas via CDN nas páginas:

- Font Awesome 6.5.1: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css`
- Google Fonts: `https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Inter:wght@300;600` (varia por página)
- GSAP 3.12.5 + ScrollTrigger: `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/...` (em `investidor.html` e `biometano/index.html`)
- Leaflet 1.9.4: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js` (apenas `biometano/index.html`)
- Google Analytics 4: `https://www.googletagmanager.com/gtag/js?id=G-N91NFD55MB` (13 páginas ativas)
- Neurolead chatbot: `https://cdn.neurologic.com.br/neurolead/neurolead.min.js` (apenas `investidor.html`)

---

*Última atualização: 19 de Junho de 2026 — revisado com base na exploração real do conteúdo dos arquivos do projeto.*
