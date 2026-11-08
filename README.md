# Space Pack — Enhanced

A browser-based solar system simulator with flyable ships, walkable interiors, EVA, orbital mechanics, economy, reputation, factions, resource crafting, tethers, and interstellar gates. Built for educational and exploratory use. Family-friendly.

**Live demo:** open `index.html` in a modern browser (no build step).

## Highlights

- Full Sol system + Alpha Centauri, Sirius, Vega, Altair, Rigel, Kepler
- Flyable ships (Scout, Freighter, Interceptor, Tanker, Courier, Explorer, Hauler…) with interior walk mode and EVA
- Stations, gates, electrodynamic tethers & skyhooks
- Credits, faction reputation, ship shop, pilot hiring
- Resource inventory + crafting recipes
- Delivery contracts (Transport-style)
- **Save / Load** — progress persists in the browser (credits, inventory, reputation, ships, contracts)
- Mobile-friendly joystick + on-screen controls (works even without PNG button assets)

## Controls

| Mode | Controls |
|------|----------|
| **Fly** | Joystick / WASD / arrows to turn · W/S or slider for speed · Q/E roll · X stop |
| **Walk** | Move inside ship · Green door = airlock · Front = seat |
| **EVA** | Free movement outside · Stay close to re-enter |

**Buttons:** Go · Lock · Time · Orbits · Pause · Help · Model · **Save** · **Load** · **Dock** · **Laser**

- **Dock** — near a station or tether: buy ships, hire pilots, craft, accept contracts
- **Laser** — Spacebar or Laser button (abstract defense weapon; affects reputation)
- **Gates** — fly into cyan rings to jump between systems
- **Tethers** — approach EDT for boost / Skyhook for momentum exchange (credits + fuel savings)

## Resources & Crafting

Resources live in `js/space.js` under `RESOURCES`. Crafting recipes are in `CRAFTING_RECIPES`.

Examples:
- Iron + Fuel → Alloy
- Crystal + Iron → Circuit
- Ice + Crystal → Fuel
- Cellulose + Fuel → Plastic

## Project structure

```
index.html              Main simulator
transport.html          Separate transport-tycoon prototype
css/style.css           UI styles (includes control fallbacks)
js/space.js             Core simulation, economy hooks, crafting, tethers, contracts
js/economy.js           Lightweight economy / reputation helper
js/transport.js         Transport prototype logic
js/iag.js               Additional helpers
database/               SQL schema notes for transport
assets/resources/       Resource icons
README_TRANSPORT_SETUP.md
```

## Running

1. Clone or download the repo.
2. Open `index.html` in Chrome, Firefox, Edge, or Safari.
3. For GitHub Pages: push and enable Pages on the `main` branch (root).

No Node, no bundler required.

## Persistence

- **Save** / **Load** buttons in the top bar write to `localStorage` key `spacePack.main.v1`.
- Auto-save runs about every 2 minutes.
- Clears if you wipe site data for the origin.

## Customization

- Edit `RESOURCES` and `CRAFTING_RECIPES` in `js/space.js`.
- Edit `PACK.ships` and `PACK.objects` to add ships or bodies.
- Edit `FACTIONS`, `GATES`, `CONTRACTS`, `TETHER_CONFIG` for systems content.
- Economy tuning lives in `js/economy.js`.

## License

Use freely for educational and personal projects.
