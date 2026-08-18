# Plano de Mudanças — Site 4WaTT

> 📐 **Arquitetura e regras de edição:** skill **`site-4watt`**
> (`.claude/skills/site-4watt/`). Carregue-a antes de mexer em qualquer conteúdo —
> ela documenta por que editar texto direto no HTML não funciona.
>
> **Status:** parcialmente implementado — ver A1 e a seção 3b.
> **Origem:** tarefa Notion #99 "Mudanças do site" — [link](https://app.notion.com/p/3ae9fb005cbd80559112f6a143d4ce66)
> **Projeto/Sprint Notion:** Desenvolvimento Ecossistema → Tasks → Tarefas do Time
> **Prazo Notion:** 2026-08-07 · **Prioridade:** 1 - Precisamos · **Status Notion:** Não iniciada
> **Documentado em:** 2026-07-30
> **Repositório:** `4WaTT-Bio-Engenharia/site` (branch `main`, 165 arquivos versionados)

---

## 1. Contexto e objetivo

A auditoria registrada no Notion foi feita **lendo o HTML publicado via fetch**, sem navegador. Este documento cruza cada apontamento com o **código real do repositório**, marca o que se confirmou, o que mudou de escopo e o que ainda depende de decisão de negócio.

O diagnóstico central do Notion se mantém após a verificação:

> O gap principal não é de conteúdo institucional, é estrutural: as etapas que deveriam virar o "Projeto de Investimento" ainda são vendidas soltas, o site nunca menciona a objeção "já perguntei pra uma IA", e o formulário de contato não qualifica nem pontua o lead.

Referência estratégica: `4WaTT — Funil Comercial - Entrada de Lead e Script Comercial.docx` e a skill `4watt-funil-consultivo` (`funil_e_produtos.md`, `qualificacao_e_descoberta.md`, `canais_aquisicao.md`).

---

## 2. Arquitetura atual (verificada no repo)

Detalhe completo em [CLAUDE.md](CLAUDE.md) e [AGENTS.md](AGENTS.md). Resumo do que importa para estas mudanças:

| Aspecto | Situação |
|---|---|
| Stack | HTML estático multi-página, **sem build step**. Editar `.html`/`.css`/`.js` direto. |
| Assets ativos | Tudo em `assets/`. ~~`css/`, `js/`, `images/` na raiz~~ — **essas pastas não existem mais** (verificado em 2026-08-05); a afirmação vinha do `CLAUDE.md` antigo. |
| Navbar/footer | **Duplicados em cada arquivo HTML** — não há templating. Fonte de referência: `snippets/navbar-premium.html`. |
| Formulários | Duplo envio: Google Apps Script (`apps-script/Code.gs`, scoring APTO/TRIAGEM/NAO_APTO) + Formspree (`xpwzdnkl`). Lógica em `assets/js/forms.js`. |
| i18n | Runtime via `data-i18n` + `assets/js/languages.js`. **O texto do HTML é sobrescrito no carregamento** — editar copy exige mexer na chave, nos blocos `pt` e `en`. Ver a skill `site-4watt`. |
| Simulador | App React externo hospedado em `calculadora-zeta-sooty.vercel.app` — fora deste repositório. |
| Deploy | Upload direto de arquivos estáticos. Checklist em `CLAUDE.md`. |

**Implicação prática nº 1:** qualquer mudança de navbar, CTA ou footer precisa ser replicada em ~20 arquivos HTML. Vale considerar um script de grep-replace (padrão de `scripts/update_navbar_logos.py`) em vez de edição manual.

**Implicação prática nº 2:** copy nova precisa entrar em `languages.js` (pt **e** en) ou o seletor de idioma quebra o texto.

---

## 3. Backlog priorizado

Legenda de verificação: ✅ confirmado no código · ⚠️ confirmado com escopo diferente do Notion · ❓ depende de verificação visual/decisão.

### 🔴 Alta prioridade

---

#### A1 — Consolidar a oferta em "Projeto de Investimento 4WaTT" 🔵 EM ANDAMENTO (2026-07-30)

