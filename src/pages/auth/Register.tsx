import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { Eye, EyeOff, Lock, Mail, Phone, UserRound, UserPlus } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Checkbox, Input, Select } from '@/components/ui/Field'
import { passwordStrength } from '@/lib/auth'
import { CITIES } from '@/lib/constants'
import { cx, isEmail } from '@/lib/format'
import { useTitle } from '@/lib/hooks'
import { useAuth } from '@/store/store-context'
import { useToast } from '@/store/toast-context'

type Form = { name: string; email: string; phone: string; city: string; password: string; confirm: string; agree: boolean }

export default function Register() {
  useTitle('Create your account')
  const { register } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>({ name: '', email: '', phone: '', city: 'Hargeisa', password: '', confirm: '', agree: false })
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)

  const update = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))
  const strength = passwordStrength(form.password)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const next: Partial<Record<keyof Form, string>> = {}
    if (form.name.trim().length < 2) next.name = 'Please enter your full name.'
    if (!isEmail(form.email)) next.email = 'Please enter a valid email address.'
    if (form.phone.replace(/\D/g, '').length < 7) next.phone = 'Please enter a valid phone number.'
    if (form.password.length < 8) next.password = 'Use at least 8 characters.'
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.'
    if (!form.agree) next.agree = 'Please confirm you understand our role.'
    setErrors(next)
    setServerError(null)
    if (Object.keys(next).length) return
    setBusy(true)
    const res = await register({ name: form.name, email: form.email, phone: form.phone, city: form.city, password: form.password })
    setBusy(false)
    if (!res.ok) return setServerError(res.error)
    toast({ kind: 'success', title: 'Account created', description: 'Welcome to Mumin Build Connect. Let’s set up your first inquiry.' })
    navigate('/app/inquiries/new', { replace: true })
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes a minute. Then tell us what you want to build."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-navy-800 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <Input label="Full name" required autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} error={errors.name} placeholder="Amina Warsame" leading={<UserRound className="size-4" />} />
        <Input label="Email" required type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email} placeholder="you@example.com" leading={<Mail className="size-4" />} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Phone / WhatsApp" required type="tel" autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} error={errors.phone} placeholder="+252 63 …" leading={<Phone className="size-4" />} />
          <Select label="City" value={form.city} onChange={(e) => update('city', e.target.value)}>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Input
            label="Password"
            required
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            error={errors.password}
            placeholder="At least 8 characters"
            leading={<Lock className="size-4" />}
            trailing={
              <button type="button" onClick={() => setShow((s) => !s)} className="rounded-md p-1.5 text-slate-400 hover:text-navy-800" aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
          />
          {form.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={cx('h-1.5 flex-1 rounded-full', strength.score >= i ? (strength.score <= 1 ? 'bg-red-400' : strength.score === 2 ? 'bg-amber-400' : 'bg-emerald-500') : 'bg-slate-200')} />
                ))}
              </div>
              <span className="text-xs font-medium text-slate-500">{strength.label}</span>
            </div>
          )}
        </div>
        <Input label="Confirm password" required type={show ? 'text' : 'password'} autoComplete="new-password" value={form.confirm} onChange={(e) => update('confirm', e.target.value)} error={errors.confirm} placeholder="Repeat your password" leading={<Lock className="size-4" />} />
        <Checkbox
          checked={form.agree}
          onChange={(e) => update('agree', e.target.checked)}
          error={errors.agree}
          label="I understand that Mumin Build Connect is an intermediary, not a contractor."
          description="Technical responsibility for any project lies with the construction company I agree with."
        />
        {serverError && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
            {serverError}
          </p>
        )}
        <Button type="submit" variant="gold" size="lg" className="w-full" loading={busy}>
          <UserPlus className="size-4" /> Create account
        </Button>
      </form>
    </AuthLayout>
  )
}
