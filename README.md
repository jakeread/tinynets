# Tiny Nets

Is a protocol for dynamic realtime networking in embedded systems. A fully meshed network with minimum hardware overhead. Increased determinism in the face of network congestion, and reduced message delivery times.

## To be Addressed

### What is our Objective Cost Function

##### Packet Delivery Times in the face of Increasing Network Traffic

Packet Delivery Time is the critical metric in Networked Control Systems - small amounts of information (sensor, motor data) needs to be delivered quickly.

In Switched Ethernet, because a Minimum Spanning Tree is created, nodes in a particular layer compete for link-time on the layer above. Message delay time increases linearly with the probability that peers are transmitting at the same time, and with the number of peers on that layer. 

~ plot w/ x-axis is # nodes, transmitting at some % of time, y axis is per-packet delivery time ~
~ graph is single branch / spanning tree

Critically, adding multi-path to the graph above decreases the slope of this plot. Twice the total link-time on the layer above is available, or Nx, where N is the number of nodes added to the next. 

* state of the art for this? there is lit review to do here - look up TRILL and SPB (shortest path bridging). Much of it comes from Data Center Networks. 
 - https://datacenteroverlords.com/2011/08/19/multi-path-ethernet-the-flying-cars-of-the-data-center/ 
 - http://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=6888840
 - https://en.wikipedia.org/wiki/Equal-cost_multi-path_routing
 - https://infoscience.epfl.ch/record/231114/files/main_nr.pdf

Also critically, *it seems that, in a cursory overview* many multi-path techniques in use today basically do dynamic spanning-tree rebuilds. These spanning-tree rebuilds have long convergence times (162ms is excitingly fast). 

However, to increase determinism routes need to be chosen dymanically - so that *very short timescale* changes can be made to a packet, mid-network-traverse, to route around busy switches. Of interest is finding evidence that this is not done in any existing system.

### What are our Constraints

##### Minimum or No Hardware Overhead

System should be arbitrarily implemented on microcontrollers, in software, with system-designer defined hardware and network parameters. No big jacks, no small bits, no proprietary IC's or black box IC's. Open Source Network for Realtime Control.

Network Switching should take place in the same processor as computation for the application - I.E. chips that do motor control should also do network switching. This allows network implementation to shrink into micro-robotics, where singular processors are available at each joint / DOF, and these processors perform network tasks as well as application (control) computation.

### Key Contribution

A real-time cost function, using next-hop buffer size (i.e. business metric) as well as historical hop-count for per-packet dynamic re-routing, that increases packet delivery-time determinism. 

A software-defined network architecture for arbitrary implementation in any embedded system, where computing, physical space, and time is limited. 

### Direct Application

##### Open Source Reconfigurable Hardware Systems

In particular, hardware design for embedded systems in the open source (i.e. non-expert) realm. We want to offer a networking solution that allows open source designers to easily integrate their systems. We take the example of a proliferation of 3D Printer Control systems, none of which interop, and the interfaces between are a PITA. Expand on this. 

# TinyNet Protocol & Architecture

We develop a switch, protocol and implementation of a software-defined network that: 
 - Does Realtime Route Selection
 - Does Automatic, Convergence-free Route Discovery and Optimization
 - Can be arbitrarily implemented in software on numerous microcontrollers

## Addressing 
    - 10-bit address (1024 Unique in System)
    - Addresses are assigned in software (Ethernet: Hardware Addresses)
    - Can be location-based (e.g. first five MSBs correspond to x, last five correspond to y)

## Packet Structure  

| Type | 8 Bits | 10 Bits | 6 Bits | 10 Bits | 6 Bits | N Bytes | CRC |  
| --- | --- | --- | --- | --- | --- | --- | --- | 
| Standard: | 255 | Dest. | Hop Count | Src. | # Bytes | Payload … | CRC |  
| ACK: | 253 | Dest. | Hop Count | Src. | x | x | CRC |  
| Buffer Length: | [0 - 251] | x | x | x | x | x | x |  

* previously-flooded Standard Packets have start delimiter 254
* previously-flooded Acks have start delimiter 252

## Routing Rules

On Packet Received:
```swift

if hop count > max:
    kill packet

increment hop count

if packet is standard:
    if LUT does not already have source address:
        add entry to LUT
    if I am destination:
        process data in packet
    else:
        if LUT has destination address:
            send packet to port which minimizes C(hops, buffer) = hops + \lambda*buffer over all ports
        else:
            send packet to all ports as standard flood

elseif packet is ack:
    if LUT does not already have source address:
        add entry to LUT
    if I am destination:
        process acknowledgement, increment window
    else:
        increment hop count
        if LUT has destination address:
            send packet to port which minimizes C(hops, buffer) = hops + \lambda*buffer over all ports
        else:
            send packet to all ports as ack flood

elseif packet is standard flood:
    if LUT does not already have source address:
        add entry to LUT
    if I am destination:
        process data in packet
        open window for duplicate packet elimination
        check previous duplicates
    else:
        if LUT has destination address:
            send packet to port which minimizes C(hops, buffer) = hops + \lambda*buffer over all ports
        else:
            send packet to all ports

elseif packet is ack flood
    if LUT does not already have source address:
        add entry to LUT
    if I am destination:
        process acknowledgement, increment window
        open timer for duplicate ack elimination
        check previous duplicates
    else:
        if LUT has destination address:
            send packet to port which minimizes C(hops, buffer) = hops + \lambda*buffer over all ports
        else:
            send packet to all ports

else:
    write buffer depth to LUT

```

## Routing Table

The routing table (or lookup table, LUT) consists of rows of:  

| Destination | Seen on Ports | Min. Hopcount Recorded on Port | Port buffer size |

This is different from standard Ethernet routing tables:

| Ports | Destinations seen on Port |

Because it includes the current port buffer size and number of hops as part of the table entry, allowing for a more robust cost function for use in the path planning algorithm. 

## Buffer Depth Updates
Send buffer depth on all ports every q seconds, and every time a packet leaves or arrives

## Announcements 
New arrivals to network do not announce, they simply begin transmitting. Their addresses are recoreded in surrounding switches' tables on their first packet-out.

## Withdrawals
Buffer Depth Updates are Periodic as well as event-based (on buffer-depth change). When no BDU is heard within a 250ms (or other setting) window, the node is considered withdrawn.

# Hardware

![first-board](https://github.com/jakeread/tinynets/blob/master/document/xmega128-fourport-v0-1.png)  

See /circuit 
See /embedded 

# Reading

#### Networked Control Systems
Ethernet in Networked Control, advantages and drawbacks.  
See especially  
**/litreview/papers/network-control-systems/survey-on-realtime-via-ethernet**  
**/litreview/papers/network-control-systems/the-emergence-of-networked-controls**  

#### Robotics
Papers on the particular applications of distributed control in a robotics context  

#### ALA-APA-ATP
Prior work from our lab on networking, aligning hardware with software, etc ...

#### Farout
Way crazy ideas, esp. self-reproducing-automata
