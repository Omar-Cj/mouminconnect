import { Link } from 'react-router'
import logoFull from '@/assets/brand/logo-full.png'
import logoFullWhite from '@/assets/brand/logo-full-white.png'
import logoMark from '@/assets/brand/logo-mark.png'
import logoMarkWhite from '@/assets/brand/logo-mark-white.png'
import { BRAND } from '@/lib/constants'
import { cx } from '@/lib/format'

interface LogoProps {
  variant?: 'lockup' | 'full' | 'mark'
  tone?: 'light' | 'dark'
  className?: string
  to?: string | null
}

/**
 * lockup: brand mark + text wordmark (crisp at small sizes, used in headers)
 * full:   the original brand lockup incl. tagline (used in footer / about)
 * mark:   just the house + skyline mark
 */
export function Logo({ variant = 'lockup', tone = 'light', className, to = '/' }: LogoProps) {
  const onDark = tone === 'dark'
  let content
  if (variant === 'full') {
    content = <img src={onDark ? logoFullWhite : logoFull} alt={BRAND.name} className={cx('h-auto w-48', className)} />
  } else if (variant === 'mark') {
    content = <img src={onDark ? logoMarkWhite : logoMark} alt={BRAND.name} className={cx('h-10 w-auto', className)} />
  } else {
    content = (
      <span className={cx('inline-flex items-center gap-2.5', className)}>
        <img src={onDark ? logoMarkWhite : logoMark} alt="" className="h-9 w-auto" />
        <span className="flex flex-col leading-none">
          <span className={cx('font-display text-[15px] font-black tracking-tight', onDark ? 'text-white' : 'text-navy-900')}>
            MUMIN <span className="text-gold-500">BUILD</span>
          </span>
          <span className={cx('mt-0.5 font-display text-[9px] font-bold tracking-[0.34em]', onDark ? 'text-white/80' : 'text-navy-800')}>CONNECT</span>
        </span>
      </span>
    )
  }
  if (!to) return content
  return (
    <Link to={to} className="inline-flex items-center rounded-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-500/30" aria-label={`${BRAND.name} home`}>
      {content}
    </Link>
  )
}
