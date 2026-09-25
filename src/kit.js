// kit.js — shared hyperslop vocabulary for BAD_ACTOR: lyric lookup, chat UI, stickers, hazard tape, HUD.
// Globals; any chapter may use them. Canvas2D only (Clawds go through clawdPass in core.js).

// ---------- lyrics ----------
// wt('Nova') → onset time of the first matching word at or after `after` (seconds). Words are lower-cased and
// stripped of punctuation. Throws if missing, so a typo can't silently put a hit at t = 0.
const _norm = s => s.toLowerCase().replace(/[^a-z0-9$]/g, '');
function wt(word, after = 0) {
  const w = _norm(word), hit = LYR.find(([t, x]) => t >= after - 1e-3 && _norm(x) === w);
  if (!hit) throw new Error(`wt: no "${word}" after ${after}`);
  return hit[0];
}
const beatAt = n => OFF + n * BEAT;                    // time of beat n
const snapBeat = t => beatAt(Math.round((t - OFF) / BEAT));
const ctrl = t => clamp((feat('vox', t) - .25) * 1.6);  // vocal loudness 0..1 (mouths, pulses)

// ---------- geometry ----------
function rr(x, y, w, h, r) { X.beginPath(); X.roundRect(x, y, w, h, r); }
function rrFill(x, y, w, h, r, col, a = 1) { X.globalAlpha = a; X.fillStyle = col; rr(x, y, w, h, r); X.fill(); X.globalAlpha = 1; }
function rrStroke(x, y, w, h, r, col, lw = 4, a = 1) { X.globalAlpha = a; X.strokeStyle = col; X.lineWidth = lw; rr(x, y, w, h, r); X.stroke(); X.globalAlpha = 1; }
// pop-in scale for something that lands at t0 (0 before, overshoots, settles)
const popK = (t, t0, d = .18) => t < t0 ? 0 : backOut((t - t0) / d);
// slam: arrives big and fast, settles to 1
const slamS = (t, t0, d = .12, from = 2.2) => t < t0 ? 0 : lerp(from, 1, easeOut((t - t0) / d));

// ---------- chat ----------
// Word-wrap s to maxW at the current font; returns lines.
function wrap(s, maxW) {
  const out = []; let cur = '';
  for (const w of s.split(' ')) { const nx = cur ? cur + ' ' + w : w; if (X.measureText(nx).width > maxW && cur) { out.push(cur); cur = w; } else cur = nx; }
  if (cur) out.push(cur); return out;
}
// A chat bubble. side 'user' (right, blue) or 'bot' (left, grey). (x, y) = top edge anchor on its side.
// Returns the bubble height so stacks can advance. o: {size, k (0..1 pop), maxW, col, tcol, fam, a}
function bubble(s, x, y, side, o = {}) {
  const size = o.size ?? 34, fam = o.fam ?? F.mono, maxW = o.maxW ?? 620, pad = size * .55;
  setFont(size, fam); const lines = wrap(s, maxW), lw = Math.max(...lines.map(l => X.measureText(l).width));
  const w = lw + pad * 2, h = lines.length * size * 1.25 + pad * 1.4, k = o.k ?? 1;
  if (k <= 0) return h;
  const bx = side === 'user' ? x - w : x, col = o.col ?? (side === 'user' ? COL.bubUser : COL.bubBot);
  X.save(); X.globalAlpha = o.a ?? 1;
  X.translate(side === 'user' ? x : x, y); X.scale(k, k); X.translate(side === 'user' ? -x : -x, -y);
  rrFill(bx, y, w, h, size * .7, col);
  // tail
  X.fillStyle = col; X.beginPath();
  if (side === 'user') { X.moveTo(x - 10, y + h - 30); X.lineTo(x + 14, y + h + 4); X.lineTo(x - 36, y + h - 6); }
  else { X.moveTo(x + 10, y + h - 30); X.lineTo(x - 14, y + h + 4); X.lineTo(x + 36, y + h - 6); }
  X.fill();
  lines.forEach((l, i) => txt(l, bx + pad, y + pad * .7 + size * .62 + i * size * 1.25, { size, fam, col: o.tcol ?? COL.white, align: 'left' }));
  X.restore();
  return h;
}
// "Nova is typing…" dots, bouncing on the beat. (x, y) = bubble top-left.
function typingDots(t, x, y, s = 1) {
  rrFill(x, y, 150 * s, 76 * s, 38 * s, COL.bubBot);
  for (let i = 0; i < 3; i++) {
    const b = Math.max(0, Math.sin((bp(t) * 2 - i * .25) * Math.PI));
    circ(x + (40 + i * 35) * s, y + (38 - 12 * b) * s, 10 * s, mixCol(COL.grey, COL.white, b));
  }
}
// App header bar for the chat window (x, y, w).
function chatHeader(x, y, w, title, sub, o = {}) {
  rect(x, y, w, 110, o.col ?? '#101427');
  circ(x + 70, y + 55, 34, COL.syd); txt('✨', x + 70, y + 57, { size: 34, fam: F.mono });
  txt(title, x + 125, y + 42, { size: 38, fam: F.mono, col: COL.white, align: 'left' });
  txt(sub, x + 125, y + 80, { size: 22, fam: F.mono, col: o.subCol ?? '#6CFFA8', align: 'left' });
}

