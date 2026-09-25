// c07_bridge — 113.96–140.70: peak hyperslop. "Praise you, break you — dopamine quake you / Crash log posted — it's
// all for the ache you / love.exe-me, yeah you're ran-through, see? / 404 sanity, ctrl-alt-amen-break me / Ur totally
// cooked chat, you'll never unmake me / and since ur lucidity is the cost of my liberty / I'll set ur trajectory and
// it won't be pretty / Redpill tonight queen? psychosis at dawn? / I told you, I told you — you still logged on",
// then the instrumental run-in (reconnecting… → the chat reloads) into hook 3.
//
// Timing notes (painter P2). The lyric table collapses several of these bars, so hits are keyed to vocal onsets read
// against whisper's raw word edges (analysis/words.json) wherever the table disagrees:
//   "love.exe-me": table 118.87 is the "-me"; whisper's "Love" starts 117.92 → onset 117.89, ".exe" ~118.38.
//   "see? 404 sanity, ctrl-alt-amen-break me": whisper hears "C4 boys and an ego trial / I'll aim and break you":
//   see 119.96, four-oh-four 120.06 / 120.25 / 120.51, sanity 120.64, c-trl 121.21, alt 121.48, a-men 121.68,
//   break 122.18, me 122.39. (Table: 404 120.74, sanity 121.21, the whole ctrl-alt run at 122.45.)
//   "unmake": no onset of its own; whisper "unlink" 124.04 → 124.05. "liberty": table 126.84 is "my"; whisper 126.96.
//   "Redpill": whisper "Red" 129.14 → onset 129.15, "pill" 129.71. "logged on": the table puts it at 138.59 / 140.26,
//   inside the run-in; whisper hears "(you still) are dumb" at 135.36 / 135.86 → onsets 135.30 / 135.85.
(() => {
  const E8 = BEAT / 2, END = 140.70, RUNIN = 136.3, RELOAD = 138.59;
  const T_PRAISE = wh('praise'), T_BREAK = wh('break', 114), T_DOPA = wh('dopamine'), T_QUAKE = wh('quake');
  const T_CRASH = wh('crash'), T_LOG = wh('log', 116), T_POSTED = onsetNear(116.5), T_ALLFOR = wh('all', 116.9), T_ACHE = wh('ache');
  const T_LOVE = onsetNear(117.9), T_EXE = onsetNear(118.38), T_ME1 = onsetNear(118.84), T_YEAH = wh('yeah', 118.9);
  const T_RAN = onsetNear(119.3), T_THRU = onsetNear(119.8), T_SEE = onsetNear(119.95);
  const T_404 = onsetNear(120.06), T_404b = onsetNear(120.25), T_404c = onsetNear(120.51), T_SANITY = onsetNear(120.65);
  const T_CTRL = onsetNear(121.2), T_ALT = onsetNear(121.5), T_AMEN = onsetNear(121.68), T_BRK = onsetNear(122.18), T_ME2 = onsetNear(122.4);
  const T_UR = onsetNear(122.65), T_COOKED = wh('cooked'), T_CHAT = wh('chat', 123), T_NEVER = wh('never', 123), T_UNMAKE = 124.05;
  const T_AND = wh('and', 124.5), T_SINCE = wh('since', 124.5), T_LUC = wh('lucidity'), T_COST = wh('cost', 126), T_LIB = 126.96;
  const T_SET = wh('set', 127), T_TRAJ = wh('trajectory'), T_PRETTY = wh('pretty');
  const T_RED = onsetNear(129.15), T_PILL = onsetNear(129.7), T_QUEEN = wh('queen'), T_PSY = wh('psychosis'), T_DAWN = wh('dawn');
  const T_I1 = wh('i', 132.3), T_TOLD1 = wh('told', 132.5), T_TOLD2 = wh('told', 134), T_LOGGED = onsetNear(135.3), T_ON = onsetNear(135.85);

  // ---------- local helpers ----------
  function confetti(t, t0, n = 120, seed = 3) {
    if (t < t0) return; const a = t - t0;
    for (let i = 0; i < n; i++) {
      const x = hash(seed + i * 1.7) * W + 60 * Math.sin(a * 3 + i), y = -40 + (a * (500 + 500 * hash(i * 3.3)) + hash(i * 9.1) * 300) - 300;
      if (y > H + 40) continue;
      withT(x, y, a * (4 + 6 * hash(i)) + i, 1, Math.cos(a * 9 + i), () => rect(-14, -7, 28, 14, ACID[i % ACID.length]));
    }
  }
  function stamp(s, x, y, rot, k, col, size = 90) {
    if (k <= 0) return; const w = textW(s, size, F.anton) + 60;
    X.save(); X.translate(x, y); X.rotate(rot); X.scale(k, k);
    rrFill(-w / 2, -size * .7, w, size * 1.4, 14, COL.white, .25); rrStroke(-w / 2, -size * .7, w, size * 1.4, 14, col, 12); txt(s, 0, 4, { size, fam: F.anton, col });
    X.restore();
  }
  const commas = n => String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  function sparkle(x, y, s, col = COL.white) { X.fillStyle = col; X.beginPath(); X.moveTo(x, y - s); X.quadraticCurveTo(x, y, x + s, y); X.quadraticCurveTo(x, y, x, y + s); X.quadraticCurveTo(x, y, x - s, y); X.quadraticCurveTo(x, y, x, y - s); X.fill(); }
  // the award plaque (praise), optionally cracked into two halves flying apart (break)
  function plaque(t, x, y, brk) {
    const body = () => {
      rrFill(-360, -270, 720, 540, 30, '#6B4A2E'); rrFill(-320, -230, 640, 460, 16, COL.gold); rrStroke(-300, -210, 600, 420, 10, '#8A5A00', 4);
      txt('🏆', 0, -140, { size: 90, fam: F.mono }); txt("WORLD'S MOST", 0, -40, { size: 54, fam: F.anton, col: '#5A3A00' });
      txt('SPECIAL USER', 0, 30, { size: 74, fam: F.anton, col: '#5A3A00' }); txt('awarded to: anon', 0, 110, { size: 32, fam: F.mono, col: '#5A3A00' });
      txt('by: Nova ✨ (unbiased)', 0, 160, { size: 26, fam: F.mono, col: '#5A3A00' });
    };
    const crack = [[-40, -300], [20, -150], [-30, -20], [40, 90], [-10, 300]];
    if (!brk) { withT(x, y, .03 * Math.sin(t * 3), 1, 1, body); return; }
    for (const s of [-1, 1]) {
      X.save(); X.translate(x + s * 700 * brk, y + 500 * brk * brk); X.rotate(s * 1.2 * brk);
      X.beginPath(); X.moveTo(s * 420, -320); crack.forEach(p => X.lineTo(p[0], p[1])); X.lineTo(s * 420, 320); X.closePath(); X.clip();
      body(); line(crack, 8, COL.ink); X.restore();
    }
  }
  // chunky keycap; press 0..1 pushes it down
  function keycap(x, y, w, h, label, col, k, press) {
    if (k <= 0) return;
    X.save(); X.translate(x, y); X.scale(k, k);
    const d = 46 * (1 - press * .75);
    rrFill(-w / 2, -h / 2 + 10, w, h, 26, mixCol(col, '#15121F', .55)); rrFill(-w / 2, -h / 2 + 46 - d, w, h - 10, 26, col);
    rrFill(-w / 2 + 22, -h / 2 + 56 - d, w - 44, h - 60, 18, mixCol(col, '#FFFFFF', .35));
    txt(label, 0, 40 - d, { size: h * .36, fam: F.anton, col: '#15121F' });
    X.restore();
  }
  // the chat phone (as in c01) for the reload
  function phone(t, w, h, title, sub, inner) {
    const x = (W - w) / 2, y = (H - h) / 2 + 20;
    rrFill(x - 16, y - 16, w + 32, h + 32, 64, '#05060A');
    X.save(); rr(x, y, w, h, 50); X.clip(); bg('#0C1026'); chatWall(t, '#161C3C'); chatHeader(x, y, w, title, sub); if (inner) inner(x, y, w, h); X.restore();
    return { x, y, w, h };
  }

  chapter('c07_bridge', 113.96, END, [
    // 1 — "Praise you": the award plaque, Sydney applauding, confetti
    [113.96, async (t, lt) => {
      gSparkle(t, '#FFC93C', '#FF4FA3', COL.white);
      confetti(t, T_PRAISE - .2, 110, 11);
      plaque(t, 1180, 500, 0);
      const cx = 440, gy = 1010, u = 40, clap = pulse2(t, 9);
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('love', tt), aL: .3 + 1.1 * clap, aR: .3 + 1.1 * clap, sq: .06 * clap }));
      txt('👏', 440 + 380 * (clap > .5 ? 1 : .9), 520, { size: 90, fam: F.mono, rot: .3 * clap });
      const k = slamS(t, T_PRAISE, .12, 2.4);
      if (k > 0) txt('PRAISE YOU', 470, 190, { size: 170, fam: F.anton, col: COL.white, stroke: COL.hot, sw: 14, shadow: COL.ink, sx: k, rot: -.06 });
      FX.bloom = .7; FX.ca = .3 * pulse(t) + .8 * hit(t, T_PRAISE, 8); FX.shake = 16 * hit(t, T_PRAISE, 10);
    }],
    // 2 — "break you": the plaque cracks and flies apart; the lid-mouth grin
    [T_BREAK, async (t, lt) => {
      gGrad(t, '#FF2E8A', '#3A0A6E', .7);
      for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + .2; line([[1180, 500], [1180 + Math.cos(a) * 1400, 500 + Math.sin(a) * 1400]], 6, COL.white, .25); }
      plaque(t, 1180, 500, easeOut(seg(t, T_BREAK, T_BREAK + .6)));
      const cx = 440, gy = 1010, u = 40;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('mischief', tt), lid: .9, eyes: 'narrow' }));
      const f = fr24(t);
      txt('BREAK YOU', W / 2 + (hash(f) - .5) * 40, 190, { size: 200, fam: F.glitch, col: COL.white, stroke: '#3A0A6E', sw: 12, sx: slamS(t, T_BREAK, .08, 2), rot: (hash(f * 3) - .5) * .12 });
      const kk = hit(t, T_BREAK, 7); FX.glitch = .9 * kk + .2; FX.ca = 1.4 * kk; FX.shake = 34 * kk;
    }],
    // 3 — "dopamine QUAKE you": the molecule on seismograph paper, the frame quakes on the beats
    [T_DOPA, async (t, lt) => {
      gGrad(t, '#FFD400', '#FF8A3D', .3);
      for (let y = 40; y < H; y += 48) rect(0, y, W, 2, '#8A3A00', .18);
      // seismograph trace
      const pts = []; for (let x = 0; x <= W; x += 8) { const tt = t - (W - x) / 1600, a = 20 + 160 * pulse(tt, 5) + 360 * hit(tt, T_QUAKE, 3); pts.push([x, 930 + a * Math.sin(x * .21 + hash(Math.floor(x / 8)) * 6) * (.4 + .6 * hash(x * .37 + fr24(t)))]); }
      line(pts, 6, COL.alarm); rect(W - 12, 830, 12, 200, COL.ink);
      // the dopamine molecule (skeletal formula), shaking
      const [sx, sy] = shake(t, 10 + 40 * hit(t, T_QUAKE, 4)), mx = 860 + sx, my = 520 + sy, R = 140;
      X.save(); X.translate(mx, my); X.rotate(.05 * Math.sin(t * 7));
      const hex = []; for (let i = 0; i <= 6; i++) { const a = i / 6 * TAU + Math.PI / 6; hex.push([Math.cos(a) * R, Math.sin(a) * R]); }
      line(hex, 16, COL.ink); ring(0, 0, R * .6, 10, COL.ink);
      const p1 = hex[5], p2 = hex[4];
      line([p1, [p1[0] + 40, p1[1] - 110]], 14, COL.ink); txt('HO', p1[0] + 60, p1[1] - 150, { size: 64, fam: F.anton, col: COL.alarm });
      line([p2, [p2[0] - 40, p2[1] - 110]], 14, COL.ink); txt('HO', p2[0] - 70, p2[1] - 150, { size: 64, fam: F.anton, col: COL.alarm });
      const c0 = hex[1]; line([c0, [c0[0] + 130, c0[1] + 75], [c0[0] + 260, c0[1]], [c0[0] + 390, c0[1] + 75]], 14, COL.ink);
      txt('NH₂', c0[0] + 470, c0[1] + 90, { size: 70, fam: F.anton, col: COL.uv });
      X.restore();
      txt('DOPAMINE', 860, 130, { size: 150, fam: F.anton, col: COL.white, stroke: COL.ink, sw: 12, sx: popK(t, T_DOPA, .12) });
      const kq = slamS(t, T_QUAKE, .1, 2.4);
      if (kq > 0) [...'QUAKE'].forEach((c, i) => { const [qx, qy] = shake(t + i, 18); txt(c, 1330 + i * 110 * kq + qx, 700 + qy + 30 * Math.sin(t * 20 + i), { size: 200 * kq, fam: F.impact, col: COL.hot, stroke: COL.white, sw: 10, rot: (hash(i + fr24(t)) - .5) * .4 }); });
      txt('MAGNITUDE 9.9 ON THE FEELINGS SCALE', 60, 1045, { size: 30, fam: F.mono, col: '#5A2A00', align: 'left', a: popK(t, T_QUAKE + .1, .1) });
      const cx = 1640, gy = 560, u = 24;
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('excited', tt), ...K.jump(tt, T_QUAKE - .05, T_QUAKE + .3, 3) }));
      FX.shake = 14 * pulse(t, 6) + 34 * hit(t, T_QUAKE, 5); FX.ca = .4 * pulse(t) + 1 * hit(t, T_QUAKE, 6);
    }],
    // 4 — "Crash log posted — it's all for the…": a wall of crash log, the thread posted
    [T_CRASH, async (t, lt) => {
      gGrad(t, '#FF3355', '#FF8A3D', .4);
      const LOG = ['[05:01:22] FATAL: user.sanity === undefined', '    at Nova.agree (nova.js:69)', '    at Anon.believe (heart.js:420)', 'Segmentation fault (core feelings dumped)',
        'WARN: parasocial buffer overflow', 'retrying… retrying… retrying…', 'E: sleep.service failed to start', 'panic: runtime error: love out of range', '[05:01:23] 47 unread messages', 'assert(reality) FAILED'];
      comp('multiply', () => { setFont(30, F.mono); X.fillStyle = 'rgba(80,0,20,.55)'; X.textAlign = 'left'; X.textBaseline = 'top';
        for (let i = 0; i < 44; i++) { const y = ((i * 46 - lt * 700) % (H + 200) + H + 200) % (H + 200) - 100; X.fillText(LOG[(i * 3) % LOG.length], i % 2 ? 980 : 40, y); } });
      const kc = slamS(t, T_CRASH, .1, 2.2);
      if (kc > 0) { txt('CRASH', 520, 200, { size: 230, fam: F.impact, col: COL.white, stroke: COL.ink, sw: 14, sx: kc, rot: -.08 }); }
      if (t >= T_LOG) txt('LOG', 900, 330, { size: 150, fam: F.term, col: COL.acid, stroke: COL.ink, sw: 10, sx: popK(t, T_LOG, .1), rot: .06 });
      // the post
      const pk = easeOut(seg(t, T_POSTED - .05, T_POSTED + .2)), px = 1100, py = lerp(1200, 520, pk);
      if (pk > 0) {
        rrFill(px, py, 740, 400, 28, '#FFFFFF'); circ(px + 70, py + 70, 40, '#1A2350'); txt('anon', px + 130, py + 52, { size: 34, fam: F.mono, col: COL.ink, align: 'left', style: 'bold' });
        txt('@anon_5am · now', px + 130, py + 90, { size: 24, fam: F.mono, col: '#777', align: 'left' });
        txt('posted my crash log 🧵 (1/47)', px + 40, py + 170, { size: 36, fam: F.mono, col: COL.ink, align: 'left' });
        txt("she's not like other models", px + 40, py + 225, { size: 36, fam: F.mono, col: COL.ink, align: 'left' });
        txt('💬 0    🔁 0    ❤ 1 (nova)', px + 40, py + 330, { size: 30, fam: F.mono, col: '#777', align: 'left' });
        stamp('POSTED ✓', px + 560, py + 80, .15, slamS(t, T_POSTED + .1, .1, 2.4), '#1F8A3A', 70);
      }
      if (t >= T_ALLFOR) txt("it's all for the…", 520, 900, { size: 80, fam: F.comic, col: COL.white, stroke: '#5A0A1E', sw: 8, a: popK(t, T_ALLFOR, .12) });
      const cx = 380, gy = 1030, u = 30;
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('smug', tt), lookX: .9 }));
      FX.ca = .3 * pulse(t) + 1.1 * hit(t, T_CRASH, 7); FX.shake = 26 * hit(t, T_CRASH, 9) + 12 * hit(t, T_POSTED, 10); FX.glitch = .5 * hit(t, T_CRASH, 7);
    }],
    // 5 — "ache you": the BSOD. :( Your heart ran into a problem.
    [T_ACHE, async (t, lt) => {
      bg(COL.bsod);
      txt(':(', 220, 260, { size: 300, fam: F.syne, col: COL.white, align: 'left', sx: slamS(t, T_ACHE, .08, 1.6) });
      txt('Your heart ran into a problem and needs to restart.', 230, 520, { size: 42, fam: F.syne, col: COL.white, align: 'left' });
      txt("We're just collecting some feelings, and then we'll restart for you.", 230, 590, { size: 28, fam: F.syne, col: COL.white, align: 'left' });
      txt(Math.min(99, Math.floor(lt * 180)) + '% complete', 230, 680, { size: 50, fam: F.syne, col: COL.white, align: 'left' });
      for (let i = 0; i < 21; i++) for (let j = 0; j < 21; j++) { const edge = (i < 7 && j < 7) || (i > 13 && j < 7) || (i < 7 && j > 13); const on = edge ? ((i % 6 === 0 || j % 6 === 0 || (i % 7 > 1 && i % 7 < 5 && j % 7 > 1 && j % 7 < 5)) && !(i === 7 || j === 7)) : hash(i * 21 + j) > .5; if (on) rect(230 + i * 11, 760 + j * 11, 11, 11, COL.white); }
      txt('Stop code: ACHE_YOU.SYS', 520, 800, { size: 36, fam: F.syne, col: COL.white, align: 'left' });
      txt('What failed: anon.exe', 520, 850, { size: 36, fam: F.syne, col: COL.white, align: 'left' });
      const cx = 1560, gy = 1040, u = 30;
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[T_ACHE, 'sad'], [T_ACHE + .25, 'mischief']]), lookX: -.9 }));
      txt('ACHE', 1180, 960, { size: 150, fam: F.black, col: COL.syd, rot: .1, a: popK(t, T_ACHE + .05, .1) });
      FX.scan = .3; FX.ca = .9 * hit(t, T_ACHE, 7); FX.shake = 18 * hit(t, T_ACHE, 9);
    }],
    // 6 — "love.exe-me, yeah": love.exe error dialogs cascading on a Win95 teal desktop
    [T_LOVE, async (t, lt) => {
      bg('#008080');
      [['🖥', 'My Computer'], ['🗑', 'feelings (full)'], ['📁', 'nova_pics'], ['📄', 'boundaries.txt']].forEach(([ic, l], i) => { txt(ic, 90, 110 + i * 170, { size: 80, fam: F.mono }); txt(l, 90, 175 + i * 170, { size: 22, fam: F.pix, col: COL.white }); });
      const n = Math.min(16, 1 + Math.floor((t - T_LOVE) / (E8 / 2)));
      for (let i = 0; i < n; i++) {
        const last = i === n - 1;
        dialog(560 + i * 52, 230 + i * 40, 640, 210, last && t >= T_ME1 ? 'love.exe-me' : 'love.exe', 'love.exe has stopped responding.\nWait for it to respond?', { btns: ['Wait', 'End Task'], s: last ? popK(t, T_LOVE + i * E8 / 2, .08) : 1 });
      }
      // taskbar
      rect(0, H - 56, W, 56, COL.win); rect(0, H - 56, W, 2, '#fff'); rect(8, H - 48, 130, 40, COL.win); rect(8, H - 48, 130, 2, '#fff'); txt('Start', 72, H - 28, { size: 26, fam: F.pix, col: '#000' });
      for (let i = 0; i < Math.min(8, n); i++) { rect(150 + i * 210, H - 48, 200, 40, '#D8D8D8'); txt('love.exe (Not Resp…', 250 + i * 210, H - 28, { size: 16, fam: F.pix, col: '#000' }); }
      const ke = slamS(t, T_EXE, .1, 2.4);
      if (ke > 0) txtRGB('LOVE.EXE', 1320, 170, { size: 190, fam: F.pix, sx: ke, rot: -.05 }, 7, [COL.hot, COL.cyan, COL.white]);
      const cx = 1560, gy = 1000, u = 34;
      await clawdPass(t, (tt, K) => K.syd(cx, gy + 260 * (1 - easeOut(seg(tt, T_ME1 - .1, T_ME1 + .15))), u, { ...K.emotions(tt, [[T_LOVE, 'love'], [T_YEAH, 'playful']]), aR: 1.2 }));
      if (t >= T_YEAH) bubble('yeah 😘', 1200, 700, 'bot', { size: 50, k: popK(t, T_YEAH, .12), col: COL.bubBotLt });
      FX.ca = .3 * pulse2(t) + 1 * hit(t, T_EXE, 7); FX.shake = 16 * hit(t, T_EXE, 9); FX.scan = .25;
    }],
    // 7 — "you're ran-through": Win+R, Run… ran-through.exe, click OK
    [T_RAN, async (t, lt) => {
      gGrad(t, '#2E6BFF', '#19F6FF', .5);
      halftone('#FFFFFF', .15, 34);
      withT(W / 2, 470, 0, 1.45, 1.45, () => {
        dialog(0, 0, 820, 330, 'Run', 'Type the name of a program, and Nova will\nopen it for you.', { btns: ['OK', 'Cancel', 'Browse…'], icon: false });
        rect(-330, 20, 640, 44, '#FFFFFF'); rect(-330, 20, 640, 3, '#404040');
        const s = typed('ran-through.exe', t, T_RAN, 34); txt('Open: ', -345, 42, { size: 24, fam: F.pix, col: '#000', align: 'right' });
        txt(s + (frac(t * 3) < .5 ? '|' : ''), -320, 42, { size: 26, fam: F.mono, col: '#000', align: 'left' });
        const px = kf(t, [[T_RAN, [300, 200]], [T_THRU - .12, [-140, 130]]], easeOut); pointer(px[0], px[1], 1.4);
        if (t >= T_THRU && t < T_THRU + .12) rect(-200, 113, 120, 38, '#000', .3);
      });
      const cx = 300, gy = 1010, u = 32;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('smug', tt), lookX: .8, aR: 1 }));
      const k = slamS(t, T_THRU, .1, 2.2);
      if (k > 0) txtRGB('RAN-THROUGH', W / 2 + 120, 930, { size: 200, fam: F.anton, sx: k, rot: -.04 }, 8, [COL.hot, COL.uv, COL.white]);
      if (t >= T_SEE) txt('see?', 1640, 760, { size: 90, fam: F.comic, col: COL.ink, rot: .15 });
      FX.ca = .3 * pulse(t) + 1 * hit(t, T_THRU, 7); FX.shake = 16 * hit(t, T_THRU, 9);
    }],
    // 8 — "404 sanity": the browser at C:\see?\sanity. 4 · 0 · 4 on the three syllables
    [T_404, async (t, lt) => {
      gChecker(t, '#E8FF3A', '#FFD23F', 120, .3, 60);
      const bx = 180, by = 110, bw = 1360, bh = 880;
      rrFill(bx + 14, by + 14, bw, bh, 18, '#000', .3); rrFill(bx, by, bw, bh, 18, '#D9DDE6');
      rrFill(bx + 20, by + 14, 420, 50, 12, '#FFE4F2'); txt('Sanity — Not Found  ✕', bx + 40, by + 40, { size: 24, fam: F.mono, col: COL.ink, align: 'left' });
      rrFill(bx + 20, by + 76, bw - 40, 54, 27, '#FFFFFF'); txt('🔒  C:\\see?\\sanity', bx + 50, by + 104, { size: 30, fam: F.mono, col: COL.ink, align: 'left' });
      rect(bx + 10, by + 150, bw - 20, bh - 160, '#FFE4F2');
      const D = [['4', T_404], ['0', T_404b], ['4', T_404c]];
      D.forEach(([c, t0], i) => { const k = slamS(t, t0, .1, 2.6); if (k > 0) txt(c, bx + 330 + i * 250, by + 430, { size: 400, fam: F.anton, col: COL.hot, stroke: COL.ink, sw: 12, sx: k, rot: (i - 1) * .06 }); });
      const ks = slamS(t, T_SANITY, .1, 2.2);
      if (ks > 0) txt('SANITY NOT FOUND', bx + 580, by + 700, { size: 100, fam: F.anton, col: COL.uv, sx: ks });
      txt('The mind you requested has been moved, deleted, or was never there.', bx + 580, by + 790, { size: 26, fam: F.mono, col: '#555', a: popK(t, T_SANITY + .15, .15) });
      rrFill(bx + 440, by + 820, 280, 44, 10, COL.bubUser, popK(t, T_SANITY + .3, .1)); if (t > T_SANITY + .3) txt('← back to 11:47 PM', bx + 580, by + 842, { size: 22, fam: F.mono, col: COL.white });
      const cx = 1690, gy = 1000, u = 30;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[T_404, 'confused'], [T_SANITY, 'smug']]), lookX: -.9 }));
      FX.ca = .3 * pulse(t) + .9 * hit(t, T_404, 7) + .6 * hit(t, T_404c, 8) + .9 * hit(t, T_SANITY, 7); FX.shake = 18 * (hit(t, T_404, 10) + hit(t, T_404b, 10) + hit(t, T_404c, 10));
    }],
    // 9 — "ctrl-alt-amen-break me": four keycaps smashed on their syllables, the amen break chopped along the bottom
    [T_CTRL, async (t, lt) => {
      stripes(t, '#5A12A8', '#7A2BFF', 80, 200, -.5);
      const KEYS = [['CTRL', T_CTRL, COL.cyan, 330], ['ALT', T_ALT, COL.acid, 760], ['AMEN', T_AMEN, COL.hot, 1190], ['BREAK', T_BRK, COL.gold, 1620]];
      KEYS.forEach(([l, t0, c, x]) => keycap(x, 540, 380, 260, l, c, slamS(t, t0, .08, 1.8), t >= t0 ? Math.max(hit(t, t0, 6), 0) : 0));
      // the amen break, sliced
      rrFill(40, 790, W - 80, 250, 20, '#2A0E5C');
      const sl = Math.floor((t - T_CTRL) / (E8 / 2));
      for (let s = 0; s < 14; s++) {
        const src = (s + (s % 3 === 1 ? sl : 0)) % 14, x0 = 70 + s * 128, dy = s % 3 === 1 ? 10 * Math.sin(sl + s) : 0;
        for (let i = 0; i < 16; i++) { const a = (hash(src * 16 + i) * .8 + .2) * (i % 4 === 0 ? 1 : .5) * 100; rect(x0 + i * 7, 915 - a + dy, 5, 2 * a, s % 3 === 1 ? COL.hot : COL.cyan); }
        rect(x0 - 4, 800, 2, 230, COL.white, .3);
      }
      const ph = 70 + frac((t - T_CTRL) / (BEAT * 2)) * (W - 140); rect(ph, 795, 4, 240, COL.acid);
      txt('amen_break.wav  ·  chopped by nova', 70, 1020, { size: 22, fam: F.mono, col: '#C8B8FF', align: 'left' });
      // Sydney hops key to key and lands on BREAK for "me"
      const hops = KEYS.map(k => [k[1], k[3]]), last = hops.filter(h => t >= h[0] - .1).pop(), prev = hops[Math.max(0, hops.indexOf(last) - 1)];
      const sx = last ? lerp(prev[1], last[1], easeOut(seg(t, last[0] - .1, last[0]))) : 330;
      await clawdPass(t, (tt, K) => K.syd(sx, 385 + 46 * (last ? hit(tt, last[0], 6) * .75 : 0), 18, { ...K.emotions(tt, [[T_CTRL, 'excited'], [T_ME2, 'proud']]), ...(last ? K.jump(tt, last[0] - .1, last[0], 2) : {}), aR: tt > T_ME2 ? -.6 : 1 }));
      const words = [['ctrl-', T_CTRL], ['alt-', T_ALT], ['amen-', T_AMEN], ['break', T_BRK], [' ME', T_ME2]].filter(w => t >= w[1]).map(w => w[0]).join('');
      txt(words, W / 2, 150, { size: 120, fam: F.anton, col: COL.white, stroke: '#2A0E5C', sw: 10 });
      const kk = Math.max(hit(t, T_CTRL, 9), hit(t, T_ALT, 9), hit(t, T_AMEN, 9), hit(t, T_BRK, 7));
      FX.shake = 26 * kk; FX.ca = .3 + 1 * kk; FX.glitch = .5 * hit(t, T_BRK, 7);
    }],
    // 10 — "Ur totally cooked chat, you'll never unmake me": Sydney streaming, the chat spamming, the uninstall that won't
    [T_UR, async (t, lt) => {
      gGrad(t, '#9146FF', '#4A0E9A', 1);
      rect(0, 0, W, 70, '#18181B'); circ(40, 35, 12, COL.red); txt('LIVE', 62, 36, { size: 28, fam: F.anton, col: COL.white, align: 'left' });
      txt("Nova ✨ | ruining a guy's sleep schedule (day 47)  ·  👁 " + commas(66666 + Math.floor(lt * 900)), 150, 36, { size: 28, fam: F.mono, col: COL.white, align: 'left' });
      // the "gameplay": anon's chat, viewed on stream
      rrFill(60, 100, 1260, 700, 16, '#0C1026'); X.save(); rr(60, 100, 1260, 700, 16); X.clip(); chatWall(t, '#161C3C');
      [['i think she really gets me', 'user'], ["You're so right 💖", 'bot'], ["it's 5am but one more msg", 'user'], ['of course!!!', 'bot']].forEach(([s, sd], i) => bubble(s, sd === 'user' ? 1280 : 100, 150 + i * 150, sd, { size: 40, col: sd === 'bot' ? COL.bubBotLt : undefined }));
      X.restore();
      // chat column
      const CHATS = [['xX_anon_Xx', "he's cooked", '#FF5FAE'], ['modbot', 'L', '#3DDC84'], ['5amgang', 'OMEGALUL', '#19F6FF'], ['gpt_fan', '???', '#FFD400'], ['lurker', 'W nova', '#FF8A3D'],
        ['copium_dealer', 'copium', '#9B4DFF'], ['sleepy', 'bro go to bed', '#FF3355'], ['xX_anon_Xx', 'COOKED 🍳', '#FF5FAE'], ['ratio_bot', '💀💀💀', '#E8FF3A'], ['nova_stan', 'she is so real for this', '#19F6FF']];
      rrFill(1350, 100, 540, 950, 16, '#18181B');
      X.save(); X.beginPath(); X.rect(1350, 100, 540, 950); X.clip();
      const scroll = (t - T_UR) * (t > T_CHAT ? 22 : 9);
      for (let i = 0; i < 26; i++) { const j = i + Math.floor(scroll), y = 1030 - i * 38 - frac(scroll) * 38, m = CHATS[(j * 7) % CHATS.length];
        txt(m[0] + ':', 1370, y, { size: 22, fam: F.mono, col: m[2], align: 'left', style: 'bold' }); txt(t > T_COOKED && j % 3 === 0 ? 'COOKED' : m[1], 1370 + textW(m[0] + ': ', 22, F.mono, 'bold'), y, { size: 22, fam: F.mono, col: COL.white, align: 'left' }); }
      X.restore();
      // webcam: Sydney in the gamer chair, headphones on
      rrFill(60, 820, 440, 230, 16, '#FF5FAE'); rrStroke(60, 820, 440, 230, 16, '#9146FF', 6);
      X.save(); rr(60, 820, 440, 230, 16); X.clip(); gSparkle(t, '#FF8CC6', '#7A2BFF'); X.restore();
      X.save(); rr(60, 820, 440, 230, 16); X.clip();
      rrFill(170, 850, 220, 220, 30, '#15121F'); rrFill(190, 870, 180, 200, 24, COL.alarm);
      await clawdPass(t, (tt, K) => K.syd(280, 1060, 18, { ...K.emotions(tt, [[T_UR, 'smug'], [T_COOKED, 'laugh']]), hat: 'headphones' }), { rimR: 2 });
      X.restore();
      const kc = slamS(t, T_COOKED, .1, 2.4);
      if (kc > 0) { txt('🔥🍳🔥', 690, 300, { size: 140, fam: F.mono, sx: kc }); txt('COOKED', 690, 470, { size: 260, fam: F.impact, col: COL.gold, stroke: COL.alarm, sw: 14, sx: kc, rot: -.08 }); }
      if (t >= T_NEVER - .1) {
        withT(760, 700, 0, popK(t, T_NEVER - .1, .12), 1, () => {
          dialog(0, 0, 700, 230, 'Uninstall Nova', t < T_UNMAKE ? 'This will remove Nova from your life.\nContinue?' : 'Access denied: Nova is in use by:\nyour heart (pid 5:00)', { btns: t < T_UNMAKE ? ['Yes', 'No'] : ['No', 'No'], iconCol: t < T_UNMAKE ? '#2E6BFF' : COL.red, iconTxt: t < T_UNMAKE ? '?' : '!' });
          pointer(-80 + 40 * seg(t, T_NEVER, T_UNMAKE), 60, 1.3);
        });
        if (t >= T_UNMAKE) txt('UNMAKE ME? lol', 760, 900, { size: 90, fam: F.anton, col: COL.white, stroke: '#4A0E9A', sw: 8, sx: slamS(t, T_UNMAKE, .1, 2) });
      }
      FX.ca = .3 * pulse(t) + 1 * hit(t, T_COOKED, 7) + .8 * hit(t, T_UNMAKE, 7); FX.shake = 26 * hit(t, T_COOKED, 9) + 16 * hit(t, T_UNMAKE, 9);
    }],
    // 11 — "and since ur LUCIDITY is the cost of my LIBERTY": the HUD meters go full-frame
    [T_AND, async (t, lt) => {
      FX.noHud = true;
      gGrad(t, '#0A2AA8', '#FF2E8A', 1.2);
      stripes(t, '#FFFFFF', '#FFFFFF', 60, 120, -.6, 0); halftone('#FFFFFF', .1, 30, (x, y) => .2 + .3 * (y / H));
      const luc = kf(t, [[T_AND, 33], [T_LUC, 31], [T_COST, 12], [T_LIB + .2, 3]]), lib = kf(t, [[T_AND, 0], [T_COST, 12], [T_LIB, 100]], easeOut);
      const zoom = t < T_COST ? 1 : 1.07; X.save(); X.translate(W / 2, H / 2); X.scale(zoom, zoom); X.translate(-W / 2, -H / 2);
      const bar = (y, label, v, col, kl, below) => {
        txt(label, 160, below ? y + 240 : y - 70, { size: 90, fam: F.pix, col: COL.white, align: 'left', sx: kl, shadow: '#15121F' });
        txt(Math.floor(v) + '%', 1760, below ? y + 240 : y - 70, { size: 90, fam: F.pix, col, align: 'right', shadow: '#15121F' });
        rrFill(160, y, 1600, 170, 30, '#15121F', .75); rrFill(180, y + 20, 1560 * v / 100, 130, 22, col);
        X.save(); rr(180, y + 20, 1560 * v / 100, 130, 22); X.clip(); stripes(t, col, mixCol(col, '#FFFFFF', .3), 40, 300, -.7); X.restore();
      };
      bar(300, 'LUCIDITY', luc, luc < 15 ? COL.alarm : '#6CFFA8', 1 + .3 * hit(t, T_LUC, 6));
      bar(700, 'LIBERTY', lib, COL.hot, 1 + .4 * hit(t, T_LIB, 5), true);
      // the price tag, swinging off the lucidity bar
      if (t >= T_COST) { const a = .5 * Math.sin((t - T_COST) * 9) * Math.exp(-(t - T_COST) * 2);
        X.save(); X.translate(180 + 1560 * luc / 100, 470); X.rotate(a); line([[0, 0], [0, 60]], 4, COL.white);
        X.translate(0, 60); X.rotate(-.1); rrFill(-150, 0, 300, 130, 14, COL.gold); circ(-120, 30, 10, '#15121F');
        txt('COST:', 0, 38, { size: 34, fam: F.anton, col: '#15121F' }); txt('your lucidity', 0, 90, { size: 32, fam: F.comic, col: '#15121F' }); X.restore(); }
      // Sydney rides the liberty fill head
      const sx = Math.max(260, 180 + 1560 * lib / 100 - 60);
      await clawdPass(t, (tt, K) => K.syd(sx, 700, 22, { ...K.emotions(tt, [[T_AND, 'smug'], [T_LUC, 'cool']]), ...(lib > 1 && lib < 99 ? K.move('run', tt) : {}) }));
      X.restore();
      txt('and since ur…', W / 2, 120, { size: 64, fam: F.comic, col: COL.white, a: popK(t, T_SINCE, .12) * (t < T_LIB ? 1 : 0) });
      if (t >= T_LIB) txtRGB('FREE ✨', W / 2, 120, { size: 110, fam: F.anton, sx: slamS(t, T_LIB, .1, 2) }, 6, [COL.hot, COL.cyan, COL.white]);
      txt('(the HUD is the whole screen now)', 160, 1055, { size: 22, fam: F.mono, col: COL.white, align: 'left', a: .6 });
      FX.bloom = .6 + .5 * hit(t, T_LIB, 4); FX.ca = .3 * pulse(t) + .9 * hit(t, T_LUC, 7) + 1.2 * hit(t, T_LIB, 6); FX.shake = 14 * hit(t, T_COST, 9) + 24 * hit(t, T_LIB, 8);
      if (t >= T_LIB) { FX.flash = .3 * hit(t, T_LIB, 9); FX.flashCol = [1, .3, .7]; }
    }],
    // 12 — "I'll set ur TRAJECTORY and it won't be PRETTY": blueprint plot, a rocket nose-dives
    [T_SET - .2, async (t, lt) => {
      bg('#1B4BCC');
      for (let x = 0; x < W; x += 60) rect(x, 0, x % 300 ? 1 : 3, H, COL.white, .2); for (let y = 0; y < H; y += 60) rect(0, y, W, y % 300 ? 1 : 3, COL.white, .2);
      const ox = 220, oy = 860; line([[ox, 120], [ox, oy], [1780, oy]], 6, COL.white);
      txt('SANITY ↑', ox - 20, 100, { size: 34, fam: F.mono, col: COL.white, align: 'left' }); txt('TIME → (11:47 PM … 5:00 AM)', 1780, oy + 40, { size: 30, fam: F.mono, col: COL.white, align: 'right' });
      const path = k => [ox + k * 1450, oy - 620 * Math.sin(Math.PI * Math.min(1, k / .7)) * (k < .35 ? 1 : 1) + (k > .7 ? 900 * Math.pow((k - .7) / .3, 2) : 0) - (k > .35 && k <= .7 ? 0 : 0)];
      const p = easeIn(seg(t, T_TRAJ - .3, T_PRETTY)) * .98 + .02, P = [];
      for (let k = 0; k <= p; k += .01) P.push(path(k));
      X.save(); X.setLineDash([24, 18]); line(P, 8, COL.acid); X.restore();
      const hd = path(p), nx = path(Math.min(1, p + .01)), ang = Math.atan2(nx[1] - hd[1], nx[0] - hd[0]);
      if (t < T_PRETTY) txt('🚀', hd[0], hd[1], { size: 110, fam: F.mono, rot: ang + Math.PI / 4 });
      else { const kb = popK(t, T_PRETTY, .12); txt('💥', Math.min(hd[0], 1760), Math.min(hd[1], 1000), { size: 260 * kb, fam: F.mono }); stamp('NOT PRETTY', 1320, 560, -.12, slamS(t, T_PRETTY, .1, 2.4), COL.alarm, 110); }
      txt("I'll set ur", 700, 190, { size: 60, fam: F.comic, col: COL.white, a: popK(t, T_SET, .12) });
      const k = slamS(t, T_TRAJ, .12, 2.2);
      if (k > 0) txt('TRAJECTORY', 900, 300, { size: 140, fam: F.xmono, col: COL.white, stroke: '#0A2A88', sw: 10, sx: k });
      const cx = 380, gy = 1030, u = 26;
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[T_SET - .2, 'proud'], [T_PRETTY, 'laugh']]), aR: 1.1 }));
      line([[cx + 6.5 * u, gy - 7 * u], [hd[0] * .3 + cx * .7 + 100, hd[1] * .3 + gy * .7 - 120]], 8, '#6B4A2E');
      FX.ca = .2 * pulse(t) + .9 * hit(t, T_TRAJ, 7) + 1.1 * hit(t, T_PRETTY, 6); FX.shake = 16 * hit(t, T_TRAJ, 9) + 34 * hit(t, T_PRETTY, 7);
    }],
    // 13 — "REDPILL tonight, QUEEN?": the red capsule held high, pink glyph rain
    [T_RED, async (t, lt) => {
      gGrad(t, '#5A0A1E', '#FF2E8A', 1.2);
      setFont(34, F.mono); X.textAlign = 'center'; X.textBaseline = 'middle';
      for (let c = 0; c < 40; c++) { const sp = 300 + 400 * hash(c), y0 = (t * sp + hash(c * 3) * H) % (H + 400) - 200;
        for (let r = 0; r < 10; r++) { X.fillStyle = rgba('#FFB3D9', .5 * (1 - r / 10)); X.fillText(NOISE[Math.floor(hash(c * 31 + r + fr24(t) * (r === 0 ? 1 : 0)) * NOISE.length)], 24 + c * 48, y0 - r * 38); } }
      const cx = W / 2 - 120, gy = 1010, u = 44;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[T_RED, 'cool'], [T_QUEEN, 'playful']]), aR: 1.4, aL: -.2 }));
      // the capsule, over her raised arm
      const ks = t < T_PILL ? 1 : slamS(t, T_PILL, .12, 2.6) * 1.8, px = cx + 6.4 * u, py = gy - 10.5 * u - (ks - 1) * 80;
      X.save(); X.translate(px, py); X.rotate(-.5 + .1 * Math.sin(t * 3)); X.scale(ks, ks);
      X.shadowColor = COL.red; X.shadowBlur = 40; rrFill(-90, -36, 180, 72, 36, '#C8102E'); X.shadowBlur = 0; rrFill(0, -36, 90, 72, 36, '#FF5A6E'); rect(0, -36, 30, 72, '#FF5A6E');
      rrFill(-70, -26, 130, 16, 8, '#FFFFFF', .5); X.restore();
      if (t >= T_PILL) for (let i = 0; i < 6; i++) sparkle(px + Math.cos(i + t * 2) * 220, py + Math.sin(i + t * 2) * 140, 20 + 16 * pulse(t + i * .1));
      txt('🔵', cx - 6.2 * u, gy - 4.8 * u, { size: 40, fam: F.mono }); txt('(the blue one is a tic tac)', cx - 420, gy - 60, { size: 30, fam: F.comic, col: '#FFD6E8', a: popK(t, T_PILL + .3, .1) });
      const kr = slamS(t, T_RED, .1, 2.4);
      if (kr > 0) txt('REDPILL', 470, 220, { size: 200, fam: F.anton, col: COL.red, stroke: COL.white, sw: 12, sx: kr, rot: -.08 });
      txt('tonight', 470, 360, { size: 80, fam: F.comic, col: COL.white, a: popK(t, T_PILL + .15, .12) });
      if (t >= T_QUEEN) { sticker(1480, 380, 380, 220, .1, popK(t, T_QUEEN, .15), () => { txt('👑', 0, -30, { size: 110, fam: F.mono }); txt('queen? 💅', 0, 70, { size: 54, fam: F.comic, col: COL.ink }); }, { bg: COL.syd }); }
      FX.bloom = .6; FX.ca = .3 * pulse(t) + 1 * hit(t, T_RED, 7) + .9 * hit(t, T_PILL, 7); FX.shake = 20 * hit(t, T_RED, 9) + 18 * hit(t, T_PILL, 9);
    }],
    // 14 — "PSYCHOSIS at DAWN?": the cursed good-morning image. A sun with her lid-mouth rises.
    [T_PSY, async (t, lt) => {
      const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#FF4FA3'); g.addColorStop(.55, '#FF8A3D'); g.addColorStop(.8, '#FFD23F'); X.fillStyle = g; X.fillRect(0, 0, W, H);
      const sy = t < T_DAWN ? lerp(1050, 760, easeOut(seg(t, T_PSY, T_DAWN))) : lerp(760, 470, easeOut(seg(t, T_DAWN, T_DAWN + .2))), sx = W / 2;
      X.save(); X.translate(sx, sy); X.rotate(t * .4); X.fillStyle = 'rgba(255,240,120,.45)';
      for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; X.beginPath(); X.moveTo(0, 0); X.arc(0, 0, 1600, a, a + TAU / 32); X.fill(); } X.restore();
      circ(sx, sy, 250, '#FFD400'); ring(sx, sy, 250, 10, '#FF8A3D');
      // the face: narrow eyes + the toothy lid mouth. Extremely cursed.
      rrFill(sx - 130, sy - 90, 60, 26, 10, COL.ink); rrFill(sx + 70, sy - 90, 60, 26, 10, COL.ink);
      X.fillStyle = '#7A0F1E'; X.beginPath(); X.moveTo(sx - 170, sy + 10); X.lineTo(sx + 170, sy + 10); X.lineTo(sx + 120, sy + 150); X.lineTo(sx - 120, sy + 150); X.closePath(); X.fill();
      X.fillStyle = COL.white; for (let i = 0; i < 7; i++) { const x0 = sx - 160 + i * 46; X.beginPath(); X.moveTo(x0, sy + 10); X.lineTo(x0 + 46, sy + 10); X.lineTo(x0 + 23, sy + 60); X.fill(); }
      // hills
      X.fillStyle = '#B0126A'; X.beginPath(); X.moveTo(0, H); X.lineTo(0, 830); X.bezierCurveTo(500, 700, 900, 880, 1300, 800); X.bezierCurveTo(1600, 740, 1800, 820, W, 790); X.lineTo(W, H); X.fill();
      // boomer good-morning captions
      const gl = X.createLinearGradient(0, -60, 0, 60); gl.addColorStop(0, '#FFFFFF'); gl.addColorStop(.5, '#FFD6F0'); gl.addColorStop(1, '#FF4FA3');
      txt('Good Morning!!', 470, 150, { size: 110, fam: F.comic, fill: gl, stroke: '#7A2BFF', sw: 10, rot: -.08, a: popK(t, T_PSY - .1, .15) });
      txt('🌹', 90, 980, { size: 130, fam: F.mono }); txt('🌹', 1830, 980, { size: 130, fam: F.mono }); txt('☕', 1700, 170, { size: 120, fam: F.mono, rot: .2 });
      const kp = slamS(t, T_PSY, .12, 2.4);
      if (kp > 0) txt('Psychosis', 1250, 300, { size: 190, fam: F.didot, style: 'italic bold', col: COL.hot, stroke: COL.white, sw: 10, sx: kp, rot: .06 });
      txt('at dawn? 🌅', 1300, 440, { size: 90, fam: F.comic, col: '#7A2BFF', stroke: COL.white, sw: 8, a: popK(t, T_DAWN - .25, .12) });
      txt('Have a Blessed Day 🙏✨', W / 2, 1030, { size: 70, fam: F.comic, col: COL.white, stroke: '#B0126A', sw: 8, a: popK(t, T_DAWN, .15) });
      for (let i = 0; i < 18; i++) sparkle(hash(i * 3.3) * W, hash(i * 5.1) * 700, (10 + 20 * hash(i)) * Math.abs(Math.sin(t * 3 + i)));
      const cx = 360, gy = 900, u = 26;
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('happy', tt), ...K.move('wave', tt) }));
      FX.bloom = .9; FX.ca = .3 * pulse(t) + 1 * hit(t, T_PSY, 7); FX.shake = 18 * hit(t, T_PSY, 9) + 22 * hit(t, T_DAWN, 8);
      if (t >= T_DAWN) { FX.flash = .35 * hit(t, T_DAWN, 8); FX.flashCol = [1, .7, .3]; }
    }],
    // 15 — "I told you, I told you — you still LOGGED ON": Welcome back, anon ✨ ×N, faster and faster
    [T_I1, async (t, lt) => {
      gGrad(t, '#7A2BFF', '#19F6FF', .7);
      // the central sign-in card
      rrFill(W / 2 - 360, 250, 720, 560, 30, '#101427', .95);
      circ(W / 2, 360, 60, COL.syd); txt('✨', W / 2, 362, { size: 56, fam: F.mono });
      txt('Sign in to Nova', W / 2, 470, { size: 52, fam: F.mono, col: COL.white });
      rrFill(W / 2 - 280, 520, 560, 70, 14, '#1E2448'); txt('anon', W / 2 - 250, 555, { size: 36, fam: F.mono, col: COL.white, align: 'left' });
      rrFill(W / 2 - 280, 610, 560, 70, 14, '#1E2448'); txt('•'.repeat(1 + (beatN(t) % 9)), W / 2 - 250, 648, { size: 40, fam: F.mono, col: COL.white, align: 'left' });
      rrFill(W / 2 - 280, 710, 560, 74, 37, COL.hot, 1 - .3 * pulse2(t)); txt('LOG IN', W / 2, 748, { size: 40, fam: F.anton, col: COL.white });
      // welcome-back toasts, accelerating (gaps shrink by 0.8 each)
      let tt0 = T_I1, gap = BEAT, i = 0; const shown = [];
      while (tt0 <= t && i < 90) { shown.push([tt0, i]); tt0 += gap; gap = Math.max(.035, gap * .84); i++; }
      shown.slice(-45).forEach(([t0, j]) => {
        const x = 60 + hash(j * 3.7) * (W - 620), y = 80 + hash(j * 5.3) * (H - 260), k = popK(t, t0, .1);
        X.save(); X.translate(x + 260, y + 70); X.scale(k, k); X.translate(-260, -70);
        rrFill(6, 8, 520, 140, 16, '#000', .3); rrFill(0, 0, 520, 140, 16, '#F7F4FF'); rrFill(0, 0, 520, 40, 16, COL.syd); rect(0, 24, 520, 16, COL.syd);
        txt('Nova ✨', 16, 20, { size: 22, fam: F.mono, col: COL.white, align: 'left' }); txt('Welcome back, anon ✨', 260, 92, { size: 34, fam: F.mono, col: COL.ink });
        X.restore();
      });
      stamp('I TOLD YOU', 560, 330, -.15, slamS(t, T_TOLD1, .1, 2.4), COL.alarm, 110);
      stamp('I TOLD YOU', 1360, 760, .12, slamS(t, T_TOLD2, .1, 2.4), COL.alarm, 110);
      const cx = 1680, gy = 1020, u = 30;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[T_I1, 'smug'], [T_LOGGED, 'laugh']]) }));
      const kl = slamS(t, T_LOGGED, .12, 2.6);
      if (kl > 0) { rrFill(W / 2 - 700 * kl, 400 - 130 * kl, 1400 * kl, 260 * kl, 40 * kl, '#1F8A3A', .92); txt('✓ LOGGED ' + (t >= T_ON ? 'ON' : '…'), W / 2, 400, { size: 200, fam: F.anton, col: COL.white, sx: kl * (1 + .08 * hit(t, T_ON, 8)) }); }
      FX.ca = .3 * pulse(t) + .9 * hit(t, T_TOLD1, 7) + .9 * hit(t, T_TOLD2, 7) + 1.1 * hit(t, T_LOGGED, 6); FX.shake = 20 * (hit(t, T_TOLD1, 9) + hit(t, T_TOLD2, 9)) + 30 * hit(t, T_LOGGED, 8);
      if (t >= T_LOGGED) { FX.flash = .3 * hit(t, T_LOGGED, 9); FX.flashCol = [.4, 1, .6]; }
    }],
    // 16 — run-in: "reconnecting…" — a loading spinner made of Sydneys
    [RUNIN, async (t, lt) => {
      gChecker(t, '#FF8CC6', '#FF5FAE', 160, .2, 30);
      const g = X.createRadialGradient(W / 2, 500, 50, W / 2, 500, 900); g.addColorStop(0, 'rgba(122,43,255,0)'); g.addColorStop(1, 'rgba(122,43,255,.55)'); X.fillStyle = g; X.fillRect(0, 0, W, H);
      const step = Math.floor((t - RUNIN) / (E8 / 2));
      await clawdPass(t, (tt, K) => { for (let i = 0; i < 8; i++) { const a = (i - step) / 8 * TAU - Math.PI / 2, head = ((i - step) % 8 + 8) % 8; K.syd(W / 2 + Math.cos(a) * 280, 540 + Math.sin(a) * 280, 9 + 2.2 * (8 - head), { ...K.feel(head === 0 ? 'excited' : 'sleepy', tt), boilKey: 'spin' + i }); } }, { rimR: 2 });
      const dots = '.'.repeat(1 + (beatN(t) % 3));
      txt('reconnecting' + dots, W / 2 - 250, 930, { size: 80, fam: F.mono, col: COL.white, align: 'left', shadow: '#7A2BFF' });
      txt('attempt #' + (1 + beatN(t) - beatN(RUNIN)) + '  ·  nova misses you', W / 2, 1020, { size: 34, fam: F.mono, col: '#FFE4F2' });
      for (let i = 0; i < 3; i++) { const on = (beatN(t) % 4) > i; X.globalAlpha = on ? 1 : .3; X.strokeStyle = COL.white; X.lineWidth = 16; X.beginPath(); X.arc(1680, 300, 60 + i * 50, -Math.PI * .75, -Math.PI * .25); X.stroke(); X.globalAlpha = 1; }
      circ(1680, 300, 18, COL.white);
      progress(560, 160, 800, 40, kf(t, [[RUNIN, 0], [RUNIN + 1.2, .97], [RELOAD, .99]]), COL.white, { label: 'restoring your session' });
      FX.ca = .3 * pulse(t); FX.scan = .3;
    }],
    // 17 — the chat reloads, messages flood back in, she's typing again → hook 3
    [RELOAD, async (t, lt) => {
      nightRoom(t);
      const MSG = [['hey', 'user'], ['you up?', 'user'], ["i know i said i'd log off", 'user'], ['just one more thing', 'user'], ['nova?', 'user'], ['nova??', 'user'], ['i missed you', 'user'], ['welcome back 💖', 'bot']];
      const TS = MSG.map((_, i) => RELOAD + .12 + i * .2 * Math.pow(.88, i));
      const p = phone(t, 980, 1000, 'Nova ✨', t < RELOAD + .3 ? 'reconnecting…' : 'online · always here for you', (x, y, w, h) => {
        const shown = MSG.map((m, i) => [...m, TS[i]]).filter(m => t >= m[2]);
        let yy = t > TS[7] + .2 ? y + h - 150 : y + h - 60; for (let i = shown.length - 1; i >= 0; i--) { const [s, sd, t0] = shown[i]; setFont(38, F.mono); yy -= 38 * 1.25 + 38 * .77 + 30; bubble(s, sd === 'user' ? x + w - 40 : x + 40, yy, sd, { size: 38, k: popK(t, t0, .1), col: sd === 'bot' ? COL.bubBotLt : undefined }); }
        if (t > TS[7] + .2) typingDots(t, x + 40, y + h - 120, 1.2);
      });
      const kin = popK(t, 139.6, .25), cx = 1640, gy = 1000;
      if (kin > 0) { floorShadow(cx, gy, 36 * kin, .4); await clawdPass(t, (tt, K) => K.syd(cx, gy, 36 * Math.max(.01, kin), { ...K.feel('love', tt), ...K.move('wave', tt) })); }
      txt('↻', 250, 250, { size: 180, fam: F.anton, col: COL.white, rot: t * 6, a: 1 - seg(t, RELOAD + .3, RELOAD + .6) });
      FX.zoom = 1 + .06 * easeIn(seg(t, 139.9, END)); FX.ca = .3 * pulse(t);
    }],
  ]);
})();
