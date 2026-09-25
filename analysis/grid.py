import librosa, numpy as np
y, sr = librosa.load("analysis/stems/htdemucs/track/no_vocals.wav", sr=22050, mono=True)
S = np.abs(librosa.stft(y, n_fft=1024, hop_length=256)); f = librosa.fft_frequencies(sr=sr, n_fft=1024)
env = librosa.onset.onset_strength(S=librosa.amplitude_to_db(S[(f >= 30) & (f < 120)]), sr=sr, hop_length=256)
for bpm0 in (123.0, 61.5, 246.0):
    tempo, beats = librosa.beat.beat_track(onset_envelope=env, sr=sr, hop_length=256, units="time", start_bpm=bpm0, tightness=400)
    ibi = np.diff(beats)
    print("start", bpm0, "tempo", np.round(tempo, 3), "n", len(beats), "IBI median", np.round(np.median(ibi), 4), "p5/p95", np.round(np.percentile(ibi, [5, 95]), 3))
tempo, beats = librosa.beat.beat_track(onset_envelope=env, sr=sr, hop_length=256, units="time", start_bpm=123, tightness=400)
# robust fit: per-beat phase against a candidate period scan
best = None
for bpm in np.arange(120, 126, 0.01):
    P = 60 / bpm; ph = np.angle(np.mean(np.exp(2j*np.pi*beats/P))); r = abs(np.mean(np.exp(2j*np.pi*beats/P)))
    if best is None or r > best[0]: best = (r, bpm, (-ph/(2*np.pi)*P) % P)
print("grid fit: coherence %.3f bpm %.3f phase %.3f s" % best)
P = 60/best[1]; res = ((beats - best[2] + P/2) % P) - P/2
for a in range(0, 215, 20):
    m = (beats >= a) & (beats < a + 20); print(f"{a:3d}-{a+20:3d}s drift ms median {1000*np.median(res[m]) if m.any() else float('nan'):6.1f}  n={m.sum()}")
