'use client'

import { useEffect, useRef, useState } from 'react'

const STATS = [
  { end: 30, suffix: '+', label: 'Years Experience' },
  { end: 5,  suffix: '★', label: 'Google Rating'    },
  { end: 200, suffix: '+', label: 'Cars Serviced'   },
] as const

function CountUp({ end, suffix, duration = 1800 }: { end: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * end))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

export function StatsBar() {
  return (
    <section aria-label="Our credentials" className="bg-white border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <dl className="grid grid-cols-1 sm:grid-cols-3">
          {STATS.map(({ end, suffix, label }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center py-10 sm:py-0 sm:px-12 text-center ${
                i > 0 ? 'border-t sm:border-t-0 sm:border-l border-[#E8E8E8]' : ''
              }`}
            >
              <dt className="text-[64px] md:text-[80px] font-bold text-[#1a1a1a] leading-none tracking-tight">
                <CountUp end={end} suffix={suffix} />
              </dt>
              <dd className="text-[16px] text-[#666666] mt-3">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
