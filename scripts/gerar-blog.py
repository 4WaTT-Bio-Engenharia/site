# -*- coding: utf-8 -*-
"""Gera arquivos estáticos do blog. Executar da raiz: python scripts/gerar-blog.py.

Não é um build do site: apenas sincroniza catálogo, arquivos de navegação e feed.
HTML de artigos continua sendo editado nos arquivos originais, sem mudar URLs.
"""
import html
import argparse
import json
import re
import sys
import xml.etree.ElementTree as ET
from datetime import date, datetime, timezone
from email.utils import format_datetime
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://4watt.tech"
TODAY = date.today()
DATA = ROOT / "data/blog"
CATALOG = json.loads((DATA / "catalogo.json").read_text(encoding="utf-8"))
UI = json.loads((DATA / "interface.json").read_text(encoding="utf-8"))
POSTS = CATALOG["posts"]
THEMES = {t["id"]: t for t in CATALOG["themes"]}
TAGS = {t["id"]: t for t in CATALOG["tags"]}
TRANSLATIONS = {"pt": {}, "en": {}}


def write_changed(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.read_text(encoding="utf-8") == content:
        return False
    path.write_text(content, encoding="utf-8", newline="\n")
    return True


def plain(value):
    return " ".join(html.unescape(re.sub(r"<[^>]*>", " ", value)).split())


def esc(value):
    return html.escape(str(value), quote=True)


def key(name, values):
    for lang in ("pt", "en"):
        TRANSLATIONS[lang][name] = values[lang]
    return name


for name, values in UI.items():
    key(name, dict(zip(("pt", "en"), values)))
for group, items in (("theme", THEMES), ("tag", TAGS)):
    for slug, item in items.items():
        key(f"blog_{group}_{slug}", {lang: item[lang] for lang in ("pt", "en")})
        key(f"blog_{group}_{slug}_description", item["description"])
for post in POSTS:
    for field in ("title", "excerpt", "imageAlt"):
        key(f"blog_post_{post['id']}_{field}", post[field])
key('art2_h1', {lang: next(p for p in POSTS if p['id']=='regulacao-biometano')['title'][lang] for lang in ('pt','en')})


def tr(name, tag="span", attrs=""):
    return f'<{tag} data-i18n="{name}" {attrs}>{TRANSLATIONS["pt"][name]}</{tag}>'


class SearchText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ignored = 0
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "nav", "footer"):
            self.ignored += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style", "nav", "footer"):
            self.ignored = max(0, self.ignored - 1)

    def handle_data(self, text):
        if not self.ignored:
            self.parts.append(text)


def search_text(post):
    source = (ROOT / post["url"].lstrip("/")).read_text(encoding="utf-8")
    article = re.search(r'<article class="article-content">(.*?)</article>', source, re.S)
    main = re.search(r'<main\b[^>]*>(.*?)</main>', source, re.S)
    body = (article or main).group(1) if (article or main) else source
    # Não fazer um artigo aparecer só porque outro texto é sugerido no rodapé.
    body = re.split(r'<(?:div|section)\b[^>]*class="(?:author-box|related-articles|article-academy-cta|social-share|blog-post-discovery)[^"]*"', body, maxsplit=1)[0]
    parser = SearchText()
    parser.feed(body)
    return " ".join(" ".join(parser.parts).split())


def validate():
    ids = [p["id"] for p in POSTS]
    assert len(ids) == len(set(ids)), "IDs de artigos duplicados"
    assert len(TAGS) == 15, "Manter os 15 assuntos editoriais"
    for post in POSTS:
        assert post["theme"] in THEMES
        assert all(t in TAGS for t in post["tags"])
        assert (ROOT / post["url"].lstrip("/")).is_file(), post["url"]
        assert (ROOT / post["image"].lstrip("/")).is_file(), post["image"]
        date.fromisoformat(post["published"])
        for field in ("title", "excerpt", "imageAlt"):
            assert all(post[field].get(lang) for lang in ("pt", "en"))
    featured = CATALOG["editorialFeatured"]
    assert len(featured) == 6 and len(set(featured)) == 6
    assert all(i in ids for i in featured)


