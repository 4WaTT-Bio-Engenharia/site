<!-- AGENTS.md — 4WaTT Bio Engenharia S/A -->

> Arquivo de referência para agentes de codificação AI. Este projeto é um site estático multi-página para a 4WaTT, empresa de soluções em biogás/biometano. Leia este arquivo antes de fazer qualquer modificação. Última revisão: 1 de agosto de 2026.

---

## 1. Visão Geral do Projeto

Site institucional e comercial **estático**, sem sistema de build. Todas as páginas são arquivos HTML plain com CSS e JS carregados via CDN ou pasta local `/assets/`. O deploy é feito por upload direto de arquivos para hospedagem estática. A navbar premium (`<nav class="nav">`) e o seletor de idioma PT/EN são padrão nas páginas ativas.

**Idioma principal:** Português (pt-br) — todo o conteúdo, comentários e documentação interna estão em português. O site suporta múltiplos idiomas via sistema de tradução runtime (`pt`, `en`, `es`, `it`, `fr`, `de`, `no`).

**Arquivos de configuração de build não existem:** não há `package.json`, `pyproject.toml`, `Cargo.toml`, `composer.json`, `Gemfile`, `Makefile`, `tsconfig.json`, `webpack.config.js`, `vite.config.*`, `next.config.*`, `Dockerfile`, `docker-compose.yml`, `.env`, `.gitignore`, `.github/workflows/`, CI/CD, testes automatizados, linters ou formatters. As páginas são editadas manualmente e enviadas diretamente ao servidor.

---

## 2. Tecnologias e Stack

| Tecnologia | Uso / Versão real observada |
|---|---|
| HTML5 | Estrutura das páginas (sem templating engine) |
| CSS3 | Estilização pura; arquivos LESS fonte não são usados atualmente |
| JavaScript ES6+ | Interatividade em vanilla JS |
| jQuery / Bootstrap | **Não carregados pelas páginas ativas** |
| Font Awesome | `6.5.1` via CDN em praticamente todas as páginas ativas |
| Google Fonts | Montserrat, Inter, Syncopate, Roboto Mono, Bricolage Grotesque, Hanken Grotesque (varia por página) |
| GSAP + ScrollTrigger | `3.12.5` via CDN em `investidor.html` e `biometano/index.html` |
| Leaflet | `1.9.4` via CDN apenas em `biometano/index.html` |
| Google Apps Script | Backend de captura e triagem de leads para Google Sheets |
| Formspree | Fallback para envio de formulários (`xpwzdnkl`) |
| Google Analytics 4 | Measurement ID `G-N91NFD55MB`, inline no `<head>` das páginas comerciais |
| Calculadora externa | `https://calculadora-zeta-sooty.vercel.app/` (usada como CTA em várias páginas) |

### Padrões de código

- Novo código usa **vanilla ES6+** (arrow functions, const/let, async/await, template literals).
- Scripts usam **IIFE** `(function(){ ... })()` para isolamento de escopo.
- Funções nomeadas em **camelCase**: `maskPhone`, `applyTranslations`.
- Constantes em **SCREAMING_SNAKE_CASE**: `DEFAULT_ENDPOINT`, `GLOBAL_SHEETS_ENDPOINT`.
- Estado global exposto em `window.*` quando necessário: `window.translations`, `window.setLanguage`, `window.applyTranslations`, `window.__mpProjects`.
- Inicialização no evento `DOMContentLoaded`.
- Event listeners passivos para scroll quando possível: `{ passive: true }`.

---

## 3. Estrutura de Diretórios

```
├── *.html                    # 21 arquivos .html na raiz (19 ativos + 2 redirecionamentos)
├── artigos/
│   ├── index.html            # /artigos/ (listagem de artigos)
│   └── index.html.bak        # backup manual
├── assets/
│   ├── css/                  # 18 folhas de estilo ativas
│   ├── js/                   # 9 scripts JS ativos
│   ├── img/                  # imagens atuais
│   │   └── partners/         # logos de parceiros
│   ├── img_old/              # imagens antigas (ainda referenciadas em alguns lugares)
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
│   └── navbar-premium.html   # snippet de referência da navbar (não é source of truth)
├── viabilidade/
│   └── comprar-biometano.html    # calculadora de equivalência energética
├── sitemap.xml               # sitemap parcial
├── AGENTS.md                 # este arquivo
└── CLAUDE.md                 # guia rápido para Claude
```

