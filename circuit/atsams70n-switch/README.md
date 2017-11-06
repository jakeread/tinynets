# Ethernet Killer Switch

## Why

This board is for switching UART signals in tinynet. I wanted to keep some track of what I was doing, while I was doing it. So here it is.

Originally, I had developed a switch on the XMEGA platform. I wanted to get into something a bit heavier duty, as I thought a really neat trick would be to out-perform switched ethernet, outright. I think that in ARM chips there was enough speed to do this. As max. UART bitrate is a function, I went straight to the 300MHz ATSAMx70 chips (M7 cores). Now, being more prudent I would do some tests with these chips first, but I'm not going to. This is foolish, I know that.  

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

And I have uploaded these with the fab.lbr component available here -> 

- d the b   
- jtag pins, tag-connect
- board interconnect
- plugs for network ! :| :| 

I'm going to look at the board interconnect - to decide how many pins I want, I need to look at some applicaitons. I designed a Brushless Speed Controller last year, and this had me maxing out pins (for the first time!) I am going to use that as a starting point, and add I2C, which I know is common, and some other whatsits.

- 3v3
- GND (probably multiple - but want to keep clear signal / power GND separations. Alternately, spec for board-interconnect standoffs to do heavy ground lifting?
- PWM / GPIO x 18
- ADC x 6
- SPI x 2 x 2 CS (10)
- I2C (2) 
- DAC x 1
- Seems like 40 is right, ~ 41. 

OK, the digikey search turned up a DF12 series that I think I like. 0.5mm Pitch - the same as my TQFP - and pretty cheap, and has varying heights. Great. Added to the BOM. 

I also need to jot down my notes, here, so that I can put this project on pause:

# THE GITDOWN

## Need to Spec / Footprint
 - 2x20 2.54 Pitch Interconnects
 - 2x4 ** Ports, Shrouded Sockets
 - Timer Circuit
 - JTAG Conn
 - Port Status LEDS: use Fab Part?

## Revs on Board
 - New Chip who dis
 - QSPI Flash on Chip for Address Table Storage?
  - On Board for now but don't bother w/ implement yet... get parts...
 - LED Status on TX / RX lines -> do RGB LED
 - Power LED
 - Overall Status LED (also RGB ?)
 - TX / RX / GND Probe Pickups pls
 - Reset Button
 - 'UI' Buttons
 - USB input (also just easy power) - 0.5A from USB 2.0 -> 1.5A available on USB 3.0 Charging Port
 - Otherwise, inject power 3v3 from net, big decouplers on each port,
 - More Robuts Power Input? For Power Electronics we want converter...
  - would put converter on Lower Mez. board? -> 3v3
  - on top layer ... usb power will be coming in ... or do 5v input on interconnect, bc will have drv8x- that has 5v buck! 5v -> install 3v3 reg (1A from fab inventory)


## DigiKey BOM
 ATSAM | ATSAMS70N20A-AN-ND  
 Diff Flipper | ISL3177EIUZ-ND  
 Tag-Connect JTAG | TC2050-IDC-NL-ND & 1175-1629-ND or 1175-1627-ND 
 IDC Shrouded 8 PIN | 609-5123-ND & 609-3568-ND 
 2x20 Board Intercon | 609-3013-ND or 609-1779-ND & S9200-ND 

 0.05" option
 IDC Shrouded 10 PIN | 1175-1442-ND & 1175-1629-ND or 1175-1627-ND 
 10 Line Ribbon | CN217GR-100-ND 
 IDC Compat 2x20 | 1175-1750-ND or 1175-1748-ND & 609-3779-ND 