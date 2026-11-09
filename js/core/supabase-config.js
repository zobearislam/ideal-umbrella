/**
 * Supabase client configuration for Space Pack cloud saves.
 *
 * YOU add the publishable/anon key here. Do not commit service-role keys.
 * Expected shape of public.game_saves (RLS must restrict every op to auth.uid() = user_id):
 *   id uuid PK default gen_random_uuid()
 *   user_id uuid not null references auth.users(id) on delete cascade
 *   slot text not null default 'default'
 *   save_data jsonb not null
 *   updated_at timestamptz not null default now()
 *   unique (user_id, slot)
 */
(function () {
  "use strict";

  // --- Replace these two values with your project settings ---
  window.SUPABASE_URL = window.SUPABASE_URL || "https://YOUR_PROJECT_REF.supabase.co";
  window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

  window.SupabaseConfig = {
    url: window.SUPABASE_URL,
    anonKey: window.SUPABASE_ANON_KEY,
    isConfigured() {
      const u = String(window.SUPABASE_URL || "");
      const k = String(window.SUPABASE_ANON_KEY || "");
      return (
        u.startsWith("https://") &&
        !u.includes("YOUR_PROJECT_REF") &&
        k.length > 20 &&
        !k.includes("YOUR_SUPABASE_ANON_KEY")
      );
    }
  };
})();
