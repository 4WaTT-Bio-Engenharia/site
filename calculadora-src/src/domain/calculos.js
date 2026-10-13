import {
  EQUIVALENCIA_LENHA,
  CC_FATOR,
  BIOMETANO_PERCENTUAL_MEDIO,
  GLP_PARA_GN,
  BIOMETANO_PARA_GN,
  KWH_POR_M3_BIOGAS_MIN,
  KWH_POR_M3_BIOGAS_MEDIO,
  KWH_POR_M3_BIOGAS_MAX,
  DIAS_MES_ENERGIA_KWH,
  DIAS_POR_MES_BIOMETANO,
  PRECO_BIOMETANO_RS_M3,
  FATURAMENTO_RS_POR_KWH_MES
} from './materiaPrimaData.js'

/**
 * Calcula a produção de biogás baseado na matéria prima e quantidade (m³/dia)
 */
export function calcularBiogas(materiaPrima, quantidade, materiaPrimaData) {
  if (!materiaPrima || !materiaPrimaData[materiaPrima] || !quantidade || quantidade <= 0) {
    return 0
  }
  
  const biogasPorUnidade = materiaPrimaData[materiaPrima].biogas_m3
  return biogasPorUnidade * quantidade
}

/**
 * Produção de energia elétrica em kWh/dia.
 * Modelo: 1 m³ de biogás → 1,2 kWh em média (1,1–1,5 kWh/m³ na faixa exibida).
 */
export function calcularEnergia(biogasM3) {
  if (!biogasM3 || biogasM3 <= 0) return 0
  return biogasM3 * KWH_POR_M3_BIOGAS_MEDIO
}

/**
 * Produção de energia elétrica em kWh/mês (kWh/dia × 30 dias).
 */
export function calcularEnergiaMensal(energiaKWhDia) {
  return energiaKWhDia * DIAS_MES_ENERGIA_KWH
}

/**
 * Faixa de energia mensal (kWh/mês) a partir do biogás diário (m³/dia).
 */
export function calcularEnergiaMensalExtremos(biogasM3Dia) {
  if (!biogasM3Dia || biogasM3Dia <= 0) {
    return { min: 0, max: 0 }
  }
  const d = DIAS_MES_ENERGIA_KWH
  return {
    min: biogasM3Dia * KWH_POR_M3_BIOGAS_MIN * d,
    max: biogasM3Dia * KWH_POR_M3_BIOGAS_MAX * d
  }
}

/**
 * Faturamento mensal estimado em R$.
 * Fórmula: energia produzida (kWh/mês) × FATURAMENTO_RS_POR_KWH_MES (0,52).
 */
export function calcularFaturamentoMensal(energiaKWhMensal) {
  if (!energiaKWhMensal || energiaKWhMensal <= 0) return 0
  return energiaKWhMensal * FATURAMENTO_RS_POR_KWH_MES
}

/**
 * Biometano em m³/mês (produção diária × 30 dias).
 */
export function calcularBiometanoMensal(biometanoM3Dia) {
  return biometanoM3Dia * DIAS_POR_MES_BIOMETANO
}

/**
 * Faturamento mensal quando o projeto é apto para biometano (não produz energia).
 * Fórmula: biometano (m³/mês) × 2,15.
 */
export function calcularFaturamentoBiometano(biometanoM3Dia) {
  return calcularBiometanoMensal(biometanoM3Dia) * PRECO_BIOMETANO_RS_M3
}

/**
 * Calcula a equivalência em lenha (kg)
 */
export function calcularEquivalenciaLenha(biogasM3) {
  return biogasM3 * EQUIVALENCIA_LENHA
}

/**
 * Calcula o crédito de carbono (tCO2eq)
 */
export function calcularCC(biogasM3) {
  return (biogasM3 * CC_FATOR) / 1000 // Convertendo para toneladas
}

/**
 * Produção de biometano em m³/dia.
 * Biogás tem 55–65% de pureza de metano (média 60%); aplica fator de perdas no processo de 5%.
 * biometano = biogás × 0,60 × 0,95 = biogás × 0,57
 */
export function calcularBiometano(biogasM3) {
  if (!biogasM3 || biogasM3 <= 0) return 0
  return biogasM3 * BIOMETANO_PERCENTUAL_MEDIO
}

/**
 * Calcula a equivalência em GLP (kg)
 * Baseado em: 1 kg GLP = 1,25 m³ GN
 * Como biometano ≈ GN, então: m³ biometano / 1,25 = kg GLP
 */
export function calcularEquivalenciaGLP(biometanoM3) {
  return biometanoM3 / GLP_PARA_GN
}

/**
 * Calcula a equivalência em GN (m³)
 * Baseado em: 1 m³ biometano ≈ 1 m³ GN
 */
export function calcularEquivalenciaGN(biometanoM3) {
  return biometanoM3 * BIOMETANO_PARA_GN
}

/**
 * Calcula a redução de emissões de CO2 equivalente por ano (tCO2eq/ano)
 * Baseado no fator de crédito de carbono aplicado ao biogás anual
 */
export function calcularReducaoEmissoesAnual(biogasM3Dia) {
  const ccDia = calcularCC(biogasM3Dia)
  return ccDia * 365 // tCO2eq/ano
}

/**
 * Calcula a produção de biofertilizante (adubo orgânico) em m³/ano
 * Estimativa: 0,8 m³ de biofertilizante por m³ de biogás (valores típicos da biodigestão)
 */
export function calcularBiofertilizanteAnual(biogasM3Dia) {
  const FATOR_BIOFERTILIZANTE = 0.8
  return biogasM3Dia * FATOR_BIOFERTILIZANTE * 365
}

/**
 * Formata número no padrão brasileiro (vírgula para decimais, ponto para milhares)
 */
export function formatarNumeroBR(numero, casasDecimais = 2) {
  if (numero === null || numero === undefined || isNaN(numero)) {
    return '0,00'
  }
  
  const numeroFormatado = numero.toLocaleString('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais
  })
  
  return numeroFormatado
}
