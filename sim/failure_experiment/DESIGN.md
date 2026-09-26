# Failure-recovery experiment: TinyNet vs. LFA with realistic coverage

Written 2026-09-26, **before any runs**. Any change to this design after
results are seen must be recorded in the "Deviations" section at the bottom.

## Question
How do TinyNet and a stateful LFA baseline compare in packet loss and
recovery time when 1–4 random nodes fail simultaneously while cross-traffic
is running, when LFA is given only the backup paths RFC 5286 actually
provides?

## Fixed parameters
- Topology: 4x4 grid (the paper's topology).
- D_process = 37 µs (hardware-measured); other timing constants unchanged.
- Traffic: main flow 0 -> 15 and cross flow 3 -> 12, at 0.6x the paper's
  load (3 kHz + 6 kHz). This is the highest load in the load sweep at which
  every configuration, including the traffic-oblivious BFS baseline, is
  stable and lossless before any failure. A higher load would conflate
  overload with failure recovery.
- Failure counts k = 1, 2, 3, 4 simultaneous node failures.
- Candidate nodes: the 12 nodes that are not flow endpoints (0, 3, 12, 15).
- 30 trials per k. Each trial draws a node set uniformly without replacement
  and a failure time uniformly in [11, 13) ms, i.e., one full TinyNet
  liveness-check period, from a seeded RNG (seed 2026). Both protocols see
  exactly the same trials.
- Run length: failure time + 290 ms, long enough to cover LFA's 200 ms
  reconvergence plus a steady-state tail.

## Protocols
**TinyNet**: manager.js, unmodified protocol logic. Logging only is extended
(TRACE=1) so that every delivered acknowledgement is recorded with its send
timestamp, including acknowledgements that return by flood (ACF), which the
existing log omits.

**LFA baseline** (manager_stateful.js, LFA_MODE=realistic): single-path BFS
routing before the failure (same tie-break as the existing baseline). On
failure:
1. From the failure until detection, neighbors keep forwarding into the
   dead links; those packets are lost.
2. Detection at t_f + 10 ms: BFD at 3.3 ms x 3, the fastest vendor-documented
   configuration (Cisco NCS 4200). Switchover time is taken as zero.
3. At detection, each neighbor of a failed node repairs every destination
   whose primary next hop is dead with an RFC 5286 LFA computed on the
   pre-failure topology: node-protecting if one exists, otherwise
   link-protecting (loop-free condition only), otherwise none. Other nodes
   keep their pre-failure tables, as in real LFA.
4. Full IGP reconvergence at t_f + 200 ms: every node recomputes BFS on the
   post-failure topology. The 200 ms value is the OSPF reconvergence figure
   the paper already cites. It is a parameter and is reported as such.
5. A 64-hop TTL discards packets caught in transient loops.

## Metrics (per trial, per flow)
A packet counts as delivered when its acknowledgement reaches the sender
(any path: ACK or ACF). Duplicates count once.
- **Lost packets**: packets sent in [t_f, t_end - 20 ms] that are never
  delivered.
- **Blackout**: longest gap between consecutive deliveries after t_f.
- **Recovered**: delivery ratio of packets sent in the final 50 ms is at
  least 95%.

A flow whose endpoints are disconnected in the post-failure graph is
excluded from that trial for both protocols, and the number of exclusions
is reported.

## Reporting
For each k and protocol: median and interquartile range of lost packets and
blackout, fraction of flows recovered, and the number of excluded flows. All
trials are reported. None are dropped for being outliers.

## Deviations
1. **Blackout metric (analysis fix, 2026-09-26, after the first run).** As
   first implemented, blackout was the longest gap between deliveries and
   ignored the silence after the last delivery, which understated outages
   for flows that never resumed. It now includes the gap to t_end. This
   affects only non-recovered flows, which occur under both protocols.
2. **Secondary analysis added (2026-09-26, after the first run).** Inspecting
   a TinyNet non-recovery (k = 2, nodes 1 and 5) showed buffer overflow
   caused by a bug in manager.js: ACK-flood (ACF) deduplication compares a
   freshly built object with `includes`, which never matches, and records
   `data: null`, so flooded ACKs are never deduplicated. Fixing it (use
   `hasSeen` with the packet's timestamp, as STF already does) turns that
   trial into a normal recovery. The primary results use the unmodified
   protocol as specified above. The full experiment is also rerun with the
   fix as a clearly labeled secondary analysis; the LFA arm is unchanged.
3. **Fix adopted (2026-09-26, author decision).** The ACK-flood deduplication
   fix is now part of manager.js, and every TinyNet result in the paper is
   regenerated with it. The paper reports the experiment on the fixed
   protocol. The results on the unfixed protocol are kept in
   results_unfixed.csv as a record, and the paper discloses the bug and its
   effect.
4. **Loss accounting (analysis fix, 2026-09-26).** Packets were first matched
   to a send schedule reconstructed from the flow rate. Both simulators
   timestamp a packet when it leaves the source, not when it is generated,
   so packets delayed in the source queue were miscounted as lost (for both
   protocols). Both managers now log every source transmission in TRACE
   mode, and a packet is lost if no acknowledgement carrying its timestamp
   returns. The metric definitions are otherwise unchanged. All runs were
   repeated to produce the send logs.
5. **Per-byte time (author decision, 2026-09-26).** D_byte was changed from
   1.25 µs to 1.5 µs, the value stated in the paper and derived from the
   MCU's interrupt service routine. All runs were repeated. The 0.6x load
   remains the highest load at which every configuration is stable before
   any failure, so the design is otherwise unchanged. results_unfixed.csv
   was regenerated under the same settings.
