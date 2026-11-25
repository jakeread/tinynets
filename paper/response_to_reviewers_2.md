# Response to Reviewers

We thank the reviewers for their careful consideration and comments. Edits to the paper are implemented in red text.

## Reviewer 1

### Comment 1.1

**Reviewer:** The work presents TinyNet, a stateless, lightweight multipath routing protocol purpose-built for networked control systems (NCS). It combines a busyness-aware cost function for runtime congestion adaptation with reactive flooding for fast failure recovery, targeting embedded robotic and industrial control scenarios dominated by small, latency-sensitive control packets. The authors have provided a thorough, point-by-point response to all prior reviewer comments and implemented extensive revisions. I recommend acceptance after minor revisions to address the remaining clarifications below.
For k ≥ 2 failures, LFA blackout equals the assumed 200 ms IGP reconvergence time by construction. To avoid reader misinterpretation, please add a note to the Table 4 caption stating that LFA multi-failure recovery time is bounded by the configured IGP reconvergence interval — an implementation parameter — rather than a fundamental architectural limit of LFA itself.

**Response.** 

---

### Comment 1.2

**Reviewer:** Section 6 acknowledges evaluation is limited to networks of up to 20 nodes. Please add a brief qualitative discussion of expected scaling behavior. How does worst-case flooding overhead scale with network diameter and node degree under the MAX_HOPCOUNT = 6 constraint? Are there any heuristic guidelines for tuning the λ parameter for different topology sizes or traffic regimes?

**Response.** 

---

### Comment 1.3

**Reviewer:** The paper notes that packet reordering is benign for single-packet control messages. While this holds for many simple control loops, some NCS applications (e.g., those using incremental state updates or sequence-numbered commands) may require in-order delivery. Please add one sentence acknowledging this limitation and noting that application-layer sequencing would be required for such use cases.

**Response.** 

---

### Comment 1.4

**Reviewer:** The y-axis of the right-hand plot in Figure 7 uses `10²` / `10³` tick marks without explicit units. Please label the axis Mean per-hop RTT (µs, log scale) to clarify both units and scale.

**Response.** 

---

### Comment 1.5

**Reviewer:** In Section 5.5, two section references appear as Section ??. Please update these to point to Sections 5.7.1 and 5.7.2, respectively.

**Response.** 

---

## Reviewer 5

### Comment 5.1

**Reviewer:** The authors have correctly addressed all the raised issues and now the manuscript is ready for publication.

**Response.**