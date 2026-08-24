# SPEC de página — `engenharia/index.html` (hub)

Referências: `MASTER_SPEC.md` (DEC-002, DEC-003, DEC-004, GATE 1, GATE 3). Nenhum
arquivo de código foi criado ainda — este documento é o spec para revisão antes da
implementação.

## Stack desta página (decidida no GATE 1 / DEC-003)

- `theme-4watt.css` (tokens de marca) + uma folha nova **`engenharia.css`** (seguindo o
  padrão de `solucoes.css`/`investidor.css` — uma folha por família de página) +
  `mobile-fixes.css` por último.
- JS: `languages.js` → `main.js` (i18n/UTM) → `site-premium.js` (navbar, reveal, orbs,
  marquee). Nenhum framework novo — nada de React/Tailwind/shadcn/TypeScript, que
  contradiria o DEC-003 e a stack real do projeto (ver `CLAUDE.md`/`AGENTS.md`).
- Navbar/footer: os parciais compartilhados de `snippets/navbar-premium.html`, com um
  novo item de primeiro nível ("Serviços de Engenharia" / slug `engenharia`) — ainda não
  adicionado ao snippet, fica para quando a implementação desta página começar.
- Reveal/animação: reaproveitar `data-reveal data-d="N"` (já existente em
  `site-premium.js`/`animations.js`) — **não** criar novo sistema de `@keyframes`.
- Ícones: Font Awesome (`<i class="fas ...">`), já carregado sitewide — não usar
  `lucide-react` (é de um ecossistema React que este projeto não usa).

## Estrutura da página (6 blocos, DEC-004)

