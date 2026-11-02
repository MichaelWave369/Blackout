/* BLACKOUT Chapter 9: The Silhouette Network.
 * Original fictional noir mystery. State rules independent of the browser.
 * The Silhouette network is a compartmentalized surveillance operation;
 * this chapter does not establish who Kingfisher is.
 */
export const SILHOUETTE_HOTSPOTS={
  networkFoyer:[
    ["nora","Nora Finch, former switchboard archivist"],
    ["emblem","Silhouette network emblem"],["notice","Security bulletin"],
    ["archive","Locked interception archive"],["stairs","Cartography gallery"],
    ["phone","Unlisted telephone"],["vent","Cold-air vent"]
  ],
  mapGallery:[
    ["map","Signal network wall map"],["registry","Cell registry drawer"],
    ["sheet","Cell registry extract"],["acetate","Transparent relay overlay"],
    ["index","Routing legend"],["photo","Photograph of the riverfront"],
    ["foyer","Return to service foyer"]
  ],
  listenArchive:[
    ["cabinet","Sealed interception file cabinet"],["intercepts","Night intercept log"],
    ["reel","Magnetic transmission spool"],["desk","Archivist's desk"],
    ["wire","Listening headphones"],["hatch","Signal junction hatch"],
    ["return","Return to service foyer"]
  ],
  signalJunction:[
    ["panel","Three-stage signal router"],["line","Live intercept terminal"],
    ["mask","Mask registry terminal"],["antenna","Coaxial antenna"],["clock","Unsynchronized clock"],
    ["evidence","Evidence packet"],["exit","Return to interception archive"]
  ]
};
export const NORA_OPTIONS=[
  {id:"role",label:"ASK ABOUT THE SILHOUETTE EMBLEM"},
  {id:"proof",label:"SHOW THE ORIGINAL HOTEL NEGATIVE"},
  {id:"protect",label:"PROMISE TO PROTECT CIVILIAN OPERATORS"},
  {id:"accuse",label:"ACCUSE NORA OF SERVING KINGFISHER"},
  {id:"close",label:"END INTERVIEW"}
];
export const ROUTER_OPTIONS=[
  {id:"hotel",label:"ROUTE FROM MARMONT HOTEL"},
  {id:"exchange",label:"ROUTE THROUGH OLD EXCHANGE"},
  {id:"river",label:"ROUTE TO RIVERFRONT RELAY"},
  {id:"police",label:"ROUTE THROUGH POLICE DISPATCH"},
  {id:"reset",label:"CLEAR SIGNAL ROUTE"}
];
export const SOURCE_OPTIONS=[
  {id:"shield",label:"REDACT THE CIVILIAN OPERATORS' NAMES"},
  {id:"trace",label:"PURSUE THE LIVE SIGNAL AT ONCE"},
  {id:"back",label:"REVIEW THE EVIDENCE BEFORE DECIDING"}
];
const ROUTE=["hotel","exchange","river"];
const clone=s=>JSON.parse(JSON.stringify(s));
function say(s,message,kind="narration"){
 s.transcript.push({id:(s.transcript.at(-1)?.id||0)+1,text:message,kind});
 s.transcript=s.transcript.slice(-35);
}
function award(s,group,id,message){
 if(!s[group].includes(id)){s[group].push(id);if(message)say(s,message,"evidence");}
}
function enter(s,room,message){
 s.room=room;if(!s.discovered.includes(room))s.discovered.push(room);
 s.case9.dialogue=null;s.case9.routePanel=false;s.case9.sourcePanel=false;
 say(s,message,"chapter");
}
export function freshSilhouetteCase(chapter8Choice=""){
 return {
  priorChoice:chapter8Choice==="vera"?"vera":"solo",
  noraTrust:chapter8Choice==="vera"?1:0,
  noraMet:false,noraAsked:[],noraAccess:false,dialogue:null,
  registryOpen:false,registryTaken:false,overlayTaken:false,mapRead:false,
  cabinetOpen:false,interceptsTaken:false,spoolTaken:false,
  routePanel:false,routeSequence:[],routeSolved:false,transmissionHeard:false,
  sourcePanel:false,packetTaken:false,decision:""
 };
}
export function silhouetteTargets(s){
 const c=s.case9;if(!c)return[];
 return (SILHOUETTE_HOTSPOTS[s.room]||[]).filter(([id])=>{
  if(id==="sheet")return c.registryOpen&&!c.registryTaken;
  if(id==="acetate")return !c.overlayTaken;
  if(id==="intercepts")return c.cabinetOpen&&!c.interceptsTaken;
  if(id==="reel")return !c.spoolTaken;
  if(id==="evidence")return c.routeSolved&&!c.packetTaken;
  return true;
 });
}
function look(s,target){
 const c=s.case9;
 const descriptions={
  networkFoyer:{
   nora:"Nora Finch sits beneath a failing lamp, trying not to look at Vincent's coat. She once recorded calls for a network that should not exist.",
   emblem:"A masked silhouette inside three overlapping circles. One ring bears the letter K, but no actual name.",
   notice:"SECURITY BULLETIN: Operators must never know the identities of their upstream sponsors.",
   archive:c.noraAccess?"The interception archive is now unlocked.":"The archive has a mechanical latch. Nora holds the authorization key.",
   stairs:"A steel staircase leads to a cartography gallery where the network's coverage was plotted.",
   phone:c.priorChoice==="vera"?"Vera's contact left the receiver lifted. Nora already expects a safe messenger.":"The unlisted telephone is silent. Nobody has warned the network of your arrival.",
   vent:"A steady draft carries the smell of river water and ozone."
  },
  mapGallery:{
   map:"Three lines are annotated ORIGIN: MARMONT HOTEL, RELAY: OLD EXCHANGE, DESTINATION: RIVERFRONT. The police-dispatch route is crossed out.",
   registry:c.registryOpen?"The drawer is open. A cell registry extract remains inside.":"A map drawer stamped CELLS / DO NOT DISTRIBUTE.",
   sheet:"A registry of low-ranking signal operators. No financier's name appears, only codewords and numbered relays.",
   acetate:"An overlay aligns the hotel camera with the Exchange and the riverfront relay. It can be laid over the routing board.",
   index:"The three circles represent origin, relay, and destination. Their alignment, not a combination number, opens the upstream transmission.",
   photo:"A photograph shows an unmarked riverfront communications tower beside the North Canal.",
   foyer:"The stairs descend back to Nora's lamp-lit service foyer."
  },
  listenArchive:{
   cabinet:c.cabinetOpen?"The file cabinet is open. Its interception log is still inside.":"A locked steel drawer with an old lever latch.",
   intercepts:"A log traces calls from room 214 to the Old Exchange, then to a riverfront relay. The police line is a planted decoy.",
   reel:"A spool of scrambled station audio with a strange repeating call sign: SABLE.",
   desk:"The archivist's desk has a burned ledger corner and a visitor card with no recorded name.",
   wire:"Cold listening headphones rest beside a dead switchboard.",
   hatch:"The router room is behind this maintenance hatch. The signal paths can be reconstructed there.",
   return:"Back to the service foyer and Nora Finch."
  },
  signalJunction:{
   panel:c.routeSolved?"The routed signal path is lit green: HOTEL → EXCHANGE → RIVER.":"A three-stage routing board. Labels show hotel, Exchange, riverfront, and a tempting police-dispatch decoy.",
   line:"A live line pulses under the call sign SABLE. It cannot be traced reliably until the original route is restored.",
   mask:"The network uses disposable masks and numbered cells. The person called Kingfisher is not named in this terminal.",
   antenna:"Coax cables descend into the old city's tunnels and run north toward the canal.",
   clock:"Three unsynchronized clocks display different times. They were never meant to be evidence.",
   evidence:"A newly printed packet of routing records and the North Canal relay coordinate.",
   exit:"Return to the interception archive."
  }
 };
 say(s,descriptions[s.room]?.[target]||"Only disconnected lines and abandoned notes.");
 if(s.room==="mapGallery"&&target==="map"){
  c.mapRead=true;
  award(s,"clues","silhouette-route-map","NOTEBOOK: The route is MARMONT HOTEL → OLD EXCHANGE → RIVERFRONT. Police dispatch is a false trail.");
 }
 if(s.room==="signalJunction"&&target==="mask")
  award(s,"clues","silhouette-cell-structure","NOTEBOOK: Silhouette consists of separated cells. Kingfisher remains an unidentified sponsor or code name.");
 if(s.room==="signalJunction"&&target==="clock")
  award(s,"clues","false-timestamps","NOTEBOOK: The network deliberately ran unsynchronized clocks, undermining the apparent time trail.");
 if(s.room==="mapGallery"&&target==="photo")
  award(s,"clues","north-canal-tower","NOTEBOOK: A communications tower near North Canal matches the map's final relay.");
}
function open(s,target){
 const c=s.case9;
 if(s.room==="mapGallery"&&target==="registry"){
  if(c.registryOpen){say(s,"The map drawer is already open.");return;}
  c.registryOpen=true;say(s,"The drawer clicks open. Its registry extract records operators, but none of the organization's financiers.","evidence");return;
 }
 if(s.room==="listenArchive"&&target==="cabinet"){
  if(c.cabinetOpen){say(s,"The interception drawer is already open.");return;}
  c.cabinetOpen=true;say(s,"The steel drawer slides open. An intercept log reveals a disguised call chain.","evidence");return;
 }
 if(s.room==="signalJunction"&&target==="panel"){
  if(c.routeSolved){say(s,"The signal path is already aligned and its original packet can be collected.");return;}
  if(!s.inventory.includes("silhouette-overlay")||!s.inventory.includes("intercept-log")){
   say(s,"The signal board needs the cartography overlay and the intercepted call log. Find both before routing.","warning");return;
  }
  c.routePanel=true;
  say(s,"The original routing documents are in place. Route ORIGIN → RELAY → DESTINATION. Ignore the decoy.","choice");
  return;
 }
 say(s,"There's nothing here you can open.");
}
function take(s,target){
 const c=s.case9;
 if(s.room==="mapGallery"&&target==="sheet"&&c.registryOpen&&!c.registryTaken){
  c.registryTaken=true;
  award(s,"inventory","cell-registry","INVENTORY: Silhouette civilian cell registry.");
  award(s,"clues","cell-operators","NOTEBOOK: Several low-level signal operators appear in separate, compartmentalized cells.");
 }else if(s.room==="mapGallery"&&target==="acetate"&&!c.overlayTaken){
  c.overlayTaken=true;
  award(s,"inventory","silhouette-overlay","INVENTORY: Signal-route acetate overlay.");
  award(s,"clues","route-overlay","NOTEBOOK: Overlay maps the Marmont to the Exchange, then the riverfront.");
 }else if(s.room==="listenArchive"&&target==="intercepts"&&c.cabinetOpen&&!c.interceptsTaken){
  c.interceptsTaken=true;
  award(s,"inventory","intercept-log","INVENTORY: Original overnight signal intercept log.");
  award(s,"clues","intercept-chain","NOTEBOOK: Signal log confirms a route via the Exchange to riverfront, not the police dispatch.");
 }else if(s.room==="listenArchive"&&target==="reel"&&!c.spoolTaken){
  c.spoolTaken=true;
  award(s,"inventory","sable-spool","INVENTORY: Scrambled station audio, call sign SABLE.");
  award(s,"clues","sable-call","NOTEBOOK: SABLE is a recurring call sign, not proof of a person's identity.");
 }else if(s.room==="signalJunction"&&target==="evidence"&&c.routeSolved&&!c.packetTaken){
  c.packetTaken=true;
  award(s,"inventory","silhouette-packet","INVENTORY: Original routed intercept packet.");
  award(s,"clues","north-canal-lead","NOTEBOOK: A live relay leads toward North Canal's communications tower.");
  award(s,"memories","silhouette-memory","MEMORY FRAGMENT 09: Eleanor points at three circles. 'Nobody in one room knows who's watching from the next.'");
 }else say(s,"That evidence cannot be collected yet.");
}
function go(s,target){
 const c=s.case9;
 if(s.room==="networkFoyer"&&target==="stairs"){
  enter(s,"mapGallery","CARTOGRAPHY GALLERY. The city is drawn as a web of overlapping signal circles.");return;
 }
 if(s.room==="networkFoyer"&&target==="archive"){
  if(!c.noraAccess){say(s,"The interception archive needs Nora's key. She can verify the original film.","warning");return;}
  enter(s,"listenArchive","INTERCEPTION ARCHIVE. A sealed steel file cabinet sits beside a humming radio rack.");return;
 }
 if(s.room==="mapGallery"&&target==="foyer"){
  enter(s,"networkFoyer","SERVICE FOYER. Nora Finch waits beneath the faulty lamp.");return;
 }
 if(s.room==="listenArchive"&&target==="return"){
  enter(s,"networkFoyer","SERVICE FOYER. The unlisted telephone still hangs unanswered.");return;
 }
 if(s.room==="listenArchive"&&target==="hatch"){
  enter(s,"signalJunction","SIGNAL JUNCTION. Three-stage routing levers wait to trace the network's original call chain.");return;
 }
 if(s.room==="signalJunction"&&target==="exit"){
  enter(s,"listenArchive","INTERCEPTION ARCHIVE. The steel cabinet is now empty except for folders.");return;
 }
 say(s,"You cannot reach that destination from here.");
}
function talk(s,target){
 const c=s.case9;
 if(s.room==="networkFoyer"&&target==="nora"){
  c.noraMet=true;c.dialogue="nora";
  say(s,c.priorChoice==="vera"?
   "Nora looks at Vincent's coat. 'Vera called me about the original negative. Don't assume all of us agreed to this operation.'":
   "'I wasn't expecting a visitor. If you really have the film, show me. I'm done taking orders from shadows.'","choice");
  return;
 }
 if(s.room==="networkFoyer"&&target==="phone"){
  say(s,c.priorChoice==="vera"?
   "Vera's coded contact message is still on the line: 'Find the origin. Protect people who weren't given the choice.'":
   "No answer. By keeping the negative secret, you reached this place without warning Nora.","choice");
  return;
 }
 if(s.room==="signalJunction"&&target==="line"){
  if(!c.routeSolved){
   say(s,"Static and broken code. The call can be understood only after restoring the original path.","warning");return;
  }
  c.transmissionHeard=true;c.sourcePanel=true;
  award(s,"clues","north-canal-message","NOTEBOOK: A live SABLE transmission directs a vehicle to North Canal. No named suspect is confirmed.");
  say(s,"The hidden line clears. 'SABLE to river relay. Cargo moved north. Keep the civilian operators out of the report.' The line dies.","choice");
  return;
 }
 say(s,"Only a long electronic hum answers.");
}
function use(s,target,item){
 if(s.room==="networkFoyer"&&target==="nora"&&item==="original-negative"&&s.inventory.includes(item)){
  talk(s,target);say(s,"You show Nora the original uncut Marmont negative. Her attention sharpens.","evidence");return;
 }
 if(s.room==="signalJunction"&&target==="panel"&&item==="silhouette-overlay"&&s.inventory.includes(item)){
  open(s,"panel");return;
 }
 say(s,"That combination does not reconnect the signal.");
}
export function silhouetteAction(s,verb,target,item=""){
 if(s.chapter!==9||s.status!=="playing"||!s.case9||!SILHOUETTE_HOTSPOTS[s.room])return s;
 if(verb==="LOOK"){
  if(!target)say(s,{
   networkFoyer:"Nora Finch guards a hidden archive beneath an emblem of three overlapping circles.",
   mapGallery:"An oversized network map traces the city's forgotten surveillance relays.",
   listenArchive:"A cold listening room still contains an overnight log and a scrambled spool.",
   signalJunction:"A three-stage routing system promises to reveal where the network's last live signal went."
  }[s.room]);else look(s,target);
 }else if(verb==="OPEN")open(s,target);
 else if(verb==="TAKE")take(s,target);
 else if(verb==="GO")go(s,target);
 else if(verb==="TALK")talk(s,target);
 else if(verb==="USE")use(s,target,item);
 s.actions+=1;return s;
}
export function chooseNora(state,choice){
 const s=clone(state),c=s.case9;
 if(s.chapter!==9||s.status!=="playing"||s.room!=="networkFoyer"||c?.dialogue!=="nora"||
  !NORA_OPTIONS.some(o=>o.id===choice))return s;
 if(choice==="close"){c.dialogue=null;say(s,"Nora returns to her ledger. 'I won't be here after sunrise.'","choice");return s;}
 if(c.noraAsked.includes(choice)){
  say(s,"'I already told you what I can, detective.'","choice");return s;
 }
 c.noraAsked.push(choice);
 if(choice==="role"){
  award(s,"clues","nora-cells","NOTEBOOK: Nora says Silhouette's civilian operators never knew their ultimate sponsor.");
  say(s,"'It was built so each desk knew only one other desk. One signature could command us all, yet none of us knew who signed.'","choice");
 }else if(choice==="protect"){
  c.noraTrust=Math.min(3,c.noraTrust+2);
  say(s,"'You're not my target, Nora. Whoever used you is.' For the first time she looks relieved.","choice");
 }else if(choice==="accuse"){
  c.noraTrust=Math.max(-3,c.noraTrust-2);
  say(s,"'You helped them spy on a man before a murder.' Nora looks toward the locked archive. 'I kept copies so somebody might stop it.'","choice");
 }else if(choice==="proof"){
  if(!s.inventory.includes("original-negative")){
   c.noraAsked=c.noraAsked.filter(x=>x!==choice);
   say(s,"You need the original uncut surveillance negative before Nora will authorize the archive.","warning");return s;
  }
  // The negative proves the case's authenticity and can rebuild trust after accusations.
  c.noraTrust=Math.max(0,c.noraTrust);
  c.noraAccess=true;
  award(s,"inventory","archive-pass","INVENTORY: Nora's interception archive authorization.");
  award(s,"clues","nora-authentication","NOTEBOOK: Nora confirms the uncut room-214 negative predates the murder.");
  say(s,"Nora inspects the original timestamps, then hands you her archive pass. 'This is real. Somebody planned the surveillance. The relay map will show you where they went.'","evidence");
 }
 s.actions+=1;return s;
}
export function chooseRoute(state,choice){
 const s=clone(state),c=s.case9;
 if(s.chapter!==9||s.status!=="playing"||s.room!=="signalJunction"||!c?.routePanel||
  c.routeSolved||!ROUTER_OPTIONS.some(o=>o.id===choice))return s;
 if(choice==="reset"){c.routeSequence=[];say(s,"The routing board clears to its default state.","choice");return s;}
 const position=c.routeSequence.length;
 if(ROUTE[position]!==choice){
  c.routeSequence=[];
  say(s,"The switching lamps flash red. A false path was selected. Recheck the map and intercept log.","warning");return s;
 }
 c.routeSequence.push(choice);
 if(c.routeSequence.length===ROUTE.length){
  c.routeSolved=true;c.routePanel=false;
  award(s,"clues","silhouette-route-proved","NOTEBOOK: The actual surveillance route was HOTEL → EXCHANGE → RIVERFRONT. Police dispatch was a decoy.");
  say(s,"The circuit opens: hotel camera → Exchange relay → riverfront tower. A fresh packet prints while a live SABLE signal starts to pulse.","evidence");
 }else say(s,"One relay locks green. Follow the evidence to the next stage.","choice");
 s.actions+=1;return s;
}
export function chooseSource(state,choice){
 const s=clone(state),c=s.case9;
 if(s.chapter!==9||s.status!=="playing"||s.room!=="signalJunction"||!c?.sourcePanel||
  !SOURCE_OPTIONS.some(o=>o.id===choice))return s;
 if(choice==="back"){c.sourcePanel=false;say(s,"You disconnect the live line and review your evidence.","choice");return s;}
 if(!c.packetTaken||!c.registryTaken||!c.transmissionHeard){
  say(s,"Preserve the original packet and civilian registry, and listen to the live transmission before deciding.","warning");return s;
 }
 c.decision=choice;c.sourcePanel=false;
 if(choice==="shield"){
  award(s,"clues","shielded-operators","NOTEBOOK: Vincent redacted civilian operator names and protected their identities for now.");
  say(s,"You seal the unredacted registry and carry a redacted report. Low-ranking operators won't be sacrificed to protect their unseen sponsors.","choice");
 }else{
  award(s,"clues","live-north-canal","NOTEBOOK: Vincent chose to pursue the active North Canal relay before the signal vanished.");
  say(s,"You leave the desk lamp burning and head for the canal while the transmission is still live. The names in your pocket may soon become a liability.","choice");
 }
 s.status="chapter9complete";
 say(s,"CHAPTER 9 COMPLETE: Silhouette is a network of compartmentalized watchers. The Kingfisher remains unnamed. A live signal points to the North Canal, where Eleanor's trail continues.","ending");
 return s;
}
export function sanitizeSilhouetteCase(input){
 const s=freshSilhouetteCase();
 if(!input||typeof input!=="object"||Array.isArray(input))return s;
 for(const key of Object.keys(s))if(typeof s[key]==="boolean"&&typeof input[key]==="boolean")s[key]=input[key];
 s.priorChoice=input.priorChoice==="vera"?"vera":"solo";
 s.noraTrust=Number.isInteger(input.noraTrust)?Math.max(-3,Math.min(3,input.noraTrust)):0;
 if(Array.isArray(input.noraAsked))
  s.noraAsked=[...new Set(input.noraAsked.filter(x=>NORA_OPTIONS.some(o=>o.id===x&&x!=="close")))].slice(0,4);
 if(Array.isArray(input.routeSequence)){
  const value=input.routeSequence.slice(0,3);
  if(value.every((x,i)=>x===ROUTE[i]))s.routeSequence=value;
 }
 if(s.routeSolved){s.routeSequence=[...ROUTE];s.routePanel=false;}
 if(input.dialogue==="nora")s.dialogue="nora";
 if(input.decision==="shield"||input.decision==="trace")s.decision=input.decision;
 if(s.decision)s.sourcePanel=false;
 return s;
}
