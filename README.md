# Space Pack — Enhanced (Ideal Umbrella)

A browser-based solar system simulator with flyable ships, walkable interiors, EVA, orbital mechanics, economy, reputation, factions, and resource crafting. Built for educational and exploratory use. Family-friendly.

> **Massive content update available!** See `CONTENT_EXPANSION.md` and the new files in `js/data/` for 40+ resources, 24 recipes, 10 ship types, 25+ star systems, 10 factions, and dynamic mission generation.

## Resources Module

Resources are now defined in the expanded `js/data/resources.js` (and can still be extended in `js/space.js`). Each resource has:

- `id` — unique string key
- `name` — display name
- `icon` — emoji or short symbol
- `category` — raw / refined / fuel / component / advanced / consumer
- `baseValue` — base economic value

**40+ resources** including Iron Ore, Titanium Ore, Liquid Hydrogen, Cellulose-Quartz Composite, Quantum Chips, Fusion Reactors, and more. Matching asset images exist for several refined materials.

## Crafting Table

Recipes are in `js/data/resources.js` under `CRAFTING_RECIPES` (**24 recipes**).

```js
{ id: "make-alloy", name: "Forge Alloy", inputs: ["refined_iron", "refined_copper"], output: "alloy", time: 6 }
```

- Inputs are resource IDs that are consumed (1 each by default).
- Output is the resource ID produced.
- Includes time cost for more advanced crafting systems.

Example recipes:
- Refined Iron + Refined Copper → Alloy
- Pure Silicon + Refined Copper + Crystal → Circuit
- Cellulose + Quartz → Cellulose-Quartz Composite
- Multiple components → Fusion Reactor

## Expanded Universe

- **25+ star systems** in `js/data/systems-expanded.js` (Proxima, Tau Ceti, TRAPPIST, Gliese 581, Kepler-442, and many more)
- **10 ship types** in `js/data/ships.js` (Scout, Interceptor, Miner, Titan Freighter, Phantom, Science Vessel, etc.)
- **10 factions** in `js/data/factions.js` with preferred goods and starting reputation
- **Dynamic mission generator** in `js/data/missions.js` with 8 template types

## Gates
- Cyan ring gates connect locations
- Fly close to a gate to automatically jump to its destination
- Gate use slightly raises reputation with the controlling faction

## Factions & Corporations
- Terran Confederation, Martian Republic, Belt Miners’ Union, Jovian Syndicate, Outer Colonies League, Pirate Clans, Alpha Cooperative, Sirius Mining Corp, Science Collective, Independent
- Stations and gates belong to factions
- Reputation is tracked per faction and shown in the HUD
- Prices and access can be affected by faction standing

## Economy & Stations

- Stations around planets, moons, and major systems
- Economy: Credits, buy ships at stations (price affected by reputation)
- Hire pilots with wages and skill
- Reputation (0–100)
- Defense laser on every ship (abstract, non-graphic)
- Dock at stations for ships, pilots, inventory, and crafting

## Controls

| Mode | Controls |
|------|----------|
| **Fly** | Joystick / WASD / arrows to turn · W/S or slider for speed · Q/E roll · X stop |
| **Walk** | Move inside ship · Green door = airlock · Front = seat |
| **EVA** | Free movement outside · Stay close to re-enter |

**Buttons:** Go (jump near selected object) · Lock · Time · Orbits · Pause · Help · Model

## Project Structure

```
index.html              Main page
css/                    Styles
js/space.js             Core simulation
js/data/                NEW: Expanded content modules
  resources.js          40+ resources + 24 recipes
  ships.js              10 ship types
  factions.js           10 factions
  systems-expanded.js   25+ star systems
  missions.js           Dynamic mission generator
assets/                 Images (including resource icons)
CONTENT_EXPANSION.md    Details of the content update
```

## Running

Open `index.html` in a modern browser. No build step required.

For GitHub Pages, push this folder to a repo and enable Pages.

## Customization

- Edit or extend files in `js/data/` to add more resources, ships, systems, factions, or missions.
- Import the ES modules into your scripts, or attach them to `window`.
- See `CONTENT_EXPANSION.md` for integration guidance.

## License

Use freely for educational and personal projects.
