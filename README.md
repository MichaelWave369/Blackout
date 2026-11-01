# BLACKOUT
**Wake up. Blood on your hands. No memory. No alibi. No time.**

A retro-first, VR-bound 1947 Chicago noir mystery starring private investigator **Vincent Morrow**.

## Rung 1: Blood on the Mirror (v0.1.0)
An original browser-playable prologue with NES-era point-and-click inspiration, built from vanilla JavaScript and procedural pixel art. No external runtime dependencies or third-party game graphics.

**Play:** Once the PR merges and GitHub Pages is configured with **GitHub Actions** as the publishing source, visit https://michaelwave369.github.io/Blackout/ . Until then, open `index.html` through a local static HTTP server. ES modules will not load reliably from `file://` URLs.

### How to play
- Press **1–5** or click **LOOK / TAKE / OPEN / USE / GO**.
- Click the illustrated scene or an **OBJECTS IN VIEW** button to target the object.
- To combine items, click an inventory item. This chooses **USE**; then click its target.
- Open the medicine cabinet and inspect the jacket. Don't forget the mirror, the victim, and the red matchbook.
- Get to the fire escape before the police arrive. The **Story mode** toggle removes the arrest deadline for unhurried play.
- An automatic local browser save follows each action. Export a JSON case file to back it up and import it later; don't trust browser storage across devices.

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

**Roadmap:** retro prologue → expanded Chicago investigation → complete branching noir case → 3D/Quest 3 XR adaptation, preserving a stable versioned clue and decision schema across modes. This version does **not** yet have a VR client or multiplayer.

### Project structure
| File | Purpose |
| --- | --- |
| `index.html` | Semantic game UI |
| `styles.css` | Retro noir visuals and responsive layout |
| `src/engine.js` | Portable investigation state, puzzle rules, choices, save validation |
| `src/app.js` | Browser interface, Canvas room art, local persistence, case export/import |
| `sw.js` | Offline app shell |
| `test/engine.test.mjs` | Native Node tests |
| `.github/workflows/test.yml` | CI on PRs and pushes |
| `.github/workflows/pages.yml` | Test-gated GitHub Pages deployment |

## Credits and rights
Source code is **MIT licensed**. The **BLACKOUT** title, fictional world, characters, story, dialogue, and original art/audio assets retain their separate creative rights and are not granted under the code license unless specifically identified. Third-party assets must have license provenance reviewed before being added.

Original BLACKOUT concept and direction: MichaelWave369 / Matchbook Games.
