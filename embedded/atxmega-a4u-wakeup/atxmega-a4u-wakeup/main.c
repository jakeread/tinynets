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

tinyport_t tp1; //power, at the moment
tinyport_t tp2;
tinyport_t tp3; //nhat used at the moment
tinyport_t tp4;

int main(void){
	// Neil: overclocking (rad)
	OSC.PLLCTRL = OSC_PLLFAC4_bm | OSC_PLLFAC3_bm; // 2 MHz * 24 = 48 MHz
	OSC.CTRL = OSC_PLLEN_bm; // enable PLL
	while (!(OSC.STATUS & OSC_PLLRDY_bm)); // wait for PLL to be ready
	CCP = CCP_IOREG_gc; // enable protected register change
	CLK.CTRL = CLK_SCLKSEL_PLL_gc; // switch to PLL
		
	// uart, port, rx, tx, stat
	
	tp1 = tp_new(&USARTC0, &PORTC, PIN2_bm, PIN3_bm, PIN4_bm);
	tp_init(&tp1);
	
	tp2 = tp_new(&USARTC1, &PORTC, PIN6_bm, PIN7_bm, PIN5_bm); 
	tp_init(&tp2);
	
	tp3 = tp_new(&USARTD0, &PORTD, PIN2_bm, PIN3_bm, PIN4_bm);
	tp_init(&tp3);
	
	tp4 = tp_new(&USARTD1, &PORTD, PIN6_bm, PIN7_bm, PIN5_bm);
	tp_init(&tp4);
	
			
	// system interrupt setup (allow low level interrupts)
	PMIC.CTRL |= PMIC_LOLVLEN_bm | PMIC_MEDLVLEN_bm | PMIC_HILVLEN_bm;
	
	// globally enable interrupts 
	sei();
	
	while(1){
		uint8_t data;
		tp_statflash(&tp1);
		
		if(tp_read(&tp2, &data)){
			tp_statflash(&tp3);
			tp_write(&tp4, data);
		}
		
		// the below only works when bounded by nointerrupts() and interrupts();
	}
}

uint8_t pcount = 0;
uint8_t psize = 12;

// passing 2 -> 4

void handoff(tinyport_t *tp_from){ // puts data in 'core' of system
	//
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

// hookup ISRs to port-abstracted interrupt functions

ISR(USARTC0_RXC_vect){
	tp_rxISR(&tp1);
}


ISR(USARTC1_RXC_vect){
	tp_rxISR(&tp2);
}

ISR(USARTD0_RXC_vect){
	tp_rxISR(&tp3);
}

ISR(USARTD1_RXC_vect){
	tp_rxISR(&tp4);
}


/*
ISR(USARTC1_DRE_vect){
	tp_txISR(&tp2);
}

ISR(USARTC0_DRE_vect){
	tp_txISR(&tp1);
}

ISR(USARTD0_DRE_vect){
	tp_txISR(&tp3);
}

ISR(USARTD1_DRE_vect){
	tp_txISR(&tp4);
}
*/