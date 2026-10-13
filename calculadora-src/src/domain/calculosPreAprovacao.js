// Motor de pré-aprovação 4WaTT — produção, receitas, CAPEX e OPEX estimados.
//
// Consolida, a partir da lista de resíduos informada na Calculadora e da
// localização da planta (UF + concessionária), todos os indicadores usados na
// pré-aprovação comercial:
//   produção  — biogás (±5% de margem de assertividade), biometano, CO2,
//               biofertilizante líquido/sólido, energia elétrica, créditos de carbono;
//   receitas  — energia GD (deságio 40%, fio B, impostos), mercado livre,
//               biometano, equivalência térmica, fertilizante, CO2, crédito de
//               carbono (preço manual) e gate fee de resíduo (input manual);
//   investimento — CAPEX e OPEX estimados por faixa.
//
// Tudo aqui é função pura de domínio (sem I/O) e vale igual na web e na API.
// Valores são estimativas de pré-viabilidade — não substituem o EVTE.

import {
  MATERIA_PRIMA_DATA,
  PODER_CALORIFICO_BIOGAS,
  BIOMETANO_PERCENTUAL_MEDIO,
  CC_FATOR,
  EQUIVALENCIA_LENHA,
  GLP_PARA_GN,
  PRECO_BIOMETANO_RS_M3,
  KWH_POR_M3_BIOGAS_MEDIO,
  DIAS_MES_ENERGIA_KWH,
  BIOGAS_MINIMO_BIOMETANO,
  FATOR_CUSTO_BIOMETANO_VS_ENERGIA
} from './materiaPrimaData.js'
import { obterResiduo } from './residuosData.js'
import {
  obterConcessionaria,
  tarifaMediaEstado,
  fioBMedioEstado,
  DESAGIO_GD_PCT,
  IMPOSTOS_ENERGIA_PCT_PADRAO
} from './tarifasEnergia.js'

// --- Constantes de pré-aprovação -------------------------------------------

/** Margem de assertividade da estimativa de biogás (±5%). */
export const MARGEM_ASSERTIVIDADE_BIOGAS = 0.05

/** 1 MMBtu = 293,071 kWh (conversão térmica). */
export const MMBTU_POR_KWH = 1 / 293.071

/** Poder calorífico do biometano (~35,8 MJ/m³ ≈ 9,94 kWh/m³). */
export const KWH_POR_M3_BIOMETANO = 9.94

/** Densidade do CO2 a 25 °C, 1 atm (kg/m³). */
export const DENSIDADE_CO2_KG_M3 = 1.84

export const DIAS_POR_ANO = 365

// Preços de referência (todos editáveis via parâmetros na UI)
export const PRECO_ENERGIA_MERCADO_RS_KWH = 0.3 // rota ACL/venda direta (~R$ 300/MWh)
export const PRECO_CO2_RS_KG_PADRAO = 0.8 // CO2 industrial/alimentício
export const PRECO_CREDITO_CARBONO_RS_TCO2_PADRAO = 35 // *estimado, editável manual
export const PRECO_FERTILIZANTE_LIQUIDO_RS_M3_PADRAO = 45
export const PRECO_FERTILIZANTE_SOLIDO_RS_TON_PADRAO = 320
export const PRECO_LENHA_RS_KG_PADRAO = 0.3

// CAPEX estimado: modelo de escala CAPEX = FATOR × (m³ biogás/dia)^EXPOENTE.
// Âncoras: 1.000 m³/dia ≈ R$ 3,6 mi; 5.000 m³/dia ≈ R$ 12 mi (rota energia).
// Rota biometano custa +50% (FATOR_CUSTO_BIOMETANO_VS_ENERGIA).
export const CAPEX_FATOR_RS = 20000
export const CAPEX_EXPOENTE_ESCALA = 0.75
export const CAPEX_MINIMO_RS = 500000
export const CAPEX_FAIXA_PCT = 0.2 // ±20% sobre o valor central

// OPEX estimado como percentual do CAPEX por ano
export const OPEX_PCT_CAPEX_MIN = 0.03
export const OPEX_PCT_CAPEX_MEDIO = 0.05
export const OPEX_PCT_CAPEX_MAX = 0.07

/** Parâmetros padrão da pré-aprovação (base do estado inicial da UI). */
export const PARAMETROS_PRE_APROVACAO_PADRAO = {
  tarifaRsKwh: null, // null -> usa concessionária/média estadual
  fioBRsKwh: null, // null -> idem
  impostoPct: IMPOSTOS_ENERGIA_PCT_PADRAO,
  precoMercadoRsKwh: PRECO_ENERGIA_MERCADO_RS_KWH,
  precoBiometanoRsM3: PRECO_BIOMETANO_RS_M3,
  precoLenhaRsKg: PRECO_LENHA_RS_KG_PADRAO,
  precoFertLiquidoRsM3: PRECO_FERTILIZANTE_LIQUIDO_RS_M3_PADRAO,
  precoFertSolidoRsTon: PRECO_FERTILIZANTE_SOLIDO_RS_TON_PADRAO,
  precoCo2RsKg: PRECO_CO2_RS_KG_PADRAO,
  precoCarbonoRsTco2: PRECO_CREDITO_CARBONO_RS_TCO2_PADRAO,
  gateFeeRsTon: '' // input manual; vazio = sem gate fee
}

// --- Produção ---------------------------------------------------------------

function zeroSeInvalido (n) {
  return Number.isFinite(n) && n > 0 ? n : 0
}

/**
 * Produção estimada do projeto a partir dos itens de resíduo.
 * itens: [{ materiaPrima, quantidade }] (unidade conforme MATERIA_PRIMA_DATA).
 */
