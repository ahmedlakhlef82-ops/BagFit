import { Metadata } from 'next';
import Link from 'next/link';
import { UserAuthForm } from '../sign-in/components/user-auth-form';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
};

export default function SignUpPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>
      <UserAuthForm type="sign-up" />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/auth/sign-in"
          className="hover:text-primary underline underline-offset-4"
        >
          Already have an account? Sign In
        </Link>
      </p>
    </>
  );
}
