import { createClient } from '@/lib/supabase/client';
import { Airline } from '@/types/airline';

export async function getAirlines(searchQuery?: string): Promise<Airline[]> {
  const supabase = createClient();
  let query = supabase.from('airlines').select(`
    *,
    policies:baggage_policies(*)
  `);

  if (searchQuery) {
    query = query.or(
      `name.ilike.%${searchQuery}%,iata_code.ilike.%${searchQuery}%`
    );
  }

  const { data, error } = await query.order('name');

  if (error) {
    console.error('Error fetching airlines:', error);
    return [];
  }

  return data as Airline[];
}

export async function getAirlineByIata(iata: string): Promise<Airline | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('airlines')
    .select(`*, policies:baggage_policies(*)`)
    .eq('iata_code', iata.toUpperCase())
    .single();

  if (error) {
    console.error('Error fetching airline:', error);
    return null;
  }

  return data as Airline;
}
