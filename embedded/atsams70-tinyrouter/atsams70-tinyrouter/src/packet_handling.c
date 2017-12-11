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
	tp_putdata(ports[port], p->raw, p->raw[4]); 
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

packet_t ackpack;

void acknowledge_packet(packet_t* p){	
	ackpack.raw[0] = P_ACK;			// is ack
	ackpack.raw[1] = p->raw[3];		// destination = source
	ackpack.raw[2] = 0;				// hopcount = 0
	ackpack.raw[3] = p->raw[1];		// source = destination (should be us)
	ackpack.raw[4] = 5;				// all acks are 5 bytes
		
	if (in_table(ackpack.raw[1])) {
		send_on_bestport(&ackpack);
	} else {
		// altho, this should not happen - we have presumably just seen this come in.
		p->raw[0] = P_ACK_FLOOD;
		broadcast_packet(p, 4);
	}
}

void send_on_bestport(packet_t* p){
	// empty buffer reads buffersize '1'
	// from there, 8 bytes in buffer is + 1 (x >> 3)
	// so divide by 1 is like ~ packet lambda (where packet is 3 byte payload)
	// divide by 3 for one hopcount = three packets in buffer *shrugman*
	int bestPort = 0;
	int bestLambda = LUT[p->raw[1]][0] + ports[0]->buffersize / 3;
	for (int i = 0; i < 4; i++) {
		if (LUT[p->raw[1]][i] < bestLambda) {
			bestPort = i;
			bestLambda = LUT[p->raw[1]][0] + ports[0]->buffersize / 3;
		}
	}
	send_packet(p, bestPort);
}

void send_heartbeats(void){
	#if IS_HOME_PORT
	for(int i = 1; i < 4; i ++){
		tp_putchar(ports[i], 257 - (rb_free_space(ports[i]->rbtx) >> 3));
	}
	#else
	for(int i = 0; i < 4; i ++){
		tp_putchar(ports[i], 257 - (rb_free_space(ports[i]->rbtx) >> 3));
	}
	#endif
}

void handle_packet(packet_t* p, uint8_t port) {

	if (p->raw[2] > MAX_HOPCOUNT && p->raw[1] != myAddress) {
		return; // bail!
	} else {
		update_LUT(p->raw[3], p->raw[2], port); // always, and before the hopcount goes up!
		p->raw[2] ++; 
	}
	
	switch (parse_type(p)) {
		case P_STANDARD:
			if (p->raw[1] == myAddress) {
				app_onpacket(*p);
				acknowledge_packet(p);
			} else {
				if (in_table(p->raw[1])) {
				send_on_bestport(p);
				} else {
					p->raw[0] = P_STANDARD_FLOOD;
					broadcast_packet(p, port);
				}
			}
		break;
		
		case P_ACK:
			if (p->raw[1] == myAddress) {
				app_onack(*p);
			} else {
				if (in_table(p->raw[1])) {
					send_on_bestport(p);
				} else {
					p->raw[0] = P_ACK_FLOOD;
					broadcast_packet(p, port);
				}
			}
		break;
		
		case P_STANDARD_FLOOD:
			//LUT[p->raw[1]][port] = MAX_HOPCOUNT; // likely no good path exists on this port
			if (p->raw[1] == myAddress) {
				app_onpacket(*p);
				acknowledge_packet(p);
			} else {
				if(in_table(p->raw[1])){
					send_on_bestport(p);
				} else {
					broadcast_packet(p, port);
				}
			}
		break;
		
		case P_ACK_FLOOD:
			//LUT[p->raw[1]][port] = MAX_HOPCOUNT; // lngpeotp
			if (p->raw[1] == myAddress) {
				app_onack(*p);
			} else {
				if(in_table(p->raw[1])){
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