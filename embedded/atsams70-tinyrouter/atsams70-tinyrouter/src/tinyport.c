/*
 * tinyport.c
 *
 * Created: 11/23/2017 3:31:56 PM
 *  Author: Jake
 */ 

#include "tinyport.h"

tinyport_t tinyport_new(Uart *uart, Pio *port, uint32_t peripheral_abcd, uint32_t pinRX_bitmask, uint32_t pinTX_bitmask){
	tinyport_t tp;
	
	tp.uart = uart;
	tp.port = port;
	
	tp.peripheral_abcd = peripheral_abcd;
	
	tp.pinRX_bm = pinRX_bitmask; 
	tp.pinTX_bm = pinTX_bitmask;
	
	tp.haschar = 0;
	
	tp.tempchar = 'A';
	
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
}

void tp_putchar(tinyport_t *tp, uint8_t data){
	while(!(tp->uart->UART_SR & UART_SR_TXRDY)); // but wait
	tp->uart->UART_THR = data;
}

void tp_rxhandler(tinyport_t *tp){
	tp->tempchar = tp->uart->UART_RHR;
	tp->haschar = 1;
}

void tp_txhandler(tinyport_t *tp){
	tp->uart->UART_THR = tp->tempchar;
}