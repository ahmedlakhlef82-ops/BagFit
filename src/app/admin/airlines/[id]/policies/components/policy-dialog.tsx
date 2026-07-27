'use client';

import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { BaggagePolicy } from '@/types/airline';
import { toast } from 'sonner';
import { createPolicyAction, updatePolicyAction } from '@/app/actions/admin-policies';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const policySchema = z.object({
  name: z.string().min(2, { message: 'Required' }),
  type: z.enum(['personal', 'cabin', 'checked']),
  max_length: z.coerce.number().min(0.1, { message: 'Must be > 0' }),
  max_width: z.coerce.number().min(0.1, { message: 'Must be > 0' }),
  max_height: z.coerce.number().min(0.1, { message: 'Must be > 0' }),
  max_weight: z.coerce.number().min(0),
  size_unit: z.enum(['cm', 'in']),
  weight_unit: z.enum(['kg', 'lb']),
  notes: z.string().optional()
});

type PolicyFormData = z.infer<typeof policySchema>;

interface PolicyDialogProps {
  airlineId: string;
  initialData?: BaggagePolicy;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PolicyDialog({ airlineId, initialData, open, onOpenChange }: PolicyDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;

  const form = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'cabin',
      max_length: initialData?.max_length || 0,
      max_width: initialData?.max_width || 0,
      max_height: initialData?.max_height || 0,
      max_weight: initialData?.max_weight || 0,
      size_unit: initialData?.size_unit || 'cm',
      weight_unit: initialData?.weight_unit || 'kg',
      notes: initialData?.notes || ''
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        type: initialData.type,
        max_length: initialData.max_length,
        max_width: initialData.max_width,
        max_height: initialData.max_height,
        max_weight: initialData.max_weight,
        size_unit: initialData.size_unit,
        weight_unit: initialData.weight_unit,
        notes: initialData.notes || ''
      });
    } else {
      form.reset({
        name: '',
        type: 'cabin',
        max_length: 0,
        max_width: 0,
        max_height: 0,
        max_weight: 0,
        size_unit: 'cm',
        weight_unit: 'kg',
        notes: ''
      });
    }
  }, [initialData, form, isOpen]);

  async function onSubmit(data: PolicyFormData) {
    setIsLoading(true);
    try {
      const payload = { ...data, airline_id: airlineId };
      const result = initialData
        ? await updatePolicyAction(initialData.id, payload)
        : await createPolicyAction(payload);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Policy ${initialData ? 'updated' : 'created'} successfully.`);
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Policy
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit' : 'Add'} Baggage Policy</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the details' : 'Define the rules and dimensions'} for this baggage class.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Standard Carry-on" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Baggage Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="personal">Personal Item</SelectItem>
                        <SelectItem value="cabin">Cabin / Carry-on</SelectItem>
                        <SelectItem value="checked">Checked Bag</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="size_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size Unit</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="in">inches</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight Unit</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lb">lb</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 border-t pt-4">
              <FormField
                control={form.control}
                name="max_length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="max_weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Weight (0 for unlimited)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Must fit under the seat in front of you" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Spinner className="mr-2 h-4 w-4" />}
                {initialData ? 'Save Changes' : 'Create Policy'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
