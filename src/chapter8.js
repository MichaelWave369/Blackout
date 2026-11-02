/* BLACKOUT Chapter 8: The Blue Door.
 * Pure detective-state rules, no DOM or Canvas dependencies.
 * Narrative reveal: the Marmont was under surveillance; Kingfisher stays anonymous.
 */
export const BLUE_HOTSPOTS={
 bluePassage:[
  ["courier","The courier"],["graffiti","Painted symbols"],["blueDoor","Blue steel door"],
  ["switchroom","Switching office"],["screening","Screening room stair"],
  ["scratches","Scuffed footprints"],["brass","Brass doorplate"]
 ],
 switchOffice:[
  ["cabinet","Evidence cabinet"],["plate","Surveillance glass plate"],
  ["log","Switchboard call log"],["intercom","Intercom speaker"],
  ["relay","Old electrical relay"],["exit","Return to passage"],["window","Blackened window"]
 ],
 screeningRoom:[
  ["projector","Reel projector"],["splice","Film splicing table"],
  ["hotel","Marmont film strip"],["witness","Woman in blue strip"],
  ["funds","Kingfisher accounts strip"],["index","Projection order card"],
  ["screen","White projection screen"],["exit","Return to passage"]
 ],
 blueChamber:[
  ["negative","Original surveillance negative"],["letter","Eleanor's sealed letter"],
  ["clock","Time-stamp clock"],["cabinet","Empty evidence cabinet"],
  ["symbol","Silhouette emblem"],["telephone","Connected telephone"],
  ["door","Blue door exit"]
 ]
};
export const COURIER_OPTIONS=[
 {id:"ask",label:"ASK WHO ORDERED THE SURVEILLANCE"},
 {id:"show",label:"SHOW WEBB'S SIGNED AUTHORIZATION"},
 {id:"compassion",label:"PROMISE NOT TO EXPOSE THE COURIER"},
 {id:"close",label:"END CONVERSATION"}
];
export const SPLICE_OPTIONS=[
 {id:"hotel",label:"SPLICE HOTEL FOOTAGE"},
 {id:"witness",label:"SPLICE WOMAN-IN-BLUE FOOTAGE"},
 {id:"funds",label:"SPLICE FINANCIAL-TRANSFER FOOTAGE"},
 {id:"reset",label:"REWIND AND RESET THE REEL"}
];
export const FINALE_OPTIONS=[
 {id:"vera",label:"SEND VERA THE ORIGINAL NEGATIVE"},
 {id:"solo",label:"KEEP THE ORIGINAL AND TELL NOBODY"},
 {id:"back",label:"SEARCH THE CHAMBER AGAIN"}
];
const ORDER=["hotel","witness","funds"];
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
 s.case8.dialogue=null;s.case8.splicePanel=false;s.case8.finalePanel=false;
 say(s,message,"chapter");
}
export function freshBlueCase(priorChoice=""){
 return{
  priorChoice:priorChoice==="follow"?"follow":"secure",
  courierTrust:priorChoice==="follow"?1:0,
  courierMet:false,courierAsked:[],courierTip:false,dialogue:null,
  cabinetOpen:false,plateTaken:false,logRead:false,
  filmTaken:[],splicePanel:false,spliceOrder:[],reelSolved:false,
  negativeTaken:false,letterTaken:false,callHeard:false,
  finalePanel:false,choice:""
 };
}
export function blueTargets(s){
 const c=s.case8;if(!c)return[];
 return (BLUE_HOTSPOTS[s.room]||[]).filter(([id])=>{
  if(id==="plate")return c.cabinetOpen&&!c.plateTaken;
  if(["hotel","witness","funds"].includes(id))return !c.filmTaken.includes(id);
  if(id==="negative")return !c.negativeTaken;
  if(id==="letter")return !c.letterTaken;
  return true;
 });
}
function look(s,target){
 const c=s.case8;
 const lines={
  bluePassage:{
   courier:c.priorChoice==="follow"?
    "The courier noticed you tailing him. He waits beneath the blue door's light, no longer pretending to be anonymous.":
    "The courier sees the signed contract in your coat. He knows you have proof that could expose his employer.",
   graffiti:"Three painted arrows. HOTEL → WITNESS → MONEY. Someone wanted the images seen in sequence.",
   blueDoor:c.reelSolved?"The blue steel door has released its magnetic lock. Someone waited a long time for this reel.":"An electric deadbolt guards the blue door. Beside it, a tiny reel-shaped receiver glows amber.",
   switchroom:"A surveillance switching office. A cabinet, call log and relay panel sit under a bare lamp.",
   screening:"Stairs lead to a projection booth. Old film stock is still stored there.",
   scratches:"A smaller set of footprints crosses the courier's. Someone was led through here recently.",
   brass:"The doorplate reads OBSERVATION / ROOM B. The lettering was hidden under blue enamel."
  },
  switchOffice:{
   cabinet:c.cabinetOpen?"The cabinet is open. Dust outlines an empty glass-plate slot.":"A locked records cabinet. Its latch is already half broken.",
   plate:"A surveillance glass plate from the Marmont Hotel, marked NIGHT / 214.",
   log:"Call log: someone requested room 214 footage before the shooting. The caller is identified only as K.",
   intercom:"A faint pulse, then a whisper: 'Vincent... don't leave the record behind.'",
   relay:"An old wire relay hums. A successful film reconstruction would energize the door bolt.",
   exit:"The corridor to the blue door.",
   window:"Through the blackened pane, you can see the brass reel projector upstairs."
  },
  screeningRoom:{
   projector:c.reelSolved?"The projector runs the reconstructed reel. The magnetic bolt on the Blue Door is released.":"A hand-cranked projector waits for three strips and the matching surveillance plate.",
   splice:"A splicing table with three numbered slots. The order card explains what follows what.",
   hotel:"A scratched strip of film showing the Marmont entrance at night.",
   witness:"A damaged strip of film showing a woman wearing Eleanor's distinctive blue coat.",
   funds:"A strip showing ledgers being handed to a figure whose face is obscured.",
   index:"HANDLING ORDER: HOTEL FIRST / WITNESS SECOND / MONEY THIRD. The three can expose a falsified timeline.",
   screen:"A stark white cloth hangs from the ceiling, awaiting the reconstructed footage.",
   exit:"Stairs back to the painted passage."
  },
  blueChamber:{
   negative:"An uncut surveillance negative with the original timestamps. It shows the room-214 recording apparatus was installed before the murder.",
   letter:"Eleanor's handwriting: 'Vincent, they are using the truth against us. Don't mistake the man who signed the order for the one who gave it.'",
   clock:"The chamber clock has been tampered with. The recording's original timestamps differ from the displayed time.",
   cabinet:"A metal cabinet once held duplicate recordings. The drawers have been emptied since midnight.",
   symbol:"A silhouetted figure within a circle. An emblem, not proof of who is behind the Kingfisher operation.",
   telephone:"An old wired telephone connects to a line that wasn't on the public Exchange map.",
   door:"The heavy blue door leads back to the surveillance passage."
  }
 };
 say(s,lines[s.room]?.[target]||"The shadows give nothing away.");
 if(s.room==="bluePassage"&&target==="graffiti")
  award(s,"clues","blue-splice-order","NOTEBOOK: Blue Door footage order is HOTEL → WITNESS → MONEY.");
 if(s.room==="switchOffice"&&target==="log"&&!c.logRead){
  c.logRead=true;
  award(s,"clues","hotel-surveillance-order","NOTEBOOK: Room 214 was watched before the shooting. The request was signed K.");
 }
 if(s.room==="blueChamber"&&target==="clock")
  award(s,"clues","tampered-time","NOTEBOOK: The surveillance clock and recording timestamps do not match.");
 if(s.room==="blueChamber"&&target==="symbol")
  award(s,"clues","silhouette-emblem","NOTEBOOK: A silhouette insignia suggests another layer of organization; no identity confirmed.");
}
function open(s,target){
 const c=s.case8;
 if(s.room==="switchOffice"&&target==="cabinet"){
  if(c.cabinetOpen){say(s,"The glass-plate cabinet is already open.");return;}
  c.cabinetOpen=true;
  say(s,"The crooked latch snaps off. The oldest surveillance plate is still inside.","evidence");return;
 }
 if(s.room==="screeningRoom"&&["splice","projector"].includes(target)){
  if(!c.plateTaken||c.filmTaken.length!==3){
   say(s,"The reel requires the original glass plate and all three film strips. Recover them before splicing.","warning");return;
  }
  if(c.reelSolved){say(s,"The reel is already assembled. The blue door is open.");return;}
  c.splicePanel=true;
  say(s,"You set the glass plate into the machine. Three splice slots wait. The order card explains how the pieces fit.","choice");return;
 }
 if(s.room==="bluePassage"&&target==="blueDoor"){
  say(s,c.reelSolved?"The magnetic bolt is released. GO through the blue door.":"The bolt is still powered. Reconstruct the surveillance film to release it.");return;
 }
 say(s,"Nothing opens. There must be another way to proceed.");
}
function take(s,target){
 const c=s.case8;
 if(s.room==="switchOffice"&&target==="plate"&&c.cabinetOpen&&!c.plateTaken){
  c.plateTaken=true;award(s,"inventory","marmont-plate","INVENTORY: Original room-214 surveillance glass plate.");
  award(s,"clues","marmont-camera","NOTEBOOK: The surveillance apparatus at the Marmont was pre-positioned.");
 }else if(s.room==="screeningRoom"&&["hotel","witness","funds"].includes(target)&&!c.filmTaken.includes(target)){
  c.filmTaken.push(target);
  award(s,"inventory","film-"+target,"INVENTORY: "+{
   hotel:"Marmont entrance film strip.",witness:"Eleanor's blue-coat footage.",funds:"Obscured financial-transfer footage."
  }[target]);
 }else if(s.room==="blueChamber"&&target==="negative"&&!c.negativeTaken){
  c.negativeTaken=true;
  award(s,"inventory","original-negative","INVENTORY: Uncut surveillance negative from the Marmont.");
  award(s,"clues","marmont-timeline","NOTEBOOK: The uncut recording confirms surveillance was installed before the room-214 shooting.");
  award(s,"memories","marmont-camera-memory","MEMORY FRAGMENT 08: Eleanor presses a cold key into Vincent's palm. 'They've been watching you since before the hotel.'");
 }else if(s.room==="blueChamber"&&target==="letter"&&!c.letterTaken){
  c.letterTaken=true;
  award(s,"inventory","eleanor-blue-letter","INVENTORY: Eleanor's sealed Blue Door letter.");
  award(s,"clues","signed-versus-ordered","NOTEBOOK: Eleanor warns that Webb's signature does not establish the identity of the person directing the plot.");
 }else say(s,"That item isn't available to take.");
}
function go(s,target){
 const c=s.case8;
 if(s.room==="bluePassage"&&target==="switchroom"){
  enter(s,"switchOffice","SURVEILLANCE SWITCHING OFFICE. A humming relay and a cabinet of old recording plates sit beside a call log.");return;
 }
 if(s.room==="bluePassage"&&target==="screening"){
  enter(s,"screeningRoom","PROJECTION BOOTH. A reel machine and three damaged film strips may explain the mysterious blue-door lock.");return;
 }
 if(s.room==="bluePassage"&&target==="blueDoor"){
  if(!c.reelSolved){say(s,"The electric deadbolt holds. The projection booth controls the lock.","warning");return;}
  enter(s,"blueChamber","THE BLUE ROOM. The original surveillance negative and a sealed letter are exactly where Eleanor said they'd be.");return;
 }
 if(s.room==="switchOffice"&&target==="exit"){
  enter(s,"bluePassage","PAINTED PASSAGE. The courier is still watching the blue door.");return;
 }
 if(s.room==="screeningRoom"&&target==="exit"){
  enter(s,"bluePassage","PAINTED PASSAGE. A soft mechanical hum comes from the sealed blue door.");return;
 }
 if(s.room==="blueChamber"&&target==="door"){
  enter(s,"bluePassage","PAINTED PASSAGE. The signal lamp over the blue door is still green.");return;
 }
 say(s,"That passage leads nowhere useful.");
}
function talk(s,target){
 const c=s.case8;
 if(s.room==="bluePassage"&&target==="courier"){
  c.courierMet=true;c.dialogue="courier";
  say(s,c.priorChoice==="follow"?
   "The courier turns. 'You followed me. I figured you would. What matters is who planted the camera, not who carried the reel.'":
   "'You secured the contract. Smart. Paper lasts longer than promises.' The courier studies Vincent's face.","choice");
  return;
 }
 if(s.room==="blueChamber"&&target==="telephone"){
  if(!c.negativeTaken||!c.letterTaken){
   say(s,"The line rings into silence. You should recover Eleanor's originals before calling anyone.","warning");return;
  }
  c.callHeard=true;c.finalePanel=true;
  say(s,"An anonymous voice whispers: 'You have the uncut film. Are you bringing Vera into this, or protecting the secret yourself?'","choice");
  return;
 }
 say(s,"Only the hum of the projector answers.");
}
function use(s,target,item){
 if(s.room==="bluePassage"&&target==="blueDoor"&&item==="webb-contract"&&s.inventory.includes(item)){
  say(s,"The transfer contract proves Webb signed, but the electric lock requires the reconstructed recording.");return;
 }
 if(s.room==="screeningRoom"&&target==="projector"&&item==="marmont-plate"){
  open(s,"projector");return;
 }
 if(s.room==="blueChamber"&&target==="telephone"){
  talk(s,target);return;
 }
 say(s,"That combination offers no new evidence.");
}
export function blueAction(s,verb,target,item=""){
 if(s.chapter!==8||s.status!=="playing"||!s.case8||!BLUE_HOTSPOTS[s.room])return s;
 if(verb==="LOOK"){
  if(!target)say(s,{
   bluePassage:"A blue-painted passage leads to a surveillance office, projector booth and sealed steel door.",
   switchOffice:"An old switching office contains a surveillance-plate cabinet, a call log and relay circuit.",
   screeningRoom:"A reel projector, three damaged strips and an index card stand before a white screen.",
   blueChamber:"Behind the Blue Door, the evidence Vincent forgot is waiting for him."
  }[s.room]);else look(s,target);
 }else if(verb==="OPEN")open(s,target);
 else if(verb==="TAKE")take(s,target);
 else if(verb==="GO")go(s,target);
 else if(verb==="TALK")talk(s,target);
 else if(verb==="USE")use(s,target,item);
 s.actions+=1;return s;
}
export function chooseBlueCourier(state,choice){
 const s=copy(state),c=s.case8;
 if(s.chapter!==8||s.status!=="playing"||s.room!=="bluePassage"||c?.dialogue!=="courier"||
   !COURIER_OPTIONS.some(o=>o.id===choice))return s;
 if(choice==="close"){c.dialogue=null;say(s,"The courier steps back into the shadows. He is not leaving yet.","choice");return s;}
 if(c.courierAsked.includes(choice)){
  say(s,"'We already discussed that, detective.'","choice");return s;
 }
 c.courierAsked.push(choice);
 if(choice==="ask"){
  if(c.courierTrust<0){
   c.courierAsked=c.courierAsked.filter(x=>x!==choice);
   say(s,"'You want answers? Give me a reason to trust you.'","warning");return s;
  }
  c.courierTip=true;
  award(s,"clues","courier-cameras","NOTEBOOK: The courier confirms the Marmont camera reels were moved before the murder.");
  say(s,"'The watchers arrived before the murder. That's the thing you need to understand. The film wasn't a response. It was a plan.'","evidence");
 }else if(choice==="show"){
  if(!s.inventory.includes("webb-contract")){
   c.courierAsked=c.courierAsked.filter(x=>x!==choice);
   say(s,"You need Webb's signed original before confronting the courier with it.","warning");return s;
  }
  c.courierTrust=Math.max(0,c.courierTrust);
  award(s,"clues","courier-webb","NOTEBOOK: The courier recognized Webb's authorization but would not name its true sponsor.");
  say(s,"The courier flinches at Webb's signature. 'He signed what they put in front of him. That isn't the same as being in charge.'","evidence");
 }else{
  c.courierTrust=Math.min(3,c.courierTrust+1);
  say(s,"'I'm not here to put your name in a police report.' The courier gives a small, reluctant nod.","choice");
 }
 s.actions+=1;return s;
}
export function chooseSplice(state,choice){
 const s=copy(state),c=s.case8;
 if(s.chapter!==8||s.status!=="playing"||s.room!=="screeningRoom"||!c?.splicePanel||
  c.reelSolved||!SPLICE_OPTIONS.some(o=>o.id===choice))return s;
 if(choice==="reset"){c.spliceOrder=[];say(s,"The reel winds back to its beginning.","choice");return s;}
 if(ORDER[c.spliceOrder.length]!==choice){
  c.spliceOrder=[];
  say(s,"The splice tears. The projector rewinds automatically. Recheck the handling order.","warning");return s;
 }
 c.spliceOrder.push(choice);
 if(c.spliceOrder.length===ORDER.length){
  c.reelSolved=true;c.splicePanel=false;
  award(s,"clues","marmont-reconstruction","NOTEBOOK: Hotel, witness and financial footage together expose a pre-arranged surveillance operation.");
  say(s,"The reconstructed film flickers to life. Someone planted a camera before the murder. Beyond the booth, the BLUE DOOR's magnetic bolt clicks open.","evidence");
 }else say(s,"A strip locks into position. Continue the film's documented sequence.","choice");
 s.actions+=1;return s;
}
export function chooseBlueFinale(state,choice){
 const s=copy(state),c=s.case8;
 if(s.chapter!==8||s.status!=="playing"||s.room!=="blueChamber"||!c?.finalePanel||
  !FINALE_OPTIONS.some(o=>o.id===choice))return s;
 if(choice==="back"){c.finalePanel=false;say(s,"You hang up and reconsider Eleanor's warning.","choice");return s;}
 if(!c.negativeTaken||!c.letterTaken)return s;
 c.choice=choice;c.finalePanel=false;
 if(choice==="vera"){
  award(s,"clues","vera-original-film","NOTEBOOK: Vincent arranged to deliver the uncut Marmont negative to Vera for safekeeping.");
  say(s,"'Vera,' Vincent whispers into the receiver. 'I have the original film. The timeline was planted. Take it somewhere nobody can edit it.'","choice");
 }else{
  award(s,"clues","solo-original-film","NOTEBOOK: Vincent retained the original negative and chose not to reveal his discovery.");
  say(s,"You wind the original negative into its case and tell the caller nothing. The truth stays with you for now.","choice");
 }
 s.status="chapter8complete";
 say(s,"CHAPTER 8 COMPLETE: The Blue Door reveals a planned surveillance operation tied to room 214. Eleanor is still missing. Kingfisher remains a shadow. The next clue leads toward the Silhouette network.","ending");
 return s;
}
export function sanitizeBlueCase(input){
 const s=freshBlueCase();
 if(!input||typeof input!=="object"||Array.isArray(input))return s;
 for(const key of Object.keys(s))if(typeof s[key]==="boolean"&&typeof input[key]==="boolean")s[key]=input[key];
 s.priorChoice=input.priorChoice==="follow"?"follow":"secure";
 s.courierTrust=Number.isInteger(input.courierTrust)?Math.max(-3,Math.min(3,input.courierTrust)):0;
 if(Array.isArray(input.courierAsked))
  s.courierAsked=[...new Set(input.courierAsked.filter(x=>COURIER_OPTIONS.some(o=>o.id===x&&x!=="close")))].slice(0,3);
 if(Array.isArray(input.filmTaken))s.filmTaken=[...new Set(input.filmTaken.filter(x=>ORDER.includes(x)))];
 if(Array.isArray(input.spliceOrder)){
  const seq=input.spliceOrder.slice(0,3);
  if(seq.every((x,i)=>x===ORDER[i]))s.spliceOrder=seq;
 }
 if(s.reelSolved){s.spliceOrder=[...ORDER];s.splicePanel=false;}
 if(input.dialogue==="courier")s.dialogue="courier";
 if(["vera","solo"].includes(input.choice))s.choice=input.choice;
 if(s.choice)s.finalePanel=false;
 return s;
}
