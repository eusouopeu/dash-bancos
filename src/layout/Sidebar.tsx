import {
  BookOpenIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'
import { INSTITUTIONS } from '../data'

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
      <div className="mb-9 px-1">
        <p className="eyebrow !text-white/45">Análise comparativa</p>
        <p className="mt-2 text-[15px] font-semibold leading-tight text-paper">
          Três modelos de
          <br />
          propriedade bancária
        </p>
        <p className="mt-2 font-mono text-[11px] text-white/45">2022 — 2025</p>
      </div>

      <nav className="flex flex-1 flex-col gap-7">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="eyebrow mb-2.5 px-1 !text-white/40">{section.title}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-white/10 font-semibold text-paper'
                          : 'font-medium text-white/60 hover:bg-white/5 hover:text-paper'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={`h-4.5 w-4.5 ${isActive ? 'text-petrol' : 'text-white/40 group-hover:text-white/70'}`}
                        />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-8 border-t border-white/10 pt-4">
        <p className="eyebrow mb-2.5 px-1 !text-white/40">Legenda</p>
        <ul className="space-y-1.5 px-1">
          {INSTITUTIONS.map((inst) => (
            <li key={inst.id} className="flex items-center gap-2">
              <span
                className="h-0.5 w-4 shrink-0 rounded-full"
                style={{ backgroundColor: inst.id === 'bb' ? '#f5f3ee' : inst.color }}
              />
              <span className="font-mono text-[11px] text-white/70">{inst.shortName}</span>
              <span className="truncate text-[11px] text-white/35">{inst.category}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-ink px-4 py-7 lg:flex">
      <SidebarContent />
    </aside>
  )
}
