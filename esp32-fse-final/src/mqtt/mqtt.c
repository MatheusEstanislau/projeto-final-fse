#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>
#include "esp_system.h"
#include "esp_event.h"
#include "esp_netif.h"

#include "mqtt.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "freertos/queue.h"

#include "lwip/sockets.h"
#include "lwip/dns.h"
#include "lwip/netdb.h"

#include "esp_log.h"
#include "mqtt_client.h"
#include "cJSON.h"
#include "../setup/setup.h"
#include <stdbool.h>

#include "../dht/dht11.h"

#define TAG "MQTT"

extern xSemaphoreHandle sendTemperatureHumiditySemaphore;
esp_mqtt_client_handle_t client;

#define BASE_TOPIC "fse2020/150141220/"
char temperatureTopic[60] = "fse2020/150141220/";
char humidityTopic[60] = "fse2020/150141220/";

void mqtt_connected()
{
    cJSON *json;
    json = cJSON_CreateObject();
    ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");
    char registerTopic[60];
    strcpy(registerTopic, BASE_TOPIC);
    strcat(registerTopic, "dispositivos/");
    strcat(registerTopic, obtemMacAddress());
    cJSON_AddStringToObject(json, "id", obtemMacAddress());

    char *string = cJSON_Print(json);
    mqtt_envia_mensagem(registerTopic, string);

    // int msg_id = esp_mqtt_client_subscribe(client, registerTopic, 0);
    esp_mqtt_client_subscribe(client, registerTopic, 0);
}

void build_string_topic(char *roomValue)
{
    memset(temperatureTopic, 0, sizeof(temperatureTopic));
    memset(humidityTopic, 0, sizeof(temperatureTopic));
    strcpy(temperatureTopic, "fse2020/150141220/");
    strcpy(humidityTopic, "fse2020/150141220/");

    strcat(temperatureTopic, roomValue);
    strcat(temperatureTopic, "/temperatura");

    strcat(humidityTopic, roomValue);
    strcat(humidityTopic, "/umidade");
}

void initialize_temperature(int temperatureParam)
{
    cJSON *temperatureJson;
    temperatureJson = cJSON_CreateObject();
    cJSON_AddNumberToObject(temperatureJson, "temperature", temperatureParam);
    mqtt_envia_mensagem(temperatureTopic, cJSON_Print(temperatureJson));
}

void initialize_humidity(int humidity)
{
    cJSON *humidityJSON;
    humidityJSON = cJSON_CreateObject();
    cJSON_AddNumberToObject(humidityJSON, "humidity", humidity);
    mqtt_envia_mensagem(humidityTopic, cJSON_Print(humidityJSON));
}

void sendTemperatureHumidity()
{
    struct dht11_reading dhtreading;
    DHT11_init(GPIO_NUM_4);
    if (xSemaphoreTake(sendTemperatureHumiditySemaphore, portMAX_DELAY))
    {
        while (true)
        {
            dhtreading = DHT11_read();
            initialize_temperature(dhtreading.temperature);
            initialize_humidity(dhtreading.humidity);
            vTaskDelay(2000 / portTICK_PERIOD_MS);
        }
    }
}

void mqtt_message_handler(char *messageRecieved)
{
    // bool checkItem;
    cJSON *message;
    message = cJSON_Parse(messageRecieved);
    if (cJSON_HasObjectItem(message, "installedRoom"))
    {
        // bool initialized = true;
        char room[30];
        strcpy(room, cJSON_GetObjectItem(message, "installedRoom")->valuestring);
        build_string_topic(room);
        xTaskCreate(&sendTemperatureHumidity, "Send temperature and humidity", 4096, NULL, 1, NULL);

        // Como pegar um valor de atributo JSON em C:
        // printf("Nome do comodo: %s\n", cJSON_GetObjectItem(message, "installedRoom")->valuestring);
    }
}

static esp_err_t mqtt_event_handler_cb(esp_mqtt_event_handle_t event)
{
    // esp_mqtt_client_handle_t client = event->client;

    switch (event->event_id)
    {
    case MQTT_EVENT_CONNECTED:
        xSemaphoreGive(sendTemperatureHumiditySemaphore);
        mqtt_connected();
        break;

    case MQTT_EVENT_DISCONNECTED:
        ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
        break;

    case MQTT_EVENT_SUBSCRIBED:
        ESP_LOGI(TAG, "MQTT_EVENT_SUBSCRIBED, msg_id=%d", event->msg_id);
        break;

    case MQTT_EVENT_UNSUBSCRIBED:
        ESP_LOGI(TAG, "MQTT_EVENT_UNSUBSCRIBED, msg_id=%d", event->msg_id);
        break;

    case MQTT_EVENT_PUBLISHED:
        ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED, msg_id=%d", event->msg_id);
        break;

    case MQTT_EVENT_DATA:
        ESP_LOGI(TAG, "MQTT_EVENT_DATA");
        printf("TOPIC=%.*s\r\n", event->topic_len, event->topic);
        printf("DATA=%.*s\r\n", event->data_len, event->data);

        mqtt_message_handler(event->data);
        break;

    case MQTT_EVENT_ERROR:
        ESP_LOGI(TAG, "MQTT_EVENT_ERROR");
        break;

    default:
        ESP_LOGI(TAG, "Other event id:%d", event->event_id);
        break;
    }
    return ESP_OK;
}

static void mqtt_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data)
{
    ESP_LOGD(TAG, "Event dispatched from event loop base=%s, event_id=%d", base, event_id);
    mqtt_event_handler_cb(event_data);
}

void mqtt_start()
{
    esp_mqtt_client_config_t mqtt_config = {
        .uri = "wss://test.mosquitto.org:8081",
    };
    client = esp_mqtt_client_init(&mqtt_config);
    esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, client);
    esp_mqtt_client_start(client);
}

void mqtt_envia_mensagem(char *topico, char *mensagem)
{
    int message_id = esp_mqtt_client_publish(client, topico, mensagem, 0, 1, 0);
    ESP_LOGI(TAG, "Mensagem enviada, ID: %d", message_id);
}
