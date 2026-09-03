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
