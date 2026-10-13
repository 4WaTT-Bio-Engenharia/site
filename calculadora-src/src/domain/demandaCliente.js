import { CAPEX_DESVIO_PERCENTUAL, DIAS_MES_ENERGIA_KWH } from './materiaPrimaData.js'

function temDemanda(demanda) {
  const n = Number(demanda)
  return Number.isFinite(n) && n > 0
}

function producaoNaoNegativa(producao) {
  const n = Number(producao)
  return Number.isFinite(n) && n > 0 ? n : 0
}

function precoNaoNegativo(preco) {
  const n = Number(preco)
  return Number.isFinite(n) && n > 0 ? n : 0
}

/**
 * Compara produção e demanda na mesma unidade.
 * coberturaPct é capada em 100 quando a produção supera a demanda.
 */
export function proporcionalizarDemanda({ producao, demanda }) {
  const prod = producaoNaoNegativa(producao)
  if (!temDemanda(demanda)) {
    return {
      semDemanda: true,
      coberturaPct: 0,
      usado: 0,
      excedente: prod,
      deficit: 0
    }
  }

  const dem = Number(demanda)
  if (prod <= 0) {
    return {
      semDemanda: false,
      coberturaPct: 0,
      usado: 0,
      excedente: 0,
      deficit: dem
    }
  }

  const usado = Math.min(prod, dem)
  return {
    semDemanda: false,
    coberturaPct: Math.min(100, (prod / dem) * 100),
    usado,
    excedente: Math.max(0, prod - dem),
    deficit: Math.max(0, dem - prod)
  }
}

/**
 * Economia na conta de energia e potencial de venda do excedente.
 */
export function calcularEconomiaEnergia({ energiaKwhMes, demandaKwhMes, tarifaRsKwh }) {
  const tarifa = precoNaoNegativo(tarifaRsKwh)
  const prop = proporcionalizarDemanda({
    producao: energiaKwhMes,
    demanda: demandaKwhMes
  })
  return {
    ...prop,
    economiaRsMes: prop.usado * tarifa,
    potencialVendaRsMes: prop.excedente * tarifa
  }
}

/**
 * Economia de GLP. Sem demanda informada, a economia potencial
 * considera a equivalência total ao preço informado.
 */
export function calcularEconomiaGLP({ glpKgDia, demandaKgMes, precoRsKg }) {
  const glpKgMes = producaoNaoNegativa(glpKgDia) * DIAS_MES_ENERGIA_KWH
  const preco = precoNaoNegativo(precoRsKg)
  const prop = proporcionalizarDemanda({
    producao: glpKgMes,
    demanda: demandaKgMes
  })

  if (prop.semDemanda) {
    return {
      ...prop,
      glpKgMes,
      economiaRsMes: glpKgMes * preco,
      potencialVendaRsMes: 0
    }
  }

  return {
    ...prop,
    glpKgMes,
    economiaRsMes: prop.usado * preco,
    potencialVendaRsMes: prop.excedente * preco
  }
}

/**
 * Estima quanto de resíduo seria necessário para cobrir 100% da demanda,
 * na mesma proporção da quantidade atual.
 */
export function sugerirEscalaParaDemanda({ producao, demanda, quantidadeAtual }) {
  const prop = proporcionalizarDemanda({ producao, demanda })
  if (prop.semDemanda || prop.deficit <= 0) {
    return {
      necessitaMaisResiduo: false,
      fator: 1,
      quantidadeNecessaria: null
    }
  }

  const prod = producaoNaoNegativa(producao)
  if (prod <= 0) {
    return {
      necessitaMaisResiduo: true,
      fator: null,
      quantidadeNecessaria: null
    }
  }

  const fator = Number(demanda) / prod
  const qAtual = producaoNaoNegativa(quantidadeAtual)
  return {
    necessitaMaisResiduo: true,
    fator,
    quantidadeNecessaria: qAtual > 0 ? qAtual * fator : null
  }
}

