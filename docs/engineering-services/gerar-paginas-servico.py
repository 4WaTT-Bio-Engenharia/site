#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gerador das landing pages de serviço de /engenharia/{vertical}/{slug}.html

POR QUE ESTE SCRIPT EXISTE
--------------------------
O site é estático e SEM build — o que este script gera é HTML final, commitado no
repositório e servido direto. Ele NÃO roda em produção; é um gerador rodado à mão,
mesmo padrão do `assets/pages/update_footers.py` que já existia no repo.

A razão de existir: são 26+ páginas com estrutura idêntica (navbar, footer, carrossel,
palcos 3D) e só o conteúdo mudando. Mantê-las à mão significaria replicar ~200 linhas
de boilerplate 26 vezes e correr o risco de divergirem na primeira correção de navbar.

TEMPLATE DE REFERÊNCIA
----------------------
`engenharia/eletrica/qualidade-de-energia.html` — página construída à mão e APROVADA
pelo usuário em 2026-08-23. Ela NÃO é regerada por este script (é a referência viva);
qualquer mudança estrutural aprovada nela deve ser refletida aqui manualmente.

REGRAS DE CONTEÚDO (herdadas das decisões já registradas em MASTER_SPEC.md)
--------------------------------------------------------------------------
- Pode citar NOME de norma pública e estável (NR-10, NBR 5419, NBR 5410, NBR 14039,
  PRODIST Módulo 8, IEEE 519, IEEE 1584, NR-12).
- NÃO pode inventar limite numérico, percentual de tolerância, prazo de validade,
  métrica de cliente ou nome de cliente.
- Serviços sem referência real validada levam comentário HTML marcando que a copy é
  "voz de marca" (campo `voz_marca=True`).

USO
---
    python docs/engineering-services/gerar-paginas-servico.py            # todas as verticais
    python docs/engineering-services/gerar-paginas-servico.py mecanica   # só uma

