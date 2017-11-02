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
	tp->pstate = TP_PSTATE_OUTSIDE;
	
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
	tp_statflash(tp);
	
	uint8_t data = tp->uart->DATA;
	
	switch(tp->pstate){
		
		case TP_PSTATE_OUTSIDE:
			if(data == 126){ // ~
				tp->pstate = TP_PSTATE_INSIDE;
			} else {
				// nothing for now, in future catch port-buffer-lengths list
			}
			break;
			
		case TP_PSTATE_INSIDE:
			if(data == 126){ // ~
				tp->pstate = TP_PSTATE_OUTSIDE;
				handoff(tp);
			} else {
				rb_write(tp->rbrx, tp->uart->DATA);
			}
			// check for finish
			break;
			
		default:
			// heck 
			break;
	}
	tp_setRxStatus(tp, TP_RX_STATE_HASDATA); // get it
	//handoff(tp);
}

uint8_t tp_read(tinyport_t tp, uint8_t *data){ // TODO: set at pointer, return true if non empty
	
	*data = 81; // rb_read(tp->rbrx);
	return 0;
	/*
	if(rb_hasdata(tp->rbrx)){
		return 1;
	} else {
		tp_setRxStatus(tp, TP_RX_STATE_EMPTY);
		return 0;
	}
	*/
}

void tp_setRxStatus(tinyport_t tp, uint8_t state){
	if(state == tp->rxstate){
		// nothing
		// nothing changes? always listening
	} else {
		tp->rxstate = state;
	}
}

// https://lost-contact.mit.edu/afs/sur5r.net/service/drivers+doc/Atmel/ATXMEGA/AVR1307/code/doxygen/usart__driver_8c.html#7fdb922f6b858bef8515e23229efd970

void tp_txISR(tinyport_t tp){
	tp_statflash(tp);
	tp->uart->DATA = rb_read(tp->rbtx);
	if(!(rb_hasdata(tp->rbtx))){  // if no data left to tx,
		tp_setTxStatus(tp, TP_TX_STATE_EMPTY);
	}
}

void tp_write(tinyport_t tp, uint8_t data){
	rb_write(tp->rbtx, data);
	tp_setTxStatus(tp, TP_TX_STATE_TRANSMIT); // available
}

void tp_setTxStatus(tinyport_t tp, uint8_t state){
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