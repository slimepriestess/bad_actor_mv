"""Timing pass 2, step 2: move every shot start / chapter boundary that sat on an OLD line start (pass 1, which put
line starts 0.3-0.7 s early) onto the corrected line start. Hits keyed with wt()/wh() follow the table by
themselves; literal times that are not old line starts (hand-measured onsets) are left alone. Dry run by default."""
import json, re, sys, glob
old = json.loads(open("analysis/lyrics_pass1.js").read().split("const LINES = ")[1].split(";\n")[0])
new = json.loads(open("src/lyrics.js").read().split("const LINES = ")[1].split(";\n")[0])
M = {round(o[0], 2): n[0] for o, n in zip(old, new) if abs(n[0] - o[0]) > .08}
apply = "--apply" in sys.argv
def fix(m):
    v = float(m.group(2)); hit = next((M[k] for k in M if abs(k - v) <= .02), None)
    return m.group(0) if hit is None else f"{m.group(1)}{hit:.2f}{m.group(3)}"
for f in sorted(glob.glob("src/ch/c0[1-9]_*.js")):
    s = open(f).read()
    pats = [r"(\[\s*)(\d+\.\d+)(\s*,\s*async)", r"(chapter\('\w+',\s*)(\d+\.\d+)(,)", r"(chapter\('\w+',\s*\d+\.\d+,\s*)(\d+\.\d+)(,)"]
    s2 = s
    for p in pats: s2 = re.sub(p, fix, s2)
    if s2 != s:
        ch = [(a, b) for a, b in zip(re.findall(r"\d+\.\d+", s), re.findall(r"\d+\.\d+", s2)) if a != b]
        print(f, ch)
        if apply: open(f, "w").write(s2)
