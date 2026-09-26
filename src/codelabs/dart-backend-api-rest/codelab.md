summary: Construa uma API REST completa em Dart com shelf, do primeiro servidor HTTP até a aplicação rodando em contêineres: configuração externalizada, arquitetura em camadas, MySQL, modelo de maturidade de Richardson, HATEOAS, OpenAPI e Docker Compose.
id: dart-backend-api-rest
categories: Flutter,Docker,MySQL
tags: dart,back end,api rest,shelf,mysql,docker,docker compose,hateoas,richardson,openapi,swagger,cors,problem+json
status: Published
authors: Rodrigo Bossini
last updated: 2026-09-06
pdf: dart_flutter/04_apostila_dart_backend.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Back End com Dart: APIs REST, MySQL, Docker e boas práticas

## Visão geral
Duration: 5:00

Construção completa de uma API REST em Dart, do primeiro servidor HTTP até a aplicação rodando em contêineres. O caminho passa por configuração externalizada, camadas, MySQL, o modelo de maturidade de Richardson e Docker Compose.

Dart nasceu como uma linguagem para o navegador, ganhou tração mundial como a linguagem do Flutter e, nos últimos anos, consolidou-se também como uma opção sólida para o lado do servidor. A razão é técnica: o mesmo compilador que gera código nativo para celulares gera executáveis nativos para Linux, e o modelo de concorrência baseado em *event loop* com `async`/`await` é exatamente o que um servidor HTTP precisa para atender muitas conexões simultâneas sem criar uma *thread* por requisição.

Para o estudante de graduação existe ainda um ganho pedagógico. Quem já escreveu uma tela em Flutter conhece `Future`, `Stream`, *null safety* e o sistema de pacotes do `pub`. Ao escrever o *back end* na mesma linguagem, o esforço cognitivo se concentra onde ele realmente importa neste momento: protocolo HTTP, modelagem de recursos, camadas, banco de dados e empacotamento em contêineres.

> **API REST**
>
> Uma API REST é uma interface de rede que expõe **recursos** identificados por URIs e manipulados através de um conjunto uniforme de verbos HTTP, com representações trocadas em um formato acordado (aqui, JSON). REST não é um protocolo nem uma biblioteca: é um **estilo arquitetural** descrito por Roy Fielding em 2000, definido por seis restrições:
>
> * **cliente-servidor** — as duas pontas evoluem separadamente, desde que o contrato entre elas seja respeitado;
> * **ausência de estado** — cada requisição carrega tudo o que é necessário para ser atendida, e o servidor não guarda sessão entre uma e outra;
> * **cacheabilidade** — as respostas dizem se podem ser armazenadas e por quanto tempo, permitindo que intermediários evitem viagens desnecessárias;
> * **interface uniforme** — os mesmos verbos e as mesmas convenções valem para todos os recursos, em qualquer API;
> * **sistema em camadas** — o cliente não sabe se fala com o servidor final ou com um balanceador, um cache ou um *gateway* pelo caminho;
> * **código sob demanda** — única restrição opcional, permite ao servidor enviar código executável ao cliente.
>
> Uma API que respeita essas restrições é chamada de **RESTful**. O adjetivo não é um selo formal: na prática ele indica o quanto a interface se aproxima do estilo, e o passo "O modelo de maturidade de Richardson" apresenta a escala mais usada para medir essa aproximação.

### O que você vai aprender

* Criar um projeto Dart de servidor com `shelf`, `shelf_router`, `dotenv` e `mysql_dart`, com análise estática desde o primeiro dia
* Externalizar a configuração em variáveis de ambiente (`.env`), seguindo o *Twelve-Factor App*, e validá-la na inicialização
* Entender *handlers*, *middlewares* e *pipelines* do `shelf`
* Classificar APIs pelo modelo de maturidade de Richardson (níveis 0 a 3), usar verbos e códigos de status corretamente e conhecer os formatos de hipermídia HAL, JSON:API e Siren
* Organizar a aplicação em camadas (modelo, repositório, serviço, controlador) com inversão de dependência
* Entender contêineres, imagens, registros, volumes e redes, e subir o MySQL a partir do Docker Hub
* Implementar a persistência com pool de conexões e parâmetros nomeados (sem injeção de SQL)
* Testar a regra de negócio com um repositório em memória usando o pacote `test`
* Padronizar erros com `application/problem+json` (RFC 9457), configurar CORS e tratar exceções num *middleware*
* Adicionar verificação de saúde, desligamento gracioso, HATEOAS e documentação OpenAPI com Swagger UI
* Empacotar a API em uma imagem com *build* em múltiplos estágios e orquestrar tudo com Docker Compose

### O que você vai precisar

* Dart SDK 3 (qualquer versão 3.x recente)
* Docker com o subcomando `docker compose` (Compose v2)
* Um terminal com `curl` (e, no Windows, Git Bash ou WSL para o script de shell)
* Conhecimentos básicos de Dart (por exemplo, de quem já escreveu telas em Flutter)

## O que será construído
Duration: 5:00

Ao final deste codelab existirá uma aplicação com dois contêineres conversando em uma rede privada do Docker, como mostra a figura abaixo: um contêiner com o banco MySQL e um contêiner com a API compilada em código nativo. O cliente — navegador, `curl`, Postman ou um aplicativo Flutter — enxerga apenas uma porta publicada no *host*.

![Diagrama da topologia final: o cliente acessa por HTTP na porta 8080 o contêiner api (Dart AOT com shelf, que também serve o Swagger UI em /docs), que fala por TCP na porta 3306 com o contêiner db (MySQL 8.4), cujos dados ficam no volume dados-mysql, tudo dentro da rede Docker terrario-net](img/fig-01.webp)

*Topologia final: o cliente fala apenas com a porta publicada; banco e volume permanecem privados dentro da rede do Docker.*

### O domínio: terrários

Exemplos de API costumam girar em torno de entidades genéricas demais para revelar decisões de modelagem interessantes. Aqui o domínio será um catálogo de **terrários** — aqueles microecossistemas fechados em vidro, com plantas, substrato e umidade controlada, mantidos por laboratórios de botânica e por entusiastas.

Um terrário tem um apelido, pertence a um bioma, tem uma umidade-alvo em pontos percentuais, um volume em litros e uma data de montagem. Esse conjunto é pequeno o bastante para caber na cabeça e rico o bastante para exigir validação de faixa numérica, validação de domínio fechado (o bioma), tratamento de datas e filtros de consulta.

**Atributos da entidade Terrário**

| Atributo | Tipo | Regra |
| --- | --- | --- |
| `id` | inteiro | gerado pelo banco |
| `apelido` | texto | obrigatório, 3 a 80 caracteres, único |
| `bioma` | texto | um entre `tropical`, `desertico`, `temperado`, `musgo` |
| `umidadeAlvo` | inteiro | de 0 a 100 |
| `volumeLitros` | decimal | maior que zero |
| `dataMontagem` | data | formato AAAA-MM-DD, não futura |
| `criadoEm` | data/hora | preenchido pelo banco |
| `atualizadoEm` | data/hora | atualizado pelo banco |

### Como acompanhar

Todo o código aparece em blocos identificados pelo caminho do arquivo no rótulo acima de cada bloco. Antes de cada bloco, o texto diz se aquele arquivo deve ser **criado**, se o conteúdo deve ser **substituído** ou se o trecho deve ser **acrescentado** a algo que já existe.

Quando um arquivo já apresentado recebe acréscimos, o bloco pode trazer algumas linhas de contexto que indicam onde encaixar o trecho novo — o texto diz quais são. Elas já estão no seu arquivo e não devem ser digitadas de novo. Trechos longos já apresentados aparecem resumidos em comentários como `// ... corpo já apresentado ...`, que também não devem ser copiados.

Copiando os blocos na ordem em que aparecem, a aplicação estará completa e funcionando ao final. Ao longo do caminho há paradas para executar o que foi escrito até ali, porque descobrir um erro logo depois de cometê-lo é muito mais barato do que descobri-lo cinco arquivos adiante.

## Preparando o ambiente
Duration: 12:00

### Dart SDK

O Dart SDK traz o compilador, a máquina virtual, o formatador, o analisador estático e o gerenciador de pacotes `pub`. Se o Flutter já estiver instalado, o Dart vem junto, mas para trabalho de servidor vale instalar o SDK puro.

**Terminal — verificando a instalação**

```text
$ dart --version
Dart SDK version: 3.12.2 (stable) on "linux_x64"
```

Qualquer versão 3.x recente serve. O que importa é ser Dart 3, porque a partir dele a segurança contra nulos (*sound null safety*) é obrigatória e os recursos de *records* e *patterns* estão disponíveis.

### Docker

O Docker será usado de duas maneiras diferentes, e é importante não confundi-las. Primeiro como **infraestrutura de desenvolvimento**: em vez de instalar um servidor MySQL na máquina, sobe-se um contêiner a partir de uma imagem pronta do Docker Hub. Depois como **formato de entrega**: a própria API é empacotada em uma imagem e passa a rodar como contêiner.

**Terminal — verificando o Docker**

```text
$ docker --version
Docker version 27.4.1, build b9d17ea

$ docker compose version
Docker Compose version v2.32.1
```

<aside class="negative">

**Atenção:** nas distribuições atuais o Compose é um **subcomando** do Docker (`docker compose`, com espaço). O binário antigo `docker-compose` com hífen é a versão 1, escrita em Python, descontinuada. Se apenas o comando com hífen funcionar na sua máquina, atualize o Docker antes de continuar.

</aside>

### Criando o projeto

O `dart create` monta o esqueleto de um pacote. O modelo `console` é o ponto de partida mais limpo: um `pubspec.yaml`, uma pasta `bin` com o ponto de entrada e uma pasta `lib` para o código de biblioteca.

**Terminal — criando o projeto**

```bash
dart create -t console terrario_api
cd terrario_api
```

Em seguida vêm as dependências. O `dart pub add` escreve as versões compatíveis mais recentes no `pubspec.yaml` e já baixa tudo.

**Terminal — instalando as dependências**

```bash
dart pub add shelf shelf_router dotenv mysql_dart
dart pub add dev:test dev:lints
```

O resultado é um `pubspec.yaml` parecido com o abaixo. Cada pacote tem um papel bem delimitado, o que é característico do ecossistema Dart de servidor: não existe um *framework* monolítico que resolve tudo, e sim peças pequenas que se compõem.

**pubspec.yaml**

```yaml
name: terrario_api
description: API REST para catálogo de terrários.
version: 1.0.0
publish_to: none

environment:
  sdk: ^3.12.0

dependencies:
  # Servidor HTTP componível mantido pelo time do Dart.
  shelf: ^1.4.2
  # Roteador de requisições para o shelf.
  shelf_router: ^1.1.4
  # Leitura de variáveis de ambiente a partir de arquivos .env.
  dotenv: ^4.2.0
  # Driver MySQL nativo, com pool de conexões e prepared statements.
  mysql_dart: ^3.0.0

dev_dependencies:
  test: ^1.25.0
  lints: ^5.0.0
```

<aside class="positive">

**No mercado: por que shelf e não um framework completo.** Dart tem alternativas de mais alto nível, como Dart Frog e Serverpod, que geram rotas e clientes automaticamente. Elas são produtivas, mas escondem o HTTP. Em disciplinas de *back end* e em entrevistas técnicas, o que se cobra é justamente o que fica escondido: o que é um *middleware*, quando usar 201 em vez de 200, o que muda entre PUT e PATCH. O `shelf` é a base sobre a qual esses outros projetos são construídos, então aprender com ele transfere conhecimento para qualquer um dos outros.

</aside>

### Estrutura de pastas

Antes de escrever a primeira linha, vale fixar onde cada coisa vai morar. A estrutura a seguir será construída ao longo do texto, arquivo por arquivo.

**Estrutura do projeto**

```text
terrario_api/
├── bin/
│   └── server.dart                      # ponto de entrada: lê a configuração e sobe o servidor
├── lib/
│   └── src/
│       ├── api.dart                     # monta o roteador e a pilha de middlewares
│       ├── config/
│       │   ├── env.dart                 # leitura tipada de variáveis de ambiente
│       │   ├── app_config.dart          # configuração validada da aplicação
│       │   └── database.dart            # criação do pool de conexões MySQL
│       ├── core/
│       │   └── erros.dart               # exceções de domínio
│       ├── models/
│       │   └── terrario.dart            # entidade e conversões de/para JSON
│       ├── repositories/
│       │   ├── terrario_repository.dart         # contrato de persistência
│       │   └── mysql_terrario_repository.dart   # implementação em MySQL
│       ├── services/
│       │   └── terrario_service.dart    # regras de negócio e validação
│       ├── controllers/
│       │   ├── terrario_controller.dart # tradução HTTP <-> domínio
│       │   ├── health_controller.dart
│       │   └── docs_controller.dart     # Swagger UI e contrato
│       └── web/
│           ├── middlewares.dart         # log, CORS, JSON, tratamento de erros
│           ├── problem.dart             # respostas de erro no padrão problem+json
│           └── links.dart               # construção dos links de hipermídia
├── docker/
│   └── mysql/init/01-schema.sql         # schema e carga inicial do banco
├── scripts/
│   └── up.sh                            # sobe todo o ambiente
├── web/
│   └── docs/index.html                  # página que carrega o Swagger UI
├── test/
│   └── terrario_service_test.dart       # testes da regra de negócio
├── .dockerignore
├── .env                                 # valores locais, fora do controle de versão
├── .env.example                         # modelo versionado, sem segredos
├── .gitignore
├── Dockerfile
├── compose.yaml
├── openapi.yaml                         # contrato da API
└── pubspec.yaml
```

### Análise estática

O pacote `lints` traz o conjunto de regras recomendado pelo time do Dart. Ativá-lo desde o primeiro dia evita discussões de estilo e captura erros reais.

**analysis_options.yaml**

```yaml
include: package:lints/recommended.yaml

analyzer:
  language:
    strict-casts: true # proíbe conversões implícitas a partir de dynamic
    strict-raw-types: true # exige parâmetros de tipo explícitos

linter:
  rules:
    - prefer_final_locals
    - avoid_print # em servidor, use log estruturado, não print
    - always_declare_return_types
    - unawaited_futures # Futures esquecidos são bugs silenciosos
```

**Terminal — rodando o analisador**

```text
$ dart analyze
Analyzing terrario_api...
No issues found!
```

<aside class="positive">

**Boa prática:** rode `dart analyze` e `dart format .` antes de cada *commit*. Em projetos reais isso vira uma etapa obrigatória da esteira de integração contínua, e código que não passa não entra na *branch* principal.

</aside>

## Configuração por variáveis de ambiente
Duration: 15:00

### Por que não deixar valores fixos no código

Uma aplicação precisa saber em qual porta ouvir, onde está o banco, qual a senha do banco, se deve logar em modo verboso. Esses valores mudam entre a máquina do desenvolvedor, o servidor de homologação e o de produção — mas o código é exatamente o mesmo nos três lugares.

A terceira regra da metodologia *Twelve-Factor App* resume a solução: configuração é tudo o que varia entre implantações, e deve viver no **ambiente**, não no código. A consequência prática é que a mesma imagem Docker construída uma única vez pode ser promovida de homologação para produção sem recompilar nada, como ilustra a figura mais abaixo.

> **Twelve-Factor App**
>
> Conjunto de doze recomendações publicado em 2011 por engenheiros da Heroku, a partir da observação de centenas de aplicações rodando na nuvem deles. O documento descreve como escrever software que sobe em qualquer ambiente sem adaptação manual. Além da configuração no ambiente (fator III), quatro outros fatores aparecem diretamente neste codelab:
>
> * **II — dependências declaradas:** o `pubspec.yaml` lista tudo o que o projeto precisa, e nada é assumido como já instalado na máquina;
> * **IV — serviços de apoio:** o banco é um recurso externo endereçado por configuração, então trocar o MySQL local pelo de produção é mudar uma variável, não o código;
> * **VI — processos sem estado:** nada é guardado em memória entre requisições, o que permite rodar várias cópias da API atrás de um balanceador;
> * **IX — descartabilidade:** o processo sobe rápido e encerra de forma graciosa ao receber SIGTERM, tratado no passo "Montando a aplicação e o servidor completo".
>
> Nem toda aplicação precisa dos doze fatores, e alguns envelheceram. Mas os citados acima são exatamente o que separa um projeto que roda em contêiner de um que roda *apenas na máquina de quem o escreveu*.

![Diagrama: três origens de configuração (arquivo .env na máquina do desenvolvedor, environment do Docker Compose e cofre de segredos na nuvem/produção) alimentam o ambiente do processo, cujas variáveis são lidas no boot e validadas para formar o AppConfig, um objeto validado e imutável; mesma imagem, ambientes diferentes](img/fig-02.webp)

*As três origens de configuração alimentam o mesmo ambiente de processo; o código lê uma única vez, valida e nunca mais consulta variáveis soltas.*

### Os arquivos .env e .env.example

O arquivo `.env` guarda os valores da máquina local e **nunca** entra no controle de versão. Ao lado dele fica o `.env.example`, que é versionado, tem as mesmas chaves e valores fictícios. Quem clona o repositório copia um para o outro e preenche.

Crie os dois arquivos **na raiz do projeto**, no mesmo nível do `pubspec.yaml`. As senhas abaixo são de exemplo e servem para o ambiente local — mais adiante elas serão usadas também para criar o usuário do banco dentro do contêiner, então os valores precisam ser exatamente os mesmos nos dois lugares.

**.env**

```ini
# ---- Aplicação ----
APP_ENV=development
SERVER_PORT=8080
LOG_LEVEL=debug

# ---- Banco de dados ----
# 3307 é a porta publicada na sua máquina pelo contêiner do MySQL.
# Escolhemos 3307 e não 3306 porque a 3306 costuma já estar ocupada
# por uma instalação local do MySQL.
DB_HOST=127.0.0.1
DB_PORT=3307
DB_NAME=terrarios
DB_USER=terrario_app
DB_PASSWORD=terrario-dev-2026
DB_POOL_SIZE=10

# ---- Credenciais administrativas do contêiner MySQL ----
MYSQL_ROOT_PASSWORD=root-dev-2026
```

**.env.example**

```ini
APP_ENV=development
SERVER_PORT=8080
LOG_LEVEL=debug

DB_HOST=127.0.0.1
DB_PORT=3307
DB_NAME=terrarios
DB_USER=terrario_app
DB_PASSWORD=defina-uma-senha
DB_POOL_SIZE=10

MYSQL_ROOT_PASSWORD=defina-uma-senha-de-root
```

**.gitignore**

```text
# Dependências e artefatos do Dart
.dart_tool/
build/
pubspec.lock

# Configuração local com segredos
.env

# Editores
.idea/
.vscode/
```

<aside class="negative">

**O que acontece com essas senhas.** Elas ainda não configuram nada: são apenas texto em um arquivo. No passo "O banco MySQL em um contêiner" a imagem oficial do MySQL vai ler `DB_USER` e `DB_PASSWORD` e criar o usuário do banco com essas credenciais, e o `MYSQL_ROOT_PASSWORD` virará a senha do administrador.

O detalhe que mais causa dor de cabeça: isso acontece **uma única vez**, na primeira inicialização do banco, enquanto o diretório de dados estiver vazio. Trocar a senha no `.env` depois disso não altera o banco — ele continua com a antiga, e a API passa a receber erro de autenticação. Para valer, é preciso destruir os dados com `docker compose down -v` (ou `docker volume rm`) e deixar o banco ser criado de novo. Escolha as senhas agora e não as mude sem esse passo.

</aside>

<aside class="negative">

**Atenção:** um `.env` vazado é um incidente de segurança. Adicione-o ao `.gitignore` antes do primeiro *commit*: uma vez que o arquivo entra no histórico do Git, removê-lo do último *commit* não o apaga dos anteriores, e a senha precisa ser rotacionada.

</aside>

### Lendo variáveis com o pacote dotenv

O pacote `dotenv` lê o arquivo e, quando construído com `includePlatformEnvironment: true`, também enxerga as variáveis reais do processo. Isso é exatamente o comportamento desejado: em desenvolvimento os valores vêm do arquivo; dentro do contêiner, onde o `.env` não existe, vêm do ambiente injetado pelo Compose. O mesmo código atende aos dois casos.

Em vez de espalhar chamadas ao dicionário pelo projeto inteiro, concentra-se o acesso em uma classe com métodos tipados que falham cedo quando algo obrigatório está faltando.

Crie a pasta `lib/src/config/` e, dentro dela, o arquivo `env.dart` com o conteúdo abaixo.

**lib/src/config/env.dart**

```dart
import 'package:dotenv/dotenv.dart';

/// Ponto único de leitura de variáveis de ambiente.
///
/// A instância de [DotEnv] é criada uma única vez, de forma preguiçosa, na
/// primeira leitura. Quando o arquivo `.env` não existe — situação normal
/// dentro de um contêiner — o pacote simplesmente não carrega nada e as
/// variáveis reais do processo continuam disponíveis.
class Env {
  Env._();

  static final DotEnv _env = DotEnv(includePlatformEnvironment: true)..load();

  /// Lê uma variável obrigatória. Lança [StateError] se ela estiver ausente
  /// ou vazia, interrompendo a inicialização em vez de deixar o servidor
  /// subir com configuração incompleta.
  static String obrigatoria(String chave) {
    final valor = _env[chave];
    if (valor == null || valor.trim().isEmpty) {
      throw StateError('Variável de ambiente obrigatória ausente: $chave');
    }
    return valor.trim();
  }

  /// Lê uma variável opcional, devolvendo [padrao] quando ela não existe.
  static String opcional(String chave, String padrao) {
    final valor = _env[chave];
    return (valor == null || valor.trim().isEmpty) ? padrao : valor.trim();
  }

  /// Lê um inteiro, recusando valores que não sejam numéricos.
  static int inteiro(String chave, int padrao) {
    final bruto = _env[chave];
    if (bruto == null || bruto.trim().isEmpty) return padrao;
    final valor = int.tryParse(bruto.trim());
    if (valor == null) {
      throw StateError('A variável $chave deve ser um número inteiro: "$bruto"');
    }
    return valor;
  }
}
```

## Um objeto de configuração validado
Duration: 10:00

Ler variáveis soltas ao longo do código traz dois problemas: erros de digitação só aparecem quando aquela linha específica executa, e não há um lugar único para inspecionar a configuração efetiva. A solução é montar, logo no início da execução, um objeto imutável que carrega tudo já validado.

