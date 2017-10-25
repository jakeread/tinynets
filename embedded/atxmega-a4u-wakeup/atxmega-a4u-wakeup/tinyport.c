/*
 * tinyport.c
 *
 * Created: 10/23/2017 11:40:37 AM
 *  Author: Jake
 */ 

#include "tinyport.h"
#include <util/delay.h>

tinyport_t tp_new(USART_t *uart, PORT_t *port, uint8_t pinRX_bm, uint8_t pinTX_bm, uint8_t pinSTAT_bm){
	tinyport_t tp = malloc(sizeof(struct tinyport_t));
	
	tp->uart = uart;
	tp->port = port;
	tp->pinRX_bm = pinRX_bm;
	tp->pinTX_bm = pinTX_bm;
	tp->pinSTAT_bm = pinSTAT_bm;
	tp->rbrx = rb_new(TP_RXBUF_SIZE);
	tp->rbtx = rb_new(TP_TXBUF_SIZE);
	tp->txstate = TP_TX_STATE_EMPTY;
	tp->rxstate = TP_RX_STATE_EMPTY;
	
	return tp;
}

// mostly, start the uart port
void tp_init(tinyport_t tp){
	// USART is in UART (async) mode automatically
	// these registers setup the baudrate - the bitrate
	// this seems a bit tricky. I am taking for granted that the clock is at 48MHz,
	tp->uart->BAUDCTRLA = TP_UART_BAUDCONTROLA;
	tp->uart->BAUDCTRLB = TP_UART_BAUDCONTROLB;
	
	// setup for interrupt
	// receive complete interrupt low level, transmit complete interupt off, transmit buffer empty interupt off
	tp->uart->CTRLA |= USART_RXCINTLVL_LO_gc | USART_TXCINTLVL_OFF_gc | USART_DREINTLVL_OFF_gc;

	// enables tx and rx
	tp->uart->CTRLB = USART_TXEN_bm | USART_RXEN_bm;
	
	// setup mode
	tp->uart->CTRLC = USART_CMODE_ASYNCHRONOUS_gc | USART_PMODE_DISABLED_gc | USART_CHSIZE_8BIT_gc; // 8 bit word, async, no parity bit}
	
	// some GPIO setup, to agree with the UART peripheral
	// tx pin (pin mapping is in the 'Datasheet', registers etc are in the 'Manual') these are default pins
	tp->port->OUTSET = tp->pinTX_bm;
	tp->port->DIRSET = tp->pinTX_bm;
	// rx pin
	tp->port->DIRCLR = tp->pinRX_bm;
	tp->port->OUTCLR = tp->pinRX_bm;
	// stat pin
	tp->port->DIRSET = tp->pinSTAT_bm;
}

void tp_statflash(tinyport_t tp){
	tp->port->OUTTGL = tp->pinSTAT_bm;
}

void tp_stathi(tinyport_t tp){
	tp->port->OUTSET = tp->pinSTAT_bm;
}

void tp_statlo(tinyport_t tp){
	tp->port->OUTCLR = tp->pinSTAT_bm;
}

void tp_test(tinyport_t tp){
	tp_stathi(tp);
	while(!(tp->uart->STATUS & USART_DREIF_bm));
	tp->uart->DATA = 0xFF;
	tp->uart->DATA = 0x0A;
	tp_statlo(tp);
}

void tp_rxISR(tinyport_t tp){ // towards a passalong
	rb_write(tp->rbrx, tp->uart->DATA);
	tp_setRxStatus(tp, TP_RX_STATE_HASDATA); // get it
}

uint8_t tp_read(tinyport_t tp){
	uint8_t data = rb_read(tp->rbrx);
	uint8_t tail = tp->rbrx->tail;
	uint8_t head = tp->rbrx->head;
	if(tail == head){
		tp_setRxStatus(tp, TP_RX_STATE_EMPTY);
		} else {
		tp_setRxStatus(tp, TP_RX_STATE_HASDATA);
	}
	return data;
}

void tp_setRxStatus(tinyport_t tp, uint8_t state){
	tp->rxstate = state;
	if(state){
		// nothing changes? always listening
	} else {
		// ibid
	}
}

// https://lost-contact.mit.edu/afs/sur5r.net/service/drivers+doc/Atmel/ATXMEGA/AVR1307/code/doxygen/usart__driver_8c.html#7fdb922f6b858bef8515e23229efd970

void tp_txISR(tinyport_t tp){
	tp->uart->DATA = rb_read(tp->rbtx);
	uint8_t tail = tp->rbtx->tail;
	uint8_t head = tp->rbtx->head;
	if(tail == head){
		tp_setTxStatus(tp, TP_TX_STATE_EMPTY);
	} else {
		tp_setTxStatus(tp, TP_TX_STATE_HASDATA);
	}
	/*
	// should b working now, test
	if(!(rb_hasdata(tp->rbtx))){ // if buffer empty, turn off DREF interrupt
		tp_setTxStatus(tp, TP_TX_STATE_EMPTY);
	}
	*/
	// handle buffer-ready status, enable interrupt
}

void tp_write(tinyport_t tp, uint8_t data){
	rb_write(tp->rbtx, data);
	tp_setTxStatus(tp, TP_RX_STATE_HASDATA);
}

void tp_setTxStatus(tinyport_t tp, uint8_t state){
	tp->txstate = state;
	if(state){
		tp->uart->CTRLA |= USART_DREINTLVL_LO_gc; // now ready for out transmit - this would happen elsewhere - when there is tx to tx
		tp_stathi(tp);
		} else {
		tp->uart->CTRLA = (tp->uart->CTRLA & ~ USART_DREINTLVL_gm) | USART_DREINTLVL_OFF_gc; // turn off interrupt
		tp_statlo(tp);
	}
}