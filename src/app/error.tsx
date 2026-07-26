'use client';

import * as React from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <EmptyState
        title="Something went wrong!"
        description="An unexpected error occurred. Please try again later."
        icon={<AlertCircle className="h-10 w-10 text-destructive" />}
        action={
          <Button onClick={reset} variant="default">
            Try again
          </Button>
        }
      />
    </div>
  );
}
