"""
TinyNet determinism experiments, all with one method:
200 ms of simulated time at D_process = 37 us; statistics from t >= 50 ms;
a configuration is flagged unstable if mean per-hop RTT drifts by more than
20% between [50, 100) ms and [150, 200) ms.

Runs from the sim/ directory and writes logs to determinism_logs/ and a
summary to determinism.json:
  - grid:        4x4 grid, 5 kHz main flow + 5/10/13 kHz cross-traffic
  - sensitivity: 10 kHz cross-traffic, D_process/D_byte/L_br each +-30%
  - airplane:    airplane-wing topology (sim_airplane.js) at 20% of its sim.js rates
"""

import json
import os
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor

import numpy as np

RUN_MS, T_STEADY = 200, 50.0
AIRPLANE_SCALE = 0.2
BASE = {'D_PKT_US': 37.0, 'D_BYTE_US': 1.5, 'BITRATE_MHZ': 20.0}
ACK_RE = re.compile(r'\[(\d+)\]: (\d+): got ACK from (\d+)\. RTT = ([\d.]+)')
SIM = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'TinyNets')
LOGS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'determinism_logs')

def run(name, script, args=(), **env_over):
    log = os.path.join(LOGS, name + '.txt')
    if not os.path.exists(log):
        env = dict(os.environ, **{k: str(v) for k, v in {**BASE, **env_over}.items()})
        with open(log + '.tmp', 'w') as f:
            subprocess.run(['node', 'public_html/' + script, *map(str, args)],
                           cwd=SIM, env=env, stdout=f, check=True)
        os.rename(log + '.tmp', log)
    return log

def read(log):
    rows = [(float(m.group(1)) / 1e3, int(m.group(2)), int(m.group(3)), float(m.group(4)))
            for line in open(log) if (m := ACK_RE.search(line))]
    return np.array(rows)

def stats(rows):
    ss = rows[rows[:, 0] >= T_STEADY]
    early = ss[ss[:, 0] < 100][:, 3].mean()
    late = ss[ss[:, 0] >= 150][:, 3].mean()
    return {'n': int(len(ss)), 'mean': float(ss[:, 3].mean()), 'sd': float(ss[:, 3].std()),
            'drift_pct': float(100 * (late - early) / early),
            'stable': bool(abs(late - early) / early <= 0.2)}

def main():
    os.makedirs(LOGS, exist_ok=True)
    jobs = {}
    for khz in (5, 10, 13):
        jobs[f'grid_{khz}k'] = ('sim_cross.js', (khz, RUN_MS), {'MAIN_KHZ': 5, 'CROSS_KHZ': khz})
    for param in ('D_PKT_US', 'D_BYTE_US', 'BITRATE_MHZ'):
        for scale in (0.7, 1.3):
            jobs[f'sens_{param}_{scale}'] = ('sim_cross.js', (10, RUN_MS),
                                             {'MAIN_KHZ': 5, 'CROSS_KHZ': 10, param: BASE[param] * scale})
    # The airplane wing saturates above ~30% of the sim.js rates (controllers
    # overflow); it is evaluated at 20%, which is stable with margin.
    jobs['airplane'] = ('sim_airplane.js', (RUN_MS,), {'RATE_SCALE': AIRPLANE_SCALE})

    with ThreadPoolExecutor(max_workers=os.cpu_count()) as ex:
        logs = dict(zip(jobs, ex.map(lambda k: run(k, jobs[k][0], jobs[k][1], **jobs[k][2]), jobs)))

    out = {}
    for name, log in logs.items():
        rows = read(log)
        if name == 'airplane':
            out[name] = {'master-encoder': stats(rows[rows[:, 1] == 0]),
                         'controller-motor': stats(rows[np.isin(rows[:, 1], [1, 2, 3])]),
                         'motor-encoder': stats(rows[rows[:, 1] > 3])}
        else:
            out[name] = stats(rows)
    json.dump(out, open('determinism.json', 'w'), indent=1)
    for k, v in out.items():
        print(k, json.dumps(v))

if __name__ == '__main__':
    main()
