'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAirlines } from '@/lib/services/airline-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { checkBagFit, BagDimensions, CheckResult } from '@/lib/bagfit-checker';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

const bagSchema = z.object({
  airlineId: z.string().min(1, 'Please select an airline'),
  length: z
    .any()
    .transform(Number)
    .refine((n) => n >= 0.1, { message: 'Must be greater than 0' }),
  width: z
    .any()
    .transform(Number)
    .refine((n) => n >= 0.1, { message: 'Must be greater than 0' }),
  height: z
    .any()
    .transform(Number)
    .refine((n) => n >= 0.1, { message: 'Must be greater than 0' }),
  weight: z
    .any()
    .transform(Number)
    .refine((n) => n >= 0, { message: 'Must be a positive number' }),
  sizeUnit: z.enum(['cm', 'in']),
  weightUnit: z.enum(['kg', 'lb']),
});

type BagFormData = z.infer<typeof bagSchema>;

function BagFitCheckerFormInner() {
  const searchParams = useSearchParams();
  const preselectedAirline = searchParams.get('airline');
  const [results, setResults] = React.useState<CheckResult[] | null>(null);

  const { data: airlines, isLoading: isLoadingAirlines } = useQuery({
    queryKey: ['airlines-all'],
    queryFn: () => getAirlines(),
  });

  const form = useForm<z.input<typeof bagSchema>>({
    resolver: zodResolver(bagSchema),
    defaultValues: {
      airlineId: preselectedAirline || '',
      length: '0',
      width: '0',
      height: '0',
      weight: '0',
      sizeUnit: 'cm',
      weightUnit: 'kg',
    },
  });

  React.useEffect(() => {
    if (
      preselectedAirline &&
      airlines?.find((a) => a.id === preselectedAirline)
    ) {
      form.setValue('airlineId', preselectedAirline);
    }
  }, [preselectedAirline, airlines, form]);

  const watchAirlineId = form.watch('airlineId');
  const selectedAirline = airlines?.find((a) => a.id === watchAirlineId);

  function onSubmit(data: Record<string, any>) {
    const parsedData = data as BagFormData;
    if (!selectedAirline || !selectedAirline.policies) return;

    const bagDimensions: BagDimensions = {
      length: parsedData.length,
      width: parsedData.width,
      height: parsedData.height,
      weight: parsedData.weight,
      sizeUnit: parsedData.sizeUnit,
      weightUnit: parsedData.weightUnit,
    };

    const newResults = selectedAirline.policies.map((policy) =>
      checkBagFit(bagDimensions, policy)
    );

    setResults(newResults);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Bag Dimensions</CardTitle>
            <CardDescription>
              Enter your bag's dimensions and weight to check if it fits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="airlineId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Airline</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/50 hover:border-primary/50">
                            <SelectValue
                              placeholder={
                                isLoadingAirlines
                                  ? 'Loading airlines...'
                                  : 'Select an airline'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {airlines?.map((airline) => (
                            <SelectItem key={airline.id} value={airline.id}>
                              {airline.name} ({airline.iata_code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sizeUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/50 hover:border-primary/50">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cm">Centimeters (cm)</SelectItem>
                            <SelectItem value="in">Inches (in)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weightUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/50 hover:border-primary/50">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="kg">Kilograms (kg)</SelectItem>
                            <SelectItem value="lb">Pounds (lb)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            className="transition-all focus:ring-2 focus:ring-primary/50 hover:border-primary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            className="transition-all focus:ring-2 focus:ring-primary/50 hover:border-primary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            className="transition-all focus:ring-2 focus:ring-primary/50 hover:border-primary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          className="transition-all focus:ring-2 focus:ring-primary/50 hover:border-primary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full transition-transform active:scale-[0.98]"
                  disabled={!watchAirlineId}
                >
                  Check BagFit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      <div className="space-y-6" aria-live="polite">
        <h3 className="text-xl font-bold">Results</h3>
        <AnimatePresence mode="wait">
          {!results && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground bg-muted/50"
            >
              Enter dimensions and check to see results here.
            </motion.div>
          )}

          {results && results.length === 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground bg-muted/50"
            >
              No baggage policies found for this airline.
            </motion.div>
          )}

          {results && results.length > 0 && (
            <motion.div
              key="results"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
              className="space-y-4"
            >
              {results.map((result, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <Card
                    className={`transition-all hover:shadow-md ${result.fits ? 'border-green-500/50 bg-green-500/5' : 'border-destructive/50 bg-destructive/5'}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {result.policy.name}
                        </CardTitle>
                        {result.fits ? (
                          <Badge
                            variant="outline"
                            className="bg-green-500 text-white hover:bg-green-600 border-transparent transition-colors"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Fits
                            Perfectly
                          </Badge>
                        ) : (
                          <Badge
                            variant="destructive"
                            className="transition-colors"
                          >
                            <XCircle className="mr-1 h-3 w-3" /> Doesn't Fit
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Max: {result.policy.max_length}x
                        {result.policy.max_width}x{result.policy.max_height}
                        {result.policy.size_unit}
                        {result.policy.max_weight > 0 &&
                          ` • ${result.policy.max_weight}${result.policy.weight_unit}`}
                      </p>

                      {!result.fits && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-1 text-sm bg-destructive/10 p-3 rounded-md"
                        >
                          <div className="font-semibold text-destructive flex items-center mb-2">
                            <AlertTriangle className="h-4 w-4 mr-1" /> Exceeds
                            allowance by:
                          </div>
                          {result.exceeds.length && (
                            <div>
                              • Length by {result.exceeds.length}
                              {form.getValues('sizeUnit')}
                            </div>
                          )}
                          {result.exceeds.width && (
                            <div>
                              • Width by {result.exceeds.width}
                              {form.getValues('sizeUnit')}
                            </div>
                          )}
                          {result.exceeds.height && (
                            <div>
                              • Height by {result.exceeds.height}
                              {form.getValues('sizeUnit')}
                            </div>
                          )}
                          {result.exceeds.weight && (
                            <div>
                              • Weight by {result.exceeds.weight}
                              {form.getValues('weightUnit')}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function BagFitCheckerForm() {
  return (
    <React.Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Spinner size="lg" />
        </div>
      }
    >
      <BagFitCheckerFormInner />
    </React.Suspense>
  );
}
