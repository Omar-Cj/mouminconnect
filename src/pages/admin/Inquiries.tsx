import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowUpRight, Inbox, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { Input, Select } from '@/components/ui/Field'
import { Avatar, EmptyState, PageHeader } from '@/components/ui/Misc'
import { ProjectTypeIcon } from '@/components/ui/ProjectTypeIcon'
import { CITIES, PROJECT_TYPES, PROJECT_TYPE_LIST, STATUS, STATUS_LIST } from '@/lib/constants'
import { fmtRange, timeAgo } from '@/lib/format'
import { useTitle } from '@/lib/hooks'
import type { InquiryStatus, ProjectType } from '@/lib/types'
import { useStore } from '@/store/store-context'

export default function AdminInquiries() {
  useTitle('Inquiries')
  const { inquiries, users, companies } = useStore()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const status = params.get('status') ?? ''
  const type = params.get('type') ?? ''
  const city = params.get('city') ?? ''

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return inquiries
      .map((i) => ({ inquiry: i, customer: users.find((u) => u.id === i.customerId), company: companies.find((c) => c.id === i.matchedCompanyId) }))
      .filter(({ inquiry }) => !status || inquiry.status === status)
      .filter(({ inquiry }) => !type || inquiry.projectType === type)
      .filter(({ inquiry }) => !city || inquiry.city === city)
      .filter(
        ({ inquiry, customer }) =>
          !needle ||
          inquiry.ref.toLowerCase().includes(needle) ||
          inquiry.title.toLowerCase().includes(needle) ||
          customer?.name.toLowerCase().includes(needle) ||
          customer?.email.toLowerCase().includes(needle),
      )
      .sort((a, b) => b.inquiry.updatedAt.localeCompare(a.inquiry.updatedAt))
  }, [inquiries, users, companies, q, status, type, city])

  const hasFilters = !!(q || status || type || city)

  return (
    <>
      <PageHeader title="Inquiries" description={`${inquiries.length} inquiries in total. Review new submissions, match companies and keep each project moving.`} />

      <div className="card flex flex-col gap-3 p-4 lg:flex-row lg:items-end">
        <Input label="Search" placeholder="Reference, title or customer…" value={q} onChange={(e) => set('q', e.target.value)} leading={<Search className="size-4" />} className="flex-1" />
        <Select label="Status" value={status} onChange={(e) => set('status', e.target.value)} className="lg:w-48">
          <option value="">All statuses</option>
          {STATUS_LIST.map((s) => (
            <option key={s} value={s}>
              {STATUS[s].label}
            </option>
          ))}
        </Select>
        <Select label="Type" value={type} onChange={(e) => set('type', e.target.value)} className="lg:w-48">
          <option value="">All types</option>
          {PROJECT_TYPE_LIST.map((t) => (
            <option key={t} value={t}>
              {PROJECT_TYPES[t].label}
            </option>
          ))}
        </Select>
        <Select label="City" value={city} onChange={(e) => set('city', e.target.value)} className="lg:w-40">
          <option value="">All cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        {hasFilters && (
          <Button variant="ghost" onClick={() => setParams({}, { replace: true })}>
            Clear
          </Button>
        )}
      </div>

      {rows.length === 0 ? (
        <EmptyState className="mt-6" icon={<Inbox className="size-6" />} title="No inquiries match" description="Try different filters or clear them to see every inquiry." />
      ) : (
        <div className="card relative mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Inquiry</th>
                <th className="hidden px-4 py-3 md:table-cell">Customer</th>
                <th className="hidden px-4 py-3 lg:table-cell">Budget</th>
                <th className="px-4 py-3">Status</th>
                <th className="hidden px-4 py-3 xl:table-cell">Company</th>
                <th className="hidden px-4 py-3 sm:table-cell">Updated</th>
                <th className="px-2 py-3"><span className="sr-only">Open</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(({ inquiry, customer, company }) => (
                <tr key={inquiry.id} className="group transition hover:bg-navy-50/40">
                  <td className="px-4 py-3">
                    <Link to={`/admin/inquiries/${inquiry.id}`} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                        <ProjectTypeIcon type={inquiry.projectType as ProjectType} className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-mono text-[11px] font-semibold text-slate-500">{inquiry.ref}</span>
                        <span className="block max-w-[18rem] truncate font-semibold text-navy-900 group-hover:text-navy-700">{inquiry.title}</span>
                        <span className="block text-xs text-slate-500">
                          {PROJECT_TYPES[inquiry.projectType].label} · {inquiry.city}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {customer ? (
                      <span className="flex items-center gap-2">
                        <Avatar name={customer.name} size="sm" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-navy-900">{customer.name}</span>
                          <span className="block truncate text-xs text-slate-500">{customer.phone}</span>
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-400">Unknown</span>
                    )}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-slate-700 lg:table-cell">{fmtRange(inquiry.budgetMin, inquiry.budgetMax)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inquiry.status as InquiryStatus} />
                  </td>
                  <td className="hidden px-4 py-3 text-slate-700 xl:table-cell">{company?.name ?? <span className="text-slate-400">—</span>}</td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-slate-500 sm:table-cell">{timeAgo(inquiry.updatedAt)}</td>
                  <td className="px-2 py-3">
                    <Link to={`/admin/inquiries/${inquiry.id}`} className="inline-flex rounded-lg p-2 text-slate-400 hover:bg-white hover:text-navy-900" aria-label={`Open ${inquiry.ref}`}>
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
