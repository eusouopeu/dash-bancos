/**
 * Comparação setorial (benchmarking) — indicadores dos mesmos anos para
 * concorrentes diretos da Ambev, para contextualizar se os números da
 * empresa são bons/ruins frente ao setor.
 *
 * TODO: preencher com 1-2 concorrentes diretos (ex.: Heineken Brasil,
 * Coca-Cola FEMSA/Femsa Brasil) usando a mesma metodologia de `data.ts`
 * (fonte pública — CVM para empresas listadas no Brasil, ou demonstrações
 * financeiras publicadas para subsidiárias de multinacionais). Enquanto
 * a lista estiver vazia, a seção de benchmarking exibe um aviso de "dados
 * pendentes" em vez de um gráfico vazio.
 */
export interface ConcorrenteAno {
  empresa: string
  year: number
  giroEstoque: number | null
  cicloDeCaixa: number | null
  margemLiquida: number | null
}

export const CONCORRENTES: ConcorrenteAno[] = []
