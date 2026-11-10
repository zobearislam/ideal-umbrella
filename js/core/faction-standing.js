/**
 * Hidden faction attitude variables + rule machine for deals.
 * Dimensions (0–100, hidden from main HUD unless you surface them later):
 *   goodwill — general warmth toward the player
 *   trust    — belief you’ll keep bargains (fairer prices)
 *   love     — personal favor (tips, small help)
 *   honour   — keeps their word; resists spiteful gouging
 *   spite    — active hostility; worse deals, fewer favors
 *
 * Public API on window.FactionStanding
 */

(function () {
  "use strict";

  const KEYS = ["goodwill", "trust", "love", "honour", "spite"];

  function clamp(n) {
    n = Number(n);
    if (Number.isNaN(n)) return 50;
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  /** Seed one faction from FACTIONS[id].startingRep */
  function seedFromFaction(faction) {
    const base = clamp(
      faction && typeof faction.startingRep === "number" ? faction.startingRep : 50
    );
    // Spite runs opposite to goodwill by default
    const spite = clamp(100 - base);
    return {
      goodwill: base,
      trust: clamp(base - 5 + (base > 50 ? 5 : 0)),
      love: clamp(base * 0.5),
      honour: clamp(40 + base * 0.4),
      spite: clamp(spite * 0.7)
    };
  }

  function emptyStore() {
    const store = {};
    const factions = window.FACTIONS || {};
    for (const id of Object.keys(factions)) {
      store[id] = seedFromFaction(factions[id]);
    }
    return store;
  }

  // Runtime store (persisted via GameState when available)
  let standings = null;

  function ensure() {
    if (standings) return standings;
    if (window.GameState) {
      const st = window.GameState.getState();
      if (st.factionStandings && typeof st.factionStandings === "object") {
        standings = st.factionStandings;
        // Fill any new factions missing from an old save
        const factions = window.FACTIONS || {};
        for (const id of Object.keys(factions)) {
          if (!standings[id]) standings[id] = seedFromFaction(factions[id]);
        }
        return standings;
      }
    }
    standings = emptyStore();
    persist();
    return standings;
  }

  function persist() {
    if (!standings) return;
    if (window.GameState) {
      const st = window.GameState.getState();
      st.factionStandings = standings;
      // Keep legacy factionRep in sync with goodwill for older UI
      if (!window.factionRep) window.factionRep = {};
      for (const id of Object.keys(standings)) {
        window.factionRep[id] = standings[id].goodwill;
      }
      st.factionRep = { ...window.factionRep };
      if (typeof window.GameState.saveState === "function") {
        window.GameState.saveState();
      }
    } else {
      if (!window.factionRep) window.factionRep = {};
      for (const id of Object.keys(standings)) {
        window.factionRep[id] = standings[id].goodwill;
      }
    }
  }

  function get(factionId) {
    const store = ensure();
    if (!store[factionId]) {
      const f = window.FACTIONS && window.FACTIONS[factionId];
      store[factionId] = seedFromFaction(f || { startingRep: 50 });
    }
    return { ...store[factionId] };
  }

  function getAll() {
    return JSON.parse(JSON.stringify(ensure()));
  }

  /**
   * Adjust one or more dimensions.
   * deltas: { goodwill?: n, trust?: n, love?: n, honour?: n, spite?: n }
   */
  function adjust(factionId, deltas) {
    const store = ensure();
    if (!store[factionId]) store[factionId] = seedFromFaction((window.FACTIONS || {})[factionId]);
    const row = store[factionId];
    const d = deltas || {};
    for (const k of KEYS) {
      if (d[k] != null) row[k] = clamp(row[k] + Number(d[k]));
    }
    // Soft links: raising goodwill slightly lowers spite, and vice versa
    if (d.goodwill > 0 && d.spite == null) {
      row.spite = clamp(row.spite - Math.abs(d.goodwill) * 0.35);
    }
    if (d.spite > 0 && d.goodwill == null) {
      row.goodwill = clamp(row.goodwill - Math.abs(d.spite) * 0.25);
    }
    persist();
    return get(factionId);
  }

  /** Legacy-friendly: change goodwill (and mirror into window.factionRep) */
  function changeGoodwill(factionId, delta) {
    return adjust(factionId, { goodwill: delta });
  }

  /**
   * Rule machine: standings → deal modifiers.
   * Uses goodwill as primary bracket; trust/honour improve fairness;
   * love enables help; spite worsens deals.
   */
  function stance(factionId) {
    const s = get(factionId);
    const g = s.goodwill;
    const trust = s.trust;
    const love = s.love;
    const honour = s.honour;
    const spite = s.spite;

    // Base bracket from goodwill
    let mood;
    let buyMult;
    let sellMult;
    let contractMult;
    let help;
    let tipChance;

    if (g < 25) {
      mood = "hostile";
      buyMult = 1.25;
      sellMult = 0.8;
      contractMult = 0.7;
      help = false;
      tipChance = 0;
    } else if (g < 50) {
      mood = "cool";
      buyMult = 1.1;
      sellMult = 0.95;
      contractMult = 0.9;
      help = false;
      tipChance = 0;
    } else if (g < 75) {
      mood = "fair";
      buyMult = 1.0;
      sellMult = 1.0;
      contractMult = 1.0;
      help = true;
      tipChance = 0.1;
    } else if (g < 90) {
      mood = "friendly";
      buyMult = 0.9;
      sellMult = 1.1;
      contractMult = 1.15;
      help = true;
      tipChance = 0.25;
    } else {
      mood = "allied";
      buyMult = 0.8;
      sellMult = 1.15;
      contractMult = 1.3;
      help = true;
      tipChance = 0.4;
    }

    // Trust → slightly fairer buy/sell toward 1.0
    const trustPull = ((trust - 50) / 50) * 0.06;
    buyMult = Math.max(0.7, buyMult - trustPull);
    sellMult = Math.min(1.35, sellMult + trustPull);

    // Honour → resists extreme gouging (pulls multipliers toward fair)
    if (honour > 60) {
      const h = (honour - 60) / 40;
      buyMult = buyMult + (1 - buyMult) * 0.15 * h;
      sellMult = sellMult + (1 - sellMult) * 0.15 * h;
    }

    // Spite → worse deals, less help
    if (spite > 40) {
      const sp = (spite - 40) / 60;
      buyMult += 0.12 * sp;
      sellMult -= 0.1 * sp;
      contractMult -= 0.15 * sp;
      tipChance *= 1 - 0.8 * sp;
      if (spite > 70) help = false;
    }

    // Love → help + tips only (does not break economy alone)
    if (love < 30) {
      help = help && g >= 75;
      tipChance *= 0.5;
    } else if (love > 70) {
      tipChance = Math.min(0.6, tipChance + 0.15);
      help = true;
    }

    return {
      factionId,
      mood,
      buyMult: Math.round(buyMult * 1000) / 1000,
      sellMult: Math.round(sellMult * 1000) / 1000,
      contractMult: Math.round(Math.max(0.4, contractMult) * 1000) / 1000,
      help: !!help,
      tipChance: Math.round(Math.max(0, tipChance) * 1000) / 1000,
      // hidden raw values (for debugging / future UI)
      _standing: s
    };
  }

  /** Apply stance to a base price when player sells to faction */
  function sellPrice(basePrice, factionId) {
    return Math.max(1, Math.round(Number(basePrice) * stance(factionId).sellMult));
  }

  /** Apply stance when player buys from faction */
  function buyPrice(basePrice, factionId) {
    return Math.max(1, Math.round(Number(basePrice) * stance(factionId).buyMult));
  }

  /** Apply stance to mission/contract reward */
  function contractReward(baseReward, factionId) {
    return Math.max(0, Math.round(Number(baseReward) * stance(factionId).contractMult));
  }

  /**
   * Map a simple reputation delta into the five dimensions.
   * Peaceful dock / trade → goodwill+, trust+, spite-
   * Hostile act → spite+, goodwill-, trust-
   */
  function applyRepEvent(factionId, delta, reason) {
    const d = Number(delta) || 0;
    if (!d) return get(factionId);
    const abs = Math.abs(d);
    if (d > 0) {
      return adjust(factionId, {
        goodwill: d,
        trust: abs * 0.4,
        love: abs * 0.15,
        honour: abs * 0.1,
        spite: -abs * 0.35
      });
    }
    return adjust(factionId, {
      goodwill: d,
      trust: -abs * 0.5,
      love: -abs * 0.2,
      honour: -abs * 0.15,
      spite: abs * 0.6
    });
  }

  window.FactionStanding = {
    KEYS,
    get,
    getAll,
    adjust,
    changeGoodwill,
    stance,
    sellPrice,
    buyPrice,
    contractReward,
    applyRepEvent,
    seedFromFaction,
    ensure,
    persist
  };

  // Auto-init after DOM so GameState / FACTIONS can load first
  function boot() {
    ensure();
    persist();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
