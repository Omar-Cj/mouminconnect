import type { ReactNode } from 'react'
import { Check, XCircle } from 'lucide-react'
import type { InquiryStatus } from '@/lib/types'
import { STATUS, STATUS_FLOW } from '@/lib/constants'
import { avatarColor, cx, initials } from '@/lib/format'

export function Avatar({ name, size = 'md', className }: { name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-12 text-base', xl: 'size-16 text-xl' }
  return (
    <span
      className={cx('inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white', sizes[size], className)}
      style={{ backgroundColor: avatarColor(name) }}
      aria-hidden
    >
      {initials(name)}
    </span>
  )
}

export function CompanyMark({ name, accent, size = 'md', className }: { name: string; accent: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const sizes = { sm: 'size-9 text-xs', md: 'size-12 text-sm', lg: 'size-14 text-base', xl: 'size-20 text-2xl' }
  return (
    <span
      className={cx('inline-flex shrink-0 items-center justify-center rounded-xl font-display font-extrabold text-white shadow-sm', sizes[size], className)}
      style={{ backgroundColor: accent }}
      aria-hidden
    >
      {initials(name)}
    </span>
  )
}

export function EmptyState({ icon, title, description, action, className }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-12 text-center', className)}>
      {icon && <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white text-navy-600 shadow-soft">{icon}</div>}
      <h3 className="font-display text-base font-bold text-navy-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function StatCard({ label, value, icon, hint, tone = 'navy' }: { label: string; value: ReactNode; icon: ReactNode; hint?: string; tone?: 'navy' | 'gold' | 'green' | 'amber' }) {
  const tones = {
    navy: 'bg-navy-50 text-navy-700',
    gold: 'bg-gold-100 text-gold-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  }
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={cx('flex size-12 shrink-0 items-center justify-center rounded-xl', tones[tone])}>{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="font-display text-2xl font-extrabold text-navy-900">{value}</p>
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    </div>
  )
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-600">{eyebrow}</p>}
        <h1 className="font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function StatusStepper({ status, compact = false }: { status: InquiryStatus; compact?: boolean }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-200">
        <XCircle className="size-4" /> This inquiry was cancelled.
      </div>
    )
  }
  const current = status === 'completed' ? STATUS_FLOW.length : STATUS[status].step
  return (
    <ol className={cx('grid gap-2', compact ? 'grid-cols-5' : 'grid-cols-5 sm:gap-3')} aria-label="Progress">
      {STATUS_FLOW.map((s, idx) => {
        const done = idx < current
        const active = idx === current && status !== 'completed'
        return (
          <li key={s} className="min-w-0">
            <div className={cx('h-1.5 rounded-full', done ? 'bg-gold-500' : active ? 'bg-navy-700' : 'bg-slate-200')} />
            {!compact && (
              <div className="mt-2 flex items-start gap-1.5">
                <span
                  className={cx(
                    'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                    done ? 'bg-gold-500 text-navy-950' : active ? 'bg-navy-700 text-white' : 'bg-slate-200 text-slate-500',
                  )}
                >
                  {done ? <Check className="size-3" strokeWidth={3} /> : idx + 1}
                </span>
                <span className={cx('hidden text-xs leading-tight sm:block', done || active ? 'font-semibold text-navy-900' : 'text-slate-500')}>{STATUS[s].label}</span>
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cx('border-slate-100', className)} />
}

export function DescriptionList({ items, className }: { items: Array<{ label: string; value: ReactNode }>; className?: string }) {
  return (
    <dl className={cx('grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2', className)}>
      {items.map((it) => (
        <div key={it.label}>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{it.label}</dt>
          <dd className="mt-0.5 text-sm font-medium text-navy-900">{it.value}</dd>
        </div>
      ))}
    </dl>
  )
}
