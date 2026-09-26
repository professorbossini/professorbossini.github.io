summary: Reorganize a API de livros no padrão REST, crie o método POST integrado a uma função Lambda e explore os quadros de integração do API Gateway: Lambda Proxy Integration, logs no CloudWatch, mapping templates de requisição e de resposta, modelos JSON Schema e validação de requisições.
id: serverless-03-mapping-templates-validacao
categories: AWS,Serverless,Node.js
tags: aws,serverless,api-gateway,lambda,cloudwatch,mapping-templates,json-schema,validacao,rest,nodejs
status: Published
authors: Rodrigo Bossini
last updated: 2023-08-30
pdf: topicos_avancados_em_backend/03_apostila_aws_serverless.pdf
exercicios: topicos_avancados_em_backend/03_exercicio_aws_serverless.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# AWS Serverless 03: Lambda Proxy, mapping templates e validação no API Gateway

## Visão geral
Duration: 3:00

Neste material, prosseguimos com o desenvolvimento da solução retratada a seguir: um Front End hospedado no **Amazon S3**, autenticação com o **Amazon Cognito**, uma API no **Amazon API Gateway**, regras de negócio em funções **AWS Lambda** e persistência no **Amazon DynamoDB**.

![Arquitetura da solução: Front End no S3 com campos Título, Autor e Edição e botões Inserir, Listar e Apagar; autenticação no Cognito; API Gateway com os endpoints POST /livro, GET /livro e DELETE /livro; função Lambda com as regras de negócio; e banco de dados DynamoDB](img/p001-1.webp)

*Arquitetura da solução que estamos construindo ao longo da série.*

Neste codelab, o foco é o **API Gateway** e a sua integração com a função Lambda: ajustamos a API ao padrão arquitetural REST, criamos o método de cadastro de livros e estudamos, na prática, o que acontece em cada fase de uma requisição.

### O que você vai aprender

* Como organizar os endpoints de uma API no padrão arquitetural **REST** (`/livros` e `/livros/{id}`)
* Como criar um recurso com **CORS** habilitado e um método **POST** integrado a uma função Lambda
* Como publicar a API em um **stage** e testá-la com um cliente HTTP (Thunder Client)
* O que faz a opção **Use Lambda Proxy Integration** e qual o formato de resposta que a Lambda precisa devolver quando ela está ligada
* Como inspecionar o objeto `event` pelos logs do **AWS CloudWatch**
* Como usar **Mapping Templates** nos quadros **Integration Request** e **Integration Response** para transformar requisições e respostas
* Os principais elementos da linguagem de templates (`$input`, `json`, `params`, `path`, `$`)
* Como criar **modelos** com **JSON Schema** e usá-los para **validar** requisições e para gerar templates de mapeamento

### O que você vai precisar

* Acesso ao console da AWS (por exemplo, pelo AWS Academy Learner Lab)
* A API do API Gateway e a função Lambda (Node.js) criadas nos codelabs anteriores desta série
* Um cliente HTTP, como a extensão **Thunder Client** do VS Code (ou o Postman)

## Ajustando a API ao padrão REST
Duration: 6:00

Neste momento, vamos adaptar a API para que ela possua os seguintes endpoints. O padrão utilizado é bastante comum no mercado.

| Método | Endpoint | Finalidade |
| --- | --- | --- |
| `POST` | `/livros` | cadastrar um livro novo |
| `GET` | `/livros` | obter todos os livros |
| `GET` | `/livros/{id}` | obter um livro pelo seu id |
| `PUT` | `/livros/{id}` | atualizar um livro pelo seu id |
| `DELETE` | `/livros/{id}` | apagar um livro pelo seu id |

Caso já possua um recurso criado anteriormente, remova-o para começarmos do zero. No exemplo a seguir, o recurso `/livro-salvar` já existe. Vamos removê-lo.

![Console do API Gateway com o recurso /livro-salvar selecionado e o menu Actions aberto, com a opção Delete Resource destacada](img/p002-1.webp)

*Removendo o recurso antigo pelo menu Actions > Delete Resource.*

<aside class="negative">

**Nota.** Remova qualquer recurso que você já possua, independente de seu nome. **Mantenha a API.**

</aside>

A seguir, crie um recurso chamado `livros`.

![Menu Actions aberto sobre a raiz / da API, com a opção Create Resource destacada](img/p002-2.webp)

*Actions > Create Resource.*

Ajuste o nome e marque a opção **CORS**. Ela será importante quando implantarmos a nossa aplicação Front End, pois as origens de Front End e do Back End serão diferentes.

