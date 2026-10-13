/**
 * Limites e máscaras dos campos de formulário.
 *
 * ── Por que existe ──────────────────────────────────────────────────────────
 *
 * Levantamento de 23/09/2026: dos 49 campos do app, só 14 tinham `maxLength`, os
 * campos numéricos não tinham `max` nenhum (dava para digitar um trilhão de
 * animais) e o campo de WhatsApp anunciava o formato `(99) 99999-9999` no
 * placeholder sem máscara alguma por trás — a formatação era uma promessa que o
 * campo não cumpria. O helper `somenteDigitos` ainda estava copiado em dois
 * arquivos.
 *
 * ── A regra ─────────────────────────────────────────────────────────────────
 *
 * Os limites ESPELHAM o servidor, que é quem de fato valida (as rotas usam zod e
 * recusam com 400). O limite no cliente não é segurança: é para o usuário não
 * digitar 300 caracteres e só descobrir no submit que o teto era 160. Cada
 * entrada cita a origem — se o schema mudar lá, muda aqui.
 *
 * Deriva é o risco conhecido deste arquivo. O teste `campos.test.js` fixa o
 * comportamento das máscaras, mas não consegue ler os schemas TypeScript do
 * apps/api; a citação da origem é o que torna a conferência possível numa
 * revisão.
 */

// ── Limites de texto ────────────────────────────────────────────────────────

/** Máximo de caracteres por campo. Origem: schemas zod de apps/api/src/http/rotas/. */
export const LIMITES = {
  // auth.ts
  nome: 120,
  email: 254,
  organizacao: 120,
  /** validarPoliticaDeSenha (apps/api/src/auth/senha.ts): 12 a 256. */
  senha: 256,

  // leads.ts — o funil público aceita nome e e-mail mais longos que o cadastro
  nomeLead: 200,
  emailLead: 255,
  whatsapp: 30,
  empresa: 200,

  // projetos.ts
  projetoNome: 160,
  descricao: 2000,
  clienteFinal: 160,
  localizacao: 160,
  tipo: 60,
  busca: 160,

  // simulacoes.ts
  nota: 500,
  tipoBiodigestor: 30,

  // administracao.ts
  buscaAdmin: 120,
  motivo: 500,

  // propostas.ts
  prazoImplantacao: 120
}

// ── Limites numéricos ───────────────────────────────────────────────────────

/**
 * Tetos dos campos numéricos.
 *
 * O servidor hoje só exige `positive().finite()` nas quantidades, sem teto. Os
 * valores abaixo são folgados de propósito — o maior confinamento do país tem na
 * ordem de 150 mil cabeças, então 10 milhões não atrapalha ninguém real e ainda
 * assim impede que um dedo escorregado vire uma simulação absurda que o motor
 * gasta tempo processando.
 */
export const LIMITES_NUMERICOS = {
  /** Cabeças, toneladas/dia ou m³/dia, conforme a matéria-prima. */
  quantidade: { min: 0, max: 10_000_000, casas: 2 },
  /** R$/kWh, R$/m³, R$/kg. */
  preco: { min: 0, max: 10_000, casas: 4 },
  /** Consumo mensal (kWh, kg). */
  consumo: { min: 0, max: 100_000_000, casas: 2 },
  /** WACC e afins. */
  percentual: { min: 0, max: 100, casas: 2 },
  /** Prazo em meses. */
  meses: { min: 0, max: 600, casas: 0 }
}

// ── Máscaras ────────────────────────────────────────────────────────────────

/** Remove tudo que não for dígito. Era duplicado em LeadGate e CadastroModal. */
export function somenteDigitos(valor) {
  return String(valor ?? '').replace(/\D/g, '')
}

/**
 * Telefone brasileiro: `(99) 99999-9999` (celular) ou `(99) 9999-9999` (fixo).
 *
 * Formata progressivamente enquanto se digita, então o campo nunca fica num
 * estado que o usuário não reconhece. Acima de 11 dígitos o excedente é
 * descartado — não dá para digitar um telefone que não existe.
 */
export function mascaraTelefone(valor) {
  const d = somenteDigitos(valor).slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** Telefone completo? 10 dígitos (fixo) ou 11 (celular). */
export function telefoneValido(valor) {
  const d = somenteDigitos(valor)
  return d.length === 10 || d.length === 11
}

/** Corta em `max` caracteres. Espelha o `maxLength` para colagem programática. */
export function limitarTexto(valor, max) {
  const s = String(valor ?? '')
  return max > 0 ? s.slice(0, max) : s
}

/**
 * Normaliza a entrada de um campo numérico de texto (inputMode="decimal").
 *
 * Aceita vírgula OU ponto como separador — o teclado do celular costuma oferecer
 * só um deles, e reprovar o usuário por isso seria hostil. Devolve string porque
 * o campo é controlado: converter para número aqui apagaria a vírgula no meio da
 * digitação ("1," viraria 1 e o usuário não conseguiria escrever "1,5").
 */
export function mascaraDecimal(valor, casas = 2) {
  let s = String(valor ?? '').replace(/[^\d,.]/g, '')
  s = s.replace(/\./g, ',')
  const partes = s.split(',')
  const inteira = partes.shift() ?? ''
  if (partes.length === 0) return inteira
  return `${inteira},${partes.join('').slice(0, casas)}`
}

/** Só dígitos, para campos inteiros. */
export function mascaraInteiro(valor) {
  return somenteDigitos(valor)
}

/**
 * Converte o texto de um campo decimal em número, ou null.
 *
 * Vazio vira null e não 0: em campo opcional os dois significam coisas
 * diferentes — "não informado" não é "zero".
 */
export function paraNumero(valor) {
  const s = String(valor ?? '').trim().replace(/\./g, '').replace(',', '.')
  if (s === '') return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

/** Prende um número ao intervalo do campo. Fora da faixa devolve null. */
export function dentroDoLimite(valor, limite) {
  const n = typeof valor === 'number' ? valor : paraNumero(valor)
  if (n === null) return null
  if (n < limite.min || n > limite.max) return null
  return n
}
