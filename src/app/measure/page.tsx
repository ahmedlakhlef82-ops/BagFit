import { Metadata } from 'next';
import { BagFitCheckerForm } from './components/bagfit-checker-form';

export const metadata: Metadata = {
  title: 'Measure Your Bag',
  description:
    'Check if your luggage fits the airline baggage allowance policies.',
};

export default function MeasurePage() {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">BagFit Checker</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Select your airline and input your bag's dimensions to see if it will
          be accepted as a carry-on or personal item.
        </p>
      </div>

      <BagFitCheckerForm />
    </div>
  );
}
