# Changelog

All notable changes to Ideal Umbrella are documented here.

## [0.3.0] — Core Overhaul (2026-11-11)

### Added / Restored
- **Complete playable 3D simulator** (`js/space.js`)
  - Full solar system with major moons
  - Ship flight (WASD / joystick / throttle / pitch / roll)
  - Docking at any body → station panel
  - Station features: buy/sell resources, craft from recipes, complete missions
  - HUD (credits, cargo, thrust, dock status)
  - Defense laser, time scale, pause, orbit lines, camera lock
  - Shared inventory & reputation with the rest of the game
- HUD, station panel, toast notification, and help overlay styles
- MIT LICENSE, `.gitignore`, `package.json`
- Consistent Ideal Umbrella branding across all pages

### Improved
- Completely rewritten README (features, controls, structure, customization)
- Transport page branding and structure cleanup
- Page titles and meta description
- Foundation for continued content expansion

### Notes
- Open `index.html` and fly near Earth (or any body) → press **Dock** to use the market, craft, and complete missions.
- Accept missions on the Mission Board first, then complete them after docking with the required cargo.
- Data modules in `js/data/resources.js` remain the single source of truth.

## Expanded Content Update (previous)

- Full solar system (Mercury–Neptune) + major moons
- Expanded star systems, resources, recipes, ship types, factions
- Mission board, transport prototype, company/diplomacy UIs
