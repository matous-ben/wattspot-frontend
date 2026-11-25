import type { ButtonHTMLAttributes } from 'react'

export type ToggleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
> & {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
  className = '',
  ...props
}: ToggleProps) {
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      role="switch"
      aria-label={label}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? 'border-accent bg-accent' : 'border-line bg-surface-2'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`size-6 rounded-full bg-fg transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
