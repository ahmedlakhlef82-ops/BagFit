import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <EmptyState
        title="Page Not Found"
        description="The page you are looking for does not exist or has been moved."
        icon={<FileQuestion className="h-10 w-10 text-muted-foreground" />}
        action={
          <Button>
            <Link href="/">Return Home</Link>
          </Button>
        }
      />
    </div>
  );
}
