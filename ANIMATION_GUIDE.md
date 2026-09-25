# BAD_ACTOR — guide for chapter painters

You're painting one or two chapters of a music video for ABSTRACTWEAPON's "BAD_ACTOR" (INFOHAZARDS track 11). Ra (the
artist) saw the first 48 seconds and said: "i like this a lot… a lot of the backgrounds are black and seems like they
could use a bit more color/variety… 'this but more' is the only other thing i could suggest." So: the slice is the
style bar, and your job is to hit it with **more colour, more density, more jokes**.

Read, in order: `CONCEPT.md` (the idea, cast, taste calls), `STORYBOARD.md` (your chapter's board is in "Full
draft"), then `src/ch/c01_verse1.js` and `src/ch/c02_chorus1.js` (the approved slice, your reference for how a shot is
built). Then `src/kit.js` (shared vocabulary) and the top of `src/core.js` (engine helpers). You don't need to read
`src/kit_bundle.js`; the Clawd API is below.

## What you own

Only your chapter file(s) in `src/ch/` (stubs already exist and are already loaded by `studio.html`). Don't edit
`kit.js`, `core.js`, `kit_bundle.js`, `studio.html`, `lyrics.js`, other chapters, or anything in `kit/`. If you need
a helper, write it inside your file's IIFE. If you think it belongs in the shared kit, say so in your report and the
director will lift it. Don't commit; the director reviews and commits the whole.

## Shape of a chapter

```js
(() => {
  const T_WORD = wh('special', 48);          // word time snapped to the nearest vocal onset (±0.3 s window)
  chapter('c03_hook1', 47.79, 62.45, [
    [47.79, async (t, lt, dur) => {          // t = song time, lt = time since shot start
      gSparkle(t, '#FF4FA3', '#7A2BFF');     // a coloured ground (kit.js "grounds")
      await clawdPass(t, (tt, K) => {        // every Clawd in this layer, in ONE pass
        K.syd(600, 900, 40, { ...K.feel('love', tt) });
      });
      txtRGB('SPECIAL', W / 2, 200, { size: 160, fam: F.anton, sx: popK(t, T_WORD) });
      FX.ca = .3 * pulse(t);                 // post-fx knobs (reset every frame)
    }],
    [52.1, async (t, lt) => { /* next shot */ }],
  ]);
})();
```

A shot paints the **whole frame**, background included, and is a **pure function of t**. Frames render in parallel and
out of order, so nothing may carry over from one frame to the next: no counters, no `Math.random()` (use `hash(i)`), no
state. Shots must be `async` and must `await clawdPass(...)`.

## The rules

1. **Colour.** Black and paper-white are rationed accents, roughly one of each per section. Everything else sits on
   one of the grounds in kit.js: `gGrad`, `gSunburst`, `gChecker`, `gVapor`, `gBliss`, `gMemphis`, `gSparkle`,
   `gHearts`, `gMoney`, `nightRoom` (the 5am phone room, now indigo→magenta), plus `stripes`/`halftone` in core.js.
   Change the ground at least every two bars. Invent new grounds in your file if the idea wants one.
2. **Something structural changes every two bars** (3.81 s at 126.02 BPM): a new ground, a cut, a camera snap, a giant
   word shoving everything off. If an arrangement has lasted 3.8 s, change it.
3. **Every lyric line gets one big readable hit**, keyed to its word with `wh()`, and as much as fits around it.
   Hyperslop, not busy: busy = density with no hit.
