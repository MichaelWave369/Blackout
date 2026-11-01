/* BLACKOUT Chapter 3: The Agency.
 * Rules and deduction state are independent of browser rendering.
 * Original detective story and narrative text belong to BLACKOUT's creator.
 */
export const AGENCY_HOTSPOTS = {
  office: [
    ["board", "Evidence board"], ["desk", "Ransacked desk"],
    ["drawer", "Desk drawer"], ["notebook", "Detective's notebook"],
    ["photograph", "Gala photograph"], ["safe", "Hidden wall safe"],
    ["clock", "Stopped wall clock"], ["radio", "Police radio"],
    ["telephone", "Desk telephone"], ["archive", "Records-room door"],
    ["door", "Office exit"], ["floor", "Scattered case papers"]
  ],
  archive: [
    ["cabinet", "Filing cabinet"], ["calendar", "June calendar"],
    ["diary", "Eleanor's diary page"], ["receipt", "Payment receipt"],
    ["lamp", "Desk lamp"], ["exit", "Return to office"]
  ]
};
export const BOARD_OPTIONS = [
  { id: "eleanor", label: "CONNECT ELEANOR'S PORTRAIT + HEADLINES" },
  { id: "kingfisher", label: "CONNECT TOMMY'S LIGHTER + KINGFISHER" },
  { id: "webb", label: "CONNECT THE CASE FILE + MARCUS WEBB" },
  { id: "close", label: "CLOSE EVIDENCE BOARD" }
];
const SOLUTION = [3, 6, 9];
const clone = value => JSON.parse(JSON.stringify(value));
function note(state, text, kind = "narration") {
  state.transcript.push({id:(state.transcript.at(-1)?.id || 0)+1,text,kind});
  state.transcript = state.transcript.slice(-35);
}
function award(state, group, value, text) {
  if(!state[group].includes(value)) {
    state[group].push(value);
    if(text) note(state,text,"evidence");
  }
}
function move(state,room,text) {
  state.room=room;
  if(!state.discovered.includes(room))state.discovered.push(room);
  note(state,text,"chapter");
}
export function freshAgencyCase() {
  return {
    deskOpen:false, drawerOpen:false, archiveOpen:false,
    notebookTaken:false, photographTaken:false, diaryTaken:false, receiptTaken:false,
    safeExamined:false, safeOpen:false, safeDigits:[0,0,0], fileTaken:false,
    boardExamined:false, boardLinks:[], boardSolved:false,
    radioHeard:false, phoneAnswered:false
  };
}
export function agencyTargets(state) {
  const c=state.case3;
  if(!c)return [];
  return (AGENCY_HOTSPOTS[state.room]||[]).filter(([id])=>{
    if(id==="drawer")return c.deskOpen;
    if(id==="notebook")return c.deskOpen&&!c.notebookTaken;
    if(id==="photograph")return c.drawerOpen&&!c.photographTaken;
    if(id==="diary"||id==="receipt")return c.archiveOpen&&!c[id==="diary"?"diaryTaken":"receiptTaken"];
    return true;
  });
}
function closePanels(state) {
  state.case3.safeExamined=false;
  state.case3.boardExamined=false;
}
function revealClock(state) {
  award(state,"clues","safe-nine","NOTEBOOK: The stopped wall clock points to 9. Third digit.");
}
function revealPhoto(state) {
  award(state,"clues","safe-three","NOTEBOOK: Three red ribbons beneath Eleanor's gala photograph. First digit.");
}
function revealCalendar(state) {
  award(state,"clues","safe-six","NOTEBOOK: June is marked in a weathered appointment calendar. Sixth month. Second digit.");
}
function look(state,target) {
  const c=state.case3;
  if(state.room==="office") {
    switch(target) {
      case "board":
        closePanels(state);c.boardExamined=true;
        note(state,"On the board: ASHWORTH / KINGFISHER / WEBB. Three connections could explain the frame-up. Follow the evidence.","choice");return;
      case "safe":
        closePanels(state);c.safeExamined=true;
        note(state,"A hidden wall safe. Etched above three dials: PORTRAIT / DATE / HOUR. The office contains the first and third clues.","choice");return;
      case "desk":
        note(state,"Drawers yanked open, papers tossed across the floor. Your detective notebook is buried in a shallow compartment.");return;
      case "drawer":
        note(state,c.drawerOpen?"A photograph lies where you found it.": "The drawer feels stuck, but it isn't locked.");return;
      case "notebook":
        note(state,"Your own handwritten notes. The last page bears the initials V.M. and an Ashworth appointment.");return;
      case "photograph":revealPhoto(state);note(state,"Eleanor Ashworth, in a blue coat, stands beside Marcus Webb. Three red ribbons decorate the photograph's lower edge.");return;
      case "clock":revealClock(state);note(state,"The clock stopped at nine. Somebody smashed the glass after the hands froze.");return;
      case "radio":
        note(state,"Police dispatch hisses from the receiver. Your description is on every wire.");return;
      case "telephone":
        note(state,c.boardSolved?"The telephone rings again. Someone is desperate to reach you.":"The line is quiet, for now. A phone call might explain what happened here.");return;
      case "archive":
        note(state,"An unlocked records room beyond the office. More files, more secrets.");return;
      case "door":
        note(state,"Your name is painted in gold across the office door. You shouldn't leave without solving your own case.");return;
      case "floor":
        note(state,"Ashworth account statements, cigarette ash, and the impression of a missing folder in the dust.");return;
      default: note(state,"Nothing here answers the question.");
    }
  } else {
    switch(target) {
      case "cabinet":note(state,"Someone rifled through files marked A–F. The Ashworth folder is almost empty.");return;
      case "calendar":revealCalendar(state);note(state,"A torn office calendar is open to June. Red pencil circles the month. Second safe digit: six.");return;
      case "diary":note(state,"A handwritten page in Eleanor's script: 'I'd rather die than marry Marcus Webb.'");return;
      case "receipt":note(state,"A folded remittance slip from Ashworth Industries to a company without a real address.");return;
      case "lamp":note(state,"Flickering amber light. Someone abandoned this room in a hurry.");return;
      case "exit":note(state,"A doorway back to Vincent's office and evidence board.");return;
      default:note(state,"Only dust and unanswered questions.");
    }
  }
}
function open(state,target) {
  const c=state.case3;
  if(state.room==="office"&&target==="desk") {
    if(c.deskOpen){note(state,"The desk compartment is already open.");return;}
    c.deskOpen=true;
    note(state,"A false-bottom desk compartment slides out. Your notebook, a jammed drawer, and a ledger impression wait beneath the dust.","evidence");
    return;
  }
  if(state.room==="office"&&target==="drawer") {
    if(c.drawerOpen){note(state,"You already opened that drawer.");return;}
    if(!c.deskOpen){note(state,"Inspect the desk first.");return;}
    c.drawerOpen=true;
    note(state,"The drawer cracks loose. A gala photograph slides free. Eleanor Ashworth and Marcus Webb.","evidence");
    return;
  }
  if(state.room==="archive"&&target==="cabinet") {
    if(c.archiveOpen){note(state,"The Ashworth file cabinet is already open.");return;}
    c.archiveOpen=true;
    note(state,"You force the warped cabinet drawer. A diary page and payment receipt fall out.","evidence");
    return;
  }
  if(state.room==="office"&&target==="safe"){
    look(state,"safe");return;
  }
  note(state,"It won't open. Try examining the evidence.");
}
function take(state,target) {
  const c=state.case3;
  if(state.room==="office"&&target==="notebook"&&c.deskOpen&&!c.notebookTaken){
    c.notebookTaken=true;
    award(state,"inventory","case-notebook","INVENTORY: Vincent's detective notebook.");
    award(state,"clues","agency-case","NOTEBOOK: An Ashworth appointment recorded in Vincent's own handwriting.");
    note(state,"You recognize your handwriting. You cannot remember making the appointment.","memory");
  } else if(state.room==="office"&&target==="photograph"&&c.drawerOpen&&!c.photographTaken){
    c.photographTaken=true;revealPhoto(state);
    award(state,"inventory","gala-photo","INVENTORY: Eleanor Ashworth and Marcus Webb at the gala.");
    award(state,"clues","engagement-photo","NOTEBOOK: Eleanor and Marcus Webb pictured together; she looks terrified.");
    award(state,"memories","job-offer","MEMORY FRAGMENT 03: A desperate father across your desk. 'Find my daughter, Mr. Morrow. Whatever it takes.'");
  } else if(state.room==="archive"&&target==="diary"&&c.archiveOpen&&!c.diaryTaken){
    c.diaryTaken=true;
    award(state,"inventory","diary-page","INVENTORY: Eleanor Ashworth's torn diary page.");
    award(state,"clues","coerced-engagement","NOTEBOOK: Eleanor was pressured to marry Marcus Webb and planned to flee.");
  } else if(state.room==="archive"&&target==="receipt"&&c.archiveOpen&&!c.receiptTaken){
    c.receiptTaken=true;
    award(state,"inventory","remittance","INVENTORY: Ashworth Industries remittance receipt.");
    award(state,"clues","ashworth-payment","NOTEBOOK: Ashworth Industries wired funds to a shell company tied to Webb.");
  } else {
    note(state,"You can't take that, or you've already collected it.");
  }
}
function use(state,target,item) {
  const c=state.case3;
  if(state.room==="office"&&target==="board") {
    look(state,"board");
    if(item==="gala-photo"&&state.inventory.includes(item))note(state,"You pin Eleanor's photograph beside the missing-person article. Now try connecting them.","choice");
    if(item==="lighter"&&state.inventory.includes(item))note(state,"Tommy's engraved lighter belongs beside the Kingfisher testimony.","choice");
    if(item==="case-file"&&state.inventory.includes(item))note(state,"You pin Webb's engagement records beside the bank transfers.","choice");
    return;
  }
  if(state.room==="office"&&target==="telephone"&&!item){
    answerPhone(state);return;
  }
  if(state.room==="office"&&target==="radio"&&!item){
    hearRadio(state);return;
  }
  if(state.room==="office"&&target==="safe") {
    look(state,"safe");return;
  }
  note(state,"That combination doesn't help this case.");
}
function hearRadio(state) {
  if(state.case3.radioHeard){note(state,"The police broadcast repeats your description and the Marmont address.");return;}
  state.case3.radioHeard=true;
  award(state,"clues","police-bulletin","NOTEBOOK: Police are circulating Vincent Morrow's description as a person of interest.");
  note(state,"'Marmont Hotel shooting. Suspect, male, forty-ish, dark coat. Name believed to be Morrow.' The voice from the radio doesn't sound real.","warning");
}
function answerPhone(state) {
  const c=state.case3;
  if(!c.boardSolved) {
    note(state,"You lift the receiver. Only the empty pulse of a disconnected line. Not yet.");return;
  }
  if(c.phoneAnswered)return;
  c.phoneAnswered=true;closePanels(state);
  award(state,"clues","vera-call","NOTEBOOK: Vera requests a private midnight meeting at Ashworth Manor.");
  note(state,"RIIING. You lift the receiver. A woman speaks before you can introduce yourself. 'Mr. Morrow. We need to talk. Ashworth Manor. Midnight. Come alone.' Click.","choice");
  note(state,"CHAPTER 3 COMPLETE: Eleanor's disappearance, Webb's forced engagement, and the Kingfisher's money form one pattern. You have an address and a deadline.","ending");
  state.status="chapter3complete";
}
function go(state,target) {
  if(state.room==="office"&&target==="archive"){
    closePanels(state);
    move(state,"archive","RECORDS ROOM. The filing cabinets have been forced. A June calendar hangs beside the lamp.");
    return;
  }
  if(state.room==="archive"&&target==="exit"){
    closePanels(state);
    move(state,"office","MORROW'S AGENCY. Your evidence board waits beneath the stopped clock.");
    return;
  }
  if(state.room==="office"&&target==="door"){
    note(state,"Not yet. Whoever ransacked this office left a puzzle behind. Follow it first.");return;
  }
  note(state,"No passage that way.");
}
export function agencyAction(state,verb,target,item=""){
  if(state.chapter!==3||state.status!=="playing"||!["office","archive"].includes(state.room)||!state.case3)return state;
  if(verb==="LOOK"){
    if(!target)note(state,state.room==="office"
      ?"Your office has been torn apart. A case board, a false-bottom desk, the clock, a safe, a telephone, and the records room are still here."
      :"The archive smells of paper and dust. There's a cabinet, a June calendar, and an open door.");
    else look(state,target);
  } else if(verb==="OPEN")open(state,target);
  else if(verb==="TAKE")take(state,target);
  else if(verb==="USE")use(state,target,item);
  else if(verb==="GO")go(state,target);
  else if(verb==="TALK") {
    if(state.room==="office"&&target==="telephone")answerPhone(state);
    else if(state.room==="office"&&target==="radio")hearRadio(state);
    else note(state,"Only the old building answers.");
  }
  state.actions += 1;
  return state;
}
export function adjustAgencyDial(state,position,delta) {
  const next=clone(state);
  if(next.chapter!==3||next.room!=="office"||next.status!=="playing"||
    !next.case3?.safeExamined||next.case3.safeOpen||
    !Number.isInteger(position)||position<0||position>2||![1,-1].includes(delta))return next;
  next.case3.safeDigits[position]=(next.case3.safeDigits[position]+delta+10)%10;
  next.actions+=1;return next;
}
export function submitAgencySafe(state) {
  const next=clone(state);
  if(next.chapter!==3||next.room!=="office"||next.status!=="playing"||
    !next.case3?.safeExamined||next.case3.safeOpen)return next;
  if(next.case3.safeDigits.every((n,i)=>n===SOLUTION[i])){
    next.case3.safeOpen=true;next.case3.safeExamined=false;
    award(next,"clues","safe-open","NOTEBOOK: The wall safe combination was 3–6–9.");
    note(next,"The final tumbler catches. Inside: Eleanor's case folder. A red ribbon binds it shut.","evidence");
  } else note(next,"Wrong combination. The lock refuses to turn. The plate says PORTRAIT / DATE / HOUR.","warning");
  next.actions+=1;return next;
}
export function collectAgencyFile(state) {
  const next=clone(state);
  if(next.chapter!==3||next.room!=="office"||next.status!=="playing"||!next.case3?.safeOpen||next.case3.fileTaken)return next;
  next.case3.fileTaken=true;
  award(next,"inventory","case-file","INVENTORY: Eleanor Ashworth confidential case file.");
  award(next,"clues","webb-engagement","NOTEBOOK: Eleanor's engagement to Marcus Webb was coerced. She intended to flee.");
  award(next,"clues","webb-finances","NOTEBOOK: Webb received payments through Ashworth Industries shell accounts.");
  note(next,"Eleanor's file confirms it: she feared Webb and had asked Vincent for help. The missing woman might still be alive.","memory");
  next.actions+=1;
  return next;
}
export function agencyBoardChoice(state,choice) {
  const next=clone(state);
  const c=next.case3;
  if(next.chapter!==3||next.room!=="office"||next.status!=="playing"||!c?.boardExamined||!BOARD_OPTIONS.some(x=>x.id===choice))return next;
  if(choice==="close"){c.boardExamined=false;return next;}
  if(c.boardLinks.includes(choice)){note(next,"That connection is already pinned to the board.");return next;}
  const requirements={
    eleanor:next.inventory.includes("gala-photo"),
    kingfisher:next.inventory.includes("lighter"),
    webb:next.inventory.includes("case-file")
  };
  if(!requirements[choice]){
    note(next,{
      eleanor:"Find the gala photograph in your desk before connecting Eleanor to the missing-person case.",
      kingfisher:"The silver lighter Tommy gave you is the missing link. Keep looking.",
      webb:"The confidential case folder is still locked inside the wall safe."
    }[choice],"warning");
    return next;
  }
  c.boardLinks.push(choice);
  const messages={
    eleanor:"CASE BOARD: The woman from the newspaper is Eleanor Ashworth. The photograph confirms she knew Marcus Webb.",
    kingfisher:"CASE BOARD: Tommy's warning and the engraved lighter lead back to Kingfisher and the Crimson Lounge.",
    webb:"CASE BOARD: Webb coerced Eleanor, and Ashworth funds went to his associates. This frame-up reaches the top."
  };
  award(next,"clues","board-"+choice,messages[choice]);
  next.actions+=1;
  if(c.boardLinks.length===3&&!c.boardSolved){
    c.boardSolved=true;c.boardExamined=false;
    note(next,"The connections align. Then the desk telephone starts RINGING. Someone has been watching your investigation.","warning");
  }
  return next;
}
export function sanitizeAgencyCase(input) {
  const safe=freshAgencyCase();
  if(!input||typeof input!=="object"||Array.isArray(input))return safe;
  for(const key of Object.keys(safe)){
    if(typeof safe[key]==="boolean"&&typeof input[key]==="boolean")safe[key]=input[key];
  }
  if(Array.isArray(input.safeDigits)&&input.safeDigits.length===3)
    safe.safeDigits=input.safeDigits.map(n=>Number.isInteger(n)&&n>=0&&n<=9?n:0);
  if(Array.isArray(input.boardLinks))
    safe.boardLinks=[...new Set(input.boardLinks.filter(v=>["eleanor","kingfisher","webb"].includes(v)))];
  // Derived progression follows the canonical solved connections.
  safe.boardSolved=safe.boardLinks.length===3&&safe.boardSolved;
  if(safe.safeOpen)safe.safeExamined=false;
  if(safe.boardSolved)safe.boardExamined=false;
  return safe;
}
