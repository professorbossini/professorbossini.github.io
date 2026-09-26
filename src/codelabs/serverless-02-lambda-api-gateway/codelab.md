summary: Crie sua primeira função AWS Lambda em Node.js, teste-a com eventos Mock, entenda as fases de requisição e resposta do API Gateway e crie a API loja-livros com o recurso /livros, CORS e um método POST integrado à função Lambda.
id: serverless-02-lambda-api-gateway
categories: AWS,Serverless,Node.js
tags: aws,serverless,lambda,api gateway,node.js,cors,api key,swagger,post
status: Published
authors: Rodrigo Bossini
last updated: 2023-08-30
pdf: topicos_avancados_em_backend/02_apostila_aws_serverless.pdf
exercicios: topicos_avancados_em_backend/02_exercicio_aws_serverless.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# AWS Serverless 02: funções Lambda e a API loja-livros

## Visão geral
Duration: 3:00

Prosseguimos com a implementação da aplicação retratada a seguir.

![Arquitetura da aplicação: front-end no S3, autenticação com Cognito, endpoints POST, GET e DELETE /livro no API Gateway, regras de negócio no Lambda e dados no DynamoDB](img/p001-2.webp)

*A aplicação que estamos construindo ao longo da série.*

### O que você vai aprender

* Como criar, implantar e testar uma função **AWS Lambda** em Node.js
* O que são os objetos `event`, `context` e a função `callback` do handler
* Como criar chaves de API (API Keys)
* As quatro fases do fluxo de um método no API Gateway: Method Request, Integration Request, Integration Response e Method Response
* As opções de criação de uma API (New API, Clone, Import from Swagger, Example API)
* Como criar o recurso `/livros` com CORS habilitado e um método `POST` integrado a uma função Lambda

### O que você vai precisar

* Acesso ao **AWS Academy Learner Lab**
* Ter concluído o codelab anterior da série (AWS Serverless 01)
* Para os exercícios: o VS Code com a extensão **Thunder Client**

## Criando uma função Lambda
Duration: 10:00

O próximo passo é criar uma função **Lambda** que nos servirá de Back End. Sua existência nos permitirá implementar nossas regras de negócio.

Visite seu Learner Lab, inicie o Lab e clique em **AWS** quando a bolinha ficar verde.

![Página do Learner Lab com os botões Start Lab e AWS destacados](img/p001-1.webp)

*Iniciando o Learner Lab.*

No console AWS, busque pelo serviço **Lambda** e clique em seu ícone.

![Barra de pesquisa do console com o texto lambda e o serviço Lambda destacado](img/p002-1.webp)

*Buscando o serviço Lambda.*

Clique em **Create Function**.

![Página do serviço Lambda com o botão Create function destacado](img/p002-2.webp)

*Create Function.*

Preencha os campos como a seguir e clique em **Create Function**.

* **Author from scratch**
* **Function name**: `lambda-pdfs`
* **Runtime**: `Node.js 18.x`
* **Architecture**: `x86_64`
* **Change default execution role** (expanda): **Use an existing role**
* **Existing role**: `LabRole`

![Formulário de criação da função com Author from scratch, nome lambda-pdfs, runtime Node.js 18.x, arquitetura x86_64 e a role existente LabRole destacados](img/p003-1.webp)

*Configurando a nova função Lambda.*

<aside class="positive">

**LabRole** é uma Role previamente criada no ambiente Learner Lab. As permissões associadas a ela são suficientes para aquilo que pretendemos implementar.

</aside>

Na tela resultante, ajuste o código inicial como a seguir. `callback` é o nome de uma função que é colocada em execução automaticamente quando a função lambda é chamada. Nossa implementação será feita nesta função. Aprenderemos mais sobre os outros objetos em breve.

**index.mjs**

```javascript
export const handler = (event, context, callback) => {
  callback(null, {mensagem: "Executando uma função Lambda com sucesso…"});
};
```

Clique em **Deploy**.

![Editor de código da função Lambda com o arquivo index.mjs e o botão Deploy destacado](img/p003-2.webp)

*Implantando a função.*

## Testando a função Lambda
Duration: 8:00

Podemos testar a função Lambda criando um evento de teste "Mock". Para tal, clique em **Test**.

![Editor da função com a mensagem de sucesso na atualização e o botão Test destacado](img/p004-1.webp)

*Clique em Test.*

