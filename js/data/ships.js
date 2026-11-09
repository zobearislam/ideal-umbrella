// DEPRECATED as a separate catalog — ships live in js/data/resources.js (window.SHIP_TYPES).
// This file remains so old paths do not 404. Prefer window.SHIP_TYPES / window.getShipType.

if (typeof window !== "undefined" && window.SHIP_TYPES) {
  // Already loaded from resources.js
} else if (typeof window !== "undefined") {
  console.warn("ships.js: load js/data/resources.js first for the canonical ship catalog.");
}
