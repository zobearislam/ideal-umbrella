/**
 * Bridges simulator trade/rep to hidden faction standings:
 * goodwill, trust, love, honour, spite.
 * Load after faction-standing.js; waits if space.js loads async.
 */
(function () {
  "use strict";

  function localFaction() {
    return "terran";
  }

  function basePrice(type) {
    var R = window.RESOURCES || {};
    if (R[type] && R[type].basePrice) return R[type].basePrice;
    return 40;
  }

  function refreshStationBits() {
    var panel = document.getElementById("stationPanel");
    if (!panel || panel.style.display === "none") return;
    var el = document.getElementById("stationRep");
    if (el && window.FactionStanding) {
      var st = window.FactionStanding.stance(localFaction());
      el.textContent =
        "Standing: " +
        st.mood +
        " · goodwill " +
        Math.round(st._standing.goodwill) +
        " · sell x" +
        st.sellMult.toFixed(2) +
        " / buy x" +
        st.buyMult.toFixed(2);
    }
    var invEl = document.getElementById("stationInventory");
    if (invEl && window.inventory) {
      var lines = Object.entries(window.inventory).filter(function (e) {
        return e[1] > 0;
      });
      invEl.innerHTML = lines.length
        ? lines
            .map(function (e) {
              var t = e[0],
                q = e[1];
              var price = window.FactionStanding.sellPrice(basePrice(t), localFaction());
              return (
                '<div class="cargo-line"><span>' +
                t +
                " × " +
                q +
                " (" +
                price +
                ' cr ea)</span><button type="button" class="brass-btn" data-act="sell-hold" data-type="' +
                t +
                '" data-qty="1">Sell 1</button> <button type="button" class="brass-btn" data-act="sell-hold" data-type="' +
                t +
                '" data-qty="' +
                q +
                '">Sell all</button></div>'
              );
            })
            .join("")
        : "<em>Hold empty.</em>";
    }
  }

  function wire() {
    if (!window.FactionStanding) return false;
    if (typeof window.changeRep !== "function") return false;

    window.changeRep = function (delta, factionId) {
      var fid = factionId || localFaction();
      var amount = Number(delta) || 0;
      var row = window.FactionStanding.applyRepEvent(fid, amount, "rep");
      if (window.Economy && window.Economy.changeReputation) {
        try {
          window.Economy.changeReputation(fid, amount);
        } catch (e) {}
      }
      return row.goodwill;
    };

    window.sellHold = function (type, qty) {
      qty = Math.max(1, Math.floor(Number(qty) || 1));
      var have = (window.inventory && window.inventory[type]) || 0;
      if (have < qty) {
        alert("Not enough " + type);
        return;
      }
      window.inventory[type] = have - qty;
      var unit = window.FactionStanding.sellPrice(basePrice(type), localFaction());
      var gained = unit * qty;
      if (window.Credits) window.Credits.addPersonal(gained, "Sold " + qty + " " + type);
      else window.credits = (window.credits || 0) + gained;
      window.FactionStanding.applyRepEvent(localFaction(), 0.5, "trade");
      if (window.GameState) {
        if (window.GameState.syncInventoryFromWindow) window.GameState.syncInventoryFromWindow();
        if (window.GameState.saveState) window.GameState.saveState();
      }
      refreshStationBits();
      if (typeof window.msg === "function") {
        window.msg("Sold " + qty + " " + type + " for " + gained + " cr");
      }
    };

    console.log("standing-bridge active — goodwill/trust/love/honour/spite");
    return true;
  }

  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    if (wire() || tries > 100) clearInterval(timer);
  }, 100);
})();
