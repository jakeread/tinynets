"""
Generates Fig 4: histograms of per-hop RTT in the simulated airplane wing network.
Replaces read_log.m. Run from the sim/ directory.
"""

import re
import numpy as np
import matplotlib.pyplot as plt

D_INIT = 25e3  # discard RTTs before this simulation time (warm-up)

CTRL_IDS = {1, 2, 3}

pattern = re.compile(r'\[(\d+)\]: (\d+): got ACK from (\d+)\. RTT = ([\d.]+)')

def read_log(filename):
    rows = []
    with open(filename) as f:
        for line in f:
            m = pattern.search(line)
            if m:
                time, node, src, rtt = m.groups()
                rows.append((float(time), int(node), int(src), float(rtt)))
    return np.array(rows)

arr = read_log('log.txt')
arr = arr[arr[:, 0] >= D_INIT]

k1 = arr[arr[:, 1] == 0, 3]               # master (node 0)
k2 = arr[np.isin(arr[:, 1], [1,2,3]), 3]  # controllers (nodes 1-3)
k3 = arr[arr[:, 1] > 3, 3]               # motors/encoders (nodes 4+)

groups = [
    (k1, rf'Master–encoder: $\sigma={np.std(k1):.0f}\,\mu$s'),
    (k2, rf'Controller–motor: $\sigma={np.std(k2):.0f}\,\mu$s'),
    (k3, rf'Motor–encoder: $\sigma={np.std(k3):.0f}\,\mu$s'),
]

fig, axes = plt.subplots(1, 3, figsize=(10, 3), sharey=False)

colors = ['steelblue', 'darkorange', 'seagreen']
for ax, (data, label), color in zip(axes, groups, colors):
    ax.hist(data, bins=20, color=color, edgecolor='white')
    ax.set_xlabel(r'RTT/hop ($\mu$s)')
    ax.set_ylabel('Count')
    ax.set_title(label)

fig.tight_layout()
fig.savefig('../paper/figures/pdf_RTT.png', dpi=150)
print('Saved pdf_RTT.png')
