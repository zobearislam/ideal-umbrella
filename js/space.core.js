/* Assemble space core from parts */
(async function () {
  try {
    var urls = ["js/space-core-parts/0.js", "js/space-core-parts/1.js", "js/space-core-parts/2.js", "js/space-core-parts/3.js"];
    var parts = await Promise.all(urls.map(function (u) {
      return fetch(u).then(function (r) {
        if (!r.ok) throw new Error(u);
        return r.text();
      });
    }));
    var s = document.createElement("script");
    s.textContent = parts.join("");
    document.head.appendChild(s);
    console.log("space.core assembled from", urls.length, "parts");
  } catch (e) {
    console.warn("space.core assemble failed", e);
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/gh/zobearislam/ideal-umbrella@e55cc0a50349150d8f7117d4f6c974a809c2bf90/js/space.js";
    document.head.appendChild(s);
  }
})();
