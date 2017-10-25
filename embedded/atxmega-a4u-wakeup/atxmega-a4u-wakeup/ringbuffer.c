#include "ringbuffer.h"
#include <stdlib.h>
#include <avr/io.h>

ringbuffer_t rb_new (uint32_t capacity){
	ringbuffer_t rb = malloc(sizeof(struct ringbuffer_t));
	if(rb){
		rb->size = capacity + 1; // one byte is used for detecting full condition
		rb->buf = malloc(rb->size);
		if(rb->buf){
			rb_reset(rb); // point head to tail to beginning
			uint8_t tail1 = rb->tail;
			uint8_t head1 = rb->head;
		} else {
			free(rb); // deallocate memory block if fails to allocate b/c full
			return 0;
		}
	}
	return rb;
}

void rb_reset(ringbuffer_t rb){
	rb->head = 0;
	rb->tail = 0;
}


void rb_write(ringbuffer_t rb, uint8_t data){
	// write to head

	rb->buf[rb->head] = data;
	
	rb->head += 1;
	if(rb->head >= rb->size - 1){
		rb->head = 0;
	}
	// increment head and check wrap

}

uint8_t rb_read(ringbuffer_t rb){
	// pull data from tail
	uint8_t data = rb->buf[rb->tail];
	// increment tail and check wrap
	rb->tail += 1;
	if(rb->tail >= rb->size -1){
		rb->tail = 0;
	}
	return data;
}

uint8_t rb_hasdata(ringbuffer_t rb){
	if (rb->tail == rb->head){
		return 0;
	} else {
		return 1;
	}
}