'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const rafId = requestAnimationFrame(raf)

    // Stop Lenis when modals lock body scroll, restart when they close
    const observer = new MutationObserver(() => {
      if (document.body.style.overflow === 'hidden') {
        lenis.stop()
      } else {
        lenis.start()
      }
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
