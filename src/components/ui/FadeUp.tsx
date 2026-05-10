'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type Props = {
  children: React.ReactNode
  delay?: number
  className?: string
}

const EASE = [0.25, 0.1, 0.25, 1] as const

export function FadeUp({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
