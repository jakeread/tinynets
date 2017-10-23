/*
 * tinyport.h
 *
 * Created: 10/23/2017 11:40:51 AM
 *  Author: Jake
 */ 


#ifndef TINYPORT_H_
#define TINYPORT_H_

#include "ringbuffer.h"

#define TP_TXBUF_SIZE 16
#define TP_RXBUF_SIZE 16
#define TP_UART_BAUDCONTROLB 0
#define TP_UART_BAUDCONTROLA 2 // 19200: 155, 1M: 2

typedef struct tinyport_t {
	USART_t *uart;
	PORT_t *port;
	uint8_t pinRX_bm;
	uint8_t pinTX_bm;
	uint8_t pinSTAT_bm;
	ringbuffer_t rbrx; // is pointer-to
	ringbuffer_t rbtx; // is pointer-to
	uint8_t state;
};

typedef struct tinyport_t *tinyport_t;

tinyport_t tp_new(USART_t *uart, PORT_t *port, uint8_t pinRX_bm, uint8_t pinTX_bm, uint8_t pinSTAT_bm);

void tp_init(tinyport_t tp);

void portRxISR(tinyport_t tp);

void portTxISR(tinyport_t tp);

#endif /* TINYPORT_H_ */