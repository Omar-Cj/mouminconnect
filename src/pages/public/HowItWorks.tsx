import { PageIntro } from '@/components/sections/PageIntro'
import { FlowStrip } from '@/components/sections/FlowStrip'
import { HowWeWork } from '@/components/sections/HowWeWork'
import { Commitment } from '@/components/sections/Commitment'
import { CtaBand } from '@/components/sections/CtaBand'
import { useTitle } from '@/lib/hooks'

const faqs = [
  { q: 'Do I pay Mumin Build Connect?', a: 'Our referral fee is agreed in writing with the construction company before any work starts. There are no hidden fees for clients, and we explain our role and any fee upfront.' },
  { q: 'Do I have to accept the company you suggest?', a: 'No. We share suitable companies with you, and you decide. You can ask us for alternatives at any stage before signing an agreement.' },
  { q: 'Who is responsible for the construction quality?', a: 'The construction company you sign with. We are an intermediary, not a contractor or engineer. We encourage you to check references and past projects before agreeing.' },
  { q: 'What happens after the agreement is signed?', a: 'You work directly with the company. We remain available if you need help with communication, and we close the inquiry once the referral fee is settled.' },
]

export default function HowItWorks() {
  useTitle('How it works')
  return (
    <>
      <PageIntro
        eyebrow="Habka shaqada"
        title="A clear path from idea to signed agreement"
        lead="You tell us what you want to build. We take care of finding, introducing and coordinating with the right construction company."
      />
      <FlowStrip className="bg-white" />
      <HowWeWork />
      <section className="container-x py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Questions</p>
          <h2 className="section-title">Frequently asked</h2>
        </div>
        <dl className="mt-10 grid gap-5 md:grid-cols-2">
          {faqs.map((f) => (
            <div key={f.q} className="card p-6">
              <dt className="font-display text-base font-bold text-navy-900">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
      <Commitment />
      <div className="py-10">
        <CtaBand />
      </div>
    </>
  )
}
