/* Space Pack entry — load core then integrations */
(function () {
  "use strict";
  var sources = [
    "js/space.core.js",
    "https://cdn.jsdelivr.net/gh/zobearislam/ideal-umbrella@e55cc0a50349150d8f7117d4f6c974a809c2bf90/js/space.js",
    "https://raw.githubusercontent.com/zobearislam/ideal-umbrella/e55cc0a50349150d8f7117d4f6c974a809c2bf90/js/space.js"
  ];
  var i = 0;
  function next() {
    if (i >= sources.length) {
      console.error("Space Pack: could not load core");
      return;
    }
    var src = sources[i++];
    var s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = function () {
      console.log("Space Pack core from", src);
      // After CDN fallback, still try to attach faction ships if SpacePack appears
      if (window.FactionShips) window.FactionShips.tryAutoAttach();
    };
    s.onerror = function () {
      next();
    };
    document.head.appendChild(s);
  }
  next();
})();
