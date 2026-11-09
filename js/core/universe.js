// Shared authoritative star systems for Space Pack / Transport Tycoon
// Single source of truth. Simulator and galaxy map both import from here.

export const SYSTEMS = [
  { id: "sol",       name: "Sol",              description: "Humanity's home system. Full planets, moons, stations, and asteroid belt.",           gates: ["gate-alpha-sol", "gate-sirius-sol", "gate-vega-sol", "gate-altair-sol", "gate-proxima-sol"] },
  { id: "alpha-cen", name: "Alpha Centauri",   description: "Nearby triple-star system with habitable worlds and trade hubs.",        gates: ["gate-alpha-sol", "gate-rigel-alpha", "gate-proxima-alpha"] },
  { id: "proxima",   name: "Proxima Centauri",  description: "Red dwarf with a rocky planet in the habitable zone. Research outposts.", gates: ["gate-proxima-sol", "gate-proxima-alpha"] },
  { id: "sirius",    name: "Sirius",           description: "Bright nearby star system with mining operations.",        gates: ["gate-sirius-sol", "gate-kepler-sirius"] },
  { id: "vega",      name: "Vega",             description: "Major navigational and cultural destination.",   gates: ["gate-vega-sol"] },
  { id: "altair",    name: "Altair",           description: "Industrial system with foundries and shipyards.",               gates: ["gate-altair-sol"] },
  { id: "rigel",     name: "Rigel",            description: "Distant blue supergiant region with research ports.",      gates: ["gate-rigel-alpha"] },
  { id: "kepler",    name: "Kepler",           description: "Exploration and colony destination with ice resources.",          gates: ["gate-kepler-sirius"] },
  { id: "tau-ceti",  name: "Tau Ceti",         description: "Quiet yellow dwarf with multiple rocky planets. Growing colonies.", gates: ["gate-tau-sol"] },
  { id: "epsilon-eri", name: "Epsilon Eridani", description: "Young system with a debris disk and mining opportunities.", gates: ["gate-epsilon-sol"] },
  { id: "trappist",  name: "TRAPPIST-1",       description: "Ultra-cool red dwarf with seven Earth-sized planets, several in the habitable zone.", gates: ["gate-trappist-sol"] },
  { id: "barnard",   name: "Barnard's Star",   description: "Nearest single star after Alpha Centauri. Quiet research station.", gates: ["gate-barnard-sol"] }
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