CADA VERTICAL É UM MÓDULO DE CONTEÚDO
-------------------------------------
`conteudo_{vertical}.py` precisa exportar quatro nomes: SERVICOS, PRANCHAS,
IMAGEM_SOBRE e ALT_PRANCHA. O template abaixo é o mesmo para todas — o que muda é só
o conteúdo. Para abrir uma vertical nova, crie o módulo e registre-a em VERTICAIS.
"""

import importlib
import json
import os
import sys

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CSS_ENG_VER = "0.9"   # manter em sincronia com o ?v= de assets/css/engenharia.css

# --------------------------------------------------------------------------
# Verticais registradas
#   slug     — pasta em engenharia/{slug}/ e em assets/img/engenharia/{slug}/
#   nome     — nome completo, usado no breadcrumb, badge e <title>
#   curto    — nome curto, usado no CTA "Ver todos os serviços de {curto}"
#   arquivo  — página da vertical, alvo do breadcrumb e do CTA
#   capa     — imagem de fundo do hero e poster do vídeo do CTA final
# --------------------------------------------------------------------------

VERTICAIS = {
    "eletrica": {
        "slug": "eletrica",
        "nome": "Engenharia Elétrica",
        "curto": "Elétrica",
        "arquivo": "engenharia/eletrica.html",
        "capa": "cover.jpg",
    },
    "mecanica": {
        "slug": "mecanica",
        "nome": "Engenharia Mecânica",
        "curto": "Mecânica",
        "arquivo": "engenharia/mecanica.html",
        "capa": "cover-wide.jpg",
    },
}

# --------------------------------------------------------------------------
# Blocos fixos (idênticos em todas as páginas da unidade)
# --------------------------------------------------------------------------

NAVBAR = """  <nav class="nav">
    <a class="nav__logo" href="index.html" aria-label="4WaTT início">
      <img src="assets/img/logo-4watt-dark.png" alt="4WaTT Bio Engenharia">
    </a>
    <button class="nav__toggle" type="button" aria-label="Abrir menu" aria-expanded="false"><i class="fas fa-bars"></i></button>
    <ul class="nav__links">
      <li><a href="index.html#ecossistema">Ecossistema</a></li>
      <li><a href="index.html#matriz">Resíduos</a></li>
      <li><a href="index.html#engenharia">Equipamentos</a></li>
      <li><a href="index.html#jornada">Jornada</a></li>
      <li class="nav__dd">
        <a tabindex="0">Soluções <i class="fas fa-chevron-down"></i></a>
        <ul class="nav__dd-menu">
          <li><a href="solucao-gestao-residuos.html">Gestão de Resíduos</a></li>
          <li><a href="solucao-biogas.html">Engenharia de Biogás</a></li>
          <li><a href="solucao-biometano.html">Biometano</a></li>
          <li><a href="solucao-gaseificacao.html">Gaseificação de RSU</a></li>
          <li><a href="engenharia/index.html">Serviços de Engenharia</a></li>
        </ul>
      </li>
      <li><a href="investidor.html">Área do Investidor</a></li>
      <li><a href="engenharia/index.html" style="color:var(--teal)">Serviços de Engenharia</a></li>
      <li><a href="imprensa.html">Imprensa</a></li>
      <li class="nav__lang">
        <div class="lang-selector" role="group" aria-label="Seletor de idioma">
          <button class="lang-btn active" type="button" data-lang="pt" aria-pressed="true">PT</button>
          <button class="lang-btn" type="button" data-lang="en" aria-pressed="false">EN</button>
        </div>
      </li>
      <li><a class="nav__cta" href="engenharia/index.html#contato-eng">Falar com um especialista</a></li>
    </ul>
    <div class="nav__progress"></div>
  </nav>"""

FOOTER = """  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand footer__col">
          <img class="footer__logo" src="assets/img/logo-4watt-light.png" alt="4WaTT">
          <p>De todas as formas de energia, escolha a que se renova. Escolha 4WaTT.</p>
          <p>4WaTT Bio Engenharia S/A.</p>
          <div class="footer__seal"><i class="fas fa-circle-check"></i> <span>Site oficial verificado</span></div>
        </div>
        <div class="footer__col">
          <h4>Endereço</h4>
          <ul>
            <li>Edifício Metropolitan Business</li>
            <li>Torre Tokyo, sala 601</li>
            <li>Av. Dep. Jamel Cecílio</li>
            <li>Jardim Goiás, Goiânia · GO</li>
          </ul>
        </div>
        <div class="footer__col">
          <h4>Contato</h4>
          <ul>
            <li><i class="fas fa-shield-halved"></i> <a href="politica-privacidade.html">Política de Privacidade</a></li>
            <li><i class="fas fa-envelope"></i> <a href="mailto:contato@4watt.tech">contato@4watt.tech</a></li>
            <li><i class="fas fa-phone"></i> <a href="https://wa.me/5545991378949">+55 45 99137-8949</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h4>Siga-nos</h4>
          <div class="footer__social">
            <a href="https://www.linkedin.com/in/4watt-tech-b798041b1" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            <a href="https://www.instagram.com/4watt.tech/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="https://www.facebook.com/4wattbioeng" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          </div>
        </div>
      </div>
      <div class="footer__bottom"><span>© 2026 4WaTT Bio Engenharia S/A · Todos os direitos reservados.</span><span>Da
          simulação à operação. Patrimônio energético.</span></div>
    </div>
  </footer>"""

def bloco_carrossel(vertical, lead, pranchas):
    plates = []
    for arq, tag, nome, desc in pranchas:
        plates.append(
            f"""        <article class="eng-svc-plate">
          <span class="eng-svc-plate__img"><img src="assets/img/engenharia/{vertical}/{arq}" alt="Prancha técnica {nome} — engenharia 4WaTT" loading="lazy"></span>
          <span class="eng-svc-plate__body">
            <span class="eng-svc-plate__tag">{tag}</span>
            <span class="eng-svc-plate__name">{nome}</span>
            <span class="eng-svc-plate__desc">{desc}</span>
          </span>
        </article>"""
        )
    return f"""  <!-- ============ CARROSSEL DE PRANCHAS REAIS (roxo sólido) ============
       Motor: [data-marquee] de site-premium.js + auto-duplicação de engenharia.js.
       Só os itens REAIS aqui — o script clona sozinho para fechar o loop. -->
  <section class="section eng-svc-dark">
    <div class="container">
      <div class="sol-head sol-head--center">
        <span class="kicker" data-reveal>Engenharia própria</span>
        <h2 class="h2" data-reveal data-d="1">Documentação técnica de verdade, não modelo genérico</h2>
        <p class="lead" data-reveal data-d="2">{lead}</p>
      </div>
    </div>
    <div class="eng-svc-marquee" data-marquee data-marquee-speed="0.35" data-reveal style="position:relative;z-index:1;">
      <div class="eng-svc-marquee__track">
{chr(10).join(plates)}
      </div>
    </div>
  </section>"""


def cards(lista):
    """3 .sol-feat a partir de [(icone, titulo, texto)]."""
    out = []
    for i, (ic, h3, p) in enumerate(lista):
        d = f' data-d="{i}"' if i else ""
        out.append(
            f'            <article class="sol-feat" data-reveal{d}><div class="sol-feat__ic">'
            f'<i class="{ic}"></i></div><h3>{h3}</h3><p>{p}</p></article>'
        )
    return chr(10).join(out)


def steps(lista):
    """4 .sol-step numerados a partir de [(icone, titulo, texto)]."""
    out = []
    for i, (ic, h3, p) in enumerate(lista):
        d = f' data-d="{i}"' if i else ""
        out.append(
            f"""            <div class="sol-step" data-reveal{d}>
              <div class="sol-step__num"><i class="{ic}"></i><span class="step-n">{i + 1:02d}</span></div>
              <div class="sol-step__body">
                <h3>{h3}</h3>
                <p>{p}</p>
              </div>
            </div>"""
        )
    return chr(10).join(out)


def checks(lista, escuro=True):
    """Lista de checks. escuro=True usa .eng-svc-checks (sobre roxo)."""
    if escuro:
        itens = [
            f"        <li><i class=\"fas fa-check\"></i><span><strong>{s}</strong> {r}</span></li>"
            for s, r in lista
        ]
        return f"""      <ul class="eng-svc-checks" data-reveal data-d="1">
{chr(10).join(itens)}
      </ul>"""
    itens = [
        '        <li style="display:flex;gap:14px;align-items:flex-start;">'
        '<i class="fas fa-check" style="color:var(--teal-ink);margin-top:5px;flex:0 0 auto;"></i>'
        '<span style="color:var(--dim);font-size:15px;line-height:1.6;">'
        f'<strong style="color:var(--ink);">{s}</strong> {r}</span></li>'
        for s, r in lista
    ]
    return f"""      <ul data-reveal data-d="1" style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:16px;">
{chr(10).join(itens)}
      </ul>"""


def tabela(th, linhas):
    corpo = chr(10).join(
        f"            <tr><td>{a}</td><td>{b}</td></tr>" for a, b in linhas
    )
    return f"""      <div class="sol-table-wrap" data-reveal>
        <table class="sol-table">
          <thead>
            <tr><th><i class="fa-solid fa-list-check"></i> {th[0]}</th><th><i class="fa-solid fa-circle-info"></i> {th[1]}</th></tr>
          </thead>
          <tbody>
{corpo}
          </tbody>
        </table>
      </div>"""


def faq(lista):
    itens = []
    for q, a in lista:
        itens.append(
            f"""        <div class="acc-item">
          <button class="acc-head">{q} <i class="fas fa-plus"></i></button>
          <div class="acc-body"><p>{a}</p></div>
        </div>"""
        )
    return chr(10).join(itens)


SITE = "https://4watt.tech"

# Bloco Organization reaproveitado de solucao-gestao-residuos.html (a página com a
# implementação SEO/GEO mais completa do site). Dados reais: os mesmos do footer.
# `sameAs` amarra a entidade "4WaTT Bio Engenharia" aos perfis oficiais — é o sinal
# que motor generativo usa para desambiguar marca (E-E-A-T / reconciliação de entidade).
ORG = {
    "@type": "Organization",
    "name": "4WaTT Bio Engenharia S/A",
    "url": SITE,
    "email": "contato@4watt.tech",
    "telephone": "+55-45-99137-8949",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. Dep. Jamel Cecílio, Edifício Metropolitan Business, Torre Tokyo, sala 601, Jardim Goiás",
        "addressLocality": "Goiânia",
        "addressRegion": "GO",
        "addressCountry": "BR",
    },
    "sameAs": [
        "https://www.linkedin.com/in/4watt-tech-b798041b1",
        "https://www.instagram.com/4watt.tech/",
        "https://www.facebook.com/4wattbioeng",
    ],
}


def jsonld(v, s, url_pagina):
    """Service + FAQPage + BreadcrumbList da página de serviço.

    HONESTIDADE (regra nº 8): nada aqui inventa número. `citation` lista só os nomes
    de norma que a própria página já cita, e o texto do FAQPage é cópia literal do
    que está visível — se o FAQ mudar em conteudo_{vertical}.py, este bloco é regerado
    junto, então não há o risco de divergência que existe nas páginas de solução.
    """
    normas = [c[1] for c in s["ref_cards"]]

    servico = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": s["nome"],
        "serviceType": f"{s['nome']} — {v['nome']} industrial",
        "description": s["meta"],
        "url": url_pagina,
        "areaServed": {"@type": "Country", "name": "Brasil"},
        "provider": ORG,
        "category": v["nome"],
        "isPartOf": {
            "@type": "WebPage",
            "name": f"{v['nome']} · 4WaTT Serviços de Engenharia",
            "url": f"{SITE}/{v['arquivo']}",
        },
        # As normas públicas citadas na página, como fontes verificáveis.
        "citation": [{"@type": "CreativeWork", "name": n} for n in normas],
    }

    faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in s["faq"]
        ],
    }

    trilha = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "4WaTT", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": "Serviços de Engenharia",
             "item": f"{SITE}/engenharia/index.html"},
            {"@type": "ListItem", "position": 3, "name": v["nome"],
             "item": f"{SITE}/{v['arquivo']}"},
            {"@type": "ListItem", "position": 4, "name": s["nome"], "item": url_pagina},
        ],
    }

    return "\n".join(
        f'  <script type="application/ld+json">\n{json.dumps(d, ensure_ascii=False, indent=2)}\n  </script>'
        for d in (servico, faq, trilha)
    )


def montar(s, v):
    """Monta o HTML de uma página de serviço.

    `v` é a config da vertical (VERTICAIS[slug]) já enriquecida, em carregar_vertical(),
    com o conteúdo do módulo: SERVICOS, PRANCHAS, IMAGEM_SOBRE e ALT_PRANCHA.
    """
    vertical = v["slug"]
    vertical_nome = v["nome"]
    vertical_arquivo = v["arquivo"]
    capa = v["capa"]
    PRANCHAS = v["pranchas"]
    IMAGEM_SOBRE = v["imagem_sobre"]
    ALT_PRANCHA = v["alt_prancha"]

    marca = ""
    if s.get("voz_marca"):
        marca = ("\n  <!-- Copy redigida em voz de marca 4WaTT, sem referência externa validada item a item\n"
                 "       (autorizado pelo usuário) — ver docs/engineering-services/MASTER_SPEC.md -->")

    fatos = chr(10).join(
        f"""        <div class="eng-svc-strip__item" data-reveal{f' data-d="{i}"' if i else ''}>
          <div class="eng-svc-strip__v">{v}</div>
          <div class="eng-svc-strip__l">{l}</div>
        </div>"""
        for i, (v, l) in enumerate(s["fatos"])
    )

    # Imagem da seção "O que é" — ver comentário em conteudo_eletrica.py
    img_sobre = IMAGEM_SOBRE.get(s["slug"], PRANCHAS[0][0])
    img_alt = ALT_PRANCHA.get(img_sobre, "Prancha técnica produzida pela engenharia 4WaTT")

    url_pagina = f"{SITE}/engenharia/{vertical}/{s['slug']}.html"
    dados_estruturados = jsonld(v, s, url_pagina)

    return f"""<!DOCTYPE html>
