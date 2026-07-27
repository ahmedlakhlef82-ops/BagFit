import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAirlineByIata } from '@/lib/services/airline-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, ArrowLeft, Briefcase, Ruler, Weight } from 'lucide-react';
import Link from 'next/link';

interface AirlinePageProps {
  params: Promise<{
    iata: string;
  }>;
}

export async function generateMetadata({
  params,
}: AirlinePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const iata = resolvedParams.iata.toUpperCase();
  const airline = await getAirlineByIata(iata);

  if (!airline) {
    return {
      title: 'Airline Not Found',
    };
  }

  return {
    title: `${airline.name} Baggage Policy`,
    description: `View ${airline.name} (${airline.iata_code}) cabin and checked baggage allowance and dimensions.`,
  };
}

export default async function AirlinePage({ params }: AirlinePageProps) {
  const resolvedParams = await params;
  const iata = resolvedParams.iata.toUpperCase();
  const airline = await getAirlineByIata(iata);

  if (!airline) {
    notFound();
  }

  const personalItems =
    airline.policies?.filter((p) => p.type === 'personal') || [];
  const cabinBags = airline.policies?.filter((p) => p.type === 'cabin') || [];
  const checkedBags =
    airline.policies?.filter((p) => p.type === 'checked') || [];

  const PolicyCard = ({
    title,
    policies,
  }: {
    title: string;
    policies: any[];
  }) => {
    if (policies.length === 0) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Briefcase className="mr-2 h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {policies.map((policy) => (
            <div key={policy.id} className="rounded-lg border p-4 bg-muted/30">
              <h4 className="font-semibold mb-3">{policy.name}</h4>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Ruler className="h-4 w-4 mr-2" />
                  <span className="font-medium text-foreground mr-1">
                    Max Size:
                  </span>
                  {policy.max_length} x {policy.max_width} x {policy.max_height}{' '}
                  {policy.size_unit}
                </div>
                {policy.max_weight > 0 && (
                  <div className="flex items-center text-muted-foreground">
                    <Weight className="h-4 w-4 mr-2" />
                    <span className="font-medium text-foreground mr-1">
                      Max Weight:
                    </span>
                    {policy.max_weight} {policy.weight_unit}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container py-8 space-y-8 max-w-4xl">
      <Button variant="ghost" className="-ml-4 text-muted-foreground">
        <Link href="/airlines">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all airlines
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">{airline.name}</h1>
            <Badge variant="secondary" className="text-lg px-2">
              {airline.iata_code}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center">
              <Globe className="mr-1 h-4 w-4" />
              {airline.country}
            </span>
            {airline.icao_code && <span>ICAO: {airline.icao_code}</span>}
          </div>
        </div>

        {airline.website && (
          <Button variant="outline">
            <a href={airline.website} target="_blank" rel="noopener noreferrer">
              Visit Official Website
            </a>
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Baggage Allowances</h2>

        {airline.policies && airline.policies.length === 0 && (
          <p className="text-muted-foreground">
            No specific baggage policies found for this airline.
          </p>
        )}

        <PolicyCard title="Personal Items" policies={personalItems} />
        <PolicyCard title="Cabin / Carry-on Bags" policies={cabinBags} />
        <PolicyCard title="Checked Baggage" policies={checkedBags} />

        <div className="mt-8 flex justify-center">
          <Button size="lg">
            <Link href={`/measure?airline=${airline.id}`}>
              Measure your bag for {airline.name}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
