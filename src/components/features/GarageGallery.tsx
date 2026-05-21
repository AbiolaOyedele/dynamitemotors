'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { GalleryImage } from '@/services/content.service'

const DEFAULT_IMAGES: GalleryImage[] = [
  { src: '/gallery/garage-bay.jpg',        alt: 'Mechanic working under a car on the lift' },
  { src: '/gallery/aircon-regas.jpg',      alt: 'Air conditioning regas with Kheos CTR machine' },
  { src: '/gallery/tyre-rack.jpg',         alt: 'Tyre stock rack' },
  { src: '/gallery/garage-interior.jpg',   alt: 'Garage interior with cars being serviced' },
  { src: '/gallery/building-exterior.jpg', alt: 'Dynamite Motors building exterior' },
]

const EASE = [0.25, 0.1, 0.25, 1] as const

type Props = {
  images?: GalleryImage[]
}

export function GarageGallery({ images }: Props) {
  const displayImages = images ?? DEFAULT_IMAGES
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const closeImage = useCallback(() => setSelectedIndex(null), [])

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % displayImages.length : null,
    )
  }, [displayImages.length])

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + displayImages.length) % displayImages.length : null,
    )
  }, [displayImages.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (selectedIndex === null) return
      if (e.key === 'Escape') closeImage()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'ArrowLeft') goToPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedIndex, closeImage, goToNext, goToPrev])

  function getFlexValue(index: number) {
    if (hoveredIndex === null) return 1
    return hoveredIndex === index ? 2.5 : 0.5
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          heading="See Our Garage"
          description="The tools, the bays, and the work we do every day. Take a look inside."
          theme="light"
        />

        {/* Mobile: 2-col grid */}
        <div className="grid grid-cols-2 gap-2 md:hidden">
          {displayImages.map((image, index) => (
            <div
              key={image.src}
              className="relative h-44 rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-dark/20" />
            </div>
          ))}
        </div>

        {/* Desktop: expandable horizontal strip */}
        <div className="hidden md:flex gap-2 h-[460px] w-full">
          {displayImages.map((image, index) => (
            <motion.div
              key={image.src}
              className="relative cursor-pointer overflow-hidden rounded-xl"
              style={{ flex: 1 }}
              animate={{ flex: getFlexValue(index) }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="25vw"
                className="object-cover"
              />
              <motion.div
                className="absolute inset-0 bg-dark"
                animate={{ opacity: hoveredIndex === index ? 0 : 0.3 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark/95 p-4"
            onClick={closeImage}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={closeImage}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); goToPrev() }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              className="relative w-full max-w-5xl"
              style={{ height: '80vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  className="relative w-full h-full"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={displayImages[selectedIndex].src}
                    alt={displayImages[selectedIndex].alt}
                    fill
                    sizes="90vw"
                    className="object-contain rounded-xl"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); goToNext() }}
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-[13px] font-medium bg-white/10 px-4 py-1.5 rounded-full">
              {selectedIndex + 1} / {displayImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
