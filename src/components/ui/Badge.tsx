import type { HTMLAttributes } from 'react'
import type { Level } from '../../types'

type BadgeLevel = Level | 'neutral'
type BadgeStatus = 'active' | 'warning' | 'error'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  level?: BadgeLevel
  status?: BadgeStatus
  dot?: boolean
}

const levelClasses: Record<BadgeLevel, string> = {
  negative: 'bg-negative/15',
  cheap: 'bg-cheap/15',
  mid: 'bg-mid/15',
  expensive: 'bg-expensive/15',
  neutral: 'bg-surface-2',
}

const dotClasses: Record<BadgeLevel, string> = {
  negative: 'bg-negative',
  cheap: 'bg-cheap',
  mid: 'bg-mid',
  expensive: 'bg-expensive',
  neutral: 'bg-fg-muted',
}

const statusClasses: Record<BadgeStatus, string> = {
  active: 'bg-cheap/15',
  warning: 'bg-mid/15',
  error: 'bg-expensive/15',
}

export function Badge({
  level = 'neutral',
  status,
  dot = false,
  className = '',
  children,
  ...props
}: BadgeProps) {
  const backgroundClass = status ? statusClasses[status] : levelClasses[level]
  const dotClass = status
    ? status === 'active'
      ? 'bg-cheap'
      : status === 'warning'
        ? 'bg-mid'
        : 'bg-expensive'
    : dotClasses[level]

  return (
    <span
      {...props}
      className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2 text-xs font-medium text-fg ${backgroundClass} ${className}`}
    >
      {dot && <span aria-hidden="true" className={`size-1.5 rounded-full ${dotClass}`} />}
      {children}
    </span>
  )
}
