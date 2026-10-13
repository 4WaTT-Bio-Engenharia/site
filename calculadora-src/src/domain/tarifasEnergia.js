// Banco de dados de tarifas de energia elétrica — pré-aprovação.
//
// Lista oficial dos 27 estados brasileiros e as principais concessionárias de
// distribuição por UF, com tarifa convencional de referência (grupo B,
// R$/kWh) e fio B (TUSD encargo de uso da rede para compensação em GD,
// R$/kWh).
//
// Valores de referência do setor (patamar ~2025) para estimativa de
// pré-viabilidade — A VALIDAR com a resolução homologatória ANEEL vigente da
// distribuidora antes de uso comercial. O usuário pode sobrescrever a tarifa
// nos parâmetros do cenário.

export const ESTADOS_BRASIL = [
  { uf: 'AC', nome: 'Acre' },
  { uf: 'AL', nome: 'Alagoas' },
  { uf: 'AP', nome: 'Amapá' },
  { uf: 'AM', nome: 'Amazonas' },
  { uf: 'BA', nome: 'Bahia' },
  { uf: 'CE', nome: 'Ceará' },
  { uf: 'DF', nome: 'Distrito Federal' },
  { uf: 'ES', nome: 'Espírito Santo' },
  { uf: 'GO', nome: 'Goiás' },
  { uf: 'MA', nome: 'Maranhão' },
  { uf: 'MT', nome: 'Mato Grosso' },
  { uf: 'MS', nome: 'Mato Grosso do Sul' },
  { uf: 'MG', nome: 'Minas Gerais' },
  { uf: 'PA', nome: 'Pará' },
  { uf: 'PB', nome: 'Paraíba' },
  { uf: 'PR', nome: 'Paraná' },
  { uf: 'PE', nome: 'Pernambuco' },
  { uf: 'PI', nome: 'Piauí' },
  { uf: 'RJ', nome: 'Rio de Janeiro' },
  { uf: 'RN', nome: 'Rio Grande do Norte' },
  { uf: 'RS', nome: 'Rio Grande do Sul' },
  { uf: 'RO', nome: 'Rondônia' },
  { uf: 'RR', nome: 'Roraima' },
  { uf: 'SC', nome: 'Santa Catarina' },
  { uf: 'SP', nome: 'São Paulo' },
  { uf: 'SE', nome: 'Sergipe' },
  { uf: 'TO', nome: 'Tocantins' }
]

/**
 * Concessionárias por UF.
 * Cada entrada: { id, nome, tarifaRsKwh, fioBRsKwh }.
 */
