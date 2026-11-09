// Central authoritative game state — shared by simulator, transport, missions

const defaultState = {
  player: {
    name: "Captain",
    currentSystem: "sol",
    currentShipId: null,
    progression: { deliveries: 0, exploration: 0, missionsCompleted: 0 }
  },
  companies: [
    {
      id: "company-1",
      name: "Independent Freighter",
      credits: 75000,
      ships: ["ship-1", "ship-2"],
      stations: []
    }
  ],
  ships: [
    { id: "ship-1", name: "Wayfarer", type: "hauler", owner: "company-1", location: "sol", status: "Idle", condition: 100, cargo: [], passengers: 0 },
    { id: "ship-2", name: "Swift Courier", type: "courier", owner: "company-1", location: "sol", status: "Idle", condition: 100, cargo: [], passengers: 0 }
  ],
  cargo: {}, // systemId -> { type: quantity }  (station warehouses / delivered goods)
  inventory: { iron: 5, ice: 8, fuel: 10, crystal: 2 }, // player ship hold (simulator)
  factionRep: null, // filled from FACTIONS on first run
  activeMissions: [],
  completedMissionIds: [],
  contracts: [],
  transactions: [],
  gameTime: 0,
  journeys: [],
  completedContractIds: [],
  nextJourneyId: 1
};

let state = JSON.parse(JSON.stringify(defaultState));

function getState() {
  return state;
}

function setState(newState) {
  state = newState;
  saveState();
}

function saveState() {
  if (window.SaveManager) {
    const toSave = {
      player: state.player,
      companies: state.companies,
      ships: state.ships,
      cargo: state.cargo,
      inventory: state.inventory,
      factionRep: state.factionRep || window.factionRep || null,
      activeMissions: state.activeMissions || [],
      completedMissionIds: state.completedMissionIds || [],
      contracts: state.contracts,
      personalCredits: window.Credits ? window.Credits.getPersonal() : window.credits,
      companyCredits: window.Credits ? window.Credits.getAllCompanyBalances() : {},
      gameTime: state.gameTime,
      journeys: state.journeys || [],
      completedContractIds: state.completedContractIds || [],
      nextJourneyId: state.nextJourneyId || 1
    };
    window.SaveManager.save(toSave);
  }
}

function loadState() {
  if (!window.SaveManager) return;
  const loaded = window.SaveManager.load();
  if (loaded && loaded.data) {
    state = { ...JSON.parse(JSON.stringify(defaultState)), ...loaded.data };
    if (!Array.isArray(state.journeys)) state.journeys = [];
    if (!Array.isArray(state.completedContractIds)) state.completedContractIds = [];
    if (!Array.isArray(state.activeMissions)) state.activeMissions = [];
    if (!Array.isArray(state.completedMissionIds)) state.completedMissionIds = [];
    if (typeof state.nextJourneyId !== "number") state.nextJourneyId = 1;
    if (!state.inventory || typeof state.inventory !== "object") {
      state.inventory = { iron: 5, ice: 8, fuel: 10, crystal: 2 };
    }
    if (!state.player.progression) state.player.progression = { deliveries: 0, exploration: 0, missionsCompleted: 0 };
    if (window.Credits && loaded.data.personalCredits != null) {
      window.Credits.setPersonal(loaded.data.personalCredits);
    }
    if (loaded.data.companyCredits) {
      for (const [id, bal] of Object.entries(loaded.data.companyCredits)) {
        window.Credits.setCompany(id, bal);
      }
    } else if (window.Credits) {
      state.companies.forEach(c => {
        if (window.Credits.getCompany(c.id) === 0 && c.credits) {
          window.Credits.setCompany(c.id, c.credits);
        }
      });
    }
    if (loaded.data.factionRep && typeof loaded.data.factionRep === "object") {
      state.factionRep = loaded.data.factionRep;
      window.factionRep = { ...loaded.data.factionRep };
    }
    if (window.gameClock && typeof window.gameClock.load === "function" && loaded.data.clock) {
      window.gameClock.load(loaded.data.clock);
    }
    // Mirror inventory onto window for simulator
    window.inventory = { ...state.inventory };
    console.log("Game state loaded");
  } else {
    if (window.Credits) {
      state.companies.forEach(c => window.Credits.setCompany(c.id, c.credits));
    }
    window.inventory = { ...state.inventory };
  }
}

function getShip(id) {
  return state.ships.find(s => s.id === id) || null;
}

