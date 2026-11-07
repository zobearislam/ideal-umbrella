/* =====================================================================
   Space Pack — Economy & Reputation Edition
   Stations around bodies, multi-system, buy ships, hire pilots,
   abstract defense weapons + reputation.
   ===================================================================== */

const O = (id, name, kind, parent, r, a, P, color, x) =>
  Object.assign({ id, name, kind, parent, r, a, P, color }, x);

const ISS_MODEL = [
  ["box", [54, 8.7, 8.7], [0, 0, 0], 0xcccccc],
  ["box", [6.5, 6.5, 73], [0, 0, 0], 0xcccccc],
  ["box", [11, 0.4, 24], [-16, 0, -33], 0x2a4a9a],
  ["box", [11, 0.4, 24], [16, 0, -33], 0x2a4a9a],
  ["box", [11, 0.4, 24], [-16, 0, 33], 0x2a4a9a],
  ["box", [11, 0.4, 24], [16, 0, 33], 0x2a4a9a]
];

const STATION_MODEL = [
  ["cyl", [20, 8, 20], [0, 0, 0], 0x8899aa],
  ["box", [40, 4, 6], [0, 6, 0], 0x667788],
  ["box", [6, 12, 6], [0, -4, 0], 0x556677]
];

// Factions and Corporations
const FACTIONS = {
  solfed: { name: "Sol Federation", color: 0x4aa3d8, desc: "Earth-led alliance" },
  alphaco: { name: "Alpha Cooperative", color: 0xffaa66, desc: "Alpha Centauri trade group" },
  siriusmin: { name: "Sirius Mining Corp", color: 0xaaccff, desc: "Resource extraction" },
  independent: { name: "Independent", color: 0xcccccc, desc: "Unaffiliated" }
};

// ===================== Resources Module =====================
// Add new resources here: id, name, icon
const RESOURCES = {
  // Basic / previous
  iron:    { id: "iron",    name: "Iron Ore",    icon: "🪨" },
  fuel:    { id: "fuel",    name: "Fuel Cell",   icon: "⛽" },
  crystal: { id: "crystal", name: "Crystal",     icon: "💎" },
  alloy:   { id: "alloy",   name: "Alloy",       icon: "⚙️" },
  circuit: { id: "circuit", name: "Circuit",     icon: "🔌" },
  ice:     { id: "ice",     name: "Ice",         icon: "🧊" },

  // Tape: Resource (refined & advanced)
  refined_iron:      { id: "refined_iron",      name: "Refined Iron",       icon: "assets/resources/refined_iron.png" },
  refined_gold:      { id: "refined_gold",      name: "Refined Gold",       icon: "assets/resources/refined_gold.png" },
  refined_titanium:  { id: "refined_titanium",  name: "Refined Titanium",   icon: "assets/resources/refined_titanium.png" },
  refined_uranium:   { id: "refined_uranium",   name: "Refined Uranium",    icon: "assets/resources/refined_uranium.png" },
  refined_copper:    { id: "refined_copper",    name: "Refined Copper",     icon: "assets/resources/refined_copper.png" },
  refined_aluminium: { id: "refined_aluminium", name: "Refined Aluminium",  icon: "assets/resources/refined_aluminium.png" },
  pure_silicon:      { id: "pure_silicon",      name: "Pure Silicon",       icon: "assets/resources/pure_silicon.png" },
  liquid_oxygen:     { id: "liquid_oxygen",     name: "Liquid Oxygen",      icon: "assets/resources/liquid_oxygen.png" },
  liquid_hydrogen:   { id: "liquid_hydrogen",   name: "Liquid Hydrogen",    icon: "assets/resources/liquid_hydrogen.png" },
  cellulose_quartz:  { id: "cellulose_quartz",  name: "Cellulose (Quartz)", icon: "assets/resources/cellulose_quartz.png" },
  fertilizer:        { id: "fertilizer",        name: "Fertilizer",         icon: "assets/resources/fertilizer.png" },
  plastic:           { id: "plastic",           name: "Plastic",            icon: "assets/resources/plastic.png" }
};

// Crafting table: list of recipes
// Each recipe: inputs (array of resource IDs) → output resource ID
const CRAFTING_RECIPES = [
  { id: "smelt-alloy",    name: "Smelt Alloy",     inputs: ["iron", "fuel"],    output: "alloy" },
  { id: "make-circuit",   name: "Build Circuit",   inputs: ["crystal", "iron"], output: "circuit" },
  { id: "refine-fuel",    name: "Refine Fuel",     inputs: ["ice", "crystal"],  output: "fuel" },
  { id: "refine-iron",    name: "Refine Iron",     inputs: ["iron", "fuel"],    output: "refined_iron" },
  { id: "make-plastic",   name: "Make Plastic",    inputs: ["cellulose_quartz", "fuel"], output: "plastic" },
  { id: "silicon-circuit",name: "Silicon Circuit", inputs: ["pure_silicon", "refined_copper"], output: "circuit" }
];

// Player inventory (resource id → amount)
const inventory = {
  iron: 8,
  fuel: 12,
  crystal: 3,
  ice: 5,
  refined_iron: 2,
  refined_gold: 1,
  pure_silicon: 1,
  plastic: 3
};

function getResource(id) {
  return RESOURCES[id] || { id, name: id, icon: "📦" };
}

function iconHtml(icon, size) {
  size = size || 28;
  if (!icon) return "";
  if (String(icon).includes(".png") || String(icon).startsWith("assets/")) {
    return '<img src="' + icon + '" alt="" style="width:' + size + 'px;height:' + size + 'px;vertical-align:middle;border-radius:4px;object-fit:contain;background:#222">';
  }
  return icon;
}


function canCraft(recipe) {
  return recipe.inputs.every(id => (inventory[id] || 0) >= 1);
}

function craft(recipe) {
  if (!canCraft(recipe)) {
    msg("Not enough materials for " + recipe.name);
    return false;
  }
  // Consume inputs
  for (const id of recipe.inputs) {
    inventory[id] = (inventory[id] || 0) - 1;
  }
  // Add output
  inventory[recipe.output] = (inventory[recipe.output] || 0) + 1;
  const out = getResource(recipe.output);
  msg("Crafted " + out.name);
  return true;
}

function inventoryText() {
  return Object.entries(inventory)
    .filter(([_, n]) => n > 0)
    .map(([id, n]) => {
      const r = getResource(id);
      return iconHtml(r.icon, 22) + " " + r.name + " ×" + n;
    })
    .join("  ·  ") || "Empty";
}


