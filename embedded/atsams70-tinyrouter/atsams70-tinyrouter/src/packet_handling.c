#include "packet.h"
#include "node.h"

int parse_type(packet_t* p) {
  return p->raw[0];
}

void update_LUT(node_t* n, uint16_t src, uint8_t hopCount, uint8_t port) {
  n->LUT[src][port] = n->LUT[src][port] > hopCount ? hopCount : n->LUT[src][port];
}

void send_packet(packet_t* p, uint8_t port) {

}

void broadcast_packet(packet_t* p, uint8_t exclude) {
  if (exclude != 0) send_packet(p, 0);
  if (exclude != 1) send_packet(p, 1);
  if (exclude != 2) send_packet(p, 2);
  if (exclude != 3) send_packet(p, 3);
}

packet_t turn_to_standard_flood(node_t n, packet_t* p) {
  packet_t newPacket = {.raw = p->raw, .destination = p->destination, .source = n->myAddress,
                        .hopcount = p->hopcount, .size = p->size, .counter = p->counter};
  return newPacket;
}

void handle_packet(node_t* n, packet_t* p, uint8_t port) {
  if (parse_type(p) != BUFFER_UPDATE) {
    update_LUT(n, p->source, p->hopcount, port);
  }
  switch parse_type(p) {
    case STANDARD:
      if (p->destination == n.myAddress) {
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
          broadcast_packet(turn_to_standard_flood(n, p));
        }
      }
      break;
    case ACK:
      if (p->destination == n.myAddress) {
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
          broadcast_packet(turn_to_standard_flood(n, p));
        }
      }
      break;
    case STANDARD_FLOOD:
      n->LUT[p->destination][port] = 255;
      if (p->destination == n.myAddress) {
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
          broadcast_packet(turn_to_standard_flood(n, p), port);
        }
      }
      break;
    case ACK_FLOOD:
    n->LUT[p->destination][port] = 255;
    if (p->destination == n.myAddress) {
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
        broadcast_packet(turn_to_standard_flood(n, p), port);
      }
    }
      break;
    case BUFFER_UPDATE:
      n->portBufferSizes[port] = p->raw[0];
      break;
    default:
      // not possible
  }
}
