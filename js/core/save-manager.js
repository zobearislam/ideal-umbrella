const SAVE_KEY = "spaceTransportTycoonSave";
const SAVE_VERSION = 2;

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
      console.error("Save failed:", error);
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

      // Basic migration stub
      if (save.version < 2) {
        console.log("Migrating save from v" + save.version);
        // Ensure required fields exist
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
  }
};

window.SaveManager = SaveManager;
