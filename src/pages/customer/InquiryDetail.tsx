import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { ArrowLeft, BadgeCheck, CalendarCheck, FileCheck2, Info, Mail, MapPin, Phone, XCircle } from 'lucide-react'
import { SocialIcon } from '@/components/brand/SocialIcons'
import { ActivityFeed } from '@/components/ui/ActivityFeed'
import { StatusBadge } from '@/components/ui/Badge'
import { Button, ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Field'
import { MessageThread } from '@/components/ui/MessageThread'
import { CompanyMark, DescriptionList, StatusStepper } from '@/components/ui/Misc'
import { Modal } from '@/components/ui/Modal'
import { PROJECT_TYPES, STATUS, TIMELINES } from '@/lib/constants'
import { fmtDate, fmtDateTime, fmtMoney, fmtRange } from '@/lib/format'
import { useTitle } from '@/lib/hooks'
import { useAuth, useStore } from '@/store/store-context'
import { useToast } from '@/store/toast-context'

export default function CustomerInquiryDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { inquiries, companies, addMessage, cancelInquiry } = useStore()
  const { toast } = useToast()
  const inquiry = inquiries.find((i) => i.id === id && i.customerId === user?.id)
  useTitle(inquiry ? `${inquiry.ref} · ${inquiry.title}` : 'Inquiry')
  const [cancelOpen, setCancelOpen] = useState(false)
  const [reason, setReason] = useState('')

  if (!inquiry || !user) return <Navigate to="/app" replace />

  const company = companies.find((c) => c.id === inquiry.matchedCompanyId) ?? null
  const canCancel = inquiry.status === 'submitted' || inquiry.status === 'under_review'

  return (
    <>
      <Link to="/app" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy-900">
        <ArrowLeft className="size-4" /> My inquiries
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-slate-500">{inquiry.ref}</span>
            <StatusBadge status={inquiry.status} />
          </div>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">{inquiry.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {PROJECT_TYPES[inquiry.projectType].label} · Submitted {fmtDate(inquiry.createdAt)}
          </p>
        </div>
        {canCancel && (
          <Button variant="outline" onClick={() => setCancelOpen(true)}>
            <XCircle className="size-4" /> Cancel inquiry
          </Button>
        )}
      </div>

      <div className="card mt-6 p-5">
        <StatusStepper status={inquiry.status} />
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-navy-50 p-3.5 text-sm text-navy-900">
          <Info className="mt-0.5 size-4 shrink-0 text-navy-600" />
          <p>{STATUS[inquiry.status].customerHint}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
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
            <CardHeader title="Messages" description="Conversation with the Mumin Build Connect team." />
            <CardBody>
              <MessageThread messages={inquiry.messages} meId={user.id} onSend={(t) => addMessage(inquiry.id, t)} placeholder="Ask a question or share an update…" />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-5">
          {company ? (
            <Card className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-gold-400 to-gold-600" />
              <CardHeader title="Your matched company" description="Introduced by Mumin Build Connect." />
              <CardBody>
                <div className="flex items-start gap-4">
                  <CompanyMark name={company.name} accent={company.accent} size="lg" />
                  <div className="min-w-0">
                    <p className="font-display text-base font-bold text-navy-900">{company.name}</p>
                    <p className="text-sm text-slate-500">{company.tagline}</p>
                    {company.verified && (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <BadgeCheck className="size-3.5" /> Verified by MBC
                      </p>
                    )}
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
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
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <ButtonAnchor href={`https://wa.me/${company.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" variant="primary" size="sm">
                    <SocialIcon name="whatsapp" className="size-4" /> WhatsApp
                  </ButtonAnchor>
                  <ButtonLink to={`/companies/${company.slug}`} variant="outline" size="sm">
                    View profile
                  </ButtonLink>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardHeader title="Matched company" />
              <CardBody>
                <p className="text-sm text-slate-600">
                  {inquiry.status === 'cancelled' ? 'No company was matched before this inquiry was cancelled.' : 'We are still reviewing suitable companies. You will see the company profile and contact details here once matched.'}
                </p>
              </CardBody>
            </Card>
          )}

          {inquiry.meetingAt && (
            <div className="card flex items-start gap-4 p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <CalendarCheck className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Meeting & site assessment</p>
                <p className="font-display text-base font-bold text-navy-900">{fmtDateTime(inquiry.meetingAt)}</p>
                <p className="text-xs text-slate-500">The company will provide an evaluation, cost estimate and technical details.</p>
              </div>
            </div>
          )}

          {inquiry.agreementValue != null && (
            <div className="card flex items-start gap-4 p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                <FileCheck2 className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Construction agreement</p>
                <p className="font-display text-base font-bold text-navy-900">{fmtMoney(inquiry.agreementValue)}</p>
                <p className="text-xs text-slate-500">Signed directly between you and the company.</p>
              </div>
            </div>
          )}

          <Card>
            <CardHeader title="Timeline" />
            <CardBody>
              <ActivityFeed activity={inquiry.activity} showBy={false} />
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel this inquiry?"
        description="You can always start a new inquiry later."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelOpen(false)}>
              Keep inquiry
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                cancelInquiry(inquiry.id, reason.trim() || undefined)
                setCancelOpen(false)
                toast({ kind: 'info', title: `Inquiry ${inquiry.ref} cancelled` })
              }}
            >
              Cancel inquiry
            </Button>
          </>
        }
      >
        <Textarea label="Reason (optional)" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Let us know why, so we can improve." />
      </Modal>
    </>
  )
}
