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
- **390+ resources** across raw / refined / high-value categories with full production chains
- **50+ crafting recipes** at stations
- Shared inventory between simulator and Transport
- Rival NPC companies that haul goods (buy them out if you can afford it)

### Ships
- **143+ ship types** including Scout, Courier, Interceptor, Hauler, Freighter, Mining Rig, Passenger Liner, Capital Ship, Science Vessel, Luxury Yacht, Combat Frigate, Super Hauler, Phantom Runner, Destroyer, Fuel Tanker, Deep Surveyor, Medical Ship, Pirate Raider, Dreadnought, Mining Barge, Express Courier, Fleet Carrier, Stealth Bomber, Mining Mothership, Research Cruiser, Luxury Cruiser, Battleship, Deep Exploration Vessel, Trade Barge, Assault Carrier, Mobile Science Station, Smuggler, Colony Ship, Elite Interceptor, Bulk Processor, Diplomatic Envoy, Titan-Class Dreadnought, Generation Ark, Phase Runner, Mobile Refinery Cruiser, Stealth Frigate, Quantum Hauler, Siege Engine, Research Ark, Pirate Mothership, Diplomatic Cruiser, Asteroid Cracker, Void Walker, Prime Dreadnought, Colony Ark, Phase Assassin, Mobile Foundry, Ghost Frigate, Quantum Freighter, Planetary Siege Platform, Research University, Corsair Flagship, Diplomatic Flagship, Asteroid Processor, Anomaly Explorer, Stealth Hauler, Titan Carrier, Void Harvester, Apex Dreadnought, World Ark, Phase Wraith, Mega Foundry, Shadow Cruiser, Quantum Superhauler, Orbital Fortress, Academy Ship, Pirate Mothership, Embassy Ship, Asteroid Cracker, Anomaly Hunter, Ghost Hauler, Leviathan Carrier, Void Reaper, Chronal Explorer, Singularity Tug, Neural Flagship, Bio Ark, Omega Dreadnought, Absolute Dreadnought, Genesis Ark, Phase Overlord, Mega Forge World, Shadow Overlord, Omega Overlord, Titan Carrier, Knowledge Ark, Pirate Empire Flagship, Diplomatic Overlord, Void Overlord, Chronal Overlord, Neural Godship, Living Universe Ship, Void Emperor, Absolute Dreadnought Prime, Genesis Emperor Ark, Phase God, Omega Reality Forge, Shadow God, Precursor Flagship, Chronal Godship, Neural Emperor, Bio Emperor, Void God, Absolute Emperor, Multiverse Ark, Reality God Emperor, Omega Multiverse Forge, Chronal God Emperor, Neural Multiverse Godship, Void Multiverse Emperor, Absolute God Dreadnought, Genesis Multiverse Ark, Phase Multiverse God, Precursor Multiverse Flagship, Singularity Multiverse Emperor, Omega Reality God Forge, Shadow Multiverse God, Bio Multiverse Emperor, Void God Emperor, Absolute Multiverse Emperor, Chronal Multiverse Godship, Neural God Emperor, Phase Overlord Emperor, Dark Omega Multiverse Flagship, Genesis God Ark, Omega God Forge World, Shadow God Emperor, Bio-God Overlord, Void Overlord Emperor
- Cargo vs combat hulls (turrets / missiles only on combat vessels)
- Fleet management and pilot hiring

### Galaxy & Travel
- **35+ star systems** connected by cyan ring gates
- Interactive galaxy map with route finding
- Transport command center for contracts and journeys

### Factions & Reputation
- **105+ factions**: Terran Confederation, Martian Republic, Belt Miners’ Union, Jovian Syndicate, Outer Colonies League, Pirate Clans, Alpha Cooperative, Sirius Mining Corp, Science Collective, Independents, Corporate League, Explorer's Guild, Free Traders Alliance, Syndicate of Shadows, Terraforming Initiative, AI Collective, Order of the Stellar Path, Merchant Guild, Military Order, Bio Collective, Void Walkers, Trade Syndicate, Rebel Alliance, Ancient Guardians, MegaCorp Consortium, Nomad Clans, Stellar Cult, Void Cult, Free Traders Union, Xenotech Collective, Orbital League, Deep Miners Guild, Quantum Order, Frontier Militia, Stellar Archivists, Stellar Empire, Free Colonies Alliance, Tech Syndicate, Order of Void Walkers, Mineral Consortium, Scientific Federation, Merchant Republic, Shadow Council, Bio-Engineers Guild, Anomaly Hunters, Imperial Remnant, Frontier League, Quantum Order, Void Reapers, Stellar Foundries, Chronal Institute, Free Merchants Guild, Shadow Syndicate, Bio Collective Prime, Anomaly Consortium, Stellar Empire Core, Research Exodus, Mineral Lords, Neural Collective, Omega Cult, Absolute Order, Genesis Collective, Phase Lords, Forge Empire, Shadow Empire, Omega Empire, Titan Legion, Knowledge Keepers, Pirate Empire, Diplomatic Order, Void Empire, Chronal Empire, Reality Order, Genesis Empire, Phase Emperor's Court, Singularity Empire, Chronal God Order, Neural God Collective, Living Universe Cult, Void God Empire, Precursor Remnant, Absolute Emperor Order, Omega Reality Cult, Shadow God Council, Bio-God Empire, Dark Omega Order, Reality Emperor's Court, Multiverse Order, Reality God Empire, Omega Multiverse Cult, Chronal Multiverse Order, Neural Multiverse Collective, Void Multiverse Empire, Precursor Multiverse Remnant, Absolute God Order, Genesis Multiverse Empire, Phase Multiverse Court, Singularity Multiverse Empire, Shadow Multiverse Council, Bio-Multiverse Empire, Dark Omega Multiverse Order, Omega God Cult, Absolute Multiverse Order, Chronal God Multiverse Order, Neural God Multiverse Collective
- Reputation (0–100) affects prices, access, and available missions

### Missions & Company
- **200+ mission templates**: delivery, hauling, scientific, emergency, combat, exploration, and diplomatic contracts
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
    expansion_v07.js       Expansion (v0.7) — resources, ships, factions, missions
    expansion_v08.js       Massive expansion (v0.8) — resources, ships, factions, missions
    expansion_v09.js       Huge expansion (v0.9) — +45 resources, +15 ships, +10 factions, +20 missions
    expansion_v10.js       Massive expansion (v1.0) — +55 resources, +20 ships, +15 factions, +30 missions
    expansion_v11.js       Extreme expansion (v1.1) — +40 resources, +15 ships, +12 factions, +20 missions
    expansion_v12.js       Ultimate expansion (v1.2) — +50 resources, +20 ships, +15 factions, +25 missions
    expansion_v13.js       God-tier expansion (v1.3) — +60 resources, +25 ships, +18 factions, +30 missions
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

- **Resources / recipes / ships / factions** → edit `js/data/resources.js`, `js/data/additional_content.js`, `js/data/expansion_v07.js` through `js/data/expansion_v13.js`
- **Missions** → `js/data/missions.js`, `js/data/missions_extra.js`, and expansions
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
