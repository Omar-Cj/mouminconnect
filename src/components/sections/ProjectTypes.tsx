import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { ProjectTypeIcon } from '@/components/ui/ProjectTypeIcon'
import { PROJECT_TYPES, PROJECT_TYPE_LIST } from '@/lib/constants'

export function ProjectTypes({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section className="container-x py-20">
      {showHeader && (
        <div className="max-w-2xl">
          <p className="eyebrow">Noocyada mashruucyada</p>
          <h2 className="section-title">Projects we connect</h2>
          <p className="section-lead">From a single-family villa to a commercial block, we have companies for every type of build.</p>
        </div>
      )}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {PROJECT_TYPE_LIST.map((t) => (
          <Link
            key={t}
            to={`/companies?type=${t}`}
            className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-lift"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-gold-100 text-gold-700 transition group-hover:bg-gold-500 group-hover:text-navy-950">
              <ProjectTypeIcon type={t} className="size-6" />
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-navy-900">{PROJECT_TYPES[t].label}</h3>
            <p className="text-xs font-semibold text-gold-700">{PROJECT_TYPES[t].labelSo}</p>
            <p className="mt-2 flex-1 text-sm text-slate-600">{PROJECT_TYPES[t].description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-800">
              Find companies <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
