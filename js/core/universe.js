// Shared authoritative star systems for Space Pack / Transport Tycoon
// Single source of truth. Simulator and galaxy map both import from here.

export const SYSTEMS = [
  { id: "sol",       name: "Sol",              x: 0.18, y: 0.48, description: "Humanity's home system. Full planets, moons, stations, and asteroid belt.", population: 12000000000, faction: "terran", gates: ["gate-alpha-sol", "gate-sirius-sol", "gate-vega-sol", "gate-altair-sol", "gate-proxima-sol"] },
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
  { id: "barnard",   name: "Barnard's Star",   x: 0.42, y: 0.35, description: "Nearest single star after Alpha Centauri. Quiet research station.", population: 15000000, faction: "belt", gates: ["gate-barnard-sol"] }
];

// Canonical ID map (resolves old short names)
export const ID_MAP = {
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
  barnard: "barnard"
};

export function canonicalId(id) {
  return ID_MAP[id] || id;
}

export function getSystem(id) {
  const cid = canonicalId(id);
  return SYSTEMS.find(s => s.id === cid) || null;
}

export function findRoute(startId, destId) {
  const start = canonicalId(startId);
  const dest = canonicalId(destId);
  if (!getSystem(start) || !getSystem(dest)) return null;
  if (start === dest) return [start];

  const connections = {
    sol: ["alpha-cen", "sirius", "vega", "altair", "proxima", "tau-ceti", "epsilon-eri", "trappist", "barnard"],
    "alpha-cen": ["sol", "rigel", "proxima"],
    proxima: ["sol", "alpha-cen"],
    sirius: ["sol", "kepler"],
    vega: ["sol"],
    altair: ["sol"],
    rigel: ["alpha-cen"],
    kepler: ["sirius"],
    "tau-ceti": ["sol"],
    "epsilon-eri": ["sol"],
    trappist: ["sol"],
    barnard: ["sol"]
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

// Expose for non-module scripts
if (typeof window !== "undefined") {
  window.UNIVERSE = { SYSTEMS, getSystem, findRoute, canonicalId };
}
