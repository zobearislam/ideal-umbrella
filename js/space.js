/* Space Pack — Enhanced simulator
   Full solar system + shared GameState economy.
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  document.body.appendChild(renderer.domElement);
  // Let UI receive clicks; flight uses HTML controls + keyboard
  renderer.domElement.style.cssText =
    "position:fixed;top:0;left:0;z-index:0;width:100%;height:100%;pointer-events:none;";

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
      name,
      dist,
      speed,
      angle: isMoon ? Math.random() * Math.PI * 2 : 0,
      parent,
      isMoon,
      radius,
      color
    };
    scene.add(mesh);
    bodies.push(mesh);
    return mesh;
  }

  const mercury = addBody("Mercury", 1.2, 22, 0xaaaaaa, 0.025);
  const venus = addBody("Venus", 1.8, 32, 0xeecc88, 0.018);
  const earth = addBody("Earth", 2.1, 46, 0x4488ff, 0.012);
  const mars = addBody("Mars", 1.6, 62, 0xcc5533, 0.009);
  const jupiter = addBody("Jupiter", 6.5, 110, 0xccaa66, 0.004);
  const saturn = addBody("Saturn", 5.5, 155, 0xddcc88, 0.0028);
  const uranus = addBody("Uranus", 3.2, 210, 0x88ccdd, 0.0018);
  const neptune = addBody("Neptune", 3.0, 260, 0x4466cc, 0.0012);

  addBody("Luna", 0.6, 4.5, 0xcccccc, 0.08, earth, true);
  addBody("Phobos", 0.25, 2.2, 0x888888, 0.25, mars, true);
  addBody("Deimos", 0.18, 3.5, 0x777777, 0.12, mars, true);
  addBody("Io", 0.7, 6, 0xffaa55, 0.15, jupiter, true);
  addBody("Europa", 0.65, 8.5, 0xeeeeff, 0.08, jupiter, true);
  addBody("Ganymede", 0.85, 12, 0xbb9977, 0.04, jupiter, true);
  addBody("Callisto", 0.8, 16, 0x887766, 0.025, jupiter, true);
  addBody("Titan", 0.9, 10, 0xccaa66, 0.03, saturn, true);
  addBody("Enceladus", 0.35, 5.5, 0xffffff, 0.12, saturn, true);
  addBody("Triton", 0.7, 7, 0xaaaaff, 0.05, neptune, true);

  // Place planets once so spawn is consistent
  function placeBodies() {
    bodies.forEach(p => {
      const parentPos = p.userData.parent ? p.userData.parent.position : new THREE.Vector3();
      p.position.x = parentPos.x + Math.cos(p.userData.angle) * p.userData.dist;
      p.position.z = parentPos.z + Math.sin(p.userData.angle) * p.userData.dist;
      p.position.y = parentPos.y;
    });
  }
  placeBodies();

  const shipGeo = new THREE.ConeGeometry(1.8, 5, 8);
  const shipMat = new THREE.MeshLambertMaterial({ color: 0x88ccff });
  const ship = new THREE.Mesh(shipGeo, shipMat);
  // Spawn just outside Earth so Dock works immediately
  ship.position.set(earth.position.x + earth.userData.radius + 6, 0, earth.position.z);
  ship.rotation.x = Math.PI / 2;
  scene.add(ship);
  camera.position.copy(ship.position).add(new THREE.Vector3(0, 18, 45));
  camera.lookAt(ship.position);

  if (gs && gs.syncInventoryToWindow) gs.syncInventoryToWindow();
  window.inventory =
    window.inventory ||
    (gs && gs.getState().inventory) ||
    { iron: 5, ice: 8, fuel: 10, crystal: 2 };

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
          terran: 50,
          martian: 40,
          belt: 30,
          jovian: 45,
          outer: 25,
          pirate: 10,
          independent: 50
        };
      }
    }
  }
  if (gs) gs.getState().factionRep = { ...window.factionRep };

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
        try {
          window.Economy.changeReputation(factionId, amount);
        } catch (e) {}
      }
    } else {
      for (const id of Object.keys(window.factionRep)) {
        window.factionRep[id] = Math.max(
          0,
          Math.min(100, (window.factionRep[id] || 50) + amount)
        );
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

  function bodyToSystemId() {
    return "sol";
  }

  let playerMode = "seated";
  let walkOffset = new THREE.Vector3();
  let thrust = 0;
  let yaw = 0;
  let pitch = 0;
  let timeScale = 1;
  let paused = false;
  let showOrbits = false;
  let locked = false;
  let target = null;
  let economyAccum = 0;
  let lastLaser = 0;
  let dockedBody = null;
  let joyX = 0;
  let joyY = 0;

  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  function updateOrbits() {
    orbitGroup.clear();
    if (!showOrbits) return;
    bodies
      .filter(b => !b.userData.isMoon)
      .forEach(p => {
        const curve = new THREE.EllipseCurve(0, 0, p.userData.dist, p.userData.dist, 0, Math.PI * 2, false, 0);
        const pts = curve.getPoints(80);
        const geo = new THREE.BufferGeometry().setFromPoints(
          pts.map(pt => new THREE.Vector3(pt.x, 0, pt.y))
        );
        const mat = new THREE.LineBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.45 });
        orbitGroup.add(new THREE.Line(geo, mat));
      });
  }

  const sel = document.getElementById("sel");
  const shsel = document.getElementById("shsel");
  if (sel) {
    sel.innerHTML = "";
    ["Sun", ...bodies.map(b => b.userData.name), "Ship"].forEach(n => {
      const opt = document.createElement("option");
      opt.value = n.toLowerCase();
      opt.textContent = n;
      sel.appendChild(opt);
    });
    // Default target Earth so Go/Lock are useful
    sel.value = "earth";
  }
  if (shsel) {
    shsel.innerHTML = "";
    Object.values(SHIP_TYPES).forEach(s => {
      const opt = document.createElement("option");
      opt.value = (s.id || s.name).toLowerCase();
      opt.textContent = s.name;
      shsel.appendChild(opt);
    });
    if (!shsel.options.length) {
      ["Scout", "Hauler", "Interceptor"].forEach(n => {
        const opt = document.createElement("option");
        opt.value = n.toLowerCase();
        opt.textContent = n;
        shsel.appendChild(opt);
      });
    }
  }

  function $(id) {
    return document.getElementById(id);
  }

  function resolveTarget(value) {
    const v = (value || "").toLowerCase();
    if (v === "ship") return ship;
    if (v === "sun") return sun;
    return bodies.find(pl => pl.userData.name.toLowerCase() === v) || sun;
  }

  function onGo() {
    const body = resolveTarget(sel && sel.value);
    camera.position.copy(body.position).add(new THREE.Vector3(0, 18, 45));
    camera.lookAt(body.position);
    if (typeof window.msg === "function") window.msg("Camera → " + (body.userData && body.userData.name ? body.userData.name : body === ship ? "Ship" : "Sun"));
  }

  function onLock() {
    locked = !locked;
    const btn = $("lk");
    if (btn) btn.textContent = locked ? "Unlock" : "Lock";
    if (locked) {
      target = resolveTarget(sel && sel.value);
      if (typeof window.msg === "function") window.msg("Locked on target");
    } else {
      target = null;
      if (typeof window.msg === "function") window.msg("Lock released");
    }
  }

  function onStand() {
    const btn = $("ac");
    if (playerMode === "seated") {
      playerMode = "standing";
      if (btn) btn.textContent = "Sit";
      if (typeof window.msg === "function") window.msg("Stood up — WASD to walk");
    } else {
      playerMode = "seated";
      if (btn) btn.textContent = "Stand";
      walkOffset.set(0, 0, 0);
      if (typeof window.msg === "function") window.msg("Seated — ready to fly");
    }
  }

  function onTime() {
    timeScale = timeScale === 1 ? 10 : timeScale === 10 ? 60 : timeScale === 60 ? 3600 : 1;
    const btn = $("tm");
    if (btn) btn.textContent = "Time x" + timeScale;
  }

  function onOrbits() {
    showOrbits = !showOrbits;
    updateOrbits();
    const btn = $("orb");
    if (btn) btn.textContent = showOrbits ? "Orbits On" : "Orbits";
  }

  function onPause() {
    paused = !paused;
    const btn = $("pause");
    if (btn) btn.textContent = paused ? "Resume" : "Pause";
  }

  function bindClick(id, fn) {
    const el = $(id);
    if (!el) return;
    el.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      fn(e);
    });
  }

  bindClick("go", onGo);
  bindClick("lk", onLock);
  bindClick("ac", onStand);
  bindClick("tm", onTime);
  bindClick("orb", onOrbits);
  bindClick("pause", onPause);
  bindClick("helpbtn", function () {
    const h = $("help");
    if (h) h.style.display = "flex";
  });
  bindClick("closehelp", function () {
    const h = $("help");
    if (h) h.style.display = "none";
  });
  bindClick("closeStation", function () {
    const p = $("stationPanel");
    if (p) p.style.display = "none";
    dockedBody = null;
  });
  bindClick("md", function () {
    const fi = $("fi");
    if (fi) fi.click();
  });
  bindClick("st", function () {
    thrust = 0;
    joyX = 0;
    joyY = 0;
    const sl = $("sl");
    if (sl) sl.value = 0;
    resetKnob();
  });

  if ($("fi")) {
    $("fi").addEventListener("change", function () {
      alert("Custom model loading is not implemented in this version.");
    });
  }

  function refreshStationPanel() {
    const panel = $("stationPanel");
    if (!panel || panel.style.display === "none") return;
    const bodyName = dockedBody ? dockedBody.userData.name : "Station";
    const systemId = bodyToSystemId();
    if ($("stationTitle")) $("stationTitle").textContent = bodyName + " Station";

    if ($("stationCredits")) {
      $("stationCredits").innerHTML =
        "<strong>Personal:</strong> " +
        personalCredits().toLocaleString() +
        " cr · <strong>Company:</strong> " +
        companyCredits().toLocaleString() +
        " cr";
    }
    if ($("stationRep")) {
      const repBits = Object.entries(window.factionRep || {})
        .slice(0, 6)
        .map(([k, v]) => k + ": " + Math.round(v))
        .join(" · ");
      $("stationRep").textContent = "Rep: " + (repBits || "—");
    }

    const wh = $("stationWarehouse");
    if (wh) {
      const cargo = gs && gs.getSystemCargo ? gs.getSystemCargo(systemId) : {};
      const lines = Object.entries(cargo).filter(([, q]) => q > 0);
      if (!lines.length) {
        wh.innerHTML = "<em>System warehouse empty. Complete Transport deliveries to stock it.</em>";
      } else {
        wh.innerHTML =
          "<strong>Warehouse (" +
          systemId +
          ")</strong>" +
          lines
            .map(([type, q]) => {
              const safe = String(type).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
              return (
                '<div class="cargo-line"><span>' +
                type +
                " × " +
                q +
                '</span><button type="button" class="brass-btn" data-act="sell-wh" data-sys="' +
                systemId +
                '" data-type="' +
                safe +
                '" data-qty="1">Sell 1</button> <button type="button" class="brass-btn" data-act="sell-wh" data-sys="' +
                systemId +
                '" data-type="' +
                safe +
                '" data-qty="' +
                q +
                '">Sell all</button></div>'
              );
            })
            .join("");
      }
    }

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
            return (
              '<div class="cargo-line"><span>' +
              type +
              " × " +
              q +
              " (" +
              price +
              ' cr ea)</span><button type="button" class="brass-btn" data-act="sell-hold" data-type="' +
              type +
              '" data-qty="1">Sell 1</button> <button type="button" class="brass-btn" data-act="sell-hold" data-type="' +
              type +
              '" data-qty="' +
              q +
              '">Sell all</button></div>'
            );
          })
          .join("");
      }
    }

    const missEl = $("stationMissions");
    if (missEl && gs) {
      const active = gs.getState().activeMissions || [];
      if (!active.length) {
        missEl.innerHTML =
          '<em>No active missions. <a href="missions.html" style="color:#d4af37">Mission board</a></em>';
      } else {
        missEl.innerHTML = active
          .map(m => {
            const can = gs.canCompleteMission(m.id);
            const need =
              m.cargo && m.quantity ? "Need " + m.quantity + " " + m.cargo + " in hold" : m.type;
            return (
              '<div class="mission-line"><span><strong>' +
              m.title +
              "</strong> · " +
              m.reward +
              " cr · " +
              need +
              '</span><button type="button" class="brass-btn" data-act="mission" data-id="' +
              m.id +
              '" ' +
              (can ? "" : "disabled") +
              ">" +
              (can ? "Complete" : "Not ready") +
              "</button></div>"
            );
          })
          .join("");
      }
    } else if (missEl) {
      missEl.innerHTML = "<em>GameState not loaded.</em>";
    }

    const craftDiv = $("stationCrafting");
    if (craftDiv) {
      if (CRAFTING_RECIPES.length) {
        craftDiv.innerHTML = CRAFTING_RECIPES.map(r => {
          return (
            '<div class="cargo-line"><span>' +
            r.name +
            " → " +
            r.output +
            '</span><button type="button" class="brass-btn" data-act="craft" data-id="' +
            r.id +
            '">Craft</button></div>'
          );
        }).join("");
      } else {
        craftDiv.innerHTML = "<em>No recipes loaded.</em>";
      }
    }
  }

  // Delegate station panel clicks (works after innerHTML refresh)
  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const act = btn.getAttribute("data-act");
    if (act === "sell-hold") {
      window.sellHold(btn.getAttribute("data-type"), btn.getAttribute("data-qty"));
    } else if (act === "sell-wh") {
      window.sellWarehouse(
        btn.getAttribute("data-sys"),
        btn.getAttribute("data-type"),
        btn.getAttribute("data-qty")
      );
    } else if (act === "mission") {
      window.completeMissionAtStation(btn.getAttribute("data-id"));
    } else if (act === "craft") {
      window.craft(btn.getAttribute("data-id"));
    }
  });

  function tryDock() {
    // Generous range so Dock is usable
    let nearest = null;
    let best = Infinity;
    bodies.forEach(b => {
      const d = ship.position.distanceTo(b.position);
      const range = b.userData.radius + 22;
      if (d < range && d < best) {
        best = d;
        nearest = b;
      }
    });
    if (!nearest) {
      alert("No station in range. Select Earth → Go, or fly closer to a planet/moon.");
      return;
    }
    dockedBody = nearest;
    if (typeof window.changeRep === "function") window.changeRep(1, "terran");
    const panel = $("stationPanel");
    if (panel) panel.style.display = "flex";
    refreshStationPanel();
    if (typeof window.msg === "function") {
      window.msg("Docked at " + nearest.userData.name + " Station (+1 Terran)");
    }
  }

  bindClick("dock", tryDock);

  window.sellHold = function (type, qty) {
    qty = Math.max(1, Math.floor(Number(qty) || 1));
    const have = (window.inventory && window.inventory[type]) || 0;
    if (have < qty) {
      alert("Not enough " + type);
      return;
    }
    window.inventory[type] = have - qty;
    const gained = resourcePrice(type) * qty;
    addPersonal(gained, "Sold " + qty + " " + type);
    persistPlayerEconomy();
    refreshStationPanel();
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
    const unit = RESOURCES[type] ? resourcePrice(type) : 55;
    const gained = unit * qty;
    if (window.Credits && gs.getCompany("company-1")) {
      window.Credits.addCompany("company-1", gained, "Sold warehouse " + type);
    } else {
      addPersonal(gained, "Sold warehouse " + type);
    }
    persistPlayerEconomy();
    refreshStationPanel();
  };

  window.completeMissionAtStation = function (id) {
    if (!gs) return;
    if (!gs.canCompleteMission(id)) {
      alert("Requirements not met (check cargo in your hold).");
      return;
    }
    gs.syncInventoryFromWindow();
    const res = gs.completeMission(id);
    if (!res.ok) {
      alert(res.error || "Could not complete");
      return;
    }
    gs.syncInventoryToWindow();
    refreshStationPanel();
    if (typeof window.msg === "function") {
      window.msg("Mission complete: " + res.mission.title + " (+" + res.reward + " cr)");
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
    if (typeof window.msg === "function") window.msg("Crafted " + recipe.output);
  };

  // Keyboard + on-screen thrust/pitch buttons
  const keys = {};
  window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
    if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
  });

  function bindHoldButton(el) {
    if (!el) return;
    const k = el.getAttribute("data-k");
    if (!k) return;
    const down = e => {
      e.preventDefault();
      keys[k] = true;
    };
    const up = e => {
      e.preventDefault();
      keys[k] = false;
    };
    el.addEventListener("mousedown", down);
    el.addEventListener("mouseup", up);
    el.addEventListener("mouseleave", up);
    el.addEventListener("touchstart", down, { passive: false });
    el.addEventListener("touchend", up);
    el.addEventListener("touchcancel", up);
  }
  document.querySelectorAll(".bi, .ctrl-btn[data-k]").forEach(bindHoldButton);

  const sl = $("sl");
  if (sl) {
    sl.addEventListener("input", function () {
      thrust = parseFloat(sl.value) / 100;
    });
  }

  // Joystick
  const joy = $("joy");
  const knob = $("knob");
  function resetKnob() {
    joyX = 0;
    joyY = 0;
    if (knob) {
      knob.style.left = "50%";
      knob.style.top = "50%";
      knob.style.transform = "translate(-50%, -50%)";
    }
  }
  function setJoyFromEvent(clientX, clientY) {
    if (!joy) return;
    const rect = joy.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxR = rect.width * 0.35;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const len = Math.hypot(dx, dy) || 1;
    if (len > maxR) {
      dx = (dx / len) * maxR;
      dy = (dy / len) * maxR;
    }
    joyX = dx / maxR;
    joyY = dy / maxR;
    if (knob) {
      knob.style.left = 50 + joyX * 35 + "%";
      knob.style.top = 50 + joyY * 35 + "%";
      knob.style.transform = "translate(-50%, -50%)";
    }
  }
  if (joy) {
    let dragging = false;
    joy.addEventListener("pointerdown", e => {
      dragging = true;
      joy.setPointerCapture(e.pointerId);
      setJoyFromEvent(e.clientX, e.clientY);
      e.preventDefault();
    });
    joy.addEventListener("pointermove", e => {
      if (!dragging) return;
      setJoyFromEvent(e.clientX, e.clientY);
    });
    joy.addEventListener("pointerup", e => {
      dragging = false;
      resetKnob();
      try {
        joy.releasePointerCapture(e.pointerId);
      } catch (err) {}
    });
    joy.addEventListener("pointercancel", () => {
      dragging = false;
      resetKnob();
    });
  }

  function fireLaser() {
    const t = performance.now();
    if (t - lastLaser < 400) return;
    lastLaser = t;
    if (window.IAG && Math.random() < 0.08) {
      window.IAG.recordIncident({ lawId: "unsafeDischarge", system: "Sol" });
    }
    if (typeof window.msg === "function") window.msg("Defense laser fired");
  }

  const hud = $("hud");
  function updateHUD() {
    if (!hud) return;
    const speed = thrust * 25;
    const inv =
      Object.entries(window.inventory || {})
        .filter(([, v]) => v > 0)
        .map(([k, v]) => k + ":" + v)
        .join(" ") || "empty";
    const modeText = playerMode === "seated" ? "Seated" : "Standing";
    const activeM = gs ? (gs.getState().activeMissions || []).length : 0;
    hud.innerHTML =
      "Speed: " +
      speed.toFixed(1) +
      " · You: " +
      personalCredits().toLocaleString() +
      " cr · Co: " +
      companyCredits().toLocaleString() +
      " cr<br>Mode: " +
      modeText +
      " · Time: x" +
      timeScale +
      (paused ? " (Paused)" : "") +
      (activeM ? " · Missions: " + activeM : "") +
      "<br>Inventory: " +
      inv +
      '<br>Fuel: <div class="fuelbar"><div style="width:78%"></div></div>';
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
      // Joystick: X = yaw, Y = pitch (and slight thrust when pushed up)
      yaw += joyX * 2.2 * dt;
      pitch -= joyY * 1.8 * dt;
      if (joyY < -0.35) thrust = Math.min(1, thrust + dt * 0.8);
      if (keys["q"]) ship.rotation.z += dt;
      if (keys["e"]) ship.rotation.z -= dt;
      if (keys["x"]) thrust = 0;
      if (keys[" "]) fireLaser();

      if (sl && (keys["tu"] || keys["td"] || keys["w"] || keys["s"] || joyY < -0.35)) {
        sl.value = String(Math.round(thrust * 100));
      }

      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(ship.quaternion);
      ship.position.add(forward.multiplyScalar(thrust * 18 * t));
      ship.rotation.y = yaw;
      ship.rotation.x = Math.PI / 2 + pitch;
    } else {
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
      camera.position.lerp(desired, 0.08);
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

  window.msg = function (text) {
    if (hud) {
      const line = document.createElement("div");
      line.style.fontSize = "11px";
      line.style.opacity = "0.9";
      line.textContent = text;
      hud.appendChild(line);
      setTimeout(function () {
        if (line.parentNode) line.parentNode.removeChild(line);
      }, 4000);
    }
  };

  if (window.Economy && window.Economy.init) {
    try {
      window.Economy.init(null, { factions: FACTIONS });
    } catch (e) {}
  }

  console.log("Space Pack loaded — controls fixed (spawn at Earth, joystick, dock range).");
})();
