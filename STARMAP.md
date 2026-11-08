# Expanded star map (~200 ly)

Space Pack uses a **compressed spatial layout** (not 1:1 light-years) so nearby stars stay flyable. Distances are ordered roughly by real separation from Sol.

## Systems (22 stars)

| System | ~ly | Notes |
|--------|-----|--------|
| Sol | 0 | Hub with 8 gates |
| Alpha Centauri | 4.3 | Existing |
| Barnard's Star | 6 | New |
| Wolf 359 | 7.9 | New |
| Sirius | 8.6 | Existing |
| Epsilon Eridani | 10.5 | New |
| 61 Cygni | 11.4 | New |
| Procyon | 11.5 | New |
| Epsilon Indi | 11.8 | New |
| Tau Ceti | 11.9 | New |
| Altair | 16.7 | Existing |
| Vega | 25 | Existing |
| Fomalhaut | 25 | New |
| Pollux | 34 | New |
| Denebola | 36 | New |
| Arcturus | 37 | New |
| Capella | 43 | New |
| Castor | 51 | New |
| Aldebaran | 65 | New |
| Regulus | 79 | New |
| Rigel | far | Outer flavor |
| Kepler | far | Outer flavor |

## Gate network (~58 gates)

- **Sol hub:** 8 gates at ~40–44 AU for local transfers
- **Direct Sol links:** Alpha, Sirius, Barnard, ε Eri, Procyon, Tau Ceti, Vega, Altair, Fomalhaut, Arcturus
- **Cross-links:** mesh between nearby systems so the graph is interconnected (multiple paths), e.g.
  - Alpha ↔ Barnard ↔ Wolf ↔ ε Eri ↔ Tau ↔ ε Indi
  - Procyon ↔ Sirius ↔ 61 Cyg
  - Altair ↔ Vega ↔ Fomalhaut / Denebola
  - Pollux ↔ Castor / Capella / Procyon
  - Capella ↔ Arcturus ↔ Regulus ↔ Aldebaran ↔ Denebola

Every listed system has at least one gate; the map is designed so you can reach any system without a single chokepoint.

## Applying the expanded `space.js`

The full expanded simulation body is in the workspace as `space_expanded.js` (or merge the objects + `GATES` arrays into `js/space.js`).

```bash
# On branch improve-ux-persistence
cp path/to/space_expanded.js js/space.js
git add js/space.js
git commit -m "Expanded star map: 22 systems, 58 gates within ~200 ly"
git push
```

Or restore main then paste the new `GATES` / `PACK.objects` blocks from `STARMAP` design notes.

## Factions added

- Barnard Freeholds
- Eridani Trade League
- Tau Ceti Colonies
- Procyon Industrial
- Arcturus Guild
- Fomalhaut Watch
