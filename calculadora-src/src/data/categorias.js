/**
 * Categorias e subcategorias para o fluxo "3 cliques".
 * Cada categoria pode ter subcategorias (label amigável + chaves em MATERIA_PRIMA_DATA).
 * Se subcategorias tiver só um item ou categoria for "única", pode ir direto ao step 2.
 *
 * NOTA: as imagens vivem em public/images/categorias/{nome}.jpg e são servidas
 * sob o base do Vite ('/calculadora/') — por isso o prefixo import.meta.env.BASE_URL.
 */

const BASE = import.meta.env.BASE_URL

export const CATEGORIAS = {
  bovinos: {
    id: 'bovinos',
    nome: 'Bovinos',
    image: `${BASE}images/categorias/bovinos.jpg`,
    width: 72,
    height: 72,
    descricao: 'Otimização de dejetos (Leite/Corte) para autossuficiência elétrica e produção de biofertilizantes estabilizados.',
    subcategorias: [
      {
        id: 'leite',
        label: 'Leite',
        materiasPrimas: ['BOVINO DE LEITE FREE STALL', 'BOVINO DE LEITE COMPOST BARN']
      },
      {
        id: 'confinado',
        label: 'Confinado',
        materiasPrimas: ['BOVINOS DE CORTE', 'BOVINOS EM CONFINAMENTO']
      }
    ]
  },
  suinos: {
    id: 'suinos',
    nome: 'Suínos',
    image: `${BASE}images/categorias/suinos.jpg`,
    width: 72,
    height: 72,
    descricao: 'Alta carga orgânica convertida em biogás de alto desempenho, eliminando passivos ambientais e gerando receita.',
    subcategorias: [
      { id: 'terminacao', label: 'Terminação', materiasPrimas: ['UT (Terminação Suínos)'] },
      { id: 'leitao', label: 'Leitão', materiasPrimas: ['UPL (Unidade Produção Leitão)', 'UC (Crechário Suínos)', 'UPD (Unidade Desmamados)'] },
      { id: 'matriz', label: 'Matriz', materiasPrimas: ['SUINO MATRIZ'] },
      { id: 'ciclo-completo', label: 'Ciclo completo', materiasPrimas: ['C.C. (Suino Ciclo Completo)'] }
    ]
  },
  frigorificos: {
    id: 'frigorificos',
    nome: 'Frigoríficos',
    image: `${BASE}images/categorias/frigorificos.jpg`,
    width: 72,
    height: 72,
    descricao: 'Tratamento eficiente de resíduos de abate com foco em geração térmica e redução drástica da carga poluidora.',
    subcategorias: [
      { id: 'frigorifico-bovinos', label: 'Frigorífico de bovinos', materiasPrimas: ['FRIGORIFICO DE BOVINOS'] }
    ]
  },
  cana: {
    id: 'cana',
    nome: 'Cana',
    image: `${BASE}images/categorias/cana.jpg`,
    width: 72,
    height: 72,
    descricao: 'Maximização do faturamento da planta sucroenergética através do biometano da vinhaça e torta de filtro.',
    subcategorias: [
      { id: 'vinhaca-cana', label: 'Vinhaça Cana', materiasPrimas: ['VINHAÇA CANA (m3)'] },
      { id: 'vinhaca-milho', label: 'Vinhaça Milho', materiasPrimas: ['VINHAÇA MILHO (m3)'] },
      { id: 'fecularia', label: 'Fecularia', materiasPrimas: ['FECULARIA (tonelada)'] }
    ]
  },
  ete: {
    id: 'ete',
    nome: 'ETE',
    image: `${BASE}images/categorias/ete.jpg`,
    width: 72,
    height: 72,
    descricao: 'Saneamento inteligente: transformação de lodo e resíduos urbanos em biometano para frotas ou injeção na rede.',
    subcategorias: [
      { id: 'rso', label: 'RSO (Resíduo Sólido Orgânico)', materiasPrimas: ['RSO (Resíduo Sólido Organico/tonelada)'] },
      { id: 'rsu', label: 'RSU (Resíduo Sólido Urbano)', materiasPrimas: ['RSU (Resíduo Sólido Urbano/tonelada)'] }
    ]
  },
  aves: {
    id: 'aves',
    nome: 'Aves',
    image: `${BASE}images/categorias/aves.jpg`,
    width: 72,
    height: 72,
    descricao: 'Conversão de cama de frango em energia limpa, resolvendo gargalos sanitários e logísticos da produção.',
    subcategorias: [
      { id: 'poedeira', label: 'Poedeira', materiasPrimas: ['AVE POEDEIRA'] },
      { id: 'corte', label: 'Corte', materiasPrimas: ['AVE DE CORTE'] }
    ]
  }
}

/** Ordem das categorias na tela (step 1) */
export const CATEGORIAS_ORDEM = ['bovinos', 'suinos', 'frigorificos', 'cana', 'ete', 'aves']