def absolute_assets(markup):
    def replace(match):
        attr, value = match.groups()
        if value.startswith(("/", "http:", "https:", "mailto:", "tel:", "data:")):
            return match.group(0)
        if value.startswith("#"):
            value = "index.html" + value
        return f'{attr}="/{value}"'
    return re.sub(r'(href|src)="([^"]+)"', replace, markup)


def shared_markup():
    home = (ROOT / "index.html").read_text(encoding="utf-8")
    nav = re.search(r'<nav class="nav">.*?</nav>', home, re.S).group(0)
    footer = re.search(r'<footer class="footer">.*?</footer>', home, re.S).group(0)
    return absolute_assets(nav), absolute_assets(footer)


def archive_url(group, slug):
    return f'/artigos/{"temas" if group == "theme" else "tags"}/{slug}/'


def tag_link(slug):
    return tr(f"blog_tag_{slug}", "a", f'href="{archive_url("tag", slug)}" rel="tag" class="blog-tag"')


def card(post, featured=False):
    pid = post["id"]
    heading = f"blog_post_{pid}_title"
    image = post.get("thumbnail", post["image"])
    stamp = date.fromisoformat(post["published"]).strftime("%d.%m.%Y")
    kind = "blog-feature-card" if featured else "blog-card"
    badge = tr("blog_historical", "span", 'class="blog-history"') if post.get("historical") else ""
    tags = "" if featured else '<div class="blog-card__tags">' + "".join(tag_link(t) for t in post["tags"][:2]) + '</div>'
    markup = f'''<article class="{kind}" data-post-id="{pid}" data-theme="{post['theme']}" data-tags="{' '.join(post['tags'])}" data-published="{post['published']}">
      <a class="{kind}__image" href="{post['url']}" tabindex="-1" aria-hidden="true"><img src="{esc(image)}" alt="{esc(post['imageAlt']['pt'])}" data-i18n-alt="blog_post_{pid}_imageAlt" width="720" height="440" loading="lazy" decoding="async"></a>
      <div class="{kind}__body">{tr('blog_theme_' + post['theme'], 'span', 'class="blog-overline"')}{badge}
      <h3>{tr(heading, 'a', f'href="{post["url"]}"')}</h3>
      {tr('blog_post_' + pid + '_excerpt', 'p', 'class="blog-card__excerpt"') if not featured else ''}
      {tags}<div class="blog-card__meta"><time datetime="{post['published']}">{stamp}</time><span aria-hidden="true">·</span><span>{post['minutes']} {tr('blog_minutes')}</span></div>
      </div></article>'''
    return '\n'.join(line.rstrip() for line in markup.split('\n'))


def sidebar(group="", slug=""):
    links = [tr("blog_all", "a", f'href="/artigos/" class="blog-topic {"is-active" if not slug else ""}"' + (' aria-current="page"' if not slug else ''))]
    for tid, theme in THEMES.items():
        count = sum(p["theme"] == tid for p in POSTS)
        active = group == "theme" and slug == tid
        links.append(f'<a class="blog-topic {"is-active" if active else ""}" href="{archive_url("theme", tid)}" {"aria-current=page" if active else ""}>{tr("blog_theme_" + tid)}<span class="blog-count">{count}</span></a>')
    tag_links = []
    for tid in TAGS:
        count = sum(tid in p["tags"] for p in POSTS)
        active = group == "tag" and slug == tid
        tag_links.append(f'<a href="{archive_url("tag", tid)}" class="blog-side-tag {"is-active" if active else ""}" {"aria-current=page" if active else ""}>{tr("blog_tag_" + tid)}<span class="blog-count">{count if count else tr("blog_soon")}</span></a>')
    return f'''<aside class="blog-sidebar"><details open><summary>{tr('blog_topics')}</summary><nav aria-label="Temas do blog">{''.join(links)}</nav></details>
      <details class="blog-tag-list"><summary>{tr('blog_tags')}</summary><nav aria-label="Assuntos do blog">{''.join(tag_links)}</nav></details>
      <div class="blog-sidebar__links">{tr('blog_feed', 'a', 'href="/artigos/feed.xml"')}<br>{tr('blog_editorial_link', 'a', 'href="/artigos/#politica-editorial"')}</div></aside>'''


