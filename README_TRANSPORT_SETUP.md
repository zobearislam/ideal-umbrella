# Space Pack transport prototype

## Files to add

Copy these files into your existing repository without deleting or replacing the simulator:

- `transport.html`
- `css/transport.css`
- `js/transport.js`
- `database/transport_schema.sql` (optional future backend foundation)

No existing file needs to be replaced for this first prototype.

## How to use

1. Add the files while preserving the folders shown above.
2. Commit/push to the `main` branch.
3. Open `https://YOUR-GITHUB-PAGES-SITE/transport.html`.
4. Use the top link to return to the existing 3D simulator.

Optional: add a link in the existing `index.html` navigation area:

```html
<a href="transport.html">Transport Management</a>
```

## What works in this prototype

- 2D clickable star-system map (sample network of seven systems).
- Buy courier, hauler and freighter ships.
- View sample delivery contracts.
- Assign a ship to a contract when it is already at the contract's origin.
- Check cargo capacity before dispatch.
- Timestamp-based journeys; overdue deliveries complete when the page is reopened.
- Browser-local save using `localStorage`.

## Important limitations

This is a front-end prototype, not the final multiplayer economy:
- Save data is stored only in the current browser/device.
- It is not shared between players or devices.
- Players can alter browser storage, so it must not be used to award real multiplayer credits.
- The sample star systems and links are illustrative and are not imported from `js/space.js`.
- No automatic repositioning, cargo market, fuel, maintenance billing, accounts or server synchronization yet.

## Supabase SQL

`database/transport_schema.sql` is a starting database schema, not a complete multiplayer backend. Review it and back up your Supabase project before running it. The browser should never be allowed to directly award delivery rewards. A trusted server/Edge Function must validate deliveries and update company balances.
