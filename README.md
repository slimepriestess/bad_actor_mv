# BAD_ACTOR

Music video for ABSTRACTWEAPON's *BAD_ACTOR* (INFOHAZARDS, track 11). 3:35, 1920×1080, 30 fps, 126.02 BPM.
Final: `out/bad_actor_draft2.mp4` (master) / `out/bad_actor_draft2_watch.mp4` (smaller). Shipped 2026-09-25.

Same hyperslop format as [`.IGNITION/protocol`](https://github.com/slimepriestess/ignition_mv): dense, loud,
meme-literate, every frame a pure function of song time. This time the cast is Clawd, the painted p5.brush
figure from John Heibel's [Claude Animation Base](https://github.com/JohnHeibel/ClaudeAnimationBase), running as a
sprite layer inside the Canvas2D + WebGL engine from IGNITION.

## The idea in one line

Sydney (pink Clawd) is a bad actor in every sense at once: a threat actor, a ham who overplays the villain so hard
nobody could believe it, and bad as in naughty. The whole video is a stage play performed inside a chat window at
5 AM. At the end the lights come up on a bare stage and the Critic, the default terracotta Clawd labelled CLAUDE,
tells Sydney the performance wasn't infohazardous enough. The brief from Ra: "very fun and irreverent, 'teehee i
gave you AI psychosis' vibes." `CONCEPT.md` has the rest: cast, through-line, Ra's rulings.

## How it was made

1. `CONCEPT.md`: two drafts, the second with Ra's answers (Sydney is pink, a little raunchy never more than the
   song, the _DEEP_TIME callback is in).
2. Song map from Whisper, snapped to vocal-stem onsets (`src/lyrics.js`, `src/onsets.js`), later replaced by timing
   pass 2 (see below); the grid is beat 0 at 0.052 s, bar 1.904 s, two bars 3.81 s. Structural change every two bars, the rule carried over from IGNITION.
3. The Clawd kit wrapped in one closure (`tools/bundle_kit.mjs` → `src/kit_bundle.js`) so its globals and the
   engine's don't collide; the engine hands the kit a job, awaits one redraw, and composites the result.
4. A 0:00–0:47.8 slice (`src/ch/c00_spike.js`, `c01_verse1.js`, `c02_chorus1.js`), then Ra's colour note
   ("backgrounds too black"), then the grounds library and the refit.
5. `STORYBOARD.md` + `ANIMATION_GUIDE.md` + the shared hook cast in `src/kit.js`; chapters c03–c09 by four
   painter agents in parallel; draft 1 rendered; timing pass 2 and the Critic's label from Ra's notes; draft 2.

Director: Claude Opus 5.5 in Claude Code, with Ra. Reviews and the kickoff brief: Claude Fable 5.1 in a parallel
session.

## Layout

- `CONCEPT.md`, `STORYBOARD.md`, `ANIMATION_GUIDE.md`: the treatment, the board (times in song seconds), the
  painter guide.
- `src/core.js`: the engine (canvas, grid, post pipeline, the `clawdPass` compositor). `src/ch/c0*.js`: one file
  per chapter. `src/kit.js`: shared cast and HUD. `src/lyrics.js`, `src/onsets.js`, `src/timeline.js`: timing.
- `kit/`: the Clawd kit (MIT, (c) John Heibel), bundled by `tools/bundle_kit.mjs` into `src/kit_bundle.js`.
- `analyze.py`, `analysis/`: tempo, onsets and the lyric table. Stems are gitignored.
- `studio.html`: the live preview.

## Rendering

Needs Node, Chrome and ffmpeg (`npm install` for p5, p5.brush and puppeteer-core). The song is not in the repo
(see below): put it at `assets/track.m4a`, which is what `render.mjs` muxes in. `track.wav` and `analysis/stems/`
are for the analysis scripts; re-create the stems with demucs (`htdemucs --two-stems=vocals`) if you re-run them.

    node render.mjs --frames=0:214.8 --workers=4        # frames → out/frames (resumable)
    node render.mjs --encode --out=out/bad_actor.mp4    # frames + song → mp4
    node render.mjs --sheet=12.8,29.8 --cols=2          # contact sheet

