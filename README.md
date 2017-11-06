# tinynets

# Protocol Rules

## Addressing 
    - 10-bit address (1024 Unique in System)
    - Addresses are assigned in software (Ethernet: Hardware Addresses)
    - Can be location-based (e.g. first five MSBs correspond to x, last five correspond to y)

## Packet Structure

Type | 8 Bits | 10 Bits | 6 Bits | 10 Bits | 6 Bits | N Bytes | CRC 
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- 
Standard: | 255 | Dest. | # Edges | Src. | # Bytes | Payload … | CRC |
ACK: | 254 | Dest. | # Edges | Src. | x | x| CRC
Buffer Depth: | [0 - 253] | x | x | x | x | x | x |

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
Port | Destination | Hopcount | Current port buffer size
This is different from standard Ethernet routing tables because it includes the current port buffer size as part of the table entry, allowing for a more robust cost function for use in the path planning algorithm.

## Buffer Depth Updates
Send buffer depth on all ports every q seconds, and every time a packet leaves or arrives

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