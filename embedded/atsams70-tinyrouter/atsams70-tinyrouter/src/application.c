/*
 * application.c
 *
 * Created: 12/8/2017 5:48:52 PM
 *  Author: Jake
 */ 

#include "application.h"
#include "ports.h"

void app_onpacket(packet_t p){
	switch (p.raw[5]){ // key:
		case 1:
			if (p.raw[6] == 1){
				pin_clear(&stlr);
			} else {
				pin_set(&stlr);
			}
			break;
		case 2:
			if(p.raw[6] == 1){
				pin_clear(&stlb);
			} else {
				pin_set(&stlb);
			}
			break;
		default:
			pin_set(&stlb);
			pin_set(&stlr);
			break;
	}
}

void app_onack(packet_t p){
	// windows?
}