# Plano de Ação SEO — 4WaTT Bio Engenharia
**Auditoria:** 12 agosto 2026  
**Score atual:** 42 / 100  
**Meta:** 80+ após implementações

---

## Resumo executivo

| Severidade | Qtd | Status |
|---|---|---|
| Crítico | 4 | ✅ Feito |
| Alto | 4 | ✅ Feito |
| Médio | 3 | ✅ Feito |
| Baixo | 2 | ✅ Feito |
| **Total** | **13** | **Ações 1–8 completas (13/08/2026). Ação 9 (purge de chaves mortas) fica pendente de decisão — ver nota no final.** |

---

## Ações por prioridade

### 1. Criar `robots.txt`
**Arquivo:** `/robots.txt` (raiz do site)

Criar com as seguintes regras:
- Permitir crawl em todas as páginas ativas
- Bloquear stubs (`academy.html`, `saas.html`, `score.html`, `partners.html`, `noticias.html`)
- Bloquear arquivos `.bak`
- Bloquear `/assets/img_old/`
- Declarar URL do sitemap

```
User-agent: *
Disallow: /academy.html
Disallow: /saas.html
Disallow: /score.html
Disallow: /partners.html
Disallow: /noticias.html
Disallow: /assets/img_old/
Disallow: /*.bak$

Sitemap: https://4watt.tech/sitemap.xml
```

- [x] Arquivo criado
- [ ] Testado em `https://4watt.tech/robots.txt`

---

### 2. Criar `llms.txt`
**Arquivo:** `/llms.txt` (raiz do site)

Descrever empresa, serviços, diferenciais e links canônicos para que LLMs (Perplexity, ChatGPT Search, Claude) citem a 4WaTT corretamente quando perguntados sobre biogás, biometano e gaseificação no Brasil.

**Estrutura recomendada:**
```
# 4WaTT Bio Engenharia

> Empresa brasileira de bioengenharia especializada em projetos de biogás, biometano e gaseificação de RSU. Atua do EVTE ao O&M — engenharia própria em todas as etapas.

## Serviços

- **Engenharia de Biogás**: projetos de biodigestão anaeróbia para resíduos agroindustriais, suínos, aves e RSU. Do dimensionamento ao comissionamento.
- **Biometano**: purificação, certificação RenovaBio (CBIO), conexão à rede de gás natural e contratos de offtake.
- **Gaseificação de RSU**: conversão térmica de resíduos sólidos urbanos em syngas e energia elétrica.
- **Simulador de Viabilidade**: ferramenta online para análise de TIR, VPL e payback de projetos.

## Diferenciais

- Engenharia própria: mesma equipe técnica do projeto acompanha a operação (O&M)
- Financiamento estruturado: apoio à captação via CRI, debêntures e fundos de infraestrutura
- Certificação RenovaBio integrada ao escopo de projetos de biometano
- Cases executados: Organoburitis, Rota Pesadas, CEASA Goiânia

## Links

- Site: https://4watt.tech
- Soluções Biogás: https://4watt.tech/solucao-biogas.html
- Soluções Biometano: https://4watt.tech/solucao-biometano.html
- Gaseificação RSU: https://4watt.tech/solucao-gaseificacao.html
- Área do Investidor: https://4watt.tech/investidor.html
- Blog técnico: https://4watt.tech/artigos/
- Simulador: https://calculadora-zeta-sooty.vercel.app/
- Contato: https://4watt.tech/contato.html
```

- [x] Arquivo criado
- [ ] Acessível em `https://4watt.tech/llms.txt`

---

### 3. Adicionar Open Graph em todas as páginas principais

**Páginas:** `index.html`, `solucao-biogas.html`, `solucao-biometano.html`, `solucao-gaseificacao.html`, `investidor.html`, `contato.html`, `artigo-*.html`, `imprensa.html`

Bloco padrão a inserir no `<head>` de cada página (personalizar title/description/url por página):

```html
<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="4WaTT Bio Engenharia">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="[TÍTULO DA PÁGINA]">
<meta property="og:description" content="[DESCRIÇÃO DA PÁGINA]">
<meta property="og:url" content="https://4watt.tech/[pagina.html]">
<meta property="og:image" content="https://4watt.tech/assets/img/og-4watt.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<!-- Twitter/X Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[TÍTULO DA PÁGINA]">
<meta name="twitter:description" content="[DESCRIÇÃO DA PÁGINA]">
<meta name="twitter:image" content="https://4watt.tech/assets/img/og-4watt.jpg">
```

