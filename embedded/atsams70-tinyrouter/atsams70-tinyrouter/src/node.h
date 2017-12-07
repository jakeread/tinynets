typedef struct {
	uint8_t portBufferSizes[4];
	uint16_t LUT[1024][4]; // TODO: fix representation
	uint16_t myAddress;
} node_t;
