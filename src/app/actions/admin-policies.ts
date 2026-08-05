'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { verifyAdmin } from './admin-auth'

export async function createPolicyAction(data: any) {
  await verifyAdmin()
  const supabase = await createClient()

  const { data: newPolicy, error } = await supabase
    .from('baggage_policies')
    .insert([data])
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/admin/airlines/${data.airline_id}`)
  revalidatePath('/airlines')
  return { success: true, data: newPolicy }
}

export async function updatePolicyAction(id: string, data: any) {
  await verifyAdmin()
  const supabase = await createClient()

  const { data: updatedPolicy, error } = await supabase
    .from('baggage_policies')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/admin/airlines/${data.airline_id}`)
  revalidatePath('/airlines')
  return { success: true, data: updatedPolicy }
}

export async function deletePolicyAction(id: string, airlineId: string) {
  await verifyAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('baggage_policies').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/admin/airlines/${airlineId}`)
  revalidatePath('/airlines')
  return { success: true }
}
