import { createContext, useContext } from 'react'

export type ToastKind = 'success' | 'error' | 'info'
export interface ToastInput {
  title: string
  description?: string
  kind?: ToastKind
}
export interface Toast extends ToastInput {
  id: string
  kind: ToastKind
}

export const ToastContext = createContext<{ toast: (t: ToastInput) => void } | null>(null)

export function useToast() {
  const v = useContext(ToastContext)
  if (!v) throw new Error('useToast must be used inside <ToastProvider>')
  return v
}
