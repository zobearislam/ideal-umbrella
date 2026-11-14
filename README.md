# Ideal Umbrella 🌂

**Browser-based interstellar trading, exploration, and empire-building simulator.**

Fly ships through a full solar system and beyond, manage cargo and crafting, build reputation with factions, run a transport company, accept missions, and expand your influence across the stars. No installation required — just open it in a modern browser.

Family-friendly. Educational focus on orbital mechanics, resource chains, and light strategy.

---

## Features

### Simulation
- Full inner + outer solar system (Mercury → Neptune) with major moons
- Stations at key bodies and the asteroid belt
- Flyable ships with cockpit / standing / EVA modes
- Orbital visualization, time acceleration, lock-on targeting
- Simple defense laser (abstract, non-graphic)

### Economy & Logistics
- Credits, personal + company accounts
- **110+ resources** across raw / refined / high-value categories with full production chains
- **43+ crafting recipes** at stations
- Shared inventory between simulator and Transport
- Rival NPC companies that haul goods (buy them out if you can afford it)

### Ships
- **36+ ship types** including Scout, Courier, Interceptor, Hauler, Freighter, Mining Rig, Passenger Liner, Capital Ship, Science Vessel, Luxury Yacht, Combat Frigate, Super Hauler, Phantom Runner, Destroyer, Fuel Tanker, Deep Surveyor, Medical Ship, Pirate Raider, Dreadnought, Mining Barge, Express Courier, Fleet Carrier, Stealth Bomber, Mining Mothership, Research Cruiser, Luxury Cruiser, Battleship, Deep Exploration Vessel, Trade Barge, Assault Carrier, Mobile Science Station, Smuggler, Colony Ship, Elite Interceptor, Bulk Processor, Diplomatic Envoy
- Cargo vs combat hulls (turrets / missiles only on combat vessels)
- Fleet management and pilot hiring

### Galaxy & Travel
- **35+ star systems** connected by cyan ring gates
- Interactive galaxy map with route finding
- Transport command center for contracts and journeys

### Factions & Reputation
- **27+ factions**: Terran Confederation, Martian Republic, Belt Miners’ Union, Jovian Syndicate, Outer Colonies League, Pirate Clans, Alpha Cooperative, Sirius Mining Corp, Science Collective, Independents, Corporate League, Explorer's Guild, Free Traders Alliance, Syndicate of Shadows, Terraforming Initiative, AI Collective, Order of the Stellar Path, Merchant Guild, Military Order, Bio Collective, Void Walkers, Trade Syndicate, Rebel Alliance, Ancient Guardians, MegaCorp Consortium, Nomad Clans, Stellar Cult
- Reputation (0–100) affects prices, access, and available missions

### Missions & Company
- **63+ mission templates**: delivery, hauling, scientific, emergency, combat, exploration, and diplomatic contracts
- Company wireless interface (ships, pilots, licenses)
- Diplomacy panel with faction relations and battle forecasts
- Finance overview

---

## Quick Start

1. Clone or download the repository.
2. Open `index.html` in a modern browser (Chrome, Firefox, Edge, Safari).
3. No build step or server required for local play.

For GitHub Pages: enable Pages on the `main` branch (root).

---

## Controls (Main Simulator)

| Action              | Control                          |
|---------------------|----------------------------------|
| Fly                 | Joystick / WASD / Arrow keys     |
| Throttle            | Slider or ▲▼                     |
| Pitch               | ↑↓                               |
| Roll                | Q / E                            |
| Stop                | X or Stop button                 |
| Fire defense laser  | Spacebar or Laser button         |
| Dock                | Dock button (near station)       |
| Camera target       | Select body → Go / Lock          |
| Stand / Sit         | Stand button                     |
| Time scale          | Settings → Time x1 / x10 / …     |
| Toggle orbits       | Settings → Orbits                |

Additional pages via the Menu button:
- Galaxy map
- Transport
- Missions
- Company
- Diplomacy
- Finance

---

## Project Structure

```
index.html                 Main 3D simulator
galaxy.html                Interactive star map + route finder
transport.html             Fleet, contracts, NPC rivals
missions.html              Mission board
ui/company.html            Company management
ui/diplomacy.html          Faction relations
ui/finance.html            Credits overview

css/                       Styles (steampunk theme)
js/
  space.js                 Core Three.js simulator
  economy.js               Credits, prices, reputation helpers
  transport.js             Transport logic
  iag.js                   Authority / incident system
  npc-companies.js         Rival company simulation
  ship-models.js           Visual ship variants
  data/
    resources.js           Canonical RESOURCES, CRAFTING_RECIPES, SHIP_TYPES, FACTIONS
    additional_content.js  Extra resources, ships, factions (v0.6)
    expansion_v07.js       Massive expansion (v0.7) — resources, ships, factions, missions
    missions.js            Mission templates + generator
    missions_extra.js      Additional high-tier missions
    systems-expanded.js    Extra systems catalog
  core/
    universe.js            SYSTEMS, getSystem, findRoute
    game-state.js          Shared state + save bridge
    credits.js             Personal / company credit accounts
    save-manager.js        Persistence (local + Supabase option)
    faction-standing.js    Reputation tracking
assets/resources/          Resource icons
database/                  SQL helpers for optional backend
tests/                     Basic integration tests
```

---

## Customization

- **Resources / recipes / ships / factions** → edit `js/data/resources.js`, `js/data/additional_content.js`, and `js/data/expansion_v07.js`
- **Missions** → `js/data/missions.js`, `js/data/missions_extra.js`, and expansion
- **Star systems & gates** → `js/core/universe.js` (and `systems-expanded.js` for extras)
- **Planet / moon definitions** → inside `js/space.js`
- **Visual style** → `css/style.css` and related stylesheets

All major catalogs are attached to `window` so classic scripts can share them without a bundler.

---

## Optional: Supabase Saves

The project includes hooks for cloud saves via Supabase (see `js/core/supabase-config.js` and `js/core/save-manager.js`).  
Copy the example config, add your project URL + anon key, and enable the relevant tables (see `database/` SQL files).

Local storage continues to work without any backend.

---

## Development Notes

- No build step by design — pure HTML/CSS/JS for maximum portability.
- Three.js is loaded from CDN (r128). Newer versions can be swapped carefully.
- Shared state lives on `window.GameState`, `window.Credits`, `window.UNIVERSE`, etc.
- Keep new content in the `js/data/` modules so the simulator, transport, and UIs stay in sync.

---

## License

MIT — see [LICENSE](LICENSE).

Use freely for educational, personal, and commercial projects. Attribution appreciated but not required.

---

*Ideal Umbrella — stay dry among the stars.*
