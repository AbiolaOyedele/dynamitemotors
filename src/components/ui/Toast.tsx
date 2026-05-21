'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X } from 'lucide-react'

type Props = {
  show: boolean
  message?: string
  onDismiss: () => void
}

const EASE = [0.25, 0.1, 0.25, 1] as const

export function Toast({
  show,
  message = "Request sent! We'll be in touch shortly.",
  onDismiss,
}: Props) {
  useEffect(() => {
    if (!show) return
    const t = setTimeout(onDismiss, 4500)
    return () => clearTimeout(t)
  }, [show, onDismiss])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 bg-dark text-white px-5 py-4 rounded-2xl shadow-2xl border border-white/10 w-[calc(100vw-48px)] max-w-sm"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 shrink-0"
            aria-hidden="true"
          >
            <CheckCircle size={18} className="text-primary" />
          </div>

          <p className="text-[15px] font-medium leading-snug flex-1">{message}</p>

          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 text-white/40 hover:text-white transition-colors"
            aria-label="Dismiss notification"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
