/*
 * packet_handling.h
 *
 * Created: 12/7/2017 2:14:08 PM
 *  Author: Jake
 */ 


#ifndef PACKET_HANDLING_H_
#define PACKET_HANDLING_H_



int parse_type(packet_t* p);

void update_LUT(node_t* n, uint16_t src, uint8_t hopCount, uint8_t port);

void send_packet(packet_t* p, uint8_t port);

void broadcast_packet(packet_t* p, uint8_t exclude);

packet_t* turn_to_standard_flood(node_t* n, packet_t* p);

void handle_packet(node_t* n, packet_t* p, uint8_t port);



#endif /* PACKET_HANDLING_H_ */