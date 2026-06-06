import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { CSSProperties } from 'react';
import { cn } from '../../utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  style?: CSSProperties;
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  gradientFrom = 'from-primary',
  gradientTo = 'to-primary-hover',
  className,
  style,
}: StatCardProps) {
  const isPositive = change && change >= 0;

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl p-6 bg-surface border border-border shadow-card hover:shadow-card-hover transition-all duration-300 group',
      className
    )} style={style}>
      <div className={cn(
        'absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 bg-gradient-to-br',
        gradientFrom,
        gradientTo,
        'blur-2xl group-hover:opacity-30 transition-opacity duration-300'
      )} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-muted mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-text-primary mb-2">
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger" />
              )}
              <span className={cn(
                'text-sm font-medium',
                isPositive ? 'text-success' : 'text-danger'
              )}>
                {isPositive ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-text-muted">
                较上月
              </span>
            </div>
          )}
        </div>
        
        <div className={cn(
          'p-3 rounded-xl bg-gradient-to-br',
          gradientFrom,
          gradientTo,
          'shadow-glow'
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