export function calcularProducaoPreAprovacao (itens = []) {
  let biogasM3Dia = 0
  let co2M3Dia = 0
  let fertLiquidoM3Dia = 0
  let fertSolidoTonDia = 0
  let gateFeeTonDia = 0

  for (const item of itens) {
    const meta = MATERIA_PRIMA_DATA[item.materiaPrima]
    const quantidade = zeroSeInvalido(item.quantidade)
    if (!meta || quantidade <= 0) continue

    const biogas = meta.biogas_m3 * quantidade
    const residuo = obterResiduo(item.materiaPrima)

    biogasM3Dia += biogas
    co2M3Dia += biogas * (1 - residuo.metanoPct)
    fertLiquidoM3Dia += residuo.fertilizanteLiquidoM3 * quantidade
    fertSolidoTonDia += residuo.fertilizanteSolidoTon * quantidade

    // Gate fee vale para resíduos de terceiros aferidos em tonelada;
    // resíduos em m³ (vinhaça) entram com densidade ≈ 1 t/m³.
    if (residuo.gateFeeElegivel && (meta.unidade === 'tonelada' || meta.unidade === 'm3')) {
      gateFeeTonDia += quantidade
    }
  }

  const margem = MARGEM_ASSERTIVIDADE_BIOGAS
  const biogas = {
    m3Dia: biogasM3Dia,
    m3DiaMin: biogasM3Dia * (1 - margem),
    m3DiaMax: biogasM3Dia * (1 + margem),
    m3Mes: biogasM3Dia * DIAS_MES_ENERGIA_KWH,
    m3Ano: biogasM3Dia * DIAS_POR_ANO,
    margemPct: margem
  }
  biogas.mmbtuDia = biogasM3Dia * PODER_CALORIFICO_BIOGAS * MMBTU_POR_KWH
  biogas.mmbtuMes = biogas.mmbtuDia * DIAS_MES_ENERGIA_KWH
  biogas.mmbtuAno = biogas.mmbtuDia * DIAS_POR_ANO

  const biometanoM3Dia = biogasM3Dia * BIOMETANO_PERCENTUAL_MEDIO
  const biometano = {
    m3Dia: biometanoM3Dia,
    m3Mes: biometanoM3Dia * DIAS_MES_ENERGIA_KWH,
    m3Ano: biometanoM3Dia * DIAS_POR_ANO,
    mmbtuDia: biometanoM3Dia * KWH_POR_M3_BIOMETANO * MMBTU_POR_KWH,
    mmbtuAno: biometanoM3Dia * KWH_POR_M3_BIOMETANO * MMBTU_POR_KWH * DIAS_POR_ANO,
    apto: biogasM3Dia >= BIOGAS_MINIMO_BIOMETANO
  }

  const co2 = {
    m3Dia: co2M3Dia,
    tonDia: (co2M3Dia * DENSIDADE_CO2_KG_M3) / 1000,
    tonMes: (co2M3Dia * DENSIDADE_CO2_KG_M3 * DIAS_MES_ENERGIA_KWH) / 1000,
    tonAno: (co2M3Dia * DENSIDADE_CO2_KG_M3 * DIAS_POR_ANO) / 1000
  }

  const fertilizante = {
    liquidoM3Dia: fertLiquidoM3Dia,
    liquidoM3Mes: fertLiquidoM3Dia * DIAS_MES_ENERGIA_KWH,
    liquidoM3Ano: fertLiquidoM3Dia * DIAS_POR_ANO,
    solidoTonDia: fertSolidoTonDia,
    solidoTonMes: fertSolidoTonDia * DIAS_MES_ENERGIA_KWH,
    solidoTonAno: fertSolidoTonDia * DIAS_POR_ANO
  }

  const energia = {
    kwhDia: biogasM3Dia * KWH_POR_M3_BIOGAS_MEDIO,
    kwhMes: biogasM3Dia * KWH_POR_M3_BIOGAS_MEDIO * DIAS_MES_ENERGIA_KWH,
    kwhAno: biogasM3Dia * KWH_POR_M3_BIOGAS_MEDIO * DIAS_POR_ANO,
    // Rotas possíveis de monetização da energia elétrica
    rotas: [
      { id: 'gd', nome: 'GD remota / autoconsumo (crédito com deságio de 40%)' },
      { id: 'mercado', nome: 'Venda no mercado livre (ACL)' }
    ]
  }

  const tco2eqAno = (biogasM3Dia * CC_FATOR * DIAS_POR_ANO) / 1000
  const creditosCarbono = {
    tco2eqAno,
    tco2eqAnoMin: tco2eqAno * (1 - margem),
    tco2eqAnoMax: tco2eqAno * (1 + margem)
  }

  return { biogas, biometano, co2, fertilizante, energia, creditosCarbono, gateFeeTonDia }
}

// --- Receitas ---------------------------------------------------------------

/**
 * Valor líquido do kWh em GD: tarifa com deságio de 40%, descontados fio B e
 * impostos. Nunca negativo (piso 0 — cenário sem atratividade).
 */
export function calcularValorLiquidoKwhGD (tarifaRsKwh, fioBRsKwh, impostoPct = IMPOSTOS_ENERGIA_PCT_PADRAO) {
  const tarifa = zeroSeInvalido(tarifaRsKwh)
  const fioB = zeroSeInvalido(fioBRsKwh)
  const imposto = zeroSeInvalido(impostoPct)
  const bruto = tarifa * (1 - DESAGIO_GD_PCT)
  const liquido = bruto * (1 - imposto) - fioB
  return Math.max(0, liquido)
}

/**
 * Receitas mensais estimadas por fonte (R$/mês).
 * Biogás alocado OU na rota energia OU na rota biometano — os dois cenários
 * são reportados em separado (totalCenarioEnergia / totalCenarioBiometano).
 */
