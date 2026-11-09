// Comprehensive resources and crafting system for Ideal Umbrella / Space Pack
// Massively expanded resource catalog and recipes.

export const RESOURCES = {
  // Raw materials
  iron_ore: { id: "iron_ore", name: "Iron Ore", icon: "🪨", category: "raw", baseValue: 12 },
  copper_ore: { id: "copper_ore", name: "Copper Ore", icon: "🟠", category: "raw", baseValue: 15 },
  gold_ore: { id: "gold_ore", name: "Gold Ore", icon: "🟡", category: "raw", baseValue: 80 },
  titanium_ore: { id: "titanium_ore", name: "Titanium Ore", icon: "⚙️", category: "raw", baseValue: 45 },
  uranium_ore: { id: "uranium_ore", name: "Uranium Ore", icon: "☢️", category: "raw", baseValue: 120 },
  silicon: { id: "silicon", name: "Silicon", icon: "💠", category: "raw", baseValue: 18 },
  ice: { id: "ice", name: "Ice", icon: "🧊", category: "raw", baseValue: 8 },
  crystal: { id: "crystal", name: "Crystal", icon: "💎", category: "raw", baseValue: 55 },
  quartz: { id: "quartz", name: "Quartz", icon: "🔮", category: "raw", baseValue: 22 },
  cellulose: { id: "cellulose", name: "Cellulose", icon: "🌿", category: "raw", baseValue: 10 },
  hydrogen: { id: "hydrogen", name: "Hydrogen", icon: "💧", category: "raw", baseValue: 6 },
  oxygen: { id: "oxygen", name: "Oxygen", icon: "🌬️", category: "raw", baseValue: 7 },

  // Refined materials
  refined_iron: { id: "refined_iron", name: "Refined Iron", icon: "🔩", category: "refined", baseValue: 28 },
  refined_copper: { id: "refined_copper", name: "Refined Copper", icon: "🔋", category: "refined", baseValue: 32 },
  refined_gold: { id: "refined_gold", name: "Refined Gold", icon: "🪙", category: "refined", baseValue: 160 },
  refined_titanium: { id: "refined_titanium", name: "Refined Titanium", icon: "🛡️", category: "refined", baseValue: 95 },
  pure_silicon: { id: "pure_silicon", name: "Pure Silicon", icon: "📊", category: "refined", baseValue: 40 },
  plastic: { id: "plastic", name: "Plastic", icon: "🪴", category: "refined", baseValue: 25 },
  alloy: { id: "alloy", name: "Alloy", icon: "⚙️", category: "refined", baseValue: 50 },
  fertilizer: { id: "fertilizer", name: "Fertilizer", icon: "🌱", category: "refined", baseValue: 18 },
  liquid_hydrogen: { id: "liquid_hydrogen", name: "Liquid Hydrogen", icon: "💨", category: "fuel", baseValue: 20 },
  liquid_oxygen: { id: "liquid_oxygen", name: "Liquid Oxygen", icon: "💦", category: "fuel", baseValue: 22 },
  fuel_cell: { id: "fuel_cell", name: "Fuel Cell", icon: "⛽", category: "fuel", baseValue: 45 },
  antimatter: { id: "antimatter", name: "Antimatter", icon: "⚡", category: "fuel", baseValue: 500 },

  // Components
  circuit: { id: "circuit", name: "Circuit", icon: "🔌", category: "component", baseValue: 75 },
  sensor: { id: "sensor", name: "Sensor Array", icon: "📡", category: "component", baseValue: 120 },
  thruster: { id: "thruster", name: "Thruster", icon: "🚀", category: "component", baseValue: 200 },
  hull_plate: { id: "hull_plate", name: "Hull Plate", icon: "🛡️", category: "component", baseValue: 85 },
  computer_core: { id: "computer_core", name: "Computer Core", icon: "💻", category: "component", baseValue: 180 },
  life_support: { id: "life_support", name: "Life Support Module", icon: "💚", category: "component", baseValue: 150 },
  reactor: { id: "reactor", name: "Fusion Reactor", icon: "⚛️", category: "component", baseValue: 800 },
  quantum_chip: { id: "quantum_chip", name: "Quantum Chip", icon: "🔬", category: "component", baseValue: 350 },

  // Advanced / special
  cellulose_quartz: { id: "cellulose_quartz", name: "Cellulose-Quartz Composite", icon: "🌻", category: "advanced", baseValue: 65 },
  nano_weave: { id: "nano_weave", name: "Nano Weave", icon: "🧵", category: "advanced", baseValue: 220 },
  exotic_matter: { id: "exotic_matter", name: "Exotic Matter", icon: "🌌", category: "advanced", baseValue: 1200 },
  data_core: { id: "data_core", name: "Data Core", icon: "💾", category: "advanced", baseValue: 280 },
  medical_supplies: { id: "medical_supplies", name: "Medical Supplies", icon: "💊", category: "consumer", baseValue: 40 },
  luxury_goods: { id: "luxury_goods", name: "Luxury Goods", icon: "💎", category: "consumer", baseValue: 150 },
  food_rations: { id: "food_rations", name: "Food Rations", icon: "🍜", category: "consumer", baseValue: 15 }
};

