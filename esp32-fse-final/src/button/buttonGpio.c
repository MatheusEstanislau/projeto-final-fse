#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "esp_log.h"
#include "driver/gpio.h"
#include "../mqtt/mqtt.h"
#include "cJSON.h"

#define BOTAO_1 0

int alarmState = 0;

xQueueHandle filaDeInterrupcao;

char topic[60];

static void IRAM_ATTR gpio_isr_handler(void *args)
{
  int pino = (int)args;
  xQueueSendFromISR(filaDeInterrupcao, &pino, NULL);
}
void trataInterrupcaoBotao(void *params)
{
  int pino;
  while (true)
  {
    if (xQueueReceive(filaDeInterrupcao, &pino, portMAX_DELAY))
    {
      int estado = gpio_get_level(pino);
      if (estado == 1)
      {
        gpio_isr_handler_remove(pino);
        if (alarmState)
        {
          cJSON *response_alarme = NULL;
          response_alarme = cJSON_CreateObject();
          cJSON_AddNumberToObject(response_alarme, "alarm", 1);
          mqtt_envia_mensagem(topic, cJSON_Print(response_alarme));

          free(response_alarme);
          gpio_isr_handler_add(pino, gpio_isr_handler, (void *)pino);
        }
      }
    }
  }
}

void activeAlarm(char *url)
{
  alarmState = 1;
  strcpy(topic, url);
  // Configuração dos pinos dos LEDs
  gpio_pad_select_gpio(BOTAO_1);

  // Configura o pino do Botão como Entrada
  gpio_set_direction(BOTAO_1, GPIO_MODE_INPUT);

  // Configura o resistor de Pulldown para o botão (por padrão a entrada estará em Zero)
  gpio_pulldown_en(BOTAO_1);

  // Desabilita o resistor de Pull-up por segurança.
  gpio_pullup_dis(BOTAO_1);

  // Configura pino para interrupção
  gpio_set_intr_type(BOTAO_1, GPIO_INTR_POSEDGE);

  filaDeInterrupcao = xQueueCreate(10, sizeof(int));
  xTaskCreate(trataInterrupcaoBotao, "TrataBotao", 2048, url, 1, NULL);

  gpio_install_isr_service(0);
  gpio_isr_handler_add(BOTAO_1, gpio_isr_handler, (void *)BOTAO_1);
}

void disableAlarm()
{
  gpio_isr_handler_remove(0);
  gpio_intr_disable(0);
  alarmState = 0;
  printf("ALARME DISABLED.\n");
}
