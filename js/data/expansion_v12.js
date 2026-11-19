// Massive content expansion for Ideal Umbrella (v1.2)
// Include after expansion_v11.js
// Adds 50+ resources, 20 ships, 15 factions, 25 missions

Object.assign(window.RESOURCES || {}, {
  // Rare / exotic raw materials
  promethium: { id: "promethium", name: "Promethium Ore", icon: "☢️", basePrice: 1200, category: "raw" },
  einsteinium: { id: "einsteinium", name: "Einsteinium Ore", icon: "☢️", basePrice: 2400, category: "raw" },
  californium: { id: "californium", name: "Californium Ore", icon: "☢️", basePrice: 1800, category: "raw" },
  void_ore: { id: "void_ore", name: "Void Ore", icon: "🌑", basePrice: 850, category: "raw" },
  phase_crystal_raw: { id: "phase_crystal_raw", name: "Raw Phase Crystal", icon: "💜", basePrice: 1600, category: "raw" },
  chronal_ore: { id: "chronal_ore", name: "Chronal Ore", icon: "⏳", basePrice: 2100, category: "raw" },
  neural_ore: { id: "neural_ore", name: "Neural Ore", icon: "🧠", basePrice: 1400, category: "raw" },
  bio_essence: { id: "bio_essence", name: "Bio-Essence", icon: "🧬", basePrice: 980, category: "raw" },
  singularity_dust: { id: "singularity_dust", name: "Singularity Dust", icon: "🕳️", basePrice: 3200, category: "raw" },
  dark_matter_ore: { id: "dark_matter_ore", name: "Dark Matter Ore", icon: "🌑", basePrice: 4500, category: "raw" },

  // Refined materials
  quantum_fabric: { id: "quantum_fabric", name: "Quantum Fabric", icon: "🧵", basePrice: 2800, category: "refined" },
  living_circuit: { id: "living_circuit", name: "Living Circuit", icon: "🧬", basePrice: 3400, category: "refined" },
  phase_alloy: { id: "phase_alloy", name: "Phase Alloy", icon: "💜", basePrice: 4200, category: "refined" },
  chronal_stabilizer: { id: "chronal_stabilizer", name: "Chronal Stabilizer", icon: "⏳", basePrice: 5600, category: "refined" },
  neural_processor: { id: "neural_processor", name: "Neural Processor", icon: "🧠", basePrice: 3900, category: "refined" },
  void_steel: { id: "void_steel", name: "Void Steel", icon: "🌑", basePrice: 2500, category: "refined" },
  antimatter_containment: { id: "antimatter_containment", name: "Antimatter Containment", icon: "⚡", basePrice: 7800, category: "refined" },
  reality_thread: { id: "reality_thread", name: "Reality Thread", icon: "🧵", basePrice: 9200, category: "refined" },
  precursor_alloy: { id: "precursor_alloy", name: "Precursor Alloy", icon: "⚙️", basePrice: 15000, category: "refined" },
  omega_circuit: { id: "omega_circuit", name: "Omega Circuit", icon: "⚛️", basePrice: 12500, category: "refined" },

  // Extreme high-tier
  absolute_singularity: { id: "absolute_singularity", name: "Absolute Singularity", icon: "🕳️", basePrice: 180000, category: "high" },
  genesis_seed: { id: "genesis_seed", name: "Genesis Seed", icon: "🌱", basePrice: 125000, category: "high" },
  phase_emperor_core: { id: "phase_emperor_core", name: "Phase Emperor Core", icon: "💜", basePrice: 95000, category: "high" },
  reality_warper: { id: "reality_warper", name: "Reality Warper", icon: "🌀", basePrice: 140000, category: "high" },
  omega_antimatter: { id: "omega_antimatter", name: "Omega Antimatter", icon: "⚡", basePrice: 200000, category: "high" },
  chronal_overlord_engine: { id: "chronal_overlord_engine", name: "Chronal Overlord Engine", icon: "⏳", basePrice: 110000, category: "high" },
  neural_god_core: { id: "neural_god_core", name: "Neural God Core", icon: "🧠", basePrice: 160000, category: "high" },
  living_universe_core: { id: "living_universe_core", name: "Living Universe Core", icon: "🧬", basePrice: 175000, category: "high" },
  void_emperor_reactor: { id: "void_emperor_reactor", name: "Void Emperor Reactor", icon: "🌑", basePrice: 155000, category: "high" },
  precursor_god_archive: { id: "precursor_god_archive", name: "Precursor God Archive", icon: "📚", basePrice: 220000, category: "high" },
  singularity_emperor_drive: { id: "singularity_emperor_drive", name: "Singularity Emperor Drive", icon: "🕳️", basePrice: 250000, category: "high" },
  absolute_reality_anchor: { id: "absolute_reality_anchor", name: "Absolute Reality Anchor", icon: "⚓", basePrice: 190000, category: "high" },
  omega_genesis_particle: { id: "omega_genesis_particle", name: "Omega Genesis Particle", icon: "⚛️", basePrice: 300000, category: "high" },
  phase_reality_crystal: { id: "phase_reality_crystal", name: "Phase Reality Crystal", icon: "💜", basePrice: 135000, category: "high" },
  dark_omega_seed: { id: "dark_omega_seed", name: "Dark Omega Seed", icon: "🌑", basePrice: 165000, category: "high" },
  chronal_god_engine: { id: "chronal_god_engine", name: "Chronal God Engine", icon: "⏳", basePrice: 210000, category: "high" },
  neural_emperor_mesh: { id: "neural_emperor_mesh", name: "Neural Emperor Mesh", icon: "🧠", basePrice: 145000, category: "high" },
  bio_god_essence: { id: "bio_god_essence", name: "Bio-God Essence", icon: "🧬", basePrice: 130000, category: "high" },
  void_god_crystal: { id: "void_god_crystal", name: "Void God Crystal", icon: "🌑", basePrice: 185000, category: "high" },
  absolute_omega_core: { id: "absolute_omega_core", name: "Absolute Omega Core", icon: "⚛️", basePrice: 350000, category: "high" },
  reality_emperor_engine: { id: "reality_emperor_engine", name: "Reality Emperor Engine", icon: "🌀", basePrice: 280000, category: "high" },
  genesis_overlord_seed: { id: "genesis_overlord_seed", name: "Genesis Overlord Seed", icon: "🌱", basePrice: 170000, category: "high" },
  phase_god_drive: { id: "phase_god_drive", name: "Phase God Drive", icon: "💜", basePrice: 195000, category: "high" },
  singularity_god_reactor: { id: "singularity_god_reactor", name: "Singularity God Reactor", icon: "🕳️", basePrice: 320000, category: "high" },
  omega_reality_particle: { id: "omega_reality_particle", name: "Omega Reality Particle", icon: "⚛️", basePrice: 400000, category: "high" }
});

