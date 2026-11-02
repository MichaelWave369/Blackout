import test from "node:test";
import assert from "node:assert/strict";
import {
  initialState, act, chooseEvidence, setStoryMode, validateSave, visibleTargets, SAVE_VERSION,
  continueCase, continueAgencyCase, continueManorCase, continueWarehouseCase, continueRailCase, continueExchangeCase, continueBlueCase, chooseDialogue, TOMMY_OPTIONS
} from "../src/engine.js";
import { adjustAgencyDial, submitAgencySafe, collectAgencyFile, agencyBoardChoice, BOARD_OPTIONS } from "../src/chapter3.js";
import { HAROLD_OPTIONS, VERA_OPTIONS, PORTRAIT_OPTIONS, chooseHaroldDialogue, choosePortrait, chooseVeraDecision } from "../src/chapter4.js";
import { WATCHMAN_OPTIONS, TUNNEL_OPTIONS, chooseWatchman, adjustFreightSeal, submitFreightSeal, chooseTunnel } from "../src/chapter5.js";
import { ELSIE_OPTIONS, SWITCH_OPTIONS, EXIT_OPTIONS, chooseElsie, chooseSignal, chooseExchange } from "../src/chapter6.js";
import { MARA_OPTIONS, BOARD_OPTIONS as EXCHANGE_BOARD_OPTIONS, COURIER_OPTIONS, chooseMara, chooseReconciliation, chooseCourier } from "../src/chapter7.js";
import { COURIER_OPTIONS as BLUE_COURIER_OPTIONS, SPLICE_OPTIONS, FINALE_OPTIONS, chooseBlueCourier, chooseSplice, chooseBlueFinale } from "../src/chapter8.js";
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
  for(let i=0;i<3;i++)for(let j=0;j<[6,1,7][i];j++)s=adjustFreightSeal(s,i,1);
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

