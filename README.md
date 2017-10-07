# tinynets

## *buzzwords* lightweight adaptable networking for distributed embedded computing *buzzwords*

### What / What For?

What about short timescale distributed computing? Most networks are optimized for total throughput - the average number of bits that can be transmitted in a second. Throughput is desirable in streaming applications, browsing, and nearly any human-timescale based interaction, but ping time (or latency) is often good-enough (say, tenths of a second being noticable). 

Where multiple nodes need to coordinate in near real-time, e.g. in robotics and automation or in augmented reality and physical interface applications, packet size and throughput is not so critical, but latency is. Robots are not streaming video to eachother, but nodes need to collectively close control loops in sub-millisecond timescales. Data rates can be smaller, but ping times must be minimized.

### Why Now?

The cat is out of the bag re: embedded computing. Today, a 32-bit 120MHz CPU with hardware floating point operations and a WiFi radio can be had for $5. A chip like this is a few grams x a few millimeters and runs on milliamps of current. We have open season on radically distributed hardware systems. In order to truly leverage this dropping cost curve and enable distributed (micro)computing, we need inter-processor communication that is fast, reliable, and decentralized.

### The State of the Art

The state-of-the-art for inter-processor communications are roughly as follows:

UART | SPI | | EtherCAT | CANBus, etc  

All of these technologies rely on some kind of overall systems architecture: UART has Baud Rates, SPI has clock speeds and highly regulated master / slave heirarchies, EtherCAT is basically SPI on speed, CANBus is slow and cumbersome, etc. In any of these architectures it is non-trivial to add processors (extra data lines are needed, etc), processors must operate at similar speeds and follow the same protocols, and often have the same exact hardware. This means that developing complex embedded systems is cumbersome, and relegated to experts. Robots are not democratized! Automation is in the hands of the very well trained!   

### The Internet's Insights

The internet became successful when performance standards were abandoned and interoperability was expanded. It's an interconnect of different networks, not a singular wholistic system. This is what allowed it to grow and change and become the sprawling, wonderful mess it is today. The same technology, or approach, does not exist in embedded computing, where (until recently) small computing power meant that systems had to be hand-engineered one at a time, to work in very particular regimes, for very particular tasks.

### This Proposal

The notion here is to explore all layers of network architecture - the PHY, MAC, Network and Transport - where assumptions about throughput are set aside in favour of minimizing latency, and maximizing interoperability for physical systems, while minimizing size, power and overhead complexity. I.E. how fast can a motor controller request and get information from an encoder, or the position of a human interface device, etc. How quickly can systems which operate in 'real-time' be modified, extended, adapted, etc.

### Hardware

We have access to a slew of hardware-making capabilities at the Center for Bits and Atoms, as well as resource to purchase dev boards, IC's, etc. Let's make things that move!

The nature of the project is such that it allows explorations with relatively low-cost, easy to boot and acquire hardware. Namely Atmel AVR chips, ARM chips, or some variant (typ. < $10 / IC). Developing circuits and writing code for these hardwares is low-tech, and easy to get into - but the insights and explorations are potentially of relatively high value.

### Key Ideas

 - configure-free interoperability
  - bit-level ack & throttling
  - no clock, no bit-rate
  - grows 'at the edges'
  - 8MHz cpu can chat with 2GHz cpu

 - packet automata
  - no routing tables: data carries its own map
  - route discovery w/ flood-all-ports

 - local / global state-sharing
  - i.e tight loops for subsystems, longer loops for global orientation & planning
  - fluidity across timescales
  - fluidity across computing scales

## Implementation

 - low-level hardware bit-banging
  - towards FPGA / PSoc to crank bitrate

## Feats of Strength

 - Radical Interoperability (i.e. 8-bit $2 AVR chip shares network with Linux machine share network with FPGA)
 - Routing cost functions w/r/t total speed (# of edges x avg. BR at edge)
 - Path Discovery and Adaptability

## Reading / Resources

 - [Ring Test](https://pub.pages.cba.mit.edu/ring/)
  - where Ring MHz is proportional to MB/s upper limit per processor
 - PDF's in /litreview are interesting