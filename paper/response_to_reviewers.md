# Response to Reviewers

We thank the reviewers for their careful consideration and comments. Edits to the paper are implemented in red text.

## Reviewer 1

### Comment 1.1

**Reviewer:** The baseline setting for LFA comparison is unfair. The author fixed the LFA recovery time at 50 ms (the worst BFD window), but modern LFA combined with shorter BFD intervals can achieve much lower switching than this. This comparison overestimates TinyNet's relative advantage and should be adjusted to a more realistic LFA configuration, or it should be clearly stated that this baseline is only a conservative upper limit.

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

### Comment 1.2

**Reviewer:** The description of TSN does not match the facts. The paper claims that the existing solution lacks multi-path support, but TSN's FRER (802.1CB) achieves explicit multi-path redundancy through dual send select receive. This discussion ignores the characteristic of FRER that does not require re convergence, and needs to revise the positioning of TSN and redefine TinyNet's unique contribution.

**Response.** The reviewer is correct. FRER (IEEE 802.1CB) achieves path redundancy without post-failure reconvergence by replicating frames across disjoint paths and eliminating duplicates at the receiver, and the submitted manuscript's abstract overstated the claim by saying existing solutions "lack multipath routing support." We have corrected this.

**Distinction from FRER.** FRER and TinyNet occupy different points in the design space, and we now say so explicitly in both the Introduction and the Related Work section. The key differences are:

- **Configuration model.** FRER requires a Centralized Network Configuration entity (CNC/CNE, defined in IEEE 802.1Qcc) to compute and install the replication trees and sequence-recovery state on each bridge before traffic flows. TinyNet requires no offline configuration; each node makes forwarding decisions using only its local LUT and the buffer-depth heartbeats it receives from immediate neighbors.
- **Adaptation to congestion.** FRER replicates frames on static pre-configured paths; it does not respond to runtime congestion. TinyNet's cost function weights hop count against downstream buffer occupancy and shifts load away from congested paths at each hop.
- **Failure model.** FRER's no-reconvergence property holds as long as at least one pre-configured path remains intact. If all pre-configured paths fail, or if the topology changes in a way not anticipated at configuration time, a CNC/CNE must reconfigure the network. TinyNet floods and re-learns routes without any central coordination.

TinyNet's contribution is therefore not that it is the first protocol with multipath redundancy, but that it is the first to provide multipath routing for NCS that adapts to both failures and congestion at runtime, without offline path planning or a centralized configuration entity. We have revised the abstract and introduction to state this precisely, and the Related Work section already characterized FRER in these terms; we have left that paragraph unchanged.

**Changes to the manuscript.**
- **Abstract:** replaced "lack multipath routing support" with "provide no adaptive multipath routing without offline path planning and a centralized configuration entity."
- **Section 1 (Introduction):** added a sentence acknowledging FRER and explaining why it requires a Centralized Network Configuration entity; revised the positioning statement to define TinyNet's contribution relative to FRER rather than claiming novelty of multipath per se.
- **Section 2 (Related Work):** no change; the existing paragraph already correctly characterized FRER as achieving a similar goal to TinyNet's flooding "without paying the cost of post-failure reconvergence" and noted the difference in design-space position.

---

### Comment 1.3

**Reviewer:** Key performance indicators lack hardware validation. The 39% reduction in jitter and 1.3-3.9 ms recovery time mentioned in the article are only from simulation, and Section 5.2 explicitly acknowledges that 'hardware validation is still a future work'. The empirical statements in the title and abstract do not match the evidence in the main text, and hardware testing must be supplemented or the relevant statements significantly weakened.

**Response.** The reviewer is correct that the abstract's framing did not match the evidence. We cannot add further hardware experiments. In preparing this response we also audited the simulation and found several problems; we corrected all of them and regenerated every result. We describe the corrections below, then explain what credibility the corrected simulation carries.

