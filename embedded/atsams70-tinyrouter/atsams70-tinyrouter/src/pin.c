/*
 * pins.c
 *
 * Created: 11/23/2017 1:24:54 PM
 *  Author: Jake
 */ 

#include "pin.h"
#include <asf.h>

pin_t pin_new(Pio *port, uint32_t pin_bitmask){
	pin_t pin;
	
	pin.port = port;
	pin.pin_bm = pin_bitmask;
	
	return pin;
}