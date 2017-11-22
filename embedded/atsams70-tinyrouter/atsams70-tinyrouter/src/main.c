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


// https://devel.rtems.org/browser/rtems/c/src/lib/libbsp/arm/atsam/libraries/libchip/source/uart.c?rev=e1eeb883d82ce218c2a9c754795cb3c86ac0f36d

int main (void)
{
	/* Insert system clock initialization code here (sysclk_init()). */

	board_init();
	sysclk_init();
	
  /* Insert application code here, after the board has been initialized. */
  // startup the PIOA peripheral clock - only necessary for Inputs and Interrupts
  PMC->PMC_PCER0 = 1 << ID_PIOA;
  
  // Peripheral Enable Register
  // Set PER to 1 at the pin to enable the PIO peripheral,
  // set PDR (peripheral disable register) to 1 to clear that, opening the pin up for other peripherals (uart, etc)
  PIOA->PIO_PER |= PIO_PER_P27 | PIO_PER_P15;
  // Output Enable Register
  PIOA->PIO_OER = PIO_PER_P27;
  // Output Disable Register
  PIOA->PIO_ODR = PIO_PER_P15;
  // B1 pulls PA15 to GND

  while (1) {
	  // Clear Output Data Register (open drain)
	  if(PIOA->PIO_PDSR & PIO_PER_P15){
		  PIOA->PIO_CODR = PIO_PER_P27;
		  } else {
		  PIOA->PIO_CODR = PIO_PER_P27;
	  }
  }	
}
