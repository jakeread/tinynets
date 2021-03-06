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

int main (void)
{
	/* Insert system clock initialization code here (sysclk_init()). */

	board_init();
	sysclk_init();
	
	PMC->PMC_PCER0 = 1 << ID_PIOA;
	
	PIOA->PIO_PER |= PIO_PER_P28;
	PIOA->PIO_OER = PIO_PER_P28;
	
	while(1){
		PIOA->PIO_CODR = PIO_PER_P28;
		delay_ms(100);
		PIOA->PIO_SODR = PIO_PER_P28;
		delay_ms(100);
	}

	/* Insert application code here, after the board has been initialized. */
}
