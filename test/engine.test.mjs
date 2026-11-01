import test from "node:test";
import assert from "node:assert/strict";
import {
  initialState, act, chooseEvidence, setStoryMode, validateSave, visibleTargets, SAVE_VERSION
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