> **Atenção:** no estado atual do repositório **não existem** as pastas legadas `/css/`, `/js/` e `/images/`, nem a pasta `assets/pages/`, nem o arquivo `_public_html.zip`. O código ativo está concentrado em `/assets/`. A pasta `assets/img_old/` ainda existe e contém imagens antigas; prefira `assets/img/` para novos conteúdos. O diretório `.claude/` existe apenas para meta-dados da sessão do agente e não faz parte do site.

### Navbar premium

Todas as páginas ativas usam a **navbar premium** (`<nav class="nav">`), controlada por:
- `assets/css/theme-4watt.css?v=3.8`
- `assets/js/site-premium.js?v=2.2`

A navbar real nas páginas inclui:
- Logo/link para home
- Links de âncora para seções da home (chaves i18n: `nav_ecossistema`, `nav_residuos`, `nav_engenharia`, `nav_jornada`)
- Dropdown **Soluções**: Engenharia de Biogás, Biometano, Gaseificação de RSU
- Link **Área do Investidor**
- Link **Imprensa**
- Link **Academy**
- Seletor de idioma **PT/EN** (`.lang-btn[data-lang]`)
- CTA primário (varia por página: calculadora externa, `#cta`, `contato.html` ou `simulador.html`)
- Barra de progresso de scroll (`.nav__progress`)

Snippet de referência: `snippets/navbar-premium.html`.

> **Cuidado:** os scripts `update_navbar_logos.py` e `inject_i18n_pages.py` são auxiliares, mas a navbar real das páginas foi editada manualmente e pode conter ajustes que os scripts não reproduzem fielmente. Sempre valide visualmente após rodá-los. O snippet `snippets/navbar-premium.html` atualmente ainda aponta o CTA para `simulador.html`, enquanto a maioria das páginas ativas usa a calculadora externa `https://calculadora-zeta-sooty.vercel.app/`.

### Animações de fundo

Para páginas com fundo plano/branco, adicionar:
```html
<div class="bg-aurora bg-aurora--light"></div>
```
Logo após a tag `<body>`. O efeito é sutil, respeita `prefers-reduced-motion` e não interfere na leitura.

---

## 4. Páginas HTML Ativas

Cada página é **autocontida** — não há sistema de templates. Navbar e footer são duplicados em cada arquivo.

### Páginas ativas na raiz (21 arquivos)

| Arquivo | Propósito | GA4 | Formulário | noindex |
|---|---|---|---|---|
| `index.html` | Homepage premium — hero com vídeo, ecossistema, prova de valor | Sim | Não | Não |
| `investidor.html` | Área do investidor — listagem de projetos, formulário de lead | Sim | Sim | Não |
| `solucao-biogas.html` | Página de detalhe do produto — Biogás | Sim | Sim | Não |
| `solucao-biometano.html` | Página de detalhe do produto — Biometano | Sim | Sim | Não |
| `solucao-gaseificacao.html` | Página de detalhe do produto — Gaseificação | Sim | Sim | Não |
| `contato.html` | Formulário de contato | Sim | Sim | Não |
| `academy.html` | Stub "Em breve" — 4WaTT Academy (`noindex`) | Sim | Sim | Sim |
| `artigo-como-funciona-biodigestor.html` | Artigo individual | Não | Não* | Não |
| `artigo-creditos-carbono.html` | Artigo individual | Não | Não* | Não |
| `artigo-regulacao-biometano.html` | Artigo individual | Não | Não* | Não |
| `blog.html` | Blog / conteúdo (`noindex`) | Sim | Não | Sim |
| `noticias.html` | Notícias e mídia (`noindex`) | Não | Não | Sim |
| `imprensa.html` | Sala de imprensa (`noindex`) | Sim | Não | Sim |
| `partners.html` | Stub — Ecossistema de Parceiros (`noindex`) | Sim | Não | Sim |
| `saas.html` | Stub — Plataforma SaaS (`noindex`) | Sim | Não | Sim |
| `score.html` | Stub — Score/Análise (`noindex`) | Sim | Não | Sim |
| `politica-privacidade.html` | Política de privacidade | Sim | Não | Sim |
| `404.html` | Página de erro 404 | Não | Não | Sim |
| `500.html` | Página de erro 500 | Não | Não | Sim |
| `artigos.html` | **Redirecionamento** para `/artigos/` | Não | Não | Não |
| `biometano.html` | **Redirecionamento** para `/biometano/` | Não | Não | Não |

\* Os artigos carregam `forms.js` (às vezes duplicado), mas não possuem formulário `form-4watt` ativo.

