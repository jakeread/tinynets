#include "packet.h"
#include "node.h"
#include "ports.h"
#include "tinyport.h"
#include "packet_handling.h"
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
}

void broadcast_packet(packet_t* p, uint8_t exclude) {
  if (exclude != 0) send_packet(p, 0);
  if (exclude != 1) send_packet(p, 1);
  if (exclude != 2) send_packet(p, 2);
  if (exclude != 3) send_packet(p, 3);
}

int in_table( uint8_t dest) {
  return !(LUT[dest][0] != MAX_HOPCOUNT && LUT[dest][1] != MAX_HOPCOUNT &&
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
		  pin_clear(&stlr);
		  // TODO: process? send to application layer?
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
        pin_clear(&stlb);
		// TODO: process, window?
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
          broadcast_packet(p, 4);
        }
      }
      break;
    case P_STANDARD_FLOOD:
      if (p->destination == myAddress) {
        //TODO:
		// process, reply
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
          // Dougie: I removed this: p->raw[0] = P_STANDARD_FLOOD;
          broadcast_packet(p, port);
        }
      }
      break;
    case P_ACK_FLOOD:
    if (p->destination == myAddress) {
      //TODO:
	  // process
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
		// Dougie: I removed this: p->raw[0] = P_STANDARD_FLOOD;
        broadcast_packet(p, port);
      }
    }
      break;
    default:
	  pin_clear(&stlr); // err indicator
	  break;
  }
}
