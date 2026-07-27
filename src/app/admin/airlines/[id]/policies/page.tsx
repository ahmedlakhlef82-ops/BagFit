import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PoliciesTable } from './components/policies-table';
import { PolicyDialog } from './components/policy-dialog';

export const metadata: Metadata = {
  title: 'Manage Policies | Admin',
};

export default async function ManagePoliciesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: airline } = await supabase.from('airlines').select('*, baggage_policies(*)').eq('id', id).single();

  if (!airline) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
           <Button variant="ghost" asChild className="-ml-4 text-muted-foreground mb-4">
             <Link href="/admin/airlines">
               <ArrowLeft className="mr-2 h-4 w-4" />
               Back to Airlines
             </Link>
           </Button>
           <h1 className="text-3xl font-bold tracking-tight">Policies: {airline.name}</h1>
           <p className="text-muted-foreground mt-1">Manage baggage policies for {airline.iata_code}.</p>
         </div>
         <PolicyDialog airlineId={airline.id} />
      </div>

      <PoliciesTable airlineId={airline.id} policies={airline.baggage_policies} />
    </div>
  );
}
