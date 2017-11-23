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

void pin_output(pin_t pin){
	pin.port->PIO_PER |= pin.pin_bm;
	pin.port->PIO_OER = pin.pin_bm;
}

void pin_set(pin_t pin){
	pin.port->PIO_SODR = pin.pin_bm;
}

void pin_clear(pin_t pin){
	pin.port->PIO_CODR = pin.pin_bm;
}

void pin_input(pin_t pin){
	pin.port->PIO_PER |= pin.pin_bm;
	pin.port->PIO_ODR = pin.pin_bm;
}

bool pin_get_state(pin_t pin){
	if(pin.port->PIO_PDSR & pin.pin_bm){
		return true;
	} else {
		return false;
	}
}