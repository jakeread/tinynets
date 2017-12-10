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
	tp->haspacket = TP_NO_PACKET;
	tp->buffersize = 0;
	
	tp->packet = packet_new();
}

void tp_putchar(tinyport_t *tp, uint8_t data){
	while(!(tp->uart->UART_SR & UART_SR_TXRDY)); // but wait
	tp->uart->UART_THR = data;
}

int tp_putdata(tinyport_t *tp, uint8_t *data, uint8_t size){
	rb_putdata(tp->rbtx, data, size);
	tp->uart->UART_IER |= UART_IER_TXRDY;
	return 1;
}

void tp_rxhandler(tinyport_t *tp){
	uint8_t data = tp->uart->UART_RHR;
	rb_putchar(tp->rbrx, data);
	pin_clear(tp->stlb);
}

void tp_packetparser(tinyport_t *tp){
	
	while(!tp->haspacket && !rb_empty(tp->rbrx)){ // while the ringbuffer contains data and we don't have a packet yet

		uint8_t data = rb_get(tp->rbrx); // grab a byte from the ringbuffer
		
		switch(tp->packetstate){
			
			case TP_PACKETSTATE_OUTSIDE:
				// check if start, add 1st byte, change state
				// if not start, assume buffer depth data, update
				if(data == P_STANDARD | data == P_STANDARD_FLOOD | data == P_ACK | data == P_ACK_FLOOD){ 
					tp->packetstate = TP_PACKETSTATE_INSIDE;
					tp->packet.raw[tp->packet.counter] = data;
					tp->packet.counter ++;
					} else {
					tp->buffersize = data;
				}
				break;
				
			case TP_PACKETSTATE_INSIDE: 
				// writing to packet
				// check for size byte
				// check for end of packet w/ counter 
				// (counter is _current_ byte, is incremented at end of handle)
				// when done, fill in fields for easy access in handling
				tp->packet.raw[tp->packet.counter] = data;
				tp->packet.counter ++;
				if(tp->packet.counter == 5){
					tp->packet.size = data; // 5th byte in packet structure is size
				}
				if(tp->packet.counter >= tp->packet.size){ // check counter against packet size to see if @ end of packet
					tp->packet.type = tp->packet.raw[0];
					tp->packet.destination = tp->packet.raw[1];//((uint16_t)tp->packet.raw[1] << 8) | tp->packet.raw[2];
					tp->packet.hopcount = tp->packet.raw[2];
					tp->packet.source = tp->packet.raw[3];//((uint16_t)tp->packet.raw[4] << 8) | tp->packet.raw[5];
					tp->haspacket = TP_HAS_PACKET; // this data is final byte, we have packet, this will be last tick in loop
					tp->packetstate = TP_PACKETSTATE_OUTSIDE; // and we're outside again
					pin_set(tp->stlb);
				}
				break;
				
			default:
				pin_clear(tp->stlr); // error!
				break;
		} // end switch
	} // end while
} // end packetparser

void tp_txhandler(tinyport_t *tp){
	if(!rb_empty(tp->rbtx)){
		tp->uart->UART_THR = rb_get(tp->rbtx);
		pin_clear(tp->stlg);
	} else {
		tp->uart->UART_IDR = UART_IER_TXRDY; // if nothing left to tx, turn isr off
		pin_set(tp->stlg);
	}
	//while(!(tp->uart->UART_SR & UART_SR_TXRDY)); // blocking
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