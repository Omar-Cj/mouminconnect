import { BRAND } from '@/lib/constants'
import { cx } from '@/lib/format'

const paths = {
  facebook: 'M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.4V14h2.8v8h3.3z',
  tiktok: 'M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z',
  linkedin: 'M6.5 8.5H3.6V20h2.9V8.5zM5 4a1.7 1.7 0 1 0 0 3.4A1.7 1.7 0 0 0 5 4zm15.4 16v-6.3c0-3.1-.7-5.4-4.2-5.4-1.7 0-2.9.9-3.3 1.8h-.1V8.5H10V20h2.9v-5.7c0-1.5.3-3 2.1-3 1.8 0 1.9 1.7 1.9 3.1V20h3.5z',
  youtube: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z',
  whatsapp:
    'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4.1c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3z',
}

export function SocialIcon({ name, className }: { name: keyof typeof paths; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cx('size-5', className)} aria-hidden>
      <path d={paths[name]} />
    </svg>
  )
}

export function SocialLinks({ tone = 'dark', className }: { tone?: 'light' | 'dark'; className?: string }) {
  const links: Array<{ name: keyof typeof paths; href: string; label: string }> = [
    { name: 'facebook', href: BRAND.socials.facebook, label: 'Facebook' },
    { name: 'tiktok', href: BRAND.socials.tiktok, label: 'TikTok' },
    { name: 'linkedin', href: BRAND.socials.linkedin, label: 'LinkedIn' },
    { name: 'youtube', href: BRAND.socials.youtube, label: 'YouTube' },
  ]
  return (
    <div className={cx('flex items-center gap-2', className)}>
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          aria-label={l.label}
          className={cx(
            'flex size-9 items-center justify-center rounded-full transition',
            tone === 'dark' ? 'bg-white/10 text-white hover:bg-gold-500 hover:text-navy-950' : 'bg-navy-50 text-navy-700 hover:bg-navy-800 hover:text-white',
          )}
        >
          <SocialIcon name={l.name} className="size-4" />
        </a>
      ))}
    </div>
  )
}
