// Canonical game data for Space Pack / Ideal Umbrella
// Single source of truth for resources, crafting, ships, and factions.
// Loaded as a classic <script> so index.html, transport.html, etc. all share the same globals.

window.RESOURCES = {
  iron: { id: "iron", name: "Iron Ore", icon: "🪨", basePrice: 40, category: "raw" },
  ice: { id: "ice", name: "Water Ice", icon: "🧊", basePrice: 25, category: "raw" },
  crystal: { id: "crystal", name: "Crystal", icon: "💎", basePrice: 120, category: "raw" },
  uranium: { id: "uranium", name: "Uranium Ore", icon: "☢️", basePrice: 280, category: "raw" },
  titanium: { id: "titanium", name: "Titanium Ore", icon: "⚙️", basePrice: 90, category: "raw" },
  silicon: { id: "silicon", name: "Silicon", icon: "🟦", basePrice: 60, category: "raw" },
  fuel: { id: "fuel", name: "Fuel Cell", icon: "⛽", basePrice: 80, category: "refined" },
  alloy: { id: "alloy", name: "Alloy", icon: "⚙️", basePrice: 150, category: "refined" },
  circuit: { id: "circuit", name: "Circuit", icon: "🔌", basePrice: 220, category: "refined" },
  plastic: { id: "plastic", name: "Plastic", icon: "📦", basePrice: 70, category: "refined" },
  oxygen: { id: "oxygen", name: "Liquid Oxygen", icon: "🧊", basePrice: 45, category: "refined" },
  hydrogen: { id: "hydrogen", name: "Liquid Hydrogen", icon: "💧", basePrice: 55, category: "refined" },
  gold: { id: "gold", name: "Refined Gold", icon: "💰", basePrice: 450, category: "refined" },
  fertilizer: { id: "fertilizer", name: "Fertilizer", icon: "🌱", basePrice: 65, category: "refined" },
  advanced_circuit: { id: "advanced_circuit", name: "Advanced Circuit", icon: "💻", basePrice: 480, category: "high" },
  antimatter: { id: "antimatter", name: "Antimatter Cell", icon: "⚡", basePrice: 2500, category: "high" }
};

window.CRAFTING_RECIPES = [
  { id: "smelt-alloy", name: "Smelt Alloy", inputs: ["iron", "fuel"], output: "alloy", time: 5 },
  { id: "make-circuit", name: "Assemble Circuit", inputs: ["crystal", "iron"], output: "circuit", time: 8 },
  { id: "refine-fuel", name: "Refine Fuel", inputs: ["ice", "crystal"], output: "fuel", time: 6 },
  { id: "make-plastic", name: "Synthesize Plastic", inputs: ["silicon", "fuel"], output: "plastic", time: 7 },
  { id: "extract-oxygen", name: "Extract Oxygen", inputs: ["ice"], output: "oxygen", time: 4 },
  { id: "make-advanced", name: "Advanced Circuit", inputs: ["circuit", "gold", "silicon"], output: "advanced_circuit", time: 15 },
  { id: "process-uranium", name: "Process Uranium", inputs: ["uranium", "alloy"], output: "antimatter", time: 30 }
];

