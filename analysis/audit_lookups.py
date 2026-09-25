"""Audit every wt()/wh() call in the chapters: resolve it against the pass-1 table (what the painter saw) and the
current table; flag any whose result jumped more than 1 s, i.e. the `after` anchor now skips past the word."""
import json, re, glob
def load(p): return json.loads(open(p).read().split("const LYR = ")[1].split(";\n")[0])
OLD, NEW = load("analysis/lyrics_pass1.js"), load("src/lyrics.js")
norm = lambda s: re.sub(r"[^a-z0-9$]", "", s.lower())
def wt(L, w, after):
    for t, x, *_ in L:
        if t >= after - 1e-3 and norm(x) == norm(w): return t
    return None
bad = 0
for f in sorted(glob.glob("src/ch/c0[1-9]_*.js")):
    for i, line in enumerate(open(f).read().split("\n"), 1):
        for m in re.finditer(r"\bw[th]\((['\"])(.+?)\1(?:\s*,\s*([\d.]+))?", line):
            w, after = m.group(2), float(m.group(3) or 0)
            o, n = wt(OLD, w, after), wt(NEW, w, after)
            if o is None or n is None or abs(n - o) > 1.0:
                bad += 1; print(f"{f.split('/')[-1]}:{i}  {m.group(0)}  old {o}  new {n}")
print(bad, "suspicious lookups")
