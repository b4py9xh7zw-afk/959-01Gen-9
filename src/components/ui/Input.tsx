import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '../../utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  prefixIcon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, prefixIcon, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefixIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {prefixIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-10 px-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200',
              prefixIcon && 'pl-10',
              error && 'border-danger focus:ring-danger focus:border-danger',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-danger">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
