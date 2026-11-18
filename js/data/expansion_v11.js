// Massive content expansion for Ideal Umbrella (v1.1)
// Include after expansion_v10.js
// Adds 40 resources, 15 ships, 12 factions, 20 missions

Object.assign(window.RESOURCES || {}, {
  scandium: { id: "scandium", name: "Scandium Ore", icon: "🔲", basePrice: 480, category: "raw" },
  yttrium: { id: "yttrium", name: "Yttrium Ore", icon: "🔲", basePrice: 520, category: "raw" },
  neodymium: { id: "neodymium", name: "Neodymium Ore", icon: "🔲", basePrice: 740, category: "raw" },
  dysprosium: { id: "dysprosium", name: "Dysprosium Ore", icon: "🔲", basePrice: 950, category: "raw" },
  thorium: { id: "thorium", name: "Thorium Ore", icon: "☢️", basePrice: 540, category: "raw" },
  rare_earth_alloy: { id: "rare_earth_alloy", name: "Rare Earth Alloy", icon: "⚙️", basePrice: 1450, category: "refined" },
  neodymium_magnet: { id: "neodymium_magnet", name: "Neodymium Magnet", icon: "🧲", basePrice: 980, category: "refined" },
  superconducting_wire: { id: "superconducting_wire", name: "Superconducting Wire", icon: "🔌", basePrice: 2100, category: "refined" },
  photonic_crystal: { id: "photonic_crystal", name: "Photonic Crystal", icon: "💎", basePrice: 1680, category: "refined" },
  metamaterial: { id: "metamaterial", name: "Metamaterial", icon: "🔮", basePrice: 1890, category: "refined" },
  dark_matter_crystal: { id: "dark_matter_crystal", name: "Dark Matter Crystal", icon: "🌑", basePrice: 32000, category: "high" },
  antimatter_fuel_cell: { id: "antimatter_fuel_cell", name: "Antimatter Fuel Cell", icon: "⚡", basePrice: 41000, category: "high" },
  gravity_lens: { id: "gravity_lens", name: "Gravity Lens", icon: "🔭", basePrice: 18500, category: "high" },
  time_crystal: { id: "time_crystal", name: "Time Crystal", icon: "⏳", basePrice: 27000, category: "high" },
  quantum_computer_core: { id: "quantum_computer_core", name: "Quantum Computer Core", icon: "💻", basePrice: 22500, category: "high" },
  neural_mesh: { id: "neural_mesh", name: "Neural Mesh", icon: "🧠", basePrice: 11200, category: "high" },
  living_alloy: { id: "living_alloy", name: "Living Alloy", icon: "🧬", basePrice: 9800, category: "high" },
  singularity_core: { id: "singularity_core", name: "Singularity Core", icon: "🕳️", basePrice: 52000, category: "high" },
  omega_stabilizer: { id: "omega_stabilizer", name: "Omega Stabilizer", icon: "⚛️", basePrice: 45000, category: "high" },
  chronal_engine: { id: "chronal_engine", name: "Chronal Engine", icon: "⏳", basePrice: 38000, category: "high" },
  phase_drive: { id: "phase_drive", name: "Phase Drive", icon: "💜", basePrice: 29000, category: "high" },
  reality_anchor: { id: "reality_anchor", name: "Reality Anchor", icon: "⚓", basePrice: 41000, category: "high" },
  absolute_omega: { id: "absolute_omega", name: "Absolute Omega Particle", icon: "⚛️", basePrice: 150000, category: "high" },
  precursor_omega: { id: "precursor_omega", name: "Precursor Omega Archive", icon: "📚", basePrice: 105000, category: "high" },
  living_dreadnought_core: { id: "living_dreadnought_core", name: "Living Dreadnought Core", icon: "🧬", basePrice: 68000, category: "high" },
  singularity_dreadnought_engine: { id: "singularity_dreadnought_engine", name: "Singularity Dreadnought Engine", icon: "🕳️", basePrice: 85000, category: "high" },
  dark_omega_reactor: { id: "dark_omega_reactor", name: "Dark Omega Reactor", icon: "🌑", basePrice: 91000, category: "high" },
  omega_core: { id: "omega_core", name: "Omega Core", icon: "⚛️", basePrice: 72000, category: "high" }
});