// Gates: pairs that connect two locations
const GATES = [
  { id: "gate-earth-alpha", name: "Earth–Alpha Gate", parent: "earth", a: 12000, P: 0.5, dest: "gate-alpha-earth", faction: "solfed" },
  { id: "gate-alpha-earth", name: "Alpha–Earth Gate", parent: "alpha-cen", a: 80000, P: 0.8, dest: "gate-earth-alpha", faction: "alphaco" },
  { id: "gate-earth-sirius", name: "Earth–Sirius Gate", parent: "earth", a: 15000, P: 0.6, dest: "gate-sirius-earth", faction: "solfed" },
  { id: "gate-sirius-earth", name: "Sirius–Earth Gate", parent: "sirius", a: 90000, P: 1.2, dest: "gate-earth-sirius", faction: "siriusmin" },
  { id: "gate-mars-jupiter", name: "Mars–Jupiter Gate", parent: "mars", a: 8000, P: 0.4, dest: "gate-jupiter-mars", faction: "solfed" },
  { id: "gate-jupiter-mars", name: "Jupiter–Mars Gate", parent: "jupiter", a: 200000, P: 2.0, dest: "gate-mars-jupiter", faction: "independent" },

  // Five gates orbiting Sol at ~40 AU (Transport Tycoon style outer gates)
  { id: "sol-gate-1", name: "Sol Gate 1", parent: "sun", a: 40 * 149.6e6, P: 365 * 40, dest: "sol-gate-2", faction: "solfed" },
  { id: "sol-gate-2", name: "Sol Gate 2", parent: "sun", a: 40 * 149.6e6, P: 365 * 40, dest: "sol-gate-3", faction: "solfed" },
  { id: "sol-gate-3", name: "Sol Gate 3", parent: "sun", a: 40 * 149.6e6, P: 365 * 40, dest: "sol-gate-4", faction: "independent" },
  { id: "sol-gate-4", name: "Sol Gate 4", parent: "sun", a: 40 * 149.6e6, P: 365 * 40, dest: "sol-gate-5", faction: "siriusmin" },
  { id: "sol-gate-5", name: "Sol Gate 5", parent: "sun", a: 40 * 149.6e6, P: 365 * 40, dest: "sol-gate-1", faction: "alphaco" },
];


// ===================== Tethers Module =====================
// Equatorial space elevators / tethers. Earth has 4 equidistant.
// Luna has 3. Jupiter has 5 at ~1500 km. Others get 2-4 by default.
const TETHER_CONFIG = {
  earth:  { count: 4, altitude: 36000, name: "Earth Tether" },   // GEO-ish
  moon:   { count: 3, altitude: 10000, name: "Luna Tether" },
  jupiter:{ count: 5, altitude: 1500,  name: "Jupiter Tether" }, // as noted ~1500 km
  mars:   { count: 3, altitude: 8000,  name: "Mars Tether" },
  saturn: { count: 4, altitude: 20000, name: "Saturn Tether" },
  venus:  { count: 2, altitude: 5000,  name: "Venus Tether" }
};

const TETHER_MODEL = [
  ["cyl", [0.8, 40, 0.8], [0, 20, 0], 0x88aacc],   // cable
  ["box", [4, 2, 4], [0, 42, 0], 0xccccdd],         // top station
  ["box", [3, 1.5, 3], [0, 0, 0], 0x556677]         // base / hook
];

function generateTethers() {
  const tethers = [];
  for (const [bodyId, cfg] of Object.entries(TETHER_CONFIG)) {
    const body = PACK.objects.find(o => o.id === bodyId);
    if (!body) continue;
    const count = cfg.count;
    const alt = cfg.altitude; // km above surface roughly
    const baseA = (body.r || 1000) + alt;
    for (let i = 0; i < count; i++) {
      const phase = (i / count) * Math.PI * 2;
      tethers.push(O(
        bodyId + "-tether-" + (i + 1),
        cfg.name + " " + (i + 1),
        "tether",
        bodyId,
        0.06,
        baseA,
        (body.P || 1) * 0.05,
        0x66aaff,
        {
          model: TETHER_MODEL,
          tether: true,
          phase: phase,
          equatorial: true,
          faction: body.parent === "alpha-cen" ? "alphaco" : "solfed"
        }
      ));
    }
  }
  return tethers;
}

const GATE_MODEL = [
  ["torus", [8, 0.6, 16], [0, 0, 0], 0x66ccff],
  ["box", [1, 1, 1], [0, 0, 0], 0xffffff]
];


const PACK = {
  terms: { vehicle: "Ship", pilot: "Pilot", unit: "Cargo", liquid: "Fuel" },
  scale: 0.1,
  start: { ship: "scout", near: "iss", offset: [0.15, 0.05, 0.25] },
  ships: {
    scout: {
      name: "Scout", color: 0xc9d1d9, price: 25000, hull: [4, 3, 12],
      specs: { maxSpeed: 1e7, turn: 0.8, evaThrust: 0.003, walk: 3, crew: 2, cargo: 20, weapon: 8 },
      parts: [
        ["box", [6, 0.2, 3], [-4, 1.5, 1.5], 0xaab4be],
        ["box", [6, 0.2, 3], [4, 1.5, 1.5], 0xaab4be],
        ["box", [2, 1.5, 1.5], [0, 1.5, 7], 0x333333],
        ["box", [1, 1, 1], [1.3, 0.5, 0], 0x8a6a3a],
        ["box", [1, 1, 1], [-1.3, 0.5, 2], 0x8a6a3a]
      ]
    },
    freighter: {
      name: "Freighter", color: 0xb5895a, price: 85000, hull: [8, 5, 40],
      specs: { maxSpeed: 3e5, turn: 0.25, evaThrust: 0.003, walk: 3, crew: 6, cargo: 400, weapon: 4 },
      parts: [
        ["box", [3, 3, 8], [0, 2.5, 24], 0x333333],
        ["cyl", [3, 12, 3], [-5.5, 2.5, -4], 0x6b7a89],
        ["cyl", [3, 12, 3], [5.5, 2.5, -4], 0x6b7a89],
        ["box", [2, 1, 2], [0, 0.5, -8], 0x8a6a3a]
      ]
    },
    interceptor: {
      name: "Interceptor", color: 0xff6644, price: 45000, hull: [3, 2.5, 9],
      specs: { maxSpeed: 2e7, turn: 1.2, evaThrust: 0.004, walk: 3, crew: 1, cargo: 5, weapon: 14 },
      parts: [
        ["box", [1.5, 0.4, 4], [0, 0.8, 2], 0x333333],
        ["box", [4, 0.15, 2], [-2, 0.6, 0], 0xffaa66]
      ]
    }
  },
  objects: [
    // Sol system
    O("sun", "Sun", "star", null, 696340, 0, 0, 0xffd36b),
    O("mercury", "Mercury", "planet", "sun", 2439.7, 57.9e6, 87.97, 0xa8a095),
    O("venus", "Venus", "planet", "sun", 6051.8, 108.2e6, 224.7, 0xe3c27a),
    O("earth", "Earth", "planet", "sun", 6371, 149.6e6, 365.25, 0x2f6fd8),
    O("moon", "Moon", "moon", "earth", 1737.4, 384400, 27.32, 0xb5b5b5, { inc: 0.09 }),
    O("iss", "ISS", "station", "earth", 0.0545, 6779, 0.0645, 0xffffff, { inc: 0.9, model: ISS_MODEL }),
    O("mars", "Mars", "planet", "sun", 3389.5, 227.9e6, 687, 0xc8593a),
    O("jupiter", "Jupiter", "planet", "sun", 69911, 778.5e6, 4332.6, 0xd2a77c),
    O("io", "Io", "moon", "jupiter", 1821.6, 421700, 1.769, 0xe6d36a),
    O("europa", "Europa", "moon", "jupiter", 1560.8, 671100, 3.551, 0xd8c9b0),
    O("ganymede", "Ganymede", "moon", "jupiter", 2634.1, 1070400, 7.155, 0x9a8f84),
    O("callisto", "Callisto", "moon", "jupiter", 2410.3, 1882700, 16.69, 0x6e6359),
    O("saturn", "Saturn", "planet", "sun", 58232, 1432e6, 10759, 0xe3d19a, { ring: true }),
    O("titan", "Titan", "moon", "saturn", 2574.7, 1221870, 15.945, 0xd9a441),
    O("uranus", "Uranus", "planet", "sun", 25362, 2867e6, 30687, 0x8fd8e0),
    O("neptune", "Neptune", "planet", "sun", 24622, 4515e6, 60190, 0x3f62d9),
    O("triton", "Triton", "moon", "neptune", 1353.4, 354759, -5.877, 0xcdbfc0),

    // Alpha Centauri
    O("alpha-cen", "Alpha Centauri", "star", null, 850000, 0, 0, 0xffaa66, { offset: [4.3e9, 0.2e9, 1.1e9] }),
    O("proxima-b", "Proxima b", "planet", "alpha-cen", 7200, 0.05e9, 11.2, 0xcc8866),
    O("alpha-c", "Alpha C", "planet", "alpha-cen", 11000, 0.18e9, 42, 0x8899cc),

    // Sirius
    O("sirius", "Sirius", "star", null, 1200000, 0, 0, 0xaaccff, { offset: [-8.6e9, -0.4e9, 2.3e9] }),
    O("sirius-b-planet", "Sirius I", "planet", "sirius", 8900, 0.12e9, 28, 0xddccaa),
    O("sirius-ii", "Sirius II", "planet", "sirius", 14000, 0.35e9, 95, 0x66aa88)
  ]
};

