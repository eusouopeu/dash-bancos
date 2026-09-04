import { describe, expect, it } from 'vitest'
import { bestByIndicator, dataFor, institutionById, YEARS } from './data'

describe('dataFor', () => {
  it('retorna os dados corretos para cada instituição e ano', () => {
    const sicoob2024 = dataFor('sicoob', 2024)
    expect(sicoob2024.institution).toBe('sicoob')
    expect(sicoob2024.year).toBe(2024)
  })

  it('lança erro para uma combinação sem dados', () => {
    expect(() => dataFor('sicoob', 1999)).toThrow()
  })
})

describe('institutionById', () => {
  it('resolve as três instituições cadastradas', () => {
    expect(institutionById('bb').shortName).toBe('BB')
    expect(institutionById('itau').shortName).toBe('Itaú')
  })
})

describe('bestByIndicator', () => {
  it('identifica o maior ROE do último ano', () => {
    const latestYear = YEARS[YEARS.length - 1]
    const result = bestByIndicator(latestYear, 'roe', 'max')
    expect(result.value).toBeGreaterThan(0)
  })

  it('identifica a menor inadimplência do último ano', () => {
    const latestYear = YEARS[YEARS.length - 1]
    const result = bestByIndicator(latestYear, 'inadimplencia', 'min')
    expect(result.value).toBeGreaterThanOrEqual(0)
  })
})
