/**
 * sim_airplane.js
 *
 * Airplane-wing topology from sim.js (SIM = 2), runnable under Node:
 *   node 0 = master; nodes 1..CTRL = controllers, each linked to the master
 *   and to every motor; motors form a chain, and each motor has one encoder.
 * Traffic (as in sim.js): motor -> own encoder at 2.5 kHz, controller -> motor
 * at 1 kHz for every pair, master -> each encoder at 500 Hz.
 *
 * Run from sim/TinyNets/:
 *   D_PKT_US=37 RATE_SCALE=0.5 node public_html/sim_airplane.js [RUN_MS] > ../log_airplane.txt
 */

var net     = require('./network');
var manager = require('./manager');

const syrup = 1000;
const dt    = 0.001;

const CTRL  = 3;
const MOTOR = 8;

const D_INIT            = 1e3;
const PERIOD_CLEAR_F    = 10;
const PERIOD_TX_HB      = 1;
const PERIOD_TAKE_PULSE = 2 * PERIOD_TX_HB;

const startupDelay = 0.01;
const connectDelay = 0.01;
const RUN_MS = parseFloat(process.argv[2] || '200');
// RATE_SCALE multiplies every periodic traffic rate (1 = the rates in sim.js).
const RATE_SCALE = parseFloat(process.env.RATE_SCALE || '1');

// ------------------------------------------------------------------
// Topology (identical to sim.js case 2)
// ------------------------------------------------------------------
var ctrl = [], motor = [], encoder = [];
for (let c = 1; c <= CTRL; c++) ctrl.push(c);
for (let m = 1; m <= MOTOR; m++) { motor.push(CTRL + m); encoder.push(CTRL + MOTOR + m); }

var initTopology = [ctrl];
for (let c in ctrl) initTopology.push([0].concat(motor));
for (let m = 0; m < motor.length; m++) {
    if (m === 0)                     initTopology.push(ctrl.concat([motor[m+1]]).concat([encoder[m]]));
    else if (m === motor.length - 1) initTopology.push(ctrl.concat([motor[m-1]]).concat([encoder[m]]));
    else                             initTopology.push(ctrl.concat([motor[m-1]]).concat([motor[m+1]]).concat([encoder[m]]));
}
for (let m = 0; m < motor.length; m++) initTopology.push([motor[m]]);

// ------------------------------------------------------------------
// Nodes
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
            this.delay(startupDelay, function() { this.manager.setup(initTopology[i].length); });
            this.tick(syrup * dt,                function() { this.manager.checkBuffer();     });
            this.tick(syrup * PERIOD_TX_HB,      function() { this.manager.heartbeat();       });
            this.tick(syrup * PERIOD_TAKE_PULSE, function() { this.manager.takePulse();       });
            this.tick(syrup * PERIOD_CLEAR_F,    function() { this.manager.clearSeenFloods(); });
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

// ------------------------------------------------------------------
// Traffic (identical to sim.js case 2)
// ------------------------------------------------------------------
for (let m = 0; m < MOTOR; m++) {
    sendPacket(motor[m], encoder[m], 1, 'Init', .1);
    sendPacket(encoder[m], motor[m], 1, 'Init', .1);
}
motor.forEach(function(m) {
    ctrl.forEach(function(c) {
        sendPacket(c, m, 1, 'Init', .1);
        sendPacket(m, c, 1, 'Init', .1);
    });
});
for (let i = 1; i <= MOTOR; i++) {
    sendPacket(0, motor[motor.length-1] + i, 1, 'Init', .1);
    sendPacket(motor[motor.length-1] + i, 0, 1, 'Init', .1);
}

for (let m = 0; m < MOTOR; m++) sendPacket(motor[m], encoder[m], 1, '2.5k', .4 / RATE_SCALE, true);
motor.forEach(function(m) {
    ctrl.forEach(function(c) { sendPacket(c, m, 1, '1k', 1 / RATE_SCALE, true); });
});
for (let i = 1; i <= MOTOR; i++) sendPacket(0, motor[motor.length-1] + i, 1, '500', 2 / RATE_SCALE, true);

for (let i = 0; i < initTopology.length; i++) net.add(1, clients[i]);
net.run(syrup * RUN_MS);
