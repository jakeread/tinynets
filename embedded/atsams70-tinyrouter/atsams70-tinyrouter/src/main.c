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
#include "tinyport.h"

pin_t stlb;
pin_t stlr;
pin_t button;

pin_t p3lr;

tinyport_t tp1;
tinyport_t tp2;
tinyport_t tp3;
tinyport_t tp4;

int main (void)
{
	/* Insert system clock initialization code here (sysclk_init()). */

	board_init();
	sysclk_init();
	
	PMC->PMC_PCER0 = 1 << ID_PIOA;
	PMC->PMC_PCER0 = 1 << ID_PIOD;
	PMC->PMC_PCER0 = 1 << ID_UART0; // UART0
	PMC->PMC_PCER0 = 1 << ID_UART1; // UART1
	PMC->PMC_PCER1 = 1 << 12; // UART2
	PMC->PMC_PCER1 = 1 << 14; // UART4 go clock go
	
	// tp1, uart2
	//PIOD->PIO_ABCDSR[0] = ~PIO_PER_P25;
	//PIOD->PIO_ABCDSR[0] = ~PIO_PER_P26;
	PIOD->PIO_ABCDSR[1] = PIO_PER_P25;
	PIOD->PIO_ABCDSR[1] = PIO_PER_P26;
	
	//tp2, uart0
	//PIOA->PIO_ABCDSR[0] = ~PIO_PER_P9;
	//PIOA->PIO_ABCDSR[0] = ~PIO_PER_P10;
	//PIOA->PIO_ABCDSR[1] = ~PIO_PER_P9;
	//PIOA->PIO_ABCDSR[1] = ~PIO_PER_P10;
	
	
	//tp3, uart1
	//PIOA->PIO_ABCDSR[0] = ~PIO_PER_P5;
	//PIOA->PIO_ABCDSR[0] = ~PIO_PER_P4;
	PIOA->PIO_ABCDSR[1] |= PIO_PER_P5;
	PIOA->PIO_ABCDSR[1] |= PIO_PER_P4;
	
	
	//tp4, uart4
	//PIOD->PIO_ABCDSR[0] = ~PIO_PER_P18;
	//PIOD->PIO_ABCDSR[0] = ~PIO_PER_P19;
	PIOD->PIO_ABCDSR[1] |= PIO_PER_P18;
	PIOD->PIO_ABCDSR[1] |= PIO_PER_P19;
	
	
	p3lr = pin_new(PIOD, PIO_PER_P10);
	pin_output(&p3lr);
	
	stlb = pin_new(PIOA, PIO_PER_P1);
	pin_output(&stlb);
	
	stlr = pin_new(PIOD, PIO_PER_P11);
	pin_output(&stlr);
	
	button = pin_new(PIOA, PIO_PER_P15);
	pin_input(&button);
	
	tp1 = tinyport_new(UART2, PIOD, PERIPHERAL_C, PIO_PER_P25, PIO_PER_P26);
	tp2 = tinyport_new(UART0, PIOA, PERIPHERAL_A, PIO_PER_P9, PIO_PER_P10);
	tp3 = tinyport_new(UART1, PIOA, PERIPHERAL_C, PIO_PER_P5, PIO_PER_P4);
	tp4 = tinyport_new(UART4, PIOD, PERIPHERAL_C, PIO_PER_P18, PIO_PER_P19);
	
	tp_init(&tp1);
	tp_init(&tp2);
	tp_init(&tp3);
	tp_init(&tp4);
	
	while(1){
		if(pin_get_state(&button)){ // hi, button is not pressed
			pin_clear(&stlb);
			pin_set(&stlr);
			pin_clear(&p3lr);
			tp_putchar(&tp1, 85);
			tp_putchar(&tp2, 85);
			tp_putchar(&tp3, 85);
			tp_putchar(&tp4, 85);
			pin_set(&p3lr);
		} else {
			pin_set(&stlb);
			pin_clear(&stlr);
			pin_set(&p3lr);
		}
	}
}
