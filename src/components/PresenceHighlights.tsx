import type { PresenceHighlight } from '../data'

interface PresenceHighlightsProps {
  items: PresenceHighlight[]
}

export function PresenceHighlights({ items }: PresenceHighlightsProps) {
  return (
    <ul className="divide-y divide-rule-soft">
      {items.map((item) => (
        <li key={item.label} className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0">
          <span className="text-[13px] leading-snug text-muted">{item.label}</span>
          <span className="flex shrink-0 items-baseline gap-1.5 text-right">
            <span className="tnum font-mono text-base font-semibold text-ink">{item.stat}</span>
            <span className="font-mono text-[10px] text-muted">{item.asOf}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
