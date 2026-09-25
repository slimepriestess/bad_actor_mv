import librosa, numpy as np
y, sr = librosa.load("track.wav", sr=22050, mono=True)
tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units="time")
print("librosa tempo", np.round(tempo, 2), "beats", len(beats), "first", np.round(beats[:6], 3))
ibi = np.diff(beats); print("median IBI", np.round(np.median(ibi), 4), "-> bpm", np.round(60/np.median(ibi), 2))
# fit a line to beat times from 20s on to get a precise grid
m = beats > 20
k = np.arange(m.sum()); p = np.polyfit(k, beats[m], 1)
print("fit period", np.round(p[0], 5), "bpm", np.round(60/p[0], 3), "resid ms", np.round(1000*np.std(beats[m]-np.polyval(p, k)), 1))
rms = librosa.feature.rms(y=y, hop_length=512)[0]; t = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=512)
db = 20*np.log10(rms+1e-6)
for s in range(0, 215, 5):
    seg = db[(t >= s) & (t < s+5)]; print(f"{s:3d}s {seg.mean():6.1f} dB", "#"*int(max(0, seg.mean()+50)))
