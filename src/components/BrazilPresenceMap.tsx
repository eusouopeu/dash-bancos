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
  if (max <= 0) return '#eae7e0'
  // Teto de 0,82: o estado mais denso não chega à cor pura, senão a rampa do BB (tinta)
  // fecha em preto e o mapa vira um borrão.
  const t = Math.sqrt(value / max) * 0.82
  const [r, g, b] = hexToRgb(color)
  // Interpola a partir do papel, não do branco — o mapa fica assentado no fundo.
  const mix = (channel: number, base: number) => Math.round(base + (channel - base) * t)
  return `rgb(${mix(r, 245)}, ${mix(g, 243)}, ${mix(b, 238)})`
}

export function BrazilPresenceMap({ dataByUF, color, noDataColor = '#eae7e0' }: BrazilPresenceMapProps) {
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
              stroke="#fdfcfa"
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
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2.5 py-1 font-mono text-[11px] text-paper">
          {hovered.name}
          {hovered.value !== undefined ? `: ${formatNumber(hovered.value)} agências` : ': sem dado'}
        </div>
      )}

      <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[10px] text-muted">
        <span>menos</span>
        <span className="flex h-2 w-16 overflow-hidden rounded-sm">
          {[0.15, 0.35, 0.55, 0.75, 1].map((t) => (
            <span key={t} className="flex-1" style={{ backgroundColor: colorFor(t * max, max, color) }} />
          ))}
        </span>
        <span>mais agências</span>
      </div>
    </div>
  )
}
