// Omniversal content expansion for Ideal Umbrella (v1.4)
// Include after expansion_v13.js
// Adds 45+ resources, 22 ships, 14 factions, 28 missions

Object.assign(window.RESOURCES || {}, {
  // Omniversal / hyperdimensional raw
  omniverse_shard: { id: "omniverse_shard", name: "Omniverse Shard", icon: "🌌", basePrice: 8500, category: "raw" },
  hyperdimensional_ore: { id: "hyperdimensional_ore", name: "Hyperdimensional Ore", icon: "🔷", basePrice: 7200, category: "raw" },
  conceptual_essence: { id: "conceptual_essence", name: "Conceptual Essence", icon: "💡", basePrice: 9800, category: "raw" },
  narrative_thread: { id: "narrative_thread", name: "Narrative Thread", icon: "📖", basePrice: 6400, category: "raw" },
  probability_crystal: { id: "probability_crystal", name: "Probability Crystal", icon: "🎲", basePrice: 11000, category: "raw" },
  causality_ore: { id: "causality_ore", name: "Causality Ore", icon: "⛓️", basePrice: 8900, category: "raw" },
  dream_matter: { id: "dream_matter", name: "Dream Matter", icon: "💭", basePrice: 5600, category: "raw" },
  paradox_dust: { id: "paradox_dust", name: "Paradox Dust", icon: "🌀", basePrice: 15000, category: "raw" },
  infinity_seed: { id: "infinity_seed", name: "Infinity Seed", icon: "∞", basePrice: 22000, category: "raw" },
  void_of_voids: { id: "void_of_voids", name: "Void of Voids", icon: "🕳️", basePrice: 18000, category: "raw" },

  // Refined omniversal
  omniversal_fabric: { id: "omniversal_fabric", name: "Omniversal Fabric", icon: "🧵", basePrice: 28000, category: "refined" },
  hyperdimensional_alloy: { id: "hyperdimensional_alloy", name: "Hyperdimensional Alloy", icon: "🔷", basePrice: 35000, category: "refined" },
  conceptual_circuit: { id: "conceptual_circuit", name: "Conceptual Circuit", icon: "💡", basePrice: 42000, category: "refined" },
  narrative_stabilizer: { id: "narrative_stabilizer", name: "Narrative Stabilizer", icon: "📖", basePrice: 31000, category: "refined" },
  probability_engine: { id: "probability_engine", name: "Probability Engine", icon: "🎲", basePrice: 48000, category: "refined" },
  causality_anchor: { id: "causality_anchor", name: "Causality Anchor", icon: "⚓", basePrice: 39000, category: "refined" },
  dream_alloy: { id: "dream_alloy", name: "Dream Alloy", icon: "💭", basePrice: 25000, category: "refined" },
  paradox_containment: { id: "paradox_containment", name: "Paradox Containment", icon: "🌀", basePrice: 62000, category: "refined" },
  infinity_core: { id: "infinity_core", name: "Infinity Core", icon: "∞", basePrice: 75000, category: "refined" },
  absolute_void_steel: { id: "absolute_void_steel", name: "Absolute Void Steel", icon: "⚫", basePrice: 55000, category: "refined" },

  // God-tier / omniversal high
  omniverse_emperor_core: { id: "omniverse_emperor_core", name: "Omniverse Emperor Core", icon: "🌌", basePrice: 850000, category: "high" },
  hyperdimensional_god_engine: { id: "hyperdimensional_god_engine", name: "Hyperdimensional God Engine", icon: "🔷", basePrice: 720000, category: "high" },
  conceptual_overlord_reactor: { id: "conceptual_overlord_reactor", name: "Conceptual Overlord Reactor", icon: "💡", basePrice: 680000, category: "high" },
  narrative_god_archive: { id: "narrative_god_archive", name: "Narrative God Archive", icon: "📖", basePrice: 920000, category: "high" },
  probability_emperor_drive: { id: "probability_emperor_drive", name: "Probability Emperor Drive", icon: "🎲", basePrice: 780000, category: "high" },
  causality_god_anchor: { id: "causality_god_anchor", name: "Causality God Anchor", icon: "⚓", basePrice: 650000, category: "high" },
  dream_multiverse_seed: { id: "dream_multiverse_seed", name: "Dream Multiverse Seed", icon: "💭", basePrice: 540000, category: "high" },
  paradox_overlord_core: { id: "paradox_overlord_core", name: "Paradox Overlord Core", icon: "🌀", basePrice: 1100000, category: "high" },
  infinity_emperor_particle: { id: "infinity_emperor_particle", name: "Infinity Emperor Particle", icon: "∞", basePrice: 1500000, category: "high" },
  absolute_omniversal_core: { id: "absolute_omniversal_core", name: "Absolute Omniversal Core", icon: "⚛️", basePrice: 2500000, category: "high" },
  hyperreality_god_mesh: { id: "hyperreality_god_mesh", name: "Hyperreality God Mesh", icon: "🌐", basePrice: 890000, category: "high" },
  meta_narrative_engine: { id: "meta_narrative_engine", name: "Meta-Narrative Engine", icon: "📚", basePrice: 760000, category: "high" },
  quantum_probability_crystal: { id: "quantum_probability_crystal", name: "Quantum Probability Crystal", icon: "⚛️", basePrice: 620000, category: "high" },
  temporal_causality_stabilizer: { id: "temporal_causality_stabilizer", name: "Temporal Causality Stabilizer", icon: "⏳", basePrice: 580000, category: "high" },
  dream_god_essence: { id: "dream_god_essence", name: "Dream God Essence", icon: "💭", basePrice: 470000, category: "high" },
  void_omniverse_seed: { id: "void_omniverse_seed", name: "Void Omniverse Seed", icon: "🌑", basePrice: 830000, category: "high" },
  singularity_omniverse_drive: { id: "singularity_omniverse_drive", name: "Singularity Omniverse Drive", icon: "🕳️", basePrice: 1200000, category: "high" },
  genesis_omniverse_ark_core: { id: "genesis_omniverse_ark_core", name: "Genesis Omniverse Ark Core", icon: "🌱", basePrice: 980000, category: "high" },
  phase_omniverse_crystal: { id: "phase_omniverse_crystal", name: "Phase Omniverse Crystal", icon: "💜", basePrice: 710000, category: "high" },
  neural_omniverse_mesh: { id: "neural_omniverse_mesh", name: "Neural Omniverse Mesh", icon: "🧠", basePrice: 640000, category: "high" },
  bio_omniverse_essence: { id: "bio_omniverse_essence", name: "Bio-Omniverse Essence", icon: "🧬", basePrice: 520000, category: "high" },
  dark_omniverse_emperor_seed: { id: "dark_omniverse_emperor_seed", name: "Dark Omniverse Emperor Seed", icon: "⚫", basePrice: 1050000, category: "high" },
  absolute_infinity_core: { id: "absolute_infinity_core", name: "Absolute Infinity Core", icon: "∞", basePrice: 3200000, category: "high" },
  omniversal_god_particle: { id: "omniversal_god_particle", name: "Omniversal God Particle", icon: "⚛️", basePrice: 2800000, category: "high" },
  conceptual_emperor_engine: { id: "conceptual_emperor_engine", name: "Conceptual Emperor Engine", icon: "💡", basePrice: 1400000, category: "high" }
});