![Tela New Child Resource com Resource Name e Resource Path preenchidos com livros, a caixa Enable API Gateway CORS marcada e o botão Create Resource destacado](img/p002-3.webp)

*Criando o recurso livros com CORS habilitado.*

## Método POST: cadastro de livros
Duration: 5:00

O primeiro método a ser criado é o **POST**. Ele viabilizará o cadastro de livros. Selecione o recurso `livros` para criá-lo.

![Recurso /livros selecionado e menu Actions aberto com a opção Create Method destacada](img/p003-1.webp)

*Actions > Create Method sobre o recurso /livros.*

Escolha **POST** e clique no pequeno botão de confirmação à frente.

![Lista de métodos sob /livros com POST selecionado e o botão de confirmação destacado](img/p003-2.webp)

*Escolhendo POST e confirmando.*

A seguir, escolha **Lambda Function** como **Integration Type**. Comece a digitar o nome de sua função Lambda a fim de que seu nome apareça e você possa selecioná-lo.

![Tela /livros - POST - Setup com Integration type Lambda Function marcado, o campo Lambda Function preenchido com lambda-pdfs e o botão Save destacado](img/p004-1.webp)

*Integrando o método POST à função Lambda.*

## Publicando e testando a API
Duration: 8:00

A seguir, publicamos a API. Assim teremos uma URL que poderá ser utilizada externamente. Clique em **Actions >> Deploy API**. Neste caso, o endpoint selecionado não importa pois estamos publicando a API de uma única vez, com todos os seus endpoints.

![Menu Actions aberto sobre o método POST de /livros, com a opção Deploy API destacada](img/p004-2.webp)

*Actions > Deploy API.*

Crie um novo **stage** – cujo nome pode ser algo como `dev` – e defina descrições para o stage e para implantação, caso deseje.

![Diálogo Deploy API com Deployment stage igual a New Stage, Stage name preenchido com dev e o botão Deploy destacado](img/p005-2.webp)

*Criando o stage dev na publicação.*

A seguir, você verá uma URL associada ao nome **Invoke URL**.

![Tela do stage dev no API Gateway com a Invoke URL destacada no topo](img/p006-1.webp)

*A Invoke URL do stage publicado.*

Observe que a URL dá acesso à raiz da aplicação. Se desejarmos acessar o endpoint `/livros`, precisamos concatenar esta parte do endereço à URL. Fica assim:

**Endereço do endpoint**

```text
url/livros
```

Neste exemplo do material, ficou assim:

**Endereço do endpoint (exemplo)**

```text
https://kfq5lol2ci.execute-api.us-east-1.amazonaws.com/dev/livros
```

Para testar, abra um cliente HTTP, como a **Thunder Client**. Faça o seguinte teste: uma requisição **POST** para a URL do endpoint, com o corpo JSON abaixo.

**Thunder Client · Body (JSON)**

```json
{
  "titulo": "Concrete Mathematics",
  "autor": "Donald Knuth",
  "edicao": 1
}
```

![Thunder Client no VS Code com uma requisição POST para a URL /dev/livros, o corpo JSON com titulo, autor e edicao e a resposta Status 200 OK devolvendo o mesmo objeto](img/p006-2.webp)

*Teste do endpoint POST /livros com o Thunder Client.*

Observe que a função Lambda está devolvendo o objeto `event`. Lembre-se de que ele é o corpo da requisição, pelo menos por enquanto.

<aside class="positive">

**Nota:** a opção **Stages** no menu à esquerda permite averiguar, entre outras coisas, o histórico de implantações realizadas.

</aside>

![dev Stage Editor aberto pelo menu Stages, com a Invoke URL e a aba Deployment History listando uma implantação](img/p007-1.webp)

*Histórico de implantações do stage dev.*

## Repassando a request completa: Lambda Proxy Integration
Duration: 12:00

O API Gateway está fazendo um tratamento prévio da requisição. Uma requisição HTTP POST possui, além do corpo, diversas outras informações. Por exemplo, seus **headers**. Veja um exemplo. Apenas inspecione.

**Exemplo de requisição HTTP**

```text
POST /api/books HTTP/1.1
Host: exemplo.com
Content-Type: application/json
Authorization: Bearer seu_token_jwt_aqui
User-Agent: ThunderClient (VS Code Extension)
Accept: application/json
Content-Length: 95

{
  "title": "O Nome do Vento",
  "author": "Patrick Rothfuss",
  "edition": "1ª Edição"
}
```

A opção chamada **Use Lambda Proxy Integration**, disponível no quadro **Integration Request**, permite que repassemos a requisição completa do API Gateway para a função Lambda, incluindo os headers etc.

