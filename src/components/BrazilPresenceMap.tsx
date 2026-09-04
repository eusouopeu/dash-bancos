import { useMemo, useState } from 'react'
import brazilMap from '@svg-maps/brazil'
import { formatNumber } from '../format'

interface BrazilPresenceMapProps {
  dataByUF: Record<string, number>
  color: string
  noDataColor?: string
}

function hexToRgb(hex: string) {
  const [, r, g, b] = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) ?? []
  return r ? [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)] : [0, 0, 0]
}

/** Interpola entre branco e a cor da instituição conforme a intensidade (0–1, escala raiz para destacar diferenças menores). */
function colorFor(value: number, max: number, color: string) {
  if (max <= 0) return '#f1f5f9'
  const t = Math.sqrt(value / max)
  const [r, g, b] = hexToRgb(color)
  const mix = (channel: number) => Math.round(255 + (channel - 255) * t)
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
}

export function BrazilPresenceMap({ dataByUF, color, noDataColor = '#f1f5f9' }: BrazilPresenceMapProps) {
  const [hovered, setHovered] = useState<{ name: string; value: number | undefined } | null>(null)
  const max = useMemo(() => Math.max(0, ...Object.values(dataByUF)), [dataByUF])

  return (
    <div className="relative">
      <svg viewBox={brazilMap.viewBox} className="mx-auto h-auto w-full max-w-[220px]">
        {brazilMap.locations.map((loc) => {
          const value = dataByUF[loc.id.toUpperCase()]
          const fill = value === undefined ? noDataColor : colorFor(value, max, color)
          return (
            <path
              key={loc.id}
              d={loc.path}
              fill={fill}
              stroke="#fff"
              strokeWidth={1}
              onMouseEnter={() => setHovered({ name: loc.name, value })}
              onMouseLeave={() => setHovered(null)}
              className="transition-opacity hover:opacity-80"
            >
              <title>
                {loc.name}
                {value !== undefined ? `: ${formatNumber(value)} agências` : ': sem dado'}
              </title>
            </path>
          )
        })}
      </svg>

      {hovered && (
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg">
          {hovered.name}
          {hovered.value !== undefined ? `: ${formatNumber(hovered.value)} agências` : ': sem dado'}
        </div>
      )}

      <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
        <span>menos</span>
        <span className="flex h-2.5 w-16 overflow-hidden rounded-full">
          {[0.15, 0.35, 0.55, 0.75, 1].map((t) => (
            <span key={t} className="flex-1" style={{ backgroundColor: colorFor(t * max, max, color) }} />
          ))}
        </span>
        <span>mais agências</span>
      </div>
    </div>
  )
}
