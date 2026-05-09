'use client'

/** How It Works — accordion with Framer Motion animations. */

import { useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'

type Step = {
  number: string
  title: string
  description: string
}

const STEPS: Step[] = [
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
  const [openIndex, setOpenIndex] = useState<number>(0)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      ref={sectionRef}
      aria-labelledby="process-heading"
      className="bg-[#F5F5F5] py-20 md:py-24"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          pill="Simple Process"
          heading="How It Works"
          description="Getting your car sorted is straightforward."
          headingId="process-heading"
        />

        <ol className="flex flex-col gap-3" aria-label="Process steps">
          {STEPS.map(({ number, title, description }, index) => {
            const isOpen = openIndex === index

            return (
              <motion.li
                key={number}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: EASE,
                }}
              >
                <motion.div
                  className="bg-white rounded-2xl border overflow-hidden"
                  animate={{ borderColor: isOpen ? '#1ED760' : '#E8E8E8' }}
                  transition={{ duration: 0.25 }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <motion.span
                        className="text-[13px] font-bold tracking-widest shrink-0"
                        animate={{ color: isOpen ? '#1ED760' : '#aaaaaa' }}
                        transition={{ duration: 0.25 }}
                      >
                        {number}
                      </motion.span>
                      <span className="text-[17px] font-semibold text-[#1a1a1a]">
                        {title}
                      </span>
                    </div>

                    {/* Animated +/× icon */}
                    <motion.span
                      className="flex items-center justify-center w-8 h-8 rounded-full border shrink-0"
                      animate={{
                        borderColor: isOpen ? '#1ED760' : '#E8E8E8',
                        backgroundColor: isOpen ? '#1ED760' : '#ffffff',
                      }}
                      transition={{ duration: 0.25 }}
                      aria-hidden="true"
                    >
                      <motion.svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        strokeLinecap="round"
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        {/* Vertical bar — fades out when open (becomes the × via rotation) */}
                        <motion.path
                          d="M7 2v10"
                          animate={{
                            stroke: isOpen ? '#1a1a1a' : '#1a1a1a',
                            opacity: isOpen ? 0 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                          strokeWidth="2"
                        />
                        {/* Horizontal bar */}
                        <path d="M2 7h10" stroke={isOpen ? '#ffffff' : '#1a1a1a'} strokeWidth="2" />
                      </motion.svg>
                    </motion.span>
                  </button>

                  {/* Accordion content — smooth height */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="px-6 pb-5 border-t border-[#F0F0F0]">
                          <p className="text-[16px] text-[#555555] leading-relaxed pt-4 pl-[calc(13px+1rem)]">
                            {description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.li>
            )
          })}
        </ol>

      </div>
    </section>
  )
}
