import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, BarChart2, TrendingUp, X, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import ninnyLogo from '@/assets/ninny-logo.avif'

const NAV = [
  { to: '/',            icon: LayoutDashboard, label: 'Visão Geral',     end: true  },
  { to: '/fichas',      icon: BookOpen,        label: 'Fichas Técnicas', end: false },
  { to: '/precificacao',icon: BarChart2,       label: 'Precificação',    end: true  },
  { to: '/cmv',         icon: TrendingUp,      label: 'CMV',             end: true  },
]

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { user, authDisabled, signOut } = useAuth()
  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'w-60 shrink-0 bg-[#025c2b] min-h-screen flex flex-col z-50 transition-transform duration-300',
          'lg:translate-x-0 lg:static',
          'fixed inset-y-0 left-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo + nome */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <img src={ninnyLogo} alt="Ninny" className="w-12 h-12 object-contain shrink-0" />
          <div className="min-w-0">
            <p className="text-white font-bold leading-tight">Ninny</p>
            <p className="text-white/50 text-xs">Gestão BSFT</p>
          </div>
          {/* Fechar no mobile */}
          <button
            onClick={onClose}
            className="lg:hidden ml-auto text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
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

        <div className="px-3 py-4 border-t border-white/10 space-y-3">
          {!authDisabled && user && (
            <div className="px-2">
              <p className="text-white/40 text-[10px] uppercase tracking-wide">Conectado como</p>
              <p className="text-white/80 text-xs truncate">{user.email}</p>
            </div>
          )}
          {!authDisabled && user && (
            <button
              onClick={() => { signOut(); onClose() }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all"
            >
              <LogOut size={16} />
              Sair
            </button>
          )}
          <p className="text-white/30 text-xs px-2">Ninny BSFT v1.0</p>
        </div>
      </aside>
    </>
  )
}