export function calcularReceitasPreAprovacao (producao, localizacao = {}, parametros = {}) {
  const p = { ...PARAMETROS_PRE_APROVACAO_PADRAO, ...parametros }

  const concessionaria = localizacao.uf
    ? obterConcessionaria(localizacao.uf, localizacao.concessionariaId)
    : null
  const tarifa = p.tarifaRsKwh != null && p.tarifaRsKwh !== ''
    ? Number(p.tarifaRsKwh)
    : concessionaria
      ? concessionaria.tarifaRsKwh
      : tarifaMediaEstado(localizacao.uf)
  const fioB = p.fioBRsKwh != null && p.fioBRsKwh !== ''
    ? Number(p.fioBRsKwh)
    : concessionaria
      ? concessionaria.fioBRsKwh
      : fioBMedioEstado(localizacao.uf)

  // Energia elétrica — rota GD (deságio 40% + fio B + impostos)
  const valorLiquidoKwhGD = calcularValorLiquidoKwhGD(tarifa, fioB, Number(p.impostoPct))
  const energiaGD = {
    rsMes: producao.energia.kwhMes * valorLiquidoKwhGD,
    tarifaRsKwh: tarifa,
    fioBRsKwh: fioB,
    desagioPct: DESAGIO_GD_PCT,
    impostoPct: Number(p.impostoPct) || 0,
    valorLiquidoKwh: valorLiquidoKwhGD
  }

  // Energia elétrica — rota mercado livre (preço de referência ACL)
  const energiaMercado = {
    rsMes: producao.energia.kwhMes * (Number(p.precoMercadoRsKwh) || 0),
    precoRsKwh: Number(p.precoMercadoRsKwh) || 0
  }

  // Biometano
  const biometano = {
    rsMes: producao.biometano.m3Mes * (Number(p.precoBiometanoRsM3) || 0),
    precoRsM3: Number(p.precoBiometanoRsM3) || 0
  }

  // Equivalência térmica (substituição de lenha; referências de GLP/GN informativas)
  const lenhaKgDia = producao.biogas.m3Dia * EQUIVALENCIA_LENHA
  const termica = {
    rsMes: lenhaKgDia * DIAS_MES_ENERGIA_KWH * (Number(p.precoLenhaRsKg) || 0),
    lenhaKgDia,
    glpKgDia: producao.biometano.m3Dia / GLP_PARA_GN,
    gnM3Dia: producao.biometano.m3Dia, // 1 m³ biometano ≈ 1 m³ GN
    precoLenhaRsKg: Number(p.precoLenhaRsKg) || 0
  }

  // Biofertilizante (líquido + sólido)
  const fertilizante = {
    rsMes:
      (producao.fertilizante.liquidoM3Ano * (Number(p.precoFertLiquidoRsM3) || 0) +
        producao.fertilizante.solidoTonAno * (Number(p.precoFertSolidoRsTon) || 0)) /
      12,
    precoLiquidoRsM3: Number(p.precoFertLiquidoRsM3) || 0,
    precoSolidoRsTon: Number(p.precoFertSolidoRsTon) || 0
  }

  // CO2 recuperado no upgrading (só faz sentido no cenário biometano)
  const co2 = {
    rsMes: producao.co2.tonMes * 1000 * (Number(p.precoCo2RsKg) || 0),
    precoRsKg: Number(p.precoCo2RsKg) || 0
  }

  // Crédito de carbono *estimado (preço manual editável)
  const creditoCarbono = {
    rsMes: (producao.creditosCarbono.tco2eqAno * (Number(p.precoCarbonoRsTco2) || 0)) / 12,
    precoRsTco2: Number(p.precoCarbonoRsTco2) || 0
  }

  // Gate fee de resíduo (input manual, R$/tonelada recebida)
  const gateFeeRsTon = Number(p.gateFeeRsTon) || 0
  const gateFee = {
    rsMes: producao.gateFeeTonDia * DIAS_MES_ENERGIA_KWH * gateFeeRsTon,
    tonDia: producao.gateFeeTonDia,
    precoRsTon: gateFeeRsTon
  }

  const baseComum = fertilizante.rsMes + creditoCarbono.rsMes + gateFee.rsMes
  const totalCenarioEnergia = energiaGD.rsMes + termica.rsMes + baseComum
  const totalCenarioBiometano = biometano.rsMes + co2.rsMes + baseComum

  return {
    concessionaria,
    tarifaAplicada: tarifa,
    fioBAplicado: fioB,
    energiaGD,
    energiaMercado,
    biometano,
    termica,
    fertilizante,
    co2,
    creditoCarbono,
    gateFee,
    totalCenarioEnergia,
    totalCenarioBiometano,
    totalCenarioEnergiaAno: totalCenarioEnergia * 12,
    totalCenarioBiometanoAno: totalCenarioBiometano * 12
  }
}

