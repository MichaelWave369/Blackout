/* BLACKOUT Chapter 11: Lantern House.
 * Pure original detective narrative and rescue-planning rules. No browser imports.
 */
export const LANTERN_HOTSPOTS={
 lanternLanding:[
  ["ada","Ada Reed, groundskeeper"],["greenhouse","Greenhouse service gate"],
  ["front","Floodlit front entrance"],["boathouse","Boathouse"],["sign","Lantern House sign"],
  ["lantern","Signal lantern"],["water","Canal inlet"]
 ],
 lanternGreenhouse:[
  ["cabinet","Groundskeeper's tool cabinet"],["survey","Original service survey"],
  ["tide","Pier tide card"],["control","Security control passage"],
  ["landing","Return to dock"],["glass","Frosted glass roof"],["plants","Overgrown planters"]
 ],
 lanternControl:[
  ["files","Guard duty file cabinet"],["watchlog","Original camera sweep log"],
  ["board","Evacuation planning table"],["ward","Locked observation ward"],
  ["greenhouse","Return to greenhouse"],["camera","Watcher monitor"],["lamp","Warning lamp"]
 ],
 eleanorWard:[
  ["eleanor","Eleanor Ashworth"],["letter","Eleanor's original letter"],
  ["records","Detainee transfer register"],["intercom","Ward intercom"],
  ["witnesses","Other held witnesses"],["door","Back to control room"],["window","Canal window"]
 ]
};
export const ADA_OPTIONS=[
 {id:"ask",label:"ASK WHY LANTERN HOUSE IS GUARDED"},
 {id:"promise",label:"PROMISE TO PROTECT THE STAFF"},
 {id:"accuse",label:"ACCUSE ADA OF HELPING THE CAPTORS"},
 {id:"proof",label:"SHOW THE ORIGINAL SABLE-12 TRACE"},
 {id:"close",label:"END INTERVIEW"}
];
export const PLAN_OPTIONS={
 approach:[
  {id:"front",label:"APPROACH: FLOODLIT FRONT HALL"},
  {id:"greenhouse",label:"APPROACH: GREENHOUSE SERVICE PASSAGE"}
 ],
 power:[
  {id:"blackout",label:"POWER: CUT EVERY LIGHT"},
  {id:"loop",label:"POWER: LOOP THE CAMERA FEED"}
 ],
 exit:[
  {id:"street",label:"EXIT: GUARDED STREET GATE"},
  {id:"pier",label:"EXIT: LOW-TIDE SERVICE PIER"}
 ]
};
export const RESCUE_OPTIONS=[
 {id:"all",label:"FREE THE OTHER WITNESSES AND ESCORT ELEANOR"},
 {id:"quiet",label:"ESCORT ELEANOR OUT WITH THE ORIGINAL EVIDENCE"},
 {id:"back",label:"RECHECK THE WARD BEFORE LEAVING"}
];
const EXPECTED={approach:"greenhouse",power:"loop",exit:"pier"};
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
 s.case11.dialogue=null;s.case11.planOpen=false;s.case11.evacPanel=false;
 say(s,message,"chapter");
}
export function freshLanternCase(priorChoice=""){
 return {
  priorChoice:priorChoice==="divert"?"divert":"pursue",
  adaTrust:priorChoice==="divert"?1:-1,adaMet:false,adaAsked:[],accessGranted:false,
  dialogue:null,cabinetOpen:false,surveyTaken:false,tideTaken:false,
  filesOpen:false,watchLogTaken:false,planOpen:false,
  plan:{approach:"",power:"",exit:""},alarmCount:0,wardOpen:false,
  eleanorMet:false,letterTaken:false,recordsTaken:false,
  evacPanel:false,witnessesFreed:false,decision:""
 };
}
export function lanternTargets(s){
 const c=s.case11;if(!c)return[];
 return (LANTERN_HOTSPOTS[s.room]||[]).filter(([id])=>{
  if(id==="survey")return c.cabinetOpen&&!c.surveyTaken;
  if(id==="tide")return !c.tideTaken;
  if(id==="watchlog")return c.filesOpen&&!c.watchLogTaken;
  if(id==="letter")return !c.letterTaken;
  if(id==="records")return !c.recordsTaken;
  return true;
 });
}
function look(s,target){
 const c=s.case11;
 const scenes={
  lanternLanding:{
   ada:"Ada Reed, the Lantern House groundskeeper, stands beside a cold pier lamp. Her hands are shaking, but she hasn't run.",
   greenhouse:c.accessGranted?"Ada has unlocked the greenhouse service gate. Its passage avoids the cameras at the front.":"A chained service gate leads into an overgrown greenhouse.",
   front:"Armed watchers cross the brightly lit front entrance. Approaching openly would expose everyone inside.",
   boathouse:"An empty launch cradle. A narrow wooden service pier runs behind the house at low tide.",
   sign:"LANTERN HOUSE / PRIVATE RECOVERY WARD. The small print reads 'No Visitors.'",
   lantern:"The signal lantern is dark. Someone disconnected it to make the pier harder to see.",
   water:"The tide has withdrawn, exposing a narrow route to the rear service pier."
  },
  lanternGreenhouse:{
   cabinet:c.cabinetOpen?"The tool cabinet is open, revealing a folded architectural service survey.":"A garden tool cabinet is padlocked with a rusty clasp.",
   survey:"The service survey marks an unguarded GREENHOUSE PASSAGE. The front hall falls within two camera sweeps.",
   tide:"Tide timetable: 6:30–7:30, the rear SERVICE PIER is passable. The STREET GATE is watched.",
   control:"A narrow doorway leads into Lantern House's camera control station.",
   landing:"Back toward the canal landing, where Ada keeps watch.",
   glass:"Dawn turns the greenhouse glass pale blue. The panes are painted to conceal the interior.",
   plants:"Vines and empty flowerbeds have overtaken the greenhouse. Nobody has tended them in months."
  },
  lanternControl:{
   files:c.filesOpen?"The watch file cabinet is open; the original guard sweep log lies within.":"A security file cabinet has been left with its brass handle half loose.",
   watchlog:"Watch sweep log: loop the CAMERA FEED at the relay. Cutting all power triggers an automatic alarm.",
   board:c.wardOpen?"The safe evacuation route is set: greenhouse, camera loop, service pier.":"An evacuation plan with three independent choices: APPROACH, POWER and EXIT.",
   ward:c.wardOpen?"The observation ward door is released. Someone is moving inside.":"The observation ward's steel door stays locked until the caretaker's safe route is programmed.",
   greenhouse:"The glass service corridor leads back to the greenhouse.",
   camera:"A row of camera monitors shows the front hall, street gate and an empty service passage.",
   lamp:"A red alarm bulb. A bad plan will draw attention, but you can correct it before entering the ward."
  },
  eleanorWard:{
   eleanor:"Eleanor Ashworth stands at the far window. She looks exhausted but alive. She recognizes Vincent before he says a word.",
   letter:"Eleanor's sealed testimony: 'I knew about the surveillance before the hotel, but I did not order the killing.'",
   records:"A detainee register shows Eleanor and several other witnesses moved through Lantern House. The order came from a masked sponsor.",
   intercom:"The ward intercom controls the safe pier evacuation alarm and the release of other occupied rooms.",
   witnesses:"Several civilians wait in locked rooms nearby. An escort through the pier could bring them out, at greater risk.",
   door:"The service corridor leads back toward the greenhouse.",
   window:"The low-tide service pier is visible beyond the window. The morning mist is beginning to lift."
  }
 };
 say(s,scenes[s.room]?.[target]||"Nothing here answers Vincent's questions.");
 if(s.room==="lanternLanding"&&target==="front")
  award(s,"clues","lantern-front-danger","NOTEBOOK: The front entrance is covered by watchers and cameras.");
 if(s.room==="lanternGreenhouse"&&target==="glass")
  award(s,"clues","lantern-covered-route","NOTEBOOK: Frosted greenhouse glass conceals the service passage.");
 if(s.room==="eleanorWard"&&target==="witnesses")
  award(s,"clues","lantern-detainees","NOTEBOOK: Other civilians are being held at Lantern House.");
}
function open(s,target){
 const c=s.case11;
 if(s.room==="lanternGreenhouse"&&target==="cabinet"){
  if(c.cabinetOpen){say(s,"The tool cabinet is already open.");return;}
  c.cabinetOpen=true;say(s,"The rusted clasp gives way. A building survey falls beside an old garden key.","evidence");return;
 }
 if(s.room==="lanternControl"&&target==="files"){
  if(c.filesOpen){say(s,"The watch files are already open.");return;}
  c.filesOpen=true;say(s,"Inside the security cabinet, someone left the actual camera sweep schedule.","evidence");return;
 }
 if(s.room==="lanternControl"&&target==="board"){
  if(c.wardOpen){say(s,"The evacuation plan has been accepted. The ward is unlocked.");return;}
  if(!c.surveyTaken||!c.tideTaken||!c.watchLogTaken){
   say(s,"Before planning the rescue, collect the original building survey, tide card and camera sweep schedule.","warning");return;
  }
  c.planOpen=true;say(s,"Three independent decisions determine the safest route. Consult the survey, guard log and tide card.","choice");return;
 }
 say(s,"That doesn't open.");
}
function take(s,target){
 const c=s.case11;
 if(s.room==="lanternGreenhouse"&&target==="survey"&&c.cabinetOpen&&!c.surveyTaken){
  c.surveyTaken=true;
  award(s,"inventory","lantern-survey","INVENTORY: Original Lantern House service survey.");
  award(s,"clues","lantern-service-approach","NOTEBOOK: The greenhouse passage avoids the front camera sweep.");
 }else if(s.room==="lanternGreenhouse"&&target==="tide"&&!c.tideTaken){
  c.tideTaken=true;
  award(s,"inventory","lantern-tide-card","INVENTORY: Low-tide service pier schedule.");
  award(s,"clues","lantern-pier-exit","NOTEBOOK: The low-tide pier is unguarded while the street gate is watched.");
 }else if(s.room==="lanternControl"&&target==="watchlog"&&c.filesOpen&&!c.watchLogTaken){
  c.watchLogTaken=true;
  award(s,"inventory","lantern-watchlog","INVENTORY: Original watcher sweep schedule.");
  award(s,"clues","lantern-camera-loop","NOTEBOOK: Looping the camera feed hides the escape; a full blackout triggers an alarm.");
 }else if(s.room==="eleanorWard"&&target==="letter"&&!c.letterTaken){
  c.letterTaken=true;
  award(s,"inventory","eleanor-testimony","INVENTORY: Eleanor Ashworth's signed original testimony.");
  award(s,"clues","eleanor-testimony-clue","NOTEBOOK: Eleanor knew of the surveillance but denies ordering the hotel murder.");
 }else if(s.room==="eleanorWard"&&target==="records"&&!c.recordsTaken){
  c.recordsTaken=true;
  award(s,"inventory","lantern-detainee-register","INVENTORY: Original Lantern House detainee register.");
  award(s,"clues","lantern-masked-orders","NOTEBOOK: The detention orders reference a masked sponsor, not a verified Kingfisher identity.");
 }else say(s,"That evidence is not available to collect.");
}
function go(s,target){
 const c=s.case11;
 if(s.room==="lanternLanding"&&target==="greenhouse"){
  if(!c.accessGranted){say(s,"Ada has the service-gate key. Present the original North Canal trace.","warning");return;}
  move(s,"lanternGreenhouse","LANTERN HOUSE GREENHOUSE. A service survey and tide card could reveal a safe route to the interior.");return;
 }
 if(s.room==="lanternLanding"&&target==="front"){
  say(s,"The front entrance is watched by armed guards. There must be a safer way.","warning");return;
 }
 if(s.room==="lanternLanding"&&target==="boathouse"){
  say(s,"The boathouse is empty and the pier is exposed at low tide. You need the ward open before anyone can evacuate.","warning");return;
 }
 if(s.room==="lanternGreenhouse"&&target==="landing"){
  move(s,"lanternLanding","CANAL LANDING. Ada waits beside the shuttered pier lantern.");return;
 }
 if(s.room==="lanternGreenhouse"&&target==="control"){
  move(s,"lanternControl","LANTERN HOUSE SECURITY CONTROL. Three parts of a rescue plan are needed to release the observation ward.");return;
 }
 if(s.room==="lanternControl"&&target==="greenhouse"){
  move(s,"lanternGreenhouse","GREENHOUSE SERVICE CORRIDOR. Glass rattles overhead as the building's cameras sweep.");return;
 }
 if(s.room==="lanternControl"&&target==="ward"){
  if(!c.wardOpen){say(s,"The ward's magnetic lock is on. Build a safe plan at the evacuation table.","warning");return;}
  move(s,"eleanorWard","OBSERVATION WARD. Eleanor Ashworth is alive, waiting beside a canal-facing window. Vincent has finally found her.");return;
 }
 if(s.room==="eleanorWard"&&target==="door"){
  move(s,"lanternControl","SECURITY CONTROL. The route to the ward remains programmed and open.");return;
 }
 say(s,"That way is blocked.");
}
function talk(s,target){
 const c=s.case11;
 if(s.room==="lanternLanding"&&target==="ada"){
  c.adaMet=true;c.dialogue="ada";
  say(s,c.priorChoice==="divert"?
   "Ada's eyes follow you. 'Someone diverted the signal at North Canal. It gave us time to hide the pier key. Was that you?'":
   "'They tracked your signal right to the waterworks. I won't open this gate for another one of their men.'","choice");
  return;
 }
 if(s.room==="eleanorWard"&&target==="eleanor"){
  if(!c.eleanorMet){
   c.eleanorMet=true;
   award(s,"clues","eleanor-found","NOTEBOOK: Eleanor Ashworth has been found alive at Lantern House.");
   award(s,"memories","eleanor-reunion","MEMORY FRAGMENT 11: Vincent remembers Eleanor placing the blue-door clue in his hand before they were separated.");
   say(s,"'Vincent?' Eleanor reaches for his hand. 'I left you the blue-door clue because I knew they would take me. We can explain the hotel later. Right now there are others here.'","evidence");
  }else say(s,"'I'm here, Vincent. Look for my testimony and the detainee register. We need to get out safely.'","choice");
  return;
 }
 if(s.room==="eleanorWard"&&target==="intercom"){
  if(!c.eleanorMet||!c.letterTaken||!c.recordsTaken){
   say(s,"Eleanor needs to talk to you first. Secure her original testimony and the detainee register before choosing the evacuation.","warning");return;
  }
  c.evacPanel=true;
  say(s,"The intercom offers two evacuation settings. Release every ward, risking attention, or guide Eleanor out quietly with the original evidence.","choice");
  return;
 }
 say(s,"Nobody answers.");
}
function use(s,target,item){
 if(s.room==="lanternLanding"&&target==="ada"&&item==="sable-trace"&&s.inventory.includes(item)){
  talk(s,target);say(s,"You show Ada the SABLE original; it proves you followed Eleanor's transfer rather than the watchers.","evidence");return;
 }
 if(s.room==="lanternControl"&&target==="board"&&item==="lantern-survey"&&s.inventory.includes(item)){
  open(s,"board");return;
 }
 if(s.room==="eleanorWard"&&target==="intercom"){talk(s,target);return;}
 say(s,"Those items don't offer a new route.");
}
export function lanternAction(s,verb,target,item=""){
 if(s.chapter!==11||s.status!=="playing"||!s.case11||!LANTERN_HOTSPOTS[s.room])return s;
 if(verb==="LOOK"){
  if(!target)say(s,{
   lanternLanding:"At dawn, Ada Reed watches a service greenhouse beneath Lantern House's floodlit walls.",
   lanternGreenhouse:"The glass service passage conceals a survey, tide card and route to the control station.",
   lanternControl:"A security room with watch logs and an evacuation plan leading to the locked ward.",
   eleanorWard:"Eleanor Ashworth is alive. Her signed testimony and other detainees' register remain in the ward."
  }[s.room]);else look(s,target);
 }else if(verb==="OPEN")open(s,target);
 else if(verb==="TAKE")take(s,target);
 else if(verb==="GO")go(s,target);
 else if(verb==="TALK")talk(s,target);
 else if(verb==="USE")use(s,target,item);
 s.actions+=1;return s;
}
export function chooseAda(state,choice){
 const s=copy(state),c=s.case11;
 if(s.chapter!==11||s.status!=="playing"||s.room!=="lanternLanding"||c?.dialogue!=="ada"||
  !ADA_OPTIONS.some(o=>o.id===choice))return s;
 if(choice==="close"){c.dialogue=null;say(s,"Ada returns to watching the service gate.","choice");return s;}
 if(c.adaAsked.includes(choice)){say(s,"'We have already been over that, detective.'","choice");return s;}
 c.adaAsked.push(choice);
 if(choice==="ask"){
  award(s,"clues","ada-watchers","NOTEBOOK: Ada confirms Lantern House is a holding facility and the front hall is under watch.");
  say(s,"'They call it a recovery ward. It's a holding place. I've seen people come in; I haven't seen them leave.'","choice");
 }else if(choice==="promise"){
  c.adaTrust=Math.min(3,c.adaTrust+2);
  say(s,"'I won't leave your name behind, Ada.' She loosens her grip on the gate chain.","choice");
 }else if(choice==="accuse"){
  c.adaTrust=Math.max(-3,c.adaTrust-2);
  say(s,"'You let them imprison her!' Ada stares toward the greenhouse. 'I stayed because I was trying to get them out.'","choice");
 }else if(choice==="proof"){
  if(!s.inventory.includes("sable-trace")){
   c.adaAsked=c.adaAsked.filter(x=>x!==choice);
   say(s,"Ada needs the original North Canal radio trace, not an unsupported accusation.","warning");return s;
  }
  c.adaTrust=Math.max(0,c.adaTrust);
  c.accessGranted=true;
  award(s,"inventory","lantern-service-key","INVENTORY: Lantern House greenhouse service key.");
  award(s,"clues","ada-authentication","NOTEBOOK: Ada authenticated the original SABLE-12 transfer record.");
  say(s,"Ada studies the original transfer. 'That's her. E.A. was brought here alive.' She opens the greenhouse gate. 'Take the service passage, not the front entrance.'","evidence");
 }
 s.actions+=1;return s;
}
export function chooseLanternPlan(state,field,value){
 const s=copy(state),c=s.case11;
 if(s.chapter!==11||s.status!=="playing"||s.room!=="lanternControl"||!c?.planOpen||c.wardOpen||
  !Object.prototype.hasOwnProperty.call(PLAN_OPTIONS,field)||
  !PLAN_OPTIONS[field].some(x=>x.id===value))return s;
 c.plan[field]=value;
 say(s,"EVACUATION PLAN: "+field.toUpperCase()+" set to "+value.toUpperCase()+".","choice");
 s.actions+=1;return s;
}
export function executeLanternPlan(state){
 const s=copy(state),c=s.case11;
 if(s.chapter!==11||s.status!=="playing"||s.room!=="lanternControl"||!c?.planOpen||c.wardOpen)return s;
 if(!c.surveyTaken||!c.watchLogTaken||!c.tideTaken){
  say(s,"The plan requires the original service survey, watch schedule and tide card.","warning");return s;
 }
 const incomplete=Object.keys(EXPECTED).filter(k=>!c.plan[k]);
 if(incomplete.length){say(s,"Choose an approach, a camera-power strategy, and an exit route before executing.","warning");return s;}
 const wrong=Object.keys(EXPECTED).filter(k=>c.plan[k]!==EXPECTED[k]);
 if(wrong.length){
  c.alarmCount=Math.min(3,c.alarmCount+1);
  const hints={
   approach:"The front hall is watched. Recheck the greenhouse survey.",
   power:"Cutting all power triggers an alarm. The guard log describes a safer loop.",
   exit:"The street gate is watched. Recheck the low-tide service pier."
  };
  say(s,"Unsafe rescue plan: "+wrong.map(k=>hints[k]).join(" "),"warning");return s;
 }
 c.wardOpen=true;c.planOpen=false;
 award(s,"clues","lantern-safe-route","NOTEBOOK: The original documents identify a safe GREENHOUSE / CAMERA LOOP / PIER evacuation.");
 say(s,"The monitor feed loops the empty corridor, and the ward lock releases without a blackout. The service pier is ready. Vincent can reach Eleanor.","evidence");
 s.actions+=1;return s;
}
export function chooseLanternRescue(state,choice){
 const s=copy(state),c=s.case11;
 if(s.chapter!==11||s.status!=="playing"||s.room!=="eleanorWard"||!c?.evacPanel||
  !RESCUE_OPTIONS.some(x=>x.id===choice))return s;
 if(choice==="back"){c.evacPanel=false;say(s,"Eleanor stays by your side while you review the evidence.","choice");return s;}
 if(!c.eleanorMet||!c.letterTaken||!c.recordsTaken||!c.wardOpen){
  say(s,"Vincent and Eleanor need the signed testimony and detainee register before leaving.","warning");return s;
 }
 c.decision=choice;c.evacPanel=false;
 if(choice==="all"){
  c.witnessesFreed=true;
  award(s,"clues","lantern-witness-rescue","NOTEBOOK: Vincent and Eleanor evacuated the held witnesses through the service pier.");
  say(s,"You release the other ward doors. The greenhouse route fills with frightened witnesses, and Eleanor leads them to the pier. Everyone escapes, but the watchers will know.","choice");
 }else{
  award(s,"clues","lantern-quiet-escape","NOTEBOOK: Vincent escorted Eleanor out quietly with the original records; other detainees remain behind.");
  say(s,"Eleanor clutches her testimony as you guide her through the greenhouse. The watchers are still searching for her, and the other rooms remain locked.","choice");
 }
 s.status="chapter11complete";
 say(s,"CHAPTER 11 COMPLETE: Eleanor Ashworth is alive and out of Lantern House. She can help reconstruct what happened in room 214, but the Kingfisher's identity and the murder remain unresolved. NEXT: THE LAST ALIBI.","ending");
 return s;
}
export function sanitizeLanternCase(input){
 const s=freshLanternCase();
 if(!input||typeof input!=="object"||Array.isArray(input))return s;
 for(const k of Object.keys(s))if(typeof s[k]==="boolean"&&typeof input[k]==="boolean")s[k]=input[k];
 s.priorChoice=input.priorChoice==="divert"?"divert":"pursue";
 s.adaTrust=Number.isInteger(input.adaTrust)?Math.max(-3,Math.min(3,input.adaTrust)):0;
 if(Array.isArray(input.adaAsked))
  s.adaAsked=[...new Set(input.adaAsked.filter(x=>ADA_OPTIONS.some(o=>o.id===x&&x!=="close")))].slice(0,4);
 for(const key of Object.keys(s.plan)){
  const value=input.plan&&typeof input.plan==="object"&&!Array.isArray(input.plan)?input.plan[key]:null;
  if(PLAN_OPTIONS[key].some(x=>x.id===value))s.plan[key]=value;
 }
 s.alarmCount=Number.isInteger(input.alarmCount)?Math.max(0,Math.min(3,input.alarmCount)):0;
 if(s.wardOpen){s.plan={...EXPECTED};s.planOpen=false;}
 if(input.dialogue==="ada")s.dialogue="ada";
 if(["all","quiet"].includes(input.decision))s.decision=input.decision;
 if(s.decision)s.evacPanel=false;
 if(s.decision==="all")s.witnessesFreed=true;
 return s;
}
