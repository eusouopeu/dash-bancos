import { describe, expect, it } from 'vitest'
import { computeYearMetrics, METRICS, type RawYear } from './data'

describe('computeYearMetrics', () => {
  it('calcula giro, prazos, ciclo de caixa, NCG e margens a partir de saldos médios', () => {
    const prev: RawYear = {
      year: 2000,
      receitaLiquida: 0,
      cpv: 0,
      lucroBruto: 0,
      ebit: 0,
      lucroLiquido: 0,
      contasReceber: 100,
      estoques: 150,
      fornecedores: 200,
    }
    const cur: RawYear = {
      year: 2001,
      receitaLiquida: 1200,
      cpv: 720,
      lucroBruto: 480,
      ebit: 240,
      lucroLiquido: 120,
      contasReceber: 140,
      estoques: 210,
      fornecedores: 260,
    }

    const result = computeYearMetrics(cur, prev)

    // saldos médios: estoque (150+210)/2=180, receber (100+140)/2=120, fornecedores (200+260)/2=230
    // compras = 720 + 210 - 150 = 780
    expect(result.giroEstoque).toBeCloseTo(720 / 180, 6) // 4x
    expect(result.pme).toBeCloseTo((180 / 720) * 360, 6) // 90 dias
    expect(result.pmr).toBeCloseTo((120 / 1200) * 360, 6) // 36 dias
    expect(result.pmp).toBeCloseTo((230 / 780) * 360, 6) // ~106.15 dias
    expect(result.cicloDeCaixa).toBeCloseTo(result.pme + result.pmr - result.pmp, 9)
    expect(result.ncg).toBeCloseTo(result.cicloDeCaixa * (1200 / 360), 6)
    expect(result.margemBruta).toBeCloseTo(0.4, 6)
    expect(result.margemOperacional).toBeCloseTo(0.2, 6)
    expect(result.margemLiquida).toBeCloseTo(0.1, 6)
  })

  it('gera ciclo de caixa negativo quando o prazo de pagamento supera estocagem + recebimento', () => {
    const prev: RawYear = {
      year: 2000,
      receitaLiquida: 0,
      cpv: 0,
      lucroBruto: 0,
      ebit: 0,
      lucroLiquido: 0,
      contasReceber: 10,
      estoques: 20,
      fornecedores: 500,
    }
    const cur: RawYear = {
      year: 2001,
      receitaLiquida: 1000,
      cpv: 600,
      lucroBruto: 400,
      ebit: 100,
      lucroLiquido: 50,
      contasReceber: 10,
      estoques: 20,
      fornecedores: 500,
    }

    const result = computeYearMetrics(cur, prev)
    expect(result.cicloDeCaixa).toBeLessThan(0)
  })
})

describe('METRICS (dados reais CVM — AMBEV S.A.)', () => {
  it('cobre a série contínua de 2020 a 2024', () => {
    expect(METRICS.map((m) => m.year)).toEqual([2020, 2021, 2022, 2023, 2024])
  })

  it('mantém margens dentro de faixas plausíveis (0% a 100%)', () => {
    for (const m of METRICS) {
      expect(m.margemBruta).toBeGreaterThan(0)
      expect(m.margemBruta).toBeLessThan(1)
      expect(m.margemLiquida).toBeGreaterThan(0)
      expect(m.margemLiquida).toBeLessThan(1)
      expect(m.margemOperacional).toBeGreaterThanOrEqual(m.margemLiquida)
    }
  })

  it('mantém o ciclo de caixa negativo em todos os anos (financiado por fornecedores)', () => {
    for (const m of METRICS) {
      expect(m.cicloDeCaixa).toBeLessThan(0)
    }
  })
})
