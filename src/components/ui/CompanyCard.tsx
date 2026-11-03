import { Link } from 'react-router'
import { ArrowRight, BadgeCheck, MapPin, Star } from 'lucide-react'
import type { Company } from '@/lib/types'
import { PROJECT_TYPES } from '@/lib/constants'
import { Badge } from './Badge'
import { CompanyMark } from './Misc'

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      to={`/companies/${company.slug}`}
      className="card group flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lift focus:outline-none focus-visible:ring-4 focus-visible:ring-navy-500/15"
    >
      <div className="flex items-start gap-4">
        <CompanyMark name={company.name} accent={company.accent} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-bold leading-snug text-navy-900 group-hover:text-navy-700">{company.name}</h3>
            {company.verified ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                <BadgeCheck className="size-3.5" /> Verified
              </span>
            ) : (
              <Badge tone="amber">Pending</Badge>
            )}
          </div>
          <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{company.tagline}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {company.specialties.map((s) => (
          <Badge key={s} tone="navy">
            {PROJECT_TYPES[s].label}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-4 text-slate-400" /> {company.city}
        </span>
        <span className="inline-flex items-center gap-1">
          <Star className="size-4 fill-gold-400 text-gold-400" /> {company.rating.toFixed(1)}
          <span className="text-slate-400">({company.reviewsCount})</span>
        </span>
        <span className="inline-flex items-center gap-1 text-navy-700">
          {company.projectsCompleted} projects
        </span>
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-800 group-hover:text-gold-600">
        View profile <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
