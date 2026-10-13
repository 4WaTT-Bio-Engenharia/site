import { memo } from 'react'
import ResultCard from './ResultCard'
import PreAprovacaoResultados from './PreAprovacaoResultados'
import { BIOGAS_MINIMO_RESULTADOS_DETALHADOS } from '../domain/materiaPrimaData.js'
import { formatarNumeroBR } from '../domain/calculos.js'

/**
 * Payback só é um número quando existe. Sem isto, projeto inviável exibia
 * "de 0,0 a 0,0 anos" — que se lê como "se paga na hora", o oposto do que os
 * outros dois cartões (VPL negativo, CAPEX alto) estão dizendo ao lado.
 * Mesmo vocabulário do estudo EVTE completo.
 */
function textoPayback(min, max) {
  const valido = (v) => typeof v === 'number' && Number.isFinite(v) && v > 0
  if (!valido(min) && !valido(max)) return null
  if (!valido(min)) return `até ${formatarNumeroBR(max, 1)}`
  if (!valido(max)) return `a partir de ${formatarNumeroBR(min, 1)}`
  return null
}

const SUGESTAO_COMERCIALIZACAO_PADRAO =
  'Com este resíduo a produção já supera a demanda. Se o interesse for comercializar o excedente ou fazer um projeto maior, fale com a 4WaTT — seria necessário mais matéria-prima.'

function textoSugestaoOperacao({
  energia,
  glp,
  escalaEnergia,
  escalaGlp,
  escalaComercializacaoEnergia,
  escalaComercializacaoGlp
}) {
  const demandaEnergia = energia && !energia.semDemanda
  const demandaGlp = glp && !glp.semDemanda
  if (!demandaEnergia && !demandaGlp) return null

  const deficitEnergia = demandaEnergia && energia.deficit > 0
  const deficitGlp = demandaGlp && glp.deficit > 0
  const excedenteEnergia = demandaEnergia && energia.excedente > 0
  const excedenteGlp = demandaGlp && glp.excedente > 0

  if (deficitEnergia || deficitGlp) {
    const unico =
      deficitEnergia && !deficitGlp
        ? { alvo: energia, escala: escalaEnergia }
        : deficitGlp && !deficitEnergia
          ? { alvo: glp, escala: escalaGlp }
          : null
    if (unico?.alvo) {
      const fatorTxt = unico.escala?.fator
        ? ` na proporção ${formatarNumeroBR(unico.escala.fator, 1)}×`
        : ''
      return `A produção cobre ${formatarNumeroBR(unico.alvo.coberturaPct, 0)}% da demanda. Para chegar a 100% a estimativa é aumentar o resíduo${fatorTxt}.`
    }
    const menor = Math.min(
      deficitEnergia ? energia.coberturaPct : 100,
      deficitGlp ? glp.coberturaPct : 100
    )
    return `A produção cobre ${formatarNumeroBR(menor, 0)}% da demanda mais restritiva. Para chegar a 100% a estimativa é aumentar o resíduo.`
  }

  if (excedenteEnergia || excedenteGlp) {
    const escala = excedenteEnergia ? escalaComercializacaoEnergia : escalaComercializacaoGlp
    if (escala?.aplicavel) {
      return `Com este resíduo a produção já supera a demanda própria. Para multiplicar o volume comercializável por ${formatarNumeroBR(escala.fator, 1)}×, a estimativa é aumentar o resíduo na mesma proporção — fale com a 4WaTT para dimensionar um projeto maior.`
    }
    return SUGESTAO_COMERCIALIZACAO_PADRAO
  }

  return 'A produção cobre 100% da demanda informada, sem excedente para comercializar.'
}

