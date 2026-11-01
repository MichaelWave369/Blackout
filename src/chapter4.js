/* BLACKOUT Ch. 4: Ashworth Manor. Original noir narrative.
 * Deterministic state transitions, independent of Canvas/DOM.
 */
export const MANOR_HOTSPOTS = {
  manorGate: [
    ["guard", "Estate gatekeeper"], ["intercom", "Gate intercom"],
    ["plaque", "Ashworth crest"], ["frontdoor", "Manor entrance"],
    ["driveway", "Rain-slicked driveway"], ["lantern", "Gate lantern"]
  ],
  manorFoyer: [
    ["harold", "Harold Ashworth"], ["chandelier", "Crystal chandelier"],
    ["guestbook", "Visitors' ledger"], ["painting", "Family portrait"],
    ["studydoor", "Study door"], ["bedroomdoor", "Eleanor's room"],
    ["frontdoor", "Front entrance"], ["stairs", "Dark staircase"]
  ],
  manorStudy: [
    ["portrait", "Family portrait mechanism"], ["ledger", "Business ledger"],
    ["chip", "Black K poker chip"], ["vera", "Woman in the shadows"],
    ["desk", "Harold's desk"], ["shelves", "Account books"],
    ["window", "Rain-dark window"], ["foyerdoor", "Return to foyer"]
  ],
  eleanorRoom: [
    ["vanity", "Vanity dresser"], ["diary", "Torn diary page"],
    ["jewelry", "Jewelry box"], ["letters", "Hidden love letters"],
    ["photo", "Framed childhood photo"], ["window", "Bedroom window"],
    ["bed", "Unmade bed"], ["foyerdoor", "Return to foyer"]
  ]
};
export const HAROLD_OPTIONS = [
  {id:"eleanor",label:"ASK ABOUT ELEANOR"},
  {id:"webb",label:"ASK ABOUT MARCUS WEBB"},
  {id:"payments",label:"CONFRONT HIM WITH THE PAYMENTS"},
  {id:"reassure",label:"PROMISE TO FIND ELEANOR"},
  {id:"accuse",label:"ACCUSE HAROLD OF HIDING THE TRUTH"},
  {id:"close",label:"END INTERVIEW"}
];
export const VERA_OPTIONS = [
  {id:"confront",label:"CONFRONT HAROLD WITH VERA PRESENT"},
  {id:"private",label:"LET VERA LEAVE; SPEAK TO HAROLD PRIVATELY"},
  {id:"close",label:"SEARCH MORE BEFORE DECIDING"}
];
export const PORTRAIT_OPTIONS = [
  {id:"harold",label:"HAROLD / THE FATHER"},
  {id:"webb",label:"WEBB / THE SUITOR"},
  {id:"eleanor",label:"ELEANOR / THE DAUGHTER"},
  {id:"reset",label:"RESET NAMEPLATES"}
];
const PORTRAIT_SOLUTION=["harold","webb","eleanor"];
const clone = value => JSON.parse(JSON.stringify(value));
const say = (s,text,kind="narration") => {
  s.transcript.push({id:(s.transcript.at(-1)?.id||0)+1,text,kind});
  s.transcript=s.transcript.slice(-35);
};
function award(s,which,id,message) {
  if(!s[which].includes(id)){s[which].push(id);if(message)say(s,message,"evidence");}
}
function enter(s,room,message) {
  s.room=room;
  if(!s.discovered.includes(room))s.discovered.push(room);
  s.case4.dialogue=null;
  s.case4.portraitPanel=false;
  say(s,message,"chapter");
}
export function freshManorCase() {
  return {
    guardAdmitted:false,haroldMet:false,haroldAsked:[],
    haroldTrust:0,veraTrust:0,
    vanityOpen:false,jewelryOpen:false,diaryTaken:false,lettersTaken:false,
    ledgerTaken:false,portraitPanel:false,portraitSequence:[],
    portraitUnlocked:false,chipTaken:false,
    paymentLinked:false,veraAppeared:false,dialogue:null,
    decision:""
  };
}
export function manorTargets(s) {
  if(!s.case4)return [];
  const c=s.case4;
  return (MANOR_HOTSPOTS[s.room]||[]).filter(([id])=>{
    if(id==="diary")return c.vanityOpen&&!c.diaryTaken;
    if(id==="letters")return c.jewelryOpen&&!c.lettersTaken;
    if(id==="chip")return c.portraitUnlocked&&!c.chipTaken;
    if(id==="vera")return c.veraAppeared;
    if(id==="ledger")return !c.ledgerTaken;
    return true;
  });
}
function revealVera(s){
  const c=s.case4;
  if(c.chipTaken&&c.ledgerTaken&&c.lettersTaken&&c.haroldMet&&!c.veraAppeared){
    c.veraAppeared=true;
    say(s,"A woman's silhouette moves beside the curtain. Vera. She looks at the black K chip, then the door. 'Harold is listening. Choose your next words carefully.'","warning");
  }
}
function look(s,target){
  const c=s.case4;
  const room=s.room;
  if(room==="manorGate"){
    const lines={
      guard:"An older gatekeeper in a rain-dark coat, checking names under a weak light.",
      intercom:"A brass intercom with a cracked ceramic button. No one answers until the guard approves you.",
      plaque:"ASHWORTH MANOR. Industrial wealth etched into polished stone.",
      frontdoor:c.guardAdmitted?"Beyond the open iron gate, the mansion glows like a ship in a storm.":"The heavy iron gates are locked. Speak to the guard first.",
      driveway:"The gravel drive curves through old elms toward windows glowing amber.",
      lantern:"A brass lantern flickers in a draft. Someone has been waiting for you."
    };say(s,lines[target]||"Nothing unusual.");return;
  }
  if(room==="manorFoyer"){
    const lines={
      harold:"Harold Ashworth looks sleepless. A man accustomed to controlling every room, except this one.",
      chandelier:"Crystal throws fractured reflections over the marble floor. Beautiful, expensive, cold.",
      guestbook:"Visitors signed in with neat handwriting. The newest entry is merely an initial: V.",
      painting:"A formal family portrait. Harold, his daughter Eleanor, and a vacant place where somebody painted over a face.",
      studydoor:"A dark oak door marked PRIVATE. Harold keeps watching it.",
      bedroomdoor:"Eleanor's bedroom. The handle shines where someone recently turned it.",
      frontdoor:"Beyond the front door, rain washes the driveway clean of footprints.",
      stairs:"A staircase climbing into darkness. The entire house seems to be listening."
    };say(s,lines[target]||"Nothing unusual.");return;
  }
  if(room==="eleanorRoom"){
    const lines={
      vanity:"A mirrored dresser with one drawer wedged shut by a torn journal.",
      diary:"Eleanor's handwriting is hurried: 'Father gave me a name. Webb gave me a cage. Only the daughter can break the chain.'",
      jewelry:"A carved walnut box on the dressing table. Its catch is stiff.",
      letters:"Letters tied with a pale ribbon. She was planning to run, not disappear by accident.",
      photo:"A young Eleanor smiles beside her mother. Harold stands apart, holding a briefcase.",
      window:"Rain slides across the panes. There are faint fingerprints on the latch.",
      bed:"The pillow is disturbed. Whoever searched this room wanted something small.",
      foyerdoor:"The way back to the high-ceilinged foyer."
    };say(s,lines[target]||"Nothing unusual.");return;
  }
  if(room==="manorStudy"){
    const lines={
      portrait:"A formal portrait conceals three rotating brass nameplates. A tiny inscription reads: THE FATHER, THE SUITOR, THE DAUGHTER.",
      ledger:"A business ledger with Webb's initials alongside transfers from Ashworth Industries.",
      chip:"An obsidian-black gaming chip engraved with a gold K. It was deliberately hidden.",
      vera:"Vera watches the study door. She appears to know how much danger you're in.",
      desk:"The ink on Harold's desk blotter is still wet. Someone left in a hurry.",
      shelves:"Leather-bound account books, many with entire pages cut away.",
      window:"In the glass, the city seems a thousand miles away. Someone moves past the garden hedge.",
      foyerdoor:"The study door opens to the foyer. Harold is waiting out there."
    };
    if(target==="portrait"&&!c.portraitUnlocked) {
      c.portraitPanel=true;
      say(s,"A hidden catch clicks under the portrait. Three nameplates: HAROLD / WEBB / ELEANOR. The diary may tell you their order.","choice");
    }else say(s,lines[target]||"Nothing unusual.");
    return;
  }
}
function open(s,target){
  const c=s.case4;
  if(s.room==="manorGate"&&target==="frontdoor"){
    if(!c.guardAdmitted){say(s,"The iron gate doesn't budge. Ask the gatekeeper about your invitation.");return;}
    enter(s,"manorFoyer","ASHWORTH MANOR — THE FOYER. Harold Ashworth waits beneath a chandelier. 'Morrow. I wondered whether you would come.'");return;
  }
  if(s.room==="eleanorRoom"&&target==="vanity"){
    if(c.vanityOpen){say(s,"The dresser drawer is already open.");return;}
    c.vanityOpen=true;
    say(s,"The drawer gives way. A torn diary page is folded behind the mirror.","evidence");return;
  }
  if(s.room==="eleanorRoom"&&target==="jewelry"){
    if(c.jewelryOpen){say(s,"The jewelry box is already open.");return;}
    c.jewelryOpen=true;
    say(s,"The walnut lid creaks open. Beneath an empty velvet ring slot are love letters bundled with a ribbon.","evidence");return;
  }
  if(s.room==="manorStudy"&&target==="portrait"){look(s,target);return;}
  say(s,"It won't open. That may not be what the lock is for.");
}
function take(s,target){
  const c=s.case4;
  if(s.room==="eleanorRoom"&&target==="diary"&&c.vanityOpen&&!c.diaryTaken){
    c.diaryTaken=true;
    award(s,"inventory","manor-diary","INVENTORY: Eleanor's diary fragment.");
    award(s,"clues","manor-portrait-order","NOTEBOOK: Eleanor wrote: Father gave me a name, Webb gave me a cage, only the daughter can break the chain.");
    award(s,"memories","eleanor-warning","MEMORY FRAGMENT 04: A woman grips your wrist. 'He cannot own my future, Vincent.'");
  }else if(s.room==="eleanorRoom"&&target==="letters"&&c.jewelryOpen&&!c.lettersTaken){
    c.lettersTaken=true;
    award(s,"inventory","eleanor-letters","INVENTORY: Eleanor's hidden correspondence.");
    award(s,"clues","flight-plan","NOTEBOOK: Eleanor had arranged to flee the manor before she vanished.");
  }else if(s.room==="manorStudy"&&target==="ledger"&&!c.ledgerTaken){
    c.ledgerTaken=true;
    award(s,"inventory","manor-ledger","INVENTORY: Ashworth Industries study ledger.");
    award(s,"clues","webb-manor-ledger","NOTEBOOK: Marcus Webb signed off on suspicious payments from Ashworth Industries.");
  }else if(s.room==="manorStudy"&&target==="chip"&&c.portraitUnlocked&&!c.chipTaken){
    c.chipTaken=true;
    award(s,"inventory","black-k-chip","INVENTORY: Black poker chip stamped with K.");
    award(s,"clues","black-k-symbol","NOTEBOOK: The black K chip links Ashworth Manor to a hidden gambling operation.");
    say(s,"The chip feels familiar. Kingfisher. The word lands in your stomach like a stone.","memory");
  }else{say(s,"You cannot take that, or you've already collected it.");return;}
  revealVera(s);
}
function use(s,target,item) {
  const c=s.case4;
  if(s.room==="manorStudy"&&target==="portrait"&&item==="manor-diary"&&s.inventory.includes(item)){
    look(s,"portrait");
    say(s,"The diary gives you a likely sequence: FATHER → SUITOR → DAUGHTER.","evidence");return;
  }
  if(s.room==="manorStudy"&&target==="ledger"&&item==="remittance"&&s.inventory.includes(item)){
    if(!c.paymentLinked){
      c.paymentLinked=true;
      award(s,"clues","manor-payment-link","NOTEBOOK: The payment receipt from Vincent's archive matches Webb's ledger.");
    }else say(s,"The payment records still match. You already connected them.");
    return;
  }
  if(s.room==="manorGate"&&target==="intercom"&&!item){
    talk(s,"guard");return;
  }
  say(s,"That doesn't bring you closer to the truth.");
}
function talk(s,target){
  const c=s.case4;
  if(s.room==="manorGate"&&["guard","intercom"].includes(target)){
    if(!c.guardAdmitted){
      c.guardAdmitted=true;
      say(s,"'Vincent Morrow? Miss Vera told me to expect you. Mr. Ashworth is inside.' The iron gate swings open.","choice");
      award(s,"clues","manor-expected","NOTEBOOK: Vera arranged Vincent's arrival at Ashworth Manor.");
    }else say(s,"'Mr. Ashworth's in the foyer. Don't keep him waiting.'","choice");
    return;
  }
  if(s.room==="manorFoyer"&&target==="harold"){
    c.haroldMet=true;c.dialogue="harold";
    say(s,"Harold lowers his glass. 'My daughter is missing, Mr. Morrow. Ask your questions. Just remember whose house you're in.'","choice");
    return;
  }
  if(s.room==="manorStudy"&&target==="vera"&&c.veraAppeared){
    c.dialogue="vera";c.portraitPanel=false;
    say(s,"Vera gestures toward the study door. 'He can hear us. Do we make him answer in front of me, or do you give him a private chance to tell the truth?'","choice");
    return;
  }
  say(s,"No one answers. The house has secrets but few volunteers.");
}
function go(s,target) {
  const c=s.case4;
  if(s.room==="manorGate"&&target==="frontdoor"){
    if(!c.guardAdmitted){say(s,"The gatekeeper hasn't let you in. Talk to him.");return;}
    enter(s,"manorFoyer","ASHWORTH MANOR — THE FOYER. Harold waits beneath a chandelier. 'Morrow. I wondered whether you would come.'");return;
  }
  if(s.room==="manorFoyer"&&target==="studydoor"){
    enter(s,"manorStudy","ASHWORTH STUDY. Polished oak, account books, and a portrait hiding something in the wall.");return;
  }
  if(s.room==="manorFoyer"&&target==="bedroomdoor"){
    enter(s,"eleanorRoom","ELEANOR'S ROOM. Her belongings have been disturbed. A vanity, a jewelry box, and the shape of an interrupted life.");return;
  }
  if(s.room==="manorFoyer"&&target==="frontdoor"){
    enter(s,"manorGate","The rain is colder outside. The gates remain open.");return;
  }
  if(["manorStudy","eleanorRoom"].includes(s.room)&&target==="foyerdoor"){
    enter(s,"manorFoyer","ASHWORTH FOYER. Harold is still waiting, every inch a man who thinks money can stop time.");return;
  }
  say(s,"There's no passage that way.");
}
export function manorAction(s,verb,target,item=""){
  if(s.chapter!==4||s.status!=="playing"||!s.case4||!MANOR_HOTSPOTS[s.room])return s;
  if(verb==="LOOK"){
    if(!target){
      const scene={
        manorGate:"Rain falls on wrought iron gates. A gatekeeper waits beneath the Ashworth crest.",
        manorFoyer:"The chandelier burns too brightly. Harold watches the closed study and Eleanor's room.",
        eleanorRoom:"An empty bedroom full of clues: a vanity, a jewelry box, and the scent of perfume.",
        manorStudy:"Harold's ledger and a strange family portrait dominate his dark study."
      };
      say(s,scene[s.room]);
    }else look(s,target);
  }else if(verb==="OPEN")open(s,target);
  else if(verb==="TAKE")take(s,target);
  else if(verb==="USE")use(s,target,item);
  else if(verb==="GO")go(s,target);
  else if(verb==="TALK")talk(s,target);
  s.actions+=1;
  return s;
}
export function chooseHaroldDialogue(state,choice) {
  const s=clone(state),c=s.case4;
  if(s.chapter!==4||s.room!=="manorFoyer"||s.status!=="playing"||
    c?.dialogue!=="harold"||!HAROLD_OPTIONS.some(o=>o.id===choice))return s;
  if(choice==="close"){c.dialogue=null;say(s,"Harold turns to the window. 'You have your run of the house. Be discreet.'","choice");return s;}
  if(c.haroldAsked.includes(choice)){say(s,"Harold folds his arms. 'I already answered that.'","choice");return s;}
  c.haroldAsked.push(choice);
  switch(choice){
    case "eleanor":
      say(s,"'Eleanor was distraught. She walked out, or someone convinced her to. Every paper in this city thinks I've buried her.'","choice");
      award(s,"clues","harold-evasion","NOTEBOOK: Harold refuses to explain Eleanor's disappearance in detail.");
      break;
    case "webb":
      say(s,"'Webb was a suitable match. Our families had an agreement.' You hear the word agreement where a father should say love.","choice");
      award(s,"clues","harold-webb","NOTEBOOK: Harold confirms an arranged engagement between Eleanor and Marcus Webb.");
      break;
    case "payments":
      if(!s.inventory.includes("case-file")&&!s.inventory.includes("remittance")&&!s.inventory.includes("manor-ledger")){
        say(s,"'Payments? You have no proof, detective.'","warning");
        c.haroldAsked=c.haroldAsked.filter(x=>x!==choice);
      }else{
        say(s,"You show Harold the payment trail. For a moment, he looks frightened. 'Webb handles the company's private accounts.'","choice");
        award(s,"clues","harold-payments","NOTEBOOK: Harold implicates Webb in the handling of Ashworth financial accounts.");
      }
      break;
    case "reassure":
      c.haroldTrust=Math.min(3,c.haroldTrust+1);
      say(s,"'I'm trying to find Eleanor, not punish your family.' Harold's posture softens, just a little.","choice");
      break;
    case "accuse":
      c.haroldTrust=Math.max(-3,c.haroldTrust-2);
      say(s,"'What have you done to your daughter?' Harold sets down the glass. 'Get out of my study if you intend to make accusations.'","choice");
      break;
  }
  s.actions+=1;revealVera(s);return s;
}
export function choosePortrait(state,choice) {
  const s=clone(state),c=s.case4;
  if(s.chapter!==4||s.room!=="manorStudy"||s.status!=="playing"||!c?.portraitPanel||c.portraitUnlocked||
    !PORTRAIT_OPTIONS.some(o=>o.id===choice))return s;
  if(choice==="reset"){c.portraitSequence=[];say(s,"You reset the three portrait nameplates.","choice");return s;}
  const nextPosition=c.portraitSequence.length;
  if(PORTRAIT_SOLUTION[nextPosition]!==choice){
    c.portraitSequence=[];
    say(s,"The portrait clicks back into its frame. The sequence was wrong. Recall the diary's order.","warning");
    return s;
  }
  c.portraitSequence.push(choice);
  if(c.portraitSequence.length===PORTRAIT_SOLUTION.length){
    c.portraitUnlocked=true;c.portraitPanel=false;
    award(s,"clues","manor-portrait-unlocked","NOTEBOOK: The Ashworth family portrait concealed a mechanical compartment.");
    say(s,"A hidden catch snaps. The frame slides aside, exposing a black poker chip engraved K.","evidence");
  }else say(s,"One brass nameplate locks into place. Continue the sequence.","choice");
  s.actions+=1;return s;
}
export function chooseVeraDecision(state,choice) {
  const s=clone(state),c=s.case4;
  if(s.chapter!==4||s.room!=="manorStudy"||s.status!=="playing"||c?.dialogue!=="vera"||
    !VERA_OPTIONS.some(o=>o.id===choice))return s;
  if(choice==="close"){
    c.dialogue=null;
    say(s,"Vera retreats toward the curtain. 'Think carefully. I won't be here all night.'","choice");return s;
  }
  if(!c.veraAppeared||!c.chipTaken||!c.ledgerTaken||!c.lettersTaken||!c.haroldMet)return s;
  c.decision=choice;
  if(choice==="confront"){
    c.veraTrust=Math.max(-3,c.veraTrust-1);
    c.haroldTrust=Math.max(-3,c.haroldTrust-1);
    say(s,"You open the door and call Harold into the study. Vera remains. The ledger and letters lie between all three of you. Harold's face loses its color. 'Where did you find those?'","choice");
    award(s,"clues","public-confrontation","NOTEBOOK: Vincent confronted Harold in Vera's presence, risking her trust.");
  }else{
    c.veraTrust=Math.min(3,c.veraTrust+1);
    say(s,"You let Vera disappear down the corridor before inviting Harold in. Without an audience he glances at the K chip. 'Webb made promises he couldn't keep,' he whispers.","choice");
    award(s,"clues","private-confrontation","NOTEBOOK: Vincent let Vera leave and questioned Harold privately.");
  }
  c.dialogue=null;s.status="chapter4complete";
  say(s,"CHAPTER 4 COMPLETE: The black K chip points toward a hidden casino, and Marcus Webb's money trail leads into the warehouse district. You leave Ashworth Manor knowing the hunt has only begun.","ending");
  return s;
}
export function sanitizeManorCase(input) {
  const s=freshManorCase();
  if(!input||typeof input!=="object"||Array.isArray(input))return s;
  for(const key of Object.keys(s))if(typeof s[key]==="boolean"&&typeof input[key]==="boolean")s[key]=input[key];
  if(Array.isArray(input.haroldAsked))
    s.haroldAsked=[...new Set(input.haroldAsked.filter(x=>HAROLD_OPTIONS.some(o=>o.id===x&&x!=="close")))].slice(0,5);
  if(Array.isArray(input.portraitSequence))
    s.portraitSequence=input.portraitSequence.filter(x=>PORTRAIT_SOLUTION.includes(x)).slice(0,3);
  // Re-establish the sequence prefix; malformed values cannot unlock the portrait.
  for(let i=0;i<s.portraitSequence.length;i++)if(s.portraitSequence[i]!==PORTRAIT_SOLUTION[i]){
    s.portraitSequence=[];break;
  }
  if(s.portraitUnlocked)s.portraitSequence=[...PORTRAIT_SOLUTION];
  s.haroldTrust=Number.isInteger(input.haroldTrust)?Math.max(-3,Math.min(3,input.haroldTrust)):0;
  s.veraTrust=Number.isInteger(input.veraTrust)?Math.max(-3,Math.min(3,input.veraTrust)):0;
  s.dialogue=["harold","vera"].includes(input.dialogue)?input.dialogue:null;
  if(input.decision==="confront"||input.decision==="private")s.decision=input.decision;
  if(s.portraitUnlocked)s.portraitPanel=false;
  return s;
}