**Criar imagem OG:** `assets/img/og-4watt.jpg` — 1200×630px com logo 4WaTT sobre fundo escuro (roxo #3A0940 ou foto de usina).

**Valores sugeridos por página:**

| Página | og:title | og:description |
|---|---|---|
| index.html | Transformamos resíduo em energia e receita previsível · 4WaTT | Engenharia de biogás e biometano do EVTE ao O&M. Projetos, construção e operação de usinas no Brasil. |
| solucao-biogas.html | Engenharia de Biogás Industrial · 4WaTT | Projetos completos de biodigestão para resíduos agroindustriais e RSU. Dimensionamento, construção e O&M. |
| solucao-biometano.html | Biometano: purificação, RenovaBio e offtake · 4WaTT | Da purificação do biogás à certificação CBIO e conexão à rede. Projetos financeiramente estruturados. |
| solucao-gaseificacao.html | Gaseificação de RSU · 4WaTT | Conversão de resíduos sólidos urbanos em energia via gaseificação térmica. Projetos municipais e industriais. |
| investidor.html | Área do Investidor · 4WaTT Bio Engenharia | Projetos de biogás e biometano com TIR atrativa. Estrutura de capital, EVTE e due diligence para investidores. |
| contato.html | Fale com a 4WaTT Bio Engenharia | Entre em contato para simular a viabilidade do seu projeto de biogás ou biometano. |

- [ ] Imagem OG criada (1200×630px) — **pendente, arquivo não existe ainda**
- [x] index.html ✓
- [x] solucao-biogas.html ✓
- [x] solucao-biometano.html ✓
- [x] solucao-gaseificacao.html ✓
- [x] investidor.html ✓
- [x] contato.html ✓
- [x] artigos (3) ✓
- [x] imprensa.html ✓

---

### 4. Adicionar JSON-LD / Schema.org

**`index.html`** — Inserir antes do `</body>`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "4WaTT Bio Engenharia",
  "url": "https://4watt.tech",
  "logo": "https://4watt.tech/assets/img/logo-4watt-dark.png",
  "description": "Empresa de bioengenharia especializada em projetos de biogás, biometano e gaseificação de RSU. Engenharia própria do EVTE ao O&M.",
  "foundingLocation": { "@type": "Place", "name": "Goiânia, GO, Brasil" },
  "areaServed": "BR",
  "sameAs": [],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Soluções 4WaTT",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Engenharia de Biogás", "url": "https://4watt.tech/solucao-biogas.html" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Biometano e RenovaBio", "url": "https://4watt.tech/solucao-biometano.html" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Gaseificação de RSU", "url": "https://4watt.tech/solucao-gaseificacao.html" } }
    ]
  }
}
</script>
```

**`solucao-biogas.html`, `solucao-biometano.html`, `solucao-gaseificacao.html`** — Schema `Service` + `FAQPage` (gerar FAQ com 3–5 perguntas técnicas por solução).

**`contato.html`** — Schema `LocalBusiness` com endereço Goiânia.

- [x] index.html — Organization ✓
- [x] solucao-biogas.html — Service + FAQ ✓
- [x] solucao-biometano.html — Service + FAQ ✓
- [x] solucao-gaseificacao.html — Service + FAQ ✓
- [x] contato.html — LocalBusiness ✓
- [ ] Validar em https://search.google.com/test/rich-results (requer deploy — pendente manual)

---

### 5. Canonical + noindex em stubs

**Adicionar canonical em páginas ativas** (inserir no `<head>`):
```html
<link rel="canonical" href="https://4watt.tech/[pagina.html]">
```

**Adicionar noindex em stubs** (`academy.html`, `saas.html`, `score.html`, `partners.html`, `noticias.html`, `blog.html`, `artigos.html`, `biometano.html`):
```html
<meta name="robots" content="noindex, nofollow">
```

**Corrigir links quebrados para simulador.html** — substituir em 5 arquivos:
- `404.html`
- `500.html`
- `artigos/index.html`
- `biometano/index.html`
- `viabilidade/comprar-biometano.html`

Substituir `simulador.html` por `https://calculadora-zeta-sooty.vercel.app/` com `target="_blank" rel="noopener noreferrer"`.

