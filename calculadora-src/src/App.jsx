import { useCallback, useMemo, useRef, useState } from 'react'
import { MATERIA_PRIMA_DATA, BIOGAS_MINIMO_BIOMETANO, FATOR_CUSTO_BIOMETANO_VS_ENERGIA, PRECO_GLP_RS_KG_MEDIO, FATURAMENTO_RS_POR_KWH_MES, PRECO_BIOMETANO_RS_M3 } from './domain/materiaPrimaData.js'
import {
  calcularBiogas,
  calcularEnergia,
  calcularEnergiaMensal,
  calcularEnergiaMensalExtremos,
  calcularFaturamentoMensal,
  calcularFaturamentoBiometano,
  calcularEquivalenciaLenha,
  calcularCC,
  calcularBiometano,
  calcularEquivalenciaGLP,
  calcularEquivalenciaGN,
  calcularReducaoEmissoesAnual,
  calcularBiofertilizanteAnual,
} from './domain/calculos.js'
import {
  calcularEconomiaEnergia,
  calcularEconomiaGLP,
  sugerirEscalaParaDemanda,
  sugerirEscalaParaComercializacao
} from './domain/demandaCliente.js'
import {
  calcularPreAprovacao,
  PARAMETROS_PRE_APROVACAO_PADRAO
} from './domain/calculosPreAprovacao.js'
import { obterConcessionaria } from './domain/tarifasEnergia.js'
import HeroInstitucional from './components/HeroInstitucional'
import OptimizedImage from './components/OptimizedImage'
import ResultadosStep from './components/ResultadosStep'
import SimuladorStep2 from './components/SimuladorStep2'
import { CATEGORIAS, CATEGORIAS_ORDEM } from './data/categorias'
import { useImagePrefetch } from './hooks/useImagePrefetch'

/**
 * Calculadora 4WaTT standalone (site institucional).
 *
 * Versão pública, 100% client-side e efêmera: nenhuma chamada de API, nenhum
 * cadastro, nada em localStorage/sessionStorage — ao sair da página, a
 * simulação se perde. O cálculo usa apenas o motor local de domínio
 * (src/domain/), o mesmo caminho que o usuário anônimo já executava no app
 * original.
 */

/** Parâmetros do cenário de cálculo (antes em adapters/evtePayload.js). */
const PARAMETROS_CENARIO_PADRAO = {
  energy_price: FATURAMENTO_RS_POR_KWH_MES,
  biomethane_price: PRECO_BIOMETANO_RS_M3,
  wacc: 12,
  tipo_biodigestor: 'blc',
  lenha_consumo_kg_dia: '',
  lenha_preco_rs_kg: '',
  demanda_termica_kwh_dia: '',
  demanda_energia_kwh_mes: '',
  demanda_glp_kg_mes: '',
  glp_preco_rs_kg: PRECO_GLP_RS_KG_MEDIO
}

