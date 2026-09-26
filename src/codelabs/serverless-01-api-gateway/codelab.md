summary: Entenda o que é computação serverless (FaaS, BaaS e PaaS) e crie sua primeira API REST com o Amazon API Gateway no AWS Academy Learner Lab, usando uma integração Mock, implantação em stage e testes.
id: serverless-01-api-gateway
categories: AWS,Serverless
tags: aws,serverless,api gateway,rest,faas,baas,mock,learner lab,api key,usage plan
status: Published
authors: Rodrigo Bossini
last updated: 2023-08-30
pdf: topicos_avancados_em_backend/01_apostila_aws_serverless.pdf
exercicios: topicos_avancados_em_backend/01_exercicio_aws_serverless.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# AWS Serverless 01: introdução e Amazon API Gateway

## Visão geral
Duration: 5:00

Um dos tópicos de Back End e computação em nuvem mais comuns atualmente leva o nome de computação **"serverless"**. Os principais provedores de computação em nuvem (Amazon, Google, Microsoft etc.) disponibilizam serviços que se encaixam na categoria serverless. Neste material, estudamos conceitos teóricos sobre este tópico e passamos a conhecer e a utilizar alguns dos serviços serverless disponibilizados pela Amazon.

Observe a aplicação a ser desenvolvida e a descrição dos serviços utilizados.

![Arquitetura da aplicação: front-end no S3 com campos Título, Autor e Edição, autenticação com Cognito, endpoints POST, GET e DELETE /livro no API Gateway, regras de negócio no Lambda e dados no DynamoDB](img/p001-1.webp)

*Arquitetura da aplicação que será desenvolvida ao longo da série.*

<aside class="positive">

**Nota.** Neste material, utilizamos o ambiente **Amazon Academy Learner Lab**. As "capturas de tela" exibidas são referentes a este ambiente. Também é possível utilizar o ambiente oficial Amazon, que é praticamente idêntico.

</aside>

* **API Gateway**: para implementar a API com seus endpoints.
* **Lambda**: para implementar as funcionalidades propriamente ditas, as regras de negócio do app.
* **DynamoDB**: para armazenamento em meio persistente.
* **Cognito**: serviço de autenticação.
* **S3**: utilizaremos para hospedar uma aplicação cliente simples.

> **Endpoint**
>
> Um endpoint é caracterizado por uma URL e uma funcionalidade ou recurso a que ela dá acesso. Veja um exemplo de endpoint: `www.exemplo.com/calcular/2/+/2`. Temos uma URL que dá acesso a uma funcionalidade matemática. Além da URL e da funcionalidade, também podemos usar um método do protocolo HTTP (GET (obtenção de conteúdo), POST (armazenamento de novo conteúdo), PUT (atualização de conteúdo existente), DELETE (remoção de conteúdo) etc.) com o intuito de especificar o que se deseja realizar com um determinado recurso.

Veja:

* `GET www.exemplo.com.br/veiculos` (permite obter uma coleção de veículos)
* `GET www.exemplo.com.br/veiculos/1` (permite obter dados de um veículo específico, de id igual a 1)
* `DELETE www.exemplo.com.br/veiculos/1` (permite remover um veículo de id igual a 1)

> **API**
>
> Uma API é uma coleção de endpoints.

Veja um exemplo de API:

```text
GET www.exemplo.com.br/veiculos
GET www.exemplo.com.br/veiculos/1
DELETE www.exemplo.com.br/veiculos/1
```

