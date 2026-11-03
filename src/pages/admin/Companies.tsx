import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { BadgeCheck, Building2, ExternalLink, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Field'
import { CompanyMark, EmptyState, PageHeader } from '@/components/ui/Misc'
import { Modal } from '@/components/ui/Modal'
import { PROJECT_TYPES } from '@/lib/constants'
import { cx } from '@/lib/format'
import { useTitle } from '@/lib/hooks'
import type { Company } from '@/lib/types'
import { useStore } from '@/store/store-context'
import { useToast } from '@/store/toast-context'

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cx('relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition', on ? 'bg-emerald-500' : 'bg-slate-300')}
    >
      <span className={cx('inline-block size-5 rounded-full bg-white shadow transition', on ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  )
}

export default function AdminCompanies() {
  useTitle('Companies')
  const { companies, inquiries, updateCompany, deleteCompany } = useStore()
  const { toast } = useToast()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'inactive'>('all')
  const [toDelete, setToDelete] = useState<Company | null>(null)

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return companies
      .filter((c) => (filter === 'verified' ? c.verified && c.active : filter === 'pending' ? !c.verified && c.active : filter === 'inactive' ? !c.active : true))
      .filter((c) => !needle || c.name.toLowerCase().includes(needle) || c.city.toLowerCase().includes(needle))
      .map((c) => ({ company: c, matches: inquiries.filter((i) => i.matchedCompanyId === c.id).length }))
      .sort((a, b) => a.company.name.localeCompare(b.company.name))
  }, [companies, inquiries, q, filter])

  const confirmDelete = () => {
    if (!toDelete) return
    deleteCompany(toDelete.id)
    toast({ kind: 'info', title: `${toDelete.name} removed` })
    setToDelete(null)
  }

  return (
    <>
      <PageHeader
        title="Companies"
        description={`${companies.filter((c) => c.verified && c.active).length} verified · ${companies.filter((c) => !c.verified && c.active).length} pending verification`}
        actions={
          <ButtonLink to="/admin/companies/new" variant="gold">
            <Plus className="size-4" /> Add company
          </ButtonLink>
        }
      />

      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <Input label="Search" placeholder="Name or city…" value={q} onChange={(e) => setQ(e.target.value)} leading={<Search className="size-4" />} className="flex-1" />
        <Select label="Show" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="sm:w-48">
          <option value="all">All companies</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending verification</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      {rows.length === 0 ? (
        <EmptyState className="mt-6" icon={<Building2 className="size-6" />} title="No companies found" />
      ) : (
        <div className="card relative mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="hidden px-4 py-3 lg:table-cell">Specialties</th>
                <th className="hidden px-4 py-3 md:table-cell">Matches</th>
                <th className="px-4 py-3">Verified</th>
                <th className="hidden px-4 py-3 sm:table-cell">Active</th>
                <th className="px-2 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(({ company, matches }) => (
                <tr key={company.id} className={cx('hover:bg-navy-50/40', !company.active && 'opacity-60')}>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3">
                      <CompanyMark name={company.name} accent={company.accent} size="sm" />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 font-semibold text-navy-900">
                          <span className="truncate">{company.name}</span>
                          {company.verified && <BadgeCheck className="size-4 shrink-0 text-emerald-600" />}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {company.city} · since {company.founded}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span className="flex flex-wrap gap-1">
                      {company.specialties.map((s) => (
                        <Badge key={s} tone="navy">
                          {PROJECT_TYPES[s].label}
                        </Badge>
                      ))}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-700 md:table-cell">{matches}</td>
                  <td className="px-4 py-3">
                    <Toggle on={company.verified} label={`Verified: ${company.name}`} onChange={(v) => { updateCompany(company.id, { verified: v }); toast({ kind: 'success', title: v ? `${company.name} marked as verified` : `${company.name} set to pending` }) }} />
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <Toggle on={company.active} label={`Active: ${company.name}`} onChange={(v) => updateCompany(company.id, { active: v })} />
                  </td>
                  <td className="px-2 py-3">
                    <span className="flex items-center justify-end gap-1">
                      <Link to={`/companies/${company.slug}`} className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-navy-900" aria-label="View public profile" title="View public profile">
                        <ExternalLink className="size-4" />
                      </Link>
                      <Link to={`/admin/companies/${company.id}/edit`} className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-navy-900" aria-label="Edit" title="Edit">
                        <Pencil className="size-4" />
                      </Link>
                      <button onClick={() => setToDelete(company)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete" title="Delete">
                        <Trash2 className="size-4" />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title={`Remove ${toDelete?.name}?`}
        description="Existing inquiries matched with this company will keep their history, but the company will no longer appear anywhere."
        footer={
          <>
            <Button variant="ghost" onClick={() => setToDelete(null)}>
              Keep company
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Remove company
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">Prefer to hide it temporarily? Use the “Active” toggle instead.</p>
      </Modal>
    </>
  )
}
