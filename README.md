# Tiny Nets

TinyNets presents a networking strategy for distributed robotic control systems. Resilient Stateless Multipath Message Passing for Very Fast Very Small Messages: RSMMRVFVSM ... 

## Networked Control Systems (NCS)

The field of Networked Control Systems, or NCS, is unique from many other networking fields. NCS refers to any application where many devices are linked together to perform control of a physical system. They are common in robotics and avionics, where many sensors and actuators work together to perform a common goal (i.e. walking, stabilization, etc.), and in manufacturing, where machine degrees of freedom are linked to close positioning control loops, and where multiple machines are linked to coordinate material handling and production scheduling. 

Critically,
- In NCS, **total throughput is valued but not a key metric.** 
- Rather, message sizes are typically very small (between three and fifty bytes) and message delay time is the critical metric. Often, messages are only one packet in length.  
- **Determinism in Message Delivery Time is critical** - systems must guarantee that certain control loops 'close' within a defined set of time less they become unstable. 
- **Robustness is critical** - NCS should not contain any Single Points of Failure
- **Statelessness is critical** - NCS should not pause operation under any circumstances to re-converge on routing solutions, as this adds fatal indeterminism to message delivery. 

## The State of the Art in NCS

State of the art Networked Control Systems employ simple Switched Ethernet, or proprietary versions thereof, in order to route traffic. Hardware endpoints are fitted with an Ethernet PHY and are connected in a heirarchy of switches. Ethernet MAC addresses are used, and all routing takes place on Layer 2. 

Switched Ethernet has become the industry standard because of its relative interoperability and high speeds. Critically, the last 10 years has seen Switched Ethernet take up large portions of market share because it solves many problems associated with Fieldbusses. Most importantly, adding devices to a Fieldbus always caused a linear increase in message delivery time, as is not the case with Switched Ethernet.

## Dissatisfaction with Switched Ethernet

However, Switched Ethernet was not originally developed for Networked Control Systems, and many in industry have pointed out that it will not fulfill customer needs in the near- and long-term future.

In Switched Ethernet, because a Minimum Spanning Tree is created, nodes in a particular layer compete for link-time on the layer above. Message delay time increases linearly with the probability that peers are transmitting at the same time, and with the number of peers on that layer. 

In addition, Switched Ethernet contains Single Points of Failure, where a broken link or switch means that the network must re-run the Spanning Tree Protocol algorithm - a process that often takes seconds. Because Switched Ethernet graphs are highly heirarchical, it is often the case that failure on a single link can cause entire sections of the network to fail, or become unreachable. 

Device endpoints in NCS are scaling down in size and up in number. Requiring that each endpoint carries with it an RJ45 Magnetic Jack and Ethernet PHY is dubious, and sets a lower limit on the size and complexity that sensors and actuators in an NCS must possess. 

Switched Ethernet is non-programmable. I.E. Switches are black-box IC's and do not allow systems designers to arbitrarily add functions to a system on the networking layer. For example, many NCS designers would like to implement message priorities and load balancing, but this is not possible on Layer 2. 

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

**Realtime / Convergence Free Multipath Routing in a Distance-Vector Routing Protocol**
- Existing Multipath Routing Technologies offer multipath routing (which eliminates the switching-bottleneck issues associated with switched ethernet), however, they do so using link-state routing that requires each router to share common knowledge about the complete network graph. In the face of link outages or router failures, networks must re-converge - a process that interrupts flows and causes massive increases, or complete failures, in message deliveries. For example
 - ECMP (Equal Cost Multipath Routing): more of a tool than an actual strategy; simply considers multiple paths when there are multiple best paths, i.e. load balancing mechanism
 - OSPF (Open Shortest Path First): Computes shortest path tree using Dijstra -- must know entire graph; wikipedia states convergence time is on the order of seconds (links to Cisco default parameters that set timeouts to be multiple seconds); specifically for Ethernet and offers a multipath version
 - SPB (Shortest Path Bridging): allows multiple equal cost paths and claims network is unaffected when a node fails except for the path(s) affected by the node failure, i.e. still cannot find another path if there is a unique shortest path containing a broken link
 - TRILL (TRansparent Interconnect of Lots of Links): must know entire graph, otherwise extremely similar to our protocol (uses hop counts and has similar flooding procedure); operates in Layer 2 and uses Fabric Shortest Path First (FSPF) to calculate alternate routes in node failure scenarios

We seek to demonstrate that these re-convergence times would cause operational failure in NCS, thus eliminating ECMP and OSPF as possible solutions to the NCS problem. 

The three protocols in question (OSPF, SPB, TRILL) require knowing the entire graph to perform a global shortest path calculation. All three of them allow for multipath consideration when there are multiple best paths. 200 ms seems to be the lower bound on convergence times as FSPF is quoted to having as good as 200 ms convergence time in the book "IBM SAN Solution Design Best Practices for VMWare" book. The vanilla OSPF protocol that Cisco offers indicates around an order second convergence time while optimized versions offer similar timing to FSPF (see paper).

200 ms sounds like a reasonable convergence time (and is quoted as being extremely fast) so to prove our merit, we need to demonstrate systems that do not have multiple shortest paths using the protocols above. This should highlight the main benefit of our protocol, that being the capability to perform real time alternate path calculations in a reasonable amount of time.

