// Shared credit balance – single source of truth
export function getCredits() {
  return window.credits || 0;
}

export function setCredits(amount) {
  window.credits = Math.max(0, Math.round(amount));
  // Notify any listeners
  window.dispatchEvent(new CustomEvent("creditsChanged", { detail: window.credits }));
  return window.credits;
}

export function addCredits(amount, reason = "") {
  const next = getCredits() + Math.round(amount);
  setCredits(next);
  if (reason && typeof window.msg === "function") window.msg(reason);
  return next;
}

// Initialize if missing
if (typeof window.credits === "undefined") {
  window.credits = 50000;
}
