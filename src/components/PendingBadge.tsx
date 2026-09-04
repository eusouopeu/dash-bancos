export function PendingBadge({ text = 'Dado pendente' }: { text?: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-dashed border-ember/45 bg-ember-soft px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-ember">
      {text}
    </span>
  )
}