// Auto-generate stations around planets, large moons, and a few around Sol
function generateStations() {
  const stations = [];
  const bodies = PACK.objects.filter(o => o.kind === "planet" || (o.kind === "moon" && o.r > 1500));
  const factionCycle = ["solfed", "solfed", "independent", "siriusmin", "alphaco"];
  bodies.forEach((body, i) => {
    const a = (body.r || 1000) * 1.8;
    const fac = body.parent === "alpha-cen" ? "alphaco" :
                body.parent === "sirius" ? "siriusmin" :
                factionCycle[i % factionCycle.length];
    stations.push(O(
      body.id + "-station",
      body.name + " Station",
      "station",
      body.id,
      0.08,
      a,
      (body.P || 1) * 0.15,
      0xccccdd,
      { model: STATION_MODEL, station: true, faction: fac }
    ));
  });
  [0.8e9, 2.2e9, 5.5e9].forEach((a, i) => {
    stations.push(O(
      "sol-station-" + i,
      "Sol Station " + (i + 1),
      "station",
      "sun",
      0.12,
      a,
      365 * (i + 2),
      0xddddcc,
      { model: STATION_MODEL, station: true, faction: i === 2 ? "independent" : "solfed" }
    ));
  });
  return stations;
}

// Add gates as objects
function generateGates() {
  return GATES.map(g => O(
    g.id, g.name, "gate", g.parent, 0.04, g.a, g.P, 0x66ccff,
    { model: GATE_MODEL, gate: true, dest: g.dest, faction: g.faction }
  ));
}
PACK.objects.push(...generateStations());
PACK.objects.push(...generateTethers());
PACK.objects.push(...generateGates());

// ---------------- engine ----------------
const S = PACK.scale;
const B = {};
const list = [];

PACK.objects.forEach((o, i) => {
  const real = o.kind === "station" || o.kind === "ship" || o.kind === "tether";
  const sh = o.ship && PACK.ships[o.ship];
  const b = Object.assign({ a: 0, P: 0, inc: 0, ph: (i * 2.399) % 6.283, pos: [0, 0, 0] }, o);
  if (o.offset) {
    b.pos = o.offset.map(v => v * S);
  }
  b.r = real ? (o.r || (sh ? sh.hull[2] / 2000 : 0.02)) : o.r * S;
  b.a = (o.a || 0) * S;
  B[o.id] = b;
  list.push(b);
});

const STAR = list.find(b => b.kind === "star" && b.id === "sun");

const renderer = new THREE.WebGLRenderer({ antialias: false, logarithmicDepthBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.00005, 1e10);
scene.add(camera, new THREE.AmbientLight(0xffffff, 0.12));

const SHP = {
  box: () => new THREE.BoxGeometry(1, 1, 1),
  sphere: () => new THREE.SphereGeometry(0.5, 16, 12),
  cyl: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 16),
  torus: () => new THREE.TorusGeometry(1, 0.08, 8, 32)
};

function partsGroup(parts, g) {
  g = g || new THREE.Group();
  for (const [sh, s, p, c] of parts) {
    const m = new THREE.Mesh(SHP[sh](), new THREE.MeshStandardMaterial({ color: c, roughness: 0.7 }));
    m.scale.set(s[0], s[1], s[2]);
    m.position.set(p[0], p[1], p[2]);
    g.add(m);
  }
  return g;
}

function buildShip(T, g, lamp) {
  const w = T.hull[0], h = T.hull[1], l = T.hull[2];
  const BS = THREE.BackSide;
  const gl = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
  const mk = (c, s) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, side: s || THREE.FrontSide });
  const dh = Math.min(2.2, h - 0.3);

  const box = (sx, sy, sz, x, y, z, m) => {
    const k = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), m);
    k.position.set(x, y, z);
    g.add(k);
  };

  box(w, h, l, 0, h / 2, 0, [mk(0x8a99aa, BS), mk(0x8a99aa, BS), mk(0x56636f, BS), mk(0x2d343c, BS), mk(0x8a99aa, BS), gl]);
  if (!T.hideShell) box(w + 0.3, h + 0.3, l + 0.3, 0, h / 2, 0, [0, 1, 2, 3, 4].map(() => mk(T.color || 0xc9d1d9)).concat([gl]));
  box(1.2, dh, 0.05, 0, dh / 2, l / 2 - 0.05, mk(0x2fbf71));
  box(1, 0.6, 1, 0, 0.3, -l / 2 + 1.5, mk(0x444c55));
  box(w - 1, 0.8, 0.5, 0, 0.9, -l / 2 + 0.4, mk(0x444c55));
  partsGroup(T.parts || [], g);

  const src = T._up ? T._up.buf : T.link;
  const tok = g.userData.tok;
  if (src) {
    loadModel(src, T._up ? T._up.name : T.link, o => {
      if (g.userData.tok !== tok) return;
      if (T.pos) o.position.set(T.pos[0], T.pos[1], T.pos[2]);
      if (T.scale) o.scale.multiplyScalar(T.scale);
      g.add(o);
    });
  }
  if (lamp) {
    const L = new THREE.PointLight(0xffffff, 1, 0.03 + l * 0.0005, 1);
    L.position.set(0, h - 0.4, 0);
    g.add(L);
  }
}

