/*
 * ports.h
 *
 * Created: 12/8/2017 11:30:49 AM
 *  Author: Jake
 */ 


#ifndef PORTS_H_
#define PORTS_H_


#include "tinyport.h"
#include "ringbuffer.h"
#include "pin.h"

pin_t stlb;
pin_t stlr;
pin_t button;

tinyport_t tp1;
ringbuffer_t p1rbrx;
ringbuffer_t p1rbtx;
pin_t p1lr;
pin_t p1lg;
pin_t p1lb;

tinyport_t tp2;
ringbuffer_t p2rbrx;
ringbuffer_t p2rbtx;
pin_t p2lr;
pin_t p2lg;
pin_t p2lb;

tinyport_t tp3;
ringbuffer_t p3rbrx;
ringbuffer_t p3rbtx;
pin_t p3lr;
pin_t p3lg;
pin_t p3lb;

tinyport_t tp4;
ringbuffer_t p4rbrx;
ringbuffer_t p4rbtx;
pin_t p4lr;
pin_t p4lg;
pin_t p4lb;

tinyport_t* ports[4];

#endif /* PORTS_H_ */