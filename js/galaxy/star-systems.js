// Compatibility shim — galaxy data lives in js/core/universe.js (classic script).
// Prefer window.UNIVERSE.SYSTEMS / getSystem / findRoute in new code.

if (typeof window !== "undefined" && window.UNIVERSE) {
  // Optional named helpers for any remaining module consumers that import this file
  // after universe.js has run as a classic script.
  window.starSystems = window.UNIVERSE.SYSTEMS;
}