function reachRails(choice="protect"){
  let s=openFreight(reachBay());
  s=step(s,"TAKE","recorder");
  s=step(s,"TAKE","roster");
  s=step(s,"GO","tunnel");
  s=chooseTunnel(s,choice);
  assert.equal(s.status,"chapter5complete");
  s=continueRailCase(s);
  assert.equal(s.chapter,6);
  assert.equal(s.room,"railTunnel");
  return s;
}
function meetElsie(s){
  s=step(s,"GO","platform");
  assert.equal(s.room,"railPlatform");
  s=step(s,"TALK","elsie");
  assert.equal(s.case6.dialogue,"elsie");
  return s;
}
function readySignal(s){
  s=meetElsie(s);
  if(s.case6.elsieTrust<0)s=chooseElsie(s,"show-proof");
  s=chooseElsie(s,"ask");
  assert.ok(s.inventory.includes("rail-master-key"));
  s=step(s,"GO","tunnel");
  s=step(s,"GO","cabin");
  s=step(s,"TAKE","timetable");
  s=step(s,"OPEN","board");
  assert.equal(s.case6.switchPanel,true);
  return s;
}
function boardSolved(s){
  s=readySignal(s);
  for(const k of ["C","A","B"])s=chooseSignal(s,k);
  assert.equal(s.case6.signalsAligned,true);
  s=step(s,"GO","exit");
  s=step(s,"GO","platform");
  s=step(s,"GO","train");
  assert.equal(s.room,"ghostTrain");
  return s;
}
test("fifth chapter's final witness choice influences Elsie's initial trust",()=>{
  const protect=reachRails("protect");
  const expose=reachRails("expose");
  assert.equal(protect.case6.elsieTrust,1);
  assert.equal(expose.case6.elsieTrust,-1);
  assert.equal(protect.case5.decision,"protect");
  assert.equal(expose.case5.decision,"expose");
  assert.equal(protect.case4.decision,"private");
  assert.equal(protect.case3.boardSolved,true);
  assert.equal(continueRailCase(protect).room,"railTunnel");
});
test("platform, signal cabin, and tunnel are independently navigable",()=>{
  let s=reachRails();
  const tunnelTargets=visibleTargets(s).map(([id])=>id);
  assert.ok(tunnelTargets.includes("cabin")&&tunnelTargets.includes("platform"));
  s=step(s,"GO","cabin");assert.equal(s.room,"signalCabin");
  assert.ok(visibleTargets(s).some(([id])=>id==="board"));
  s=step(s,"GO","exit");assert.equal(s.room,"railTunnel");
  s=step(s,"GO","platform");assert.equal(s.room,"railPlatform");
  s=step(s,"GO","train");
  assert.equal(s.room,"railPlatform","train inaccessible until route restored");
});
test("Elsie requires evidence and trust, but a hostile player can recover",()=>{
  let s=meetElsie(reachRails("expose"));
  assert.equal(ELSIE_OPTIONS.length,5);
  s=chooseElsie(s,"ask");
  assert.equal(s.case6.keyGranted,false);
  s=chooseElsie(s,"accuse");
  assert.equal(s.case6.elsieTrust,-3);
  s=chooseElsie(s,"reassure");
  assert.equal(s.case6.elsieTrust,-1);
  s=chooseElsie(s,"show-proof");
  assert.equal(s.case6.elsieTrust,0);
  assert.ok(s.clues.includes("elsie-hears-eleanor"));
  s=chooseElsie(s,"ask");
  assert.equal(s.case6.keyGranted,true);
  assert.ok(s.inventory.includes("rail-master-key"));
  const n=s.inventory.length;
  s=chooseElsie(s,"ask");
  assert.equal(s.inventory.length,n,"master key cannot be farmed");
});
test("signal board cannot be opened until key and dispatch timetable collected",()=>{
  let s=reachRails();
  s=step(s,"GO","cabin");
  s=step(s,"OPEN","board");
  assert.equal(s.case6.switchPanel,false);
  s=step(s,"TAKE","timetable");
  assert.ok(s.clues.includes("car09-transfer"));
  s=step(s,"OPEN","board");
  assert.equal(s.case6.switchPanel,false);
  s=step(s,"GO","exit");
  s=meetElsie(s);
  s=chooseElsie(s,"ask");
  s=step(s,"GO","tunnel");
  s=step(s,"GO","cabin");
  s=step(s,"OPEN","board");
  assert.equal(s.case6.switchPanel,true);
});
test("incorrect switch order resets and correct C-A-B route unlocks Car 09",()=>{
  let s=readySignal(reachRails());
  assert.equal(SWITCH_OPTIONS.length,4);
  s=chooseSignal(s,"A");
  assert.deepEqual(s.case6.switchSequence,[]);
  s=chooseSignal(s,"C");
  assert.deepEqual(s.case6.switchSequence,["C"]);
  s=chooseSignal(s,"B");
  assert.deepEqual(s.case6.switchSequence,[]);
  s=chooseSignal(s,"C");
  s=chooseSignal(s,"A");
  s=chooseSignal(s,"B");
  assert.equal(s.case6.signalsAligned,true);
  assert.deepEqual(s.case6.switchSequence,["C","A","B"]);
  assert.ok(s.clues.includes("rail-route-open"));
  s=step(s,"GO","exit");
  s=step(s,"GO","platform");
  s=step(s,"GO","train");
  assert.equal(s.room,"ghostTrain");
});
test("Car 09 has evidence-gated one-way ticket, lockbox and memory",()=>{
  let s=boardSolved(reachRails());
  assert.equal(visibleTargets(s).some(([id])=>id==="ledger"),false);
  s=step(s,"TAKE","ticket");
  assert.ok(s.inventory.includes("eleanor-ticket"));
  assert.ok(s.memories.includes("car09-memory"));
  s=step(s,"OPEN","case");
  assert.equal(visibleTargets(s).some(([id])=>id==="ledger"),true);
  s=step(s,"TAKE","ledger");
  assert.ok(s.inventory.includes("kingfisher-ledger"));
  assert.ok(s.clues.includes("kingfisher-account"));
  s=step(s,"TAKE","badge");
  assert.ok(s.inventory.includes("car09-badge"));
});
test("Exchange choice requires both ticket and ledger, with distinct endings",()=>{
  let s=boardSolved(reachRails());
  s=step(s,"GO","hatch");assert.equal(s.case6.exitPanel,true);
  s=chooseExchange(s,"warn");assert.equal(s.status,"playing");
  s=step(s,"TAKE","ticket");
  s=chooseExchange(s,"silent");assert.equal(s.status,"playing");
  s=step(s,"OPEN","case");
  s=step(s,"TAKE","ledger");
  assert.equal(EXIT_OPTIONS.length,3);
  const warn=chooseExchange(s,"warn"),silent=chooseExchange(s,"silent");
  assert.equal(warn.status,"chapter6complete");
  assert.equal(silent.status,"chapter6complete");
  assert.equal(warn.case6.decision,"warn");
  assert.equal(silent.case6.decision,"silent");
  assert.ok(warn.clues.includes("vera-alert"));
  assert.ok(silent.clues.includes("solo-exchange"));
  assert.equal(step(warn,"GO","hatch").status,"chapter6complete");
});
test("v6 saves retain prior evidence, Elsie's interview and partial signal sequence",()=>{
  let s=readySignal(reachRails("expose"));
  s=chooseSignal(s,"C");
  const old=validateSave(JSON.parse(JSON.stringify(s)));
  assert.equal(old.version,SAVE_VERSION);
  assert.equal(old.chapter,6);
  assert.deepEqual(old.case6.switchSequence,["C"]);
  assert.equal(old.case5.decision,"expose");
  assert.equal(old.case4.decision,"private");
  assert.equal(old.case3.boardSolved,true);
  assert.ok(old.inventory.includes("wire-recording"));
  for(const version of [1,2,3,4,5]){
    const oldSave={...initialState(),version};
    delete oldSave.case6;
    const imported=validateSave(oldSave);
    assert.equal(imported.version,SAVE_VERSION);
    assert.equal(imported.chapter,1);
  }
});
test("malformed rail import cannot inject a bad sequence, trust, or ending",()=>{
  let s=meetElsie(reachRails());
  s.case6.switchSequence=["B","C","A"];
  s.case6.elsieTrust=500;
  s.case6.elsieAsked=["unknown","ask","ask","reassure"];
  s.case6.decision="script-injection";
  const normalized=validateSave(s);
  assert.deepEqual(normalized.case6.switchSequence,[]);
  assert.equal(normalized.case6.elsieTrust,3);
  assert.deepEqual(normalized.case6.elsieAsked,["ask","reassure"]);
  assert.equal(normalized.case6.decision,"");
});

