// Sensitivity analysis runner.
// Usage: node sensitivity_runner.js <dpkt_scale> <dbyte_scale> <bitrate_scale>
// Runs the 4x4 grid cross-traffic scenario (5 kHz main, 10 kHz cross, no failures)
// for 30 ms of sim time and prints "RTT <value>" lines to stdout.

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const dpktScale    = parseFloat(process.argv[2] || '1.0');
const dbyteScale   = parseFloat(process.argv[3] || '1.0');
const bitrateScale = parseFloat(process.argv[4] || '1.0');

// ── Patch manager source with scaled constants ────────────────────────────────
// Base values from hardware: D_process = 37 µs (measured, used in paper figures),
// D_byte = 1.25 µs, L_br = 20 MHz.
const BASE_DPKT    = 0.037;
const BASE_DBYTE   = 0.00125;
const BASE_BITRATE = 20e3;

let managerSrc = fs.readFileSync(path.join(__dirname, 'manager.js'), 'utf8');
managerSrc = managerSrc
    .replace('const D_PKT = .030*syrup',    `const D_PKT = ${BASE_DPKT    * dpktScale}*syrup`)
    .replace('const D_BYTE = .00125*syrup', `const D_BYTE = ${BASE_DBYTE  * dbyteScale}*syrup`)
    .replace('const BITRATE = 20e3/syrup',  `const BITRATE = ${BASE_BITRATE * bitrateScale}/syrup`);

// Evaluate manager source in global context so Manager() is available to network.js
const ctx = Object.assign({}, global, { module: { exports: {} }, require, __dirname, __filename });
vm.createContext(ctx);
vm.runInContext(managerSrc, ctx);
const Manager = ctx.Manager;

// ── Load a fresh Network instance (bypass singleton cache) ────────────────────
delete require.cache[require.resolve('./network')];
const net = require('./network');

// ── Grid topology (4x4) ───────────────────────────────────────────────────────
const ROWS = 4, COLS = 4;
const initTopology = [];
for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
        if      (r === 0         && c === 0)         initTopology.push([1, ROWS]);
        else if (r === ROWS-1    && c === 0)         initTopology.push([ROWS-2, 2*ROWS-1]);
        else if (r === 0         && c === COLS-1)    initTopology.push([ROWS*(COLS-2), ROWS*(COLS-1)+1]);
        else if (r === ROWS-1    && c === COLS-1)    initTopology.push([ROWS*(COLS-1)-1, ROWS*COLS-2]);
        else if (r === 0)         initTopology.push([(c-1)*ROWS,        c*ROWS+1,       (c+1)*ROWS]);
        else if (r === ROWS-1)    initTopology.push([c*ROWS-1,          (c+1)*ROWS-2,   (c+2)*ROWS-1]);
        else if (c === 0)         initTopology.push([r-1,               ROWS+r,         r+1]);
        else if (c === COLS-1)    initTopology.push([ROWS*(COLS-1)+r-1, ROWS*(COLS-2)+r, ROWS*(COLS-1)+r+1]);
        else                      initTopology.push([(c-1)*ROWS+r,      c*ROWS+r-1,     c*ROWS+r+1, (c+1)*ROWS+r]);
    }
}

const syrup          = 1000;
const startupDelay   = 0.01;
const connectDelay   = 0.01;
const D_INIT         = 1e3;   // warm-up before periodic traffic [sim units]
const PERIOD_TX_HB   = 1;     // [ms]
const PERIOD_TAKE_PULSE = 2;  // [ms]
const PERIOD_CLEAR_F = 10;    // [ms]
const SIM_END        = syrup * 61; // 61 ms, matching paper figure conditions

// Intercept log to extract RTT lines; separate by reporting node
// Log format: "[time]: nodeID: message"
const rttsMain  = []; // node 0 receiving ACK from node 15 (5 kHz main diagonal)
const rttsCross = []; // node 3 receiving ACK from node 12 (10 kHz cross diagonal)
const origLog = console.log.bind(console);
net.log = function(str) {
    const header = str.match(/\[\d+\]:\s*(\d+):\s*(.+)/);
    if (!header) return;
    const nodeId  = parseInt(header[1], 10);
    const message = header[2];
    const m = message.match(/got ACK from (\d+)\. RTT = (\d+)/);
    if (!m) return;
    const rtt = parseInt(m[2], 10);
    if      (nodeId === 0  && parseInt(m[1], 10) === ROWS*COLS-1) rttsMain.push(rtt);
    else if (nodeId === ROWS-1 && parseInt(m[1], 10) === ROWS*(COLS-1)) rttsCross.push(rtt);
};

// ── Build nodes ───────────────────────────────────────────────────────────────
const clients = [];
for (let i = 0; i < initTopology.length; i++) {
    const c = new net.Client();
    c.use(Manager);
    clients.push(c);
}

for (let i = 0; i < initTopology.length; i++) {
    clients[i].init(function() {
        this.delay(startupDelay, function() {
            this.manager.setup(initTopology[i].length);
        });
        this.tick(syrup * 0.001, function() { this.manager.checkBuffer(); });
        this.tick(syrup * PERIOD_TX_HB,      function() { this.manager.heartbeat();       });
        this.tick(syrup * PERIOD_TAKE_PULSE,  function() { this.manager.takePulse();       });
        this.tick(syrup * PERIOD_CLEAR_F,     function() { this.manager.clearSeenFloods(); });
    });
    for (let j = 0; j < initTopology[i].length; j++) {
        clients[i].init(function() {
            this.delay(startupDelay + connectDelay, function() {
                this.manager.connect(j, initTopology[i][j]);
            });
        });
    }
}

// ── Traffic: 5 kHz main diagonal (0→15), 10 kHz cross (3→12) ────────────────
function sendPeriodic(from, dest, size, periodMs) {
    clients[from].init(function() {
        this.delay(D_INIT, function() {
            this.tick(syrup * periodMs, function() {
                this.manager.sendPacket(252, dest, 1, undefined, size, null);
            });
        });
    });
}
const crossPeriodMs = parseFloat(process.argv[5] || '0.1'); // default 10 kHz
sendPeriodic(0,  ROWS*COLS-1, 1, 0.2);          // 5 kHz main
sendPeriodic(ROWS-1, ROWS*(COLS-1), 1, crossPeriodMs); // cross traffic

for (let i = 0; i < initTopology.length; i++) {
    net.add(1, clients[i]);
}

// ── Run simulation ────────────────────────────────────────────────────────────
net.run(SIM_END);

// ── Output statistics ─────────────────────────────────────────────────────────
function stats(arr, label) {
    const n = arr.length;
    if (n < 2) { origLog(`  ${label}: too few samples (${n})`); return; }
    const mean = arr.reduce((a, b) => a + b, 0) / n;
    const sigma = Math.sqrt(arr.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1));
    origLog(`  ${label}: n=${n} mean=${mean.toFixed(1)} sigma=${sigma.toFixed(2)}`);
}

origLog(`dpkt=${dpktScale} dbyte=${dbyteScale} bitrate=${bitrateScale}`);
stats(rttsMain,  'main (0→15, 5 kHz)');
stats(rttsCross, 'cross (3→12, 10 kHz)');
