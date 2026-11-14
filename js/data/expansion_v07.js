// Massive content expansion for Ideal Umbrella (v0.7)
// Include after additional_content.js and missions_extra.js

// Extra resources
Object.assign(window.RESOURCES || {}, {
  germanium: { id: "germanium", name: "Germanium", icon: "🔲", basePrice: 210, category: "raw" },
  selenium: { id: "selenium", name: "Selenium", icon: "🔳", basePrice: 175, category: "raw" },
  indium: { id: "indium", name: "Indium Ore", icon: "⚪", basePrice: 240, category: "raw" },
  gallium: { id: "gallium", name: "Gallium", icon: "🟦", basePrice: 195, category: "raw" },
  bismuth: { id: "bismuth", name: "Bismuth", icon: "🟣", basePrice: 160, category: "raw" },
  antimony: { id: "antimony", name: "Antimony", icon: "⚫", basePrice: 140, category: "raw" },
  mercury: { id: "mercury", name: "Liquid Mercury", icon: "💧", basePrice: 185, category: "raw" },
  neon_ice: { id: "neon_ice", name: "Neon Ice", icon: "💨", basePrice: 155, category: "raw" },
  argon_ice: { id: "argon_ice", name: "Argon Ice", icon: "💨", basePrice: 130, category: "raw" },
  stellar_dust: { id: "stellar_dust", name: "Stellar Dust", icon: "✨", basePrice: 320, category: "raw" },
  dark_precursor: { id: "dark_precursor", name: "Dark Matter Precursor", icon: "🌑", basePrice: 890, category: "raw" },
  graphene: { id: "graphene", name: "Graphene Sheets", icon: "📄", basePrice: 420, category: "refined" },
  superconductor: { id: "superconductor", name: "Superconductor", icon: "⚡", basePrice: 780, category: "refined" },
  neural_interface: { id: "neural_interface", name: "Neural Interface", icon: "🧠", basePrice: 1450, category: "refined" },
  fusion_parts: { id: "fusion_parts", name: "Fusion Reactor Parts", icon: "🔥", basePrice: 920, category: "refined" },
  plasma_coil: { id: "plasma_coil", name: "Plasma Coil", icon: "🔬", basePrice: 640, category: "refined" },
  singularity_core: { id: "singularity_core", name: "Singularity Core", icon: "🕳️", basePrice: 18500, category: "high" },
  omega_particle: { id: "omega_particle", name: "Omega Particle", icon: "✨", basePrice: 22000, category: "high" },
  chrono_crystal: { id: "chrono_crystal", name: "Chrono Crystal", icon: "⏳", basePrice: 16800, category: "high" },
  void_alloy: { id: "void_alloy", name: "Void Alloy", icon: "🛡️", basePrice: 7400, category: "high" },
  quantum_stabilizer: { id: "quantum_stabilizer", name: "Quantum Stabilizer", icon: "🔮", basePrice: 5600, category: "high" },
  living_circuit: { id: "living_circuit", name: "Living Circuit", icon: "🧬", basePrice: 8900, category: "high" }
});