<aside class="positive">

**Nota.** Nos passos a seguir, um de nossos objetivos é estudar as funcionalidades providas pelo API Gateway por meio de seus quadros de integração (**Integration Request** e **Integration Response**).

</aside>

Para testá-la, no API Gateway, selecione o método **POST** e clique **Integration Request**.

![Tela /livros - POST - Method Execution com o método POST selecionado e o quadro Integration Request destacado](img/p008-1.webp)

*Abrindo o quadro Integration Request do método POST.*

A seguir, marque a caixa **Use Lambda Proxy Integration** e clique **Ok** no diálogo que aparece. Clique **Ok** uma vez mais para conceder a permissão solicitada.

![Caixa Use Lambda Proxy integration marcada e o diálogo Switch to Lambda Proxy integration com o botão OK destacado](img/p009-1.webp)

*Ligando a opção Use Lambda Proxy Integration.*

Faça um novo teste. Para isso, na tela **Method Execution**, clique em **TEST**.

![Tela Method Execution do POST com o botão TEST destacado; o quadro Integration Request mostra Type LAMBDA_PROXY](img/p009-2.webp)

*O botão TEST na tela Method Execution.*

Observe que um erro será gerado.

![Tela Method Test com o corpo da requisição preenchido e a resposta Status 502 com a mensagem Internal server error](img/p010-1.webp)

*Com o proxy ligado, o teste devolve 502 Internal server error.*

Ocorre que a requisição não pode ser devolvida como resposta diretamente, já que ela não está de acordo com o **modelo da resposta**. Quando usamos a opção **Use Lambda Proxy Integration** estamos especificando que a requisição será passada por completo para a função lambda e que as transformações desejadas serão responsabilidade dela, o que, até então, era feito no quadro **Integration Response**. Inclusive, veja que ele está desabilitado.

![Tela Method Execution com o quadro Integration Response destacado, exibindo a mensagem Proxy integrations cannot be configured to transform responses](img/p010-2.webp)

*O quadro Integration Response fica desabilitado quando o proxy está ligado.*

Sendo assim, na função Lambda, precisamos construir um objeto que esteja de acordo com o formato de resposta esperado. Podemos, por exemplo, especificar alguns headers.

**index.mjs (função Lambda)**

```javascript
export const handler = (event, context, callback) => {
  callback(null, {
    headers: {
      "Content-Type": "application/json",
      "Date": Date()
    }
  });
};
```

A seguir, faça **Deploy** da função Lambda. No API Gateway, execute um novo teste.

![Tela Method Test com Status 200 destacado, Response Body igual a no data e os headers Content-Type e Date na resposta](img/p012-2.webp)

*Resposta 200 com os cabeçalhos definidos, mas sem corpo.*

Observe que a requisição foi atendida com sucesso. Entretanto, a resposta não possui corpo. Afinal, a função Lambda devolve um objeto que possui apenas cabeçalhos.

## O objeto event com Proxy Integration e o AWS CloudWatch
Duration: 12:00

Diante do cenário descrito, estamos interessados em conhecer a estrutura do objeto `event` quando a opção **Proxy Integration** está habilitada. Para isso, vamos aprender a acessar os logs por meio do **AWS CloudWatch**.

Comece exibindo o objeto `event` com uma chamada ao método `log` de `console` simples.

**index.mjs · Listagem 3.6.1**

```javascript
export const handler = (event, context, callback) => {
  console.log(event);
  callback(null, {
    headers: {
      "Content-Type": "application/json",
      "Date": Date()
    }
  });
};
```

Faça **Deploy** da função Lambda.

Faça novo teste no API Gateway. Isso fará com que o objeto `event` apareça nos logs. Observe que nada mudou quanto àquilo que a função Lambda devolve.

A fim de visualizar os logs, utilizaremos o serviço **AWS CloudWatch**. No Console AWS, comece buscando por **CloudWatch**.

![Barra de busca do console AWS com o termo cloudwatch e o serviço CloudWatch destacado nos resultados](img/p015-1.webp)

*Buscando o serviço CloudWatch.*

No menu à esquerda, clique em **Log groups**.

![Página inicial do CloudWatch com o item Log groups destacado no menu Logs à esquerda](img/p015-2.webp)

*Menu Logs > Log groups.*

Depois de clicar em **Log Groups**, clique sobre o grupo cujos logs você deseja verificar.

![Lista de Log groups com o grupo /aws/lambda/lambda-pdfs destacado](img/p016-1.webp)

*Escolhendo o grupo de logs da função Lambda.*

