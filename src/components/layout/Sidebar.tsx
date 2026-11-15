import { House, LogOut, Settings, Sparkles, WashingMachine } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

const navigation = [
  { to: '/dashboard', label: 'Domů', icon: House },
  { to: '/recommendations', label: 'Doporučení', icon: Sparkles },
  { to: '/appliances', label: 'Spotřebiče', icon: WashingMachine },
  { to: '/settings', label: 'Profil', icon: Settings },
]

type SidebarProps = {
  className?: string
}

export function Sidebar({ className = '' }: SidebarProps) {
  const { pathname } = useLocation()

  return (
    <aside
      aria-label="Postranní navigace"
      className={`hidden w-60 shrink-0 flex-col border-r border-line p-4 lg:flex ${className}`}
    >
      <div className="mb-8 px-3 text-lg font-semibold">WattSpot</div>
      <nav className="flex flex-col gap-2">
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => {
              const isHomeSection = to === '/dashboard' && pathname === '/prices'
              const active = isActive || isHomeSection

              return (
              `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold ${
                active ? 'bg-surface-2 text-fg' : 'text-fg-muted hover:bg-surface-2'
              }`
              )
            }}
          >
            <Icon aria-hidden="true" size={24} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        className="mt-auto flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-fg-muted hover:bg-surface-2"
      >
        <LogOut aria-hidden="true" size={24} strokeWidth={2} />
        <span>Odhlásit se</span>
      </button>
    </aside>
  )
}
