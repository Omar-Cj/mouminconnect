import { useState } from 'react'
import { Building2, ClipboardList, LayoutDashboard, RotateCcw, Users } from 'lucide-react'
import { DashboardLayout, type NavItem } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { resetDemoData } from '@/lib/seed'

const nav: NavItem[] = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/inquiries', label: 'Inquiries', icon: ClipboardList },
  { to: '/admin/companies', label: 'Companies', icon: Building2 },
  { to: '/admin/customers', label: 'Customers', icon: Users },
]

export default function AdminShell() {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const reset = async () => {
    setBusy(true)
    await resetDemoData()
    window.location.assign('/login')
  }
  return (
    <>
      <DashboardLayout
        nav={nav}
        areaLabel="Admin panel"
        footer={
          <button onClick={() => setOpen(true)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white">
            <RotateCcw className="size-4" /> Reset demo data
          </button>
        }
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Reset demo data?"
        description="All accounts, companies and inquiries stored in this browser will be replaced with the original sample data, and you will be signed out."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Keep my data
            </Button>
            <Button variant="danger" onClick={reset} loading={busy}>
              Reset and sign out
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">This cannot be undone. Use it to return the prototype to a clean state before a demo.</p>
      </Modal>
    </>
  )
}
