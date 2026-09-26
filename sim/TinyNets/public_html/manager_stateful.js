/**
 * manager_stateful.js
 *
 * Stateful shortest-path routing baseline modeling LFA-based IP Fast Reroute
 * (RFC 5286 + BFD, RFC 5880).
 *
 * The simulation captures the two properties that define LFA-FRR timing:
 *
 *   Normal operation:
 *     BFS shortest-path routing on a single fixed path per destination.
 *     No multipath, no congestion awareness.
 *
 *   On link/port failure (50 ms detection+cutover window):
 *     All packets to destinations whose primary path used the failed port
 *     are dropped for LFA_DETECTION_DELAY ms. Packets to unaffected
 *     destinations continue normally. This models the time from the failure
 *     event to BFD detection (~10 ms with aggressive timers) plus the local
 *     LFA switchover, totalling ~50 ms in practice.
 *
 *   After the window:
 *     BFS is recomputed on the updated topology (failed port excluded).
 *     Routing resumes on the new shortest paths. This is equivalent to
 *     assuming full LFA coverage — a reasonable approximation for a densely
 *     connected grid where alternates exist for every destination.
 *
 * Apples-to-apples note:
 *   TinyNet's 1.3 ms recovery includes failure detection (missed heartbeats)
 *   plus flood-based reroute. LFA_DETECTION_DELAY here is the total time from
 *   failure event to restored delivery, so the comparison is on equal footing.
 */
