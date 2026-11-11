// Shared authoritative star systems for Space Pack / Transport Tycoon
// Single source of truth. Simulator and galaxy map both use this.
// Loaded as a classic <script> (no export keywords) so index.html / transport.html keep working.
// Expanded with many more systems and full route connectivity.

const SYSTEMS = [
  { id: "sol",       name: "Sol",              x: 0.18, y: 0.48, description: "Humanity's home system. Full planets, moons, stations, and asteroid belt.", population: 12000000000, faction: "terran", gates: ["gate-alpha-sol", "gate-sirius-sol", "gate-vega-sol", "gate-altair-sol", "gate-proxima-sol", "gate-tau-sol", "gate-epsilon-sol", "gate-trappist-sol", "gate-barnard-sol", "gate-wolf-sol"] },
  { id: "alpha-cen", name: "Alpha Centauri",   x: 0.39, y: 0.22, description: "Nearby triple-star system with habitable worlds and trade hubs.", population: 450000000, faction: "alpha", gates: ["gate-alpha-sol", "gate-rigel-alpha", "gate-proxima-alpha"] },
  { id: "proxima",   name: "Proxima Centauri",  x: 0.32, y: 0.15, description: "Red dwarf with a rocky planet in the habitable zone. Research outposts.", population: 8000000, faction: "science_collective", gates: ["gate-proxima-sol", "gate-proxima-alpha"] },
  { id: "sirius",    name: "Sirius",           x: 0.61, y: 0.42, description: "Bright nearby star system with mining operations.", population: 280000000, faction: "sirius_mining", gates: ["gate-sirius-sol", "gate-kepler-sirius"] },
  { id: "vega",      name: "Vega",             x: 0.78, y: 0.18, description: "Major navigational and cultural destination.", population: 620000000, faction: "jovian", gates: ["gate-vega-sol"] },
  { id: "altair",    name: "Altair",           x: 0.48, y: 0.76, description: "Industrial system with foundries and shipyards.", population: 190000000, faction: "independent", gates: ["gate-altair-sol"] },
  { id: "rigel",     name: "Rigel",            x: 0.85, y: 0.72, description: "Distant blue supergiant region with research ports.", population: 45000000, faction: "science_collective", gates: ["gate-rigel-alpha"] },
  { id: "kepler",    name: "Kepler",           x: 0.22, y: 0.82, description: "Exploration and colony destination with ice resources.", population: 12000000, faction: "outer", gates: ["gate-kepler-sirius"] },
  { id: "tau-ceti",  name: "Tau Ceti",         x: 0.55, y: 0.55, description: "Quiet yellow dwarf with multiple rocky planets. Growing colonies.", population: 210000000, faction: "terran", gates: ["gate-tau-sol"] },
  { id: "epsilon-eri", name: "Epsilon Eridani", x: 0.70, y: 0.60, description: "Young system with a debris disk and mining opportunities.", population: 35000000, faction: "belt", gates: ["gate-epsilon-sol"] },
  { id: "trappist",  name: "TRAPPIST-1",       x: 0.15, y: 0.30, description: "Ultra-cool red dwarf with seven Earth-sized planets, several in the habitable zone.", population: 95000000, faction: "outer", gates: ["gate-trappist-sol"] },
  { id: "barnard",   name: "Barnard's Star",   x: 0.42, y: 0.35, description: "Nearest single star after Alpha Centauri. Quiet research station.", population: 15000000, faction: "belt", gates: ["gate-barnard-sol"] },
  { id: "wolf-359",  name: "Wolf 359",         x: 0.68, y: 0.28, description: "Flare star system with defensive outposts.", population: 22000000, faction: "terran", gates: ["gate-wolf-sol"] },
  { id: "ross-128",  name: "Ross 128",         x: 0.72, y: 0.55, description: "Quiet system, growing trade presence.", population: 48000000, faction: "independent", gates: ["gate-ross-altair"] },
  { id: "gliese-581", name: "Gliese 581",      x: 0.82, y: 0.35, description: "Exoplanet-rich system, scientific interest.", population: 12000000, faction: "science_collective", gates: ["gate-gliese-vega"] },
  { id: "kepler-442", name: "Kepler-442",      x: 0.12, y: 0.35, description: "Earth-like world, major colonization effort.", population: 85000000, faction: "terran", gates: ["gate-k442-sol"] },
  { id: "61-cygni",  name: "61 Cygni",         x: 0.58, y: 0.68, description: "Binary system with independent colonies.", population: 67000000, faction: "independent", gates: ["gate-61-altair"] },
  { id: "lalande",   name: "Lalande 21185",    x: 0.25, y: 0.18, description: "High-mass star with dense asteroid fields.", population: 18000000, faction: "belt", gates: ["gate-lalande-proxima"] },
  { id: "wolf-1061", name: "Wolf 1061",        x: 0.38, y: 0.88, description: "Nearby red dwarf with confirmed planets.", population: 19000000, faction: "independent", gates: ["gate-wolf1061-kepler"] },
  { id: "gliese-667", name: "Gliese 667",      x: 0.75, y: 0.82, description: "Triple star system with multiple habitable candidates.", population: 32000000, faction: "outer", gates: ["gate-g667-rigel"] }
];

