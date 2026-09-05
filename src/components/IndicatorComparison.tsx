import { INSTITUTIONS, type NumericIndicatorKey, type YearData } from '../data'
import { formatPercent } from '../format'

export interface ComparisonRow {
  label: string
  key: NumericIndicatorKey
  /** 'max' = maior é melhor (rentabilidade); 'min' = menor é melhor (eficiência, inadimplência). */
  better: 'max' | 'min'
  hint?: string
}

interface IndicatorComparisonProps {
  rows: ComparisonRow[]
  data: YearData[]
}

/**
 * Régua comparativa: cada indicador vira três barras proporcionais, para que a distância
 * entre as instituições seja visível — não apenas legível. A barra vencedora é marcada
 * conforme a direção do indicador (maior ROE é bom; maior inadimplência não é).
 */
export function IndicatorComparison({ rows, data }: IndicatorComparisonProps) {
  return (
    <div className="divide-y divide-rule-soft">
      {rows.map((row) => {
        const values = INSTITUTIONS.map((inst) => ({
          inst,
          value: data.find((d) => d.institution === inst.id)?.[row.key],
        }))
        const present = values.filter((v) => v.value !== undefined) as {
          inst: (typeof INSTITUTIONS)[number]
          value: number
        }[]
        const max = present.length ? Math.max(...present.map((v) => v.value)) : 0
        const best = present.length
          ? present.reduce((acc, cur) =>
              row.better === 'max'
                ? cur.value > acc.value
                  ? cur
                  : acc
                : cur.value < acc.value
                  ? cur
                  : acc,
            )
          : undefined

        return (
          <div key={row.key} className="py-4 first:pt-0 last:pb-0">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h3 className="text-[13px] font-semibold text-ink">{row.label}</h3>
              <span className="eyebrow shrink-0">
                {row.better === 'max' ? 'maior é melhor' : 'menor é melhor'}
              </span>
            </div>

            <ul className="space-y-2">
              {values.map(({ inst, value }) => {
                const width = value !== undefined && max > 0 ? Math.max((value / max) * 100, 1.5) : 0
                const isBest = best && best.inst.id === inst.id
                return (
                  <li key={inst.id} className="flex items-center gap-3">
                    <span
                      className={`w-12 shrink-0 font-mono text-[11px] ${isBest ? '' : 'text-muted'}`}
                      style={isBest ? { color: inst.color, fontWeight: 600 } : undefined}
                    >
                      {inst.shortName}
                    </span>
                    {/* Sem dado não ganha trilho cheio: uma faixa tracejada evita que a
                        ausência seja lida como zero. */}
                    {value === undefined ? (
                      <span className="h-4 flex-1 rounded-sm border border-dashed border-rule" />
                    ) : (
                      <span className="relative h-4 flex-1 overflow-hidden rounded-sm bg-paper">
                        <span
                          className="absolute inset-y-0 left-0 rounded-sm transition-[width] duration-500 ease-out"
                          style={{
                            width: `${width}%`,
                            backgroundColor: inst.color,
                          }}
                        />
                      </span>
                    )}
                    <span
                      className={`tnum w-16 shrink-0 text-right font-mono ${
                        value === undefined ? 'text-[10px] text-muted' : 'text-xs'
                      }`}
                      style={
                        value === undefined
                          ? undefined
                          : isBest
                            ? { color: inst.color, fontWeight: 600 }
                            : { color: '#737373' }
                      }
                    >
                      {value === undefined ? 'sem dado' : formatPercent(value)}
                    </span>
                  </li>
                )
              })}
            </ul>
            {row.hint && <p className="mt-2.5 text-[11px] leading-relaxed text-muted">{row.hint}</p>}
          </div>
        )
      })}
    </div>
  )
}
