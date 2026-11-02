import test from "node:test";
import assert from "node:assert/strict";
import {
  initialState, act, chooseEvidence, setStoryMode, validateSave, visibleTargets, SAVE_VERSION,
  continueCase, continueAgencyCase, continueManorCase, continueWarehouseCase, chooseDialogue, TOMMY_OPTIONS
} from "../src/engine.js";
import { adjustAgencyDial, submitAgencySafe, collectAgencyFile, agencyBoardChoice, BOARD_OPTIONS } from "../src/chapter3.js";
import { HAROLD_OPTIONS, VERA_OPTIONS, PORTRAIT_OPTIONS, chooseHaroldDialogue, choosePortrait, chooseVeraDecision } from "../src/chapter4.js";
import { WATCHMAN_OPTIONS, TUNNEL_OPTIONS, chooseWatchman, adjustFreightSeal, submitFreightSeal, chooseTunnel } from "../src/chapter5.js";
function step(state,verb,target,item="") { return act(state,verb,target,item); }
function reachSuite(){
  let s=initialState();return step(s,"GO","door");
}
test("fresh case opens in the hotel bathroom and is independent",()=>{
  const a=initialState(),b=initialState();
  assert.equal(a.room,"bathroom");assert.equal(a.status,"playing");
  a.inventory.push("test");assert.equal(b.inventory.length,0);
});
test("mirror puzzle requires a towel and records discovery",()=>{
  let s=initialState();
  s=step(s,"USE","mirror","towel");assert.equal(s.flags.mirror,false);
  s=step(s,"TAKE","towel");s=step(s,"USE","mirror","towel");
  assert.equal(s.flags.mirror,true);assert.ok(s.clues.includes("reflection"));
});
test("cabinet reveals screwdriver, window requires it",()=>{
  let s=initialState();
  assert.equal(visibleTargets(s).some(([id])=>id==="screwdriver"),false);
  s=step(s,"OPEN","cabinet");assert.ok(visibleTargets(s).some(([id])=>id==="screwdriver"));
  s=step(s,"TAKE","screwdriver");s=step(s,"GO","door");
  s=step(s,"OPEN","window");assert.equal(s.flags.window,false);
  s=step(s,"USE","window","screwdriver");
  assert.equal(s.flags.window,true);
  s=step(s,"GO","window");assert.equal(s.room,"escape");
});
test("wallet reveals Vincent's identity and matchbook triggers first memory",()=>{
  let s=reachSuite();
  s=step(s,"TAKE","wallet");assert.equal(s.flags.identity,false);
  s=step(s,"OPEN","jacket");s=step(s,"TAKE","wallet");
  s=step(s,"TAKE","matchbook");
  assert.equal(s.flags.identity,true);assert.equal(s.flags.memory,true);
  assert.ok(s.clues.includes("identity"));assert.deepEqual(s.memories,["blue-door"]);
});
test("crime-scene choices cannot be duplicated and change morality",()=>{
  let s=reachSuite();s=step(s,"LOOK","body");
  const a=chooseEvidence(s,"preserve"),b=chooseEvidence(s,"erase");
  assert.equal(a.morality,1);assert.equal(b.morality,-1);
  assert.equal(chooseEvidence(a,"erase").flags.evidenceChoice,"preserve");
});
test("complete detective route escapes and ends the opening chapter",()=>{
  let s=initialState();
  s=step(s,"TAKE","towel");s=step(s,"USE","mirror","towel");
  s=step(s,"OPEN","cabinet");s=step(s,"TAKE","screwdriver");
  s=step(s,"GO","door");s=step(s,"LOOK","body");
  s=step(s,"OPEN","jacket");s=step(s,"TAKE","wallet");s=step(s,"TAKE","matchbook");
  s=step(s,"USE","window","screwdriver");s=step(s,"GO","window");s=step(s,"GO","ladder");
  assert.equal(s.room,"alley");assert.equal(s.status,"escaped");
  assert.ok(s.transcript.some(x=>x.text.includes("CHAPTER COMPLETE: You know your name")));
  assert.equal(step(s,"GO","ladder").status,"escaped");
});
test("police pressure catches slow players, with story mode protection",()=>{
  let s=initialState();
  for(let i=0;i<35;i++)s=step(s,"USE","sink");
  assert.equal(s.status,"caught");
  let safe=setStoryMode(initialState(),true);
  for(let i=0;i<40;i++)safe=step(safe,"USE","sink");
  assert.equal(safe.status,"playing");
});
test("save round trips versioned data and rejects broken payloads",()=>{
  let s=step(initialState(),"TAKE","towel");
  assert.equal(validateSave(JSON.parse(JSON.stringify(s))).inventory[0],"towel");
  assert.equal(validateSave(s).version,SAVE_VERSION);
  assert.throws(()=>validateSave({version:999}),/compatible/);
  assert.throws(()=>validateSave({...s,inventory:"fake"}),/missing inventory/);
  assert.throws(()=>validateSave({...s,status:"root"}),/status/);
});
test("invalid targets don't change progress and no off-room object leaks",()=>{
  let s=initialState();
  const before=s.actions;
  s=step(s,"TAKE","wallet");
  assert.equal(s.actions,before);assert.ok(!s.inventory.includes("wallet"));
});

