import type { Role } from './types'

export function homeFor(role: Role | undefined | null): string {
  return role === 'admin' ? '/admin' : '/app'
}
