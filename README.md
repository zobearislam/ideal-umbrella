# Space Pack — Enhanced

A browser-based solar system simulator with flyable ships, walkable interiors, EVA, orbital mechanics, economy, reputation, factions, and resource crafting. Built for educational and exploratory use. Family-friendly.

## Resources Module

Resources are defined in `js/space.js` under `RESOURCES`. Each resource has:

- `id` — unique string key
- `name` — display name
- `icon` — emoji or short symbol

Current resources: Iron Ore 🪨, Fuel Cell ⛽, Crystal 💎, Alloy ⚙️, Circuit 🔌, Ice 🧊.

You can add more by editing the `RESOURCES` object.

## Crafting Table

Recipes are in `CRAFTING_RECIPES`. Each recipe is:

```js
{ id: "smelt-alloy", name: "Smelt Alloy", inputs: ["iron", "fuel"], output: "alloy" }
```

- Inputs are resource IDs that are consumed (1 each).
- Output is the resource ID produced.
- Crafting is available at any station via the station menu.

Example recipes:
- Iron + Fuel → Alloy
- Crystal + Iron → Circuit
- Ice + Crystal → Fuel

Player starts with some inventory. Crafting consumes inputs and adds the output.

## Gates
- Cyan ring gates connect locations (Earth ↔ Alpha Centauri, Earth ↔ Sirius, Mars ↔ Jupiter)
- Fly close to a gate to automatically jump to its destination
- Gate use slightly raises reputation with the controlling faction

## Factions & Corporations
- **Sol Federation** — Earth-led alliance
- **Alpha Cooperative** — Alpha Centauri trade group
- **Sirius Mining Corp** — Resource extraction
- **Independent** — Unaffiliated
- Stations and gates belong to factions
- Reputation is tracked per faction and shown in the HUD
- Prices and access can be affected by faction standing

## Economy & Stations

- **Stations** around every planet and large moon, plus three Sol stations
- **Alpha Centauri** and **Sirius** systems with their own planets
- **Economy**: Credits, buy ships at stations (price affected by reputation)
- **Hire pilots** (Aria Chen, Marcus Vale, Lina Okoye, Theo Park) with wages and skill
- **Reputation** (0–100): rises with peaceful actions, falls when firing defense laser near bodies
- **Defense laser** on every ship (Spacebar or Laser button) — abstract, non-graphic
- **Dock** button to open station menu when near a station (ships, pilots, inventory, crafting)
- New ship: **Interceptor** (fast, higher weapon rating)

## Controls (updated)

| Action | Control |
|--------|---------|
| Fire defense laser | Spacebar or Laser button |
| Dock at station | Dock button (when near a station) |

- Full solar system with real orbital periods and approximate sizes (scaled)
- Flyable ships with interior walking and EVA modes
- Lock onto planets, moons, or the ISS and follow them
- Time acceleration (1×, 60×, 3600×, 86400×)
- Toggle orbital path visualization
- Simple radar of nearby objects
- Fuel system with HUD bar and out-of-fuel warning
- Proximity warning when too close to a body
- Atmosphere glow on Earth
- Asteroid belt between Mars and Jupiter
- Load custom .glb / .gltf / .obj models onto ships or bodies
- Mobile-friendly joystick and button controls
- Help panel with controls

## Controls

| Mode | Controls |
|------|----------|
| **Fly** | Joystick / WASD / arrows to turn · W/S or slider for speed · Q/E roll · X stop |
| **Walk** | Move inside ship · Green door = airlock · Front = seat |
| **EVA** | Free movement outside · Stay close to re-enter |

**Buttons:** Go (jump near selected object) · Lock · Time · Orbits · Pause · Help · Model

## Project Structure

```
index.html          Main page
css/style.css       Styles
js/space.js         Simulation logic (includes RESOURCES and CRAFTING_RECIPES)
assets/             Control button and joystick images
```

## Running

Open `index.html` in a modern browser. No build step required.

For GitHub Pages, push this folder to a repo and enable Pages.

## Customization

- Edit the `RESOURCES` object to add new resources (id, name, icon).
- Edit `CRAFTING_RECIPES` to add new recipes (inputs array → output).
- Edit the `PACK` object to add planets, moons, stations, or ship types.

## License

Use freely for educational and personal projects.
