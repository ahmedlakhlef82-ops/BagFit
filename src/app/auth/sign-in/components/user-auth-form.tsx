'use client';

import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { signInAction, signUpAction } from '@/app/actions/auth';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'sign-in' | 'sign-up';
}

const authSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

type AuthFormData = z.infer<typeof authSchema>;

export function UserAuthForm({ className, type, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const [isGithubLoading, setIsGithubLoading] = React.useState<boolean>(false);
  const [isAppleLoading, setIsAppleLoading] = React.useState<boolean>(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  async function onSubmit(data: AuthFormData) {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      if (type === 'sign-in') {
        const result = await signInAction(formData);
        if (result?.error) {
          toast.error(result.error);
        }
      } else {
        const result = await signUpAction(formData);
        if (result?.error) {
          toast.error(result.error);
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function loginWithProvider(provider: 'google' | 'github' | 'apple') {
    if (provider === 'google') setIsGoogleLoading(true);
    if (provider === 'github') setIsGithubLoading(true);
    if (provider === 'apple') setIsAppleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(`Error logging in with ${provider}`);
      }
    } catch (err) {
      toast.error(`Error logging in with ${provider}`);
    } finally {
      // The redirect will navigate away, but in case of error:
      setIsGoogleLoading(false);
      setIsGithubLoading(false);
      setIsAppleLoading(false);
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={
                isLoading ||
                isGoogleLoading ||
                isGithubLoading ||
                isAppleLoading
              }
              {...register('email')}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              disabled={
                isLoading ||
                isGoogleLoading ||
                isGithubLoading ||
                isAppleLoading
              }
              {...register('password')}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          {type === 'sign-in' && (
            <div className="flex items-center justify-between px-1">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium hover:text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}
          <Button
            disabled={
              isLoading || isGoogleLoading || isGithubLoading || isAppleLoading
            }
          >
            {isLoading && <Spinner className="mr-2 h-4 w-4" />}
            {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          type="button"
          disabled={
            isLoading || isGoogleLoading || isGithubLoading || isAppleLoading
          }
          onClick={() => loginWithProvider('github')}
        >
          {isGithubLoading && <Spinner className="mr-2 h-4 w-4" />}
          GitHub
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={
            isLoading || isGoogleLoading || isGithubLoading || isAppleLoading
          }
          onClick={() => loginWithProvider('google')}
        >
          {isGoogleLoading && <Spinner className="mr-2 h-4 w-4" />}
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={
            isLoading || isGoogleLoading || isGithubLoading || isAppleLoading
          }
          onClick={() => loginWithProvider('apple')}
        >
          {isAppleLoading && <Spinner className="mr-2 h-4 w-4" />}
          Apple
        </Button>
      </div>
    </div>
  );
}