/**
 * Quando a produção já supera (ou não tem) demanda própria, estima o fator de
 * aumento de resíduo necessário para multiplicar a produção comercializável
 * pelo `multiplicador` informado (padrão: dobrar), mantendo a proporção atual
 * entre quantidade de resíduo e produção.
 */
export function sugerirEscalaParaComercializacao({ producao, demanda, quantidadeAtual, multiplicador = 2 }) {
  const prop = proporcionalizarDemanda({ producao, demanda })
  const prod = producaoNaoNegativa(producao)
  const aplicavel = prod > 0 && (prop.semDemanda || prop.excedente > 0)
  if (!aplicavel) {
    return { aplicavel: false, fator: 1, producaoAlvo: null, quantidadeNecessaria: null }
  }

  const mult = Number.isFinite(Number(multiplicador)) && Number(multiplicador) > 1 ? Number(multiplicador) : 2
  const qAtual = producaoNaoNegativa(quantidadeAtual)

  return {
    aplicavel: true,
    fator: mult,
    producaoAlvo: prod * mult,
    quantidadeNecessaria: qAtual > 0 ? qAtual * mult : null
  }
}

function faixaInformada(valor) {
  const n = Number(valor)
  return Number.isFinite(n) && n >= 0 ? n : null
}

/**
 * Faixa comercial do orçamento: média ± desvio, com payback proporcional
 * ao CAPEX e VPL de 1ª ordem (CAPEX maior → VPL menor).
 */
export function calcularFaixaFinanceira({
  capexMid,
  capexMin,
  capexMax,
  paybackAnos,
  vplBrl,
  desvio = CAPEX_DESVIO_PERCENTUAL
}) {
  const mid = producaoNaoNegativa(capexMid)
  const desvioOk =
    Number.isFinite(Number(desvio)) && Number(desvio) >= 0
      ? Number(desvio)
      : CAPEX_DESVIO_PERCENTUAL
  const desvioPct = desvioOk * 100
  const paybackInformado = Number(paybackAnos)
  const paybackMid =
    Number.isFinite(paybackInformado) && paybackInformado > 0 ? paybackInformado : 0
  const vplInformado = Number(vplBrl)
  const vplMid = Number.isFinite(vplInformado) ? vplInformado : 0

  if (mid <= 0) {
    return {
      capexMid: 0,
      capexMin: 0,
      capexMax: 0,
      desvioPct,
      paybackMin: 0,
      paybackMid: 0,
      paybackMax: 0,
      vplMin: vplMid,
      vplMid,
      vplMax: vplMid
    }
  }

  const min = faixaInformada(capexMin) ?? mid * (1 - desvioOk)
  const max = faixaInformada(capexMax) ?? mid * (1 + desvioOk)

  return {
    capexMid: mid,
    capexMin: min,
    capexMax: max,
    desvioPct,
    paybackMid,
    paybackMin: paybackMid * (min / mid),
    paybackMax: paybackMid * (max / mid),
    vplMid,
    vplMin: vplMid - (max - mid),
    vplMax: vplMid + (mid - min)
  }
}

/**
 * Reprecifica uma faixa financeira já calculada aplicando um ajuste de margem
 * (%) definido internamente pela equipe comercial antes de emitir a proposta.
 * Receita assumida constante: CAPEX maior desloca payback proporcionalmente
 * para cima e VPL para baixo pelo delta absoluto de CAPEX.
 */
export function aplicarMargemAjuste(faixa, margemAjustePercentual = 0) {
  const m = Number(margemAjustePercentual)
  const fator = 1 + (Number.isFinite(m) ? m : 0) / 100
  const deltaCapexMid = faixa.capexMid * fator - faixa.capexMid

  return {
    ...faixa,
    capexMid: faixa.capexMid * fator,
    capexMin: faixa.capexMin * fator,
    capexMax: faixa.capexMax * fator,
    paybackMid: faixa.paybackMid * fator,
    paybackMin: faixa.paybackMin * fator,
    paybackMax: faixa.paybackMax * fator,
    vplMid: faixa.vplMid - deltaCapexMid,
    vplMin: faixa.vplMin - deltaCapexMid,
    vplMax: faixa.vplMax - deltaCapexMid
  }
}