Crie o arquivo `app_config.dart` na mesma pasta `lib/src/config/`.

**lib/src/config/app_config.dart**

```dart
import 'env.dart';

/// Configuração da aplicação, resolvida uma única vez durante o boot.
class AppConfig {
  const AppConfig({
    required this.appEnv,
    required this.serverPort,
    required this.logLevel,
    required this.dbHost,
    required this.dbPort,
    required this.dbName,
    required this.dbUser,
    required this.dbPassword,
    required this.dbPoolSize,
  });

  final String appEnv;
  final int serverPort;
  final String logLevel;

  final String dbHost;
  final int dbPort;
  final String dbName;
  final String dbUser;
  final String dbPassword;
  final int dbPoolSize;

  /// Verdadeiro quando a aplicação roda em produção; usado para decidir
  /// o nível de detalhe das mensagens de erro devolvidas ao cliente.
  bool get producao => appEnv == 'production';

  /// Constrói a configuração a partir do ambiente e valida os limites.
  ///
  /// `factory` é um construtor que não é obrigado a criar uma instância nova:
  /// ele executa código antes de devolver o objeto e pode retornar um valor
  /// de cache, uma subclasse ou, como aqui, lançar exceção se algo estiver
  /// errado. Um construtor comum não permite nada disso, porque seu corpo só
  /// roda depois que o objeto já existe.
  factory AppConfig.fromEnv() {
    final config = AppConfig(
      appEnv: Env.opcional('APP_ENV', 'development'),
      serverPort: Env.inteiro('SERVER_PORT', 8080),
      logLevel: Env.opcional('LOG_LEVEL', 'info'),
      dbHost: Env.obrigatoria('DB_HOST'),
      dbPort: Env.inteiro('DB_PORT', 3306),
      dbName: Env.obrigatoria('DB_NAME'),
      dbUser: Env.obrigatoria('DB_USER'),
      dbPassword: Env.obrigatoria('DB_PASSWORD'),
      dbPoolSize: Env.inteiro('DB_POOL_SIZE', 10),
    );

    if (config.serverPort < 1 || config.serverPort > 65535) {
      throw StateError('SERVER_PORT fora da faixa válida: ${config.serverPort}');
    }
    if (config.dbPoolSize < 1) {
      throw StateError('DB_POOL_SIZE deve ser pelo menos 1.');
    }
    return config;
  }

  /// Representação segura para log: a senha nunca é impressa.
  @override
  String toString() =>
      'AppConfig(appEnv: $appEnv, serverPort: $serverPort, '
      'db: $dbUser@$dbHost:$dbPort/$dbName, pool: $dbPoolSize)';
}
```

<aside class="positive">

**Boa prática: falhe cedo e alto.** Repare que `AppConfig.fromEnv()` lança exceção se algo obrigatório faltar. Um servidor que sobe com configuração incompleta e só quebra na primeira requisição do usuário é muito pior do que um servidor que se recusa a subir: o segundo caso é detectado pela esteira de implantação, o primeiro é detectado pelo cliente.

</aside>

<aside class="negative">

**Atenção: nunca logue segredos.** O `toString()` acima omite deliberadamente a senha. Logs vão para arquivos, para agregadores e para o terminal de quem estiver ajudando a depurar. Senhas, *tokens* e chaves de API não podem aparecer neles.

</aside>

### Testando antes de seguir

Vale conferir se a leitura das variáveis funciona antes de escrever qualquer outra coisa. Abra o `bin/server.dart` e **substitua** o conteúdo gerado pelo `dart create` por este teste temporário.

**bin/server.dart — provisório**

```dart
import 'dart:io';

import 'package:terrario_api/src/config/app_config.dart';

void main() {
  final config = AppConfig.fromEnv();
  // stdout.writeln em vez de print: a regra avoid_print, ativada no
  // analysis_options.yaml, existe justamente para lembrar que servidores
  // devem escrever em saídas controladas.
  stdout.writeln(config);
  stdout.writeln('Porta lida: ${config.serverPort}');
}
```

**Terminal — conferindo**

```text
$ dart run bin/server.dart
AppConfig(appEnv: development, serverPort: 8080,
    db: terrario_app@127.0.0.1:3307/terrarios, pool: 10)
Porta lida: 8080
```

Agora vale provocar uma falha de propósito: comente a linha `DB_HOST` no `.env` e execute de novo.

**Terminal — a falha esperada**

```text
$ dart run bin/server.dart
Unhandled exception:
Bad state: Variável de ambiente obrigatória ausente: DB_HOST
```

É exatamente o comportamento desejado: o processo se recusa a existir com configuração incompleta. Descomente a linha, confirme que voltou a funcionar e siga em frente — o conteúdo provisório do `server.dart` será substituído no próximo passo.

<aside class="positive">

**Boa prática: teste cada peça assim que ela nasce.** Escrever cinco arquivos e só então executar transforma qualquer erro em uma caça ao tesouro. Rodar depois de cada peça isola o problema no trecho que acabou de ser digitado. Esse ciclo curto será repetido ao longo de todo o codelab.

</aside>

## O primeiro servidor HTTP
Duration: 10:00

### Handlers, middlewares e pipelines

O `shelf` tem apenas três conceitos, e entendê-los resolve praticamente tudo o que vem depois.

> **Os três conceitos do shelf**
>
> **Handler** é uma função que recebe um `Request` e devolve um `Response` (possivelmente de forma assíncrona). **Middleware** é uma função que recebe um *handler* e devolve outro *handler*, acrescentando comportamento antes ou depois. **Pipeline** é o encadeamento de vários *middlewares* terminando em um *handler*.

A requisição desce pela pilha de *middlewares* até o *handler* final e a resposta sobe pelo mesmo caminho, na ordem inversa, conforme ilustra a figura abaixo. É o mesmo padrão dos filtros do Java EE ou dos *middlewares* do Express.

![Pilha de camadas empilhadas de cima para baixo: log de acesso, CORS, tratamento de erros, cabeçalhos JSON e Router → Controller; uma seta à esquerda indica a Request descendo e uma seta à direita indica a Response subindo](img/fig-03.webp)

*A requisição atravessa a pilha de cima para baixo; a resposta retorna de baixo para cima, permitindo que cada camada observe ou altere ambas.*

### Subindo o servidor

**Substitua** todo o conteúdo do `bin/server.dart` — que agora tem o teste provisório do passo anterior — pelo código a seguir, que faz apenas o essencial: carrega a configuração, monta um *handler* que responde qualquer coisa e escuta na porta definida no `.env`.

**bin/server.dart**

```dart
import 'dart:io';

import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;
import 'package:terrario_api/src/config/app_config.dart';

// `Future<T>` é o equivalente em Dart à Promise do JavaScript: um valor que
// ainda não chegou. `async` marca a função que devolve um Future e `await`
// pausa a execução até ele completar, exatamente como no JavaScript.
Future<void> main() async {
  // Resolve e valida toda a configuração antes de abrir qualquer porta.
  final config = AppConfig.fromEnv();

  Response handler(Request request) {
    return Response.ok('API de Terrarios no ar\n');
  }

  // InternetAddress.anyIPv4 (0.0.0.0) é obrigatório dentro de contêineres:
  // ouvir apenas em localhost tornaria o servidor inacessível de fora dele.
  final servidor = await shelf_io.serve(
    handler,
    InternetAddress.anyIPv4,
    config.serverPort,
  );

  stdout.writeln('Servidor ouvindo em http://localhost:${servidor.port}');
  stdout.writeln(config);
}
```

<aside class="negative">

**Atenção: o erro clássico do primeiro deploy.** Trocar `InternetAddress.anyIPv4` por `'localhost'` funciona perfeitamente na máquina do desenvolvedor e falha silenciosamente dentro do contêiner. Ouvindo em `127.0.0.1`, o processo só aceita conexões originadas do próprio contêiner, e o mapeamento de portas do Docker nunca alcança o servidor.

</aside>

Como o `.env` ainda aponta para um banco que não existe, mas a configuração apenas guarda os valores sem conectar, o servidor sobe normalmente.

**Terminal — executando**

```text
$ dart run bin/server.dart
Servidor ouvindo em http://localhost:8080
AppConfig(appEnv: development, serverPort: 8080,
            db: terrario_app@127.0.0.1:3307/terrarios, pool: 10)
```

Em outro terminal, a verificação:

**Terminal — testando com curl**

```text
$ curl -i http://localhost:8080/qualquer/coisa
HTTP/1.1 200 OK
date: Mon, 01 Sep 2026 12:00:00 GMT
content-length: 24
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff

API de Terrarios no ar
```

Repare que qualquer caminho devolve a mesma resposta: não há roteamento ainda, e o servidor ignora completamente o verbo e a URI. Esse comportamento não é um detalhe de implementação incompleta — ele descreve com precisão o **nível zero** do modelo de maturidade que será estudado a seguir.

<aside class="positive">

**A flag `-i` do curl.** Ao longo do codelab o `curl` aparece quase sempre com `-i`, que imprime os cabeçalhos junto com o corpo. Em uma API REST, metade da informação está nos cabeçalhos e no código de status; olhar só o corpo esconde exatamente o que se quer aprender.

</aside>

## O modelo de maturidade de Richardson: níveis 0 e 1
Duration: 8:00

Nem toda API que fala JSON sobre HTTP é RESTful. Leonard Richardson propôs em 2008 uma escada de quatro degraus, reproduzida na figura abaixo, que mede o quanto uma interface aproveita os mecanismos que o próprio HTTP já oferece. Martin Fowler popularizou o modelo em 2010 e desde então ele virou vocabulário comum em revisões de arquitetura.

![Escada de quatro degraus: Nível 0, um único endpoint, HTTP como túnel; Nível 1, recursos, cada coisa tem sua própria URI; Nível 2, verbos HTTP e códigos de status corretos; Nível 3, hipermídia, a resposta diz o que fazer a seguir; uma seta no topo indica que o acoplamento entre cliente e servidor diminui a cada degrau](img/fig-04.webp)

*Os quatro degraus do modelo de maturidade de Richardson.*

### Nível 0 — HTTP como túnel

No degrau mais baixo, ilustrado na figura a seguir, existe um único endereço, geralmente acessado sempre com POST, e o corpo da mensagem carrega o nome da operação. O HTTP não passa de um meio de transporte: seus verbos, códigos de status e cabeçalhos são ignorados. É o modelo dos antigos serviços SOAP e de boa parte das APIs internas improvisadas.

![O cliente envia sempre POST para uma única URI /servico, e a operação vai no corpo: listarTerrarios, buscarTerrario, criarTerrario, atualizarTerrario ou excluirTerrario](img/fig-05.webp)

*Nível 0: uma única URI e um único verbo; a semântica inteira está escondida dentro do corpo da mensagem.*

**Requisição**

```text
POST /servico HTTP/1.1
Content-Type: application/json

{"operacao": "buscarTerrario", "id": 7}
```

**Resposta**

```text
HTTP/1.1 200 OK
Content-Type: application/json

{"status": "ok", "dados": {"id": 7, "apelido": "Vale das Samambaias"}}
```

Um erro nesse modelo também chega com 200, porque o código de status descreve o transporte e não o resultado da operação:

**Resposta de erro no nível 0**

```text
HTTP/1.1 200 OK
Content-Type: application/json

{"status": "erro", "mensagem": "Terrario nao encontrado"}
```

<aside class="negative">

**Atenção:** devolver 200 para uma falha quebra toda a infraestrutura intermediária. Caches, *proxies*, balanceadores, ferramentas de monitoramento e bibliotecas de cliente decidem o que fazer olhando o código de status. Se ele mente, o painel de observabilidade mostrará cem por cento de sucesso enquanto os usuários reclamam.

</aside>

### Nível 1 — recursos

O primeiro salto é dar identidade própria a cada coisa do domínio. Em vez de um endereço único, cada terrário ganha sua URI, como na figura abaixo. O verbo ainda pode continuar sendo sempre POST, mas o endereço já carrega informação.

![O cliente envia POST para três URIs diferentes: /terrarios, /terrarios/7 e /terrarios/7/excluir](img/fig-06.webp)

*Nível 1: existem recursos, mas a ação ainda aparece na URI e o verbo continua sendo sempre o mesmo.*

**Requisições no nível 1**

```text
POST /terrarios/7 HTTP/1.1

POST /terrarios/7/excluir HTTP/1.1
```

O sintoma característico do nível 1 é a URI com verbo: `/terrarios/7/excluir`, `/criarTerrario`, `/atualizarUmidade`. URIs devem nomear **coisas**, não ações — a ação é responsabilidade do método HTTP.

## Níveis 2 e 3: verbos, status e HATEOAS
Duration: 12:00

### Nível 2 — verbos e códigos de status

Aqui o HTTP passa a ser usado como foi projetado. O conjunto de verbos é fixo e cada um tem uma semântica bem definida, incluindo propriedades que os intermediários da rede podem explorar. A figura mais abaixo mostra como recurso e verbo se combinam para determinar cada operação.

> **Segurança e idempotência**
>
> Um método é **seguro** quando não altera o estado do servidor: GET, HEAD e OPTIONS. Um método é **idempotente** quando repeti-lo produz o mesmo efeito de executá-lo uma única vez: GET, PUT e DELETE são idempotentes; POST não é. Essa distinção é o que permite a um cliente reexecutar com segurança um PUT após uma falha de rede, mas não um POST.

![Matriz de recursos por verbos: em /terrarios, GET devolve 200 lista, POST devolve 201 cria, PUT e DELETE devolvem 405; em /terrarios/7, GET devolve 200 ou 404, POST devolve 405, PUT devolve 200 altera e DELETE devolve 204 remove](img/fig-07.webp)

*Nível 2: a combinação de recurso e verbo determina a operação, e o código de status comunica o resultado.*

**Requisição**

```text
POST /api/v1/terrarios HTTP/1.1
Content-Type: application/json

{"apelido": "Vale das Samambaias", "bioma": "tropical",
 "umidadeAlvo": 85, "volumeLitros": 12.5, "dataMontagem": "2026-03-14"}
```

**Resposta**

```text
HTTP/1.1 201 Created
Location: /api/v1/terrarios/7
Content-Type: application/json

{"id": 7, "apelido": "Vale das Samambaias", "bioma": "tropical",
 "umidadeAlvo": 85, "volumeLitros": 12.5, "dataMontagem": "2026-03-14"}
```

**Requisição**

```text
GET /api/v1/terrarios/999 HTTP/1.1
```

**Resposta**

```text
HTTP/1.1 404 Not Found
Content-Type: application/problem+json

{"type": "https://api.terrarios.local/erros/nao-encontrado",
 "title": "Recurso nao encontrado",
 "status": 404,
 "detail": "Nao existe terrario com id 999."}
```

**Códigos de status mais usados em uma API REST**

| Código | Nome | Quando usar |
| --- | --- | --- |
| 200 | OK | Leitura ou atualização bem-sucedida com corpo na resposta. |
| 201 | Created | Recurso criado; envie também o cabeçalho `Location`. |
| 204 | No Content | Sucesso sem corpo, típico de DELETE. |
| 400 | Bad Request | JSON malformado ou campo com tipo errado. |
| 404 | Not Found | O recurso identificado pela URI não existe. |
| 405 | Method Not Allowed | A URI existe, mas não aceita aquele verbo. |
| 409 | Conflict | Viola uma regra de unicidade ou estado atual. |
| 415 | Unsupported Media Type | `Content-Type` diferente do esperado. |
| 422 | Unprocessable Content | Sintaxe válida, mas semântica inválida. |
| 500 | Internal Server Error | Falha inesperada; nunca vaze a pilha de erro. |

<aside class="positive">

**Boa prática: 400 ou 422?** Use 400 quando o servidor não conseguiu sequer interpretar a requisição — JSON quebrado, campo numérico contendo texto. Use 422 quando a requisição foi entendida perfeitamente mas viola uma regra de negócio, como uma umidade-alvo de 130%. A distinção ajuda o cliente a decidir se deve corrigir o formato ou o conteúdo.

</aside>

### Nível 3 — HATEOAS

O último degrau é o menos implementado e o mais mal compreendido. HATEOAS é a sigla de *Hypermedia as the Engine of Application State*: a resposta não carrega apenas dados, carrega também os links para as próximas transições possíveis.

> **HATEOAS**
>
> Restrição do REST segundo a qual o cliente navega pela aplicação seguindo links fornecidos pelo servidor, em vez de construir URIs a partir de regras memorizadas. O cliente precisa conhecer apenas um endereço inicial e o significado dos nomes de relação (`self`, `next`, `edit`), exatamente como um navegador precisa conhecer apenas o endereço de uma página e o significado da tag de âncora.

A figura mais abaixo mostra essa navegação. A analogia com a web humana é literal. Ninguém decora que o botão de excluir de um sistema fica em `/admin/registro/482/remover`: a pessoa abre a página, vê o link e clica. Se a equipe mudar a rota amanhã, o link muda junto e nada quebra. HATEOAS traz esse mesmo desacoplamento para clientes programáticos.

**Requisição**

```text
GET /api/v1/terrarios/7 HTTP/1.1
```

**Resposta — a representação descreve as transições possíveis**

```text
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 7,
  "apelido": "Vale das Samambaias",
  "bioma": "tropical",
  "umidadeAlvo": 85,
  "volumeLitros": 12.5,
  "dataMontagem": "2026-03-14",
  "_links": {
    "self":       {"href": "/api/v1/terrarios/7", "method": "GET"},
    "edit":       {"href": "/api/v1/terrarios/7", "method": "PUT"},
    "delete":     {"href": "/api/v1/terrarios/7", "method": "DELETE"},
    "collection": {"href": "/api/v1/terrarios",   "method": "GET"}
  }
}
```

O ganho fica evidente quando os links são **condicionais**. Um terrário lacrado para observação não pode ser editado; a resposta simplesmente não traz a relação `edit`. O cliente não precisa reimplementar a regra de negócio para decidir se mostra ou não o botão: basta perguntar se o link existe.

![Navegação por hipermídia: do ponto de entrada GET /api/v1 a relação terrarios leva à coleção /terrarios, de onde a relação item leva a /terrarios/7; da coleção sai a relação next para a página 2, do item sai a relação edit (PUT) e a relação collection volta do item para a coleção](img/fig-08.webp)

*Com hipermídia o cliente parte de um único endereço conhecido e descobre todo o resto seguindo relações nomeadas.*

## Formatos de hipermídia
Duration: 8:00

Colocar links na resposta é a ideia; onde colocá-los e como nomeá-los é a parte que já foi padronizada. Três formatos disputam esse espaço, e conhecê-los evita reinventar convenções.

**HAL** (*Hypertext Application Language*) é o mais simples e o mais adotado. Ele reserva duas chaves: `_links` para as relações e `_embedded` para recursos aninhados que vieram junto para poupar requisições. O restante do objeto são os dados, sem envelope. É o formato que este codelab segue.

**Exemplo em HAL**

```json
{
  "id": 7,
  "apelido": "Vale das Samambaias",
  "_links": {
    "self":       {"href": "/api/v1/terrarios/7"},
    "collection": {"href": "/api/v1/terrarios"}
  }
}
```

**JSON:API** é bem mais prescritivo: define envelope obrigatório, separa `type` de `id`, isola os campos em `attributes` e trata relacionamentos como cidadãos de primeira classe. Em troca da rigidez, entrega convenções prontas para filtro, ordenação, paginação e inclusão de recursos relacionados — decisões que, em HAL, cada equipe toma sozinha.

**Exemplo em JSON:API**

```json
{
  "data": {
    "type": "terrarios",
    "id": "7",
    "attributes": {
      "apelido": "Vale das Samambaias",
      "bioma": "tropical"
    },
    "relationships": {
      "especies": {"links": {"related": "/api/v1/terrarios/7/especies"}}
    },
    "links": {"self": "/api/v1/terrarios/7"}
  }
}
```

**Siren** vai além dos links e descreve **ações**: além de dizer para onde ir, informa o verbo, o tipo de conteúdo e quais campos o formulário deve enviar. É o formato que mais se aproxima de uma interface autodescritiva, e também o menos usado — sua complexidade só compensa quando o cliente é genérico e precisa montar telas sem conhecer o domínio.

**Exemplo em Siren**

```json
{
  "class": ["terrario"],
  "properties": {"id": 7, "apelido": "Vale das Samambaias"},
  "actions": [{
    "name": "atualizar",
    "method": "PUT",
    "href": "/api/v1/terrarios/7",
    "type": "application/json",
    "fields": [
      {"name": "apelido", "type": "text"},
      {"name": "umidadeAlvo", "type": "number"}
    ]
  }],
  "links": [{"rel": ["self"], "href": "/api/v1/terrarios/7"}]
}
```

**Comparação entre os formatos de hipermídia**

|  | HAL | JSON:API | Siren |
| --- | --- | --- | --- |
| Chave dos links | `_links` | `links` | `links` |
| Envelope | não | sim (`data`) | sim (`properties`) |
| Descreve ações | não | não | sim, com campos |
| Relacionamentos | por link | seção própria | por link |
| Tipo de mídia | `application/hal+json` | `application/vnd.api+json` | `application/vnd.siren+json` |
| Curva de adoção | baixa | média | alta |
| Quando escolher | APIs internas e projetos pequenos | APIs públicas com muitos relacionamentos | clientes genéricos que montam telas sozinhos |

<aside class="positive">

**No mercado: hipermídia no mundo real.** A API do GitHub é o exemplo público mais conhecido de nível 3 parcial. Ela não segue HAL nem JSON:API: adota uma convenção própria em que cada relação vira um campo terminado em `_url`, como mostra a resposta abaixo. Note os *templates* entre chaves — `{/number}` indica ao cliente que ali cabe um segmento opcional, seguindo a RFC 6570.

Na prática, a maioria das APIs corporativas para no nível 2 e adota apenas dois elementos de hipermídia: o `self` e os links de paginação. É exatamente por isso que vale conhecer o modelo inteiro — para escolher conscientemente onde parar, em vez de parar por desconhecimento.

</aside>

**GET https://api.github.com/repos/dart-lang/sdk — 200 OK**

```json
{
  "id": 1666178,
  "full_name": "dart-lang/sdk",
  "url":          "https://api.github.com/repos/dart-lang/sdk",
  "issues_url":   "https://api.github.com/.../issues{/number}",
  "commits_url":  "https://api.github.com/.../commits{/sha}",
  "releases_url": "https://api.github.com/.../releases{/id}"
}
```