Na tela seguinte, clique sobre o item cuja ocorrência seja a mais recente. Note que você pode ordenar os itens pela coluna **Last event time**.

![Lista de Log streams do grupo, ordenada pela coluna Last event time, com o stream mais recente destacado](img/p016-2.webp)

*Log streams ordenados pelo evento mais recente.*

A próxima tela permite que vejamos os logs de interesse. Procure por um que contenha o item `resource` associado a seu endpoint e clique para expandir. Verifique a estrutura do objeto. Note que uma delas se chama `body`. A estrutura que estamos visualizando é o objeto `event`.

![Log expandido no CloudWatch mostrando o objeto event com resource /livros, path, httpMethod POST, headers, requestContext e, no fim, a propriedade body destacada](img/p017-1.webp)

*O objeto event completo, como a Lambda o recebe com o proxy ligado.*

Faça um novo teste exibindo a sua propriedade `body` no log da função Lambda.

**index.mjs (função Lambda)**

```javascript
export const handler = (event, context, callback) => {
  console.log(event.body);
  callback(null, {
    headers: {
      "Content-Type": "application/json",
      "Date": Date()
    }
  });
};
```

Faça **Deploy** da função Lambda e faça novo teste no **API Gateway**. No CloudWatch, clique em **Log Groups** e selecione o recurso de interesse novamente. Escolha novamente a entrada mais recente. Observe que o log inclui apenas aquilo que foi enviado ao API Gateway e repassado à Lambda: o objeto livro.

![Log events no CloudWatch com a entrada expandida mostrando apenas o objeto com titulo Concrete Mathematics, autor Donald Knuth e edicao 1](img/p019-1.webp)

*Agora o log mostra apenas o corpo da requisição: o livro.*

## Body Mapping Templates
Duration: 15:00

O que fizemos até então nos permite visualizar a estrutura do objeto que representa a requisição. Assim, entendemos o funcionamento da opção **Use Lambda Proxy integration**. Ela nos permite manipular a requisição **mais diretamente**, caso necessário. Contudo, se escrevermos regras de negócio com funções Lambda que a manipulam diretamente, estaremos desperdiçando recursos que o API Gateway fornece. Neste passo veremos como usar a opção **Body Mapping Templates**.

Visite novamente o API Gateway e escolha o método **POST** de sua API. Clique no quadro **Integration Request**.

![Tela Method Execution do POST com o quadro Integration Request destacado, ainda com Type LAMBDA_PROXY](img/p019-2.webp)

*Voltando ao quadro Integration Request.*

Desmarque a opção **Use Lambda Proxy Integration** e clique em **OK** no diálogo que aparece logo depois.

![Diálogo Switch to Lambda integration, exibido ao desmarcar Use Lambda Proxy integration, com o botão OK destacado](img/p020-1.webp)

*Desligando o proxy.*

Façamos um novo teste. Comece ajustando a função Lambda. Lembre-se de fazer o **Deploy** dela depois de mexer no código. No exemplo a seguir, a função Lambda espera receber um objeto com uma propriedade `livro`. Associada a ela, outro objeto contendo os dados de um livro.

**index.mjs (função Lambda)**

```javascript
export const handler = (event, context, callback) => {
  callback(null, "O título do livro é " + event.livro.titulo);
};
```

Faça novo teste no API Gateway usando o seguinte objeto JSON. Observe que ele possui a chave `livro` esperada pela Lambda.

**Request Body (teste no API Gateway)**

```json
{
  "livro": {
    "titulo": "Concrete Mathematics",
    "autor": "Donaldo Knuth",
    "edicao": "2"
  }
}
```

Veja o resultado esperado.

![Tela Method Test com o corpo contendo a chave livro e o Response Body destacado com o texto O título do livro é Concrete Mathematics](img/p021-1.webp)

*A Lambda recebeu o objeto livro e devolveu o título.*

Lembre-se que o quadro **Integration Request** pode ser utilizado para fazer transformações sobre os dados recebidos na requisição. Certas transformações podem tornar a implementação do Back End (neste caso, a função Lambda) mais simples.

Vá até o quadro **Integration Request**, expanda **Mapping Templates** e marque a opção **When there are no template defined**. Com esta opção estamos especificando que a requisição deve passar direto para o Back End, sem ser interceptada pela fase de integração, somente quando não há template definido. A seguir, vamos definir um template e, portanto, a requisição será interceptada e um tratamento acontecerá nesta fase. Podemos operar sobre a requisição tornando a sua estrutura mais conveniente para manipulação pelo Back End.

A seguir, clique em **Add Mapping Template**. Preencha o campo acima com `application/json` (exatamente assim, esse é um MIME Type). Clique no botão à frente para confirmar.

