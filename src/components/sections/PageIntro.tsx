import type { ReactNode } from 'react'

export function PageIntro({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 bg-navy-50/60">
      <div className="blueprint absolute inset-0" aria-hidden />
      <div className="absolute -right-24 -top-24 size-72 rounded-full bg-gold-300/30 blur-3xl" aria-hidden />
      <div className="container-x relative py-14 sm:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-black leading-tight text-navy-900 sm:text-5xl">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg text-slate-600">{lead}</p>}
        {children}
      </div>
    </section>
  )
}
