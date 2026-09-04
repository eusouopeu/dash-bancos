# Dashboard financeiro — Sicoob, Banco do Brasil e Itaú Unibanco

Comparação de indicadores financeiros (rentabilidade, solidez de capital,
eficiência e inadimplência) entre três modelos de propriedade do setor
bancário brasileiro: uma cooperativa de crédito (Sicoob), uma sociedade de
economia mista (Banco do Brasil) e um banco privado nacional (Itaú
Unibanco). React + TypeScript + Tailwind CSS, gráficos com Recharts, ícones
Heroicons, fonte Montserrat.

## Fonte dos dados

Relatório Anual e Relatório da Administração do Sicoob, releases de
resultados e Relações com Investidores do Banco do Brasil e do Itaú
Unibanco, e demonstrações financeiras (ITR/DFP) das duas companhias abertas
na CVM. Os valores e as fontes de cada indicador estão em `src/data.ts`
(`RAW_DATA`, `SOURCES`); diferenças de metodologia entre instituições (ex.:
definição de ROE ou de inadimplência) estão documentadas em
`METHODOLOGY_NOTES` e exibidas no rodapé do dashboard.

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