Escolha a opção **Create new Event**. Dê um nome para o seu teste. Mantenha as demais opções com seu valor padrão e clique em **Save**.

![Janela Configure test event com Create new event, o nome do evento, o compartilhamento Private e o Event JSON padrão com key1, key2 e key3 destacados, e o botão Save](img/p005-1.webp)

*Criando um evento de teste.*

Clique em **Test** para obter o resultado a seguir.

![Aba Execution results mostrando a resposta com a mensagem Executando uma função Lambda com sucesso](img/p005-2.webp)

*Resultado da execução da função.*

Para visualizar o objeto de teste especificado (o JSON com três pares chave/valor `key: value`), volte ao arquivo `index.mjs` e ajuste o código como a seguir. Observe que a nossa função agora devolve o objeto `event`.

**index.mjs**

```javascript
export const handler = (event, context, callback) => {
  callback(null, event);
};
```

Clique em **Deploy** a seguir. Depois, clique em **Test**. Veja o resultado esperado.

![Aba Execution results mostrando a resposta com o objeto de teste contendo key1, key2 e key3](img/p006-2.webp)

*A função agora devolve o objeto event recebido.*

## Mais funcionalidades do API Gateway
Duration: 10:00

Como vimos, o serviço AWS API Gateway oferece diferentes funcionalidades. Nesta seção estudaremos as principais. Depois disso, criaremos a API da solução computacional que estamos implementando. Certifique-se de que você está na página inicial da sua API. Para tal, você pode clicar no nome dela.

![Página da API hello-aws-api-gateway com o nome da API destacado no caminho de navegação e o menu de funcionalidades à esquerda](img/p007-1.webp)

*A página inicial da API e suas funcionalidades.*

### API Keys

Essa feature nos permite criar chaves de acesso para nossa API. Tratam-se de chaves que poderíamos entregar para nossos clientes e restringir o acesso aos serviços somente àqueles que enviem uma chave válida. Além disso, elas podem ser usadas para garantir que um usuário não ultrapasse os limites de uso impostos pelo plano que tiver escolhido. À esquerda, clique **API Keys** e então clique **Actions >> Create API Key**. Dê um nome qualquer para a chave, talvez `teste`, e escolha **Auto Generate**. Na tela a seguir, clique **Show** para ver a chave gerada.

### Custom Domain Name

Como o nome sugere, com esta opção podemos escolher um domínio personalizado para nossa API, como `api.meudominio.com`.

### Client Certificates

Aqui podemos criar um certificado que pode ser enviado para outros serviços a fim de garantir a autenticidade das requisições. Ou seja, para garantir que elas estão sendo, de fato, originadas a partir do API Gateway.

### Authorizers

Aqui podemos utilizar um serviço de autenticação (Cognito ou mesmo uma função Lambda) para restringir o acesso à API.

### Models

Aqui podemos definir a estrutura esperada dos dados recebidos na requisição.

### Documentation

Permite que especifiquemos documentações para os endpoints de nossa API.

### Dashboard

Informações sobre uso.

### Manipulação de requisição e resposta

Como vimos, ao especificar um método para um endpoint, temos quatro quadros. Veja a finalidade de cada um a seguir. Para visualizar os quadros, certifique-se de selecionar o método (GET, neste exemplo que criamos) no menu **Resources**.

* **Method Request**: essa fase do fluxo pode filtrar requisições e bloquear aquelas que não estiverem de acordo com critérios predefinidos. Por exemplo, aqui especificamos se uma chave de API é requerida, se parâmetros na URL são requeridos (e se sim, quais são) entre outras coisas.
* **Integration Request**: caso a requisição passe pela fase Method Request, ela é entregue para a fase Integration Request. Nesta fase, podemos realizar transformações em geral envolvendo os dados recebidos na requisição para entregar para o componente responsável por executar nossas regras de negócio. Por exemplo, podemos extrair os parâmetros de uma requisição GET e montar um objeto JSON para que ele possa ser entregue para uma função Lambda.
* **Integration Response**: esta fase entra em cena uma vez que a requisição tenha sido processada. Aqui podemos, por exemplo, mapear códigos de status vindos do Back End para o código que desejamos entregar para o cliente. Por exemplo, verificar se o código de resposta do back end está de acordo com algum padrão (2xx, por exemplo) e mapeá-lo para um código que faça sentido para a nossa API. Também podemos adicionar pares chave/valor ao cabeçalho da resposta. Também é possível aplicar transformações aos dados recebidos do back end antes de entregá-los ao cliente.
* **Method Response**: esta fase define o que é público para o cliente. Por exemplo, quais headers, quais códigos, quais MIME types o endpoint pode devolver. É importante entender que nesta fase são feitas as definições das características da resposta. Somente seu **formato**. O preenchimento com os dados de fato ocorre na fase Integration Response.

