// Expanded ship catalog for Ideal Umbrella

export const SHIP_TYPES = {
  scout: {
    id: "scout",
    name: "Scout",
    price: 8500,
    capacity: 5,
    speed: 1.8,
    fuelEfficiency: 1.4,
    maintenance: 25,
    description: "Fast reconnaissance vessel. Low cargo, high speed."
  },
  courier: {
    id: "courier",
    name: "Courier",
    price: 12000,
    capacity: 12,
    speed: 1.4,
    fuelEfficiency: 1.2,
    maintenance: 35,
    description: "Agile delivery ship for small high-value cargo."
  },
  hauler: {
    id: "hauler",
    name: "Hauler",
    price: 25000,
    capacity: 40,
    speed: 1.0,
    fuelEfficiency: 0.9,
    maintenance: 65,
    description: "Reliable mid-size freighter."
  },
  freighter: {
    id: "freighter",
    name: "Freighter",
    price: 55000,
    capacity: 120,
    speed: 0.75,
    fuelEfficiency: 0.7,
    maintenance: 120,
    description: "Heavy cargo carrier for bulk goods."
  },
  interceptor: {
    id: "interceptor",
    name: "Interceptor",
    price: 32000,
    capacity: 8,
    speed: 2.1,
    fuelEfficiency: 1.1,
    maintenance: 55,
    description: "High-speed combat-capable ship with light cargo."
  },
  miner: {
    id: "miner",
    name: "Miner",
    price: 38000,
    capacity: 60,
    speed: 0.85,
    fuelEfficiency: 0.8,
    maintenance: 80,
    description: "Specialized mining vessel with ore processing bays."
  },
  luxury_liner: {
    id: "luxury_liner",
    name: "Luxury Liner",
    price: 120000,
    capacity: 25,
    speed: 1.1,
    fuelEfficiency: 0.6,
    maintenance: 200,
    description: "Passenger and luxury goods transport. High maintenance."
  },
  science: {
    id: "science",
    name: "Science Vessel",
    price: 75000,
    capacity: 15,
    speed: 1.2,
    fuelEfficiency: 1.0,
    maintenance: 95,
    description: "Equipped with advanced sensors and labs."
  },
  titan: {
    id: "titan",
    name: "Titan Freighter",
    price: 180000,
    capacity: 300,
    speed: 0.55,
    fuelEfficiency: 0.5,
    maintenance: 280,
    description: "Massive bulk carrier. Slow but enormous capacity."
  },
  phantom: {
    id: "phantom",
    name: "Phantom",
    price: 95000,
    capacity: 10,
    speed: 2.4,
    fuelEfficiency: 1.3,
    maintenance: 110,
    description: "Stealth-capable high-speed interceptor."
  }
};

export function getShipType(id) {
  return SHIP_TYPES[id] || null;
}
