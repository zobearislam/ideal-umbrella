# Content Expansion - Ideal Umbrella

Major content expansion for the Space Pack / Ideal Umbrella project.

## New / Expanded Data

### `js/data/resources.js` (Canonical)
- **40+ resources** across raw, refined, and high-value categories
- New raw: copper, aluminum, carbon, nickel, cobalt, lithium, rare_earth, helium3, methane, ammonia, quartz
- New refined: copper_ingot, aluminum_ingot, steel, glass, battery, coolant, polymer, ceramics, refined_titanium
- New high: quantum_chip, fusion_core, nanites, exotic_matter, data_core, pure_silicon
- **23 crafting recipes** covering the full production chains
- **13 ship types**: added Science Vessel, Luxury Yacht, Combat Frigate, Super Hauler, Phantom Runner
- **12 factions**: added Corporate League and Explorer's Guild

### `js/core/universe.js`
- **20 star systems** with full route connectivity
- New systems: Wolf 359, Ross 128, Gliese 581, Kepler-442, 61 Cygni, Lalande 21185, Wolf 1061, Gliese 667
- Updated `findRoute` with complete connection graph so any system is reachable

### `js/data/missions.js`
- **25 mission templates** covering delivery, combat, exploration, and diplomatic contracts
- Wider variety of cargo types, destinations, and reputation effects
- Higher-tier missions involving advanced resources and distant systems

## Integration

All data is attached to `window` (RESOURCES, CRAFTING_RECIPES, SHIP_TYPES, FACTIONS, UNIVERSE, MISSIONS) so existing classic scripts continue to work without changes.

## Summary

| Category       | Previous | Now    |
|----------------|----------|--------|
| Resources      | ~16      | 40+    |
| Recipes        | 7        | 23     |
| Ship Types     | 8        | 13     |
| Factions       | 10       | 12     |
| Star Systems   | 12       | 20     |
| Mission Types  | 10       | 25     |

The universe is now significantly deeper for trading, exploration, and long-term progression.

Enjoy the expanded Ideal Umbrella!
