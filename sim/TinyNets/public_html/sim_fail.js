/**
 * sim_fail.js
 *
 * TinyNet failure-recovery simulation on a 4x4 grid with NO cross-traffic.
 * Used specifically for the comparison_failure figure so that the pre-failure
 * baseline is clean and the figure isolates recovery behavior only.
 *
 * Traffic:  Node 0 -> Node 15 at 5 kHz (same as sim.js SIM=3 primary path)
 * Failure:  Node 7 disconnected at 11 ms (lies on the BFS shortest path
 *           0->1->2->3->7->11->15, matching the stateful baseline scenario)
 *
 * Run from sim/TinyNets/:
 *   node public_html/sim_fail.js > ../../log_fail_clean.txt
 */

var net     = require('./network');
var manager = require('./manager');

const syrup = 1000;
const dt    = 0.001;

const ROWS = 4;
const COLS = 4;

const D_INIT         = 1e3;
const PERIOD_CLEAR_F   = 10;
const PERIOD_TX_HB     = 1;
const PERIOD_TAKE_PULSE = 2 * PERIOD_TX_HB;

const startupDelay = 0.01;
const connectDelay = 0.01;

// ------------------------------------------------------------------
// Build 4x4 grid topology (identical to sim.js SIM=3)
// ------------------------------------------------------------------
var initTopology = [];
for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
        if      (r === 0       && c === 0      ) initTopology.push([1,                ROWS              ]);
        else if (r === ROWS-1  && c === 0      ) initTopology.push([ROWS-2,           2*ROWS-1          ]);
        else if (r === 0       && c === COLS-1 ) initTopology.push([ROWS*(COLS-2),    ROWS*(COLS-1)+1   ]);
        else if (r === ROWS-1  && c === COLS-1 ) initTopology.push([ROWS*(COLS-1)-1,  ROWS*COLS-2       ]);
        else if (r === 0                       ) initTopology.push([(c-1)*ROWS,        c*ROWS+1,     (c+1)*ROWS      ]);
        else if (r === ROWS-1                  ) initTopology.push([c*ROWS-1,          (c+1)*ROWS-2, (c+2)*ROWS-1    ]);
        else if (c === 0                       ) initTopology.push([r-1,               ROWS+r,       r+1             ]);
        else if (c === COLS-1                  ) initTopology.push([ROWS*(COLS-1)+r-1, ROWS*(COLS-2)+r, ROWS*(COLS-1)+r+1]);
        else                                     initTopology.push([(c-1)*ROWS+r,      c*ROWS+r-1,   c*ROWS+r+1, (c+1)*ROWS+r]);
    }
}

var topology = initTopology.map(arr => arr.slice());

// ------------------------------------------------------------------
// Create and initialise nodes
// ------------------------------------------------------------------
var clients = [];
for (let i = 0; i < initTopology.length; i++) {
    var c = new net.Client();
    c.use(manager);
    clients.push(c);
}

for (let i = 0; i < initTopology.length; i++) {
    (function(i) {
        clients[i].init(function() {
            this.delay(startupDelay, function() {
                this.manager.setup(initTopology[i].length);
            });
            this.tick(syrup * dt, function() {
                this.manager.checkBuffer();
            });
            this.tick(syrup * PERIOD_TX_HB, function() {
                this.manager.heartbeat();
            });
            this.tick(syrup * PERIOD_TAKE_PULSE, function() {
                this.manager.takePulse();
            });
            this.tick(syrup * PERIOD_CLEAR_F, function() {
                this.manager.clearSeenFloods();
            });
        });
        for (let j = 0; j < initTopology[i].length; j++) {
            if (initTopology[i][j] === -1) continue;
            clients[i].init(function() {
                this.delay(startupDelay + connectDelay, function() {
                    this.manager.connect(j, initTopology[i][j]);
                });
            });
        }
    })(i);
}

// ------------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------------
function sendPacket(from, dest, size, data, delay, periodic) {
    periodic = periodic || false;
    if (periodic) {
        clients[from].init(function() {
            this.delay(D_INIT, function() {
                this.tick(syrup * delay, function() {
                    this.manager.sendPacket(252, dest, 1, undefined, size, data);
                });
            });
        });
    } else {
        clients[from].init(function() {
            this.delay(syrup * delay, function() {
                this.manager.sendPacket(252, dest, 1, undefined, size, data);
            });
        });
    }
}

function disconnect(a, aPort, b, bPort, delay) {
    clients[a].init(function() {
        this.delay(syrup * delay, function() {
            this.manager.disconnect(aPort);
        });
    });
    clients[b].init(function() {
        this.delay(syrup * delay, function() {
            this.manager.disconnect(bPort);
        });
    });
    topology[a][aPort] = [];
    topology[b][bPort] = [];
}

// ------------------------------------------------------------------
// Warm-up packets
// ------------------------------------------------------------------
sendPacket(0,           ROWS*COLS-1, 1, 'Init', 0.1);
sendPacket(ROWS*COLS-1, 0,           1, 'Init', 0.1);

// ------------------------------------------------------------------
// Traffic: primary diagonal only, no cross-traffic
// ------------------------------------------------------------------
sendPacket(0, ROWS*COLS-1, 1, 'Hi', 0.2, true);   // 5 kHz, matches sim.js primary

// ------------------------------------------------------------------
// Failure: disconnect node 7 at 11 ms
// Node 7 lies on the BFS shortest path 0->1->2->3->7->11->15.
// ------------------------------------------------------------------
var failNode = 7;
for (let p = 0; p < topology[failNode].length; p++) {
    var nb = topology[failNode][p];
    if (typeof nb === 'number' && nb >= 0 && topology[nb]) {
        var nbPort = topology[nb].indexOf(failNode);
        if (nbPort >= 0) {
            disconnect(failNode, p, nb, nbPort, 11);
        }
    }
}

// ------------------------------------------------------------------
// Run
// ------------------------------------------------------------------
for (let i = 0; i < initTopology.length; i++) {
    net.add(1, clients[i]);
}
net.run(syrup * 100);
