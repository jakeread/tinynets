var net = require("./network"),
	manager = require('./manager');

const startupDelay = 100;
const connectDelay = 100;
// The time it takes for a node to process a byte = DELAY_PKT + 
//                                                  n*DELAY_TX_HB*DELAY_PKT/PERIOD_TX_HB + 
//                                                  n*DELAY_RX_HB*DELAY_PKT/PERIOD_RX_HB +
//                                                  n*DELAY_TAKE_PULSE*DELAY_PKT/PERIOD_TAKE_PULSE, 
//                                                  n=# of nearest neighbors
const DELAY_PKT = 500;                      // Baseline packet delay. Assuming no heartbeats, how long it takes to process a packet
const DELAY_TX_HB = 50;                     // How long it takes to transmit a single heartbeat to a single neighbor
const PERIOD_TX_HB = 240;                   // Period with which heartbeats are transmitted to all neighbors
const DELAY_RX_HB = 50;                     // How long it takes to receive and process a single heartbeat from a single neighbor
const PERIOD_RX_HB = PERIOD_TX_HB;          // Period with which heartbeats are received from a single neighbor
const DELAY_TAKE_PULSE = 50;                // How long it takes to process received heartbeats
const PERIOD_TAKE_PULSE = 2*PERIOD_RX_HB;   // Period with which received heartbeats are processed

// INITIALIZE NETWORK TOPOLOGY HERE
var initTopology = [];
var rawFile = new XMLHttpRequest();
rawFile.open("GET", "js_code.txt", false);
rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status === 0))
    {
        var allText = rawFile.responseText;
        allText = allText.split('\n');
        for (let n=0; n<allText.length-2; n++) {
            var neighbors = [];
            var line = allText[n+1];
            line = line.substring(2,line.indexOf(']')).split(',');
            for (let n=0; n<line.length; n++) {
                neighbors.push(parseInt(line[n]));
            }
            initTopology.push(neighbors);
        }
    }
};
rawFile.send(null);

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
		this.tick(DELAY_PKT + initTopology[i].length*DELAY_TX_HB*DELAY_PKT/PERIOD_TX_HB
                                    + initTopology[i].length*DELAY_RX_HB*DELAY_PKT/PERIOD_RX_HB
                                    + initTopology[i].length*DELAY_TAKE_PULSE*DELAY_PKT/PERIOD_TAKE_PULSE, function() {
			this.manager.checkBuffer();
		});
		this.tick(PERIOD_TX_HB, function() {
			this.manager.heartbeat();
		});
                this.tick(PERIOD_RX_HB, function() {
                        this.manager.takePulse();
                });
	});
	for (let j = 0; j < initTopology[i].length; j++) {
		if (initTopology[i][j] === -1) {
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
sendPacket(0,99,1,"Hello!",1000);

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

//sendPacket(4,0,1,"I love you, One!",8000);


//Don't add stuff below this:
//----------------------------------------------------------------------------//

for (let i = 0; i < initTopology.length; i++) {
	net.add(1, clients[i]);
}
net.run(1000 * 1000); // runs for 100 seconds



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