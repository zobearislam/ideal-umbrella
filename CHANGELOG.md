# Changelog

All notable changes to Ideal Umbrella are documented here.

## [0.7.0] — Massive Content Expansion III (2026-11-14)

### Added
- **22 additional resources** (germanium, selenium, indium, gallium, bismuth, antimony, mercury, neon/argon ice, stellar dust, dark matter precursor, graphene, superconductors, neural interfaces, fusion parts, plasma coils, singularity cores, omega particles, chrono crystals, void alloy, quantum stabilizers, living circuits)
- **10 new ship types**: Battleship, Deep Exploration Vessel, Trade Barge, Assault Carrier, Mobile Science Station, Smuggler, Colony Ship, Elite Interceptor, Bulk Processor, Diplomatic Envoy
- **6 new factions**: Trade Syndicate, Rebel Alliance, Ancient Guardians, MegaCorp Consortium, Nomad Clans, Stellar Cult
- **8 additional high-tier mission templates** involving the new resources and factions (extreme difficulty runs, singularity recovery, diplomatic escorts, etc.)
- New `js/data/expansion_v07.js` loaded on Simulator, Mission Board, and Transport pages

### Improved
- All new content automatically available across the game once the expansion script loads
- Total resources now exceed 110+
- Total ship types now 36+
- Total factions now 27+
- Mission templates now 63+

## [0.6.0] — Additional Content Expansion (2026-11-13)

### Added
- **24 additional resources** (rhodium, rhenium, dark ore, void crystal, plasma cells, quantum processors, dark matter samples, living metal, etc.)
- **5 new ship types**: Fleet Carrier, Stealth Bomber, Mining Mothership, Research Cruiser, Luxury Cruiser
- **4 new factions**: Merchant Guild, Military Order, Bio Collective, Void Walkers
- **10 additional mission templates** (55 total) involving the new resources and factions
- Loaded the extra content scripts on the Mission Board and Transport pages so the new content is actually available

### Fixed
- Mission Board page now includes `missions_extra.js` so all 55 missions appear
- Transport page now includes `additional_content.js` so extra ships, resources, and factions are available
- Updated package version and titles for consistency

## [0.5.0] — Massive Content Expansion II (2026-11-12)

### Added
- **30+ additional resources** (raw, refined, and high-tech) with full production chains
- **20+ new crafting recipes** for advanced components (warp coils, shields, AI cores, biogel, etc.)
- **8 new ship types**: Destroyer, Fuel Tanker, Deep Surveyor, Medical Ship, Pirate Raider, Dreadnought, Mining Barge, Express Courier
- **5 new factions**: Free Traders Alliance, Syndicate of Shadows, Terraforming Initiative, AI Collective, Order of the Stellar Path
- **15 additional star systems** with complete interstellar route graph (35 systems total)
- **20 new mission templates** (45 total) spanning delivery, combat, exploration, and diplomacy involving all new content
- Updated CONTENT_EXPANSION.md to reflect actual current content

### Improved
- All major catalogs remain in canonical files (`resources.js`, `universe.js`, `missions.js`)
- Route finder supports the full expanded network

## [0.4.0] — Massive Content Expansion (2026-11-11)

### Added
- **40+ resources** with full production chains (raw → refined → high-tech)
- **23 crafting recipes**
- **5 new ship types**: Science Vessel, Luxury Yacht, Combat Frigate, Super Hauler, Phantom Runner
- **2 new factions**: Corporate League, Explorer's Guild
- **8 additional star systems** with complete interstellar route graph (20 systems total)
- **15 new mission templates** (25 total) spanning delivery, combat, exploration, and diplomacy
- Updated CONTENT_EXPANSION.md to reflect actual current content

### Improved
- All major catalogs remain in canonical files (`resources.js`, `universe.js`, `missions.js`)
- Route finder now supports the full expanded network

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
