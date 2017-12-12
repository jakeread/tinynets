function Manager(self) {
    self.manager = this;
    
    const syrup = 1000;
    
    const D_PKT = .030*syrup;           //[ms] Packet Process Time
    const D_BYTE = .00125*syrup;        //[ms] Read/Write Delay per Packet
    const BITRATE = 20e3/syrup;         //[kHz] bitrate
    const D_HB_RX = 10/BITRATE*syrup;   //[ms] Delay required to process a received heartbeat
    const D_HB_TX = .001*syrup;         //[ms] Delay required to transmit a heartbeat
    const D_TAKEPULSE = .001*syrup;     //[ms] Delay required to take pulse per port
    const PKT_HEADER = 5;               //[bytes] Number of bytes in a packet header

    const STD = 252;                    // Standard Message label
    const ACK = 253;                    // Acknowledgement label
    const STF = 254;                    // Standard Flood label
    const ACF = 255;                    // Flood ACK label
    
    const verbose = false;
	
    this.ports = [];
    this.numports = 0;
    this.addr_table = {};
    this.buffer = [];
    this.toSend = [];
    this.maxBufferSize = 252;
    this.seenFloods = [];
    this.waitUntil = 0;
    this.lifeline = false;

    this.setup = function(numports) {
        this.numports = numports;
        this.ports = new Array(numports).fill(-1);
        for (var p = 0; p < numports; p++) {
            this.addr_table[p] = {
                dests: {},
                buff: 0,
                heartbeat: false
            };
        }
    };

    this.connect = function(port, id) {
        if (!(port < this.numports))
            return;

        if (self.id !== id) {
            var prevId = this.ports[port];
            if (prevId >= 0) {
                self.disconnect(prevId);
            }

            this.ports[port] = id;
            self.connect(id);
        }
    };

    this.disconnect = function(port) {
        if (!(port < this.numports)) {
            return;
        }

        var prevId = this.ports[port];
        if (prevId >= 0) {
            self.disconnect(prevId);
        }

        this.ports[port] = -1;
    };

    this.send = function(port, msg) {
        if (port < this.numports && this.ports[port] >= 0) {
            self.send(this.ports[port], 'message', {name: 'message', obj: msg});
        }
    };

    this.onReceive = function(from, o) {
        var port = this.ports.indexOf(from);
        if (port === -1) {
            return;
        }

        self.log(`got message '${o.name}' on port ${port}: '${o.obj}'`);
    };

    this.checkBuffer = function() {
        if (self.now()<this.waitUntil)
            return;
        
        if (this.toSend.length>0) {
            for (let p=0; p<this.toSend.length; p++) {
                var pkt = this.toSend[p];
                this.sendPacket(pkt.start, pkt.dest, pkt.hopcount, pkt.src, pkt.size, pkt.data, pkt.port);
            }
            this.toSend = [];
        }
        
        if (this.buffer.length > 100) {
            self.log(`WARNING: BUFFER VERY FULL`);
            if (!this.lifeline) {
                this.heartbeat();
                this.lifeline = true;
            }
        } else if (this.buffer.length < 50) {
            this.lifeline = false;
        }
        
        if (this.buffer.length > 0) {
            this.handlePacket(this.buffer.shift());
        } else {
            self.setColor("black");
        }
    };
    
    this.heartbeat = function() {
        this.waitUntil = Math.max(self.now(),this.waitUntil)+this.numports*D_HB_TX;
        for (let p=0; p<this.numports; p++) {
            this.sendPacket(this.buffer.length, undefined, undefined, undefined, undefined, undefined, p);
        }
    };
    
    this.takePulse = function() {
        this.waitUntil = Math.max(self.now(),this.waitUntil)+this.numports*D_TAKEPULSE;
        for (let p=0; p<this.numports; p++) {
            if (this.addr_table[p].heartbeat) {
                this.addr_table[p].heartbeat = false;
            } else {
                for (var prop in this.addr_table[p].dests) {
                    if (this.addr_table[p].dests.hasOwnProperty(prop)) {
                        this.addr_table[p].dests = {};
                        this.addr_table[p].buff = 0;
                        /*if (verbose)*/ self.log(`did not receive heartbeat from port ${p}`);
                        return;
                    }
                }
            }
        }
    };
    
    this.clearSeenFloods = function() {
        seenFloods = [];
    };

    this.sendPacket = function(start, dest=-1, hopcount=0, src=self.id, size=0, data=null, port=-1) {
        var packet = {
            start: start,
            dest: dest,
            hopcount: hopcount,
            src: src,
            size: size,
            data: data,
            port: port
        };
        
        if (port === -1) {
            this.handlePacket(packet);
            return;
        }
        
        if (packet.src === self.id && (packet.start===STD || packet.start===STF)) {
            packet.data = self.now();
        }
        
        if (port < this.numports && this.ports[port] >= 0) {
            self.send(this.ports[port], 'packet', {name: 'packet', obj: packet});
        }
    };

    this.onReceivePacket = function(from, o) {
        var port = this.ports.indexOf(from);
        if (port === -1)
            return;

        var packet = o.obj;
        packet.port = port;
        
        if (packet.start !== STD && packet.start !== ACK && packet.start !== STF && packet.start !== ACF) {
            this.addr_table[port].buff = packet.start;
            this.addr_table[port].heartbeat = true;
        } else if (this.buffer.length < this.maxBufferSize) {
            this.buffer.push(packet);
	}
    };

    this.handlePacket = function(packet) {
        this.waitUntil = Math.max(self.now(),this.waitUntil)+D_PKT;
        // If LUT does not already have the source address, add the entry
        if ( (packet.start === STD || packet.start === ACK || packet.start === STF || packet.start === ACF)                                             // If this is not a buffer update
           && packet.src!==self.id                                                                                                                      // ...or a packet from me
           && (!this.addr_table[packet.port].dests.hasOwnProperty(packet.src) || this.addr_table[packet.port].dests[packet.src]>packet.hopcount) ) {  // ...and my entry for the source is invalid
           // NICK: TODO: > or !== ? !== would be more robust to dropped nodes, but > is stable (see SIM=2, (3,6))
            this.addr_table[packet.port].dests[packet.src] = packet.hopcount;
             if (verbose) self.log(`added ${packet.src} to its LUT under port ${packet.port}`);
        }
        
        packet.hopcount++;                                                      // Increment hopcount
        
        if (packet.start === STD) {                                             // Standard Packet
            self.setColor("blue");
            if (packet.dest === self.id) {                                      // If I am destination
                const nextPort = this.getMinCostPort(packet.src);               // Pick the port to send ACK based off minimizing cost
                if (verbose) self.log(`got message ${packet.data}. ACKing port ${nextPort}`);
                this.waitUntil+=(packet.size+PKT_HEADER)*(D_BYTE+10/BITRATE);
                packet.start = ACK;
                packet.dest = packet.src;
                packet.hopcount = 1;
                packet.src = self.id;
                packet.size = 0;
                packet.port = nextPort;
                this.toSend.push(packet);
//                this.sendPacket(ACK, packet.src, 1, self.id, undefined, packet.data, nextPort);
            } else {
                const nextPort = this.getMinCostPort(packet.dest);              // Pick the port to send to based off minimizing cost
                if (nextPort === -1) {                                          // If LUT does not have dest
                    packet.start = STF;
                    if (verbose) self.log(`flooding message ${packet.data}`);
                    this.waitUntil+=(packet.size+PKT_HEADER)*(D_BYTE*this.numports+10/BITRATE);
                    for (let p = 0; p < this.numports; p++) {                   // Flood packet
                        var pkt = Object.assign({}, packet);
                        pkt.port = p;
                        this.toSend.push(pkt);
//                        this.sendPacket(packet.start, packet.dest, packet.hopcount, packet.src, packet.size, packet.data, p);
                    }
                } else {                                                        // If LUT does have dest, send to that port
                    if (verbose) self.log(`sending packet ${packet.data} along port ${nextPort}`);
                    this.waitUntil+=(packet.size+PKT_HEADER)*(D_BYTE+10/BITRATE);
                    packet.port = nextPort;
                    this.toSend.push(packet);
//                    this.sendPacket(packet.start, packet.dest, packet.hopcount, packet.src, packet.size, packet.data, nextPort);
                }
            }
        } else if (packet.start === ACK) {                                      // Acknowledgement
            self.setColor("red");
            if (packet.dest === self.id) {                                      // If I am destination
                self.log(`got ACK from ${packet.src}. RTT = ${Math.round((self.now()-packet.data)/2/this.getMinHopCountTo(packet.src))}`);
//                self.log(`got ACK from ${packet.src}. RTT = ${self.now()-packet.data}`);
            } else {
                const nextPort = this.getMinCostPort(packet.dest);                   // Pick the port to send to based off minimizing cost
                if (nextPort === -1) {                                          // If LUT does not have dest
                    packet.start = ACF;
                    if (verbose) self.log(`flooding ACK`);
                    this.waitUntil+=(packet.size+PKT_HEADER)*(D_BYTE*this.numports+10/BITRATE);
                    for (let p = 0; p < this.numports; p++) {                   // Flood ACK
                        var pkt = Object.assign({}, packet);
                        pkt.port = p;
                        this.toSend.push(pkt);
//                        this.sendPacket(packet.start, packet.dest, packet.hopcount, packet.src, packet.size, packet.data, p);
                    }
                } else {                                                        // If LUT does have dest, send to that port
                    if (verbose) self.log(`forwarding ACK along port ${nextPort}`);
                    this.waitUntil+=(packet.size+PKT_HEADER)*(D_BYTE+10/BITRATE);
                    packet.port = nextPort;
                    this.toSend.push(packet);
//                    this.sendPacket(packet.start, packet.dest, packet.hopcount, packet.src, packet.size, packet.data, nextPort);
                }
            }
        } else if (packet.start === STF) {                                      // Standard Flood
            self.setColor("cyan");
            if (this.addr_table[packet.port].dests.hasOwnProperty(packet.dest)) // If I thought this port could send to destination, remove it
                delete this.addr_table[packet.port].dests[packet.dest];         // ...if that node had known, it wouldn't have forwarded it as a flood.
            const thisFlood = {                                                 // Static information within packet for comparison
                dest: packet.dest,
                src: packet.src,
                data: packet.data
            };

            if (this.hasSeen(thisFlood)) {                                      // If I have seen it before, don't forward
//                self.log(`not forwarding ${packet.data} from port ${packet.port}`);
                return;
            }
            this.seenFloods.push(thisFlood);                                    // Remember the packet
            if (packet.dest === self.id) {                                      // If I am destination
                const nextPort = this.getMinCostPort(packet.src);               // Pick the port to send ACK based off minimizing cost
                if (verbose) self.log(`got flood ${packet.data} from port ${packet.port}. ACKing ${packet.src} along port ${nextPort}`);
                this.waitUntil+=(packet.size+PKT_HEADER)*(D_BYTE+10/BITRATE);
                packet.start = ACK;
                packet.dest = packet.src;
                packet.hopcount = 1;
                packet.src = self.id;
                packet.size = 0;
                packet.port = nextPort;
                this.toSend.push(packet);
//                this.sendPacket(ACK, packet.src, 1, self.id, undefined, packet.data, nextPort);
            } else {
                const nextPort = this.getMinCostPort(packet.dest);              // Pick the port to send to based off minimizing cost
                if (nextPort === -1) {                                          // If LUT does not have dest
                    if (verbose) self.log(`flooding message ${packet.data} to all ports except ${packet.port}`);
                    this.waitUntil+=(packet.size+PKT_HEADER)*(D_BYTE*(this.numports-1)+10/BITRATE);
                    for (let p = 0; p < this.numports; p++) {                   // Flood packet
                        if (p !== packet.port) {
                            var pkt = Object.assign({}, packet);
                            pkt.port = p;
                            this.toSend.push(pkt);
//                            this.sendPacket(packet.start, packet.dest, packet.hopcount, packet.src, packet.size, packet.data, p);
                        }
                    }
                } else {                                                        // If LUT does have dest, send to that port
                    packet.start = STD;
                    if (verbose) self.log(`forwarding message ${packet.data} along ${nextPort}`);
                    this.waitUntil+=(packet.size+PKT_HEADER)*(D_BYTE+10/BITRATE);
                    packet.port = nextPort;
                    this.toSend.push(packet);
//                    this.sendPacket(packet.start, packet.dest, packet.hopcount, packet.src, packet.size, packet.data, nextPort);
                }
            }
        } else if (packet.start === ACF) {                                      // ACK Flood
            self.setColor("magenta");
            if (this.addr_table[packet.port].dests.hasOwnProperty(packet.dest)) // If I thought this port could send to destination, remove it
                delete this.addr_table[packet.port].dests[packet.dest];         // ...if that node had known, it wouldn't have forwarded it as a flood.
            if (packet.dest === self.id) {                                      // If I am destination
                if (verbose) self.log(`got ACK from ${packet.src}`);
            } else {
                const thisFlood = {                                             // Static information within packet for comparison
                    dest: packet.dest,
                    src: packet.src,
                    data: null
                };
                if (this.seenFloods.includes(thisFlood))                        // If I have seen it before, don't forward
                    return;
                this.seenFloods.push(thisFlood);                                // Remember the packet
                
                const nextPort = this.getMinCostPort(packet.dest);              // Pick the port to send to based off minimizing cost
                if (nextPort === -1) {                                          // If LUT does not have dest
                    if (verbose) self.log(`flooding ACK`);
                    this.waitUntil+=(packet.size+PKT_HEADER)*(D_BYTE*(this.numports-1)+10/BITRATE);
                    for (let p = 0; p < this.numports; p++) {                   // Flood ACK
                        if (p !== packet.port) {
                            var pkt = Object.assign({}, packet);
                            pkt.port = p;
                            this.toSend.push(pkt);
//                            this.sendPacket(packet.start, packet.dest, packet.hopcount, packet.src, packet.size, packet.data, p);
                        }
                    }
                } else {                                                        // If LUT does have dest, send to that port
                    packet.start = ACK;
                    if (verbose) self.log(`forwarding ACK along port ${nextPort}`);
                    this.waitUntil+=(packet.size+PKT_HEADER)*(D_BYTE+10/BITRATE);
                    packet.port = nextPort;
                    this.toSend.push(packet);
//                    this.sendPacket(packet.start, packet.dest, packet.hopcount, packet.src, packet.size, packet.data, nextPort);
                }
            }
        } else {                                                                // Buffer Update. Should have been handled elsewhere
            self.log(`Packet start error`);
        }
    };

    this.getMinCostPort = function(dest) {
        var minCost = Infinity;
        var minPort = -1;
        for (let p = 0; p < this.numports; p++) {
            if (this.addr_table[p].dests.hasOwnProperty(dest)) {
                var cost = getCost(this.addr_table[p].dests[dest], this.addr_table[p].buff);
                if (cost<minCost) {
                    minCost = cost;
                    minPort = p;
                }
            }
        }
        return minPort;
    };
    
    this.getMinHopCountTo = function(dest) {
        var minHC = Infinity;
        for (let p=0; p<this.numports; p++) {
            if (this.addr_table[p].dests.hasOwnProperty(dest)) {
                var hc = this.addr_table[p].dests[dest];
                if (hc < minHC)
                    minHC = hc;
            }
        }
        return minHC;
    };
    
    this.hasSeen = function(packet) {
        for (let p = 0; p < this.seenFloods.length; p++) {
            if (this.seenFloods[p].dest === packet.dest
             && this.seenFloods[p].src  === packet.src
             && this.seenFloods[p].data === packet.data) {
                return true;
            }
        }
        return false;
    };

    self.on('message', this.onReceive, this);
    self.on('packet', this.onReceivePacket, this);
	
}

function getCost(hopcount, buffer) {
    return hopcount + buffer/2;
}

//from https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array
function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }

    return minIndex;
}

module.exports = Manager;
