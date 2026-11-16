// Shared authoritative star systems for Ideal Umbrella
// Single source of truth. Simulator and galaxy map both use this.
// Loaded as a classic <script> (no export keywords) so index.html / transport.html keep working.
// Fixed: proper bidirectional connectivity, getSystem, findRoute, and window.UNIVERSE exposure.

const SYSTEMS = [
  { id: "sol",       name: "Sol",              x: 0.18, y: 0.48, description: "Humanity's home system. Full planets, moons, stations, and asteroid belt.", population: 12000000000, faction: "terran", gates: ["alpha-cen", "sirius", "vega", "altair", "proxima", "tau-ceti", "epsilon-eri", "trappist", "barnard", "wolf-359", "kepler-442", "procyon"] },
  { id: "alpha-cen", name: "Alpha Centauri",   x: 0.39, y: 0.22, description: "Nearby triple-star system with habitable worlds and trade hubs.", population: 450000000, faction: "alpha", gates: ["sol", "rigel", "proxima", "lalande"] },
  { id: "proxima",   name: "Proxima Centauri",  x: 0.32, y: 0.15, description: "Red dwarf with a rocky planet in the habitable zone. Research outposts.", population: 8000000, faction: "science_collective", gates: ["sol", "alpha-cen", "lalande"] },
  { id: "sirius",    name: "Sirius",           x: 0.61, y: 0.42, description: "Bright nearby star system with mining operations.", population: 280000000, faction: "sirius_mining", gates: ["sol", "kepler"] },
  { id: "vega",      name: "Vega",             x: 0.78, y: 0.18, description: "Major navigational and cultural destination.", population: 620000000, faction: "jovian", gates: ["sol", "gliese-581"] },
  { id: "altair",    name: "Altair",           x: 0.48, y: 0.76, description: "Industrial system with foundries and shipyards.", population: 190000000, faction: "independent", gates: ["sol", "ross-128", "61-cygni"] },
  { id: "rigel",     name: "Rigel",            x: 0.85, y: 0.72, description: "Distant blue supergiant region with research ports.", population: 45000000, faction: "science_collective", gates: ["alpha-cen", "gliese-667"] },
  { id: "kepler",    name: "Kepler",           x: 0.22, y: 0.82, description: "Exploration and colony destination with ice resources.", population: 12000000, faction: "outer", gates: ["sirius", "wolf-1061"] },
  { id: "tau-ceti",  name: "Tau Ceti",         x: 0.55, y: 0.55, description: "Quiet yellow dwarf with multiple rocky planets. Growing colonies.", population: 210000000, faction: "terran", gates: ["sol"] },
  { id: "epsilon-eri", name: "Epsilon Eridani", x: 0.70, y: 0.60, description: "Young system with a debris disk and mining opportunities.", population: 35000000, faction: "belt", gates: ["sol"] },
  { id: "trappist",  name: "TRAPPIST-1",       x: 0.15, y: 0.30, description: "Ultra-cool red dwarf with seven Earth-sized planets, several in the habitable zone.", population: 95000000, faction: "outer", gates: ["sol"] },
  { id: "barnard",   name: "Barnard's Star",   x: 0.42, y: 0.35, description: "Nearest single star after Alpha Centauri. Quiet research station.", population: 15000000, faction: "belt", gates: ["sol"] },
  { id: "wolf-359",  name: "Wolf 359",         x: 0.68, y: 0.28, description: "Flare star system with defensive outposts.", population: 22000000, faction: "terran", gates: ["sol"] },
  { id: "ross-128",  name: "Ross 128",         x: 0.72, y: 0.55, description: "Quiet system, growing trade presence.", population: 48000000, faction: "independent", gates: ["altair"] },
  { id: "gliese-581", name: "Gliese 581",      x: 0.82, y: 0.35, description: "Exoplanet-rich system, scientific interest.", population: 12000000, faction: "science_collective", gates: ["vega"] },
  { id: "kepler-442", name: "Kepler-442",      x: 0.12, y: 0.35, description: "Earth-like world, major colonization effort.", population: 85000000, faction: "terran", gates: ["sol"] },
  { id: "61-cygni",  name: "61 Cygni",         x: 0.58, y: 0.68, description: "Binary system with independent colonies.", population: 67000000, faction: "independent", gates: ["altair"] },
  { id: "lalande",   name: "Lalande 21185",    x: 0.25, y: 0.18, description: "High-mass star with dense asteroid fields.", population: 18000000, faction: "belt", gates: ["proxima", "alpha-cen"] },
  { id: "wolf-1061", name: "Wolf 1061",        x: 0.38, y: 0.88, description: "Nearby red dwarf with confirmed planets.", population: 19000000, faction: "independent", gates: ["kepler"] },
  { id: "gliese-667", name: "Gliese 667",      x: 0.75, y: 0.82, description: "Triple star system with multiple habitable candidates.", population: 32000000, faction: "outer", gates: ["rigel"] },
  { id: "procyon",   name: "Procyon",          x: 0.45, y: 0.42, description: "Bright binary system with growing industrial presence.", population: 140000000, faction: "independent", gates: ["sol"] }
];

function getSystem(id) {
  return SYSTEMS.find(s => s.id === id) || null;
}

function findRoute(fromId, toId) {
  if (!fromId || !toId) return null;
  if (fromId === toId) return [fromId];

  const graph = {};
  SYSTEMS.forEach(s => {
    graph[s.id] = Array.isArray(s.gates) ? s.gates : [];
  });

  const queue = [[fromId]];
  const visited = new Set([fromId]);

  while (queue.length) {
    const path = queue.shift();
    const current = path[path.length - 1];
    const neighbors = graph[current] || [];

    for (const next of neighbors) {
      if (visited.has(next)) continue;
      const newPath = path.concat(next);
      if (next === toId) return newPath;
      visited.add(next);
      queue.push(newPath);
    }
  }
  return null;
}

// Expose for classic scripts and galaxy map
if (typeof window !== "undefined") {
  window.UNIVERSE = {
    SYSTEMS,
    getSystem,
    findRoute
  };
  // Legacy aliases
  window.SYSTEMS = SYSTEMS;
  window.getSystem = getSystem;
  window.findRoute = findRoute;
}