list.forEach(b => {
  const real = b.kind === "station" || b.kind === "ship" || b.kind === "tether";
  const h = new THREE.Group();
  b.m = h;
  h.scale.setScalar(real ? 0.001 : b.r);
  if (b.ship) {
    const g = new THREE.Group();
    buildShip(PACK.ships[b.ship], g, false);
    b.def = g;
  } else if (Array.isArray(b.model)) {
    b.def = partsGroup(b.model);
  } else if (typeof b.model === "function") {
    b.def = b.model(THREE);
  }
  if (!b.def) {
    b.def = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 24),
      b.kind === "star"
        ? new THREE.MeshBasicMaterial({ color: b.color })
        : new THREE.MeshStandardMaterial({ color: b.color, roughness: 1 })
    );
  }
  h.add(b.def);
  if (b.link) loadModel(b.link, b.link, o => setModel(b, o));
  if (b.kind === "gate") {
    const gl = new THREE.PointLight(0x66ccff, 0.8, 0.05, 1);
    b.m.add(gl);
  }
  if (b.kind === "star") {
    b.light = new THREE.PointLight(0xffffff, 1.6, 0, 0);
    scene.add(b.light);
  }
  if (b.ring) {
    const rg = new THREE.Mesh(
      new THREE.RingGeometry(1.3, 2.3, 64),
      new THREE.MeshBasicMaterial({ color: 0xcdb98a, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
    );
    rg.rotation.x = -Math.PI / 2;
    b.m.add(rg);
  }
  scene.add(b.m);
  b.lb = document.createElement("div");
  b.lb.className = "lb";
  b.lb.textContent = b.name;
  document.body.appendChild(b.lb);
});

// Atmosphere for Earth
(function () {
  const earth = B["earth"];
  if (!earth) return;
  const geo = new THREE.SphereGeometry(1.08, 32, 24);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x4aa3ff, transparent: true, opacity: 0.18, side: THREE.BackSide, depthWrite: false
  });
  earth.m.add(new THREE.Mesh(geo, mat));
})();

// Asteroid belt (Sol)
(function () {
  const geo = new THREE.BufferGeometry();
  const count = 600;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * 6.283;
    const r = (280e6 + Math.random() * 220e6) * PACK.scale;
    positions[i * 3] = r * Math.cos(a);
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8e6 * PACK.scale;
    positions[i * 3 + 2] = r * Math.sin(a);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0x888888, size: 0.4, sizeAttenuation: false });
  const belt = new THREE.Points(geo, mat);
  scene.add(belt);
  window._belt = belt;
})();

// Starfield
const sp = new Float32Array(15000);
for (let i = 0; i < 15000; i += 3) {
  const u = Math.random() * 2 - 1;
  const a = Math.random() * 6.283;
  const s = Math.sqrt(1 - u * u);
  sp[i] = 12e9 * s * Math.cos(a);
  sp[i + 1] = 12e9 * u;
  sp[i + 2] = 12e9 * s * Math.sin(a);
}
const sgm = new THREE.BufferGeometry();
sgm.setAttribute("position", new THREE.BufferAttribute(sp, 3));
scene.add(new THREE.Points(sgm, new THREE.PointsMaterial({
  color: 0xffffff, size: 1.5, sizeAttenuation: false, depthWrite: false
})));

// Orbit lines
const orbitLines = {};
function makeOrbitLine(b) {
  if (!b.a || b.a < 1) return null;
  const pts = [];
  const N = 96;
  for (let i = 0; i <= N; i++) {
    const th = (i / N) * 6.2832;
    const x = b.a * Math.cos(th);
    const z = b.a * Math.sin(th);
    const y = z * Math.sin(b.inc || 0);
    const zz = z * Math.cos(b.inc || 0);
    pts.push(new THREE.Vector3(x, y, zz));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color: b.color || 0x4466aa, transparent: true, opacity: 0.3 });
  const line = new THREE.Line(geo, mat);
  line.visible = false;
  scene.add(line);
  return line;
}

// Player state
const shipG = new THREE.Group();
shipG.scale.setScalar(0.001);
scene.add(shipG);

let cur, H;
function setShip(id) {
  cur = PACK.ships[id];
  H = cur.hull;
  shipG.userData.tok = (shipG.userData.tok || 0) + 1;
  while (shipG.children.length) shipG.remove(shipG.children[0]);
  buildShip(cur, shipG, true);
  if (typeof shsel !== "undefined") shsel.value = id;
}
const SEAT = () => [0, Math.min(1.5, H[1] - 0.5), -H[2] / 2 + 1.5];
const EYE = () => Math.min(1.7, H[1] - 0.3);

function loadModel(src, name, cb) {
  const ext = String(name || "").split("?")[0].split(".").pop().toLowerCase();
  const bad = e => setTimeout(() => msg("Model failed: " + (e && e.message || e)), 0);
  const ok = o => cb(o.scene || o);
  try {
    if (ext === "obj") {
      if (!THREE.OBJLoader) return bad("OBJ loader missing");
      const L = new THREE.OBJLoader();
      if (typeof src === "string") L.load(src, ok, undefined, bad);
      else ok(L.parse(new TextDecoder().decode(src)));
    } else {
      if (!THREE.GLTFLoader) return bad("GLTF loader missing");
      const L = new THREE.GLTFLoader();
      if (typeof src === "string") L.load(src, ok, undefined, bad);
      else L.parse(src, "", ok, bad);
    }
  } catch (e) { bad(e); }
}

function setModel(b, o) {
  const real = b.kind === "station" || b.kind === "ship" || b.kind === "tether";
  if (b.def) { b.m.remove(b.def); b.def = null; }
  if (b.cm) b.m.remove(b.cm);
  if (real) {
    o.scale.multiplyScalar(b.scale || 1);
    b.cm = o;
  } else {
    const bx = new THREE.Box3().setFromObject(o);
    const sz = bx.getSize(new THREE.Vector3());
    const c = bx.getCenter(new THREE.Vector3());
    const w = new THREE.Group();
    o.position.sub(c);
    w.add(o);
    w.scale.setScalar(2 / (Math.max(sz.x, sz.y, sz.z) || 1));
    b.cm = w;
  }
  b.m.add(b.cm);
}

