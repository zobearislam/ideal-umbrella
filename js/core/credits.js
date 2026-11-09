// Shared credit system – personal + company balances

let personalCredits = 50000;
let companyCredits = {}; // companyId -> balance
let transactions = [];
let nextTxId = 1;

function getPersonalCredits() {
  return personalCredits;
}

function setPersonalCredits(amount) {
  personalCredits = Math.max(0, Math.round(amount));
  window.dispatchEvent(new CustomEvent("creditsChanged", { detail: { type: "personal", amount: personalCredits } }));
  return personalCredits;
}

function addPersonalCredits(amount, reason = "") {
  const next = personalCredits + Math.round(amount);
  setPersonalCredits(next);
  recordTransaction("personal", amount, reason);
  if (reason && typeof window.msg === "function") window.msg(reason);
  return next;
}

function getCompanyCredits(companyId) {
  return companyCredits[companyId] || 0;
}

function setCompanyCredits(companyId, amount) {
  companyCredits[companyId] = Math.max(0, Math.round(amount));
  window.dispatchEvent(new CustomEvent("creditsChanged", { detail: { type: "company", id: companyId, amount: companyCredits[companyId] } }));
  return companyCredits[companyId];
}

function addCompanyCredits(companyId, amount, reason = "") {
  const next = getCompanyCredits(companyId) + Math.round(amount);
  setCompanyCredits(companyId, next);
  recordTransaction(companyId, amount, reason);
  return next;
}

function recordTransaction(account, amount, reason) {
  const tx = {
    id: `tx-${nextTxId++}`,
    account,
    amount: Math.round(amount),
    reason: reason || "",
    timestamp: Date.now()
  };
  transactions.unshift(tx);
  if (transactions.length > 100) transactions.pop();
  return tx;
}

function getTransactions() {
  return transactions.slice();
}

// Backward compatibility
if (typeof window.credits === "undefined") {
  window.credits = personalCredits;
}
Object.defineProperty(window, "credits", {
  get: () => personalCredits,
  set: (v) => setPersonalCredits(v)
});

window.Credits = {
  getPersonal: getPersonalCredits,
  setPersonal: setPersonalCredits,
  addPersonal: addPersonalCredits,
  getCompany: getCompanyCredits,
  setCompany: setCompanyCredits,
  addCompany: addCompanyCredits,
  record: recordTransaction,
  getTransactions,
  getAllCompanyBalances: () => ({ ...companyCredits })
};
