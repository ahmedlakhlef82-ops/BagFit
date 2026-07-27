'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { deletePolicyAction } from '@/app/actions/admin-policies';
import { BaggagePolicy } from '@/types/airline';
import { PolicyDialog } from './policy-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function PoliciesTable({ airlineId, policies }: { airlineId: string, policies: BaggagePolicy[] }) {
  const [editingPolicy, setEditingPolicy] = React.useState<BaggagePolicy | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const policiesPerPage = 10;

  const indexOfLastPolicy = currentPage * policiesPerPage;
  const indexOfFirstPolicy = indexOfLastPolicy - policiesPerPage;
  const currentPolicies = policies?.slice(indexOfFirstPolicy, indexOfLastPolicy) || [];
  const totalPages = Math.ceil((policies?.length || 0) / policiesPerPage);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    const result = await deletePolicyAction(id, airlineId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`${name} deleted successfully.`);
    }
  };

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Dimensions</TableHead>
              <TableHead>Max Weight</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No policies found. Add one above.
                </TableCell>
              </TableRow>
            ) : (
              currentPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{policy.type.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{policy.name}</TableCell>
                  <TableCell>
                    {policy.max_length} x {policy.max_width} x {policy.max_height} {policy.size_unit}
                  </TableCell>
                  <TableCell>
                    {policy.max_weight > 0 ? `${policy.max_weight} ${policy.weight_unit}` : 'N/A'}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                     {policy.notes || <span className="text-muted-foreground italic">None</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditingPolicy(policy)}>
                           <Edit2 className="h-4 w-4 mr-2" /> Edit Policy
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(policy.id, policy.name)}
                        >
                           <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center text-sm font-medium px-2">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {editingPolicy && (
        <PolicyDialog
           airlineId={airlineId}
           initialData={editingPolicy}
           open={!!editingPolicy}
           onOpenChange={(open) => !open && setEditingPolicy(null)}
        />
      )}
    </>
  );
}
