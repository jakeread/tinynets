/*
 * packet.c
 *
 * Created: 12/5/2017 7:31:45 PM
 *  Author: Jake
 */ 

#include "packet.h"

packet_t packet_new(void){
	packet_t packet;
	packet.counter = 0;
	
	return packet;
}

void packet_clean(packet_t *packet){
	packet->counter = 0;
	packet->destination = 0;
	packet->source = 0;
	packet->hopcount = 0;
	packet->size = 255;
}