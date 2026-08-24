# Prompt para iniciar a próxima sessão

> Cole a mensagem abaixo (a partir de "Contexto") como primeira mensagem de uma nova
> sessão do Claude Code, nesta mesma pasta do projeto.
>
> Última atualização: 2026-08-24, ao fim da sessão que entregou as 27 landing pages de
> Engenharia Elétrica.

---

## Contexto

Estou construindo a Unidade de Negócio **"4WaTT | Serviços de Engenharia"** dentro do
site estático da 4WaTT. Discovery, SPEC e a vertical de **Engenharia Elétrica** já estão
concluídos. Antes de fazer qualquer coisa, leia nesta ordem:

1. `docs/engineering-services/MASTER_SPEC.md` — leia primeiro a seção **"Status
   Consolidado"** no fim do arquivo. É o resumo definitivo do que existe e do que falta;
   o resto do documento é histórico de decisão, útil pro "porquê" mas não é a fonte de
   verdade do estado atual.
2. `docs/engineering-services/pages/index.md` — spec detalhado do hub.
3. `.claude/CLAUDE.md` e a skill `site-4watt` — regras de edição do repositório.

## O que já existe e está aprovado

- **`engenharia/index.html`** — hub, 6 blocos. Grid das 8 verticais com descrição de 2
  frases + 3 pílulas de preview de serviço cada.
- **`engenharia/eletrica.html`** — página da vertical: hero `.sol-hero`, 27 cards de
  serviço, todos linkados para suas landing pages.
- **27 landing pages** em `engenharia/eletrica/*.html` — 1.300–1.590 palavras cada, com
  o padrão visual **aprovado pelo usuário**: 3 seções em roxo sólido, 2 palcos 3D com
  tilt por scroll, carrossel de 6 pranchas técnicas reais, seção "O que é" com fundo
  tingido + imagem, e CTA final em roxo com vídeo de fundo.
- **`engenharia/mecanica.html`** — existe, mas **ainda no padrão antigo** (ver pendências).
- **Gerador de páginas** em `docs/engineering-services/`:
  - `gerar-paginas-servico.py` — template + funções de montagem
  - `conteudo_eletrica.py` — o conteúdo de Elétrica como dados
  - Roda com `python docs/engineering-services/gerar-paginas-servico.py`
- `assets/css/engenharia.css?v=0.9` — todo o CSS da unidade.

## O que falta — em ordem de prioridade

### 1. Engenharia Mecânica (tem tudo que precisa para começar)

`engenharia/mecanica.html` ficou para trás quando Elétrica evoluiu. Falta:
- Trocar o `.eng-page-banner` (faixa fina antiga) pelo hero `.sol-hero`, como em
  `eletrica.html`. Manter os **dois** botões de vídeo já existentes (`aiSHlmFX-Dc` e
  `CRoETXYdh_8`).
- Transformar os **13 cards de serviço** de `<div>` em `<a href="engenharia/mecanica/{slug}.html">`.
- Criar `docs/engineering-services/conteudo_mecanica.py` e gerar as **13 landing pages**
  em `engenharia/mecanica/`.

Os 13 serviços já estão no HTML da página, em 4 grupos: Projeto mecânico (3),
Fabricação (5), Montagem mecânica (4), Manutenção mecânica (1).

A pasta `assets/img/engenharia/mecanica/` tem 8 arquivos (renders de secador de biogás,
flare, esteira de RSU, biodigestores, montagem) — dá para montar o carrossel de pranchas
da vertical. **Confirme comigo quais usar e como legendar antes de publicar**, porque a
legenda precisa descrever o que a peça é de fato.

### 2. As outras 6 verticais (dependem de mim)

Civil, Ambiental, Gestão de Projetos e Obras, Processos, Digital e Automação **não têm
página de vertical nenhuma** — só o card no hub. Para cada uma preciso te passar a lista
real de serviços (como fiz com Elétrica e Mecânica). **Não invente a lista de serviços de
nenhuma delas** — pergunte antes.

Situação das imagens: civil tem 25 arquivos, automação 6, ambiental 5, gestão de projetos
3, e **processos e digital estão vazias** (sem foto nem de capa).

### 3. Bloqueadores para publicar de verdade

Nada disso impede continuar construindo, mas impede publicar:

