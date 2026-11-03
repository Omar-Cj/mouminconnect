import { Link, Navigate, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, BadgeCheck, Briefcase, Calendar, CheckCircle2, Mail, MapPin, Phone, Star, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { CompanyMark } from '@/components/ui/Misc'
import { ProjectTypeIcon } from '@/components/ui/ProjectTypeIcon'
import { PROJECT_TYPES } from '@/lib/constants'
import { useTitle } from '@/lib/hooks'
import { useAuth, useStore } from '@/store/store-context'

export default function CompanyDetail() {
  const { slug } = useParams()
  const { companies } = useStore()
  const { user } = useAuth()
  const company = companies.find((c) => c.slug === slug && c.active)
  useTitle(company?.name ?? 'Company')
  if (!company) return <Navigate to="/companies" replace />

  const years = new Date().getFullYear() - company.founded
  const requestTo = user?.role === 'admin' ? '/admin' : `/app/inquiries/new?company=${company.slug}`
  const requestLabel = user ? 'Request this company' : 'Register to request this company'

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-navy-50/60">
        <div className="blueprint absolute inset-0" aria-hidden />
        <div className="container-x relative py-10 sm:py-14">
          <Link to="/companies" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-navy-900">
            <ArrowLeft className="size-4" /> All companies
          </Link>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-5">
              <CompanyMark name={company.name} accent={company.accent} size="xl" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-3xl font-black text-navy-900 sm:text-4xl">{company.name}</h1>
                  {company.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                      <BadgeCheck className="size-4" /> Verified by MBC
                    </span>
                  ) : (
                    <Badge tone="amber">Verification pending</Badge>
                  )}
                </div>
                <p className="mt-1 text-lg text-slate-600">{company.tagline}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4 text-slate-400" /> {company.address}, {company.city}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="size-4 fill-gold-400 text-gold-400" /> {company.rating.toFixed(1)} · {company.reviewsCount} reviews
                  </span>
                </div>
              </div>
            </div>
            <ButtonLink to={user ? requestTo : '/register'} variant="gold" size="lg" className="shrink-0">
              {requestLabel} <ArrowRight className="size-5" />
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-8 py-12 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Calendar, v: `${years}+ yrs`, l: `Since ${company.founded}` },
              { icon: Briefcase, v: company.projectsCompleted, l: 'Projects completed' },
              { icon: Users, v: company.teamSize, l: 'Team members' },
              { icon: Star, v: company.rating.toFixed(1), l: 'Average rating' },
            ].map((s) => (
              <div key={s.l} className="card p-4">
                <s.icon className="size-5 text-gold-600" />
                <p className="mt-2 font-display text-xl font-extrabold text-navy-900">{s.v}</p>
                <p className="text-xs text-slate-500">{s.l}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy-900">About</h2>
            <p className="mt-3 leading-relaxed text-slate-700">{company.description}</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy-900">Specialties</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {company.specialties.map((s) => (
                <div key={s} className="card flex items-center gap-3 p-4">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
                    <ProjectTypeIcon type={s} className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy-900">{PROJECT_TYPES[s].label}</p>
                    <p className="text-xs text-slate-500">{PROJECT_TYPES[s].labelSo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy-900">Services</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {company.services.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold-500" /> {s}
                </li>
              ))}
            </ul>
          </div>

          {company.portfolio.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">Recent projects</h2>
              <ul className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
                {company.portfolio.map((p) => (
                  <li key={p.title} className="flex items-center gap-4 bg-white p-4">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                      <ProjectTypeIcon type={p.type} className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-navy-900">{p.title}</p>
                      <p className="text-xs text-slate-500">
                        {PROJECT_TYPES[p.type].label} · {p.location}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-500">{p.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="space-y-5 lg:col-span-4">
          <div className="card p-5">
            <h3 className="font-display text-base font-bold text-navy-900">Work with {company.name.split(' ')[0]}</h3>
            <p className="mt-1 text-sm text-slate-600">
              Submit an inquiry and we will share your requirements with this company, arrange the first meeting and follow up until agreement.
            </p>
            <ButtonLink to={user ? requestTo : '/register'} variant="primary" className="mt-4 w-full">
              {requestLabel}
            </ButtonLink>
            {!user && (
              <p className="mt-2 text-center text-xs text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-navy-800 hover:underline">
                  Log in
                </Link>
              </p>
            )}
          </div>
          <div className="card p-5">
            <h3 className="font-display text-base font-bold text-navy-900">Contact details</h3>
            <p className="mt-1 text-xs text-slate-500">Shared with you in full once a match is confirmed.</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3 text-slate-700">
                <Phone className="size-4 text-gold-600" /> {user ? company.phone : '+252 •• ••• ••••'}
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <Mail className="size-4 text-gold-600" /> {user ? company.email : '•••@•••'}
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <MapPin className="size-4 text-gold-600" /> {company.address}, {company.city}
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            Mumin Build Connect verifies references and past projects, but you remain responsible for your own due diligence before signing any agreement.
          </div>
        </aside>
      </section>
    </>
  )
}
