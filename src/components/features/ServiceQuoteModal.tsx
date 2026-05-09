'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { HeroQuoteForm } from './HeroQuoteForm'

type Props = {
  service: string | null
  onClose: () => void
}

export function ServiceQuoteModal({ service, onClose }: Props) {
  useEffect(() => {
    if (!service) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [service, onClose])

  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [service])

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Book ${service}`}
            className="relative z-10 w-full max-w-lg bg-white/[0.08] backdrop-blur-md border border-white/15 rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-primary text-[12px] font-bold tracking-widest uppercase mb-1">
                  Book a service
                </p>
                <h2 className="text-[22px] font-bold text-white leading-tight">
                  {service}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors shrink-0 ml-4"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <HeroQuoteForm initialService={service} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
