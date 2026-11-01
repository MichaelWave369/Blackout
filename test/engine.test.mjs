import test from "node:test";
import assert from "node:assert/strict";
import {
  initialState, act, chooseEvidence, setStoryMode, validateSave, visibleTargets, SAVE_VERSION,
  continueCase, chooseDialogue, TOMMY_OPTIONS
} from "../src/engine.js";
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
test("v1 local and exported case files migrate to version two without erasing clues",()=>{
  let old=reachStreet();
  old.status="escaped";old.room="alley";old.version=1;
  delete old.chapter;delete old.rapport;delete old.dialogue;
  old.flags={mirror:true,body:true,identity:true,window:true,memory:true,evidenceChoice:"preserve"};
  old.inventory.push("matchbook");
  const migrated=validateSave(old);
  assert.equal(migrated.version,2);
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
