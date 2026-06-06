import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'secondary'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'info', children, ...props }, ref) => {
    const variants: Record<BadgeVariant, string> = {
      success: 'bg-success/20 text-success border-success/30',
      warning: 'bg-warning/20 text-warning border-warning/30',
      danger: 'bg-danger/20 text-danger border-danger/30',
      info: 'bg-primary/20 text-primary border-primary/30',
      secondary: 'bg-surface-light text-text-secondary border-border',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
