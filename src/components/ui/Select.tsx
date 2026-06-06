import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, placeholder, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-10 px-3 pr-10 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 appearance-none cursor-pointer',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-surface text-text-primary"
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
        </div>
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }
