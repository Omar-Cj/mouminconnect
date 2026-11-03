import { Link } from 'react-router'
import { AlertTriangle, ArrowRight, BadgeCheck, Building2, ClipboardList, FileCheck2, Inbox, TrendingUp } from 'lucide-react'
import { StatusBadge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { PageHeader, StatCard } from '@/components/ui/Misc'
import { PROJECT_TYPES, STATUS, STATUS_LIST } from '@/lib/constants'
import { cx, timeAgo } from '@/lib/format'
import { useTitle } from '@/lib/hooks'
import type { Inquiry } from '@/lib/types'
import { useStore } from '@/store/store-context'

const DAY = 86_400_000

function attention(i: Inquiry): string | null {
  const age = Date.now() - new Date(i.updatedAt).getTime()
  if (i.status === 'submitted' && age > DAY) return 'Waiting for review for more than a day'
  if (i.status === 'under_review' && age > 3 * DAY) return 'Under review for more than 3 days without a match'
  if (i.status === 'matched' && age > 7 * DAY) return 'Matched a week ago, no meeting scheduled'
  if (i.status === 'meeting_scheduled' && i.meetingAt && new Date(i.meetingAt).getTime() < Date.now() - DAY) return 'Meeting date has passed, record the outcome'
  return null
}

export default function AdminDashboard() {
  useTitle('Overview')
  const { inquiries, companies, users } = useStore()

  const count = (...s: Inquiry['status'][]) => inquiries.filter((i) => s.includes(i.status)).length
  const total = inquiries.length
  const awaiting = count('submitted')
  const inProgress = count('under_review', 'matched', 'meeting_scheduled')
  const agreements = count('agreement', 'completed')
  const conversion = total ? Math.round((agreements / total) * 100) : 0
  const verified = companies.filter((c) => c.verified && c.active).length
  const pending = companies.filter((c) => !c.verified && c.active).length
  const customers = users.filter((u) => u.role === 'customer').length

  const needs = inquiries.map((i) => ({ i, why: attention(i) })).filter((x): x is { i: Inquiry; why: string } => !!x.why).sort((a, b) => a.i.updatedAt.localeCompare(b.i.updatedAt))
  const recent = [...inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)
  const feed = inquiries
    .flatMap((i) => i.activity.map((a) => ({ a, i })))
    .sort((x, y) => y.a.at.localeCompare(x.a.at))
    .slice(0, 8)
  const maxCount = Math.max(1, ...STATUS_LIST.map((s) => count(s)))

  return (
    <>
      <PageHeader
        eyebrow="Admin overview"
        title="Good day. Here is where things stand."
        description={`${customers} registered customers · ${verified} verified companies`}
        actions={
          <ButtonLink to="/admin/inquiries?status=submitted" variant="gold">
            <Inbox className="size-4" /> Review new inquiries
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total inquiries" value={total} icon={<ClipboardList className="size-6" />} />
        <StatCard label="Awaiting review" value={awaiting} icon={<Inbox className="size-6" />} tone="amber" hint={awaiting ? 'Respond within one working day' : 'Inbox is clear'} />
        <StatCard label="In progress" value={inProgress} icon={<TrendingUp className="size-6" />} tone="gold" hint="Review, matched or meeting" />
        <StatCard label="Agreements" value={agreements} icon={<FileCheck2 className="size-6" />} tone="green" hint={`${conversion}% of all inquiries`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-7">
          <Card>
            <CardHeader
              title="Needs attention"
              description={needs.length ? `${needs.length} ${needs.length === 1 ? 'inquiry is' : 'inquiries are'} waiting on you.` : 'Nothing is overdue right now.'}
            />
            {needs.length > 0 && (
              <ul className="divide-y divide-slate-100">
                {needs.map(({ i, why }) => (
                  <li key={i.id}>
                    <Link to={`/admin/inquiries/${i.id}`} className="flex items-start gap-3 px-5 py-3.5 transition hover:bg-navy-50/40">
                      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-navy-900">
                          <span className="font-mono text-xs text-slate-500">{i.ref}</span> · {i.title}
                        </span>
                        <span className="block text-xs text-slate-500">{why}</span>
                      </span>
                      <StatusBadge status={i.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Recent inquiries"
              action={
                <Link to="/admin/inquiries" className="inline-flex items-center gap-1 text-sm font-semibold text-navy-800 hover:text-gold-600">
                  View all <ArrowRight className="size-4" />
                </Link>
              }
            />
            <ul className="divide-y divide-slate-100">
              {recent.map((i) => {
                const customer = users.find((u) => u.id === i.customerId)
                return (
                  <li key={i.id}>
                    <Link to={`/admin/inquiries/${i.id}`} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-navy-50/40">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-navy-900">{i.title}</span>
                        <span className="block text-xs text-slate-500">
                          {customer?.name ?? 'Unknown'} · {PROJECT_TYPES[i.projectType].label} · {i.city}
                        </span>
                      </span>
                      <StatusBadge status={i.status} />
                      <span className="hidden w-20 text-right text-xs text-slate-500 sm:block">{timeAgo(i.createdAt)}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>

        <div className="space-y-6 xl:col-span-5">
          <Card>
            <CardHeader title="Pipeline" description="Inquiries by stage." />
            <CardBody>
              <ul className="space-y-3" aria-label="Inquiries by status">
                {STATUS_LIST.map((s) => {
                  const n = count(s)
                  return (
                    <li key={s}>
                      <Link to={`/admin/inquiries?status=${s}`} className="group block">
                        <span className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700 group-hover:text-navy-900">{STATUS[s].label}</span>
                          <span className="font-semibold tabular-nums text-navy-900">{n}</span>
                        </span>
                        <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-slate-100">
                          <span className={cx('block h-full rounded-full', s === 'cancelled' ? 'bg-slate-300' : 'bg-navy-700')} style={{ width: `${(n / maxCount) * 100}%` }} />
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Companies"
              action={
                <Link to="/admin/companies" className="inline-flex items-center gap-1 text-sm font-semibold text-navy-800 hover:text-gold-600">
                  Manage <ArrowRight className="size-4" />
                </Link>
              }
            />
            <CardBody className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-emerald-50 p-4">
                <BadgeCheck className="size-5 text-emerald-600" />
                <p className="mt-2 font-display text-2xl font-extrabold text-navy-900">{verified}</p>
                <p className="text-xs text-slate-600">Verified & active</p>
              </div>
              <Link to="/admin/companies" className="rounded-xl bg-amber-50 p-4 transition hover:bg-amber-100">
                <Building2 className="size-5 text-amber-600" />
                <p className="mt-2 font-display text-2xl font-extrabold text-navy-900">{pending}</p>
                <p className="text-xs text-slate-600">Pending verification</p>
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Latest activity" />
            <ul className="divide-y divide-slate-100">
              {feed.map(({ a, i }) => (
                <li key={a.id} className="px-5 py-3">
                  <p className="text-sm text-slate-800">{a.text}</p>
                  <p className="text-xs text-slate-500">
                    <Link to={`/admin/inquiries/${i.id}`} className="font-mono font-semibold text-navy-700 hover:underline">
                      {i.ref}
                    </Link>{' '}
                    · {a.byName} · {timeAgo(a.at)}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
