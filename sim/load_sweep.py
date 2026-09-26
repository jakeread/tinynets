"""
Load-capacity comparison on the 4x4 grid (D_process = 37 us, 200 ms runs):
TinyNet vs. single-path shortest-path routing with the default BFS tie-break
and with routes planned for this traffic (optimal_routes.json).

Offered load is a multiple of the paper's 5 kHz main + 10 kHz cross flows.
For each run: delivery ratio of packets sent in [50, 180] ms (matched by
timestamp to TRACE send logs, any return path; mean of the two flows) and mean/sd per-hop RTT of delivered packets.

Run from sim/:  python3 load_sweep.py   (writes load_sweep.json and the figure)
"""

import json
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor

import numpy as np

sys.path.insert(0, 'failure_experiment')
from analyze import delivery_ratio

LOADS  = [0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 1.0, 1.05, 1.1, 1.15, 1.2, 1.3]
CONFIGS = {'tinynet': ('sim_cross.js', {}),
           'bfs':     ('sim_stateful.js', {}),
           'planned': ('sim_stateful.js', {'ROUTES': 'optimal'})}
RUN_MS, T0, T1 = 200, 50.0, 180.0
FLOWS = [(0, 15, 5.0), (3, 12, 10.0)]
SIM   = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'TinyNets')
LOGS  = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'load_sweep_logs')
RTT_RE = re.compile(r'\[(\d+)\]: (\d+): got ACK from (\d+)\. RTT = ([\d.]+)')

def run(cfg, load):
    log = os.path.join(LOGS, f'{cfg}_{load}.txt')
    if not os.path.exists(log):
        script, extra = CONFIGS[cfg]
        args = ['cross', RUN_MS] if script == 'sim_stateful.js' else [10 * load, RUN_MS]
        env = dict(os.environ, D_PKT_US='37', TRACE='1', MAIN_KHZ=str(5 * load),
                   CROSS_KHZ=str(10 * load), **extra)
        with open(log + '.tmp', 'w') as f:
            subprocess.run(['node', 'public_html/' + script, *map(str, args)],
                           cwd=SIM, env=env, stdout=f, check=True)
        os.rename(log + '.tmp', log)
    return log

def metrics(log, load):
    ratios = [delivery_ratio(log, src, dst, T0, T1) for src, dst, _ in FLOWS]
    rtt = np.array([float(m.group(4)) for line in open(log) if (m := RTT_RE.search(line))
                    and float(m.group(1)) / 1e3 >= T0])
    return {'delivered': float(np.mean(ratios)), 'delivered_per_flow': ratios,
            'rtt_mean': float(rtt.mean()), 'rtt_sd': float(rtt.std())}

def main():
    os.makedirs(LOGS, exist_ok=True)
    jobs = [(c, l) for c in CONFIGS for l in LOADS]
    with ThreadPoolExecutor(max_workers=os.cpu_count()) as ex:
        logs = list(ex.map(lambda j: run(*j), jobs))
    out = {c: {} for c in CONFIGS}
    for (c, l), log in zip(jobs, logs):
        out[c][str(l)] = metrics(log, l)
    json.dump(out, open('load_sweep.json', 'w'), indent=1)
    for l in LOADS:
        print(f'{l:5}', '  '.join(f"{c}: {out[c][str(l)]['delivered']:6.1%} "
                                 f"{out[c][str(l)]['rtt_mean']:6.0f}±{out[c][str(l)]['rtt_sd']:<5.0f}"
                                 for c in CONFIGS))

if __name__ == '__main__':
    main()