def page_head(title, description, url, graph, noindex=False):
    schema = json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False).replace('</', '<\\/')
    return f'''<!DOCTYPE html>
<html lang="pt-br"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title><meta name="description" content="{esc(description)}">
<meta name="robots" content="{'noindex, follow' if noindex else 'index, follow, max-image-preview:large'}">
<link rel="canonical" href="{BASE}{url}"><link rel="icon" href="/assets/img/favicon.png">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="4WaTT Bio Engenharia">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}"><meta property="og:url" content="{BASE}{url}"><meta property="og:image" content="{BASE}/assets/img/og-4watt.jpg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title)}"><meta name="twitter:description" content="{esc(description)}"><meta name="twitter:image" content="{BASE}/assets/img/og-4watt.jpg">
<link rel="alternate" type="application/rss+xml" title="Blog 4WaTT" href="/artigos/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<link rel="stylesheet" href="/assets/css/theme-4watt.css?v=4.0"><link rel="stylesheet" href="/assets/css/blog.css?v=1.3"><link rel="stylesheet" href="/assets/css/mobile-fixes.css?v=2">
<script type="application/ld+json">{schema}</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-N91NFD55MB"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-N91NFD55MB');</script>
</head>'''


def render_archive(nav, footer, group="", slug=""):
    selected = [p for p in POSTS if not slug or (p["theme"] == slug if group == "theme" else slug in p["tags"])]
    selected.sort(key=lambda p: (p["published"], p["id"]), reverse=True)
    url = archive_url(group, slug) if slug else "/artigos/"
    item = (THEMES if group == "theme" else TAGS).get(slug)
    title = f'{item["pt"]}: artigos e guias | Blog 4WaTT' if item else "Blog 4WaTT | Biogás, Biometano e Engenharia"
    description = item["description"]["pt"] if item else "Guias de biogás e biometano, engenharia, viabilidade e descarbonização. Explore artigos e cases da 4WaTT por tema e assunto."
    graph = [
        {"@type": "Blog", "@id": BASE + "/artigos/#blog", "name": "Blog 4WaTT", "url": BASE + "/artigos/", "inLanguage": "pt-BR", "publisher": {"@type": "Organization", "name": "4WaTT Bio Engenharia", "url": BASE}},
        {"@type": "CollectionPage", "@id": BASE + url + "#page", "url": BASE + url, "name": title, "description": description, "isPartOf": {"@id": BASE + "/artigos/#blog"}, "mainEntity": {"@id": BASE + url + "#articles"}},
        {"@type": "ItemList", "@id": BASE + url + "#articles", "itemListElement": [{"@type":"ListItem", "position":i+1, "url":BASE+p["url"], "name":p["title"]["pt"]} for i,p in enumerate(selected)]},
        {"@type":"BreadcrumbList", "itemListElement":[{"@type":"ListItem","position":1,"name":"4WaTT","item":BASE+"/"},{"@type":"ListItem","position":2,"name":"Blog","item":BASE+"/artigos/"}] + ([{"@type":"ListItem","position":3,"name":item["pt"],"item":BASE+url}] if item else [])}
    ]
    heading_key = f"blog_{group}_{slug}" if item else "blog_title"
    intro_key = f"blog_{group}_{slug}_description" if item else "blog_intro"
    featured = ""
    if not slug:
        pool = {p["id"]:p for p in POSTS}
        featured = f'''<section class="blog-featured" aria-labelledby="blog-featured-title"><div class="blog-section-heading"><div>{tr('blog_featured', 'h2', 'id="blog-featured-title"')}{tr('blog_editorial', 'p', 'id="blog-featured-mode"')}</div>
        <div class="blog-carousel-controls"><button type="button" data-feature-prev data-i18n-aria-label="blog_previous" aria-label="Destaques anteriores">←</button><span data-feature-page aria-live="polite">1 / 2</span><button type="button" data-feature-next data-i18n-aria-label="blog_next" aria-label="Próximos destaques">→</button></div></div>
        <div class="blog-featured__viewport" data-marquee data-marquee-paged tabindex="0" role="region" aria-roledescription="carrossel" aria-label="Artigos em destaque" data-i18n-aria-label="blog_carousel"><div class="blog-featured__track">{''.join(card(pool[i],True) for i in CATALOG['editorialFeatured'])}</div></div>
        <template id="blog-feature-pool">{''.join(card(p,True) for p in POSTS)}</template></section>'''
    all_link = tr('blog_all', 'a', 'href="/artigos/" class="blog-button"')
    empty = f'<div class="blog-empty-topic">{tr("blog_soon", "h2")}{tr("blog_empty_tag", "p")}{all_link}</div>' if not selected else ""
    cta = f'''<section class="blog-cta">{tr('blog_cta_eyebrow', 'p', 'class="blog-overline"')}{tr('blog_cta_title','h2')}{tr('blog_cta_text','p')}<div class="blog-cta__actions">{tr('blog_calculator','a','href="/calculadora/" class="blog-button"')}{tr('blog_contact','a','href="/contato.html" class="blog-button blog-button--outline"')}</div></section>'''
    policy = f'''<section class="blog-policy" id="politica-editorial">{tr('blog_policy_title','h2')}{tr('blog_policy_text','p')}<p>{tr('blog_policy_sources')}: <a href="https://www.gov.br/anp/pt-br" rel="noopener" target="_blank">ANP ↗</a> · <a href="https://www.epe.gov.br/" rel="noopener" target="_blank">EPE ↗</a></p></section>''' if not slug else ""
    client = {"posts": [{**p, "searchText": search_text(p)} for p in POSTS], "themes":CATALOG["themes"], "tags":CATALOG["tags"]}
    payload = json.dumps(client, ensure_ascii=False).replace("</", "<\\/")
    content = page_head(title,description,url,graph,not selected) + f'''
<body class="t4 blog-page" data-blog-archive="{esc(slug)}" data-blog-group="{group}"><div class="bg-aurora bg-aurora--light"></div>
{tr('blog_skip','a','href="#blog-main" class="blog-skip"')}{nav}
<div class="blog-shell">{sidebar(group,slug)}<main id="blog-main" class="blog-main">
<header class="blog-hero"><nav class="blog-breadcrumb" aria-label="Breadcrumb"><a href="/">4WaTT</a><span aria-hidden="true">/</span>{tr('blog_name','a','href="/artigos/"')}{('<span aria-hidden="true">/</span>' + tr(heading_key)) if slug else ''}</nav>
{tr('blog_eyebrow','p','class="blog-overline"')}{tr(heading_key,'h1')}{tr(intro_key,'p','class="blog-hero__lead"')}
<form role="search" class="blog-search" action="/artigos/" method="get"><label for="blog-search" class="blog-visually-hidden" data-i18n="blog_search_label">Pesquisar no blog</label><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input id="blog-search" type="search" name="q" autocomplete="off" maxlength="200" placeholder="O que você quer entender hoje?" data-i18n-placeholder="blog_search_placeholder" aria-describedby="blog-search-help"><kbd aria-hidden="true">Ctrl K</kbd></form>{tr('blog_search_hint','p','id="blog-search-help" class="blog-search__hint"')}
</header>{featured}
<section class="blog-library" id="conteudos" aria-labelledby="blog-library-title"><div class="blog-section-heading"><div>{tr('blog_library','h2','id="blog-library-title"')}<p id="blog-result-count" role="status" aria-live="polite">{len(selected)} {tr('blog_result' if len(selected)==1 else 'blog_results')}</p></div><label class="blog-sort"><span class="blog-visually-hidden" data-i18n="blog_sort">Ordenar artigos</span><select id="blog-sort"><option value="recent" data-i18n="blog_recent">Mais recentes</option><option value="oldest" data-i18n="blog_oldest">Mais antigos</option></select></label></div>
<div class="blog-active-filters" id="blog-active-filters" hidden><span data-filter-description></span><button type="button" id="blog-clear" data-i18n="blog_clear">Limpar filtros</button></div>
<div class="blog-grid" id="blog-results">{''.join(card(p) for p in selected)}</div>{empty}
<div class="blog-empty" id="blog-empty" hidden>{tr('blog_no_results','h3')}{tr('blog_no_results_help','p')}<button type="button" data-clear-search data-i18n="blog_clear">Limpar filtros</button></div>
<noscript><p>Use os temas e assuntos para navegar. A busca interativa precisa de JavaScript.</p></noscript></section>{cta}{policy}
</main></div>{footer}
<script id="blog-catalog" type="application/json">{payload}</script>
<script src="/assets/js/languages.js?v=2.8"></script><script src="/assets/js/languages-pages.js?v=1.8"></script><script src="/assets/js/main.js?v=1.5"></script><script src="/assets/js/site-premium.js?v=2.5"></script><script src="/assets/js/blog.js?v=1.1"></script><script src="/assets/js/blog-interactions.js?v=1.0"></script>
</body></html>'''
    return url, content, bool(selected)


