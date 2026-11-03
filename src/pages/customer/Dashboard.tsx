import { ArrowRight, Building2, ClipboardList, FilePlus2, Inbox, MessageSquare } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { InquiryCard } from '@/components/ui/InquiryCard'
import { EmptyState, PageHeader, StatCard } from '@/components/ui/Misc'
import { OPEN_STATUSES } from '@/lib/constants'
import { useTitle } from '@/lib/hooks'
import { useAuth, useStore } from '@/store/store-context'

export default function CustomerDashboard() {
  useTitle('My inquiries')
  const { user } = useAuth()
  const { inquiries } = useStore()
  const mine = inquiries.filter((i) => i.customerId === user?.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const open = mine.filter((i) => OPEN_STATUSES.includes(i.status))
  const matched = mine.filter((i) => i.matchedCompanyId && i.status !== 'cancelled')
  const unreadish = mine.reduce((n, i) => n + i.messages.filter((m) => m.fromRole === 'admin').length, 0)
  const active = mine.filter((i) => i.status !== 'completed' && i.status !== 'cancelled')
  const closed = mine.filter((i) => i.status === 'completed' || i.status === 'cancelled')

  return (
    <>
      <PageHeader
        eyebrow={`Salaam, ${user?.name.split(' ')[0]}`}
        title="My inquiries"
        description="Follow the progress of each project, read messages from our team and see which company you have been matched with."
        actions={
          <ButtonLink to="/app/inquiries/new" variant="gold">
            <FilePlus2 className="size-4" /> New inquiry
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open inquiries" value={open.length} icon={<ClipboardList className="size-6" />} />
        <StatCard label="Companies matched" value={matched.length} icon={<Building2 className="size-6" />} tone="gold" />
        <StatCard label="Messages from MBC" value={unreadish} icon={<MessageSquare className="size-6" />} tone="green" />
      </div>

      {mine.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<Inbox className="size-6" />}
          title="No inquiries yet"
          description="Tell us what you want to build. It takes about five minutes, and our team will come back with suitable companies."
          action={
            <ButtonLink to="/app/inquiries/new" variant="gold">
              Start your first inquiry <ArrowRight className="size-4" />
            </ButtonLink>
          }
        />
      ) : (
        <>
          {active.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 font-display text-lg font-bold text-navy-900">In progress</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {active.map((i) => (
                  <InquiryCard key={i.id} inquiry={i} to={`/app/inquiries/${i.id}`} />
                ))}
              </div>
            </section>
          )}
          {closed.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 font-display text-lg font-bold text-navy-900">Closed</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {closed.map((i) => (
                  <InquiryCard key={i.id} inquiry={i} to={`/app/inquiries/${i.id}`} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  )
}
