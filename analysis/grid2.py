import librosa, numpy as np, json
y, sr = librosa.load("analysis/stems/htdemucs/track/no_vocals.wav", sr=22050, mono=True)
hop = 128
S = np.abs(librosa.stft(y, n_fft=1024, hop_length=hop)); f = librosa.fft_frequencies(sr=sr, n_fft=1024)
kick = librosa.onset.onset_strength(S=librosa.amplitude_to_db(S[(f >= 30) & (f < 120)]), sr=sr, hop_length=hop)
snare = librosa.onset.onset_strength(S=librosa.amplitude_to_db(S[(f >= 150) & (f < 450)]), sr=sr, hop_length=hop)
tt = librosa.frames_to_time(np.arange(len(kick)), sr=sr, hop_length=hop)
def phase_fit(env, bpm):
    P = 60 / bpm; z = np.sum(env * np.exp(2j * np.pi * tt / P)); return abs(z) / env.sum(), (np.angle(z) / (2 * np.pi) * P) % P
best = max(((phase_fit(kick, b)[0], b) for b in np.arange(125.5, 126.5, 0.005)))
bpm = best[1]; P = 60 / bpm; coh, ph = phase_fit(kick, bpm)
print("bpm %.3f coherence %.3f beat phase %.3f" % (bpm, coh, ph))
# which beat-in-bar carries most kick vs snare (4/4): fold envelopes on the bar
bar = 4 * P; k_bar = [kick[((tt - ph - i * P) % bar) < 0.04].mean() for i in range(4)]; s_bar = [snare[((tt - ph - i * P) % bar) < 0.04].mean() for i in range(4)]
print("kick by beat-in-bar", np.round(k_bar, 2), "snare", np.round(s_bar, 2))
# per-20s drift of kick phase
for a in range(0, 215, 30):
    m = (tt >= a) & (tt < a + 30); z = np.sum(kick[m] * np.exp(2j * np.pi * tt[m] / P)); print(a, "phase %.3f" % ((np.angle(z) / (2 * np.pi) * P) % P))
json.dump(dict(bpm=round(float(bpm), 3), offset=round(float(ph), 3), duration=214.8), open("analysis/tempo.json", "w"))
