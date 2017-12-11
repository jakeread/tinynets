/*
 * packet.h
 *
 * Created: 12/5/2017 7:31:53 PM
 *  Author: Jake
 */


#ifndef PACKET_H_
#define PACKET_H_

#define P_STANDARD			255
#define P_ACK				254
#define P_STANDARD_FLOOD	253
#define P_ACK_FLOOD			252

#include "asf.h"
#include <stdint.h>

typedef struct{
	uint8_t counter;
	uint8_t raw[255];
	//uint8_t type;
	//uint8_t destination;
	//uint8_t source;
	//uint8_t hopcount;
	//uint8_t size;
}packet_t;

packet_t packet_new(void);

void packet_buildraw(packet_t *packet);

void packet_clean(packet_t *packet);

#endif /* PACKET_H_ */
