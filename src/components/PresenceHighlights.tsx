import type { PresenceHighlight } from '../data'

interface PresenceHighlightsProps {
  items: PresenceHighlight[]
}

export function PresenceHighlights({ items }: PresenceHighlightsProps) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label} className="flex items-baseline justify-between gap-3">
          <span className="text-xs text-slate-500">{item.label}</span>
          <span className="flex items-baseline gap-1.5 text-right">
            <span className="text-lg font-extrabold text-slate-900">{item.stat}</span>
            <span className="text-[10px] text-slate-400">{item.asOf}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
