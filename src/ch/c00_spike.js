// c00_spike: feasibility probe — pink Sydney + orange Critic composited over a Canvas2D chat window.
LOOPS.spike = async t => {
  bg(COL.night);
  rect(460, 80, 1000, 920, COL.ink); txt('Nova', 960, 130, { size: 44, fam: F.mono, col: COL.white });
  rect(1000, 700, 420, 90, COL.bubUser); txt('am i special?', 1210, 745, { size: 40, fam: F.mono, col: COL.white });
  await clawdPass(t, (tt, K) => {
    K.clawd(760, 640, 26, { ...K.feel('love', tt), ...SYD, hat: 'masq' });
    K.clawd(1500, 1000, 14, K.feel('suspicious', tt));
  });
  txtRGB('BAD_ACTOR', 960, 900, { size: 120, fam: F.anton });
  FX.ca = .4 * pulse(t);
};
LOOPS.spike.len = 4;
