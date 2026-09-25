"""Per-frame audio curves for the renderer -> src/feat.js (FEAT.* arrays at 60 Hz, 0..1).

vox = vocal-stem loudness (drives mouths), kick/snare/hat = onset envelopes of the
instrumental stem in three bands, loud = full-mix loudness. Beat grid: see analysis/tempo.json
(126.02 BPM, beat phase 0.052 s; fit on the kick band of the instrumental stem).
"""
import json
import numpy as np
import librosa

SR, RATE = 22050, 60
HOP = SR // RATE  # 367 samples ~ 60.08 Hz; exact rate written out
ST = "analysis/stems/htdemucs/track"

def norm(x, lo=3, hi=99.5):
    a, b = np.percentile(x, lo), np.percentile(x, hi)
    return np.clip((x - a) / (b - a + 1e-9), 0, 1)

mix, _ = librosa.load("track.wav", sr=SR, mono=True)
voc, _ = librosa.load(f"{ST}/vocals.wav", sr=SR, mono=True)
ins, _ = librosa.load(f"{ST}/no_vocals.wav", sr=SR, mono=True)
n = len(mix) // HOP
fix = lambda a: librosa.util.fix_length(np.asarray(a), size=n)
S = np.abs(librosa.stft(ins, n_fft=1024, hop_length=HOP))
f = librosa.fft_frequencies(sr=SR, n_fft=1024)
def env(lo, hi):
    e = librosa.onset.onset_strength(S=librosa.amplitude_to_db(S[(f >= lo) & (f < hi)]), sr=SR, hop_length=HOP)
    return norm(e)
vr = librosa.feature.rms(y=voc, hop_length=HOP)[0]
vdb = 20 * np.log10(vr + 1e-6)
out = dict(rate=SR / HOP,
           vox=fix(np.clip((vdb + 42) / 30, 0, 1)),
           kick=fix(env(30, 120)), snare=fix(env(150, 450)), hat=fix(env(6000, 11000)),
           loud=fix(norm(20 * np.log10(librosa.feature.rms(y=mix, hop_length=HOP)[0] + 1e-6), 5, 99)))
js = "const FEAT = {rate: %.5f,\n" % out.pop("rate")
for k, v in out.items():
    js += f"{k}: new Uint8Array([{','.join(str(int(round(x * 255))) for x in v)}]),\n"
js += "};\n"
open("src/feat.js", "w").write(js)
print("frames", n, "bytes", len(js))