def update_translations():
    path = ROOT / "assets/js/languages-pages.js"
    source = path.read_text(encoding="utf-8").split("/* BLOG 4WATT: INICIO GERADO */")[0].rstrip()
    extra = '\n\n/* BLOG 4WATT: INICIO GERADO */\n// Fonte: data/blog/interface.json e catalogo.json. Atualizar com scripts/gerar-blog.py.\n(function () {\n  if (!window.translations) return;\n'
    for lang in ("pt", "en"):
        extra += f'  Object.assign(window.translations.{lang}, ' + json.dumps(TRANSLATIONS[lang],ensure_ascii=False,indent=2) + ');\n'
    extra += '})();\n/* BLOG 4WATT: FIM GERADO */\n'
    write_changed(path,source+extra)


def rss():
    ET.register_namespace("atom", "http://www.w3.org/2005/Atom")
    root = ET.Element("rss", version="2.0")
    channel = ET.SubElement(root,"channel")
    for name, value in (("title","Blog 4WaTT"),("link",BASE+"/artigos/"),("description","Biogás, biometano e engenharia na prática."),("language","pt-BR")):
        ET.SubElement(channel,name).text=value
    ET.SubElement(channel,"{http://www.w3.org/2005/Atom}link",href=BASE+"/artigos/feed.xml",rel="self",type="application/rss+xml")
    for post in sorted(POSTS,key=lambda p:p["published"],reverse=True):
        item = ET.SubElement(channel,"item")
        dt = datetime.fromisoformat(post["published"]).replace(tzinfo=timezone.utc)
        for name,value in (("title",post["title"]["pt"]),("link",BASE+post["url"]),("guid",BASE+post["url"]),("description",post["excerpt"]["pt"]),("pubDate",format_datetime(dt))):
            ET.SubElement(item,name).text=value
        for tag in post["tags"]:
            ET.SubElement(item,"category").text=TAGS[tag]["pt"]
    ET.indent(root,space="  ")
    write_changed(ROOT/"artigos/feed.xml",'<?xml version="1.0" encoding="utf-8"?>\n'+ET.tostring(root,encoding="unicode")+'\n')


