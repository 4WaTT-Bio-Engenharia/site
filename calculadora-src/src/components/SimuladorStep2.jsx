import { memo, useEffect, useRef, useState } from 'react'
import { LIMITES_NUMERICOS } from '../utils/campos'
import { MATERIA_PRIMA_DATA, PRECO_GLP_RS_KG_MEDIO } from '../domain/materiaPrimaData.js'
import { CATEGORIAS, CATEGORIAS_ORDEM } from '../data/categorias'
import { formatarNumeroBR } from '../domain/calculos.js'
import LocalizacaoPlanta from './LocalizacaoPlanta'

/**
 * Passo 2 isolado: estado local de quantidade evita re-render do App a cada tecla (INP).
 */
function SimuladorStep2({
  materiaPrima,
  mostrarSeletorMateriaPrima,
  itens,
  onVoltar,
  onTrocarMateriaPrima,
  onCancelarSeletor,
  onSelecionarMateriaPrima,
  onAbrirSeletor,
  onAdicionarItem,
  onVerViabilidade,
  onRemoverItem,
  parametrosCenario,
  onParametrosChange,
  localizacao,
  onLocalizacaoChange,
  parametrosPreAprovacao,
  onParametrosPreAprovacaoChange
}) {
  const [quantidade, setQuantidade] = useState('')
  const [parametrosAbertos, setParametrosAbertos] = useState(false)
  const materiaPrimaSelectRef = useRef(null)

  const updateParametro = (campo, valor) => {
    onParametrosChange((prev) => ({ ...prev, [campo]: valor }))
  }

  const updateParametroPreAprovacao = (campo, valor) => {
    onParametrosPreAprovacaoChange((prev) => ({ ...prev, [campo]: valor }))
  }

  const unidadeAtual =
    materiaPrima && MATERIA_PRIMA_DATA[materiaPrima]
      ? MATERIA_PRIMA_DATA[materiaPrima].unidade
      : null

  useEffect(() => {
    setQuantidade('')
  }, [materiaPrima])

  const qNum = quantidade !== '' ? parseFloat(quantidade) : NaN
  const qValida = Number.isFinite(qNum) && qNum > 0

  const handleAdicionar = () => {
    if (!materiaPrima || !qValida) return
    onAdicionarItem(qNum)
  }

  const handleViabilidade = () => {
    onVerViabilidade(quantidade)
  }

  const podeViabilidade =
    !(itens.length === 0 && (!materiaPrima || !qValida)) &&
    !(itens.length > 0 && materiaPrima && !qValida)

  return (
    <div className="card card-step fade-in">
      <p className="step-message">Informe a quantidade diária conforme a unidade indicada.</p>
      <p className="step-indicator">Passo 2 de 3 — Quanto você tem?</p>
      <button type="button" className="btn btn-secondary btn-back" onClick={onVoltar}>
        ← Voltar
      </button>
      <div className="form-step2-expanded">
        {!mostrarSeletorMateriaPrima && materiaPrima && (
          <div className="mp-selecionada-card">
            <div className="mp-selecionada-info">
              <span className="mp-selecionada-label">Matéria-prima selecionada</span>
              <span className="mp-selecionada-nome">{materiaPrima}</span>
              <span className="mp-selecionada-unidade">
                {MATERIA_PRIMA_DATA[materiaPrima]?.unidade === 'animal' && 'animal/dia'}
                {MATERIA_PRIMA_DATA[materiaPrima]?.unidade === 'tonelada' && 'ton/dia'}
                {MATERIA_PRIMA_DATA[materiaPrima]?.unidade === 'm3' && 'm³/dia'}
              </span>
            </div>
            <button type="button" className="btn btn-text" onClick={onTrocarMateriaPrima}>
              Trocar
            </button>
          </div>
        )}

        {mostrarSeletorMateriaPrima && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 8
              }}
            >
              <label className="form-label" style={{ marginBottom: 0 }}>
                Escolha a matéria-prima / resíduo
              </label>
              <button
                type="button"
                className="btn btn-text"
                onClick={onCancelarSeletor}
                style={{ fontSize: '0.8rem' }}
              >
                Cancelar
              </button>
            </div>
            <div className="mp-grupos">
              {CATEGORIAS_ORDEM.map((catId) => {
                const cat = CATEGORIAS[catId]
                const mps = cat.subcategorias
                  .flatMap((s) => s.materiasPrimas)
                  .filter((k) => MATERIA_PRIMA_DATA[k])
                if (mps.length === 0) return null
                return (
                  <div key={catId} className="mp-grupo">
                    <div className="mp-grupo-header">
                      <img
                        src={cat.image}
                        alt={cat.nome}
                        className="mp-grupo-img"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="mp-grupo-nome">{cat.nome}</span>
                    </div>
                    <div className="mp-grid">
                      {mps.map((key) => (
                        <button
                          key={key}
                          type="button"
                          className={`mp-card ${materiaPrima === key ? 'selected' : ''}`}
                          onClick={() => onSelecionarMateriaPrima(key)}
                        >
                          <span className="mp-card-nome">{key}</span>
                          <span className="mp-card-unidade">
                            {MATERIA_PRIMA_DATA[key]?.unidade === 'animal' && 'animal/dia'}
                          </span>
                          <span className="mp-card-unidade">
                            {MATERIA_PRIMA_DATA[key]?.unidade === 'tonelada' && 'ton/dia'}
                          </span>
                          <span className="mp-card-unidade">
                            {MATERIA_PRIMA_DATA[key]?.unidade === 'm3' && 'm³/dia'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {materiaPrima && (
          <div className="mp-quantidade-box visible">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                {unidadeAtual === 'animal' && 'Número de animais'}
                {unidadeAtual === 'tonelada' && 'Toneladas por dia'}
                {unidadeAtual === 'm3' && 'm³ por dia'}
                {!unidadeAtual && 'Quantidade'}
              </label>
              <input
                ref={materiaPrimaSelectRef}
                type="number"
                className="form-control"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                min={LIMITES_NUMERICOS.quantidade.min}
                max={LIMITES_NUMERICOS.quantidade.max}
                step="0.01"
                placeholder="Digite a quantidade"
              />
            </div>
            {unidadeAtual && <span className="unidade-badge">Unidade: {unidadeAtual}</span>}
            <div className="step2-actions" style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAdicionar}
                disabled={!materiaPrima || !qValida}
                style={{ flex: 1 }}
              >
                + Adicionar fonte
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleViabilidade}
                disabled={!podeViabilidade}
                style={{ flex: 2 }}
              >
                Ver minha viabilidade
              </button>
            </div>
          </div>
        )}

        {!materiaPrima && itens.length > 0 && !mostrarSeletorMateriaPrima && (
          /* Os dois botões precisam existir AQUI também, não só no bloco de
             `materiaPrima`. Depois de adicionar a primeira fonte a matéria-prima
             é limpa, aquele bloco desmonta e "Ver minha viabilidade" ia junto:
             quem adicionasse uma fonte ficava sem nenhum caminho para o
             resultado, obrigado a cadastrar uma segunda ou remover a primeira.
             Encontrado no teste visual de 23/09/2026. */
          <div className="step2-actions" style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onAbrirSeletor}
              style={{ flex: 1 }}
            >
              ➕ Adicionar outra fonte
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleViabilidade}
              disabled={!podeViabilidade}
              style={{ flex: 2 }}
            >
              Ver minha viabilidade
            </button>
          </div>
        )}
      </div>

      {itens.length > 0 && (
        <div className="itens-lista" style={{ marginTop: 28 }}>
          <h4 className="card-title" style={{ fontSize: '0.95rem', marginBottom: 12 }}>
            Fontes adicionadas
          </h4>
          <div className="itens-lista-inner">
            {itens.map((item) => (
              <div key={item.id} className="item-row">
                <div className="item-info">
                  <span className="item-nome">{item.materiaPrima}</span>
                  <span className="item-qtd">
                    {formatarNumeroBR(item.quantidade, 2)} {item.unidade}/dia
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-remover"
                  onClick={() => onRemoverItem(item.id)}
                  title="Remover"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="demanda-cliente">
        <h4 className="card-title" style={{ fontSize: '0.95rem', marginBottom: 6 }}>
          Sua demanda (opcional)
        </h4>
        <p className="form-hint">
          Informe o que sua operação consome hoje para vermos quanto este projeto cobre e o que
          sobra para comercializar.
        </p>
        <div
          className="parametros-cenario-grid"
          style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'
          }}
        >
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="demanda-energia">
              Demanda de energia (kWh/mês)
            </label>
            <input
              id="demanda-energia"
              type="number"
              className="form-control"
              min={LIMITES_NUMERICOS.consumo.min}
              max={LIMITES_NUMERICOS.consumo.max}
              step="1"
              placeholder="Opcional"
              value={parametrosCenario.demanda_energia_kwh_mes}
              onChange={(e) => updateParametro('demanda_energia_kwh_mes', e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="demanda-glp">
              Demanda de GLP (kg/mês)
            </label>
            <input
              id="demanda-glp"
              type="number"
              className="form-control"
              min={LIMITES_NUMERICOS.consumo.min}
              max={LIMITES_NUMERICOS.consumo.max}
              step="0.1"
              placeholder="Opcional"
              value={parametrosCenario.demanda_glp_kg_mes}
              onChange={(e) => updateParametro('demanda_glp_kg_mes', e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="preco-glp">
              Preço do GLP (R$/kg)
            </label>
            <input
              id="preco-glp"
              type="number"
              className="form-control"
              min={LIMITES_NUMERICOS.preco.min}
              max={LIMITES_NUMERICOS.preco.max}
              step="0.01"
              value={parametrosCenario.glp_preco_rs_kg}
              onChange={(e) => updateParametro('glp_preco_rs_kg', e.target.value)}
            />
            <p className="form-hint">
              Média de referência R$ {formatarNumeroBR(PRECO_GLP_RS_KG_MEDIO, 2)}/kg — ajuste ao seu
              contrato.
            </p>
          </div>
        </div>
      </div>

      <div className="parametros-cenario" style={{ marginTop: 24 }}>
        <LocalizacaoPlanta
          uf={localizacao.uf}
          concessionariaId={localizacao.concessionariaId}
          onChange={onLocalizacaoChange}
        />
      </div>

      <div className="parametros-cenario" style={{ marginTop: 24 }}>
        <button
          type="button"
          className="btn btn-text parametros-cenario-toggle"
          onClick={() => setParametrosAbertos((v) => !v)}
          aria-expanded={parametrosAbertos}
        >
          {parametrosAbertos ? '▼' : '▶'} Parâmetros do seu cenário (tarifas, lenha, WACC)
        </button>
        {parametrosAbertos && (
          <div
            className="parametros-cenario-grid"
            style={{
              marginTop: 12,
              display: 'grid',
              gap: 12,
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'
            }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Tarifa energia (R$/kWh)</label>
              <input
                type="number"
                className="form-control"
                min="0"
                step="0.01"
                value={parametrosCenario.energy_price}
                onChange={(e) => updateParametro('energy_price', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Preço biometano (R$/m³)</label>
              <input
                type="number"
                className="form-control"
                min="0"
                step="0.01"
                value={parametrosCenario.biomethane_price}
                onChange={(e) => updateParametro('biomethane_price', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Consumo lenha (kg/dia)</label>
              <input
                type="number"
                className="form-control"
                min="0"
                step="1"
                placeholder="Opcional"
                value={parametrosCenario.lenha_consumo_kg_dia}
                onChange={(e) => updateParametro('lenha_consumo_kg_dia', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Preço lenha (R$/kg)</label>
              <input
                type="number"
                className="form-control"
                min="0"
                step="0.01"
                placeholder="Opcional"
                value={parametrosCenario.lenha_preco_rs_kg}
                onChange={(e) => updateParametro('lenha_preco_rs_kg', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">WACC (% a.a.)</label>
              <input
                type="number"
                className="form-control"
                min="0"
                step="0.5"
                value={parametrosCenario.wacc}
                onChange={(e) => updateParametro('wacc', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Gate fee de resíduo (R$/ton)</label>
              <input
                type="number"
                className="form-control"
                min="0"
                step="1"
                placeholder="Opcional (input manual)"
                value={parametrosPreAprovacao.gateFeeRsTon}
                onChange={(e) => updateParametroPreAprovacao('gateFeeRsTon', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Crédito de carbono (R$/tCO₂eq)</label>
              <input
                type="number"
                className="form-control"
                min="0"
                step="1"
                value={parametrosPreAprovacao.precoCarbonoRsTco2}
                onChange={(e) => updateParametroPreAprovacao('precoCarbonoRsTco2', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Impostos sobre energia GD (%)</label>
              <input
                type="number"
                className="form-control"
                min="0"
                max="50"
                step="0.5"
                value={Number(parametrosPreAprovacao.impostoPct) * 100}
                onChange={(e) => {
                  const pct = e.target.value === '' ? 0 : Number(e.target.value)
                  updateParametroPreAprovacao('impostoPct', Number.isFinite(pct) ? pct / 100 : 0)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(SimuladorStep2)
