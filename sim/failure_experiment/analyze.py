"""
Per-flow delivery accounting from TRACE logs (see DESIGN.md).

With TRACE=1 both managers log every source transmission
("sent to <dst> (t0=...)") and every acknowledgement that reaches the source,
by any path ("got ACK" or "got flood ACK", carrying the same t0). A packet
is delivered when an acknowledgement with its t0 comes back; duplicates
count once. Packets are matched by timestamp, so source queueing delay does
not affect the accounting.
"""

import re
import numpy as np

SYRUP  = 1000.0
ACK_RE  = re.compile(r'\[(\d+)\]: (\d+): got (?:flood )?ACK from (\d+)\b.*\(t0=([\d.]+)\)')
SENT_RE = re.compile(r'\[\d+\]: (\d+): sent to (\d+) \(t0=([\d.]+)\)')

def read_flow(log_path, src, dst):
    """(sorted unique send times, {send time: first delivery time}), in ms."""
    sent, got = set(), {}
    with open(log_path) as f:
        for line in f:
            m = SENT_RE.search(line)
            if m:
                if int(m.group(1)) == src and int(m.group(2)) == dst:
                    sent.add(float(m.group(3)) / SYRUP)
                continue
            m = ACK_RE.search(line)
            if m and int(m.group(2)) == src and int(m.group(3)) == dst:
                t, t0 = float(m.group(1)) / SYRUP, float(m.group(4)) / SYRUP
                if t0 not in got or t < got[t0]:
                    got[t0] = t
    return np.array(sorted(sent)), got

def delivery_ratio(log_path, src, dst, t0, t1):
    sent, got = read_flow(log_path, src, dst)
    s = sent[(sent >= t0) & (sent <= t1)]
    return float(np.mean([x in got for x in s])) if len(s) else float('nan')

def flow_metrics(log_path, src, dst, t_fail, t_end):
    """t_end must be the end of the simulated run."""
    sent, got = read_flow(log_path, src, dst)
    window = sent[(sent >= t_fail) & (sent <= t_end - 20.0)]
    lost = int(sum(s not in got for s in window))

    # Include the final silence up to t_end, so a flow that never resumes
    # gets its full outage rather than only its longest interior gap.
    arrivals = np.array(sorted(t for t in got.values() if t >= t_fail - 1.0) + [t_end])
    blackout = float(np.diff(arrivals).max()) if len(arrivals) > 1 else float(t_end - t_fail)

    tail = sent[(sent >= t_end - 70.0) & (sent <= t_end - 20.0)]
    recovered = bool(np.mean([s in got for s in tail]) >= 0.95) if len(tail) else False
    return {'lost': lost, 'blackout_ms': blackout, 'recovered': recovered,
            'sent_in_window': int(len(window))}
