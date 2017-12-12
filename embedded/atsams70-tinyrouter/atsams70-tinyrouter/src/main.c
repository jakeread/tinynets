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
#include "testpins.h"
#include "tinyport.h"
#include "packet_handling.h"
#include "ports.h"
#include "node.h"

void setupperipherals(void){

	PMC->PMC_PCER0 = 1 << ID_PIOA; // Pins
	PMC->PMC_PCER0 = 1 << ID_PIOD; // Pins
	PMC->PMC_PCER0 = 1 << ID_UART0; // UART0
	PMC->PMC_PCER0 = 1 << ID_UART1; // UART1
	PMC->PMC_PCER1 = 1 << 12; // UART2
	PMC->PMC_PCER1 = 1 << 14; // UART4 go clock go

	// tp1, uart2 & uart 4
	PIOD->PIO_ABCDSR[0] = ~(PIO_PER_P25 | PIO_PER_P18);
	PIOD->PIO_ABCDSR[0] = ~(PIO_PER_P26 | PIO_PER_P19);
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
	//PIOD->PIO_ABCDSR[0] &= ~PIO_PER_P18;
	//PIOD->PIO_ABCDSR[0] &= ~PIO_PER_P19;
	PIOD->PIO_ABCDSR[1] |= PIO_PER_P18;
	PIOD->PIO_ABCDSR[1] |= PIO_PER_P19;

}

void killwatchdog(void){
	WDT->WDT_MR = WDT_MR_WDDIS; // RIP
}

void setupinterrupts(void){
	NVIC_DisableIRQ(UART2_IRQn);
	NVIC_ClearPendingIRQ(UART2_IRQn);
	NVIC_SetPriority(UART2_IRQn, 8);
	NVIC_EnableIRQ(UART2_IRQn);

	NVIC_DisableIRQ(UART0_IRQn);
	NVIC_ClearPendingIRQ(UART0_IRQn);
	NVIC_SetPriority(UART0_IRQn, 8);
	NVIC_EnableIRQ(UART0_IRQn);

	NVIC_DisableIRQ(UART1_IRQn);
	NVIC_ClearPendingIRQ(UART1_IRQn);
	NVIC_SetPriority(UART1_IRQn, 8);
	NVIC_EnableIRQ(UART1_IRQn);

	NVIC_DisableIRQ(UART4_IRQn);
	NVIC_ClearPendingIRQ(UART4_IRQn);
	NVIC_SetPriority(UART4_IRQn, 8);
	NVIC_EnableIRQ(UART4_IRQn);
}

void setupstatus(void){

	stlb = pin_new(PIOA, PIO_PER_P1);
	pin_output(&stlb);
	stlr = pin_new(PIOD, PIO_PER_P11);
	pin_output(&stlr);
	button = pin_new(PIOA, PIO_PER_P15);
	pin_input(&button);

	p1lr = pin_new(PIOA, PIO_PER_P22);
	pin_output(&p1lr);
	p1lg = pin_new(PIOA, PIO_PER_P8);
	pin_output(&p1lg);
	p1lb = pin_new(PIOA, PIO_PER_P13);
	pin_output(&p1lb);

	p2lr = pin_new(PIOA, PIO_PER_P30);
	pin_output(&p2lr);
	p2lg = pin_new(PIOD, PIO_PER_P9);
	pin_output(&p2lg);
	p2lb = pin_new(PIOA, PIO_PER_P28);
	pin_output(&p2lb);

	p3lr = pin_new(PIOD, PIO_PER_P10);
	pin_output(&p3lr);
	p3lg = pin_new(PIOA, PIO_PER_P0);
	pin_output(&p3lg);
	p3lb = pin_new(PIOD, PIO_PER_P15);
	pin_output(&p3lb);

	p4lr = pin_new(PIOD, PIO_PER_P13);
	pin_output(&p4lr);
	p4lg = pin_new(PIOD, PIO_PER_P14);
	pin_output(&p4lg);
	p4lb = pin_new(PIOA, PIO_PER_P27);
	pin_output(&p4lb);
}

void clearallstatus(void){
	pin_clear(&p1lr);
	pin_clear(&p1lg);
	pin_clear(&p1lb);

	pin_clear(&p2lr);
	pin_clear(&p2lg);
	pin_clear(&p2lb);

	pin_clear(&p3lr);
	pin_clear(&p3lg);
	pin_clear(&p3lb);

	pin_clear(&p4lr);
	pin_clear(&p4lg);
	pin_clear(&p4lb);
}

void setallstatus(void){
	pin_set(&p1lr);
	pin_set(&p1lg);
	pin_set(&p1lb);

	pin_set(&p2lr);
	pin_set(&p2lg);
	pin_set(&p2lb);

	pin_set(&p3lr);
	pin_set(&p3lg);
	pin_set(&p3lb);

	pin_set(&p4lr);
	pin_set(&p4lg);
	pin_set(&p4lb);
}

