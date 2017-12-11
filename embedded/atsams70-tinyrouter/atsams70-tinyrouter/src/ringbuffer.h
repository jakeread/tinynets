/*
 * ringbuffer.h
 *
 * Created: 12/5/2017 4:24:36 PM
 *  Author: Jake
 */ 

#ifndef RINGBUFFER_H
#define RINGBUFFER_H

/*
a ringbuffer,
s/o https://github.com/dhess/c-ringbuf
s/o https://embeddedartistry.com/blog/2017/4/6/circular-buffers-in-cc
s/o https://www.downtowndougbrown.com/2013/01/microcontrollers-interrupt-safe-ring-buffers/
*/

#include <stdlib.h>
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#include <asf.h>

typedef struct {
	uint8_t * buffer;
	size_t head;
	size_t tail;
	size_t size;
} ringbuffer_t;

uint8_t rb_init(ringbuffer_t *rb, size_t size);

// sets tail to head
uint8_t rb_reset(ringbuffer_t *rb);

// writes one byte to next slot
uint8_t rb_putchar(ringbuffer_t *rb, uint8_t data);

uint8_t rb_putdata(ringbuffer_t *rb, uint8_t *data, uint8_t size);

// reads one byte from buffer
uint8_t rb_get(ringbuffer_t *rb);

uint8_t rb_empty(ringbuffer_t *rb);

uint8_t rb_full(ringbuffer_t *rb);

size_t rb_free_space(ringbuffer_t *rb);

#endif