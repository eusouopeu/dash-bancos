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
  /** Cor da instituição na identidade visual do dashboard (não é a cor de marca oficial). */
  color: string
  /** Iniciais/monograma para o badge do card, quando não há logo. */
  initials: string
  /** Frase de destaque editorial exibida no card da instituição (fato qualitativo, não numérico). */
  highlight: string
}

export const INSTITUTIONS: Institution[] = [
  {
    id: 'sicoob',
    name: 'Sicoob',
    shortName: 'Sicoob',
    category: 'Cooperativa de crédito',
    color: '#087F8C',
    initials: 'S',
    highlight: 'Maior presença nacional entre as instituições financeiras. Atuação forte em municípios de menor porte.',
  },
  {
    id: 'bb',
    name: 'Banco do Brasil',
    shortName: 'BB',
    category: 'Sociedade de economia mista',
    color: '#171717',
    initials: 'BB',
    highlight: 'Líder em volume de ativos e maior banco em financiamento ao agronegócio.',
  },
  {
    id: 'itau',
    name: 'Itaú Unibanco',
    shortName: 'Itaú',
    category: 'Banco privado nacional',
    color: '#E76F32',
    initials: 'i',
    highlight: 'Destaque em eficiência operacional e rentabilidade consistente nos últimos anos.',
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
  /** decimal — despesas sobre receitas (menor é melhor). Nem toda instituição/ano divulga. */
  eficiencia?: number
  /** decimal — carteira vencida > 90 dias (BB/Itaú) ou índice de ativos problemáticos E-H (Sicoob, não comparável 1:1). Nem toda instituição/ano divulga. */
  inadimplencia?: number
  /** decimal — Liquidity Coverage Ratio / Índice de Liquidez de Curto Prazo. Nem toda instituição/ano divulga. */
  lcr?: number
}

export const RAW_DATA_INPUT: RawYearData[] = [
  // --- Sicoob ---
  // 2022-2024: série do sistema combinado ("Demonstrações Financeiras Combinadas – Sicoob"),
  // conforme tabulada no Relatório de Crédito da Moody's Local — ver METHODOLOGY_NOTES.
  {
    institution: 'sicoob',
    year: 2022,
    lucroLiquido: 7_200,
    patrimonioLiquido: 38_000,
    ativosTotais: 237_700,
    carteiraCredito: 147_500,
    inadimplencia: 0.047,
  },
  {
    institution: 'sicoob',
    year: 2023,
    lucroLiquido: 8_300,
    patrimonioLiquido: 46_100,
    ativosTotais: 298_400,
    carteiraCredito: 168_200,
    eficiencia: 0.271,
    inadimplencia: 0.06,
  },
  {
    institution: 'sicoob',
    year: 2024,
    lucroLiquido: 8_300,
    patrimonioLiquido: 54_500,
    ativosTotais: 359_700,
    carteiraCredito: 194_000,
    eficiencia: 0.271,
    inadimplencia: 0.072,
  },
  // 2025: carteira de crédito é a "carteira ampliada líquida" (base mais ampla que a dos anos
  // anteriores, que usam a carteira de crédito "cheia") — ver METHODOLOGY_NOTES.
  {
    institution: 'sicoob',
    year: 2025,
    lucroLiquido: 11_200,
    patrimonioLiquido: 62_800,
    ativosTotais: 430_100,
    carteiraCredito: 256_000,
  },
  // --- Banco do Brasil ---
  {
    institution: 'bb',
    year: 2022,
    lucroLiquido: 31_915,
    patrimonioLiquido: 163_588,
    ativosTotais: 2_029_399,
    carteiraCredito: 1_004_900,
    eficiencia: 0.292,
    inadimplencia: 0.0251,
    lcr: 2.1156,
  },
  {
    institution: 'bb',
    year: 2023,
    lucroLiquido: 35_562,
    patrimonioLiquido: 173_076,
    ativosTotais: 2_172_480,
    carteiraCredito: 1_108_000,
    eficiencia: 0.275,
    inadimplencia: 0.0292,
    lcr: 1.7802,
  },
  {
    institution: 'bb',
    year: 2024,
    lucroLiquido: 37_896,
    patrimonioLiquido: 190_073,
    ativosTotais: 2_433_868,
    carteiraCredito: 1_278_000,
    eficiencia: 0.256,
    inadimplencia: 0.0332,
    lcr: 1.5219,
  },
  // 2025: ano marcado por uma crise de inadimplência no agronegócio — inadimplência >90 dias
  // inclui o impacto de um caso pontual na carteira de TVM de uma empresa do atacado (R$3,6 bi);
  // ex-esse evento, o índice seria 4,88% — ver METHODOLOGY_NOTES.
  {
    institution: 'bb',
    year: 2025,
    lucroLiquido: 20_700,
    patrimonioLiquido: 187_902,
    ativosTotais: 2_451_621,
    carteiraCredito: 1_229_907,
    eficiencia: 0.277,
    inadimplencia: 0.0517,
  },
  // --- Itaú Unibanco ---
  // 2022-2025: patrimônio líquido e ativos totais na base "gerencial" divulgada em português
  // (ver METHODOLOGY_NOTES sobre a quebra de base contábil).
  {
    institution: 'itau',
    year: 2022,
    lucroLiquido: 30_786,
    patrimonioLiquido: 177_343,
    ativosTotais: 2_323_440,
    carteiraCredito: 1_141_500,
    eficiencia: 0.412,
    inadimplencia: 0.029,
    lcr: 1.644,
  },
  {
    institution: 'itau',
    year: 2023,
    lucroLiquido: 35_600,
    patrimonioLiquido: 180_700,
    ativosTotais: 2_690_000,
    carteiraCredito: 1_177_000,
    eficiencia: 0.399,
    inadimplencia: 0.028,
    lcr: 1.918,
  },
  {
    institution: 'itau',
    year: 2024,
    lucroLiquido: 41_400,
    patrimonioLiquido: 201_000,
    ativosTotais: 3_040_000,
    carteiraCredito: 1_359_000,
    eficiencia: 0.395,
    inadimplencia: 0.024,
    lcr: 2.213,
  },
  {
    institution: 'itau',
    year: 2025,
    lucroLiquido: 46_800,
    patrimonioLiquido: 196_146,
    ativosTotais: 3_096_277,
    carteiraCredito: 1_490_000,
    eficiencia: 0.389,
    inadimplencia: 0.019,
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

export const YEARS = [2022, 2023, 2024, 2025] as const

export function dataFor(institution: InstitutionId, year: number): YearData {
  const found = RAW_DATA.find((d) => d.institution === institution && d.year === year)
  if (!found) throw new Error(`Sem dados para ${institution} em ${year}`)
  return found
}

/** Como `dataFor`, mas retorna `undefined` em vez de lançar erro — para anos com lacuna (ex.: Sicoob 2022). */
export function tryDataFor(institution: InstitutionId, year: number): YearData | undefined {
  return RAW_DATA.find((d) => d.institution === institution && d.year === year)
}

export function seriesFor(institution: InstitutionId): YearData[] {
  return RAW_DATA.filter((d) => d.institution === institution).sort((a, b) => a.year - b.year)
}

export const LATEST_YEAR = YEARS[YEARS.length - 1]
export const PREVIOUS_YEAR = YEARS[YEARS.length - 2]

export type NumericIndicatorKey = {
  [K in keyof YearData]-?: NonNullable<YearData[K]> extends number ? K : never
}[keyof YearData]

export function bestByIndicator(
  year: number,
  indicator: NumericIndicatorKey,
  direction: 'max' | 'min',
): { institution: Institution; value: number } {
  const rows = RAW_DATA.filter((d) => d.year === year && d[indicator] !== undefined)
  const best = rows.reduce((acc, cur) => {
    if (direction === 'max') return cur[indicator]! > acc[indicator]! ? cur : acc
    return cur[indicator]! < acc[indicator]! ? cur : acc
  })
  return { institution: institutionById(best.institution), value: best[indicator]! }
}

export interface MarketShareEntry {
  institution: InstitutionId
  year: number
  /** decimal — participação estimada nos ativos totais do Sistema Financeiro Nacional */
  sharePercent: number
}

/**
 * Estimado a partir de dados públicos — o Bacen não divulga um ranking direto de "% de
 * mercado" por instituição. Cálculo: ativos totais da instituição (Bacen IF.data, base
 * dez/2023, consolidação "Conglomerados Financeiros e Instituições Independentes", exceto
 * Sicoob — ver nota) ÷ ativos totais estimados do SFN. O total do SFN foi estimado a partir
 * do Relatório de Economia Bancária 2023 do Bacen, que informa que Banco do Brasil, Caixa,
 * Itaú Unibanco e Bradesco somados detinham 55,3% dos ativos do SFN em dez/2023: (ativos dos
 * 4 bancos, via IF.data) ÷ 0,553 ≈ R$ 14,55 trilhões. Não disponível para 2024 — o Bacen
 * ainda não havia publicado, até o levantamento destes dados, uma métrica de concentração
 * equivalente para esse ano.
 */
export const MARKET_SHARE: MarketShareEntry[] = [
  { institution: 'sicoob', year: 2023, sharePercent: 0.0205 },
  { institution: 'bb', year: 2023, sharePercent: 0.148 },
  { institution: 'itau', year: 2023, sharePercent: 0.1677 },
]

export function marketShareFor(institution: InstitutionId, year: number): number | undefined {
  return MARKET_SHARE.find((m) => m.institution === institution && m.year === year)?.sharePercent
}

export interface PresenceHighlight {
  institution: InstitutionId
  stat: string
  label: string
  asOf: string
}

/**
 * Fatos de presença/rede publicados por cada instituição. Não são comparáveis 1:1 entre
 * si: cada instituição divulga métricas diferentes, em datas diferentes, e nem todas
 * publicam os mesmos indicadores (ex.: BB e Itaú não divulgam "número de municípios
 * atendidos" como o Sicoob). Ver `SOURCES` para a origem de cada dado.
 */
export const PRESENCE_HIGHLIGHTS: PresenceHighlight[] = [
  { institution: 'sicoob', stat: '+2.000', label: 'municípios com presença', asOf: '2023' },
  { institution: 'sicoob', stat: '+400', label: 'municípios onde é a única instituição financeira', asOf: '2023' },
  { institution: 'sicoob', stat: '1.859', label: 'municípios de até 50 mil habitantes atendidos', asOf: '2023' },
  { institution: 'sicoob', stat: '8,6 milhões', label: 'cooperados', asOf: '2024' },
]

export interface AgenciasEntry {
  institution: InstitutionId
  count: number
  asOf: string
  note: string
}

/**
 * Contagem de agências/pontos de atendimento. As datas-base DIFEREM entre instituições —
 * não foi possível encontrar os três números para a mesma data-base em fontes primárias
 * confiáveis. BB e Itaú vêm do ESTBAN (ver `NETWORK_SNAPSHOTS`); Sicoob vem de divulgação
 * institucional própria, pois a rede de cooperativas singulares não aparece no ESTBAN sob
 * o nome "Sicoob" (só a "Banco Sicoob S.A.", a tesouraria/banco central do sistema, com
 * poucas agências próprias). Ver `SOURCES`.
 */
export const AGENCIAS_DATA: AgenciasEntry[] = [
  {
    institution: 'sicoob',
    count: 4600,
    asOf: '2023–2024',
    note: '"Mais de 4,6 mil pontos de atendimento" (cooperativas singulares) — divulgação institucional, não capturada pelo ESTBAN sob o nome Sicoob.',
  },
  {
    institution: 'bb',
    count: 3948,
    asOf: 'jan/2026',
    note: 'ESTBAN (Bacen) — agências que reportam balancete mensal sob "BCO DO BRASIL S.A.".',
  },
  {
    institution: 'itau',
    count: 1498,
    asOf: 'jan/2026',
    note: 'ESTBAN (Bacen) — agências sob "ITAÚ UNIBANCO S.A."; menor que o total institucional (2.606 agências + 627 PABs, dez/2023) porque nem todo PAB reporta balancete próprio ao ESTBAN.',
  },
]

export interface UFCount {
  uf: string
  count: number
}

export interface NetworkSnapshot {
  institution: InstitutionId
  asOf: string
  agencias: number
  municipios: number
  porUF: UFCount[]
}

/**
 * Rede de agências por UF, extraída do ESTBAN (Estatística Bancária Mensal por Município) do
 * Banco Central — dataset público, posição jan/2026, filtrado por nome da instituição
 * ("BCO DO BRASIL S.A." e "ITAÚ UNIBANCO S.A.", entidades bancárias que reportam balancete
 * por agência). O Sicoob não aparece neste recorte (ver nota em `AGENCIAS_DATA`), por isso
 * não há mapa de presença por UF para ele. Fonte: https://www.bcb.gov.br/estatisticas/estatisticabancariamunicipios
 */
export const NETWORK_SNAPSHOTS: NetworkSnapshot[] = [
  {
    institution: 'bb',
    asOf: 'jan/2026',
    agencias: 3948,
    municipios: 2302,
    porUF: [
      { uf: 'AC', count: 17 }, { uf: 'AL', count: 41 }, { uf: 'AM', count: 36 },
      { uf: 'AP', count: 16 }, { uf: 'BA', count: 232 }, { uf: 'CE', count: 120 },
      { uf: 'DF', count: 73 }, { uf: 'ES', count: 80 }, { uf: 'GO', count: 141 },
      { uf: 'MA', count: 89 }, { uf: 'MG', count: 442 }, { uf: 'MS', count: 73 },
      { uf: 'MT', count: 100 }, { uf: 'PA', count: 95 }, { uf: 'PB', count: 63 },
      { uf: 'PE', count: 120 }, { uf: 'PI', count: 58 }, { uf: 'PR', count: 284 },
      { uf: 'RJ', count: 244 }, { uf: 'RN', count: 61 }, { uf: 'RO', count: 41 },
      { uf: 'RR', count: 11 }, { uf: 'RS', count: 293 }, { uf: 'SC', count: 237 },
      { uf: 'SE', count: 31 }, { uf: 'SP', count: 915 }, { uf: 'TO', count: 35 },
    ],
  },
  {
    institution: 'itau',
    asOf: 'jan/2026',
    agencias: 1498,
    municipios: 854,
    porUF: [
      { uf: 'AC', count: 1 }, { uf: 'AL', count: 7 }, { uf: 'AM', count: 9 },
      { uf: 'AP', count: 3 }, { uf: 'BA', count: 41 }, { uf: 'CE', count: 22 },
      { uf: 'DF', count: 23 }, { uf: 'ES', count: 18 }, { uf: 'GO', count: 106 },
      { uf: 'MA', count: 11 }, { uf: 'MG', count: 238 }, { uf: 'MS', count: 6 },
      { uf: 'MT', count: 15 }, { uf: 'PA', count: 27 }, { uf: 'PB', count: 9 },
      { uf: 'PE', count: 27 }, { uf: 'PI', count: 4 }, { uf: 'PR', count: 154 },
      { uf: 'RJ', count: 208 }, { uf: 'RN', count: 7 }, { uf: 'RO', count: 6 },
      { uf: 'RR', count: 2 }, { uf: 'RS', count: 65 }, { uf: 'SC', count: 53 },
      { uf: 'SE', count: 4 }, { uf: 'SP', count: 427 }, { uf: 'TO', count: 5 },
    ],
  },
]

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
  {
    institution: 'sicoob',
    note:
      'Market share estimado usando o ativo total "sistema Sicoob" (R$ 298,4 bi, que soma banco cooperativo + centrais + cooperativas singulares) — uma base de consolidação diferente da usada para BB e Itaú no IF.data (ver nota de metodologia de `MARKET_SHARE`). No IF.data, a entrada isolada "Banco Sicoob" aparece com apenas R$ 130,5 bi, pois não inclui as cooperativas singulares.',
  },
  {
    institution: 'bb',
    note:
      'Não encontramos, em fonte primária confiável, o número de municípios atendidos pelo BB divulgado pela própria instituição — o número de municípios exibido aqui vem do ESTBAN (Bacen), não de um release do BB.',
  },
  {
    institution: 'itau',
    note:
      'O número de municípios com agência Itaú exibido aqui vem do ESTBAN (Bacen, jan/2026) — o Itaú não divulga esse número diretamente em seus releases.',
  },
  {
    institution: 'sicoob',
    note:
      'Sobras líquidas, patrimônio líquido, ativos totais e carteira de crédito de 2022–2024 vêm da série histórica do sistema combinado ("Demonstrações Financeiras Combinadas – Sicoob") tabulada no Relatório de Crédito da Moody\'s Local de julho/2025 — a mesma base de consolidação (banco cooperativo + centrais + singulares) usada nas demais métricas do Sicoob aqui. O índice de eficiência do sistema combinado não foi divulgado para 2022.',
  },
  {
    institution: 'sicoob',
    note:
      'Carteira de crédito de 2025 é a "carteira ampliada líquida" (R$ 256 bi, divulgação institucional de abril/2026) — uma base mais ampla do que a "carteira de crédito" cheia usada em 2023 e 2024, o que explica parte do salto entre os dois anos. Índice de eficiência e inadimplência do sistema combinado não encontrados para 2025 em fonte primária confiável até o levantamento destes dados.',
  },
  {
    institution: 'itau',
    note:
      'Patrimônio líquido e ativos totais de 2022–2025 vêm das demonstrações contábeis em base "gerencial"/IFRS consolidada, divulgadas em português (mesma base das demais métricas do Itaú aqui).',
  },
  {
    institution: 'itau',
    note:
      'LCR é a média do trimestre encerrado em 31 de dezembro de cada ano (metodologia do próprio banco) — 2022 vem do Form 20-F FY2022, 2023 do Form 20-F FY2023, e 2024 do Relatório Pilar 3 (Gerenciamento de Riscos e Capital) 4T25, que traz a série histórica. Não encontramos o valor de 2025 em fonte primária até o levantamento destes dados.',
  },
  {
    institution: 'bb',
    note:
      'LCR de 2022 vem da API de dados abertos do próprio BB (relatório "liq1", registrado no catálogo do Bacen), com o valor médio do trimestre já calculado pelo banco em seu comentário oficial; 2023–2024 vêm do Relatório Pilar 3 (Gerenciamento de Riscos e Capital) de cada ano. Não encontramos o valor de 2025 em fonte primária até o levantamento destes dados.',
  },
  {
    institution: 'bb',
    note:
      'A inadimplência acima de 90 dias de 2025 (5,17%) inclui o impacto de um caso pontual na carteira de títulos e valores mobiliários (TVM) de uma empresa do segmento de atacado, no valor de R$ 3,6 bi — desconsiderando esse evento, o índice teria ficado em 4,88%, segundo o próprio banco.',
  },
  {
    institution: 'itau',
    note:
      'Carteira de crédito de 2025 (R$ 1,49 tri) é a "carteira de crédito ampliada" divulgada no release de resultados do 4T25 — mesma base conceitual usada nos demais anos da série do Itaú aqui.',
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
    institution: 'sicoob',
    label: 'Relatório Anual 2023 (Sicoob) — municípios atendidos e agências',
    url: 'https://www.sicoob.com.br/documents/2222345/8131683/Relat%C3%B3rio+2023__.pdf',
  },
  {
    institution: 'sicoob',
    label: 'Sicoob gera R$ 39,96 bilhões em benefícios econômicos em 2024 (cooperados, agências, estados)',
    url: 'https://cooperativismodecredito.coop.br/2025/04/sicoob-gera-r-3996-bilhoes-em-beneficios-economicos-em-2024/',
  },
  {
    institution: 'bb',
    label: 'Análise do Desempenho 4T23 (Banco do Brasil) — dados de 2022 e 2023',
    url: 'https://api.mziq.com/mzfilemanager/v2/d/5760dff3-15e1-4962-9e81-322a0b3d0bbd/8bff3233-96f7-c182-e4e0-62ed3273412e?origin=1',
  },
  {
    institution: 'bb',
    label: 'API de Dados Abertos do BB — Relatório LIQ1 (LCR), 2022',
    url: 'https://api.externo.bb.com.br/dadosabertos/v1/relatorios/liq1/2022-4',
  },
  {
    institution: 'bb',
    label: 'Relatório de Gerenciamento de Riscos e Capital — Pilar 3, 4T2023 (LCR)',
    url: 'https://api.mziq.com/mzfilemanager/v2/d/5760dff3-15e1-4962-9e81-322a0b3d0bbd/29228443-b61c-66f0-ae8f-453ec67a2a2c?origin=2',
  },
  {
    institution: 'bb',
    label: 'Relatório de Gerenciamento de Riscos e Capital — Pilar 3, 4T2024 (LCR)',
    url: 'https://api.mziq.com/mzfilemanager/v2/d/5760dff3-15e1-4962-9e81-322a0b3d0bbd/d023c282-1ea0-2796-eeb3-07f59602adb3?origin=2',
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
    label: 'Itaú Unibanco — Resultados 4T24 (release oficial de Relações com Investidores)',
    url: 'https://www.itau.com.br/download-file/v2/d/42787847-4cf6-4461-94a5-40ed237dca33/1182c2ec-ea05-7a1c-bd2d-f1f392285245?origin=1',
  },
  {
    institution: 'itau',
    label: 'Itaú Unibanco (ITUB4) — Resultados 4T24 (XP Investimentos)',
    url: 'https://conteudos.xpi.com.br/acoes/relatorios/resultados-itub4-itau-4t24/',
  },
  {
    institution: 'itau',
    label: 'Análise Gerencial da Operação 4T23 (Itaú Unibanco) — rede de agências e distribuição regional',
    url: 'https://static.poder360.com.br/2024/02/itau-analise-gerencial-4T-2023.pdf',
  },
  {
    institution: 'itau',
    label: 'Form 20-F FY2022 (Itaú Unibanco, SEC) — dados IFRS de 2021 e 2022, LCR',
    url: 'https://www.sec.gov/Archives/edgar/data/1132597/000129281423001950/itubform20f_2022.htm',
  },
  {
    institution: 'itau',
    label: 'Form 20-F FY2023 (Itaú Unibanco, SEC) — LCR de 2023',
    url: 'https://www.sec.gov/Archives/edgar/data/1132597/000129281424001692/itubform20f_2023.htm',
  },
  {
    institution: 'itau',
    label: 'Release de resultados 4T22 (SEC 6-K) — lucro, eficiência e inadimplência de 2022',
    url: 'https://sec.gov/Archives/edgar/data/1132597/000129281423000330/ex99-2.htm',
  },
  {
    institution: 'itau',
    label: 'Relatório de Gerenciamento de Riscos e Capital — Pilar 3, 4T2025 (LCR de 2024)',
    url: 'https://filemanager-cdn.mziq.com/published/42787847-4cf6-4461-94a5-40ed237dca33/970c7455-195a-439f-aa33-e08321f5d8c1_gerenciamento_de_riscos_e_capital_pilar_3_4t25.pdf',
  },
  {
    institution: 'itau',
    label: 'Itaú Unibanco Holding S.A. — Demonstrações Contábeis Completas, 31/12/2025 (balanço, DRE consolidados)',
    url: 'https://www.itau.com.br/relacoes-com-investidores',
  },
  {
    institution: 'itau',
    label: 'Itaú (ITUB4) lucra R$ 12,3 bi no 4T25; no ano, lucro recorrente foi de R$ 46,8 bi — ROE, eficiência, inadimplência e carteira ampliada (InfoMoney)',
    url: 'https://www.infomoney.com.br/mercados/itau-itub4-resultados-quarto-trimestre-2025/',
  },
  {
    institution: 'bb',
    label: 'Banco do Brasil (BBAS3) — Demonstrações Contábeis Completas, 31/12/2025 (balanço, DRE consolidados)',
    url: 'https://ri.bb.com.br/',
  },
  {
    institution: 'bb',
    label: 'Banco do Brasil (BBAS3): lucro ajustado de R$ 5,7 bi no 4T25, R$ 20,7 bi no ano, ROE, eficiência e inadimplência (Seu Dinheiro)',
    url: 'https://www.seudinheiro.com/2026/empresas/balanco-banco-do-brasil-bb-bbas3-4t25-2025-lucro-rentabilidade-roe-inadimplencia-miql/',
  },
  {
    institution: 'sicoob',
    label: 'Sistema Cooperativo Sicoob atinge R$ 92,8 bi em carteira agro e R$ 430,1 bi em ativos totais em 2025 (carteira ampliada, patrimônio líquido)',
    url: 'https://mundocoop.com.br/economia-negocios/sistema-cooperativa-sicoob-atinge-r-928-bilhoes-em-carteira-agro-e-r-430-bilhoes-em-ativos-totais-em-2025/',
  },
  {
    institution: 'sicoob',
    label: 'Sicoob alcança resultado recorde de R$ 11,2 bilhões em 2025 (sobras líquidas)',
    url: 'https://www.juventudebm.com/2026/04/sicoob-alcanca-resultado-recorde-de-r.html',
  },
]

export interface GeneralSourceEntry {
  label: string
  url: string
}

/** Fontes que cobrem o sistema financeiro como um todo, não uma instituição específica. */
export const GENERAL_SOURCES: GeneralSourceEntry[] = [
  {
    label: 'Relatório de Economia Bancária 2023 (Banco Central do Brasil) — concentração bancária, base do cálculo de market share',
    url: 'https://www.bcb.gov.br/content/publicacoes/relatorioeconomiabancaria/reb2023p.pdf',
  },
  {
    label: 'IF.data (Banco Central do Brasil) — ativos totais individuais por instituição, base dez/2023',
    url: 'https://www3.bcb.gov.br/ifdata/index2024.html',
  },
  {
    label: 'ESTBAN — Estatística Bancária Mensal por Município (Banco Central do Brasil) — agências por UF/município, base jan/2026',
    url: 'https://www.bcb.gov.br/estatisticas/estatisticabancariamunicipios',
  },
]
