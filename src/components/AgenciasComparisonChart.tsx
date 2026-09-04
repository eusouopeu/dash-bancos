import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { INSTITUTIONS, type AgenciasEntry, institutionById } from '../data'
import { formatNumber } from '../format'

interface AgenciasComparisonChartProps {
  data: AgenciasEntry[]
}

export function AgenciasComparisonChart({ data }: AgenciasComparisonChartProps) {
  const ordered = INSTITUTIONS.map((inst) => data.find((d) => d.institution === inst.id)).filter(
    (d): d is AgenciasEntry => Boolean(d),
  )
  const chartData = ordered.map((d) => ({
    name: institutionById(d.institution).shortName,
    count: d.count,
    asOf: d.asOf,
    institution: d.institution,
  }))

  return (
    <div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
          <YAxis hide />
          <Tooltip
            formatter={(value, _name, item) => [
              `${formatNumber(Number(value))} (${item.payload.asOf})`,
              'Agências/PAs',
            ]}
            contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 12 }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.institution} fill={institutionById(entry.institution).color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <ul className="mt-2 space-y-0.5 text-[10px] text-slate-400">
        {ordered.map((d) => (
          <li key={d.institution}>
            <span className="font-medium text-slate-500">{institutionById(d.institution).shortName}:</span>{' '}
            {d.note}
          </li>
        ))}
      </ul>
    </div>
  )
}
