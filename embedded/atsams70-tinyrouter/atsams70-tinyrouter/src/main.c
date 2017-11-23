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

int main (void)
{
	/* Insert system clock initialization code here (sysclk_init()). */

	board_init();
	sysclk_init();
	
	PMC->PMC_PCER0 = 1 << ID_PIOA;
	PMC->PMC_PCER0 = 1 << ID_PIOD;
	
	stlb = pin_new(PIOA, PIO_PER_P1);
	pin_output(stlb);
	
	stlr = pin_new(PIOD, PIO_PER_P11);
	pin_output(stlr);
	
	button = pin_new(PIOA, PIO_PER_P15);
	pin_input(button);
	
	while(1){
		if(pin_get_state(button)){
			pin_clear(stlb);
			pin_set(stlr);
		} else {
			pin_set(stlb);
			pin_clear(stlr);
		}
	}
}
