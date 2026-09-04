import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { IndicatorCard } from './components/IndicatorCard'
import { InstitutionCard } from './components/InstitutionCard'
import {
  AtivosTotaisChart,
  BasileiaChart,
  EficienciaChart,
  InadimplenciaChart,
  ROAChart,
  ROEChart,
} from './components/ChartSection'
import { PremisesSection } from './components/PremisesSection'
import { INSTITUTIONS, LATEST_YEAR, PREVIOUS_YEAR, YEARS, bestByIndicator, dataFor } from './data'
import { formatPercent } from './format'

function App() {
  const maiorROE = bestByIndicator(LATEST_YEAR, 'roe', 'max')
  const maiorBasileia = bestByIndicator(LATEST_YEAR, 'basileia', 'max')
  const menorEficiencia = bestByIndicator(LATEST_YEAR, 'eficiencia', 'min')
  const menorInadimplencia = bestByIndicator(LATEST_YEAR, 'inadimplencia', 'min')

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Dashboard financeiro
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
            Sicoob, Banco do Brasil e Itaú Unibanco
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Rentabilidade, solidez e eficiência — {YEARS[0]} e {LATEST_YEAR}, comparando três
            modelos de propriedade no setor bancário brasileiro: cooperativa de crédito,
            sociedade de economia mista e banco privado nacional.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {INSTITUTIONS.map((inst) => (
              <span key={inst.id} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: inst.color }}
                />
                <span className="font-medium text-slate-700">{inst.name}</span>
                <span className="text-slate-400">— {inst.category}</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {INSTITUTIONS.map((inst) => (
            <InstitutionCard
              key={inst.id}
              institution={inst}
              latest={dataFor(inst.id, LATEST_YEAR)}
              previous={dataFor(inst.id, PREVIOUS_YEAR)}
            />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <IndicatorCard
            label="Maior ROE"
            value={formatPercent(maiorROE.value)}
            helpText={`${maiorROE.institution.shortName} — ${LATEST_YEAR}`}
            icon={ChartBarIcon}
          />
          <IndicatorCard
            label="Maior índice de Basileia"
            value={formatPercent(maiorBasileia.value)}
            helpText={`${maiorBasileia.institution.shortName} — ${LATEST_YEAR}`}
            icon={ShieldCheckIcon}
          />
          <IndicatorCard
            label="Melhor índice de eficiência"
            value={formatPercent(menorEficiencia.value)}
            helpText={`${menorEficiencia.institution.shortName} — ${LATEST_YEAR} (menor é melhor)`}
            icon={ScaleIcon}
          />
          <IndicatorCard
            label="Menor inadimplência"
            value={formatPercent(menorInadimplencia.value)}
            helpText={`${menorInadimplencia.institution.shortName} — ${LATEST_YEAR}`}
            icon={ExclamationTriangleIcon}
          />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">ROE por ano (%)</h2>
          <p className="mb-2 text-xs text-slate-400">
            Retorno sobre o patrimônio líquido — quanto cada instituição gera de resultado sobre
            o capital próprio (ou, no caso do Sicoob, sobre o capital dos cooperados).
          </p>
          <ROEChart />
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">ROA por ano (%)</h2>
            <p className="mb-2 text-xs text-slate-400">Retorno sobre os ativos totais.</p>
            <ROAChart />
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">Índice de Basileia (%)</h2>
            <p className="mb-2 text-xs text-slate-400">
              Solidez de capital — mínimo regulatório de 11% no período.
            </p>
            <BasileiaChart />
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">Índice de eficiência (%)</h2>
            <p className="mb-2 text-xs text-slate-400">Despesas sobre receitas — menor é melhor.</p>
            <EficienciaChart />
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">Inadimplência (%)</h2>
            <p className="mb-2 text-xs text-slate-400">Qualidade da carteira de crédito.</p>
            <InadimplenciaChart />
          </section>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">Ativos totais por ano (R$ bi)</h2>
          <p className="mb-2 text-xs text-slate-400">
            Porte de cada instituição — o Sicoob é, em ativos, uma fração dos dois bancos, embora
            lidere em número de pontos de atendimento no país.
          </p>
          <AtivosTotaisChart />
        </section>

        <PremisesSection />

        <footer className="pb-8 pt-2 text-center text-xs text-slate-400">
          Projeto pessoal de análise financeira — dados públicos, relatórios anuais e Relações
          com Investidores de cada instituição.
        </footer>
      </main>
    </div>
  )
}

export default App
