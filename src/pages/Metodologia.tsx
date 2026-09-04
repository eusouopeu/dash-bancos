import type { ComponentType, ReactNode, SVGProps } from 'react'
import {
  ArrowTrendingUpIcon,
  ChartPieIcon,
  ExclamationTriangleIcon,
  FlagIcon,
  GlobeAmericasIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { ASSUMPTIONS, FORMULAS, LIMITATIONS, institutionById, type Formula } from '../data'
import { PageHeader } from '../layout/PageHeader'

type Icon = ComponentType<SVGProps<SVGSVGElement>>

const ICONS: Record<Formula['icon'], Icon> = {
  trending: ArrowTrendingUpIcon,
  pie: ChartPieIcon,
  scale: ScaleIcon,
  warning: ExclamationTriangleIcon,
  flag: FlagIcon,
  globe: GlobeAmericasIcon,
}

/** Cabeçalho de bloco: filete à esquerda, título e uma linha dizendo o que vem abaixo. */
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="border-l-2 border-ink pl-4">
      <h2 className="text-lg font-bold tracking-[-0.015em] text-ink">{title}</h2>
      <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-muted">{subtitle}</p>
    </header>
  )
}

/** Razão escrita como fração: numerador sobre um traço, denominador embaixo. */
function Fraction({ numerator, denominator, factor }: Pick<Formula, 'numerator' | 'denominator' | 'factor'>) {
  return (
    <div className="flex items-center justify-center gap-2.5 rounded-md bg-paper px-4 py-5">
      <div className="text-center font-mono text-[12px] leading-relaxed text-ink">
        <span className="block border-b border-ink/40 px-2 pb-1">{numerator}</span>
        <span className="block px-2 pt-1">{denominator}</span>
      </div>
      {factor && <span className="font-mono text-[12px] text-muted">{factor}</span>}
    </div>
  )
}

function DirectionBadge({ better }: { better: Formula['better'] }) {
  const isMax = better === 'max'
  const Arrow = isMax ? ArrowUpIcon : ArrowDownIcon
  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em]"
      style={
        isMax
          ? { backgroundColor: 'var(--color-petrol-soft)', color: 'var(--color-petrol)' }
          : { backgroundColor: 'var(--color-ember-soft)', color: '#a84b18' }
      }
    >
      <Arrow className="h-3 w-3" />
      {isMax ? 'maior é melhor' : 'menor é melhor'}
    </span>
  )
}

function FormulaCard({ formula }: { formula: Formula }) {
  const Icon = ICONS[formula.icon]
  return (
    <article className="flex flex-col rounded-lg border border-rule bg-surface p-5">
      <div className="mb-4 flex items-start gap-2.5">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-petrol" aria-hidden />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-snug text-ink">{formula.name}</h3>
          {formula.abbr && (
            <p className="mt-0.5 font-mono text-[11px] text-muted">{formula.abbr}</p>
          )}
        </div>
      </div>

      <Fraction
        numerator={formula.numerator}
        denominator={formula.denominator}
        factor={formula.factor}
      />

      <p className="mt-4 text-[13px] leading-relaxed text-muted">{formula.meaning}</p>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-rule-soft pt-3.5">
        <span className="eyebrow">{formula.unit}</span>
        <DirectionBadge better={formula.better} />
      </div>
    </article>
  )
}

/** Lista de marcadores com o ponto na cor do bloco. */
function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span
            className="mt-[7px] h-1 w-1 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <p className="text-[13px] leading-relaxed text-muted">{item}</p>
        </li>
      ))}
    </ul>
  )
}

function Block({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

export function Metodologia() {
  return (
    <>
      <PageHeader
        eyebrow="Como ler os números"
        title="Metodologia"
        subtitle="As contas, as escolhas por trás delas e o que este comparativo não consegue afirmar"
      />
      <main className="mx-auto max-w-4xl space-y-10 px-6 py-8 pb-24 lg:px-10 lg:pb-10">
        <Block>
          <SectionHeader
            title="Fórmulas"
            subtitle="Os seis indicadores calculados neste painel, com a definição exata usada, a unidade do resultado e o sentido da leitura."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {FORMULAS.map((f) => (
              <FormulaCard key={f.name} formula={f} />
            ))}
          </div>
        </Block>

        <Block>
          <SectionHeader
            title="Premissas"
            subtitle="As escolhas de cálculo que precisam estar explícitas para o comparativo se sustentar."
          />
          <div className="space-y-4">
            {ASSUMPTIONS.map((group) => {
              const color = group.institution
                ? institutionById(group.institution).color
                : 'var(--color-muted)'
              return (
                <section key={group.title} className="rounded-lg border border-rule bg-surface p-5">
                  <div className="mb-4 border-b border-rule-soft pb-3.5">
                    <h3 className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                      {group.institution && (
                        <span
                          className="h-3 w-0.5 rounded-full"
                          style={{ backgroundColor: color }}
                          aria-hidden
                        />
                      )}
                      {group.title}
                    </h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted">{group.scope}</p>
                  </div>
                  <BulletList items={group.items} color={color} />
                </section>
              )
            })}
          </div>
        </Block>

        <Block>
          <SectionHeader
            title="Limitações"
            subtitle="O que este comparativo não consegue afirmar, e por quê."
          />
          <section className="rounded-lg border border-rule bg-surface p-5">
            <BulletList items={LIMITATIONS} color="var(--color-ember)" />
          </section>
        </Block>
      </main>
    </>
  )
}
