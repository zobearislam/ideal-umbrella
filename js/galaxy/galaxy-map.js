
import {
  starSystems,
  getSystem,
  findRoute
} from "./star-systems.js";

let selectedSystem = null;

const systemList = document.getElementById("systemList");
const systemDetails = document.getElementById("systemDetails");
const searchInput = document.getElementById("systemSearch");
const routeButton = document.getElementById("routeButton");
const routeResult = document.getElementById("routeResult");

function renderSystems(filter = "") {
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
  if (!selectedSystem) return;

  systemDetails.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = selectedSystem.name;

  const description = document.createElement("p");
  description.textContent = selectedSystem.description;

  systemDetails.append(heading, description);

  routeButton.disabled = false;
  routeResult.textContent = "";
}

searchInput.addEventListener("input", event => {
  renderSystems(event.target.value);
});

routeButton.addEventListener("click", () => {
  if (!selectedSystem) return;

  const destination = prompt("Enter destination system ID:");
  if (!destination) return;

  const route = findRoute(selectedSystem.id, destination);

  routeResult.textContent = route
    ? route.map(id => getSystem(id).name).join(" → ")
    : "No route found.";
});

renderSystems();