A API do GitHub aplicando hipermídia com convenção própria: cada relação disponível é entregue como um endereço pronto na própria resposta. Os campos terminados em `_url` são os controles de hipermídia: o cliente segue esses endereços em vez de montá-los.

**Resumo comparativo dos níveis**

|  | URIs | Verbos | O cliente precisa |
| --- | --- | --- | --- |
| Nível 0 | Uma só | Um só (POST) | conhecer o catálogo de operações |
| Nível 1 | Uma por recurso | Um só | montar URIs por regra |
| Nível 2 | Uma por recurso | Todos, com semântica | montar URIs por regra |
| Nível 3 | Uma por recurso | Todos, com semântica | conhecer só a raiz e os nomes de relação |

## Arquitetura em camadas e o modelo de domínio
Duration: 15:00

### Por que separar

Um *handler* que lê o corpo da requisição, valida os campos, monta o SQL, converte o resultado e devolve JSON funciona — em cinquenta linhas. O problema aparece na sexta rota: a validação está duplicada, a regra de negócio só pode ser testada subindo um servidor HTTP e trocar o MySQL por outro banco significa reescrever tudo.

A separação em camadas resolve isso atribuindo uma única responsabilidade a cada uma e controlando a direção das dependências, como mostra a figura abaixo.

![Camadas empilhadas: Controller traduz HTTP em chamadas de domínio (lê parâmetros, serializa JSON, escolhe o código de status) e depende do Service, que contém regras de negócio e validação e não sabe o que é uma requisição HTTP; o Service depende do Repository, que fala SQL com o banco e devolve objetos de domínio; abaixo está o MySQL, e ao lado o Model Terrario, usado pelas camadas](img/fig-10.webp)

*As dependências apontam sempre para baixo: o controlador conhece o serviço, o serviço conhece o repositório, e nenhuma camada conhece a de cima.*

> **Inversão de dependência**
>
> O serviço não depende da classe concreta que fala com o MySQL: ele depende de uma **interface** de repositório. Quem decide qual implementação será usada é o ponto de montagem da aplicação. Isso permite substituir o banco por uma implementação em memória durante os testes sem alterar uma linha da regra de negócio.

<aside class="positive">

**O nome muda; os objetivos, não.** Arquitetura em camadas, arquitetura hexagonal (*ports and adapters*), *onion*, arquitetura limpa: os desenhos mudam, o vocabulário muda, a quantidade de círculos concêntricos muda. O que nenhuma delas altera são os objetivos que estão sendo perseguidos, sempre os mesmos quatro:

* **alta coesão** — cada módulo trata de um assunto só;
* **baixo acoplamento** — mudar um módulo não obriga a mudar os outros;
* **reusabilidade** — o que não depende do contexto pode ser aproveitado em outro;
* **manutenibilidade** — quem chegar depois consegue entender e alterar sem medo.

Esses princípios não nasceram com nenhuma dessas siglas. Eles são discutidos e aplicados desde o início da década de 1970, quando David Parnas defendeu que a decomposição de um sistema deve esconder as decisões mais sujeitas a mudança, e quando Larry Constantine e Edward Yourdon estabeleceram coesão e acoplamento como os critérios para avaliar um projeto de software. As arquiteturas nomeadas são receitas para chegar lá — úteis, mas substituíveis. Os objetivos, não.

Vale o alerta na direção oposta: aplicar a receita inteira em um sistema pequeno produz camadas que apenas repassam chamadas, e isso **piora** a manutenibilidade em vez de melhorá-la. A pergunta certa nunca é *qual arquitetura usar*, e sim *quanta separação este problema justifica*.

</aside>

### O modelo de domínio

A entidade é uma classe imutável. Todos os campos são `final`, e alterar qualquer coisa produz um novo objeto através do método `copyWith`. Isso elimina toda uma classe de bugs em que um objeto é modificado por engano no meio do caminho.

Crie a pasta `lib/src/models/` e, dentro dela, o arquivo `terrario.dart`.

**lib/src/models/terrario.dart · parte 1 de 2**

```dart
/// Biomas aceitos pelo catálogo. O enum garante, em tempo de compilação,
/// que nenhum ponto do código invente um valor fora da lista.
enum Bioma {
  tropical,
  desertico,
  temperado,
  musgo;

  /// Converte o texto vindo do JSON ou do banco em um valor do enum.
  /// Devolve null quando o texto não corresponde a nenhum bioma conhecido,
  /// deixando a decisão sobre o erro para a camada de validação.
  static Bioma? porNome(String? nome) {
    if (nome == null) return null;
    final alvo = nome.trim().toLowerCase();
    for (final bioma in Bioma.values) {
      if (bioma.name == alvo) return bioma;
    }
    return null;
  }
}

/// Um terrário do catálogo.
class Terrario {
  const Terrario({
    this.id,
    required this.apelido,
    required this.bioma,
    required this.umidadeAlvo,
    required this.volumeLitros,
    required this.dataMontagem,
    this.criadoEm,
    this.atualizadoEm,
  });

  /// Nulo enquanto o terrário ainda não foi persistido.
  final int? id;
  final String apelido;
  final Bioma bioma;
  final int umidadeAlvo;
  final double volumeLitros;
  final DateTime dataMontagem;
  final DateTime? criadoEm;
  final DateTime? atualizadoEm;
```

O bloco acima deixa a classe aberta de propósito — ainda faltam o método que produz cópias alteradas e o que converte a entidade para JSON. **Continue digitando no mesmo arquivo**, logo abaixo da última linha, e a chave final fechará a classe. As duas primeiras linhas do bloco a seguir (os campos `criadoEm` e `atualizadoEm`) já estão no arquivo e servem apenas para indicar onde encaixar.

**lib/src/models/terrario.dart · parte 2 de 2**

```dart
  final DateTime? criadoEm;
  final DateTime? atualizadoEm;

  Terrario copyWith({
    int? id,
    String? apelido,
    Bioma? bioma,
    int? umidadeAlvo,
    double? volumeLitros,
    DateTime? dataMontagem,
  }) {
    return Terrario(
      id: id ?? this.id,
      apelido: apelido ?? this.apelido,
      bioma: bioma ?? this.bioma,
      umidadeAlvo: umidadeAlvo ?? this.umidadeAlvo,
      volumeLitros: volumeLitros ?? this.volumeLitros,
      dataMontagem: dataMontagem ?? this.dataMontagem,
      criadoEm: criadoEm,
      atualizadoEm: atualizadoEm,
    );
  }

  /// Representação enviada ao cliente. Datas viram texto ISO-8601 e o enum
  /// vira o seu nome, que é o formato documentado no contrato da API.
  Map<String, dynamic> toJson() => {
        'id': id,
        'apelido': apelido,
        'bioma': bioma.name,
        'umidadeAlvo': umidadeAlvo,
        'volumeLitros': volumeLitros,
        'dataMontagem': _somenteData(dataMontagem),
        'criadoEm': criadoEm?.toIso8601String(),
        'atualizadoEm': atualizadoEm?.toIso8601String(),
      };

  static String _somenteData(DateTime d) =>
      '${d.year.toString().padLeft(4, '0')}-'
      '${d.month.toString().padLeft(2, '0')}-'
      '${d.day.toString().padLeft(2, '0')}';
}
```

<aside class="positive">

**Boa prática:** o modelo não sabe nada sobre HTTP nem sobre SQL: ele não importa `shelf` nem `mysql_dart`. Essa ausência de importações é a verificação mais rápida de que a arquitetura em camadas está sendo respeitada.

</aside>

### Exceções de domínio

O serviço precisa sinalizar problemas sem saber que existe HTTP do outro lado. Ele lança exceções de domínio, e uma única camada — o *middleware* de erros — sabe traduzir cada tipo em um código de status.

Crie a pasta `lib/src/core/` e, dentro dela, o arquivo `erros.dart`.

**lib/src/core/erros.dart**

```dart
/// Classe base de todas as falhas previsíveis da aplicação.
sealed class ErroApp implements Exception {
  const ErroApp(this.mensagem);
  final String mensagem;

  @override
  String toString() => '$runtimeType: $mensagem';
}

/// O recurso pedido não existe. Vira 404.
class NaoEncontrado extends ErroApp {
  const NaoEncontrado(super.mensagem);
}

/// A requisição foi entendida, mas viola uma regra de negócio. Vira 422.
/// O mapa [campos] associa o nome de cada campo inválido à sua explicação,
/// permitindo que o formulário do cliente destaque exatamente o que corrigir.
class ErroValidacao extends ErroApp {
  const ErroValidacao(super.mensagem, [this.campos = const {}]);
  final Map<String, String> campos;
}

/// A operação conflita com o estado atual dos dados. Vira 409.
class Conflito extends ErroApp {
  const Conflito(super.mensagem);
}

/// O corpo enviado não pôde ser interpretado. Vira 400.
class RequisicaoInvalida extends ErroApp {
  const RequisicaoInvalida(super.mensagem);
}
```

<aside class="positive">

**`sealed` em Dart 3.** Declarar a classe base como `sealed` informa ao compilador que todas as subclasses estão no mesmo arquivo. Com isso, um `switch` sobre um `ErroApp` passa a ser verificado **exaustivamente**: se amanhã alguém criar um novo tipo de erro e esquecer de tratá-lo no *middleware*, o código nem compila.

</aside>

## Contêineres e Docker
Duration: 12:00

Daqui em diante o Docker aparece em quase todos os passos: primeiro para hospedar o banco, depois para empacotar a própria API. Vale entender o que ele é antes de digitar o primeiro comando.

### O problema

Uma aplicação nunca roda sozinha. Ela depende de uma versão específica da linguagem, de bibliotecas de sistema, de variáveis de ambiente, de um banco acessível em determinado endereço. Esse conjunto é o **ambiente de execução**, e historicamente ele era montado à mão em cada servidor, seguindo um documento que envelhecia mais rápido do que era lido.

O resultado é a frase mais conhecida da área: *na minha máquina funciona*. Ela não é desculpa de programador desleixado — é o sintoma correto de um problema real, o de que o ambiente onde o código foi escrito e o ambiente onde ele executa são construídos por processos diferentes e portanto divergem.

### Três gerações de implantação

A forma de resolver isso mudou duas vezes em vinte e cinco anos, e cada mudança atacou um desperdício da anterior.

![Três colunas comparando gerações: servidor físico (até os anos 2000), com aplicação, bibliotecas, sistema operacional e hardware, uma aplicação por máquina e provisionamento em semanas; máquinas virtuais (a partir de 2001), com VMs contendo SO convidado e app sobre um hipervisor, minutos para subir e gigabytes por VM; e contêineres (a partir de 2013), com contêineres de app e libs sobre o Docker Engine e o kernel do anfitrião compartilhado, segundos para subir e megabytes por imagem](img/fig-11.webp)

*A camada que some é o sistema operacional convidado: o contêiner usa o kernel do próprio anfitrião e empacota apenas a aplicação e suas bibliotecas.*

No modelo mais antigo, cada aplicação relevante ganhava seu próprio servidor. Isolamento total, mas desperdício igualmente total: comprava-se hardware dimensionado para o pico e ele passava a maior parte do tempo ocioso, e colocar um novo sistema no ar significava esperar semanas por compra, instalação e configuração.

A virtualização atacou esse desperdício. Um programa chamado **hipervisor** passa a emular hardware, e sobre ele rodam várias máquinas virtuais, cada uma com seu sistema operacional completo. A ocupação do hardware melhora muito, mas o preço é alto: cada máquina virtual carrega um sistema operacional inteiro — vários gigabytes de arquivos e alguns minutos de inicialização — só para executar um processo que talvez ocupe cinquenta megabytes.

O contêiner observa que essa duplicação é desnecessária. Se o anfitrião já tem um kernel Linux rodando, e a aplicação também precisa de um kernel Linux, por que carregar um segundo? A figura acima mostra exatamente a camada que desaparece. O contêiner empacota a aplicação e as bibliotecas de que ela depende, e usa o kernel que já está lá.

> **Contêiner**
>
> Um contêiner não é uma máquina pequena: é um **processo comum** do sistema operacional anfitrião, executando com uma visão restrita do mundo. Ele enxerga apenas o próprio sistema de arquivos, a própria rede e a própria lista de processos, e recebe um teto de CPU e memória. Do lado de fora, é apenas mais uma linha no `ps`.

### Como o isolamento funciona

Três mecanismos do kernel Linux sustentam essa ilusão, e nenhum deles foi criado pelo Docker — o mérito do projeto foi reuni-los atrás de uma interface simples.

Os **namespaces** restringem o que o processo *enxerga*. Existem namespaces separados para processos, rede, pontos de montagem, usuários e nome de máquina. Um processo dentro de um namespace de PID acredita ser o processo número 1, e não enxerga nada de fora.

Os **cgroups** restringem o que o processo *consome*: quanto de CPU, quanta memória, quanta banda de entrada e saída. É o que impede um contêiner de derrubar os vizinhos.

O **sistema de arquivos em camadas** permite que várias imagens compartilhem os mesmos arquivos-base sem duplicá-los em disco, e é o que torna as imagens pequenas e o download rápido.

<aside class="negative">

**Atenção: o kernel é compartilhado.** Como todos os contêineres usam o mesmo kernel, o isolamento é mais fraco do que o de uma máquina virtual: uma falha grave de segurança no kernel afeta todo mundo na mesma máquina. Contêineres não substituem máquinas virtuais quando o requisito é isolar código não confiável — em nuvem, o padrão é rodar contêineres *dentro* de máquinas virtuais, somando os dois níveis. E é por isso que imagens Linux não rodam em kernel Windows sem uma camada de virtualização por baixo, que é o que o Docker Desktop instala.

</aside>

### Imagem, contêiner e registro

Três palavras aparecem o tempo todo e são frequentemente confundidas.

