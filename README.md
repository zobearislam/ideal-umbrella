# Space Pack — Enhanced

A browser-based solar system simulator with flyable ships, walkable interiors, EVA, orbital mechanics, economy, reputation, factions, resource crafting, missions, and interstellar transport. Built for educational and exploratory use. Family-friendly.

## What's New

- **Full solar system**: Mercury through Neptune plus major moons (Luna, Phobos, Deimos, Io, Europa, Ganymede, Callisto, Titan, Enceladus, Triton, etc.)
- **Stations** at every major body and the asteroid belt
- **Gates** connecting Sol to Alpha Centauri, Proxima, Sirius, Vega, Altair, Tau Ceti, Epsilon Eridani, TRAPPIST-1, Barnard's Star, and more
- **Expanded resources & crafting**: iron, ice, crystal, uranium, titanium, silicon, alloy, circuits, plastic, LOX, LH2, gold, fertilizer, advanced circuits, antimatter
- **Ship types**: Scout, Courier, Interceptor, Hauler, Freighter, Mining Rig, Passenger Liner, Capital Ship
- **Mission board** with deliveries, combat, diplomacy, and exploration contracts
- **Factions**: Terran Confederation, Martian Republic, Belt Miners’ Union, Jovian Syndicate, Outer Colonies League, Pirate Clans
- **Company & Diplomacy** wireless interfaces
- **Transport management** with fleet, contracts, and timestamped journeys

## Resources Module

Resources are defined in `js/data/resources.js` and also referenced from the simulator. Each resource has:

- `id` — unique string key
- `name` — display name
- `icon` — emoji
- `basePrice` — starting market price
- `category` — raw / refined / high

## Crafting Table

Recipes are in `CRAFTING_RECIPES`. Example:

```js
{ id: "smelt-alloy", name: "Smelt Alloy", inputs: ["iron", "fuel"], output: "alloy", time: 5 }
```

Inputs are consumed (1 each). Output is produced. Available at stations.

## Gates & Systems

Cyan ring gates connect star systems. Fly close to jump. Current systems include Sol, Alpha Centauri, Proxima Centauri, Sirius, Vega, Altair, Rigel, Kepler, Tau Ceti, Epsilon Eridani, TRAPPIST-1, and Barnard's Star.

## Factions & Reputation

Reputation (0–100) affects prices, access, and mission availability. Peaceful actions raise standing; weapons fire near stations or civilians lowers it. Tracked via the Economy and IAG modules.

## Economy & Stations

- Credits for buying ships, hiring pilots, and crafting
- Stations around every planet and large moon
- Hire pilots and manage a fleet
- Defense laser (Spacebar) — abstract, non-graphic
- Dock button opens station menu (ships, pilots, inventory, crafting, missions)

## Controls

| Action | Control |
|--------|---------|
| Fire defense laser | Spacebar or Laser button |
| Dock at station | Dock button (when near a station) |
| Fly | Joystick / WASD / arrows · W/S or slider for speed · Q/E roll · X stop |
| Walk / EVA | Stand up near seat / airlock |

Additional pages:
- `galaxy.html` — interactive star system map and route finder
- `transport.html` — fleet, contracts, and journeys
- `missions.html` — mission board
- `ui/company.html` — company wireless (ships, pilots, licenses)
- `ui/diplomacy.html` — faction relations and battle forecast

## Project Structure

```
index.html              Main 3D simulator
galaxy.html             Galaxy map
transport.html          Transport command
missions.html           Mission board
css/                    Styles
js/space.js             Core simulation
js/data/resources.js    Resources, ships, factions
js/data/missions.js     Mission definitions
js/core/universe.js     Shared star systems
js/economy.js           Economy & reputation
js/transport.js         Transport prototype
js/iag.js               Authority / incident system
ui/                     Company & diplomacy interfaces
assets/                 Resource icons and control images
```

## Running

Open `index.html` in a modern browser. No build step required.

For GitHub Pages, push this folder to a repo and enable Pages.

## Customization

- Edit `js/data/resources.js` to add resources, recipes, or ship types.
- Edit `js/data/missions.js` or `js/core/universe.js` to expand systems and missions.
- Edit the planet definitions inside `js/space.js` for new bodies.

## License

Use freely for educational and personal projects.