![Integration Request com Integration type Lambda Function, a seção Mapping Templates expandida, a opção When there are no templates defined marcada e o Content-Type application/json sendo adicionado por Add mapping template](img/p022-1.webp)

*Adicionando um mapping template para application/json.*

Logo abaixo, especifique um objeto JSON vazio e clique em **Save**. Estamos mapeando a requisição recebida para um objeto JSON vazio, apenas para testar.

**Mapping template (application/json)**

```json
{}
```

![Editor do mapping template application/json contendo apenas {} e o botão Save destacado](img/p022-2.webp)

*Mapeando a requisição para um objeto vazio.*

No API Gateway, faça um novo teste. Um erro deve acontecer.

![Tela Method Test com o Response Body destacado exibindo TypeError: Cannot read properties of undefined (reading 'titulo')](img/p023-1.webp)

*O teste agora falha com TypeError.*

Ocorre que `event` agora é um objeto JSON vazio, que não possui uma propriedade chamada `livro`. Acessá-la resulta em `undefined`. A seguir, tentamos acessar a propriedade `titulo` de `undefined`, o que causa o erro.

Visite também o CloudWatch. Clique em **Log Groups** e escolha o grupo de interesse. Ordene e escolha o mais recente. Expanda o recurso de interesse e veja que o log também fica registrado ali.

![Log events no CloudWatch com uma entrada ERROR Invoke Error expandida, mostrando errorType TypeError e errorMessage Cannot read properties of undefined (reading 'titulo')](img/p024-2.webp)

*O mesmo erro registrado no CloudWatch.*

Nosso objetivo é utilizar a fase **Integration Request** fazendo manipulações na requisição e tornando-a mais conveniente para manipulação por parte do Back End. Tal manipulação pode ser feita utilizando-se uma linguagem específica. Veja o link a seguir.

[https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html)

O exemplo a seguir, da documentação acima, mostra como montar um objeto JSON usando

* um parâmetro da URL chamado `name` (`$input.params('name')`)
* o corpo inteiro da requisição (`$input.json('$')`)

**Exemplo da documentação: mapping template usando $input**

```text
{
    "name" : "$input.params('name')",
    "body" : $input.json('$')
}
```

## Explorando e usando o objeto mapeado
Duration: 12:00

Em **Integration Request**, podemos ver um exemplo com muitos detalhes escolhendo a opção **Generate Template**.

![Seção Mapping Templates do Integration Request com application/json selecionado, Generate template igual a Method Request passthrough e o template gerado destacado no editor, com o botão Save](img/p025-2.webp)

*Gerando o template Method Request passthrough.*

Execute um novo teste e verifique os resultados. Perceba que o API Gateway continua mostrando erros (já que a função Lambda ainda tenta acessar uma propriedade chamada `livro` de `event`, que não existe).

![Tela Method Test com o Response Body destacado exibindo novamente o TypeError ao ler titulo de undefined](img/p026-1.webp)

*O erro continua: event ainda não tem a propriedade livro.*

Ajuste a função Lambda para que ela exiba o objeto `event`. Clique em **Deploy** depois de alterar o código.

**index.mjs (função Lambda)**

```javascript
export const handler = (event, context, callback) => {
  console.log(event);
  callback(null, "O título do livro é " + event.livro.titulo);
};
```

Agora podemos ver o objeto gerado no CloudWatch. Visite-o novamente, clique em **Log Groups**, escolha o grupo desejado, ordene para pegar o log mais recente. Com ele, podemos conhecer o significado de algumas propriedades definidas pela linguagem.

No CloudWatch, observe que o objeto gerado tem uma propriedade `body-json`. Compare o valor que está associado a ela com o código que foi utilizado para produzi-la no template.

![Log no CloudWatch com o objeto gerado pelo template: body-json contendo o livro, params com path, querystring e header, stage-variables e context com account-id, api-id, http-method, resource-path e outros](img/p027-1.webp)

*O objeto produzido pelo template Method Request passthrough.*

O valor associado à propriedade `body-json` do objeto que vemos no CloudWatch é o próprio corpo da requisição. O código utilizado para produzir este conteúdo é `$input.json('$')`.

Volte ao quadro **Integration Request**, no API Gateway. Expanda a seção **Mapping templates**, clique sobre o MIME Type `application/json` e substitua o conteúdo pelo seguinte. Ou seja, estamos extraindo as propriedades `titulo`, `autor` e `edicao` do objeto associado à chave `livro` do corpo da requisição e construindo um objeto JSON que possui tais propriedades na raiz. Uma simplificação para a função Lambda manipular o livro.

