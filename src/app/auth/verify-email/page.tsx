import { Metadata } from 'next';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify your email address',
};

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <MailCheck className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Check your email
      </h1>
      <p className="text-sm text-muted-foreground">
        We've sent a verification link to your email address. Please verify your
        email to continue.
      </p>
      <div className="pt-4">
        <Button variant="outline">
          <Link href="/auth/sign-in">Return to Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
