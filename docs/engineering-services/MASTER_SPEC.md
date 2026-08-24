# MASTER_SPEC — 4WaTT Engineering Services

## Natureza da iniciativa

A iniciativa Engineering Services representa uma **NOVA UNIDADE DE NEGÓCIO** adicionada ao
ecossistema da 4WaTT. Ela não substitui, reorganiza ou remove o portfólio existente.

### DEC-001 — Natureza da iniciativa

**Decisão:** Criar Serviços de Engenharia como nova Unidade de Negócio da 4WaTT.

**Status:** Aprovada.

**Regra:** O portfólio atual (Gestão de Resíduos, Engenharia de Biogás, Biometano,
Gaseificação de RSU, Área do Investidor) permanece preservado — sem renomeação, sem
remoção, sem migração de URL, sem reclassificação.

**Impacto:** Toda decisão futura de arquitetura, conteúdo, UX, SEO, navegação e
desenvolvimento deverá respeitar a coexistência entre a nova unidade e as ofertas
existentes. Princípio condutor: **Preservar + Adicionar + Integrar** (nunca migrar +
substituir + descaracterizar).

### DEC-002 — Naming da unidade

**Decisão:** Modelo C (Descritor funcional) — **"4WaTT | Serviços de Engenharia"**.

**Status:** Aprovada (2026-08-22).

**Motivo:** evita a redundância com "4WaTT Bio Engenharia" (nome formal da marca-mãe,
`alt` do logo em `snippets/navbar-premium.html:7`) que o Modelo B ("4WaTT Engineering")
criaria; mantém o mesmo registro de idioma (PT-BR) do restante do site.

**Impacto:** toda copy, H1, `<title>`, breadcrumbs e menções de navbar da nova unidade
usam "Serviços de Engenharia" como nome visível. Nome ainda não usado em nenhum arquivo
publicado — aplicar apenas quando a implementação começar.

### DEC-003 — Estrutura de URL do hub

**Decisão:** hub em pasta própria, **`/engenharia/index.html`**, com as verticais como
arquivos irmãos de 1 nível dentro da mesma pasta (ex. `/engenharia/eletrica.html`,
`/engenharia/civil.html` etc.) — nunca 3 níveis de profundidade.

**Status:** Aprovada (2026-08-22).

**Motivo:** replica a convenção já usada em `biometano/` para páginas com identidade
visual/stack própria; mantém a raiz do site sem crescer mais; slug curto e neutro
(`engenharia`) independente do nome comercial exibido na página.

**Impacto:** nenhum arquivo criado ainda — esta é a convenção a seguir quando a
implementação começar.

### DEC-004 — Estrutura conceitual da landing page

**Decisão:** aprovada a direção de 6 blocos proposta no GATE 4 (hero com CTA próprio →
`contato.html`; grid das 7 verticais confirmadas; prova cruzada via `.case-card`/marquee
com espaço para cases futuros; modelos de contratação; bloco de integração
institucional citando o Teste 8; CTA final com formulário/scoring próprios).

**Status:** Aprovada como direção conceitual (2026-08-22) — copy final e componentes
reais ainda não desenvolvidos.

**Atualização (2026-08-23):** dois detalhes já divergem do texto original acima, ambos
por decisão tomada durante a implementação, não uma revisão desta DEC — CTA do hero
aponta para `#contato-eng` (âncora do formulário dentro da própria página), não mais
para `contato.html`, porque o Bloco 6 ganhou formulário próprio; e o grid do Bloco 2 tem
**8** verticais, não 7 (a 8ª — Automação e Instrumentação — foi confirmada depois desta
DEC, no fechamento do Discovery).

---

## Boundary Mapping (levantado em Discovery, 2026-08-22)

Base: inventário real do site em produção — `snippets/navbar-premium.html`, `index.html`,
`AGENTS.md`.

