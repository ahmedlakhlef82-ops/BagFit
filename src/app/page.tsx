import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plane } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to BagFit
        </h1>
        <p className="text-xl text-muted-foreground">
          Your ultimate airline baggage allowance platform. Manage your luggage
          dimensions, check airline rules, and travel without surprises.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Check Allowances
            </CardTitle>
            <CardDescription>
              Find baggage rules for over 100+ airlines worldwide.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/airlines">Search Airlines</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Measure Luggage</CardTitle>
            <CardDescription>
              Input your bag dimensions to see if it fits as a carry-on or
              checked bag.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/measure">Measure Now</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>
              Save your frequent airlines and luggage dimensions for quick
              access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
