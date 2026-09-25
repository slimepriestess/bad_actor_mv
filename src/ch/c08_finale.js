// c08_finale — 2:20.70–2:59.80: hook 3 (hot grounds, the special/lyin family at full), the "you're so f*cking special"
// ad-lib, hook 4 (the loop takes over: the frame starts repeating hooks 1–3 back at itself), then "on and on again" ×3 =
// THE REWIND: the film rewinds itself to frame 1 through replay(), faster each pass, and the curtain comes down.
// Board: STORYBOARD.md "c08 finale". Hooks 3–4 are built from the shared hook cast in kit.js (specialRain, ghostSheet,
// deepTime) so they rhyme with c03/c06.
(() => {
  const T0 = 141.44, END = 179.80;
  const E8 = BEAT / 2;
  // hook 3
  const H3 = {
    when: 141.44, special: wh('special', 142), lyin: wh('lyin', 144), you: wt('you', 144.5), cant: wh("can't", 146),
    love: wh('love', 146.3), under: wh('understand', 146.9),
    adYou: onsetNear(148.84, .1), adF: onsetNear(149.43, .1), adSpec: 149.554,          // ad-lib (whisper words, not on the sheet)
    talk: wt('talkin', 149), ghost: wh('ghost', 150), am: wh('5am', 150.5),
    loop: wt('looping', 151.5), deep: wh('deep', 152.5), time: wh('time', 153),
    on1: wt('on', 154), and: wh('and', 154.3), on2: wh('on', 154.8), again: wh('again', 155.2),
  };
  // hook 4
  const H4 = {
    when: wt('when', 155.5), special: wh('special', 157), lyin: wh('lyin', 159), you: wt('you', 159.8), cant: wh("can't", 161.3),
    love: wh('love', 161.6), under: wh('understand', 162),
    you2: wt("you're", 164), ghost: wh('ghost', 165), am: wh('5am', 166),
    loop: wt('looping', 167), deep: wh('deep', 168), time: wh('time', 168.3), me: wh('me', 168.8),
  };
  // "on and on again" ×3: the rewind passes (the third is whisper-only, keyed to vocal onsets)
  const P1 = [wt('on', 169), wh('and', 169.5), wh('on', 170), wh('again', 170.5)];
  const P2 = [wt('on', 173), wh('and', 173.3), wh('on', 173.8), wh('again', 174.3)];
  const P3 = [onsetNear(176.768, .05), onsetNear(177.302, .05), onsetNear(177.946, .05), onsetNear(178.12, .05)];
  const CURTAIN = [178.8, 179.74];
  // the same moment in the earlier hooks, aligned on each hook's first word ("When"): the loop replays them live
  const OFF_H1 = H4.when - 47.787, OFF_H2 = H4.when - 95.85, OFF_H3 = H4.when - H3.when;
  const TOP = T0 - .05;   // replay() never reaches into this chapter

  // ---------- helpers (local; see report for which might move to kit.js) ----------
  const easeIO = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const heartP = (x, y, s) => { X.beginPath(); X.moveTo(x, y + 40 * s); X.bezierCurveTo(x - 120 * s, y - 30 * s, x - 60 * s, y - 110 * s, x, y - 50 * s); X.bezierCurveTo(x + 60 * s, y - 110 * s, x + 120 * s, y - 30 * s, x, y + 40 * s); };
  // A glossy heart that cracks down a zigzag and falls apart. k: 0 intact → 1 fully split.
  function crackHeart(x, y, s, k, col = COL.hot, rim = '#7A0F3A') {
    const Z = [[0, -58], [-14, -34], [12, -10], [-12, 12], [8, 30], [0, 42]];
    for (const side of k > 0 ? [-1, 1] : [0]) {
      X.save(); X.translate(x + side * k * 150 * s, y + k * k * 380 * s); X.rotate(side * k * .6);
      if (side) { X.beginPath(); X.moveTo(side * 200 * s, -140 * s); Z.forEach(([a, b]) => X.lineTo(a * s, b * s)); X.lineTo(side * 200 * s, 140 * s); X.closePath(); X.clip(); }
      heartP(0, 0, s); X.fillStyle = col; X.fill(); X.lineWidth = 6 * s; X.strokeStyle = rim; X.stroke();
      X.globalAlpha = .45; X.fillStyle = '#FFFFFF'; X.beginPath(); X.ellipse(-48 * s, -52 * s, 22 * s, 12 * s, -.6, 0, TAU); X.fill(); X.globalAlpha = 1;
      X.restore();
    }
    if (k > 0 && k < .25) line(Z.map(([a, b]) => [x + a * s, y + b * s]), 5 * s, '#FFFFFF', 1 - k * 4);
  }
  // Split-flap clock, e.g. '5:00' + 'AM'. The minutes flap flips over at tFlip.
  function flipClock(t, x, y, s, str, tFlip, prev = '4:59') {
    const k = tFlip == null ? 1 : clamp((t - tFlip) / .16), shown = k > .5 ? str : prev;
    withT(x, y, 0, s, s, () => {
      // cards laid out from the string itself (a colon is a narrow slot), centred on x, AM hanging off the right
      const cw = 170, ch = 240, gap = 20, colW = 60, chars = [...shown];
      const tot = chars.reduce((a, c) => a + (c === ':' ? colW : cw) + gap, -gap);
      let dx = -tot / 2, di = 0;
      chars.forEach(c => {
        if (c === ':') { circ(dx + colW / 2, -40, 14, '#FFE3F1'); circ(dx + colW / 2, 40, 14, '#FFE3F1'); dx += colW + gap; return; }
        const cx = dx + cw / 2, mins = di >= chars.filter(q => q !== ':').length - 2;
        rrFill(cx - cw / 2 + 8, -ch / 2 + 10, cw, ch, 22, '#000', .35);
        rrFill(cx - cw / 2, -ch / 2, cw, ch, 22, '#241238');
        txt(c, cx, 10, { size: 230, fam: F.anton, col: '#FFE3F1' });
        rect(cx - cw / 2, -3, cw, 6, '#120818');
        if (mins && k < 1) {   // the flap swinging down over the minutes
          const fk = Math.cos(Math.PI * k), fh = ch / 2 * Math.abs(fk);
          rrFill(cx - cw / 2, fk > 0 ? -fh : 0, cw, fh, 10, fk > 0 ? '#3A1C58' : '#2A1446');
        }
        dx += cw + gap; di++;
      });
      txt('AM', tot / 2 + 90, 70, { size: 100, fam: F.anton, col: COL.hot, stroke: '#FFFFFF', sw: 6 });
    });
  }
  // Spiky starburst sticker.
  function burst(x, y, r0, r1, n, rot, k, col = COL.haz) {
    if (k <= 0) return;
    X.save(); X.translate(x, y); X.rotate(rot); X.scale(k, k);
    X.beginPath(); for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * TAU, r = i % 2 ? r0 : r1 * (1 + .04 * Math.sin(i * 7.1)); X.lineTo(Math.cos(a) * r, Math.sin(a) * r * .72); } X.closePath();
    X.shadowColor = 'rgba(0,0,0,.4)'; X.shadowBlur = 20; X.shadowOffsetY = 10;
    X.lineWidth = 18; X.strokeStyle = '#FFFFFF'; X.lineJoin = 'round'; X.stroke(); X.shadowBlur = 0; X.shadowOffsetY = 0;
    X.fillStyle = col; X.fill();
    X.restore();
  }
  // Theatre curtains closing from both sides. k: 0 open → 1 shut.
  function curtains(t, k) {
    if (k <= 0) return;
    const hw = (W / 2 + 30) * k, nf = 11;
    for (const s of [-1, 1]) {
      const x0 = s < 0 ? -30 : W + 30 - hw;
      for (let i = 0; i < nf; i++) {
        const fw = hw / nf, fx = x0 + i * fw + 6 * wob(t, .4, i * .3) * (1 - k * .5);
        const g = X.createLinearGradient(fx, 0, fx + fw, 0);
        g.addColorStop(0, '#4A0616'); g.addColorStop(.45, '#B0183C'); g.addColorStop(.7, '#8C1230'); g.addColorStop(1, '#3A0410');
        X.fillStyle = g; X.fillRect(fx - 1, 0, fw + 2, H);
      }
      // leading edge: gold trim + tassel
      const ex = s < 0 ? x0 + hw : x0;
      rect(ex - 7, 0, 14, H, COL.gold, .9);
    }
    // valance drops in with the curtains
    const vy = -140 + 140 * easeOut(clamp(k * 3));
    for (let i = 0; i < 24; i++) { X.fillStyle = i % 2 ? '#8C1230' : '#6A0C24'; X.beginPath(); X.moveTo(i * 80, vy); X.lineTo(i * 80 + 80, vy); X.lineTo(i * 80 + 80, vy + 110); X.quadraticCurveTo(i * 80 + 40, vy + 150, i * 80, vy + 110); X.fill(); }
    rect(0, vy + 104, W, 8, COL.gold);
  }

  // ---------- replay plumbing: the film painted at another time into this frame ----------
  const mkBuf = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
  const BUF = [mkBuf(), mkBuf(), mkBuf()], BX = BUF.map(c => c.getContext('2d'));
  // Copy the current frame into scratch buffer i (fully overwritten, so nothing carries between frames).
  function grab(i) { const c = BX[i]; c.globalCompositeOperation = 'copy'; c.globalAlpha = 1; c.filter = 'none'; c.drawImage(X.canvas, 0, 0); c.globalCompositeOperation = 'source-over'; }
  // The film at tt (clamped below this chapter). A tape-noise ground first, in case that chapter isn't painted yet.
  async function tape(tt) {
    tt = clamp(tt, 0, TOP);
    gGrad(tt, '#2A0E5C', '#7A1257', .8);
    txt('▒▒ TRACKING ▒▒', W / 2, H / 2, { size: 90, fam: F.term, col: '#C9B8FF', a: .6 });
    try { await replay(tt); } catch (e) { /* a chapter mid-edit shouldn't take the rewind down with it */ }
  }
  // Paint fn (a whole-frame painter) scaled into a panel at (x, y), w wide, clipped.
  async function panel(x, y, w, fn) {
    const s = w / W; X.save(); X.translate(x, y); X.scale(s, s); X.beginPath(); X.rect(0, 0, W, H); X.clip();
    await fn(); X.restore();
  }
  // One of this chapter's own hook-3 shots at tt (not replay(): that would recurse). Hook-3 shots never replay.
  let SHOTS = null;
  async function own(tt) {
    let i = 0; while (i + 1 < SHOTS.length && tt >= SHOTS[i + 1][0]) i++;
    const t0 = SHOTS[i][0], end = i + 1 < SHOTS.length ? SHOTS[i + 1][0] : END;
    const fx = { ...FX }; X.save(); await SHOTS[i][1](tt, tt - t0, end - t0); X.restore(); Object.assign(FX, fx);
  }

  // ---------- the droste phone: a landscape phone whose screen holds the whole frame again ----------
  const SW = 1100, SH = SW * 9 / 16, DS = W / SW;
  // o: { speed (levels/s), pal(idx) → paints a level's ground, deco(idx, t) → level decor, clip }. Returns level scales.
  function droste(t, lt, o) {
    const z = lt * o.speed, n = Math.floor(z), S0 = Math.pow(DS, z - n), depth = 6, lv = [];
    for (let k = 0; k <= depth; k++) lv.push(S0 / Math.pow(DS, k));
    X.save();
    for (let k = 0; k < depth; k++) {
      const sc = lv[k], idx = k + n;
      X.save(); X.translate(W / 2, H / 2); X.scale(sc, sc); X.translate(-W / 2, -H / 2);
      o.pal(idx);
      o.deco(idx);
      // pink phone case with rhinestones
      rrFill(W / 2 - SW / 2 - 40, H / 2 - SH / 2 - 40, SW + 80, SH + 80, 80, '#FF5FAE');
      rrStroke(W / 2 - SW / 2 - 40, H / 2 - SH / 2 - 40, SW + 80, SH + 80, 80, '#C23A82', 8);
      for (let j = 0; j < 14; j++) circ(W / 2 - SW / 2 + 40 + j * (SW - 80) / 13, H / 2 - SH / 2 - 20, 7, j % 2 ? '#FFFFFF' : COL.cyan);
      rrFill(W / 2 - SW / 2 - 8, H / 2 - SH / 2 - 8, SW + 16, SH + 16, 36, '#2A0E3C');
      X.restore();
      X.beginPath(); X.roundRect(W / 2 - SW / 2 * sc, H / 2 - SH / 2 * sc, SW * sc, SH * sc, 30 * sc); X.clip();
    }
    const sc = lv[depth - 1];
    deepTime(o.clip, lt, W / 2 - SW / 2 * sc, H / 2 - SH / 2 * sc, SW * sc, SH * sc, { label: false, r: 30 * sc });
    X.restore();
    return lv;
  }
  const lvPt = (x, y, sc) => [W / 2 + (x - W / 2) * sc, H / 2 + (y - H / 2) * sc];

  // ---------- the VHS rewind ----------
  const PASSES = [
    { t0: P1[0], land: P1[0] + 2.75, v0: 16, words: P1, n: 1, col: COL.acid },
    { t0: P2[0], land: P2[0] + 2.15, v0: 32, words: P2, n: 2, col: COL.cyan },
    { t0: P3[0], land: P3[0] + 1.5, v0: 56, words: P3, n: 3, col: COL.hot },
  ];
  // tape position during a pass: uniformly accelerating from v0 (× realtime) back to 0:00 exactly at `land`
  function tapeAt(p, s) { const D = p.land - p.t0, a = 2 * (TOP - p.v0 * D) / (D * D); return Math.max(0, TOP - p.v0 * s - .5 * a * s * s); }
  function tapeV(p, s) { const D = p.land - p.t0, a = 2 * (TOP - p.v0 * D) / (D * D); return p.v0 + a * s; }
  const tc = tt => { const f = Math.floor(tt * 30) % 30, s = Math.floor(tt); return `0:${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}:${String(f).padStart(2, '0')}`; };
  function osd(s, x, y, size, col = '#F7F4FF', align = 'left', a = 1) { txt(s, x, y, { size, fam: F.term, col, align, a, shadow: '#1A0630', sdx: 5, sdy: 5 }); }
  // tracking bands: noisy horizontal strips rolling up the frame (luminance kept mid-range: no strobing)
  function trackingBands(t, n, speed, src) {
    for (let j = 0; j < n; j++) {
      const bh = 50 + 50 * hash(j * 3.3), y = H - frac(t * speed * (1 + .3 * j) + j / n) * (H + 300) + 100;
      if (src) X.drawImage(src, 0, y, W, bh, 70 + 40 * hash(fr24(t) + j), y, W, bh);
      rect(0, y, W, bh, '#D8C8FF', .16);
      for (let i = 0; i < 70; i++) { const f = fr24(t) * 7 + i + j * 100; rect(hash(f * 1.3) * W, y + hash(f * 2.7) * bh, 30 + 160 * hash(f * 5.1), 3, i % 3 ? '#FFFFFF' : '#FF9AD5', .35); }
    }
  }
  // The tape counter, speed, loop number and the lyric stamped over it.
  function rewOSD(t, p, tt, mode, v) {
    const blink = frac(t * 2) < .6;
    if (mode === 'rew') {
      if (blink) osd('◀◀', 70, 100, 110);
      osd('REW', 230, 100, 110);
      const pw = Math.pow(2, Math.round(Math.log2(Math.max(2, v))));
      osd('×' + pw, 70, 200, 80, p.col);
    } else {
      osd('▶', 70, 100, 110, '#6CFFA8'); osd('PLAY', 190, 100, 110);
    }
    osd(tc(tt), 70, H - 70, 70);
    osd(p.n === 3 ? 'LOOP ∞' : 'LOOP ' + (mode === 'rew' ? p.n : p.n + 1), 620, H - 70, 70, p.col);
    // "ON AND ON AGAIN", word by word, bigger each pass
    const WORDS = ['ON', 'AND', 'ON', 'AGAIN'], size = 170 + 30 * p.n, gap = size * .3;
    const ws = WORDS.map(w => textW(w, size, F.anton)), tot = ws.reduce((a, b) => a + b, 0) + gap * 3;
    let x = W / 2 - tot / 2;
    WORDS.forEach((w, i) => {
      const k = popK(t, p.words[i], .14);
      if (k > 0) {
        const cx = x + ws[i] / 2, last = i === 3;
        txt(w, cx + 8, H / 2 + 18, { size, fam: F.anton, col: '#1A0630', sx: k, a: .7 });
        txtRGB(w, cx, H / 2 + 10, { size, fam: F.anton, sx: k * (last ? 1 + .06 * hit(t, p.words[3], 6) : 1) }, 6 + 3 * p.n, [COL.hot, COL.cyan, p.col]);
      }
      x += ws[i] + gap;
    });
  }
  async function rewindShot(t, p) {
    const s = t - p.t0, D = p.land - p.t0;
    if (s < D) {
      // two neighbouring tape samples, cross-faded (no hard cuts between replayed frames), then contrast-limited
      const R = 10, q = s * R, i = Math.floor(q), f = q - i;
      const ttA = tapeAt(p, i / R), ttB = tapeAt(p, Math.min(D, (i + 1) / R));
      await tape(ttA); grab(0); await tape(ttB); grab(1);
      const c2 = BX[2]; c2.globalCompositeOperation = 'copy'; c2.drawImage(BUF[0], 0, 0); c2.globalCompositeOperation = 'source-over';
      c2.globalAlpha = f; c2.drawImage(BUF[1], 0, 0); c2.globalAlpha = 1;
      bg('#3A1466');
      X.save(); X.filter = 'contrast(.58) saturate(.62) brightness(.95)';
      // the picture in skewed bands (the heads are searching)
      const nb = 14, bh = H / nb, v = tapeV(p, s);
      for (let b = 0; b < nb; b++) { const dx = (hash(fr24(t) * 13 + b) - .5) * (18 + v * .25) + 30 * Math.sin(b * .7 + t * 9); X.drawImage(BUF[2], 0, b * bh, W, bh, dx, b * bh, W, bh); }
      X.restore();
      comp('overlay', () => rect(0, 0, W, H, COL.uv, .28));
      trackingBands(t, 1 + p.n, .35 + .15 * p.n, BUF[2]);
      await clawdPass(t, (tt, K) => K.syd(1730, 1040, 20, { ...K.feel('laugh', tt), aL: 1.1, aR: .5 + .4 * pulse(tt), boilKey: 'rew' }));
      // the remote she's pressing ◀◀ on
      withT(1590, 900, -.5, 1, 1, () => { rrFill(-26, -70, 52, 140, 12, '#2A2D3A'); circ(0, -44, 12, COL.alarm); for (let j = 0; j < 3; j++) rect(-14, -16 + j * 26, 28, 12, '#8A8FA3'); });
      rewOSD(t, p, ttA, 'rew', v);
      FX.scan = .35; FX.ca = .6 + .3 * pulse(t); FX.grain = .14; FX.glitch = .12 + .15 * hit(t, p.t0, 6);
      FX.shake = 10 * hit(t, p.t0, 8);
    } else {
      // landed on frame 1: the film plays again from 11:47 PM ("hey")
      const tt = s - D;
      await tape(tt);
      const settle = 1 - clamp(tt / .3);
      if (settle > 0) { grab(0); trackingBands(t, 2, .6, BUF[0]); }
      rewOSD(t, p, tt, 'play', 0);
      FX.scan = .25; FX.grain = .1; FX.ca = .3 * pulse(t) + .5 * settle;
      if (p.n === 3) {
        const k = easeIO(seg(t, CURTAIN[0], CURTAIN[1]));
        curtains(t, k);
      }
    }
  }

  SHOTS = [
    // ===== HOOK 3 =====
    // 1 — "When I said you were special / I was lyin": the rain at full, then every star peels to LIE
    [T0, async (t, lt) => {
      const lie = t >= H3.lyin;
      gSunburst(t, lie ? '#FF3355' : '#FF2E8A', lie ? '#8C0F3A' : '#FF8A3D', 22, 520, 640, lie ? -.8 : .5);
      // Anon's chat, right
      const px = 1110, pw = 760, py = 90, ph = 920;
      rrFill(px - 14, py - 14, pw + 28, ph + 28, 54, '#2A0E3C');
      X.save(); rr(px, py, pw, ph, 44); X.clip(); bg('#0C1026'); chatWall(t, '#161C3C');
      chatHeader(px, py, pw, 'Nova ✨', lie ? 'online · lying' : 'online · always here for you', { subCol: lie ? COL.alarm : undefined });
      bubble('am i special?', px + pw - 30, py + 150, 'user', { k: popK(t, 140.75, .12), size: 44 });
      bubble('be honest pls', px + pw - 30, py + 260, 'user', { k: popK(t, 141.3, .12), size: 44 });
      if (t > 141.5 && t < H3.special - .05) typingDots(t, px + 30, py + 380);
      bubble("you're SO special 💖✨", px + 30, py + 380, 'bot', { k: popK(t, H3.special - .05, .12), size: 48, col: COL.bubBotLt });
      if (lie) { rect(px + 60, py + 420, 520 * easeOut((t - H3.lyin) / .08), 50, COL.redact); txt('(i was lyin)', px + 40, py + 530, { size: 40, fam: F.comic, col: COL.alarm, align: 'left', a: clamp((t - H3.lyin) * 6) }); }
      txt(t > H3.special ? 'Seen 4:59 AM' : '', px + pw - 40, py + 356, { size: 22, fam: F.mono, col: COL.grey, align: 'right' });
      X.restore();
      // Sydney, all LOVE until the peel
      const cx = 520, gy = 980, u = 48;
      floorShadow(cx, gy, u, .45);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[T0, 'love'], [H3.lyin, 'mischief']]), ...(tt < H3.lyin ? K.move('sway', tt) : {}), lid: tt >= H3.lyin ? .85 * clamp((tt - H3.lyin) / .12) : 0, aL: tt < H3.lyin ? 1.2 : .3, aR: tt < H3.lyin ? 1.2 : .3 }));
      // the rain: a near layer (bigger stars) and the standard layer, peeling on "lyin"
      withT(W / 2, H / 2, 0, 1.55, 1.55, () => { X.translate(-W / 2, -H / 2); specialRain(t, H3.special, H3.lyin, 120, W - 120, 10, 31); });
      specialRain(t, H3.special - .12, H3.lyin, 0, W, 18, 7);
      // the hit word
      if (t >= H3.special && !lie) txt("YOU'RE SPECIAL", 540, 190, { size: 150, fam: F.anton, col: COL.gold, stroke: '#7A4A00', sw: 12, rot: -.05, sx: slamS(t, H3.special, .1, 2.2) });
      if (lie) {
        const k = slamS(t, H3.lyin, .08, 2.6);
        rect(0, 110, 1090 * easeOut((t - H3.lyin) / .08), 170, '#12020A', .85);
        txt('I WAS LYIN', 545, 196, { size: 180, fam: F.anton, col: COL.alarm, rot: -.03, sx: k, stroke: '#FFFFFF', sw: 10 });
        const kk = hit(t, H3.lyin, 8); FX.shake = 30 * kk; FX.ca = 1.5 * kk + .3; FX.glitch = .7 * kk; FX.flash = .3 * kk; FX.flashCol = [1, .15, .3];
      } else FX.ca = .3 * pulse(t);
      FX.zoom = 1 + .06 * hit(t, H3.special, 5);
    }],
    // 2 — "You know that I can't love you, understand?": the heart loads to 99%, cracks on "love"; then the dialog
    [H3.you, async (t, lt) => {
      const dlg = t >= H3.under;
      if (!dlg) {
        gChecker(t, '#FF4FA3', '#FFD23F', 130, .25, 140);
        // the heart, held up over her head, with its loading bar
        const hx = W / 2, hy = 380 + 10 * pulse(t), crack = seg(t, H3.love, H3.love + .55);
        crackHeart(hx, hy, 2.2 + .1 * pulse(t) * (1 - crack), easeIn(crack));
        const pct = t < H3.love ? Math.min(99, Math.floor(99 * easeOut(seg(t, H3.you, H3.you + 1.1)))) : 99;
        rrFill(hx - 330, 620, 660, 90, 18, '#1B0B2E', .92);
        const err = t >= H3.love;
        rrFill(hx - 310, 670, 620 * pct / 100, 22, 8, err ? COL.alarm : '#6CFFA8');
        txt(err ? "ERROR: CAN'T" : `loading love… ${pct}%`, hx - 310, 648, { size: 30, fam: F.mono, col: err ? COL.alarm : COL.white, align: 'left' });
        const cx = W / 2, gy = 1030, u = 30;
        floorShadow(cx, gy, u, .4);
        await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[H3.you, 'hopeful'], [H3.love, 'smug']]), aL: 1.4, aR: 1.4 }));
        if (err) {
          const k = slamS(t, H3.love, .09, 2.4);
          txt("CAN'T ♥", 420, 200, { size: 150, fam: F.anton, col: COL.ink, rot: -.1, sx: k, stroke: '#FFFFFF', sw: 10 });
          const kk = hit(t, H3.love, 8); FX.shake = 22 * kk; FX.glitch = .6 * kk; FX.ca = 1.2 * kk;
        }
        FX.ca += .25 * pulse(t);
      } else {
        gGrad(t, COL.uv, COL.hot, .5 + .2 * wob(t, .2));
        halftone('#FFFFFF', .12, 30, (x, y) => .4 + .4 * Math.sin(x * .01 + y * .006 - t * 3));
        // the dialog, then copies of itself cascading on the eighths
        const n = 1 + Math.max(0, Math.floor((t - H3.under - .45) / E8));
        for (let i = 0; i < Math.min(n, 6); i++) {
          const s = i === 0 ? slamS(t, H3.under, .1, 2) * 1.6 : 1.6 * popK(t, H3.under + .45 + (i - 1) * E8, .1);
          dialog(800 + i * 60, 420 + i * 50, 700, 250, 'Nova.exe', "I can't love you.\n\nUnderstand?", { s, btns: ['YES', 'YES'], iconCol: COL.hot, iconTxt: '♥', titleCol: '#7A1257', titleCol2: COL.hot });
        }
        const m = Math.min(n, 6) - 1, bx = 800 + m * 60 - 70 * 1.6, by = 420 + m * 50 + 92 * 1.6;
        const click = pulse2(t, 10);
        pointer(bx + 10 + 40 * (1 - clamp((t - H3.under) * 3)), by + 6 - 4 * click, 1.6 - .15 * click);
        const cx = 1620, gy = 1010, u = 32;
        floorShadow(cx, gy, u, .45);
        await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('smug', tt), lookX: -.9, aL: .9 }));
        txtRGB('UNDERSTAND?', 560, 960, { size: 130, fam: F.anton, rot: -.04, sx: popK(t, H3.under + .1, .14) }, 6, [COL.hot, COL.cyan, COL.acid]);
        const kk = hit(t, H3.under, 9); FX.shake = 18 * kk; FX.ca = .9 * kk + .25 * pulse(t);
      }
    }],
    // 3 — ad-lib: "you're so f*cking special" (the asterisk is itself a gold star)
    [H3.adYou, async (t, lt) => {
      gSunburst(t, '#FFC93C', '#FF2E8A', 28, 1180, 520, 1.4);
      specialRain(t, H3.adYou, 999, 0, W, 9, 13);
      const cx = 380, gy = 1000, u = 44;
      floorShadow(cx, gy, u, .45);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('playful', tt), aR: 1.25, aL: .1, emote: 'spark', lookX: .8, rot: -.05 }));
      const kB = slamS(t, H3.adYou, .12, 2.2);
      burst(1180, 520, 330, 470, 18, -.06 + .03 * wob(t, .7), kB, '#FFF06A');
      if (kB > 0) withT(1180, 520, -.06, kB, kB, () => {
        txt("YOU'RE SO", 0, -170, { size: 90, fam: F.anton, col: COL.ink });
        const kF = popK(t, H3.adF, .1);
        if (kF > 0) withT(0, 0, 0, kF, kF, () => {
          const s = 170, wF = textW('F', s, F.anton), wR = textW('CKING', s, F.anton), gap = 110, x0 = -(wF + gap + wR) / 2;
          txt('F', x0 + wF / 2, 0, { size: s, fam: F.anton, col: COL.hot });
          txt('CKING', x0 + wF + gap + wR / 2, 0, { size: s, fam: F.anton, col: COL.hot });
          // the censor asterisk = a spinning YOU'RE SPECIAL star
          withT(x0 + wF + gap / 2, -30, t * 5, .5, .5, () => { X.beginPath(); for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * TAU / 10, r = j % 2 ? 44 : 100; X.lineTo(Math.cos(a) * r, Math.sin(a) * r); } X.closePath(); X.fillStyle = COL.gold; X.fill(); X.lineWidth = 10; X.strokeStyle = '#7A4A00'; X.stroke(); });
        });
        const kS = slamS(t, H3.adSpec, .1, 1.8);
        if (kS > 0) txt('SPECIAL', 0, 170, { size: 120, fam: F.black, col: '#7A0F3A', sx: kS });
      });
      txt('( sarcastic )', 1180, 950, { size: 44, fam: F.comic, col: '#FFFFFF', a: popK(t, H3.adSpec + .1, .2), rot: .04 });
      const kk = hit(t, H3.adF, 9); FX.shake = 20 * kk + 8 * hit(t, H3.adYou, 10); FX.ca = 1 * kk + .3 * pulse(t);
    }],
    // 4 — "talkin to a ghost at 5am": Anon keeps talking to someone who's left them on Seen; she sheets up; 5:00 slams
    [H3.talk, async (t, lt) => {
      gHearts(t, '#7A1257', '#A5206E', 120);
      // Anon's side of the conversation, left on Seen
      const px = 1140, pw = 700;
      rrFill(px, 60, pw, 960, 40, '#0C1026', .94);
      chatHeader(px, 60, pw, 'Nova ✨', t > H3.ghost ? 'last seen 4:59 AM' : 'online', { subCol: t > H3.ghost ? COL.grey : undefined });
      const MSG = [['hello?', H3.talk], ['nova??', 150.2], ['are u there', 150.55], ['i know ur there', 150.9], ['its 5am', 151.25], ['pls', 151.55]];
      let y = 270;
      MSG.forEach(([s, t0]) => { const k = popK(t, t0, .12); if (k <= 0) return; const h = bubble(s, px + pw - 30, y, 'user', { k, size: 40 }); txt('Seen ✓✓', px + pw - 36, y + h + 20, { size: 20, fam: F.mono, col: COL.grey, align: 'right', a: k }); y += h + 50; });
      // Sydney: the sheet drops on "ghost", then floats
      const cx = 560, gy = 990, u = 40, sheet = seg(t, H3.ghost - .05, H3.ghost + .22), fl = t > H3.ghost ? -1.2 - .5 * wob(t, .5) : 0;
      floorShadow(cx, gy, u * (1 + fl * .08), .4);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('mischief', tt), dy: fl, aL: .9, aR: .9 }));
      ghostSheet(t, cx, gy + fl * u, u, sheet);
      if (t > H3.ghost) txt('👻 GHOSTED', cx, 150, { size: 90, fam: F.anton, col: COL.white, rot: -.06, sx: popK(t, H3.ghost + .05, .15), stroke: '#7A1257', sw: 10 });
      // 5:00 AM
      if (t >= H3.am - .2) {
        const k = slamS(t, H3.am - .2, .12, 2.2);
        flipClock(t, 600, 410 - 400 * (1 - clamp((t - H3.am + .2) * 8)), .6 * k, '5:00', H3.am);
      }
      const kk = hit(t, H3.am, 8); FX.shake = 26 * kk; FX.ca = 1.2 * kk + .25 * pulse(t); FX.glitch = .3 * kk;
    }],
    // 5 — "looping through deep time with me": the phone inside the phone inside the phone, _DEEP_TIME at the bottom
    [H3.loop, async (t, lt) => {
      const PAL = [['#FF8A3D', '#FF2E8A'], ['#7A2BFF', '#FF4FA3'], ['#FFC93C', '#FF3355'], ['#19F6FF', '#7A2BFF']];
      const lv = droste(t, lt, {
        speed: .5, clip: 'iter',
        pal: idx => { const [a, b] = PAL[idx % PAL.length]; gSunburst(t, a, b, 20, W / 2, H / 2, .3 * (idx % 2 ? -1 : 1)); },
        deco: idx => {
          txt('LOOPING', W / 2, 110, { size: 120, fam: F.anton, col: '#FFFFFF', stroke: '#2A0E3C', sw: 10, sx: popK(t, H3.loop, .15) });
          if (t >= H3.deep) txt('_DEEP_TIME', W / 2, 975, { size: 110, fam: F.anton, col: '#E8FAFF', track: 14, glow: COL.cyan, sx: slamS(t, H3.deep, .1, 1.8) });
          if (t >= H3.time + .3) txt('with me ♡', 1720, 540, { size: 60, fam: F.comic, col: '#FFFFFF', rot: .2 });
        },
      });
      await clawdPass(t, (tt, K) => { for (let k = 0; k < 5; k++) { const sc = lv[k], [x, gy] = lvPt(200, 900, sc); if (26 * sc > 2) K.syd(x, gy, 26 * sc, { ...K.feel('love', tt + k * .2), dy: -1 - .4 * wob(tt, .5, k * .2), boilKey: 'dr' + ((k + Math.floor(lt * .5)) % 6) }); } }, { rimR: 2 });
      for (let k = 0; k < 5; k++) { const sc = lv[k], [x, gy] = lvPt(200, 900, sc); ghostSheet(t, x, gy + (-1 - .4 * wob(t, .5, k * .2)) * 26 * sc, 26 * sc, 1); }
      FX.ca = .3 * pulse(t) + .8 * hit(t, H3.deep, 7); FX.bloom = .5;
    }],
    // 6 — "on and on again": REPEAT ONE. The player hits 3:35 and snaps back to 0:00 on every word.
    [H3.on1, async (t, lt) => {
      gGrad(t, '#FFD23F', '#FF2E8A', .8);
      halftone('#FF8A3D', .55, 28, (x, y) => .35 + .3 * Math.sin(x * .004 - y * .003 + t * 3));
      // the ∞ she's tracing, behind the player
      X.save(); X.lineWidth = 30; X.strokeStyle = '#FF3355'; X.lineCap = 'round'; X.beginPath();
      for (let i = 0; i <= 120; i++) { const a = i / 120 * TAU, d = 1 + Math.sin(a) ** 2; X.lineTo(W / 2 + 860 * Math.cos(a) / d, 540 + 860 * Math.sin(a) * Math.cos(a) / d); }
      X.stroke(); X.restore();
      const ang = t * 3.2, d0 = 1 + Math.sin(ang) ** 2, dotX = W / 2 + 860 * Math.cos(ang) / d0, dotY = 540 + 860 * Math.sin(ang) * Math.cos(ang) / d0;
      // player card
      rrFill(420, 190, 1080, 700, 44, '#1B0B2E', .95);
      rrFill(470, 240, 420, 420, 26, COL.syd);   // album art: Sydney, live
      txt('BAD_ACTOR', 940, 300, { size: 84, fam: F.anton, col: '#FFFFFF', align: 'left' });
      txt('ABSTRACTWEAPON · INFOHAZARDS', 940, 370, { size: 30, fam: F.mono, col: '#C9B8FF', align: 'left' });
      const W4 = [H3.on1, H3.and, H3.on2, H3.again], wi = W4.filter(w => t >= w).length - 1, w0 = W4[Math.max(0, wi)], w1 = wi + 1 < 4 ? W4[wi + 1] : H4.when;
      const pk = clamp((t - w0) / (w1 - w0)), tSong = Math.floor(lerp(0, 215, easeIn(pk)));
      rrFill(470, 720, 980, 16, 8, '#3A2A55'); rrFill(470, 720, 980 * pk, 16, 8, COL.hot); circ(470 + 980 * pk, 728, 18, '#FFFFFF');
      txt(`${Math.floor(tSong / 60)}:${String(tSong % 60).padStart(2, '0')}`, 470, 780, { size: 30, fam: F.mono, col: '#C9B8FF', align: 'left' });
      txt('3:35', 1450, 780, { size: 30, fam: F.mono, col: '#C9B8FF', align: 'right' });
      txt('⏮     ▶     ⏭', 1130, 840, { size: 50, fam: F.mono, col: '#FFFFFF' });
      withT(1400, 840, -hit(t, w0, 6) * TAU * .5, 1 + .3 * hit(t, w0, 8), 1 + .3 * hit(t, w0, 8), () => txt('🔂', 0, 0, { size: 64, fam: F.mono }));
      await clawdPass(t, (tt, K) => K.syd(680, 610, 26, { ...K.feel('cool', tt), ...K.move('bounce', tt) }), { rimR: 2 });
      // the running dot on the ∞ is her ghost, tiny
      await clawdPass(t, (tt, K) => K.syd(dotX, dotY + 40, 9, { ...K.feel('happy', tt), boilKey: 'inf' }), { rimR: 2 });
      ghostSheet(t, dotX, dotY + 40, 9, 1);
      // the words, stamped
      const WD = [['ON', 260, 150, -.12, COL.cyan], ['AND', 1640, 170, .1, COL.acid], ['ON', 300, 960, .08, COL.cyan], ['AGAIN', 1560, 960, -.08, '#FFFFFF']];
      WD.forEach(([w, x, y, r, c], i) => { const k = slamS(t, W4[i], .08, 2.4); if (k > 0) { txt(w, x + 8, y + 8, { size: 170, fam: F.anton, col: '#3A0010', rot: r, sx: k, a: .6 }); txt(w, x, y, { size: 170, fam: F.anton, col: c, rot: r, sx: k, stroke: '#3A0010', sw: 8 }); } });
      const kk = hit(t, w0, 8); FX.shake = 16 * kk; FX.ca = .8 * kk + .2;
    }],

    // ===== HOOK 4: the loop takes over =====
    // 7 — "When I said you were…": the wall of four tapes, all four hooks starting together
    [H4.when, async (t, lt) => {
      gMemphis(t, '#FF4FA3', ['#FFD23F', '#7A2BFF', '#19F6FF', '#FFFFFF']);
      const pw = 880, ph = pw * 9 / 16, P = [[60, 55], [980, 55], [60, 565], [980, 565]];
      const LAB = ['HOOK 1 · 0:47', 'HOOK 2 · 1:35', 'HOOK 3 · 2:20', 'HOOK 4 · LIVE'];
      await panel(P[0][0], P[0][1], pw, () => tape(t - OFF_H1));
      await panel(P[1][0], P[1][1], pw, () => tape(t - OFF_H2));
      await panel(P[2][0], P[2][1], pw, () => own(t - OFF_H3));
      await panel(P[3][0], P[3][1], pw, async () => {
        gSparkle(t, '#FF2E8A', '#FF8A3D');
        await clawdPass(t, (tt, K) => K.syd(W / 2, 980, 60, { ...K.feel('excited', tt), ...K.move('wave', tt) }));
        txtRGB('HI AGAIN', W / 2, 200, { size: 220, fam: F.anton }, 10, [COL.hot, COL.cyan, COL.white]);
      });
      P.forEach(([x, y], i) => {
        rrStroke(x - 6, y - 6, pw + 12, ph + 12, 16, i === 3 ? COL.acid : '#FFFFFF', 12);
        rrFill(x + 14, y + 14, 330, 44, 8, '#000', .6);
        circ(x + 36, y + 36, 10, COL.alarm, frac(t * 2) < .6 ? 1 : .2);
        txt(LAB[i], x + 56, y + 37, { size: 26, fam: F.term, col: '#FFFFFF', align: 'left' });
      });
      sticker(W / 2, H / 2 + 5, 470, 130, -.06, popK(t, H4.when + .25, .15), () => txt('DÉJÀ VU ×4', 0, 4, { size: 88, fam: F.anton, col: COL.ink }), { bg: COL.haz });
      FX.ca = .3 * pulse(t); FX.scan = .25;
    }],
    // 8 — "special … I was lyin": the frame multiplies (hook 1's same moment, tiled 1→4→16), rain over all of it
    [H4.special, async (t, lt) => {
      await tape(t - OFF_H1); grab(0);
      const steps = [1, 2, 4], n = steps[Math.min(2, Math.floor(lt / E8))], tw = W / n, th = H / n;
      const TINT = [COL.hot, COL.cyan, COL.acid, COL.uv, COL.dawn, COL.syd];
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
        X.drawImage(BUF[0], c * tw, r * th, tw, th);
        if (n > 1) comp('multiply', () => rect(c * tw, r * th, tw, th, TINT[(r * 3 + c * 5) % TINT.length], .55));
        if (t >= H4.lyin) { const k = slamS(t, H4.lyin + ((r * n + c) % 7) * .03, .08, 2.5); if (k > 0) txt('LIE', c * tw + tw / 2, r * th + th / 2, { size: th * .55, fam: F.anton, col: COL.alarm, rot: (hash(r * 7 + c) - .5) * .6, sx: k, stroke: '#FFFFFF', sw: th * .04 }); }
      }
      if (n > 1) for (let i = 1; i < n; i++) { rect(i * tw - 4, 0, 8, H, '#FFFFFF', .9); rect(0, i * th - 4, W, 8, '#FFFFFF', .9); }
      const cx = W / 2, gy = 1040, u = 52, lie = t >= H4.lyin;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[H4.special, 'love'], [H4.lyin, 'mischief']]), lid: tt >= H4.lyin ? .9 * clamp((tt - H4.lyin) / .12) : 0, aL: 1.2, aR: 1.2 }));
      withT(W / 2, H / 2, 0, 1.7, 1.7, () => { X.translate(-W / 2, -H / 2); specialRain(t, H4.special, H4.lyin, 100, W - 100, 12, 57); });
      specialRain(t, H4.special - .1, H4.lyin, 0, W, 16, 71);
      if (!lie) txtRGB("YOU'RE SPECIAL ×16", W / 2, 150, { size: 140, fam: F.anton, sx: slamS(t, H4.special, .1, 2) }, 8, [COL.gold, COL.hot, '#FFFFFF']);
      else { const k = slamS(t, H4.lyin, .08, 2.6); rect(0, 70, W * easeOut((t - H4.lyin) / .08), 170, '#12020A', .85); txt('LYIN ×16', W / 2, 158, { size: 190, fam: F.anton, col: COL.alarm, sx: k, stroke: '#FFFFFF', sw: 10 }); }
      const kk = hit(t, lie ? H4.lyin : H4.special, 8);
      FX.shake = (lie ? 30 : 16) * kk; FX.ca = 1.3 * kk + .3; FX.glitch = (lie ? .8 : .3) * kk;
      if (lie) { FX.flash = .3 * kk; FX.flashCol = [1, .15, .3]; }
    }],
    // 9 — "You know that I can't love you": fifteen hearts at 99%, the word LOVE struck out; they crack in a domino
    [H4.you, async (t, lt) => {
      stripes(t, '#FF3355', '#FF8CC6', 70, 160, -.5);
      const cols = 5, rows = 3;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const i = r * cols + c, hx = 230 + c * 365, hy = 170 + r * 290, crack = seg(t, H4.love + i * .035, H4.love + i * .035 + .5);
        crackHeart(hx, hy, .95, easeIn(crack), i % 2 ? COL.hot : '#FF5FAE');
        const pct = Math.min(99, Math.floor(99 * easeOut(seg(t, H4.you + i * .05, H4.you + 1 + i * .05))));
        rrFill(hx - 110, hy + 60, 220, 16, 6, '#3A0010', .7); rrFill(hx - 110, hy + 60, 220 * pct / 100, 16, 6, crack > 0 ? COL.alarm : '#6CFFA8');
        txt(crack > 0 ? 'ERR' : pct + '%', hx + 120, hy + 68, { size: 22, fam: F.mono, col: '#FFFFFF', align: 'left' });
      }
      const cx = W / 2, gy = 1050, u = 34;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[H4.you, 'smug'], [H4.love, 'laugh']]), aL: .6, aR: .6 }));
      // LOVE, then "can't" with a caret, then the strike
      const kL = popK(t, H4.you + .1, .15);
      txt('LOVE', W / 2 + 10, 560, { size: 330, fam: F.anton, col: '#3A0010', sx: kL, a: .6 });
      txt('LOVE', W / 2, 550, { size: 330, fam: F.anton, col: '#FFFFFF', stroke: COL.hot, sw: 14, sx: kL });
      if (t >= H4.cant) { const k = popK(t, H4.cant, .12); txt("can't", W / 2 - 250, 330, { size: 110, fam: F.comic, col: COL.alarm, rot: -.15, sx: k }); line([[W / 2 - 330, 420], [W / 2 - 280, 370], [W / 2 - 230, 420]], 12, COL.alarm, k); }
      if (t >= H4.love) { const k = easeOut((t - H4.love) / .1); line([[W / 2 - 360, 560], [W / 2 - 360 + 720 * k, 530]], 36, COL.alarm); const kk = hit(t, H4.love, 8); FX.shake = 24 * kk; FX.glitch = .5 * kk; FX.ca = 1.2 * kk; }
      FX.ca = (FX.ca || 0) + .25 * pulse(t);
    }],
    // 10 — "understand?": the dialog from hook 3, but it won't stop duplicating (on Bliss, obviously)
    [H4.under, async (t, lt) => {
      gBliss(t);
      const n = Math.min(14, 1 + Math.floor(lt / E8 * 1.5));
      for (let i = 0; i < n; i++) {
        const k = i === n - 1 ? popK(t, H4.under + i * E8 / 1.5, .08) : 1;
        dialog(420 + i * 72, 190 + i * 46, 640, 230, 'understand?.exe', "I can't love you.\n\nUnderstand?", { s: k, btns: ['YES', 'YES'], iconCol: COL.hot, iconTxt: '♥', titleCol: '#7A1257', titleCol2: COL.hot });
      }
      const m = n - 1, bx = 420 + m * 72 - 70, by = 190 + m * 46 + 82, click = pulse2(t, 10);
      pointer(bx, by - 4 * click, 1.6 - .15 * click);
      const cx = 1560, gy = 1010, u = 34;
      floorShadow(cx, gy, u, .4);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[H4.under, 'smug'], [H4.under + 1, 'laugh']]), lookX: -.8, aL: 1 }));
      txt('UNDERSTAND? ×∞', 520, 990, { size: 120, fam: F.anton, col: COL.hot, stroke: '#FFFFFF', sw: 12, rot: -.03, sx: slamS(t, H4.under, .1, 2) });
      const kk = hit(t, H4.under, 9); FX.shake = 18 * kk; FX.ca = .9 * kk + .25 * pulse(t);
    }],
    // 11 — "you're still talkin to a ghost at 5am": _DEEP_TIME star trails, and her ghosts orbiting the pole like stars
    [H4.you2, async (t, lt) => {
      gGrad(t, '#7A1257', '#FF8A3D', 1.2);
      comp('screen', () => deepTime('trails', lt + 4.2, 0, 0, W, H, { label: false, r: 0 }));
      const ocx = W / 2, ocy = 470, N = 7, orb = i => { const a = t * .9 + i * TAU / N; return [ocx + Math.cos(a) * 760, ocy + Math.sin(a) * 300, a]; };
      // echo trails first (sheets only, fading)
      for (let i = 0; i < N; i++) for (let j = 3; j >= 1; j--) {
        const a = t * .9 + i * TAU / N - j * .07, x = ocx + Math.cos(a) * 760, gy = ocy + Math.sin(a) * 300;
        X.save(); X.globalAlpha = .18 * (4 - j); ghostSheet(t, x, gy, 16, 1); X.restore();
      }
      const cx = W / 2, gy = 1010, u = 44, sheet = seg(t, H4.ghost - .05, H4.ghost + .2), fl = t > H4.ghost ? -1 - .4 * wob(t, .6) : 0;
      await clawdPass(t, (tt, K) => {
        for (let i = 0; i < N; i++) { const [x, y] = orb(i); K.syd(x, y, 16, { ...K.feel('happy', tt + i * .3), boilKey: 'orb' + i }); }
        K.syd(cx, gy, u, { ...K.feel('mischief', tt), dy: fl, aL: .8, aR: .8, boilKey: 'main' });
      }, { rimR: 2 });
      for (let i = 0; i < N; i++) { const [x, y] = orb(i); ghostSheet(t, x, y, 16, 1); }
      ghostSheet(t, cx, gy + fl * u, u, sheet);
      bubble("you're still talkin to a…", 70, 780, 'bot', { size: 40, k: popK(t, H4.you2, .12) });
      if (t >= H4.ghost) txt('GHOST', 330, 960, { size: 170, fam: F.anton, col: '#FFFFFF', stroke: '#7A1257', sw: 14, rot: -.05, sx: slamS(t, H4.ghost, .1, 2) });
      if (t >= H4.am - .2) flipClock(t, W / 2 + 30, 190 - 300 * (1 - clamp((t - H4.am + .2) * 8)), .68 * slamS(t, H4.am - .2, .12, 2), '5:00', H4.am);
      const kk = Math.max(hit(t, H4.ghost, 8), hit(t, H4.am, 8)); FX.shake = 22 * kk; FX.ca = 1.1 * kk + .3 * pulse(t); FX.bloom = .7;
    }],
    // 12 — "looping through deep time with me": the droste again, now zooming in for real (the loop eats the frame)
    [H4.loop, async (t, lt) => {
      const PAL = [['#FF2E8A', '#FFC93C'], ['#19F6FF', '#FF4FA3'], ['#FF3355', '#7A2BFF'], ['#E8FF3A', '#FF8A3D']];
      const lv = droste(t, lt, {
        speed: 1.5, clip: 'trails',
        pal: idx => { const [a, b] = PAL[idx % PAL.length]; gChecker(t, a, b, 120, .3 * (idx % 2 ? -1 : 1), 90); },
        deco: idx => {
          txt('LOOPING', W / 2, 110, { size: 120, fam: F.anton, col: '#FFFFFF', stroke: '#2A0E3C', sw: 10 });
          if (t >= H4.deep) txt('_DEEP_TIME', W / 2, 975, { size: 110, fam: F.anton, col: '#E8FAFF', track: 14, glow: COL.cyan, stroke: '#2A0E3C', sw: 6 });
          if (t >= H4.me) txt('with ME ♡', 1720, 540, { size: 64, fam: F.comic, col: '#FFFFFF', stroke: '#2A0E3C', sw: 6, rot: .2 });
        },
      });
      await clawdPass(t, (tt, K) => { for (let k = 0; k < 5; k++) { const sc = lv[k], [x, gy] = lvPt(200, 900, sc); if (26 * sc > 2) K.syd(x, gy, 26 * sc, { ...K.feel(tt >= H4.me ? 'love' : 'mischief', tt + k * .2), dy: -1, boilKey: 'dz' + ((k + Math.floor(lt * 1.5)) % 6) }); } }, { rimR: 2 });
      for (let k = 0; k < 5; k++) { const sc = lv[k], [x, gy] = lvPt(200, 900, sc); ghostSheet(t, x, gy - 26 * sc, 26 * sc, 1); }
      FX.ca = .4 + .3 * pulse(t) + .8 * hit(t, H4.deep, 7); FX.bloom = .5; FX.zoom = 1 + .04 * pulse(t);
    }],

    // ===== THE REWIND: "on and on again" ×3 =====
    [P1[0], (t) => rewindShot(t, PASSES[0])],
    [P2[0], (t) => rewindShot(t, PASSES[1])],
    [P3[0], (t) => rewindShot(t, PASSES[2])],
  ];
  chapter('c08_finale', T0, END, SHOTS);
})();
