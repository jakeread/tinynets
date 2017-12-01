var net = require("./network"),
	manager = require('./manager');

const startupDelay = 100;
const connectDelay = 100;
const bufferCheckDelay = 1000;
const heartbeatPeriod = 400;

// INITIALIZE NETWORK TOPOLOGY HERE
var initTopology = [
	[1,2,3,5,6,9],		// 0
	[0,3,5,6,9,10],		// 1
	[0,3,6,8,9,10,11],		// 2
	[0,1,2,4,10],		// 3
	[3,5,12],		// 4
	[0,1,4,6,8,9,12,13,14],		// 5
	[0,1,2,5,11],		// 6
	[9,10,13,14],		// 7
	[2,5,13,17],		// 8
	[0,1,2,5,7,12,15,16],		// 9
	[1,2,3,7,12,15,17,19],		// 10
	[2,6,14,19],		// 11
	[4,5,9,10,15,20,21],		// 12
	[5,7,8,15,16,18,19],		// 13
	[5,7,11,19,20,22,23],		// 14
	[9,10,12,13,19,22],		// 15
	[9,13,17,18,21,24,25],		// 16
	[8,10,16,18,19,20,21,22,25],		// 17
	[13,16,17,20,21,24,25],		// 18
	[10,11,13,14,15,17,20,21,22,24,27,28],		// 19
	[12,14,17,18,19,21,24,27,28,29],		// 20
	[12,16,17,18,19,20,24,25,29,30],		// 21
	[14,15,17,19,24,25],		// 22
	[14,29,31],		// 23
	[16,18,19,20,21,22,26,28,29,30,32],		// 24
	[16,17,18,21,22,26,27,28],		// 25
	[24,25,27,30,35],		// 26
	[19,20,25,26,29,30,31,32,35,36],		// 27
	[19,20,24,25,29,30,37],		// 28
	[20,21,23,24,27,28,30,32,33,37],		// 29
	[21,24,26,27,28,29,36,37],		// 30
	[23,27,33,34,36,38],		// 31
	[24,27,29,36,38],		// 32
	[29,31,34,36,37,38,40,42],		// 33
	[31,33,38,40,42],		// 34
	[26,27,39,40,41,43,44],		// 35
	[27,30,31,32,33,38,39,41,44],		// 36
	[28,29,30,33,39,40,41],		// 37
	[31,32,33,34,36,40,42,47],		// 38
	[35,36,37,41,42,43,45,46,48],		// 39
	[33,34,35,37,38,42,43],		// 40
	[35,36,37,39,42,45,46],		// 41
	[33,34,38,39,40,41,43,50,51],		// 42
	[35,39,40,42,46,48,49,52],		// 43
	[35,36,49,50,51],		// 44
	[39,41,46,49,53,54],		// 45
	[39,41,43,45,47,48,49,50,52,53,54],		// 46
	[38,46,51,54,55,56],		// 47
	[39,43,46,49,50,53,54,55,57],		// 48
	[43,44,45,46,48,51,52,55,57],		// 49
	[42,44,46,48,55],		// 50
	[42,44,47,49,58,60],		// 51
	[43,46,49,53,57,59],		// 52
	[45,46,48,52,54,55,60,61],		// 53
	[45,46,47,48,53,58,59,60,62,63],		// 54
	[47,48,49,50,53,56,57,59,63],		// 55
	[47,55,59,60,62],		// 56
	[48,49,52,55,66],		// 57
	[51,54,59,62],		// 58
	[52,54,55,56,58,63,64],		// 59
	[51,53,54,56,61,63,64,65,67,69],		// 60
	[53,60,66,67,68],		// 61
	[54,56,58,63,64,68,71],		// 62
	[54,55,59,60,62,65,67,68,69,70,71,72],		// 63
	[59,60,62,66,68,69],		// 64
	[60,63,68,69,71],		// 65
	[57,61,64,73,74,75],		// 66
	[60,61,63,68,73,75,76],		// 67
	[61,62,63,64,65,67,69,70,71,72,74],		// 68
	[60,63,64,65,68,75],		// 69
	[63,68,71,76,77],		// 70
	[62,63,65,68,70,75,76,77],		// 71
	[63,68,73,75,76,77,78,79,80,81],		// 72
	[66,67,72,76],		// 73
	[66,68,77,78],		// 74
	[66,67,69,71,72,80,81,83,84],		// 75
	[67,70,71,72,73,77,79,83],		// 76
	[70,71,72,74,76,78,81,83,84,85,86],		// 77
	[72,74,77,81,82,83,85,86],		// 78
	[72,76,80,81,84,86],		// 79
	[72,75,79,82,83,86,87],		// 80
	[72,75,77,78,79,82,83,84,85,86,87,88],		// 81
	[78,80,81,84,88,89,91],		// 82
	[75,76,77,78,80,81,85,88,89],		// 83
	[75,77,79,81,82,88,90,91],		// 84
	[77,78,81,83,88,90,91,93],		// 85
	[77,78,79,80,81,92,95],		// 86
	[80,81,92,93,94],		// 87
	[81,82,83,84,85,89,90,97],		// 88
	[82,83,88,93,94,95,96],		// 89
	[84,85,88,91,92,95,97,99],		// 90
	[82,84,85,90,95,96,98,99],		// 91
	[86,87,90,93,94,95,96,98],		// 92
	[85,87,89,92,96,97],		// 93
	[87,89,92,95,96,97,98],		// 94
	[86,89,90,91,92,94,99],		// 95
	[89,91,92,93,94,98,99],		// 96
	[88,90,93,94,99],		// 97
	[91,92,94,96,99],		// 98
	[90,91,95,96,97,98]		// 99
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