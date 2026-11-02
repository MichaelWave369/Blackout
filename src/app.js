import {
  initialState, validateSave, setStoryMode, act, chooseEvidence, continueCase, continueAgencyCase, continueManorCase, continueWarehouseCase, continueRailCase, continueExchangeCase, chooseDialogue, TOMMY_OPTIONS,
  ROOM_NAMES, STORAGE_KEY, VERBS, visibleTargets
} from "./engine.js";
import { drawChapter2 } from "./chapter2-art.js";
import { drawAgencyChapter } from "./chapter3-art.js";
import { drawManor } from "./chapter4-art.js";
import { drawWarehouse } from "./chapter5-art.js";
import { drawRails } from "./chapter6-art.js";
import { drawExchange } from "./chapter7-art.js";
import { MARA_OPTIONS, BOARD_OPTIONS as EXCHANGE_BOARD_OPTIONS, COURIER_OPTIONS, chooseMara, chooseReconciliation, chooseCourier } from "./chapter7.js";
import { ELSIE_OPTIONS, SWITCH_OPTIONS, EXIT_OPTIONS, chooseElsie, chooseSignal, chooseExchange } from "./chapter6.js";
import { WATCHMAN_OPTIONS, TUNNEL_OPTIONS, chooseWatchman, adjustFreightSeal, submitFreightSeal, chooseTunnel } from "./chapter5.js";
import { HAROLD_OPTIONS, VERA_OPTIONS, PORTRAIT_OPTIONS, chooseHaroldDialogue, choosePortrait, chooseVeraDecision } from "./chapter4.js";
import { BOARD_OPTIONS, adjustAgencyDial, submitAgencySafe, collectAgencyFile, agencyBoardChoice } from "./chapter3.js";