1. **Hero** — detalhado abaixo.
2. **Grid de verticais confirmadas (8)** — detalhado abaixo.
3. Prova técnica cruzada (cases existentes) — spec a seguir.
4. **Modelos de contratação (Owner's Engineering / EPCM / EPC-Turnkey)** — detalhado abaixo.
5. **Bloco de integração institucional (Teste 8)** — detalhado abaixo.
6. CTA final / formulário — spec a seguir.

## Boundary check antes do Bloco 2

A home já tem, dentro de "Ecossistema" (`#ecossistema`), uma linha chamada
**"Consultoria Técnica"** (tag "Diagnóstico") fazendo EVTE/business plan/projetos
executivos, link para `investidor.html` — quase o mesmo escopo da Vertical 6 abaixo.
**Decisão do usuário (2026-08-22): manter as duas completamente separadas, sem link
entre elas.** Por isso o card da Vertical 6 no grid abaixo usa copy própria, distinta da
linha existente, e não referencia nem linka para `investidor.html`. Ver Boundary Mapping
atualizado em `MASTER_SPEC.md`.

---

## Bloco 1 — Hero (spec detalhado)

> **REVISÃO TOTAL (2026-08-23):** feedback do usuário — hero sem imagem/vídeo, escala
> "pequena, totalmente diferente das outras páginas". A tabela de adaptação abaixo
> (contra o componente React) descreve a **primeira versão**, hoje substituída. A
> versão atual **abandona o componente `.eng-hero` próprio inteiramente** e reusa, sem
> alterações, a estrutura real do hero da home:
> - `<header class="hero-h is-loading" data-hero>` + `.hero-h__media` com
>   `<video autoplay muted loop>` — fonte `assets/4watt-servicos-engenharia.mp4`
>   (fornecido pelo usuário), fade-in automático via `initHero()` já existente em
>   `site-premium.js` (função `[data-hero]`, nenhum JS novo).
> - `.hero-h` vem de **`home-premium.css`** (já compartilhada por `index.html` e
>   `investidor.html`, per `CLAUDE.md` — engenharia/index.html passou a carregá-la
>   também).
> - Título em `<h1 class="h-reveal"><span class="line"><span>...</span></span>...</h1>`
>   — mesmo efeito de reveal linha-a-linha da home, via `.h-reveal` (já tratado pelo
>   `initReveal()` genérico, que já observa `.h-reveal` além de `[data-reveal]`).
> - Escala real confirmada por inspeção: `min-height:100svh` (mesma da home), `h1`
>   renderizando a ~66.5px em viewport 1280px (clamp até 72px) — antes a versão custom
>   ia só até ~62px.
> - A "faixa de fatos" (8 disciplinas / 3 modelos / engenharia própria) que antes era
>   `.eng-hero__stats` num componente à parte agora é `.hero-h__meta` — a mesma classe
>   que a home usa pra "Goiânia · GO / EPC·O&M·Consultoria / Projeta·constrói·opera".
> - **CSS `.eng-hero*` inteiro removido** de `engenharia.css` — zero componente de hero
>   próprio agora, 100% reaproveitado.
>
> A tabela abaixo permanece como registro histórico da primeira decisão de adaptação
> (React → vanilla), que ainda vale conceitualmente (sem framework novo, sem paleta
> nova, sem prova social falsa) — só a implementação de baixo nível mudou.

### Escala da página inteira — correção adicional (2026-08-23)

Além do hero, os Blocos 2/4/5/6 tinham `padding` fixo em pixel (`96px`, `72px`, `88px`
etc.) sobrescrevendo o ritmo real do site, que é `clamp(72px, 9vw, 132px)` (regra base
`.section` em `theme-4watt.css`, responsiva por viewport). Removidos todos os overrides
— as seções agora herdam o clamp padrão (confirmado por inspeção: 115.2px de
padding-top/bottom em viewport 1280px, igual em `.eng-verticais`, `.eng-models` e
`.eng-integration`). Esse era provavelmente o motivo principal da sensação de "página
pequena, diferente das outras" além do hero em si.

### Adaptação do conceito enviado pelo usuário (histórico da v1)

| Elemento do componente React de referência | Adaptação para 4WaTT (vanilla HTML/CSS) |
|---|---|
| Header/nav próprio do componente | **Removido** — a página usa a navbar compartilhada do site (`nav.nav`), não um header customizado. |
| Fundo: foto de estoque (nave espacial) | **Removido** — reaproveita o motif de `orb`/aurora já usado na home (`.orb.orb--teal`, `.bg-aurora`), sem imagem externa nova. |
| Fonte serif (Instrument Serif) para o título | **Trocado por `var(--display)` (Montserrat)** — é a fonte de display já definida em `theme-4watt.css`; manter serif quebraria a identidade tipográfica do site. |
| Paleta neutra escura (`#09090b` etc.) do componente | **Trocada pelos tokens de marca** — `--plum`/`--roxo` como base escura, `--teal` como glow/accent, `--gold` só em detalhe pontual. |
| Badge "New · First Commercial Flight to Mars 2026" | Badge em pílula de vidro (mesmo padrão visual do `.lang-selector` do navbar: `bg-white/5`, `ring`, `backdrop-blur`) anunciando a nova unidade. |
| Faixa de logos de parceiros/agências | **Removida — substituída por uma faixa de fatos reais** (8 disciplinas, 3 modelos de contratação), porque a nova unidade ainda não tem cliente confirmado fora do escopo de biogás (correção de evidência do GATE 3) — logos inventados seriam prova social falsa. |
| `@keyframes fadeSlideIn` + `useState` para menu mobile | **Removidos** — reaproveita `data-reveal`/`data-d` já cabeado em `site-premium.js`, e o toggle de menu mobile já existe em `nav__toggle` no navbar compartilhado. |
| CTA duplo (primário/secundário) | **Mantido** — é o padrão que a home já usa (`.btn.btn--primary` / `.btn.btn--ghost`), só troca o destino. |

### Copy (PT — todas as strings via `data-i18n`, nunca hardcoded)

> **Lembrete do gotcha #1 do site:** nenhum texto abaixo pode ficar só no HTML — cada
> `data-i18n="chave"` precisa da chave correspondente em `assets/js/languages.js`, nos
> blocos `pt` **e** `en`, antes de a página ir ao ar.

| Chave i18n proposta | PT | EN (rascunho) |
|---|---|---|
| `eng_hero_kicker` | Nova unidade 4WaTT | New 4WaTT unit |
| `eng_hero_badge` | Serviços de Engenharia | Engineering Services |
| `eng_hero_line1` | Engenharia robusta. | Robust engineering. |
| `eng_hero_line2` | Decisões com segurança técnica. | Decisions backed by technical safety. |
| `eng_hero_sub` | Da engenharia civil à automação com inteligência artificial: a mesma competência técnica que sustenta os projetos de biogás e biometano da 4WaTT, agora disponível para qualquer desafio de engenharia da sua operação. | From civil engineering to AI-driven automation: the same technical capability behind 4WaTT's biogas and biomethane projects, now available for any engineering challenge in your operation. |
| `eng_hero_cta_primary` | Falar com um especialista | Talk to a specialist |
| `eng_hero_cta_secondary` | Explorar as 8 frentes de engenharia | Explore the 8 engineering fronts |
| `eng_hero_stat1` | 8 disciplinas de engenharia | 8 engineering disciplines |
| `eng_hero_stat2` | 3 modelos de contratação — Owner's Engineering, EPCM, EPC/Turn-Key | 3 delivery models — Owner's Engineering, EPCM, EPC/Turn-Key |
| `eng_hero_stat3` | Engenharia própria 4WaTT | In-house 4WaTT engineering |

Statement de posicionamento (GATE 3, corrigido) inspira o `eng_hero_sub` acima —
mantém o foco em robustez técnica, não em "atender qualquer setor" como argumento
principal (isso é consequência, não headline).

CTA primário aponta para **`contato.html`** (pilha limpa, per GATE 1) — **não** para o
simulador de biogás (`https://calculadora-zeta-sooty.vercel.app/`), porque é outro funil
(Boundary Mapping, GATE 0). CTA secundário é âncora `#verticais` dentro da própria
página, apontando para o Bloco 2.

### Markup (rascunho — pendente de validação, ainda não criado no repo)

```html
<!-- engenharia/index.html — dentro de <body>, após a navbar compartilhada -->
<div class="bg-aurora bg-aurora--dark"></div> <!-- variante escura a criar em engenharia.css -->

<header class="eng-hero">
  <div class="orb orb--teal" data-parallax="0.14" style="width:480px;height:480px;top:-100px;right:-80px;"></div>
  <div class="orb orb--gold" data-parallax="0.08" style="width:320px;height:320px;bottom:-60px;left:-60px;"></div>

  <div class="eng-hero__inner container">
    <div class="eng-hero__badge" data-reveal data-d="0">
      <span class="eng-hero__badge-pill" data-i18n="eng_hero_kicker">Nova unidade 4WaTT</span>
      <span data-i18n="eng_hero_badge">Serviços de Engenharia</span>
    </div>

    <h1 class="eng-hero__title" data-reveal data-d="1">
      <span data-i18n="eng_hero_line1">Engenharia robusta.</span><br>
      <span data-i18n="eng_hero_line2">Decisões com segurança técnica.</span>
    </h1>

    <p class="eng-hero__sub" data-reveal data-d="2" data-i18n="eng_hero_sub">
      Da engenharia civil à automação com inteligência artificial: a mesma competência
      técnica que sustenta os projetos de biogás e biometano da 4WaTT, agora disponível
      para qualquer desafio de engenharia da sua operação.
    </p>

    <div class="eng-hero__cta" data-reveal data-d="3">
      <a class="btn btn--primary" href="../contato.html?assunto=engenharia" data-i18n="eng_hero_cta_primary">
        Falar com um especialista <i class="fas fa-arrow-right"></i>
      </a>
      <a class="btn btn--ghost" href="#verticais" data-i18n="eng_hero_cta_secondary">
        Explorar as 8 frentes de engenharia <i class="fas fa-arrow-down"></i>
      </a>
    </div>

    <ul class="eng-hero__stats" data-reveal data-d="4">
      <li data-i18n="eng_hero_stat1">8 disciplinas de engenharia</li>
      <li data-i18n="eng_hero_stat2">3 modelos de contratação — Owner's Engineering, EPCM, EPC/Turn-Key</li>
      <li data-i18n="eng_hero_stat3">Engenharia própria 4WaTT</li>
    </ul>
  </div>
</header>
```

### CSS novo necessário (a criar em `assets/css/engenharia.css`, ainda não implementado)

- `.bg-aurora--dark` — variante escura do utilitário de aurora já existente (hoje só há
  `--light`), base `--plum`/`--roxo` em vez do off-white.
- `.eng-hero` — seção full-bleed escura, `overflow:hidden; position:relative;` (mesmo
  padrão de `.hero-h` da home).
- `.eng-hero__badge-pill` — pílula de vidro (`background: rgba(255,255,255,.08); border-radius: var(--radius-full); backdrop-filter: blur(...)`), reaproveitando o mesmo visual do `.lang-selector` do navbar em vez de inventar um componente novo.
- `.eng-hero__title` — `font-family: var(--display); font-weight: 800; font-size: clamp(2.25rem, 5vw, 4.5rem);` sobre fundo escuro (`color: #fff` ou `var(--surface)`).
- `.eng-hero__stats` — lista horizontal simples (flex, `gap: var(--space-6)`, texto pequeno, separadores sutis) — **não** é um carrossel `data-marquee` porque são só 3 itens fixos, não uma galeria a rolar.

### Responsivo
- Mobile: badge, título, sub e stats empilham em coluna única; CTA duplo vira coluna
  (mesmo padrão de `.hero-h__cta` da home em telas estreitas — conferir
  `mobile-fixes.css`).
- Orbs (`.orb`) devem reduzir de tamanho ou esconder abaixo de 768px, como já acontece
  na home, para não estourar o viewport.

### Pendências antes de implementar este bloco
- Adicionar as 10 chaves i18n (tabela acima) em `languages.js` (pt + en) — **não
  implementar a página sem isso**, ou o texto quebra ao trocar idioma.
- Criar `assets/css/engenharia.css` com as classes listadas acima.
- Adicionar o item de navbar "Serviços de Engenharia" em `snippets/navbar-premium.html`
  e replicar manualmente em todas as páginas (gotcha #1 do `CLAUDE.md` raiz — duplicação
  manual de navbar).
- Confirmar com o usuário o parâmetro `?assunto=engenharia` no link para `contato.html`
  (depende de como o formulário de contato for adaptado no Bloco 6 — ainda não
  especificado).

---

## Bloco 2 — Grid de verticais confirmadas (spec detalhado, revisado em 2026-08-23)

Âncora `id="verticais"` (destino do CTA secundário do hero).

> **Revisão pós-preview (2026-08-23):** o usuário viu o protótipo em
> `engenharia/index.html` e apontou dois problemas: (1) **bug real** — texto escuro
> ilegível sobre fundo roxo, causado por um `<div class="bg-aurora--dark">` fixo cobrindo
> a página inteira (mesmo padrão do `.bg-aurora` do tema, mas vazando por baixo de
> seções pensadas pra fundo claro); corrigido movendo o glow para dentro do próprio
> `.eng-hero`, escopado. (2) **Pedido de efeito de scroll** para este bloco, com
> referência a um componente React (`ContainerScroll`, framer-motion) que inclina/escala
> um card em 3D conforme o usuário rola a página — adaptado para vanilla JS/CSS abaixo,
> sem instalar framework nenhum (mesma razão do Bloco 1: contradiria DEC-003).
> Posicionamento pedido pelo usuário: *"nossa engenharia em energia é igual Ferrari para
> automobilismo: segurança técnica e desejo de engenharia"* — efeito técnico com luxo na
> transição.

> **Revisão 2 (2026-08-23), depois de screenshot do usuário:** o painel renderizava
> pequeno — `max-width:1200px` numa seção full-bleed, sobrando muita área em branco dos
> dois lados em telas largas; cards pequenos por consequência. Pedido: painel maior,
> sombra lateral pra reforçar profundidade 3D, acabamento "liquid glass". Mudanças:
> - **Tamanho:** `max-width` subiu de 1200px para **1720px** (`width:calc(100% - 8px)`)
>   — painel agora ocupa quase toda a largura da viewport, coerente com o resto do site
>   ser full-bleed.
> - **Vidro de verdade:** fundo passou de gradiente opaco pra
>   **semitransparente + `backdrop-filter: blur(28px) saturate(165%)`** — pra isso ter
>   efeito, precisa de algo colorido atrás pra borrar: adicionei **dois `.orb`**
>   (componente que o resto do site já usa — `orb--teal`/`orb--gold`, blur próprio,
>   `pointer-events:none`) como fundo da seção, atrás do painel. Sem isso o
>   `backdrop-filter` só borraria o branco da página, sem graça.
> - **Brilho especular:** `::after` novo, radial-gradient branco/teal sutil com
>   `mix-blend-mode: overlay` no topo do painel — o reflexo de luz característico do
>   "Liquid Glass".
> - **Sombra lateral 3D:** `box-shadow` ganhou duas sombras coloridas laterais (teal de
>   um lado, gold do outro) além da sombra inferior — reforça a leitura de "placa de
>   vidro flutuando", não só "elevada pra cima".
> - **Cards:** também ganharam leve `backdrop-filter: blur(6px)` e fundo mais claro
>   (`.07` em vez de `.045` de opacidade) pra participarem do mesmo acabamento de vidro;
>   nome/descrição um pouco maiores (18px/14px).
> - Verificado por inspeção: painel em 1170px de largura numa viewport de 1280px (era
>   ~1160px numa área de container de 1280px antes — a diferença real aparece em telas
>   maiores, onde antes ficava travado em 1200px com muita sobra).

> **Revisão 3 (2026-08-23):** usuário pediu para remover o "liquid glass" e deixar o
> painel roxo sólido. Removidos: `backdrop-filter` do painel e dos cards, o brilho
> especular (`::after`), e os dois `.orb` de fundo (só existiam para alimentar o blur
> de vidro — sem `backdrop-filter` eles não faziam mais nada). **Mantido:** o tamanho
> maior (`max-width:1720px`) e a sombra lateral colorida 3D (teal/gold) — não foram
> pedidos para sair. Fundo do painel voltou a ser opaco:
> `linear-gradient(180deg, var(--roxo), var(--plum))`.

### Componente escolhido e por quê

O site já tem dois padrões de "lista de ofertas" reaproveitáveis:
- **`.eco-row`** (`home-premium.css`, seção Ecossistema) — linha numerada horizontal
  com logo/nome/tag/benefício/seta. Pensado para poucos itens (5) com sublogo vetorial
  própria — as 8 verticais não têm sublogo, então forçar esse componente exigiria criar
  8 vetores novos antes de especificar conteúdo.
- **`.feed` + `.matrix-m`** (seção Matriz de Resíduos) — grid de cards com foto,
  nome, descrição, métrica. Também depende de foto real por card — não há fotografia
  para "Engenharia Elétrica" ou "Automação e Instrumentação" como conceitos abstratos, e
  usar banco de imagens genérico seria inconsistente com o padrão do resto do site (só
  fotos reais de projeto/planta).

**Decisão de spec:** novo componente **`.eng-vert-card`**, mais leve que os dois acima —
ícone (Font Awesome, já carregado sitewide) num círculo com accent de cor, nome, uma
frase de descrição, link "Saiba mais". Grid responsivo (`repeat(auto-fit, minmax(...))`),
não masonry. Reaproveita `data-reveal` como os outros blocos.

### Catálogo de cards (8), com ícone e copy proposta

| # | Vertical | Ícone (Font Awesome) | Arquivo destino | Descrição proposta (PT) |
|---|---|---|---|---|
| 1 | Engenharia Civil e Infraestrutura | `fa-drafting-compass` | `engenharia/civil.html` | Projetos civis e de infraestrutura com a segurança estrutural que operações complexas exigem. |
| 2 | Engenharia Elétrica | `fa-bolt` | `engenharia/eletrica.html` | Projetos elétricos de média e alta complexidade, do dimensionamento à supervisão de instalação. |
| 3 | Engenharia Mecânica | `fa-gears` | `engenharia/mecanica.html` | Engenharia mecânica aplicada a equipamentos e processos industriais. |
| 4 | Engenharia Ambiental | `fa-leaf` | `engenharia/ambiental.html` | Estudos e projetos ambientais que sustentam a viabilidade técnica e regulatória do empreendimento. |
| 5 | Gestão de Projetos e Obras | `fa-diagram-project` | `engenharia/gestao-projetos-obras.html` | Gerenciamento e fiscalização de obras nos modelos Owner's Engineering, EPCM ou EPC/Turn-Key. |
| 6 | Engenharia de Processos / Consultoria Técnica e EVTE | `fa-chart-line` | `engenharia/processos.html` | Consultoria técnica e estudos de viabilidade para operações fora do escopo de biogás e biometano. |
| 7 | Engenharia Digital, Dados e IA | `fa-microchip` | `engenharia/digital.html` | Skills personalizadas, MCP, RAG e automação de processos com inteligência artificial aplicada à operação. |
| 8 | Automação e Instrumentação | `fa-satellite-dish` | `engenharia/automacao.html` | IoT, sistemas SCADA e IA aplicada à tomada de decisão em ambiente industrial. |

**Nota sobre o card 6:** copy escrita deliberadamente distinta da linha "Consultoria
Técnica" já existente na home (ver Boundary check acima) — enfatiza "fora do escopo de
biogás/biometano" para não soar como a mesma oferta com outro nome.

**Nota sobre os cards 7/8:** mantém a fronteira proposta no fechamento do Discovery
(vertical 7 = camada horizontal/skills/MCP/RAG genérico; vertical 8 = camada
operacional IoT/SCADA) — ainda pendente de validação final quando as páginas
individuais dessas duas verticais forem especificadas.

### Chaves i18n propostas (16 — nome + descrição × 8 verticais, mais kicker/título da seção)

| Chave | PT |
|---|---|
| `eng_grid_kicker` | As 8 frentes |
| `eng_grid_title` | Uma capacidade técnica, oito frentes de atuação |
| `eng_vert_civil_name` / `_desc` | Engenharia Civil e Infraestrutura / (texto da tabela acima) |
| `eng_vert_eletrica_name` / `_desc` | Engenharia Elétrica / ... |
| `eng_vert_mecanica_name` / `_desc` | Engenharia Mecânica / ... |
| `eng_vert_ambiental_name` / `_desc` | Engenharia Ambiental / ... |
| `eng_vert_gpo_name` / `_desc` | Gestão de Projetos e Obras / ... |
| `eng_vert_processos_name` / `_desc` | Engenharia de Processos / ... |
| `eng_vert_digital_name` / `_desc` | Engenharia Digital, Dados e IA / ... |
| `eng_vert_automacao_name` / `_desc` | Automação e Instrumentação / ... |

(Traduções EN ficam para quando o conteúdo for congelado — mesmo padrão do Bloco 1: PT
e EN sempre entram juntos em `languages.js`, nunca um sem o outro.)

### Markup (rascunho)

```html
<section class="section eng-verticais" id="verticais">
  <div class="container">
    <div class="eng-verticais__head">
      <span class="kicker" data-reveal data-i18n="eng_grid_kicker">As 8 frentes</span>
      <h2 class="h2" data-reveal data-d="1" data-i18n="eng_grid_title">
        Uma capacidade técnica, oito frentes de atuação
      </h2>
    </div>

    <div class="eng-vert-grid">
      <a class="eng-vert-card" href="civil.html" data-reveal>
        <span class="eng-vert-card__icon"><i class="fas fa-drafting-compass"></i></span>
        <span class="eng-vert-card__name" data-i18n="eng_vert_civil_name">Engenharia Civil e Infraestrutura</span>
        <span class="eng-vert-card__desc" data-i18n="eng_vert_civil_desc">Projetos civis e de infraestrutura com a segurança estrutural que operações complexas exigem.</span>
        <span class="eng-vert-card__more">Saiba mais <i class="fas fa-arrow-right"></i></span>
      </a>
      <!-- repetir para as outras 7 verticais, mesma estrutura -->
    </div>
  </div>
</section>
```

### CSS novo necessário (`assets/css/engenharia.css`)
- `.eng-verticais__head` — mesmo padrão de cabeçalho de seção já usado em `.matrix__head`/`.eco__top` (kicker + h2, opcionalmente lead ao lado).
- `.eng-vert-grid` — `display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:var(--space-6);` (usar tokens de `design-system.css`, já que `theme-4watt.css` não define escala de space).
- `.eng-vert-card` — cartão com `background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:var(--space-6);` e hover com `box-shadow:var(--shadow)` (tokens de `theme-4watt.css`).
- `.eng-vert-card__icon` — círculo `48px`, `background:rgba(3,165,137,.1)` (tint do `--teal`), ícone na cor `--teal-ink`.

### Responsivo
- Desktop: 4 colunas. Tablet: 2. Mobile: 1 coluna, cards full-width.

### Palco de scroll ("instrument panel") — adição de 2026-08-23

Todo o Bloco 2 (cabeçalho + grid) passa a viver dentro de um painel escuro que se
"endireita" (rotateX 3D + scale) conforme o usuário rola até ele, em vez de aparecer
plano. Implementado e já rodando no protótipo em `engenharia/index.html`.

**Por que não usei o componente React de referência do usuário (`ContainerScroll`,
framer-motion):** mesma razão do Bloco 1 — instalar React/Tailwind/shadcn/framer-motion
contradiria o DEC-003 (stack estática, sem build) e criaria uma segunda stack de
frontend só para esta página. Também não usei a imagem do demo (é um placeholder de
outro produto, sem relação com a 4WaTT).

**O que foi adaptado, e por quê:**
- **Motor de scroll:** em vez do `useScroll`/`useTransform` do framer-motion, reaproveita
  **exatamente o mesmo padrão** já usado por `[data-parallax]` em `site-premium.js`
  (rAF + `scroll`/`resize` listeners, respeita `prefers-reduced-motion`) — nova função
  isolada em `assets/js/engenharia.js` (script exclusivo desta família de página, mesmo
  padrão de `forms.js`/`cases-modal-home.js`), não duplicado dentro de `site-premium.js`.
- **O "card" que se move não é uma imagem** (o demo tinha uma foto de produto) — é o
  próprio cabeçalho + grid de verticais, dentro de um painel emoldurado. Isso resolve a
  reclamação de "sem imagens" sem inventar fotografia de banco de imagens: o painel
  técnico *é* o elemento visual, não um substituto de foto.
- **Linguagem visual "Ferrari" (segurança técnica + luxo), sem inventar nova paleta:**
  bezel em `var(--roxo)`→`var(--plum)` (gradiente, já existente na marca), borda fina em
  `var(--gold)` a 32% de opacidade (acabamento "premium" sem virar dourado brega), grade
  de blueprint no fundo do painel (`background-image` de linhas finas, `mask-image`
  radial pra sumir nas bordas) — remete a desenho técnico/engenharia sem ser um clichê
  visual de "circuito" genérico. Dentro do palco, o ícone e o link "Saiba mais" dos
  cards trocam de teal para `var(--gold)` — sinaliza que é o momento de destaque
  "premium" da página, distinto do resto (que usa teal como accent padrão).
- **Suavidade da transição:** a atualização é feita a cada frame de scroll (como o
  parallax), mas o `.eng-scroll-stage__frame` tem
  `transition: transform .12s cubic-bezier(.16,.84,.44,1)` — cada leitura de scroll
  anima suavemente até o novo valor em vez de saltar, o que dá a sensação de "atraso
  elegante" em vez de movimento mecânico 1:1 com o mouse/scroll.
- **Mobile:** acima de 720px o tilt desliga (`transform:none !important`), mesmo
  critério de desempenho que `[data-parallax]` já usa (desliga abaixo de 760px de
  largura) — em telas pequenas isso costuma ficar mais estranho que bonito, e o custo de
  repaint por frame não compensa.

**CSS novo** (classes completas em `assets/css/engenharia.css`):
`.eng-scroll-stage` (contêiner com `perspective`), `.eng-scroll-stage__frame` (o painel
que rotaciona/escala via `--stage-rot`/`--stage-scale`/`--stage-y`), variantes de texto
claro escopadas (`.eng-scroll-stage .kicker/.h2/.eng-vert-card*`) — nunca globais, para
não repetir o bug do aurora.

**JS novo:** `assets/js/engenharia.js` — função `initScrollStage()`, mapeia a posição do
palco na viewport para um progresso 0→1 e escreve `--stage-rot`/`--stage-scale`/
`--stage-y` como custom properties.

### Correção de bug — texto ilegível (2026-08-23)

A primeira versão do protótipo tinha um `<div class="bg-aurora--dark">` com
`position:fixed; inset:0; z-index:-1` cobrindo a página inteira com fundo roxo — comportamento
copiado do `.bg-aurora` original do tema (`theme-4watt.css:357`), que é feito pra cobrir
uma página inteira de fundo claro. Como o Bloco 2 e o Bloco 4 são seções de fundo claro
por padrão, o texto (cor escura por padrão) ficava sobre esse roxo vazado = ilegível.
**Corrigido:** removida a div global; o glow do hero agora é parte do `background` do
próprio `.eng-hero`, escopado só àquela seção. Bloco 2 resolve a necessidade de "fundo
escuro" de outro jeito (o painel `.eng-scroll-stage__frame`, escopado por natureza,
nunca vaza pra fora de si mesmo).

