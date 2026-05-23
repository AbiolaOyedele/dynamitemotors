'use client'

import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { CalendarDays, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
}

const isSunday = (date: Date) => date.getDay() === 0

const triggerBase =
  'w-full h-[52px] rounded-xl text-[16px] px-4 ' +
  'bg-white/5 border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary ' +
  'focus:border-primary focus:bg-white/10 hover:border-white/50 transition-all duration-200 ' +
  'cursor-pointer flex items-center justify-between'

export function BookingCalendar({ selected, onSelect }: Props) {
  const [open, setOpen] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Close on Escape — stopImmediatePropagation prevents the parent modal also closing
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation()
        setOpen(false)
      }
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function handleSelect(date: Date | undefined) {
    onSelect(date)
    if (date) setOpen(false)
  }

  const displayValue = selected
    ? selected.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <>
      {/* Trigger — looks like the other form inputs */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerBase}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={selected ? 'text-white' : 'text-white/40'}>
          {displayValue ?? 'Preferred date'}
        </span>
        <CalendarDays size={18} className="text-white/40 shrink-0" aria-hidden="true" />
      </button>

      {/* Centered popup overlay — rendered in place (modal is already fixed) */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
              onClick={() => setOpen(false)}
            />

            {/* Calendar card */}
            <motion.div
              role="dialog"
              aria-label="Pick a date"
              aria-modal="true"
              className="relative z-10 rounded-2xl border border-white/15 bg-[#1c1c1c] shadow-2xl p-5 w-full max-w-[320px]"
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-[14px] font-semibold text-white/60 uppercase tracking-wider">
                  Pick a date
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close calendar"
                  className="flex items-center justify-center w-7 h-7 rounded-full border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>

              <DayPicker
                mode="single"
                selected={selected}
                onSelect={handleSelect}
                disabled={[{ before: today }, isSunday]}
                showOutsideDays={false}
                classNames={{
                  root:            'w-full',
                  months:          'w-full',
                  month:           'w-full',
                  month_caption:   'flex items-center justify-between px-1 pb-3 mb-1 border-b border-white/10',
                  caption_label:   'text-[15px] font-semibold text-white',
                  nav:             'flex items-center gap-1',
                  button_previous: 'flex items-center justify-center w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors',
                  button_next:     'flex items-center justify-center w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors',
                  month_grid:      'w-full mt-3 border-collapse',
                  weekdays:        'flex w-full mb-1',
                  weekday:         'flex-1 text-center text-[12px] font-medium text-white/35 py-1',
                  week:            'flex w-full',
                  day:             'flex-1 flex items-center justify-center p-[2px]',
                  day_button:      'w-full aspect-square rounded-lg text-[14px] font-medium transition-colors text-white/80 hover:bg-white/10 hover:text-white',
                  selected:        '[&>button]:!bg-primary [&>button]:!text-dark [&>button]:!font-bold',
                  today:           '[&>button]:border [&>button]:border-primary/60 [&>button]:text-primary',
                  disabled:        '[&>button]:!text-white/20 [&>button]:!cursor-not-allowed [&>button]:hover:!bg-transparent',
                  outside:         '[&>button]:text-white/20',
                  hidden:          'invisible',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
