# 'API'

OK, hacking it together aside, it's time to write a real set of functions for the ports.

First order is to setup each port to ring-return. I'll test that, and the abstractions, with the FTDI.

Roll stlr's into tp's

Try doing this with DMA? Might make it easier on TX'ing

- four ports, each doing rx -> single char hold, on while loop, check each port and ship char home on respective tx line

Then I need to get a ringbuffer setup on top of each pipe. I'll test that again with four rx returns, this time sending multiple chars... 

# Interrupts

These were originally very difficult to figure out - I think I finally found [a good document](http://www.atmel.com/Images/Section3_Interrupts.pdf)

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

Here we are with a basic UART Sketch - lots to abstract

```C
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

pin_t p3lr;

int main (void)
{
  /* Insert system clock initialization code here (sysclk_init()). */

  board_init();
  sysclk_init();
  
  PMC->PMC_PCER0 = 1 << ID_PIOA;
  PMC->PMC_PCER0 = 1 << ID_PIOD;
  
  p3lr = pin_new(PIOD, PIO_PER_P10);
  pin_output(p3lr);
  
  stlb = pin_new(PIOA, PIO_PER_P1);
  pin_output(stlb);
  
  stlr = pin_new(PIOD, PIO_PER_P11);
  pin_output(stlr);
  
  button = pin_new(PIOA, PIO_PER_P15);
  pin_input(button);
  
  PMC->PMC_PCER1 = 1 << 14; // UART4 go clock go
  
  PIOD->PIO_PDR = PIO_PER_P18;
  PIOD->PIO_PDR = PIO_PER_P19;
  
  PIOD->PIO_ABCDSR[0] = ~PIO_PER_P18;
  PIOD->PIO_ABCDSR[0] = ~PIO_PER_P19;
  PIOD->PIO_ABCDSR[1] = PIO_PER_P18;
  PIOD->PIO_ABCDSR[1] = PIO_PER_P19;
    
  UART4->UART_MR = UART_MR_BRSRCCK_PERIPH_CLK | UART_MR_CHMODE_NORMAL;
  UART4->UART_BRGR = 32; // clock / this value * 16
  UART4->UART_CR = UART_CR_TXEN | UART_CR_RXEN;
  
  while(1){
    if(pin_get_state(button)){ // hi, button is not pressed
      pin_clear(stlb);
      pin_set(stlr);
      while(!(UART4->UART_SR & UART_SR_TXRDY)){ // wait for ready
        pin_clear(p3lr);
      }
      pin_set(p3lr);
      UART4->UART_THR = 85;
    } else {
      pin_set(stlb);
      pin_clear(stlr);
      pin_set(p3lr);
    }
  }
}
```

OK, I finally got all ports to write to their TX lines. This after some confusing bitwise or-ing of registers. 

I'm going to check that all of the lights are on OK pins, and then call this, do the updates and get the big batch of boards out to fab.

After I did this, I had the below *moment* which you're free to ignore - involves me setting the WDT registers, which I did not know I had to do, to get around a problem I had (not a bug, a feature I was blind to) where the chip was resetting every 15s or so.

# The Struggle

I'm leaving this here, as a log, of one perticularely bad misadventure in board bringup and debugging. Read if bored.

OK, I'm getting ready to boot up some of the ATSAM's PWM features. First thing, I want to address an issue where I believe the chip is resetting on an interval... I forgot to put a pull-up resistor on the reset line, so I'm *hoping* this is the only problem...

So, really not sure about this. Two things: 

(1) One of my boards - that was previously running - was non-responsive to programming this morning. Er, it would program, but verifying the flash would repeatedly fail. I have had this error before with SAM chips. On comparing .hex files side by side (one downloaded from the chip, after programming, the other the build .hex that should have been on-board), it was pretty clear there were a slew of memory locations that had errant bits in them. From what I can find online this is a function of the chip being, well, broken - and is pretty irreversible. Now, I'm not sure what's up, and I suspect I am maybe pointer-ing into some bad locations. This makes me scared that I am going to be bricking chips all the way home. HOWEVER - this was also the only chip I tried to implement the USB stack on, so I'm wondering if that's what I bricked.

Only thing I can do now is try to go forwards with my other, working, board. I am going to steer clear of the struct - abstractions I was making earlier, and try to stay close to the registers. Really, really hoping this is not a big issue with the SAM, as I just ordered 25 of these (with some improvement) for my networks project. ;|

(2) My turn-everything-on script was running, with a bit of a 'tick' - as in, I was seeing the lights all-on (nice) but would tick off every 10 seconds or so. I thought this was an errant reset-pin-going-low, so I soldered in a 10k pull-up, but this didn't change anything. On second application of a much simpler section of code, I'm not getting the tick anymore. Can't say what's going on here, either, so I'm a little bit spooked by that as well. Will continue to push in by
 - setting the clock up on this new script, seeing if that causes the tick
  - with a clock and my pin-abstraction structure, I was getting this tick again, so I can imagine I'm having some issue with this abstraction. this is, however, as I'm constantly calling to clear the pin (set lo / open drain, turn the led on)... my while loop is like this 

``` 
    while(1){
    pin_clear(&stlb);
    pin_clear(&stlr);
  }
```
 - doing a tick-tick-delay on the old script, to see if that flash *is* a reset, or is something else entirely...
  - even with this sequence out of the loop, I'm having some ticking. and I can confirm this is causing a total reset, not just a tick in the pin - so I definitely need to look really closely at what I am doing here. learning about pointers! fun, probably a question for Neil or Sam. at least a relief I am not bricking the board, but I'm probably getting close to it!

OK, I still have some resetting going on, without any abstraction. F

Now I'm going to check my schematic for trouble with the VDDCORE and power lines...

This is upsetting. It looks like I missed a 1uF cap on the VDDOUT and some 470R resistors towards the VDDPLL and VDDOUTMIC pins. I really should have addressed this in more depth BEFORE I sent 25 boards out to fab! welp!

OK, I'm going to try adding that 470R to the VDDPLL line, before the cap. We'll see if that helps. At least it's not my code, I guess? *shrugman*

![hack alert](https://github.com/jakeread/tinynets/blob/master/circuit/images/vddcore-filtering-attempt.jpg)

This absolutely doesn't work ... the datasheet is spec'ing 470ohms at 100MHz, I think this is about capacitive reactance - not just resistance. So [I looked this up](http://www.electronics-tutorials.ws/filter/filter_1.html) ... and wrote a spreadsheet, looks like I want 3-4pF to get 470ohms at 100MHz, I can hope this is what it's about... I'll try that...

OK, this didn't work, and in addition it sounds like I may have fried this chip now, too. Yay. Looking at some other datasheets I can see that this mystery *470ohm at 100MHz* is specting the Reactance of an Inductor, not a Capacitor. Some other designs show a simple 10uH inductor here, I can try adding that as a last ditch.

We have that

X_L = 2 * PI * f * L 

Where X_L is reactance in Ohms, f is frequency and L is inductance in Henries. So I want a 0.75uH inductor, great. I have a 10uH inductor? And the Fab Inventory stocks a 1uH inductor of a good size - nice.

I tried this as well, with a solder-in-place hack like the above. This is REALLY dissapointing. That doesn't help.

Going forward, I'm not sure that I have enough time to mess about with all of this complexity anymore. Two big points - (1) USB CDC was not working, this is a big downer. (2) this restarting issue, a total ghost (although, maybe it's really just that I need another 1uH inductor on VOUTMC). HOWEVER - it's now really pinch time, and I desperately need to be developing software, not going for another round to the boardhouse. SO. I'm thinking I may step back to the XMEGA... meaning I have lost about a month total time on this fancy ATSAM chip... And my UART will be locked down at 3MHz. This is a dissapointing development for me, for sure.

Maybe this is a good way forwards 
 - Go forth with XMEGA chip, can fab right away and maybe still have working BLDC for Wednesday
 - Make barebones ATSAMS70 chip, try to wake up successfully 
  - might as well be ASTSAMV71, as this is speculatory / far future now
  - Filters on all Power Lines
  - Decent VDDCore Net (lots of vias here at the moment, no bueno)

Going forwards with XMEGAs, I would 
- do a really barebones move forwards on the chips I have working, maybe making them very small (for fun) to be impressive for micro-robotics for networks class... no differential signaling, just big capacitors, really, really tiny chips, with LEDS for showing off, does data capture, that's it. no more f'ing around. a USB bridge that works.
- do a bigger chip w/ ATxmegaA3U, for MK futures, for BLDC attempts.

OK, a sad moment for me. I hope I can bring some of this online in the future, I've certainly learned a great deal - and waded through some levels of complexity previously foreign to me. However, that's over. Complexity is not your friend when you are a singular individual! A eulogy, then, for my ATSAM Dreams

RIP ATSAMS70 
Nov. 1 to Nov. 26, 2017
*It was fast
It rebooted slowly.
It sent me back to where I was,
Four weeks past*

**UPDATE**

In my despair, I went for a beer with Jonah. Jonah is like 'dude it's obviously the watchdog timer' - I'm like "what's that" - etc - turns out, this is what it was. Bless you Jonah. I looked this up on the subway ride home

![hack alert](https://github.com/jakeread/tinynets/blob/master/circuit/images/what-is-wdt.jpg)

A Watchdog Timer (WDT) is a module that resets the chip when there's not a lot going on. I.E. if your code is hung, it restarts your game, so that code doesn't hang and break things. This sounds really useful - however, it was breaking my shit. So, I turned it off.

Now, things will continue. Bless.