import { memo } from 'react'
import { formatarNumeroBR } from '../domain/calculos.js'

/**
 * Painel de pré-aprovação: produção estimada (biogás ±5%, biometano, CO2,
 * fertilizante, energia, créditos de carbono), fontes de receita e
 * CAPEX/OPEX estimados. Renderiza a partir do objeto de `calcularPreAprovacao`.
 */
function PreAprovacaoResultados ({ preAprovacao }) {
  if (!preAprovacao || preAprovacao.producao.biogas.m3Dia <= 0) return null

  const { producao, receitas, investimento, paybackAnos, preAprovado } = preAprovacao
  const margemPct = formatarNumeroBR(producao.biogas.margemPct * 100, 0)

  const linhasProducao = [
    {
      nome: 'Biogás',
      valor: `${formatarNumeroBR(producao.biogas.m3DiaMin, 0)} – ${formatarNumeroBR(producao.biogas.m3DiaMax, 0)} m³/dia`,
      detalhe: `central ${formatarNumeroBR(producao.biogas.m3Dia, 0)} m³/dia (±${margemPct}%) · ${formatarNumeroBR(producao.biogas.m3Mes, 0)} m³/mês · ${formatarNumeroBR(producao.biogas.m3Ano, 0)} m³/ano · ${formatarNumeroBR(producao.biogas.mmbtuAno, 0)} MMBtu/ano`
    },
    {
      nome: 'Biometano',
      valor: `${formatarNumeroBR(producao.biometano.m3Dia, 0)} m³/dia`,
      detalhe: `${formatarNumeroBR(producao.biometano.m3Mes, 0)} m³/mês · ${formatarNumeroBR(producao.biometano.m3Ano, 0)} m³/ano · ${formatarNumeroBR(producao.biometano.mmbtuAno, 0)} MMBtu/ano${producao.biometano.apto ? '' : ' · abaixo do limiar de viabilidade (3.500 m³/dia de biogás)'}`
    },
    {
      nome: 'CO₂ recuperável',
      valor: `${formatarNumeroBR(producao.co2.tonDia, 1)} ton/dia`,
      detalhe: `${formatarNumeroBR(producao.co2.tonAno, 0)} ton/ano (separação no upgrading do biometano)`
    },
    {
      nome: 'Fertilizante líquido',
      valor: `${formatarNumeroBR(producao.fertilizante.liquidoM3Dia, 1)} m³/dia`,
      detalhe: `${formatarNumeroBR(producao.fertilizante.liquidoM3Ano, 0)} m³/ano`
    },
    {
      nome: 'Fertilizante sólido',
      valor: `${formatarNumeroBR(producao.fertilizante.solidoTonDia, 1)} ton/dia`,
      detalhe: `${formatarNumeroBR(producao.fertilizante.solidoTonAno, 0)} ton/ano`
    },
    {
      nome: 'Energia elétrica',
      valor: `${formatarNumeroBR(producao.energia.kwhDia, 0)} kWh/dia`,
      detalhe: `${formatarNumeroBR(producao.energia.kwhMes, 0)} kWh/mês · rotas: ${producao.energia.rotas.map((r) => r.nome).join(' · ')}`
    },
    {
      nome: 'Créditos de carbono *estimados',
      valor: `${formatarNumeroBR(producao.creditosCarbono.tco2eqAno, 0)} tCO₂eq/ano`,
      detalhe: `faixa ${formatarNumeroBR(producao.creditosCarbono.tco2eqAnoMin, 0)} – ${formatarNumeroBR(producao.creditosCarbono.tco2eqAnoMax, 0)} tCO₂eq/ano`
    }
  ]

  const linhasReceita = [
    {
      nome: 'Energia elétrica — GD (deságio 40%)',
      valor: receitas.energiaGD.rsMes,
      detalhe: `tarifa ${formatarNumeroBR(receitas.energiaGD.tarifaRsKwh, 3)} R$/kWh − 40% − fio B ${formatarNumeroBR(receitas.energiaGD.fioBRsKwh, 3)} − impostos ${formatarNumeroBR(receitas.energiaGD.impostoPct * 100, 0)}% = ${formatarNumeroBR(receitas.energiaGD.valorLiquidoKwh, 3)} R$/kWh líquido`
    },
    {
      nome: 'Energia elétrica — mercado livre (ACL)',
      valor: receitas.energiaMercado.rsMes,
      detalhe: `${formatarNumeroBR(receitas.energiaMercado.precoRsKwh, 2)} R$/kWh de referência`
    },
    {
      nome: 'Biometano',
      valor: receitas.biometano.rsMes,
      detalhe: `${formatarNumeroBR(producao.biometano.m3Mes, 0)} m³/mês × ${formatarNumeroBR(receitas.biometano.precoRsM3, 2)} R$/m³`
    },
    {
      nome: 'Equivalência térmica',
      valor: receitas.termica.rsMes,
      detalhe: `${formatarNumeroBR(receitas.termica.lenhaKgDia, 0)} kg lenha/dia · ${formatarNumeroBR(receitas.termica.glpKgDia, 0)} kg GLP/dia · ${formatarNumeroBR(receitas.termica.gnM3Dia, 0)} m³ GN/dia`
    },
    {
      nome: 'Fertilizante (líquido + sólido)',
      valor: receitas.fertilizante.rsMes,
      detalhe: `${formatarNumeroBR(receitas.fertilizante.precoLiquidoRsM3, 2)} R$/m³ líq. · ${formatarNumeroBR(receitas.fertilizante.precoSolidoRsTon, 2)} R$/ton sólido`
    },
    {
      nome: 'CO₂ (cenário biometano)',
      valor: receitas.co2.rsMes,
      detalhe: `${formatarNumeroBR(producao.co2.tonMes, 0)} ton/mês × ${formatarNumeroBR(receitas.co2.precoRsKg, 2)} R$/kg`
    },
    {
      nome: 'Crédito de carbono *estimado',
      valor: receitas.creditoCarbono.rsMes,
      detalhe: `${formatarNumeroBR(receitas.creditoCarbono.precoRsTco2, 2)} R$/tCO₂eq (preço manual editável)`
    },
    {
      nome: 'Gate fee de resíduo',
      valor: receitas.gateFee.rsMes,
      detalhe: receitas.gateFee.precoRsTon > 0
        ? `${formatarNumeroBR(receitas.gateFee.tonDia, 1)} ton/dia × ${formatarNumeroBR(receitas.gateFee.precoRsTon, 2)} R$/ton`
        : 'não informado (input manual nos parâmetros)'
    }
  ]

  return (
    <div className="pre-aprovacao" style={{ marginTop: 32 }}>
      <h3 className="card-title" style={{ fontSize: '1.15rem' }}>Pré-aprovação do projeto</h3>
      {receitas.concessionaria && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Localização: {preAprovacao.localizacao.uf} · Concessionária: {receitas.concessionaria.nome}
        </p>
      )}

      <h4 className="pre-aprovacao-subtitulo">Produção estimada</h4>
      <div className="pre-aprovacao-tabela">
        {linhasProducao.map((l) => (
          <div key={l.nome} className="pre-aprovacao-linha">
            <span className="pre-aprovacao-nome">{l.nome}</span>
            <span className="pre-aprovacao-valor">{l.valor}</span>
            <span className="pre-aprovacao-detalhe">{l.detalhe}</span>
          </div>
        ))}
      </div>

      <h4 className="pre-aprovacao-subtitulo">Fontes de receita (como monetizar)</h4>
      <div className="pre-aprovacao-tabela">
        {linhasReceita.map((l) => (
          <div key={l.nome} className="pre-aprovacao-linha">
            <span className="pre-aprovacao-nome">{l.nome}</span>
            <span className="pre-aprovacao-valor">
              {l.valor > 0 ? `R$ ${formatarNumeroBR(l.valor, 0)}/mês` : '—'}
            </span>
            <span className="pre-aprovacao-detalhe">{l.detalhe}</span>
          </div>
        ))}
        <div className="pre-aprovacao-linha pre-aprovacao-total">
          <span className="pre-aprovacao-nome">Total cenário energia</span>
          <span className="pre-aprovacao-valor">R$ {formatarNumeroBR(receitas.totalCenarioEnergia, 0)}/mês</span>
          <span className="pre-aprovacao-detalhe">
            {formatarNumeroBR(receitas.totalCenarioEnergiaAno, 0)} R$/ano (GD + térmica + fertilizante + carbono + gate fee)
          </span>
        </div>
        <div className="pre-aprovacao-linha pre-aprovacao-total">
          <span className="pre-aprovacao-nome">Total cenário biometano</span>
          <span className="pre-aprovacao-valor">R$ {formatarNumeroBR(receitas.totalCenarioBiometano, 0)}/mês</span>
          <span className="pre-aprovacao-detalhe">
            {formatarNumeroBR(receitas.totalCenarioBiometanoAno, 0)} R$/ano (biometano + CO₂ + fertilizante + carbono + gate fee)
          </span>
        </div>
      </div>

      <h4 className="pre-aprovacao-subtitulo">Investimento estimado (rota {investimento.modo === 'biometano' ? 'biometano' : 'energia'})</h4>
      <div className="pre-aprovacao-tabela">
        <div className="pre-aprovacao-linha">
          <span className="pre-aprovacao-nome">CAPEX estimado</span>
          <span className="pre-aprovacao-valor">
            R$ {formatarNumeroBR(investimento.capex.min, 0)} – {formatarNumeroBR(investimento.capex.max, 0)}
          </span>
          <span className="pre-aprovacao-detalhe">central R$ {formatarNumeroBR(investimento.capex.central, 0)}</span>
        </div>
        <div className="pre-aprovacao-linha">
          <span className="pre-aprovacao-nome">OPEX estimado</span>
          <span className="pre-aprovacao-valor">
            R$ {formatarNumeroBR(investimento.opexAno.min, 0)} – {formatarNumeroBR(investimento.opexAno.max, 0)}
          </span>
          <span className="pre-aprovacao-detalhe">por ano (~{formatarNumeroBR(investimento.opexPctCapex * 100, 0)}% do CAPEX)</span>
        </div>
        <div className="pre-aprovacao-linha">
          <span className="pre-aprovacao-nome">Payback simples</span>
          <span className="pre-aprovacao-valor">
            {paybackAnos != null ? `${formatarNumeroBR(paybackAnos, 1)} anos` : 'não calculável'}
          </span>
          <span className="pre-aprovacao-detalhe">
            {preAprovado ? 'Receita anual do cenário cobre o OPEX estimado' : 'Receita insuficiente para cobrir o OPEX neste cenário'}
          </span>
        </div>
      </div>

      <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Estimativas de pré-viabilidade com margem de assertividade de ±{margemPct}% no biogás. Tarifas e fio B são
        referências por concessionária (editáveis). Valores não substituem o estudo técnico-econômico (EVTE).
      </p>
    </div>
  )
}

export default memo(PreAprovacaoResultados)
