/**
 * Bridges simulator trade/rep to hidden faction standings
 * (goodwill, trust, love, honour, spite). Load after space.js + faction-standing.js
 */
(function () {
  "use strict";
  if (!window.FactionStanding) {
    console.warn("standing-bridge: FactionStanding missing");
    return;
  }

  const localFaction = function () { return "terran"; };

  window.changeRep = function (delta, factionId) {
    const fid = factionId || localFaction();
    const amount = Number(delta) || 0;
    const row = window.FactionStanding.applyRepEvent(fid, amount, "rep");
    if (window.Economy && window.Economy.changeReputation) {
      try { window.Economy.changeReputation(fid, amount); } catch (e) {}
    }
    return row.goodwill;
  };

  const basePrice = function (type) {
    const R = window.RESOURCES || {};
    if (R[type] && R[type].basePrice) return R[type].basePrice;
    return 40;
  };

  window.sellHold = function (type, qty) {
    qty = Math.max(1, Math.floor(Number(qty) || 1));
    const have = (window.inventory && window.inventory[type]) || 0;
    if (have < qty) {
      alert("Not enough " + type);
      return;
    }
    window.inventory[type] = have - qty;
    const unit = window.FactionStanding.sellPrice(basePrice(type), localFaction());
    const gained = unit * qty;
    if (window.Credits) window.Credits.addPersonal(gained, "Sold " + qty + " " + type);
    else window.credits = (window.credits || 0) + gained;
    window.FactionStanding.applyRepEvent(localFaction(), 0.5, "trade");
    if (window.GameState) {
      if (window.GameState.syncInventoryFromWindow) window.GameState.syncInventoryFromWindow();
      if (window.GameState.saveState) window.GameState.saveState();
    }
    const panel = document.getElementById("stationPanel");
    if (panel && panel.style.display !== "none") {
      const el = document.getElementById("stationRep");
      if (el) {
        const st = window.FactionStanding.stance(localFaction());
        el.textContent =
          "Standing: " + st.mood + " · goodwill " + Math.round(st._standing.goodwill) +
          " · sell x" + st.sellMult.toFixed(2);
      }
      const invEl = document.getElementById("stationInventory");
      if (invEl && window.inventory) {
        const lines = Object.entries(window.inventory).filter(function (e) { return e[1] > 0; });
        invEl.innerHTML = lines.length
          ? lines.map(function (e) {
              var t = e[0], q = e[1];
              var price = window.FactionStanding.sellPrice(basePrice(t), localFaction());
              return '<div class="cargo-line"><span>' + t + " × " + q + " (" + price +
                ' cr ea)</span><button type="button" class="brass-btn" data-act="sell-hold" data-type="' +
                t + '" data-qty="1">Sell 1</button> <button type="button" class="brass-btn" data-act="sell-hold" data-type="' +
                t + '" data-qty="' + q + '">Sell all</button></div>';
            }).join("")
          : "<em>Hold empty.</em>";
      }
      var cr = document.getElementById("stationCredits");
      if (cr && window.Credits) {
        cr.innerHTML =
          "<strong>Personal:</strong> " + window.Credits.getPersonal().toLocaleString() +
          " cr · <strong>Company:</strong> " +
          (window.Credits.getCompany("company-1") || 0).toLocaleString() + " cr";
      }
    }
    if (typeof window.msg === "function") window.msg("Sold " + qty + " " + type + " for " + gained + " cr");
  };

  console.log("standing-bridge active — hidden goodwill/trust/love/honour/spite");
})();
