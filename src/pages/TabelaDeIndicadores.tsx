import { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { INSTITUTIONS, RAW_DATA, institutionById, type YearData } from '../data'
import { formatBRLBillions, formatPercent } from '../format'
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
  format: (r: YearData) => string
}

const COLUMNS: Column[] = [
  { key: 'institution', label: 'Instituição', format: (r) => institutionById(r.institution).shortName },
  { key: 'year', label: 'Ano', format: (r) => String(r.year) },
  { key: 'lucroLiquido', label: 'Lucro líquido', format: (r) => formatBRLBillions(r.lucroLiquido) },
  { key: 'patrimonioLiquido', label: 'Patrimônio líquido', format: (r) => formatBRLBillions(r.patrimonioLiquido) },
  { key: 'ativosTotais', label: 'Ativos totais', format: (r) => formatBRLBillions(r.ativosTotais) },
  { key: 'carteiraCredito', label: 'Carteira de crédito', format: (r) => formatBRLBillions(r.carteiraCredito) },
  { key: 'roe', label: 'ROE', format: (r) => formatPercent(r.roe) },
  { key: 'roa', label: 'ROA', format: (r) => formatPercent(r.roa) },
  { key: 'eficiencia', label: 'Eficiência', format: (r) => (r.eficiencia === undefined ? '—' : formatPercent(r.eficiencia)) },
  { key: 'inadimplencia', label: 'Inadimplência', format: (r) => (r.inadimplencia === undefined ? '—' : formatPercent(r.inadimplencia)) },
  { key: 'lcr', label: 'LCR', format: (r) => (r.lcr === undefined ? '—' : formatPercent(r.lcr)) },
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
        title="Tabela de Indicadores"
        subtitle="Todos os valores, por instituição e ano — clique no título de uma coluna para ordenar"
        meta="R$ milhões, exceto percentuais"
      />
      <main className="mx-auto max-w-6xl px-6 py-8 pb-20 lg:px-10 lg:pb-8">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                {COLUMNS.map((col) => {
                  const active = col.key === sortKey
                  return (
                    <th key={col.key} className="px-4 py-3 font-medium">
                      <button
                        onClick={() => handleSort(col.key)}
                        className={`flex items-center gap-1 hover:text-slate-700 ${active ? 'text-slate-800' : ''}`}
                      >
                        {col.label}
                        {active &&
                          (sortDir === 'asc' ? (
                            <ChevronUpIcon className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDownIcon className="h-3.5 w-3.5" />
                          ))}
                      </button>
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
                    className="border-b border-slate-100 text-slate-700 last:border-0"
                  >
                    {COLUMNS.map((col) => (
                      <td key={col.key} className="px-4 py-2.5">
                        {col.key === 'institution' && (
                          <span
                            className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
                            style={{ backgroundColor: inst.color }}
                          />
                        )}
                        {col.format(r)}
                      </td>
                    ))}
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
