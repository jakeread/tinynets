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

    const D_PKT           = .030  * syrup;   // packet processing time (sim units)
    const D_BYTE          = .00125 * syrup;  // per-byte interrupt overhead (sim units)
    const BITRATE         = 20e3  / syrup;   // link bitrate
    const PKT_HEADER      = 5;               // bytes of fixed header
    const LFA_DETECTION_DELAY = 50;          // [ms] BFD detection + LFA cutover

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

    this.setup = function(numports, nodeId, topology) {
        this.numports  = numports;
        this.nodeId    = nodeId;
        this.topology  = topology;
        this.ports     = new Array(numports).fill(-1);
        this.portAlive = new Array(numports).fill(true);
        this.computeRoutingTable();
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
                         + Math.round((self.now() - packet.data) / 2 / hops));
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
