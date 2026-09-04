import {
  BookOpenIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'

export interface NavItem {
  label: string
  to: string
  icon: typeof HomeIcon
  end?: boolean
}

interface NavSection {
  title: string
  items: NavItem[]
}

export const SECTIONS: NavSection[] = [
  {
    title: 'Visão geral',
    items: [{ label: 'Panorama geral', to: '/', icon: HomeIcon, end: true }],
  },
  {
    title: 'Comparação',
    items: [
      { label: 'Tabela de indicadores', to: '/tabela-de-indicadores', icon: ClipboardDocumentListIcon },
    ],
  },
  {
    title: 'Sobre',
    items: [
      { label: 'Fontes de dados', to: '/fontes-de-dados', icon: LinkIcon },
      { label: 'Metodologia', to: '/metodologia', icon: BookOpenIcon },
    ],
  },
]

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
          P
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">Pedro</p>
          <p className="text-[11px] leading-tight text-slate-400">análise · dados · estratégia</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <item.icon className="h-4.5 w-4.5" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <blockquote className="mt-6 border-l-2 border-emerald-500 pl-3 text-xs italic leading-relaxed text-slate-500">
        Cooperar para transformar realidades financeiras e construir futuro.
      </blockquote>

      <div className="mt-4 flex items-center gap-2 px-2">
        <span className="text-sm font-extrabold italic tracking-tight text-emerald-700">Sicoob</span>
      </div>
      <div className="mt-3 h-1 w-full rounded-full bg-emerald-600" />
    </>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
      <SidebarContent />
    </aside>
  )
}
