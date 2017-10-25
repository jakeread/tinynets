var net = require("./network"),
	manager = require('./manager');

var numClients = 5;

var clients = [];
for (var i = 0; i < numClients; i++) {
	c = new net.Client();
	c.use(manager);
	clients.push(c);
}

clients[0].init(function() {
	this.manager.connect(2);
	this.manager.connect(3);
});

clients[1].init(function() {
	this.manager.connect(4);
});

for (var i = 0; i < numClients; i++) {
	net.add(1, clients[i]);
}

net.run(100 * 1000); // runs for 100 seconds