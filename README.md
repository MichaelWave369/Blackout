# BLACKOUT
**Wake up. Blood on your hands. No memory. No alibi. No time.**

A retro-first, VR-bound 1947 Chicago noir mystery starring private investigator **Vincent Morrow**.

## Rung 6: The Forgotten Rails (v0.6.0)

**Six playable chapters.** Complete Warehouse Shadows and choose **CONTINUE TO CHAPTER 6: THE FORGOTTEN RAILS** in Case Controls. Inventory, memories, witness evidence, trust, prior chapter decisions and the completed detective case boards continue into the tunnels.

### Explore beneath Chicago
- Four original 320×200 procedural pixel-art scenes: **drainage tunnel**, **signal cabin**, **abandoned Platform Zero** and **Pullman Car 09**.
- Meet **Elsie Vale**, a rail mechanic who saw Eleanor being moved alive. Her starting trust depends on whether Vincent protected dockworkers or exposed records in Chapter 5.
- TALK to Elsie about the black K train. You may reassure or accuse her. If trust falls too low, play **Eleanor's wire recording** to establish your intentions, preventing a permanent dead end.
- In the signal cabin, recover the transfer timetable, examine the emergency route map, and unlock the signal board with Elsie's master key.
- The signal-routing puzzle is **not another numeric safe**: throw levers **A, B, C** in the *order documented in the dispatch timetable*. A mistaken lever sequence resets cleanly; the correct sequence restores access to the passenger car.
- Explore Car 09 to recover **Eleanor's one-way Exchange ticket**, a **Kingfisher ledger leaf** hidden in the conductor's lockbox, and an optional brass badge. The ticket triggers another memory fragment.
- At the service lift, decide whether to **warn Vera** or proceed **without alerting anyone**. Both paths record different evidence and lead toward the next chapter, the **Old Exchange**.

### Player controls, saving and architecture
- Existing **LOOK, TAKE, OPEN, USE, GO, TALK** commands (keys **1–6**) still work with pixel-art hotspots and labeled accessible HTML buttons.
- The switchboard and Elsie conversation use interactive, keyboard-accessible button panels. The chapter's final choice is evidence-gated so you cannot accidentally leave without Eleanor's ticket and ledger.
- Chapter rules reside in `src/chapter6.js`; 320×200 environment rendering in `src/chapter6-art.js`. The browser UI and shared story-state engine remain independent in preparation for a future Quest 3/XR adapter.
- **Versioned save v6** imports v1–v5 case exports, preserves earlier chapter snapshots, and uses the existing browser storage key.
- Offline service worker cache updated to `blackout-forgotten-rails-v6` with both new modules. No external gameplay libraries or art dependencies.
- This release adds no audio, XR or multiplayer client. Full browser QA on real hardware is still recommended.

### Chapter 6 play path
1. At the tunnel, examine the emergency map. GO to the platform; TALK to Elsie. Show evidence if she's wary, then ask about the train to receive her signal key.
2. GO to the cabin; TAKE the dispatch timetable. OPEN the signal board.
3. Throw the three signal levers in the timetable's documented order. Return to the platform and GO into Car 09.
4. TAKE Eleanor's ticket. OPEN the conductor's case, TAKE the ledger, optionally collect the badge.
5. GO to the service lift hatch. Choose whether to warn Vera or investigate alone.

## Rung 5: Warehouse Shadows (v0.5.0)

**A fifth playable chapter extends the BLACKOUT noir mystery.** Finish Ashworth Manor, make your decision with Vera, and select **CONTINUE TO CHAPTER 5: WAREHOUSE SHADOWS** in the case controls. Your earlier findings, dialogue, trust and agency case file carry forward.

### Investigate the South Branch docks
- Explore four new original procedural pixel-art scenes: the **dock gate**, **loading bay**, **freight dispatch office**, and **sealed cargo container**.
- Show the night watchman the **black K chip** you recovered from Ashworth Manor to get past the chained gate. His initial trust reflects the decision you made about Vera and Harold. The watchman has additional dialogue options that further change his disposition.
- Search the dispatcher office: OPEN the old filing cabinet, TAKE a secret freight manifest, and optionally question the harbor radio for an illegal-shipment clue.
- Examine the freight container's three-digit seal. The manifest and environmental clues identify the code in the order **QUAY / SHIFT / BAY**. Set the three wheel controls and release the cargo seal.
- Inspect the concealed passenger hold. Discover a **wire recording marked E.A.**, a secret **transfer roster** and an optional **burned barge photograph**.
- Near the service tunnel, choose how to handle the original records and whether to protect witness identities. Both choices yield different persistent clues and will matter in future chapters.
- The closing scene leads toward **the old city rail yards**, preserving the mystery of the Kingfisher's identity for later.

