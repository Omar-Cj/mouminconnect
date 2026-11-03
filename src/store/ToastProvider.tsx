import { useCallback, useState, type ReactNode } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { ToastContext, type Toast, type ToastInput } from './toast-context'
import { uid } from '@/lib/id'
import { cx } from '@/lib/format'

const icons = {
  success: <CheckCircle2 className="size-5 text-emerald-600" />,
  error: <AlertCircle className="size-5 text-red-600" />,
  info: <Info className="size-5 text-navy-600" />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), [])

  const toast = useCallback(
    (t: ToastInput) => {
      const id = uid('t_')
      setToasts((prev) => [...prev, { id, kind: 'info', ...t }])
      window.setTimeout(() => dismiss(id), 4500)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cx(
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-lift animate-fade-up',
              t.kind === 'success' && 'border-emerald-200',
              t.kind === 'error' && 'border-red-200',
              t.kind === 'info' && 'border-navy-200',
            )}
          >
            {icons[t.kind]}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-navy-900">{t.title}</p>
              {t.description && <p className="mt-0.5 text-sm text-slate-600">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Dismiss">
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
