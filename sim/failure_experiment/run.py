"""
Runs the failure-recovery experiment specified in DESIGN.md.
Run from sim/failure_experiment/:  python3 run.py
Writes logs/ and results.csv.
"""

import csv
import os
import subprocess
from concurrent.futures import ThreadPoolExecutor

import numpy as np
from analyze import flow_metrics

SEED       = 2026
GRID       = 4
K_VALUES   = [1, 2, 3, 4]
TRIALS     = 30
MAIN_KHZ   = 3.0      # 0.6 x paper load
CROSS_KHZ  = 6.0
RUN_AFTER  = 290.0    # ms of simulation after the failure
N          = GRID * GRID
FLOWS      = [('main', 0, N - 1, MAIN_KHZ), ('cross', GRID - 1, GRID * (GRID - 1), CROSS_KHZ)]
ENDPOINTS  = {0, N - 1, GRID - 1, GRID * (GRID - 1)}
CANDIDATES = [n for n in range(N) if n not in ENDPOINTS]
SIM_DIR    = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'TinyNets')

def neighbors(n):
    r, c = n % GRID, n // GRID
    return [(c + dc) * GRID + (r + dr) for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1))
            if 0 <= r + dr < GRID and 0 <= c + dc < GRID]

def connected(a, b, dead):
    seen, stack = {a}, [a]
    while stack:
        u = stack.pop()
        for v in neighbors(u):
            if v not in dead and v not in seen:
                seen.add(v); stack.append(v)
    return b in seen

def trials():
    rng = np.random.default_rng(SEED)
    out = []
    for k in K_VALUES:
        for i in range(TRIALS):
            nodes = sorted(int(x) for x in rng.choice(CANDIDATES, size=k, replace=False))
            t_fail = round(float(rng.uniform(11.0, 13.0)), 3)
            out.append({'k': k, 'trial': i, 'nodes': nodes, 't_fail': t_fail})
    return out

def run_one(tr, proto):
    log = f"logs/{proto}_k{tr['k']}_t{tr['trial']:02d}.txt"
    if not os.path.exists(log):
        env = dict(os.environ, PROTO=proto, GRID=str(GRID), D_PKT_US='37',
                   MAIN_KHZ=str(MAIN_KHZ), CROSS_KHZ=str(CROSS_KHZ),
                   FAIL_NODES=','.join(map(str, tr['nodes'])), FAIL_MS=str(tr['t_fail']),
                   RUN_MS=str(tr['t_fail'] + RUN_AFTER))
        with open(log + '.tmp', 'w') as f:
            subprocess.run(['node', 'public_html/sim_trial.js'], cwd=SIM_DIR, env=env,
                           stdout=f, check=True)
        os.rename(log + '.tmp', log)
    return log

def main():
    os.makedirs('logs', exist_ok=True)
    jobs = [(tr, p) for tr in trials() for p in ('tinynet', 'lfa')]
    with ThreadPoolExecutor(max_workers=os.cpu_count()) as ex:
        logs = list(ex.map(lambda j: run_one(*j), jobs))

    rows = []
    for (tr, proto), log in zip(jobs, logs):
        t_end = tr['t_fail'] + RUN_AFTER
        for name, src, dst, khz in FLOWS:
            row = {'k': tr['k'], 'trial': tr['trial'], 'nodes': ' '.join(map(str, tr['nodes'])),
                   't_fail': tr['t_fail'], 'proto': proto, 'flow': name}
            if not connected(src, dst, set(tr['nodes'])):
                row['excluded'] = True
            else:
                row['excluded'] = False
                row.update(flow_metrics(log, src, dst, tr['t_fail'], t_end))
            rows.append(row)

    fields = ['k', 'trial', 'nodes', 't_fail', 'proto', 'flow', 'excluded',
              'lost', 'blackout_ms', 'recovered', 'sent_in_window']
    with open('results.csv', 'w', newline='') as f:  # primary results (fixed TinyNet)
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    print(f'wrote results.csv ({len(rows)} rows)')

if __name__ == '__main__':
    main()
