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


## Bill of Materials

| Part | Value | Package | Number | PN | 
| --- | --- | --- | --- | ---- |
| C | 0.1uF | 0603 | 11 | - |
| C | 22pF | 0603 | 2 | - |
| C | 10pF | 0805 | 1 | - |
| C | 0.47uF | 0805 | 4 | - |
| C | 4.7uF | 0805 | 2 | - |
| C | 22uF 16V | 0805 | 9 | - |
| C | 47uF 16V | 1210 | 2 | - |
| R | 2R2 | 0805 | 2 | - |
| R | 1K | 0805 | 5 | - |
| R | 2K2 | 0805 | 10 | - |
| R | 5K62 | 0805 | 1 | - |
| R | 10K | 0805 | 2 | - |
| L | 10uH | 1812 | 2 | - |
| Q | 12MHz | CT406 | 1 | - |
| D | LEDRGBNEW | P-LCC-4 | 5 | - |
| U | ISL3177E | MSOP8 | 4 | - |
| U | ATSAMS70N | TQFP100 | 1 | - |
| U | 3V3 Reg | SOT223 | 1 | - |
| Connector | 02x04 Shrouded | - | 4 | - |
| Switch | FAB Momentary | - | 2 | - |


## Incremental

next board
 - tiny inductor filters on vddpll and vddoutmic, maybe shield usb, as this might work?
 - if end of term / long time span, do v71 for usb dreams?
