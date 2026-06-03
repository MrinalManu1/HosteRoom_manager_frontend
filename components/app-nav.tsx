'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { NotificationDrawer } from './notification-drawer'

const navItems = [
  { href: '/dashboard', label: 'Home', emoji: '🏠' },
  { href: '/inventory', label: 'Inventory', emoji: '📦' },
  { href: '/add-item', label: 'Add Item', emoji: '➕' },
  { href: '/activity', label: 'Activity', emoji: '📡' },
  { href: '/household', label: 'Household', emoji: '👥' },
]

export function AppNav() {
  const pathname = usePathname()
  const user = useAppSelector((state) => state.auth.user)

  return (
    <nav className="cozy-card-static p-2 md:p-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 px-3">
          <span className="text-2xl">🥬</span>
          <span className="font-extrabold text-lg hidden sm:inline">ShelfLife</span>
        </Link>

        {/* Nav Items */}
        <div className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-xl font-bold text-sm md:text-base
                  border-2 border-transparent transition-all
                  ${isActive 
                    ? 'bg-primary border-foreground' 
                    : 'hover:bg-background hover:border-foreground'
                  }
                `}
              >
                <span>{item.emoji}</span>
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Right side: Notifications & Profile */}
        <div className="flex items-center gap-2">
          <NotificationDrawer />
          <Link href="/" className="cozy-card p-2 md:p-3 flex items-center gap-2">
            <span className="text-xl">👤</span>
            <span className="hidden lg:inline font-bold text-sm">{user?.name || 'Alex'}</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