<html lang="pt-br">

<head>
  <base href="/">
  <link rel="icon" href="assets/img/favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="assets/img/favicon.png">

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{s['nome']} | {vertical_nome} · 4WaTT</title>
  <meta name="description"
    content="{s['meta']}">
  <link rel="canonical" href="{url_pagina}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="4WaTT Bio Engenharia">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:title" content="{s['nome']} | {vertical_nome} · 4WaTT">
  <meta property="og:description" content="{s['meta']}">
  <meta property="og:url" content="{url_pagina}">
  <meta property="og:image" content="https://4watt.tech/assets/img/og-4watt.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <!-- Twitter/X Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{s['nome']} | {vertical_nome} · 4WaTT">
  <meta name="twitter:description" content="{s['meta']}">
  <meta name="twitter:image" content="https://4watt.tech/assets/img/og-4watt.jpg">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800;900&family=Roboto+Mono:wght@400;500&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="assets/css/theme-4watt.css?v=3.9">
  <link rel="stylesheet" href="assets/css/components.css">
  <link rel="stylesheet" href="assets/css/solucoes.css?v=2.2">
  <link rel="stylesheet" href="assets/css/engenharia.css?v={CSS_ENG_VER}">
  <link rel="stylesheet" href="assets/css/mobile-fixes.css?v=2">
  <style>:root {{ --accent: var(--teal); --accent-light: var(--teal-ink); }}</style>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-N91NFD55MB"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-N91NFD55MB');</script>
