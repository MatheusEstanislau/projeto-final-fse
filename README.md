# Projeto Final FSE
Repositório criado para desenvolvimento do projeto final da disciplina Fundamentos Sistemas Embarcados 2020/2

O enunciado do projeto final pode ser acessado em https://gitlab.com/fse_fga/projetos_2020_2/trabalho-final-2020-2

## Alunos

|Matrícula|Nome|
|--|--|
|15/0141220|Matheus de Cristo Estanislau|
|17/0044386|Renan Cristyan Araújo Pinheiro|

## Objetivo

O objetivo deste trabalho é desenvolver um sistema de automação residencial, com um computador (PC) funcionando como central
e placas ESP32 como controladores distribuídos, conectados através de Wifi utilizando protocolo MQTT

## Organização do projeto

O projeto está organizado em duas partes principais, a interface de usuário e o código da ESP32 (dev kit). 

A interface de usuário foi implementada em React JS e o código da ESP32 foi implementado em C, utilizando o framework PlatformIO IDE com ESPIDF v.3.402.

## Como executar o projeto

Inicialmente, certifique-se de realizar as conexões físicas necessárias a placa ESP32 (consulte o enunciado do projeto para mais detalhes).

Com a placa ligada e conectada a internet, execute o código da interface de usuário. Primeiramente é necessário instalar as dependências. Entre no dirtório 'fse-final' e execute:

```yarn```

Essa etapa pode demorar um pouco, dependendo da máquina e/ou velocidade da internet. Com as dependências instaladas com sucesso, execute a interface com:

```yarn start```

Assim que o frontend iniciar, acesse no seu browser o link que for informado, provavelmente http://localhost:3000/

