#ifndef NODE_H_
#define NODE_H_

#define ADDRESS 0

typedef struct {
	uint8_t* portBufferSizes;
	uint8_t** LUT; // 1024 x 4
	uint16_t myAddress;
} node_t;

#endif