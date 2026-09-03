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
      patrimonioLiquido: null,
      ativoTotal: null,
      dividaBruta: null,
      caixaEquivalentes: null,
      despesaFinanceiraLiquida: null,
      depreciacaoAmortizacao: null,
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
      patrimonioLiquido: null,
      ativoTotal: null,
      dividaBruta: null,
      caixaEquivalentes: null,
      despesaFinanceiraLiquida: null,
      depreciacaoAmortizacao: null,
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
      patrimonioLiquido: null,
      ativoTotal: null,
      dividaBruta: null,
      caixaEquivalentes: null,
      despesaFinanceiraLiquida: null,
      depreciacaoAmortizacao: null,
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
      patrimonioLiquido: null,
      ativoTotal: null,
      dividaBruta: null,
      caixaEquivalentes: null,
      despesaFinanceiraLiquida: null,
      depreciacaoAmortizacao: null,
    }

    const result = computeYearMetrics(cur, prev)
    expect(result.cicloDeCaixa).toBeLessThan(0)
  })

  it('retorna null para ROE/ROA/ROIC/dívida enquanto os dados de capital não forem preenchidos', () => {
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
      patrimonioLiquido: null,
      ativoTotal: null,
      dividaBruta: null,
      caixaEquivalentes: null,
      despesaFinanceiraLiquida: null,
      depreciacaoAmortizacao: null,
    }
    const cur: RawYear = {
      ...prev,
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
    expect(result.roe).toBeNull()
    expect(result.roa).toBeNull()
    expect(result.roic).toBeNull()
    expect(result.giroAtivo).toBeNull()
    expect(result.alavancagemFinanceira).toBeNull()
    expect(result.dividaLiquida).toBeNull()
    expect(result.ebitda).toBeNull()
    expect(result.dividaLiquidaSobreEbitda).toBeNull()
    expect(result.coberturaJuros).toBeNull()
  })

  it('calcula ROE, ROA, ROIC e endividamento quando os dados de capital estão preenchidos', () => {
    const prev: RawYear = {
      year: 2000,
      receitaLiquida: 0,
      cpv: 0,
      lucroBruto: 0,
      ebit: 0,
      lucroLiquido: 0,
      contasReceber: 0,
      estoques: 0,
      fornecedores: 0,
      patrimonioLiquido: 800,
      ativoTotal: 2000,
      dividaBruta: 500,
      caixaEquivalentes: 100,
      despesaFinanceiraLiquida: 0,
      depreciacaoAmortizacao: 0,
    }
    const cur: RawYear = {
      year: 2001,
      receitaLiquida: 1200,
      cpv: 720,
      lucroBruto: 480,
      ebit: 240,
      lucroLiquido: 120,
      contasReceber: 0,
      estoques: 0,
      fornecedores: 0,
      patrimonioLiquido: 1000,
      ativoTotal: 2400,
      dividaBruta: 600,
      caixaEquivalentes: 200,
      despesaFinanceiraLiquida: 40,
      depreciacaoAmortizacao: 60,
    }

    const result = computeYearMetrics(cur, prev)

    // PL médio = (800+1000)/2=900, ativo médio=(2000+2400)/2=2200
    expect(result.roe).toBeCloseTo(120 / 900, 6)
    expect(result.roa).toBeCloseTo(120 / 2200, 6)
    expect(result.giroAtivo).toBeCloseTo(1200 / 2200, 6)
    expect(result.alavancagemFinanceira).toBeCloseTo(2200 / 900, 6)
    // DuPont: margem líquida × giro do ativo × alavancagem = ROE
    expect(result.margemLiquida * result.giroAtivo! * result.alavancagemFinanceira!).toBeCloseTo(
      result.roe!,
      9,
    )

    // capital investido = dívida bruta + PL - caixa: prev=(500+800-100)=1200, cur=(600+1000-200)=1400, médio=1300
    expect(result.roic).toBeCloseTo(240 / 1300, 6)

    // dívida líquida = 600-200=400; EBITDA = 240+60=300
    expect(result.dividaLiquida).toBeCloseTo(400, 6)
    expect(result.ebitda).toBeCloseTo(300, 6)
    expect(result.dividaLiquidaSobreEbitda).toBeCloseTo(400 / 300, 6)
    expect(result.coberturaJuros).toBeCloseTo(240 / 40, 6)
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
