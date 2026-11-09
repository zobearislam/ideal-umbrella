/**
 * Simple game clock (non-module, shared global).
 * Fixed: previous version used ES module exports and failed when loaded as a classic script.
 */
(function () {
  "use strict";

  class GameClock {
    constructor() {
      this.lastUpdate = Date.now();
      this.elapsedSeconds = 0;
    }

    update() {
      const now = Date.now();
      const delta = Math.max(0, (now - this.lastUpdate) / 1000);
      this.elapsedSeconds += delta;
      this.lastUpdate = now;
      return delta;
    }

    getTime() {
      return this.elapsedSeconds;
    }

    save() {
      return {
        elapsedSeconds: this.elapsedSeconds,
        savedAt: Date.now()
      };
    }

    load(data) {
      if (!data) return;
      this.elapsedSeconds = Math.max(0, Number(data.elapsedSeconds) || 0);
      const offlineSeconds = Math.max(
        0,
        (Date.now() - Number(data.savedAt || Date.now())) / 1000
      );
      this.elapsedSeconds += Math.min(offlineSeconds, 86400);
      this.lastUpdate = Date.now();
    }
  }

  const gameClock = new GameClock();
  window.GameClock = GameClock;
  window.gameClock = gameClock;
})();
