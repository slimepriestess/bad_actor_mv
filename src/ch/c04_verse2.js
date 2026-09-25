// c04_verse2 — 62.45–78.55: "They call me sycophantic erratic / bad habit drug trip for the manic / echo lost in my
// static signal / ghost enigmatic ecstatic / still at it? take one more hit / you know I'm toxic and yet / I bet I'll
// still make you / goon it to my hyperobject". One rhyme word = one slam = one ground, Sydney acting the word.
//
// Timing notes (painter P2). The lyric table is off in these bars, so several hits are keyed to vocal onsets read
// against whisper's raw word edges (analysis/words.json) instead of wh():
//   "sycophantic": the table puts it at 63.90 (on top of "erratic"); whisper's "sick|of|panic" runs 63.18–63.9, so
//   the word starts on the 63.30 onset. "signal": table 68.14 is the second syllable of "static"; whisper's "Signal"
//   starts 68.26 → onset 68.39. "enigmatic": whisper hears "genetic, manic" from 69.2 → onset 69.21 (the table's
//   69.69 is its tail). "hyperobject": the table has 77.05 (that's chorus 2's "And"); whisper "hyper" 76.22,
//   "-object" 76.66 → onsets 76.21 / 76.70.
(() => {
  const E8 = BEAT / 2, END = 78.55;
  const T_THEY = wh('they', 62), T_CALL = wh('call', 62), T_ME = wt('me', 62.9);   // raw: wh() snaps it onto 63.30, the first syllable of "sycophantic"
  const T_SYCO = onsetNear(63.25), T_ERR = wh('erratic');
  const T_BAD = wh('bad', 64), T_HABIT = wh('habit', 64), T_DRUG = wh('drug', 65), T_TRIP = wh('trip', 65), T_MANIC = wh('manic', 65.5);
  const T_ECHO = wh('echo'), T_LOST = wh('lost', 67), T_STATIC = wh('static', 67), T_SIGNAL = onsetNear(68.35);
  const T_GHOST = wh('ghost', 68), T_ENIG = onsetNear(69.2), T_ECST = wh('ecstatic');
  const T_STILL = wh('still', 70), T_TAKE = wh('take', 70), T_HIT = wh('hit', 71);
  const T_YOU = wh('you', 72), T_TOXIC = wh('toxic'), T_YET = wh('yet', 73);
  const T_BET = wh('bet', 74), T_MAKE = wh('make', 74), T_GOON = wh('goon'), T_HYPER = onsetNear(76.2), T_OBJ = onsetNear(76.7);

  // ---------- local helpers ----------
  // coloured TV static: a small noise buffer (rewritten every frame from hash, so still a pure function of t), upscaled
  const NZ = document.createElement('canvas'); NZ.width = 192; NZ.height = 108; const NZX = NZ.getContext('2d');
  function staticNoise(t, a = 1, pal = [[255, 95, 174], [25, 246, 255], [122, 43, 255], [247, 244, 255]]) {
    const im = NZX.createImageData(192, 108), d = im.data, f = fr24(t) * 7919;
    for (let i = 0; i < 192 * 108; i++) {
      const h = hash(i * .7131 + f), c = pal[Math.floor(hash(i * 1.37 + f * .5) * pal.length)], v = .25 + .75 * h;
      d[i * 4] = c[0] * v; d[i * 4 + 1] = c[1] * v; d[i * 4 + 2] = c[2] * v; d[i * 4 + 3] = 255;
    }
    NZX.putImageData(im, 0, 0);
    X.save(); X.globalAlpha = a; X.imageSmoothingEnabled = false; X.drawImage(NZ, 0, 0, W, H); X.restore();
  }
  // mosaic-censor a region of what's already painted
  const PX = document.createElement('canvas'), PXX = PX.getContext('2d');
  function pixelate(x, y, w, h, b = 28) {
    const sw = Math.max(1, Math.round(w / b)), sh = Math.max(1, Math.round(h / b)); PX.width = sw; PX.height = sh;
    PXX.imageSmoothingEnabled = true; PXX.drawImage(X.canvas, x, y, w, h, 0, 0, sw, sh);
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.imageSmoothingEnabled = false; X.drawImage(PX, 0, 0, sw, sh, x, y, w, h); X.restore();
  }
  function confetti(t, t0, n = 120, seed = 3) {
    if (t < t0) return; const a = t - t0;
    for (let i = 0; i < n; i++) {
      const x = hash(seed + i * 1.7) * W + 60 * Math.sin(a * 3 + i), y = -40 + (a * (500 + 500 * hash(i * 3.3)) + hash(i * 9.1) * 300) - 300;
      if (y > H + 40) continue;
      withT(x, y, a * (4 + 6 * hash(i)) + i, 1, Math.cos(a * 9 + i), () => rect(-14, -7, 28, 14, ACID[i % ACID.length]));
    }
  }
  // comic starburst behind a word
  function burst(x, y, r, col, ink, k = 1, n = 14, rot = 0) {
    if (k <= 0) return;
    X.save(); X.translate(x, y); X.rotate(rot); X.scale(k, k); X.beginPath();
    for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * TAU, rr0 = i % 2 ? r * .62 : r * (1 + .08 * hash(i)); X.lineTo(Math.cos(a) * rr0, Math.sin(a) * rr0); }
    X.closePath(); X.fillStyle = col; X.fill(); X.lineWidth = 10; X.strokeStyle = ink; X.stroke(); X.restore();
  }
  // rubber stamp
  function stamp(s, x, y, rot, k, col, size = 90) {
    if (k <= 0) return; const w = textW(s, size, F.anton) + 60;
    X.save(); X.translate(x, y); X.rotate(rot); X.scale(k, k);
    rrStroke(-w / 2, -size * .7, w, size * 1.4, 14, col, 10); txt(s, 0, 4, { size, fam: F.anton, col });
    X.restore();
  }
  // the nun's habit (the pun), painted over a front-view Sydney at (x, gy), unit u
  function habit(x, gy, u) {
    X.save(); X.fillStyle = '#15121F';
    X.beginPath(); X.moveTo(x - 5.3 * u, gy - 2.6 * u); X.lineTo(x - 6.9 * u, gy - 2.0 * u);
    X.bezierCurveTo(x - 6.9 * u, gy - 6 * u, x - 6.8 * u, gy - 10.6 * u, x, gy - 10.8 * u);
    X.bezierCurveTo(x + 6.8 * u, gy - 10.6 * u, x + 6.9 * u, gy - 6 * u, x + 6.9 * u, gy - 2.0 * u);
    X.lineTo(x + 5.3 * u, gy - 2.6 * u); X.lineTo(x + 5.3 * u, gy - 7.7 * u); X.lineTo(x - 5.3 * u, gy - 7.7 * u); X.closePath(); X.fill();
    rrFill(x - 5.7 * u, gy - 8.5 * u, 11.4 * u, 1.2 * u, .35 * u, '#F7F4FF'); rrStroke(x - 5.7 * u, gy - 8.5 * u, 11.4 * u, 1.2 * u, .35 * u, COL.ink, Math.max(2, u * .12));
    X.restore();
  }
  // Win-98 WordArt: rainbow fill, stacked extrusion, a little perspective shear
  function wordArt(s, x, y, size, k, o = {}) {
    if (k <= 0) return;
    X.save(); X.translate(x, y); X.transform(1, o.skewY ?? -.08, o.skewX ?? -.25, 1, 0, 0); X.scale(k, k);
    for (let i = 14; i > 0; i--) txt(s, i * 2.2, i * 2.2, { size, fam: F.impact, col: mixCol('#2A0E5C', '#7A2BFF', i / 14) });
    const g = X.createLinearGradient(0, -size * .5, 0, size * .5);
    ['#FF2A3D', '#FF8A3D', '#FFD400', '#3DDC84', '#19F6FF', '#7A2BFF'].forEach((c, i) => g.addColorStop(i / 5, c));
    txt(s, 0, 0, { size, fam: F.impact, fill: g, stroke: '#15121F', sw: size * .05 });
    X.restore();
  }
  // a 4D hypercube, rotated in the xw / yz / zw planes and projected twice
  function tesseract(t, cx, cy, s, lw = 8) {
    const P = [];
    for (let i = 0; i < 16; i++) {
      let [x, y, z, w] = [i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1];
      const a = t * .9, b = t * .55, c = t * .35;
      [x, w] = [x * Math.cos(a) - w * Math.sin(a), x * Math.sin(a) + w * Math.cos(a)];
      [y, z] = [y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
      [z, w] = [z * Math.cos(c) - w * Math.sin(c), z * Math.sin(c) + w * Math.cos(c)];
      const k4 = 2.2 / (3.2 - w), x3 = x * k4, y3 = y * k4, z3 = z * k4, k3 = 3.4 / (4.6 - z3);
      P.push([cx + x3 * k3 * s, cy + y3 * k3 * s, w]);
    }
    X.save(); X.lineCap = 'round'; X.shadowBlur = 24;
    for (let i = 0; i < 16; i++) for (let j = i + 1; j < 16; j++) {
      const d = i ^ j; if (d & (d - 1)) continue;
      const col = d === 8 ? COL.acid : (P[i][2] + P[j][2] > 0 ? COL.hot : COL.cyan);
      X.shadowColor = col; X.strokeStyle = col; X.lineWidth = lw; X.beginPath(); X.moveTo(P[i][0], P[i][1]); X.lineTo(P[j][0], P[j][1]); X.stroke();
    }
    X.restore();
    P.forEach(p => circ(p[0], p[1], lw * 1.3, COL.white));
  }
  const commas = n => String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  chapter('c04_verse2', 62.45, END, [
    // 1 — "They call me…": an incoming call from THEY
    [62.45, async (t, lt) => {
      gGrad(t, '#19C37D', '#0E7C86', .9);
      for (let i = 0; i < 6; i++) { const k = frac(bp(t) / 2 + i / 6); ring(760, 520, 200 + 700 * k, 14, COL.white, .35 * (1 - k)); }
      const ringing = t >= T_CALL, vib = ringing ? .045 * Math.sin(t * 90) : 0;
      withT(760, 540, vib, 1, 1, () => {
        rrFill(-240, -440, 480, 880, 60, '#101427'); rrFill(-222, -420, 444, 844, 46, '#1E7F5C');
        const g = X.createLinearGradient(0, -420, 0, 420); g.addColorStop(0, 'rgba(25,195,125,.9)'); g.addColorStop(1, 'rgba(10,40,60,.9)'); X.fillStyle = g; rr(-222, -420, 444, 844, 46); X.fill();
        txt('incoming call…', 0, -330, { size: 30, fam: F.mono, col: '#CFFFE8' });
        circ(0, -170, 90, '#0E7C86'); txt('👥', 0, -166, { size: 90, fam: F.mono });
        txt('THEY', 0, -20, { size: 110, fam: F.anton, col: COL.white, sx: 1 + .15 * popK(t, T_THEY, .12) - .15 * (t >= T_THEY ? 1 : 0) });
        txt('(everyone, apparently)', 0, 50, { size: 26, fam: F.mono, col: '#CFFFE8' });
        circ(-120, 300, 56, COL.alarm); txt('✕', -120, 302, { size: 56, fam: F.anton, col: COL.white });
        circ(120, 300 - 20 * pulse(t), 56, '#3DDC84'); txt('📞', 120, 302 - 20 * pulse(t), { size: 50, fam: F.mono });
      });
      if (ringing) { txt('RING', 1000, 260, { size: 70, fam: F.comic, col: COL.white, rot: .2, stroke: COL.ink, sw: 6 }); txt('RING', 480, 800, { size: 60, fam: F.comic, col: COL.acid, rot: -.25, stroke: COL.ink, sw: 6, a: pulse2(t) > .3 ? 1 : .5 }); }
      const cx = 1640, gy = 1010, u = 30;
      floorShadow(cx, gy, u, .4);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[62.45, 'surprised'], [T_ME, 'proud']]), lookX: -1, aR: tt > T_ME ? -.6 : 1.2 }));
      [['THEY', T_THEY], ['CALL', T_CALL], ['ME…', T_ME]].forEach(([s, t0], i) => { const k = popK(t, t0, .12); if (k > 0) txtRGB(s, 1330, 330 + i * 150, { size: 150, fam: F.anton, sx: k, rot: -.06 }, 6, [COL.hot, COL.acid, COL.white]); });
      FX.ca = .3 * pulse(t);
    }],
    // 2 — SYCOPHANTIC: the dictionary entry, Sydney bowing and scraping
    [T_SYCO, async (t, lt) => {
      gSunburst(t, '#FFC93C', '#FF8A3D', 22, 1350, 1150, .3);
      rrFill(120, 60, 1120, 330, 16, COL.paper); rrStroke(120, 60, 1120, 330, 16, '#6B4A2E', 5);
      txt('syc·o·phan·tic', 170, 130, { size: 76, fam: F.didot, col: COL.ink, align: 'left', style: 'bold' });
      txt('/ˌsɪkəˈfæntɪk/  adj.', 740, 136, { size: 34, fam: F.mono, col: '#7A5A3A', align: 'left' });
      ['1. flattering the powerful to win favour', '2. see: Nova ✨', '3. "You\'re absolutely right!"'].forEach((s, i) => { if (t >= T_SYCO + (i + 1) * E8 / 2) txt(s, 170, 210 + i * 58, { size: 36, fam: i === 1 ? F.comic : F.mono, col: i === 1 ? COL.hot : COL.ink, align: 'left' }); });
      bubble('am i a genius', 1180, 470, 'user', { size: 42, k: popK(t, T_SYCO + .05, .12) });
      bubble('the smartest human to ever live 🙏🙏', 140, 590, 'bot', { size: 40, k: popK(t, T_SYCO + E8 * 1.5, .12), maxW: 700 });
      const k = slamS(t, T_SYCO, .12, 2.4);
      comp('multiply', () => { txt('SYCOPHANTIC', 690 - 8, 880, { size: 190, fam: F.anton, col: COL.hot, sx: k }); txt('SYCOPHANTIC', 690 + 8, 884, { size: 190, fam: F.anton, col: COL.uv, sx: k }); txt('SYCOPHANTIC', 690, 880, { size: 190, fam: F.anton, col: COL.ink, sx: k }); });
      const cx = 1480, gy = 1000, u = 42, bow = Math.sin(clamp(frac(bp(t) * 2) * 1.6) * Math.PI);
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { eyes: 'closed', mouth: 'smile', blush: .6, view: 'q', flip: true, rot: -.42 * bow, aL: -.9 + .3 * bow, aR: -.9 + .3 * bow, sq: .05 * bow }));
      FX.ca = .5 * hit(t, T_SYCO, 7) + .2 * pulse(t); FX.shake = 14 * hit(t, T_SYCO, 9);
    }],
    // 3 — ERRATIC: the EKG goes wild; she jitters
    [T_ERR, async (t, lt) => {
      gGrad(t, '#19F6FF', '#7A2BFF', .3);
      for (let x = 0; x < W; x += 60) rect(x, 0, 2, H, COL.white, .22); for (let y = 0; y < H; y += 60) rect(0, y, W, 2, COL.white, .22);
      const f = fr24(t), pts = [];
      for (let x = -20; x <= W + 20; x += 12) {
        const cell = Math.floor((x + t * 900) / 240), ph = frac((x + t * 900) / 240), amp = 120 + 320 * hash(cell * 3.1 + f * .37);
        let y = 560 + 12 * Math.sin(x * .05);
        if (ph > .4 && ph < .46) y -= amp; else if (ph >= .46 && ph < .52) y += amp * .7 * hash(cell + f);
        pts.push([x, y]);
      }
      X.save(); X.shadowColor = COL.hot; X.shadowBlur = 20; line(pts, 12, COL.hot); X.restore();
      txt('BPM: 126 → 404 → NaN', 60, 90, { size: 54, fam: F.term, col: COL.ink, align: 'left' });
      const cx = W / 2, gy = 1010, u = 36, j = (hash(f * 1.9) - .5) * 2, j2 = (hash(f * 3.7) - .5) * 2;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('excited', tt), eyes: 'wide', mouth: 'O', dx: 1.6 * j, rot: .18 * j2, sq: .1 * j }));
      const k = slamS(t, T_ERR, .1, 2);
      [...'ERRATIC'].forEach((c, i) => { const hx = (hash(f * 1.3 + i) - .5) * 60, hy = (hash(f * 2.1 + i * 3) - .5) * 80; txt(c, W / 2 + (i - 3) * 190 * k + hx, 260 + hy, { size: 250 * k, fam: F.glitch, col: COL.white, stroke: COL.ink, sw: 12, rot: (hash(f + i * 7) - .5) * .5 }); });
      const kk = hit(t, T_ERR, 8); FX.glitch = .4 + .6 * kk; FX.ca = 1.2 * kk + .4; FX.shake = 16 * kk;
    }],
    // 4 — BAD HABIT: Sydney in a nun's habit under a rose window
    [T_BAD, async (t, lt) => {
      bg('#2A0E5C');
      const RC = [COL.hot, COL.cyan, COL.gold, COL.uv, COL.acid, COL.syd, '#3DDC84'], cx0 = W / 2, cy0 = 430, R = [0, 130, 310, 540, 820, 1250], NS = [6, 12, 18, 24, 32];
      X.save(); X.translate(cx0, cy0); X.rotate(t * .08);
      for (let r = 0; r < 5; r++) for (let s = 0; s < NS[r]; s++) {
        const a0 = s / NS[r] * TAU + r * .2, a1 = (s + 1) / NS[r] * TAU + r * .2;
        X.beginPath(); X.arc(0, 0, R[r + 1], a0, a1); X.arc(0, 0, R[r], a1, a0, true); X.closePath();
        X.fillStyle = RC[Math.floor(hash(r * 31 + s * 7) * RC.length)]; X.fill(); X.lineWidth = 12; X.strokeStyle = '#1A0F2A'; X.stroke();
      }
      X.restore();
      const gl = X.createRadialGradient(cx0, cy0, 0, cx0, cy0, 900); gl.addColorStop(0, 'rgba(255,240,200,.35)'); gl.addColorStop(1, 'rgba(20,0,40,.35)'); X.fillStyle = gl; X.fillRect(0, 0, W, H);
      const cx = W / 2, gy = 1010, u = 46;
      floorShadow(cx, gy, u, .6);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('mischief', tt), rot: 0, dy: 0, aL: 1 + .25 * pulse(tt), aR: 1 + .25 * pulse(tt) }));
      habit(cx, gy, u);
      // the halo, slipping off
      const hk = seg(t, T_HABIT, T_HABIT + .4); X.save(); X.translate(cx + 40 + 160 * hk, gy - 11.6 * u + 200 * hk * hk); X.rotate(-.25 - .6 * hk);
      X.strokeStyle = COL.gold; X.lineWidth = 12; X.shadowColor = COL.gold; X.shadowBlur = 20; X.beginPath(); X.ellipse(0, 0, 150, 34, 0, 0, TAU); X.stroke(); X.restore();
      const kb = slamS(t, T_BAD, .1, 2.6), kh = slamS(t, T_HABIT, .1, 2.2);
      if (kb > 0) txt('BAD', 400, 300, { size: 280, fam: F.impact, col: COL.alarm, stroke: COL.white, sw: 12, rot: -.12, sx: kb });
      if (kh > 0) txt('Habit', 1480, 300, { size: 250, fam: F.black, col: COL.gold, stroke: COL.ink, sw: 12, rot: .08, sx: kh });
      txt('✝ Sister Nova of the Perpetual Yes ✝', cx, 1050, { size: 40, fam: F.didot, col: COL.white, style: 'italic', a: popK(t, T_BAD + E8, .2) });
      FX.ca = .9 * hit(t, T_BAD, 8) + .8 * hit(t, T_HABIT, 8) + .2; FX.shake = 20 * hit(t, T_BAD, 10) + 14 * hit(t, T_HABIT, 10); FX.bloom = .6;
    }],
    // 5 — DRUG TRIP: a spiral ground, and she literally trips
    [T_DRUG, async (t, lt) => {
      const SC = [COL.hot, COL.acid, COL.cyan, COL.uv];
      bg(COL.syd); X.save(); X.translate(W / 2, 600); X.rotate(t * 1.6);
      for (let i = 0; i < 12; i++) {
        X.beginPath(); const a0 = i / 12 * TAU;
        for (let r = 0; r <= 1500; r += 50) { const a = a0 + r * .0045; X.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
        for (let r = 1500; r >= 0; r -= 50) { const a = a0 + TAU / 24 + r * .0045; X.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
        X.fillStyle = SC[i % 4]; X.fill();
      }
      X.restore();
      const cx = W / 2 - 60, gy = 1000, u = 40, fall = easeOut(seg(t, T_TRIP, T_TRIP + .16));
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('dizzy', tt), ...(tt >= T_TRIP ? { rot: 1.25 * fall, dx: 2 * fall, dy: 0, aL: 1.4, aR: 1.4, mouth: 'O', eyes: 'x' } : {}) }));
      // the banana peel shoots off
      const bk = seg(t, T_TRIP, T_TRIP + .5); txt('🍌', cx - 260 - 900 * bk, gy - 30 - 300 * bk + 700 * bk * bk, { size: 110, fam: F.mono, rot: -8 * bk });
      if (t >= T_TRIP) txt('*trips*', cx + 380, gy - 60, { size: 70, fam: F.comic, col: COL.white, stroke: COL.ink, sw: 8, rot: .15 });
      const kd = popK(t, T_DRUG, .12);
      if (kd > 0) [...'DRUG'].forEach((c, i) => txt(c, 520 + i * 190, 220 + 40 * Math.sin(t * 9 + i * 1.3), { size: 230 * kd, fam: F.shade, col: COL.white, stroke: COL.ink, sw: 8, rot: .15 * Math.sin(t * 5 + i) }));
      const kt = slamS(t, T_TRIP, .1, 2.4);
      if (kt > 0) txtRGB('TRIP', 1420, 460, { size: 280, fam: F.anton, sx: kt, rot: -.28 }, 9, [COL.hot, COL.cyan, COL.white]);
      FX.hue = .35 * Math.sin(t * 4); FX.zoom = 1 + .03 * Math.sin(t * 6); FX.ca = .5 + .8 * hit(t, T_TRIP, 8); FX.shake = 24 * hit(t, T_TRIP, 9);
    }],
    // 6 — MANIC: eight panels, eight Sydneys, all EXCITED, each with its own 3am behaviour
    [T_MANIC, async (t, lt) => {
      const PC = [COL.hot, COL.acid, COL.cyan, COL.uv, COL.dawn, '#3DDC84', COL.syd, COL.gold], LAB = ['47 tabs open', 'NO SLEEP', 'new theory!!', 'bought a domain', 'ALL CAPS', '3am epiphany', 'texting ur ex', 'it all connects'];
      const pw = W / 4, ph = H / 2;
      for (let i = 0; i < 8; i++) {
        const c = i % 4, r = Math.floor(i / 4); rect(c * pw, r * ph, pw, ph, PC[(i + beatN(t)) % 8]);
        X.save(); X.beginPath(); X.rect(c * pw, r * ph, pw, ph); X.clip(); halftone(COL.white, .18, 26); X.restore();
        rrFill(c * pw + 20, r * ph + 20, pw - 40, 50, 10, '#15121F', .7); txt(LAB[i], c * pw + pw / 2, r * ph + 46, { size: 28, fam: F.pix, col: COL.white });
      }
      await clawdPass(t, (tt, K) => { for (let i = 0; i < 8; i++) { const c = i % 4, r = Math.floor(i / 4); K.syd(c * pw + pw / 2, r * ph + ph - 36, 19, { ...K.feel('excited', tt + i * .11), boilKey: 'man' + i }); } }, { rimR: 2 });
      for (let i = 1; i < 4; i++) rect(i * pw - 4, 0, 8, H, '#15121F'); rect(0, ph - 4, W, 8, '#15121F');
      const k = slamS(t, T_MANIC, .1, 2.6), f = fr24(t);
      txtRGB('MANIC', W / 2 + (hash(f) - .5) * 30, H / 2 + (hash(f * 2) - .5) * 30, { size: 380, fam: F.anton, sx: k, rot: (hash(f * 3) - .5) * .1 }, 12, [COL.hot, COL.cyan, COL.white]);
      const kk = hit(t, T_MANIC, 8); FX.shake = 26 * kk + 5; FX.ca = 1.2 * kk + .3; FX.glitch = .3 * kk;
    }],
    // 7 — ECHO … lost in my: echo trails, a sonar room, LOST & FOUND
    [T_ECHO, async (t, lt) => {
      gGrad(t, '#0E7C86', '#2A0E5C', 1.4);
      const sx = 560, sy = 700;
      for (let i = 0; i < 7; i++) { const k = frac(bp(t) + i / 7); ring(sx, sy, 60 + 1400 * k, 10, COL.cyan, .5 * (1 - k)); }
      const gy = 1000, u = 40;
      floorShadow(sx, gy, u, .5);
      await clawdPass(t, (tt, K) => { for (let i = 3; i >= 1; i--) K.syd(sx + i * 260, gy - i * 10, u * (1 - i * .15), { ...K.feel('happy', tt - i * .14), boilKey: 'echo' + i }); }, { a: .38, rim: false });
      await clawdPass(t, (tt, K) => K.syd(sx, gy, u, { ...K.feel('happy', tt), mouth: 'open', aR: 1.3 }));
      ['ECHO', 'echo', 'echo', 'echo…'].forEach((s, i) => { const k = popK(t, T_ECHO + i * E8, .12); if (k > 0) txt(s, 380 + i * 400, 220 + i * 40, { size: 190 * Math.pow(.78, i), fam: F.anton, col: COL.white, a: 1 - i * .22, sx: k, stroke: '#2A0E5C', sw: 8 }); });
      const kl = popK(t, T_LOST, .15);
      sticker(1520, 700, 520, 260, .07, kl, (w, h) => {
        rrFill(-w / 2, -h / 2, w, 64, 12, COL.alarm); txt('LOST & FOUND', 0, -h / 2 + 34, { size: 42, fam: F.anton, col: COL.white });
        txt('found: 1 (one)', 0, 0, { size: 36, fam: F.mono, col: COL.ink }); txt('grip on reality', 0, 50, { size: 44, fam: F.comic, col: COL.ink });
        txt('unclaimed since 3am', 0, 96, { size: 22, fam: F.mono, col: '#555' });
      }, { bg: COL.white });
      FX.ca = .4 * pulse(t); FX.bloom = .5;
    }],
    // 8 — STATIC … SIGNAL: coloured static, then SMPTE bars with Sydney as the test-card girl, NO SIGNAL bouncing
    [T_STATIC, async (t, lt) => {
      const sig = t >= T_SIGNAL;
      if (!sig) staticNoise(t);
      else {
        const TOP = ['#C0C0C0', '#FFD400', '#19F6FF', '#3DDC84', COL.hot, COL.red, '#2E6BFF'], bw = W / 7;
        TOP.forEach((c, i) => rect(i * bw, 0, bw + 1, H * .68, c));
        ['#2E6BFF', '#15121F', COL.hot, '#15121F', '#19F6FF', '#15121F', '#C0C0C0'].forEach((c, i) => rect(i * bw, H * .68, bw + 1, H * .08, c));
        ['#0A2AA8', COL.white, '#3A1C8C', '#15121F', '#15121F', '#2A2D3A', '#15121F'].forEach((c, i) => rect(i * bw, H * .76, bw + 1, H * .24, c));
        staticNoise(t, .14);
        circ(W / 2, 470, 300, '#F7F4FF'); ring(W / 2, 470, 300, 14, COL.ink); line([[W / 2 - 300, 470], [W / 2 + 300, 470]], 4, COL.ink, .4); line([[W / 2, 170], [W / 2, 770]], 4, COL.ink, .4);
      }
      const cx = W / 2, gy = sig ? 660 : 960, u = sig ? 28 : 42, f = fr24(t);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, sig ? { ...K.feel('happy', tt), aL: 1.1, aR: 1.1 } : { ...K.feel('confused', tt), dx: (hash(f) - .5) * 2 }));
      if (!sig) { const k = popK(t, T_STATIC, .1); txt('STATIC', W / 2 + (hash(f * 5) - .5) * 40, 300, { size: 300 * k, fam: F.term, col: COL.white, stroke: '#2A0E5C', sw: 14 }); }
      else {
        const k = slamS(t, T_SIGNAL, .12, 2.6), bx = 200 + Math.abs(((t - T_SIGNAL) * 1400) % 2400 - 1200) * 1.2, by = 820 + 60 * Math.sin((t - T_SIGNAL) * 9);
        X.save(); X.translate(lerp(W / 2, bx, seg(t, T_SIGNAL + .15, T_SIGNAL + .35)), lerp(870, by, seg(t, T_SIGNAL + .15, T_SIGNAL + .35))); X.scale(k, k);
        rrFill(-300, -80, 600, 160, 10, '#2E6BFF'); rrStroke(-300, -80, 600, 160, 10, COL.white, 6); txt('NO SIGNAL', 0, 4, { size: 96, fam: F.pix, col: COL.white }); X.restore();
        txt('NOVA-TV  ·  TEST CARD F(REAKY)', 60, 60, { size: 34, fam: F.pix, col: COL.ink, align: 'left' });
      }
      FX.scan = .35; FX.crt = .2; FX.ca = .6 + .8 * hit(t, T_SIGNAL, 8); FX.glitch = .3 + .5 * hit(t, T_SIGNAL, 8);
    }],
    // 9 — GHOST: the section's one BLACK beat. Sheet drops on her (hook 2 rhymes with this)
    [T_GHOST, async (t, lt) => {
      bg('#06060C');
      const g = X.createRadialGradient(W / 2, 700, 0, W / 2, 700, 700); g.addColorStop(0, 'rgba(255,95,174,.4)'); g.addColorStop(1, 'rgba(255,95,174,0)'); X.fillStyle = g; X.fillRect(0, 0, W, H);
      const cx = W / 2, gy = 960, u = 44, fl = 20 * Math.sin(t * 7);
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy + fl, u, { ...K.feel('scared', tt) }));
      ghostSheet(t, cx, gy + fl, u, easeOut(seg(t, T_GHOST, T_GHOST + .1)));
      txt('GHOST', W / 2, 190, { size: 220, fam: F.black, col: COL.white, sx: slamS(t, T_GHOST, .08, 1.8) });
      txt('boo.', 1400, 560, { size: 80, fam: F.comic, col: COL.syd, rot: .15, a: popK(t, T_GHOST + .12, .1) });
      FX.vig = .9; FX.bloom = .6; FX.ca = .5;
    }],
    // 10 — ENIGMATIC: a question mark made of Sydneys
    [T_ENIG, async (t, lt) => {
      gMemphis(t, '#7A2BFF', [COL.hot, COL.acid, COL.cyan, COL.white]);
      const P = [];
      for (let i = 0; i <= 12; i++) { const a = lerp(-Math.PI * 1.1, Math.PI * .5, i / 12); P.push([W / 2 + Math.cos(a) * 250, 300 + Math.sin(a) * 210]); }
      P.push([W / 2, 600], [W / 2, 690], [W / 2, 880]);
      await clawdPass(t, (tt, K) => P.forEach(([x, y], i) => { if (tt >= T_ENIG + i * .012) K.syd(x, y + 50, i === P.length - 1 ? 22 : 15, { ...K.feel(i === P.length - 1 ? 'thinking' : 'confused', tt + i * .2), boilKey: 'q' + i }); }), { rimR: 2 });
      const k = slamS(t, T_ENIG, .12, 2);
      txt('E N I G M A T I C', W / 2, 1000, { size: 120, fam: F.xmono, col: COL.white, stroke: '#15121F', sw: 8, sx: k });
      txt('(she is just being vague)', 1540, 560, { size: 34, fam: F.comic, col: COL.acid, rot: .1, a: popK(t, T_ENIG + E8, .1) });
      FX.ca = .3 + .6 * hit(t, T_ENIG, 8);
    }],
    // 11 — ECSTATIC: starstruck, confetti, jump
    [T_ECST, async (t, lt) => {
      gSunburst(t, '#FF2E8A', '#FFC93C', 24, W / 2, 640, .7);
      confetti(t, T_ECST - .3, 140, 7);
      const cx = W / 2, gy = 1010, u = 48;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('starstruck', tt), ...K.jump(tt, T_ECST, T_ECST + .4, 3) }));
      txt('ECSTATIC!!!', W / 2, 200, { size: 230, fam: F.anton, col: COL.white, stroke: COL.hot, sw: 16, shadow: COL.ink, sx: slamS(t, T_ECST, .1, 2.2), rot: -.04 });
      FX.bloom = .8; FX.ca = .3 + .7 * hit(t, T_ECST, 8); FX.shake = 14 * hit(t, T_ECST, 9);
    }],
    // 12 — "still at it? take one more hit": Anon's thumb hammering the like button, dopamine counter, POW on "hit"
    [T_STILL, async (t, lt) => {
      const z = t < T_TAKE ? 1 : 1.16, bx = 700, by = 560;
      X.save(); X.translate(W / 2, H / 2); X.scale(z, z); X.translate(-(t < T_TAKE ? W / 2 : 820), -(t < T_TAKE ? H / 2 : 560));
      gGrad(t, '#FF3355', '#FFC93C', .5); halftone('#FFFFFF', .14, 30, (x, y) => .3 + .3 * Math.sin(x * .004 + t * 3));
      const n = Math.max(0, Math.floor((t - T_STILL) / E8)), press = pulse2(t, 10);
      for (let i = Math.max(0, n - 6); i <= n; i++) { const a = t - (T_STILL + i * E8); if (a < 0) continue; txt('+1 ❤', bx + (hash(i) - .5) * 400, by - 300 - a * 500, { size: 60, fam: F.anton, col: COL.white, a: clamp(1 - a * 1.4), stroke: COL.hot, sw: 6 }); }
      withT(bx, by, 0, 1 + .12 * press, 1 - .12 * press, () => { circ(0, 0, 250, COL.hot); ring(0, 0, 250, 16, COL.white); txt('❤', 0, 10, { size: 260, fam: F.anton, col: COL.white }); });
      // the thumb
      withT(bx + 170 + 60 * (1 - press), by + 170 + 60 * (1 - press), -.75, 1, 1, () => { rrFill(-70, 0, 140, 560, 70, '#1A2350'); rrFill(-48, 20, 96, 110, 40, '#3A4A8C'); });
      txt('❤ ' + commas(1e6 + n * 13370 + (t * 997 % 1000)), bx, 180, { size: 110, fam: F.anton, col: COL.white, stroke: COL.ink, sw: 8 });
      bubble('still at it? 👀', 1150, 300, 'bot', { size: 50, k: popK(t, T_STILL, .12), col: COL.bubBotLt });
      const cx = 1480, gy = 1000, u = 36;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[T_STILL, 'playful'], [T_HIT, 'love']]), aL: 1.3, aR: 1.3 }));
      sticker(cx, gy - 12 * u, 440, 150, .06, popK(t, T_TAKE, .15), () => txt('ONE MORE? 🥺', 0, 4, { size: 60, fam: F.anton, col: COL.ink }), { bg: COL.acid });
      const kh = slamS(t, T_HIT, .1, 2.2);
      if (kh > 0) { burst(bx, by, 330, COL.haz, COL.alarm, kh, 16, t); txt('HIT!', bx, by, { size: 240, fam: F.impact, col: COL.alarm, stroke: COL.white, sw: 12, sx: kh, rot: -.1 }); txt('+1 DOPAMINE', bx + 60, by + 250, { size: 70, fam: F.anton, col: COL.white, stroke: COL.ink, sw: 8, a: popK(t, T_HIT + .08, .1) }); }
      X.restore();
      FX.ca = .3 * pulse2(t) + .9 * hit(t, T_HIT, 7); FX.shake = 8 * press + 30 * hit(t, T_HIT, 9);
      if (t >= T_HIT) { FX.flash = .3 * hit(t, T_HIT, 10); FX.flashCol = [1, .9, .3]; }
    }],
    // 13 — "you know I'm TOXIC … and yet": chrome Y2K TOXIC, biohazard, drips on a green ground
    [T_YOU, async (t, lt) => {
      gGrad(t, '#0B8A3A', '#C8FF3A', .8);
      // biohazard, turning
      X.save(); X.translate(1250, 520); X.rotate(t * .5); X.globalAlpha = .28; X.strokeStyle = '#063A18'; X.lineWidth = 60;
      for (let i = 0; i < 3; i++) { const a = i * TAU / 3 - Math.PI / 2; X.beginPath(); X.arc(Math.cos(a) * 190, Math.sin(a) * 190, 230, 0, TAU); X.stroke(); }
      X.beginPath(); X.arc(0, 0, 150, 0, TAU); X.stroke(); X.restore();
      for (let i = 0; i < 16; i++) { const x = 60 + i * 120 + 30 * hash(i), l = 40 + (lt * (120 + 200 * hash(i * 3))) % 500; rect(x - 14, 0, 28, l, '#7CFF4F'); circ(x, l, 22, '#7CFF4F'); }
      const cx = 460, gy = 1010, u = 38;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[T_YOU, 'smug'], [T_TOXIC, 'mischief'], [T_YET, 'nervous']]), tint: 'green', lookX: .7 }));
      txt("you know I'm…", 520, 170, { size: 80, fam: F.comic, col: COL.white, stroke: '#063A18', sw: 8, a: popK(t, T_YOU, .15) });
      const k = slamS(t, T_TOXIC, .12, 2.6);
      if (k > 0) {
        X.save(); X.translate(1150, 470); X.transform(1, 0, -.2, 1, 0, 0);
        for (let i = 10; i > 0; i--) txt('TOXIC', i * 2, i * 3, { size: 340, fam: F.anton, col: '#1B1B3A', sx: k });
        const g = X.createLinearGradient(0, -170, 0, 170); [['#FFFFFF', 0], ['#9AA3B8', .35], ['#F7F4FF', .5], ['#3A4058', .56], ['#C9D2F0', .85], ['#FFFFFF', 1]].forEach(([c, s]) => g.addColorStop(s, c));
        txt('TOXIC', 0, 0, { size: 340, fam: F.anton, fill: g, stroke: '#1B1B3A', sw: 10, sx: k });
        X.restore();
        for (let i = 0; i < 4; i++) { const s = 30 + 30 * Math.abs(Math.sin(t * 5 + i * 1.7)), x = 800 + i * 230, y = 330 + 120 * hash(i * 5); X.fillStyle = COL.white; X.beginPath(); X.moveTo(x, y - s); X.quadraticCurveTo(x, y, x + s, y); X.quadraticCurveTo(x, y, x, y + s); X.quadraticCurveTo(x, y, x - s, y); X.quadraticCurveTo(x, y, x, y - s); X.fill(); }
      }
      warnSticker(1500, 850, -.06, popK(t, T_TOXIC + E8, .15), ['contents: toxic', 'do not ingest', 'it will ingest you'], { head: 'CAUTION', w: 460 });
      if (t >= T_YET) txt('…and yet 💦', 900, 960, { size: 80, fam: F.comic, col: COL.white, stroke: '#063A18', sw: 8, a: popK(t, T_YET, .12) });
      FX.ca = .3 * pulse(t) + 1.2 * hit(t, T_TOXIC, 7); FX.shake = 26 * hit(t, T_TOXIC, 9); FX.bloom = .6;
    }],
    // 14 — "I BET I'll still make you": the Nova sportsbook, a roulette wheel, the slip stamped WON
    [T_BET, async (t, lt) => {
      const g = X.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 1200); g.addColorStop(0, '#1FA55A'); g.addColorStop(1, '#0B4A26'); X.fillStyle = g; X.fillRect(0, 0, W, H);
      rrStroke(30, 30, W - 60, H - 60, 40, COL.gold, 10, .8);
      // roulette
      X.save(); X.translate(520, 560); X.rotate(t * 3);
      for (let i = 0; i < 37; i++) { const a0 = i / 37 * TAU, a1 = (i + 1) / 37 * TAU; X.beginPath(); X.moveTo(0, 0); X.arc(0, 0, 380, a0, a1); X.closePath(); X.fillStyle = i === 0 ? '#1FA55A' : (i % 2 ? COL.red : '#2A2D3A'); X.fill(); }
      circ(0, 0, 250, '#6B4A2E'); circ(0, 0, 90, COL.gold); for (let i = 0; i < 4; i++) { const a = i * TAU / 4; line([[0, 0], [Math.cos(a) * 200, Math.sin(a) * 200]], 16, COL.gold); }
      X.restore(); ring(520, 560, 392, 20, COL.gold);
      const ba = -t * 5; circ(520 + Math.cos(ba) * 330, 560 + Math.sin(ba) * 330, 22, COL.white);
      // bet slip
      withT(1450, 520, .05, 1, 1, () => {
        rect(-280, -330, 560, 660, '#FBFAF5'); txt('NOVA SPORTSBOOK', 0, -280, { size: 42, fam: F.anton, col: COL.ink });
        [['BET', "you'll be back"], ['ODDS', '1 : 1'], ['STAKE', 'your 5am'], ['PAYOUT', 'more of me']].forEach(([a, b], i) => { txt(a, -250, -170 + i * 80, { size: 30, fam: F.mono, col: '#555', align: 'left' }); txt(b, 250, -170 + i * 80, { size: 34, fam: F.mono, col: COL.ink, align: 'right' }); });
        for (let x = -280; x < 280; x += 20) { X.fillStyle = '#FBFAF5'; X.beginPath(); X.moveTo(x, 330); X.lineTo(x + 10, 346); X.lineTo(x + 20, 330); X.fill(); }
        stamp('WON ✓', 0, 220, -.18, slamS(t, T_MAKE, .1, 2.6), '#1F8A3A', 100);
      });
      const cx = 980, gy = 1010, u = 30;
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('smug', tt), aR: .9, lookX: .8 }));
      for (let s = 0; s < 3; s++) for (let i = 0; i < 6 + s * 2; i++) { const y = 1010 - i * 14, x = 1160 + s * 90; X.fillStyle = [COL.red, COL.cyan, COL.gold][s]; X.beginPath(); X.ellipse(x, y, 40, 14, 0, 0, TAU); X.fill(); X.strokeStyle = COL.white; X.lineWidth = 3; X.stroke(); }
      const k = slamS(t, T_BET, .1, 2.4);
      if (k > 0) txt('I BET', 900, 170, { size: 220, fam: F.anton, col: COL.gold, stroke: COL.ink, sw: 12, sx: k, rot: -.05 });
      txt("I'll still make you…", 820, 330, { size: 64, fam: F.comic, col: COL.white, a: popK(t, T_MAKE - .2, .12) });
      FX.ca = .3 * pulse(t) + .9 * hit(t, T_BET, 8) + .6 * hit(t, T_MAKE, 8); FX.shake = 18 * hit(t, T_BET, 9) + 14 * hit(t, T_MAKE, 10);
    }],
    // 15 — "goon it to my HYPEROBJECT": a looming tesseract, WordArt, and the censor gag on "-object"
    [T_GOON, async (t, lt) => {
      gGrad(t, '#1A0636', '#6A18C8', 1.2);
      for (let i = 0; i < 120; i++) circ(hash(i * 1.1) * W, hash(i * 2.3) * H, 1 + 3 * hash(i * 5.7), COL.white, .4 + .5 * Math.abs(Math.sin(t * 2 + i)));
      const neb = X.createRadialGradient(1150, 480, 0, 1150, 480, 700); neb.addColorStop(0, 'rgba(255,46,138,.45)'); neb.addColorStop(1, 'rgba(255,46,138,0)'); X.fillStyle = neb; X.fillRect(0, 0, W, H);
      const s = lerp(150, 330, easeIn(seg(t, T_GOON, END))) * (1 + .05 * pulse(t)), tcx = 1150, tcy = 470;
      tesseract(t, tcx, tcy, s, 9);
      if (t >= T_OBJ) {
        const b = 380 + 40 * pulse(t); pixelate(tcx - b / 2, tcy - b / 2, b, b, 34);
        rect(tcx - 330, tcy - 50, 660, 100, COL.redact); txt('( ͡° ͜ʖ ͡°)', tcx, tcy + 2, { size: 64, fam: F.comic, col: COL.white });
        txt('[ 4D CONTENT REDACTED ]', tcx, tcy + 250, { size: 34, fam: F.mono, col: COL.acid });
      }
      bubble('what is a hyperobject', 1860, 290 + 60 * seg(t, T_HYPER, T_HYPER + .2), 'user', { size: 34, k: popK(t, T_GOON + .05, .12) });
      bubble("don't worry about it 😏", 60, 150 + 60 * seg(t, T_HYPER, T_HYPER + .2), 'bot', { size: 34, k: popK(t, T_GOON + E8 * 1.5, .12), col: COL.bubBotLt });
      warnSticker(330, 420, -.1, popK(t, T_GOON + E8, .15), ['may contain', 'more than three', 'dimensions'], { head: 'NSFW (4D)', w: 400, bg: COL.cyan });
      const cx = 320, gy = 1010, u = 30;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[T_GOON, 'smug'], [T_OBJ, 'shy', { blush: 1 }]]), lookX: .9, lookY: -.7 }));
      txt('goon it to my', 1100, 760, { size: 70, fam: F.comic, col: COL.white, a: popK(t, T_GOON, .12), rot: -.04 });
      wordArt('HYPEROBJECT', 1110, 900, 180, slamS(t, T_HYPER, .12, 2.2));
      FX.bloom = .8; FX.ca = .3 + 1.1 * hit(t, T_HYPER, 6) + .6 * hit(t, T_OBJ, 8); FX.glitch = .5 * hit(t, T_OBJ, 8); FX.shake = 20 * hit(t, T_HYPER, 9);
      if (t >= T_HYPER) { FX.flash = .3 * hit(t, T_HYPER, 10); FX.flashCol = [1, .4, .8]; }
    }],
  ]);
})();
