function Manager(self) {
    self.manager = this;

    const STD = 252;                    // Standard Message label
    const ACK = 253;                    // Acknowledgement label
    const STF = 254;                    // Standard Flood label
    const ACF = 255;                    // Flood ACK label
	
    this.ports = [];
    this.numports = 0;
    this.addr_table = {};
    this.buffer = [];
    this.maxBufferSize = 252;
    this.seenFloods = [];

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

    this.printPorts = function() {
//        self.log(this.ports);
    };

    this.connect = function(port, id) {

        if (!(port < this.numports))
            return;

        if (self.id !== id) {
            var prevId = this.ports[port];
            if (prevId >= 0) {
                self.disconnect(prevId);
            }

//            self.log('im '+ self.id + ' connecting to ' + id);

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
//        self.log(`about to check buffer of node ${self.id}`);
//        self.log(this.buffer);
        if (this.buffer.length > 0) {
            this.handlePacket(this.buffer.shift());
        } else {
            self.setColor("black");
        }
//        self.log(`checked buffer of node ${self.id}`);
    };
    
    this.heartbeat = function() {
        for (let p=0; p<this.numports; p++) {
            this.sendPacket(this.buffer.length, undefined, undefined, undefined, undefined, undefined, p);
        }
    };
    
    this.takePulse = function() {
        for (let p=0; p<this.numports; p++) {
            if (this.addr_table[p].heartbeat) {
                this.addr_table[p].heartbeat = false;
            } else {
                for (var prop in this.addr_table[p].dests) {
                    if (this.addr_table[p].dests.hasOwnProperty(prop)) {
                        this.addr_table[p].dests = {};
                        this.addr_table[p].buff = 0;
                        self.log(`did not receive heartbeat from port ${p}`);
                        return;
                    }
                }
            }
        }
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
        // If LUT does not already have the source address, add the entry
        if ( (packet.start === STD || packet.start === ACK || packet.start === STF || packet.start === ACF)                                             // If this is not a buffer update
           && packet.src!==self.id                                                                                                                      // ...or a packet from me
           && (!this.addr_table[packet.port].dests.hasOwnProperty(packet.src) || this.addr_table[packet.port].dests[packet.src]!==packet.hopcount) ) {  // ...and my entry for the source is invalid
            this.addr_table[packet.port].dests[packet.src] = packet.hopcount;
//            self.log(`added ${packet.src} to its LUT under port ${packet.port}`);
        }
        
        if (packet.start === STD) {				// Standard Packet
            self.setColor("blue");
            if (packet.dest === self.id) {                                      // If I am destination
                const nextPort = this.getMinCostPort(packet.src);               // Pick the port to send ACK based off minimizing cost
                self.log(`got message ${packet.data}. ACKing port ${nextPort}`);
                this.sendPacket(ACK, packet.src, undefined, self.id, undefined, undefined, nextPort);
            } else {
                packet.hopcount++;                                              // Increment hopcount
                const nextPort = this.getMinCostPort(packet.dest);              // Pick the port to send to based off minimizing cost
                if (nextPort === -1) {                                          // If LUT does not have dest
                    self.log(`flooding message ${packet.data}`);
                    for (let p = 0; p < this.numports; p++) {                   // Flood packet
                        this.sendPacket(STF, packet.dest, packet.hopcount, packet.src, packet.size, packet.data, p);
                    }
                } else {                                                        // If LUT does have dest, send to that port
                    self.log(`sending packet ${packet.data} along port ${nextPort}`);
                    this.sendPacket(STD, packet.dest, packet.hopcount, packet.src, packet.size, packet.data, nextPort);
                }
            }
        } else if (packet.start === ACK) {			// Acknowledgement
            self.setColor("red");
            if (packet.dest === self.id) {                                      // If I am destination
                self.log(`got ACK from ${packet.src}`);
            } else {
                packet.hopcount++;                                              // Increment hopcount
                const nextPort = this.getMinCostPort(packet.dest);                   // Pick the port to send to based off minimizing cost
                if (nextPort === -1) {                                          // If LUT does not have dest
                    self.log(`flooding ACK`);
                    for (let p = 0; p < this.numports; p++) {                   // Flood ACK
                        this.sendPacket(ACF, packet.dest, packet.hopcount, packet.src, 0, null, p);
                    }
                } else {                                                        // If LUT does have dest, send to that port
                    self.log(`forwarding ACK along port ${nextPort}`);
                    this.sendPacket(ACK, packet.dest, packet.hopcount, packet.src, 0, null, nextPort);
                }
            }
        } else if (packet.start === STF) {			// Standard Flood
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
                self.log(`got flood ${packet.data} from port ${packet.port}. ACKing ${packet.src} along port ${nextPort}`);
                this.sendPacket(ACK, packet.src, undefined, self.id, undefined, undefined, nextPort);
            } else {
                packet.hopcount++;                                              // Increment hopcount
                
                const nextPort = this.getMinCostPort(packet.dest);              // Pick the port to send to based off minimizing cost
                if (nextPort === -1) {                                          // If LUT does not have dest
                    self.log(`flooding message ${packet.data} to all ports except ${packet.port}`);
                    for (let p = 0; p < this.numports; p++) {                   // Flood packet
                        if (p !== packet.port) {
                            this.sendPacket(STF, packet.dest, packet.hopcount, packet.src, packet.size, packet.data, p);
                        }
                    }
                } else {                                                        // If LUT does have dest, send to that port
                    self.log(`forwarding message ${packet.data} along ${nextPort}`);
                    this.sendPacket(STD, packet.dest, packet.hopcount, packet.src, packet.size, packet.data, nextPort);
                }
            }
        } else if (packet.start === ACF) {			// ACK Flood
            self.setColor("magenta");
            if (this.addr_table[packet.port].dests.hasOwnProperty(packet.dest)) // If I thought this port could send to destination, remove it
                delete this.addr_table[packet.port].dests[packet.dest];         // ...if that node had known, it wouldn't have forwarded it as a flood.
            if (packet.dest === self.id) {                                      // If I am destination
                self.log(`got ACK from ${packet.src}`);
            } else {
                packet.hopcount++;                                              // Increment hopcount
//                const thisFlood = {                                             // Static information within packet for comparison
//                    dest: packet.dest,
//                    src: packet.src,
//                    data: null
//                };
//                if (this.seenFloods.includes(thisFlood))                        // If I have seen it before, don't forward
//                    return;
//                this.seenFloods.push(thisFlood);                                // Remember the packet
                
                const nextPort = this.getMinCostPort(packet.dest);              // Pick the port to send to based off minimizing cost
                if (nextPort === -1) {                                          // If LUT does not have dest
                    self.log(`flooding ACK`);
                    for (let p = 0; p < this.numports; p++) {                   // Flood ACK
                        if (p !== packet.port)
                            this.sendPacket(ACF, packet.dest, packet.hopcount, packet.src, 0, null, p);
                    }
                } else {                                                        // If LUT does have dest, send to that port
                    self.log(`forwarding ACK along port ${nextPort}`);
                    this.sendPacket(ACK, packet.dest, packet.hopcount, packet.src, 0, null, nextPort);
                }
            }
        } else {                                                // Buffer Update. Should have been handled elsewhere
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