</head>

<body class="t4">
{NAVBAR}

  <header class="sol-hero" data-hero>
    <div class="ph ph--px"><img src="assets/img/engenharia/{vertical}/{capa}" alt="{s['nome']} — 4WaTT" data-parallax="0.06"></div>
    <div class="sol-hero__inner container">
      <nav class="eng-svc-breadcrumb" aria-label="Breadcrumb">
        <a href="engenharia/index.html">Serviços de Engenharia</a>
        <span>/</span>
        <a href="{vertical_arquivo}">{vertical_nome}</a>
        <span>/</span>
        <span class="is-current">{s['nome']}</span>
      </nav>
      <span class="sol-badge" data-reveal><i class="{s['icone']}"></i> {vertical_nome}</span>
      <h1 data-reveal data-d="1">{s['nome']}</h1>
      <p class="sol-hero__lead" data-reveal data-d="2">{s['hero_lead']}</p>
      <div class="sol-hero__cta" data-reveal data-d="3">
        <a class="btn btn--primary" href="engenharia/index.html#contato-eng">Solicitar orçamento <i class="fas fa-arrow-right"></i></a>
        <a class="btn btn--ghost" href="{vertical_arquivo}">Ver todos os serviços de {v['curto']}</a>
      </div>
    </div>
  </header>
{marca}
  <!-- ============ FAIXA DE FATOS (roxo sólido) ============ -->
  <section class="section eng-svc-dark" style="padding-top:clamp(48px,6vw,72px);padding-bottom:clamp(48px,6vw,72px);">
    <div class="container">
      <div class="eng-svc-strip">
{fatos}
      </div>
    </div>
  </section>

  <!-- ============ O QUE É (fundo tingido + prancha real) ============ -->
  <section class="section eng-svc-about">
    <div class="container">
      <div class="sol-split">
        <div class="sol-split__head">
          <span class="kicker" data-reveal>O que é</span>
          <h2 class="h2" data-reveal data-d="1">{s['oque_titulo']}</h2>
          <p class="lead" data-reveal data-d="2">{s['oque_p1']}</p>
          <p class="lead" data-reveal data-d="3">{s['oque_p2']}</p>
        </div>
        <div class="sol-split__media" data-reveal data-d="2">
          <div class="ph"><img src="assets/img/engenharia/{vertical}/{img_sobre}" alt="{img_alt}" loading="lazy"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ POR QUE IMPORTA — palco 3D ============ -->
  <section class="section" style="position:relative;overflow:hidden;">
    <div class="eng-scroll-stage" data-scroll-stage>
      <div class="eng-scroll-stage__frame">
        <div class="container">
          <div class="sol-head sol-head--center">
            <span class="kicker" data-reveal>{s['custo_kicker']}</span>
            <h2 class="h2" data-reveal data-d="1">{s['custo_titulo']}</h2>
            <p class="lead" data-reveal data-d="2">{s['custo_lead']}</p>
          </div>
          <div class="sol-grid sol-grid--3">
{cards(s['custo_cards'])}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ TABELA DE ESCOPO ============ -->
  <section class="section">
    <div class="container" style="max-width:900px;">
      <div class="sol-head">
        <span class="kicker" data-reveal>{s['tab_kicker']}</span>
        <h2 class="h2" data-reveal data-d="1">{s['tab_titulo']}</h2>
        <p class="lead" data-reveal data-d="2">{s['tab_lead']}</p>
      </div>
{tabela(s['tab_th'], s['tab_rows'])}
    </div>
  </section>

  <!-- ============ COMO FUNCIONA — palco 3D ============ -->
  <section class="section" style="position:relative;overflow:hidden;">
    <div class="eng-scroll-stage" data-scroll-stage>
      <div class="eng-scroll-stage__frame">
        <div class="container" style="max-width:820px;">
          <div class="sol-head">
            <span class="kicker" data-reveal>Como funciona</span>
            <h2 class="h2" data-reveal data-d="1">{s['como_titulo']}</h2>
          </div>
          <div class="sol-steps">
{steps(s['steps'])}
          </div>
        </div>
      </div>
    </div>
  </section>

