/*
 * pins.h
 *
 * Created: 11/23/2017 1:11:45 PM
 *  Author: Jake
 */


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

void pin_output(pin_t *pin); // set as output
void pin_set(pin_t *pin);
void pin_clear(pin_t *pin);

void pin_input(pin_t *pin);
bool pin_get_state(pin_t *pin);

#endif /* PIN_H_ */
