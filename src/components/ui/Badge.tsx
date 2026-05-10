import { cn } from '@/utils/cn'

type Variant = 'green' | 'dark' | 'muted'

type BadgeProps = {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

const variants: Record<Variant, string> = {
  green: 'bg-primary/10 text-dark border border-primary/45',
  dark:  'bg-dark text-white',
  muted: 'bg-border text-muted',
}

export function Badge({ children, variant = 'green', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[13px] font-600 leading-none',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
