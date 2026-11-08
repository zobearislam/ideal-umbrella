/* Space Pack bootstrap — loads full simulation body */
(async function () {
  try {
    const res = await fetch("js/space-body.js");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const code = await res.text();
    (0, eval)(code);
  } catch (e) {
    console.error("Failed to load space-body.js", e);
    document.body.insertAdjacentHTML(
      "beforeend",
      '<div style="position:fixed;inset:0;background:#100;color:#f88;padding:24px;font:16px system-ui;z-index:9999">' +
        "<h2>Failed to load simulation</h2><p>" + String(e) + "</p>" +
        "<p>Ensure <code>js/space-body.js</code> is present (expanded star map).</p></div>"
    );
  }
})();
