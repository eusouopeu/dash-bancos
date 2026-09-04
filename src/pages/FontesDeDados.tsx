import { GENERAL_SOURCES, INSTITUTIONS, SOURCES, YEARS } from '../data'
import { PageHeader } from '../layout/PageHeader'

export function FontesDeDados() {
  return (
    <>
      <PageHeader
        title="Fontes de Dados"
        subtitle="De onde vem cada número deste dashboard"
        meta={`Dados de ${YEARS[0]}–${YEARS[YEARS.length - 1]} · Sicoob, Banco do Brasil e Itaú Unibanco`}
      />
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-8 pb-20 lg:px-10 lg:pb-8">
        {INSTITUTIONS.map((inst) => {
          const sources = SOURCES.filter((s) => s.institution === inst.id)
          if (sources.length === 0) return null
          return (
            <section
              key={inst.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              style={{ borderTopWidth: 3, borderTopColor: inst.color }}
            >
              <h2 className="mb-3 text-sm font-semibold text-slate-800">{inst.name}</h2>
              <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
                {sources.map((s, i) => (
                  <li key={i}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-emerald-700 hover:underline"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-800">Sistema financeiro (dados gerais)</h2>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
            {GENERAL_SOURCES.map((s, i) => (
              <li key={i}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-emerald-700 hover:underline"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <p className="pb-8 pt-2 text-center text-xs text-slate-400">
          Projeto pessoal de análise financeira — dados públicos, relatórios anuais e Relações com
          Investidores de cada instituição.
        </p>
      </main>
    </>
  )
}
