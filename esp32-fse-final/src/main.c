#include <stdio.h>
#include "nvs_flash.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_http_client.h"
#include "esp_log.h"
#include "freertos/semphr.h"
#include <unistd.h>
#include "dht/dht11.h"
#include "mqtt/mqtt.h"
#include "wifi/wifi.h"

#include "cJSON.h"
#include <string.h>

#define AP_SSID "Matheus"
#define AP_PASSWORD "ame26081996"
#define AP_MAX_CONN 4
#define CHANNEL 0

xSemaphoreHandle conexaoWifiSemaphore;
xSemaphoreHandle sendTemperatureHumiditySemaphore;;

int initialized = 0;

void conectadoWifi(void *params)
{
  while (true)
  {
    if (xSemaphoreTake(conexaoWifiSemaphore, portMAX_DELAY))
    {
      mqtt_start();
    }
  }
}

// void trataComunicacaoComServidor(void *params)
// {
//   struct dht11_reading dhtreading;
//   DHT11_init(4);
  
//   if (xSemaphoreTake(conexaoMQTTSemaphore, portMAX_DELAY))
//   {
//     while (true)
//     {
//       // dhtreading = DHT11_read();
//       // while (dhtreading.status == -1)
//       // {
//       //   dhtreading = DHT11_read();
//       // }
    
//       
//     }
//   }
// }

void app_main()
{
  esp_err_t ret = nvs_flash_init();
  if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND)
  {
    ESP_ERROR_CHECK(nvs_flash_erase());
    ret = nvs_flash_init();
  }
  ESP_ERROR_CHECK(ret);

  conexaoWifiSemaphore = xSemaphoreCreateBinary();
  sendTemperatureHumiditySemaphore = xSemaphoreCreateBinary();
  wifi_start();

  xTaskCreate(&conectadoWifi, "Conexão ao MQTT", 4096, NULL, 1, NULL);
  // xTaskCreate(&trataComunicacaoComServidor, "Comunicação com Broker", 4096, NULL, 1, NULL);
}