### Cards com foto (revisão de 2026-08-23 — substituiu os ícones)

**Feedback do usuário sobre o protótipo:** aprovou a comunicação "Ferrari" do palco de
scroll, mas pediu foto real em vez de ícone nos 8 cards. Perguntei de onde viriam as
imagens (não há fotografia real de "Engenharia Elétrica" ou "Automação e
Instrumentação" como conceitos genéricos no repositório — só fotos de projetos de
biogás, e reaproveitá-las nos cards da nova unidade contradiria a fronteira "fora do
escopo de biogás" já decidida para a vertical 6). **Resposta do usuário:** vai fornecer
fotos próprias por vertical, e também quer reaproveitar fotos de projetos já existentes
onde fizer sentido.

**Estrutura criada (2026-08-23):** pasta por vertical em
`assets/img/engenharia/{slug}/`, uma para cada uma das 8 (`civil/`, `eletrica/`,
`mecanica/`, `ambiental/`, `gestao-projetos-obras/`, `processos/`, `digital/`,
`automacao/`) — slugs iguais aos nomes de arquivo já definidos no catálogo da Fase 1 do
SPEC (`MASTER_SPEC.md`). **Convenção de nome de arquivo: `cover.jpg` dentro de cada
pasta** — é o que o `<img src="assets/img/engenharia/{slug}/cover.jpg">` de cada card já
espera. Assim que o usuário salvar o arquivo com esse nome exato na pasta certa, a foto
aparece automaticamente — nenhuma mudança de código necessária.

**Fallback enquanto a foto não existe:** `onerror` no `<img>` remove a tag e adiciona a
classe `eng-vert-card__img--empty` no contêiner, que mostra um ícone de imagem sutil
sobre um gradiente — nunca o ícone de imagem quebrada do navegador. Isso é só visual de
transição; não é a entrega final.

### Entrega de assets (2026-08-23) — fotos e vídeos reais

O usuário salvou fotos reais em 6 das 8 pastas (cada pasta recebeu uma galeria inteira —
`civil/` sozinha tem mais de 20 arquivos). Como o Bloco 2 só precisa de **uma** foto de
capa por vertical (a galeria completa é assunto da página interna de cada vertical,
spec futuro), copiei um arquivo representativo de cada pasta para `cover.{ext}` (mantendo
o arquivo original intacto para uso posterior):

| Vertical | Arquivo de capa escolhido | Extensão real |
|---|---|---|
| Civil | `eng-civil-galeria-1.png` → `cover.png` | render 3D de fachada, já na paleta roxo/plum da marca |
| Elétrica | `projeto-eletrico-quadro-energia.jpg` → `cover.jpg` | diagrama unifilar com timbre "4WaTT" |
| Mecânica | `projeto-mecanico-Secador-biogas-1.png` → `cover.png` | render 3D de equipamento com logo 4WaTT aplicado |
| Ambiental | `pgrs-residuos-horizontal.jpeg` → `cover.jpeg` | foto real de campo (aterro/PGRS) |
| Gestão de Projetos e Obras | `gestao-projetos-cronograma-gantt.png` → `cover.png` | screenshot de cronograma real (Gantt) |
| Automação | `quadro-automacao-depois-1.jpeg` → `cover.jpeg` | foto de quadro de automação em campo |
| Processos | — (pasta vazia) | segue no fallback até o usuário enviar |
| Digital | — (pasta vazia) | segue no fallback até o usuário enviar |

**Nota sobre nomenclatura dos arquivos originais:** alguns nomes têm espaço/maiúscula
(ex. `projeto-eletrico-1MW Solar.jpg`) — funciona (o navegador aceita, só precisa
codificar `%20` se referenciado direto), mas foge da convenção kebab-case do projeto
(`CLAUDE.md`). Não renomeei o acervo inteiro agora (são ~50 arquivos, e a galeria
completa é escopo do spec de cada página interna, ainda não feito) — só copiei o
escolhido como `cover.*`, que já nasce com nome seguro.

### Vídeo (2026-08-23) — modal próprio, não reaproveita `.cases-modal`

O usuário forneceu 3 vídeos do YouTube: **Engenharia Elétrica** (`fyDKUkN7Pi8`),
**Engenharia Mecânica** (`aiSHlmFX-Dc`), e um terceiro rotulado "Equipamentos Especiais |
Skid biogás com geração de energia" (`CRoETXYdh_8`) que não corresponde diretamente a
nenhuma das 8 verticais — **fica pendente de decisão do usuário sobre onde entra**
(não implementado ainda).

**Componente:** o site já tem um modal de case (`.cases-modal`, `cases-modal-home.js`),
mas esse CSS mora em `cinematic-home.css` — folha legada que o GATE 1 já mandou evitar
nas páginas novas. Construí um modal próprio e mais simples, **só para vídeo**:
- Cada card com vídeo ganha um botão de play (`<span class="eng-vert-card__play"
  role="button" data-video-id="...">`) sobre a foto de capa.
- **Por que `<span role="button">` e não `<button>`:** o card inteiro já é um `<a
  href="...">` — aninhar outro elemento nativamente interativo (`<button>`, `<a>`)
  dentro de um `<a>` é HTML inválido. Um `<span>` com `role="button"` + `tabindex="0"` é
  a forma correta e acessível de fazer isso.
- Um único modal global (`#engVideoModal`, no fim do `<body>`) recebe um `<iframe>`
  do YouTube (`youtube-nocookie.com`, sem cookies de tracking) **criado dinamicamente
  no clique** e **removido ao fechar** — isso é o que garante que o vídeo para de tocar
  quando o modal fecha (só tirar o `display` não pausaria o YouTube).
- Clique no botão de play faz `preventDefault()` + `stopPropagation()` — testado e
  confirmado que o clique não navega para a página da vertical (fica em
  `engenharia/index.html`).

**Verticais com vídeo hoje:** Elétrica e Mecânica. As outras 6 ficam só com foto até o
usuário produzir mais vídeos (o sistema já está pronto para receber — só adicionar o
`<span class="eng-vert-card__play" data-video-id="ID_DO_VIDEO">` dentro do
`.eng-vert-card__img` de qualquer card).

### 3º vídeo — resolvido (2026-08-23)
Usuário decidiu: **"Skid biogás com geração de energia" (`CRoETXYdh_8`) entra no card de
Engenharia Mecânica, como 2º vídeo** (junto com `aiSHlmFX-Dc`). Card de Mecânica agora
tem `.eng-vert-card__play-group` — dois botões de play lado a lado (44px em vez de
52px, para caberem os dois), cada um com `title`/`aria-label` próprio identificando o
vídeo. Implementado e testado — os dois `data-video-id` disparam o modal certo.

### Pendências novas
- Vídeos de Civil, Ambiental, Gestão de Projetos e Obras, Processos, Digital e
  Automação ainda não existem — cards seguem só com foto até lá.
- Fotos de Processos e Digital ainda pendentes (pastas vazias).

**Layout do card, revisado:** foto no topo (proporção 4:3, `object-fit:cover`, leve zoom
no hover), corpo do card (nome/descrição/link) abaixo — ícone Font Awesome removido do
card (CSS antigo `.eng-vert-card__icon` foi substituído por `.eng-vert-card__img`).

### Pendências antes de implementar este bloco
- Confirmar a fronteira final de conteúdo entre verticais 7 e 8 (nota acima) antes de
  escrever as páginas internas de cada uma.
- Adicionar as 18 chaves i18n (kicker+título+8×nome+8×descrição) em `languages.js`
  PT+EN.
- **Aguardando o usuário salvar `cover.jpg` em cada uma das 8 pastas**
  `assets/img/engenharia/{slug}/` — sem isso os cards mostram só o placeholder.
- Se o usuário decidir reaproveitar fotos de projetos já existentes
  (`assets/img_old/...`) para alguma vertical específica, copiar/renomear para dentro da
  pasta certa como `cover.jpg` em vez de linkar direto do caminho antigo (mantém a
  convenção única e evita link cruzado entre pastas de página diferentes).
- **Validar com o usuário** se o efeito de scroll e a linguagem visual "instrument
  panel" comunicam bem "engenharia segura + luxo" quando combinado com fotos reais (só
  foi validado com placeholder/ícone até aqui).

