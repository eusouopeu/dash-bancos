import { RAW_DATA } from '../data'
import { formatBRLCompact } from '../format'

export function PremisesSection() {
  const rows = RAW_DATA.filter((d) => d.year >= 2020)
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-1 text-sm font-semibold text-slate-700">Premissas e fonte dos dados</h3>
      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        Dados extraídos das Demonstrações Financeiras Padronizadas (DFP) consolidadas da
        AMBEV S.A. (CD_CVM 023264), disponíveis no{' '}
        <a
          href="https://dados.cvm.gov.br/dataset/cia_aberta-doc-dfp"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-indigo-600 hover:underline"
        >
          Portal de Dados Abertos da CVM
        </a>
        . Prazos médios calculados sobre saldos médios (saldo inicial + saldo final / 2) e ano
        comercial de 360 dias, seguindo a mesma metodologia usada na análise do Grupo
        Guararapes. Necessidade de Capital de Giro (NCG) obtida convertendo o ciclo de caixa
        (em dias) para reais, à razão da receita líquida diária do ano.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-4 font-medium">Ano</th>
              <th className="py-2 pr-4 font-medium">Receita líquida</th>
              <th className="py-2 pr-4 font-medium">Estoques</th>
              <th className="py-2 pr-4 font-medium">Contas a receber</th>
              <th className="py-2 pr-4 font-medium">Fornecedores</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.year} className="border-b border-slate-100 text-slate-700">
                <td className="py-2 pr-4 font-medium">{r.year}</td>
                <td className="py-2 pr-4">{formatBRLCompact(r.receitaLiquida)}</td>
                <td className="py-2 pr-4">{formatBRLCompact(r.estoques)}</td>
                <td className="py-2 pr-4">{formatBRLCompact(r.contasReceber)}</td>
                <td className="py-2 pr-4">{formatBRLCompact(r.fornecedores)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
