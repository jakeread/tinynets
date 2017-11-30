var net = require("./network"),
	manager = require('./manager');

const startupDelay = 100;
const connectDelay = 100;
const bufferCheckDelay = 1000;
const heartbeatPeriod = 400;

// INITIALIZE NETWORK TOPOLOGY HERE
var initTopology = [
	[1,2],      // 0
	[0,3],      // 1
        [0,4,5],    // 2
        [1,4],      // 3
        [3,2],      // 4
        [2]         // 5
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
		this.tick(bufferCheckDelay, function() {
			this.manager.checkBuffer();
		});
		this.tick(heartbeatPeriod, function() {
			this.manager.heartbeat();
		});
                this.tick(2*heartbeatPeriod, function() {
                        this.manager.takePulse();
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

//----------------------------------------------------------------------------//
// PUT CUSTOM CODE HERE:
sendPacket(0,4,1,"Hello Four!",1000);

// To test link failure, uncomment one. To test node failure, uncomment both.
//disconnect(0,1,2,0,6000);
//disconnect(2,1,4,1,6000);

// To test how network reacts to heavy traffic at a desired node, uncomment.
//sendPacket(5,2,1,"Distraction 0!",6000);
//sendPacket(5,2,1,"Distraction 1!",6000);
//sendPacket(5,2,1,"Distraction 2!",6000);
//sendPacket(5,2,1,"Distraction 3!",6000);
//sendPacket(5,2,1,"Distraction 4!",6000);
//sendPacket(5,2,1,"Distraction 5!",6000);
//sendPacket(5,2,1,"Distraction 6!",6000);
//sendPacket(5,2,1,"Distraction 7!",6000);
//sendPacket(5,2,1,"Distraction 8!",6000);

sendPacket(4,0,1,"I love you, One!",8000);


//Don't add stuff below this:
//----------------------------------------------------------------------------//

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