var net = require("./network"),
	manager = require('./manager');

/*
 * Simulation type SIM:
 * 0: Hardcoded
 * 1: Random from js_code.txt
 * 2: Airplane Wing
 * 3: Grid
 */
SIM = 3;

// Airplane Wing Params
const D_INIT = 5e3;
const CTRL = 3;
const MOTOR = 8;

// Grid Params
const ROWS = 10;
const COLS = 10;

const syrup = 1000;
const dt = .001;

const PERIOD_CLEAR_F = 10;                  //[ms] Period with which to clear seenFloods
const PERIOD_TX_HB = 5;                    //[ms] Period with which heartbeats are transmitted to all neighbors
const PERIOD_TAKE_PULSE = 2*PERIOD_TX_HB;   //[ms] Period with which received heartbeats are processed

const startupDelay = .01;
const connectDelay = .01;

// INITIALIZE NETWORK TOPOLOGY HERE
switch (SIM) {
    case 0:                                                                     // Hardcoded
        var initTopology = [
            [1,2],              // 0
            [0,3],              // 1
            [0,4,5],            // 2
            [1,4],              // 3
            [2,3],              // 4
            [2]                 // 5
        ];
        break;
    case 1:                                                                     // Read network from file
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
        break;
    case 2:                                                                     // Airplane wing
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
        break;
    case 3:
        initTopology = [];
        for (let c=0; c<COLS; c++) {
            for (let r=0; r<ROWS; r++) {
                if (r===0 && c===0) {                                           // Corner Cases
                    initTopology.push([1, ROWS]);
                } else if (r===ROWS-1 && c===0) {
                    initTopology.push([ROWS-2, 2*ROWS-1]);
                } else if (r===0 && c===COLS-1) {
                    initTopology.push([ROWS*(COLS-2), ROWS*(COLS-1)+1]);
                } else if (r===ROWS-1 && c===COLS-1) {
                    initTopology.push([ROWS*(COLS-1)-1, ROWS*COLS-2]);
                } else if (r===0) {                                             // Edges
                    initTopology.push([(c-1)*ROWS, c*ROWS+1, (c+1)*ROWS]);
                } else if (r===ROWS-1) {
                    initTopology.push([c*ROWS-1, (c+1)*ROWS-2, (c+2)*ROWS-1]);
                } else if (c===0) {
                    initTopology.push([r-1, ROWS+r, r+1]);
                } else if (c===COLS-1) {
                    initTopology.push([ROWS*(COLS-1)+r-1, ROWS*(COLS-2)+r, ROWS*(COLS-1)+r+1]);
                } else {                                                        // Middle
                    initTopology.push([(c-1)*ROWS+r, c*ROWS+r-1, c*ROWS+r+1, (c+1)*ROWS+r]);
                }
            }
        }
        break;
}

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
switch (SIM) {
    case 0:                                                                     // Hardcoded
        sendPacket(0,4,1,"Hello!",1000);

        // To test link failure, uncomment one. To test node failure, uncomment both.
        disconnect(0,1,2,0,6000);
        disconnect(2,1,4,1,6000);

        // To test how network reacts to heavy traffic at a desired node, uncomment.
        sendPacket(5,2,1,"Distraction 0!",6000);
        sendPacket(5,2,1,"Distraction 1!",6000);
        sendPacket(5,2,1,"Distraction 2!",6000);
        sendPacket(5,2,1,"Distraction 3!",6000);
        sendPacket(5,2,1,"Distraction 4!",6000);
        sendPacket(5,2,1,"Distraction 5!",6000);
        sendPacket(5,2,1,"Distraction 6!",6000);
        sendPacket(5,2,1,"Distraction 7!",6000);
        sendPacket(5,2,1,"Distraction 8!",6000);

        sendPacket(4,0,1,"I love you, One!",8000);
        break;
    case 1:                                                                     // Random
        
        break;
    case 2:                                                                     // Airplane wing
        for (let m=0; m<MOTOR; m++) {
            sendPacket(motor[m],encoder[m],1 ,"Init",.1);
            sendPacket(encoder[m],motor[m],1 ,"Init",.1);
        }
        motor.forEach(function(m) {
            ctrl.forEach(function (c) {
                sendPacket(c,m,1,"Init",.1);
                sendPacket(m,c,1,"Init",.1);
            });
        });
        for (let i=1; i<=MOTOR; i++) {
            sendPacket(0,motor[motor.length-1]+i,1,"Init",.1);
            sendPacket(motor[motor.length-1]+i,0,1,"Init",.1);
        }

        for (let m=0; m<MOTOR; m++) {
            sendPacket(motor[m],encoder[m],1 ,"2.5k",.4,true);
        }
        motor.forEach(function(m) {
            ctrl.forEach(function (c) {
                sendPacket(c,m,1,"1k",1,true);
            });
        });
        for (let i=1; i<=MOTOR; i++) {
            sendPacket(0,motor[motor.length-1]+i,1,"500",2,true);
        }
        break;
    case 3:                                                                     // Grid
        sendPacket(0,ROWS*COLS-1,1,"Init",.1);
        sendPacket(ROWS*COLS-1,0,1,"Init",.1);
        sendPacket(ROWS-1,ROWS*(COLS-1),1,"Init",.1);
        sendPacket(ROWS*(COLS-1),ROWS-1,1,"Init",.1);
        
        sendPacket(0,ROWS*COLS-1,1,"Hi",.5,true);
        sendPacket(ROWS-1,ROWS*(COLS-1),1,"Cross",.1,true);
        break;
}


//Don't add stuff below this:
//----------------------------------------------------------------------------//

for (let i = 0; i < initTopology.length; i++) {
	net.add(1, clients[i]);
}
net.run(syrup * 1000 * 100); // runs for 100 seconds

function sendPacket(from, dest, size, data, delay, periodic=false) {
	if (periodic) {
		clients[from].init(function() {
                    this.delay(D_INIT, function() {
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