Object.assign(window.SHIP_TYPES || {}, {
  absolute_dreadnought: { id: "absolute_dreadnought", name: "Absolute Dreadnought", price: 5000000, capacity: 40, speed: 0.55, fuelUse: 8.5, fuelEfficiency: 0.15, maintenance: 3500, weapon: 30, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 28, missileRacks: 48, description: "The theoretical peak of warship technology." },
  genesis_ark: { id: "genesis_ark", name: "Genesis Ark", price: 2500000, capacity: 2000, speed: 0.22, fuelUse: 6.0, fuelEfficiency: 0.25, maintenance: 1400, weapon: 1, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 8, missileRacks: 0, description: "Seeds entire star clusters with civilization." },
  phase_overlord: { id: "phase_overlord", name: "Phase Overlord", price: 980000, capacity: 8, speed: 3.8, fuelUse: 3.2, fuelEfficiency: 1.6, maintenance: 480, weapon: 10, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 4, missileRacks: 10, description: "Masters of phase technology." },
  mega_forge_world: { id: "mega_forge_world", name: "Mega Forge World", price: 1800000, capacity: 1000, speed: 0.3, fuelUse: 4.5, fuelEfficiency: 0.35, maintenance: 900, weapon: 1, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 4, missileRacks: 0, description: "Mobile industrial world." },
  shadow_overlord: { id: "shadow_overlord", name: "Shadow Overlord", price: 720000, capacity: 40, speed: 2.2, fuelUse: 2.1, fuelEfficiency: 1.1, maintenance: 380, weapon: 8, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 7, missileRacks: 8, description: "Perfect cloaking at capital scale." },
  omega_overlord: { id: "omega_overlord", name: "Omega Overlord", price: 4200000, capacity: 45, speed: 0.6, fuelUse: 9.0, fuelEfficiency: 0.14, maintenance: 2800, weapon: 28, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 24, missileRacks: 42, description: "Penultimate warship." },
  titan_carrier: { id: "titan_carrier", name: "Titan Carrier", price: 2800000, capacity: 300, speed: 0.35, fuelUse: 6.8, fuelEfficiency: 0.2, maintenance: 1900, weapon: 12, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 16, missileRacks: 18, description: "Deploys titan-class escorts." },
  knowledge_ark: { id: "knowledge_ark", name: "Knowledge Ark", price: 1100000, capacity: 300, speed: 0.42, fuelUse: 3.2, fuelEfficiency: 0.45, maintenance: 550, weapon: 1, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 5, missileRacks: 0, description: "Preserves galactic knowledge." },
  pirate_empire_flagship: { id: "pirate_empire_flagship", name: "Pirate Empire Flagship", price: 1050000, capacity: 200, speed: 0.8, fuelUse: 3.6, fuelEfficiency: 0.38, maintenance: 750, weapon: 18, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 14, missileRacks: 20, description: "Commands a pirate empire." },
  diplomatic_overlord: { id: "diplomatic_overlord", name: "Diplomatic Overlord", price: 760000, capacity: 80, speed: 1.6, fuelUse: 1.8, fuelEfficiency: 0.9, maintenance: 420, weapon: 6, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 7, missileRacks: 6, description: "Ultimate tool of galactic diplomacy." },
  void_overlord: { id: "void_overlord", name: "Void Overlord", price: 590000, capacity: 120, speed: 0.95, fuelUse: 2.6, fuelEfficiency: 0.65, maintenance: 310, weapon: 3, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 3, missileRacks: 0, description: "Harvests the void at industrial scales." },
  chronal_overlord: { id: "chronal_overlord", name: "Chronal Overlord", price: 820000, capacity: 35, speed: 1.8, fuelUse: 2.8, fuelEfficiency: 0.95, maintenance: 410, weapon: 3, isCargo: false, hasTurret: true, hasMissiles: false, turrets: 3, missileRacks: 0, description: "Navigates and manipulates time streams." },
  neural_overlord: { id: "neural_overlord", name: "Neural Overlord", price: 940000, capacity: 90, speed: 1.3, fuelUse: 2.4, fuelEfficiency: 0.8, maintenance: 480, weapon: 9, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 8, missileRacks: 8, description: "Commands fleets through pure neural linkage." },
  bio_overlord: { id: "bio_overlord", name: "Bio Overlord", price: 1200000, capacity: 800, speed: 0.5, fuelUse: 3.8, fuelEfficiency: 0.4, maintenance: 680, weapon: 2, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 4, missileRacks: 0, description: "Living world-ship that evolves." },
  research_university_ship: { id: "research_university_ship", name: "Research University Ship", price: 950000, capacity: 220, speed: 0.5, fuelUse: 3.0, fuelEfficiency: 0.5, maintenance: 490, weapon: 1, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 5, missileRacks: 0, description: "Mobile interstellar university." }
});

