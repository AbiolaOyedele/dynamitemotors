'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/utils/cn'

type Props = {
  pill: string
  heading: string
  description?: string
  align?: 'center' | 'left'
  headingId?: string
  theme?: 'light' | 'dark'
}

const EASE = [0.25, 0.1, 0.25, 1] as const

export function SectionHeader({
  pill,
  heading,
  description,
  align = 'center',
  headingId,
  theme = 'light',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isDark = theme === 'dark'

  return (
    <div ref={ref} className={cn('mb-14', align === 'center' && 'text-center')}>
      {/* Pill */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={cn(
          'inline-flex items-center gap-2 rounded-full pl-1 pr-4 py-1 mb-5',
          isDark ? 'bg-white/10' : 'bg-primary',
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
            fill="currentColor"
            className="text-primary"
            aria-hidden="true"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </span>
        <span className={cn(
          'text-[12px] font-bold uppercase tracking-widest leading-none',
          isDark ? 'text-primary' : 'text-dark',
        )}>
          {pill}
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h2
        id={headingId}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className={cn(
          'text-[28px] md:text-[40px] font-bold leading-tight',
          isDark ? 'text-white' : 'text-dark',
        )}
      >
        {heading}
      </motion.h2>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className={cn(
            'mt-4 text-[18px] leading-relaxed',
            isDark ? 'text-white/55' : 'text-muted',
            align === 'center' && 'max-w-2xl mx-auto',
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
