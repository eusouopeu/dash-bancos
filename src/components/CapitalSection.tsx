import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { IndicatorCard } from './IndicatorCard'
import { LATEST } from '../data'
import { formatPercent } from '../format'

function formatRatio(v: number | null): string {
  return v === null ? '—' : `${v.toFixed(2)}x`
}

function DuPontChip({
  label,
  value,
  pending,
  emphasis,
}: {
  label: string
  value: string
  pending?: boolean
  emphasis?: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 ${
        emphasis
          ? 'bg-indigo-50 dark:bg-indigo-500/10'
          : 'bg-slate-50 dark:bg-slate-900/40'
      }`}
    >
      <span
        className={`text-base font-bold ${
          pending
            ? 'text-slate-400 dark:text-slate-500'
            : emphasis
              ? 'text-indigo-700 dark:text-indigo-300'
              : 'text-slate-900 dark:text-white'
        }`}
      >
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</span>
    </div>
  )
}

export function CapitalSection() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Rentabilidade sobre capital e estrutura de capital
      </h2>
      <p className="mb-4 mt-1 text-xs text-slate-400 dark:text-slate-500">
        ROE, ROA, ROIC e os indicadores de endividamento dependem de Patrimônio Líquido, Ativo
        Total e dados de dívida ainda não preenchidos em <code>src/data.ts</code> (marcados como{' '}
        <code>TODO</code>). Assim que os valores da CVM/Release de Resultados forem adicionados,
        os cards abaixo passam a exibir os números automaticamente.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <IndicatorCard
          label="ROE"
          value={LATEST.roe === null ? '—' : formatPercent(LATEST.roe)}
          helpText={`${LATEST.year} — lucro líquido / PL médio`}
          icon={ArrowTrendingUpIcon}
          pending={LATEST.roe === null}
        />
        <IndicatorCard
          label="ROA"
          value={LATEST.roa === null ? '—' : formatPercent(LATEST.roa)}
          helpText={`${LATEST.year} — lucro líquido / ativo médio`}
          icon={ScaleIcon}
          pending={LATEST.roa === null}
        />
        <IndicatorCard
          label="ROIC (aprox.)"
          value={LATEST.roic === null ? '—' : formatPercent(LATEST.roic)}
          helpText={`${LATEST.year} — EBIT / capital investido, pré-imposto`}
          icon={BanknotesIcon}
          pending={LATEST.roic === null}
        />
        <IndicatorCard
          label="Dívida líq. / EBITDA"
          value={formatRatio(LATEST.dividaLiquidaSobreEbitda)}
          helpText={`${LATEST.year}`}
          icon={ReceiptPercentIcon}
          pending={LATEST.dividaLiquidaSobreEbitda === null}
        />
        <IndicatorCard
          label="Cobertura de juros"
          value={formatRatio(LATEST.coberturaJuros)}
          helpText={`${LATEST.year} — EBIT / despesa financeira`}
          icon={ShieldCheckIcon}
          pending={LATEST.coberturaJuros === null}
        />
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-700">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Decomposição DuPont do ROE ({LATEST.year})
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <DuPontChip label="Margem líquida" value={formatPercent(LATEST.margemLiquida)} />
          <span className="text-slate-300 dark:text-slate-600">×</span>
          <DuPontChip
            label="Giro do ativo"
            value={LATEST.giroAtivo === null ? '—' : `${LATEST.giroAtivo.toFixed(2)}x`}
            pending={LATEST.giroAtivo === null}
          />
          <span className="text-slate-300 dark:text-slate-600">×</span>
          <DuPontChip
            label="Alavancagem"
            value={LATEST.alavancagemFinanceira === null ? '—' : `${LATEST.alavancagemFinanceira.toFixed(2)}x`}
            pending={LATEST.alavancagemFinanceira === null}
          />
          <span className="text-slate-300 dark:text-slate-600">=</span>
          <DuPontChip
            label="ROE"
            value={LATEST.roe === null ? '—' : formatPercent(LATEST.roe)}
            pending={LATEST.roe === null}
            emphasis
          />
        </div>
      </div>
    </section>
  )
}
