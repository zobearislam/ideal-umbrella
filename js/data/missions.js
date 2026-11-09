// Mission board data
window.MISSIONS = [
  {
    id: "m001",
    title: "Ice Run to Luna",
    type: "delivery",
    from: "Earth Orbital Port",
    to: "Luna Depot",
    cargo: "ice",
    quantity: 20,
    reward: 4500,
    reputation: { terran: 2 },
    difficulty: 1,
    description: "Deliver water ice to the lunar depot. Straightforward inner-system run."
  },
  {
    id: "m002",
    title: "Martian Alloy Supply",
    type: "delivery",
    from: "Mars Highport",
    to: "Phobos Station",
    cargo: "alloy",
    quantity: 15,
    reward: 6800,
    reputation: { martian: 3 },
    difficulty: 2,
    description: "The Martian Republic needs alloy for expansion. Reputation with Mars helps prices."
  },
  {
    id: "m003",
    title: "Belt Ore Haul",
    type: "delivery",
    from: "Ceres Hub",
    to: "Earth Orbital Port",
    cargo: "iron",
    quantity: 40,
    reward: 9200,
    reputation: { belt: 4, terran: 1 },
    difficulty: 3,
    description: "Bulk iron from the asteroid belt. Watch for pirate activity if your reputation is low."
  },
  {
    id: "m004",
    title: "Jovian Research Samples",
    type: "delivery",
    from: "Europa Research",
    to: "Earth Orbital Port",
    cargo: "crystal",
    quantity: 8,
    reward: 15000,
    reputation: { jovian: 5, terran: 2 },
    difficulty: 3,
    description: "Delicate crystal samples from Europa's subsurface ocean studies."
  },
  {
    id: "m005",
    title: "Titan Fuel Transfer",
    type: "delivery",
    from: "Titan Station",
    to: "Saturn Orbital",
    cargo: "fuel",
    quantity: 25,
    reward: 11000,
    reputation: { outer: 3 },
    difficulty: 2,
    description: "Methane-derived fuel from Titan to the main Saturn station."
  },
  {
    id: "m006",
    title: "Outer Colonies Relief",
    type: "delivery",
    from: "Sol",
    to: "Kepler Colony",
    cargo: "fertilizer",
    quantity: 30,
    reward: 18500,
    reputation: { outer: 6 },
    difficulty: 4,
    description: "Critical agricultural supplies for the Kepler colony. Long gate jump."
  },
  {
    id: "m007",
    title: "Pirate Bounty: Lane Clearance",
    type: "combat",
    from: "Belt",
    reward: 12000,
    reputation: { terran: 5, pirate: -10, belt: 3 },
    difficulty: 3,
    description: "Eliminate pirate harassment near Ceres. Abstract laser combat."
  },
  {
    id: "m008",
    title: "Alpha Centauri Trade Pact",
    type: "diplomatic",
    from: "Sol",
    to: "Alpha Centauri",
    reward: 8000,
    reputation: { terran: 4, independent: 2 },
    difficulty: 2,
    description: "Deliver sealed documents to improve relations with the Alpha Cooperative."
  },
  {
    id: "m009",
    title: "Uranium for the Outer League",
    type: "delivery",
    from: "Uranus Station",
    to: "Neptune Depot",
    cargo: "uranium",
    quantity: 10,
    reward: 22000,
    reputation: { outer: 5 },
    difficulty: 4,
    description: "Sensitive nuclear material. High security, high reward."
  },
  {
    id: "m010",
    title: "TRAPPIST Survey",
    type: "exploration",
    from: "Sol",
    to: "TRAPPIST-1",
    reward: 35000,
    reputation: { terran: 8, outer: 4 },
    difficulty: 5,
    description: "First official survey mission to the seven-planet system. Requires a capable ship."
  }
];

window.getAvailableMissions = function(_playerRep = {}, _ownedShips = []) {
  return window.MISSIONS.filter(_m => {
    // Simple filter: show all for now, or filter by difficulty / reputation later
    return true;
  });
};
