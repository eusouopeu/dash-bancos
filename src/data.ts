/**
 * Fonte: CVM — Dados Abertos, Demonstrações Financeiras Padronizadas (DFP),
 * AMBEV S.A. (CD_CVM 023264, CNPJ 07.526.557/0001-00), demonstrações
 * consolidadas ("ÚLTIMO" exercício de cada arquivo anual).
 * https://dados.cvm.gov.br/dataset/cia_aberta-doc-dfp
 * Valores em R$ mil, conforme reportado.
 */

export interface RawYear {
  year: number
  receitaLiquida: number
  cpv: number
  lucroBruto: number
  ebit: number
  lucroLiquido: number
  contasReceber: number
  estoques: number
  fornecedores: number
}

export const RAW_DATA: RawYear[] = [
  {
    year: 2019,
    receitaLiquida: 0,
    cpv: 0,
    lucroBruto: 0,
    ebit: 0,
    lucroLiquido: 0,
    contasReceber: 4_495_525,
    estoques: 5_978_557,
    fornecedores: 14_178_858,
  },
  {
    year: 2020,
    receitaLiquida: 58_378_995,
    cpv: 27_066_099,
    lucroBruto: 31_312_896,
    ebit: 15_928_890,
    lucroLiquido: 11_731_909,
    contasReceber: 4_303_138,
    estoques: 7_605_905,
    fornecedores: 18_182_126,
  },
  {
    year: 2021,
    receitaLiquida: 72_854_344,
    cpv: 35_659_744,
    lucroBruto: 37_194_600,
    ebit: 16_964_525,
    lucroLiquido: 13_122_582,
    contasReceber: 4_791_634,
    estoques: 11_000_346,
    fornecedores: 23_867_688,
  },
  {
    year: 2022,
    receitaLiquida: 79_708_827,
    cpv: 40_422_069,
    lucroBruto: 39_286_758,
    ebit: 17_658_840,
    lucroLiquido: 14_891_291,
    contasReceber: 5_349_105,
    estoques: 12_923_025,
    fornecedores: 23_498_099,
  },
  {
    year: 2023,
    receitaLiquida: 79_736_856,
    cpv: 39_291_571,
    lucroBruto: 40_445_285,
    ebit: 18_645_692,
    lucroLiquido: 14_960_459,
    contasReceber: 5_741_457,
    estoques: 9_619_022,
    fornecedores: 21_278_615,
  },
  {
    year: 2024,
    receitaLiquida: 89_452_669,
    cpv: 43_615_080,
    lucroBruto: 45_837_589,
    ebit: 21_805_576,
    lucroLiquido: 14_846_952,
    contasReceber: 6_269_863,
    estoques: 11_689_767,
    fornecedores: 24_042_927,
  },
]

export interface YearMetrics {
  year: number
  giroEstoque: number
  pme: number
  pmr: number
  pmp: number
  cicloDeCaixa: number
  ncg: number
  margemBruta: number
  margemOperacional: number
  margemLiquida: number
  receitaLiquida: number
}

function byYear(year: number): RawYear {
  const found = RAW_DATA.find((d) => d.year === year)
  if (!found) throw new Error(`Ano ${year} não encontrado nos dados`)
  return found
}

export function computeYearMetrics(cur: RawYear, prev: RawYear): YearMetrics {
  const estoqueMedio = (cur.estoques + prev.estoques) / 2
  const contasReceberMedio = (cur.contasReceber + prev.contasReceber) / 2
  const fornecedoresMedio = (cur.fornecedores + prev.fornecedores) / 2
  const compras = cur.cpv + cur.estoques - prev.estoques

  const giroEstoque = cur.cpv / estoqueMedio
  const pme = (estoqueMedio / cur.cpv) * 360
  const pmr = (contasReceberMedio / cur.receitaLiquida) * 360
  const pmp = (fornecedoresMedio / compras) * 360
  const cicloDeCaixa = pme + pmr - pmp
  const ncg = cicloDeCaixa * (cur.receitaLiquida / 360)

  return {
    year: cur.year,
    giroEstoque,
    pme,
    pmr,
    pmp,
    cicloDeCaixa,
    ncg,
    margemBruta: cur.lucroBruto / cur.receitaLiquida,
    margemOperacional: cur.ebit / cur.receitaLiquida,
    margemLiquida: cur.lucroLiquido / cur.receitaLiquida,
    receitaLiquida: cur.receitaLiquida,
  }
}

export const METRICS: YearMetrics[] = RAW_DATA.filter((d) => d.year >= 2020).map((cur) =>
  computeYearMetrics(cur, byYear(cur.year - 1)),
)

export const LATEST = METRICS[METRICS.length - 1]
