import { ReactNode } from 'react';
import { getSession } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/auth/sign-in');
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="container py-6">{children}</div>
    </div>
  );
}
