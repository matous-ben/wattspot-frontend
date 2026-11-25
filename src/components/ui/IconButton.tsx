import type { ButtonHTMLAttributes, ReactNode } from 'react'

type IconButtonVariant = 'primary' | 'secondary' | 'ghost'

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode
  label: string
  variant?: IconButtonVariant
}

const variantClasses: Record<IconButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:opacity-90 active:opacity-80',
  secondary:
    'border border-line bg-surface-2 text-fg hover:opacity-90 active:opacity-80',
  ghost: 'text-fg hover:bg-surface-2 active:opacity-80',
}

export function IconButton({
  icon,
  label,
  variant = 'secondary',
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 ${variantClasses[variant]} ${className}`}
    >
      {icon}
    </button>
  )
}
