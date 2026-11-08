/* starmap-extend.js — expands the galaxy to ~200 ly interconnected map
 * Load AFTER js/space.js.
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

  const EXTRA = [
    O("barnard", "Barnard's Star", "star", null, 140000, 0, 0, 0xff6644, { offset: [2.1e9, -1.8e9, 0.6e9] }),
    O("barnard-b", "Barnard b", "planet", "barnard", 5400, 0.03e9, 6.5, 0xaa7755),
    O("barnard-c", "Barnard c", "planet", "barnard", 8200, 0.09e9, 28, 0x887766),
    O("wolf359", "Wolf 359", "star", null, 120000, 0, 0, 0xff4422, { offset: [-1.5e9, 2.4e9, -0.9e9] }),
    O("wolf-b", "Wolf b", "planet", "wolf359", 4800, 0.025e9, 4.2, 0x996655),
    O("eps-eri", "Epsilon Eridani", "star", null, 620000, 0, 0, 0xffaa55, { offset: [3.2e9, 3.8e9, -2.1e9] }),
    O("eps-eri-b", "ε Eri b", "planet", "eps-eri", 10500, 0.11e9, 2500, 0xcc9966),
    O("eps-eri-c", "ε Eri c", "planet", "eps-eri", 7800, 0.28e9, 80, 0x88aa99),
    O("cyg61", "61 Cygni", "star", null, 480000, 0, 0, 0xff8866, { offset: [-4.4e9, 1.2e9, 4.8e9] }),
    O("cyg61-b", "61 Cyg b", "planet", "cyg61", 6100, 0.05e9, 18, 0xaa8877),
    O("procyon", "Procyon", "star", null, 980000, 0, 0, 0xffeebb, { offset: [-3.8e9, -5.2e9, 1.4e9] }),
    O("procyon-b", "Procyon b", "planet", "procyon", 9200, 0.07e9, 20, 0xddcc88),
    O("procyon-c", "Procyon c", "planet", "procyon", 15000, 0.24e9, 72, 0x77aacc),
    O("eps-indi", "Epsilon Indi", "star", null, 520000, 0, 0, 0xff9966, { offset: [1.8e9, -4.6e9, -3.3e9] }),
    O("eps-indi-b", "ε Indi b", "planet", "eps-indi", 7000, 0.06e9, 24, 0xbb9977),
    O("tau-ceti", "Tau Ceti", "star", null, 680000, 0, 0, 0xffcc77, { offset: [5.5e9, -2.8e9, 0.4e9] }),
    O("tau-b", "Tau b", "planet", "tau-ceti", 6400, 0.04e9, 14, 0xcc8866),
    O("tau-e", "Tau e", "planet", "tau-ceti", 8900, 0.12e9, 168, 0x6699cc),
    O("tau-f", "Tau f", "planet", "tau-ceti", 11000, 0.22e9, 640, 0x88aa77),
    O("fomalhaut", "Fomalhaut", "star", null, 1050000, 0, 0, 0xeeffff, { offset: [2.4e9, 6.8e9, 3.1e9] }),
    O("fomalhaut-b", "Fomalhaut b", "planet", "fomalhaut", 12000, 0.18e9, 320, 0xaabbcc),
    O("fomalhaut-c", "Fomalhaut c", "planet", "fomalhaut", 8000, 0.35e9, 1100, 0x99aa88),
    O("denebola", "Denebola", "star", null, 900000, 0, 0, 0xaaccff, { offset: [-6.5e9, 4.0e9, -4.2e9] }),
    O("denebola-b", "Denebola b", "planet", "denebola", 9500, 0.09e9, 30, 0xccbb99),
    O("pollux", "Pollux", "star", null, 1150000, 0, 0, 0xffaa66, { offset: [-9.2e9, -3.5e9, 5.0e9] }),
    O("pollux-b", "Pollux b", "planet", "pollux", 16000, 0.16e9, 590, 0xddaa77),
    O("pollux-c", "Pollux c", "planet", "pollux", 7200, 0.30e9, 120, 0x88bbcc),
    O("castor", "Castor", "star", null, 1000000, 0, 0, 0xbbddff, { offset: [-10.5e9, -1.2e9, 6.4e9] }),
    O("castor-b", "Castor b", "planet", "castor", 8800, 0.08e9, 25, 0xaabb99),
    O("arcturus", "Arcturus", "star", null, 1300000, 0, 0, 0xff7744, { offset: [8.8e9, 5.5e9, -6.0e9] }),
    O("arcturus-b", "Arcturus b", "planet", "arcturus", 14000, 0.14e9, 45, 0xcc9966),
    O("arcturus-c", "Arcturus c", "planet", "arcturus", 10000, 0.40e9, 200, 0x7799aa),
    O("capella", "Capella", "star", null, 1250000, 0, 0, 0xffcc66, { offset: [11.0e9, -2.0e9, 3.5e9] }),
    O("capella-b", "Capella b", "planet", "capella", 11000, 0.12e9, 38, 0xddbb88),
    O("capella-c", "Capella c", "planet", "capella", 17000, 0.32e9, 140, 0x66aacc),
    O("aldebaran", "Aldebaran", "star", null, 1400000, 0, 0, 0xff6633, { offset: [12.5e9, 4.8e9, -8.2e9] }),
    O("aldebaran-b", "Aldebaran b", "planet", "aldebaran", 18000, 0.20e9, 90, 0xcc8855),
    O("aldebaran-c", "Aldebaran c", "planet", "aldebaran", 9000, 0.45e9, 260, 0x8899bb),
    O("regulus", "Regulus", "star", null, 1180000, 0, 0, 0x99bbff, { offset: [-12.0e9, 7.5e9, 2.8e9] }),
    O("regulus-b", "Regulus b", "planet", "regulus", 13000, 0.15e9, 55, 0xaaccdd),
    O("regulus-c", "Regulus c", "planet", "regulus", 7500, 0.38e9, 180, 0x99aa77)
  ];

  const EXTRA_GATES = [
    { id: "sol-gate-6", name: "Sol Gate 6", parent: "sun", a: 42 * 149.6e6, P: 365 * 42, dest: "gate-tau-sol", faction: "tau_colony" },
    { id: "sol-gate-7", name: "Sol Gate 7", parent: "sun", a: 42 * 149.6e6, P: 365 * 42, dest: "gate-vega-sol", faction: "vega_co" },
    { id: "sol-gate-8", name: "Sol Gate 8", parent: "sun", a: 44 * 149.6e6, P: 365 * 44, dest: "gate-altair-sol", faction: "independent" },
    { id: "gate-barnard-sol", name: "Barnard–Sol Gate", parent: "barnard", a: 55000, P: 0.6, dest: "sol-gate-3", faction: "barnard_free" },
    { id: "gate-eps-eri-sol", name: "ε Eri–Sol Gate", parent: "eps-eri", a: 70000, P: 0.9, dest: "sol-gate-4", faction: "eri_trade" },
    { id: "gate-procyon-sol", name: "Procyon–Sol Gate", parent: "procyon", a: 75000, P: 1.0, dest: "sol-gate-5", faction: "procyon_corp" },
    { id: "gate-tau-sol", name: "Tau Ceti–Sol Gate", parent: "tau-ceti", a: 68000, P: 0.85, dest: "sol-gate-6", faction: "tau_colony" },
    { id: "gate-alpha-barnard", name: "Alpha–Barnard Gate", parent: "alpha-cen", a: 95000, P: 1.1, dest: "gate-barnard-alpha", faction: "alphaco" },
    { id: "gate-barnard-alpha", name: "Barnard–Alpha Gate", parent: "barnard", a: 60000, P: 0.7, dest: "gate-alpha-barnard", faction: "barnard_free" },
    { id: "gate-barnard-wolf", name: "Barnard–Wolf Gate", parent: "barnard", a: 72000, P: 0.75, dest: "gate-wolf-barnard", faction: "barnard_free" },
    { id: "gate-wolf-barnard", name: "Wolf–Barnard Gate", parent: "wolf359", a: 48000, P: 0.55, dest: "gate-barnard-wolf", faction: "independent" },
    { id: "gate-wolf-eps-eri", name: "Wolf–ε Eri Gate", parent: "wolf359", a: 52000, P: 0.6, dest: "gate-eps-eri-wolf", faction: "independent" },
    { id: "gate-eps-eri-wolf", name: "ε Eri–Wolf Gate", parent: "eps-eri", a: 78000, P: 0.95, dest: "gate-wolf-eps-eri", faction: "eri_trade" },
    { id: "gate-eps-eri-tau", name: "ε Eri–Tau Gate", parent: "eps-eri", a: 85000, P: 1.05, dest: "gate-tau-eps-eri", faction: "eri_trade" },
    { id: "gate-tau-eps-eri", name: "Tau–ε Eri Gate", parent: "tau-ceti", a: 72000, P: 0.9, dest: "gate-eps-eri-tau", faction: "tau_colony" },
    { id: "gate-tau-eps-indi", name: "Tau–ε Indi Gate", parent: "tau-ceti", a: 80000, P: 1.0, dest: "gate-eps-indi-tau", faction: "tau_colony" },
    { id: "gate-eps-indi-tau", name: "ε Indi–Tau Gate", parent: "eps-indi", a: 58000, P: 0.7, dest: "gate-tau-eps-indi", faction: "independent" },
    { id: "gate-procyon-sirius", name: "Procyon–Sirius Gate", parent: "procyon", a: 82000, P: 1.1, dest: "gate-sirius-procyon", faction: "procyon_corp" },
    { id: "gate-sirius-procyon", name: "Sirius–Procyon Gate", parent: "sirius", a: 98000, P: 1.3, dest: "gate-procyon-sirius", faction: "siriusmin" },
    { id: "gate-sirius-61cyg", name: "Sirius–61 Cyg Gate", parent: "sirius", a: 105000, P: 1.4, dest: "gate-61cyg-sirius", faction: "siriusmin" },": "siriusmin" },
    { id: "gate-61cyg-sirius", name: "61 Cyg–Sirius Gate", parent: "cyg61", a: 62000, P: 0.8, dest: "gate-sirius-61cyg", faction: "independent" },
    { id: "gate-altair-vega", name: "Altair–Vega Gate", parent: "altair", a: 88000, P: 1.15, dest: "gate-vega-altair", faction: "independent" },
    { id: "gate-vega-altair", name: "Vega–Altair Gate", parent: "vega", a: 92000, P: 1.2, dest: "gate-altair-vega", faction: "vega_co" },
    { id: "gate-vega-fomalhaut", name: "Vega–Fomalhaut Gate", parent: "vega", a: 110000, P: 1.4, dest: "gate-fomalhaut-vega", faction: "vega_co" },
    { id: "gate-fomalhaut-vega", name: "Fomalhaut–Vega Gate", parent: "fomalhaut", a: 90000, P: 1.1, dest: "gate-vega-fomalhaut", faction: "fomalhaut_watch" },
    { id: "gate-fomalhaut-sol", name: "Fomalhaut–Sol Gate", parent: "fomalhaut", a: 95000, P: 1.15, dest: "sol-gate-7", faction: "fomalhaut_watch" },
    { id: "gate-pollux-capella", name: "Pollux–Capella Gate", parent: "pollux", a: 70000, P: 0.9, dest: "gate-capella-pollux", faction: "independent" },
    { id: "gate-capella-pollux", name: "Capella–Pollux Gate", parent: "capella", a: 85000, P: 1.05, dest: "gate-pollux-capella", faction: "independent" },
    { id: "gate-capella-arcturus", name: "Capella–Arcturus Gate", parent: "capella", a: 100000, P: 1.25, dest: "gate-arcturus-capella", faction: "independent" },
    { id: "gate-arcturus-capella", name: "Arcturus–Capella Gate", parent: "arcturus", a: 120000, P: 1.5, dest: "gate-capella-arcturus", faction: "arcturus_guild" },
    { id: "gate-arcturus-sol", name: "Arcturus–Sol Gate", parent: "arcturus", a: 130000, P: 1.6, dest: "sol-gate-2", faction: "arcturus_guild" },
    { id: "gate-pollux-procyon", name: "Pollux–Procyon Gate", parent: "pollux", a: 75000, P: 0.95, dest: "gate-procyon-pollux", faction: "independent" },
    { id: "gate-procyon-pollux", name: "Procyon–Pollux Gate", parent: "procyon", a: 90000, P: 1.2, dest: "gate-pollux-procyon", faction: "procyon_corp" },
    { id: "gate-aldebaran-capella", name: "Aldebaran–Capella Gate", parent: "aldebaran", a: 110000, P: 1.3, dest: "gate-capella-aldebaran", faction: "independent" },
    { id: "gate-capella-aldebaran", name: "Capella–Aldebaran Gate", parent: "capella", a: 115000, P: 1.35, dest: "gate-aldebaran-capella", faction: "independent" },
    { id: "gate-regulus-aldebaran", name: "Regulus–Aldebaran Gate", parent: "regulus", a: 100000, P: 1.2, dest: "gate-aldebaran-regulus", faction: "outer" },
    { id: "gate-aldebaran-regulus", name: "Aldebaran–Regulus Gate", parent: "aldebaran", a: 125000, P: 1.45, dest: "gate-regulus-aldebaran", faction: "independent" },
    { id: "gate-regulus-arcturus", name: "Regulus–Arcturus Gate", parent: "regulus", a: 130000, P: 1.55, dest: "gate-arcturus-regulus", faction: "outer" },
    { id: "gate-arcturus-regulus", name: "Arcturus–Regulus Gate", parent: "arcturus", a: 140000, P: 1.7, dest: "gate-regulus-arcturus", faction: "arcturus_guild" },
    { id: "gate-denebola-regulus", name: "Denebola–Regulus Gate", parent: "denebola", a: 88000, P: 1.1, dest: "gate-regulus-denebola", faction: "independent" },
    { id: "gate-regulus-denebola", name: "Regulus–Denebola Gate", parent: "regulus", a: 92000, P: 1.15, dest: "gate-denebola-regulus", faction: "outer" },
    { id: "gate-denebola-vega", name: "Denebola–Vega Gate", parent: "denebola", a: 95000, P: 1.2, dest: "gate-vega-denebola", faction: "independent" },
    { id: "gate-vega-denebola", name: "Vega–Denebola Gate", parent: "vega", a: 100000, P: 1.25, dest: "gate-denebola-vega", faction: "vega_co" },
    { id: "gate-castor-pollux", name: "Castor–Pollux Gate", parent: "castor", a: 60000, P: 0.8, dest: "gate-pollux-castor", faction: "independent" },
    { id: "gate-pollux-castor", name: "Pollux–Castor Gate", parent: "pollux", a: 65000, P: 0.85, dest: "gate-castor-pollux", faction: "independent" },
    { id: "gate-tau-procyon", name: "Tau–Procyon Gate", parent: "tau-ceti", a: 90000, P: 1.1, dest: "gate-procyon-tau", faction: "tau_colony" },
    { id: "gate-procyon-tau", name: "Procyon–Tau Gate", parent: "procyon", a: 86000, P: 1.05, dest: "gate-tau-procyon", faction: "procyon_corp" }
  ];

  const existingIds = new Set(PACK.objects.map(o => o.id));
  for (const o of EXTRA) {
    if (!existingIds.has(o.id)) {
      PACK.objects.push(o);
      existingIds.add(o.id);
    }
  }

  if (typeof GATES !== "undefined" && Array.isArray(GATES)) {
    const gids = new Set(GATES.map(g => g.id));
    for (const g of EXTRA_GATES) {
      if (!gids.has(g.id)) {
        GATES.push(g);
        gids.add(g.id);
      }
    }
  }

  if (typeof GATES !== "undefined") {
    const retarget = {
      "sol-gate-3": "gate-barnard-sol",
      "sol-gate-4": "gate-eps-eri-sol",
      "sol-gate-5": "gate-procyon-sol"
    };
    for (const g of GATES) {
      if (retarget[g.id]) g.dest = retarget[g.id];
    }
  }

  console.info("[starmap-extend] Nearby systems + cross-link gates registered on PACK/GATES.");
})();
