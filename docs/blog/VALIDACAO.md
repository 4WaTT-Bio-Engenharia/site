# Validação do blog

22 de outubro de 2026. Branch `codex/blog-seo`. Alterações locais, sem deploy de produção.

## Verificações concluídas

- Seis testes de `python scripts/testar-blog.py` passaram: agregação e desempate do ranking, dados insuficientes, consulta restrita a hosts/URLs corretos, HTML rastreável, links/imagens locais, canonicals, RSS e exclusão de tags vazias do sitemap.
- Sintaxe conferida com `node --check` em `blog.js`, `site-premium.js` e `languages-pages.js`; scripts Python compilam. `git diff --check` sem erros.
- Regeneração do blog sem alterações é idempotente e não muda `lastmod` artificialmente.
- Navegador em 375 × 812, 1280 × 1000 e 1440 × 1100: sem rolagem horizontal do documento, logo preservado, imagens carregadas e menu adaptado ao espaço.
- Busca técnica por `CSTR` retorna apenas o artigo de biodigestores. Pesquisa sem resultado exibe estado vazio. Ordenação antiga começa pelo artigo de março. Limpeza restaura os sete conteúdos.
- Interface PT/EN, navegação a Cases (três conteúdos) e à tag Biometano (dois conteúdos) verificadas.
- Carrossel com seis cards: três por grupo no desktop e um no mobile; avanço e navegação por teclado verificados.
- Feed de métricas simulado em servidor de QA separado: a interface adotou a ordem recebida e o rótulo de mais lidos. Com a data vencida, voltou à seleção editorial original. O feed real do repositório permaneceu editorial e não recebeu dados simulados.
- Console da home sem erros ou avisos nas inspeções. Nenhum formulário de produção enviado.
- Consulta GA4 validada com `--dry-run` para a propriedade `301593115`, sem autenticar ou gravar métricas.

## Ajustes de leitura, fotos e botões

- Verificado no navegador: os cinco artigos exibem parágrafos justificados e todos os rótulos de compartilhamento ficam brancos nos fundos azul, teal e roxo.
- Em 375px, a abertura usa Inter 18px, o corpo usa 17px e a galeria fica em uma coluna, sem transbordamento horizontal.
- A foto real do motogerador substitui a ilustração de cogeração. Seu enquadramento fica inteiro, sem os deslocamentos e a ampliação da imagem antiga. As fotos do biodigestor e do retrofit carregam com legendas e alt em PT/EN.
- O botão Copiar link exibiu sucesso; o ripple foi criado e removido após a animação. Nenhum compartilhamento externo foi enviado durante os testes.
- A data original de publicação do artigo foi mantida; a atualização editorial de 22/10/2026 aparece no cabeçalho e no JSON-LD.

## Imagens Organo e molduras do retrofit

- Biofertilizante substituído pela foto `biofertilizante_compostagem_organo_por_do_sol_quadrado.jpg` e biometano por `4wattimagemsite5.webp`, com dimensões explícitas e alt em PT/EN verificado no navegador.
- As molduras do retrofit têm a mesma proporção quadrada e preservam as montagens completas (`object-fit: contain`). Os cartões e as legendas ficam alinhados, com duas colunas no desktop e uma no celular.
- Em 1280px, ambos os cartões medem aproximadamente 381 × 446px; em 375px, ambos medem aproximadamente 289 × 355px. Sem transbordamento horizontal. Console sem erros ou avisos na conferência.
- A pasta de WebP do blog estava ausente nesta conferência. As sete miniaturas e as cinco fotos de campo foram recuperadas dos originais disponíveis, preservando o enquadramento. Os seis testes do blog voltaram a passar.
- A auditoria global mantém as mesmas 11 pendências anteriores, sem novas divergências de tradução ou versão dos assets alterados.

## Limites e pendências

- Autenticação da API GA4 não configurada nesta sessão. Ativação e publicação do workflow dependem da conta de serviço, do segredo e da variável documentados no README.
- O auditor global analisou 99 páginas e manteve as mesmas 11 ocorrências anteriores: três chaves `bm_vol_*_icon` ausentes, seis páginas de verticais de engenharia ainda inexistentes e duas divergências de versão em `mobile-fixes.css`/`solucoes.css`. Nenhuma ocorrência nova do blog.
- A nota do artigo de regulação identifica o contexto histórico; o corpo técnico antigo ainda precisa de revisão editorial específica.
- Indexação, desempenho no servidor de produção, posições no Google e referências por assistentes só poderão ser avaliados depois do deploy e da coleta de dados.
