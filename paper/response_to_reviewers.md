# Response to Reviewers

**Manuscript:** A Lightweight Networking Strategy for Robotic Control Systems

We thank the reviewers for their careful reading of the manuscript. Below we reproduce each comment and describe our response. Changes in the revised manuscript are shown in red. In addressing Comment 1 we re-examined every comparative result in the evaluation. This led to further corrections and a restructured evaluation, which we describe under "Additional changes" at the end of this letter.

---

## Comment 1

> *The baseline setting for LFA comparison is unfair. The author fixed the LFA recovery time at 50 ms (the worst BFD window), but modern LFA combined with shorter BFD intervals can achieve much lower switching than this. This comparison overestimates TinyNet's relative advantage and should be adjusted to a more realistic LFA configuration, or it should be clearly stated that this baseline is only a conservative upper limit.*

**Response.** We agree that a single 50 ms value was insufficiently justified. We have made three changes:
1. We evaluate LFA at several configurations taken from vendor documentation.
2. We state explicitly which of them is a best case for LFA, and add a hypothetical configuration that isolates the source of TinyNet's advantage.
3. We add an experiment with a more realistic LFA model that accounts for alternate coverage and multiple failures.

**Realistic LFA configurations.** LFA recovery time is dominated by failure detection. With BFD, detection time is the negotiated transmit interval multiplied by the detect multiplier (RFC 5880). The fastest configuration we found documented is hardware-offloaded BFD at a 3.3 ms interval with a multiplier of 3, about 10 ms detection, for which the vendor states total convergence of *under 50 ms* (Cisco NCS 4200 BFD configuration guide). Other platforms document considerably longer limits: Arista EOS has a 50 ms minimum interval and a minimum multiplier of 3 (≥150 ms detection), and Juniper recommends minimum intervals of 100–300 ms with a multiplier of 3. The 50 ms value in our original submission therefore matches the vendor-stated convergence bound for the most aggressive documented BFD configuration; it is not the worst-case BFD window. We nevertheless accept the reviewer's point that it is not a best case for LFA, and the revised comparison adds one.

**Single failure, sweep of cutover windows (Section 5.7.1).** The baseline's cutover window $T_{\mathrm{LFA}}$ is now a parameter. We evaluate four values:

- 10 ms: BFD detection alone at 3.3 ms × 3. This ignores switchover time, making it a best case for LFA.
- 50 ms: the vendor-stated convergence bound for that configuration.
- 150 ms: detection at the 50 ms × 3 minimum.
- 3 ms: a hypothetical value, below any documented BFD configuration, matching the detection budget of TinyNet's heartbeat mechanism.

TinyNet detects failures with a periodic liveness check, so its blackout depends on when the failure falls within the check period. We therefore report TinyNet as the mean and range over 20 failure times spanning one full check period.

| Configuration | Blackout | Packets lost |
|---|---|---|
| TinyNet (mean over 20 failure times; range) | 3.7 ms (2.7–4.7) | 14 (10–19) |
| LFA, 3 ms (hypothetical, matched detection) | 3.4 ms | 14 |
| LFA, 10 ms (3.3 ms × 3 hardware BFD, best case) | 10.4 ms | 49 |
| LFA, 50 ms (vendor-stated convergence) | 50.4 ms | 249 |
| LFA, 150 ms (50 ms × 3 BFD) | 150.4 ms | 749 |

Against the best-case documented LFA configuration, TinyNet's blackout is about one third as long, with between a third and a quarter as many packets lost. That is a much smaller margin than the "order of magnitude" we previously claimed, and we have removed that claim throughout. The hypothetical 3 ms configuration shows where the remaining advantage comes from: given the same detection budget, LFA matches TinyNet exactly. TinyNet's single-failure recovery is therefore set by its link-local detection rate, not by any inherent advantage of flooding over pre-computed alternates, and we now say so explicitly.

**Coverage-aware LFA with multiple failures (new Section 5.7.2).** The model above assumes an alternate always exists. To test LFA more realistically, we added an experiment with a second LFA model:

- **Detection:** BFD detects the failure after 10 ms. Until then, neighbors keep forwarding into the dead links.
- **Repair:** each neighbor of a failed node then switches to an RFC 5286 alternate computed on the pre-failure topology, where one exists, and drops the traffic otherwise.
- **Reconvergence:** all routes are recomputed after a 200 ms IGP reconvergence time.

We fixed the design and analysis before running it: 30 random trials for each of 1–4 simultaneous node failures, with cross-traffic running and identical trials for both protocols.

| Failures | TinyNet packets lost (median [IQR]) | LFA packets lost (median [IQR]) | TinyNet blackout (median) | LFA blackout (median) |
|---|---|---|---|---|
| 1 | 3 [0–8] | 0 [0–599] | 1.2 ms | 0.5 ms |
| 2 | 9 [0–17] | 598 [22–1197] | 3.3 ms | 200 ms |
| 3 | 10 [3–15] | 599 [29–1197] | 3.4 ms | 200 ms |
| 4 | 13 [7–21] | 599 [30–1197] | 3.9 ms | 200 ms |

With a single failure, LFA usually loses nothing, but in 30% of flows no usable alternate existed and the flow was dark until reconvergence. With two or more failures, the median LFA flow waits for reconvergence. The paper notes that LFA's losses scale with the assumed 200 ms reconvergence time.

