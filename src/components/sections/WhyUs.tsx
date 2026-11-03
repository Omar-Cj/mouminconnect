import { Award, Clock, Eye, ShieldCheck } from 'lucide-react'

const values = [
  { icon: ShieldCheck, title: 'Verified companies', so: 'Shirkado la hubiyey', text: 'We check references and past projects before any company joins our network.' },
  { icon: Award, title: 'Quality and skill', so: 'Tayo iyo xirfad', text: 'Only companies with proven skill, proper equipment and real track records.' },
  { icon: Clock, title: 'Save time and money', so: 'Badbaado time iyo lacag', text: 'One inquiry, several qualified options, and a process that keeps moving.' },
  { icon: Eye, title: 'Transparent, clear service', so: 'Adeeg hufan oo daahfuran', text: 'Our role and our fee are always explained upfront. No hidden charges.' },
]

export function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="blueprint-dark absolute inset-0" aria-hidden />
      <div className="absolute -left-20 top-0 size-80 rounded-full bg-gold-500/20 blur-3xl" aria-hidden />
      <div className="container-x relative py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-gold-400">Why Mumin Build Connect</p>
          <h2 className="section-title text-white">Built on trust, transparency and a clear process</h2>
          <p className="section-lead text-slate-300">
            Our vision is to be the most trusted link between clients and construction companies in Somaliland.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-gold-400/50 hover:bg-white/10">
              <span className="flex size-12 items-center justify-center rounded-xl bg-gold-500 text-navy-950">
                <v.icon className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold">{v.title}</h3>
              <p className="text-xs font-semibold text-gold-400">{v.so}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
