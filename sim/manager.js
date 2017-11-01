function Manager(self) {
	self.manager = this;

	this.ports = [];
	this.numports = 0;
	this.addr_table = {};

	this.setup = function(numports) {
		this.numports = numports;
		this.ports = new Array(numports).fill(-1);
	};

	this.printPorts = function() {
		console.log(this.ports);
	}

	this.connect = function(port, id) {

		if (!(port < this.numports)) {
			console.log('fuck');
			return;
		}

		if (self.id != id) {
			var prevId = this.ports[port];
			if (prevId >= 0) {
				self.disconnect(prevId);
			}

			console.log('im '+ self.id + ' connecting to ' + id);

			this.ports[port] = id;
			self.connect(id);
		} else {
			console.log('double fuck');	
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
	}

	this.send = function(port, msg) {
		if (port < this.numports && this.ports[port] >= 0) {
			self.send(this.ports[port], 'message', {name: 'message', obj: msg});
		}
	};

	this.onReceive = function(from, o) {
		var port = this.ports.indexOf(from);
		if (port == -1) {
			return;
		}

		self.log(`got message '${o.name}' on port ${port}: '${o.obj}'`);
	};

	this.sendPacket = function(dest, size, data, edges=0, port=-1, src=self.id, ack=false) {

		var packet = {
			ack: ack,
			dest: dest,
			edges: edges,
			src: src,
			size: size,
			data: data
		};

		if (port == -1) {
			this.handlePacket(packet);
			return;
		}

		if (port < this.numports && this.ports[port] >= 0) {
			self.send(this.ports[port], 'packet', {name: 'packet', obj: packet});
		}
	};

	this.onReceivePacket = function(from, o) {
		var port = this.ports.indexOf(from);
		if (port == -1) {
			return;
		}

		var packet = o.obj;
		packet.edges += 1;

		if (!this.addr_table.hasOwnProperty(packet.src)) {
			this.addr_table[packet.src] = new Array(numports).fill(Infinity);
			this.addr_table[packet.src][port] = packet.edges;
		} else {
			if (packet.edges < this.addr_table[packet.src][port]) {
				this.addr_table[packet.src][port] = packet.edges;
			}
		}

		this.handlePacket(packet);

	};

	this.handlePacket = function(packet) {
		if (packet.dest == self.id) {
			// we've reached destination! yay!
		} else {
			if (!this.addr_table.hasOwnProperty(packet.dest)) {

				//hasn't seen the destination yet, so flood!
				for (var i = 0; i < this.numports; i++) {
					this.sendPacket(packet.dest, packet.size, packet.data, packet.edges, i, packet.src, packet.ack);
				}

			} else {

				//send on port with minimum distance to destination
				var distances = this.addr_table[packet.dest];
				var portToSendOn = indexOfMin(distances);
				this.sendPacket(packet.dest, packet.size, packet.data, packet.edges, portToSendOn, packet.src, packet.ack);
			}
		}
	}

	self.on('message', this.onReceive, this);
	self.on('packet', this.onReceivePacket, this);
	
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
