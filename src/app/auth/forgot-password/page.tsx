import { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from './components/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your password',
};

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>
      <ForgotPasswordForm />
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
