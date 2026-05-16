'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/utils/cn'

type Props = {
  pill?: string
  heading: string
  description?: string
  align?: 'center' | 'left'
  headingId?: string
  theme?: 'light' | 'dark'
}

const EASE = [0.25, 0.1, 0.25, 1] as const

export function SectionHeader({
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
      {/* Heading */}
      <motion.h2
        id={headingId}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="text-[28px] md:text-[40px] font-bold leading-tight text-primary"
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
