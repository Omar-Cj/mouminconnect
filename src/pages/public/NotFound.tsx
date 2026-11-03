import { ButtonLink } from '@/components/ui/Button'
import { useTitle } from '@/lib/hooks'

export default function NotFound() {
  useTitle('Page not found')
  return (
    <section className="container-x flex flex-col items-center py-32 text-center">
      <p className="font-display text-7xl font-black text-navy-100">404</p>
      <h1 className="mt-2 font-display text-2xl font-extrabold text-navy-900">We couldn’t find that page</h1>
      <p className="mt-2 max-w-md text-slate-600">The link may be broken or the page may have moved. Let’s get you back on track.</p>
      <ButtonLink to="/" variant="primary" className="mt-6">
        Back to home
      </ButtonLink>
    </section>
  )
}
