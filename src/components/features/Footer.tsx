'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { BUSINESS } from '@/config/constants'

const EASE = [0.25, 0.1, 0.25, 1] as const

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <footer className="bg-dark text-white">
      <div className="px-9 md:px-[10%] py-14">
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >

          {/* Brand */}
          <motion.div variants={itemVariants} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt={BUSINESS.name} width={52} height={52} className="object-contain rounded-full shrink-0" />
              <p className="text-primary text-[22px] font-bold tracking-tight leading-none">
                {BUSINESS.name.toUpperCase()}
              </p>
            </div>
            <p className="text-white/55 text-[16px] leading-relaxed">
              {BUSINESS.tagline}
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 md:items-center md:text-center">
            <h3 className="text-[17px] font-semibold text-white">Contact Us</h3>
            <address className="not-italic flex flex-col gap-3 md:items-center">
              <p className="text-white/55 text-[16px] leading-relaxed">
                {BUSINESS.address}
              </p>
              <a
                href={BUSINESS.phoneTel}
                className="text-[16px] text-white/75 hover:text-primary transition-colors font-medium"
              >
                {BUSINESS.phone}
              </a>
              <a
                href={BUSINESS.emailHref}
                className="text-[16px] text-white/75 hover:text-primary transition-colors font-medium break-all"
              >
                {BUSINESS.email}
              </a>
              <a
                href={BUSINESS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[16px] text-primary hover:text-white transition-colors font-medium"
              >
                Find Us on Maps ↗
              </a>
            </address>
          </motion.div>

          {/* Opening Hours */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 md:items-end">
            <h3 className="text-[17px] font-semibold text-white">Opening Hours</h3>
            <ul className="flex flex-col gap-2">
              <li className="flex justify-end gap-4 text-[15px]">
                <span className="text-white/55">Mon – Fri</span>
                <span className="text-white/75 font-medium w-20 text-right">9am – 6pm</span>
              </li>
              <li className="flex justify-end gap-4 text-[15px]">
                <span className="text-white/55">Saturday</span>
                <span className="text-white/75 font-medium w-20 text-right">9am – 3pm</span>
              </li>
              <li className="flex justify-end gap-4 text-[15px]">
                <span className="text-white/55">Sunday</span>
                <span className="text-white/75 font-medium w-20 text-right">Closed</span>
              </li>
            </ul>
          </motion.div>

        </motion.div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <p className="text-white/40 text-[14px] text-center">
            © 2026 {BUSINESS.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
