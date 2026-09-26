summary: Conheça o modelo de dados do Amazon DynamoDB, crie a tabela de livros e itens pelo console e faça a função Lambda (Node.js, AWS SDK v3, async/await) inserir livros recebidos pelo POST /livros do API Gateway.
id: serverless-04-dynamodb
categories: AWS,Serverless,Node.js
tags: aws,serverless,dynamodb,lambda,api gateway,node.js,aws sdk,async await,thunder client
status: Published
authors: Rodrigo Bossini
last updated: 2023-09-06
pdf: topicos_avancados_em_backend/04_apostila_aws_serverless.pdf
exercicios: topicos_avancados_em_backend/04_exercicio_aws_serverless.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# AWS Serverless 04: persistência com DynamoDB

## Visão geral
Duration: 3:00

Neste material, prosseguimos com o desenvolvimento da solução retratada a seguir.

![Arquitetura da aplicação: front-end no S3, autenticação com Cognito, endpoints POST, GET e DELETE /livro no API Gateway, regras de negócio no Lambda e dados no DynamoDB](img/p001-1.webp)

*A aplicação que estamos construindo ao longo da série.*

### O que você vai aprender

* As características e o modelo de dados do **Amazon DynamoDB** (tabelas, itens, atributos, Partition Key e Sort Key)
* Como criar uma tabela e itens pelo console do DynamoDB
* Os tipos de atributo do DynamoDB (S, N, B, BOOL, M, L)
* Como acessar o DynamoDB a partir de uma função Lambda com o AWS SDK para JavaScript v3
* Como usar `async`/`await` no handler da função Lambda
* Como testar o `POST /livros` com a Thunder Client

### O que você vai precisar

* Acesso ao **AWS Academy Learner Lab**
* A API `loja-livros` e a função Lambda criadas nos codelabs anteriores da série
* O VS Code com a extensão **Thunder Client**

## Sobre o DynamoDB
Duration: 8:00

O **DynamoDB** é um serviço de armazenamento de dados gerenciado da Amazon. Algumas de suas características são:

* Por ser um serviço gerenciado, não nos cabe fazer atualizações de sistema operacional ou mesmo do próprio sistema gerenciador de banco de dados. A escalabilidade também fica por conta da Amazon.
* Os dados que armazenamos são criptografados automaticamente.
* Todos os dados são armazenados em **SSDs**.
* Todos os dados são automaticamente replicados em múltiplas zonas de disponibilidade dentro de uma mesma região.
* Podemos escolher replicar os dados **globalmente**, em diversas **regiões**.
* Seu modelo de dados baseia-se no seguinte:
  * **Tabelas**: similar a tabelas de outros sistemas de bancos de dados.
  * **Itens**: cada tabela contém zero ou mais itens. Um item é um grupo de atributos que pode ser diferenciado de todos os demais. Em uma tabela que armazena pessoas, por exemplo, um item é uma pessoa.
  * **Atributos**: um dado "**escalar**", por exemplo uma string, um número inteiro, um valor booleano etc.
* Não há "**schema**" predefinido. Isso quer dizer que não é necessário definir os atributos que os itens de uma tabela têm e nem o seu tipo.
* As tabelas necessariamente possuem **chave primária**. A chave primária de uma tabela pode ser simples (um único atributo) ou composta (dois atributos).
  * Uma chave primária simples leva o nome de **Partition Key**. Em função de seu valor, o DynamoDB calcula um código hash que serve para determinar a localização física daquele item no mecanismo interno do sistema.
  * Uma chave primária composta possui uma **Partition Key** e uma **Sort Key**. O código hash calculado em função de sua Partition Key também serve para determinar a localização física do item. Todos os itens com Partition Key igual são armazenados juntos, ordenados de acordo com a Sort Key. Uma tabela que possui chave primária composta pode conter valores repetidos na Partition Key, desde que os valores de Sort Key sejam diferentes.

As figuras a seguir mostram exemplos de tabelas com chaves primária simples e composta.

![Tabela People com três itens identificados por PersonID, cada um com atributos diferentes, como LastName, FirstName, Phone, Address e FavoriteColor](img/p002-1.webp)

*Chave primária simples.*

![Tabela Music com itens identificados por Artist e SongTitle, com atributos como AlbumTitle, Price, Genre e CriticRating](img/p003-1.webp)

*Chave primária composta.*

Leia mais sobre o DynamoDB na documentação: [https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html).

## Criando a tabela de livros
Duration: 8:00

