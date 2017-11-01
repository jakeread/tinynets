# TinyNets Simulator

A modified version of [simbit](https://github.com/ebfull/simbit).

## Basic use

The code you will need to run simulations is in sim.js. You initialize the network topology on line 8 as an array of arrays. 

Each subarray represents a client, and each value in the subarray represents the client which is connected on that port (the port number being the index). 

For example, the following code creates a network of 5 nodes which are all connected to each other. 
```javascript
var initTopology = [
	[1, 2, 3, 4],
	[2, 3, 4, 0],
	[3, 4, 0, 1],
	[4, 0, 1, 2],
	[0, 1, 2, 3]
];
```

Or, this code creates a dumbbell topology.
```javascript
var initTopology = [
	[3],
	[3],
	[3],
	[0, 1, 2, 4],
	[3, 5, 6, 7],
	[4],
	[4],
	[4]
];
```

Note that you should initialize nodes with all the ports you want them to have — you will not be able to add more ports later. If a port is initially unconnected, set its value to -1. 

Farther down, around line 50, you can find where you should place actions for the simulator to perform after it has initialized the network topology. You can use the helper functions ```send```, ```sendPacket```, ```connect```, and ```disconnect``` to control the simulation as follows:

```send(from, port, message, delay, periodic=false)```

Sends a message from the specified client.
* ```from```: the client from which the message should be sent
* ```port```: the port on which to send the message
* ```message```: the message to be sent
* ```delay```: the time, in ms, after simulation start to perform this action
* ```periodic```: if true, will perform the action every ```delay``` ms

```sendPacket(from, dest, size, data, delay, periodic=false)```

Sends a packet from one client to another using TinyNets' routing
* ```from```: the client from which the message should be sent
* ```dest```: the client where the packet should end up
* ```size```: the size of the data payload in bytes
* ```data```: the payload
* ```delay```: the time, in ms, after simulation start to perform this action
* ```periodic```: if true, will perform the action every ```delay``` ms

```connect(a, aPort, b, bPort, delay)```

```disconnect(a, aPort, b, bPort, delay)```

Connects or disconnects two clients. Note that the disconnect method does not require ```a``` and ```b``` to actually be connected on the specified ports, so make sure that what you pass it is correct or unspecified behavior could result!
* ```a```: The first client to disconnect
* ```aPort```: The port which should be disconnected on the first client
* ```b```: The second client to disconnect
* ```bPort```: The port which should be disconnected on the second client

Note that there are delays associated with startup and initial connections, which can be set on lines 4 and 5. You should not set any actions to happen until these have completed!