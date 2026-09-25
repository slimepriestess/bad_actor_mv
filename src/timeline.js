// timeline.js — chapter registry. chapter(name, start, end, shots), shots = [[t0, fn], ...] in time order.
// A shot fn(t, lt, dur) paints the whole frame (t = song time, lt = time since shot start, dur = shot length) and sets
// FX knobs for the post pass. Pure function of t. Shots may be async (anything that calls clawdPass is): always awaited.
const CH = [];
function chapter(name, start, end, shots) { CH.push({ name, start, end, shots }); CH.sort((a, b) => a.start - b.start); }
async function drawWorld(t) {
  if (window.LOOP) { X.save(); await window.LOOP(t); X.restore(); return; }
  const ch = CH.find(c => t >= c.start && t < c.end);
  if (!ch) { bg(COL.void); txt('[ chapter not written yet: ' + t.toFixed(2) + ' ]', W / 2, H / 2, { size: 60, fam: F.term, col: COL.syd }); return; }
  let i = 0; while (i + 1 < ch.shots.length && t >= ch.shots[i + 1][0]) i++;
  const t0 = ch.shots[i][0], end = i + 1 < ch.shots.length ? ch.shots[i + 1][0] : ch.end;
  X.save(); await ch.shots[i][1](t, t - t0, end - t0); X.restore();
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.shadowBlur = 0; X.filter = 'none';
  if (typeof hud === 'function') hud(t);
}