// Economy & Reputation
let credits = 50000;
let reputation = 50; // global fallback
const factionRep = { solfed: 50, alphaco: 40, siriusmin: 45, independent: 50 };
const ownedShips = ["scout"];
const pilots = [];
const availablePilots = [
  { name: "Aria Chen", wage: 120, skill: 0.8 },
  { name: "Marcus Vale", wage: 90, skill: 0.6 },
  { name: "Lina Okoye", wage: 150, skill: 0.9 },
  { name: "Theo Park", wage: 70, skill: 0.5 }
];

function changeRep(delta, faction) {
  if (faction && factionRep[faction] !== undefined) {
    factionRep[faction] = Math.max(0, Math.min(100, factionRep[faction] + delta));
    msg(FACTIONS[faction].name + " rep " + (delta > 0 ? "+" : "") + delta + " → " + Math.round(factionRep[faction]));
  } else {
    reputation = Math.max(0, Math.min(100, reputation + delta));
    msg("Reputation " + (delta > 0 ? "+" : "") + delta + " → " + Math.round(reputation));
  }
}

// Weapon (abstract defense laser)
let laserCooldown = 0;
function fireWeapon() {
  if (mode !== "fly" || laserCooldown > 0) return;
  laserCooldown = 0.4;
  // Simple visual: short flash in HUD
  msg("Defense laser fired");
  // Reputation cost if near a station or planet
  const near = list.reduce((a, b) => (b.dist < a.dist ? b : a), list[0]);
  if (near && near.dist < (near.r || 1) * 8 && near.kind !== "star") {
    changeRep(-2, near.faction);
  } else {
    changeRep(-0.5);
  }
}

// Station actions
function dockAtStation(stationId) {
  const st = B[stationId];
  if (!st || (st.kind !== "station" && st.kind !== "tether")) return;
  const d = Math.hypot(st.pos[0] - ship[0], st.pos[1] - ship[1], st.pos[2] - ship[2]);
  if (d > st.r * 12) { msg("Too far from station"); return; }
  openStationMenu(stationId);
}

function openStationMenu(stationId) {
  const panel = document.getElementById("stationPanel");
  if (!panel) return;
  panel.style.display = "flex";
  const st = B[stationId];
  document.getElementById("stationTitle").textContent = st.name + (st.faction ? " · " + FACTIONS[st.faction].name : "");
  document.getElementById("stationRep").textContent = st.faction ?
    FACTIONS[st.faction].name + " rep: " + Math.round(factionRep[st.faction] || 50) :
    "Reputation: " + Math.round(reputation);
  document.getElementById("stationCredits").textContent = "Credits: " + credits.toLocaleString();
  renderStationShips();
  renderStationPilots();
  renderStationCrafting();
}

function renderStationCrafting() {
  let el = document.getElementById("stationCrafting");
  if (!el) {
    // Create crafting section if missing
    const panel = document.getElementById("stationPanel");
    const box = panel ? panel.querySelector(".box") : null;
    if (box) {
      el = document.createElement("div");
      el.id = "stationCrafting";
      box.insertBefore(el, box.querySelector("#closeStation") || null);
    }
  }
  if (!el) return;

  let html = "<h4>Inventory</h4><div style='margin-bottom:8px;font-size:13px'>" + inventoryText() + "</div>";
  html += "<h4>Crafting</h4>";
  CRAFTING_RECIPES.forEach((recipe, i) => {
    const out = getResource(recipe.output);
    const inputs = recipe.inputs.map(id => {
      const r = getResource(id);
      const have = inventory[id] || 0;
      return iconHtml(r.icon, 20) + " " + r.name + " (" + have + ")";
    }).join(" + ");
    const can = canCraft(recipe);
    html += '<div style="margin:6px 0;padding:6px;background:#1a2332;border-radius:6px">';
    html += '<div>' + inputs + ' → <b>' + iconHtml(out.icon, 24) + " " + out.name + '</b></div>';
    html += '<button ' + (can ? '' : 'disabled') + ' onclick="doCraft(' + i + ')" style="margin-top:4px;width:100%">' +
            (can ? 'Craft' : 'Need materials') + '</button>';
    html += '</div>';
  });
  el.innerHTML = html;
}

function doCraft(i) {
  const recipe = CRAFTING_RECIPES[i];
  if (recipe && craft(recipe)) {
    renderStationCrafting();
  }
}
window.doCraft = doCraft;

function renderStationShips() {
  const el = document.getElementById("stationShips");
  el.innerHTML = "";
  Object.entries(PACK.ships).forEach(([id, ship]) => {
    const div = document.createElement("div");
    div.className = "shop-item";
    const owned = ownedShips.includes(id);
    div.innerHTML = `<b>${ship.name}</b> — ${ship.price.toLocaleString()} cr<br>` +
      `<small>Speed ${ship.specs.maxSpeed.toExponential(1)} · Weapon ${ship.specs.weapon}</small><br>` +
      (owned ? "<i>Owned</i>" : `<button data-buy="${id}">Buy</button>`);
    el.appendChild(div);
  });
  el.querySelectorAll("[data-buy]").forEach(btn => {
    btn.onclick = () => buyShip(btn.dataset.buy);
  });
}

function buyShip(id) {
  const ship = PACK.ships[id];
  if (!ship) return;
  const cost = Math.round(ship.price * (1 + (50 - reputation) / 200));
  if (credits < cost) { msg("Not enough credits"); return; }
  if (ownedShips.includes(id)) { msg("Already owned"); return; }
  credits -= cost;
  ownedShips.push(id);
  changeRep(1);
  msg("Bought " + ship.name);
  document.getElementById("stationCredits").textContent = "Credits: " + credits.toLocaleString();
  renderStationShips();
}

function renderStationPilots() {
  const el = document.getElementById("stationPilots");
  el.innerHTML = "";
  availablePilots.forEach((p, i) => {
    const hired = pilots.some(h => h.name === p.name);
    const div = document.createElement("div");
    div.className = "shop-item";
    div.innerHTML = `<b>${p.name}</b> — ${p.wage} cr/day · skill ${(p.skill * 100).toFixed(0)}%<br>` +
      (hired ? "<i>Hired</i>" : `<button data-hire="${i}">Hire</button>`);
    el.appendChild(div);
  });
  el.querySelectorAll("[data-hire]").forEach(btn => {
    btn.onclick = () => hirePilot(+btn.dataset.hire);
  });
}

function hirePilot(idx) {
  const p = availablePilots[idx];
  if (pilots.some(h => h.name === p.name)) return;
  if (credits < p.wage * 5) { msg("Need 5 days wages upfront"); return; }
  credits -= p.wage * 5;
  pilots.push({ ...p, assigned: null });
  changeRep(1);
  msg("Hired " + p.name);
  document.getElementById("stationCredits").textContent = "Credits: " + credits.toLocaleString();
  renderStationPilots();
}

