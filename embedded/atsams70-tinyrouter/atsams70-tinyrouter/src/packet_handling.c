#include "packet.h"
#include "node.h"
#include "ports.h"
#include "tinyport.h"
#include "packet_handling.h"
#include "application.h"
#include <string.h>
#include <stdlib.h>

int parse_type(packet_t* p) {
  return p->raw[0];
}

void update_LUT(uint16_t src, uint8_t hopCount, uint8_t port) {
  LUT[src][port] = LUT[src][port] > hopCount ? hopCount : LUT[src][port];
}

void send_packet(packet_t* p, uint8_t port) {
	tp_putdata(ports[port], p->raw, p->size); 
	//free((void*)p); // need rethink packet passing ?
	// @Dougie: when I use free here I don't get the full packet return?
}

void broadcast_packet(packet_t* p, uint8_t exclude) {
  if (exclude != 0) send_packet(p, 0);
  if (exclude != 1) send_packet(p, 1);
  if (exclude != 2) send_packet(p, 2);
  if (exclude != 3) send_packet(p, 3);
}

int in_table(uint8_t dest) {
  return !(LUT[dest][0] == MAX_HOPCOUNT && LUT[dest][1] == MAX_HOPCOUNT &&
         LUT[dest][2] == MAX_HOPCOUNT && LUT[dest][3] == MAX_HOPCOUNT);
}

void acknowledge_packet(packet_t* p){
	packet_t ackpack = packet_new();
	
	ackpack.type = P_ACK;
	ackpack.destination = p->source;
	ackpack.source = p->destination;
	ackpack.hopcount = 0;
	ackpack.size = 5;
	
	packet_buildraw(&ackpack); // from pointers -> raw bytes
	
	if (in_table(ackpack.destination)) {
		send_on_bestport(&ackpack);
	} else {
		// altho, this should not happen - we have presumably just seen this come in.
		p->raw[0] = P_ACK_FLOOD;
		broadcast_packet(p, 4);
	}
	
	// add: 
	//free(&ackpack);
}

void send_on_bestport(packet_t* p){
	int bestPort = 0;
	int bestHopCount = LUT[p->destination][0];
	for (int i = 0; i < 4; i++) {
		if (LUT[p->destination][i] < bestHopCount) {
			bestPort = i;
			bestHopCount = LUT[p->destination][i];
		}
	}
	send_packet(p, bestPort);
}

void handle_packet(packet_t* p, uint8_t port) {

	if (p->hopcount > MAX_HOPCOUNT && p->destination != myAddress) {
		free((void*)p); // kill it!
		return; // bail!
	} else {
		update_LUT(p->source, p->hopcount, port); // always, and before the hopcount goes up!
		p->hopcount ++; // sloppy double-set: we should be just using raw values everywhere?
		p->raw[2] = p->hopcount; 
	}
	
	switch (parse_type(p)) {
		case P_STANDARD:
			if (p->destination == myAddress) {
				app_onpacket(*p);
				acknowledge_packet(p);
			} else {
				if (in_table(p->destination)) {
				send_on_bestport(p);
				} else {
					p->raw[0] = P_STANDARD_FLOOD;
					broadcast_packet(p, port);
				}
			}
		break;
		
		case P_ACK:
			if (p->destination == myAddress) {
				app_onack(*p);
			} else {
				if (in_table(p->destination)) {
					send_on_bestport(p);
				} else {
					p->raw[0] = P_ACK_FLOOD;
					broadcast_packet(p, port);
				}
			}
		break;
		
		case P_STANDARD_FLOOD:
			LUT[p->destination][port] = MAX_HOPCOUNT; // likely no good path exists on this port
			if (p->destination == myAddress) {
				app_onpacket(*p);
				acknowledge_packet(p);
			} else {
				if(in_table(p->destination)){
					send_on_bestport(p);
				} else {
					broadcast_packet(p, port);
				}
			}
		break;
		
		case P_ACK_FLOOD:
			LUT[p->destination][port] = MAX_HOPCOUNT; // lngpeotp
			if (p->destination == myAddress) {
				app_onack(*p);
			} else {
				if(in_table(p->destination)){
					send_on_bestport(p);
				} else {
					broadcast_packet(p, port);
				}
			}
		break;
		
		default:
			pin_clear(&stlr); // err indicator
		break;
	}
}