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
	
	return tp;
}

void tp_init(tinyport_t *tp){
	tp->port->PIO_PDR = tp->pinRX_bm;
	tp->port->PIO_PDR = tp->pinTX_bm;
	
	// do abcdsr - a, b, c, d | 00, 01, 10, 11
	// don't ask why - but set RX pin first 
	/*
	switch(tp->peripheral_abcd){
		case PERIPHERAL_A:
			tp->port->PIO_ABCDSR[0] = ~tp->pinRX_bm;
			tp->port->PIO_ABCDSR[0] = ~tp->pinTX_bm;
			tp->port->PIO_ABCDSR[1] = ~tp->pinRX_bm;
			tp->port->PIO_ABCDSR[1] = ~tp->pinTX_bm;
			break;
		
		case PERIPHERAL_B:
			tp->port->PIO_ABCDSR[0] = tp->pinRX_bm;
			tp->port->PIO_ABCDSR[0] = tp->pinTX_bm;
			tp->port->PIO_ABCDSR[1] = ~tp->pinRX_bm;
			tp->port->PIO_ABCDSR[1] = ~tp->pinTX_bm;
			break;
			
		case PERIPHERAL_C:
			tp->port->PIO_ABCDSR[0] = ~tp->pinRX_bm;
			tp->port->PIO_ABCDSR[0] = ~tp->pinTX_bm;
			tp->port->PIO_ABCDSR[1] = tp->pinRX_bm;
			tp->port->PIO_ABCDSR[1] = tp->pinTX_bm;
			break;
		
		case PERIPHERAL_D:
			tp->port->PIO_ABCDSR[0] = tp->pinRX_bm;
			tp->port->PIO_ABCDSR[0] = tp->pinTX_bm;
			tp->port->PIO_ABCDSR[1] = tp->pinRX_bm;
			tp->port->PIO_ABCDSR[1] = tp->pinTX_bm;
			break;
		
		default:
			break;
	}
	*/
	
	tp->uart->UART_MR = UART_MR_BRSRCCK_PERIPH_CLK | UART_MR_CHMODE_NORMAL;
	tp->uart->UART_BRGR = 32;
	tp->uart->UART_CR = UART_CR_TXEN | UART_CR_RXEN;
}

void tp_putchar(tinyport_t *tp, uint8_t data){
	while(!(tp->uart->UART_SR & UART_SR_TXRDY)); // but wait
	tp->uart->UART_THR = data;
}