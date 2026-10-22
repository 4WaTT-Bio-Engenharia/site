# Blog 4WaTT

Home: `/artigos/`. `blog.html` e as cinco URLs canônicas antigas redirecionam para arquivos que existem. Os cinco artigos e dois cases mantêm suas URLs públicas. Inspirado na organização do [Hextra](https://github.com/imfing/hextra), implementado com o HTML/CSS/JS do repositório, sem Hugo, framework ou build obrigatório em produção.

## O que foi implementado

- Busca local por título, resumo, conteúdo do texto, tema e tags. Ignora acentos e maiúsculas; múltiplas palavras são combinadas. Atalho Ctrl/Cmd K.
- Cinco temas e 15 tags com páginas HTML próprias, canonical, Open Graph, Twitter Card, JSON-LD e links rastreáveis. Uma tag sem conteúdo é marcada `noindex, follow` e não entra no sitemap.
- Destaques: seis conteúdos, três por grupo no desktop e um por grupo no celular. Botões, teclado e arraste usam scroll nativo e o motor `data-marquee` existente, com a opção `data-marquee-paged`. Sem movimento automático, duplicatas ou troca forçada enquanto alguém lê.
- Feed RSS, política editorial, autoria e datas preservadas, painéis de assuntos relacionados nos artigos, GA4 nas páginas que não tinham rastreamento.
- Link Blog integrado à navbar das páginas ativas e ao gerador de engenharia. O tema compartilhado passou a proteger a largura do logo e usar o menu recolhido abaixo de 1440px para acomodar a navegação completa.
- Imagens WebP de 720 × 440 em `assets/img/blog/`, derivadas dos assets originais. Não substituir a imagem de um projeto por outra sem conferir legenda/alt.
- Fotografias reais em `assets/img/blog/campo/`, com dimensões e identificação em `data/blog/imagens-campo.json`. O artigo de biodigestores usa a foto do motogerador, o biodigestor de suinocultura e os registros de antes/depois do retrofit. O detalhe do equipamento em inox também foi preparado para uso editorial futuro. As imagens originais não foram alteradas.
- Parágrafos dos cinco artigos usam Inter, texto justificado e hifenização, com escala própria para celular. Títulos e legendas ficam à esquerda. Os botões de compartilhamento usam azul, teal e roxo com texto branco; `blog-interactions.js` fornece ripple, cópia do link canônico e feedback acessível. Movimento reduzido desativa o ripple, e o teclado continua funcionando sem animação.
- Correção dos canonicals dos artigos que apontavam para diretórios inexistentes. Os antigos endereços têm aliases HTML; se a hospedagem permitir, configurar também redirects HTTP 301 para os mesmos destinos.
- O artigo sobre a ANP 854/2021 recebeu uma nota explícita de contexto histórico e fonte oficial atual. Não foi tratado como revisão jurídica ou normativa do texto inteiro.

## Publicar um conteúdo

1. Criar/editar o HTML real do artigo, com conteúdo original, resposta direta à questão principal, H1 único, H2/H3, fontes verificadas, autoria e datas reais. Não inventar revisores ou credenciais. O gerador não escreve o corpo dos artigos.
2. Cadastrar em `data/blog/catalogo.json`: ID estável, URL, título/resumo/alt PT e EN, tema principal, 2 a 4 tags relevantes, data original, tempo de leitura e imagem. Os primeiros conteúdos têm quatro tags quando necessário; não aplicar as 15 em todos os artigos.
3. Para textos com `data-i18n`, editar o dicionário apropriado em PT e EN. A interface e os metadados dos cards são definidos em `data/blog/interface.json` e no catálogo; o gerador os adiciona a um bloco demarcado em `languages-pages.js`.
4. Executar `python scripts/gerar-blog.py`. O comando sincroniza a home, arquivos de temas/tags, traduções complementares, RSS, sitemap e painéis dos artigos. Ele lê navbar/footer da home e mantém o conteúdo dos artigos no lugar. `lastmod` só é atualizado quando o arquivo realmente mudou; `--date AAAA-MM-DD` permite informar a data real da edição.
5. Se alterar CSS/JS, incrementar as versões nas páginas que carregam esses assets e no gerador. Os textos PT/EN publicados no servidor usam os arquivos HTML gerados e os dicionários commitados. A tradução runtime não cria URLs internacionais; não declarar `hreflang` sem páginas de idioma próprias.
6. Rodar `python scripts/testar-blog.py`, `python .claude/skills/site-4watt/scripts/auditar.py` e conferir navegador em 1280px/375px, PT/EN, busca, tags e carrossel. O auditor global tem 11 pendências anteriores a esta entrega, fora do blog.
7. Fazer upload dos arquivos alterados e dos diretórios novos `artigos/temas/`, `artigos/tags/`, aliases, `data/blog/` e `assets/img/blog/`. Fontes e scripts não precisam ir para a hospedagem pública.

## Os seis mais vistos e a propriedade GA4 301593115

O site não incrementa um contador público nem usa contagens locais como audiência global. O coletor consulta `screenPageViews` por `pagePath`, restrito aos hosts `4watt.tech`/`www.4watt.tech` e às URLs do catálogo, nos **últimos 30 dias completos** (até ontem). O resultado não representa usuários únicos.

O feed `data/blog/destaques.json` contém apenas seis IDs e contagens agregadas. Até existirem seis conteúdos com visualizações positivas, o bloco continua identificado como **seleção da equipe**, sem contagens inventadas. Relatórios sujeitos a limiar ou falhas de consulta preservam o arquivo anterior. Se as métricas passarem de sete dias sem atualização, a interface volta à seleção editorial original.

Para ativar a automação já preparada em `.github/workflows/blog-destaques.yml`:

1. Ativar a Google Analytics Data API no projeto Google Cloud e criar uma conta de serviço dedicada. No GA4, dar a esse e-mail acesso **Leitor** à propriedade `301593115`.
2. No GitHub, em Settings → Secrets and variables → Actions, cadastrar o segredo **`GA4_SERVICE_ACCOUNT_JSON`** com a credencial da conta de serviço. Não colocar o JSON no repositório, nos arquivos da hospedagem ou em conversas. O [guia oficial do Google](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart) explica o acesso e a API. Para ambientes com Workload Identity Federation, preferir autenticação sem chave e ajustar a etapa `google-github-actions/auth`.
3. Após merge do workflow na `main`, criar a variável **`BLOG_GA4_ENABLED=true`**. O workflow tem permissão para gravar somente pelo checkout; o comando `git add` é restrito ao feed. Se a proteção da branch impedir commits do bot, usar PRs ou adaptar a política do repositório.
4. Executar “Run workflow” uma vez e conferir o resultado. Depois o agendamento consulta diariamente às **03h17 de Brasília**, sujeito aos atrasos do GitHub Actions.

Em produção, o blog lê o feed público da `main` no GitHub, com fallback para a cópia da hospedagem; assim novas posições não exigem upload de HTML. O repositório foi verificado como público. Em localhost, lê apenas a cópia local, para facilitar a revisão. O feed só consegue selecionar IDs conhecidos no catálogo já publicado; cadastrar artigo novo continua exigindo publicar o site.

Também é possível executar localmente com Application Default Credentials: instalar `scripts/requirements-blog.txt`, configurar a autenticação fora do repositório e rodar `python scripts/atualizar-destaques-blog.py`. O coletor não requer senha de usuário nem o segredo no navegador.

Para conferir a propriedade e a consulta sem autenticar ou gravar dados: `python scripts/atualizar-destaques-blog.py --dry-run`.

**Estado desta entrega:** propriedade configurada no catálogo; código e workflow preparados, integração não autenticada nem ativada nesta sessão. Dados reais não foram consultados.

## Pauta e SEO

As 15 tags são uma taxonomia editorial inicial ligada aos serviços da 4WaTT, não uma lista de volumes de busca medidos: biogás; biometano; biodigestores; digestão anaeróbia; resíduos orgânicos; gestão de resíduos; viabilidade econômica; financiamento de projetos; engenharia industrial; operação e manutenção; créditos de carbono; RenovaBio e CBIOs; descarbonização; regulação ANP; gaseificação de RSU.

Produzir clusters de conteúdo útil e específico, com fontes primárias e links entre guias, cases e serviços. Conferir termos reais de consulta no Search Console para priorizar a pauta. Evitar páginas duplicadas para pequenas variações de palavra-chave e arquivos vazios indexados. Tags e dados estruturados ajudam na organização e compreensão; não garantem posicionamento nem citação por uma IA. O [Google informa que os fundamentos de SEO também se aplicam às suas experiências com IA](https://developers.google.com/search/docs/appearance/ai-features).

O `llms.txt` complementa a descoberta, mas não substitui conteúdo rastreável e fontes. `robots.txt` continua permitindo o blog; a ausência de bloqueio não garante indexação. Depois do deploy, enviar sitemap e inspecionar as URLs pelo Search Console/Bing Webmaster Tools. A medição de cliques de busca e referências de assistentes é complementar ao ranking de visualizações do GA4.
