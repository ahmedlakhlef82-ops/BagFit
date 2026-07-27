import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ImportForm } from './components/import-form';

export const metadata: Metadata = {
  title: 'Import Airlines | Admin',
};

export default function ImportAirlinesPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" asChild className="-ml-4 text-muted-foreground">
        <Link href="/admin/airlines">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Airlines
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Airlines</h1>
        <p className="text-muted-foreground mt-1">
          Upload a CSV file to bulk import airlines into the database. Ensure your CSV has headers exactly matching: <code>name, iata_code, icao_code, country, website</code>.
        </p>
      </div>

      <ImportForm />
    </div>
  );
}
