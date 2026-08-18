# SEO/GEO e llms.txt — o que manter atualizado

Levantado em 2026-08-13 depois de implementar `robots.txt`, `llms.txt`, Open Graph,
JSON-LD e canonical em todo o site (ver `SEO-PLANO-ACAO.md` na raiz para o histórico
completo). Este documento é o contrato: **o que toda página nova ou editada precisa
manter** para não regredir o que foi implementado.

## Os três arquivos de descoberta, na raiz

| Arquivo | Papel | Quando editar |
|---|---|---|
| `robots.txt` | Bloqueia stubs/`.bak`, permite explicitamente bots de IA (GPTBot, ChatGPT-User, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended) e declara o sitemap | Nova página stub → adicionar `Disallow`. Bot de IA novo relevante → adicionar `Allow` |
| `llms.txt` | Describe a 4WaTT (serviços, diferenciais, cases, links) no padrão Jeremy Howard, para LLMs citarem a empresa em respostas sobre biogás/biometano | Novo serviço lançado, novo case relevante, ou URL de página essencial mudou |
| `sitemap.xml` | Lista as páginas indexáveis com `lastmod` real | Toda página nova indexável entra; página que virou stub/noindex sai |

**Não remova as linhas `Allow:` de bots de IA em `robots.txt` achando redundante.**
Elas existem especificamente para GEO (Generative Engine Optimization) — sem elas,
crawlers como PerplexityBot e ClaudeBot podem ser bloqueados pelo `User-agent: *`
implícito de alguns crawlers mais conservadores.

## Regra: página indexável vs. página noindex, nunca as duas coisas pela metade

```
Página nova ou editada
├── Tem conteúdo pronto para busca? (não é stub "em breve")
│    └── SIM → precisa de TODOS os 3:
│         1. <link rel="canonical" href="https://4watt.tech/pagina.html">
│         2. Bloco OG + Twitter Card no <head> (template abaixo)
│         3. Entrada em sitemap.xml com lastmod real
└── NÃO, é stub/institucional sem intenção de indexar
     └── <meta name="robots" content="noindex, follow">
         E NUNCA entra no sitemap.xml (as duas coisas juntas, não uma só)
```

Um erro que já aconteceu no plano original: pedir para adicionar `imprensa.html`
(que já estava `noindex`) ao sitemap. **noindex + presença no sitemap é um sinal
contraditório** — o Google trata como indício de sitemap de baixa qualidade. Se uma
página está noindex, ela não entra no sitemap, ponto.

## Template Open Graph + Twitter Card

Inserir logo após `<meta name="description">` no `<head>`. **Não tem `data-i18n`** —
é texto fixo, não passa pela árvore de decisão do i18n, não precisa tocar em
`languages.js`:

```html
<!-- Open Graph -->
<meta property="og:type" content="website"> <!-- "article" para posts de blog -->
<meta property="og:site_name" content="4WaTT Bio Engenharia">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="[título — normalmente igual ao <title>]">
<meta property="og:description" content="[descrição — normalmente igual à meta description]">
<meta property="og:url" content="https://4watt.tech/[pagina.html]">
<meta property="og:image" content="https://4watt.tech/assets/img/og-4watt.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<!-- Twitter/X Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[mesmo título]">
<meta name="twitter:description" content="[mesma descrição]">
<meta name="twitter:image" content="https://4watt.tech/assets/img/og-4watt.jpg">
```

**Nada sincroniza `og:title`/`og:description` com `<title>`/`<meta name="description">`
automaticamente.** Se editar um, edite o outro na mão. Nenhum dos dois tem
`data-i18n`, então isso é só uma edição de HTML normal.

`assets/img/og-4watt.jpg` (1200×630px) é referenciada em todas as páginas mas
**ainda não foi criada** — pendência de design, não de código.

## JSON-LD por tipo de página

| Página | Schema | Onde |
|---|---|---|
| `index.html` | `Organization` + `OfferCatalog` | antes de `</body>` |
| `solucao-*.html` | `Service` + `FAQPage` | antes de `</body>`, dois `<script>` separados |
| `contato.html` | `LocalBusiness` | antes de `</body>` |
| `artigo-*.html` | já tinha `Article`/schema próprio antes desta rodada — não duplicar |

### A armadilha: `FAQPage` é uma cópia estática do texto de `languages.js`

As perguntas/respostas do `FAQPage` JSON-LD nas páginas de solução foram copiadas
**literalmente** do bloco `pt` de `languages.js` (chaves `sol_biogas_faq_q1`/`_a1`
etc., `sol_biometano_faq_*`, `sol_gaseif_faq*_q`/`_a`). Isso significa:

- **Se editar uma resposta de FAQ em `languages.js`, o JSON-LD correspondente na
  página HTML fica desatualizado** — nada re-sincroniza automaticamente.
- Google pode ignorar ou penalizar rich results quando o schema estruturado diverge
  do conteúdo visível na página (o texto visível vem do `data-i18n`, que reflete
  `languages.js`; o JSON-LD é HTML fixo).
- **Ao editar uma pergunta/resposta de FAQ que tem chave `sol_*_faq_*`, atualize os
  dois lugares**: a chave em `languages.js` (blocos `pt` **e** `en` — regra normal
  do i18n) e o bloco `<script type="application/ld+json">` `FAQPage` na mesma
  página HTML (só a versão em português — o JSON-LD não é traduzido, reflete
  sempre o `pt`, já que é isso que o Google indexa como conteúdo canônico).

Valide sintaxe depois de editar JSON-LD:

```bash
python3 -c "
import re, json
c = open('pagina.html', encoding='utf-8').read()
for b in re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', c, re.S):
    json.loads(b)
print('ok')
"
```

## `sitemap.xml`: `lastmod` real, nunca `new Date()`

Usar a data do último commit que tocou o arquivo, não a data de hoje "porque mexi
agora":

```bash
git log -1 --format=%cd --date=short -- pagina.html
```

Só use a data de hoje se você **de fato** editou o arquivo hoje (o que inclui
adicionar OG/JSON-LD/canonical — isso conta como modificação real da página).

## Link do simulador: sempre externo

O simulador não é local (`simulador.html` não existe, ver armadilha #8 do
`SKILL.md`). Todo CTA "Simular Viabilidade" deve apontar para:

```html
<a class="nav__cta" href="https://calculadora-zeta-sooty.vercel.app/" target="_blank" rel="noopener noreferrer" data-i18n="cta_simular">Simular Viabilidade</a>
```

Isso vale também para `snippets/navbar-premium.html`, a referência canônica da
navbar — se ela ficar com o link errado, toda página nova copiada dela herda o 404.

## Checklist rápido ao criar página nova indexável

1. `<title>` e `<meta name="description">` únicos, sem `data-i18n` (raramente têm)
2. `<link rel="canonical" href="https://4watt.tech/pagina.html">`
3. Bloco OG + Twitter Card (template acima)
4. JSON-LD apropriado ao tipo de página, se fizer sentido (Service, FAQPage, Article...)
5. Entrada em `sitemap.xml` com `lastmod` real
6. Se algum CTA usa o simulador, link externo com `target="_blank"`
7. `python .claude/skills/site-4watt/scripts/auditar.py` — não cobre SEO ainda,
   só i18n/links/versões; a checagem de OG/canonical/sitemap continua manual
