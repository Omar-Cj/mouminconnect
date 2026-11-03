import type { ReactNode } from 'react'
import type { InquiryStatus } from '@/lib/types'
import { STATUS } from '@/lib/constants'
import { cx } from '@/lib/format'

export type Tone = 'navy' | 'gold' | 'green' | 'red' | 'slate' | 'blue' | 'amber' | 'purple'

const tones: Record<Tone, string> = {
  navy: 'bg-navy-100 text-navy-800 ring-navy-200',
  gold: 'bg-gold-100 text-gold-800 ring-gold-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  blue: 'bg-sky-50 text-sky-700 ring-sky-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  purple: 'bg-violet-50 text-violet-700 ring-violet-200',
}

const dots: Record<Tone, string> = {
  navy: 'bg-navy-600',
  gold: 'bg-gold-500',
  green: 'bg-emerald-500',
  red: 'bg-red-500',
  slate: 'bg-slate-400',
  blue: 'bg-sky-500',
  amber: 'bg-amber-500',
  purple: 'bg-violet-500',
}

export function Badge({ tone = 'slate', dot = false, className, children }: { tone?: Tone; dot?: boolean; className?: string; children: ReactNode }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset', tones[tone], className)}>
      {dot && <span className={cx('size-1.5 rounded-full', dots[tone])} />}
      {children}
    </span>
  )
}

export const STATUS_TONE: Record<InquiryStatus, Tone> = {
  submitted: 'blue',
  under_review: 'amber',
  matched: 'navy',
  meeting_scheduled: 'purple',
  agreement: 'gold',
  completed: 'green',
  cancelled: 'red',
}

export function StatusBadge({ status, className }: { status: InquiryStatus; className?: string }) {
  return (
    <Badge tone={STATUS_TONE[status]} dot className={className}>
      {STATUS[status].label}
    </Badge>
  )
}