---

## Bloco 3 — Prova técnica cruzada (spec detalhado)

> **Bug corrigido (2026-08-23): carrossel parado.** O usuário relatou que o marquee de
> "Execução comprovada" não se movia, e pediu uma forma de ele se atualizar sozinho
> quando mais cases forem adicionados. Diagnóstico: `initDraggableMarquee`
> (`site-premium.js`) espera a esteira **já vir duplicada 2x** no HTML (comentário no
> próprio código: "conteúdo já duplicado 2x pra o loop") — a home tem isso porque
> alguém duplicou manualmente. Minha versão só tinha os 3 cards reais, sem duplicata:
> `scrollWidth` (1232px) mal passava do `clientWidth` (1137px) — só 95px de sobra. O
> `tick()` empurra `scrollLeft` a 0,55px/frame, mas o navegador trava o `scrollLeft`
> nesse máximo de ~95px (não existe mais conteúdo pra rolar) — a esteira anda um
> pouquinho, quase imperceptível, e trava, porque nunca alcança o ponto de
> `half = scrollWidth/2` que dispararia o salto de volta pro início.
>
> **Correção, resolvendo os dois pedidos de uma vez:** função nova
> `initAutoDuplicateMarquees()` em `assets/js/engenharia.js`, que lê só os cards reais
> (sem `aria-hidden`) direto do HTML e **monta a duplicação sozinha, em runtime** —
> repete o conjunto o quanto for preciso pra 1 "volta" cobrir pelo menos 1 largura de
> tela, clona essa volta inteira mais uma vez (`aria-hidden="true"`) pra fechar o loop.
> **Isso já é a resposta pra "atualizar automaticamente quando adicionarmos mais
> cases"**: de agora em diante, adicionar um case novo é só inserir mais um
> `<article class="case-card">` real na esteira no HTML — o script recalcula sozinho,
> sem precisar lembrar de duplicar nada à mão.
>
> **Detalhe técnico de ordem de execução:** essa função roda **fora** de qualquer
> listener de `DOMContentLoaded`, direto no topo do script — porque `site-premium.js`
> já registra seu próprio `DOMContentLoaded` (que mede a esteira) antes de
> `engenharia.js` sequer carregar; se eu esperasse o mesmo evento, chegaria tarde demais
> (o motor já teria medido a esteira sem duplicação). Rodando imediatamente — scripts no
> fim do `<body>` executam durante o parse, sempre antes do `DOMContentLoaded` disparar
> — a esteira já está pronta quando o motor for medir.
>
> **Verificado:** de 3 para 6 cards (3 reais + 3 `aria-hidden`), `scrollWidth` de 1232px
> para 2480px. Simulei manualmente 3000 "frames" da mesma matemática do `tick()` — o
> `scrollLeft` avançou de 0 a 520px com o wraparound correto, confirmando que a lógica
> de loop funciona. Não consegui confirmar visualmente a animação rodando nesta sessão
> porque a aba do Browser fica em segundo plano aqui (`document.hidden: true`
> — `requestAnimationFrame` não dispara em aba oculta, é uma limitação deste ambiente de
> automação, não do site) — vale uma conferida visual no navegador de verdade.

