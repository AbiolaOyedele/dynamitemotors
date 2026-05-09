import { cn } from '@/utils/cn'

type CardProps = {
  children: React.ReactNode
  className?: string
}

type CardSectionProps = {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#E8E8E8] bg-white',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardSectionProps) {
  return (
    <div className={cn('p-6 pb-0', className)}>{children}</div>
  )
}

export function CardBody({ children, className }: CardSectionProps) {
  return (
    <div className={cn('p-6', className)}>{children}</div>
  )
}

export function CardFooter({ children, className }: CardSectionProps) {
  return (
    <div className={cn('px-6 pb-6 pt-0', className)}>{children}</div>
  )
}