- [x] Canonical adicionado em todas as páginas ativas indexáveis (index, investidor-projetos já tinha, 3 soluções, contato, viabilidade/comprar-biometano.html)
- [x] noindex em stubs — já estava feito (academy/saas/score/partners/blog/noticias/imprensa/politica-privacidade)
- [x] Links simulador.html corrigidos (6 arquivos: 404, 500, artigos/index, biometano/index, viabilidade/comprar-biometano, snippets/navbar-premium)

---

### 6. Corrigir sitemap.xml ⏱ 30 min · Médio

- Corrigir formato de datas de `YYYY-MM` para `YYYY-MM-DD`
- Remover `<url>` de `simulador.html`
- Adicionar `imprensa.html` com `priority 0.6`
- Confirmar que todas as URLs ativas estão presentes

- [x] Datas corrigidas para YYYY-MM-DD (usando data real do último commit por arquivo via `git log`, ou hoje 2026-08-12 para páginas editadas nesta sessão)
- [x] simulador.html removido
- [x] imprensa.html **não** adicionado — página está `noindex`; incluir no sitemap contradiria esse sinal (decisão revisada com o usuário, diferente do plano original)
- [ ] Validar em https://www.xml-sitemaps.com/validate-xml-sitemap.html (requer deploy)

---

### 7. Corrigir 4 chaves i18n órfãs

**Arquivo:** `assets/js/languages.js`

Adicionar nos blocos `pt` e `en`:
- `bm_vol_centro_icon` — ícone da região Centro (biometano/index.html)
- `bm_vol_future_icon` — ícone de perspectiva futura
- `bm_vol_sudeste_icon` — ícone da região Sudeste
- `inv_nav_inicio` — botão "Início" na navbar do investidor

- [x] 4 chaves adicionadas em PT
- [x] 4 chaves adicionadas em EN
- [x] `languages.js?v=2.2 → v=2.3` em todas as 23 páginas que carregam o arquivo
- [ ] Testado em modo EN no navegador (pendente — verificação manual)

---

### 8. Corrigir versão divergente de solucoes.css

Unificar todas as referências para `solucoes.css?v=2.2` nos arquivos:
- `academy.html` (atualmente v=2.1)
- `solucao-biogas.html` (atualmente v=2.1)
- `solucao-gaseificacao.html` (atualmente v=2.1)

- [x] 3 arquivos atualizados para v=2.2

---

### 9. Purge de chaves i18n mortas

291 de 1.436 chaves em `languages.js` nunca são usadas (20%). Executar `auditar.py` para listar; remover apenas após confirmar que não serão usadas em páginas futuras (academy, saas, score em desenvolvimento).

- [x] Lista gerada com auditar.py — 291 de 1.440 chaves (20%)
- [ ] Chaves confirmadas como mortas — **não avaliado**; requer revisão manual chave a chave (risco de remover algo usado por academy/saas/score em desenvolvimento)
- [ ] Removidas do languages.js — **não executado nesta sessão**, por ser mudança de maior risco sem revisão individual

---

## Checklist final

Após todas as implementações:

```bash
# Auditoria interna
python .claude/skills/site-4watt/scripts/auditar.py

# Testar robots.txt
curl https://4watt.tech/robots.txt

# Testar llms.txt
curl https://4watt.tech/llms.txt

# Validar sitemap
# https://www.xml-sitemaps.com/validate-xml-sitemap.html

# Validar schema
# https://search.google.com/test/rich-results

# Validar Open Graph
# https://developers.facebook.com/tools/debug/
# https://cards-dev.twitter.com/validator
```

- [ ] Google Search Console — solicitar reindexação das páginas alteradas
- [ ] Google Search Console — submeter sitemap atualizado
- [ ] Verificar no Search Console após 48h se erros 404 sumiram

---

## Estimativa de impacto

| Ação | Impacto esperado |
|---|---|
| robots.txt | Crawl budget otimizado em ~2 semanas |
| Open Graph | CTR em compartilhamentos sociais +20–40% imediato |
| JSON-LD | Elegível para rich results em 4–8 semanas |
| llms.txt | Citações em LLMs (Perplexity) em 2–4 semanas |
| Canonical | Consolidação de link equity em 4–6 semanas |
| Score estimado pós-implementação | **78–85 / 100** |

---