### Controls and compatibility
- Commands **LOOK / TAKE / OPEN / USE / GO / TALK** remain available by mouse or keyboard **1–6**. Every puzzle also has labeled buttons and object-list hotspots.
- Freight-seal dials have accessible increment/decrement controls and expose the story hint from the manifest.
- Pure deterministic chapter rules live in `src/chapter5.js`. Original 320×200 scenes live in `src/chapter5-art.js`, separate from the shared case engine and browser interface.
- The versioned save format is **v5**, accepting v1 through v4 saves. Previous chapter inventory, trust outcomes, memories, and completed evidence-board state remain available.
- Offline cache advances to `blackout-warehouse-v5` and includes the new game files. No runtime packages or external graphics required.
- **No Quest 3 VR mode or production audio yet**; those will be separate future implementations.

### Chapter 5 play path
1. TALK to the night watchman, reveal the black K passmark, and GO through the gate.
2. GO to the freight office. OPEN the cabinet and TAKE the freight manifest.
3. Return to the loading bay and OPEN the cargo container. Dial the three digits given by the QUAY / SHIFT / BAY records, then release the seal.
4. GO into the container. TAKE the recorder and passenger roster. OPEN the crate for a photograph.
5. GO toward the service tunnel and choose how to handle the evidence to finish Chapter 5.

## Rung 4: Ashworth Manor (v0.4.0)

**Vincent Morrow's fourth chapter is playable.** Finish the Agency investigation and answer Vera's call, then choose **CONTINUE TO CHAPTER 4: ASHWORTH MANOR** in Case Controls. All prior clues, memories, trust, moral choices and inventory carry forward.

### Investigate the mansion
- Explore four original procedural pixel-art scenes: the rain-soaked **estate gates**, **grand foyer**, **Eleanor's bedroom**, and **Harold's study**.
- TALK to the gatekeeper before the iron gates will open. The Estate already knows Vincent's name.
- Interview **Harold Ashworth**, Eleanor's father. His evasions, answers about Marcus Webb, and suspicious payments add evidence. Promises and accusations change his separate trust state.
- Search Eleanor's vanity and jewelry box to collect a **torn diary page**, **hidden love letters**, and another memory fragment.
- Inspect the mechanical **family portrait**, then select its three rotating brass nameplates in the diary's implied order to reveal the **black K poker chip**.
- Search Harold's study ledger, optionally match the old payment receipt, and confront **Vera** when enough evidence has been recovered.
- Make the first major **trust decision**: challenge Harold openly with Vera present, or allow Vera to leave before speaking privately. Both outcomes persist for future chapters.
- The story ends with the **Warehouse District** lead, setting up Chapter 5.

### How to play Chapter 4
1. At the gate, TALK to the gatekeeper, then GO through the manor entrance.
2. In the foyer, TALK to Harold. Investigate his answers and the family portrait.
3. GO to Eleanor's bedroom. OPEN the vanity and jewelry box; TAKE the diary and love letters.
4. GO to Harold's study. TAKE the ledger; LOOK at the family portrait. Select the nameplates in the order implied by Eleanor's diary.
5. TAKE the black K chip. If Vera does not appear yet, return to the foyer and speak with Harold, then visit the study again.
6. TALK to Vera and make your final decision. Review the notebook's recorded consequence.

### Technical design and continuity
- The original engine is still source-of-truth for chapter, inventory, memories, clues and choices.
- `src/chapter4.js` owns new deterministic puzzle/dialogue rules. `src/chapter4-art.js` draws new original Canvas scenes. The browser interface remains separate for later XR adaptation.
- Save schema **v4** imports **v1/v2/v3** files and retains the earlier Chapter 3 evidence-board snapshot, while keeping the browser storage key unchanged.
- Fully offline-capable on previously loaded supported secure browsers; the app shell has a versioned service worker cache.
- All critical portrait and dialogue interactions have readable HTML button alternatives to clicking pixel art.
- No new third-party runtime or art dependency; **no VR mode yet**.

## Rung 3: The Agency (v0.3.0)

