import type { Institution, InstitutionId, YearData } from '../data'
import { formatBRLBillions, formatPercent } from '../format'

const FEATURED: InstitutionId = 'sicoob'

interface InstitutionCardProps {
  institution: Institution
  latest: YearData | undefined
  year: number
}

export function InstitutionCard({ institution, latest, year }: InstitutionCardProps) {
  const featured = institution.id === FEATURED

  return (
    <div className="relative overflow-hidden rounded-lg border border-rule bg-surface">
      <span
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ backgroundColor: institution.color }}
        aria-hidden
      />
      <div className="p-5 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {/* A cor da instituição fica na régua superior, não no rótulo: em 10px o
                laranja não alcança contraste AA sobre branco. */}
            <p className="eyebrow">{institution.category}</p>
            <p className="mt-1.5 text-lg font-semibold tracking-[-0.01em] text-ink">
              {institution.name}
            </p>
          </div>
          {featured && (
            <span className="shrink-0 rounded-full bg-petrol-soft px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-petrol">
              Destaque
            </span>
          )}
        </div>

        {latest ? (
          <>
            <div className="mt-5">
              <p className="tnum font-mono text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink">
                {formatBRLBillions(latest.ativosTotais)}
              </p>
              <p className="eyebrow mt-2">Ativos totais</p>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-rule-soft">
              {[
                { label: 'ROE', value: latest.roe },
                { label: 'ROA', value: latest.roa },
              ].map((m) => (
                <div key={m.label} className="bg-surface px-3 py-2.5">
                  <dt className="eyebrow">{m.label}</dt>
                  <dd className="tnum mt-1 font-mono text-[17px] font-semibold text-ink">
                    {formatPercent(m.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <p className="mt-5 border-t border-rule-soft pt-4 text-xs leading-relaxed text-muted">
            Sem dado de fechamento auditado para {year} — ver metodologia.
          </p>
        )}
      </div>
    </div>
  )
}