function reachStreet() {
  let s = setStoryMode(initialState(), true);
  s=step(s,"OPEN","cabinet");
  s=step(s,"TAKE","screwdriver");
  s=step(s,"GO","door");
  s=step(s,"USE","window","screwdriver");
  s=step(s,"GO","window");
  s=step(s,"GO","ladder");
  assert.equal(s.status,"escaped");
  s=continueCase(s);
  assert.equal(s.room,"street");
  return s;
}
test("completed hotel escape continues to neon streets without losing inventory",()=>{
  let s=reachStreet();
  assert.equal(s.chapter,2);assert.equal(s.status,"playing");
  assert.ok(s.inventory.includes("screwdriver"));
  assert.ok(s.transcript.some(x=>x.text.includes("CHAPTER 2")));
  const before=s.pressure;
  for(let i=0;i<50;i++) s=step(s,"LOOK","sign");
  assert.equal(s.pressure,before);assert.equal(s.status,"playing");
});
test("street paper, red door and bouncer create persistent clues",()=>{
  let s=reachStreet();
  s=step(s,"TAKE","newspaper");
  assert.ok(s.clues.includes("ashworth-headline"));
  s=step(s,"GO","door");
  assert.equal(s.room,"lounge");
  assert.ok(s.clues.includes("bouncer-recognition"));
  s=step(s,"TALK","bouncer");
  assert.ok(s.transcript.some(x=>x.text.includes("Back again")));
});
test("Tommy dialogue gates Kingfisher lead, lighter and second memory",()=>{
  let s=reachStreet();
  s=step(s,"GO","door");
  s=step(s,"TALK","tommy");
  assert.equal(s.dialogue,"tommy");
  assert.equal(TOMMY_OPTIONS.length,5);
  s=chooseDialogue(s,"kingfisher");
  assert.equal(s.flags.lighterReady,false,"Tommy insists on last-night first");
  s=chooseDialogue(s,"last-night");
  assert.ok(s.clues.includes("tommy-testimony"));
  assert.ok(s.memories.includes("jazz-warning"));
  s=chooseDialogue(s,"kingfisher");
  assert.equal(s.flags.lighterReady,true);
  assert.ok(visibleTargets(s).some(([id])=>id==="lighter"));
  s=step(s,"TAKE","lighter");
  assert.ok(s.inventory.includes("lighter"));
  assert.ok(s.memories.includes("kingfisher-whisper"));
  s=chooseDialogue(s,"close");
  assert.equal(s.dialogue,null);
  s=step(s,"GO","exit");
  s=step(s,"GO","agency");
  assert.equal(s.status,"chapter2complete");
  assert.equal(s.room,"agency");
  assert.equal(step(s,"GO","door").status,"chapter2complete","ending is stable");
  assert.equal(validateSave(s).status,"chapter2complete");
});
test("bullying Tommy costs trust, reassurance can repair the interview",()=>{
  let s=step(reachStreet(),"GO","door");
  s=step(s,"TALK","tommy");
  s=chooseDialogue(s,"pressure");
  s=chooseDialogue(s,"last-night");
  s=chooseDialogue(s,"kingfisher");
  assert.equal(s.flags.lighterReady,false,"Tommy refuses while intimidated");
  s=chooseDialogue(s,"reassure");
  assert.equal(s.rapport,-1);
  s=chooseDialogue(s,"kingfisher");
  assert.equal(s.flags.lighterReady,true);
  const n=s.rapport;
  s=chooseDialogue(s,"reassure");
  assert.equal(s.rapport,n,"reassurance cannot be farmed indefinitely");
});
test("v1 local and exported case files migrate to current version without erasing clues",()=>{
  let old=reachStreet();
  old.status="escaped";old.room="alley";old.version=1;
  delete old.chapter;delete old.rapport;delete old.dialogue;
  old.flags={mirror:true,body:true,identity:true,window:true,memory:true,evidenceChoice:"preserve"};
  old.inventory.push("matchbook");
  const migrated=validateSave(old);
  assert.equal(migrated.version,SAVE_VERSION);
  assert.equal(migrated.chapter,1);
  assert.equal(migrated.flags.evidenceChoice,"preserve");
  assert.equal(continueCase(migrated).chapter,2);
  assert.ok(migrated.inventory.includes("matchbook"));
});
test("opening an already-open cabinet does not repeat its discovery or advance pressure",()=>{
  let s=step(initialState(),"OPEN","cabinet");
  const before=s.pressure;const count=s.transcript.length;
  s=step(s,"OPEN","cabinet");
  assert.equal(s.pressure,before);
  assert.equal(s.transcript.length,count+1);
  assert.equal(s.transcript.at(-1).text,"The cabinet is already open. No new evidence inside.");
});
test("chapter two continuation cannot be used before escape or after starting",()=>{
  const early=continueCase(initialState());
  assert.equal(early.room,"bathroom");
  const after=reachStreet();
  assert.equal(continueCase(after).room,"street");
});

