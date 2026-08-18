# -*- coding: utf-8 -*-
"""
Auditoria do site 4WaTT.

Rodar a partir da raiz do repositorio:
    python .claude/skills/site-4watt/scripts/auditar.py

Verifica:
  1. Chaves i18n orfas   - usadas no HTML mas sem definicao (ficam em PT no site EN)
  2. Chaves so em PT     - definidas em pt e ausentes em en
  3. Chaves mortas       - definidas e nunca usadas
  4. Links internos quebrados
  5. Versoes de asset compartilhado divergentes entre paginas
  6. Paginas que usam data-i18n sem carregar languages.js

Saida: relatorio no stdout. Codigo 1 se houver erro bloqueante.
"""
import io
import json
import os
import re
import subprocess
import sys

ATTR = r'data-i18n(?:-placeholder|-title|-alt|-aria-label|-content)?="([^"]+)"'
SUBDIRS = ['artigos', 'biometano', 'viabilidade']
SHARED = ['theme-4watt.css', 'main.js', 'site-premium.js', 'languages.js',
          'mobile-fixes.css', 'home-premium.css', 'solucoes.css']


def html_files():
    out = []
    for f in sorted(os.listdir('.')):
        if f.endswith('.html') and '.bak' not in f:
            out.append(f)
    for d in SUBDIRS:
        if not os.path.isdir(d):
            continue
        for f in sorted(os.listdir(d)):
            if f.endswith('.html') and '.bak' not in f:
                out.append(os.path.join(d, f).replace('\\', '/'))
    return out


def read(p):
    return io.open(p, encoding='utf-8', errors='ignore').read()


def load_dicts():
    """Extrai os dicionarios executando o JS no Node (evita parser fragil)."""
    js = (
        "global.window={};"
        "eval(require('fs').readFileSync('assets/js/languages.js','utf8'));"
        "try{eval(require('fs').readFileSync('assets/js/languages-pages.js','utf8'));}catch(e){}"
        "const t=window.translations;"
        "console.log(JSON.stringify({pt:Object.keys(t.pt),en:Object.keys(t.en),"
        "langs:Object.keys(t)}));"
    )
    try:
        r = subprocess.run(['node', '-e', js], capture_output=True, text=True, timeout=60)
    except (OSError, subprocess.SubprocessError) as e:
        return None, 'nao foi possivel executar o node: %s' % e
    if r.returncode != 0:
        return None, 'languages.js nao avaliou:\n' + (r.stderr or '')[:500]
    try:
        return json.loads(r.stdout.strip().splitlines()[-1]), None
    except (ValueError, IndexError):
        return None, 'saida inesperada do node: ' + r.stdout[:200]


def main():
    if not os.path.isdir('assets/js'):
        print('ERRO: rode a partir da raiz do repositorio (nao achei assets/js).')
        return 1

    files = html_files()
    problems = 0
    warnings = 0

    print('=' * 66)
    print('AUDITORIA SITE 4WATT  -  %d paginas' % len(files))
    print('=' * 66)

    # --- coleta de chaves usadas ---
    used = {}
    for f in files:
        for k in re.findall(ATTR, read(f)):
            used.setdefault(k, []).append(f)

    data, err = load_dicts()

    # --- 1/2/3: chaves ---
    if err:
        print('\n[1-3] CHAVES i18n: PULADO -- %s' % err)
        warnings += 1
    else:
        pt, en = set(data['pt']), set(data['en'])

        orfas = sorted(k for k in used if k not in pt)
        print('\n[1] CHAVES ORFAS (usadas no HTML, sem definicao): %d' % len(orfas))
        if orfas:
            problems += len(orfas)
            print('    Exibem o texto do HTML. Em EN ficam em portugues.')
            for k in orfas:
                print('    - %-34s %s' % (k, ', '.join(sorted(set(used[k])))[:60]))

        so_pt = sorted(k for k in used if k in pt and k not in en)
        print('\n[2] CHAVES SEM TRADUCAO EM EN: %d' % len(so_pt))
        if so_pt:
            problems += len(so_pt)
            for k in so_pt[:20]:
                print('    - ' + k)
            if len(so_pt) > 20:
                print('    ... e mais %d' % (len(so_pt) - 20))

        mortas = sorted(k for k in pt if k not in used)
        print('\n[3] CHAVES MORTAS (definidas, nunca usadas): %d  [informativo]'
              % len(mortas))
        print('    %d de %d chaves pt = %d%% do dicionario'
              % (len(mortas), len(pt), round(len(mortas) * 100.0 / max(len(pt), 1))))

    # --- 4: links internos ---
    print('\n[4] LINKS INTERNOS QUEBRADOS:', end=' ')
    quebrados = []
    for f in files:
        base = os.path.dirname(f)
        for m in re.finditer(r'href="([^"#?:]+\.html)', read(f)):
            href = m.group(1)
            alvo = href[1:] if href.startswith('/') else os.path.normpath(
                os.path.join(base, href))
            if not os.path.exists(alvo):
                quebrados.append('%s -> %s' % (f, href))
    quebrados = sorted(set(quebrados))
    print(len(quebrados))
    if quebrados:
        problems += len(quebrados)
        for q in quebrados:
            print('    - ' + q)

    # --- 5: versoes de asset ---
    print('\n[5] VERSOES DE ASSET DIVERGENTES:')
    div = 0
    for asset in SHARED:
        vs = {}
        for f in files:
            for m in re.finditer(re.escape(asset) + r'\?v=([0-9.]+)', read(f)):
                vs.setdefault(m.group(1), []).append(f)
        if len(vs) > 1:
            div += 1
            problems += 1
            print('    - %s tem %d versoes:' % (asset, len(vs)))
            for v, fs in sorted(vs.items()):
                print('        v=%-6s %d pagina(s): %s' % (v, len(fs), ', '.join(fs[:3])))
    if not div:
        print('    nenhuma. ok')

    # --- 6: data-i18n sem languages.js ---
    print('\n[6] PAGINAS COM data-i18n MAS SEM languages.js:')
    faltando = []
    for f in files:
        s = read(f)
        if re.search(ATTR, s) and 'languages.js' not in s:
            faltando.append(f)
    if faltando:
        problems += len(faltando)
        for f in faltando:
            print('    - ' + f)
    else:
        print('    nenhuma. ok')

    print('\n' + '=' * 66)
    if problems:
        print('RESULTADO: %d problema(s). Ver acima.' % problems)
    else:
        print('RESULTADO: nenhum problema bloqueante.')
    if warnings:
        print('           %d verificacao(oes) pulada(s).' % warnings)
    print('=' * 66)
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
