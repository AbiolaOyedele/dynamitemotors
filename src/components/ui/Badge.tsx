import { cn } from '@/utils/cn'

type Variant = 'green' | 'dark' | 'muted'

type BadgeProps = {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

const variants: Record<Variant, string> = {
  green: 'bg-[#f0fff4] text-[#1a1a1a] border border-[#1ED760]',
  dark:  'bg-[#1a1a1a] text-white',
  muted: 'bg-[#E8E8E8] text-[#666666]',
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
