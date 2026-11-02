/* BLACKOUT Chapter 5: Warehouse Shadows.
 * Original noir story; pure investigation rules shared across retro/XR renderers.
 */
export const DOCK_HOTSPOTS={
  dockGate:[
    ["watchman","Night watchman"],["sign","Dockside sign"],["gate","Iron warehouse gate"],
    ["poster","Shipping notice"],["water","Harbor water"],["truck","Idling truck"]
  ],
  loadingBay:[
    ["office","Freight office"],["container","Sealed freight container"],
    ["crane","Idle cargo crane"],["stencil","Container stencil"],["door","Dock exit"],
    ["rail","Freight rail"],["lamp","Flickering sodium lamp"]
  ],
  freightOffice:[
    ["cabinet","Filing cabinet"],["manifest","Freight manifest"],
    ["radio","Harbor radio"],["desk","Dispatcher's desk"],["photo","Crew photograph"],
    ["window","Office window"],["door","Loading bay doorway"]
  ],
  containerHold:[
    ["recorder","Wire recorder"],["roster","Passenger roster"],["crate","False-bottom crate"],
    ["photo","Burned photograph"],["vent","Ventilation shaft"],["tunnel","Service tunnel"],
    ["door","Container exit"]
  ]
};
export const WATCHMAN_OPTIONS=[
  {id:"kingfisher",label:"ASK ABOUT THE BLACK K"},
  {id:"promise",label:"PROMISE TO PROTECT THE WORKERS"},
  {id:"threaten",label:"THREATEN TO REPORT HIS ROLE"},
  {id:"close",label:"END CONVERSATION"}
];
export const TUNNEL_OPTIONS=[
  {id:"protect",label:"PROTECT THE WITNESS AND KEEP THE ORIGINALS"},
  {id:"expose",label:"LEAVE COPIES FOR THE AUTHORITIES"},
  {id:"back",label:"SEARCH FOR MORE EVIDENCE"}
];
const CODE=[4,1,7];const clone=x=>JSON.parse(JSON.stringify(x));
const say=(s,message,kind="narration")=>{
  s.transcript.push({id:(s.transcript.at(-1)?.id||0)+1,text:message,kind});
  s.transcript=s.transcript.slice(-35);
};
function award(s,key,value,message){
  if(!s[key].includes(value)){s[key].push(value);if(message)say(s,message,"evidence");}
}
function move(s,room,message){
  s.room=room;s.case5.dialogue=null;s.case5.sealPanel=false;s.case5.tunnelPanel=false;
  if(!s.discovered.includes(room))s.discovered.push(room);
  say(s,message,"chapter");
}
export function freshWarehouseCase(decision=""){
  return {
    access:false,watchmanMet:false,watchmanAsked:[],watchmanTrust:decision==="private"?1:decision==="confront"?-1:0,
    contactTip:false,cabinetOpen:false,manifestTaken:false,sealPanel:false,
    sealDigits:[0,0,0],sealOpen:false,recorderTaken:false,rosterTaken:false,
    crateOpen:false,photoTaken:false,tunnelPanel:false,dialogue:null,decision:""
  };
}
export function dockTargets(state){
  const c=state.case5;
  if(!c)return[];
  return (DOCK_HOTSPOTS[state.room]||[]).filter(([id])=>{
    if(id==="manifest")return c.cabinetOpen&&!c.manifestTaken;
    if(id==="roster")return !c.rosterTaken;
    if(id==="recorder")return !c.recorderTaken;
    if(id==="photo"&&state.room==="containerHold")return c.crateOpen&&!c.photoTaken;
    return true;
  });
}
function examine(s,target){
  const c=s.case5;
  const descriptions={
    dockGate:{
      watchman:"A night watchman with a cigarette and a battered notebook. He keeps glancing toward the warehouse.",
      sign:"SOUTH BRANCH / PRIVATE FREIGHT. The K insignia has been scraped off the metal.",
      gate:c.access?"The iron gate stands open. The loading bay waits beyond.":"A chain blocks the loading bay. The night watchman controls the lock.",
      poster:"Cargo notice: Quay FOUR, first tide shift. A painted K hides under the notice.",
      water:"Lake water runs black in the rain. A departing barge moves without lights.",
      truck:"A freight truck idles. No plates. Someone inside watches you."
    },
    loadingBay:{
      office:"Dispatcher's office with one light on. Someone left the window cracked.",
      container:c.sealOpen?"The cargo seal has been broken. The steel doors lead into darkness.":"Three numbered wheels hold the heavy freight-container doors shut.",
      crane:"The number ONE is painted beneath the crane's control lever. The bell beside it rings once every shift.",
      stencil:"BAY SEVEN is painted on the container in white letters. The stencil beneath it reads K-417.",
      door:"A walk back to the iron gates and harbor road.",
      rail:"Two rails disappear under the heavy freight doors. Fresh cart tracks head inside.",
      lamp:"An old sodium light sputters, giving the wet floor a bruise-yellow glow."
    },
    freightOffice:{
      cabinet:c.cabinetOpen?"The cabinet drawer stands open. The remaining papers are out of date.":"A padlocked filing drawer. A rusted latch should yield to pressure.",
      manifest:"The freight manifest names Quay 4, first tide shift, Bay 7. An unregistered passenger transport was attached.",
      radio:"Harbor traffic reports a barge without a registered cargo number.",
      desk:"A dispatcher left coffee cold and an unsigned dispatch beside an ashtray.",
      photo:"A crew photograph. Someone scratched away a man's face, leaving only a black K.",
      window:"Through the rain, the loading bay's container doors loom like the mouth of a vault.",
      door:"A narrow door leads back onto the loading platform."
    },
    containerHold:{
      recorder:"A wire recorder with a metal spool labeled E.A. The recording begins with a woman's frightened voice.",
      roster:"Passenger roster marked TRANSFERRED. The initials E.A. appear beside a midnight departure.",
      crate:c.crateOpen?"The false bottom is lifted. A burned photograph rests inside.":"A heavy crate with a loose board hiding beneath the packing straw.",
      photo:"A scorched photo of Eleanor stepping aboard a barge, flanked by two men in dark coats.",
      vent:"A grate lets in cold air and the sound of moving water. The tunnel may lead beyond this warehouse.",
      tunnel:"A narrow service tunnel descends below the freight platform. Leave only after choosing what to do with the evidence.",
      door:"Back into the loading bay."
    }
  };
  say(s,descriptions[s.room]?.[target]||"You see nothing useful.");
  if(s.room==="loadingBay"&&target==="stencil")
    award(s,"clues","warehouse-seal-bay","NOTEBOOK: The cargo container is marked BAY SEVEN, and its stencil carries K-417.");
  if(s.room==="loadingBay"&&target==="crane")
    award(s,"clues","warehouse-shift","NOTEBOOK: The crane and the single shift bell both bear the number ONE.");
  if(s.room==="dockGate"&&target==="poster")
    award(s,"clues","warehouse-quay","NOTEBOOK: The dock notice identifies QUAY FOUR.");
}
function take(s,target){
  const c=s.case5;
  if(s.room==="freightOffice"&&target==="manifest"&&c.cabinetOpen&&!c.manifestTaken){
    c.manifestTaken=true;
    award(s,"inventory","freight-manifest","INVENTORY: Confidential dockside freight manifest.");
    award(s,"clues","warehouse-shipment","NOTEBOOK: Freight manifest lists Quay 4, Shift 1, Bay 7 and an unregistered passenger transfer.");
    say(s,"The ink is barely dry. Eleanor's initials were crossed out, not removed.","memory");
  }else if(s.room==="containerHold"&&target==="recorder"&&!c.recorderTaken){
    c.recorderTaken=true;
    award(s,"inventory","wire-recording","INVENTORY: Wire recorder spool marked E.A.");
    award(s,"clues","eleanor-voice","NOTEBOOK: A woman with Eleanor's voice describes being moved by Kingfisher associates.");
    award(s,"memories","warehouse-voice","MEMORY FRAGMENT 05: A woman's voice through static: 'Vincent, I knew you'd find me.'");
  }else if(s.room==="containerHold"&&target==="roster"&&!c.rosterTaken){
    c.rosterTaken=true;
    award(s,"inventory","transfer-roster","INVENTORY: Unregistered passenger transfer roster.");
    award(s,"clues","eleanor-transfer","NOTEBOOK: E.A. was transferred alive from the warehouse after midnight.");
  }else if(s.room==="containerHold"&&target==="photo"&&c.crateOpen&&!c.photoTaken){
    c.photoTaken=true;
    award(s,"inventory","burned-photo","INVENTORY: Partially burned barge photograph.");
    award(s,"clues","barge-photo","NOTEBOOK: A photograph shows Eleanor and two men boarding an unregistered barge.");
  }else say(s,"You cannot take that, or it is already in your inventory.");
}
function open(s,target){
  const c=s.case5;
  if(s.room==="freightOffice"&&target==="cabinet"){
    if(c.cabinetOpen){say(s,"The drawer is already open. Its remaining documents are useless.");return;}
    c.cabinetOpen=true;say(s,"The rusted latch snaps free. Inside lies the freight manifest for Quay 4, Shift 1, Bay 7.","evidence");return;
  }
  if(s.room==="loadingBay"&&target==="container"){
    c.sealPanel=!c.sealOpen;
    say(s,c.sealOpen?"The container stands open. The passage inside is clear.":"Three combination wheels. The shipping manifest should identify their order.","choice");return;
  }
  if(s.room==="containerHold"&&target==="crate"){
    if(c.crateOpen){say(s,"The false bottom is already exposed.");return;}
    c.crateOpen=true;say(s,"You lift a loose plank. A scorched photograph was hidden beneath the cargo straw.","evidence");return;
  }
  say(s,"Nothing opens. Maybe a different approach is needed.");
}
function go(s,target){
  const c=s.case5;
  if(s.room==="dockGate"&&target==="gate"){
    if(!c.access){say(s,"The gate is chained. The watchman might understand the black K chip.");return;}
    move(s,"loadingBay","THE LOADING BAY. Freight cranes sleep beneath the rain. A numbered steel container is sealed to the rails.");return;
  }
  if(s.room==="loadingBay"&&target==="office"){
    move(s,"freightOffice","FREIGHT OFFICE. A paper-strewn desk and a battered filing cabinet sit beneath an amber lamp.");return;
  }
  if(s.room==="freightOffice"&&target==="door"){
    move(s,"loadingBay","LOADING BAY. A three-wheel seal guards the heavy cargo container.");return;
  }
  if(s.room==="loadingBay"&&target==="door"){
    move(s,"dockGate","DOCK GATES. The watchman checks the street for anyone following you.");return;
  }
  if(s.room==="loadingBay"&&target==="container"){
    if(!c.sealOpen){c.sealPanel=true;say(s,"The container is locked. Set the three wheels using the shipping records.","choice");return;}
    move(s,"containerHold","THE FREIGHT CONTAINER. The steel door scrapes open. A wire recorder and passenger roster wait among abandoned crates.");return;
  }
  if(s.room==="containerHold"&&target==="door"){
    move(s,"loadingBay","The bay is empty. The night watchman has stayed outside.");return;
  }
  if(s.room==="containerHold"&&target==="tunnel"){
    c.tunnelPanel=true;
    say(s,"The service tunnel leads toward the river. Take the records, then decide how to protect the witness.","choice");return;
  }
  say(s,"You cannot get through that way.");
}
function talk(s,target){
  const c=s.case5;
  if(s.room==="dockGate"&&target==="watchman"){
    c.watchmanMet=true;c.dialogue="watchman";
    if(!c.access){
      if(s.inventory.includes("black-k-chip")){
        c.access=true;
        say(s,"You show the watchman the black K chip. He swallows. 'That's a passmark I hoped never to see again.' He unchains the gate.","choice");
        award(s,"clues","kingfisher-docks","NOTEBOOK: The black K chip grants access to Kingfisher's dockside operation.");
      }else say(s,"'Private freight, pal. You need a passmark.' He refuses to open the gate.","warning");
    }else say(s,"The watchman lowers his voice. 'I won't be here when morning comes.'","choice");
    return;
  }
  if(s.room==="freightOffice"&&target==="radio"){
    say(s,"A dispatcher on the radio says: 'Unregistered vessel headed upriver. No cargo search.' Someone in authority is shielding the shipment.","warning");
    award(s,"clues","protected-barge","NOTEBOOK: Harbor dispatch concealed an unregistered passenger barge.");return;
  }
  say(s,"The warehouse answers with silence.");
}
function use(s,target,item){
  if(s.room==="dockGate"&&target==="watchman"&&item==="black-k-chip"&&s.inventory.includes(item)){
    talk(s,"watchman");return;
  }
  if(s.room==="loadingBay"&&target==="container"&&item==="freight-manifest"&&s.inventory.includes(item)){
    open(s,"container");say(s,"The manifest gives the order: QUAY / SHIFT / BAY. No guesswork required.","evidence");return;
  }
  if(s.room==="containerHold"&&target==="recorder"&&!item){
    say(s,"The recorder clicks. Through static you hear: 'They're taking me to the river.'","memory");return;
  }
  say(s,"That combination doesn't reveal anything.");
}
export function warehouseAction(s,verb,target,item=""){
  if(s.chapter!==5||s.status!=="playing"||!s.case5||!DOCK_HOTSPOTS[s.room])return s;
  if(verb==="LOOK"){
    if(!target)say(s,{
      dockGate:"A watchman stands beneath the warehouse lamps. The yard is chained shut.",
      loadingBay:"Freight rails, a sealed container and a dispatcher office occupy the wet loading bay.",
      freightOffice:"A cramped office. The filing cabinet, radio and desk still smell of cigarettes.",
      containerHold:"A wire recorder, a transfer roster, abandoned crates and a service tunnel lie beyond the freight seal."
    }[s.room]);
    else examine(s,target);
  }else if(verb==="TAKE")take(s,target);
  else if(verb==="OPEN")open(s,target);
  else if(verb==="GO")go(s,target);
  else if(verb==="TALK")talk(s,target);
  else if(verb==="USE")use(s,target,item);
  s.actions+=1;return s;
}
export function chooseWatchman(state,choice){
  const s=clone(state),c=s.case5;
  if(s.chapter!==5||s.status!=="playing"||s.room!=="dockGate"||
    c?.dialogue!=="watchman"||!WATCHMAN_OPTIONS.some(o=>o.id===choice))return s;
  if(choice==="close"){c.dialogue=null;say(s,"The watchman steps back into the shadows.","choice");return s;}
  if(c.watchmanAsked.includes(choice)){say(s,"'I already told you what I know.'","choice");return s;}
  c.watchmanAsked.push(choice);
  if(choice==="kingfisher"){
    c.contactTip=true;say(s,"'The boats aren't listed honestly. Look for the unregistered passenger transfer in the office.'","choice");
    award(s,"clues","watchman-tip","NOTEBOOK: The watchman says a passenger transfer is hidden in the office manifest.");
  }else if(choice==="promise"){
    c.watchmanTrust=Math.min(3,c.watchmanTrust+1);
    say(s,"'I don't want dockworkers caught in this. I only need to find the missing woman.' The watchman nods.","choice");
  }else if(choice==="threaten"){
    c.watchmanTrust=Math.max(-3,c.watchmanTrust-2);
    say(s,"'I could turn you in.' The watchman stiffens. 'Then you'd better keep moving, detective.'","choice");
  }
  s.actions+=1;return s;
}
export function adjustFreightSeal(state,i,delta){
  const s=clone(state),c=s.case5;
  if(s.chapter!==5||s.status!=="playing"||s.room!=="loadingBay"||
    !c?.sealPanel||c.sealOpen||!Number.isInteger(i)||i<0||i>2||![-1,1].includes(delta))return s;
  c.sealDigits[i]=(c.sealDigits[i]+delta+10)%10;
  s.actions+=1;return s;
}
export function submitFreightSeal(state){
  const s=clone(state),c=s.case5;
  if(s.chapter!==5||s.status!=="playing"||s.room!=="loadingBay"||!c?.sealPanel||c.sealOpen)return s;
  if(!s.inventory.includes("freight-manifest")){
    say(s,"The lock has no labels. Find a manifest before guessing at cargo seals.","warning");return s;
  }
  if(c.sealDigits.every((value,i)=>value===CODE[i])){
    c.sealOpen=true;c.sealPanel=false;
    award(s,"clues","warehouse-opened","NOTEBOOK: The freight seal used Quay 4 / Shift 1 / Bay 7.");
    say(s,"A final metal tooth slips free. The heavy container door opens onto a secret passenger compartment.","evidence");
  }else say(s,"Wrong seal. The manifest identifies QUAY, SHIFT, and BAY in that order.","warning");
  s.actions+=1;return s;
}
export function chooseTunnel(state,choice){
  const s=clone(state),c=s.case5;
  if(s.chapter!==5||s.status!=="playing"||s.room!=="containerHold"||
    !c?.tunnelPanel||!TUNNEL_OPTIONS.some(o=>o.id===choice))return s;
  if(choice==="back"){c.tunnelPanel=false;say(s,"You step away from the tunnel and check your evidence again.","choice");return s;}
  if(!c.recorderTaken||!c.rosterTaken){
    say(s,"The testimony and passenger roster are both important. Find them before deciding what to do.","warning");return s;
  }
  c.decision=choice;c.tunnelPanel=false;
  if(choice==="protect"){
    award(s,"clues","protected-witness","NOTEBOOK: Vincent protected the dockworkers and kept original evidence for the search.");
    say(s,"You seal the originals inside your coat. The workers' names remain out of the public report. You will bear the risk yourself.","choice");
  }else{
    award(s,"clues","public-record","NOTEBOOK: Vincent left documentary copies for authorities, exposing the operation to immediate scrutiny.");
    say(s,"You leave documentary copies in a sealed envelope for investigators. If the police are compromised, you have just given them a warning.","choice");
  }
  s.status="chapter5complete";
  say(s,"CHAPTER 5 COMPLETE: The K network moves people and money by river. The trail leads through a forgotten service tunnel toward the old city rail yards.","ending");
  return s;
}
export function sanitizeWarehouseCase(input){
  const s=freshWarehouseCase();
  if(!input||typeof input!=="object"||Array.isArray(input))return s;
  for(const key of Object.keys(s))if(typeof s[key]==="boolean"&&typeof input[key]==="boolean")s[key]=input[key];
  s.watchmanTrust=Number.isInteger(input.watchmanTrust)?Math.max(-3,Math.min(3,input.watchmanTrust)):0;
  if(Array.isArray(input.watchmanAsked))s.watchmanAsked=[...new Set(input.watchmanAsked.filter(x=>WATCHMAN_OPTIONS.some(o=>o.id===x&&x!=="close")))].slice(0,3);
  if(Array.isArray(input.sealDigits)&&input.sealDigits.length===3)
    s.sealDigits=input.sealDigits.map(n=>Number.isInteger(n)&&n>=0&&n<=9?n:0);
  if(input.dialogue==="watchman")s.dialogue="watchman";
  if(["protect","expose"].includes(input.decision))s.decision=input.decision;
  if(s.sealOpen)s.sealPanel=false;
  return s;
}
