/*
 * tinyport.c
 *
 * Created: 10/23/2017 11:40:37 AM
 *  Author: Jake
 */ 

#include "tinyport.h"
#include <util/delay.h>

tinyport_t tp_new(USART_t *uart, PORT_t *port, uint8_t pinRX_bm, uint8_t pinTX_bm, uint8_t pinSTAT_bm){
	
	tinyport_t tp;
	
	tp.uart = uart;
	tp.port = port;
	
	tp.pinRX_bm = pinRX_bm;
	tp.pinTX_bm = pinTX_bm;
	tp.pinSTAT_bm = pinSTAT_bm;
	
	tp.txstate = TP_TX_STATE_EMPTY;
	tp.rxstate = TP_RX_STATE_EMPTY;
	tp.pstate = TP_PSTATE_OUTSIDE;
	
	rb_init(&tp.rbrx, TP_RXBUF_SIZE);
	rb_init(&tp.rbtx, TP_TXBUF_SIZE);
	
	return tp;
}

// mostly, start the uart port
void tp_init(tinyport_t *tp){
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

void tp_rxISR(tinyport_t *tp){ // towards a passalong
	tp_statflash(tp);
	
	tp->bumpdata = tp->uart->DATA;
	
	switch (tp->pstate){
		case TP_PSTATE_OUTSIDE:
			if(tp->bumpdata == 126){
				tp->pstate = TP_PSTATE_INSIDE;
			}
			break;
		case TP_PSTATE_INSIDE:
			if(tp->bumpdata == 126){
				tp->pstate = TP_PSTATE_OUTSIDE;
			} else {
				rb_put(&tp->rbrx, tp->bumpdata);
			}
			break;
		default:
			break;	
	}
}

uint8_t tp_read(tinyport_t *tp, uint8_t *data){ // TODO: set at pointer, return true if non empty
	if(rb_get(&tp->rbrx, data)){
		return 1;
	} else {
		return 0;
	}
}

// https://lost-contact.mit.edu/afs/sur5r.net/service/drivers+doc/Atmel/ATXMEGA/AVR1307/code/doxygen/usart__driver_8c.html#7fdb922f6b858bef8515e23229efd970

void tp_write(tinyport_t *tp, uint8_t data){
	while(!(tp->uart->STATUS & USART_DREIF_bm)); // while not ready, wait (this is blocking)
	tp->uart->DATA = data;
}

void tp_statflash(tinyport_t *tp){
	tp->port->OUTTGL = tp->pinSTAT_bm;
}

void tp_stathi(tinyport_t *tp){
	tp->port->OUTSET = tp->pinSTAT_bm;
}

void tp_statlo(tinyport_t *tp){
	tp->port->OUTCLR = tp->pinSTAT_bm;
}

void tp_test(tinyport_t *tp){ // barebones write
	tp_stathi(tp);
	while(!(tp->uart->STATUS & USART_DREIF_bm));
	tp->uart->DATA = 0xFF;
	tp->uart->DATA = 0x0A;
	tp_statlo(tp);
}

/*

old code, for handling tx'ing with interrupts - we want more determinism on sends, so do straightforward

void tp_txISR(tinyport_t *tp){
	tp_statflash(tp);
	rb_put(&tp->rbtx, tp->uart->DATA);
	if(rb_empty(tp->rbtx)){  // if no data left to tx,
		tp_setTxStatus(tp, TP_TX_STATE_EMPTY);
	}
}

void tp_write(tinyport_t *tp, uint8_t data){
	rb_put(&tp->rbtx, data);
	tp_setTxStatus(tp, TP_TX_STATE_TRANSMIT); // available
}

void tp_setTxStatus(tinyport_t *tp, uint8_t state){
	if(state == tp->txstate){ // if already set,
		// do nothing
	} else if(state) { // if set to hi - have things to tx
		tp->uart->CTRLA |= USART_DREINTLVL_LO_gc; // now ready for out transmit - this would happen elsewhere - when there is tx to tx
		tp->txstate = state;
	} else { // if lo - buffer is empty, donot tx
		tp->uart->CTRLA = (tp->uart->CTRLA & ~ USART_DREINTLVL_gm) | USART_DREINTLVL_OFF_gc; // turn off interrupt
		tp->txstate = state;
	}
}
*/