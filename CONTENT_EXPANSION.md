# Content Expansion - Ideal Umbrella

Major content expansion for the Space Pack / Ideal Umbrella project.

## New / Expanded Data (v0.5)

### `js/data/resources.js` (Canonical)
- **70+ resources** across raw, refined, and high-value categories
- New raw: platinum, tungsten, sulfur, phosphorus, deuterium, palladium, iridium, organics, biomass, osmium, water
- New refined: platinum_ingot, tungsten_alloy, explosives, pharmaceuticals, food_rations, electronics, sensors, thrusters, armor_plates, deuterium_fuel, luxury_goods
- New high: warp_coil, shield_generator, ai_core, biogel, antimatter_containment, research_data, singularity_fragment
- **43 crafting recipes** covering full production chains including advanced tech
- **21 ship types**: added Destroyer, Fuel Tanker, Deep Surveyor, Medical Ship, Pirate Raider, Dreadnought, Mining Barge, Express Courier
- **17 factions**: added Free Traders Alliance, Syndicate of Shadows, Terraforming Initiative, AI Collective, Order of the Stellar Path

### `js/core/universe.js`
- **35 star systems** with full route connectivity
- New systems: Procyon, Arcturus, Capella, Fomalhaut, Deneb, Betelgeuse, Polaris, Canopus, 55 Cancri, HD 189733, Ross 248, Luhman 16, HD 40307, WISE 0855, Tau Ceti e Colony
- Updated `findRoute` with complete connection graph so any system is reachable

### `js/data/missions.js`
- **45 mission templates** covering delivery, combat, exploration, and diplomatic contracts
- Wider variety of cargo types (including all new advanced resources), destinations, and reputation effects
- Higher-tier missions involving advanced resources, distant systems, and new factions

## Integration

All data is attached to `window` (RESOURCES, CRAFTING_RECIPES, SHIP_TYPES, FACTIONS, UNIVERSE, MISSIONS) so existing classic scripts continue to work without changes.

## Summary

| Category       | Previous | Now    |
|----------------|----------|--------|
| Resources      | ~40      | 70+    |
| Recipes        | 23       | 43     |
| Ship Types     | 13       | 21     |
| Factions       | 12       | 17     |
| Star Systems   | 20       | 35     |
| Mission Types  | 25       | 45     |

The universe is now significantly deeper for trading, exploration, and long-term progression.

Enjoy the expanded Ideal Umbrella!
