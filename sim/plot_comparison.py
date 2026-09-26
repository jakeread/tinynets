"""
Generates the single-failure comparison figure for the paper: cumulative
packets delivered, TinyNet vs. the LFA baseline at several cutover windows.
(The former cross-traffic histogram is replaced by comparison_capacity.png,
see plot_revision.py.)

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
# Figure 2: Cumulative packets delivered under node failure
#
# All runs use the hardware-measured D_process = 37 us. Generate from sim/TinyNets/:
#   export D_PKT_US=37
#   for t in $(seq 11.0 0.1 12.9); do
#     FAIL_MS=$t node public_html/sim_fail.js > ../lfa_sweep/tinynet_phase/tn_$t.txt; done
#   for ms in 3 10 50 150; do
#     FAIL_MS=11.3 LFA_MS=$ms node public_html/sim_stateful.js fail 200 \
#       > ../lfa_sweep/log_stateful_fail_$ms.txt; done
#   for ms in 3 10 50; do   # plotted runs, aligned with T_FAIL below
#     FAIL_MS=11.0 LFA_MS=$ms node public_html/sim_stateful.js fail 200 \
#       > ../lfa_sweep/fig_stateful_fail_$ms.txt; done
# -----------------------------------------------------------------------
import glob

ROWS = 4; COLS = 4
PLOT_END = 70 * SYRUP   # ms: past the 50 ms LFA recovery
T_FAIL   = 11.0         # plotted failure time: TinyNet blackout closest to its phase mean
RATE     = 1 / 0.2      # packets per ms (5 kHz source)

LFA_SWEEP   = [3, 10, 50, 150]
LFA_PLOTTED = [(3,  '#e8875e', (0, (4, 2))),  # hypothetical matched detection
               (10, '#c8452c', '-'),          # 3.3 ms x 3 hardware-offloaded BFD
               (50, '#7a1a14', '-')]          # vendor-stated convergence bound

def read_delivery_times(filename, node_filter=0, src_filter=ROWS*COLS-1, end=PLOT_END):
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
                if tf < D_INIT or tf > end:
                    continue
                times.append(tf / SYRUP)
    return np.array(sorted(times))

def blackout(times, t_fail):
    """Longest post-failure gap between deliveries (ms)."""
    post = times[times >= t_fail - 0.5]
    return np.diff(post).max()

phase = []
for fn in sorted(glob.glob('lfa_sweep/tinynet_phase/tn_*.txt')):
    t_fail = float(fn.split('_')[-1][:-4])
    phase.append(blackout(read_delivery_times(fn, end=300 * SYRUP), t_fail))
phase = np.array(phase)
print(f'\nTinyNet over {len(phase)} failure phases: blackout mean {phase.mean():.1f} '
      f'({phase.min():.1f}-{phase.max():.1f}) ms, lost mean {(phase*RATE-1).mean():.0f} '
      f'({(phase*RATE-1).min():.0f}-{(phase*RATE-1).max():.0f})')
for ms in LFA_SWEEP:
    g = blackout(read_delivery_times(f'lfa_sweep/log_stateful_fail_{ms}.txt', end=300 * SYRUP), 11.3)
    print(f'  LFA {ms:>4} ms: blackout {g:5.1f} ms, lost {g*RATE-1:4.0f}')

fig2, ax2 = plt.subplots(figsize=(7, 4))

series = [(read_delivery_times(f'lfa_sweep/tinynet_phase/tn_{T_FAIL}.txt'),
           '#2a78d6', '-', 'TinyNet')]
for ms, color, ls in LFA_PLOTTED:
    series.append((read_delivery_times(f'lfa_sweep/fig_stateful_fail_{ms}.txt'),
                   color, ls, f'LFA, {ms} ms cutover'))

for times, color, ls, label in series:
    counts = np.arange(1, len(times) + 1)
    # Prepend the origin so the line starts at zero at the first delivery time
    ax2.step(np.concatenate([[times[0]], times]),
             np.concatenate([[0], counts]),
             where='post', color=color, linestyle=ls, label=label, linewidth=1.5)

ax2.axvline(T_FAIL, color='black', linewidth=1, linestyle='--', alpha=0.8)
ax2.text(T_FAIL + 0.4, 1, 'Node failure', ha='left', va='bottom', fontsize=8)

ax2.set_xlabel('Time (ms)')
ax2.set_ylabel('Cumulative packets delivered')
ax2.set_xlim(D_INIT / SYRUP, PLOT_END / SYRUP)
ax2.spines[['top', 'right']].set_visible(False)
ax2.grid(axis='y', color='#e5e5e5', linewidth=0.6)
ax2.legend(loc='upper left', frameon=False, fontsize=8)
fig2.tight_layout()
fig2.savefig('../paper/figures/comparison_failure.png', dpi=150)
print('Saved comparison_failure.png')