**The ransacked office is playable.** Complete Chapter 2, then choose **CONTINUE TO CHAPTER 3: THE AGENCY** under Case Controls to carry Vincent's notebook, memories, evidence and choices into the next investigation.

### Investigate
- Explore two original pixel-art scenes, **Vincent's ransacked detective office** and its dusty **records room**.
- Search the false-bottom desk and drawer to recover the detective notebook and a photograph of Eleanor Ashworth and Marcus Webb.
- Investigate the archive calendar, hidden diary entry and suspicious payment receipt.
- Piece together the clues on the wall safe: **PORTRAIT / DATE / HOUR**. Adjust each of its three combination dials with arrow buttons; test the combination to unlock Eleanor's confidential case file.
- Visit the **evidence board**, where three evidence connections must be established. The missing portrait, the silver lighter from Tommy, and the confidential file gate these deductions. Incorrect or premature guesses provide clues without soft-locking progress.
- Hear the police bulletin, complete the board, and **TALK** to the ringing telephone. Vera's invitation to Ashworth Manor ends Chapter 3.

### Controls and accessibility
- Continue using **LOOK / TAKE / OPEN / USE / GO / TALK** (keys **1–6**), the scene hotspots, or the labeled **OBJECTS IN VIEW** buttons.
- The safe's dials have explicit increase/decrease buttons and the evidence board has labeled choice buttons. Pixel art is optional for selecting all critical interactions.
- Local save version **3** automatically accepts and upgrades versions **1 and 2** (including chapter-completion saves), retaining collected evidence and choices.
- The original Chapters 1 and 2 remain playable. The timed police chase is still confined to the hotel.
- The agency and archive rendering module is independent of the story-state rules for later VR/XR adaptation.
- **No audio or VR is included yet.** The next story rung is Ashworth Manor and the first trust confrontation.

### Chapter 3 route
1. Open the desk, then the drawer; inspect and TAKE the gala photograph. Recover your notebook.
2. LOOK at the clock and the records room calendar for the rest of the safe clues. Search the records cabinet.
3. Inspect the safe and rotate its three dials using the clue order engraved on the plate. TAKE the confidential case file from inside.
4. LOOK at the case board and connect Eleanor, Kingfisher, and Webb using the accumulated evidence.
5. Once the telephone starts ringing, TALK to it to hear Vera's invitation and finish the chapter.

## Rung 2: Neon Streets and the Crimson Lounge (v0.2.0)
BLACKOUT continues beyond the Marmont escape! Follow the red matchbook into the streets of Chicago and discover how much Tommy Two-Fingers remembers.

**What is new**
- Three original 320×200 pixel-art scenes: animated neon street, Crimson Lounge interior, and the detective agency exterior.
- A sixth verb, **TALK** (keyboard **6**), for questioning witnesses and interacting with the world.
- An atmospheric newspaper stand, police patrol, bouncer, jazz pianist, and a bartender with something to hide.
- Tommy's multi-step conversation remembers the questions you ask, your promises, and whether you threatened him.
- Find the Kingfisher lead, collect his engraved lighter, unlock another memory fragment, and reach Vincent's agency to complete Chapter 2.
- A **CONTINUE TO CHAPTER 2** action appears after escaping the hotel. Previous v1 browser saves and exported JSON case files are upgraded in-place to v2. The browser storage key remains intentionally unchanged.
- Scene and dialogue systems are kept separate from the case-state engine to support later WebXR development, rather than rewriting the story.
- Offline PWA cache version updated to ship the new scene module and prevent stale code.
- The original first chapter remains replayable, with a small fix to stop already-open cabinets repeatedly presenting the same discovery.

**Suggested play path**
1. Finish the hotel escape and click **CONTINUE TO CHAPTER 2**.
2. Examine the neon street. TAKE the newspaper for the Ashworth clue, then GO through the red club door.
3. TALK to Tommy Two-Fingers. Ask about last night, then Kingfisher. Your dialogue choices can make him trust you or clam up.
4. TAKE the silver lighter after Tommy places it on the bar. Return to the street, then GO to the detective agency.
5. Export the versioned case file if you want a backup of all your clues and choices.

**Scope:** Chapter 3 stops at the agency door, intentionally. The next rung will build the ransacked office and case-board investigation. The Chapter 2 dialogue is written specifically for this slice; the full BLACKOUT story bible governs later canon review.

