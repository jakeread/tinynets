function Manager(self) {
	self.manager = this;

	this.ports = [];
	this.numports = 0;

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

	this.onReceive = function(from, o) {
		var port = this.ports.indexOf(from);
		if (port == -1) {
			return;
		}

		self.log(`got message '${o.name}' on port ${port}: '${o.obj}'`);
	};

	self.on('message', this.onReceive, this);
	
}

module.exports = Manager;