### Páginas ativas em subpastas (3 arquivos)

- `artigos/index.html` — listagem de artigos (sem `noindex`)
- `biometano/index.html` — página dedicada ao biometano (usa Leaflet, não Mapbox; sem `noindex`)
- `viabilidade/comprar-biometano.html` — calculadora de equivalência energética com script inline (sem `noindex`)

**Total: 24 arquivos HTML ativos** (incluindo 2 redirecionamentos; 22 páginas de conteúdo).

> **Nota sobre `simulador.html`:** o arquivo `simulador.html` **não existe** mais no repositório. Várias páginas ainda referenciam `simulador.html` no CTA da navbar (`404.html`, `500.html`, `artigos/index.html`, `biometano/index.html`, `viabilidade/comprar-biometano.html` e o snippet `snippets/navbar-premium.html`), o que gera links quebrados. A homepage e várias páginas já migraram o CTA para a calculadora externa `https://calculadora-zeta-sooty.vercel.app/`. Ao revisar CTAs, padronize para a calculadora externa ou recrie `simulador.html` se for necessário.

---

## 5. JavaScript — Organização e Arquivos Principais

### `assets/js/` (código moderno — prioridade)

| Arquivo | Linhas | Responsabilidade real | Status |
|---|---:|---|---|
| `languages.js` | 2.796 | Dicionário completo de traduções para **pt/en/es/it/fr/de/no** (`window.translations`) | **Ativo — core** |
| `languages-pages.js` | 247 | Complemento de traduções para artigos, stubs e páginas de erro (apenas chaves `pt`) | **Ativo — core** |
| `languages-core.js` | 249 | Subconjunto mínimo de chaves i18n | **Não carregado** |
| `main.js` | 643 | Preloader, slider de hero, FAQ accordion, controle de volume de vídeo, mobile menu legado, reveal animations, contadores, WhatsApp bot, tracking, preservação de UTMs, internacionalização (`applyTranslations`, `setLanguage`) | **Ativo — core** |
| `site-premium.js` | 245 | **Navbar premium** (scroll, progresso, menu mobile, dropdown Soluções, seletor PT/EN), reveal, counters, parallax, FAQ, funil, âncoras suaves | **Ativo — core** |
| `forms.js` | 350 | Validação de formulários, máscara de telefone BR, captura de UTMs para `sessionStorage`, envio via fetch (Formspree + Google Sheets), classificação de leads investidor, modal de interesse | **Ativo — condicional** |
| `animations.js` | 132 | IntersectionObserver nativo para scroll reveal e contadores | **Ativo — biometano/artigos** |
| `cases-modal-home.js` | 105 | Modal dos cases da home | **Ativo — index.html** |
| `animations-3d.js` | 559 | Animações cinemáticas com GSAP + ScrollTrigger | **Ativo — investidor.html** |

### Scripts por página (padrão atual)

Todas as páginas ativas carregam `languages.js`, `languages-pages.js`, `main.js` e `site-premium.js`:

```html
<script src="assets/js/languages.js?v=1.9"></script>
<script src="/assets/js/languages-pages.js?v=1.1"></script>
<script src="assets/js/main.js?v=1.4"></script>
<script src="assets/js/site-premium.js?v=2.2"></script>
```

Páginas em subpastas usam paths absolutos ou relativos (`/assets/js/...` ou `../assets/js/...`). `investidor.html` também carrega:
```html
<script src="assets/js/animations-3d.js"></script>
```

Páginas com formulário adicionam:
```html
<script src="assets/js/forms.js?v=1.3"></script>
```

> **Atenção:** algumas páginas de artigo carregam `forms.js` duas vezes (uma com `?v=1.3` e outra sem versão), mesmo sem possuírem formulário. Isso é código morto que pode ser removido, mas não afeta o funcionamento. `investidor.html` e `biometano/index.html` carregam `forms.js` sem query string de versão. `main.js` referencia `languages-extended.js` para os idiomas ES/IT/FR/DE/NO, mas esse arquivo **não existe**; como todas as traduções já estão dentro de `languages.js`, os idiomas adicionais funcionam sem ele (embora a requisição retorne 404 no console).

---

## 6. CSS — Organização e Arquivos Principais

### `assets/css/` (folhas modernas)

