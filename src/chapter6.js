/* BLACKOUT Chapter 6: The Forgotten Rails.
 * Deterministic clue, witness and signal-routing rules independent of the browser.
 */
export const RAIL_HOTSPOTS={
  railTunnel:[
    ["chalk","Chalk route marks"],["poster","Evacuation map"],["rubble","Collapsed stairs"],
    ["cabin","Signal cabin entrance"],["platform","Abandoned platform"],["water","Trackside runoff"]
  ],
  signalCabin:[
    ["timetable","Dispatch timetable"],["locker","Maintenance locker"],
    ["board","Signal switchboard"],["telephone","Dead telephone"],["lamp","Oil lantern"],
    ["window","Track window"],["exit","Tunnel exit"]
  ],
  railPlatform:[
    ["elsie","Elsie Vale, rail mechanic"],["train","Abandoned Pullman car"],
    ["clock","Station clock"],["bench","Station bench"],["poster","Rail service notice"],
    ["tunnel","Tunnel return"],["track","Rusting tracks"]
  ],
  ghostTrain:[
    ["seat","Eleanor's seat"],["ticket","Punch-marked ticket"],
    ["case","Conductor's lockbox"],["ledger","Kingfisher ledger leaf"],
    ["window","Dusty train window"],["hatch","Service lift hatch"],
    ["exit","Platform exit"],["badge","Conductor badge"]
  ]
};
export const ELSIE_OPTIONS=[
 {id:"ask",label:"ASK ABOUT THE BLACK K TRAIN"},
 {id:"reassure",label:"PROMISE TO PROTECT ELSIE"},
 {id:"show-proof",label:"SHOW ELEANOR'S WIRE RECORDING"},
 {id:"accuse",label:"ACCUSE ELSIE OF HELPING KINGFISHER"},
 {id:"close",label:"END INTERVIEW"}
];
export const SWITCH_OPTIONS=[
 {id:"A",label:"THROW SWITCH A"},
 {id:"B",label:"THROW SWITCH B"},
 {id:"C",label:"THROW SWITCH C"},
 {id:"reset",label:"RESET SIGNALS"}
];
export const EXIT_OPTIONS=[
 {id:"warn",label:"WARN VERA BEFORE GOING TO THE EXCHANGE"},
 {id:"silent",label:"FOLLOW THE LEAD WITHOUT ALERTING ANYONE"},
 {id:"back",label:"SEARCH THE TRAIN AGAIN"}
];
const ROUTE=["C","A","B"];
const clone=s=>JSON.parse(JSON.stringify(s));
function say(s,message,kind="narration"){
  s.transcript.push({id:(s.transcript.at(-1)?.id||0)+1,text:message,kind});
  s.transcript=s.transcript.slice(-35);
}
function award(s,group,id,message){
  if(!s[group].includes(id)){s[group].push(id);if(message)say(s,message,"evidence");}
}
function move(s,room,message){
  s.room=room;
  if(!s.discovered.includes(room))s.discovered.push(room);
  s.case6.dialogue=null;s.case6.switchPanel=false;s.case6.exitPanel=false;
  say(s,message,"chapter");
}
export function freshRailCase(warehouseDecision=""){
  return {
    elsieMet:false,elsieTrust:warehouseDecision==="protect"?1:warehouseDecision==="expose"?-1:0,
    elsieAsked:[],keyGranted:false,lockerOpen:false,timetableTaken:false,
    switchPanel:false,switchSequence:[],signalsAligned:false,
    lockboxOpen:false,ticketTaken:false,ledgerTaken:false,
    badgeTaken:false,exitPanel:false,dialogue:null,decision:""
  };
}
export function railTargets(s){
  const c=s.case6;
  if(!c)return[];
  return (RAIL_HOTSPOTS[s.room]||[]).filter(([id])=>{
    if(id==="timetable")return !c.timetableTaken;
    if(id==="ticket")return !c.ticketTaken;
    if(id==="ledger")return c.lockboxOpen&&!c.ledgerTaken;
    if(id==="badge")return !c.badgeTaken;
    return true;
  });
}
function look(s,target){
  const c=s.case6;
  const texts={
    railTunnel:{
      chalk:"A chalk arrow points toward an abandoned platform. Under it: 'SIXTH NIGHT / TRACK ZERO'.",
      poster:"EMERGENCY RAIL ROUTE: SIGNAL C → SIGNAL A → SIGNAL B. Someone has circled the sequence in red.",
      rubble:"The staircase to the street collapsed years ago. Only the underground route remains.",
      cabin:"A glass-fronted control cabin, dark except for one weak maintenance lamp.",
      platform:"Old enamel tiles and the rusted silhouette of a Pullman car beyond the fog.",
      water:"Black water carries an oil slick toward the river. The tunnel has a second outlet."
    },
    signalCabin:{
      timetable:"The last dispatch is stamped: TRANSFER E.A., CAR 09, TRACK ZERO. A line reads C / A / B.",
      locker:c.lockerOpen?"The maintenance locker is open. Only old fuses remain.":"An iron locker with a rusted latch and a scrap of insulation caught in the hinge.",
      board:c.signalsAligned?"The route lamps glow steadily, connecting the platform to Car 09.":"Three signal levers marked A, B, C. A paper label says 'THROW IN DISPATCH ORDER'.",
      telephone:"The telephone line has been cut at the wall. Whoever left here wanted no calls.",
      lamp:"The lantern burns on the last of its oil, lighting the switchboard numbers.",
      window:"A narrow window overlooks a train marked CAR 09.",
      exit:"The tunnel entrance waits outside."
    },
    railPlatform:{
      elsie:"Elsie Vale, a railway mechanic with grease on her hands and a bruise on her cheek. She recognizes the black K.",
      train:c.signalsAligned?"The route lamps glow green over the abandoned passenger car. The door has unlatched.":"The train door is locked by the signal circuit. Someone could still be inside.",
      clock:"The station clock stopped at 4:17. The same numbers as the dock freight code.",
      bench:"A folded coat and a half-smoked cigarette. Someone was here recently.",
      poster:"A faded timetable lists the last night train and the old Exchange stop, which no longer appears on city maps.",
      tunnel:"The dark passage returns to the signal cabin and the drainage tunnel.",
      track:"Scratches in the rail suggest that Car 09 was moved recently, despite the rust."
    },
    ghostTrain:{
      seat:"A blue wool thread is caught in the seat seam. Eleanor sat here, and she was alive when the train moved.",
      ticket:"Punched railway ticket: E. ASHWORTH / EXCHANGE / ONE WAY.",
      case:c.lockboxOpen?"The conductor's lockbox is open. A ledger leaf rests under the false lining.":"A lockbox beneath the conductor's seat. The latch is loose enough to pry by hand.",
      ledger:"A ledger page bearing the Kingfisher crest and shell-company names linked to Webb.",
      window:"A station platform recedes into darkness. The train's glass reflects somebody who looks like Vincent.",
      hatch:"A sealed service lift leads to the old Exchange passage. Only proceed with sufficient evidence.",
      exit:"Back to the deserted platform.",
      badge:"A brass conductor badge stamped CAR 09."
    }
  };
  say(s,texts[s.room]?.[target]||"Nothing useful here.");
  if(s.room==="railTunnel"&&target==="poster")award(s,"clues","rail-signal-order","NOTEBOOK: The emergency rail map gives signal order C–A–B.");
  if(s.room==="railPlatform"&&target==="clock")award(s,"clues","rail-417","NOTEBOOK: The frozen platform clock echoes the dock freight code 417.");
}
function open(s,target){
  const c=s.case6;
  if(s.room==="signalCabin"&&target==="locker"){
    if(c.lockerOpen){say(s,"The maintenance locker is already open.");return;}
    c.lockerOpen=true;
    say(s,"The rusty latch cracks. A pencil inscription inside reads C–A–B. Someone wanted the safe route remembered.","evidence");return;
  }
  if(s.room==="signalCabin"&&target==="board"){
    if(!c.keyGranted){say(s,"The switchboard is missing its master key. Elsie might know where it went.","warning");return;}
    if(!c.timetableTaken){say(s,"You need the signed dispatch timetable before moving a train. Guessing isn't good detective work.","warning");return;}
    if(c.signalsAligned){say(s,"The signal route is already aligned. Car 09 is accessible.");return;}
    c.switchPanel=true;
    say(s,"The master key fits. Three brass levers wait: A, B and C. Throw them in the timetable's order.","choice");return;
  }
  if(s.room==="ghostTrain"&&target==="case"){
    if(c.lockboxOpen){say(s,"The lockbox's false lining is already exposed.");return;}
    c.lockboxOpen=true;say(s,"A clasp breaks loose. Under the lining lies a Kingfisher ledger leaf.","evidence");return;
  }
  say(s,"Nothing opens. Search for another clue.");
}
function take(s,target){
  const c=s.case6;
  if(s.room==="signalCabin"&&target==="timetable"&&!c.timetableTaken){
    c.timetableTaken=true;
    award(s,"inventory","rail-timetable","INVENTORY: Signed transfer timetable for Car 09.");
    award(s,"clues","car09-transfer","NOTEBOOK: E.A. transferred onto Car 09 at Track Zero; signal order C–A–B.");
  }else if(s.room==="ghostTrain"&&target==="ticket"&&!c.ticketTaken){
    c.ticketTaken=true;
    award(s,"inventory","eleanor-ticket","INVENTORY: Eleanor Ashworth's one-way Exchange ticket.");
    award(s,"clues","exchange-ticket","NOTEBOOK: A ticket places Eleanor on the train bound for the abandoned Exchange stop.");
    award(s,"memories","car09-memory","MEMORY FRAGMENT 06: A carriage door sliding shut. Vincent shouts Eleanor's name through the mist.");
  }else if(s.room==="ghostTrain"&&target==="ledger"&&c.lockboxOpen&&!c.ledgerTaken){
    c.ledgerTaken=true;
    award(s,"inventory","kingfisher-ledger","INVENTORY: Original Kingfisher ledger leaf.");
    award(s,"clues","kingfisher-account","NOTEBOOK: The Kingfisher network used the old Exchange to move people and cash through Webb's companies.");
  }else if(s.room==="ghostTrain"&&target==="badge"&&!c.badgeTaken){
    c.badgeTaken=true;
    award(s,"inventory","car09-badge","INVENTORY: Conductor's brass badge, Car 09.");
  }else say(s,"You cannot take that, or you already have it.");
}
function go(s,target){
  const c=s.case6;
  if(s.room==="railTunnel"&&target==="cabin"){
    move(s,"signalCabin","SIGNAL CABIN. A dust-covered switchboard and signed dispatch timetable overlook the tracks.");return;
  }
  if(s.room==="railTunnel"&&target==="platform"){
    move(s,"railPlatform","ABANDONED PLATFORM. A woman in work overalls watches an unmoving Pullman car. Her name is Elsie Vale.");return;
  }
  if(s.room==="signalCabin"&&target==="exit"){
    move(s,"railTunnel","SERVICE TUNNEL. The water drips steadily toward the river.");return;
  }
  if(s.room==="railPlatform"&&target==="tunnel"){
    move(s,"railTunnel","SERVICE TUNNEL. Chalk marks show the route back to the signal cabin.");return;
  }
  if(s.room==="railPlatform"&&target==="train"){
    if(!c.signalsAligned){say(s,"The passenger car stays locked. The signal cabin must restore the route first.","warning");return;}
    move(s,"ghostTrain","CAR 09. Blue wool clings to the seat. The dust hides a one-way ticket and conductor's lockbox.");return;
  }
  if(s.room==="ghostTrain"&&target==="exit"){
    move(s,"railPlatform","ABANDONED PLATFORM. Elsie waits beside the Car 09 door.");return;
  }
  if(s.room==="ghostTrain"&&target==="hatch"){
    c.exitPanel=true;
    say(s,"The service lift descends to the old Exchange. The evidence might expose Kingfisher, but whom can you safely tell?","choice");return;
  }
  say(s,"That route is blocked.");
}
function talk(s,target){
  const c=s.case6;
  if(s.room==="railPlatform"&&target==="elsie"){
    c.elsieMet=true;c.dialogue="elsie";
    if(s.inventory.includes("black-k-chip")){
      say(s,"Elsie's eyes lock on the black K chip. 'You came from the docks. Then you know the people on that train weren't cargo.'","choice");
    }else say(s,"'I don't talk to strangers down here. Whoever sent you can come themselves.'","warning");
    return;
  }
  say(s,"Only the old rails answer.");
}
function use(s,target,item){
  const c=s.case6;
  if(s.room==="signalCabin"&&target==="board"&&item==="rail-master-key"&&s.inventory.includes(item)){
    open(s,target);return;
  }
  if(s.room==="railPlatform"&&target==="elsie"&&item==="black-k-chip"&&s.inventory.includes(item)){
    talk(s,target);return;
  }
  say(s,"That combination offers no new insight.");
}
export function railAction(s,verb,target,item=""){
  if(s.chapter!==6||s.status!=="playing"||!s.case6||!RAIL_HOTSPOTS[s.room])return s;
  if(verb==="LOOK"){
    if(!target)say(s,{
      railTunnel:"A drainage tunnel connects an abandoned platform with a signal-control cabin.",
      signalCabin:"Switchboard, maintenance locker and signed timetable. Something moved Car 09 despite years of closure.",
      railPlatform:"Elsie Vale waits beside Car 09 beneath a stopped station clock.",
      ghostTrain:"A dead passenger carriage with Eleanor's one-way ticket and a hidden ledger leaf."
    }[s.room]);else look(s,target);
  }else if(verb==="OPEN")open(s,target);
  else if(verb==="TAKE")take(s,target);
  else if(verb==="GO")go(s,target);
  else if(verb==="TALK")talk(s,target);
  else if(verb==="USE")use(s,target,item);
  s.actions+=1;return s;
}
export function chooseElsie(state,choice){
  const s=clone(state),c=s.case6;
  if(s.chapter!==6||s.status!=="playing"||s.room!=="railPlatform"||
     c?.dialogue!=="elsie"||!ELSIE_OPTIONS.some(x=>x.id===choice))return s;
  if(choice==="close"){c.dialogue=null;say(s,"Elsie returns to checking the rusted train wheels.","choice");return s;}
  if(c.elsieAsked.includes(choice)){
    say(s,"Elsie shakes her head. 'We have already been over that.'","choice");return s;
  }
  c.elsieAsked.push(choice);
  if(choice==="reassure"){
    c.elsieTrust=Math.min(3,c.elsieTrust+2);
    say(s,"'I protected the dockworkers. You don't need to suffer for helping me.' Elsie's shoulders drop.","choice");
  }else if(choice==="accuse"){
    c.elsieTrust=Math.max(-3,c.elsieTrust-2);
    say(s,"'You knew they were shipping people.' She looks away. 'And now you think I'm one of them.'","choice");
  }else if(choice==="show-proof"){
    if(!s.inventory.includes("wire-recording")){
      say(s,"You need Eleanor's actual recording to convince Elsie.","warning");
      c.elsieAsked=c.elsieAsked.filter(x=>x!==choice);
    }else{
      c.elsieTrust=Math.max(0,c.elsieTrust);
      award(s,"clues","elsie-hears-eleanor","NOTEBOOK: Elsie recognized Eleanor's voice on the dockside wire recording.");
      say(s,"You play the recording. Elsie's face changes. 'That's her. I heard her that night. You really are trying to help.'","choice");
    }
  }else if(choice==="ask"){
    if(!s.inventory.includes("black-k-chip")){
      say(s,"'Find the black K passmark. Then maybe we'll talk.'","warning");
      c.elsieAsked=c.elsieAsked.filter(x=>x!==choice);
    }else if(c.elsieTrust<0){
      say(s,"'Not with you treating people like suspects. Show me I can trust you first.'","warning");
      c.elsieAsked=c.elsieAsked.filter(x=>x!==choice);
    }else{
      c.keyGranted=true;
      award(s,"inventory","rail-master-key","INVENTORY: Elsie's brass master signal key.");
      award(s,"clues","elsie-testimony","NOTEBOOK: Elsie saw Eleanor walk, alive, into Car 09 under armed escort.");
      say(s,"Elsie presses a brass key into your hand. 'They took her toward the Exchange. Find the dispatch timetable. The route levers work in order.'","evidence");
    }
  }
  s.actions+=1;return s;
}
export function chooseSignal(state,choice){
  const s=clone(state),c=s.case6;
  if(s.chapter!==6||s.status!=="playing"||s.room!=="signalCabin"||
     !c?.switchPanel||c.signalsAligned||!SWITCH_OPTIONS.some(x=>x.id===choice))return s;
  if(choice==="reset"){c.switchSequence=[];say(s,"The switches return to neutral.","choice");return s;}
  const index=c.switchSequence.length;
  if(ROUTE[index]!==choice){
    c.switchSequence=[];
    say(s,"The signal lamps snap red. Wrong lever order; all three reset. The signed timetable gives the correct route.","warning");
    return s;
  }
  c.switchSequence.push(choice);
  if(c.switchSequence.length===ROUTE.length){
    c.signalsAligned=true;c.switchPanel=false;
    award(s,"clues","rail-route-open","NOTEBOOK: Switch route C–A–B restored power to Car 09's door.");
    say(s,"The signal board turns green. Across the tracks, Car 09 clicks open. Beneath the city, the forgotten railway is awake.","evidence");
  }else say(s,"One lamp turns green. Continue the dispatch sequence.","choice");
  s.actions+=1;return s;
}
export function chooseExchange(state,choice){
  const s=clone(state),c=s.case6;
  if(s.chapter!==6||s.status!=="playing"||s.room!=="ghostTrain"||
     !c?.exitPanel||!EXIT_OPTIONS.some(x=>x.id===choice))return s;
  if(choice==="back"){c.exitPanel=false;say(s,"You step away from the service lift to search the train again.","choice");return s;}
  if(!c.ticketTaken||!c.ledgerTaken){
    say(s,"You need both Eleanor's ticket and the Kingfisher ledger before choosing whom to alert.","warning");return s;
  }
  c.decision=choice;c.exitPanel=false;
  if(choice==="warn"){
    award(s,"clues","vera-alert","NOTEBOOK: Vincent sent Vera a discreet warning about the old Exchange.");
    say(s,"You leave a coded message in Vera's drop box. She may be an ally. She may also be watched.","choice");
  }else{
    award(s,"clues","solo-exchange","NOTEBOOK: Vincent kept the Exchange lead secret and chose to investigate alone.");
    say(s,"You conceal the ledger and tell no one where you are headed. The fewer people who know, the fewer who can betray you.","choice");
  }
  s.status="chapter6complete";
  say(s,"CHAPTER 6 COMPLETE: Eleanor was alive aboard Car 09. At the end of the forgotten railway waits the old Exchange, where the Kingfisher's accounts may finally point to a face.","ending");
  return s;
}
export function sanitizeRailCase(input){
  const s=freshRailCase();
  if(!input||typeof input!=="object"||Array.isArray(input))return s;
  for(const key of Object.keys(s))if(typeof s[key]==="boolean"&&typeof input[key]==="boolean")s[key]=input[key];
  s.elsieTrust=Number.isInteger(input.elsieTrust)?Math.max(-3,Math.min(3,input.elsieTrust)):0;
  if(Array.isArray(input.elsieAsked))
    s.elsieAsked=[...new Set(input.elsieAsked.filter(x=>ELSIE_OPTIONS.some(o=>o.id===x&&x!=="close")))].slice(0,3);
  if(Array.isArray(input.switchSequence)){
    const value=input.switchSequence.slice(0,3);
    if(value.every((v,i)=>v===ROUTE[i]))s.switchSequence=value;
  }
  if(s.signalsAligned){s.switchSequence=[...ROUTE];s.switchPanel=false;}
  if(input.dialogue==="elsie")s.dialogue="elsie";
  if(["warn","silent"].includes(input.decision))s.decision=input.decision;
  return s;
}
