export function formatPercent(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`
}

export function formatPercentSigned(value: number, digits = 1): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${(value * 100).toFixed(digits)}pp`
}

/** valueInMillions: valor em R$ milhões, como reportado pelas instituições. */
export function formatBRLBillions(valueInMillions: number): string {
  const billions = valueInMillions / 1_000
  return `R$ ${billions.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} bi`
}
