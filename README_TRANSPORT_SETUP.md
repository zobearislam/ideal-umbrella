# Ideal Umbrella — Transport System

The Transport page is fully integrated with the main Ideal Umbrella simulator.

## How to use

1. Open `transport.html` (linked from the main menu).
2. Manage your fleet, accept contracts, and handle NPC rival companies.
3. Shared game state (credits, inventory, ships) is synchronized with the 3D simulator via `GameState`.

## Features

- Full star system network from `js/core/universe.js`
- Ship management and journeys
- Contracts and NPC company interactions
- Local + optional Supabase cloud saves

## Supabase (optional)

See `js/core/supabase-config.js` and `database/` for cloud save setup. Use the publishable/anon key only.
