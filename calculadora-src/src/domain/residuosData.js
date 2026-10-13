// Banco de dados de resíduos — parâmetros técnicos por matéria-prima.
//
// Complementa `materiaPrimaData.js` (que guarda apenas o rendimento de biogás
// por unidade) com os parâmetros necessários à pré-aprovação: teor de metano
// (e por diferença o CO2 recuperável no upgrading), produção de biofertilizante
// líquido e sólido por unidade de resíduo, e elegibilidade a gate fee.
//
// As chaves são as mesmas de MATERIA_PRIMA_DATA — uma entrada por matéria-prima.
// Valores são referências técnicas do setor para estimativa de pré-viabilidade
// (A VALIDAR com memorial de cálculo no EVTE antes de uso comercial).
//
// Unidades de referência (por unidade de resíduo/dia, conforme `unidade` do catálogo):
//   fertilizanteLiquidoM3  -> m³ de biofertilizante líquido por unidade/dia
//   fertilizanteSolidoTon  -> toneladas de biofertilizante sólido por unidade/dia
//   metanoPct              -> fração de CH4 no biogás (0–1)
//   gateFeeElegivel        -> resíduo de terceiros tipicamente remunerado por gate fee

/** Fatores por categoria de resíduo (base dos valores individuais abaixo). */
export const FATOR_DIGESTATO_BOVINO_LIQUIDO_M3 = 0.045 // ~45 L de dejeto/animal/dia
export const FATOR_DIGESTATO_BOVINO_SOLIDO_TON = 0.0068 // ~15% após separação sólida
export const FATOR_DIGESTATO_SUINO_LIQUIDO_M3 = 0.007
export const FATOR_DIGESTATO_SUINO_SOLIDO_TON = 0.001
export const FATOR_DIGESTATO_AVE_LIQUIDO_M3 = 0.00015
export const FATOR_DIGESTATO_AVE_SOLIDO_TON = 0.00005

