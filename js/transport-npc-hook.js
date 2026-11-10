/** Patch transport page for player fleet + NPC company UI */
(function () {
  "use strict";
  function money(n) {
    return Math.round(n).toLocaleString() + " cr";
  }
  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }
  function systemName(id) {
    var SYSTEMS = (window.UNIVERSE && window.UNIVERSE.SYSTEMS) || [];
    var s = SYSTEMS.find(function (x) { return x.id === id; });
    return s ? s.name : id;
  }

  function renderNpc() {
    var box = document.getElementById("npcCompanyList");
    if (!box || !window.NpcCompanies) return;
    var list = window.NpcCompanies.list();
    var nj = window.NpcCompanies.activeJourneys();
    if (!list.length) {
      box.innerHTML = '<p class="muted">No rival companies seeded yet.</p>';
      return;
    }
    box.innerHTML =
      list
        .map(function (c) {
          var btn = c.forSale
            ? '<button type="button" class="buy-npc" data-id="' + c.id + '">Buyout ' + money(c.price) + "</button>"
            : '<span class="pill">Acquired</span>';
          var shipsLine = c.ships
            .slice(0, 4)
            .map(function (s) {
              return esc(s.name) + " (" + s.status + ")";
            })
            .join(", ");
          return (
            '<article class="item"><strong>' +
            esc(c.name) +
            "</strong><small>" +
            esc(c.faction || "") +
            " · " +
            c.shipCount +
            " ships · Treasury " +
            money(c.credits) +
            " · Deliveries " +
            c.deliveries +
            "</small><p>" +
            esc(shipsLine) +
            (c.shipCount > 4 ? "…" : "") +
            "</p>" +
            btn +
            "</article>"
          );
        })
        .join("") +
      (nj.length
        ? '<p class="hint" style="margin-top:8px">' + nj.length + " NPC ships in transit.</p>"
        : '<p class="hint" style="margin-top:8px">Rival fleets between jobs.</p>');
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".buy-npc");
    if (!btn || !window.NpcCompanies) return;
    var id = btn.getAttribute("data-id");
    var price = window.NpcCompanies.valuation(id);
    if (!confirm("Acquire this company for " + money(price) + "? Ships and treasury transfer to you.")) return;
    var res = window.NpcCompanies.buy(id, "company");
    if (!res.ok) {
      alert(res.error || "Purchase failed");
      return;
    }
    renderNpc();
    if (typeof window.renderTransport === "function") window.renderTransport();
  });

  var orig = window.renderTransport;
  window.renderTransport = function () {
    if (typeof orig === "function") orig();
    var fleet = document.getElementById("fleetList");
    if (fleet && window.GameState) {
      var ships = (window.GameState.getState().ships || []).filter(function (s) {
        return !s.npc && s.owner === "company-1";
      });
      var SHIP_TYPES = window.SHIP_TYPES || {};
      fleet.innerHTML =
        ships
          .map(function (s) {
            return (
              '<article class="item"><strong>' +
              esc(s.name) +
              " · " +
              ((SHIP_TYPES[s.type] && SHIP_TYPES[s.type].name) || s.type) +
              "</strong><small>" +
              esc(systemName(s.location)) +
              " · " +
              esc(s.status) +
              "</small></article>"
            );
          })
          .join("") || '<p class="muted">No ships owned.</p>';
    }
    renderNpc();
  };

  setInterval(renderNpc, 8000);
  setTimeout(function () {
    if (typeof window.renderTransport === "function") window.renderTransport();
    else renderNpc();
  }, 600);
})();
