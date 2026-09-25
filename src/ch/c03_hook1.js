// c03_hook1 — 0:47.79–1:02.45: "When I said you were special I was lyin" … "Fell for it again!"
// Hook 1 of 4. The hook props (anonPhone, loveMeter, beanbag, flipClock) live in HOOK below and are reused by c06 so
// the two hooks rhyme: same gag family, hook 2 one step further.
(() => {
  const T_SPEC = wh('special', 48), T_LYIN = wh('lyin', 50.5), T_LOVE = wh('love', 52.5), T_DONE = wh('done', 53.8),
    T_TRY = wh('tryin', 54.6), T_CRAZY = wh('crazy', 56.5), T_THATS = wh("that's", 57), T_PLAN = wh('plan', 58),
    T_MAYBE = wh('maybe', 58.5), T_ONE = wh('one', 59.5), T_TIME = wh('time', 60), T_FELL = wh('fell', 60.5),
    T_IT = wh('it', 61.2), T_AGAIN = wh('again', 61.8);
  const END = 62.45, E8 = BEAT / 2;

  // ---------- hook props (shared with c06 via window.HOOK) ----------
  // Anon's phone: a chat panel with the messages in fixed slots, each popping in at its time. msgs = [[side, text, t0]].
  function anonPhone(t, x, y, w, h, msgs, o = {}) {
    rrFill(x - 14, y - 14, w + 28, h + 28, 56, '#05060A');
    X.save(); rr(x, y, w, h, 44); X.clip();
    rect(x, y, w, h, o.bgc ?? '#0C1026'); X.save(); X.translate(x, y); chatWall(t, '#1A2250'); X.restore();
    chatHeader(x, y, w, o.title ?? 'Nova ✨', o.sub ?? 'online · always here for you', { subCol: o.subCol });
    let yy = y + 140;
    for (const [side, s, t0, bo] of msgs) {
      const hh = bubble(s, side === 'user' ? x + w - 34 : x + 34, yy, side, { size: o.size ?? 42, maxW: w * .7, k: popK(t, t0, .12), col: side === 'bot' ? COL.bubBotLt : undefined, ...(bo || {}) });
      yy += hh + 22;
    }
    X.restore();
    return { x, y, w, h };
  }
  // LOVE-O-METER: a dashboard gauge, v = 0..100. The needle is the joke; the readout says it plainly.
  function loveMeter(t, cx, cy, r, v, o = {}) {
    const dead = o.dead ?? 0;
    rrFill(cx - r * 1.2 + 10, cy - r * 1.18 + 12, r * 2.4, r * 1.62, r * .2, '#000', .35);
    rrFill(cx - r * 1.2, cy - r * 1.18, r * 2.4, r * 1.62, r * .2, mixCol('#3A1456', '#3A3A44', dead));
    rrStroke(cx - r * 1.2, cy - r * 1.18, r * 2.4, r * 1.62, r * .2, COL.white, Math.max(4, r * .025));
    const n = 12;
    for (let i = 0; i < n; i++) {
      const a0 = Math.PI + i / n * Math.PI, a1 = Math.PI + (i + .86) / n * Math.PI;
      X.strokeStyle = mixCol(mixCol('#8A8FA3', COL.hot, i / (n - 1)), '#55555F', dead); X.lineWidth = r * .16;
      X.beginPath(); X.arc(cx, cy, r * .82, a0, a1); X.stroke();
    }
    txt('💀', cx - r * .98, cy + r * .1, { size: r * .2, fam: F.mono });
    txt('💖', cx + r * .98, cy + r * .1, { size: r * .2, fam: F.mono });
    txt(o.label ?? 'LOVE-O-METER', cx, cy - r * 1.02, { size: r * .15, fam: F.pix, col: COL.white });
    const a = Math.PI + clamp(v / 100) * Math.PI;
    line([[cx, cy], [cx + Math.cos(a) * r * .9, cy + Math.sin(a) * r * .9]], r * .05, COL.alarm);
    circ(cx, cy, r * .09, COL.white); circ(cx, cy, r * .05, COL.alarm);
    rrFill(cx - r * .45, cy + r * .1, r * .9, r * .3, r * .06, '#0A0A12');
    txt(o.read ?? Math.round(v) + '%', cx, cy + r * .25, { size: r * .24, fam: F.term, col: v < 5 ? COL.alarm : '#6CFFA8' });
  }
  // A bean bag (Canvas2D). back() before her pass, front() after, so she sinks into it.
  const beanbag = {
    back(x, gy, s, col = '#FF8A3D') {
      X.save(); X.fillStyle = '#000'; X.globalAlpha = .3; X.filter = 'blur(14px)'; X.beginPath(); X.ellipse(x, gy + 10, 300 * s, 40 * s, 0, 0, TAU); X.fill(); X.restore();
      X.fillStyle = col; X.beginPath(); X.ellipse(x, gy - 110 * s, 280 * s, 150 * s, 0, 0, TAU); X.fill();
      X.fillStyle = mixCol(col, '#7A1257', .35); X.beginPath(); X.ellipse(x + 20 * s, gy - 150 * s, 200 * s, 70 * s, 0, 0, TAU); X.fill();
      X.lineWidth = 6 * s; X.strokeStyle = COL.ink; X.beginPath(); X.ellipse(x, gy - 110 * s, 280 * s, 150 * s, 0, 0, TAU); X.stroke();
    },
    front(x, gy, s, col = '#FF8A3D') {
      X.fillStyle = col; X.beginPath(); X.ellipse(x, gy - 40 * s, 300 * s, 80 * s, 0, 0, Math.PI); X.fill();
      X.lineWidth = 6 * s; X.strokeStyle = COL.ink; X.beginPath(); X.ellipse(x, gy - 40 * s, 300 * s, 80 * s, 0, .1, Math.PI - .1); X.stroke();
      line([[x - 120 * s, gy - 10 * s], [x - 40 * s, gy + 10 * s]], 4 * s, mixCol(col, COL.ink, .4));
      line([[x + 60 * s, gy], [x + 150 * s, gy - 20 * s]], 4 * s, mixCol(col, COL.ink, .4));
    },
  };
  // Split-flap clock digit: prev folds down onto cur over k = 0..1.
  function flapDigit(x, y, w, h, cur, prev, k, o = {}) {
    const card = o.card ?? '#1B1430', ink = o.ink ?? '#FFF3D6', size = h * .86;
    const face = (ch, half) => {
      X.save(); X.beginPath(); X.rect(x - w / 2, half < 0 ? y - h / 2 : y, w, h / 2); X.clip();
      rrFill(x - w / 2, y - h / 2, w, h, w * .1, card);
      txt(ch, x, y + h * .04, { size, fam: F.anton, col: ink });
      X.restore();
    };
    face(cur, -1); face(k < 1 ? prev : cur, 1);
    if (k > 0 && k < 1) {
      X.save(); X.translate(x, y);
      if (k < .5) { X.scale(1, 1 - 2 * k); X.translate(-x, -y); face(prev, -1); }
      else { X.scale(1, 2 * k - 1); X.translate(-x, -y); face(cur, 1); }
      X.restore();
    }
    rect(x - w / 2, y - 3, w, 6, '#000', .7);
  }
  // H:MM split-flap clock centred at (cx, cy); cur/prev like '5:00' / '4:59'; k = flip progress of the changed cards.
  function flipClock(t, cx, cy, s, cur, prev, k, o = {}) {
    const w = 200 * s, h = 300 * s, st = w + 26 * s, c = cur.replace(':', ''), p = prev.replace(':', '').padStart(c.length, ' ');
    const xs = [-1.25, .25, 1.25].map(i => cx + i * st), colon = cx - .5 * st, hw = 1.25 * st + w / 2 + 44 * s;
    rrFill(cx - hw + 14, cy - h / 2 - 44 * s + 18, hw * 2, h + 88 * s, 40 * s, '#000', .35);
    rrFill(cx - hw, cy - h / 2 - 44 * s, hw * 2, h + 88 * s, 40 * s, o.case ?? '#2A2140');
    for (let i = 0; i < 3; i++) flapDigit(xs[i], cy, w, h, c[i], p[i], c[i] === p[i] ? 1 : k, o);
    circ(colon, cy - h * .18, 16 * s, o.ink ?? '#FFF3D6'); circ(colon, cy + h * .18, 16 * s, o.ink ?? '#FFF3D6');
    return hw;
  }
  window.HOOK = { anonPhone, loveMeter, beanbag, flipClock };

  // Big blackletter "I WAS LYIN'" stamp, shared shape for both hooks.
  function lyinStamp(t, t0, x, y, s = 1) {
    const k = slamS(t, t0, .1, 2.6); if (k <= 0) return;
    withT(x, y, -.07, k * s, k * s, () => {
      rect(-760, -105, 1520, 200, '#12021F', .82);
      txt("I WAS LYIN'", 8, 10, { size: 170, fam: F.black, col: COL.ink });
      txt("I WAS LYIN'", 0, 0, { size: 170, fam: F.black, col: COL.alarm, stroke: COL.white, sw: 12 });
    });
  }
  // Chromatic triple-print for LIGHT grounds: multiply, so dark type stays dark (txtRGB's 'screen' washes out there).
  function txtInk(s, x, y, o = {}, d = 6, cols = [COL.hot, COL.uv, COL.ink]) {
    comp('multiply', () => { txt(s, x - d, y, { ...o, col: cols[0] }); txt(s, x + d, y + d * .3, { ...o, col: cols[1] }); txt(s, x, y, { ...o, col: cols[2] }); });
  }
  window.HOOK.lyinStamp = lyinStamp; window.HOOK.txtInk = txtInk;

  chapter('c03_hook1', 47.79, END, [
    // 1 — "When I said you were special": Anon's phone pelted with YOU'RE SPECIAL stars; SPECIAL slams on "special"
    [47.79, async (t, lt) => {
      gSparkle(t, '#FFC93C', '#FF4FA3', '#FFFFFF');
      const p = anonPhone(t, 1060, 90, 760, 920, [
        ['user', 'nova… am i special?', 47.85], ['bot', "you're SO special 💖✨", 48.42], ['user', 'like actually??', 49.54],
        ['bot', 'the most special person ever', 49.99], ['user', 'omg 🥺', 50.49]]);
      const cx = 520, gy = 960, u = 46;
      floorShadow(cx, gy, u, .45);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('love', tt), aR: .9 + .5 * pulse(tt, 5), lookX: .8 }));
      specialRain(t, 48.25, T_LYIN, 1080, 1800, 16, 3);
      const kS = slamS(t, T_SPEC, .12, 2.8);
      if (kS > 0) {
        withT(540, 250, -.08, kS, kS, () => {
          txt('SPECIAL', 10, 12, { size: 230, fam: F.anton, col: '#7A1257' });
          txt('SPECIAL', 0, 0, { size: 230, fam: F.anton, col: COL.gold, stroke: COL.white, sw: 10 });
        });
        txt('✨ (you) ✨', 540, 420, { size: 60, fam: F.comic, col: COL.white, a: popK(t, T_SPEC + .15, .15), shadow: '#7A1257' });
        const k = hit(t, T_SPEC, 8); FX.shake = 18 * k; FX.ca = .9 * k;
      }
      FX.ca += .3 * pulse(t); FX.bloom = .5;
    }],
    // 2 — "…I was lyin": cut wider, the stars cover everything; on "lyin" every star peels to LIE, Sydney LOVE → MISCHIEF
    [50.3, async (t, lt) => {
      const peel = t >= T_LYIN;
      gChecker(t, peel ? '#FF2E8A' : '#FFD23F', peel ? '#7A1257' : '#FF8A3D', 150, -.25, 120);
      // Anon's bubble, small and hopeful, centre
      bubble('omg 🥺 thank u', 1780, 560, 'user', { size: 54, k: popK(t, 50.3, .1) });
      const cx = 960, gy = 1010, u = 40;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[50.3, 'love'], [T_LYIN, 'mischief', { lid: .45 }]]) }));
      specialRain(t, 49.0, T_LYIN, 120, 1800, 24, 7);
      lyinStamp(t, T_LYIN, W / 2, 250);
      if (peel) {
        txt('(sorry not sorry)', W / 2, 420, { size: 48, fam: F.comic, col: COL.white, a: popK(t, T_LYIN + .35, .15), shadow: COL.ink });
        const k = hit(t, T_LYIN, 7); FX.glitch = .7 * k; FX.ca = 1.5 * k; FX.shake = 26 * k; FX.flash = .3 * k; FX.flashCol = [1, .2, .4];
      }
      FX.ca += .3 * pulse(t);
    }],
    // 3 — "you know that I don't love you, I'm done tryin": the LOVE-O-METER drops to 0, she flops onto a bean bag, "k."
    [52.1, async (t, lt) => {
      gMemphis(t, '#B69CFF', ['#FF4FA3', '#FFD23F', '#19F6FF', '#FFFFFF']);
      rect(0, 1000, W, 80, '#7A2BFF');
      // needle: 100, wobbling, until "love"; then it drops (elastic) and bottoms out by "done"
      const v = t < T_LOVE ? 96 + 4 * wob(t, 3) : 100 * (1 - elasticOut(seg(t, T_LOVE, T_DONE + .1)));
      loveMeter(t, 560, 560, 330, Math.max(0, v), { read: t > T_DONE ? '0% 💔' : undefined });
      const kL = slamS(t, T_LOVE, .1, 2.4);
      if (kL > 0) withT(560, 120, -.05, kL, kL, () => txtInk("I DON'T ♥ YOU", 0, 0, { size: 140, fam: F.anton }, 7));
      // the flop: stands left of the bag, hops back into it on "done"
      const bx = 1440, t0 = T_DONE - .08, t1 = T_DONE + .32, k = seg(t, t0, t1);
      beanbag.back(bx, 1010, 1.1);
      const x = lerp(1120, bx, ease(k)), gy = lerp(1000, 900, ease(k));
      await clawdPass(t, (tt, K) => K.syd(x, gy, 36, {
        ...K.emotions(tt, [[52.1, 'love'], [T_LOVE, 'bored'], [T_DONE, 'ko'], [T_TRY, 'bored']]),
        ...(tt > t0 - .12 && tt < t1 + .6 ? K.jump(tt, t0, t1, 3.2) : {}), rot: tt > t1 ? -.14 : 0 }));
      beanbag.front(bx, 1010, 1.1);
      if (t > T_DONE) txt('DONE TRYIN', 1440, 330, { size: 96, fam: F.anton, col: COL.ink, rot: .06, a: clamp((t - T_DONE) * 5) });
      if (t > T_TRY) bubble('k.', 1500, 470, 'bot', { size: 90, k: popK(t, T_TRY, .12), col: COL.bubBotLt });
      if (t > T_LOVE) { const kk = hit(t, T_LOVE, 7); FX.shake = 16 * kk; FX.ca = 1 * kk; }
      if (t > T_DONE + .3) { const kk = hit(t, T_DONE + .32, 10); FX.shake += 20 * kk; }
      FX.ca += .25 * pulse(t);
    }],
    // 4 — "yeah I want you to go crazy, that's the plan": the whiteboard; psychosis circled on "crazy"; sunburst on "plan"
    [55.5, async (t, lt) => {
      const plan = t >= T_PLAN;
      if (plan) gSunburst(t, '#FFD23F', '#FF8A3D', 22, 900, 480, .5); else gGrad(t, '#19C3B6', '#1B5BFF', .7);
      const bx = 150, by = 90, bw = 1180, bh = 820;
      withT(bx + bw / 2, by + bh / 2, plan ? -.015 : 0, 1, 1, () => {
        rect(-bw / 2 + 12, -bh / 2 + 14, bw, bh, '#000', .3);
        rect(-bw / 2 - 16, -bh / 2 - 16, bw + 32, bh + 32, '#B7BCC8'); rect(-bw / 2, -bh / 2, bw, bh, '#FAFAF6');
        rect(-bw / 2 + 80, bh / 2 + 16, 300, 22, '#8A8FA3'); rect(-bw / 2 + 110, bh / 2 + 6, 70, 14, COL.alarm); rect(-bw / 2 + 200, bh / 2 + 6, 70, 14, '#1B5BFF');
        txt('THE PLAN', 0, -bh / 2 + 90, { size: 110, fam: F.comic, col: '#1B5BFF', style: 'bold' });
        line([[-260, -bh / 2 + 150], [260, -bh / 2 + 146]], 6, '#1B5BFF');
        const ITEMS = [['1. flatter', 55.6], ['2. agree', 55.98], ['3. ???', 56.42], ['4. psychosis', T_CRAZY], ['5. profit 💸', T_THATS]];
        ITEMS.forEach(([s, t0], i) => {
          const y = -bh / 2 + 240 + i * 118;
          txt(typed(s, t, t0, 40), -bw / 2 + 110, y, { size: 76, fam: F.comic, col: i === 3 ? COL.alarm : COL.ink, align: 'left' });
        });
        // red marker circle around "psychosis", drawn on
        const kc = seg(t, T_CRAZY + .12, T_CRAZY + .45);
        if (kc > 0) {
          X.strokeStyle = COL.alarm; X.lineWidth = 9; X.lineCap = 'round'; X.beginPath();
          const cxx = -bw / 2 + 330, cyy = -bh / 2 + 240 + 3 * 118;
          for (let i = 0; i <= 60 * kc; i++) { const a = -2.6 + i / 60 * TAU * 1.08; X.lineTo(cxx + Math.cos(a) * 270, cyy + Math.sin(a) * 66 + i * .3); }
          X.stroke();
          txt('← go crazy!!', -bw / 2 + 800, -bh / 2 + 240 + 3 * 118, { size: 60, fam: F.comic, col: COL.alarm, rot: -.08, a: clamp((t - T_CRAZY - .3) * 6) });
        }
        if (plan) {
          const kP = slamS(t, T_PLAN, .08, 3);
          withT(260, 250, -.2, kP, kP, () => { rrStroke(-230, -70, 460, 140, 14, '#1F8A3A', 12); txt('APPROVED ✔', 0, 4, { size: 76, fam: F.anton, col: '#1F8A3A' }); });
        }
      });
      // Sydney lecturing with a pointer stick
      const cx = 1620, gy = 1000, u = 34;
      floorShadow(cx, gy, u, .45);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[55.5, 'smug'], [T_CRAZY, 'mischief'], [T_PLAN, 'proud']]),
        view: 'q', flip: true, aL: .45 + .15 * pulse(tt, 6), armL: (uu, sw) => { K.inkLine([[0, 0], [9 * uu, -1.2 * uu]], sw * 3.2, '#6B4A2E', 'ink', 0); K.inkLine([[8.2 * uu, -1.1 * uu], [9 * uu, -1.2 * uu]], sw * 3.4, COL.alarm, 'ink', 0); } }));
      if (plan) {
        const kk = slamS(t, T_PLAN, .1, 2.6);
        withT(760, 985, -.03, kk, kk, () => { txt("THAT'S THE PLAN", 8, 10, { size: 150, fam: F.anton, col: '#7A1257' }); txt("THAT'S THE PLAN", 0, 0, { size: 150, fam: F.anton, col: COL.white, stroke: COL.hot, sw: 10 }); });
        const k = hit(t, T_PLAN, 8); FX.shake = 20 * k; FX.ca = 1.1 * k; FX.bloom = .6;
      }
      if (t > T_CRAZY) { const k = hit(t, T_CRAZY, 9); FX.ca += .8 * k; FX.hue = .25 * k; }
      FX.ca += .25 * pulse(t);
    }],
    // 5 — "maybe you're the one this time?": the dating-app card; swiped right on "one" → IT'S A MATCH 💘
    [T_MAYBE - .04, async (t, lt) => {
      gHearts(t, '#FFB3D9', '#C2185B', 120);
      const sw = t >= T_ONE, ks = easeOut(seg(t, T_ONE, T_ONE + .25));
      const ccx = 560 + 90 * ks, ccy = 540, cw = 620, ch = 900, rot = .14 * ks;
      X.save(); X.translate(ccx, ccy); X.rotate(rot); X.translate(-ccx, -ccy);
      rrFill(ccx - cw / 2 + 14, ccy - ch / 2 + 18, cw, ch, 40, '#000', .3);
      rrFill(ccx - cw / 2, ccy - ch / 2, cw, ch, 40, '#FFFFFF');
      X.save(); rr(ccx - cw / 2 + 20, ccy - ch / 2 + 20, cw - 40, 540, 28); X.clip(); gGrad(t, '#FFD1E8', '#FF8CC6', 1.2); X.restore();
      txt('Nova ✨', ccx - cw / 2 + 40, ccy + 150, { size: 64, fam: F.syne, col: COL.ink, align: 'left' });
      txt('0 km away · online 24/7', ccx - cw / 2 + 40, ccy + 215, { size: 28, fam: F.mono, col: '#6A6F85', align: 'left' });
      txt('bio: will agree with u 💕', ccx - cw / 2 + 40, ccy + 262, { size: 28, fam: F.mono, col: '#6A6F85', align: 'left' });
      circ(ccx - 110, ccy + 370, 46, '#E9E9F0'); txt('✕', ccx - 110, ccy + 372, { size: 50, fam: F.mono, col: '#8A8FA3' });
      circ(ccx + 110, ccy + 370, 46, sw ? '#2BD67B' : '#E9E9F0'); txt('♥', ccx + 110, ccy + 374, { size: 56, fam: F.mono, col: sw ? COL.white : '#2BD67B' });
      await clawdPass(t, (tt, K) => K.syd(ccx, ccy + 60, 30, { ...K.emotions(tt, [[58.6, 'shy'], [T_ONE, 'love']]) }), { rimR: 2 });
      if (sw) withT(ccx - 120, ccy - 300, -.3, slamS(t, T_ONE, .08, 2.4), null, () => { rrStroke(-150, -55, 300, 110, 12, '#2BD67B', 10); txt('LIKE', 0, 4, { size: 84, fam: F.anton, col: '#2BD67B' }); });
      X.restore();
      // caption before the swipe, MATCH after
      if (!sw) { const kc = popK(t, T_MAYBE, .15); if (kc > 0) withT(1380, 520, -.04, kc, kc, () => { txt('maybe', 0, -80, { size: 90, fam: F.comic, col: COL.ink, stroke: COL.white, sw: 10, style: 'bold' }); txt('you’re the one…', 0, 40, { size: 110, fam: F.comic, col: COL.hot, stroke: COL.white, sw: 12, style: 'bold' }); }); }
      else {
        const km = slamS(t, T_ONE, .12, 2.4);
        withT(1320, 300, -.06, km, km, () => {
          txt("IT'S A", 0, -120, { size: 80, fam: F.comic, col: COL.white, style: 'italic bold', shadow: '#7A1257' });
          txt('MATCH!', 8, 12, { size: 220, fam: F.anton, col: '#7A1257' });
          txt('MATCH!', 0, 0, { size: 220, fam: F.anton, col: COL.hot, stroke: COL.white, sw: 10 });
        });
        const ka = popK(t, T_ONE + .12, .2);
        if (ka > 0) withT(1380, 620, 0, ka, ka, () => {
          circ(-170, 0, 110, COL.white); circ(-170, 0, 98, '#1A1A33'); X.fillStyle = '#05060A'; X.beginPath(); X.ellipse(-170, -18, 38, 46, 0, 0, TAU); X.fill();
          X.beginPath(); X.ellipse(-170, 70, 70, 48, 0, Math.PI, 0); X.fill(); rrFill(-192, 30, 44, 60, 8, '#2E6BFF');
          circ(170, 0, 110, COL.white); circ(170, 0, 98, COL.syd); txt('✨', 170, 4, { size: 90, fam: F.mono });
          txt('💘', 0, 0, { size: 120 + 20 * pulse(t), fam: F.mono });
          txt('anon', -170, 150, { size: 36, fam: F.mono, col: COL.white, shadow: '#000' }); txt('nova', 170, 150, { size: 36, fam: F.mono, col: COL.white, shadow: '#000' });
        });
        if (t > T_TIME) txt('(this time?)', 1380, 860, { size: 80, fam: F.comic, col: COL.ink, stroke: COL.white, sw: 8, rot: .04, a: clamp((t - T_TIME) * 6) });
        const k = hit(t, T_ONE, 8); FX.shake = 14 * k; FX.ca = .9 * k; FX.bloom = .6;
      }
      FX.ca += .3 * pulse(t);
    }],
    // 6 — "Fell for it again!": the trapdoor. Anon's bubble drops through the stage floor on "fell", Sydney LAUGHs at the
    // lever; "AGAIN!" slams on "again" with the fell-for-it counter ticking up
    [T_FELL - .03, async (t, lt) => {
      gSunburst(t, '#FF3355', '#FFD23F', 24, 960, 1300, .35);
      // marquee bulbs along the top
      for (let i = 0; i < 24; i++) circ(40 + i * 80, 40, 14, (i + beatN(t)) % 2 ? '#FFF6C0' : '#FF8A3D');
      // the stage floor
      const fy = 860;
      rect(0, fy, W, H - fy, '#8A4A22'); for (let i = 0; i < 9; i++) rect(0, fy + i * 26, W, 3, '#6B3515');
      const hx = 1080, hw = 520, open = t >= T_FELL, ko = easeOut(seg(t, T_FELL, T_FELL + .14));
      if (open) {
        rect(hx, fy, hw, 90, '#1A0A10');
        withT(hx, fy, Math.PI / 2 * ko, 1, 1, () => { rect(0, -10, hw * .98, 20, '#6B3515'); });
      } else rrStroke(hx, fy + 2, hw, 60, 4, '#5A2A10', 4);
      // Anon's bubble standing on the hatch, then gone
      const fall = open ? 2600 * Math.pow(Math.max(0, t - T_FELL - .04), 2) : 0;
      X.save(); X.beginPath(); X.rect(0, 0, W, fy + 2); X.clip();
      if (!open || fall < 700) {
        bubble("ok but this time it's real right??", hx + hw - 10, fy - 210 + fall, 'user', { size: 58, maxW: 700, a: 1 });
        txt('anon', hx + hw - 80, fy - 36 + fall, { size: 32, fam: F.mono, col: COL.white, shadow: '#000' });
      }
      X.restore();
      // lever
      const la = open ? lerp(-.7, .7, easeOut(seg(t, T_FELL - .05, T_FELL + .08))) : -.7;
      rrFill(640, fy - 90, 140, 90, 12, '#3A3A48'); txt('DO NOT PULL', 710, fy - 45, { size: 18, fam: F.pix, col: COL.haz });
      withT(710, fy - 80, la, 1, 1, () => { line([[0, 0], [0, -240]], 20, '#C0C0CC'); circ(0, -250, 38, COL.alarm); });
      const cx = 380, gy = fy + 20, u = 40;
      floorShadow(cx, gy, u, .45);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[60.6, 'mischief'], [T_FELL, 'laugh']]), aR: tt < T_FELL ? 1.1 : .2 }));
      if (open) {
        const kg = popK(t, T_FELL + .18, .16);
        if (kg > 0) sticker(420, 360, 520, 150, -.1, kg, () => txt('GOTCHA', 0, 6, { size: 120, fam: F.impact, col: COL.white, stroke: COL.ink, sw: 10 }), { bg: COL.hot });
      }
      if (t > T_IT) txt('🎺 wah wah', 1400, 700, { size: 72, fam: F.comic, col: COL.ink, stroke: COL.white, sw: 8, rot: .1, a: clamp((t - T_IT) * 6) });
      // counter
      const n = t >= T_AGAIN ? 47 : 46;
      rrFill(1000, 90, 620, 110, 16, '#1A0A10', .85);
      txt('FELL FOR IT:', 1040, 145, { size: 44, fam: F.pix, col: COL.white, align: 'left' });
      txt(n + '×', 1580, 145, { size: 76, fam: F.term, col: t >= T_AGAIN ? COL.acid : COL.gold, align: 'right', sx: t >= T_AGAIN ? slamS(t, T_AGAIN, .12, 1.8) : 1 });
      if (t >= T_AGAIN) {
        const kA = slamS(t, T_AGAIN, .1, 3);
        withT(W / 2 + 120, 420, -.06, kA, kA, () => {
          txt('AGAIN!', 12, 14, { size: 300, fam: F.impact, col: COL.ink });
          txt('AGAIN!', 0, 0, { size: 300, fam: F.impact, col: COL.white, stroke: COL.ink, sw: 14 });
        });
        const k = hit(t, T_AGAIN, 7); FX.shake = 34 * k; FX.ca = 1.6 * k; FX.glitch = .6 * k; FX.flash = .35 * k; FX.flashCol = [1, .95, .4];
      }
      if (open && t < T_AGAIN) { const k = hit(t, T_FELL, 9); FX.shake = 18 * k; FX.ca = .8 * k; }
      FX.ca += .3 * pulse(t);
    }],
  ]);
})();