int main (void){	
	board_init(); // asf
	sysclk_init();	// asf clock

	setupperipherals(); // peripheral clocks
	killwatchdog(); // no thanks

	setupstatus(); // pin setup

	tp1 = tinyport_new(UART2, PIOD, PERIPHERAL_C, PIO_PER_P25, PIO_PER_P26, &p1rbrx, &p1rbtx, &p1lr, &p1lg, &p1lb);
	tp2 = tinyport_new(UART0, PIOA, PERIPHERAL_A, PIO_PER_P9, PIO_PER_P10, &p2rbrx, &p2rbtx, &p2lr, &p2lg, &p2lb);
	tp3 = tinyport_new(UART1, PIOA, PERIPHERAL_C, PIO_PER_P5, PIO_PER_P4, &p3rbrx, &p3rbtx, &p3lr, &p3lg, &p3lb);
	tp4 = tinyport_new(UART4, PIOD, PERIPHERAL_C, PIO_PER_P18, PIO_PER_P19, &p4rbrx, &p4rbtx, &p4lr, &p4lg, &p4lb);

	tp_init(&tp1);
	#if IS_HOME_PORT
	UART2->UART_BRGR = 81; // manual set to FTDI speed
	#endif
	tp_init(&tp2);
	tp_init(&tp3);
	tp_init(&tp4);

	setupinterrupts(); // turns interrupt NVICs on

	setallstatus(); // lights off
	pin_set(&stlr);
	pin_set(&stlb);
	
	tp_testlights(&tp1); // fancy
	tp_testlights(&tp3);
	tp_testlights(&tp2);
	tp_testlights(&tp4);
	
	ports[0] = &tp1;
	ports[1] = &tp2;
	ports[2] = &tp3;
	ports[3] = &tp4;
	
	// test indicators
	tstrx = pin_new(PIOD, PIO_PER_P8);
	pin_output(&tstrx);
	pin_clear(&tstrx);
	tstpckt = pin_new(PIOD, PIO_PER_P6);
	pin_output(&tstpckt);
	pin_clear(&tstpckt);
	tstclk = pin_new(PIOD, PIO_PER_P2);
	pin_output(&tstclk);
	pin_clear(&tsttx);
	tsttx = pin_new(PIOD, PIO_PER_P4);
	pin_output(&tsttx);
	pin_clear(&tsttx);
	
	myAddress = MYADDRESS;
	
	for (int i = 0; i < 1024; i++) {
		for (int port = 0; port < 4; port++) {
			LUT[i][port] = MAX_HOPCOUNT; 
		}
	}

	packet_t packetlooper = packet_new();
	packet_t packetsend = packet_new();
	
	uint32_t beatTicker = 0;
	uint32_t packetTicker = 0;
	
	window = 255;
	
	packetsend.raw[0] = P_STANDARD;
	packetsend.raw[1] = 12; // destination
	packetsend.raw[2] = 0; // hops
	packetsend.raw[3] = 1; // source
	packetsend.raw[4] = 7; // # bytes
	packetsend.raw[5] = 1;
	packetsend.raw[6] = 1;

	while(1){
		pin_set(&tstclk);
		// loop over ports to run packet deciphering... allows quick handling of RXINT w/ simpler rxhandler
		// each returns one packet at a time
		for(int i = 0; i < 4; i++){
			tp_packetparser(ports[i]);
		}
		for(int i = 0; i < 4; i++){ // loop over ports and check for packets, add packets to packet buffer
			if(ports[i]->haspacket){
				packetTicker ++;
				// TODO: update heartbeat / buffer depth
				packetlooper = ports[i]->packet; 
				packet_clean(&ports[i]->packet); // reset packet states
				ports[i]->haspacket = TP_NO_PACKET;
				pin_clear(ports[i]->stlg);
				handle_packet(&packetlooper, i);
				pin_set(ports[i]->stlg);
				packet_clean(&packetlooper);
			}
		}
		
		#if IS_HOME_PORT
		while(window < 3){
			window ++; // and ack decrements
			if (in_table(packetsend.raw[1])) {
				send_on_bestport(&packetsend);
				} else {
				packetsend.raw[0] = P_STANDARD_FLOOD;
				broadcast_packet(&packetsend, 4);
			}
		}
		#endif
		
		pin_clear(&tstclk);
		/*
		if(!(packetTicker % HEARTBEAT_PERPACKET_MODULO)){
			packetTicker ++; // unlock
			send_heartbeats();
			beatTicker = 0;
		}
		
		beatTicker ++;
		if(!(beatTicker % HEARTBEAT_MODULO)){
			pin_set(&tstpckt);
			send_heartbeats();
		} else {
			pin_clear(&tstpckt);
		}
		*/
		delay_cycles(1); // one clock tick to relax interrupt scheduler
	} // end while
} // end main


void UART2_Handler(){
	if(UART2->UART_SR & UART_SR_RXRDY){
		tp_rxhandler(&tp1);
	}
	if(UART2->UART_SR & UART_SR_TXRDY){
		tp_txhandler(&tp1);
	}
}

void UART0_Handler(){
	if(UART0->UART_SR & UART_SR_RXRDY){
		tp_rxhandler(&tp2);
	}
	if(UART0->UART_SR & UART_SR_TXRDY){
		tp_txhandler(&tp2);
	}
}

void UART1_Handler(){
	if(UART1->UART_SR & UART_SR_RXRDY){
		tp_rxhandler(&tp3);
	}
	if(UART1->UART_SR & UART_SR_TXRDY){
		tp_txhandler(&tp3);
	}
}

void UART4_Handler(){
	if(UART4->UART_SR & UART_SR_RXRDY){
		tp_rxhandler(&tp4);
	}
	if(UART4->UART_SR & UART_SR_TXRDY){
		tp_txhandler(&tp4);
	}
}