Neste material, trataremos de APIs **"REST"**. APIs REST são baseadas no padrão arquitetural que leva esse nome. Quando construímos uma API REST, aplicamos boas práticas de programação a fim de obter uma API fácil de se manter, de utilizar e de se reutilizar. Se desejar saber mais sobre o padrão arquitetural REST, veja a tese de doutorado de Roy Fielding, documento em que ele define o padrão arquitetural: [https://www.ics.uci.edu/~fielding/pubs/dissertation/fielding_dissertation.pdf](https://www.ics.uci.edu/~fielding/pubs/dissertation/fielding_dissertation.pdf).

### O que você vai aprender

* Definições de serverless e as diferenças entre FaaS, BaaS e PaaS
* O que o Amazon API Gateway oferece (CORS, cache, controle de acesso, stages etc.)
* Como criar uma API REST, um recurso e um método no API Gateway
* Como responder requisições com uma integração **Mock** e um mapping template
* Como implantar a API em um stage e testá-la pelo navegador e pelo próprio API Gateway
* As principais features do API Gateway: API Keys, Usage Plans, Authorizers, Models e outras

### O que você vai precisar

* Acesso ao **AWS Academy Learner Lab** (ou a uma conta AWS)
* Um navegador
* Para os exercícios: o VS Code com a extensão **Thunder Client**

## O que é serverless
Duration: 8:00

### Algumas definições

Há diferentes definições para o termo serverless. A **Amazon**, por exemplo, o define da seguinte forma:

"Arquitetura nativa da computação em nuvem que permite delegar atividades operacionais para a AWS, com potencial de aumentar sua agilidade e inovação. O modelo serverless permite a implantação e execução de aplicações sem preocupação com servidores. Tarefas de gerenciamento de infraestrutura como provisionamento de máquinas (mesmo que virtuais), manutenção de sistemas operacionais e aspectos de escalabilidade são eliminadas."

A **Google**, por sua vez, define serverless da seguinte forma:

"A plataforma serverless do Google viabiliza a escrita de código e sua implantação sem que haja a necessidade de se preocupar com a infraestrutura subjacente."

* O termo serverless parece [2][4] ter aparecido em torno do ano de 2010 e se tornou mais comum em 2014 [3], quando a Amazon lançou o AWS Lambda.
* Há serviços, tais quais o AWS Lambda e o Google Cloud Functions, que permitem que o desenvolvedor escreva o seu código e o implante em contêineres sem estado e efêmeros (não duráveis, temporários, que podem "sair do ar") que podem ficar disponíveis somente durante uma requisição e que entram em execução mediante eventos. A expressão serverless foi muito utilizada para se referir a tais serviços. Contudo, atualmente, dada a vasta quantidade de serviços que se encaixam na categoria serverless, eles são muitas vezes conhecidos como **FaaS** (*Function as a Service*).
* Serviços FaaS são diferentes de modelos em que tarefas como login em uma rede social, armazenamento de dados, envios de notificação etc. são utilizadas por meio de SDKs. Neste tipo de serviço, a manipulação de infra também é delegada. Porém, o desenvolvedor não escreve o código específico da tarefa que deseja e, em geral, os servidores estão sempre disponíveis. Esse tipo de serviço, que também se encaixa na categoria serverless, é conhecido como **BaaS** (*Backend as a Service*).
* Ambos são diferentes de **PaaS** (*Platform as a Service*). Neste modelo, uma plataforma (Java, Node etc.) é alocada envolvendo possivelmente uma base de dados. Embora tarefas de infra também sejam delegadas, o servidor não é efêmero, uma das diferenças mais importantes em relação a FaaS. Aqui, o desenvolvedor escreve seu código, diferente do que ocorre com BaaS.

Nos dias atuais, há muitos serviços categorizados como serverless. Veja os serviços que a Amazon categoriza como serverless: [https://aws.amazon.com/serverless/](https://aws.amazon.com/serverless/).

A Google também possui alguns: [https://cloud.google.com/serverless](https://cloud.google.com/serverless).

## Amazon API Gateway
Duration: 6:00

### Nossa primeira API "serverless"

**API Gateway** é um serviço gerenciado da Amazon utilizado para a criação de APIs. Em geral, o objetivo é poder focar somente na implementação das funcionalidades de interesse da aplicação, delegando o restante para o serviço, como:

* Manipulação de múltiplas requisições simultâneas
* CORS – *Cross Origin Resource Sharing*
* Autorização e controle de acesso (usando API Keys, por exemplo)
* Monitoramento de uso
* Elasticidade (escalabilidade horizontal de acordo com a demanda)
* Gerenciamento de versões de API
* Publicação de APIs em diferentes stages (dev, teste, produção etc.)

> **CORS**
>
> CORS trata-se de um mecanismo utilizado pelos servidores HTTP a fim de bloquear ou limitar o compartilhamento de conteúdo entre "origens" diferentes. Uma "origem" é caracterizada pela tripla `protocolo://host:porta`.

Veja alguns exemplos.

| Origem 1 | Origem 2 | Origens iguais ou diferentes? |
| --- | --- | --- |
| `http://abc.com` | `http://abc.com/veiculos` | Iguais |
| `http://abc.com` | `https://abc.com` | Diferentes |
| `http://abc.com:3000` | `http://abc.com:3001` | Diferentes |
| `http://abc.com:80` | `http://abc.com` | Iguais |

O API Gateway permite a criação de dois tipos de APIs: **REST** e **WebSockets** (comunicação full-duplex (bidirecional simultânea)). Veja a ideia geral do Amazon API Gateway.

![Diagrama do Amazon API Gateway: clientes (aplicações web e mobile, dispositivos IoT, aplicações privadas) chamam o API Gateway, que tem cache e é monitorado pelo CloudWatch, e encaminha para Lambda, EC2, outros serviços AWS, endpoints públicos e aplicações em VPC ou on-premises](img/p006-1.webp)

*A ideia geral do Amazon API Gateway.*

<aside class="positive">

**API Gateway Cache.** Como o nome sugere, serve para fazer uso de uma espécie de memória cache. A ideia é que o endpoint atenda uma primeira requisição e que, a seguir, o valor calculado fique armazenado em memória de rápido acesso. A partir das próximas requisições, ele pode ser obtido novamente sem ter de ser recalculado. Tal memória cache pode ter um tempo de expiração e, claro, nem toda requisição dá origem a um "Cache Hit", que indica que o resultado existente na memória é, realmente, aquele solicitado na requisição.

</aside>

<aside class="positive">

**Amazon CloudWatch.** Permite a coleta de logs, monitoramento de serviços, construção de dashboards etc.

</aside>

<aside class="positive">

**GraphQL.** Caso tenha interesse, a Amazon possui um serviço próprio para APIs GraphQL, chamado **AppSync**. Saiba mais em [https://aws.amazon.com/appsync/](https://aws.amazon.com/appsync/).

</aside>

## Criando a API e um recurso
Duration: 10:00

Neste passo, criamos nossa primeira API usando o API Gateway. Comece clicando em **Start Lab** e, quando a "bolinha" ficar verde, clique em **AWS**.

![Página do Learner Lab com os botões Start Lab e AWS destacados no topo](img/p007-1.webp)

*Inicie o laboratório e abra o console AWS.*

Você se deparará com o console, ambiente gráfico que dá acesso aos serviços da Amazon.

![Página inicial do Console AWS](img/p007-2.webp)

*O console AWS.*

Na barra de pesquisa, busque por **API Gateway**.

![Barra de pesquisa do console com o texto api gateway e o serviço API Gateway destacado nos resultados](img/p008-1.webp)

*Buscando pelo serviço API Gateway.*

Note que há uma lista de tipos de API que você pode escolher. Escolha **REST API** (não private) e clique em **Build**.

![Lista de tipos de API com o quadro REST API e seu botão Build destacados](img/p008-2.webp)

*Escolhendo REST API.*

Uma API modelo terá sido criada, usando a linguagem do **Swagger**.

<aside class="positive">

**Swagger** é uma ferramenta que nos permite descrever a estrutura de uma API, utilizando uma linguagem específica. Entre outras coisas, a partir desta especificação, podemos gerar documentação automaticamente para nossa API. Utilizando esta especificação, também podemos importar uma API previamente definida em ambientes como o API Gateway da Amazon. Não utilizaremos o Swagger neste material.

</aside>

Clique em **New API** para criar uma API desde o começo. Preencha os campos como a seguir.

* **API name**: `hello-aws-api-gateway`
* **Description**: `Minha primeira API no AWS API Gateway`
* **Endpoint**: `Regional`

A seguir, clique **Create API**.

![Formulário Create new API com a opção New API marcada e os campos de nome, descrição e tipo de endpoint preenchidos](img/p009-1.webp)

*Criando uma nova API.*

Note que há um menu chamado **Actions**. Clique nele e escolha **Create Resource**. Estamos criando um trecho de uma URL que poderá ser acessada para a obtenção de algum recurso.

![Menu Actions aberto com a opção Create Resource destacada](img/p010-1.webp)

*Actions >> Create Resource.*

Preencha os campos como a seguir.

* **Resource name**: `primeiro-teste`
* **Resource Path**: `primeiro-teste`

Clique **Create Resource**.

![Formulário New Child Resource com nome e caminho primeiro-teste](img/p010-2.webp)

*Criando o recurso primeiro-teste.*

Perceba que o path escolhido aparece como um ponto de acesso, filho direto da raiz (`/`).

![Árvore de recursos mostrando /primeiro-teste abaixo da raiz](img/p011-1.webp)

*O recurso /primeiro-teste criado.*

## Criando um método GET com integração Mock
Duration: 10:00

Embora tenhamos uma URL, ainda não é possível fazer requisições. Para tal, precisamos especificar quais características uma requisição precisa ter para ser atendida adequadamente. Começando, por exemplo, com o método HTTP (**GET**, **POST**, **OPTIONS** etc.). Para isso, clique no menu **Actions** novamente e escolha **Create Method**.

<aside class="negative">

É fundamental manter a URL (`/primeiro-teste`, neste caso) selecionada antes de clicar em **Actions**.

</aside>

![Menu Actions aberto sobre o recurso /primeiro-teste com a opção Create Method destacada](img/p012-1.webp)

*Actions >> Create Method.*

Escolha o método **GET** e clique no botão à frente para confirmar.

![Lista de métodos com GET selecionado e o botão de confirmação destacado](img/p012-2.webp)

*Escolhendo o método GET.*

Perceba que podemos escolher uma das seguintes opções.

* **Lambda Function**: para executar uma função da categoria FaaS (também conhecido como *Code on Demand*).
* **HTTP**: para integrar-se com outro endpoint existente, utilizando o protocolo HTTP.
* **Mock**: para responder à requisição utilizando recursos do próprio API Gateway. Em geral, usada para testes, daí o nome "Mock", que pode ser traduzido como "imitação", "simulação" e similares.
* **AWS Service**: para direcionar a requisição para um serviço qualquer da AWS.
* **VPC Link**: para direcionar a requisição para um endpoint disponível em uma VPC específica.

Neste exemplo, como estamos apenas testando, vamos escolher **Mock**. Depois disso, clique **Save**.

![Tela de configuração do método GET com Integration type Mock selecionado e o botão Save destacado](img/p013-1.webp)

*Escolhendo a integração Mock.*

A seguir, temos dois quadros que nos permitem fazer manipulações com a **requisição** e dois quadros que nos permitem fazer manipulações com a **resposta**. Em breve estudaremos mais detalhes sobre eles. Note, também, que há uma barra com o texto **Test**. Ela nos permite simular um cliente fazendo uma requisição neste endpoint.

![Execução do método com os quadros Method Request, Integration Request, Integration Response e Method Response, e a barra Test à esquerda](img/p014-1.webp)

*Os quadros de requisição e resposta do método.*

<aside class="positive">

**ARN** é acrônimo de *Amazon Resource Name*.

</aside>

O quadro **Integration Response** – entre outras coisas – nos permite especificar dados arbitrários que serão entregues para o cliente. Clique em **Integration Response**.

![Quadro Integration Response destacado](img/p014-2.webp)

*Abrindo o Integration Response.*

A seguir, clique na pequena seta para expandir a resposta existente e, então, clique em **Mapping Templates**.

![Resposta existente expandida com a seção Mapping Templates destacada](img/p015-1.webp)

*Expandindo a resposta e abrindo Mapping Templates.*

Clique em **Add mapping template**, preencha o campo com `application/json` e clique no botão à frente do campo textual para confirmar.

![Campo Content-Type preenchido com application/json e botão de confirmação destacado](img/p015-2.webp)

*Adicionando um mapping template para application/json.*

A seguir, um quadro à direita se abrirá. Nele, podemos especificar um objeto JSON que será devolvido para requisições feitas neste endpoint. Preencha com o seguinte conteúdo. Clique em qualquer botão **Save**, logo a seguir.

**Mapping template (application/json)**

```json
{
  "mensagem": "Olá, API Gateway"
}
```

![Editor do mapping template à direita com o JSON da mensagem e o botão Save destacado](img/p016-1.webp)

*Definindo o JSON devolvido pelo endpoint.*

## Implantando e testando a API
Duration: 8:00

O próximo passo é implantar a API, ou seja, disponibilizá-la para acesso. Para isso, clique **Actions >> Deploy API**.

![Menu Actions com a opção Deploy API destacada](img/p017-1.webp)

*Actions >> Deploy API.*

Note que será necessário criar um **estágio**. Isso ocorre pois, conforme a API é desenvolvida e atualizada, podemos desejar disponibilizá-la em ambientes de teste e produção, por exemplo.

![Janela Deploy API pedindo a escolha de um estágio](img/p017-2.webp)

*A janela de implantação pede um estágio.*

Escolha a opção **New Stage** e dê um nome para o seu estágio, como `dev`, por exemplo. As descrições podem ser de interesse mas não são obrigatórias. Note que podemos descrever o estágio e descrever essa implantação específica de forma independente, já que múltiplas implantações podem ser feitas. Clique **Deploy**.

![Janela Deploy API com New Stage selecionado e Stage name dev](img/p018-1.webp)

*Criando o estágio dev.*

Note que, na tela a seguir, há uma URL chamada **Invoke URL**. Podemos tentar utilizá-la para acessar o endpoint.

![Editor do estágio dev com a Invoke URL destacada no topo](img/p018-2.webp)

*A Invoke URL do estágio.*

Para isso, copie e cole a URL em uma outra aba do seu navegador. Note que a resposta mostra, de fato, um JSON. Contudo, trata-se de uma mensagem de erro.

![Navegador acessando a URL do estágio dev e exibindo {"message":"Missing Authentication Token"}](img/p019-1.webp)

*Acessando a raiz da API: mensagem de erro.*

Isso ocorre pois a URL que utilizamos está direcionada para a **raiz** da aplicação. Note, contudo, que o endpoint que criamos se chama `primeiro-teste`. Isso quer dizer que devemos fazer o teste da seguinte forma: `URL/primeiro-teste`. Faça o teste novamente, concatenando `/primeiro-teste` à URL no seu navegador.

![Navegador acessando a URL terminada em /primeiro-teste e exibindo o JSON com mensagem Olá, API Gateway](img/p019-2.webp)

*Acessando /primeiro-teste: o JSON definido no mapping template.*

Também podemos testar a API a partir do próprio API Gateway. Para tal, clique **Resources** à esquerda e escolha o método a ser testado. Clique **Test** logo a seguir.

![Menu Resources à esquerda, método GET selecionado e o link Test destacado](img/p020-1.webp)

*Abrindo o teste do método GET.*

Depois, basta clicar **Test** para ver o resultado à direita.

![Tela de teste com o botão Test e, à direita, o corpo da resposta com a mensagem Olá, API Gateway e os logs](img/p020-2.webp)

*Resultado do teste feito pelo próprio API Gateway.*

## Principais features do API Gateway
Duration: 7:00

Como vimos, o serviço AWS API Gateway oferece diferentes funcionalidades. Nesta seção estudaremos as principais. Certifique-se de que você está na página inicial da sua API. Para tal, você pode clicar no nome dela. Observe que as funcionalidades aparecem à esquerda.

![Menu à esquerda da API com Resources, Stages, Authorizers, Gateway Responses, Models, Resource Policy, Documentation, Dashboard, Settings, Usage Plans, API Keys e Client Certificates](img/p021-1.webp)

*As funcionalidades da API aparecem no menu à esquerda.*

### API Keys

Essa feature nos permite criar chaves de acesso para nossa API. Assim, podemos dizer que apenas detentores de uma determinada chave podem acessar determinados recursos de nossa API.

### Usage plans

Um usage plan pode ser usado para limitar o uso de recursos da API. Ele possui as seguintes características:

* **Throttling** (algo como estrangulamento). Com esta opção, podemos especificar:
  * **Rate**: quantas requisições podem ser feitas por segundo.
  * **Burst**: o número máximo de requisições simultâneas antes de a API passar a responder `429 Too many requests`.
* **Quota**: o número de requisições máximo que podem ser realizadas dentro de um período de tempo, como um mês, por exemplo.

<aside class="positive">

**Token Bucket.** Nas descrições das configurações mencionadas, você verá o termo Token Bucket. Isso ocorre pois os controles citados são feitos utilizando-se o algoritmo que leva esse nome, Token Bucket. A ideia é termos um "bucket" de tokens e que cada token represente uma requisição. Se desejar, leia mais sobre o algoritmo Token Bucket em [https://en.wikipedia.org/wiki/Token_bucket](https://en.wikipedia.org/wiki/Token_bucket).

</aside>

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

## Exercícios
Duration: 25:00

Neste exercício, você criará uma API com o AWS API Gateway que funcionará como mostra a figura a seguir.

![Diagrama: um cliente HTTP (Thunder Client, Postman etc.) faz GET /albums com a chave de API na nuvem AWS; o API Gateway repassa GET /albums para https://jsonplaceholder.typicode.com/albums e devolve a lista de álbuns com userId, id e title](img/ex-p001-1.webp)

*A API do exercício repassa as requisições para o serviço externo JSONPlaceholder.*

### Passos sugeridos

1. Crie uma API REST.
2. Crie um recurso identificado por `/albums`.
3. Crie um método GET para o recurso. Estude as opções que você possui ao criar o método: Lambda Function, HTTP, Mock, AWS Service, VPC Link. Qual lhe parece mais apropriada? Lembre-se que o alvo é [https://jsonplaceholder.typicode.com/albums](https://jsonplaceholder.typicode.com/albums).
4. Faça deploy da API usando um stage chamado `dev`.
5. Crie uma chave de API gerada automaticamente.
6. Crie um Usage Plan da seguinte forma:
   * Limite de 10 requisições por segundo
   * Limite de 100 requisições simultâneas
   * Limite de 5000 requisições por dia

   Vincule o Usage Plan ao stage `dev` da API. Adicione a chave de API criada anteriormente a este Usage Plan.
7. No quadro **Method Request** do método GET do recurso `/albums`, indique que é obrigatório utilizar uma chave de API.
8. Faça novo deploy da aplicação.
9. Utilize o Thunder Client (VS Code) para testar. Será necessário descobrir a forma como especificamos uma chave de API num cliente HTTP.

### Links que podem ajudar

* Sobre chaves de API: [https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-setup-api-key-with-console.html](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-setup-api-key-with-console.html)
* Sobre Usage plans: [https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-usage-plans-with-console.html](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-usage-plans-with-console.html)
* Sobre como especificar a chave de API ao fazer uma requisição (repare na chave `x-api-key`): [https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-usage-plans-with-rest-api.html#api-gateway-usage-plan-test-with-postman](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-usage-plans-with-rest-api.html#api-gateway-usage-plan-test-with-postman)

<aside class="positive">

**Dica.** A figura a seguir mostra como configurar a chave no Thunder Client.

</aside>

![Thunder Client no VS Code com uma requisição GET e o cabeçalho x-api-key preenchido com sua chave aqui, e o ícone da extensão destacado no menu à esquerda](img/ex-p003-1.webp)

*Configurando o cabeçalho x-api-key no Thunder Client.*

Se o ícone do Thunder Client não estiver disponível no menu à esquerda, como destacado, basta fazer a sua instalação. Clique em **Extensions**, busque por **Thunder Client** e clique em **Install**.

![Painel Extensions do VS Code com a busca thunder client e o botão Install da extensão destacado](img/ex-p003-2.webp)

*Instalando a extensão Thunder Client.*

## Encerramento
Duration: 3:00

Parabéns! Você conheceu os conceitos de computação serverless e criou, implantou e testou sua primeira API REST no Amazon API Gateway, além de conhecer suas principais features. No próximo codelab da série (AWS Serverless 02), seguimos construindo a aplicação.

### Referências

1. Amazon Web Services (AWS) - Cloud Computing Services. 2023. Disponível em [https://aws.amazon.com/](https://aws.amazon.com/). Acesso em agosto de 2023.
2. PiCloud Launches Serverless Computing Platform To The Public | TechCrunch. 2023. Disponível em [https://techcrunch.com/2010/07/19/picloud-launches-serverless-computing-platform-to-the-public/](https://techcrunch.com/2010/07/19/picloud-launches-serverless-computing-platform-to-the-public/). Acesso em agosto de 2023.
3. Serverless Architectures. 2023. Disponível em [https://martinfowler.com/articles/serverless.html](https://martinfowler.com/articles/serverless.html). Acesso em agosto de 2023.
4. Who coined the term 'serverless'?. 2023. Disponível em [https://www.quora.com/Who-coined-the-term-serverless](https://www.quora.com/Who-coined-the-term-serverless). Acesso em agosto de 2023.
