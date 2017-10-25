function Manager(self) {
	self.manager = this;

	this.ports = [];
	this.numports = 0;

	this.send = function(to, name, msg) {
		if (typeof this.peers[to] != 'undefined') {
			self.send(to, 'message', {name: name, obj: msg})
		}
	};

	this.connect = function(id) {
		if (self.id == id) {
			return;
		}

		if (typeof this.peers[id] == 'undefined') {
			this.peers[id] = true;
			this.numpeers += 1;
			self.send(id, 'connect', {});
		}
	}

	this.disconnect = function(id) {
		if (self.id == id) {
			return;
		}

		if (typeof this.peers[id] != 'undefined') {
			delete this.peers[id];
			this.numpeers -= 1;
			self.send(id, 'disconnect', {});
		}
	}

	this.onReceive = function(from, o) {
		self.log(`got message '${o.name}' from ${from}: '${o.obj}'`);
	};

	this.onConnect = function(from, obj) {
		this.peers[from] = true;
		this.numpeers += 1;

		self.connect(from);
		self.log(`is connected to ${from}`);
	}

	this.onDisconnect = function(from, obj) {
		delete this.peers[from];
		this.numpeers -= 1;

		self.disconnect(from);
		self.log(`is disconnected from ${from}`);
	}

	self.on('message', this.onReceive, this);
	self.on('connect', this.onConnect, this);
	self.on('disconnect', this.onDisconnect, this);
}

module.exports = Manager;
