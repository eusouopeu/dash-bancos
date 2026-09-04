import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { INSTITUTIONS, RAW_DATA, YEARS, type NumericIndicatorKey } from '../data'

function buildSeries(indicator: NumericIndicatorKey, scale: number) {
  return YEARS.map((year) => {
    const row: Record<string, number | string> = { year }
    for (const inst of INSTITUTIONS) {
      const d = RAW_DATA.find((x) => x.institution === inst.id && x.year === year)
      const value = d?.[indicator]
      if (value !== undefined) row[inst.shortName] = Number((value * scale).toFixed(2))
    }
    return row
  })
}

interface LineSeriesChartProps {
  indicator: NumericIndicatorKey
  scale: number
  valueSuffix: string
  height?: number
}

function LineSeriesChart({ indicator, scale, valueSuffix, height = 240 }: LineSeriesChartProps) {
  const data = buildSeries(indicator, scale)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickFormatter={(v) => `${v}${valueSuffix}`}
          width={44}
        />
        <Tooltip
          formatter={(value) => [`${Number(value).toLocaleString('pt-BR')}${valueSuffix}`, '']}
          contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 12 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11 }}
          iconSize={8}
          itemSorter={(item) => INSTITUTIONS.findIndex((inst) => inst.shortName === item.value)}
        />
        {INSTITUTIONS.map((inst) => (
          <Line
            key={inst.id}
            type="monotone"
            dataKey={inst.shortName}
            stroke={inst.color}
            strokeWidth={2}
            dot={{ r: 3, fill: inst.color, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function LucroLiquidoLineChart() {
  return <LineSeriesChart indicator="lucroLiquido" scale={1 / 1000} valueSuffix=" bi" />
}

export function EficienciaLineChart() {
  return <LineSeriesChart indicator="eficiencia" scale={100} valueSuffix="%" />
}

export function ROALineChart() {
  return <LineSeriesChart indicator="roa" scale={100} valueSuffix="%" />
}

export function hasLcrData(): boolean {
  return RAW_DATA.some((d) => d.lcr !== undefined)
}

export function LCRLineChart() {
  const data = YEARS.map((year) => {
    const row: Record<string, number | string> = { year }
    for (const inst of INSTITUTIONS) {
      const d = RAW_DATA.find((x) => x.institution === inst.id && x.year === year)
      if (d?.lcr !== undefined) row[inst.shortName] = Number((d.lcr * 100).toFixed(1))
    }
    return row
  })

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickFormatter={(v) => `${v}%`}
          width={44}
        />
        <Tooltip
          formatter={(value) => [`${Number(value).toLocaleString('pt-BR')}%`, '']}
          contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 12 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11 }}
          iconSize={8}
          itemSorter={(item) => INSTITUTIONS.findIndex((inst) => inst.shortName === item.value)}
        />
        {INSTITUTIONS.map((inst) => (
          <Line
            key={inst.id}
            type="monotone"
            dataKey={inst.shortName}
            stroke={inst.color}
            strokeWidth={2}
            connectNulls
            dot={{ r: 3, fill: inst.color, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
