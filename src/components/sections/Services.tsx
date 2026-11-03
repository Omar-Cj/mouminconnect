import { CalendarCheck, ClipboardList, Handshake, MessagesSquare, Scale } from 'lucide-react'

export const SERVICES = [
  { icon: Handshake, title: 'Connecting you with construction companies', text: 'We introduce you only to companies we have checked, whose services match your project.' },
  { icon: ClipboardList, title: 'Collecting your requirements', text: 'Location, type of building, budget and preferred timeline, captured once and shared accurately with every company.' },
  { icon: CalendarCheck, title: 'Coordinating meetings and assessments', text: 'We arrange the first meeting and the site assessment so you get an evaluation, cost estimate and technical details.' },
  { icon: Scale, title: 'Helping you compare offers', text: 'Prices, scope of work and schedules side by side, so you make an informed decision rather than a rushed one.' },
  { icon: MessagesSquare, title: 'Following up until agreement', text: 'We keep communication moving between both parties until the construction agreement is signed.' },
]

export function Services({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section className="container-x py-20">
      {showHeader && (
        <div className="max-w-2xl">
          <p className="eyebrow">Adeegyada aan bixino</p>
          <h2 className="section-title">What we do for you</h2>
          <p className="section-lead">
            A matching and brokerage service that removes the guesswork from finding the right builder. You stay in control; we handle the legwork.
          </p>
        </div>
      )}
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <div key={s.title} className="card group relative overflow-hidden p-6 transition hover:-translate-y-0.5 hover:shadow-lift">
            <span className="absolute right-5 top-4 font-display text-5xl font-black text-navy-50 transition group-hover:text-gold-100">0{i + 1}</span>
            <span className="relative flex size-12 items-center justify-center rounded-xl bg-navy-800 text-gold-400 shadow-sm">
              <s.icon className="size-6" />
            </span>
            <h3 className="relative mt-5 font-display text-lg font-bold leading-snug text-navy-900">{s.title}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
          </div>
        ))}
        <div className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 p-6 text-white">
          <p className="font-display text-lg font-bold">What we are not</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Mumin Build Connect is not a contractor or an engineer. The technical responsibility and the implementation of your project lie with the construction company and the professionals you agree with.
          </p>
        </div>
      </div>
    </section>
  )
}