### Componente escolhido

Reaproveita **exatamente** `.case-card` + o motor `.cases-marquee[data-marquee]` já em
produção na home (`initDraggableMarquee`/`initMarquees()` em `site-premium.js`) — não
criar componente novo. É o mesmo padrão validado no GATE 1 e confirmado pelo usuário no
GATE 2 ("pode usar, mas tenho mais cases para adicionar depois").

**Como isso resolve a ressalva do usuário:** o marquee já suporta qualquer número de
cases (é uma trilha horizontal arrastável, não um grid de contagem fixa — o próprio
`index.html` já tem um card `aria-hidden="true"` duplicado no fim só para o loop visual
ficar contínuo). Adicionar um case novo no futuro é só inserir mais um `<article
class="case-card">` na trilha — nenhuma mudança estrutural necessária.

### Gotcha de caminho relativo

Esta página vive em `/engenharia/index.html` (1 nível de subpasta, DEC-003). Os cases
hoje estão linkados a partir da raiz (`case-ceasa-goias.html`, `assets/img_old/...`).
Copiando o mesmo card para dentro de `engenharia/`, todo link/imagem que aponta para a
raiz precisa do prefixo `../` (`../case-ceasa-goias.html`, `../assets/img_old/...`) —
mesmo cuidado que `biometano/index.html` já exige hoje.

### Elemento novo: tags de engenharia envolvida (revisado após validação)

**Correção importante em relação ao rascunho anterior:** cada case não envolve uma única
vertical — envolve várias. Validado com o usuário em 2026-08-23, de forma objetiva
(pergunta fechada por case):

