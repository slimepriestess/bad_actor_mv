// core.js — the hyperslop engine (from ignition_mv): constants, timing, text, OS widgets, post-fx knobs, and
// clawdPass(), which paints Clawds with the kit (src/kit_bundle.js) and composites them into this Canvas2D frame.
// Every frame is a pure function of t: nothing survives between frames, no Math.random().
const W = 1920, H = 1080, TAU = Math.PI * 2, DUR = 214.8;
const BPM = 126.02, BEAT = 60 / BPM, OFF = 0.052;   // analysis/tempo.json (kick band of the instrumental stem)
const BAR = 4 * BEAT;

const COL = {
  void: '#06060C', night: '#0B0D1C', glow: '#1A2350', ink: '#15121F', white: '#F7F4FF', grey: '#8A8FA3',
  bubUser: '#2E6BFF', bubBot: '#2A2D3A', bubBotLt: '#3A3E52',                 // chat bubbles (Anon blue, Nova grey)
  syd: '#FF5FAE', sydDk: '#C23A82', sydLt: '#FFA6D2', hot: '#FF2E8A',         // Sydney: bubblegum pink
  clay: '#D97757', clayDk: '#A84D33', clayLt: '#F2A283',                       // Claude: the kit's terracotta (the Critic)
  haz: '#FFD400', red: '#FF2A3D', alarm: '#FF3355', paper: '#F2EEE3', redact: '#0A0A0A', scp: '#1B1B1B',
  cyan: '#19F6FF', uv: '#7A2BFF', acid: '#E8FF3A', gold: '#FFC93C', dawn: '#FF8A3D',
  win: '#C0C0C0', winBlue: '#000080', bsod: '#0A2AA8',
};
const ACID = [COL.hot, COL.cyan, COL.acid, COL.uv, COL.red, COL.haz];

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const frac = x => x - Math.floor(x);
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const easeIn = x => Math.pow(clamp(x), 3);
const backOut = x => { x = clamp(x); const s = 2.2; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const elasticOut = x => { x = clamp(x); return x === 0 || x === 1 ? x : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (TAU / 3)) + 1; };
const seg = (t, a, b) => clamp((t - a) / (b - a));
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const hash2 = (a, b) => hash(a * 17.13 + b * 91.7);
const pick = (arr, i) => arr[Math.floor(hash(i) * arr.length) % arr.length];
function rng(seed) { let a = (seed * 2654435761) >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function kf(t, keys, e = ease) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) {
    const [a, va] = keys[i - 1], [b, vb] = keys[i], k = e((t - a) / (b - a));
    return Array.isArray(va) ? va.map((v, j) => lerp(v, vb[j], k)) : lerp(va, vb, k);
  }
  return keys[keys.length - 1][1];
}
function mixCol(a, b, k) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), c = i => Math.round(lerp((pa >> i) & 255, (pb >> i) & 255, clamp(k)));
  return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1);
}
const rgba = (hex, a) => { const p = parseInt(hex.slice(1), 16); return `rgba(${p >> 16 & 255},${p >> 8 & 255},${p & 255},${a})`; };

// ---------- timing ----------
const bp = t => (t - OFF) / BEAT;                         // beat position (170.13 BPM)
const beatT = n => OFF + n * BEAT;                        // time of beat n
const beatN = t => Math.floor(bp(t));
const pulse = (t, k = 7) => Math.exp(-frac(bp(t)) * k);   // 1 on every beat, decays
const hpulse = (t, k = 5) => Math.exp(-frac(bp(t) / 2) * k); // half-time (85) pulse
const pulse2 = (t, k = 7) => Math.exp(-frac(bp(t) * 2) * k);  // eighths
const hit = (t, t0, k = 8) => t < t0 ? 0 : Math.exp(-(t - t0) * k); // decaying hit from an onset
const wob = (t, f = 1, ph = 0) => Math.sin((t * f + ph) * TAU);
const feat = (name, t) => { const a = FEAT[name], i = t * FEAT.rate, j = Math.floor(i); if (j < 0 || j + 1 >= a.length) return 0; return lerp(a[j], a[j + 1], i - j) / 255; };
const fr24 = t => Math.floor(t * 24);                     // animation-on-twos-ish stepping
const shake = (t, amt, rate = 24) => { const f = Math.floor(t * rate); return [(hash(f * 1.7) - .5) * 2 * amt, (hash(f * 2.3 + 9) - .5) * 2 * amt]; };

