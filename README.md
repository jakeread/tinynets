# tinynets

## Working!

Currently:

### Jake
 - Hardware for Packet Testing
 - Ring tests for future hardware
 - IDE Setup Documentation
 - Daydreaming

### Nick
 - Lit Review on Routing Optimization

### Dougie
 - Bit-Level Protocols

### Patrick
 - 


## Tracking 

#### Hardware

[first-board](https://github.com/jakeread/tinynets/blob/master/document/atsam-twoport.jpg)  


#### Thinkin'

w/r/t addressing, while considering the 'game of life' interpretation of a network: addresses don't exist as we classically think of them - as a global address belongs to a global state, which the game of life eschews (that's rather the whole point: a representation of the 'global state' exists but that's not 'what's going on').  

rather, each node has it's own 'map' of it's nearest neighbours, and an 'address' is a route, not an endpoint. two routes may lead to the same node, and perhaps that node is id'd by some UID, or more likely is 'id'd' by it's location, or it's state, it's ability to do work, etc ...

so instead of keeping track of all nodes and their current state, we simply ping the network for new states & new routes, and pick the thing-we-want at the shortest address (route). this scales: the system naturally chooses resources that are nearby (bc shortest address)

instead of considering a 'global' graph, consider that each node draws its own graphs, and those graphs are dynamic. multiple truths exist, and more global states (i.e. states involving more than one processor) have truths which are resolved cooperatively using some kind of arbitrage (a-la blockchain?)