| Case | Verticais confirmadas |
|---|---|
| CEASA Goiás | Engenharia Mecânica · Engenharia Ambiental · Gestão de Projetos e Obras |
| Frigorífico Franca | Engenharia Mecânica · Engenharia Ambiental · Gestão de Projetos e Obras |
| Organo Buritis | **Todas as 8 verticais** — o usuário confirmou que esse projeto "atende a todas as verticais, pois utilizamos todos os serviços da 4WaTT para atender o desenvolvimento tanto de engenharia quanto de negócio" |

Isso substitui a tabela de inferência anterior (que tinha sugerido Civil para CEASA e
Elétrica para Franca, com base só na copy de marketing) — a atribuição acima veio
diretamente do usuário, não é mais inferência.

**Implicação de design:** o elemento não pode ser um link único — precisa virar uma
**lista de 2–3 chips** (CEASA, Franca) dentro de `.case-card__body`, entre
`.case-card__stat` e `.case-card__more`. Cada chip é um link para a página da vertical
correspondente, com `onclick="event.stopPropagation()"` (mesmo motivo do
`.case-card__cta` existente, já que o card inteiro é clicável).

**Caso especial — Organo Buritis (todas as 8):** listar 8 chips dentro de um card de
360px de altura ficaria ilegível. Proposta de spec: um único chip resumo, "Todas as
frentes de engenharia envolvidas", sem link para uma vertical específica — leva para a
âncora `#verticais` (Bloco 2) em vez de uma página individual. **Esta simplificação é
uma decisão minha de layout, não validada ainda — sinalizar para confirmação.**

### Markup (diff conceitual sobre o card já existente)

```html
<!-- CEASA Goiás — 3 chips -->
<article class="case-card" tabindex="0" role="button" data-case-title="CEASA Goiás" ...>
  <div class="ph"><img src="../assets/img_old/case-ceasa.png" alt="CEASA Goiás"></div>
  <div class="case-card__body">
    <div class="case-card__loc" data-i18n="home_case1_loc">Goiânia · GO</div>
    <div class="case-card__title" data-i18n="home_case1_title">CEASA Goiás</div>
    <div class="case-card__stat" data-i18n="home_case1_stat">1.200 Nm³/dia de biogás dimensionados · RSU orgânico</div>
    <!-- NOVO: -->
    <div class="case-card__eng-tags">
      <a class="case-card__eng-tag" href="mecanica.html" onclick="event.stopPropagation();" data-i18n="eng_case1_tag1">Mecânica</a>
      <a class="case-card__eng-tag" href="ambiental.html" onclick="event.stopPropagation();" data-i18n="eng_case1_tag2">Ambiental</a>
      <a class="case-card__eng-tag" href="gestao-projetos-obras.html" onclick="event.stopPropagation();" data-i18n="eng_case1_tag3">Gestão de Projetos</a>
    </div>
    <span class="case-card__more" data-i18n="home_case1_more">Ver case <i class="fas fa-arrow-right"></i></span>
  </div>
</article>

<!-- Organo Buritis — chip resumo -->
<article class="case-card" tabindex="0" role="button" data-case-title="Organo Buritis" ...>
  ...
  <div class="case-card__eng-tags">
    <a class="case-card__eng-tag case-card__eng-tag--all" href="#verticais" onclick="event.stopPropagation();" data-i18n="eng_case3_tag_all">
      <i class="fas fa-diagram-project"></i> Todas as frentes de engenharia envolvidas
    </a>
  </div>
  ...
</article>
```

### CSS novo necessário (`assets/css/engenharia.css`)
- `.case-card__eng-tags` — `display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;`.
- `.case-card__eng-tag` — pílula pequena, `font-size: 11px`, `color: var(--gold)` ou
  `#fff` com opacidade reduzida (para não competir visualmente com `.case-card__more`,
  que já usa o teal `#5fe9cf` como cor de destaque do card), `padding: 2px 8px; border:1px solid rgba(255,255,255,.25); border-radius:var(--radius-full);`.
- `.case-card__eng-tag--all` — variante com leve destaque (ex. borda `--gold`) para
  sinalizar que é um resumo "todas as frentes", não uma vertical específica.

### Chaves i18n propostas (7 — atualizado para o formato multi-chip)
- `eng_case1_tag1` (Mecânica), `eng_case1_tag2` (Ambiental), `eng_case1_tag3` (Gestão de
  Projetos) — CEASA Goiás.
- `eng_case2_tag1` (Mecânica), `eng_case2_tag2` (Ambiental), `eng_case2_tag3` (Gestão de
  Projetos) — Frigorífico Franca (mesmas 3 verticais que CEASA, confirmado pelo
  usuário).
- `eng_case3_tag_all` ("Todas as frentes de engenharia envolvidas") — Organo Buritis.

### Pendências antes de implementar este bloco
- ~~Validar atribuição de vertical por case~~ — **resolvido em 2026-08-23** (tabela
  acima, validação objetiva por pergunta fechada, direto com o usuário).
