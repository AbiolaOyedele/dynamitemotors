import { cn } from '@/utils/cn'
import { ArrowRight } from 'lucide-react'

/**
 * FlowButton design system — expanding-circle hover animation
 * applied consistently across all button and link components.
 *
 * Variants:
 *  primary  – transparent bg, subtle border → dark circle fills on hover (the classic FlowButton)
 *  filled   – dark bg → lighter circle ripple on hover
 *  green    – accent bg → dark circle fills on hover
 *  outline  – bold border → dark circle fills on hover
 *  ghost    – minimal, no circle animation
 */

type Variant = 'primary' | 'filled' | 'green' | 'outline' | 'ghost'
type Size = 'md' | 'lg'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  showArrow?: boolean
}

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  variant?: Variant
  size?: Size
  showArrow?: boolean
}

type AnimatedButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  label: string
}

// ── Shared base ──────────────────────────────────────────────────────────────
// NOTE: no hover:rounded here — only inline CTA variants morph their radius.

const FLOW_BASE =
  'group/btn relative inline-flex items-center justify-center overflow-hidden ' +
  'rounded-[100px] font-semibold leading-none cursor-pointer select-none ' +
  'transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ' +
  'hover:rounded-[12px] active:scale-[0.95] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50'

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    'border-[1.5px] border-body/40 bg-transparent text-dark ' +
    'hover:border-transparent hover:text-white',
  filled:
    'border-[1.5px] border-dark bg-dark text-white ' +
    'hover:border-transparent',
  green:
    'border-[1.5px] border-primary bg-primary text-dark ' +
    'hover:border-transparent hover:text-white',
  outline:
    'border-2 border-dark bg-transparent text-dark ' +
    'hover:border-transparent hover:text-white',
  ghost:
    'border border-transparent bg-transparent text-dark ' +
    'hover:bg-light-bg active:bg-border',
}

/** Background color of the expanding circle per variant */
const CIRCLE_COLORS: Record<Variant, string> = {
  primary: 'bg-dark',
  filled:  'bg-white/15',
  green:   'bg-dark',
  outline: 'bg-dark',
  ghost:   '',
}

const SIZES: Record<Size, string> = {
  md: 'h-[52px] px-8 text-[16px]',
  lg: 'h-[60px] px-9 text-[17px]',
}

// ── Expanding circle ─────────────────────────────────────────────────────────
// Uses scale transform instead of fixed pixel dimensions so the circle
// covers any button width — from a compact header CTA to a full-width form submit.

function ExpandingCircle({ variant }: { variant: Variant }) {
  if (variant === 'ghost') return null

  return (
    <span
      aria-hidden="true"
      className={cn(
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'w-5 h-5 rounded-[50%] scale-0 opacity-0',
        'group-hover/btn:scale-[40] group-hover/btn:opacity-100',
        'transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]',
        CIRCLE_COLORS[variant],
      )}
    />
  )
}

// ── Arrow pair (slide-in left, slide-out right) ──────────────────────────────

function FlowArrows() {
  return (
    <>
      {/* Left arrow — hidden off-screen, slides in on hover */}
      <ArrowRight
        aria-hidden="true"
        className={cn(
          'absolute w-4 h-4 left-[-25%] stroke-current fill-none z-[9]',
          'group-hover/btn:left-4',
          'transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]',
        )}
      />
      {/* Right arrow — visible at rest, slides out on hover */}
      <ArrowRight
        aria-hidden="true"
        className={cn(
          'absolute w-4 h-4 right-4 stroke-current fill-none z-[9]',
          'group-hover/btn:right-[-25%]',
          'transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]',
        )}
      />
    </>
  )
}

// ── Button (form element) ────────────────────────────────────────────────────
// Default variant = "filled" — solid dark button for form actions.
// Use showArrow to opt-in to the sliding arrow animation.

export function Button({
  variant = 'filled',
  size = 'md',
  showArrow = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(FLOW_BASE, VARIANT_STYLES[variant], SIZES[size], className)}
      {...props}
    >
      <ExpandingCircle variant={variant} />
      {showArrow && <FlowArrows />}

      <span
        className={cn(
          'relative z-[1] tracking-[0.2px]',
          'transition-all duration-[800ms] ease-out',
          showArrow && '-translate-x-3 group-hover/btn:translate-x-3',
        )}
      >
        {children}
      </span>
    </button>
  )
}

// ── ButtonLink (anchor) ──────────────────────────────────────────────────────
// Default variant = "primary" — the classic FlowButton look for CTA links.
// Arrows are on by default for links.

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  showArrow = true,
  className,
  children,
  ...props
}: AnchorProps) {
  return (
    <a
      className={cn(FLOW_BASE, VARIANT_STYLES[variant], SIZES[size], className)}
      {...props}
    >
      <ExpandingCircle variant={variant} />
      {showArrow && <FlowArrows />}

      <span
        className={cn(
          'relative z-[1] tracking-[0.2px]',
          'transition-all duration-[800ms] ease-out',
          showArrow && '-translate-x-3 group-hover/btn:translate-x-3',
        )}
      >
        {children}
      </span>
    </a>
  )
}

// ── AnimatedButtonLink (header CTA) ──────────────────────────────────────────
// Compact FlowButton for the header navigation bar.

export function AnimatedButtonLink({
  href,
  label,
  className,
  ...props
}: AnimatedButtonLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        FLOW_BASE,
        'h-[44px] px-7 text-[13px] font-bold tracking-widest uppercase',
        'border-[1.5px] border-body/40 bg-transparent text-dark',
        'hover:border-transparent hover:text-white hover:rounded-[12px]',
        className,
      )}
      {...props}
    >
      <ExpandingCircle variant="primary" />
      <FlowArrows />

      <span className="relative z-[1] -translate-x-3 group-hover/btn:translate-x-3 transition-all duration-[800ms] ease-out whitespace-nowrap">
        {label}
      </span>
    </a>
  )
}