| Oferta/Área existente | Estado atual | Relação com Engenharia | Ação |
|---|---|---|---|
| Gestão de Resíduos (`solucao-gestao-residuos.html`) | Existente, comercializada | Complementar — projetos de resíduo podem demandar engenharia civil/ambiental na implantação | Preservar |
| Engenharia de Biogás (`solucao-biogas.html`) | Existente, comercializada | Interseção forte — usa as mesmas disciplinas (mecânica, elétrica, automação, ambiental) cogitadas para a nova unidade | Preservar; referenciar como evidência técnica |
| Biometano (`solucao-biometano.html`, `biometano/index.html`) | Existente, comercializada | Interseção — projetos de biometano dependem de engenharia de processos / EPCM | Preservar; referenciar |
| Gaseificação de RSU (`solucao-gaseificacao.html`) | Existente, comercializada | Interseção — mesma lógica de disciplinas aplicadas | Preservar; referenciar |
| Área do Investidor (`investidor.html`) | Existente, com formulário e scoring de lead próprio | Independente — trata de captação/ROI de projetos de biogás, não de venda de serviços de engenharia | Preservar sem alteração; não reaproveitar o scoring atual (calibrado para volume de biogás) sem revisão |
| Academy / Partners / SaaS / Score (`academy.html`, `partners.html`, `saas.html`, `score.html`) | Stubs "em breve", sem conteúdo comercial | Nenhuma relação direta ainda identificada | Preservar; não converter em página da nova unidade sem validação explícita |
| Imprensa / Blog / Artigos / Casos (`imprensa.html`, `blog.html`, `artigos/`, `case-ceasa-goias.html`) | Existente | Fonte de prova social — cases de biogás/biometano podem comprovar capacidade multidisciplinar de engenharia | Referenciar como evidência técnica, sem reclassificar o conteúdo em si |
| Navbar "Soluções" (dropdown atual) | Existente, 4 itens fixos | Nenhuma — é a estrutura do portfólio atual | Preservar intacto; nova unidade ganha item de navegação próprio, não entra no dropdown existente |
| **"Consultoria Técnica" — pilar "Núcleo · Engenharia & Capital" da home** (`index.html` #ecossistema, linha 03; asset `ENGENHARIA- Sublogo Vetor.png`, alt "Engenharia by 4WaTT") | Existente, ao vivo | **Interseção direta** — texto visível "EVTE, business plan e projetos executivos, por hora ou por projeto" é essencialmente a Vertical 6 (Consultoria Técnica e EVTE) já em produção, hoje linkando para `investidor.html` | **Preservar sem nenhuma alteração — decisão explícita do usuário** (2026-08-22): manter separadas, sem link entre a linha existente e o novo hub. Nome visível ao usuário continua "Consultoria Técnica" (não "Engenharia"); só o `alt`/nome de arquivo do asset usa essa palavra, invisível na tela |
| **Serviços de Engenharia (nova unidade)** | **Inexistente** | **Nova BU** | **Criar futuramente** — arquitetura de marca e URL já decididas: ver DEC-002/DEC-003 |

---

## Mapa de Fronteiras da Nova Unidade

### O que permanece no portfólio atual (sem alterações)
Gestão de Resíduos, Engenharia de Biogás, Biometano, Gaseificação de RSU e Área do
Investidor mantêm URLs, textos (via `languages.js`), navegação e posicionamento atuais.
A narrativa de marca já existente na home — "Uma marca. Um ecossistema. Do primeiro
resíduo..." (`home_eco_title`) — já enquadra a 4WaTT como um ecossistema de soluções, o
que favorece adicionar uma nova unidade sem contradizer o posicionamento vigente.

### O que pertence à nova Unidade de Engenharia (proposto, a validar)
Hub próprio de Serviços de Engenharia com verticais candidatas — a validar uma a uma
contra capacidade real antes de publicar qualquer uma:
Engenharia Civil e Infraestrutura, Elétrica, Mecânica, Automação e Instrumentação,
Ambiental, Gestão de Projetos e Obras, Processos, Digital/Dados/IA.

### Onde existem interseções
As soluções de biogás, biometano e gaseificação já demandam, na prática, as mesmas
disciplinas de engenharia cogitadas para a nova unidade. Isso deve ser tratado como
**prova de capacidade técnica** (evidência a citar na nova unidade), nunca como motivo
para fundir os dois catálogos comerciais.

### Onde não devemos misturar as ofertas
- Não mover, renomear ou reclassificar `solucao-*.html` para dentro de `/engenharia`.
- Não reaproveitar o formulário/scoring de `investidor.html` para leads de engenharia
  sem desenho próprio.
- Não alterar o dropdown "Soluções" do navbar para acomodar a nova unidade.
- Não estender ou generalizar o posicionamento "biogás/biometano" para "engenharia
  genérica" — as duas frentes coexistem, uma não substitui a outra.

### Como o usuário navegará entre os dois universos (hipótese inicial)
Item de primeiro nível novo no navbar, ao lado de "Soluções" e "Área do Investidor"
(ex.: "Engenharia"), com submenu próprio — sem tocar no dropdown existente. Cross-link
pontual a partir dos cases de biogás/biometano ("essa entrega envolveu engenharia X — 
conheça nossa unidade de Serviços de Engenharia") e vice-versa. Naming, URL e modelo de
arquitetura de marca (Branded House / Unidade identificada / Descritor funcional) ainda
não decididos — ver seções 8 e 9 da regra estratégica para as alternativas em avaliação.

---

## GATE 1 — Brand Context / Design System / Integration Context

Levantamento direto do site em produção (`index.html`, `contato.html`, `assets/css/theme-4watt.css`,
`assets/css/design-system.css`, `snippets/navbar-premium.html`), 2026-08-22.

### 1. Brand Context
- **Voz:** direta, orientada a resultado, frases curtas com verbo de ação — "Transformamos
  resíduo em energia e receita previsível.", "Engenharia de resultado. Sem atalhos, sem
  achismo." Sem jargão de agência/consultoria genérica.
- **Padrão de kicker:** rótulo curto categorizando cada seção/hero (ex. "Bio Engenharia ·
  Biogás & Biometano").
- **Precedente relevante para arquitetura de marca:** o hero da home já expõe, lado a
  lado, `"EPC · O&M · Consultoria · 4WaTT Finance"`. Ou seja, a empresa **já nomeia uma
  frente própria como "4WaTT + Descritor"** sem tratá-la como marca separada. Isso é
  evidência a favor do **Modelo B (Unidade identificada, ex. "4WaTT Engineering")** da
  seção 8 da regra estratégica — registro apenas como achado, nenhuma decisão de naming
  tomada aqui.
- **Modelos de entrega já comunicados publicamente:** EPC, O&M, Consultoria. A nova
  unidade deve se posicionar em relação a esse vocabulário já conhecido do público, não
  inventar um novo do zero.
- **Paleta:** roxo/plum como cor institucional âncora, teal como accent funcional (CTAs,
  ícones), gold como destaque pontual — nunca como texto pequeno puro (usar `--gold-ink`).

### 2. Design System
- **Tipografia:** display `Montserrat` (headlines, stats), body `Inter`. Escala de
  tokens `--text-hero/h1/h2/h3/h4/stat` em `design-system.css`.
- **Duas escalas de espaçamento/sombra coexistindo:** `theme-4watt.css` (sombras
  "quentes", tingidas de roxo — carregada por todas as páginas ativas) e
  `design-system.css` (sombras neutras, escala de 4px `--space-1`…`--space-32`). Uma
  página nova deve seguir `theme-4watt.css` por ser a folha universal.
- **Card de prova social reaproveitável:** `.case-card` (usado nos 3 cases da home) —
  serve para cases de engenharia sem duplicar CSS.
- **Carrossel padrão do site:** `data-marquee` + `initDraggableMarquee`
  (`site-premium.js`) — usar o mesmo motor para qualquer logotipo/galeria de clientes da
  nova unidade em vez de recriar um carrossel.
- **Navbar:** `<nav class="nav">` com padrão de dropdown `.nav__dd` já existente
  ("Soluções") — replicável para um novo item de primeiro nível sem CSS adicional.

### 3. Integration Context
- **Descoberta hoje:** o único caminho de acesso ao portfólio é o navbar; a home não tem
  nenhum bloco apontando para fora do portfólio atual. A nova unidade precisa de um
  ponto de entrada visível (item de navbar + possivelmente um card na seção
  "ecossistema" da home) ou fica órfã.
- **Cross-link natural já disponível:** os 3 cases da home (CEASA Goiás, Frigorífico
  Franca, Organo Buritis) são a evidência técnica mais forte prevista na seção 5 da
  regra estratégica — podem ganhar uma menção lateral ("engenharia envolvida: X")
  apontando para a nova unidade, sem reescrever o case.
- **Páginas institucionais seguras para compartilhar:** `contato.html` já está na pilha
  limpa (`theme-4watt.css` + `contato.css` + `mobile-fixes.css`) — pode receber a nova
  unidade como mais uma opção de assunto no formulário sem herdar CSS legado.
  `imprensa.html` e `politica-privacidade.html` são candidatas naturais a permanecer
  compartilhadas como estão.
- **Risco identificado:** `investidor-projetos.html` e as páginas de blog carregam pilha
  legada (`style.css`, `custom_v2.css`, `cinematic-home.css`, `design-system.css`,
  `components.css`, `legacy-bridge.css`). Qualquer página nova da unidade de engenharia
  deve evitar essa pilha e seguir o padrão limpo de `case-ceasa-goias.html` /
  `contato.html`.

### Validação GATE 1 (com o usuário, 2026-08-22)

| Achado | Status | Nota |
|---|---|---|
| "4WaTT Finance" como precedente de "4WaTT + Descritor" | **Confirmado válido** | Reforça o Modelo B (Unidade identificada) como opção forte a comparar no próximo gate — ainda não é decisão de naming. |
| Reaproveitar vocabulário EPC/O&M/Consultoria para a nova unidade | **Rejeitado — vocabulário distinto** | Serviços de Engenharia terá modelo contratual e vocabulário próprios, ainda a definir. Reforça a pendência já registrada sobre modelo contratual (EPCM/EPC/Turn-Key) de Gestão de Projetos e Obras. |
| Descoberta via item novo no navbar + card na home | **Confirmado** | Segue como hipótese de navegação para os próximos gates. |
| Cross-link dos 3 cases atuais (CEASA, Franca, Organo Buritis) como prova social | **Confirmado, com ressalva** | Usuário tem mais cases para adicionar depois — o mecanismo de cross-link não deve ser hardcoded para os 3 cases atuais; desenhar como padrão reaproveitável que acomode novos cases futuros. Ainda não implementar. |

---

## GATE 2 — Validação de capacidade real das verticais (com o usuário, 2026-08-22)

Comparação de arquitetura de marca / URL (seções 8–9 da regra estratégica) foi
**adiada como tarefa futura**, a pedido do usuário. Este gate seguiu direto para validar
quais verticais candidatas têm capacidade real hoje — pré-requisito explícito das
seções 13–15 antes de incluir qualquer uma no catálogo.

### Verticais confirmadas com capacidade real
- **Engenharia Civil e Infraestrutura**
- **Engenharia Elétrica**
- **Engenharia Mecânica**
- **Engenharia Ambiental**
- **Gestão de Projetos e Obras** — modelos contratuais confirmados como praticados/pretendidos:
  Owner's Engineering / fiscalização, EPCM e EPC/Turn-Key — os três, não apenas um.
- **Engenharia de Processos / Consultoria Técnica e EVTE** — evidência real: proposta
  comercial em andamento de consultoria + EVTE (contexto de projeto do usuário).
- **Engenharia Digital, Dados e IA** — confirmada, com sub-escopo real específico:
  - Process Intelligence
  - Data & Analytics
  - Data Science e IA aplicada
  - **Achado adicional do usuário, fora da lista original da regra estratégica:**
    *Software/Computação e automação de processos com IA* — desenvolvimento de skill
    personalizada, MCP (Model Context Protocol) personalizado, automação de processos
    repetitivos, implantação de RAG. Este é um sub-escopo concreto e mais específico do
    que as categorias genéricas originalmente propostas — deve informar naming e copy
    desta vertical quando chegar a hora.

### Vertical 8 — Automação e Instrumentação (confirmada em 2026-08-22)

Escopo definido pelo usuário: **IoT + sistemas SCADA**, com implantação de **data
science**, **RAG** e demais conceitos técnicos de automação com uso de **IA para tomada
de decisão**.

**Fronteira a esclarecer na fase de SPEC (flag, não bloqueia o fechamento do
Discovery):** esse escopo se sobrepõe parcialmente com a vertical 7 (Engenharia Digital,
Dados e IA), que já inclui Data Science e RAG como sub-escopo confirmado. Proposta de
separação de trabalho para a fase de especificação, a validar:
- **Vertical 7 (Digital, Dados e IA)** = camada horizontal — skill personalizada, MCP,
  RAG genérico, automação de processos administrativos/de escritório, analytics de
  negócio.
- **Vertical 8 (Automação e Instrumentação)** = camada operacional/industrial — sensores
  IoT, protocolos e integração SCADA, e a aplicação de data science/RAG/IA
  especificamente à tomada de decisão em ambiente industrial/de planta.

Ambas as verticais confirmadas com capacidade real — 8 de 8, catálogo completo.

---

## GATE 3 — Posicionamento e Expansão de Mercado (rascunho, 2026-08-22)

Construído sobre as verticais confirmadas no GATE 2 e o brand context do GATE 1. Segue
as seções 11 e 12 da regra estratégica. Naming/URL continuam adiados — nada aqui
pressupõe um nome definido para a unidade.

### Posicionamento (seção 11) — revisado após validação

Statement conceitual (não é copy final), **corrigido** para liderar com robustez técnica
em vez de abrangência setorial:

> "A 4WaTT possui uma robusta capacidade técnica de engenharia avançada, capaz de
> conduzir projetos complexos com a segurança técnica necessária para resolver desafios
> reais — uma competência que hoje sustenta seus projetos de biogás e biometano e que
> passa a estar disponível como frente própria de Serviços de Engenharia."

A diferença em relação à versão anterior: o centro da mensagem é **robustez técnica /
segurança em projetos complexos**, não "atender qualquer setor" — a abrangência setorial
vira consequência, não o argumento principal.

Pilares de posicionamento, cada um ancorado em evidência real já levantada:
- **Robustez técnica em projetos complexos** → Gestão de Projetos e Obras confirmada nos
  três modelos contratuais (Owner's Engineering, EPCM, EPC/Turn-Key) — sinaliza
  capacidade de assumir o projeto inteiro, com segurança técnica, não só um pedaço.
- **Multidisciplinar** → as 6 verticais clássicas confirmadas no GATE 2 + a vertical
  digital.
- **Capaz de atender diferentes setores** → **hipótese ainda não comprovada** (ver
  correção abaixo) — não tratar como prova, apenas como direção pretendida.
- **Independente de tecnologia específica** → a vertical digital/IA (skill
  personalizada, MCP, RAG, automação de processos) é o exemplo mais claro: não depende
  de biogás/biometano para existir ou fazer sentido comercial.
- **Integrada à capacidade institucional** → reaproveita a prova social dos cases já
  existentes (GATE 1), sem se apresentar como empresa nova.

**Risco explícito a evitar** (princípio da seção 11, validado como suficiente por
enquanto — sem salvaguarda de UX mais dura por ora): a comunicação não pode sugerir que
"a 4WaTT deixou de ser focada em suas soluções atuais". Os cases de biogás aparecem como
evidência de capacidade técnica da nova unidade — nunca como o produto que a nova unidade
está vendendo.

### Correção de evidência — proposta de Consultoria/EVTE

A proposta comercial de consultoria + EVTE citada no GATE 3 original **foi confirmada
pelo usuário como ainda biogás/resíduo-adjacente**, não como um cliente fora desse
escopo. **Retirada como prova de expansão setorial já em curso.** Ela continua válida
como evidência de capacidade real na vertical de Consultoria Técnica/EVTE (GATE 2), só
não serve para sustentar a alegação de que a diversificação setorial já está acontecendo
na prática — isso permanece uma hipótese estratégica a comprovar com clientes futuros,
não um fato já demonstrado.

### Expansão de mercado (seção 12) — validado sem ajustes

O funil atual do site é desenhado inteiramente em torno de "simular viabilidade de
projeto de biogás" (CTA principal do navbar e da home). Perfis de cliente que a nova
unidade passa a endereçar e que **esse funil atual não alcança** — confirmados pelo
usuário como cobertura adequada, sem perfis faltando:
- Empresa sem necessidade de biodigestor, mas com um projeto de engenharia civil,
  elétrica, mecânica ou ambiental a resolver.
- Empresa que precisa de EVTE/consultoria técnica fora do escopo de biogás.
- Empresa que precisa de gestão/fiscalização de obra (Owner's Engineering, EPCM, EPC),
  independente de energia/resíduo.
- Empresa que precisa de automação de processos com IA (skill personalizada, MCP, RAG)
  sem qualquer relação com biogás.

Importante: como a evidência do EVTE foi retirada (ver correção acima), estes 4 perfis
continuam sendo a **hipótese de expansão de mercado**, ainda sem cliente confirmado que
comprove diversificação setorial fora de biogás/resíduo. Isso amplia o mercado
endereçável **sem alterar** o funil de investidor/biogás existente — os dois convivem em
paralelo, conforme já registrado no Boundary Mapping (GATE 0).

---

## GATE 4 — Sugestões para os pontos pendentes

> **Atualização (2026-08-22):** as três recomendações abaixo foram validadas pelo
> usuário e promovidas a decisão — ver **DEC-002**, **DEC-003** e **DEC-004** no topo
> deste documento. O texto abaixo fica como registro do raciocínio/comparação que
> embasou cada decisão.

### 1. Naming da unidade (seção 8)

**Achado novo, relevante para a decisão:** o logo do site tem `alt="4WaTT Bio
Engenharia"` (`snippets/navbar-premium.html:7`) — ou seja, **a marca-mãe já contém a
palavra "Engenharia"** no seu nome formal. Isso muda o cálculo dos 3 modelos:

| Modelo | Exemplo | Prós | Contras |
|---|---|---|---|
| A — Branded House | "4WaTT / Serviços de Engenharia" | Zero equity nova a construir; SEO concentrado num domínio só | Fica próximo demais do dropdown "Soluções" atual — risco de parecer só mais um item da lista |
| B — Unidade identificada | "4WaTT Engineering" | Precedente direto ("4WaTT Finance" no hero da home) — padrão já validado no GATE 1 | **Risco de redundância/confusão com "4WaTT Bio Engenharia"** (a própria marca-mãe) — dizer "4WaTT Engineering" ao lado de "4WaTT Bio Engenharia" soa repetitivo |
| C — Descritor funcional | "4WaTT \| Serviços de Engenharia" (PT) | Mesmo registro de idioma do restante do site (PT-BR); diferencia claramente de "Bio Engenharia" (a empresa) vs. "Serviços de Engenharia" (a nova unidade) | Não cria uma sub-marca memorável como "Finance" |

**Minha recomendação:** **Modelo C**, com o precedente do Modelo B como inspiração de
*padrão* (não de nome) — ou seja, adotar a lógica de "4WaTT + descritor da frente" que
já existe com "Finance", mas em português e sem repetir a palavra "Engenharia" que já
está no nome formal da marca-mãe. Se o usuário preferir manter o inglês por
consistência com "Finance", uma alternativa seria "4WaTT Engineering Services" por
extenso, que soa menos redundante do que o "Engineering" isolado.

### 2. URL do hub (seção 9)

O site não tem build/roteamento — é HTML estático servido direto. Duas convenções já
convivem: **arquivos soltos na raiz** (`solucao-biogas.html`, kebab-case) para a maioria
das páginas, e **pastas dedicadas** (`biometano/`, `viabilidade/`, `artigos/`) quando a
página tem stack técnica própria (ex. Leaflet só em `biometano/index.html`).

O exemplo da regra estratégica (`/engenharia/engenharia-eletrica/projetos-eletricos`,
3 níveis) **não bate com nenhuma convenção real do site** — nenhuma página atual passa
de 1 nível de pasta.

**Minha recomendação:**
- Hub em pasta própria: **`/engenharia/index.html`** — mesma lógica de `biometano/`,
  já que a unidade provavelmente vai acumular CSS/JS próprios como qualquer outra
  frente com identidade visual distinta.
- Verticais como arquivos irmãos dentro da mesma pasta, 1 nível só (não 3):
  `/engenharia/civil.html`, `/engenharia/eletrica.html`, `/engenharia/mecanica.html`,
  `/engenharia/ambiental.html`, `/engenharia/gestao-projetos-obras.html`,
  `/engenharia/processos.html`, `/engenharia/digital.html`.
- Slug do hub como **`engenharia`** independente de qual naming vencer (item 1) — a URL
  pode ser mais curta e neutra que o nome comercial exibido na página (prática comum:
  H1/copy dizem "Serviços de Engenharia", a URL só precisa ser curta e memorável).

### 3. Landing page conceitual (seção 10)

Estrutura conceitual (sem copy final, sem código):

1. **Hero** — headline com a robustez técnica do posicionamento validado no GATE 3;
   kicker citando a unidade; CTA para `contato.html` (pilha limpa, já mapeada no GATE 1)
   — **não** o CTA do simulador de biogás, porque é outro funil (Boundary Mapping, GATE 0).
2. **Grid de verticais confirmadas** — 1 card por vertical validada no GATE 2 (7 no
   total), cada uma linkando para sua própria página em `/engenharia/`.
3. **Prova técnica cruzada** — reaproveita `.case-card` e o motor de marquee já
   inventariados no GATE 1, citando "engenharia envolvida: X" nos cases existentes
   (CEASA, Franca, Organo Buritis) — desenhado para acomodar os cases futuros que o
   usuário já sinalizou que vai adicionar (ressalva do GATE 1).
4. **Modelos de contratação** — bloco explicando Owner's Engineering / EPCM /
   EPC-Turnkey (evidência da vertical de Gestão de Projetos e Obras, GATE 2).
5. **Bloco de integração institucional** — reforço explícito de que isso não substitui
   o portfólio atual (Teste 8, seção 19) — pode linkar de volta ao dropdown "Soluções".
6. **CTA final** — formulário próprio, sem reaproveitar o scoring de `investidor.html`
   (rejeitado no GATE 1) — precisa de campos/classificação de lead desenhados para
   escopo de engenharia, não para volume de biogás.

---

## Pendências explícitas de Discovery (não decidir ainda)
- ~~Naming da unidade~~ — **resolvido, DEC-002**: "4WaTT | Serviços de Engenharia".
- ~~URL do hub~~ — **resolvido, DEC-003**: `/engenharia/index.html` + verticais como
  arquivos irmãos de 1 nível.
- ~~Quais verticais têm capacidade real validada~~ — **resolvido**: 8 de 8 verticais
  candidatas confirmadas (GATE 2 + confirmação final da vertical 8 em 2026-08-22).
- ~~Modelo contratual de Gestão de Projetos/Obras~~ — **resolvido no GATE 2**: os três
  modelos (Owner's Engineering, EPCM, EPC/Turn-Key) confirmados como praticados/pretendidos.
- ~~Escopo real de "Engenharia Digital, Dados e IA"~~ — **resolvido no GATE 2**, incluindo
  achado adicional (skills/MCP/RAG/automação de processos com IA) não previsto na lista
  original.

**Teste 8 — Independência das unidades:** após qualquer implementação futura, um
visitante deve entender simultaneamente que (1) o portfólio atual continua ativo, (2)
existe agora uma unidade ampla de Serviços de Engenharia, (3) as duas podem se
complementar, e (4) nenhuma parece substituir a outra. Se essa distinção não estiver
clara, a arquitetura não está pronta.

---

## Encerramento do Discovery (2026-08-22)

Todos os gates planejados foram percorridos e validados com o usuário:

| Gate | Conteúdo | Status |
|---|---|---|
| GATE 0 | Boundary Mapping — o que preservar vs. o que criar | Concluído |
| GATE 1 | Brand Context / Design System / Integration Context | Concluído e validado |
| GATE 2 | Capacidade real das verticais (8 de 8 confirmadas) | Concluído |
| GATE 3 | Posicionamento e Expansão de Mercado | Concluído e corrigido após validação |
| GATE 4 | Naming, URL e landing conceitual | Concluído — promovido a DEC-002/003/004 |
| — | Confirmação final da vertical 8 (Automação e Instrumentação) | Concluído |

**Checagem contra o Teste 8:** o Boundary Mapping (GATE 0) preserva o portfólio atual
sem alteração; DEC-001 a DEC-004 tratam a nova unidade como adição, não substituição; o
posicionamento (GATE 3) tem uma salvaguarda explícita contra a leitura de que a 4WaTT
"deixou de ser focada" no portfólio atual; e a navegação proposta (item de navbar +
card na home) mantém as duas estruturas visíveis lado a lado. **Critério atendido.**

**Catálogo final de verticais (8, todas com capacidade real confirmada):**
Civil e Infraestrutura · Elétrica · Mecânica · Ambiental · Gestão de Projetos e Obras ·
Processos / Consultoria Técnica e EVTE · Digital, Dados e IA · Automação e
Instrumentação (IoT, SCADA, data science, RAG, IA para decisão).

**Discovery encerrado.** Nenhum código foi implementado até este ponto — apenas este
documento de especificação. A partir daqui, o trabalho segue na fase de **Especificação
Técnica (SPEC)**, abaixo.

---

## Especificação Técnica (SPEC) — Fase 1: catálogo e estrutura de arquivos

### Catálogo de verticais com slugs (conforme DEC-003)

| # | Vertical | Arquivo proposto |
|---|---|---|
| 1 | Engenharia Civil e Infraestrutura | `engenharia/civil.html` |
| 2 | Engenharia Elétrica | `engenharia/eletrica.html` |
| 3 | Engenharia Mecânica | `engenharia/mecanica.html` |
| 4 | Engenharia Ambiental | `engenharia/ambiental.html` |
| 5 | Gestão de Projetos e Obras | `engenharia/gestao-projetos-obras.html` |
| 6 | Engenharia de Processos / Consultoria Técnica e EVTE | `engenharia/processos.html` |
| 7 | Engenharia Digital, Dados e IA | `engenharia/digital.html` |
| 8 | Automação e Instrumentação (IoT/SCADA/IA) | `engenharia/automacao.html` |
| — | Hub | `engenharia/index.html` |

~~Pendente de validação~~ — **resolvido nas sessões seguintes:** fronteira 7/8 discutida
no Bloco 2 (`pages/index.md`), CSS/JS próprios já criados (`assets/css/engenharia.css`,
`assets/js/engenharia.js`, sem depender da pilha legada), conteúdo do hub especificado E
implementado em protótipo.

~~Nenhum arquivo HTML/CSS/JS foi criado ainda~~ — **desatualizado, ver "Status
Consolidado" no fim deste documento** para o estado real (2026-08-23): hub e a 1ª página
interna já existem como protótipo funcional.

---

## Especificação Técnica (SPEC) — Fase 2: spec por página

Specs individuais por página, em `docs/engineering-services/pages/`:

| Página | Spec | Status |
|---|---|---|
| `engenharia/index.html` | [`pages/index.md`](pages/index.md) | Todos os 6 blocos especificados e implementados no protótipo (`engenharia/index.html`) — página completa de ponta a ponta, pendente de i18n em `languages.js` e item no navbar compartilhado |
| `engenharia/eletrica.html` | (ver nota abaixo) | Implementado no protótipo — 1ª página interna de vertical, banner + 4 grupos de serviço (27 itens) + CTA. Padrão a replicar nas outras 7 |

**Nota registrada:** o usuário trouxe um prompt de referência (componente React
"Responsive Hero Banner", stack shadcn/Tailwind/TypeScript) como inspiração de sensação
visual para o hero. Esse stack **não foi adotado** — contradiria o DEC-003 e a stack
real do projeto (HTML/CSS/JS estático, sem build). O conceito visual (badge, título em
duas linhas, CTA duplo, faixa de prova) foi traduzido para o design system já
inventariado no GATE 1 (tokens de `theme-4watt.css`, sistema de reveal existente,
componentes de botão existentes). Detalhe completo da adaptação em
[`pages/index.md`](pages/index.md).

### Padrão de página interna de vertical (2026-08-23)

Usuário trouxe como referência o layout de tokenengenharia.com.br/servicos/ — banner
(ícone + título + subtítulo) seguido de grupos de serviço categorizados, cada um com
rótulo + contador + grid de cards pequenos (ícone + nome). **Confirmado com o usuário:**
esse padrão vale para as páginas internas de cada vertical (não o hub), e pode-se
assumir que a 4WaTT entrega os mesmos serviços mostrados no print de referência (sem
validação item a item — decisão explícita do usuário, registrar como premissa, não como
fato auditado).

CSS novo em `assets/css/engenharia.css`: `.eng-page-banner` (banner, cores da marca —
gradiente `--plum`/`--roxo` em vez do navy do exemplo), `.eng-service-group`/
`.eng-service-grid`/`.eng-service-card` (grupos categorizados), `.eng-page-cta` (CTA de
fechamento, linka para `engenharia/index.html#contato-eng` — reaproveita o formulário do
hub, não duplica formulário por página).

**Primeira implementação:** `engenharia/eletrica.html` — banner com botão "Ver vídeo"
(reaproveita o modal de vídeo do hub, mesmo `data-video-id="fyDKUkN7Pi8"`), 4 grupos
(Estudos Elétricos·7, Laudos e Inspeções·5, Projetos Elétricos·9, Montagem Elétrica·6 —
27 itens ao todo, extraídos do print de referência). Verificado sem erros de console.

**Pendente:** replicar esse mesmo padrão para as outras 7 verticais — cada uma precisa
de uma lista de serviços própria (o usuário só validou/forneceu referência completa para
Elétrica; Mecânica também tem print de referência (Projeto Mecânico·3, Fabricação·5,
Montagem Mecânica·4, Manutenção Mecânica·1) mas ainda não foi implementada. As 6
restantes (Civil, Ambiental, Gestão de Projetos e Obras, Processos, Digital, Automação)
não têm nem print de referência ainda — não inventar conteúdo pra elas sem validação
equivalente.

---

## Status Consolidado (atualizado 2026-08-24) — leia isto antes de continuar em outra sessão

Este documento tem mais de mil linhas de histórico de decisão (Discovery + SPEC +
revisões pedidas ao vivo). Esta seção é o resumo definitivo do estado real do código — se
algo acima contradiz o que está aqui, **este bloco vale**, porque é o mais recente.

### Placar rápido (2026-08-24)

| Frente | Estado |
|---|---|
| Hub (`engenharia/index.html`) | **Pronto** — 6 blocos, grid das 8 verticais enriquecido |
| Engenharia Elétrica | **Pronta** — página de vertical + 27 landing pages no padrão aprovado |
| Engenharia Mecânica | **Pronta** (2026-08-24) — hero `.sol-hero`, 13 cards linkados, 13 landing pages |
| Civil · Ambiental · Gestão de Projetos · Processos · Digital · Automação | **Não iniciadas** — só o card no hub; falta lista de serviços do usuário |
| i18n | **Não iniciado** — 0 ocorrências de `data-i18n` nas 30 páginas da unidade |
| Navbar compartilhado | **Não feito** — item ausente em `snippets/navbar-premium.html` e nas 26 páginas da raiz |
| Marcadores de protótipo | **Ativos** nas 30 páginas (banner amarelo, `noindex`, `<base href="/">`) |
| `sitemap.xml` | Sem nenhuma página da unidade (coerente enquanto `noindex`) |

**Total hoje: 43 arquivos HTML em `engenharia/`** — hub + 2 páginas de vertical + 27
landing pages de Elétrica + 13 de Mecânica. `engenharia.css` em `?v=0.9`, versão única
nas 43.

### Ferramenta de geração (criada em 2026-08-24)

As landing pages de serviço **não são escritas à mão** — são geradas por
`docs/engineering-services/gerar-paginas-servico.py`, que combina o template aprovado com
o conteúdo em `conteudo_eletrica.py`. Rodar com:

```
python docs/engineering-services/gerar-paginas-servico.py
```

O gerador **não roda em produção**: o HTML gerado é commitado e servido direto, como todo
o resto do site (mesmo padrão do `assets/pages/update_footers.py` que já existia). Ele já
está parametrizado por vertical (`montar(s, vertical=..., vertical_nome=...)`) — para
Mecânica e as demais, falta só criar o `conteudo_{vertical}.py` correspondente.

**Exceção:** `engenharia/eletrica/qualidade-de-energia.html` **não é regerada**. É a
referência construída à mão e aprovada pelo usuário; mudança estrutural aprovada nela
precisa ser refletida manualmente no template.

### O que já existe e funciona (verificado no navegador, sem erros de console)
- **`engenharia/index.html`** — hub completo, 6 blocos:
  1. Hero — vídeo de fundo (`assets/4watt-servicos-engenharia.mp4`), mesma escala/
     estrutura do `.hero-h` da home (`min-height:100svh`, reveal linha-a-linha).
  2. Grid de 8 verticais dentro de um palco com efeito de tilt 3D por scroll (roxo
     sólido, sombra lateral colorida) — 6 das 8 com foto real, 2 (Processos, Digital)
     ainda no placeholder; Elétrica com 1 vídeo e Mecânica com 2 vídeos (grupo de botões)
     via modal próprio. Cada card tem descrição de 2 frases + preview de 3 serviços em
     pílulas (`.eng-vert-card__tags`) — ver nota "Enriquecimento do Bloco 2" abaixo.
  3. Marquee de prova técnica (3 cases) com **auto-duplicação em runtime** — carrossel
     se move e se atualiza sozinho quando um case novo for adicionado ao HTML.
  4. 3 cards de modelo de contratação (Owner's Engineering / EPCM / EPC-Turnkey).
  5. Bloco de reforço institucional (Teste 8) com 4 links de volta ao portfólio atual.
  6. Formulário próprio (`#contato-eng`) com campos de vertical/modelo de contratação,
     usando a infraestrutura de envio já existente (`form.form-4watt` + `forms.js`).
- **`engenharia/eletrica.html`** — página da vertical, **no padrão atual**: hero
  `.sol-hero` (foto + overlay + badge + CTA duplo + botão de vídeo), 4 grupos de serviço
  categorizados com os **27 cards linkados** para suas landing pages, e CTA de volta pro
  formulário do hub.
- **27 landing pages** em `engenharia/eletrica/*.html` — padrão aprovado pelo usuário,
  1.300–1.590 palavras cada, 14 seções: hero → faixa de fatos (roxo) → "O que é" (fundo
  tingido + prancha real) → palco 3D "por que importa" → tabela de escopo → palco 3D
  "como funciona" → carrossel de 6 pranchas (roxo) → quando contratar → o que você recebe
  → referências técnicas → "por que a 4WaTT" (roxo) → FAQ (6) → CTA final em roxo com
  vídeo de fundo → footer.
- **`engenharia/mecanica.html`** — **ainda no padrão ANTIGO**, ficou para trás quando
  Elétrica evoluiu: usa `.eng-page-banner` (faixa fina) em vez de `.sol-hero`, e os 13
  cards de serviço continuam como `<div>` sem link. Tem os 2 vídeos corretos
  (`.eng-page-banner__play-group`). **É a próxima tarefa natural.**
- **`assets/css/engenharia.css`** e **`assets/js/engenharia.js`** — todo o CSS/JS novo,
  nenhuma dependência de framework, reaproveitando ao máximo componentes/motores já
  existentes no site (reveal, parallax, marquee, modal, formulário, `.sol-*` de
  `solucoes.css`).
- **`assets/img/engenharia/{slug}/`** — 8 pastas: civil (25 arquivos), eletrica (14),
  mecanica (8), automacao (6), ambiental (5), gestao-projetos-obras (3). **processos e
  digital continuam vazias** — sem nem foto de capa.

### Landing pages de serviço — Engenharia Elétrica (2026-08-23, sessão de continuação)

`engenharia/eletrica.html` ganhou hero real (`.sol-hero`, mesmo padrão de
`solucao-biogas.html` — foto+overlay, badge, CTA duplo, breadcrumb via nova classe
`.eng-svc-breadcrumb`) no lugar do `.eng-page-banner` fino que tinha antes. Os 27 cards
de serviço (`.eng-service-card`), antes `<div>` estáticos, agora são `<a>` linkando cada
um para sua própria landing page em **`engenharia/eletrica/{slug}.html`** (27 arquivos
novos, um por serviço).

**Template de cada página de serviço:** navbar completa + `.sol-hero` (badge, h1, lead,
CTA duplo "Solicitar orçamento" / "Ver todos os serviços") + breadcrumb + seção "O que é"
(~150-250 palavras) + 3 `.sol-feat` de benefício/entrega + FAQ de 3 perguntas
(`.acc[data-accordion]`, já funciona sem JS novo — `site-premium.js:180` já inicializa
`[data-accordion]`) + `.eng-page-cta` linkando pro formulário do hub (nenhum formulário
duplicado por página) + footer padrão. CSS: `theme-4watt.css` + `components.css` +
`solucoes.css?v=2.2` (reaproveitado tal qual de `solucao-biogas.html`, sem editar) +
`engenharia.css?v=0.6` + `mobile-fixes.css`.

**Origem do conteúdo — 15 reais, 12 em voz de marca:** 15 páginas usam conteúdo baseado
nas páginas reais equivalentes da Token Engenharia (URLs fornecidas pelo usuário,
consultadas via `WebFetch`), **condensado** para a densidade do site e **sem os
parâmetros normativos numéricos específicos** das páginas de referência (decisão
confirmada com o usuário: pode citar nome de norma pública e estável como referência de
mercado — NR-10, NBR 5419 — mas não inventar limite numérico, percentual de tolerância ou
prazo específico). As outras 12 (Coordenação e Seletividade, Energia Incidente, Mercado
Livre de Energia, RISE, Iluminação Industrial, Filtros Harmônicos, Instalações Elétricas
Industriais, Montagem de SPDA, Montagem de Subestação, Comissionamento de Equipamentos,
Fabricação de Painel Elétrico, Instalação de Iluminação) foram **redigidas em voz de
marca 4WaTT, sem validação item a item** (autorizado pelo usuário) — cada uma tem
comentário HTML sinalizando isso, mesmo padrão de rastreabilidade do Bloco 2 do hub.

Verificado: 0 links internos quebrados (`auditar.py`), console limpo em 3 páginas
amostradas (1 real, 2 voz de marca), accordion abre/fecha, CTA aponta certo pro
`#contato-eng` do hub, sem overflow horizontal em 375px.

**Pendente:** mesmo padrão ainda não replicado para Mecânica nem para as outras 6
verticais — cada uma precisa da mesma decisão (hero `.sol-hero`, subpasta
`engenharia/{vertical}/`, template de serviço) quando o usuário pedir a próxima.

**Revisão "Ferrari" (2026-08-23, mesma sessão):** usuário achou o conteúdo inicial das
27 páginas raso e pediu mais profundidade + o acabamento premium do hub ("card roxo
sólido... fluxos em 3D realistas"). `qualidade-de-energia.html` foi refeita como
protótipo de validação, ainda não replicado nas outras 26:
- Conteúdo expandido de ~150 para ~1.330 palavras: 9→12 seções (tabela de parâmetros,
  trilha de 4 etapas, tabela comparativa, lista de causas, normas de referência, FAQ de
  3→6 perguntas) — mesma regra de profundidade técnica já validada (pode citar nome de
  norma pública — PRODIST Módulo 8, IEEE 519, NR-10 — não pode inventar limite numérico).
- **Painel 3D reaproveitado do hub:** a trilha de etapas agora vive dentro de
  `.eng-scroll-stage > .eng-scroll-stage__frame` — o mesmo componente do Bloco 2 do hub
  (gradiente roxo→plum, sombra lateral teal/gold, tilt 3D por scroll via
  `initScrollStage()` de `engenharia.js`, sem JS novo). Precisou de overrides de cor
  novos em `engenharia.css` (`.eng-scroll-stage .sol-step*`) porque `.sol-step` foi
  desenhado para fundo claro.
- **Imagem real:** `assets/img/engenharia/eletrica/svc-diagrama-quadro-cargas.jpg` —
  cópia (nome kebab-case) de um diagrama elétrico real com timbre 4WaTT já no acervo do
  usuário (`projeto-eletrico-quadro-energia.jpg`), exibido com legenda explicando que é
  exemplo representativo, não específico do caso do visitante. Nova classe
  `.eng-svc-figure`.
- `engenharia.css` subiu de `?v=0.6` para `?v=0.7`, propagado via `sed` em todas as ~30
  páginas que carregam o arquivo (hub, mecanica.html, e as 27 de elétrica) — nenhuma
  ficou para trás (conferido no `auditar.py`).
- `qualidade-de-energia.html` passou a carregar `assets/js/engenharia.js` (antes não
  carregava, pois não tinha vídeo/scroll-stage) — as outras 26 ainda não carregam.

**Rodada 2 da revisão premium (2026-08-23/24):** usuário achou ainda "fraco, sem o luxo
de uma marca Ferrari da engenharia" e pediu explicitamente **card roxo sólido como no
hub, imagens e carrossel de engenharia elétrica, mais elementos 3D**. Entregue em
`qualidade-de-energia.html` (~1.650 palavras, 14 seções):

- **3 blocos em roxo sólido** (`--roxo`→`--plum`, verificado por `getComputedStyle`:
  `rgb(58,9,64)`→`rgb(42,7,32)`), nova classe `.eng-svc-dark` com a mesma grade de
  blueprint mascarada do palco do hub: faixa de fatos logo abaixo do hero
  (`.eng-svc-strip`, filete gold por coluna), seção do carrossel, e "Por que a 4WaTT"
  (`.eng-svc-checks`, checks em gold + CTA).
- **2 palcos 3D** (`[data-scroll-stage]`) na mesma página — "Por que a energia suja
  custa caro" (3 `.sol-feat`) e "A campanha de medição" (4 `.sol-step`).
  `initScrollStage()` já suporta múltiplos palcos (`querySelectorAll`), nenhum JS novo.
- **Carrossel de 6 pranchas técnicas REAIS** da 4WaTT (`.eng-svc-marquee` /
  `.eng-svc-plate`), usando o motor `[data-marquee]` + `initAutoDuplicateMarquees()` —
  **verificado: 6 itens reais → 12 em runtime**, `scrollWidth` 5.260px vs `clientWidth`
  693px, e a matemática de wraparound do `tick()` simulada por 4.000 frames sem falha.
  Nenhum `animation: infinite`, nenhum JS novo.
- **Imagens:** 6 pranchas do acervo do usuário copiadas para nomes kebab-case
  (`assets/img/engenharia/eletrica/svc-*.{jpg,png}`) — quadro de cargas/unifilar,
  subestação blindada 2 MVA, diagrama de proteção, usina solar 1 MW, modelagem de
  irradiância, motogerador 250 kW a biogás. **Legendas conferidas lendo cada arquivo**,
  para não rotular documento técnico real de forma errada. Originais preservados.
- Overrides escuros novos para `.sol-feat` dentro de palco/seção escura (o componente
  vem de `solucoes.css`, desenhado para fundo claro) — todos escopados, nunca globais.
- `engenharia.css` → `?v=0.8`, propagado nas **30** páginas da unidade (`grep` confirma
  versão única). `auditar.py`: 0 links quebrados.

**Limitação de verificação nesta sessão:** o Browser pane fica oculto no ambiente de
automação, então `requestAnimationFrame` não dispara e o `resize_window` não reflui
abaixo de ~708px. Verificado o que é verificável sem render: CSS computado, contagem de
elementos, 200 OK das 6 imagens, matemática do loop do marquee, breakpoint de 720px
(faixa empilha em 1 coluna, tilt 3D desliga) e ausência de scroll horizontal. **A
conferência visual final (animação do tilt rolando a página, carrossel em movimento,
375px real) precisa ser feita no navegador do usuário.**

**APROVADO pelo usuário (2026-08-24)** e replicado nas outras 26 páginas — ver abaixo.

### Replicação nas 26 páginas de Elétrica (2026-08-24)

Padrão premium aprovado aplicado a todas as 26 páginas restantes, com conteúdo comercial
humanizado (~1.300–1.590 palavras por página, contra ~150 na primeira versão).

**Decisão de arquitetura: gerador em Python.** As 26 páginas têm ~200 linhas de
boilerplate idêntico (navbar, footer, carrossel, palcos 3D) e só o conteúdo muda.
Mantê-las à mão significaria replicar esse boilerplate 26 vezes e vê-las divergirem na
primeira correção de navbar. Criados dois arquivos em `docs/engineering-services/`:
- **`gerar-paginas-servico.py`** — template + funções de montagem. Gerador rodado à mão,
  **não roda em produção** (mesmo padrão do `assets/pages/update_footers.py` que já
  existia). O HTML gerado é commitado e servido direto, como todo o resto do site.
- **`conteudo_eletrica.py`** — o conteúdo de cada serviço como dados. É aqui que se
  edita texto; depois roda o gerador.

`qualidade-de-energia.html` **não é regerada** — é a referência viva aprovada à mão.
Mudança estrutural aprovada nela precisa ser refletida manualmente no template.

**Estrutura de cada página (14 seções):** hero `.sol-hero` → faixa de fatos (roxo) →
"o que é" (2 parágrafos) → palco 3D #1 "por que importa" → tabela de escopo (6 linhas) →
palco 3D #2 "como funciona" (4 etapas) → carrossel de pranchas (roxo) → quando contratar
(5 checks) → o que você recebe (3 cards) → referências técnicas (3 cards) → "por que a
4WaTT" (roxo, 4 checks + CTA) → FAQ (6 perguntas) → CTA final → footer.

**Verificado nas 27 páginas:** 3 seções roxo sólido, 2 palcos 3D, 6 pranchas reais
(12 em runtime após auto-duplicação) e 6 FAQs em **todas**; console limpo, imagens
200 OK, accordion funcional, breadcrumb correto, CTA apontando pro `#contato-eng`,
sem scroll horizontal; `engenharia.css?v=0.8` nas 30 páginas da unidade;
`auditar.py` com **0 links internos quebrados**.

**Origem do conteúdo — 15 reais, 12 em voz de marca.** As páginas sem referência externa
validada (`voz_marca: True` no `conteudo_eletrica.py`) levam comentário HTML no topo
marcando isso: coordenacao-seletividade, energia-incidente-arco, mercado-livre-energia,
rise, iluminacao-industrial, filtros-harmonicos e as 6 de Montagem. Regra de honestidade
mantida em todas: nome de norma pública e estável pode ser citado (NR-10, NBR 5410,
NBR 5419, NBR 14039, PRODIST Módulo 8, IEEE 519, IEEE 1584); limite numérico,
percentual, prazo de validade, métrica ou nome de cliente, nunca.

**Carrossel:** as mesmas 6 pranchas reais em todas as 26 — são as únicas evidências
reais de engenharia elétrica da 4WaTT disponíveis hoje. A copy nunca afirma que a prancha
É aquele serviço específico; ela é apresentada como prova de capacidade da vertical
("documentação técnica de verdade, não modelo genérico"), com o lead adaptado por página.
Quando houver acervo específico por serviço, basta trocar a lista `PRANCHAS` no gerador.

### Quebra do monocromático — imagem e vídeo (2026-08-24)

Feedback do usuário: "a landing page toda está monocolor e isso me incomoda". Duas
mudanças aplicadas nas 27 páginas:

**1. Seção "O que é" — fundo tingido + prancha real.** A seção era texto puro sobre
fundo neutro. Agora usa o `.sol-split` de `solucoes.css` (mesmo componente de
`solucao-biogas.html`, nenhum grid novo): texto à esquerda, prancha técnica à direita.
O fundo (`.eng-svc-about`) recebeu dois radiais tingidos com os accents da marca —
teal frio no canto superior direito, gold quente no inferior esquerdo — via
`color-mix(in srgb, var(--teal) 16%, transparent)` sobre `--surface-2`. Nenhuma cor
nova: é a mesma técnica já usada em `.sol-feat__ic` de `solucoes.css`.

**Imagem por serviço:** mapeada em `IMAGEM_SOBRE` (`conteudo_eletrica.py`), escolhida
pela proximidade temática — geração distribuída recebe a prancha da usina solar,
proteção/curto-circuito recebem o diagrama de proteção, e assim por diante.
Distribuição final: 10 quadro de cargas, 8 subestação 2 MVA, 6 diagrama de proteção,
1 usina solar, 1 motogerador, 1 modelagem de irradiância. **O `alt` descreve o que a
prancha É de fato, não o serviço da página** — assim a imagem funciona como prova de
capacidade da vertical sem afirmar que aquele documento pertence àquele serviço.

**2. CTA final "Fale com a engenharia 4WaTT" — roxo sólido com vídeo.** Nova classe
`.eng-cta-video`: gradiente `--roxo`→`--plum` com `assets/4watt-servicos-engenharia.mp4`
(2,5 MB) em `object-fit: cover`, opacidade .32, sob overlay que garante o contraste do
texto. Mesmo princípio do `.sol-cta` de `solucoes.css` (mídia absoluta + overlay), com
vídeo em vez de foto. `autoplay muted loop playsinline preload="none"` + `poster`, e
`@media (prefers-reduced-motion: reduce)` esconde o vídeo.

`engenharia.css` → `?v=0.9` nas 30 páginas da unidade. `auditar.py`: 0 links quebrados.

**Verificado:** as 27 páginas com exatamente 1 seção `.eng-svc-about` e 1
`.eng-cta-video__media`; todas as imagens referenciadas existem em disco; vídeo e
imagens 200 OK; gradiente tingido e gradiente roxo confirmados por `getComputedStyle`;
`.sol-split` em 2 colunas; texto do CTA em branco sobre o vídeo; sem scroll horizontal.

**Limitação de verificação (a mesma das rodadas anteriores):** o Browser pane fica
oculto neste ambiente, então `requestAnimationFrame` não dispara e o `resize_window`
não reflui abaixo de ~700–950px. Não foi possível ver o vídeo rodando nem testar 375px
real. O comportamento mobile do `.sol-split` (colapso para 1 coluna em ≤880px) é
herdado de `solucoes.css`, já provado em `solucao-biogas.html`. **Conferência visual
final no navegador do usuário.**

**Pendente:** replicar o mesmo padrão em Mecânica e nas outras 6 verticais. O gerador já
está parametrizado por vertical (`montar(s, vertical=..., vertical_nome=...)`) — falta só
criar o `conteudo_{vertical}.py` de cada uma.

### Enriquecimento do Bloco 2 (2026-08-23, sessão de continuação)

O grid de 8 verticais do hub ganhou: (1) um parágrafo `.lead` de abertura na seção,
reaproveitando quase literalmente o *statement* de posicionamento já validado no GATE 3
acima; (2) descrição de cada card expandida de 1 para 2 frases; (3) preview de 3
serviços por card, em pílulas (`.eng-vert-card__tags` / `.eng-vert-card__tag`, sem
link — é preview, não navegação).

**Origem do conteúdo dos previews — nem todos são igualmente validados:**
- **Elétrica e Mecânica** — reais, extraídos das páginas internas já construídas
  (`eletrica.html`/`mecanica.html`).
- **Gestão de Projetos e Obras, Digital, Automação** — reais, vêm de sub-escopo já
  confirmado no GATE 2 (modelos contratuais; Process Intelligence/Data & Analytics/MCP
  e RAG; IoT/SCADA/IA para decisão).
- **Civil, Ambiental, Processos (EVTE é real, os outros 2 itens de cada não)** —
  **redigidos em voz de marca 4WaTT, autorizados explicitamente pelo usuário** ("pode
  criar o conteúdo utilizando padrão de escrita da 4WaTT e seguindo manual de marca da
  4WaTT") na ausência de print/lista de referência real. **Não são fato auditado** —
  atualizar para itens reais assim que o usuário fornecer referência de cada vertical
  (mesmo padrão já usado para as 7 páginas internas ainda não construídas). Marcado com
  comentário HTML no próprio `engenharia/index.html` para não virar fato acidental numa
  sessão futura.

Também nesta sessão: o vídeo "Equipamentos Especiais — Skid biogás com geração de
energia" (`CRoETXYdh_8`), que já estava referenciado nos specs desde 2026-08-23 mas
nunca implementado, foi adicionado como 2º vídeo de Mecânica (hub e
`mecanica.html`) — decisão de onde ele entra já estava registrada em
`pages/index.md` ("3º vídeo — resolvido").

### O que falta — atualizado 2026-08-24

**Prioridade 1 — CONCLUÍDA em 2026-08-24.** Mecânica está pronta: hero `.sol-hero`,
13 cards linkados e 13 landing pages geradas. Ver a seção "Engenharia Mecânica
concluída" acima.

**Prioridade 2 — as 6 verticais restantes.** Civil, Ambiental, Gestão de Projetos e
Obras, Processos, Digital e Automação **não têm página de vertical nenhuma**, só o card
no hub. Cada uma depende da lista real de serviços vinda do usuário — **não inventar**.
O preview em voz de marca no Bloco 2 do hub não substitui essa validação.

**Bloqueadores de publicação (não impedem continuar construindo):**
1. **i18n — o maior pendente.** As 30 páginas de `engenharia/` têm **zero** ocorrências
   de `data-i18n` (verificado por grep em 2026-08-24): todo o texto está hardcoded em PT.
   Contraria a regra nº 1 do site (`assets/js/languages.js` como fonte de verdade do
   texto). **Novidade que facilita:** como o conteúdo de Elétrica agora vive em
   `conteudo_eletrica.py`, a migração pode ser feita no gerador, e não página a página.
2. **Item de navbar ausente no navbar compartilhado.** "Serviços de Engenharia" não está
   em `snippets/navbar-premium.html` nem nas 26 páginas da raiz (verificado por grep em
   2026-08-24). Sem isso, a unidade só é descoberta por quem já sabe a URL.
3. **Fotos incompletas:** Processos e Digital com pasta de imagem **vazia** — sem nem
   foto de capa. 6 das 8 verticais sem vídeo (só Elétrica e Mecânica têm).
4. **Sem classificação de lead no formulário novo.** O Apps Script (`apps-script/
   Code.gs`) só tem a lógica APTO/TRIAGEM/NAO_APTO calibrada pro formulário do
   investidor — os campos novos (`vertical`, `modelo_contratacao`) chegam na planilha
   como texto bruto, sem pontuação automática.
5. **Marcadores de protótipo ativos nas 30 páginas:** banner amarelo fixo "PREVIEW DE
   SPEC", `<meta name="robots" content="noindex, nofollow">` e `<base href="/">` no
   `<head>`. O `<base>` funciona bem e é o que permite os caminhos raiz-relativos nas
   subpastas, mas ainda não foi decidido se é a convenção final — decidir antes de
   publicar. Quando sair o `noindex`, o gerador precisa ser ajustado junto (o marcador
   está no template).
6. **`sitemap.xml` sem nenhuma página da unidade** — coerente enquanto tudo está
   `noindex`, mas entra na mesma decisão do item 5 (checklist de deploy do
   `AGENTS.md`/`CLAUDE.md`).
7. **Tarefa em paralelo, não bloqueante:** investigação de CSS ausente em
   `contato.html` (`task_6bf1a1bd`, sinalizada à parte) — não relacionada a este
   trabalho, mas ainda pendente.

### Engenharia Mecânica concluída (2026-08-24)

Vertical fechada no mesmo padrão de Elétrica. O que mudou:

**Gerador parametrizado por vertical.** `gerar-paginas-servico.py` ganhou o dict
`VERTICAIS` (slug, nome, curto, arquivo, capa) e `montar(s, v)` passou a receber a
config já enriquecida com o conteúdo do módulo. `PRANCHAS`, `IMAGEM_SOBRE` e
`ALT_PRANCHA` saíram do gerador e passaram a viver em cada `conteudo_{vertical}.py` —
o contrato de um módulo de conteúdo é exportar esses três mais `SERVICOS`. A string
"Ver todos os serviços de Elétrica" virou `{v['curto']}`. Aceita argumento de linha de
comando: `python docs/engineering-services/gerar-paginas-servico.py mecanica`.
**Refactor validado regerando as 26 páginas de Elétrica byte a byte idênticas.**

**`engenharia/mecanica.html`** saiu do `.eng-page-banner` para o hero `.sol-hero`
(capa `cover-wide.jpg`, breadcrumb, badge, CTA), com os **dois** botões de vídeo
preservados dentro do `.sol-hero__cta`. Os 13 cards viraram `<a>`. A página passou a
carregar `solucoes.css?v=2.2`, que o `.sol-hero` exige e que ela não carregava.

**13 landing pages** em `engenharia/mecanica/`, 1.357–1.525 palavras cada, com perfil
estrutural idêntico ao de `eletrica/curto-circuito.html`.

**Origem do conteúdo — os 13 são voz de marca.** Diferente de Elétrica (15 dos 27 com
referência externa), Mecânica não tem nenhuma referência validada item a item. Todos
levam `voz_marca: True` e o comentário HTML de rastreabilidade. Autorizado pelo usuário
em 2026-08-24. **Atualizar assim que houver referência real de cada serviço.**

**Imagens.** As 6 pranchas do carrossel são os arquivos reais do acervo, copiados para
nomes kebab-case e usados **sem recorte** — decisão explícita do usuário, mesmo com 4
delas sendo capturas do SolidWorks com a interface visível (a árvore de montagem é parte
da evidência). Capa do hero: `cover-wide.jpg`, JPEG 1920×1080 gerado do render
`0 - MONTAGEM SECADOR.png` para não servir 1,7 MB de fundo. Legendas e `alt` conferidos
abrindo cada arquivo, um a um.

**Verificado:** `auditar.py` com 0 links quebrados; console limpo; HTTP 200 nas 13
páginas e em todos os assets; 6 pranchas → 12 em runtime (auto-duplicação);
`scrollWidth` 5.260 vs `clientWidth` 1.265; hero de `mecanica.html` com 648px, idêntico
ao de `eletrica.html`; 3 seções em `rgb(58,9,64)`→`rgb(42,7,32)`; accordion abre e fecha;
sem scroll horizontal; `engenharia.css?v=0.9` único nas 43 páginas.

**Não verificado (pane oculto):** animação do tilt 3D, movimento do carrossel e 375px
real. Screenshot indisponível no ambiente.

**Pendente:** as 6 verticais restantes seguem dependendo da lista real de serviços do
usuário — **não inventar**.

### Limitação de verificação do ambiente (vale para todas as sessões)

O Browser pane do ambiente de automação fica oculto. Consequências práticas:
`requestAnimationFrame` não dispara (o tilt 3D e o movimento do carrossel **não são
observáveis** aqui), e `resize_window` não reflui abaixo de ~700px (não dá para testar
375px real). O que **é** verificável e deve ser sempre feito: CSS computado
(`getComputedStyle`), contagem de elementos, status HTTP dos assets, matemática de loop
simulada, e ausência de scroll horizontal. **A conferência visual final é sempre do
usuário** — e deve ser dita explicitamente ao entregar.

### Resposta direta: dá pra continuar numa sessão nova?

**Sim.** Use `docs/engineering-services/KICKOFF_NEXT_SESSION.md` — ele tem o prompt
pronto, com o estado atual, as pendências priorizadas e as regras não-negociáveis
acumuladas até aqui.

Para **continuar construindo**: Mecânica é a próxima tarefa e não depende de nada novo
do usuário. As outras 6 verticais dependem da lista de serviços de cada uma.

Para **publicar em produção**: ainda não — i18n e navbar compartilhado são bloqueadores
reais pelas convenções do próprio site.
