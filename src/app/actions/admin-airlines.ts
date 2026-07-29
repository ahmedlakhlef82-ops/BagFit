'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from './admin-auth';

export async function createAirlineAction(data: Record<string, unknown>) {
  await verifyAdmin();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from('airlines')
    .select('id')
    .or(`iata_code.eq.${data.iata_code},icao_code.eq.${data.icao_code}`)
    .maybeSingle();

  if (existing) {
    return { error: 'Airline with this IATA or ICAO code already exists.' };
  }

  const { data: newAirline, error } = await supabase
    .from('airlines')
    .insert([data])
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath('/admin/airlines');
  revalidatePath('/airlines');
  return { success: true, data: newAirline };
}

export async function updateAirlineAction(
  id: string,
  data: Record<string, unknown>
) {
  await verifyAdmin();
  const supabase = await createClient();

  if (data.iata_code || data.icao_code) {
    const { data: existing } = await supabase
      .from('airlines')
      .select('id')
      .neq('id', id)
      .or(`iata_code.eq.${data.iata_code},icao_code.eq.${data.icao_code}`)
      .maybeSingle();
    if (existing)
      return { error: 'Airline with this IATA or ICAO code already exists.' };
  }

  const { data: updatedAirline, error } = await supabase
    .from('airlines')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath('/admin/airlines');
  revalidatePath('/airlines');
  revalidatePath(`/airlines/${data.iata_code?.toLowerCase()}`);
  return { success: true, data: updatedAirline };
}

export async function deleteAirlineAction(id: string) {
  await verifyAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('airlines').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/airlines');
  revalidatePath('/airlines');
  return { success: true };
}

export async function importAirlinesCSV(airlinesData: any[]) {
  await verifyAdmin();
  const supabase = await createClient();

  const validAirlines = airlinesData.filter((a) => a.name && a.iata_code);
  if (validAirlines.length === 0)
    return { error: 'No valid airlines found in CSV' };

  const { error } = await supabase
    .from('airlines')
    .upsert(validAirlines, { onConflict: 'iata_code' });

  if (error) return { error: error.message };

  revalidatePath('/admin/airlines');
  revalidatePath('/airlines');
  return { success: true, count: validAirlines.length };
}
