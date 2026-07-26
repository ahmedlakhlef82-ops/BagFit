import { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Authentication Error',
  description: 'There was an error authenticating your account.',
};

export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Authentication Error
      </h1>
      <p className="text-sm text-muted-foreground">
        We could not complete your authentication request. The link might have
        expired or is invalid.
      </p>
      <div className="pt-4">
        <Button variant="outline">
          <Link href="/auth/sign-in">Return to Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
