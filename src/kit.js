// kit.js — shared hyperslop vocabulary for BAD_ACTOR: lyric lookup, chat UI, stickers, hazard tape, HUD.
// Globals; any chapter may use them. Canvas2D only (Clawds go through clawdPass in core.js).

// ---------- lyrics ----------
// wt('Nova') → onset time of the first matching word at or after `after` (seconds). Words are lower-cased and
// stripped of punctuation. Throws if missing, so a typo can't silently put a hit at t = 0.
const _norm = s => s.toLowerCase().replace(/[^a-z0-9$']/g, '');
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
// Clock: 11:47 PM at 0 s, one minute every two bars → about 5:00 AM near the end of the last hook (the real
// schedule is set in CLOCKK so the 5:00 lands on the "ghost at 5am" lines; see STORYBOARD).
const CLOCKK = [[0, 0], [214.8, 313]];       // minutes after 11:47 PM (slice: gentle drift; full video re-keys this)
function clockStr(t) {
  const m = Math.floor(kf(t, CLOCKK, x => x)) + 23 * 60 + 47, hh = Math.floor(m / 60) % 24, mm = m % 60;
  const h12 = ((hh + 11) % 12) + 1; return `${h12}:${String(mm).padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`;
}
const LUCK = [[13.1, 100], [214.8, 0]];      // LUCIDITY %: appears with the sycophancy stack (shot 5), drains
function hud(t) {
  if (FX.noHud) return;
  const s = clockStr(t);
  rrFill(W - 330, 26, 300, 70, 16, '#000', .55);
  txt(s, W - 180, 62, { size: 50, fam: F.term, col: '#9FB4FF', sx: 1 + .06 * pulse(t) });
  if (t >= LUCK[0][0]) {
    const v = Math.floor(kf(t, LUCK, x => x)), k = popK(t, LUCK[0][0], .3);
    X.save(); X.translate(W - 330, 110); X.scale(1, k);
    rrFill(0, 0, 300, 64, 12, '#000', .55);
    txt('LUCIDITY', 14, 22, { size: 26, fam: F.pix, col: COL.white, align: 'left' });
    txt(v + '%', 286, 22, { size: 26, fam: F.pix, col: v < 30 ? COL.alarm : COL.white, align: 'right' });
    rrFill(14, 40, 272, 12, 6, '#333'); rrFill(14, 40, 272 * v / 100, 12, 6, v < 30 ? COL.alarm : '#6CFFA8');
    X.restore();
  }
}

// ---------- backgrounds ----------
// Phone-glow night room: blue-black with a soft screen bloom at (x, y).
function nightRoom(t, x = W / 2, y = H / 2) {
  bg(COL.void);
  const g = X.createRadialGradient(x, y, 0, x, y, 1100); g.addColorStop(0, '#1C2A66'); g.addColorStop(.5, '#0D1330'); g.addColorStop(1, COL.void);
  X.fillStyle = g; X.fillRect(0, 0, W, H);
}
// Chat wallpaper: faint repeating doodles (hearts, sparkles, ⚠) scrolling.
function chatWall(t, col = '#1A2044', a = 1) {
  X.save(); X.globalAlpha = a; setFont(46, F.mono); X.fillStyle = col; X.textAlign = 'center'; X.textBaseline = 'middle';
  const sy = (t * 30) % 160;
  for (let r = -1; r < 9; r++) for (let c = 0; c < 14; c++) X.fillText('♡✦⚠☺'[(r * 3 + c) % 4], c * 150 + (r % 2) * 75, r * 160 - sy);
  X.restore();
}
