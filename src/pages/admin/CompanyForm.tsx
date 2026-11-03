import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Checkbox, Input, Select, Textarea } from '@/components/ui/Field'
import { CompanyMark, PageHeader } from '@/components/ui/Misc'
import { CITIES, PROJECT_TYPES, PROJECT_TYPE_LIST } from '@/lib/constants'
import { cx, isEmail } from '@/lib/format'
import { useTitle } from '@/lib/hooks'
import type { CompanyInput, PortfolioItem, ProjectType } from '@/lib/types'
import { useStore } from '@/store/store-context'
import { useToast } from '@/store/toast-context'

const ACCENTS = ['#0f2b5b', '#1b3a6d', '#264b87', '#3a63a3', '#0a1f44', '#c9a227', '#a8861f', '#86691a', '#5f85bf']

interface FormState {
  name: string
  tagline: string
  description: string
  specialties: ProjectType[]
  services: string
  city: string
  address: string
  phone: string
  email: string
  founded: string
  projectsCompleted: string
  teamSize: string
  rating: string
  reviewsCount: string
  verified: boolean
  active: boolean
  accent: string
  portfolio: PortfolioItem[]
}

const EMPTY: FormState = {
  name: '',
  tagline: '',
  description: '',
  specialties: [],
  services: '',
  city: 'Hargeisa',
  address: '',
  phone: '+252 63 ',
  email: '',
  founded: String(new Date().getFullYear() - 5),
  projectsCompleted: '0',
  teamSize: '1',
  rating: '4.5',
  reviewsCount: '0',
  verified: false,
  active: true,
  accent: ACCENTS[0]!,
  portfolio: [],
}

