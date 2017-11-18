# Tiny Nets

TinyNets presents a networking strategy for distributed robotic control systems.

## Networked Control Systems (NCS)

The field of Networked Control Systems, or NCS, is unique from many other networking fields. NCS refers to any application where many devices are linked together to perform control of a physical system. They are common in robotics and avionics, where many sensors and actuators work together to perform a common goal (i.e. walking, stabilization, etc), and in manufacturing, where machine degrees of freedom are linked to close positioning control loops, and where multiple machines are linked to coordinate material handling and production scheduling. 

Critically,
- In NCS, **total throughput is valued but not a key metric.** 
- Rather, message sizes are typically very small (between three to fifty bytes) and message delay time is the critical metric. Often, messages are only one-packet in length.  
- **Determinism in Message Delivery Time is critical** - systems must guarantee that certain control loops 'close' within a defined set of time, less they become unstable. 
- **Robustness is critical** - NCS should not contain any Single Points of Failure
- **Statelessness is critical** - NCS should not pause operation under any circumstances to re-converge on routing solutions, as this adds fatal indeterminism to message delivery. 

## The State of the Art in NCS

State of the art Networked Control Systems employ simple Switched Ethernet, or proprietary versions thereof, in order to route traffic. Hardware endpoints are fitted with an Ethernet PHY and are connected in a heirarchy of switches. Ethernet MAC addresses are used, and all routing takes place on Layer 2. 

Switched Ethernet has become the industry standard because of its relative interoperability and high speeds. Critically, the last 10 years has seen Switched Ethernet take up large portions of market share because it solves many problems associated with Fieldbusses. Most importantly, adding devices to a Fieldbus always caused a linear increase in message delivery time, as is not the case with Switched Ethernet.

## Dissatisfaction with Switched Ethernet

However, Switched Ethernet was not originally developed for Networked Control Systems, and many in industry have pointed out that it will not fulfill customer needs in the near- and long-term future.

In Switched Ethernet, because a Minimum Spanning Tree is created, nodes in a particular layer compete for link-time on the layer above. Message delay time increases linearly with the probability that peers are transmitting at the same time, and with the number of peers on that layer. 

In addition, Switched Ethernet contains Single Points of Failure, where a broken link or switch means that the network must re-run the Spanning Tree Protocol algorithm - a process that often takes seconds. Because Switched Ethernet graphs are highly heirarchical, it is often the case that failure on a single link can cause entire sections of the network to fail, or become unreachable. 

Device endpoints in NCS are scaling down in size and up in number. Requiring that each endpoint carries with it an RJ45 Magnetic Jack and Ethernet PHY is dubious, and sets a lower limit on the size and complexity that sensors and actuators in an NCS must posses. 

Switched Ethernet is non-programmable. I.E. Switches are black-box ICs and do not allow systems designers to arbitrarily add functions to a system on the networking layer. For example, many NCS designers would like to implement message priorities and load balancing, but this is not possible on Layer 2. 

# Constraints and Cost Functions for TinyNet

## Constraints

In the design of TinyNets, we operate under the following constraints:

- TinyNet should be trivially integrated on device endpoints. I.E. an endpoint should not require any additional hardware circuitry. This allows the network to scale down into micro-robotics applications.
- TinyNets should run entirely in C or C++ on the processors used on endpoints and routers, meaning that network protocols can be openly modified within an Autonomous System to perform application-specific tasks. TinyNets is Open Source Software.
- TinyNets should run with no global state. It should not have to re-converge on routing solutions in the face of broken or modified links, additions to the network, or changes in traffic patterns.

## Direct Comparisons

It will be difficult to perform one-to-one comparisons between our network and the state of the art, as we are proposing a completely new solution in response to problems in NCS that we believe cannot be addressed with incremental modifications to existing technologies. 

## Proving our Merit

However, we can offer analysis as to why we believe our approach is substantially better than current offerings - or has a better problem-solution fit than other technologies. 

**Realtime / Convergence Free Multipath Routing**
- Existing Multipath Routing Technologies offer multipath routing (which eliminates the switching-bottleneck issues associated with switched ethernet), however, they do so using link-state routing that requires each router to share common knowledge about the complete network graph. In the face of link outages or router failures, networks must re-converge - a process that interrupts flows and causes massive increases, or complete failures, in message deliveries. For example
 - ECMP (Equal Cost Multipath Routing)
 - OSPF (Open Shortest Path First)
 - SPB (Shortest Path Bridging)
 - TRILL (TRansparent Interconnect of Lots of Links)

We seek to demonstrate that these re-convergence times would cause operational failure in NCS, thus eliminating ECMP and OSPF as possible solutions to the NCS problem. 

@Dougie 
- can you try to work through the literature to build this argument, including references to measured convergence times? actually, I looked at the wikipedia pages (bad scholar!) for most of these protocols, and I think that simply stating that these are all link-state routing policies allows us to poo-poo them for convergence - the key would be to find particular references to expected scales and convergence times. 
- also, many of these protocols add information to the header, and in the interest of minimizing Message Delivery Times this is BNB (bad news bears)

**Switching Bottlenecks**
- In a careful literature review and analysis, we will show that Layer-2 Solutions (switched ethernet) necessarily cause switching bottlenecks that create Single Points of Failure and increases in Message Delivery Times to NCS.

@Nick, can you review that worst-case-packet-delay-time paper and see if we can add more beef to this argument, including some charts & graphs & references?

## Our Cost Functions

In addition to proving our merit with a careful literature review, we can devise cost functions and metrics to measure our development. These include:

**Optimal Network Utilization**
- Using logic analyzers and in-system programming to track message delay times and routes, we will measure the efforts of TinyNet routing policies to optimize network utilization and minimize message delivery times.

**Deterministic Packet Delivery in the face of Increasing Network Traffic**
- Similarly, we will measure TinyNet performance (in terms of message delivery times) as total network traffic increases.

**Robust Packet Delivery in the face of Lost Links and Routers**
- We will demonstrate TinyNet adaptively re-routing messages as links are cut, or routers are removed from the network graph, without any network re-convergence.  

# Key Contributions

A strategy for stateless multipath routing that increases message deliver time determinism and network robustness.

A real-time cost function, using next-hop buffer size (i.e. busyness metric) as well as historical hop-count for per-packet dynamic re-routing, that increases packet delivery-time determinism. 

A software-defined network architecture for arbitrary implementation in any embedded system, where computing, physical space, and time is limited. 

# Direct Applications

#### Micro-Robotics with Complexity

NCS via Switched Ethernet is impossible to drive into micro-robotics, where a single RJ45 Jack is larger than many endpoints. TinyNets provides a strategy and implementable software stack that will allow roboticists to bring adaptable, real-time networking to highly interconnected and complicated robotic systems. 

#### Avionics

Existing NCS are prone to Single Points of Failure and rapidly scaling complexity and cost. These is the bane of aircraft systems designers. We believe that TinyNet can offer avionics networks a robust, simple, and easily extensible strategy for the design and implementation of NCS in aircraft control systems. 

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

##### Packet Delivery Times in the face of Increasing Network Traffic

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