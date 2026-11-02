/* BLACKOUT Chapter 12: The Last Alibi.
 * Original noir detective logic. Deterministic state, independent of UI.
 * An alibi clears Vincent of physically firing the shot, NOT of every crime.
 */
export const ALIBI_HOTSPOTS={
 safehouse:[
  ["eleanor","Eleanor Ashworth"],["envelope","Sealed camera envelope"],
  ["streetFrame","Original street-camera frame"],["cafe","Morning newspaper"],
  ["hotel","Marmont records annex"],["coroner","Coroner's annex"],
  ["boardroom","Reconstruction room"],["radio","Quiet radio"]
 ],
 hotelAnnex:[
  ["ruth","Ruth Calder, night clerk"],["drawer","Hotel registration drawer"],
  ["card","Room 214 guest registration"],["bell","Bellhop incident card"],
  ["switchboard","Switchboard pulse roll"],["till","Lost-property till"],
  ["receipt","Vincent's café receipt"],["return","Safehouse doorway"]
 ],
 coronerOffice:[
  ["cabinet","Coroner intake cabinet"],["docket","Original death docket"],
  ["seal","Forensic identification seal"],["clock","Morgue wall clock"],
  ["telegram","Autopsy telegraph"],["window","Frosted window"],["return","Safehouse doorway"]
 ],
 reconstructionDesk:[
  ["board","Three-column evidence board"],["dictaphone","Dictaphone recording"],
  ["attestation","Reconstructed alibi report"],["mirror","Marmont hallway photograph"],
  ["telephone","Police liaison telephone"],["door","Return to safehouse"]
 ]
};
export const RUTH_OPTIONS=[
 {id:"timing",label:"ASK WHEN THE SHOT WAS HEARD"},
 {id:"protect",label:"PROMISE TO PROTECT THE HOTEL STAFF"},
 {id:"accuse",label:"ACCUSE RUTH OF FALSIFYING THE TIME"},
 {id:"show",label:"SHOW ELEANOR'S ORIGINAL TESTIMONY"},
 {id:"close",label:"END THE INTERVIEW"}
];
export const ALIBI_LINKS=[
 {id:"identity",label:"IDENTIFY THE ROOM-214 VICTIM"},
 {id:"shot",label:"VERIFY THE SHOT'S REAL TIME"},
 {id:"alibi",label:"PLACE VINCENT AT THE SAME MOMENT"},
 {id:"close",label:"CLOSE THE EVIDENCE BOARD"}
];
export const ALIBI_ENDINGS=[
 {id:"file",label:"FILE THE ALIBI WITH THE POLICE"},
 {id:"hold",label:"KEEP THE PROOF SEALED FOR THE NEXT LEAD"},
 {id:"back",label:"REVIEW THE CASE FILE BEFORE DECIDING"}
];
const copy=s=>JSON.parse(JSON.stringify(s));
function say(s,message,kind="narration"){
 s.transcript.push({id:(s.transcript.at(-1)?.id||0)+1,text:message,kind});
 s.transcript=s.transcript.slice(-35);
}
function award(s,group,id,message){
 if(!s[group].includes(id)){s[group].push(id);if(message)say(s,message,"evidence");}
}
function move(s,room,message){
 s.room=room;if(!s.discovered.includes(room))s.discovered.push(room);
 s.case12.dialogue=null;s.case12.boardOpen=false;s.case12.endPanel=false;
 say(s,message,"chapter");
}
export function freshAlibiCase(priorDecision=""){
 return {
  priorDecision:priorDecision==="all"?"all":"quiet",
  ruthTrust:priorDecision==="all"?1:-1,
  eleanorInterviewed:false,envelopeOpen:false,streetFrameTaken:false,
  ruthMet:false,ruthAsked:[],recordsAccess:false,dialogue:null,
  drawerOpen:false,registrationTaken:false,bellCardTaken:false,pulseTaken:false,
  tillOpen:false,receiptTaken:false,coronerOpen:false,docketTaken:false,sealTaken:false,
  boardOpen:false,links:[],boardSolved:false,reportTaken:false,endPanel:false,decision:""
 };
}
export function alibiTargets(s){
 const c=s.case12;if(!c)return[];
 return (ALIBI_HOTSPOTS[s.room]||[]).filter(([id])=>{
  if(id==="streetFrame")return c.envelopeOpen&&!c.streetFrameTaken;
  if(id==="card")return c.drawerOpen&&!c.registrationTaken;
  if(id==="bell")return c.drawerOpen&&!c.bellCardTaken;
  if(id==="receipt")return c.tillOpen&&!c.receiptTaken;
  if(id==="docket")return c.coronerOpen&&!c.docketTaken;
  if(id==="seal")return c.coronerOpen&&!c.sealTaken;
  if(id==="attestation")return c.boardSolved&&!c.reportTaken;
  return true;
 });
}
function look(s,target){
 const c=s.case12;
 const scenes={
  safehouse:{
   eleanor:"Eleanor is safe but exhausted. She wants to help Vincent find the truth behind the man in room 214.",
   envelope:c.envelopeOpen?"An old envelope holds the original street-facing camera duplicate.":"A sealed envelope marked STREET CAMERA, MARMONT / NIGHT TWO.",
   streetFrame:"The uncut street camera frame shows Vincent beside the café entrance at 2:06 A.M. The original film is still in its sleeve.",
   cafe:"Newspaper: authorities have not released the room-214 victim's identity. No arrest warrant has been published.",
   hotel:"The Marmont's surviving records have been moved to an annex. Ruth Calder is waiting there.",
   coroner:"The city coroner's intake archive can confirm the name of the man in room 214.",
   boardroom:"A private reconstruction room has a three-column board: identity, time of shot, location.",
   radio:"The radio crackles. 'There are no official new developments in the Marmont shooting.'"
  },
  hotelAnnex:{
   ruth:"Ruth Calder, the retired night clerk, preserved duplicate hotel records when police seized the desk originals.",
   drawer:c.drawerOpen?"Room-214 registration and the bellhop's time card are visible in the open drawer.":"A locked drawer holds an original registration and incident time card.",
   card:"Guest card: Daniel Mercer, checked in under his own name in room 214. A second line reads 'audit consultant'.",
   bell:"The bellhop's hand-signed incident card records a single gunshot at 2:06 A.M. on the synchronized desk clock.",
   switchboard:"The pulse roll confirms a sharp line disturbance at 2:06, independently supporting the bellhop's time.",
   till:c.tillOpen?"The lost-property till is open; Vincent's signed café receipt was kept here.":"An unclaimed-effects till contains a paper bag marked MORROW.",
   receipt:"Café receipt: Vincent Morrow, signature and numbered transaction, printed at 2:06 A.M. across the street.",
   return:"Back to the safehouse and Eleanor."
  },
  coronerOffice:{
   cabinet:c.coronerOpen?"The intake file is open, containing its original docket and verified identification seal.":"A municipal evidence cabinet marked MARMONT / 214.",
   docket:"Coroner intake: the dead man in the gray suit is Daniel Mercer, a financial audit consultant. The file does not establish whether he used any alias.",
   seal:"The identification seal includes a booking fingerprint and Mercer family confirmation. It matches the guest card.",
   clock:"The morgue clock stopped during a power fault. It was never a reliable witness to the shooting time.",
   telegram:"Autopsy message: death by a single gunshot. The intake time is not the time of the shot.",
   window:"Rain clouds brighten over a vacant municipal courtyard.",
   return:"Back to the safehouse. The originals must be compared at the reconstruction board."
  },
  reconstructionDesk:{
   board:c.boardSolved?"Three independent pairs now corroborate identity, shot time and Vincent's location.":"Three columns await original documents: WHO DIED / WHEN THE SHOT / WHERE VINCENT WAS.",
   dictaphone:"A tape recorder holds Eleanor's account: the hotel watcher was installed before the shooting; she does not know who fired.",
   attestation:"A signed alibi reconstruction naming Daniel Mercer and placing Vincent outside the hotel when the shot was fired.",
   mirror:"A photograph of the Marmont corridor shows the camera wiring was present before anyone called the police.",
   telephone:"A direct line to a cautious police liaison. Filing the reconstruction may alert the network.",
   door:"Return to Eleanor in the safehouse."
  }
 };
 say(s,scenes[s.room]?.[target]||"Nothing you can establish from that.");
 if(s.room==="coronerOffice"&&target==="telegram")
  award(s,"clues","autopsy-caution","NOTEBOOK: The coroner's intake time is not a valid substitute for the actual shot time.");
 if(s.room==="reconstructionDesk"&&target==="dictaphone")
  award(s,"clues","eleanor-tape","NOTEBOOK: Eleanor confirms surveillance predates the murder, but cannot identify the shooter.");
}
function open(s,target){
 const c=s.case12;
 if(s.room==="safehouse"&&target==="envelope"){
  c.envelopeOpen=true;say(s,"Eleanor opens the sealed sleeve. The street-facing negative has never been cut or retimed.","evidence");return;
 }
 if(s.room==="hotelAnnex"&&target==="drawer"){
  if(!c.recordsAccess){say(s,"Ruth controls the records drawer. Present Eleanor's original testimony.","warning");return;}
  c.drawerOpen=true;say(s,"Ruth unlocks the drawer. The original guest card and bellhop incident card survived the seizure.","evidence");return;
 }
 if(s.room==="hotelAnnex"&&target==="till"){
  if(!c.recordsAccess){say(s,"Ruth must authorize the unclaimed-effects till.","warning");return;}
  c.tillOpen=true;say(s,"The till opens. An original signed café receipt is inside an envelope marked MORROW.","evidence");return;
 }
 if(s.room==="coronerOffice"&&target==="cabinet"){
  c.coronerOpen=true;say(s,"The municipal intake cabinet opens. The identity evidence is recorded independently of hotel records.","evidence");return;
 }
 if(s.room==="reconstructionDesk"&&target==="board"){
  if(c.boardSolved){say(s,"The three findings have been reconciled and the attestation is ready.");return;}
  c.boardOpen=true;say(s,"Match each independent pair of originals to prove identity, shot time, and Vincent's location.","choice");return;
 }
 say(s,"It doesn't open.");
}
function take(s,target){
 const c=s.case12;
 const pickups={
  streetFrame:{room:"safehouse",ready:c.envelopeOpen&&!c.streetFrameTaken,field:"streetFrameTaken",item:"street-negative",clue:"street-time",message:"NOTEBOOK: Uncut street frame puts Vincent at the café entrance at 2:06 A.M."},
  card:{room:"hotelAnnex",ready:c.drawerOpen&&!c.registrationTaken,field:"registrationTaken",item:"mercer-registration",clue:"mercer-hotel",message:"NOTEBOOK: Daniel Mercer registered in room 214 as an audit consultant."},
  bell:{room:"hotelAnnex",ready:c.drawerOpen&&!c.bellCardTaken,field:"bellCardTaken",item:"bellhop-timecard",clue:"bellhop-shot",message:"NOTEBOOK: Bellhop's original incident card dates the gunshot at 2:06 A.M."},
  switchboard:{room:"hotelAnnex",ready:!c.pulseTaken,field:"pulseTaken",item:"hotel-pulse-roll",clue:"hotel-pulse",message:"NOTEBOOK: Independent switchboard pulse at 2:06 corroborates the gunshot."},
  receipt:{room:"hotelAnnex",ready:c.tillOpen&&!c.receiptTaken,field:"receiptTaken",item:"morrow-cafe-receipt",clue:"morrow-receipt",message:"NOTEBOOK: Vincent's signed café receipt is time-stamped 2:06 A.M."},
  docket:{room:"coronerOffice",ready:c.coronerOpen&&!c.docketTaken,field:"docketTaken",item:"mercer-death-docket",clue:"mercer-victim",message:"NOTEBOOK: Coroner identifies the room-214 victim as Daniel Mercer."},
  seal:{room:"coronerOffice",ready:c.coronerOpen&&!c.sealTaken,field:"sealTaken",item:"mercer-id-seal",clue:"mercer-identity-confirmed",message:"NOTEBOOK: Fingerprint and family confirmation independently verify Mercer's identity."},
  attestation:{room:"reconstructionDesk",ready:c.boardSolved&&!c.reportTaken,field:"reportTaken",item:"vincent-alibi",clue:"morrow-cleared-of-shot",message:"NOTEBOOK: Corroborated alibi places Vincent outside room 214 when the shot was fired."}
 };
 const p=pickups[target];if(!p||p.room!==s.room||!p.ready){say(s,"That evidence cannot be taken yet.");return;}
 c[p.field]=true;
 award(s,"inventory",p.item,"INVENTORY: "+p.item.replaceAll("-"," ").toUpperCase()+".");
 award(s,"clues",p.clue,p.message);
 if(target==="attestation"){
  award(s,"memories","mercer-memory","MEMORY FRAGMENT 12: Vincent remembers a man whispering 'Mercer has the books.' Then a loud report from the hotel above.");
  say(s,"The three findings agree. Vincent was across the street when Mercer was shot. But that does not identify who ordered or fired the gun.","evidence");
 }
}
function go(s,target){
 const routes={
  safehouse:{hotel:["hotelAnnex","HOTEL RECORDS ANNEX. Ruth Calder waits between stacks of surviving room-214 paperwork."],coroner:["coronerOffice","CORONER'S ANNEX. An independent identification file may give the dead man a name."],boardroom:["reconstructionDesk","RECONSTRUCTION ROOM. A bare desk and three-column board await the original documents."]},
  hotelAnnex:{return:["safehouse","SAFEHOUSE. Eleanor is checking the edges of the camera negatives."]},
  coronerOffice:{return:["safehouse","SAFEHOUSE. The coroner's original docket gives the investigation a name."]},
  reconstructionDesk:{door:["safehouse","SAFEHOUSE. Eleanor is ready to compare the original evidence."]}
 };
 const r=routes[s.room]?.[target];if(r){move(s,...r);return;}
 say(s,"There is no clear path that way.");
}
function talk(s,target){
 const c=s.case12;
 if(s.room==="safehouse"&&target==="eleanor"){
  if(!c.eleanorInterviewed){
   c.eleanorInterviewed=true;
   award(s,"clues","eleanor-alibi-help","NOTEBOOK: Eleanor preserved a separate street-facing negative, independent of the hotel room camera.");
   say(s,"'Vincent, the room camera was not their only eye. I hid the street negative. You were outside when that shot went off. We need proof a court can understand.'","evidence");
  }else say(s,"'Find the independent times. A confession from the wrong person helps nobody,' Eleanor says.","choice");
  return;
 }
 if(s.room==="hotelAnnex"&&target==="ruth"){
  c.ruthMet=true;c.dialogue="ruth";
  say(s,c.priorDecision==="all"?
   "Ruth straightens. 'The witnesses you helped escape are talking. Maybe this time somebody will listen to the originals.'":
   "'You got Eleanor out, but the other people are still locked inside. I have to be careful who gets these records.'","choice");
  return;
 }
 if(s.room==="reconstructionDesk"&&target==="telephone"){
  if(!c.reportTaken){
   say(s,"The liaison wants the original signed reconstruction, not an unverified theory.","warning");return;
  }
  c.endPanel=true;
  say(s,"The liaison asks: 'Will you file the corroborated alibi under your name, or keep it sealed until you find the shooter?'","choice");return;
 }
 say(s,"Nobody can add a reliable statement right now.");
}
function use(s,target,item){
 if(s.room==="hotelAnnex"&&target==="ruth"&&item==="eleanor-testimony"&&s.inventory.includes(item)){
  talk(s,target);say(s,"You show Ruth Eleanor's signed statement. She starts to trust the evidence.","evidence");return;
 }
 if(s.room==="reconstructionDesk"&&target==="board"){open(s,"board");return;}
 say(s,"That combination doesn't establish the alibi.");
}
export function alibiAction(s,verb,target,item=""){
 if(s.chapter!==12||s.status!=="playing"||!s.case12||!ALIBI_HOTSPOTS[s.room])return s;
 if(verb==="LOOK"){
  if(!target)say(s,{
   safehouse:"Eleanor and Vincent regroup in a shuttered safehouse, with paths to surviving hotel and municipal records.",
   hotelAnnex:"Ruth Calder guards the room-214 guest records, a switchboard roll, and Vincent's lost effects.",
   coronerOffice:"The dead man's identification and medical intake documents have been filed separately.",
   reconstructionDesk:"Three independent chains of evidence can explain the dead man, the shot, and Vincent's location."
  }[s.room]);else look(s,target);
 }else if(verb==="OPEN")open(s,target);
 else if(verb==="TAKE")take(s,target);
 else if(verb==="GO")go(s,target);
 else if(verb==="TALK")talk(s,target);
 else if(verb==="USE")use(s,target,item);
 s.actions+=1;return s;
}
export function chooseRuth(state,choice){
 const s=copy(state),c=s.case12;
 if(s.chapter!==12||s.status!=="playing"||s.room!=="hotelAnnex"||c?.dialogue!=="ruth"||
   !RUTH_OPTIONS.some(x=>x.id===choice))return s;
 if(choice==="close"){c.dialogue=null;say(s,"Ruth closes her ledger. 'The truth is still in those drawers.'","choice");return s;}
 if(c.ruthAsked.includes(choice)){say(s,"'I have already told you, detective.'","choice");return s;}
 c.ruthAsked.push(choice);
 if(choice==="timing"){
  award(s,"clues","ruth-time","NOTEBOOK: Ruth recalls the bellhop hearing a single shot at 2:06 A.M., not at the later police arrival.");
  say(s,"'The bellhop wrote down 2:06. The police had a later time because the wall clocks were wrong.'","choice");
 }else if(choice==="protect"){
  c.ruthTrust=Math.min(3,c.ruthTrust+2);
  say(s,"'I won't publish your name just to clear mine.' Ruth finally lets go of the drawer key.","choice");
 }else if(choice==="accuse"){
  c.ruthTrust=Math.max(-3,c.ruthTrust-2);
  say(s,"'You changed the clock!' Ruth folds her arms. 'That's why I kept the original pulse tape. I didn't change a thing.'","choice");
 }else if(choice==="show"){
  if(!s.inventory.includes("eleanor-testimony")){
   c.ruthAsked=c.ruthAsked.filter(x=>x!==choice);
   say(s,"You need Eleanor's signed original testimony, not merely her name.","warning");return s;
  }
  c.ruthTrust=Math.max(0,c.ruthTrust);
  c.recordsAccess=true;
  award(s,"inventory","ruth-record-key","INVENTORY: Ruth's original Marmont records key.");
  award(s,"clues","ruth-verified","NOTEBOOK: Ruth recognized Eleanor's original testimony and released the hotel archives.");
  say(s,"Ruth compares Eleanor's signature to the original ledger. 'This is genuine. The records and effects till are yours to check.'","evidence");
 }
 s.actions+=1;return s;
}
export function chooseAlibiLink(state,choice){
 const s=copy(state),c=s.case12;
 if(s.chapter!==12||s.status!=="playing"||s.room!=="reconstructionDesk"||!c?.boardOpen||!ALIBI_LINKS.some(x=>x.id===choice))return s;
 if(choice==="close"){c.boardOpen=false;say(s,"You step away from the case reconstruction board.","choice");return s;}
 if(c.links.includes(choice)){say(s,"That finding has already been corroborated.");return s;}
 const need={
  identity:["mercer-registration","mercer-death-docket","mercer-id-seal"],
  shot:["bellhop-timecard","hotel-pulse-roll"],
  alibi:["street-negative","morrow-cafe-receipt","original-negative"]
 };
 const missing=need[choice].filter(id=>!s.inventory.includes(id));
 if(missing.length){
  const hints={
   identity:"Compare the hotel guest card with the original coroner docket AND independent identity seal.",
   shot:"The bellhop incident card and original switchboard pulse roll must both corroborate the shot.",
   alibi:"The uncut street-facing frame, signed café receipt and original Marmont negative must all survive."
  };
  say(s,hints[choice],"warning");return s;
 }
 c.links.push(choice);
 const findings={
  identity:"IDENTITY CONFIRMED: Daniel Mercer was the dead man in room 214, a financial audit consultant.",
  shot:"SHOT VERIFIED: Independent bellhop and switchboard records place the gunshot at 2:06 A.M.",
  alibi:"ALIBI CORROBORATED: Street-camera footage and a signed café receipt put Vincent outside at 2:06 A.M."
 };
 award(s,"clues","alibi-"+choice,findings[choice]);
 s.actions+=1;
 if(c.links.length===3){
  c.boardSolved=true;c.boardOpen=false;
  say(s,"The last three lines agree: Mercer was shot at 2:06, and Vincent was across the street. His bloody hands remain unexplained, while the shooter and Kingfisher are still unidentified.","evidence");
 }
 return s;
}
export function chooseAlibiEnding(state,choice){
 const s=copy(state),c=s.case12;
 if(s.chapter!==12||s.status!=="playing"||s.room!=="reconstructionDesk"||!c?.endPanel||
  !ALIBI_ENDINGS.some(x=>x.id===choice))return s;
 if(choice==="back"){c.endPanel=false;say(s,"The report stays on the table while Vincent reconsiders.","choice");return s;}
 if(!c.reportTaken||!c.boardSolved){say(s,"Secure the original attestation before making the choice.","warning");return s;}
 c.decision=choice;c.endPanel=false;
 if(choice==="file"){
  award(s,"clues","alibi-filed","NOTEBOOK: Vincent filed the authenticated room-214 reconstruction with a police liaison, exposing himself to watchers.");
  say(s,"You file the attestation through the police liaison. Mercer's name becomes official, and Vincent has a defensible alibi. Somewhere in Chicago, a hidden telephone starts ringing.","choice");
 }else{
  award(s,"clues","alibi-sealed","NOTEBOOK: Vincent kept the authenticated room-214 alibi sealed while quietly pursuing the shooter.");
  say(s,"You lock the original attestation away. Vincent can now remember the shot without taking the blame for it, but he knows the watchers still control the public story.","choice");
 }
 s.status="chapter12complete";
 say(s,"CHAPTER 12 COMPLETE: Daniel Mercer was the victim. Vincent's alibi is corroborated, but the identity of the gunman and the person behind Kingfisher remains unproven. NEXT: THE MASKED PATRON.","ending");
 return s;
}
export function sanitizeAlibiCase(input){
 const s=freshAlibiCase();
 if(!input||typeof input!=="object"||Array.isArray(input))return s;
 for(const key of Object.keys(s))if(typeof s[key]==="boolean"&&typeof input[key]==="boolean")s[key]=input[key];
 s.priorDecision=input.priorDecision==="all"?"all":"quiet";
 s.ruthTrust=Number.isInteger(input.ruthTrust)?Math.max(-3,Math.min(3,input.ruthTrust)):0;
 if(Array.isArray(input.ruthAsked))s.ruthAsked=[...new Set(input.ruthAsked.filter(x=>RUTH_OPTIONS.some(o=>o.id===x&&x!=="close")))].slice(0,4);
 if(Array.isArray(input.links))s.links=[...new Set(input.links.filter(x=>["identity","shot","alibi"].includes(x)))].slice(0,3);
 s.boardSolved=s.boardSolved&&s.links.length===3;
 if(s.boardSolved)s.boardOpen=false;
 if(!s.boardSolved){s.reportTaken=false;s.endPanel=false;}
 if(input.dialogue==="ruth")s.dialogue="ruth";
 if(["file","hold"].includes(input.decision))s.decision=input.decision;
 if(s.decision)s.endPanel=false;
 return s;
}
