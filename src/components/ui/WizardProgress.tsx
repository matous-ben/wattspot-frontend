export type WizardProgressProps = {
  step: number
  total?: number
  className?: string
}

export function WizardProgress({
  step,
  total = 5,
  className = '',
}: WizardProgressProps) {
  const safeTotal = Math.max(1, Math.floor(total))
  const safeStep = Math.max(1, Math.min(Math.floor(step), safeTotal))

  return (
    <div
      role="progressbar"
      aria-label="Průběh průvodce"
      aria-valuemin={1}
      aria-valuemax={safeTotal}
      aria-valuenow={safeStep}
      className={`flex h-1 gap-1 ${className}`}
    >
      {Array.from({ length: safeTotal }, (_, index) => (
        <span
          key={index}
          className={`h-1 flex-1 rounded-full ${
            index < safeStep ? 'bg-accent' : 'bg-surface-2'
          }`}
        />
      ))}
    </div>
  )
}