## Rung 1: Blood on the Mirror (v0.1.0)
An original browser-playable prologue with NES-era point-and-click inspiration, built from vanilla JavaScript and procedural pixel art. No external runtime dependencies or third-party game graphics.

**Play:** Visit https://michaelwave369.github.io/Blackout/ after the relevant chapter's PR is merged and the Pages workflow succeeds. Alternatively, open `index.html` through a local static HTTP server. ES modules will not load reliably from `file://` URLs.

### How to play
- Press **1–6** or click **LOOK / TAKE / OPEN / USE / GO / TALK**.
- Click the illustrated scene or an **OBJECTS IN VIEW** button to target the object.
- To combine items, click an inventory item. This chooses **USE**; then click its target.
- Open the medicine cabinet and inspect the jacket. Don't forget the mirror, the victim, and the red matchbook.
- Get to the fire escape before the police arrive. The **Story mode** toggle removes the arrest deadline for unhurried play.
- An automatic local browser save follows each action (including conversation choices). Export a JSON case file to back it up and import it later; don't trust browser storage across devices.

### Prototype features
- Four rendered scenes: hotel bathroom, room 214, fire escape, rainy alley.
- Clues, inventory, object combinations, first memory fragment, and a branching evidence-preservation decision.
- Retro scene illustrations rendered directly in Canvas at **320×200** and scaled without blur.
- Real-time visual feedback, readable narrative transcript, and accessible alternative hotspot buttons.
- Deterministic `src/engine.js` with a **versioned save contract**, isolated from the rendering layer for a future XR port.
- Works without a server-side account. After a successful online visit, the service worker caches the app shell for offline play in supported secure browsers.
- Tests for puzzle gating, clue collection, memory, moral choice, arrest timer, import validation, and winning the hotel escape.

### Run checks
Requires Node.js 22+ for the project test commands.

```sh
npm run check
npm test
```

To run locally, serve the repository directory through any static HTTP server (for example `python -m http.server 8000`) and open `http://localhost:8000`.

## Narrative origin and production
BLACKOUT began in November 2025 as a first-person noir investigation inspired by the *feel* of classic detective adventures. The original BLACKOUT master design bible remains the story's authority. This prologue uses the *Marmont Hotel* naming provisionally; archive material also uses *Marlow*, so final naming is a separate canon decision.

**Roadmap:** retro prologue → Crimson Lounge and witnesses → ransacked agency investigation → Ashworth Manor → Warehouse Shadows → Forgotten Rails → Old Exchange → complete branching noir case → 3D/Quest 3 XR adaptation, preserving a stable versioned clue and decision schema across modes. This version does **not** yet have a VR client or multiplayer.

### Project structure
| File | Purpose |
| --- | --- |
| `index.html` | Semantic game UI |
| `styles.css` | Retro noir visuals and responsive layout |
| `src/engine.js` | Portable investigation state, puzzle rules, choices, save validation |
| `src/app.js` | Browser interface, Canvas room art, local persistence, case export/import |
| `src/chapter2-art.js` | Procedural neon street, lounge and agency-exterior scenes |
| `src/chapter3.js` | Agency and records-room puzzles, safe and evidence deductions |
| `src/chapter3-art.js` | Original ransacked office and records-room pixel art |
| `src/chapter4.js` | Ashworth Manor, Harold and Vera dialogue, portrait puzzle, branching consequences |
| `src/chapter4-art.js` | Original mansion gate, foyer, bedroom and study scenes |
| `src/chapter5.js` | Dockside witness interaction, freight seal, and evidence-choice state |
| `src/chapter5-art.js` | Original night dock, loading bay, dispatch office, and freight hold art |
| `src/chapter6.js` | Elsie Vale witness and signal-switch puzzle, carriage evidence and ending choice |
| `src/chapter6-art.js` | Original railway tunnel, cabin, platform and passenger carriage scenes |
| `sw.js` | Offline app shell |
| `test/engine.test.mjs` | Native Node tests |
| `.github/workflows/test.yml` | CI on PRs and pushes |
| `.github/workflows/pages.yml` | Test-gated GitHub Pages deployment |

## Credits and rights
Source code is **MIT licensed**. The **BLACKOUT** title, fictional world, characters, story, dialogue, and original art/audio assets retain their separate creative rights and are not granted under the code license unless specifically identified. Third-party assets must have license provenance reviewed before being added.

Original BLACKOUT concept and direction: MichaelWave369 / Matchbook Games.
