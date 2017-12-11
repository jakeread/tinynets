/*
 * application.h
 *
 * Created: 12/8/2017 5:45:27 PM
 *  Author: Jake
 */ 


#ifndef APPLICATION_H_
#define APPLICATION_H_

#include "packet.h"
#include "ports.h"
#include "node.h"

void app_onpacket(packet_t p);

void app_onack(packet_t p);

#endif /* APPLICATION_H_ */