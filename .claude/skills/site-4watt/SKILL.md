---
name: site-4watt
description: Arquitetura e regras de edição do site estático da 4WaTT (4watt.tech). Use SEMPRE que for editar qualquer conteúdo, texto, copy, CSS, estrutura das páginas HTML, ou SEO/GEO (robots.txt, llms.txt, sitemap.xml, Open Graph, canonical, JSON-LD) deste repositório — inclusive quando o pedido parecer trivial ("troca esse título", "muda o número da TIR", "ajusta esse texto", "adiciona meta tag"). Explica por que editar o texto direto no HTML NÃO funciona (o dicionário languages.js sobrescreve tudo em tempo de execução), qual é o caminho correto para cada tipo de alteração, onde mora o CSS de cada página, o que manter sincronizado para não regredir SEO/GEO/citação por LLMs, e como verificar que nada quebrou.
---

# Site 4WaTT — arquitetura de edição

Site estático multipágina, **sem build**. Editar HTML/CSS/JS direto e recarregar.

```bash
python -m http.server 5501
```

Abrir sempre por `http://localhost:5501/pagina.html`. **Nunca por duplo clique
(`file://`)** — algumas páginas usam caminhos absolutos (`/assets/js/...`) que só
resolvem servidos pela raiz.

---

## ⚠️ A regra número 1

**O texto que aparece na tela NÃO vem do HTML. Vem de `assets/js/languages.js`.**

Todo elemento com `data-i18n` tem o `innerHTML` **substituído** assim que a página
carrega. Isso acontece em `main.js`:

```js
// main.js:592 — roda em TODO DOMContentLoaded, mesmo sem trocar de idioma
const savedLang = localStorage.getItem('preferredLang') || 'pt';
applyTranslations(savedLang);

// main.js:127 — o texto do HTML é descartado
document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (dict[key]) { element.innerHTML = dict[key]; }   // ← sobrescreve
});
```

Consequência prática, e a fonte de quase toda confusão neste repo:

| O que você edita | Funciona? |
|---|---|
| Texto de elemento **com** `data-i18n` | ❌ Não. É sobrescrito no load. |
| Texto de elemento **sem** `data-i18n` | ✅ Sim. |
| `href`, `src`, `class`, `style` | ✅ Sim. i18n não toca em atributos. |
| Adicionar/remover elementos | ✅ Sim. |

É por isso que uma edição "meio funciona": trocar o link de um botão pega na hora,
trocar o texto dele não pega. Se você vir esse sintoma, é i18n.

### A brecha: `if (dict[key])`

A verificação `if (dict[key])` significa que **chave inexistente ou vazia deixa o
texto do HTML intacto**. Isso te dá duas saídas legítimas:

- quer o texto fixo no HTML? **remova o atributo `data-i18n`** do elemento;
- criou um elemento novo sem chave? funciona em PT por acidente — **mas fica em
  português no site em inglês**. Sempre crie a chave.

---

## Como alterar um texto — árvore de decisão

```
O elemento tem data-i18n?
├── NÃO  → edite o HTML. Pronto.
└── SIM  → o texto vive em languages.js
     ├── deve continuar traduzível?
     │    └── SIM → edite a chave em languages.js, nos blocos pt E en
     │              (e atualize o texto do HTML junto, para bater)
     └── NÃO, é texto fixo (nome próprio, código, número de contrato)
          └── remova o atributo data-i18n e edite o HTML
```

**Ao editar `languages.js`, os blocos `pt` e `en` são obrigatórios.** Deixar só em
`pt` faz o site em inglês exibir português.

Isso vale também em `languages-pages.js` — que tem seus próprios blocos `pt`/`en`
(complemento para blog/artigos/imprensa). **Nunca crie chaves em
`languages-core.js`**: esse arquivo existe no repo mas não é carregado por nenhuma
página — é código morto, editar ali não tem efeito nenhum.

Depois de mexer em `languages.js`, **suba a versão** em todas as páginas:

```bash
find . -name "*.html" -not -name "*.bak*" -print0 | xargs -0 sed -i 's/languages\.js?v=2\.3/languages.js?v=2.4/g'
```

---

## Os 6 atributos de tradução

Todos implementados em `main.js`. Só `data-i18n` mexe em conteúdo; os outros em atributos.

| Atributo | O que altera |
|---|---|
| `data-i18n` | `innerHTML` (aceita `<br>`, `<em>`, `<strong>`) |
| `data-i18n-placeholder` | `placeholder` de input/textarea |
| `data-i18n-title` | `title` |
| `data-i18n-alt` | `alt` de imagem |
| `data-i18n-aria-label` | `aria-label` |
| `data-i18n-content` | `content` de `<meta>` |

**`<title>` e `<meta name="description">` não são traduzidos** a menos que tenham
`data-i18n` / `data-i18n-content` explícito. Na prática quase nenhuma página tem —
então esse texto vive só no HTML.

---

## Onde mora o CSS

Não existe um lugar único. Antes de mexer em estilo, descubra qual arquivo controla
o componente:

```bash
grep -rn "\.nome-da-classe" assets/css/*.css
```

| Página | Folha que controla o layout |
|---|---|
| `index.html`, `investidor.html` | `home-premium.css` ← **compartilhada, mexer afeta as duas** |
| `solucao-*.html`, `academy.html` | `solucoes.css` |
| `contato.html` | `contato.css` |
| `investidor-projetos.html` | pilha legada + ~3.400 linhas de `<style>` inline |
| `biometano/`, `artigos/`, `blog`, `noticias` | pilha legada (`style.css`, `custom_v2.css`, `design-system.css`, `components.css`, `legacy-bridge.css`) |
| Todas | `theme-4watt.css` (tokens da marca) + `mobile-fixes.css` (último) |

Blocos `<style>` inline no HTML **não contêm o CSS das seções principais** — em
`investidor.html`, por exemplo, o inline só tem `.lp-faq__*` e `.lp-form*`; todo o
hero está em `home-premium.css`.

Ao alterar um `.css`, **suba o `?v=`** nas páginas que o carregam, senão o navegador
serve cache.

### Tokens da marca (`theme-4watt.css`)

`--roxo #3A0940` · `--teal #03A589` · `--gold #DBAA0F` · `--plum #2A0720`
`--bg #F4F1EB` (off-white quente) · `--ink` · `--dim` · `--muted`

Para **texto pequeno sobre fundo claro** use as variantes legíveis `--teal-ink` e
`--gold-ink`. O gold puro em texto dá contraste ~1,9 e é ilegível.

Nunca cravar hex no HTML ou no CSS — sempre `var(--token)`.

---

## Carrossel padrão: marquee arrastável (`data-marquee`)

Todo carrossel do site — logos de parceiros, cases da home, galerias do case CEASA —
usa o **mesmo motor**, escrito uma vez em `assets/js/site-premium.js`
(`initDraggableMarquee` / `initMarquees()`, chamado em todo `DOMContentLoaded`).
**Não reimplemente com `animation: ... infinite` do zero.** Esse foi o primeiro
formato usado (carrossel de cases da home e os dois do case CEASA, 2026-08-14) e foi
substituído porque:

- `animation-play-state: paused` no `:hover` só *pausa* — o usuário não consegue
  voltar pra ver um card que passou rápido demais, só esperar ele passar de novo.
- Rolagem automática pura não é toque-arrastável em mobile.

O motor atual usa `overflow-x: auto` de verdade (então funciona nativamente no touch)
e incrementa `scrollLeft` via `requestAnimationFrame` quando ninguém está mexendo.

### Como montar um carrossel novo

1. **Duplique a esteira uma vez** (2× o mesmo conjunto de itens) para o loop fechar
   sem costura. Nos itens duplicados: tire atributos interativos únicos (ex.:
   `data-case-title`, IDs), mantenha `data-i18n` (ainda precisa traduzir), e marque
   o item com `aria-hidden="true"`.