Utilizaremos o DynamoDB para armazenar os dados envolvidos em nossa aplicação em meio persistente. No console AWS, busque por **DynamoDB**. Clique em seu nome segurando **CTRL** no teclado. Assim você terá uma aba exclusiva para manipular o DynamoDB.

![Barra de pesquisa do console com o texto dynamodb e o serviço DynamoDB destacado](img/p004-1.webp)

*Buscando o DynamoDB.*

<aside class="negative">

O DynamoDB é um serviço **regional**. Por isso, verifique no canto superior direito se a região selecionada é aquela que você deseja utilizar.

</aside>

![Página inicial do DynamoDB com o seletor de regiões aberto no canto superior direito](img/p004-2.webp)

*Conferindo a região.*

Para criar uma nova tabela, clique em **Create table**.

![Página inicial do DynamoDB com o botão Create table destacado](img/p004-3.webp)

*Create table.*

Use **Livro** como nome da tabela e **LivroID** como a sua chave primária. A tabela terá uma chave primária simples. Portanto, use apenas o campo **Partition Key**. O tipo dela é **String**.

<aside class="negative">

Nas capturas de tela e no código da função Lambda deste codelab, a tabela se chama `Livro-pdfs`. Use o mesmo nome na tabela e no código.

</aside>

![Formulário Create table com o nome da tabela Livro-pdfs e a Partition key LivroID do tipo String destacados](img/p005-1.webp)

*Nome da tabela e chave de partição.*

Mais abaixo, mantenha a opção **Use default settings**. Clique em **Create table**.

![Seção Table settings com Default settings selecionado e o botão Create table destacado](img/p006-1.webp)

*Mantendo as configurações padrão.*

Segundo a mensagem a seguir, a criação da tabela pode demorar um pouco. Aguarde.

![Lista de tabelas com a mensagem informando que a tabela está sendo criada](img/p006-2.webp)

*A criação da tabela pode levar alguns instantes.*

Clique no nome da tabela.

![Lista de tabelas com o nome da tabela destacado](img/p007-1.webp)

*Abrindo a tabela.*

## Criando um item
Duration: 8:00

Um **item** é semelhante a uma linha de uma tabela no modelo relacional. É uma instância da entidade representada por aquela tabela. Criemos um item manualmente em nossa tabela de livros. Para isso, clique em **Actions >> Create Item**.

![Página da tabela com o menu Actions aberto e a opção Create item destacada](img/p007-2.webp)

*Actions >> Create Item.*

Coloque o número `1` (ele será armazenado como String) como chave primária. Depois, clique em **Add new attribute** para adicionar um novo atributo. Ele será do tipo **String**. Um atributo é semelhante a uma coluna no modelo relacional.

![Formulário Create item com o valor da chave LivroID e o menu Add new attribute aberto na opção String](img/p007-3.webp)

*Adicionando um atributo do tipo String.*

Repita o passo a passo para criação de novos atributos (**Add new attribute >> String**) que caracterizam um livro. Todos eles serão do tipo String. Ao final, clique em **Create item**.

![Formulário Create item com LivroID 1, titulo Concrete Mathematics, autor Donald Knuth, edicao 1 e o botão Create item destacado](img/p008-1.webp)

*Os atributos do livro.*

Clique sobre a chave primária do item para visualizá-lo.

![Itens retornados da tabela com a chave primária do item criado destacada](img/p008-2.webp)

*Abrindo o item criado.*

Observe que ele pode ser visualizado como um objeto JSON.

![Tela Edit item em JSON view mostrando os atributos LivroID, titulo, autor e edicao, cada um com o tipo S](img/p009-1.webp)

*O item visualizado como JSON.*

Clique em **Cancel** quando terminar de visualizar o item.

<aside class="positive">

A letra **S** representa o tipo do atributo. Neste caso, String. Outros possíveis valores são:

* **N**: Number
* **B**: Binary
* **BOOL**: booleano
* **M**: Mapa (coleção de pares chave/valor que fica aninhada no item)
* **L**: Lista

Veja mais em [https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html).

</aside>

## Acessando o DynamoDB a partir de uma função Lambda
Duration: 15:00

Os serviços AWS podem ser acessados "programaticamente" por meio de **SDKs** que a Amazon disponibiliza para diferentes linguagens. Quando vamos acessar um dos serviços em uma função Lambda, as funcionalidades dos SDKs já estão automaticamente disponíveis, não há a necessidade de fazer qualquer instalação.