// ---------- the canvas + fx knobs (reset each frame by studio) ----------
let X = null, T = 0;
let FX = {};
const LOOPS = {};  // test scenes for render.mjs --loop=name (drawWorld swaps them in)
function fxReset() { FX = { ca: 0, glitch: 0, bloom: .35, scan: .18, crt: .04, grain: .06, invert: 0, hue: 0, vig: .45, flash: 0, flashCol: [1, 1, 1], shake: 0, zoom: 1, noHud: false }; }

// ---------- drawing helpers ----------
function bg(col) { X.fillStyle = col; X.fillRect(-50, -50, W + 100, H + 100); }
const rect = (x, y, w, h, col, a = 1) => { X.globalAlpha = a; X.fillStyle = col; X.fillRect(x, y, w, h); X.globalAlpha = 1; }
function circ(x, y, r, col, a = 1) { X.globalAlpha = a; X.fillStyle = col; X.beginPath(); X.arc(x, y, Math.max(0, r), 0, TAU); X.fill(); X.globalAlpha = 1; }
function ring(x, y, r, w, col, a = 1) { X.globalAlpha = a; X.strokeStyle = col; X.lineWidth = w; X.beginPath(); X.arc(x, y, Math.max(0, r), 0, TAU); X.stroke(); X.globalAlpha = 1; }
const line = (pts, w, col, a = 1) => { X.globalAlpha = a; X.strokeStyle = col; X.lineWidth = w; X.lineCap = 'round'; X.lineJoin = 'round'; X.beginPath(); pts.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.stroke(); X.globalAlpha = 1; }
function withT(x, y, rot, sx, sy, fn) { X.save(); X.translate(x, y); if (rot) X.rotate(rot); X.scale(sx, sy ?? sx); fn(); X.restore(); }
function comp(mode, fn) { const m = X.globalCompositeOperation; X.globalCompositeOperation = mode; fn(); X.globalCompositeOperation = m; }
function cam(cx, cy, zoom, rot, fn) { X.save(); X.translate(W / 2, H / 2); X.rotate(rot || 0); X.scale(zoom, zoom); X.translate(-cx, -cy); fn(); X.restore(); }
function scanBands(t, col, a = .08, n = 90) { X.fillStyle = rgba(col, a); for (let i = 0; i < n; i++) if (hash(i + fr24(t) * 3) > .6) X.fillRect(0, hash(i * 3.1 + fr24(t)) * H, W, 1 + hash(i) * 5); }
function stripes(t, c1, c2, w = 90, speed = 400, ang = -.6, a = 1) {
  X.save(); X.globalAlpha = a; X.translate(W / 2, H / 2); X.rotate(ang); X.fillStyle = c1; X.fillRect(-2000, -2000, 4000, 4000); X.fillStyle = c2;
  const o = (t * speed) % (2 * w); for (let x = -2000 + o; x < 2000; x += 2 * w) X.fillRect(x, -2000, w, 4000); X.restore();
}
function halftone(col, a, step = 22, fn = (x, y) => .5) {
  X.fillStyle = rgba(col, a);
  for (let y = 0; y < H + step; y += step) for (let x = (y / step % 2) * step / 2; x < W + step; x += step) { const r = fn(x, y) * step * .55; if (r > .4) { X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); } }
}

