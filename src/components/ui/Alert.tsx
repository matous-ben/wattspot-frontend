import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'
import { IconButton } from './IconButton'

export type AlertType = 'info' | 'success' | 'warning' | 'error'

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  type?: AlertType
  children: ReactNode
  onClose?: () => void
}

const typeClasses: Record<AlertType, string> = {
  info: 'border-accent/20 bg-accent/15',
  success: 'border-cheap/20 bg-cheap/15',
  warning: 'border-mid/20 bg-mid/15',
  error: 'border-expensive/20 bg-expensive/15',
}

const icons: Record<AlertType, ReactNode> = {
  info: <Info size={24} strokeWidth={2} />,
  success: <CircleCheck size={24} strokeWidth={2} />,
  warning: <TriangleAlert size={24} strokeWidth={2} />,
  error: <TriangleAlert size={24} strokeWidth={2} />,
}

export function Alert({
  type = 'info',
  children,
  onClose,
  className = '',
  ...props
}: AlertProps) {
  return (
    <div
      {...props}
      role={type === 'error' ? 'alert' : 'status'}
      className={`flex min-h-12 items-center gap-3 rounded-xl border p-3 text-sm text-fg ${typeClasses[type]} ${className}`}    >
      <span aria-hidden="true" className="shrink-0">
        {icons[type]}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
      {onClose && (
        <IconButton
          icon={<X size={24} strokeWidth={2} />}
          label="Zavřít upozornění"
          variant="ghost"
          onClick={onClose}
        />
      )}
    </div>
  )
}
