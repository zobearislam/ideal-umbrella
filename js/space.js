/* Space Pack — Enhanced simulator
   Full solar system with planets, major moons, stations, gates, resources, crafting, factions.
   Shares credits / inventory / reputation / missions with Transport via GameState.
*/

(function () {
  "use strict";

  if (typeof THREE === "undefined") {
    console.error("THREE.js not loaded");
    return;
  }

  const RESOURCES = window.RESOURCES || {};
  const CRAFTING_RECIPES = window.CRAFTING_RECIPES || [];
  const SHIP_TYPES = window.SHIP_TYPES || {};
  const FACTIONS = window.FACTIONS || {};
  const gs = window.GameState;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200000);
  camera.position.set(0, 30, 120);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.zIndex = "0";

  const ambient = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambient);
  const sunLight = new THREE.PointLight(0xffffee, 2.5, 0, 2);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  const sunGeo = new THREE.SphereGeometry(10, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc44 });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sun);

  const bodies = [];
  function addBody(name, radius, dist, color, speed, parent = null, isMoon = false) {
    const geo = new THREE.SphereGeometry(radius, 24, 24);
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData = {
      name, dist, speed, angle: Math.random() * Math.PI * 2,
      parent, isMoon, radius, color
    };
    scene.add(mesh);
    bodies.push(mesh);
    return mesh;
  }

  const mercury = addBody("Mercury", 1.2, 22, 0xaaaaaa, 0.025);
  const venus   = addBody("Venus",   1.8, 32, 0xeecc88, 0.018);
  const earth   = addBody("Earth",   2.1, 46, 0x4488ff, 0.012);
  const mars    = addBody("Mars",    1.6, 62, 0xcc5533, 0.009);
  const jupiter = addBody("Jupiter", 6.5, 110, 0xccaa66, 0.004);
  const saturn  = addBody("Saturn",  5.5, 155, 0xddcc88, 0.0028);
  const uranus  = addBody("Uranus",  3.2, 210, 0x88ccdd, 0.0018);
  const neptune = addBody("Neptune", 3.0, 260, 0x4466cc, 0.0012);

  addBody("Luna",     0.6, 4.5, 0xcccccc, 0.08, earth, true);
  addBody("Phobos",   0.25, 2.2, 0x888888, 0.25, mars, true);
  addBody("Deimos",   0.18, 3.5, 0x777777, 0.12, mars, true);
  addBody("Io",       0.7, 6, 0xffaa55, 0.15, jupiter, true);
  addBody("Europa",   0.65, 8.5, 0xeeeeff, 0.08, jupiter, true);
  addBody("Ganymede", 0.85, 12, 0xbb9977, 0.04, jupiter, true);
  addBody("Callisto", 0.8, 16, 0x887766, 0.025, jupiter, true);
  addBody("Titan",    0.9, 10, 0xccaa66, 0.03, saturn, true);
  addBody("Enceladus",0.35, 5.5, 0xffffff, 0.12, saturn, true);
  addBody("Triton",   0.7, 7, 0xaaaaff, 0.05, neptune, true);

  const shipGeo = new THREE.ConeGeometry(1.8, 5, 8);
  const shipMat = new THREE.MeshLambertMaterial({ color: 0x88ccff });
  const ship = new THREE.Mesh(shipGeo, shipMat);
  ship.position.set(46, 0, 0);
  ship.rotation.x = Math.PI / 2;
  scene.add(ship);

  // —— Shared state (Credits + GameState) ——
  if (gs && gs.syncInventoryToWindow) gs.syncInventoryToWindow();
  window.inventory = window.inventory || (gs && gs.getState().inventory) || { iron: 5, ice: 8, fuel: 10, crystal: 2 };

  if (!window.factionRep) {
    if (gs && gs.getState().factionRep) {
      window.factionRep = { ...gs.getState().factionRep };
    } else {
      window.factionRep = {};
      if (FACTIONS && Object.keys(FACTIONS).length) {
        for (const [id, f] of Object.entries(FACTIONS)) {
          window.factionRep[id] = typeof f.startingRep === "number" ? f.startingRep : 50;
        }
      } else {
        window.factionRep = {
          terran: 50, martian: 40, belt: 30, jovian: 45, outer: 25, pirate: 10, independent: 50
        };
      }
    }
  }
  if (gs) {
    const st = gs.getState();
    st.factionRep = { ...window.factionRep };
  }

  window.ownedShips = window.ownedShips || [{ id: "starter", type: "hauler", name: "Wayfarer" }];

  function personalCredits() {
    if (window.Credits) return window.Credits.getPersonal();
    return window.credits || 0;
  }
  function companyCredits() {
    if (window.Credits && gs) {
      const c = gs.getCompany("company-1");
      return c ? window.Credits.getCompany(c.id) : 0;
    }
    return 0;
  }
  function addPersonal(amount, reason) {
    if (window.Credits) return window.Credits.addPersonal(amount, reason);
    window.credits = (window.credits || 0) + amount;
    return window.credits;
  }

  window.changeRep = function (delta, factionId) {
    const amount = Number(delta) || 0;
    if (!window.factionRep) window.factionRep = {};
    if (factionId) {
      const cur = window.factionRep[factionId] ?? 50;
      window.factionRep[factionId] = Math.max(0, Math.min(100, cur + amount));
      if (window.Economy && window.Economy.changeReputation) {
        try { window.Economy.changeReputation(factionId, amount); } catch (e) {}
      }
    } else {
      for (const id of Object.keys(window.factionRep)) {
        window.factionRep[id] = Math.max(0, Math.min(100, (window.factionRep[id] || 50) + amount));
      }
    }
    if (gs) {
      gs.getState().factionRep = { ...window.factionRep };
      gs.saveState();
    }
    return factionId ? window.factionRep[factionId] : window.factionRep;
  };

  function persistPlayerEconomy() {
    if (gs) {
      gs.syncInventoryFromWindow();
      gs.getState().factionRep = { ...window.factionRep };
      gs.saveState();
    }
  }

  function resourcePrice(id) {
    if (RESOURCES[id] && RESOURCES[id].basePrice) return RESOURCES[id].basePrice;
    return 40;
  }

  function bodyToSystemId(bodyName) {
    const n = (bodyName || "").toLowerCase();
    if (["mercury", "venus", "earth", "luna", "mars", "phobos", "deimos",
         "jupiter", "io", "europa", "ganymede", "callisto",
         "saturn", "titan", "enceladus", "uranus", "neptune", "triton"].includes(n)) {
      return "sol";
    }
    return "sol";
  }

  let playerMode = "seated";
  let walkOffset = new THREE.Vector3();
  let thrust = 0;
  let yaw = 0, pitch = 0;
  let timeScale = 1;
  let paused = false;
  let showOrbits = false;
  let locked = false;
  let target = null;
  let economyAccum = 0;
  let lastLaser = 0;
  let dockedBody = null;

  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  function updateOrbits() {
    orbitGroup.clear();
    if (!showOrbits) return;
    bodies.filter(b => !b.userData.isMoon).forEach(p => {
      const curve = new THREE.EllipseCurve(0, 0, p.userData.dist, p.userData.dist, 0, Math.PI * 2, false, 0);
      const pts = curve.getPoints(80);
      const geo = new THREE.BufferGeometry().setFromPoints(pts.map(pt => new THREE.Vector3(pt.x, 0, pt.y)));
      const mat = new THREE.LineBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.45 });
      orbitGroup.add(new THREE.Line(geo, mat));
    });
  }

  const sel = document.getElementById("sel");
  const shsel = document.getElementById("shsel");
  if (sel) {
    ["Sun", ...bodies.map(b => b.userData.name), "Ship"].forEach(n => {
      const opt = document.createElement("option");
      opt.value = n.toLowerCase();
      opt.textContent = n;
      sel.appendChild(opt);
    });
  }
  if (shsel) {
    Object.values(SHIP_TYPES).forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.name.toLowerCase();
      opt.textContent = s.name;
      shsel.appendChild(opt);
    });
    if (!shsel.options.length) {
      ["Default Ship", "Interceptor", "Hauler"].forEach(n => {
        const opt = document.createElement("option");
        opt.value = n.toLowerCase();
        opt.textContent = n;
        shsel.appendChild(opt);
      });
    }
  }

  const $ = id => document.getElementById(id);
  if ($("go")) $("go").onclick = () => {
    const v = sel && sel.value;
    if (v === "ship") {
      camera.position.copy(ship.position).add(new THREE.Vector3(0, 12, 35));
      camera.lookAt(ship.position);
    } else {
      const p = bodies.find(pl => pl.userData.name.toLowerCase() === v) || sun;
      camera.position.copy(p.position).add(new THREE.Vector3(0, 18, 45));
      camera.lookAt(p.position);
    }
  };
  if ($("lk")) $("lk").onclick = () => {
    locked = !locked;
    $("lk").textContent = locked ? "Unlock" : "Lock";
    if (locked && sel) {
      const v = sel.value;
      target = v === "ship" ? ship : (bodies.find(pl => pl.userData.name.toLowerCase() === v) || sun);
    }
  };
  if ($("ac")) $("ac").onclick = () => {
    if (playerMode === "seated") {
      playerMode = "standing";
      $("ac").textContent = "Sit down";
      if (typeof window.msg === "function") window.msg("Stood up. Use WASD to walk inside the ship.");
    } else {
      playerMode = "seated";
      $("ac").textContent = "Stand up";
      walkOffset.set(0, 0, 0);
      if (typeof window.msg === "function") window.msg("Sat down. Ready for flight.");
    }
  };
  if ($("md")) $("md").onclick = () => { $("fi").click(); };
  if ($("tm")) $("tm").onclick = () => {
    timeScale = timeScale === 1 ? 10 : timeScale === 10 ? 60 : timeScale === 60 ? 3600 : 1;
    $("tm").textContent = `Time x${timeScale}`;
  };
  if ($("orb")) $("orb").onclick = () => {
    showOrbits = !showOrbits;
    updateOrbits();
    $("orb").textContent = showOrbits ? "Orbits On" : "Orbits";
  };
  if ($("pause")) $("pause").onclick = () => {
    paused = !paused;
    $("pause").textContent = paused ? "Resume" : "Pause";
  };
  if ($("helpbtn")) $("helpbtn").onclick = () => { $("help").style.display = "flex"; };
  if ($("closehelp")) $("closehelp").onclick = () => { $("help").style.display = "none"; };
  if ($("closeStation")) $("closeStation").onclick = () => {
    $("stationPanel").style.display = "none";
    dockedBody = null;
  };

  function refreshStationPanel() {
    if (!$("stationPanel") || $("stationPanel").style.display === "none") return;
    const bodyName = dockedBody ? dockedBody.userData.name : "Station";
    const systemId = bodyToSystemId(bodyName);
    $("stationTitle").textContent = bodyName + " Station";

    const pc = personalCredits();
    const cc = companyCredits();
    $("stationCredits").innerHTML =
      `<strong>Personal:</strong> ${pc.toLocaleString()} cr · <strong>Company:</strong> ${cc.toLocaleString()} cr`;

    const repBits = Object.entries(window.factionRep || {})
      .slice(0, 6)
      .map(([k, v]) => `${k}: ${Math.round(v)}`)
      .join(" · ");
    $("stationRep").textContent = "Rep: " + (repBits || "—");

    // Warehouse (transport deliveries land here)
    const wh = $("stationWarehouse");
    if (wh) {
      const cargo = gs && gs.getSystemCargo ? gs.getSystemCargo(systemId) : {};
      const lines = Object.entries(cargo).filter(([, q]) => q > 0);
      if (!lines.length) {
        wh.innerHTML = "<em>System warehouse empty. Complete Transport deliveries to stock it.</em>";
      } else {
        wh.innerHTML =
          "<strong>Warehouse (" + systemId + ")</strong>" +
          lines
            .map(([type, q]) => {
              const safe = String(type).replace(/'/g, "\\'");
              return `<div class="cargo-line"><span>${type} × ${q}</span>
                <button class="brass-btn" onclick="sellWarehouse('${systemId}','${safe}',1)">Sell 1</button>
                <button class="brass-btn" onclick="sellWarehouse('${systemId}','${safe}',${q})">Sell all</button></div>`;
            })
            .join("");
      }
    }

    // Ship hold
    const invEl = $("stationInventory");
    if (invEl) {
      const inv = window.inventory || {};
      const lines = Object.entries(inv).filter(([, q]) => q > 0);
      if (!lines.length) {
        invEl.innerHTML = "<em>Hold empty.</em>";
      } else {
        invEl.innerHTML = lines
          .map(([type, q]) => {
            const price = resourcePrice(type);
            return `<div class="cargo-line"><span>${type} × ${q} (${price} cr ea)</span>
              <button class="brass-btn" onclick="sellHold('${type}',1)">Sell 1</button>
              <button class="brass-btn" onclick="sellHold('${type}',${q})">Sell all</button></div>`;
          })
          .join("");
      }
    }

    // Active missions
    const missEl = $("stationMissions");
    if (missEl && gs) {
      const active = gs.getState().activeMissions || [];
      if (!active.length) {
        missEl.innerHTML = '<em>No active missions. <a href="missions.html" style="color:#d4af37">Mission board</a></em>';
      } else {
        missEl.innerHTML = active
          .map(m => {
            const can = gs.canCompleteMission(m.id);
            const need =
              m.cargo && m.quantity
                ? `Need ${m.quantity} ${m.cargo} in hold`
                : m.type;
            return `<div class="mission-line"><span><strong>${m.title}</strong> · ${m.reward} cr · ${need}</span>
              <button class="brass-btn" ${can ? "" : "disabled"} onclick="completeMissionAtStation('${m.id}')">${can ? "Complete" : "Not ready"}</button></div>`;
          })
          .join("");
      }
    } else if (missEl) {
      missEl.innerHTML = "<em>GameState not loaded.</em>";
    }

    const craftDiv = $("stationCrafting");
    if (craftDiv && CRAFTING_RECIPES.length) {
      craftDiv.innerHTML = CRAFTING_RECIPES.map(
        r =>
          `<div class="cargo-line"><span>${r.name} → ${r.output}</span>
           <button class="brass-btn" onclick="craft('${r.id}')">Craft</button></div>`
      ).join("");
    }
  }

  function tryDock() {
    const nearest = bodies.find(b => ship.position.distanceTo(b.position) < (b.userData.radius + 8));
    if (!nearest) {
      alert("No station in range. Fly closer to a planet or moon.");
      return;
    }
    dockedBody = nearest;
    // Peaceful docking raises local standing slightly (once per open is fine)
    if (typeof window.changeRep === "function") {
      window.changeRep(1, "terran");
    }
    $("stationPanel").style.display = "flex";
    refreshStationPanel();
    if (typeof window.msg === "function") {
      window.msg("Docked at " + nearest.userData.name + " Station. +1 Terran standing.");
    }
  }

  if (!$("dock")) {
    const dockBtn = document.createElement("button");
    dockBtn.id = "dock";
    dockBtn.className = "brass-btn";
    dockBtn.textContent = "Dock";
    dockBtn.style.marginLeft = "8px";
    const topRow = document.querySelector("#top .row");
    if (topRow) topRow.appendChild(dockBtn);
  }
  if ($("dock")) $("dock").onclick = tryDock;

  window.sellHold = function (type, qty) {
    qty = Math.max(1, Math.floor(Number(qty) || 1));
    const have = (window.inventory && window.inventory[type]) || 0;
    if (have < qty) {
      alert("Not enough " + type);
      return;
    }
    window.inventory[type] = have - qty;
    const gained = resourcePrice(type) * qty;
    addPersonal(gained, `Sold ${qty} ${type}`);
    persistPlayerEconomy();
    refreshStationPanel();
    if (typeof window.msg === "function") window.msg(`Sold ${qty} ${type} for ${gained} cr.`);
  };

  window.sellWarehouse = function (systemId, type, qty) {
    if (!gs) return;
    qty = Math.max(1, Math.floor(Number(qty) || 1));
    const cargo = gs.getSystemCargo(systemId);
    const have = cargo[type] || 0;
    if (have < qty) {
      alert("Warehouse does not have enough " + type);
      return;
    }
    gs.unloadCargo(systemId, type, qty);
    // Unknown cargo names ("Machine parts") still sell at a flat rate
    const unit = RESOURCES[type] ? resourcePrice(type) : 55;
    const gained = unit * qty;
    // Warehouse goods are company freight → company account
    if (window.Credits && gs.getCompany("company-1")) {
      window.Credits.addCompany("company-1", gained, `Sold warehouse ${type}`);
    } else {
      addPersonal(gained, `Sold warehouse ${type}`);
    }
    persistPlayerEconomy();
    refreshStationPanel();
    if (typeof window.msg === "function") window.msg(`Company sold ${qty} ${type} for ${gained} cr.`);
  };

  window.completeMissionAtStation = function (id) {
    if (!gs) return;
    if (!gs.canCompleteMission(id)) {
      alert("Requirements not met (check cargo in your hold).");
      return;
    }
    // Sync hold before complete consumes cargo
    gs.syncInventoryFromWindow();
    const res = gs.completeMission(id);
    if (!res.ok) {
      alert(res.error || "Could not complete");
      return;
    }
    gs.syncInventoryToWindow();
    refreshStationPanel();
    if (typeof window.msg === "function") {
      window.msg(`Mission complete: ${res.mission.title}. +${res.reward} cr.`);
    }
  };

  window.craft = function (id) {
    const recipe = CRAFTING_RECIPES.find(r => r.id === id);
    if (!recipe) return;
    const can = recipe.inputs.every(inp => (window.inventory[inp] || 0) >= 1);
    if (!can) {
      alert("Missing materials");
      return;
    }
    recipe.inputs.forEach(inp => {
      window.inventory[inp]--;
    });
    window.inventory[recipe.output] = (window.inventory[recipe.output] || 0) + 1;
    persistPlayerEconomy();
    refreshStationPanel();
    if (typeof window.msg === "function") window.msg(`Crafted ${recipe.output}.`);
  };

  if ($("fi"))
    $("fi").onchange = () => {
      alert("Custom model loading is not implemented in this version.");
    };

  const keys = {};
  window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
  });
  window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
  });

  document.querySelectorAll(".bi").forEach(img => {
    const k = img.dataset.k;
    img.addEventListener("mousedown", () => {
      keys[k] = true;
    });
    img.addEventListener("mouseup", () => {
      keys[k] = false;
    });
    img.addEventListener("mouseleave", () => {
      keys[k] = false;
    });
    img.addEventListener("touchstart", e => {
      e.preventDefault();
      keys[k] = true;
    });
    img.addEventListener("touchend", () => {
      keys[k] = false;
    });
  });

  if ($("st"))
    $("st").onclick = () => {
      thrust = 0;
      if ($("sl")) $("sl").value = 0;
    };
  if ($("sl"))
    $("sl").oninput = () => {
      thrust = parseFloat($("sl").value) / 100;
    };

  function fireLaser() {
    const t = performance.now();
    if (t - lastLaser < 400) return;
    lastLaser = t;
    if (window.IAG && Math.random() < 0.08) {
      window.IAG.recordIncident({ lawId: "unsafeDischarge", system: "Sol" });
    }
    if (typeof window.msg === "function") window.msg("Defense laser fired.");
  }

  const hud = $("hud");
  function updateHUD() {
    if (!hud) return;
    const speed = thrust * 25;
    const inv =
      Object.entries(window.inventory || {})
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${k}:${v}`)
        .join(" ") || "empty";
    const modeText = playerMode === "seated" ? "Seated" : "Standing";
    const activeM = gs ? (gs.getState().activeMissions || []).length : 0;
    hud.innerHTML = `
      Speed: ${speed.toFixed(1)} · You: ${personalCredits().toLocaleString()} cr · Co: ${companyCredits().toLocaleString()} cr<br>
      Mode: ${modeText} · Time: x${timeScale} ${paused ? "(Paused)" : ""}${activeM ? ` · Missions: ${activeM}` : ""}<br>
      Inventory: ${inv}<br>
      Fuel: <div class="fuelbar"><div style="width:78%"></div></div>
    `;
  }

  let last = performance.now();
  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (paused) {
      renderer.render(scene, camera);
      return;
    }

    const t = dt * timeScale;

    bodies.forEach(p => {
      p.userData.angle += p.userData.speed * t;
      const parentPos = p.userData.parent ? p.userData.parent.position : new THREE.Vector3();
      p.position.x = parentPos.x + Math.cos(p.userData.angle) * p.userData.dist;
      p.position.z = parentPos.z + Math.sin(p.userData.angle) * p.userData.dist;
      p.position.y = parentPos.y;
    });

    if (playerMode === "seated") {
      if (keys["w"] || keys["arrowup"] || keys["tu"]) thrust = Math.min(1, thrust + dt);
      if (keys["s"] || keys["arrowdown"] || keys["td"]) thrust = Math.max(0, thrust - dt);
      if (keys["a"] || keys["arrowleft"]) yaw -= 1.5 * dt;
      if (keys["d"] || keys["arrowright"]) yaw += 1.5 * dt;
      if (keys["pu"]) pitch += 1.2 * dt;
      if (keys["pd"]) pitch -= 1.2 * dt;
      if (keys["q"]) ship.rotation.z += dt;
      if (keys["e"]) ship.rotation.z -= dt;
      if (keys["x"]) thrust = 0;
      if (keys[" "]) fireLaser();

      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(ship.quaternion);
      ship.position.add(forward.multiplyScalar(thrust * 18 * t));
      ship.rotation.y = yaw;
      ship.rotation.x = Math.PI / 2 + pitch;
    } else if (playerMode === "standing" || playerMode === "walking") {
      const walkSpeed = 2 * dt;
      if (keys["w"] || keys["arrowup"]) walkOffset.z -= walkSpeed;
      if (keys["s"] || keys["arrowdown"]) walkOffset.z += walkSpeed;
      if (keys["a"] || keys["arrowleft"]) walkOffset.x -= walkSpeed;
      if (keys["d"] || keys["arrowright"]) walkOffset.x += walkSpeed;
      walkOffset.x = Math.max(-1.5, Math.min(1.5, walkOffset.x));
      walkOffset.z = Math.max(-2, Math.min(2, walkOffset.z));
      playerMode = keys["w"] || keys["s"] || keys["a"] || keys["d"] ? "walking" : "standing";
    }

    economyAccum += t;
    if (economyAccum >= 1 && window.Economy && window.Economy.update) {
      try {
        window.Economy.update(1);
      } catch (e) {}
      economyAccum -= 1;
    }

    if (locked && target) {
      camera.position.copy(target.position).add(new THREE.Vector3(0, 18, 50));
      camera.lookAt(target.position);
    } else {
      const desired = ship.position.clone().add(new THREE.Vector3(0, 15, 40).add(walkOffset));
      camera.position.lerp(desired, 0.05);
      camera.lookAt(ship.position.clone().add(walkOffset));
    }

    updateHUD();
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  updateOrbits();
  updateHUD();
  animate(performance.now());

  window.msg = text => {
    if (hud) hud.innerHTML += `<br><small>${text}</small>`;
  };
  if (window.Economy && window.Economy.init) {
    try {
      window.Economy.init(null, { factions: FACTIONS });
    } catch (e) {}
  }

  console.log("Space Pack loaded — shared station / transport economy active.");
})();
