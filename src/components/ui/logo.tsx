import * as React from 'react';
import { Plane } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LogoProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  withText?: boolean;
}

export function Logo({ className, withText = true, ...props }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('flex items-center space-x-2', className)}
      {...props}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Plane className="h-5 w-5" />
      </div>
      {withText && <span className="font-bold sm:inline-block">BagFit</span>}
    </Link>
  );
}
