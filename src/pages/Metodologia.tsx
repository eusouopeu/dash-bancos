import { METHODOLOGY_NOTES, institutionById } from '../data'
import { PageHeader } from '../layout/PageHeader'

export function Metodologia() {
  return (
    <>
      <PageHeader
        title="Metodologia"
        subtitle="Como os indicadores foram padronizados e suas ressalvas"
      />
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-8 pb-20 lg:px-10 lg:pb-8">
        <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-sm">
          <p>
            As três instituições representam três modelos de propriedade distintos no setor
            bancário brasileiro: o <strong className="text-slate-800">Sicoob</strong> é uma
            cooperativa de crédito (sobras distribuídas aos cooperados, sem acionistas nem
            objetivo de maximizar lucro); o{' '}
            <strong className="text-slate-800">Banco do Brasil</strong> é uma sociedade de
            economia mista (controle da União, capital aberto); o{' '}
            <strong className="text-slate-800">Itaú Unibanco</strong> é um banco privado nacional
            de capital aberto.
          </p>
          <p className="mt-3">
            ROE e ROA são calculados de forma padronizada (lucro líquido ÷ patrimônio líquido;
            lucro líquido ÷ ativos totais, ambos ao final do exercício) para permitir comparação
            direta — os números "oficiais" divulgados por cada instituição usam metodologias
            próprias e podem diferir dos exibidos aqui.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-800">Notas por instituição</h2>
          <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
            {METHODOLOGY_NOTES.map((n, i) => (
              <li key={i} className="flex gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: institutionById(n.institution).color }}
                />
                <span>
                  <span className="font-semibold text-slate-700">
                    {institutionById(n.institution).shortName}:
                  </span>{' '}
                  {n.note}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}