Object.assign(window.SHIP_TYPES || {}, {
  omniverse_ark: { id: "omniverse_ark", name: "Omniverse Ark", price: 25000000, capacity: 10000, speed: 0.12, fuelUse: 18.0, fuelEfficiency: 0.08, maintenance: 12000, weapon: 4, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 18, missileRacks: 0, description: "Seeds entire omniverses with infinite realities." },
  hyperdimensional_god_emperor: { id: "hyperdimensional_god_emperor", name: "Hyperdimensional God Emperor", price: 12000000, capacity: 25, speed: 4.2, fuelUse: 7.5, fuelEfficiency: 1.8, maintenance: 3500, weapon: 30, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 12, missileRacks: 30, description: "Rules across all dimensions simultaneously." },
  conceptual_overlord: { id: "conceptual_overlord", name: "Conceptual Overlord", price: 9500000, capacity: 80, speed: 2.1, fuelUse: 5.5, fuelEfficiency: 1.1, maintenance: 2800, weapon: 22, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 16, missileRacks: 20, description: "Commands concepts themselves as weapons." },
  narrative_godship: { id: "narrative_godship", name: "Narrative Godship", price: 8000000, capacity: 150, speed: 1.9, fuelUse: 4.8, fuelEfficiency: 1.0, maintenance: 2400, weapon: 18, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 14, missileRacks: 18, description: "Rewrites the story of the omniverse." },
  probability_emperor: { id: "probability_emperor", name: "Probability Emperor", price: 11000000, capacity: 40, speed: 3.0, fuelUse: 6.0, fuelEfficiency: 1.4, maintenance: 3000, weapon: 25, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 10, missileRacks: 28, description: "Collapses all possible outcomes in its favor." },
  causality_god_anchor: { id: "causality_god_anchor", name: "Causality God Anchor", price: 7000000, capacity: 300, speed: 1.2, fuelUse: 5.2, fuelEfficiency: 0.75, maintenance: 2000, weapon: 12, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 8, missileRacks: 0, description: "Anchors causality across the omniverse." },
  dream_omniverse_ark: { id: "dream_omniverse_ark", name: "Dream Omniverse Ark", price: 18000000, capacity: 8000, speed: 0.16, fuelUse: 15.0, fuelEfficiency: 0.12, maintenance: 9500, weapon: 3, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 14, missileRacks: 0, description: "Seeds dream-realities across the omniverse." },
  absolute_omniverse_dreadnought: { id: "absolute_omniverse_dreadnought", name: "Absolute Omniverse Dreadnought", price: 60000000, capacity: 150, speed: 0.35, fuelUse: 30.0, fuelEfficiency: 0.04, maintenance: 30000, weapon: 100, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 80, missileRacks: 180, description: "The absolute peak of warship technology across all omniverses." },
  infinity_emperor: { id: "infinity_emperor", name: "Infinity Emperor", price: 35000000, capacity: 70, speed: 0.45, fuelUse: 25.0, fuelEfficiency: 0.06, maintenance: 20000, weapon: 65, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 55, missileRacks: 110, description: "Wields infinity itself as a weapon." },
  paradox_overlord: { id: "paradox_overlord", name: "Paradox Overlord", price: 15000000, capacity: 20, speed: 3.8, fuelUse: 6.8, fuelEfficiency: 1.6, maintenance: 3200, weapon: 28, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 12, missileRacks: 32, description: "Exists in all possible states at once." },
  hyperreality_god: { id: "hyperreality_god", name: "Hyperreality God", price: 13000000, capacity: 90, speed: 2.4, fuelUse: 5.0, fuelEfficiency: 1.2, maintenance: 2600, weapon: 20, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 15, missileRacks: 22, description: "Masters of hyperrealities beyond multiverses." },
  meta_narrative_forge: { id: "meta_narrative_forge", name: "Meta-Narrative Forge", price: 20000000, capacity: 4500, speed: 0.22, fuelUse: 13.5, fuelEfficiency: 0.18, maintenance: 11000, weapon: 5, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 15, missileRacks: 0, description: "Forges the narratives that define omniverses." },
  quantum_probability_emperor: { id: "quantum_probability_emperor", name: "Quantum Probability Emperor", price: 10500000, capacity: 35, speed: 3.2, fuelUse: 5.8, fuelEfficiency: 1.35, maintenance: 2900, weapon: 24, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 11, missileRacks: 26, description: "Quantum master of all probabilities." },
  void_omniverse_emperor: { id: "void_omniverse_emperor", name: "Void Omniverse Emperor", price: 8500000, capacity: 350, speed: 1.15, fuelUse: 5.0, fuelEfficiency: 0.7, maintenance: 1800, weapon: 14, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 9, missileRacks: 0, description: "God of the void across the omniverse." },
  singularity_omniverse_god: { id: "singularity_omniverse_god", name: "Singularity Omniverse God", price: 40000000, capacity: 80, speed: 0.4, fuelUse: 26.0, fuelEfficiency: 0.05, maintenance: 22000, weapon: 70, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 60, missileRacks: 130, description: "Weaponizes singularities across infinite omniverses." },
  genesis_omniverse_ark: { id: "genesis_omniverse_ark", name: "Genesis Omniverse Ark", price: 28000000, capacity: 9000, speed: 0.14, fuelUse: 16.5, fuelEfficiency: 0.1, maintenance: 13000, weapon: 4, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 16, missileRacks: 0, description: "Seeds clusters of omniverses." },
  phase_omniverse_emperor: { id: "phase_omniverse_emperor", name: "Phase Omniverse Emperor", price: 11500000, capacity: 18, speed: 5.2, fuelUse: 6.5, fuelEfficiency: 2.0, maintenance: 3100, weapon: 26, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 12, missileRacks: 28, description: "Absolute master of phase across omniverses." },
  neural_omniverse_godship: { id: "neural_omniverse_godship", name: "Neural Omniverse Godship", price: 10000000, capacity: 200, speed: 1.7, fuelUse: 5.0, fuelEfficiency: 0.95, maintenance: 2700, weapon: 19, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 16, missileRacks: 18, description: "A living omniverse mind." },
  bio_omniverse_emperor: { id: "bio_omniverse_emperor", name: "Bio-Omniverse Emperor", price: 14000000, capacity: 5000, speed: 0.3, fuelUse: 10.5, fuelEfficiency: 0.28, maintenance: 4500, weapon: 6, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 12, missileRacks: 0, description: "Living emperor of biological omniverses." },
  dark_omniverse_flagship: { id: "dark_omniverse_flagship", name: "Dark Omniverse Flagship", price: 22000000, capacity: 500, speed: 0.48, fuelUse: 12.0, fuelEfficiency: 0.25, maintenance: 10000, weapon: 35, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 25, missileRacks: 40, description: "Commands dark power across the omniverse." },
  absolute_infinity_emperor: { id: "absolute_infinity_emperor", name: "Absolute Infinity Emperor", price: 75000000, capacity: 100, speed: 0.32, fuelUse: 32.0, fuelEfficiency: 0.03, maintenance: 35000, weapon: 110, isCargo: false, hasTurret: true, hasMissiles: true, turrets: 90, missileRacks: 200, description: "The theoretical final form of all possible technology." },
  conceptual_god_forge: { id: "conceptual_god_forge", name: "Conceptual God Forge", price: 32000000, capacity: 5500, speed: 0.2, fuelUse: 14.5, fuelEfficiency: 0.16, maintenance: 14000, weapon: 6, isCargo: true, hasTurret: true, hasMissiles: false, turrets: 17, missileRacks: 0, description: "Forges concepts into reality at omniversal scale." }
});