function reachExchange(choice="warn"){
 let s=boardSolved(reachRails());
 s=step(s,"TAKE","ticket");
 s=step(s,"OPEN","case");
 s=step(s,"TAKE","ledger");
 s=step(s,"GO","hatch");
 s=chooseExchange(s,choice);
 assert.equal(s.status,"chapter6complete");
 s=continueExchangeCase(s);
 assert.equal(s.chapter,7);
 assert.equal(s.room,"exchangeLanding");
 return s;
}
function enterExchange(s){
 s=step(s,"GO","entrance");
 assert.equal(s.room,"exchangeHall");
 return s;
}
function interviewMara(s){
 s=step(s,"TALK","mara");
 assert.equal(s.case7.dialogue,"mara");
 s=chooseMara(s,"ticket");
 assert.equal(s.case7.vaultKey,true);
 assert.ok(s.inventory.includes("exchange-key"));
 s=chooseMara(s,"close");
 return s;
}
function collectExchangeRecords(s){
 s=step(s,"GO","telegraph");
 assert.equal(s.room,"wireRoom");
 assert.equal(visibleTargets(s).some(([id])=>id==="carbon"),false);
 s=step(s,"OPEN","cabinet");
 s=step(s,"TAKE","carbon");
 s=step(s,"TAKE","roster");
 assert.ok(s.inventory.includes("exchange-carbon"));
 assert.ok(s.inventory.includes("exchange-roster"));
 s=step(s,"LOOK","machine");
 assert.ok(s.clues.includes("exchange-blue-door"));
 s=step(s,"GO","door");
 return s;
}
function inExchangeVault(choice="warn"){
 let s=interviewMara(enterExchange(reachExchange(choice)));
 s=collectExchangeRecords(s);
 s=step(s,"GO","vault");
 assert.equal(s.room,"exchangeVault");
 return s;
}
function reconcileExchange(s){
 s=step(s,"TAKE","seal");
 s=step(s,"OPEN","board");
 assert.equal(EXCHANGE_BOARD_OPTIONS.length,4);
 for(const option of ["dock","train","money"])s=chooseReconciliation(s,option);
 assert.equal(s.case7.boardSolved,true);
 s=step(s,"TAKE","contract");
 assert.ok(s.inventory.includes("webb-contract"));
 return s;
}
test("Chapter 6 conclusion continues into the Exchange with case history intact",()=>{
 let s=reachExchange("warn");
 assert.equal(s.case7.veraWarned,true);
 assert.equal(s.case7.maraTrust,1);
 assert.equal(s.case6.decision,"warn");
 assert.equal(s.case5.decision,"protect");
 assert.equal(s.case4.decision,"private");
 assert.equal(s.case3.boardSolved,true);
 assert.ok(s.inventory.includes("kingfisher-ledger"));
 assert.equal(continueExchangeCase(s).room,"exchangeLanding");
});
test("Vera warning changes initial Exchange clue and Mara's expectations",()=>{
 let warned=reachExchange("warn"),silent=reachExchange("silent");
 assert.equal(warned.case7.veraWarned,true);
 assert.equal(silent.case7.veraWarned,false);
 assert.equal(visibleTargets(warned).some(([id])=>id==="note"),true);
 assert.equal(visibleTargets(silent).some(([id])=>id==="note"),false);
 warned=step(warned,"LOOK","note");
 assert.ok(warned.clues.includes("vera-message"));
 assert.equal(visibleTargets(warned).some(([id])=>id==="note"),false);
 assert.equal(silent.case7.maraTrust,0);
});
test("Mara controls the vault key and hostile interrogation has a recovery path",()=>{
 let s=enterExchange(reachExchange("silent"));
 s=step(s,"GO","vault");
 assert.equal(s.room,"exchangeHall","vault access must be granted");
 s=step(s,"TALK","mara");
 assert.equal(MARA_OPTIONS.length,6);
 s=chooseMara(s,"accuse");
 assert.equal(s.case7.maraTrust,-2);
 s=chooseMara(s,"ticket");
 assert.equal(s.case7.vaultKey,false);
 s=chooseMara(s,"recording");
 assert.equal(s.case7.maraTrust,0);
 assert.ok(s.clues.includes("mara-hears-voice"));
 s=chooseMara(s,"ticket");
 assert.equal(s.case7.vaultKey,true);
 assert.ok(s.clues.includes("mara-testimony"));
 const n=s.inventory.length;
 s=chooseMara(s,"ticket");
 assert.equal(s.inventory.length,n);
 s=chooseMara(s,"close");
 assert.equal(s.case7.dialogue,null);
 s=step(s,"GO","vault");
 assert.equal(s.room,"exchangeVault");
});
test("Telegraph records are cabinet gated and corroborate existing dock and train evidence",()=>{
 let s=interviewMara(enterExchange(reachExchange()));
 assert.equal(visibleTargets(s).some(([id])=>id==="vault"),true);
 s=collectExchangeRecords(s);
 assert.ok(s.clues.includes("exchange-freight"));
 assert.ok(s.clues.includes("exchange-transfer"));
 assert.ok(s.clues.includes("exchange-blue-door"));
 assert.ok(s.inventory.includes("freight-manifest"));
 assert.ok(s.inventory.includes("eleanor-ticket"));
});
test("Exchange reconciliation requires all three independent original record pairs",()=>{
 let s=interviewMara(enterExchange(reachExchange()));
 s=step(s,"GO","vault");
 s=step(s,"OPEN","board");
 s=chooseReconciliation(s,"dock");
 assert.equal(s.case7.boardLinks.length,0,"carbon required");
 s=chooseReconciliation(s,"train");
 assert.equal(s.case7.boardLinks.length,0,"duplicate roster required");
 s=chooseReconciliation(s,"money");
 assert.equal(s.case7.boardLinks.length,0,"Exchange seal required");
 s=step(s,"TAKE","seal");
 s=step(s,"OPEN","board");
 s=chooseReconciliation(s,"money");
 assert.deepEqual(s.case7.boardLinks,["money"]);
 s=step(s,"GO","exit");
 s=collectExchangeRecords(s);
 s=step(s,"GO","vault");
 s=step(s,"OPEN","board");
 s=chooseReconciliation(s,"dock");
 s=chooseReconciliation(s,"train");
 assert.equal(s.case7.boardSolved,true);
 assert.ok(visibleTargets(s).some(([id])=>id==="contract"));
 s=step(s,"TAKE","contract");
 assert.ok(s.clues.includes("webb-signature"));
 assert.ok(s.memories.includes("blue-door-flash"));
 assert.ok(s.case7.courierReady);
});
test("Courier finale has two distinct persistent outcomes, while Kingfisher remains anonymous",()=>{
 let s=reconcileExchange(inExchangeVault());
 s=step(s,"TALK","courier");
 assert.equal(s.case7.dialogue,"courier");
 assert.equal(COURIER_OPTIONS.length,3);
 const follow=chooseCourier(s,"follow");
 const secure=chooseCourier(s,"secure");
 assert.equal(follow.status,"chapter7complete");
 assert.equal(secure.status,"chapter7complete");
 assert.equal(follow.case7.choice,"follow");
 assert.equal(secure.case7.choice,"secure");
 assert.ok(follow.clues.includes("courier-trail"));
 assert.ok(secure.clues.includes("contract-secured"));
 assert.ok(follow.transcript.some(x=>x.text.includes("Kingfisher's identity remains hidden")));
 assert.equal(step(follow,"GO","exit").status,"chapter7complete");
});
test("premature courier choice and duplicate signed contract do not bypass proof",()=>{
 let s=inExchangeVault();
 assert.equal(visibleTargets(s).some(([id])=>id==="courier"),false);
 assert.equal(visibleTargets(s).some(([id])=>id==="contract"),false);
 s=step(s,"TALK","courier");
 assert.equal(s.status,"playing");
 s=reconcileExchange(s);
 const count=s.inventory.length;
 s=step(s,"TAKE","contract");
 assert.equal(s.inventory.length,count);
});
test("v7 import preserves all six older case snapshots and Exchange reconciliation",()=>{
 let s=inExchangeVault("silent");
 s=step(s,"TAKE","seal");
 s=step(s,"OPEN","board");
 s=chooseReconciliation(s,"money");
 const loaded=validateSave(JSON.parse(JSON.stringify(s)));
 assert.equal(loaded.version,SAVE_VERSION);
 assert.equal(loaded.chapter,7);
 assert.deepEqual(loaded.case7.boardLinks,["money"]);
 assert.equal(loaded.case6.decision,"silent");
 assert.equal(loaded.case5.decision,"protect");
 assert.equal(loaded.case4.decision,"private");
 assert.ok(loaded.inventory.includes("exchange-seal"));
 for(const version of [1,2,3,4,5,6]){
  const legacy={...initialState(),version};
  delete legacy.case7;
  const migrated=validateSave(legacy);
  assert.equal(migrated.version,SAVE_VERSION);
  assert.equal(migrated.chapter,1);
 }
});
test("malformed Exchange import sanitizes trust, board links, dialogue and choice",()=>{
 const s=inExchangeVault();
 s.case7.maraTrust=1000;
 s.case7.maraAsked=["ticket","unknown","ticket","protect"];
 s.case7.boardLinks=["money","hack","money","dock"];
 s.case7.boardSolved=true;
 s.case7.choice="hacked";
 s.case7.dialogue="injected";
 const v=validateSave(s);
 assert.equal(v.case7.maraTrust,3);
 assert.deepEqual(v.case7.maraAsked,["ticket","protect"]);
 assert.deepEqual(v.case7.boardLinks,["money","dock"]);
 assert.equal(v.case7.boardSolved,false);
 assert.equal(v.case7.choice,"");
 assert.equal(v.case7.dialogue,null);
});

