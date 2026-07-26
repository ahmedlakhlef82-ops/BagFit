import { Metadata } from 'next';
import Link from 'next/link';
import { UserAuthForm } from './components/user-auth-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

export default function SignInPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to log into your account
        </p>
      </div>
      <UserAuthForm type="sign-in" />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/auth/sign-up"
          className="hover:text-primary underline underline-offset-4"
        >
          Don't have an account? Sign Up
        </Link>
      </p>
    </>
  );
}
