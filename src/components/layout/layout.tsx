import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sidebar } from './sidebar'
import ninnyLogo from '@/assets/ninny-logo.avif'

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-[#fdf8f0]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-[#025c2b] px-4 py-3 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-white p-1.5 -ml-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <img src={ninnyLogo} alt="Ninny" className="h-8 w-8 object-contain" />
          <span className="text-white font-semibold">Ninny BSFT</span>
        </header>

        <main className="flex-1 overflow-auto">
          {/* key força remontagem → transição de fade entre páginas */}
          <div key={location.pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
