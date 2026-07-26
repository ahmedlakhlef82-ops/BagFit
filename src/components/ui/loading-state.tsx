import * as React from 'react';
import { Spinner } from './spinner';
import { cn } from '@/lib/utils';

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

export function LoadingState({
  text = 'Loading...',
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 space-y-4',
        className
      )}
      {...props}
    >
      <Spinner size="lg" />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}
