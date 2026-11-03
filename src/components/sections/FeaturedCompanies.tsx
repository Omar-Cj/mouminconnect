import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { CompanyCard } from '@/components/ui/CompanyCard'
import { useStore } from '@/store/store-context'

export function FeaturedCompanies() {
  const { companies } = useStore()
  const featured = companies
    .filter((c) => c.verified && c.active)
    .sort((a, b) => b.rating - a.rating || b.projectsCompleted - a.projectsCompleted)
    .slice(0, 3)
  if (featured.length === 0) return null
  return (
    <section className="bg-slate-50">
      <div className="container-x py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Our network</p>
            <h2 className="section-title">Verified construction companies</h2>
            <p className="section-lead">Each company in our network has been checked for references, past projects and capacity.</p>
          </div>
          <ButtonLink to="/companies" variant="outline">
            View all companies <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featured.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>
      </div>
    </section>
  )
}
