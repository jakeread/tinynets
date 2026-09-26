"""
Best-case static single-path routes for the corner-to-corner cross-traffic
scenario on an N x N grid.

Searches every combination of shortest paths for the four legs
(main flow, its ACKs, cross flow, its ACKs) and keeps the one that
minimises peak node utilisation. Utilisation counts every node on a path,
endpoints included, at the per-packet cost used by the simulator.

Writes TinyNets/public_html/optimal_routes.json, read by sim_stateful.js
when ROUTES=optimal. Run from the sim/ directory:
    python3 optimal_routes.py 4 5
"""

import itertools
import json
import sys
import numpy as np

D_PKT_US  = 37.0          # hardware-measured processing delay
D_BYTE_US = 1.5 + 0.5     # per-byte interrupt + serialisation at 20 MHz
HEADER    = 5
MAIN_KHZ, CROSS_KHZ = 5.0, 10.0   # relative rates; the optimum is scale-invariant

def cost(size):
    return D_PKT_US + (size + HEADER) * D_BYTE_US

def shortest_paths(n, a, b):
    """All monotone lattice paths between nodes a and b (index = col*n + row)."""
    (ra, ca), (rb, cb) = (a % n, a // n), (b % n, b // n)
    dr, dc = (1 if rb > ra else -1), (1 if cb > ca else -1)
    moves = ['r'] * abs(rb - ra) + ['c'] * abs(cb - ca)
    out = []
    for rows in itertools.combinations(range(len(moves)), abs(rb - ra)):
        r, c, p = ra, ca, [a]
        for k in range(len(moves)):
            if k in rows: r += dr
            else:         c += dc
            p.append(c * n + r)
        out.append(p)
    return out

def all_peaks(n):
    """Peak node utilisation for every shortest-path assignment, and the best one."""
    last = n * n - 1
    legs = [(0, last, MAIN_KHZ, cost(1)), (last, 0, MAIN_KHZ, cost(0)),
            (n - 1, n * (n - 1), CROSS_KHZ, cost(1)), (n * (n - 1), n - 1, CROSS_KHZ, cost(0))]
    paths, loads = [], []
    for a, b, khz, c in legs:
        ps = shortest_paths(n, a, b)
        L = np.zeros((len(ps), n * n))
        for i, p in enumerate(ps):
            L[i, p] += khz * 1e3 * c * 1e-6
        paths.append(ps); loads.append(L)

    # Sum legs 0+1 and 2+3 as pair matrices, then scan pairs of pairs in chunks.
    A = (loads[0][:, None, :] + loads[1][None, :, :]).reshape(-1, n * n)
    B = (loads[2][:, None, :] + loads[3][None, :, :]).reshape(-1, n * n)
    peaks = np.concatenate([(A[i0:i0 + 256, None, :] + B[None, :, :]).max(axis=2).ravel()
                            for i0 in range(0, len(A), 256)])
    k = int(np.argmin(peaks))
    ia, ib = divmod(k, len(B))
    n1, n3 = len(paths[1]), len(paths[3])
    chosen = [paths[0][ia // n1], paths[1][ia % n1], paths[2][ib // n3], paths[3][ib % n3]]
    return peaks, chosen

if __name__ == '__main__':
    out = {}
    for n in map(int, sys.argv[1:] or ['4']):
        peaks, chosen = all_peaks(n)
        print(f'{n}x{n}: best peak node utilisation {peaks.min():.2f} at 5+10 kHz; '
              f'{(peaks >= 1).mean():.0%} of {len(peaks)} assignments overload a node')
        for p in chosen:
            print('   ', ' -> '.join(map(str, p)))
        out[str(n)] = chosen
    with open('TinyNets/public_html/optimal_routes.json', 'w') as f:
        json.dump(out, f, indent=1)
