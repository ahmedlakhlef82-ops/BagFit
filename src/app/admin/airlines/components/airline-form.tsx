'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { createAirlineAction, updateAirlineAction } from '@/app/actions/admin-airlines';

const airlineFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  iata_code: z.string().length(2, { message: 'IATA code must be exactly 2 characters.' }).toUpperCase(),
  icao_code: z.string().length(3, { message: 'ICAO code must be exactly 3 characters.' }).toUpperCase().optional().or(z.literal('')),
  country: z.string().min(2, { message: 'Please enter a country.' }),
  website: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

type AirlineFormValues = z.infer<typeof airlineFormSchema>;

export function AirlineForm({ initialData }: { initialData?: any }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<AirlineFormValues>({
    resolver: zodResolver(airlineFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      iata_code: initialData?.iata_code || '',
      icao_code: initialData?.icao_code || '',
      country: initialData?.country || '',
      website: initialData?.website || '',
    },
  });

  async function onSubmit(data: AirlineFormValues) {
    setIsLoading(true);
    try {
      const payload = { ...data, icao_code: data.icao_code || null, website: data.website || null };
      const result = initialData
        ? await updateAirlineAction(initialData.id, payload)
        : await createAirlineAction(payload);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Airline ${initialData ? 'updated' : 'created'} successfully.`);
        router.push('/admin/airlines');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Airline Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Delta Air Lines" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="iata_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IATA Code</FormLabel>
                <FormControl>
                   <Input placeholder="e.g. DL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icao_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ICAO Code (Optional)</FormLabel>
                <FormControl>
                   <Input placeholder="e.g. DAL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="e.g. United States" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Official Website (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://delta.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2 h-4 w-4" />}
          {initialData ? 'Update Airline' : 'Create Airline'}
        </Button>
      </form>
    </Form>
  );
}
