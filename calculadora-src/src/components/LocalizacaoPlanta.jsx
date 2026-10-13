import { memo } from 'react'
import {
  ESTADOS_BRASIL,
  listarConcessionarias,
  obterConcessionaria
} from '../domain/tarifasEnergia.js'
import { formatarNumeroBR } from '../domain/calculos.js'

/**
 * Localização da planta: lista suspensa de estados (UF) e seleção da
 * concessionária de energia local — a escolha alimenta a tarifa e o fio B
 * usados na pré-aprovação.
 */
function LocalizacaoPlanta ({ uf, concessionariaId, onChange }) {
  const concessionarias = uf ? listarConcessionarias(uf) : []
  const selecionada = uf && concessionariaId ? obterConcessionaria(uf, concessionariaId) : null

  return (
    <div className="localizacao-planta">
      <label className="form-label">Localização da planta</label>
      <div className="localizacao-grid">
        <div className="select-wrapper">
          <select
            className="form-control"
            value={uf}
            onChange={(e) => onChange({ uf: e.target.value, concessionariaId: '' })}
            aria-label="Estado (UF) da planta"
          >
            <option value="">Estado (UF)</option>
            {ESTADOS_BRASIL.map((e) => (
              <option key={e.uf} value={e.uf}>
                {e.nome} ({e.uf})
              </option>
            ))}
          </select>
        </div>
        <div className="select-wrapper">
          <select
            className="form-control"
            value={concessionariaId}
            disabled={!uf}
            onChange={(e) => onChange({ uf, concessionariaId: e.target.value })}
            aria-label="Concessionária de energia local"
          >
            <option value="">Concessionária de energia</option>
            {concessionarias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selecionada && (
        <p className="localizacao-info">
          Tarifa de referência: {formatarNumeroBR(selecionada.tarifaRsKwh, 3)} R$/kWh · Fio B:{' '}
          {formatarNumeroBR(selecionada.fioBRsKwh, 3)} R$/kWh (valores ANEEL de referência —
          editáveis nos parâmetros do cenário)
        </p>
      )}
      {!selecionada && uf && (
        <p className="localizacao-info">
          Sem concessionária selecionada — será usada a tarifa média do estado.
        </p>
      )}
    </div>
  )
}

export default memo(LocalizacaoPlanta)
