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
# Figure 2: Cumulative packets delivered under node failure
# -----------------------------------------------------------------------
ROWS = 4; COLS = 4
PLOT_END = 70 * SYRUP   # ms: well past stateful recovery at ~61.5 ms

def read_delivery_times(filename, node_filter=0, src_filter=ROWS*COLS-1):
    """Return sorted array of ACK arrival times (ms) for the given node pair."""
    times = []
    with open(filename) as f:
        for line in f:
            m = pattern.search(line)
            if m:
                t, node, src, rtt = m.groups()
                if int(node) != node_filter or int(src) != src_filter:
                    continue
                tf = float(t)
                if tf < D_INIT or tf > PLOT_END:
                    continue
                times.append(tf / SYRUP)
    return np.array(sorted(times))

t_tiny_d = read_delivery_times('log_fail_clean.txt')
t_stat_d = read_delivery_times('log_stateful_fail.txt')

fig2, ax2 = plt.subplots(figsize=(7, 4))

for times, color, label in [
    (t_tiny_d, 'steelblue', 'TinyNet'),
    (t_stat_d, 'firebrick', 'Stateful (LFA)'),
]:
    if len(times) == 0:
        continue
    counts = np.arange(1, len(times) + 1)
    # Prepend the origin so the line starts at zero at the first delivery time
    ax2.step(np.concatenate([[times[0]], times]),
             np.concatenate([[0], counts]),
             where='post', color=color, label=label, linewidth=1.5)

t_fail = D_FAIL / SYRUP
ax2.axvline(t_fail, color='black', linewidth=1, linestyle='--', alpha=0.8)
ax2.text(t_fail + 0.4, 1, 'Node failure', ha='left', va='bottom', fontsize=8)

# Locate the stateful blackout as the longest inter-arrival gap.
gaps = np.diff(t_stat_d)
gi = int(np.argmax(gaps))
t_blackout_start = t_stat_d[gi]
t_blackout_end   = t_stat_d[gi + 1]
n_stat_at_gap    = gi + 1          # cumulative count on the flat segment

# Place the annotation in the white space between the two lines at the gap midpoint.
t_mid = (t_blackout_start + t_blackout_end) / 2
n_tiny_at_mid = int(np.sum(t_tiny_d <= t_mid))
y_arrow = (n_stat_at_gap + n_tiny_at_mid) / 2   # midpoint between the two lines

ax2.annotate('', xy=(t_blackout_end, y_arrow), xytext=(t_blackout_start, y_arrow),
             arrowprops=dict(arrowstyle='<->', color='firebrick', lw=1.2))
ax2.text(t_mid, y_arrow + 3,
         f'{t_blackout_end - t_blackout_start:.0f} ms blackout',
         ha='center', va='bottom', color='firebrick', fontsize=8)

ax2.set_xlabel('Time (ms)')
ax2.set_ylabel('Cumulative packets delivered')
ax2.set_xlim(D_INIT / SYRUP, PLOT_END / SYRUP)
ax2.legend(loc='upper left')
fig2.tight_layout()
fig2.savefig('../paper/figures/comparison_failure.png', dpi=150)
print('Saved comparison_failure.png')
