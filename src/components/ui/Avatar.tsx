import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils'
import { User } from 'lucide-react'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  name?: string
  size?: AvatarSize
  alt?: string
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, name, size = 'md', alt, ...props }, ref) => {
    const sizes: Record<AvatarSize, string> = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-14 w-14 text-lg',
    }

    const getInitials = (name: string): string => {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    const iconSizes: Record<AvatarSize, string> = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-7 w-7',
    }

    const renderFallback = () => {
      if (name) {
        return <span className="font-medium text-white">{getInitials(name)}</span>
      }
      return <User className={cn(iconSizes[size], 'text-text-muted')} />
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-surface-light overflow-hidden border border-border',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'avatar'}
            className="h-full w-full object-cover"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : null}
        {!src && renderFallback()}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export { Avatar }
