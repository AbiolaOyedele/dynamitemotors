import { cn } from '@/utils/cn'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string
  hint?: string
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

const fieldBase =
  'w-full rounded-lg border bg-white text-[#1a1a1a] text-[17px] px-4 transition-colors placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#1ED760] focus:border-[#1ED760] disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:text-[#666666]'

const fieldNormal = 'border-[#E8E8E8] hover:border-[#1ED760]'
const fieldError = 'border-[#FF4444] focus:ring-[#FF4444] focus:border-[#FF4444]'

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={fieldId}
        className="text-[17px] font-semibold text-[#1a1a1a]"
      >
        {label}
        {props.required && (
          <span className="ml-1 text-[#FF4444]" aria-hidden="true">*</span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-[15px] text-[#666666]">
          {hint}
        </p>
      )}

      <input
        id={fieldId}
        className={cn(
          fieldBase,
          'h-[52px]',
          error ? fieldError : fieldNormal,
          className,
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={
          [error ? errorId : null, hint ? hintId : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        {...props}
      />

      {error && (
        <p id={errorId} role="alert" className="text-[15px] text-[#FF4444]">
          {error}
        </p>
      )}
    </div>
  )
}

export function Textarea({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: TextareaProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={fieldId}
        className="text-[17px] font-semibold text-[#1a1a1a]"
      >
        {label}
        {props.required && (
          <span className="ml-1 text-[#FF4444]" aria-hidden="true">*</span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-[15px] text-[#666666]">
          {hint}
        </p>
      )}

      <textarea
        id={fieldId}
        className={cn(
          fieldBase,
          'py-3 min-h-[120px] resize-y',
          error ? fieldError : fieldNormal,
          className,
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={
          [error ? errorId : null, hint ? hintId : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        {...props}
      />

      {error && (
        <p id={errorId} role="alert" className="text-[15px] text-[#FF4444]">
          {error}
        </p>
      )}
    </div>
  )
}

export function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={fieldId}
        className="text-[17px] font-semibold text-[#1a1a1a]"
      >
        {label}
        {props.required && (
          <span className="ml-1 text-[#FF4444]" aria-hidden="true">*</span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-[15px] text-[#666666]">
          {hint}
        </p>
      )}

      <select
        id={fieldId}
        className={cn(
          fieldBase,
          'h-[52px] appearance-none cursor-pointer',
          error ? fieldError : fieldNormal,
          className,
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={
          [error ? errorId : null, hint ? hintId : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={errorId} role="alert" className="text-[15px] text-[#FF4444]">
          {error}
        </p>
      )}
    </div>
  )
}