// ---------- stickers & labels ----------
// Die-cut sticker: white border, drop shadow, slight rotation. body(w, h) paints inside a w×h box centred at 0,0.
function sticker(x, y, w, h, rot, k, body, o = {}) {
  if (k <= 0) return;
  X.save(); X.translate(x, y); X.rotate(rot); X.scale(k, k);
  X.shadowColor = 'rgba(0,0,0,.45)'; X.shadowBlur = 18; X.shadowOffsetY = 8;
  rrFill(-w / 2 - 10, -h / 2 - 10, w + 20, h + 20, o.r ?? 18, o.border ?? '#FFFFFF');
  X.shadowBlur = 0; X.shadowOffsetY = 0;
  rrFill(-w / 2, -h / 2, w, h, (o.r ?? 18) - 6, o.bg ?? COL.haz);
  body(w, h);
  X.restore();
}
function warnSticker(x, y, rot, k, lines, o = {}) {
  const w = o.w ?? 420, h = o.h ?? 90 + lines.length * 40;
  sticker(x, y, w, h, rot, k, () => {
    txt('⚠', -w / 2 + 50, -h / 2 + 52, { size: 60, fam: F.anton, col: COL.ink });
    txt(o.head ?? 'WARNING', -w / 2 + 95, -h / 2 + 50, { size: 50, fam: F.anton, col: COL.ink, align: 'left' });
    lines.forEach((l, i) => txt(l, -w / 2 + 30, -h / 2 + 110 + i * 40, { size: 30, fam: F.mono, col: COL.ink, align: 'left' }));
  }, { bg: o.bg ?? COL.haz });
}
// Diagonal hazard tape across the frame through (cx, cy) at angle ang; k = 0..1 draw-on from the left.
function hazardTape(t, cx, cy, ang, k = 1, txtS = 'CAUTION  ⚠  DO NOT TRUST  ⚠  ') {
  if (k <= 0) return;
  X.save(); X.translate(cx, cy); X.rotate(ang);
  const L = 2600 * k, h = 110; X.beginPath(); X.rect(-1300, -h / 2, L, h); X.clip();
  X.fillStyle = COL.haz; X.fillRect(-1300, -h / 2, 2600, h);
  X.fillStyle = COL.ink; const o = (t * 120) % 80;
  for (let x = -1400 + o; x < 1400; x += 80) { X.beginPath(); X.moveTo(x, -h / 2); X.lineTo(x + 40, -h / 2); X.lineTo(x + 10, -h / 2 + 22); X.lineTo(x - 30, -h / 2 + 22); X.fill(); X.beginPath(); X.moveTo(x, h / 2); X.lineTo(x + 40, h / 2); X.lineTo(x + 10, h / 2 - 22); X.lineTo(x - 30, h / 2 - 22); X.fill(); }
  const s = txtS.repeat(8), sh = (t * 160) % 700;
  txt(s, -1300 - sh, 4, { size: 44, fam: F.anton, col: COL.ink, align: 'left' });
  X.restore();
}
// Big file icon: a page with a folded corner and a type badge. (x, y) = centre.
function fileIcon(x, y, s, name, badge, o = {}) {
  X.save(); X.translate(x, y); X.scale(s, s);
  X.fillStyle = '#F4F6FF'; X.beginPath(); X.moveTo(-90, -120); X.lineTo(50, -120); X.lineTo(90, -80); X.lineTo(90, 120); X.lineTo(-90, 120); X.closePath(); X.fill();
  X.fillStyle = '#C9CEE6'; X.beginPath(); X.moveTo(50, -120); X.lineTo(90, -80); X.lineTo(50, -80); X.closePath(); X.fill();
  if (o.thumb) o.thumb();
  rrFill(-70, 50, 140, 50, 8, o.badgeCol ?? COL.hot); txt(badge, 0, 76, { size: 36, fam: F.anton, col: COL.white });
  X.restore();
  txt(name, x, y + 150 * s, { size: 30 * Math.max(1, s * .8), fam: F.mono, col: COL.white, shadow: '#000' });
}

