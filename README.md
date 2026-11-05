# Space Pack — Enhanced

A browser-based solar system simulator with flyable ships, walkable interiors, EVA, and orbital mechanics. Built for educational and exploratory use.

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

## New Features (Economy & Reputation)

- **Stations** around every planet and large moon, plus three Sol stations
- **Alpha Centauri** and **Sirius** systems with their own planets
- **Economy**: Credits, buy ships at stations (price affected by reputation)
- **Hire pilots** (Aria Chen, Marcus Vale, Lina Okoye, Theo Park) with wages and skill
- **Reputation** (0–100): rises with peaceful actions, falls when firing defense laser near bodies
- **Defense laser** on every ship (Spacebar or Laser button) — abstract, non-graphic
- **Dock** button to open station menu when near a station
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
js/space.js         Simulation logic
assets/             Control button and joystick images
```

## Running

Open `index.html` in a modern browser. No build step required.

For GitHub Pages, push this folder to a repo and enable Pages.

## Control Assets

The on-screen joystick and buttons use PNG images in the `assets/` folder:

- `assets/joy_base.png`
- `assets/joy_knob.png`
- `assets/btn_thrust_up.png`
- `assets/btn_thrust_down.png`
- `assets/btn_pitch_up.png`
- `assets/btn_pitch_down.png`

These binary images are not in the repo yet. To add them:

1. Download the SpacePack package or the control PNGs.
2. On this GitHub repo page, click **Add file → Upload files**.
3. Drag the 6 PNG files into an `assets/` folder (create it if needed).
4. Commit the changes.

Keyboard and mouse controls work even without the images (the buttons will show as broken until the assets are uploaded).

## Customization

Edit the `PACK` object at the top of `js/space.js` to add planets, moons, stations, or ship types. See the comments in the original single-file version for the full format.

## License

Use freely for educational and personal projects.
