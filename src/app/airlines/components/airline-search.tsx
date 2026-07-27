'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAirlines } from '@/lib/services/airline-service';
import { SearchInput } from '@/components/ui/search-input';
import { useDebounce } from '@/hooks/use-debounce';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { Globe, Plane } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export function AirlineSearch() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: airlines, isLoading } = useQuery({
    queryKey: ['airlines', debouncedSearch],
    queryFn: () => getAirlines(debouncedSearch),
  });

  return (
    <div className="space-y-6">
      <div className="max-w-xl">
        <SearchInput
          placeholder="Search by airline name or IATA code (e.g., Delta or DL)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 text-lg"
        />
      </div>

      {isLoading && (
        <div className="py-12 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {!isLoading && airlines?.length === 0 && (
        <EmptyState
          title="No airlines found"
          description="We couldn't find any airlines matching your search. Please try a different name or IATA code."
        />
      )}

      {!isLoading && airlines && airlines.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {airlines.map((airline) => (
            <Link
              key={airline.id}
              href={`/airlines/${airline.iata_code.toLowerCase()}`}
            >
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {airline.name}
                    </CardTitle>
                    <Badge variant="secondary" className="font-mono">
                      {airline.iata_code}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center mt-2 text-xs">
                    <Globe className="h-3 w-3 mr-1" /> {airline.country}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Plane className="h-4 w-4 mr-2" />
                    {airline.policies?.length || 0} baggage policies
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