def sitemap(entries, changed):
    path=ROOT/"sitemap.xml"
    source=path.read_text(encoding="utf-8")
    for url in entries:
        block=f'  <url>\n    <loc>{BASE}{url}</loc>\n    <lastmod>{TODAY.isoformat()}</lastmod>\n  </url>'
        pattern=r'  <url>\s*<loc>'+re.escape(BASE+url)+r'</loc>.*?</url>'
        if re.search(pattern,source,re.S):
            if url not in changed:
                continue
            old=re.search(pattern,source,re.S).group(0)
            source=source.replace(old,block)
        else:
            source=source.replace('</urlset>',block+'\n</urlset>')
    write_changed(path,source)


def sync_articles():
    """Adiciona descoberta e corrige metadados, preservando conteúdo e URLs reais."""
    changed=[]
    for post in POSTS:
        path=ROOT/post['url'].lstrip('/')
        source=path.read_text(encoding='utf-8')
        original=source
        canonical=BASE+post['url']
        old=re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"',source)
        if old and old.group(1)!=canonical:
            old_url=old.group(1)
            source=source.replace(old_url,canonical)
            if old_url.startswith(BASE+'/artigos/'):
                alias=ROOT/old_url[len(BASE)+1:]/'index.html'
                redirect(alias,post['url'])
        if '/assets/css/blog.css?v=1.3' not in source:
            source=source.replace('</head>','  <link rel="stylesheet" href="/assets/css/blog.css?v=1.3">\n</head>')
        if '/assets/js/blog-interactions.js?v=1.0' not in source:
            source=source.replace('</body>','  <script src="/assets/js/blog-interactions.js?v=1.0"></script>\n</body>')
        source=re.sub(r'<span class="social-share__label"[^>]*>.*?</span>',tr('blog_share','span','class="social-share__label"'),source,flags=re.S)
        def copy_button(match):
            identity=' id="copyLinkBtn"' if 'id="copyLinkBtn"' in match.group(0) else ''
            return '<button class="social-btn social-btn--copy" type="button" data-copy-article'+identity+'><span data-copy-label data-i18n="blog_copy_link">Copiar link</span></button><p class="blog-copy-status" role="status" data-copy-status aria-live="polite"></p>'
        source=re.sub(r'<button\b[^>]*class="social-btn social-btn--copy"[\s\S]*?</button>(?:<p class="blog-copy-status"[^>]*>.*?</p>)?',copy_button,source)
        if 'googletagmanager.com/gtag/js' not in source:
            ga='''<script async src="https://www.googletagmanager.com/gtag/js?id=G-N91NFD55MB"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-N91NFD55MB');</script>'''
            source=source.replace('</head>',ga+'\n</head>')
        source=re.sub(r'\n?<!-- BLOG DESCOBERTA INICIO -->.*?<!-- BLOG DESCOBERTA FIM -->\n?', '', source, flags=re.S)
        source=re.sub(r'<div class="container container--narrow">\s*</div>', '', source)
        panel=f'''\n<!-- BLOG DESCOBERTA INICIO --><section class="blog-post-discovery" aria-label="Assuntos relacionados">{tr('blog_article_topics','h2')}<div class="blog-post-discovery__tags">{''.join(tag_link(t) for t in post['tags'])}</div>{tr('blog_back','a','href="/artigos/"')}</section><!-- BLOG DESCOBERTA FIM -->\n'''
        if '<article class="article-content">' in source:
            source=source.replace('</article>',panel+'</article>',1)
        else:
            panel=panel.replace('<!-- BLOG DESCOBERTA INICIO -->','<!-- BLOG DESCOBERTA INICIO --><div class="container container--narrow">').replace('<!-- BLOG DESCOBERTA FIM -->','</div><!-- BLOG DESCOBERTA FIM -->')
            source=source.replace('</main>',panel+'</main>',1)
        if post.get('historical'):
            source=re.sub(r'\n?<!-- BLOG NOTA INICIO -->.*?<!-- BLOG NOTA FIM -->\n?', '', source, flags=re.S)
            note=f'''\n<!-- BLOG NOTA INICIO --><aside class="blog-post-discovery blog-regulatory-note">{tr('blog_regulatory_note','p')}{tr('blog_official_source','a','href="https://www.gov.br/anp/pt-br/assuntos/producao-e-fornecimento-de-biocombustiveis/biometano/biometano" rel="noopener" target="_blank"')}</aside><!-- BLOG NOTA FIM -->\n'''
            source=source.replace('<article class="article-content">','<article class="article-content">'+note,1)
            source=re.sub(r'(<h1[^>]*data-i18n="art2_h1"[^>]*>).*?(</h1>)',lambda m:m.group(1)+post['title']['pt']+m.group(2),source,flags=re.S)
        # Metadados sociais e canônicos usam a URL que de fato existe no servidor.
        source=re.sub(r'(<meta\s+(?:property|name)="(?:og:url)"\s+content=")[^"]+',lambda m:m.group(1)+canonical,source)
        def schema(match):
            try:
                data=json.loads(match.group(1))
            except ValueError:
                return match.group(0)
            if data.get('@type')!='Article':
                return match.group(0)
            data.update({'mainEntityOfPage':{'@type':'WebPage','@id':canonical},'isPartOf':{'@type':'Blog','@id':BASE+'/artigos/#blog'},'keywords':[TAGS[t]['pt'] for t in post['tags']],'articleSection':THEMES[post['theme']]['pt']})
            if not data.get('image'):
                data['image']=BASE+post['image']
            if isinstance(data.get('author'),dict):
                data['author']['url']=BASE+'/artigos/#politica-editorial'
            if post.get('modified'):
                data['dateModified']=post['modified']
            if post.get('historical'):
                data['headline']=post['title']['pt']
                data['description']=post['excerpt']['pt']
                data['dateModified']='2026-10-22'
            return '<script type="application/ld+json">\n'+json.dumps(data,ensure_ascii=False,indent=2)+'\n</script>'
        source=re.sub(r'<script type="application/ld\+json">(.*?)</script>',schema,source,flags=re.S)
        if post.get('historical'):
            for attribute in ('og:title','twitter:title'):
                source=re.sub(r'(<meta\s+(?:property|name)="'+attribute+r'"\s+content=")[^"]+',lambda m:m.group(1)+esc(post['title']['pt']),source)
            source=re.sub(r'<title>.*?</title>',f"<title>{esc(post['title']['pt'])} | 4WaTT</title>",source,count=1,flags=re.S)
            for attribute in ('description','og:description','twitter:description'):
                source=re.sub(r'(<meta\s+(?:property|name)="'+attribute+r'"\s+content=")[^"]+',lambda m:m.group(1)+esc(post['excerpt']['pt']),source)
        source=re.sub(r'(?m)^[ \t]+(?=\n<!-- BLOG)', '', source)
        if source!=original:
            write_changed(path,source)
            changed.append(post['url'])
    return changed


