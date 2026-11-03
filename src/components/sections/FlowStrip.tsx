import { ArrowRight, Building2, Handshake, UserRound } from 'lucide-react'
import { cx } from '@/lib/format'

const nodes = [
  { icon: UserRound, title: 'Client', titleSo: 'Macmiilka', text: 'The person who wants to build', tone: 'gold' },
  { icon: Handshake, title: 'Mumin Build Connect', titleSo: 'Dhex-dhexaadiye', text: 'The trusted intermediary that connects you', tone: 'navy' },
  { icon: Building2, title: 'Construction company', titleSo: 'Shirkadda dhismaha', text: 'Skilled, verified and reliable companies', tone: 'gold' },
] as const

export function FlowStrip({ className }: { className?: string }) {
  return (
    <section className={cx('bg-navy-50/70', className)}>
      <div className="container-x py-12">
        <ol className="grid items-start gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4">
          {nodes.map((n, i) => (
            <li key={n.title} className="contents">
              <div className="flex flex-col items-center text-center">
                <span
                  className={cx(
                    'flex size-20 items-center justify-center rounded-full shadow-soft ring-8',
                    n.tone === 'navy' ? 'bg-navy-800 text-white ring-navy-100' : 'bg-gold-500 text-navy-950 ring-gold-100',
                  )}
                >
                  <n.icon className="size-9" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 font-display text-base font-extrabold uppercase tracking-wide text-navy-900">{n.title}</h3>
                <p className="text-xs font-semibold text-gold-700">{n.titleSo}</p>
                <p className="mt-1 max-w-[16rem] text-sm text-slate-600">{n.text}</p>
              </div>
              {i < nodes.length - 1 && (
                <div className="flex items-center justify-center md:pt-7" aria-hidden>
                  <ArrowRight className="size-7 rotate-90 text-gold-500 md:rotate-0" strokeWidth={2.5} />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
