import { CalendarCheck, CircleDot, FileCheck2, FilePlus2, Handshake, MessageSquare, StickyNote, XCircle } from 'lucide-react'
import type { Activity } from '@/lib/types'
import { timeAgo } from '@/lib/format'

const icons: Record<Activity['type'], { icon: typeof CircleDot; cls: string }> = {
  created: { icon: FilePlus2, cls: 'bg-sky-50 text-sky-600' },
  status: { icon: CircleDot, cls: 'bg-slate-100 text-slate-600' },
  match: { icon: Handshake, cls: 'bg-navy-50 text-navy-700' },
  meeting: { icon: CalendarCheck, cls: 'bg-violet-50 text-violet-600' },
  agreement: { icon: FileCheck2, cls: 'bg-gold-100 text-gold-700' },
  message: { icon: MessageSquare, cls: 'bg-emerald-50 text-emerald-600' },
  note: { icon: StickyNote, cls: 'bg-amber-50 text-amber-600' },
  cancelled: { icon: XCircle, cls: 'bg-red-50 text-red-600' },
}

export function ActivityFeed({ activity, showBy = true }: { activity: Activity[]; showBy?: boolean }) {
  const items = [...activity].sort((a, b) => b.at.localeCompare(a.at))
  return (
    <ol className="relative space-y-4 border-l border-slate-200 pl-6">
      {items.map((a) => {
        const { icon: Icon, cls } = icons[a.type]
        return (
          <li key={a.id} className="relative">
            <span className={`absolute -left-[31px] flex size-6 items-center justify-center rounded-full ring-4 ring-white ${cls}`}>
              <Icon className="size-3.5" />
            </span>
            <p className="text-sm text-slate-800">{a.text}</p>
            <p className="text-xs text-slate-500">
              {timeAgo(a.at)}
              {showBy && ` · ${a.byName}`}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