- **i18n — o maior débito.** As 30 páginas de `engenharia/` têm **zero** `data-i18n`:
  todo o texto está hardcoded em PT. Isso contraria a regra nº 1 do site
  (`assets/js/languages.js` é a fonte de verdade do texto). Como o conteúdo de Elétrica
  agora vive em `conteudo_eletrica.py`, a migração pode ser feita no gerador — vale
  planejar isso como tarefa própria.
- **Navbar compartilhado.** "Serviços de Engenharia" **não está** em
  `snippets/navbar-premium.html` nem nas 26 páginas da raiz. Hoje a unidade só é
  descoberta por quem já sabe a URL.
- **Marcadores de protótipo.** As 30 páginas ainda têm o banner amarelo "PREVIEW DE SPEC",
  `<meta name="robots" content="noindex, nofollow">` e `<base href="/">`. Precisa de
  decisão sobre o que sai e o que fica.
- **`sitemap.xml`** não tem nenhuma página da unidade (correto enquanto estiverem
  `noindex` — mas entra na mesma decisão acima).
- **Scoring de lead.** O `apps-script/Code.gs` só tem a lógica APTO/TRIAGEM/NAO_APTO do
  formulário do investidor. Os campos `vertical` e `modelo_contratacao` do formulário de
  engenharia chegam na planilha como texto bruto.

## Regras não-negociáveis

Estas vêm de correções que já precisei pedir. Não repita:

1. **Navbar e footer idênticos** aos das páginas existentes. Nunca uma versão reduzida.
2. **Hero na escala certa:** `.hero-h` (vídeo full-screen) é só do hub. Página de vertical
   e de serviço usam `.sol-hero`. Nunca encolher "pra caber".
3. **Reaproveitar classes** de `assets/css/engenharia.css` e `assets/css/solucoes.css`
   antes de escrever CSS novo. Cores sempre via `var(--token)` do `theme-4watt.css`.
4. **Formulário** sempre `form.form-4watt` + classes de `components.css`. Página de
   serviço não tem formulário próprio — linka para `engenharia/index.html#contato-eng`.
5. **Bump de `?v=`** ao editar `engenharia.css`/`engenharia.js`, em **todas** as páginas
   que carregam o arquivo (hoje são 30). Confira com
   `grep -rho "engenharia.css?v=[0-9.]*" engenharia | sort | uniq -c`.
6. **Não mexa na ordem de execução do `initAutoDuplicateMarquees()`** em `engenharia.js`
   sem reler o comentário — ele roda fora do `DOMContentLoaded` de propósito.
7. **Carrossel** usa sempre `data-marquee`. Nunca `animation: infinite`, nunca
   `setPointerCapture` sem o limiar de 6px.
8. **Honestidade no conteúdo técnico.** Pode citar nome de norma pública e estável
   (NR-10, NBR 5410, NBR 5419, NBR 14039, PRODIST Módulo 8, IEEE 519, IEEE 1584).
   **Nunca** invente limite numérico, percentual, prazo de validade, métrica ou nome de
   cliente. Serviço sem referência validada por mim leva `voz_marca: True` no arquivo de
   conteúdo, que gera um comentário HTML marcando isso na página.
9. **`alt` de imagem descreve o que a peça É**, não o serviço da página. As pranchas são
   documentos reais da 4WaTT e não podem ser rotuladas erradas.
10. **`engenharia/eletrica/qualidade-de-energia.html` não é regerada** pelo script — é a
    referência aprovada à mão. Mudança estrutural aprovada nela tem que ser refletida
    manualmente no template do gerador.
11. **i18n fica pra depois**, mas não regrida: não remova `data-i18n` de nada que já tenha.

## Como trabalhar comigo

- Página a página / vertical a vertical, me mostrando o resultado antes de seguir.
- Se faltar conteúdo real de alguma vertical, **pare e pergunte** em vez de inventar.
- Verifique no navegador antes de dar por pronto: servidor na porta 5501, console limpo,
  e `python .claude/skills/site-4watt/scripts/auditar.py` sem link quebrado.
- **Limitação conhecida do ambiente:** o Browser pane fica oculto, então
  `requestAnimationFrame` não dispara (animação de tilt e carrossel não são observáveis)
  e `resize_window` não reflui abaixo de ~700px. Verifique o que é verificável sem render
  (CSS computado, contagem de elementos, status HTTP dos assets) e **me diga
  explicitamente o que ficou para eu conferir visualmente**.