// State
let t = 0, ts = 1, lock = PACK.start.near;
let ship = [0, 0, 0];
let last = performance.now();
let mode = "fly";
let pl = new THREE.Vector3();
let yaw = 0, pitch = 0;
let ev = [0, 0, 0], evv = [0, 0, 0];
let spd = 0;
let vo = [0, 0, 0];
let note = "", nt = 0;
let paused = false;
let showOrbits = false;
let fuel = 100;
const maxFuel = 100;
const FUEL_USE = 0.8;

const shipQ = new THREE.Quaternion();
const Q2 = new THREE.Quaternion();
const qL = new THREE.Quaternion();
const E = new THREE.Euler();
const P = new THREE.Vector3();
const F = new THREE.Vector3();
const R = new THREE.Vector3();
const VX = new THREE.Vector3(1, 0, 0);
const VY = new THREE.Vector3(0, 1, 0);
const VZ = new THREE.Vector3(0, 0, 1);
const K = {};
const J = { x: 0, y: 0 };
const V = new THREE.Vector3();
const TS = [1, 60, 3600, 86400];

function msg(s) { note = s; nt = 3; }

function place() {
  for (const b of list) {
    if (!b.parent) {
      if (!b.pos || (b.pos[0] === 0 && b.pos[1] === 0 && b.pos[2] === 0 && b.id !== "sun")) {
        // keep offset stars fixed
      }
      continue;
    }
    const th = b.ph + 6.2832 * t / (b.P || 1);
    const p = B[b.parent].pos;
    const x = b.a * Math.cos(th);
    const z = b.a * Math.sin(th);
    b.pos = [p[0] + x, p[1] + z * Math.sin(b.inc || 0), p[2] + z * Math.cos(b.inc || 0)];
  }
}

function face(id) {
  const b = B[id];
  camera.lookAt(b.pos[0] - ship[0], b.pos[1] - ship[1], b.pos[2] - ship[2]);
  shipQ.copy(camera.quaternion);
}

function setLock(id) {
  lock = id;
  lk.textContent = "Lock: " + (id ? B[id].name : "off");
}

function go(id) {
  const b = B[id];
  const s = STAR.pos;
  let d = [s[0] - b.pos[0], s[1] - b.pos[1], s[2] - b.pos[2]];
  let L = Math.hypot(d[0], d[1], d[2]);
  if (b.kind === "star" || !L) { d = [1, 0, 0]; L = 1; }
  const k = b.r * 4 / L;
  ship = [b.pos[0] + d[0] * k, b.pos[1] + d[1] * k, b.pos[2] + d[2] * k];
  sl.value = 0;
  setMode("fly");
  pl.set(...SEAT());
  setLock(id);
  face(id);
}

const fmt = k => k < 1 ? (k * 1000).toFixed(0) + " m" :
  k < 1e5 ? k.toFixed(1) + " km" :
  k < 1e9 ? (k / 1e6).toFixed(2) + " Mkm" :
  (k / 1e9).toFixed(2) + " Gkm";

const fsp = s => s < 1 ? (s * 1000).toFixed(1) + " m/s" :
  s < 1e4 ? s.toFixed(2) + " km/s" :
  (s / 1e3).toFixed(1) + " k km/s";

// UI
const $ = id => document.getElementById(id);
const sel = $("sel");
const shsel = $("shsel");
const sl = $("sl");
const lk = $("lk");
const hud = $("hud");
const ac = $("ac");

list.forEach(b => {
  const o = document.createElement("option");
  o.value = b.id;
  o.textContent = b.name;
  sel.appendChild(o);
});
{
  const o = document.createElement("option");
  o.value = "_ship";
  o.textContent = "(my ship)";
  sel.appendChild(o);
}
sel.value = PACK.start.near;

Object.keys(PACK.ships).forEach(k => {
  const o = document.createElement("option");
  o.value = k;
  o.textContent = PACK.ships[k].name;
  shsel.appendChild(o);
});

shsel.onchange = () => { setShip(shsel.value); setMode("fly"); pl.set(...SEAT()); };
$("go").onclick = () => { if (sel.value !== "_ship") go(sel.value); };
$("md").onclick = () => $("fi").click();
$("fi").onchange = e => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    const id = sel.value;
    if (id === "_ship") {
      cur._up = { buf: r.result, name: f.name };
      cur.hideShell = true;
      setShip(shsel.value);
    } else {
      loadModel(r.result, f.name, o => setModel(B[id], o));
    }
    e.target.value = "";
  };
  r.readAsArrayBuffer(f);
};

lk.onclick = () => {
  if (lock) setLock(null);
  else {
    let n = list[0], m = 1e99;
    for (const b of list) {
      const d = Math.hypot(b.pos[0] - ship[0], b.pos[1] - ship[1], b.pos[2] - ship[2]) - b.r;
      if (d < m) { m = d; n = b; }
    }
    setLock(n.id);
  }
};

$("tm").onclick = () => {
  ts = TS[(TS.indexOf(ts) + 1) % TS.length];
  $("tm").textContent = "Time x" + ts;
};

function setMode(m) {
  mode = m;
  ac.textContent = m === "fly" ? "Stand up" : m === "walk" ? "Seat / Airlock" : "Enter ship";
}

function shipVel(a) {
  V.set(0, 0, -1).applyQuaternion(shipQ);
  a[0] = V.x * spd;
  a[1] = V.y * spd;
  a[2] = V.z * spd;
}

function eDist() {
  return Math.hypot(ev[0] - ship[0], ev[1] - ship[1], ev[2] - ship[2]);
}

ac.onclick = () => {
  const l = H[2];
  if (mode === "fly") {
    setMode("walk");
    pl.set(0, EYE(), -l / 2 + 3.5);
    yaw = 0; pitch = 0;
  } else if (mode === "walk") {
    if (pl.z < -l / 2 + 2.7) {
      setMode("fly");
      pl.set(...SEAT());
    } else if (pl.z > l / 2 - 2.2) {
      P.set(0, 1.5, l / 2 + 1.5).multiplyScalar(0.001).applyQuaternion(shipQ);
      ev = [ship[0] + P.x, ship[1] + P.y, ship[2] + P.z];
      shipVel(evv);
      const dx = ship[0] - ev[0], dy = ship[1] - ev[1], dz = ship[2] - ev[2];
      const d = Math.hypot(dx, dy, dz);
      yaw = Math.atan2(-dx, -dz);
      pitch = Math.asin(dy / d);
      setMode("eva");
    } else {
      msg("Go to the seat (front) or the green door (rear)");
    }
  } else if (eDist() < (l / 2 + 15) / 1000) {
    setMode("walk");
    pl.set(0, EYE(), l / 2 - 1.7);
    yaw = 0; pitch = 0;
  } else {
    msg("Fly closer: within 15 m of the ship");
  }
};