**Mapping template (Integration Request · application/json)**

```text
{
  "titulo" : $input.json("$.livro.titulo"),
  "autor": $input.json("$.livro.autor"),
  "edicao": $input.json("$.livro.edicao")
}
```

<aside class="negative">

**Cuidado.** Não pode haver espaço em branco entre `json` e o parênteses que vem a seguir.

</aside>

A seguir, ajuste a função Lambda para que ela acesse as propriedades `titulo` e `edicao` diretamente do objeto `event`. Clique em **Deploy** para implantar a nova versão da sua função Lambda.

**index.mjs (função Lambda)**

```javascript
export const handler = (event, context, callback) => {
  console.log(event);
  callback(null, "Titulo: " + event.titulo + ", Edição: " + event.edicao);
};
```

Vá até o API Gateway e execute um novo teste.

![Tela Method Test com o corpo contendo a chave livro e o Response Body destacado com Titulo: Concrete Mathematics, Edição: 2](img/p029-1.webp)

*Com o template, a Lambda lê titulo e edicao direto de event.*

## A linguagem de templates e o quadro Integration Response
Duration: 10:00

### Detalhes sobre a linguagem

A linguagem que estamos utilizando para manipulação da requisição envolve diversos detalhes. Os principais são explicados a seguir.

* **`$input`**: A variável `$input` representa a carga útil da requisição e os parâmetros a serem processados por um mapping template. Ela oferece quatro funções.
    * **`json`**: conversão de JSON para String
    * **`params`**: Devolve um mapa com todos os parâmetros da requisição (`exemplo.com/{id}`)
    * **`params(x)`**: Devolve o valor associado à chave `x`, seja um parâmetro de path, de query ou header
    * **`path(x)`**: Conversão de String para JSON
* **`$`**: representa somente o corpo da requisição. Podemos utilizar o operador ponto e o operador `[ ]` para navegar na estrutura do objeto recebido.

### Template para o quadro Integration Response

Assim como podemos aplicar transformações aos dados da requisição antes de entregá-los ao Back End, também podemos aplicar transformações àquilo que ele devolve ao API Gateway antes de entregá-los ao cliente. Isso pode ser feito no quadro **Integration Response**.

No API Gateway, mantenha selecionado o seu método **POST** e escolha o quadro **Integration Response**.

![Tela Method Execution do POST com o quadro Integration Response destacado, agora habilitado](img/p030-1.webp)

*Abrindo o quadro Integration Response.*

Clique nas pequenas setas para expandir e encontrar o menu **Mapping Templates**. Clique em **Add mapping template** e adicione o MIME Type `application/json`. Clique no pequeno botão de confirmação à frente.

![Integration Response com a linha da resposta 200 expandida pela seta, a seção Mapping Templates aberta e o Content-Type application/json sendo confirmado](img/p031-1.webp)

*Adicionando um mapping template de resposta para application/json.*

Um campo textual deve ser liberado. Perceba que o campo textual, logo abaixo do menu **generate template**, está **em branco**. Quando isso ocorre, a resposta que o API Gateway recebe do Back End (a função Lambda, neste caso) simplesmente é **repassada diretamente para o cliente**.

Preencha o campo com o seguinte conteúdo. Aqui o símbolo `$` significa o conjunto de dados que o Back End devolveu para o API Gateway. Neste caso, ele conterá somente uma string: aquela que a função Lambda monta e devolve.

**Mapping template (Integration Response · application/json)**

```text
{
  "seu-livro": $input.json("$")
}
```

Clique em **Save** e execute novos testes no API Gateway.

![Tela Method Test com o Response Body destacado exibindo o objeto JSON com a chave seu-livro e o valor Titulo: Concrete Mathematics, Edição: 2](img/p032-2.webp)

*A resposta da Lambda agora chega ao cliente dentro da chave seu-livro.*

## Modelos e validação
Duration: 15:00

A aplicação que estamos implementando fará operações envolvendo livros, os quais têm as propriedades: **título**, **autor** e **edição**. Podemos utilizar o API Gateway para validar requisições: definimos um modelo que será utilizado na validação. Somente requisições que estiverem de acordo com aquele modelo serão repassadas para a próxima fase.

Comece clicando em **Models**, no menu à esquerda. A seguir, clique em **Create**.

![Menu Models do API Gateway selecionado, com a lista de modelos Empty e Error e o botão Create destacado](img/p033-1.webp)

*Models > Create.*

Especifique os seguintes valores

* **Model name**: `LivroModel`
* **Content Type**: `application/json`
* **Model description**: `Modelo para validar livros`

