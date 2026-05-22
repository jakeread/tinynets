"""
Generates Fig 3: histograms of per-hop RTT in a 4x4 grid under varying cross-traffic.
Replaces read_log_cross.m. Run from the sim/ directory.
"""

import re
import numpy as np
import matplotlib.pyplot as plt

D_INIT = 1e3  # discard RTTs before this simulation time (warm-up)
N_TAIL = 500  # use the last N RTT samples (steady state)

LOGS = [
    ('log_cross_5k.txt',  '5 kHz'),
    ('log_cross_10k.txt', '10 kHz'),
    ('log_cross_13k.txt', '13 kHz'),
]

pattern = re.compile(r'\[(\d+)\]: (\d+): got ACK from (\d+)\. RTT = ([\d.]+)')

def read_rtts(filename):
    rows = []
    with open(filename) as f:
        for line in f:
            m = pattern.search(line)
            if m:
                time, node, src, rtt = m.groups()
                rows.append((float(time), int(node), int(src), float(rtt)))
    rows = np.array(rows)
    rows = rows[rows[:, 0] >= D_INIT]   # discard warm-up
    rtts = rows[-N_TAIL:, 3]            # last N samples
    return rtts

fig, axes = plt.subplots(1, 3, figsize=(10, 3), sharey=False)

for ax, (logfile, label) in zip(axes, LOGS):
    rtts = read_rtts(logfile)
    sigma = np.std(rtts)
    ax.hist(rtts, bins=20, color='steelblue', edgecolor='white')
    ax.set_xlabel(r'RTT/hop ($\mu$s)')
    ax.set_ylabel('Count')
    ax.set_title(f'Cross-traffic: {label}\n$\\sigma = {sigma:.0f}\\,\\mu$s')

fig.tight_layout()
fig.savefig('../paper/figures/pdf_grid_cross.png', dpi=150)
print('Saved pdf_grid_cross.png')