// Extra ships
Object.assign(window.SHIP_TYPES || {}, {
  battleship: {
    id: "battleship",
    name: "Battleship",
    price: 380000,
    capacity: 60,
    speed: 0.65,
    fuelUse: 2.8,
    fuelEfficiency: 0.45,
    maintenance: 420,
    weapon: 7,
    isCargo: false,
    hasTurret: true,
    hasMissiles: true,
    turrets: 5,
    missileRacks: 5,
    description: "Heavy capital combat vessel with overwhelming firepower."
  },
  exploration_vessel: {
    id: "exploration_vessel",
    name: "Deep Exploration Vessel",
    price: 195000,
    capacity: 45,
    speed: 1.25,
    fuelUse: 1.3,
    fuelEfficiency: 1.1,
    maintenance: 170,
    weapon: 1,
    isCargo: true,
    hasTurret: true,
    hasMissiles: false,
    turrets: 1,
    missileRacks: 0,
    description: "Long-range explorer with advanced sensors and extended fuel capacity."
  },
  trade_barge: {
    id: "trade_barge",
    name: "Trade Barge",
    price: 145000,
    capacity: 220,
    speed: 0.7,
    fuelUse: 1.8,
    fuelEfficiency: 0.6,
    maintenance: 160,
    weapon: 0,
    isCargo: true,
    hasTurret: false,
    hasMissiles: false,
    turrets: 0,
    missileRacks: 0,
    description: "Specialized bulk trader optimized for profitable routes."
  },
  assault_carrier: {
    id: "assault_carrier",
    name: "Assault Carrier",
    price: 510000,
    capacity: 90,
    speed: 0.55,
    fuelUse: 3.5,
    fuelEfficiency: 0.35,
    maintenance: 560,
    weapon: 8,
    isCargo: false,
    hasTurret: true,
    hasMissiles: true,
    turrets: 6,
    missileRacks: 8,
    description: "Mobile strike platform that launches fighter wings."
  },
  science_station: {
    id: "science_station",
    name: "Mobile Science Station",
    price: 340000,
    capacity: 50,
    speed: 0.4,
    fuelUse: 2.2,
    fuelEfficiency: 0.5,
    maintenance: 290,
    weapon: 1,
    isCargo: true,
    hasTurret: true,
    hasMissiles: false,
    turrets: 2,
    missileRacks: 0,
    description: "Self-sufficient research platform for deep-space studies."
  },
  smuggler: {
    id: "smuggler",
    name: "Smuggler",
    price: 78000,
    capacity: 18,
    speed: 1.9,
    fuelUse: 1.6,
    fuelEfficiency: 1.0,
    maintenance: 85,
    weapon: 2,
    isCargo: false,
    hasTurret: true,
    hasMissiles: true,
    turrets: 1,
    missileRacks: 2,
    description: "Fast, low-profile runner built for high-risk contraband runs."
  },
  colony_ship: {
    id: "colony_ship",
    name: "Colony Ship",
    price: 275000,
    capacity: 150,
    speed: 0.6,
    fuelUse: 2.0,
    fuelEfficiency: 0.55,
    maintenance: 240,
    weapon: 1,
    isCargo: true,
    hasTurret: true,
    hasMissiles: false,
    turrets: 1,
    missileRacks: 0,
    description: "Massive vessel designed to seed new colonies with supplies and people."
  },
  interceptor_elite: {
    id: "interceptor_elite",
    name: "Elite Interceptor",
    price: 165000,
    capacity: 6,
    speed: 2.2,
    fuelUse: 1.7,
    fuelEfficiency: 1.05,
    maintenance: 140,
    weapon: 5,
    isCargo: false,
    hasTurret: true,
    hasMissiles: true,
    turrets: 3,
    missileRacks: 2,
    description: "Top-tier pursuit craft with superior speed and armament."
  },
  bulk_processor: {
    id: "bulk_processor",
    name: "Bulk Processor",
    price: 390000,
    capacity: 380,
    speed: 0.5,
    fuelUse: 2.6,
    fuelEfficiency: 0.48,
    maintenance: 310,
    weapon: 1,
    isCargo: true,
    hasTurret: true,
    hasMissiles: false,
    turrets: 1,
    missileRacks: 0,
    description: "Onboard refining plant that processes raw ore into valuable materials."
  },
  diplomatic_envoy: {
    id: "diplomatic_envoy",
    name: "Diplomatic Envoy",
    price: 210000,
    capacity: 20,
    speed: 1.3,
    fuelUse: 1.2,
    fuelEfficiency: 0.95,
    maintenance: 180,
    weapon: 1,
    isCargo: false,
    hasTurret: true,
    hasMissiles: false,
    turrets: 2,
    missileRacks: 0,
    description: "Luxury vessel used for high-level faction negotiations."
  }
});

