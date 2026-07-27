'use server'

import { createClient } from '@/lib/supabase/server'

export async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Unauthorized');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }

  return true;
}