**Onde:** [solucao-biogas.html:273-279](solucao-biogas.html#L273)

O `<select name="etapa">` oferece hoje, em pé de igualdade: *Estudo de viabilidade · Projeto básico · Projeto executivo · Supervisão de obra · Projeto completo (todas as etapas)*. O lead pode escolher só a viabilidade — exatamente a etapa que a IA comoditizou.

O botão de submit também reforça a etapa solta: `"Solicitar estudo de viabilidade"` (linha 279).

**O que queremos:**
- [x] Tornar "Projeto de Investimento 4WaTT" (viabilidade + projeto básico + modelagem financeira + Kit Bancário) a **opção padrão pré-selecionada**, não uma entre cinco
- [x] Manter as etapas individuais disponíveis, rebaixadas
- [x] Trocar o texto do botão de submit para refletir a oferta consolidada
- [x] Adicionar as chaves i18n novas em `languages.js` (pt/en)
- [x] Conferir se `apps-script/Code.gs` usa o campo `etapa` no scoring → **não usa**. Nem `Code.gs` nem `forms.js` leem `etapa`; o campo só é repassado. Sem impacto no backend.
- [x] Espelhar em `solucao-biometano.html` / `solucao-gaseificacao.html` → **não aplicável**: o campo `etapa` só existe em `solucao-biogas.html`.
- [ ] Adicionar 2-3 linhas de copy acima do formulário justificando o pacote consolidado ← **próximo passo**
- [ ] Alinhar a copy da seção CTA, que ainda diz "Solicitar estudo de viabilidade" (`sol_biogas_cta_title`, `sol_biogas_hero_cta_primary`, `cta_estudo` na navbar)

**Implementado em 2026-07-30:**

| Arquivo | Mudança |
|---|---|
| `solucao-biogas.html:273-280` | Select `#bg-etapa` reordenado; nova 1ª opção `Projeto de Investimento 4WaTT — recomendado` com `selected`; separador `disabled` "— ou contratar etapas isoladas —"; `<span class="form-hint">` com a composição do pacote; botão de submit → "Solicitar Projeto de Investimento" |
| `assets/js/languages.js` | Novas chaves pt/en: `sol_biogas_form_opt_projeto_investimento`, `sol_biogas_form_opt_etapa_sep`, `sol_biogas_form_hint_etapa`. Alteradas: `sol_biogas_form_label_etapa` ("Etapa desejada" → "O que você precisa"), `sol_biogas_form_submit` |
| `assets/css/theme-4watt.css:310` | Nova classe `.form-hint` (não existia classe de texto auxiliar de formulário no projeto) |
| 22 arquivos `.html` | Bump `theme-4watt.css?v=3.8→3.9` e `languages.js?v=1.9→2.0` |

**Decisão tomada durante a implementação:** as opções do select não tinham atributo `value` — o valor enviado ao Sheets era o texto visível, que **mudava conforme o idioma** (em EN o lead chegava como "Feasibility study"). Adicionei `value` explícito e estável a todas as opções (`projeto-investimento-4watt`, `estudo-viabilidade`, etc.). Verificado: o valor permanece o mesmo após troca PT↔EN.

**Ponto em aberto:** "Projeto completo (todas as etapas)" continua na lista de etapas isoladas. Ele não é sinônimo do Projeto de Investimento — inclui projeto executivo e supervisão de obra, mas não modelagem financeira nem Kit Bancário. Convive sem erro, mas pode confundir. **Decidir se mantém, renomeia ou remove.**

**Verificado no navegador** (`localhost:5501`, desktop 1280 e mobile 375): opção correta pré-selecionada, hint legível em 2 linhas (desktop) / 3 linhas (mobile), sem overflow horizontal, tradução PT↔EN aplicando em todos os elementos novos.

---

#### A2 — Responder à objeção "já perguntei pra uma IA" ✅

Nenhuma página do site diferencia a estimativa do simulador do dossiê que um banco aceita. Contradição de mensagem: o simulador é vendido como "com IA", mas o site não explica por que o resultado dele não substitui a engenharia.

**O que queremos:**
- [ ] Bloco pós-resultado do simulador: *"Isso é uma estimativa de mercado. O número que um banco aceita para liberar crédito é outro — veja o que muda no Projeto de Investimento."*
  - ⚠️ **Bloqueio:** o simulador é um app React em repositório separado (Vercel). Definir se a mensagem entra lá ou numa landing de destino pós-simulação neste repo.
- [ ] Item de FAQ em `solucao-biogas.html`, junto às perguntas existentes
- [ ] (ver O3) artigo de blog sobre o mesmo tema

---

#### A3 — Qualificar e pontuar o lead no formulário de contato ✅

**Onde:** [contato.html:92-122](contato.html#L92)

Formulário único e genérico: `nome`, `empresa`, `email`, `whatsapp`, `motivo` (gerador / investidor / comprar biometano / O&M / outro), `mensagem`. O `<select name="motivo">` já segmenta — é a base pronta para evoluir.

Já existe scoring **só para o fluxo de investidor** (`forms.js` + `Code.gs`: volume + palavras-chave → APTO/TRIAGEM/NAO_APTO). Falta o equivalente para o gerador de resíduo.

**O que queremos:**
- [ ] Adicionar as perguntas do Raio-X de Bancabilidade: volume/tipo de resíduo, caixa disponível vs. necessidade de financiamento, prazo desejado, se já tentou captar crédito
- [ ] Decidir: campos condicionais (só quando `motivo = gerador`) ou etapa pós-simulador
- [ ] Implementar a regra de score no `Code.gs` e definir o mínimo para agendamento automático
- [ ] Definir o destino de quem não atinge o score (nutrição por e-mail) — **depende de ferramenta de e-mail marketing definida**

---

#### A4 — Corrigir o link quebrado do simulador ⚠️ (escopo maior que o do Notion)

O Notion aponta apenas `/artigos/`. **A verificação no repo mostra que o problema é sistêmico:** `simulador.html` **não existe** na raiz, e é referenciado por:

| Arquivo | Linha |
|---|---|
| `snippets/navbar-premium.html` | 3, 4, 32 ← **fonte da propagação** |
| `404.html` | 364 |
| `500.html` | 364 |
| `artigos/index.html` | 508 |
| `biometano/index.html` | 1740 |
| `viabilidade/comprar-biometano.html` | 405 |

Enquanto isso, **13 páginas da raiz** já apontam corretamente para `calculadora-zeta-sooty.vercel.app` (`index`, `contato`, `investidor`, `academy`, `blog`, `noticias`, `partners`, `saas`, `score`, `politica-privacidade` e os 3 artigos).

Ou seja: a navbar canônica no snippet está desatualizada, e as páginas que foram geradas a partir dele herdaram o link morto. Nota: `CLAUDE.md:43` lista `simulador.html` como stub "em breve", mas o arquivo não está no repo — **a documentação está desatualizada nesse ponto.**

**O que queremos:**
- [x] Decidir o padrão único de URL do simulador → **`https://calculadora-zeta-sooty.vercel.app/`** (D1, 2026-07-30)
- [ ] Corrigir `snippets/navbar-premium.html` primeiro (é a fonte), inclusive os comentários das linhas 3-4
- [ ] Propagar para os 5 arquivos HTML afetados
- [ ] Corrigir `CLAUDE.md:43` (remover `simulador.html` da lista de stubs)
- [ ] Rodar `grep -rn "simulador.html"` ao final para confirmar zero ocorrências

---

### 🟡 Prioridade média

---

#### M5 — Números dos cases na home ⚠️ (dado já existe, só não aparece no card)

**Onde:** [index.html:459-497](index.html#L459)

Correção relevante ao apontamento do Notion: os números **já estão na home**, mas apenas dentro do modal (`data-case-stat`, lido por `assets/js/cases-modal-home.js`). Exemplo real do card CEASA:

- `data-case-stat="1.200 Nm³/dia de biogás dimensionados · RSU orgânico"` ← só no modal
- `.case-card__stat` (face do card) = `"Resíduo orgânico convertido em energia."` ← genérico

Não é preciso buscar dado em `solucao-biogas.html`. **É só promover o `data-case-stat` para a face do card** — mudança pequena, com i18n (`home_case1_stat`, `home_case2_stat`, `home_case3_stat`).

**O que queremos:**
- [ ] Trocar o texto de `.case-card__stat` pelo número real nos 3 cards (CEASA, Frigorífico Franca, Organo Buritis)
- [ ] Atualizar as chaves `home_caseN_stat` em `languages.js` (pt/en)
- [ ] Decidir se cada case ganha página própria com CAPEX, prazo e produção real vs. projetada (hoje o CTA do modal aponta para `contato.html`; o fallback no JS aponta para `/projetos/`, que não existe)

---

#### M6 — Comunicar que a entrada paga pode ser parcelada ✅

Nem `solucao-biogas.html` nem `contato.html` mencionam forma de pagamento. Sem preço fixo faz sentido, mas o princípio do funil é que o cliente **precisa ter caixa para a entrada** — vale evitar a perda de lead por achismo de "isso custa milhões".

**O que queremos:**
- [ ] Linha no FAQ de `solucao-biogas.html` sobre parcelamento — **texto exato depende de confirmação da política comercial (ver D2)**

---

#### M7 — Contadores animados ❓ (provável falso positivo, mas a melhoria vale)

Verificado: são count-ups JS legítimos, com valor real no atributo e `0` como texto inicial.

- [solucao-biogas.html:91-94](solucao-biogas.html#L91) — `data-counter="200"` +, `12`, `6`, `100%`
- [investidor.html:4008,4022](investidor.html#L4008) — `data-counter="200"`, `12`; e `2428`/`2438` (R$ 62.5 / 37.5%)

Não é bug de dado. Mas a informação de confiança depende de JS executar (bloqueador, conexão lenta, falha de script → o visitante lê "0 projetos entregues").

**O que queremos:**
- [ ] Renderizar o valor real como texto inicial no HTML (o count-up sobrescreve ao entrar em viewport), em vez de `0`
- [ ] Confirmar visualmente em navegador real, sem cache, com bloqueador ativo

---

#### M8 — Padronizar o link do simulador em todo o site ✅

Três padrões convivem hoje: `calculadora-zeta-sooty.vercel.app` (13 páginas), `simulador.html` inexistente (5 páginas + snippet) e âncora local `#cta` em `solucao-biogas.html`. Resolvido junto com A4, depois da decisão D1.

---

#### M9 — Categorias de blog sem artigo ✅

`artigos/index.html` tem filtros "Investimento" e "Cases & Engenharia" sem nenhum conteúdo publicado. Só há artigos em Tecnologia, Mercado e ESG & Carbono (3 no total).

**O que queremos:**
- [ ] Publicar 1-2 artigos em "Cases & Engenharia" com dado real de obra

---

### 🟢 Oportunidades

- **O1 — 4WaTT Academy:** hoje é stub "em breve" com lista de espera. Quando lançar, é o canal de Palestras/Comunidade do anel médio. Já vale linká-la nos artigos publicados.
- **O2 — 4WaTT Score sem página própria:** citado na Jornada da home ([index.html:417](index.html#L417)) como etapa de Diagnóstico. Existe `score.html`, mas como stub. É o elo entre a isca gratuita e o Projeto de Investimento pago — merece o mesmo tratamento de produto que o Simulador.
- **O3 — Artigo "por que uma resposta de IA sobre viabilidade não basta":** conteúdo de SEO/autoridade mais alinhado à estratégia, inexistente hoje. Casa com A2.

---

## 3b. Área do Investidor — realinhamento visual (2026-07-30)

Fora do escopo do Notion, a pedido do time: a Área do Investidor estava visualmente
destoante e feia. **Direção definida: seguir o padrão do `index.html` e das páginas de
solução** (sistema `t4`), não criar uma estética nova.

### Causa raiz encontrada

A página tinha um **design system paralelo, fora da marca**, sobrescrevendo o
`theme-4watt.css` com `!important` — e não era um detalhe de acabamento:

| Token da página | Valor que estava | Efeito real |
|---|---|---|
| `--brand-purple` | `#050505` | **todos os títulos pretos**, não roxos |
| `--brand-green` | `#00A089` | verde fora do teal da marca |
| `--color-roxo` | `#6a0dad` | roxo web genérico |
| `--bg-page` | `#ffffff` | branco puro no lugar do off-white `#F4F1EB` |

Somado a isso: `.text-muted/.text-dim { color:#000 !important }` (que apagava toda a
hierarquia tipográfica), corpo de texto em Montserrat 500 em vez de Inter, e uma pilha
de 6 folhas legadas — com `style.css` forçando `body { font-family: Montserrat !important }`
e `custom_v2.css` forçando `body { background:#3a0940 !important }`.

### O que foi feito

| Arquivo | Mudança |
|---|---|
| `investidor.html` (`:root` inline) | Os ~15 tokens legados foram **remapeados** para os tokens oficiais do tema em vez de reescrever ~2.400 linhas de CSS de componente |
| `investidor.html` (head) | **Tentativa revertida.** As 6 folhas legadas foram removidas e depois restauradas — ver "Erro cometido" abaixo. O que era nocivo nelas passou a ser neutralizado por um bloco `body.t4` com `!important` apontando para os tokens do tema |
| `investidor.html` (tipografia) | Títulos Montserrat/roxo, corpo Inter/`--dim`, `.overline` em Roboto Mono/teal — mesmo pareamento do index |
| `investidor.html` (120 declarações) | Cores cravadas (`#161616`, `#3a0940`, `#00A089`, `#111`) remapeadas para `var(--dim/--roxo/--teal-ink/--ink)` |
| `investidor.html` (botões) | `.btn-primary/.btn-secondary` (13 usos) reconstruídos sobre o desenho de botão do tema — tinham perdido o preenchimento junto com o CSS legado |
| `investidor.html` (`.invest-contact-shell`) | Gradiente ciano→roxo-web `#1fd6e2→#6a0dad` trocado pela paleta 4WaTT |
| `investidor.html` (estrutura) | `id` nas seções órfãs: `#numeros`, `#video-institucional`, `#prova-social`; título criado para a prova social, que não tinha nenhum |
| `assets/js/languages.js` | Copy revisada em **pt e en** + nova chave `inv_prova_title`; bump `?v=2.0→2.1` nos 22 HTMLs |
| `<head>` fontes | Passou a carregar Roboto Mono, que o tema usa nos kickers e que a página não carregava |

### Copy revisada

O padrão problemático era o título apenas repetir o kicker. Onde o kicker já rotula a
seção, o título passou a afirmar algo:

| Antes | Depois |
|---|---|
| `FAQ  Investidor` (com espaço duplo) | Dúvidas de quem está avaliando entrar. |
| Como funciona o processo | Do primeiro contato à construção, em 6 etapas. |
| Nossa abordagem à modelagem financeira | O modelo financeiro nasce da engenharia, não da planilha. |
| Gestão de riscos em projetos 4WaTT | Onde estão os riscos e como cada um é mitigado. |
| Bioengenharia de Biogás e Biometano | A engenharia por trás dos projetos. |
| …ticket e estágio sem ruído | …ticket e estágio — sem ruído. |

### ⚠️ Erro cometido nesta frente — ler antes de mexer no `<head>`

As 6 folhas legadas foram removidas do `<head>` por parecerem inertes. **Não são.**
`cinematic-home.css` carrega todo o layout do hero (`.hero-content`, `.hero-content__inner`,
`.hero-h1`). Sem ela o hero perdeu `max-width` e padding, o título encostou na borda
esquerda e vazou para fora da tela em viewports largos.

O teste que levou à conclusão errada comparava **apenas a altura das seções** ao desativar
cada folha. As alturas praticamente não mudaram (≤121px), então concluí que as folhas eram
dispensáveis. Altura não detecta perda de centralização, de `max-width` nem de padding
horizontal — e a auditoria seguinte só mediu contraste de cor, nunca posição ou visibilidade.
Resultado: foi reportado "0 falhas" numa página com o hero quebrado.

**Lição para as próximas mudanças de CSS aqui:** verificar sempre (a) posição e largura dos
contêineres, (b) se algum texto sai da viewport, (c) opacidade/visibilidade dos `.reveal` —
e não confiar em altura de seção como prova de que nada quebrou. Melhor ainda: olhar a
página de verdade.

### Verificado no navegador (1280, 2000×1200 e 375×812)

- Layout do hero: `.hero-content__inner` com `max-width:800px` e centralizado —
  conferido a 1280px e a 2000px de largura.
- Conteúdo visível nas 14 seções: nenhum elemento oculto indevidamente, **nenhum texto
  fora da viewport**, sem scroll horizontal.
- Auditoria de contraste em todos os elementos de texto: 0 falhas reais
  (os 2 alertas restantes são texto com gradiente, falso positivo do script).
- Troca PT↔EN aplicando em todos os 14 títulos, sem string órfã.
- Fundo `#F4F1EB`, corpo Inter, títulos Montserrat/roxo.

**Ainda assim: nenhuma verificação visual foi possível** — o painel do navegador não
renderiza frames nesta sessão, então não houve um único screenshot. Toda a validação
acima é medição de DOM.

### Pendências desta frente

- [ ] **Ver com olho humano.** Toda a validação foi por medição de DOM e contraste: o
      painel do navegador não renderiza frames nesta sessão, então **nenhum screenshot
      foi possível**. A avaliação estética final continua em aberto.
- [ ] Seção `#numeros`: os cartões KPI têm gradiente escuro próprio sobre seção clara.
      Funciona, mas vale decidir se é o tratamento desejado.
- [ ] `.market-card` estoura 16px da viewport no mobile (contido por `overflow-x:hidden`,
      sem scroll lateral). Pré-existente.
- [ ] A página ainda tem ~2.400 linhas de CSS inline em 6 blocos `<style>`. O ideal é
      extrair para `assets/css/investidor.css`, como as outras páginas fazem.
- [ ] Nomes de classe legados (`.btn-primary` vs `.btn--primary` do resto do site)
      continuam divergentes. Unificar em algum momento.

---

## 4. Decisões pendentes (bloqueiam implementação)

| # | Decisão | Bloqueia | Quem decide |
|---|---|---|---|
| ~~**D1**~~ | ~~Domínio do simulador~~ → **RESOLVIDA (2026-07-30): continua em `calculadora-zeta-sooty.vercel.app`.** A4/M8 devem padronizar tudo para essa URL. | — | ✅ |
| **D2** | Política comercial de parcelamento da entrada — texto publicável? | M6 | Comercial |
| ~~**D3**~~ | ~~Nome e composição do pacote~~ → **RESOLVIDA (2026-07-30): "Projeto de Investimento 4WaTT" = viabilidade + projeto básico + modelagem financeira + Kit Bancário.** | — | ✅ |
| **D4** | Score mínimo para agendamento automático e destino dos leads abaixo do corte (qual ferramenta de nutrição?) | A3 | Comercial / Marketing |
| **D5** | A mensagem anti-IA entra no app React do simulador (outro repo) ou numa landing pós-simulação neste repo? | A2 | Time |
| **D6** | Cada case ganha página própria ou continua só no modal? | M5 | Marketing |

---

## 5. Ordem de execução sugerida

Agrupada por custo e por dependência de decisão:

**Onda 1 — quick wins, sem bloqueio** (D1 resolvida, nada trava)
1. A4 + M8 — corrigir e padronizar o link do simulador para a URL do Vercel
2. M5 — promover os números dos cases para a face do card
3. M7 — valor real no HTML dos contadores
4. Corrigir `CLAUDE.md:43`

**Onda 2 — copy e oferta** *(depende de D2, D3)*
5. A1 — consolidar a oferta no formulário de `solucao-biogas.html`
6. A2 (parte FAQ) — bloco anti-IA em `solucao-biogas.html`
7. M6 — linha de parcelamento no FAQ

**Onda 3 — qualificação e backend** *(depende de D4)*
8. A3 — Raio-X de Bancabilidade + scoring no `Code.gs`
   - lembrar: mudança em `Code.gs` **só vale após novo deploy no console do Apps Script**

**Onda 4 — conteúdo e produto** *(depende de D5, D6)*
9. A2 (parte simulador) — mensagem pós-resultado
10. O3 + M9 — artigos novos
11. O2 — página de produto do 4WaTT Score
12. M5 (extensão) / D6 — páginas por case

---

## 6. Cuidados obrigatórios em qualquer alteração

Extraídos de `CLAUDE.md` e confirmados no repo:

- [ ] Toda copy nova precisa de chave em `assets/js/languages.js` — **pt e en**
- [ ] Mudança de navbar/CTA/footer precisa ser replicada em todos os HTMLs (usar script, não mão)
- [ ] Bumpar `?v=X.X` nos `<link>`/`<script>` de CSS/JS alterados
- [ ] Editar em `assets/` — nunca em `css/`, `js/`, `images/` (vendor legado)
- [ ] Editar o arquivo original — nunca `*.html.bak` nem `assets/pages/`
- [ ] `apps-script/Code.gs` exige deploy manual de nova versão para ter efeito
- [ ] `sitemap.xml` está desatualizado — atualizar se páginas forem criadas
- [ ] Trabalhar em branch, nunca commitar direto em `main` (repo compartilhado com o time)

---

## 7. Divergências entre o Notion e o código (para atualizar a tarefa)

1. **Gap 4 (link quebrado)** — não é só `/artigos/`. São 5 páginas + o snippet canônico `navbar-premium.html`, que é a origem da propagação. `simulador.html` não existe no repositório.
2. **Gap 5 (cases sem número)** — os números **já existem na home**, dentro do modal (`data-case-stat`). O ajuste é bem menor do que o descrito: promover o dado para a face do card.
3. **Gap 7 (contadores zerados)** — confirmado como falso positivo de leitura estática. Os valores reais estão em `data-counter`. A melhoria de resiliência continua válida.
4. **`CLAUDE.md:43`** lista `simulador.html` como stub existente — está desatualizado.

---

## 8. Dívida técnica encontrada no mapeamento de arquitetura (2026-08-05)

Levantada ao construir a skill `site-4watt`. Reproduzível com
`python .claude/skills/site-4watt/scripts/auditar.py`.

### 🔴 Corrigir

- [ ] **4 chaves i18n órfãs** — usadas no HTML sem definição em `languages.js`.
      Funcionam em PT pela brecha do `if (dict[key])`, mas **ficam em português no
      site em inglês**:
      `inv_nav_inicio` (investidor.html) · `bm_vol_centro_icon`,
      `bm_vol_sudeste_icon`, `bm_vol_future_icon` (biometano/index.html)
- [ ] **`solucoes.css` com duas versões** — `?v=2.1` em `academy`, `solucao-biogas` e
      `solucao-gaseificacao`; `?v=2.2` em `solucao-biometano`. Cache inconsistente.
- [ ] **`simulador.html` continua quebrado** em 5 páginas + no snippet da navbar
      (mesmo item A4, ainda aberto).

### 🟡 Avaliar

- [ ] **291 chaves mortas** em `languages.js` — 20% do dicionário, nunca usadas em
      nenhum HTML. O arquivo tem **293 KB e é carregado nas 23 páginas**, sem code
      splitting. É o maior asset do site.
- [ ] **5 idiomas pela metade** — `es`, `it`, `fr`, `de`, `no` têm ~20% de cobertura e
      **não estão expostos no seletor** (só PT/EN). Ou completar, ou remover.
      Se remover, tirar junto `EXTENDED_LANGS` e `loadExtendedTranslations` de
      `main.js`, que tentam carregar o inexistente `languages-extended.js`.
- [ ] **`investidor-projetos.html`**: 5.747 linhas, com **3.379 em `<style>` inline**.
      Extrair para `assets/css/`.
- [ ] **Arquivos mortos**: `assets/css/investidor-skin.css` e
      `assets/js/languages-core.js` não são carregados por nenhuma página.
- [ ] **`AGENTS.md`** (raiz) descreve a arquitetura anterior a esta reorganização.
      Ou atualizar, ou apontar para a skill.
