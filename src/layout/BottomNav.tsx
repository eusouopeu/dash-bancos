import { NavLink } from 'react-router-dom'
import { SECTIONS } from './Sidebar'

const ITEMS = SECTIONS.flatMap((section) => section.items)

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white lg:hidden">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          aria-label={item.label}
          title={item.label}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium ${
              isActive ? 'text-emerald-700' : 'text-slate-400'
            }`
          }
        >
          <item.icon className="h-5 w-5" />
        </NavLink>
      ))}
    </nav>
  )
}
