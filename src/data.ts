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
 * diferir. Ver `ASSUMPTIONS` e `LIMITATIONS` para essa e outras ressalvas (ex.:
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
}

export const RAW_DATA_INPUT: RawYearData[] = [
  // --- Sicoob ---
  // 2022-2024: série do sistema combinado ("Demonstrações Financeiras Combinadas – Sicoob"),
  // conforme tabulada no Relatório de Crédito da Moody's Local — ver ASSUMPTIONS.
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
  // anteriores, que usam a carteira de crédito "cheia") — ver ASSUMPTIONS.
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
  },
  // 2025: ano marcado por uma crise de inadimplência no agronegócio — inadimplência >90 dias
  // inclui o impacto de um caso pontual na carteira de TVM de uma empresa do atacado (R$3,6 bi);
  // ex-esse evento, o índice seria 4,88% — ver ASSUMPTIONS.
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
  // (ver ASSUMPTIONS sobre a quebra de base contábil).
  {
    institution: 'itau',
    year: 2022,
    lucroLiquido: 30_786,
    patrimonioLiquido: 177_343,
    ativosTotais: 2_323_440,
    carteiraCredito: 1_141_500,
    eficiencia: 0.412,
    inadimplencia: 0.029,
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
 * Fatos de presença/rede de cada instituição. Não são comparáveis 1:1 entre si: cada uma
 * divulga métricas diferentes, em datas diferentes, e nenhuma publica pronto "municípios
 * atendidos" ou "municípios de até 50 mil habitantes atendidos" — os três números de
 * município aqui (Sicoob, BB e Itaú) são calculados por município de agência cruzado com a
 * estimativa de população do IBGE; muda só a base de agências (Sicoob: API de canais de
 * atendimento/Sisbr, set/2026; BB e Itaú: ESTBAN, jan/2026). A contagem de agências físicas
 * do Sicoob vem da mesma API do Sisbr (tipo "AGENCIA", que exclui postos de atendimento e
 * eletrônicos). Cooperados e funcionários vêm de divulgação institucional/imprensa — ver
 * `REFERENCES`.
 */
export const PRESENCE_HIGHLIGHTS: PresenceHighlight[] = [
  { institution: 'sicoob', stat: '9,7 milhões', label: 'cooperados', asOf: 'dez/2025' },
  { institution: 'sicoob', stat: '61 mil', label: 'funcionários', asOf: '2025' },
  { institution: 'sicoob', stat: '337', label: 'agências físicas', asOf: 'set/2026' },
  { institution: 'sicoob', stat: '2.532', label: 'municípios atendidos', asOf: 'set/2026' },
  { institution: 'sicoob', stat: '1.977', label: 'municípios de até 50 mil habitantes atendidos', asOf: 'set/2026' },
  { institution: 'bb', stat: '78 milhões', label: 'clientes (CPF/CNPJ com relacionamento ativo)', asOf: 'dez/2024' },
  { institution: 'bb', stat: '86.574', label: 'funcionários', asOf: 'dez/2024' },
  { institution: 'bb', stat: '3.171', label: 'agências tradicionais (+826 digitais e especializadas)', asOf: 'dez/2024' },
  { institution: 'bb', stat: '2.302', label: 'municípios atendidos', asOf: 'jan/2026' },
  { institution: 'bb', stat: '1.619', label: 'municípios de até 50 mil habitantes atendidos', asOf: 'jan/2026' },
  { institution: 'itau', stat: '99 milhões', label: 'clientes (CPF/CNPJ com relacionamento ativo)', asOf: 'dez/2024' },
  { institution: 'itau', stat: '96,2 mil', label: 'funcionários', asOf: 'dez/2024' },
  { institution: 'itau', stat: '2.272', label: 'agências e postos de atendimento', asOf: 'dez/2024' },
  { institution: 'itau', stat: '854', label: 'municípios atendidos', asOf: 'jan/2026' },
  { institution: 'itau', stat: '356', label: 'municípios de até 50 mil habitantes atendidos', asOf: 'jan/2026' },
]

export interface UFCount {
  uf: string
  count: number
}

export interface NetworkSnapshot {
  institution: InstitutionId
  asOf: string
  /** Nº de pontos de atendimento somados no mapa (rótulo exato depende de `unitLabel`). */
  agencias: number
  municipios: number
  /** Como chamar `agencias` na legenda — o conceito não é o mesmo para as três instituições. */
  unitLabel: string
  /** Fonte exibida junto ao mapa. */
  source: string
  porUF: UFCount[]
}

/**
 * Rede por UF. BB e Itaú vêm do ESTBAN (Estatística Bancária Mensal por Município) do Banco
 * Central — dataset público, posição jan/2026, filtrado por nome da instituição ("BCO DO
 * BRASIL S.A." e "ITAÚ UNIBANCO S.A.", entidades bancárias que reportam balancete por
 * agência). Fonte: https://www.bcb.gov.br/estatisticas/estatisticabancariamunicipios
 *
 * O Sicoob não aparece nesse recorte (ver `NETWORK_SNAPSHOTS` abaixo) — sua rede por UF vem da
 * API de canais de atendimento do Open Finance (Sisbr), somando agências + postos de
 * atendimento + postos eletrônicos das 338 cooperativas singulares do sistema, posição
 * set/2026. Fonte: https://api.sisbr.com.br/sicoob/externo/dados-abertos/v1/branches
 * (endpoint público listado no catálogo de dados abertos do Bacen, DASFN).
 */
export const NETWORK_SNAPSHOTS: NetworkSnapshot[] = [
  {
    institution: 'sicoob',
    asOf: 'set/2026',
    agencias: 5294,
    municipios: 2550,
    unitLabel: 'pontos de atendimento',
    source: 'API de canais de atendimento (Open Finance/Sisbr)',
    porUF: [
      { uf: 'AC', count: 9 }, { uf: 'AL', count: 7 }, { uf: 'AM', count: 22 },
      { uf: 'AP', count: 9 }, { uf: 'BA', count: 175 }, { uf: 'CE', count: 12 },
      { uf: 'DF', count: 92 }, { uf: 'ES', count: 157 }, { uf: 'GO', count: 310 },
      { uf: 'MA', count: 42 }, { uf: 'MG', count: 1481 }, { uf: 'MS', count: 83 },
      { uf: 'MT', count: 166 }, { uf: 'PA', count: 50 }, { uf: 'PB', count: 40 },
      { uf: 'PE', count: 46 }, { uf: 'PI', count: 7 }, { uf: 'PR', count: 420 },
      { uf: 'RJ', count: 204 }, { uf: 'RN', count: 16 }, { uf: 'RO', count: 133 },
      { uf: 'RR', count: 10 }, { uf: 'RS', count: 232 }, { uf: 'SC', count: 532 },
      { uf: 'SE', count: 1 }, { uf: 'SP', count: 1003 }, { uf: 'TO', count: 35 },
    ],
  },
  {
    institution: 'bb',
    asOf: 'jan/2026',
    unitLabel: 'agências',
    source: 'ESTBAN/Bacen',
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
    unitLabel: 'agências',
    source: 'ESTBAN/Bacen',
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

/* -------------------------------------------------------------------------- */
/*  Metodologia — fórmulas, premissas e limitações                            */
/* -------------------------------------------------------------------------- */

export interface Formula {
  /** Nome por extenso do indicador. */
  name: string
  /** Sigla, quando o indicador é conhecido por ela. */
  abbr?: string
  /** Numerador e denominador da razão, escritos como aparecem nas demonstrações. */
  numerator: string
  denominator: string
  /** Fator que multiplica a razão (ex.: "× 100"), quando existe. */
  factor?: string
  /** O que o número quer dizer, em uma frase. */
  meaning: string
  /** Unidade do resultado. */
  unit: string
  /** Sentido da leitura: qual direção é desempenho melhor. */
  better: 'max' | 'min'
  /** Ícone do heroicons usado no cabeçalho do cartão. */
  icon: 'trending' | 'pie' | 'scale' | 'warning' | 'flag' | 'globe'
}

export const FORMULAS: Formula[] = [
  {
    name: 'Retorno sobre o Patrimônio Líquido',
    abbr: 'ROE',
    numerator: 'Lucro Líquido',
    denominator: 'Patrimônio Líquido',
    factor: '× 100',
    meaning: 'Quanto de resultado a instituição gera para cada real de capital próprio.',
    unit: '% ao ano',
    better: 'max',
    icon: 'trending',
  },
  {
    name: 'Retorno sobre Ativos',
    abbr: 'ROA',
    numerator: 'Lucro Líquido',
    denominator: 'Ativos Totais',
    factor: '× 100',
    meaning: 'Quanto de resultado cada real de ativo produz — mede a eficiência do balanço inteiro.',
    unit: '% ao ano',
    better: 'max',
    icon: 'pie',
  },
  {
    name: 'Índice de Eficiência',
    numerator: 'Despesas Administrativas',
    denominator: 'Receitas Operacionais',
    factor: '× 100',
    meaning: 'Quanto da receita é consumida pela estrutura antes de virar resultado.',
    unit: '%',
    better: 'min',
    icon: 'scale',
  },
  {
    name: 'Inadimplência acima de 90 dias',
    numerator: 'Carteira Vencida > 90 dias',
    denominator: 'Carteira de Crédito',
    factor: '× 100',
    meaning: 'Parcela da carteira com pagamento em atraso há mais de noventa dias.',
    unit: '% da carteira',
    better: 'min',
    icon: 'warning',
  },
  {
    name: 'Índice de Ativos Problemáticos',
    abbr: 'E–H · usado no lugar da inadimplência para o Sicoob',
    numerator: 'Carteira Classificada de E a H',
    denominator: 'Carteira de Crédito',
    factor: '× 100',
    meaning: 'Critério mais amplo: inclui reestruturações e sinais de dificuldade, não só o atraso.',
    unit: '% da carteira',
    better: 'min',
    icon: 'flag',
  },
  {
    name: 'Participação de Mercado',
    numerator: 'Ativos Totais da Instituição',
    denominator: 'Ativos Totais do SFN',
    factor: '× 100',
    meaning: 'Peso da instituição dentro do Sistema Financeiro Nacional.',
    unit: '% do SFN',
    better: 'max',
    icon: 'globe',
  },
]

export interface AssumptionGroup {
  /** Título do bloco: "Premissas gerais" ou o nome da instituição. */
  title: string
  /** Uma linha dizendo a que o bloco se aplica. */
  scope: string
  /** Cor do filete do bloco, quando ele pertence a uma instituição. */
  institution?: InstitutionId
  items: string[]
}

export const ASSUMPTIONS: AssumptionGroup[] = [
  {
    title: 'Premissas gerais',
    scope: 'Válidas para as três instituições, para manter a comparação legítima.',
    items: [
      'Todos os valores são consolidados e vêm de demonstrações auditadas ou de releases oficiais de resultados, em R$ milhões, exatamente como reportados — sem reexpressão por inflação.',
      'ROE e ROA usam o saldo de fechamento do exercício, não a média entre abertura e fechamento. A convenção é a mesma nas três instituições.',
      'O comparativo cobre 2022–2025, os quatro exercícios com dado publicado para as três instituições.',
      'Quando um indicador não foi localizado em fonte primária para um par instituição/ano, a célula fica vazia e a linha do gráfico se interrompe — nenhum valor é interpolado ou estimado.',
      'Lucro líquido é o número "ajustado" no Banco do Brasil, o "recorrente" no Itaú e as sobras líquidas combinadas no Sicoob.',
    ],
  },
  {
    title: 'Sicoob',
    scope: 'Série do sistema combinado: banco cooperativo, centrais e cooperativas singulares.',
    institution: 'sicoob',
    items: [
      'A série 2022–2024 vem das Demonstrações Financeiras Combinadas, tabuladas no Relatório de Crédito da Moody\'s Local de julho de 2025.',
      'A inadimplência exibida é o índice de ativos problemáticos (carteira classificada de E a H), não o atraso acima de 90 dias.',
      'ROE e ROA são derivados aqui: a cooperativa não divulga essas métricas, e sim a rentabilidade sobre ativos tangíveis.',
      'A carteira de crédito de 2025 é a carteira ampliada líquida — base mais ampla que a carteira cheia usada em 2023 e 2024.',
      'O market share usa o ativo do sistema combinado, base de consolidação diferente da usada para BB e Itaú no IF.data.',
    ],
  },
  {
    title: 'Banco do Brasil',
    scope: 'Sumário do Resultado e demonstrações contábeis consolidadas de cada exercício.',
    institution: 'bb',
    items: [
      'Lucro líquido ajustado, conforme o Sumário do Resultado de cada exercício.',
      'O ROE oficial divulgado pelo banco (RSPL) usa patrimônio líquido médio ajustado e por isso é maior que o ROE padronizado exibido aqui.',
      'O patrimônio líquido de dez/2024 foi estimado a partir do balanço de set/2024 e do resultado do período — o valor exato de fechamento não foi localizado em fonte pública.',
      'A inadimplência de 2025 inclui um caso pontual de R$ 3,6 bi na carteira de TVM de uma empresa do atacado; ex-esse evento, o índice seria 4,88%.',
    ],
  },
  {
    title: 'Itaú Unibanco',
    scope: 'Base gerencial/IFRS consolidada, divulgada em português.',
    institution: 'itau',
    items: [
      'Lucro líquido recorrente, ajustado por itens não recorrentes como os efeitos de hiperinflação na Argentina.',
      'Patrimônio líquido e ativos totais na base gerencial/IFRS consolidada — mesma base das demais métricas do Itaú aqui.',
      'A carteira de crédito é a carteira ampliada em todos os anos da série.',
      'A carteira de 2023 foi derivada do crescimento anual de 15,5% divulgado no release do 4T24.',
    ],
  },
]

/** O que este comparativo não consegue afirmar, e por quê. */
export const LIMITATIONS: string[] = [
  'Comparar uma cooperativa com dois bancos tem limite: o Sicoob distribui sobras aos cooperados, não remunera acionistas e tem estrutura tributária própria — o que afeta diretamente margem e rentabilidade.',
  'A inadimplência do Sicoob (ativos problemáticos E–H) é conceitualmente mais ampla que a de BB e Itaú (atraso acima de 90 dias). As linhas desse gráfico não são comparáveis 1:1.',
  'O índice de eficiência do Sicoob não é divulgado para o sistema combinado em todos os anos da série — 2022 e 2025 seguem em aberto, e a inadimplência de 2025 também.',
  'ROE e ROA são recalculados aqui sobre saldos de fechamento. Os números oficiais de cada instituição usam saldos médios e resultados ajustados, e por isso são sistematicamente mais altos.',
  'A contagem de rede tem datas-base e conceitos diferentes: BB e Itaú vêm do ESTBAN (jan/2026, só agências com balancete próprio); o Sicoob vem da API de canais de atendimento do Open Finance (set/2026, agências + postos de atendimento das cooperativas singulares), porque nenhuma delas aparece no ESTBAN sob o nome Sicoob.',
  '"Municípios atendidos" e "municípios de até 50 mil habitantes atendidos" não são números publicados por nenhuma das três instituições: são obtidos cruzando o município de cada ponto de atendimento (ESTBAN para BB e Itaú, jan/2026; API de canais de atendimento/Sisbr para o Sicoob, set/2026) com a estimativa de população residente por município mais recente do IBGE (2026). Datas-base diferentes entre as três limitam a comparação direta.',
  'O market share é estimado, não publicado: o Banco Central não divulga um ranking direto de participação por instituição.',
]

/* -------------------------------------------------------------------------- */
/*  Fontes de dados — referências na ABNT NBR 6023:2018                       */
/* -------------------------------------------------------------------------- */

export type ReferenceGroupId = InstitutionId | 'geral'

export interface Reference {
  group: ReferenceGroupId
  /** Autoria em caixa alta, como pede a norma. Vazio quando a obra não tem autor. */
  author: string
  /** O que antecede o elemento destacado — o título do artigo, em periódicos. */
  before?: string
  /** Elemento em destaque: o título da obra ou o nome do periódico. */
  emphasis: string
  /** Subtítulo, local, editora, ano e notas — o que fecha a referência. */
  after: string
  url: string
  /** Data de acesso, no formato abreviado da norma. */
  accessedAt: string
  /** Anotação editorial, fora da referência: o que este documento sustenta aqui. */
  note?: string
}

const ACCESS = '4 set. 2026'

export interface ReferenceGroup {
  id: ReferenceGroupId
  title: string
  /** Como as fontes daquele grupo foram usadas. */
  intro: string
}

export const REFERENCE_GROUPS: ReferenceGroup[] = [
  {
    id: 'sicoob',
    title: 'Sicoob',
    intro:
      'A série financeira vem das Demonstrações Financeiras Combinadas do sistema, tabuladas por agência de rating; os dados de 2025 vêm de divulgação institucional reproduzida na imprensa especializada. A rede de agências e pontos de atendimento (mapa de presença) vem da API de canais de atendimento do Open Finance, publicada pelas cooperativas do sistema sob obrigação regulatória do Bacen.',
  },
  {
    id: 'bb',
    title: 'Banco do Brasil',
    intro:
      'Releases de Relações com Investidores e demonstrações contábeis consolidadas de cada exercício, complementados por cobertura de imprensa que reproduz esses mesmos números.',
  },
  {
    id: 'itau',
    title: 'Itaú Unibanco',
    intro:
      'Releases de resultados e análises gerenciais do banco, mais os formulários arquivados na SEC, que trazem a base IFRS auditada.',
  },
  {
    id: 'geral',
    title: 'Sistema financeiro e cartografia',
    intro:
      'Fontes que descrevem o sistema como um todo — base do market share e da contagem de agências por unidade da federação — e o contorno do mapa.',
  },
]

export const REFERENCES: Reference[] = [
  // --- Sicoob ---
  {
    group: 'sicoob',
    author: "MOODY'S LOCAL BRASIL.",
    emphasis: 'Relatório de crédito',
    after: ": Banco Cooperativo Sicoob S.A. São Paulo: Moody's Local, 21 jul. 2025.",
    url: 'https://moodyslocal.com.br/wp-content/uploads/2025/07/Relatorio-de-Credito_Banco-Sicoob.pdf',
    accessedAt: ACCESS,
    note: 'Série 2021–2024 do sistema combinado: sobras líquidas, patrimônio líquido, ativos totais e índice de ativos problemáticos.',
  },
  {
    group: 'sicoob',
    author: 'SICOOB.',
    emphasis: 'Relatório anual 2024',
    after: '. Brasília, DF: Sicoob Confederação, 2025.',
    url: 'https://www.sicoob.com.br/documents/3044975/255333434/Relat%C3%B3rio+Anual+2024.pdf',
    accessedAt: ACCESS,
    note: 'Panorama geral da rede e dos resultados de 2024.',
  },
  {
    group: 'sicoob',
    author: '',
    before: 'SICOOB tem resultado recorde de R$ 8,4 bi em 2023 e parte do recurso será distribuída aos cooperados.',
    emphasis: 'Exame',
    after: ', São Paulo, 2024.',
    url: 'https://exame.com/economia/sicoob-tem-resultado-recorde-de-r-84-bi-em-2023-e-parte-do-recurso-sera-distribuida-aos-cooperados/',
    accessedAt: ACCESS,
  },
  {
    group: 'sicoob',
    author: '',
    before: 'ATIVOS do Sicoob crescem 25% e encerram 2023 em R$ 298,4 bilhões.',
    emphasis: 'Exame',
    after: ', São Paulo, 2024.',
    url: 'https://exame.com/economia/ativos-do-sicoob-crescem-25-e-encerram-2023-em-r-2984-bilhoes/',
    accessedAt: ACCESS,
  },
  {
    group: 'sicoob',
    author: '',
    before: 'SICOOB gera R$ 39,96 bilhões em benefícios econômicos em 2024.',
    emphasis: 'Portal do Cooperativismo Financeiro',
    after: ', [S. l.], 2025.',
    url: 'https://cooperativismodecredito.coop.br/2025/04/sicoob-gera-r-3996-bilhoes-em-beneficios-economicos-em-2024/',
    accessedAt: ACCESS,
    note: 'Cooperados, agências e presença por estado em 2024.',
  },
  {
    group: 'sicoob',
    author: '',
    before: 'SICOOB alcança resultado recorde de R$ 11,2 bilhões em 2025.',
    emphasis: 'Portal do Cooperativismo Financeiro',
    after: ', [S. l.], 2026.',
    url: 'https://cooperativismodecredito.coop.br/2026/04/sicoob-alcanca-resultado-recorde-de-r-112-bilhoes-em-2025/',
    accessedAt: ACCESS,
    note: 'Sobras líquidas de 2025. O release não divulga índice de eficiência nem inadimplência do sistema.',
  },
  {
    group: 'sicoob',
    author: '',
    before:
      'SISTEMA Cooperativo Sicoob atinge R$ 92,8 bilhões em carteira agro e R$ 430,1 bilhões em ativos totais em 2025.',
    emphasis: 'MundoCoop',
    after: ', [S. l.], 2026.',
    url: 'https://mundocoop.com.br/economia-negocios/sistema-cooperativa-sicoob-atinge-r-928-bilhoes-em-carteira-agro-e-r-430-bilhoes-em-ativos-totais-em-2025/',
    accessedAt: ACCESS,
    note: 'Ativos totais, patrimônio líquido e carteira ampliada de 2025.',
  },
  {
    group: 'sicoob',
    author: '',
    before:
      'SICOOB registra R$ 430,1 bilhões em ativos e amplia carteira de crédito em 2025.',
    emphasis: 'Paraná Cooperativo',
    after: ', Curitiba, 8 abr. 2026.',
    url: 'https://www.paranacooperativo.coop.br/noticias-cooperativismo/sicoob-registra-r-430-1-bilhoes-em-ativos-e-amplia-carteira-de-credito-em-2025',
    accessedAt: ACCESS,
    note: 'Número de cooperados (9,7 milhões, base dez/2025) usado em `PRESENCE_HIGHLIGHTS` para o Sicoob.',
  },
  {
    group: 'sicoob',
    author: '',
    before: 'Sicoob e Sicredi estão entre os maiores empregadores do país.',
    emphasis: 'Portal do Cooperativismo Financeiro',
    after: ', [S. l.], 2025.',
    url: 'https://cooperativismodecredito.coop.br/2025/11/sicoob-e-sicredi-estao-entre-os-maiores-empregadores-do-pais/',
    accessedAt: ACCESS,
    note: 'Ranking de maiores empregadores do país (2025): Sicoob com 61 mil colaboradores, no mesmo levantamento que traz BB (86 mil) e Itaú (96 mil) — base de comparação única entre os três para `PRESENCE_HIGHLIGHTS`.',
  },
  {
    group: 'sicoob',
    author: 'SICOOB. Central de Serviços em Bens e Recursos (Sisbr).',
    emphasis: 'API de canais de atendimento — Open Finance Brasil',
    after: '. [S. l.]: Sisbr, 2026. Base 2 set. 2026.',
    url: 'https://api.sisbr.com.br/sicoob/externo/dados-abertos/v1/branches',
    accessedAt: ACCESS,
    note: 'Agências, postos de atendimento e postos eletrônicos das 338 cooperativas singulares do sistema, por município e UF — endpoint público listado no catálogo de dados abertos do Bacen (DASFN) sob a API "canais_atendimento", que cada instituição do SFN é obrigada a publicar. Base de `NETWORK_SNAPSHOTS` e, cruzada com a população do IBGE, dos itens "agências físicas", "municípios atendidos" e "municípios de até 50 mil habitantes atendidos" em `PRESENCE_HIGHLIGHTS` para o Sicoob.',
  },

  // --- Banco do Brasil ---
  {
    group: 'bb',
    author: 'BANCO DO BRASIL.',
    emphasis: 'Análise do desempenho',
    after: ': 4T23. Brasília, DF: Banco do Brasil, 2024.',
    url: 'https://api.mziq.com/mzfilemanager/v2/d/5760dff3-15e1-4962-9e81-322a0b3d0bbd/8bff3233-96f7-c182-e4e0-62ed3273412e?origin=1',
    accessedAt: ACCESS,
    note: 'Lucro, patrimônio, ativos, carteira, eficiência e inadimplência de 2022 e 2023.',
  },
  {
    group: 'bb',
    author: 'BANCO DO BRASIL.',
    emphasis: 'Sumário do resultado',
    after: '. Brasília, DF: Banco do Brasil, [2025].',
    url: 'https://api.mziq.com/mzfilemanager/v2/d/5760dff3-15e1-4962-9e81-322a0b3d0bbd/fb3957f5-2b55-aa96-b753-aa625b45ac02?origin=1',
    accessedAt: ACCESS,
  },
  {
    group: 'bb',
    author: 'BANCO DO BRASIL.',
    emphasis: 'Demonstrações contábeis completas',
    after: ': exercício social encerrado em 31 de dezembro de 2025. Brasília, DF: Banco do Brasil, 2026.',
    url: 'https://ri.bb.com.br/',
    accessedAt: ACCESS,
    note: 'Balanço e demonstração de resultado consolidados de 2025.',
  },
  {
    group: 'bb',
    author: '',
    before: 'BANCO do Brasil tem lucro líquido ajustado recorde de R$ 35,6 bilhões em 2023.',
    emphasis: 'Agência Gov',
    after: ', Brasília, DF, 2024.',
    url: 'https://agenciagov.ebc.com.br/noticias/202402/banco-do-brasil-tem-lucro-liquido-ajustado-recorde-de-r-35-6-bilhoes-em-2023',
    accessedAt: ACCESS,
  },
  {
    group: 'bb',
    author: '',
    before: 'BANCO do Brasil tem lucro recorde de R$ 37,9 bi em 2024.',
    emphasis: 'Agência Brasil',
    after: ', Brasília, DF, 2025.',
    url: 'https://agenciabrasil.ebc.com.br/economia/noticia/2025-02/banco-do-brasil-tem-lucro-recorde-de-r-379-bi-em-2024',
    accessedAt: ACCESS,
  },
  {
    group: 'bb',
    author: 'XP INVESTIMENTOS.',
    before: 'Banco do Brasil (BBAS3): 4T fraco — não julgue o trimestre pelo lucro líquido.',
    emphasis: 'Conteúdos XP',
    after: ', São Paulo, 2025.',
    url: 'https://conteudos.xpi.com.br/acoes/relatorios/resultado-bbas3-bb-4t24/',
    accessedAt: ACCESS,
    note: 'Eficiência, inadimplência e carteira de 2024.',
  },
  {
    group: 'bb',
    author: '',
    before:
      'BALANÇO do Banco do Brasil: lucro ajustado de R$ 5,7 bi no 4T25 e de R$ 20,7 bi no ano, com ROE, eficiência e inadimplência.',
    emphasis: 'Seu Dinheiro',
    after: ', São Paulo, 2026.',
    url: 'https://www.seudinheiro.com/2026/empresas/balanco-banco-do-brasil-bb-bbas3-4t25-2025-lucro-rentabilidade-roe-inadimplencia-miql/',
    accessedAt: ACCESS,
  },
  {
    group: 'bb',
    author: '',
    before: 'Lucro do Banco do Brasil cresce 6,6% em 2024 e chega a R$ 37,8 bilhões.',
    emphasis: 'Sindicato dos Bancários',
    after: ', São Paulo, 2025.',
    url: 'https://spbancarios.com.br/02/2025/lucro-do-banco-do-brasil-cresce-66-em-2024-e-chega-r-378-bilhoes',
    accessedAt: ACCESS,
    note: 'Reproduz o release do BB: 86.574 funcionários, 3.171 agências tradicionais e 826 agências digitais/especializadas em dez/2024. Base de dois itens de `PRESENCE_HIGHLIGHTS` para o BB.',
  },
  {
    group: 'bb',
    author: '',
    before: 'Nubank passa Itaú em quantidade de clientes, segundo Banco Central.',
    emphasis: 'Finsiders Brasil',
    after: ', São Paulo, 2025.',
    url: 'https://finsidersbrasil.com.br/estudos-e-relatorios/ranking/nubank-passa-itau-em-quantidade-de-clientes-segundo-banco-central/',
    accessedAt: ACCESS,
    note: 'Reproduz o ranking de clientes do Banco Central (Cadastro de Clientes do Sistema Financeiro + Sistema de Informações de Crédito, sem duplicidade de CPF/CNPJ), dez/2024: BB com 78 milhões. Mesma fonte usada para o Itaú — critério único que torna os dois comparáveis entre si (mas não com os "clientes" que cada banco divulga em seu próprio release, calculados de outra forma).',
  },

  // --- Itaú Unibanco ---
  {
    group: 'itau',
    author: 'ITAÚ UNIBANCO HOLDING S.A.',
    emphasis: 'Análise gerencial da operação',
    after: ': 4T23. São Paulo: Itaú Unibanco, 2024.',
    url: 'https://static.poder360.com.br/2024/02/itau-analise-gerencial-4T-2023.pdf',
    accessedAt: ACCESS,
    note: 'Rede de agências e distribuição regional.',
  },
  {
    group: 'itau',
    author: 'ITAÚ UNIBANCO HOLDING S.A.',
    emphasis: 'Resultados 4T24',
    after: ': release de resultados. São Paulo: Itaú Unibanco, 2025.',
    url: 'https://www.itau.com.br/download-file/v2/d/42787847-4cf6-4461-94a5-40ed237dca33/1182c2ec-ea05-7a1c-bd2d-f1f392285245?origin=1',
    accessedAt: ACCESS,
  },
  {
    group: 'itau',
    author: '',
    before: 'Itaú aumenta despesa com pessoal e fecha 212 agências em 2024.',
    emphasis: 'Metrópoles',
    after: ', Brasília, DF, 2025.',
    url: 'https://www.metropoles.com/negocios/itau-aumenta-despesa-com-pessoal-e-fecha-212-agencias-em-2024',
    accessedAt: ACCESS,
    note: 'Reproduz o release 4T24 do Itaú: 2.272 agências e postos de atendimento e 96,2 mil funcionários em dez/2024. Base de dois itens de `PRESENCE_HIGHLIGHTS` para o Itaú.',
  },
  {
    group: 'itau',
    author: '',
    before: 'Nubank passa Itaú em quantidade de clientes, segundo Banco Central.',
    emphasis: 'Finsiders Brasil',
    after: ', São Paulo, 2025.',
    url: 'https://finsidersbrasil.com.br/estudos-e-relatorios/ranking/nubank-passa-itau-em-quantidade-de-clientes-segundo-banco-central/',
    accessedAt: ACCESS,
    note: 'Reproduz o ranking de clientes do Banco Central (mesmo critério citado no grupo BB), dez/2024: Itaú com 99 milhões, ante 101 milhões em dez/2023.',
  },
  {
    group: 'itau',
    author: 'ITAÚ UNIBANCO HOLDING S.A.',
    emphasis: 'Form 20-F',
    after:
      ': fiscal year 2022. Washington, DC: U.S. Securities and Exchange Commission, 2023. Arquivamento anual de emissor privado estrangeiro.',
    url: 'https://www.sec.gov/Archives/edgar/data/1132597/000129281423001950/itubform20f_2022.htm',
    accessedAt: ACCESS,
    note: 'Base IFRS auditada de 2021 e 2022.',
  },
  {
    group: 'itau',
    author: 'ITAÚ UNIBANCO HOLDING S.A.',
    emphasis: 'Release de resultados 4T22',
    after: '. Washington, DC: U.S. Securities and Exchange Commission, 2023. Formulário 6-K.',
    url: 'https://sec.gov/Archives/edgar/data/1132597/000129281423000330/ex99-2.htm',
    accessedAt: ACCESS,
    note: 'Lucro, eficiência e inadimplência de 2022.',
  },
  {
    group: 'itau',
    author: 'ITAÚ UNIBANCO HOLDING S.A.',
    emphasis: 'Demonstrações contábeis completas',
    after: ': exercício social encerrado em 31 de dezembro de 2025. São Paulo: Itaú Unibanco, 2026.',
    url: 'https://www.itau.com.br/relacoes-com-investidores',
    accessedAt: ACCESS,
  },
  {
    group: 'itau',
    author: '',
    before: 'ITAÚ Unibanco registra lucro de R$ 35,6 bilhões em 2023, alta de 15,7%.',
    emphasis: 'CNN Brasil',
    after: ', São Paulo, 2024.',
    url: 'https://www.cnnbrasil.com.br/economia/negocios/itau-unibanco-registra-lucro-de-r-356-bilhoes-em-2023-alta-de-157/',
    accessedAt: ACCESS,
  },
  {
    group: 'itau',
    author: '',
    before: 'LUCRO do Itaú Unibanco tem alta de 16,2% e soma R$ 41,4 bi em 2024.',
    emphasis: 'Diário do Grande ABC',
    after: ', Santo André, 2025.',
    url: 'https://www.dgabc.com.br/Noticia/4201733/lucro-do-itau-unibanco-tem-alta-de-16-2-e-soma-r-41-4-bi-em-2024',
    accessedAt: ACCESS,
  },
  {
    group: 'itau',
    author: 'XP INVESTIMENTOS.',
    before: 'Itaú Unibanco (ITUB4): resultados do 4T24.',
    emphasis: 'Conteúdos XP',
    after: ', São Paulo, 2025.',
    url: 'https://conteudos.xpi.com.br/acoes/relatorios/resultados-itub4-itau-4t24/',
    accessedAt: ACCESS,
  },
  {
    group: 'itau',
    author: '',
    before:
      'ITAÚ (ITUB4) lucra R$ 12,3 bi no 4T25; no ano, lucro recorrente foi de R$ 46,8 bi, com ROE, eficiência, inadimplência e carteira ampliada.',
    emphasis: 'InfoMoney',
    after: ', São Paulo, 2026.',
    url: 'https://www.infomoney.com.br/mercados/itau-itub4-resultados-quarto-trimestre-2025/',
    accessedAt: ACCESS,
  },

  // --- Sistema financeiro e cartografia ---
  {
    group: 'geral',
    author: 'BRASIL. Banco Central do Brasil.',
    emphasis: 'Relatório de economia bancária 2023',
    after: '. Brasília, DF: Bacen, 2024.',
    url: 'https://www.bcb.gov.br/content/publicacoes/relatorioeconomiabancaria/reb2023p.pdf',
    accessedAt: ACCESS,
    note: 'Concentração bancária — base do denominador usado no cálculo de market share.',
  },
  {
    group: 'geral',
    author: 'BRASIL. Banco Central do Brasil.',
    emphasis: 'IF.data',
    after: ': dados selecionados de entidades supervisionadas. Brasília, DF: Bacen, 2024. Base dez. 2023.',
    url: 'https://www3.bcb.gov.br/ifdata/index2024.html',
    accessedAt: ACCESS,
    note: 'Ativos totais individuais por instituição.',
  },
  {
    group: 'geral',
    author: 'BRASIL. Banco Central do Brasil.',
    emphasis: 'ESTBAN',
    after: ': estatística bancária mensal por município. Brasília, DF: Bacen, 2026. Base jan. 2026.',
    url: 'https://www.bcb.gov.br/estatisticas/estatisticabancariamunicipios',
    accessedAt: ACCESS,
    note: 'Agências por unidade da federação e por município, para BB e Itaú.',
  },
  {
    group: 'geral',
    author: 'INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA.',
    emphasis: 'Estimativas da população residente',
    after: ': agregado 6579 (Sidra). Rio de Janeiro: IBGE, 2026.',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/6579',
    accessedAt: ACCESS,
    note: 'População estimada por município (2026), cruzada com o ESTBAN (BB e Itaú) e com a API do Sisbr (Sicoob) para contar quantos municípios atendidos por cada instituição têm até 50 mil habitantes.',
  },
  {
    group: 'geral',
    author: 'BRASIL. Banco Central do Brasil.',
    emphasis: 'DASFN — Catálogo de Dados Abertos das Instituições do SFN',
    after: '. Brasília, DF: Bacen, 2026.',
    url: 'https://dadosabertos.bcb.gov.br/dataset/canaisatendimento',
    accessedAt: ACCESS,
    note: 'Catálogo que aponta para a API de canais de atendimento de cada instituição do SFN — usado para localizar o endpoint do Sicoob (Sisbr) citado no grupo Sicoob.',
  },
  {
    group: 'geral',
    author: 'CAZANAVE, Victor.',
    emphasis: '@svg-maps/brazil',
    after: ': mapa vetorial das unidades da federação. Versão 2.0.0. [S. l.]: MapSVG, 2020. Licença CC BY 4.0.',
    url: 'https://github.com/VictorCazanave/svg-maps/tree/master/packages/brazil',
    accessedAt: ACCESS,
    note: 'Contorno cartográfico do mapa de presença por agências.',
  },
]