Neste passo, vamos editar a nossa função Lambda. Ela será responsável por fazer a inserção de um livro. Lembre-se que ela está sendo acionada pelo API Gateway quando ele recebe uma requisição do tipo **POST** direcionada ao recurso `/livros`. Comece visitando a sua lista de funções Lambda e escolhendo aquela em que temos trabalhado até então.

![Lista de funções Lambda com a função lambda-pdfs destacada](img/p010-1.webp)

*Escolhendo a função Lambda.*

### De callbacks para async/await

A seguir, vamos ajustar a nossa função para que ela deixe de operar utilizando callbacks e passe a utilizar a construção **async/await** do JavaScript. Dessa forma, o código tende a ficar mais fácil de ler, manter e "debugar".

<aside class="positive">

O uso de funções callback tende a dar origem ao conhecido **inferno de callbacks**. Veja mais em [https://developer.mozilla.org/pt-BR/docs/Learn/Server-side/Express_Nodejs/Introduction](https://developer.mozilla.org/pt-BR/docs/Learn/Server-side/Express_Nodejs/Introduction) e aqui também [http://callbackhell.com/](http://callbackhell.com/).

</aside>

Veja como ela fica.

**index.mjs**

```javascript
export const handler = async (event, context) => {
};
```

### Importando o SDK

O próximo passo é importar:

* **DynamoDBClient**: como o nome sugere, representa um cliente DynamoDB. Permite que executemos comandos para a criação de tabelas, criação de itens, remoção de itens etc.
* **DynamoDBDocumentClient**: empacota o DynamoDBClient. Ele se encarrega de fazer conversões entre tipos nativos do JavaScript e do DynamoDB. Veja o que a documentação oficial fala sobre ele: "*The document client simplifies working with items in Amazon DynamoDB by abstracting away the notion of attribute values. This abstraction annotates native JavaScript types supplied as input parameters, as well as converts annotated response data to native JavaScript types.*" ([https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html))
* **PutCommand**: representa um comando de inserção de item no DynamoDB. Ele será construído com informações como o nome da tabela e os valores que caracterizam um item a ser inserido. Depois, utilizamos um cliente para enviá-lo ao servidor.

<aside class="positive">

Lembra-se da especificação de tipo no DynamoDB usando as letras S, M, N etc.? O objeto **PutCommand** abstrai essa especificação. Ou seja, não temos de digitar esses tipos explicitamente.

</aside>

**index.mjs**

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const handler = async (event, context) => {
};
```

### Os clientes

A seguir, construímos o objeto **DynamoDBClient**. Observe que entregamos ao seu construtor um objeto em que poderíamos personalizar opções diversas. Um exemplo é a região. Neste momento, no entanto, não temos nada a personalizar. Por isso, passamos um objeto vazio.

**index.mjs**

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event, context) => {
};
```

A seguir, construímos o objeto **DynamoDBDocumentClient**. Observe como ele "empacota" o objeto DynamoDBClient, provendo mais funcionalidades, como a conversão de tipos que mencionamos.

**index.mjs**

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {
};
```

### O id do livro

Precisamos de um id para o livro. Há diferentes formas para se obter um. Neste exemplo, observe que, a cada requisição recebida pela função Lambda, um identificador de requisição é gerado. Vamos utilizar este mesmo identificador como identificador do livro sendo inserido no momento. Ele pode ser obtido a partir do objeto `context` que a nossa função recebe e seu nome é `awsRequestId`.

**index.mjs**

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {
  const id = context.awsRequestId;
};
```

### O comando de inserção

A seguir, construímos o objeto **PutCommand** especificando o nome da tabela e os dados do item (o livro) a ser inserido. Observe como utilizamos o id da requisição e também os dados do objeto `event`.

**index.mjs**

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {
  const id = context.awsRequestId;
  const command = new PutCommand({
    TableName: "Livro-pdfs",
    Item: {
      LivroID: context.awsRequestId,
      titulo: event.titulo,
      autor: event.autor,
      edicao: event.edicao
    },
  });
};
```

A seguir, podemos enviar o comando e "aguardar" a resposta com a construção `await`. Depois disso, devolvemos um objeto com a instrução `return`. O que ela devolve é equivalente àquilo que devolvíamos quando utilizávamos a função callback, usando seu segundo parâmetro.

**index.mjs**

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {
  const id = context.awsRequestId;
  const command = new PutCommand({
    TableName: "Livro-pdfs",
    Item: {
      LivroID: context.awsRequestId,
      titulo: event.titulo,
      autor: event.autor,
      edicao: event.edicao
    },
  });
  const response = await docClient.send(command);
  return response;
};
```

A função Lambda está pronta. Não se esqueça de clicar em **Deploy**.

## Teste com a Thunder Client
Duration: 8:00

Caso tenha realizado alguma alteração na sua API no API Gateway, faça novo deploy dela. Se estiver na dúvida, faça mesmo assim.

![Recursos da API com o menu Actions aberto mostrando a opção Deploy API](img/p015-1.webp)

*Actions >> Deploy API.*

Depois disso, pegue o link de seu stage no API Gateway.

![Stage dev com a Invoke URL destacada](img/p015-2.webp)

*O link do stage.*

Faça uma nova requisição na Thunder Client: método **POST**, a URL do stage terminada em `/livros` e, na aba **Body**, um JSON com os dados do livro.

**Thunder Client · Body (JSON)**

```json
{
  "titulo": "ABC",
  "autor": "ABC",
  "edicao": "1"
}
```

![Thunder Client com uma requisição POST para a URL do stage terminada em /livros, o corpo JSON com titulo, autor e edicao, e a resposta 200 OK com metadados técnicos da requisição ao DynamoDB](img/p016-1.webp)

*Requisição POST /livros e sua resposta.*

Observe que o resultado inclui detalhes técnicos da requisição enviada ao DynamoDB. Isso está acontecendo pois a função Lambda realiza a requisição ao DynamoDB e, quando recebe a resposta, apenas a devolve ao API Gateway.

Visite também o DynamoDB e verifique se o novo livro foi cadastrado.

![Lista de tabelas do DynamoDB com a tabela Livro-pdfs destacada](img/p016-2.webp)

*Abrindo a tabela no DynamoDB.*

![Página da tabela Livro-pdfs com o botão para explorar os itens da tabela](img/p016-3.webp)

*Explorando os itens da tabela.*

![Itens retornados da tabela Livro-pdfs, incluindo o livro inserido pela requisição com o id gerado pela função Lambda](img/p017-1.webp)

*O novo livro cadastrado no DynamoDB.*

## Exercícios
Duration: 30:00

1. Use o quadro **Integration Response** do API Gateway e/ou a função Lambda para transformar o resultado que será entregue para o cliente. Você deve devolver um objeto assim:

```json
{
  "id": "id que foi gerado durante a requisição e salvo no DynamoDB",
  "titulo": "ABC",
  "autor": "ABC",
  "edicao": "1"
}
```

2. Implemente o endpoint `GET /livros`. Ele deve devolver a coleção de livros existente no DynamoDB. Para fazer essa implementação, você pode criar uma nova função Lambda. Estude os exemplos de código em [https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_dynamodb_code_examples.html#actions](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_dynamodb_code_examples.html#actions). No quadro **Integration Response**, transforme o resultado da seguinte forma:

```json
[
  {
    "id": "id que foi gerado durante a requisição e salvo no DynamoDB",
    "titulo": "ABC",
    "autor": "ABC",
    "edicao": "1"
  },
  {
    "id": "id que foi gerado durante a requisição e salvo no DynamoDB",
    "titulo": "JKD",
    "autor": "JKD",
    "edicao": "2"
  }
]
```

## Encerramento
Duration: 2:00

Parabéns! Sua API agora grava livros de forma persistente no DynamoDB: o `POST /livros` do API Gateway aciona a função Lambda, que usa o AWS SDK para inserir o item na tabela. No próximo codelab da série (AWS Serverless 05), seguimos com a implementação.

### Referências

1. Amazon Web Services (AWS) - Cloud Computing Services. 2023. Disponível em [https://aws.amazon.com/](https://aws.amazon.com/). Acesso em setembro de 2023.
2. PiCloud Launches Serverless Computing Platform To The Public | TechCrunch. 2023. Disponível em [https://techcrunch.com/2010/07/19/picloud-launches-serverless-computing-platform-to-the-public/](https://techcrunch.com/2010/07/19/picloud-launches-serverless-computing-platform-to-the-public/). Acesso em setembro de 2023.
3. Serverless Architectures. 2023. Disponível em [https://martinfowler.com/articles/serverless.html](https://martinfowler.com/articles/serverless.html). Acesso em setembro de 2023.
4. Who coined the term 'serverless'?. 2023. Disponível em [https://www.quora.com/Who-coined-the-term-serverless](https://www.quora.com/Who-coined-the-term-serverless). Acesso em setembro de 2023.
