// Galaxy map UI — uses shared universe data exposed on window.UNIVERSE
// (universe.js is a classic script, not an ES module)

const U = window.UNIVERSE || {};
const starSystems = U.SYSTEMS || [];
const getSystem = U.getSystem || (() => null);
const findRoute = U.findRoute || (() => null);

let selectedSystem = null;

const systemList = document.getElementById("systemList");
const systemDetails = document.getElementById("systemDetails");
const searchInput = document.getElementById("systemSearch");
const routeButton = document.getElementById("routeButton");
const routeResult = document.getElementById("routeResult");

function renderSystems(filter = "") {
  if (!systemList) return;
  systemList.innerHTML = "";

  starSystems
    .filter(system =>
      system.name.toLowerCase().includes(filter.toLowerCase())
    )
    .forEach(system => {
      const item = document.createElement("div");
      item.className = "system";
      item.textContent = system.name;

      item.addEventListener("click", () => selectSystem(system.id));
      systemList.appendChild(item);
    });
}

function selectSystem(id) {
  selectedSystem = getSystem(id);
  if (!selectedSystem || !systemDetails) return;

  systemDetails.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = selectedSystem.name;

  const description = document.createElement("p");
  description.textContent = selectedSystem.description || "";

  const meta = document.createElement("p");
  meta.className = "muted";
  meta.textContent = [
    selectedSystem.faction ? `Faction: ${selectedSystem.faction}` : null,
    selectedSystem.population != null ? `Pop: ${Number(selectedSystem.population).toLocaleString()}` : null
  ].filter(Boolean).join(" · ");

  systemDetails.append(heading, description, meta);

  if (routeButton) routeButton.disabled = false;
  if (routeResult) routeResult.textContent = "";
}

if (searchInput) {
  searchInput.addEventListener("input", event => {
    renderSystems(event.target.value);
  });
}

if (routeButton) {
  routeButton.addEventListener("click", () => {
    if (!selectedSystem) return;

    const destination = prompt("Enter destination system ID (e.g. alpha-cen, sirius, trappist):");
    if (!destination) return;

    const route = findRoute(selectedSystem.id, destination.trim());

    if (routeResult) {
      routeResult.textContent = route
        ? route.map(id => (getSystem(id) && getSystem(id).name) || id).join(" → ")
        : "No route found.";
    }
  });
}

renderSystems();
