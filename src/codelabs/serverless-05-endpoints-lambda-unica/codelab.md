summary: Complete a API de livros com os endpoints GET /livros e GET /livros/{id}, usando uma única função Lambda que decide o que fazer a partir do método HTTP. Depois, refatore o código em módulos e troque o if/else por um mapa de funções.
id: serverless-05-endpoints-lambda-unica
categories: AWS,Serverless,Node.js
tags: aws,serverless,lambda,api-gateway,dynamodb,mapping-template,javascript,refatoracao
status: Published
authors: Rodrigo Bossini
last updated: 2023-09-13
pdf: topicos_avancados_em_backend/05_apostila_aws_serverless.pdf
exercicios: topicos_avancados_em_backend/05_exercicio_aws_serverless.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# AWS Serverless 05: Endpoints da API de livros com uma única Lambda

## Visão geral
Duration: 3:00

Neste material, prosseguimos com o desenvolvimento da solução retratada a seguir: uma API de livros exposta pelo **Amazon API Gateway**, processada por uma função **AWS Lambda** e com os dados guardados no **Amazon DynamoDB**.

![Arquitetura da solução: páginas no S3, autenticação com Cognito, API Gateway, função Lambda e tabela no DynamoDB](img/p001-1.webp)

*A solução que estamos desenvolvendo.*

A nossa intenção é construir uma API com os seguintes endpoints.

| Endpoint | Finalidade |
| --- | --- |
| `POST /livros` | cadastrar um livro novo |
| `GET /livros` | obter todos os livros |
| `GET /livros/{id}` | obter um livro pelo seu id |
| `PUT /livros/{id}` | atualizar um livro pelo seu id |
| `DELETE /livros/{id}` | apagar um livro pelo seu id |

Até então, já definimos o endpoint `POST /livros`. Passemos à definição dos demais.

### O que você vai aprender

* As vantagens e desvantagens de usar uma única função Lambda para todos os endpoints ou uma Lambda por endpoint
* Como usar a nova interface do API Gateway
* Como escrever **mapping templates** na fase *Integration Request*, usando `$context.httpMethod`, `$input.json('$')` e `$input.params()`
* Como fazer uma única Lambda decidir o que fazer a partir do método HTTP
* Como buscar dados no DynamoDB com `ScanCommand` e `GetCommand`
* Como criar eventos de teste na Lambda e testar métodos no API Gateway
* Como modularizar uma Lambda em vários arquivos `.mjs`
* Como substituir uma cadeia de if/else por um **mapa de funções**, respeitando o princípio aberto/fechado

### O que você vai precisar

* Uma conta na AWS com acesso ao console
* A API do API Gateway, a função Lambda (Node.js) e a tabela `Livro-pdfs` do DynamoDB criadas nos materiais anteriores, com o endpoint `POST /livros` funcionando

## Uma Lambda ou várias?
Duration: 8:00

Precisamos tomar uma decisão muito importante agora.

Desejamos manter uma única função Lambda responsável por atender as requisições de todos os endpoints ou desejamos criar uma função Lambda separada para cada endpoint?

Cada opção tem as suas vantagens e desvantagens. Observe.

### Opção 1: todos os endpoints usam a mesma função Lambda

Graficamente, esta opção fica assim.

![Diagrama: os cinco endpoints do API Gateway passam por uma fase de integration request que monta um objeto com method, id e payload e o entregam a uma única Lambda, que usa if/else sobre o método](img/p002-1.webp)

*Opção 1: cada integration request inclui as informações de que a Lambda precisa ("method": GET ou POST ou..., "id": id enviado ou "" caso inexistente, "payload": corpo da requisição), e a única Lambda decide o que fazer com `if (event.method === "GET") ... else if (event.method === "POST") ...`.*

**Vantagens:**

* Por termos uma única Lambda, a implantação tende a ser mais simples, especialmente caso façamos uso de um pipeline CI/CD, o que é bastante comum nos dias atuais.
* Se as diferentes requisições fizerem uso de recursos compartilhados, como uma conexão com um banco de dados externo ou uma API externa, que requerem o uso de credenciais, elas podem ser especificadas uma única vez.

**Desvantagens:**

* O código da única Lambda existente tende a ser bem mais complexo e difícil de manter.
* Se um endpoint A tiver alta demanda e outro endpoint B for utilizado pouquíssimas vezes, podemos ter problemas de escalabilidade e custo. Por exemplo, depois de um pico de uso do endpoint A, diversos recursos terão sido alocados, aumentando o custo. Caso o endpoint B seja utilizado algumas poucas vezes depois disso, ele será atendido por um ambiente com muitos recursos desnecessariamente alocados.

### Opção 2: cada endpoint tem sua própria função Lambda

Graficamente, esta opção fica assim.

![Diagrama: cada um dos cinco endpoints do API Gateway ligado à sua própria função, de Lambda 1 a Lambda 5](img/p003-1.webp)

*Opção 2: uma função Lambda por endpoint.*

Observe que a figura não ilustra a fase de integration request. Claro, ela pode ser usada para transformações quaisquer. A ideia é que não é necessário extrair o método do protocolo HTTP e passar à Lambda, já que cada Lambda tem uma única razão de ser.

**Vantagens:**

