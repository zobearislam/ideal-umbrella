/**
 * Local + cloud save manager.
 * Local save is authoritative for offline play.
 * Cloud save never erases a valid local save on failure.
 * A blank / empty local snapshot never overwrites a valid cloud save.
 */
(function () {
  "use strict";

  const SAVE_KEY = "spaceTransportTycoonSave";
  const SAVE_VERSION = 2;
  const CLOUD_SLOT = "default";

  function isMeaningfulData(data) {
    if (!data || typeof data !== "object") return false;
    const ships = data.ships;
    const companies = data.companies;
    const hasShips = Array.isArray(ships) && ships.length > 0;
    const hasCompanies = Array.isArray(companies) && companies.length > 0;
    const hasCredits =
      (typeof data.personalCredits === "number" && data.personalCredits > 0) ||
      (data.companyCredits && Object.keys(data.companyCredits).length > 0);
    return hasShips || hasCompanies || hasCredits || !!data.player;
  }

  const SaveManager = {
    save(data) {
      const saveData = {
        version: SAVE_VERSION,
        savedAt: Date.now(),
        data
      };
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        return true;
      } catch (error) {
        console.error("Local save failed:", error);
        return false;
      }
    },

    load() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;
        const save = JSON.parse(raw);
        if (!save || !save.data || typeof save.data !== "object") {
          console.warn("Invalid save data");
          return null;
        }
        if (save.version > SAVE_VERSION) {
          console.warn("Save was created by a newer game version.");
          return null;
        }
        if (save.version < 2) {
          if (!save.data.companies) save.data.companies = [];
          if (!save.data.cargo) save.data.cargo = {};
        }
        return save;
      } catch (error) {
        console.error("Save could not be loaded:", error);
        return null;
      }
    },

    clear() {
      localStorage.removeItem(SAVE_KEY);
    },

    getLocalSnapshot() {
      return this.load();
    },

    async getClient() {
      if (!window.SupabaseConfig || !window.SupabaseConfig.isConfigured()) {
        return { error: "Supabase is not configured. Add URL and anon key to js/core/supabase-config.js." };
      }
      if (!window.supabase || typeof window.supabase.createClient !== "function") {
        return { error: "Supabase JS library not loaded." };
      }
      if (!window.__supabaseClient) {
        window.__supabaseClient = window.supabase.createClient(
          window.SupabaseConfig.url,
          window.SupabaseConfig.anonKey
        );
      }
      return { client: window.__supabaseClient };
    },

    async getSessionUser() {
      const { client, error } = await this.getClient();
      if (error) return { error };
      const { data, error: sessErr } = await client.auth.getSession();
      if (sessErr) return { error: sessErr.message || String(sessErr) };
      const user = data && data.session ? data.session.user : null;
      return { client, user };
    },

    async signUp(email, password) {
      const { client, error } = await this.getClient();
      if (error) return { ok: false, error };
      const { data, error: authErr } = await client.auth.signUp({ email, password });
      if (authErr) return { ok: false, error: authErr.message || String(authErr) };
      return { ok: true, user: data.user, session: data.session };
    },

    async signIn(email, password) {
      const { client, error } = await this.getClient();
      if (error) return { ok: false, error };
      const { data, error: authErr } = await client.auth.signInWithPassword({ email, password });
      if (authErr) return { ok: false, error: authErr.message || String(authErr) };
      return { ok: true, user: data.user, session: data.session };
    },

    async signOut() {
      const { client, error } = await this.getClient();
      if (error) return { ok: false, error };
      const { error: outErr } = await client.auth.signOut();
      if (outErr) return { ok: false, error: outErr.message || String(outErr) };
      return { ok: true };
    },

    /**
     * Upload current local save to cloud.
     * Never clears or rewrites local storage on failure.
     * Refuses to upload empty / blank local data over an existing cloud save.
     */
    async cloudSave(optionalData) {
      const { client, user, error } = await this.getSessionUser();
      if (error) return { ok: false, error, status: "error" };
      if (!user) return { ok: false, error: "Not signed in.", status: "auth" };

      let payload = optionalData;
      if (!payload) {
        const local = this.load();
        payload = local && local.data ? local.data : null;
      }
      if (!isMeaningfulData(payload)) {
        return {
          ok: false,
          error: "Local save is empty or invalid. Refusing to overwrite cloud with a blank save.",
          status: "blocked-blank"
        };
      }

      const row = {
        user_id: user.id,
        slot: CLOUD_SLOT,
        save_data: {
          version: SAVE_VERSION,
          savedAt: Date.now(),
          data: payload
        },
        updated_at: new Date().toISOString()
      };

      try {
        const { data, error: upsertErr } = await client
          .from("game_saves")
          .upsert(row, { onConflict: "user_id,slot" })
          .select("updated_at")
          .maybeSingle();

        if (upsertErr) {
          // Local save is left untouched
          return { ok: false, error: upsertErr.message || String(upsertErr), status: "error" };
        }
        return {
          ok: true,
          status: "saved",
          updatedAt: (data && data.updated_at) || row.updated_at
        };
      } catch (e) {
        return { ok: false, error: e.message || String(e), status: "error" };
      }
    },

    /**
     * Load cloud save. Does not wipe local unless applyToLocal is true and cloud data is meaningful.
     */
    async cloudLoad(options) {
      const applyToLocal = !!(options && options.applyToLocal);
      const { client, user, error } = await this.getSessionUser();
      if (error) return { ok: false, error, status: "error" };
      if (!user) return { ok: false, error: "Not signed in.", status: "auth" };

      try {
        const { data, error: selErr } = await client
          .from("game_saves")
          .select("save_data, updated_at")
          .eq("user_id", user.id)
          .eq("slot", CLOUD_SLOT)
          .maybeSingle();

        if (selErr) {
          return { ok: false, error: selErr.message || String(selErr), status: "error" };
        }
        if (!data || !data.save_data) {
          return { ok: false, error: "No cloud save found for this account.", status: "empty" };
        }

        const cloud = data.save_data;
        const cloudData = cloud.data || cloud;
        if (!isMeaningfulData(cloudData)) {
          return {
            ok: false,
            error: "Cloud save is blank or invalid. Local save left unchanged.",
            status: "blocked-blank"
          };
        }

        if (applyToLocal) {
          // Write cloud into local without first clearing — overwrite only with valid data
          const written = this.save(cloudData);
          if (!written) {
            return {
              ok: false,
              error: "Cloud data retrieved but local write failed. Local save left as-is.",
              status: "error"
            };
          }
        }

        return {
          ok: true,
          status: "loaded",
          save: cloud,
          updatedAt: data.updated_at,
          applied: applyToLocal
        };
      } catch (e) {
        return { ok: false, error: e.message || String(e), status: "error" };
      }
    }
  };

  window.SaveManager = SaveManager;
})();