// Canonical ID map (resolves old short names)
const ID_MAP = {
  alpha: "alpha-cen",
  "alpha-cen": "alpha-cen",
  sol: "sol",
  sirius: "sirius",
  vega: "vega",
  altair: "altair",
  rigel: "rigel",
  kepler: "kepler",
  proxima: "proxima",
  "tau-ceti": "tau-ceti",
  "epsilon-eri": "epsilon-eri",
  trappist: "trappist",
  barnard: "barnard",
  "wolf-359": "wolf-359",
  "ross-128": "ross-128",
  "gliese-581": "gliese-581",
  "kepler-442": "kepler-442",
  "61-cygni": "61-cygni",
  lalande: "lalande",
  "wolf-1061": "wolf-1061",
  "gliese-667": "gliese-667"
};

function canonicalId(id) {
  return ID_MAP[id] || id;
}

function getSystem(id) {
  const cid = canonicalId(id);
  return SYSTEMS.find(s => s.id === cid) || null;
}

function findRoute(startId, destId) {
  const start = canonicalId(startId);
  const dest = canonicalId(destId);
  if (!getSystem(start) || !getSystem(dest)) return null;
  if (start === dest) return [start];

  const connections = {
    sol: ["alpha-cen", "sirius", "vega", "altair", "proxima", "tau-ceti", "epsilon-eri", "trappist", "barnard", "wolf-359", "kepler-442"],
    "alpha-cen": ["sol", "rigel", "proxima"],
    proxima: ["sol", "alpha-cen", "lalande"],
    sirius: ["sol", "kepler"],
    vega: ["sol", "gliese-581"],
    altair: ["sol", "ross-128", "61-cygni"],
    rigel: ["alpha-cen", "gliese-667"],
    kepler: ["sirius", "wolf-1061"],
    "tau-ceti": ["sol"],
    "epsilon-eri": ["sol"],
    trappist: ["sol"],
    barnard: ["sol"],
    "wolf-359": ["sol"],
    "ross-128": ["altair"],
    "gliese-581": ["vega"],
    "kepler-442": ["sol"],
    "61-cygni": ["altair"],
    lalande: ["proxima"],
    "wolf-1061": ["kepler"],
    "gliese-667": ["rigel"]
  };

  const queue = [[start]];
  const visited = new Set([start]);
  while (queue.length) {
    const path = queue.shift();
    const current = path[path.length - 1];
    for (const next of (connections[current] || [])) {
      if (visited.has(next)) continue;
      const nextPath = [...path, next];
      if (next === dest) return nextPath;
      visited.add(next);
      queue.push(nextPath);
    }
  }
  return null;
}

// Expose for all scripts (classic and modules that read the global)
window.UNIVERSE = { SYSTEMS, getSystem, findRoute, canonicalId, ID_MAP };
