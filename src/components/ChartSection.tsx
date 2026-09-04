import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { INSTITUTIONS, RAW_DATA, YEARS, institutionById, type NumericIndicatorKey } from '../data'

const RULE = 'rgba(23,23,23,0.10)'
const MUTED = '#737373'

const AXIS_TICK = {
  fontSize: 10,
  fill: MUTED,
  fontFamily: '"IBM Plex Mono", monospace',
} as const

function buildSeries(indicator: NumericIndicatorKey, scale: number, digits = 2) {
  return YEARS.map((year) => {
    const row: Record<string, number | string> = { year }
    for (const inst of INSTITUTIONS) {
      const d = RAW_DATA.find((x) => x.institution === inst.id && x.year === year)
      const value = d?.[indicator]
      if (value !== undefined) row[inst.shortName] = Number((value * scale).toFixed(digits))
    }
    return row
  })
}

interface TooltipEntry {
  name: string
  value: number
  color: string
}

function ChartTooltip({
  active,
  payload,
  label,
  suffix,
}: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
  suffix: string
}) {
  if (!active || !payload?.length) return null
  const ordered = [...payload].sort(
    (a, b) =>
      INSTITUTIONS.findIndex((i) => i.shortName === a.name) -
      INSTITUTIONS.findIndex((i) => i.shortName === b.name),
  )
  return (
    <div className="rounded-md border border-rule bg-surface px-3 py-2 shadow-[0_4px_16px_rgba(23,23,23,0.08)]">
      <p className="eyebrow mb-1.5">{label}</p>
      <ul className="space-y-1">
        {ordered.map((entry) => (
          <li key={entry.name} className="flex items-center gap-2.5">
            <span
              className="h-0.5 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-mono text-[11px] text-muted">{entry.name}</span>
            <span className="tnum ml-auto font-mono text-[11px] font-semibold text-ink">
              {Number(entry.value).toLocaleString('pt-BR')}
              {suffix}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Legenda própria — a do Recharts não aceita a tipografia da identidade. */
export function SeriesLegend() {
  return (
    <ul className="mb-1 flex flex-wrap items-center gap-x-4 gap-y-1">
      {INSTITUTIONS.map((inst) => (
        <li key={inst.id} className="flex items-center gap-1.5">
          <span
            className="h-0.5 w-3.5 rounded-full"
            style={{ backgroundColor: inst.color }}
            aria-hidden
          />
          <span className="font-mono text-[10px] text-muted">{inst.shortName}</span>
        </li>
      ))}
    </ul>
  )
}

interface LineSeriesChartProps {
  indicator: NumericIndicatorKey
  scale: number
  valueSuffix: string
  height?: number
  digits?: number
}

function LineSeriesChart({
  indicator,
  scale,
  valueSuffix,
  height = 210,
  digits = 2,
}: LineSeriesChartProps) {
  const data = buildSeries(indicator, scale, digits)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid stroke={RULE} vertical={false} />
        <XAxis
          dataKey="year"
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={{ stroke: RULE }}
          dy={4}
        />
        <YAxis
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${Number(v).toLocaleString('pt-BR')}${valueSuffix}`}
          width={46}
        />
        <Tooltip
          cursor={{ stroke: RULE, strokeWidth: 1 }}
          content={<ChartTooltip suffix={valueSuffix} />}
        />
        {INSTITUTIONS.map((inst) => (
          <Line
            key={inst.id}
            type="monotone"
            dataKey={inst.shortName}
            stroke={inst.color}
            strokeWidth={2}
            connectNulls
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function LucroLiquidoLineChart() {
  return <LineSeriesChart indicator="lucroLiquido" scale={1 / 1000} valueSuffix=" bi" digits={1} />
}

export function EficienciaLineChart() {
  return <LineSeriesChart indicator="eficiencia" scale={100} valueSuffix="%" digits={1} />
}

export function ROALineChart() {
  return <LineSeriesChart indicator="roa" scale={100} valueSuffix="%" />
}

export function ROELineChart() {
  return <LineSeriesChart indicator="roe" scale={100} valueSuffix="%" digits={1} />
}

export function InadimplenciaLineChart() {
  return <LineSeriesChart indicator="inadimplencia" scale={100} valueSuffix="%" digits={1} />
}

export function hasLcrData(): boolean {
  return RAW_DATA.some((d) => d.lcr !== undefined)
}

export function LCRLineChart() {
  return <LineSeriesChart indicator="lcr" scale={100} valueSuffix="%" digits={0} />
}

/**
 * Separa quem nunca divulga o indicador de quem só não publicou o ano mais recente —
 * as duas lacunas têm causas diferentes e merecem frases diferentes na nota de rodapé.
 */
export function coverageGaps(indicator: NumericIndicatorKey): {
  never: string[]
  latestOnly: string[]
} {
  const never: string[] = []
  const latestOnly: string[] = []
  const latest = YEARS[YEARS.length - 1]

  for (const inst of INSTITUTIONS) {
    const rows = RAW_DATA.filter((d) => d.institution === inst.id)
    const hasAny = rows.some((d) => d[indicator] !== undefined)
    const name = institutionById(inst.id).shortName
    if (!hasAny) {
      never.push(name)
    } else if (rows.find((d) => d.year === latest)?.[indicator] === undefined) {
      latestOnly.push(name)
    }
  }
  return { never, latestOnly }
}
