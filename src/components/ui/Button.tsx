import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-glow hover:shadow-glow-lg',
      secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-light focus:ring-surface-light',
      danger: 'bg-danger text-white hover:bg-danger/90 focus:ring-danger',
      ghost: 'bg-transparent text-text-primary hover:bg-surface-light focus:ring-surface-light',
    }

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-8 px-3 text-sm gap-1.5',
      md: 'h-10 px-4 text-base gap-2',
      lg: 'h-12 px-6 text-lg gap-2',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
