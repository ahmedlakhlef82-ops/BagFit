import { Metadata } from 'next';
import { AirlinesTable } from './components/airlines-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Manage Airlines | Admin',
};

export default function AdminAirlinesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
           <h1 className="text-3xl font-bold tracking-tight">Airlines</h1>
           <p className="text-muted-foreground mt-1">Manage airlines and their baggage policies.</p>
         </div>
         <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/airlines/import">Import CSV</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/airlines/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Airline
              </Link>
            </Button>
         </div>
      </div>

      <AirlinesTable />
    </div>
  );
}
