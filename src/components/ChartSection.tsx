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
import { METRICS } from '../data'

const INDIGO = '#4f46e5'
const SKY = '#0ea5e9'
const SLATE = '#94a3b8'
const ROSE = '#e11d48'

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

export function MargensChart() {
  const data = METRICS.map((m) => ({
    year: m.year,
    Bruta: Number((m.margemBruta * 100).toFixed(1)),
    Operacional: Number((m.margemOperacional * 100).toFixed(1)),
    Líquida: Number((m.margemLiquida * 100).toFixed(1)),
  }))
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
          contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 13 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Bruta" fill={INDIGO} radius={[4, 4, 0, 0]} />
        <Bar dataKey="Operacional" fill={SKY} radius={[4, 4, 0, 0]} />
        <Bar dataKey="Líquida" fill={SLATE} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function PrazosChart() {
  const data = METRICS.map((m) => ({
    year: m.year,
    PME: Number(m.pme.toFixed(0)),
    PMR: Number(m.pmr.toFixed(0)),
    PMP: Number(m.pmp.toFixed(0)),
  }))
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickFormatter={(v) => `${v}d`}
        />
        <Tooltip
          formatter={(value) => [`${Number(value)} dias`, '']}
          contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 13 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="PME" name="Estocagem (PME)" fill={INDIGO} radius={[4, 4, 0, 0]} />
        <Bar dataKey="PMR" name="Recebimento (PMR)" fill={SKY} radius={[4, 4, 0, 0]} />
        <Bar dataKey="PMP" name="Pagamento (PMP)" fill={ROSE} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