## Criando a API loja-livros
Duration: 10:00

<aside class="positive">

Agora vamos criar uma nova API. Caso queira apagar a API de teste que criamos, visite a página do API Gateway, selecione a API e clique em **Actions >> Delete**. Para encontrar a página inicial, você pode sempre buscar pelo nome do serviço - API Gateway - no Console AWS.

</aside>

![Lista de APIs com hello-aws-api-gateway selecionada e o menu Actions aberto na opção Delete](img/p009-1.webp)

*Apagando a API de teste.*

Na página principal do API Gateway, clique em **Create API**.

![Lista de APIs com o botão Create API destacado](img/p009-2.webp)

*Create API.*

Clique na opção **Build** de **REST API** (não private).

![Lista de tipos de API com o quadro REST API e seu botão Build destacados](img/p010-1.webp)

*Escolhendo REST API.*

A tela seguinte mostra quatro opções.

* **New API**: já utilizamos uma vez e vamos utilizar novamente. Usada para criar uma API "do zero".
* **Clone from existing API**: permite fazer uma cópia de uma API existente.
* **Import from Swagger**: permite importar um arquivo textual que descreve uma API criada pelo Swagger. Veja um exemplo a seguir. Basta clicar no pequeno link com extensão json na página [https://petstore.swagger.io/](https://petstore.swagger.io/).

![Página do Swagger Petstore com o link para o arquivo swagger.json destacado](img/p011-1.webp)

*O exemplo Swagger Petstore.*

![Arquivo swagger.json do Petstore exibido formatado no navegador](img/p011-2.webp)

*A descrição da API no formato do Swagger.*

Lembre-se que esse é apenas um exemplo usando Swagger, ferramenta que não estamos utilizando neste material.

<aside class="positive">

É possível que o seu objeto JSON não seja exibido formatado como na figura. Para que essa formatação seja realizada, você pode instalar uma extensão no Google Chrome. Comece visitando a Chrome Web Store: [https://chrome.google.com/webstore/](https://chrome.google.com/webstore/). Busque por **JSON** e instale a extensão **JSON Viewer**.

</aside>

![Chrome Web Store com a busca json e a extensão JSON Viewer destacada](img/p012-1.webp)

*A extensão JSON Viewer na Chrome Web Store.*

* **Example API**: mostra uma API de exemplo em que você pode se basear.

Escolha **New API**. Preencha os campos como a seguir.

* **API name**: `loja-livros`
* **Description**: `Loja de livros`
* **Endpoint Type**: `Regional` (otimizado para funcionar dentro da região escolhida. **Edge Optimized** faria com que ele fosse distribuído em regiões diferentes usando o CloudFront, visando reduzir a latência).

![Formulário Create new API com New API selecionado e os campos de nome, descrição e tipo de endpoint Regional preenchidos](img/p013-1.webp)

*Criando a API loja-livros.*

## Recurso /livros, CORS e OPTIONS
Duration: 8:00

O próximo passo é adicionar os recursos da API. Clique **Actions >> Create Resource**.

![Menu Actions aberto sobre a raiz com a opção Create Resource destacada](img/p013-2.webp)

*Actions >> Create Resource.*

Preencha os campos como a seguir e clique em **Create Resource**.

* **Resource Name**: `livros`
* **Resource path**: `livros` (name e path não precisam ser iguais mas pode simplificar)
* **Proxy Resource**: não marcar
* **Enable API Gateway CORS**: marcar

![Formulário New Child Resource com nome e caminho livros e a opção Enable API Gateway CORS marcada](img/p014-1.webp)

*Criando o recurso /livros com CORS habilitado.*

A configuração do mecanismo CORS é feita no cabeçalho da resposta. Podemos verificar mantendo o método **OPTIONS** selecionado e clicando em **Integration Response**.

![Método OPTIONS de /livros selecionado com o quadro Integration Response destacado](img/p014-2.webp)

*Abrindo o Integration Response do método OPTIONS.*

Clique na pequena seta para expandir e, então, clique em **Header Mappings**. Veja, ali, os pares chave/valor de configuração do mecanismo CORS.

![Header Mappings expandido mostrando Access-Control-Allow-Headers, Access-Control-Allow-Methods e Access-Control-Allow-Origin](img/p015-1.webp)

*Cabeçalhos de configuração do CORS.*

Apenas observe essas configurações. Não há nada a fazer nesta área, por enquanto.

## Método POST com uma função Lambda
Duration: 8:00

**POST** é o método do protocolo HTTP apropriado para realizar operações de criação de conteúdo. Façamos a sua criação, associada ao recurso `livros`, já criado. Certifique-se de que o endpoint `/livros` está selecionado (e não a raiz `/`) e clique **Actions >> Create Method**.

![Recurso /livros selecionado e menu Actions aberto com a opção Create Method destacada](img/p015-2.webp)

*Actions >> Create Method em /livros.*

Escolha o método **POST** no pequeno menu que aparecerá e clique no botão logo à frente dele para confirmar.

![Menu de métodos sob /livros com POST selecionado e o botão de confirmação destacado](img/p016-1.webp)

*Escolhendo POST.*

Mantenha o método POST selecionado para podermos escolher o **Integration Type**. Ou seja, mediante uma requisição POST neste Endpoint, precisamos especificar o que desejamos fazer. Neste caso, desejamos colocar a função lambda em funcionamento. Faça as escolhas como a seguir.

* **Integration type**: `Lambda Function`
* **Lambda Region**: `us-east-1`
* **Lambda Function**: `lambda-pdfs`

Observe que você precisa começar a digitar o nome de sua função lambda para que ela apareça e possa ser selecionada. Clique **Save**.

![Tela /livros - POST - Setup com Integration type Lambda Function, região us-east-1 e a função lambda-pdfs destacadas](img/p016-2.webp)

*Integrando o POST à função Lambda.*

A seguir, mantendo POST selecionado, clique em **Test**.

![Método POST selecionado com o link Test destacado ao lado do quadro Method Request](img/p017-1.webp)

*Abrindo o teste do método POST.*

Clique novamente **Test**, agora na parte inferior da tela e observe o resultado.

![Tela de teste do POST com o corpo da resposta {} destacado e uma anotação indicando que é o objeto devolvido pela função lambda](img/p017-2.webp)

*Resultado do teste: o objeto event vazio.*

A função Lambda está devolvendo o objeto `event`. Ele representa aquilo que enviamos no corpo da requisição quando ela foi realizada. Neste momento, não enviamos coisa alguma. Por isso, o objeto está vazio, sem nenhum par chave/valor.

## Exercícios
Duration: 20:00

1. Faça uma requisição utilizando a Thunder Client. No corpo da requisição, inclua uma coleção de livros contendo dois livros. Cada livro deve conter: `titulo`, `editora` e `preco`.
2. Faça com que a função lambda devolva o preço médio dos livros.

<aside class="positive">

**Dica.** Descubra informações a respeito do objeto `event`. Pode ser interessante fazer com que a função lambda o devolva à Thunder Client.

</aside>

3. Adapte a solução para processar um número arbitrário de livros.

## Encerramento
Duration: 2:00

Parabéns! Você criou e testou sua primeira função Lambda e a integrou a um método POST da API `loja-livros` no API Gateway. No próximo codelab da série (AWS Serverless 03), seguimos com a implementação.

### Referências

1. Amazon Web Services (AWS) - Cloud Computing Services. 2023. Disponível em [https://aws.amazon.com/](https://aws.amazon.com/). Acesso em agosto de 2023.
2. PiCloud Launches Serverless Computing Platform To The Public | TechCrunch. 2023. Disponível em [https://techcrunch.com/2010/07/19/picloud-launches-serverless-computing-platform-to-the-public/](https://techcrunch.com/2010/07/19/picloud-launches-serverless-computing-platform-to-the-public/). Acesso em agosto de 2023.
3. Serverless Architectures. 2023. Disponível em [https://martinfowler.com/articles/serverless.html](https://martinfowler.com/articles/serverless.html). Acesso em agosto de 2023.
4. Who coined the term 'serverless'?. 2023. Disponível em [https://www.quora.com/Who-coined-the-term-serverless](https://www.quora.com/Who-coined-the-term-serverless). Acesso em agosto de 2023.
