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
  return (LUT[dest][0] != MAX_HOPCOUNT && LUT[dest][1] != MAX_HOPCOUNT &&
         LUT[dest][2] != MAX_HOPCOUNT && LUT[dest][3] != MAX_HOPCOUNT);
}

void handle_packet(packet_t* p, uint8_t port) {
	
  if (p->hopcount > MAX_HOPCOUNT && p->destination != myAddress) {
    free((void*)p);
    return;
  } else {
	  p->hopcount ++;
  }
  
  update_LUT(p->source, p->hopcount, port);
  
  switch (parse_type(p)) {
    case P_STANDARD:
      if (p->destination == myAddress) {
		  app_onpacket(*p);
		  acknowledge(p);
      } else {
        if (in_table(p->destination)) {
          int bestPort = 0;
          int bestHopCount = LUT[p->destination][0];
          for (int i = 0; i < 4; i++) {
            if (LUT[p->destination][i] < bestHopCount) {
              bestPort = i;
              bestHopCount = LUT[p->destination][i];
            }
          }
          send_packet(p, bestPort);
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
          int bestPort = 0;
          int bestHopCount = LUT[p->destination][0];
          for (int i = 0; i < 4; i++) {
            if (LUT[p->destination][i] < bestHopCount) {
              bestPort = i;
              bestHopCount = LUT[p->destination][i];
            }
          }
          send_packet(p, bestPort);
        } else {
          p->raw[0] = P_ACK_FLOOD;
          broadcast_packet(p, port);
        }
      }
      break;
    case P_STANDARD_FLOOD:
      if (p->destination == myAddress) {
        app_onpacket(*p);
		acknowledge(p);
      } else {
		LUT[p->destination][port] = MAX_HOPCOUNT;
        if (LUT[p->destination]) {
          int bestPort = 0;
          int bestHopCount = LUT[p->destination][0];
          for (int i = 0; i < 4; i++) {
            if (LUT[p->destination][i] < bestHopCount) {
              bestPort = i;
              bestHopCount = LUT[p->destination][i];
            }
          }
          send_packet(p, bestPort);
        } else {
          broadcast_packet(p, port);
        }
      }
      break;
    case P_ACK_FLOOD:
    if (p->destination == myAddress) {
      app_onack(*p);
    } else {
	  LUT[p->destination][port] = MAX_HOPCOUNT; 
      if (LUT[p->destination]) {
        int bestPort = 0;
        int bestHopCount = LUT[p->destination][0];
        for (int i = 0; i < 4; i++) {
          if (LUT[p->destination][i] < bestHopCount) {
            bestPort = i;
            bestHopCount = LUT[p->destination][i];
          }
        }
        send_packet(p, bestPort);
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

void acknowledge(packet_t* p){
	packet_t ackpack = packet_new();
	
	ackpack.type = P_ACK;
	ackpack.destination = p->source;
	ackpack.source = p->destination;
	ackpack.hopcount = 0;
	ackpack.size = 5;
	
	packet_buildraw(&ackpack);
	
	if (in_table(ackpack.destination)) {
		int bestPort = 0;
		int bestHopCount = LUT[ackpack.destination][0];
		for (int i = 0; i < 4; i++) {
			if (LUT[ackpack.destination][i] < bestHopCount) {
				bestPort = i;
				bestHopCount = LUT[ackpack.destination][i];
			}
		}
		send_packet(&ackpack, bestPort);
		} else {
		p->raw[0] = P_STANDARD_FLOOD;
		broadcast_packet(p, 4);
	}
	
	//handle_packet(&ackpack, 4); // port is self
}
