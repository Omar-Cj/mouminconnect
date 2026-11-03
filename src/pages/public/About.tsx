import { Compass, HeartHandshake, Target } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { PageIntro } from '@/components/sections/PageIntro'
import { FlowStrip } from '@/components/sections/FlowStrip'
import { Commitment } from '@/components/sections/Commitment'
import { CtaBand } from '@/components/sections/CtaBand'
import { BRAND } from '@/lib/constants'
import { useTitle } from '@/lib/hooks'

export default function About() {
  useTitle('About us')
  return (
    <>
      <PageIntro
        eyebrow="Ku saabsan ganacsiga"
        title="Connecting your construction dreams to reality"
        lead="Mumin Build Connect is a business matching and brokerage service that connects people who want to build homes or other structures with suitable construction companies."
      />
      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="card flex flex-col items-center p-10 text-center">
            <Logo variant="full" to={null} className="w-64" />
            <p className="mt-6 font-display text-base font-bold italic text-navy-900">“{BRAND.taglineSo}”</p>
            <p className="text-sm text-slate-500">Connecting your construction dreams to reality</p>
          </div>
        </div>
        <div className="space-y-6 lg:col-span-7">
          {[
            {
              icon: Compass,
              title: 'About our business',
              text: 'We simplify the process of building by providing connections, arranging meetings, getting quotations and comparing services, so that our clients can make informed decisions. We work with clients across Somaliland from our base in Hargeisa.',
            },
            {
              icon: Target,
              title: 'Our vision',
              text: 'To be the most trusted link between clients and construction companies, based on transparency, strong relationships and a clear, organised process.',
            },
            {
              icon: HeartHandshake,
              title: 'Our role',
              text: 'We are the trusted intermediary in the middle. We never build, and we never take sides: you and the construction company negotiate directly and sign your own agreement. Our referral fee is agreed in writing in advance.',
            },
          ].map((b) => (
            <div key={b.title} className="flex gap-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-800 text-gold-400">
                <b.icon className="size-6" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-navy-900">{b.title}</h2>
                <p className="mt-2 leading-relaxed text-slate-600">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <FlowStrip />
      <Commitment />
      <div className="py-10">
        <CtaBand />
      </div>
    </>
  )
}