// Extra factions
Object.assign(window.FACTIONS || {}, {
  trade_syndicate: {
    id: "trade_syndicate",
    name: "Trade Syndicate",
    description: "Shadowy cartel controlling black-market routes and exotic goods.",
    color: "#8b4513",
    startingRep: 25,
    preferredGoods: ["luxury_goods", "dark_ore", "void_crystal", "omega_particle"]
  },
  rebel_alliance: {
    id: "rebel_alliance",
    name: "Rebel Alliance",
    description: "Loose coalition of independent systems resisting central control.",
    color: "#ff4500",
    startingRep: 30,
    preferredGoods: ["explosives", "armor_plates", "food_rations", "weapons"]
  },
  ancient_guardians: {
    id: "ancient_guardians",
    name: "Ancient Guardians",
    description: "Mysterious order protecting precursor artifacts and knowledge.",
    color: "#4b0082",
    startingRep: 15,
    preferredGoods: ["void_crystal", "chrono_crystal", "singularity_fragment", "research_data"]
  },
  megacorp: {
    id: "megacorp",
    name: "MegaCorp Consortium",
    description: "Powerful interstellar corporations dominating trade and industry.",
    color: "#1e90ff",
    startingRep: 40,
    preferredGoods: ["electronics", "advanced_circuit", "quantum_chip", "luxury_goods"]
  },
  nomad_clans: {
    id: "nomad_clans",
    name: "Nomad Clans",
    description: "Wanderers living aboard massive generational ships.",
    color: "#daa520",
    startingRep: 35,
    preferredGoods: ["food_rations", "water", "fuel", "biomass"]
  },
  stellar_cult: {
    id: "stellar_cult",
    name: "Stellar Cult",
    description: "Religious order worshipping stellar phenomena and cosmic cycles.",
    color: "#9932cc",
    startingRep: 20,
    preferredGoods: ["stellar_dust", "helium3", "research_data", "chrono_crystal"]
  }
});

// Extra mission templates
if (window.MISSION_TEMPLATES) {
  window.MISSION_TEMPLATES.push(
    {
      id: "omega-delivery",
      type: "delivery",
      title: "Omega Particle Courier",
      description: "Deliver a sealed Omega Particle container to a secure facility. Extreme caution required.",
      reward: 45000,
      reputation: 15,
      cargo: { omega_particle: 1 },
      destination: "rigel",
      difficulty: "extreme",
      faction: "ancient_guardians"
    },
    {
      id: "void-alloy-haul",
      type: "hauling",
      title: "Void Alloy Shipment",
      description: "Transport large quantities of Void Alloy for a classified project.",
      reward: 28000,
      reputation: 10,
      cargo: { void_alloy: 40 },
      destination: "deneb",
      difficulty: "high",
      faction: "trade_syndicate"
    },
    {
      id: "chrono-research",
      type: "scientific",
      title: "Chrono Crystal Study",
      description: "Escort a research team and their Chrono Crystal samples to a deep-space observatory.",
      reward: 32000,
      reputation: 12,
      cargo: { chrono_crystal: 2, research_data: 5 },
      destination: "wise-0855",
      difficulty: "high",
      faction: "science_collective"
    },
    {
      id: "colony-supplies",
      type: "delivery",
      title: "Emergency Colony Resupply",
      description: "Deliver critical supplies to a struggling frontier colony.",
      reward: 18000,
      reputation: 8,
      cargo: { food_rations: 80, water: 60, pharmaceuticals: 20 },
      destination: "hd-40307",
      difficulty: "medium",
      faction: "outer"
    },
    {
      id: "smuggler-run",
      type: "delivery",
      title: "Quiet Delivery",
      description: "Move restricted goods past inspection points without attracting attention.",
      reward: 22000,
      reputation: -5,
      cargo: { dark_ore: 15, void_crystal: 5 },
      destination: "betelgeuse",
      difficulty: "high",
      faction: "trade_syndicate"
    },
    {
      id: "diplomatic-escort",
      type: "diplomatic",
      title: "High-Value Envoy",
      description: "Escort a diplomatic mission through contested space.",
      reward: 35000,
      reputation: 18,
      cargo: { luxury_goods: 5 },
      destination: "polaris",
      difficulty: "high",
      faction: "stellar_cult"
    },
    {
      id: "living-circuit-order",
      type: "hauling",
      title: "Living Circuit Contract",
      description: "Supply Living Circuits to a bio-tech research facility.",
      reward: 26000,
      reputation: 9,
      cargo: { living_circuit: 12 },
      destination: "gliese-667",
      difficulty: "medium",
      faction: "bio_collective"
    },
    {
      id: "singularity-extraction",
      type: "exploration",
      title: "Singularity Core Recovery",
      description: "Recover a damaged Singularity Core from a derelict vessel in deep space.",
      reward: 52000,
      reputation: 20,
      cargo: { singularity_core: 1 },
      destination: "deneb",
      difficulty: "extreme",
      faction: "ancient_guardians"
    }
  );
}

console.log("Expansion v0.7 loaded: +22 resources, +10 ships, +6 factions, +8 missions");
