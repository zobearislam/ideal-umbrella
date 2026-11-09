// Expanded resources, crafting, and economy data for Space Pack
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

window.SHIP_TYPES = {
  scout: { name: "Scout", price: 8000, capacity: 5, speed: 1.6, fuelUse: 0.8, weapon: 1 },
  courier: { name: "Courier", price: 12000, capacity: 12, speed: 1.4, fuelUse: 1.0, weapon: 1 },
  interceptor: { name: "Interceptor", price: 28000, capacity: 8, speed: 1.8, fuelUse: 1.4, weapon: 3 },
  hauler: { name: "Hauler", price: 25000, capacity: 40, speed: 1.0, fuelUse: 1.2, weapon: 1 },
  freighter: { name: "Freighter", price: 55000, capacity: 120, speed: 0.75, fuelUse: 1.5, weapon: 2 },
  miner: { name: "Mining Rig", price: 42000, capacity: 60, speed: 0.9, fuelUse: 1.6, weapon: 1 },
  liner: { name: "Passenger Liner", price: 90000, capacity: 30, speed: 1.1, fuelUse: 1.3, weapon: 1 },
  capital: { name: "Capital Ship", price: 250000, capacity: 200, speed: 0.6, fuelUse: 2.5, weapon: 5 }
};

window.FACTIONS = {
  terran: { id: "terran", name: "Terran Confederation", color: "#4a90d9" },
  martian: { id: "martian", name: "Martian Republic", color: "#c45c26" },
  belt: { id: "belt", name: "Belt Miners’ Union", color: "#8b7355" },
  jovian: { id: "jovian", name: "Jovian Syndicate", color: "#d4af37" },
  outer: { id: "outer", name: "Outer Colonies League", color: "#6b8e6b" },
  pirate: { id: "pirate", name: "Pirate Clans", color: "#a33" },
  independent: { id: "independent", name: "Independent", color: "#888" }
};
