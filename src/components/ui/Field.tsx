import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cx } from '@/lib/format'

interface FieldChrome {
  label?: string
  hint?: string
  error?: string
  className?: string
  required?: boolean
}

function Chrome({ id, label, hint, error, className, required, children }: FieldChrome & { id: string; children: ReactNode }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  )
}

type InputProps = FieldChrome & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & { leading?: ReactNode; trailing?: ReactNode }

export function Input({ label, hint, error, className, required, id, leading, trailing, ...rest }: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <Chrome id={inputId} label={label} hint={hint} error={error} className={className} required={required}>
      <div className="relative">
        {leading && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">{leading}</span>}
        <input
          id={inputId}
          aria-invalid={!!error}
          className={cx('field-input', !!leading && 'pl-10', !!trailing && 'pr-10', !!error && 'field-input-error')}
          required={required}
          {...rest}
        />
        {trailing && <span className="absolute inset-y-0 right-2 flex items-center">{trailing}</span>}
      </div>
    </Chrome>
  )
}

type TextareaProps = FieldChrome & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>

export function Textarea({ label, hint, error, className, required, id, rows = 4, ...rest }: TextareaProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <Chrome id={inputId} label={label} hint={hint} error={error} className={className} required={required}>
      <textarea id={inputId} rows={rows} aria-invalid={!!error} className={cx('field-input resize-y', error && 'field-input-error')} required={required} {...rest} />
    </Chrome>
  )
}

type SelectProps = FieldChrome & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> & { children: ReactNode }

export function Select({ label, hint, error, className, required, id, children, ...rest }: SelectProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <Chrome id={inputId} label={label} hint={hint} error={error} className={className} required={required}>
      <select id={inputId} aria-invalid={!!error} className={cx('field-input appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 fill=%27none%27 stroke=%27%2364748b%27 stroke-width=%272%27 viewBox=%270 0 24 24%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-10', error && 'field-input-error')} required={required} {...rest}>
        {children}
      </select>
    </Chrome>
  )
}

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label: ReactNode
  description?: string
  className?: string
  error?: string
}

export function Checkbox({ label, description, className, error, id, ...rest }: CheckboxProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className={className}>
      <label htmlFor={inputId} className="flex cursor-pointer items-start gap-3">
        <input
          id={inputId}
          type="checkbox"
          className="mt-0.5 size-4.5 shrink-0 rounded border-slate-300 accent-navy-800 focus:ring-4 focus:ring-navy-500/10"
          {...rest}
        />
        <span>
          <span className="block text-sm font-medium text-navy-900">{label}</span>
          {description && <span className="mt-0.5 block text-xs text-slate-500">{description}</span>}
        </span>
      </label>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
