/*
 * tinyport.h
 *
 * Created: 11/23/2017 3:26:50 PM
 *  Author: Jake
 */ 


#ifndef TINYPORT_H_
#define TINYPORT_H_

#define PERIPHERAL_A 0x01
#define PERIPHERAL_B 0x02
#define PERIPHERAL_C 0x03
#define PERIPHERAL_D 0x04

#define UART_BAUD_DIVIDER 32

#include "ASF/sam/utils/cmsis/sams70/include/sams70n20.h"

typedef struct{
	Uart *uart;
	Pio *port;
	
	uint32_t peripheral_abcd;
		
	uint32_t pinRX_bm;
	uint32_t pinTX_bm;
}tinyport_t;

tinyport_t tinyport_new(Uart *uart, Pio *port, uint32_t peripheral_abcd, uint32_t pinRX_bitmask, uint32_t pinTX_bitmask);

void tp_init(tinyport_t *tp);

void tp_putchar(tinyport_t *tp, uint8_t data);

#endif /* TINYPORT_H_ */

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