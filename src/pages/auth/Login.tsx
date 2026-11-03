import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Eye, EyeOff, Lock, LogIn, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Field'
import { DEMO_ACCOUNTS } from '@/lib/constants'
import { isEmail } from '@/lib/format'
import { useTitle } from '@/lib/hooks'
import { homeFor } from '@/lib/routes'
import { useAuth } from '@/store/store-context'
import { useToast } from '@/store/toast-context'

export default function Login() {
  useTitle('Log in')
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isEmail(email)) return setError('Please enter a valid email address.')
    if (!password) return setError('Please enter your password.')
    setBusy(true)
    const res = await login(email, password)
    setBusy(false)
    if (!res.ok) return setError(res.error)
    toast({ kind: 'success', title: `Welcome back, ${res.user.name.split(' ')[0]}` })
    navigate(from && !from.startsWith('/login') ? from : homeFor(res.user.role), { replace: true })
  }

  const fill = (which: keyof typeof DEMO_ACCOUNTS) => {
    setEmail(DEMO_ACCOUNTS[which].email)
    setPassword(DEMO_ACCOUNTS[which].password)
    setError(null)
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to follow your inquiries and messages."
      footer={
        <>
          New to Mumin Build Connect?{' '}
          <Link to="/register" className="font-semibold text-navy-800 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" leading={<Mail className="size-4" />} />
        <Input
          label="Password"
          type={show ? 'text' : 'password'}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          leading={<Lock className="size-4" />}
          trailing={
            <button type="button" onClick={() => setShow((s) => !s)} className="rounded-md p-1.5 text-slate-400 hover:text-navy-800" aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />
        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={busy}>
          <LogIn className="size-4" /> Log in
        </Button>
      </form>

      <div className="mt-8 rounded-2xl border border-dashed border-gold-300 bg-gold-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-gold-800">Demo accounts (MVP)</p>
        <p className="mt-1 text-xs text-gold-900/80">This prototype stores accounts in your browser only. Use a demo account to explore each role.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => fill('customer')} className="flex min-w-0 items-center gap-3 rounded-xl border border-gold-200 bg-white p-3 text-left transition hover:border-gold-400 hover:shadow-soft">
            <span className="flex size-9 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
              <UserRound className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-navy-900">Customer</span>
              <span className="block truncate text-xs text-slate-500">{DEMO_ACCOUNTS.customer.email}</span>
            </span>
          </button>
          <button type="button" onClick={() => fill('admin')} className="flex min-w-0 items-center gap-3 rounded-xl border border-gold-200 bg-white p-3 text-left transition hover:border-gold-400 hover:shadow-soft">
            <span className="flex size-9 items-center justify-center rounded-lg bg-navy-800 text-gold-400">
              <ShieldCheck className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-navy-900">Admin</span>
              <span className="block truncate text-xs text-slate-500">{DEMO_ACCOUNTS.admin.email}</span>
            </span>
          </button>
        </div>
      </div>
    </AuthLayout>
  )
}
