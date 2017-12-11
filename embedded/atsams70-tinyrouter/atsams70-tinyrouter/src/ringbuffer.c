/*
 * ringbuffer.c
 *
 * Created: 12/5/2017 4:25:24 PM
 *  Author: Jake
 */ 

#include "ringbuffer.h"

uint8_t rb_init(ringbuffer_t *rb, size_t size){
	rb->size = size;
	rb->buffer = malloc(rb->size);
	rb_reset(rb);
	return 1;
}

uint8_t rb_reset(ringbuffer_t *rb){
	if(rb){
		rb->head = 0;
		rb->tail = 0;
		return 1;
		} else {
		return 0;
	}
}

uint8_t rb_putdata(ringbuffer_t *rb, uint8_t *data, uint8_t size){
	uint8_t i = 0;
	while(!rb_full(rb) && i < size){
		rb_putchar(rb, data[i]);
		i ++;
	}
}

uint8_t rb_putchar(ringbuffer_t *rb, uint8_t data){
	rb->buffer[rb->head] = data;
	rb->head = (rb->head + 1) % rb->size; // for wrap around
}

uint8_t rb_get(ringbuffer_t *rb){
	uint8_t data = rb->buffer[rb->tail];
	rb->tail = (rb->tail + 1) % rb->size;
	return data;
}

uint8_t rb_empty(ringbuffer_t *rb){
	return (rb->head == rb->tail);
}

uint8_t rb_full(ringbuffer_t *rb){
	return ((rb->head + 1) % rb->size) == rb->tail;
}

size_t rb_free_space(ringbuffer_t *rb){
	if(rb->head >= rb->tail){
		return rb->size - (rb->head - rb->tail);
	} else {
		return rb->tail - rb->head - 1;
	}
}