- ~~Confirmar o chip-resumo do Organo Buritis~~ — **confirmado em 2026-08-23** ("Todas
  as frentes", linkando para `#verticais` em vez de 8 chips individuais).
- Ajustar todos os caminhos relativos (`../`) ao copiar o markup da home para dentro de
  `engenharia/index.html`.
- Decidir se o card `aria-hidden="true"` duplicado (para o loop do marquee) também
  precisa dos chips novos, ou se pode ficar sem (é invisível para leitores de tela e só
  existe para o efeito visual de loop contínuo).
- Quando o usuário adicionar os novos cases mencionados no GATE 1, cada um vai precisar
  do mesmo padrão de chips — manter esse padrão documentado para quem for adicionar.

---

## Bloco 4 — Modelos de contratação (spec detalhado)

Evidência-base: GATE 2, vertical Gestão de Projetos e Obras — os três modelos
confirmados como praticados/pretendidos (Owner's Engineering, EPCM, EPC/Turn-Key).

### Componente escolhido e por quê

O site já tem `.sol-step`/`.sol-steps` (usado em `solucao-biogas.html` para a
metodologia em 6 etapas) — mas é uma **trilha sequencial** (01→02→03..., com tempo de
execução por etapa). Os 3 modelos de contratação não são sequenciais entre si — são
**alternativas paralelas** que o cliente escolhe conforme o nível de responsabilidade
que quer transferir para a 4WaTT. Reaproveitar a trilha sequencial sugeriria
incorretamente uma ordem/progressão entre os modelos.

**Decisão de spec:** novo componente **`.eng-model-card`**, reaproveitando a mesma
anatomia interna do `.sol-step__body` (ícone, título, descrição, checklist `<ul><li>`)
para consistência visual com o resto do site, mas em **grid de 3 colunas lado a lado**,
não uma trilha conectada.

### Conteúdo dos 3 modelos

| Modelo | Ícone | Descrição | Checklist |
|---|---|---|---|
| Owner's Engineering / Fiscalização | `fa-user-shield` | Você mantém o controle do projeto; a 4WaTT representa seu interesse técnico, fiscalizando entregas e protegendo o investimento. | Fiscalização técnica independente · Controle de qualidade das entregas · Representação do dono do projeto perante fornecedores |
| EPCM (Engineering, Procurement and Construction Management) | `fa-diagram-project` | A 4WaTT coordena engenharia, suprimentos e construção sem executar a obra diretamente — um gerenciamento técnico dedicado ao seu projeto. | Gerenciamento integrado de engenharia e suprimentos · Coordenação de fornecedores e contratados · Cronograma e orçamento sob controle técnico |
| EPC / Turn-Key | `fa-key` | A 4WaTT assume a entrega completa — projeto, suprimentos e execução — com um único ponto de responsabilidade até a operação. | Responsabilidade única, ponta a ponta · Entrega pronta para operar · Prazo e escopo fechados em contrato |

### Markup (rascunho)

```html
<section class="section eng-models">
  <div class="container">
    <div class="eng-models__head">
      <span class="kicker" data-reveal data-i18n="eng_models_kicker">Modelos de contratação</span>
      <h2 class="h2" data-reveal data-d="1" data-i18n="eng_models_title">
        O nível de responsabilidade que faz sentido para o seu projeto
      </h2>
      <p class="lead" data-reveal data-d="2" data-i18n="eng_models_lead">
        Da fiscalização técnica à entrega completa — você escolhe quanto do projeto a 4WaTT assume.
      </p>
    </div>

    <div class="eng-model-grid">
      <article class="eng-model-card" data-reveal>
        <div class="eng-model-card__icon"><i class="fa-solid fa-user-shield"></i></div>
        <h3 data-i18n="eng_model1_name">Owner's Engineering / Fiscalização</h3>
        <p data-i18n="eng_model1_desc">Você mantém o controle do projeto; a 4WaTT representa seu interesse técnico, fiscalizando entregas e protegendo o investimento.</p>
        <ul>
          <li data-i18n="eng_model1_item1">Fiscalização técnica independente</li>
          <li data-i18n="eng_model1_item2">Controle de qualidade das entregas</li>
          <li data-i18n="eng_model1_item3">Representação do dono do projeto perante fornecedores</li>
        </ul>
      </article>
      <!-- repetir para EPCM e EPC/Turn-Key, mesma estrutura -->
    </div>
  </div>
</section>
```

### CSS novo necessário (`assets/css/engenharia.css`)
- `.eng-models__head` — mesmo padrão de cabeçalho já usado nos outros blocos (kicker + h2 + lead).
- `.eng-model-grid` — `display:grid; grid-template-columns:repeat(3,1fr); gap:var(--space-6);` (colapsa para 1 coluna em mobile).
- `.eng-model-card` — reaproveita visual de `.sol-step__body` (fundo `var(--surface)`, borda `var(--border)`, padding `var(--space-6)`), sem a numeração/tempo que só faz sentido em trilha sequencial.
- `.eng-model-card__icon` — mesmo tratamento do `.sol-step__num` (círculo com ícone), sem o `<span class="step-n">` (não há número de ordem aqui).

### Chaves i18n propostas (18)
`eng_models_kicker`, `eng_models_title`, `eng_models_lead` + por modelo (×3):
`eng_modelN_name`, `eng_modelN_desc`, `eng_modelN_item1/2/3`.

### Responsivo
- Desktop: 3 colunas lado a lado. Tablet: pode colapsar para 2+1. Mobile: 1 coluna
  empilhada (mesmo padrão dos outros grids já especificados).

### Pendências antes de implementar este bloco
- Adicionar as 18 chaves i18n em `languages.js` PT+EN.
- Confirmar se a ordem de apresentação (Owner's Engineering → EPCM → EPC/Turn-Key,
  do menos para o mais abrangente) é a que o usuário prefere, ou se deve seguir outra
  lógica comercial.
- Ícones (`fa-user-shield`, `fa-diagram-project`, `fa-key`) são rascunho — validar se
  comunicam bem cada modelo antes de implementar.

---

## Bloco 5 — Integração institucional / Teste 8 (spec detalhado)

Evidência-base: Teste 8 (seção 19 da regra estratégica) e Boundary Mapping (`MASTER_SPEC.md`,
GATE 0). Esse teste exige que, depois de qualquer implementação, o visitante entenda ao
mesmo tempo que (1) o portfólio atual continua ativo, (2) a nova unidade existe, (3) as
duas podem se complementar, e (4) nenhuma parece substituir a outra. Este bloco é onde
essa garantia fica **explícita na própria página**, não implícita.

### Por que este bloco existe (e por que não é redundante com o navbar)

O navbar já vai ter um item "Serviços de Engenharia" ao lado de "Soluções" (Boundary
Mapping) — isso já resolve a navegação. Mas navegação não é a mesma coisa que
**comunicação**: um visitante que caiu direto nesta página (link externo, busca, redes
sociais) pode nunca ter visto o navbar de perto ou não saber que "Soluções" existe. O
Bloco 5 existe para essa pessoa — garante que mesmo sem tocar no menu, ela sai desta
página sabendo que o portfólio de biogás/biometano/resíduos continua ativo.

### Conteúdo

Texto de reforço (não é copy final):

> **Kicker:** Parte do ecossistema 4WaTT
> **Título:** Uma nova frente. O mesmo ecossistema.
> **Corpo:** Serviços de Engenharia é uma nova Unidade de Negócio da 4WaTT — não
> substitui, reorganiza ou reduz o que a empresa já entrega em biogás, biometano,
> gaseificação e gestão de resíduos. As duas frentes convivem e podem se complementar
> dentro do mesmo projeto.

Copy escrita para bater os 4 critérios do Teste 8 direto: "não substitui/reorganiza/
reduz" cobre (4); "as duas frentes convivem" cobre (1) e (3); o próprio bloco existir
numa página de Serviços de Engenharia cobre (2).

Abaixo do texto, uma **linha de links de volta para o portfólio atual** — mesma lista do
dropdown "Soluções" do navbar (não inventar uma 5ª opção nem reagrupar):

| Link | Destino |
|---|---|
| Gestão de Resíduos | `../solucao-gestao-residuos.html` |
| Engenharia de Biogás | `../solucao-biogas.html` |
| Biometano | `../solucao-biometano.html` |
| Gaseificação de RSU | `../solucao-gaseificacao.html` |

**Por que só esses 4, e não também "Área do Investidor":** o Boundary Mapping já
classificou a Área do Investidor como **independente** (capta projetos/ROI de biogás,
não vende serviço de engenharia) — misturá-la aqui sugeriria uma relação que não existe.
Mantém a mesma taxonomia de 4 itens que o dropdown "Soluções" já usa, sem reinventar.

### Componente escolhido

Peso visual deliberadamente **menor** que os Blocos 1-4 (que são a vitrine principal da
nova unidade) — isso é reforço institucional, não outro destaque. Fundo claro padrão
(sem painel escuro), texto centralizado, links em formato de pílula simples (mesmo
padrão visual de `.case-card__eng-tag` do Bloco 3, adaptado para fundo claro).

### Markup (rascunho)

```html
<section class="section eng-integration">
  <div class="container">
    <div class="eng-integration__inner">
      <span class="kicker" data-reveal>Parte do ecossistema 4WaTT</span>
      <h2 class="h2" data-reveal data-d="1">Uma nova frente. O mesmo ecossistema.</h2>
      <p class="lead" data-reveal data-d="2">
        Serviços de Engenharia é uma nova Unidade de Negócio da 4WaTT — não substitui,
        reorganiza ou reduz o que a empresa já entrega em biogás, biometano, gaseificação
        e gestão de resíduos. As duas frentes convivem e podem se complementar dentro do
        mesmo projeto.
      </p>
      <div class="eng-integration__links" data-reveal data-d="3">
        <a class="eng-integration__link" href="../solucao-gestao-residuos.html">Gestão de Resíduos <i class="fas fa-arrow-right"></i></a>
        <a class="eng-integration__link" href="../solucao-biogas.html">Engenharia de Biogás <i class="fas fa-arrow-right"></i></a>
        <a class="eng-integration__link" href="../solucao-biometano.html">Biometano <i class="fas fa-arrow-right"></i></a>
        <a class="eng-integration__link" href="../solucao-gaseificacao.html">Gaseificação de RSU <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>
  </div>
</section>
```

### CSS novo necessário (`assets/css/engenharia.css`)
- `.eng-integration` — `padding: 80px 0;` fundo padrão (herda `body`, sem cor própria).
- `.eng-integration__inner` — `max-width: 680px; margin:0 auto; text-align:center;`.
- `.eng-integration__links` — `display:flex; flex-wrap:wrap; justify-content:center; gap:10px; margin-top:28px;`.
- `.eng-integration__link` — pílula com `border:1px solid var(--border); border-radius:var(--radius-full); padding:8px 16px; font-size:13px; color:var(--ink);`, hover com `border-color:var(--teal); color:var(--teal-ink);`.

### Chaves i18n propostas (7)
`eng_integ_kicker`, `eng_integ_title`, `eng_integ_body` + 4 labels de link
(`eng_integ_link_residuos`, `eng_integ_link_biogas`, `eng_integ_link_biometano`,
`eng_integ_link_gaseificacao` — podem reaproveitar o texto já existente das chaves
`nav_gestao_residuos`/`nav_biogas`/`nav_biom`/`nav_gaseificacao` de `languages.js` em vez
de criar chaves novas, para não ter duas fontes de verdade pro mesmo nome de solução).

### Responsivo
- Links quebram linha naturalmente (`flex-wrap`) — sem grid, sem breakpoint dedicado.

### Pendências antes de implementar este bloco
- Adicionar as chaves i18n (ou confirmar reaproveitamento das chaves `nav_*` já
  existentes, evitando duplicação).
- Confirmar copy final do parágrafo de reforço com o usuário.
- Ajustar caminhos `../` ao implementar (mesmo gotcha do Bloco 3).

---

## Bloco 6 — CTA final / formulário (spec detalhado)

Decisão-base já registrada no GATE 1: **não reaproveitar o formulário/scoring de
`investidor.html`** (é calibrado para `volume_interesse` de biogás). Este bloco tem
formulário próprio.

### Componente escolhido — reaproveita a infraestrutura de formulário, não a UI do investidor

`contato.html` já tem exatamente a peça que falta: `form.form-4watt` +
`assets/js/forms.js`. Analisando `forms.js`:
- Qualquer `<form class="form-4watt">` na página é capturado automaticamente
  (`document.querySelectorAll('form.form-4watt')`) — dual-submit para Formspree **e**
  para o endpoint global do Apps Script, sem precisar registrar nada novo em JS.
- UTM (`utm_source/medium/campaign/term/content`) é capturado e anexado
  **automaticamente** via `URLSearchParams`/`sessionStorage` — não precisa de campo
  hidden no HTML.
- Máscara de telefone ativa em qualquer `input[type="tel"]` — não precisa de atributo
  especial.
- `data-form-name` no `<form>` é só um rótulo enviado junto (aparece na planilha) — dá
  pra diferenciar "Contato" de "Engenharia" sem tocar em `forms.js`.

**Decisão de spec:** copiar a estrutura de campos (`form-row`/`form-field`/
`form-input`/`form-select`/`form-textarea`/`form-error-msg`/`form-consent`/
`form-success`, todas já existentes em `components.css`) só trocando o *conteúdo dos
campos* — nenhuma classe CSS nova, nenhum JS novo.

### Campos (diferentes do formulário de `contato.html`)

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| Nome completo | text | Sim | Igual ao de `contato.html` |
| Empresa | text | Sim | Igual ao de `contato.html` |
| E-mail | email | Sim | Igual ao de `contato.html` |
| WhatsApp | tel | Sim | Igual ao de `contato.html` (máscara automática) |
| **Vertical de interesse** | select | Sim | **Novo** — as 8 verticais + "Ainda não sei, quero orientação" |
| **Modelo de contratação de interesse** | select | Não | **Novo** — Owner's Engineering / EPCM / EPC-Turnkey / "Ainda não sei" |
| Descreva o desafio | textarea | Não | Equivalente à "Mensagem" de `contato.html`, renomeado pro contexto |

**Por que "Vertical de interesse" e não o campo `motivo` de `contato.html`:** o `motivo`
de `contato.html` é sobre o funil de biogás (gerador de resíduos / investidor / comprar
biometano / O&M) — não cobre nenhuma das 8 verticais de engenharia. Criar um select
próprio evita forçar um encaixe torto no vocabulário de outro formulário.

### Ajuste retroativo no Bloco 1 (Hero)

O CTA primário do hero apontava para `contato.html` (formulário genérico, sem campo de
vertical). **Corrigido:** agora aponta para `#contato-eng`, âncora deste bloco, na
própria página — mantém o visitante no funil de engenharia e usa o formulário certo em
vez de mandá-lo pra um formulário sem os campos que fazem sentido aqui.

### Markup (rascunho)

```html
<section class="section" id="contato-eng" style="padding:88px 0;">
  <div class="container" style="max-width:640px;">
    <div style="text-align:center;margin-bottom:40px;">
      <span class="kicker" data-reveal>Fale com a engenharia 4WaTT</span>
      <h2 class="h2" data-reveal data-d="1">Pronto para colocar seu projeto em pé?</h2>
      <p class="lead" data-reveal data-d="2">Conte o desafio da sua operação — nossa equipe responde com o próximo passo técnico em até 1 dia útil.</p>
    </div>

    <form class="form-4watt" id="engForm" data-form-name="Engenharia" data-reveal data-d="3">
      <div class="form-row">
        <div class="form-field"><label for="eng-nome">Nome*</label><input class="form-input" id="eng-nome" name="nome" type="text" required placeholder="Seu nome completo"><span class="form-error-msg"></span></div>
        <div class="form-field"><label for="eng-empresa">Empresa*</label><input class="form-input" id="eng-empresa" name="empresa" type="text" required placeholder="Nome da empresa"><span class="form-error-msg"></span></div>
      </div>
      <div class="form-row">
        <div class="form-field"><label for="eng-email">E-mail*</label><input class="form-input" id="eng-email" name="email" type="email" required placeholder="seu@email.com"><span class="form-error-msg"></span></div>
        <div class="form-field"><label for="eng-wpp">WhatsApp*</label><input class="form-input" id="eng-wpp" name="whatsapp" type="tel" required placeholder="(00) 00000-0000"><span class="form-error-msg"></span></div>
      </div>
      <div class="form-field">
        <label for="eng-vertical">Vertical de interesse*</label>
        <select class="form-select" id="eng-vertical" name="vertical" required>
          <option value="">Selecione a frente de engenharia</option>
          <option>Engenharia Civil e Infraestrutura</option>
          <option>Engenharia Elétrica</option>
          <option>Engenharia Mecânica</option>
          <option>Engenharia Ambiental</option>
          <option>Gestão de Projetos e Obras</option>
          <option>Engenharia de Processos</option>
          <option>Engenharia Digital, Dados e IA</option>
          <option>Automação e Instrumentação</option>
          <option>Ainda não sei, quero orientação</option>
        </select><span class="form-error-msg"></span>
      </div>
      <div class="form-field">
        <label for="eng-modelo">Modelo de contratação de interesse</label>
        <select class="form-select" id="eng-modelo" name="modelo_contratacao">
          <option value="">Selecione (opcional)</option>
          <option>Owner's Engineering / Fiscalização</option>
          <option>EPCM</option>
          <option>EPC / Turn-Key</option>
          <option>Ainda não sei</option>
        </select>
      </div>
      <div class="form-field"><label for="eng-msg">Descreva o desafio</label><textarea class="form-textarea" id="eng-msg" name="mensagem" placeholder="Conte o contexto do seu projeto..."></textarea><span class="form-error-msg"></span></div>
      <button class="btn btn--primary" type="submit" style="width:100%;justify-content:center;">Enviar e falar com um especialista <i class="fas fa-arrow-right"></i></button>
      <p class="form-consent">Ao enviar, você concorda em ser contatado pela equipe 4WaTT. Tratamos seus dados com confidencialidade.</p>
    </form>
    <div class="form-success">Mensagem enviada! Nosso time entra em contato em até 1 dia útil.</div>
  </div>
</section>
```

### CSS novo necessário
**Nenhum.** `form-row`, `form-field`, `form-input`, `form-select`, `form-textarea`,
`form-error-msg`, `form-consent`, `form-success`, `btn btn--primary` já existem em
`components.css`/`contato.css` e são carregados globalmente ou reaproveitáveis — só
precisa confirmar qual arquivo define `.form-*` para saber se `engenharia.css` precisa
importar/linkar `contato.css` também, ou se essas classes já estão em `components.css`
(carregado em todas as páginas via `theme-4watt.css`/stack padrão). **Verificar antes de
implementar.**

### Chaves i18n propostas (~20)
`eng_form_kicker`, `eng_form_title`, `eng_form_lead`, labels dos 7 campos, `option`s dos
2 selects novos (8+1 e 4+1), texto do botão, `form-consent`, `form-success`. Pode
reaproveitar `contato_label_nome`/`contato_label_empresa`/`contato_label_email`/
`contato_label_wpp`/`contato_placeholder_*` já existentes em `languages.js` para os 4
campos idênticos ao de `contato.html`, criando chaves novas só pros campos exclusivos
(vertical, modelo, mensagem, cabeçalho do bloco).

### Pendências antes de implementar este bloco
- **Confirmar se `.form-*` (classes usadas pelo form de `contato.html`) estão em
  `components.css` (global) ou só em `contato.css` (só carregado por `contato.html`)** —
  se for só em `contato.css`, `engenharia.css` precisa replicar essas regras (não
  linkar `contato.css` inteiro, que traz outras coisas específicas daquela página).
- Decidir se o Apps Script (`apps-script/Code.gs`) deve aplicar alguma classificação de
  lead própria para este formulário (ex. por vertical/modelo de contratação) — hoje ele
  só tem a lógica `APTO/TRIAGEM/NAO_APTO` calibrada para o formulário do investidor;
  sem mudança no Apps Script, os leads de engenharia chegam à planilha sem
  classificação automática. Fica pendente, fora do escopo de HTML/CSS/JS deste spec.
- Adicionar as ~20 chaves i18n em `languages.js` PT+EN.
- Testar o dual-submit (Formspree + Apps Script) de verdade antes de publicar — este
  spec não cobre teste de entrega de e-mail/planilha.
