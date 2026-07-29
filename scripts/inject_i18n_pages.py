#!/usr/bin/env python3
"""Injeta languages-pages.js e corrige paths de assets em subpastas."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP = {"assets/pages", "img_old"}
PAGES_SCRIPT = '<script src="/assets/js/languages-pages.js?v=1.0"></script>\n'
MAIN_VER = re.compile(r'main\.js\?v=[\d.]+', re.M)
MAIN_NEW = 'main.js?v=1.4'


def should_process(p: Path) -> bool:
    if p.name.endswith(".bak"):
        return False
    sp = str(p)
    if any(x in sp for x in SKIP):
        return False
    if p.name in ("biometano.html", "artigos.html"):
        return False
    return "languages.js" in p.read_text(encoding="utf-8", errors="ignore")


def fix_asset_paths(text: str, in_subfolder: bool) -> str:
    if not in_subfolder:
        return text
    # assets/ em src/href → /assets/ (raiz do site)
    text = re.sub(r'(src|href)="assets/', r'\1="/assets/', text)
    return text


def inject_scripts(text: str) -> str:
    text = MAIN_VER.sub(MAIN_NEW, text)
    if "languages-pages.js" in text:
        return text
    return re.sub(
        r'(<script src="(?:\.\./)?/?assets/js/languages\.js\?v=[^"]+"></script>\s*)',
        r'\1' + PAGES_SCRIPT,
        text,
        count=1,
    )


def main() -> None:
    files = list(ROOT.glob("*.html"))
    files += list((ROOT / "artigos").glob("*.html"))
    files += list((ROOT / "biometano").glob("*.html"))
    files += list((ROOT / "viabilidade").glob("*.html"))
    for p in files:
        if not should_process(p):
            continue
        rel = p.relative_to(ROOT)
        in_sub = len(rel.parts) > 1
        text = p.read_text(encoding="utf-8")
        new = inject_scripts(fix_asset_paths(text, in_sub))
        if new != text:
            p.write_text(new, encoding="utf-8")
            print("updated", rel)


if __name__ == "__main__":
    main()