Object.assign(window.SHIP_TYPES || {}, {
  reality_ark: { id: "reality_ark", name: "Reality Ark", price: 8000000, capacity: 5000, speed: 0.18, fuelUse: 12.0, fuelEfficiency: 0.12, maintenance: 5000, weapon: 2, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 12, missileRacks: 0, description: "Seeds entire realities with new civilizations." },
  phase_emperor: { id: "phase_emperor", name: "Phase Emperor", price: 2500000, capacity: 12, speed: 4.5, fuelUse: 4.0, fuelEfficiency: 1.8, maintenance: 800, weapon: 15, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 6, missileRacks: 16, description: "Absolute master of phase space." },
  omega_forge_world: { id: "omega_forge_world", name: "Omega Forge World", price: 4500000, capacity: 2500, speed: 0.25, fuelUse: 8.0, fuelEfficiency: 0.28, maintenance: 2200, weapon: 2, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 8, missileRacks: 0, description: "Mobile industrial reality." },
  shadow_emperor: { id: "shadow_emperor", name: "Shadow Emperor", price: 1800000, capacity: 60, speed: 2.5, fuelUse: 2.8, fuelEfficiency: 1.2, maintenance: 650, weapon: 12, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 10, missileRacks: 14, description: "Rules from perfect darkness." },
  singularity_emperor: { id: "singularity_emperor", name: "Singularity Emperor", price: 12000000, capacity: 50, speed: 0.4, fuelUse: 15.0, fuelEfficiency: 0.1, maintenance: 8000, weapon: 40, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 36, missileRacks: 60, description: "Weaponizes singularities." },
  chronal_emperor: { id: "chronal_emperor", name: "Chronal Emperor", price: 2200000, capacity: 40, speed: 2.0, fuelUse: 3.5, fuelEfficiency: 1.0, maintenance: 720, weapon: 8, isCargo: false, hasTurret: true, hasMissiles: false, turrets: 6, missileRacks: 0, description: "Commands the flow of time itself." },
  neural_godship: { id: "neural_godship", name: "Neural Godship", price: 2800000, capacity: 150, speed: 1.5, fuelUse: 3.2, fuelEfficiency: 0.9, maintenance: 900, weapon: 14, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 12, missileRacks: 12, description: "A living neural empire in one hull." },
  living_universe_ship: { id: "living_universe_ship", name: "Living Universe Ship", price: 6000000, capacity: 3000, speed: 0.3, fuelUse: 9.0, fuelEfficiency: 0.3, maintenance: 2800, weapon: 3, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 10, missileRacks: 0, description: "An entire evolving universe in a ship." },
  void_emperor: { id: "void_emperor", name: "Void Emperor", price: 1900000, capacity: 200, speed: 1.1, fuelUse: 3.5, fuelEfficiency: 0.7, maintenance: 580, weapon: 6, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 5, missileRacks: 0, description: "Harvests the void at god scale." },
  absolute_dreadnought_prime: { id: "absolute_dreadnought_prime", name: "Absolute Dreadnought Prime", price: 15000000, capacity: 60, speed: 0.5, fuelUse: 18.0, fuelEfficiency: 0.08, maintenance: 10000, weapon: 50, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 40, missileRacks: 80, description: "The theoretical peak of all warship technology." },
  genesis_emperor_ark: { id: "genesis_emperor_ark", name: "Genesis Emperor Ark", price: 7000000, capacity: 4000, speed: 0.2, fuelUse: 10.0, fuelEfficiency: 0.2, maintenance: 4000, weapon: 2, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 10, missileRacks: 0, description: "Seeds entire clusters of realities." },
  phase_god: { id: "phase_god", name: "Phase God", price: 3500000, capacity: 10, speed: 5.0, fuelUse: 5.0, fuelEfficiency: 2.0, maintenance: 1200, weapon: 18, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 8, missileRacks: 20, description: "A god of phase space." },
  omega_reality_forge: { id: "omega_reality_forge", name: "Omega Reality Forge", price: 9000000, capacity: 2000, speed: 0.28, fuelUse: 11.0, fuelEfficiency: 0.25, maintenance: 4500, weapon: 4, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 12, missileRacks: 0, description: "Forges new realities." },
  shadow_god: { id: "shadow_god", name: "Shadow God", price: 2400000, capacity: 80, speed: 2.8, fuelUse: 3.0, fuelEfficiency: 1.3, maintenance: 850, weapon: 16, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 14, missileRacks: 18, description: "Invisible even to gods." },
  precursor_flagship: { id: "precursor_flagship", name: "Precursor Flagship", price: 11000000, capacity: 500, speed: 0.6, fuelUse: 8.0, fuelEfficiency: 0.35, maintenance: 6000, weapon: 25, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 20, missileRacks: 30, description: "Relic of the Precursors, still operational." },
  chronal_godship: { id: "chronal_godship", name: "Chronal Godship", price: 3200000, capacity: 45, speed: 2.2, fuelUse: 4.0, fuelEfficiency: 1.1, maintenance: 980, weapon: 10, isCargo: false, hasTurret: true, hasMissiles: false, turrets: 8, missileRacks: 0, description: "Rewrites timelines." },
  neural_emperor: { id: "neural_emperor", name: "Neural Emperor", price: 3800000, capacity: 120, speed: 1.4, fuelUse: 3.5, fuelEfficiency: 0.85, maintenance: 1100, weapon: 15, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 12, missileRacks: 14, description: "Commands all minds in range." },
  bio_emperor: { id: "bio_emperor", name: "Bio Emperor", price: 5500000, capacity: 2500, speed: 0.4, fuelUse: 7.0, fuelEfficiency: 0.35, maintenance: 1800, weapon: 4, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 8, missileRacks: 0, description: "Living god-ship that evolves endlessly." },
  void_god: { id: "void_god", name: "Void God", price: 2600000, capacity: 180, speed: 1.2, fuelUse: 3.8, fuelEfficiency: 0.75, maintenance: 720, weapon: 8, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 6, missileRacks: 0, description: "God of the void." },
  absolute_emperor: { id: "absolute_emperor", name: "Absolute Emperor", price: 20000000, capacity: 80, speed: 0.45, fuelUse: 20.0, fuelEfficiency: 0.06, maintenance: 15000, weapon: 60, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 50, missileRacks: 100, description: "The final form of warship technology." }
});