function reachAgency(){
  let s=reachStreet();
  s=step(s,"GO","door");
  s=step(s,"TALK","tommy");
  s=chooseDialogue(s,"last-night");
  s=chooseDialogue(s,"kingfisher");
  s=step(s,"TAKE","lighter");
  s=step(s,"GO","exit");
  s=step(s,"GO","agency");
  assert.equal(s.status,"chapter2complete");
  s=continueAgencyCase(s);
  assert.equal(s.status,"playing");
  assert.equal(s.room,"office");
  return s;
}
function dialTo(s,arr) {
  s=step(s,"LOOK","safe");
  for(let i=0;i<3;i++)for(let j=0;j<arr[i];j++)s=adjustAgencyDial(s,i,1);
  return s;
}
test("chapter two completion continues into The Agency with evidence intact",()=>{
  const s=reachAgency();
  assert.equal(s.chapter,3);assert.equal(s.status,"playing");
  assert.ok(s.inventory.includes("lighter"));
  assert.ok(s.clues.includes("kingfisher-lead"));
  assert.ok(s.case3&&!s.case3.safeOpen);
  assert.equal(continueAgencyCase(s).room,"office","cannot replay transition");
});
test("the office has an evidence board, desk discoveries and a records room",()=>{
  let s=reachAgency();
  const targets=visibleTargets(s).map(([id])=>id);
  assert.ok(targets.includes("board")&&targets.includes("desk")&&targets.includes("safe"));
  assert.ok(!targets.includes("photograph"));
  s=step(s,"OPEN","desk");
  assert.ok(visibleTargets(s).some(([id])=>id==="notebook"));
  s=step(s,"TAKE","notebook");
  assert.ok(s.inventory.includes("case-notebook"));
  s=step(s,"OPEN","drawer");s=step(s,"LOOK","photograph");s=step(s,"TAKE","photograph");
  assert.ok(s.clues.includes("safe-three"));
  assert.ok(s.memories.includes("job-offer"));
  assert.ok(s.inventory.includes("gala-photo"));
  s=step(s,"LOOK","clock");assert.ok(s.clues.includes("safe-nine"));
  s=step(s,"GO","archive");
  assert.equal(s.room,"archive");
  s=step(s,"LOOK","calendar");assert.ok(s.clues.includes("safe-six"));
  s=step(s,"OPEN","cabinet");
  s=step(s,"TAKE","diary");s=step(s,"TAKE","receipt");
  assert.ok(s.clues.includes("coerced-engagement"));
  assert.ok(s.clues.includes("ashworth-payment"));
  s=step(s,"GO","exit");
  assert.equal(s.room,"office");
  assert.equal(validateSave(s).room,"office");
});
test("three-dial safe accepts 369, rejects wrong combinations and protects from duplicates",()=>{
  let s=reachAgency();
  s=step(s,"LOOK","safe");
  s=adjustAgencyDial(s,0,1);
  s=submitAgencySafe(s);
  assert.equal(s.case3.safeOpen,false);
  s=adjustAgencyDial(s,0,-1); // back to zero
  s=adjustAgencyDial(s,0,-1); // nine
  assert.equal(s.case3.safeDigits[0],9,"dials rotate across zero");
  s=adjustAgencyDial(s,0,1);
  for(let i=0;i<3;i++)for(let j=0;j<[3,6,9][i];j++)s=adjustAgencyDial(s,i,1);
  s=submitAgencySafe(s);
  assert.equal(s.case3.safeOpen,true);
  assert.ok(s.clues.includes("safe-open"));
  s=collectAgencyFile(s);
  assert.ok(s.inventory.includes("case-file"));
  assert.ok(s.clues.includes("webb-engagement"));
  const prev=s.inventory.length;
  s=collectAgencyFile(s);
  assert.equal(s.inventory.length,prev);
});
test("board deductions require evidence and completed board unlocks Vera's call",()=>{
  let s=reachAgency();
  s=step(s,"LOOK","board");
  assert.equal(BOARD_OPTIONS.length,4);
  s=agencyBoardChoice(s,"eleanor");
  assert.equal(s.case3.boardLinks.length,0,"portrait required");
  s=agencyBoardChoice(s,"kingfisher");
  assert.deepEqual(s.case3.boardLinks,["kingfisher"]);
  s=step(s,"OPEN","desk");
  s=step(s,"OPEN","drawer");
  s=step(s,"TAKE","photograph");
  s=step(s,"LOOK","board");
  s=agencyBoardChoice(s,"eleanor");
  s=agencyBoardChoice(s,"webb");
  assert.equal(s.case3.boardSolved,false,"safe folder required");
  s=dialTo(s,[3,6,9]);
  s=submitAgencySafe(s);
  s=collectAgencyFile(s);
  s=step(s,"LOOK","board");
  s=agencyBoardChoice(s,"webb");
  assert.equal(s.case3.boardSolved,true);
  assert.ok(s.transcript.some(x=>x.text.includes("RINGING")));
  s=step(s,"TALK","telephone");
  assert.equal(s.status,"chapter3complete");
  assert.ok(s.clues.includes("vera-call"));
  assert.ok(s.transcript.some(x=>x.text.includes("Ashworth Manor. Midnight")));
  assert.equal(step(s,"TALK","telephone").status,"chapter3complete","ending stable");
});
test("the telephone won't end the chapter before case board is solved",()=>{
  let s=reachAgency();
  s=step(s,"TALK","telephone");
  assert.equal(s.status,"playing");
  assert.ok(!s.clues.includes("vera-call"));
});
test("chapter 2 JSON save resumes Chapter 3 and v3 case state round-trips",()=>{
  let s=reachAgency();
  s=step(s,"OPEN","desk");
  s=step(s,"OPEN","drawer");
  s=step(s,"TAKE","photograph");
  s=step(s,"LOOK","safe");
  s=adjustAgencyDial(s,0,1);
  const loaded=validateSave(JSON.parse(JSON.stringify(s)));
  assert.equal(loaded.version,SAVE_VERSION);
  assert.equal(loaded.chapter,3);
  assert.equal(loaded.case3.safeDigits[0],1);
  assert.ok(loaded.inventory.includes("gala-photo"));
  const v2={...s,version:2,room:"agency",chapter:2,status:"chapter2complete"};
  delete v2.case3;
  const migrated=validateSave(v2);
  assert.equal(migrated.version,SAVE_VERSION);
  assert.equal(continueAgencyCase(migrated).chapter,3);
});
test("corrupt agency data normalizes dial values and unknown evidence links",()=>{
  const s=reachAgency();
  s.case3.safeDigits=[100,-1,"9"];
  s.case3.boardLinks=["eleanor","bad","eleanor","kingfisher"];
  const loaded=validateSave(s);
  assert.deepEqual(loaded.case3.safeDigits,[0,0,0]);
  assert.deepEqual(loaded.case3.boardLinks,["eleanor","kingfisher"]);
  assert.equal(loaded.case3.boardSolved,false);
});

