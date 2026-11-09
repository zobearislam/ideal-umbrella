/**
 * Supabase client configuration for Space Pack cloud saves.
 *
 * Publishable/anon key only. Do not commit service-role or secret keys.
 * Actual public.game_saves shape (do not recreate the table):
 *   user_id, slot_name, schema_version, save_data, created_at, updated_at
 *   primary key (user_id, slot_name)
 * RLS must restrict every op to auth.uid() = user_id.
 */
(function () {
  "use strict";

  // --- Replace these two values with your project settings ---
  window.SUPABASE_URL = window.SUPABASE_URL || "https://qdviglvmnqhdamymfwhs.supabase.co";
  window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "sb_publishable_uS1vL0jWipIXHYhL68fm1A_gBAenhXv";

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
