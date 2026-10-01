"""
Figures for the revised evaluation. Run from sim/ after determinism.py,
load_sweep.py and failure_experiment/run.py:
  - comparison_capacity.png : delivery ratio and per-hop RTT vs. offered load
  - failure_multi.png       : packets lost per flow, 1-4 simultaneous failures
  - pdf_grid_cross.png      : per-hop RTT histograms, 4x4 grid, 5 and 10 kHz
  - pdf_RTT.png             : per-hop RTT histograms, airplane wing (20% rates)
"""

import json
import re

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

BLUE, ORANGE, AQUA = '#2a78d6', '#eb6834', '#1baf7a'
INK, GRID = '#333333', '#e5e5e5'
OUT = '../paper/figures/'

def style(ax):
    ax.spines[['top', 'right']].set_visible(False)
    ax.grid(axis='y', color=GRID, linewidth=0.6)
    ax.set_axisbelow(True)

# ----------------------------------------------------------------------
# Capacity: delivery ratio and per-hop RTT vs. offered load
# ----------------------------------------------------------------------
sweep = json.load(open('load_sweep.json'))
series = [('tinynet', 'TinyNet', BLUE, 'o'),
          ('bfs', 'Single path, default routes', ORANGE, 's'),
          ('planned', 'Single path, planned routes', AQUA, '^')]
fig, (a1, a2) = plt.subplots(1, 2, figsize=(8, 3.4))
for key, label, color, marker in series:
    loads = sorted(float(l) for l in sweep[key])
    deliv = [100 * sweep[key][str(l)]['delivered'] for l in loads]
    rtt = [sweep[key][str(l)]['rtt_mean'] for l in loads]
    a1.plot(loads, deliv, color=color, marker=marker, markersize=5, linewidth=2, label=label)
    a2.plot(loads, rtt, color=color, marker=marker, markersize=5, linewidth=2, label=label)
a1.set_xlabel('Offered load (× 5 kHz + 10 kHz)')
a1.set_ylabel('Packets delivered (%)')
a1.set_ylim(0, 105)
a2.set_xlabel('Offered load (× 5 kHz + 10 kHz)')
a2.set_ylabel(r'Mean per-hop RTT ($\mu$s, log scale)')
a2.set_yscale('log')
for ax in (a1, a2):
    style(ax)
a1.legend(frameon=False, fontsize=8, loc='lower left')
fig.tight_layout()
fig.savefig(OUT + 'comparison_capacity.png', dpi=150)

# ----------------------------------------------------------------------
# Multiple failures: packets lost per flow
# ----------------------------------------------------------------------
res = pd.read_csv('failure_experiment/results.csv')
bad = res.groupby(['k', 'trial'])['excluded'].transform('any')
res = res[~bad]
rng = np.random.default_rng(0)
fig, ax = plt.subplots(figsize=(7, 3.6))
for k in (1, 2, 3, 4):
    for off, proto, label, color, marker in [(-0.18, 'tinynet', 'TinyNet', BLUE, 'o'),
                                             (0.18, 'lfa', 'LFA (10 ms BFD, 200 ms IGP)', ORANGE, 's')]:
        y = res[(res.k == k) & (res.proto == proto)].lost.values
        x = k + off + rng.uniform(-0.09, 0.09, len(y))
        ax.scatter(x, y + 1, s=14, color=color, marker=marker, alpha=0.55, linewidths=0,
                   label=label if k == 1 else None)
        ax.plot([k + off - 0.13, k + off + 0.13], [np.median(y) + 1] * 2, color=INK, linewidth=2)
ax.set_yscale('log')
ax.set_xticks([1, 2, 3, 4])
ax.set_xlabel('Simultaneous node failures')
ax.set_ylabel('Packets lost per flow (+1, log scale)')
style(ax)
ax.legend(frameon=False, fontsize=8, loc='lower center', bbox_to_anchor=(0.5, 1.0), ncol=2)
fig.tight_layout()
fig.savefig(OUT + 'failure_multi.png', dpi=150)

# ----------------------------------------------------------------------
# Determinism: per-hop RTT histograms, 4x4 grid (steady state, t >= 50 ms)
# ----------------------------------------------------------------------
ack = re.compile(r'\[(\d+)\]: (\d+): got ACK from (\d+)\. RTT = ([\d.]+)')
fig, axes = plt.subplots(2, 1, figsize=(6, 4.4), sharex=True)
for ax, khz in zip(axes, (5, 10)):
    rtt = np.array([float(m.group(4)) for line in open(f'determinism_logs/grid_{khz}k.txt')
                    if (m := ack.search(line)) and float(m.group(1)) >= 50e3])
    ax.hist(rtt, bins=np.arange(0, 260, 5), color=BLUE, edgecolor='white', linewidth=0.5)
    ax.set_ylabel('Count')
    ax.set_title(f'{khz} kHz cross-traffic: mean {rtt.mean():.0f} $\\mu$s, '
                 f'$\\sigma$ = {rtt.std():.0f} $\\mu$s', fontsize=9, loc='left')
    style(ax)
axes[-1].set_xlabel(r'Per-hop RTT ($\mu$s)')
fig.tight_layout()
fig.savefig(OUT + 'pdf_grid_cross.png', dpi=150)

# ----------------------------------------------------------------------
# Determinism: airplane wing (steady state, t >= 50 ms)
# ----------------------------------------------------------------------
rows = np.array([(float(m.group(1)), int(m.group(2)), float(m.group(4)))
                 for line in open('determinism_logs/airplane.txt') if (m := ack.search(line))])
rows = rows[rows[:, 0] >= 50e3]
groups = [('Master–encoder', rows[rows[:, 1] == 0, 2]),
          ('Controller–motor', rows[np.isin(rows[:, 1], [1, 2, 3]), 2]),
          ('Motor–encoder', rows[rows[:, 1] > 3, 2])]
fig, axes = plt.subplots(1, 3, figsize=(10, 3))
for ax, (label, data) in zip(axes, groups):
    ax.hist(data, bins=20, color=BLUE, edgecolor='white', linewidth=0.5)
    ax.set_title(f'{label}: mean {data.mean():.0f} $\\mu$s, $\\sigma$ = {data.std():.0f} $\\mu$s',
                 fontsize=9, loc='left')
    ax.set_xlabel(r'Per-hop RTT ($\mu$s)')
    ax.set_ylabel('Count')
    style(ax)
fig.tight_layout()
fig.savefig(OUT + 'pdf_RTT.png', dpi=150)
print('saved comparison_capacity.png, failure_multi.png, pdf_grid_cross.png, pdf_RTT.png')