export const CONCESSIONARIAS_POR_UF = {
  AC: [{ id: 'energisa-ac', nome: 'Energisa Acre', tarifaRsKwh: 0.78, fioBRsKwh: 0.16 }],
  AL: [{ id: 'equatorial-al', nome: 'Equatorial Alagoas', tarifaRsKwh: 0.74, fioBRsKwh: 0.15 }],
  AP: [{ id: 'cea', nome: 'CEA (Equatorial Amapá)', tarifaRsKwh: 0.72, fioBRsKwh: 0.15 }],
  AM: [{ id: 'amazonas-energia', nome: 'Amazonas Energia', tarifaRsKwh: 0.79, fioBRsKwh: 0.16 }],
  BA: [{ id: 'coelba', nome: 'Neoenergia Coelba', tarifaRsKwh: 0.72, fioBRsKwh: 0.15 }],
  CE: [{ id: 'enel-ce', nome: 'Enel Ceará', tarifaRsKwh: 0.71, fioBRsKwh: 0.14 }],
  DF: [{ id: 'neoenergia-df', nome: 'Neoenergia Brasília', tarifaRsKwh: 0.66, fioBRsKwh: 0.13 }],
  ES: [{ id: 'edp-es', nome: 'EDP Espírito Santo', tarifaRsKwh: 0.68, fioBRsKwh: 0.14 }],
  GO: [{ id: 'equatorial-go', nome: 'Equatorial Goiás', tarifaRsKwh: 0.67, fioBRsKwh: 0.14 }],
  MA: [{ id: 'equatorial-ma', nome: 'Equatorial Maranhão', tarifaRsKwh: 0.73, fioBRsKwh: 0.15 }],
  MT: [{ id: 'energisa-mt', nome: 'Energisa Mato Grosso', tarifaRsKwh: 0.71, fioBRsKwh: 0.14 }],
  MS: [{ id: 'energisa-ms', nome: 'Energisa Mato Grosso do Sul', tarifaRsKwh: 0.69, fioBRsKwh: 0.14 }],
  MG: [
    { id: 'cemig', nome: 'Cemig', tarifaRsKwh: 0.7, fioBRsKwh: 0.14 },
    { id: 'energisa-mg', nome: 'Energisa Minas Gerais', tarifaRsKwh: 0.69, fioBRsKwh: 0.14 }
  ],
  PA: [{ id: 'equatorial-pa', nome: 'Equatorial Pará', tarifaRsKwh: 0.75, fioBRsKwh: 0.15 }],
  PB: [{ id: 'energisa-pb', nome: 'Energisa Paraíba', tarifaRsKwh: 0.72, fioBRsKwh: 0.15 }],
  PR: [{ id: 'copel', nome: 'Copel', tarifaRsKwh: 0.62, fioBRsKwh: 0.12 }],
  PE: [{ id: 'neoenergia-pe', nome: 'Neoenergia Pernambuco', tarifaRsKwh: 0.74, fioBRsKwh: 0.15 }],
  PI: [{ id: 'equatorial-pi', nome: 'Equatorial Piauí', tarifaRsKwh: 0.72, fioBRsKwh: 0.15 }],
  RJ: [
    { id: 'light', nome: 'Light', tarifaRsKwh: 0.82, fioBRsKwh: 0.17 },
    { id: 'enel-rj', nome: 'Enel Rio de Janeiro', tarifaRsKwh: 0.78, fioBRsKwh: 0.16 }
  ],
  RN: [{ id: 'cosern', nome: 'Neoenergia Cosern', tarifaRsKwh: 0.73, fioBRsKwh: 0.15 }],
  RS: [
    { id: 'ceee-d', nome: 'CEEE-D (Equatorial)', tarifaRsKwh: 0.68, fioBRsKwh: 0.14 },
    { id: 'rge', nome: 'RGE (CPFL)', tarifaRsKwh: 0.66, fioBRsKwh: 0.13 }
  ],
  RO: [{ id: 'energisa-ro', nome: 'Energisa Rondônia', tarifaRsKwh: 0.74, fioBRsKwh: 0.15 }],
  RR: [{ id: 'cerr', nome: 'CERR (Roraima Energia)', tarifaRsKwh: 0.7, fioBRsKwh: 0.14 }],
  SC: [{ id: 'celesc', nome: 'Celesc', tarifaRsKwh: 0.64, fioBRsKwh: 0.13 }],
  SP: [
    { id: 'enel-sp', nome: 'Enel São Paulo', tarifaRsKwh: 0.72, fioBRsKwh: 0.15 },
    { id: 'cpfl-paulista', nome: 'CPFL Paulista', tarifaRsKwh: 0.68, fioBRsKwh: 0.14 },
    { id: 'elektro', nome: 'Elektro (Neoenergia)', tarifaRsKwh: 0.7, fioBRsKwh: 0.14 },
    { id: 'edp-sp', nome: 'EDP São Paulo', tarifaRsKwh: 0.71, fioBRsKwh: 0.14 },
    { id: 'energisa-sp', nome: 'Energisa São Paulo', tarifaRsKwh: 0.69, fioBRsKwh: 0.14 }
  ],
  SE: [{ id: 'energisa-se', nome: 'Energisa Sergipe', tarifaRsKwh: 0.73, fioBRsKwh: 0.15 }],
  TO: [{ id: 'energisa-to', nome: 'Energisa Tocantins', tarifaRsKwh: 0.72, fioBRsKwh: 0.15 }]
}

/** Deságio médio na compensação de créditos em GD remota (40% do crédito retido). */
export const DESAGIO_GD_PCT = 0.4

/**
 * Alíquota efetiva de impostos sobre a receita de energia em GD
 * (PIS/COFINS + efetivo). Referência para pré-viabilidade; editável na UI.
 */
export const IMPOSTOS_ENERGIA_PCT_PADRAO = 0.12

/** Tarifa média nacional de referência quando não há UF/concessionária escolhida. */
export const TARIFA_MEDIA_NACIONAL_RS_KWH = 0.7

/** Lista as concessionárias de um estado (array vazio se UF desconhecida). */
export function listarConcessionarias(uf) {
  return CONCESSIONARIAS_POR_UF[uf] || []
}

/** Busca uma concessionária específica pelo UF + id. */
export function obterConcessionaria(uf, id) {
  return listarConcessionarias(uf).find((c) => c.id === id) || null
}

/** Tarifa média simples das concessionárias cadastradas no estado. */
export function tarifaMediaEstado(uf) {
  const lista = listarConcessionarias(uf)
  if (lista.length === 0) return TARIFA_MEDIA_NACIONAL_RS_KWH
  const soma = lista.reduce((acc, c) => acc + c.tarifaRsKwh, 0)
  return soma / lista.length
}

/** Fio B médio simples das concessionárias cadastradas no estado. */
export function fioBMedioEstado(uf) {
  const lista = listarConcessionarias(uf)
  if (lista.length === 0) return 0.14
  const soma = lista.reduce((acc, c) => acc + c.fioBRsKwh, 0)
  return soma / lista.length
}
