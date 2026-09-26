summary: Exercício de Flutter: desenvolva um aplicativo que busca e exibe as previsões do tempo de uma cidade usando a API do OpenWeatherMap, com puxar para atualizar e, como desafio, busca por GPS.
id: flutter-exercicios-previsao-do-tempo
categories: Flutter,Mobile
tags: flutter,exercicios,openweathermap,http,refreshindicator,geolocator
status: Published
authors: Rodrigo Bossini
last updated: 2023-09-22
pdf: dart_flutter/01_exercicio_flutter_previsao_do_tempo.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Exercícios: aplicativo de previsão do tempo em Flutter

## Visão geral
Duration: 3:00

Neste exercício, você desenvolverá um aplicativo Flutter capaz de exibir uma lista de previsões do tempo para uma cidade cujo nome o usuário poderá informar. As previsões serão obtidas a partir do seguinte serviço.

[https://openweathermap.org/forecast5](https://openweathermap.org/forecast5)

### O que você vai praticar

* Entrada de dados do usuário em um aplicativo Flutter
* Requisições a um serviço web e exibição de listas
* O padrão "puxar para atualizar"
* Opcionalmente, o uso do GPS do dispositivo

### O que você vai precisar

* O SDK do Flutter e um emulador ou dispositivo
* Uma chave de acesso (API key) do OpenWeatherMap

## Requisitos
Duration: 30:00

1. Permitir que o usuário informe o nome de uma cidade.
2. Realizar a busca da previsão do tempo para a cidade informada.
3. Exibir uma lista de 10 previsões do tempo para aquela cidade. Cada previsão deve conter
   * um ícone
   * a temperatura mínima
   * a temperatura máxima
   * uma descrição
   * a umidade relativa do ar
4. **Puxar para atualizar**: o usuário pode "puxar a tela para baixo" a fim de realizar nova requisição e obter novas previsões.

## Desafios e sugestões
Duration: 20:00

### Desafios

1. Permitir que o usuário faça uma busca utilizando as coordenadas latitude/longitude obtidas do hardware de GPS do seu dispositivo móvel.

### Sugestões

1. Para organizar os componentes visuais na tela, pesquise sobre gerenciadores de leiaute na documentação oficial. [https://flutter.dev/docs/development/ui/widgets/layout](https://flutter.dev/docs/development/ui/widgets/layout)
2. Para implementar a funcionalidade de "puxar para atualizar" e refazer a requisição, pesquise sobre a classe `RefreshIndicator` na documentação oficial. [https://api.flutter.dev/flutter/material/RefreshIndicator-class.html](https://api.flutter.dev/flutter/material/RefreshIndicator-class.html)
3. Para obter coordenadas latitude/longitude do hardware de GPS do dispositivo, use o pacote `geolocator`. [https://pub.dev/packages/geolocator](https://pub.dev/packages/geolocator)

## Encerramento
Duration: 3:00

Parabéns por concluir o exercício! Revise se cada previsão exibe ícone, temperaturas mínima e máxima, descrição e umidade, e se o gesto de puxar para atualizar refaz a requisição.

### Referências

* Dart programming language | Dart. Google, 2023. Disponível em [https://dart.dev/](https://dart.dev/). Acesso em setembro de 2023.
* Flutter - Build apps for any screen. Google, 2023. Disponível em [https://flutter.dev/](https://flutter.dev/). Acesso em setembro de 2023.
