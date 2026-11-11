/* Ideal Umbrella — Core 3D Simulator
   Full solar system, shared GameState economy, docking, crafting, missions.
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
  const MISSIONS = window.MISSIONS || [];
  const gs = window.GameState;

  // —— Scene setup ——
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200000);
  camera.position.set(0, 30, 120);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  document.body.appendChild(renderer.domElement);
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

  // —— Bodies ——
  const bodies = [];
  function addBody(name, radius, dist, color, speed, parent = null, isMoon = false) {
    const geo = new THREE.SphereGeometry(radius, 24, 24);
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData = {
      name,
      dist,
      speed,
      angle: isMoon ? Math.random() * Math.PI * 2 : Math.random() * Math.PI * 2,
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

  function placeBodies() {
    bodies.forEach(p => {
      const parentPos = p.userData.parent ? p.userData.parent.position : new THREE.Vector3();
      p.position.x = parentPos.x + Math.cos(p.userData.angle) * p.userData.dist;
      p.position.z = parentPos.z + Math.sin(p.userData.angle) * p.userData.dist;
      p.position.y = parentPos.y;
    });
  }
  placeBodies();

  // —— Ship ——
  const shipGeo = new THREE.ConeGeometry(1.8, 5, 8);
  const shipMat = new THREE.MeshLambertMaterial({ color: 0x88ccff });
  const ship = new THREE.Mesh(shipGeo, shipMat);
  ship.position.set(earth.position.x + earth.userData.radius + 6, 0, earth.position.z);
  ship.rotation.x = Math.PI / 2;
  scene.add(ship);
  camera.position.copy(ship.position).add(new THREE.Vector3(0, 18, 45));
  camera.lookAt(ship.position);

  // —— Shared state ——
  if (gs && gs.syncInventoryToWindow) gs.syncInventoryToWindow();
  window.inventory =
    window.inventory ||
    (gs && gs.getState && gs.getState().inventory) ||
    { iron: 5, ice: 8, fuel: 10, crystal: 2 };

  if (!window.factionRep) {
    if (gs && gs.getState && gs.getState().factionRep) {
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
  if (gs && gs.getState) gs.getState().factionRep = { ...window.factionRep };

  window.ownedShips = window.ownedShips || [{ id: "starter", type: "hauler", name: "Wayfarer" }];
  window.activeMissions = window.activeMissions || [];

  function personalCredits() {
    if (window.Credits) return window.Credits.getPersonal();
    return window.credits || 2500;
  }
  function addPersonal(amount, reason) {
    if (window.Credits) return window.Credits.addPersonal(amount, reason);
    window.credits = (window.credits || 2500) + amount;
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
    if (gs && gs.getState) {
      gs.getState().factionRep = { ...window.factionRep };
      if (gs.saveState) gs.saveState();
    }
    return factionId ? window.factionRep[factionId] : window.factionRep;
  };

  function persistPlayerEconomy() {
    if (gs) {
      if (gs.syncInventoryFromWindow) gs.syncInventoryFromWindow();
      if (gs.getState) gs.getState().factionRep = { ...window.factionRep };
      if (gs.saveState) gs.saveState();
    }
  }

  function resourcePrice(id) {
    if (RESOURCES[id] && RESOURCES[id].basePrice) return RESOURCES[id].basePrice;
    return 40;
  }

  // —— Runtime state ——
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
  let lastLaser = 0;
  let dockedBody = null;
  let joyX = 0;
  let joyY = 0;
  let keys = {};
  let lastTime = performance.now();

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

  // —— UI helpers ——
  function $(id) { return document.getElementById(id); }

  function msg(text) {
    const w = $("warn");
    if (w) {
      w.textContent = text;
      w.style.opacity = "1";
      clearTimeout(w._t);
      w._t = setTimeout(() => { w.style.opacity = "0"; }, 2800);
    }
  }
  window.msg = msg;

  function updateHUD() {
    const hud = $("hud");
    if (!hud) return;
    const cred = personalCredits();
    const invCount = Object.values(window.inventory || {}).reduce((a, b) => a + (Number(b) || 0), 0);
    hud.innerHTML =
      `<span class="hud-item">Credits: <b>${Math.floor(cred)}</b></span>` +
      `<span class="hud-item">Cargo: <b>${invCount}</b></span>` +
      `<span class="hud-item">Thrust: <b>${Math.round(thrust * 100)}%</b></span>` +
      (dockedBody ? `<span class="hud-item docked">DOCKED: ${dockedBody.userData.name}</span>` : "");
  }

  // —— Selectors ——
  const sel = $("sel");
  const shsel = $("shsel");
  if (sel) {
    sel.innerHTML = "";
    ["Sun", ...bodies.map(b => b.userData.name), "Ship"].forEach(n => {
      const opt = document.createElement("option");
      opt.value = n.toLowerCase();
      opt.textContent = n;
      sel.appendChild(opt);
    });
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

  function resolveTarget(value) {
    const v = (value || "").toLowerCase();
    if (v === "ship") return ship;
    if (v === "sun") return sun;
    return bodies.find(pl => pl.userData.name.toLowerCase() === v) || sun;
  }

  // —— Button handlers ——
  function onGo() {
    const body = resolveTarget(sel && sel.value);
    camera.position.copy(body.position).add(new THREE.Vector3(0, 18, 45));
    camera.lookAt(body.position);
    msg("Camera → " + (body.userData && body.userData.name ? body.userData.name : body === ship ? "Ship" : "Sun"));
  }

  function onLock() {
    locked = !locked;
    const btn = $("lk");
    if (btn) btn.textContent = locked ? "Unlock" : "Lock";
    if (locked) {
      target = resolveTarget(sel && sel.value);
      msg("Locked on target");
    } else {
      target = null;
      msg("Lock released");
    }
  }

  function onStand() {
    const btn = $("ac");
    if (playerMode === "seated") {
      playerMode = "standing";
      if (btn) btn.textContent = "Sit";
      msg("Stood up — WASD to walk");
    } else {
      playerMode = "seated";
      if (btn) btn.textContent = "Stand";
      walkOffset.set(0, 0, 0);
      msg("Seated — ready to fly");
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
    updateHUD();
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
      msg("Custom model loading is not implemented in this version.");
    });
  }

  // —— Joystick ——
  const joy = $("joy");
  const knob = $("knob");
  function resetKnob() {
    if (knob) {
      knob.style.left = "50%";
      knob.style.top = "50%";
    }
    joyX = 0;
    joyY = 0;
  }
  if (joy && knob) {
    let dragging = false;
    function handlePointer(e) {
      if (!dragging) return;
      const rect = joy.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      let dx = (clientX - cx) / (rect.width / 2);
      let dy = (clientY - cy) / (rect.height / 2);
      const len = Math.hypot(dx, dy) || 1;
      if (len > 1) { dx /= len; dy /= len; }
      joyX = dx;
      joyY = dy;
      knob.style.left = 50 + dx * 40 + "%";
      knob.style.top = 50 + dy * 40 + "%";
    }
    joy.addEventListener("pointerdown", e => { dragging = true; joy.setPointerCapture(e.pointerId); handlePointer(e); });
    joy.addEventListener("pointermove", handlePointer);
    joy.addEventListener("pointerup", () => { dragging = false; resetKnob(); });
    joy.addEventListener("pointercancel", () => { dragging = false; resetKnob(); });
  }

  // Thrust slider
  const sl = $("sl");
  if (sl) {
    sl.addEventListener("input", () => {
      thrust = (Number(sl.value) || 0) / 100;
    });
  }

  // Thrust / pitch buttons
  document.querySelectorAll(".ctrl-btn").forEach(btn => {
    const k = btn.dataset.k;
    if (!k) return;
    btn.addEventListener("pointerdown", () => { keys[k] = true; });
    btn.addEventListener("pointerup", () => { keys[k] = false; });
    btn.addEventListener("pointerleave", () => { keys[k] = false; });
  });

  // —— Keyboard ——
  window.addEventListener("keydown", e => {
    keys[e.code] = true;
    if (e.code === "Space") {
      e.preventDefault();
      fireLaser();
    }
    if (e.code === "KeyX") {
      thrust = 0;
      if (sl) sl.value = 0;
      resetKnob();
    }
  });
  window.addEventListener("keyup", e => { keys[e.code] = false; });

  // —— Laser ——
  function fireLaser() {
    const now = performance.now();
    if (now - lastLaser < 400) return;
    lastLaser = now;
    msg("Defense laser fired");
    const flash = new THREE.PointLight(0xff4444, 3, 40);
    flash.position.copy(ship.position);
    scene.add(flash);
    setTimeout(() => scene.remove(flash), 80);
  }

  // —— Docking & Station ——
  function nearestDockable() {
    let best = null;
    let bestDist = 18;
    bodies.forEach(b => {
      const d = ship.position.distanceTo(b.position) - b.userData.radius;
      if (d < bestDist) {
        bestDist = d;
        best = b;
      }
    });
    return best;
  }

  function openStation(body) {
    dockedBody = body;
    const panel = $("stationPanel");
    if (!panel) return;
    panel.style.display = "flex";
    const title = $("stationTitle");
    if (title) title.textContent = body.userData.name + " Station";

    const credEl = $("stationCredits");
    if (credEl) credEl.innerHTML = `Credits: <b>${Math.floor(personalCredits())}</b>`;

    const repEl = $("stationRep");
    if (repEl) {
      const top = Object.entries(window.factionRep || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id, v]) => `${(FACTIONS[id] && FACTIONS[id].name) || id}: ${Math.round(v)}`)
        .join(" · ");
      repEl.innerHTML = `Reputation: ${top || "—"}`;
    }

    const invEl = $("stationInventory");
    if (invEl) {
      const inv = window.inventory || {};
      invEl.innerHTML = Object.keys(inv).length
        ? Object.entries(inv)
            .filter(([, q]) => q > 0)
            .map(([id, q]) => {
              const r = RESOURCES[id] || { name: id, icon: "📦" };
              return `<div class="inv-row">${r.icon || "📦"} ${r.name}: <b>${q}</b> <button data-buy="${id}" class="mini-btn">Buy</button> <button data-sell="${id}" class="mini-btn">Sell</button></div>`;
            })
            .join("")
        : "<p>Hold empty</p>";
      invEl.querySelectorAll("[data-buy]").forEach(btn => {
        btn.onclick = () => {
          const id = btn.dataset.buy;
          const price = resourcePrice(id);
          if (personalCredits() >= price) {
            addPersonal(-price, "buy " + id);
            window.inventory[id] = (window.inventory[id] || 0) + 1;
            persistPlayerEconomy();
            openStation(body);
            updateHUD();
            msg("Bought 1 " + id);
          } else msg("Not enough credits");
        };
      });
      invEl.querySelectorAll("[data-sell]").forEach(btn => {
        btn.onclick = () => {
          const id = btn.dataset.sell;
          if ((window.inventory[id] || 0) > 0) {
            window.inventory[id]--;
            addPersonal(resourcePrice(id) * 0.85, "sell " + id);
            persistPlayerEconomy();
            openStation(body);
            updateHUD();
            msg("Sold 1 " + id);
          }
        };
      });
    }

    const misEl = $("stationMissions");
    if (misEl) {
      const active = window.activeMissions || [];
      if (active.length) {
        misEl.innerHTML = active.map(m => {
          const done = (window.inventory[m.cargo] || 0) >= (m.quantity || 1);
          return `<div class="mis-row">${m.title} (${m.cargo} x${m.quantity}) ${done ? '<button data-complete="' + m.id + '" class="mini-btn">Complete</button>' : '<span class="muted">Need cargo</span>'}</div>`;
        }).join("");
        misEl.querySelectorAll("[data-complete]").forEach(btn => {
          btn.onclick = () => {
            const m = active.find(x => x.id === btn.dataset.complete);
            if (!m) return;
            if ((window.inventory[m.cargo] || 0) >= m.quantity) {
              window.inventory[m.cargo] -= m.quantity;
              addPersonal(m.reward || 1000, "mission " + m.id);
              if (m.reputation) {
                for (const [fid, delta] of Object.entries(m.reputation)) window.changeRep(delta, fid);
              }
              window.activeMissions = active.filter(x => x.id !== m.id);
              persistPlayerEconomy();
              openStation(body);
              updateHUD();
              msg("Mission complete! +" + (m.reward || 0) + " credits");
            }
          };
        });
      } else {
        misEl.innerHTML = "<p class='muted'>No active missions. Visit the Mission Board.</p>";
      }
    }

    const craftEl = $("stationCrafting");
    if (craftEl) {
      craftEl.innerHTML = (CRAFTING_RECIPES || []).slice(0, 8).map(r => {
        const can = (r.inputs || []).every(inp => (window.inventory[inp] || 0) >= 1);
        return `<div class="craft-row">${r.name} → ${r.output} <button data-craft="${r.id}" class="mini-btn" ${can ? "" : "disabled"}>Craft</button></div>`;
      }).join("") || "<p>No recipes</p>";
      craftEl.querySelectorAll("[data-craft]").forEach(btn => {
        btn.onclick = () => {
          const r = CRAFTING_RECIPES.find(x => x.id === btn.dataset.craft);
          if (!r) return;
          if ((r.inputs || []).every(inp => (window.inventory[inp] || 0) >= 1)) {
            r.inputs.forEach(inp => { window.inventory[inp]--; });
            window.inventory[r.output] = (window.inventory[r.output] || 0) + 1;
            persistPlayerEconomy();
            openStation(body);
            updateHUD();
            msg("Crafted " + r.output);
          } else msg("Missing inputs");
        };
      });
    }

    updateHUD();
  }

  bindClick("dock", function () {
    if (dockedBody) {
      const p = $("stationPanel");
      if (p) p.style.display = "none";
      dockedBody = null;
      updateHUD();
      msg("Undocked");
      return;
    }
    const near = nearestDockable();
    if (near) {
      openStation(near);
      msg("Docked at " + near.userData.name);
    } else {
      msg("No station in range");
    }
  });

  // —— Animation loop ——
  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min((now - lastTime) / 1000, 0.05) * (paused ? 0 : timeScale);
    lastTime = now;

    if (dt > 0) {
      bodies.forEach(p => {
        p.userData.angle += p.userData.speed * dt * 0.4;
      });
      placeBodies();
    }

    if (playerMode === "seated" && dt > 0) {
      const turnSpeed = 1.8 * dt;
      const pitchSpeed = 1.2 * dt;

      if (keys["KeyA"] || keys["ArrowLeft"] || joyX < -0.2) yaw += turnSpeed * (joyX < 0 ? -joyX : 1);
      if (keys["KeyD"] || keys["ArrowRight"] || joyX > 0.2) yaw -= turnSpeed * (joyX > 0 ? joyX : 1);
      if (keys["KeyW"] || keys["ArrowUp"] || keys["pu"] || joyY < -0.2) pitch += pitchSpeed;
      if (keys["KeyS"] || keys["ArrowDown"] || keys["pd"] || joyY > 0.2) pitch -= pitchSpeed;
      if (keys["KeyQ"]) ship.rotation.z += turnSpeed;
      if (keys["KeyE"]) ship.rotation.z -= turnSpeed;

      if (keys["tu"]) thrust = Math.min(1, thrust + 0.8 * dt);
      if (keys["td"]) thrust = Math.max(0, thrust - 0.8 * dt);

      pitch = Math.max(-1.2, Math.min(1.2, pitch));
      ship.rotation.y = yaw;
      ship.rotation.x = Math.PI / 2 + pitch;

      const speed = 18 * thrust * dt;
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(ship.quaternion);
      ship.position.addScaledVector(forward, speed);
    }

    if (locked && target) {
      camera.position.lerp(
        target.position.clone().add(new THREE.Vector3(0, 20, 50)),
        0.05
      );
      camera.lookAt(target.position);
    } else {
      const camTarget = ship.position.clone().add(new THREE.Vector3(0, 16, 40).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw));
      camera.position.lerp(camTarget, 0.08);
      camera.lookAt(ship.position);
    }

    const near = nearestDockable();
    const dockBtn = $("dock");
    if (dockBtn) {
      dockBtn.textContent = dockedBody ? "Undock" : near ? "Dock (" + near.userData.name + ")" : "Dock";
    }

    updateHUD();
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  updateHUD();
  msg("Welcome to Ideal Umbrella — fly near a planet and press Dock");

  requestAnimationFrame(animate);
})();
