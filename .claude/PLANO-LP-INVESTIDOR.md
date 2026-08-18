# Plano — Landing page do Investidor

> 📐 **Arquitetura e regras de edição:** skill **`site-4watt`**
> (`.claude/skills/site-4watt/`).
>
> **Status:** ✅ **IMPLEMENTADO em 2026-08-02.** Ver seção 7 para o resultado e os desvios.
> **Pedido:** transformar `investidor copy.html` (hoje uma cópia do `index.html`) em landing
> page do investidor, **mantendo o layout da home** e trazendo o **conteúdo do `investidor.html`**.
> **Data:** 2026-08-02

---

## 1. Ponto de partida

`investidor copy.html` é o `index.html` com apenas duas linhas diferentes (`<title>` e
meta description). O layout da home está intacto, com 9 blocos + footer, apoiado em
`assets/css/home-premium.css?v=3.4` e `assets/js/cases-modal-home.js`.

Fato favorável: **os blocos da home batem quase um a um com o conteúdo do investidor,
inclusive na contagem de itens.** Três encaixes são exatos (4↔4, 4↔4, 6↔6), o que
significa pouca deformação do layout.

Segundo fato favorável: já existem **510 chaves `inv_*`** em `assets/js/languages.js`.
A LP reaproveita quase toda a tradução pronta, em pt e en.

---

## 2. Decisões tomadas (2026-08-02)

| # | Decisão |
|---|---|
| D1 | **Marketplace fica fora da LP**, com CTA apontando para a página completa |
| D2 | **A LP substitui o `investidor.html`** como Área do Investidor |
| D3 | **Formulário completo é portado**, com o scoring do Apps Script |
| D4 | Dos extras, entra **apenas o FAQ**. Ficam de fora vídeo institucional e mapa/linha do tempo |

### ⚠️ Conflito entre D1 e D2 — e como foi resolvido

D1 pede um CTA apontando para o marketplace; D2 diz que a LP substitui a página onde o
marketplace vive. Literalmente, as duas juntas eliminariam o marketplace do site.

Somado a isso: **24 páginas e o `sitemap.xml` apontam para `investidor.html`** (32
ocorrências). Trocar esse arquivo por uma LP sem marketplace quebraria o destino de todos
esses links e perderia o histórico de SEO da URL.

**Resolução proposta:**

- A LP assume o nome **`investidor.html`** → os 32 links e o sitemap continuam válidos,
  e a Área do Investidor passa a ser a LP, como pedido em D2.
- A página atual é renomeada para **`investidor-projetos.html`**, preservada como destino
  do marketplace, do modal de NDA e do restante do conteúdo profundo.
- O CTA de D1 aponta para `investidor-projetos.html#marketplace`.

Assim D2 é cumprida (a LP é a Área do Investidor) sem descartar o marketplace, que D1
pressupõe existir. **Se a intenção era realmente descartar o marketplace, me avise —
o plano muda.**

---

## 3. Mapa de conteúdo

Cada bloco do layout da home recebe o conteúdo correspondente do investidor. As classes
CSS do `home-premium.css` são **preservadas**; só o conteúdo interno muda.

| # | Bloco do layout | Conteúdo do investidor | Origem | Encaixe |
|---|---|---|---|---|
| 1 | `hero-h` (kicker, h1, 2 botões) | "Investir em Bioenergia" · TIR 18–28% a.a. · 2 CTAs | `#hero-scene` | exato |
| 2 | `prova` (4 pilares numerados) | Metodologia financeira: biomassa, DCF, sensibilidade, CAPEX/OPEX | `#metodologia-financeira` | **exato 4↔4** |
| 3 | `manifesto` (faixa escura, citação) | Tese de investimento — ANP 854/2021, demanda estrutural | `#tese-investimento` | exato |
| 4 | `ecossistema` (linhas numeradas) | Gestão de riscos: técnicos, regulatórios, operacionais | `#risk-management` | 5 slots → 3 |
| 5 | `matriz` (cards imagem + métrica) | Verticais: Biodigestor Industrial, Gaseificação RSU, Upgrading | `#portfolio-projetos` | 6 slots → 3 |
| 6 | `engenharia` (4 itens + imagens) | Modelo 4WaTT: Origem do Resíduo → Planta → Biogás → Biometano | `#modelo-4watt` | **exato 4↔4** |
| 7 | `jornada` (6 passos) | Processo de investimento, 6 etapas | `#processo-investimento` | **exato 6↔6** |
| 8 | `autoridade` (3 cards + números) | Prova social + KPIs: 200+ projetos, 6 estados, 12 anos | `#numeros` | exato |
| 9 | *(bloco novo)* | FAQ do investidor (accordion) | `#faq` | criar |
| 10 | `contato-cta` (3 "portas") | Formulário do investidor com scoring + CTA para o marketplace | `#form-investidor-section` | adaptar |