Object.assign(window.FACTIONS || {}, {
  omniverse_order: { id: "omniverse_order", name: "Omniverse Order", description: "Keepers of the fabric of all omniverses.", color: "#00ffff", startingRep: 4, preferredGoods: ["omniverse_emperor_core", "absolute_omniversal_core"] },
  hyperdimensional_empire: { id: "hyperdimensional_empire", name: "Hyperdimensional Empire", description: "Emperors who rule all dimensions.", color: "#4169e1", startingRep: 6, preferredGoods: ["hyperdimensional_god_engine"] },
  conceptual_overlord_court: { id: "conceptual_overlord_court", name: "Conceptual Overlord Court", description: "Rulers of pure concepts.", color: "#ffd700", startingRep: 8, preferredGoods: ["conceptual_overlord_reactor"] },
  narrative_god_collective: { id: "narrative_god_collective", name: "Narrative God Collective", description: "Gods who write the stories of realities.", color: "#8b4513", startingRep: 12, preferredGoods: ["narrative_god_archive"] },
  probability_emperor_order: { id: "probability_emperor_order", name: "Probability Emperor Order", description: "Masters of all possible outcomes.", color: "#9400d3", startingRep: 5, preferredGoods: ["probability_emperor_drive"] },
  causality_anchor_council: { id: "causality_anchor_council", name: "Causality Anchor Council", description: "Stabilizers of cause and effect.", color: "#2f4f4f", startingRep: 7, preferredGoods: ["causality_god_anchor"] },
  dream_omniverse_cult: { id: "dream_omniverse_cult", name: "Dream Omniverse Cult", description: "Worshippers of dream-realities.", color: "#9370db", startingRep: 15, preferredGoods: ["dream_multiverse_seed"] },
  paradox_overlord_empire: { id: "paradox_overlord_empire", name: "Paradox Overlord Empire", description: "Rulers of paradoxes.", color: "#ff4500", startingRep: 3, preferredGoods: ["paradox_overlord_core"] },
  infinity_emperor_order: { id: "infinity_emperor_order", name: "Infinity Emperor Order", description: "Seekers of absolute infinity.", color: "#00ced1", startingRep: 2, preferredGoods: ["absolute_infinity_core", "infinity_emperor"] },
  absolute_omniverse_empire: { id: "absolute_omniverse_empire", name: "Absolute Omniverse Empire", description: "The final empire across all realities.", color: "#ff00ff", startingRep: 1, preferredGoods: ["absolute_omniversal_core", "absolute_infinity_emperor"] },
  hyperreality_god_council: { id: "hyperreality_god_council", name: "Hyperreality God Council", description: "Gods of hyperrealities.", color: "#00bfff", startingRep: 9, preferredGoods: ["hyperreality_god_mesh"] },
  void_omniverse_reapers: { id: "void_omniverse_reapers", name: "Void Omniverse Reapers", description: "Harvesters of the absolute void.", color: "#191970", startingRep: 4, preferredGoods: ["void_omniverse_seed"] },
  genesis_omniverse_collective: { id: "genesis_omniverse_collective", name: "Genesis Omniverse Collective", description: "Seeders of entire omniverses.", color: "#32cd32", startingRep: 20, preferredGoods: ["genesis_omniverse_ark_core"] },
  dark_omniverse_order: { id: "dark_omniverse_order", name: "Dark Omniverse Order", description: "Seekers of dark omniversal power.", color: "#4b0082", startingRep: 2, preferredGoods: ["dark_omniverse_emperor_seed"] }
});

