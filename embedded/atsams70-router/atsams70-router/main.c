/*
 * atsams70-router.c
 *
 * Created: 11/18/2017 1:52:54 AM
 * Author : Jake
 */ 


#include "sam.h"


int main(void)
{
    /* Initialize the SAM system */
    SystemInit();
	
	PMC->PMC_PCER0 = 1 << ID_PIOA;
	
	REG_PIOA_PER |= PIO_PER_P28_Msk;
	REG_PIOA_OER = PIO_PER_P28_Msk;

    /* Replace with your application code */
    while (1) 
    {
		REG_PIOA_CODR = PIO_PER_P28_Msk;
		REG_PIOA_SODR = PIO_PER_P28_Msk;
    }
}