* Separação de responsabilidades. Cada Lambda tem uma única razão de ser, um único propósito. A manutenção fica mais simples assim. O código fica mais fácil de entender.
* Um erro ocorrido em uma função Lambda não afeta as demais.
* A escalabilidade é granular. Ou seja, cada Lambda escala independente das demais.
* Segurança: podemos aplicar mais apropriadamente o princípio do menor privilégio. A cada Lambda, podemos associar somente as permissões de acesso a recursos que ela realmente precisa. Talvez uma Lambda precise acessar o DynamoDB e as outras não. Damos essa permissão de acesso somente a ela. Talvez uma Lambda precise acessar um serviço de banco de dados relacional no RDS. Damos essa permissão somente a ela. E assim por diante.

### Recomendações gerais

Cada abordagem tem as suas vantagens e desvantagens. Não dá para dizer que uma é melhor que a outra. Depende do contexto. Há alguns princípios que podemos ter em mente para tomar essa decisão.

* **Separação de responsabilidades:** se a lógica necessária para cada endpoint é complexa e elas são muito diferentes entre si, pode fazer sentido utilizar uma Lambda separada para cada endpoint.
* **Reusabilidade e código compartilhado:** a reusabilidade de código é essencial. Se as lógicas necessárias para cada endpoint são semelhantes, faz sentido ter uma única Lambda e compartilhar código.
* **Testabilidade:** múltiplas funções Lambda, pequenas e altamente coesas podem ser mais fáceis de testar, entender e debugar.
* **Custo:** talvez exista um procedimento de inicialização bastante demorado, necessário para todos os endpoints. Dado que o custo das funções Lambda é calculado em função do tempo de execução, pode fazer sentido ter uma única função Lambda. Por outro lado, se tivermos múltiplas Lambdas, cada uma pode ser configurada para usar apenas a quantidade de memória que realmente requer.

Neste material, vamos adotar a estratégia de utilizar **uma única Lambda para todos os endpoints**.

<aside class="positive">

**Nota.** A partir de agora, vamos definir uma fase Integration Request para cada método. Poderá parecer interessante fazer uma única fase dessas e compartilhar entre múltiplos métodos. Até poderíamos pensar em usar o método ANY. Entretanto, outros recursos estão envolvidos, como a validação do corpo da requisição. Cada método tem potencialmente uma validação diferente (o POST tem um JSON que representa um livro no corpo, o GET não tem nada) a ser realizada e, assim, o método ANY pode não se adequar bem ao nosso cenário.

</aside>

## API Gateway: Integration Request do POST
Duration: 12:00

O primeiro passo é adaptar a fase **Integration Request** do método POST, para que a requisição contenha as informações necessárias para que a Lambda opere corretamente: o nome do método HTTP e o corpo da requisição. Desejamos construir algo assim:

**Estrutura desejada (esquema)**

```text
{
    "method": "POST",
    "payload": o livro
}
```

> **Payload**
>
> "payload" pode ser traduzido para algo como "carga útil". É um nome comumente utilizado para fazer referência aos dados de interesse sendo transportados numa requisição ou resposta, sem incluir os "metadados", que geralmente são os cabeçalhos que explicam de que se trata aquela requisição/resposta.

### A nova interface do API Gateway

A Amazon desenvolveu uma nova interface gráfica para o API Gateway. Ela já pode ser utilizada e, a partir de 30 de outubro de 2023, a interface antiga não estará mais disponível. Veja o aviso.

![Console do API Gateway com a faixa azul avisando sobre o novo console e o link Try out the new console destacado](img/p005-2.webp)

*O aviso da nova interface do API Gateway.*

Assim, parece boa ideia já começar a utilizar a nova interface e aprender mais sobre ela! Por isso, clique em **Try out the new console**.

Você provavelmente verá a lista de APIs que possui. Clique no nome daquela com que pretende interagir no momento. Claro, o nome de sua API pode ser diferente daquele exibido neste material.

![Lista de APIs no novo console do API Gateway com uma das APIs destacada](img/p006-1.webp)

*Escolha a sua API na lista.*

### Editando o mapping template

No API Gateway, clique sobre o método **POST** e clique em **Integration Request**.

![Recursos da API com o método POST de /livros selecionado e o quadro Integration request destacado no fluxo de execução do método](img/p006-2.webp)

*Método POST de `/livros`: acesse o Integration request.*

Role a página até encontrar a seção **Mapping Templates**. Observe que temos algum conteúdo de mapeamento, utilizado anteriormente. Talvez seu conteúdo seja um pouco diferente. Não se preocupe, pois vamos refazer do zero. Clique em **Edit**.

![Seção Mapping templates com o template application/json existente e o botão Edit destacados](img/p007-1.webp)

*O mapping template anterior e o botão Edit.*

A documentação a seguir pode ser bastante útil para você descobrir de onde extrair as partes de interesse. Veja.

[https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html)

Estamos interessados no corpo da requisição e no método do protocolo HTTP utilizado. Na página da documentação, veja como acessar o método do protocolo HTTP. Ele é uma **variável de contexto**.

![Trecho da documentação com as variáveis de contexto, com a linha http_method: $context.httpMethod destacada](img/p007-2.webp)

*Na documentação, o método HTTP é a variável de contexto `$context.httpMethod`.*

Assim, ajuste o seu conteúdo de mapeamento como a seguir.

**Template body (POST /livros)**

```text
{
  "method": "$context.httpMethod",
  "payload": $input.json('$')
}
```

