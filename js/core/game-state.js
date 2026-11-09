// Central authoritative game state

const defaultState = {
  player: {
    name: "Captain",
    currentSystem: "sol",
    currentShipId: null,
    progression: { deliveries: 0, exploration: 0 }
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
  cargo: {}, // systemId -> { type: quantity }
  contracts: [],
  transactions: [],
  gameTime: 0
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
      contracts: state.contracts,
      personalCredits: window.Credits ? window.Credits.getPersonal() : window.credits,
      companyCredits: window.Credits ? window.Credits.getAllCompanyBalances() : {},
      gameTime: state.gameTime
    };
    window.SaveManager.save(toSave);
  }
}

function loadState() {
  if (!window.SaveManager) return;
  const loaded = window.SaveManager.load();
  if (loaded && loaded.data) {
    state = { ...defaultState, ...loaded.data };
    // Restore credits
    if (window.Credits && loaded.data.personalCredits != null) {
      window.Credits.setPersonal(loaded.data.personalCredits);
    }
    if (loaded.data.companyCredits) {
      for (const [id, bal] of Object.entries(loaded.data.companyCredits)) {
        window.Credits.setCompany(id, bal);
      }
    }
    console.log("Game state loaded");
  } else {
    // Initialize company credits
    if (window.Credits) {
      state.companies.forEach(c => window.Credits.setCompany(c.id, c.credits));
    }
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
  saveState();
  return true;
}

// Expose
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
  defaultState
};

// Auto-load on script include
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadState);
} else {
  loadState();
}
