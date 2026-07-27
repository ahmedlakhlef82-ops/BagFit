import { ReactNode } from 'react';
import { getSession } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plane, Settings, Users, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/auth/sign-in');
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-[80vh]">
      <aside className="w-64 border-r bg-muted/20 hidden md:block">
        <div className="h-full py-6 flex flex-col gap-4">
          <nav className="grid gap-2 px-4">
            <h2 className="text-lg font-semibold tracking-tight mb-2">Admin CMS</h2>
            <Button variant="ghost" className="justify-start w-full" asChild>
              <Link href="/admin">
                <Settings className="mr-2 h-4 w-4" />
                Overview
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start w-full" asChild>
              <Link href="/admin/airlines">
                <Plane className="mr-2 h-4 w-4" />
                Airlines
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start w-full" asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start w-full" asChild>
              <Link href="/admin/airlines/import">
                <Database className="mr-2 h-4 w-4" />
                Import Data
              </Link>
            </Button>
          </nav>
        </div>
      </aside>
      <main className="flex-1 container py-6">
         {children}
      </main>
    </div>
  );
}
