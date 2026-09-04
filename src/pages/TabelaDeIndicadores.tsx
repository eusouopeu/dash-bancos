import { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { INSTITUTIONS, RAW_DATA, institutionById, type YearData } from '../data'
import { formatPercent } from '../format'
import { PageHeader } from '../layout/PageHeader'

type SortKey =
  | 'institution'
  | 'year'
  | 'lucroLiquido'
  | 'patrimonioLiquido'
  | 'ativosTotais'
  | 'carteiraCredito'
  | 'roe'
  | 'roa'
  | 'eficiencia'
  | 'inadimplencia'
  | 'lcr'

interface Column {
  key: SortKey
  label: string
  /** Unidade da coluna — fica no cabeçalho em vez de repetida em cada célula. */
  unit?: string
  format: (r: YearData) => string
}

/** Em R$ bilhões, sem símbolo: a unidade está no cabeçalho da coluna. */
const bi = (valueInMillions: number) =>
  (valueInMillions / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })

const pct = (value: number | undefined) => (value === undefined ? '—' : formatPercent(value))

const COLUMNS: Column[] = [
  { key: 'institution', label: 'Instituição', format: (r) => institutionById(r.institution).shortName },
  { key: 'year', label: 'Ano', format: (r) => String(r.year) },
  { key: 'lucroLiquido', label: 'Lucro líquido', unit: 'R$ bi', format: (r) => bi(r.lucroLiquido) },
  { key: 'patrimonioLiquido', label: 'Patrimônio líq.', unit: 'R$ bi', format: (r) => bi(r.patrimonioLiquido) },
  { key: 'ativosTotais', label: 'Ativos totais', unit: 'R$ bi', format: (r) => bi(r.ativosTotais) },
  { key: 'carteiraCredito', label: 'Carteira de crédito', unit: 'R$ bi', format: (r) => bi(r.carteiraCredito) },
  { key: 'roe', label: 'ROE', unit: '%', format: (r) => pct(r.roe) },
  { key: 'roa', label: 'ROA', unit: '%', format: (r) => pct(r.roa) },
  { key: 'eficiencia', label: 'Eficiência', unit: '%', format: (r) => pct(r.eficiencia) },
  { key: 'inadimplencia', label: 'Inadimplência', unit: '%', format: (r) => pct(r.inadimplencia) },
  { key: 'lcr', label: 'LCR', unit: '%', format: (r) => pct(r.lcr) },
]

function sortValue(r: YearData, key: SortKey): number | string {
  if (key === 'institution') return institutionById(r.institution).shortName
  const v = r[key]
  return v === undefined ? -Infinity : v
}

export function TabelaDeIndicadores() {
  const [sortKey, setSortKey] = useState<SortKey>('year')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const defaultOrder = [...RAW_DATA].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    return (
      INSTITUTIONS.findIndex((i) => i.id === a.institution) -
      INSTITUTIONS.findIndex((i) => i.id === b.institution)
    )
  })

  const rows = [...defaultOrder].sort((a, b) => {
    const va = sortValue(a, sortKey)
    const vb = sortValue(b, sortKey)
    const cmp =
      typeof va === 'string' || typeof vb === 'string'
        ? String(va).localeCompare(String(vb))
        : va - vb
    return sortDir === 'asc' ? cmp : -cmp
  })

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Base completa"
        title="Tabela de Indicadores"
        subtitle="Todos os valores, por instituição e ano — clique no título de uma coluna para ordenar"
        meta="Valores em R$ bilhões, exceto percentuais"
      />
      <main className="mx-auto max-w-6xl px-6 py-6 pb-24 lg:px-10 lg:pb-8">
        <div className="overflow-x-auto rounded-lg border border-rule bg-surface">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-rule">
                {COLUMNS.map((col) => {
                  const active = col.key === sortKey
                  const numeric = Boolean(col.unit)
                  return (
                    <th key={col.key} className="px-3 py-3 align-bottom">
                      <button
                        onClick={() => handleSort(col.key)}
                        className={`eyebrow flex w-full items-center gap-1 whitespace-nowrap transition-colors hover:!text-ink ${
                          numeric ? 'justify-end' : ''
                        } ${active ? '!text-ink' : ''}`}
                      >
                        {col.label}
                        {active &&
                          (sortDir === 'asc' ? (
                            <ChevronUpIcon className="h-3 w-3" />
                          ) : (
                            <ChevronDownIcon className="h-3 w-3" />
                          ))}
                      </button>
                      {col.unit && (
                        <span
                          className={`mt-0.5 block font-mono text-[10px] normal-case tracking-normal text-muted/70 ${
                            numeric ? 'text-right' : ''
                          }`}
                        >
                          {col.unit}
                        </span>
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const inst = institutionById(r.institution)
                return (
                  <tr
                    key={`${r.institution}-${r.year}`}
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
                              : `tnum font-mono text-[13px] text-ink/80 ${col.unit ? 'text-right' : ''}`
                          }`}
                        >
                          {isLabel && (
                            <span
                              className="mr-2 inline-block h-2.5 w-0.5 rounded-full align-middle"
                              style={{ backgroundColor: inst.color }}
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
      </main>
    </>
  )
}