def redirect(path,target):
    markup=f'''<!doctype html><html lang="pt-br"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Blog 4WaTT</title><link rel="canonical" href="{BASE}{target}"><meta http-equiv="refresh" content="0;url={target}"></head><body><p><a href="{target}">Acessar o Blog 4WaTT</a></p><script>location.replace({json.dumps(target)}+location.search+location.hash);</script></body></html>\n'''
    write_changed(path,markup)


def main():
    global TODAY
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--date',type=date.fromisoformat,default=TODAY,help='Data real da edição; lastmod só muda em arquivos alterados.')
    TODAY=parser.parse_args().date
    validate()
    changed=sync_articles()
    nav,footer=shared_markup()
    entries=[]
    for group,items in (("", {"":None}),("theme",THEMES),("tag",TAGS)):
        for slug in items:
            url,markup,indexable=render_archive(nav,footer,group,slug)
            if write_changed(ROOT/url.lstrip("/")/"index.html",markup):
                changed.append(url)
            if indexable:
                entries.append(url)
    update_translations()
    rss()
    sitemap(entries+[p['url'] for p in POSTS],changed)
    redirect(ROOT/'blog.html','/artigos/')
    print(f'Blog gerado: {len(POSTS)} conteúdos, {len(THEMES)} temas, {len(TAGS)} tags; {len(entries)} páginas indexáveis.')


if __name__=="__main__":
    main()
