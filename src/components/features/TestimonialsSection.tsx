import { SectionHeader } from '@/components/ui/SectionHeader'
import type { Testimonial } from '@/types/testimonial.types'

type Props = {
  testimonials: Testimonial[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? '#f59e0b' : 'none'}
          stroke={i < rating ? '#f59e0b' : 'rgba(255,255,255,0.2)'}
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z"
          />
        </svg>
      ))}
    </div>
  )
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    _id: 't1',
    customerName: 'de artz',
    review:
      'They did my auxiliary timing belt and serviced my car, along with changing the tires and ever since then, my car has been running perfectly. I had been dealing with frustrating battery drainage issues for a long time, but they managed to sort it out.',
    rating: 5,
    vehicleType: null,
  },
  {
    _id: 't2',
    customerName: 'Conall Morganl',
    review:
      'Went in and got checked and fixed quickly!',
    rating: 5,
    vehicleType: null,
  },
  {
    _id: 't3',
    customerName: 'Taiwo Pereira',
    review:
      'Quick and very professional service, various options provided to me also. Would highly recommend.',
    rating: 5,
    vehicleType: null,
  },
  {
    _id: 't4',
    customerName: 'Daniel Ajanaku',
    review:
      'Very consistent and reliable service. I was beyond impressed with the work and attention to detail on my car repair.',
    rating: 5,
    vehicleType: null,
  },
  {
    _id: 't5',
    customerName: 'Ifeoluwa Adeyemi',
    review:
      "I've been using them for the past 8 years, and they always provide excellent service. Very friendly, helpful and experienced mechanics!",
    rating: 5,
    vehicleType: null,
  },
]

export function TestimonialsSection({ testimonials }: Props) {
  const items = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS
  const duplicated = [...items, ...items]

  return (
    <section aria-labelledby="testimonials-heading" className="bg-dark py-20 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          pill="Customer Reviews"
          heading="What Our Customers Say"
          description="Don't just take our word for it — here's what local drivers think."
          headingId="testimonials-heading"
          theme="dark"
        />
      </div>

      <div
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
        className="overflow-hidden px-[10%]"
      >
        <div className="flex w-max gap-6 animate-x-slider hover:[animation-play-state:paused] motion-reduce:animate-none">
          {duplicated.map((t, i) => (
            <article
              key={`${t._id}-${i}`}
              className="shrink-0 w-[340px] sm:w-[420px] md:w-[500px] bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/10 flex flex-col"
            >
              <div className="flex-1 px-6 pt-6 pb-5 flex flex-col gap-4">
                <StarRating rating={t.rating} />
                <blockquote>
                  <p className="text-[16px] md:text-[17px] text-white/75 leading-relaxed font-light tracking-tight">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </blockquote>
              </div>

              <footer className="border-t border-white/10 px-6 py-4 flex items-center gap-3">
                <div
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-dark font-bold text-[15px] shrink-0"
                  aria-hidden="true"
                >
                  {t.customerName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <cite className="not-italic text-[15px] font-semibold text-white block">
                    {t.customerName}
                  </cite>
                  {t.vehicleType && (
                    <p className="text-[13px] text-white/40 truncate">{t.vehicleType}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-[12px] text-white/50 font-medium">Google</span>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
