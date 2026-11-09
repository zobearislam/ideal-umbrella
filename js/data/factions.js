// Expanded factions for Ideal Umbrella

export const FACTIONS = {
  terran: {
    id: "terran",
    name: "Terran Confederation",
    description: "Earth’s unified government. Controls Sol and major ports.",
    color: "#4a90d9",
    startingRep: 50,
    preferredGoods: ["medical_supplies", "food_rations", "circuit"]
  },
  martian: {
    id: "martian",
    name: "Martian Republic",
    description: "Independent terraforming colonies on Mars and its moons.",
    color: "#c45c26",
    startingRep: 40,
    preferredGoods: ["fertilizer", "refined_iron", "life_support"]
  },
  belt: {
    id: "belt",
    name: "Belt Miners’ Union",
    description: "Asteroid prospectors and ore haulers of the main belt.",
    color: "#8b7355",
    startingRep: 45,
    preferredGoods: ["iron_ore", "titanium_ore", "fuel_cell"]
  },
  jovian: {
    id: "jovian",
    name: "Jovian Syndicate",
    description: "Corporate power bloc based around the gas giants.",
    color: "#d4a017",
    startingRep: 35,
    preferredGoods: ["hydrogen", "refined_gold", "luxury_goods"]
  },
  outer: {
    id: "outer",
    name: "Outer Colonies League",
    description: "Distant settlements beyond the belt, always short on supplies.",
    color: "#5a7d6a",
    startingRep: 30,
    preferredGoods: ["food_rations", "medical_supplies", "fuel_cell"]
  },
  pirate: {
    id: "pirate",
    name: "Pirate Clans",
    description: "Raiders and smugglers who respect strength and coin.",
    color: "#8b0000",
    startingRep: 15,
    preferredGoods: ["alloy", "fuel_cell", "luxury_goods"]
  },
  alpha: {
    id: "alpha",
    name: "Alpha Cooperative",
    description: "Trade-focused alliance in the Alpha Centauri system.",
    color: "#2e8b57",
    startingRep: 50,
    preferredGoods: ["circuit", "plastic", "data_core"]
  },
  sirius_mining: {
    id: "sirius_mining",
    name: "Sirius Mining Corp",
    description: "Industrial resource extraction conglomerate.",
    color: "#708090",
    startingRep: 42,
    preferredGoods: ["titanium_ore", "uranium_ore", "refined_titanium"]
  },
  independent: {
    id: "independent",
    name: "Independent",
    description: "Unaffiliated traders, stations, and free captains.",
    color: "#aaaaaa",
    startingRep: 50,
    preferredGoods: ["alloy", "fuel_cell", "circuit"]
  },
  science_collective: {
    id: "science_collective",
    name: "Science Collective",
    description: "Research-focused group operating out of Rigel and beyond.",
    color: "#6a5acd",
    startingRep: 48,
    preferredGoods: ["data_core", "quantum_chip", "sensor"]
  }
};

export function getFaction(id) {
  return FACTIONS[id] || null;
}
