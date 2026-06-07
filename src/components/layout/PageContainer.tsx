import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export default function PageContainer({
  children,
  className,
  animate = true,
}: PageContainerProps) {
  return (
    <main className={cn(
      'ml-64 pt-16 min-h-screen bg-background',
      className
    )}>
      <div className={cn(
        'p-6',
        animate && 'animate-fade-in'
      )}>
        {children}
      </div>
    </main>
  );
}
