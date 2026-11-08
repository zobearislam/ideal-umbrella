/* controls-improve.js — better walk + ship steering
 * Load AFTER js/space.js (waits if space.js loads async)
 */
(function () {
  "use strict";

  function ready() {
    return typeof mode !== "undefined" && typeof shipQ !== "undefined"
      && typeof frame === "function" && typeof renderer !== "undefined"
      && typeof cur !== "undefined" && cur && cur.specs;
  }

  function start() {
    if (!ready()) return;

    const look = { dx: 0, dy: 0, sens: 0.0035, flySens: 0.045, smooth: 0.22 };
    const angVel = { yaw: 0, pitch: 0, roll: 0 };
    const walkVel = { x: 0, z: 0 };
    let pointerLocked = false;
    let drag = null;

    window.K = window.K || {};
    const canvas = renderer.domElement;

    canvas.addEventListener("contextmenu", e => e.preventDefault());
    canvas.addEventListener("pointerdown", e => {
      if (e.button === 2) { canvas.requestPointerLock?.(); return; }
      if (e.button === 0) drag = [e.clientX, e.clientY];
    });
    window.addEventListener("pointerup", () => { drag = null; });
    document.addEventListener("pointerlockchange", () => {
      pointerLocked = document.pointerLockElement === canvas;
    });
    canvas.addEventListener("pointermove", e => {
      if (pointerLocked) {
        look.dx += e.movementX || 0;
        look.dy += e.movementY || 0;
        return;
      }
      if (!drag) return;
      look.dx += e.clientX - drag[0];
      look.dy += e.clientY - drag[1];
      drag = [e.clientX, e.clientY];
    });

    canvas.addEventListener("wheel", e => {
      if (mode !== "fly") return;
      e.preventDefault();
      sl.value = Math.max(0, Math.min(100, +sl.value + (e.deltaY > 0 ? -3 : 3)));
    }, { passive: false });

    window.addEventListener("keydown", e => {
      if (e.key === "Shift") K.boost = 1;
      if (e.code === "KeyR" && mode === "fly") {
        angVel.roll *= 0.15;
        if (typeof msg === "function") msg("Roll damp");
      }
    });
    window.addEventListener("keyup", e => {
      if (e.key === "Shift") K.boost = 0;
    });

    // Joystick curve
    const joy = document.getElementById("joy");
    const knob = document.getElementById("knob");
    if (joy && knob && typeof J !== "undefined") {
      let pid = null;
      function joyMove(e) {
        const b = joy.getBoundingClientRect();
        const R = b.width / 2;
        let dx = e.clientX - b.left - R;
        let dy = e.clientY - b.top - R;
        const m = R * 0.42;
        const d = Math.hypot(dx, dy);
        if (d > m) { dx *= m / d; dy *= m / d; }
        knob.style.transform = "translate(" + dx + "px," + dy + "px)";
        let jx = dx / m, jy = -dy / m;
        const dead = 0.08, mag = Math.hypot(jx, jy);
        if (mag < dead) { jx = 0; jy = 0; }
        else {
          const adj = (mag - dead) / (1 - dead);
          const curved = Math.pow(adj, 1.35);
          jx = (jx / mag) * curved;
          jy = (jy / mag) * curved;
        }
        J.x = jx; J.y = jy;
      }
      joy.onpointerdown = e => { pid = e.pointerId; joy.setPointerCapture(pid); joyMove(e); };
      joy.onpointermove = e => { if (e.pointerId === pid) joyMove(e); };
      const up = e => {
        if (e.pointerId === pid) {
          pid = null; J.x = J.y = 0; knob.style.transform = "";
        }
      };
      joy.onpointerup = up;
      joy.onpointercancel = up;
    }

    window.frame = function improvedFrame(now) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (paused) { requestAnimationFrame(frame); return; }
      const sp = cur.specs;

      if (typeof laserCooldown !== "undefined" && laserCooldown > 0) laserCooldown -= dt;

      const ldx = look.dx, ldy = look.dy;
      look.dx *= (1 - look.smooth);
      look.dy *= (1 - look.smooth);
      if (Math.abs(look.dx) < 0.05) look.dx = 0;
      if (Math.abs(look.dy) < 0.05) look.dy = 0;

      const keyYaw = (K.l ? 1 : 0) - (K.r ? 1 : 0);
      const keyRoll = (K.a ? 1 : 0) - (K.b ? 1 : 0);
      const keyPitch = (K.u ? 1 : 0) - (K.d ? 1 : 0) + (K.pu ? 1 : 0) - (K.pd ? 1 : 0);
      const boostMul = K.boost ? 1.55 : 1;

      if (mode === "fly") {
        const turn = sp.turn;
        const targetYaw = (keyYaw - (J ? J.x : 0)) * turn * 2.2 * boostMul - ldx * look.flySens;
        const targetPitch = (keyPitch + (J ? J.y : 0)) * turn * 1.8 * boostMul - ldy * look.flySens;
        const targetRoll = keyRoll * turn * 2.0 * boostMul;
        const ease = 1 - Math.exp(-dt * 8);
        angVel.yaw += (targetYaw - angVel.yaw) * ease;
        angVel.pitch += (targetPitch - angVel.pitch) * ease;
        angVel.roll += (targetRoll - angVel.roll) * ease;
        const anySteer = keyYaw || keyPitch || keyRoll ||
          (J && (Math.abs(J.x) > 0.02 || Math.abs(J.y) > 0.02)) ||
          Math.abs(ldx) > 0.5 || Math.abs(ldy) > 0.5;
        if (!anySteer) {
          angVel.yaw *= Math.exp(-dt * 2.5);
          angVel.pitch *= Math.exp(-dt * 2.5);
          angVel.roll *= Math.exp(-dt * 3.5);
        }
        if (Math.abs(angVel.yaw) > 1e-5) shipQ.multiply(Q2.setFromAxisAngle(VY, angVel.yaw * dt));
        if (Math.abs(angVel.pitch) > 1e-5) shipQ.multiply(Q2.setFromAxisAngle(VX, angVel.pitch * dt));
        if (Math.abs(angVel.roll) > 1e-5) shipQ.multiply(Q2.setFromAxisAngle(VZ, angVel.roll * dt));
        shipQ.normalize();
      } else {
        const lookSpeed = look.sens * (pointerLocked ? 1.25 : 1);
        yaw -= ldx * lookSpeed;
        pitch = Math.max(-1.45, Math.min(1.45, pitch - ldy * lookSpeed));
        yaw += keyYaw * dt * 1.8;
        pitch = Math.max(-1.45, Math.min(1.45, pitch + keyPitch * dt * 1.3));

        const mv = (K.f ? 1 : 0) - (K.s ? 1 : 0) + (J ? J.y : 0);
        const strafe = (K.l ? -1 : 0) + (K.r ? 1 : 0) + (J ? J.x : 0);
        const vt = (K.pu ? 1 : 0) - (K.pd ? 1 : 0) + (K.tu ? 1 : 0) - (K.td ? 1 : 0);

        if (mode === "walk") {
          const maxW = sp.walk * (K.boost ? 1.7 : 1);
          const accel = maxW * 6;
          const c = Math.cos(yaw), s = Math.sin(yaw);
          const wishX = strafe, wishZ = -mv;
          const wishLen = Math.hypot(wishX, wishZ);
          if (wishLen > 0.01) {
            const inv = 1 / wishLen;
            walkVel.x += (wishX * inv * maxW - walkVel.x) * Math.min(1, accel * dt);
            walkVel.z += (wishZ * inv * maxW - walkVel.z) * Math.min(1, accel * dt);
          } else {
            const fr = Math.exp(-dt * 8);
            walkVel.x *= fr; walkVel.z *= fr;
            if (Math.hypot(walkVel.x, walkVel.z) < 0.05) { walkVel.x = 0; walkVel.z = 0; }
          }
          const vx = walkVel.x * c + walkVel.z * s;
          const vz = -walkVel.x * s + walkVel.z * c;
          const wx = H[0] / 2 - 0.35;
          pl.x = Math.max(-wx, Math.min(wx, pl.x + vx * dt));
          pl.z = Math.max(-H[2] / 2 + 0.85, Math.min(H[2] / 2 - 0.45, pl.z + vz * dt));
          pl.y = EYE();
        } else if (mode === "eva") {
          qL.setFromEuler(E.set(pitch, yaw, 0, "YXZ"));
          F.set(0, 0, -1).applyQuaternion(qL);
          R.set(1, 0, 0).applyQuaternion(qL);
          V.set(0, 1, 0).applyQuaternion(qL);
          const th = sp.evaThrust * (K.boost ? 1.8 : 1);
          const wish = mv * mv + strafe * strafe + vt * vt;
          evv[0] += (F.x * mv + R.x * strafe + V.x * vt) * th * dt * 60;
          evv[1] += (F.y * mv + R.y * strafe + V.y * vt) * th * dt * 60;
          evv[2] += (F.z * mv + R.z * strafe + V.z * vt) * th * dt * 60;
          const damp = Math.exp(-dt * (wish > 0.05 ? 0.35 : 1.8));
          evv[0] *= damp; evv[1] *= damp; evv[2] *= damp;
          const esp = Math.hypot(evv[0], evv[1], evv[2]);
          const maxEva = 0.012 * (K.boost ? 1.5 : 1);
          if (esp > maxEva) {
            const s = maxEva / esp;
            evv[0] *= s; evv[1] *= s; evv[2] *= s;
          }
        }
      }

      const thrRate = K.boost ? 40 : 22;
      if ((K.f || K.tu) && mode === "fly") sl.value = Math.min(100, +sl.value + dt * thrRate);
      if ((K.s || K.td) && mode === "fly") sl.value = Math.max(0, +sl.value - dt * thrRate);

      const speed = +sl.value > 0 ? 0.001 * Math.pow(sp.maxSpeed / 0.001, sl.value / 100) : 0;

      if (mode === "fly" && speed > 0.01) {
        fuel = Math.max(0, fuel - FUEL_USE * (speed / (sp.maxSpeed || 1)) * dt * 10);
        if (fuel <= 0) { sl.value = 0; msg("Out of fuel!"); }
      }

      const L = lock && B[lock];
      const old = L ? L.pos.slice() : null;
      t += dt * ts / 86400;
      place();
      if (L) for (let i = 0; i < 3; i++) {
        const d = L.pos[i] - old[i];
        ship[i] += d; ev[i] += d;
      }

      spd = speed;
      V.set(0, 0, -1).applyQuaternion(shipQ);
      ship[0] += V.x * speed * dt;
      ship[1] += V.y * speed * dt;
      ship[2] += V.z * speed * dt;

      if (mode === "eva") for (let i = 0; i < 3; i++) ev[i] += evv[i] * dt;

      if (mode === "eva") {
        vo = ev;
        camera.quaternion.setFromEuler(E.set(pitch, yaw, 0, "YXZ"));
      } else {
        P.copy(pl).multiplyScalar(0.001).applyQuaternion(shipQ);
        vo = [ship[0] + P.x, ship[1] + P.y, ship[2] + P.z];
        camera.quaternion.copy(shipQ);
        if (mode === "walk") camera.quaternion.multiply(qL.setFromEuler(E.set(pitch, yaw, 0, "YXZ")));
      }

      shipG.position.set(ship[0] - vo[0], ship[1] - vo[1], ship[2] - vo[2]);
      shipG.quaternion.copy(shipQ);

      for (const b of list) {
        if (b.kind !== "gate") continue;
        const d = Math.hypot(b.pos[0] - ship[0], b.pos[1] - ship[1], b.pos[2] - ship[2]);
        if (d < b.r * 6 && b.dest && B[b.dest]) {
          const dest = B[b.dest];
          ship = [dest.pos[0] + dest.r * 8, dest.pos[1], dest.pos[2]];
          msg("Gate jump to " + dest.name);
          if (b.faction && typeof changeRep === "function") changeRep(1, b.faction);
          break;
        }
      }

      let near = list[0], nd = 1e99;
      for (const b of list) {
        const x = b.pos[0] - vo[0], y = b.pos[1] - vo[1], z = b.pos[2] - vo[2];
        b.m.position.set(x, y, z);
        if (b.light) b.light.position.set(x, y, z);
        b.dist = Math.hypot(x, y, z);
        const a = b.dist - b.r;
        if (a < nd) { nd = a; near = b; }
      }

      if (showOrbits) {
        for (const b of list) {
          const line = orbitLines[b.id];
          if (line && b.parent) {
            const p = B[b.parent].pos;
            line.position.set(p[0] - vo[0], p[1] - vo[1], p[2] - vo[2]);
          }
        }
      }

      if (window._belt) window._belt.position.set(-vo[0], -vo[1], -vo[2]);
      renderer.render(scene, camera);

      const alt = Math.max(nd, 0);
      const fuelPct = Math.round(fuel);
      const warnEl = $("warn");
      if (alt < (near.r || 1) * 0.3 && near.kind !== "station") {
        warnEl.style.display = "block";
        warnEl.textContent = "WARNING: TOO CLOSE TO " + near.name.toUpperCase();
      } else warnEl.style.display = "none";

      const facName = near.faction && FACTIONS[near.faction] ? FACTIONS[near.faction].name : "";
      const facRep = near.faction ? Math.round(factionRep[near.faction] || 50) : Math.round(reputation);
      const lockNote = pointerLocked ? " · MOUSE LOCK" : "";
      hud.innerHTML = (nt > 0 ? note + " | " : "") +
        cur.name + " " + mode.toUpperCase() + lockNote + " | " +
        near.name + " " + fmt(alt) + " | " + fsp(speed) + " | Fuel " + fuelPct + "%" +
        " | " + credits.toLocaleString() + " cr" +
        (facName ? " | " + facName + " " + facRep : " | Rep " + Math.round(reputation)) +
        '<div class="fuelbar"><div style="width:' + fuelPct + '%"></div></div>';

      nt -= dt;

      for (const b of list) {
        V.copy(b.m.position).project(camera);
        const ok = V.z < 1 && Math.abs(V.x) < 1 && Math.abs(V.y) < 1 && b.dist > b.r * 1.5;
        b.lb.style.display = ok ? "block" : "none";
        if (ok) {
          b.lb.style.transform = "translate(" + ((V.x + 1) / 2 * innerWidth + 8) + "px," +
            ((1 - V.y) / 2 * innerHeight - 6) + "px)";
        }
      }

      if (typeof drawRadar === "function") drawRadar();
      if (mode === "walk" && Math.random() < 0.05 && typeof updateAllScreens === "function") updateAllScreens();
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
    console.info("[controls-improve] Enhanced fly/walk/EVA steering active. Right-click canvas for mouse lock.");
  }

  function boot() {
    if (!ready()) { setTimeout(boot, 50); return; }
    start();
  }
  boot();
})();
