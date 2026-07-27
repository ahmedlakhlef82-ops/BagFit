import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AirlineDetailsLoading() {
  return (
    <div className="container py-8 space-y-8 max-w-4xl animate-in fade-in-50 duration-500">
      <Skeleton className="h-9 w-40" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />

        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4 bg-muted/30">
                <Skeleton className="h-5 w-40 mb-3" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Skeleton className="h-5 w-full max-w-[200px]" />
                  <Skeleton className="h-5 w-full max-w-[150px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="mt-8 flex justify-center">
          <Skeleton className="h-12 w-64" />
        </div>
      </div>
    </div>
  );
}
