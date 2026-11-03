import { Link } from 'react-router'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { SocialLinks, SocialIcon } from '@/components/brand/SocialIcons'
import { BRAND, PROJECT_TYPES, PROJECT_TYPE_LIST, WHATSAPP_URL } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy-900 text-slate-300">
      <div className="blueprint-dark absolute inset-0 opacity-70" aria-hidden />
      <div className="absolute -right-24 -top-24 size-72 rounded-full bg-gold-500/15 blur-3xl" aria-hidden />
      <div className="container-x relative">
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo variant="full" tone="dark" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-300">
              The trusted intermediary between people who want to build and verified construction companies in Somaliland. Transparent, organised and on your side until the agreement is signed.
            </p>
            <p className="mt-4 font-display text-sm font-bold italic text-gold-400">
              “{BRAND.motto}” <span className="font-sans font-normal not-italic text-slate-400">— {BRAND.mottoEn}</span>
            </p>
            <SocialLinks className="mt-6" />
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ['/how-it-works', 'How it works'],
                ['/services', 'Services'],
                ['/companies', 'Companies'],
                ['/about', 'About us'],
                ['/contact', 'Contact'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="transition hover:text-gold-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Projects</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {PROJECT_TYPE_LIST.map((t) => (
                <li key={t}>
                  <Link to={`/companies?type=${t}`} className="transition hover:text-gold-400">
                    {PROJECT_TYPES[t].label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Nala xidhiidh</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-start gap-3 transition hover:text-gold-400">
                  <SocialIcon name="whatsapp" className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                  <span>
                    <span className="block text-xs text-slate-400">WhatsApp / Call</span>
                    <span className="font-semibold text-white">{BRAND.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${BRAND.email}`} className="flex items-start gap-3 transition hover:text-gold-400">
                  <Mail className="mt-0.5 size-4 shrink-0 text-gold-400" />
                  <span>
                    <span className="block text-xs text-slate-400">Email</span>
                    <span className="font-semibold text-white">{BRAND.email}</span>
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" />
                <span>
                  <span className="block text-xs text-slate-400">Location</span>
                  <span className="font-semibold text-white">{BRAND.location}</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold-400" />
                <span>
                  <span className="block text-xs text-slate-400">Working hours</span>
                  <span className="font-semibold text-white">Sat – Thu, 8:00 – 17:00</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p className="max-w-xl">
            {BRAND.name} is an intermediary, not a contractor or engineer. Technical responsibility for every project lies with the construction company you agree with.
          </p>
        </div>
      </div>
    </footer>
  )
}
