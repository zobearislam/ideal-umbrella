
export const starSystems = [
  {
    id: "sol",
    name: "Sol",
    description: "Humanity's home system.",
    connections: ["alpha"]
  },
  {
    id: "alpha",
    name: "Alpha Centauri",
    description: "A nearby triple-star system.",
    connections: ["sol", "sirius"]
  },
  {
    id: "sirius",
    name: "Sirius",
    description: "A bright nearby star system.",
    connections: ["alpha", "vega"]
  },
  {
    id: "vega",
    name: "Vega",
    description: "A major navigational destination.",
    connections: ["sirius", "altair"]
  },
  {
    id: "altair",
    name: "Altair",
    description: "A nearby star system.",
    connections: ["vega", "rigel"]
  },
  {
    id: "rigel",
    name: "Rigel",
    description: "A distant stellar destination.",
    connections: ["altair", "kepler"]
  },
  {
    id: "kepler",
    name: "Kepler",
    description: "An exploration destination.",
    connections: ["rigel"]
  }
];

export function getSystem(id) {
  return starSystems.find(system => system.id === id) || null;
}

export function findRoute(startId, destinationId) {
  if (!getSystem(startId) || !getSystem(destinationId)) return null;
  if (startId === destinationId) return [startId];

  const queue = [[startId]];
  const visited = new Set([startId]);

  while (queue.length) {
    const path = queue.shift();
    const current = getSystem(path[path.length - 1]);

    for (const nextId of current.connections) {
      if (visited.has(nextId)) continue;

      const nextPath = [...path, nextId];

      if (nextId === destinationId) return nextPath;

      visited.add(nextId);
      queue.push(nextPath);
    }
  }

  return null;
}