function ResultadosStep({
  resultados,
  energiaMensalExtremos,
  faturamento,
  reducaoEmissoes,
  biofertilizante,
  atendeMinimoBiometano,
  indicadoresDemanda = null,
  onReset,
  onNovaSimulacao,
  whatsappLink,
  preAprovacao = null
}) {
  const energiaDemanda = indicadoresDemanda?.energia
  const glpDemanda = indicadoresDemanda?.glp
  const demandaEnergia = Boolean(energiaDemanda && !energiaDemanda.semDemanda)
  const mostrarGlp = Boolean(glpDemanda && (resultados.glp || 0) > 0)
  const mostrarBlocoDemanda = demandaEnergia || mostrarGlp
  const sugestaoDemanda = mostrarBlocoDemanda
    ? textoSugestaoOperacao({
        energia: energiaDemanda,
        glp: glpDemanda,
        escalaEnergia: indicadoresDemanda?.escalaEnergia,
        escalaGlp: indicadoresDemanda?.escalaGlp,
        escalaComercializacaoEnergia: indicadoresDemanda?.escalaComercializacaoEnergia,
        escalaComercializacaoGlp: indicadoresDemanda?.escalaComercializacaoGlp
      })
    : null

  return (
    <div className="card fade-in">
      <p className="step-message">Confira a projeção de produção e o faturamento estimado.</p>
      <p className="step-indicator">Passo 3 de 3 — Resultado</p>
      <button type="button" className="btn btn-secondary btn-back" onClick={onReset}>
        ← Nova simulação
      </button>

      <h2 className="card-title" style={{ marginTop: 12 }}>
        Resumo da Viabilidade
      </h2>

      <div className="results-grid">
        <ResultCard
          title="Geração de biogás"
          value={
            <span className="result-range">
              <span className="range-prefix">de </span>
              {formatarNumeroBR(resultados.biogas, 2)}
              <span className="range-prefix"> a </span>
              {formatarNumeroBR(resultados.biogas * 1.15, 2)}
            </span>
          }
          unit="m³/dia"
          className="biogas"
        />
        <ResultCard
          title="Energia gerada"
          value={
            <span className="result-range">
              <span className="range-prefix">de </span>
              {formatarNumeroBR(energiaMensalExtremos.min, 2)}
              <span className="range-prefix"> a </span>
              {formatarNumeroBR(energiaMensalExtremos.max, 2)}
            </span>
          }
          unit="kWh/mês"
          className="energia"
        />
        <ResultCard
          title="Faturamento estimado"
          value={
            <span className="result-range">
              <span className="range-prefix">de </span>
              {formatarNumeroBR(faturamento, 2)}
              <span className="range-prefix"> a </span>
              {formatarNumeroBR(faturamento * 1.15, 2)}
            </span>
          }
          unit="R$/mês"
          className="faturamento"
        />
      </div>

      <div className="results-grid" style={{ marginTop: 20 }}>
        <ResultCard
          icon="🌱"
          title="Redução de Emissões"
          value={formatarNumeroBR(reducaoEmissoes, 2)}
          unit="tCO₂eq/ano"
          className="cc"
        />
        <ResultCard
          icon="🌿"
          title="Produção de Adubo Orgânico"
          value={formatarNumeroBR(biofertilizante, 2)}
          unit="m³/ano"
          className="biometano"
        />
      </div>

      {mostrarBlocoDemanda && (
        <div className="demanda-resultados">
          <h3 className="card-title" style={{ fontSize: '1.15rem' }}>
            Quanto isso cobre da sua operação
          </h3>
          <div className="results-grid">
            {demandaEnergia && (
              <>
                <ResultCard
                  icon="⚡"
                  title="Cobertura da demanda elétrica"
                  value={formatarNumeroBR(energiaDemanda.coberturaPct, 0)}
                  unit="% da sua conta"
                  className="energia"
                />
                <ResultCard
                  icon="💵"
                  title="Economia na conta de energia"
                  value={formatarNumeroBR(energiaDemanda.economiaRsMes, 2)}
                  unit="R$/mês"
                  className="faturamento"
                />
                <ResultCard
                  icon="📦"
                  title="Excedente comercializável"
                  value={formatarNumeroBR(energiaDemanda.excedente, 2)}
                  unit="kWh/mês"
                  className="biogas"
                />
              </>
            )}
            {mostrarGlp && (
              <>
                <ResultCard
                  icon="⛽"
                  title={
                    glpDemanda.semDemanda ? 'Equivalência de GLP' : 'Cobertura da demanda de GLP'
                  }
                  value={
                    glpDemanda.semDemanda
                      ? formatarNumeroBR(resultados.glp, 2)
                      : formatarNumeroBR(glpDemanda.coberturaPct, 0)
                  }
                  unit={glpDemanda.semDemanda ? 'kg/dia' : '% do consumo'}
                  className="glp"
                />
                <ResultCard
                  icon="💵"
                  title={glpDemanda.semDemanda ? 'Economia potencial com GLP' : 'Economia com GLP'}
                  value={formatarNumeroBR(glpDemanda.economiaRsMes, 2)}
                  unit="R$/mês"
                  className="faturamento"
                />
                {!glpDemanda.semDemanda && glpDemanda.excedente > 0 && (
                  <ResultCard
                    icon="📦"
                    title="Excedente de GLP"
                    value={formatarNumeroBR(glpDemanda.excedente, 2)}
                    unit="kg/mês"
                    className="glp"
                  />
                )}
              </>
            )}
          </div>
          {sugestaoDemanda && <p className="sugestao-demanda">{sugestaoDemanda}</p>}
        </div>
      )}

      <div className="cases-sucesso">
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--primary)',
            marginBottom: 16,
            textAlign: 'center'
          }}
        >
          Quem já confia na 4WaTT para regenerar valor:
        </h3>
        <div className="cases-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            className="case-item"
            style={{
              padding: '12px 16px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--primary)'
            }}
          >
            <strong>Usina CEASA (GO):</strong> Transformação de resíduos orgânicos urbanos em
            energia e biofertilizantes em operação contínua.
          </div>
          <div
            className="case-item"
            style={{
              padding: '12px 16px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--primary)'
            }}
          >
            <strong>Granja Rocha (GO):</strong> Diagnóstico e projeto de EVTEJA para alta
            performance na suinocultura.
          </div>
          <div
            className="case-item"
            style={{
              padding: '12px 16px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--primary)'
            }}
          >
            <strong>Setor Sucroenergético (SP):</strong> Substituição de diesel por biometano a
            partir da vinhaça.
          </div>
        </div>
        <p
          style={{
            textAlign: 'center',
            marginTop: 16,
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}
        >
          Atuamos em +10 estados brasileiros com soluções de engenharia bancável e inteligência
          contínua.
        </p>
      </div>

      <PreAprovacaoResultados preAprovacao={preAprovacao} />

      {resultados.biogas > BIOGAS_MINIMO_RESULTADOS_DETALHADOS && (
        <div style={{ marginTop: 32 }}>
          <h3 className="card-title" style={{ fontSize: '1.15rem' }}>
            Resultados detalhados
          </h3>
          <div className="results-grid">
            <ResultCard
              icon="💨"
              title="Produção de Biogás"
              value={formatarNumeroBR(resultados.biogas, 2)}
              unit="m³/dia"
              className="biogas"
            />
            {atendeMinimoBiometano && (
              <>
                <ResultCard
                  icon="🔬"
                  title="Produção de Biometano"
                  value={formatarNumeroBR(resultados.biometano, 2)}
                  unit="m³/dia"
                  className="biometano"
                />
                <ResultCard
                  icon="⛽"
                  title="Equivalência de GLP"
                  value={formatarNumeroBR(resultados.glp, 2)}
                  unit="kg/dia"
                  className="glp"
                />
                <ResultCard
                  icon="🔥"
                  title="Equivalência de GN"
                  value={formatarNumeroBR(resultados.gn, 2)}
                  unit="m³/dia"
                  className="gn"
                />
              </>
            )}
            <ResultCard
              icon="🪵"
              title="Equivalência em Lenha"
              value={formatarNumeroBR(resultados.lenha, 2)}
              unit="kg/dia"
              className="lenha"
            />
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: 32,
          padding: '20px 18px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(3, 165, 137, 0.28)',
          background: 'rgba(3, 165, 137, 0.06)',
          textAlign: 'center'
        }}
      >
        <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: 8 }}>
          Quer um estudo completo?
        </h3>
        <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Nossa engenharia aprofunda esta simulação em um estudo técnico-econômico completo,
          com dimensionamento do biodigestor e análise de viabilidade detalhada.
        </p>
        <a className="btn btn-primary" href="/contato.html" style={{ minWidth: 280 }}>
          Fale com um especialista
        </a>
      </div>

      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <a
          className="btn btn-accent"
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ minWidth: 280 }}
        >
          💬 Falar com engenheiro especialista
        </a>
      </div>

      <div
        style={{
          marginTop: 24,
          textAlign: 'center',
          padding: '16px',
          background: 'rgba(245, 158, 11, 0.08)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}
      >
        <p style={{ fontSize: '0.9rem', color: 'var(--accent)', margin: 0 }}>
          💡 Ao contratar nossa consultoria, você terá acesso à mesma metodologia aplicada em nossos
          +80 projetos técnicos entregues em todo o Brasil.
        </p>
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <a
          className="btn btn-accent"
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ minWidth: 300, fontSize: '1.1rem', padding: '16px 32px' }}
        >
          💼 Contrate sua consultoria agora
        </a>
      </div>

      <div
        style={{
          marginTop: 28,
          textAlign: 'center',
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        <button type="button" className="btn btn-secondary" onClick={onNovaSimulacao}>
          Fazer nova simulação
        </button>
        <button type="button" className="btn btn-text" onClick={onReset}>
          Voltar ao início
        </button>
      </div>
    </div>
  )
}

export default memo(ResultadosStep)
