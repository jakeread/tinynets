"""Summary tables for results.csv, as specified in DESIGN.md."""
import sys
import pandas as pd

def q(s, f="{:.0f}"):
    return (f + " [" + f + "–" + f + "]").format(s.median(), s.quantile(.25), s.quantile(.75))

d = pd.read_csv(sys.argv[1] if len(sys.argv) > 1 else 'results.csv')
v = d[~d.excluded]
ex = d[(d.proto == 'tinynet')].groupby('k').excluded.sum()
for k in sorted(d.k.unique()):
    for p in ['tinynet', 'lfa']:
        s = v[(v.k == k) & (v.proto == p)]
        print(f"{k} {p:8s} n={len(s):3d} lost {q(s.lost):18s} blackout {q(s.blackout_ms, '{:.1f}'):24s}"
              f" recovered {s.recovered.mean()*100:4.0f}% ({(~s.recovered.astype(bool)).sum()} not)  excl {int(ex[k])}")
w = v.pivot_table(index=['k', 'trial', 'flow'], columns='proto', values='lost')
for k in sorted(d.k.unique()):
    x = w.loc[k]
    print(f"k={k}: TinyNet lost fewer {(x.tinynet < x.lfa).mean():.0%}, equal {(x.tinynet == x.lfa).mean():.0%}, "
          f"more {(x.tinynet > x.lfa).mean():.0%} (n={len(x)})")
nr = v[~v.recovered.astype(bool)]
print(nr[['k', 'trial', 'nodes', 'proto', 'flow', 'lost', 'blackout_ms']].to_string())