// --- Investimento (CAPEX / OPEX) --------------------------------------------

/**
 * CAPEX e OPEX estimados por faixa.
 * modo: 'energia' | 'biometano' (biometano custa +50% — FATOR_CUSTO_BIOMETANO_VS_ENERGIA).
 */
export function calcularInvestimentoPreAprovacao (biogasM3Dia, modo = 'energia') {
  if (!biogasM3Dia || biogasM3Dia <= 0) {
    return {
      modo,
      capex: { min: 0, central: 0, max: 0 },
      opexAno: { min: 0, central: 0, max: 0 },
      opexPctCapex: OPEX_PCT_CAPEX_MEDIO
    }
  }

  const fatorModo = modo === 'biometano' ? FATOR_CUSTO_BIOMETANO_VS_ENERGIA : 1
  const central =
    Math.max(CAPEX_MINIMO_RS, CAPEX_FATOR_RS * Math.pow(biogasM3Dia, CAPEX_EXPOENTE_ESCALA)) *
    fatorModo
  const capex = {
    min: central * (1 - CAPEX_FAIXA_PCT),
    central,
    max: central * (1 + CAPEX_FAIXA_PCT)
  }

  return {
    modo,
    capex,
    opexAno: {
      min: capex.min * OPEX_PCT_CAPEX_MIN,
      central: capex.central * OPEX_PCT_CAPEX_MEDIO,
      max: capex.max * OPEX_PCT_CAPEX_MAX
    },
    opexPctCapex: OPEX_PCT_CAPEX_MEDIO
  }
}

// --- Agregador ---------------------------------------------------------------

/**
 * Pré-aprovação completa do projeto.
 *
 * @param {object} entrada
 * @param {Array}  entrada.itens            [{ materiaPrima, quantidade }]
 * @param {string} [entrada.uf]             Sigla do estado da planta
 * @param {string} [entrada.concessionariaId] Id da concessionária local
 * @param {object} [entrada.parametros]     Overrides de preço/tarifa (ver PARAMETROS_PRE_APROVACAO_PADRAO)
 * @param {string} [entrada.modo]           'energia' | 'biometano' (roteia o CAPEX)
 */
export function calcularPreAprovacao ({ itens = [], uf = '', concessionariaId = '', parametros = {}, modo = 'energia' } = {}) {
  const producao = calcularProducaoPreAprovacao(itens)
  const receitas = calcularReceitasPreAprovacao(producao, { uf, concessionariaId }, parametros)
  const investimento = calcularInvestimentoPreAprovacao(producao.biogas.m3Dia, modo)

  // Indicador simples de pré-aprovação: receita anual do cenário cobre OPEX?
  const receitaAnualCenario =
    modo === 'biometano' ? receitas.totalCenarioBiometanoAno : receitas.totalCenarioEnergiaAno
  const paybackAnos =
    receitaAnualCenario > investimento.opexAno.central
      ? investimento.capex.central / (receitaAnualCenario - investimento.opexAno.central)
      : null

  return {
    producao,
    receitas,
    investimento,
    localizacao: {
      uf,
      concessionariaId,
      concessionaria: receitas.concessionaria
    },
    modo,
    paybackAnos,
    preAprovado:
      producao.biogas.m3Dia > 0 && paybackAnos != null && Number.isFinite(paybackAnos)
  }
}