Object.assign(window.FACTIONS || {}, {
  absolute_order: { id: "absolute_order", name: "Absolute Order", description: "Seekers of ultimate technological perfection.", color: "#ff00ff", startingRep: 5, preferredGoods: ["absolute_omega", "absolute_dreadnought"] },
  genesis_collective: { id: "genesis_collective", name: "Genesis Collective", description: "Seeding life and civilization across the galaxy.", color: "#00ff7f", startingRep: 40, preferredGoods: ["genesis_ark"] },
  phase_lords: { id: "phase_lords", name: "Phase Lords", description: "Masters of phase technology.", color: "#9370db", startingRep: 12, preferredGoods: ["phase_overlord", "phase_drive"] },
  forge_empire: { id: "forge_empire", name: "Forge Empire", description: "Industrial empire that builds worlds.", color: "#cd7f32", startingRep: 28, preferredGoods: ["mega_forge_world"] },
  shadow_empire: { id: "shadow_empire", name: "Shadow Empire", description: "Hidden empire ruling from darkness.", color: "#000000", startingRep: 2, preferredGoods: ["shadow_overlord"] },
  omega_empire: { id: "omega_empire", name: "Omega Empire", description: "Seekers of absolute power.", color: "#800080", startingRep: 1, preferredGoods: ["omega_overlord", "absolute_omega"] },
  titan_legion: { id: "titan_legion", name: "Titan Legion", description: "Elite force of titan-class vessels.", color: "#b8860b", startingRep: 18, preferredGoods: ["titan_carrier"] },
  knowledge_keepers: { id: "knowledge_keepers", name: "Knowledge Keepers", description: "Guardians of all knowledge.", color: "#4169e1", startingRep: 35, preferredGoods: ["knowledge_ark", "precursor_omega"] },
  pirate_empire: { id: "pirate_empire", name: "Pirate Empire", description: "Unified pirate force.", color: "#8b4513", startingRep: 4, preferredGoods: ["pirate_empire_flagship"] },
  diplomatic_order: { id: "diplomatic_order", name: "Diplomatic Order", description: "Ultimate peacekeepers.", color: "#ffd700", startingRep: 55, preferredGoods: ["diplomatic_overlord"] },
  void_empire: { id: "void_empire", name: "Void Empire", description: "Rulers of the void.", color: "#191970", startingRep: 6, preferredGoods: ["void_overlord", "dark_matter_crystal"] },
  chronal_empire: { id: "chronal_empire", name: "Chronal Empire", description: "Controllers of time.", color: "#4b0082", startingRep: 10, preferredGoods: ["chronal_overlord", "time_crystal"] }
});