$("st").onclick = () => {
  if (mode === "eva") shipVel(evv);
  else sl.value = 0;
};

// Weapon button
const fireBtn = document.createElement("button");
fireBtn.id = "fire";
fireBtn.textContent = "Laser";
fireBtn.onclick = fireWeapon;
document.querySelector("#top .row").appendChild(fireBtn);

// Dock button
const dockBtn = document.createElement("button");
dockBtn.id = "dock";
dockBtn.textContent = "Dock";
dockBtn.onclick = () => {
  const near = list.reduce((a, b) => (b.dist < a.dist ? b : a), list[0]);
  if (near && (near.kind === "station" || near.kind === "tether")) dockAtStation(near.id);
  else msg("No station nearby");
};
document.querySelector("#top .row").appendChild(dockBtn);

document.querySelectorAll("[data-k]").forEach(e => {
  const k = e.dataset.k;
  e.onpointerdown = () => K[k] = 1;
  e.onpointerup = e.onpointerleave = e.onpointercancel = () => K[k] = 0;
});

const km = {
  ArrowLeft: "l", a: "l", ArrowRight: "r", d: "r",
  ArrowUp: "u", ArrowDown: "d", q: "a", e: "b", w: "f", s: "s",
  " ": "fire"
};
addEventListener("keydown", e => {
  if (km[e.key]) {
    if (km[e.key] === "fire") fireWeapon();
    else K[km[e.key]] = 1;
  }
  if (e.key === "x") sl.value = 0;
});
addEventListener("keyup", e => {
  if (km[e.key] && km[e.key] !== "fire") K[km[e.key]] = 0;
});

function resize() {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize);
resize();

let dr = null;
renderer.domElement.onpointerdown = e => { dr = [e.clientX, e.clientY]; };
addEventListener("pointerup", () => { dr = null; });
renderer.domElement.onpointermove = e => {
  if (!dr || mode === "fly") return;
  yaw -= (e.clientX - dr[0]) * 0.005;
  pitch = Math.max(-1.5, Math.min(1.5, pitch - (e.clientY - dr[1]) * 0.005));
  dr = [e.clientX, e.clientY];
};

// Joystick
(function () {
  const el = $("joy"), kn = $("knob");
  let id = null;
  function mv(e) {
    const b = el.getBoundingClientRect();
    const R = b.width / 2;
    let dx = e.clientX - b.left - R;
    let dy = e.clientY - b.top - R;
    const m = R * 0.42;
    const d = Math.hypot(dx, dy);
    if (d > m) { dx *= m / d; dy *= m / d; }
    kn.style.transform = "translate(" + dx + "px," + dy + "px)";
    J.x = dx / m;
    J.y = -dy / m;
  }
  el.onpointerdown = e => { id = e.pointerId; el.setPointerCapture(id); mv(e); };
  el.onpointermove = e => { if (e.pointerId === id) mv(e); };
  const up = e => {
    if (e.pointerId === id) {
      id = null;
      J.x = J.y = 0;
      kn.style.transform = "";
    }
  };
  el.onpointerup = up;
  el.onpointercancel = up;
})();

// Enhanced UI
$("orb").onclick = () => {
  showOrbits = !showOrbits;
  $("orb").textContent = showOrbits ? "Hide Orbits" : "Orbits";
  for (const b of list) {
    if (!orbitLines[b.id] && b.a > 10) orbitLines[b.id] = makeOrbitLine(b);
    if (orbitLines[b.id]) orbitLines[b.id].visible = showOrbits;
  }
  msg(showOrbits ? "Orbital paths on" : "Orbital paths off");
};

$("pause").onclick = () => {
  paused = !paused;
  $("pause").textContent = paused ? "Resume" : "Pause";
  msg(paused ? "Paused" : "Resumed");
};

$("helpbtn").onclick = () => $("help").style.display = "flex";
$("closehelp").onclick = () => $("help").style.display = "none";

// Station panel close
document.getElementById("closeStation")?.addEventListener("click", () => {
  document.getElementById("stationPanel").style.display = "none";
});

// Radar
const radCanvas = $("radarc");
const radCtx = radCanvas.getContext("2d");
function resizeRadar() { radCanvas.width = 140; radCanvas.height = 140; }
resizeRadar();

function drawRadar() {
  const w = 140, h = 140, cx = w / 2, cy = h / 2;
  radCtx.clearRect(0, 0, w, h);
  radCtx.strokeStyle = "#38507a";
  radCtx.lineWidth = 1;
  radCtx.beginPath(); radCtx.arc(cx, cy, 60, 0, 6.28); radCtx.stroke();
  radCtx.beginPath(); radCtx.arc(cx, cy, 30, 0, 6.28); radCtx.stroke();
  radCtx.fillStyle = "#58cc02";
  radCtx.beginPath(); radCtx.arc(cx, cy, 3, 0, 6.28); radCtx.fill();

  const range = 80000;
  for (const b of list) {
    if (b.dist > range * 2) continue;
    const dx = b.pos[0] - vo[0];
    const dz = b.pos[2] - vo[2];
    const dist = Math.hypot(dx, dz);
    if (dist < 1) continue;
    const scale = Math.min(1, dist / (range * 0.8));
    const ang = Math.atan2(dx, dz);
    const px = cx + Math.sin(ang) * 60 * scale;
    const py = cy - Math.cos(ang) * 60 * scale;
    radCtx.fillStyle = b.kind === "star" ? "#ffd36b" :
      b.kind === "planet" ? "#4aa3d8" :
      b.kind === "moon" ? "#aaa" :
      b.kind === "station" ? "#ffcc66" : (b.kind === "tether" ? "#66ccff" : "#fff");
    radCtx.beginPath();
    radCtx.arc(px, py, b.kind === "star" ? 4 : 2.5, 0, 6.28);
    radCtx.fill();
  }
}

