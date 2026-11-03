import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router'
import { ArrowLeft, ArrowRight, BadgeCheck, Check, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Checkbox, Input, Select, Textarea } from '@/components/ui/Field'
import { CompanyMark, DescriptionList, PageHeader } from '@/components/ui/Misc'
import { ProjectTypeIcon } from '@/components/ui/ProjectTypeIcon'
import { BUDGET_PRESETS, CITIES, PROJECT_TYPES, PROJECT_TYPE_LIST, STORAGE_KEYS, TIMELINES } from '@/lib/constants'
import { cx, fmtDate, fmtRange } from '@/lib/format'
import { usePersistentState, useTitle } from '@/lib/hooks'
import type { ProjectType, Timeline } from '@/lib/types'
import { useStore } from '@/store/store-context'
import { useToast } from '@/store/toast-context'

interface Draft {
  projectType: ProjectType | ''
  title: string
  description: string
  city: string
  district: string
  plotSize: string
  floors: string
  hasLand: boolean
  hasDesign: boolean
  budgetMin: string
  budgetMax: string
  timeline: Timeline
  preferredStart: string
  preferredCompanyId: string
  agree: boolean
}

const EMPTY: Draft = {
  projectType: '',
  title: '',
  description: '',
  city: 'Hargeisa',
  district: '',
  plotSize: '',
  floors: '',
  hasLand: true,
  hasDesign: false,
  budgetMin: '',
  budgetMax: '',
  timeline: 'flexible',
  preferredStart: '',
  preferredCompanyId: '',
  agree: false,
}

const STEPS = ['Project', 'Location & site', 'Budget & timeline', 'Review']

type Errors = Partial<Record<keyof Draft, string>>

