import { PageIntro } from '@/components/sections/PageIntro'
import { Services } from '@/components/sections/Services'
import { ProjectTypes } from '@/components/sections/ProjectTypes'
import { WhyUs } from '@/components/sections/WhyUs'
import { CtaBand } from '@/components/sections/CtaBand'
import { useTitle } from '@/lib/hooks'

export default function ServicesPage() {
  useTitle('Services')
  return (
    <>
      <PageIntro
        eyebrow="Adeegyada aan bixino"
        title="Matching, coordination and follow-up, so you can focus on the build"
        lead="We simplify the process by providing connections, arranging meetings, getting quotations and comparing services, so you can make an informed decision."
      />
      <Services showHeader={false} />
      <ProjectTypes />
      <WhyUs />
      <div className="py-20">
        <CtaBand />
      </div>
    </>
  )
}
