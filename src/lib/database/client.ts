import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { env, isServiceConfigured } from '../env';

let supabase: SupabaseClient | null = null;

if (isServiceConfigured('supabase')) {
  supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export { supabase };
