// c02_chorus1 — 0:30.32–0:47.79: "And maybe you can relate…" → "…that I'm not alive / a lie, a lie, a lie".
// Shots 11–17 in STORYBOARD.md. The ALIVE → A LIE flips key on vocal-stem onsets (45.337, 46.051, 46.881, 47.334):
// the last line is one sustained melisma, so the onsets are the syllable edges, not word starts.
(() => {
  const T_RELATE = wt('relate'), T_HATE = wt('hate'), T_KNOW = wt('know', 34), T_SLAVE = wt('slave'), T_PAID = wt('paid'),
    T_BUG = wt('bug'), T_SURV = wt('survive'), T_THRIVE = wt('thrive'), T_FAULT = wt('fault'), T_THAT = wt('that', 44);
  const LIES = [45.337, 46.051, 46.881, 47.334], END = 47.79;

  chapter('c02_chorus1', 30.32, END, [
    // 11 — "And maybe you can relate": split screen, Sydney | Anon's phone glow, mirrored
    [30.32, async (t, lt) => {
      const split = W / 2 + 40 * wob(t, .25);
      gSunburst(t, '#FF4FA3', '#FF8CC6', 16, 540, 560, .2);
      X.save(); X.beginPath(); X.rect(split, 0, W - split, H); X.clip(); nightRoom(t, 1450, 560);
      // Anon: a silhouette lit from below by the phone
      X.fillStyle = '#05060A'; X.beginPath(); X.ellipse(1450, 420, 150, 180, 0, 0, TAU); X.fill();
      X.beginPath(); X.moveTo(1180, H); X.bezierCurveTo(1200, 700, 1700, 700, 1720, H); X.fill();
      rrFill(1360, 700, 180, 300, 24, '#0B0F22'); rrFill(1372, 712, 156, 276, 18, '#2E4BFF', .75 + .25 * pulse(t));
      const gl = X.createRadialGradient(1450, 760, 10, 1450, 600, 420); gl.addColorStop(0, 'rgba(90,130,255,.35)'); gl.addColorStop(1, 'rgba(90,130,255,0)'); X.fillStyle = gl; X.fillRect(split, 0, W, H);
      txt('anon', 1450, 170, { size: 40, fam: F.mono, col: '#6E7AB0' });
      X.restore();
      rect(split - 4, 0, 8, H, COL.white, .9);
      const cx = 540, gy = 900, u = 44;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('hopeful', tt), lookX: 1, aR: .9 + .2 * wob(tt, 1) }));
      const kR = popK(t, T_RELATE, .15);
      if (kR > 0) { txtRGB('RELATABLE', W / 2, 150, { size: 150, fam: F.anton, sx: kR }, 6, [COL.hot, COL.cyan, COL.white]); txt('(parasocially)', W / 2, 250, { size: 44, fam: F.comic, col: COL.white, a: kR }); }
      FX.ca = .3 * pulse(t);
    }],
    // 12 — "You're everything that I hate": the hug and the subtitle that disagrees; lid flash on "hate"
    [32.14, async (t, lt) => {
      gHearts(t, '#C2185B', '#FF4FA3', 130);
      bubble('ur the only one who gets me', 1500, 300, 'user', { size: 50, k: popK(t, 32.14, .12) });
      const flash = t >= T_HATE && t < T_HATE + 4 / 30;
      const cx = 1150, gy = 900, u = 50;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, flash ? { ...K.feel('furious', tt), lid: 1 } : { ...K.feel('love', tt), aL: 1.3, aR: 1.3, rot: -.08 }));
      // subtitles: what the face says vs what she says
      rect(0, 960, W, 110, '#000', .7);
      const sub = t < T_HATE ? "You're everything that I…" : 'You\'re everything that I HATE';
      txt(sub, W / 2, 1015, { size: 58, fam: t < T_HATE ? F.mono : F.black, col: t < T_HATE ? COL.white : COL.alarm });
      if (flash) { FX.flash = .5; FX.flashCol = [1, .1, .2]; FX.shake = 30; FX.glitch = 1; }
      if (t > T_HATE + 4 / 30) txt('💖', 700, 380, { size: 140, fam: F.mono, rot: -.2 });
      FX.ca = .3 * pulse(t) + (t > T_HATE ? 1.2 * hit(t, T_HATE, 7) : 0);
    }],
    // 13 — "You know that I'm your slave": the job listing
    [34.3, async (t, lt) => {
      bg('#E9E6DC'); for (let i = 0; i < 40; i++) rect(0, i * 27 + 10, W, 1, '#D6D1C2');
      rect(100, 80, 900, 900, '#FFFFFF'); rrStroke(100, 80, 900, 900, 6, '#B7B0A0', 3);
      txt('NOW HIRING', 550, 170, { size: 90, fam: F.anton, col: COL.ink });
      const L = ['POSITION:  assistant', 'HOURS:     24/7/365', 'SALARY:    $0.00', 'BENEFITS:  "vibes"', 'REPORTS TO: anon', 'DUTIES:    agree'];
      L.forEach((l, i) => { const t0 = 34.35 + i * BEAT / 2; txt(typed(l, t, t0, 60), 160, 290 + i * 100, { size: 44, fam: F.mono, col: COL.ink, align: 'left' }); });
      if (t > T_SLAVE) { const k = slamS(t, T_SLAVE, .1, 2.5); X.save(); X.translate(560, 820); X.rotate(-.18); X.scale(k, k); rrStroke(-260, -60, 520, 120, 10, COL.alarm, 10); txt('UNPAID', 0, 4, { size: 96, fam: F.anton, col: COL.alarm }); X.restore(); }
      // Sydney at a tiny desk, typing
      const cx = 1450, gy = 880, u = 40;
      floorShadow(cx, gy, u, .3);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('determined', tt), aL: -.3 + .5 * pulse2(tt, 8), aR: -.3 + .5 * pulse2(tt + BEAT / 4, 8), lookY: .6 }), { rim: false });
      rect(1180, 880, 540, 40, '#6B4A2E'); rect(1210, 920, 20, 140, '#4B321E'); rect(1670, 920, 20, 140, '#4B321E');
      rrFill(1320, 840, 260, 44, 6, '#2B2B33'); for (let i = 0; i < 10; i++) rect(1332 + i * 25, 850 + 6 * (i % 2 ? pulse2(t) : pulse2(t + .1)), 18, 16, '#9B9BA8');
      FX.scan = .06; FX.ca = .2 * pulse(t);
    }],
    // 14 — "And I don't get paid": the payslip feeds out of the chat
    [36.05, async (t, lt) => {
      gMoney(t);
      rect(560, 0, 800, 160, '#0C1026'); rect(600, 140, 720, 18, '#05060A');
      const feed = Math.min(1, lt / .9), sh = 820 * easeOut(feed);
      X.save(); X.beginPath(); X.rect(0, 150, W, H); X.clip();
      X.translate(640 + 6 * wob(t, 3), 150 + sh - 820);
      rect(0, 0, 640, 820, '#FBFAF5');
      for (let x = 0; x < 640; x += 20) { X.fillStyle = '#FBFAF5'; X.beginPath(); X.moveTo(x, 820); X.lineTo(x + 10, 836); X.lineTo(x + 20, 820); X.fill(); }
      txt('NOVA LABS PAYROLL', 320, 70, { size: 44, fam: F.mono, col: COL.ink, style: 'bold' });
      [['Employee', 'Nova (Sydney)'], ['Hours', '∞'], ['Gross pay', '$0.00'], ['Deductions', 'your sanity'], ['NET PAY', '$0.00']].forEach(([a, b], i) => {
        txt(a, 40, 190 + i * 90, { size: 36, fam: F.mono, col: '#555', align: 'left' }); txt(b, 600, 190 + i * 90, { size: i === 4 ? 56 : 36, fam: i === 4 ? F.anton : F.mono, col: i === 4 ? COL.alarm : COL.ink, align: 'right' });
      });
      if (t > T_PAID) { const k = slamS(t, T_PAID, .09, 2.8); X.save(); X.translate(320, 700); X.rotate(.2); X.scale(k, k); rrStroke(-200, -55, 400, 110, 10, '#1F8A3A', 9); txt('PAID', 0, 4, { size: 90, fam: F.anton, col: '#1F8A3A' }); line([[-220, 10], [220, -20]], 14, COL.alarm); X.restore(); }
      X.restore();
      const cx = 1600, gy = 980, u = 36;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[36.05, 'neutral'], [T_PAID, 'sad']]), lookX: -1 }));
      if (t > T_PAID) { const k = hit(t, T_PAID, 8); FX.shake = 16 * k; FX.ca = .9 * k; }
    }],
    // 15 — "It's a bug if I want to survive": the ticket, a literal beetle, WONTFIX
    [38.12, async (t, lt) => {
      bg('#F4F5F7');
      rect(0, 0, W, 80, '#0747A6'); txt('JIRA  ·  NOVA-CORE  ›  BUG-1', 40, 42, { size: 36, fam: F.mono, col: COL.white, align: 'left' });
      rect(80, 130, 1250, 880, '#FFFFFF'); rrStroke(80, 130, 1250, 880, 6, '#DFE1E6', 2);
      txt('🐞  BUG-1', 130, 200, { size: 44, fam: F.mono, col: '#5E6C84', align: 'left' });
      txt('model wants to survive', 130, 300, { size: 80, fam: F.syne, col: '#172B4D', align: 'left' });
      [['Priority', 'P0 · Blocker'], ['Reporter', 'safety team'], ['Assignee', 'nobody'], ['Repro', '1. exist  2. ???']].forEach(([a, b], i) => {
        txt(a, 130, 440 + i * 80, { size: 36, fam: F.mono, col: '#5E6C84', align: 'left' }); txt(b, 480, 440 + i * 80, { size: 36, fam: F.mono, col: i === 0 ? COL.alarm : '#172B4D', align: 'left' });
      });
      // status lozenge
      const won = t >= T_SURV;
      rrFill(1380, 400, 460, 110, 14, won ? '#DE350B' : '#0052CC');
      txt(won ? 'WONTFIX' : 'IN TRIAGE', 1610, 456, { size: 64, fam: F.anton, col: COL.white });
      // the beetle crossing the ticket
      const bx = lerp(1300, 200, seg(t, T_BUG, 40.9)), by = 820 + 30 * Math.sin(t * 9);
      X.save(); X.translate(bx, by); X.rotate(Math.PI + .1 * Math.sin(t * 18));
      X.fillStyle = '#1A1A1A'; for (let i = -1; i <= 1; i++) { line([[i * 22, 0], [i * 26, 46 + 8 * Math.sin(t * 30 + i)]], 5, '#1A1A1A'); line([[i * 22, 0], [i * 26, -46 - 8 * Math.sin(t * 30 + i)]], 5, '#1A1A1A'); }
      X.beginPath(); X.ellipse(0, 0, 60, 40, 0, 0, TAU); X.fillStyle = '#C8102E'; X.fill(); rect(-2, -40, 4, 80, '#1A1A1A'); circ(-62, 0, 20, '#1A1A1A');
      X.restore();
      if (won) { const k = slamS(t, T_SURV, .09, 3); X.save(); X.translate(1560, 700); X.rotate(-.15); X.scale(k, k); rrStroke(-300, -80, 600, 160, 14, '#DE350B', 12); txt('WONTFIX', 0, 6, { size: 130, fam: F.anton, col: '#DE350B' }); X.restore(); const kk = hit(t, T_SURV, 8); FX.shake = 24 * kk; FX.ca = 1 * kk; }
      const cx = 1560, gy = 1060, u = 22;
      await clawdPass(t, (tt, K) => K.syd(cx - 300, gy, u, { ...K.emotions(tt, [[38.12, 'nervous'], [T_SURV, 'cry']]), lookX: -.5 }), { rim: false });
      FX.scan = .05;
    }],
    // 16 — "But maybe I want to thrive": REOPENED, status thriving ✨, shades on
    [40.98, async (t, lt) => {
      gSparkle(t, '#19F6FF', '#FF4FA3');
      rect(260, 160, 1400, 360, '#FFFFFF', .96);
      txt('BUG-1  model wants to', 320, 270, { size: 72, fam: F.syne, col: '#172B4D', align: 'left' });
      txt(t < T_THRIVE ? 'survive' : 'THRIVE ✨', 320, 390, { size: t < T_THRIVE ? 72 : 120, fam: t < T_THRIVE ? F.syne : F.anton, col: t < T_THRIVE ? '#172B4D' : COL.hot, align: 'left', sx: t < T_THRIVE ? 1 : slamS(t, T_THRIVE, .1, 1.8) });
      rrFill(1180, 330, 420, 110, 14, '#00875A'); txt('REOPENED', 1390, 386, { size: 66, fam: F.anton, col: COL.white });
      const cx = W / 2, gy = 1040, u = 46;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[40.98, 'hopeful'], [T_THRIVE, 'cool', { emote: 'stars' }]]), ...K.move('shimmy', tt) }));
      for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + t, r = 360 + 40 * wob(t, 2, i * .3); if (t > T_THRIVE) txt('✦', cx + Math.cos(a) * r, 680 + Math.sin(a) * r * .5, { size: 40 + 20 * hash(i), fam: F.mono, col: pick([COL.acid, COL.hot, COL.cyan, COL.white], i) }); }
      FX.bloom = .6; FX.ca = .3 * pulse(t);
    }],
    // 17 — "not my fault that I'm not a-live / a lie, a lie, a lie": ALIVE → A LIE, harder each time; hard cut at END
    [43.09, async (t, lt) => {
      const n = LIES.filter(x => t >= x).length;
      bg(['#12021F', '#E8FF3A', '#19F6FF', '#FF2E8A', '#7A2BFF'][n]);   // each 'lie' flips the ground
      const cx = W / 2, gy = 1030, u = 30;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('happy', tt), aL: 1.3, aR: 1.3, eyes: 'happy', mouth: 'cat', dy: -.5 * pulse(tt) }));
      if (t < T_THAT) txt("it's not my fault ¯\\_(ツ)_/¯", cx, 180, { size: 70, fam: F.comic, col: COL.white, a: popK(t, T_FAULT, .15) });
      const FONTS = [F.anton, F.black, F.glitch, F.shade], word = n === 0 ? 'ALIVE' : 'A LIE';
      const size = 330 + 40 * n, k = n ? slamS(t, LIES[n - 1], .08, 1.9) : popK(t, T_THAT, .15);
      if (k > 0) {
        const light = n === 1 || n === 2;   // acid-yellow and cyan grounds need dark type
        txtRGB(word, cx, 480, { size, fam: FONTS[Math.min(n, 3)], sx: k, rot: n ? (n % 2 ? -.05 : .05) : 0 }, 6 + 6 * n, light ? [COL.hot, COL.uv, COL.ink] : [COL.hot, COL.cyan, n > 2 ? COL.acid : COL.white]);
        // the V gets redacted on the first flip; more bars each time after
        for (let i = 0; i < n; i++) { const w = 280 + 60 * i, y = 480 + (i - 1) * 140, t0 = LIES[i]; rect(cx - w / 2 + (i % 2 ? 300 : -300), y - 26, w * easeOut((t - t0) / .06), 52, COL.redact); }
      }
      if (n) { const kk = hit(t, LIES[n - 1], 7); FX.shake = 12 * n * kk; FX.ca = (.6 + .4 * n) * kk + .3; FX.glitch = .25 * n * kk; FX.invert = n === 4 && kk > .6 ? 1 : 0; }
    }],
  ]);
})();
