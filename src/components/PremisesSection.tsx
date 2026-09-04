import { INSTITUTIONS, METHODOLOGY_NOTES, RAW_DATA, SOURCES, YEARS, institutionById } from '../data'
import { formatBRLBillions, formatPercent } from '../format'

export function PremisesSection() {
  const rows = [...RAW_DATA].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    return INSTITUTIONS.findIndex((i) => i.id === a.institution) -
      INSTITUTIONS.findIndex((i) => i.id === b.institution)
  })

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="mb-1 text-sm font-semibold text-slate-700">Dados por instituição e ano</h3>
        <p className="text-xs leading-relaxed text-slate-500">
          Valores consolidados conforme reportados por cada instituição — ver fontes abaixo.
          R$ milhões, exceto percentuais.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-4 font-medium">Instituição</th>
              <th className="py-2 pr-4 font-medium">Ano</th>
              <th className="py-2 pr-4 font-medium">Lucro líquido</th>
              <th className="py-2 pr-4 font-medium">Patrimônio líquido</th>
              <th className="py-2 pr-4 font-medium">Ativos totais</th>
              <th className="py-2 pr-4 font-medium">Carteira de crédito</th>
              <th className="py-2 pr-4 font-medium">ROE</th>
              <th className="py-2 pr-4 font-medium">ROA</th>
              <th className="py-2 pr-4 font-medium">Basileia</th>
              <th className="py-2 pr-4 font-medium">Eficiência</th>
              <th className="py-2 pr-4 font-medium">Inadimplência</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const inst = institutionById(r.institution)
              return (
                <tr key={`${r.institution}-${r.year}`} className="border-b border-slate-100 text-slate-700">
                  <td className="py-2 pr-4 font-medium">
                    <span
                      className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
                      style={{ backgroundColor: inst.color }}
                    />
                    {inst.shortName}
                  </td>
                  <td className="py-2 pr-4">{r.year}</td>
                  <td className="py-2 pr-4">{formatBRLBillions(r.lucroLiquido)}</td>
                  <td className="py-2 pr-4">{formatBRLBillions(r.patrimonioLiquido)}</td>
                  <td className="py-2 pr-4">{formatBRLBillions(r.ativosTotais)}</td>
                  <td className="py-2 pr-4">{formatBRLBillions(r.carteiraCredito)}</td>
                  <td className="py-2 pr-4">{formatPercent(r.roe)}</td>
                  <td className="py-2 pr-4">{formatPercent(r.roa)}</td>
                  <td className="py-2 pr-4">{formatPercent(r.basileia)}</td>
                  <td className="py-2 pr-4">{formatPercent(r.eficiencia)}</td>
                  <td className="py-2 pr-4">{formatPercent(r.inadimplencia)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-slate-700">Notas metodológicas</h3>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-500">
          {METHODOLOGY_NOTES.map((n, i) => (
            <li key={i}>
              <span className="font-medium text-slate-600">{institutionById(n.institution).shortName}:</span>{' '}
              {n.note}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-slate-700">Fontes ({YEARS[0]}–{YEARS[YEARS.length - 1]})</h3>
        <ul className="space-y-1 text-xs leading-relaxed text-slate-500">
          {SOURCES.map((s, i) => (
            <li key={i}>
              <span className="font-medium text-slate-600">{institutionById(s.institution).shortName}:</span>{' '}
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-indigo-600 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
