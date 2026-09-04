# Dashboard financeiro — Ambev S.A.

Análise de liquidez, atividade e lucratividade da Ambev S.A. (2020–2024), com
dados públicos das Demonstrações Financeiras Padronizadas (DFP) enviadas à
CVM. React + TypeScript + Tailwind CSS, gráficos com Recharts, ícones
Heroicons, fonte Montserrat.

## Fonte dos dados

[Portal de Dados Abertos da CVM](https://dados.cvm.gov.br/dataset/cia_aberta-doc-dfp)
— AMBEV S.A., CD_CVM 023264, demonstrações consolidadas. Os valores brutos
(Estoques, Contas a Receber, Fornecedores, Receita Líquida, CPV, EBIT, Lucro
Líquido) estão em `src/data.ts`; os indicadores (giro de estoque, PME, PMR,
PMP, ciclo de caixa, NCG, margens) são calculados a partir deles no mesmo
arquivo, seguindo a metodologia usada na análise do Grupo Guararapes
(saldos médios, ano comercial de 360 dias).

## Rodando localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Dados pendentes (rentabilidade, dívida, inflação e concorrentes)

Além dos indicadores de liquidez/atividade, o dashboard já traz a lógica e o
layout prontos para:

- **ROE, ROA, ROIC e estrutura de capital** (dívida líquida/EBITDA, cobertura
  de juros) — faltam os campos `patrimonioLiquido`, `ativoTotal`,
  `dividaBruta`, `caixaEquivalentes`, `despesaFinanceiraLiquida` e
  `depreciacaoAmortizacao` em `src/data.ts` (procure por `TODO`).
- **Decomposição DuPont do ROE** — calculada automaticamente a partir dos
  mesmos campos acima, sem código adicional.
- **Receita real vs. nominal (IPCA)** — falta preencher `IPCA_ANUAL` em
  `src/inflacao.ts` com a variação anual do IPCA de cada ano.
- **Comparação setorial (benchmarking)** — falta adicionar 1–2 concorrentes
  diretos em `src/concorrentes.ts` (ex.: Heineken Brasil, Coca-Cola FEMSA).

Enquanto esses valores estiverem `null`/vazios, o dashboard mostra um selo de
"dado pendente" em vez de números incorretos ou gráficos quebrados. Basta
preencher os arquivos indicados — nenhuma outra mudança de código é
necessária.

## Testes

```bash
npm run test
```

Testes unitários (Vitest) para as fórmulas financeiras em `src/data.ts`.

## Deploy no GitHub Pages

Duas opções:

1. **GitHub Actions (recomendado)** — o workflow em
   `.github/workflows/deploy.yml` já está configurado. Basta:
   - criar um repositório no GitHub e dar push neste diretório;
   - em Settings → Pages, selecionar "GitHub Actions" como fonte;
   - todo push em `main` publica automaticamente.
2. **`gh-pages` manual**:
   ```bash
   npm run deploy
   ```
   (usa o pacote `gh-pages`, publica a pasta `dist` na branch `gh-pages`).

O `base` em `vite.config.ts` está fixado como `/dashboard-financeiro-ambev/` — se o nome
do repositório no GitHub for diferente, ajuste esse valor antes do build.