const WHATSAPP_CONTATO = '5562996746866'
const WHATSAPP_MENSAGEM_PADRAO = 'Olá! Quero saber mais sobre biodigestão para meu negócio'
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_CONTATO}?text=${encodeURIComponent(WHATSAPP_MENSAGEM_PADRAO)}`

/** Número fixo exibido na prova social (a versão standalone não conta acessos). */
const ACESSOS_CALCULADORA_EXIBIDOS = 112

const BASE = import.meta.env.BASE_URL

function resolverPublico(publico) {
  if (['bovinos', 'suinos', 'frigorificos', 'cana', 'ete'].includes(publico)) return publico
  if (publico === 'sucroalcooleiras') return 'cana'
  return null
}

function numeroParametro(valor, fallback = 0) {
  if (valor === '' || valor === null || valor === undefined) return fallback
  const n = Number(valor)
  return Number.isFinite(n) && n >= 0 ? n : fallback
}

function estadoInicialPorPublico(publico) {
  const categoriaId = resolverPublico(publico)
  if (!categoriaId) {
    return { categoria: null, subcategoria: null, materiaPrima: '', step: 1 }
  }
  const cat = CATEGORIAS[categoriaId]
  if (cat.subcategorias.length === 1 && cat.subcategorias[0].materiasPrimas.length === 1) {
    return {
      categoria: categoriaId,
      subcategoria: cat.subcategorias[0],
      materiaPrima: cat.subcategorias[0].materiasPrimas[0],
      step: 2
    }
  }
  return { categoria: categoriaId, subcategoria: null, materiaPrima: '', step: 1.5 }
}

function App() {
  // Deep-link ?publico=<categoria> pré-seleciona a categoria (sem react-router)
  const inicial = useMemo(
    () => estadoInicialPorPublico(new URLSearchParams(window.location.search).get('publico')),
    []
  )

  // Estados do fluxo da calculadora
  const [step, setStep] = useState(inicial.step)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(inicial.categoria)
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState(inicial.subcategoria)
  const [materiaPrima, setMateriaPrima] = useState(inicial.materiaPrima)
  const [itens, setItens] = useState([])
  /** Sempre a lista mais recente (evita closure antiga ao calcular após vários "+ Adicionar fonte"). */
  const itensRef = useRef(itens)
  itensRef.current = itens
  const [mostrarSeletorMateriaPrima, setMostrarSeletorMateriaPrima] = useState(false)

  const [resultados, setResultados] = useState({
    biogas: 0,
    energia: 0,
    lenha: 0,
    cc: 0,
    biometano: 0,
    glp: 0,
    gn: 0
  })
  const [resultadosVisiveis, setResultadosVisiveis] = useState(false)
  const [parametrosCenario, setParametrosCenario] = useState(() => ({ ...PARAMETROS_CENARIO_PADRAO }))

  // Pré-aprovação: localização da planta (UF + concessionária) e parâmetros comerciais
  const [localizacao, setLocalizacao] = useState({ uf: '', concessionariaId: '' })
  const [parametrosPreAprovacao, setParametrosPreAprovacao] = useState(() => ({
    ...PARAMETROS_PRE_APROVACAO_PADRAO
  }))

  /** Ao escolher UF/concessionária, sincroniza a tarifa do cenário com a referência da distribuidora. */
  const handleLocalizacaoChange = useCallback((nova) => {
    setLocalizacao(nova)
    const concessionaria = nova.uf && nova.concessionariaId
      ? obterConcessionaria(nova.uf, nova.concessionariaId)
      : null
    if (concessionaria) {
      setParametrosCenario((prev) => ({ ...prev, energy_price: concessionaria.tarifaRsKwh }))
      setParametrosPreAprovacao((prev) => ({ ...prev, tarifaRsKwh: null, fioBRsKwh: null }))
    }
  }, [])

  const calcularResultadosLocais = useCallback((lista = itens) => {
    const total = { biogas: 0, energia: 0, lenha: 0, cc: 0, biometano: 0, glp: 0, gn: 0 }
    for (const item of lista) {
      const biogas = calcularBiogas(item.materiaPrima, item.quantidade, MATERIA_PRIMA_DATA)
      const energia = calcularEnergia(biogas)
      total.biogas += biogas
      total.energia += energia
      total.lenha += calcularEquivalenciaLenha(biogas)
      total.cc += calcularCC(biogas)
      total.biometano += calcularBiometano(biogas)
    }
    total.glp = calcularEquivalenciaGLP(total.biometano)
    total.gn = calcularEquivalenciaGN(total.biometano)
    return total
  }, [itens])

  const calcularModoProducao = useCallback((lista) => {
    const total = calcularResultadosLocais(lista)
    const fatEnergia = calcularFaturamentoMensal(calcularEnergiaMensal(total.energia))
    const fatBioAjustado = total.biogas >= BIOGAS_MINIMO_BIOMETANO
      ? calcularFaturamentoBiometano(total.biometano) / FATOR_CUSTO_BIOMETANO_VS_ENERGIA
      : 0
    if (total.biogas >= BIOGAS_MINIMO_BIOMETANO && fatBioAjustado > fatEnergia) {
      return 'biometano'
    }
    return 'energia'
  }, [calcularResultadosLocais])

  /** Cálculo 100% local (motor de domínio) — nenhuma chamada de API. */
  const handleCalcular = useCallback((listaOverride) => {
    const lista = listaOverride ?? itens
    if (lista.length === 0) {
      setResultados({ biogas: 0, energia: 0, lenha: 0, cc: 0, biometano: 0, glp: 0, gn: 0 })
      setResultadosVisiveis(false)
      return
    }
    setResultados(calcularResultadosLocais(lista))
    setResultadosVisiveis(true)
  }, [itens, calcularResultadosLocais])

  const categoria = categoriaSelecionada ? CATEGORIAS[categoriaSelecionada] : null
  const subcategorias = categoria?.subcategorias ?? []

  // Prefetch das imagens de categorias quando no step 1 (mobile optimization)
  const categoriaImageUrls = useMemo(() =>
    CATEGORIAS_ORDEM.map(id => CATEGORIAS[id].image),
    []
  )
  useImagePrefetch(categoriaImageUrls, {
    enabled: step === 1,
    delay: 500,
    stagger: 100
  })

  const umaSubcategoriaComUmaOpcao = subcategorias.length === 1 && subcategorias[0].materiasPrimas.length === 1
  const categoriaPorMateriaPrima = useMemo(() => {
    const map = {}
    for (const [catId, cat] of Object.entries(CATEGORIAS)) {
      for (const sub of cat.subcategorias) {
        for (const mp of sub.materiasPrimas) {
          if (MATERIA_PRIMA_DATA[mp]) map[mp] = catId
        }
      }
    }
    return map
  }, [])

  const atendeMinimoBiometano = resultadosVisiveis && resultados.biogas >= BIOGAS_MINIMO_BIOMETANO

  const handleSelecionarCategoria = useCallback((id) => {
    setCategoriaSelecionada(id)
    setSubcategoriaSelecionada(null)
    const cat = CATEGORIAS[id]
    if (cat.subcategorias.length === 1 && cat.subcategorias[0].materiasPrimas.length === 1) {
      setSubcategoriaSelecionada(cat.subcategorias[0])
      setMateriaPrima(cat.subcategorias[0].materiasPrimas[0])
      setStep(2)
    } else {
      setMateriaPrima('')
      setStep(1.5)
    }
  }, [])

  const handleSelecionarSubcategoria = useCallback((sub) => {
    setSubcategoriaSelecionada(sub)
    setMateriaPrima(sub.materiasPrimas[0])
    setStep(2)
  }, [])

  const handleAdicionarItem = useCallback((q) => {
    if (!materiaPrima || q == null || q <= 0) return
    if (!Number.isFinite(q) || q <= 0) return
    const novoItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      materiaPrima,
      quantidade: q,
      categoria: categoriaPorMateriaPrima[materiaPrima] || categoriaSelecionada,
      subcategoria: subcategoriaSelecionada,
      unidade: MATERIA_PRIMA_DATA[materiaPrima]?.unidade
    }
    setItens((prev) => {
      const next = [...prev, novoItem]
      itensRef.current = next
      return next
    })
    setMateriaPrima('')
    setMostrarSeletorMateriaPrima(false)
  }, [materiaPrima, categoriaPorMateriaPrima, categoriaSelecionada, subcategoriaSelecionada])

  const handleRemoverItem = useCallback((id) => {
    setItens((prev) => {
      const next = prev.filter((i) => i.id !== id)
      itensRef.current = next
      return next
    })
  }, [])

  /** Reset completo */
  const resetSimulacao = useCallback(() => {
    setStep(1)
    setCategoriaSelecionada(null)
    setSubcategoriaSelecionada(null)
    setMateriaPrima('')
    itensRef.current = []
    setItens([])
    setMostrarSeletorMateriaPrima(false)
    setResultados({
      biogas: 0,
      energia: 0,
      lenha: 0,
      cc: 0,
      biometano: 0,
      glp: 0,
      gn: 0
    })
    setParametrosCenario({ ...PARAMETROS_CENARIO_PADRAO })
    setResultadosVisiveis(false)
    try {
      if (window.history.replaceState && window.location.search) {
        window.history.replaceState({}, '', window.location.pathname || '/')
      }
    } catch {}
    requestAnimationFrame(() => {
      document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  /** Nova simulação (reseta apenas a simulação) */
  const handleNovaSimulacao = useCallback(() => {
    setStep(1)
    setCategoriaSelecionada(null)
    setSubcategoriaSelecionada(null)
    setMateriaPrima('')
    itensRef.current = []
    setItens([])
    setMostrarSeletorMateriaPrima(false)
    setResultados({
      biogas: 0,
      energia: 0,
      lenha: 0,
      cc: 0,
      biometano: 0,
      glp: 0,
      gn: 0
    })
    setParametrosCenario({ ...PARAMETROS_CENARIO_PADRAO })
    setResultadosVisiveis(false)
    requestAnimationFrame(() => {
      document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const handleVerViabilidade = useCallback((quantidadeStr) => {
    const qPendente = quantidadeStr != null && quantidadeStr !== '' ? parseFloat(quantidadeStr) : NaN
    const temItemPreenchido =
      Boolean(materiaPrima) && Number.isFinite(qPendente) && qPendente > 0

    let listaParaCalculo = itensRef.current
    if (temItemPreenchido) {
      const novoItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        materiaPrima,
        quantidade: qPendente,
        categoria: categoriaPorMateriaPrima[materiaPrima] || categoriaSelecionada,
        subcategoria: subcategoriaSelecionada,
        unidade: MATERIA_PRIMA_DATA[materiaPrima]?.unidade
      }
      listaParaCalculo = [...itensRef.current, novoItem]
      itensRef.current = listaParaCalculo
      setItens(listaParaCalculo)
      setMateriaPrima('')
      setMostrarSeletorMateriaPrima(false)
    }

    handleCalcular(listaParaCalculo)
    setStep(3)
  }, [materiaPrima, categoriaPorMateriaPrima, categoriaSelecionada, subcategoriaSelecionada, handleCalcular])

  const onVoltarStep2 = useCallback(() => {
    setMostrarSeletorMateriaPrima(false)
    if (umaSubcategoriaComUmaOpcao) {
      resetSimulacao()
    } else {
      setSubcategoriaSelecionada(null)
      setMateriaPrima('')
      itensRef.current = []
      setItens([])
      setStep(1.5)
    }
  }, [umaSubcategoriaComUmaOpcao, resetSimulacao])

  const onTrocarMateriaPrima = useCallback(() => {
    setMateriaPrima('')
    if (umaSubcategoriaComUmaOpcao) {
      setCategoriaSelecionada(null)
      setStep(1)
    } else {
      setSubcategoriaSelecionada(null)
      setStep(1.5)
    }
  }, [umaSubcategoriaComUmaOpcao])

  const onCancelarSeletor = useCallback(() => setMostrarSeletorMateriaPrima(false), [])
  const onSelecionarMateriaPrima = useCallback((key) => {
    setMateriaPrima(key)
    setMostrarSeletorMateriaPrima(false)
  }, [])
  const onAbrirSeletor = useCallback(() => setMostrarSeletorMateriaPrima(true), [])

  const stepContent = useMemo(() => {
    if (step === 1) {
      return (
        <div className="card card-step fade-in">
          <p className="step-message">Qual é o seu segmento? Selecione abaixo para direcionar os parâmetros técnicos.</p>
          <p className="step-indicator">Passo 1 de 3 — O que você produz?</p>
          <div className="categorias-grid">
            {CATEGORIAS_ORDEM.map((id, index) => {
              const c = CATEGORIAS[id]
              const isPriority = index < 3
              return (
                <button
                  key={c.id}
                  type="button"
                  className="categoria-card"
                  onClick={() => handleSelecionarCategoria(c.id)}
                >
                  <OptimizedImage
                    src={c.image}
                    alt={c.nome}
                    className="categoria-img"
                    width={c.width}
                    height={c.height}
                    fetchpriority={isPriority ? 'high' : 'low'}
                  />
                  <span className="categoria-nome">{c.nome}</span>
                  <span className="categoria-desc">{c.descricao}</span>
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    if (step === 1.5 && categoria) {
      return (
        <div className="card card-step fade-in">
          <p className="step-message">Refine o tipo de criação ou fluxo para alinhar a matéria-prima.</p>
          <p className="step-indicator">Passo 1 de 3 — Escolha a subcategoria</p>
          <button type="button" className="btn btn-secondary btn-back" onClick={() => { setCategoriaSelecionada(null); setStep(1); setMateriaPrima('') }}>
            ← Voltar
          </button>
          <h2 className="card-title" style={{ marginTop: 12 }}>{categoria.nome}</h2>
          <div className="subcategorias-grid">
            {categoria.subcategorias.map((sub) => (
              <button
                key={sub.id}
                type="button"
                className="subcategoria-card"
                onClick={() => handleSelecionarSubcategoria(sub)}
              >
                <span className="subcategoria-label">{sub.label}</span>
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (step === 2) {
      return (
        <SimuladorStep2
          materiaPrima={materiaPrima}
          mostrarSeletorMateriaPrima={mostrarSeletorMateriaPrima}
          itens={itens}
          onVoltar={onVoltarStep2}
          onTrocarMateriaPrima={onTrocarMateriaPrima}
          onCancelarSeletor={onCancelarSeletor}
          onSelecionarMateriaPrima={onSelecionarMateriaPrima}
          onAbrirSeletor={onAbrirSeletor}
          onAdicionarItem={handleAdicionarItem}
          onVerViabilidade={handleVerViabilidade}
          onRemoverItem={handleRemoverItem}
          parametrosCenario={parametrosCenario}
          onParametrosChange={setParametrosCenario}
          localizacao={localizacao}
          onLocalizacaoChange={handleLocalizacaoChange}
          parametrosPreAprovacao={parametrosPreAprovacao}
          onParametrosPreAprovacaoChange={setParametrosPreAprovacao}
        />
      )
    }

    return null
  }, [
    step,
    categoria,
    materiaPrima,
    mostrarSeletorMateriaPrima,
    itens,
    handleSelecionarCategoria,
    handleSelecionarSubcategoria,
    onVoltarStep2,
    onTrocarMateriaPrima,
    onCancelarSeletor,
    onSelecionarMateriaPrima,
    onAbrirSeletor,
    handleAdicionarItem,
    handleVerViabilidade,
    handleRemoverItem,
    parametrosCenario,
    localizacao,
    handleLocalizacaoChange,
    parametrosPreAprovacao
  ])

  const energiaMensal = useMemo(() => calcularEnergiaMensal(resultados.energia), [resultados.energia])
  const energiaMensalExtremos = useMemo(() => calcularEnergiaMensalExtremos(resultados.biogas), [resultados.biogas])
  const faturamento = useMemo(() => calcularFaturamentoMensal(energiaMensal), [energiaMensal])
  const reducaoEmissoes = useMemo(() => calcularReducaoEmissoesAnual(resultados.biogas), [resultados.biogas])
  const biofertilizante = useMemo(() => calcularBiofertilizanteAnual(resultados.biogas), [resultados.biogas])

  const demandaEnergiaKwhMes = numeroParametro(parametrosCenario.demanda_energia_kwh_mes)
  const demandaGlpKgMes = numeroParametro(parametrosCenario.demanda_glp_kg_mes)
  const precoGlpRsKg = numeroParametro(parametrosCenario.glp_preco_rs_kg, PRECO_GLP_RS_KG_MEDIO)
  const tarifaEnergia = numeroParametro(parametrosCenario.energy_price, FATURAMENTO_RS_POR_KWH_MES)

  const indicadoresDemanda = useMemo(() => {
    const energia = calcularEconomiaEnergia({
      energiaKwhMes: energiaMensal,
      demandaKwhMes: demandaEnergiaKwhMes,
      tarifaRsKwh: tarifaEnergia
    })
    const glp = calcularEconomiaGLP({
      glpKgDia: resultados.glp,
      demandaKgMes: demandaGlpKgMes,
      precoRsKg: precoGlpRsKg
    })
    const quantidadeAtual = itens.reduce((soma, item) => soma + numeroParametro(item.quantidade), 0)
    return {
      energia,
      glp,
      escalaEnergia: sugerirEscalaParaDemanda({
        producao: energiaMensal,
        demanda: demandaEnergiaKwhMes,
        quantidadeAtual
      }),
      escalaGlp: sugerirEscalaParaDemanda({
        producao: glp.glpKgMes,
        demanda: demandaGlpKgMes,
        quantidadeAtual
      }),
      escalaComercializacaoEnergia: sugerirEscalaParaComercializacao({
        producao: energiaMensal,
        demanda: demandaEnergiaKwhMes,
        quantidadeAtual
      }),
      escalaComercializacaoGlp: sugerirEscalaParaComercializacao({
        producao: glp.glpKgMes,
        demanda: demandaGlpKgMes,
        quantidadeAtual
      })
    }
  }, [
    energiaMensal,
    demandaEnergiaKwhMes,
    tarifaEnergia,
    resultados.glp,
    demandaGlpKgMes,
    precoGlpRsKg,
    itens
  ])

  // Pré-aprovação: recalculada quando mudam resíduos, localização ou parâmetros comerciais
  const productionMode = useMemo(() => calcularModoProducao(itens), [calcularModoProducao, itens])
  const preAprovacao = useMemo(
    () =>
      resultadosVisiveis
        ? calcularPreAprovacao({
            itens,
            uf: localizacao.uf,
            concessionariaId: localizacao.concessionariaId,
            parametros: {
              ...parametrosPreAprovacao,
              // Se o usuário editou a tarifa do cenário, ela prevalece sobre a concessionária
              tarifaRsKwh:
                parametrosCenario.energy_price !== PARAMETROS_CENARIO_PADRAO.energy_price
                  ? Number(parametrosCenario.energy_price)
                  : parametrosPreAprovacao.tarifaRsKwh
            },
            modo: productionMode
          })
        : null,
    [resultadosVisiveis, itens, localizacao, parametrosPreAprovacao, parametrosCenario.energy_price, productionMode]
  )

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="/" className="navbar-logo">
            <img src={`${BASE}logo_4watt_512.png`} alt="4WaTT Bio Engenharia" />
          </a>
          <div className="navbar-links">
            <a className="navbar-login" href="/contato.html">Fale conosco</a>
            <a className="navbar-cta" href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              Falar com engenheiro
            </a>
          </div>
        </div>
      </nav>

      <HeroInstitucional />

      <div className="trust-bar">
        <div className="trust-bar-inner">
          <div className="trust-item">
            <span className="trust-number">47</span>
            <span className="trust-label">Usinas projetadas</span>
          </div>
          <div className="trust-item">
            <span className="trust-number">12,4 MW</span>
            <span className="trust-label">Em operação</span>
          </div>
          <div className="trust-item">
            <span className="trust-number">+R$ 89Mi</span>
            <span className="trust-label">Em energia comercializada</span>
          </div>
          <div className="trust-item">
            <span className="trust-number">{ACESSOS_CALCULADORA_EXIBIDOS.toLocaleString('pt-BR')}</span>
            <span className="trust-label">Acessos à calculadora</span>
          </div>
        </div>
      </div>

      {/* Simulador */}
      <section id="simulador" className="simulador-section">
        <div className="container">
          <div className="simulador-header">
            <h2>Simule sua viabilidade</h2>
            <p>Responda em 3 passos rápidos e descubra o potencial do seu projeto.</p>
            <div className="simulador-header-acoes">
              <span className="social-proof">
                <span className="social-proof-dot" />
                {ACESSOS_CALCULADORA_EXIBIDOS.toLocaleString('pt-BR')} acessos à calculadora
              </span>
            </div>
          </div>

          {step >= 1 && step <= 2 && stepContent}
          {step === 3 && (
            <ResultadosStep
              resultados={resultados}
              energiaMensalExtremos={energiaMensalExtremos}
              faturamento={faturamento}
              reducaoEmissoes={reducaoEmissoes}
              biofertilizante={biofertilizante}
              atendeMinimoBiometano={atendeMinimoBiometano}
              indicadoresDemanda={indicadoresDemanda}
              onReset={resetSimulacao}
              onNovaSimulacao={handleNovaSimulacao}
              whatsappLink={WHATSAPP_LINK}
              preAprovacao={preAprovacao}
            />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>
            © 2026 4WaTT Bio Engenharia S.A. — Simulador de Viabilidade de Biogás.
            <br />
            Resultados indicativos. Projeto executivo e memorial de cálculo sob consultoria técnica.
            <br />
            <a href={`${BASE}termos-de-uso.html`} target="_blank">Termos de Uso e Política de Privacidade</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
