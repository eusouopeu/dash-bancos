import { INSTITUTIONS, type AgenciasEntry, institutionById } from '../data'
import { formatNumber } from '../format'

interface AgenciasComparisonChartProps {
  data: AgenciasEntry[]
}

/**
 * Barras horizontais em vez de verticais: os rótulos ficam legíveis sem rotação e a
 * diferença de escala entre as redes aparece na mesma linha de leitura do número.
 */
export function AgenciasComparisonChart({ data }: AgenciasComparisonChartProps) {
  const ordered = INSTITUTIONS.map((inst) => data.find((d) => d.institution === inst.id)).filter(
    (d): d is AgenciasEntry => Boolean(d),
  )
  const max = Math.max(...ordered.map((d) => d.count))

  return (
    <div>
      <ul className="space-y-3">
        {ordered.map((d) => {
          const inst = institutionById(d.institution)
          return (
            <li key={d.institution}>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="font-mono text-[11px] text-muted">{inst.shortName}</span>
                <span className="flex items-baseline gap-1.5">
                  <span className="tnum font-mono text-sm font-semibold text-ink">
                    {formatNumber(d.count)}
                  </span>
                  <span className="font-mono text-[10px] text-muted">{d.asOf}</span>
                </span>
              </div>
              <span className="block h-2 overflow-hidden rounded-sm bg-rule-soft">
                <span
                  className="block h-full rounded-sm"
                  style={{ width: `${(d.count / max) * 100}%`, backgroundColor: inst.color }}
                />
              </span>
            </li>
          )
        })}
      </ul>
      <ul className="mt-4 space-y-1.5 border-t border-rule-soft pt-3 text-[10px] leading-relaxed text-muted">
        {ordered.map((d) => (
          <li key={d.institution}>
            <span className="font-mono text-ink">{institutionById(d.institution).shortName}</span>{' '}
            {d.note}
          </li>
        ))}
      </ul>
    </div>
  )
}
