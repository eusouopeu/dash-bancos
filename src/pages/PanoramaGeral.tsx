import { useState, type ReactNode } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { InstitutionCard } from '../components/InstitutionCard'
import {
  EficienciaLineChart,
  InadimplenciaLineChart,
  ROALineChart,
  ROELineChart,
  SeriesLegend,
} from '../components/ChartSection'
import { IndicatorComparison, type ComparisonRow } from '../components/IndicatorComparison'
import { PresenceHighlights } from '../components/PresenceHighlights'
import { BrazilPresenceMap } from '../components/BrazilPresenceMap'
import {
  INSTITUTIONS,
  NETWORK_SNAPSHOTS,
  PRESENCE_HIGHLIGHTS,
  RAW_DATA,
  YEARS,
  institutionById,
  tryDataFor,
  type InstitutionId,
} from '../data'
import { formatNumber } from '../format'
import { PageHeader } from '../layout/PageHeader'

const REDE_NOTES: Record<InstitutionId, string> = {
  sicoob: 'Único dos três que divulga número de cooperados; municípios atendidos por BB e Itaú são estimados (ver metodologia).',
  bb: 'Clientes segundo critério do Banco Central (CPF/CNPJ únicos) — não é o número de correntistas que o próprio banco divulga.',
  itau: 'Clientes segundo critério do Banco Central (CPF/CNPJ únicos) — não é o número de correntistas que o próprio banco divulga.',
}

function InstitutionToggle({
  value,
  onChange,
}: {
  value: InstitutionId
  onChange: (id: InstitutionId) => void
}) {
  return (
    <div className="flex overflow-hidden rounded-md border border-rule">
      {(['sicoob', 'bb', 'itau'] as const).map((id) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          aria-pressed={value === id}
          className="px-2.5 py-1 font-mono text-[11px] font-medium transition-colors"
          style={
            value === id
              ? { backgroundColor: institutionById(id).color, color: '#fff' }
              : { color: '#737373' }
          }
        >
          {institutionById(id).shortName}
        </button>
      ))}
    </div>
  )
}

/** Eficiência e inadimplência usam 2024 fixo — é o exercício mais recente com dado do Sicoob para os dois. */
const INDICATORS_YEAR = 2024

function comparisonRowsFor(year: number): ComparisonRow[] {
  return [
    { label: 'ROE — retorno sobre patrimônio líquido', key: 'roe', year, better: 'max' },
    { label: 'ROA — retorno sobre ativos', key: 'roa', year, better: 'max' },
    { label: 'Índice de eficiência', key: 'eficiencia', year: INDICATORS_YEAR, better: 'min' },
    {
      label: 'Inadimplência acima de 90 dias',
      key: 'inadimplencia',
      year: INDICATORS_YEAR,
      better: 'min',
      hint: 'O índice do Sicoob usa o critério de ativos problemáticos (E–H), mais amplo que o de BB e Itaú — os valores não são comparáveis 1:1.',
    },
  ]
}

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
  const [mapInstitution, setMapInstitution] = useState<InstitutionId>('sicoob')
  const [redeInstitution, setRedeInstitution] = useState<InstitutionId>('sicoob')


  const highlights = PRESENCE_HIGHLIGHTS.filter((h) => h.institution === redeInstitution)
  const snapshot = NETWORK_SNAPSHOTS.find((n) => n.institution === mapInstitution)!
  const dataByUF = Object.fromEntries(snapshot.porUF.map((u) => [u.uf, u.count]))

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
              agencias={NETWORK_SNAPSHOTS.find((n) => n.institution === inst.id)!.agencias}
            />
          ))}
        </section>

        <Panel title="Indicadores" note="Barra cheia = melhor desempenho no indicador.">
          <IndicatorComparison rows={comparisonRowsFor(year)} data={RAW_DATA} />
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel
            title="Mapa de presença"
            note={`${formatNumber(snapshot.agencias)} ${snapshot.unitLabel} em ${formatNumber(snapshot.municipios)} municípios · ${snapshot.asOf}, ${snapshot.source}.`}
            action={<InstitutionToggle value={mapInstitution} onChange={setMapInstitution} />}
          >
            <BrazilPresenceMap
              dataByUF={dataByUF}
              color={institutionById(mapInstitution).color}
              unitLabel={snapshot.unitLabel}
            />
          </Panel>

          <Panel
            title="Rede de atendimento"
            note={REDE_NOTES[redeInstitution]}
            action={<InstitutionToggle value={redeInstitution} onChange={setRedeInstitution} />}
          >
            <PresenceHighlights items={highlights} />
          </Panel>
        </div>

        <div>
          <p className="eyebrow mb-3">Séries históricas · {YEARS[0]}–{YEARS[YEARS.length - 1]}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <ChartPanel title="ROA" unit="% ao ano">
              <ROALineChart />
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
          </div>
        </div>
      </main>
    </>
  )
}
