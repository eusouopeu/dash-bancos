import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CONCORRENTES } from '../concorrentes'
import { LATEST } from '../data'
import { PendingBadge } from './PendingBadge'

const INDIGO = '#4f46e5'
const SLATE = '#94a3b8'

export function BenchmarkingSection() {
  const linhas = [
    { empresa: 'Ambev', cicloDeCaixa: LATEST.cicloDeCaixa },
    ...CONCORRENTES.filter((c) => c.year === LATEST.year && c.cicloDeCaixa !== null).map((c) => ({
      empresa: c.empresa,
      cicloDeCaixa: c.cicloDeCaixa as number,
    })),
  ]
  const temConcorrentes = linhas.length > 1

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Comparação setorial — ciclo de caixa ({LATEST.year})
      </h2>
      <p className="mb-4 mt-1 text-xs text-slate-400 dark:text-slate-500">
        Contextualiza o ciclo de caixa da Ambev frente a concorrentes diretos do setor de
        bebidas.
      </p>

      {temConcorrentes ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={linhas} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="empresa" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `${v}d`} />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(1)} dias`, 'Ciclo de caixa']} />
            <Bar
              dataKey="cicloDeCaixa"
              radius={[6, 6, 0, 0]}
              fill={INDIGO}
              // destaca a barra da própria Ambev
              shape={(props: any) => (
                <rect
                  {...props}
                  fill={props.payload.empresa === 'Ambev' ? INDIGO : SLATE}
                  rx={6}
                  ry={6}
                />
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-600">
          <PendingBadge text="Dados de concorrentes pendentes" />
          <p className="max-w-md text-xs text-slate-400 dark:text-slate-500">
            Adicione 1–2 concorrentes diretos (ex.: Heineken Brasil, Coca-Cola FEMSA) em{' '}
            <code>src/concorrentes.ts</code> para comparar ciclo de caixa, giro de estoque e
            margem líquida lado a lado com a Ambev.
          </p>
        </div>
      )}
    </section>
  )
}