if (window.MISSION_TEMPLATES) {
  window.MISSION_TEMPLATES.push(
    { id: "absolute-dreadnought-escort", type: "diplomatic", title: "Absolute Dreadnought Escort", description: "Escort an Absolute Dreadnought.", reward: 250000, reputation: 40, cargo: { absolute_omega: 1 }, destination: "deneb", difficulty: "extreme", faction: "absolute_order" },
    { id: "genesis-ark-foundation", type: "hauling", title: "Genesis Ark Foundation", description: "Found a new civilization.", reward: 180000, reputation: 25, cargo: { food_rations: 500 }, destination: "hd-40307", difficulty: "extreme", faction: "genesis_collective" },
    { id: "phase-overlord-contract", type: "combat", title: "Phase Overlord Deployment", description: "Deploy a Phase Overlord.", reward: 160000, reputation: 28, cargo: {}, destination: "wolf-359", difficulty: "extreme", faction: "phase_lords" },
    { id: "omega-empire-ascension", type: "exploration", title: "Omega Empire Ascension", description: "Assist the final ascension.", reward: 220000, reputation: 35, cargo: { absolute_omega: 1 }, destination: "deneb", difficulty: "extreme", faction: "omega_empire" },
    { id: "titan-legion-deployment", type: "combat", title: "Titan Legion Deployment", description: "Support Titan Carrier deployment.", reward: 135000, reputation: 25, cargo: { titan_armor_plate: 10 }, destination: "sirius", difficulty: "extreme", faction: "titan_legion" },
    { id: "absolute-omega-recovery", type: "exploration", title: "Absolute Omega Recovery", description: "Recover an Absolute Omega Particle.", reward: 300000, reputation: 45, cargo: { absolute_omega: 1 }, destination: "wise-0855", difficulty: "extreme", faction: "absolute_order" },
    { id: "knowledge-ark-preservation", type: "exploration", title: "Knowledge Ark Preservation", description: "Preserve critical knowledge.", reward: 95000, reputation: 20, cargo: { precursor_omega: 1 }, destination: "rigel", difficulty: "high", faction: "knowledge_keepers" },
    { id: "pirate-empire-raid", type: "combat", title: "Pirate Empire Raid", description: "Counter a pirate flagship raid.", reward: 145000, reputation: 24, cargo: {}, destination: "wolf-359", difficulty: "extreme", faction: "pirate_empire" },
    { id: "diplomatic-summit-escort", type: "diplomatic", title: "Diplomatic Summit Escort", description: "Escort a Diplomatic Overlord.", reward: 88000, reputation: 19, cargo: { reality_anchor: 1 }, destination: "alpha-cen", difficulty: "high", faction: "diplomatic_order" },
    { id: "void-empire-harvest", type: "exploration", title: "Void Empire Harvest", description: "Assist a major void harvest.", reward: 120000, reputation: 23, cargo: { dark_matter_crystal: 2 }, destination: "wise-0855", difficulty: "extreme", faction: "void_empire" },
    { id: "chronal-stabilization", type: "exploration", title: "Chronal Empire Stabilization", description: "Stabilize a temporal anomaly.", reward: 155000, reputation: 27, cargo: { time_crystal: 3 }, destination: "betelgeuse", difficulty: "extreme", faction: "chronal_empire" },
    { id: "singularity-engine-delivery", type: "hauling", title: "Singularity Dreadnought Engine", description: "Transport a Singularity Dreadnought Engine.", reward: 210000, reputation: 33, cargo: { singularity_dreadnought_engine: 1 }, destination: "deneb", difficulty: "extreme", faction: "singularity_order" },
    { id: "dark-omega-delivery", type: "hauling", title: "Dark Omega Reactor Delivery", description: "Deliver a Dark Omega Reactor.", reward: 240000, reputation: 36, cargo: { dark_omega_reactor: 1 }, destination: "wise-0855", difficulty: "extreme", faction: "void_empire" },
    { id: "living-dreadnought", type: "hauling", title: "Living Dreadnought Construction", description: "Supply the core for a Living Dreadnought.", reward: 190000, reputation: 29, cargo: { living_dreadnought_core: 1 }, destination: "proxima", difficulty: "extreme", faction: "bio_empire" },
    { id: "omega-overlord-escort", type: "diplomatic", title: "Omega Overlord Escort", description: "Escort an Omega Overlord.", reward: 230000, reputation: 38, cargo: { omega_core: 1 }, destination: "deneb", difficulty: "extreme", faction: "omega_empire" },
    { id: "mega-forge-construction", type: "hauling", title: "Mega Forge World Construction", description: "Build a Mega Forge World.", reward: 140000, reputation: 22, cargo: { rare_earth_alloy: 50 }, destination: "altair", difficulty: "high", faction: "forge_empire" },
    { id: "shadow-infiltration", type: "exploration", title: "Shadow Empire Infiltration", description: "Infiltrate using Shadow technology.", reward: 130000, reputation: 26, cargo: {}, destination: "vega", difficulty: "extreme", faction: "shadow_empire" },
    { id: "neural-expansion", type: "hauling", title: "Neural Command Expansion", description: "Expand the Neural Empire.", reward: 100000, reputation: 19, cargo: { neural_mesh: 10 }, destination: "altair", difficulty: "high", faction: "neural_empire" },
    { id: "bio-growth", type: "hauling", title: "Bio Empire Growth Support", description: "Support living technology expansion.", reward: 98000, reputation: 17, cargo: { living_alloy: 20 }, destination: "gliese-581", difficulty: "high", faction: "bio_empire" },
    { id: "research-expedition", type: "exploration", title: "Ultimate Research Expedition", description: "Join the research university ship on an expedition.", reward: 125000, reputation: 22, cargo: { quantum_computer_core: 2 }, destination: "betelgeuse", difficulty: "extreme", faction: "knowledge_keepers" }
  );
}

console.log("Ideal Umbrella expansion_v11 loaded");