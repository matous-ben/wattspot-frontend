import type { ReactNode } from 'react'
import { Card } from './Card'

export type MetricCardProps = {
  label: string
  value: ReactNode
  unit?: string
  delta?: {
    text: string
    status: 'active' | 'warning' | 'error'
  }
  className?: string
}

export function MetricCard({
  label,
  value,
  unit,
  delta,
  className = '',
}: MetricCardProps) {
  const deltaClasses = {
    active: 'bg-cheap/15',
    warning: 'bg-mid/15',
    error: 'bg-expensive/15',
  }

  return (
    <Card className={`flex min-h-32 flex-col justify-between ${className}`}>
      <p className="text-xs font-medium text-fg-muted">{label}</p>
      <p className="mt-2 text-2xl leading-7 font-semibold tabular-nums text-fg">
        {value}
        {unit && <span className="ml-1 text-sm text-fg-muted">{unit}</span>}
      </p>
      {delta && (
        <span
          className={`mt-3 w-fit rounded-full px-2 py-1 text-xs font-medium text-fg ${deltaClasses[delta.status]}`}
        >
          {delta.text}
        </span>
      )}
    </Card>
  )
}
