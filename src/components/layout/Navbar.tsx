import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { ArrowRight, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { ButtonLink } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Misc'
import { useAuth } from '@/store/store-context'
import { homeFor } from '@/lib/routes'
import { cx } from '@/lib/format'

const links = [
  { to: '/how-it-works', label: 'How it works' },
  { to: '/services', label: 'Services' },
  { to: '/companies', label: 'Companies' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    // close the mobile menu when navigating
    setOpen(false)
  }, [pathname])

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cx(
      'rounded-lg px-3 py-2 text-sm font-semibold transition',
      isActive ? 'bg-navy-50 text-navy-900' : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900',
    )

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <ButtonLink to={homeFor(user.role)} variant="subtle" size="sm">
                <LayoutDashboard className="size-4" /> {user.role === 'admin' ? 'Admin panel' : 'My dashboard'}
              </ButtonLink>
              <div className="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3">
                <Avatar name={user.name} size="sm" />
                <button onClick={logout} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-navy-900" aria-label="Log out" title="Log out">
                  <LogOut className="size-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <ButtonLink to="/login" variant="ghost" size="sm">
                Log in
              </ButtonLink>
              <ButtonLink to="/register" variant="gold" size="sm">
                Start your project <ArrowRight className="size-4" />
              </ButtonLink>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-navy-900 hover:bg-slate-100 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden animate-fade-up">
          <nav className="container-x flex flex-col py-3" aria-label="Mobile">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => cx('rounded-lg px-3 py-2.5 text-base font-semibold', isActive ? 'bg-navy-50 text-navy-900' : 'text-slate-700')}>
                {l.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar name={user.name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-navy-900">{user.name}</p>
                      <p className="truncate text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <ButtonLink to={homeFor(user.role)} variant="primary">
                    <LayoutDashboard className="size-4" /> {user.role === 'admin' ? 'Admin panel' : 'My dashboard'}
                  </ButtonLink>
                  <button onClick={logout} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    <LogOut className="size-4" /> Log out
                  </button>
                </>
              ) : (
                <>
                  <ButtonLink to="/login" variant="outline">
                    Log in
                  </ButtonLink>
                  <ButtonLink to="/register" variant="gold">
                    Start your project <ArrowRight className="size-4" />
                  </ButtonLink>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
