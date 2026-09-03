import type { ComponentType, SVGProps } from 'react'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'

interface IndicatorCardProps {
  label: string
  value: string
  helpText?: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  trend?: {
    deltaLabel: string
    direction: 'up' | 'down'
    positive: boolean
  }
}

export function IndicatorCard({ label, value, helpText, icon: Icon, trend }: IndicatorCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
          <Icon className="h-5 w-5 text-indigo-600" />
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <div className="flex items-center justify-between">
        {helpText && <p className="text-xs text-slate-400">{helpText}</p>}
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
              trend.positive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend.direction === 'up' ? (
              <ArrowUpIcon className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownIcon className="h-3.5 w-3.5" />
            )}
            {trend.deltaLabel}
          </span>
        )}
      </div>
    </div>
  )
}