function YesNo({ label, value, onChange, hint }: { label: string; value: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div>
      <p className="field-label">{label}</p>
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => onChange(v)}
            className={cx('h-9 rounded-lg text-sm font-semibold transition', value === v ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-800')}
            aria-pressed={value === v}
          >
            {v ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  )
}

export default function NewInquiry() {
  useTitle('New inquiry')
  const { companies, createInquiry } = useStore()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [draft, setDraft] = usePersistentState<Draft>(STORAGE_KEYS.draft, () => EMPTY)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Errors>({})

  const urlCompany = companies.find((c) => c.slug === params.get('company') && c.active) ?? null
  const preferredCompany = companies.find((c) => c.id === draft.preferredCompanyId) ?? urlCompany

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setDraft((d) => ({ ...d, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const clearPreferred = () => {
    set('preferredCompanyId', '')
    if (urlCompany) setParams({}, { replace: true })
  }

  const validate = (s: number): Errors => {
    const e: Errors = {}
    if (s === 0) {
      if (!draft.projectType) e.projectType = 'Choose the type of project.'
      if (draft.title.trim().length < 4) e.title = 'Give your project a short title (at least 4 characters).'
      if (draft.description.trim().length < 30) e.description = 'Describe what you want to build in at least 30 characters.'
    }
    if (s === 1) {
      if (!draft.city) e.city = 'Select a city.'
      if (draft.district.trim().length < 2) e.district = 'Enter the district or area.'
      if (draft.plotSize && Number(draft.plotSize) <= 0) e.plotSize = 'Enter a positive number.'
      if (draft.floors && (Number(draft.floors) <= 0 || Number(draft.floors) > 30)) e.floors = 'Enter a number between 1 and 30.'
    }
    if (s === 2) {
      const min = Number(draft.budgetMin)
      const max = Number(draft.budgetMax)
      if (!draft.budgetMin || min <= 0) e.budgetMin = 'Enter your minimum budget.'
      if (!draft.budgetMax || max <= 0) e.budgetMax = 'Enter your maximum budget.'
      else if (max < min) e.budgetMax = 'Maximum must be at least the minimum.'
    }
    if (s === 3 && !draft.agree) e.agree = 'Please confirm to submit your inquiry.'
    return e
  }

  const next = () => {
    const e = validate(step)
    setErrors(e)
    if (Object.keys(e).length) return
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const back = () => {
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
  }

  const submit = () => {
    const e = validate(3)
    setErrors(e)
    if (Object.keys(e).length || !draft.projectType) return
    const inquiry = createInquiry({
      title: draft.title.trim(),
      projectType: draft.projectType,
      description: draft.description.trim(),
      city: draft.city,
      district: draft.district.trim(),
      plotSize: draft.plotSize ? Number(draft.plotSize) : null,
      floors: draft.floors ? Number(draft.floors) : null,
      hasLand: draft.hasLand,
      hasDesign: draft.hasDesign,
      budgetMin: Number(draft.budgetMin),
      budgetMax: Number(draft.budgetMax),
      timeline: draft.timeline,
      preferredStart: draft.preferredStart || null,
      preferredCompanyId: preferredCompany?.id ?? null,
    })
    if (!inquiry) return
    setDraft(EMPTY)
    toast({ kind: 'success', title: `Inquiry ${inquiry.ref} submitted`, description: 'Our team will review it and get back to you within one working day.' })
    navigate(`/app/inquiries/${inquiry.id}`, { replace: true })
  }

  return (
    <>
      <PageHeader
        eyebrow={`Step ${step + 1} of ${STEPS.length}`}
        title="Tell us about your project"
        description="The more detail you share, the better we can match you with the right construction company."
      />

      <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Form steps">
        {STEPS.map((s, i) => (
          <li key={s}>
            <div className={cx('h-1.5 rounded-full', i < step ? 'bg-gold-500' : i === step ? 'bg-navy-700' : 'bg-slate-200')} />
            <p className={cx('mt-2 hidden text-xs sm:block', i <= step ? 'font-semibold text-navy-900' : 'text-slate-500')}>{s}</p>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="card p-6 sm:p-8 lg:col-span-8">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <p className="field-label">What do you want to build?</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {PROJECT_TYPE_LIST.map((t) => {
                    const active = draft.projectType === t
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set('projectType', t)}
                        aria-pressed={active}
                        className={cx(
                          'flex items-start gap-3 rounded-xl border p-3.5 text-left transition',
                          active ? 'border-navy-700 bg-navy-50 ring-4 ring-navy-500/10' : 'border-slate-200 hover:border-navy-300 hover:bg-slate-50',
                        )}
                      >
                        <span className={cx('flex size-9 shrink-0 items-center justify-center rounded-lg', active ? 'bg-navy-800 text-gold-400' : 'bg-gold-100 text-gold-700')}>
                          <ProjectTypeIcon type={t} className="size-5" />
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-navy-900">{PROJECT_TYPES[t].label}</span>
                          <span className="block text-xs text-slate-500">{PROJECT_TYPES[t].labelSo}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
                {errors.projectType && <p className="field-error">{errors.projectType}</p>}
              </div>
              <Input label="Project title" required value={draft.title} onChange={(e) => set('title', e.target.value)} error={errors.title} placeholder="e.g. Two-storey family villa in Jigjiga Yar" />
              <Textarea
                label="Describe your project"
                required
                rows={6}
                value={draft.description}
                onChange={(e) => set('description', e.target.value)}
                error={errors.description}
                hint={`${draft.description.trim().length} characters. Mention rooms, floors, style, special requirements and anything you already have (land, drawings, permits).`}
                placeholder="We want a four-bedroom villa with a majlis and separate kitchen…"
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Select label="City" required value={draft.city} onChange={(e) => set('city', e.target.value)} error={errors.city}>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
                <Input label="District / area" required value={draft.district} onChange={(e) => set('district', e.target.value)} error={errors.district} placeholder="e.g. Jigjiga Yar" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Plot size (m²)" type="number" min={1} inputMode="numeric" value={draft.plotSize} onChange={(e) => set('plotSize', e.target.value)} error={errors.plotSize} placeholder="e.g. 500" hint="Optional, approximate is fine." />
                <Input label="Number of floors" type="number" min={1} max={30} inputMode="numeric" value={draft.floors} onChange={(e) => set('floors', e.target.value)} error={errors.floors} placeholder="e.g. 2" hint="Optional." />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <YesNo label="Do you already own the land / building?" value={draft.hasLand} onChange={(v) => set('hasLand', v)} />
                <YesNo label="Do you have drawings or a design?" value={draft.hasDesign} onChange={(v) => set('hasDesign', v)} hint="If not, we can match you with a design studio first." />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="field-label">Budget range (USD)</p>
                <div className="flex flex-wrap gap-2">
                  {BUDGET_PRESETS.map((p) => {
                    const active = Number(draft.budgetMin) === p.min && Number(draft.budgetMax) === p.max
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          set('budgetMin', String(p.min))
                          set('budgetMax', String(p.max))
                        }}
                        className={cx('rounded-full border px-3.5 py-1.5 text-sm font-semibold transition', active ? 'border-navy-700 bg-navy-800 text-white' : 'border-slate-300 text-slate-700 hover:border-navy-400')}
                      >
                        {p.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Minimum" required type="number" min={0} step={500} inputMode="numeric" value={draft.budgetMin} onChange={(e) => set('budgetMin', e.target.value)} error={errors.budgetMin} leading={<span className="text-sm font-semibold">$</span>} placeholder="20000" />
                <Input label="Maximum" required type="number" min={0} step={500} inputMode="numeric" value={draft.budgetMax} onChange={(e) => set('budgetMax', e.target.value)} error={errors.budgetMax} leading={<span className="text-sm font-semibold">$</span>} placeholder="50000" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Select label="When do you want to start?" value={draft.timeline} onChange={(e) => set('timeline', e.target.value as Timeline)}>
                  {(Object.keys(TIMELINES) as Timeline[]).map((t) => (
                    <option key={t} value={t}>
                      {TIMELINES[t]}
                    </option>
                  ))}
                </Select>
                <Input label="Preferred start date" type="date" value={draft.preferredStart} onChange={(e) => set('preferredStart', e.target.value)} hint="Optional." />
              </div>
            </div>
          )}

          {step === 3 && draft.projectType && (
            <div className="space-y-6">
              <DescriptionList
                items={[
                  { label: 'Project type', value: PROJECT_TYPES[draft.projectType].label },
                  { label: 'Title', value: draft.title },
                  { label: 'Location', value: `${draft.district}, ${draft.city}` },
                  { label: 'Plot / floors', value: `${draft.plotSize ? `${draft.plotSize} m²` : 'n/a'} · ${draft.floors ? `${draft.floors} floor${draft.floors === '1' ? '' : 's'}` : 'n/a'}` },
                  { label: 'Owns land / building', value: draft.hasLand ? 'Yes' : 'No' },
                  { label: 'Has drawings', value: draft.hasDesign ? 'Yes' : 'No' },
                  { label: 'Budget', value: fmtRange(Number(draft.budgetMin), Number(draft.budgetMax)) },
                  { label: 'Timeline', value: `${TIMELINES[draft.timeline]}${draft.preferredStart ? ` · from ${fmtDate(draft.preferredStart)}` : ''}` },
                ]}
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</p>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{draft.description}</p>
              </div>
              {preferredCompany && (
                <div className="flex items-center gap-3 rounded-xl border border-gold-200 bg-gold-50 p-3">
                  <CompanyMark name={preferredCompany.name} accent={preferredCompany.accent} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gold-800">Preferred company</p>
                    <p className="truncate text-sm font-bold text-navy-900">{preferredCompany.name}</p>
                  </div>
                  <button type="button" onClick={clearPreferred} className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-navy-900" aria-label="Remove preferred company">
                    <X className="size-4" />
                  </button>
                </div>
              )}
              <Checkbox
                checked={draft.agree}
                onChange={(e) => set('agree', e.target.checked)}
                error={errors.agree}
                label="I confirm the information is accurate and I understand Mumin Build Connect is an intermediary, not a contractor."
                description="The company we match you with provides the evaluation, estimate and construction. Our referral fee is agreed in writing with the company."
              />
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            {step > 0 ? (
              <Button variant="ghost" onClick={back}>
                <ArrowLeft className="size-4" /> Back
              </Button>
            ) : (
              <Link to="/app" className="inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-navy-900">
                Cancel
              </Link>
            )}
            {step < STEPS.length - 1 ? (
              <Button variant="primary" onClick={next}>
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button variant="gold" size="lg" onClick={submit}>
                <Send className="size-4" /> Submit inquiry
              </Button>
            )}
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-4">
          {preferredCompany && step < 3 && (
            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preferred company</p>
              <div className="mt-3 flex items-center gap-3">
                <CompanyMark name={preferredCompany.name} accent={preferredCompany.accent} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-navy-900">{preferredCompany.name}</p>
                  {preferredCompany.verified && (
                    <p className="inline-flex items-center gap-1 text-xs text-emerald-700">
                      <BadgeCheck className="size-3.5" /> Verified
                    </p>
                  )}
                </div>
                <button type="button" onClick={clearPreferred} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy-900" aria-label="Remove preferred company">
                  <X className="size-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500">We will prioritise this company if their services match your project.</p>
            </div>
          )}
          <div className="card p-5">
            <h3 className="font-display text-sm font-bold text-navy-900">What happens next</h3>
            <ol className="mt-3 space-y-3 text-sm text-slate-600">
              {['We review your inquiry within one working day.', 'We shortlist and match you with a verified company.', 'We arrange the first meeting and site assessment.', 'You compare the estimate, then sign directly with the company.'].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold-100 text-xs font-bold text-gold-800">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl bg-navy-900 p-5 text-white">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Check className="size-4 text-gold-400" /> Your draft is saved automatically
            </p>
            <p className="mt-1 text-xs text-slate-300">You can leave and come back; your answers stay on this device until you submit.</p>
          </div>
        </aside>
      </div>
    </>
  )
}
