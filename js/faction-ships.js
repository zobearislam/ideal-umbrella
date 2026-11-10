/**
 * Faction-controlled NPC ships — palette colors from FACTIONS,
 * attitude from IAG / FactionStanding.
 *
 * Call FactionShips.attach(scene, THREE, anchors) once the sim scene exists.
 * anchors: { earth, mars, jupiter, saturn, ... } optional THREE.Object3D
 */
(function () {
  "use strict";

  /** Home body name → faction */
  var HOME = {
    Earth: "terran",
    Luna: "terran",
    Mars: "martian",
    Phobos: "martian",
    Jupiter: "jovian",
    Europa: "jovian",
    Saturn: "jovian",
    Ceres: "belt",
    Neptune: "outer",
    Triton: "outer"
  };

  /** Default fleet roster (id, faction, ship type key, label, home body) */
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
    { id: "npc-pirate-2", faction: "pirate", type: "scout", name: "Corsair Mote", home: "Jupiter" }
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

  function parseHex(hex) {
    hex = String(hex || "#888").replace("#", "");
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var n = parseInt(hex, 16);
    if (isNaN(n)) return 0x888888;
    return n;
  }

  function makeMesh(THREE, type, colorHex) {
    var color = parseHex(colorHex);
    var group = new THREE.Group();
    var bodyMat = new THREE.MeshLambertMaterial({ color: color });
    var accentMat = new THREE.MeshLambertMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.15
    });

    // Hull cone (nose forward = -Z after rotation)
    var hull = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.2, 6), bodyMat);
    hull.rotation.x = Math.PI / 2;
    group.add(hull);

    // Engine glow disc
    var eng = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 0.4, 8), accentMat);
    eng.position.z = 2.2;
    eng.rotation.x = Math.PI / 2;
    group.add(eng);

    // Type silhouette tweaks
    if (type === "hauler" || type === "freighter" || type === "miner") {
      var pod = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 2.5), bodyMat);
      pod.position.z = 0.5;
      group.add(pod);
    }
    if (type === "interceptor") {
      var wingL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 2), accentMat);
      var wingR = wingL.clone();
      wingL.position.set(-1.4, 0, 0.2);
      wingR.position.set(1.4, 0, 0.2);
      group.add(wingL, wingR);
    }

    group.scale.setScalar(type === "freighter" ? 1.4 : type === "scout" ? 0.75 : 1);
    return group;
  }

  var npcList = [];
  var attached = false;
  var _THREE = null;
  var _scene = null;
  var _playerShip = null;
  var _bodiesByName = {};

  function findBody(name) {
    return _bodiesByName[name] || null;
  }

  function attach(scene, THREE, opts) {
    opts = opts || {};
    if (!scene || !THREE) return [];
    if (attached) return npcList;
    attached = true;
    _THREE = THREE;
    _scene = scene;
    _playerShip = opts.playerShip || null;

    if (opts.bodies && opts.bodies.length) {
      opts.bodies.forEach(function (b) {
        if (b.userData && b.userData.name) _bodiesByName[b.userData.name] = b;
      });
    }

    ROSTER.forEach(function (def, i) {
      var col = factionColor(def.faction);
      var mesh = makeMesh(THREE, def.type, col);
      var home = findBody(def.home);
      var angle = (i / ROSTER.length) * Math.PI * 2;
      var radius = 8 + (i % 4) * 3;
      if (home) {
        mesh.position.set(
          home.position.x + Math.cos(angle) * radius,
          0.5 * ((i % 3) - 1),
          home.position.z + Math.sin(angle) * radius
        );
      } else {
        mesh.position.set(40 + Math.cos(angle) * 20, 0, Math.sin(angle) * 20);
      }

      mesh.userData = {
        npc: true,
        id: def.id,
        faction: def.faction,
        name: def.name,
        type: def.type,
        home: def.home,
        color: col,
        orbitAngle: angle,
        orbitRadius: radius,
        orbitSpeed: 0.05 + (i % 5) * 0.01,
        phase: Math.random() * Math.PI * 2
      };

      scene.add(mesh);
      npcList.push(mesh);
    });

    console.log("FactionShips: spawned " + npcList.length + " NPC vessels");
    return npcList;
  }

  function tick(dt) {
    if (!npcList.length) return;
    dt = Math.min(0.05, dt || 0.016);

    npcList.forEach(function (mesh) {
      var u = mesh.userData;
      var home = findBody(u.home);
      u.orbitAngle += u.orbitSpeed * dt;
      u.phase += dt * 0.4;

      var cx = home ? home.position.x : 40;
      var cz = home ? home.position.z : 0;
      var r = u.orbitRadius + Math.sin(u.phase) * 1.5;
      var tx = cx + Math.cos(u.orbitAngle) * r;
      var tz = cz + Math.sin(u.orbitAngle) * r;
      mesh.position.x += (tx - mesh.position.x) * Math.min(1, dt * 2);
      mesh.position.z += (tz - mesh.position.z) * Math.min(1, dt * 2);
      mesh.position.y = Math.sin(u.phase * 0.7) * 0.8;

      // Face travel direction
      mesh.lookAt(tx + Math.cos(u.orbitAngle + 0.2) * r, mesh.position.y, tz + Math.sin(u.orbitAngle + 0.2) * r);

      // Attitude vs player (visual only: slight bob if hostile)
      if (window.IAG && window.IAG.fleetAttitude) {
        var att = window.IAG.fleetAttitude(u.faction);
        if (att.hostile) {
          mesh.position.y += Math.sin(u.phase * 3) * 0.15;
        }
      }
    });
  }

  function nearestNpc(playerPos, maxDist) {
    maxDist = maxDist || 12;
    if (!playerPos || !npcList.length) return null;
    var best = null;
    var bestD = maxDist;
    npcList.forEach(function (m) {
      var d = playerPos.distanceTo(m.position);
      if (d < bestD) {
        bestD = d;
        best = m;
      }
    });
    return best;
  }

  function list() {
    return npcList.map(function (m) {
      return {
        id: m.userData.id,
        name: m.userData.name,
        faction: m.userData.faction,
        type: m.userData.type,
        color: m.userData.color,
        home: m.userData.home
      };
    });
  }

  /**
   * Auto-attach: poll for SpacePack or THREE scene exposed by the sim.
   */
  function tryAutoAttach() {
    if (attached) return true;
    var sp = window.SpacePack;
    if (sp && sp.scene && sp.THREE) {
      attach(sp.scene, sp.THREE, {
        bodies: sp.bodies || [],
        playerShip: sp.ship || null
      });
      if (sp.onTick) {
        var prev = sp.onTick;
        sp.onTick = function (dt) {
          prev(dt);
          tick(dt);
        };
      } else {
        // Fallback timer
        var last = performance.now();
        function loop(now) {
          requestAnimationFrame(loop);
          tick((now - last) / 1000);
          last = now;
        }
        requestAnimationFrame(loop);
      }
      return true;
    }
    return false;
  }

  var tries = 0;
  var auto = setInterval(function () {
    tries++;
    if (tryAutoAttach() || tries > 150) clearInterval(auto);
  }, 200);

  window.FactionShips = {
    ROSTER: ROSTER,
    HOME: HOME,
    attach: attach,
    tick: tick,
    list: list,
    nearest: nearestNpc,
    factionColor: factionColor,
    tryAutoAttach: tryAutoAttach
  };
})();