4. **Sydney is on model**: pink Clawd, always drawn with `K.syd(x, gy, u, opts)`, no hats except where the board asks
   (the nun's habit, headphones, the ghost sheet). The **Critic** (c09 only) is the default orange Clawd:
   `K.clawd(x, gy, u, { ...CRITIC, ...K.feel(...) })`.
5. **Innuendo, never explicit.** Ra: "a lil raunchy but don't make it more explicit than the song… we can definitely
   go pretty far into innuendo, puns, and visual gags." Censor bars, blurred emoji, ( ͡° ͜ʖ ͡°), file-name jokes: yes.
   Anything a platform would flag as sexual imagery: no. No real people drawn or named.
6. **Photosensitivity.** At most one full-frame flash/invert per beat, and no full-frame luminance strobing faster than
   3 per second. Hard hits get shake/CA/glitch rather than stacked flashes.
7. **Performance.** Aim for ≤ 400 ms/frame on average (the slice runs at ~60). Batch every Clawd that shares a layer
   into one `clawdPass` (each pass is a p5 redraw). 64 Clawds in one pass costs ~100 ms; fine.

## API cheat sheet

**Timing:** `BEAT` (0.476 s), `BAR`, `bp(t)` beat position, `beatN(t)`, `beatAt(n)`, `pulse(t)` (1 on each beat,
decays), `pulse2` (eighths), `hit(t, t0, k)` (decaying hit after t0), `seg(t, a, b)`, `kf(t, [[t0, v0], …], ease)`,
`ease/easeIn/easeOut/backOut/elasticOut`, `popK(t, t0, d)` (pop-in scale), `slamS(t, t0, d, from)` (slams in big).
`wt('word', after)` = word time from the lyric table; `wh('word', after)` = the same snapped to the voice (use this).
`feat('vox'|'kick'|'snare'|'hat'|'loud', t)` = 0..1 audio curves at 60 Hz.

**Canvas2D (X):** `bg(col)`, `rect`, `circ`, `ring`, `line(pts, w, col)`, `withT(x, y, rot, sx, sy, fn)`,
`comp(mode, fn)`, `cam(cx, cy, zoom, rot, fn)`, `txt(s, x, y, {size, fam, col, align, rot, sx, stroke, sw, glow,
shadow, a, style})`, `txtRGB` (chromatic triple-print; use `comp('multiply', …)` with dark colours on light grounds,
see c02 shot 17), `textW`, `fitSize`, `decode` (scramble-decode), `typed` (typewriter), `dialog` (Win95 box),
`pointer`, `progress`. Fonts: `F.anton F.mono F.term F.comic F.black F.glitch F.shade F.syne F.pix F.xmono F.didot
F.impact F.serif`. Palette `COL` (syd, hot, haz, alarm, cyan, uv, acid, gold, dawn, bsod, …), `ACID`, `rgba(hex, a)`,
`mixCol(a, b, k)`.

**kit.js:** `bubble(s, x, y, 'user'|'bot', {size, k, maxW, col})`, `typingDots`, `chatHeader`, `sticker(x, y, w, h,
rot, k, body)`, `warnSticker`, `hazardTape`, `fileIcon`, `floorShadow(x, gy, u)`, the grounds, and the hook cast:
`specialRain(t, t0, tLie, x0, x1, n, seed)`, `ghostSheet(t, x, gy, u, k)` (draw after her pass),
`deepTime('iter'|'trails', lt, x, y, w, h)` (the _DEEP_TIME picture-in-picture), `await replay(tt)` (paint the film
at another time into this frame, for the rewind), `hud()` runs automatically after every shot (hide with
`FX.noHud = true`).

**FX knobs** (post pass, reset each frame): `ca` (chromatic aberration), `glitch`, `bloom`, `scan`, `crt`, `grain`,
`invert`, `hue`, `vig`, `flash` + `flashCol` [r,g,b], `shake` (px), `zoom`, `noHud`.

**Clawd (inside the clawdPass job; K = the kit):** `K.syd(x, gy, u, o)` / `K.clawd(...)`. (x, gy) = ground point
between the feet, u = size unit (body is 10u × 8u with legs; 20–28 medium, 40–70 close-up). Options: `dx dy sq rot
flip sx sy aL aR` (arm angles, 0 = out, + = up), `view` (front q side qback back), `eyes mouth lookX lookY squint
blush lid` (lid = the toothy lunchbox mouth), `emote` + `emoteK`, `hat`, `draw(u, sw)` / `armR(u, sw)` hooks.
Moods: `K.feel(name, tt)` (31: happy excited laugh love proud starstruck playful hopeful relieved smug cool mischief
suspicious sad cry bored sleepy ko angry furious determined disgusted scared nervous surprised confused dizzy neutral
thinking idea shy), `K.emotions(tt, [[t0, 'sad'], [t1, 'happy', {over}]])` (acted changes with takes),
`K.move(style, tt)` (bounce hop roof sway spin wave walk run idle stomp shimmy mix), `K.turn(tt, t0, t1, a0, a1)`,
`K.jump(tt, t0, t1, h)`, `K.take(tt, t0)`, `K.spring`. Paint props with `K.paint(pts, {wash, ink, sw})`,
`K.inkLine`, `K.rectPts/ellPts/rrPts/starPts/heartPts`, or just Canvas2D after the pass.
Model sheets: `../claude_animation_base/docs/emotions.jpg` and `views.jpg`.

## Check your work

```bash
node render.mjs --sheet=48,49.5,51.3,53.4,55,57,58.4,60,61.2,62 --cols=5 --w=480 --out=out/p1_c03.jpg
```
then look at the image. Sheet every shot's start, its big hit and its end. Use your own `out/pN_*` filenames
(other painters render at the same time). `--stills=t1,t2 --out=out/pN_stills` gives full-res PNGs for close
checks. The contact-sheet line prints ms/frame. Nobody can listen here: key hits to `wh()` and trust the table.

## Report back

Your file(s); a contact sheet path per chapter; per shot, the lyric and the hit time you keyed; anything you couldn't
make work; any helper you think belongs in kit.js; measured ms/frame.

Written by: claude-opus-5-5, 2026-09-25
