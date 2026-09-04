import { GENERAL_SOURCES, INSTITUTIONS, SOURCES, YEARS } from '../data'
import { PageHeader } from '../layout/PageHeader'

function SourceList({ items }: { items: { label: string; url: string }[] }) {
  return (
    <ol className="divide-y divide-rule-soft">
      {items.map((s, i) => (
        <li key={i} className="flex gap-3.5 py-2.5 first:pt-0 last:pb-0">
          <span className="tnum mt-0.5 shrink-0 font-mono text-[11px] text-muted">
            {String(i + 1).padStart(2, '0')}
          </span>
          <a
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="text-[13px] leading-relaxed text-ink underline decoration-rule underline-offset-[3px] transition-colors hover:decoration-petrol hover:text-petrol"
          >
            {s.label}
          </a>
        </li>
      ))}
    </ol>
  )
}

export function FontesDeDados() {
  return (
    <>
      <PageHeader
        eyebrow="Rastreabilidade"
        title="Fontes de Dados"
        subtitle="De onde vem cada número deste dashboard"
        meta={`${YEARS[0]}–${YEARS[YEARS.length - 1]} · Sicoob, Banco do Brasil e Itaú Unibanco`}
      />
      <main className="mx-auto max-w-3xl space-y-4 px-6 py-6 pb-24 lg:px-10 lg:pb-8">
        {INSTITUTIONS.map((inst) => {
          const sources = SOURCES.filter((s) => s.institution === inst.id)
          if (sources.length === 0) return null
          return (
            <section key={inst.id} className="overflow-hidden rounded-lg border border-rule bg-surface">
              <span className="block h-[3px]" style={{ backgroundColor: inst.color }} aria-hidden />
              <div className="p-5">
                <div className="mb-4">
                  <p className="eyebrow">{inst.category}</p>
                  <h2 className="mt-1 text-base font-semibold text-ink">{inst.name}</h2>
                </div>
                <SourceList items={sources} />
              </div>
            </section>
          )
        })}

        <section className="rounded-lg border border-rule bg-surface p-5">
          <p className="eyebrow mb-4">Sistema financeiro — dados gerais</p>
          <SourceList items={GENERAL_SOURCES} />
        </section>

        <p className="px-1 pt-2 text-[11px] leading-relaxed text-muted">
          Projeto pessoal de análise financeira, a partir de dados públicos, relatórios anuais e
          Relações com Investidores de cada instituição. Contorno cartográfico do mapa de
          agências:{' '}
          <a
            href="https://github.com/VictorCazanave/svg-maps/tree/master/packages/brazil"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-petrol"
          >
            @svg-maps/brazil
          </a>{' '}
          (CC-BY 4.0, MapSVG).
        </p>
      </main>
    </>
  )
}
