# BLACKOUT
**Wake up. Blood on your hands. No memory. No alibi. No time.**

A retro-first, VR-bound 1947 Chicago noir mystery starring private investigator **Vincent Morrow**.

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

**Roadmap:** retro prologue → Crimson Lounge and witnesses → ransacked agency investigation → Ashworth Manor → complete branching noir case → 3D/Quest 3 XR adaptation, preserving a stable versioned clue and decision schema across modes. This version does **not** yet have a VR client or multiplayer.

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
| `sw.js` | Offline app shell |
| `test/engine.test.mjs` | Native Node tests |
| `.github/workflows/test.yml` | CI on PRs and pushes |
| `.github/workflows/pages.yml` | Test-gated GitHub Pages deployment |

## Credits and rights
Source code is **MIT licensed**. The **BLACKOUT** title, fictional world, characters, story, dialogue, and original art/audio assets retain their separate creative rights and are not granted under the code license unless specifically identified. Third-party assets must have license provenance reviewed before being added.

Original BLACKOUT concept and direction: MichaelWave369 / Matchbook Games.