Observe que o validador do API Gateway pode apontar um erro, pois a notação apresentada não é exatamente um objeto JSON válido, por conta do uso da função `$input.json`. Entretanto, ela produz um valor válido e, por isso, podemos ignorar o erro.

![Editor Edit mapping template com o novo conteúdo e um ícone de erro do validador ao lado da linha do payload](img/p008-1.webp)

*O validador aponta um erro na linha do `payload`, que pode ser ignorado.*

<aside class="positive">

**Nota.** Observe novamente a notação que utilizamos: o primeiro valor está entre aspas duplas; o segundo não está. Isso acontece pois `$context.httpMethod` resulta no nome do método, que deve estar entre aspas. A função `$input.json`, por outro lado, produz um objeto JSON. Caso colocássemos aspas, o resultado seria

```text
{
  "method": "POST",
  "payload": "{"titulo": "Algorithms II", "autor": "Cormen", "edicao": "3"}"
}
```

As aspas externas do valor associado à chave `payload` tornam o objeto JSON completo inválido, pois ficaria entendido que o valor começa na primeira aspas duplas, inclui apenas o símbolo `{` e termina na segunda aspas duplas, antes da letra t de título. Assim, a letra t aparece num lugar inapropriado.

</aside>

Clique em **Save template**.

![Página Edit mapping template com o conteúdo final e o botão Save template destacado](img/p010-1.webp)

*Salvando o mapping template.*

## Lambda: lidando com a nova estrutura
Duration: 12:00

A seguir, precisamos ajustar o código da função Lambda para que ela considere a nova estrutura do objeto JSON que recebe. Além disso, usando o valor associado à chave `method`, ela deve decidir o que fazer. Ela somente deve inserir um livro no DynamoDB caso a requisição seja do tipo POST.

No Console, busque por **Lambda**, segure **CTRL** e clique sobre o nome do serviço. Assim, uma nova aba será aberta.

![Busca do console da AWS pelo termo lambda com o serviço Lambda destacado nos resultados](img/p011-1.webp)

*Abra o serviço Lambda em uma nova aba.*

Clique sobre o nome da sua função Lambda.

![Lista de funções do Lambda com a função lambda-pdfs destacada](img/p011-2.webp)

*Escolha a sua função na lista.*

A seguir, vamos extrair as propriedades `method` e `payload` do objeto `event`. Estamos usando o operador de desestruturação do Javascript. Leia mais sobre ele em