| Arquivo | Linhas | Responsabilidade | Status |
|---|---:|---|---|
| `theme-4watt.css` | 440 | **Tema oficial compartilhado**: paleta (`--roxo`, `--teal`, `--gold`), fundo aurora, tipografia editorial, classes utilitárias `.t4`, botões, grades, responsividade base | **Ativo — core** |
| `style.css` | 3.576 | Folha principal moderna: animações reveal, hero utils, layouts de seções, cards, FAQ, grids, componentes diversos | **Ativo — major** |
| `custom_v2.css` | 1.437 | Overrides finais e correções específicas (load order importa — carregar por último) | **Ativo — overrides** |
| `components.css` | 1.843 | Componentes reutilizáveis: botões, cards, badges, formulários, modais | **Ativo — componentes** |
| `design-system.css` | 465 | Tokens de estilo: cores, tipografia, espaçamentos, variáveis semânticas | **Ativo — tokens** |
| `footer.css` | 378 | Estilos do footer cinematic (`#footer`) | **Ativo — footer** |
| `mobile-fixes.css` | 660 | Correções responsivas globais carregadas por último | **Ativo — responsive** |
| `legacy-bridge.css` | 98 | Ponte de compatibilidade entre tema novo e classes legadas | **Ativo — bridge** |
| `home-premium.css` | 228 | Estilos específicos da home premium (`index.html`) | **Ativo — index.html** |
| `solucoes.css` | 140 | Estilos das páginas de solução (`solucao-biogas.html`, etc.) | **Ativo — soluções** |
| `investidor-skin.css` | 965 | Estilos da área do investidor | **Ativo — arquivo existe, mas `investidor.html` usa CSS inline em vez deste arquivo** |
| `cinematic-home.css` | 1.149 | Estilos de experiências cinematográficas | **Ativo — investidor.html** |
| `contato.css` | 32 | Estilos específicos de `contato.html` | **Ativo — específicos** |
| `viabilidade-skin.css` | 39 | Estilos específicos de `viabilidade/comprar-biometano.html` | **Ativo — específicos** |
| `page-common.css` | 21 | Estilos base carregados por `biometano/index.html` | **Ativo — biometano** |
| `design-system-3d.css` | 1.695 | Tokens 3D/escuro carregados por `biometano/index.html` | **Ativo — biometano** |
| `p7-block.css` | 1.564 | Blocos específicos de artigos e investidor | **Ativo — condicional** |

### Paleta de marca (`:root` em `theme-4watt.css`)

- `--roxo: #3A0940`
- `--roxo-soft: #6e2466`
- `--plum: #2A0720`
- `--teal: #03A589`
- `--gold: #DBAA0F`

### Padrões de CSS

- **Classes BEM-like**: `.hero__video`, `.glass-card`, `.nav-dropdown-wrapper`, `.form-field`, `.btn--primary`.
- **Mobile-first** com breakpoints principais em `992px`.
- **Easing padrão premium**: `cubic-bezier(0.22, 1, 0.36, 1)` e `cubic-bezier(0.65, 0, 0.35, 1)` em `theme-4watt.css`.
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
- Classifica leads no frontend via `classifyInvestorLead(data)` (apenas para formulário `form-investidor`)
- Seleciona formulários com classe `form-4watt`
- Dispara evento `gtag('event', 'form_submit', ...)` no GA4
- Modal de interesse: `#modal-interesse` ativado por `[data-open-modal="interesse"]`
- Envia todo formulário `form-4watt` tanto para o Formspree quanto para o `GLOBAL_SHEETS_ENDPOINT` (quando diferente)

### Campos UTM

Todos os formulários capturam e propagam parâmetros UTM:
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- Armazenados em `sessionStorage` para persistência entre páginas
- `main.js` faz segunda preservação em `localStorage` sob a chave `4watt_utms`
- Incluídos no payload de envio junto com `_page_url`, `_page_title`, `_timestamp`

### Formulários ativos por página

Apenas **8 formulários ativos** em **7 páginas** contêm formulários `form-4watt`:

| Página | Form ID | `data-form-name` | Campos principais |
|---|---|---|---|
| `contato.html` | `contactForm` | Contato | nome, email, whatsapp, motivo, mensagem |
| `investidor.html` | `form-investidor` | Área do Investidor | nome, empresa, email, whatsapp, volume_interesse, mensagem, projeto_interesse |
| `investidor.html` | `mp-nda-form` | NDA - Marketplace | nome, empresa, email, whatsapp, cargo, projeto |
| `solucao-biogas.html` | `form-engenharia-biogas` | Engenharia de Biogás | nome, empresa, email, whatsapp, substrato, etapa |
| `solucao-biometano.html` | `form-biometano` | Produção de Biometano | nome, empresa, email, whatsapp, biogas_volume, situacao, mensagem |
| `solucao-gaseificacao.html` | `form-gaseificacao-rsu` | Gaseificação de RSU | nome, email, whatsapp, municipio |
| `biometano/index.html` | `form-biometano-comprador` | — | nome, empresa, email, whatsapp, volume_desejado, prazo_contrato, formato_entrega, localizacao_entrega, mensagem |
| `academy.html` | `academyForm` | Academy | nome, empresa, email, whatsapp, interesse, mensagem |

