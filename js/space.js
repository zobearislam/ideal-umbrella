/* Space Pack — load simulator core (restored from known-good revision) */
(function () {
  "use strict";
  var sources = [
    // Same-origin first (when full file is present again)
    "js/space.core.js",
    // Known-good commit on jsDelivr / GitHub raw
    "https://cdn.jsdelivr.net/gh/zobearislam/ideal-umbrella@e55cc0a50349150d8f7117d4f6c974a809c2bf90/js/space.js",
    "https://raw.githubusercontent.com/zobearislam/ideal-umbrella/e55cc0a50349150d8f7117d4f6c974a809c2bf90/js/space.js"
  ];
  var i = 0;
  function next() {
    if (i >= sources.length) {
      console.error("Space Pack: could not load space core");
      return;
    }
    var src = sources[i++];
    var s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = function () {
      console.log("Space Pack core loaded from", src);
    };
    s.onerror = function () {
      next();
    };
    document.head.appendChild(s);
  }
  next();
})();