![O Dockerfile (a receita) passa por docker build e gera a imagem, composta de camadas somente leitura (sistema-base, dependências, aplicação); com docker run a imagem dá origem aos contêineres #1 e #2, cada um com sua camada gravável; com push e pull a imagem é publicada e baixada de um registro (Docker Hub)](img/fig-12.webp)

*O Dockerfile descreve, a imagem é o resultado imutável em camadas, o contêiner é uma execução dessa imagem, e o registro é onde as imagens são publicadas e baixadas.*

A relação entre imagem e contêiner é a mesma que existe entre classe e objeto, ou entre um programa em disco e um processo em execução. A figura acima resume o ciclo: a **imagem** é um artefato imutável, construído uma vez e composto de camadas somente leitura; o **contêiner** é uma execução dessa imagem, com uma camada gravável própria por cima; e o **registro** é o repositório de onde as imagens são baixadas e para onde são publicadas. O Docker Hub é o registro público mais usado, e é dele que virão a imagem do MySQL e a do Dart nos próximos passos.

<aside class="negative">

**A camada gravável desaparece.** Tudo o que um contêiner escreve fica na camada gravável, que morre junto com ele. Por isso um banco de dados em contêiner precisa de um **volume**: sem ele, remover o contêiner apaga os dados. É exatamente o que o `docker compose down -v` faz de propósito.

</aside>

**Comparação entre os três modelos**

|  | Servidor físico | Máquina virtual | Contêiner |
| --- | --- | --- | --- |
| Unidade de isolamento | a máquina | o SO convidado | o processo |
| Tempo para subir | dias ou semanas | minutos | segundos |
| Tamanho típico | — | vários gigabytes | dezenas de megabytes |
| Densidade por servidor | uma aplicação | unidades ou dezenas | centenas |
| Kernel | próprio | próprio, emulado | compartilhado |
| Força do isolamento | total | alta | média |

### O vocabulário mínimo

Quatro conceitos bastam para acompanhar o restante do codelab.

* **Volume** — diretório que vive fora da camada gravável e sobrevive à remoção do contêiner. É onde ficam os dados do banco.
* **Rede** — os contêineres de um mesmo projeto entram em uma rede privada e se enxergam pelo **nome do serviço**, sem precisar de endereço IP.
* **Publicação de porta** — a opção `-p 8080:80` liga uma porta da sua máquina a uma porta de dentro do contêiner. Sem ela, o serviço existe mas é inacessível de fora.
* **Orquestração** — descrever vários contêineres, suas dependências e sua ordem de subida em um arquivo. É o papel do Docker Compose, no passo "Orquestrando tudo com Docker Compose".

<aside class="positive">

**No mercado: além do Docker.** O Docker popularizou o formato, mas hoje ele é padronizado pela OCI (*Open Container Initiative*), o que permite construir uma imagem com uma ferramenta e executá-la com outra. Em produção, poucos times rodam `docker run` direto: o Kubernetes assume o papel de decidir em qual máquina cada contêiner roda, reiniciar o que falha e escalar conforme a carga. O Compose, usado aqui, é a versão de mesa dessa mesma ideia — e os conceitos de imagem, volume, rede e verificação de saúde são idênticos nos dois.

</aside>

## O banco MySQL em um contêiner
Duration: 15:00

### Como a imagem do MySQL se inicializa

Instalar um servidor MySQL diretamente no sistema operacional traz um custo alto: serviço permanente consumindo memória, conflito com outras versões e uma desinstalação trabalhosa. Um contêiner resolve isso — ele existe enquanto for útil e desaparece sem deixar rastro.

Antes de subir qualquer coisa, é preciso entender o que a imagem oficial faz na primeira vez que inicia. O seu *entrypoint* verifica se o diretório `/var/lib/mysql` já contém dados. Se estiver vazio, ele executa a sequência da figura abaixo: inicializa o banco, cria o usuário com as credenciais recebidas por variável de ambiente, executa em ordem alfabética todo arquivo `.sql` ou `.sh` encontrado em `/docker-entrypoint-initdb.d` e só então libera a porta para conexões externas.

![Fluxograma: o contêiner inicia e verifica se /var/lib/mysql está vazio; se já tem dados, apenas inicia o servidor e abre a porta 3306; se está vazio, cria banco e usuário, roda initdb.d/*.sql e então abre a porta 3306; as variáveis de ambiente e os scripts só têm efeito neste caminho](img/fig-13.webp)

*A inicialização completa acontece uma única vez, quando o diretório de dados ainda está vazio.*

A consequência prática é decisiva para a ordem dos próximos passos: o `01-schema.sql` precisa existir **antes** de o contêiner subir pela primeira vez. Criá-lo depois não adianta — o banco já terá sido inicializado sem ele.

### O schema e a carga inicial

Crie a estrutura de pastas `docker/mysql/init/` na raiz do projeto e, dentro dela, o arquivo `01-schema.sql` com o conteúdo a seguir. O prefixo numérico controla a ordem de execução quando houver mais de um script.

**Terminal — criando a pasta**

```bash
mkdir -p docker/mysql/init
```

**docker/mysql/init/01-schema.sql**

```sql
-- O banco já é criado pela variável MYSQL_DATABASE, mas repetir a instrução
-- torna o script utilizável também fora do Docker.
CREATE DATABASE IF NOT EXISTS terrarios
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE terrarios;

CREATE TABLE IF NOT EXISTS terrarios (
  id              INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  apelido         VARCHAR(80)       NOT NULL,
  -- ENUM espelha no banco a mesma restrição que o enum Bioma faz no Dart.
  bioma           ENUM('tropical','desertico','temperado','musgo') NOT NULL,
  umidade_alvo    TINYINT UNSIGNED  NOT NULL,
  -- DECIMAL, e não DOUBLE: volume é uma medida exibida ao usuário e não
  -- deve sofrer os arredondamentos do ponto flutuante binário.
  volume_litros   DECIMAL(7,2)      NOT NULL,
  data_montagem   DATE              NOT NULL,
  criado_em       TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em   TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  -- Unicidade garantida pelo banco: é a única defesa que resiste a duas
  -- requisições simultâneas tentando criar o mesmo apelido.
  UNIQUE KEY uk_terrarios_apelido (apelido),
  -- Índice para o filtro por bioma, que é o mais usado nas consultas.
  KEY idx_terrarios_bioma (bioma),
  CONSTRAINT ck_terrarios_umidade CHECK (umidade_alvo BETWEEN 0 AND 100),
  CONSTRAINT ck_terrarios_volume  CHECK (volume_litros > 0)
) ENGINE=InnoDB;

-- Carga inicial, para que a API tenha o que mostrar já no primeiro teste.
INSERT INTO terrarios
  (apelido, bioma, umidade_alvo, volume_litros, data_montagem)
VALUES
  ('Vale das Samambaias', 'tropical',  85, 12.50, '2026-03-14'),
  ('Duna de Bolso',       'desertico', 20,  4.00, '2026-01-08'),
  ('Bosque de Musgo',     'musgo',     92,  7.25, '2025-11-30'),
  ('Clareira Fria',       'temperado', 60, 18.00, '2026-05-02');
```

<aside class="positive">

**Boa prática: validação em duas frentes.** As restrições `CHECK` e `UNIQUE` repetem regras que também estarão no serviço em Dart. Isso não é duplicação inútil. A validação na aplicação oferece mensagens de erro claras ao usuário; a validação no banco é a última linha de defesa contra condições de corrida e contra qualquer outro sistema que venha a escrever na mesma tabela.

</aside>

### Subindo o banco a partir do Docker Hub

Agora sim o contêiner pode subir. Repare em duas coisas no comando: as credenciais são exatamente as que já estão no seu `.env`, e a opção `-v` monta a pasta recém-criada dentro do caminho que o *entrypoint* varre. Sem essa montagem, o script não seria encontrado e o banco subiria vazio.

**Terminal — subindo o MySQL**

```bash
docker run --name mysql-terrarios \
  -e MYSQL_ROOT_PASSWORD=root-dev-2026 \
  -e MYSQL_DATABASE=terrarios \
  -e MYSQL_USER=terrario_app \
  -e MYSQL_PASSWORD=terrario-dev-2026 \
  -v "$(pwd)/docker/mysql/init:/docker-entrypoint-initdb.d:ro" \
  -p 3307:3306 \
  -d mysql:8.4
```

**Opções usadas no comando**

| Opção | Efeito |
| --- | --- |
| `--name` | Apelida o contêiner, para não depender do identificador gerado. |
| `MYSQL_ROOT_PASSWORD` | Define a senha do administrador. Obrigatória. |
| `MYSQL_DATABASE` | Cria um banco com esse nome. |
| `MYSQL_USER` e `MYSQL_PASSWORD` | Criam o usuário da aplicação, com todos os privilégios sobre o banco acima. |
| `-v` | Monta a pasta local dentro do contêiner; `:ro` a torna somente leitura. |
| `-p` | Publica a porta do contêiner na sua máquina, no formato `host:contêiner`. O MySQL sempre escuta na 3306 lá dentro; do lado de fora usamos a 3307 para não colidir com um MySQL já instalado. |
| `-d` | Roda em segundo plano. |

<aside class="positive">

**Por que 3307 e não 3306.** O MySQL sempre escuta na porta 3306 **dentro** do contêiner — isso não muda. O que escolhemos é a porta **da sua máquina** que será ligada a ela, e a 3306 costuma já estar ocupada por uma instalação local do MySQL ou do XAMPP. Se estiver, o Docker recusa a subida com `port is already allocated`. Usar a 3307 evita o conflito, e é por isso que o `.env` traz `DB_PORT=3307`: é por ela que a aplicação, rodando fora do contêiner, alcança o banco.

</aside>

A inicialização leva alguns segundos. Acompanhe pelo log até ver a mensagem de que o servidor está pronto para conexões — e, no caminho, a confirmação de que o script foi executado.

**Terminal — acompanhando a inicialização**

```text
$ docker logs -f mysql-terrarios

[Entrypoint] Initializing database files
[Entrypoint] running /docker-entrypoint-initdb.d/01-schema.sql
[Server] /usr/sbin/mysqld: ready for connections. port: 3306

# saia do acompanhamento com Ctrl+C
```

<aside class="negative">

**Atenção: esta é a hora certa de acertar tudo.** Se a linha `running /docker-entrypoint-initdb.d/01-schema.sql` não aparecer, o script não foi encontrado: confira se você rodou o `docker run` a partir da raiz do projeto, já que `$(pwd)` depende disso.

Como a inicialização acontece uma única vez, corrigir o `-v`, as senhas ou o próprio `01-schema.sql` depois não muda nada — o diretório de dados já existe e o *entrypoint* passa direto. É preciso destruir o contêiner e recomeçar:

`docker rm -f mysql-terrarios`

Neste `docker run` avulso não há volume nomeado, então remover o contêiner já apaga os dados. A partir do passo "Orquestrando tudo com Docker Compose", com o volume declarado no Compose, o comando equivalente passa a ser `docker compose down -v` — ou `docker volume rm terrario_dados-mysql` para remover apenas o volume.

</aside>

### Conferindo pelo cliente de linha de comando

A prova definitiva de que o schema e a carga inicial foram aplicados é consultar a tabela. A senha pedida é a de `DB_PASSWORD`.

**Terminal — explorando o banco de dentro do contêiner**

```text
$ docker exec -it mysql-terrarios mysql -u terrario_app -p terrarios

mysql> SELECT id, apelido, bioma, umidade_alvo FROM terrarios;
+----+---------------------+-----------+--------------+
| id | apelido             | bioma     | umidade_alvo |
+----+---------------------+-----------+--------------+
|  1 | Vale das Samambaias | tropical  |           85 |
|  2 | Duna de Bolso       | desertico |           20 |
|  3 | Bosque de Musgo     | musgo     |           92 |
|  4 | Clareira Fria       | temperado |           60 |
+----+---------------------+-----------+--------------+

mysql> exit
```

Com as quatro linhas na tela, o banco está pronto e o codelab pode voltar para o Dart. Deixe o contêiner rodando: ele será usado em todos os testes até o passo "Orquestrando tudo com Docker Compose", quando o Compose assumir o lugar deste `docker run`.

## A camada de persistência: pool e contrato
Duration: 10:00

### O pool de conexões

Abrir uma conexão TCP com o banco, autenticar e negociar a sessão custa vários milissegundos. Fazer isso a cada requisição desperdiça tempo e satura o limite de conexões do servidor. Um **pool** mantém um conjunto de conexões abertas e as empresta conforme a demanda, como ilustra a figura abaixo.

![As requisições A, B e C chegam ao pool, que reaproveita as conexões 1 a 4 abertas com o MySQL; DB_POOL_SIZE define o teto de conexões](img/fig-14.webp)

*O pool desacopla o número de requisições simultâneas do número de conexões abertas com o banco.*

Crie o arquivo `database.dart` na pasta `lib/src/config/`, ao lado dos dois que já estão lá.

**lib/src/config/database.dart · parte 1 de 2**

```dart
import 'package:mysql_dart/mysql_dart.dart';

import 'app_config.dart';

/// Cria o pool de conexões a partir da configuração da aplicação.
///
/// O pool é criado uma única vez, no boot, e compartilhado por todas as
/// requisições. Ele não abre conexões imediatamente: cada conexão nasce
/// na primeira vez que é necessária e depois é reaproveitada.
MySQLConnectionPool criarPool(AppConfig config) {
  return MySQLConnectionPool(
    host: config.dbHost,
    port: config.dbPort,
    userName: config.dbUser,
    password: config.dbPassword,
    databaseName: config.dbName,
    maxConnections: config.dbPoolSize,
    // Dentro da rede privada do Docker o tráfego não sai da máquina, então
    // TLS é dispensável. Em produção, com o banco em outro host, troque
    // para secure: true e remova allowPublicKeyRetrieval.
    secure: false,
    // Necessário porque o MySQL 8 autentica com caching_sha2_password e,
    // sem TLS, o cliente precisa buscar a chave pública do servidor.
    allowPublicKeyRetrieval: true,
  );
}
```

Falta uma segunda função, e ela existe por causa do Docker. O contêiner da API pode iniciar antes de o MySQL terminar de subir, e uma tentativa de conexão nesse intervalo falha. Em vez de deixar o processo morrer, a aplicação insiste por algum tempo antes de desistir. **Continue no mesmo arquivo.**

**lib/src/config/database.dart · parte 2 de 2**

```dart
/// Aguarda o banco ficar disponível.
///
/// Em um ambiente com Docker Compose o contêiner da API pode iniciar antes
/// de o MySQL terminar de subir. Em vez de falhar, a aplicação tenta se
/// conectar algumas vezes com intervalo entre as tentativas.
Future<void> aguardarBanco(
  MySQLConnectionPool pool, {
  int tentativas = 30,
  Duration intervalo = const Duration(seconds: 2),
}) async {
  for (var tentativa = 1; tentativa <= tentativas; tentativa++) {
    try {
      await pool.execute('SELECT 1');
      return;
    } catch (_) {
      if (tentativa == tentativas) rethrow;
      await Future<void>.delayed(intervalo);
    }
  }
}
```

### O contrato do repositório

A camada de serviço nunca menciona MySQL. Ela conversa com uma interface abstrata, e é isso que permite trocar a implementação sem tocar na regra de negócio.

Crie a pasta `lib/src/repositories/` e, dentro dela, o arquivo `terrario_repository.dart`.

**lib/src/repositories/terrario_repository.dart**

```dart
import '../models/terrario.dart';

/// Critérios de busca aceitos pela listagem.
class FiltroTerrario {
  const FiltroTerrario({
    this.bioma,
    this.umidadeMinima,
    this.pagina = 1,
    this.tamanhoPagina = 20,
  });

  final Bioma? bioma;
  final int? umidadeMinima;
  final int pagina;
  final int tamanhoPagina;

  /// Quantos registros pular na consulta SQL.
  int get deslocamento => (pagina - 1) * tamanhoPagina;
}

/// Resultado paginado: os itens da página corrente mais o total geral,
/// necessário para calcular quantas páginas existem.
class Pagina<T> {
  const Pagina({
    required this.itens,
    required this.total,
    required this.pagina,
    required this.tamanhoPagina,
  });

  final List<T> itens;
  final int total;
  final int pagina;
  final int tamanhoPagina;

  int get totalPaginas => total == 0 ? 1 : (total / tamanhoPagina).ceil();
  bool get temProxima => pagina < totalPaginas;
  bool get temAnterior => pagina > 1;
}

/// Contrato de persistência de terrários.
abstract interface class TerrarioRepository {
  Future<Pagina<Terrario>> listar(FiltroTerrario filtro);
  Future<Terrario?> buscarPorId(int id);
  Future<Terrario?> buscarPorApelido(String apelido);
  Future<Terrario> inserir(Terrario terrario);
  Future<Terrario?> atualizar(int id, Terrario terrario);
  Future<bool> remover(int id);
}
```

<aside class="positive">

**`abstract interface class`.** Dart 3 permite marcar uma classe como `interface`, o que impede que ela seja estendida com `extends` — só é possível `implements`. Isso comunica a intenção com precisão: aqui existe um contrato, não uma classe base com comportamento a ser herdado.

</aside>

## A implementação em MySQL
Duration: 20:00

Crie agora o arquivo `mysql_terrario_repository.dart` na mesma pasta `lib/src/repositories/`. Começamos pela conversão de uma linha do banco em um objeto de domínio e pela consulta de leitura por identificador; os demais métodos serão acrescentados logo a seguir.

**lib/src/repositories/mysql_terrario_repository.dart · parte 1 de 4**

```dart
import 'package:mysql_dart/mysql_dart.dart';

import '../models/terrario.dart';
import 'terrario_repository.dart';

class MySqlTerrarioRepository implements TerrarioRepository {
  MySqlTerrarioRepository(this._pool);

  final MySQLConnectionPool _pool;

  /// Colunas listadas explicitamente em vez de SELECT *: assim a ordem e o
  /// conjunto de campos não mudam quando alguém alterar a tabela.
  static const String _colunas =
      'id, apelido, bioma, umidade_alvo, volume_litros, '
      'data_montagem, criado_em, atualizado_em';

  /// Converte uma linha do resultado em uma entidade.
  ///
  /// O driver devolve colunas DECIMAL como texto justamente para preservar
  /// a precisão, então a conversão para double é feita aqui, no único ponto
  /// do sistema que conhece o formato do banco.
  Terrario _mapear(ResultSetRow linha) {
    // assoc() devolve Map<String, dynamic>. Como o analysis_options.yaml
    // ativa strict-casts, o Dart recusa converter dynamic em String sem
    // que a intenção esteja escrita: o cast declara que toda coluna deste
    // SELECT chega como texto.
    final dados = linha.assoc().cast<String, String?>();
    return Terrario(
      id: int.parse(dados['id']!),
      apelido: dados['apelido']!,
      bioma: Bioma.porNome(dados['bioma'])!,
      umidadeAlvo: int.parse(dados['umidade_alvo']!),
      volumeLitros: double.parse(dados['volume_litros']!),
      dataMontagem: DateTime.parse(dados['data_montagem']!),
      criadoEm: DateTime.tryParse(dados['criado_em'] ?? ''),
      atualizadoEm: DateTime.tryParse(dados['atualizado_em'] ?? ''),
    );
  }

  @override
  Future<Terrario?> buscarPorId(int id) async {
    // O parâmetro nomeado :id nunca é concatenado no texto do comando:
    // o driver envia valor e comando separadamente, o que elimina a
    // possibilidade de injeção de SQL.
    final resultado = await _pool.execute(
      'SELECT $_colunas FROM terrarios WHERE id = :id',
      {'id': id},
    );
    if (resultado.rows.isEmpty) return null;
    return _mapear(resultado.rows.first);
  }

  @override
  Future<Terrario?> buscarPorApelido(String apelido) async {
    final resultado = await _pool.execute(
      'SELECT $_colunas FROM terrarios WHERE apelido = :apelido',
      {'apelido': apelido},
    );
    if (resultado.rows.isEmpty) return null;
    return _mapear(resultado.rows.first);
  }
}
```

<aside class="negative">

**Atenção: o analisador vai reclamar por enquanto.** Declarar `implements TerrarioRepository` obriga a classe a ter todos os métodos do contrato. Como ainda faltam quatro, o `dart analyze` apontará erro até o último bloco deste passo ser copiado. É esperado — a classe só fica completa ao final deste passo.

</aside>

Agora a listagem com filtros e paginação. Acrescente o método abaixo **dentro da classe, logo após o `buscarPorApelido`**. As primeiras linhas do bloco (o `buscarPorApelido` com o corpo resumido) apenas indicam onde encaixar o trecho novo — elas já estão no arquivo e não devem ser digitadas de novo. Repare que a cláusula `WHERE` é montada dinamicamente, mas os valores continuam indo como parâmetros.

**lib/src/repositories/mysql_terrario_repository.dart · parte 2 de 4**

```dart
  @override
  Future<Terrario?> buscarPorApelido(String apelido) async {
    // ... corpo já apresentado ...
  }

  @override
  Future<Pagina<Terrario>> listar(FiltroTerrario filtro) async {
    // Condições e parâmetros crescem juntos, mantendo a correspondência.
    final condicoes = <String>[];
    final parametros = <String, dynamic>{};

    if (filtro.bioma != null) {
      condicoes.add('bioma = :bioma');
      parametros['bioma'] = filtro.bioma!.name;
    }
    if (filtro.umidadeMinima != null) {
      condicoes.add('umidade_alvo >= :umidade');
      parametros['umidade'] = filtro.umidadeMinima;
    }

    final where = condicoes.isEmpty ? '' : 'WHERE ${condicoes.join(' AND ')}';

    // Primeiro o total, usado para calcular o número de páginas.
    final contagem = await _pool.execute(
      'SELECT COUNT(*) AS total FROM terrarios $where',
      parametros,
    );
    final total =
        int.parse(contagem.rows.first.assoc().cast<String, String?>()['total']!);

    // Depois a página propriamente dita. LIMIT e OFFSET também são
    // parâmetros, nunca concatenação de texto.
    final resultado = await _pool.execute(
      'SELECT $_colunas FROM terrarios $where '
      'ORDER BY apelido ASC LIMIT :limite OFFSET :deslocamento',
      {
        ...parametros,
        'limite': filtro.tamanhoPagina,
        'deslocamento': filtro.deslocamento,
      },
    );

    return Pagina<Terrario>(
      itens: resultado.rows.map(_mapear).toList(growable: false),
      total: total,
      pagina: filtro.pagina,
      tamanhoPagina: filtro.tamanhoPagina,
    );
  }
```

<aside class="negative">

**Atenção: injeção de SQL.** Escrever `'... WHERE id = $id'` com interpolação de *string* parece inofensivo quando o valor é um inteiro, mas o hábito é o problema: no dia em que o parâmetro for texto vindo da URL, um valor como `' OR '1'='1` transforma a consulta inteira. Parâmetros nomeados custam o mesmo esforço e fecham a porta definitivamente.

</aside>

E finalmente as operações de escrita. Acrescente-as **depois do `listar`**, seguindo a mesma lógica: as primeiras linhas (o `listar` com o corpo resumido) são o que já existe e todo o restante é novo.

**lib/src/repositories/mysql_terrario_repository.dart · parte 3 de 4**

```dart
  @override
  Future<Pagina<Terrario>> listar(FiltroTerrario filtro) async {
    // ... corpo já apresentado ...
  }

  @override
  Future<Terrario> inserir(Terrario terrario) async {
    final resultado = await _pool.execute(
      'INSERT INTO terrarios '
      '(apelido, bioma, umidade_alvo, volume_litros, data_montagem) '
      'VALUES (:apelido, :bioma, :umidade, :volume, :data)',
      {
        'apelido': terrario.apelido,
        'bioma': terrario.bioma.name,
        'umidade': terrario.umidadeAlvo,
        'volume': terrario.volumeLitros,
        'data': _formatarData(terrario.dataMontagem),
      },
    );

    final novoId = resultado.lastInsertID.toInt();
    // Recarrega para trazer criado_em e atualizado_em gerados pelo banco.
    return (await buscarPorId(novoId))!;
  }

  @override
  Future<Terrario?> atualizar(int id, Terrario terrario) async {
    final resultado = await _pool.execute(
      'UPDATE terrarios SET '
      'apelido = :apelido, bioma = :bioma, umidade_alvo = :umidade, '
      'volume_litros = :volume, data_montagem = :data '
      'WHERE id = :id',
      {
        'id': id,
        'apelido': terrario.apelido,
        'bioma': terrario.bioma.name,
        'umidade': terrario.umidadeAlvo,
        'volume': terrario.volumeLitros,
        'data': _formatarData(terrario.dataMontagem),
      },
    );

    // affectedRows igual a zero pode significar duas coisas: o id não existe
    // ou os valores enviados eram idênticos aos atuais. Como as duas situações
    // são indistinguíveis aqui, a decisão fica com a releitura: se o registro
    // existir, ele é devolvido; se não, o retorno é nulo e a camada de serviço
    // transforma isso em 404.
    return buscarPorId(id);
  }
```

<aside class="positive">

**Observação:** como a variável `resultado` do `atualizar` não é usada depois do `execute` (a decisão fica com a releitura, conforme o comentário), o `dart analyze` emite o aviso *unused_local_variable* para ela. É apenas um aviso, não um erro; se preferir silenciá-lo, basta escrever `await _pool.execute(...)` sem atribuir o resultado a uma variável.

</aside>

Faltam a remoção e o auxiliar de formatação de data. **Continue no mesmo arquivo**; a chave final fecha a classe, que a partir daqui atende ao contrato inteiro e para de acusar erro no analisador.

**lib/src/repositories/mysql_terrario_repository.dart · parte 4 de 4**

```dart
  @override
  Future<bool> remover(int id) async {
    final resultado = await _pool.execute(
      'DELETE FROM terrarios WHERE id = :id',
      {'id': id},
    );
    return resultado.affectedRows.toInt() > 0;
  }

  /// O MySQL espera datas no formato AAAA-MM-DD.
  static String _formatarData(DateTime d) =>
      '${d.year.toString().padLeft(4, '0')}-'
      '${d.month.toString().padLeft(2, '0')}-'
      '${d.day.toString().padLeft(2, '0')}';
}
```

<aside class="negative">

**Cuidado com a chave de fechamento:** a parte 1 terminou com a chave que fecha a classe. Ao acrescentar as partes 2, 3 e 4, digite-as **antes** dessa chave (ou apague-a, já que a parte 4 traz a chave final). A classe deve terminar com uma única `}`.

</aside>

A inserção devolve a entidade recarregada do banco, e não o objeto que chegou por parâmetro: só assim o cliente recebe o identificador gerado pelo `AUTO_INCREMENT` e os carimbos de tempo preenchidos pelo servidor.

<aside class="positive">

**No mercado: e por que não um ORM?** Quem vem de Java com Hibernate ou de C# com Entity Framework estranha escrever SQL à mão. Em Dart, o ecossistema de ORM ainda é desigual: o Drift, o mais maduro, atende SQLite e PostgreSQL; o Stormberry e o Serverpod são exclusivos de PostgreSQL. Para MySQL sobra o Angel3 ORM, que exige geração de código, amarra o projeto ao seu próprio *framework* e impõe um sufixo e uma classe-base às entidades.

Mesmo onde há uma boa opção, o ganho é menor do que parece. Os métodos de CRUD viram uma linha cada e o mapeamento manual desaparece, mas surgem a classe anotada, os arquivos gerados, a configuração do `build_runner` e um passo extra de *build* a cada alteração no modelo. Em uma entidade só, a economia líquida fica em torno de um terço do código — em um sistema com trinta tabelas e relacionamentos, o ORM ganha de lavada, e aí a conta se inverte.

Há ainda a razão didática: um ORM esconde exatamente o que este passo existe para mostrar — parâmetros que impedem injeção de SQL, o identificador gerado em `lastInsertID`, a ambiguidade de `affectedRows` entre "não existe" e "nada mudou" e o `DECIMAL` que chega como texto. Quem entende essas peças usa ORM com discernimento e sabe o que fazer quando a consulta gerada fica lenta; o caminho inverso costuma travar no primeiro problema de desempenho.

</aside>

### Testando o repositório

Antes de acrescentar mais camadas por cima, vale confirmar que a conversa com o banco funciona. **Substitua temporariamente** o conteúdo do `bin/server.dart` por este trecho, com o contêiner do MySQL rodando.

**bin/server.dart — provisório**

```dart
import 'dart:io';

import 'package:terrario_api/src/config/app_config.dart';
import 'package:terrario_api/src/config/database.dart';
import 'package:terrario_api/src/repositories/mysql_terrario_repository.dart';
import 'package:terrario_api/src/repositories/terrario_repository.dart';

Future<void> main() async {
  final config = AppConfig.fromEnv();
  final pool = criarPool(config);
  await aguardarBanco(pool);

  final repository = MySqlTerrarioRepository(pool);

  final pagina = await repository.listar(const FiltroTerrario());
  stdout.writeln('Total no banco: ${pagina.total}');
  for (final t in pagina.itens) {
    stdout.writeln('  ${t.id} - ${t.apelido} '
        '(${t.bioma.name}, ${t.umidadeAlvo}%)');
  }

  // Fecha o pool para que o processo consiga terminar.
  await pool.close();
}
```

**Terminal — conferindo**

```text
$ dart run bin/server.dart
Total no banco: 4
  3 - Bosque de Musgo (musgo, 92%)
  4 - Clareira Fria (temperado, 60%)
  2 - Duna de Bolso (desertico, 20%)
  1 - Vale das Samambaias (tropical, 85%)
```

Se os quatro registros da carga inicial aparecerem, então a configuração, o pool, a autenticação e o mapeamento de linhas estão todos corretos — quatro fontes de erro eliminadas de uma vez, antes de existir qualquer rota HTTP.

<aside class="negative">

**Atenção: erros mais comuns neste ponto.** `Access denied for user` indica que `DB_USER` ou `DB_PASSWORD` não batem com as credenciais gravadas na primeira subida do contêiner. `Connection refused` indica que o contêiner não está rodando ou que a porta publicada não é a mesma do `.env` — confira se ambos dizem 3307. E `Unknown database` significa que o `DB_NAME` difere do valor passado em `MYSQL_DATABASE`.

</aside>

## A camada de serviço
Duration: 15:00

O serviço concentra as regras que não pertencem nem ao transporte nem ao banco. Ele recebe dados já desserializados, valida, decide e chama o repositório. Como não conhece HTTP, pode ser testado com uma chamada de método comum.

Crie a pasta `lib/src/services/` e, dentro dela, o arquivo `terrario_service.dart`.

**lib/src/services/terrario_service.dart · parte 1 de 2**

```dart
import '../core/erros.dart';
import '../models/terrario.dart';
import '../repositories/terrario_repository.dart';

class TerrarioService {
  TerrarioService(this._repository);

  final TerrarioRepository _repository;

  static const int _tamanhoPaginaMaximo = 100;

  Future<Pagina<Terrario>> listar(FiltroTerrario filtro) {
    // Um cliente que peça dez mil itens de uma vez derruba o servidor.
    // O teto é aplicado aqui, e não no controlador, porque é uma decisão
    // de negócio e não de protocolo.
    final seguro = FiltroTerrario(
      bioma: filtro.bioma,
      umidadeMinima: filtro.umidadeMinima,
      pagina: filtro.pagina < 1 ? 1 : filtro.pagina,
      // clamp é declarado em num e devolve num, por isso o toInt().
      tamanhoPagina: filtro.tamanhoPagina.clamp(1, _tamanhoPaginaMaximo).toInt(),
    );
    return _repository.listar(seguro);
  }

  Future<Terrario> buscarPorId(int id) async {
    final terrario = await _repository.buscarPorId(id);
    if (terrario == null) {
      throw NaoEncontrado('Nao existe terrario com id $id.');
    }
    return terrario;
  }

  /// Valida todos os campos de uma vez e devolve o conjunto completo de
  /// problemas. Reportar um erro por vez obrigaria o usuário a corrigir
  /// o formulário em várias rodadas.
  void _validar(Terrario t) {
    final erros = <String, String>{};

    final apelido = t.apelido.trim();
    if (apelido.length < 3 || apelido.length > 80) {
      erros['apelido'] = 'Deve ter entre 3 e 80 caracteres.';
    }
    if (t.umidadeAlvo < 0 || t.umidadeAlvo > 100) {
      erros['umidadeAlvo'] = 'Deve estar entre 0 e 100.';
    }
    if (t.volumeLitros <= 0) {
      erros['volumeLitros'] = 'Deve ser maior que zero.';
    }
    final hoje = DateTime.now().toUtc();
    if (t.dataMontagem.isAfter(hoje)) {
      erros['dataMontagem'] = 'Nao pode estar no futuro.';
    }

    if (erros.isNotEmpty) {
      throw ErroValidacao('Os dados enviados sao invalidos.', erros);
    }
  }
```

A classe segue aberta. O método `_validar` foi definido primeiro porque as operações de escrita dependem dele — em Dart a ordem dentro da classe não importa para o compilador, mas importa para quem lê e para quem está copiando o código aos poucos, já que assim o arquivo compila em qualquer ponto da digitação.

**Continue no mesmo arquivo** com as três operações de escrita; a chave final fecha a classe.

**lib/src/services/terrario_service.dart · parte 2 de 2**

```dart
  Future<Terrario> criar(Terrario novo) async {
    _validar(novo);

    final existente = await _repository.buscarPorApelido(novo.apelido);
    if (existente != null) {
      throw Conflito('Ja existe um terrario com o apelido "${novo.apelido}".');
    }

    return _repository.inserir(novo);
  }

  Future<Terrario> atualizar(int id, Terrario dados) async {
    _validar(dados);

    // Garante que o recurso existe antes de tentar alterá-lo, para poder
    // responder 404 em vez de um silencioso "nada foi alterado".
    await buscarPorId(id);

    final homonimo = await _repository.buscarPorApelido(dados.apelido);
    if (homonimo != null && homonimo.id != id) {
      throw Conflito('Ja existe um terrario com o apelido "${dados.apelido}".');
    }

    final atualizado = await _repository.atualizar(id, dados);
    if (atualizado == null) {
      throw NaoEncontrado('Nao existe terrario com id $id.');
    }
    return atualizado;
  }

  Future<void> remover(int id) async {
    final removido = await _repository.remover(id);
    if (!removido) {
      throw NaoEncontrado('Nao existe terrario com id $id.');
    }
  }
}
```

<aside class="positive">

**Boa prática:** validar tudo e devolver o mapa completo de erros é o comportamento esperado por qualquer formulário moderno. O cliente destaca todos os campos problemáticos de uma vez, em vez de exibir um erro, receber a correção e revelar o seguinte.

</aside>

<aside class="positive">

**No mercado: onde mora a regra de negócio.** Em equipes que usam Spring, ASP.NET ou NestJS, essa camada tem o mesmo nome e a mesma função. O teste mais direto para saber se uma regra está no lugar certo é perguntar: *se amanhã esta aplicação virar uma ferramenta de linha de comando, sem HTTP nenhum, esta regra ainda precisa existir?* Se a resposta for sim, ela pertence ao serviço.

</aside>

## Testando a regra de negócio
Duration: 12:00

A separação em camadas paga o próprio custo agora. O serviço não conhece HTTP nem SQL: ele depende apenas da interface `TerrarioRepository`. Isso permite exercitá-lo com uma implementação em memória, sem banco, sem contêiner e sem servidor — os testes rodam em milissegundos.

O pacote `test` já foi instalado como dependência de desenvolvimento no passo "Preparando o ambiente". Ele procura arquivos terminados em `_test.dart` dentro da pasta `test/`, na raiz do projeto.

Crie a pasta `test/` **na raiz** — no mesmo nível de `bin/` e `lib/`, e não dentro delas — e, dentro dela, o arquivo `terrario_service_test.dart`.

**test/terrario_service_test.dart · parte 1 de 2**

```dart
import 'package:terrario_api/src/core/erros.dart';
import 'package:terrario_api/src/models/terrario.dart';
import 'package:terrario_api/src/repositories/terrario_repository.dart';
import 'package:terrario_api/src/services/terrario_service.dart';
import 'package:test/test.dart';

/// Implementação em memória usada apenas nos testes.
///
/// Como o serviço depende da interface e não da classe concreta, ele não
/// percebe a diferença. Um Map faz o papel da tabela e um contador faz o
/// papel do AUTO_INCREMENT.
class RepositorioFake implements TerrarioRepository {
  final Map<int, Terrario> _dados = {};
  int _proximoId = 1;

  @override
  Future<Terrario> inserir(Terrario t) async {
    final salvo = t.copyWith(id: _proximoId++);
    _dados[salvo.id!] = salvo;
    return salvo;
  }

  @override
  Future<Terrario?> buscarPorId(int id) async => _dados[id];

  @override
  Future<Terrario?> buscarPorApelido(String apelido) async {
    for (final t in _dados.values) {
      if (t.apelido == apelido) return t;
    }
    return null;
  }

  @override
  Future<Pagina<Terrario>> listar(FiltroTerrario f) async => Pagina(
        itens: _dados.values.toList(),
        total: _dados.length,
        pagina: f.pagina,
        tamanhoPagina: f.tamanhoPagina,
      );

  @override
  Future<Terrario?> atualizar(int id, Terrario t) async =>
      _dados.containsKey(id) ? (_dados[id] = t.copyWith(id: id)) : null;

  @override
  Future<bool> remover(int id) async => _dados.remove(id) != null;
}
```

<aside class="negative">

**Onde fica o `main` de um arquivo de teste.** O `main` de um arquivo de teste é uma função de nível superior, declarada **fora** de qualquer classe, encostada na margem esquerda do arquivo. Ele não pertence ao `RepositorioFake` nem a nenhuma outra classe — o `RepositorioFake` termina com a sua chave, e o `main` começa depois dela, na coluna zero. Colocá-lo por engano dentro da classe é o erro mais comum nessa primeira vez, e o sintoma é o `dart test` não encontrar teste nenhum para rodar.

</aside>

**Continue no mesmo arquivo**, depois da chave que fecha o `RepositorioFake`, com o `main` e os dois primeiros casos.

**test/terrario_service_test.dart · parte 2 de 2**

```dart
void main() {
  late TerrarioService service;

  // setUp roda antes de cada teste, então cada caso começa com um
  // repositório vazio e não enxerga o que os outros fizeram.
  setUp(() => service = TerrarioService(RepositorioFake()));

  // Fábrica de dados válidos: cada teste altera só o campo que lhe
  // interessa, o que deixa evidente qual é a condição sob avaliação.
  Terrario valido({String apelido = 'Vale das Samambaias'}) => Terrario(
        apelido: apelido,
        bioma: Bioma.tropical,
        umidadeAlvo: 85,
        volumeLitros: 12.5,
        dataMontagem: DateTime.utc(2026, 3, 14),
      );

  test('cria um terrario valido e recebe identificador', () async {
    final criado = await service.criar(valido());
    expect(criado.id, isNotNull);
  });

  test('recusa umidade fora da faixa', () {
    final invalido = valido().copyWith(umidadeAlvo: 130);
    expect(
      () => service.criar(invalido),
      throwsA(isA<ErroValidacao>()),
    );
  });
}
```

**Terminal — executando**

```text
$ dart test
00:01 +2: All tests passed!
```

### Vendo um teste falhar

Um teste que nunca falhou não provou nada — ele pode estar verificando a coisa errada, ou não estar verificando coisa alguma. Vale quebrar a regra de propósito uma vez para confirmar que o teste realmente a vigia.

Abra o `terrario_service.dart` e, temporariamente, troque o limite superior da umidade de 100 para 1000:

**lib/src/services/terrario_service.dart — alteração temporária**

```dart
    if (t.umidadeAlvo < 0 || t.umidadeAlvo > 1000) {
      erros['umidadeAlvo'] = 'Deve estar entre 0 e 100.';
    }
```

**Terminal — a falha**

```text
$ dart test
00:01 +1 -1: recusa umidade fora da faixa [E]

  Expected: throws <Instance of 'ErroValidacao'>
    Actual: <Closure: () => Future<Terrario>>
     Which: returned a Future that completed normally

  test/terrario_service_test.dart 78:5  main.<fn>

00:01 +1 -1: Some tests failed.
```

A saída merece leitura atenta. O `+1 -1` informa um teste aprovado e um reprovado. O `Expected` descreve o que o teste exigia — que uma exceção fosse lançada — e o `Which` explica o que aconteceu de fato: nenhuma exceção veio, a operação completou normalmente. E a última linha aponta o arquivo e a linha exata do `expect` que falhou.

**Desfaça a alteração**, voltando o limite para 100, e confirme que os dois testes voltam a passar. Esse ciclo — quebrar, ver falhar, consertar — é o que dá confiança de que o teste vigia o que se espera dele.

<aside class="positive">

**Boa prática: teste comportamento, não implementação.** Repare no que os testes verificam: que um terrário válido recebe identificador e que uma umidade fora da faixa é recusada. Nenhum deles sabe que existe um método chamado `_validar`, nem em que ordem as verificações acontecem. Testes presos a detalhes internos quebram a cada refatoração, mesmo quando o comportamento continua correto.

</aside>

## Erros no formato problem+json
Duration: 8:00

Cada API que inventa o próprio formato de erro obriga quem a consome a escrever um tratamento específico. Uma devolve `{"erro": ...}`, outra `{"message": ...}`, uma terceira aninha tudo dentro de `{"error": {"msg": ...}}` — e o cliente acaba com um emaranhado de condicionais só para descobrir o que deu errado. A RFC 9457 padroniza um objeto JSON com campos previsíveis, servido com o tipo de mídia `application/problem+json`.

> **Campos do problem details**
>
> `type` é uma URI que identifica a **classe** do problema e funciona como sua chave estável — é por ela que o cliente decide o que fazer; `title` é um resumo legível para humanos, igual para todas as ocorrências daquele tipo; `status` repete o código HTTP dentro do corpo, útil quando a resposta é registrada em log sem os cabeçalhos; `detail` explica a **ocorrência** específica; e `instance` identifica qual requisição falhou. Qualquer campo extra pode ser acrescentado — usaremos `errors` para o mapa de campos inválidos.

A distinção entre `title` e `detail` é a que mais se erra. O título é fixo por tipo de problema e serve para o cliente agrupar ocorrências; o detalhe muda a cada requisição e serve para a pessoa entender o caso dela. Comparando os dois erros abaixo, vindos do mesmo tipo:

**Duas ocorrências do mesmo tipo de problema**

```json
{
  "type":   "https://api.terrarios.local/problemas/nao-encontrado",
  "title":  "Recurso nao encontrado",
  "status": 404,
  "detail": "Nao existe terrario com id 999."
}

{
  "type":   "https://api.terrarios.local/problemas/nao-encontrado",
  "title":  "Recurso nao encontrado",
  "status": 404,
  "detail": "Nao existe terrario com id 4211."
}
```

O `type` e o `title` são idênticos — o cliente pode escrever `if (type.endsWith('nao-encontrado'))` uma única vez e tratar os dois. Só o `detail` varia. Um erro de validação usa o mesmo esqueleto e acrescenta o campo extra:

**Erro de validação com campo estendido**

```json
{
  "type":   "https://api.terrarios.local/problemas/validacao",
  "title":  "Dados invalidos",
  "status": 422,
  "detail": "Os dados enviados sao invalidos.",
  "errors": {
    "umidadeAlvo":  "Deve estar entre 0 e 100.",
    "volumeLitros": "Deve ser maior que zero."
  }
}
```

<aside class="positive">

**Boa prática: o `type` não precisa existir de verdade.** A URI em `type` identifica, não localiza — ela não precisa responder a um GET. Ainda assim, publicar uma página explicando cada tipo de problema é uma cortesia que economiza mensagens no suporte. Quando não houver URI, o padrão manda usar `"about:blank"`, e nesse caso o `title` deve ser simplesmente o nome do código HTTP.

</aside>

Crie a pasta `lib/src/web/` e, dentro dela, o arquivo `problem.dart`.

**lib/src/web/problem.dart**

```dart
import 'dart:convert';

import 'package:shelf/shelf.dart';

/// Prefixo usado para identificar os tipos de problema desta API.
const String _baseTipos = 'https://api.terrarios.local/problemas';

/// Monta uma resposta de erro no formato definido pela RFC 9457.
Response problema({
  required int status,
  required String titulo,
  required String detalhe,
  String? tipo,
  Map<String, dynamic> extras = const {},
}) {
  final corpo = <String, dynamic>{
    'type': tipo == null ? 'about:blank' : '$_baseTipos/$tipo',
    'title': titulo,
    'status': status,
    'detail': detalhe,
    ...extras,
  };

  return Response(
    status,
    body: jsonEncode(corpo),
    headers: {
      // O sufixo +json diz aos clientes que o corpo é JSON, e o prefixo
      // problem diz que ele segue a estrutura padronizada de erro.
      'content-type': 'application/problem+json; charset=utf-8',
    },
  );
}
```

## Middlewares e CORS
Duration: 18:00

Três preocupações transversais aparecem em toda requisição: registrar o que aconteceu, permitir que navegadores em outra origem consumam a API e converter exceções em respostas HTTP adequadas.

Crie o arquivo `middlewares.dart` na pasta `lib/src/web/`.

**lib/src/web/middlewares.dart · parte 1 de 2**

```dart
import 'dart:io';

import 'package:shelf/shelf.dart';

import '../core/erros.dart';
import 'problem.dart';

/// Registra método, caminho, status e duração de cada requisição.
///
/// Uma linha por requisição, em formato estável, é o mínimo necessário para
/// diagnosticar problemas em produção. Ferramentas de agregação de logs
/// conseguem extrair métricas a partir daí.
Middleware registrarAcessos() {
  return (Handler proximo) {
    return (Request requisicao) async {
      final inicio = DateTime.now();
      final resposta = await proximo(requisicao);
      final duracao = DateTime.now().difference(inicio).inMilliseconds;

      stdout.writeln(
        '${requisicao.method} /${requisicao.url.path} '
        '-> ${resposta.statusCode} (${duracao}ms)',
      );
      return resposta;
    };
  };
}

/// Libera o consumo da API a partir de páginas hospedadas em outra origem.
Middleware liberarCors({String origem = '*'}) {
  final cabecalhos = {
    'access-control-allow-origin': origem,
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization',
    'access-control-max-age': '86400',
  };

  return (Handler proximo) {
    return (Request requisicao) async {
      // A requisição de sondagem (preflight) enviada pelo navegador antes
      // de um PUT ou DELETE deve ser respondida sem chegar ao roteador.
      if (requisicao.method == 'OPTIONS') {
        return Response(204, headers: cabecalhos);
      }
      final resposta = await proximo(requisicao);
      return resposta.change(headers: cabecalhos);
    };
  };
}
```

<aside class="positive">

**Observação:** os imports de `../core/erros.dart` e `problem.dart` só passam a ser usados na parte 2 deste arquivo, no próximo passo. Até lá, o `dart analyze` pode apontar esses imports como não utilizados.

</aside>

### Entendendo o CORS

O *middleware* acima tem quatro linhas de cabeçalhos que costumam ser copiadas sem entendimento, e depois cobradas caro quando algo não funciona. Vale gastar algum tempo com elas.

> **Política de mesma origem**
>
> Regra de segurança implementada por todos os navegadores desde os anos 1990: uma página só pode **ler** respostas de requisições feitas para a mesma origem de onde ela veio. **Origem** é a tripla *esquema + host + porta* — e as três partes precisam ser idênticas.

A tabela abaixo mostra como essa comparação é literal. Todas as linhas são comparadas com a origem `https://app.terrarios.dev` (porta 443, implícita no esquema `https`).

**O que conta como mesma origem**

| URL de destino | Mesma origem? | Por quê |
| --- | --- | --- |
| `https://app.terrarios.dev/api` | sim | só o caminho mudou, e caminho não faz parte da origem |
| `http://app.terrarios.dev` | não | esquema diferente |
| `https://api.terrarios.dev` | não | *host* diferente, ainda que o domínio seja o mesmo |
| `https://app.terrarios.dev:8080` | não | porta diferente |
| `http://localhost:8080` | não | as três partes diferem |

A razão de ser da política é impedir um ataque específico. Sem ela, um site malicioso aberto em outra aba poderia disparar uma requisição para o seu banco, que enviaria os *cookies* de sessão automaticamente, e ler a resposta com o seu saldo. A política não impede o **envio** da requisição — impede que o JavaScript da página maliciosa **enxergue** o que voltou.

![A página em https://app.terrarios.dev faz duas requisições: para https://app.terrarios.dev/api, mesma origem, a resposta é legível pelo JavaScript; para http://localhost:8080, outra origem, a resposta é bloqueada, a menos que o servidor autorize por CORS](img/fig-15.webp)

*A política de mesma origem bloqueia a leitura da resposta, não o envio da requisição. O CORS é o mecanismo pelo qual o servidor declara que aquela leitura é permitida.*

> **CORS**
>
> *Cross-Origin Resource Sharing* é o conjunto de cabeçalhos HTTP com que um servidor autoriza páginas de outras origens a lerem suas respostas. Quem aplica a regra é sempre o **navegador**: ele recebe a resposta, procura o cabeçalho `Access-Control-Allow-Origin` e decide se entrega o conteúdo ao JavaScript ou se lança um erro no console.

<aside class="positive">

**Por isso o curl nunca reclama.** CORS não é uma proteção do servidor. `curl`, Postman, um aplicativo Flutter ou outro serviço no *back end* ignoram completamente esses cabeçalhos — eles não são navegadores e não implementam a política. Se a sua API responde no `curl` mas falha no navegador com mensagem de CORS, o problema está nos cabeçalhos, não na rota.

</aside>

### Requisições simples e requisições com sondagem

O navegador divide as requisições entre origens em duas categorias. Uma requisição é **simples** quando usa apenas GET, HEAD ou POST e não carrega cabeçalhos incomuns — nesse caso ela é enviada direto, e o navegador só verifica a autorização na volta.

Qualquer coisa fora disso — um PUT, um DELETE, um `Content-Type: application/json`, um cabeçalho `Authorization` — dispara antes uma **requisição de sondagem**, o *preflight*: um OPTIONS que pergunta ao servidor se aquela operação seria permitida. Só depois de uma resposta favorável o navegador envia a requisição de verdade.

![Diagrama de sequência entre navegador e API: 1. OPTIONS /api/v1/terrarios/7 com Origin, Access-Control-Request-Method: PUT e Access-Control-Request-Headers: Content-Type; 2. resposta 204 No Content com Access-Control-Allow-Origin, Allow-Methods, Allow-Headers e Max-Age 86400; o navegador aprova e só então envia 3. PUT /api/v1/terrarios/7 com Content-Type: application/json; 4. resposta 200 OK com Access-Control-Allow-Origin](img/fig-16.webp)

*O ciclo completo de uma requisição com sondagem: são duas idas e voltas, e a primeira nunca chega ao roteador da aplicação.*

A figura acima explica cada decisão do *middleware*. O OPTIONS é interceptado **antes** de chegar ao `Router` porque não existe rota alguma para ele — é uma pergunta sobre a rota, não uma chamada a ela.

O código **204** é a resposta certa para essa pergunta. Ele significa sucesso, e não há corpo nenhum a devolver, que é exatamente o caso: toda a informação está nos cabeçalhos. Um 200 com corpo vazio funcionaria, mas seria menos preciso, e um 404 faria o navegador concluir que a operação não é permitida.

O `Access-Control-Max-Age` evita que essa ida e volta extra se repita a cada requisição: com 86400 segundos, o navegador guarda a autorização por um dia e passa a enviar apenas as requisições reais.

<aside class="negative">

**Atenção: o asterisco tem limite.** `Access-Control-Allow-Origin: *` libera qualquer origem e é aceitável em uma API pública de leitura, mas o navegador recusa a combinação de asterisco com credenciais: se a requisição enviar *cookies* ou usar `credentials: 'include'`, é obrigatório declarar a origem exata e acrescentar `Access-Control-Allow-Credentials: true`. Em produção, o padrão é manter uma lista de origens conhecidas e devolver no cabeçalho a origem recebida, quando ela estiver na lista.

</aside>

**Terminal — simulando a sondagem com curl**

```text
$ curl -i -X OPTIONS http://localhost:8080/api/v1/terrarios/7 \
    -H 'Origin: https://app.terrarios.dev' \
    -H 'Access-Control-Request-Method: PUT'

HTTP/1.1 204 No Content
access-control-allow-origin: *
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
access-control-allow-headers: Content-Type, Authorization
access-control-max-age: 86400
```

<aside class="positive">

**No mercado: onde o CORS costuma ser resolvido.** Em produção, é comum que a API e o *front end* sejam servidos pelo mesmo domínio através de um *proxy* reverso — e aí não existe origem cruzada nenhuma, o problema simplesmente desaparece. Quando a separação é inevitável, a configuração costuma ficar no *gateway* ou no balanceador, e não em cada serviço. O *middleware* deste codelab resolve o cenário de desenvolvimento, em que o *front end* roda em `localhost:3000` e a API em `localhost:8080` — portas diferentes, origens diferentes.

</aside>

## Tratamento de erros
Duration: 8:00

O tratamento de erros é o *middleware* mais importante da pilha. Ele é a única fronteira entre as exceções do domínio e o mundo HTTP, e graças ao `sealed class` o compilador cobra que todos os casos sejam cobertos.

Acrescente o trecho a seguir **ao final do mesmo arquivo `middlewares.dart`**, depois do `liberarCors`. A primeira linha é apenas um lembrete do que já está lá; digite somente o restante.

**lib/src/web/middlewares.dart · parte 2 de 2**

```dart
// ... registrarAcessos e liberarCors já apresentados ...

/// Converte exceções em respostas HTTP.
///
/// [detalharFalhas] deve ser falso em produção: mensagens internas podem
/// revelar nomes de tabelas, caminhos de arquivo e versões de bibliotecas.
Middleware tratarErros({required bool detalharFalhas}) {
  return (Handler proximo) {
    return (Request requisicao) async {
      try {
        return await proximo(requisicao);
      } on ErroApp catch (erro) {
        return _traduzir(erro);
      } catch (erro, pilha) {
        // Falha não prevista: registra tudo internamente e devolve pouco.
        stderr.writeln('Erro nao tratado: $erro\n$pilha');
        return problema(
          status: 500,
          tipo: 'falha-interna',
          titulo: 'Erro interno',
          detalhe: detalharFalhas
              ? erro.toString()
              : 'Ocorreu uma falha inesperada. Tente novamente mais tarde.',
        );
      }
    };
  };
}

/// O switch é exaustivo: acrescentar um novo tipo de ErroApp sem tratá-lo
/// aqui provoca erro de compilação.
Response _traduzir(ErroApp erro) {
  return switch (erro) {
    NaoEncontrado() => problema(
        status: 404,
        tipo: 'nao-encontrado',
        titulo: 'Recurso nao encontrado',
        detalhe: erro.mensagem,
      ),
    ErroValidacao() => problema(
        status: 422,
        tipo: 'validacao',
        titulo: 'Dados invalidos',
        detalhe: erro.mensagem,
        extras: {'errors': erro.campos},
      ),
    Conflito() => problema(
        status: 409,
        tipo: 'conflito',
        titulo: 'Conflito com o estado atual',
        detalhe: erro.mensagem,
      ),
    RequisicaoInvalida() => problema(
        status: 400,
        tipo: 'requisicao-invalida',
        titulo: 'Requisicao malformada',
        detalhe: erro.mensagem,
      ),
  };
}
```

<aside class="negative">

**Atenção: o que não devolver em um erro 500.** Mensagens de exceção e pilhas de chamada são material de reconhecimento para um atacante: revelam a versão da biblioteca de banco, a estrutura de diretórios e às vezes trechos de SQL. Elas devem ir para o log do servidor, nunca para o corpo da resposta em produção.

</aside>

## O controlador
Duration: 20:00

O controlador é fino de propósito. Ele extrai parâmetros, converte JSON em objetos, chama o serviço e escolhe o código de status. Nenhuma regra de negócio mora aqui.

Crie a pasta `lib/src/controllers/` e, dentro dela, o arquivo `terrario_controller.dart`. Começamos pelos métodos auxiliares, que são usados por todas as rotas: serializar JSON, validar o identificador vindo da URL e ler o corpo da requisição.

**lib/src/controllers/terrario_controller.dart · parte 1 de 5**

```dart
import 'dart:convert';

import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';

import '../core/erros.dart';
import '../models/terrario.dart';
import '../repositories/terrario_repository.dart';
import '../services/terrario_service.dart';

class TerrarioController {
  TerrarioController(this._service);

  final TerrarioService _service;

  /// Serializa um mapa como JSON com o cabeçalho correto.
  Response _json(
    int status,
    Object corpo, {
    Map<String, String> cabecalhos = const {},
  }) {
    return Response(
      status,
      body: jsonEncode(corpo),
      headers: {
        'content-type': 'application/json; charset=utf-8',
        ...cabecalhos,
      },
    );
  }

  /// Converte o segmento de URL em inteiro, recusando lixo como /terrarios/abc.
  int _idValido(String bruto) {
    final id = int.tryParse(bruto);
    if (id == null || id < 1) {
      throw RequisicaoInvalida('O identificador "$bruto" nao e um numero.');
    }
    return id;
  }
```

O terceiro auxiliar lê o corpo da requisição. Ele recusa cedo o que não tem chance de dar certo — tipo de mídia errado, corpo vazio, JSON malformado — e traduz cada situação em uma exceção de domínio, que o *middleware* de erros converterá em 400. **Continue no mesmo arquivo.**

**lib/src/controllers/terrario_controller.dart · parte 2 de 5**

```dart
  /// Lê e decodifica o corpo da requisição.
  Future<Map<String, dynamic>> _lerJson(Request requisicao) async {
    final tipo = requisicao.headers['content-type'] ?? '';
    if (!tipo.contains('application/json')) {
      throw RequisicaoInvalida('Envie o corpo com Content-Type application/json.');
    }

    final texto = await requisicao.readAsString();
    if (texto.trim().isEmpty) {
      throw RequisicaoInvalida('O corpo da requisicao esta vazio.');
    }

    try {
      final decodificado = jsonDecode(texto);
      if (decodificado is! Map<String, dynamic>) {
        throw RequisicaoInvalida('O corpo deve ser um objeto JSON.');
      }
      return decodificado;
    } on FormatException {
      throw RequisicaoInvalida('O corpo nao e um JSON valido.');
    }
  }
```

Ainda falta um auxiliar, e é o mais delicado: o que transforma o mapa recebido em uma entidade. Ele acumula todos os problemas de forma antes de decidir, para que o cliente receba a lista completa de campos a corrigir de uma só vez. **Continue no mesmo arquivo.**

**lib/src/controllers/terrario_controller.dart · parte 3 de 5**

```dart
  /// Converte o mapa recebido em uma entidade, acumulando problemas de
  /// tipo e de campos ausentes. Regras de faixa e de tamanho continuam
  /// no serviço; aqui trata-se apenas da forma dos dados.
  Terrario _montarTerrario(Map<String, dynamic> corpo) {
    final erros = <String, String>{};

    final apelido = corpo['apelido'];
    if (apelido is! String) erros['apelido'] = 'Campo obrigatorio do tipo texto.';

    final biomaBruto = corpo['bioma'];
    final bioma = biomaBruto is String ? Bioma.porNome(biomaBruto) : null;
    if (bioma == null) {
      erros['bioma'] =
          'Use um destes valores: ${Bioma.values.map((b) => b.name).join(', ')}.';
    }

    final umidade = corpo['umidadeAlvo'];
    if (umidade is! int) erros['umidadeAlvo'] = 'Campo obrigatorio do tipo inteiro.';

    final volume = corpo['volumeLitros'];
    if (volume is! num) erros['volumeLitros'] = 'Campo obrigatorio do tipo numerico.';

    final dataBruta = corpo['dataMontagem'];
    DateTime? data;
    if (dataBruta is String) data = DateTime.tryParse(dataBruta);
    if (data == null) erros['dataMontagem'] = 'Use o formato AAAA-MM-DD.';

    if (erros.isNotEmpty) {
      throw ErroValidacao('Os dados enviados sao invalidos.', erros);
    }

    return Terrario(
      apelido: (apelido as String).trim(),
      bioma: bioma!,
      umidadeAlvo: umidade as int,
      volumeLitros: (volume as num).toDouble(),
      dataMontagem: data!,
    );
  }
```

<aside class="positive">

**Boa prática: dois níveis de validação.** O controlador verifica a **forma** (o campo veio? é do tipo certo?) e responde com o mesmo formato de erro do serviço. O serviço verifica o **significado** (a umidade cabe na faixa? a data é passada?). Manter os dois separados evita que o serviço precise lidar com `dynamic` e evita que o controlador conheça regras de negócio.

</aside>

Com os auxiliares no lugar, entram as rotas. O *getter* `router` associa cada combinação de verbo e caminho ao método que a atende, e os dois primeiros métodos são os de leitura. **Continue no mesmo arquivo**, logo abaixo do `_montarTerrario`.

**lib/src/controllers/terrario_controller.dart · parte 4 de 5**

```dart
  /// Cada controlador expõe seu próprio roteador, que depois é montado
  /// sob um prefixo pelo roteador principal.
  Router get router {
    final router = Router();

    router.get('/', _listar);
    router.get('/<id>', _buscar);
    router.post('/', _criar);
    router.put('/<id>', _atualizar);
    router.delete('/<id>', _remover);

    return router;
  }

  Future<Response> _listar(Request requisicao) async {
    final q = requisicao.url.queryParameters;

    final filtro = FiltroTerrario(
      bioma: Bioma.porNome(q['bioma']),
      umidadeMinima: int.tryParse(q['umidadeMinima'] ?? ''),
      pagina: int.tryParse(q['pagina'] ?? '') ?? 1,
      tamanhoPagina: int.tryParse(q['tamanhoPagina'] ?? '') ?? 20,
    );

    final pagina = await _service.listar(filtro);

    return _json(200, {
      'itens': pagina.itens.map((t) => t.toJson()).toList(),
      'pagina': pagina.pagina,
      'tamanhoPagina': pagina.tamanhoPagina,
      'total': pagina.total,
      'totalPaginas': pagina.totalPaginas,
    });
  }

  Future<Response> _buscar(Request requisicao, String id) async {
    final terrario = await _service.buscarPorId(_idValido(id));
    return _json(200, terrario.toJson());
  }
```

As três rotas de escrita completam o controlador. **Continue no mesmo arquivo**; a chave final é a que fecha a classe.

**lib/src/controllers/terrario_controller.dart · parte 5 de 5**

```dart
  Future<Response> _criar(Request requisicao) async {
    final corpo = await _lerJson(requisicao);
    final criado = await _service.criar(_montarTerrario(corpo));

    // 201 acompanhado de Location é o contrato esperado para criação:
    // o cliente descobre a URI do novo recurso sem precisar montá-la.
    return _json(
      201,
      criado.toJson(),
      cabecalhos: {'location': '/api/v1/terrarios/${criado.id}'},
    );
  }

  Future<Response> _atualizar(Request requisicao, String id) async {
    final corpo = await _lerJson(requisicao);
    final atualizado =
        await _service.atualizar(_idValido(id), _montarTerrario(corpo));
    return _json(200, atualizado.toJson());
  }

  Future<Response> _remover(Request requisicao, String id) async {
    await _service.remover(_idValido(id));
    // 204: sucesso sem corpo. Devolver um JSON dizendo "removido com
    // sucesso" seria redundante com o próprio código de status.
    return Response(204);
  }
}
```

<aside class="negative">

**Atenção:** na apostila em PDF, este último bloco termina com duas chaves de fechamento seguidas; a segunda é um erro de digitação e foi removida aqui. O arquivo deve terminar com **uma única** `}` fechando a classe `TerrarioController`.

</aside>

## Saúde, montagem e servidor completo
Duration: 15:00

### Verificação de saúde

Todo serviço em produção precisa de um endereço que responda rápido dizendo se está vivo. Orquestradores usam essa resposta para decidir se reiniciam o contêiner ou se o incluem no balanceamento.

Crie o arquivo `health_controller.dart` na pasta `lib/src/controllers/`.

**lib/src/controllers/health_controller.dart**

```dart
import 'dart:convert';

import 'package:mysql_dart/mysql_dart.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';

class HealthController {
  HealthController(this._pool);

  final MySQLConnectionPool _pool;

  Router get router {
    final router = Router();

    // Liveness: o processo está de pé? Não toca no banco de propósito,
    // para que uma indisponibilidade do MySQL não faça o orquestrador
    // matar um processo que está perfeitamente saudável.
    router.get('/live', (Request _) => _json(200, {'status': 'ok'}));

    // Readiness: o serviço consegue atender de verdade? Aqui sim o banco
    // é consultado, porque sem ele a API não tem o que responder.
    router.get('/ready', (Request _) async {
      try {
        await _pool.execute('SELECT 1');
        return _json(200, {'status': 'ok', 'banco': 'ok'});
      } catch (_) {
        return _json(503, {'status': 'degradado', 'banco': 'indisponivel'});
      }
    });

    return router;
  }

  Response _json(int status, Map<String, dynamic> corpo) => Response(
        status,
        body: jsonEncode(corpo),
        headers: {'content-type': 'application/json; charset=utf-8'},
      );
}
```

### Montando a aplicação

Um único arquivo conhece todas as peças e as conecta. Esse ponto de montagem — frequentemente chamado de *composition root* — é o lugar onde a injeção de dependência acontece, aqui feita à mão, sem nenhuma biblioteca.

Crie o arquivo `api.dart` diretamente em `lib/src/`, um nível acima das pastas de camadas.

**lib/src/api.dart**

```dart
import 'package:mysql_dart/mysql_dart.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';

import 'config/app_config.dart';
import 'controllers/health_controller.dart';
import 'controllers/terrario_controller.dart';
import 'repositories/mysql_terrario_repository.dart';
import 'services/terrario_service.dart';
import 'web/middlewares.dart';
import 'web/problem.dart';

/// Constrói o handler completo da aplicação: rotas mais pilha de middlewares.
Handler construirApi(AppConfig config, MySQLConnectionPool pool) {
  // As dependências são criadas de fora para dentro e injetadas por
  // construtor. Trocar MySqlTerrarioRepository por uma implementação em
  // memória é uma alteração de uma linha.
  final repository = MySqlTerrarioRepository(pool);
  final service = TerrarioService(repository);
  final terrarios = TerrarioController(service);
  final health = HealthController(pool);

  final raiz = Router();

  raiz.mount('/api/v1/terrarios', terrarios.router.call);
  raiz.mount('/health', health.router.call);

  // Rota curinga: captura tudo o que não casou com as rotas acima.
  // A sintaxe <nome|expressão> do shelf_router declara um parâmetro
  // chamado "ignorado" cujo valor precisa casar com a expressão regular
  // ".*" — ou seja, qualquer coisa, inclusive barras. O nome existe só
  // porque a sintaxe exige um; o valor não é usado. E "all" significa
  // qualquer verbo HTTP.
  raiz.all('/<ignorado|.*>', (Request requisicao) {
    return problema(
      status: 404,
      tipo: 'rota-inexistente',
      titulo: 'Rota nao encontrada',
      detalhe: 'Nao existe ${requisicao.method} /${requisicao.url.path}.',
    );
  });

  // A ordem importa: o log é o mais externo para medir o tempo total,
  // e o tratamento de erros precisa envolver o roteador.
  return const Pipeline()
      .addMiddleware(registrarAcessos())
      .addMiddleware(liberarCors())
      .addMiddleware(tratarErros(detalharFalhas: !config.producao))
      .addHandler(raiz.call);
}
```

### O servidor completo

**Substitua novamente** todo o conteúdo do `bin/server.dart` pelo código abaixo — esta é a versão definitiva. Em relação à versão do passo "O primeiro servidor HTTP", ele ganha a criação do pool, a espera pelo banco, o *handler* montado por `construirApi` e o desligamento gracioso.

**bin/server.dart**

```dart
import 'dart:io';

import 'package:shelf/shelf_io.dart' as shelf_io;
import 'package:terrario_api/src/api.dart';
import 'package:terrario_api/src/config/app_config.dart';
import 'package:terrario_api/src/config/database.dart';

Future<void> main() async {
  final config = AppConfig.fromEnv();
  stdout.writeln('Iniciando com $config');

  final pool = criarPool(config);

  // O contêiner do banco pode demorar dezenas de segundos na primeira
  // subida, enquanto executa os scripts de inicialização.
  stdout.writeln('Aguardando o banco de dados...');
  await aguardarBanco(pool);
  stdout.writeln('Banco disponivel.');

  final servidor = await shelf_io.serve(
    construirApi(config, pool),
    InternetAddress.anyIPv4,
    config.serverPort,
  );

  stdout.writeln('Servidor ouvindo em http://localhost:${servidor.port}');

  // Desligamento gracioso: ao receber SIGTERM (enviado por
  // "docker stop" e pelo Kubernetes) ou SIGINT (Ctrl+C), o servidor
  // para de aceitar novas conexões, conclui as que estão em andamento
  // e só então fecha o pool. Sem isso, requisições em voo são
  // interrompidas no meio e transações podem ficar penduradas.
  Future<void> desligar(ProcessSignal sinal) async {
    stdout.writeln('Recebido $sinal, encerrando...');
    await servidor.close();
    await pool.close();
    exit(0);
  }

  ProcessSignal.sigint.watch().listen(desligar);
  if (!Platform.isWindows) {
    ProcessSignal.sigterm.watch().listen(desligar);
  }
}
```

> **Sinais do sistema operacional**
>
> Sinais são notificações assíncronas que o sistema operacional entrega a um processo. Dois interessam aqui:
>
> * **SIGINT** (*signal interrupt*, número 2) é o que o terminal envia quando você pressiona Ctrl+C. É o pedido de interrupção interativo, feito por uma pessoa.
> * **SIGTERM** (*signal terminate*, número 15) é o pedido educado de encerramento feito por outro programa. É o que o `docker stop` envia, o que o `systemctl stop` envia e o que o Kubernetes envia antes de remover um *pod*.
>
> Os dois podem ser observados pelo processo, que decide o que fazer antes de sair. Existe um terceiro, **SIGKILL** (número 9), que não pode ser interceptado: o kernel encerra o processo na hora, sem dar chance de salvar nada.

Essa diferença define o comportamento do `docker stop`: ele envia SIGTERM, espera dez segundos e, se o processo ainda estiver de pé, envia SIGKILL. A janela de dez segundos existe justamente para o desligamento gracioso acontecer — e um servidor que ignora SIGTERM é morto à força ao fim dela, no meio do que estiver fazendo.

![Fluxo do docker stop: SIGTERM recebido leva a servidor.close(), requisições em voo terminam, pool.close() e exit(0); se ninguém tratar o SIGTERM, após 10 segundos vem o SIGKILL, com encerramento abrupto e conexões cortadas no meio](img/fig-17.webp)

*Tratar SIGTERM transforma um encerramento abrupto em uma saída ordenada dentro da janela de dez segundos concedida pelo Docker.*

<aside class="negative">

**Atenção:** SIGTERM não existe no Windows; tentar observá-lo lá lança exceção. A verificação de plataforma evita que o servidor quebre ao iniciar em máquinas de desenvolvimento com Windows — lá o Ctrl+C e o SIGINT continuam funcionando normalmente.

</aside>

## Exercitando a API
Duration: 8:00

Com o contêiner do MySQL do passo "O banco MySQL em um contêiner" ainda rodando na porta 3307, basta executar o servidor. Se ele tiver sido parado, retome com `docker start mysql-terrarios`.

**Terminal — listando**

```text
$ dart run bin/server.dart
Iniciando com AppConfig(appEnv: development, serverPort: 8080, ...)
Aguardando o banco de dados...
Banco disponivel.
Servidor ouvindo em http://localhost:8080

$ curl -s 'http://localhost:8080/api/v1/terrarios?bioma=tropical'
{"itens":[{"id":1,"apelido":"Vale das Samambaias","bioma":"tropical",
"umidadeAlvo":85,"volumeLitros":12.5,"dataMontagem":"2026-03-14",
"criadoEm":"2026-09-01T12:00:00.000","atualizadoEm":"2026-09-01T12:00:00.000"}],
"pagina":1,"tamanhoPagina":20,"total":1,"totalPaginas":1}
```

**Terminal — criando**

```text
$ curl -i -X POST http://localhost:8080/api/v1/terrarios \
     -H 'Content-Type: application/json' \
     -d '{"apelido":"Névoa de Kyoto","bioma":"musgo",
          "umidadeAlvo":90,"volumeLitros":6.5,"dataMontagem":"2026-06-21"}'

HTTP/1.1 201 Created
location: /api/v1/terrarios/5
content-type: application/json; charset=utf-8
```

**Terminal — erro de validação**

```text
$ curl -s -X PUT http://localhost:8080/api/v1/terrarios/1 \
     -H 'Content-Type: application/json' \
     -d '{"apelido":"Ok","bioma":"marte",
          "umidadeAlvo":130,"volumeLitros":-2,"dataMontagem":"2030-01-01"}'

{"type":"https://api.terrarios.local/problemas/validacao",
 "title":"Dados invalidos","status":422,
 "detail":"Os dados enviados sao invalidos.",
 "errors":{"bioma":"Use um destes valores: tropical, desertico, temperado, musgo.",
           "dataMontagem":"Use o formato AAAA-MM-DD."}}
```

**Terminal — removendo**

```text
$ curl -i -X DELETE http://localhost:8080/api/v1/terrarios/5
HTTP/1.1 204 No Content

$ curl -i -X DELETE http://localhost:8080/api/v1/terrarios/5
HTTP/1.1 404 Not Found
content-type: application/problem+json; charset=utf-8
```

Neste ponto a API está firmemente no **nível 2**: recursos com URIs próprias, verbos com semântica correta, códigos de status significativos e erros padronizados. Falta o último degrau.

## Subindo ao nível 3 com HATEOAS
Duration: 15:00

### Construindo links

Espalhar a montagem de URIs pelo controlador levaria a caminhos escritos à mão em vários pontos. Um módulo dedicado concentra essa responsabilidade.

Crie o arquivo `links.dart` na pasta `lib/src/web/`.

**lib/src/web/links.dart**

```dart
import '../models/terrario.dart';
import '../repositories/terrario_repository.dart';

/// Prefixo comum de todos os recursos desta versão da API.
const String baseApi = '/api/v1';

/// Um controle de hipermídia: para onde ir e com qual verbo.
Map<String, String> _link(String href, String metodo) => {
      'href': href,
      'method': metodo,
    };

/// Links de um terrário individual.
///
/// A relação `edit` só aparece quando o recurso pode de fato ser alterado.
/// É essa condicionalidade que dá valor real ao HATEOAS: o cliente não
/// reimplementa a regra, apenas verifica se o link existe.
Map<String, Map<String, String>> linksDoTerrario(Terrario t) {
  final self = '$baseApi/terrarios/${t.id}';

  final links = <String, Map<String, String>>{
    'self': _link(self, 'GET'),
    'collection': _link('$baseApi/terrarios', 'GET'),
  };

  final editavel = t.dataMontagem.isAfter(
    DateTime.now().toUtc().subtract(const Duration(days: 365)),
  );
  if (editavel) {
    links['edit'] = _link(self, 'PUT');
    links['delete'] = _link(self, 'DELETE');
  }

  return links;
}

/// Links de navegação de uma coleção paginada.
Map<String, Map<String, String>> linksDaColecao(
  Pagina<Terrario> pagina,
  Map<String, String> filtrosAtuais,
) {
  String url(int numero) {
    final parametros = <String, String>{
      ...filtrosAtuais,
      'pagina': '$numero',
      'tamanhoPagina': '${pagina.tamanhoPagina}',
    };
    final query = parametros.entries
        .map((e) => '${e.key}=${Uri.encodeQueryComponent(e.value)}')
        .join('&');
    return '$baseApi/terrarios?$query';
  }

  final links = <String, Map<String, String>>{
    'self': _link(url(pagina.pagina), 'GET'),
    'first': _link(url(1), 'GET'),
    'last': _link(url(pagina.totalPaginas), 'GET'),
    'create': _link('$baseApi/terrarios', 'POST'),
  };

  if (pagina.temAnterior) links['prev'] = _link(url(pagina.pagina - 1), 'GET');
  if (pagina.temProxima) links['next'] = _link(url(pagina.pagina + 1), 'GET');

  return links;
}
```

### Injetando os links nas respostas

O controlador passa a envolver cada representação com seus controles. Abra novamente o controlador e faça três alterações pontuais: acrescente a importação de `links.dart` no topo e ajuste o retorno dos métodos `_listar`, `_buscar` e `_criar`. Os comentários `// ...` e as linhas que você já tem localizam cada ponto; o que é novo é o import de `links.dart`, o mapa `filtrosAtuais` e as entradas `_links` nas respostas.

**lib/src/controllers/terrario_controller.dart**

```dart
import '../services/terrario_service.dart';
import '../web/links.dart';

class TerrarioController {
  // ... construtor e router já apresentados ...

  Future<Response> _listar(Request requisicao) async {
    final q = requisicao.url.queryParameters;
    // ... montagem do filtro já apresentada ...
    final pagina = await _service.listar(filtro);

    // Preserva os filtros ativos nos links de paginação, para que
    // avançar de página não perca o critério de busca.
    final filtrosAtuais = <String, String>{
      if (q['bioma'] != null) 'bioma': q['bioma']!,
      if (q['umidadeMinima'] != null) 'umidadeMinima': q['umidadeMinima']!,
    };

    return _json(200, {
      'itens': pagina.itens
          .map((t) => {...t.toJson(), '_links': linksDoTerrario(t)})
          .toList(),
      'pagina': pagina.pagina,
      'tamanhoPagina': pagina.tamanhoPagina,
      'total': pagina.total,
      'totalPaginas': pagina.totalPaginas,
      '_links': linksDaColecao(pagina, filtrosAtuais),
    });
  }

  Future<Response> _buscar(Request requisicao, String id) async {
    final terrario = await _service.buscarPorId(_idValido(id));
    return _json(200, {
      ...terrario.toJson(),
      '_links': linksDoTerrario(terrario),
    });
  }

  Future<Response> _criar(Request requisicao) async {
    final corpo = await _lerJson(requisicao);
    final criado = await _service.criar(_montarTerrario(corpo));

    return _json(
      201,
      {...criado.toJson(), '_links': linksDoTerrario(criado)},
      cabecalhos: {'location': '/api/v1/terrarios/${criado.id}'},
    );
  }
```

### O resultado

**Terminal — coleção com hipermídia**

```bash
curl -s 'http://localhost:8080/api/v1/terrarios?tamanhoPagina=2&pagina=2'
```

**Resposta**

```json
{
  "itens": [
    {
      "id": 3, "apelido": "Bosque de Musgo", "bioma": "musgo",
      "umidadeAlvo": 92, "volumeLitros": 7.25, "dataMontagem": "2025-11-30",
      "_links": {
        "self":       {"href": "/api/v1/terrarios/3", "method": "GET"},
        "collection": {"href": "/api/v1/terrarios",   "method": "GET"}
      }
    },
    {
      "id": 4, "apelido": "Clareira Fria", "bioma": "temperado",
      "umidadeAlvo": 60, "volumeLitros": 18.0, "dataMontagem": "2026-05-02",
      "_links": {
        "self":       {"href": "/api/v1/terrarios/4", "method": "GET"},
        "collection": {"href": "/api/v1/terrarios",   "method": "GET"},
        "edit":       {"href": "/api/v1/terrarios/4", "method": "PUT"},
        "delete":     {"href": "/api/v1/terrarios/4", "method": "DELETE"}
      }
    }
  ],
  "pagina": 2, "tamanhoPagina": 2, "total": 4, "totalPaginas": 2,
  "_links": {
    "self":   {"href": "/api/v1/terrarios?pagina=2&tamanhoPagina=2", "method": "GET"},
    "first":  {"href": "/api/v1/terrarios?pagina=1&tamanhoPagina=2", "method": "GET"},
    "last":   {"href": "/api/v1/terrarios?pagina=2&tamanhoPagina=2", "method": "GET"},
    "prev":   {"href": "/api/v1/terrarios?pagina=1&tamanhoPagina=2", "method": "GET"},
    "create": {"href": "/api/v1/terrarios", "method": "POST"}
  }
}
```

Repare no item 3: montado em novembro de 2025, ele passou do prazo de edição e por isso a resposta não traz `edit` nem `delete`. O item 4, mais recente, traz. Um cliente bem escrito simplesmente não desenha os botões cuja relação está ausente.

<aside class="positive">

**Boa prática: um único ponto de entrada.** Complemente a API com uma rota raiz que devolva apenas links. Assim o cliente precisa conhecer somente `/api/v1` e descobre o resto navegando, que é o princípio central do nível 3.

</aside>

<aside class="positive">

**No mercado: até onde ir.** Muitas equipes consideram HATEOAS completo um custo alto para o benefício obtido, e param no par `self` mais links de paginação — que já elimina a construção manual de URIs de navegação, o maior causador de quebras quando a API evolui. A decisão consciente entre quanto de hipermídia adotar é o que distingue uma escolha arquitetural de um desconhecimento do modelo.

</aside>

## Documentação com OpenAPI e Swagger
Duration: 15:00

### Contrato antes de prosa

Documentação escrita em texto livre envelhece mal: ninguém lembra de atualizá-la quando um campo muda de nome. A **OpenAPI** resolve isso descrevendo a API em um arquivo estruturado que serve simultaneamente como documentação legível, como fonte para gerar clientes em várias linguagens e como base para testes de contrato, conforme resume a figura abaixo.

![O arquivo openapi.yaml, o contrato, alimenta três usos: o Swagger UI em /docs para o navegador do time, a geração de clientes para o app Flutter e SDKs, e os testes de contrato na esteira de CI](img/fig-18.webp)

*Um único arquivo de contrato alimenta a interface de exploração, a geração de clientes e a verificação automatizada.*

### O arquivo de contrato

Crie o arquivo `openapi.yaml` **na raiz do projeto**, ao lado do `pubspec.yaml` — ele precisa estar ali porque será copiado para dentro da imagem Docker.

Para não transformar este passo em duzentas linhas de digitação, apenas uma operação será documentada por inteiro: a listagem de terrários. Ela usa todos os recursos que as demais precisariam — parâmetros de consulta, esquemas reaproveitados por referência e resposta estruturada — de modo que estender o contrato para as outras rotas vira repetição do mesmo padrão.

**openapi.yaml · parte 1 de 2**

```yaml
openapi: 3.1.0

info:
  title: API de Terrários
  description: Catálogo de terrários com filtros, paginação e hipermídia.
  version: 1.0.0

servers:
  - url: /api/v1
    description: Servidor atual

# Blocos reutilizáveis. Definir uma vez aqui e referenciar com $ref evita
# repetir a mesma estrutura em cada operação — e garante que corrigir um
# campo corrija todos os lugares onde ele aparece.
components:
  schemas:
    Bioma:
      type: string
      enum: [tropical, desertico, temperado, musgo]

    Link:
      type: object
      properties:
        href: { type: string, example: /api/v1/terrarios/7 }
        method: { type: string, example: GET }

    Terrario:
      type: object
      properties:
        id: { type: integer, example: 7 }
        apelido: { type: string, example: Vale das Samambaias }
        bioma:
          $ref: '#/components/schemas/Bioma'
        umidadeAlvo: { type: integer, minimum: 0, maximum: 100, example: 85 }
        volumeLitros: { type: number, format: double, example: 12.5 }
        dataMontagem: { type: string, format: date, example: '2026-03-14' }
        _links:
          type: object
          additionalProperties:
            $ref: '#/components/schemas/Link'

    PaginaDeTerrarios:
      type: object
      properties:
        itens:
          type: array
          items:
            $ref: '#/components/schemas/Terrario'
        pagina: { type: integer, example: 1 }
        tamanhoPagina: { type: integer, example: 20 }
        total: { type: integer, example: 4 }
        totalPaginas: { type: integer, example: 1 }
        _links:
          type: object
          additionalProperties:
            $ref: '#/components/schemas/Link'
```

A segunda metade descreve o caminho propriamente dito. **Continue no mesmo arquivo**: `paths` é uma chave de primeiro nível, irmã de `openapi`, `info`, `servers` e `components`, então ela começa **na coluna zero, sem nenhum recuo**. Em YAML a indentação é a única coisa que define hierarquia, e um espaço a mais aqui faria o `paths` virar filho do `components`.

**openapi.yaml · parte 2 de 2**

```yaml
# Chave de primeiro nível, no mesmo recuo de "openapi", "info" e "components".
paths:
  # Filho de paths: o caminho, relativo ao "url" declarado em servers.
  /terrarios:
    # Filho do caminho: o verbo HTTP.
    get:
      summary: Lista terrários com filtros e paginação
      # Cada parâmetro de consulta vira uma caixa preenchível na interface
      # do Swagger, com os limites aplicados na própria tela.
      parameters:
        - name: bioma
          in: query
          schema:
            $ref: '#/components/schemas/Bioma'
        - name: umidadeMinima
          in: query
          schema: { type: integer, minimum: 0, maximum: 100 }
        - name: pagina
          in: query
          schema: { type: integer, minimum: 1, default: 1 }
        - name: tamanhoPagina
          in: query
          schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
      responses:
        '200':
          description: Página de resultados
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginaDeTerrarios'
```

<aside class="positive">

**Boa prática: documentar o resto.** As demais operações seguem exatamente esta forma: `post` sob `/terrarios`, e `get`, `put` e `delete` sob `/terrarios/{id}`. Cada uma acrescenta um `requestBody` quando recebe dados e lista os códigos de erro possíveis em `responses`. Completar o contrato é o primeiro exercício natural depois deste passo.

</aside>

### Servindo a interface

Falta expor o contrato de um jeito navegável. O **Swagger UI** é uma aplicação JavaScript que lê um documento OpenAPI e desenha a partir dele uma página com cada operação, seus parâmetros e um botão para executar a requisição de verdade.

Existem pacotes que embrulham essa página, mas vários deles injetam o conteúdo do arquivo diretamente no JavaScript, o que só funciona quando o contrato está em JSON — com YAML, o navegador quebra com erro de sintaxe. Servir a página à mão custa pouco, elimina uma dependência e deixa claro o que está acontecendo: um arquivo HTML e um arquivo de contrato, nada além disso.

Crie a pasta `web/docs/` na raiz do projeto e, dentro dela, o arquivo `index.html`. O Swagger UI em si vem de uma CDN, então nada precisa ser baixado para dentro do projeto.

**web/docs/index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>API de Terrários</title>
  <!-- Folha de estilo oficial do Swagger UI, servida por CDN. -->
  <link rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
  <!-- O Swagger UI desenha a documentação dentro desta div. -->
  <div id="swagger"></div>

  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      // Caminho absoluto: funciona tanto em /docs quanto em /docs/.
      url: '/docs/openapi.yaml',
      dom_id: '#swagger',
      docExpansion: 'list'
    });
  </script>
</body>
</html>
```

Agora o controlador, que apenas entrega os dois arquivos com o tipo de mídia correto. Crie o arquivo `docs_controller.dart` na pasta `lib/src/controllers/`.

**lib/src/controllers/docs_controller.dart**

```dart
import 'dart:io';

import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';

/// Serve a documentação interativa da API.
///
/// São duas rotas, e as duas fazem a mesma coisa: ler um arquivo do disco e
/// devolvê-lo com o tipo de mídia adequado. Manter o HTML em um arquivo .html
/// — e não em uma String dentro desta classe — preserva o realce de sintaxe
/// no editor e evita misturar duas linguagens no mesmo arquivo.
class DocsController {
  DocsController({
    this.caminhoSpec = 'openapi.yaml',
    this.caminhoPagina = 'web/docs/index.html',
  });

  final String caminhoSpec;
  final String caminhoPagina;

  /// Lê um arquivo e o devolve, ou responde 404 quando ele não existe.
  Future<Response> _servirArquivo(String caminho, String tipoMidia) async {
    final arquivo = File(caminho);
    if (!await arquivo.exists()) {
      return Response.notFound('Arquivo nao encontrado: $caminho');
    }
    return Response.ok(
      await arquivo.readAsString(),
      headers: {'content-type': tipoMidia},
    );
  }

  Router get router {
    final router = Router();

    router.get('/openapi.yaml',
        (Request _) => _servirArquivo(caminhoSpec, 'application/yaml; charset=utf-8'));

    router.get('/',
        (Request _) => _servirArquivo(caminhoPagina, 'text/html; charset=utf-8'));

    return router;
  }
}
```

<aside class="positive">

**No mercado: `shelf_static` faz isso pronto.** Servir arquivos do disco é um problema resolvido, e o time do Dart mantém o pacote `shelf_static` exatamente para isso. Com ele, o controlador inteiro vira uma linha:

`raiz.mount('/docs', createStaticHandler('web/docs', defaultDocument: 'index.html'));`

O pacote resolve tipo de mídia por extensão, trata `index.html` como documento padrão e ainda cuida de cache e ETag — coisas que a nossa versão não faz. A escolha aqui foi didática: com dois arquivos, escrever o *handler* à mão mostra o que um servidor de estáticos realmente faz. Em um projeto que sirva um *front end* inteiro, use o `shelf_static`.

</aside>

<aside class="negative">

**Atenção: caminho relativo depende de onde o processo roda.** Os dois caminhos são resolvidos a partir do diretório atual do processo. Rodando `dart run` na raiz do projeto, funcionam. Dentro do contêiner funcionam porque o `Dockerfile` define `WORKDIR /app` e copia tanto o `openapi.yaml` quanto a pasta `web/` para lá. Se você executar o servidor de outra pasta, as rotas devolverão 404 — e é exatamente por isso que o `_servirArquivo` verifica a existência em vez de estourar uma exceção.

</aside>

Agora basta montar o novo controlador. Abra o `lib/src/api.dart` e acrescente a importação e a linha de montagem (`final docs = DocsController();` e `raiz.mount('/docs', ...)`); as demais linhas do bloco já existem e servem de referência.

**lib/src/api.dart**

```dart
import 'controllers/health_controller.dart';
import 'controllers/docs_controller.dart';
import 'controllers/terrario_controller.dart';
// ... demais importações já apresentadas ...

Handler construirApi(AppConfig config, MySQLConnectionPool pool) {
  // ... criação de repository, service, terrarios e health ...

  final docs = DocsController();

  final raiz = Router();

  raiz.mount('/api/v1/terrarios', terrarios.router.call);
  raiz.mount('/health', health.router.call);
  raiz.mount('/docs', docs.router.call);

  // ... rota curinga e pipeline já apresentados ...
}
```

**Terminal — abrindo a documentação**

```text
$ dart run bin/server.dart
Servidor ouvindo em http://localhost:8080

# o contrato puro:
$ curl -s http://localhost:8080/docs/openapi.yaml | head -3
openapi: 3.1.0
info:
  title: API de Terrários

# no navegador, a página interativa:
http://localhost:8080/docs/
```

<aside class="positive">

**No mercado: contrato primeiro.** Em equipes que trabalham com *contract first*, o `openapi.yaml` é escrito e revisado **antes** da implementação. O time de *front end* gera um cliente falso a partir dele e começa a trabalhar no mesmo dia que o time de *back end*, sem esperar o servidor ficar pronto. Ferramentas de *linting* de contrato, como o Spectral, entram na esteira de CI para recusar mudanças que quebrem compatibilidade.

</aside>

## Empacotando a API em uma imagem
Duration: 12:00

### Build em múltiplos estágios

Compilar exige o SDK inteiro, com compilador, analisador e cache de pacotes — centenas de megabytes que não têm utilidade nenhuma em produção. O *build* em múltiplos estágios resolve isso, como mostra a figura abaixo: um estágio compila, outro recebe apenas o executável pronto.

![Estágio build, a partir da imagem dart:3.12, executa dart pub get e dart compile exe, gerando o executável nativo server (cerca de 1,2 GB no total); com COPY --from=build apenas o runtime do Dart, o server e o openapi.yaml passam para a imagem final, com base scratch (cerca de 15 MB)](img/fig-19.webp)

*Somente o artefato compilado atravessa a fronteira entre os estágios; o SDK e o código-fonte ficam para trás.*

Antes do arquivo, vale conhecer as instruções que aparecem nele. Um `Dockerfile` é uma sequência de instruções executadas de cima para baixo, e cada uma produz uma nova camada da imagem.

**Instruções usadas no Dockerfile**

| Instrução | O que faz |
| --- | --- |
| `FROM` | Define a imagem de partida. Aparece duas vezes porque o *build* tem dois estágios; o `AS build` dá nome ao primeiro para que o segundo possa copiar dele. |
| `WORKDIR` | Define o diretório de trabalho dentro da imagem e o cria se não existir. Todas as instruções seguintes passam a ser relativas a ele. |
| `COPY` | Copia arquivos do contexto de *build* para dentro da imagem. Com `--from=build`, copia do estágio anterior em vez do disco. |
| `RUN` | Executa um comando **durante a construção** da imagem, e o resultado fica gravado na camada. |
| `EXPOSE` | Apenas documenta a porta que o processo usa. Não publica nada — quem publica é o `-p` ou o Compose. |
| `CMD` | Define o comando executado **quando o contêiner sobe**. Na forma de lista, o processo roda direto, sem *shell* intermediário. |

<aside class="negative">

**RUN e CMD são momentos diferentes.** Confundir os dois é o erro mais comum de quem começa. `RUN` acontece uma única vez, na sua máquina ou no servidor de *build*, e seu efeito vira parte da imagem. `CMD` não executa nada durante a construção: é só um registro do que deve ser executado depois, a cada `docker run`.

</aside>

Crie o arquivo `Dockerfile` na raiz do projeto, sem extensão.

**Dockerfile**

```dockerfile
# ---------- Estágio 1: compilação ----------
# A imagem oficial do Dart vem do Docker Hub e traz o SDK completo.
FROM dart:3.12 AS build

WORKDIR /app

# Copiar apenas os arquivos de dependência antes do código-fonte permite
# ao Docker reaproveitar a camada de "pub get" enquanto o pubspec não mudar.
COPY pubspec.* ./
RUN dart pub get

# Agora sim o restante do projeto.
COPY . .
RUN dart pub get --offline

# Compilação AOT: gera um binário nativo, sem necessidade da VM do Dart
# nem do código-fonte em tempo de execução.
RUN dart compile exe bin/server.dart -o /app/bin/server

# ---------- Estágio 2: imagem de execução ----------
# scratch é a imagem vazia: nem distribuição Linux, nem shell, nem
# gerenciador de pacotes. Menos software instalado significa menos
# superfície de ataque.
FROM scratch

# A imagem do Dart mantém em /runtime as bibliotecas de sistema mínimas
# exigidas pelo binário compilado.
COPY --from=build /runtime/ /
COPY --from=build /app/bin/server /app/bin/server
# O contrato e a página da documentação são lidos em tempo de execução,
# então precisam existir também na imagem final.
COPY --from=build /app/openapi.yaml /app/openapi.yaml
COPY --from=build /app/web/ /app/web/

WORKDIR /app

# Documenta a porta usada; a publicação efetiva é feita pelo Compose.
EXPOSE 8080

CMD ["/app/bin/server"]
```

Crie também o `.dockerignore` na raiz.

**.dockerignore**

```text
# Nada aqui precisa entrar no contexto de build, e deixar de fora
# acelera a cópia e evita vazar segredos para dentro da imagem.
.dart_tool/
build/
.git/
.github/
.idea/
.vscode/
.env
*.md
```

<aside class="negative">

**Atenção:** o `.env` está no `.dockerignore` de propósito. Se ele fosse copiado, a senha do banco ficaria gravada em uma camada da imagem — e camadas de imagem são distribuídas para todo mundo que tem acesso ao registro. Em produção, a configuração chega por variáveis de ambiente injetadas na hora da execução.

</aside>

**Terminal — construindo e conferindo o tamanho**

```text
$ docker build -t terrario-api:1.0.0 .

$ docker images terrario-api
REPOSITORY     TAG     IMAGE ID       CREATED         SIZE
terrario-api   1.0.0   3f2a91c4e7b8   2 seconds ago   14.8MB
```

## Orquestrando tudo com Docker Compose
Duration: 25:00

### O arquivo compose.yaml

Crie o arquivo `compose.yaml` na raiz do projeto. Ele descreve o conjunto de serviços, a rede que os liga, os volumes que guardam dados e a ordem em que tudo deve subir. As chaves usadas são estas:

**Chaves do arquivo do Compose**

| Chave | O que faz |
| --- | --- |
| `name` | Nome do projeto. Prefixa contêineres, rede e volume, isolando este ambiente de outros na mesma máquina. |
| `services` | Lista dos contêineres. Cada filho é um serviço, e seu nome vira o nome de *host* dentro da rede. |
| `image` | Imagem a usar. Quando aparece junto de `build`, nomeia a imagem que será construída. |
| `build` | Diz que a imagem deve ser construída localmente; `context` é a pasta enviada ao Docker e `dockerfile` é a receita. |
| `container_name` | Nome fixo do contêiner, em vez do nome gerado automaticamente. |
| `restart` | Política de reinício. `unless-stopped` reergue o contêiner se ele cair, mas respeita uma parada manual. |
| `environment` | Variáveis de ambiente injetadas no processo. É por aqui que a configuração chega à aplicação. |
| `ports` | Publica portas no formato `host:contêiner`. Sem isso o serviço só é alcançável de dentro da rede. |
| `volumes` | Monta dados persistentes ou pastas do projeto. `:ro` torna a montagem somente leitura. |
| `healthcheck` | Comando que o Docker executa periodicamente para saber se o serviço está realmente pronto. |
| `depends_on` | Ordem de inicialização. Com `condition: service_healthy`, espera o *healthcheck* passar. |
| `networks` | Redes às quais o serviço pertence. |

<aside class="negative">

**Atenção: `depends_on` sozinho não basta.** Sem a condição, `depends_on` apenas garante a ordem de **partida** dos contêineres — o Compose inicia o banco e, um instante depois, a API, sem esperar o MySQL terminar de subir. Como a inicialização do banco leva dezenas de segundos na primeira vez, a API tentaria conectar em um servidor que ainda não aceita conexões. É a combinação com `condition: service_healthy` que resolve.

</aside>

A substituição `${VARIAVEL}` lê automaticamente o arquivo `.env` da raiz do projeto — o mesmo arquivo já usado no desenvolvimento local.

**compose.yaml · parte 1 de 2**

```yaml
# Nome do projeto: prefixa contêineres, rede e volume criados por este arquivo.
name: terrario

# Cada entrada abaixo é um contêiner que o Compose vai gerenciar.
services:

  # ---------------- Banco de dados ----------------
  db:
    # Imagem oficial baixada do Docker Hub. 8.4 é a versão de suporte estendido.
    image: mysql:8.4
    # Nome fixo do contêiner, para facilitar comandos como "docker logs".
    container_name: terrario-db
    # Reinicia sozinho se cair, mas não se você mandar parar explicitamente.
    restart: unless-stopped
    # Variáveis lidas pelo entrypoint da imagem na primeira inicialização.
    environment:
      # Senha do administrador do banco.
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      # Cria este banco automaticamente.
      MYSQL_DATABASE: ${DB_NAME}
      # Cria este usuário com todos os privilégios sobre o banco acima.
      MYSQL_USER: ${DB_USER}
      # Senha do usuário criado.
      MYSQL_PASSWORD: ${DB_PASSWORD}
    ports:
      # host:contêiner. Dentro da rede o MySQL escuta na 3306; publicamos
      # na 3307 para não colidir com um MySQL instalado na máquina.
      # Em produção esta seção inteira deve ser removida.
      - "3307:3306"
    volumes:
      # Volume nomeado: os dados sobrevivem à remoção do contêiner.
      - dados-mysql:/var/lib/mysql
      # Scripts executados apenas na primeira subida; :ro é somente leitura.
      - ./docker/mysql/init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      # Porta aberta não significa banco pronto: este comando pergunta ao
      # servidor se ele já aceita consultas.
      test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1",
             "-u", "root", "-p${MYSQL_ROOT_PASSWORD}"]
      # De quanto em quanto tempo repetir a verificação.
      interval: 5s
      # Quanto esperar por cada tentativa antes de considerá-la falha.
      timeout: 5s
      # Quantas falhas seguidas até marcar o contêiner como doente.
      retries: 20
      # Período inicial de carência: falhas aqui não contam para o limite.
      start_period: 40s
    networks:
      # Liga este contêiner à rede privada declarada no fim do arquivo.
      - terrario-net
```

**Continue no mesmo arquivo** com o serviço da API e as declarações de volume e rede. Atenção ao recuo: `api` é irmão de `db`, portanto filho de `services` e indentado em dois espaços; já `volumes` e `networks` são chaves de primeiro nível, na coluna zero.

**compose.yaml · parte 2 de 2**

```yaml
  # ---------------- API ----------------
  # Filho de "services", no mesmo nível de "db".
  api:
    build:
      # Diretório enviado ao Docker como contexto de build.
      context: .
      # Arquivo de receita da imagem.
      dockerfile: Dockerfile
    # Nome e tag da imagem gerada.
    image: terrario-api:1.0.0
    container_name: terrario-api
    restart: unless-stopped
    depends_on:
      db:
        # Espera o healthcheck do banco passar, não apenas o contêiner iniciar.
        condition: service_healthy
    environment:
      # Desliga mensagens internas de erro nas respostas.
      APP_ENV: production
      # Porta em que o servidor Dart escuta dentro do contêiner.
      SERVER_PORT: 8080
      LOG_LEVEL: ${LOG_LEVEL}
      # Nome do serviço vira nome de host na rede do Compose. Escrever
      # 127.0.0.1 aqui apontaria para o próprio contêiner da API.
      DB_HOST: db
      DB_PORT: 3306
      # As três linhas abaixo precisam bater com as do serviço db.
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_POOL_SIZE: ${DB_POOL_SIZE}
    ports:
      # Porta da máquina à esquerda, porta do contêiner à direita.
      - "${SERVER_PORT}:8080"
    networks:
      - terrario-net

# Chave de primeiro nível, irmã de "services": volumes nomeados usados
# acima. Só são removidos com "down -v".
volumes:
  dados-mysql:

# Também de primeiro nível. Rede privada: os contêineres se enxergam pelo
# nome do serviço, e nada aqui dentro fica exposto para fora sem uma
# publicação explícita de porta.
networks:
  terrario-net:
    driver: bridge
```

<aside class="positive">

**Resolução de nomes na rede do Compose.** Cada serviço recebe um nome DNS igual ao seu nome no arquivo. O contêiner da API resolve `db` para o endereço IP do contêiner do MySQL automaticamente. Escrever `127.0.0.1` ali apontaria para o próprio contêiner da API, que não tem banco algum — é o erro mais comum de quem está começando.

</aside>

![Sequência vertical de subida: docker compose up; contêiner db inicia; scripts de initdb rodam; healthcheck passa (condition: service_healthy segura o início da API); contêiner api inicia; aguardarBanco confirma (segunda barreira, dentro da própria aplicação); porta 8080 publicada](img/fig-20.webp)

*Ordem de subida: duas barreiras independentes garantem que a API só comece a atender depois que o banco estiver realmente pronto.*

A figura acima resume a sequência completa, do comando digitado até a porta ficar disponível.

<aside class="positive">

**Boa prática: cinto e suspensórios.** O *healthcheck* cobre a orquestração e a função `aguardarBanco` cobre a aplicação. A redundância é intencional: em produção o banco pode reiniciar sozinho depois de a API já estar no ar, e nesse momento não existe orquestrador segurando ninguém — só a lógica de espera dentro do processo.

</aside>

### Um script para subir tudo

Os comandos do Compose já sobem tudo, mas há um ritual em volta deles: conferir se o `.env` existe, decidir se a imagem precisa ser reconstruída, às vezes apagar o volume, e esperar a API responder antes de sair testando. Um script transforma esse ritual em um comando só e evita que cada pessoa da equipe invente o seu.

**O que cada parte do script faz**

| Trecho | Função |
| --- | --- |
| `#!/usr/bin/env bash` | O *shebang*: diz ao sistema qual interpretador executa o arquivo, procurando o `bash` no `PATH` em vez de um caminho fixo. |
| `set -euo pipefail` | Aborta no primeiro erro (`-e`), trata variável indefinida como erro (`-u`) e faz um *pipe* falhar se qualquer etapa falhar (`pipefail`). Sem isso o script seguiria em frente depois de uma falha. |
| `cd "$(dirname "$0")/.."` | Vai para a raiz do projeto a partir da posição do próprio script, para que ele funcione chamado de qualquer pasta. |
| `--rebuild` | Reconstrói a imagem da API. Necessário sempre que o código Dart mudar. |
| `--reset` | Executa `down -v` antes de subir, apagando o volume: o banco volta ao estado do `01-schema.sql`. |
| `curl -fsS .../health/ready` | Sondagem: repete até a API responder. `-f` faz o `curl` falhar em erro HTTP, `-sS` silencia o progresso mas mantém as mensagens de erro. |
| `exit 0` / `exit 1` | Código de saída do script. Zero significa sucesso; qualquer outro valor sinaliza falha, o que permite encadear o script em uma esteira de CI. |

Crie a pasta `scripts/` e, dentro dela, o arquivo `up.sh`.

**scripts/up.sh**

```bash
#!/usr/bin/env bash
# Sobe todo o ambiente da API de Terrários.
# Uso: ./scripts/up.sh [--rebuild] [--reset]

set -euo pipefail   # aborta em erro, em variável indefinida e em falha de pipe

cd "$(dirname "$0")/.."   # roda sempre a partir da raiz do projeto

RECONSTRUIR=false
RESETAR=false

for argumento in "$@"; do
  case "$argumento" in
    --rebuild) RECONSTRUIR=true ;;
    --reset)   RESETAR=true ;;
    *) echo "Argumento desconhecido: $argumento"; exit 1 ;;
  esac
done

# 1. Garante que a configuração existe.
if [ ! -f .env ]; then
  echo "Arquivo .env nao encontrado. Criando a partir de .env.example..."
  cp .env.example .env
  echo "Edite o .env e defina as senhas antes de continuar."
  exit 1
fi

# 2. Opcionalmente apaga o volume para recriar o banco do zero.
if [ "$RESETAR" = true ]; then
  echo "Removendo contêineres e volumes..."
  docker compose down -v
fi

# 3. Sobe os serviços.
if [ "$RECONSTRUIR" = true ]; then
  docker compose up -d --build
else
  docker compose up -d
fi

# 4. Espera a API responder antes de devolver o controle ao usuário.
PORTA="$(grep -E '^SERVER_PORT=' .env | cut -d= -f2)"
echo "Aguardando a API responder em http://localhost:${PORTA} ..."

for tentativa in $(seq 1 60); do
  if curl -fsS "http://localhost:${PORTA}/health/ready" > /dev/null 2>&1; then
    echo
    echo "Ambiente pronto."
    echo "  API .......: http://localhost:${PORTA}/api/v1/terrarios"
    echo "  Documentos : http://localhost:${PORTA}/docs"
    echo "  Saude .....: http://localhost:${PORTA}/health/ready"
    exit 0
  fi
  printf '.'
  sleep 2
done

echo
echo "A API nao respondeu a tempo. Logs:"
docker compose logs --tail=50 api
exit 1
```

<aside class="negative">

**Atenção: quem está no Windows.** O `up.sh` é um script de *shell* e não roda no Prompt de Comando nem no PowerShell. A solução mais simples é o **Git Bash**, que vem junto com a instalação do Git para Windows: clique com o botão direito na pasta do projeto, escolha *Git Bash Here* e execute normalmente `./scripts/up.sh`. O WSL também funciona.

Duas observações. O `chmod +x` não tem efeito prático no sistema de arquivos do Windows, mas também não atrapalha — e é necessário se o repositório for clonado depois em Linux ou macOS. E, se o arquivo tiver sido salvo com quebras de linha do Windows, o `bash` reclama com `bad interpreter: /usr/bin/env bash^M`; nesse caso, configure o editor para gravar com quebra de linha LF.

</aside>

**Terminal — subindo o ambiente**

```text
$ chmod +x scripts/up.sh
$ ./scripts/up.sh --rebuild

[+] Building 42.3s (16/16) FINISHED
[+] Running 4/4
 ✔ Network terrario_terrario-net   Created
 ✔ Volume "terrario_dados-mysql"   Created
 ✔ Container terrario-db           Healthy
 ✔ Container terrario-api          Started
Aguardando a API responder em http://localhost:8080 ...
.....
Ambiente pronto.
  API .......: http://localhost:8080/api/v1/terrarios
  Documentos : http://localhost:8080/docs
  Saude .....: http://localhost:8080/health/ready
```

### Comandos do dia a dia

**Operações frequentes com o Compose**

| Comando | Efeito |
| --- | --- |
| `docker compose ps` | Estado de cada serviço, incluindo saúde. |
| `docker compose logs -f api` | Acompanha o log da API em tempo real. |
| `docker compose restart api` | Reinicia só a API. |
| `docker compose up -d --build api` | Recompila a imagem e substitui o contêiner. |
| `docker compose down` | Para e remove contêineres e rede; preserva o volume. |
| `docker compose down -v` | Remove também o volume — o banco volta ao estado inicial. |
| `docker compose exec db mysql -u root -p` | Abre um cliente SQL dentro do contêiner do banco. |

**Terminal — verificação final ponta a ponta**

```text
$ curl -s http://localhost:8080/health/ready
{"status":"ok","banco":"ok"}

$ curl -s -X POST http://localhost:8080/api/v1/terrarios \
     -H 'Content-Type: application/json' \
     -d '{"apelido":"Jardim de Cristal","bioma":"temperado",
          "umidadeAlvo":55,"volumeLitros":9.0,"dataMontagem":"2026-08-10"}' \
  | head -3

$ docker compose logs --tail=3 api
terrario-api  | GET /health/ready -> 200 (3ms)
terrario-api  | POST /api/v1/terrarios -> 201 (11ms)
```

## Boas práticas consolidadas
Duration: 12:00

### Completando a bateria de testes

Os dois primeiros casos foram escritos junto com o serviço, no passo "Testando a regra de negócio". Agora que a aplicação está completa, vale cobrir as regras que dependem de estado anterior: a unicidade do apelido, que só falha quando já existe um registro, e a busca por um identificador inexistente.

Acrescente os dois casos **ao final do `main`**, no `terrario_service_test.dart`, antes da chave que o fecha. As três primeiras linhas do bloco (o teste `recusa umidade fora da faixa`, resumido) apenas indicam onde encaixar.

**test/terrario_service_test.dart**

```dart
  test('recusa umidade fora da faixa', () {
    // ... corpo já apresentado ...
  });

  test('recusa apelido duplicado', () async {
    // O primeiro criar passa; o segundo esbarra na verificação de
    // unicidade, que só tem efeito porque o repositório já tem estado.
    await service.criar(valido());
    expect(
      () => service.criar(valido()),
      throwsA(isA<Conflito>()),
    );
  });

  test('buscar identificador inexistente lanca NaoEncontrado', () {
    expect(
      () => service.buscarPorId(999),
      throwsA(isA<NaoEncontrado>()),
    );
  });
}
```

**Terminal — executando a bateria completa**

```text
$ dart test
00:01 +4: All tests passed!
```

<aside class="positive">

**Boa prática: o que ainda falta cobrir.** Estes quatro casos exercitam a camada de serviço. Faltam os **testes de integração**, que sobem a aplicação inteira e chamam as rotas por HTTP, verificando código de status, cabeçalho `Location` e presença dos links de hipermídia — é o assunto de um dos exercícios ao final. Em projetos reais a proporção costuma ser de muitos testes de unidade, alguns de integração e pouquíssimos de ponta a ponta.

</aside>

### Segurança

**Riscos comuns e onde eles foram tratados**

| Risco | Tratamento |
| --- | --- |
| Injeção de SQL | Parâmetros nomeados em todas as consultas; nenhum valor concatenado no texto do comando. |
| Vazamento de segredos | `.env` fora do Git e fora da imagem; senha omitida do `toString`. |
| Exposição de detalhes internos | `detalharFalhas` desligado em produção. |
| Superfície de ataque da imagem | Base `scratch`, sem *shell* nem gerenciador de pacotes. |
| Consumo abusivo | Teto de `tamanhoPagina` aplicado no serviço. |
| Dados inconsistentes | Restrições `CHECK` e `UNIQUE` no próprio banco. |

O que ficaria como próximo passo em um sistema real: autenticação com JWT verificando um cabeçalho `Authorization` em um *middleware*, limitação de taxa por endereço de origem, TLS terminado por um *proxy* reverso à frente da API e rotação periódica das credenciais do banco.

### Observabilidade

O *middleware* de log resolve o básico, mas em produção o formato de linha livre atrapalha. Emitir JSON por requisição — com método, rota, status, duração e um identificador de correlação vindo do cabeçalho `X-Request-Id` — permite que agregadores de log filtrem e construam métricas sem depender de expressões regulares frágeis.

### Versionamento da API

O prefixo `/api/v1` não é decoração. Quando uma mudança quebrar compatibilidade, a versão 2 sobe **ao lado** da 1, os clientes migram no próprio ritmo e a versão antiga é aposentada com aviso prévio. Alterar o significado de um campo existente sem trocar a versão é a forma mais rápida de quebrar aplicativos já instalados em celulares que ninguém controla.

<aside class="positive">

**Boa prática: o que é mudança quebrável.** Remover um campo, renomear um campo, tornar obrigatório um campo antes opcional, restringir uma faixa de valores aceitos e mudar um código de status são todas mudanças quebráveis. Acrescentar um campo opcional na resposta não é — clientes bem escritos ignoram o que não conhecem.

</aside>

### Checklist final

Antes de considerar a API pronta:

* `dart analyze` e `dart format` sem pendências.
* Nenhum segredo no repositório; `.env.example` atualizado.
* Toda rota documentada no `openapi.yaml`.
* Erros no formato `problem+json`, com o código de status correto.
* `/health/live` e `/health/ready` respondendo.
* Desligamento gracioso tratando SIGTERM.
* Imagem construída em múltiplos estágios e sem código-fonte.
* Ambiente inteiro subindo com um único comando.

## Exercícios
Duration: 30:00

1. Acrescente à entidade o campo opcional `observacoes`, texto de até 500 caracteres. Ele precisa aparecer na tabela do banco, no modelo, na conversão de JSON, na validação e no arquivo `openapi.yaml`.

2. Implemente a rota `GET /api/v1` devolvendo apenas um objeto `_links` com as relações `terrarios`, `docs` e `health`, completando o ponto de entrada exigido pelo nível 3 do modelo de Richardson.

3. Adicione o parâmetro de consulta `ordenarPor`, que deve aceitar apenas os valores `apelido`, `umidadeAlvo` e `dataMontagem`, com sufixo opcional indicando a direção. Garanta que valores fora dessa lista sejam recusados com 422 e explique por que interpolar esse parâmetro diretamente na cláusula `ORDER BY` seria uma vulnerabilidade.

4. Implemente `PATCH /api/v1/terrarios/<id>` aplicando alteração parcial. Descreva no texto da própria implementação a diferença semântica entre PATCH e PUT e por que PATCH não é idempotente no caso geral.

5. Escreva testes de integração que subam a aplicação com um repositório em memória e exercitem as rotas por HTTP, verificando código de status, cabeçalho `Location` na criação e presença das relações de hipermídia.

6. Crie a entidade `Especie`, com relacionamento de muitos para muitos com `Terrario` através de uma tabela associativa. Exponha `GET /api/v1/terrarios/<id>/especies` e inclua a relação `especies` nos links do terrário.

7. Substitua o *middleware* de log por uma versão que emita uma linha JSON por requisição, propague o cabeçalho `X-Request-Id` quando presente e gere um identificador novo quando ausente.

8. Implemente um *middleware* de limitação de taxa que rejeite com 429 mais de sessenta requisições por minuto vindas do mesmo endereço, incluindo o cabeçalho `Retry-After` na resposta.

9. Acrescente ao `compose.yaml` um serviço de administração de banco (por exemplo Adminer ou phpMyAdmin), ligado à mesma rede, publicado em outra porta e sem acesso direto ao volume de dados.

10. Faça a API detectar violação de unicidade lançada pelo próprio banco — código de erro 1062 do MySQL — e traduzi-la em 409, mesmo quando duas requisições simultâneas passarem pela verificação prévia do serviço. Explique por que a verificação em Dart, sozinha, não é suficiente.

## Parabéns!
Duration: 3:00

Você construiu, do zero, uma API REST completa em Dart: configuração validada a partir do ambiente, arquitetura em camadas com inversão de dependência, persistência em MySQL com parâmetros nomeados, testes da regra de negócio com repositório em memória, erros no padrão `problem+json`, CORS, verificação de saúde, desligamento gracioso, hipermídia no nível 3 de Richardson, documentação OpenAPI com Swagger UI, uma imagem enxuta construída em múltiplos estágios e todo o ambiente orquestrado pelo Docker Compose com um único comando.

### Próximos passos

* Resolver os exercícios do passo anterior, começando por completar o contrato `openapi.yaml` com as demais operações.
* Adicionar autenticação com JWT, limitação de taxa e log estruturado em JSON, como sugerido em "Boas práticas consolidadas".
* Consumir esta API a partir de um aplicativo Flutter.

### Referências

* FIELDING, Roy Thomas. *Architectural styles and the design of network-based software architectures*. 2000. Tese (Doutorado em Information and Computer Science) — University of California, Irvine, 2000.
* FOWLER, Martin. *Richardson maturity model: steps toward the glory of REST*. 2010. Disponível em: [https://martinfowler.com/articles/richardsonMaturityModel.html](https://martinfowler.com/articles/richardsonMaturityModel.html). Acesso em: 1 set. 2026.
* FIELDING, Roy; NOTTINGHAM, Mark; RESCHKE, Julian (ed.). *RFC 9110: HTTP semantics*. Wilmington: RFC Editor, 2022.
* NOTTINGHAM, Mark; WILDE, Erik; DALAL, Sanjay. *RFC 9457: problem details for HTTP APIs*. Wilmington: RFC Editor, 2023.
* NOTTINGHAM, Mark. *RFC 8288: web linking*. Wilmington: RFC Editor, 2017.
* WIGGINS, Adam. *The twelve-factor app*. 2017. Disponível em: [https://12factor.net](https://12factor.net). Acesso em: 1 set. 2026.
* OPENAPI INITIATIVE. *OpenAPI specification v3.1.1*. 2024. Disponível em: [https://spec.openapis.org/oas/latest.html](https://spec.openapis.org/oas/latest.html). Acesso em: 1 set. 2026.
* RICHARDSON, Leonard; AMUNDSEN, Mike; RUBY, Sam. *RESTful web APIs*. Sebastopol: O'Reilly Media, 2013.
* NEWMAN, Sam. *Building microservices: designing fine-grained systems*. 2. ed. Sebastopol: O'Reilly Media, 2021.
* MERKEL, Dirk. Docker: lightweight Linux containers for consistent development and deployment. *Linux Journal*, Houston, v. 2014, n. 239, mar. 2014.
* PARNAS, David L. On the criteria to be used in decomposing systems into modules. *Communications of the ACM*, New York, v. 15, n. 12, p. 1053-1058, 1972.
* STEVENS, Wayne P.; MYERS, Glenford J.; CONSTANTINE, Larry L. Structured design. *IBM Systems Journal*, Armonk, v. 13, n. 2, p. 115-139, 1974.
* MARTIN, Robert C. *Clean architecture: a craftsman's guide to software structure and design*. Boston: Prentice Hall, 2017.
