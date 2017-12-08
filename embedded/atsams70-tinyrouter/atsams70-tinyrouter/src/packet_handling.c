#include "packet.h"
#include "node.h"
#include "packet_handling.h"
#include <string.h>
#include <stdlib.h>

#define MAX_HOPCOUNT 6

int parse_type(packet_t* p) {
  return p->raw[0];
}

void update_LUT(node_t* n, uint16_t src, uint8_t hopCount, uint8_t port) {
  n->LUT[src][port] = n->LUT[src][port] > hopCount ? hopCount : n->LUT[src][port];
}

void send_packet(packet_t* p, uint8_t port) {
 // TODO:
}

void broadcast_packet(packet_t* p, uint8_t exclude) {
  if (exclude != 0) send_packet(p, 0);
  if (exclude != 1) send_packet(p, 1);
  if (exclude != 2) send_packet(p, 2);
  if (exclude != 3) send_packet(p, 3);
}

int in_table(node_t* n, uint8_t dest) {
  return !(n->LUT[dest][0] != MAX_HOPCOUNT && n->LUT[dest][1] != MAX_HOPCOUNT &&
         n->LUT[dest][2] != MAX_HOPCOUNT && n->LUT[dest][3] != MAX_HOPCOUNT);
}

void handle_packet(node_t* n, packet_t* p, uint8_t port) {
  if (p->hopcount > MAX_HOPCOUNT) {
    //free((void*)p);
    return;
  }

  if (parse_type(p) != BUFFER_UPDATE) {
    update_LUT(n, p->source, p->hopcount, port);
  }

  switch (parse_type(p)) {
    case STANDARD:
      if (p->destination == n->myAddress) {
        //process
        //reply
      } else {
        p->hopcount++;
        if (in_table(n, p->destination)) {
          int bestPort = 0;
          int bestHopCount = n->LUT[p->destination][0];
          for (int i = 0; i < 4; i++) {
            if (n->LUT[p->destination][i] < bestHopCount) {
              bestPort = i;
              bestHopCount = n->LUT[p->destination][i];
            }
          }
          send_packet(p, bestPort);
        } else {
          p->raw[0] = STANDARD_FLOOD;
          broadcast_packet(p, 4);
        }
      }
      break;
    case ACK:
      if (p->destination == n->myAddress) {
        //process
      } else {
        p->hopcount++;
        if (in_table(n, p->destination)) {
          int bestPort = 0;
          int bestHopCount = n->LUT[p->destination][0];
          for (int i = 0; i < 4; i++) {
            if (n->LUT[p->destination][i] < bestHopCount) {
              bestPort = i;
              bestHopCount = n->LUT[p->destination][i];
            }
          }
          send_packet(p, bestPort);
        } else {
          p->raw[0] = STANDARD_FLOOD;
          broadcast_packet(p, 4);
        }
      }
      break;
    case STANDARD_FLOOD:
      n->LUT[p->destination][port] = MAX_HOPCOUNT;
      if (p->destination == n->myAddress) {
        //process
        //reply
      } else {
        p->hopcount++;
        if (n->LUT[p->destination]) {
          int bestPort = 0;
          int bestHopCount = n->LUT[p->destination][0];
          for (int i = 0; i < 4; i++) {
            if (n->LUT[p->destination][i] < bestHopCount) {
              bestPort = i;
              bestHopCount = n->LUT[p->destination][i];
            }
          }
          send_packet(p, bestPort);
        } else {
          p->raw[0] = STANDARD_FLOOD;
          broadcast_packet(p, port);
        }
      }
      break;
    case ACK_FLOOD:
    n->LUT[p->destination][port] = MAX_HOPCOUNT;
    if (p->destination == n->myAddress) {
      //process
    } else {
      p->hopcount++;
      if (n->LUT[p->destination]) {
        int bestPort = 0;
        int bestHopCount = n->LUT[p->destination][0];
        for (int i = 0; i < 4; i++) {
          if (n->LUT[p->destination][i] < bestHopCount) {
            bestPort = i;
            bestHopCount = n->LUT[p->destination][i];
          }
        }
        send_packet(p, bestPort);
      } else {
        p->raw[0] = STANDARD_FLOOD;
        broadcast_packet(p, port);
      }
    }
      break;
    case BUFFER_UPDATE:
      n->portBufferSizes[port] = p->raw[0];
      break;
  }
}
