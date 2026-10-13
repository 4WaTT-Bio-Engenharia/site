// Dados de referência: produção de biogás (m³/dia) por unidade de matéria prima
// Valores baseados em referências técnicas do setor
//
// AVES — constante derivada de forma rastreável (A VALIDAR com fonte oficial 4WaTT):
//   biogás (m³/dia/ave) = dejeto_fresco(kg/ave/dia) × ST × SV(%doST) × rendimento(m³ biogás/kg SV)
//   AVE DE CORTE:  0,12 × 0,25 × 0,80 × 0,35 ≈ 0,0084 m³/dia/ave
//   AVE POEDEIRA:  0,18 × 0,25 × 0,80 × 0,35 ≈ 0,0126 m³/dia/ave
//   (O valor anterior de 0,098760 para corte implicava 1,41 kg de dejeto/ave/dia —
//    fisicamente impossível — e ficava ~12× superestimado.)
//
//   Histórico: entre essa correção e 2026-09-08 os dois valores ficaram em 0,0014,
//   porque `npm run sync-yields` mapeava AS DUAS aves para a mesma entrada
//   `pecuaria.aves` do EVTE — cada sync apagava a distinção corte/poedeira e
//   sobrescrevia com o valor único do motor. 0,0014 implica 20 g de dejeto por
//   ave/dia (a literatura indica 100–150 g), ~6× subestimado.
//   O catálogo do EVTE passou a ter `aves_corte` e `aves_poedeira` separadas
//   (scripts/patch-feedstock-yields.py) e o sync aponta para elas, então os valores
//   acima voltaram a ser os derivados — e agora sobrevivem ao próximo sync.
//   Ver docs/AUDITORIA-FASE-0.md, achado A-2.
export const MATERIA_PRIMA_DATA = {
  "AVE POEDEIRA": { biogas_m3: 0.0126, unidade: "animal" },
  "AVE DE CORTE": { biogas_m3: 0.0084, unidade: "animal" },
  "BOVINOS DE CORTE": { biogas_m3: 0.3, unidade: "animal" },
  "BOVINOS EM CONFINAMENTO": { biogas_m3: 0.9, unidade: "animal" },
  "BOVINO DE LEITE FREE STALL": { biogas_m3: 0.3, unidade: "animal" },
  "BOVINO DE LEITE COMPOST BARN": { biogas_m3: 0.3, unidade: "animal" },
  "C.C. (Suino Ciclo Completo)": { biogas_m3: 0.115, unidade: "animal" },
  "FECULARIA (tonelada)": { biogas_m3: 74, unidade: "tonelada" },
  "FRIGORIFICO DE BOVINOS": { biogas_m3: 0.3, unidade: "animal" },
  "UT (Terminação Suínos)": { biogas_m3: 0.115, unidade: "animal" },
  "UPL (Unidade Produção Leitão)": { biogas_m3: 0.115, unidade: "animal" },
  "UC (Crechário Suínos)": { biogas_m3: 0.115, unidade: "animal" },
  "UPD (Unidade Desmamados)": { biogas_m3: 0.115, unidade: "animal" },
  "SUINO MATRIZ": { biogas_m3: 0.115, unidade: "animal" },
  "RSO (Resíduo Sólido Organico/tonelada)": { biogas_m3: 127, unidade: "tonelada" },
  "RSU (Resíduo Sólido Urbano/tonelada)": { biogas_m3: 100, unidade: "tonelada" },
  "VINHAÇA MILHO (m3)": { biogas_m3: 15, unidade: "m3" },
  "VINHAÇA CANA (m3)": { biogas_m3: 11, unidade: "m3" },
}

// Constantes de conversão
export const PODER_CALORIFICO_BIOGAS = 5.5 // kWh/m³
export const PODER_CALORIFICO_LENHA = 2500 // kcal/kg
export const EQUIVALENCIA_LENHA = 0.47 // kg de lenha por m³ de biogás
export const CC_FATOR = 0.45 // Fator de conversão para crédito de carbono (tCO2eq/m³ biogás)

// Biometano: pureza de metano no biogás 55–65% (média 60%); perdas no processo 5%
export const BIOMETANO_PUREZA_MIN = 0.55
export const BIOMETANO_PUREZA_MAX = 0.65
export const BIOMETANO_PUREZA_MEDIA = 0.60 // média para cálculo
export const BIOMETANO_FATOR_PERDAS = 0.95 // 1 - 5% perdas no processo
// Produção mínima para viabilidade do cenário biometano (m³/dia)
export const BIOGAS_MINIMO_BIOMETANO = 3500

// Produção mínima (m³/dia) para exibir o bloco "Resultados detalhados" após a captura do lead
export const BIOGAS_MINIMO_RESULTADOS_DETALHADOS = 5000

// Projetos de biometano custam 50% mais que projetos de energia (usado na recomendação)
export const FATOR_CUSTO_BIOMETANO_VS_ENERGIA = 1.5

// Percentual efetivo para cálculo: pureza média × (1 - perdas 5%) = 0,57
export const BIOMETANO_PERCENTUAL_MEDIO = BIOMETANO_PUREZA_MEDIA * BIOMETANO_FATOR_PERDAS

// Equivalências energéticas
export const GLP_PARA_GN = 1.25 // 1 kg GLP = 1,25 m³ GN
export const BIOMETANO_PARA_GN = 1.0 // 1 m³ biometano ≈ 1 m³ GN

/** Rendimento elétrico: kWh gerados por m³ de biogás (faixa 1,1–1,5; média 1,2) */
export const KWH_POR_M3_BIOGAS_MIN = 1.1
export const KWH_POR_M3_BIOGAS_MEDIO = 1.2
export const KWH_POR_M3_BIOGAS_MAX = 1.5

/** Dias no mês para projeção kWh/mês a partir do kWh/dia */
export const DIAS_MES_ENERGIA_KWH = 30

/** Faturamento estimado (R$/mês) = energia (kWh/mês) × este valor */
export const FATURAMENTO_RS_POR_KWH_MES = 0.52

// Gerador a gás (referência legada; energia do simulador usa KWH_POR_M3_BIOGAS_*)
export const GERADOR_CONSUMO_BIOGAS_M3_H = 47 // m³/h
export const GERADOR_KWH_MIN = 77 // kWh/h
export const GERADOR_KWH_MAX = 96 // kWh/h
export const GERADOR_KWH_MEDIO = (77 + 96) / 2 // 86,5 kWh/h (média)

// Período de funcionamento do gerador: 21 dias/mês
export const DIAS_FUNCIONAMENTO_GERADOR_MES = 21

// Projeto apto para biometano: faturamento = biometano (m³/mês) × 2,15
export const DIAS_POR_MES_BIOMETANO = 30 // produção diária × 30 = mês
export const PRECO_BIOMETANO_RS_M3 = 2.15 // R$/m³ (faturamento mensal)

/** Preço médio de referência do GLP (R$/kg). O cliente pode ajustar ao contrato. */
export const PRECO_GLP_RS_KG_MEDIO = 8

/** Desvio típico do orçamento estimado em torno do CAPEX médio (±15%). */
export const CAPEX_DESVIO_PERCENTUAL = 0.15
