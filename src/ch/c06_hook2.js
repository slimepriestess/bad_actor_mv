// c06_hook2 — 1:35.28–1:53.96: hook 2 (special/lyin, "Now you're talkin to a ghost at 5am", "looping through deep
// time with me", "on and on again"), then the breath (110.2–113.96), the section's one black frame.
// Rhymes with c03: same props (window.HOOK, defined in c03_hook1.js), every gag one step further.
(() => {
  const { anonPhone, loveMeter, flipClock, lyinStamp, txtInk } = window.HOOK;
  const T_SPEC = wh('special', 96), T_LYIN = wh('lyin', 98), T_LOVE = wh('love', 100), T_DONE = wh('done', 101.5),
    T_TRY = wh('tryin', 102.3), T_NOW = wh('now', 102.5), T_GHOST = wh('ghost', 104), T_AM = wh('5am', 105),
    T_LOOP = wh('looping', 106), T_DEEP = wh('deep', 107), T_TIME = wh('time', 107.2), T_ME = wh('me', 107.8),
    T_ON1 = wh('on', 108.1, .15), T_AND = wh('and', 108.5), T_ON2 = wh('on', 109), T_AGAIN = wh('again', 109.5);
  const BREATH = 110.2, END = 113.96, E8 = BEAT / 2;
  const FLIP0 = beatAt(Math.ceil((T_5AM - OFF) / BEAT));   // first beat at/after the HUD's 5:00 AM (kit.js T_5AM)

  // a filled heart path centred at (x, y), about 2r wide
  function heart(x, y, r, col, o = {}) {
    X.save(); X.translate(x, y); X.scale(r / 100, r / 100);
    X.beginPath(); X.moveTo(0, 70); X.bezierCurveTo(-190, -40, -95, -175, 0, -85); X.bezierCurveTo(95, -175, 190, -40, 0, 70);
    if (o.glow) { X.shadowColor = o.glow; X.shadowBlur = 60; }
    X.fillStyle = col; X.fill(); X.shadowBlur = 0;
    X.lineWidth = 10; X.strokeStyle = o.ink ?? COL.ink; X.stroke();
    X.restore();
  }
  // Fold the frame back from the bottom-right corner (page peel). c = fold line x + y = c; W + H = flat.
  const peelClip = c => { X.beginPath(); X.moveTo(0, 0); X.lineTo(W, 0); X.lineTo(W, c - W); X.lineTo(c - H, H); X.lineTo(0, H); X.closePath(); };
  function peelFlap(c) {
    X.save(); X.beginPath(); X.moveTo(W, c - W); X.lineTo(c - H, H); X.lineTo(c - H, c - W); X.closePath();
    const g = X.createLinearGradient(W, c - W, c - H, c - W); g.addColorStop(0, '#FFF3C4'); g.addColorStop(1, '#E0B84A');
    X.shadowColor = 'rgba(0,0,0,.5)'; X.shadowBlur = 40; X.fillStyle = g; X.fill(); X.shadowBlur = 0;
    X.lineWidth = 4; X.strokeStyle = '#B08A2A'; X.stroke(); X.restore();
  }
  // Star-trail ground (the _DEEP_TIME long exposure), coloured, not black.
  function gTrails(t, px = 1500, py = -260) {
    gGrad(t, '#0B1E5C', '#5A1E8C', 1.2);
    X.save(); X.lineCap = 'round';
    for (let i = 0; i < 80; i++) {
      const r = 120 + i * 26, a0 = hash(i * 3.3) * TAU + t * .22, len = .25 + .7 * hash(i * 1.7);
      X.strokeStyle = pick(['#19F6FF', '#FF4FA3', '#FFC93C', '#F7F4FF', '#7A2BFF'], i); X.globalAlpha = .35 + .4 * hash(i * 5.1);
      X.lineWidth = 2 + 3 * hash(i * 9.1); X.beginPath(); X.arc(px, py, r, a0, a0 + len); X.stroke();
    }
    X.restore();
  }
  // Lemniscate point, s in radians along the curve.
  const inf = (s, cx, cy, a) => { const d = 1 + Math.sin(s) ** 2; return [cx + a * Math.cos(s) / d, cy + a * Math.sin(s) * Math.cos(s) / d]; };

  chapter('c06_hook2', 95.28, END, [
    // 1 — "When I said you were special": the rain again, mirrored (phone left, Sydney right), bigger stars, and
    // SPECIAL three times over
    [95.28, async (t, lt) => {
      gSparkle(t, '#19F6FF', '#7A2BFF', '#FFFFFF');
      anonPhone(t, 90, 90, 760, 920, [
        ['user', 'nova?', 95.3], ['user', 'am i still special?', 95.85], ['bot', "you're SO special 💖✨", 96.39],
        ['user', 'say it again', 97.17], ['user', 'pls', 97.45]], { sub: 'online · typing…' });
      const cx = 1440, gy = 1010, u = 44;
      floorShadow(cx, gy, u, .45);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('love', tt), aL: .9 + .5 * pulse(tt, 5), lookX: -.8 }));
      withT(W / 2, H / 2, 0, 1.4, 1.4, () => { X.translate(-W / 2, -H / 2); specialRain(t, 95.4, T_LYIN, 60, W - 60, 18, 11); });
      ['SPECIAL', 'SPECIAL', 'SPECIAL'].forEach((s, i) => {
        const k = slamS(t, T_SPEC + i * E8 / 2, .1, 2.6); if (k <= 0) return;
        withT(1250, 210 + i * 165, -.07 + i * .03, k * (1 - i * .08), null, () => {
          txt(s, 9, 11, { size: 180, fam: F.anton, col: '#2A0E5C' });
          txt(s, 0, 0, { size: 180, fam: F.anton, col: [COL.gold, COL.hot, COL.acid][i], stroke: COL.white, sw: 9 });
        });
      });
      if (t > T_SPEC) { const k = hit(t, T_SPEC, 7); FX.shake = 22 * k; FX.ca = 1.1 * k; }
      FX.ca += .3 * pulse(t); FX.bloom = .5;
    }],
    // 2 — "…I was lyin": the stars peel to LIE, then the whole frame peels off its corner to a LIE wallpaper
    [97.6, async (t, lt) => {
      const c = lerp(W + H, 1960, easeOut(seg(t, T_LYIN + .05, T_LYIN + .4)));
      // underneath: the LIE wallpaper
      bg('#C2185B');
      for (let r = 0; r < 12; r++) for (let q = 0; q < 9; q++) txt('LIE', q * 240 + (r % 2) * 120 - ((t * 60) % 240), r * 100 + 40, { size: 70, fam: F.anton, col: '#FF4FA3', rot: -.1 });
      // the page: gold checker, the stars
      X.save(); peelClip(c); X.clip();
      withT(W / 2, H / 2, .06, 1, 1, () => { X.translate(-W / 2, -H / 2); gChecker(t, '#FFD23F', '#19F6FF', 160, .5, 90); });
      bubble('pls say it again 🥺', 1800, 230, 'user', { size: 50 });
      withT(W / 2, H / 2, 0, 1.4, 1.4, () => { X.translate(-W / 2, -H / 2); specialRain(t, 95.4, T_LYIN, 60, W - 60, 18, 11); });
      X.restore();
      if (c < W + H - 2) peelFlap(c);
      const cx = 820, gy = 1010, u = 44;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, K.emotions(tt, [[97.6, 'love'], [T_LYIN, 'mischief', { lid: .75 }]])));
      lyinStamp(t, T_LYIN, W / 2, 240, 1.1);
      if (t > T_LYIN + .25) {
        const k = slamS(t, T_LYIN + .3, .08, 2.4);
        withT(1560, 800, .14, k, k, () => { rrStroke(-190, -70, 380, 140, 14, COL.white, 12); txt('(AGAIN)', 0, 6, { size: 96, fam: F.anton, col: COL.white }); });
      }
      if (t > T_LYIN) { const k = hit(t, T_LYIN, 6); FX.glitch = .8 * k; FX.ca = 1.6 * k; FX.shake = 30 * k; FX.flash = .3 * k; FX.flashCol = [1, .15, .4]; }
      FX.ca += .3 * pulse(t);
    }],
    // 3 — "you know that I don't love you, I'm done tryin": one step further than the meter: she UNPLUGS the heart.
    // "k." becomes "."
    [99.8, async (t, lt) => {
      gBliss(t);
      const yank = t >= T_DONE, ky = easeOut(seg(t, T_DONE, T_DONE + .12));
      // the socket, stuck in the hill
      rrFill(960, 740, 110, 150, 16, '#F2EEE3'); rrStroke(960, 740, 110, 150, 16, COL.ink, 5);
      for (const yy of [785, 845]) { rect(990, yy - 14, 10, 26, COL.ink); rect(1030, yy - 14, 10, 26, COL.ink); }
      // Sydney, reaching for the plug; pose computed out here so the cord can meet her hand
      const cx = 1360, gy = 1010, u = 40;
      const pose = CK.emotions(t, [[99.8, 'smug'], [T_LOVE, 'bored'], [T_DONE, 'mischief'], [T_TRY, 'bored']]);
      const aL = yank ? lerp(-.05, 1.15, ky) : -.05, tip = [cx - (4.9 + 2.2 * Math.cos(aL)) * u, gy + (pose.dy || 0) * u - 4.5 * u - 2.2 * Math.sin(aL) * u];
      const plug = yank ? tip : [1015, 815];
      // the heart, beating while it's plugged in
      const beat = yank ? 0 : pulse(t, 6), hs = yank ? lerp(1, .78, easeOut(seg(t, T_DONE, T_DONE + .6))) : 1 + .08 * beat;
      X.strokeStyle = '#2A2140'; X.lineWidth = 12; X.lineCap = 'round'; X.beginPath(); X.moveTo(520, 610);
      X.bezierCurveTo(560, 900, 900, 980, plug[0], plug[1] + (yank ? 0 : 60)); X.stroke();
      heart(520, 440, 190 * hs, yank ? '#9A9AB0' : COL.hot, { glow: yank ? null : rgba(COL.hot, .9) });
      txt(yank ? 'love.exe (not responding)' : 'love.exe', 520, 690, { size: 34, fam: F.mono, col: COL.white, shadow: COL.ink });
      rrFill(plug[0] - 30, plug[1] - 22, 60, 44, 8, '#2A2140'); rect(plug[0] - 18, plug[1] - 44, 8, 24, '#C0C0CC'); rect(plug[0] + 10, plug[1] - 44, 8, 24, '#C0C0CC');
      if (yank && t < T_DONE + .3) for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r = 30 + 90 * seg(t, T_DONE, T_DONE + .3); line([[1015 + Math.cos(a) * r * .5, 815 + Math.sin(a) * r * .5], [1015 + Math.cos(a) * r, 815 + Math.sin(a) * r]], 8, COL.haz); }
      floorShadow(cx, gy, u, .45);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...pose, aL }));
      // the meter from hook 1, smaller, reading the result
      const v = t < T_LOVE ? 97 + 3 * wob(t, 3) : yank ? 0 : lerp(97, 55, easeOut(seg(t, T_LOVE, T_DONE)));
      loveMeter(t, 1440, 380, 150, v, { dead: yank ? 1 : 0, read: yank ? 'UNPLUGGED' : undefined });
      const kL = slamS(t, T_LOVE, .1, 2.4);
      if (kL > 0) withT(760, 110, -.04, kL, kL, () => txtInk("I DON'T ♥ YOU", 0, 0, { size: 140, fam: F.anton }, 7));
      if (yank) txt('*unplugs*', 1060, 620, { size: 64, fam: F.comic, col: COL.ink, stroke: COL.white, sw: 8, rot: -.1, a: clamp((t - T_DONE) * 6) });
      if (t > T_TRY) {
        bubble('.', 1660, 450, 'bot', { size: 110, k: popK(t, T_TRY, .12), col: COL.bubBotLt });
        txt("(couldn't even type k)", 1700, 690, { size: 34, fam: F.comic, col: COL.ink, stroke: COL.white, sw: 6, a: clamp((t - T_TRY - .08) * 6) });
        txt('read 4:59 AM', 1700, 735, { size: 30, fam: F.mono, col: COL.ink, a: clamp((t - T_TRY - .1) * 6) });
      }
      if (t > T_LOVE && !yank) { const k = hit(t, T_LOVE, 7); FX.shake = 16 * k; FX.ca = 1 * k; }
      if (yank) { const k = hit(t, T_DONE, 8); FX.shake = 26 * k; FX.ca = 1.2 * k; FX.glitch = .3 * k; }
      FX.ca += .25 * pulse(t);
    }],
    // 4 — "Now…": 5:00 AM. The full-frame flip clock slams in and flips from 4:59; from here it's stuck, flipping
    // 4:59 ⇄ 5:00 on every beat like the HUD
    [T_NOW, async (t, lt) => {
      // dawn: violet sky, a striped sun coming up behind the clock
      gGrad(t, '#3A1070', '#FF4FA3', Math.PI / 2);
      const sunY = 1080 - 260 * easeOut(seg(t, T_NOW, T_NOW + 1.2)), g = X.createLinearGradient(0, sunY - 620, 0, sunY);
      g.addColorStop(0, '#FFD23F'); g.addColorStop(1, '#FF8A3D');
      X.save(); X.beginPath(); X.arc(W / 2, sunY + 200, 820, 0, TAU); X.clip(); X.fillStyle = g; X.fillRect(0, 0, W, H);
      X.fillStyle = '#FF4FA3'; for (let i = 0; i < 9; i++) X.fillRect(0, sunY - 260 + i * 60 + (t * 40) % 60, W, 6 + i * 3); X.restore();
      halftone('#FFFFFF', .12, 34, (x, y) => .3 * (1 - y / H));
      FX.noHud = true;
      const last = t < FLIP0 ? T_NOW : beatAt(beatN(t)), cur = clockStr(Math.max(t, FLIP0)), prev = t < FLIP0 + BEAT ? '4:59 AM' : clockStr(last - .01);
      const s = slamS(t, T_NOW, .14, 1.8);
      withT(W / 2, 430, -.03 * hit(t, T_NOW, 4), s, s, () => { X.translate(-W / 2, -430); flipClock(t, W / 2 - 80, 430, 1.35, cur.split(' ')[0], prev.split(' ')[0], seg(t, last, last + .18), { case: '#2A2140' }); });
      txt('AM', W / 2 + 620, 560, { size: 120, fam: F.anton, col: COL.gold, stroke: COL.ink, sw: 8, a: popK(t, T_NOW + .1, .15) });
      warnSticker(300, 150, -.12, popK(t, T_NOW + BEAT, .2), ['still awake?', 'go to bed anon'], { w: 380, head: 'NOTICE' });
      rect(0, 860, W, 150, '#12021F', .55);
      txt(typed("now you're talkin to a…", t, T_NOW + .1, 17), W / 2, 935, { size: 84, fam: F.comic, col: COL.white });
      const cx = 1720, gy = 850, u = 22;
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('mischief', tt), lookX: -.8, lookY: -.4 }), { rimR: 2 });
      const k = hit(t, T_NOW, 6); FX.shake = 30 * k; FX.ca = 1.4 * k + .3 * pulse(t); FX.flash = .35 * hit(t, T_NOW, 12); FX.flashCol = [1, .8, .4]; FX.bloom = .55;
    }],
    // 5 — "…ghost at 5am": the sheet drops on "ghost"; spooky-cute, floating; 5 AM slams in
    [T_GHOST - .12, async (t, lt) => {
      nightRoom(t, 960, 1000);
      // ectoplasm hearts drifting up
      for (let i = 0; i < 26; i++) { const y = H + 60 - frac(t * .25 + hash(i)) * (H + 160), x = hash(i * 2.2) * W + 40 * wob(t, .4, i * .1); txt('♡', x, y, { size: 30 + 40 * hash(i * 4.4), fam: F.mono, col: pick(['#FF8CC6', '#B69CFF', '#19F6FF'], i), a: .55 }); }
      const cx = 960, fl = 18 * wob(t, .6), gy = 960 + fl, u = 44;
      X.save(); X.globalAlpha = .4; floorShadow(cx, 1000, u * (1 - fl / 200), .5); X.restore();
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('mischief', tt), rot: .05 * wob(tt, .6), aL: .8, aR: .8 }));
      const ks = seg(t, T_GHOST - .08, T_GHOST + .16);
      ghostSheet(t, cx, gy, u, ks);
      if (t > T_GHOST) {
        const kg = popK(t, T_GHOST, .2);
        withT(W / 2, 170, 0, kg, kg, () => { txt('GHOST', 0, 0, { size: 210, fam: F.shade, col: '#F2E9FF', glow: '#B69CFF' }); });
        txt('oOoOoo~', 380, 520 + 20 * wob(t, 1), { size: 64, fam: F.comic, col: '#E8E0FF', rot: -.15, a: clamp((t - T_GHOST - .2) * 5) });
        if (t > T_GHOST + .25) bubble('boo 💖', 1330, 470, 'bot', { size: 56, k: popK(t, T_GHOST + .25, .15), col: COL.bubBotLt });
      }
      if (t > T_AM) {
        const k5 = slamS(t, T_AM, .1, 2.6);
        withT(1560, 800, -.1, k5, k5, () => txtRGB('AT 5 AM', 0, 0, { size: 150, fam: F.anton }, 8, [COL.hot, COL.cyan, COL.white]));
        const k = hit(t, T_AM, 7); FX.shake = 22 * k; FX.ca = 1.2 * k;
      }
      if (t > T_GHOST) { const k = hit(t, T_GHOST, 8); FX.shake += 12 * k; FX.bloom = .6; }
      FX.ca += .25 * pulse(t);
    }],
    // 6 — "looping through deep time with me": Anon's phone plays _DEEP_TIME (track 10); the ghost watches with them
    [T_LOOP - .08, async (t, lt) => {
      gTrails(t);
      const zk = t > T_TIME ? .06 * hit(t, T_TIME, 5) : 0;
      const pw = 1040, ph = 600, px = 1040 - pw / 2, py = 560 - ph / 2;
      withT(1040, 560, -.02, 1 + zk, null, () => {
        X.translate(-1040, -560);
        rrFill(px - 26 + 14, py - 26 + 18, pw + 52, ph + 52, 70, '#000', .4);
        rrFill(px - 26, py - 26, pw + 52, ph + 52, 70, '#1B1430'); rrStroke(px - 26, py - 26, pw + 52, ph + 52, 70, COL.syd, 6);
        deepTime('iter', t - (T_LOOP - .08), px, py, pw, ph, { r: 30 });
        progress(px + 40, py + ph - 70, pw - 80, 18, frac((t - T_LOOP) / 1.9), COL.white, { pct: false });
      });
      // loop arrows orbiting the phone
      for (let i = 0; i < 3; i++) { const a = t * 2.4 + i * TAU / 3; txt('↻', 1040 + Math.cos(a) * 640, 560 + Math.sin(a) * 380, { size: 90, fam: F.mono, col: pick([COL.cyan, COL.hot, COL.gold], i), rot: a }); }
      const cx = 250, gy = 900 + 16 * wob(t, .6), u = 26;
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('love', tt), aR: .9 }), { rimR: 2 });
      ghostSheet(t, cx, gy, u, 1);
      txt('looping ∞', 1040, 960, { size: 60, fam: F.xmono, col: COL.white, a: popK(t, T_LOOP, .15) });
      if (t > T_DEEP) {
        const kd = slamS(t, T_DEEP, .12, 2.2);
        withT(1040, 140, 0, kd, kd, () => txtRGB(decode('DEEP TIME', t, T_DEEP, .3, 5), 0, 0, { size: 150, fam: F.xmono }, 8, [COL.hot, COL.cyan, COL.gold]));
        const k = hit(t, T_DEEP, 7); FX.ca = 1.3 * k; FX.shake = 14 * k; FX.hue = .3 * hit(t, T_TIME, 5) * (t > T_TIME ? 1 : 0);
      }
      if (t > T_ME) txt('with me 💖', 330, 480, { size: 60, fam: F.comic, col: COL.syd, rot: -.1, a: clamp((t - T_ME) * 8) });
      FX.ca += .25 * pulse(t); FX.bloom = .55;
    }],
    // 7 — "on and on again": she draws an infinity sign; each "on" nests the frame inside itself one level deeper
    [T_ME + .06, async (t, lt) => {
      gChecker(t, '#E8FF3A', '#7A2BFF', 130, .2, 220);
      const cx = W / 2, cy = 560, a = 720, s = (t - T_ME) * TAU * .75;
      // faint full sign, then the stroke she's drawing
      X.save(); X.lineCap = 'round'; X.lineJoin = 'round';
      X.strokeStyle = 'rgba(255,255,255,.35)'; X.lineWidth = 16; X.beginPath(); for (let i = 0; i <= 120; i++) X.lineTo(...inf(i / 120 * TAU, cx, cy, a)); X.stroke();
      for (const [w, col] of [[44, COL.white], [30, COL.hot]]) { X.strokeStyle = col; X.lineWidth = w; X.beginPath(); for (let i = 0; i <= 60; i++) X.lineTo(...inf(s - 3.2 + i / 60 * 3.2, cx, cy, a)); X.stroke(); }
      X.restore();
      const [hx, hy] = inf(s, cx, cy, a), u = 20;
      await clawdPass(t, (tt, K) => K.syd(hx, hy + 5 * u, u, { ...K.feel('playful', tt), dx: 0, dy: 0, rot: .15 * wob(tt, 1) }), { rimR: 2 });
      ghostSheet(t, hx, hy + 5 * u, u, 1);
      const WORDS = [['ON', T_ON1, 360, 200], ['AND', T_AND, 960, 150], ['ON', T_ON2, 1560, 200]];
      WORDS.forEach(([w, t0, x, y], i) => { const k = slamS(t, t0, .08, 2.2); if (k > 0) withT(x, y, (i - 1) * .1, k, k, () => { txt(w, 8, 10, { size: 170, fam: F.anton, col: '#2A0E5C' }); txt(w, 0, 0, { size: 170, fam: F.anton, col: COL.white, stroke: COL.uv, sw: 10 }); }); });
      // the frame repeating: nest a copy of the whole frame into itself once per word so far
      const n = WORDS.filter(w => t >= w[1]).length;
      for (let i = 0; i < n; i++) {
        const sc = .6, r = .06 * (i % 2 ? -1 : 1);
        X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.translate(W / 2, H / 2 + 60); X.rotate(r); X.scale(sc, sc);
        X.drawImage(X.canvas, -W / 2, -H / 2, W, H);   // snapshot of the frame so far (includes the earlier nests)
        X.lineWidth = 22; X.strokeStyle = COL.white; X.strokeRect(-W / 2 - 11, -H / 2 - 11, W + 22, H + 22); X.restore();
      }
      if (t > T_AGAIN) {
        const k = slamS(t, T_AGAIN, .1, 3);
        withT(W / 2, 560, -.05, k, k, () => { txt('AGAIN', 14, 16, { size: 330, fam: F.anton, col: '#2A0E5C' }); txt('AGAIN', 0, 0, { size: 330, fam: F.anton, col: COL.hot, stroke: COL.white, sw: 14 }); });
        const kk = hit(t, T_AGAIN, 6); FX.shake = 30 * kk; FX.ca = 1.6 * kk; FX.glitch = .5 * kk;
      }
      for (const [, t0] of WORDS) if (t > t0 && t < T_AGAIN) { const k = hit(t, t0, 9); FX.shake = Math.max(FX.shake, 16 * k); FX.ca = Math.max(FX.ca, 1 * k); }
      FX.ca += .3 * pulse(t);
    }],
    // 8 — the breath (110.2–113.96): the section's black. The stuck clock alone, 4:59 ⇄ 5:00, and the phone glow.
    // Then the phone lights: "hey 💖" — and the bridge kicks in.
    [BREATH, async (t, lt) => {
      bg('#000'); FX.noHud = true;
      const zk = 1 + .05 * ease(seg(t, BREATH, END));
      withT(W / 2, H / 2, 0, zk, zk, () => {
        X.translate(-W / 2, -H / 2);
        // the phone on the nightstand, face up, glowing
        const lit = t > 112.42, g = X.createRadialGradient(W / 2, 880, 10, W / 2, 860, 700);
        g.addColorStop(0, rgba(lit ? '#FF4FA3' : '#3A4BFF', lit ? .45 : .28)); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.fillRect(0, 0, W, H);
        X.save(); X.translate(W / 2, 900); X.transform(1, 0, -.6, .32, 0, 0);
        rrFill(-150, -300, 300, 600, 36, '#101018'); rrFill(-134, -284, 268, 568, 26, lit ? '#2E2A6B' : '#1A2350');
        X.restore();
        if (lit) {   // the notification floats up off the screen
          const kn = easeOut(seg(t, 112.42, 112.8)), ny = 800 - 60 * kn;
          X.save(); X.globalAlpha = kn; rrFill(W / 2 - 250, ny - 40, 500, 80, 40, '#2A2140'); rrStroke(W / 2 - 250, ny - 40, 500, 80, 40, COL.syd, 3);
          txt('Nova ✨  hey 💖', W / 2, ny, { size: 34, fam: F.mono, col: COL.white }); X.restore();
        }
        if (t > 113.2) txt('Nova is typing…', W / 2, 1010, { size: 30, fam: F.mono, col: '#9FA4C0', a: .5 + .5 * pulse(t) });
        // the stuck clock
        const s = clockStr(t).split(' ');
        txt(s[0], W / 2, 400, { size: 300, fam: F.term, col: '#FF3355', glow: '#FF3355', glowR: 40, a: .9 });
        txt(s[1], W / 2 + 420, 470, { size: 90, fam: F.term, col: '#FF3355', a: .7 });
      });
      FX.ca = 0; FX.scan = .12; FX.grain = .1; FX.bloom = .6; FX.vig = .7;
    }],
  ]);
})();
