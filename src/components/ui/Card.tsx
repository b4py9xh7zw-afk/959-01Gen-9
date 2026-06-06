import { HTMLAttributes, forwardRef, KeyboardEvent, MouseEvent } from 'react'
import { cn } from '../../utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  clickable?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, clickable = false, onClick, children, ...props }, ref) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (clickable && e.key === 'Enter' && onClick) {
        onClick(e as unknown as MouseEvent<HTMLDivElement>);
      }
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'bg-surface rounded-xl border border-border shadow-card',
          hoverable && 'hover:shadow-card-hover hover:border-primary/50 transition-all duration-300 hover:-translate-y-0.5',
          clickable && 'cursor-pointer',
          className
        )}
        onClick={clickable ? onClick : undefined}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 border-b border-border', className)} {...props}>
      {children}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-xl font-semibold text-text-primary', className)} {...props}>
      {children}
    </h3>
  )
)

CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-text-secondary mt-1', className)} {...props}>
      {children}
    </p>
  )
)

CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props}>
      {children}
    </div>
  )
)

CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 border-t border-border flex items-center', className)} {...props}>
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
