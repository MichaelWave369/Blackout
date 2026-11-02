/* BLACKOUT: original retro detective prototype. MIT code license. */
import { AGENCY_HOTSPOTS, freshAgencyCase, agencyTargets, agencyAction, sanitizeAgencyCase } from "./chapter3.js";
import { MANOR_HOTSPOTS, freshManorCase, manorTargets, manorAction, sanitizeManorCase } from "./chapter4.js";
import { DOCK_HOTSPOTS, freshWarehouseCase, dockTargets, warehouseAction, sanitizeWarehouseCase } from "./chapter5.js";
import { RAIL_HOTSPOTS, freshRailCase, railTargets, railAction, sanitizeRailCase } from "./chapter6.js";
import { EXCHANGE_HOTSPOTS, freshExchangeCase, exchangeTargets, exchangeAction, sanitizeExchangeCase } from "./chapter7.js";
import { BLUE_HOTSPOTS, freshBlueCase, blueTargets, blueAction, sanitizeBlueCase } from "./chapter8.js";
import { SILHOUETTE_HOTSPOTS, freshSilhouetteCase, silhouetteTargets, silhouetteAction, sanitizeSilhouetteCase } from "./chapter9.js";
import { CANAL_HOTSPOTS, freshCanalCase, canalTargets, canalAction, sanitizeCanalCase } from "./chapter10.js";
import { LANTERN_HOTSPOTS, freshLanternCase, lanternTargets, lanternAction, sanitizeLanternCase } from "./chapter11.js";
import { ALIBI_HOTSPOTS, freshAlibiCase, alibiTargets, alibiAction, sanitizeAlibiCase } from "./chapter12.js";
export const SAVE_VERSION = 12;
export const STORAGE_KEY = "blackout-blood-on-the-mirror-v1";
export const VERBS = ["LOOK", "TAKE", "OPEN", "USE", "GO", "TALK"];
export const ROOM_NAMES = {
  bathroom: "MARMONT HOTEL / BATHROOM",
  suite: "MARMONT HOTEL / ROOM 214",
  escape: "FIRE ESCAPE / CHICAGO",
  alley: "CHICAGO / RAIN-SOAKED ALLEY",
  street: "CHICAGO / NEON STREETS",
  lounge: "THE CRIMSON LOUNGE / MAIN FLOOR",
  agency: "VINCENT MORROW / DETECTIVE AGENCY",
  office: "MORROW AGENCY / THE OFFICE",
  archive: "MORROW AGENCY / RECORDS ROOM",
  manorGate: "ASHWORTH MANOR / ESTATE GATE",
  manorFoyer: "ASHWORTH MANOR / GRAND FOYER",
  manorStudy: "ASHWORTH MANOR / HAROLD'S STUDY",
  eleanorRoom: "ASHWORTH MANOR / ELEANOR'S ROOM",
  dockGate: "SOUTH BRANCH / DOCK GATES",
  loadingBay: "WAREHOUSE 17 / LOADING BAY",
  freightOffice: "WAREHOUSE 17 / DISPATCH OFFICE",
  containerHold: "WAREHOUSE 17 / SEALED CONTAINER",
  railTunnel: "FORGOTTEN RAILS / DRAINAGE TUNNEL",
  signalCabin: "FORGOTTEN RAILS / SIGNAL CABIN",
  railPlatform: "FORGOTTEN RAILS / PLATFORM ZERO",
  ghostTrain: "CAR 09 / THE ABANDONED TRAIN",
  exchangeLanding: "OLD EXCHANGE / SERVICE LIFT",
  exchangeHall: "OLD EXCHANGE / CONCOURSE",
  wireRoom: "OLD EXCHANGE / TELEGRAPH ROOM",
  exchangeVault: "OLD EXCHANGE / RECORDS VAULT",
  bluePassage: "BEYOND THE EXCHANGE / BLUE PASSAGE",
  switchOffice: "BLUE PASSAGE / SWITCH OFFICE",
  screeningRoom: "BLUE PASSAGE / SCREENING ROOM",
  blueChamber: "THE BLUE DOOR / OBSERVATION ROOM B",
  networkFoyer: "SILHOUETTE / SERVICE FOYER",
  mapGallery: "SILHOUETTE / CARTOGRAPHY GALLERY",
  listenArchive: "SILHOUETTE / INTERCEPTION ARCHIVE",
  signalJunction: "SILHOUETTE / SIGNAL JUNCTION",
  canalWalk: "NORTH CANAL / TOWPATH",
  relayHut: "NORTH CANAL / RELAY HUT",
  bargeDeck: "NORTH CANAL / TRANSFER BARGE",
  towerControl: "NORTH CANAL / TRANSMITTER CONTROL",
  lanternLanding: "LANTERN HOUSE / CANAL LANDING",
  lanternGreenhouse: "LANTERN HOUSE / GREENHOUSE",
  lanternControl: "LANTERN HOUSE / SECURITY CONTROL",
  eleanorWard: "LANTERN HOUSE / OBSERVATION WARD",
  safehouse: "SAFEHOUSE / ELEANOR'S ROOM",
  hotelAnnex: "MARMONT / RECORDS ANNEX",
  coronerOffice: "MUNICIPAL / CORONER'S ANNEX",
  reconstructionDesk: "PRIVATE OFFICE / THE LAST ALIBI"
};
export const HOTSPOTS = {
  bathroom: [
    ["mirror", "Fogged mirror"], ["towel", "Hand towel"],
    ["cabinet", "Medicine cabinet"], ["screwdriver", "Loose screwdriver"],
    ["sink", "Cracked sink"], ["tile", "Bloodstained tile"],
    ["door", "Bedroom door"]
  ],
  suite: [
    ["body", "Unknown man"], ["jacket", "Your jacket"],
    ["wallet", "Leather wallet"], ["ashtray", "Ashtray"],
    ["matchbook", "Red matchbook"], ["window", "Painted window"],
    ["telephone", "Telephone"], ["door", "Hotel corridor"]
  ],
  escape: [
    ["window", "Room 214 window"], ["ladder", "Iron ladder"],
    ["street", "Street below"], ["sign", "Crimson neon"],
    ["rail", "Rusty railing"]
  ],
  alley: [["rain", "Falling rain"], ["matchbook", "The matchbook"], ["street", "Neon street"]],
  street: [
    ["newspaper", "Newspaper stand"], ["patrol", "Police patrol"], ["sign", "Crimson neon"],
    ["door", "Red club door"], ["puddle", "Rain puddle"], ["agency", "Detective agency"], ["alley", "Hotel alley"]
  ],
  lounge: [
    ["tommy", "Tommy Two-Fingers"], ["bouncer", "Club doorman"], ["bar", "Bar counter"],
    ["lighter", "Engraved lighter"], ["piano", "Jazz pianist"], ["booth", "Shadowed booth"],
    ["telephone", "Club telephone"], ["exit", "Street exit"]
  ],
  agency: [["door", "Locked office door"], ["sign", "Detective agency sign"]],
  ...AGENCY_HOTSPOTS,
  ...MANOR_HOTSPOTS,
  ...DOCK_HOTSPOTS,
  ...RAIL_HOTSPOTS,
  ...EXCHANGE_HOTSPOTS,
  ...BLUE_HOTSPOTS,
  ...SILHOUETTE_HOTSPOTS,
  ...CANAL_HOTSPOTS,
  ...LANTERN_HOTSPOTS,
  ...ALIBI_HOTSPOTS
};
export const INTRO = [
  "CHICAGO. 1947. 2:13 A.M.",
  "Cold porcelain presses against your cheek. Your hands are red.",
  "You remember nothing. The man in the mirror might know your name."
];
const BASE = {
  version: SAVE_VERSION,
  room: "bathroom", chapter: 1, rapport: 0, dialogue: null, case3: null, case4: null, case5: null, case6: null, case7: null, case8: null, case9: null, case10: null, case11: null, case12: null, inventory: [], clues: [], memories: [], discovered: [],
  opened: [], flags: { mirror: false, body: false, identity: false, window: false, memory: false, evidenceChoice: "", metTommy: false, lastNight: false, reassured: false, pressured: false, heardKingfisher: false, lighterReady: false },
  pressure: 0, storyMode: false, morality: 0, status: "playing", actions: 0,
  transcript: INTRO.map((text, index) => ({ id: index + 1, text, kind: index === 0 ? "chapter" : "narration" }))
};
export function initialState() { return JSON.parse(JSON.stringify(BASE)); }
export function hasItem(state, item) { return state.inventory.includes(item); }
export function hasClue(state, clue) { return state.clues.includes(clue); }
export function visibleTargets(state) {
  if (state.chapter === 3 && ["office", "archive"].includes(state.room)) return agencyTargets(state);
  if (state.chapter === 4 && MANOR_HOTSPOTS[state.room]) return manorTargets(state);
  if (state.chapter === 5 && DOCK_HOTSPOTS[state.room]) return dockTargets(state);
  if (state.chapter === 6 && RAIL_HOTSPOTS[state.room]) return railTargets(state);
  if (state.chapter === 7 && EXCHANGE_HOTSPOTS[state.room]) return exchangeTargets(state);
  if (state.chapter === 8 && BLUE_HOTSPOTS[state.room]) return blueTargets(state);
  if (state.chapter === 9 && SILHOUETTE_HOTSPOTS[state.room]) return silhouetteTargets(state);
  if (state.chapter === 10 && CANAL_HOTSPOTS[state.room]) return canalTargets(state);
  if (state.chapter === 11 && LANTERN_HOTSPOTS[state.room]) return lanternTargets(state);
  if (state.chapter === 12 && ALIBI_HOTSPOTS[state.room]) return alibiTargets(state);
  return (HOTSPOTS[state.room] || []).filter(([id]) => {
    if (id === "screwdriver") return state.opened.includes("cabinet") && !hasItem(state, "screwdriver");
    if (id === "wallet") return state.opened.includes("jacket") && !hasItem(state, "wallet");
    if (id === "matchbook") return !hasItem(state, "matchbook") || state.room === "alley";
    if (id === "towel") return !hasItem(state, "towel");
    if (id === "lighter") return state.flags.lighterReady && !hasItem(state, "lighter");
    if (id === "newspaper") return !hasItem(state, "newspaper");
    return true;
  });
}
function append(state, text, kind = "narration") {
  state.transcript.push({ id: (state.transcript.at(-1)?.id || 0) + 1, text, kind });
  state.transcript = state.transcript.slice(-35);
}
function award(state, group, value, message) {
  if (!state[group].includes(value)) {
    state[group].push(value);
    if (message) append(state, message, "evidence");
  }
}
function locationChange(state, room, text) {
  state.room = room;
  append(state, text, "chapter");
  if (!state.discovered.includes(room)) state.discovered.push(room);
}
function progress(state, cost = 1) {
  state.actions += 1;
  // Police pressure belongs to the timed hotel escape, not free-roam Chicago.
  if (state.chapter !== 1 || !["bathroom", "suite", "escape"].includes(state.room)) return;
  state.pressure += cost;
  if (state.pressure === 9) append(state, "A siren rises somewhere down the block. Not for you. Probably.", "warning");
  if (state.pressure === 17) append(state, "A radio crackles beyond the hotel door. Footsteps. Several sets.", "warning");
  if (state.pressure === 25) append(state, "THREE SHARP KNOCKS. POLICE! OPEN UP!", "warning");
  if (state.pressure >= 34 && !state.storyMode && state.room !== "alley") {
    state.status = "caught";
    append(state, "The door bursts inward. A badge, a gun, a voice demanding your name. You don't have an answer fast enough.", "ending");
  }
}
function look(state, target) {
  const descriptions = {
    bathroom: {
      mirror: state.flags.mirror ? "The reflection is Vincent Morrow. Your face is cut. The blood on your shirt is not all yours." : "Condensation hides a cracked mirror. A blurred face waits on the other side. The towel could clear it.",
      towel: "A threadbare hotel towel hangs beside the basin. Still dry enough to use.",
      cabinet: "A crooked medicine cabinet. The hinge has almost given up.",
      screwdriver: "A small flat-head screwdriver. Someone was doing repairs in a hurry.",
      sink: "Rust stains the porcelain. There is enough cold water to wash your hands. That wouldn't wash away the questions.",
      tile: "A dark smear runs across the tiles, trailing toward the bedroom door.",
      door: "A cheap wooden door. Beyond it, the other half of room 214."
    },
    suite: {
      body: "A man in a gray suit sits motionless in an armchair. Bullet wound, upper chest. His shoes are polished. His hands aren't.",
      jacket: "Your wool jacket hangs from the bedpost. One pocket sags with something heavy.",
      wallet: "A leather wallet, scuffed along the spine.",
      ashtray: "One cigarette burned to the filter. Beside it sits a red matchbook stamped THE CRIMSON LOUNGE.",
      matchbook: "A matchbook. Red door on the cover. Somebody wrote a strange note inside: FIND THE BLUE DOOR.",
      window: state.flags.window ? "The jammed sash is pried loose. Rain blows through the opening onto an iron fire escape." : "Painted shut and overlooking the alley. A flat-head might free the sash.",
      telephone: "The receiver is off the hook. Nobody is on the line, but someone was here very recently.",
      door: "The hotel corridor. You can hear the elevator machinery turning. Going out that way seems unwise."
    },
    street: {
      newspaper: "ASHWORTH HEIRESS MISSING, THIRD WEEK. The newsboy has gone home. The headlines haven't.",
      patrol: "Two uniformed officers linger beneath a streetlamp. Both are watching the hotel.",
      sign: "THE CRIMSON LOUNGE. Red letters bleed into the wet pavement.",
      door: "A red club door, brass handle, scuffed threshold. Bass notes pulse through the wood.",
      puddle: "In the rain, the city looks almost honest. The reflections are lying.",
      agency: "West Lake Street. You recognize a familiar address but can't remember what waits there.",
      alley: "The fire escape behind the Marmont is disappearing into the fog."
    },
    lounge: {
      tommy: "A bartender with a tired face and nervous hands. Tommy Two-Fingers freezes when he sees you.",
      bouncer: "The doorman watches the crowd instead of the music. He's definitely seen you before.",
      bar: "A scarred mahogany counter. Rings of condensation cover the old varnish.",
      lighter: "Heavy silver lighter. The initials T.T. have been scratched into its lid.",
      piano: "The pianist plays the same four bars twice. Then deliberately changes the ending.",
      booth: "A shadowed booth with an empty glass. Someone left in a hurry.",
      telephone: "An old black telephone behind the bar. No ringing, just the weight of missed calls.",
      exit: "Beyond the red door is a street that hasn't forgotten your face."
    },
    agency: {
      door: "Your detective agency is locked. This chapter ends at its threshold.",
      sign: "VINCENT MORROW. PRIVATE INVESTIGATIONS. The letters are almost worn away."
    },
    escape: {
      window: "A yellow square of hotel light behind you. The room already feels like someone else's nightmare.",
      ladder: "A narrow iron ladder to the alley. Its rungs are slick, but they will hold.",
      street: "A wet, empty alley below. A useful place to disappear.",
      sign: "Across the street, the CRIMSON LOUNGE sign shivers in red neon.",
      rail: "Rust flakes from the rail. Somewhere a police whistle cuts through the rain."
    },
    alley: {
      rain: "Rain needles the pavement. Chicago is not ready to forgive you.",
      matchbook: "The red door printed on the matchbook has only one address: THE CRIMSON LOUNGE."
    }
  };
  append(state, descriptions[state.room]?.[target] || "Nothing useful stands out.");
  if (state.room === "suite" && target === "body" && !state.flags.body) {
    state.flags.body = true;
    award(state, "clues", "body", "NOTEBOOK: Unknown victim. Gunshot wound. Approximate time of death unknown.");
  }
  if (state.room === "suite" && target === "telephone") {
    award(state, "clues", "off-hook-phone", "NOTEBOOK: Receiver off hook. Last caller unknown.");
  }
}
function take(state, target) {
  if (state.room === "bathroom" && target === "towel") {
    award(state, "inventory", "towel", "INVENTORY: Hotel towel.");
  } else if (state.room === "bathroom" && target === "screwdriver" && state.opened.includes("cabinet")) {
    award(state, "inventory", "screwdriver", "INVENTORY: Flat-head screwdriver.");
  } else if (state.room === "suite" && target === "wallet" && state.opened.includes("jacket")) {
    award(state, "inventory", "wallet", "INVENTORY: Your leather wallet.");
    state.flags.identity = true;
    award(state, "clues", "identity", "NOTEBOOK: Private investigator's license. VINCENT MORROW. 412 WEST LAKE STREET.");
    append(state, "Vincent Morrow. It is a name you should recognize. It feels like somebody else's.", "memory");
  } else if (state.room === "suite" && target === "matchbook") {
    award(state, "inventory", "matchbook", "INVENTORY: The Crimson Lounge matchbook.");
    award(state, "clues", "red-door", "NOTEBOOK: A matchbook from the Crimson Lounge. A red door printed on the cover.");
    if (!state.flags.memory) {
      state.flags.memory = true;
      award(state, "memories", "blue-door", "MEMORY FRAGMENT 01: Rain against a windshield. A woman's whisper: 'Find the blue door.'");
    }
  } else if (state.room === "street" && target === "newspaper") {
    award(state, "inventory", "newspaper", "INVENTORY: A damp newspaper clipping.");
    award(state, "clues", "ashworth-headline", "NOTEBOOK: Eleanor Ashworth, missing for three weeks. Her family wants answers.");
  } else if (state.room === "lounge" && target === "lighter" && state.flags.lighterReady) {
    award(state, "inventory", "lighter", "INVENTORY: Tommy's silver lighter, engraved T.T.");
    award(state, "clues", "lighter-initials", "NOTEBOOK: Engraved lighter given by Tommy Two-Fingers.");
    award(state, "memories", "kingfisher-whisper", "MEMORY FRAGMENT 02: Tommy's voice, a bruised fist, a name: THE KINGFISHER. Someone offered you Ashworth money to forget.");
  } else if (hasItem(state, target)) {
    append(state, "You already have that.");
  } else {
    append(state, "You can't take that. Some mysteries are heavier than they look.");
    return false;
  }
  return true;
}
function open(state, target) {
  if (state.room === "bathroom" && target === "cabinet") {
    if (state.opened.includes("cabinet")) {
      append(state, "The cabinet is already open. No new evidence inside.");
      return false;
    }
    state.opened.push("cabinet");
    append(state, "The cabinet swings open. Inside: an empty aspirin bottle and a loose screwdriver.");
    return true;
  }
  if (state.room === "suite" && target === "jacket") {
    if (state.opened.includes("jacket")) {
      append(state, "The jacket has already been searched.");
      return false;
    }
    state.opened.push("jacket");
    append(state, "You search the inner pocket. A leather wallet falls into your hand.");
    return true;
  }
  if (state.room === "suite" && target === "window") {
    if (state.flags.window) append(state, "The window is already open. Cold rain brushes your face.");
    else append(state, "It doesn't budge. The sash has been painted shut. You'll need leverage.");
    return false;
  }
  append(state, "It won't open. At least, not that way.");
  return false;
}
function use(state, target, item) {
  if (state.room === "street" && target === "sign" && item === "matchbook" && hasItem(state, "matchbook")) {
    append(state, "Same red door on the paper as on the building. This is the right place.", "evidence");
    award(state, "clues", "lounge-match", "NOTEBOOK: The matchbook connects room 214 to the Crimson Lounge.");
    return true;
  }
  if (state.room === "lounge" && target === "bouncer" && item === "matchbook" && hasItem(state, "matchbook")) {
    append(state, "The bouncer spots the matchbook. 'You're late, Morrow. Tommy is inside.'", "choice");
    award(state, "clues", "bouncer-recognition", "NOTEBOOK: The club bouncer knows Vincent by name.");
    return true;
  }
  if (target === "mirror" && state.room === "bathroom" && item === "towel" && hasItem(state, "towel")) {
    state.flags.mirror = true;
    award(state, "clues", "reflection", "NOTEBOOK: A cut over the right brow. Dried blood. Face unfamiliar.");
    append(state, "You wipe away the fog. A bruised stranger watches you from the glass. No. That stranger is you.", "memory");
    return true;
  }
  if (target === "window" && state.room === "suite" && item === "screwdriver" && hasItem(state, "screwdriver")) {
    state.flags.window = true;
    append(state, "Steel bites through cracked paint. You pry up the sash. Rain, cold air, freedom. Maybe.", "evidence");
    return true;
  }
  if (target === "sink" && state.room === "bathroom" && !item) {
    append(state, "Cold water reddens, swirls, disappears. The smell of iron stays.", "narration");
    return true;
  }
  if (target === "matchbook" && item === "matchbook" && hasItem(state, "matchbook")) {
    append(state, "You read the scribbled words again: FIND THE BLUE DOOR. The voice in your head isn't yours.", "memory");
    return true;
  }
  append(state, item ? "That combination doesn't reveal anything. Not yet." : "Try selecting an inventory item, then USE it on a scene object.");
  return false;
}
function go(state, target) {
  if (state.room === "alley" && target === "street" && state.chapter >= 2) {
    locationChange(state, "street", "NEON STREETS. The Crimson Lounge sign burns through the rain.");
    return true;
  }
  if (state.room === "street" && target === "door") {
    state.dialogue = null;
    locationChange(state, "lounge", "THE CRIMSON LOUNGE. A saxophone strains above the laughter. The doorman nods. 'Back again, Morrow?'");
    award(state, "clues", "bouncer-recognition", "NOTEBOOK: The bouncer recognized you before you said a word.");
    return true;
  }
  if (state.room === "street" && target === "alley") {
    locationChange(state, "alley", "You retreat toward the Marmont fire escape. The police are still searching the area.");
    return true;
  }
  if (state.room === "lounge" && target === "exit") {
    state.dialogue = null;
    locationChange(state, "street", "Outside, the rain has doubled. Chicago keeps its secrets under water.");
    return true;
  }
  if (state.room === "street" && target === "agency") {
    if (!hasItem(state, "lighter")) {
      append(state, "You could go home, but Tommy has answers. The red door comes first.");
      return false;
    }
    locationChange(state, "agency", "CHAPTER 2 COMPLETE: At 412 West Lake Street, the sign reads VINCENT MORROW, PRIVATE INVESTIGATIONS. Your office has been ransacked. The next case begins at its door.");
    state.status = "chapter2complete";
    append(state, "NEXT: CHAPTER 3 — THE AGENCY. Your collected evidence and choices will travel with you.", "ending");
    return true;
  }
  if (state.room === "bathroom" && target === "door") {
    locationChange(state, "suite", "ROOM 214. The smell hits first. Cordite. Cheap cologne. A dead man by the window.");
    return true;
  }
  if (state.room === "suite" && target === "door") {
    append(state, "A shadow passes under the hallway door. You decide not to introduce yourself.");
    return false;
  }
  if (state.room === "suite" && target === "window") {
    if (!state.flags.window) {
      append(state, "The sash is stuck. Something thin and sturdy could pry it free.");
      return false;
    }
    locationChange(state, "escape", "FIRE ESCAPE. Rain runs down your collar. Above you: a siren. Below you: a chance.");
    return true;
  }
  if (state.room === "escape" && (target === "ladder" || target === "street")) {
    locationChange(state, "alley", "THE ALLEY. You hit the pavement as blue lights wash across the upper windows.");
    state.status = "escaped";
    const found = ["mirror", "identity", "body", "memory"].filter(key => state.flags[key]).length;
    if (found === 4) {
      append(state, "CHAPTER COMPLETE: You know your name. You know somebody died. And you have a red door to find. THE CRIMSON LOUNGE AWAITS.", "ending");
    } else {
      append(state, "CHAPTER COMPLETE: You escaped with " + found + " of 4 core discoveries. Every missing clue is another question waiting to hurt you.", "ending");
    }
    if (state.flags.evidenceChoice === "preserve") append(state, "Your decision to preserve the crime scene may yet keep an innocent person alive.", "ending");
    if (state.flags.evidenceChoice === "erase") append(state, "You left with clean hands and a dirty conscience.", "ending");
    return true;
  }
  if (state.room === "escape" && target === "window") {
    locationChange(state, "suite", "You climb back through the hotel window. Every second here is stolen.");
    return true;
  }
  append(state, "There is no safe passage that way.");
  return false;
}
export function chooseEvidence(state, choice) {
  const next = JSON.parse(JSON.stringify(state));
  if (next.status !== "playing" || next.room !== "suite" || !next.flags.body || next.flags.evidenceChoice) return next;
  if (choice !== "preserve" && choice !== "erase") return next;
  next.flags.evidenceChoice = choice;
  next.morality += choice === "preserve" ? 1 : -1;
  append(next, choice === "preserve"
    ? "You leave the victim untouched. The truth matters more than a clean getaway. NOTEBOOK: Evidence preserved."
    : "You wipe your fingerprints from the chair. The evidence may be safer with you, but the truth has already changed.", "choice");
  progress(next);
  return next;
}
export function continueCase(state) {
  const next = JSON.parse(JSON.stringify(state));
  if (next.status !== "escaped" || next.room !== "alley" || next.chapter !== 1) return next;
  next.status = "playing";
  next.chapter = 2;
  next.dialogue = null;
  next.pressure = 0;
  locationChange(next, "street", "CHAPTER 2: NEON STREETS. Rain beats the sidewalk. A red sign draws you toward the Crimson Lounge. Somewhere behind you, a patrol car idles.");
  return next;
}
export const TOMMY_OPTIONS = [
  { id: "last-night", label: "ASK ABOUT LAST NIGHT" },
  { id: "kingfisher", label: "ASK ABOUT THE KINGFISHER" },
  { id: "reassure", label: "PROMISE TO PROTECT TOMMY" },
  { id: "pressure", label: "PRESS HIM FOR ANSWERS" },
  { id: "close", label: "LEAVE CONVERSATION" }
];
export function chooseDialogue(state, choice) {
  const next = JSON.parse(JSON.stringify(state));
  if (next.status !== "playing" || next.room !== "lounge" || next.dialogue !== "tommy") return next;
  if (!TOMMY_OPTIONS.some(option => option.id === choice)) return next;
  if (choice === "close") {
    append(next, "Tommy returns to polishing a glass that is already clean.", "choice");
    next.dialogue = null;
  } else if (choice === "last-night") {
    if (next.flags.lastNight) append(next, "'I already told you. You were here with a woman, Vince. You were scared.'", "choice");
    else {
      next.flags.lastNight = true;
      append(next, "'You came in with a woman. A blue coat. You said someone was following her. You left before the last set.'", "choice");
      award(next, "clues", "tommy-testimony", "NOTEBOOK: Tommy saw Vincent with a woman in a blue coat.");
      award(next, "memories", "jazz-warning", "MEMORY FRAGMENT: Jazz, a blue coat, a man's shout through the crowd. You remember grabbing a woman's hand.");
    }
  } else if (choice === "reassure") {
    if (next.flags.reassured) append(next, "Tommy looks toward the door. 'Just keep your promise, Vince.'", "choice");
    else {
      next.flags.reassured = true; next.rapport = Math.min(3, next.rapport + 1);
      append(next, "'I won't let them hurt you, Tommy.' He stops shaking. 'That's what you said last time, too.'", "choice");
    }
  } else if (choice === "pressure") {
    if (next.flags.pressured) append(next, "'You got your answer, Vince. Don't make me regret it.'", "choice");
    else {
      next.flags.pressured = true; next.rapport = Math.max(-3, next.rapport - 2);
      append(next, "You lean over the counter. Tommy's knuckles whiten. 'This place has ears, Morrow. Back off.'", "choice");
    }
  } else if (choice === "kingfisher") {
    if (!next.flags.lastNight) {
      append(next, "'Start with last night. You don't even remember who you came here with.'", "choice");
      return next;
    }
    if (next.rapport < -1) {
      append(next, "'Not until I know you're on my side.' Tommy turns away. Rebuild his trust.", "choice");
      return next;
    }
    if (!next.flags.heardKingfisher) {
      next.flags.heardKingfisher = true; next.flags.lighterReady = true;
      append(next, "Tommy leans close. 'Kingfisher. That's the name you whispered. Then somebody offered you Ashworth money to forget everything.' He slides a silver lighter across the bar.", "choice");
      award(next, "clues", "kingfisher-lead", "NOTEBOOK: Kingfisher linked to the Ashworth family and Vincent's lost memory.");
    } else append(next, "'Kingfisher. That's all I know. Take the lighter. Get to your office.'", "choice");
  }
  next.actions += 1;
  return next;
}
function talk(state, target) {
  if (state.room === "street" && target === "patrol") {
    append(state, "One officer sizes you up. 'Keep walking, buddy.' The second one reaches for his radio.", "warning");
    return true;
  }
  if (state.room === "lounge" && target === "bouncer") {
    append(state, "'Back again, Morrow? Tommy's inside. Try not to bring trouble through my door.'", "choice");
    award(state, "clues", "bouncer-recognition", "NOTEBOOK: The club bouncer knows Vincent by name.");
    return true;
  }
  if (state.room === "lounge" && target === "tommy") {
    state.dialogue = "tommy";
    if (!state.flags.metTommy) {
      state.flags.metTommy = true;
      append(state, "Tommy Two-Fingers nearly drops his glass. 'You shouldn't be here, Vince. Not after what happened.'", "choice");
    } else append(state, "Tommy glances past your shoulder. 'Make it quick.'", "choice");
    return true;
  }
  if (state.room === "lounge" && target === "piano") {
    append(state, "The pianist doesn't look up. 'I play requests for cash. Secrets cost more.'", "choice");
    return true;
  }
  append(state, "Nobody here is ready to talk.");
  return false;
}
export function continueAgencyCase(state) {
  const next = JSON.parse(JSON.stringify(state));
  if(next.status!=="chapter2complete"||next.chapter!==2||next.room!=="agency")return next;
  next.status="playing";
  next.chapter=3;
  next.dialogue=null;
  next.case3=freshAgencyCase();
  locationChange(next,"office","CHAPTER 3: THE AGENCY. Files spill across the floor. Someone ransacked your office while you were gone. The clock has stopped, the case board is crooked, and the safe is still locked.");
  return next;
}
export function continueManorCase(state) {
  const next=JSON.parse(JSON.stringify(state));
  if(next.chapter!==3||next.status!=="chapter3complete"||next.room!=="office")return next;
  next.chapter=4;
  next.status="playing";
  next.dialogue=null;
  next.case4=freshManorCase();
  locationChange(next,"manorGate","CHAPTER 4: ASHWORTH MANOR. Midnight. The iron gates glitter with rain. Beyond them waits Harold Ashworth and a house full of secrets.");
  return next;
}
export function continueWarehouseCase(state){
  const next=JSON.parse(JSON.stringify(state));
  if(next.chapter!==4||next.status!=="chapter4complete"||next.room!=="manorStudy")return next;
  next.chapter=5;next.status="playing";next.dialogue=null;
  next.case5=freshWarehouseCase(next.case4?.decision);
  locationChange(next,"dockGate","CHAPTER 5: WAREHOUSE SHADOWS. South Branch docks, shortly before dawn. A black K marks the private freight gate. Somebody knows you're coming.");
  return next;
}
export function continueRailCase(state){
  const next=JSON.parse(JSON.stringify(state));
  if(next.chapter!==5||next.status!=="chapter5complete"||next.room!=="containerHold")return next;
  next.chapter=6;next.status="playing";next.dialogue=null;
  next.case6=freshRailCase(next.case5?.decision);
  locationChange(next,"railTunnel","CHAPTER 6: THE FORGOTTEN RAILS. Beneath the riverfront, Vincent finds the abandoned rail tunnels. An old signal cabin and Platform Zero may lead to Eleanor.");
  return next;
}
export function continueExchangeCase(state){
  const next=JSON.parse(JSON.stringify(state));
  if(next.chapter!==6||next.status!=="chapter6complete"||next.room!=="ghostTrain")return next;
  next.chapter=7;next.status="playing";next.dialogue=null;
  next.case7=freshExchangeCase(next.case6?.decision==="warn");
  locationChange(next,"exchangeLanding","CHAPTER 7: THE OLD EXCHANGE. The lift descends beneath Chicago's forgotten rails. A shuttered Exchange holds the records of Eleanor's disappearance.");
  return next;
}
export function continueBlueCase(state){
  const next=JSON.parse(JSON.stringify(state));
  if(next.chapter!==7||next.status!=="chapter7complete"||next.room!=="exchangeVault")return next;
  next.chapter=8;next.status="playing";next.dialogue=null;
  next.case8=freshBlueCase(next.case7?.choice);
  locationChange(next,"bluePassage","CHAPTER 8: THE BLUE DOOR. The courier waits in a painted passage beneath the Exchange. Behind a steel door lies the record that Vincent's memory has tried to protect.");
  return next;
}
export function continueSilhouetteCase(state){
  const next=JSON.parse(JSON.stringify(state));
  if(next.chapter!==8||next.status!=="chapter8complete"||next.room!=="blueChamber")return next;
  next.chapter=9;next.status="playing";next.dialogue=null;
  next.case9=freshSilhouetteCase(next.case8?.choice);
  locationChange(next,"networkFoyer","CHAPTER 9: THE SILHOUETTE NETWORK. Behind the Blue Door lies a network of watchers. Nora Finch guards an archive that might lead to the person directing it.");
  return next;
}
export function continueCanalCase(state){
  const next=JSON.parse(JSON.stringify(state));
  if(next.chapter!==9||next.status!=="chapter9complete"||next.room!=="signalJunction")return next;
  next.chapter=10;next.status="playing";next.dialogue=null;
  next.case10=freshCanalCase(next.case9?.decision);
  locationChange(next,"canalWalk","CHAPTER 10: NORTH CANAL. A live SABLE transmission leads Vincent to a rain-soaked towpath, an abandoned transfer barge, and a communications tower. Iris Pike watches him arrive.");
  return next;
}
export function continueLanternCase(state){
  const next=JSON.parse(JSON.stringify(state));
  if(next.chapter!==10||next.status!=="chapter10complete"||next.room!=="towerControl")return next;
  next.chapter=11;next.status="playing";next.dialogue=null;
  next.case11=freshLanternCase(next.case10?.decision);
  locationChange(next,"lanternLanding","CHAPTER 11: LANTERN HOUSE. At dawn, Vincent reaches the guarded recovery ward by the canal. Ada Reed waits at the service gate. Inside may be Eleanor Ashworth herself.");
  return next;
}
export function continueAlibiCase(state){
  const next=JSON.parse(JSON.stringify(state));
  if(next.chapter!==11||next.status!=="chapter11complete"||next.room!=="eleanorWard")return next;
  next.chapter=12;next.status="playing";next.dialogue=null;
  next.case12=freshAlibiCase(next.case11?.decision);
  locationChange(next,"safehouse","CHAPTER 12: THE LAST ALIBI. Eleanor and Vincent return to the evidence. A lost hotel guest record, an uncut street camera negative, and the municipal coroner's records could prove who died in room 214.");
  return next;
}
export function act(state, verb, target, item = "") {
  const next = JSON.parse(JSON.stringify(state));
  if (next.status !== "playing") return next;
  if (!VERBS.includes(verb)) return next;
  if(next.chapter===12&&ALIBI_HOTSPOTS[next.room]){
    if(verb!=="LOOK"||target){
      if(!visibleTargets(next).some(([id])=>id===target)){
        append(next,"That isn't here. Keep looking.");
        return next;
      }
    }
    return alibiAction(next,verb,target,item);
  }
  if(next.chapter===11&&LANTERN_HOTSPOTS[next.room]){
    if(verb!=="LOOK"||target){
      if(!visibleTargets(next).some(([id])=>id===target)){
        append(next,"That isn't here. Keep looking.");
        return next;
      }
    }
    return lanternAction(next,verb,target,item);
  }
  if(next.chapter===10&&CANAL_HOTSPOTS[next.room]){
    if(verb!=="LOOK"||target){
      if(!visibleTargets(next).some(([id])=>id===target)){
        append(next,"That isn't here. Keep looking.");
        return next;
      }
    }
    return canalAction(next,verb,target,item);
  }
  if(next.chapter===9&&SILHOUETTE_HOTSPOTS[next.room]){
    if(verb!=="LOOK"||target){
      if(!visibleTargets(next).some(([id])=>id===target)){
        append(next,"That isn't here. Keep looking.");
        return next;
      }
    }
    return silhouetteAction(next,verb,target,item);
  }
  if(next.chapter===8&&BLUE_HOTSPOTS[next.room]){
    if(verb!=="LOOK"||target){
      if(!visibleTargets(next).some(([id])=>id===target)){
        append(next,"That isn't here. Keep looking.");
        return next;
      }
    }
    return blueAction(next,verb,target,item);
  }
  if(next.chapter===7&&EXCHANGE_HOTSPOTS[next.room]){
    if(verb!=="LOOK"||target){
      if(!visibleTargets(next).some(([id])=>id===target)){
        append(next,"That isn't here. Keep looking.");
        return next;
      }
    }
    return exchangeAction(next,verb,target,item);
  }
  if(next.chapter===6&&RAIL_HOTSPOTS[next.room]){
    if(verb!=="LOOK"||target){
      if(!visibleTargets(next).some(([id])=>id===target)){
        append(next,"That isn't here. Keep looking.");
        return next;
      }
    }
    return railAction(next,verb,target,item);
  }
  if(next.chapter===5&&DOCK_HOTSPOTS[next.room]){
    if(verb!=="LOOK"||target){
      if(!visibleTargets(next).some(([id])=>id===target)){
        append(next,"That isn't here. Keep looking.");
        return next;
      }
    }
    return warehouseAction(next,verb,target,item);
  }
  if(next.chapter===4&&MANOR_HOTSPOTS[next.room]){
    if(verb!=="LOOK"||target){
      if(!visibleTargets(next).some(([id])=>id===target)){
        append(next,"That isn't here. Keep looking.");
        return next;
      }
    }
    return manorAction(next,verb,target,item);
  }
  if(next.chapter===3&&["office","archive"].includes(next.room)){
    if(verb!=="LOOK"||target){
      if(!visibleTargets(next).some(([id])=>id===target)) {
        append(next,"That isn't here. Keep looking.");
        return next;
      }
    }
    return agencyAction(next,verb,target,item);
  }
  if (verb === "LOOK" && !target) {
    append(next, {
      bathroom: "The bathroom is cramped. A mirror. A cabinet. A towel. One door to the rest of your nightmare.",
      suite: "Room 214: a body, your jacket, an ashtray, a telephone, a sealed window. The corridor is getting louder.",
      escape: "A narrow iron landing overlooks a rain-soaked alley. The ladder leads down.",
      alley: "The night belongs to Chicago. You have to figure out who you belong to.",
      street: "Rain, a newspaper stand, a passing patrol, and a red door beneath the CRIMSON LOUNGE sign.",
      lounge: "Amber light, whispered threats, the bartender Tommy, and a jazz pianist playing to a room of strangers.",
      agency: "The sign above the door reads VINCENT MORROW. The next chapter waits inside.",
      office: "Your ransacked agency contains a case board, a wall safe, a stopped clock, and a battered desk.",
      archive: "Dusty records and a June calendar surround an overstuffed filing cabinet.",
      manorGate: "The Ashworth gates shine beneath the rain. A gatekeeper waits with an iron key.",
      manorFoyer: "Harold Ashworth stands beneath a chandelier. Two closed doors lead to the secrets of the house.",
      manorStudy: "A business ledger, a portrait with brass nameplates, and dark shadows fill Harold's study.",
      eleanorRoom: "Eleanor's room has been searched. The vanity and jewelry box haven't given up their secrets.",
      dockGate: "The south docks are flooded with rain. A watchman stands beneath a freight lamp.",
      loadingBay: "An unregistered container sits on freight rails beneath a frozen crane.",
      freightOffice: "A dispatcher's office holds a manifest, harbor radio, and abandoned photographs.",
      containerHold: "A hidden passenger compartment contains a recorder, transfer roster, and tunnel exit.",
      railTunnel: "A drainage tunnel leads to a deserted platform and an abandoned signal cabin.",
      signalCabin: "A dead switchboard, a timetable, and maintenance controls await a master key.",
      railPlatform: "Platform Zero. Elsie Vale watches Car 09 and its locked doors.",
      ghostTrain: "Eleanor left a one-way ticket inside the old Pullman car. A lockbox holds the next clue.",
      exchangeLanding: "The service lift opens into a buried Exchange, sealed since its final train.",
      exchangeHall: "Mara Bell watches the concourse between a telegraph office and locked records vault.",
      wireRoom: "Carbon duplicates survive in the telegraph cabinet. The message machine names a blue door.",
      exchangeVault: "A reconciliation board connects the freight, the train, and Kingfisher's money.",
      bluePassage: "A blue-painted passage connects a switching office, a film screening room, and a locked steel door.",
      switchOffice: "The switching office houses room-214 surveillance plates and a call log.",
      screeningRoom: "Three film strips await reconstruction in a hand-cranked projector.",
      blueChamber: "The original Marmont surveillance negative and Eleanor's letter wait beyond the Blue Door.",
      networkFoyer: "An operator named Nora Finch guards the hidden Silhouette interception archive.",
      mapGallery: "A sprawling map of disconnected signal cells traces Hotel, Exchange, and Riverfront relays.",
      listenArchive: "Intercept logs and the audio spool marked SABLE lie inside a sealed archive.",
      signalJunction: "A routing board can trace the network to the North Canal communications tower.",
      canalWalk: "A canal radio engineer watches a relay hut, a moored barge and the transmission tower.",
      relayHut: "Original calibration records and traffic logs can prove which route SABLE used.",
      bargeDeck: "The barge's transfer records hold a destination that might explain Eleanor's disappearance.",
      towerControl: "The North Canal router can print the original path and relay a live message.",
      lanternLanding: "Ada Reed stands near a service gate while the front hall remains under guard.",
      lanternGreenhouse: "A frost-glass greenhouse holds the service survey and tide card.",
      lanternControl: "Security files and an evacuation plan can lead to the observation ward.",
      eleanorWard: "Eleanor Ashworth is alive inside Lantern House. Her testimony and other detainees' register remain here.",
      safehouse: "Eleanor and Vincent revisit the Marmont case through independent evidence.",
      hotelAnnex: "The original Marmont guest, desk clock and effects records still survive.",
      coronerOffice: "Independent coroner files may identify the man in room 214.",
      reconstructionDesk: "An original three-part evidence board can reconstruct Vincent's alibi."
    }[next.room]);
    return next;
  }
  const validTarget = visibleTargets(next).some(([id]) => id === target) || (verb === "USE" && hasItem(next, target));
  if (!validTarget) {
    append(next, "That isn't here. Keep looking.");
    return next;
  }
  if (verb === "LOOK") { look(next, target); return next; }
  let success = false;
  if (verb === "TAKE") success = take(next, target);
  if (verb === "OPEN") success = open(next, target);
  if (verb === "USE") success = use(next, target, item);
  if (verb === "GO") success = go(next, target);
  if (verb === "TALK") success = talk(next, target);
  if (success && next.status === "playing") progress(next);
  return next;
}
export function setStoryMode(state, enabled) {
  const next = JSON.parse(JSON.stringify(state));
  next.storyMode = Boolean(enabled);
  return next;
}
export function validateSave(value) {
  if (!value || ![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, SAVE_VERSION].includes(value.version) || !ROOM_NAMES[value.room]) throw new Error("Not a compatible BLACKOUT case file.");
  if (!["playing", "caught", "escaped", "chapter2complete", "chapter3complete", "chapter4complete", "chapter5complete", "chapter6complete", "chapter7complete", "chapter8complete", "chapter9complete", "chapter10complete", "chapter11complete", "chapter12complete"].includes(value.status)) throw new Error("Invalid case file status.");
  for (const key of ["inventory", "clues", "memories", "discovered", "opened", "transcript"]) if (!Array.isArray(value[key])) throw new Error("Case file missing " + key);
  if (!value.flags || typeof value.flags !== "object" || typeof value.pressure !== "number") throw new Error("Invalid case file.");
  const safe = initialState();
  safe.room = value.room; safe.status = value.status;
  safe.chapter = [1,2,3,4,5,6,7,8,9,10,11,12].includes(value.chapter) ? value.chapter : 1;
  safe.case3 = safe.chapter >= 3 ? sanitizeAgencyCase(value.case3) : null;
  safe.case4 = safe.chapter >= 4 ? sanitizeManorCase(value.case4) : null;
  safe.case5 = safe.chapter >= 5 ? sanitizeWarehouseCase(value.case5) : null;
  safe.case6 = safe.chapter >= 6 ? sanitizeRailCase(value.case6) : null;
  safe.case7 = safe.chapter >= 7 ? sanitizeExchangeCase(value.case7) : null;
  safe.case8 = safe.chapter >= 8 ? sanitizeBlueCase(value.case8) : null;
  safe.case9 = safe.chapter >= 9 ? sanitizeSilhouetteCase(value.case9) : null;
  safe.case10 = safe.chapter >= 10 ? sanitizeCanalCase(value.case10) : null;
  safe.case11 = safe.chapter >= 11 ? sanitizeLanternCase(value.case11) : null;
  safe.case12 = safe.chapter === 12 ? sanitizeAlibiCase(value.case12) : null;
  safe.rapport = Number.isFinite(value.rapport) ? Math.max(-3, Math.min(3, value.rapport)) : 0;
  safe.dialogue = value.dialogue === "tommy" && value.room === "lounge" ? "tommy" : null;
  safe.inventory = value.inventory.filter(x => typeof x === "string").slice(0,50);
  safe.clues = value.clues.filter(x => typeof x === "string").slice(0,80);
  safe.memories = value.memories.filter(x => typeof x === "string").slice(0,80);
  safe.discovered = value.discovered.filter(x => typeof x === "string").slice(0,50);
  safe.opened = value.opened.filter(x => typeof x === "string").slice(0,50);
  for (const flag of Object.keys(safe.flags)) {
    if (typeof safe.flags[flag] === typeof value.flags[flag]) safe.flags[flag] = value.flags[flag];
  }
  safe.pressure = Math.max(0, Math.min(100, value.pressure));
  safe.storyMode = Boolean(value.storyMode);
  safe.morality = Number.isFinite(value.morality) ? Math.max(-9,Math.min(9,value.morality)) : 0;
  safe.actions = Number.isFinite(value.actions) ? Math.max(0,Math.min(9999,value.actions)) : 0;
  safe.transcript = value.transcript.filter(x => x && typeof x.text === "string" && typeof x.id === "number").slice(-35).map(x => ({ id:x.id, text:x.text.slice(0,1000), kind:typeof x.kind === "string" ? x.kind : "narration" }));
  return safe;
}
