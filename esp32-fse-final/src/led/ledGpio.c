#include <stdio.h>
#include "sdkconfig.h"
#include "driver/gpio.h"

#define LED 2

void handleLed(int state)
{
  gpio_pad_select_gpio(LED);
  gpio_set_direction(LED, GPIO_MODE_OUTPUT);
  gpio_set_level(LED, state);
}
