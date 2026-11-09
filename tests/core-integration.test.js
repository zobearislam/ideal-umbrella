// Basic integration tests (run in browser console or with a simple test runner)

function assert(condition, message) {
  if (!condition) throw new Error(message || "Assertion failed");
  console.log("PASS:", message || "ok");
}

function testUniverse() {
  assert(window.UNIVERSE, "UNIVERSE exists");
  assert(Array.isArray(window.UNIVERSE.SYSTEMS), "SYSTEMS is array");
  assert(window.UNIVERSE.SYSTEMS.length >= 12, "At least 12 systems");
  const sol = window.UNIVERSE.getSystem("sol");
  assert(sol && sol.id === "sol", "getSystem sol works");
  const route = window.UNIVERSE.findRoute("sol", "alpha-cen");
  assert(route && route.length >= 1, "findRoute works");
  console.log("Universe tests passed");
}

function testCredits() {
  assert(window.Credits, "Credits exists");
  const start = window.Credits.getPersonal();
  window.Credits.addPersonal(1000, "test");
  assert(window.Credits.getPersonal() === start + 1000, "addPersonal works");
  window.Credits.setCompany("test-co", 5000);
  assert(window.Credits.getCompany("test-co") === 5000, "company credits work");
  console.log("Credits tests passed");
}

function testGameState() {
  assert(window.GameState, "GameState exists");
  const ships = window.GameState.getState().ships;
  assert(Array.isArray(ships) && ships.length >= 2, "Ships exist");
  const company = window.GameState.getCompany("company-1");
  assert(company, "Company exists");
  console.log("GameState tests passed");
}

function runAllTests() {
  try {
    testUniverse();
    testCredits();
    testGameState();
    console.log("All core integration tests passed");
    return true;
  } catch (e) {
    console.error("Test failed:", e);
    return false;
  }
}

window.runCoreTests = runAllTests;
console.log("Core tests loaded. Call runCoreTests() to execute.");
