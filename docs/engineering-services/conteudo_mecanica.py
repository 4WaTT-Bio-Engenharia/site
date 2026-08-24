# -*- coding: utf-8 -*-
"""
Conteúdo das landing pages de serviço da vertical Engenharia Mecânica.

Consumido por `gerar-paginas-servico.py`. Cada dicionário vira uma página.

REGRA DE HONESTIDADE (ver MASTER_SPEC.md): nomes de norma pública e estável podem ser
citados (NR-12, NR-13, NR-35, NR-10, NBR 8800, NBR 6122, ASME B31.3, ASME Seção VIII,
AWS D1.1, API 650, ISO 10816). Limite numérico, percentual, prazo de validade, métrica
ou nome de cliente: NUNCA.

ORIGEM DO CONTEÚDO — os 13 serviços são `voz_marca: True`.
Diferente de Elétrica (15 dos 27 vieram de páginas de referência externas fornecidas
pelo usuário), Mecânica não tem nenhuma referência externa validada item a item. Os 13
textos foram redigidos em voz de marca 4WaTT, com autorização explícita do usuário em
2026-08-24. Cada página gerada leva o comentário HTML de rastreabilidade.
"""

# --------------------------------------------------------------------------
# Carrossel de pranchas REAIS da 4WaTT — acervo de Engenharia Mecânica.
#
# São os 6 documentos de engenharia mecânica própria disponíveis hoje, e servem como
# prova de capacidade da vertical inteira: a copy nunca afirma que a prancha É aquele
# serviço específico. Quatro deles são capturas do SolidWorks com a interface visível
# — decisão do usuário (2026-08-24) de usar como estão, sem recorte, porque a árvore de
# montagem à esquerda é parte da evidência de que o modelo é real.
# Só os 6 itens reais aqui; initAutoDuplicateMarquees() clona em runtime.
#
# Legendas conferidas abrindo cada arquivo — ver MASTER_SPEC.md.
# --------------------------------------------------------------------------

PRANCHAS = [
    ("svc-skid-secagem-biogas.png", "Equipamento", "Skid de secagem de biogás",
     "Vaso de secagem, soprador e trocador de calor montados sobre um único skid metálico."),
    ("svc-secador-conjunto.png", "Projeto mecânico", "Secador de biogás — conjunto",
     "Modelo 3D com vaso, compressor, condensador ventilado, soprador radial e tubulação."),
    ("svc-flare-isometrica.png", "Caldeiraria", "Flare enclausurado — isométrica",
     "Torre sobre base de concreto, com selo hídrico, gas seal, válvula borboleta e caixa de controle de chama."),
    ("svc-flare-lateral.png", "Detalhamento", "Flare — vista lateral",
     "Vista ortográfica da mesma montagem, para conferência de alturas e interfaces de tubulação."),
    ("svc-biodigestores-pretanque.png", "Montagem geral", "Biodigestores e pré-tanque",
     "Montagem geral com tubulações, sensores, válvulas, bombas helicoidais e flare."),
    ("svc-esteira-rsu.png", "Transporte", "Esteira de triagem de RSU",
     "Transportador de correia com estrutura metálica, moega de carga e acionamento por motorredutor."),
]

# O `alt` descreve o que a peça É de fato, nunca o serviço da página em que aparece.
# Regra nº 9 do briefing: são documentos reais e não podem ser rotulados errado.
ALT_PRANCHA = {
    "svc-skid-secagem-biogas.png": "Render do skid de secagem de biogás projetado pela engenharia 4WaTT, com vaso vertical, soprador e trocador de calor",
    "svc-secador-conjunto.png": "Modelo 3D do conjunto secador de biogás da engenharia 4WaTT, com compressor, condensador ventilado e soprador radial",
    "svc-flare-isometrica.png": "Modelo 3D em vista isométrica do flare enclausurado projetado pela engenharia 4WaTT",
    "svc-flare-lateral.png": "Vista lateral do modelo 3D do flare enclausurado projetado pela engenharia 4WaTT",
    "svc-biodigestores-pretanque.png": "Modelo 3D da montagem geral de biodigestores e pré-tanque projetada pela engenharia 4WaTT",
    "svc-esteira-rsu.png": "Render da esteira transportadora de triagem de RSU projetada pela engenharia 4WaTT",
}

