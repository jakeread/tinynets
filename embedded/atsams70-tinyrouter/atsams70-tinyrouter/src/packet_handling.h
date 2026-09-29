/*
 * packet_handling.h
 *
 * Created: 12/7/2017 2:14:08 PM
 *  Author: Jake
 */


#ifndef PACKET_HANDLING_H_
#define PACKET_HANDLING_H_

#define HEARTBEAT_MODULO 25000 // becomes, roughly, 200ms
#define HEARTBEAT_PERPACKET_MODULO 4

#include "node.h"

int parse_type(packet_t* p);

void update_LUT(uint8_t src, uint8_t hopCount, uint8_t port);

void send_packet(packet_t* p, uint8_t port);

void broadcast_packet(packet_t* p, uint8_t exclude);

void handle_packet(packet_t* p, uint8_t port);

void send_on_bestport(packet_t* p);

void send_heartbeats(void);

void acknowledge_packet(packet_t* p);

int in_table(uint8_t dest);

int has_seen_flood(packet_t* p);
void mark_flood_seen(packet_t* p);

#endif /* PACKET_HANDLING_H_ */
