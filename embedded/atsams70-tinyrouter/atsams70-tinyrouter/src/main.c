/**
 * \file
 *
 * \brief Empty user application template
 *
 */

/**
 * \mainpage User Application template doxygen documentation
 *
 * \par Empty user application template
 *
 * Bare minimum empty user application template
 *
 * \par Content
 *
 * -# Include the ASF header files (through asf.h)
 * -# "Insert system clock initialization code here" comment
 * -# Minimal main function that starts with a call to board_init()
 * -# "Insert application code here" comment
 *
 */

/*
 * Include header files for all drivers that have been imported from
 * Atmel Software Framework (ASF).
 */
/*
 * Support and FAQ: visit <a href="http://www.atmel.com/design-support/">Atmel Support</a>
 */
#include <asf.h>
#include "pin.h"

pin_t stlb;
pin_t stlr;
pin_t button;

pin_t p3lr;

int main (void)
{
	/* Insert system clock initialization code here (sysclk_init()). */

	board_init();
	sysclk_init();
	
	PMC->PMC_PCER0 = 1 << ID_PIOA;
	PMC->PMC_PCER0 = 1 << ID_PIOD;
	
	p3lr = pin_new(PIOD, PIO_PER_P10);
	pin_output(p3lr);
	
	stlb = pin_new(PIOA, PIO_PER_P1);
	pin_output(stlb);
	
	stlr = pin_new(PIOD, PIO_PER_P11);
	pin_output(stlr);
	
	button = pin_new(PIOA, PIO_PER_P15);
	pin_input(button);
	
	PMC->PMC_PCER1 = 1 << 14; // UART4 go clock go
	
	PIOD->PIO_PDR = PIO_PER_P18;
	PIOD->PIO_PDR = PIO_PER_P19;
	
	PIOD->PIO_ABCDSR[0] = ~PIO_PER_P18;
	PIOD->PIO_ABCDSR[0] = ~PIO_PER_P19;
	PIOD->PIO_ABCDSR[1] = PIO_PER_P18;
	PIOD->PIO_ABCDSR[1] = PIO_PER_P19;
  	
	UART4->UART_MR = UART_MR_BRSRCCK_PERIPH_CLK | UART_MR_CHMODE_NORMAL;
	UART4->UART_BRGR = 32; // clock / this value * 16
	UART4->UART_CR = UART_CR_TXEN | UART_CR_RXEN;
	
	while(1){
		if(pin_get_state(button)){ // hi, button is not pressed
			pin_clear(stlb);
			pin_set(stlr);
			while(!(UART4->UART_SR & UART_SR_TXRDY)){ // wait for ready
				pin_clear(p3lr);
			}
			pin_set(p3lr);
			UART4->UART_THR = 85;
		} else {
			pin_set(stlb);
			pin_clear(stlr);
			pin_set(p3lr);
		}
	}
}