// Unified ship catalog (simulator + transport)
window.SHIP_TYPES = {
  scout: {
    id: "scout",
    name: "Scout",
    price: 8000,
    capacity: 5,
    speed: 1.6,
    fuelUse: 0.8,
    fuelEfficiency: 1.4,
    maintenance: 20,
    weapon: 1,
    description: "Fast reconnaissance vessel. Low cargo, high speed."
  },
  courier: {
    id: "courier",
    name: "Courier",
    price: 12000,
    capacity: 12,
    speed: 1.4,
    fuelUse: 1.0,
    fuelEfficiency: 1.2,
    maintenance: 35,
    weapon: 1,
    description: "Agile delivery ship for small high-value cargo."
  },
  interceptor: {
    id: "interceptor",
    name: "Interceptor",
    price: 28000,
    capacity: 8,
    speed: 1.8,
    fuelUse: 1.4,
    fuelEfficiency: 1.1,
    maintenance: 55,
    weapon: 3,
    description: "High-speed combat-capable ship with light cargo."
  },
  hauler: {
    id: "hauler",
    name: "Hauler",
    price: 25000,
    capacity: 40,
    speed: 1.0,
    fuelUse: 1.2,
    fuelEfficiency: 0.9,
    maintenance: 65,
    weapon: 1,
    description: "Reliable mid-size freighter."
  },
  freighter: {
    id: "freighter",
    name: "Freighter",
    price: 55000,
    capacity: 120,
    speed: 0.75,
    fuelUse: 1.5,
    fuelEfficiency: 0.7,
    maintenance: 110,
    weapon: 2,
    description: "Heavy cargo carrier for bulk goods."
  },
  miner: {
    id: "miner",
    name: "Mining Rig",
    price: 42000,
    capacity: 60,
    speed: 0.9,
    fuelUse: 1.6,
    fuelEfficiency: 0.8,
    maintenance: 90,
    weapon: 1,
    description: "Specialized mining vessel with ore processing bays."
  },
  liner: {
    id: "liner",
    name: "Passenger Liner",
    price: 90000,
    capacity: 30,
    speed: 1.1,
    fuelUse: 1.3,
    fuelEfficiency: 0.6,
    maintenance: 140,
    weapon: 1,
    description: "Passenger and luxury goods transport. High maintenance."
  },
  capital: {
    id: "capital",
    name: "Capital Ship",
    price: 250000,
    capacity: 200,
    speed: 0.6,
    fuelUse: 2.5,
    fuelEfficiency: 0.5,
    maintenance: 300,
    weapon: 5,
    description: "Massive bulk carrier and flagship. Slow but enormous capacity."
  }
};

window.getShipType = function (id) {
  return window.SHIP_TYPES[id] || null;
};

// Unified factions (matches universe.js faction ids + simulator reputation)
window.FACTIONS = {
  terran: {
    id: "terran",
    name: "Terran Confederation",
    description: "Earth’s unified government. Controls Sol and major ports.",
    color: "#4a90d9",
    startingRep: 50,
    preferredGoods: ["circuit", "fuel", "alloy"]
  },
  martian: {
    id: "martian",
    name: "Martian Republic",
    description: "Independent terraforming colonies on Mars and its moons.",
    color: "#c45c26",
    startingRep: 40,
    preferredGoods: ["fertilizer", "iron", "oxygen"]
  },
  belt: {
    id: "belt",
    name: "Belt Miners’ Union",
    description: "Asteroid prospectors and ore haulers of the main belt.",
    color: "#8b7355",
    startingRep: 45,
    preferredGoods: ["iron", "titanium", "fuel"]
  },
  jovian: {
    id: "jovian",
    name: "Jovian Syndicate",
    description: "Corporate power bloc based around the gas giants.",
    color: "#d4af37",
    startingRep: 35,
    preferredGoods: ["hydrogen", "gold", "alloy"]
  },
  outer: {
    id: "outer",
    name: "Outer Colonies League",
    description: "Distant settlements beyond the belt, always short on supplies.",
    color: "#6b8e6b",
    startingRep: 30,
    preferredGoods: ["fertilizer", "fuel", "ice"]
  },
  pirate: {
    id: "pirate",
    name: "Pirate Clans",
    description: "Raiders and smugglers who respect strength and coin.",
    color: "#a33",
    startingRep: 15,
    preferredGoods: ["alloy", "fuel", "gold"]
  },
  independent: {
    id: "independent",
    name: "Independent",
    description: "Unaffiliated traders, stations, and free captains.",
    color: "#888",
    startingRep: 50,
    preferredGoods: ["alloy", "fuel", "circuit"]
  },
  alpha: {
    id: "alpha",
    name: "Alpha Cooperative",
    description: "Trade-focused alliance in the Alpha Centauri system.",
    color: "#2e8b57",
    startingRep: 50,
    preferredGoods: ["circuit", "plastic", "silicon"]
  },
  sirius_mining: {
    id: "sirius_mining",
    name: "Sirius Mining Corp",
    description: "Industrial resource extraction conglomerate.",
    color: "#708090",
    startingRep: 42,
    preferredGoods: ["titanium", "uranium", "iron"]
  },
  science_collective: {
    id: "science_collective",
    name: "Science Collective",
    description: "Research-focused group operating out of Rigel and beyond.",
    color: "#6a5acd",
    startingRep: 48,
    preferredGoods: ["crystal", "advanced_circuit", "antimatter"]
  }
};

window.getFaction = function (id) {
  return window.FACTIONS[id] || null;
};
