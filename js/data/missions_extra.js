// Extra missions for Ideal Umbrella content expansion
// Append or merge into window.MISSIONS

const EXTRA_MISSIONS = [
  {
    id: "m046",
    title: "Rhodium Haul for Merchant Guild",
    type: "delivery",
    from: "sol",
    to: "vega",
    cargo: "rhodium",
    quantity: 12,
    reward: 28000,
    reputation: { merchant_guild: 5, jovian: 2 },
    difficulty: 3,
    description: "High-value rhodium for luxury market expansion on Vega."
  },
  {
    id: "m047",
    title: "Dark Matter Sample Retrieval",
    type: "exploration",
    from: "sol",
    to: "wise-0855",
    reward: 95000,
    reputation: { science_collective: 10, void_walkers: 6 },
    difficulty: 5,
    description: "Recover rare dark matter samples from the coldest known system."
  },
  {
    id: "m048",
    title: "Living Metal Transport",
    type: "delivery",
    from: "proxima",
    to: "rigel",
    cargo: "living_metal",
    quantity: 3,
    reward: 62000,
    reputation: { bio_collective: 8, science_collective: 4 },
    difficulty: 4,
    description: "Delicate living metal samples for bio-tech research."
  },
  {
    id: "m049",
    title: "Fleet Carrier Escort",
    type: "combat",
    from: "sirius",
    reward: 88000,
    reputation: { military_order: 9, sirius_mining: 5, pirate: -18 },
    difficulty: 5,
    description: "Provide heavy escort for a new Fleet Carrier deployment."
  },
  {
    id: "m050",
    title: "Void Crystal Survey",
    type: "exploration",
    from: "sol",
    to: "betelgeuse",
    reward: 54000,
    reputation: { void_walkers: 7, explorers: 5 },
    difficulty: 5,
    description: "Map void crystal deposits near the unstable supergiant."
  },
  {
    id: "m051",
    title: "Cryo Fuel Emergency",
    type: "delivery",
    from: "sol",
    to: "trappist",
    cargo: "cryo_fuel",
    quantity: 25,
    reward: 19500,
    reputation: { outer: 6, terraformers: 3 },
    difficulty: 3,
    description: "Critical cryogenic fuel for colony life support systems."
  },
  {
    id: "m052",
    title: "Consciousness Matrix Delivery",
    type: "delivery",
    from: "proxima",
    to: "proxima",
    cargo: "consciousness_matrix",
    quantity: 1,
    reward: 110000,
    reputation: { ai_collective: 10, science_collective: 6 },
    difficulty: 5,
    description: "Ultra-sensitive AI consciousness matrix. Maximum security."
  },
  {
    id: "m053",
    title: "Merchant Guild Trade Pact",
    type: "diplomatic",
    from: "sol",
    to: "alpha-cen",
    reward: 14500,
    reputation: { merchant_guild: 7, free_traders: 4 },
    difficulty: 2,
    description: "Formalize exclusive shipping rights with the Merchant Guild."
  },
  {
    id: "m054",
    title: "Nano Armor for Military Order",
    type: "delivery",
    from: "altair",
    to: "sirius",
    cargo: "nano_armor",
    quantity: 10,
    reward: 32000,
    reputation: { military_order: 6, independent: 2 },
    difficulty: 3,
    description: "Advanced armor plating for Order outposts."
  },
  {
    id: "m055",
    title: "Zero Point Module Prototype",
    type: "delivery",
    from: "rigel",
    to: "sol",
    cargo: "zero_point_module",
    quantity: 1,
    reward: 145000,
    reputation: { science_collective: 12, terran: 6 },
    difficulty: 5,
    description: "Experimental zero-point energy module. Extreme precautions required."
  }
];

// Merge into existing missions if loaded after
if (window.MISSIONS) {
  window.MISSIONS = window.MISSIONS.concat(EXTRA_MISSIONS);
  console.log("Added", EXTRA_MISSIONS.length, "extra missions. Total:", window.MISSIONS.length);
}