2. Envolva a esteira:
   ```html
   <div class="minha-secao-marquee" data-marquee data-marquee-speed="0.5">
     <div class="minha-secao-marquee__track"> ...itens ×2... </div>
   </div>
   ```
   `data-marquee-speed` é opcional (padrão `0.55`px/frame) — use algo menor em
   carrosséis com cards maiores/mais densos (o de "Entregas" do case CEASA usa
   `0.35`; o de cases da home usa `0.6`).
3. CSS do wrapper: `overflow-x: auto; overflow-y: hidden; scrollbar-width: none;
   cursor: grab;` + `::-webkit-scrollbar { display: none; }` (some com a barra de
   rolagem visível) + `mask-image` nas bordas se quiser o fade lateral.
   CSS do track: `display: flex; gap: ...px; width: max-content; user-select: none;`.
   Exemplos reais pra copiar: `.cases-marquee`/`.cases-marquee__track` em
   `home-premium.css`; `.cc-marquee`/`.cc-marquee__track` em `case-ceasa.css`.
4. **Não escreva JS novo.** `[data-marquee]` já é pego automaticamente por
   `initMarquees()`.
5. Se um item clicável (card que abre modal, por exemplo) tiver um link/botão que
   deve navegar direto, sem passar pelo clique do card:
   `<a href="..." onclick="event.stopPropagation()">`. Sem isso o clique também
   dispara o listener do card pai.

### Armadilha corrigida: `setPointerCapture` sequestrando cliques

A primeira versão do motor arrastável chamava `wrapper.setPointerCapture(...)` em
**todo** `pointerdown`, inclusive um clique parado. Isso quebrava clique em
botões/links dentro do card (caso real: o botão "Ver case completo" no card CEASA da
home parou de navegar). A correção foi um **limiar de movimento de 6px**: só vira
"arraste" (e só aí chama `setPointerCapture`) depois que o ponteiro se move além
disso; um clique sem deslocamento passa direto pro elemento clicado, sem interferência.
Essa lógica já está em `initDraggableMarquee` — não precisa reaplicar, só não regredir
se for tocar nessa função.

