var net = require("./network"),
	manager = require('./manager');

const startupDelay = 100;
const connectDelay = 100;

// INITIALIZE NETWORK TOPOLOGY HERE
var initTopology = [
	[0],
	[1]
];

// Don't touch this code

var clients = [];
for (let i = 0; i < initTopology.length; i++) {
	c = new net.Client();
	c.use(manager);
	clients.push(c);
}

for (let i = 0; i < initTopology.length; i++) {
	clients[i].init(function() {
		this.delay(startupDelay, function() {
			this.manager.setup(initTopology[i].length);
		});
		this.delay(500, function() {
			this.manager.printPorts();
		});
	});
	for (let j = 0; j < initTopology[i].length; j++) {
		if (initTopology[i][j] == -1) {
			continue;
		}

		clients[i].init(function() {
			this.delay(startupDelay+connectDelay, function() {
				this.manager.connect(j, initTopology[i][j]);
			});
		});
	}
}

// PUT CUSTOM CODE HERE:

//send(0, 1, 'hi!', 1000);
//send(3, 3, 'what is up?', 1500);
//disconnect(0, 1, 2, 2, 1700);
//send(2, 2, 'You cannot see this cause we are not connected', 2000);
//send(2, 0, 'we are friends now', 2500);
sendPacket(0,1,1,"Hello 1!",0);

//Don't add stuff below this:

for (let i = 0; i < initTopology.length; i++) {
	net.add(1, clients[i]);
}
net.run(100 * 1000); // runs for 100 seconds



function send(from, port, message, delay, periodic=false) {
	if (periodic) {
		clients[from].init(function() {
			this.tick(delay, function() {
				this.manager.send(port, message);
			});
		});
	} else {
		clients[from].init(function() {
			this.delay(delay, function() {
				this.manager.send(port, message);
			});
		});
	}
}

function sendPacket(from, dest, size, data, delay, periodic=false) {
	if (periodic) {
		clients[from].init(function() {
			this.tick(delay, function() {
				this.manager.sendPacket(252, dest, -1, undefined, size, data, -1);
			});
		});
	} else {
		clients[from].init(function() {
			this.delay(delay, function() {
				this.manager.sendPacket(252, dest, -1, undefined, size, data, -1);
			});
		});
	}
}

function connect(a, aPort, b, bPort, delay) {
	clients[a].init(function() {
		this.delay(delay, function() {
			this.manager.connect(aPort, b);
		});	
	});
	clients[b].init(function() {
		this.delay(delay, function() {
			this.manager.connect(bPort, a);
		});
	});
}

function disconnect(a, aPort, b, bPort, delay) {
	clients[a].init(function() {
		this.delay(delay, function() {
			this.manager.disconnect(aPort);
		});
	});
	clients[b].init(function() {
		this.delay(delay, function() {
			this.manager.disconnect(bPort);
		});
	});
}