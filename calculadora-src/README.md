# Calculadora 4WaTT — versão standalone (site institucional)

Cópia pública, **100% client-side e efêmera** da Calculadora 4WaTT, publicada em
`https://4watt.tech/calculadora/`. Qualquer visitante simula sem login e **nada
é salvo**: sem API, sem banco, sem leads, sem `localStorage`/`sessionStorage` —
ao sair da página, a simulação se perde.

O cálculo roda inteiramente no navegador com o motor de domínio vendorizado em
`src/domain/` (cópia de `packages/domain-data/src/` do monorepo da Calculadora —
mesmas funções puras que o usuário anônimo já executava no app original).

## Pré-requisito

- Node.js **≥ 20**

## Como gerar o build

```bash
npm install
npm run build
```

O build sai em **`../calculadora/`** (fora desta pasta, na raiz do site), com
`base: '/calculadora/'`. Esse diretório é **commitado** no repositório do site.

Outros scripts: `npm run dev` (servidor de desenvolvimento do Vite) e
`npm run preview` (serve o build localmente).

## Deploy

O deploy do site é upload manual. Desta calculadora, **só a pasta
`calculadora/`** (o output) precisa subir para o servidor — `calculadora-src/`
é apenas a fonte.

## Convenções

- Código e comentários em português brasileiro (pt-BR), como no app original.
- Não adicionar chamadas de API nem persistência local: o requisito do produto
  é que a simulação seja efêmera.
- Se o domínio (`src/domain/`) for atualizado a partir do monorepo, copie os
  arquivos novamente e rode o build.