export const RESIDUOS_DATA = {
  'AVE POEDEIRA': {
    metanoPct: 0.6,
    fertilizanteLiquidoM3: FATOR_DIGESTATO_AVE_LIQUIDO_M3,
    fertilizanteSolidoTon: FATOR_DIGESTATO_AVE_SOLIDO_TON,
    gateFeeElegivel: false
  },
  'AVE DE CORTE': {
    metanoPct: 0.6,
    fertilizanteLiquidoM3: FATOR_DIGESTATO_AVE_LIQUIDO_M3,
    fertilizanteSolidoTon: FATOR_DIGESTATO_AVE_SOLIDO_TON,
    gateFeeElegivel: false
  },
  'BOVINOS DE CORTE': {
    metanoPct: 0.58,
    fertilizanteLiquidoM3: FATOR_DIGESTATO_BOVINO_LIQUIDO_M3,
    fertilizanteSolidoTon: FATOR_DIGESTATO_BOVINO_SOLIDO_TON,
    gateFeeElegivel: false
  },
  'BOVINOS EM CONFINAMENTO': {
    metanoPct: 0.58,
    fertilizanteLiquidoM3: FATOR_DIGESTATO_BOVINO_LIQUIDO_M3,
    fertilizanteSolidoTon: FATOR_DIGESTATO_BOVINO_SOLIDO_TON,
    gateFeeElegivel: false
  },
  'BOVINO DE LEITE FREE STALL': {
    metanoPct: 0.58,
    fertilizanteLiquidoM3: FATOR_DIGESTATO_BOVINO_LIQUIDO_M3,
    fertilizanteSolidoTon: FATOR_DIGESTATO_BOVINO_SOLIDO_TON,
    gateFeeElegivel: false
  },
  'BOVINO DE LEITE COMPOST BARN': {
    metanoPct: 0.58,
    fertilizanteLiquidoM3: FATOR_DIGESTATO_BOVINO_LIQUIDO_M3,
    fertilizanteSolidoTon: FATOR_DIGESTATO_BOVINO_SOLIDO_TON,
    gateFeeElegivel: false
  },
  'C.C. (Suino Ciclo Completo)': {
    metanoPct: 0.6,
    fertilizanteLiquidoM3: FATOR_DIGESTATO_SUINO_LIQUIDO_M3,
    fertilizanteSolidoTon: FATOR_DIGESTATO_SUINO_SOLIDO_TON,
    gateFeeElegivel: false
  },
  'FECULARIA (tonelada)': {
    metanoPct: 0.58,
    fertilizanteLiquidoM3: 0.85,
    fertilizanteSolidoTon: 0.15,
    gateFeeElegivel: true
  },
  'FRIGORIFICO DE BOVINOS': {
    metanoPct: 0.6,
    fertilizanteLiquidoM3: FATOR_DIGESTATO_BOVINO_LIQUIDO_M3,
    fertilizanteSolidoTon: FATOR_DIGESTATO_BOVINO_SOLIDO_TON,
    gateFeeElegivel: false
  },
  'UT (Terminação Suínos)': {
    metanoPct: 0.6,
    fertilizanteLiquidoM3: FATOR_DIGESTATO_SUINO_LIQUIDO_M3,
    fertilizanteSolidoTon: FATOR_DIGESTATO_SUINO_SOLIDO_TON,
    gateFeeElegivel: false
  },
  'UPL (Unidade Produção Leitão)': {
    metanoPct: 0.6,
    fertilizanteLiquidoM3: FATOR_DIGESTATO_SUINO_LIQUIDO_M3,
    fertilizanteSolidoTon: FATOR_DIGESTATO_SUINO_SOLIDO_TON,
    gateFeeElegivel: false
  },
  'UC (Crechário Suínos)': {
    metanoPct: 0.6,
    fertilizanteLiquidoM3: FATOR_DIGESTATO_SUINO_LIQUIDO_M3,
    fertilizanteSolidoTon: FATOR_DIGESTATO_SUINO_SOLIDO_TON,
    gateFeeElegivel: false
  },
  'UPD (Unidade Desmamados)': {
    metanoPct: 0.6,
    fertilizanteLiquidoM3: FATOR_DIGESTATO_SUINO_LIQUIDO_M3,
    fertilizanteSolidoTon: FATOR_DIGESTATO_SUINO_SOLIDO_TON,
    gateFeeElegivel: false
  },
  'SUINO MATRIZ': {
    metanoPct: 0.6,
    fertilizanteLiquidoM3: 0.012,
    fertilizanteSolidoTon: 0.0018,
    gateFeeElegivel: false
  },
  'RSO (Resíduo Sólido Organico/tonelada)': {
    metanoPct: 0.58,
    fertilizanteLiquidoM3: 0.85,
    fertilizanteSolidoTon: 0.18,
    gateFeeElegivel: true
  },
  'RSU (Resíduo Sólido Urbano/tonelada)': {
    metanoPct: 0.55,
    fertilizanteLiquidoM3: 0.8,
    fertilizanteSolidoTon: 0.22,
    gateFeeElegivel: true
  },
  'VINHAÇA MILHO (m3)': {
    metanoPct: 0.55,
    fertilizanteLiquidoM3: 0.9,
    fertilizanteSolidoTon: 0.05,
    gateFeeElegivel: true
  },
  'VINHAÇA CANA (m3)': {
    metanoPct: 0.55,
    fertilizanteLiquidoM3: 0.9,
    fertilizanteSolidoTon: 0.05,
    gateFeeElegivel: true
  }
}

/** Fallback conservador para matérias-primas sem cadastro individual. */
export const RESIDUO_PADRAO = {
  metanoPct: 0.58,
  fertilizanteLiquidoM3: 0.5,
  fertilizanteSolidoTon: 0.1,
  gateFeeElegivel: false
}

/**
 * Retorna os parâmetros técnicos de um resíduo cadastrado.
 * Nunca retorna undefined: usa RESIDUO_PADRAO quando a chave não existe.
 */
export function obterResiduo(materiaPrima) {
  return RESIDUOS_DATA[materiaPrima] || RESIDUO_PADRAO
}
