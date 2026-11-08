/* Space Pack — Basic functional simulator (restored from stub)
   Provides a working Three.js scene with planets, ship controls, HUD, and button hooks.
   Full features (walk, EVA, full economy, gates, etc.) can be expanded from here.
*/

(function () {
  "use strict";

  if (typeof THREE === "undefined") {
    console.error("THREE.js not loaded");
    return;
  }

  // Basic scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000);
  camera.position.set(0, 20, 80);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.zIndex = "0";

  // Lights
  const ambient = new THREE.AmbientLight(0x404040, 0.4);
  scene.add(ambient);
  const sunLight = new THREE.PointLight(0xffffee, 2, 0, 2);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  // Sun
  const sunGeo = new THREE.SphereGeometry(8, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc44 });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sun);

  // Planets (simplified)
  const planets = [];
  function addPlanet(name, radius, dist, color, speed) {
    const geo = new THREE.SphereGeometry(radius, 24, 24);
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData = { name, dist, speed, angle: Math.random() * Math.PI * 2 };
    scene.add(mesh);
    planets.push(mesh);
    return mesh;
  }

  addPlanet("Mercury", 1.2, 20, 0xaaaaaa, 0.02);
  addPlanet("Venus", 1.8, 28, 0xeecc88, 0.015);
  addPlanet("Earth", 2.0, 40, 0x4488ff, 0.01);
  addPlanet("Mars", 1.5, 55, 0xcc5533, 0.008);
  addPlanet("Jupiter", 5.0, 90, 0xccaa66, 0.004);
  addPlanet("Saturn", 4.2, 120, 0xddcc88, 0.003);

  // Simple ship
  const shipGeo = new THREE.ConeGeometry(1.5, 4, 8);
  const shipMat = new THREE.MeshLambertMaterial({ color: 0x88ccff });
  const ship = new THREE.Mesh(shipGeo, shipMat);
  ship.position.set(40, 0, 0);
  ship.rotation.x = Math.PI / 2;
  scene.add(ship);

  // Controls state
  let thrust = 0;
  let yaw = 0, pitch = 0;
  let timeScale = 1;
  let paused = false;
  let showOrbits = false;
  let locked = false;
  let target = null;

  // Orbit lines (optional)
  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  function updateOrbits() {
    orbitGroup.clear();
    if (!showOrbits) return;
    planets.forEach(p => {
      const curve = new THREE.EllipseCurve(0, 0, p.userData.dist, p.userData.dist, 0, Math.PI * 2, false, 0);
      const pts = curve.getPoints(64);
      const geo = new THREE.BufferGeometry().setFromPoints(pts.map(pt => new THREE.Vector3(pt.x, 0, pt.y)));
      const mat = new THREE.LineBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.5 });
      const line = new THREE.Line(geo, mat);
      orbitGroup.add(line);
    });
  }

  // Populate selects
  const sel = document.getElementById("sel");
  const shsel = document.getElementById("shsel");
  if (sel) {
    ["Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Ship"].forEach(n => {
      const opt = document.createElement("option");
      opt.value = n.toLowerCase();
      opt.textContent = n;
      sel.appendChild(opt);
    });
  }
  if (shsel) {
    ["Default Ship", "Interceptor", "Hauler"].forEach(n => {
      const opt = document.createElement("option");
      opt.value = n.toLowerCase();
      opt.textContent = n;
      shsel.appendChild(opt);
    });
  }

  // Button hooks
  const $ = id => document.getElementById(id);
  if ($("go")) $("go").onclick = () => {
    const v = sel && sel.value;
    if (v === "ship") {
      camera.position.copy(ship.position).add(new THREE.Vector3(0, 10, 30));
      camera.lookAt(ship.position);
    } else {
      const p = planets.find(pl => pl.userData.name.toLowerCase() === v) || sun;
      camera.position.copy(p.position).add(new THREE.Vector3(0, 15, 40));
      camera.lookAt(p.position);
    }
  };
  if ($("lk")) $("lk").onclick = () => {
    locked = !locked;
    $("lk").textContent = locked ? "Unlock" : "Lock";
    if (locked && sel) {
      const v = sel.value;
      target = v === "ship" ? ship : (planets.find(pl => pl.userData.name.toLowerCase() === v) || sun);
    }
  };
  if ($("ac")) $("ac").onclick = () => { alert("Stand up / Walk mode not fully implemented in this basic version."); };
  if ($("md")) $("md").onclick = () => { $("fi").click(); };
  if ($("tm")) $("tm").onclick = () => {
    timeScale = timeScale === 1 ? 10 : timeScale === 10 ? 60 : 1;
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
  if ($("closeStation")) $("closeStation").onclick = () => { $("stationPanel").style.display = "none"; };

  // File loader stub
  if ($("fi")) $("fi").onchange = e => {
    alert("Custom model loading is not implemented in this basic version.");
  };

  // Keyboard / button controls
  const keys = {};
  window.addEventListener("keydown", e => { keys[e.key.toLowerCase()] = true; });
  window.addEventListener("keyup", e => { keys[e.key.toLowerCase()] = false; });

  // Image button controls (thrust, pitch)
  document.querySelectorAll(".bi").forEach(img => {
    const k = img.dataset.k;
    img.addEventListener("mousedown", () => { keys[k] = true; });
    img.addEventListener("mouseup", () => { keys[k] = false; });
    img.addEventListener("mouseleave", () => { keys[k] = false; });
    img.addEventListener("touchstart", e => { e.preventDefault(); keys[k] = true; });
    img.addEventListener("touchend", () => { keys[k] = false; });
  });

  if ($("st")) $("st").onclick = () => { thrust = 0; if ($("sl")) $("sl").value = 0; };
  if ($("sl")) $("sl").oninput = () => { thrust = parseFloat($("sl").value) / 100; };

  // HUD
  const hud = $("hud");
  function updateHUD() {
    if (!hud) return;
    const speed = thrust * 20;
    hud.innerHTML = `
      Speed: ${speed.toFixed(1)} · Credits: ${(window.credits || 50000).toLocaleString()} cr<br>
      Time: x${timeScale} ${paused ? "(Paused)" : ""}<br>
      Fuel: <div class="fuelbar"><div style="width:85%"></div></div>
    `;
  }

  // Animation loop
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

    // Planet orbits
    planets.forEach(p => {
      p.userData.angle += p.userData.speed * t;
      p.position.x = Math.cos(p.userData.angle) * p.userData.dist;
      p.position.z = Math.sin(p.userData.angle) * p.userData.dist;
    });

    // Ship controls
    if (keys["w"] || keys["arrowup"] || keys["tu"]) thrust = Math.min(1, thrust + dt);
    if (keys["s"] || keys["arrowdown"] || keys["td"]) thrust = Math.max(0, thrust - dt);
    if (keys["a"] || keys["arrowleft"]) yaw -= 1.5 * dt;
    if (keys["d"] || keys["arrowright"]) yaw += 1.5 * dt;
    if (keys["pu"]) pitch += 1.2 * dt;
    if (keys["pd"]) pitch -= 1.2 * dt;
    if (keys["q"]) ship.rotation.z += dt;
    if (keys["e"]) ship.rotation.z -= dt;
    if (keys["x"]) thrust = 0;

    // Apply movement
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(ship.quaternion);
    ship.position.add(forward.multiplyScalar(thrust * 15 * t));
    ship.rotation.y = yaw;
    ship.rotation.x = Math.PI / 2 + pitch;

    // Camera follow if locked
    if (locked && target) {
      const offset = new THREE.Vector3(0, 15, 40);
      camera.position.copy(target.position).add(offset);
      camera.lookAt(target.position);
    } else {
      // Free cam roughly follow ship
      const desired = ship.position.clone().add(new THREE.Vector3(0, 12, 35));
      camera.position.lerp(desired, 0.05);
      camera.lookAt(ship.position);
    }

    updateHUD();
    renderer.render(scene, camera);
  }

  // Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Init
  updateOrbits();
  updateHUD();
  animate(performance.now());

  // Expose some globals expected by other modules
  window.credits = window.credits || 50000;
  window.msg = text => { if (hud) hud.innerHTML += `<br><small>${text}</small>`; };

  console.log("Space Pack basic simulator loaded.");
})();
