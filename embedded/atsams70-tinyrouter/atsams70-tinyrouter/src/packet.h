/*
 * packet.h
 *
 * Created: 12/5/2017 7:31:53 PM
 *  Author: Jake
 */ 


#ifndef PACKET_H_
#define PACKET_H_

#include "asf.h"

typedef struct{
	uint8_t raw[255];
	uint16_t destination;
	uint16_t source;
	uint8_t hopcount;
	uint8_t size;
	
	uint8_t counter;
}packet_t;

packet_t packet_new(void);

void packet_clean(packet_t *packet);

#endif /* PACKET_H_ */