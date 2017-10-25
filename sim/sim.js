var net = require("./network"),
	manager = require('./manager');

const numClients = 2;
const startupDelay = 100;

var clients = [];
for (var i = 0; i < numClients; i++) {
	c = new net.Client();
	c.use(manager);
	clients.push(c);
}

clients[0].init(function() {
	this.delay(startupDelay, function() {
		this.manager.setup(1);
		this.manager.connect(0, 1);
	});

	this.delay(1000, function() {
		this.manager.send(0, 'Special Delivery', 'Surprise!!!');
	});

});

clients[1].init(function() {
	this.delay(startupDelay, function() {
		this.manager.setup(1);
		this.manager.connect(0, 0);
	});
});

for (var i = 0; i < numClients; i++) {
	net.add(1, clients[i]);
}
net.run(100 * 1000); // runs for 100 seconds