function reachManor(){
  let s=reachAgency();
  s=step(s,"OPEN","desk");
  s=step(s,"OPEN","drawer");
  s=step(s,"TAKE","photograph");
  s=step(s,"LOOK","safe");
  for(let i=0;i<3;i++)for(let j=0;j<[3,6,9][i];j++)s=adjustAgencyDial(s,i,1);
  s=submitAgencySafe(s);
  s=collectAgencyFile(s);
  s=step(s,"LOOK","board");
  s=agencyBoardChoice(s,"eleanor");
  s=agencyBoardChoice(s,"kingfisher");
  s=agencyBoardChoice(s,"webb");
  assert.equal(s.case3.boardSolved,true,"Agency deductions are complete");
  s=step(s,"TALK","telephone");
  assert.equal(s.status,"chapter3complete");
  s=continueManorCase(s);
  assert.equal(s.room,"manorGate");
  return s;
}
function enterManor(s){
  s=step(s,"TALK","guard");
  s=step(s,"GO","frontdoor");
  assert.equal(s.room,"manorFoyer");
  return s;
}
function searchEleanorRoom(s){
  s=step(s,"GO","bedroomdoor");
  s=step(s,"OPEN","vanity");
  s=step(s,"TAKE","diary");
  s=step(s,"OPEN","jewelry");
  s=step(s,"TAKE","letters");
  assert.ok(s.inventory.includes("manor-diary"));
  assert.ok(s.inventory.includes("eleanor-letters"));
  s=step(s,"GO","foyerdoor");
  return s;
}
function revealBlackChip(s){
  s=step(s,"GO","studydoor");
  s=step(s,"TAKE","ledger");
  s=step(s,"LOOK","portrait");
  s=choosePortrait(s,"harold");
  s=choosePortrait(s,"webb");
  s=choosePortrait(s,"eleanor");
  assert.equal(s.case4.portraitUnlocked,true);
  s=step(s,"TAKE","chip");
  assert.ok(s.inventory.includes("black-k-chip"));
  return s;
}
test("v3 agency completion continues into Ashworth Manor with all previous evidence intact",()=>{
  let s=reachManor();
  assert.equal(s.chapter,4);
  assert.equal(s.status,"playing");
  assert.ok(s.inventory.includes("case-file"));
  assert.ok(s.inventory.includes("lighter"));
  assert.ok(s.clues.includes("vera-call"));
  assert.equal(s.case4.guardAdmitted,false);
  assert.equal(continueManorCase(s).room,"manorGate","cannot replay transition");
});
test("the locked Ashworth gates require talking to the guard before entry",()=>{
  let s=reachManor();
  const oldActions=s.actions;
  s=step(s,"GO","frontdoor");
  assert.equal(s.room,"manorGate");
  assert.equal(s.case4.guardAdmitted,false);
  s=step(s,"TALK","guard");
  assert.equal(s.case4.guardAdmitted,true);
  assert.ok(s.clues.includes("manor-expected"));
  s=step(s,"GO","frontdoor");
  assert.equal(s.room,"manorFoyer");
  assert.ok(s.actions>oldActions);
  assert.ok(visibleTargets(s).some(([id])=>id==="harold"));
});
test("Eleanor's bedroom hides a diary and letters behind separate interactive objects",()=>{
  let s=enterManor(reachManor());
  s=step(s,"GO","bedroomdoor");
  assert.equal(s.room,"eleanorRoom");
  assert.equal(visibleTargets(s).some(([id])=>id==="diary"),false);
  s=step(s,"OPEN","vanity");
  assert.ok(visibleTargets(s).some(([id])=>id==="diary"));
  s=step(s,"TAKE","diary");
  assert.ok(s.clues.includes("manor-portrait-order"));
  assert.ok(s.memories.includes("eleanor-warning"));
  assert.ok(!s.inventory.includes("eleanor-letters"));
  s=step(s,"OPEN","jewelry");
  s=step(s,"TAKE","letters");
  assert.ok(s.clues.includes("flight-plan"));
  assert.ok(s.inventory.includes("eleanor-letters"));
});
test("Harold's interview saves distinct trust and payment consequences without farming",()=>{
  let s=enterManor(reachManor());
  s=step(s,"TALK","harold");
  assert.equal(s.case4.dialogue,"harold");
  assert.equal(HAROLD_OPTIONS.length,6);
  s=chooseHaroldDialogue(s,"eleanor");
  s=chooseHaroldDialogue(s,"webb");
  s=chooseHaroldDialogue(s,"payments");
  assert.ok(s.clues.includes("harold-payments"));
  s=chooseHaroldDialogue(s,"reassure");
  assert.equal(s.case4.haroldTrust,1);
  s=chooseHaroldDialogue(s,"reassure");
  assert.equal(s.case4.haroldTrust,1);
  s=chooseHaroldDialogue(s,"accuse");
  assert.equal(s.case4.haroldTrust,-1);
  s=chooseHaroldDialogue(s,"close");
  assert.equal(s.case4.dialogue,null);
  assert.equal(s.case4.haroldAsked.length,5);
});
test("the family portrait sequence unlocks a concealed black K chip and rejects guesses",()=>{
  let s=enterManor(reachManor());
  s=searchEleanorRoom(s);
  s=step(s,"GO","studydoor");
  s=step(s,"LOOK","portrait");
  assert.equal(PORTRAIT_OPTIONS.length,4);
  assert.equal(visibleTargets(s).some(([id])=>id==="chip"),false);
  s=choosePortrait(s,"webb");
  assert.deepEqual(s.case4.portraitSequence,[]);
  s=choosePortrait(s,"harold");
  s=choosePortrait(s,"webb");
  assert.deepEqual(s.case4.portraitSequence,["harold","webb"]);
  s=choosePortrait(s,"eleanor");
  assert.equal(s.case4.portraitUnlocked,true);
  assert.ok(visibleTargets(s).some(([id])=>id==="chip"));
  s=step(s,"TAKE","chip");
  assert.ok(s.inventory.includes("black-k-chip"));
  assert.ok(s.clues.includes("black-k-symbol"));
  const old=s.inventory.length;
  s=step(s,"TAKE","chip");
  assert.equal(s.inventory.length,old);
});
test("Vera appears after evidence and Harold's interview, not before",()=>{
  let s=enterManor(reachManor());
  s=searchEleanorRoom(s);
  s=revealBlackChip(s);
  assert.equal(s.case4.veraAppeared,false);
  s=step(s,"GO","foyerdoor");
  s=step(s,"TALK","harold");
  s=chooseHaroldDialogue(s,"eleanor");
  assert.equal(s.case4.veraAppeared,true);
  s=step(s,"GO","studydoor");
  assert.ok(visibleTargets(s).some(([id])=>id==="vera"));
  s=step(s,"TALK","vera");
  assert.equal(s.case4.dialogue,"vera");
  assert.equal(VERA_OPTIONS.length,3);
  s=chooseVeraDecision(s,"close");
  assert.equal(s.status,"playing");
  assert.equal(s.case4.dialogue,null);
});
test("open confrontation and private questioning produce different canonical trust flags",()=>{
  let s=enterManor(reachManor());
  s=step(s,"TALK","harold");
  s=chooseHaroldDialogue(s,"reassure");
  s=chooseHaroldDialogue(s,"close");
  s=searchEleanorRoom(s);
  s=revealBlackChip(s);
  assert.equal(s.case4.veraAppeared,true);
  s=step(s,"TALK","vera");
  let publicChoice=chooseVeraDecision(s,"confront");
  let privateChoice=chooseVeraDecision(s,"private");
  assert.equal(publicChoice.status,"chapter4complete");
  assert.equal(privateChoice.status,"chapter4complete");
  assert.equal(publicChoice.case4.decision,"confront");
  assert.equal(privateChoice.case4.decision,"private");
  assert.equal(publicChoice.case4.veraTrust,-1);
  assert.equal(privateChoice.case4.veraTrust,1);
  assert.ok(publicChoice.clues.includes("public-confrontation"));
  assert.ok(privateChoice.clues.includes("private-confrontation"));
  assert.deepEqual(publicChoice.inventory,s.inventory);
  assert.equal(step(publicChoice,"GO","foyerdoor").status,"chapter4complete");
});
test("all v1-v3 exports remain importable, and v4 Manor state round-trips",()=>{
  let s=enterManor(reachManor());
  s=step(s,"TALK","harold");
  s=chooseHaroldDialogue(s,"accuse");
  s=chooseHaroldDialogue(s,"close");
  s=searchEleanorRoom(s);
  s=step(s,"GO","studydoor");
  s=step(s,"LOOK","portrait");
  s=choosePortrait(s,"harold");
  const restored=validateSave(JSON.parse(JSON.stringify(s)));
  assert.equal(restored.version,SAVE_VERSION);
  assert.equal(restored.chapter,4);
  assert.deepEqual(restored.case4.portraitSequence,["harold"]);
  assert.ok(restored.inventory.includes("manor-diary"));
  assert.equal(restored.case4.haroldTrust,-2);
  assert.equal(restored.case3.boardSolved,true,"Chapter 3 evidence-board state survives Chapter 4 import");
  for(const version of [1,2,3]){
    const legacy={...initialState(),version};
    delete legacy.case4;delete legacy.case3;
    const imported=validateSave(legacy);
    assert.equal(imported.version,SAVE_VERSION);
    assert.equal(imported.chapter,1);
  }
});
test("manor save sanitizer rejects malformed nameplates and clamps bad trust values",()=>{
  const s=enterManor(reachManor());
  s.case4.haroldTrust=999;
  s.case4.veraTrust=-999;
  s.case4.portraitSequence=["webb","harold","eleanor"];
  s.case4.haroldAsked=["accuse","bad","accuse","webb"];
  const restored=validateSave(s);
  assert.equal(restored.case4.haroldTrust,3);
  assert.equal(restored.case4.veraTrust,-3);
  assert.deepEqual(restored.case4.portraitSequence,[]);
  assert.deepEqual(restored.case4.haroldAsked,["accuse","webb"]);
});