if (window.MISSION_TEMPLATES) {
  window.MISSION_TEMPLATES.push(
    { id: "omniverse-ark-seeding", type: "hauling", title: "Omniverse Ark Seeding", description: "Seed a new omniverse with the Omniverse Ark.", reward: 1200000, reputation: 80, cargo: { infinity_seed: 1 }, destination: "deneb", difficulty: "extreme", faction: "omniverse_order" },
    { id: "hyperdimensional-emperor-deployment", type: "combat", title: "Hyperdimensional Emperor Deployment", description: "Deploy the Hyperdimensional God Emperor.", reward: 950000, reputation: 70, cargo: {}, destination: "wolf-359", difficulty: "extreme", faction: "hyperdimensional_empire" },
    { id: "conceptual-overlord-ascension", type: "diplomatic", title: "Conceptual Overlord Ascension", description: "Assist the Conceptual Overlord's rise.", reward: 880000, reputation: 65, cargo: { conceptual_essence: 2 }, destination: "altair", difficulty: "extreme", faction: "conceptual_overlord_court" },
    { id: "narrative-god-rewrite", type: "exploration", title: "Narrative God Rewrite", description: "Help rewrite a broken narrative.", reward: 1100000, reputation: 75, cargo: { narrative_thread: 3 }, destination: "rigel", difficulty: "extreme", faction: "narrative_god_collective" },
    { id: "probability-emperor-collapse", type: "combat", title: "Probability Emperor Collapse", description: "Collapse hostile probabilities.", reward: 920000, reputation: 68, cargo: {}, destination: "vega", difficulty: "extreme", faction: "probability_emperor_order" },
    { id: "causality-anchor-stabilization", type: "hauling", title: "Causality Anchor Stabilization", description: "Deliver causality anchors to unstable systems.", reward: 780000, reputation: 60, cargo: { causality_ore: 5 }, destination: "wise-0855", difficulty: "extreme", faction: "causality_anchor_council" },
    { id: "dream-omniverse-birth", type: "hauling", title: "Dream Omniverse Birth", description: "Help birth a new dream-omniverse.", reward: 1050000, reputation: 72, cargo: { dream_matter: 4 }, destination: "proxima", difficulty: "extreme", faction: "dream_omniverse_cult" },
    { id: "paradox-overlord-containment", type: "exploration", title: "Paradox Overlord Containment", description: "Contain a runaway paradox.", reward: 1300000, reputation: 85, cargo: { paradox_dust: 2 }, destination: "betelgeuse", difficulty: "extreme", faction: "paradox_overlord_empire" },
    { id: "infinity-emperor-escort", type: "diplomatic", title: "Infinity Emperor Escort", description: "Escort the Infinity Emperor.", reward: 1500000, reputation: 90, cargo: { infinity_core: 1 }, destination: "deneb", difficulty: "extreme", faction: "infinity_emperor_order" },
    { id: "absolute-omniverse-core-recovery", type: "exploration", title: "Absolute Omniverse Core Recovery", description: "Recover an Absolute Omniverse Core.", reward: 2000000, reputation: 100, cargo: { absolute_omniversal_core: 1 }, destination: "wise-0855", difficulty: "extreme", faction: "absolute_omniverse_empire" },
    { id: "hyperreality-god-infiltration", type: "exploration", title: "Hyperreality God Infiltration", description: "Infiltrate a hyperreality threat.", reward: 850000, reputation: 62, cargo: {}, destination: "sirius", difficulty: "extreme", faction: "hyperreality_god_council" },
    { id: "void-omniverse-harvest", type: "hauling", title: "Void Omniverse Harvest", description: "Assist in harvesting the absolute void.", reward: 760000, reputation: 58, cargo: { void_of_voids: 3 }, destination: "wise-0855", difficulty: "extreme", faction: "void_omniverse_reapers" },
    { id: "genesis-omniverse-seeding", type: "hauling", title: "Genesis Omniverse Seeding", description: "Seed a cluster of omniverses.", reward: 1400000, reputation: 82, cargo: { infinity_seed: 2 }, destination: "deneb", difficulty: "extreme", faction: "genesis_omniverse_collective" },
    { id: "dark-omniverse-ascension", type: "combat", title: "Dark Omniverse Ascension", description: "Support the Dark Omniverse Order's rise.", reward: 980000, reputation: 70, cargo: {}, destination: "vega", difficulty: "extreme", faction: "dark_omniverse_order" },
    { id: "quantum-probability-delivery", type: "hauling", title: "Quantum Probability Delivery", description: "Deliver quantum probability crystals.", reward: 820000, reputation: 64, cargo: { probability_crystal: 4 }, destination: "altair", difficulty: "extreme", faction: "probability_emperor_order" },
    { id: "meta-narrative-forge-supply", type: "hauling", title: "Meta-Narrative Forge Supply", description: "Supply the Meta-Narrative Forge.", reward: 1150000, reputation: 78, cargo: { narrative_thread: 5 }, destination: "rigel", difficulty: "extreme", faction: "narrative_god_collective" },
    { id: "singularity-omniverse-recovery", type: "exploration", title: "Singularity Omniverse Recovery", description: "Recover a singularity from the omniverse.", reward: 1600000, reputation: 88, cargo: { singularity_dust: 1 }, destination: "wise-0855", difficulty: "extreme", faction: "absolute_omniverse_empire" },
    { id: "phase-omniverse-deployment", type: "combat", title: "Phase Omniverse Deployment", description: "Deploy phase technology across realities.", reward: 900000, reputation: 66, cargo: {}, destination: "wolf-359", difficulty: "extreme", faction: "hyperdimensional_empire" },
    { id: "neural-omniverse-ascension", type: "diplomatic", title: "Neural Omniverse Ascension", description: "Assist neural godship ascension.", reward: 870000, reputation: 63, cargo: { neural_ore: 3 }, destination: "proxima", difficulty: "extreme", faction: "conceptual_overlord_court" },
    { id: "bio-omniverse-evolution", type: "hauling", title: "Bio-Omniverse Evolution", description: "Support biological omniverse evolution.", reward: 740000, reputation: 55, cargo: { bio_essence: 6 }, destination: "tau-ceti", difficulty: "extreme", faction: "genesis_omniverse_collective" },
    { id: "dream-god-essence-delivery", type: "hauling", title: "Dream God Essence Delivery", description: "Deliver dream god essence.", reward: 690000, reputation: 52, cargo: { dream_matter: 5 }, destination: "gliese-581", difficulty: "extreme", faction: "dream_omniverse_cult" },
    { id: "absolute-infinity-core-escort", type: "diplomatic", title: "Absolute Infinity Core Escort", description: "Escort an Absolute Infinity Core.", reward: 1800000, reputation: 95, cargo: { absolute_infinity_core: 1 }, destination: "deneb", difficulty: "extreme", faction: "infinity_emperor_order" },
    { id: "omniversal-god-particle-recovery", type: "exploration", title: "Omniversal God Particle Recovery", description: "Recover an Omniversal God Particle.", reward: 2200000, reputation: 110, cargo: { omniversal_god_particle: 1 }, destination: "wise-0855", difficulty: "extreme", faction: "omniverse_order" },
    { id: "conceptual-emperor-engine-transport", type: "hauling", title: "Conceptual Emperor Engine Transport", description: "Transport a Conceptual Emperor Engine.", reward: 1250000, reputation: 80, cargo: { conceptual_circuit: 2 }, destination: "rigel", difficulty: "extreme", faction: "conceptual_overlord_court" },
    { id: "paradox-containment-emergency", type: "hauling", title: "Paradox Containment Emergency", description: "Emergency delivery of paradox containment.", reward: 980000, reputation: 70, cargo: { paradox_containment: 2 }, destination: "betelgeuse", difficulty: "extreme", faction: "paradox_overlord_empire" },
    { id: "hyperdimensional-ore-run", type: "hauling", title: "Hyperdimensional Ore Run", description: "Bulk hyperdimensional ore delivery.", reward: 620000, reputation: 45, cargo: { hyperdimensional_ore: 10 }, destination: "sirius", difficulty: "extreme", faction: "hyperdimensional_empire" },
    { id: "omniverse-shard-survey", type: "exploration", title: "Omniverse Shard Survey", description: "Survey omniverse shard deposits.", reward: 750000, reputation: 55, cargo: { omniverse_shard: 3 }, destination: "canopus", difficulty: "extreme", faction: "omniverse_order" },
    { id: "infinity-seed-protection", type: "combat", title: "Infinity Seed Protection", description: "Protect infinity seeds from threats.", reward: 1100000, reputation: 75, cargo: {}, destination: "deneb", difficulty: "extreme", faction: "genesis_omniverse_collective" }
  );
}

console.log("Expansion v14 loaded: Omniversal content added.");