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
#define TP_UART_BAUDCONTROLA 155 // 19200: 155, 1M: 2

#define TP_RX_STATE_EMPTY 0
#define TP_RX_STATE_HASDATA 1

#define TP_TX_STATE_EMPTY 0
#define TP_TX_STATE_TRANSMIT 1

#define TP_PSTATE_OUTSIDE 0
#define TP_PSTATE_INSIDE 1

typedef struct tinyport_t {
	USART_t *uart;
	PORT_t *port;
	uint8_t pinRX_bm;
	uint8_t pinTX_bm;
	uint8_t pinSTAT_bm;
	ringbuffer_t rbrx; // is pointer-to
	ringbuffer_t rbtx; // is pointer-to
	uint8_t txstate;
	uint8_t rxstate;
	uint8_t pstate;
};

typedef struct tinyport_t *tinyport_t;

tinyport_t tp_new(USART_t *uart, PORT_t *port, uint8_t pinRX_bm, uint8_t pinTX_bm, uint8_t pinSTAT_bm);

void tp_init(tinyport_t tp);

void tp_statflash(tinyport_t tp);
void tp_statlo(tinyport_t tp);
void tp_stathi(tinyport_t tp);
void tp_test(tinyport_t tp);

void tp_rxISR(tinyport_t tp);
uint8_t tp_read(tinyport_t tp, uint8_t *data);
void tp_setRxStatus(tinyport_t, uint8_t state);

void tp_txISR(tinyport_t tp);
void tp_write(tinyport_t tp, uint8_t data);
void tp_setTxStatus(tinyport_t tp, uint8_t state);

#endif /* TINYPORT_H_ */