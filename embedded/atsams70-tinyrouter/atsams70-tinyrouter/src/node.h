#ifndef NODE_H_
#define NODE_H_

#define MAX_HOPCOUNT 6
#define MYADDRESS 1
#define IS_HOME_PORT 1

#define SEEN_FLOOD_SIZE 16

typedef struct {
	uint8_t dest;
	uint8_t src;
	uint8_t checksum;
} seen_flood_t;

uint8_t LUT[1024][4];
uint8_t myAddress;
uint8_t window;
seen_flood_t seen_floods[SEEN_FLOOD_SIZE];
uint8_t seen_floods_head;

#endif