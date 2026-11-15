import type { HTMLAttributes } from 'react'

export type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-2xl border border-line bg-surface p-4 ${className}`}
    />
  )
}