We propose designing multiple experiments to showcase the benefit of our protocol:
1. Grid structure network - test latency of corner communication and traffic of network during node failure. This test will serve as a control since there will be many shortest paths (if hop count is used as the metric).
2. Ring structure network - we already have graphs for this from the other protocol and it will demonstrate the speed at which each protocol finds the only other path in the event of a node failure.
3. Mesh network - fully connected network that will test our network utilization (ensure ringing doesn't happen or is at least bounded tightly). Test the latency of cross network communication in the event of a node failure. We should expect to see minimal decision time in our protocol and minimal flooding.

**Avoiding Switching Bottlenecks with Multipath Routing**
- In a careful literature review and analysis, we will show that Layer-2 Solutions (switched ethernet) necessarily cause switching bottlenecks that create Single Points of Failure and increases in Message Delivery Times to NCS.

From [worst-case-packet-delay-time paper], we know that the worst case communication delay over Ethernet occurs when the number of frames attempting to communicate over a single switch is the greatest. For example, when a spanning tree organizes itself such that 24 stations are connected to a single switching hub, a typical 144-bit message with a bit time of 0.1 us would take more than 1.5 ms to finish sending a single packet from all stations. If the packets could be interconnected without the tree structure required by Ethernet/IP, transmission time could be brought down to just over 300 us. 

![Effects of Varying Parameters on Communication Time](https://github.com/jakeread/tinynets/blob/master/document/worst-case-ethernet.png)

The above figure compares strategies for reducing communication time. The parameter which has the largest parameter is the number of frames being communicated over a single switch. This is to be expected, since that parameter will have a multiplicative effect on the queuing delay. By sacrificing the spanning tree topology and leveraging multipath routing without the added processing delays and stateful nature of ECMP or other link-state routing methodologies, we will drastically reduce frame count and, therefore, communication time.

## Our Cost Functions

In addition to proving our merit with a careful literature review, we can devise cost functions and metrics to measure our development. These include:

**Optimal Network Utilization**
- Using logic analyzers and in-system programming to track message delay times and routes, we will measure the efforts of TinyNet routing policies to optimize network utilization and minimize message delivery times.

**Deterministic Packet Delivery in the face of Increasing Network Traffic**
- Similarly, we will measure TinyNet performance (in terms of message delivery times) as total network traffic increases.

**Robust Packet Delivery in the face of Lost Links and Routers**
- We will demonstrate TinyNet adaptively re-routing messages as links are cut, or routers are removed from the network graph, without any network re-convergence.  

# Key Contributions

A strategy for stateless multipath routing that increases message delivery time determinism and network robustness.

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

We develop a router, protocol and implementation of a network that: 
 - Implements a Multipath Distance-Vector Routing Protocol
 - Does Realtime Route Selection
 - Does Automatic, Convergence-free Route Discovery and Optimization
 - Is robust in the face of link losses and router failures
 - Can be arbitrarily implemented in software on numerous microcontrollers

## Addressing 
    - 10-bit address (1024 Unique in System, scalable by systems designers at the cost of larger packet size)
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

if the packet is not a buffer update:
	update the LUT using packet src. and hop count

if packet is standard:
    if I am destination:
        process data in packet
		reply with ACK
    else:
		increment hop count
        if LUT has destination address:
            send packet to port which minimizes C(hops, buffer) = hops + \lambda*buffer over all ports
        else:
            send packet to all ports as standard flood

elseif packet is ack:
    if I am destination:
        process acknowledgement
    else:
        increment hop count
        if LUT has destination address:
            send packet to port which minimizes C(hops, buffer) = hops + \lambda*buffer over all ports
        else:
            send packet to all ports as ack flood

elseif packet is standard flood:
	remove packet src. from LUT at that port if it exists
	if I have not yet seen this flood:
		if I am destination:
			process data in packet
			reply with ACK
		else:
			increment hop count
			if LUT has destination address:
				send packet to port which minimizes C(hops, buffer) = hops + \lambda*buffer as standard packet
			else:
				send packet to all ports except one from which it was received

elseif packet is ack flood
    remove packet src. from LUT at that port if it exists
    if I am destination:
        process acknowledgement
    else:
		increment hop count
        if LUT has destination address:
            send packet to port which minimizes C(hops, buffer) = hops + \lambda*buffer as standard ACK
        else:
            send packet to all ports except one from which it was received

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

# Next Steps

Presents a good option for wired routing over robust networks, with some complexity pushed into the nodes. Only really advantageous when we want to be able to re-route messages upstream in order to move around bottlenecks. TN does load-balancing without thinking about it... other approaches would require some implementation. Perhaps there's a learning function for network path planning & routing? 

If we include flows, needs per-flow, not per-packet, routing - if we are going to hop about per buffers etc. 

Wants a C API for packetizing streams / flows. 

Still some question about duplicate message arrivals after message? OR don't packetize flows - add source -> destination 0-255 counter, only take next in this series. 

TN wins over the blissfully simple APA when we want a *very big* network, say, want 1,000,000 objects to individually address 1,000,000 objects. Here we also need to introduce heirarchichal addressing. 

'Napoleon's Messenger' 

APA is *loads* simpler to implement on FPGA

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
