/* Space Pack bootstrap — loads expanded sim body in parts */
(async function () {
  try {
    const parts = ["js/space-body.part0.js", "js/space-body.part1.js", "js/space-body.part2.js"];
    const texts = await Promise.all(parts.map(async (p) => {
      const res = await fetch(p);
      if (!res.ok) throw new Error(p + " HTTP " + res.status);
      return res.text();
    }));
    (0, eval)(texts.join(""));
  } catch (e) {
    console.error("Failed to load space body", e);
    document.body.insertAdjacentHTML(
      "beforeend",
      '<div style="position:fixed;inset:0;background:#100;color:#f88;padding:24px;font:16px system-ui;z-index:9999">' +
        "<h2>Failed to load simulation</h2><p>" + String(e) + "</p></div>"
    );
  }
})();