**Blocos deliberadamente fora da LP:** marketplace (fica em `investidor-projetos.html`),
vídeo institucional e mapa/linha do tempo.

---

## 4. Etapas de execução

### Etapa 1 — Arquivos e URLs
1. `investidor.html` → renomear para `investidor-projetos.html`
2. `investidor copy.html` → renomear para `investidor.html`
   *(o nome atual tem espaço, o que quebra a URL)*
3. Ajustar `<title>`, meta description e canonical da LP
4. Conferir os 32 links para `investidor.html` — como a URL é preservada, a expectativa é
   **zero alterações**; os que devem apontar para o marketplace passam a usar o novo nome
5. Atualizar `sitemap.xml` com as duas URLs

### Etapa 2 — Conteúdo, bloco a bloco
6. Substituir o conteúdo dos blocos 1 a 8 conforme a tabela, mantendo as classes intactas
7. Reduzir a contagem de itens em `ecossistema` (5→3) e `matriz` (6→3)
8. Criar o bloco de FAQ antes do CTA final
9. Portar o formulário com scoring, incluindo `window.__INVESTOR_AUTOMATION_ENDPOINT`
10. Adicionar o CTA "Ver projetos disponíveis" → `investidor-projetos.html#marketplace`

### Etapa 3 — Suporte
11. Reaproveitar as chaves `inv_*` existentes; criar apenas as que faltarem, em **pt e en**
12. Ajustar os `<script>`: a LP não precisa do JS de marketplace/modal; precisa de `forms.js`
13. Bump de `?v=` nos assets alterados

### Etapa 4 — Verificação
14. **Posição e largura dos contêineres** em 1280px, 2000px e 375px
15. Nenhum texto fora da viewport; sem scroll horizontal
16. Contraste de todos os textos
17. Troca PT↔EN sem string órfã
18. Envio do formulário chegando ao Apps Script
19. Console sem erros

> A etapa 14 existe porque, no realinhamento do `investidor.html` (ver
> `PLANO-MUDANCAS-SITE.md`, seção 3b), a verificação mediu só cor e altura e deixou passar
> um hero quebrado. Altura de seção não prova que o layout está de pé.

---

## 5. Riscos

| Risco | Mitigação |
|---|---|
| Renomear `investidor.html` quebra links externos e indexação já existente | A LP **assume** a URL antiga; quem muda de nome é a página profunda, que hoje não é linkada de fora |
| O layout da home foi desenhado para conteúdo institucional; texto do investidor é mais denso | Reduzir contagem de itens onde necessário e revisar comprimento de copy por bloco |
| Formulário com scoring depende do Apps Script | Portar `window.__INVESTOR_AUTOMATION_ENDPOINT` junto e testar o envio de ponta a ponta |
| Perda de conteúdo ao enxugar | Nada é apagado: `investidor-projetos.html` preserva a página completa |

---

## 6. Fora de escopo

- Rewrite do CSS: a LP usa `home-premium.css` como está
- Alterações no `index.html`
- Limpeza das ~2.400 linhas de CSS inline de `investidor-projetos.html`
  (segue como pendência em `PLANO-MUDANCAS-SITE.md`)

---

## 7. Execução (2026-08-02)

### Arquivos

| Antes | Depois |
|---|---|
| `investidor.html` (página completa, 5.746 linhas) | `investidor-projetos.html` — guarda marketplace, modal de NDA e conteúdo profundo |
| `investidor copy.html` (cópia do index) | `investidor.html` — a landing page, **assumindo a URL original** |

