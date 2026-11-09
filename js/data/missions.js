// Mission and contract templates for Ideal Umbrella

export const MISSION_TEMPLATES = [
  {
    id: "supply-run",
    name: "Supply Run",
    description: "Deliver essential supplies to a distant colony.",
    cargoTypes: ["food_rations", "medical_supplies", "fuel_cell"],
    quantityRange: [10, 40],
    rewardMultiplier: 1.2,
    reputationBonus: 5
  },
  {
    id: "ore-hauling",
    name: "Ore Hauling Contract",
    description: "Transport raw ore from mining sites to refineries.",
    cargoTypes: ["iron_ore", "titanium_ore", "copper_ore"],
    quantityRange: [20, 80],
    rewardMultiplier: 0.9,
    reputationBonus: 2
  },
  {
    id: "luxury-delivery",
    name: "Luxury Delivery",
    description: "High-value goods for wealthy clients. Handle with care.",
    cargoTypes: ["luxury_goods", "refined_gold", "nano_weave"],
    quantityRange: [2, 12],
    rewardMultiplier: 2.5,
    reputationBonus: 8
  },
  {
    id: "scientific-sample",
    name: "Scientific Sample Transport",
    description: "Delicate research samples for the Science Collective.",
    cargoTypes: ["data_core", "quantum_chip", "crystal"],
    quantityRange: [1, 8],
    rewardMultiplier: 2.0,
    reputationBonus: 10
  },
  {
    id: "emergency-relief",
    name: "Emergency Relief",
    description: "Urgent medical and food supplies. Time-sensitive.",
    cargoTypes: ["medical_supplies", "food_rations"],
    quantityRange: [15, 50],
    rewardMultiplier: 1.8,
    reputationBonus: 12
  },
  {
    id: "industrial-parts",
    name: "Industrial Parts Shipment",
    description: "Components for factories and shipyards.",
    cargoTypes: ["alloy", "circuit", "hull_plate", "thruster"],
    quantityRange: [8, 30],
    rewardMultiplier: 1.4,
    reputationBonus: 4
  },
  {
    id: "fuel-resupply",
    name: "Fuel Resupply",
    description: "Keep the lanes moving with fuel deliveries.",
    cargoTypes: ["fuel_cell", "liquid_hydrogen", "liquid_oxygen"],
    quantityRange: [15, 60],
    rewardMultiplier: 1.1,
    reputationBonus: 3
  },
  {
    id: "pirate-bounty",
    name: "Pirate Bounty Contract",
    description: "Deliver captured contraband or proof of engagement. Risky.",
    cargoTypes: ["luxury_goods", "refined_gold"],
    quantityRange: [1, 5],
    rewardMultiplier: 3.0,
    reputationBonus: -5
  }
];

export function generateMission(templateId, fromSystem, toSystem) {
  const template = MISSION_TEMPLATES.find(t => t.id === templateId);
  if (!template) return null;
  const cargo = template.cargoTypes[Math.floor(Math.random() * template.cargoTypes.length)];
  const qty = Math.floor(Math.random() * (template.quantityRange[1] - template.quantityRange[0])) + template.quantityRange[0];
  const baseReward = qty * 80 * template.rewardMultiplier;
  return {
    id: `M-${Date.now().toString(36)}`,
    templateId,
    name: template.name,
    description: template.description,
    from: fromSystem,
    to: toSystem,
    cargo,
    quantity: qty,
    reward: Math.round(baseReward),
    reputationBonus: template.reputationBonus,
    status: "available"
  };
}
