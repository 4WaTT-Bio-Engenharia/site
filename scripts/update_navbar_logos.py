#!/usr/bin/env python3
"""Propaga navbar premium e paths de logo conforme plano logos_navbar_cleanup."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SOLUTION_CTAS = {
    "solucao-biogas.html": ("#cta", "cta_estudo", "Solicitar estudo"),
    "solucao-biometano.html": ("#cta", "cta_produzir", "Quero produzir"),
    "solucao-gaseificacao.html": ("#cta", "cta_falar", "Falar com especialista"),
}

SKIP = {"biometano.html", "artigos.html"}  # redirects puros após limpeza


def build_nav(
    *,
    asset_prefix: str,
    home_href: str,
    anchor_prefix: str,
    page_prefix: str,
    cta_href: str,
    cta_i18n: str,
    cta_text: str,
    fetchpriority: str = "",
) -> str:
    fp = f' fetchpriority="{fetchpriority}"' if fetchpriority else ""
    logo_src = f"{asset_prefix}assets/img/logo-4watt-dark.png"
    return f"""  <nav class="nav">
    <a class="nav__logo" href="{home_href}" aria-label="4WaTT início" data-i18n-title="nav_logo_aria">
      <img src="{logo_src}" alt="4WaTT Bio Engenharia"{fp}>
    </a>
    <button class="nav__toggle" type="button" aria-label="Abrir menu" aria-expanded="false" data-i18n-title="nav_toggle_aria"><i class="fas fa-bars"></i></button>
    <ul class="nav__links">
      <li><a href="{anchor_prefix}ecossistema" data-i18n="nav_ecossistema">Ecossistema</a></li>
      <li><a href="{anchor_prefix}matriz" data-i18n="nav_residuos">Resíduos</a></li>
      <li><a href="{anchor_prefix}engenharia" data-i18n="nav_engenharia">Engenharia</a></li>
      <li><a href="{anchor_prefix}jornada" data-i18n="nav_jornada">Jornada</a></li>
      <li class="nav__dd">
        <a tabindex="0" data-i18n="nav_solucoes">Soluções <i class="fas fa-chevron-down"></i></a>
        <ul class="nav__dd-menu">
          <li><a href="{page_prefix}solucao-biogas.html" data-i18n="nav_biogas">Engenharia de Biogás</a></li>
          <li><a href="{page_prefix}solucao-biometano.html" data-i18n="nav_biom">Produção de Biometano</a></li>
          <li><a href="{page_prefix}solucao-gaseificacao.html" data-i18n="nav_gaseificacao">Gaseificação de RSU</a></li>
          <li><a href="{page_prefix}investidor.html" data-i18n="nav_investidor">Área do Investidor</a></li>
        </ul>
      </li>
      <li class="nav__lang">
        <div class="lang-selector" role="group" aria-label="Seletor de idioma">
          <button class="lang-btn active" type="button" data-lang="pt" aria-pressed="true" data-i18n="lang_pt">PT</button>
          <button class="lang-btn" type="button" data-lang="en" aria-pressed="false" data-i18n="lang_en">EN</button>
        </div>
      </li>
      <li><a class="nav__cta" href="{cta_href}" data-i18n="{cta_i18n}">{cta_text}</a></li>
    </ul>
    <div class="nav__progress"></div>
  </nav>"""


def nav_for_file(rel_path: str) -> str:
    name = Path(rel_path).name
    depth = rel_path.count("/")
    asset_prefix = "../" * depth
    page_prefix = asset_prefix
    home_href = f"{asset_prefix}index.html"

    if name == "index.html" and depth == 0:
        return build_nav(
            asset_prefix="",
            home_href="index.html",
            anchor_prefix="#",
            page_prefix="",
            cta_href="simulador.html",
            cta_i18n="cta_simular",
            cta_text="Simular Viabilidade",
            fetchpriority="high",
        )

    if name == "simulador.html":
        return build_nav(
            asset_prefix="",
            home_href="index.html",
            anchor_prefix="index.html#",
            page_prefix="",
            cta_href="contato.html",
            cta_i18n="cta_falar",
            cta_text="Falar com especialista",
        )

    if name in SOLUTION_CTAS:
        href, i18n, text = SOLUTION_CTAS[name]
        return build_nav(
            asset_prefix="",
            home_href="index.html",
            anchor_prefix="index.html#",
            page_prefix="",
            cta_href=href,
            cta_i18n=i18n,
            cta_text=text,
        )

    # subpastas e demais páginas na raiz
    sim_href = f"{page_prefix}simulador.html"
    return build_nav(
        asset_prefix=asset_prefix,
        home_href=home_href,
        anchor_prefix=f"{home_href}#",
        page_prefix=page_prefix,
        cta_href=sim_href,
        cta_i18n="cta_simular",
        cta_text="Simular Viabilidade",
    )


NAV_RE = re.compile(r"<nav class=\"nav\">.*?</nav>", re.DOTALL)


def replace_nav(content: str, rel_path: str) -> str:
    if '<nav class="nav">' not in content:
        return content
    return NAV_RE.sub(nav_for_file(rel_path), content, count=1)


def fix_logos(content: str, depth: int) -> str:
    ap = "../" * depth
    content = re.sub(
        r'src="(?:\.\./)*(?:assets/img_old/logo-4watt\.png|assets/logo-4watt\.png)"',
        f'src="{ap}assets/img/logo-4watt-dark.png"',
        content,
    )
    content = re.sub(
        r'class="footer-logo"',
        'class="footer__logo"',
        content,
    )
    content = re.sub(
        r'(<img[^>]*class="footer__logo"[^>]*src=")(?:\.\./)*(?:assets/img_old/logo-4watt\.png|assets/logo-4watt\.png|/assets/img_old/logo-4watt\.png)(")',
        rf'\1{ap}assets/img/logo-4watt-light.png\2',
        content,
    )
    content = re.sub(
        r'(<img class="footer__logo" src=")(?:\.\./)*(?:assets/img_old/logo-4watt\.png|assets/logo-4watt\.png)(")',
        rf'\1{ap}assets/img/logo-4watt-light.png\2',
        content,
    )
    # footer sem classe padronizada ainda
    content = re.sub(
        r'(<img src=")(?:\.\./)*(?:assets/img_old/logo-4watt\.png|assets/logo-4watt\.png)(" alt="4WaTT Logo" class="footer__logo">)',
        rf'\1{ap}assets/img/logo-4watt-light.png\2',
        content,
    )
    return content


def add_favicon(content: str, depth: int) -> str:
    ap = "../" * depth
    fav = (
        f'  <link rel="icon" href="{ap}assets/img/favicon.png" type="image/png">\n'
        f'  <link rel="apple-touch-icon" href="{ap}assets/img/favicon.png">\n'
    )
    if 'rel="icon"' in content:
        return content
    return content.replace("<head>", f"<head>\n{fav}", 1)


def bump_theme_version(content: str) -> str:
    return content.replace("theme-4watt.css?v=3.2", "theme-4watt.css?v=3.3").replace(
        "home-premium.css?v=3.0", "home-premium.css?v=3.1"
    )


def process_file(path: Path) -> bool:
    rel = str(path.relative_to(ROOT)).replace("\\", "/")
    if path.name in SKIP:
        return False
    text = path.read_text(encoding="utf-8")
    original = text
    depth = rel.count("/")
    if '<nav class="nav">' in text:
        text = replace_nav(text, rel)
    text = fix_logos(text, depth)
    text = add_favicon(text, depth)
    text = bump_theme_version(text)
    if text != original:
        path.write_text(text, encoding="utf-8")
        print(f"updated: {rel}")
        return True
    return False


def main() -> None:
    patterns = [
        ROOT / "index.html",
        *ROOT.glob("*.html"),
        *(ROOT / "artigos").glob("*.html"),
        *(ROOT / "biometano").glob("*.html"),
        *(ROOT / "viabilidade").glob("*.html"),
    ]
    seen = set()
    for p in patterns:
        if not p.is_file() or p.name.endswith(".bak"):
            continue
        key = str(p.resolve())
        if key in seen:
            continue
        seen.add(key)
        process_file(p)


if __name__ == "__main__":
    main()
