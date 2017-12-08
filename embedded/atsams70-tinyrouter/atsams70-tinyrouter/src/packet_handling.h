/*
 * packet_handling.h
 *
 * Created: 12/7/2017 2:14:08 PM
 *  Author: Jake
 */


#ifndef PACKET_HANDLING_H_
#define PACKET_HANDLING_H_

#include "node.h"

int parse_type(packet_t* p);

void update_LUT(uint16_t src, uint8_t hopCount, uint8_t port);

void send_packet(packet_t* p, uint8_t port);

void broadcast_packet(packet_t* p, uint8_t exclude);

void handle_packet(packet_t* p, uint8_t port);

int in_table(uint8_t dest);

#endif /* PACKET_HANDLING_H_ */