> **Atenção:** como `forms.js` envia todo formulário `form-4watt` tanto para o Formspree quanto para o `GLOBAL_SHEETS_ENDPOINT`, leads de contato/comercial/academy/biometano-comprador também chegam à planilha "Leads Investidor". Avalie se essa união é intencional antes de alterar a lógica. O formulário `academy.html` coleta dados de interesse, mas a página ainda é um stub `noindex`.

---

## 9. Internacionalização (i18n)

Suporte a múltiplos idiomas via tradução runtime.

### Arquivos

- `assets/js/languages.js` — dicionário completo para **pt/en/es/it/fr/de/no** (2.796 linhas)
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
- **Stream ID:** `3217095081` (em `investidor.html` e `blog.html` via `window.__GA4_FLOW`)

**Páginas COM GA4:** `index.html`, `investidor.html`, `contato.html`, `solucao-biogas.html`, `solucao-biometano.html`, `solucao-gaseificacao.html`, `blog.html`, `imprensa.html`, `academy.html`, `partners.html`, `saas.html`, `score.html`, `politica-privacidade.html`. **Total: 13 páginas ativas.**

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
- `scripts/update_navbar_logos.py` — substitui a navbar premium (`<nav class="nav">`) nas páginas da raiz e subpastas, normaliza paths dos logos e incrementa query strings de CSS. Use com cautela: a navbar real pode conter ajustes manuais não refletidos no script.

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
5. Verifique o console do navegador por erros de JS (atenção especial ao 404 de `languages-extended.js` se testar ES/IT/FR/DE/NO).
6. Teste envios de formulário com cuidado para não poluir a planilha de produção.
7. Verifique links quebrados, especialmente CTAs que ainda apontam para `simulador.html`.

---

## 14. Deploy

Deploy é feito por **upload direto de arquivos** para hospedagem estática. Não há processo automatizado.

> No momento, **não existe** `_public_html.zip` na raiz. Se a equipe usar esse pacote para deploy, será necessário compactar a pasta raiz manualmente quando for gerar o pacote.

### Checklist pré-deploy

- [ ] Verificar se o endpoint do Google Apps Script em `forms.js` está atualizado
- [ ] Verificar se o endpoint `window.__INVESTOR_AUTOMATION_ENDPOINT` em `investidor.html` está atualizado
- [ ] Atualizar `sitemap.xml` se novas páginas foram adicionadas (o arquivo atual ainda referencia `simulador.html`, que não existe)
- [ ] Incrementar query strings de versionamento em CSS/JS (`?v=X.X`) para cache-busting
- [ ] Evitar enviar arquivos `.bak` para produção
- [ ] Verificar se CTAs quebrados para `simulador.html` foram corrigidos ou se a página foi recriada
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
- **Dupla submissão de formulários:** Todo `form-4watt` dispara POST para Formspree e para o Google Apps Script do investidor. Isso significa que leads de contato/comercial/academy/biometano-comprador também alimentam a planilha "Leads Investidor". Avalie se essa união é intencional antes de alterar a lógica.
- **Scoring duplicado:** A classificação `APTO`/`TRIAGEM`/`NAO_APTO` ocorre tanto no frontend (`forms.js`) quanto no backend (`Code.gs`), com regras ligeiramente diferentes. Não assuma que o resultado será idêntico nos dois pontos.
- **Chatbot de terceiros:** `investidor.html` **não carrega mais** o script `neurolead.min.js` da Neurologic. O ponto de integração anterior foi removido; se for reativar, verifique a conta/ID atual.

---

## 17. Pontos de Atenção para Modificações

1. **Duplicação de navbar/footer:** qualquer mudança nesses componentes precisa ser replicada manualmente em TODAS as páginas HTML. Considere buscar e substituir globalmente, ou usar `scripts/update_navbar_logos.py` como ponto de partida, validando visualmente depois.

