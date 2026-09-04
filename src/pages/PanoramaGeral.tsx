import { useState, type ReactNode } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { InstitutionCard } from '../components/InstitutionCard'
import {
  EficienciaLineChart,
  InadimplenciaLineChart,
  LCRLineChart,
  LucroLiquidoLineChart,
  ROELineChart,
  SeriesLegend,
  coverageGaps,
  hasLcrData,
} from '../components/ChartSection'
import { IndicatorComparison, type ComparisonRow } from '../components/IndicatorComparison'
import { PresenceHighlights } from '../components/PresenceHighlights'
import { AgenciasComparisonChart } from '../components/AgenciasComparisonChart'
import { BrazilPresenceMap } from '../components/BrazilPresenceMap'
import {
  AGENCIAS_DATA,
  INSTITUTIONS,
  NETWORK_SNAPSHOTS,
  PRESENCE_HIGHLIGHTS,
  RAW_DATA,
  YEARS,
  institutionById,
  tryDataFor,
} from '../data'
import { formatNumber } from '../format'
import { PageHeader } from '../layout/PageHeader'
import { PendingBadge } from '../components/PendingBadge'

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: 'ROE — retorno sobre patrimônio líquido', key: 'roe', better: 'max' },
  { label: 'ROA — retorno sobre ativos', key: 'roa', better: 'max' },
  { label: 'Índice de eficiência', key: 'eficiencia', better: 'min' },
  {
    label: 'Inadimplência acima de 90 dias',
    key: 'inadimplencia',
    better: 'min',
    hint: 'O índice do Sicoob usa o critério de ativos problemáticos (E–H), mais amplo que o de BB e Itaú — os valores não são comparáveis 1:1.',
  },
]

function Panel({
  title,
  note,
  children,
  className = '',
  action,
}: {
  title: string
  note?: string
  children: ReactNode
  className?: string
  action?: ReactNode
}) {
  return (
    <section className={`rounded-lg border border-rule bg-surface p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
          {note && <p className="mt-1 text-[11px] leading-relaxed text-muted">{note}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  )
}

function ChartPanel({ title, unit, children }: { title: string; unit: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-rule bg-surface p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
        <span className="eyebrow shrink-0">{unit}</span>
      </div>
      <SeriesLegend />
      {children}
    </section>
  )
}

export function PanoramaGeral() {
  const [year, setYear] = useState<number>(YEARS[YEARS.length - 1])
  const [mapInstitution, setMapInstitution] = useState<'bb' | 'itau'>('bb')

  const rows = [...RAW_DATA]
    .filter((r) => r.year === year)
    .sort(
      (a, b) =>
        INSTITUTIONS.findIndex((i) => i.id === a.institution) -
        INSTITUTIONS.findIndex((i) => i.id === b.institution),
    )

  const sicoobHighlights = PRESENCE_HIGHLIGHTS.filter((h) => h.institution === 'sicoob')
  const snapshot = NETWORK_SNAPSHOTS.find((n) => n.institution === mapInstitution)!
  const dataByUF = Object.fromEntries(snapshot.porUF.map((u) => [u.uf, u.count]))
  const showLcr = hasLcrData()
  const lcrGaps = coverageGaps('lcr')
  const latestYear = YEARS[YEARS.length - 1]

  return (
    <>
      <PageHeader
        eyebrow={`Exercício ${year}`}
        title="Comparativo de Indicadores Financeiros"
        subtitle="Sicoob, Banco do Brasil e Itaú Unibanco — três modelos de propriedade, os mesmos indicadores"
        actions={
          <>
            <label className="sr-only" htmlFor="ano">
              Exercício
            </label>
            <select
              id="ano"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="tnum rounded-md border border-rule bg-surface px-3 py-2 font-mono text-sm font-medium text-ink"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-md bg-petrol px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#066b76]"
            >
              Exportar
              <ArrowDownTrayIcon className="h-4 w-4" />
            </button>
          </>
        }
      />

      <main className="space-y-5 px-6 py-6 pb-24 lg:px-10 lg:pb-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {INSTITUTIONS.map((inst) => (
            <InstitutionCard
              key={inst.id}
              institution={inst}
              latest={tryDataFor(inst.id, year)}
              year={year}
            />
          ))}
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel
            title={`Como as três se comparam em ${year}`}
            note="Barra cheia = melhor desempenho no indicador."
            className="lg:col-span-2"
          >
            <IndicatorComparison rows={COMPARISON_ROWS} data={rows} />
          </Panel>

          <Panel
            title="Rede de atendimento — Sicoob"
            note="Único dos três que divulga municípios atendidos e número de cooperados."
            className="self-start"
          >
            <PresenceHighlights items={sicoobHighlights} />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel
            title="Mapa de presença por agências"
            note={`${formatNumber(snapshot.agencias)} agências em ${formatNumber(snapshot.municipios)} municípios · ${snapshot.asOf}, ESTBAN/Bacen.`}
            action={
              <div className="flex overflow-hidden rounded-md border border-rule">
                {(['bb', 'itau'] as const).map((id) => (
                  <button
                    key={id}
                    onClick={() => setMapInstitution(id)}
                    aria-pressed={mapInstitution === id}
                    className="px-2.5 py-1 font-mono text-[11px] font-medium transition-colors"
                    style={
                      mapInstitution === id
                        ? { backgroundColor: institutionById(id).color, color: '#fff' }
                        : { color: '#737373' }
                    }
                  >
                    {institutionById(id).shortName}
                  </button>
                ))}
              </div>
            }
          >
            <BrazilPresenceMap
              dataByUF={dataByUF}
              color={institutionById(mapInstitution).color}
            />
          </Panel>

          <Panel
            title="Agências e pontos de atendimento"
            note="As datas-base diferem entre instituições — ver notas abaixo."
          >
            <AgenciasComparisonChart data={AGENCIAS_DATA} />
          </Panel>
        </div>

        <div>
          <p className="eyebrow mb-3">Séries históricas · {YEARS[0]}–{YEARS[YEARS.length - 1]}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <ChartPanel title="Lucro líquido" unit="R$ bilhões">
              <LucroLiquidoLineChart />
            </ChartPanel>
            <ChartPanel title="ROE" unit="% ao ano">
              <ROELineChart />
            </ChartPanel>
            <ChartPanel title="Índice de eficiência" unit="% — menor é melhor">
              <EficienciaLineChart />
            </ChartPanel>
            <ChartPanel title="Inadimplência > 90 dias" unit="% da carteira">
              <InadimplenciaLineChart />
            </ChartPanel>
            <ChartPanel title="LCR" unit="% — liquidez de curto prazo">
              {showLcr ? (
                <>
                  <LCRLineChart />
                  <p className="mt-2.5 text-[11px] leading-relaxed text-muted">
                    {lcrGaps.never.length > 0 && (
                      <>O {lcrGaps.never.join(' e o ')} não divulga LCR. </>
                    )}
                    {lcrGaps.latestOnly.length > 0 && (
                      <>
                        {lcrGaps.latestOnly.join(' e ')} ainda não publicaram o de {latestYear}.
                      </>
                    )}
                  </p>
                </>
              ) : (
                <div className="flex h-[210px] flex-col items-center justify-center gap-2.5 text-center">
                  <PendingBadge text="Aguardando dados" />
                  <p className="max-w-[220px] text-[11px] leading-relaxed text-muted">
                    A incluir assim que localizado em fonte primária.
                  </p>
                </div>
              )}
            </ChartPanel>
          </div>
        </div>
      </main>
    </>
  )
}
