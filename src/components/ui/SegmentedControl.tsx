import { useId, type HTMLAttributes } from 'react'

export type SegmentedOption<T extends string> = {
  value: T
  label: string
}

export type SegmentedControlProps<T extends string> = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> & {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  disabled?: boolean
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  disabled = false,
  className = '',
  ...props
}: SegmentedControlProps<T>) {
  const controlId = useId()

  return (
    <div
      {...props}
      role="radiogroup"
      aria-label={label}
      className={`flex h-[54px] items-center rounded-xl border border-line bg-surface p-1 ${
        disabled ? 'opacity-40' : ''
      } ${className}`}
    >
      {options.map((option, index) => {
        const selected = option.value === value
        const inputId = `${controlId}-${index}`

        return (
          <label
            key={option.value}
            htmlFor={inputId}
            className={`flex h-11 flex-1 cursor-pointer items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent ${
              selected
                ? 'bg-surface-2 text-fg'
                : 'text-fg-muted hover:bg-surface-2'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            <input
              id={inputId}
              type="radio"
              name={controlId}
              value={option.value}
              checked={selected}
              disabled={disabled}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="peer-focus-visible:rounded-sm">{option.label}</span>
          </label>
        )
      })}
    </div>
  )
}
