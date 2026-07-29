var EMAIL_DESTINO = "4watt.tech@gmail.com";
var SHEET_LEADS = "Leads Investidor";
var SHEET_APTOS = "Leads Aptos";
var SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");

function doGet() {
  return ContentService.createTextOutput("API 4WaTT ativa.");
}

function doPost(e) {
  try {
    var dados = parsePayload_(e);
    var triagem = classificarLead_(dados);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss && SPREADSHEET_ID) {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    }

    if (!ss) {
      throw new Error("Abra a planilha vinculada ao projeto ou configure o Apps Script como container-bound.");
    }

    var leadSheet = getOrCreateSheet_(ss, SHEET_LEADS, getHeaders_());
    var row = buildRow_(dados, triagem);
    leadSheet.appendRow(row);

    if (triagem.status === "APTO") {
      var aptoSheet = getOrCreateSheet_(ss, SHEET_APTOS, getHeaders_());
      aptoSheet.appendRow(row);
      enviarAlertaEmail(dados, triagem);
    }

    return jsonResponse_({
      ok: true,
      status: triagem.status,
      score: triagem.score,
      reason: triagem.reason
    });
  } catch (err) {
    return jsonResponse_({
      ok: false,
      error: String(err && err.message ? err.message : err)
    }, 500);
  }
}

function parsePayload_(e) {
  if (!e) return {};
  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      return {};
    }
  }
  return e.parameter || {};
}

function classificarLead_(dados) {
  var volumeScoreMap = {
    "ate-5mi": 1,
    "5-20mi": 2,
    "20-50mi": 3,
    "acima-50mi": 4
  };

  var msg = String(dados.mensagem || "").toLowerCase();
  var keywords = [
    "fundo",
    "equity",
    "family office",
    "private equity",
    "ticket",
    "investimento",
    "nda",
    "memorando",
    "capex"
  ];

  var score = 0;
  score += volumeScoreMap[dados.volume_interesse] || 0;
  score += String(dados.empresa || "").trim() ? 1 : 0;
  score += String(dados.nome || "").trim() ? 1 : 0;
  score += keywords.some(function(term) { return msg.indexOf(term) !== -1; }) ? 1 : 0;

  var status = "NAO_APTO";
  var reason = "Perfil abaixo da faixa de triagem.";

  if (score >= 5 || volumeScoreMap[dados.volume_interesse] >= 3) {
    status = "APTO";
    reason = "Lead compatível com triagem comercial e abertura de memorando.";
  } else if (score >= 3) {
    status = "TRIAGEM";
    reason = "Lead com potencial, mas ainda pede validação comercial.";
  }

  return {
    status: status,
    score: score,
    reason: reason
  };
}

function buildRow_(dados, triagem) {
  return [
    new Date(),
    triagem.status,
    triagem.score,
    triagem.reason,
    dados.nome || "",
    dados.empresa || "",
    dados.email || "",
    dados.whatsapp || "",
    dados.volume_interesse || "",
    dados.mensagem || "",
    dados.projeto_interesse || "",
    dados.lead_source || "",
    dados._page_url || "",
    dados._page_title || "",
    dados.utm_source || "",
    dados.utm_medium || "",
    dados.utm_campaign || "",
    dados.utm_term || "",
    dados.utm_content || ""
  ];
}

function getHeaders_() {
  return [
    "Timestamp",
    "Status",
    "Score",
    "Motivo",
    "Nome",
    "Empresa",
    "E-mail",
    "WhatsApp",
    "Volume",
    "Mensagem",
    "Projeto de Interesse",
    "Origem",
    "Página",
    "Título da Página",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "UTM Term",
    "UTM Content"
  ];
}

function getOrCreateSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    return sheet;
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  return sheet;
}

function enviarAlertaEmail(dados, triagem) {
  var assunto = "🔥 NOVO LEAD QUALIFICADO: " + (dados.nome || "Sem nome");
  var corpo = [
    "Olá equipe 4WaTT,",
    "",
    "Um novo lead foi classificado como APTO:",
    "",
    "Nome: " + (dados.nome || ""),
    "Empresa: " + (dados.empresa || ""),
    "E-mail: " + (dados.email || ""),
    "WhatsApp: " + (dados.whatsapp || ""),
    "Volume: " + (dados.volume_interesse || ""),
    "Score: " + triagem.score,
    "Motivo: " + triagem.reason,
    "",
    "Mensagem:",
    dados.mensagem || "",
    "",
    "Dados salvos na planilha."
  ].join("\n");

  MailApp.sendEmail(EMAIL_DESTINO, assunto, corpo);
}

function jsonResponse_(payload, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