{bloco_carrossel(vertical, s['carrossel_lead'], PRANCHAS)}

  <!-- ============ QUANDO CONTRATAR ============ -->
  <section class="section">
    <div class="container" style="max-width:820px;">
      <div class="sol-head">
        <span class="kicker" data-reveal>{s['quando_kicker']}</span>
        <h2 class="h2" data-reveal data-d="1">{s['quando_titulo']}</h2>
      </div>
{checks(s['quando_itens'], escuro=False)}
    </div>
  </section>

  <!-- ============ O QUE VOCÊ RECEBE ============ -->
  <section class="section" style="background:var(--surface-2);">
    <div class="container">
      <div class="sol-head sol-head--center">
        <span class="kicker" data-reveal>A entrega</span>
        <h2 class="h2" data-reveal data-d="1">{s['recebe_titulo']}</h2>
      </div>
      <div class="sol-grid sol-grid--3">
{cards(s['recebe_cards'])}
      </div>
    </div>
  </section>

  <!-- ============ REFERÊNCIAS / DIFERENCIAIS TÉCNICOS ============ -->
  <section class="section">
    <div class="container">
      <div class="sol-head sol-head--center">
        <span class="kicker" data-reveal>{s['ref_kicker']}</span>
        <h2 class="h2" data-reveal data-d="1">{s['ref_titulo']}</h2>
        <p class="lead" data-reveal data-d="2">{s['ref_lead']}</p>
      </div>
      <div class="sol-grid sol-grid--3">
{cards(s['ref_cards'])}
      </div>
    </div>
  </section>

  <!-- ============ POR QUE A 4WATT (roxo sólido) ============ -->
  <section class="section eng-svc-dark">
    <div class="container" style="max-width:820px;">
      <div class="sol-head">
        <span class="kicker" data-reveal>Diferencial</span>
        <h2 class="h2" data-reveal data-d="1">{s['porque_titulo']}</h2>
      </div>
{checks(s['porque_checks'])}
      <div style="margin-top:36px;" data-reveal data-d="2">
        <a class="btn btn--primary" href="engenharia/index.html#contato-eng">{s['porque_cta']} <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>
  </section>

  <!-- ============ FAQ ============ -->
  <section class="section" style="background:var(--surface-2);">
    <div class="container" style="max-width:820px;">
      <div class="sol-head">
        <span class="kicker" data-reveal>Perguntas frequentes</span>
        <h2 class="h2" data-reveal data-d="1">{s['faq_titulo']}</h2>
      </div>
      <div class="acc" data-accordion data-stagger>
{faq(s['faq'])}
      </div>
    </div>
  </section>

  <!-- ============ CTA FINAL — roxo sólido com vídeo de fundo ============ -->
  <section class="section eng-page-cta eng-cta-video">
    <div class="eng-cta-video__media">
      <video autoplay muted loop playsinline preload="none" poster="assets/img/engenharia/{vertical}/{capa}">
        <source src="assets/4watt-servicos-engenharia.mp4" type="video/mp4">
      </video>
    </div>
    <div class="container">
      <span class="kicker" data-reveal>Fale com a engenharia 4WaTT</span>
      <h2 class="h2" data-reveal data-d="1">{s['cta_titulo']}</h2>
      <p data-reveal data-d="2">Fale com um especialista e receba o próximo passo técnico em até 1 dia útil.</p>
      <div style="margin-top:28px;">
        <a class="btn btn--primary" href="engenharia/index.html#contato-eng">Falar com um especialista <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>
  </section>