function addShip(ship) {
  if (state.ships.some(s => s.id === ship.id)) return false;
  state.ships.push(ship);
  const company = state.companies.find(c => c.id === ship.owner);
  if (company && !company.ships.includes(ship.id)) company.ships.push(ship.id);
  saveState();
  return true;
}

function getCompany(id) {
  return state.companies.find(c => c.id === id) || null;
}

function loadCargo(systemId, type, quantity) {
  if (!state.cargo[systemId]) state.cargo[systemId] = {};
  state.cargo[systemId][type] = (state.cargo[systemId][type] || 0) + quantity;
  saveState();
}

function unloadCargo(systemId, type, quantity) {
  if (!state.cargo[systemId] || (state.cargo[systemId][type] || 0) < quantity) return false;
  state.cargo[systemId][type] -= quantity;
  if (state.cargo[systemId][type] <= 0) delete state.cargo[systemId][type];
  saveState();
  return true;
}

function getSystemCargo(systemId) {
  return state.cargo[systemId] || {};
}

function syncInventoryFromWindow() {
  if (window.inventory && typeof window.inventory === "object") {
    state.inventory = { ...window.inventory };
  }
}

function syncInventoryToWindow() {
  window.inventory = { ...(state.inventory || {}) };
}

function acceptMission(mission) {
  if (!mission || !mission.id) return { ok: false, error: "Invalid mission" };
  if ((state.completedMissionIds || []).includes(mission.id)) {
    return { ok: false, error: "Already completed" };
  }
  if ((state.activeMissions || []).some(m => m.id === mission.id)) {
    return { ok: false, error: "Already active" };
  }
  state.activeMissions = state.activeMissions || [];
  state.activeMissions.push({
    id: mission.id,
    title: mission.title,
    type: mission.type,
    cargo: mission.cargo || null,
    quantity: mission.quantity || 0,
    reward: mission.reward || 0,
    reputation: mission.reputation || {},
    from: mission.from || null,
    to: mission.to || null,
    acceptedAt: Date.now()
  });
  saveState();
  return { ok: true };
}

function completeMission(missionId) {
  const idx = (state.activeMissions || []).findIndex(m => m.id === missionId);
  if (idx < 0) return { ok: false, error: "Not active" };
  const m = state.activeMissions[idx];
  state.activeMissions.splice(idx, 1);
  state.completedMissionIds = state.completedMissionIds || [];
  state.completedMissionIds.push(missionId);
  state.player.progression.missionsCompleted =
    (state.player.progression.missionsCompleted || 0) + 1;

  if (window.Credits) {
    window.Credits.addPersonal(m.reward || 0, `Mission: ${m.title}`);
  } else {
    window.credits = (window.credits || 0) + (m.reward || 0);
  }

  if (m.reputation && window.changeRep) {
    for (const [fid, delta] of Object.entries(m.reputation)) {
      window.changeRep(delta, fid);
    }
  } else if (m.reputation && window.factionRep) {
    for (const [fid, delta] of Object.entries(m.reputation)) {
      window.factionRep[fid] = Math.max(
        0,
        Math.min(100, (window.factionRep[fid] || 50) + Number(delta))
      );
    }
  }

  // Consume cargo from ship inventory if delivery mission
  if (m.cargo && m.quantity > 0 && state.inventory) {
    const have = state.inventory[m.cargo] || 0;
    if (have >= m.quantity) {
      state.inventory[m.cargo] = have - m.quantity;
      syncInventoryToWindow();
    }
  }

  state.factionRep = window.factionRep ? { ...window.factionRep } : state.factionRep;
  saveState();
  return { ok: true, reward: m.reward, mission: m };
}

function canCompleteMission(missionId) {
  const m = (state.activeMissions || []).find(x => x.id === missionId);
  if (!m) return false;
  if (m.type === "delivery" && m.cargo && m.quantity > 0) {
    const inv = state.inventory || window.inventory || {};
    return (inv[m.cargo] || 0) >= m.quantity;
  }
  // combat / diplomatic / exploration: completable at any station for now
  return true;
}

window.GameState = {
  getState,
  setState,
  saveState,
  loadState,
  getShip,
  addShip,
  getCompany,
  loadCargo,
  unloadCargo,
  getSystemCargo,
  syncInventoryFromWindow,
  syncInventoryToWindow,
  acceptMission,
  completeMission,
  canCompleteMission,
  defaultState
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadState);
} else {
  loadState();
}
