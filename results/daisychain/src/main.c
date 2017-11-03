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

uint8_t tpacket1[70];
uint8_t tpacket2[7];

void testpacket1(tinyport_t *tp){
	PORTC.OUTSET = PIN3_bm;
	for(int i = 0; i < 70; i ++){
		tp_write(&tp4, tpacket1[i]);
	}
	PORTC.OUTCLR = PIN3_bm;
}

void testpacket2(tinyport_t *tp){
	PORTC.OUTSET = PIN3_bm;
	for(int i = 0; i < 7; i ++){
		tp_write(&tp4, tpacket2[i]);
	}
	PORTC.OUTCLR = PIN3_bm;
}

int main(void){
	// Neil: overclocking (rad)
	OSC.PLLCTRL = OSC_PLLFAC4_bm | OSC_PLLFAC3_bm; // 2 MHz * 24 = 48 MHz
	OSC.CTRL = OSC_PLLEN_bm; // enable PLL
	while (!(OSC.STATUS & OSC_PLLRDY_bm)); // wait for PLL to be ready
	CCP = CCP_IOREG_gc; // enable protected register change
	CLK.CTRL = CLK_SCLKSEL_PLL_gc; // switch to PLL
		
	// uart, port, rx, tx, stat
	
	tp1 = tp_new(&USARTC0, &PORTC, PIN2_bm, PIN3_bm, PIN4_bm);
	//tp_init(&tp1);
	PORTC.DIRSET = PIN3_bm;
	
	tp2 = tp_new(&USARTC1, &PORTC, PIN6_bm, PIN7_bm, PIN5_bm); 
	tp_init(&tp2);
	
	tp3 = tp_new(&USARTD0, &PORTD, PIN2_bm, PIN3_bm, PIN4_bm);
	tp_init(&tp3);
	
	tp4 = tp_new(&USARTD1, &PORTD, PIN6_bm, PIN7_bm, PIN5_bm);
	tp_init(&tp4);
	
	PORTD.DIRCLR = PIN1_bm;
	PORTD.DIRCLR = PIN0_bm; // button ready
	PORTD.PIN1CTRL = PORT_OPC_PULLUP_gc;
	PORTD.PIN0CTRL = PORT_OPC_PULLUP_gc;
			
	// system interrupt setup (allow low level interrupts)
	PMIC.CTRL |= PMIC_LOLVLEN_bm | PMIC_MEDLVLEN_bm | PMIC_HILVLEN_bm;
	
	// globally enable interrupts 
	sei();
	
	tpacket1[0] = 126; // start delimiter
	tpacket1[1] = 1; // destination address (this and lower)
	tpacket1[2] = 2; // # edges from source
	tpacket1[3] = 4; // source address
	tpacket1[4] = 64; // # of bytes in payload
	tpacket1[69] = 126;
	
	tpacket2[0] = 126; // start delimiter
	tpacket2[6] = 126; // end delimiter
	
	uint8_t data;
	
	while(1){
		tp_statflash(&tp1);
		if(tp2.pstate == TP_PSTATE_HASPACKET){
			tp_stathi(&tp3);
			PORTC.OUTSET = PIN3_bm;
			
			tp_write(&tp4, 126);
			while(tp_read(&tp2, &data)){
				tp_write(&tp4, data);
			}
			tp_write(&tp4, 126);
			
			PORTC.OUTCLR = PIN3_bm;
			tp_statlo(&tp3);
			tp2.pstate = TP_PSTATE_OUTSIDE;
		} else if (!(PORTD.IN & PIN1_bm)){
			tp_stathi(&tp3);
			testpacket1(&tp4);
			tp_statlo(&tp3);
			_delay_ms(500); // basically, debounce button
		} else if (!(PORTD.IN & PIN0_bm)) {
			tp_stathi(&tp3);
			testpacket2(&tp4);
			tp_statlo(&tp3);
			_delay_ms(500);
		}
		
		// the below only works when bounded by nointerrupts() and interrupts();
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