function reachWarehouse(manorDecision="private"){
  let s=enterManor(reachManor());
  s=step(s,"TALK","harold");
  s=chooseHaroldDialogue(s,"reassure");
  s=chooseHaroldDialogue(s,"close");
  s=searchEleanorRoom(s);
  s=revealBlackChip(s);
  s=step(s,"TALK","vera");
  s=chooseVeraDecision(s,manorDecision);
  assert.equal(s.status,"chapter4complete");
  s=continueWarehouseCase(s);
  assert.equal(s.room,"dockGate");
  assert.equal(s.chapter,5);
  return s;
}
function reachBay(manorDecision){
  let s=reachWarehouse(manorDecision);
  s=step(s,"TALK","watchman");
  assert.equal(s.case5.access,true);
  s=step(s,"GO","gate");
  assert.equal(s.room,"loadingBay");
  return s;
}
function collectManifest(s){
  s=step(s,"GO","office");
  s=step(s,"OPEN","cabinet");
  s=step(s,"TAKE","manifest");
  assert.ok(s.inventory.includes("freight-manifest"));
  s=step(s,"GO","door");
  return s;
}
function openFreight(s){
  s=collectManifest(s);
  s=step(s,"OPEN","container");
  for(let i=0;i<3;i++)for(let j=0;j<[4,1,7][i];j++)s=adjustFreightSeal(s,i,1);
  s=submitFreightSeal(s);
  assert.equal(s.case5.sealOpen,true);
  s=step(s,"GO","container");
  assert.equal(s.room,"containerHold");
  return s;
}
test("completed manor chapter continues into docks without losing previous case data",()=>{
  let s=reachWarehouse();
  assert.equal(s.status,"playing");
  assert.equal(s.case5.watchmanTrust,1);
  assert.ok(s.inventory.includes("black-k-chip"));
  assert.equal(s.case4.decision,"private");
  assert.equal(s.case3.boardSolved,true);
  assert.equal(continueWarehouseCase(s).room,"dockGate");
});
test("public confrontation at manor makes the dock watchman initially wary",()=>{
  const s=reachWarehouse("confront");
  assert.equal(s.case5.watchmanTrust,-1);
  assert.equal(s.case4.decision,"confront");
});
test("gate access requires black K proof, and watchman choices have persistent effects",()=>{
  let s=reachWarehouse();
  s.inventory=s.inventory.filter(x=>x!=="black-k-chip");
  s=step(s,"GO","gate");
  assert.equal(s.room,"dockGate");
  s=step(s,"TALK","watchman");
  assert.equal(s.case5.access,false);
  s.inventory.push("black-k-chip");
  s=step(s,"TALK","watchman");
  assert.equal(s.case5.access,true);
  assert.equal(WATCHMAN_OPTIONS.length,4);
  s=chooseWatchman(s,"kingfisher");
  assert.ok(s.clues.includes("watchman-tip"));
  s=chooseWatchman(s,"promise");
  const trust=s.case5.watchmanTrust;
  s=chooseWatchman(s,"promise");
  assert.equal(s.case5.watchmanTrust,trust,"dialogue rapport cannot be farmed");
  s=chooseWatchman(s,"threaten");
  assert.equal(s.case5.watchmanTrust,trust-2);
  s=chooseWatchman(s,"close");
  assert.equal(s.case5.dialogue,null);
  s=step(s,"GO","gate");
  assert.equal(s.room,"loadingBay");
});
test("office manifest becomes accessible only after opening the locked cabinet",()=>{
  let s=reachBay();
  s=step(s,"GO","office");
  assert.equal(visibleTargets(s).some(([id])=>id==="manifest"),false);
  s=step(s,"TAKE","manifest");
  assert.ok(!s.inventory.includes("freight-manifest"));
  s=step(s,"OPEN","cabinet");
  assert.equal(visibleTargets(s).some(([id])=>id==="manifest"),true);
  s=step(s,"TAKE","manifest");
  assert.ok(s.inventory.includes("freight-manifest"));
  assert.ok(s.clues.includes("warehouse-shipment"));
  s=step(s,"TALK","radio");
  assert.ok(s.clues.includes("protected-barge"));
});
test("freight combination 417 is clue-gated; bad digits cannot unlock container",()=>{
  let s=reachBay();
  s=step(s,"OPEN","container");
  assert.equal(s.case5.sealPanel,true);
  s=adjustFreightSeal(s,0,4);
  assert.deepEqual(s.case5.sealDigits,[0,0,0],"invalid dial jumps ignored");
  s=adjustFreightSeal(s,0,-1);
  assert.equal(s.case5.sealDigits[0],9);
  s=submitFreightSeal(s);
  assert.equal(s.case5.sealOpen,false,"manifest required");
  s=collectManifest(s);
  s=step(s,"OPEN","container");
  for(let i=0;i<3;i++)for(let j=0;j<[5,1,7][i];j++)s=adjustFreightSeal(s,i,1);
  s=submitFreightSeal(s);
  assert.equal(s.case5.sealOpen,false);
  s=adjustFreightSeal(s,0,-1);
  s=submitFreightSeal(s);
  assert.equal(s.case5.sealOpen,true);
  assert.ok(s.clues.includes("warehouse-opened"));
  s=step(s,"GO","container");
  assert.equal(s.room,"containerHold");
});
test("wire recording, passenger roster and burned photograph all persist",()=>{
  let s=openFreight(reachBay());
  assert.ok(visibleTargets(s).some(([id])=>id==="recorder"));
  s=step(s,"TAKE","recorder");
  s=step(s,"TAKE","roster");
  s=step(s,"OPEN","crate");
  s=step(s,"TAKE","photo");
  assert.ok(s.inventory.includes("wire-recording"));
  assert.ok(s.inventory.includes("transfer-roster"));
  assert.ok(s.inventory.includes("burned-photo"));
  assert.ok(s.memories.includes("warehouse-voice"));
  assert.ok(s.clues.includes("barge-photo"));
});
test("witness choice requires recorder and roster before closing fifth chapter",()=>{
  let s=openFreight(reachBay());
  s=step(s,"GO","tunnel");
  assert.equal(s.case5.tunnelPanel,true);
  s=chooseTunnel(s,"protect");
  assert.equal(s.status,"playing");
  s=step(s,"TAKE","recorder");
  s=chooseTunnel(s,"expose");
  assert.equal(s.status,"playing","missing roster prevents early completion");
  s=step(s,"TAKE","roster");
  assert.equal(TUNNEL_OPTIONS.length,3);
  const shield=chooseTunnel(s,"protect"),expose=chooseTunnel(s,"expose");
  assert.equal(shield.status,"chapter5complete");
  assert.equal(expose.status,"chapter5complete");
  assert.equal(shield.case5.decision,"protect");
  assert.equal(expose.case5.decision,"expose");
  assert.ok(shield.clues.includes("protected-witness"));
  assert.ok(expose.clues.includes("public-record"));
  assert.equal(step(shield,"GO","door").status,"chapter5complete");
});
test("v1–v4 case files still migrate, v5 saves retain prior trust and warehouse puzzles",()=>{
  let s=reachBay();
  s=collectManifest(s);
  s=step(s,"OPEN","container");
  s=adjustFreightSeal(s,0,1);
  const restored=validateSave(JSON.parse(JSON.stringify(s)));
  assert.equal(restored.version,SAVE_VERSION);
  assert.equal(restored.chapter,5);
  assert.equal(restored.case5.sealDigits[0],1);
  assert.equal(restored.case4.decision,"private");
  assert.equal(restored.case3.boardSolved,true);
  assert.ok(restored.inventory.includes("freight-manifest"));
  for(const version of [1,2,3,4]){
    const legacy={...initialState(),version};
    delete legacy.case5;
    const migrated=validateSave(legacy);
    assert.equal(migrated.version,SAVE_VERSION);
    assert.equal(migrated.chapter,1);
  }
});
test("malformed dock state cannot inject trust, stale dialogue, or invalid combination",()=>{
  const s=reachBay();
  s.case5.sealDigits=[99,-4,"7"];
  s.case5.watchmanTrust=500;
  s.case5.watchmanAsked=["bad","promise","promise","threaten"];
  s.case5.decision="hack";
  const restored=validateSave(s);
  assert.deepEqual(restored.case5.sealDigits,[0,0,0]);
  assert.equal(restored.case5.watchmanTrust,3);
  assert.deepEqual(restored.case5.watchmanAsked,["promise","threaten"]);
  assert.equal(restored.case5.decision,"");
});
