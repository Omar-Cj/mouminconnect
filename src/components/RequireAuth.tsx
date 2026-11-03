import { Navigate, Outlet, useLocation } from 'react-router'
import type { Role } from '@/lib/types'
import { homeFor } from '@/lib/routes'
import { useAuth } from '@/store/store-context'

export function RequireAuth({ role }: { role?: Role }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  if (role && user.role !== role) return <Navigate to={homeFor(user.role)} replace />
  return <Outlet />
}

/** Redirects signed-in users away from auth pages. */
export function GuestOnly() {
  const { user } = useAuth()
  if (user) return <Navigate to={homeFor(user.role)} replace />
  return <Outlet />
}
