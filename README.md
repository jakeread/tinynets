# Tiny Nets

Is a protocol for switched-uart networking in embedded systems. A switched-ethernet w/o spanning trees and with minimum hardware overhead. Increased determinism in the face of network congestion, and reduced message delivery times. 

# Protocol Rules

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
