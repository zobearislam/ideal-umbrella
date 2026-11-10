/**
 * NPC trading companies: 2–12 ships each, autonomous deliveries around the map,
 * expensive buyouts for the player.
 */
(function () {
  "use strict";

  var CARGO_POOL = [
    "iron", "ice", "fuel", "alloy", "circuit", "crystal", "titanium",
    "oxygen", "hydrogen", "fertilizer", "plastic", "gold"
  ];
  var TYPE_POOL = ["scout", "courier", "hauler", "freighter", "miner", "interceptor"];
  var CARGO_WEIGHT = { scout: 1, courier: 2, interceptor: 1, hauler: 4, freighter: 5, miner: 3, liner: 2, capital: 3 };

  var TEMPLATES = [
    {
      id: "npc-solhaul",
      name: "Sol Haul Lines",
      faction: "terran",
      shipMin: 5,
      shipMax: 9,
      home: "sol",
      credits: 180000,
      markup: 2.8
    },
    {
      id: "npc-redline",
      name: "Redline Logistics",
      faction: "martian",
      shipMin: 3,
      shipMax: 7,
      home: "sol",
      credits: 110000,
      markup: 2.6
    },
    {
      id: "npc-orestream",
      name: "Orestream Collective",
      faction: "belt",
      shipMin: 4,
      shipMax: 10,
      home: "sol",
      credits: 95000,
      markup: 2.5
    },
    {
      id: "npc-jovgas",
      name: "Jovian Gas & Freight",
      faction: "jovian",
      shipMin: 6,
      shipMax: 12,
      home: "sol",
      credits: 240000,
      markup: 3.0
    },
    {
      id: "npc-outerlink",
      name: "Outer Link Shipping",
      faction: "outer",
      shipMin: 2,
      shipMax: 5,
      home: "sol",
      credits: 70000,
      markup: 2.4
    },
    {
      id: "npc-blacklane",
      name: "Blacklane Runners",
      faction: "pirate",
      shipMin: 2,
      shipMax: 6,
      home: "sol",
      credits: 150000,
      markup: 3.2
    }
  ];

  function systems() {
    if (window.UNIVERSE && window.UNIVERSE.SYSTEMS && window.UNIVERSE.SYSTEMS.length) {
      return window.UNIVERSE.SYSTEMS.map(function (s) {
        return s.id;
      });
    }
    return ["sol", "alpha-cen", "sirius", "vega", "altair", "rigel", "kepler", "proxima", "tau-ceti"];
  }

  function shipPrice(type) {
    var T = window.SHIP_TYPES && window.SHIP_TYPES[type];
    return T && T.price ? T.price : 25000;
  }

  function shipName(companyName, type, n) {
    var prefixes = {
      scout: "Probe",
      courier: "Dash",
      hauler: "Barge",
      freighter: "Bulk",
      miner: "Drill",
      interceptor: "Fang",
      liner: "Lark",
      capital: "Flag"
    };
    return (prefixes[type] || "Vessel") + " " + companyName.split(" ")[0] + "-" + n;
  }

  function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function weightedType() {
    var bag = [];
    TYPE_POOL.forEach(function (t) {
      var w = CARGO_WEIGHT[t] || 1;
      for (var i = 0; i < w; i++) bag.push(t);
    });
    return pick(bag);
  }

  function ensureSeeded() {
    if (!window.GameState) return;
    var st = window.GameState.getState();
    st.companies = st.companies || [];
    st.ships = st.ships || [];
    st.npcJourneys = st.npcJourneys || [];
    st.nextNpcSerial = st.nextShipSerial || 100;

    var existingNpc = {};
    st.companies.forEach(function (c) {
      existingNpc[c.id] = true;
    });

    TEMPLATES.forEach(function (tpl) {
      if (existingNpc[tpl.id]) return;
      var count = randInt(tpl.shipMin, tpl.shipMax);
      var shipIds = [];
      for (var i = 0; i < count; i++) {
        var type = weightedType();
        var id = "npcship-" + tpl.id + "-" + (i + 1);
        st.nextShipSerial++;
        var ship = {
          id: id,
          name: shipName(tpl.name, type, i + 1),
          type: type,
          owner: tpl.id,
          location: pick(systems()),
          status: "Idle",
          condition: 85 + randInt(0, 15),
          cargo: [],
          passengers: 0,
          npc: true
        };
        if (!st.ships.some(function (s) {
          return s.id === id;
        })) {
          st.ships.push(ship);
        }
        shipIds.push(id);
      }
      st.companies.push({
        id: tpl.id,
        name: tpl.name,
        faction: tpl.faction,
        credits: tpl.credits,
        ships: shipIds,
        stations: [],
        npc: true,
        forSale: true,
        markup: tpl.markup,
        home: tpl.home,
        deliveries: 0
      });
      if (window.Credits) {
        window.Credits.setCompany(tpl.id, tpl.credits);
      }
    });

    // Keep player company flagged
    var player = st.companies.find(function (c) {
      return c.id === "company-1";
    });
    if (player) {
      player.npc = false;
      player.forSale = false;
    }

    if (window.GameState.saveState) window.GameState.saveState();
  }

  function companyShips(companyId) {
    if (!window.GameState) return [];
    return (window.GameState.getState().ships || []).filter(function (s) {
      return s.owner === companyId;
    });
  }

  function valuation(companyId) {
    var co = window.GameState && window.GameState.getCompany(companyId);
    if (!co || !co.npc) return 0;
    var ships = companyShips(companyId);
    var fleetValue = ships.reduce(function (sum, s) {
      return sum + shipPrice(s.type) * ((s.condition || 100) / 100);
    }, 0);
    var cash = window.Credits ? window.Credits.getCompany(companyId) : co.credits || 0;
    var markup = co.markup || 2.5;
    // Expensive: fleet + cash, times markup, plus a takeover premium
    var premium = 75000 + ships.length * 15000;
    return Math.round(fleetValue * markup + cash + premium);
  }

  function listNpc() {
    if (!window.GameState) return [];
    return (window.GameState.getState().companies || [])
      .filter(function (c) {
        return c.npc;
      })
      .map(function (c) {
        var ships = companyShips(c.id);
        return {
          id: c.id,
          name: c.name,
          faction: c.faction,
          forSale: c.forSale !== false && !c.acquired,
          shipCount: ships.length,
          credits: window.Credits ? window.Credits.getCompany(c.id) : c.credits || 0,
          deliveries: c.deliveries || 0,
          price: valuation(c.id),
          ships: ships.map(function (s) {
            return {
              id: s.id,
              name: s.name,
              type: s.type,
              location: s.location,
              status: s.status
            };
          })
        };
      });
  }

  function buyCompany(companyId, payFrom) {
    payFrom = payFrom || "company";
    if (!window.GameState) return { ok: false, error: "No GameState" };
    var st = window.GameState.getState();
    var co = st.companies.find(function (c) {
      return c.id === companyId;
    });
    if (!co || !co.npc) return { ok: false, error: "Not an NPC company" };
    if (co.acquired || co.forSale === false) return { ok: false, error: "Not for sale" };

    var price = valuation(companyId);
    var payerBal = 0;
    if (payFrom === "personal" && window.Credits) {
      payerBal = window.Credits.getPersonal();
    } else if (window.Credits) {
      payerBal = window.Credits.getCompany("company-1");
    }

    if (payerBal < price) {
      return {
        ok: false,
        error: "Need " + price.toLocaleString() + " cr (have " + Math.round(payerBal).toLocaleString() + ")",
        price: price
      };
    }

    // Charge player
    if (payFrom === "personal" && window.Credits) {
      window.Credits.setPersonal(payerBal - price);
      if (window.Credits.record) window.Credits.record("personal", -price, "Acquired " + co.name);
    } else if (window.Credits) {
      window.Credits.addCompany("company-1", -price, "Acquired " + co.name);
    }

    // Absorb NPC cash into player company
    var npcCash = window.Credits ? window.Credits.getCompany(companyId) : co.credits || 0;
    if (window.Credits && npcCash > 0) {
      window.Credits.addCompany("company-1", npcCash, "Treasury from " + co.name);
      window.Credits.setCompany(companyId, 0);
    }

    // Transfer ships
    var player = st.companies.find(function (c) {
      return c.id === "company-1";
    });
    st.ships.forEach(function (s) {
      if (s.owner === companyId) {
        s.owner = "company-1";
        s.npc = false;
        if (player && player.ships.indexOf(s.id) < 0) player.ships.push(s.id);
      }
    });

    co.acquired = true;
    co.forSale = false;
    co.npc = true; // keep history flag
    co.ownedBy = "company-1";
    co.ships = [];
    co.credits = 0;

    // Cancel in-flight NPC journeys for those ships (they continue as player-owned idle)
    st.npcJourneys = (st.npcJourneys || []).filter(function (j) {
      if (j.companyId !== companyId) return true;
      var ship = st.ships.find(function (s) {
        return s.id === j.shipId;
      });
      if (ship) {
        ship.status = "Idle";
        ship.location = j.to || ship.location;
      }
      return false;
    });

    if (window.GameState.saveState) window.GameState.saveState();
    if (typeof window.msg === "function") {
      window.msg("Acquired " + co.name + " for " + price.toLocaleString() + " cr");
    }
    return { ok: true, price: price, name: co.name };
  }

  function dispatchNpc(company) {
    var st = window.GameState.getState();
    var ships = companyShips(company.id).filter(function (s) {
      return s.status === "Idle";
    });
    if (!ships.length) return;

    // Dispatch up to half of idle ships each tick wave
    var n = Math.max(1, Math.floor(ships.length * 0.4));
    var sys = systems();
    if (sys.length < 2) return;

    for (var i = 0; i < n; i++) {
      var ship = ships[i];
      if (!ship) break;
      var from = ship.location || pick(sys);
      var to = pick(sys);
      var guard = 0;
      while (to === from && guard++ < 8) to = pick(sys);

      var def = (window.SHIP_TYPES && window.SHIP_TYPES[ship.type]) || { capacity: 20, speed: 1 };
      var qty = Math.max(1, Math.min(def.capacity || 20, randInt(2, Math.max(3, Math.floor((def.capacity || 20) * 0.6)))));
      var cargo = pick(CARGO_POOL);
      var speed = def.speed || 1;
      var duration = Math.max(25000, Math.round(70000 / speed));
      // Slight randomness
      duration = Math.round(duration * (0.85 + Math.random() * 0.4));

      var reward = Math.round(qty * (30 + Math.random() * 40) * (1 + speed * 0.15));

      ship.status = "In transit";
      ship.location = from;

      st.npcJourneys.push({
        id: "nj-" + Date.now() + "-" + Math.floor(Math.random() * 9999),
        companyId: company.id,
        shipId: ship.id,
        shipName: ship.name,
        from: from,
        to: to,
        cargo: cargo,
        quantity: qty,
        reward: reward,
        departedAt: Date.now(),
        arrivesAt: Date.now() + duration,
        status: "In transit"
      });
    }
  }

  function processArrivals() {
    if (!window.GameState) return;
    var st = window.GameState.getState();
    st.npcJourneys = st.npcJourneys || [];
    var t = Date.now();
    var changed = false;

    st.npcJourneys.forEach(function (j) {
      if (j.status !== "In transit" || j.arrivesAt > t) return;
      var ship = st.ships.find(function (s) {
        return s.id === j.shipId;
      });
      if (ship) {
        ship.location = j.to;
        ship.status = "Idle";
      }
      j.status = "Delivered";
      j.deliveredAt = t;

      // Stock destination warehouse (shared economy)
      if (window.GameState.loadCargo) {
        window.GameState.loadCargo(j.to, j.cargo, j.quantity);
      }

      var co = st.companies.find(function (c) {
        return c.id === j.companyId;
      });
      if (co) {
        co.deliveries = (co.deliveries || 0) + 1;
        if (window.Credits) {
          window.Credits.addCompany(co.id, j.reward, "NPC delivery " + j.cargo);
        } else {
          co.credits = (co.credits || 0) + j.reward;
        }
      }
      changed = true;
    });

    // Prune old delivered
    if (st.npcJourneys.length > 80) {
      st.npcJourneys = st.npcJourneys.filter(function (j) {
        return j.status === "In transit" || (j.deliveredAt && t - j.deliveredAt < 120000);
      });
    }

    if (changed && window.GameState.saveState) window.GameState.saveState();
  }

  function tick() {
    if (!window.GameState) return;
    ensureSeeded();
    processArrivals();
    var st = window.GameState.getState();
    (st.companies || []).forEach(function (co) {
      if (!co.npc || co.acquired) return;
      // Only dispatch if some ships idle
      var idle = companyShips(co.id).filter(function (s) {
        return s.status === "Idle";
      }).length;
      if (idle > 0 && Math.random() < 0.55) dispatchNpc(co);
    });
    if (window.GameState.saveState) window.GameState.saveState();
  }

  function activeJourneys() {
    if (!window.GameState) return [];
    return (window.GameState.getState().npcJourneys || []).filter(function (j) {
      return j.status === "In transit";
    });
  }

  // Boot
  function boot() {
    ensureSeeded();
    processArrivals();
    // Economy tick every 20s
    setInterval(tick, 20000);
    // First wave soon
    setTimeout(tick, 2500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.NpcCompanies = {
    list: listNpc,
    valuation: valuation,
    buy: buyCompany,
    tick: tick,
    activeJourneys: activeJourneys,
    companyShips: companyShips,
    ensureSeeded: ensureSeeded,
    TEMPLATES: TEMPLATES
  };
})();
