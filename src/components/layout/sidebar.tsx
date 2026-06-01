import { NavLink } from 'react-router-dom'
import { BookOpen, BarChart2, TrendingUp, ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/', icon: BookOpen, label: 'Fichas Técnicas' },
  { to: '/precificacao', icon: BarChart2, label: 'Precificação' },
  { to: '/cmv', icon: TrendingUp, label: 'CMV' },
]

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-[#1a2e1f] min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-full bg-[#c9a84c] flex items-center justify-center shrink-0">
          <ChefHat size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">Ninny</p>
          <p className="text-white/50 text-xs">Gestão</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-[#c9a84c]/20 text-[#c9a84c] font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
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