{FOOTER}

  <script src="assets/js/languages.js?v=2.8"></script>
  <script src="/assets/js/languages-pages.js?v=1.3"></script>
  <script src="assets/js/main.js?v=1.5"></script>
  <script src="assets/js/site-premium.js?v=2.4"></script>
  <script src="assets/js/engenharia.js?v=0.3"></script>

{dados_estruturados}
</body>

</html>
"""


# --------------------------------------------------------------------------
# Conteúdo por serviço — um módulo irmão por vertical, para manter este arquivo legível
# --------------------------------------------------------------------------

def carregar_vertical(slug):
    """Junta a config da vertical com o conteúdo do módulo conteudo_{slug}.py."""
    if slug not in VERTICAIS:
        sys.exit(f"Vertical desconhecida: {slug}. Conhecidas: {', '.join(VERTICAIS)}")
    mod = importlib.import_module(f"conteudo_{slug}")
    v = dict(VERTICAIS[slug])
    v["servicos"] = mod.SERVICOS
    v["pranchas"] = mod.PRANCHAS
    v["imagem_sobre"] = mod.IMAGEM_SOBRE
    v["alt_prancha"] = mod.ALT_PRANCHA
    return v


def gerar(slug):
    v = carregar_vertical(slug)
    destino = os.path.join(RAIZ, "engenharia", slug)
    os.makedirs(destino, exist_ok=True)

    for s in v["servicos"]:
        caminho = os.path.join(destino, s["slug"] + ".html")
        with open(caminho, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(montar(s, v))
        print(f"  ok  {slug}/{s['slug']}.html")

    print(f"\n{len(v['servicos'])} pagina(s) gerada(s) em engenharia/{slug}/")
    return len(v["servicos"])


def main():
    alvos = sys.argv[1:] or list(VERTICAIS)
    total = sum(gerar(slug) for slug in alvos)
    print(f"\nTotal: {total} pagina(s).")
    print("Nao regerado (referencia aprovada a mao): eletrica/qualidade-de-energia.html")


if __name__ == "__main__":
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    main()
