import { Building2, Home, PencilRuler, Store, Wrench, type LucideProps } from 'lucide-react'
import type { ProjectType } from '@/lib/types'

const icons: Record<ProjectType, React.ComponentType<LucideProps>> = {
  villa: Home,
  apartment: Building2,
  commercial: Store,
  renovation: Wrench,
  design: PencilRuler,
}

export function ProjectTypeIcon({ type, ...rest }: { type: ProjectType } & LucideProps) {
  const Icon = icons[type]
  return <Icon {...rest} />
}