**Withdrawn claims.** The 39% jitter reduction claim and the previous recovery times (1.3–3.9 ms) have both been withdrawn. The 39% figure was based on a baseline simulator defect combined with a non-steady-state measurement method (see below); it has been replaced with the capacity comparison in Section 5.6. The previous recovery times came from simulation logs that could not be regenerated; they have been replaced by the multiple-failure experiment in new Section 5.7.2.

**Simulator corrections.** We found and fixed four problems; all simulation results in this revision were regenerated after these fixes.
- *Processing delay.* The paper states the hardware-measured D_process = 37 µs, but most simulation scripts used 30 µs. All results now use 37 µs.
- *Per-byte time.* The paper states D_byte = 1.5 µs (consistent with its analytical derivation from the MCU's interrupt service routine), but the simulator used 1.25 µs. All results now use 1.5 µs.
- *Flooded acknowledgements.* The simulator never deduplicated flooded acknowledgements, which could circulate until buffers overflowed after multiple failures. Before the correction, TinyNet failed to recover in 11 of 213 flows in the multiple-failure experiment; after it, 1 of 213. The paper discloses this. (The router firmware was also updated during this revision to implement flood deduplication for standard packets; see Comment 2.)
- *Loss accounting.* Packet loss is now determined per packet, by whether its acknowledgement returns.

**Steady-state measurement method.** The grid determinism results and the sensitivity analysis were previously taken over the first 30–60 ms of simulation, which included the start-up transient. They are now taken in steady state ($t \geq 50$ ms of a 200 ms run). This changes the reported σ values: with 5 kHz cross-traffic, σ = 7 µs (previously 85 µs was the transient); with 10 kHz, σ = 25 µs. At 13 kHz the network exceeds its capacity and RTT grows without bound; a steady-state σ does not exist and the paper now says so.

**Airplane-wing evaluation.** Re-running the airplane-wing scenario with the same steady-state method revealed that its nominal traffic exceeds the network's capacity: the three controllers carry every controller–motor and all master traffic, overflow their buffers, and at nominal rates fewer than 5% of controller–motor packets are delivered. The submitted σ values (7–45 µs) came from a 30 ms run that had delivered only about a third of its packets, and the submitted caption misstated the topology (24 motors and encoders instead of 8). The network is stable up to about 30% of nominal rates; we now evaluate it at 20%, where every packet is delivered, and state the capacity limit explicitly.

**Cross-traffic comparison.** After the simulator corrections, the submitted σ comparison (TinyNet 85 µs vs. baseline 139 µs) is no longer valid on either side: the baseline's default routing sent both flows through the same nodes, overloaded them, and produced RTT that grew without bound; its σ depended only on simulation length. With routes planned for the traffic, single-path routing has *lower* jitter than TinyNet below saturation. We therefore replaced the σ comparison with a capacity comparison (Section 5.6, Fig. 7), which shows TinyNet is stable up to 1.15× the reference load — about 1.9× the capacity of the default single-path baseline — and matches the capacity of planned routes without any prior knowledge of the traffic.

**Validation chain for the corrected simulation.** The simulation's three timing parameters are set from hardware measurements (D_process = 37 µs by logic-analyzer capture and analytical derivation; D_byte = 1.5 µs; L_br = 20 MHz). Simulating the 12-router hardware testbed with these parameters reproduces the measured corner-to-corner RTT of 511 µs to within 1.2% (Section 5.2). The sensitivity analysis in Section 5.3 independently perturbs each parameter by ±15% and shows that the reported variance results are stable within that range. We believe the simulation is a credible model of the hardware at the calibrated operating point, while acknowledging that hardware validation of variance and failure-recovery statistics remains future work, as Section 5.2 states.

**Changes to the manuscript.**
- **Abstract:** replaced "Performance evaluations on a 16-node mesh demonstrate" with "Simulation of a 16-node mesh, calibrated to a 1.2% match against hardware measurements, shows."
- **Section 5.4.1 (Grid evaluation):** updated σ values and steady-state method; added note that 13 kHz cross-traffic exceeds capacity with no steady-state distribution.
- **Section 5.4.2 (Airplane-wing evaluation):** re-run at 20% of nominal rates; corrected topology description; capacity limit stated explicitly.
- **Section 5.6 (new, Traffic Capacity):** replaces the σ comparison with the capacity sweep against single-path baselines.

---

### Comment 1.4

**Reviewer:** Physical layer limitations and engineering applicability have not been fully discussed. The current UART only supports 3.125 Mbps, far lower than the commonly used 100Mbps/Gigabit Ethernet in modern NCS. The feasibility of porting routing logic to the high-speed physical layer was not analyzed in the paper. If the degree of decoupling between the protocol and the physical layer is not clarified, its actual engineering value will be questioned.

**Response.** We agree this needed to be stated more clearly. We have added a sentence to the Conclusion's UART paragraph making the decoupling explicit.

**Protocol/physical-layer decoupling.** TinyNet's routing algorithm imposes no link-layer requirements beyond reliable byte-serial full-duplex delivery on each port. The cost function, LUT update rule, heartbeat mechanism, and flooding logic are all defined in terms of packets and buffer occupancy; none of them depend on the signaling standard, bit rate, or framing of the underlying link. UART was chosen for the prototype because it is a standard peripheral on virtually every microcontroller, not because the protocol requires it.

The Conclusion already discusses two higher-speed paths. First, an FPGA-based co-clocking link layer has been prototyped and achieves 65 Mbps on hardware analogous to the TinyNet router; this path removes both the bitrate cap and the shared-baudrate constraint. Second, the simplicity of the forwarding algorithm makes it a natural candidate for a full FPGA implementation in Verilog, which the Conclusion notes is expected to surpass Switched Ethernet performance while preserving TinyNet's stateless, adaptive properties.

The simulation further illustrates this independence: L_br is a configurable parameter, and the algorithm's correctness and convergence behavior are the same at any bitrate; higher L_br simply reduces per-packet transmission time.

**Target application regime.** For the embedded NCS this paper targets — robotic joint controllers, avionics actuators — message payloads are 3–50 bytes and control loops run at 500 Hz to 2.5 kHz. At 3.125 Mbps a 50-byte packet occupies the link for 128 µs; inter-message intervals at 2.5 kHz are 400 µs. Bitrate is not the binding constraint in this regime: queuing and routing delay are, which is what TinyNet addresses. For applications that do require 100 Mbps or higher, the FPGA path applies.

**Changes to the manuscript.**
- **Section 6 (Conclusion), UART paragraph:** added one sentence stating that the routing protocol is link-layer agnostic and that UART is an implementation choice driven by microcontroller availability, not a protocol requirement.

---

### Comment 1.5

**Reviewer:** Scalability and flooding cost analysis are missing. The number and bandwidth usage of flood control packets when the LUT fails to be quantified, and the reason why convergence cannot be achieved when 4 nodes (25%) fail simultaneously is not explained. Lack of discussion on larger scale networks or sudden failure scenarios requires additional analysis to demonstrate the scalability of the solution.

**Response.** We address the three sub-concerns in turn.

**Flood cost.** TinyNet's firmware drops any packet whose hop count exceeds MAX_HOPCOUNT = 6. A single flooded packet therefore generates at most $\sum_{h=0}^{6}(\Delta-1)^h$ transmissions in the network, where $\Delta$ is the maximum node degree. For the 4×4 grid ($\Delta = 4$), this is $\sum_{h=0}^{6} 3^h = 1{,}093$ in the worst case. In practice the count is much lower: each branch of the flood terminates as soon as it reaches a node that has a known route to the destination, at which point it is converted to a unicast packet and stops replicating. Floods are also transient — they are triggered when a LUT entry is missing (at startup or immediately after a failure) and die out as nodes learn alternative routes from the first flood that reaches its destination. We have added a sentence to Section 3 (Theory) quantifying this bound.

**The k = 4 non-recovery case.** The reviewer states that convergence cannot be achieved when four nodes fail. This is not what the paper reports. In the 4-failure experiment, TinyNet failed to recover in 1 of 42 eligible flows (flows whose endpoints were not disconnected by the failures); the other 41 recovered. The one non-recovery was a specific pathological scenario: the failures happened to isolate the destination of the *other* flow running simultaneously, whose source kept sending. Because TinyNet floods packets for which it has no route, those packets congested the surviving network and degraded the one flow that was still deliverable. The paper describes this in Section 5.7.2 and lists bounding such floods as a known limitation. It is not a general convergence failure; it is a known weakness of flooding when a destination is permanently unreachable, bounded in practice by the hop-count limit.

**Scalability.** We evaluated TinyNet on a 4×4 grid (16 nodes) and a 20-node airplane-wing topology; we do not have results for larger networks and acknowledge this as a limitation. We can offer three analytical observations. First, the per-node LUT is O(N × Δ) in memory, where N is the number of nodes and Δ is the maximum degree; for the small embedded NCS this paper targets this is a few hundred bytes. Second, the heartbeat mechanism is strictly link-local: each node sends one byte per link per heartbeat interval, so heartbeat overhead scales with degree, not with N. Third, flood horizon is bounded by MAX_HOPCOUNT = 6 regardless of N, so for networks whose diameter exceeds 6 hops, floods from a failed region do not propagate network-wide. Larger-scale simulation is future work; we have added a paragraph to Section 6 (Conclusion) acknowledging this.

**Changes to the manuscript.**
- **Section 3 (Theory):** added one sentence after the hop-count drop rule quantifying the worst-case flood copy count as $\sum_{h=0}^{\mathrm{MAX\_HOPCOUNT}}(\Delta-1)^h$ and noting that branches terminate on reaching a node with a known route.
- **Section 6 (Conclusion):** added a sentence acknowledging that evaluation is limited to networks of up to 20 nodes and that scalability to larger topologies is future work.

---

## Reviewer 2

### Comment 2.1

**Reviewer:** The manuscript proposes TinyNet, a lightweight multipath routing protocol for robotic networked control systems. The topic is relevant, and the idea of using local buffer-depth information for adaptive routing is promising. However, the paper requires some revisions before publication. TinyNet should be compared with stronger alternatives, such as ECMP, fast reroute, backpressure routing, or redundant-path methods, to better demonstrate its advantages.

**Response.** We thank the reviewer for a careful reading. Fast reroute (LFA) and redundant-path methods (TSN FRER) are addressed in Comments 1.1 and 1.2 respectively, where we added simulation comparisons and corrected the paper's positioning against each. For ECMP and backpressure routing:
* ECMP: Equal-cost multipath distributes traffic evenly across minimum-hop paths without considering queue state. TinyNet's cost function with λ = 0 reduces to minimum-hop routing, and with λ > 0 it penalises busy ports. ECMP is therefore a special case of TinyNet's design (no congestion weighting); TinyNet's capacity advantage over default single-path routing (Section 5.6) arises precisely from the λ > 0 weighting that ECMP lacks. The Related Work discusses this in Section 2.3 (Congestion-Aware Multipath in Datacenters).
* Backpressure routing: The max-weight scheduling formulation of Tassiulas and Ephremides (1992) achieves throughput-optimal routing using network-wide queue state. TinyNet's heartbeat mechanism is a local approximation: each node uses one-hop buffer depth rather than global queue state, trading throughput optimality for the stateless, distributed operation required in embedded NCS. The Related Work already discusses this in Section 2.4 (Backpressure Routing).

### Comment 2.2

**Reviewer:** The protocol description also needs further clarification, particularly regarding duplicate flood detection, LUT aging, hop-count overflow, packet reordering, and loop prevention. Overall, the work is interesting and has potential, but the authors should strengthen the evaluation and clarify key protocol details.

**Response:**
* Duplicate flood detection: The pseudocode in Section 3 states "If I have not yet seen this flood." The simulation implements this via a per-node seen-list keyed on (destination, source, payload). In the firmware, a 16-entry circular buffer keyed on (destination, source, XOR-checksum of payload) is checked and updated at the top of the P\_STANDARD\_FLOOD handler. ACK floods cannot be deduplicated without a payload identifier and remain bounded by the hop-count limit alone.
* LUT aging: When a node does not receive a heartbeat from a port within the liveness-check window (e.g., 2 ms), it clears all LUT entries associated with that port. Subsequent packets to those destinations are then flooded. We have added a paragraph to Section 3 describing this aging rule explicitly.
* Hop-count overflow: The hop-count field is a uint8\_t (0--255). Packets are dropped when the hop count exceeds MAX\_HOPCOUNT < 255 (e.g., 6), which happens long before any overflow. There is no overflow risk in practice.
* Packet reordering: TinyNet routes each packet independently, so packets belonging to the same logical stream may arrive out of order if they traverse different-length paths. For the target NCS traffic (single-packet control messages at fixed intervals) packet-level reordering between distinct messages is benign. Multi-packet messages would require application-layer sequencing, which is outside TinyNet's scope and consistent with its stateless design. We have added a sentence to Section 3 noting this.
* Loop prevention: TinyNet prevents persistent loops via two mechanisms. First, LUT aging (above) removes entries pointing toward failed nodes after heartbeat loss, eliminating the routing state that would cause a persistent loop. Second, the hop-count drop ensures that any residual loop is bounded: a packet circling a loop increments its hop count at each hop and is discarded after MAX\_HOPCOUNT forwarding steps regardless. We have added a sentence to Section 3 summarising these two mechanisms together.

**Changes to the manuscript.**
- **Section 3 (Theory):** (i) added a paragraph describing the LUT aging (heartbeat-timeout) mechanism; (ii) added a sentence on packet reordering; (iii) added a sentence summarising loop prevention via LUT aging and hop-count. The "not yet seen" pseudocode required no change — it now accurately describes both the simulation and the updated firmware.

---

## Reviewer 5

### Comment 5.1

**Reviewer:** The manuscript proposes TinyNet, a stateless multipath routing protocol for networked control systems. It combines backpressure-inspired congestion awareness (a busyness-based cost function) with reactive flooding for fast failure recovery. The problem is relevant, the idea is simple and attractive, and the related-work survey is broad. However, the evaluation can be strengthened. TinyNet should be compared against single-path shortest-path baseline to demonstrate its advantages.

**Response.** This comparison is now in the paper as Section 5.6 (Traffic Capacity, Fig. 7). We compare TinyNet against two single-path shortest-path configurations on the 4×4 grid: a default BFS tie-break (which does not account for the traffic) and a planned configuration (routes selected to minimize peak node load for this specific traffic pattern). The comparison uses a capacity sweep rather than a jitter comparison, because the default single-path baseline saturates before reaching the evaluation load and its RTT grows without bound; a σ comparison would be meaningless. The results show TinyNet is stable up to 1.15x the reference load, about 1.9 times the capacity of the default single-path baseline, and comparable to the capacity of planned routes without any prior knowledge of the traffic. Below saturation, planned single-path routes deliver lower jitter than TinyNet, and the paper now says so explicitly.

### Comment 5.2

**Reviewer:** The paper does not explain why recovery fails to converge when 4 nodes (25%) fail simultaneously. This should be clarified.

**Response.** TinyNet does not generally fail to converge with four simultaneous failures. We also note that the recovery times cited in the submitted manuscript (1.3–3.9 ms) and the statement that four failures did not converge came from simulation logs that could not be regenerated during this revision; both have been replaced by the multiple-failure experiment in Section 5.7.2, which was run from scratch with a fixed design and the corrected simulator described in Comment 1.3.

In the new experiment, TinyNet recovered in 41 of 42 eligible flows under four failures (flows whose endpoints were not disconnected by the failures). The one non-recovery was a specific pathological case: the failures isolated the destination of the other flow running concurrently, whose source continued to send. Because TinyNet floods packets for which it has no route, those packets congested the surviving network and degraded the one flow that was still deliverable. This is a known weakness of flooding to unreachable destinations, not a general convergence failure. The paper describes this case in Section 5.7.2, and the hop-count limit in the firmware bounds the damage.

