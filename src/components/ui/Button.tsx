import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type ButtonSize = 'md' | 'sm'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:opacity-90 active:opacity-80',
  secondary: 'border border-line bg-surface-2 text-fg hover:opacity-90 active:opacity-80',
  ghost: 'text-accent hover:bg-surface-2 active:opacity-80',
  destructive:
    'border border-expensive text-expensive hover:bg-expensive/10 active:opacity-80',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'min-h-12 px-6',
  sm: 'min-h-11 px-4',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  iconLeft,
  iconRight,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-opacity focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {iconLeft}
      {loading ? 'Načítání…' : children}
      {iconRight}
    </button>
  )
}