Object.assign(window.FACTIONS || {}, {
  reality_order: { id: "reality_order", name: "Reality Order", description: "Keepers of the fabric of reality itself.", color: "#00ffff", startingRep: 8, preferredGoods: ["reality_warper", "absolute_reality_anchor"] },
  genesis_empire: { id: "genesis_empire", name: "Genesis Empire", description: "Seeders of entire realities.", color: "#00ff00", startingRep: 30, preferredGoods: ["genesis_seed", "genesis_emperor_ark"] },
  phase_emperor_court: { id: "phase_emperor_court", name: "Phase Emperor's Court", description: "Rulers of phase space.", color: "#9400d3", startingRep: 10, preferredGoods: ["phase_emperor_core", "phase_god"] },
  singularity_empire: { id: "singularity_empire", name: "Singularity Empire", description: "Masters of singularities.", color: "#000000", startingRep: 1, preferredGoods: ["absolute_singularity", "singularity_emperor"] },
  chronal_god_order: { id: "chronal_god_order", name: "Chronal God Order", description: "Gods of time.", color: "#4b0082", startingRep: 12, preferredGoods: ["chronal_god_engine"] },
  neural_god_collective: { id: "neural_god_collective", name: "Neural God Collective", description: "A hive mind of gods.", color: "#ff69b4", startingRep: 15, preferredGoods: ["neural_god_core"] },
  living_universe_cult: { id: "living_universe_cult", name: "Living Universe Cult", description: "Worshippers of living universes.", color: "#32cd32", startingRep: 20, preferredGoods: ["living_universe_core"] },
  void_god_empire: { id: "void_god_empire", name: "Void God Empire", description: "Gods who rule the void.", color: "#191970", startingRep: 5, preferredGoods: ["void_god_crystal"] },
  precursor_remnant: { id: "precursor_remnant", name: "Precursor Remnant", description: "Last remnants of the Precursors.", color: "#ffd700", startingRep: 25, preferredGoods: ["precursor_god_archive"] },
  absolute_emperor_order: { id: "absolute_emperor_order", name: "Absolute Emperor Order", description: "Seekers of absolute perfection.", color: "#ff00ff", startingRep: 3, preferredGoods: ["absolute_omega_core", "absolute_emperor"] },
  omega_reality_cult: { id: "omega_reality_cult", name: "Omega Reality Cult", description: "Cult that forges realities.", color: "#8b0000", startingRep: 6, preferredGoods: ["omega_reality_particle"] },
  shadow_god_council: { id: "shadow_god_council", name: "Shadow God Council", description: "Gods of darkness and shadow.", color: "#2f4f4f", startingRep: 4, preferredGoods: ["shadow_god"] },
  bio_god_empire: { id: "bio_god_empire", name: "Bio-God Empire", description: "Living gods of evolution.", color: "#228b22", startingRep: 18, preferredGoods: ["bio_god_essence"] },
  dark_omega_order: { id: "dark_omega_order", name: "Dark Omega Order", description: "Seekers of dark omega power.", color: "#4b0082", startingRep: 2, preferredGoods: ["dark_omega_seed"] },
  reality_emperor_court: { id: "reality_emperor_court", name: "Reality Emperor's Court", description: "Emperors of reality itself.", color: "#00ced1", startingRep: 7, preferredGoods: ["reality_emperor_engine"] }
});

