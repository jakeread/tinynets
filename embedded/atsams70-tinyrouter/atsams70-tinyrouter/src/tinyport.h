/*
 * tinyport.h
 *
 * Created: 11/23/2017 3:26:50 PM
 *  Author: Jake
 */ 

// port 1
// peripheral c
// uart2
// rx: pd25
// tx: pd26

// port 2
// peripheral a
// uart0
// rx: pa9
// tx: pa10

// port 3
// peripheral c
// uart1
// rx: pa5
// tx: pa4

// port 4
// peripheral c
// uart4
// rx: pd18
// tx: pd19

#ifndef TINYPORT_H_
#define TINYPORT_H_

#define PERIPHERAL_A 0x01
#define PERIPHERAL_B 0x02
#define PERIPHERAL_C 0x03
#define PERIPHERAL_D 0x04

// packet states
#define TP_PACKETSTATE_OUTSIDE 0
#define TP_PACKETSTATE_INSIDE 1

// has packet?
#define TP_NO_PACKET 0
#define TP_HAS_PACKET 1

// packet delimiters
#define TP_DELIMITER_START 255

#define UART_BAUD_DIVIDER 81 // 977: 9600 baud, 81: 115200, 10: 921600
#define RINGBUFFER_SIZE 512 // in bytes, or 4 full length packets, have 384KBytes total in system

#include "asf.h"
#include "pin.h"
#include "ringbuffer.h"
#include "packet.h"

typedef struct{
	// hardware
	Uart *uart;
	Pio *port;
	
	uint32_t peripheral_abcd;
	
	uint32_t pinRX_bm;
	uint32_t pinTX_bm;
	
	// status lights
	pin_t *stlr;
	pin_t *stlg;
	pin_t *stlb;
	
	// top-of-pipe buffers 
	ringbuffer_t *rbrx;
	ringbuffer_t *rbtx;
	
	// char handling
	uint8_t haspacket;
	uint8_t packetstate;
	uint8_t packetcounter;
	packet_t packet;
	uint8_t bufferdepth; // depth of buffer on the other side, updated on heartbeats
	
}tinyport_t;

tinyport_t tinyport_new(Uart *uart, Pio *port, uint32_t peripheral_abcd, uint32_t pinRX_bitmask, uint32_t pinTX_bitmask, ringbuffer_t *rbrx, ringbuffer_t *rbtx, pin_t *stlr, pin_t *stlg, pin_t *stlb);

void tp_init(tinyport_t *tp);

void tp_putchar(tinyport_t *tp, uint8_t data);

void tp_rxhandler(tinyport_t *tp);

void tp_packetparser(tinyport_t *tp);

void tp_txhandler(tinyport_t *tp);

void tp_testlights(tinyport_t *tp);

#endif /* TINYPORT_H_ */