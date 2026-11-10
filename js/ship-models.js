/**
 * Procedural ship models + combat hardpoints.
 * Non-cargo ships get auto-turrets and missiles.
 * Cargo: hauler, freighter, miner, liner (no missiles / no auto-turret).
 */
(function () {
  "use strict";

  var CARGO_TYPES = { hauler: true, freighter: true, miner: true, liner: true };

  function isCargo(type) {
    return !!CARGO_TYPES[type];
  }

  function parseHex(hex) {
    hex = String(hex || "#88aacc").replace("#", "");
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    var n = parseInt(hex, 16);
    return isNaN(n) ? 0x88aacc : n;
  }

  function mat(THREE, color, emissive, emi) {
    return new THREE.MeshLambertMaterial({
      color: color,
      emissive: emissive != null ? emissive : 0x000000,
      emissiveIntensity: emi || 0
    });
  }

  /** Build a full ship group. Nose points -Z (Three.js lookAt convention). */
  function buildShipModel(THREE, type, colorHex, opts) {
    opts = opts || {};
    var color = parseHex(colorHex);
    var accent = opts.accent != null ? parseHex(opts.accent) : color;
    var dark = 0x1a1a22;
    var hull = mat(THREE, color);
    var hullDark = mat(THREE, dark);
    var glow = mat(THREE, accent, accent, 0.35);
    var glass = mat(THREE, 0x88ccff, 0x224466, 0.2);
    var group = new THREE.Group();
    group.name = "shipModel";

    type = type || "scout";

    // ——— shared pieces ———
    function addBox(w, h, d, x, y, z, material) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material || hull);
      m.position.set(x || 0, y || 0, z || 0);
      group.add(m);
      return m;
    }
    function addCyl(rt, rb, h, x, y, z, rx, material) {
      var m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 8), material || hull);
      m.position.set(x || 0, y || 0, z || 0);
      if (rx) m.rotation.x = rx;
      group.add(m);
      return m;
    }
    function addCone(r, h, x, y, z, material) {
      var m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), material || hull);
      m.position.set(x || 0, y || 0, z || 0);
      m.rotation.x = Math.PI / 2; // tip toward -Z
      group.add(m);
      return m;
    }

    // Engines at +Z (aft)
    function twinEngines(spread, z, scale) {
      scale = scale || 1;
      addCyl(0.35 * scale, 0.45 * scale, 0.5 * scale, -spread, 0, z, Math.PI / 2, glow);
      addCyl(0.35 * scale, 0.45 * scale, 0.5 * scale, spread, 0, z, Math.PI / 2, glow);
    }

    // ——— type models ———
    if (type === "scout") {
      addCone(0.9, 3.2, 0, 0, -1.2);
      addBox(1.4, 0.7, 2.2, 0, 0, 0.6);
      addBox(2.8, 0.12, 1.0, 0, 0, 0.2, hullDark); // wings
      addBox(0.5, 0.35, 0.6, 0, 0.45, -0.3, glass); // cockpit
      twinEngines(0.55, 1.9, 0.85);
      group.scale.setScalar(0.85);
    } else if (type === "courier") {
      addCone(1.0, 3.0, 0, 0, -1.4);
      addBox(1.6, 0.9, 2.8, 0, 0, 0.5);
      addBox(1.2, 0.7, 1.4, 0, 0, 1.6, hullDark); // cargo pod
      addBox(0.55, 0.4, 0.7, 0, 0.55, -0.5, glass);
      twinEngines(0.6, 2.2, 0.9);
    } else if (type === "interceptor") {
      addCone(1.1, 4.0, 0, 0, -1.6);
      addBox(1.5, 0.75, 2.5, 0, 0, 0.5);
      // swept wings
      var wingGeo = new THREE.BoxGeometry(3.6, 0.12, 1.4);
      var wing = new THREE.Mesh(wingGeo, hullDark);
      wing.position.set(0, -0.1, 0.3);
      group.add(wing);
      addBox(0.2, 0.8, 1.2, -1.6, 0.2, 0.4); // vertical stabilizers
      addBox(0.2, 0.8, 1.2, 1.6, 0.2, 0.4);
      addBox(0.6, 0.4, 0.8, 0, 0.5, -0.8, glass);
      twinEngines(0.7, 2.0, 1.1);
      addCyl(0.25, 0.3, 0.4, 0, 0, 2.15, Math.PI / 2, glow); // center engine
    } else if (type === "hauler") {
      addCone(1.0, 2.4, 0, 0, -2.0);
      addBox(2.0, 1.4, 3.5, 0, 0, 0.2);
      addBox(2.2, 1.6, 2.0, 0, 0, 2.2, hullDark); // cargo box
      addBox(0.5, 0.4, 0.6, 0, 0.85, -1.2, glass);
      twinEngines(0.75, 3.4, 1);
      group.scale.setScalar(1.05);
    } else if (type === "freighter") {
      addCone(1.2, 2.8, 0, 0, -2.6);
      addBox(2.4, 1.8, 4.0, 0, 0, 0);
      addBox(2.6, 2.0, 2.5, 0, 0, 2.8, hullDark);
      addBox(2.6, 2.0, 2.0, 0, 0, 5.0, hullDark);
      addBox(0.6, 0.45, 0.7, 0, 1.1, -1.5, glass);
      twinEngines(0.95, 6.2, 1.2);
      group.scale.setScalar(1.15);
    } else if (type === "miner") {
      addCone(1.0, 2.2, 0, 0, -1.8);
      addBox(2.2, 1.5, 3.0, 0, 0, 0.3);
      // drill arm
      addCyl(0.15, 0.2, 2.5, 1.4, -0.3, -1.0, Math.PI / 2, hullDark);
      addCone(0.35, 0.8, 1.4, -0.3, -2.4, glow);
      addBox(1.8, 1.2, 1.5, 0, 0, 2.2, hullDark);
      twinEngines(0.7, 3.2, 1);
    } else if (type === "liner") {
      addCone(1.1, 3.0, 0, 0, -2.4);
      addBox(2.0, 1.6, 5.0, 0, 0, 0.5);
      addBox(1.8, 0.5, 4.0, 0, 0.9, 0.3, glass); // window band
      addBox(0.6, 0.5, 0.8, 0, 1.0, -1.4, glass);
      twinEngines(0.8, 3.4, 1.05);
      group.scale.setScalar(1.1);
    } else if (type === "capital") {
      addCone(1.6, 4.0, 0, 0, -3.5);
      addBox(3.2, 2.2, 6.0, 0, 0, 0.5);
      addBox(3.5, 2.4, 3.0, 0, 0, 4.5, hullDark);
      addBox(2.8, 0.4, 4.0, 0, 1.3, 0.5, glass);
      twinEngines(1.2, 6.5, 1.5);
      addCyl(0.5, 0.55, 0.6, 0, 0, 6.6, Math.PI / 2, glow);
      group.scale.setScalar(1.35);
    } else {
      // default / player-like
      addCone(1.0, 3.5, 0, 0, -1.2);
      addBox(1.6, 0.8, 2.5, 0, 0, 0.8);
      twinEngines(0.6, 2.2, 1);
    }

    // Hardpoints metadata
    var armed = !isCargo(type);
    group.userData.shipType = type;
    group.userData.armed = armed;
    group.userData.color = colorHex;

    // Auto-turrets (non-cargo only)
    group.userData.turrets = [];
    if (armed) {
      var turretCount = type === "interceptor" || type === "capital" ? 2 : 1;
      for (var t = 0; t < turretCount; t++) {
        var tur = buildTurret(THREE, accent);
        var side = t === 0 ? 1 : -1;
        if (turretCount === 1) {
          tur.position.set(0, 0.7, 0.2);
        } else {
          tur.position.set(side * 0.9, 0.55, 0.3);
        }
        group.add(tur);
        group.userData.turrets.push(tur);
      }
      // Missile rails
      group.userData.missileMounts = [];
      var mCount = type === "capital" ? 4 : type === "interceptor" ? 2 : 1;
      for (var m = 0; m < mCount; m++) {
        var mx = (m % 2 === 0 ? -1 : 1) * (0.7 + Math.floor(m / 2) * 0.3);
        var mz = 0.5 - Math.floor(m / 2) * 0.4;
        var rail = addBox(0.12, 0.12, 0.9, mx, -0.35, mz, hullDark);
        group.userData.missileMounts.push(rail.position.clone());
      }
    }

    return group;
  }

  function buildTurret(THREE, accentHex) {
    var g = new THREE.Group();
    g.name = "turret";
    var base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.28, 0.15, 8),
      mat(THREE, 0x333344)
    );
    g.add(base);
    var head = new THREE.Group();
    head.name = "turretHead";
    head.position.y = 0.12;
    var housing = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.2, 0.35),
      mat(THREE, 0x444455)
    );
    head.add(housing);
    var barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.06, 0.55, 6),
      mat(THREE, parseHex(accentHex || "#ccc"), parseHex(accentHex || "#ccc"), 0.25)
    );
    barrel.rotation.x = Math.PI / 2;
    barrel.position.z = -0.3;
    head.add(barrel);
    g.add(head);
    g.userData.head = head;
    g.userData.barrel = barrel;
    g.userData.cooldown = 0;
    return g;
  }

  /** Missile projectile mesh */
  function buildMissile(THREE, colorHex) {
    var color = parseHex(colorHex || "#ff8844");
    var g = new THREE.Group();
    var body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 0.7, 6),
      mat(THREE, color, color, 0.2)
    );
    body.rotation.x = Math.PI / 2;
    g.add(body);
    var tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.2, 6),
      mat(THREE, 0xffeeaa, 0xffaa44, 0.5)
    );
    tip.rotation.x = Math.PI / 2;
    tip.position.z = -0.45;
    g.add(tip);
    var exhaust = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 6, 6),
      mat(THREE, 0xff6600, 0xff3300, 0.8)
    );
    exhaust.position.z = 0.4;
    g.add(exhaust);
    return g;
  }

  /** Turret bolt */
  function buildBolt(THREE, colorHex) {
    var color = parseHex(colorHex || "#66ffcc");
    var m = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.6, 5),
      mat(THREE, color, color, 0.9)
    );
    m.rotation.x = Math.PI / 2;
    return m;
  }

  // ——— Combat runtime ———
  var projectiles = [];
  var _scene = null;
  var _THREE = null;

  function setScene(scene, THREE) {
    _scene = scene;
    _THREE = THREE;
  }

  function fireMissile(fromObj, direction, opts) {
    if (!_scene || !_THREE) return null;
    opts = opts || {};
    var missile = buildMissile(_THREE, opts.color || "#ff8844");
    var origin = new _THREE.Vector3();
    fromObj.getWorldPosition(origin);
    if (opts.offset) origin.add(opts.offset);
    missile.position.copy(origin);
    var dir = direction.clone().normalize();
    missile.lookAt(origin.clone().add(dir));
    _scene.add(missile);
    var proj = {
      mesh: missile,
      vel: dir.multiplyScalar(opts.speed || 45),
      life: opts.life || 3.5,
      damage: opts.damage || 10,
      owner: opts.owner || null,
      kind: "missile",
      target: opts.target || null,
      turn: opts.turn || 2.5
    };
    projectiles.push(proj);
    return proj;
  }

  function fireBolt(fromObj, direction, opts) {
    if (!_scene || !_THREE) return null;
    opts = opts || {};
    var bolt = buildBolt(_THREE, opts.color || "#66ffcc");
    var origin = new _THREE.Vector3();
    fromObj.getWorldPosition(origin);
    if (opts.offset) origin.add(opts.offset);
    bolt.position.copy(origin);
    var dir = direction.clone().normalize();
    bolt.lookAt(origin.clone().add(dir));
    _scene.add(bolt);
    var proj = {
      mesh: bolt,
      vel: dir.multiplyScalar(opts.speed || 70),
      life: opts.life || 1.2,
      damage: opts.damage || 3,
      owner: opts.owner || null,
      kind: "bolt"
    };
    projectiles.push(proj);
    return proj;
  }

  /** Aim turret head at world target */
  function aimTurret(turret, targetPos) {
    if (!turret || !turret.userData.head || !targetPos) return;
    var head = turret.userData.head;
    var world = new _THREE.Vector3();
    turret.getWorldPosition(world);
    var local = targetPos.clone().sub(world);
    // yaw around Y in turret space
    head.lookAt(head.parent.worldToLocal(targetPos.clone()));
  }

  function tickProjectiles(dt, hitTest) {
    if (!_THREE) return;
    for (var i = projectiles.length - 1; i >= 0; i--) {
      var p = projectiles[i];
      p.life -= dt;
      if (p.life <= 0) {
        _scene.remove(p.mesh);
        projectiles.splice(i, 1);
        continue;
      }
      // Homing missiles
      if (p.kind === "missile" && p.target && p.target.position) {
        var to = p.target.position.clone().sub(p.mesh.position).normalize();
        var speed = p.vel.length();
        p.vel.lerp(to.multiplyScalar(speed), Math.min(1, p.turn * dt));
        p.mesh.lookAt(p.mesh.position.clone().add(p.vel));
      }
      p.mesh.position.add(p.vel.clone().multiplyScalar(dt));
      if (typeof hitTest === "function") {
        var hit = hitTest(p);
        if (hit) {
          _scene.remove(p.mesh);
          projectiles.splice(i, 1);
        }
      }
    }
  }

  /**
   * Auto-turret + optional missile logic for an armed ship group.
   * shipRoot: Group with userData.turrets, faction, etc.
   * targets: array of Object3D to consider
   * factionFilter: optional function(target) => bool hostile
   */
  function updateArmedShip(shipRoot, targets, dt, opts) {
    opts = opts || {};
    if (!shipRoot || !shipRoot.userData.armed || !_THREE) return;
    var turrets = shipRoot.userData.turrets || [];
    var shipPos = new _THREE.Vector3();
    shipRoot.getWorldPosition(shipPos);

    // Find nearest valid target
    var best = null;
    var bestD = opts.range || 55;
    (targets || []).forEach(function (t) {
      if (!t || t === shipRoot) return;
      if (opts.factionFilter && !opts.factionFilter(t)) return;
      var d = shipPos.distanceTo(t.position);
      if (d < bestD) {
        bestD = d;
        best = t;
      }
    });

    turrets.forEach(function (tur) {
      tur.userData.cooldown = Math.max(0, (tur.userData.cooldown || 0) - dt);
      if (best) {
        aimTurret(tur, best.position);
        if (tur.userData.cooldown <= 0) {
          var dir = best.position.clone().sub(shipPos).normalize();
          fireBolt(tur.userData.barrel || tur, dir, {
            color: opts.boltColor || shipRoot.userData.color || "#66ffcc",
            owner: shipRoot,
            speed: 65,
            damage: 3
          });
          tur.userData.cooldown = opts.turretRate || 0.45;
        }
      }
    });

    // Missiles less often
    shipRoot.userData.missileCd = Math.max(0, (shipRoot.userData.missileCd || 0) - dt);
    if (best && shipRoot.userData.missileCd <= 0 && bestD < (opts.missileRange || 70)) {
      var mdir = best.position.clone().sub(shipPos).normalize();
      fireMissile(shipRoot, mdir, {
        color: opts.missileColor || "#ff6644",
        owner: shipRoot,
        target: best,
        speed: 38,
        damage: 12
      });
      shipRoot.userData.missileCd = opts.missileRate || 3.5;
    }
  }

  window.ShipModels = {
    CARGO_TYPES: CARGO_TYPES,
    isCargo: isCargo,
    buildShipModel: buildShipModel,
    buildTurret: buildTurret,
    buildMissile: buildMissile,
    buildBolt: buildBolt,
    setScene: setScene,
    fireMissile: fireMissile,
    fireBolt: fireBolt,
    updateArmedShip: updateArmedShip,
    tickProjectiles: tickProjectiles,
    getProjectiles: function () {
      return projectiles;
    }
  };
})();