`site-premium.js` é carregado por **todas** as páginas — se editar
`initDraggableMarquee`/`initMarquees`, suba o `?v=` dele em todas, como qualquer JS
compartilhado (armadilha #3 acima).

---

## Navbar e footer são duplicados em 24 arquivos

Não há templating. Qualquer mudança de menu, CTA ou rodapé precisa ser replicada.
Use `sed` em vez de editar à mão:

```bash
find . -name "*.html" -not -name "*.bak*" -print0 | xargs -0 sed -i 's/TEXTO_ANTIGO/TEXTO_NOVO/g'
```

`snippets/navbar-premium.html` é a referência canônica — **atualize-a junto**, senão
ela propaga markup velho para páginas novas.

---

## SEO/GEO e llms.txt — não regredir o que já está implementado

O site tem `robots.txt`, `llms.txt`, `sitemap.xml`, Open Graph, canonical e JSON-LD
implementados (agosto/2026). **Toda página nova ou editada precisa manter isso.**
Regra rápida:

- Página indexável nova → canonical + OG/Twitter Card no `<head>` + entrada em
  `sitemap.xml` com `lastmod` real (nunca `new Date()`).
- Página stub/institucional → `noindex, follow` no `<head>` **e** fora do
  `sitemap.xml`. As duas coisas juntas — nunca só uma.
- FAQ de página de solução (`sol_*_faq_*` em `languages.js`) tem uma cópia literal
  no JSON-LD `FAQPage` da mesma página HTML. **Editar a chave sem editar o JSON-LD
  correspondente deixa o schema estruturado divergente do texto visível.**
- CTA do simulador é sempre a URL externa
  `https://calculadora-zeta-sooty.vercel.app/` com `target="_blank"
  rel="noopener noreferrer"` — nunca `simulador.html`.

Detalhes, templates e o porquê de cada regra: `references/seo-geo.md`.

---

## Verificação obrigatória antes de dar por pronto

Rode o auditor:

```bash
python .claude/skills/site-4watt/scripts/auditar.py
```

Ele checa chaves órfãs, chaves faltando em `en`, links internos quebrados e versões
de asset inconsistentes.

Depois, **abra no navegador e confira**. Medir só cor e altura de seção não prova
que a página está de pé — já houve caso de hero quebrado passar por uma verificação
que só olhava contraste. Confira sempre:

1. **Posição e largura** dos contêineres (centralização, `max-width`)
2. Nenhum texto **fora da viewport**; sem scroll horizontal
3. Em **1280px e 375px** no mínimo
4. Troca **PT↔EN** sem sobrar string em português
5. **Console sem erros**

---

## Formulários

Envio duplo em todo submit, via `forms.js`:

1. **Google Apps Script** — `GLOBAL_SHEETS_ENDPOINT` (`forms.js:13`), sobrescrito por
   `window.__INVESTOR_AUTOMATION_ENDPOINT` quando a página define. Faz o scoring do
   lead (`APTO` / `TRIAGEM` / `NAO_APTO`) e grava no Sheets.
2. **Formspree** — `data-endpoint` do `<form>`, ou `DEFAULT_ENDPOINT`.

O scoring lê o campo **`volume_interesse`**. Se mudar os `value` das opções
(`ate-5mi`, `5-20mi`, `20-50mi`, `acima-50mi`), o scoring quebra silenciosamente.

Editar `apps-script/Code.gs` **não tem efeito** até publicar nova versão no console
do Apps Script.

---

## Referências

- `references/i18n.md` — contrato completo do i18n, os 7 idiomas, chaves mortas
- `references/arquitetura.md` — inventário página a página, cascata de CSS, JS morto
- `references/seo-geo.md` — robots.txt/llms.txt/sitemap/OG/JSON-LD: o que manter
  atualizado em página nova ou editada
- `scripts/auditar.py` — auditoria automática (i18n, links, versões — **não** cobre
  SEO/OG/canonical/sitemap, essa parte é checklist manual em `seo-geo.md`)

## Armadilhas conhecidas

1. **`data-i18n` sobrescreve texto** — a regra nº 1 acima.
2. **`home-premium.css` é compartilhada** por `index.html` e `investidor.html`.
3. **Cache de asset** — mexeu em css/js, suba o `?v=`.
4. **`file://` quebra** caminhos absolutos. Use o servidor local.
5. **Apps Script** exige deploy manual.
6. **Idiomas extras** (`es`, `it`, `fr`, `de`, `no`) têm só ~20% de cobertura e não
   estão expostos na UI — o seletor só mostra PT/EN.
7. **`languages-extended.js` não existe**, mas `main.js` tenta carregá-lo se um
   idioma de `EXTENDED_LANGS` faltar em `languages.js`. Hoje não quebra porque todos
   estão lá. Não remova os blocos `es/it/fr/de/no`.
8. **`languages-core.js` existe mas não é carregado por nenhuma página** — código
   morto. Diferente de `languages-extended.js` (não existe no disco),
   `languages-core.js` existe e engana: parece um lugar válido para adicionar
   chaves, mas nenhum HTML tem `<script src="assets/js/languages-core.js">`.
9. **`simulador.html` não existe** — o simulador real é externo:
   `https://calculadora-zeta-sooty.vercel.app/`, sempre com `target="_blank"
   rel="noopener noreferrer"`. Já corrigido nas páginas ativas e no snippet da
   navbar (2026-08-13); ao criar página nova a partir de um template antigo,
   confira se ela não trouxe o link morto de volta.
10. **JSON-LD `FAQPage` não sincroniza com `languages.js`** — é uma cópia estática
    do texto em `pt`. Ver `references/seo-geo.md`.
11. **Carrossel novo?** Use `data-marquee` (ver seção acima). Não escreva
    `animation: infinite` nem `setPointerCapture` sem o limiar de 6px — já foi tentado
    e quebrou o clique em botões dentro do card.
