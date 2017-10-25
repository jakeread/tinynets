#ifndef RINGBUFFER_H
#define RINGBUFFER_H

/*
a ringbuffer,
s/o https://github.com/dhess/c-ringbuf
*/

#include <avr/io.h>


struct ringbuffer_t {
	uint8_t *buf;
	uint8_t head;
	uint8_t tail;
	uint32_t size;
};

typedef struct ringbuffer_t *ringbuffer_t;  // ALERT: ptr to struct?

// makes new ringbuffer
ringbuffer_t rb_new(uint32_t capacity);

// sets tail to head
void rb_reset(ringbuffer_t rb);

// writes one byte to next slot
// TODO: 2nd fn for writing chunks to buffer, i-e complete packets
void rb_write(ringbuffer_t rb, uint8_t data);

// reads one byte from buffer
uint8_t rb_read(ringbuffer_t rb);

uint8_t rb_hasdata(ringbuffer_t rb);

#endif