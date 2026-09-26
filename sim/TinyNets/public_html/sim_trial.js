/**
 * sim_trial.js
 *
 * One trial of the failure-recovery experiment (../../failure_experiment/DESIGN.md):
 * corner-to-corner main flow plus opposite-diagonal cross flow on a grid,
 * with a set of nodes failing simultaneously. The same driver runs both
 * protocols so topology, traffic and failure schedule are identical.
 *
 * Environment:
 *   PROTO       tinynet | lfa                      (default tinynet)
 *   FAIL_NODES  comma-separated node ids           (default none)
 *   FAIL_MS     failure time [ms]                  (default 11)
 *   RUN_MS      simulated duration [ms]            (default FAIL_MS + 290)
 *   MAIN_KHZ, CROSS_KHZ, GRID, D_PKT_US            as in sim_cross.js
 *   LFA_MS      BFD detection time [ms]            (lfa only, default 10)
 *   RECONV_MS   IGP reconvergence after failure    (lfa only, default 200)
 *
 * Output: TRACE-format delivery log on stdout.
 *
 * Run from sim/TinyNets/:
 *   PROTO=lfa FAIL_NODES=5,10 FAIL_MS=11.7 node public_html/sim_trial.js > trial.txt
 */

const PROTO = process.env.PROTO || 'tinynet';
process.env.TRACE = '1';
if (PROTO === 'lfa') {
    process.env.LFA_MODE = 'realistic';
    process.env.LFA_MS   = process.env.LFA_MS || '10';
}

var net     = require('./network');
var Manager = require(PROTO === 'lfa' ? './manager_stateful' : './manager');

const syrup = 1000;
const dt    = 0.001;

const ROWS = parseInt(process.env.GRID || '4');
const COLS = ROWS;

const D_INIT            = 1e3;
const PERIOD_CLEAR_F    = 10;
const PERIOD_TX_HB      = 1;
const PERIOD_TAKE_PULSE = 2 * PERIOD_TX_HB;

const startupDelay = 0.01;
const connectDelay = 0.01;

const FAIL_NODES = (process.env.FAIL_NODES || '').split(',').filter(s => s !== '').map(Number);
const FAIL_MS    = parseFloat(process.env.FAIL_MS   || '11');
const RUN_MS     = parseFloat(process.env.RUN_MS    || String(FAIL_MS + 290));
const RECONV_MS  = parseFloat(process.env.RECONV_MS || '200');
const MAIN_KHZ   = parseFloat(process.env.MAIN_KHZ  || '5');
const CROSS_KHZ  = parseFloat(process.env.CROSS_KHZ || '10');

// ------------------------------------------------------------------
// Grid topology (identical to sim.js SIM=3)
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
// Shared, mutable copy: the LFA manager marks dead ports here at runtime
// and uses it for BFS at reconvergence.
var topology = initTopology.map(arr => arr.slice());

// ------------------------------------------------------------------
// Nodes
// ------------------------------------------------------------------
var clients = [];
for (let i = 0; i < initTopology.length; i++) {
    var c = new net.Client();
    c.use(Manager);
    clients.push(c);
}

for (let i = 0; i < initTopology.length; i++) {
    (function(i) {
        clients[i].init(function() {
            this.delay(startupDelay, function() {
                if (PROTO === 'lfa') this.manager.setup(initTopology[i].length, i, topology);
                else                 this.manager.setup(initTopology[i].length);
            });
            this.tick(syrup * dt,                function() { this.manager.checkBuffer();     });
            this.tick(syrup * PERIOD_TX_HB,      function() { this.manager.heartbeat();       });
            this.tick(syrup * PERIOD_TAKE_PULSE, function() { this.manager.takePulse();       });
            this.tick(syrup * PERIOD_CLEAR_F,    function() { this.manager.clearSeenFloods(); });
            if (PROTO === 'lfa' && FAIL_NODES.length) {
                // IGP reconvergence: every node recomputes on the post-failure topology.
                this.delay(syrup * (FAIL_MS + RECONV_MS), function() { this.manager.reconverge(); });
            }
        });
        for (let j = 0; j < initTopology[i].length; j++) {
            clients[i].init(function() {
                this.delay(startupDelay + connectDelay, function() {
                    this.manager.connect(j, initTopology[i][j]);
                });
            });
        }
    })(i);
}

function sendPacket(from, dest, size, data, delay, periodic) {
    clients[from].init(function() {
        if (periodic) {
            this.delay(D_INIT, function() {
                this.tick(syrup * delay, function() {
                    this.manager.sendPacket(252, dest, 1, undefined, size, data);
                });
            });
        } else {
            this.delay(syrup * delay, function() {
                this.manager.sendPacket(252, dest, 1, undefined, size, data);
            });
        }
    });
}

function disconnectPort(a, aPort, delay) {
    clients[a].init(function() {
        this.delay(syrup * delay, function() {
            this.manager.disconnect(aPort);
        });
    });
}

// ------------------------------------------------------------------
// Traffic (warm-up as in sim_cross.js / sim_stateful.js)
// ------------------------------------------------------------------
sendPacket(0,             ROWS*COLS-1,   1, 'Init', 0.1);
sendPacket(ROWS*COLS-1,   0,             1, 'Init', 0.1);
sendPacket(ROWS-1,        ROWS*(COLS-1), 1, 'Init', 0.1);
sendPacket(ROWS*(COLS-1), ROWS-1,        1, 'Init', 0.1);
sendPacket(0,      ROWS*COLS-1,   1, 'Hi',    1 / MAIN_KHZ,  true);
sendPacket(ROWS-1, ROWS*(COLS-1), 1, 'Cross', 1 / CROSS_KHZ, true);

// ------------------------------------------------------------------
// Failures: disconnect every link of every failed node, on both ends.
// ------------------------------------------------------------------
FAIL_NODES.forEach(function(f) {
    for (let p = 0; p < initTopology[f].length; p++) {
        var nb = initTopology[f][p];
        disconnectPort(f, p, FAIL_MS);
        disconnectPort(nb, initTopology[nb].indexOf(f), FAIL_MS);
    }
});

for (let i = 0; i < initTopology.length; i++) {
    net.add(1, clients[i]);
}
net.run(syrup * RUN_MS);
