# A Router for TinyNet

## Why

This is board for switching UART signals in TinyNet. I wanted to keep some track of what I was doing, while I was doing it. So here it is.

Originally, I had developed a switch on the XMEGA platform. I wanted to get into something a bit heavier duty, as I thought a really neat trick would be to out-perform switched ethernet, outright (for network control systems, not for datacenters). I think that in ARM chips there was enough speed to do this. Maximum UART bitrate is a function of the core clock speed (and in this case, the peripheral clock speed). I went straight to the 300MHz ATSAMx70 chips (M7 cores).

Now, being more prudent I would do some tests with these chips first, but I'm not going to. This is foolish, I know that. Max UART on the ATSAMS70 is clk/16, so 18.75Mbps. It's not huge (relative ethernet), but it's fast enough for realtime small messages on small systems. In any case, I think the question is about system architecture more than it is about outright performance at this point.

I also think that, for pure switching, an FPGA or PSOC would be a better answer. It probably is. I want to experiment with those during Networks week in [how to make](http://fab.cba.mit.edu/classes/863.17/CBA/people/jakeread/).

However, I also want my network switches to double-duty as motor controllers, sensor interfaces, etc - do general embedded-stuff. In another world, where infinite time exists, I would put FPGAs on board with a processor. With the FPGA comes a chance to invent a whole new PHY - w/ 'co-clocking' and auto-maxing bitrates, which is something I am still really interested in implementing, but there are also machines to build. I leave that experiment for another bench.

## The Chip

First order was picking the right Microcontroller for the job. I want a lot of things, and I expect this chip to become the heart of *much* of the work I'll do during the next two years, so the datasheet stakes have never been so high.

**I want a chip with: **
 - 5+ uarts
 - Big Clock Speed
 - DMA (direct memory access - peripherals write right into memory)
 - PWM's
 - ADC's
 - I2C
 - SPI
 - PIO (parallel input / output) is really exciting for communication

##### M7's

I ended up looking through Atmel's M4 and M7 Series of chips. These seem reasonably priced (actually cheap relative STM's). They're ARM, so the toolchain should be friendly to others. The M7's have a 300MHz clock that I'm getting childishly excited about.

My one issue is that they are a bit too fancy, and don't have exactly the peripherals I want. The XMEGAs have like 12 UARTS etc, the M7's max out at 5, even with 144 pins. 

I can also tell that programming these is going to be ... well ... less straightforward.

##### GO FOR
 - ATSAME70 - series - or ATSAMS70
  - E70 is 'industrial' - and S70 lacks an Ethernet Phy, but seems like it's way more popular...
 - oodles of peripherals
 - a chip you could drown in
 - 300MHz
 - did I mention peripherals?
 - $8 ... a good middle ground 

#### ATSAMS70N20
 - Exact PN  ATSAMS70N20A-AN 
 - N19: 512kb Flash, N20: 1024, N21: 2048
 - 300MHz
 - OOF: Need S70N-series for USART / SPI (has 100 pins :|)
 - Do LQFP for 14.5x14.5mm IC: TFBGA available, is 9x9mm
 - **Reads the datasheet**
  - print p. 1 -> 31 pins
  - print p. 77 -> 84 debug
  - p. 279 -> 346 clock / pmic
  - p. 346 -> 421 pio (gpio)
  - print p. 1093 -> 1117 uart
  - print p. 756 -> 788 spi
  - p. 831 -> 835 brief twi (i2c)
  - p. 964 - 968 brief usart
  - print p. 1178 -> 1186 -> 1282 pwm
  - p. 1283 -> 1288 afec (adc) brief
  - p. 158 -> 164 Power
  - p. 1554 -> 1574 Schematics

 - UART max clock is the Peripheral Clock or the PMC PCK - divided by 16. PMC PCK is an external clock, so UART clock can remain independent of processor clock.
 - So we can have (as measured) 22.8Mbps UART - into high-speed bouncy signal land. Exciting.

## Bonus Breakout