// Start
setShip(PACK.start.ship);
pl.set(...SEAT());
place();
const n0 = B[PACK.start.near];
const of = PACK.start.offset;
ship = [n0.pos[0] + of[0], n0.pos[1] + of[1], n0.pos[2] + of[2]];
setLock(PACK.start.near);
face(PACK.start.near);
msg("Welcome! Fly into cyan gates to jump. Dock at stations for ships & pilots.");

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  if (paused) { requestAnimationFrame(frame); return; }
  const sp = cur.specs;

  if (laserCooldown > 0) laserCooldown -= dt;

  const fl = mode === "fly";
  const yw = (K.l ? 1 : 0) - (K.r ? 1 : 0) - (fl ? J.x : 0);
  const rl = (K.a ? 1 : 0) - (K.b ? 1 : 0);
  const ud = (K.u ? 1 : 0) - (K.d ? 1 : 0) + (fl ? J.y + (K.pu ? 1 : 0) - (K.pd ? 1 : 0) : 0);

  if (mode === "fly") {
    const tr = sp.turn * dt;
    if (yw) shipQ.multiply(Q2.setFromAxisAngle(VY, yw * tr));
    if (rl) shipQ.multiply(Q2.setFromAxisAngle(VZ, rl * tr));
    if (ud) shipQ.multiply(Q2.setFromAxisAngle(VX, ud * tr));
  } else {
    yaw += yw * dt * 1.5;
    const mv = (K.u ? 1 : 0) - (K.d ? 1 : 0) + (K.f ? 1 : 0) - (K.s ? 1 : 0) + J.y + (K.tu ? 1 : 0) - (K.td ? 1 : 0);
    const sr = -rl + J.x;
    const vt = (K.pu ? 1 : 0) - (K.pd ? 1 : 0);
    if (mode === "walk") pitch = Math.max(-1.5, Math.min(1.5, pitch + vt * dt * 1.2));
    if (mode === "walk") {
      const c = Math.cos(yaw), s = Math.sin(yaw);
      const wx = H[0] / 2 - 0.4;
      const w = sp.walk * dt;
      pl.x = Math.max(-wx, Math.min(wx, pl.x + (-s * mv + c * sr) * w));
      pl.z = Math.max(-H[2] / 2 + 0.9, Math.min(H[2] / 2 - 0.5, pl.z + (-c * mv - s * sr) * w));
      pl.y = EYE();
    } else {
      qL.setFromEuler(E.set(pitch, yaw, 0, "YXZ"));
      F.set(0, 0, -1).applyQuaternion(qL);
      R.set(1, 0, 0).applyQuaternion(qL);
      V.set(0, 1, 0).applyQuaternion(qL);
      const th = sp.evaThrust * dt;
      evv[0] += (F.x * mv + R.x * sr + V.x * vt) * th;
      evv[1] += (F.y * mv + R.y * sr + V.y * vt) * th;
      evv[2] += (F.z * mv + R.z * sr + V.z * vt) * th;
    }
  }

  if ((K.f || K.tu) && mode === "fly") sl.value = Math.min(100, +sl.value + dt * 25);
  if ((K.s || K.td) && mode === "fly") sl.value = Math.max(0, +sl.value - dt * 25);

  const speed = +sl.value > 0 ? 0.001 * Math.pow(sp.maxSpeed / 0.001, sl.value / 100) : 0;

  if (mode === "fly" && speed > 0.01) {
    fuel = Math.max(0, fuel - FUEL_USE * (speed / (sp.maxSpeed || 1)) * dt * 10);
    if (fuel <= 0) { sl.value = 0; msg("Out of fuel!"); }
  }

  const L = lock && B[lock];
  const old = L ? L.pos.slice() : null;
  t += dt * ts / 86400;
  place();
  if (L) for (let i = 0; i < 3; i++) {
    const d = L.pos[i] - old[i];
    ship[i] += d;
    ev[i] += d;
  }

  spd = speed;
  V.set(0, 0, -1).applyQuaternion(shipQ);
  ship[0] += V.x * speed * dt;
  ship[1] += V.y * speed * dt;
  ship[2] += V.z * speed * dt;

  if (mode === "eva") for (let i = 0; i < 3; i++) ev[i] += evv[i] * dt;

  if (mode === "eva") {
    vo = ev;
    camera.quaternion.setFromEuler(E.set(pitch, yaw, 0, "YXZ"));
  } else {
    P.copy(pl).multiplyScalar(0.001).applyQuaternion(shipQ);
    vo = [ship[0] + P.x, ship[1] + P.y, ship[2] + P.z];
    camera.quaternion.copy(shipQ);
    if (mode === "walk") camera.quaternion.multiply(qL.setFromEuler(E.set(pitch, yaw, 0, "YXZ")));
  }

  shipG.position.set(ship[0] - vo[0], ship[1] - vo[1], ship[2] - vo[2]);
  shipG.quaternion.copy(shipQ);

  // Gate teleport
  for (const b of list) {
    if (b.kind !== "gate") continue;
    const d = Math.hypot(b.pos[0] - ship[0], b.pos[1] - ship[1], b.pos[2] - ship[2]);
    if (d < b.r * 6 && b.dest && B[b.dest]) {
      const dest = B[b.dest];
      ship = [dest.pos[0] + dest.r * 8, dest.pos[1], dest.pos[2]];
      msg("Gate jump to " + dest.name);
      if (b.faction) changeRep(1, b.faction);
      break;
    }
  }

  let near = list[0], nd = 1e99;
  for (const b of list) {
    const x = b.pos[0] - vo[0];
    const y = b.pos[1] - vo[1];
    const z = b.pos[2] - vo[2];
    b.m.position.set(x, y, z);
    if (b.light) b.light.position.set(x, y, z);
    b.dist = Math.hypot(x, y, z);
    const a = b.dist - b.r;
    if (a < nd) { nd = a; near = b; }
  }

  if (showOrbits) {
    for (const b of list) {
      const line = orbitLines[b.id];
      if (line && b.parent) {
        const p = B[b.parent].pos;
        line.position.set(p[0] - vo[0], p[1] - vo[1], p[2] - vo[2]);
      }
    }
  }

  if (window._belt) window._belt.position.set(-vo[0], -vo[1], -vo[2]);

  renderer.render(scene, camera);

  const alt = Math.max(nd, 0);
  const fuelPct = Math.round(fuel);
  const warnEl = $("warn");
  if (alt < (near.r || 1) * 0.3 && near.kind !== "station") {
    warnEl.style.display = "block";
    warnEl.textContent = "WARNING: TOO CLOSE TO " + near.name.toUpperCase();
  } else {
    warnEl.style.display = "none";
  }

  const facName = near.faction ? FACTIONS[near.faction].name : "";
  const facRep = near.faction ? Math.round(factionRep[near.faction] || 50) : Math.round(reputation);
  hud.innerHTML = (nt > 0 ? note + " | " : "") +
    cur.name + " " + mode.toUpperCase() + " | " +
    near.name + " " + fmt(alt) + " | " +
    fsp(speed) + " | Fuel " + fuelPct + "%" +
    " | " + credits.toLocaleString() + " cr" +
    (facName ? " | " + facName + " " + facRep : " | Rep " + Math.round(reputation)) +
    '<div class="fuelbar"><div style="width:' + fuelPct + '%"></div></div>';

  nt -= dt;

  for (const b of list) {
    V.copy(b.m.position).project(camera);
    const ok = V.z < 1 && Math.abs(V.x) < 1 && Math.abs(V.y) < 1 && b.dist > b.r * 1.5;
    b.lb.style.display = ok ? "block" : "none";
    if (ok) {
      b.lb.style.transform = "translate(" + ((V.x + 1) / 2 * innerWidth + 8) + "px," +
        ((1 - V.y) / 2 * innerHeight - 6) + "px)";
    }
  }

  drawRadar();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
