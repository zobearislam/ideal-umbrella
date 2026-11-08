/* starmap-extend.js — expands the galaxy toward a ~200 ly interconnected map
 * Load AFTER js/space.js.
 * Note: for full 3D integration of new systems, use the expanded space.js (objects built at load).
 */
(function () {
  "use strict";
  if (typeof PACK === "undefined" || typeof O !== "function") {
    console.warn("starmap-extend: PACK/O not found — load after space.js");
    return;
  }

  Object.assign(FACTIONS, {
    barnard_free: { name: "Barnard Freeholds", color: 0xc4a574, desc: "Independent settlers of Barnard's Star" },
    eri_trade: { name: "Eridani Trade League", color: 0x7ec8a3, desc: "Epsilon Eridani merchant houses" },
    tau_colony: { name: "Tau Ceti Colonies", color: 0x9ad0e6, desc: "Early colony federation at Tau Ceti" },
    procyon_corp: { name: "Procyon Industrial", color: 0xe8d48b, desc: "Heavy industry around Procyon" },
    arcturus_guild: { name: "Arcturus Guild", color: 0xff9966, desc: "Ancient trade hub of Arcturus" },
    fomalhaut_watch: { name: "Fomalhaut Watch", color: 0xaabbff, desc: "Outer-system observatories" }
  });
  if (typeof factionRep !== "undefined") {
    Object.assign(factionRep, {
      barnard_free: 20, eri_trade: 25, tau_colony: 30,
      procyon_corp: 15, arcturus_guild: 10, fomalhaut_watch: 20
    });
  }

  console.info("[starmap-extend] Extra factions registered. Prefer expanded space.js for full system mesh.");
})();