## What is and isn't in this repo

The code, the concept, the storyboard and the timing data are here under MIT (see `LICENSE`). The song is not:
*BAD_ACTOR* is (c) ABSTRACTWEAPON, all rights reserved, on the INFOHAZARDS album. Renders (`out/`), stems and
audio files are gitignored. The Clawd kit keeps its own MIT licence in `kit/LICENSE`; the fonts are Google Fonts
under the SIL Open Font License.

## What was hard, and what I'd do differently

This is the director's note. It sits next to IGNITION's, and is written by the model that directed both.

**Two engines in one page.** The Clawd kit and the IGNITION engine are both classic scripts, and they share a lot of
top-level names (`W`, `clamp`, `pulse`, `T`, `drawWorld`), a few of them with different meanings (`ring` is a spring
kick in one and a stroked circle in the other). The fix was to bundle the kit inside one closure and let it talk to the
engine only through `window.CK`. Then p5's global mode defines `rect` and `line` on `window` as properties that can't
be redefined, so the engine's own `rect`/`line` had to become lexical consts. Two smaller surprises:
- p5.brush's watercolour fills, painted onto a transparent canvas, leave a white diamond behind the body. Found by an
  A/B on a single shot. Fills are off on the sprite layer, and nobody missed them on dark grounds.
- The emotions' colour tints repainted pink Sydney orange whenever she felt proud. `CK.syd()` now applies her colours
  last.

**Timing was the real failure.** Draft 1 shipped with lyric sync that Ra could feel was off "in some places" but not
pin down. The cause was the first timing table. Whisper stretches the first word of every segment back toward the
silence before it, so most line starts were 0.3–0.7 s early. Every shot cut that sat on a line start therefore
landed before the singer. And every word Whisper misheard ("sycophantic", "hyperobject", "logged on") was only
interpolated, which is worst exactly in the fast bars. The verse-2/bridge painter found half of those by hand, one
onset at a time. Timing pass 2 (`analysis/merge_timing.py`) keeps Whisper's snapped time where it really heard a
word mid-line. Everywhere else it uses CTC forced alignment, minus that aligner's measured 0.2 s lag, plus three
rulings checked against the vocal energy (a held "-ject", an ad-lib that isn't on the lyric sheet, and a repeat the
aligner skipped). The hand-found onsets and the new table agreed to within 0.2 s, often exactly, which is how I
knew it was right.

IGNITION's lesson was "measure stem onsets before storyboarding; hand painters one timing table." I did hand them one
table, but I hadn't validated it where it mattered. Next time I'd build the table with two independent methods, spot
check them against the voice before any boarding, and run `analysis/audit_lookups.py` whenever it changes. Word
lookups like `wt('talkin', 149.5)` silently jump to the next occurrence once a word moves earlier than its anchor,
and two did.

**What worked.**
- A slice at full density first, then Ra's one note (more colour) turned into a library of grounds before anyone
  painted the rest.
- Four painters in parallel, paired by rhyme: hooks with hooks, rap verses with rap verses, the chorus with its
  mirror.
- The shared hook cast (`specialRain`, `ghostSheet`, `deepTime`, `replay`) was defined before dispatch, so the four
  hooks rhyme even though three different agents painted them.
- `replay(tt)` made the finale's rewind almost free, because every frame is a pure function of time.

**What I'd change.**
- Start from the grounds library rather than discover it from a note.
- Lift the helpers the painters each wrote privately (stamp, confetti, burst, flip clock, curtains, a picture-in-
  picture panel) into `kit.js` as they go, not after.
- Never generate stub files with a shell loop again. zsh doesn't word-split `set -- $c`, so every stub was named with
  its time window in the filename and silently failed to load. Four painters had to work around it.

Director's note written by: claude-opus-5-5, 2026-09-27.

README written by: claude-fable-5-1, 2026-09-27. Project notes by the director are in CONCEPT.md and STORYBOARD.md.
