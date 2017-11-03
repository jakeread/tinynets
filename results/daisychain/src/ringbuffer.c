#include "ringbuffer.h"
#include <stdlib.h>
#include <avr/io.h>

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


uint8_t rb_put(ringbuffer_t *rb, uint8_t data){
	if(rb){
		rb->buffer[rb->head] = data;
		rb->head = (rb->head + 1) % rb->size; // for wrap around
		if(rb->head == rb->tail){
			rb->tail = (rb->tail + 1) % rb->size;
		}
		return 1;
	} else {
		return 0;
	}
}

uint8_t rb_get(ringbuffer_t *rb, uint8_t *data){
	if(rb && data && !rb_empty(*rb)){
		*data = rb->buffer[rb->tail];
		rb->tail = (rb->tail + 1) % rb->size;
		return 1;
	} else {
		return 0;
	}
}

uint8_t rb_empty(ringbuffer_t rb){
	return (rb.head == rb.tail);
}

uint8_t rb_full(ringbuffer_t rb){
	return ((rb.head + 1) % rb.size) == rb.tail;
}