We also report a limitation this experiment revealed. TinyNet failed to recover in 1 of 213 flows. In that trial the failures isolated one flow's destination, and TinyNet's flooding of packets for that unreachable destination congested the surviving network. The paper now discusses this, and it is listed as future work in the Conclusion.

**Changes to the manuscript.**
- **Section 5.5 (new, Stateful Routing Baseline):** defines the baseline, both LFA models, and the vendor-documented BFD limits.
- **Section 5.7.1 (Single Failure and Failure Detection):** the $T_{\mathrm{LFA}}$ sweep with new Table 3, and a regenerated Fig. 8.
- **Section 5.7.2 (new, Multiple Simultaneous Failures):** the coverage-aware experiment, with new Fig. 9 and Table 4. It replaces the previous robustness figure.
- **Section 2 (Related Work), IP-Layer Fast Reroute and Position of TinyNet:** these now cite documented BFD limits and state that LFA narrows the single-failure gap to a small factor, with the remainder due to detection rate. The "roughly one order of magnitude" claim is removed.
- **Section 1 (Introduction):** no longer describes 50 ms as the floor for Fast Reroute.
- **References:** added RFC 5880 (BFD), RFC 7490 (Remote LFA), and the Cisco, Juniper, and Arista BFD documentation.

---

## Additional changes

In re-running the comparisons for Comment 1, we found problems with several other results in the submitted manuscript. We describe them here so that the reviewers can see every substantive change.

**1. The cross-traffic comparison and the "39% jitter reduction" claim were withdrawn and replaced.** The submitted text reported σ = 85 µs for TinyNet versus 139 µs for the single-path baseline. The 139 µs value came from an earlier version of the baseline simulator; the figure had been regenerated with a corrected version (σ = 260 µs) without updating the text. More importantly, neither value is meaningful. The baseline's default routing sent both flows through the same nodes and overloaded them, so its RTT grew without bound and its σ depended only on simulation length. With routes planned for the traffic, single-path routing has *lower* jitter than TinyNet. We therefore replaced the σ comparison with a capacity comparison (new Section 5.6, Fig. 7):

| Configuration | Stable up to (× 5 kHz + 10 kHz) |
|---|---|
| Single-path routing, default routes | 0.6× |
| Single-path routing, planned routes | 1.0× |
| TinyNet | 1.15× |

TinyNet sustains about 1.9 times the load of the default single-path baseline and matches the capacity of planned routes without any knowledge of the traffic, but planned routes deliver lower jitter below saturation. The paper now says so plainly, and the abstract no longer claims a jitter reduction.

**2. Simulator corrections.** We found and fixed four problems, and all simulation results in the revision were regenerated after these fixes:
- *Processing delay.* The paper states the hardware-measured D_process = 37 µs, but most simulation scripts used 30 µs. All results now use 37 µs.
- *Per-byte time.* The paper states D_byte = 1.5 µs, which matches its derivation from the MCU's interrupt service routine (450 cycles at 300 MHz), but the simulator used 1.25 µs. All results now use 1.5 µs.
- *Flooded acknowledgements.* TinyNet's simulator never deduplicated flooded acknowledgements, which could circulate until buffers overflowed after multiple failures. Our router firmware bounds floods with a hop-count limit and is not affected. Before the correction, TinyNet failed to recover in 11 of 213 flows in the multiple-failure experiment; after it, 1 of 213. The paper discloses this.
- *Loss accounting.* Packet loss is now determined per packet, by whether its acknowledgement returns.

**3. Determinism results use a steady-state method.** The grid determinism results (Fig. 5) and the sensitivity analysis (Table 2) were previously taken over the first 30–60 ms of simulation, which included the start-up transient. They are now taken in steady state ($t \geq 50$ ms of a 200 ms run):
- With 5 kHz cross-traffic, σ = 7 µs.
- With 10 kHz cross-traffic, σ = 25 µs (previously reported as 85 µs).
- With 13 kHz cross-traffic, the network exceeds its capacity and RTT grows without bound. Previously this was reported as σ = 140 µs.

**4. Airplane-wing evaluation re-run at a sustainable traffic level (Section 5.4.2, Fig. 6).** Re-running the airplane-wing scenario with the same steady-state method showed that its nominal traffic exceeds the network's capacity. The three controllers carry every controller–motor loop and all master traffic, and they overflow; at the nominal rates, fewer than 5% of controller–motor packets are delivered. The submitted σ values (7–45 µs) came from a 30 ms run that had delivered only about a third of its packets, and the submitted caption misstated the topology (24 motors and encoders instead of 8). Scaling all rates together, the network is stable up to about 30% of the nominal rates. We now evaluate it at 20% (500 Hz motor–encoder, 200 Hz controller–motor, 100 Hz master–encoder), where every packet is delivered and σ is 29 µs (master–encoder), 66 µs (controller–motor), and under 1 µs (motor–encoder). The paper states the reduced rates and the capacity limit explicitly.

**5. Removed and revised claims.**
- *Recovery times.* The previous recovery times (1.3–3.9 ms) and the statement that four failures did not converge came from simulation logs that we could not regenerate. They are replaced by the multiple-failure experiment above.
- *Abstract, graphical abstract and Conclusion.* The abstract and graphical abstract are updated accordingly, and the Conclusion now states the two limitations identified above.
