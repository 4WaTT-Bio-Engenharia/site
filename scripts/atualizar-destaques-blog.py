# -*- coding: utf-8 -*-
"""Atualiza apenas métricas agregadas dos artigos do catálogo, usando a API GA4.

Autenticação: Application Default Credentials (google-auth), fora dos arquivos públicos.
Instalação opcional: python -m pip install -r scripts/requirements-blog.txt
Execução: python scripts/atualizar-destaques-blog.py
"""
import argparse
import json
import os
import tempfile
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data/blog"
SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]


def report_request(posts):
    return {
        "dateRanges": [{"startDate": "30daysAgo", "endDate": "yesterday"}],
        "dimensions": [{"name": "pagePath"}],
        "metrics": [{"name": "screenPageViews"}],
        "dimensionFilter": {"andGroup": {"expressions": [
            {"filter": {"fieldName": "hostName", "inListFilter": {"values": ["4watt.tech", "www.4watt.tech"]}}},
            {"filter": {"fieldName": "pagePath", "inListFilter": {"values": [p["url"] for p in posts]}}}
        ]}},
        "limit": "10000",
        "keepEmptyRows": False
    }


def aggregate_report(report, posts):
    """Aceita somente URLs do catálogo. Nunca exporta usuários, eventos ou PII."""
    paths = {p["url"]: p["id"] for p in posts}
    views = {p["id"]: 0 for p in posts}
    # O contrato da API retorna dimensões/métricas na ordem pedida acima.
    for row in report.get("rows", []):
        path = unquote(urlsplit(row["dimensionValues"][0]["value"]).path)
        if path not in paths:
            continue
        value = int(row["metricValues"][0]["value"])
        if value < 0:
            raise ValueError("GA4 retornou uma contagem negativa")
        views[paths[path]] += value
    return views


def rank(posts, views):
    # Empate usa data e ID para manter o resultado determinístico.
    ranked = sorted(posts, key=lambda p: (-views.get(p["id"], 0), p["published"], p["id"]))
    positive = [p["id"] for p in ranked if views.get(p["id"], 0) > 0]
    return positive[:6] if len(positive) >= 6 else []


def fetch_report(property_id, posts):
    import google.auth
    from google.auth.exceptions import GoogleAuthError
    from google.auth.transport.requests import Request
    try:
        credentials, _ = google.auth.default(scopes=SCOPES)
        credentials.refresh(Request())
    except GoogleAuthError:
        raise RuntimeError("Autenticação do GA4 não configurada ou expirada") from None
    endpoint = f"https://analyticsdata.googleapis.com/v1beta/properties/{property_id}:runReport"
    request = urllib.request.Request(endpoint, data=json.dumps(report_request(posts)).encode(), headers={
        "Authorization": "Bearer " + credentials.token,
        "Content-Type": "application/json"
    }, method="POST")
    with urllib.request.urlopen(request, timeout=45) as response:
        return json.load(response)


def atomic_json(path, payload):
    """Só substitui o feed depois de validar e serializar a resposta inteira."""
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=".destaques-", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as stream:
            json.dump(payload, stream, ensure_ascii=False, indent=2)
            stream.write("\n")
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def main():
    catalog = json.loads((DATA / "catalogo.json").read_text(encoding="utf-8"))
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--property-id", default=os.environ.get("GA4_PROPERTY_ID", catalog["ga4PropertyId"]))
    parser.add_argument("--dry-run", action="store_true", help="Confere a consulta sem autenticar, enviar ou gravar dados.")
    args = parser.parse_args()
    if not args.property_id.isdigit():
        parser.error("O ID da propriedade deve ser numérico, diferente do Measurement ID G-...")
    posts = catalog["posts"]
    if args.dry_run:
        print(json.dumps({"propertyId": args.property_id, "request": report_request(posts)}, ensure_ascii=False, indent=2))
        return
    try:
        report = fetch_report(args.property_id, posts)
        # Dados sujeitos a limiar não são apresentados como ranking completo.
        if report.get("metadata", {}).get("subjectToThresholding"):
            print("Relatório sujeito a limiar do GA4. Feed anterior preservado.")
            return
        views = aggregate_report(report, posts)
        ids = rank(posts, views)
        if not ids:
            print("Menos de seis artigos com visualizações no período. Seleção anterior preservada.")
            return
        payload = {"mode": "ga4", "updatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                   "windowDays": 30, "periodEnd": "yesterday", "articleIds": ids,
                   "views": {article_id: views[article_id] for article_id in ids}}
        atomic_json(DATA / "destaques.json", payload)
        print("Destaques atualizados: seis artigos, visualizações agregadas dos últimos 30 dias completos.")
    except (ImportError, urllib.error.URLError, ValueError, KeyError, IndexError, RuntimeError) as error:
        # Mensagem sem o corpo da resposta, token ou conteúdo de credenciais.
        print(f"Não foi possível atualizar o GA4 ({type(error).__name__}). Feed anterior preservado.")
        raise SystemExit(1) from None


if __name__ == "__main__":
    main()
