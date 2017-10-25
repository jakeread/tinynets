/*
 * atxmega-a4u-wakeup.c
 *
 * Created: 10/19/2017 11:24:49 PM
 * Author : Jake
 */ 

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
tinyport_t tp3;

int main(void){
	// Neil: overclocking (rad)
	OSC.PLLCTRL = OSC_PLLFAC4_bm | OSC_PLLFAC3_bm; // 2 MHz * 24 = 48 MHz
	OSC.CTRL = OSC_PLLEN_bm; // enable PLL
	while (!(OSC.STATUS & OSC_PLLRDY_bm)); // wait for PLL to be ready
	CCP = CCP_IOREG_gc; // enable protected register change
	CLK.CTRL = CLK_SCLKSEL_PLL_gc; // switch to PLL
		
	// uart, port, rx, tx, stat
	tp2 = tp_new(&USARTC1, &PORTC, PIN6_bm, PIN7_bm, PIN5_bm); 
	tp_init(tp2);
	
	tp3 = tp_new(&USARTD0, &PORTD, PIN2_bm, PIN3_bm, PIN4_bm);
	tp_init(tp3);
	
	PORTC.DIRSET = PIN4_bm;
		
	// system interrupt setup (allow low level interrupts)
	PMIC.CTRL |= PMIC_LOLVLEN_bm | PMIC_MEDLVLEN_bm | PMIC_HILVLEN_bm;
	
	// globally enable interrupts 
	sei();
			
	while(1){
		nointerrupts();
		// fast pass - TODO: use case: in rx interrupt, not this forever loop
		if(tp2->rxstate){
			uint8_t data = tp_read(tp2);
			tp_write(tp3, data);
		}
		PORTC.OUTTGL = PIN4_bm;
		interrupts();
	}
}

/*
turns off global interrupt control
my understanding is that interrupts still get scheduled, but not executed
when interrupts are turned back on, they fire.
*/
void nointerrupts(){
	PMIC.CTRL |= ~PMIC_LOLVLEN_bm | ~PMIC_MEDLVLEN_bm | ~PMIC_HILVLEN_bm;
}

/*
turns on global interrupt control
*/
void interrupts(){
	PMIC.CTRL |= PMIC_LOLVLEN_bm | PMIC_MEDLVLEN_bm | PMIC_HILVLEN_bm;
}

void fakepacket(tinyport_t tp){
	tp_write(tp, 80);
	tp_write(tp, 65);
	tp_write(tp, 67);
	tp_write(tp, 75);
	tp_write(tp, 69);
	tp_write(tp, 84);
	tp_write(tp, 80);
	tp_write(tp, 65);
	tp_write(tp, 67);
	tp_write(tp, 75);
	tp_write(tp, 69);
	tp_write(tp, 84);
	tp_write(tp, 38);
	tp_write(tp, 0x0A); // write wakes up txdref
}

// hookup ISRs to port-abstracted interrupt functions
ISR(USARTC1_RXC_vect){
	tp_rxISR(tp2);
}

ISR(USARTC1_DRE_vect){
	tp_txISR(tp2);
}

ISR(USARTD0_RXC_vect){
	tp_rxISR(tp3);
}

ISR(USARTD0_DRE_vect){
	tp_txISR(tp3);
}