import { Hero } from '@/components/sections/Hero'
import { FlowStrip } from '@/components/sections/FlowStrip'
import { Services } from '@/components/sections/Services'
import { HowWeWork } from '@/components/sections/HowWeWork'
import { ProjectTypes } from '@/components/sections/ProjectTypes'
import { WhyUs } from '@/components/sections/WhyUs'
import { Commitment } from '@/components/sections/Commitment'
import { FeaturedCompanies } from '@/components/sections/FeaturedCompanies'
import { CtaBand } from '@/components/sections/CtaBand'
import { useTitle } from '@/lib/hooks'

export default function Home() {
  useTitle('Your trusted bridge to a better home')
  return (
    <>
      <Hero />
      <FlowStrip />
      <Services />
      <HowWeWork />
      <ProjectTypes />
      <WhyUs />
      <Commitment />
      <FeaturedCompanies />
      <div className="py-20">
        <CtaBand />
      </div>
    </>
  )
}