if (window.MISSION_TEMPLATES) {
  window.MISSION_TEMPLATES.push(
    { id: "reality-ark-seeding", type: "hauling", title: "Reality Ark Seeding", description: "Seed a new reality with the Reality Ark.", reward: 500000, reputation: 50, cargo: { genesis_seed: 1 }, destination: "deneb", difficulty: "extreme", faction: "reality_order" },
    { id: "phase-emperor-deployment", type: "combat", title: "Phase Emperor Deployment", description: "Deploy the Phase Emperor against threats.", reward: 380000, reputation: 42, cargo: {}, destination: "wolf-359", difficulty: "extreme", faction: "phase_emperor_court" },
    { id: "absolute-singularity-recovery", type: "exploration", title: "Absolute Singularity Recovery", description: "Recover an Absolute Singularity.", reward: 600000, reputation: 55, cargo: { absolute_singularity: 1 }, destination: "wise-0855", difficulty: "extreme", faction: "singularity_empire" },
    { id: "omega-reality-forging", type: "hauling", title: "Omega Reality Forging", description: "Supply the Omega Reality Forge.", reward: 450000, reputation: 40, cargo: { omega_reality_particle: 1 }, destination: "betelgeuse", difficulty: "extreme", faction: "omega_reality_cult" },
    { id: "chronal-god-stabilization", type: "exploration", title: "Chronal God Stabilization", description: "Stabilize time with the Chronal Godship.", reward: 420000, reputation: 38, cargo: { chronal_god_engine: 1 }, destination: "rigel", difficulty: "extreme", faction: "chronal_god_order" },
    { id: "neural-god-ascension", type: "diplomatic", title: "Neural God Ascension", description: "Assist the Neural God Collective's ascension.", reward: 390000, reputation: 36, cargo: { neural_god_core: 1 }, destination: "altair", difficulty: "extreme", faction: "neural_god_collective" },
    { id: "living-universe-birth", type: "hauling", title: "Living Universe Birth", description: "Help birth a new living universe.", reward: 480000, reputation: 45, cargo: { living_universe_core: 1 }, destination: "proxima", difficulty: "extreme", faction: "living_universe_cult" },
    { id: "void-god-harvest", type: "exploration", title: "Void God Harvest", description: "Assist a Void God in harvesting the void.", reward: 360000, reputation: 34, cargo: { void_god_crystal: 2 }, destination: "wise-0855", difficulty: "extreme", faction: "void_god_empire" },
    { id: "precursor-flagship-recovery", type: "exploration", title: "Precursor Flagship Recovery", description: "Recover the Precursor Flagship.", reward: 550000, reputation: 48, cargo: { precursor_god_archive: 1 }, destination: "deneb", difficulty: "extreme", faction: "precursor_remnant" },
    { id: "absolute-emperor-escort", type: "diplomatic", title: "Absolute Emperor Escort", description: "Escort the Absolute Emperor.", reward: 700000, reputation: 60, cargo: { absolute_omega_core: 1 }, destination: "deneb", difficulty: "extreme", faction: "absolute_emperor_order" },
    { id: "shadow-god-infiltration", type: "exploration", title: "Shadow God Infiltration", description: "Infiltrate using Shadow God technology.", reward: 340000, reputation: 32, cargo: {}, destination: "vega", difficulty: "extreme", faction: "shadow_god_council" },
    { id: "bio-god-evolution", type: "hauling", title: "Bio-God Evolution", description: "Support the Bio-God Empire's evolution.", reward: 320000, reputation: 30, cargo: { bio_god_essence: 5 }, destination: "gliese-581", difficulty: "extreme", faction: "bio_god_empire" },
    { id: "dark-omega-ascension", type: "exploration", title: "Dark Omega Ascension", description: "Assist the Dark Omega Order's ascension.", reward: 410000, reputation: 37, cargo: { dark_omega_seed: 1 }, destination: "wise-0855", difficulty: "extreme", faction: "dark_omega_order" },
    { id: "reality-emperor-construction", type: "hauling", title: "Reality Emperor Construction", description: "Construct the Reality Emperor Engine.", reward: 520000, reputation: 46, cargo: { reality_emperor_engine: 1 }, destination: "betelgeuse", difficulty: "extreme", faction: "reality_emperor_court" },
    { id: "genesis-emperor-seeding", type: "hauling", title: "Genesis Emperor Seeding", description: "Seed multiple realities with the Genesis Emperor Ark.", reward: 460000, reputation: 41, cargo: { genesis_overlord_seed: 1 }, destination: "hd-40307", difficulty: "extreme", faction: "genesis_empire" },
    { id: "phase-god-contract", type: "combat", title: "Phase God Contract", description: "Deploy the Phase God.", reward: 370000, reputation: 35, cargo: {}, destination: "wolf-359", difficulty: "extreme", faction: "phase_emperor_court" },
    { id: "singularity-god-recovery", type: "exploration", title: "Singularity God Recovery", description: "Recover the Singularity God Reactor.", reward: 650000, reputation: 58, cargo: { singularity_god_reactor: 1 }, destination: "wise-0855", difficulty: "extreme", faction: "singularity_empire" },
    { id: "omega-genesis-delivery", type: "hauling", title: "Omega Genesis Delivery", description: "Deliver the Omega Genesis Particle.", reward: 580000, reputation: 52, cargo: { omega_genesis_particle: 1 }, destination: "deneb", difficulty: "extreme", faction: "genesis_empire" },
    { id: "absolute-reality-anchor", type: "diplomatic", title: "Absolute Reality Anchor", description: "Install the Absolute Reality Anchor.", reward: 440000, reputation: 39, cargo: { absolute_reality_anchor: 1 }, destination: "alpha-cen", difficulty: "extreme", faction: "reality_order" },
    { id: "void-emperor-reactor", type: "hauling", title: "Void Emperor Reactor Delivery", description: "Deliver the Void Emperor Reactor.", reward: 490000, reputation: 44, cargo: { void_emperor_reactor: 1 }, destination: "wise-0855", difficulty: "extreme", faction: "void_god_empire" },
    { id: "neural-emperor-expansion", type: "hauling", title: "Neural Emperor Expansion", description: "Expand the Neural Emperor's domain.", reward: 350000, reputation: 33, cargo: { neural_emperor_mesh: 5 }, destination: "altair", difficulty: "extreme", faction: "neural_god_collective" },
    { id: "phase-reality-crystal", type: "exploration", title: "Phase Reality Crystal Recovery", description: "Recover Phase Reality Crystals.", reward: 400000, reputation: 36, cargo: { phase_reality_crystal: 2 }, destination: "betelgeuse", difficulty: "extreme", faction: "phase_emperor_court" },
    { id: "chronal-overlord-upgrade", type: "hauling", title: "Chronal Overlord Upgrade", description: "Upgrade to Chronal Emperor.", reward: 430000, reputation: 38, cargo: { chronal_overlord_engine: 1 }, destination: "rigel", difficulty: "extreme", faction: "chronal_god_order" },
    { id: "precursor-god-archive", type: "exploration", title: "Precursor God Archive Retrieval", description: "Retrieve the Precursor God Archive.", reward: 620000, reputation: 54, cargo: { precursor_god_archive: 1 }, destination: "deneb", difficulty: "extreme", faction: "precursor_remnant" },
    { id: "absolute-omega-core-delivery", type: "hauling", title: "Absolute Omega Core Delivery", description: "Deliver the Absolute Omega Core.", reward: 750000, reputation: 65, cargo: { absolute_omega_core: 1 }, destination: "deneb", difficulty: "extreme", faction: "absolute_emperor_order" }
  );
}

console.log("Ideal Umbrella expansion_v12 loaded — tons more content!");
