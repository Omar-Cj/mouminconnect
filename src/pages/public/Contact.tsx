import { useState, type FormEvent } from 'react'
import { Clock, Mail, MapPin, Send } from 'lucide-react'
import { PageIntro } from '@/components/sections/PageIntro'
import { SocialIcon, SocialLinks } from '@/components/brand/SocialIcons'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Field'
import { BRAND, STORAGE_KEYS, WHATSAPP_URL } from '@/lib/constants'
import { isEmail } from '@/lib/format'
import { useTitle } from '@/lib/hooks'
import { nowIso, uid } from '@/lib/id'
import { load, save } from '@/lib/storage'
import type { ContactMessage } from '@/lib/types'
import { useAuth } from '@/store/store-context'
import { useToast } from '@/store/toast-context'

export default function Contact() {
  useTitle('Contact')
  const { user } = useAuth()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '', message: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next: Partial<typeof form> = {}
    if (!form.name.trim()) next.name = 'Please tell us your name.'
    if (!isEmail(form.email)) next.email = 'Please enter a valid email address.'
    if (form.message.trim().length < 10) next.message = 'Please write a few more words.'
    setErrors(next)
    if (Object.keys(next).length) return
    const list = load<ContactMessage[]>(STORAGE_KEYS.contact, [])
    save(STORAGE_KEYS.contact, [{ id: uid('cm_'), ...form, at: nowIso() }, ...list])
    setSent(true)
    toast({ kind: 'success', title: 'Message sent', description: 'We will get back to you within one working day.' })
  }

  return (
    <>
      <PageIntro eyebrow="Nala xidhiidh" title="Talk to us" lead="Questions about a project, our process or joining our network as a company? We are happy to help." />
      <section className="container-x grid gap-8 py-14 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="card flex items-center gap-4 p-5 transition hover:shadow-lift">
            <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <SocialIcon name="whatsapp" className="size-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">WhatsApp / Call</p>
              <p className="font-display text-lg font-bold text-navy-900">{BRAND.phone}</p>
            </div>
          </a>
          <a href={`mailto:${BRAND.email}`} className="card flex items-center gap-4 p-5 transition hover:shadow-lift">
            <span className="flex size-12 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
              <Mail className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
              <p className="truncate font-display text-lg font-bold text-navy-900">{BRAND.email}</p>
            </div>
          </a>
          <div className="card flex items-center gap-4 p-5">
            <span className="flex size-12 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
              <MapPin className="size-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
              <p className="font-display text-lg font-bold text-navy-900">{BRAND.location}</p>
            </div>
          </div>
          <div className="card flex items-center gap-4 p-5">
            <span className="flex size-12 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
              <Clock className="size-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Working hours</p>
              <p className="font-display text-lg font-bold text-navy-900">Sat – Thu, 8:00 – 17:00</p>
            </div>
          </div>
          <div className="pt-2">
            <p className="mb-3 text-sm font-semibold text-navy-900">Follow us</p>
            <SocialLinks tone="light" />
          </div>
        </div>

        <div className="card p-6 sm:p-8 lg:col-span-7">
          {sent ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Send className="size-6" />
              </span>
              <h2 className="mt-4 font-display text-xl font-bold text-navy-900">Thank you, {form.name.split(' ')[0]}!</h2>
              <p className="mt-2 max-w-sm text-sm text-slate-600">Your message has been received. We usually reply within one working day on WhatsApp or by email.</p>
              <Button variant="outline" className="mt-6" onClick={() => { setSent(false); setForm((f) => ({ ...f, message: '' })) }}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <h2 className="font-display text-xl font-bold text-navy-900">Send us a message</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} placeholder="Your name" />
                <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+252 63 …" />
              </div>
              <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} placeholder="you@example.com" />
              <Textarea label="Message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} error={errors.message} placeholder="Tell us about your project or your question…" />
              <Button type="submit" variant="gold" size="lg" className="w-full sm:w-auto">
                Send message <Send className="size-4" />
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
