import { useState, type FormEvent } from 'react'
import { KeyRound, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Input, Select } from '@/components/ui/Field'
import { Avatar, PageHeader } from '@/components/ui/Misc'
import { CITIES } from '@/lib/constants'
import { fmtDate } from '@/lib/format'
import { useTitle } from '@/lib/hooks'
import { useAuth } from '@/store/store-context'
import { useToast } from '@/store/toast-context'

export default function Profile() {
  useTitle('Profile')
  const { user, updateProfile, changePassword } = useAuth()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: user?.name ?? '', phone: user?.phone ?? '', city: user?.city ?? 'Hargeisa' })
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!user) return null

  const saveProfile = (e: FormEvent) => {
    e.preventDefault()
    if (form.name.trim().length < 2) return toast({ kind: 'error', title: 'Please enter your full name.' })
    updateProfile({ name: form.name.trim(), phone: form.phone.trim(), city: form.city })
    toast({ kind: 'success', title: 'Profile updated' })
  }

  const savePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPwError(null)
    if (pw.next.length < 8) return setPwError('New password must be at least 8 characters.')
    if (pw.next !== pw.confirm) return setPwError('New passwords do not match.')
    setBusy(true)
    const res = await changePassword(pw.current, pw.next)
    setBusy(false)
    if (!res.ok) return setPwError(res.error ?? 'Could not change password.')
    setPw({ current: '', next: '', confirm: '' })
    toast({ kind: 'success', title: 'Password changed' })
  }

  return (
    <>
      <PageHeader title="Profile" description="Keep your contact details current so companies and our team can reach you." />
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Card>
            <CardHeader title="Personal details" />
            <CardBody>
              <form onSubmit={saveProfile} className="space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar name={user.name} size="xl" />
                  <div>
                    <p className="font-display text-lg font-bold text-navy-900">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <Input label="Email" value={user.email} disabled hint="Email cannot be changed in this prototype." />
                  <Input label="Phone / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <Select label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button type="submit" variant="primary">
                  <Save className="size-4" /> Save changes
                </Button>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Change password" />
            <CardBody>
              <form onSubmit={savePassword} className="space-y-5">
                <Input label="Current password" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="New password" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
                  <Input label="Confirm new password" type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
                </div>
                {pwError && (
                  <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
                    {pwError}
                  </p>
                )}
                <Button type="submit" variant="outline" loading={busy}>
                  <KeyRound className="size-4" /> Update password
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
        <aside className="lg:col-span-4">
          <Card>
            <CardHeader title="Account" />
            <CardBody>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</dt>
                  <dd className="font-medium capitalize text-navy-900">{user.role}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Member since</dt>
                  <dd className="font-medium text-navy-900">{fmtDate(user.createdAt)}</dd>
                </div>
              </dl>
              <p className="mt-5 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-inset ring-amber-200">
                This MVP keeps your account in this browser only. Clearing site data will remove it.
              </p>
            </CardBody>
          </Card>
        </aside>
      </div>
    </>
  )
}