function ManagerStateful(self) {
    self.manager = this;

    const syrup = 1000;

    // Packet processing time (sim units). Override with D_PKT_US=<µs> (hardware-measured: 37).
    const D_PKT           = (process.env.D_PKT_US ? process.env.D_PKT_US / 1e3 : .030) * syrup;
    const D_BYTE          = .0015  * syrup;  // per-byte interrupt overhead (sim units)
    const BITRATE         = 20e3  / syrup;   // link bitrate
    const PKT_HEADER      = 5;               // bytes of fixed header
    // [ms] BFD detection + LFA cutover. Override with LFA_MS=<ms> to sweep.
    const LFA_DETECTION_DELAY = parseFloat(process.env.LFA_MS || '50');
    // LFA_MODE=realistic: routes are left untouched until detection
    // (LFA_MS after the failure), then repaired only where RFC 5286 provides
    // an alternate. Full reconvergence happens when the driver calls
    // reconverge(). Default 'blackout' keeps the idealised model above.
    const REALISTIC = process.env.LFA_MODE === 'realistic';
    const TTL       = 64;   // realistic mode only: discards transient loops
    const TRACE     = process.env.TRACE === '1';

    const STD = 252;
    const ACK = 253;

    this.ports         = [];
    this.numports      = 0;
    this.routingTable  = {};  // dest -> port (BFS shortest path)
    this.hopCountTable = {};  // dest -> hop count on primary path
    this.buffer        = [];
    this.toSend        = [];
    this.maxBufferSize = 252;
    this.waitUntil     = 0;
    this.portAlive     = [];

    // Per-destination blackout end time. A destination is blacked out while
    // sim-time < destBlackoutUntil[dest]. Absence means steady state.
    this.destBlackoutUntil = {};

    this.nodeId   = null;
    this.topology = null;

    // -------------------------------------------------------------------------
    // Initialisation

    this.setup = function(numports, nodeId, topology, staticRoutes) {
        this.numports     = numports;
        this.nodeId       = nodeId;
        this.topology     = topology;
        this.staticRoutes = staticRoutes || {};   // dest -> port, overrides BFS
        this.ports        = new Array(numports).fill(-1);
        this.portAlive    = new Array(numports).fill(true);
        this.computeRoutingTable();
        if (REALISTIC) this.computeLfaTable();
    };

    // Hop distances between all node pairs on the current topology.
    this.allPairsDistances = function() {
        var n = this.topology.length, dist = [];
        for (var s = 0; s < n; s++) {
            var d = new Array(n).fill(Infinity), queue = [s];
            d[s] = 0;
            while (queue.length > 0) {
                var u = queue.shift();
                for (var j = 0; j < this.topology[u].length; j++) {
                    var v = this.topology[u][j];
                    if (typeof v !== 'number' || v < 0 || d[v] !== Infinity) continue;
                    d[v] = d[u] + 1;
                    queue.push(v);
                }
            }
            dist.push(d);
        }
        return dist;
    };

    // RFC 5286 alternates, computed once on the pre-failure topology.
    // For each destination, prefer a node-protecting LFA, else a
    // link-protecting one (loop-free condition only), else none.
    this.computeLfaTable = function() {
        var dist = this.allPairsDistances(), S = this.nodeId;
        var nbrs = this.topology[S];
        this.lfaTable = {};   // dest -> alternate port
        for (var dest in this.routingTable) {
            var d = parseInt(dest), E = nbrs[this.routingTable[dest]];
            if (d === E) continue;   // next hop is the destination itself
            var best = null;
            for (var q = 0; q < nbrs.length; q++) {
                var N = nbrs[q];
                if (N === E || typeof N !== 'number' || N < 0) continue;
                if (!(dist[N][d] < dist[N][S] + dist[S][d])) continue;   // loop-free
                var nodeProt = dist[N][d] < dist[N][E] + dist[E][d];
                var rank = [nodeProt ? 0 : 1, dist[N][d]];
                if (best === null || rank[0] < best.rank[0]
                    || (rank[0] === best.rank[0] && rank[1] < best.rank[1])) {
                    best = { port: q, rank: rank };
                }
            }
            if (best !== null) this.lfaTable[d] = best.port;
        }
    };

    // Full IGP reconvergence: BFS on the post-failure topology.
    this.reconverge = function() {
        this.computeRoutingTable();
        this.pendingDetections = [];
        self.log('IGP reconvergence complete');
    };

    // BFS from this.nodeId over live ports only.
    this.computeRoutingTable = function() {
        this.routingTable  = {};
        this.hopCountTable = {};
        var visited = new Set([this.nodeId]);
        var queue   = [];
        var myNeighbors = this.topology[this.nodeId];

        for (var p = 0; p < myNeighbors.length; p++) {
            var nb = myNeighbors[p];
            if (typeof nb !== 'number' || nb < 0) continue;
            if (!this.portAlive[p])               continue;
            if (visited.has(nb))                  continue;
            visited.add(nb);
            this.routingTable[nb]  = p;
            this.hopCountTable[nb] = 1;
            queue.push({ node: nb, port: p, hops: 1 });
        }

        while (queue.length > 0) {
            var cur = queue.shift();
            var neighbors = this.topology[cur.node];
            if (!neighbors) continue;
            for (var j = 0; j < neighbors.length; j++) {
                var next = neighbors[j];
                if (typeof next !== 'number' || next < 0) continue;
                if (visited.has(next))                    continue;
                visited.add(next);
                this.routingTable[next]  = cur.port;
                this.hopCountTable[next] = cur.hops + 1;
                queue.push({ node: next, port: cur.port, hops: cur.hops + 1 });
            }
        }

        // Static routes override the BFS tie-break (hop counts are unchanged,
        // since every static route is itself a shortest path).
        for (var dest in this.staticRoutes) {
            if (this.portAlive[this.staticRoutes[dest]]) {
                this.routingTable[dest] = this.staticRoutes[dest];
            }
        }
    };

    // -------------------------------------------------------------------------
    // Connection management

    this.connect = function(port, id) {
        if (!(port < this.numports)) return;
        if (self.id !== id) {
            this.ports[port] = id;
            self.connect(id);
        }
    };

    this.disconnect = function(port) {
        if (!(port < this.numports)) return;
        var prevId = this.ports[port];
        if (prevId >= 0) self.disconnect(prevId);
        this.ports[port]     = -1;
        this.portAlive[port] = false;
        this.topology[this.nodeId][port] = -1;

        if (REALISTIC) {
            // Routes are unchanged until BFD detects the failure; packets sent
            // to the dead port in the meantime are lost.
            this.pendingDetections = this.pendingDetections || [];
            this.pendingDetections.push({ port: parseInt(port),
                                          at: self.now() + LFA_DETECTION_DELAY * syrup });
            self.log('port ' + port + ' failed; detection in ' + LFA_DETECTION_DELAY + ' ms');
            return;
        }

        // Black out every destination whose current primary path used this port.
        var cutover = Math.max(self.now(), 0) + LFA_DETECTION_DELAY * syrup;
        for (var dest in this.routingTable) {
            if (this.routingTable[dest] === parseInt(port)) {
                this.destBlackoutUntil[dest] = cutover;
                delete this.routingTable[dest];
                delete this.hopCountTable[dest];
            }
        }
        self.log('port ' + port + ' failed; ' + LFA_DETECTION_DELAY + ' ms blackout');
    };

    // -------------------------------------------------------------------------
    // Packet transmission

    this.sendPacket = function(start, dest, hopcount, src, size, data, port) {
        dest     = (dest     === undefined) ? -1      : dest;
        hopcount = (hopcount === undefined) ? 0       : hopcount;
        src      = (src      === undefined) ? self.id : src;
        size     = (size     === undefined) ? 0       : size;
        data     = (data     === undefined) ? null    : data;
        port     = (port     === undefined) ? -1      : port;

        var packet = { start: start, dest: dest, hopcount: hopcount,
                       src: src, size: size, data: data, port: port };

        if (port === -1) {
            this.handlePacket(packet);
            return;
        }
        if (packet.src === self.id && packet.start === STD) {
            packet.data = self.now();
            if (TRACE) self.log('sent to ' + packet.dest + ' (t0=' + packet.data + ')');
        }
        if (port < this.numports && this.ports[port] >= 0) {
            self.send(this.ports[port], 'packet', { name: 'packet', obj: packet });
        }
    };

    // -------------------------------------------------------------------------
    // Receive handling

    this.onReceivePacket = function(from, o) {
        var port = this.ports.indexOf(from);
        if (port === -1) return;
        var packet = o.obj;
        // Copy the packet so mutations don't alias across nodes.
        packet = { start: packet.start, dest: packet.dest, hopcount: packet.hopcount,
                   src: packet.src, size: packet.size, data: packet.data, port: port };
        if (packet.start !== STD && packet.start !== ACK) return;
        if (this.buffer.length < this.maxBufferSize) {
            this.buffer.push(packet);
        }
    };

    // -------------------------------------------------------------------------
    // Buffer / tick

    this.checkBuffer = function() {
        // Blackout expiry runs unconditionally so it fires even while the node
        // is busy processing packets (waitUntil in the future).
        var needRecompute = false;
        for (var dest in this.destBlackoutUntil) {
            if (self.now() >= this.destBlackoutUntil[dest]) {
                delete this.destBlackoutUntil[dest];
                needRecompute = true;
            }
        }
        if (needRecompute) {
            this.computeRoutingTable();
            self.log('LFA cutover complete, routes recomputed');
        }

        // Realistic mode: on BFD detection, switch affected destinations to
        // their RFC 5286 alternate, or drop them if none exists (or it is dead).
        if (REALISTIC && this.pendingDetections && this.pendingDetections.length) {
            var still = [];
            for (var i = 0; i < this.pendingDetections.length; i++) {
                var det = this.pendingDetections[i];
                if (self.now() < det.at) { still.push(det); continue; }
                for (var dst in this.routingTable) {
                    if (this.routingTable[dst] !== det.port) continue;
                    var alt = this.lfaTable[dst];
                    if (alt !== undefined && this.portAlive[alt]) {
                        this.routingTable[dst] = alt;
                    } else {
                        delete this.routingTable[dst];
                    }
                }
                self.log('BFD detected port ' + det.port + ' down; LFA repair applied');
            }
            this.pendingDetections = still;
        }

        if (self.now() < this.waitUntil) return;

        if (this.toSend.length > 0) {
            var batch = this.toSend.slice();
            this.toSend = [];
            for (var p = 0; p < batch.length; p++) {
                var pkt = batch[p];
                this.sendPacket(pkt.start, pkt.dest, pkt.hopcount,
                                pkt.src, pkt.size, pkt.data, pkt.port);
            }
        }

        if (this.buffer.length > 0) {
            this.handlePacket(this.buffer.shift());
        }
    };

    this.heartbeat       = function() {};
    this.takePulse       = function() {};
    this.clearSeenFloods = function() {};

    // -------------------------------------------------------------------------
    // Core packet handling

    this.handlePacket = function(packet) {
        this.waitUntil = Math.max(self.now(), this.waitUntil) + D_PKT;
        packet.hopcount++;
        if (REALISTIC && packet.hopcount > TTL) return;

        if (packet.start === STD) {
            if (packet.dest === self.id) {
                // Reply with ACK.
                var ackPort = this.routingTable[packet.src];
                if (ackPort === undefined) { return; }
                this.waitUntil += (packet.size + PKT_HEADER) * (D_BYTE + 10 / BITRATE);
                var ack = { start: ACK, dest: packet.src, hopcount: 1,
                            src: self.id, size: 0, data: packet.data, port: ackPort };
                this.toSend.push(ack);
            } else {
                // Check blackout.
                if (this.destBlackoutUntil[packet.dest] !== undefined
                    && self.now() < this.destBlackoutUntil[packet.dest]) {
                    return;
                }
                var nextPort = this.routingTable[packet.dest];
                if (nextPort === undefined) { return; }
                this.waitUntil += (packet.size + PKT_HEADER) * (D_BYTE + 10 / BITRATE);
                packet.port = nextPort;
                this.toSend.push(packet);
            }

        } else if (packet.start === ACK) {
            if (packet.dest === self.id) {
                var hops = this.hopCountTable[packet.src] || 1;
                self.log('got ACK from ' + packet.src + '. RTT = '
                         + Math.round((self.now() - packet.data) / 2 / hops)
                         + (TRACE ? ' (t0=' + packet.data + ')' : ''));
            } else {
                if (this.destBlackoutUntil[packet.dest] !== undefined
                    && self.now() < this.destBlackoutUntil[packet.dest]) {
                    return;
                }
                var nextPort = this.routingTable[packet.dest];
                if (nextPort === undefined) { return; }
                this.waitUntil += (packet.size + PKT_HEADER) * (D_BYTE + 10 / BITRATE);
                packet.port = nextPort;
                this.toSend.push(packet);
            }
        }
    };

    self.on('packet', this.onReceivePacket, this);
}

module.exports = ManagerStateful;
