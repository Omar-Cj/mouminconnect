import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { ArrowLeft, BadgeCheck, CalendarCheck, FileCheck2, Handshake, Mail, MapPin, Phone, RefreshCcw, Search, Star, StickyNote, XCircle, Eye, CheckCheck } from 'lucide-react'
import { SocialIcon } from '@/components/brand/SocialIcons'
import { ActivityFeed } from '@/components/ui/ActivityFeed'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button, ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Input, Textarea } from '@/components/ui/Field'
import { MessageThread } from '@/components/ui/MessageThread'
import { Avatar, CompanyMark, DescriptionList, StatusStepper } from '@/components/ui/Misc'
import { Modal } from '@/components/ui/Modal'
import { PROJECT_TYPES, STATUS, TIMELINES } from '@/lib/constants'
import { cx, fmtDate, fmtDateTime, fmtMoney, fmtRange, timeAgo, toLocalInputDateTime } from '@/lib/format'
import { useTitle } from '@/lib/hooks'
import type { Company } from '@/lib/types'
import { useAuth, useStore } from '@/store/store-context'
import { useToast } from '@/store/toast-context'

type ModalKind = 'match' | 'meeting' | 'agreement' | 'cancel' | null

export default function AdminInquiryDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { inquiries, companies, users, setStatus, matchCompany, scheduleMeeting, recordAgreement, cancelInquiry, addMessage, addNote } = useStore()
  const { toast } = useToast()
  const inquiry = inquiries.find((i) => i.id === id)
  useTitle(inquiry ? `${inquiry.ref} · ${inquiry.title}` : 'Inquiry')

  const [modal, setModal] = useState<ModalKind>(null)
  const [note, setNote] = useState('')

  // match modal state
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [matchMsg, setMatchMsg] = useState('')
  // meeting modal state
  const [meetingAt, setMeetingAt] = useState('')
  const [meetingMsg, setMeetingMsg] = useState('')
  // agreement
  const [value, setValue] = useState('')
  const [agreementMsg, setAgreementMsg] = useState('')
  // cancel
  const [reason, setReason] = useState('')

  const candidates = useMemo(() => {
    if (!inquiry) return [] as Company[]
    const needle = search.trim().toLowerCase()
    return companies
      .filter((c) => c.active)
      .filter((c) => showAll || c.specialties.includes(inquiry.projectType))
      .filter((c) => !needle || c.name.toLowerCase().includes(needle) || c.city.toLowerCase().includes(needle))
      .sort((a, b) => {
        if (a.id === inquiry.preferredCompanyId) return -1
        if (b.id === inquiry.preferredCompanyId) return 1
        if (a.city === inquiry.city && b.city !== inquiry.city) return -1
        if (b.city === inquiry.city && a.city !== inquiry.city) return 1
        if (a.verified !== b.verified) return a.verified ? -1 : 1
        return b.rating - a.rating
      })
  }, [companies, inquiry, search, showAll])

  if (!inquiry || !user) return <Navigate to="/admin/inquiries" replace />

  const customer = users.find((u) => u.id === inquiry.customerId)
  const company = companies.find((c) => c.id === inquiry.matchedCompanyId) ?? null
  const preferred = companies.find((c) => c.id === inquiry.preferredCompanyId) ?? null
  const s = inquiry.status
  const closed = s === 'completed' || s === 'cancelled'

  const openMatch = () => {
    setSelected(inquiry.matchedCompanyId ?? inquiry.preferredCompanyId ?? null)
    setSearch('')
    setShowAll(false)
    setMatchMsg(`Good news, ${customer?.name.split(' ')[0] ?? ''}. We have matched your project with a company that specialises in ${PROJECT_TYPES[inquiry.projectType].label.toLowerCase()} projects. Please review their profile, and we will arrange the first meeting.`)
    setModal('match')
  }
  const openMeeting = () => {
    setMeetingAt(inquiry.meetingAt ? toLocalInputDateTime(inquiry.meetingAt) : '')
    setMeetingMsg(`Your meeting and site assessment with ${company?.name ?? 'the company'} has been scheduled. They will provide an evaluation, a cost estimate and technical details.`)
    setModal('meeting')
  }
  const openAgreement = () => {
    setValue(inquiry.agreementValue ? String(inquiry.agreementValue) : '')
    setAgreementMsg('Congratulations on signing your construction agreement. We remain available if you need anything during the build.')
    setModal('agreement')
  }

  const doMatch = () => {
    if (!selected) return
    matchCompany(inquiry.id, selected, matchMsg)
    const c = companies.find((x) => x.id === selected)
    toast({ kind: 'success', title: `Matched with ${c?.name ?? 'company'}`, description: 'The customer can now see the company profile and contact details.' })
    setModal(null)
  }
  const doMeeting = () => {
    if (!meetingAt) return
    scheduleMeeting(inquiry.id, new Date(meetingAt).toISOString(), meetingMsg)
    toast({ kind: 'success', title: 'Meeting scheduled' })
    setModal(null)
  }
  const doAgreement = () => {
    recordAgreement(inquiry.id, value ? Number(value) : null, agreementMsg)
    toast({ kind: 'success', title: 'Agreement recorded' })
    setModal(null)
  }
  const doCancel = () => {
    cancelInquiry(inquiry.id, reason.trim() || undefined)
    toast({ kind: 'info', title: `Inquiry ${inquiry.ref} cancelled` })
    setModal(null)
    setReason('')
  }

  return (
    <>
      <Link to="/admin/inquiries" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy-900">
        <ArrowLeft className="size-4" /> All inquiries
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-slate-500">{inquiry.ref}</span>
            <StatusBadge status={s} />
            {preferred && <Badge tone="gold">Requested: {preferred.name}</Badge>}
          </div>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">{inquiry.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {PROJECT_TYPES[inquiry.projectType].label} · Submitted {fmtDate(inquiry.createdAt)} · Updated {timeAgo(inquiry.updatedAt)}
          </p>
        </div>
        {customer && (
          <div className="card flex items-center gap-3 p-3 lg:min-w-72">
            <Avatar name={customer.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-navy-900">{customer.name}</p>
              <p className="truncate text-xs text-slate-500">
                {customer.phone} · {customer.city}
              </p>
            </div>
            <ButtonAnchor href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" variant="subtle" size="sm" aria-label="WhatsApp customer">
              <SocialIcon name="whatsapp" className="size-4 text-emerald-600" />
            </ButtonAnchor>
            <ButtonAnchor href={`mailto:${customer.email}`} variant="subtle" size="sm" aria-label="Email customer">
              <Mail className="size-4" />
            </ButtonAnchor>
          </div>
        )}
      </div>

      <div className="card mt-6 p-5">
        <StatusStepper status={s} />
        <p className="mt-4 text-sm text-slate-600">{STATUS[s].description}</p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-7">
          <Card>
            <CardHeader title="Project details" />
            <CardBody>
              <DescriptionList
                items={[
                  { label: 'Location', value: `${inquiry.district}, ${inquiry.city}` },
                  { label: 'Budget', value: fmtRange(inquiry.budgetMin, inquiry.budgetMax) },
                  { label: 'Plot size', value: inquiry.plotSize ? `${inquiry.plotSize} m²` : 'Not specified' },
                  { label: 'Floors', value: inquiry.floors ?? 'Not specified' },
                  { label: 'Owns land / building', value: inquiry.hasLand ? 'Yes' : 'No' },
                  { label: 'Has drawings', value: inquiry.hasDesign ? 'Yes' : 'No' },
                  { label: 'Timeline', value: TIMELINES[inquiry.timeline] },
                  { label: 'Preferred start', value: inquiry.preferredStart ? fmtDate(inquiry.preferredStart) : 'Flexible' },
                ]}
              />
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</p>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700">{inquiry.description}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Messages with customer" description="Visible to the customer in their dashboard." />
            <CardBody>
              <MessageThread messages={inquiry.messages} meId={user.id} onSend={(t) => addMessage(inquiry.id, t)} placeholder="Reply to the customer…" />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Internal notes" description="Only visible to the MBC team." />
            <CardBody>
              {inquiry.notes.length > 0 && (
                <ul className="mb-4 space-y-3">
                  {inquiry.notes.map((n) => (
                    <li key={n.id} className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                      <p className="whitespace-pre-line text-sm text-amber-950">{n.text}</p>
                      <p className="mt-1 text-xs text-amber-800/70">
                        {n.byName} · {fmtDateTime(n.at)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!note.trim()) return
                  addNote(inquiry.id, note)
                  setNote('')
                }}
                className="flex items-end gap-2"
              >
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Add a private note…" className="field-input flex-1 resize-none" aria-label="Internal note" />
                <Button type="submit" variant="outline" disabled={!note.trim()}>
                  <StickyNote className="size-4" /> Add
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6 xl:col-span-5">
          <Card>
            <CardHeader title="Actions" description="Move this inquiry through the process." />
            <CardBody className="space-y-2">
              {s === 'submitted' && (
                <Button variant="primary" className="w-full" onClick={() => { setStatus(inquiry.id, 'under_review'); toast({ kind: 'success', title: 'Review started' }) }}>
                  <Eye className="size-4" /> Start review
                </Button>
              )}
              {(s === 'submitted' || s === 'under_review') && (
                <Button variant="gold" className="w-full" onClick={openMatch}>
                  <Handshake className="size-4" /> Match a company
                </Button>
              )}
              {s === 'matched' && (
                <>
                  <Button variant="gold" className="w-full" onClick={openMeeting}>
                    <CalendarCheck className="size-4" /> Schedule meeting
                  </Button>
                  <Button variant="outline" className="w-full" onClick={openMatch}>
                    <RefreshCcw className="size-4" /> Change company
                  </Button>
                </>
              )}
              {s === 'meeting_scheduled' && (
                <>
                  <Button variant="gold" className="w-full" onClick={openAgreement}>
                    <FileCheck2 className="size-4" /> Record agreement
                  </Button>
                  <Button variant="outline" className="w-full" onClick={openMeeting}>
                    <CalendarCheck className="size-4" /> Reschedule meeting
                  </Button>
                  <Button variant="outline" className="w-full" onClick={openMatch}>
                    <RefreshCcw className="size-4" /> Change company
                  </Button>
                </>
              )}
              {s === 'agreement' && (
                <Button variant="primary" className="w-full" onClick={() => { setStatus(inquiry.id, 'completed', 'Referral fee settled'); toast({ kind: 'success', title: 'Inquiry completed' }) }}>
                  <CheckCheck className="size-4" /> Mark as completed
                </Button>
              )}
              {closed ? (
                <Button variant="outline" className="w-full" onClick={() => { setStatus(inquiry.id, 'under_review', 'Reopened'); toast({ kind: 'info', title: 'Inquiry reopened' }) }}>
                  <RefreshCcw className="size-4" /> Reopen inquiry
                </Button>
              ) : (
                <Button variant="ghost" className="w-full text-red-600 hover:bg-red-50" onClick={() => setModal('cancel')}>
                  <XCircle className="size-4" /> Cancel inquiry
                </Button>
              )}
            </CardBody>
          </Card>

          {company && (
            <Card className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-gold-400 to-gold-600" />
              <CardHeader title="Matched company" />
              <CardBody>
                <div className="flex items-start gap-4">
                  <CompanyMark name={company.name} accent={company.accent} />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base font-bold text-navy-900">{company.name}</p>
                    <p className="text-xs text-slate-500">
                      {company.city} · {company.rating.toFixed(1)} ★ · {company.projectsCompleted} projects
                    </p>
                    {company.verified && (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <BadgeCheck className="size-3.5" /> Verified
                      </p>
                    )}
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <Phone className="size-4 text-gold-600" /> {company.phone}
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="size-4 text-gold-600" /> {company.email}
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="size-4 text-gold-600" /> {company.address}, {company.city}
                  </li>
                </ul>
                <ButtonLink to={`/companies/${company.slug}`} variant="outline" size="sm" className="mt-4 w-full">
                  View public profile
                </ButtonLink>
              </CardBody>
            </Card>
          )}

          {inquiry.meetingAt && (
            <div className="card flex items-start gap-4 p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <CalendarCheck className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Meeting</p>
                <p className="font-display text-base font-bold text-navy-900">{fmtDateTime(inquiry.meetingAt)}</p>
              </div>
            </div>
          )}

          {inquiry.agreementValue != null && (
            <div className="card flex items-start gap-4 p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                <FileCheck2 className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Agreement value</p>
                <p className="font-display text-base font-bold text-navy-900">{fmtMoney(inquiry.agreementValue)}</p>
              </div>
            </div>
          )}

          <Card>
            <CardHeader title="Activity" />
            <CardBody>
              <ActivityFeed activity={inquiry.activity} />
            </CardBody>
          </Card>
        </div>
      </div>

      {/* ---- Match company ---- */}
      <Modal
        open={modal === 'match'}
        onClose={() => setModal(null)}
        size="lg"
        title={company ? 'Change the matched company' : 'Match a company'}
        description={`Companies ${showAll ? 'in the network' : `specialising in ${PROJECT_TYPES[inquiry.projectType].label.toLowerCase()}`}, nearest city first.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={doMatch} disabled={!selected}>
              <Handshake className="size-4" /> Confirm match
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Input label="Search" placeholder="Company or city…" value={search} onChange={(e) => setSearch(e.target.value)} leading={<Search className="size-4" />} className="flex-1" />
          <label className="flex h-11 items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} className="size-4 accent-navy-800" /> Show all specialties
          </label>
        </div>
        <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
          {candidates.length === 0 && <li className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">No companies match. Try “Show all specialties”.</li>}
          {candidates.map((c) => {
            const active = selected === c.id
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelected(c.id)}
                  aria-pressed={active}
                  className={cx('flex w-full items-center gap-3 rounded-xl border p-3 text-left transition', active ? 'border-navy-700 bg-navy-50 ring-4 ring-navy-500/10' : 'border-slate-200 hover:border-navy-300 hover:bg-slate-50')}
                >
                  <CompanyMark name={c.name} accent={c.accent} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                      <span className="truncate">{c.name}</span>
                      {c.verified ? <BadgeCheck className="size-4 shrink-0 text-emerald-600" /> : <Badge tone="amber">Pending</Badge>}
                      {c.id === inquiry.preferredCompanyId && <Badge tone="gold">Requested</Badge>}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {c.city} · {c.specialties.map((sp) => PROJECT_TYPES[sp].label).join(', ')}
                    </span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-600">
                    <Star className="size-3.5 fill-gold-400 text-gold-400" /> {c.rating.toFixed(1)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <Textarea label="Message to customer" rows={3} value={matchMsg} onChange={(e) => setMatchMsg(e.target.value)} className="mt-4" hint="Sent to the customer’s inbox along with the company profile." />
      </Modal>

      {/* ---- Schedule meeting ---- */}
      <Modal
        open={modal === 'meeting'}
        onClose={() => setModal(null)}
        title={inquiry.meetingAt ? 'Reschedule meeting' : 'Schedule meeting & assessment'}
        description={company ? `With ${company.name}` : undefined}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={doMeeting} disabled={!meetingAt}>
              <CalendarCheck className="size-4" /> Save meeting
            </Button>
          </>
        }
      >
        <Input label="Date and time" type="datetime-local" required value={meetingAt} onChange={(e) => setMeetingAt(e.target.value)} />
        <Textarea label="Message to customer" rows={3} value={meetingMsg} onChange={(e) => setMeetingMsg(e.target.value)} className="mt-4" />
      </Modal>

      {/* ---- Record agreement ---- */}
      <Modal
        open={modal === 'agreement'}
        onClose={() => setModal(null)}
        title="Record construction agreement"
        description="The client and company sign directly. Record the outcome here."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={doAgreement}>
              <FileCheck2 className="size-4" /> Save agreement
            </Button>
          </>
        }
      >
        <Input label="Contract value (USD)" type="number" min={0} step={100} value={value} onChange={(e) => setValue(e.target.value)} leading={<span className="text-sm font-semibold">$</span>} hint="Optional. Used to calculate the referral fee agreed with the company." />
        <Textarea label="Message to customer" rows={3} value={agreementMsg} onChange={(e) => setAgreementMsg(e.target.value)} className="mt-4" />
      </Modal>

      {/* ---- Cancel ---- */}
      <Modal
        open={modal === 'cancel'}
        onClose={() => setModal(null)}
        title={`Cancel ${inquiry.ref}?`}
        description="The customer will see the inquiry as cancelled. You can reopen it later."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              Keep inquiry
            </Button>
            <Button variant="danger" onClick={doCancel}>
              Cancel inquiry
            </Button>
          </>
        }
      >
        <Textarea label="Reason (optional)" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Customer no longer building this year" />
      </Modal>
    </>
  )
}