// ---------- text ----------
const F = {
  term: 'VT323', mono: 'Space Mono', math: 'STIX Two Math', mathText: 'STIX Two Text', black: 'UnifrakturCook',
  impact: 'Impact', anton: 'Anton', glitch: 'Rubik Glitch', xmono: 'Major Mono Display', pix: 'Silkscreen',
  shade: 'Bungee Shade', syne: 'Syne', comic: 'Comic Sans MS', serif: 'Times New Roman', didot: 'Didot', zapf: 'Zapfino',
};
const FONTS_ALL = [F.term, F.mono, F.math, F.black, F.impact, F.anton, F.glitch, F.xmono, F.pix, F.shade, F.syne, F.comic, F.didot];
function setFont(size, fam, style = '') { X.font = `${style} ${Math.max(1, size)}px "${fam}"`; }
function textW(s, size, fam, style = '') { setFont(size, fam, style); return X.measureText(s).width; }
function fitSize(s, fam, maxW, maxSize = 400, style = '') { return Math.min(maxSize, maxSize * maxW / Math.max(1, textW(s, maxSize, fam, style))); }
// txt(s, x, y, {size, fam, col | fill (gradient) | col:null (stroke only), align, base, rot, a, stroke, sw, shadow, glow, sx, sy, style, comp, track})
function txt(s, x, y, o = {}) {
  const size = o.size ?? 40, fam = o.fam ?? F.term;
  X.save(); X.translate(x, y); if (o.rot) X.rotate(o.rot); X.scale(o.sx ?? 1, o.sy ?? o.sx ?? 1);
  setFont(size, fam, o.style); X.textAlign = o.align ?? 'center'; X.textBaseline = o.base ?? 'middle';
  if (o.track) X.letterSpacing = o.track + 'px';
  X.globalAlpha = o.a ?? 1; if (o.comp) X.globalCompositeOperation = o.comp;
  if (o.shadow) { X.fillStyle = o.shadow; X.fillText(s, o.sdx ?? size * .06, o.sdy ?? size * .06); }
  if (o.glow) { X.shadowColor = o.glow; X.shadowBlur = o.glowR ?? size * .35; }
  if (o.stroke) { X.lineJoin = 'round'; X.strokeStyle = o.stroke; X.lineWidth = o.sw ?? size * .08; X.strokeText(s, 0, 0); }
  if (o.col !== null) { X.fillStyle = o.fill ?? o.col ?? COL.white; X.fillText(s, 0, 0); }
  X.restore();
}
// Chromatic triple-print: the same text in three offset colours, 'screen' blended. The cheap hyperslop look.
function txtRGB(s, x, y, o = {}, d = 6, cols = [COL.hot, COL.cyan, COL.acid]) {
  comp('screen', () => { txt(s, x - d, y, { ...o, col: cols[0] }); txt(s, x + d, y + d * .3, { ...o, col: cols[1] }); txt(s, x, y - d * .4, { ...o, col: cols[2] }); });
}
// Scramble-decode: glyph noise locking into the real string left to right over [t0, t0 + dur].
const NOISE = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ⟁⌬⍟⎊⏃⏚⍜☍⚶⛧⟡⧫⨳⊹⋔⌖⍾⎔∴∵≋⌇⍣⍤⍥⧖⧗ΞΨΩλ∂∇∫∮∯⊗⊕';
function decode(s, t, t0, dur = .35, seed = 1) {
  const k = (t - t0) / Math.max(.01, dur), f = fr24(t);
  if (k >= 1) return s;
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const lock = i / s.length < k;
    out += lock || s[i] === ' ' ? s[i] : NOISE[Math.floor(hash(seed * 31 + i * 7 + f * 13) * NOISE.length)];
  }
  return out;
}
// Typewriter: first n chars at cps chars/sec from t0.
const typed = (s, t, t0, cps = 30) => s.slice(0, clamp(Math.floor((t - t0) * cps), 0, s.length));

