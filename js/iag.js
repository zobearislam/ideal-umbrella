/**
 * IAG — Interstellar Authority Group
 * Connects laws, incidents, diplomacy list, faction standings, and NPC fleets.
 */
window.IAG = (function () {
  "use strict";

  const laws = {
    unsafeDischarge: {
      name: "Unsafe weapons discharge",
      fine: 2500,
      reputationLoss: 5,
      spite: 4,
      trust: -3
    },
    unlawfulAssault: {
      name: "Unlawful assault",
      fine: 10000,
      reputationLoss: 20,
      spite: 15,
      trust: -12,
      honour: -8
    },
    gateInterference: {
      name: "Gate interference",
      fine: 25000,
      reputationLoss: 35,
      spite: 20,
      trust: -18,
      honour: -12
    },
    propertyDamage: {
      name: "Civilian property damage",
      fine: 7500,
      reputationLoss: 12,
      spite: 8,
      trust: -6
    },
    inspectionObstruction: {
      name: "Obstruction of IAG inspection",
      fine: 5000,
      reputationLoss: 10,
      spite: 7,
      trust: -8,
      honour: -5
    },
    smuggling: {
      name: "Suspected smuggling",
      fine: 8000,
      reputationLoss: 15,
      spite: 10,
      trust: -10
    }
  };

  let incidents = [];
  let nextId = 1;

  function factionList() {
    const F = window.FACTIONS || {};
    const ids = Object.keys(F);
    if (ids.length) {
      return ids.map(function (id) {
        var f = F[id];
        return {
          id: id,
          name: f.name || id,
          desc: f.description || "",
          color: f.color || "#888",
          preferredGoods: f.preferredGoods || []
        };
      });
    }
    return [
      { id: "terran", name: "Terran Confederation", desc: "Earth authority", color: "#4a90d9" },
      { id: "pirate", name: "Pirate Clans", desc: "Raiders", color: "#a33" }
    ];
  }

  /** Authority that prosecutes an incident in a system (default Terran/IAG) */
  function authorityForSystem(systemId) {
    var s = (systemId || "sol").toLowerCase();
    if (s === "sol" || s === "earth") return "terran";
    if (s.indexOf("mars") >= 0) return "martian";
    if (s.indexOf("belt") >= 0 || s.indexOf("ceres") >= 0) return "belt";
    if (s.indexOf("jove") >= 0 || s.indexOf("jupiter") >= 0) return "jovian";
    return "terran";
  }

  function applyStandingHit(factionId, law) {
    var loss = law.reputationLoss || 5;
    if (window.FactionStanding) {
      window.FactionStanding.adjust(factionId, {
        goodwill: -Math.abs(loss),
        trust: law.trust != null ? law.trust : -Math.abs(loss) * 0.5,
        love: -Math.abs(loss) * 0.2,
        honour: law.honour != null ? law.honour : -Math.abs(loss) * 0.25,
        spite: law.spite != null ? law.spite : Math.abs(loss) * 0.6
      });
      return;
    }
    if (typeof window.changeRep === "function") {
      window.changeRep(-Math.abs(loss), factionId);
      return;
    }
    if (window.Economy && window.Economy.changeReputation) {
      try {
        window.Economy.changeReputation(factionId, -Math.abs(loss));
      } catch (e) {}
    }
  }

  function levyFine(amount) {
    amount = Math.round(Math.abs(amount) || 0);
    if (!amount) return 0;
    if (window.Credits) {
      var bal = window.Credits.getPersonal();
      window.Credits.setPersonal(Math.max(0, bal - amount));
      window.Credits.record("personal", -amount, "IAG fine");
      return amount;
    }
    if (window.credits != null) {
      window.credits = Math.max(0, Number(window.credits) - amount);
      return amount;
    }
    return 0;
  }

  function recordIncident(data) {
    data = data || {};
    var law = laws[data.lawId];
    if (!law) return null;
    var system = data.system || "Sol";
    var authority = data.factionId || authorityForSystem(system);
    var incident = {
      id: nextId++,
      lawId: data.lawId,
      offender: data.offender || "player",
      system: system,
      authority: authority,
      status: "under investigation",
      fine: law.fine,
      reputationLoss: law.reputationLoss,
      name: law.name,
      createdAt: Date.now()
    };
    incidents.push(incident);
    if (typeof window.msg === "function") {
      window.msg("IAG: " + law.name + " (" + authority + ")");
    }
    // Auto-confirm minor laser noise sometimes for pacing
    if (data.lawId === "unsafeDischarge" && Math.random() < 0.35) {
      confirmIncident(incident.id);
    }
    persist();
    return incident;
  }

  function confirmIncident(id) {
    var incident = incidents.find(function (x) {
      return x.id === id;
    });
    if (!incident || incident.status !== "under investigation") return false;
    incident.status = "confirmed";
    var law = laws[incident.lawId] || {};
    levyFine(incident.fine);
    applyStandingHit(incident.authority || "terran", {
      reputationLoss: incident.reputationLoss,
      trust: law.trust,
      honour: law.honour,
      spite: law.spite
    });
    if (typeof window.msg === "function") {
      window.msg(
        "IAG fine −" + incident.fine + " cr · standing hit with " + (incident.authority || "terran")
      );
    }
    persist();
    return { fine: incident.fine, reputationLoss: incident.reputationLoss, authority: incident.authority };
  }

  function dismissIncident(id) {
    var incident = incidents.find(function (x) {
      return x.id === id;
    });
    if (!incident || incident.status !== "under investigation") return false;
    incident.status = "dismissed";
    persist();
    return true;
  }

  function persist() {
    try {
      if (window.GameState && window.GameState.getState) {
        var st = window.GameState.getState();
        st.iagIncidents = incidents.slice(-40);
        st.iagNextId = nextId;
        if (window.GameState.saveState) window.GameState.saveState();
      }
    } catch (e) {}
  }

  function load() {
    try {
      if (window.GameState && window.GameState.getState) {
        var st = window.GameState.getState();
        if (Array.isArray(st.iagIncidents)) incidents = st.iagIncidents;
        if (typeof st.iagNextId === "number") nextId = st.iagNextId;
      }
    } catch (e) {}
  }

  /** Diplomacy snapshot: each faction + hidden standings summary + stance mood */
  function diplomacyReport() {
    return factionList().map(function (f) {
      var standing = null;
      var stance = null;
      if (window.FactionStanding) {
        standing = window.FactionStanding.get(f.id);
        stance = window.FactionStanding.stance(f.id);
      }
      return {
        id: f.id,
        name: f.name,
        desc: f.desc,
        color: f.color,
        mood: stance ? stance.mood : "unknown",
        goodwill: standing ? standing.goodwill : 50,
        // hidden fields available to systems, not required for UI
        _standing: standing,
        buyMult: stance ? stance.buyMult : 1,
        sellMult: stance ? stance.sellMult : 1,
        help: stance ? stance.help : false
      };
    });
  }

  /** How a faction fleet treats the player right now */
  function fleetAttitude(factionId) {
    if (!window.FactionStanding) {
      return { hostile: false, friendly: false, inspect: false, escort: false };
    }
    var st = window.FactionStanding.stance(factionId);
    var s = st._standing || {};
    return {
      hostile: st.mood === "hostile" || (s.spite || 0) > 70,
      friendly: st.mood === "friendly" || st.mood === "allied",
      inspect: st.mood === "cool" || st.mood === "hostile",
      escort: st.help && (s.love || 0) > 55,
      mood: st.mood
    };
  }

  load();

  return {
    laws: laws,
    get diplomacyFactions() {
      return factionList();
    },
    recordIncident: recordIncident,
    confirmIncident: confirmIncident,
    dismissIncident: dismissIncident,
    getIncidents: function () {
      return incidents.slice();
    },
    diplomacyReport: diplomacyReport,
    fleetAttitude: fleetAttitude,
    authorityForSystem: authorityForSystem,
    load: load,
    persist: persist
  };
})();
