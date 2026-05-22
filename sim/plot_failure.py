"""
Generates Fig 5: message delay before and after random node failures.
Replaces read_log_fail.m. Run from the sim/ directory.
"""

import re
import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import uniform_filter1d

D_INIT = 1e3
D_FAIL = 11e3
SYRUP  = 1e3  # simulation time units per ms

pattern = re.compile(r'\[(\d+)\]: (\d+): got ACK from (\d+)\. RTT = ([\d.]+)')

def read_log(filename):
    rows = []
    with open(filename) as f:
        for line in f:
            m = pattern.search(line)
            if m:
                time, node, src, rtt = m.groups()
                rows.append((float(time), int(node), int(src), float(rtt)))
    return np.array(rows) if rows else np.empty((0, 4))

LOGS = [
    ('log_cross_1f.txt', '1 Node Failure, $T_r=1.3$ ms'),
    ('log_cross_2f.txt', '2 Node Failures, $T_r=1.9$ ms'),
    ('log_cross_3f.txt', '3 Node Failures, $T_r=3.9$ ms'),
    ('log_cross_4f.txt', '4 Node Failures, fatal'),
]

fig, ax = plt.subplots(figsize=(7, 4))

colors = ['steelblue', 'darkorange', 'seagreen', 'firebrick']

for (logfile, label), color in zip(LOGS, colors):
    arr = read_log(logfile)
    if arr.shape[0] == 0:
        continue
    # For 1-failure case: show from D_INIT; others from D_FAIL (matches MATLAB logic)
    if '1f' in logfile:
        data = arr[arr[:, 0] >= D_INIT]
    else:
        data = arr[arr[:, 0] >= D_FAIL]
    if data.shape[0] == 0:
        continue
    t = data[:, 0] / SYRUP        # convert to ms
    rtt = data[:, 3]
    # Smooth with a window (equivalent to MATLAB smooth())
    window = max(1, len(rtt) // 20)
    rtt_smooth = uniform_filter1d(rtt.astype(float), size=window)
    ax.plot(t, rtt_smooth, label=label, color=color)

ax.axvline(D_FAIL / SYRUP, color='black', linestyle='-', linewidth=1)
ax.text(D_FAIL / SYRUP + 0.1, 20, 'Node Failure', fontsize=9)
ax.set_ylim(0, 200)
ax.set_xlabel('Time (ms)')
ax.set_ylabel(r'RTT/hop ($\mu$s)')
ax.legend(fontsize=8)
fig.tight_layout()
fig.savefig('../paper/figures/node_failure_recovery.png', dpi=150)
print('Saved node_failure_recovery.png')
