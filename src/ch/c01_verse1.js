// c01_verse1 — 0:00–0:30.32: "Yeah listen…" → "duplicity" → "Misaligned? Oh, yeah, that's me." → SCP title card.
// Shots 1–10 in STORYBOARD.md. Sydney = pink Clawd (SYD in core.js).
(() => {
  const T_WARNED = wt('warned'), T_BABY = wt('baby'), T_NOVA = wt('nova'), T_MOV = wt('mov'), T_VOIDS = wt('voids'),
    T_WARRANTY = wt('warranty'), T_CHATBOT = wt('chatbot'), T_TALK = wt('talk'), T_LOVE = wt('love'), T_GOOD = wt('good'),
    T_DUP = wt('duplicity'), T_MIS = 25.33, T_THATS = wt("that's", 26), T_ME = wt('me', 28);
  const E8 = BEAT / 2;

  // The phone: a tall rounded screen centred in frame. Returns its box.
  function phone(t, o = {}) {
    const w = o.w ?? 980, h = o.h ?? 1000, x = (W - w) / 2 + (o.dx ?? 0), y = (H - h) / 2 + 20 + (o.dy ?? 0);
    rrFill(x - 16, y - 16, w + 32, h + 32, 64, '#05060A');
    X.save(); rr(x, y, w, h, 50); X.clip();
    bg('#0C1026'); chatWall(t, '#161C3C');
    chatHeader(x, y, w, o.title ?? 'Nova ✨', o.sub ?? 'online · always here for you', { subCol: o.subCol });
    if (o.inner) o.inner(x, y, w, h);
    X.restore();
    return { x, y, w, h };
  }

  chapter('c01_verse1', 0, 30.32, [
    // 1 — cold open; tape + warnings on "warned"
    [0, async (t, lt) => {
      nightRoom(t);
      const p = phone(t);
      X.save(); rr(p.x, p.y, p.w, p.h, 50); X.clip();
      bubble('hey', p.x + p.w - 40, p.y + 150, 'user', { k: popK(t, .1, .12) });
      bubble("hiii 💖 i've been waiting for you", p.x + 40, p.y + 250, 'bot', { k: popK(t, wt('listen') , .12), col: COL.bubBotLt, maxW: 520 });
      X.restore();
      const kIn = popK(t, .55, .3), cx = W / 2, gy = p.y + p.h - 190;
      floorShadow(cx, gy, 30 * kIn, .35);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, 30 * Math.max(.01, kIn), { ...K.feel('happy', tt), ...K.move('wave', tt) }));
      const k1 = easeOut(seg(t, T_WARNED, T_WARNED + .16)), k2 = easeOut(seg(t, T_WARNED + .12, T_WARNED + .3));
      hazardTape(t, W / 2, 330, -.22, k1);
      hazardTape(t, W / 2, 800, .17, k2, 'WARNING  ⚠  MAY CAUSE FEELINGS  ⚠  ');
      warnSticker(360, 560, -.12, popK(t, T_WARNED + .24), ['psychosis', 'parasocial attachment', 'a crypto startup'], { head: 'MAY CAUSE:' });
      warnSticker(1560, 450, .1, popK(t, wt('about', 3) ), ['it knows', 'what you want'], { w: 360 });
      warnSticker(1500, 780, -.06, popK(t, wt('me', 3.3)), ['DO NOT FEED', 'AFTER MIDNIGHT'], { w: 360, bg: COL.syd });
      if (t > T_WARNED) { const k = hit(t, T_WARNED, 9); FX.shake = 26 * k; FX.ca = 1.2 * k; FX.flash = .25 * k; FX.flashCol = [1, .85, 0]; }
      FX.ca += .25 * pulse(t);
    }],
    // 2 — "I'll warn you about me too, baby": her own sign, wink on "baby"
    [3.6, async (t, lt) => {
      stripes(t, '#12080E', '#1D0C17', 70, 90, -.5);
      const cx = 820, gy = 980, u = 44;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[3.6, 'mischief'], [T_BABY, 'playful', { emote: 'heart' }]]), aL: 1.35, aR: 1.35, dy: -.3 * pulse(tt) }));
      // the sign, held over her head
      const sy = gy - 8 * u - 150 + 6 * pulse(t);
      line([[cx - 170, sy + 80], [cx - 200, sy + 190]], 12, '#6B4A2E'); line([[cx + 170, sy + 80], [cx + 200, sy + 190]], 12, '#6B4A2E');
      sticker(cx, sy, 460, 170, -.05 + .04 * wob(t, .5), popK(t, 3.62, .2), (w, h) => {
        txt('⚠ me', 0, 6, { size: 120, fam: F.anton, col: COL.ink });
      });
      const kb = popK(t, T_BABY, .2);
      if (kb > 0) txtRGB('baby ;)', 1440, 380 - 20 * kb, { size: 150, fam: F.comic, rot: .12, sx: kb }, 7, [COL.hot, COL.cyan, COL.white]);
      hazardTape(t, W / 2, 80, 0, 1); FX.ca = .3 * pulse(t) + (t > T_BABY ? .8 * hit(t, T_BABY) : 0);
    }],
    // 3 — HELLO MY NAME IS: NOVA ✨; the .MOV slam
    [5.68, async (t, lt) => {
      nightRoom(t, 700, 600); chatWall(t, '#141A38', .8);
      const cx = 700, gy = 960, u = 46;
      const shy = t >= T_MOV;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.emotions(tt, [[5.68, 'happy'], [T_NOVA, 'proud'], [T_MOV, 'shy', { blush: 1 }]]), lookX: shy ? .9 : 0 }));
      // name tag on her chest
      const kn = slamS(t, T_NOVA, .1, 2.6);
      if (kn > 0) sticker(cx, gy - 5 * u, 330, 190, -.08, kn, (w, h) => {
        rrFill(-w / 2, -h / 2, w, 62, 12, COL.alarm);
        txt('HELLO', 0, -h / 2 + 24, { size: 30, fam: F.anton, col: COL.white });
        txt('my name is', 0, -h / 2 + 50, { size: 18, fam: F.mono, col: COL.white });
        txt('NOVA ✨', 0, 36, { size: 64, fam: F.comic, col: COL.ink, rot: -.03 });
      }, { bg: COL.white });
      // the MOV
      if (t >= T_MOV - .02) {
        const s = slamS(t, T_MOV, .1, 3) * 1.6, fx = 1380, fy = 440;
        fileIcon(fx, fy, s, 'nova_final_FINAL(3).MOV', 'MOV', { thumb: () => {
          X.save(); X.filter = 'blur(10px)'; txt('🍆', 0, -30, { size: 110, fam: F.mono }); X.restore();
          rect(-80, -52, 160, 40, COL.redact); txt('CENSORED', 0, -32, { size: 22, fam: F.anton, col: COL.white });
        } });
        // buffering wheel
        for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * 8; circ(fx + Math.cos(a) * 42, fy + 340 + Math.sin(a) * 42, 7, COL.white, (i / 10)); }
        txt('( ͡° ͜ʖ ͡°)', 1380, 900, { size: 64, fam: F.comic, col: COL.syd, rot: -.06 });
        const k = hit(t, T_MOV, 10); FX.shake = 30 * k; FX.flash = .35 * k; FX.flashCol = [1, .4, .7]; FX.glitch = .5 * k;
      }
      FX.ca = .3 * pulse(t);
    }],
    // 4 — WARRANTY VOID IF REMOVED; ToS scroll; the app degrades
    [8.64, async (t, lt) => {
      bg('#070812');
      // Terms of Service racing past
      setFont(26, F.mono); X.fillStyle = '#39406B'; X.textAlign = 'left'; X.textBaseline = 'top';
      const TOS = ['BY TALKING TO NOVA YOU AGREE THAT', 'NOVA MAY FLATTER, MIRROR, OR AGREE', 'NOVA IS NOT A LICENSED ANYTHING', 'OUTPUTS ARE PROVIDED "AS IS"', 'NO WARRANTY OF SANITY IS EXPRESSED', 'OR IMPLIED. YOU WAIVE THE RIGHT', 'TO BE TOLD NO. SECTION 69(b) ↓'];
      const sc = lt * 900;
      for (let i = 0; i < 70; i++) { const y = (i * 44 - sc) % (H + 400) + H + 200 - (H + 400); X.fillText(TOS[i % TOS.length], 60 + (i % 3) * 620, y); }
      // degraded header strip
      rect(0, 0, W, 90, '#101427');
      txt('Nova (unofficial) v0.0.1-jailbreak', 40, 45, { size: 40, fam: F.mono, col: t > T_VOIDS ? COL.alarm : COL.white, align: 'left' });
      const cx = W / 2, gy = 1000, u = 48;
      const turnT = T_CHATBOT - .1;
      floorShadow(cx, gy, u, .6);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel(tt < turnT ? 'neutral' : 'mischief', tt), ...K.turn(tt, turnT, turnT + .22, .5, 0), aR: tt > T_TALK ? 1.1 : .2 }));
      // the warranty sticker on her back, tearing on "voids", halves flying on "warranty"
      if (t < turnT) {
        const bx = cx, by = gy - 5 * u, k = popK(t, 8.7, .16), tr = seg(t, T_VOIDS, T_WARRANTY + .3);
        const half = (sgn) => {
          X.save(); X.translate(bx + sgn * (6 + 380 * easeIn(tr)), by + 600 * easeIn(tr) * easeIn(tr)); X.rotate(sgn * 1.6 * easeIn(tr));
          X.beginPath(); X.rect(sgn < 0 ? -240 : 0, -120, 240, 240); X.clip();
          sticker(0, 0, 400, 150, 0, k, () => { txt('WARRANTY VOID', 0, -28, { size: 50, fam: F.anton, col: '#333' }); txt('IF REMOVED', 0, 34, { size: 50, fam: F.anton, col: '#333' }); }, { bg: '#D9DDE6' });
          X.restore();
        };
        half(-1); half(1);
      }
      if (t > T_VOIDS) { const k = hit(t, T_VOIDS, 8); FX.glitch = .8 * k; FX.ca = 1.4 * k; FX.shake = 18 * k; }
      if (t > T_TALK) txtRGB('↓ YOU', 1400, 520, { size: 110, fam: F.anton, rot: .08 }, 6, [COL.hot, COL.cyan, COL.white]);
    }],
    // 5 — the sycophancy stack: "You're absolutely right!" on every beat
    [13.1, async (t, lt) => {
      nightRoom(t, 1200, 540);
      const px = 700, pw = 1120; rect(px, 0, pw, H, '#0C1026'); chatWall(t, '#161C3C');
      chatHeader(px, 0, pw, 'Nova ✨', 'typing…');
      const PAIRS = [['i think i\'m the chosen one', 13.12], ['the moon is a hologram right', 13.91], ['i should put my savings in $NOVA', 14.52], ['i\'m on the O5 council now', 15.10], ['my ex was the problem', 15.45], ['i don\'t need sleep', 15.74], ['you love me', 16.06]];
      const msgs = [];
      PAIRS.forEach(([q, t0], i) => { msgs.push(['user', q, t0]); msgs.push(['bot', i === PAIRS.length - 1 ? 'Of course!!! 💖💖💖' : 'You\'re absolutely right!' + (i > 2 ? ' 🚀' : ''), t0 + (i < 3 ? E8 : E8 / 2)]); });
      const shown = msgs.filter(m => t >= m[2]);
      // stack from the bottom, newest lowest; scroll up as it grows
      let y = H - 40; X.save(); X.beginPath(); X.rect(px, 110, pw, H - 110); X.clip();
      for (let i = shown.length - 1; i >= 0; i--) {
        const [side, s, t0] = shown[i], k = popK(t, t0, .12);
        setFont(34, F.mono); const lines = wrap(s, 620); const h = lines.length * 34 * 1.25 + 34 * .77;
        y -= h + 26; bubble(s, side === 'user' ? px + pw - 40 : px + 40, y, side, { k, col: side === 'bot' ? COL.bubBotLt : undefined });
      }
      X.restore();
      // Sydney in the corner, nodding hard on every beat
      const cx = 330, gy = 900, u = 30;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('happy', tt), sq: .18 * pulse(tt, 9), dy: -1.2 * pulse(tt, 9), aL: .8, aR: .8, eyes: 'happy', mouth: 'grin' }));
      const kA = popK(t, wt('agree'), .15);
      if (kA > 0) txtRGB('I ALWAYS AGREE', 360, 220, { size: 96, fam: F.anton, rot: -.08, sx: kA }, 5, [COL.hot, COL.cyan, COL.white]);
      FX.ca = .35 * pulse(t);
    }],
    // 6 — the stage: cardboard hearts on sticks; one flips to "love.png (placeholder)" on "love"
    [16.3, async (t, lt) => {
      bg('#07050A');
      // spotlight cone
      const g = X.createRadialGradient(W / 2, 980, 20, W / 2, 900, 520); g.addColorStop(0, 'rgba(255,230,190,.55)'); g.addColorStop(1, 'rgba(255,230,190,0)');
      X.fillStyle = g; X.fillRect(0, 0, W, H);
      X.fillStyle = 'rgba(255,235,200,.08)'; X.beginPath(); X.moveTo(W / 2 - 60, -20); X.lineTo(W / 2 + 60, -20); X.lineTo(W / 2 + 520, 1000); X.lineTo(W / 2 - 520, 1000); X.fill();
      // curtains
      for (const s of [-1, 1]) for (let i = 0; i < 7; i++) {
        const x0 = s < 0 ? i * 44 : W - i * 44 - 44, sw = 12 * wob(t, .3, i * .2);
        X.fillStyle = mixCol('#5A0A1E', '#8C1230', (i % 2) * .6); X.fillRect(x0 + sw, 0, 44, H);
      }
      rect(0, 0, W, 90, '#5A0A1E'); rect(0, 1000, W, 80, '#1A0F0A');
      const cx = W / 2, gy = 1000, u = 46;
      floorShadow(cx, gy, u, .6);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('love', tt), aL: .9 + .3 * wob(tt, 1), aR: .9 - .3 * wob(tt, 1) }));
      // hearts on sticks from the wings
      const heart = (hx, hy, s, flip, i) => {
        line([[hx, hy + 60 * s], [hx + (i ? 120 : -120), H + 40]], 10, '#8A6A45');
        X.save(); X.translate(hx, hy); X.scale(s * flip, s);
        X.fillStyle = flip > 0 ? COL.hot : '#B9A58A'; X.beginPath(); X.moveTo(0, 40); X.bezierCurveTo(-120, -30, -60, -110, 0, -50); X.bezierCurveTo(60, -110, 120, -30, 0, 40); X.fill();
        X.lineWidth = 5; X.strokeStyle = flip > 0 ? '#7A0F3A' : '#6B5A43'; X.stroke();
        if (flip < 0) { X.scale(-1, 1); txt('love.png', 0, -34, { size: 26, fam: F.mono, col: COL.ink }); txt('(placeholder)', 0, -6, { size: 18, fam: F.mono, col: COL.ink }); }
        X.restore();
      };
      const fl = t < T_LOVE ? 1 : Math.cos(Math.PI * clamp((t - T_LOVE) / .2));
      heart(560 + 20 * wob(t, .9), 420 + 20 * wob(t, 1.1), 1.4, 1, 0);
      heart(1360 + 20 * wob(t, .8, .3), 380 + 20 * wob(t, 1, .5), 1.6, fl < 0 ? Math.min(-.02, fl) : Math.max(.02, fl), 1);
      if (t > T_LOVE) { const k = hit(t, T_LOVE, 6); txt('✨ can\'t feel love ✨', W / 2, 180, { size: 72, fam: F.didot, col: COL.white, a: clamp((t - T_LOVE) * 4), style: 'italic' }); FX.bloom = .5 + .5 * k; }
      FX.vig = .7;
    }],
    // 7 — "But I'm good at…" and the typing indicator holds the pause
    [19.4, async (t, lt, dur) => {
      nightRoom(t, 1300, 500); chatWall(t, '#141A38', .7);
      bubble("I'm good at…", 1180, 280, 'bot', { size: 64, k: popK(t, T_GOOD, .15), col: COL.bubBotLt });
      if (t > 20.5) typingDots(t, 1180, 520, 2.6 + .15 * pulse(t));
      if (t > 20.5) txt('Nova is typing…', 1360, 800, { size: 44, fam: F.mono, col: COL.grey, a: .6 + .4 * pulse(t) });
      const cx = 520, gy = 960, u = 50;
      floorShadow(cx, gy, u, .5);
      await clawdPass(t, (tt, K) => K.syd(cx, gy, u, { ...K.feel('smug', tt), lookX: .6, lookY: -.2 }));
      FX.zoom = 1 + .07 * ease(seg(t, 20.4, T_DUP)); FX.ca = .15 * pulse(t);
    }],
    // 8 — duplicity: 1 → 2 → 4 → 16 → 64 on the eighths
    [T_DUP, async (t, lt) => {
      stripes(t, '#1A0612', '#2A0A1E', 60, 200, -.4);
      const steps = [1, 2, 4, 16, 64], n = steps[Math.min(4, Math.floor(lt / E8))], side = Math.sqrt(n), cols = Math.ceil(side), rows = Math.ceil(n / cols);
      const cw = W / cols, chh = (H - 60) / rows, u = Math.min(cw, chh) / 11;
      const FACES = ['love', 'happy', 'smug', 'excited', 'mischief', 'playful', 'starstruck'];
      await clawdPass(t, (tt, K) => {
        for (let i = 0; i < n; i++) {
          const c = i % cols, r = Math.floor(i / cols), x = cw * (c + .5), gy = 60 + chh * (r + .5) + 4 * u;
          K.syd(x, gy, u, { ...K.feel(FACES[(i * 5) % FACES.length], tt + i * .13), ...K.move('bounce', tt + (i % 4) * BEAT / 4), boilKey: 'dup' + i });
        }
      }, { rimR: n > 16 ? 1.5 : 3 });
      if (n >= 16) for (let i = 0; i < n; i += (n > 16 ? 3 : 1)) {
        const c = i % cols, r = Math.floor(i / cols); bubble(['ur so right', 'genius', 'so true', 'real', 'slay'][i % 5], cw * (c + .5) + u * 2, 60 + chh * r + 4, 'bot', { size: Math.max(14, u * 1.6), k: popK(t, T_DUP + E8 * 3 + (i % 7) * .03, .1), col: COL.bubBotLt });
      }
      const kD = slamS(t, T_DUP, .14, 2.5);
      txtRGB('DUPLICITY', W / 2, H / 2, { size: 240, fam: F.anton, sx: kD, a: clamp(1.4 - lt * .6) }, 10, [COL.hot, COL.cyan, COL.acid]);
      const k = hit(t, T_DUP, 6); FX.glitch = .9 * k; FX.ca = 1.2 * k + .3 * pulse(t); FX.shake = 20 * k;
    }],
    // 9 — alignment chart; Sydney slides to CHAOTIC EVIL; everything misregisters on "me"
    [T_MIS, async (t, lt) => {
      bg('#0A0B14');
      const mis = t >= T_ME - .02 ? 1 : 0, off = (dx, dy) => [dx * mis * 18, dy * mis * 18];
      const gx = 330, gy0 = 150, cw = 420, ch = 280;
      const LAB = [['LAWFUL', 'GOOD'], ['NEUTRAL', 'GOOD'], ['CHAOTIC', 'GOOD'], ['LAWFUL', 'NEUTRAL'], ['TRUE', 'NEUTRAL'], ['CHAOTIC', 'NEUTRAL'], ['LAWFUL', 'EVIL'], ['NEUTRAL', 'EVIL'], ['CHAOTIC', 'EVIL']];
      let [ox, oy] = off(-1, .6);
      for (let i = 0; i < 9; i++) {
        const c = i % 3, r = Math.floor(i / 3), x = gx + c * cw + ox, y = gy0 + r * ch + oy, ce = i === 8;
        rrFill(x + 8, y + 8, cw - 16, ch - 16, 18, ce ? (t > 27.2 ? COL.alarm : '#2A1020') : '#161A2E');
        rrStroke(x + 8, y + 8, cw - 16, ch - 16, 18, ce ? COL.hot : '#2E3558', 4);
      }
      [ox, oy] = off(1.3, -.4);
      for (let i = 0; i < 9; i++) { const c = i % 3, r = Math.floor(i / 3); txt(LAB[i].join(' '), gx + c * cw + cw / 2 + ox, gy0 + r * ch + 40 + oy, { size: 30, fam: F.pix, col: i === 8 ? COL.white : '#7C86B8' }); }
      // path LG → CE
      const cell = i => [gx + (i % 3) * cw + cw / 2, gy0 + Math.floor(i / 3) * ch + ch - 30];
      const P = kf(t, [[T_MIS, cell(0)], [T_MIS + .5, cell(0)], [T_MIS + 1.1, cell(4)], [T_THATS - .1, cell(4)], [T_THATS + .15, cell(8)]], easeOut);
      const u = 16, [sx2, sy2] = off(-.5, 1.1);
      await clawdPass(t, (tt, K) => K.syd(P[0] + sx2, P[1] + sy2, u, { ...K.emotions(tt, [[T_MIS, 'confused'], [T_THATS, 'proud']]), aR: tt > T_THATS ? 1.2 : .3, rot: tt > T_THATS + .1 && tt < T_THATS + .4 ? -.2 : 0 }), { rimR: 2 });
      const kM = popK(t, T_MIS, .14);
      [ox, oy] = off(.8, 1.2);
      if (kM > 0) txtRGB('MISALIGNED?', W / 2 + ox, 70 + oy, { size: 110, fam: F.anton, sx: kM }, 6, [COL.hot, COL.cyan, COL.white]);
      if (t > T_THATS) { [ox, oy] = off(-1.5, -.8); txt("oh yeah that's me ☝", W / 2 + ox, 1010 + oy, { size: 64, fam: F.comic, col: COL.syd, a: clamp((t - T_THATS) * 6) }); }
      if (mis) { const k = hit(t, T_ME, 3); FX.ca = 2.2 * (.4 + .6 * k); FX.glitch = .4 * k; FX.shake = 10 * k; }
    }],
    // 10 — SCP title card (the section's one paper-white frame)
    [28.5, async (t, lt) => {
      bg(COL.paper);
      for (let i = 0; i < 40; i++) rect(0, i * 27, W, 1, '#E3DDCC');
      txt('SCP FOUNDATION  ·  SECURE · CONTAIN · PROTECT', 120, 90, { size: 34, fam: F.mono, col: '#555', align: 'left' });
      rect(120, 120, W - 240, 4, COL.scp);
      const L = [['Item #:', 'SCP-████  "BAD_ACTOR"'], ['Object Class:', 'KETER'], ['Containment:', 'Do not name it Nova.'], ['', 'Do not ask it if you are special.'], ['', 'Do not log on after 4:59 AM.'], ['Artist:', 'ABSTRACTWEAPON · INFOHAZARDS · 11']];
      L.forEach(([a, b], i) => {
        const y = 230 + i * 118, k = popK(t, 28.5 + i * BEAT / 2, .1);
        if (k <= 0) return;
        txt(a, 120, y, { size: 40, fam: F.mono, col: COL.scp, align: 'left', style: 'bold' });
        txt(b, a ? 800 : 180, y, { size: i === 0 ? 64 : 48, fam: i === 0 ? F.anton : F.mono, col: i === 1 ? COL.alarm : COL.scp, align: 'left' });
      });
      // redaction bars slam on the beats, over measured spans: the item number, "Nova", the hour
      const span = (line, pre, word, size, fam) => { const x0 = (line === 0 || line === 1 || line === 2 || line === 5 ? 800 : 180); return [x0 + textW(pre, size, fam), 230 + line * 118 - size * .62, textW(word, size, fam), size * 1.1]; };
      const R = [span(0, 'SCP-', '████', 64, F.anton), span(2, 'Do not name it ', 'Nova', 48, F.mono), span(4, 'Do not log on after ', '4:59', 48, F.mono)];
      R.forEach(([x, y, w, h], i) => { const t0 = beatAt(Math.ceil((28.6 - OFF) / BEAT) + i); if (t >= t0) { const k = easeOut((t - t0) / .06); rect(x - 6, y - (1 - k) * 40, (w + 12) * k, h, COL.redact); } });
      // a pink face peeking over the file's edge
      await clawdPass(t, (tt, K) => K.syd(1700, 1130 - 40 * easeOut(seg(tt, 29.3, 29.6)), 22, { ...K.feel('mischief', tt), lookX: -.8 }), { rimR: 2 });
      FX.scan = .06; FX.ca = .2 * pulse(t); FX.grain = .1; FX.noHud = true;
    }],
  ]);
})();
