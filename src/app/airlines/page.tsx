import { Metadata } from 'next';
import { AirlineSearch } from './components/airline-search';

export const metadata: Metadata = {
  title: 'Airlines',
  description: 'Search and view baggage policies for 500+ airlines worldwide.',
};

export default function AirlinesPage() {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Airline Baggage Policies
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Search for an airline by name or IATA code to view their cabin and
          checked baggage dimensions.
        </p>
      </div>

      <AirlineSearch />
    </div>
  );
}
