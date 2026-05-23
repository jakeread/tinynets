/**
 * sim_stateful.js
 *
 * Stateful shortest-path baseline simulation for comparison with TinyNet.
 * Runs two scenarios on a 4x4 grid, mirroring sim.js SIM=3:
 *
 *   Scenario A (cross-traffic):   corner-to-corner at 5 kHz with 10 kHz cross-traffic
 *   Scenario B (failure):         corner-to-corner at 10 kHz; 1 node removed at 11 ms
 *
 * Set SIM_STATEFUL = 'cross' or 'fail' before running.
 *
 * Run from sim/TinyNets/:
 *   node public_html/sim_stateful.js cross > ../../log_stateful_cross.txt
 *   node public_html/sim_stateful.js fail  > ../../log_stateful_fail.txt
 */

var net     = require('./network');
var Manager = require('./manager_stateful');

const SIM_STATEFUL = process.argv[2] || 'cross';   // 'cross' or 'fail'

const syrup = 1000;
const dt    = 0.001;

const ROWS = 4;
const COLS = 4;

const D_INIT         = 1e3;   // warm-up delay before periodic traffic starts [sim units]
const startupDelay   = 0.01;
const connectDelay   = 0.01;

// ------------------------------------------------------------------
// Build 4x4 grid topology (same as sim.js SIM=3)
// ------------------------------------------------------------------
var initTopology = [];
for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
        if      (r === 0       && c === 0      ) initTopology.push([1,           ROWS           ]);
        else if (r === ROWS-1  && c === 0      ) initTopology.push([ROWS-2,      2*ROWS-1       ]);
        else if (r === 0       && c === COLS-1 ) initTopology.push([ROWS*(COLS-2), ROWS*(COLS-1)+1]);
        else if (r === ROWS-1  && c === COLS-1 ) initTopology.push([ROWS*(COLS-1)-1, ROWS*COLS-2]);
        else if (r === 0                       ) initTopology.push([(c-1)*ROWS,   c*ROWS+1,     (c+1)*ROWS      ]);
        else if (r === ROWS-1                  ) initTopology.push([c*ROWS-1,     (c+1)*ROWS-2, (c+2)*ROWS-1    ]);
        else if (c === 0                       ) initTopology.push([r-1,          ROWS+r,       r+1             ]);
        else if (c === COLS-1                  ) initTopology.push([ROWS*(COLS-1)+r-1, ROWS*(COLS-2)+r, ROWS*(COLS-1)+r+1]);
        else                                     initTopology.push([(c-1)*ROWS+r, c*ROWS+r-1,  c*ROWS+r+1, (c+1)*ROWS+r]);
    }
}

// Keep a mutable copy for disconnect() to mark dead ports.
var topology = initTopology.map(arr => arr.slice());

// ------------------------------------------------------------------
// Create nodes
// ------------------------------------------------------------------
var clients = [];
for (let i = 0; i < initTopology.length; i++) {
    var c = new net.Client();
    c.use(Manager);
    clients.push(c);
}

// Initialise each node: setup with full topology so BFS can run.
for (let i = 0; i < initTopology.length; i++) {
    (function(i) {
        clients[i].init(function() {
            this.delay(startupDelay, function() {
                // Pass nodeId and full topology for BFS pre-computation.
                this.manager.setup(initTopology[i].length, i, topology);
            });
            this.tick(syrup * dt, function() {
                this.manager.checkBuffer();
            });
        });
        for (let j = 0; j < initTopology[i].length; j++) {
            if (initTopology[i][j] < 0) continue;
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
    // manager.disconnect() marks topology[nodeId][port] = -1 at runtime;
    // do NOT pre-mark here or the initial BFS tables will exclude the link.
}

// ------------------------------------------------------------------
// Warm-up: send initial packets so routing tables can populate via ACKs.
// (In the stateful manager, BFS gives routes immediately, but we still
//  warm up so both simulations start from a comparable steady state.)
// ------------------------------------------------------------------
sendPacket(0,           ROWS*COLS-1, 1, 'Init', 0.1);
sendPacket(ROWS*COLS-1, 0,           1, 'Init', 0.1);
sendPacket(ROWS-1,      ROWS*(COLS-1), 1, 'Init', 0.1);
sendPacket(ROWS*(COLS-1), ROWS-1,    1, 'Init', 0.1);

// ------------------------------------------------------------------
// Scenario traffic
// ------------------------------------------------------------------
if (SIM_STATEFUL === 'cross') {
    // Main path: corner 0 -> corner (ROWS*COLS-1), 5 kHz
    sendPacket(0,      ROWS*COLS-1,   1, 'Hi',    0.2,  true);
    // Cross-traffic: corner (ROWS-1) -> corner (ROWS*(COLS-1)), 10 kHz
    sendPacket(ROWS-1, ROWS*(COLS-1), 1, 'Cross', 0.1,  true);

} else if (SIM_STATEFUL === 'fail') {
    // Main path: corner 0 -> corner (ROWS*COLS-1), 5 kHz (matches sim.js SIM=3)
    sendPacket(0, ROWS*COLS-1, 1, 'Hi', 0.2, true);
    // No cross-traffic: this scenario isolates failure-recovery behavior only.

    // Disconnect an interior node at 11 ms that lies on the primary BFS path
    // from corner 0 to corner 15 (0→1→2→3→7→11→15), so the failure produces
    // a visible blackout window in the 0→15 RTT time series.
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
}

// ------------------------------------------------------------------
// Run
// ------------------------------------------------------------------
for (let i = 0; i < initTopology.length; i++) {
    net.add(1, clients[i]);
}
// For the failure scenario we need to run past the 50 ms LFA blackout window
// (failure at 11 ms + 50 ms delay = 61 ms) to show reconvergence.
net.run(SIM_STATEFUL === 'fail' ? syrup * 100 : syrup * 60);
