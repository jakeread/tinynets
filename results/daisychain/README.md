# Daisy Chained Message Passing

## Setup

In this baseline test, our switches are connected in series. On receiving a packet on Port 2, it is automatically forwarded to Port 4, with no computation done otherwise. This will give us a baseline performance metric while developing algorithms that necessarily perform *some* computation with each packet before forwarding it, as well as handling messages on multiple ports, etc.

![img of setup](https://github.com/jakeread/tinynets/blob/master/results/daisychain/daisychain-setup.jpg)  

We test a packet that is 70 Bytes long - 560 bits and a packet that is 7 bytes long (our minimum). The code used to buffer and pass the message is included under /results/daisychain/code . Each switch sets a pin high during the interval that it is sending bytes, and we use a logic analyzer to track this status across multiple switches. This is how we measure message passing time.

![img of logic](https://github.com/jakeread/tinynets/blob/master/results/daisychain/daisychain-measurement.jpg)  

Results are as follows. The expected T_message is simply (bits/packet)/bitrate - any additional message time is due to system design and implementation. Critically, UART uses a start and stop bit, per byte.

Bitrate | T_message (us) | P_size | T_message* (us) | % Difference
--- | --- | --- | --- | ---
115200 | 4861 | 70 | 5858 | 21
115200 | 486 | 7 | 586 | 21
230400 | 2431 | 70 | 2930 | 21 
230400 | 243 | 7 | 295 | 21 
428600 | 1307 | 70 | 1580 | 21 
428600 | 131 | 7 | 161 | 23 
1M | 560 | 70 | 679 | 21
1M | 56 | 7 | 71 | 27
3M | 187 | 70 | 245 | 31
3M | 19 | 7 | 43 | 126

Critically, we see a ~20% increase with lower bitrates - largely due to the extra two bits (start and stop) per packet. At higher bitrates, processor overhead also becomes apparent, nearly doubling message times. This is a key indicator that our system performance will hinge on driving switch computation to a minimum, an observation made in class...
