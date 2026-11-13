// Additional content expansion for Ideal Umbrella (v0.6)
// Include this after resources.js and missions.js for extra depth

// Extra resources (append to window.RESOURCES)
Object.assign(window.RESOURCES || {}, {
  rhodium: { id: "rhodium", name: "Rhodium Ore", icon: "⚪", basePrice: 410, category: "raw" },
  rhenium: { id: "rhenium", name: "Rhenium Ore", icon: "⚪", basePrice: 290, category: "raw" },
  molybdenum: { id: "molybdenum", name: "Molybdenum Ore", icon: "🔘", basePrice: 130, category: "raw" },
  vanadium: { id: "vanadium", name: "Vanadium Ore", icon: "🟠", basePrice: 140, category: "raw" },
  niobium: { id: "niobium", name: "Niobium Ore", icon: "⚪", basePrice: 220, category: "raw" },
  tellurium: { id: "tellurium", name: "Tellurium", icon: "⚫", basePrice: 190, category: "raw" },
  xenon: { id: "xenon", name: "Xenon Ice", icon: "💨", basePrice: 160, category: "raw" },
  krypton: { id: "krypton", name: "Krypton Ice", icon: "💨", basePrice: 145, category: "raw" },
  nitrogen_ice: { id: "nitrogen_ice", name: "Nitrogen Ice", icon: "❄️", basePrice: 30, category: "raw" },
  carbon_dioxide_ice: { id: "carbon_dioxide_ice", name: "CO2 Ice", icon: "❄️", basePrice: 28, category: "raw" },
  organic_sludge: { id: "organic_sludge", name: "Organic Sludge", icon: "🟤", basePrice: 25, category: "raw" },
  spores: { id: "spores", name: "Alien Spores", icon: "🍄", basePrice: 85, category: "raw" },
  dark_ore: { id: "dark_ore", name: "Dark Ore", icon: "⬛", basePrice: 480, category: "raw" },
  void_crystal: { id: "void_crystal", name: "Void Crystal", icon: "💜", basePrice: 620, category: "raw" },
  plasma_cell: { id: "plasma_cell", name: "Plasma Cell", icon: "⚡", basePrice: 520, category: "refined" },
  quantum_processor: { id: "quantum_processor", name: "Quantum Processor", icon: "💻", basePrice: 1800, category: "refined" },
  superalloy: { id: "superalloy", name: "Superalloy", icon: "⚙️", basePrice: 450, category: "refined" },
  cryo_fuel: { id: "cryo_fuel", name: "Cryo Fuel", icon: "❄️", basePrice: 210, category: "refined" },
  nano_armor: { id: "nano_armor", name: "Nano Armor", icon: "🛡️", basePrice: 680, category: "refined" },
  dark_matter_sample: { id: "dark_matter_sample", name: "Dark Matter Sample", icon: "🌌", basePrice: 7200, category: "high" },
  living_metal: { id: "living_metal", name: "Living Metal", icon: "🧬", basePrice: 5400, category: "high" },
  consciousness_matrix: { id: "consciousness_matrix", name: "Consciousness Matrix", icon: "🧠", basePrice: 9100, category: "high" },
  zero_point_module: { id: "zero_point_module", name: "Zero Point Module", icon: "✨", basePrice: 12000, category: "high" },
  stellar_core_fragment: { id: "stellar_core_fragment", name: "Stellar Core Fragment", icon: "🌟", basePrice: 15000, category: "high" }
});

// Extra ships
Object.assign(window.SHIP_TYPES || {}, {
  carrier: {
    id: "carrier",
    name: "Fleet Carrier",
    price: 420000,
    capacity: 80,
    speed: 0.5,
    fuelUse: 3.2,
    fuelEfficiency: 0.4,
    maintenance: 480,
    weapon: 6,
    isCargo: false,
    hasTurret: true,
    hasMissiles: true,
    turrets: 4,
    missileRacks: 6,
    description: "Mobile base that deploys smaller craft. Heavy firepower and hangar capacity."
  },
  stealth_bomber: {
    id: "stealth_bomber",
    name: "Stealth Bomber",
    price: 185000,
    capacity: 12,
    speed: 1.7,
    fuelUse: 1.9,
    fuelEfficiency: 0.85,
    maintenance: 160,
    weapon: 4,
    isCargo: false,
    hasTurret: true,
    hasMissiles: true,
    turrets: 1,
    missileRacks: 3,
    description: "Low-signature strike craft for high-risk interdiction missions."
  },
  mining_mothership: {
    id: "mining_mothership",
    name: "Mining Mothership",
    price: 310000,
    capacity: 450,
    speed: 0.45,
    fuelUse: 2.8,
    fuelEfficiency: 0.45,
    maintenance: 340,
    weapon: 1,
    isCargo: true,
    hasTurret: true,
    hasMissiles: false,
    turrets: 1,
    missileRacks: 0,
    description: "Massive ore processor with onboard refining and defensive turret."
  },
  research_cruiser: {
    id: "research_cruiser",
    name: "Research Cruiser",
    price: 220000,
    capacity: 35,
    speed: 1.15,
    fuelUse: 1.4,
    fuelEfficiency: 0.9,
    maintenance: 190,
    weapon: 1,
    isCargo: true,
    hasTurret: true,
    hasMissiles: false,
    turrets: 1,
    missileRacks: 0,
    description: "Advanced science platform with labs, sensors, and light defense."
  },
  luxury_cruiser: {
    id: "luxury_cruiser",
    name: "Luxury Cruiser",
    price: 280000,
    capacity: 25,
    speed: 1.35,
    fuelUse: 1.5,
    fuelEfficiency: 0.7,
    maintenance: 210,
    weapon: 2,
    isCargo: false,
    hasTurret: true,
    hasMissiles: true,
    turrets: 2,
    missileRacks: 1,
    description: "High-end passenger and VIP transport with excellent defenses."
  }
});

// Extra factions
Object.assign(window.FACTIONS || {}, {
  merchant_guild: {
    id: "merchant_guild",
    name: "Merchant Guild",
    description: "Powerful association of traders controlling key shipping routes.",
    color: "#ffd700",
    startingRep: 45,
    preferredGoods: ["luxury_goods", "electronics", "gold"]
  },
  military_order: {
    id: "military_order",
    name: "Military Order",
    description: "Disciplined warrior faction maintaining security across systems.",
    color: "#8b0000",
    startingRep: 35,
    preferredGoods: ["armor_plates", "thrusters", "explosives"]
  },
  bio_collective: {
    id: "bio_collective",
    name: "Bio Collective",
    description: "Researchers focused on organic technology and living materials.",
    color: "#32cd32",
    startingRep: 40,
    preferredGoods: ["biomass", "biogel", "living_metal"]
  },
  void_walkers: {
    id: "void_walkers",
    name: "Void Walkers",
    description: "Mysterious explorers of the deepest space anomalies.",
    color: "#4b0082",
    startingRep: 20,
    preferredGoods: ["void_crystal", "dark_matter_sample", "singularity_fragment"]
  }
});

console.log("Additional content loaded: +24 resources, +5 ships, +4 factions");
