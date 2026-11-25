import { Check } from 'lucide-react'
import { useId, type InputHTMLAttributes } from 'react'

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> & {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  className = '',
  id,
  ...props
}: CheckboxProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex min-h-11 items-center gap-3 text-sm text-fg ${
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
      } ${className}`}
    >
      <input
        {...props}
        id={inputId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg border border-line bg-surface peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
      >
        {checked && <Check className="size-4 text-on-accent" strokeWidth={2} />}
      </span>
      <span>{label}</span>
    </label>
  )
}