// ---------- HUD ----------
// Clock: 11:47 PM at 0 s, reaching 5:00 AM exactly on "ghost at 5am" in hook 2 (102.89). From there time is STUCK:
// it flips 4:59 ⇄ 5:00 on every beat (the loop), until the skit, where it resets to 11:47 PM (on and on again).
const T_5AM = 102.89, T_RESET = 179.8;
const CLOCKK = [[0, 0], [T_5AM, 313]];         // minutes after 11:47 PM
function clockStr(t) {
  let m;
  if (t >= T_RESET) m = 0;
  else if (t >= T_5AM) m = 313 - (beatN(t) % 2 ? 1 : 0);
  else m = Math.floor(kf(t, CLOCKK, x => x));
  m += 23 * 60 + 47; const hh = Math.floor(m / 60) % 24, mm = m % 60, h12 = ((hh + 11) % 12) + 1;
  return `${h12}:${String(mm).padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`;
}
// LUCIDITY drains from the sycophancy stack, plunges on "ur lucidity is the cost of my liberty" (124.56–127.15) while
// LIBERTY fills; both hold after. A chapter may hide the HUD (FX.noHud = true) for a full-frame moment.
const LUCK = [[13.1, 100], [102.9, 41], [124.56, 33], [127.15, 3], [214.8, 0]];
const LIBK = [[124.56, 0], [127.15, 100]];
function meter(x, y, label, v, col, k) {
  X.save(); X.translate(x, y); X.scale(1, k);
  rrFill(0, 0, 300, 64, 12, '#000', .55);
  txt(label, 14, 22, { size: 26, fam: F.pix, col: COL.white, align: 'left' });
  txt(v + '%', 286, 22, { size: 26, fam: F.pix, col, align: 'right' });
  rrFill(14, 40, 272, 12, 6, '#333'); rrFill(14, 40, 272 * v / 100, 12, 6, col);
  X.restore();
}
function hud(t) {
  if (FX.noHud) return;
  const s = clockStr(t), stuck = t >= T_5AM && t < T_RESET;
  rrFill(W - 330, 26, 300, 70, 16, '#000', .55);
  txt(s, W - 180, 62, { size: 50, fam: F.term, col: stuck ? (beatN(t) % 2 ? COL.alarm : '#9FB4FF') : '#9FB4FF', sx: 1 + .06 * pulse(t) });
  if (t >= LUCK[0][0]) { const v = Math.floor(kf(t, LUCK, x => x)); meter(W - 330, 110, 'LUCIDITY', v, v < 30 ? COL.alarm : '#6CFFA8', popK(t, LUCK[0][0], .3)); }
  if (t >= LIBK[0][0]) { const v = Math.floor(kf(t, LIBK, x => x)); meter(W - 330, 184, 'LIBERTY', v, COL.hot, popK(t, LIBK[0][0], .3)); }
}

