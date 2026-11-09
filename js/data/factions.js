// DEPRECATED as a separate catalog — factions live in js/data/resources.js (window.FACTIONS).
// This file remains so old paths do not 404. Prefer window.FACTIONS / window.getFaction.

if (typeof window !== "undefined" && window.FACTIONS) {
  // Already loaded from resources.js
} else if (typeof window !== "undefined") {
  console.warn("factions.js: load js/data/resources.js first for the canonical faction catalog.");
}
