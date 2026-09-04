/**
 * Fontes: Relatório Anual e Relatório da Administração do Sicoob; releases de
 * resultados e Relações com Investidores do Banco do Brasil e do Itaú
 * Unibanco; ITR/DFP das duas companhias abertas na CVM; notícias
 * especializadas (Exame, Agência Brasil, CNN Brasil, XP) que reproduzem os
 * releases oficiais. Ver `SOURCES` para a URL de cada valor.
 *
 * As três instituições representam três modelos de propriedade distintos no
 * setor bancário brasileiro: Sicoob é uma cooperativa de crédito (sobras
 * distribuídas aos cooperados, sem acionistas nem objetivo de maximizar
 * lucro); Banco do Brasil é uma sociedade de economia mista (controle da
 * União, capital aberto); Itaú Unibanco é um banco privado nacional de
 * capital aberto. Valores em R$ milhões, conforme reportado por cada
 * instituição.
 *
 * ROE e ROA são calculados aqui de forma padronizada (lucro líquido ÷
 * patrimônio líquido; lucro líquido ÷ ativos totais, ambos ao final do
 * exercício) para permitir comparação direta — os números "oficiais"
 * divulgados por cada instituição usam metodologias próprias e podem
 * diferir. Ver `METHODOLOGY_NOTES` para essa e outras ressalvas (ex.:
 * definição de inadimplência).
 */

export type InstitutionId = 'sicoob' | 'bb' | 'itau'

export interface Institution {
  id: InstitutionId
  name: string
  shortName: string
  category: string
  color: string
}

export const INSTITUTIONS: Institution[] = [
  {
    id: 'sicoob',
    name: 'Sicoob',
    shortName: 'Sicoob',
    category: 'Cooperativa de crédito',
    color: '#2a78d6',
  },
  {
    id: 'bb',
    name: 'Banco do Brasil',
    shortName: 'BB',
    category: 'Sociedade de economia mista',
    color: '#eb6834',
  },
  {
    id: 'itau',
    name: 'Itaú Unibanco',
    shortName: 'Itaú',
    category: 'Banco privado nacional',
    color: '#1baf7a',
  },
]

export function institutionById(id: InstitutionId): Institution {
  const found = INSTITUTIONS.find((i) => i.id === id)
  if (!found) throw new Error(`Instituição ${id} não encontrada`)
  return found
}

export interface RawYearData {
  institution: InstitutionId
  year: number
  /** R$ milhões — lucro líquido ("ajustado"/"recorrente" para BB/Itaú; sobras líquidas combinadas para o Sicoob) */
  lucroLiquido: number
  /** R$ milhões, ao final do exercício */
  patrimonioLiquido: number
  /** R$ milhões, ao final do exercício */
  ativosTotais: number
  /** R$ milhões, ao final do exercício */
  carteiraCredito: number
  /** decimal — índice de Basileia (aglutinado, no caso do Sicoob) */
  basileia: number
  /** decimal — despesas sobre receitas (menor é melhor) */
  eficiencia: number
  /** decimal — carteira vencida > 90 dias (BB/Itaú) ou índice de ativos problemáticos E-H (Sicoob, não comparável 1:1) */
  inadimplencia: number
}

export const RAW_DATA_INPUT: RawYearData[] = [
  {
    institution: 'sicoob',
    year: 2023,
    lucroLiquido: 8_300,
    patrimonioLiquido: 46_000,
    ativosTotais: 298_400,
    carteiraCredito: 168_200,
    basileia: 0.17,
    eficiencia: 0.271,
    inadimplencia: 0.06,
  },
  {
    institution: 'sicoob',
    year: 2024,
    lucroLiquido: 8_300,
    patrimonioLiquido: 54_400,
    ativosTotais: 359_700,
    carteiraCredito: 194_000,
    basileia: 0.186,
    eficiencia: 0.271,
    inadimplencia: 0.072,
  },
  {
    institution: 'bb',
    year: 2023,
    lucroLiquido: 35_600,
    patrimonioLiquido: 173_076,
    ativosTotais: 2_172_000,
    carteiraCredito: 1_108_000,
    basileia: 0.1547,
    eficiencia: 0.271,
    inadimplencia: 0.0292,
  },
  {
    institution: 'bb',
    year: 2024,
    lucroLiquido: 37_900,
    patrimonioLiquido: 190_100,
    ativosTotais: 2_433_868,
    carteiraCredito: 1_278_000,
    basileia: 0.1375,
    eficiencia: 0.256,
    inadimplencia: 0.033,
  },
  {
    institution: 'itau',
    year: 2023,
    lucroLiquido: 35_600,
    patrimonioLiquido: 180_700,
    ativosTotais: 2_690_000,
    carteiraCredito: 1_177_000,
    basileia: 0.17,
    eficiencia: 0.399,
    inadimplencia: 0.028,
  },
  {
    institution: 'itau',
    year: 2024,
    lucroLiquido: 41_400,
    patrimonioLiquido: 201_000,
    ativosTotais: 3_040_000,
    carteiraCredito: 1_359_000,
    basileia: 0.165,
    eficiencia: 0.395,
    inadimplencia: 0.024,
  },
]

