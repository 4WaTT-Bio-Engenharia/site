# -*- coding: utf-8 -*-
"""Verificações sem rede: SEO estático, arquivos e agregação do ranking GA4."""
import importlib.util
import json
import re
import unittest
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("blog_metrics", ROOT / "scripts/atualizar-destaques-blog.py")
metrics = importlib.util.module_from_spec(spec)
spec.loader.exec_module(metrics)
CATALOG = json.loads((ROOT / "data/blog/catalogo.json").read_text(encoding="utf-8"))


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.links = []
        self.canonical = []
        self.images = []
        self.h1 = 0
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical.append(attrs['href'])
        if tag == 'img':
            self.images.append(attrs.get('src',''))
        if tag == 'h1':
            self.h1 += 1


class BlogTests(unittest.TestCase):
    def test_ranking_aggregates_and_excludes_foreign_paths(self):
        posts = CATALOG['posts'][:7]
        def row(path, n):
            return {'dimensionValues':[{'value':path}], 'metricValues':[{'value':str(n)}]}
        rows = [row(p['url'], (i+1)*10) for i,p in enumerate(posts)]
        rows.extend([row(posts[0]['url'],100),row('/contato.html',999999)])
        views = metrics.aggregate_report({'rows':rows}, posts)
        ranked = metrics.rank(posts,views)
        self.assertEqual(views[posts[0]['id']],110)
        self.assertEqual(ranked[0],posts[0]['id'])
        self.assertEqual(len(ranked),6)
        self.assertEqual(len(set(ranked)),6)
        self.assertEqual(set(views),{p['id'] for p in posts})

    def test_insufficient_data_never_claims_six_popular_articles(self):
        self.assertEqual(metrics.rank(CATALOG['posts'],{}),[])
        self.assertEqual(metrics.rank(CATALOG['posts'],{p['id']:5 for p in CATALOG['posts'][:5]}),[])

    def test_request_is_scoped_to_production_and_complete_days(self):
        report = metrics.report_request(CATALOG['posts'])
        self.assertEqual(report['dateRanges'],[{'startDate':'30daysAgo','endDate':'yesterday'}])
        filters = report['dimensionFilter']['andGroup']['expressions']
        self.assertEqual(filters[0]['filter']['inListFilter']['values'],['4watt.tech','www.4watt.tech'])
        self.assertEqual(len(filters[1]['filter']['inListFilter']['values']),len(CATALOG['posts']))

    def test_generated_html_is_crawlable_and_links_resolve(self):
        files = [ROOT/'artigos/index.html', *sorted((ROOT/'artigos/temas').rglob('index.html')), *sorted((ROOT/'artigos/tags').rglob('index.html'))]
        self.assertEqual(len(files),1+len(CATALOG['themes'])+len(CATALOG['tags']))
        for path in files:
            with self.subTest(page=str(path.relative_to(ROOT))):
                source = path.read_text(encoding='utf-8')
                doc = Document(source)
                self.assertEqual(doc.h1,1)
                self.assertEqual(len(doc.canonical),1)
                for url in [*doc.links,*doc.images]:
                    parsed=urlsplit(url)
                    if parsed.scheme or parsed.netloc or not parsed.path:
                        continue
                    target = ROOT / unquote(parsed.path).lstrip('/')
                    if parsed.path.endswith('/'):
                        target=target/'index.html'
                    self.assertTrue(target.is_file(),f'{path.name}: {url}')
                for schema in re.findall(r'<script type="application/ld\+json">(.*?)</script>',source,re.S):
                    json.loads(schema)
                self.assertIn('og:title',source)
                self.assertIn('twitter:card',source)

    def test_article_canonicals_match_real_files(self):
        for post in CATALOG['posts']:
            source=(ROOT/post['url'].lstrip('/')).read_text(encoding='utf-8')
            self.assertEqual(Document(source).canonical,['https://4watt.tech'+post['url']])
            self.assertIn('googletagmanager.com/gtag/js?id=G-N91NFD55MB',source)
            self.assertIn('BLOG DESCOBERTA INICIO',source)

    def test_empty_topic_is_excluded_from_sitemap(self):
        sitemap=(ROOT/'sitemap.xml').read_text(encoding='utf-8')
        ET.fromstring(sitemap)
        for tag in CATALOG['tags']:
            slug=tag['id']
            if any(slug in p['tags'] for p in CATALOG['posts']):
                continue
            self.assertNotIn(f'/artigos/tags/{slug}/',sitemap)
            source=(ROOT/f'artigos/tags/{slug}/index.html').read_text(encoding='utf-8')
            self.assertIn('noindex, follow',source)
        populated=[t for t in CATALOG['tags'] if any(t['id'] in p['tags'] for p in CATALOG['posts'])]
        for group,items in [('temas',CATALOG['themes']),('tags',populated)]:
            for item in items:
                self.assertIn(f'https://4watt.tech/artigos/{group}/{item["id"]}/',sitemap)
        feed=ET.parse(ROOT/'artigos/feed.xml')
        self.assertEqual(len(feed.findall('channel/item')),len(CATALOG['posts']))


if __name__=='__main__':
    unittest.main(verbosity=2)