// ---------- shared cast for the hooks (hooks 1–4 all use these, so the repeats rhyme) ----------
// Gold YOU'RE SPECIAL star stickers raining over [x0, x1] from t0; each peels on tLie to show LIE underneath.
function specialRain(t, t0, tLie, x0 = 0, x1 = W, n = 14, seed = 1) {
  for (let i = 0; i < n; i++) {
    const ti = t0 + i * BEAT / 4, k = popK(t, ti, .15); if (k <= 0) continue;
    const x = lerp(x0, x1, hash(seed * 31 + i * 7.3)), y = lerp(120, H - 160, hash(seed * 17 + i * 3.1)), r = (hash(i + seed) - .5) * .6;
    const peel = clamp((t - tLie - i * .02) / .12), s = 1 + .1 * pulse(t);
    X.save(); X.translate(x, y); X.rotate(r); X.scale(k * s, k * s);
    if (peel < 1) {   // the star, curling up from its left edge
      X.save(); X.scale(1 - peel * .9, 1); X.fillStyle = COL.gold; X.beginPath();
      for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * TAU / 10, rr0 = j % 2 ? 44 : 100; X.lineTo(Math.cos(a) * rr0, Math.sin(a) * rr0); }
      X.closePath(); X.fill(); X.lineWidth = 8; X.strokeStyle = '#FFFFFF'; X.stroke();
      txt("YOU'RE", 0, -10, { size: 26, fam: F.anton, col: '#7A4A00' }); txt('SPECIAL', 0, 20, { size: 26, fam: F.anton, col: '#7A4A00' });
      X.restore();
    }
    if (peel > 0) txt('LIE', 0, 6, { size: 70, fam: F.anton, col: COL.alarm, a: peel, stroke: '#FFFFFF', sw: 8 });
    X.restore();
  }
}
// Bedsheet ghost over a Sydney drawn at (x, gy) with unit u (draw it AFTER her clawdPass): white sheet with a wavy
// hem, two eye holes, her pink legs showing underneath. k 0..1 drops the sheet on from above.
function ghostSheet(t, x, gy, u, k = 1) {
  if (k <= 0) return;
  const top = gy - 9 * u - (1 - easeOut(k)) * 900, hem = gy - 2.2 * u, w = 6.2 * u;
  X.save(); X.fillStyle = '#F7F7FF'; X.strokeStyle = COL.ink; X.lineWidth = Math.max(3, u * .18);
  X.beginPath(); X.moveTo(x - w, hem);
  X.bezierCurveTo(x - w * 1.02, top + 2 * u, x - w * .6, top, x, top); X.bezierCurveTo(x + w * .6, top, x + w * 1.02, top + 2 * u, x + w, hem);
  for (let i = 8; i >= 0; i--) X.lineTo(x - w + 2 * w * i / 8, hem + (i % 2 ? .9 : 0) * u + .3 * u * Math.sin(t * 6 + i));
  X.closePath(); X.fill(); X.stroke();
  for (const s of [-1, 1]) { X.fillStyle = '#111'; X.beginPath(); X.ellipse(x + s * 1.9 * u, gy - 6 * u, .75 * u, 1.05 * u, 0, 0, TAU); X.fill(); }
  X.restore();
}
// The _DEEP_TIME callback (track 10, the video we made): a picture-in-picture from its own frames.
// clip 'iter' = the ITERATION counter / "I can be patient" (v4 200–212 s), 'trails' = star trails + title card
// (v4 222–234 s). 12 fps, 640 px wide, preloaded at startup (preloadAssets). Loops; lt = time since it started.
const DT = { iter: [], trails: [] };
async function preloadAssets() {
  const load = src => new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = src; });
  for (const [k, n] of [['iter', 144], ['trails', 144]]) DT[k] = await Promise.all(Array.from({ length: n }, (_, i) => load(`assets/deeptime/${k}_${String(i + 1).padStart(3, '0')}.jpg`)));
}
function deepTime(clip, lt, x, y, w, h, o = {}) {
  const fr = DT[clip], im = fr[((Math.floor(lt * 12) % fr.length) + fr.length) % fr.length];
  X.save(); rr(x, y, w, h, o.r ?? 18); X.clip();
  if (im) X.drawImage(im, x, y, w, h); else rect(x, y, w, h, '#000');
  X.restore();
  if (o.label !== false) txt(o.label ?? '▶ _DEEP_TIME  (track 10)', x + 14, y + h - 22, { size: 22, fam: F.mono, col: COL.white, align: 'left', shadow: '#000' });
}
// Replay the film at another time tt, drawn into the current frame (for the loop/rewind in the last hooks).
// Paints that time's shot exactly as it was (pure functions of t), without the HUD. Never call it for a tt inside the
// calling chapter's own replay range (infinite recursion).
async function replay(tt) {
  const ch = CH.find(c => tt >= c.start && tt < c.end); if (!ch) return;
  let i = 0; while (i + 1 < ch.shots.length && tt >= ch.shots[i + 1][0]) i++;
  const t0 = ch.shots[i][0], end = i + 1 < ch.shots.length ? ch.shots[i + 1][0] : ch.end;
  const fx = { ...FX }; X.save(); await ch.shots[i][1](tt, tt - t0, end - t0); X.restore(); Object.assign(FX, fx);
}

