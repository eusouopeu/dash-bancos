import type { ComponentType, SVGProps } from 'react'
import { ShieldCheckIcon, StarIcon } from '@heroicons/react/24/solid'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import type { Institution, InstitutionId, YearData } from '../data'
import { formatBRLBillions, formatPercent } from '../format'

const HIGHLIGHT_ICON: Record<InstitutionId, ComponentType<SVGProps<SVGSVGElement>>> = {
  sicoob: ArrowTrendingUpIcon,
  bb: ArrowTrendingUpIcon,
  itau: ShieldCheckIcon,
}

const FEATURED: InstitutionId = 'sicoob'

interface InstitutionCardProps {
  institution: Institution
  latest: YearData | undefined
  year: number
}

function hexToRgba(hex: string, alpha: number) {
  const [, r, g, b] = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) ?? []
  if (!r) return hex
  return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${alpha})`
}

export function InstitutionCard({ institution, latest, year }: InstitutionCardProps) {
  const HighlightIcon = HIGHLIGHT_ICON[institution.id]
  const featured = institution.id === FEATURED

  return (
    <div
      className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      style={{ borderBottomWidth: 3, borderBottomColor: institution.color }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-base font-extrabold"
            style={{ backgroundColor: hexToRgba(institution.color, 0.12), color: institution.color }}
          >
            {institution.initials}
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">{institution.name}</p>
            <p className="text-xs text-slate-400">{institution.category}</p>
          </div>
        </div>
        {featured && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-600">
            <StarIcon className="h-3.5 w-3.5" />
            Destaque
          </span>
        )}
      </div>

      {latest ? (
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-base font-extrabold text-slate-900">{formatBRLBillions(latest.ativosTotais)}</p>
            <p className="text-[11px] text-slate-400">Ativos Totais</p>
          </div>
          <div>
            <p className="text-base font-extrabold text-slate-900">{formatPercent(latest.roe)}</p>
            <p className="text-[11px] text-slate-400">ROE</p>
          </div>
          <div>
            <p className="text-base font-extrabold text-slate-900">{formatPercent(latest.roa)}</p>
            <p className="text-[11px] text-slate-400">ROA</p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400">
          Sem dado confiável de fechamento para {year} — ver metodologia.
        </p>
      )}

      <div className="flex items-start gap-2 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500">
        <HighlightIcon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: institution.color }} />
        <span>{institution.highlight}</span>
      </div>
    </div>
  )
}
