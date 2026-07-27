import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/search-input';

export default function AirlinesLoading() {
  return (
    <div className="container py-8 space-y-8 animate-in fade-in-50 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Airline Baggage Policies
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Search for an airline by name or IATA code to view their cabin and
          checked baggage dimensions.
        </p>
      </div>

      <div className="space-y-6">
        <div className="max-w-xl">
          <SearchInput
            placeholder="Search by airline name or IATA code (e.g., Delta or DL)..."
            disabled
            className="h-12 text-lg"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <Skeleton className="h-4 w-24 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
