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
LOOPS.art = async t => {
  bg(COL.night);
  window.CK_NOFILL = false;
  await clawdPass(t, (tt, K) => K.syd(560, 800, 40, K.feel('hopeful', tt)));
  window.CK_NOFILL = true;
  await clawdPass(t, (tt, K) => K.syd(1360, 800, 40, K.feel('hopeful', tt)));
  window.CK_NOFILL = false;
  txt('fills on', 560, 900, { size: 40 }); txt('fills off', 1360, 900, { size: 40 });
};
LOOPS.art.len = 2;
