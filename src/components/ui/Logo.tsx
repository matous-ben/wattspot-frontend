import { Zap } from 'lucide-react'

export type LogoProps = {
  className?: string
  iconClassName?: string
}

export function Logo({ className = '', iconClassName = '' }: LogoProps) {
  return (
    <div
      role="img"
      aria-label="WattSpot"
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <span
        aria-hidden="true"
        className={`flex size-10 items-center justify-center rounded-full border-2 border-t-accent border-r-solar border-b-accent border-l-solar text-solar ${iconClassName}`}
      >
        <Zap size={24} strokeWidth={2} />
      </span>
      <span className="text-2xl leading-7 font-semibold tracking-[-0.02em] text-fg">
        Watt
        <span className="text-accent">Spot</span>
      </span>
    </div>
  )
}
