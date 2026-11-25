# Response to Reviewers

We thank the reviewers for their careful consideration and comments. Edits to the paper are implemented in red text.

## Reviewer 1

### Comment 1.1

**Reviewer:** The work presents TinyNet, a stateless, lightweight multipath routing protocol purpose-built for networked control systems (NCS). It combines a busyness-aware cost function for runtime congestion adaptation with reactive flooding for fast failure recovery, targeting embedded robotic and industrial control scenarios dominated by small, latency-sensitive control packets. The authors have provided a thorough, point-by-point response to all prior reviewer comments and implemented extensive revisions. I recommend acceptance after minor revisions to address the remaining clarifications below.
For k ≥ 2 failures, LFA blackout equals the assumed 200 ms IGP reconvergence time by construction. To avoid reader misinterpretation, please add a note to the Table 4 caption stating that LFA multi-failure recovery time is bounded by the configured IGP reconvergence interval — an implementation parameter — rather than a fundamental architectural limit of LFA itself.

**Response.** We agree. We have added a note to the caption of Table 4 stating that LFA blackouts of about 200 ms, which make up the median for k ≥ 2, equal the configured IGP reconvergence interval. That interval is an implementation parameter of our baseline, not an architectural limit of LFA, and a faster-converging IGP would shorten these blackouts and the packets lost during them in proportion.

---

### Comment 1.2

**Reviewer:** Section 6 acknowledges evaluation is limited to networks of up to 20 nodes. Please add a brief qualitative discussion of expected scaling behavior. How does worst-case flooding overhead scale with network diameter and node degree under the MAX_HOPCOUNT = 6 constraint? Are there any heuristic guidelines for tuning the λ parameter for different topology sizes or traffic regimes?

**Response.** We have added a qualitative discussion of scaling to Section 6. Steady-state overhead is local (one heartbeat byte per link per period), and flooding occurs only when a node lacks a route. Because nodes forward each flood at most once, one flood costs fewer than 2|E| transmissions. The MAX_HOPCOUNT = 6 limit also bounds it, at Σ(Δ−1)^h ≤ 1,093 transmissions for Δ = 4, independent of network size. We also note that MAX_HOPCOUNT limits the reachable path length, so it must be raised for networks with a diameter above about 6, at which point the 2|E| bound governs. For λ, we give a heuristic based on its units: a node takes a d-hop detour once the preferred port's queue is d/λ bytes longer, so λ should make d/λ about one control packet. We note that a systematic λ study is future work.

---

### Comment 1.3

**Reviewer:** The paper notes that packet reordering is benign for single-packet control messages. While this holds for many simple control loops, some NCS applications (e.g., those using incremental state updates or sequence-numbered commands) may require in-order delivery. Please add one sentence acknowledging this limitation and noting that application-layer sequencing would be required for such use cases.

**Response.** We agree. In Section 3 we have added a sentence after the existing discussion of reordering. It states that TinyNet does not guarantee in-order delivery, and that applications whose single-packet messages depend on order, such as incremental state updates or sequence-numbered commands, must sequence them at the application layer.

---

### Comment 1.4

**Reviewer:** The y-axis of the right-hand plot in Figure 7 uses `10²` / `10³` tick marks without explicit units. Please label the axis Mean per-hop RTT (µs, log scale) to clarify both units and scale.

**Response.** We thank the reviewer. The right-hand y-axis of Figure 7 was labelled "Mean per-hop RTT (µs, log scale)" in the previous version, but the 10² / 10³ tick labels made the scale hard to read. We have replaced them with plain values in µs (50 to 5,000), enlarged the axis labels, and stated the units in the caption.

---

### Comment 1.5

**Reviewer:** In Section 5.5, two section references appear as Section ??. Please update these to point to Sections 5.7.1 and 5.7.2, respectively.

**Response.** Thank you for catching this; the two references used incorrect label names. They now resolve to the single-failure and multiple-failure experiments, which are numbered Sections 5.7 and 5.8 in the revised manuscript (our previous response referred to the latter as Section 5.7.2, which we regret).

---

## Reviewer 5

### Comment 5.1

**Reviewer:** The authors have correctly addressed all the raised issues and now the manuscript is ready for publication.

**Response.** We thank the reviewer for their careful review and their recommendation.