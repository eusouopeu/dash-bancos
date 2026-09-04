import { REFERENCES, REFERENCE_GROUPS, YEARS, type Reference } from '../data'
import { PageHeader } from '../layout/PageHeader'

/**
 * Uma referência ABNT NBR 6023:2018: autoria em caixa alta, elemento de destaque em
 * negrito, imprenta, endereço eletrônico e data de acesso, nessa ordem.
 */
function ReferenceEntry({ item }: { item: Reference }) {
  return (
    <li className="border-l-2 border-rule pl-4 transition-colors hover:border-petrol">
      <p className="text-[13px] leading-relaxed text-ink">
        {item.author && <>{item.author} </>}
        {item.before && <>{item.before} </>}
        <strong className="font-semibold">{item.emphasis}</strong>
        {item.after} Disponível em:{' '}
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="break-all text-petrol underline decoration-petrol/40 underline-offset-[3px] transition-colors hover:decoration-petrol"
        >
          {item.url}
        </a>
        . Acesso em: {item.accessedAt}.
      </p>
      {item.note && (
        <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-muted">{item.note}</p>
      )}
    </li>
  )
}

export function FontesDeDados() {
  return (
    <>
      <PageHeader
        eyebrow="Rastreabilidade"
        title="Fontes de Dados"
        subtitle="De onde vem cada número deste painel"
        meta={`${YEARS[0]}–${YEARS[YEARS.length - 1]} · Sicoob, Banco do Brasil e Itaú Unibanco`}
      />
      <main className="mx-auto max-w-4xl space-y-10 px-6 py-8 pb-24 lg:px-10 lg:pb-10">
        <header className="border-l-2 border-ink pl-4">
          <h2 className="text-lg font-bold tracking-[-0.015em] text-ink">Fontes de dados</h2>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-muted">
            Todo número deste painel vem de um dos documentos abaixo. As referências seguem a ABNT
            NBR 6023:2018 e estão agrupadas pela instituição de origem.
          </p>
        </header>

        {REFERENCE_GROUPS.map((group) => {
          const items = REFERENCES.filter((r) => r.group === group.id)
          if (items.length === 0) return null
          return (
            <section key={group.id} className="space-y-4">
              <div>
                <p className="eyebrow">{group.title}</p>
                <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted">
                  {group.intro}
                </p>
              </div>
              <ul className="space-y-5 rounded-lg border border-rule bg-surface p-5">
                {items.map((item) => (
                  <ReferenceEntry key={item.url + item.emphasis} item={item} />
                ))}
              </ul>
            </section>
          )
        })}

        <p className="px-1 text-[11px] leading-relaxed text-muted">
          Projeto pessoal de análise financeira, construído a partir de dados públicos. Onde uma
          notícia é usada como referência, ela reproduz o release oficial da instituição — a fonte
          primária correspondente também está listada acima sempre que foi possível localizá-la.
        </p>
      </main>
    </>
  )
}