[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

Depois disso, fazemos uma estrutura de seleção `if` para decidir se a inserção deve acontecer. Se for o caso, executamos o código que já tínhamos anteriormente. Caso contrário, vamos apenas fazer um log e devolver o objeto recebido, por enquanto.

**index.mjs**

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {
  const {method, payload} = event
  if (method === "POST"){
    const id = context.awsRequestId;
    const command = new PutCommand({
      TableName: "Livro-pdfs",
      Item: {
        LivroID: id,
        titulo: payload.titulo,
        autor: payload.autor,
        edicao: payload.edicao
      },
    });

    const response = await docClient.send(command);
    console.log(response);
    return {
      id: context.awsRequestId,
      titulo: payload.titulo,
      autor: payload.autor,
      edicao: payload.edicao
    };
  }
  else{
    console.log(event);
    return event;
  }
};
```

<aside class="negative">

**Atenção:** os dados do livro agora estão dentro de `payload`. Por isso, use `payload.titulo`, `payload.autor` e `payload.edicao` (e não mais `event.titulo` etc.), como nas próximas versões do código.

</aside>

Clique em **Deploy** depois de editar o código.

### Evento de teste

Crie um evento de teste: clique na setinha ao lado de **Test** e em **Configure test event**.

![Editor de código da Lambda com a mensagem de função atualizada e o menu Configure test event destacado abaixo do botão Test](img/p014-1.webp)

*Criando um evento de teste.*

O **Event name** será `PutCommand`, apenas para lembrar a que se refere esse teste. Veja o conteúdo do **Event JSON**.

**Event JSON (PutCommand)**

```json
{
  "method": "POST",
  "payload": {
    "titulo": "Algorithms II",
    "autor": "Cormen",
    "edicao": "3"
  }
}
```

![Janela Configure test event com o nome PutCommand e o Event JSON destacados](img/p015-1.webp)

*O evento de teste PutCommand.*

Clique em **Save**. Clique em **Test** e veja o resultado.

![Aba Execution results mostrando a resposta com id, titulo, autor e edicao e os logs da função](img/p016-1.webp)

*O resultado do teste na Lambda.*

### Testando no API Gateway

Já no API Gateway, clique na aba **Test**, preencha um objeto de teste e clique em **Test**.

![Aba Test do método POST no API Gateway com um livro de teste no Request body destacado](img/p017-1.webp)

*Testando o método POST no API Gateway.*

Veja o resultado esperado. Observe que o livro já possui o id gerado.

![Resultado do teste no API Gateway com o corpo da resposta, que inclui o id do livro, destacado](img/p017-2.webp)

*O livro devolvido já possui o id.*

## API Gateway: o endpoint GET /livros
Duration: 8:00

Começamos definindo o endpoint que permite que a coleção inteira de livros seja obtida. No API Gateway, mantenha o recurso `/livros` selecionado e clique em **Actions >> Create Method** (na nova interface, **Create method**).

![Recursos da API com /livros selecionado e o botão Create method destacado](img/p018-1.webp)

*Criando um método no recurso `/livros`.*

Escolha o método **GET** e mantenha **Lambda function** como **Integration Type**. Abaixo, comece a digitar o nome de sua função Lambda.

![Formulário Create method com o tipo GET, a integração Lambda function e o nome da função Lambda destacados](img/p018-2.webp)

*O método GET integrado à mesma função Lambda.*

Agora vamos usar o quadro **Integration request** do método GET para fazer a transformação necessária. O objeto JSON que vamos construir para entregar para a função Lambda é o seguinte.

**Estrutura desejada**

```json
{
  "method": "GET",
  "id": "all"
}
```

Como estamos buscando por todos os livros, não há um id específico para incluir no objeto JSON. Por isso, vamos colocar literalmente a palavra `"all"`. A função Lambda se encarregará de verificar esse valor e diferenciar as funcionalidades a serem executadas para cada endpoint GET (lembre-se que temos dois, o outro tem id).

Clique em **Integration Request**.

![Execução do método GET de /livros com o quadro Integration request destacado](img/p019-1.webp)

*Acesse o Integration request do método GET.*

Role a tela e encontre **Mapping templates**. Clique em **Create template**.

![Seção Mapping templates do Integration request com o botão Create template destacado](img/p020-1.webp)

*Criando um mapping template.*

O **Content type** será `application/json`. Novamente, vamos nos basear na documentação para encontrar as partes de interesse. Neste caso, queremos apenas pegar o método HTTP utilizado na requisição. Como vimos, ele é um atributo de contexto. Use o conteúdo a seguir no campo **Template body**.

**Template body (GET /livros)**

```json
{
  "method": "$context.httpMethod",
  "id": "all"
}
```

![Página Create mapping template com o Content type application/json e o Template body destacados](img/p021-1.webp)

*O mapping template do GET `/livros`.*

Depois disso, clique em **Create template**.

## Lambda: o endpoint GET /livros
Duration: 12:00

Precisamos ajustar a Lambda para que ela faça uma consulta na tabela de livros. Vamos começar adicionando uma "perna" `else if` à nossa estrutura de seleção. Repare que, agora, também extraímos o `id` do objeto `event` na desestruturação: `const {method, payload, id} = event`.

**index.mjs (trecho)**

```javascript
...
    return {
      id: context.awsRequestId,
      titulo: payload.titulo,
      autor: payload.autor,
      edicao: payload.edicao
    };
  }
  else if (method === "GET" && id === "all"){

  }
  else{
    console.log(event);
    return event;
  }
};
```

Segundo a documentação, há dois tipos de operações que podemos realizar para fazer a busca de dados em uma tabela do DynamoDB: **scan** e **query**. Veja o que a documentação fala sobre ambas.

> **scan**
>
> The Scan operation returns one or more items and item attributes by accessing every item in a table or a secondary index. To have DynamoDB return fewer items, you can provide a FilterExpression operation.

> **query**
>
> You must provide the name of the partition key attribute and a single value for that attribute. Query returns all items with that partition key value. Optionally, you can provide a sort key attribute and use a comparison operator to refine the search results.

Como desejamos recuperar todos os itens da tabela, vamos fazer uma operação **scan**. Os passos são os seguintes.

* importar `ScanCommand`
* construir um objeto `ScanCommand`. Seu construtor recebe um objeto que admite diferentes configurações. Neste caso, vamos apenas especificar o nome da tabela
* executar o comando aguardando pelo resultado que nos será entregue pelo DynamoDB
* devolver o resultado

Veja.

**index.mjs (trechos)**

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  ScanCommand,
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";
...
  }
  else if (method === "GET" && id === "all"){
    const command = new ScanCommand({
      TableName: "Livro-pdfs"
    });
    const response = await docClient.send(command);
    return response;
  }
  else{
...
```

Clique em **Deploy**.

### Um evento de teste para cada endpoint

Para testar, clique na setinha ao lado de **Test** e clique em **Configure Test Event**. Vamos criar um evento separado para cada endpoint.

![Menu do botão Test com a opção Configure test event destacada](img/p023-2.webp)

*Configure um novo evento de teste.*

Lembre-se de clicar em **Create new event** para não sobrepor o anterior. Dê o nome `ScanCommand` a ele. Veja o **Event JSON**.

**Event JSON (ScanCommand)**

```json
{
  "method": "GET",
  "id": "all"
}
```

![Janela Configure test event com Create new event, o nome ScanCommand e o Event JSON destacados](img/p024-1.webp)

*O evento de teste ScanCommand.*

Depois disso, clique em **Save**. Clique na setinha ao lado de **Test** e certifique-se de que o evento de teste correto está selecionado.

![Menu do botão Test com o evento ScanCommand selecionado entre os eventos salvos](img/p025-1.webp)

*Selecione o evento ScanCommand.*

Clique em **Test**.

![Resultado do teste com a resposta completa do DynamoDB, incluindo metadados e a coleção Items](img/p025-2.webp)

*A resposta do scan inclui metadados e a coleção `Items`.*

Observe que o conteúdo que o DynamoDB devolve inclui diversas informações a respeito da requisição. São metadados. Há, também, uma coleção associada a uma chave chamada `Items`. Observe que ela contém nossos livros. Essa é a coleção que queremos devolver. Ajuste o código da Lambda da seguinte forma, portanto.

**index.mjs (trecho)**

```javascript
...
  else if (method === "GET" && id === "all"){
    const command = new ScanCommand({
      TableName: "Livro-pdfs"
    });
    const response = await docClient.send(command);
    return response.Items;
  }
...
```

