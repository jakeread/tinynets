"""
Generates two comparison figures for the paper:
  Fig A: RTT histogram — TinyNet vs. stateful baseline (10 kHz cross-traffic)
  Fig B: Failure recovery — TinyNet vs. stateful baseline (1 node failure)

Run from the sim/ directory.
"""

import re
import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import uniform_filter1d

pattern = re.compile(r'\[(\d+)\]: (\d+): got ACK from (\d+)\. RTT = ([\d.]+)')
D_INIT  = 1e3
D_FAIL  = 11e3
N_TAIL  = 500
SYRUP   = 1e3

def read_rtts(filename, min_time=D_INIT, tail=None):
    rows = []
    with open(filename) as f:
        for line in f:
            m = pattern.search(line)
            if m:
                t, node, src, rtt = m.groups()
                rows.append((float(t), int(node), int(src), float(rtt)))
    if not rows:
        return np.array([])
    arr = np.array(rows)
    arr = arr[arr[:, 0] >= min_time]
    rtts = arr[:, 3]
    if tail is not None:
        rtts = rtts[-tail:]
    return rtts

# -----------------------------------------------------------------------
# Figure 1: RTT distribution under 10 kHz cross-traffic
# -----------------------------------------------------------------------
rtt_tiny     = read_rtts('log_cross_10k.txt', tail=N_TAIL)
rtt_stateful = read_rtts('log_stateful_cross.txt', tail=N_TAIL)

fig, axes = plt.subplots(1, 2, figsize=(8, 3.5), sharey=False)

axes[0].hist(rtt_tiny, bins=25, color='steelblue', edgecolor='white')
axes[0].set_title(f'TinyNet\n$\\sigma = {np.std(rtt_tiny):.0f}\\,\\mu$s')
axes[0].set_xlabel(r'RTT/hop ($\mu$s)')
axes[0].set_ylabel('Count')

axes[1].hist(rtt_stateful, bins=25, color='firebrick', edgecolor='white')
axes[1].set_title(f'Stateful baseline\n$\\sigma = {np.std(rtt_stateful):.0f}\\,\\mu$s')
axes[1].set_xlabel(r'RTT/hop ($\mu$s)')
axes[1].set_ylabel('Count')

fig.suptitle('Per-hop RTT under 10 kHz cross-traffic', fontsize=11)
fig.tight_layout()
fig.savefig('../paper/figures/comparison_cross.png', dpi=150)
print(f'Saved comparison_cross.png  '
      f'(TinyNet σ={np.std(rtt_tiny):.0f} µs, '
      f'Stateful σ={np.std(rtt_stateful):.0f} µs)')

# -----------------------------------------------------------------------
# Figure 2: Failure recovery over time
# -----------------------------------------------------------------------
def read_timeseries(filename, min_time=D_INIT):
    rows = []
    with open(filename) as f:
        for line in f:
            m = pattern.search(line)
            if m:
                t, node, src, rtt = m.groups()
                rows.append((float(t), float(rtt)))
    if not rows:
        return np.array([]), np.array([])
    arr = np.array(rows)
    arr = arr[arr[:, 0] >= min_time]
    return arr[:, 0] / SYRUP, arr[:, 1]

t_tiny,     rtt_t = read_timeseries('log_cross_1f.txt')
t_stateful, rtt_s = read_timeseries('log_stateful_fail.txt')

def smooth(rtt, frac=0.05):
    w = max(1, int(len(rtt) * frac))
    return uniform_filter1d(rtt.astype(float), size=w)

fig2, ax2 = plt.subplots(figsize=(7, 4))
if len(t_tiny) > 0:
    ax2.plot(t_tiny,     smooth(rtt_t), color='steelblue', label='TinyNet')
if len(t_stateful) > 0:
    ax2.plot(t_stateful, smooth(rtt_s), color='firebrick', label='Stateful baseline')
ax2.axvline(D_FAIL / SYRUP, color='black', linewidth=1)
ax2.text(D_FAIL / SYRUP + 0.15, ax2.get_ylim()[1] * 0.1, 'Node Failure', fontsize=9)
ax2.set_xlabel('Time (ms)')
ax2.set_ylabel(r'RTT/hop ($\mu$s)')
ax2.set_ylim(bottom=0)
ax2.legend()
fig2.tight_layout()
fig2.savefig('../paper/figures/comparison_failure.png', dpi=150)
print('Saved comparison_failure.png')
