import { ArrowRight } from 'lucide-react'
import { SocialIcon } from '@/components/brand/SocialIcons'
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { BRAND, WHATSAPP_URL } from '@/lib/constants'
import { useAuth } from '@/store/store-context'

export function CtaBand() {
  const { user } = useAuth()
  const to = user ? (user.role === 'admin' ? '/admin' : '/app/inquiries/new') : '/register'
  return (
    <section className="container-x">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 px-6 py-14 text-navy-950 shadow-lift sm:px-12">
        <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/20 blur-2xl" aria-hidden />
        <div className="relative grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-navy-900/70">Ready to build?</p>
            <h2 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl">Tell us about your project in five minutes.</h2>
            <p className="mt-3 max-w-xl text-base text-navy-900/80">
              Register, describe what you want to build, and our team will come back with suitable companies. Prefer to talk? Message us on WhatsApp at {BRAND.phone}.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col">
            <ButtonLink to={to} variant="primary" size="lg">
              Start your project <ArrowRight className="size-5" />
            </ButtonLink>
            <ButtonAnchor href={WHATSAPP_URL} target="_blank" rel="noreferrer" variant="white" size="lg">
              <SocialIcon name="whatsapp" className="size-5 text-emerald-600" /> WhatsApp us
            </ButtonAnchor>
          </div>
        </div>
      </div>
    </section>
  )
}
