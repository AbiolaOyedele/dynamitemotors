'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'

const STEPS = [
  {
    number: '01',
    title: 'Book Online or Call',
    description:
      "Fill in our quick quote form or give us a ring. We'll confirm your slot and answer any questions — no waiting, no hassle.",
  },
  {
    number: '02',
    title: 'Drop Your Car Off',
    description:
      "Bring your car to our Northfleet garage at the agreed time. We'll carry out a thorough inspection before any work begins.",
  },
  {
    number: '03',
    title: 'We Get to Work',
    description:
      "Our experienced technicians carry out the job to a high standard. We'll keep you updated if anything unexpected comes up — no surprises.",
  },
  {
    number: '04',
    title: 'Collect & Drive Away',
    description:
      "We'll call you as soon as your car is ready. Pay, collect, and drive away knowing the job's been done properly.",
  },
]

const EASE = [0.25, 0.1, 0.25, 1] as const

export function ProcessSteps() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1))
    }, 50)
    return () => clearInterval(interval)
  }, [active])

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => {
        setActive((prev) => (prev + 1) % STEPS.length)
        setProgress(0)
      }, 200)
      return () => clearTimeout(t)
    }
  }, [progress])

  function handleClick(index: number) {
    setActive(index)
    setProgress(0)
  }

  return (
    <section aria-labelledby="process-heading" className="bg-light-bg py-20 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          pill="Simple Process"
          heading="How It Works"
          description="Getting your car sorted is straightforward."
          headingId="process-heading"
        />

        <ol className="flex flex-col gap-3" aria-label="Process steps">
          {STEPS.map(({ number, title, description }, index) => {
            const isActive = active === index

            return (
              <li key={number}>
                <motion.div
                  className="bg-white rounded-2xl border overflow-hidden cursor-pointer"
                  animate={{ borderColor: isActive ? '#1ED760' : '#E8E8E8' }}
                  transition={{ duration: 0.25 }}
                  onClick={() => handleClick(index)}
                >
                  {/* Header row */}
                  <div className="w-full flex items-center justify-between gap-4 px-6 py-5">
                    <div className="flex items-center gap-4">
                      <motion.span
                        className="text-[13px] font-bold tracking-widest shrink-0"
                        animate={{ color: isActive ? '#1ED760' : '#aaaaaa' }}
                        transition={{ duration: 0.25 }}
                      >
                        {number}
                      </motion.span>
                      <span className="text-[17px] font-semibold text-dark">{title}</span>
                    </div>

                    <motion.span
                      className="flex items-center justify-center w-8 h-8 rounded-full border shrink-0"
                      animate={{
                        borderColor: isActive ? '#1ED760' : '#E8E8E8',
                        backgroundColor: isActive ? '#1ED760' : '#ffffff',
                      }}
                      transition={{ duration: 0.25 }}
                      aria-hidden="true"
                    >
                      <motion.svg
                        width="14" height="14" viewBox="0 0 14 14" fill="none" strokeLinecap="round"
                        animate={{ rotate: isActive ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <motion.path
                          d="M7 2v10"
                          animate={{ stroke: '#1a1a1a', opacity: isActive ? 0 : 1 }}
                          transition={{ duration: 0.2 }}
                          strokeWidth="2"
                        />
                        <path d="M2 7h10" stroke={isActive ? '#ffffff' : '#1a1a1a'} strokeWidth="2" />
                      </motion.svg>
                    </motion.span>
                  </div>

                  {/* Description — always visible when active */}
                  <motion.div
                    initial={false}
                    animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-6 pb-5 border-t border-[#F0F0F0]">
                      <p className="text-[16px] text-muted leading-relaxed pt-4 pl-[calc(13px+1rem)]">
                        {description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Progress bar */}
                  <div className="h-[3px] bg-light-bg overflow-hidden">
                    {isActive && (
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                      />
                    )}
                  </div>
                </motion.div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
