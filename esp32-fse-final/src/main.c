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

#define AP_SSID "Matheus"
#define AP_PASSWORD "ame26081996"
#define AP_MAX_CONN 4
#define CHANNEL 0

xSemaphoreHandle conexaoWifiSemaphore;
xSemaphoreHandle conexaoMQTTSemaphore;

int initialized = 0;

char *obtemMacAddress()
{
  uint8_t base_mac_addr[6] = {0};
  char *macAddress = malloc(20);
  esp_efuse_mac_get_default(base_mac_addr);

  snprintf(macAddress, 20,
           "%x:%x:%x:%x:%x:%x", base_mac_addr[0], base_mac_addr[1], base_mac_addr[2], base_mac_addr[3], base_mac_addr[4], base_mac_addr[5]);

  return macAddress;
}

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

void trataComunicacaoComServidor(void *params)
{
  struct dht11_reading dhtreading;
  DHT11_init(4);
  cJSON *json;
  json = cJSON_CreateObject();
  if (xSemaphoreTake(conexaoMQTTSemaphore, portMAX_DELAY))
  {
    while (true)
    {
      if (initialized == 0)
      {
        cJSON_AddStringToObject(json, "id", obtemMacAddress());
        char *string = cJSON_Print(json);
        mqtt_envia_mensagem("fse2020/150141220/dispositivos/1", string);
        initialized = 1;
      }
      else
      {
        dhtreading = DHT11_read();
        while (dhtreading.status == -1)
        {
          dhtreading = DHT11_read();
        }
        cJSON *jsonTemperature, *jsonHumidity;
        jsonTemperature = cJSON_CreateObject();
        jsonHumidity = cJSON_CreateObject();
        cJSON_AddNumberToObject(jsonTemperature, "temperature", dhtreading.temperature);
        cJSON_AddNumberToObject(jsonHumidity, "humidity", dhtreading.humidity);
        mqtt_envia_mensagem("fse2020/150141220/sala/temperatura", cJSON_Print(jsonTemperature));
        mqtt_envia_mensagem("fse2020/150141220/sala/umidade", cJSON_Print(jsonHumidity));
      }
      vTaskDelay(2000 / portTICK_PERIOD_MS);
    }
  }
}

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
  conexaoMQTTSemaphore = xSemaphoreCreateBinary();
  wifi_start();

  xTaskCreate(&conectadoWifi, "Conexão ao MQTT", 4096, NULL, 1, NULL);
  xTaskCreate(&trataComunicacaoComServidor, "Comunicação com Broker", 4096, NULL, 1, NULL);
}