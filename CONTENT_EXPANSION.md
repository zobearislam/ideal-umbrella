# Content Expansion - Ideal Umbrella

This update adds a large volume of new content to the Space Pack / Ideal Umbrella project.

## New Data Modules

### `js/data/resources.js`
- **50+ resources** across categories: raw, refined, fuel, component, advanced, consumer
- Includes items matching existing asset images (cellulose_quartz, fertilizer, liquid_hydrogen, etc.)
- **24 crafting recipes** with time costs
- Helper functions: `getResource()`, `getRecipe()`

### `js/data/ships.js`
- **10 ship types** (expanded from the original 3)
- New ships: Scout, Interceptor, Miner, Luxury Liner, Science Vessel, Titan Freighter, Phantom
- Each has capacity, speed, fuel efficiency, maintenance, and description

### `js/data/factions.js`
- **10 factions** with descriptions, preferred goods, and starting reputation
- Includes original factions plus Science Collective, Sirius Mining Corp, etc.

### `js/data/systems-expanded.js`
- **25+ star systems** (expanded from 7)
- New systems: Proxima, Tau Ceti, Epsilon Eridani, TRAPPIST, Barnard's Star, Wolf 359, Ross 128, Gliese 581, Kepler-442, and more
- Each system has population, controlling faction, and description

### `js/data/missions.js`
- **8 mission templates**: Supply Run, Ore Hauling, Luxury Delivery, Scientific Sample, Emergency Relief, Industrial Parts, Fuel Resupply, Pirate Bounty
- Generator function `generateMission()` to create dynamic contracts

## Integration Notes

These modules are designed as ES modules (`export`). To use them:

```js
import { RESOURCES, CRAFTING_RECIPES } from './js/data/resources.js';
import { SHIP_TYPES } from './js/data/ships.js';
import { FACTIONS } from './js/data/factions.js';
import { EXPANDED_SYSTEMS } from './js/data/systems-expanded.js';
```

Or attach to `window` if using classic scripts.

## Next Steps for Full Integration

1. Update `js/space.js` to load the new RESOURCES and CRAFTING_RECIPES
2. Expand `js/transport.js` to use EXPANDED_SYSTEMS and new SHIP_TYPES
3. Wire mission generation into the contract system
4. Add UI panels for the new resource catalog and faction details
5. Generate more asset images for the new resources if desired

## Summary of Added Content

| Category       | Previous | Now    |
|----------------|----------|--------|
| Resources      | ~6       | 40+    |
| Recipes        | ~3       | 24     |
| Ship Types     | 3        | 10     |
| Factions       | ~6       | 10     |
| Star Systems   | 7        | 25+    |
| Mission Types  | 4 static | 8 templates + generator |

Enjoy the expanded universe!
