// Shared authoritative star systems for Space Pack / Transport Tycoon
// Single source of truth. Simulator and galaxy map both import from here.

export const SYSTEMS = [
  { id: "sol",       name: "Sol",              description: "Humanity's home system.",           gates: ["gate-alpha-sol", "gate-sirius-sol", "gate-vega-sol", "gate-altair-sol"] },
  { id: "alpha-cen", name: "Alpha Centauri",   description: "Nearby triple-star system.",        gates: ["gate-alpha-sol", "gate-rigel-alpha"] },
  { id: "sirius",    name: "Sirius",           description: "Bright nearby star system.",        gates: ["gate-sirius-sol", "gate-kepler-sirius"] },
  { id: "vega",      name: "Vega",             description: "Major navigational destination.",   gates: ["gate-vega-sol"] },
  { id: "altair",    name: "Altair",           description: "Nearby star system.",               gates: ["gate-altair-sol"] },
  { id: "rigel",     name: "Rigel",            description: "Distant stellar destination.",      gates: ["gate-rigel-alpha"] },
  { id: "kepler",    name: "Kepler",           description: "Exploration destination.",          gates: ["gate-kepler-sirius"] }
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
  kepler: "kepler"
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

  // Simple BFS using gate connectivity (systems connected if they share a gate destination or mutual gates)
  const connections = {
    sol: ["alpha-cen", "sirius", "vega", "altair"],
    "alpha-cen": ["sol", "rigel"],
    sirius: ["sol", "kepler"],
    vega: ["sol"],
    altair: ["sol"],
    rigel: ["alpha-cen"],
    kepler: ["sirius"]
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
