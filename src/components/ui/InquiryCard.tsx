import { Link } from 'react-router'
import { ArrowRight, Building2, MapPin, Wallet } from 'lucide-react'
import type { Inquiry } from '@/lib/types'
import { PROJECT_TYPES } from '@/lib/constants'
import { fmtRange, timeAgo } from '@/lib/format'
import { StatusBadge } from './Badge'
import { StatusStepper } from './Misc'
import { ProjectTypeIcon } from './ProjectTypeIcon'
import { useStore } from '@/store/store-context'

export function InquiryCard({ inquiry, to }: { inquiry: Inquiry; to: string }) {
  const { companies } = useStore()
  const company = companies.find((c) => c.id === inquiry.matchedCompanyId)
  return (
    <Link to={to} className="card group block p-5 transition hover:-translate-y-0.5 hover:shadow-lift focus:outline-none focus-visible:ring-4 focus-visible:ring-navy-500/15">
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
          <ProjectTypeIcon type={inquiry.projectType} className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-slate-500">{inquiry.ref}</span>
            <StatusBadge status={inquiry.status} />
          </div>
          <h3 className="mt-1 truncate font-display text-base font-bold text-navy-900 group-hover:text-navy-700">{inquiry.title}</h3>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>{PROJECT_TYPES[inquiry.projectType].label}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" /> {inquiry.district ? `${inquiry.district}, ` : ''}
              {inquiry.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <Wallet className="size-3.5" /> {fmtRange(inquiry.budgetMin, inquiry.budgetMax)}
            </span>
          </div>
        </div>
        <ArrowRight className="hidden size-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-gold-600 sm:block" />
      </div>
      <div className="mt-4">
        <StatusStepper status={inquiry.status} compact />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Updated {timeAgo(inquiry.updatedAt)}</span>
        {company && (
          <span className="inline-flex items-center gap-1 font-medium text-navy-800">
            <Building2 className="size-3.5" /> {company.name}
          </span>
        )}
      </div>
    </Link>
  )
}