export default function AdminCompanyForm() {
  const { id } = useParams()
  const { companies, addCompany, updateCompany } = useStore()
  const { toast } = useToast()
  const navigate = useNavigate()
  const existing = id ? companies.find((c) => c.id === id) : undefined
  const editing = !!id
  useTitle(editing ? `Edit ${existing?.name ?? 'company'}` : 'Add company')

  const [form, setForm] = useState<FormState>(() =>
    existing
      ? {
          name: existing.name,
          tagline: existing.tagline,
          description: existing.description,
          specialties: existing.specialties,
          services: existing.services.join('\n'),
          city: existing.city,
          address: existing.address,
          phone: existing.phone,
          email: existing.email,
          founded: String(existing.founded),
          projectsCompleted: String(existing.projectsCompleted),
          teamSize: String(existing.teamSize),
          rating: String(existing.rating),
          reviewsCount: String(existing.reviewsCount),
          verified: existing.verified,
          active: existing.active,
          accent: existing.accent,
          portfolio: existing.portfolio,
        }
      : EMPTY,
  )
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  if (editing && !existing) return <Navigate to="/admin/companies" replace />

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }
  const toggleSpecialty = (t: ProjectType) => set('specialties', form.specialties.includes(t) ? form.specialties.filter((x) => x !== t) : [...form.specialties, t])
  const setPortfolio = (idx: number, patch: Partial<PortfolioItem>) => set('portfolio', form.portfolio.map((p, i) => (i === idx ? { ...p, ...patch } : p)))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (form.name.trim().length < 2) next.name = 'Enter the company name.'
    if (form.tagline.trim().length < 3) next.tagline = 'Add a short tagline.'
    if (form.description.trim().length < 30) next.description = 'Write at least 30 characters.'
    if (form.specialties.length === 0) next.specialties = 'Choose at least one specialty.'
    if (!form.services.trim()) next.services = 'List at least one service.'
    if (form.phone.replace(/\D/g, '').length < 7) next.phone = 'Enter a valid phone number.'
    if (!isEmail(form.email)) next.email = 'Enter a valid email address.'
    const founded = Number(form.founded)
    if (!founded || founded < 1950 || founded > new Date().getFullYear()) next.founded = 'Enter a valid year.'
    const rating = Number(form.rating)
    if (Number.isNaN(rating) || rating < 0 || rating > 5) next.rating = 'Rating must be between 0 and 5.'
    setErrors(next)
    if (Object.keys(next).length) return

    const input: CompanyInput = {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      specialties: form.specialties,
      services: form.services.split('\n').map((s) => s.trim()).filter(Boolean),
      city: form.city,
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: form.email.trim().toLowerCase(),
      founded,
      projectsCompleted: Math.max(0, Number(form.projectsCompleted) || 0),
      teamSize: Math.max(0, Number(form.teamSize) || 0),
      rating: Math.round(rating * 10) / 10,
      reviewsCount: Math.max(0, Number(form.reviewsCount) || 0),
      verified: form.verified,
      active: form.active,
      accent: form.accent,
      portfolio: form.portfolio.filter((p) => p.title.trim()),
    }
    if (existing) {
      updateCompany(existing.id, input)
      toast({ kind: 'success', title: `${input.name} updated` })
    } else {
      const c = addCompany(input)
      toast({ kind: 'success', title: `${c.name} added`, description: c.verified ? 'Listed as verified.' : 'Listed as pending verification.' })
    }
    navigate('/admin/companies')
  }

  return (
    <>
      <Link to="/admin/companies" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy-900">
        <ArrowLeft className="size-4" /> Companies
      </Link>
      <PageHeader title={editing ? `Edit ${existing?.name}` : 'Add a company'} description="Companies appear in the public directory and can be matched to inquiries." />

      <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <Card>
            <CardHeader title="Profile" />
            <CardBody className="space-y-5">
              <div className="flex items-center gap-4">
                <CompanyMark name={form.name || 'New company'} accent={form.accent} size="lg" />
                <div>
                  <p className="field-label">Brand colour</p>
                  <div className="flex flex-wrap gap-2">
                    {ACCENTS.map((a) => (
                      <button key={a} type="button" onClick={() => set('accent', a)} aria-label={`Colour ${a}`} aria-pressed={form.accent === a} className={cx('size-7 rounded-full ring-2 ring-offset-2 transition', form.accent === a ? 'ring-navy-700' : 'ring-transparent hover:ring-slate-300')} style={{ backgroundColor: a }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Company name" required value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
                <Input label="Tagline" required value={form.tagline} onChange={(e) => set('tagline', e.target.value)} error={errors.tagline} placeholder="e.g. Family villas built to last" />
              </div>
              <Textarea label="Description" required rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} error={errors.description} />
              <div>
                <p className="field-label">
                  Specialties<span className="ml-0.5 text-red-500">*</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TYPE_LIST.map((t) => {
                    const on = form.specialties.includes(t)
                    return (
                      <button key={t} type="button" onClick={() => toggleSpecialty(t)} aria-pressed={on} className={cx('rounded-full border px-3.5 py-1.5 text-sm font-semibold transition', on ? 'border-navy-700 bg-navy-800 text-white' : 'border-slate-300 text-slate-700 hover:border-navy-400')}>
                        {PROJECT_TYPES[t].label}
                      </button>
                    )
                  })}
                </div>
                {errors.specialties && <p className="field-error">{errors.specialties}</p>}
              </div>
              <Textarea label="Services" required rows={4} value={form.services} onChange={(e) => set('services', e.target.value)} error={errors.services} hint="One service per line." />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Contact & location" />
            <CardBody className="grid gap-5 sm:grid-cols-2">
              <Select label="City" value={form.city} onChange={(e) => set('city', e.target.value)}>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
              <Input label="Address" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Street / area" />
              <Input label="Phone" required value={form.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} />
              <Input label="Email" required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Recent projects"
              description="Shown on the public profile."
              action={
                <Button variant="outline" size="sm" onClick={() => set('portfolio', [...form.portfolio, { title: '', type: form.specialties[0] ?? 'villa', year: new Date().getFullYear(), location: form.city }])}>
                  <Plus className="size-4" /> Add project
                </Button>
              }
            />
            <CardBody className="space-y-3">
              {form.portfolio.length === 0 && <p className="text-sm text-slate-500">No projects listed yet.</p>}
              {form.portfolio.map((p, idx) => (
                <div key={idx} className="grid gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1fr_10rem_6rem_8rem_auto] sm:items-end">
                  <Input label="Title" value={p.title} onChange={(e) => setPortfolio(idx, { title: e.target.value })} />
                  <Select label="Type" value={p.type} onChange={(e) => setPortfolio(idx, { type: e.target.value as ProjectType })}>
                    {PROJECT_TYPE_LIST.map((t) => (
                      <option key={t} value={t}>
                        {PROJECT_TYPES[t].label}
                      </option>
                    ))}
                  </Select>
                  <Input label="Year" type="number" value={p.year} onChange={(e) => setPortfolio(idx, { year: Number(e.target.value) })} />
                  <Input label="Location" value={p.location} onChange={(e) => setPortfolio(idx, { location: e.target.value })} />
                  <button type="button" onClick={() => set('portfolio', form.portfolio.filter((_, i) => i !== idx))} className="mb-1 inline-flex size-9 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove project">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <Card>
            <CardHeader title="Track record" />
            <CardBody className="grid grid-cols-2 gap-4">
              <Input label="Founded" type="number" value={form.founded} onChange={(e) => set('founded', e.target.value)} error={errors.founded} />
              <Input label="Team size" type="number" min={0} value={form.teamSize} onChange={(e) => set('teamSize', e.target.value)} />
              <Input label="Projects done" type="number" min={0} value={form.projectsCompleted} onChange={(e) => set('projectsCompleted', e.target.value)} />
              <Input label="Reviews" type="number" min={0} value={form.reviewsCount} onChange={(e) => set('reviewsCount', e.target.value)} />
              <Input label="Rating (0–5)" type="number" min={0} max={5} step={0.1} value={form.rating} onChange={(e) => set('rating', e.target.value)} error={errors.rating} className="col-span-2" />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Status" />
            <CardBody className="space-y-4">
              <Checkbox checked={form.verified} onChange={(e) => set('verified', e.target.checked)} label="Verified by Mumin Build Connect" description="References and past projects have been checked." />
              <Checkbox checked={form.active} onChange={(e) => set('active', e.target.checked)} label="Active" description="Inactive companies are hidden from the directory and matching." />
            </CardBody>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" variant="gold" size="lg">
              <Save className="size-4" /> {editing ? 'Save changes' : 'Add company'}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/admin/companies')}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