Clique em **Deploy**. Clique em **Test** a seguir. Veja o resultado esperado.

![Resultado do teste mostrando apenas a lista de livros](img/p026-1.webp)

*Agora a Lambda devolve apenas a coleção de livros.*

No API Gateway, faça também um teste.

![Aba Test do método GET de /livros no API Gateway com a lista de livros no corpo da resposta](img/p027-1.webp)

*Testando o GET `/livros` no API Gateway.*

## API Gateway: o endpoint GET /livros/{id}
Duration: 10:00

Este endpoint é semelhante. Entretanto, precisamos extrair o id da path. Vamos começar fazendo a sua definição no API Gateway. Mantenha o recurso `/livros` clicado e clique em **Create Resource**.

![Recursos da API com /livros selecionado e o botão Create resource destacado](img/p027-2.webp)

*Criando um recurso abaixo de `/livros`.*

Seu **name** será `{id}`. Marque a opção **CORS** e clique em **Create resource**.

![Formulário Create resource com o nome {id} e a opção CORS destacados](img/p028-1.webp)

*O recurso `{id}` com CORS habilitado.*

Mantenha o recurso `{id}` selecionado e clique em **Create method**.

![Recurso {id} selecionado e o botão Create method destacado](img/p028-2.webp)

*Criando um método no recurso `{id}`.*

Desejamos o método **GET** do protocolo HTTP. Ele se integrará com a mesma função Lambda com que temos trabalhado até então.

![Formulário Create method com o tipo GET, a integração Lambda function e a função Lambda destacados](img/p029-1.webp)

*O GET `/livros/{id}` usa a mesma função Lambda.*

Agora vamos ao quadro **Integration request** do método GET deste recurso para construir o objeto que será entregue à Lambda. Ele será assim:

**Estrutura desejada (esquema)**

```text
{
    "method": "GET"
    "id": o id que tiver sido passado como parâmetro de path
}
```

![Execução do método GET de /livros/{id} com o quadro Integration request destacado](img/p029-2.webp)

*Acesse o Integration request do GET `/livros/{id}`.*

Role a tela, encontre a opção **Mapping templates** e clique em **Create template**.

![Seção Mapping templates com o botão Create template destacado](img/p030-1.webp)

*Criando o mapping template do GET `/livros/{id}`.*

O **Content type** será `application/json`.

Baseando-nos mais uma vez na documentação, vamos extrair o id, sabendo que ele é um parâmetro de path.

[https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html)

Segundo a documentação, a partir de `$input`, temos acesso a uma função chamada `params`. Ela nos entrega um objeto JSON que possui três chaves: `path`, `header` e `querystring`. Associado à chave `path`, encontra-se um objeto JSON que nos dá acesso a cada parâmetro de path. Observe esse print tirado da documentação.

![Trecho da documentação sobre $input.params(), mostrando um template que percorre path, querystring e header e o JSON resultante com as três chaves](img/p031-1.webp)

*`$input.params()` devolve os parâmetros de `path`, `querystring` e `header`.*

Assim, o conteúdo que desejamos para **Template body** é o seguinte.

**Template body (GET /livros/{id})**

```json
{
  "method": "$context.httpMethod",
  "id": "$input.params().get('path').id"
}
```

![Página Create mapping template com o Content type application/json e o Template body destacados](img/p032-1.webp)

*O mapping template do GET `/livros/{id}`.*

Clique em **Create template** a seguir.

Você já pode fazer um teste no API Gateway, passando um valor qualquer como id. Assim, dado que a requisição é GET mas o valor de id é diferente de `"all"`, a Lambda vai entrar na "última perna" do if/else, simplesmente devolvendo o objeto recebido que, a essa altura, deve ser constituído de `method` e `id`, dada a transformação que realizamos.

![Aba Test do GET /livros/{id} com um id qualquer no campo de path e a resposta com method e id destacados](img/p033-1.webp)

*A Lambda ainda devolve o objeto recebido, com `method` e `id`.*

## Lambda: o endpoint GET /livros/{id}
Duration: 12:00

O próximo passo é adaptar a Lambda para que ela lide com o novo endpoint adequadamente. Em nossa estrutura de seleção if/else (que já está ficando questionavelmente grande e difícil de manter), vamos verificar se o método é GET e se o id existe. Se for o caso, é hora de realizar uma busca junto ao DynamoDB usando o id recebido. Vejamos.

**index.mjs (trecho)**

```javascript
...
  }
  else if (method === "GET" && id === "all"){
    const command = new ScanCommand({
      TableName: "Livro-pdfs"
    });
    const response = await docClient.send(command);
    return response.Items;
  }
  else if (method === "GET" && id){

  }
  else{
    console.log(event);
    return event;
  }
...
```

A seguir, precisamos

* importar a classe `GetCommand`
* construir um objeto `GetCommand` especificando o nome da tabela e o critério de busca
* enviar o comando com o `docClient` do DynamoDB
* devolver o resultado.

Observe.

**index.mjs (trechos)**

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  PutCommand,
  ScanCommand,
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";
...
  else if (method === "GET" && id){
    const command = new GetCommand({
      TableName: "Livro-pdfs",
      Key: {
        LivroID: id
      }
    })
    const response = await docClient.send(command)
    return response
  }