Os 32 links internos e o `sitemap.xml` continuaram válidos sem edição, exatamente como
previsto. O sitemap ganhou a entrada nova de `investidor-projetos.html`, e o `<title>` /
canonical da página de projetos foram diferenciados para as duas não competirem no índice.

### Blocos entregues

Os 10 blocos da tabela da seção 3, todos com as classes do `home-premium.css` preservadas.

### Desvios do plano

1. **Metodologia tinha 6 etapas, não 4.** O plano previa encaixe exato em 4 pilares.
   Em vez de descartar duas, a `pillar-list` foi estendida para 6 — nenhum conteúdo perdido.
2. **Modelo 4WaTT tinha 5 etapas, não 4.** Mesma solução: `machine__list` com 5 itens.
3. **`matriz` reduzida a 3 cards de span 2** (não 6). Na primeira tentativa usei
   `feed--w` (span 4) + 2× `feed--md`, o que deixava metade da segunda linha vazia num
   grid de 6 colunas. Corrigido para 3 × span 2 = uma linha cheia e uniforme.
4. **Acentos das linhas de risco** trocados de `--teal`/`--gold` para `--teal-ink`/`--gold-ink`.
   As tags herdam `--row-accent` e, em mono uppercase de 10,5px sobre fundo claro, o gold
   puro dava contraste de 1,91. O tema já oferece as variantes `-ink` para esse caso.
5. **`languages.js` tem 7 idiomas, não 2** (pt, en, es, it, fr, de, no). A primeira
   inserção de chaves caiu fora dos blocos e quebrou a sintaxe do arquivo; foi refeita
   inserindo no topo de `pt: {` e `en: {`. As 68 chaves novas entraram só em pt e en —
   os outros 5 idiomas caem no texto do HTML, que é o comportamento que já existia.

### Verificação

Feita a 1280×720, 1440×900 e 375×812:

- **Layout:** 10 seções renderizando, containers posicionados, **nenhum texto fora da
  viewport**, sem scroll horizontal em nenhuma das três larguras.
- **i18n:** 172 chaves usadas, **todas resolvem em pt e en**. Na troca de idioma, 166
  elementos mudam; os 7 que permanecem iguais são nomes próprios (CEASA, Franca, WhatsApp).
- **Contraste:** as falhas restantes são texto branco sobre vídeo (hero) e sobre imagem
  (cards de vertical) — o script não lê vídeo nem imagem de fundo. Mesmo comportamento
  do `index.html`.
- **Formulário:** `forms.js` carregado, validação bloqueando submit vazio e marcando os
  3 campos obrigatórios, ambos os endpoints presentes e `volume_interesse` com os mesmos
  valores que o scoring do Apps Script espera (`ate-5mi` … `acima-50mi`).
- **Console:** sem erros nas duas páginas.
- **Links:** nenhum link quebrado envolvendo a renomeação. Os 11 que o auditor apontou
  são pré-existentes (`simulador.html`, item A4 do outro plano) ou falso-positivo de
  caminho raiz.
- **Página de projetos:** marketplace, 4 cards e modal de NDA íntegros após a renomeação.

**Não verificado visualmente:** o painel do navegador não renderiza frames nesta sessão,
então nenhum screenshot foi possível. Toda a validação acima é medição de DOM.

### Pendências

- [ ] Abrir as duas páginas e avaliar o resultado visual.
- [ ] `.feed__desc` das verticais só aparece no hover (comportamento original do layout
      da home; no mobile fica sempre visível). Os números de TIR e ticket, em
      `.feed__metric`, aparecem sempre. Decidir se numa LP de investidor a descrição
      deveria ser sempre visível.
- [ ] Testar o envio real do formulário de ponta a ponta (chegada no Sheets e alerta
      de lead APTO). Só a validação de front foi verificada.
- [ ] Configurar redirect de `investidor/` (canonical antigo da página de projetos)
      caso essa URL esteja indexada.
- [ ] As 68 chaves novas não existem em es/it/fr/de/no.
