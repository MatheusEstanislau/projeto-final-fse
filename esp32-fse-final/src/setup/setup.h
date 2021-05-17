#ifndef __SETUP__
#define __SETUP__

#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>
#include "esp_system.h"
#include "esp_event.h"
#include "esp_netif.h"

#include "../mqtt/mqtt.h"

#include "cJSON.h"

char *obtemMacAddress();

#endif