2. **Duas hierarquias de assets:** no estado atual do repositório o código ativo está apenas em `assets/`. A pasta `img_old/` ainda é referenciada em algumas páginas; prefira `assets/img/` para novos conteúdos.

3. **LESS vs CSS:** edite o `.css` compilado diretamente. Não há processo de build automático para recompilar arquivos `.less`.

4. **Google Apps Script:** se modificar `apps-script/Code.gs`, lembre-se de fazer o deploy de uma nova versão no console do Apps Script para que a URL do webhook seja atualizada.

5. **Código "morto":** arquivos como `map.js`, `calculator.js`, `biogas-scene.js`, `languages-extended.js` e a maioria dos efeitos cinematográficos **não existem ou não são carregados** pelas páginas ativas. Não crie dependências de deploy com base neles.

6. **Versionamento de assets:** ao alterar CSS/JS, incremente as query strings (`?v=X.X`) nas tags `<link>` e `<script>` das páginas HTML para evitar cache de navegadores.

7. **Sobreposição de funcionalidade:** `main.js`, `site-premium.js` e `animations.js` têm funções sobrepostas (reveal, counters, FAQ). Prefira `site-premium.js` para a navbar premium e `main.js` para internacionalização/UTMs.

8. **Duplicação de scripts:** algumas páginas carregam `forms.js` com e sem query string de versão. Verifique se há duplicidade antes de adicionar novos scripts.

9. **Páginas `noindex`:** as páginas `blog.html`, `noticias.html`, `imprensa.html`, `academy.html`, `partners.html`, `saas.html`, `score.html`, `politica-privacidade.html`, `404.html` e `500.html` possuem `<meta name="robots" content="noindex, follow">`. As páginas de artigos individuais e as subpáginas (`artigos/index.html`, `biometano/index.html`, `viabilidade/comprar-biometano.html`) **não** possuem `noindex`. Ao tornar uma página definitiva, remova a meta tag.

10. **CTAs para `simulador.html`:** a página `simulador.html` não existe mais no repositório. Várias páginas ainda apontam para ela no CTA da navbar, o que gera links quebrados. A homepage e várias páginas já migraram para a calculadora externa `https://calculadora-zeta-sooty.vercel.app/`. Ao revisar CTAs, padronize para a calculadora externa ou recrie `simulador.html`.

---

## 18. Dependências Externas (CDN)

As seguintes dependências são carregadas via CDN nas páginas:

- Font Awesome 6.5.1: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css`
- Google Fonts: `https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Inter:wght@300;600` (varia por página)
- GSAP 3.12.5 + ScrollTrigger: `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/...` (em `investidor.html` e `biometano/index.html`)
- Leaflet 1.9.4: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js` (apenas `biometano/index.html`)
- Google Analytics 4: `https://www.googletagmanager.com/gtag/js?id=G-N91NFD55MB` (13 páginas ativas)
- Calculadora externa: `https://calculadora-zeta-sooty.vercel.app/` (CTA em várias páginas)

---

## 19. Estado Atual Observado e Inconsistências Conhecidas

- `simulador.html` foi removido, mas ainda é referenciado em `snippets/navbar-premium.html` e nos CTAs de `404.html`, `500.html`, `artigos/index.html`, `biometano/index.html` e `viabilidade/comprar-biometano.html`.
- `snippets/navbar-premium.html` não reflete o estado atual da navbar: o CTA do snippet aponta para `simulador.html`, enquanto a maioria das páginas usa a calculadora externa.
- Algumas páginas de artigos carregam `forms.js` duas vezes sem necessidade.
- `languages-core.js` existe em `assets/js/` mas não é carregado por nenhuma página ativa.
- `languages-pages.js` é carregado por todas as páginas ativas, mas contém apenas chaves `pt`.
- `investidor.html` carrega `investidor-skin.css`? **Não** — o arquivo existe, mas a página usa CSS inline no próprio HTML; o arquivo `investidor-skin.css` está em desuso.
- `main.js` referencia `languages-extended.js` para os idiomas ES/IT/FR/DE/NO, mas esse arquivo não existe; as traduções já estão em `languages.js`, então funciona, mas gera um 404 no console.
- `sitemap.xml` ainda referencia `https://4watt.tech/simulador.html`, que não existe.
- `politica-privacidade.html` possui GA4 e `noindex`; não é um stub comercial.

---

*Última atualização: 1 de agosto de 2026 — revisado com base na exploração real do conteúdo dos arquivos do projeto.*
