/* Space Pack improvements: persistence, contracts UI, control fallbacks
   Loaded after space.js — hooks into existing globals safely. */
(function () {
  "use strict";

  const SAVE_KEY = "spacePack.main.v1";

  function collectSaveState() {
    return {
      version: 1,
      savedAt: new Date().toISOString(),
      credits: typeof credits !== "undefined" ? credits : 0,
      fuel: typeof fuel !== "undefined" ? fuel : 100,
      inventory: typeof inventory !== "undefined" ? { ...inventory } : {},
      factionRep: typeof factionRep !== "undefined" ? { ...factionRep } : {},
      ownedShips: typeof ownedShips !== "undefined" ? [...ownedShips] : ["scout"],
      activeContracts: typeof activeContracts !== "undefined"
        ? activeContracts.map((c) => ({ ...c }))
        : [],
      completedContracts: typeof completedContracts !== "undefined" ? completedContracts : 0,
      reputation: typeof reputation !== "undefined" ? reputation : 50
    };
  }

  function applySaveState(data) {
    if (!data || data.version !== 1) return false;
    if (typeof data.credits === "number" && typeof credits !== "undefined") credits = data.credits;
    if (typeof data.fuel === "number" && typeof fuel !== "undefined")
      fuel = Math.max(0, Math.min(100, data.fuel));
    if (data.inventory && typeof inventory !== "undefined") {
      for (const k of Object.keys(inventory)) delete inventory[k];
      Object.assign(inventory, data.inventory);
    }
    if (data.factionRep && typeof factionRep !== "undefined") {
      Object.assign(factionRep, data.factionRep);
    }
    if (Array.isArray(data.ownedShips) && data.ownedShips.length && typeof ownedShips !== "undefined") {
      ownedShips.length = 0;
      ownedShips.push(...data.ownedShips);
    }
    if (Array.isArray(data.activeContracts) && typeof activeContracts !== "undefined") {
      activeContracts = data.activeContracts.map((c) => ({ ...c }));
    }
    if (typeof data.completedContracts === "number" && typeof completedContracts !== "undefined") {
      completedContracts = data.completedContracts;
    }
    if (typeof data.reputation === "number" && typeof reputation !== "undefined") {
      reputation = data.reputation;
    }
    if (typeof msg === "function") {
      msg("Game loaded (" + (data.savedAt ? new Date(data.savedAt).toLocaleString() : "ok") + ")");
    }
    return true;
  }

  window.saveGame = function saveGame() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(collectSaveState()));
      if (typeof msg === "function") msg("Progress saved");
      return true;
    } catch (e) {
      if (typeof msg === "function") msg("Save failed");
      return false;
    }
  };

  window.loadGame = function loadGame() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        if (typeof msg === "function") msg("No save found");
        return false;
      }
      return applySaveState(JSON.parse(raw));
    } catch (e) {
      if (typeof msg === "function") msg("Load failed");
      return false;
    }
  };

  function autoSave() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(collectSaveState()));
    } catch (_) {}
  }

  function renderStationContracts() {
    const el = document.getElementById("stationContracts");
    if (!el || typeof CONTRACTS === "undefined") return;
    el.innerHTML = "";
    const active = typeof activeContracts !== "undefined" ? activeContracts : [];
    const available = CONTRACTS.filter((c) => !active.some((a) => a.id === c.id));

    for (const c of active) {
      const div = document.createElement("div");
      div.className = "shop-item";
      const have = (typeof inventory !== "undefined" && inventory[c.resource]) || 0;
      const name =
        typeof getResource === "function" ? getResource(c.resource).name : c.resource;
      div.innerHTML =
        "<b>Active:</b> " +
        c.desc +
        "<br>Need " +
        c.amount +
        " " +
        name +
        " (you have " +
        have +
        ") · Reward " +
        Number(c.reward).toLocaleString() +
        " cr";
      el.appendChild(div);
    }
    for (const c of available.slice(0, 6)) {
      const div = document.createElement("div");
      div.className = "shop-item";
      const name =
        typeof getResource === "function" ? getResource(c.resource).name : c.resource;
      div.innerHTML =
        "<b>" +
        c.desc +
        "</b><br>" +
        c.amount +
        " " +
        name +
        " · " +
        Number(c.reward).toLocaleString() +
        " cr<br><button data-accept=\"" +
        c.id +
        "\">Accept</button>";
      el.appendChild(div);
    }
    el.querySelectorAll("[data-accept]").forEach((btn) => {
      btn.onclick = () => {
        if (typeof acceptContract === "function") acceptContract(btn.dataset.accept);
        renderStationContracts();
      };
    });
  }

  if (typeof openStationMenu === "function") {
    const _open = openStationMenu;
    window.openStationMenu = function (id) {
      _open(id);
      renderStationContracts();
    };
  }

  function wireUI() {
    const saveBtn = document.getElementById("savebtn");
    const loadBtn = document.getElementById("loadbtn");
    if (saveBtn) saveBtn.onclick = () => window.saveGame();
    if (loadBtn) loadBtn.onclick = () => window.loadGame();

    const laserBtn = document.getElementById("laserbtn");
    if (laserBtn && typeof fireWeapon === "function") {
      laserBtn.onclick = () => fireWeapon();
    }

    document.querySelectorAll("[data-k]").forEach((e) => {
      const k = e.dataset.k;
      if (!e._improvedBound) {
        e.onpointerdown = () => {
          if (typeof K !== "undefined") K[k] = 1;
        };
        e.onpointerup = e.onpointerleave = e.onpointercancel = () => {
          if (typeof K !== "undefined") K[k] = 0;
        };
        e._improvedBound = true;
      }
    });

    setInterval(autoSave, 120000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireUI);
  } else {
    setTimeout(wireUI, 50);
  }
})();
