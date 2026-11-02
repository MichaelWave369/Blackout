/* BLACKOUT Chapter 7: The Old Exchange.
 * Deterministic noir narrative engine, independent of browser and XR rendering.
 * The Kingfisher's real identity is intentionally NOT revealed here.
 */
export const EXCHANGE_HOTSPOTS={
 exchangeLanding:[
  ["lift","Service lift"],["directory","Station directory"],["note","Folded message"],
  ["entrance","Exchange concourse"],["tiles","Broken floor tiles"],["light","Emergency lamp"]
 ],
 exchangeHall:[
  ["mara","Mara Bell, switchboard clerk"],["telegraph","Telegraph room"],
  ["vault","Records vault"],["board","Public departure board"],
  ["clock","Station clock"],["return","Service lift"],["counter","Ticket counter"]
 ],
 wireRoom:[
  ["cabinet","Carbon-copy cabinet"],["carbon","Dock dispatch carbon"],
  ["roster","Rail transfer duplicate"],["machine","Telegraph machine"],
  ["switch","Dead exchange switch"],["door","Concourse doorway"],["window","Grimy interior window"]
 ],
 exchangeVault:[
  ["board","Reconciliation board"],["seal","Exchange seal impression"],
  ["contract","Signed transfer contract"],["courier","Waiting courier"],
  ["drawer","Strongbox drawer"],["exit","Vault exit"],["lamp","Banker's lamp"]
 ]
};
export const MARA_OPTIONS=[
 {id:"route",label:"ASK ABOUT THE LAST SPECIAL TRAIN"},
 {id:"ticket",label:"SHOW ELEANOR'S ONE-WAY TICKET"},
 {id:"protect",label:"PROMISE TO PROTECT THE EXCHANGE WORKERS"},
 {id:"accuse",label:"ACCUSE MARA OF HIDING THE TRANSFER"},
 {id:"recording",label:"PLAY ELEANOR'S RECORDED VOICE"},
 {id:"close",label:"END INTERVIEW"}
];
export const BOARD_OPTIONS=[
 {id:"dock",label:"MATCH DOCK MANIFEST TO DISPATCH CARBON"},
 {id:"train",label:"MATCH ELEANOR'S TICKET TO TRAIN ROSTER"},
 {id:"money",label:"MATCH KINGFISHER LEDGER TO EXCHANGE SEAL"},
 {id:"close",label:"CLOSE RECONCILIATION BOARD"}
];
export const COURIER_OPTIONS=[
 {id:"follow",label:"FOLLOW THE COURIER TOWARD THE BLUE DOOR"},
 {id:"secure",label:"SECURE THE ORIGINAL CONTRACT BEFORE PURSUIT"},
 {id:"back",label:"SEARCH THE EXCHANGE A LITTLE LONGER"}
];
const clone=s=>JSON.parse(JSON.stringify(s));
function say(s,message,kind="narration"){
 s.transcript.push({id:(s.transcript.at(-1)?.id||0)+1,text:message,kind});
 s.transcript=s.transcript.slice(-35);
}
function award(s,group,id,message){
 if(!s[group].includes(id)){s[group].push(id);if(message)say(s,message,"evidence");}
}
function enter(s,room,message){
 s.room=room;
 if(!s.discovered.includes(room))s.discovered.push(room);
 s.case7.dialogue=null;
 s.case7.boardPanel=false;
 say(s,message,"chapter");
}
export function freshExchangeCase(warnedVera=false){
 return {
  veraWarned:warnedVera,veraNoteRead:false,
  maraMet:false,maraTrust:warnedVera?1:0,maraAsked:[],vaultKey:false,dialogue:null,
  cabinetOpen:false,carbonTaken:false,rosterTaken:false,
  boardPanel:false,boardLinks:[],boardSolved:false,
  sealTaken:false,contractTaken:false,courierReady:false,choice:""
 };
}
export function exchangeTargets(s){
 const c=s.case7;if(!c)return[];
 return (EXCHANGE_HOTSPOTS[s.room]||[]).filter(([id])=>{
  if(id==="note")return c.veraWarned&&!c.veraNoteRead;
  if(id==="carbon")return c.cabinetOpen&&!c.carbonTaken;
  if(id==="roster")return c.cabinetOpen&&!c.rosterTaken;
  if(id==="seal")return !c.sealTaken;
  if(id==="contract")return c.boardSolved&&!c.contractTaken;
  if(id==="courier")return c.courierReady;
  return true;
 });
}
function look(s,target){
 const c=s.case7;
 const lines={
  exchangeLanding:{
   lift:"The old service lift remains open. The street is several stories above.",
   directory:"UNION EXCHANGE. PLATFORM / TELEGRAPH / ACCOUNTS. The last entry is covered by blue paint.",
   note:c.veraWarned?"Vera's handwriting: 'Vincent, I've arranged for Mara to hear you. Trust the documents, not the clocks.'":"An empty message slot. Nobody knows you've arrived.",
   entrance:"An imposing brass-framed doorway opens onto a deserted financial exchange.",
   tiles:"The tiles are cracked by roots and rain. Beneath them, the old rail tracks carry distant vibrations.",
   light:"A weak red emergency bulb casts long shadows down the hall."
  },
  exchangeHall:{
   mara:"Mara Bell, a switchboard clerk, has the poise of someone who's survived by keeping quiet.",
   telegraph:"Frosted glass reads TELEGRAPH / DISPATCH. A forgotten wire machine is still powered.",
   vault:c.vaultKey?"The steel records-vault door is unlocked.":"The records vault requires a brass clerk key.",
   board:"The public board lists cancelled night departures. A transfer from Car 09 is missing.",
   clock:"An ornate station clock shows a different time from every other clock you've seen tonight.",
   return:"The service lift waits in the corridor. You are too close to the truth to retreat.",
   counter:"A dusty ticket counter. Someone has placed a fresh cup of coffee on its ledge."
  },
  wireRoom:{
   cabinet:c.cabinetOpen?"The dispatch cabinet is open, its carbon records loose.":"A steel cabinet holds the duplicate dispatch records.",
   carbon:"Original carbon copy of the freight transfer: dock manifests concealed under 'office supplies'.",
   roster:"Duplicate night-train roster. The name E. Ashworth appears next to Car 09.",
   machine:"The telegraph spits out a repeating message: K / ACCOUNT CLOSED / BLUE DOOR.",
   switch:"An old switching board connects the rail yard to an unnamed office beneath the city.",
   door:"Back to Mara and the concourse.",
   window:"Through grimy glass, Mara checks the hall every time you move."
  },
  exchangeVault:{
   board:"A large accounts reconciliation board. Three false records are pinned against three original sources.",
   seal:"A black-and-gold embossed seal marked K. Its edge matches the imprint on the Kingfisher ledger.",
   contract:"TRANSFER AUTHORIZATION. Beneath the Kingfisher seal is a signature: MARCUS WEBB.",
   courier:"A messenger in a charcoal coat waits at the far service door. His sleeve bears a blue thread.",
   drawer:"A safe drawer with the shadow of a recently removed document.",
   exit:"The steel vault door leads to the public Exchange hall.",
   lamp:"A banker's lamp illuminates the record discrepancy in cold green light."
  }
 };
 say(s,lines[s.room]?.[target]||"Only old dust and unanswered questions.");
 if(s.room==="exchangeLanding"&&target==="note"&&c.veraWarned&&!c.veraNoteRead){
  c.veraNoteRead=true;
  award(s,"clues","vera-message","NOTEBOOK: Vera arranged contact with Mara and warned Vincent not to trust the station clocks.");
 }
 if(s.room==="wireRoom"&&target==="machine")
  award(s,"clues","exchange-blue-door","NOTEBOOK: The telegraph repeats a message mentioning the BLUE DOOR.");
}
function open(s,target){
 const c=s.case7;
 if(s.room==="wireRoom"&&target==="cabinet"){
  if(c.cabinetOpen){say(s,"The carbon-copy cabinet is already open.");return;}
  c.cabinetOpen=true;
  say(s,"You pull the dispatch cabinet open. A carbon freight record and a train roster fall onto the desk.","evidence");return;
 }
 if(s.room==="exchangeVault"&&target==="board"){
  c.boardPanel=true;
  say(s,"Three falsified records. Dock, train, and money. Match each with evidence you carried here and the originals found inside the Exchange.","choice");return;
 }
 if(s.room==="exchangeVault"&&target==="drawer"){
  say(s,c.boardSolved?"Only a torn envelope remains. The signed contract is visible on the reconciliation table.":"The drawer is empty. The board's inconsistencies hide the actual authorization.");return;
 }
 say(s,"Nothing opens here. Investigate the available documents.");
}
function take(s,target){
 const c=s.case7;
 if(s.room==="wireRoom"&&target==="carbon"&&c.cabinetOpen&&!c.carbonTaken){
  c.carbonTaken=true;
  award(s,"inventory","exchange-carbon","INVENTORY: Carbon copy of the dock-to-Exchange dispatch.");
  award(s,"clues","exchange-freight","NOTEBOOK: An Exchange dispatch carbon corroborates the dockside freight manifest.");
 }else if(s.room==="wireRoom"&&target==="roster"&&c.cabinetOpen&&!c.rosterTaken){
  c.rosterTaken=true;
  award(s,"inventory","exchange-roster","INVENTORY: Duplicate Car 09 transfer roster.");
  award(s,"clues","exchange-transfer","NOTEBOOK: Exchange records confirm Eleanor was transferred from Car 09 alive.");
 }else if(s.room==="exchangeVault"&&target==="seal"&&!c.sealTaken){
  c.sealTaken=true;
  award(s,"inventory","exchange-seal","INVENTORY: Kingfisher's black-and-gold Exchange seal impression.");
  award(s,"clues","exchange-k","NOTEBOOK: The embossed K seal matches the Kingfisher ledger leaf.");
 }else if(s.room==="exchangeVault"&&target==="contract"&&c.boardSolved&&!c.contractTaken){
  c.contractTaken=true;
  c.courierReady=true;
  award(s,"inventory","webb-contract","INVENTORY: Signed transfer authorization naming Marcus Webb.");
  award(s,"clues","webb-signature","NOTEBOOK: Marcus Webb authorized Eleanor's transfer; the K beneficiary remains unidentified.");
  award(s,"memories","blue-door-flash","MEMORY FRAGMENT 07: Blue paint, a lock turning, a woman's hand pressing a key into Vincent's palm.");
  say(s,"As you lift the signed authorization, a courier steps from the shadows. He knows you've uncovered the fraudulent route.","warning");
 }else say(s,"You can't take that, or it's already in the case file.");
}
function go(s,target){
 const c=s.case7;
 if(s.room==="exchangeLanding"&&target==="entrance"){
  enter(s,"exchangeHall","THE OLD EXCHANGE. Tarnished brass, marble floors and a single occupied switchboard. Mara Bell watches from behind the counter.");return;
 }
 if(s.room==="exchangeHall"&&target==="return"){
  enter(s,"exchangeLanding","SERVICE LIFT. A faint whistle echoes from the forgotten railway.");return;
 }
 if(s.room==="exchangeHall"&&target==="telegraph"){
  enter(s,"wireRoom","TELEGRAPH ROOM. A switchboard rattles quietly. Carbon copies of a hidden transfer survive in a steel cabinet.");return;
 }
 if(s.room==="wireRoom"&&target==="door"){
  enter(s,"exchangeHall","EXCHANGE CONCOURSE. Mara checks that nobody followed you into the telegraph room.");return;
 }
 if(s.room==="exchangeHall"&&target==="vault"){
  if(!c.vaultKey){say(s,"The records vault needs Mara's key. Ask her about Eleanor's ticket.","warning");return;}
  enter(s,"exchangeVault","RECORDS VAULT. A three-column reconciliation board dominates the room. Evidence could prove who signed Eleanor's transfer.");return;
 }
 if(s.room==="exchangeVault"&&target==="exit"){
  enter(s,"exchangeHall","EXCHANGE CONCOURSE. The abandoned departure board still shows the false timetable.");return;
 }
 say(s,"That passage is blocked.");
}
function talk(s,target){
 const c=s.case7;
 if(s.room==="exchangeHall"&&target==="mara"){
  c.maraMet=true;c.dialogue="mara";
  say(s,c.veraWarned?
   "Mara Bell recognizes your name. 'Vera warned me. Please tell me you brought actual proof.'":
   "'Morrow? Nobody was supposed to know this place existed. If you have proof, show it. Quickly.'","choice");
  return;
 }
 if(s.room==="exchangeVault"&&target==="courier"&&c.courierReady){
  c.dialogue="courier";
  say(s,"The courier's gloved hand moves toward a blue-painted service door. You can pursue him or lock down the proof you found.","choice");
  return;
 }
 say(s,"No one here wants to answer that question.");
}
function use(s,target,item){
 if(s.room==="exchangeHall"&&target==="mara"&&item==="eleanor-ticket"&&s.inventory.includes(item)){
  talk(s,target);say(s,"You hold up Eleanor's ticket. Mara can no longer pretend not to recognize Car 09.","evidence");return;
 }
 if(s.room==="exchangeVault"&&target==="board"){
  open(s,target);return;
 }
 say(s,"That combination doesn't explain the discrepancy.");
}
export function exchangeAction(s,verb,target,item=""){
 if(s.chapter!==7||s.status!=="playing"||!s.case7||!EXCHANGE_HOTSPOTS[s.room])return s;
 if(verb==="LOOK"){
  if(!target)say(s,{
   exchangeLanding:"A silent service lift opens into a shuttered, subterranean Exchange.",
   exchangeHall:"A deserted concourse, clerk's counter, telegraph office and locked vault.",
   wireRoom:"A dusty machine chatters beside a cabinet of carbon-copy dispatches.",
   exchangeVault:"The Kingfisher's accounts reconcile in three columns. A sealed contract lies beneath the ledger."
  }[s.room]);else look(s,target);
 }else if(verb==="OPEN")open(s,target);
 else if(verb==="TAKE")take(s,target);
 else if(verb==="GO")go(s,target);
 else if(verb==="TALK")talk(s,target);
 else if(verb==="USE")use(s,target,item);
 s.actions+=1;return s;
}
export function chooseMara(state,choice){
 const s=clone(state),c=s.case7;
 if(s.chapter!==7||s.status!=="playing"||s.room!=="exchangeHall"||c?.dialogue!=="mara"||
   !MARA_OPTIONS.some(o=>o.id===choice))return s;
 if(choice==="close"){c.dialogue=null;say(s,"Mara returns to the switchboard. 'I can't stay here long.'","choice");return s;}
 if(c.maraAsked.includes(choice)){
  say(s,"Mara shakes her head. 'I already told you what I know.'","choice");return s;
 }
 c.maraAsked.push(choice);
 if(choice==="route"){
  award(s,"clues","mara-route","NOTEBOOK: Mara confirms Car 09 ran through the Exchange after its public closure.");
  say(s,"'Car 09 was routed here. The Exchange was supposedly sealed. I saw them take a woman through the records hallway.'","choice");
 }else if(choice==="protect"){
  c.maraTrust=Math.min(3,c.maraTrust+2);
  say(s,"'None of the staff are criminals for being afraid.' Mara exhales. 'I used to think nobody would say that.'","choice");
 }else if(choice==="accuse"){
  c.maraTrust=Math.max(-3,c.maraTrust-2);
  say(s,"'You falsified those dispatches!' Mara backs away. 'I kept copies because I wanted this to end.'","choice");
 }else if(choice==="recording"){
  if(!s.inventory.includes("wire-recording")){
   c.maraAsked=c.maraAsked.filter(x=>x!==choice);
   say(s,"You need Eleanor's actual recording before claiming to have it.","warning");
  }else{
   c.maraTrust=Math.max(0,c.maraTrust);
   award(s,"clues","mara-hears-voice","NOTEBOOK: Mara recognizes Eleanor's voice in the original dockside recording.");
   say(s,"You play the wire recording. Mara covers her mouth. 'I heard that voice from the train. You really are looking for her.'","choice");
  }
 }else if(choice==="ticket"){
  if(!s.inventory.includes("eleanor-ticket")){
   c.maraAsked=c.maraAsked.filter(x=>x!==choice);
   say(s,"You have no ticket to present.","warning");
  }else if(c.maraTrust<0){
   c.maraAsked=c.maraAsked.filter(x=>x!==choice);
   say(s,"'That ticket could have come from anywhere. Please give me a reason to trust you.'","warning");
  }else{
   c.vaultKey=true;
   award(s,"inventory","exchange-key","INVENTORY: Mara's brass records-vault key.");
   award(s,"clues","mara-testimony","NOTEBOOK: Mara witnessed Eleanor being escorted from Car 09 through the Exchange.");
   say(s,"Mara studies the ticket, then hands you a brass key. 'The vault has the original dispatch. Find the signature, Vincent.'","evidence");
  }
 }
 s.actions+=1;return s;
}
export function chooseReconciliation(state,choice){
 const s=clone(state),c=s.case7;
 if(s.chapter!==7||s.status!=="playing"||s.room!=="exchangeVault"||!c?.boardPanel||
   !BOARD_OPTIONS.some(o=>o.id===choice))return s;
 if(choice==="close"){c.boardPanel=false;say(s,"You step away from the reconciliation board.","choice");return s;}
 if(c.boardLinks.includes(choice)){say(s,"That record is already reconciled.","choice");return s;}
 const requirements={
  dock:s.inventory.includes("freight-manifest")&&s.inventory.includes("exchange-carbon"),
  train:s.inventory.includes("eleanor-ticket")&&s.inventory.includes("exchange-roster"),
  money:s.inventory.includes("kingfisher-ledger")&&s.inventory.includes("exchange-seal")
 };
 if(!requirements[choice]){
  const hints={
   dock:"The dock manifest and the Exchange carbon are both required to prove the false freight transfer.",
   train:"Eleanor's ticket and the duplicate transfer roster must be compared together.",
   money:"The Kingfisher ledger and the original K seal are needed to validate the payment chain."
  };
  say(s,hints[choice],"warning");return s;
 }
 c.boardLinks.push(choice);
 const conclusions={
  dock:"RECONCILED: The dock freight was relabeled to conceal a human transfer.",
  train:"RECONCILED: Eleanor was alive aboard Car 09 when it reached the Exchange.",
  money:"RECONCILED: Kingfisher shell accounts paid for the unauthorized transfer."
 };
 award(s,"clues","exchange-board-"+choice,conclusions[choice]);
 s.actions+=1;
 if(c.boardLinks.length===3&&!c.boardSolved){
  c.boardSolved=true;c.boardPanel=false;
  say(s,"The columns line up. A signature becomes visible on the transfer authorization: MARCUS WEBB. The K beneficiary remains hidden.","evidence");
 }
 return s;
}
export function chooseCourier(state,choice){
 const s=clone(state),c=s.case7;
 if(s.chapter!==7||s.status!=="playing"||s.room!=="exchangeVault"||c?.dialogue!=="courier"||
   !COURIER_OPTIONS.some(o=>o.id===choice))return s;
 if(choice==="back"){c.dialogue=null;say(s,"The courier backs toward the painted door. You keep searching.","choice");return s;}
 if(!c.contractTaken||!c.boardSolved){say(s,"You cannot choose a route without the signed original.","warning");return s;}
 c.choice=choice;c.dialogue=null;
 if(choice==="follow"){
  award(s,"clues","courier-trail","NOTEBOOK: Vincent chose to tail the Exchange courier toward a blue-painted service door.");
  say(s,"You follow the courier through a side passage. Blue paint flakes from the steel door, and you remember Eleanor's warning. You will need to find what is behind it.","choice");
 }else{
  award(s,"clues","contract-secured","NOTEBOOK: Vincent secured Webb's original transfer contract before chasing the courier.");
  say(s,"You lock the original contract inside your coat and mark the vault for later recovery. The courier escapes into the blue passage, but you have evidence strong enough to expose Webb.","choice");
 }
 s.status="chapter7complete";
 say(s,"CHAPTER 7 COMPLETE: Marcus Webb signed the transfer, but the Kingfisher's identity remains hidden. Somewhere beyond the old Exchange stands the BLUE DOOR.","ending");
 return s;
}
export function sanitizeExchangeCase(input){
 const s=freshExchangeCase();
 if(!input||typeof input!=="object"||Array.isArray(input))return s;
 for(const key of Object.keys(s)){
  if(typeof s[key]==="boolean"&&typeof input[key]==="boolean")s[key]=input[key];
 }
 s.maraTrust=Number.isInteger(input.maraTrust)?Math.max(-3,Math.min(3,input.maraTrust)):0;
 if(Array.isArray(input.maraAsked))
  s.maraAsked=[...new Set(input.maraAsked.filter(x=>MARA_OPTIONS.some(o=>o.id===x&&x!=="close")))].slice(0,5);
 if(Array.isArray(input.boardLinks))
  s.boardLinks=[...new Set(input.boardLinks.filter(x=>["dock","train","money"].includes(x)))];
 s.boardSolved=s.boardSolved&&s.boardLinks.length===3;
 if(s.boardSolved)s.boardPanel=false;
 if(!s.contractTaken)s.courierReady=false;
 if(input.dialogue==="mara"||input.dialogue==="courier")s.dialogue=input.dialogue;
 if(input.choice==="follow"||input.choice==="secure")s.choice=input.choice;
 return s;
}
