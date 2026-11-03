import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { Building2, Search, SlidersHorizontal } from 'lucide-react'
import { PageIntro } from '@/components/sections/PageIntro'
import { CompanyCard } from '@/components/ui/CompanyCard'
import { Input, Select } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/Misc'
import { CITIES, PROJECT_TYPES, PROJECT_TYPE_LIST } from '@/lib/constants'
import type { ProjectType } from '@/lib/types'
import { useTitle } from '@/lib/hooks'
import { useStore } from '@/store/store-context'

export default function Companies() {
  useTitle('Verified construction companies')
  const { companies } = useStore()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const type = params.get('type') ?? ''
  const city = params.get('city') ?? ''
  const sort = params.get('sort') ?? 'rating'

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return companies
      .filter((c) => c.active)
      .filter((c) => !type || c.specialties.includes(type as ProjectType))
      .filter((c) => !city || c.city === city)
      .filter(
        (c) =>
          !needle ||
          c.name.toLowerCase().includes(needle) ||
          c.tagline.toLowerCase().includes(needle) ||
          c.services.some((s) => s.toLowerCase().includes(needle)),
      )
      .sort((a, b) => {
        if (a.verified !== b.verified) return a.verified ? -1 : 1
        if (sort === 'projects') return b.projectsCompleted - a.projectsCompleted
        if (sort === 'experience') return a.founded - b.founded
        if (sort === 'name') return a.name.localeCompare(b.name)
        return b.rating - a.rating
      })
  }, [companies, q, type, city, sort])

  const hasFilters = !!(q || type || city)

  return (
    <>
      <PageIntro
        eyebrow="Shirkado la hubiyey"
        title="Verified construction companies"
        lead="Browse the companies in our network. Every verified company has had its references and past projects checked by our team."
      />
      <section className="container-x py-10">
        <div className="card flex flex-col gap-3 p-4 md:flex-row md:items-end">
          <Input
            label="Search"
            placeholder="Company name or service…"
            value={q}
            onChange={(e) => set('q', e.target.value)}
            leading={<Search className="size-4" />}
            className="flex-1"
          />
          <Select label="Project type" value={type} onChange={(e) => set('type', e.target.value)} className="md:w-56">
            <option value="">All types</option>
            {PROJECT_TYPE_LIST.map((t) => (
              <option key={t} value={t}>
                {PROJECT_TYPES[t].label}
              </option>
            ))}
          </Select>
          <Select label="City" value={city} onChange={(e) => set('city', e.target.value)} className="md:w-44">
            <option value="">All cities</option>
            {CITIES.filter((c) => c !== 'Other').map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select label="Sort by" value={sort} onChange={(e) => set('sort', e.target.value)} className="md:w-44">
            <option value="rating">Highest rated</option>
            <option value="projects">Most projects</option>
            <option value="experience">Most experienced</option>
            <option value="name">Name A–Z</option>
          </Select>
          {hasFilters && (
            <Button variant="ghost" onClick={() => setParams({}, { replace: true })}>
              Clear
            </Button>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
          <p className="inline-flex items-center gap-2">
            <SlidersHorizontal className="size-4" />
            {results.length} {results.length === 1 ? 'company' : 'companies'}
            {type && (
              <>
                {' '}
                for <strong className="text-navy-900">{PROJECT_TYPES[type as ProjectType]?.label}</strong>
              </>
            )}
            {city && (
              <>
                {' '}
                in <strong className="text-navy-900">{city}</strong>
              </>
            )}
          </p>
        </div>

        {results.length === 0 ? (
          <EmptyState
            className="mt-6"
            icon={<Building2 className="size-6" />}
            title="No companies match these filters"
            description="Try another project type or city. We are adding new verified companies regularly."
            action={
              <Button variant="outline" onClick={() => setParams({}, { replace: true })}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {results.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
