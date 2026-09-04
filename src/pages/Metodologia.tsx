import { INSTITUTIONS, METHODOLOGY_NOTES, institutionById } from '../data'
import { PageHeader } from '../layout/PageHeader'

export function Metodologia() {
  return (
    <>
      <PageHeader
        eyebrow="Como ler os números"
        title="Metodologia"
        subtitle="Como os indicadores foram padronizados, e onde eles não são comparáveis"
      />
      <main className="mx-auto max-w-3xl space-y-4 px-6 py-6 pb-24 lg:px-10 lg:pb-8">
        <section className="rounded-lg border border-rule bg-surface p-6">
          <p className="eyebrow mb-4">O recorte</p>
          <ul className="space-y-4">
            {INSTITUTIONS.map((inst) => (
              <li key={inst.id} className="flex gap-3.5">
                <span
                  className="mt-1 w-0.5 shrink-0 rounded-full"
                  style={{ backgroundColor: inst.color }}
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-ink">{inst.name}</p>
                  <p className="text-[13px] leading-relaxed text-muted">{inst.category}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-rule-soft pt-4 text-sm leading-relaxed text-muted">
            As três representam modelos de propriedade distintos: o Sicoob distribui sobras aos
            cooperados e não tem acionistas nem objetivo de maximizar lucro; o Banco do Brasil é
            controlado pela União com capital aberto; o Itaú Unibanco é um banco privado nacional
            de capital aberto. É essa diferença que o dashboard tenta tornar mensurável.
          </p>
        </section>

        <section className="rounded-lg border border-rule bg-surface p-6">
          <p className="eyebrow mb-3">Padronização de ROE e ROA</p>
          <p className="text-sm leading-relaxed text-muted">
            ROE e ROA são recalculados aqui de forma uniforme — lucro líquido ÷ patrimônio líquido
            e lucro líquido ÷ ativos totais, ambos ao final do exercício. Os números "oficiais"
            divulgados por cada instituição usam patrimônio médio e resultados ajustados, e por
            isso costumam ser mais altos do que os exibidos aqui.
          </p>
        </section>

        <section className="rounded-lg border border-rule bg-surface p-6">
          <p className="eyebrow mb-4">Ressalvas por instituição</p>
          <ul className="space-y-4">
            {METHODOLOGY_NOTES.map((n, i) => (
              <li key={i} className="flex gap-3.5">
                <span
                  className="mt-1 w-0.5 shrink-0 rounded-full"
                  style={{ backgroundColor: institutionById(n.institution).color }}
                  aria-hidden
                />
                <p className="text-[13px] leading-relaxed text-muted">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-ink">
                    {institutionById(n.institution).shortName}
                  </span>{' '}
                  {n.note}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}
