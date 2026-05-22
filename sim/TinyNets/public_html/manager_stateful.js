/**
 * manager_stateful.js
 *
 * Stateful shortest-path routing baseline for comparison with TinyNet.
 * Models OSPF-like behavior:
 *   - Pre-computes shortest paths (BFS) at startup from the full topology.
 *   - Routes each packet along a single fixed path (no multipath).
 *   - On link/port failure, enters a reconvergence period of CONVERGENCE_DELAY ms
 *     during which packets to affected destinations are dropped.
 *   - After reconvergence, recomputes shortest paths excluding failed ports.
 */
function ManagerStateful(self) {
    self.manager = this;

    const syrup = 1000;

    const D_PKT    = .030 * syrup;       // [ms] packet processing time
    const D_BYTE   = .00125 * syrup;     // [ms] per-byte interrupt overhead
    const BITRATE  = 20e3 / syrup;       // [kHz] link bitrate
    const PKT_HEADER = 5;                // [bytes] fixed packet header size
    const CONVERGENCE_DELAY = 200;       // [ms] OSPF-like reconvergence time

    const STD = 252;
    const ACK = 253;

    this.ports          = [];
    this.numports       = 0;
    this.routingTable   = {};   // dest (node id) -> port index
    this.hopCountTable  = {};   // dest (node id) -> shortest hop count
    this.buffer         = [];
    this.toSend         = [];
    this.maxBufferSize  = 252;
    this.waitUntil      = 0;
    this.portAlive      = [];
    this.convergingUntil = 0;  // sim-time after which reconvergence completes
    this.nodeId         = null;
    this.topology       = null; // full network topology (array of neighbor lists)

    // -------------------------------------------------------------------------
    // Initialisation

    this.setup = function(numports, nodeId, topology) {
        this.numports = numports;
        this.nodeId   = nodeId;
        this.topology = topology;
        this.ports    = new Array(numports).fill(-1);
        this.portAlive = new Array(numports).fill(true);
        this.computeRoutingTable();
    };

    /**
     * BFS from this.nodeId over the current live topology.
     * Populates routingTable[dest] = first-hop port
     *          hopCountTable[dest] = shortest hop count
     */
    this.computeRoutingTable = function() {
        this.routingTable  = {};
        this.hopCountTable = {};

        var visited = {};
        visited[this.nodeId] = true;
        var queue = [];

        var neighbors = this.topology[this.nodeId];
        for (var p = 0; p < neighbors.length; p++) {
            var nb = neighbors[p];
            if (typeof nb !== 'number' || nb < 0) continue;
            if (!this.portAlive[p]) continue;
            if (visited[nb]) continue;
            visited[nb] = true;
            this.routingTable[nb]  = p;
            this.hopCountTable[nb] = 1;
            queue.push({ node: nb, port: p, hops: 1 });
        }

        while (queue.length > 0) {
            var cur = queue.shift();
            var curNeighbors = this.topology[cur.node];
            if (!curNeighbors) continue;
            for (var j = 0; j < curNeighbors.length; j++) {
                var next = curNeighbors[j];
                if (typeof next !== 'number' || next < 0) continue;
                if (visited[next]) continue;
                visited[next] = true;
                this.routingTable[next]  = cur.port;   // same first-hop port
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
        this.ports[port]    = -1;
        this.portAlive[port] = false;

        // Mark the topology entry as dead so BFS skips it after reconvergence.
        this.topology[this.nodeId][port] = -1;

        // Invalidate any routing entries that used this port.
        for (var dest in this.routingTable) {
            if (this.routingTable.hasOwnProperty(dest) &&
                this.routingTable[dest] === port) {
                delete this.routingTable[dest];
                delete this.hopCountTable[dest];
            }
        }

        // Enter reconvergence: drop packets for CONVERGENCE_DELAY ms.
        this.convergingUntil = Math.max(self.now(), this.convergingUntil)
                               + CONVERGENCE_DELAY * syrup;
        self.log(`port ${port} failed; reconverging for ${CONVERGENCE_DELAY} ms`);
    };

    // -------------------------------------------------------------------------
    // Packet transmission

    this.sendPacket = function(start, dest=-1, hopcount=0, src=self.id,
                               size=0, data=null, port=-1) {
        var packet = { start, dest, hopcount, src, size, data, port };

        if (port === -1) {
            this.handlePacket(packet);
            return;
        }

        if (packet.src === self.id && packet.start === STD) {
            packet.data = self.now();   // timestamp for RTT measurement
        }

        if (port < this.numports && this.ports[port] >= 0) {
            self.send(this.ports[port], 'packet', { name: 'packet', obj: packet });
        }
    };

    this.send = function(port, msg) {
        if (port < this.numports && this.ports[port] >= 0) {
            self.send(this.ports[port], 'packet', { name: 'packet', obj: msg });
        }
    };

    // -------------------------------------------------------------------------
    // Receive handling

    this.onReceivePacket = function(from, o) {
        var port = this.ports.indexOf(from);
        if (port === -1) return;

        var packet = o.obj;
        packet.port = port;

        // Only handle STD and ACK; ignore heartbeats and flood types.
        if (packet.start !== STD && packet.start !== ACK) return;

        if (this.buffer.length < this.maxBufferSize) {
            this.buffer.push(packet);
        }
    };

    // -------------------------------------------------------------------------
    // Buffer / tick

    this.checkBuffer = function() {
        if (self.now() < this.waitUntil) return;

        // Check whether reconvergence just completed.
        if (this.convergingUntil > 0 && self.now() >= this.convergingUntil) {
            this.convergingUntil = 0;
            this.computeRoutingTable();
            self.log('reconvergence complete');
        }

        if (this.toSend.length > 0) {
            for (var p = 0; p < this.toSend.length; p++) {
                var pkt = this.toSend[p];
                this.sendPacket(pkt.start, pkt.dest, pkt.hopcount,
                                pkt.src, pkt.size, pkt.data, pkt.port);
            }
            this.toSend = [];
        }

        if (this.buffer.length > 0) {
            this.handlePacket(this.buffer.shift());
        }
    };

    // No-ops: stateful baseline does not use heartbeats or flood bookkeeping.
    this.heartbeat      = function() {};
    this.takePulse      = function() {};
    this.clearSeenFloods = function() {};

    // -------------------------------------------------------------------------
    // Core packet handling

    this.handlePacket = function(packet) {
        this.waitUntil = Math.max(self.now(), this.waitUntil) + D_PKT;
        packet.hopcount++;

        // Drop packet if the network is still converging after a failure.
        if (this.convergingUntil > 0 && self.now() < this.convergingUntil) {
            self.log(`dropping pkt to ${packet.dest} (converging)`);
            return;
        }

        if (packet.start === STD) {
            if (packet.dest === self.id) {
                // Send ACK back to source.
                var ackPort = this.routingTable[packet.src];
                if (ackPort === undefined) {
                    self.log(`no route to ${packet.src} for ACK; dropping`);
                    return;
                }
                this.waitUntil += (packet.size + PKT_HEADER) * (D_BYTE + 10 / BITRATE);
                packet.start   = ACK;
                packet.dest    = packet.src;
                packet.hopcount = 1;
                packet.src     = self.id;
                packet.size    = 0;
                packet.port    = ackPort;
                this.toSend.push(packet);
            } else {
                var nextPort = this.routingTable[packet.dest];
                if (nextPort === undefined) {
                    self.log(`no route to ${packet.dest}; dropping`);
                    return;
                }
                this.waitUntil += (packet.size + PKT_HEADER) * (D_BYTE + 10 / BITRATE);
                packet.port = nextPort;
                this.toSend.push(packet);
            }

        } else if (packet.start === ACK) {
            if (packet.dest === self.id) {
                var hops = this.hopCountTable[packet.src] || 1;
                self.log(`got ACK from ${packet.src}. RTT = ${Math.round((self.now() - packet.data) / 2 / hops)}`);
            } else {
                var nextPort = this.routingTable[packet.dest];
                if (nextPort === undefined) {
                    self.log(`no route to ${packet.dest} for ACK; dropping`);
                    return;
                }
                this.waitUntil += (packet.size + PKT_HEADER) * (D_BYTE + 10 / BITRATE);
                packet.port = nextPort;
                this.toSend.push(packet);
            }
        }
    };

    self.on('packet', this.onReceivePacket, this);
}

module.exports = ManagerStateful;
