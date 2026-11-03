import { FilePlus2, LayoutDashboard, UserRound } from 'lucide-react'
import { DashboardLayout, type NavItem } from '@/components/layout/DashboardLayout'
import { SocialIcon } from '@/components/brand/SocialIcons'
import { BRAND, WHATSAPP_URL } from '@/lib/constants'

const nav: NavItem[] = [
  { to: '/app', label: 'My inquiries', icon: LayoutDashboard, end: true },
  { to: '/app/inquiries/new', label: 'New inquiry', icon: FilePlus2 },
  { to: '/app/profile', label: 'Profile', icon: UserRound },
]

export default function CustomerShell() {
  return (
    <DashboardLayout
      nav={nav}
      areaLabel="Customer area"
      footer={
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl bg-emerald-500/15 px-3 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25">
          <SocialIcon name="whatsapp" className="size-4" /> {BRAND.phone}
        </a>
      }
    />
  )
}