export const CRAFTING_RECIPES = [
  { id: "smelt-iron", name: "Smelt Iron", inputs: ["iron_ore", "fuel_cell"], output: "refined_iron", time: 5 },
  { id: "smelt-copper", name: "Smelt Copper", inputs: ["copper_ore", "fuel_cell"], output: "refined_copper", time: 5 },
  { id: "smelt-titanium", name: "Smelt Titanium", inputs: ["titanium_ore", "fuel_cell", "refined_iron"], output: "refined_titanium", time: 8 },
  { id: "make-alloy", name: "Forge Alloy", inputs: ["refined_iron", "refined_copper"], output: "alloy", time: 6 },
  { id: "make-plastic", name: "Synthesize Plastic", inputs: ["cellulose", "hydrogen"], output: "plastic", time: 4 },
  { id: "make-circuit", name: "Assemble Circuit", inputs: ["pure_silicon", "refined_copper", "crystal"], output: "circuit", time: 7 },
  { id: "make-fuel", name: "Refine Fuel Cell", inputs: ["liquid_hydrogen", "liquid_oxygen"], output: "fuel_cell", time: 3 },
  { id: "make-sensor", name: "Build Sensor Array", inputs: ["circuit", "crystal", "refined_titanium"], output: "sensor", time: 10 },
  { id: "make-thruster", name: "Build Thruster", inputs: ["alloy", "fuel_cell", "circuit"], output: "thruster", time: 12 },
  { id: "make-hull", name: "Fabricate Hull Plate", inputs: ["refined_titanium", "alloy"], output: "hull_plate", time: 8 },
  { id: "make-core", name: "Assemble Computer Core", inputs: ["circuit", "quantum_chip", "pure_silicon"], output: "computer_core", time: 15 },
  { id: "make-life", name: "Build Life Support", inputs: ["plastic", "circuit", "oxygen"], output: "life_support", time: 9 },
  { id: "make-fertilizer", name: "Process Fertilizer", inputs: ["cellulose", "ice", "refined_iron"], output: "fertilizer", time: 4 },
  { id: "make-composite", name: "Create Cellulose-Quartz", inputs: ["cellulose", "quartz"], output: "cellulose_quartz", time: 6 },
  { id: "make-nano", name: "Weave Nano Material", inputs: ["pure_silicon", "refined_gold", "crystal"], output: "nano_weave", time: 20 },
  { id: "make-quantum", name: "Fabricate Quantum Chip", inputs: ["pure_silicon", "crystal", "refined_gold"], output: "quantum_chip", time: 18 },
  { id: "make-reactor", name: "Assemble Fusion Reactor", inputs: ["refined_uranium", "computer_core", "hull_plate", "thruster"], output: "reactor", time: 40 },
  { id: "make-data", name: "Encode Data Core", inputs: ["circuit", "quantum_chip"], output: "data_core", time: 12 },
  { id: "make-medical", name: "Produce Medical Supplies", inputs: ["cellulose_quartz", "oxygen", "crystal"], output: "medical_supplies", time: 5 },
  { id: "make-rations", name: "Synthesize Food Rations", inputs: ["fertilizer", "ice", "cellulose"], output: "food_rations", time: 3 },
  { id: "make-luxury", name: "Craft Luxury Goods", inputs: ["refined_gold", "crystal", "nano_weave"], output: "luxury_goods", time: 15 },
  { id: "liquefy-h", name: "Liquefy Hydrogen", inputs: ["hydrogen", "fuel_cell"], output: "liquid_hydrogen", time: 2 },
  { id: "liquefy-o", name: "Liquefy Oxygen", inputs: ["oxygen", "fuel_cell"], output: "liquid_oxygen", time: 2 },
  { id: "purify-silicon", name: "Purify Silicon", inputs: ["silicon", "fuel_cell"], output: "pure_silicon", time: 6 }
];

export function getResource(id) {
  return RESOURCES[id] || null;
}

export function getRecipe(id) {
  return CRAFTING_RECIPES.find(r => r.id === id) || null;
}
