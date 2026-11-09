// IAG (Interstellar Authority Group) reputation / incident system
window.IAG = (() => {
  const diplomacyFactions = [
    { id: "terran", name: "Terran Confederation", desc: "Earth’s unified government. Runs the inner-system ports." },
    { id: "pirate", name: "Pirate Clans", desc: "Raiders of the lanes. They respect strength and coin." },
    { id: "martian", name: "Martian Republic", desc: "Terraforming colonies with their own ports and laws." },
    { id: "belt", name: "Belt Miners’ Union", desc: "Asteroid prospectors who ship ore and need haulers." },
    { id: "jovian", name: "Jovian Syndicate", desc: "A corporate bloc building ships around the gas giants." },
    { id: "outer", name: "Outer Colonies League", desc: "Distant settlements beyond the belt, short on supplies." }
  ];

  const laws = {
    unsafeDischarge: { name: "Unsafe weapons discharge", fine: 2500, reputationLoss: 5 },
    unlawfulAssault: { name: "Unlawful assault", fine: 10000, reputationLoss: 20 },
    gateInterference: { name: "Gate interference", fine: 25000, reputationLoss: 35 },
    propertyDamage: { name: "Civilian property damage", fine: 7500, reputationLoss: 12 },
    inspectionObstruction: { name: "Obstruction of IAG inspection", fine: 5000, reputationLoss: 10 }
  };

  let incidents = [];
  let nextId = 1;

  function applyRepLoss(amount) {
    // Prefer Economy when initialized; otherwise adjust factionRep globally
    if (window.Economy && typeof window.Economy.changeReputation === "function") {
      // Apply a general hit to terran (authority) standing when no specific faction is given
      try {
        window.Economy.changeReputation("terran", -Math.abs(amount));
        return;
      } catch (e) { /* not initialized */ }
    }
    if (typeof window.changeRep === "function") {
      window.changeRep(-Math.abs(amount));
      return;
    }
    if (window.factionRep) {
      for (const id of Object.keys(window.factionRep)) {
        window.factionRep[id] = Math.max(0, Math.min(100, (window.factionRep[id] || 50) - Math.abs(amount)));
      }
    }
  }

  function recordIncident(data) {
    const law = laws[data.lawId];
    if (!law) return null;
    const incident = {
      id: nextId++,
      lawId: data.lawId,
      offender: data.offender || "player",
      system: data.system || "Sol",
      status: "under investigation",
      fine: law.fine,
      reputationLoss: law.reputationLoss,
      name: law.name
    };
    incidents.push(incident);
    if (typeof msg === "function") msg("IAG incident recorded: " + law.name);
    return incident;
  }

  function confirmIncident(id) {
    const incident = incidents.find(x => x.id === id);
    if (!incident || incident.status !== "under investigation") return false;
    incident.status = "confirmed";
    if (window.credits !== undefined) window.credits = Math.max(0, window.credits - incident.fine);
    applyRepLoss(incident.reputationLoss);
    if (typeof msg === "function") msg(`IAG fine: -${incident.fine} cr, rep -${incident.reputationLoss}`);
    return { fine: incident.fine, reputationLoss: incident.reputationLoss };
  }

  function dismissIncident(id) {
    const incident = incidents.find(x => x.id === id);
    if (!incident || incident.status !== "under investigation") return false;
    incident.status = "dismissed";
    return true;
  }

  return { laws, diplomacyFactions, recordIncident, confirmIncident, dismissIncident, getIncidents: () => incidents };
})();
