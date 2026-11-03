import planning from '@/assets/brand/planning.jpg'
import { cx } from '@/lib/format'

export const STEPS = [
  { title: 'Understanding the needs', so: 'Fahamka baahida', text: 'We register what you want to build: the location, your budget and the type of project.' },
  { title: 'Selecting suitable companies', so: 'Xulashada shirkadda', text: 'We share suitable companies with you, considering their services, capacity and track record.' },
  { title: 'Meeting and assessment', so: 'Kulanka iyo qiimaynta', text: 'The company evaluates the site and provides a cost estimate and the technical details.' },
  { title: 'Construction agreement', so: 'Heshiiska dhismaha', text: 'You and the company negotiate directly and sign the construction contract.' },
  { title: 'Commission', so: 'Commission-ka', text: 'Our referral fee is paid based on a written agreement, set out clearly in advance.' },
]

export function HowWeWork({ showHeader = true, className }: { showHeader?: boolean; className?: string }) {
  return (
    <section className={cx('bg-slate-50', className)}>
      <div className="container-x grid items-center gap-12 py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {showHeader && (
            <>
              <p className="eyebrow">Habka shaqada</p>
              <h2 className="section-title">How we work, step by step</h2>
              <p className="section-lead">A clear, organised process from the first conversation to a signed agreement.</p>
            </>
          )}
          <div className="relative mt-8 overflow-hidden rounded-3xl shadow-lift">
            <img src={planning} alt="Architectural model of a house on blueprints with a safety helmet" className="aspect-[16/10] w-full object-cover" width={464} height={270} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/80 to-transparent p-5 text-white">
              <p className="font-display text-sm font-bold">Every project starts with a plan.</p>
              <p className="text-xs text-slate-200">Guri riyo maaha, waa qorshe.</p>
            </div>
          </div>
        </div>
        <ol className="space-y-3 lg:col-span-7">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card flex gap-5 p-5 transition hover:shadow-lift">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold-500 font-display text-lg font-black text-navy-950 shadow-sm">{i + 1}</span>
              <div>
                <h3 className="font-display text-base font-bold text-navy-900">
                  {s.title} <span className="ml-1 text-xs font-semibold text-gold-700">{s.so}</span>
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