O valor para **Model Schema** é dado a seguir. Clique em **Create model** quando terminar.

**Model schema (LivroModel)**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema#",
  "title": "LivroModel",
  "type": "object",
  "properties": {
    "titulo": {"type": "string"},
    "autor": {"type": "string"},
    "edicao": {"type": "string"}
  },
  "required": ["titulo", "autor", "edicao"]
}
```

![Tela New Model com Model name LivroModel, Content type application/json, Model description Modelo para validar livros, o Model schema preenchido e o botão Create model destacado](img/p035-1.webp)

*Criando o modelo LivroModel.*

<aside class="positive">

**Nota.** A chave `$schema` no modelo serve para indicarmos qual versão da linguagem estamos utilizando. Conforme a especificação evolui, partes podem deixar de funcionar ou passar a funcionar de forma diferente. Além de que, novas funcionalidades podem ser adicionadas. Também é muito importante para o controle de versão.

</aside>

> **JSON Schema**
>
> JSON Schema é uma linguagem declarativa que nos permite anotar e validar objetos JSON. Se desejar saber mais, visite o link a seguir: [https://json-schema.org/](https://json-schema.org/)

No API Gateway, selecione seu método **POST** e escolha o quadro **Method Request**.

![Tela Method Execution do POST com o quadro Method Request destacado](img/p035-2.webp)

*Abrindo o quadro Method Request.*

Expanda **Request Body** e clique em **Add model**.

![Tela Method Request com a seção Request Body expandida e o link Add model destacado](img/p036-1.webp)

*Request Body > Add model.*

Especifique o seguinte e clique no pequeno botão à frente para confirmar.

* **Content type**: `application/json`
* **Model name**: `LivroModel`

![Linha do Request Body com Content type application/json e Model name LivroModel preenchidos, prontos para confirmar](img/p036-2.webp)

*Associando o LivroModel ao corpo da requisição.*

A seguir, clique na caneta à frente de **Request Validator** (ainda na página atual).

![Tela Method Request com o ícone de caneta à frente de Request Validator NONE destacado e o LivroModel já listado em Request Body](img/p037-1.webp)

*Editando o Request Validator.*

Escolha **Validate body**, clicando no botão à frente a seguir, para confirmar.

![Campo Request Validator com a opção Validate body selecionada e o botão de confirmação destacado](img/p037-2.webp)

*Request Validator: Validate body.*

Faça um teste novamente, usando o código a seguir no corpo da requisição.

**Request Body (teste no API Gateway)**

```json
{
  "titulo": "Concrete Mathematics",
  "autor": "Donaldo Knuth",
  "edicao": "2"
}
```

Veja o resultado.

![Tela Method Test com o novo corpo sem a chave livro e o Response Body destacado com seu-livro igual a Titulo: , Edição: vazios](img/p038-1.webp)

*A validação passa, mas os dados do livro não chegam à Lambda.*

Observe que os dados do livro ainda não aparecem na resposta. Isso ocorre pois a fase **Integration Request** está incondizente com o modelo de validação. Para ajustar isso, escolha o quadro **Integration Request**.

Expanda **Mapping Templates** e clique em `application/json`. Ajuste o conteúdo como a seguir. Clique em **Save**.

**Mapping template (Integration Request · application/json)**

```text
{
  "titulo" : $input.json("$.titulo"),
  "autor" : $input.json("$.autor"),
  "edicao": $input.json("$.edicao")
}
```

Faça novo teste com o seguinte conteúdo.

**Request Body (teste no API Gateway)**

```json
{
  "titulo": "Concrete Mathematics",
  "autor": "Donaldo Knuth",
  "edicao": "2"
}
```

Veja o resultado.

![Tela Method Test com o Response Body destacado exibindo seu-livro igual a Titulo: Concrete Mathematics, Edição: 2](img/p041-1.webp)

*Com o template ajustado ao modelo, os dados voltam a aparecer.*

Faça uma nova requisição, utilizando o objeto a seguir. Observe que ele não possui todos os campos obrigatórios.

**Request Body (teste no API Gateway)**

```json
{
  "titulo": "Concrete Mathematics",
  "autor": "Donaldo Knuth"
}
```

Veja o resultado.

![Tela Method Test com o corpo sem a chave edicao e a resposta Status 400 com o Response Body destacado exibindo message Invalid request body](img/p042-1.webp)

*Sem o campo obrigatório edicao, o API Gateway recusa a requisição com 400.*

## Mapeamento em função de um modelo de validação
Duration: 8:00

O mapeamento pode ser feito em função de um modelo de validação pré-definido.

Novamente no quadro **Integration Request**, expanda **Mapping Templates** e clique em `application/json`. Desta vez, escolha **LivroModel** no menu **Generate template**. Perceba que um mapeamento com dados "dummy" já está pronto.

![Seção Mapping Templates com application/json selecionado, Generate template igual a LivroModel e o template gerado com #set($inputRoot = $input.path('$')) e titulo, autor e edicao iguais a foo](img/p043-1.webp)

*Template gerado a partir do LivroModel, com dados "dummy".*

Troque os dados "dummy" da seguinte forma e clique em **Save**.

**Mapping template (Integration Request · application/json)**

```text
#set($inputRoot = $input.path('$'))
{
  "titulo" : "$inputRoot.titulo",
  "autor" : "$inputRoot.autor",
  "edicao" : "$inputRoot.edicao"
}
```

Execute um novo teste e verifique o resultado.

![Tela Method Test com o corpo contendo titulo, autor e edicao e o Response Body destacado com seu-livro igual a Titulo: Concrete Mathematics, Edição: 2](img/p044-2.webp)

*Resultado com o template baseado no modelo.*

Podemos fazer o mesmo para a fase **Integration Response**. Abra o quadro **Integration Response**. Clique nas setas para encontrar **Mapping Templates**. Clique sobre `application/json` e, no menu **Generate template**, escolha **LivroModel**.

![Integration Response com a resposta 200 expandida, Mapping Templates com application/json selecionado e Generate template igual a LivroModel, exibindo o template gerado com valores foo](img/p045-2.webp)

*Gerando o template de resposta a partir do LivroModel.*

Observe que o modelo gerado também contém dados "dummy". Digamos que desejamos simplesmente entregar ao cliente aquilo que a função Lambda produziu. Ajuste o conteúdo como a seguir e clique em **Save**.

**Mapping template (Integration Response · application/json)**

```text
#set($inputRoot = $input.path('$'))
{
  "seu-livro" : "$inputRoot"
}
```

Faça novo teste e veja o resultado.

![Tela Method Test com o Response Body destacado exibindo seu-livro igual a Titulo: Concrete Mathematics, Edição: 2](img/p047-1.webp)

*Resposta final entregue ao cliente pelo template de Integration Response.*

## Exercícios
Duration: 30:00

Pratique o que você aprendeu com a lista de exercícios a seguir.

1. Crie o recurso `/exercicio3/veiculos/{1}`
2. Crie um método **GET** para ele.
3. No quadro **Integration Request**, monte o seguinte objeto JSON e o repasse ao Back End.

   ```json
   {
     "veiculo": {
       "id": 1
     }
   }
   ```

4. Crie uma função Lambda para desempenhar o papel de Back End. Ela deve
    * definir uma coleção contendo três veículos, cada qual com `id` e `modelo`.
    * devolver o veículo de `id` igual àquele recebido como parâmetro, se existir. Caso contrário, devolver um objeto vazio.

   Observe que a coleção está armazenada em meio volátil. A cada requisição, ela é criada novamente.
5. Implante a aplicação e faça um teste utilizando a Thunder Client ou o Postman.

## Encerramento
Duration: 3:00

Parabéns! Você reorganizou a API de livros no padrão REST, criou e publicou o método POST, entendeu a diferença entre usar a **Lambda Proxy Integration** e deixar o API Gateway transformar requisições e respostas com **mapping templates**, inspecionou o objeto `event` pelo **CloudWatch** e passou a **validar** as requisições com um modelo em **JSON Schema**.

O próximo codelab da série é o **AWS Serverless 04**.

### Referências

1. Amazon Web Services (AWS) - Cloud Computing Services. 2023. Disponível em <[https://aws.amazon.com/](https://aws.amazon.com/)>. Acesso em agosto de 2023.
2. PiCloud Launches Serverless Computing Platform To The Public | TechCrunch. 2023. Disponível em <[https://techcrunch.com/2010/07/19/picloud-launches-serverless-computing-platform-to-the-public/](https://techcrunch.com/2010/07/19/picloud-launches-serverless-computing-platform-to-the-public/)>. Acesso em agosto de 2023.
3. Serverless Architectures. 2023. Disponível em <[https://martinfowler.com/articles/serverless.html](https://martinfowler.com/articles/serverless.html)>. Acesso em agosto de 2023.
4. Who coined the term 'serverless'?. 2023. Disponível em <[https://www.quora.com/Who-coined-the-term-serverless](https://www.quora.com/Who-coined-the-term-serverless)>. Acesso em agosto de 2023.
