import { Metadata } from 'next';
import Link from 'next/link';
import { ResetPasswordForm } from './components/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your account',
};

export default function ResetPasswordPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below.
        </p>
      </div>
      <ResetPasswordForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/auth/sign-in"
          className="hover:text-primary underline underline-offset-4"
        >
          Back to Sign In
        </Link>
      </p>
    </>
  );
}
