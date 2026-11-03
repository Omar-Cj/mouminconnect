import { cx } from '@/lib/format'

export type ButtonVariant = 'primary' | 'gold' | 'outline' | 'ghost' | 'danger' | 'white' | 'subtle'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-navy-800 text-white shadow-sm hover:bg-navy-700 focus-visible:ring-navy-500/25',
  gold: 'bg-gold-500 text-navy-950 shadow-sm hover:bg-gold-400 focus-visible:ring-gold-500/30',
  outline: 'border border-navy-200 bg-white text-navy-800 hover:border-navy-300 hover:bg-navy-50 focus-visible:ring-navy-500/15',
  ghost: 'text-navy-800 hover:bg-navy-50 focus-visible:ring-navy-500/15',
  subtle: 'bg-navy-50 text-navy-800 hover:bg-navy-100 focus-visible:ring-navy-500/15',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500/25',
  white: 'bg-white text-navy-900 shadow-sm hover:bg-navy-50 focus-visible:ring-white/40',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cx(base, variants[variant], sizes[size], className)
}
