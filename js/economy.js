// Adapted Economy module from Transport Framework for Space Pack
window.Economy = (() => {
  "use strict";

  const SETTINGS = {
    HOURS_PER_YEAR: 365,
    LEASE_GRACE_HOURS: 24,
    pilotWagePerHour: 2,
    vehicleMaintenancePerHour: 0.5,
    vehicleWearPerHour: 0.002,
    repairCostPerConditionPoint: 5,
    stationMaintenancePerHour: 2,
    defaultLeasePrice: 1000,
    fuelPrices: { xenon: 2, hydrogen: 1, antimatter: 25 },
    npcStartingCredits: 100000,
    realMillisecondsPerGameHour: 1000
  };

  let U = null, CFG = null, initialized = false;
  const state = {
    gameHours: 0, leases: [], stations: [], markets: {}, factions: {}, events: [],
    statistics: { totalRevenue: 0, totalExpenses: 0, deliveries: 0 }
  };

  const num = (v, d = 0) => Number.isFinite(Number(v)) ? Number(v) : d;
  const positive = v => Math.max(0, num(v));
  const requireInit = () => { if (!initialized) throw Error("Economy.init must be called first."); };

  function record(message, type = "info") {
    state.events.push({ time: state.gameHours, message, type });
    if (state.events.length > 200) state.events.shift();
    if (typeof window.msg === "function") window.msg(message);
  }

  function charge(amount, reason = "Expense") {
    requireInit();
    amount = positive(amount);
    if ((window.credits || 0) < amount) return false;
    window.credits -= amount;
    state.statistics.totalExpenses += amount;
    record(`${reason}: -${amount.toFixed(0)} cr`, "expense");
    return true;
  }

  function pay(amount, reason = "Revenue") {
    requireInit();
    amount = positive(amount);
    window.credits = (window.credits || 0) + amount;
    state.statistics.totalRevenue += amount;
    record(`${reason}: +${amount.toFixed(0)} cr`, "income");
    return true;
  }

  function init(universe, config) {
    U = universe; CFG = config; initialized = true;
    initializeFactions();
    record("Economy initialized.");
    return true;
  }

  function initializeFactions() {
    const facs = CFG?.factions || window.FACTIONS || {};
    for (const [id, config] of Object.entries(facs)) {
      if (!state.factions[id]) {
        state.factions[id] = {
          id, name: config.name || id, credits: SETTINGS.npcStartingCredits,
          reputation: 50, systems: [], active: true
        };
      }
    }
  }

  function changeReputation(id, amount) {
    const faction = state.factions[id];
    if (!faction) return false;
    faction.reputation = Math.max(0, Math.min(100, num(faction.reputation) + num(amount)));
    if (window.factionRep) window.factionRep[id] = faction.reputation;
    record(`${faction.name} reputation ${amount > 0 ? "+" : ""}${amount} → ${Math.round(faction.reputation)}`);
    return faction.reputation;
  }

  function update(hours = 1) {
    requireInit();
    hours = positive(hours);
    state.gameHours += hours;
    // Simple maintenance tick if ships exist
    if (window.ownedShips && hours > 0) {
      const cost = window.ownedShips.length * SETTINGS.vehicleMaintenancePerHour * hours;
      if (cost > 0) charge(cost, "Fleet maintenance");
    }
  }

  return {
    SETTINGS, init, charge, pay, changeReputation, update,
    get events() { return state.events; },
    get statistics() { return state.statistics; },
    get gameHours() { return state.gameHours; },
    get factions() { return state.factions; }
  };
})();