function reachBlue(choice="follow"){
 let s=reconcileExchange(inExchangeVault());
 s=step(s,"TALK","courier");
 s=chooseCourier(s,choice);
 assert.equal(s.status,"chapter7complete");
 s=continueBlueCase(s);
 assert.equal(s.chapter,8);
 assert.equal(s.room,"bluePassage");
 return s;
}
function reachProjection(s){
 s=step(s,"GO","switchroom");
 assert.equal(s.room,"switchOffice");
 s=step(s,"OPEN","cabinet");
 s=step(s,"TAKE","plate");
 s=step(s,"LOOK","log");
 assert.ok(s.inventory.includes("marmont-plate"));
 s=step(s,"GO","exit");
 s=step(s,"GO","screening");
 assert.equal(s.room,"screeningRoom");
 for(const id of ["hotel","witness","funds"])s=step(s,"TAKE",id);
 assert.equal(s.case8.filmTaken.length,3);
 s=step(s,"OPEN","projector");
 assert.equal(s.case8.splicePanel,true);
 return s;
}
function openBlueDoor(s){
 s=reachProjection(s);
 for(const id of ["hotel","witness","funds"])s=chooseSplice(s,id);
 assert.equal(s.case8.reelSolved,true);
 s=step(s,"GO","exit");
 s=step(s,"GO","blueDoor");
 assert.equal(s.room,"blueChamber");
 return s;
}
test("The Blue Door continues Chapter 7 without losing all previous investigations",()=>{
 const follow=reachBlue("follow"),secure=reachBlue("secure");
 assert.equal(follow.case8.priorChoice,"follow");
 assert.equal(secure.case8.priorChoice,"secure");
 assert.equal(follow.case8.courierTrust,1);
 assert.equal(secure.case8.courierTrust,0);
 assert.equal(follow.case7.choice,"follow");
 assert.equal(secure.case7.choice,"secure");
 assert.equal(follow.case6.decision,"warn");
 assert.equal(follow.case3.boardSolved,true);
 assert.ok(follow.inventory.includes("webb-contract"));
 assert.equal(continueBlueCase(follow).room,"bluePassage");
});
test("The courier reacts to earlier decision and gives evidence without revealing Kingfisher",()=>{
 let s=reachBlue("secure");
 s=step(s,"TALK","courier");
 assert.equal(BLUE_COURIER_OPTIONS.length,4);
 s=chooseBlueCourier(s,"show");
 assert.ok(s.clues.includes("courier-webb"));
 s=chooseBlueCourier(s,"ask");
 assert.ok(s.clues.includes("courier-cameras"));
 s=chooseBlueCourier(s,"compassion");
 assert.equal(s.case8.courierTrust,1);
 const n=s.clues.length;
 s=chooseBlueCourier(s,"ask");
 assert.equal(s.clues.length,n,"cannot farm testimony");
 assert.equal(s.case8.courierAsked.length,3);
 s=chooseBlueCourier(s,"close");
 assert.equal(s.case8.dialogue,null);
});
test("switching office hides Marmont plate and pre-murder surveillance request",()=>{
 let s=step(reachBlue(),"GO","switchroom");
 assert.equal(s.room,"switchOffice");
 assert.equal(visibleTargets(s).some(([id])=>id==="plate"),false);
 s=step(s,"TAKE","plate");
 assert.equal(s.case8.plateTaken,false);
 s=step(s,"OPEN","cabinet");
 assert.equal(visibleTargets(s).some(([id])=>id==="plate"),true);
 s=step(s,"TAKE","plate");
 s=step(s,"LOOK","log");
 assert.ok(s.inventory.includes("marmont-plate"));
 assert.ok(s.clues.includes("hotel-surveillance-order"));
 assert.ok(s.clues.includes("marmont-camera"));
});
test("projection film requires all originals, wrong splice order rewinds, correct one unlocks door",()=>{
 let s=step(reachBlue(),"GO","screening");
 s=step(s,"OPEN","projector");
 assert.equal(s.case8.splicePanel,false);
 s=step(s,"TAKE","hotel");
 s=step(s,"TAKE","witness");
 s=step(s,"TAKE","funds");
 s=step(s,"OPEN","projector");
 assert.equal(s.case8.splicePanel,false,"glass plate required");
 s=step(s,"GO","exit");
 s=step(s,"GO","switchroom");
 s=step(s,"OPEN","cabinet");
 s=step(s,"TAKE","plate");
 s=step(s,"GO","exit");
 s=step(s,"GO","screening");
 s=step(s,"OPEN","splice");
 assert.equal(SPLICE_OPTIONS.length,4);
 s=chooseSplice(s,"funds");
 assert.deepEqual(s.case8.spliceOrder,[]);
 s=chooseSplice(s,"hotel");
 assert.deepEqual(s.case8.spliceOrder,["hotel"]);
 s=chooseSplice(s,"funds");
 assert.deepEqual(s.case8.spliceOrder,[]);
 s=chooseSplice(s,"hotel");
 s=chooseSplice(s,"witness");
 s=chooseSplice(s,"funds");
 assert.equal(s.case8.reelSolved,true);
 assert.ok(s.clues.includes("marmont-reconstruction"));
 s=step(s,"GO","exit");
 s=step(s,"GO","blueDoor");
 assert.equal(s.room,"blueChamber");
});
test("The Blue Door stays locked until the film has been rebuilt",()=>{
 let s=reachBlue();
 s=step(s,"GO","blueDoor");
 assert.equal(s.room,"bluePassage");
 s=step(s,"LOOK","blueDoor");
 assert.ok(s.transcript.at(-1).text.includes("electric deadbolt"));
});
test("Blue Chamber original film, letter and memory must be recovered before ending",()=>{
 let s=openBlueDoor(reachBlue());
 s=step(s,"TALK","telephone");
 assert.equal(s.case8.finalePanel,false);
 s=step(s,"TAKE","negative");
 assert.ok(s.inventory.includes("original-negative"));
 assert.ok(s.memories.includes("marmont-camera-memory"));
 s=step(s,"TALK","telephone");
 assert.equal(s.case8.finalePanel,false);
 s=step(s,"TAKE","letter");
 assert.ok(s.clues.includes("signed-versus-ordered"));
 s=step(s,"LOOK","clock");
 s=step(s,"LOOK","symbol");
 assert.ok(s.clues.includes("tampered-time"));
 assert.ok(s.clues.includes("silhouette-emblem"));
 s=step(s,"TALK","telephone");
 assert.equal(s.case8.finalePanel,true);
});
test("Blue Door finale protects evidence under distinct Vera and solo branches",()=>{
 let s=openBlueDoor(reachBlue("secure"));
 s=step(s,"TAKE","negative");
 s=step(s,"TAKE","letter");
 s=step(s,"TALK","telephone");
 assert.equal(FINALE_OPTIONS.length,3);
 const vera=chooseBlueFinale(s,"vera"),solo=chooseBlueFinale(s,"solo");
 assert.equal(vera.status,"chapter8complete");
 assert.equal(solo.status,"chapter8complete");
 assert.equal(vera.case8.choice,"vera");
 assert.equal(solo.case8.choice,"solo");
 assert.ok(vera.clues.includes("vera-original-film"));
 assert.ok(solo.clues.includes("solo-original-film"));
 assert.ok(vera.transcript.some(x=>x.text.includes("Kingfisher remains a shadow")));
 assert.equal(step(vera,"GO","door").status,"chapter8complete");
 assert.deepEqual(vera.inventory,solo.inventory);
});
test("Blue Door save v8 preserves previous chapter decisions and partial reel",()=>{
 let s=reachProjection(reachBlue("secure"));
 s=chooseSplice(s,"hotel");
 const restored=validateSave(JSON.parse(JSON.stringify(s)));
 assert.equal(restored.version,SAVE_VERSION);
 assert.equal(restored.chapter,8);
 assert.deepEqual(restored.case8.spliceOrder,["hotel"]);
 assert.deepEqual(restored.case8.filmTaken,["hotel","witness","funds"]);
 assert.equal(restored.case7.choice,"secure");
 assert.equal(restored.case6.decision,"warn");
 assert.equal(restored.case5.decision,"protect");
 assert.ok(restored.inventory.includes("marmont-plate"));
 for(const version of [1,2,3,4,5,6,7]){
  const legacy={...initialState(),version};
  delete legacy.case8;
  const migrated=validateSave(legacy);
  assert.equal(migrated.version,SAVE_VERSION);
  assert.equal(migrated.chapter,1);
 }
});
test("Blue Door malformed save fields are normalized without injection or duplicate evidence",()=>{
 let s=reachProjection(reachBlue());
 s.case8.courierTrust=1000;
 s.case8.courierAsked=["ask","bad","ask","show"];
 s.case8.filmTaken=["hotel","bad","witness","hotel"];
 s.case8.spliceOrder=["funds","hotel","witness"];
 s.case8.dialogue="unrecognized";
 s.case8.choice="invalid";
 const loaded=validateSave(s);
 assert.equal(loaded.case8.courierTrust,3);
 assert.deepEqual(loaded.case8.courierAsked,["ask","show"]);
 assert.deepEqual(loaded.case8.filmTaken,["hotel","witness"]);
 assert.deepEqual(loaded.case8.spliceOrder,[]);
 assert.equal(loaded.case8.dialogue,null);
 assert.equal(loaded.case8.choice,"");
});
