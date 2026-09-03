export function formatPercent(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`
}

export function formatDays(value: number): string {
  return `${value.toFixed(0)} dias`
}

export function formatBRL(valueInThousands: number): string {
  const value = valueInThousands * 1000
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

export function formatBRLCompact(valueInThousands: number): string {
  const billions = valueInThousands / 1_000_000
  return `R$ ${billions.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} bi`
}