...
```

Clique em **Deploy**.

### Testando com um id existente

Para testar, clique na setinha ao lado de **Test** e escolha **Configure Test event**.

![Menu do botão Test com a opção Configure test event destacada](img/p036-2.webp)

*Configure mais um evento de teste.*

Certifique-se de criar um novo evento e escolher um nome para ele. Observe o **Event JSON** que usamos.

**Event JSON (GetCommand)**

```json
{
  "method": "GET",
  "id": "68252363-3876-4312-a4b8-daef0509837e"
}
```

![Janela Configure test event com Create new event, o nome GetCommand e o Event JSON com um id destacados](img/p037-1.webp)

*O evento de teste GetCommand.*

O id utilizado foi obtido no DynamoDB. É um id de um livro que de fato existe na base. Para obter um, no DynamoDB, clique em **Tables** e escolha o nome da sua tabela.

![Lista de tabelas do DynamoDB com o menu Tables e a tabela Livro-pdfs destacados](img/p038-1.webp)

*Abra a sua tabela no DynamoDB.*

Depois, clique em **Explore items** e escolha um id qualquer, que apareça na coluna **LivroID**.

![Tela Explore items da tabela Livro-pdfs com a coluna LivroID e um dos ids destacados](img/p038-2.webp)

*Copie um id da coluna LivroID.*

De volta ao ambiente Lambda, depois de salvar o evento de teste, clique em **Test** e veja o resultado.

![Resultado do teste com a resposta do GetCommand, que inclui metadados e o livro associado à chave Item](img/p039-1.webp)

*A resposta do DynamoDB inclui metadados; o livro está em `Item`.*

O resultado do DynamoDB inclui metadados. A carga útil está associada à chave `"Item"`. Por isso, vamos adaptar a Lambda para devolver somente os dados de interesse. Veja.

**index.mjs (trecho)**

```javascript
...
  }
  else if (method === "GET" && id){
    const command = new GetCommand({
      TableName: "Livro-pdfs",
      Key: {
        LivroID: id
      }
    })
    const response = await docClient.send(command)
    return response.Item
  }
  else{
...
```

Clique em **Deploy** e execute um novo teste clicando em **Test**. Veja o resultado.

![Resultado do teste mostrando apenas o livro encontrado](img/p040-1.webp)

*Agora a Lambda devolve apenas o livro.*

No API Gateway, faça também um teste.

![Aba Test do GET /livros/{id} no API Gateway com o id no campo de path e o livro no corpo da resposta](img/p040-2.webp)

*Testando o GET `/livros/{id}` no API Gateway.*

## Refatoração: única Lambda, múltiplos arquivos
Duration: 20:00

Embora tenhamos uma única função Lambda, nada impede que apliquemos boas práticas de programação, como a modularização e a separação de responsabilidades. O arquivo `index.mjs` está ficando muito grande e a sua manutenção é cada vez mais difícil. Por isso, vamos escrever arquivos `.mjs` separados. Cada um terá a implementação de uma única função.

### Inserção de livros (POST)

Vamos começar pela inserção de livros (POST). Comece criando um arquivo chamado `inserir_livro.mjs`. Nele, definiremos a função que insere livros. Ele exportará essa função e, no módulo principal, a importaremos e a colocaremos em execução quando for o caso. Para criar o arquivo, clique com o direito na pasta do projeto e escolha **New File**.

![Menu de contexto da pasta do projeto no editor da Lambda com a opção New File destacada](img/p041-1.webp)

*Criando um novo arquivo na pasta do projeto.*

Digite seu nome logo a seguir.

No arquivo que criamos, vamos fazer o seguinte.

* importar o `PutCommand`
* definir uma função que
  * recebe
    * um `docClient` para interagir com o DynamoDB
    * o nome da tabela envolvida na operação
    * o objeto a ser inserido
    * o id do objeto a ser inserido
  * constrói e envia o comando ao DynamoDB
  * devolve a resposta obtida a partir do DynamoDB

**inserir_livro.mjs**

```javascript
import {
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

export default async (docClient, tableName, livro, id) => {
  const command = new PutCommand({
    TableName: tableName,
    Item: {...livro, LivroID: id},
  });
  const response = await docClient.send(command);
  return response;
}
```

De volta ao arquivo `index.mjs`, faremos o seguinte

* importaremos o arquivo (módulo) recém-criado
* deixaremos de importar o `PutCommand`
* definiremos o nome da tabela como uma constante à parte, que poderá ser reutilizada ao longo de toda a função `handler`
* na "perna POST" da estrutura de seleção, vamos chamar a função `inserir_livro` entregando-lhe os dados de interesse
* também devolvemos aquilo que a função `inserir_livro` produz.

**index.mjs (trecho)**

```javascript
import inserir_livro from './inserir_livro.mjs';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  //PutCommand, não importamos mais
  ScanCommand,
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "Livro-pdfs";

export const handler = async (event, context) => {
  const {method, payload, id} = event
  if (method === "POST"){
    return inserir_livro(docClient, tableName, payload, context.awsRequestId)
  }
  else if (method === "GET" && id === "all"){
...
```

Clique em **Deploy** e faça novo teste, escolhendo o evento `PutCommand`.

![Menu do botão Test com o evento PutCommand selecionado](img/p044-1.webp)

*Selecione o evento PutCommand.*

![Resultado do teste mostrando a resposta do DynamoDB com os metadados da operação](img/p044-2.webp)

*A Lambda agora devolve a resposta do DynamoDB.*

Observe que agora estamos devolvendo a resposta do DynamoDB ao cliente. É melhor devolvermos o objeto livro incluindo o id que foi gerado automaticamente. Isso tende a facilitar a vida da aplicação cliente, que possivelmente está interessada em exibir esses dados ou permitir que outras operações que dependem do id sejam realizadas pelo usuário. Ajuste o código do arquivo `inserir_livro.mjs` da seguinte forma.

**inserir_livro.mjs**

```javascript
import {
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

export default async (docClient, tableName, livro, id) => {
  const command = new PutCommand({
    TableName: tableName,
    Item: {...livro, LivroID: id},
  });
  const response = await docClient.send(command);
  return {...livro, id: id};
}
```

Clique em **Deploy** e faça novo teste.

![Resultado do teste mostrando o livro inserido com titulo, autor, edicao e id](img/p046-1.webp)

*Agora a Lambda devolve o livro com o id gerado.*

### Obtenção de todos os livros (GET /livros)

Repitamos o processo, agora para a obtenção de todos os livros (`GET /livros`). Comece criando um arquivo chamado `obter_livros.mjs` (livro no plural). Neste arquivo, vamos

* importar `ScanCommand`
* definir uma função que
  * recebe
    * o `docClient`
    * o nome da tabela
  * devolve
    * a coleção de itens obtida junto ao DynamoDB

Veja.

**obter_livros.mjs**

```javascript
import {
  ScanCommand
} from "@aws-sdk/lib-dynamodb";

export default async (docClient, tableName) => {
  const command = new ScanCommand({
    TableName: tableName
  });
  const response = await docClient.send(command);
  return response.Items;
}
```

No arquivo `index.mjs`, vamos

* importar a função do novo módulo
* deixar de importar `ScanCommand`
* chamar a função importada na "perna do if apropriada" e devolver aquilo que ela produz, que é a coleção de livros obtida junto ao DynamoDB

**index.mjs (trecho)**

```javascript
import inserir_livro from './inserir_livro.mjs';
import obter_livros from './obter_livros.mjs';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  //PutCommand, não importamos mais
  //ScanCommand, não importamos mais
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "Livro-pdfs";

export const handler = async (event, context) => {
  const {method, payload, id} = event
  if (method === "POST"){
    return inserir_livro(docClient, tableName, payload, context.awsRequestId)
  }
  else if (method === "GET" && id === "all"){
    return obter_livros(docClient, tableName);
  }
  else if (method === "GET" && id){
...
```

Clique em **Deploy** e faça novo teste clicando em **Test**. Certifique-se de que está usando o teste certo, ok?

![Menu do botão Test com o evento ScanCommand selecionado e o botão Deploy destacado](img/p049-1.webp)

*Use o evento ScanCommand para testar o GET `/livros`.*

![Resultado do teste mostrando a lista de livros](img/p050-1.webp)

*A lista de livros, agora obtida pelo módulo `obter_livros.mjs`.*

### Obtenção de um livro (GET /livros/{id})

Repitamos uma vez mais o processo, agora para a obtenção de um livro (`GET /livros/{id}`). Comece criando um arquivo chamado `obter_livro.mjs` (livro no singular). Neste arquivo, vamos

* importar `GetCommand`
* definir uma função que
  * recebe
    * o `docClient`
    * o nome da tabela
    * o id do livro que desejamos encontrar
  * devolve
    * o item devolvido pelo DynamoDB

**obter_livro.mjs**

```javascript
import {
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

export default async (docClient, tableName, id) => {
  const command = new GetCommand({
    TableName: tableName,
    Key: {
      LivroID: id
    }
  })
  const response = await docClient.send(command)
  return response.Item
}
```

No arquivo `index.mjs`, vamos

* importar a função do módulo que acabamos de definir
* deixar de importar `GetCommand`
* na "perna do if adequada", chamar a função que acabamos de importar do novo módulo

**index.mjs**

```javascript
import inserir_livro from './inserir_livro.mjs';
import obter_livros from './obter_livros.mjs';
import obter_livro from './obter_livro.mjs';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  //GetCommand, não importamos mais
  //PutCommand, não importamos mais
  //ScanCommand, não importamos mais
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "Livro-pdfs";

export const handler = async (event, context) => {
  const {method, payload, id} = event
  if (method === "POST"){
    return inserir_livro(docClient, tableName, payload, context.awsRequestId)
  }
  else if (method === "GET" && id === "all"){
    return obter_livros(docClient, tableName);
  }
  else if (method === "GET" && id){
    return obter_livro(docClient, tableName, id);
  }
  else{
    console.log(event);
    return event;
  }
};
```

## Um mapa de funções para evitar o if/else
Duration: 10:00

Percebeu como o código do arquivo `index.mjs` ficou bem mais simples e fácil de manter? Apesar disso, ele tem um problema. A estrutura if/else que ele utiliza viola um princípio do desenvolvimento de software conhecido como **princípio aberto/fechado**.

Em geral, quando desenvolvemos um sistema computacional, o ideal é que ele esteja

* **fechado** para alteração de código existente, assim corremos menos risco de adicionar bugs
* **aberto** para adição de novo código, assim, se for necessário implementar novas funcionalidades, podemos fazê-lo sem ter de mexer em código existente, novamente, minimizando a chance de introduzir bugs

O código do arquivo `index.mjs` está em desacordo com este princípio pelo fato de usar uma estrutura if/else. A cada nova funcionalidade, temos de adicionar uma nova "perninha if/else" à estrutura.

Em geral, esse problema é resolvido criando-se um **mapa de funções**. É um simples objeto Javascript que tem como chaves os nomes dos métodos e como valores associados, as funções a serem executadas de acordo com o método escolhido.

Veja uma possível implementação.

<aside class="positive">

**Nota.** Quando chamarmos uma função, vamos empacotar tudo de que ela pode precisar num único objeto. Na sua lista de parâmetros, ela usa o operador `{}` para desestruturar aquilo que recebeu, pegando apenas as partes que lhe são de interesse.

</aside>

**index.mjs (trecho)**

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";

const funcoes = {
  "POST": ({docClient, tableName, payload, id}) =>
    inserir_livro(docClient, tableName, payload, context.awsRequestId),
  "GET": ({docClient, tableName, id}) => id === "all" ?
    obter_livros(docClient, tableName) : obter_livro(docClient, tableName, id)
}

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "Livro-pdfs";

export const handler = async (event, context) => {
...
```

<aside class="positive">

**Nota.** Observe que há uma estrutura de seleção (um operador ternário) na função associada ao método GET. É natural, afinal há duas operações que fazem uso desse método. Podemos melhorar isso passando, por exemplo, o nome da operação desejada como um parâmetro entregue à Lambda, que pode ser especificado na fase Integration Request do API Gateway. Vamos manter a solução assim por enquanto. O mapa criado é suficiente para ilustrar a ideia principal.

</aside>

Depois, substituímos a estrutura if/else pelo acesso ao mapa de funções. Observe que esse trecho de código, a partir de agora, está de acordo com o princípio aberto/fechado. Independente da operação desejada, não temos de alterar nada. Também utilizamos um `try/catch`. Isso acontece pois pode acontecer de recebermos uma requisição por meio de um método que não foi definido. Isso causaria uma exceção. Ela acontecerá ainda assim, mas fazemos seu tratamento com `try/catch`. Caso ocorra, o fluxo de execução desvia para o bloco `catch` e apenas exibimos o evento e o devolvemos, terminando sem causar erros.

**index.mjs**

```javascript
import inserir_livro from './inserir_livro.mjs';
import obter_livros from './obter_livros.mjs';
import obter_livro from './obter_livro.mjs';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";

const funcoes = {
  "POST": ({docClient, tableName, payload}) => inserir_livro(docClient,
    tableName, payload, context.awsRequestId),
  "GET": ({docClient, tableName, id}) => id === "all" ?
    obter_livros(docClient, tableName) : obter_livro(docClient,
    tableName, id)
}

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "Livro-pdfs";

export const handler = async (event, context) => {
  const {method, payload, id} = event
  //esse código está de acordo com o princípio aberto/fechado
  try{
    return funcoes[method]({docClient, tableName, payload, id});
  }
  catch (e){
    console.log(event);
    return event;
  }
};
```

<aside class="negative">

**Cuidado com o `context`.** Na função associada a `"POST"`, `context` não está no escopo: ele é um parâmetro do `handler`, e o mapa `funcoes` fica fora dele. Ao testar o POST, a referência a `context` gera um erro, capturado pelo `catch`, e o evento é devolvido sem inserir o livro. Uma forma de resolver, no mesmo espírito da nota acima, é incluir o id no objeto entregue às funções (por exemplo, `id: context.awsRequestId` quando o método for POST) e usá-lo em `inserir_livro`.

</aside>

## Exercícios
Duration: 30:00

Utilizando a arquitetura vista em aula, implemente os seguintes endpoints, completando a definição de nossa API.

* `PUT /livros/{id}`
* `DELETE /livros/{id}`

Ajuste a solução computacional desenvolvida até então para que ela faça uso de uma função Lambda separada para cada endpoint existente, como na figura.

![Diagrama: os endpoints POST /livros, GET /livros, GET /livros/{id}, PUT /livros/{id} e DELETE /livros/{id} do API Gateway, cada um ligado à sua própria função, de Lambda 1 a Lambda 5](img/p003-1.webp)

*Uma função Lambda separada para cada endpoint.*

## Encerramento
Duration: 3:00

Parabéns! Você acrescentou à API de livros os endpoints `GET /livros` e `GET /livros/{id}`, fez uma única função Lambda atender a todos eles a partir do método HTTP, organizou o código em módulos e substituiu o if/else por um mapa de funções.

O próximo codelab desta série é o **AWS Serverless 06**.

### Referências

1. Amazon Web Services (AWS) - Cloud Computing Services. 2023. Disponível em [https://aws.amazon.com/](https://aws.amazon.com/). Acesso em setembro de 2023.
2. PiCloud Launches Serverless Computing Platform To The Public | TechCrunch. 2023. Disponível em [https://techcrunch.com/2010/07/19/picloud-launches-serverless-computing-platform-to-the-public/](https://techcrunch.com/2010/07/19/picloud-launches-serverless-computing-platform-to-the-public/). Acesso em setembro de 2023.
3. Serverless Architectures. 2023. Disponível em [https://martinfowler.com/articles/serverless.html](https://martinfowler.com/articles/serverless.html). Acesso em setembro de 2023.
4. Who coined the term 'serverless'?. 2023. Disponível em [https://www.quora.com/Who-coined-the-term-serverless](https://www.quora.com/Who-coined-the-term-serverless). Acesso em setembro de 2023.
