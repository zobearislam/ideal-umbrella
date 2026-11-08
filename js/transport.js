(() => {
  "use strict";

  const SAVE_KEY = "spacePack.transportPrototype.v1";
  const DAY = 24 * 60 * 60 * 1000;

  // Canonical system IDs (matches shared universe + simulator)
  const SYSTEMS = [
    {id:"sol",name:"Sol",x:.18,y:.48,stations:["Earth Orbital Port","Luna Depot"]},
    {id:"alpha-cen",name:"Alpha Centauri",x:.39,y:.22,stations:["New Horizon"]},
    {id:"sirius",name:"Sirius",x:.61,y:.42,stations:["Sirius Exchange"]},
    {id:"vega",name:"Vega",x:.78,y:.18,stations:["Vega Trade Hub"]},
    {id:"altair",name:"Altair",x:.48,y:.76,stations:["Altair Foundry"]},
    {id:"rigel",name:"Rigel",x:.85,y:.72,stations:["Rigel Research Port"]},
    {id:"kepler",name:"Kepler",x:.22,y:.82,stations:["Kepler Colony"]}
  ];

  const SHIP_TYPES = {
    courier:{name:"Courier",price:12000,capacity:10,speed:1.25,maintenance:35},
    hauler:{name:"Hauler",price:25000,capacity:35,speed:1,maintenance:65},
    freighter:{name:"Freighter",price:50000,capacity:100,speed:.75,maintenance:110}
  };

  function getSharedCredits() {
    return window.credits || 0;
  }
  function setSharedCredits(n) {
    window.credits = Math.max(0, Math.round(n));
    return window.credits;
  }

  const starter = () => ({
    credits: getSharedCredits() || 50000,
    completed:0, nextShip:2, nextJourney:1,
    ships:[{id:"ship-1",name:"Wayfarer",type:"hauler",location:"sol",status:"Idle"}],
    contracts:[
      {id:"C-101",from:"sol",to:"alpha-cen",cargo:"Machine parts",quantity:8,reward:5200},
      {id:"C-102",from:"sirius",to:"vega",cargo:"Research supplies",quantity:6,reward:6800},
      {id:"C-103",from:"altair",to:"rigel",cargo:"Refined metals",quantity:25,reward:11200},
      {id:"C-104",from:"kepler",to:"sol",cargo:"Ice containers",quantity:30,reward:9000}
    ],
    journeys:[],transactions:[]
  });

  let state = load();
  if (typeof window.credits === "number") state.credits = window.credits;

  let selectedSystem = "sol";
  const $ = id => document.getElementById(id);
  const money = n => `${Math.round(n).toLocaleString()} cr`;
  const systemName = id => SYSTEMS.find(s=>s.id===id)?.name || id;
  const now = () => Date.now();

  function load(){
    try {
      const raw=localStorage.getItem(SAVE_KEY);
      if(!raw) return starter();
      const parsed=JSON.parse(raw);
      if(!parsed || !Array.isArray(parsed.ships) || !Array.isArray(parsed.contracts)) return starter();
      for (const c of parsed.contracts || []) {
        if (c.from === "alpha") c.from = "alpha-cen";
        if (c.to === "alpha") c.to = "alpha-cen";
      }
      for (const s of parsed.ships || []) {
        if (s.location === "alpha") s.location = "alpha-cen";
      }
      return parsed;
    } catch { return starter(); }
  }
  function save(){
    state.savedAt=new Date().toISOString();
    setSharedCredits(state.credits);
    localStorage.setItem(SAVE_KEY,JSON.stringify(state));
    if ($("savedAt")) $("savedAt").textContent=new Date(state.savedAt).toLocaleString();
  }
  function log(text){
    state.transactions.unshift({at:now(),text});
    state.transactions=state.transactions.slice(0,30);
  }
  function distance(a,b){
    const A=SYSTEMS.find(s=>s.id===a),B=SYSTEMS.find(s=>s.id===b);
    if (!A || !B) return 50;
    return Math.hypot((A.x-B.x)*100,(A.y-B.y)*100);
  }
  function travelMs(ship,contract){
    const d=distance(contract.from,contract.to);
    return Math.max(60_000, d*120_000/SHIP_TYPES[ship.type].speed);
  }
  function processArrivals(){
    const t=now();
    for(const j of state.journeys.filter(x=>x.status==="In transit" && x.arrivesAt<=t)){
      const ship=state.ships.find(s=>s.id===j.shipId);
      if(!ship) continue;
      ship.location=j.to; ship.status="Idle";
      j.status="Delivered"; j.deliveredAt=t;
      state.credits+=j.reward; state.completed++;
      setSharedCredits(state.credits);
      log(`${ship.name} delivered ${j.cargo} to ${systemName(j.to)}. +${money(j.reward)}.`);
      state.contracts=state.contracts.filter(c=>c.id!==j.contractId);
    }
  }
  function render(){
    processArrivals();
    if ($("credits")) $("credits").textContent=money(state.credits);
    if ($("deliveries")) $("deliveries").textContent=state.completed;
    if ($("savedAt")) $("savedAt").textContent=state.savedAt?new Date(state.savedAt).toLocaleString():"Not saved yet";
    if ($("clock")) $("clock").textContent=new Date().toLocaleString();
    if ($("fleetList")) $("fleetList").innerHTML=state.ships.map(s=>`<article class="item"><strong>${esc(s.name)} · ${SHIP_TYPES[s.type].name}</strong><small>${esc(systemName(s.location))} · ${esc(s.status)} · Capacity ${SHIP_TYPES[s.type].capacity}</small></article>`).join("") || `<p class="muted">No ships owned.</p>`;
    if ($("contractList")) $("contractList").innerHTML=state.contracts.map(c=>`<article class="item"><strong>${esc(c.id)} · ${esc(c.cargo)}</strong><small>${esc(systemName(c.from))} → ${esc(systemName(c.to))}</small><p>${c.quantity} units · Reward ${money(c.reward)}</p></article>`).join("") || `<p class="muted">No contracts available.</p>`;
    if ($("journeyList")) $("journeyList").innerHTML=state.journeys.filter(j=>j.status==="In transit").map(j=>`<article class="item"><strong>${esc(j.shipName)} · ${esc(j.contractId)}</strong><small>${esc(systemName(j.from))} → ${esc(systemName(j.to))}</small><p>${esc(j.cargo)} · Arrives ${new Date(j.arrivesAt).toLocaleString()}</p></article>`).join("") || `<p class="muted">No ships currently travelling.</p>`;
    const c=$("contractSelect"), oldC=c&&c.value;
    if (c) {
      c.innerHTML=state.contracts.map(x=>`<option value="${x.id}">${x.id}: ${esc(systemName(x.from))} → ${esc(systemName(x.to))}</option>`).join("");
      if(state.contracts.some(x=>x.id===oldC)) c.value=oldC;
    }
    const s=$("shipSelect"),oldS=s&&s.value;
    if (s) {
      s.innerHTML=state.ships.filter(x=>x.status==="Idle").map(x=>`<option value="${x.id}">${esc(x.name)} (${SHIP_TYPES[x.type].name}, ${esc(systemName(x.location))})</option>`).join("");
      if(state.ships.some(x=>x.id===oldS && x.status==="Idle")) s.value=oldS;
    }
    drawMap(); save();
  }
  function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

  function drawMap(){
    const canvas=$("galaxyMap"); if (!canvas) return;
    const ctx=canvas.getContext("2d");
    const rect=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
    canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const w=rect.width,h=rect.height;
    ctx.fillStyle="#071321";ctx.fillRect(0,0,w,h);
    for(let i=0;i<90;i++){const x=(i*97%997)/997*w,y=(i*193%991)/991*h;ctx.fillStyle="#6685a3";ctx.globalAlpha=.35;ctx.fillRect(x,y,1.5,1.5);}
    ctx.globalAlpha=1;
    const links=[["sol","alpha-cen"],["alpha-cen","sirius"],["sirius","vega"],["alpha-cen","altair"],["altair","rigel"],["sol","kepler"],["sirius","rigel"]];
    for(const [a,b] of links){
      const A=SYSTEMS.find(s=>s.id===a),B=SYSTEMS.find(s=>s.id===b);
      if (!A||!B) continue;
      ctx.strokeStyle="#31516e";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(A.x*w,A.y*h);ctx.lineTo(B.x*w,B.y*h);ctx.stroke();
    }
    for(const sys of SYSTEMS){
      const x=sys.x*w,y=sys.y*h,active=selectedSystem===sys.id;
      ctx.beginPath();ctx.arc(x,y,active?8:5,0,Math.PI*2);ctx.fillStyle=active?"#8ee0b2":"#67d7ee";ctx.fill();
      if(active){ctx.beginPath();ctx.arc(x,y,13,0,Math.PI*2);ctx.strokeStyle="#8ee0b2";ctx.stroke();}
      ctx.font="12px system-ui";ctx.fillStyle="#dceaff";ctx.fillText(sys.name,x+11,y-9);
    }
  }

  if ($("galaxyMap")) $("galaxyMap").addEventListener("click",e=>{
    const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    let nearest=null,best=.035;
    for(const s of SYSTEMS){const d=Math.hypot(s.x-x,s.y-y);if(d<best){best=d;nearest=s;}}
    if(nearest){selectedSystem=nearest.id;drawMap();}
  });
  if ($("buyShipForm")) $("buyShipForm").addEventListener("submit",e=>{
    e.preventDefault();const type=$("shipType").value,def=SHIP_TYPES[type];
    if(state.credits<def.price){alert("Not enough credits.");return;}
    state.credits-=def.price;
    setSharedCredits(state.credits);
    state.ships.push({id:`ship-${state.nextShip++}`,name:`${def.name} ${state.nextShip-1}`,type,location:"sol",status:"Idle"});
    log(`Purchased ${def.name} for ${money(def.price)}.`);render();
  });
  if ($("routeForm")) $("routeForm").addEventListener("submit",e=>{
    e.preventDefault();
    const contract=state.contracts.find(c=>c.id===$("contractSelect").value);
    const ship=state.ships.find(s=>s.id===$("shipSelect").value && s.status==="Idle");
    if(!contract||!ship){alert("Choose an available contract and idle ship.");return;}
    if(ship.location!==contract.from){alert(`${ship.name} is at ${systemName(ship.location)}. This contract starts at ${systemName(contract.from)}. Repositioning is not implemented yet.`);return;}
    if(contract.quantity>SHIP_TYPES[ship.type].capacity){alert("This ship does not have enough cargo capacity.");return;}
    const duration=travelMs(ship,contract),arrivesAt=now()+duration;
    ship.status="In transit";
    state.journeys.push({id:state.nextJourney++,contractId:contract.id,shipId:ship.id,shipName:ship.name,from:contract.from,to:contract.to,cargo:contract.cargo,quantity:contract.quantity,reward:contract.reward,departedAt:now(),arrivesAt,status:"In transit"});
    log(`${ship.name} dispatched on ${contract.id}.`);render();
  });
  if ($("resetDemo")) $("resetDemo").addEventListener("click",()=>{
    if(!confirm("Reset this browser's transport demo save?"))return;
    localStorage.removeItem(SAVE_KEY);state=starter();setSharedCredits(state.credits);render();
  });
  window.addEventListener("resize",drawMap);
  render();
  setInterval(render,15000);
})();
