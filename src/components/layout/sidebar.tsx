import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, BarChart2, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import ninnyLogo from '@/assets/ninny-logo.avif'

const NAV = [
  { to: '/',            icon: LayoutDashboard, label: 'Visão Geral',     end: true  },
  { to: '/fichas',      icon: BookOpen,        label: 'Fichas Técnicas', end: false },
  { to: '/precificacao',icon: BarChart2,       label: 'Precificação',    end: true  },
  { to: '/cmv',         icon: TrendingUp,      label: 'CMV',             end: true  },
]

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-[#025c2b] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="flex flex-col items-center px-4 py-5 border-b border-white/10">
        <img src={ninnyLogo} alt="Ninny" className="w-28 h-28 object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                isActive
                  ? 'bg-white/15 text-white font-semibold border-l-2 border-[#03a54e]'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-white/30 text-xs">Ninny BSFT v1.0</p>
      </div>
    </aside>
  )
}
