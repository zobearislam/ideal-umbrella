/**
 * Faction-controlled NPC ships — proper models, faction palette,
 * auto-turrets + missiles on non-cargo hulls.
 */
(function () {
  "use strict";

  var ROSTER = [
    { id: "npc-terran-1", faction: "terran", type: "interceptor", name: "TCV Sentinel", home: "Earth" },
    { id: "npc-terran-2", faction: "terran", type: "hauler", name: "TCV Grainlift", home: "Earth" },
    { id: "npc-martian-1", faction: "martian", type: "courier", name: "MRS Red Herald", home: "Mars" },
    { id: "npc-martian-2", faction: "martian", type: "hauler", name: "MRS Dust Road", home: "Mars" },
    { id: "npc-belt-1", faction: "belt", type: "miner", name: "BMU Pickaxe", home: "Mars" },
    { id: "npc-belt-2", faction: "belt", type: "hauler", name: "BMU Orebarge", home: "Mars" },
    { id: "npc-jovian-1", faction: "jovian", type: "freighter", name: "JS Heavy Gas", home: "Jupiter" },
    { id: "npc-jovian-2", faction: "jovian", type: "scout", name: "JS Watcher", home: "Jupiter" },
    { id: "npc-outer-1", faction: "outer", type: "courier", name: "OCL Farline", home: "Neptune" },
    { id: "npc-pirate-1", faction: "pirate", type: "interceptor", name: "Black Needle", home: "Mars" },
    { id: "npc-pirate-2", faction: "pirate", type: "scout", name: "Corsair Mote", home: "Jupiter" },
    { id: "npc-terran-3", faction: "terran", type: "scout", name: "TCV Dart", home: "Earth" },
    { id: "npc-pirate-3", faction: "pirate", type: "interceptor", name: "Reaver Fang", home: "Jupiter" }
  ];

  function factionColor(factionId) {
    var F = window.FACTIONS || {};
    if (F[factionId] && F[factionId].color) return F[factionId].color;
    var fallback = {
      terran: "#4a90d9",
      martian: "#c45c26",
      belt: "#8b7355",
      jovian: "#d4af37",
      outer: "#6b8e6b",
      pirate: "#a33",
      independent: "#888"
    };
    return fallback[factionId] || "#aaa";
  }

  var npcList = [];
  var attached = false;
  var _THREE = null;
  var _scene = null;
  var _bodiesByName = {};
  var _playerShip = null;
  var _tickStarted = false;

  function findBody(name) {
    return _bodiesByName[name] || null;
  }

  function scanBodies(scene) {
    if (!scene || !scene.children) return;
    scene.traverse(function (obj) {
      if (obj.userData && obj.userData.name && obj.isMesh) {
        _bodiesByName[obj.userData.name] = obj;
      }
      // Heuristic: player cone without npc flag
      if (obj.isMesh && obj.geometry && obj.geometry.type === "ConeGeometry" && !obj.userData.npc && !obj.userData.name) {
        if (!_playerShip) _playerShip = obj;
      }
    });
  }

  function buildOne(def, i) {
    var col = factionColor(def.faction);
    var mesh;
    if (window.ShipModels && window.ShipModels.buildShipModel) {
      mesh = window.ShipModels.buildShipModel(_THREE, def.type, col, {});
    } else {
      mesh = new _THREE.Mesh(
        new _THREE.ConeGeometry(1.2, 4, 6),
        new _THREE.MeshLambertMaterial({ color: col })
      );
      mesh.rotation.x = Math.PI / 2;
      mesh.userData.armed = !(window.ShipModels && window.ShipModels.isCargo(def.type));
    }

    var home = findBody(def.home);
    var angle = (i / ROSTER.length) * Math.PI * 2;
    var radius = 10 + (i % 5) * 3;
    if (home) {
      mesh.position.set(
        home.position.x + Math.cos(angle) * radius,
        0.4 * ((i % 3) - 1),
        home.position.z + Math.sin(angle) * radius
      );
    } else {
      mesh.position.set(46 + Math.cos(angle) * 14, 0, Math.sin(angle) * 14);
    }

    mesh.userData.npc = true;
    mesh.userData.id = def.id;
    mesh.userData.faction = def.faction;
    mesh.userData.name = def.name;
    mesh.userData.type = def.type;
    mesh.userData.home = def.home;
    mesh.userData.color = col;
    mesh.userData.orbitAngle = angle;
    mesh.userData.orbitRadius = radius;
    mesh.userData.orbitSpeed = 0.04 + (i % 5) * 0.012;
    mesh.userData.phase = Math.random() * Math.PI * 2;
    mesh.userData.missileCd = 1 + Math.random() * 2;
    mesh.userData.hp = 40 + (def.type === "interceptor" ? 30 : 0);

    return mesh;
  }

  function attach(scene, THREE, opts) {
    opts = opts || {};
    if (!scene || !THREE) return [];
    if (attached) return npcList;
    attached = true;
    _THREE = THREE;
    _scene = scene;
    if (opts.playerShip) _playerShip = opts.playerShip;

    if (opts.bodies && opts.bodies.length) {
      opts.bodies.forEach(function (b) {
        if (b.userData && b.userData.name) _bodiesByName[b.userData.name] = b;
      });
    }
    scanBodies(scene);

    if (window.ShipModels) window.ShipModels.setScene(scene, THREE);

    ROSTER.forEach(function (def, i) {
      var mesh = buildOne(def, i);
      scene.add(mesh);
      npcList.push(mesh);
    });

    startTick();
    console.log("FactionShips: " + npcList.length + " ships with models/turrets/missiles");
    return npcList;
  }

  function hostileTo(ship, other) {
    if (!other || !other.userData) return false;
    var fac = ship.userData.faction;
    // Pirates engage almost everyone; others engage pirates or player if hostile stance
    if (fac === "pirate") {
      if (other.userData.npc && other.userData.faction === "pirate") return false;
      return true;
    }
    if (other.userData.faction === "pirate") return true;
    // Player target: cone without npc
    if (!other.userData.npc && window.IAG && window.IAG.fleetAttitude) {
      var att = window.IAG.fleetAttitude(fac);
      return !!att.hostile;
    }
    return false;
  }

  function gatherTargets(ship) {
    var list = [];
    npcList.forEach(function (n) {
      if (n !== ship) list.push(n);
    });
    if (_playerShip) list.push(_playerShip);
    return list;
  }

  function tick(dt) {
    if (!npcList.length) return;
    dt = Math.min(0.05, dt || 0.016);
    if (_scene) scanBodies(_scene);

    npcList.forEach(function (mesh) {
      var u = mesh.userData;
      var home = findBody(u.home);
      u.orbitAngle += u.orbitSpeed * dt;
      u.phase += dt * 0.4;
      var cx = home ? home.position.x : 46;
      var cz = home ? home.position.z : 0;
      var r = u.orbitRadius + Math.sin(u.phase) * 1.5;
      var tx = cx + Math.cos(u.orbitAngle) * r;
      var tz = cz + Math.sin(u.orbitAngle) * r;
      mesh.position.x += (tx - mesh.position.x) * Math.min(1, dt * 2);
      mesh.position.z += (tz - mesh.position.z) * Math.min(1, dt * 2);
      mesh.position.y = Math.sin(u.phase * 0.7) * 0.8;
      mesh.lookAt(
        tx + Math.cos(u.orbitAngle + 0.2) * r,
        mesh.position.y,
        tz + Math.sin(u.orbitAngle + 0.2) * r
      );

      // Combat: non-cargo only
      if (u.armed && window.ShipModels) {
        window.ShipModels.updateArmedShip(mesh, gatherTargets(mesh), dt, {
          range: 50,
          missileRange: 65,
          turretRate: 0.5,
          missileRate: 4,
          boltColor: u.color,
          missileColor: u.faction === "pirate" ? "#ff4422" : "#ffaa44",
          factionFilter: function (t) {
            return hostileTo(mesh, t);
          }
        });
      }
    });

    if (window.ShipModels) {
      window.ShipModels.tickProjectiles(dt, function (proj) {
        // Soft hit: remove projectile near target ship
        if (!proj.target && proj.kind === "bolt") return false;
        var hit = false;
        var targets = npcList.slice();
        if (_playerShip) targets.push(_playerShip);
        targets.forEach(function (t) {
          if (proj.owner === t) return;
          if (proj.mesh.position.distanceTo(t.position) < 2.2) {
            hit = true;
            if (t.userData && t.userData.hp != null) {
              t.userData.hp -= proj.damage || 3;
            }
          }
        });
        return hit;
      });
    }
  }

  function startTick() {
    if (_tickStarted) return;
    _tickStarted = true;
    var last = performance.now();
    function loop(now) {
      requestAnimationFrame(loop);
      tick((now - last) / 1000);
      last = now;
    }
    requestAnimationFrame(loop);
  }

  function list() {
    return npcList.map(function (m) {
      return {
        id: m.userData.id,
        name: m.userData.name,
        faction: m.userData.faction,
        type: m.userData.type,
        color: m.userData.color,
        home: m.userData.home,
        armed: !!m.userData.armed,
        hp: m.userData.hp
      };
    });
  }

  function tryAutoAttach() {
    if (attached) return true;
    if (window.SpacePack && window.SpacePack.scene && window.SpacePack.THREE) {
      attach(window.SpacePack.scene, window.SpacePack.THREE, {
        bodies: window.SpacePack.bodies || [],
        playerShip: window.SpacePack.ship || null
      });
      return true;
    }
    if (_scene && _THREE) {
      attach(_scene, _THREE, {});
      return true;
    }
    return false;
  }

  function installSceneHook() {
    if (typeof THREE === "undefined" || !THREE.Scene) {
      setTimeout(installSceneHook, 50);
      return;
    }
    if (THREE.Scene.prototype.__factionShipsHooked) return;
    THREE.Scene.prototype.__factionShipsHooked = true;
    var origAdd = THREE.Scene.prototype.add;
    THREE.Scene.prototype.add = function () {
      var ret = origAdd.apply(this, arguments);
      if (!_scene) {
        _scene = this;
        _THREE = THREE;
        setTimeout(function () {
          if (!attached) {
            scanBodies(_scene);
            attach(_scene, THREE, {});
          }
        }, 500);
      }
      return ret;
    };
  }

  installSceneHook();

  var tries = 0;
  var auto = setInterval(function () {
    tries++;
    if (tryAutoAttach() || tries > 200) clearInterval(auto);
  }, 150);

  window.FactionShips = {
    ROSTER: ROSTER,
    attach: attach,
    tick: tick,
    list: list,
    factionColor: factionColor,
    tryAutoAttach: tryAutoAttach
  };
})();