# Imagem da seção "O que é", escolhida por proximidade temática com o serviço.
IMAGEM_SOBRE = {
    # Projeto mecânico
    "projeto-mecanico-industrial": "svc-secador-conjunto.png",
    "projeto-industrial": "svc-biodigestores-pretanque.png",
    "fundacoes-de-maquinas": "svc-flare-isometrica.png",
    # Fabricação
    "caldeiraria-industrial": "svc-flare-isometrica.png",
    "tanques-industriais": "svc-skid-secagem-biogas.png",
    "plataforma-pipe-rack": "svc-biodigestores-pretanque.png",
    "guarda-corpo": "svc-biodigestores-pretanque.png",
    "corte-e-dobra-de-chapas": "svc-secador-conjunto.png",
    # Montagem mecânica
    "montagem-industrial": "svc-skid-secagem-biogas.png",
    "montagem-de-maquinas": "svc-esteira-rsu.png",
    "montagem-eletromecanica": "svc-esteira-rsu.png",
    "tubulacao-industrial": "svc-flare-lateral.png",
    # Manutenção mecânica
    "manutencao-industrial": "svc-skid-secagem-biogas.png",
}

SERVICOS = [

    # ======================================================================
    # GRUPO 1 — PROJETO MECÂNICO
    # ======================================================================

    {
        "slug": "projeto-mecanico-industrial",
        "nome": "Projeto Mecânico Industrial",
        "icone": "fas fa-drafting-compass",
        "voz_marca": True,
        "meta": "Projeto mecânico industrial 4WaTT: equipamento modelado em 3D, detalhado para fabricação e pensado para montar em campo.",
        "hero_lead": "Um equipamento que só existe no papel não se fabrica. O projeto mecânico é o que transforma a ideia em desenho de oficina, lista de material e sequência de montagem.",
        "fatos": [
            ("Modelagem 3D", "O conjunto inteiro montado virtualmente antes de virar aço"),
            ("Detalhamento fabricável", "Desenho que a caldeiraria consegue executar sem interpretar"),
            ("Engenharia própria", "O mesmo time que projeta também monta e opera"),
        ],
        "oque_titulo": "O que é o projeto mecânico industrial",
        "oque_p1": "Projeto mecânico é a etapa em que um equipamento deixa de ser conceito e passa a ser fabricável. Envolve definir geometria, material, espessura, tipo de junta, interface com tubulação e com estrutura, e representar tudo isso em desenhos que uma oficina consegue executar sem precisar adivinhar. É um trabalho de decisão: cada escolha de material ou de arranjo fecha uma porta e abre outra, e todas elas aparecem no custo de fabricação, no prazo de montagem e na facilidade de manutenção anos depois.",
        "oque_p2": "Na 4WaTT esse projeto nasce em modelo 3D, com o conjunto inteiro montado virtualmente antes de qualquer chapa ser cortada. Isso permite verificar interferência entre componentes, checar acesso para manutenção e conferir se o equipamento passa pela porta do galpão — três problemas que, descobertos em campo, custam retrabalho. Do modelo saem os desenhos de fabricação, a lista de material e a sequência de montagem, que é o pacote que a oficina e a equipe de campo realmente usam.",
        "custo_kicker": "O que está em jogo",
        "custo_titulo": "O que acontece quando o projeto é raso",
        "custo_lead": "Projeto mecânico incompleto não aparece no orçamento: aparece na oficina, na obra e no primeiro mês de operação.",
        "custo_cards": [
            ("fas fa-screwdriver-wrench", "Retrabalho na fabricação", "Desenho ambíguo obriga a oficina a interpretar. Quando a interpretação diverge da intenção, a peça volta para o corte — e o cronograma volta junto."),
            ("fas fa-arrows-left-right-to-line", "Interferência descoberta em campo", "Duas peças que ocupam o mesmo espaço são um problema barato no modelo 3D e caro no pátio, com o guindaste já contratado."),
            ("fas fa-ban", "Equipamento que não se mantém", "Sem prever acesso para troca de vedação, rolamento ou instrumento, cada manutenção de rotina vira desmontagem parcial."),
        ],
        "tab_kicker": "O que é entregue",
        "tab_titulo": "O que compõe o pacote de projeto",
        "tab_lead": "Cada documento tem um destinatário claro — comprador, oficina ou equipe de montagem. Nada é desenho para arquivar.",
        "tab_th": ("Documento", "Para que serve na prática"),
        "tab_rows": [
            ("Modelo 3D do conjunto", "Base de tudo: permite verificar interferência, acesso de manutenção e envelope de transporte antes da fabricação."),
            ("Desenhos de fabricação", "Vistas, cortes e detalhes por peça, com tolerância e acabamento — o que a oficina usa na bancada."),
            ("Lista de material", "Chapa, perfil, tubo, flange, parafuso e componente comprado, quantificados para cotação e compra."),
            ("Detalhes de solda", "Tipo de junta, preparação de borda e sequência, para que a soldagem não deforme o conjunto."),
            ("Interfaces com tubulação e estrutura", "Posição e orientação de bocais, apoios e chumbadores — o que evita ajuste improvisado em campo."),
            ("Memorial descritivo", "Premissas, materiais adotados e critérios de dimensionamento, por escrito e defensáveis."),
        ],
        "como_titulo": "Como conduzimos o projeto",
        "steps": [
            ("fa-solid fa-comments", "Definição de requisitos", "Entendemos o que o equipamento precisa fazer, em que condição de operação, com que fluido, em que espaço disponível e com que restrição de transporte e montagem."),
            ("fa-solid fa-cube", "Modelagem 3D", "O conjunto é montado virtualmente peça por peça. É aqui que interferência, acesso e envelope são resolvidos, enquanto a correção ainda é só um clique."),
            ("fa-solid fa-ruler-combined", "Detalhamento para fabricação", "O modelo vira desenhos de oficina com tolerância, acabamento e detalhes de solda, mais a lista de material pronta para cotação."),
            ("fa-solid fa-clipboard-check", "Revisão e entrega", "Revisamos o pacote com quem vai fabricar e com quem vai montar, para que o desenho reflita a realidade da oficina e do campo."),
        ],
        "carrossel_lead": "Modelos e montagens reais da engenharia mecânica 4WaTT. É o mesmo nível de detalhamento que entregamos em cada projeto mecânico industrial.",
        "quando_kicker": "Quando contratar",
        "quando_titulo": "Sinais de que você precisa de projeto mecânico",
        "quando_itens": [
            ("Equipamento sob medida.", "Quando não existe modelo de catálogo que atenda, o projeto próprio é o caminho — e ele começa antes da cotação, não depois."),
            ("Adaptação de equipamento existente.", "Mudança de capacidade, de fluido ou de layout exige reverificação mecânica, não só uma adaptação improvisada em campo."),
            ("Fabricação por terceiros.", "Se a oficina é externa, o desenho é o contrato técnico. Ambiguidade ali vira divergência comercial depois."),
            ("Histórico de retrabalho.", "Se a última montagem exigiu ajuste, corte ou reposicionamento em campo, o problema estava no projeto, não na equipe."),
            ("Exigência de rastreabilidade.", "Auditoria, seguro e financiamento pedem memorial e desenho as-built — que só existem se o projeto foi formalizado."),
        ],
        "recebe_titulo": "O que chega até você no fim",
        "recebe_cards": [
            ("fas fa-cube", "Modelo 3D navegável", "O conjunto completo, para consulta, verificação de acesso e base de qualquer modificação futura."),
            ("fas fa-file-lines", "Pacote de fabricação", "Desenhos por peça, lista de material e detalhes de solda — pronto para ir à oficina ou à cotação."),
            ("fas fa-diagram-project", "Sequência de montagem", "A ordem em que o conjunto deve ser montado em campo, com as interfaces já resolvidas no papel."),
        ],
        "ref_kicker": "Referências técnicas",
        "ref_titulo": "Em que o projeto se apoia",
        "ref_lead": "O projeto dialoga com as normas que regem segurança de máquinas, estruturas metálicas e equipamentos sob pressão no Brasil.",
        "ref_cards": [
            ("fas fa-shield-halved", "NR-12", "Norma regulamentadora de segurança no trabalho em máquinas e equipamentos — define o que precisa ser previsto já no projeto, não depois."),
            ("fas fa-building", "NBR 8800", "Norma de projeto de estruturas de aço e estruturas mistas — referência para o dimensionamento de bases, suportes e skids."),
            ("fas fa-gauge-high", "ASME Seção VIII", "Código de referência para vasos de pressão, aplicável quando o equipamento opera acima da pressão atmosférica."),
        ],
        "porque_titulo": "Por que projetar com a 4WaTT",
        "porque_checks": [
            ("Projeto de quem também monta.", "O mesmo time que desenha o equipamento acompanha a fabricação e a montagem — o desenho já nasce pensando em quem vai executar."),
            ("Modelagem 3D como padrão, não como extra.", "Interferência, acesso de manutenção e envelope de transporte são verificados no modelo, antes de virar aço."),
            ("Continuidade multidisciplinar.", "Se o equipamento exige base de concreto, painel elétrico ou automação, a mesma engenharia resolve a etapa seguinte."),
            ("Experiência em planta de biogás e biometano.", "Equipamento de processo com gás, umidade e sólido tem particularidades que projeto genérico costuma ignorar."),
        ],
        "porque_cta": "Solicitar orçamento de projeto",
        "faq_titulo": "Dúvidas sobre projeto mecânico industrial",
        "faq": [
            ("O que exatamente entra num projeto mecânico?", "Modelo 3D do conjunto, desenhos de fabricação por peça, lista de material, detalhes de solda, interfaces com tubulação e estrutura, e memorial descritivo com as premissas adotadas."),
            ("Preciso ter o equipamento já definido para contratar?", "Não. Boa parte dos projetos começa com um requisito de processo — o que precisa acontecer, com que fluido e em que espaço — e a definição do equipamento é justamente o primeiro passo do trabalho."),
            ("Vocês fabricam o que projetam?", "Sim. A 4WaTT tem as frentes de fabricação e montagem mecânica na mesma vertical, então o projeto pode seguir direto para execução sem passar por tradução entre empresas."),
            ("E se eu quiser fabricar com outro fornecedor?", "Sem problema. O pacote de fabricação é feito para ser executável por qualquer oficina qualificada — é essa a função do detalhamento e da lista de material."),
            ("O projeto contempla a estrutura de apoio?", "Contempla as interfaces: posição de chumbadores, cargas transmitidas e requisitos de apoio. A base de concreto em si é o serviço de fundações de máquinas, que a mesma engenharia executa."),
            ("Como fica a documentação depois da montagem?", "O modelo e os desenhos são atualizados com o que efetivamente foi executado, para que a documentação as-built reflita o equipamento real e sirva de base para manutenção e futuras modificações."),
        ],
        "cta_titulo": "Tem um equipamento para tirar do papel?",
    },

    {
        "slug": "projeto-industrial",
        "nome": "Projeto Industrial",
        "icone": "fas fa-file-lines",
        "voz_marca": True,
        "meta": "Projeto industrial 4WaTT: arranjo geral, fluxo de processo e implantação de planta pensados como um sistema, não como equipamentos soltos.",
        "hero_lead": "Equipamento bom em arranjo ruim continua sendo planta ruim. O projeto industrial é o que organiza o conjunto: fluxo, espaço, acesso e crescimento futuro.",
        "fatos": [
            ("Visão de conjunto", "A planta inteira, não equipamento a equipamento"),
            ("Fluxo antes do desenho", "O caminho do material define o arranjo, não o contrário"),
            ("Espaço para crescer", "Ampliação prevista no arranjo, não improvisada depois"),
        ],
        "oque_titulo": "O que é o projeto industrial",
        "oque_p1": "Projeto industrial é o desenho da planta como sistema: onde cada equipamento fica, por onde o material entra, circula e sai, como as utilidades chegam até cada ponto, e por onde pessoas e veículos se movem sem cruzar o caminho do processo. É a camada acima do projeto de cada equipamento — e é ela que determina se a operação vai ser fluida ou se vai passar a vida contornando um arranjo que ninguém pensou por inteiro.",
        "oque_p2": "É também a etapa em que decisões baratas evitam custos permanentes. Um metro a mais de corredor, previsto no papel, custa pouco; descoberto depois que a estrutura está montada, pode significar remover equipamento. O mesmo vale para reserva de área de expansão, ponto de utilidade deixado disponível e acesso de guindaste para manutenção pesada. Projeto industrial é, em boa medida, o trabalho de antecipar o que a planta vai precisar quando já estiver rodando.",
        "custo_kicker": "O que está em jogo",
        "custo_titulo": "O que um arranjo mal resolvido cobra depois",
        "custo_lead": "Arranjo é decisão de longo prazo: uma vez que a estrutura sobe, mudar de ideia deixa de ser desenho e passa a ser obra.",
        "custo_cards": [
            ("fas fa-shuffle", "Fluxo que se cruza", "Material entrando pelo mesmo caminho que o produto sai, ou manutenção passando por dentro da área de processo — perda de tempo diária e risco somado."),
            ("fas fa-compress", "Espaço que não existe mais", "Sem reserva de área prevista, a primeira ampliação vira quebra-cabeça: equipamento em local ruim porque era o único lugar que sobrou."),
            ("fas fa-truck-ramp-box", "Manutenção sem acesso", "Equipamento pesado instalado onde o guindaste não chega transforma troca de rotina em operação especial, com parada longa."),
        ],
        "tab_kicker": "O que é definido",
        "tab_titulo": "O que o projeto industrial resolve",
        "tab_lead": "Cada item abaixo é uma decisão que fica cara de reverter depois que a planta está construída.",
        "tab_th": ("Definição", "O que muda na operação"),
        "tab_rows": [
            ("Arranjo geral (layout)", "Posição de cada equipamento e área, com as distâncias e acessos que a operação e a manutenção realmente exigem."),
            ("Fluxo de material", "O caminho da entrada até a saída, sem cruzamentos desnecessários entre insumo, processo, produto e resíduo."),
            ("Fluxo de pessoas e veículos", "Circulação segura, separada do processo onde precisa ser, e dimensionada para o veículo que de fato entra na planta."),
            ("Rede de utilidades", "Por onde passam água, ar comprimido, energia e gás, e onde ficam os pontos de consumo e as reservas para expansão."),
            ("Áreas de apoio", "Oficina, almoxarifado, laboratório e vestiário posicionados em função de quem os usa, não do espaço que sobrou."),
            ("Reserva para ampliação", "Área e utilidades deixadas disponíveis para a próxima fase, definidas antes da primeira e não depois dela."),
        ],
        "como_titulo": "Como conduzimos o projeto",
        "steps": [
            ("fa-solid fa-magnifying-glass-chart", "Leitura do processo", "Antes de desenhar, entendemos o que a planta faz: volumes, etapas, utilidades necessárias e como cada etapa se conecta à seguinte."),
            ("fa-solid fa-map", "Estudo de implantação", "Avaliamos o terreno ou o galpão disponível, com acessos, topografia e restrições, e testamos alternativas de arranjo em vez de assumir a primeira."),
            ("fa-solid fa-object-group", "Arranjo geral detalhado", "O layout escolhido é detalhado com posições, cotas, corredores, áreas de manutenção e rede de utilidades."),
            ("fa-solid fa-layer-group", "Integração com as demais disciplinas", "O arranjo vira base para os projetos mecânico, elétrico, civil e de automação, para que todos partam do mesmo desenho."),
        ],
        "carrossel_lead": "Montagens gerais e equipamentos modelados pela engenharia mecânica 4WaTT. É a mesma disciplina de conjunto que aplicamos no arranjo de uma planta inteira.",
        "quando_kicker": "Quando contratar",
        "quando_titulo": "Sinais de que sua planta precisa deste projeto",
        "quando_itens": [
            ("Planta nova.", "É o primeiro desenho que deveria existir — antes da compra de equipamento e antes da fundação, porque é ele que define os dois."),
            ("Ampliação relevante.", "Acrescentar linha ou capacidade muda fluxo e utilidades da planta inteira, não só da área nova."),
            ("Mudança de processo.", "Trocar insumo, tecnologia ou produto costuma invalidar o arranjo que funcionava para o processo anterior."),
            ("Operação travando no dia a dia.", "Fila de empilhadeira, retrabalho de movimentação e manutenção difícil quase sempre são sintomas de arranjo, não de equipe."),
            ("Antes de contratar obra civil.", "A fundação e a estrutura seguem o arranjo. Inverter essa ordem é a origem mais comum de adaptação cara."),
        ],
        "recebe_titulo": "O que chega até você no fim",
        "recebe_cards": [
            ("fas fa-map-location-dot", "Arranjo geral cotado", "A planta desenhada com posições, distâncias, acessos e áreas de manutenção definidas."),
            ("fas fa-diagram-project", "Fluxos documentados", "Material, pessoas, veículos e utilidades, cada um com seu caminho representado e justificado."),
            ("fas fa-forward", "Base para as demais disciplinas", "O desenho que mecânica, elétrica, civil e automação usam como origem comum, sem versões divergentes."),
        ],
        "ref_kicker": "Referências técnicas",
        "ref_titulo": "Em que o arranjo se apoia",
        "ref_lead": "Arranjo industrial não é só eficiência: circulação, acesso e segurança são requisitos normativos.",
        "ref_cards": [
            ("fas fa-person-walking", "NR-8", "Norma regulamentadora de edificações — trata de circulação, pisos e proteção contra intempéries nas áreas de trabalho."),
            ("fas fa-shield-halved", "NR-12", "Segurança em máquinas e equipamentos — inclui exigências de espaço em torno da máquina e de vias de circulação."),
            ("fas fa-building", "NBR 8800", "Projeto de estruturas de aço e mistas — referência para as estruturas, plataformas e pipe-racks que o arranjo define."),
        ],
        "porque_titulo": "Por que fazer o projeto industrial com a 4WaTT",
        "porque_checks": [
            ("Arranjo feito por quem opera planta.", "A 4WaTT projeta, monta e opera plantas de biogás e biometano — o arranjo nasce da experiência de quem já teve que manter uma delas rodando."),
            ("Uma única base para todas as disciplinas.", "Mecânica, elétrica, civil e automação partem do mesmo arranjo, o que elimina a divergência entre projetos de fornecedores diferentes."),
            ("Expansão pensada desde a primeira fase.", "Área e utilidades de reserva entram no desenho inicial, quando ainda custam apenas espaço no papel."),
            ("Continuidade até a execução.", "O mesmo time segue no projeto mecânico, na fabricação e na montagem, sem perda de contexto entre etapas."),
        ],
        "porque_cta": "Solicitar orçamento de projeto industrial",
        "faq_titulo": "Dúvidas sobre projeto industrial",
        "faq": [
            ("Qual a diferença entre projeto industrial e projeto mecânico?", "O projeto industrial trata da planta como conjunto: arranjo, fluxos e utilidades. O projeto mecânico trata de cada equipamento em si. Um define onde e por quê; o outro define como o equipamento é fabricado."),
            ("Preciso já ter o terreno definido?", "Ajuda, mas não é obrigatório. O estudo de implantação pode inclusive ser usado para avaliar se um terreno ou galpão atende ao que o processo exige antes da decisão de compra ou locação."),
            ("O projeto serve para licenciamento?", "Ele é insumo importante do processo, porque organiza áreas, fluxos e destinação. A documentação específica de licenciamento é tratada pela vertical de Engenharia Ambiental."),
            ("Vocês trabalham com galpão existente?", "Sim. Adaptar processo a uma estrutura que já existe é um caso comum, e o trabalho passa a incluir o levantamento das restrições reais da edificação."),
            ("O arranjo considera a manutenção?", "Sim, e essa é uma das razões principais de fazê-lo. Espaço para retirada de equipamento, acesso de guindaste e área para desmontagem entram no desenho desde o início."),
            ("Como o projeto lida com ampliação futura?", "Reservando área e capacidade de utilidades para as fases seguintes. É a diferença entre crescer conforme o planejado e crescer onde sobrou espaço."),
        ],
        "cta_titulo": "Vai construir ou ampliar uma planta?",
    },

    {
        "slug": "fundacoes-de-maquinas",
        "nome": "Fundações de Máquinas",
        "icone": "fas fa-vector-square",
        "voz_marca": True,
        "meta": "Fundações de máquinas 4WaTT: base dimensionada para carga e vibração real do equipamento, com chumbadores no lugar certo.",
        "hero_lead": "A base não é só o que segura a máquina — é o que absorve a vibração dela. Fundação subdimensionada transforma equipamento novo em problema crônico.",
        "fatos": [
            ("Carga e vibração", "Dimensionamento pelo esforço dinâmico, não só pelo peso"),
            ("Chumbadores cotados", "Gabarito de furação conferido contra o equipamento real"),
            ("Interface resolvida", "Mecânica e civil falando a mesma linguagem"),
        ],
        "oque_titulo": "O que é o projeto de fundação de máquinas",
        "oque_p1": "Toda máquina rotativa devolve para o chão parte da energia que consome, em forma de vibração. Um motor, um ventilador, um compressor ou uma bomba não aplicam apenas o próprio peso sobre a base: aplicam esforços cíclicos que variam com a rotação e com o desbalanceamento. Projetar a fundação é dimensionar um bloco que suporte a carga estática, absorva esse esforço dinâmico e evite entrar em ressonância com a frequência de operação do equipamento.",
        "oque_p2": "Além do dimensionamento, o projeto resolve a interface que costuma ser a origem de dor de cabeça em campo: a posição exata dos chumbadores. Gabarito de furação errado, tolerância apertada demais ou nivelamento fora do previsto significam máquina que não assenta, alinhamento impossível e improviso com calço. É um problema barato de evitar no papel — o desenho de chumbadores conferido contra o desenho do fabricante — e caro de corrigir depois que o concreto curou.",
        "custo_kicker": "O que está em jogo",
        "custo_titulo": "O que uma base mal resolvida provoca",
        "custo_lead": "Fundação é o item que ninguém vê e todo mundo sente. Quando ela falha, a conta chega no equipamento, não no concreto.",
        "custo_cards": [
            ("fas fa-wave-square", "Vibração que se propaga", "Base que não absorve o esforço dinâmico transmite vibração para estrutura, tubulação e equipamentos vizinhos — e reduz a vida útil de todos."),
            ("fas fa-gears", "Desgaste acelerado", "Máquina que trabalha vibrando castiga rolamento, acoplamento e vedação. A troca vira rotina, e a causa raiz continua embaixo dela."),
            ("fas fa-screwdriver", "Alinhamento impossível", "Chumbador fora de posição ou base fora de nível obriga a montagem a improvisar com calço — o que resolve o dia e cria o problema do ano."),
        ],
        "tab_kicker": "O que é dimensionado",
        "tab_titulo": "O que o projeto define, item a item",
        "tab_lead": "Cada definição responde a um esforço específico do equipamento — não é bloco de concreto padrão.",
        "tab_th": ("Item", "Para que serve na prática"),
        "tab_rows": [
            ("Cargas do equipamento", "Peso próprio, carga de operação, esforço dinâmico e esforços de partida, levantados a partir dos dados do fabricante."),
            ("Geometria do bloco", "Dimensões e massa da fundação, definidas para suportar a carga e afastar a base da faixa de ressonância do equipamento."),
            ("Armação e concreto", "Detalhamento da armadura e classe de concreto compatíveis com o esforço cíclico, não apenas com a carga estática."),
            ("Chumbadores", "Tipo, comprimento, posição e gabarito de furação, conferidos contra o desenho de instalação do fabricante."),
            ("Nivelamento e grauteamento", "Tolerâncias de nível e procedimento de grauteamento, que é o que garante contato pleno entre base e equipamento."),
            ("Interface com o solo", "Verificação da capacidade do terreno ou definição de solução de apoio, quando o solo local não sustenta a carga."),
        ],
        "como_titulo": "Como conduzimos o projeto",
        "steps": [
            ("fa-solid fa-file-import", "Dados do equipamento", "Reunimos peso, rotação, cargas dinâmicas, desenho de instalação e gabarito de chumbadores do fabricante. Quando o dado não existe, levantamos em campo."),
            ("fa-solid fa-mountain", "Avaliação do apoio", "Verificamos a capacidade do solo ou da estrutura que vai receber a fundação, porque o mesmo bloco não serve em terrenos diferentes."),
            ("fa-solid fa-calculator", "Dimensionamento", "O bloco é dimensionado para a carga estática e para o esforço dinâmico, com verificação de vibração na frequência de operação."),
            ("fa-solid fa-ruler-combined", "Detalhamento executivo", "Você recebe fôrma, armação, posição de chumbadores e tolerâncias — o pacote que a obra executa sem interpretar."),
        ],
        "carrossel_lead": "Equipamentos e estruturas modelados pela engenharia mecânica 4WaTT. A mesma atenção à interface entre máquina e base aparece em cada projeto de fundação.",
        "quando_kicker": "Quando contratar",
        "quando_titulo": "Sinais de que a base precisa de projeto",
        "quando_itens": [
            ("Instalação de equipamento novo.", "Especialmente rotativo. A fundação precisa estar dimensionada antes da chegada da máquina, não depois."),
            ("Troca por equipamento maior.", "Base antiga dimensionada para outra carga e outra rotação raramente serve para o substituto, mesmo que o espaço caiba."),
            ("Vibração perceptível na operação.", "Se dá para sentir a vibração no piso ou na estrutura, a base já está fora do que deveria absorver."),
            ("Trincas na base existente.", "Fissura em bloco de fundação de máquina é sinal de esforço acima do previsto, não de acabamento."),
            ("Alinhamento que não se mantém.", "Equipamento que sai de alinhamento repetidamente costuma estar acusando movimento da base, não erro de montagem."),
        ],
        "recebe_titulo": "O que chega até você no fim",
        "recebe_cards": [
            ("fas fa-file-contract", "Memorial de cálculo", "Cargas consideradas, método de dimensionamento e verificação de vibração, por escrito e auditáveis."),
            ("fas fa-ruler-combined", "Projeto executivo", "Fôrma, armação, classe de concreto e detalhes construtivos, no nível que a obra executa direto."),
            ("fas fa-crosshairs", "Gabarito de chumbadores", "Posição cotada e tolerâncias, conferidas contra o desenho de instalação do equipamento."),
        ],
        "ref_kicker": "Referências técnicas",
        "ref_titulo": "Em que o dimensionamento se apoia",
        "ref_lead": "Fundação de máquina cruza três domínios normativos: concreto, fundação e vibração mecânica.",
        "ref_cards": [
            ("fas fa-cubes", "NBR 6118", "Norma de projeto de estruturas de concreto — base para o detalhamento de armadura e verificação do bloco."),
            ("fas fa-layer-group", "NBR 6122", "Norma de projeto e execução de fundações — trata da interação entre a fundação e o solo que a recebe."),
            ("fas fa-wave-square", "ISO 10816", "Referência internacional para avaliação de vibração em máquinas por medições em partes não rotativas."),
        ],
        "porque_titulo": "Por que projetar a fundação com a 4WaTT",
        "porque_checks": [
            ("Interface mecânica e civil na mesma casa.", "O erro clássico de fundação é a informação que se perde entre o fornecedor da máquina e a construtora. Aqui as duas pontas são a mesma engenharia."),
            ("Dimensionamento pelo esforço real.", "Consideramos carga dinâmica e frequência de operação, não apenas o peso do equipamento na placa de identificação."),
            ("Gabarito conferido antes da concretagem.", "A posição dos chumbadores é verificada contra o desenho do fabricante enquanto ainda é possível corrigir."),
            ("Continuidade até a montagem.", "A mesma equipe que projeta a base acompanha o assentamento, o nivelamento e o alinhamento do equipamento."),
        ],
        "porque_cta": "Solicitar orçamento de fundação",
        "faq_titulo": "Dúvidas sobre fundações de máquinas",
        "faq": [
            ("Toda máquina precisa de fundação projetada?", "Não. Equipamento leve e sem esforço dinâmico relevante costuma ser fixado direto no piso industrial. A necessidade de bloco projetado aparece com máquinas rotativas, cargas concentradas ou vibração significativa."),
            ("Preciso dos dados do fabricante?", "São o ponto de partida ideal, porque trazem cargas, rotação e gabarito de chumbadores. Quando o equipamento é antigo e a documentação se perdeu, fazemos o levantamento em campo."),
            ("A 4WaTT executa a fundação ou só projeta?", "Projetamos e acompanhamos a execução. A obra civil em si é conduzida com a vertical de Engenharia Civil, dentro da mesma coordenação."),
            ("Dá para reforçar uma base existente?", "Em muitos casos sim, e é frequentemente mais econômico que demolir. A decisão depende do diagnóstico: nem toda base antiga tem geometria e apoio que justifiquem reforço."),
            ("O projeto resolve problema de vibração já existente?", "O projeto trata a parcela que vem da base. Se a origem for desbalanceamento, desalinhamento ou desgaste do próprio equipamento, o caminho é o serviço de manutenção industrial — e o diagnóstico separa as duas coisas."),
            ("Quanto tempo antes da chegada do equipamento devo contratar?", "O suficiente para projetar, executar e permitir a cura do concreto antes do assentamento. Definir isso cedo evita a situação mais comum: máquina no pátio esperando base."),
        ],
        "cta_titulo": "Vai instalar um equipamento novo?",
    },

    # === FIM DOS SERVICOS ===
]