const $ = id => document.getElementById(id);
const canvas = $("scene");
const ctx = canvas.getContext("2d", { alpha: false });
ctx.imageSmoothingEnabled = false;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let state;
let verb = "LOOK";
let item = "";
let frame = 0;
const names = {
  towel: "Hotel towel", screwdriver: "Screwdriver", wallet: "Vincent's wallet",
  matchbook: "Crimson matchbook", body: "Unknown victim", identity: "Vincent Morrow",
  reflection: "Cracked mirror", "red-door": "The Crimson Lounge", "blue-door": "Find the blue door",
  "off-hook-phone": "Disconnected call",
  newspaper: "Ashworth newspaper", lighter: "Silver lighter", "ashworth-headline": "Ashworth missing",
  "lounge-match": "Red-door connection", "bouncer-recognition": "Bouncer recognizes Vincent",
  "tommy-testimony": "Tommy saw the woman", "kingfisher-lead": "The Kingfisher",
  "lighter-initials": "T.T. initials", "jazz-warning": "The woman in blue",
  "kingfisher-whisper": "The Kingfisher warning",
  "case-notebook": "Vincent's notebook", "gala-photo": "Eleanor's gala photo",
  "diary-page": "Eleanor's diary", "remittance": "Ashworth receipt",
  "case-file": "Eleanor case file",
  "safe-nine": "Clock: nine", "safe-six": "Calendar: June", "safe-three": "Photograph: three",
  "agency-case": "Ashworth appointment", "engagement-photo": "Eleanor and Webb",
  "job-offer": "The job offer", "coerced-engagement": "Forced engagement",
  "ashworth-payment": "Ashworth funds", "safe-open": "Safe solved",
  "webb-engagement": "Webb and Eleanor", "webb-finances": "Webb money trail",
  "board-eleanor": "Eleanor link", "board-kingfisher": "Kingfisher link",
  "board-webb": "Webb link", "police-bulletin": "Police dispatch", "vera-call": "Vera's call"
};
const descriptions = {
  body: "Gunshot wound, unknown victim", identity: "Private investigator's license: Vincent Morrow",
  reflection: "Dried blood and an unfamiliar reflection",
  "red-door": "Matchbook from a jazz club with a red door",
  "off-hook-phone": "Receiver left off its hook",
  "blue-door": "A woman's voice whispers: Find the blue door",
  "ashworth-headline": "Eleanor Ashworth has been missing for three weeks",
  "lounge-match": "Red matchbook connects room 214 with the Crimson Lounge",
  "bouncer-recognition": "Club doorman knows Vincent Morrow",
  "tommy-testimony": "Tommy saw Vincent with a woman in a blue coat",
  "kingfisher-lead": "Kingfisher is connected to Ashworth money",
  "lighter-initials": "Silver lighter engraved T.T.",
  "jazz-warning": "Tommy warned Vincent about the woman in blue",
  "kingfisher-whisper": "A remembered bribe, a violent threat, and the name Kingfisher",
  "safe-nine": "Clock stopped at nine. Last digit for the hidden safe.",
  "safe-six": "June, the sixth month. Middle digit for the hidden safe.",
  "safe-three": "Three red ribbons in Eleanor's portrait. First safe digit.",
  "agency-case": "Vincent's handwritten Ashworth appointment",
  "engagement-photo": "Eleanor pictured reluctantly beside Marcus Webb",
  "job-offer": "A father begged Vincent to find his daughter",
  "coerced-engagement": "Eleanor: 'I'd rather die than marry Marcus Webb'",
  "ashworth-payment": "Suspicious payment from Ashworth Industries",
  "safe-open": "Wall safe opened by 3–6–9",
  "webb-engagement": "Webb coerced Eleanor into engagement",
  "webb-finances": "Webb tied to Ashworth Industries shell accounts",
  "board-eleanor": "Eleanor is the missing woman in the paper",
  "board-kingfisher": "Tommy's testimony connects to Kingfisher",
  "board-webb": "Webb, Kingfisher and Ashworth money overlap",
  "police-bulletin": "Police seek Vincent for the Marmont shooting",
  "vera-call": "Vera requests a midnight meeting at Ashworth Manor"
};
Object.assign(names,{
  "manor-diary":"Eleanor's secret diary",
  "eleanor-letters":"Hidden love letters",
  "manor-ledger":"Ashworth ledger",
  "black-k-chip":"Black K poker chip",
  "manor-expected":"Invitation confirmed",
  "harold-evasion":"Harold's evasions",
  "harold-webb":"Arranged engagement",
  "harold-payments":"Webb's finances",
  "manor-portrait-order":"Portrait lock order",
  "eleanor-warning":"Eleanor's warning",
  "flight-plan":"Eleanor's escape plan",
  "webb-manor-ledger":"Signed Ashworth ledger",
  "manor-portrait-unlocked":"Portrait compartment",
  "black-k-symbol":"The black K",
  "manor-payment-link":"Matching remittances",
  "public-confrontation":"Harold confronted openly",
  "private-confrontation":"Harold confronted privately"
});
Object.assign(descriptions,{
  "manor-expected":"Vera told the gatekeeper to expect Vincent.",
  "harold-evasion":"Harold refuses to explain what really happened to Eleanor.",
  "harold-webb":"Harold arranged Eleanor's engagement to Marcus Webb.",
  "harold-payments":"Harold admits Webb handled private business accounts.",
  "manor-portrait-order":"Father / Suitor / Daughter: a mechanism hidden in the portrait.",
  "eleanor-warning":"Eleanor told Vincent she would not surrender her future.",
  "flight-plan":"Eleanor planned to leave the manor voluntarily.",
  "webb-manor-ledger":"Webb approved mysterious Ashworth Industries transfers.",
  "manor-portrait-unlocked":"An Ashworth portrait concealed a secret compartment.",
  "black-k-symbol":"The black K chip points to the Kingfisher's criminal network.",
  "manor-payment-link":"Payments in Vincent's office match the ledger in Harold's study.",
  "public-confrontation":"Vincent confronted Harold with Vera still present.",
  "private-confrontation":"Vincent allowed Vera to leave before questioning Harold."
});
Object.assign(names,{
 "freight-manifest":"Freight manifest","wire-recording":"Eleanor recording",
 "transfer-roster":"Passenger roster","burned-photo":"Burned barge photo",
 "warehouse-quay":"Quay Four","warehouse-shift":"First tide shift",
 "warehouse-seal-bay":"Bay Seven","warehouse-shipment":"Unregistered transfer",
 "kingfisher-docks":"Kingfisher dock pass","watchman-tip":"Watchman lead",
 "protected-barge":"Protected barge","warehouse-opened":"Freight seal opened",
 "eleanor-voice":"Eleanor wire message","warehouse-voice":"Eleanor's voice",
 "eleanor-transfer":"Eleanor transfer record","barge-photo":"Burned photo",
 "protected-witness":"Protected witnesses","public-record":"Public copies"
});
Object.assign(descriptions,{
 "warehouse-quay":"The dock notice says Quay Four.",
 "warehouse-shift":"The crane's first shift bell bears a ONE.",
 "warehouse-seal-bay":"The freight container is marked Bay Seven.",
 "warehouse-shipment":"An unregistered passenger transfer appears on the manifest.",
 "kingfisher-docks":"The K chip unlocks access to a hidden dockside operation.",
 "watchman-tip":"An unregistered transfer is concealed in the warehouse office.",
 "protected-barge":"The harbor radio is concealing a barge.",
 "warehouse-opened":"Three-digit freight seal opened from shipping records.",
 "eleanor-voice":"Eleanor describes being moved by Kingfisher associates.",
 "warehouse-voice":"Eleanor calls out to Vincent through static.",
 "eleanor-transfer":"The roster places Eleanor on a secret passenger shipment.",
 "barge-photo":"A photo shows Eleanor boarding a clandestine barge.",
 "protected-witness":"Vincent kept the originals and shielded worker identities.",
 "public-record":"Vincent left copies for investigators, risking information leaks."
});
Object.assign(names,{
 "rail-timetable":"Rail dispatch timetable",
 "rail-master-key":"Brass master signal key",
 "eleanor-ticket":"Eleanor's Exchange ticket",
 "kingfisher-ledger":"Kingfisher ledger page",
 "car09-badge":"Car 09 conductor badge",
 "rail-signal-order":"Rail switch order",
 "rail-417":"Frozen station clock",
 "car09-transfer":"Car 09 transfer dispatch",
 "car09-memory":"Eleanor at the train",
 "elsie-testimony":"Elsie's testimony",
 "rail-route-open":"Signals restored",
 "exchange-ticket":"Exchange one-way ticket",
 "kingfisher-account":"Kingfisher rail accounts",
 "vera-alert":"Vera warned",
 "solo-exchange":"Exchange trail concealed"
});
Object.assign(descriptions,{
 "rail-signal-order":"Emergency route runs C → A → B.",
 "rail-417":"The station clock stopped at 4:17, matching the dock code.",
 "car09-transfer":"Eleanor's transfer was scheduled for Car 09 at Track Zero.",
 "car09-memory":"Vincent remembers shouting Eleanor's name as a carriage closed.",
 "elsie-testimony":"Elsie saw Eleanor escorted alive onto Car 09.",
 "rail-route-open":"Signals C–A–B restored power to the abandoned carriage.",
 "exchange-ticket":"Eleanor carried a one-way ticket to the abandoned Exchange.",
 "kingfisher-account":"Kingfisher shell accounts led to the old Exchange.",
 "vera-alert":"Vincent sent Vera a discreet warning before following the Exchange lead.",
 "solo-exchange":"Vincent chose to investigate without telling anyone."
});
Object.assign(names,{
 "exchange-key":"Exchange vault key","exchange-carbon":"Dock dispatch carbon",
 "exchange-roster":"Car 09 duplicate roster","exchange-seal":"Kingfisher Exchange seal",
 "webb-contract":"Marcus Webb authorization",
 "vera-message":"Vera's warning","exchange-blue-door":"Blue Door transmission",
 "exchange-freight":"Dock dispatch link","exchange-transfer":"Car 09 transfer confirmed",
 "exchange-k":"Kingfisher financial seal","mara-route":"Mara's train route",
 "mara-hears-voice":"Mara heard Eleanor","mara-testimony":"Mara saw Eleanor",
 "exchange-board-dock":"Dock records reconciled","exchange-board-train":"Rail records reconciled",
 "exchange-board-money":"Money trail reconciled","webb-signature":"Webb's authorization",
 "blue-door-flash":"The Blue Door memory","courier-trail":"Follow courier",
 "contract-secured":"Contract secured"
});
Object.assign(descriptions,{
 "vera-message":"Vera arranged help from Mara and warned about unreliable clocks.",
 "exchange-blue-door":"Exchange telegraph mentions the mysterious blue door.",
 "exchange-freight":"Exchange carbon corroborates the dock freight manifest.",
 "exchange-transfer":"Duplicate rail records confirm Eleanor arrived alive.",
 "exchange-k":"The K seal matches the Kingfisher ledger leaf.",
 "mara-route":"Mara confirms Car 09 passed through the closed Exchange.",
 "mara-hears-voice":"Mara recognizes Eleanor's voice on the wire recording.",
 "mara-testimony":"Mara witnessed Eleanor being escorted from the train.",
 "exchange-board-dock":"Dock transfer was deliberately mislabeled.",
 "exchange-board-train":"Eleanor was alive on arrival at the Exchange.",
 "exchange-board-money":"Kingfisher shell accounts financed the illegal transfer.",
 "webb-signature":"Marcus Webb signed the transfer; the Kingfisher beneficiary is still unidentified.",
 "blue-door-flash":"Vincent remembers blue paint and Eleanor's hidden key.",
 "courier-trail":"Vincent pursued a messenger toward the blue-painted passage.",
 "contract-secured":"Vincent preserved the original signed contract rather than following the messenger."
});
const zones = {
  bathroom: [
    ["mirror", 107, 29, 102, 103], ["cabinet", 22, 43, 69, 92],
    ["towel", 230, 103, 45, 65], ["sink", 108, 128, 92, 65],
    ["tile", 2, 155, 110, 45], ["door", 272, 24, 48, 170],
    ["screwdriver", 27, 100, 54, 35]
  ],
  suite: [
    ["window", 224, 24, 77, 112], ["body", 116, 101, 85, 98],
    ["jacket", 20, 103, 90, 94], ["wallet", 50, 128, 48, 45],
    ["ashtray", 179, 117, 49, 40], ["matchbook", 179, 117, 49, 40],
    ["telephone", 20, 111, 90, 50], ["door", 299, 10, 21, 190]
  ],
  escape: [
    ["ladder", 189, 97, 120, 103], ["street", 0, 171, 320, 29],
    ["window", 20, 36, 99, 117], ["sign", 196, 21, 120, 80],
    ["rail", 85, 113, 160, 63]
  ],
  alley: [["rain", 0, 0, 320, 200], ["matchbook", 130, 143, 67, 45], ["street", 230, 9, 90, 77]],
  street: [
    ["alley", 0, 0, 58, 88], ["sign", 121, 11, 125, 59],
    ["puddle", 55, 178, 204, 22], ["newspaper", 4, 100, 68, 90],
    ["patrol", 75, 98, 41, 78], ["door", 147, 75, 69, 112],
    ["agency", 255, 52, 65, 125]
  ],
  lounge: [
    ["exit", 1, 26, 38, 170], ["booth", 48, 94, 63, 71],
    ["bouncer", 16, 96, 28, 82], ["piano", 242, 75, 76, 107],
    ["bar", 106, 141, 135, 59], ["tommy", 154, 79, 42, 93],
    ["telephone", 215, 122, 25, 27], ["lighter", 159, 146, 33, 17]
  ],
  agency: [["sign", 59, 34, 209, 52], ["door", 116, 78, 99, 118]],
  office: [
    ["board",92,19,126,98],["desk",55,129,155,69],
    ["drawer",94,148,69,23],["notebook",148,128,36,20],
    ["photograph",98,142,27,25],["safe",212,68,63,62],
    ["clock",237,22,37,38],["radio",22,114,30,25],
    ["telephone",178,108,35,34],["archive",275,16,45,144],
    ["door",0,39,15,142],["floor",20,175,300,25]
  ],
  archive: [
    ["cabinet",25,20,106,140],["calendar",169,26,83,73],
    ["diary",184,118,40,23],["receipt",230,119,40,22],
    ["lamp",251,45,52,87],["exit",296,16,24,184]
  ],
  manorGate: [
    ["plaque",91,16,81,40],["lantern",10,19,43,68],
    ["guard",17,85,44,115],["intercom",65,127,29,48],
    ["driveway",100,159,155,41],["frontdoor",231,95,73,65]
  ],
  manorFoyer: [
    ["chandelier",116,24,83,42],["painting",236,18,78,75],
    ["guestbook",19,129,67,31],["stairs",81,79,65,49],
    ["frontdoor",90,151,54,49],["bedroomdoor",4,46,78,146],
    ["studydoor",241,96,79,104],["harold",151,78,59,122]
  ],
  manorStudy: [
    ["shelves",3,17,91,107],["window",248,15,64,84],
    ["desk",16,125,109,75],["ledger",28,120,78,29],
    ["portrait",118,19,124,99],["chip",166,83,29,23],
    ["vera",250,88,50,106],["foyerdoor",302,18,18,182]
  ],
  eleanorRoom: [
    ["photo",17,16,58,59],["window",127,14,90,84],
    ["bed",26,123,131,77],["jewelry",60,109,65,44],
    ["letters",76,120,45,28],["vanity",198,98,85,89],
    ["diary",216,127,46,26],["foyerdoor",294,24,26,176]
  ]
};
Object.assign(zones,{
 dockGate:[
  ["watchman",8,74,55,126],["poster",65,120,29,48],
  ["sign",158,174,150,25],["gate",95,61,218,110],
  ["water",122,187,180,13],["truck",145,83,111,59]
 ],
 loadingBay:[
  ["office",1,64,94,84],["container",119,47,190,123],
  ["crane",18,10,198,69],["stencil",254,73,65,34],
  ["door",0,157,92,42],["rail",114,168,195,32],["lamp",89,22,22,22]
 ],
 freightOffice:[
  ["cabinet",12,30,112,117],["manifest",28,70,80,39],
  ["radio",150,100,58,36],["desk",126,131,173,69],
  ["photo",263,19,56,52],["window",148,17,101,91],
  ["door",303,65,17,120]
 ],
 containerHold:[
  ["recorder",128,92,104,43],["roster",224,127,62,43],
  ["crate",9,137,106,63],["photo",41,148,41,31],
  ["vent",250,15,65,65],["tunnel",247,68,72,129],
  ["door",0,40,18,96]
 ]
});
Object.assign(zones,{
 railTunnel:[
  ["cabin",18,20,112,132],["platform",184,19,132,134],
  ["chalk",126,55,58,59],["poster",91,152,110,36],
  ["rubble",0,139,87,61],["water",201,176,119,24]
 ],
 signalCabin:[
  ["timetable",20,30,65,83],["locker",265,24,46,128],
  ["board",56,117,199,79],["telephone",1,105,44,31],
  ["lamp",175,106,24,16],["window",99,17,149,92],["exit",0,159,48,40]
 ],
 railPlatform:[
  ["elsie",21,76,52,118],["train",75,71,245,89],
  ["clock",260,16,47,47],["bench",0,140,77,48],
  ["poster",5,15,123,35],["tunnel",0,71,20,72],["track",82,160,238,40]
 ],
 ghostTrain:[
  ["seat",5,102,197,71],["ticket",111,129,44,21],
  ["case",208,114,75,54],["ledger",224,131,51,28],
  ["window",20,12,236,91],["hatch",283,20,36,172],
  ["exit",0,21,25,176],["badge",141,102,39,33]
 ]
});
Object.assign(zones,{
 exchangeLanding:[
  ["lift",9,19,109,133],["directory",123,14,61,52],
  ["note",116,104,45,32],["entrance",169,33,144,124],
  ["tiles",15,153,303,47],["light",0,5,18,27]
 ],
 exchangeHall:[
  ["counter",90,130,140,70],["board",110,13,119,76],
  ["clock",263,7,42,42],["return",1,162,71,38],
  ["telegraph",3,44,88,114],["vault",237,46,82,118],
  ["mara",119,77,69,75]
 ],
 wireRoom:[
  ["window",126,8,132,100],["cabinet",8,26,108,140],
  ["switch",143,16,108,74],["machine",124,82,151,64],
  ["carbon",28,72,44,37],["roster",66,78,37,31],
  ["door",281,17,39,179]
 ],
 exchangeVault:[
  ["drawer",51,151,205,47],["lamp",1,103,44,59],
  ["exit",274,18,46,182],["board",30,17,246,108],
  ["seal",61,120,89,34],["contract",155,124,89,37],
  ["courier",285,73,31,118]
 ]
});
const palette = {
  bg: "#0b0e1c", tile: "#282735", gold: "#c6a976", blue: "#66858f",
  shadow: "#101320", gray: "#6a6974", red: "#ad3a44",
  white: "#c5c2ad", wall: "#292b3a", rose: "#65424a"
};
function rect(x,y,w,h,color) { ctx.fillStyle = color; ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h)); }
function line(x1,y1,x2,y2,color,width=1) {
  ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth=width;
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
}
function poly(points,color) {
  ctx.fillStyle=color; ctx.beginPath(); ctx.moveTo(points[0][0],points[0][1]);
  for(let i=1;i<points.length;i++) ctx.lineTo(points[i][0],points[i][1]);
  ctx.closePath(); ctx.fill();
}
function glow(x,y,r,color) {
  const g=ctx.createRadialGradient(x,y,2,x,y,r);
  g.addColorStop(0,color); g.addColorStop(1,"#00000000");
  ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
}
function textAt(str,x,y,color,size=7) {
  ctx.font="bold "+size+"px monospace";ctx.fillStyle=color;ctx.fillText(str,x,y);
}
function gridFloor(yBase, colors) {
  poly([[0,yBase],[320,yBase],[320,200],[0,200]],colors[0]);
  for(let i=0;i<9;i++) line(160,yBase, i*48-30,200,colors[1]);
  for(let i=1;i<5;i++) { const y=yBase+Math.round(Math.pow(i/4,1.7)*(200-yBase));line(0,y,320,y,colors[1]); }
}
function drawBathroom() {
  rect(0,0,320,200,"#1c2330");
  poly([[0,0],[320,0],[320,142],[0,156]],"#303440");
  for(let i=0;i<12;i++) line(i*29,7,i*29,149,"#363945");
  rect(0,0,320,9,"#131621");
  gridFloor(145,["#222632","#44404b"]);
  // Mirror. Deliberately chunky 8-bit room illustration.
  rect(101,24,111,107,"#11131f");rect(105,28,103,99,"#b49a71");
  rect(111,33,91,87,"#394755");
  if(!state.flags.mirror) {
    for(let i=0;i<18;i++) rect(113+(i*29)%84,38+(i*17)%78,25,6,i%2?"#63727a":"#50616c");
    line(113,44,196,112,"#97a0a4",2); line(180,43,166,81,"#97a0a4");
  } else {
    glow(152,70,45,"#657a7955");
    rect(146,45,27,32,"#7a6c67");rect(141,55,8,28,"#5b5b5e");rect(169,56,10,24,"#5b5b5e");
    poly([[140,79],[178,79],[196,118],[122,118]],"#202431");
    rect(149,67,6,3,"#1b1c26");rect(165,67,6,3,"#1b1c26");
    line(172,49,160,62,"#b5474b",2);
  }
  // Medicine cabinet, cracked open when unlocked
  rect(17,43,71,85,"#121721");rect(22,48,61,75,"#54606a");
  rect(26,52,53,65,"#303f4c");
  if(state.opened.includes("cabinet")) {rect(31,52,39,59,"#17202c");rect(37,62,17,23,"#888176");rect(48,91,15,4,"#b2a18f");}
  else {rect(74,78,3,10,"#b9ad88");line(22,48,83,123,"#6d7480");}
  rect(107,128,94,12,"#a69b87");rect(117,141,73,34,"#6e6a67");
  rect(128,134,52,8,"#262c37");rect(148,133,7,4,"#b6aaa0");
  rect(119,176,69,20,"#292b36");rect(195,129,9,45,"#4e4d57");
  // Towel and hook
  rect(251,99,3,11,"#e9bba1");
  if(!state.inventory.includes("towel")) {
    poly([[230,108],[270,108],[267,171],[237,169]],"#a6a6a0");
    for(let i=0;i<5;i++)rect(237+i*6,154,2,15,"#92939c");
  }
  // Back door
  rect(278,21,42,163,"#151c26");rect(282,29,35,148,"#30313b");
  rect(287,37,24,71,"#49414d");rect(289,112,22,54,"#43404a");rect(285,112,4,5,"#c7ad7e");
  rect(0,0,21,144,"#151b25");
  if(state.pressure>=17) glow(310,128,42,"#e6546655");
  // Clue: bloodstained tile
  rect(37,183,10,3,"#8c3b46");rect(54,180,6,3,"#99404a");rect(51,188,14,2,"#6e303a");
}
function drawSuite() {
  rect(0,0,320,200,"#202331");
  rect(0,16,320,130,"#3b3340");
  for(let i=0;i<23;i++){ rect(i*15,17,3,126,"#493f47");rect(i*15+6,17,2,126,"#302b3d"); }
  rect(0,9,320,10,"#171723");rect(0,139,320,8,"#171822");
  gridFloor(148,["#2e2b35","#564451"]);
  // window with Chicago skyline and rain
  rect(219,23,85,114,"#1a1724");rect(224,28,76,104,"#2a3d52");
  rect(232,80,13,47,"#1b2734");rect(244,64,15,63,"#1a2837");rect(267,73,26,54,"#1b2837");
  for(let i=0;i<25;i++) rect(229+(i*17)%65,54+(i*23)%63,2,3,i%4===0?"#bd795f":"#8a7171");
  line(264,29,264,131,"#998371",4);line(225,87,300,87,"#998371",3);
  if(state.flags.window) {rect(225,110,74,19,"#141d2c");line(230,115,293,115,"#5b737a");}
  rect(210,20,10,121,"#6d3641");rect(301,20,8,121,"#6d3641");
  // bed and jacket
  rect(9,132,113,23,"#181a24");rect(15,137,99,44,"#5c5260");
  rect(16,120,45,22,"#a6a09a");rect(64,124,48,16,"#7b7984");
  rect(20,167,104,17,"#43333d");rect(32,150,24,25,"#343139");
  if(!state.opened.includes("jacket")) {poly([[24,120],[75,120],[92,167],[32,165]],"#242634");rect(48,131,4,30,"#3d4352");}
  // side table and telephone
  rect(176,120,49,10,"#211c28");rect(181,129,38,51,"#443a3e");
  rect(185,113,24,10,"#111721");rect(188,108,19,8,"#34333d");rect(193,121,5,8,"#8d8481");
  // standing floor lamp
  rect(113,30,56,37,"#ad8e64");rect(119,37,45,24,"#d2b681");rect(139,65,4,58,"#6e6865");
  glow(141,73,74,"#a88d6330");
  // Victim in armchair, subdued noir silhouettes
  rect(129,142,72,42,"#15151d");
  poly([[140,131],[183,128],[192,162],[132,162]],"#23252f");
  rect(153,102,28,29,"#685e60");rect(147,112,11,22,"#524e57");
  poly([[148,127],[186,125],[205,172],[132,170]],"#373541");
  rect(169,139,5,5,"#963d49");
  rect(148,171,11,27,"#242630");rect(179,169,13,28,"#222630");
  rect(157,105,7,3,"#1d1c29");rect(173,105,7,3,"#1d1c29");
  // matchbook near ashtray
  rect(197,113,23,5,"#15161d");
  if(!state.inventory.includes("matchbook")){rect(203,110,14,8,"#a73c47");rect(205,112,10,2,"#eab8a7");}
  rect(0,0,7,200,"#14151e");
  if(state.pressure>=17){glow(315,93,49,"#e3424a65");}
}
function drawEscape() {
  rect(0,0,320,200,"#111a2d");rect(0,0,320,80,"#18223c");
  glow(243,35,47,"#97333f65");glow(63,26,50,"#a77a6260");
  for(let i=0;i<18;i++){
    const x=i*21;const h=44+((i*37)%55);
    rect(x,135-h,20,h,"#172131");
    for(let j=0;j<6;j++)if((i+j)%3!==0)rect(x+5+(j%2)*8,141-h+(j*9)%Math.max(h-6,7),2,3,"#896d6e");
  }
  // hotel brickwork
  rect(0,0,113,200,"#42343f");for(let y=0;y<200;y+=10) {
    line(0,y,113,y,"#231f2d");for(let x=(y%20===0?0:12);x<113;x+=24)line(x,y,x,y+10,"#302733");
  }
  rect(19,37,93,103,"#181927");rect(24,43,82,89,"#6f5b58");rect(30,48,69,77,"#202d3a");
  line(63,45,63,127,"#ab997b",4);
  if(state.pressure>=17)glow(29,108,70,"#e4485655");
  // dramatic iron catwalk
  poly([[79,144],[223,137],[320,165],[320,184],[86,172]],"#1c1d25");
  for(let x=91;x<320;x+=15){rect(x,143,3,36,"#5e6268");}
  line(86,143,315,137,"#969294",3);line(82,166,319,165,"#969294",2);
  for(let x=102;x<317;x+=25)line(x,145,x+14,166,"#6a6b72");
  // descending ladder
  rect(247,161,4,39,"#969294");rect(292,161,4,39,"#969294");
  for(let y=166;y<200;y+=9)line(249,y,293,y,"#777e82",2);
  // neon sign
  rect(192,25,128,42,"#231621");rect(196,29,123,34,"#7d2d39");
  rect(200,33,116,26,"#221f2e");textAt("CRIMSON",207,44,"#df5b64",10);textAt("LOUNGE",223,56,"#e8a4a1",9);
  glow(255,45,72,"#b53c4655");
}
function drawAlley() {
  rect(0,0,320,200,"#101627");
  glow(241,40,84,"#a03c4860");glow(85,54,92,"#3f688a55");
  rect(0,0,71,169,"#242536");rect(248,0,72,170,"#2b2937");
  for(let y=0;y<170;y+=12){line(0,y,71,y,"#383441");line(248,y,320,y,"#433543");}
  poly([[71,110],[249,110],[320,200],[0,200]],"#1a2532");
  for(let i=0;i<9;i++)line(156,112,i*48-30,200,"#313340");
  rect(224,14,96,36,"#321e2a");textAt("CRIMSON",231,29,"#e5696d",10);textAt("LOUNGE",244,40,"#df9b95",9);
  // detective silhouette with coat and hat, back to camera
  rect(139,83,38,6,"#0b0c12");rect(145,75,24,15,"#0b0c12");
  rect(150,86,17,16,"#1b1a23");poly([[140,100],[174,100],[193,160],[124,160]],"#10141d");
  poly([[144,158],[156,158],[153,198],[132,198]],"#10141d");
  poly([[159,156],[172,156],[190,198],[165,198]],"#10141d");
  rect(139,108,7,39,"#1e202b");
  // hint of red matchbook and reflections
  rect(178,151,9,11,"#bc3c49");
  for(let i=0;i<9;i++)rect(190+i*7,183+(i%3)*4,6,2,"#5a3c50");
}
function drawRain() {
  if(["bathroom","suite","lounge","office","archive","manorFoyer","manorStudy","eleanorRoom","manorGate","freightOffice","containerHold","loadingBay","railTunnel","signalCabin","railPlatform","ghostTrain","exchangeLanding","exchangeHall","wireRoom","exchangeVault"].includes(state.room))return;
  for(let i=0;i<47;i++){
    const x=(i*37+frame*2.3)%342-12;const y=(i*31+frame*3.7)%221-10;
    line(x,y,x-2,y+7,i%4===0?"#8b8e9c80":"#637b8960");
  }
}
function drawScene(){
  ctx.clearRect(0,0,320,200);
  const room=state.room;
  if(room==="bathroom")drawBathroom();
  else if(room==="suite")drawSuite();
  else if(room==="escape")drawEscape();
  else if(room==="alley")drawAlley();
  else if(room==="office"||room==="archive")drawAgencyChapter(ctx,state,frame);
  else if(["manorGate","manorFoyer","manorStudy","eleanorRoom"].includes(room))drawManor(ctx,state,frame);
  else if(["dockGate","loadingBay","freightOffice","containerHold"].includes(room))drawWarehouse(ctx,state,frame);
  else if(["railTunnel","signalCabin","railPlatform","ghostTrain"].includes(room))drawRails(ctx,state,frame);
  else if(["exchangeLanding","exchangeHall","wireRoom","exchangeVault"].includes(room))drawExchange(ctx,state,frame);
  else drawChapter2(ctx,state,frame);
  drawRain();
  // cinematic pixel border
  rect(0,0,320,2,"#080a12");rect(0,198,320,2,"#080a12");
  if(state.status==="caught") {
    rect(35,73,250,56,"#150e1bdd");rect(37,75,246,52,"#522633");
    textAt("YOU HAVE BEEN ARRESTED",56,102,"#f1c0b3",11);
    textAt("NEW CASE TO TRY AGAIN",72,117,"#e4c694",7);
  }
  if(state.status==="escaped") {
    rect(48,18,228,35,"#101320ee");rect(51,21,222,29,"#64433d");
    textAt("CHAPTER 1: ESCAPED",71,40,"#f2d092",12);
  }
  if(["chapter2complete","chapter3complete","chapter4complete","chapter5complete","chapter6complete","chapter7complete"].includes(state.status)){
    rect(48,18,228,35,"#101320ee");rect(51,21,222,29,"#64433d");
    const label={"chapter2complete":"CHAPTER 2 COMPLETE","chapter3complete":"CHAPTER 3 COMPLETE","chapter4complete":"CHAPTER 4 COMPLETE","chapter5complete":"CHAPTER 5 COMPLETE","chapter6complete":"CHAPTER 6 COMPLETE","chapter7complete":"CHAPTER 7 COMPLETE"}[state.status];
    textAt(label,62,40,"#f2d092",12);
  }
}
function makeButton(text, onClick, attrs={}){
  const b=document.createElement("button");
  b.type="button";b.textContent=text;
  for(const [key,value] of Object.entries(attrs)) b.setAttribute(key,value);
  b.addEventListener("click",onClick);
  return b;
}
function doAction(target) {
  state=act(state,verb,target,item);
  if(verb==="USE") item="";
  commit();
}
function commit(){
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); } catch(e) { $("fileMessage").textContent="Auto-save unavailable. Export your case file manually."; }
  render();
}
function render(){
  $("roomName").textContent=ROOM_NAMES[state.room];
  $("filmStamp").textContent={
    bathroom:"CHICAGO / 2:13 AM",suite:"ROOM 214 / 2:19 AM",
    escape:"FIRE ESCAPE / 2:23 AM",alley:"CHICAGO / 2:27 AM",
    street:"CHICAGO / 2:34 AM",lounge:"THE CRIMSON LOUNGE / 2:41 AM",agency:"WEST LAKE ST / 3:02 AM",
    office:"MORROW AGENCY / 3:09 AM",archive:"RECORDS ROOM / 3:16 AM",
    manorGate:"ASHWORTH ESTATE / 11:53 PM",manorFoyer:"ASHWORTH FOYER / 12:02 AM",
    eleanorRoom:"ELEANOR'S ROOM / 12:11 AM",manorStudy:"ASHWORTH STUDY / 12:15 AM",
    dockGate:"SOUTH BRANCH / 3:54 AM",loadingBay:"DOCK BAY / 4:03 AM",
    freightOffice:"DISPATCH / 4:09 AM",containerHold:"K-417 / 4:16 AM",
    railTunnel:"RAIL TUNNEL / 4:25 AM",signalCabin:"SIGNAL CABIN / 4:33 AM",
    railPlatform:"PLATFORM ZERO / 4:38 AM",ghostTrain:"CAR 09 / 4:46 AM",
    exchangeLanding:"EXCHANGE LIFT / 4:57 AM",exchangeHall:"OLD EXCHANGE / 5:02 AM",
    wireRoom:"TELEGRAPH / 5:09 AM",exchangeVault:"RECORDS VAULT / 5:17 AM"
  }[state.room];
  $("objective").textContent=state.status==="caught"?"CASE STATUS: ARRESTED":
    state.status==="escaped"?"CHAPTER COMPLETE: CONTINUE BELOW":
    state.status==="chapter2complete"?"CHAPTER COMPLETE: THE AGENCY AWAITS":
    state.status==="chapter3complete"?"CHAPTER COMPLETE: ASHWORTH MANOR AT MIDNIGHT":
    state.status==="chapter4complete"?"CHAPTER COMPLETE: SHADOWS IN THE WAREHOUSE":
    state.status==="chapter5complete"?"CHAPTER COMPLETE: THE OLD CITY RAIL YARDS":
    state.status==="chapter6complete"?"CHAPTER COMPLETE: THE OLD EXCHANGE":
    state.status==="chapter7complete"?"CHAPTER COMPLETE: THE BLUE DOOR AWAITS":
    ({bathroom:"OBJECTIVE: RECOVER YOUR IDENTITY",suite:"OBJECTIVE: FIND CLUES AND ESCAPE",
    escape:"OBJECTIVE: DESCEND TO THE ALLEY",alley:"OBJECTIVE: REACH THE CRIMSON LOUNGE",
    street:state.inventory.includes("lighter")?"OBJECTIVE: FIND THE DETECTIVE AGENCY":"OBJECTIVE: ENTER THE CRIMSON LOUNGE",
    lounge:"OBJECTIVE: QUESTION TOMMY TWO-FINGERS",agency:"CASE STATUS: NEXT CHAPTER",
    office:state.case3?.boardSolved?"OBJECTIVE: ANSWER THE TELEPHONE":"OBJECTIVE: SOLVE THE EVIDENCE BOARD",
    archive:"OBJECTIVE: SEARCH THE ASHWORTH RECORDS",
    manorGate:"OBJECTIVE: ENTER ASHWORTH MANOR",
    manorFoyer:"OBJECTIVE: QUESTION HAROLD, EXPLORE THE MANOR",
    eleanorRoom:"OBJECTIVE: UNCOVER ELEANOR'S SECRETS",
    manorStudy:state.case4?.veraAppeared?"OBJECTIVE: SPEAK TO VERA":"OBJECTIVE: UNCOVER THE BLACK K",
    dockGate:"OBJECTIVE: TALK TO THE NIGHT WATCHMAN",
    loadingBay:state.case5?.sealOpen?"OBJECTIVE: ENTER THE CONTAINER":"OBJECTIVE: FIND THE SHIPPING CODE",
    freightOffice:"OBJECTIVE: RECOVER THE FREIGHT MANIFEST",
    containerHold:"OBJECTIVE: FOLLOW ELEANOR'S TRANSFER",
    railTunnel:"OBJECTIVE: TRACE THE FORGOTTEN RAIL ROUTE",
    signalCabin:state.case6?.signalsAligned?"OBJECTIVE: ENTER CAR 09":"OBJECTIVE: RESTORE THE SIGNAL ROUTE",
    railPlatform:state.case6?.keyGranted?"OBJECTIVE: ACCESS THE TRAIN":"OBJECTIVE: TALK TO ELSIE VALE",
    ghostTrain:"OBJECTIVE: RECOVER THE KINGFISHER LEDGER",
    exchangeLanding:"OBJECTIVE: ENTER THE OLD EXCHANGE",
    exchangeHall:state.case7?.vaultKey?"OBJECTIVE: ENTER THE RECORDS VAULT":"OBJECTIVE: QUESTION MARA BELL",
    wireRoom:"OBJECTIVE: FIND THE ORIGINAL DISPATCH COPIES",
    exchangeVault:state.case7?.boardSolved?"OBJECTIVE: RECOVER WEBB'S CONTRACT":"OBJECTIVE: RECONCILE THE EVIDENCE"}[state.room]);
  $("policeStatus").textContent=state.status==="caught"?"POLICE: HERE":
    state.chapter===7?"DANGER: ANONYMOUS WATCHERS":state.chapter===6?"DANGER: BELOW THE CITY":state.chapter===5?"DANGER: DOCK WATCH":state.chapter===4?"DANGER: EVERYWHERE":state.chapter===3?"POLICE: INVESTIGATING":state.chapter===2?"POLICE: IN THE SHADOWS":state.status==="escaped"?"POLICE: EVADED":
    state.pressure>=25?"POLICE: AT THE DOOR":state.pressure>=17?"POLICE: APPROACHING":
    state.pressure>=9?"POLICE: SIRENS":"POLICE: DISTANT";
  $("storyMode").checked=state.storyMode;
  $("continueBtn").hidden=!(state.status==="escaped"&&state.room==="alley"&&state.chapter===1);
  $("continueAgencyBtn").hidden=!(state.status==="chapter2complete"&&state.room==="agency"&&state.chapter===2);
  $("continueManorBtn").hidden=!(state.status==="chapter3complete"&&state.room==="office"&&state.chapter===3);
  $("continueWarehouseBtn").hidden=!(state.status==="chapter4complete"&&state.room==="manorStudy"&&state.chapter===4);
  $("continueRailsBtn").hidden=!(state.status==="chapter5complete"&&state.room==="containerHold"&&state.chapter===5);
  $("continueExchangeBtn").hidden=!(state.status==="chapter6complete"&&state.room==="ghostTrain"&&state.chapter===6);
  $("relationsPanel").hidden=![4,5,6,7].includes(state.chapter);
  if(state.chapter===7&&state.case7){
    const trust=n=>n>0?"COOPERATIVE":n<0?"WARY":"UNCERTAIN";
    $("relations").textContent="MARA: "+trust(state.case7.maraTrust)+" · RECONCILED: "+state.case7.boardLinks.length+"/3 · COURIER: "+(state.case7.choice||"PENDING").toUpperCase();
  }
  if(state.chapter===6&&state.case6){
    const trust=n=>n>0?"COOPERATIVE":n<0?"WARY":"UNCERTAIN";
    $("relations").textContent="ELSIE: "+trust(state.case6.elsieTrust)+" · EXCHANGE: "+(state.case6.decision||"PENDING").toUpperCase();
  }
  if(state.chapter===5&&state.case5){
    const trust=n=>n>0?"COOPERATIVE":n<0?"WARY":"UNCERTAIN";
    $("relations").textContent="DOCK WATCHMAN: "+trust(state.case5.watchmanTrust)+" · EVIDENCE: "+(state.case5.decision||"PENDING").toUpperCase();
  }
  if(state.chapter===4&&state.case4){
    const trust=n=>n>0?"TRUSTING":n<0?"STRAINED":"UNCERTAIN";
    $("relations").textContent="HAROLD: "+trust(state.case4.haroldTrust)+" · VERA: "+trust(state.case4.veraTrust);
  }
  const verbs=$("verbs");verbs.replaceChildren();
  VERBS.forEach((v,i)=>verbs.appendChild(makeButton((i+1)+". "+v,()=>{verb=v;if(v!=="USE")item="";render();},{"aria-pressed":String(verb===v)})));
  $("commandTip").textContent=state.status==="escaped"?"Chapter 1 complete. Use CONTINUE TO CHAPTER 2 below.":
    state.status==="chapter2complete"?"Chapter 2 complete. Continue to the agency from the CASE CONTROLS.":
    state.status==="chapter3complete"?"Chapter 3 complete. Continue to ASHWORTH MANOR below.":
    state.status==="chapter4complete"?"Chapter 4 complete. Continue to WAREHOUSE SHADOWS below.":
    state.status==="chapter5complete"?"Chapter 5 complete. Continue to THE FORGOTTEN RAILS below.":
    state.status==="chapter6complete"?"Chapter 6 complete. Continue to THE OLD EXCHANGE below.":
    state.status==="chapter7complete"?"Chapter 7 complete. The Blue Door will open in a later chapter.":
    state.status!=="playing"?"Case closed. NEW CASE begins again.":
    verb==="USE"?(item?"USE "+(names[item]||item)+" ON WHAT?":"Choose an inventory item, then choose the target."):
    verb==="TALK"?"Select a person in the scene to question them.":
    verb+" selected. Choose an object below or click the picture.";
  const objects=$("sceneObjects");objects.replaceChildren();
  visibleTargets(state).forEach(([id,label])=>{
    const button=makeButton(label,()=>doAction(id),{"aria-label":verb+" "+label});
    button.disabled=state.status!=="playing";objects.appendChild(button);
  });
  const inv=$("inventory");inv.replaceChildren();
  if(!state.inventory.length) {
    const e=document.createElement("div");e.className="empty";e.textContent="Your pockets are empty.";inv.appendChild(e);
  } else {
    state.inventory.forEach(id=>inv.appendChild(makeButton(names[id]||id,()=>{
      item=item===id?"":id;verb="USE";render();
    },{"aria-pressed":String(item===id)})));
  }
  $("itemCount").textContent=String(state.inventory.length).padStart(2,"0");
  $("clueCount").textContent=String(state.clues.length).padStart(2,"0");
  $("memoryCount").textContent=String(state.memories.length).padStart(2,"0");
  for(const [parentId,items,klass] of [["clues",state.clues,"note"],["memories",state.memories,"note memory"]]) {
    const p=$(parentId);p.replaceChildren();
    if(!items.length){const e=document.createElement("div");e.className="empty";e.textContent="Nothing recorded yet.";p.appendChild(e);}
    items.forEach(id=>{const e=document.createElement("div");e.className=klass;e.textContent=descriptions[id]||names[id]||id;p.appendChild(e);});
  }
  const log=$("log");const nearBottom=log.scrollHeight-log.scrollTop-log.clientHeight<45;
  log.replaceChildren();
  state.transcript.forEach(entry=>{const p=document.createElement("p");p.className=entry.kind;p.textContent=entry.text;log.appendChild(p);});
  if(nearBottom)log.scrollTop=log.scrollHeight;
  const choices=$("choicePanel");choices.replaceChildren();
  const crimeChoice=state.room==="suite"&&state.flags.body&&!state.flags.evidenceChoice&&state.status==="playing";
  const tommyChoice=state.room==="lounge"&&state.dialogue==="tommy"&&state.status==="playing";
  const c=state.case3;
  const agencyPlaying=state.chapter===3&&state.room==="office"&&state.status==="playing";
  const safePanel=agencyPlaying&&c?.safeExamined&&!c.safeOpen;
  const boardPanel=agencyPlaying&&c?.boardExamined&&!c.boardSolved;
  const safeFilePanel=agencyPlaying&&c?.safeOpen&&!c.fileTaken;
  const manor=state.case4;
  const manorPlaying=state.chapter===4&&state.status==="playing";
  const haroldPanel=manorPlaying&&state.room==="manorFoyer"&&manor?.dialogue==="harold";
  const veraPanel=manorPlaying&&state.room==="manorStudy"&&manor?.dialogue==="vera";
  const portraitPanel=manorPlaying&&state.room==="manorStudy"&&manor?.portraitPanel&&!manor?.portraitUnlocked;
  const warehouse=state.case5;
  const warehousePlaying=state.chapter===5&&state.status==="playing";
  const watchmanPanel=warehousePlaying&&state.room==="dockGate"&&warehouse?.dialogue==="watchman";
  const sealPanel=warehousePlaying&&state.room==="loadingBay"&&warehouse?.sealPanel&&!warehouse?.sealOpen;
  const tunnelPanel=warehousePlaying&&state.room==="containerHold"&&warehouse?.tunnelPanel;
  const rails=state.case6;
  const railsPlaying=state.chapter===6&&state.status==="playing";
  const elsiePanel=railsPlaying&&state.room==="railPlatform"&&rails?.dialogue==="elsie";
  const switchPanel=railsPlaying&&state.room==="signalCabin"&&rails?.switchPanel&&!rails?.signalsAligned;
  const exchangePanel=railsPlaying&&state.room==="ghostTrain"&&rails?.exitPanel;
  const ex=state.case7;
  const exPlaying=state.chapter===7&&state.status==="playing";
  const maraPanel=exPlaying&&state.room==="exchangeHall"&&ex?.dialogue==="mara";
  const reconciliationPanel=exPlaying&&state.room==="exchangeVault"&&ex?.boardPanel&&!ex.boardSolved;
  const courierPanel=exPlaying&&state.room==="exchangeVault"&&ex?.dialogue==="courier";
  choices.hidden=!(crimeChoice||tommyChoice||safePanel||boardPanel||safeFilePanel||haroldPanel||veraPanel||portraitPanel||watchmanPanel||sealPanel||tunnelPanel||elsiePanel||switchPanel||exchangePanel||maraPanel||reconciliationPanel||courierPanel);
  if(crimeChoice){
    const strong=document.createElement("strong");strong.textContent="A CHOICE: WHAT DO YOU DO WITH THE CRIME SCENE?";choices.appendChild(strong);
    choices.appendChild(makeButton("PRESERVE EVIDENCE",()=>{state=chooseEvidence(state,"preserve");commit();}));
    choices.appendChild(makeButton("WIPE FINGERPRINTS",()=>{state=chooseEvidence(state,"erase");commit();}));
  }
  if(tommyChoice){
    const strong=document.createElement("strong");strong.textContent="TOMMY TWO-FINGERS / CONVERSATION";choices.appendChild(strong);
    TOMMY_OPTIONS.forEach(option=>choices.appendChild(makeButton(option.label,()=>{
      state=chooseDialogue(state,option.id);commit();
    })));
  }
  if(safePanel){
    const strong=document.createElement("strong");strong.textContent="HIDDEN SAFE / PORTRAIT • DATE • HOUR";choices.appendChild(strong);
    const hint=document.createElement("div");hint.className="agency-hint";
    hint.textContent="Look at the photograph, the June calendar, and the stopped clock to uncover the three digits.";
    choices.appendChild(hint);
    const dials=document.createElement("div");dials.className="safe-dials";
    ["PORTRAIT","DATE","HOUR"].forEach((label,i)=>{
      const col=document.createElement("div");col.className="safe-dial";
      const heading=document.createElement("span");heading.textContent=label;col.appendChild(heading);
      col.appendChild(makeButton("▲",()=>{state=adjustAgencyDial(state,i,1);commit();},{"aria-label":"Increase "+label+" dial"}));
      const digit=document.createElement("output");digit.textContent=String(c.safeDigits[i]);col.appendChild(digit);
      col.appendChild(makeButton("▼",()=>{state=adjustAgencyDial(state,i,-1);commit();},{"aria-label":"Decrease "+label+" dial"}));
      dials.appendChild(col);
    });
    choices.appendChild(dials);
    choices.appendChild(makeButton("TRY COMBINATION",()=>{state=submitAgencySafe(state);commit();}));
  }
  if(safeFilePanel){
    const strong=document.createElement("strong");strong.textContent="INSIDE THE SAFE: ELEANOR ASHWORTH / CONFIDENTIAL";choices.appendChild(strong);
    choices.appendChild(makeButton("TAKE CASE FILE",()=>{state=collectAgencyFile(state);commit();}));
  }
  if(boardPanel){
    const strong=document.createElement("strong");strong.textContent="EVIDENCE BOARD / "+c.boardLinks.length+" OF 3 CONNECTIONS";choices.appendChild(strong);
    BOARD_OPTIONS.forEach(option=>{
      const btn=makeButton((c.boardLinks.includes(option.id)?"✓ ":"")+option.label,()=>{state=agencyBoardChoice(state,option.id);commit();});
      btn.disabled=c.boardLinks.includes(option.id);
      choices.appendChild(btn);
    });
  }
  if(haroldPanel){
    const heading=document.createElement("strong");
    heading.textContent="HAROLD ASHWORTH / PRIVATE INTERVIEW";choices.appendChild(heading);
    HAROLD_OPTIONS.forEach(option=>{
      const button=makeButton(option.label,()=>{state=chooseHaroldDialogue(state,option.id);commit();});
      button.disabled=manor.haroldAsked.includes(option.id);
      choices.appendChild(button);
    });
  }
  if(veraPanel){
    const heading=document.createElement("strong");
    heading.textContent="VERA / THE FIRST TRUST DECISION";choices.appendChild(heading);
    const hint=document.createElement("div");hint.className="agency-hint";
    hint.textContent="Harold is listening. Choose whether to confront him openly or let Vera leave first.";
    choices.appendChild(hint);
    VERA_OPTIONS.forEach(option=>choices.appendChild(makeButton(option.label,()=>{
      state=chooseVeraDecision(state,option.id);commit();
    })));
  }
  if(portraitPanel){
    const heading=document.createElement("strong");heading.textContent="HIDDEN PORTRAIT / MECHANICAL NAMEPLATES";
    choices.appendChild(heading);
    const hint=document.createElement("div");hint.className="agency-hint";
    hint.textContent="Selected: "+(manor.portraitSequence.length?manor.portraitSequence.join(" → ").toUpperCase():"NONE")+
      ". Eleanor's diary contains the intended order.";
    choices.appendChild(hint);
    PORTRAIT_OPTIONS.forEach(option=>choices.appendChild(makeButton(option.label,()=>{
      state=choosePortrait(state,option.id);commit();
    })));
  }
  if(watchmanPanel){
    const heading=document.createElement("strong");heading.textContent="NIGHT WATCHMAN / DOCKSIDE INTERVIEW";choices.appendChild(heading);
    WATCHMAN_OPTIONS.forEach(option=>{
      const button=makeButton(option.label,()=>{state=chooseWatchman(state,option.id);commit();});
      button.disabled=warehouse.watchmanAsked.includes(option.id);choices.appendChild(button);
    });
  }
  if(sealPanel){
    const heading=document.createElement("strong");heading.textContent="FREIGHT SEAL / QUAY • SHIFT • BAY";
    choices.appendChild(heading);
    const hint=document.createElement("div");hint.className="agency-hint";
    hint.textContent="Find the manifest in the dispatch office. The wheels follow QUAY / SHIFT / BAY.";
    choices.appendChild(hint);
    const dials=document.createElement("div");dials.className="safe-dials";
    ["QUAY","SHIFT","BAY"].forEach((label,i)=>{
      const col=document.createElement("div");col.className="safe-dial";
      const cap=document.createElement("span");cap.textContent=label;col.appendChild(cap);
      col.appendChild(makeButton("▲",()=>{state=adjustFreightSeal(state,i,1);commit();},{"aria-label":"Increase "+label+" digit"}));
      const out=document.createElement("output");out.textContent=String(warehouse.sealDigits[i]);col.appendChild(out);
      col.appendChild(makeButton("▼",()=>{state=adjustFreightSeal(state,i,-1);commit();},{"aria-label":"Decrease "+label+" digit"}));
      dials.appendChild(col);
    });
    choices.appendChild(dials);
    choices.appendChild(makeButton("RELEASE FREIGHT SEAL",()=>{state=submitFreightSeal(state);commit();}));
  }
  if(tunnelPanel){
    const heading=document.createElement("strong");heading.textContent="SERVICE TUNNEL / CHOOSE WHAT TO PROTECT";choices.appendChild(heading);
    TUNNEL_OPTIONS.forEach(option=>choices.appendChild(makeButton(option.label,()=>{
      state=chooseTunnel(state,option.id);commit();
    })));
  }
  if(elsiePanel){
    const heading=document.createElement("strong");heading.textContent="ELSIE VALE / PLATFORM ZERO";choices.appendChild(heading);
    ELSIE_OPTIONS.forEach(option=>{
      const button=makeButton(option.label,()=>{state=chooseElsie(state,option.id);commit();});
      button.disabled=rails.elsieAsked.includes(option.id);
      choices.appendChild(button);
    });
  }
  if(switchPanel){
    const heading=document.createElement("strong");heading.textContent="SIGNAL BOARD / RESTORE CAR 09 ROUTE";choices.appendChild(heading);
    const hint=document.createElement("div");hint.className="agency-hint";
    hint.textContent="Sequence: "+(rails.switchSequence.length?rails.switchSequence.join(" → "):"NONE")+". Find the emergency map or signed dispatch timetable for the route.";
    choices.appendChild(hint);
    SWITCH_OPTIONS.forEach(option=>choices.appendChild(makeButton(option.label,()=>{
      state=chooseSignal(state,option.id);commit();
    })));
  }
  if(exchangePanel){
    const heading=document.createElement("strong");heading.textContent="THE OLD EXCHANGE / YOUR NEXT MOVE";choices.appendChild(heading);
    const hint=document.createElement("div");hint.className="agency-hint";
    hint.textContent="Keep Eleanor's ticket and the original Kingfisher ledger safe before descending.";
    choices.appendChild(hint);
    EXIT_OPTIONS.forEach(option=>choices.appendChild(makeButton(option.label,()=>{
      state=chooseExchange(state,option.id);commit();
    })));
  }
  if(maraPanel){
    const heading=document.createElement("strong");heading.textContent="MARA BELL / THE EXCHANGE";choices.appendChild(heading);
    MARA_OPTIONS.forEach(option=>{
      const btn=makeButton(option.label,()=>{state=chooseMara(state,option.id);commit();});
      btn.disabled=ex.maraAsked.includes(option.id);choices.appendChild(btn);
    });
  }
  if(reconciliationPanel){
    const heading=document.createElement("strong");heading.textContent="RECONCILIATION / "+ex.boardLinks.length+" OF 3 RECORDS";choices.appendChild(heading);
    const hint=document.createElement("div");hint.className="agency-hint";
    hint.textContent="Compare the dock, train and financial originals against documents recovered during the investigation.";
    choices.appendChild(hint);
    EXCHANGE_BOARD_OPTIONS.forEach(option=>{
      const btn=makeButton((ex.boardLinks.includes(option.id)?"✓ ":"")+option.label,()=>{
        state=chooseReconciliation(state,option.id);commit();
      });
      btn.disabled=ex.boardLinks.includes(option.id);choices.appendChild(btn);
    });
  }
  if(courierPanel){
    const heading=document.createElement("strong");heading.textContent="THE COURIER / THE BLUE DOOR";choices.appendChild(heading);
    COURIER_OPTIONS.forEach(option=>choices.appendChild(makeButton(option.label,()=>{
      state=chooseCourier(state,option.id);commit();
    })));
  }
  drawScene();
}
canvas.addEventListener("click",e=>{
  if(state.status!=="playing")return;
  const r=canvas.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width*320,y=(e.clientY-r.top)/r.height*200;
  // Later hotspots are foreground objects and override their background regions.
  const visible=new Set(visibleTargets(state).map(x=>x[0]));
  const hits=(zones[state.room]||[]).filter(([id,l,t,w,h])=>visible.has(id)&&x>=l&&x<=l+w&&y>=t&&y<=t+h);
  const selected=hits.at(-1);
  if(selected)doAction(selected[0]);else if(verb==="LOOK") { state=act(state,"LOOK","");commit(); }
});
canvas.addEventListener("mousemove",e=>{
  const r=canvas.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width*320,y=(e.clientY-r.top)/r.height*200;
  const visible=new Set(visibleTargets(state).map(x=>x[0]));
  canvas.style.cursor=(zones[state.room]||[]).some(([id,l,t,w,h])=>visible.has(id)&&x>=l&&x<=l+w&&y>=t&&y<=t+h)?"pointer":"default";
});
document.addEventListener("keydown",e=>{
  if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA/.test(document.activeElement?.tagName||""))return;
  const n=Number(e.key);
  if(n>=1&&n<=6){verb=VERBS[n-1];if(verb!=="USE")item="";render();}
});
$("storyMode").addEventListener("change",e=>{state=setStoryMode(state,e.target.checked);commit();});
$("continueBtn").addEventListener("click",()=>{state=continueCase(state);verb="LOOK";item="";commit();});
$("continueAgencyBtn").addEventListener("click",()=>{state=continueAgencyCase(state);verb="LOOK";item="";commit();});
$("continueManorBtn").addEventListener("click",()=>{state=continueManorCase(state);verb="LOOK";item="";commit();});
$("continueWarehouseBtn").addEventListener("click",()=>{state=continueWarehouseCase(state);verb="LOOK";item="";commit();});
$("continueRailsBtn").addEventListener("click",()=>{state=continueRailCase(state);verb="LOOK";item="";commit();});
$("continueExchangeBtn").addEventListener("click",()=>{state=continueExchangeCase(state);verb="LOOK";item="";commit();});
$("restartBtn").addEventListener("click",()=>{
  if(!window.confirm("Start a new case? The current auto-save will be replaced. Export first if you want to keep it."))return;
  state=initialState();verb="LOOK";item="";$("fileMessage").textContent="Fresh case opened.";commit();
});
$("exportBtn").addEventListener("click",()=>{
  const content=JSON.stringify(state,null,2);
  const url=URL.createObjectURL(new Blob([content],{type:"application/json"}));
  const a=document.createElement("a");a.href=url;a.download="blackout-case-v7.json";
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
  $("fileMessage").textContent="Case file exported. You can restore it later.";
});
$("importBtn").addEventListener("click",()=>$("importFile").click());
$("importFile").addEventListener("change",async e=>{
  const file=e.target.files?.[0];if(!file)return;
  if(file.size>128*1024){$("fileMessage").textContent="Case file too large.";e.target.value="";return;}
  try {
    const data=JSON.parse(await file.text());
    state=validateSave(data);
    verb="LOOK";item="";$("fileMessage").textContent="Case file restored.";commit();
  } catch(err){$("fileMessage").textContent=err?.message||"Couldn't load that file.";}
  e.target.value="";
});
try {
  const raw=localStorage.getItem(STORAGE_KEY);
  state=raw?validateSave(JSON.parse(raw)):initialState();
} catch(err){state=initialState();}
render();
if(!prefersReducedMotion){
  let last=0;
  function animate(now){requestAnimationFrame(animate);if(now-last<85)return;last=now;frame++;drawScene();}
  requestAnimationFrame(animate);
}
