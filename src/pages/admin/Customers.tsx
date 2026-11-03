import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Search, Users } from 'lucide-react'
import { Input } from '@/components/ui/Field'
import { Avatar, EmptyState, PageHeader } from '@/components/ui/Misc'
import { OPEN_STATUSES } from '@/lib/constants'
import { fmtDate } from '@/lib/format'
import { useTitle } from '@/lib/hooks'
import { useStore } from '@/store/store-context'

export default function AdminCustomers() {
  useTitle('Customers')
  const { users, inquiries } = useStore()
  const [q, setQ] = useState('')

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return users
      .filter((u) => u.role === 'customer')
      .filter((u) => !needle || u.name.toLowerCase().includes(needle) || u.email.toLowerCase().includes(needle) || u.phone.includes(needle))
      .map((u) => {
        const mine = inquiries.filter((i) => i.customerId === u.id)
        return { user: u, total: mine.length, open: mine.filter((i) => OPEN_STATUSES.includes(i.status)).length, last: mine.map((i) => i.updatedAt).sort().at(-1) ?? null }
      })
      .sort((a, b) => (b.last ?? b.user.createdAt).localeCompare(a.last ?? a.user.createdAt))
  }, [users, inquiries, q])

  return (
    <>
      <PageHeader title="Customers" description="Everyone who has registered on the platform, with their inquiry history." />
      <div className="card p-4">
        <Input label="Search" placeholder="Name, email or phone…" value={q} onChange={(e) => setQ(e.target.value)} leading={<Search className="size-4" />} className="max-w-md" />
      </div>
      {rows.length === 0 ? (
        <EmptyState className="mt-6" icon={<Users className="size-6" />} title="No customers found" />
      ) : (
        <div className="card relative mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="hidden px-4 py-3 md:table-cell">Contact</th>
                <th className="hidden px-4 py-3 sm:table-cell">City</th>
                <th className="px-4 py-3">Inquiries</th>
                <th className="hidden px-4 py-3 lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(({ user, total, open }) => (
                <tr key={user.id} className="hover:bg-navy-50/40">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <span className="min-w-0">
                        <span className="block font-semibold text-navy-900">{user.name}</span>
                        <span className="block truncate text-xs text-slate-500 md:hidden">{user.email}</span>
                      </span>
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="block text-slate-700">{user.email}</span>
                    <span className="block text-xs text-slate-500">{user.phone}</span>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-700 sm:table-cell">{user.city}</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/inquiries?q=${encodeURIComponent(user.email)}`} className="font-semibold text-navy-800 hover:underline">
                      {total} total
                    </Link>
                    <span className="block text-xs text-slate-500">{open} open</span>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-slate-500 lg:table-cell">{fmtDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
