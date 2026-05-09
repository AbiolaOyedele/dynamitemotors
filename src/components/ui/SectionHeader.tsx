import { cn } from '@/utils/cn'

type Props = {
  pill: string
  heading: string
  description?: string
  align?: 'center' | 'left'
  headingId?: string
  theme?: 'light' | 'dark'
}

export function SectionHeader({
  pill,
  heading,
  description,
  align = 'center',
  headingId,
  theme = 'light',
}: Props) {
  const isDark = theme === 'dark'

  return (
    <div className={cn('mb-14', align === 'center' && 'text-center')}>
      {/* Pill */}
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full pl-1 pr-4 py-1 mb-5',
          isDark ? 'bg-white/10' : 'bg-[#1ED760]',
        )}
      >
        <span className={cn(
          'flex items-center justify-center w-6 h-6 rounded-full shrink-0',
          isDark ? 'bg-white/10' : 'bg-white',
        )}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="#1ED760"
            aria-hidden="true"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </span>
        <span className={cn(
          'text-[12px] font-bold uppercase tracking-widest leading-none',
          isDark ? 'text-[#1ED760]' : 'text-[#1a1a1a]',
        )}>
          {pill}
        </span>
      </div>

      {/* Heading */}
      <h2
        id={headingId}
        className={cn(
          'text-[28px] md:text-[40px] font-bold leading-tight',
          isDark ? 'text-white' : 'text-[#1a1a1a]',
        )}
      >
        {heading}
      </h2>

      {/* Description */}
      {description && (
        <p
          className={cn(
            'mt-4 text-[18px] leading-relaxed',
            isDark ? 'text-white/50' : 'text-[#666666]',
            align === 'center' && 'max-w-2xl mx-auto',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
