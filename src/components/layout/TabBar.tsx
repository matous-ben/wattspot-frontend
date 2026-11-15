import { House, Settings, Sparkles, WashingMachine } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

const navigation = [
  { to: '/dashboard', label: 'Domů', icon: House },
  { to: '/recommendations', label: 'Doporučení', icon: Sparkles },
  { to: '/appliances', label: 'Spotřebiče', icon: WashingMachine },
  { to: '/settings', label: 'Profil', icon: Settings },
]

type TabBarProps = {
  className?: string
}

export function TabBar({ className = '' }: TabBarProps) {
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="Hlavní navigace"
      className={`fixed inset-x-0 bottom-0 z-10 h-16 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden ${className}`}
    >
      <div className="mx-auto flex h-full max-w-md items-center justify-around">
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => {
              const isHomeSection = to === '/dashboard' && pathname === '/prices'
              const active = isActive || isHomeSection

              return (
              `flex min-h-11 min-w-16 flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium ${
                active ? 'text-accent' : 'text-fg-muted'
              }`
              )
            }}
          >
            <Icon aria-hidden="true" size={24} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