export interface YearData extends RawYearData {
  /** decimal — calculado como lucroLiquido / patrimonioLiquido, ver nota metodológica */
  roe: number
  /** decimal — calculado como lucroLiquido / ativosTotais, ver nota metodológica */
  roa: number
}

export const RAW_DATA: YearData[] = RAW_DATA_INPUT.map((d) => ({
  ...d,
  roe: d.lucroLiquido / d.patrimonioLiquido,
  roa: d.lucroLiquido / d.ativosTotais,
}))

export const YEARS = [2023, 2024] as const

export function dataFor(institution: InstitutionId, year: number): YearData {
  const found = RAW_DATA.find((d) => d.institution === institution && d.year === year)
  if (!found) throw new Error(`Sem dados para ${institution} em ${year}`)
  return found
}

export function seriesFor(institution: InstitutionId): YearData[] {
  return RAW_DATA.filter((d) => d.institution === institution).sort((a, b) => a.year - b.year)
}

export const LATEST_YEAR = YEARS[YEARS.length - 1]
export const PREVIOUS_YEAR = YEARS[YEARS.length - 2]

export type NumericIndicatorKey = {
  [K in keyof YearData]: YearData[K] extends number ? K : never
}[keyof YearData]

export function bestByIndicator(
  year: number,
  indicator: NumericIndicatorKey,
  direction: 'max' | 'min',
): { institution: Institution; value: number } {
  const rows = RAW_DATA.filter((d) => d.year === year)
  const best = rows.reduce((acc, cur) => {
    if (direction === 'max') return cur[indicator] > acc[indicator] ? cur : acc
    return cur[indicator] < acc[indicator] ? cur : acc
  })
  return { institution: institutionById(best.institution), value: best[indicator] }
}

export interface MethodologyNote {
  institution: InstitutionId
  note: string
}

export const METHODOLOGY_NOTES: MethodologyNote[] = [
  {
    institution: 'sicoob',
    note:
      'Cooperativa de crédito: não tem acionistas nem divulga "ROE" no sentido bancário tradicional. Para comparar com BB e Itaú, o ROE e o ROA exibidos aqui foram calculados como sobras líquidas combinadas ÷ patrimônio líquido e ÷ ativos totais — na prática, muito próximos da "rentabilidade sobre ativos tangíveis" que o próprio Sicoob divulga (2,8% em 2023 e 2,3% em 2024).',
  },
  {
    institution: 'sicoob',
    note:
      'O índice de inadimplência do Sicoob é o "índice de ativos problemáticos" (créditos classificados de E a H), calculado pela Moody\'s Local — um critério mais amplo do que o de BB e Itaú, pois inclui reestruturações e sinais de dificuldade de pagamento, não apenas atraso acima de 90 dias. Os valores não são diretamente comparáveis aos das outras duas instituições.',
  },
  {
    institution: 'sicoob',
    note:
      'O índice de Basileia do Sicoob é "aglutinado" (sistema cooperativo combinado). Cooperativas têm exigência mínima regulatória por segmento prudencial (10,5% a 12%), diferente do mínimo aplicado a bancos do porte de BB e Itaú (~10,5% a 11%).',
  },
  {
    institution: 'bb',
    note:
      'Lucro líquido "ajustado" e patrimônio líquido de dez/2024 estimado a partir do balanço de set/2024 (R$ 187,4 bi) e do resultado do período — o valor exato de fechamento do exercício não foi encontrado nas fontes públicas consultadas.',
  },
  {
    institution: 'bb',
    note:
      'O ROE "oficial" divulgado pelo BB (RSPL, ~21%) usa patrimônio líquido médio ajustado, por isso é ligeiramente maior do que o ROE padronizado exibido aqui (lucro ÷ PL final do exercício).',
  },
  {
    institution: 'itau',
    note:
      'Lucro líquido "recorrente" (ajustado por itens não recorrentes, como efeitos de hiperinflação na Argentina). O ROE "recorrente" divulgado pelo Itaú (21,0% em 2023 e 22,1% em 2024) é maior do que o ROE padronizado exibido aqui porque usa patrimônio líquido médio e lucro ajustado.',
  },
  {
    institution: 'itau',
    note:
      'Carteira de crédito de 2023 derivada do crescimento anual de 15,5% divulgado no release de resultados do 4T24 (R$ 1,359 tri em 2024).',
  },
]

