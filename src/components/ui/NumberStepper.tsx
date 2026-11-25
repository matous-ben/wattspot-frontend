import { Minus, Plus } from 'lucide-react'
import { IconButton } from './IconButton'

export type NumberStepperProps = {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  unit: string
  label: string
  disabled?: boolean
}

export function NumberStepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  label,
  disabled = false,
}: NumberStepperProps) {
  const precision = Math.max(
    decimalPlaces(value),
    decimalPlaces(step),
  )
  const formattedValue = new Intl.NumberFormat('cs-CZ', {
    maximumFractionDigits: precision,
  }).format(value)

  const updateValue = (nextValue: number) => {
    const roundedValue = Number(nextValue.toFixed(precision))
    onChange(Math.min(max, Math.max(min, roundedValue)))
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={`flex h-14 items-center justify-between rounded-xl border border-line bg-surface px-2 ${
        disabled ? 'opacity-40' : ''
      }`}
    >
      <IconButton
        icon={<Minus size={24} strokeWidth={2} />}
        label={`Snížit ${label}`}
        variant="ghost"
        disabled={disabled || value <= min}
        onClick={() => updateValue(value - step)}
      />
      <output className="text-sm font-semibold text-fg tabular-nums" aria-live="polite">
        {formattedValue} {unit}
      </output>
      <IconButton
        icon={<Plus size={24} strokeWidth={2} />}
        label={`Zvýšit ${label}`}
        variant="ghost"
        disabled={disabled || value >= max}
        onClick={() => updateValue(value + step)}
      />
    </div>
  )
}

function decimalPlaces(value: number) {
  const decimalPart = value.toString().split('.')[1]
  return decimalPart?.length ?? 0
}
