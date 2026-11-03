import { useState, type MouseEvent, type ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { Globe, LogOut, Menu, X, type LucideIcon } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Avatar } from '@/components/ui/Misc'
import { useAuth } from '@/store/store-context'
import { cx } from '@/lib/format'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

interface Props {
  nav: NavItem[]
  areaLabel: string
  footer?: ReactNode
}

export function DashboardLayout({ nav, areaLabel, footer }: Props) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  // close the mobile drawer as soon as any link inside it is followed
  const closeOnNavigate = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false)
  }

  const items = (
    <ul className="space-y-1">
      {nav.map((n) => (
        <li key={n.to}>
          <NavLink
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              cx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                isActive ? 'bg-white/10 text-white shadow-inner' : 'text-slate-300 hover:bg-white/5 hover:text-white',
              )
            }
          >
            <n.icon className="size-[18px]" />
            {n.label}
          </NavLink>
        </li>
      ))}
    </ul>
  )

  const userCard = user && (
    <div className="rounded-xl bg-white/5 p-3">
      <div className="flex items-center gap-3">
        <Avatar name={user.name} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="truncate text-xs text-slate-400">{user.email}</p>
        </div>
        <button onClick={logout} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Log out" title="Log out">
          <LogOut className="size-4" />
        </button>
      </div>
    </div>
  )

  const sidebar = (
    <div className="flex h-full flex-col" onClick={closeOnNavigate}>
      <div className="flex items-center justify-between px-4 py-5">
        <Logo tone="dark" />
        <button className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="size-5" />
        </button>
      </div>
      <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-400">{areaLabel}</p>
      <nav className="flex-1 overflow-y-auto px-3" aria-label={areaLabel}>
        {items}
        <div className="my-4 border-t border-white/10" />
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white">
          <Globe className="size-[18px]" /> Public website
        </Link>
      </nav>
      <div className="space-y-3 p-3">
        {footer}
        {userCard}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* desktop sidebar */}
      <aside className="hidden w-72 shrink-0 bg-navy-900 lg:fixed lg:inset-y-0 lg:block">{sidebar}</aside>
      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <aside className="absolute inset-y-0 left-0 w-[85%] max-w-xs bg-navy-900 shadow-lift animate-fade-up">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden">
          <Logo />
          <button className="rounded-lg p-2 text-navy-900 hover:bg-slate-100" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-6" />
          </button>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
