import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import villa from '@/assets/brand/villa-hero.jpg'
import { Logo } from '@/components/brand/Logo'
import { BRAND } from '@/lib/constants'

const points = ['Verified construction companies', 'Transparent fees, agreed in writing', 'One inquiry, several qualified options', 'Support until the agreement is signed']

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-12">
      <aside className="relative hidden overflow-hidden bg-navy-900 text-white lg:col-span-5 lg:flex lg:flex-col">
        <img src={villa} alt="" className="absolute inset-0 size-full object-cover opacity-30" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/60 via-navy-900/80 to-navy-950" aria-hidden />
        <div className="relative flex flex-1 flex-col justify-between p-10 xl:p-14">
          <Logo tone="dark" />
          <div>
            <p className="eyebrow text-gold-400">{BRAND.taglineSo}</p>
            <h2 className="mt-4 font-display text-3xl font-black leading-tight text-white xl:text-4xl">Your trusted bridge to a better home.</h2>
            <ul className="mt-8 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="size-5 shrink-0 text-gold-400" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} {BRAND.name} · {BRAND.location}
          </p>
        </div>
      </aside>

      <main className="flex flex-col px-4 py-8 sm:px-8 lg:col-span-7 lg:justify-center lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Logo />
          </div>
          <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy-900">
            <ArrowLeft className="size-4" /> Back to website
          </Link>
          <h1 className="font-display text-3xl font-black text-navy-900">{title}</h1>
          <p className="mt-2 text-slate-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-center text-sm text-slate-600">{footer}</div>
        </div>
      </main>
    </div>
  )
}
