import {
  ArrowPathIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { IndicatorCard } from './components/IndicatorCard'
import { CicloDeCaixaChart, MargensChart, PrazosChart } from './components/ChartSection'
import { PremisesSection } from './components/PremisesSection'
import { LATEST, METRICS } from './data'
import { formatDays, formatPercent } from './format'

function App() {
  const previous = METRICS[METRICS.length - 2]

  const margemBrutaDelta = LATEST.margemBruta - previous.margemBruta
  const margemLiquidaDelta = LATEST.margemLiquida - previous.margemLiquida
  const cicloDelta = LATEST.cicloDeCaixa - previous.cicloDeCaixa
  const giroDelta = LATEST.giroEstoque - previous.giroEstoque

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Dashboard financeiro
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900">Ambev S.A.</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Liquidez, atividade e lucratividade — {METRICS[0].year} a{' '}
            {METRICS[METRICS.length - 1].year}, com dados públicos das Demonstrações
            Financeiras Padronizadas (DFP) enviadas à CVM.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <IndicatorCard
            label="Ciclo de caixa"
            value={formatDays(LATEST.cicloDeCaixa)}
            helpText={`${LATEST.year} — negativo é favorável`}
            icon={ArrowPathIcon}
            trend={{
              deltaLabel: `${cicloDelta >= 0 ? '+' : ''}${cicloDelta.toFixed(0)}d vs. ${previous.year}`,
              direction: cicloDelta >= 0 ? 'up' : 'down',
              positive: cicloDelta <= 0,
            }}
          />
          <IndicatorCard
            label="Giro de estoque"
            value={`${LATEST.giroEstoque.toFixed(2)}x`}
            helpText={`${LATEST.year} — vezes ao ano`}
            icon={BuildingLibraryIcon}
            trend={{
              deltaLabel: `${giroDelta >= 0 ? '+' : ''}${giroDelta.toFixed(2)}x vs. ${previous.year}`,
              direction: giroDelta >= 0 ? 'up' : 'down',
              positive: giroDelta >= 0,
            }}
          />
          <IndicatorCard
            label="Margem bruta"
            value={formatPercent(LATEST.margemBruta)}
            helpText={`${LATEST.year}`}
            icon={ChartBarIcon}
            trend={{
              deltaLabel: `${margemBrutaDelta >= 0 ? '+' : ''}${(margemBrutaDelta * 100).toFixed(1)}pp`,
              direction: margemBrutaDelta >= 0 ? 'up' : 'down',
              positive: margemBrutaDelta >= 0,
            }}
          />
          <IndicatorCard
            label="Margem líquida"
            value={formatPercent(LATEST.margemLiquida)}
            helpText={`${LATEST.year}`}
            icon={BanknotesIcon}
            trend={{
              deltaLabel: `${margemLiquidaDelta >= 0 ? '+' : ''}${(margemLiquidaDelta * 100).toFixed(1)}pp`,
              direction: margemLiquidaDelta >= 0 ? 'up' : 'down',
              positive: margemLiquidaDelta >= 0,
            }}
          />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">
            Ciclo de caixa por ano (dias)
          </h2>
          <p className="mb-2 text-xs text-slate-400">
            Ciclo negativo: a Ambev recebe dos clientes e vende o estoque antes de precisar
            pagar os fornecedores — financia parte da operação com capital de terceiros sem
            custo.
          </p>
          <CicloDeCaixaChart />
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">Margens por ano</h2>
            <p className="mb-2 text-xs text-slate-400">Bruta, operacional e líquida.</p>
            <MargensChart />
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">
              Prazos médios por ano (dias)
            </h2>
            <p className="mb-2 text-xs text-slate-400">Estocagem, recebimento e pagamento.</p>
            <PrazosChart />
          </section>
        </div>

        <PremisesSection />

        <footer className="pb-8 pt-2 text-center text-xs text-slate-400">
          Projeto pessoal de análise financeira — dados públicos, CVM (Dados Abertos, DFP).
        </footer>
      </main>
    </div>
  )
}

export default App
