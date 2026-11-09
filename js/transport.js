(() => {
  "use strict";

  const SYSTEMS = (window.UNIVERSE && window.UNIVERSE.SYSTEMS) ? window.UNIVERSE.SYSTEMS : [];

  // Prefer shared catalog from js/data/resources.js; fall back if page did not load it
  const FALLBACK_SHIPS = {
    scout: { name: "Scout", price: 8000, capacity: 5, speed: 1.6, maintenance: 20 },
    courier: { name: "Courier", price: 12000, capacity: 12, speed: 1.4, maintenance: 35 },
    interceptor: { name: "Interceptor", price: 28000, capacity: 8, speed: 1.8, maintenance: 55 },
    hauler: { name: "Hauler", price: 25000, capacity: 40, speed: 1, maintenance: 65 },
    freighter: { name: "Freighter", price: 55000, capacity: 120, speed: 0.75, maintenance: 110 },
    miner: { name: "Mining Rig", price: 42000, capacity: 60, speed: 0.9, maintenance: 90 },
    liner: { name: "Passenger Liner", price: 90000, capacity: 30, speed: 1.1, maintenance: 140 },
    capital: { name: "Capital Ship", price: 250000, capacity: 200, speed: 0.6, maintenance: 300 }
  };
  const SHIP_TYPES = (window.SHIP_TYPES && Object.keys(window.SHIP_TYPES).length)
    ? window.SHIP_TYPES
    : FALLBACK_SHIPS;

  // Use central state if available
  const gs = window.GameState;
  const credits = window.Credits;
  let localJourneys = [];
  let completedContractIds = new Set();
  let nextJourney = 1;

  function getCompanyCredits() {
    if (credits && gs) {
      const company = gs.getCompany("company-1");
      return company ? credits.getCompany(company.id) : 0;
    }
    return window.credits || 0;
  }

  function addCompanyCredits(amount, reason) {
    if (credits && gs) {
      return credits.addCompany("company-1", amount, reason);
    }
    window.credits = (window.credits || 0) + amount;
    return window.credits;
  }

  const starterContracts = [
    { id: "C-101", from: "sol", to: "alpha-cen", cargo: "Machine parts", quantity: 8, reward: 5200, status: "available" },
    { id: "C-102", from: "sirius", to: "vega", cargo: "Research supplies", quantity: 6, reward: 6800, status: "available" },
    { id: "C-103", from: "altair", to: "rigel", cargo: "Refined metals", quantity: 25, reward: 11200, status: "available" },
    { id: "C-104", from: "kepler", to: "sol", cargo: "Ice containers", quantity: 30, reward: 9000, status: "available" },
    { id: "C-105", from: "sol", to: "proxima", cargo: "Science kits", quantity: 5, reward: 7500, status: "available" },
    { id: "C-106", from: "tau-ceti", to: "sol", cargo: "Agricultural samples", quantity: 12, reward: 8400, status: "available" },
    { id: "C-107", from: "epsilon-eri", to: "altair", cargo: "Raw ore", quantity: 40, reward: 13500, status: "available" },
    { id: "C-108", from: "trappist", to: "sol", cargo: "Survey data", quantity: 2, reward: 22000, status: "available" },
    { id: "C-109", from: "barnard", to: "alpha-cen", cargo: "Medical supplies", quantity: 10, reward: 9800, status: "available" },
    { id: "C-110", from: "sol", to: "kepler", cargo: "Fertilizer", quantity: 35, reward: 16000, status: "available" }
  ];

  function getShips() {
    if (gs) return gs.getState().ships || [];
    return [
      { id: "ship-1", name: "Wayfarer", type: "hauler", location: "sol", status: "Idle", owner: "company-1" },
      { id: "ship-2", name: "Swift Courier", type: "courier", location: "sol", status: "Idle", owner: "company-1" }
    ];
  }

  function getContracts() {
    if (gs) {
      const s = gs.getState();
      if (!s.contracts || s.contracts.length === 0) {
        s.contracts = starterContracts.map(c => ({ ...c }));
      }
      return s.contracts.filter(c => c.status === "available" && !completedContractIds.has(c.id));
    }
    return starterContracts.filter(c => !completedContractIds.has(c.id));
  }

  let selectedSystem = "sol";
  const $ = id => document.getElementById(id);
  const money = n => `${Math.round(n).toLocaleString()} cr`;
  const systemName = id => SYSTEMS.find(s => s.id === id)?.name || id;
  const now = () => Date.now();

  function processArrivals() {
    const t = now();
    const ships = getShips();
    for (const j of localJourneys.filter(x => x.status === "In transit" && x.arrivesAt <= t)) {
      if (completedContractIds.has(j.contractId)) continue;
      const ship = ships.find(s => s.id === j.shipId);
      if (!ship) continue;
      ship.location = j.to;
      ship.status = "Idle";
      j.status = "Delivered";
      j.deliveredAt = t;
      addCompanyCredits(j.reward, `Delivery ${j.contractId}`);
      completedContractIds.add(j.contractId);
      if (gs) {
        const s = gs.getState();
        s.player.progression.deliveries = (s.player.progression.deliveries || 0) + 1;
        if (gs.unloadCargo) gs.unloadCargo(j.from, j.cargo, j.quantity);
        if (gs.loadCargo) gs.loadCargo(j.to, j.cargo, j.quantity);
        gs.saveState();
      }
      if (typeof window.msg === "function") {
        window.msg(`${ship.name} delivered ${j.cargo} to ${systemName(j.to)}. +${money(j.reward)}.`);
      }
    }
  }

  function render() {
    processArrivals();
    const ships = getShips();
    const contracts = getContracts();
    const companyBal = getCompanyCredits();
    if ($("credits")) $("credits").textContent = money(companyBal);
    if ($("deliveries")) {
      $("deliveries").textContent = gs
        ? (gs.getState().player.progression.deliveries || 0)
        : completedContractIds.size;
    }
    if ($("savedAt")) $("savedAt").textContent = new Date().toLocaleString();
    if ($("clock")) $("clock").textContent = new Date().toLocaleString();
    if ($("fleetList")) {
      $("fleetList").innerHTML =
        ships
          .map(
            s =>
              `<article class="item"><strong>${esc(s.name)} · ${SHIP_TYPES[s.type]?.name || s.type}</strong><small>${esc(systemName(s.location))} · ${esc(s.status)} · Cap ${SHIP_TYPES[s.type]?.capacity || "?"}</small></article>`
          )
          .join("") || `<p class="muted">No ships owned.</p>`;
    }
    if ($("contractList")) {
      $("contractList").innerHTML =
        contracts
          .map(
            c =>
              `<article class="item"><strong>${esc(c.id)} · ${esc(c.cargo)}</strong><small>${esc(systemName(c.from))} → ${esc(systemName(c.to))}</small><p>${c.quantity} units · Reward ${money(c.reward)}</p></article>`
          )
          .join("") || `<p class="muted">No contracts available.</p>`;
    }
    if ($("journeyList")) {
      $("journeyList").innerHTML =
        localJourneys
          .filter(j => j.status === "In transit")
          .map(
            j =>
              `<article class="item"><strong>${esc(j.shipName)} · ${esc(j.contractId)}</strong><small>${esc(systemName(j.from))} → ${esc(systemName(j.to))}</small><p>${esc(j.cargo)} · Arrives ${new Date(j.arrivesAt).toLocaleString()}</p></article>`
          )
          .join("") || `<p class="muted">No ships currently travelling.</p>`;
    }
    const c = $("contractSelect"),
      oldC = c && c.value;
    if (c) {
      c.innerHTML = contracts
        .map(x => `<option value="${x.id}">${x.id}: ${esc(systemName(x.from))} → ${esc(systemName(x.to))}</option>`)
        .join("");
      if (contracts.some(x => x.id === oldC)) c.value = oldC;
    }
    const s = $("shipSelect"),
      oldS = s && s.value;
    if (s) {
      s.innerHTML = ships
        .filter(x => x.status === "Idle")
        .map(
          x =>
            `<option value="${x.id}">${esc(x.name)} (${SHIP_TYPES[x.type]?.name || x.type}, ${esc(systemName(x.location))})</option>`
        )
        .join("");
      if (ships.some(x => x.id === oldS && x.status === "Idle")) s.value = oldS;
    }
    const st = $("shipType");
    if (st) {
      st.innerHTML = Object.entries(SHIP_TYPES)
        .map(([k, v]) => `<option value="${k}">${v.name} — ${money(v.price)}</option>`)
        .join("");
    }
    drawMap();
  }

  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function drawMap() {
    const canvas = $("galaxyMap");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect(),
      dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width,
      h = rect.height;
    ctx.fillStyle = "#071321";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 120; i++) {
      const x = ((i * 97) % 997) / 997 * w,
        y = ((i * 193) % 991) / 991 * h;
      ctx.fillStyle = "#6685a3";
      ctx.globalAlpha = 0.35;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;
    const links = [
      ["sol", "alpha-cen"],
      ["alpha-cen", "sirius"],
      ["sirius", "vega"],
      ["alpha-cen", "altair"],
      ["altair", "rigel"],
      ["sol", "kepler"],
      ["sirius", "rigel"],
      ["sol", "proxima"],
      ["proxima", "alpha-cen"],
      ["sol", "tau-ceti"],
      ["sol", "epsilon-eri"],
      ["sol", "trappist"],
      ["sol", "barnard"]
    ];
    for (const [a, b] of links) {
      const A = SYSTEMS.find(sys => sys.id === a),
        B = SYSTEMS.find(sys => sys.id === b);
      if (!A || !B) continue;
      ctx.strokeStyle = "#31516e";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(A.x * w, A.y * h);
      ctx.lineTo(B.x * w, B.y * h);
      ctx.stroke();
    }
    for (const sys of SYSTEMS) {
      const x = sys.x * w,
        y = sys.y * h,
        active = selectedSystem === sys.id;
      ctx.beginPath();
      ctx.arc(x, y, active ? 8 : 5, 0, Math.PI * 2);
      ctx.fillStyle = active ? "#8ee0b2" : "#67d7ee";
      ctx.fill();
      if (active) {
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.strokeStyle = "#8ee0b2";
        ctx.stroke();
      }
      ctx.font = "12px system-ui";
      ctx.fillStyle = "#dceaff";
      ctx.fillText(sys.name, x + 11, y - 9);
    }
  }

  if ($("galaxyMap"))
    $("galaxyMap").addEventListener("click", e => {
      const r = e.currentTarget.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width,
        y = (e.clientY - r.top) / r.height;
      let nearest = null,
        best = 0.04;
      for (const sys of SYSTEMS) {
        const d = Math.hypot(sys.x - x, sys.y - y);
        if (d < best) {
          best = d;
          nearest = sys;
        }
      }
      if (nearest) {
        selectedSystem = nearest.id;
        drawMap();
      }
    });

  if ($("buyShipForm"))
    $("buyShipForm").addEventListener("submit", e => {
      e.preventDefault();
      const type = $("shipType").value,
        def = SHIP_TYPES[type];
      if (!def) {
        alert("Unknown ship type.");
        return;
      }
      const bal = getCompanyCredits();
      if (bal < def.price) {
        alert("Not enough company credits.");
        return;
      }
      addCompanyCredits(-def.price, `Purchased ${def.name}`);
      const newShip = {
        id: `ship-${Date.now()}`,
        name: `${def.name} ${Math.floor(Math.random() * 100)}`,
        type,
        location: "sol",
        status: "Idle",
        owner: "company-1",
        condition: 100,
        cargo: []
      };
      if (gs && gs.addShip) gs.addShip(newShip);
      else getShips().push(newShip);
      if (typeof window.msg === "function") window.msg(`Purchased ${def.name} for ${money(def.price)}.`);
      render();
    });

  if ($("routeForm"))
    $("routeForm").addEventListener("submit", e => {
      e.preventDefault();
      const contracts = getContracts();
      const ships = getShips();
      const contract = contracts.find(c => c.id === $("contractSelect").value);
      const ship = ships.find(s => s.id === $("shipSelect").value && s.status === "Idle");
      if (!contract || !ship) {
        alert("Choose an available contract and idle ship.");
        return;
      }
      if (ship.location !== contract.from) {
        alert(
          `${ship.name} is at ${systemName(ship.location)}. This contract starts at ${systemName(contract.from)}.`
        );
        return;
      }
      if (contract.quantity > (SHIP_TYPES[ship.type]?.capacity || 0)) {
        alert("This ship does not have enough cargo capacity.");
        return;
      }
      const duration = Math.max(45000, 90000 / (SHIP_TYPES[ship.type]?.speed || 1)),
        arrivesAt = now() + duration;
      ship.status = "In transit";
      localJourneys.push({
        id: nextJourney++,
        contractId: contract.id,
        shipId: ship.id,
        shipName: ship.name,
        from: contract.from,
        to: contract.to,
        cargo: contract.cargo,
        quantity: contract.quantity,
        reward: contract.reward,
        departedAt: now(),
        arrivesAt,
        status: "In transit"
      });
      if (typeof window.msg === "function") window.msg(`${ship.name} dispatched on ${contract.id}.`);
      render();
    });

  if ($("resetDemo"))
    $("resetDemo").addEventListener("click", () => {
      if (!confirm("Reset this browser's transport demo save?")) return;
      if (window.SaveManager) window.SaveManager.clear();
      localStorage.removeItem("spacePack.transportPrototype.v2");
      location.reload();
    });

  window.addEventListener("resize", drawMap);
  window.renderTransport = render;
  render();
  setInterval(render, 12000);
})();
