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
	packet.raw[4] = 255; // sets size big so no clipping during handling
	
	return packet;
}

void packet_buildraw(packet_t *packet){
	/*
	packet->raw[0] = packet->type;
	packet->raw[1] = packet->destination;
	packet->raw[2] = 0; // hop count
	packet->raw[3] = packet->source;
	packet->raw[4] = packet->size;
	*/
}

void packet_clean(packet_t *packet){
	packet->counter = 0;
	packet->raw[4] = 255;
	//packet->type = 0;
	//packet->destination = 0;
	//packet->source = 0;
	//packet->hopcount = 0;
	//packet->size = 255;
}