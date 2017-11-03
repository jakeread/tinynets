```swift
if packet is standard:
	if LUT does not already have source address:
		add entry to LUT
	if I am destination:
		process data in packet
	else:
		increment hop count
		if LUT has destination address:
			send packet to port which minimizes C(hops, buffer) = hops + \lambda*buffer over all ports
		else:
			send packet to all ports as standard flood
elseif packet is ack:
	if LUT does not already have source address:
		add entry to LUT
	if I am destination:
		process acknowledgement
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
	else:
		if I have seen this packet before:
			return
		increment hop count
		if LUT has destination address:
			send packet to port which minimizes C(hops, buffer) = hops + \lambda*buffer over all ports
		else:
			send packet to all ports
elseif packet is ack flood
	if LUT does not already have source address:
		add entry to LUT
	if I am destination:
		process acknowledgement
	else:
		if I have seen this packet before:
			return
		increment hop count
		if LUT has destination address:
			send packet to port which minimizes C(hops, buffer) = hops + \lambda*buffer over all ports
		else:
			send packet to all ports
else:
	write buffer depth to LUT
```
