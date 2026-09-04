import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { INSTITUTIONS, RAW_DATA, YEARS, institutionById, type YearData } from '../data'
import { formatPercent } from '../format'
import { PageHeader } from '../layout/PageHeader'

interface Column {
  key: string
  label: string
  /** Unidade da coluna — fica no cabeçalho em vez de repetida em cada célula. */
  unit?: string
  /** Valor exibido na tela, já formatado em pt-BR. */
  format: (r: YearData) => string
  /** Valor levado para o CSV: número cru em pt-BR, sem unidade nem separador de milhar. */
  csv: (r: YearData) => string
}

/** Em R$ bilhões, sem símbolo: a unidade está no cabeçalho da coluna. */
const bi = (valueInMillions: number) =>
  (valueInMillions / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })

const pct = (value: number | undefined) => (value === undefined ? '—' : formatPercent(value))

/** Decimal com vírgula e sem separador de milhar — o que o Excel em pt-BR lê como número. */
const rawNumber = (value: number | undefined, digits: number) =>
  value === undefined ? '' : value.toFixed(digits).replace('.', ',')

const COLUMNS: Column[] = [
  {
    key: 'institution',
    label: 'Instituição',
    format: (r) => institutionById(r.institution).shortName,
    csv: (r) => institutionById(r.institution).name,
  },
  {
    key: 'lucroLiquido',
    label: 'Lucro líquido',
    unit: 'R$ bi',
    format: (r) => bi(r.lucroLiquido),
    csv: (r) => rawNumber(r.lucroLiquido / 1000, 1),
  },
  {
    key: 'patrimonioLiquido',
    label: 'Patrimônio líq.',
    unit: 'R$ bi',
    format: (r) => bi(r.patrimonioLiquido),
    csv: (r) => rawNumber(r.patrimonioLiquido / 1000, 1),
  },
  {
    key: 'ativosTotais',
    label: 'Ativos totais',
    unit: 'R$ bi',
    format: (r) => bi(r.ativosTotais),
    csv: (r) => rawNumber(r.ativosTotais / 1000, 1),
  },
  {
    key: 'carteiraCredito',
    label: 'Carteira de crédito',
    unit: 'R$ bi',
    format: (r) => bi(r.carteiraCredito),
    csv: (r) => rawNumber(r.carteiraCredito / 1000, 1),
  },
  { key: 'roe', label: 'ROE', unit: '%', format: (r) => pct(r.roe), csv: (r) => rawNumber(r.roe * 100, 2) },
  { key: 'roa', label: 'ROA', unit: '%', format: (r) => pct(r.roa), csv: (r) => rawNumber(r.roa * 100, 2) },
  {
    key: 'eficiencia',
    label: 'Eficiência',
    unit: '%',
    format: (r) => pct(r.eficiencia),
    csv: (r) => rawNumber(r.eficiencia === undefined ? undefined : r.eficiencia * 100, 2),
  },
  {
    key: 'inadimplencia',
    label: 'Inadimplência',
    unit: '%',
    format: (r) => pct(r.inadimplencia),
    csv: (r) => rawNumber(r.inadimplencia === undefined ? undefined : r.inadimplencia * 100, 2),
  },
]

/**
 * Ponto e vírgula como separador e BOM no início: é o que faz o Excel em português
 * abrir o arquivo já com as colunas separadas e os acentos corretos.
 */
function downloadCsv(year: number, rows: YearData[]) {
  const header = COLUMNS.map((c) => (c.unit ? `${c.label} (${c.unit})` : c.label))
  const body = rows.map((r) => COLUMNS.map((c) => c.csv(r)))
  const csv = [header, ...body].map((line) => line.join(';')).join('\r\n')

  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `indicadores-${year}.csv`
  link.click()
  // Revogar no mesmo tick cancela o download em alguns navegadores.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function YearTable({ year }: { year: number }) {
  const rows = RAW_DATA.filter((r) => r.year === year).sort(
    (a, b) =>
      INSTITUTIONS.findIndex((i) => i.id === a.institution) -
      INSTITUTIONS.findIndex((i) => i.id === b.institution),
  )

  return (
    <section className="overflow-hidden rounded-lg border border-rule bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
        <div>
          <p className="eyebrow">Exercício</p>
          <h2 className="tnum mt-0.5 font-mono text-lg font-semibold tracking-[-0.01em] text-ink">
            {year}
          </h2>
        </div>
        <button
          onClick={() => downloadCsv(year, rows)}
          className="flex items-center gap-2 rounded-md border border-rule px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted transition-colors hover:border-petrol hover:text-petrol"
        >
          <ArrowDownTrayIcon className="h-3.5 w-3.5" />
          Baixar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <caption className="sr-only">Indicadores financeiros das três instituições em {year}</caption>
          <thead>
            <tr className="border-b border-rule">
              {COLUMNS.map((col) => (
                <th key={col.key} scope="col" className="px-3 py-3 align-bottom">
                  <span className={`eyebrow block whitespace-nowrap ${col.unit ? 'text-right' : ''}`}>
                    {col.label}
                  </span>
                  {col.unit && (
                    <span className="mt-0.5 block text-right font-mono text-[10px] text-muted/70">
                      {col.unit}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const inst = institutionById(r.institution)
              return (
                <tr
                  key={r.institution}
                  className="border-b border-rule-soft transition-colors last:border-0 hover:bg-paper/60"
                >
                  {COLUMNS.map((col) => {
                    const isLabel = col.key === 'institution'
                    return (
                      <td
                        key={col.key}
                        className={`whitespace-nowrap px-3 py-2.5 ${
                          isLabel
                            ? 'font-medium text-ink'
                            : 'tnum text-right font-mono text-[13px] text-ink/80'
                        }`}
                      >
                        {isLabel && (
                          <span
                            className="mr-2 inline-block h-2.5 w-0.5 rounded-full align-middle"
                            style={{ backgroundColor: inst.color }}
                            aria-hidden
                          />
                        )}
                        {col.format(r)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function TabelaDeIndicadores() {
  return (
    <>
      <PageHeader
        eyebrow="Base completa"
        title="Tabela de Indicadores"
        subtitle="Um quadro por exercício, com as três instituições lado a lado"
        meta="Valores em R$ bilhões, exceto percentuais · célula vazia (—) significa dado não divulgado"
      />
      <main className="mx-auto max-w-6xl space-y-5 px-6 py-6 pb-24 lg:px-10 lg:pb-8">
        {[...YEARS].reverse().map((year) => (
          <YearTable key={year} year={year} />
        ))}
      </main>
    </>
  )
}
