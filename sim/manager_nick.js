function Manager(self) {
	self.manager = this;

	this.ports = [];
	this.numports = 0;
	var map = {0:{1:4,2:3},1:{0:4,3:1},2:{0:3,3:1},3:{1:1,2:1}};
	var graph = new Graph(map);
	const HOP_COUNT = 2;

	this.setup = function(numports) {
		this.numports = numports;
		this.ports = new Array(numports).fill(-1);
	};

	this.connect = function(port, id) {

		if (!(port < this.numports)) {
			return;
		}

		if (self.id != id) {
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
	}

	this.send = function(port, name, msg) {
		if (port < this.numports && this.ports[port] >= 0) {
			self.send(this.ports[port], 'message', {name: name, obj: msg});
		}
	};
	
	this.sendTo = function(id, msg) {
		var path = graph.findShortestPath(self.id, id);
		var nextNode = path[1];
		for (var p = 0; p < this.numports; p++) {
			if (this.ports[p] === parseInt(nextNode)) {
				this.send(p, id, msg);
				return;
			}
		}
	}
	
	// Flood Packet: ['F' , HOP COUNT , ORIGINAL SENDER ID , COST 1 , RECIPIENT 1 , COST 2 , RECIPIENT 2 ...]
	this.flood = function() {
		for (var p = 0; p < this.numports; p++) {
			this.send(this.ports[p], 'F', self.id);
		}
	}

	this.onReceive = function(from, o) {
		var port = this.ports.indexOf(from);
		if (port == -1) {
			return;
		}

		self.log(`got message '${o.name}' on port ${port}: '${o.obj}'`);
		
		if (o.name != self.id) {
			this.sendTo(o.name,o.obj);
		}
	};

	self.on('message', this.onReceive, this);
	
}

module.exports = Manager;