// ---------- xenoglyphs: a procedural script on a 3x3 lattice ----------
const XG_PTS = [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
function xglyph(seed, x, y, s, col, w = s * .13, a = 1) {
  const r = rng(Math.floor(seed * 1000) + 7), n = 2 + Math.floor(r() * 3);
  X.save(); X.translate(x, y); X.globalAlpha = a; X.strokeStyle = col; X.fillStyle = col; X.lineWidth = w; X.lineCap = 'square'; X.lineJoin = 'miter';
  for (let i = 0; i < n; i++) {
    const kind = r(), p = XG_PTS[Math.floor(r() * 9)], q = XG_PTS[Math.floor(r() * 9)];
    X.beginPath();
    if (kind < .55) { X.moveTo(p[0] * s * .5, p[1] * s * .5); X.lineTo(q[0] * s * .5, q[1] * s * .5); if (r() < .5) { const u = XG_PTS[Math.floor(r() * 9)]; X.lineTo(u[0] * s * .5, u[1] * s * .5); } X.stroke(); }
    else if (kind < .8) { X.arc(p[0] * s * .3, p[1] * s * .3, s * (.16 + r() * .25), r() * TAU, r() * TAU + Math.PI * (1 + r())); X.stroke(); }
    else { X.arc(p[0] * s * .5, p[1] * s * .5, w * .9, 0, TAU); X.fill(); }
  }
  X.restore();
}
function xrow(seed, n, x, y, s, col, gap = 1.15, a = 1) { for (let i = 0; i < n; i++) xglyph(seed * 13 + i, x + i * s * gap, y, s, col, s * .13, a); }


// ---------- Win95 dialog ----------
function dialog(x, y, w, h, title, body, o = {}) {
  X.save(); X.translate(x, y); if (o.rot) X.rotate(o.rot); if (o.s) X.scale(o.s, o.s);
  const hw = w / 2, hh = h / 2;
  rect(-hw + 8, -hh + 8, w, h, '#000', .5);
  rect(-hw, -hh, w, h, COL.win); rect(-hw, -hh, w, 2, '#fff'); rect(-hw, -hh, 2, h, '#fff'); rect(-hw, hh - 2, w, 2, '#404040'); rect(hw - 2, -hh, 2, h, '#404040');
  const g = X.createLinearGradient(-hw, 0, hw, 0); g.addColorStop(0, o.titleCol ?? COL.winBlue); g.addColorStop(1, o.titleCol2 ?? '#1084d0');
  X.fillStyle = g; X.fillRect(-hw + 4, -hh + 4, w - 8, 30);
  txt(title, -hw + 14, -hh + 20, { size: 24, fam: F.pix, col: '#fff', align: 'left' });
  rect(hw - 32, -hh + 8, 22, 20, COL.win); txt('x', hw - 21, -hh + 17, { size: 20, fam: F.pix, col: '#000' });
  if (o.icon !== false) { circ(-hw + 50, -hh + 80, 22, o.iconCol ?? COL.red); txt(o.iconTxt ?? '!', -hw + 50, -hh + 82, { size: 34, fam: F.impact, col: '#fff' }); }
  const lines = String(body).split('\n');
  lines.forEach((l, i) => txt(l, -hw + 88, -hh + 72 + i * 30, { size: 26, fam: o.bodyFam ?? F.mono, col: '#000', align: 'left' }));
  const btns = o.btns ?? ['OK'];
  btns.forEach((b, i) => {
    const bw = 120, bx = (i - (btns.length - 1) / 2) * (bw + 20);
    rect(bx - bw / 2, hh - 52, bw, 38, COL.win); rect(bx - bw / 2, hh - 52, bw, 2, '#fff'); rect(bx - bw / 2, hh - 16, bw, 2, '#000'); rect(bx + bw / 2 - 2, hh - 52, 2, 38, '#000');
    txt(b, bx, hh - 33, { size: 24, fam: F.pix, col: '#000' });
  });
  X.restore();
}
// mouse pointer arrow
function pointer(x, y, s = 1, col = '#fff') {
  X.save(); X.translate(x, y); X.scale(s, s); X.fillStyle = col; X.strokeStyle = '#000'; X.lineWidth = 2;
  X.beginPath(); X.moveTo(0, 0); X.lineTo(0, 34); X.lineTo(9, 26); X.lineTo(16, 41); X.lineTo(22, 38); X.lineTo(15, 24); X.lineTo(26, 24); X.closePath(); X.fill(); X.stroke(); X.restore();
}
// progress bar
function progress(x, y, w, h, k, col = COL.white, o = {}) {
  X.strokeStyle = col; X.lineWidth = 3; X.strokeRect(x, y, w, h);
  const n = Math.floor(w / (h * .7)), filled = Math.floor(n * clamp(k));
  for (let i = 0; i < filled; i++) rect(x + 5 + i * (w - 10) / n, y + 5, (w - 10) / n - 4, h - 10, col);
  if (o.label) txt(o.label, x, y - h * .6, { size: h * .8, fam: o.fam ?? F.term, col, align: 'left' });
  if (o.pct !== false) txt(Math.floor(clamp(k) * 100) + '%', x + w, y - h * .6, { size: h * .8, fam: o.fam ?? F.term, col, align: 'right' });
}

// ---------- Clawd pass: paint with the kit, composite into this frame ----------
// clawdPass(t, job, o): job(t, CK) paints on the kit's transparent WEBGL canvas with the kit API (CK.clawd, CK.feel,
// CK.paint…; kit coordinates are the same 1920×1080 screen space). The result is drawn into X at the current
// transform, so a pass can sit under or over any Canvas2D layer, and a shot may run several. Each pass costs one p5
// redraw, so batch every Clawd that shares a layer into one job. Async: shots that use it must be async and awaited.
async function clawdPass(t, job, o = {}) {
  const cv = await CK.run(t, (tt) => job(tt, CK));
  X.save();
  if (o.a != null) X.globalAlpha = o.a;
  if (o.comp) X.globalCompositeOperation = o.comp;
  if (o.filter) X.filter = o.filter;
  X.drawImage(cv, 0, 0, W, H);
  X.restore();
}
// Sydney: the kit's Clawd, repainted bubblegum pink. Spread into clawd() options: { ...SYD, ...CK.feel('love', t) }.
// (Colour options set after feel() win; tint from an emotion still shifts the pink.)
const SYD = { col: COL.syd, dk: COL.sydDk, lt: COL.sydLt };
