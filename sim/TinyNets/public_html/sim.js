var net = require("./network"),
	manager = require('./manager');

const startupDelay = .01;
const connectDelay = .01;

const syrup = 1000;
const dt = .001;

const PERIOD_CLEAR_F = 10;                  //[ms] Period with which to clear seenFloods
const PERIOD_TX_HB = 10;                    //[ms] Period with which heartbeats are transmitted to all neighbors
const PERIOD_TAKE_PULSE = 2*PERIOD_TX_HB;   //[ms] Period with which received heartbeats are processed

// INITIALIZE NETWORK TOPOLOGY HERE
/* Read network from file
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
*/

const CTRL = 2;
const MOTOR = 3;
var ctrl = [];
for (let c=1; c<=CTRL; c++) {
    ctrl.push(c);
}
var motor = [];
var encoder = [];
for (let m=1; m<=MOTOR; m++) {
    motor.push(CTRL+m);
    encoder.push(CTRL+MOTOR+m);
}
var initTopology = [ctrl];
for (let c in ctrl) {
    initTopology.push([0].concat(motor));
}
for (let m=0; m<motor.length; m++) {
//    initTopology.push(ctrl.concat(encoder[m]));
    if (m===0) {
        initTopology.push(ctrl.concat([motor[m+1]]).concat([encoder[m]]));
    } else if (m===motor.length-1) {
        initTopology.push(ctrl.concat([motor[m-1]]).concat([encoder[m]]));
    } else {
        initTopology.push(ctrl.concat([motor[m-1]]).concat([motor[m+1]]).concat([encoder[m]]));
    }
}
for (let m=0; m<motor.length; m++) {
    initTopology.push([motor[m]]);
}

//var initTopology = [
//    [1,2],              // 0
//    [0,3,4,5,6,7,8],    // 1
//    [0,3,4,5,6,7,8],    // 2
//    [1,2,4,9],          // 3
//    [1,2,3,5,10],       // 4
//    [1,2,4,6,11],       // 5
//    [1,2,5,7,12],       // 6
//    [1,2,6,8,13],       // 7
//    [1,2,7,14],         // 8
//    [3],                // 9
//    [4],                // 10
//    [5],                // 11
//    [6],                // 12
//    [7],                // 13
//    [8]                 // 14
//];

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
		this.tick(syrup*dt, function() {
			this.manager.checkBuffer();
		});
		this.tick(syrup*PERIOD_TX_HB, function() {
			this.manager.heartbeat();
		});
                this.tick(syrup*PERIOD_TAKE_PULSE, function() {
                        this.manager.takePulse();
                });
                this.tick(syrup*PERIOD_CLEAR_F, function() {
                    this.manager.clearSeenFloods();
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

for (let m=0; m<MOTOR; m++) {
    sendPacket(motor[m],encoder[m],1 ,"Init",.1);
}
motor.forEach(function(m) {
    ctrl.forEach(function (c) {
        sendPacket(c,m,1,"Init",.1);
    });
});
for (let i=1; i<=MOTOR; i++) {
    sendPacket(0,motor[motor.length-1]+i,1,"Init",.1);
}

for (let m=0; m<MOTOR; m++) {
    sendPacket(motor[m],encoder[m],1 ,"10k",.1,true);
}

motor.forEach(function(m) {
    ctrl.forEach(function (c) {
        sendPacket(c,m,1,"5k",.2,true);
    });
});

for (let i=1; i<=MOTOR; i++) {
    sendPacket(0,motor[motor.length-1]+i,1,"1k",1,true);
}

//sendPacket(0,9,1,"hello",1000);

/* Proof of Concept
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
*/

//Don't add stuff below this:
//----------------------------------------------------------------------------//

for (let i = 0; i < initTopology.length; i++) {
	net.add(1, clients[i]);
}
net.run(1000 * 100); // runs for 100 seconds

/*function send(from, port, message, delay, periodic=false) {
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
*/

function sendPacket(from, dest, size, data, delay, periodic=false) {
	if (periodic) {
		clients[from].init(function() {
                    this.delay(2000, function() {
			this.tick(syrup*delay, function() {
				this.manager.sendPacket(252, dest, 1, undefined, size, data);
			});
                    });
		});
	} else {
		clients[from].init(function() {
			this.delay(syrup*delay, function() {
				this.manager.sendPacket(252, dest, 1, undefined, size, data);
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