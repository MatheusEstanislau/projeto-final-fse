#include "setup.h"

char *obtemMacAddress()
{
  uint8_t base_mac_addr[6] = {0};
  char *macAddress = malloc(20);
  esp_efuse_mac_get_default(base_mac_addr);

  snprintf(macAddress, 20,
           "%x:%x:%x:%x:%x:%x", base_mac_addr[0], base_mac_addr[1], base_mac_addr[2], base_mac_addr[3], base_mac_addr[4], base_mac_addr[5]);

  return macAddress;
}
