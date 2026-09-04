const ptBR = (value: number, digits: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits })

export function formatPercent(value: number, digits = 1): string {
  return `${ptBR(value * 100, digits)}%`
}

export function formatPercentSigned(value: number, digits = 1): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${ptBR(value * 100, digits)}pp`
}

/** valueInMillions: valor em R$ milhões, como reportado pelas instituições. */
export function formatBRLBillions(valueInMillions: number): string {
  const billions = valueInMillions / 1_000
  return `R$ ${billions.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} bi`
}

export function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR')
}
