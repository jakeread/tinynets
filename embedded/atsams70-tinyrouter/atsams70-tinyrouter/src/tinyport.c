/*
 * tinyport.c
 *
 * Created: 11/23/2017 3:31:56 PM
 *  Author: Jake
 */ 

#include "tinyport.h"

tinyport_t tinyport_new(Uart *uart, Pio *port, uint32_t peripheral_abcd, uint32_t pinRX_bitmask, uint32_t pinTX_bitmask, ringbuffer_t *rbrx, ringbuffer_t *rbtx, pin_t *stlr, pin_t *stlg, pin_t *stlb){
	tinyport_t tp;
	
	tp.uart = uart;
	tp.port = port;
	
	tp.peripheral_abcd = peripheral_abcd;
	
	tp.pinRX_bm = pinRX_bitmask; 
	tp.pinTX_bm = pinTX_bitmask;
	
	tp.stlr = stlr;
	tp.stlg = stlg;
	tp.stlb = stlb;
	
	tp.rbrx = rbrx;
	tp.rbtx = rbtx;
		
	return tp;
}

void tp_init(tinyport_t *tp){
	tp->port->PIO_PDR = tp->pinRX_bm;
	tp->port->PIO_PDR = tp->pinTX_bm;
	
	// do abcdsr - a, b, c, d | 00, 01, 10, 11
	// this is handled in global setup
	
	tp->uart->UART_MR = UART_MR_BRSRCCK_PERIPH_CLK | UART_MR_CHMODE_NORMAL| UART_MR_PAR_NO | UART_MR_FILTER_DISABLED;
	tp->uart->UART_BRGR = UART_BAUD_DIVIDER; 
	tp->uart->UART_CR = UART_CR_TXEN | UART_CR_RXEN;
	
	tp->uart->UART_IER = UART_IER_RXRDY;
	
	rb_init(tp->rbrx, RINGBUFFER_SIZE);
	rb_init(tp->rbtx, RINGBUFFER_SIZE);
	
	tp->packetstate = TP_PACKETSTATE_OUTSIDE;
	tp->bufferdepth = 255;
	
	tp->packet = packet_new();
}

void tp_putchar(tinyport_t *tp, uint8_t data){
	while(!(tp->uart->UART_SR & UART_SR_TXRDY)); // but wait
	tp->uart->UART_THR = data;
}

void tp_rxhandler(tinyport_t *tp){
	uint8_t data = tp->uart->UART_RHR;
	rb_put(tp->rbrx, data);
}

void tp_packetparser(tinyport_t *tp){
	
	// probably run in a while(!(rb_empty()) and break when completing a packet, so we return max. 1 packet at a time to top level
	// critically, this must run when packets are half-rx'd
	
	while(!rb_empty(tp->rbrx) && !tp->haspacket){
		
		uint8_t data = rb_get(tp->rbrx); // grab a byte from the ringbuffer
		
		switch(tp->packetstate){
			
			case TP_PACKETSTATE_OUTSIDE:
				// check if start, add 1st byte, change state
				// if not start, assume buffer depth data, update
				if(data == TP_DELIMITER_START){
					tp->packetstate = TP_PACKETSTATE_INSIDE;
					tp->packet.raw[tp->packet.counter] = data;
					tp->packet.counter ++;
					} else {
					tp->bufferdepth = data;
				}
				break;
				
			case TP_PACKETSTATE_INSIDE: 
				// writing to packet
				// check for size byte
				// check for end of packet w/ counter (counter is _current_ byte, is incremented at end of handle)
				// ack other side when packet complete ?
				if(tp->packet.counter > tp->packet.size){ // end of packet
					tp->haspacket = TP_HAS_PACKET; // now we have one, this will be last tick in loop
					tp->packetstate = TP_PACKETSTATE_OUTSIDE; // and we're outside again
					break;
				} else if(tp->packet.counter == 6){
					tp->packet.size = data;
				}
				tp->packet.raw[tp->packet.counter] = data;
				tp->packet.counter ++;
				break;
				
			default:
				pin_clear(tp->stlr); // error!
				break;
		} // end switch
	} // end while
} // end packetparser


void tp_txhandler(tinyport_t *tp){
	tp->uart->UART_THR = rb_get(tp->rbtx);
}

void tp_testlights(tinyport_t *tp){
	pin_clear(tp->stlr);
	delay_ms(15);
	pin_clear(tp->stlg);
	delay_ms(15);
	pin_clear(tp->stlb);
	delay_ms(25);
	pin_set(tp->stlr);
	delay_ms(15);
	pin_set(tp->stlg);
	delay_ms(15);
	pin_set(tp->stlb);
	delay_ms(25);
}