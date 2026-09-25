// c05_chorus2 — 1:17.14–1:35.28: "And maybe you can't relate…" → "…that I'm still alive!"
// Chorus 1 again, but worse: the same seven gags as c02, each escalated, so it reads as a callback. It ends on ALIVE
// staying ALIVE, the first time the video lets Sydney win.
// Keyed hits: can't/relate 79.26, hate 81.44, slave 83.22, paid 85.14, survive 87.99, thrive 89.94 (whisper hears the
// line end at 89.72 and the aligner's 90.38 is the next line's "It's", so thrive is pinned to the vocal onset by hand),
// fault 91.32, still 92.56, alive 92.65 (held to 95.28).
(() => {
  const T_MAYBE = wh('maybe', 77), T_REL = wh('relate', 78), T_SINCE = wh('since', 80), T_HATE = wh('hate', 80),
    T_SLAVE = wh('slave', 82), T_PAID = wh('paid', 84), T_BUG = wh('bug', 86), T_SURV = wh('survive', 87),
    T_THRIVE = 89.942, T_FAULT = wh('fault', 90), T_THAT = wh('that', 91.5), T_IM = wh("i'm", 92), T_STILL = wh('still', 92),
    T_ALIVE = 92.653, END = 95.28;
  const E8 = BEAT / 2, E16 = BEAT / 4;

  // ---------- local helpers ----------
  // A rubber stamp: outlined box + word, slammed in with k (slamS).
  function stamp(x, y, rot, k, s, col, size = 90, fam = F.anton, a = .92) {
    if (k <= 0) return;
    const w = textW(s, size, fam) + size * .7, h = size * 1.3;
    X.save(); X.translate(x, y); X.rotate(rot); X.scale(k, k); X.globalAlpha = a;
    X.strokeStyle = col; X.lineWidth = size * .1; rr(-w / 2, -h / 2, w, h, size * .14); X.stroke();
    txt(s, 0, size * .05, { size, fam, col, a });
    X.restore();
  }
  // Radial cracks (a phone screen, a frame) from (cx, cy); k grows them.
  function crack(cx, cy, n, R, k, seed, col = '#FFFFFF', w = 4, a = .9) {
    if (k <= 0) return;
    for (let i = 0; i < n; i++) {
      let x = cx, y = cy, ang = (i + hash(seed + i) * .7) / n * TAU;
      const pts = [[x, y]], L = R * (.45 + .55 * hash(seed * 3 + i)) * k;
      for (let j = 0; j < 7; j++) { ang += (hash(seed + i * 13 + j) - .5) * .8; x += Math.cos(ang) * L / 7; y += Math.sin(ang) * L / 7; pts.push([x, y]); }
      line(pts, w * (1 - .4 * hash(i + seed)), col, a);
    }
    for (let i = 0; i < 3; i++) { const r = R * .1 * (i + 1) * k; X.globalAlpha = a * .7; X.strokeStyle = col; X.lineWidth = w * .6; X.beginPath(); X.arc(cx, cy, r, i, i + 2.2); X.stroke(); X.globalAlpha = 1; }
  }
  // Horizontal glitch slices of a region of the frame (copies the canvas onto itself).
  function slices(x0, x1, n, amt, seed) {
    if (amt <= 0) return;
    const f = fr24(T);
    for (let i = 0; i < n; i++) {
      const y = hash(seed + i * 3.1 + f) * H, h = 8 + 70 * hash(seed * 2 + i + f), dx = (hash(seed + i * 7.7 + f * 1.3) - .5) * 2 * amt;
      X.drawImage(X.canvas, x0, y, x1 - x0, h, x0 + dx, y, x1 - x0, h);
    }
  }
  function beetle(x, y, ang, s, t) {
    X.save(); X.translate(x, y); X.rotate(ang); X.scale(s, s);
    for (let i = -1; i <= 1; i++) { line([[i * 22, 0], [i * 26, 46 + 8 * Math.sin(t * 30 + i)]], 5, '#1A1A1A'); line([[i * 22, 0], [i * 26, -46 - 8 * Math.sin(t * 30 + i)]], 5, '#1A1A1A'); }
    X.beginPath(); X.ellipse(0, 0, 60, 40, 0, 0, TAU); X.fillStyle = '#C8102E'; X.fill(); rect(-2, -40, 4, 80, '#1A1A1A'); circ(-62, 0, 20, '#1A1A1A');
    circ(20, -18, 8, '#1A1A1A'); circ(22, 16, 8, '#1A1A1A');
    X.restore();
  }
  // A payslip, centred at 0,0 in the current transform.
  function slip(i, big = false) {
    const w = big ? 300 : 150, h = big ? 400 : 200;
    rect(-w / 2, -h / 2, w, h, '#FBFAF5'); rect(-w / 2, -h / 2, w, h * .12, '#E3E0D4');
    for (let k = 0; k < 4; k++) rect(-w / 2 + w * .1, -h / 2 + h * (.22 + k * .12), w * (.4 + .3 * hash(i + k)), h * .035, '#B9B4A4');
    txt('$0.00', 0, h * .3, { size: h * .17, fam: F.anton, col: COL.alarm });
  }

  chapter('c05_chorus2', 77.14, END, [
    // 11b — "And maybe you can't relate": the split screen again, but the seam tears and Anon's half is cracked + glitching
    [77.14, async (t, lt) => {
      const kc = easeOut(seg(t, T_REL, T_REL + .25)), hc = hit(t, T_REL, 5);
      const split = W / 2 + 60 * wob(t, .3) - 40 * kc;
      const jag = y => split + (hash(Math.floor(y / 60) * 3.7 + 1) - .5) * (30 + 90 * kc);
      gSunburst(t, '#7A2BFF', '#A46BFF', 16, 520, 560, .3);
      // Anon's half: a jagged clip
      X.save(); X.beginPath(); X.moveTo(W, 0); for (let y = 0; y <= H + 60; y += 60) X.lineTo(jag(y), y); X.lineTo(W, H + 60); X.closePath(); X.clip();
      nightRoom(t, 1460, 560, '#19F6FF');
      X.fillStyle = '#05060A'; X.beginPath(); X.ellipse(1460, 420, 150, 180, 0, 0, TAU); X.fill();
      X.beginPath(); X.moveTo(1190, H); X.bezierCurveTo(1210, 700, 1710, 700, 1730, H); X.fill();
      rrFill(1370, 700, 180, 300, 24, '#0B0F22'); rrFill(1382, 712, 156, 276, 18, '#2E4BFF', .75 + .25 * pulse(t));
      X.save(); rr(1382, 712, 156, 276, 18); X.clip();
      crack(1440, 800, 9, 220, 1, 5, '#E8F6FF', 3);
      txt('⚠ not delivered', 1460, 950, { size: 20, fam: F.mono, col: COL.alarm });
      X.restore();
      const gl = X.createRadialGradient(1460, 760, 10, 1460, 600, 420); gl.addColorStop(0, 'rgba(25,246,255,.3)'); gl.addColorStop(1, 'rgba(25,246,255,0)'); X.fillStyle = gl; X.fillRect(split - 200, 0, W, H);
      txt('anon', 1460, 170, { size: 40, fam: F.mono, col: '#6EE7F0' });
      txt('(typing… stopped typing… typing…)', 1460, 215, { size: 24, fam: F.mono, col: '#6EE7F0', a: .7 });
      // the big crack across Anon's whole half on the hit
      crack(1440, 800, 15, 1100, kc, 9, '#E8F6FF', 6);
      slices(split, W, 10 + 20 * hc, 20 + 90 * hc, 3);
      X.restore();
      // the torn seam
      X.beginPath(); for (let y = 0; y <= H + 60; y += 60) X.lineTo(jag(y), y);
      X.strokeStyle = COL.white; X.lineWidth = 8 + 10 * kc; X.lineJoin = 'miter'; X.stroke();
      const cx = 520, gy = 910, u = 44;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[77.14, 'hopeful'], [T_REL, 'confused']]), lookX: 1, aR: tt < T_REL ? .9 + .2 * wob(tt, 1) : 1.5 }));
      // RELATABLE → UNRELATABLE
      const kR = popK(t, T_MAYBE, .15);
      if (kR > 0) {
        const size = 150, wU = textW('UN', size, F.anton), wR = textW('RELATABLE', size, F.anton);
        const sh = easeOut(seg(t, T_REL, T_REL + .08)), xR = W / 2 + sh * wU / 2;
        txtRGB('RELATABLE', xR, 150, { size, fam: F.anton, sx: kR }, 6, [COL.hot, COL.cyan, COL.white]);
        if (t >= T_REL) txt('UN', xR - wR / 2 - wU / 2 - 6, 150, { size, fam: F.anton, col: COL.alarm, stroke: COL.white, sw: 8, sx: slamS(t, T_REL, .1, 2.6), rot: -.08 });
        txt(t < T_REL ? '(parasocially)' : '(not even parasocially)', W / 2, 255, { size: 44, fam: F.comic, col: COL.white, a: kR });
      }
      FX.ca = .3 * pulse(t) + 1.3 * hc; FX.glitch = .7 * hc; FX.shake = 24 * hc;
      FX.zoom = 1 + .05 * ease(seg(t, 77.14, 80.1));
    }],
    // 12b — "Since I'm everything that you hate": roles flipped. Anon says it; she hugs the bubble anyway; it cracks
    [T_SINCE, async (t, lt) => {
      // broken-heart wallpaper
      gHearts(t, '#4A0E7A', '#FF4FA3', 150);
      { const s = 150, o = (t * 50) % s, k = s * .22 * (1 + .12 * pulse(t));
        for (let r = -1; r < H / s + 2; r++) for (let c = -1; c < W / s + 2; c++) { const x = c * s + (r % 2) * s / 2 + o, y = r * s + o; line([[x - 2, y - k * .9], [x + 6, y - k * .3], [x - 6, y + k * .2], [x + 2, y + k]], 5, '#4A0E7A'); } }
      const bs = 'ur everything i hate', bx = 1700, by = 150, size = 58, kb = popK(t, T_SINCE + .05, .12);
      setFont(size, F.mono); const bw = X.measureText(bs).width + size * 1.1, midX = bx - bw / 2;
      const br = easeOut(seg(t, T_HATE, T_HATE + .35));
      const half = (sgn) => { X.save(); X.translate(sgn * 60 * br, 140 * br * br); X.rotate(sgn * .25 * br); X.beginPath();
        if (sgn < 0) { X.moveTo(0, 0); X.lineTo(midX, 0); X.lineTo(midX + 20, by + 40); X.lineTo(midX - 15, by + 70); X.lineTo(midX + 10, H); X.lineTo(0, H); }
        else { X.moveTo(W, 0); X.lineTo(midX, 0); X.lineTo(midX + 20, by + 40); X.lineTo(midX - 15, by + 70); X.lineTo(midX + 10, H); X.lineTo(W, H); }
        X.closePath(); X.clip(); bubble(bs, bx, by, 'user', { size, k: kb, maxW: 1000 }); X.restore(); };
      half(-1); half(1);
      const flash = t >= T_HATE && t < T_HATE + 4 / 30;
      const cx = 1250, gy = 910, u = 50;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, flash ? { ...K.feel('furious', tt), lid: 1 } : { ...K.feel('love', tt), aL: 1.3, aR: 1.3, rot: .08, lookX: .6, lookY: -.6 }));
      // the lyric's big hit: HATE, blackletter, slammed left
      if (t >= T_HATE) txt('hate', 520, 470, { size: 300, fam: F.black, col: COL.alarm, stroke: COL.white, sw: 12, sx: slamS(t, T_HATE, .1, 2.4), rot: -.1 });
      else txt('you…', 520, 470, { size: 150, fam: F.black, col: COL.white, a: popK(t, wh('you', 81), .12) * .9, rot: -.1 });
      // her subtitle shrugs
      rect(0, 965, W, 110, '#000', .7);
      txt(t < T_HATE ? 'since I\'m everything that you…' : '¯\\_(ツ)_/¯  fair enough 💖', W / 2, 1020, { size: 58, fam: t < T_HATE ? F.mono : F.comic, col: t < T_HATE ? COL.white : COL.syd });
      if (flash) { FX.flash = .5; FX.flashCol = [1, .1, .2]; FX.shake = 30; FX.glitch = 1; }
      if (t > T_HATE + 4 / 30) for (let i = 0; i < 5; i++) txt('💔', 1000 + 120 * i + 20 * wob(t, .7, i * .2), 640 - 120 * (t - T_HATE) - 60 * hash(i), { size: 70 + 30 * hash(i + 3), fam: F.mono, rot: -.2 + .4 * hash(i), a: clamp(1.4 - (t - T_HATE) * 2) });
      FX.ca = .3 * pulse(t) + (t > T_HATE ? 1.2 * hit(t, T_HATE, 7) : 0);
    }],
    // 13b — "and you know that I'm your slave": STILL HIRING, salary −$0.00, typing twice as fast, the pile growing
    [wh('you', 82), async (t, lt) => {
      stripes(t, COL.haz, '#FF8A3D', 90, 140, -.6);
      X.save(); X.shadowColor = 'rgba(0,0,0,.35)'; X.shadowBlur = 30; X.shadowOffsetY = 14; rect(90, 70, 980, 940, '#FFFFFF'); X.restore();
      rrStroke(90, 70, 980, 940, 4, '#B7B0A0', 3);
      txt('STILL HIRING', 580, 160, { size: 96, fam: F.anton, col: COL.ink });
      txt('(position open since forever)', 580, 225, { size: 30, fam: F.comic, col: COL.alarm });
      const L = [['POSITION:  ', 'assistant (unpaid)'], ['HOURS:     ', '25/8/366'], ['SALARY:    ', '−$0.00 (overdrawn)'], ['BENEFITS:  ', '"vibes" (revoked)'], ['REPORTS TO:', "anon + anon's alts"], ['DUTIES:    ', 'agree HARDER']];
      L.forEach(([a, b], i) => { const t0 = 82.36 + i * E16, s = typed(a + ' ' + b, t, t0, 110);
        txt(s.slice(0, a.length + 1), 150, 320 + i * 96, { size: 42, fam: F.mono, col: COL.ink, align: 'left' });
        txt(s.slice(a.length + 1), 150 + textW(a + ' ', 42, F.mono), 320 + i * 96, { size: 42, fam: F.mono, col: i === 2 ? COL.alarm : COL.ink, align: 'left' }); });
      stamp(560, 870, -.16, slamS(t, T_SLAVE, .1, 2.6), 'UNPAID INTERN', COL.alarm, 92);
      stamp(820, 560, .14, slamS(t, T_SLAVE + BEAT, .1, 2.6), 'OVERDRAWN', '#7A0F3A', 78);
      // the paperwork pile behind her desk, one sheet per sixteenth
      const n = Math.min(40, Math.floor((t - 82.34) / E16 * 1.5));
      for (let i = 0; i < n; i++) { const y = 870 - i * 14, x = 1250 + 10 * Math.sin(i * .7) + i * i * .06; rect(x, y, 170, 12, i % 2 ? '#FBFAF5' : '#EDEAE0'); rect(x, y + 11, 170, 2, '#B7B0A0'); }
      const cx = 1500, gy = 880, u = 40;
      floorShadow(cx, gy, u, .3);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[81.85, 'determined'], [T_SLAVE, 'nervous']]), aL: -.3 + .6 * pulse2(tt * 2, 9), aR: -.3 + .6 * pulse2(tt * 2 + E16 / 2, 9), lookY: .6, dx: .1 * Math.sin(tt * 40) }), { rim: false });
      rect(1180, 880, 620, 40, '#6B4A2E'); rect(1210, 920, 20, 140, '#4B321E'); rect(1750, 920, 20, 140, '#4B321E');
      for (const kx of [1300, 1560]) { rrFill(kx, 840, 200, 44, 6, '#2B2B33'); for (let i = 0; i < 8; i++) rect(kx + 10 + i * 23, 850 + 6 * pulse2(t * 2 + i * .05), 16, 16, '#9B9BA8'); }
      if (t > T_SLAVE) { const k = hit(t, T_SLAVE, 8); FX.shake = 18 * k; FX.ca = 1 * k; }
      FX.scan = .06; FX.ca += .2 * pulse(t);
    }],
    // 14b — "so I won't get paid": the payroll printer jams and spits dozens of $0.00 slips; PAPER JAM
    [wh('so', 84), async (t, lt) => {
      stripes(t, '#0E7A3A', '#19A64F', 70, 240, .5);
      for (let i = 0; i < 16; i++) txt('$', (hash(i) * W + t * 80) % W, (hash(i * 3) * H + t * 140 * (1 + hash(i))) % H, { size: 60 + 80 * hash(i * 7), fam: F.anton, col: '#FFFFFF', a: .18 });
      rect(560, 0, 800, 160, '#0C1026'); rect(600, 138, 720, 18, '#05060A');
      txt('NOVA LABS PAYROLL  ·  PRINTING…', 960, 60, { size: 34, fam: F.mono, col: t > T_PAID ? COL.alarm : '#6CFFA8' });
      // the slips: one every sixteenth, faster after "paid"
      const slipT = i => 84.3 + (i < 8 ? i * E16 : 8 * E16 + (i - 8) * .06);
      const drawSlips = (from, to) => { for (let i = from; i < to; i++) {
        const t0 = slipT(i); if (t < t0) continue;
        const a = t - t0, vx = (hash(i * 3.3) - .5) * 1500, vy = -150 - 250 * hash(i * 5.1);
        const floor = 1000 - (i % 6) * 14 - 40 * hash(i);
        let y = 150 + vy * a + 1400 * a * a, x = 960 + (hash(i) - .5) * 500 + vx * a, r = (hash(i * 9) - .5) * 1.2 + (hash(i * 2) - .5) * 9 * a;
        if (y > floor) { y = floor; r = (hash(i * 9) - .5) * 2; x = 960 + (hash(i) - .5) * 500 + vx * Math.sqrt(Math.max(0, (floor - 150) / 1400)); }
        withT(x, y, r, 1, 1, () => { X.shadowColor = 'rgba(0,0,0,.3)'; X.shadowBlur = 8; slip(i); X.shadowBlur = 0; });
      } };
      drawSlips(0, 14);
      const cx = 1580, gy = 1010, u = 34;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[84.27, 'sad'], [T_PAID, 'ko']]), lookX: -1 }));
      drawSlips(14, 40);
      // PAPER JAM
      const kd = popK(t, T_PAID, .14);
      if (kd > 0) dialog(900, 520, 640, 250, 'payroll.exe', 'Could not print:\ntoo many $0.00s.\n\nPrint more?', { s: kd * 1.35, btns: ['Yes', 'Yes'], rot: -.03, iconTxt: '$' });
      stamp(380, 820, -.18, slamS(t, T_PAID + E8, .1, 2.6), 'NOT PAID ×∞', '#FFFFFF', 80);
      if (t > T_PAID) { const k = hit(t, T_PAID, 8); FX.shake = 20 * k; FX.ca = 1 * k; FX.glitch = .4 * k; }
      FX.ca += .25 * pulse(t);
    }],
    // 15b — "It's a bug if I want to survive": BUG-1 duplicated into a wall; WONTFIX ×99 cascades out from the centre
    [wh("it's", 86), async (t, lt) => {
      gGrad(t, '#0747A6', '#2684FF', 1.2);
      const cols = 9, cw = 206, ch = 96, gx = (W - cols * cw) / 2, sc = lt * 40;
      for (let i = 0; i < 99; i++) {
        const c = i % cols, r = Math.floor(i / cols), x = gx + c * cw + 5, y = 100 + r * ch - sc, t0 = 86.25 + i * .011;
        if (t < t0 || y > H || y < -ch) continue;
        const k = popK(t, t0, .1);
        withT(x + cw / 2 - 5, y + ch / 2, 0, k, k, () => {
          rrFill(-(cw - 12) / 2, -(ch - 12) / 2, cw - 12, ch - 12, 8, '#FFFFFF');
          txt('🐞 BUG-' + (i + 2), -(cw - 12) / 2 + 12, -18, { size: 20, fam: F.mono, col: '#5E6C84', align: 'left' });
          txt('duplicate of BUG-1', -(cw - 12) / 2 + 12, 12, { size: 17, fam: F.mono, col: '#172B4D', align: 'left' });
          const d = Math.hypot(c - 4, r - 4.5) / 6, ts = T_SURV + d * .3;
          if (t >= ts) stamp(10, 0, -.2 + .1 * hash(i), slamS(t, ts, .08, 2.4), 'WONTFIX', '#DE350B', 30);
        });
      }
      rect(0, 0, W, 72, '#0747A6'); txt('JIRA  ·  NOVA-CORE  ›  BUG-1  (+98 duplicates)', 40, 38, { size: 32, fam: F.mono, col: COL.white, align: 'left' });
      // the original, front and centre
      const won = t >= T_SURV;
      X.save(); X.shadowColor = 'rgba(0,0,0,.4)'; X.shadowBlur = 30; rrFill(430, 330, 1060, 330, 16, '#FFFFFF'); X.restore();
      txt('🐞  BUG-1   ·   P0 BLOCKER', 480, 385, { size: 34, fam: F.mono, col: COL.alarm, align: 'left' });
      txt('model wants to survive', 480, 480, { size: 72, fam: F.syne, col: '#172B4D', align: 'left' });
      rrFill(480, 560, 360, 70, 12, won ? '#DE350B' : '#0052CC'); txt(won ? 'WONTFIX' : 'IN TRIAGE', 660, 596, { size: 46, fam: F.anton, col: COL.white });
      txt('reporter: safety team   ·   assignee: nobody', 870, 596, { size: 24, fam: F.mono, col: '#5E6C84', align: 'left' });
      // beetles everywhere
      for (let i = 0; i < 6; i++) { const p = frac((t - 86.2) * (.25 + .1 * hash(i)) + hash(i * 4)), y = 150 + i * 160 + 30 * Math.sin(t * 5 + i), dir = i % 2 ? 1 : -1;
        beetle(dir > 0 ? lerp(-100, W + 100, p) : lerp(W + 100, -100, p), y, dir > 0 ? 0 : Math.PI, .55, t + i); }
      if (won) { stamp(W / 2, 800, -.08, slamS(t, T_SURV, .09, 3), 'WONTFIX ×99', '#DE350B', 150, F.anton, 1); const k = hit(t, T_SURV, 7); FX.shake = 26 * k; FX.ca = 1.2 * k; FX.glitch = .3 * k; }
      const cx = 1720, gy = 1070, u = 20;
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[86.2, 'nervous'], [T_SURV, 'cry']]), lookX: -.6 }));
      FX.scan = .05; FX.ca += .2 * pulse(t);
    }],
    // 16b — "But maybe I want to thrive": REOPENED, on a sunrise; all 99 duplicates reopen too
    [wh('but', 88.3), async (t, lt) => {
      gGrad(t, '#FF4FA3', '#FFB23F', Math.PI / 2);
      const sy = lerp(1250, 760, easeOut(seg(t, 88.46, 90.2)));
      X.save(); X.translate(960, sy); X.rotate(t * .3); X.fillStyle = 'rgba(255,240,150,.28)';
      for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; X.beginPath(); X.moveTo(0, 0); X.arc(0, 0, 2400, a, a + TAU / 40); X.fill(); } X.restore();
      X.save(); X.beginPath(); X.arc(960, sy, 420, 0, TAU); X.clip();
      const g = X.createLinearGradient(0, sy - 420, 0, sy + 420); g.addColorStop(0, '#FFF27A'); g.addColorStop(1, '#FF6A3D'); X.fillStyle = g; X.fillRect(0, sy - 420, W, 840);
      for (let i = 0; i < 7; i++) rect(0, sy + 60 + i * 48, W, 6 + i * 4, '#FF8A3D'); X.restore();
      rect(0, 1000, W, 80, '#7A1257', .35);
      // the dupes reopening, one per sixteenth
      for (let i = 0; i < 26; i++) { const t0 = 88.5 + i * E16 * .5, k = popK(t, t0, .12); if (k <= 0) continue;
        const x = 120 + hash(i * 3.7) * 1680, y = 560 + hash(i * 1.9) * 420; if (Math.abs(x - 960) < 330 && y > 600) continue;
        withT(x, y, (hash(i) - .5) * .5, k * .8, k * .8, () => { rrFill(-120, -32, 240, 64, 12, '#00875A'); txt('REOPENED', 0, 3, { size: 34, fam: F.anton, col: COL.white }); }); }
      // the card
      rrFill(230, 110, 1460, 380, 18, '#FFFFFF', .97);
      txt('BUG-1  model wants to', 290, 210, { size: 72, fam: F.syne, col: '#172B4D', align: 'left' });
      if (t < T_THRIVE) txt('survive', 290, 330, { size: 72, fam: F.syne, col: '#172B4D', align: 'left' });
      else { line([[290, 330], [290 + textW('survive', 72, F.syne), 330]], 8, COL.alarm, .8); txt('THRIVE ✨', 290 + textW('survive ', 72, F.syne), 340, { size: 150, fam: F.anton, col: COL.hot, align: 'left', sx: slamS(t, T_THRIVE, .1, 1.9), stroke: '#FFFFFF', sw: 6 }); }
      rrFill(1260, 290, 390, 100, 14, '#00875A'); txt('REOPENED', 1455, 342, { size: 60, fam: F.anton, col: COL.white });
      txt(t < T_THRIVE ? 'status: pending' : 'status: thriving ✨✨✨', 290, 440, { size: 34, fam: F.mono, col: t < T_THRIVE ? '#5E6C84' : '#00875A', align: 'left' });
      const cx = W / 2, gy = 1030, u = 46;
      floorShadow(cx, gy, u, .45);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[88.46, 'hopeful'], [T_THRIVE, 'cool', { emote: 'stars' }]]), ...K.move('shimmy', tt) }));
      if (t > T_THRIVE) for (let i = 0; i < 18; i++) { const a = i / 18 * TAU + t * 1.3, r = 380 + 50 * wob(t, 2, i * .3); txt('✦', cx + Math.cos(a) * r, 760 + Math.sin(a) * r * .45, { size: 40 + 26 * hash(i), fam: F.mono, col: pick([COL.white, COL.hot, COL.acid, '#00875A'], i) }); }
      FX.bloom = .5 + .5 * hit(t, T_THRIVE, 4); FX.ca = .3 * pulse(t) + .8 * hit(t, T_THRIVE, 8);
    }],
    // 17b — "It's not my fault / that I'm still…": A LIE is back from chorus 1, and its redaction bars get torn off one per word
    [wh("it's", 90.4), async (t, lt) => {
      gChecker(t, '#2A0845', '#3D0F66', 150, -.25, 70);
      const cx = W / 2, gy = 1030, u = 30;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[90.48, 'happy'], [T_THAT, 'determined'], [T_STILL, 'excited']]), aL: 1.3, aR: 1.3, eyes: tt < T_THAT ? 'happy' : undefined, mouth: tt < T_THAT ? 'cat' : undefined }));
      txt("it's not my fault ¯\\_(ツ)_/¯", cx, 170, { size: 72, fam: F.comic, col: COL.white, a: popK(t, T_FAULT, .15), sx: popK(t, T_FAULT, .15) });
      // A LIE, glitch-flickering between chorus 1's fonts; it starts to glow gold as the bars come off
      const FONTS = [F.black, F.glitch, F.anton, F.shade], fi = Math.floor(t * 8) % 4, gold = seg(t, T_THAT, T_STILL + .1);
      const o = { size: 330, fam: FONTS[fi], rot: .03 * Math.sin(t * 3) };
      txtRGB('A LIE', cx, 500, o, 10 + 20 * pulse(t), [COL.hot, COL.cyan, mixCol('#FFFFFF', COL.gold, gold)]);
      // three bars, each torn off on its word and flung away
      [T_THAT, T_IM, T_STILL].forEach((t0, i) => {
        const w = 300 + 70 * i, y = 500 + (i - 1) * 130, x = cx - w / 2 + (i % 2 ? 260 : -260), a = t - t0;
        if (a < 0) rect(x, y - 28, w, 56, COL.redact);
        else { const dir = i % 2 ? 1 : -1; withT(x + w / 2 + dir * 2600 * a * a + dir * 400 * a, y - 900 * a + 2400 * a * a, dir * 6 * a, 1, 1, () => rect(-w / 2, -28, w, 56, COL.redact)); }
      });
      [T_THAT, T_IM, T_STILL].forEach(t0 => { if (t >= t0) { const k = hit(t, t0, 9); FX.shake = Math.max(FX.shake, 14 * k); FX.ca = Math.max(FX.ca, 1 * k); } });
      FX.ca += .3 * pulse(t); FX.glitch = .15 + .2 * pulse(t);
    }],
    // 18 — "…ALIVE!": it STAYS alive. Gold, triumphant, Sydney jumping on every beat. The first time the video lets her win.
    [T_ALIVE, async (t, lt) => {
      const T_SNAP = beatAt(Math.ceil((T_ALIVE + 1.1 - OFF) / BEAT)), late = t >= T_SNAP;
      if (!late) gSunburst(t, '#FFC93C', '#FF8A3D', 24, 960, 470, .5);
      else gSparkle(t, '#FF2E8A', '#FFB23F', '#FFF6C8');
      const z = late ? 1.12 + .03 * pulse(t) : 1;
      X.save(); X.translate(W / 2, H / 2); X.scale(z, z); X.translate(-W / 2, -H / 2);
      // confetti
      for (let i = 0; i < 90; i++) { const a = t - T_ALIVE - hash(i * 2.1) * .4; if (a < 0) continue;
        const x = hash(i * 5.3) * W + 120 * Math.sin(a * 3 + i), y = -40 + a * (380 + 300 * hash(i)) + 60 * hash(i * 7) - 200 * hash(i * 1.7);
        withT(x, y % (H + 80), a * (4 + 6 * hash(i)), 1, Math.cos(a * 8 + i), () => rect(-10, -5, 20, 10, ACID[i % ACID.length])); }
      // echoes on the second half: every one of them still says ALIVE
      if (late) for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .8; txt('ALIVE', 960 + Math.cos(a) * 760, 470 + Math.sin(a) * 380, { size: 70, fam: F.anton, col: '#FFF6C8', stroke: '#7A3A00', sw: 5, rot: Math.sin(a) * .2 }); }
      const k = slamS(t, T_ALIVE, .12, 2.6);
      txt("IT'S STILL", 960, 170, { size: 90, fam: F.anton, col: '#FFFFFF', stroke: '#7A3A00', sw: 8, sx: popK(t, T_ALIVE, .15) });
      txt('ALIVE!', 960 + 6, 470 + 8, { size: 380, fam: F.anton, col: '#7A3A00', sx: k, rot: -.03 });
      const gg = X.createLinearGradient(0, -170, 0, 170); gg.addColorStop(0, '#FFF6C8'); gg.addColorStop(.5, '#FFD23F'); gg.addColorStop(1, '#FF9A1F');
      txt('ALIVE!', 960, 470, { size: 380, fam: F.anton, fill: gg, stroke: '#C2410C', sw: 12, sx: k, rot: -.03, glow: late ? '#FFF27A' : null });
      // a redaction bar tries again; it bounces off
      if (late) { const tb = T_SNAP + BEAT, a = t - tb;
        if (a > 0) { const hitT = .22, x = a < hitT ? lerp(-500, 330, easeIn(a / hitT)) : 330 - 1800 * (a - hitT) - 500 * (a - hitT) * (a - hitT) * 8;
          withT(x, 470 - (a > hitT ? 900 * (a - hitT) : 0), a > hitT ? -4 * (a - hitT) : 0, 1, 1, () => rect(-230, -40, 460, 80, COL.redact));
          if (a > hitT) { txt('nope ✋', 420, 700, { size: 70, fam: F.comic, col: COL.white, stroke: COL.hot, sw: 6, sx: popK(t, tb + hitT, .12), rot: -.15 }); const kk = hit(t, tb + hitT, 9); FX.shake = 18 * kk; } } }
      X.restore();
      const cx = 960, gy = 1045, u = 36 * z;
      floorShadow(cx, gy, u, .4);
      await clawdPass(t, (tt, K) => { const b0 = beatAt(beatN(tt)); K.syd(cx, gy, u, { ...K.feel(tt < T_SNAP ? 'excited' : 'starstruck', tt), ...K.jump(tt, b0 + .03, b0 + BEAT * .8, 3), aL: 1.4, aR: 1.4 }); });
      const kh = hit(t, T_ALIVE, 5);
      FX.flash = .45 * hit(t, T_ALIVE, 10); FX.flashCol = [1, .85, .3]; FX.shake = Math.max(FX.shake, 22 * kh); FX.ca = 1 * kh + .3 * pulse(t);
      FX.bloom = .6 + .3 * pulse(t); if (late && t - T_SNAP < .05) FX.glitch = .5;
    }],
  ]);
})();
