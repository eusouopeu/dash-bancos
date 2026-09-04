import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  ReferenceLine,
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
      if (d) row[inst.shortName] = Number((d[indicator] * scale).toFixed(2))
    }
    return row
  })
}

interface GroupedBarChartProps {
  indicator: NumericIndicatorKey
  scale: number
  valueSuffix: string
  height?: number
export function CicloDeCaixaChart() {
  const data = METRICS.map((m) => ({ year: m.year, dias: Number(m.cicloDeCaixa.toFixed(1)) }))
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickFormatter={(v) => `${v}d`}
        />
        <Tooltip
          formatter={(value) => [`${Number(value).toFixed(1)} dias`, 'Ciclo de caixa']}
          contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 13 }}
        />
        <ReferenceLine x={2020} stroke={ROSE} strokeDasharray="4 4">
          <Label
            value="Início da pandemia"
            position="insideTopLeft"
            fontSize={11}
            fill="#fff"
            style={{ fontWeight: 600 }}
          />
        </ReferenceLine>
        <Bar dataKey="dias" fill={INDIGO} radius={[6, 6, 6, 6]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function GroupedBarChart({ indicator, scale, valueSuffix, height = 280 }: GroupedBarChartProps) {
  const data = buildSeries(indicator, scale)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickFormatter={(v) => `${v}${valueSuffix}`}
        />
        <Tooltip
          formatter={(value) => [`${Number(value).toLocaleString('pt-BR')}${valueSuffix}`, '']}
          contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 13 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
          itemSorter={(item) => INSTITUTIONS.findIndex((inst) => inst.shortName === item.value)}
        />
        {INSTITUTIONS.map((inst) => (
          <Bar
            key={inst.id}
            dataKey={inst.shortName}
            fill={inst.color}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function ROEChart() {
  return <GroupedBarChart indicator="roe" scale={100} valueSuffix="%" />
}

export function ROAChart() {
  return <GroupedBarChart indicator="roa" scale={100} valueSuffix="%" />
}

export function BasileiaChart() {
  return <GroupedBarChart indicator="basileia" scale={100} valueSuffix="%" />
}

export function EficienciaChart() {
  return <GroupedBarChart indicator="eficiencia" scale={100} valueSuffix="%" />
}

export function InadimplenciaChart() {
  return <GroupedBarChart indicator="inadimplencia" scale={100} valueSuffix="%" />
}

export function AtivosTotaisChart() {
  return <GroupedBarChart indicator="ativosTotais" scale={1 / 1000} valueSuffix=" bi" height={300} />
}