export interface SourceEntry {
  institution: InstitutionId
  label: string
  url: string
}

export const SOURCES: SourceEntry[] = [
  {
    institution: 'sicoob',
    label: 'Sicoob tem resultado recorde de R$ 8,4 bi em 2023 (Exame)',
    url: 'https://exame.com/economia/sicoob-tem-resultado-recorde-de-r-84-bi-em-2023-e-parte-do-recurso-sera-distribuida-aos-cooperados/',
  },
  {
    institution: 'sicoob',
    label: 'Ativos do Sicoob crescem 25% e encerram 2023 em R$ 298,4 bilhões (Exame)',
    url: 'https://exame.com/economia/ativos-do-sicoob-crescem-25-e-encerram-2023-em-r-2984-bilhoes/',
  },
  {
    institution: 'sicoob',
    label: 'Relatório de Crédito — Banco Cooperativo Sicoob (Moody\'s Local)',
    url: 'https://moodyslocal.com.br/wp-content/uploads/2025/07/Relatorio-de-Credito_Banco-Sicoob.pdf',
  },
  {
    institution: 'sicoob',
    label: 'Relatório Anual 2024 (Sicoob)',
    url: 'https://www.sicoob.com.br/documents/3044975/255333434/Relat%C3%B3rio+Anual+2024.pdf',
  },
  {
    institution: 'bb',
    label: 'Banco do Brasil tem lucro líquido ajustado recorde de R$ 35,6 bilhões em 2023 (Agência Gov)',
    url: 'https://agenciagov.ebc.com.br/noticias/202402/banco-do-brasil-tem-lucro-liquido-ajustado-recorde-de-r-35-6-bilhoes-em-2023',
  },
  {
    institution: 'bb',
    label: 'Banco do Brasil tem lucro recorde de R$ 37,9 bi em 2024 (Agência Brasil)',
    url: 'https://agenciabrasil.ebc.com.br/economia/noticia/2025-02/banco-do-brasil-tem-lucro-recorde-de-r-379-bi-em-2024',
  },
  {
    institution: 'bb',
    label: 'Banco do Brasil (BBAS3): 4T fraco — não julgue o trimestre pelo lucro líquido (XP Investimentos)',
    url: 'https://conteudos.xpi.com.br/acoes/relatorios/resultado-bbas3-bb-4t24/',
  },
  {
    institution: 'bb',
    label: 'Relações com Investidores — Sumário do Resultado (Banco do Brasil)',
    url: 'https://api.mziq.com/mzfilemanager/v2/d/5760dff3-15e1-4962-9e81-322a0b3d0bbd/fb3957f5-2b55-aa96-b753-aa625b45ac02?origin=1',
  },
  {
    institution: 'itau',
    label: 'Itaú Unibanco registra lucro de R$ 35,6 bilhões em 2023, alta de 15,7% (CNN Brasil)',
    url: 'https://www.cnnbrasil.com.br/economia/negocios/itau-unibanco-registra-lucro-de-r-356-bilhoes-em-2023-alta-de-157/',
  },
  {
    institution: 'itau',
    label: 'Lucro do Itaú Unibanco tem alta de 16,2% e soma R$ 41,4 bi em 2024 (Diário do Grande ABC)',
    url: 'https://www.dgabc.com.br/Noticia/4201733/lucro-do-itau-unibanco-tem-alta-de-16-2-e-soma-r-41-4-bi-em-2024',
  },
  {
    institution: 'itau',
    label: 'Itaú: índice de Basileia encerra 4º trimestre em 16,5% (IstoÉ Dinheiro)',
    url: 'https://istoedinheiro.com.br/itau-indice-de-basileia-encerra-4o-trimestre-em-165-05-p-p-a-menos-em-12-meses-2',
  },
  {
    institution: 'itau',
    label: 'Itaú Unibanco — Resultados 4T24 (release oficial de Relações com Investidores)',
    url: 'https://www.itau.com.br/download-file/v2/d/42787847-4cf6-4461-94a5-40ed237dca33/1182c2ec-ea05-7a1c-bd2d-f1f392285245?origin=1',
  },
  {
    institution: 'itau',
    label: 'Itaú Unibanco (ITUB4) — Resultados 4T24 (XP Investimentos)',
    url: 'https://conteudos.xpi.com.br/acoes/relatorios/resultados-itub4-itau-4t24/',
  },
]
