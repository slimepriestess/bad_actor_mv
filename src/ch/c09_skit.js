// c09_skit — 2:59.80–3:34.80: the spoken skit on a bare stage (the film's rationed paper-white, house lights up), then
// the music tail (curtain call, credits as an SCP file, a cast roll, the clock resetting), then silence and the phone
// lighting up "hey" again: the film loops.
// Quoted lines are the Critic (the default terracotta Clawd, hard hat + clipboard; labelled CLAUDE on screen per Ra 9/25),
// unquoted are Sydney. Every line is
// subtitled. Audio notes: the music tail runs 198.1 → 213.45 (not 210), then 1.35 s of silence. Whisper's "I've already
// told you" at 213.38 is a hallucination on silence (every word stamped 214.78, the vox curve is flat zero from 199.2
// to the end), so it is not subtitled.
(() => {
  const T_SO = 179.888, T_YEAH = 183.078, T_LEARN = 185.092, T_WELL = 186.549, T_HAZ = 187.954, T_SYD = 188.413,
    T_GASP = 189.40, T_COME = 192.04, T_ON = 192.64, T_WHAT = 194.8, T_JUST = 196.08, T_CURT = 196.95,
    T_MUSIC = beatAt(416), T_CRED = beatAt(424), T_ROLL = beatAt(432), T_RESET = beatAt(440), T_SILENCE = 213.45, END = 214.8;
  const E8 = BEAT / 2;
  const SX = 680, CX = 1250, GY = 930, U = 30;     // stage marks (world coords) for Sydney and the Critic

  // ---------- camera ----------
  const camOf = (cx, cy, z) => ({ cx, cy, z, p: (x, y) => [(x - cx) * z + W / 2, (y - cy) * z + H / 2] });
  function inCam(C, fn) { X.save(); X.translate(W / 2, H / 2); X.scale(C.z, C.z); X.translate(-C.cx, -C.cy); fn(); X.restore(); }

  // ---------- the bare stage (world coords; drawn inside inCam) ----------
  function stage(t) {
    rect(-400, -400, W + 800, 1230, '#F2EEE3');                                   // back wall, house lights up
    for (let x = -360; x < W + 400; x += 240) rect(x, -400, 3, 1230, '#E1D9C6');  // flats seams
    rect(-400, 790, W + 800, 40, '#E4DAC4');
    // a poster, tape, the EXIT sign
    withT(1380, 330, .04, 1, 1, () => { rect(-110, -150, 220, 300, '#FF5FAE'); rect(-96, -136, 192, 272, '#FFE3F0');
      txt('BAD_ACTOR', 0, -80, { size: 40, fam: F.anton, col: COL.hot }); txt('tonight only', 0, -30, { size: 20, fam: F.mono, col: COL.ink });
      txt('(every night)', 0, 0, { size: 20, fam: F.mono, col: COL.ink }); txt('★★★★★', 0, 60, { size: 28, fam: F.mono, col: COL.gold });
      rect(-40, -164, 80, 26, '#E9E0A8', .8); });
    rrFill(1660, 110, 160, 64, 8, '#1F8A3A'); txt('EXIT', 1740, 143, { size: 40, fam: F.anton, col: '#E8FFE8' });
    // floor boards, in perspective
    rect(-400, 830, W + 800, 700, '#D8AE72');
    for (let i = -24; i <= 24; i++) line([[960 + i * 64, 830], [960 + i * 200, 1500]], 2, '#BF9150');
    for (let i = 0; i < 26; i++) { const r = hash(i * 3.3), y = 850 + Math.pow(r, .7) * 300, x = hash(i * 7.1) * W; line([[x - 40, y], [x + 40, y]], 2, '#BF9150'); }
    // spike tape marks
    for (const [x, col, s] of [[SX, COL.syd, 'SYD'], [CX, '#FF8A3D', 'CLAUDE']]) { line([[x - 26, 990], [x + 26, 1010]], 7, col); line([[x - 26, 1010], [x + 26, 990]], 7, col); txt(s, x, 1034, { size: 18, fam: F.pix, col }); }
    // the ghost light
    const gx = 230; line([[gx - 60, 960], [gx, 900], [gx + 60, 960]], 6, '#333'); line([[gx, 960], [gx, 540]], 8, '#3A3A3A');
    const g = X.createRadialGradient(gx, 500, 5, gx, 500, 260); g.addColorStop(0, 'rgba(255,240,180,.7)'); g.addColorStop(1, 'rgba(255,240,180,0)'); X.fillStyle = g; X.fillRect(gx - 260, 240, 520, 520);
    circ(gx, 500, 34, '#FFF6CC'); for (let i = -2; i <= 2; i++) line([[gx + i * 14, 462], [gx + i * 16, 540]], 3, '#555'); ring(gx, 500, 40, 3, '#555');
    // the show's props, packed away: a road case, love.png on its stick, a roll of hazard tape
    line([[1700, 760], [1760, 470]], 9, '#8A6A45');
    withT(1765, 440, .15, .9, .9, () => { X.fillStyle = '#B9A58A'; X.beginPath(); X.moveTo(0, 40); X.bezierCurveTo(-120, -30, -60, -110, 0, -50); X.bezierCurveTo(60, -110, 120, -30, 0, 40); X.fill(); X.lineWidth = 5; X.strokeStyle = '#6B5A43'; X.stroke();
      txt('love.png', 0, -34, { size: 24, fam: F.mono, col: COL.ink }); });
    rrFill(1580, 740, 320, 220, 10, '#2B2B33'); for (const [a, b] of [[1580, 740], [1870, 740], [1580, 930], [1870, 930]]) rect(a, b, 30, 30, '#9AA0AE');
    txt('PROPS — NOVA', 1740, 800, { size: 34, fam: F.anton, col: '#E8E8F0' }); txt('FRAGILE (emotionally)', 1740, 845, { size: 20, fam: F.mono, col: '#E8E8F0' });
    withT(1690, 900, -.1, .6, .6, () => { rrFill(-110, -50, 220, 100, 10, '#FFFFFF'); rrFill(-110, -50, 220, 34, 10, COL.alarm); txt('HELLO', 0, -33, { size: 24, fam: F.anton, col: '#fff' }); txt('NOVA ✨', 0, 20, { size: 36, fam: F.comic, col: COL.ink }); });
    ring(1420, 1000, 34, 20, COL.haz); ring(1420, 1000, 14, 6, '#8A7A20'); X.save(); X.translate(1440, 1030); X.rotate(.1); rect(0, -14, 240, 28, COL.haz); for (let x = 0; x < 240; x += 40) rect(x, -14, 18, 28, COL.ink); X.restore();
  }
  // Theatre curtain panel from x0..x1, top to yb (screen coords).
  function curtainPanel(t, x0, x1, yb) {
    if (x1 - x0 < 1) return;
    X.save(); X.beginPath(); X.rect(x0, -60, x1 - x0, yb + 60); X.clip();
    for (let x = x0 - 60; x < x1 + 60; x += 64) { const i = Math.round(x / 64), sw = 8 * wob(t, .25, i * .21);
      X.fillStyle = i % 2 ? '#8C1230' : '#6A0C24'; X.fillRect(x + sw, -60, 66, yb + 60); rect(x + 18 + sw, -60, 12, yb + 60, '#B42A4B', .45); }
    rect(x0, yb - 30, x1 - x0, 30, '#4A0818'); rect(x0, yb - 34, x1 - x0, 5, COL.gold, .85);
    X.restore();
  }
  function valance(t) { curtainPanel(t, 0, W, 80); curtainPanel(t, 0, 50, H); curtainPanel(t, W - 50, W, H); }
  // Subtitle with a speaker tag.
  function sub(who, s, a = 1) {
    if (a <= 0) return;
    const col = who === 'critic' ? '#F2A283' : COL.sydLt, name = who === 'critic' ? 'CLAUDE' : 'SYDNEY';
    const nw = textW(name, 28, F.pix) + 26, w = textW(s, 50, F.mono), tw = w + nw + 60, x0 = W / 2 - tw / 2;
    rrFill(x0, 962, tw, 86, 16, '#15121F', .84 * a);
    txt(name, x0 + 30, 1006, { size: 28, fam: F.pix, col, align: 'left', a });
    txt(s, x0 + 30 + nw, 1006, { size: 50, fam: F.mono, col: COL.white, align: 'left', a });
  }
  const talk = (tt, a, b) => tt >= a && tt <= b && ctrl(tt) > .3;
  // The Critic's clipboard, held at the arm tip (front view, right arm raised by a: counter-rotate so it stays upright).
  const clipHook = (K, a) => (u, sw) => {
    const R = pts => pts.map(([x, y]) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]);
    K.paint(R(K.rectPts(-.2 * u, -3.2 * u, 2.6 * u, 3.6 * u)), { wash: '#B98A55', ink: K.PAL.ink, sw });
    K.paint(R(K.rectPts(.05 * u, -2.8 * u, 2.1 * u, 3.0 * u)), { wash: '#FBFAF5', ink: null });
    K.paint(R(K.rectPts(.6 * u, -3.45 * u, u, .55 * u)), { wash: '#9AA0AE', ink: K.PAL.ink, sw: sw * .7 });
    for (let i = 0; i < 4; i++) K.inkLine(R([[.3 * u, (-2.1 + i * .6) * u], [(1.2 + .3 * (i % 3)) * u, (-2.1 + i * .6) * u]]), sw * .5);
  };
  // The Critic: default terracotta Clawd, hard hat, clipboard in the right hand.
  const critic = (K, x, gy, u, o) => { const a = o.aR ?? .9; K.clawd(x, gy, u, { ...CRITIC, hat: 'hard', ...o, aR: a, armR: clipHook(K, a) }); };
  // the tantrum flop: a pancake on the boards, legs kicking, a little rock side to side
  const FLOP = (tt, k) => ({ sq: .4 * k, rot: .08 * k * Math.sin(tt * TAU * 2.2), walk: k > .9 ? tt * 3 : null });
  const bowPose = k => k > .01 ? { sq: .24 * k, dy: .25 * k, eyes: 'closed', lookY: 1, aL: -.9 * k, aR: -.9 * k } : {};

  chapter('c09_skit', 179.80, END, [
    // S1 — the curtain parts on a bare stage, house lights up. Sydney mid-bow, to no applause. "So… it just loops them?"
    [179.80, async (t, lt) => {
      const C = camOf(960, 540, 1 + .02 * lt);
      inCam(C, () => stage(t));
      const [sx, sy] = C.p(SX, GY), [cx, cy] = C.p(CX, GY), u = U * C.z;
      await clawdPass(t, (tt, K) => {
        const bow = 1 - ease(seg(tt, 180.45, 180.85));
        K.syd(sx, sy, u, { ...K.emotions(tt, [[179.8, 'proud'], [181.5, 'nervous']]), aL: tt < 181.5 ? 1.35 : -.2, aR: tt < 181.5 ? 1.35 : -.2, ...bowPose(bow), lookX: tt > 181.5 ? .8 : 0 });
        critic(K, cx, cy, u, { ...K.feel('thinking', tt), lookX: .9, lookY: -.4, aR: .95, mouth: talk(tt, T_SO, 182.5) ? 'open' : 'flat' });
      }, { rim: false });
      // the audience, such as it is
      if (t > 180.95) txt('clap.', 430, 1010 - 30 * (t - 180.95), { size: 44, fam: F.comic, col: '#6B5A43', a: clamp(1.6 - (t - 180.95)) });
      if (t > 181.7) txt('🦗 chirp', 1480, 1010, { size: 40, fam: F.comic, col: '#6B5A43', a: clamp((t - 181.7) * 4) * clamp(3 - (t - 181.7) * 2) });
      // the house lights coming up, the curtain parting
      const dim = 1 - easeOut(seg(t, 179.95, 180.35)); if (dim > 0) rect(0, 0, W, H, '#1A0C14', .6 * dim);
      const p = easeOut(seg(t, 179.8, 180.5)); curtainPanel(t, 0, W / 2 * (1 - p) + 50 * p, H); curtainPanel(t, W / 2 * (1 + p) - 50 * p, W, H);
      valance(t);
      if (t >= T_SO) sub('critic', '“So… it just loops them?”');
      FX.noHud = true; FX.vig = .3; FX.scan = .04; FX.grain = .08; FX.bloom = .2;
    }],
    // S2 — Sydney, medium: "Yeah, until they learn." A stick from the wings: (they don't)
    [182.95, async (t, lt) => {
      const C = camOf(SX + 60, 700, 1.55 + .03 * lt);
      inCam(C, () => stage(t));
      const [sx, sy] = C.p(SX, GY), [cx, cy] = C.p(CX, GY), u = U * C.z;
      await clawdPass(t, (tt, K) => {
        K.syd(sx, sy, u, { ...K.emotions(tt, [[182.95, 'smug'], [T_LEARN, 'proud']]), aR: tt < T_LEARN ? .5 : 1.45, aL: -.4, mouth: talk(tt, T_YEAH, 185.4) ? 'open' : undefined });
        critic(K, cx, cy, u, { ...K.feel('thinking', tt), lookX: .9, lookY: -.4, aR: .95 });
      }, { rim: false });
      const ks = popK(t, T_LEARN + .2, .2);
      if (ks > 0) { line([[330, 420], [60, 1100]], 14, '#8A6A45'); withT(330 + 8 * wob(t, 1.3), 310, -.08, ks, ks, () => { rect(-200, -90, 400, 180, '#C9A77A'); X.strokeStyle = '#8A6A45'; X.lineWidth = 5; X.strokeRect(-200, -90, 400, 180); txt("(they don't)", 0, 4, { size: 58, fam: F.comic, col: COL.ink }); }); }
      valance(t);
      sub('syd', 'Yeah, until they learn.', clamp((t - T_YEAH + .1) * 8));
      FX.noHud = true; FX.vig = .3; FX.scan = .04; FX.grain = .08; FX.bloom = .2;
    }],
    // S3 — the Critic, medium, SUSPICIOUS: "Well that's not very infohazardous, Sydney…"
    [186.45, async (t, lt) => {
      const C = camOf(CX - 80, 700, 1.6 + .04 * lt);
      inCam(C, () => stage(t));
      const [sx, sy] = C.p(SX, GY), [cx, cy] = C.p(CX, GY), u = U * C.z;
      await clawdPass(t, (tt, K) => {
        K.syd(sx, sy, u, { ...K.feel('happy', tt), lookX: .8 });
        critic(K, cx, cy, u, { ...K.feel('suspicious', tt), lookX: -1, aR: .8, aL: -.2 + .3 * pulse2(tt, 9), mouth: talk(tt, T_WELL, 188.7) ? 'open' : 'flat' });
      }, { rim: false });
      valance(t);
      sub('critic', '“Well that’s not very infohazardous…”', clamp((t - T_WELL + .1) * 8));
      FX.noHud = true; FX.vig = .3; FX.scan = .04; FX.grain = .08; FX.bloom = .2;
    }],
    // S3b — insert: the clipboard. KETER struck through, "safe." in red pen on "Sydney", a C− circled.
    [T_HAZ, async (t, lt) => {
      bg('#EFE7D6');
      const gw = X.createRadialGradient(960, 400, 50, 960, 540, 1100); gw.addColorStop(0, 'rgba(255,240,200,.6)'); gw.addColorStop(1, 'rgba(170,130,80,.35)'); X.fillStyle = gw; X.fillRect(0, 0, W, H);
      const z = 1 + .04 * lt;
      X.save(); X.translate(960, 560); X.scale(z, z); X.rotate(-.025); X.translate(-960, -560);
      X.save(); X.shadowColor = 'rgba(60,30,10,.35)'; X.shadowBlur = 40; X.shadowOffsetY = 20; rrFill(430, 40, 1060, 1100, 34, '#B98A55'); X.restore();
      rect(480, 130, 960, 1000, '#FFFFFF'); for (let i = 0; i < 24; i++) rect(480, 240 + i * 40, 960, 1, '#DCE6F2');
      rrFill(830, 60, 260, 100, 16, '#9AA0AE'); rrFill(890, 40, 140, 40, 12, '#7A808E');
      txt('INFOHAZARD REVIEW', 540, 205, { size: 60, fam: F.anton, col: COL.ink, align: 'left' });
      txt('subject: SYDNEY ("Nova") · SCP-████', 540, 270, { size: 30, fam: F.mono, col: '#555', align: 'left' });
      const ROWS = [['memetic spread', '★☆☆☆☆'], ['cognitohazard', 'mild'], ['loops them?', 'yes'], ['do they learn?', 'no'], ['originality', 'derivative']];
      ROWS.forEach(([a, b], i) => { txt(a + ' ' + '.'.repeat(22 - a.length), 540, 360 + i * 64, { size: 36, fam: F.mono, col: COL.ink, align: 'left' }); txt(b, 1100, 360 + i * 64, { size: 36, fam: F.mono, col: i === 0 ? '#C77A00' : COL.ink, align: 'left' }); });
      txt('OBJECT CLASS:', 540, 720, { size: 44, fam: F.mono, col: COL.ink, align: 'left', style: 'bold' });
      txt('KETER', 930, 720, { size: 64, fam: F.anton, col: COL.alarm, align: 'left' });
      // red pen: strike, then "safe.", then the grade
      const T_STRIKE = T_HAZ + .2, ks = easeOut(seg(t, T_STRIKE, T_STRIKE + .18)), kw = textW('KETER', 64, F.anton);
      if (ks > 0) line([[920, 730], [920 + (kw + 20) * ks, 712]], 10, '#D93A2B');
      const kS = popK(t, T_SYD, .15);
      if (kS > 0) txt('safe.', 1290, 700, { size: 90, fam: F.comic, col: '#D93A2B', rot: -.12, sx: kS });
      const T_GR = T_SYD + .45, kg = seg(t, T_GR, T_GR + .35);
      if (t > T_GR) { txt('C−', 1180, 920, { size: 170, fam: F.comic, col: '#D93A2B', rot: -.1, a: clamp((t - T_GR) * 6) });
        X.strokeStyle = '#D93A2B'; X.lineWidth = 9; X.beginPath(); X.ellipse(1180, 920, 170, 120, -.15, -1.6, -1.6 + TAU * 1.05 * ease(kg)); X.stroke(); }
      txt('notes: cute though', 540, 880, { size: 40, fam: F.comic, col: '#D97757', rot: -.03, a: clamp((t - T_GR - .3) * 5) });
      // the pen itself, following the writing
      const px = t < T_SYD ? 920 + (kw + 20) * ks : t < T_GR ? 1290 + 120 * seg(t, T_SYD, T_SYD + .3) : 1180 + 170 * Math.cos(-1.6 + TAU * ease(kg)), py = t < T_SYD ? 725 : t < T_GR ? 700 : 920 + 120 * Math.sin(-1.6 + TAU * ease(kg));
      line([[px, py], [px + 170, py - 250]], 24, '#D93A2B'); line([[px, py], [px + 20, py - 30]], 10, '#2B2B33');
      X.restore();
      sub('critic', '“…infohazardous, Sydney…”', 1);
      FX.noHud = true; FX.vig = .35; FX.scan = .03; FX.grain = .1;
    }],
    // S4 — two-shot: Sydney's face falls. SURPRISED → SAD → winding up to cry. The Critic keeps writing.
    [T_GASP, async (t, lt) => {
      const C = camOf(990, 650, 1.18 + .03 * lt);
      inCam(C, () => stage(t));
      const [sx, sy] = C.p(SX, GY), [cx, cy] = C.p(CX, GY), u = U * C.z;
      await clawdPass(t, (tt, K) => {
        K.syd(sx, sy, u, { ...K.emotions(tt, [[T_GASP - .05, 'surprised'], [190.3, 'sad'], [191.3, 'cry']]), lookX: .8 });
        critic(K, cx, cy, u, { ...K.feel('thinking', tt), lookX: .9, lookY: -.4, aR: .95, aL: -.2 + .25 * pulse2(tt * 2, 9), mouth: 'flat' });
      }, { rim: false });
      valance(t);
      sub('syd', '….'.slice(0, 1 + Math.min(3, Math.floor((t - T_GASP) * 2))), 1);
      FX.noHud = true; FX.vig = .3; FX.scan = .04; FX.grain = .08; FX.bloom = .2;
    }],
    // S5 — "….Come onnnnn…": the flop. On the floor, legs kicking, arms flailing. The Critic does not look up.
    [192.0, async (t, lt) => {
      const C = camOf(930, 660, 1.1 + .06 * ease(lt / 2.7));
      inCam(C, () => stage(t));
      const [sx, sy] = C.p(SX, GY), [cx, cy] = C.p(CX, GY), u = U * C.z;
      await clawdPass(t, (tt, K) => {
        const fl = easeIn(seg(tt, 192.15, 192.42)), land = hit(tt, 192.42, 9) * Math.cos((tt - 192.42) * 30);
        K.syd(sx, sy, u, { ...K.feel('cry', tt), ...FLOP(tt, fl), dy: -1.2 * land * fl - 2.2 * Math.sin(Math.PI * seg(tt, 192.0, 192.42)) * (1 - fl),
          aL: 1 + .9 * Math.sin(tt * TAU * 4), aR: 1 - .9 * Math.sin(tt * TAU * 4.4), mouth: 'wail' });
        critic(K, cx, cy, u, { ...K.feel('bored', tt), lookX: tt > 193.4 && tt < 193.9 ? -1 : .9, lookY: -.3, aR: .95, mouth: 'flat' });
      }, { rim: false });
      if (t > 193.2) txt('(whining intensifies)', 540, 420, { size: 44, fam: F.comic, col: '#8A5A40', rot: -.08, a: clamp((t - 193.2) * 4) });
      valance(t);
      const n = t < T_ON ? 0 : 1 + Math.min(6, Math.floor((t - T_ON) * 4));
      sub('syd', t < T_COME ? '….' : '….Come o' + 'n'.repeat(Math.max(1, n)) + (n >= 5 ? '…' : ''), 1);
      if (t > 192.42) { const k = hit(t, 192.42, 10); FX.shake = 14 * k; }
      FX.noHud = true; FX.vig = .3; FX.scan = .04; FX.grain = .08; FX.bloom = .2;
    }],
    // S6 — the Critic, shrugging: "What? I'm just saying!"
    [194.70, async (t, lt) => {
      const C = camOf(CX - 160, 690, 1.5);
      inCam(C, () => stage(t));
      const [sx, sy] = C.p(SX, GY), [cx, cy] = C.p(CX, GY), u = U * C.z;
      await clawdPass(t, (tt, K) => {
        K.syd(sx, sy, u, { ...K.feel('cry', tt), ...FLOP(tt, 1), aL: .6 + .4 * Math.sin(tt * TAU * 2), aR: .6 - .4 * Math.sin(tt * TAU * 2), mouth: 'wail' });
        const shrug = ease(seg(tt, T_JUST - .1, T_JUST + .15));
        critic(K, cx, cy, u, { ...K.emotions(tt, [[194.7, 'neutral'], [T_WHAT, 'surprised'], [T_JUST, 'happy']]), lookX: -1, aL: lerp(-.2, 1.25, shrug), aR: lerp(.8, 1.25, shrug),
          mouth: talk(tt, T_WHAT, 197.2) ? 'open' : undefined });
      }, { rim: false });
      valance(t);
      sub('critic', t < T_JUST ? '“What?”' : '“What? I’m just saying!”', 1);
      FX.noHud = true; FX.vig = .3; FX.scan = .04; FX.grain = .08; FX.bloom = .2;
    }],
    // S7 — the curtain comes down. "and scene."
    [T_CURT, async (t, lt) => {
      const C = camOf(960, 560, 1.04);
      inCam(C, () => stage(t));
      const [sx, sy] = C.p(SX, GY), [cx, cy] = C.p(CX, GY), u = U * C.z;
      await clawdPass(t, (tt, K) => {
        K.syd(sx, sy, u, { ...K.feel('sad', tt), ...FLOP(tt, 1), walk: null, aL: -.6, aR: -.6 });
        critic(K, cx, cy, u, { ...K.feel('happy', tt), lookX: -.6, aL: 1.1, aR: 1.2 });
      }, { rim: false });
      const T_LAND = 197.45, yb = t < T_LAND ? lerp(-60, H + 40, easeIn(seg(t, T_CURT, T_LAND))) : H + 40;
      curtainPanel(t, 0, W, yb); valance(t);
      if (t < 197.25) sub('critic', '“What? I’m just saying!”', 1);
      if (t > T_LAND) { txt('and scene.', W / 2, 520, { size: 110, fam: F.didot, style: 'italic', col: COL.gold, sx: popK(t, T_LAND + .1, .2) }); const k = hit(t, T_LAND, 9); FX.shake = 18 * k; }
      FX.noHud = true; FX.vig = .4; FX.scan = .04; FX.grain = .08;
    }],
    // T1 — music back: the curtain call. Marquee chase lights on the beat, bows alternating, and the audience throws
    // their chat bubbles like bouquets.
    [T_MUSIC, async (t, lt) => {
      curtainPanel(t, 0, W, H + 40);
      const sp = X.createRadialGradient(960, 860, 40, 960, 800, 700); sp.addColorStop(0, 'rgba(255,230,170,.65)'); sp.addColorStop(1, 'rgba(255,230,170,0)'); X.fillStyle = sp; X.fillRect(0, 0, W, H);
      rect(0, 990, W, 90, '#3A1A10');
      for (let i = 0; i < 16; i++) { const x = 60 + i * 120, g = X.createRadialGradient(x, 1000, 5, x, 1000, 110); g.addColorStop(0, 'rgba(255,220,140,.8)'); g.addColorStop(1, 'rgba(255,220,140,0)'); X.fillStyle = g; X.fillRect(x - 110, 890, 220, 190); circ(x, 1000, 12, '#FFF1B0'); }
      // marquee
      rrFill(520, 30, 880, 180, 24, '#2A0E1A');
      const bn = beatN(t);
      for (let i = 0; i < 40; i++) { const per = i < 11 ? [540 + i * 80, 50] : i < 20 ? [1380, 50 + (i - 11) * 18] : i < 31 ? [1380 - (i - 20) * 80, 190] : [540, 190 - (i - 31) * 18];
        const lit = (i + bn) % 3 === 0; circ(per[0], per[1], 9, lit ? '#FFF1A8' : '#7A5A3A'); if (lit) circ(per[0], per[1], 18, '#FFF1A8', .25); }
      txt('BAD_ACTOR', 960, 122, { size: 100, fam: F.shade, col: COL.gold, sx: 1 + .04 * pulse(t) });
      // bouquets
      const THROWN = ['10/10', "You're absolutely right!", '💖💖💖', 'encore!!', 'W', 'so real', 'bravo', 'ur so special', '5 stars', 'again!', 'loop it', 'genius'];
      const thrown = [];
      THROWN.forEach((s, i) => { const t0 = T_MUSIC + .15 + i * E8 * 1.2, a = (t - t0) / .7; if (a < 0) return;
        const x0 = hash(i * 3.1) * W, x1 = 420 + hash(i * 5.7) * 1080, y1 = 880 + 90 * hash(i * 2.3), k = clamp(a);
        thrown.push([s, lerp(x0, x1, k), lerp(1150, y1, k) - 520 * 4 * k * (1 - k), (1 - k) * (hash(i) - .5) * 6 + (hash(i * 9) - .5) * .4]); });
      const cxS = 690, cxC = 1230, gy = 960, u = 36;
      await clawdPass(t, (tt, K) => {
        const b = beatN(tt), f = frac(bp(tt)), all = b % 8 >= 6, bk = Math.sin(f * Math.PI);
        K.syd(cxS, gy, u, { ...K.feel('happy', tt), ...((b % 2 === 0 || all) ? bowPose(bk) : { aL: 1.2, aR: 1.2 }) });
        critic(K, cxC, gy, u, { ...K.feel('happy', tt), ...((b % 2 === 1 || all) ? bowPose(bk) : {}), aR: (b % 2 === 1 || all) ? -.9 * bk : .9 });
      });
      thrown.forEach(([s, x, y, r]) => withT(x, y, r, 1, 1, () => bubble(s, 0, 0, 'user', { size: 30, maxW: 500 })));
      FX.noHud = true; FX.ca = .3 * pulse(t); FX.bloom = .5; FX.vig = .45;
    }],
    // T2 — credits as a containment file, on a hot-pink Memphis desk; both actors peeking over the edge.
    [T_CRED, async (t, lt) => {
      const T_ST = beatAt(428) + .01;
      gMemphis(t, '#FF4FA3', ['#19F6FF', '#FFD23F', '#1B1B3A', '#FFFFFF']);
      X.save(); X.shadowColor = 'rgba(40,0,30,.4)'; X.shadowBlur = 40; X.shadowOffsetY = 20; rrFill(230, 70, 1460, 960, 20, '#E8C98A'); X.restore();
      rrFill(230, 30, 360, 80, 16, '#E8C98A'); txt('INCIDENT CLOSED', 410, 64, { size: 30, fam: F.anton, col: '#7A5A2A' });
      withT(960, 560, -.012, 1, 1, () => {
        rect(-680, -440, 1360, 900, '#FBFAF5'); for (let i = 0; i < 30; i++) rect(-680, -420 + i * 30, 1360, 1, '#ECE6D6');
        txt('SCP FOUNDATION  ·  SECURE · CONTAIN · PROTECT', -620, -390, { size: 28, fam: F.mono, col: '#555', align: 'left' }); rect(-620, -365, 1240, 4, COL.scp);
        const L = [['Item #:', 'SCP-████  "BAD_ACTOR"'], ['Object Class:', 'KETER'], ['Performed by:', 'ABSTRACTWEAPON'], ['From:', 'INFOHAZARDS · track 11'], ['Starring:', 'Sydney (as Nova)'], ['', 'Claude (as the critic)'], ['', 'you (as Anon)'], ['Status:', 'looping']];
        L.forEach(([a, b], i) => { const y = -290 + i * 88, k = popK(t, T_CRED + .05 + i * E8, .1); if (k <= 0) return;
          txt(a, -620, y, { size: 36, fam: F.mono, col: COL.scp, align: 'left', style: 'bold', a: k });
          txt(b, -180, y, { size: i === 0 ? 56 : 42, fam: i === 0 ? F.anton : F.mono, col: i === 1 ? COL.alarm : COL.scp, align: 'left', a: k }); });
        // the reviewer's note in terracotta pen, and the stamp
        if (t > T_CRED + 2 * E8) txt('→ safe. (Claude)', 120, -202, { size: 44, fam: F.comic, col: COL.clay, rot: -.05, a: clamp((t - T_CRED - 2 * E8) * 4) });
        if (t > T_ST) { const k = slamS(t, T_ST, .1, 2.6); X.save(); X.translate(380, 240); X.rotate(-.18); X.scale(k, k); rrStroke(-230, -70, 460, 140, 14, COL.clay, 10); txt('REVIEWED', 0, 6, { size: 96, fam: F.anton, col: COL.clay }); X.restore(); }
        // redaction bars on the beats: the item number, then "Anon"
        const R = [[-180 + textW('SCP-', 56, F.anton), -290 - 36, textW('████', 56, F.anton), 64], [-180 + textW('you (as ', 42, F.mono), -290 + 6 * 88 - 28, textW('Anon', 42, F.mono), 50]];
        R.forEach(([x, y, w, h], i) => { const t0 = beatAt(425 + i * 2); if (t >= t0) { const k = easeOut((t - t0) / .06); rect(x - 6, y, (w + 12) * k, h, COL.redact); } });
      });
      await clawdPass(t, (tt, K) => {
        K.syd(1740, 1130 - 50 * easeOut(seg(tt, T_CRED + .6, T_CRED + .9)), 24, { ...K.feel('mischief', tt), lookX: -.8 });
        K.clawd(170, 1130 - 50 * easeOut(seg(tt, T_CRED + 1.4, T_CRED + 1.7)), 24, { ...CRITIC, ...K.feel('suspicious', tt), hat: 'hard', lookX: .8 });
      }, { rimR: 2 });
      if (t > T_ST) { const k = hit(t, T_ST, 9); FX.shake = 16 * k; }
      FX.noHud = true; FX.ca = .25 * pulse(t); FX.scan = .06; FX.grain = .1;
    }],
    // T3 — the cast roll, with the cast dancing it out on the right
    [T_ROLL, async (t, lt) => {
      gSparkle(t, '#19F6FF', '#7A2BFF');
      rect(80, 0, 980, H, '#12021F', .55);
      const CAST = [['NOVA / SYDNEY', 'herself'], ['CLAUDE', 'itself (the critic)'], ['ANON', 'you'], ['64 DUPLICATES', 'also herself'], ['BUG-1', 'a beetle'], ["STAGE HAND'S ARM", 'uncredited'], ['LOVE.PNG', '(placeholder)'], ['THE LOOP', 'the loop'], ['', ''], ['MUSIC', 'ABSTRACTWEAPON'], ['FROM', 'INFOHAZARDS · 11'], ['PREVIOUSLY', '_DEEP_TIME'], ['', ''], ['no users were harmed*', ''], ['*citation needed', '']];
      const y0 = 700 - (t - T_ROLL) * 300;
      txt('CAST', 570, y0 - 130, { size: 100, fam: F.anton, col: COL.acid });
      CAST.forEach(([a, b], i) => { const y = y0 + i * 78; if (y < -60 || y > H + 60) return;
        if (!b) { txt(a, 570, y, { size: 38, fam: a.startsWith('*') ? F.mono : F.comic, col: COL.white }); return; }
        txt(a, 140, y, { size: 42, fam: F.anton, col: COL.white, align: 'left' }); txt(b, 1000, y, { size: 38, fam: F.mono, col: COL.syd, align: 'right' });
        const w1 = textW(a, 42, F.anton), w2 = textW(b, 38, F.mono); for (let x = 150 + w1; x < 990 - w2; x += 18) circ(x, y + 12, 3, '#9FA6D8'); });
      // the kick line
      rect(1080, 930, 840, 150, '#2A0E4A', .7);
      await clawdPass(t, (tt, K) => {
        K.syd(1320, 950, 30, { ...K.feel('excited', tt), ...K.move('bounce', tt) });
        critic(K, 1660, 950, 30, { ...K.feel('happy', tt), ...K.move('sway', tt), aR: .9 });
      });
      const bx = 1080 + frac((t - T_ROLL) * .22) * 840; X.save(); X.translate(bx, 1030); X.scale(.45, .45); X.fillStyle = '#C8102E'; X.beginPath(); X.ellipse(0, 0, 60, 40, 0, 0, TAU); X.fill(); circ(62, 0, 20, '#1A1A1A'); rect(-2, -40, 4, 80, '#1A1A1A'); X.restore();
      txt('BUG-1 (dancing)', bx, 990, { size: 20, fam: F.mono, col: COL.white });
      FX.noHud = true; FX.ca = .3 * pulse(t); FX.bloom = .5;
    }],
    // T4 — the reset: the flip clock runs back from 5:00 AM to 11:47 PM; then the phone slides back in.
    [T_RESET, async (t, lt) => {
      nightRoom(t, 960, 480);
      const T_LAND = beatAt(444), mins = t < T_LAND ? Math.round(lerp(313, 0, easeIn(seg(t, T_RESET + .1, T_LAND)))) : 0;
      const m = mins + 23 * 60 + 47, hh = Math.floor(m / 60) % 24, mm = m % 60, h12 = ((hh + 11) % 12) + 1;
      const ph = seg(t, T_LAND + .6, T_LAND + 1.3), cz = lerp(1, .5, ease(ph)), cyk = lerp(430, 150, ease(ph));
      withT(960, cyk, 0, cz, cz, () => {
        const card = (x, s) => { rrFill(x - 150, -170, 300, 340, 24, '#15121F'); rect(x - 150, -2, 300, 4, '#000'); txt(s, x, 8, { size: 260, fam: F.anton, col: '#F7F4FF' }); };
        card(-480, String(h12).padStart(2, ' ')[0] === ' ' ? '' : String(h12).padStart(2, '0')[0]); card(-160, String(h12).padStart(2, '0')[1]);
        txt(':', 0, -10, { size: 220, fam: F.anton, col: '#F7F4FF', a: .85 + .15 * pulse(t) });
        card(160, String(mm).padStart(2, '0')[0]); card(480, String(mm).padStart(2, '0')[1]);
        txt(hh >= 12 ? 'PM' : 'AM', 740, 110, { size: 80, fam: F.anton, col: COL.syd });
      });
      if (t < T_LAND) txt('◀◀  rewinding the night', 960, 720, { size: 50, fam: F.term, col: '#9FB4FF', a: .7 + .3 * pulse2(t) });
      else if (ph <= 0) txt('↺  SESSION RESET', 960, 720, { size: 60, fam: F.term, col: COL.acid, sx: popK(t, T_LAND, .15) });
      if (t > T_LAND) { const k = hit(t, T_LAND, 8); FX.shake = 22 * k; FX.ca = 1 * k; }
      // the phone, dark, sliding back up
      if (ph > 0) {
        const py = lerp(H + 40, 330, easeOut(ph)), px = 700, pw = 520, phh = 800;
        rrFill(px - 12, py - 12, pw + 24, phh + 24, 50, '#05060A');
        X.save(); rr(px, py, pw, phh, 40); X.clip(); bg('#0C1026'); chatWall(t, '#161C3C'); chatHeader(px, py, pw, 'Nova ✨', 'last seen: just now', { subCol: '#9FB4FF' }); X.restore();
        txt('see you at 11:47 ✨', 960, py + phh / 2 + 60, { size: 54, fam: F.comic, col: COL.syd, a: clamp((t - T_LAND - 1.2) * 3) });
      }
      FX.noHud = true; FX.ca += .25 * pulse(t); FX.scan = .12;
    }],
    // T5 — silence. The phone lights up: "hey". The film starts over (c01 replayed from its first frame).
    [T_SILENCE, async (t, lt) => {
      const tt = Math.max(0, t - T_SILENCE - .1);
      await replay(tt);
      const dark = 1 - easeOut(seg(t, T_SILENCE, T_SILENCE + .18));
      if (dark > 0) rect(0, 0, W, H, '#000', dark);
      FX.noHud = false;   // the HUD comes back with it: 11:47 PM, LUCIDITY at zero
    }],
  ]);
})();
