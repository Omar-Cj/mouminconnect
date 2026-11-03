import { ArrowRight, BadgeCheck, CheckCircle2, MapPin, ShieldCheck } from 'lucide-react'
import villa from '@/assets/brand/villa-hero.jpg'
import { ButtonLink } from '@/components/ui/Button'
import { BRAND } from '@/lib/constants'
import { useAuth, useStore } from '@/store/store-context'

export function Hero() {
  const { user } = useAuth()
  const { companies } = useStore()
  const verified = companies.filter((c) => c.verified && c.active).length
  const cities = new Set(companies.filter((c) => c.active).map((c) => c.city)).size
  const startTo = user ? (user.role === 'admin' ? '/admin' : '/app/inquiries/new') : '/register'

  return (
    <section className="relative overflow-hidden">
      <div className="blueprint absolute inset-0" aria-hidden />
      <div className="absolute -left-32 top-10 size-96 rounded-full bg-gold-300/30 blur-3xl" aria-hidden />
      <div className="absolute -right-20 bottom-0 size-80 rounded-full bg-navy-200/40 blur-3xl" aria-hidden />

      <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-6 animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-800">
            <MapPin className="size-3.5" /> {BRAND.location} · Trusted intermediary
          </span>
          <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] text-navy-900 sm:text-5xl lg:text-6xl">
            Your trusted bridge to a <span className="gold-text">better home.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            Tell us what you want to build. We match you with a verified construction company, arrange the meetings and stay with you until the agreement is signed. No surprises, no false promises.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to={startTo} variant="gold" size="lg">
              Start your project <ArrowRight className="size-5" />
            </ButtonLink>
            <ButtonLink to="/companies" variant="outline" size="lg">
              Browse verified companies
            </ButtonLink>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-slate-200">
            {[
              { v: `${verified}+`, l: 'Verified companies' },
              { v: `${cities}`, l: 'Cities covered' },
              { v: '0', l: 'Hidden fees' },
            ].map((s) => (
              <div key={s.l} className="px-4 first:pl-0">
                <dt className="font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">{s.v}</dt>
                <dd className="text-xs font-medium text-slate-500 sm:text-sm">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto max-w-xl">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold-400/60 via-transparent to-navy-700/40 blur-xl" aria-hidden />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/60 shadow-lift">
              <img src={villa} alt="A modern two-storey villa at dusk" className="aspect-[5/3] w-full object-cover" width={554} height={330} />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950/60 to-transparent" aria-hidden />
            </div>

            <div className="absolute -left-4 top-6 hidden rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-lift backdrop-blur sm:block animate-float">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <BadgeCheck className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-500">Company matched</p>
                  <p className="text-sm font-bold text-navy-900">Daryeel Construction</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-2 hidden rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-lift backdrop-blur sm:block animate-float [animation-delay:1.5s]">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                  <CheckCircle2 className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-500">Estimate received</p>
                  <p className="text-sm font-bold text-navy-900">$86,500 · 4-bed villa</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/40 bg-navy-900 px-3 py-2 text-white shadow-lift lg:flex lg:items-center lg:gap-2">
              <ShieldCheck className="size-4 text-gold-400" />
              <span className="text-xs font-semibold">References checked</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
