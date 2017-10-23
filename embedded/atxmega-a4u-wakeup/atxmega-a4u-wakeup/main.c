/*
 * atxmega-a4u-wakeup.c
 *
 * Created: 10/19/2017 11:24:49 PM
 * Author : Jake
 */ 


#define NP1STAT 4 // on port C
#define NP1STAT_bm (1 << NP1STAT)
#define NP2STAT 5 // on port C
#define NP2STAT_bm (1 << NP2STAT)
#define NP3STAT 4 // on port D
#define NP3STAT_bm (1 << NP3STAT)
#define NP4STAT 5 // on port D
#define NP4STAT_bm (1 << NP4STAT)

#define BUTTON1 0 // on port D
#define BUTTON1_bm (1 << BUTTON1)
#define BUTTON2 1 // on port D
#define BUTTON2_bm (1 << BUTTON2)

#define BLINK_DELAY_MS 500
#define F_CPU 20000000UL // so that the system knows how many clock ticks are in one second, so that delay functions are accurate

#define NEWLINE 0x0A

#include <avr/io.h>
#include <avr/interrupt.h> // NEED this for Interrupts - only to use sei() to enable global interrupt flag
#include <util/delay.h>

#include "ringbuffer.h"
#include "tinyport.h"

tinyport_t tp2;

int main(void){
	// Neil: overclocking (rad)
	OSC.PLLCTRL = OSC_PLLFAC4_bm | OSC_PLLFAC3_bm; // 2 MHz * 24 = 48 MHz
	OSC.CTRL = OSC_PLLEN_bm; // enable PLL
	while (!(OSC.STATUS & OSC_PLLRDY_bm)); // wait for PLL to be ready
	CCP = CCP_IOREG_gc; // enable protected register change
	CLK.CTRL = CLK_SCLKSEL_PLL_gc; // switch to PLL
	
	gpioSetupLED();
	hello();
	
	// uart, port, rx, tx, stat
	tp2 = tp_new(&USARTC1, &PORTC, PIN6_bm, PIN7_bm, PIN5_bm); 
	tp_init(tp2);
		
	// system interrupt setup (allow low level interrupts)
	PMIC.CTRL |= PMIC_LOLVLEN_bm | PMIC_MEDLVLEN_bm | PMIC_HILVLEN_bm;
	
	// globally enable interrupts 
	sei();
	
	tp_test(tp2);
	
	while(1){
		toggleFour();
		_delay_ms(250);
	}
}

// hookup ISRs to port-abstracted interrupt functions
ISR(USARTC1_RXC_vect){
	portRxISR(tp2);
}

ISR(USARTC1_DRE_vect){
	portTxISR(tp2);
}

void gpioSetupLED(){
	PORTC.DIRSET = NP1STAT_bm | NP2STAT_bm;
	PORTD.DIRSET = NP4STAT_bm | NP3STAT_bm;
}

void toggleFour(){
	PORTD.OUTTGL = NP4STAT_bm;
}

void toggleThree(){
	PORTD.OUTTGL = NP3STAT_bm;
}

void hello(){
	toggleFour();
	_delay_ms(250);
	toggleFour();
	_delay_ms(250);
	toggleFour();
}