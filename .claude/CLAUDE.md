# CLAUDE.md

Guia para o Claude Code trabalhar neste repositório.

> **Antes de editar qualquer conteúdo, carregue a skill `site-4watt`.**
> Ela tem a arquitetura de edição completa, e principalmente a regra que mais causa
> retrabalho aqui: **texto com `data-i18n` não se edita no HTML** — o dicionário
> `assets/js/languages.js` sobrescreve tudo no carregamento da página.
>
> - `.claude/skills/site-4watt/SKILL.md` — regras de edição
> - `.claude/skills/site-4watt/references/i18n.md` — contrato do i18n
> - `.claude/skills/site-4watt/references/arquitetura.md` — inventário completo
> - `.claude/skills/site-4watt/references/seo-geo.md` — robots.txt/llms.txt/sitemap/OG/JSON-LD: o que manter atualizado
> - `.claude/skills/site-4watt/scripts/auditar.py` — auditoria automática

## Visão geral

Site estático multipágina da 4WaTT (biogás e biometano). **Sem build, sem bundler.**
25 arquivos HTML autocontidos; navbar e footer duplicados em 24 deles. Deploy é upload
direto dos arquivos.

```bash
python -m http.server 5501
```

Abrir por `http://localhost:5501/pagina.html`. **Não abrir por `file://`** — há
caminhos absolutos (`/assets/js/languages-pages.js`) que só resolvem servidos da raiz.

## As três coisas que mais quebram

**1. O texto na tela vem de `languages.js`, não do HTML.**
Todo elemento com `data-i18n` tem o `innerHTML` substituído em todo `DOMContentLoaded`,
mesmo em português. Editar o HTML não tem efeito visível. Para mudar o texto: edite a
chave em `assets/js/languages.js` nos blocos **`pt` e `en`**, ou remova o atributo
`data-i18n` se o texto deve ser fixo. Sintoma típico: você troca o link de um botão e
funciona, troca o texto e não funciona.

**2. Cache de asset.** Mexeu em `.css` ou `.js`? Suba o `?v=` em **todas** as páginas
que o carregam, senão o navegador serve a versão velha.

**3. Folhas legadas não são descartáveis.** `investidor-projetos.html` e as páginas de
blog/artigos carregam uma pilha antiga (`style.css`, `custom_v2.css`,
`cinematic-home.css`, `design-system.css`, `components.css`, `legacy-bridge.css`).
Elas carregam layout real — `cinematic-home.css` sustenta o hero inteiro de
`investidor-projetos.html`. Para neutralizar algo nocivo delas, sobrescreva depois;
não remova.

## Páginas ativas

| Página | Papel |
|---|---|
| `index.html` | Home |
| `investidor.html` | Landing do investidor. **Não confie na descrição "usa o layout da home"** — confira sempre com `grep -n "\.css?v=" investidor.html`; já mudou de pilha mais de uma vez |
| `case-ceasa-goias.html` | Case de sucesso (criado 2026-08-13). Pilha limpa própria (`case-ceasa.css`/`.js`) |
| `investidor-projetos.html` | Marketplace de projetos, modal de NDA, formulário |
| `solucao-biogas.html` · `solucao-biometano.html` · `solucao-gaseificacao.html` | Soluções |
| `contato.html` | Formulário de contato |
| `artigos/index.html` · `artigo-*.html` | Blog |
| `biometano/index.html` | Página dedicada (Leaflet) |
| `viabilidade/comprar-biometano.html` | Viabilidade |
| `imprensa.html` · `noticias.html` · `blog.html` · `politica-privacidade.html` | Institucional |
| `academy.html` · `partners.html` · `saas.html` · `score.html` | Stubs "em breve" |
| `artigos.html` · `biometano.html` | Stubs de redirect |
| `404.html` · `500.html` | Erro |

`simulador.html` **não existe**; 5 páginas e o `snippets/navbar-premium.html` ainda
linkam para ele. O simulador real é externo (`calculadora-zeta-sooty.vercel.app`).

## CSS

Todas as páginas: `theme-4watt.css` (tokens) + folha da página + `mobile-fixes.css`
(último). Antes de mexer em estilo, descubra a origem:

```bash
grep -rn "\.nome-da-classe" assets/css/*.css
```

`home-premium.css` é **compartilhada** por `index.html` e `investidor.html`.

**Paleta** (`theme-4watt.css` `:root`): `--roxo #3A0940` · `--teal #03A589` ·
`--gold #DBAA0F` · `--plum #2A0720` · `--bg #F4F1EB`.
Para texto pequeno sobre fundo claro use `--teal-ink` / `--gold-ink` — o gold puro é
ilegível. Sempre `var(--token)`, nunca hex cravado.

## JavaScript

`languages.js` (dicionário, 293 KB) → `languages-pages.js` (complemento) →
`main.js` (i18n, UTM) → `site-premium.js` (navbar, hero, reveal). Nessa ordem.
`forms.js` nas páginas com formulário. `main.js`, `site-premium.js` e `animations.js`
têm implementações concorrentes de reveal/contadores/FAQ — para navbar e hero mande em
`site-premium.js`; para i18n e UTM, em `main.js`.

## Carrossel

Todo carrossel (logos, cases, galerias) usa o mesmo motor: `data-marquee` +
`initDraggableMarquee`/`initMarquees()` em `assets/js/site-premium.js`. Auto-scroll
contínuo, mas arrastável (mouse/touch) — não é `animation: infinite` puro, que já foi
tentado e não deixava o usuário voltar pra ver um card que passou rápido. Regra completa,
com o gotcha do `setPointerCapture` sequestrando cliques em botões dentro do card:
skill `site-4watt`, seção "Carrossel padrão".

## Formulários

Envio duplo: **Apps Script** (scoring `APTO`/`TRIAGEM`/`NAO_APTO`, grava no Sheets) +
**Formspree**. O scoring lê `volume_interesse` — mudar os `value` das opções quebra o
scoring silenciosamente. Editar `apps-script/Code.gs` **só vale após deploy manual** no
console do Apps Script.

## Antes de dar por pronto

```bash
python .claude/skills/site-4watt/scripts/auditar.py
```

Depois **abra no navegador**: posição dos contêineres, nenhum texto fora da viewport,
1280px e 375px, PT↔EN, console limpo. Medir só cor e altura de seção **não prova** que
a página está de pé.

## Documentos de trabalho

- `AGENTS.md` (raiz) — referência longa em português. Anterior a esta reorganização;
  em caso de conflito, vale a skill `site-4watt`.
- `.claude/PLANO-MUDANCAS-SITE.md` — backlog vindo do Notion
- `.claude/PLANO-LP-INVESTIDOR.md` — histórico da landing do investidor
