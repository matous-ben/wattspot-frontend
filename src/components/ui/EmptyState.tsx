import type { ReactNode } from 'react'

export type EmptyStateProps = {
  icon: ReactNode
  title: string
  text: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  text,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-48 flex-col items-center justify-center rounded-2xl px-4 text-center ${className}`}
    >
      <div
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full bg-surface-2 text-fg"
      >
        {icon}
      </div>
      <h2 className="mt-4 text-xl leading-6 font-semibold text-fg">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-5 text-fg-muted">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
