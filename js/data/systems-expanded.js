// Greatly expanded star systems catalog

export const EXPANDED_SYSTEMS = [
  // Core systems (existing)
  { id: "sol", name: "Sol", x: 0.18, y: 0.48, description: "Humanity's home system.", population: 12000000000, faction: "terran" },
  { id: "alpha-cen", name: "Alpha Centauri", x: 0.39, y: 0.22, description: "Nearby triple-star system.", population: 450000000, faction: "alpha" },
  { id: "sirius", name: "Sirius", x: 0.61, y: 0.42, description: "Bright industrial system.", population: 280000000, faction: "sirius_mining" },
  { id: "vega", name: "Vega", x: 0.78, y: 0.18, description: "Major trade hub.", population: 620000000, faction: "jovian" },
  { id: "altair", name: "Altair", x: 0.48, y: 0.76, description: "Foundry and manufacturing center.", population: 190000000, faction: "independent" },
  { id: "rigel", name: "Rigel", x: 0.85, y: 0.72, description: "Research and exploration outpost.", population: 45000000, faction: "science_collective" },
  { id: "kepler", name: "Kepler", x: 0.22, y: 0.82, description: "Young colony world.", population: 12000000, faction: "outer" },

  // New systems
  { id: "proxima", name: "Proxima", x: 0.32, y: 0.28, description: "Red dwarf system with research stations.", population: 8000000, faction: "science_collective" },
  { id: "tau-ceti", name: "Tau Ceti", x: 0.55, y: 0.35, description: "Stable system with multiple habitable zones.", population: 210000000, faction: "terran" },
  { id: "epsilon-eridani", name: "Epsilon Eridani", x: 0.42, y: 0.55, description: "Young system rich in asteroids.", population: 35000000, faction: "belt" },
  { id: "trappist", name: "TRAPPIST", x: 0.15, y: 0.65, description: "Seven-planet system, several in the habitable zone.", population: 95000000, faction: "outer" },
  { id: "barnard", name: "Barnard's Star", x: 0.28, y: 0.38, description: "Close red dwarf, mining focused.", population: 15000000, faction: "belt" },
  { id: "wolf-359", name: "Wolf 359", x: 0.68, y: 0.28, description: "Flare star system with defensive outposts.", population: 22000000, faction: "terran" },
  { id: "ross-128", name: "Ross 128", x: 0.72, y: 0.55, description: "Quiet system, growing trade presence.", population: 48000000, faction: "independent" },
  { id: "lalande", name: "Lalande 21185", x: 0.25, y: 0.18, description: "High-mass star with dense asteroid fields.", population: 18000000, faction: "belt" },
  { id: "61-cygni", name: "61 Cygni", x: 0.58, y: 0.68, description: "Binary system with independent colonies.", population: 67000000, faction: "independent" },
  { id: "gliese-581", name: "Gliese 581", x: 0.82, y: 0.35, description: "Exoplanet-rich system, scientific interest.", population: 12000000, faction: "science_collective" },
  { id: "hd-40307", name: "HD 40307", x: 0.45, y: 0.15, description: "Super-Earth system under colonization.", population: 28000000, faction: "outer" },
  { id: "kepler-442", name: "Kepler-442", x: 0.12, y: 0.35, description: "Earth-like world, major colonization effort.", population: 85000000, faction: "terran" },
  { id: "gliese-667", name: "Gliese 667", x: 0.75, y: 0.82, description: "Triple star system with multiple habitable candidates.", population: 32000000, faction: "outer" },
  { id: "wolf-1061", name: "Wolf 1061", x: 0.38, y: 0.88, description: "Nearby red dwarf with confirmed planets.", population: 19000000, faction: "independent" },
  { id: "ross-248", name: "Ross 248", x: 0.52, y: 0.12, description: "High proper motion star, mining claims active.", population: 8000000, faction: "belt" },
  { id: "luhman-16", name: "Luhman 16", x: 0.88, y: 0.48, description: "Brown dwarf binary, exotic research.", population: 2500000, faction: "science_collective" },
  { id: "wise-0855", name: "WISE 0855", x: 0.92, y: 0.22, description: "Coldest known brown dwarf. Extreme conditions.", population: 500000, faction: "science_collective" },
  { id: "proxima-centauri-b", name: "Proxima b Colony", x: 0.33, y: 0.25, description: "Surface colony on Proxima b.", population: 4500000, faction: "outer" },
  { id: "new-horizon-deep", name: "New Horizon Deep", x: 0.41, y: 0.19, description: "Deep space station beyond Alpha Centauri.", population: 1200000, faction: "alpha" }
];

export function getExpandedSystem(id) {
  return EXPANDED_SYSTEMS.find(s => s.id === id) || null;
}
