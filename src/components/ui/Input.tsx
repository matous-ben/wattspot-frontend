import { useId, type InputHTMLAttributes } from 'react'

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  helper?: string
  suffix?: string
}

export function Input({
  label,
  value,
  onChange,
  error,
  helper,
  suffix,
  disabled,
  id,
  className = '',
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const message = error ?? helper
  const messageId = message ? `${inputId}-message` : undefined

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      <label htmlFor={inputId} className="text-xs font-medium text-fg-muted">
        {label}
      </label>
      <div
        className={`flex h-14 items-center rounded-xl border bg-surface px-4 ${
          error
            ? 'border-expensive focus-within:border-2 focus-within:border-expensive'
            : 'border-line focus-within:border-2 focus-within:border-accent'
        } ${disabled ? 'opacity-40' : ''}`}
      >
        <input
          {...props}
          id={inputId}
          value={value}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 cursor-text bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted disabled:cursor-not-allowed"
        />
        {suffix && (
          <span className="ml-3 text-xs font-medium text-fg-muted">
            {suffix}
          </span>
        )}
      </div>
      {message && (
        <p
          id={messageId}
          className={`text-xs font-medium ${
            error ? 'text-expensive' : 'text-fg-muted'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
