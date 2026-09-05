import type { Institution, YearData } from '../data'
import { formatBRLBillions, formatNumber } from '../format'

interface InstitutionCardProps {
  institution: Institution
  latest: YearData | undefined
  year: number
  /** Nº de agências/pontos de atendimento — de `NETWORK_SNAPSHOTS`, não varia por exercício. */
  agencias: number
}

export function InstitutionCard({ institution, latest, year, agencias }: InstitutionCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-rule bg-surface @container">
      <span
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ backgroundColor: institution.color }}
        aria-hidden
      />
      <div className="px-4 pb-5 pt-6">
        <div className="min-w-0">
          {/* A cor da instituição fica na régua superior, não no rótulo: em 10px o
              laranja não alcança contraste AA sobre branco. */}
          <p className="eyebrow">{institution.category}</p>
          <p className="mt-1.5 text-lg font-semibold tracking-[-0.01em] text-ink">
            {institution.name}
          </p>
        </div>

        {latest ? (
          <>
            <div className="mt-5">
              <p className="tnum font-mono text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink">
                {formatBRLBillions(latest.ativosTotais)}
              </p>
              <p className="eyebrow mt-2">Ativos totais</p>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-md bg-rule-soft @[288px]:[grid-template-columns:35%_65%]">
              <div className="bg-surface px-3 py-2.5">
                <dt className="eyebrow">Agências</dt>
                <dd className="tnum mt-1 font-mono text-[17px] font-semibold text-ink">
                  {formatNumber(agencias)}
                </dd>
              </div>
              <div className="bg-surface px-3 py-2.5">
                <dt className="eyebrow">Carteira de crédito</dt>
                <dd className="tnum mt-1 font-mono text-[17px] font-semibold text-ink">
                  {formatBRLBillions(latest.carteiraCredito)}
                </dd>
              </div>
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
