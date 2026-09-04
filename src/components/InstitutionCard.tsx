import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import type { Institution, YearData } from '../data'
import { formatBRLBillions, formatPercent, formatPercentSigned } from '../format'

interface InstitutionCardProps {
  institution: Institution
  latest: YearData
  previous: YearData
}

export function InstitutionCard({ institution, latest, previous }: InstitutionCardProps) {
  const roeDelta = latest.roe - previous.roe
  const positive = roeDelta >= 0

  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      style={{ borderTopWidth: 3, borderTopColor: institution.color }}
    >
      <div>
        <p className="text-sm font-semibold text-slate-900">{institution.name}</p>
        <p className="text-xs text-slate-400">{institution.category}</p>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">ROE {latest.year}</p>
          <p className="text-2xl font-bold text-slate-900">{formatPercent(latest.roe)}</p>
        </div>
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
            positive ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {positive ? (
            <ArrowUpIcon className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownIcon className="h-3.5 w-3.5" />
          )}
          {formatPercentSigned(roeDelta)}
        </span>
      </div>
      <div className="flex justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Lucro líquido</span>
        <span className="font-medium text-slate-700">{formatBRLBillions(latest.lucroLiquido)}</span>
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>Ativos totais</span>
        <span className="font-medium text-slate-700">{formatBRLBillions(latest.ativosTotais)}</span>
      </div>
    </div>
  )
}
