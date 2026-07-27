'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAirlines } from '@/lib/services/airline-service';
import { deleteAirlineAction } from '@/app/actions/admin-airlines';
import { SearchInput } from '@/components/ui/search-input';
import { useDebounce } from '@/hooks/use-debounce';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Edit2, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AirlinesTable() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: airlines, isLoading, refetch } = useQuery({
    queryKey: ['admin-airlines', debouncedSearch],
    queryFn: () => getAirlines(debouncedSearch),
  });

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;

    const result = await deleteAirlineAction(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`${name} deleted successfully.`);
      refetch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between max-w-sm">
        <SearchInput
          placeholder="Search airlines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>IATA / ICAO</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Policies</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <Spinner className="mx-auto" />
                </TableCell>
              </TableRow>
            ) : airlines?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No airlines found.
                </TableCell>
              </TableRow>
            ) : (
              airlines?.map((airline) => (
                <TableRow key={airline.id}>
                  <TableCell className="font-medium">{airline.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                       <Badge variant="secondary">{airline.iata_code}</Badge>
                       {airline.icao_code && <Badge variant="outline">{airline.icao_code}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{airline.country}</TableCell>
                  <TableCell>
                     <Badge variant="outline">{airline.policies?.length || 0} policies</Badge>
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
                        <DropdownMenuItem asChild>
                           <Link href={`/admin/airlines/${airline.id}`}>
                             <Edit2 className="h-4 w-4 mr-2" /> Edit Airline
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href={`/admin/airlines/${airline.id}/policies`}>
                             <Settings className="h-4 w-4 mr-2" /> Manage Policies
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(airline.id, airline.name)}
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
    </div>
  );
}
