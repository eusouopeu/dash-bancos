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
import { METRICS } from '../data'
import { projectLinear } from '../projection'

const INDIGO = '#4f46e5'
const AMBER = '#d97706'

export function ProjecaoCicloChart() {
  const historico = METRICS.map((m) => ({ x: m.year, y: m.cicloDeCaixa }))
  const projetado = projectLinear(historico, 2)
  const ultimoHistorico = historico[historico.length - 1]

  const data = [
    ...historico.map((p) => ({ year: p.x, real: Number(p.y.toFixed(1)) })),
    ...projetado.map((p) => ({ year: p.x, projetado: Number(p.y.toFixed(1)) })),
  ]
  // repete o último ponto real na série projetada para as linhas se conectarem visualmente
  data[historico.length - 1] = { ...data[historico.length - 1], projetado: Number(ultimoHistorico.y.toFixed(1)) }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickFormatter={(v) => `${v}d`}
        />
        <Tooltip
          formatter={(value) => [`${Number(value).toFixed(1)} dias`, '']}
          contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 13 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="real"
          name="Ciclo de caixa (real)"
          stroke={INDIGO}
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="projetado"
          name="Projeção (regressão linear)"
          stroke={AMBER}
          strokeWidth={2.5}
          strokeDasharray="6 4"
          dot={{ r: 4 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