I want the following (or similar) pinouts coming off of the network node - to do *other stuff* with - i.e. motor control, sensing etc. Particularely, in a first rev of this board I am designing alongside my [bldc motor driver](https://gitlab.cba.mit.edu/jakeread/mkbldcdriver) project. 

 - 1x UART
 - 1x SPI w/ 4 cs, 1 for slave select
 - 1-2x i2c
 - 8-12x PWM, pairs three
 - all dac
 - 8-12 adc 

In the end, at this iteration, I have

 - 1 UART
 - 1 I2C (I2C and UART share one pin, so cannot be used at the same time)
 - 1 SPI w/ 2 Chip Selects
 - 1 USART w/ 2 Chip Selects (USART can be configured to do UART, or SPI, or a Clocked Serial line of your design)
 - 8 PWM's on 4 channels (hi/lo - this is designed for driving half bridges for motor control)
 - 4 Analog to Digital Converters (I am less pleased with this and want more...)
 - 3 Spare GPIO

Notes on this so far
 - More ADC's please
 - Pin headers could be split - to be breadboard friendly, and to offer some stability between layers

# Board Design

The first thing I did was to get into the datasheet. You can see that in the notes above. I am doing pinouts, figuring what I want on board. I am going to set this up as a kind of modular getdown, where the switch has a board interconnect, and I can build other PCBs w/ different hardwares to ride below. I.E motor controllers, sensor interfaces, human interfaces (!). Picking the set of pins I wanted to pull out of the chip was actually a bit painful. I'm sure I'll go through this more than once.

For JTAG Pinouts, I referenced the Tag-Connect footprint (available for download from Tag-Connect) and the ATSAM note here - http://www.atmel.com/webdoc/atmelice/atmelice.using_ocd_physical_jtag.html see Fig. 18. They match, so I don't have to do any footwork here. Nice.

I'm going to look at the board interconnect - to decide how many pins I want, I need to look at some applicaitons. I designed a Brushless Speed Controller last year, and this had me maxing out pins (for the first time!) I am going to use that as a starting point, and add I2C, which I know is common, and some other whatsits.

- 3v3
- GND (probably multiple - but want to keep clear signal / power GND separations. Alternately, spec for board-interconnect standoffs to do heavy ground lifting?
- PWM / GPIO x 18
- ADC x 6
- SPI x 2 x 2 CS (10)
- I2C (2) 
- DAC x 1
- Seems like 40 is right, ~ 41. 

I have been tempted to buy some fancy 'mezannine' connectors - but I ended up (after a few cycles) deciding to stick with a 2x20 2.54mm pitch connector. This way just about everyone will have access to the hardware, and I like that! It's also the same pitch as most IDC connectors, breadboards, etc - so hopping around between systems should be easy. I am almost tempted to split the pins a bit so that it could get right into a breadboard - or do an edge-style bb, but this seems like too much give in that direction.

OK, Here's my schematic

![schematic](https://github.com/jakeread/tinynets/blob/master/document/atsam-router-schematic.png)

And the board

![routed](https://github.com/jakeread/tinynets/blob/master/document/atsam-router-board.png)

Fabricated

![fabbed](https://github.com/jakeread/tinynets/blob/master/document/one-atsam-router.jpg)

## Incremental

- GND Vias near 3v3 Reg
- Do Reset Button
- consider networks-only version?
- swd
- tag-connect no solder stencil ! 
- tag-connect 6 pin
- tag-connect to avr swd?
- multiple programming? lookup jtag daisychain?
- push plugs to edges
- *maybe* flip or double MK header for standoff momentary happiness?

order
 - 1k 0805
 - diff. chips
 - astams
 - or, draw up a BOM and order for 30 !

# Programming

It turns out this chip defaults to SWD, not JTAG. Should have read the datasheet more carefully. Also, I forgot to order the tag-connect for this number of pins...

![hack alert](https://github.com/jakeread/tinynets/blob/master/circuit/images/swd-not-jtag.jpg)

### PIO

Here I am using the PIO peripheral (which also handles multiplexing for other peripherals) to turn one of my LED's on and off

```C

/*
 * atsams70-router.c
 *
 * Created: 11/18/2017 1:52:54 AM
 * Author : Jake
 */ 


#include "sam.h"


int main(void)
{
    // Initialize the SAM system
    SystemInit();
  
  // startup the PIOA peripheral clock - only necessary for Inputs and Interrupts
  PMC->PMC_PCER0 = 1 << ID_PIOA;
  
  // Peripheral Enable Register
  // Set PER to 1 at the pin to enable the PIO peripheral, 
  // set PDR (peripheral disable register) to 1 to clear that, opening the pin up for other peripherals (uart, etc)
  PIOA->PIO_PER |= PIO_PER_P28_Msk;
  // Output Enable Register
  PIOA->PIO_OER = PIO_PER_P28_Msk;

    while (1) 
    {
    // Clear Output Data Register (open drain)
    PIOA->PIO_CODR = PIO_PER_P28_Msk;
    // Set Output Data Register (voltage)
    PIOA->PIO_SODR = PIO_PER_P28_Msk;
    }
}


```

### ASF and Delay

ASF is Atmel Software Framework - from within Atmel Studio 7, ASF makes it easy to turn hardware peripherals on / off. It's kind of like a more-intense Arduino, in that it allows you to avoid digging in the Registers to do stuff. 

I'm more interested in doing the register digging, that way it seems easier to share and replicate code (no laundry list of dependencies to build and share) and it offers a future where I'm not in Atmel Studio 7, because *boo* proprietary software... 

But I do want a delay function, if only to test turning this light on and off. And, to be real, I think I want to use Atmel's USB CDC drivers as well - so that I can have a serial port enumerated real quick.

To use ASF, I also need to have a 'board' defined - this is like a hardware abstraction layer (HAL ... 9000). This is all explained as you go to ASF -> ASF Wizard in the top menu.

Now that I have this defined (a board) the build takes a LONG time. I am also getting a lot of errors, I think I'm going to start a new ASF project from scratch.

That's a lot better, I think.

To set the clock, I'm looking at 31.17 in the datasheet.

OK, F this, I went to http://asf.atmel.com/docs/latest/sam.drivers.mcan.quick_start.samv71_xplained_ultra/html/sysclk_quickstart.html and used ASF. I didn't need to configure anything other than setting up a #define BOARD_FREQ_MAINCK_XTAL (12000000UL) in my conf_board.h file. Nice. It's happily trucking at 300MHz now.

Here we are doing a GPIO Input

```C
#include <asf.h>

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
  PIOA->PIO_PER |= PIO_PER_P28 | PIO_PER_P15;
  // Output Enable Register
  PIOA->PIO_OER = PIO_PER_P28;
  // Output Disable Register
  PIOA->PIO_ODR = PIO_PER_P15;
  // B1 pulls PA15 to GND

  while (1) {
    // Clear Output Data Register (open drain)
    if(PIOA->PIO_PDSR & PIO_PER_P15){
      PIOA->PIO_CODR = PIO_PER_P28;
    } else {
      PIOA->PIO_SODR = PIO_PER_P28;
    }
  }
}
```

### Ring Test

On the ring test, I'm getting a jumping value between 3.9MHz and 5.7MHz, 

pics

I'm hoping that the peripheral clock is set up on a different clock source than the main chip, as that's about 100 processor ticks between pin inversions, which is kind of unsatisfying.

So I couldn't find any way to change the clock frequency for PIO pins (although there are separate clocks for UART/USART and for the USB) but I did try putting the input on Port A and the Output on Port D, this put the ring back at 5.77MHz (173ns period). Here's the code I was running

```C

#include <asf.h>

// Ring is PD1 and PD2
// try PA17 and PD7

int main (void)
{
  /* Insert system clock initialization code here (sysclk_init()). */

  board_init();
  sysclk_init();
  
  /* Insert application code here, after the board has been initialized. */
  // startup the PIOA peripheral clock - only necessary for Inputs and Interrupts
  PMC->PMC_PCER0 = 1 << ID_PIOA;
  PMC->PMC_PCER0 = 1 << ID_PIOD; // to figure out what PCERx to write to, evaluate ID_yourperipheral, and look up on datashsheet p. 308 or 331
  
  // Peripheral Enable Register
  // Set PER to 1 at the pin to enable the PIO peripheral,
  // set PDR (peripheral disable register) to 1 to clear that, opening the pin up for other peripherals (uart, etc)
  PIOA->PIO_PER |= PIO_PER_P17; 
  PIOD->PIO_PER |= PIO_PER_P1 | PIO_PER_P2 | PIO_PER_P7;
  // Output Enable Register
  PIOA->PIO_OER = PIO_PER_P17;
  PIOD->PIO_OER = PIO_PER_P1;
  // Output Disable Register
  PIOD->PIO_ODR = PIO_PER_P7;
  PIOD->PIO_ODR = PIO_PER_P2;
  // B1 pulls PA15 to GND

  while (1) {
    if(REG_PIOD_PDSR & PIO_PER_P7){
      REG_PIOA_CODR = PIO_PER_P17;
    } else {
      REG_PIOA_SODR = PIO_PER_P17;
    }
  }
}
```

### UART

OK, now I'm going to go about setting up the UART, and see if I can push the bitrate *really* high.

Drove it up to 22.8 MHz (= 22.8 MBps) and saw some pretty gnar gnar ringing... I'm using a differential driver.

- pic 

I'm a little curious if it's maybe better to just drive right out of the logic level? It's a similar amount of bouncy... but with the differtial you take the difference, so ... in this photo Channel 2 (blue) is the logic level, and Channel 1 (yellow) is coming through the differential driver. I'm also curious if this can be chilled out with a tiny capacitor to ground... seems dubious. But in an exciting development I am into high speed signals land. Weeee. I would also be curious to see what a terminating resistor might do. I think, maybe not much? Update: basically this just attenuates the signal. My understanding is that terminating resistors (that span the + and - sides of the differential) are just meant to get rid of reflections.

- pic

Here's the barebones code I'm running

```C

#include <asf.h>

// P4LR is PD13
// Ring is PD1 and PD2
// try PA17 and PD7

// https://devel.rtems.org/browser/rtems/c/src/lib/libbsp/arm/atsam/libraries/libchip/source/uart.c?rev=e1eeb883d82ce218c2a9c754795cb3c86ac0f36d

int main (void)
{
  /* Insert system clock initialization code here (sysclk_init()). */

  board_init();
  sysclk_init();
  
  PMC->PMC_PCER0 = 1 << ID_PIOD;
  PIOD->PIO_OER = PIO_PER_P13;
  
  // P4RX -> URXD4 -> PD18
  // P4TX -> UTXD4 -> PD19
  
  PMC->PMC_PCER1 = 1 << 14; // ID is 44, position in this register is 12. datasheet p. 331 *shrugguy*
  
  // configure the pins for uart4
  // see datasheet 32.5.2 and 32.5.3
  PIOD->PIO_PDR = PIO_PER_P18; // see if we can combine once working
  PIOD->PIO_PDR = PIO_PER_P19;
  
  // we want peripheral c for both pins
  // abcdsr1 -> 0 abcdsr2 -> 1
  PIOD->PIO_ABCDSR[0] = ~PIO_PER_P18;
  PIOD->PIO_ABCDSR[0] = ~PIO_PER_P19;
  PIOD->PIO_ABCDSR[1] = PIO_PER_P18;
  PIOD->PIO_ABCDSR[1] = PIO_PER_P19;
  
  // set uart mode
  UART4->UART_MR = UART_MR_BRSRCCK_PERIPH_CLK | UART_MR_CHMODE_NORMAL;
  
  // set uart clock
  UART4->UART_BRGR = 1; // is selected clock / this*16
  
  // turn tx and rx on on the uart4 module
  UART4->UART_CR = UART_CR_TXEN | UART_CR_RXEN;

  while (1) {
    while(!(UART4->UART_SR & UART_SR_TXRDY)){
      PIOD->PIO_CODR = PIO_PER_P13;
    }
    PIOD->PIO_SODR = PIO_PER_P13;
    UART4->UART_THR = 85;
  }
}
```

OK, enough for that wakeup, now I'm going to try to boot the USB CDC driver. This is something I'm more stoked about, and the last key component to letting me know that these chips are going to generally work.

### USB CDC

So, USB is a protocol, UART over USB is what the USB CDC lets you do. This is reductionist - and this also takes up some chunk of processor time, as far as I know - however, the chip has a USB peripheral, so I imagine most of the work is offloaded there. I would be tangentially interested in integrating a USB->Serial chip to compare processor overhead for the USB CDC implementation, but what am I trying to do here? Not that.

I couldn't get this running, not sure if that was about my clock, or what - but after one day lost, I give up. I'm going to build a USB -> UART RS485 Bridge (I also need a power injector, so this is all good) and go forwards with port testing and setup.

## Port Abstractions

Pins are on Ports, UARTS are on Ports, everything is confusing and ugly if we just write C and bang on registers.

```C

#ifndef PIN_H_
#define PIN_H_

#include <stdlib.h>
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>
#include "ASF/sam/utils/cmsis/sams70/include/sams70n20.h"

typedef struct{
  Pio *port;
  uint32_t pin_bm;
}pin_t;

pin_t pin_new(Pio *port, uint32_t pin_bitmask);

#endif /* PIN_H_ */
```

and

```C
#include "pin.h"
#include <asf.h>

pin_t pin_new(Pio *port, uint32_t pin_bitmask){
  pin_t pin;
  
  pin.port = port;
  pin.pin_bm = pin_bitmask;
  
  return pin;
}

void pin_output(pin_t pin){
}
```

to begin abstracting pins - just a struct