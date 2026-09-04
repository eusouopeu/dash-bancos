import { useState } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { InstitutionCard } from '../components/InstitutionCard'
import {
  EficienciaLineChart,
  LCRLineChart,
  LucroLiquidoLineChart,
  ROALineChart,
  hasLcrData,
} from '../components/ChartSection'
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
import { formatNumber, formatPercent } from '../format'
import { PageHeader } from '../layout/PageHeader'
import { PendingBadge } from '../components/PendingBadge'

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

  return (
    <>
      <PageHeader
        title="Comparativo de Indicadores Financeiros"
        subtitle="Sicoob vs. Banco do Brasil vs. Itaú Unibanco"
        meta={`Dados de ${year} · Fontes: demonstrações financeiras e Relações com Investidores de cada instituição`}
        actions={
          <>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              disabled
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-400 shadow-sm"
              title="Somente granularidade anual disponível nos dados atuais"
            >
              <option>Anual</option>
            </select>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Exportar
              <ArrowDownTrayIcon className="h-4 w-4" />
            </button>
          </>
        }
      />

      <main className="space-y-6 px-6 py-6 pb-20 lg:px-10 lg:pb-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {INSTITUTIONS.map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} latest={tryDataFor(inst.id, year)} year={year} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">Rede de Atendimento — Sicoob</h2>
            <p className="mb-3 text-xs text-slate-400">
              Único dos três com número de municípios atendidos e cooperados divulgado.
            </p>
            <PresenceHighlights items={sicoobHighlights} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-1 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-700">Mapa de Presença por Agências</h2>
              <div className="flex overflow-hidden rounded-lg border border-slate-200 text-[11px] font-semibold">
                {(['bb', 'itau'] as const).map((id) => (
                  <button
                    key={id}
                    onClick={() => setMapInstitution(id)}
                    className="px-2 py-1"
                    style={
                      mapInstitution === id
                        ? { backgroundColor: institutionById(id).color, color: '#fff' }
                        : { color: '#64748b' }
                    }
                  >
                    {institutionById(id).shortName}
                  </button>
                ))}
              </div>
            </div>
            <p className="mb-1 text-xs text-slate-400">
              {formatNumber(snapshot.agencias)} agências em {formatNumber(snapshot.municipios)} municípios (
              {snapshot.asOf}, ESTBAN/Bacen).
            </p>
            <BrazilPresenceMap dataByUF={dataByUF} color={institutionById(mapInstitution).color} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">Agências / Pontos de Atendimento</h2>
            <p className="mb-1 text-xs text-slate-400">
              Datas-base e fontes diferem entre instituições — ver notas abaixo do gráfico.
            </p>
            <AgenciasComparisonChart data={AGENCIAS_DATA} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">Evolução do Lucro Líquido (R$ bilhões)</h2>
            <LucroLiquidoLineChart />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">Índice de Eficiência</h2>
            <EficienciaLineChart />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">ROA</h2>
            <ROALineChart />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">LCR</h2>
            {showLcr ? (
              <LCRLineChart />
            ) : (
              <div className="flex h-[240px] flex-col items-center justify-center gap-2 text-center">
                <PendingBadge text="Aguardando dados públicos" />
                <p className="max-w-[200px] text-xs text-slate-400">
                  Índice de Liquidez de Curto Prazo — a incluir assim que localizado com fonte confiável.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Indicadores Selecionados — {year}</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-2 pr-4 font-medium">Indicador</th>
                  {INSTITUTIONS.map((inst) => (
                    <th key={inst.id} className="py-2 pr-4 font-medium" style={{ color: inst.color }}>
                      {inst.shortName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'ROE (%)', key: 'roe' as const },
                  { label: 'ROA (%)', key: 'roa' as const },
                  { label: 'Índice de Eficiência (%)', key: 'eficiencia' as const },
                  { label: 'Inadimplência > 90 dias (%)', key: 'inadimplencia' as const },
                ].map((row) => (
                  <tr key={row.key} className="border-b border-slate-100 text-slate-700 last:border-0">
                    <td className="py-2 pr-4 text-slate-500">{row.label}</td>
                    {INSTITUTIONS.map((inst) => {
                      const d = rows.find((r) => r.institution === inst.id)
                      const value = d?.[row.key]
                      return (
                        <td key={inst.id} className="py-2 pr-4 font-semibold">
                          {value === undefined ? '—' : formatPercent(value)}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="pb-8 pt-2 text-center text-xs text-slate-400">
          Os dados apresentados são referentes às demonstrações financeiras de {year} das
          instituições. Mapa de agências: ESTBAN (Bacen), jan/2026 — ver{' '}
          <a href="#/fontes-de-dados" className="underline">
            fontes de dados
          </a>
          . Contorno cartográfico:{' '}
          <a
            href="https://github.com/VictorCazanave/svg-maps/tree/master/packages/brazil"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            @svg-maps/brazil
          </a>{' '}
          (CC-BY 4.0, MapSVG).
        </footer>
      </main>
    </>
  )
}
