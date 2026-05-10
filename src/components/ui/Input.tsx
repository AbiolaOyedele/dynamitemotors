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
  'w-full rounded-lg border bg-white text-dark text-[17px] px-4 transition-colors placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:bg-light-bg disabled:text-muted'

const fieldNormal = 'border-border hover:border-primary'
const fieldError = 'border-error focus:ring-error focus:border-error'

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={fieldId}
        className="text-[17px] font-semibold text-dark"
      >
        {label}
        {props.required && (
          <span className="ml-1 text-error" aria-hidden="true">*</span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-[15px] text-muted">
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
        <p id={errorId} role="alert" className="text-[15px] text-error">
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
        className="text-[17px] font-semibold text-dark"
      >
        {label}
        {props.required && (
          <span className="ml-1 text-error" aria-hidden="true">*</span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-[15px] text-muted">
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
        <p id={errorId} role="alert" className="text-[15px] text-error">
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
        className="text-[17px] font-semibold text-dark"
      >
        {label}
        {props.required && (
          <span className="ml-1 text-error" aria-hidden="true">*</span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-[15px] text-muted">
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
        <p id={errorId} role="alert" className="text-[15px] text-error">
          {error}
        </p>
      )}
    </div>
  )
}