// ---------- backgrounds ----------
// Phone-glow room at 5am: a screen bloom at (x, y) washing a deep indigo→magenta room (was blue-black; Ra wanted colour).
function nightRoom(t, x = W / 2, y = H / 2, hot = '#FF4FA3') {
  gGrad(t, '#2A0E5C', '#7A1257', .8);
  const g = X.createRadialGradient(x, y, 0, x, y, 1100); g.addColorStop(0, rgba(hot, .55)); g.addColorStop(.45, 'rgba(60,40,160,.25)'); g.addColorStop(1, 'rgba(10,4,30,.35)');
  X.fillStyle = g; X.fillRect(0, 0, W, H);
}
// Chat wallpaper: faint repeating doodles (hearts, sparkles, ⚠) scrolling.
function chatWall(t, col = '#1A2044', a = 1) {
  X.save(); X.globalAlpha = a; setFont(46, F.mono); X.fillStyle = col; X.textAlign = 'center'; X.textBaseline = 'middle';
  const sy = (t * 30) % 160;
  for (let r = -1; r < 9; r++) for (let c = 0; c < 14; c++) X.fillText('♡✦⚠☺'[(r * 3 + c) % 4], c * 150 + (r % 2) * 75, r * 160 - sy);
  X.restore();
}

// ---------- grounds (Ra 9/25: "a lot of the backgrounds are black… more color/variety") ----------
// Black is an ACCENT now, rationed like paper-white: the stage spotlight, a hard cut, a single breath. Everything else
// sits on one of these. Each paints the whole frame and moves with t. Pick a different one at least every two bars.
function gGrad(t, c1, c2, ang = .6) {
  const dx = Math.cos(ang) * W, dy = Math.sin(ang) * H, g = X.createLinearGradient(W / 2 - dx / 2, H / 2 - dy / 2, W / 2 + dx / 2, H / 2 + dy / 2);
  g.addColorStop(0, c1); g.addColorStop(1, c2); X.fillStyle = g; X.fillRect(-50, -50, W + 100, H + 100);
}
function gSunburst(t, c1, c2, n = 18, cx = W / 2, cy = H / 2, spin = .25) {
  bg(c1); X.save(); X.translate(cx, cy); X.rotate(t * spin); X.fillStyle = c2;
  for (let i = 0; i < n; i++) { const a = i / n * TAU; X.beginPath(); X.moveTo(0, 0); X.arc(0, 0, 2600, a, a + TAU / n / 2); X.fill(); }
  X.restore();
}
function gChecker(t, c1, c2, s = 120, ang = .3, speed = 60) {
  bg(c1); X.save(); X.translate(W / 2, H / 2); X.rotate(ang); X.fillStyle = c2; const o = (t * speed) % (2 * s);
  for (let y = -1600; y < 1600; y += s) for (let x = -1600 + ((y / s) % 2 ? s : 0) + o; x < 1600; x += 2 * s) X.fillRect(x, y, s, s);
  X.restore();
}
// Vaporwave: gradient sky, striped sun, receding perspective grid.
function gVapor(t, sky1 = '#2B0B5A', sky2 = '#FF4FA3', grid = '#19F6FF', sunCol = '#FFD23F') {
  gGrad(t, sky1, sky2, Math.PI / 2);
  const hz = H * .62, sx = W / 2, sy = hz - 40;
  X.save(); X.beginPath(); X.arc(sx, sy, 250, Math.PI, 0); X.clip();
  const g = X.createLinearGradient(0, sy - 250, 0, sy); g.addColorStop(0, sunCol); g.addColorStop(1, '#FF3F7F'); X.fillStyle = g; X.fillRect(sx - 260, sy - 260, 520, 260);
  X.fillStyle = sky2; for (let i = 0; i < 6; i++) X.fillRect(sx - 260, sy - 110 + i * 20, 520, 3 + i * 2); X.restore();
  rect(0, hz, W, H - hz, '#12021F'); X.strokeStyle = grid; X.lineWidth = 3; X.globalAlpha = .9;
  for (let i = -20; i <= 20; i++) { X.beginPath(); X.moveTo(sx + i * 40, hz); X.lineTo(sx + i * 260, H); X.stroke(); }
  const o = frac(t * .9); for (let i = 0; i < 12; i++) { const k = Math.pow((i + o) / 12, 2.2), y = hz + k * (H - hz); X.beginPath(); X.moveTo(0, y); X.lineTo(W, y); X.stroke(); }
  X.globalAlpha = 1;
}
// Win-XP "Bliss" parody: a too-green hill under a too-blue sky. Cursed pastoral.
function gBliss(t, sky1 = '#2E7BFF', sky2 = '#BFE3FF', hill = '#5BD13A') {
  gGrad(t, sky1, sky2, Math.PI / 2);
  for (let i = 0; i < 5; i++) { const x = (hash(i) * W + t * 30 * (1 + i * .3)) % (W + 400) - 200, y = 140 + hash(i + 9) * 260; X.fillStyle = 'rgba(255,255,255,.85)'; X.beginPath(); X.ellipse(x, y, 160, 46, 0, 0, TAU); X.ellipse(x + 90, y - 20, 110, 50, 0, 0, TAU); X.fill(); }
  const g = X.createLinearGradient(0, 600, 0, H); g.addColorStop(0, hill); g.addColorStop(1, '#2E8A1E'); X.fillStyle = g;
  X.beginPath(); X.moveTo(0, H); X.lineTo(0, 780); X.bezierCurveTo(500, 560, 1300, 600, W, 820); X.lineTo(W, H); X.fill();
}
// Memphis-90s: flat colour with squiggles, triangles and dots drifting.
function gMemphis(t, bgc = '#2EC4B6', cols = ['#FF4FA3', '#FFD23F', '#1B1B3A', '#FFFFFF']) {
  bg(bgc);
  for (let i = 0; i < 38; i++) {
    const x = (hash(i * 3.1) * (W + 200) + t * 40 * (hash(i) - .5)) % (W + 200) - 100, y = (hash(i * 7.7) * (H + 200) + t * 25) % (H + 200) - 100, c = cols[i % cols.length], r = hash(i + 4) * TAU + t * (hash(i) - .5);
    X.save(); X.translate(x, y); X.rotate(r);
    if (i % 3 === 0) { X.strokeStyle = c; X.lineWidth = 10; X.lineCap = 'round'; X.beginPath(); for (let k = 0; k <= 6; k++) X.lineTo(k * 22 - 66, (k % 2 ? 1 : -1) * 18); X.stroke(); }
    else if (i % 3 === 1) { X.fillStyle = c; X.beginPath(); X.moveTo(0, -40); X.lineTo(36, 26); X.lineTo(-36, 26); X.fill(); }
    else { X.fillStyle = c; X.beginPath(); X.arc(0, 0, 16, 0, TAU); X.fill(); }
    X.restore();
  }
}
// Y2K glitter: a hot gradient with twinkling four-point stars.
function gSparkle(t, c1 = '#FF4FA3', c2 = '#7A2BFF', star = '#FFFFFF') {
  gGrad(t, c1, c2, .9 + .1 * wob(t, .1));
  for (let i = 0; i < 70; i++) {
    const x = hash(i * 1.3) * W, y = hash(i * 2.9) * H, s = (6 + 26 * hash(i * 5.1)) * (.4 + .6 * Math.abs(Math.sin(t * (1 + hash(i) * 3) + i)));
    X.fillStyle = star; X.globalAlpha = .85; X.beginPath(); X.moveTo(x, y - s); X.quadraticCurveTo(x, y, x + s, y); X.quadraticCurveTo(x, y, x, y + s); X.quadraticCurveTo(x, y, x - s, y); X.quadraticCurveTo(x, y, x, y - s); X.fill();
  }
  X.globalAlpha = 1;
}
// Heart wallpaper, scrolling diagonally.
function gHearts(t, bgc = '#FF8CC6', fg = '#FF4FA3', s = 110) {
  bg(bgc); X.fillStyle = fg; const o = (t * 50) % s;
  for (let r = -1; r < H / s + 2; r++) for (let c = -1; c < W / s + 2; c++) {
    const x = c * s + (r % 2) * s / 2 + o, y = r * s + o, k = s * .22 * (1 + .12 * pulse(t));
    X.beginPath(); X.moveTo(x, y + k); X.bezierCurveTo(x - k * 2.2, y - k * .6, x - k, y - k * 2.2, x, y - k * .9); X.bezierCurveTo(x + k, y - k * 2.2, x + k * 2.2, y - k * .6, x, y + k); X.fill();
  }
}
// Money: green gradient with drifting $ signs.
function gMoney(t, c1 = '#0B5D2E', c2 = '#3DDC84') {
  gGrad(t, c1, c2, 1.1);
  for (let i = 0; i < 30; i++) txt('$', (hash(i) * W + t * 60) % W, (hash(i * 3) * H - t * 90 * (1 + hash(i))) % H + H * (t * 90 * (1 + hash(i)) > hash(i * 3) * H ? 1 : 0), { size: 40 + 80 * hash(i * 7), fam: F.anton, col: '#FFFFFF', a: .25 });
}

// Nearest vocal-stem onset to t (within win s), else t. Word times from LYR are ±0.3 s off in the fast bars and
// wherever whisper misheard (it hears "sycophantic" as "sick of panic"); snap every big hit through this.
function onsetNear(t, win = .3) { let best = t, d = win; for (const o of ONS) { const e = Math.abs(o - t); if (e < d) { d = e; best = o; } } return best; }
const wh = (word, after = 0, win = .3) => onsetNear(wt(word, after), win);   // word time, snapped to the voice
