import { CheckCircle2, ShieldAlert } from 'lucide-react'
import villa2 from '@/assets/brand/villa-2.jpg'

export const COMMITMENTS = [
  'Transparency in our role and in any service fees.',
  'No false promises regarding price, quality or construction time.',
  'We share available company information and encourage you to check references and past projects yourself.',
  'We stay neutral: you and the company negotiate and sign directly.',
]

export function Commitment() {
  return (
    <section className="container-x py-20">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <div className="absolute -inset-4 rounded-[2rem] bg-gold-200/50 blur-2xl" aria-hidden />
          <img src={villa2} alt="A finished modern villa surrounded by palm trees" className="relative aspect-square w-full rounded-3xl object-cover shadow-lift" width={271} height={270} />
          <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-white p-4 shadow-lift">
            <p className="font-display text-sm font-bold text-navy-900">Ballanqaadkeenna</p>
            <p className="text-xs text-slate-500">Our commitment to every client</p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <p className="eyebrow">Our commitment</p>
          <h2 className="section-title">Honest about what we do, and what we don’t</h2>
          <ul className="mt-8 space-y-4">
            {COMMITMENTS.map((c) => (
              <li key={c} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold-500" />
                <span className="text-base text-slate-700">{c}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-900">
              <strong>Important:</strong> Mumin Build Connect is not a contractor or engineer. The technical responsibility and implementation of the project lie with the construction company and the professionals you have agreed with.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
