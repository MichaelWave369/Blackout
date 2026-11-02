/* BLACKOUT Chapter 10: North Canal.
 * Original fictional noir, deterministic rules, no browser dependencies.
 * Kingfisher's identity remains unknown; the trail points to Lantern House.
 */
export const CANAL_HOTSPOTS={
 canalWalk:[
  ["iris","Iris Pike, radio engineer"],["notice","Canal maintenance notice"],
  ["water","Canal water"],["hut","Radio relay hut"],["barge","Moored freight barge"],
  ["tower","North Canal transmitter"],["lamp","Towpath lamp"]
 ],
 relayHut:[
  ["cabinet","Calibrations cabinet"],["calibration","Original calibration sheet"],
  ["log","SABLE traffic log"],["radio","Relay radio"],["map","Route diagram"],
  ["window","Canal-facing window"],["exit","Return to towpath"]
 ],
 bargeDeck:[
  ["crate","Sealed transfer crate"],["tag","Transfer cargo tag"],
  ["cloth","Blue wool scrap"],["manifest","Dock delivery register"],
  ["bell","Ship's bell"],["shore","Return to towpath"],["hatch","Locked cargo hold"]
 ],
 towerControl:[
  ["router","North Canal signal router"],["receiver","Live wire receiver"],
  ["printout","Original signal trace"],["antenna","Transmitter mast"],
  ["clock","Unsynchronized dial"],["window","Towpath view"],["exit","Return to towpath"]
 ]
};
export const IRIS_OPTIONS=[
 {id:"sable",label:"ASK ABOUT THE SABLE TRANSMISSION"},
 {id:"protect",label:"PROMISE TO KEEP IRIS OUT OF THE REPORT"},
 {id:"accuse",label:"ACCUSE IRIS OF HELPING THE TRANSFERS"},
 {id:"proof",label:"SHOW THE ORIGINAL SILHOUETTE SIGNAL PACKET"},
 {id:"close",label:"END THE CONVERSATION"}
];
export const CANAL_ROUTE_OPTIONS=[
 {id:"lock",label:"ROUTE THROUGH CANAL LOCK"},
 {id:"barge",label:"ROUTE THROUGH TRANSFER BARGE"},
 {id:"tower",label:"ROUTE TO NORTH CANAL TOWER"},
 {id:"police",label:"ROUTE THROUGH POLICE DISPATCH"},
 {id:"reset",label:"RESET ROUTING SWITCHES"}
];
export const CANAL_END_OPTIONS=[
 {id:"divert",label:"TRANSMIT A DIVERSION TO PROTECT IRIS"},
 {id:"pursue",label:"FOLLOW THE LANTERN HOUSE TRANSFER IMMEDIATELY"},
 {id:"back",label:"REVIEW THE TRACE BEFORE LEAVING"}
];
const ROUTE=["lock","barge","tower"];
const copy=s=>JSON.parse(JSON.stringify(s));
function say(s,message,kind="narration"){
 s.transcript.push({id:(s.transcript.at(-1)?.id||0)+1,text:message,kind});
 s.transcript=s.transcript.slice(-35);
}
function award(s,group,id,message){
 if(!s[group].includes(id)){s[group].push(id);if(message)say(s,message,"evidence");}
}
function enter(s,room,message){
 s.room=room;if(!s.discovered.includes(room))s.discovered.push(room);
 s.case10.dialogue=null;s.case10.routePanel=false;s.case10.endPanel=false;
 say(s,message,"chapter");
}
export function freshCanalCase(priorChoice=""){
 return {
  priorChoice:priorChoice==="shield"?"shield":"trace",
  irisTrust:priorChoice==="shield"?1:-1,
  irisMet:false,irisAsked:[],irisPass:false,dialogue:null,
  cabinetOpen:false,calibrationTaken:false,logTaken:false,
  crateOpen:false,tagTaken:false,clothTaken:false,
  routePanel:false,routeSequence:[],routeSolved:false,
  traceTaken:false,callHeard:false,endPanel:false,decision:""
 };
}
export function canalTargets(s){
 const c=s.case10;if(!c)return[];
 return (CANAL_HOTSPOTS[s.room]||[]).filter(([id])=>{
  if(id==="calibration")return c.cabinetOpen&&!c.calibrationTaken;
  if(id==="log")return c.cabinetOpen&&!c.logTaken;
  if(id==="tag")return c.crateOpen&&!c.tagTaken;
  if(id==="cloth")return c.crateOpen&&!c.clothTaken;
  if(id==="printout")return c.routeSolved&&!c.traceTaken;
  return true;
 });
}
function look(s,target){
 const c=s.case10;
 const descriptions={
  canalWalk:{
   iris:"Iris Pike, a canal radio engineer, watches the transmitter mast while pretending to adjust a dead portable set.",
   notice:"NORTH CANAL MAINTENANCE: signal route is LOCK → BARGE → TOWER. POLICE is crossed out in red ink.",
   water:"Beneath oily ripples, the reflection of the tower breaks into three disconnected stripes.",
   hut:c.irisPass?"Iris has opened the relay hut. The original calibration records remain inside.":"The relay hut is locked by a mechanical pass. Iris Pike guards the only key.",
   barge:"An unregistered freight barge has been tied to the canal wall. Its cargo register looks recently handled.",
   tower:c.calibrationTaken&&c.tagTaken?"The North Canal tower control door is ready for inspection.":"The tower requires the relay calibration sheet and the barge's original transfer tag for access.",
   lamp:"An amber lamp sways in the dawn wind. The canal never seems to get lighter."
  },
  relayHut:{
   cabinet:c.cabinetOpen?"The calibration drawer is open. Its signed documents are laid out.":"A filing cabinet still holds original radio calibration and traffic sheets.",
   calibration:"Calibration sheet: station SABLE, signal path LOCK / BARGE / TOWER. Police dispatch is a known false feed.",
   log:"A live call recorded at 5:47: a passenger marked E.A. was transferred to Lantern House by canal vehicle.",
   radio:"A short burst repeats SABLE-12 and the words 'LOCK FIRST, BARGE SECOND, TOWER THIRD'.",
   map:"The route diagram has three consecutive nodes: canal lock, transfer barge, North Canal tower. Police is a decoy.",
   window:"A transfer barge rocks against the river wall. The transmission tower rises beyond it.",
   exit:"The towpath is only a few steps outside."
  },
  bargeDeck:{
   crate:c.crateOpen?"A false-bottom freight crate stands open. Two evidence items were packed inside.":"A transfer crate bears a painted K and has a suspicious loose bottom board.",
   tag:"A blue-bordered cargo tag: E.A., destination LANTERN HOUSE, clearance SABLE-12. A handwritten note says 'still breathing'.",
   cloth:"A torn blue wool scrap caught under the cargo crate. Eleanor wore a blue coat on the night train.",
   manifest:"Dock register: a woman identified only by E.A. was moved from the Exchange to an unregistered canal barge.",
   bell:"The bell bears the number twelve, matching the SABLE-12 code on the radio.",
   shore:"The towpath and relay hut are visible from the deck.",
   hatch:"The hold has been emptied and welded shut. The transfer vehicle is gone."
  },
  towerControl:{
   router:c.routeSolved?"The restored route glows green: LOCK → BARGE → TOWER. The genuine trace has printed.":"An old radio switchboard with LOCK, BARGE, TOWER, and a false POLICE channel.",
   receiver:"The live line is identified only as SABLE. Its destination is concealed until the signal route is reconstructed.",
   printout:"An original tower log proves the SABLE-12 transfer was routed toward Lantern House. The person directing it is not named.",
   antenna:"Three mast segments carry the signal north. A vehicle crossed the canal shortly before dawn.",
   clock:"Another altered clock. The original radio timestamps are the only reliable timings here.",
   window:"A truck disappears beyond the waterworks. Its direction matches Lantern House on the delivery register.",
   exit:"The door opens back onto the silent towpath."
  }
 };
 say(s,descriptions[s.room]?.[target]||"The canal gives you nothing new.");
 if(s.room==="canalWalk"&&target==="notice")
  award(s,"clues","canal-route-order","NOTEBOOK: The canal maintenance notice shows LOCK → BARGE → TOWER, with POLICE marked false.");
 if(s.room==="relayHut"&&target==="map")
  award(s,"clues","canal-map","NOTEBOOK: The relay diagram independently confirms LOCK → BARGE → TOWER.");
 if(s.room==="bargeDeck"&&target==="manifest")
  award(s,"clues","barge-transfer","NOTEBOOK: The canal barge register ties the Exchange to a transfer marked E.A.");
 if(s.room==="towerControl"&&target==="clock")
  award(s,"clues","canal-false-clock","NOTEBOOK: The mast's clock is unreliable; preserve radio timestamps.");
}
function open(s,target){
 const c=s.case10;
 if(s.room==="relayHut"&&target==="cabinet"){
  if(c.cabinetOpen){say(s,"The calibration drawer is already open.");return;}
  c.cabinetOpen=true;say(s,"You pull the cabinet open. Original relay calibration sheets and a traffic log sit inside.","evidence");return;
 }
 if(s.room==="bargeDeck"&&target==="crate"){
  if(c.crateOpen){say(s,"The false bottom is already lifted.");return;}
  c.crateOpen=true;say(s,"Under a loose board lies a blue-bordered cargo tag and a scrap of wool.","evidence");return;
 }
 if(s.room==="towerControl"&&target==="router"){
  if(c.routeSolved){say(s,"The original route has already been recovered.");return;}
  if(!s.inventory.includes("canal-calibration")||!s.inventory.includes("barge-tag")||!s.inventory.includes("canal-traffic-log")){
   say(s,"The switchboard requires the original calibration, traffic log, and barge transfer tag. Guesswork will not do.","warning");return;
  }
  c.routePanel=true;say(s,"The documents fit. Route the original LOCK, BARGE and TOWER channels in sequence. Beware the POLICE decoy.","choice");return;
 }
 say(s,"It will not open that way.");
}
function take(s,target){
 const c=s.case10;
 if(s.room==="relayHut"&&target==="calibration"&&c.cabinetOpen&&!c.calibrationTaken){
  c.calibrationTaken=true;
  award(s,"inventory","canal-calibration","INVENTORY: Original North Canal calibration sheet.");
  award(s,"clues","canal-sable-route","NOTEBOOK: SABLE-12 used the LOCK → BARGE → TOWER path, not police dispatch.");
 }else if(s.room==="relayHut"&&target==="log"&&c.cabinetOpen&&!c.logTaken){
  c.logTaken=true;
  award(s,"inventory","canal-traffic-log","INVENTORY: Signed SABLE-12 traffic log.");
  award(s,"clues","lantern-dispatch","NOTEBOOK: The signed log associates E.A.'s transfer with Lantern House.");
 }else if(s.room==="bargeDeck"&&target==="tag"&&c.crateOpen&&!c.tagTaken){
  c.tagTaken=true;
  award(s,"inventory","barge-tag","INVENTORY: Original E.A. transfer cargo tag.");
  award(s,"clues","lantern-tag","NOTEBOOK: A transfer tag associates a living passenger marked E.A. with Lantern House.");
 }else if(s.room==="bargeDeck"&&target==="cloth"&&c.crateOpen&&!c.clothTaken){
  c.clothTaken=true;
  award(s,"inventory","blue-wool-scrap","INVENTORY: Blue wool from the canal transfer crate.");
  award(s,"clues","eleanor-coat-link","NOTEBOOK: Blue wool resembles the coat shown on Eleanor's film.");
 }else if(s.room==="towerControl"&&target==="printout"&&c.routeSolved&&!c.traceTaken){
  c.traceTaken=true;
  award(s,"inventory","sable-trace","INVENTORY: Original North Canal SABLE-12 signal trace.");
  award(s,"clues","lantern-trace","NOTEBOOK: Radio trace corroborates Lantern House as the transfer's destination; no Kingfisher identity exposed.");
  award(s,"memories","lantern-memory","MEMORY FRAGMENT 10: Eleanor sketches a lantern against the water. 'When the lights go out, remember where the keeper waits.'");
 }else say(s,"That is unavailable or already in the case file.");
}
function go(s,target){
 const c=s.case10;
 if(s.room==="canalWalk"&&target==="hut"){
  if(!c.irisPass){say(s,"The relay hut is locked. Iris needs to see proof of the Silhouette routing operation.","warning");return;}
  enter(s,"relayHut","NORTH CANAL RELAY HUT. The radio still ticks under a filing cabinet full of calibration records.");return;
 }
 if(s.room==="canalWalk"&&target==="barge"){
  enter(s,"bargeDeck","THE TRANSFER BARGE. Someone has cleared its hold but left original cargo records behind.");return;
 }
 if(s.room==="canalWalk"&&target==="tower"){
  if(!c.calibrationTaken||!c.tagTaken){say(s,"The tower requires matching calibration and transfer documents before the custodian controls will unlock.","warning");return;}
  enter(s,"towerControl","NORTH CANAL TOWER. A route switchboard pulses beside the antenna, still carrying the call sign SABLE.");return;
 }
 if(s.room==="relayHut"&&target==="exit"){
  enter(s,"canalWalk","THE TOWPATH. Iris keeps watch while you cross toward the transmitter.");return;
 }
 if(s.room==="bargeDeck"&&target==="shore"){
  enter(s,"canalWalk","THE TOWPATH. The river moves east under dirty clouds.");return;
 }
 if(s.room==="towerControl"&&target==="exit"){
  enter(s,"canalWalk","THE TOWPATH. A motor coughs somewhere north along the canal.");return;
 }
 say(s,"That passage is blocked.");
}
function talk(s,target){
 const c=s.case10;
 if(s.room==="canalWalk"&&target==="iris"){
  c.irisMet=true;c.dialogue="iris";
  say(s,c.priorChoice==="shield"?
   "Iris studies Vincent. 'Somebody redacted the workers' names. Whoever did that made it easier to trust the records.'":
   "'You've been chasing a live signal. That means everyone watching it knows you're coming.' Iris keeps her hand near the hut key.","choice");
  return;
 }
 if(s.room==="relayHut"&&target==="radio"){
  say(s,"A fading voice repeats: 'SABLE-12. Maintain the three-stage route. Lantern transfer confirmed.'","choice");return;
 }
 if(s.room==="towerControl"&&target==="receiver"){
  if(!c.routeSolved){
   say(s,"The transmission is scrambled. The original switching route must be restored before you can listen.","warning");return;
  }
  c.callHeard=true;c.endPanel=true;
  award(s,"clues","sable-live-call","NOTEBOOK: A live SABLE message confirms a transfer toward Lantern House. Its speaker remains unidentified.");
  say(s,"The receiver clears. 'Lantern House confirms receipt. Keep the escort hidden. Move before dawn.' Then static. Vincent must decide how to act.","choice");return;
 }
 say(s,"The only reply is static.");
}
function use(s,target,item){
 if(s.room==="canalWalk"&&target==="iris"&&item==="silhouette-packet"&&s.inventory.includes(item)){
  talk(s,target);say(s,"Iris sees the packet's original signature and stops pretending the tower is out of service.","evidence");return;
 }
 if(s.room==="towerControl"&&target==="router"&&item==="canal-calibration"&&s.inventory.includes(item)){
  open(s,"router");return;
 }
 say(s,"Those items don't fit together.");
}
export function canalAction(s,verb,target,item=""){
 if(s.chapter!==10||s.status!=="playing"||!s.case10||!CANAL_HOTSPOTS[s.room])return s;
 if(verb==="LOOK"){
  if(!target)say(s,{
   canalWalk:"A radio engineer guards a relay hut near a moored barge and the North Canal transmitter.",
   relayHut:"Old radio equipment, signed traffic logs and calibration sheets lie in a locked hut.",
   bargeDeck:"The deck of an abandoned transfer barge holds a false-bottom crate and a recently altered register.",
   towerControl:"A North Canal control room houses the three-stage SABLE router and live receiver."
  }[s.room]);else look(s,target);
 }else if(verb==="OPEN")open(s,target);
 else if(verb==="TAKE")take(s,target);
 else if(verb==="GO")go(s,target);
 else if(verb==="TALK")talk(s,target);
 else if(verb==="USE")use(s,target,item);
 s.actions+=1;return s;
}
export function chooseIris(state,choice){
 const s=copy(state),c=s.case10;
 if(s.chapter!==10||s.status!=="playing"||s.room!=="canalWalk"||c?.dialogue!=="iris"||
  !IRIS_OPTIONS.some(o=>o.id===choice))return s;
 if(choice==="close"){c.dialogue=null;say(s,"Iris checks the towpath before letting Vincent move on.","choice");return s;}
 if(c.irisAsked.includes(choice)){say(s,"'I already answered that, detective.'","choice");return s;}
 c.irisAsked.push(choice);
 if(choice==="sable"){
  award(s,"clues","iris-sable","NOTEBOOK: Iris says SABLE is a station call sign, not the name of its operator.");
  say(s,"'SABLE is just what the station calls itself. Every operator uses it. People who call it a name are doing someone's work for them.'","choice");
 }else if(choice==="protect"){
  c.irisTrust=Math.min(3,c.irisTrust+2);
  say(s,"'I need the people, Iris, not a list of names to hand to a crooked desk.' She seems relieved.","choice");
 }else if(choice==="accuse"){
  c.irisTrust=Math.max(-3,c.irisTrust-2);
  say(s,"'You helped move her.' Iris looks toward the moored barge. 'I maintained radios. I kept the logs because I couldn't stop what they did.'","choice");
 }else if(choice==="proof"){
  if(!s.inventory.includes("silhouette-packet")){
   c.irisAsked=c.irisAsked.filter(x=>x!==choice);
   say(s,"The original Silhouette signal packet is the evidence Iris needs.","warning");return s;
  }
  c.irisTrust=Math.max(0,c.irisTrust);
  c.irisPass=true;
  award(s,"inventory","canal-hut-pass","INVENTORY: Iris's relay-hut access pass.");
  award(s,"clues","iris-authentication","NOTEBOOK: Iris authenticated the North Canal relay against the original Silhouette packet.");
  say(s,"Iris checks the signature on your original packet. 'This is the real route. The hut records will show where the barge went.' She unlocks the door.","evidence");
 }
 s.actions+=1;return s;
}
export function chooseCanalRoute(state,choice){
 const s=copy(state),c=s.case10;
 if(s.chapter!==10||s.status!=="playing"||s.room!=="towerControl"||!c?.routePanel||
  c.routeSolved||!CANAL_ROUTE_OPTIONS.some(o=>o.id===choice))return s;
 if(choice==="reset"){c.routeSequence=[];say(s,"The canal signal router resets to neutral.","choice");return s;}
 if(ROUTE[c.routeSequence.length]!==choice){
  c.routeSequence=[];
  say(s,"The panel snaps red. The path is wrong. The original calibration card and transfer tag give the real sequence.","warning");
  return s;
 }
 c.routeSequence.push(choice);
 if(c.routeSequence.length===ROUTE.length){
  c.routeSolved=true;c.routePanel=false;
  award(s,"clues","canal-route-proved","NOTEBOOK: SABLE-12 took the LOCK → BARGE → TOWER path; the police dispatch was planted.");
  say(s,"All three lamps turn green. An original signal trace prints from the teletype. SABLE's live receiver opens.","evidence");
 }else say(s,"One signal lamp turns green. Continue the documented path.","choice");
 s.actions+=1;return s;
}
export function chooseCanalEnd(state,choice){
 const s=copy(state),c=s.case10;
 if(s.chapter!==10||s.status!=="playing"||s.room!=="towerControl"||!c?.endPanel||
  !CANAL_END_OPTIONS.some(o=>o.id===choice))return s;
 if(choice==="back"){c.endPanel=false;say(s,"You silence the receiver and review the original trace.","choice");return s;}
 if(!c.traceTaken||!c.callHeard||!c.tagTaken){
  say(s,"Secure the original trace and transfer tag and hear the live call before committing to a route.","warning");return s;
 }
 c.decision=choice;c.endPanel=false;
 if(choice==="divert"){
  award(s,"clues","iris-diversion","NOTEBOOK: Vincent transmitted a decoy to protect Iris while securing the Lantern House location.");
  say(s,"You send a harmless decoy on the abandoned police frequency. Iris can leave before anyone traces the tower back to her, but the real escort gains time.","choice");
 }else{
  award(s,"clues","lantern-pursuit","NOTEBOOK: Vincent pursued the transport toward Lantern House without diversion.");
  say(s,"You leave the board humming and follow the fresh vehicle tracks north. Iris will have to find her own way out, but the escort may still be in reach.","choice");
 }
 s.status="chapter10complete";
 say(s,"CHAPTER 10 COMPLETE: Evidence points to Lantern House as the next stop on Eleanor's trail. Kingfisher's identity remains a mystery, and the choice at North Canal will have consequences.","ending");
 return s;
}
export function sanitizeCanalCase(input){
 const s=freshCanalCase();
 if(!input||typeof input!=="object"||Array.isArray(input))return s;
 for(const key of Object.keys(s))if(typeof s[key]==="boolean"&&typeof input[key]==="boolean")s[key]=input[key];
 s.priorChoice=input.priorChoice==="shield"?"shield":"trace";
 s.irisTrust=Number.isInteger(input.irisTrust)?Math.max(-3,Math.min(3,input.irisTrust)):0;
 if(Array.isArray(input.irisAsked))s.irisAsked=[...new Set(input.irisAsked.filter(x=>IRIS_OPTIONS.some(o=>o.id===x&&x!=="close")))].slice(0,4);
 if(Array.isArray(input.routeSequence)){
  const value=input.routeSequence.slice(0,3);
  if(value.every((x,i)=>x===ROUTE[i]))s.routeSequence=value;
 }
 if(s.routeSolved){s.routeSequence=[...ROUTE];s.routePanel=false;}
 if(input.dialogue==="iris")s.dialogue="iris";
 if(["divert","pursue"].includes(input.decision))s.decision=input.decision;
 if(s.decision)s.endPanel=false;
 return s;
}
