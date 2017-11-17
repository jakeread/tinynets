# Ethernet Killer Switch

## Why

This board is for switching UART signals in tinynet. I wanted to keep some track of what I was doing, while I was doing it. So here it is.

Originally, I had developed a switch on the XMEGA platform. I wanted to get into something a bit heavier duty, as I thought a really neat trick would be to out-perform switched ethernet, outright (for embedded systems, not for datacenters). I think that in ARM chips there was enough speed to do this. As max. UART bitrate is a function, I went straight to the 300MHz ATSAMx70 chips (M7 cores). Now, being more prudent I would do some tests with these chips first, but I'm not going to. This is foolish, I know that. Max UART on the ATSAMS70 is clk/16, so 18.75Mbps. It's not huge, but it's fast enough for realtime small messages on small systems. In any case, I think the question is about system architecture more than it is about outright performance at this point.

I also think that, for pure switching, an FPGA or PSOC would be a better answer. It probably is. I also want my network switches to double-duty as motor controllers, sensor interfaces, etc - do general embedded-stuff. In another world, where infinite time exists, I would put FPGAs on board with a processor. With the FPGA comes a chance to invent a whole new PHY - w/ 'co-clocking' and auto-maxing bitrates, which is something I am still really interested in implementing, but there are also machines to build. I leave that experiment for another bench.

## The Chip

Here are my notes from selecting a chip for the getting-down:

# SAM Selection

- Want a chip with: 
 - 5+ uarts
 - Big Clock Speed
 - tite DMA
 - prgmemable
 - probably M4

# M7's

## SAM E

## SAM S

## SAM V71
 - mega, ultra, $10

## GO FOR
 - ATSAME70 - series - or ATSAMS70
  - E70 is 'industrial' - and S70 lacks an Ethernet Phy, but seems like it's way more popular...
 - oodles of peripherals
 - a chip you could drown in
 - 300MHz
 - did I mention peripherals?
 - $8 ... a good middle ground 

## ATSAMS70N20
 - Exact PN  ATSAMS70N20A-AN 
 - N19: 512kb Flash, N20: 1024, N21: 2048
 - 300MHz
 - OOF: Need S70N-series for USART / SPI (has 100 pins :|)
 - Do LQFP for 14.5x14.5mm IC: TFBGA available, is 9x9mm

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
 - 

## Want coming off-board
 - 1x UART
 - 1x SPI w/ 4 cs, 1 for slave select
 - 1-2x i2c
 - 8-12x PWM, pairs three
 - all dac
 - 8-12 adc 


## USART 
 - http://asf.atmel.com/docs/latest/sam.drivers.usart.usart_synchronous_example.sam3u_ek/html/index.html 

## OK 

The first thing I did was to get into the datasheet. You can see that in the notes above. I am doing pinouts, figuring what I want on board. I am going to set this up as a kind of modular getdown, where the switch has a board interconnect, and I can build other PCBs w/ different hardwares to ride below. I.E motor controllers, sensor interfaces, human interfaces (yeeees). Picking the set of pins I wanted to pull out of the chip was actually a bit painful. I'm sure I'll go through this more than once.

![img of schematic](/)

Now I'm going to connect this to a footprint (TQFP 100) in eagle,

![footprint](/) 

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

I also need to jot down my notes, here, so that I can put this project on pause:

I'm also interested in adding some memory to the chips... I want to be able to store data in longer terms - mostly routing tables, also eventually configurations. I am going down the rabbit hole, I know. But in debugging, etc, it would be cool if I didn't have to go through large startup sequences. I'll spec it out, I won't write software for it until that's necessary... Here's an SD Holder
-  WM12834CT-ND 
and 
https://learn.adafruit.com/adafruit-micro-sd-breakout-board-card-tutorial/download 

I think there's probably a better in-between - and besides, the point is a little bit to take state out of the controller, not put more in. I need to rethink this, I think. Just write good network schematics that converge quickly, right? This is more overhead than I want.

# THE GITDOWN

## Need to Spec / Footprint

## Revs on Board

# Programming

I was at a loss when I realized I was missing the 10-pin Tag-Connect header I needed to program this. Turns out the chip automatically enumerates as a SAM-BA USB device, and I can use [this](http://www.shumatech.com/web/products/bossa) *I think* to program it. I'll give that a go.

update - not easy, or, didn't work immediately. going to bed.