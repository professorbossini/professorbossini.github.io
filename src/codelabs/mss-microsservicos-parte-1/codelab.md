summary: Conceitos de arquitetura de software e de microsserviços, e a construção, com Node.js e Express, dos microsserviços de lembretes, observações e consulta, comunicando-se por um barramento de eventos implementado do zero.
id: mss-microsservicos-parte-1
categories: Microsserviços,Node.js
tags: microsservicos,arquitetura de software,node.js,express,axios,nodemon,postman,barramento de eventos,uuid
status: Published
authors: Rodrigo Bossini
last updated: 2022-09-05
pdf: microsservicos/01_apostila_microsservicos.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Microsserviços, parte 1: arquitetura e barramento de eventos

## Visão geral
Duration: 3:00

Este codelab é a **parte 1 de 3** da apostila *Arquiteturas de Sistemas Computacionais*. Nela são abordados conceitos relacionados à **Arquitetura de Software**. O primeiro passo é fazer uma definição precisa, apropriada para o contexto desejado. Essa definição caracteriza aquilo que se espera de um **Arquiteto de Software**. A seguir, em uma abordagem prática, o material trata dos seguintes tópicos.

* Padrões Arquiteturais. Padrão Arquitetural REST.
* Serviços Restful.
* Arquitetura cliente/servidor.
* Microsserviços.
* Contêineres e orquestração.

Nesta primeira parte você estuda as definições de arquitetura de software, os tipos de comunicação entre microsserviços e começa a construir, do zero, uma aplicação de **lembretes** e **observações** baseada em microsserviços. As partes 2 e 3 continuam o mesmo projeto, adicionando classificação de observações, tratamento de eventos perdidos, Docker e Kubernetes.

### O que você vai aprender

* Novidades do Express 4.16 (middleware `express.json()`) e do Node.js 15 (promises rejeitadas e não tratadas)
* Definições acadêmicas e de mercado para Arquitetura de Software
* A diferença entre a arquitetura monolítica e a arquitetura baseada em microsserviços
* Comunicação síncrona e assíncrona entre microsserviços
* Como implementar microsserviços com Node.js, Express, axios, cors, nodemon e uuid
* Como testar APIs com o Postman e organizar requisições em coleções
* Como implementar manualmente um barramento de eventos
* Como construir um microsserviço de consulta alimentado por eventos

### O que você vai precisar

* **Node.js** e **npm** instalados (o passo "A aplicação de lembretes" mostra como instalar)
* Um editor de código, como o VS Code
* O **Postman** (ou outro cliente HTTP)
* Um terminal

## Novidades e atualizações
Duration: 8:00

Este material apresenta conceitos sobre arquiteturas de software de maneira prática, com considerável ênfase na codificação de exemplos que ilustram as suas principais características. A construção destes exemplos, naturalmente, se dá utilizando diversos pacotes de software que trazem alto nível de abstração, viabilizando maior enfoque nos aspectos considerados mais importantes. Bons pacotes de software são atualizados constantemente por equipes de desenvolvedores. É esperado que, de tempos em tempos, novas versões de pacotes de software que utilizamos sejam disponibilizadas, possivelmente trazendo novidades para o nosso ambiente. Algumas delas podem trazer novos recursos. Outras podem fazer com que algumas funcionalidades que estamos utilizando deixem de existir, o que quer dizer que aderir ao uso de versões mais recentes pode significar ter de fazer alterações no código. Outros tipos de atualizações de pacotes de software meramente trazem avisos que indicam que determinadas funcionalidades passaram, a partir de certo momento, a ser consideradas obsoletas; em geral, elas são marcadas como *deprecated*. Isso pode fazer com que nosso ambiente de desenvolvimento produza mensagens nos informando a esse respeito, o que não necessariamente causa falhas ou mau funcionamento. Cada seção deste passo trata de uma atualização específica referente a um pacote de software utilizado ao longo do restante do material, as quais podem ser utilizadas a partir do momento que for mais interessante para cada projeto.

### Express 4.16 e o pacote body-parser

Desde a versão **4.16.0** do Express, cuja disponibilização se deu em 28/09/2017, o framework inclui um middleware próprio para a manipulação de objetos JSON. Veja o [changelog do Express 4.16.0](https://expressjs.com/en/changelog/4x.html#4.16.0).

Segundo a documentação, este novo middleware do Express faz uso do pacote **body-parser** internamente. Isso quer dizer que o middleware provido pelo pacote body-parser pode ser substituído por aquele que é nativo do Express. Veja o que a documentação fala a esse respeito.

> The express.json() and express.urlencoded() middleware have been added to provide request body parsing support out-of-the-box. This uses the expressjs/body-parser module module underneath, so apps that are currently requiring the module separately can switch to the built-in parsers.

A substituição é ilustrada a seguir.

**index.js**

```javascript
//o que costumava ser assim
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

//pode agora ser assim
const express = require('express');
const app = express();
app.use(express.json());
```

Além disso, quando inspecionamos o arquivo em que a definição do pacote body-parser é feita (`index.d.ts`), encontramos o seguinte conteúdo.

**index.d.ts (body-parser)**

```typescript
...
/** @deprecated */
declare function bodyParser(
    options?: bodyParser.OptionsJson & bodyParser.OptionsText & bodyParser.OptionsUrlencoded,
): NextHandleFunction;
...
```

A configuração `@deprecated` pode fazer com que a exibição da linha em que o uso da função `bodyParser` ocorre se dê como na figura a seguir.

![Editor exibindo a chamada bodyParser.json() riscada, indicando uso obsoleto](img/p007-1.webp)

*O editor risca a função bodyParser por estar marcada como deprecated.*

### Node.js 15 e promises rejeitadas e não tratadas

A versão **15** do Node.js se comporta de maneira diferente diante de promises rejeitadas não tratadas, ou seja, para as quais não há um bloco `catch`. Antes dela, o comportamento do Node.js era exibir uma mensagem de *warning*, como a seguinte.

**Terminal**

```text
(node:1688) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 2)
(node:1688) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

A partir da versão 15, o Node.js deixa de exibir uma mensagem de warning e passa a causar um erro.

O código a seguir mostra como resolver o problema. Claro, o tratamento a ser realizado no bloco `catch` depende do projeto em que estiver trabalhando.

```javascript
axios.post("http://host:porta/endpoint", evento)
  .catch((err) => {
    console.log("err", err);
  });
```

## Arquitetura de Software
Duration: 10:00

Há diferentes definições para **Arquitetura de Software**. Diferentes autores produzem definições sutilmente diferentes. É óbvio que a definição deve estar de acordo com aquilo que se pretende abordar no texto. Há, também, as definições advindas do mercado de trabalho. Elas são importantes pois caracterizam as funções que espera-se sejam desempenhadas por um **Arquiteto de Software**. Não se trata de uma ciência exata e não há definição correta ou incorreta. Há definições diferentes, cada uma apropriada para um contexto específico.

### Definição acadêmica

A seguir, apresentamos algumas definições para Arquitetura de Software oferecidas por diferentes autores.

> **Definição**
>
> Segundo Armando Fox et. al., a **Arquitetura de Software** descreve como os sub-sistemas que constituem um software interagem entre si a fim de tornar disponíveis os requisitos funcionais e não funcionais [3].

> **Definição**
>
> Segundo Len Bass et. al., a **Arquitetura de Software** de um sistema é o conjunto de estruturas necessário para que se possa refletir sobre ele, o que abrange elementos de software, relações entre eles e as propriedades de ambos [1].

> **Definição**
>
> Segundo Mark Richards et. al., a **Arquitetura de Software** é caracterizada pela **estrutura do sistema**, combinada com as **características arquiteturais** às quais o sistema deve dar suporte, pelas **decisões arquiteturais** e pelos **princípios de design**. Nesta definição
>
> * a **estrutura do sistema** diz respeito ao estilo arquitetural utilizado em sua implementação (como microsserviços, em camadas etc).
> * as **características arquiteturais** definem aquilo que é fundamental para o sucesso do sistema, como escalabilidade, tolerância a falhas, desempenho etc.
> * as **decisões arquiteturais** definem as regras segundo as quais o sistema deve ser construído. Por exemplo, pode-se especificar que somente componentes da camada de serviço têm acesso direto à base de dados.
> * os **princípios de design** são semelhantes às decisões arquiteturais. Entretanto, não são regras absolutas. Tratam-se apenas de recomendações que podem ser aplicadas pelos desenvolvedores em situações específicas. Por exemplo, fazer uso de troca de mensagens assíncronas entre serviços para melhorar o desempenho, sempre que possível.

Finalmente, Martin Fowler escreveu um famoso artigo chamado *Who Needs an Architect?* [4] que vale olhar. Parte do texto chega à seguinte conclusão.

> **Definição**
>
> A **Arquitetura de Software** é caracterizada pelas coisas importantes. Seja lá o que elas forem.

### Definição no mercado de trabalho

O profissional "Arquiteto de Software" tem grande demanda no mercado. Buscas em portais de vagas conhecidos trazem inúmeras oportunidades para esse tipo de profissional, algumas vezes com sutis variações no nome. Ocorre que as necessidades de cada empresa variam em função da natureza de suas atividades. Por isso, **caracterizar a Arquitetura de Software com base naquilo que se vê no mercado é tão dependente de contexto quanto o que ocorre na definição mais acadêmica**. Vejamos alguns exemplos de oportunidades para esse tipo de profissional, especificamente no Brasil (busca realizada no site APINFO em fevereiro de 2021).

* O Arquiteto de Soluções e Softwares deve ter experiência em múltiplos ambientes de hardware e software e estar confortável com ambientes de sistemas heterogêneos complexos. Deve ser um tecnocrata sênior altamente experiente na liderança e definição arquitetural de soluções e softwares alinhadas às necessidades de negócio. O profissional deve ter capacidade de partilhar e comunicar ideias com clareza, oralmente e por escrito à equipe executiva, aos patrocinadores e às equipes técnicas envolvidas no projeto.
* Necessário sólida experiência em desenvolvimento (fullstack), arquitetura e processos em várias tecnologias. Vivências como líder de time, prática com arquiteto de aplicações para soluções WEB e de Micros serviços. Conhecimento em arquitetura Cloud (Azure/ AWS). Conhecimentos em ASP.NET e C#, outras API Web.
* Desenvolvemos soluções digitais sob medida para o negócio do cliente. Nossa metodologia de trabalho tem sua base na Experiência do Usuário (UX) e o Design Thinking para a concepção de soluções, desenvolvimento pautado nas metodologias ágeis com entregáveis recorrentes resultando em soluções robustas, de alta performance, escaláveis e compliance com requisitos de segurança. Buscamos um profissional que terá responsabilidades desde nível de negócio (Engenharia de Software) até Arquitetura de Software e DevOps/Infra com mais de 3 anos de experiência na função.
* Experiência em definição de arquitetura de soluções de alta disponibilidade (HA), escaláveis e microsserviços, desenvolvimento de interfaces através da construção de API. Linguagens: NodeJS, ReactJS, React Native. Lógica de programação avançada. Metodologias ágeis. Acompanhar o mercado e as novas tecnologias. Hands-on na fase de codificação.

Note como a definição também pode variar bastante. Algumas delas, observe, têm bastante relação com as definições encontradas em livros. Note também que, muitas vezes, um profissional que levaria o título de **Desenvolvedor Sênior** em uma empresa pode, em outra, ser considerado um **Arquiteto de Software** ou **Arquiteto de Sistemas**. O mesmo ocorre com outros títulos como **Engenheiro de Software** e similares. Muitas oportunidades deixam claro que o profissional deve ter condições de **colocar a mão na massa!** Ou seja, conhecer diversas linguagens de programação e, de fato, programar. Isso não é diferente com oportunidades encontradas em outros países (busca realizada no site INDEED em fevereiro de 2021). Veja alguns exemplos.

* Docker/Kubernetes, Cloud (AWS, GCP), Data Engineering, DevOps, ML background, Python, ML Ops tools - ML Flow/Kubeflow, ML frameworks - TensorFlow/PyTorch/Keras, ML Testing. Experienced in Python, SQL. Experience with Hadoop infra and NoSQL databases like Cassandra, MongoDB. Experience in building docker container-based solutions – Doker, Kubernetes.
* Experience with cloud/SaaS, big data, or analytics and Machine Learning. Excellent communication skills: Demonstrated ability to present to all levels of leadership, including executives. Expertise with modern technology stacks, microservices, public cloud and programming languages. Familiarity with the FinTech and how technology can be used to solve problems in the personal finance space. Expertise with Agile Development, SCRUM, or Extreme Programming methodologies.
* Application Architect on a team; primary role to design and develop secure web-based applications. Establish work necessary for a complete product; break work down into discrete tasks and deliverables. Code, troubleshoot, test, and maintain core product software and databases, to ensure strong optimization and secure functionality. Knowledge of software architecture and design patterns, and the ability to apply them. Experience in web-based technologies like Microsoft.Net, ASP.NET, JavaScript, C#, VB.Net, Web API and complementary business layer and front-end technologies. Strong problem-solving skills.

## Arquitetura monolítica e microsserviços
Duration: 8:00

Neste passo trataremos de um dos tipos de arquiteturas mais utilizados atualmente: a **Arquitetura baseada em microsserviços**.

### Arquitetura monolítica

Para entender o que é uma Arquitetura baseada em microsserviços, vamos falar de um outro tipo de arquitetura, muitas vezes denominada **Arquitetura Monolítica**. Esse tipo de arquitetura foi muito utilizado nas últimas décadas e ainda o é nos dias atuais. Muito embora o seu uso possa ser empregado ao mesmo tempo em que boas práticas de programação, como o uso de **Design Patterns**, são utilizadas, alguns problemas são inerentes à sua natureza. A figura a seguir mostra um exemplo típico.

![Diagrama de arquitetura monolítica: o cliente envia requisições a um único servidor com front controller, catálogo de produtos, relatórios estatísticos, serviço de pagamentos e autenticação, todos ligados a uma única base de dados](img/p013-1.webp)

*Arquitetura monolítica: todas as funcionalidades em um único servidor e uma única base de dados.*

A aplicação exibida na figura possui diferentes funcionalidades.

* Exibição de catálogo de produtos.
* Geração de relatórios estatísticos.
* Gerenciamento e realização de pagamentos.
* Serviço de autenticação.

Ela está relativamente bem organizada. Possivelmente foi implementada utilizando-se algum padrão composto como o **MVC** ou **MVVM**. Seus componentes de software internos são, possivelmente, altamente coesos e pouco acoplados. Entretanto, a visão geral do sistema mostra um problema que pode ser grave. Todas as funcionalidades fazem parte de uma coisa só: caso seja necessário fazer ajustes no serviço de pagamento, por exemplo, é necessário fazer uma nova implantação do sistema inteiro. Caso o serviço de autenticação deixe de funcionar, possivelmente a aplicação inteira ficará indisponível.

### Arquitetura baseada em microsserviços

Podemos, assim, definir o conceito de **Arquitetura baseada em microsserviços**.

> **Arquitetura baseada em microsserviços**
>
> Uma **Arquitetura baseada em microsserviços** é constituída de pequenos serviços independentes, cada qual responsável por uma única funcionalidade do sistema. Os microsserviços se comunicam entre si por meio de uma interface bem definida. Quando um microsserviço fica indisponível, os demais continuam operando normalmente. Em geral, um microsserviço é desenvolvido e mantido por uma única equipe de desenvolvimento.

Os serviços de **Computação em Nuvem** estão intimamente relacionados ao uso de arquiteturas baseadas em microsserviços. Visite [https://aws.amazon.com/pt/microservices/](https://aws.amazon.com/pt/microservices/) para conhecer a definição proposta pela **Amazon**.

A figura a seguir mostra a ideia geral de um sistema cuja implementação utiliza a Arquitetura baseada em microsserviços.

![Diagrama com quatro microsserviços independentes (catálogo de produtos, relatórios estatísticos, serviço de pagamentos e autenticação), cada um com front controller e sua própria base de dados, atendendo ao cliente](img/p015-1.webp)

*Arquitetura baseada em microsserviços: cada funcionalidade é um serviço com sua própria base de dados.*

### E os dados?

Devido à independência entre os microsserviços sugerida pelas definições apresentadas, o uso de uma base de dados independente para cada um deles parece natural. Idealmente, **um microsserviço jamais acessa a base de dados de outro**. Isso ocorre pois **o esquema de cada base pode ser alterado a qualquer momento** e, além disso, cada microsserviço pode ter um **tipo de esquema (relacional ou NoSQL, por exemplo) mais apropriado** para a sua finalidade.

Entretanto, essa abordagem tem aspectos que podem comprometer a desejada simplicidade para o desenvolvimento do sistema. Considere, ainda, a proposta de arquitetura da figura a seguir.

![Mesmo diagrama de microsserviços, com o microsserviço de relatórios estatísticos marcado com um sinal de proibido ao tentar acessar as bases de dados dos demais](img/p016-1.webp)

*O microsserviço de relatórios estatísticos precisa de dados que estão nas bases de outros microsserviços.*

A sua funcionalidade **Relatórios Estatísticos** depende de dados existentes nas bases de dados pertencentes a outros microsserviços. Como essa funcionalidade poderia ser implementada sem o acesso direto a essas bases? Os microsserviços precisam se comunicar de alguma forma.

## Comunicação entre microsserviços
Duration: 10:00

Para resolver esse tipo de problema, os microsserviços precisam se comunicar de alguma forma. Há dois tipos essenciais de comunicação entre microsserviços: o **síncrono** e o **assíncrono**.

### Comunicação síncrona

Na comunicação síncrona, um microsserviço realiza uma requisição direta a outro e fica no aguardo da resposta. Veja a figura a seguir.

![Diagrama em que o cliente faz uma requisição ao microsserviço de relatórios estatísticos, que por sua vez faz uma requisição direta ao microsserviço de pagamentos e aguarda a resposta](img/p017-1.webp)

*Comunicação síncrona: um microsserviço requisita dados diretamente a outro.*

Em qualquer modelo de comunicação, há vantagens e desvantagens a serem consideradas. A comunicação síncrona, por exemplo, **traz como vantagem o acesso indireto a bases de dados**. Inclusive, pode ser o caso de o microsserviço em questão sequer precisar de uma. Por outro lado, é natural a dependência entre os microsserviços. Neste exemplo, caso o Serviço de Pagamentos fique indisponível, o microsserviço de Relatórios Estatísticos também deixará de funcionar.

### Comunicação assíncrona: barramento de eventos

A comunicação assíncrona, por sua vez, tem algumas formas de implementação. Uma delas é baseada em **eventos**. Seu funcionamento se dá em função de um **barramento de eventos**. Veja a figura a seguir.

![Diagrama com dois microsserviços conectados a um barramento de eventos; as etapas numeradas mostram a requisição do cliente, a emissão de um evento ao barramento, o repasse ao outro microsserviço e o retorno da resposta](img/p018-1.webp)

*Comunicação assíncrona com um barramento de eventos.*

Neste modelo de comunicação assíncrona, cada microsserviço se conecta ao barramento de eventos. Uma vez conectado ao barramento, um microsserviço pode

* **emitir** eventos, o que significa que eles são enviados ao barramento.
* **receber** eventos do barramento que são gerados por outros microsserviços.

<aside class="negative">

Note que o barramento de eventos poderia ser um ponto de falha centralizado do sistema. Ele é, idealmente, implantado em uma plataforma que lida com esse tipo de problema automaticamente.

</aside>

Este modelo perde em **simplicidade** quando comparado ao modelo de comunicação síncrona. Há também a dependência entre serviços. **Pelo fato de a comunicação ser assíncrona, o microsserviço de origem pode se ocupar com outras tarefas enquanto aguarda uma eventual resposta do barramento de eventos.**

### Comunicação assíncrona: base de dados em função das demais

Uma outra forma de comunicação assíncrona se baseia na construção de uma base de dados em função de outras. Veja a figura a seguir. Ela pode ser uma espécie de *view* contendo somente as partes de interesse.

![Diagrama em que o microsserviço de relatórios estatísticos possui uma base própria, cuja tabela reúne apenas as colunas de interesse vindas das bases de outros microsserviços](img/p019-1.webp)

*Uma base de dados construída em função das demais, contendo somente o que interessa.*

A questão óbvia a ser respondida é como essa base pode ser criada sem que um microsserviço acesse diretamente a base de dados de outro e sem estabelecer dependências diretas entre eles. A ideia geral é ilustrada na figura a seguir.

![Diagrama numerado: o cliente envia um pagamento ao microsserviço de pagamentos, que grava em sua base e emite um evento ao barramento; o barramento repassa o evento ao microsserviço de relatórios estatísticos, que atualiza a sua própria base](img/p019-2.webp)

*O microsserviço de pagamentos emite um evento e o de relatórios estatísticos atualiza a sua base.*

Quando o microsserviço de Pagamentos recebe uma nova requisição, ele armazena os dados de um novo pagamento em sua base, garantindo o seu funcionamento. Além disso, ele emite um evento que é direcionado a um barramento de eventos. O barramento de eventos se encarrega de fazer uma espécie de envio *broadcast* para que microsserviços interessados naquele evento sejam notificados. Neste exemplo, o microsserviço de Relatórios Estatísticos recebe o evento e atualiza a sua base.

Note que a requisição é assíncrona e, **caso o microsserviço de Relatórios Estatísticos esteja temporariamente indisponível, o microsserviço de Pagamentos não deixa de funcionar**. E o oposto também é verdadeiro: **caso o microsserviço de Pagamentos esteja indisponível, o microsserviço de Relatórios Estatísticos pode operar utilizando a base de dados que possuir no momento**.

## A aplicação de lembretes
Duration: 12:00

Nesta seção, iremos implementar uma aplicação utilizando a Arquitetura baseada em microsserviços. A ideia é implementar os diversos recursos necessários um a um, ao invés de utilizar pacotes já prontos para isso. Nas próximas seções, lidaremos também com o seu uso.

### Visão geral

A figura a seguir mostra a tela principal da aplicação. Ela permite que o usuário armazene os seus **lembretes** e, eventualmente, adicione um número arbitrário de **observações** a eles.

![Esboço da tela da aplicação Lembretes, com um campo para adicionar lembrete, botão Enviar e cartões dos lembretes "Fazer café" (2 observações) e "Natação" (0 observações)](img/p021-1.webp)

*Tela principal da aplicação de lembretes e observações.*

### Quais microsserviços implementar?

Uma decisão a ser tomada diz respeito a quais e quantos microsserviços implementar. Para esta aplicação, iremos implementar **um microsserviço para cada tipo de objeto que ela manipula**. Assim, teremos um microsserviço para os lembretes e outro para as observações. Eles realizarão as seguintes tarefas.

* microsserviço de lembretes
  1. criar um lembrete
  2. listar os lembretes
* microsserviço de observações
  1. criar uma observação
  2. listar as observações de um lembrete

É importante observar que, mesmo para essas funcionalidades aparentemente simples, já existem questões relativamente complexas a serem resolvidas. As funcionalidades do microsserviço de observações dependem de dados de lembretes. Assim, teremos de decidir qual forma de comunicação será empregada entre os microsserviços.

### Instalação do Node.js

Os microsserviços serão implementados utilizando-se o **Node.js** [2]. O Node.js é um ambiente que viabiliza, entre outras coisas, a execução de código JavaScript do lado do servidor. A sua instalação traz também o **Node Package Manager (npm)**, um gerenciador de pacotes por meio do qual podemos fazer a instalação de pacotes disponíveis no ecossistema Node.js. Há algumas formas para realizar a sua instalação.

**Instalação com o instalador regular do Node.js.** Uma maneira bastante simples para fazer a instalação do Node.js é por meio do download do seu instalador, disponível no [site oficial](https://nodejs.org/en/). A instalação do Node.js já implica na instalação do npm.

**Instalação usando um gerenciador de versões.** Há ainda a possibilidade de fazer a instalação do Node.js por meio de um **Node Version Manager (NVM)**, ou seja, um gerenciador de versões do Node.js. Ele permite que tenhamos diversas versões do Node.js instaladas e que façamos a alternância entre elas conforme desejado. Além disso, o funcionamento do NVM ocorre no diretório do usuário do sistema operacional, o que quer dizer que seu uso tende a evitar problemas de permissão para acesso a determinados diretórios. O instalador de um NVM pode ser obtido em [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) (Linux e Mac) e em [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows) (Windows).

Uma vez instalado o NVM, para instalar o Node.js, basta usar

**Terminal**

```bash
nvm install versao-desejada
```

É interessante instalar a última versão LTS disponível na maior parte dos casos. As versões disponíveis para instalação podem ser listadas com

**Terminal (Linux e Mac)**

```bash
nvm ls-remote
```

no Linux e no Mac e com

**Terminal (Windows)**

```bash
nvm list available
```

no Windows. A última versão LTS disponível no momento em que esse documento foi escrito era a **14.15.5**. Para fazer a sua instalação, o comando é

**Terminal**

```bash
nvm install 14.15.5
```

A seguir, para colocá-la em uso, use

**Terminal**

```bash
nvm use 14.15.5
```

Você pode verificar se o Node.js foi corretamente instalado com

**Terminal**

```bash
node --version
```

ou com

**Terminal**

```bash
node -v
```

### Workspace

Comece criando um diretório para abrigar os arquivos dos projetos.

### O microsserviço de lembretes: criando o projeto

Cada microsserviço será implementado como um projeto Node.js independente. Crie uma pasta chamada `lembretes` em seu workspace e use

**Terminal (pasta lembretes)**

```bash
npm init -y
```

para criar um projeto. A opção `-y` indica que deseja-se utilizar valores padrão para cada item que caracteriza o projeto, como nome, versão etc.

### Pacotes

Os pacotes que utilizaremos, a princípio, são

* **Express** [5] - um framework web para o Node.js que adiciona níveis de abstração para, entre outras coisas, a manipulação de requisições HTTP.
* **cors** - CORS significa *Cross-Origin Resource Sharing*. Trata-se de um mecanismo utilizado para especificar como cliente e servidor podem compartilhar recursos, em particular para o caso em que tiverem domínios diferentes. O pacote cors disponibiliza uma API que simplifica esse tipo de especificação.
* **axios** - um pacote que simplifica a realização de requisições HTTP assíncronas usando Ajax.
* **nodemon** - seu nome vem de *Node Monitor*. É natural a necessidade de reinicializar o servidor em tempo de desenvolvimento. Em geral, isso é necessário para que novas atualizações realizadas possam ser testadas. O nodemon é um pacote que monitora a execução de um servidor Node.js e que o reinicializa automaticamente quando detecta que arquivos de extensões especificadas são alterados.

Eles podem ser instalados com

**Terminal (pasta lembretes)**

```bash
npm install express cors axios nodemon
```

Certifique-se de executar esse comando utilizando um terminal vinculado ao diretório em que se encontra o seu projeto Node.js.

### O microsserviço de observações: criando o projeto

Repita os passos para criar o projeto referente às observações. Crie uma pasta chamada `observacoes` em seu workspace (cuidado para não criá-la dentro do diretório do microsserviço de lembretes) e execute

**Terminal (pasta observacoes)**

```bash
npm init -y
```

e

**Terminal (pasta observacoes)**

```bash
npm install express cors axios nodemon
```

logo a seguir.

## O microsserviço de lembretes
Duration: 15:00

### Requisições e métodos HTTP do microsserviço de lembretes

Lembre-se que o protocolo HTTP, cuja RFC principal pode ser encontrada em [https://tools.ietf.org/html/rfc2616](https://tools.ietf.org/html/rfc2616), possui métodos com finalidades específicas. Utilizaremos as seguintes especificações.

| Método HTTP | Padrão de acesso | Corpo | Atividade |
| --- | --- | --- | --- |
| PUT | `/lembretes` | `{texto: string}` | Criar um lembrete |
| GET | `/lembretes` | vazio | Obter a lista de lembretes |

### Código inicial do microsserviço de lembretes

Comece criando um arquivo chamado `index.js` na pasta `lembretes`. O código a seguir mostra a implementação inicial do servidor com as duas rotas propostas.

**lembretes/index.js**

```javascript
const express = require('express');
const app = express();
app.get('/lembretes', (req, res) => {

});
app.put('/lembretes', (req, res) => {

});

app.listen(4000, () => {
  console.log('Lembretes. Porta 4000');
});
```

### Base inicialmente volátil para o microsserviço de lembretes

Inicialmente não nos preocuparemos com a implementação de uma base de dados propriamente dita. Os dados serão todos armazenados em uma coleção em memória volátil. Faça a sua definição como mostra o código a seguir.

**lembretes/index.js**

```javascript
const express = require('express');
const app = express();
const lembretes = {};
app.get('/lembretes', (req, res) => {

});
app.put('/lembretes', (req, res) => {

});

app.listen(4000, () => {
  console.log('Lembretes. Porta 4000');
});
```

### Requisição GET: devolvendo a coleção de lembretes

A implementação do método GET é muito simples: basta devolver a coleção inteira de lembretes. Veja a sua implementação.

**lembretes/index.js**

```javascript
...
app.get('/lembretes', (req, res) => {
  res.send(lembretes);
});
...
```

### Requisição PUT: geração de id e criação de lembrete

Quando um lembrete for inserido, ele será associado a um número de identificação para que, no futuro, seja possível associá-lo a suas observações e diferenciá-lo dos demais. A princípio, nosso id será um simples contador. Quando a requisição é recebida, precisamos extrair o campo `texto` para construir o objeto a ser armazenado. Para tal, vamos utilizar o pacote **body-parser**. Ele devolverá um *middleware* que irá adicionar um campo chamado `body` à requisição, simplificando a extração do conteúdo enviado pelo cliente. Veja o código a seguir.

**lembretes/index.js**

```javascript
...
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
lembretes = {};
contador = 0;
...
app.put('/lembretes', (req, res) => {
  contador++;
  const { texto } = req.body;
  lembretes[contador] = {
    contador, texto
  }
  res.status(201).send(lembretes[contador]);
});
```

<aside class="positive">

Como visto no passo "Novidades e atualizações", a partir do Express 4.16 é possível trocar `bodyParser.json()` por `express.json()`, sem precisar do pacote body-parser.

</aside>

### Executando o servidor com nodemon

Abra o arquivo `package.json` do projeto e encontre a chave `scripts`. Ajuste-a como a seguir.

**lembretes/package.json**

```json
{
  "name": "lembretes",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.21.1",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "nodemon": "^2.0.7"
  }
}
```

Em um terminal vinculado ao diretório em que se encontra o projeto, use

**Terminal (pasta lembretes)**

```bash
npm start
```

para colocar o servidor em execução.

## Testes com Postman
Duration: 10:00

O [Postman](https://www.postman.com/) é um cliente HTTP. Passaremos a utilizá-lo para testar nossas APIs. Para testar o endpoint de obtenção da lista de lembretes, use os seguintes valores no Postman.

* Método: **GET**.
* Endereço: `localhost:4000/lembretes`

<aside class="positive">

Ao abrir o Postman, pode ser necessário clicar em **Create New Request** a fim de visualizar a tela exibida pela figura a seguir. Note que ele possui diversos recursos como a criação de coleções de requisições, ambientes e o uso do **Scratch Pad** e de **Workspaces**.

</aside>

Veja a figura a seguir. O resultado obtido deve ser um objeto JSON vazio, afinal, ainda não fizemos nenhuma inserção.

![Postman com uma requisição GET para localhost:4000/lembretes e a resposta {} destacada](img/p027-1.webp)

*Requisição GET ao microsserviço de lembretes devolvendo um objeto vazio.*

Para testar o endpoint de inserção de novo lembrete, use os seguintes valores no Postman.

* Método: **PUT**.
* Endereço: `localhost:4000/lembretes`
* Body: `{"texto": "Fazer café"}`. Para especificar esse valor, clique **Body » raw »** e, no menu de seleção (por padrão mostra "Text"), escolha **JSON**.

Veja a figura a seguir.

![Postman com uma requisição PUT para localhost:4000/lembretes, Body raw em JSON com o texto Fazer café e a resposta com contador e texto destacados](img/p027-2.webp)

*Requisição PUT criando um lembrete.*

### Organizando as requisições em uma coleção

Pode ser uma boa ideia fazer o uso do recurso de **Coleções de requisições** do Postman. Ele é interessante pois nos permite agrupar requisições relacionadas e mantê-las armazenadas para uso futuro. Para criar uma nova coleção de requisições no Postman, clique **Collections**. A seguir, clique **Create New Collection**. Escolha um nome para a sua coleção, idealmente algo que te ajude a lembrar a que estão associadas as requisições que serão agora agrupadas. A seguir, crie duas pastas: uma para as requisições referentes aos lembretes e outra para as requisições referentes às observações. Para criar as pastas, basta clicar com o direito sobre o nome da coleção. Crie, a seguir, as requisições relacionadas a lembretes em sua respectiva pasta. Veja a figura a seguir.

![Painel Collections do Postman com uma coleção contendo as pastas lembretes e observacoes e as requisições GET e PUT de lembretes](img/p029-1.webp)

*Coleção do Postman com pastas para lembretes e observações.*

## O microsserviço de observações
Duration: 15:00

A implementação do microsserviço de observações é semelhante àquela feita para o microsserviço de lembretes. Entretanto, há um ponto importante a ser considerado: cada observação está associada a um lembrete. Note que isso poderá implicar na necessidade da comunicação entre os microsserviços. Suas especificações são as seguintes.

| Método HTTP | Padrão de acesso | Corpo | Atividade |
| --- | --- | --- | --- |
| PUT | `/lembretes/:id/observacoes` | `{conteudo: string}` | Criar uma nova observação associada ao lembrete cujo id se encontra especificado no padrão de acesso |
| GET | `/lembretes/:id/observacoes` | vazio | Obter a lista de observações associadas ao lembrete cujo id se encontra especificado no padrão de acesso |

### Código inicial do microsserviço de observações

Comece criando um arquivo chamado `index.js` na pasta `observacoes`. O código inicial é semelhante àquele visto na criação do microsserviço de lembretes. Note, entretanto, que os padrões de acesso são diferentes. Também é necessário utilizar uma porta diferente. Assim os dois microsserviços poderão ser mantidos em execução simultaneamente. Veja o código a seguir.

**observacoes/index.js**

```javascript
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

//:id é um placeholder
//exemplo: /lembretes/123456/observacoes
app.put('/lembretes/:id/observacoes', (req, res) => {

});

app.get('/lembretes/:id/observacoes', (req, res) => {

});

app.listen(5000, (() => {
  console.log('Lembretes. Porta 5000');
}));
```

### Base inicialmente volátil para o microsserviço de observações

A definição da base de dados que armazena a coleção de observações é exibida no código a seguir. Ela é um objeto JSON em que **cada chave é o id de um lembrete e seu valor associado é a coleção de observações associadas àquele lembrete**.

**observacoes/index.js**

```javascript
...
const app = express();
app.use(bodyParser.json());

const observacoesPorLembreteId = {};

//:id é um placeholder
//exemplo: /lembretes/123456/observacoes
app.put('/lembretes/:id/observacoes', (req, res) => {

});
...
```

### Gerando códigos UUID

Na implementação da base de dados do serviço de lembretes, utilizamos um simples contador para representar um código único utilizado para diferenciar um lembrete dos demais. Podemos fazer uso de técnicas mais sofisticadas utilizando, por exemplo, o pacote **uuid**. Ele implementa a especificação UUID dada pela **RFC 4122**, que pode ser visitada em [https://tools.ietf.org/html/rfc4122](https://tools.ietf.org/html/rfc4122). Para fazer a sua instalação, use

**Terminal (pasta observacoes)**

```bash
npm install uuid
```

Caso deseje, passe a utilizá-lo também no microsserviço de lembretes. Note que, por serem serviços independentes, nada impede que utilizem estratégias diferentes.

### Requisição PUT: inserindo uma nova observação

O algoritmo para inserção de nova observação é o seguinte.

* Gerar um novo identificador para a observação a ser inserida.
* Extrair, do corpo da requisição, o texto da observação.
* Verificar se o id de lembrete existente na URL já existe na base e está associado a uma coleção. Em caso positivo, prosseguir utilizando a coleção existente. Caso contrário, criar uma nova coleção.
* Adicionar a nova observação à coleção de observações recém obtida/criada.
* Fazer com que o identificador do lembrete existente na URL esteja associado a essa nova coleção alterada, na base de observações por id de lembrete.
* Devolver uma resposta ao usuário envolvendo o código de status HTTP e algum objeto de interesse, possivelmente a observação inserida ou, ainda, a coleção inteira de observações.

Veja a sua implementação.

**observacoes/index.js**

```javascript
...
const { v4: uuidv4 } = require('uuid');
...
//:id é um placeholder
//exemplo: /lembretes/123456/observacoes
app.put('/lembretes/:id/observacoes', (req, res) => {
  const idObs = uuidv4();
  const { texto } = req.body;
  //req.params dá acesso à lista de parâmetros da URL
  const observacoesDoLembrete =
    observacoesPorLembreteId[req.params.id] || [];
  observacoesDoLembrete.push({ id: idObs, texto });
  observacoesPorLembreteId[req.params.id] =
    observacoesDoLembrete;
  res.status(201).send(observacoesDoLembrete);
});
```

## Testando lembretes e observações
Duration: 10:00

### Testando inserções de lembretes e observações

Para testar, abra o arquivo `package.json` do projeto observações e adicione um script que utiliza o nodemon, como feito para o projeto de lembretes. Veja o código a seguir.

**observacoes/package.json**

```json
{
  "name": "observacoes",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.21.1",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "nodemon": "^2.0.7",
    "uuid": "^8.3.2"
  }
}
```

Utilize

**Terminal (pasta observacoes)**

```bash
npm start
```

para colocar o microsserviço em execução. A seguir, abra o Postman e envie uma requisição ao microsserviço de lembretes para fazer a inserção de um novo e anotar o seu identificador gerado. Veja a figura a seguir.

![Postman, dentro da pasta lembretes da coleção, com um PUT em localhost:4000/lembretes e a resposta com o contador do lembrete destacado](img/p034-1.webp)

*Inserção de um lembrete: anote o identificador devolvido.*

Anote o identificador gerado para o lembrete recém inserido e faça uma requisição de inserção ao microsserviço de observações, como mostra a figura a seguir. Como feito até então, crie a requisição na subpasta anteriormente criada para agrupar requisições feitas ao microsserviço de observações. Clique **Save** para salvar os dados da requisição.

![Postman, dentro da pasta observacoes da coleção, com um PUT em localhost:5000/lembretes/1/observacoes, corpo JSON com o texto da observação e a resposta com a lista de observações destacada](img/p034-2.webp)

*Inserção de uma observação associada ao lembrete de id 1.*

### Requisição GET: devolvendo a lista de observações de um lembrete

A implementação do endpoint de obtenção de observações de um lembrete especificado é um tanto simples. Ela extrai o identificador de lembrete existente na URL e acessa a base de dados. Caso uma coleção seja encontrada na base, ela é devolvida. Caso contrário, o microsserviço devolve uma coleção vazia. Veja o código a seguir.

**observacoes/index.js**

```javascript
app.get('/lembretes/:id/observacoes', (req, res) => {
  res.send(observacoesPorLembreteId[req.params.id] || []);
});
```

### Teste para a obtenção da lista de observações

No Postman, crie uma nova requisição para testar a nova implementação, como na figura a seguir.

![Postman com um GET em localhost:5000/lembretes/1/observacoes e a resposta com as observações do lembrete destacada](img/p035-1.webp)

*Obtenção da lista de observações do lembrete 1.*

## Lembretes com observações: n + 1 requisições
Duration: 8:00

### Busca da coleção de lembretes incluindo observações: n + 1 requisições feitas pelo cliente

Uma aplicação cliente, como aquela exibida no passo "A aplicação de lembretes", pode estar interessada em obter a coleção de lembretes incluindo a coleção de observações referente a cada um deles. Devido à arquitetura que estamos empregando no Back End, podem ser necessárias muitas requisições para atender essa necessidade, como mostra a figura a seguir. Uma primeira requisição é feita para a obtenção da coleção de lembretes. A seguir, $n$ requisições são feitas para a obtenção de cada uma das coleções de observações.

![Diagrama em que o cliente faz uma requisição ao microsserviço de lembretes e, depois, uma requisição ao microsserviço de observações para cada lembrete obtido](img/p036-1.webp)

*O cliente precisa fazer n + 1 requisições para montar a tela.*

### Busca da coleção de lembretes incluindo observações: comunicação síncrona

Pode ser interessante tornar transparente para o cliente esse número de requisições, simplificando a sua implementação. A ideia é aplicar técnicas de comunicação entre microsserviços para fazê-lo. Uma delas é a **Comunicação Síncrona**, como ilustra a figura a seguir.

![Diagrama em que o cliente faz uma única requisição ao microsserviço de lembretes, que por sua vez faz requisições síncronas ao microsserviço de observações antes de responder](img/p037-1.webp)

*Comunicação síncrona: o microsserviço de lembretes consulta o de observações.*

Como discutimos, esse é um modelo de simples entendimento. Entretanto, ele apresenta dependência entre microsserviços e pode dar origem a cadeias de requisições a diferentes microsserviços, o que pode comprometer o desempenho do microsserviço de origem.

### Busca da coleção de lembretes incluindo observações: comunicação assíncrona

Outra possibilidade envolve o uso da comunicação assíncrona entre os microsserviços. Ela traz vantagens como a independência entre microsserviços e a possibilidade de melhorias de desempenho. Há, por outro lado, a necessidade de se cuidar da redundância de dados. O modelo ilustrado na figura a seguir traz a proposta de uso de um **microsserviço de consulta**.

![Diagrama em que os microsserviços de lembretes e de observações emitem eventos a um barramento, que os repassa a um microsserviço de consulta com base própria; o cliente consulta apenas esse microsserviço](img/p038-1.webp)

*Comunicação assíncrona com um microsserviço de consulta.*

## O barramento de eventos
Duration: 12:00

### Uma implementação manual de um barramento de eventos

Há diferentes implementações de barramentos de eventos (também chamadas de filas de mensagens e outros) disponíveis. Alguns exemplos são os seguintes.

* Apache ActiveMQ
* RabbitMQ
* Apache Kafka
* Amazon MQ
* Google Cloud Pub/Sub

Nesta seção, iremos fazer a nossa própria implementação para fins de aprendizado. Aplicações profissionais certamente empregam soluções como as citadas. Elas são amplamente testadas e utilizadas por milhões de usuários, além de, em geral, serem implantadas em serviços de computação em nuvem de alta disponibilidade, tolerância a falhas etc. A figura a seguir ilustra o funcionamento básico de nossa implementação. O barramento de eventos, que também é um microsserviço, possui um endpoint que viabiliza a entrega de eventos. Cada serviço interessado em algum tipo de evento também disponibiliza um endpoint assim. Quando o barramento de eventos recebe um evento, ele faz uma espécie de envio *broadcast*.

![Diagrama em que um microsserviço envia um evento via POST ao endpoint /eventos do barramento, que o repassa via POST ao endpoint /eventos de cada microsserviço](img/p040-1.webp)

*Funcionamento do barramento de eventos implementado manualmente.*

### Barramento de eventos: criando o projeto

O barramento de eventos será um novo microsserviço, independente dos demais. Por isso, crie uma nova pasta chamada `barramento-de-eventos` em seu workspace e use

**Terminal (pasta barramento-de-eventos)**

```bash
npm init -y
```

para criar o projeto. Abra um terminal vinculado à nova pasta e instale as dependências com

**Terminal (pasta barramento-de-eventos)**

```bash
npm install express nodemon axios cors
```

Crie um arquivo chamado `index.js` na nova pasta e, como feito com os demais projetos, abra o arquivo `package.json` e especifique um novo script de execução como mostra o código a seguir.

**barramento-de-eventos/package.json**

```json
{
  "name": "barramento-de-eventos",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.21.1",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "nodemon": "^2.0.7"
  }
}
```

O código a seguir mostra a implementação inicial do barramento de eventos. Ele possui um endpoint que se encarrega de direcionar o evento recebido aos demais microsserviços.

**barramento-de-eventos/index.js**

```javascript
const express = require('express');
const bodyParser = require('body-parser');
//para enviar eventos para os demais microsserviços
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/eventos', (req, res) => {
  const evento = req.body;
  //envia o evento para o microsserviço de lembretes
  axios.post('http://localhost:4000/eventos', evento);
  //envia o evento para o microsserviço de observações
  axios.post('http://localhost:5000/eventos', evento);
  res.status(200).send({ msg: "ok" });
});

app.listen(10000, () => {
  console.log('Barramento de eventos. Porta 10000.')
})
```

Use

**Terminal (pasta barramento-de-eventos)**

```bash
npm start
```

para colocar o microsserviço em execução.

## Emissão de eventos
Duration: 12:00

### Emissão de eventos a partir do microsserviço de lembretes

Sempre que o microsserviço de lembretes faz a inserção de um novo lembrete em sua base própria, ele também emite um evento para que outros microsserviços interessados tenham acesso aos dados. Ele faz isso por meio de uma requisição HTTP do tipo POST enviada ao barramento de eventos. Para fazer essa requisição, utilizaremos o pacote axios. Veja o código a seguir.

**lembretes/index.js**

```javascript
...
const axios = require("axios");
...
app.put("/lembretes", async (req, res) => {
  contador++;
  const { texto } = req.body;
  lembretes[contador] = {
    contador,
    texto,
  };
  await axios.post("http://localhost:10000/eventos", {
    tipo: "LembreteCriado",
    dados: {
      contador,
      texto,
    },
  });
  res.status(201).send(lembretes[contador]);
});
```

### Testando a emissão de eventos de inserção de lembretes

No Postman, faça o teste ilustrado na figura a seguir. Veja que ele ficará bloqueado até um *timeout* acontecer.

![Postman com um PUT em localhost:4000/lembretes, corpo JSON com o texto Ver um filme e a mensagem Sending request destacada](img/p044-1.webp)

*A requisição fica aguardando resposta.*

Isso é esperado já que o barramento de eventos, ao receber a requisição, faz novas requisições a todos os microsserviços, tentando repassar os eventos. Como nenhum deles tem o endpoint `/eventos` implementado, espera-se que a requisição não tenha sucesso. Ajustaremos isto em breve. Neste momento, é de se esperar que o terminal em que o barramento de eventos está em execução exiba uma mensagem parecida com aquela exibida na figura a seguir.

![Terminal do barramento de eventos exibindo UnhandledPromiseRejectionWarning com o erro Request failed with status code 404 destacado](img/p044-2.webp)

*O barramento de eventos não encontra o endpoint /eventos nos microsserviços (erro 404).*

### Emissão de eventos a partir do microsserviço de observações

De maneira análoga, faremos com que o microsserviço de observações emita um evento uma vez que uma nova observação seja criada. Ele também faz isso por meio de uma simples requisição HTTP POST enviada ao barramento de eventos. Veja o código a seguir.

**observacoes/index.js**

```javascript
...
const axios = require('axios');
...
app.put('/lembretes/:id/observacoes', async (req, res) => {
  const idObs = uuidv4();
  const { texto } = req.body;
  //req.params dá acesso à lista de parâmetros da URL
  const observacoesDoLembrete =
    observacoesPorLembreteId[req.params.id] || [];
  observacoesDoLembrete.push({ id: idObs, texto });
  observacoesPorLembreteId[req.params.id]
    = observacoesDoLembrete;
  await axios.post('http://localhost:10000/eventos', {
    tipo: "ObservacaoCriada",
    dados: {
      id: idObs, texto, lembreteId: req.params.id
    }
  })
  res.status(201).send(observacoesDoLembrete);
});
```

### Testando a emissão de eventos de inserção de observações

No Postman, execute também o teste ilustrado na figura a seguir. Embora a requisição seja enviada adequadamente, o barramento de eventos tentará enviar uma requisição no endpoint `/eventos` dos demais microsserviços e, como ele ainda não existe, o mesmo erro acontecerá.

![Postman com um PUT em localhost:5000/lembretes/3/observacoes, corpo JSON com o texto da observação e a mensagem Sending request destacada](img/p046-1.webp)

*Inserção de observação aguardando resposta.*

No terminal executando o barramento de eventos, o erro exibido deverá ser parecido com aquele exibido no teste anterior (código de status 404).

## Recebendo eventos
Duration: 8:00

### Recebendo eventos nos microsserviços de lembretes e de observações

Para cada microsserviço, a recepção de eventos é feita no endpoint `/eventos` usando o método POST. Sua implementação inicial é **idêntica** para ambos os microsserviços. Faça a implementação em ambos como mostra o código a seguir.

**lembretes/index.js e observacoes/index.js**

```javascript
//adicionar a ambos microsservicos de lembretes e observações
app.post("/eventos", (req, res) => {
  console.log(req.body);
  res.status(200).send({ msg: "ok" });
});
```

### Testes de inserção de lembretes e observações após implementação dos endpoints

Faça a inserção de um lembrete e, logo depois, a inserção de uma observação associada a ele, usando o Postman. O terminal executando cada um dos microsserviços (de lembretes e de observações) deverá exibir algo parecido com o seguinte.

**Terminal**

```text
{
  tipo: 'LembreteCriado',
  dados: { contador: 3, texto: 'Ver um filme' }
}
{
  tipo: 'ObservacaoCriada',
  dados: {
    id: 'd972b016-4286-495b-9feb-30ed9d2229fb',
    texto: 'Entre 4h e 8h',
    lembreteId: '3'
  }
}
```

## O microsserviço de consulta
Duration: 20:00

O microsserviço de consultas permite que clientes interessados obtenham uma cópia da coleção completa de lembretes, incluindo a lista de observações que cada um deles eventualmente possui. Para construir essa base de dados, ele recebe eventos do barramento de eventos. Veja a figura a seguir.

![Diagrama em que o cliente consulta o microsserviço de consulta, que recebe do barramento de eventos os eventos emitidos pelos microsserviços de lembretes e de observações](img/p047-2.webp)

*O microsserviço de consulta monta sua base a partir dos eventos recebidos.*

Para iniciar a sua implementação, crie uma nova pasta chamada `consulta`. A seguir, use

**Terminal (pasta consulta)**

```bash
npm init -y
```

para criar o projeto. As dependências podem ser instaladas como a seguir. O serviço de consulta não irá fazer requisições, ele apenas as recebe. Assim, não precisa do pacote axios.

**Terminal (pasta consulta)**

```bash
npm install express cors nodemon
```

Crie um arquivo chamado `index.js` na raiz da pasta `consulta`. Seu conteúdo inicial é dado a seguir.

**consulta/index.js**

```javascript
const express = require("express");
const app = express();
app.use(express.json());

app.get("/lembretes", (req, res) => {});

app.post("/eventos", (req, res) => {});

app.listen(6000, () => console.log("Consultas. Porta 6000"));
```

Abra o arquivo `package.json` do microsserviço de consulta e adicione o script `start`, como a seguir.

**consulta/package.json**

```json
{
  "name": "consulta",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "nodemon": "^2.0.7"
  },
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### A base de dados do microsserviço de consulta

A base de dados do microsserviço de consulta será um simples objeto JSON. Cada chave é o identificador de um lembrete, que fica associada a seu lembrete. Além disso, cada lembrete tem uma chave chamada `observacoes` associada a uma coleção em que cada objeto JSON é uma observação daquele lembrete. Veja um trecho de exemplo a seguir.

**Exemplo da base de consulta (trecho)**

```text
{
  "1": {
    "contador": 1,
    "texto": "Ver um filme",
    "observacoes": [
      {
        "id": "0aa13eb4-d988-4160-8a53-4f1d746a5f94",
        "texto": "Entre 4h e 8h",
        "lembreteId": "1"
      },
      {
        "id": "2d4635aa-6a73-4159-82b9-42ac5a4285ab",
        "texto": "Entre 4h e 9h também",
        "lembreteId": "1"
      }
    ]
  },
  "2": {
    "contador": 2,
    "texto": "Ver outro filme",
    "observacoes": [
    ...
```

Ela também será armazenada em memória volátil, para que possamos dar foco ao estudo da arquitetura baseada em microsserviços. Assim, faça a sua construção como a seguir.

**consulta/index.js**

```javascript
const express = require("express");
const app = express();
app.use(express.json());

const baseConsulta = {};
...
```

### Atualização da base do microsserviço de consulta

O microsserviço de consulta atualiza a base de acordo com o tipo do evento que recebe.

* **LembreteCriado** - Acessa a base usando o identificador do lembrete e associa a ele o objeto existente no campo `dados` do evento.
* **ObservacaoCriada** - Acessa a base usando o identificador do lembrete a que a observação criada está associada. A seguir, acessa o campo `observacoes` do lembrete (criando uma lista vazia caso ainda não exista) e adiciona o objeto existente no campo `dados` do evento à coleção.

As funções de tratamento de evento serão valores em um mapa (um objeto JSON) em que as chaves são os tipos dos respectivos eventos. Veja o código a seguir.

**consulta/index.js**

```javascript
...
const baseConsulta = {};

const funcoes = {
  LembreteCriado: (lembrete) => {
    baseConsulta[lembrete.contador] = lembrete;
  },
  ObservacaoCriada: (observacao) => {
    const observacoes =
      baseConsulta[observacao.lembreteId]["observacoes"] || [];
    observacoes.push(observacao);
    baseConsulta[observacao.lembreteId]["observacoes"] = observacoes;
  }
};
...
```

O endpoint para o qual eventos são enviados é implementado em função desse mapa: a função associada ao tipo do evento recebido é executada. Ela é alimentada com o objeto associado ao campo `dados` do evento. O endpoint de consulta simplesmente devolve a base inteira. Veja o código a seguir.

**consulta/index.js**

```javascript
const funcoes = {...};

app.get("/lembretes", (req, res) => {
  res.status(200).send(baseConsulta);
});

app.post("/eventos", (req, res) => {
  funcoes[req.body.tipo](req.body.dados);
  res.status(200).send(baseConsulta);
});
...
```

### Barramento de eventos direcionando eventos ao microsserviço de consulta

Lembre-se de atualizar o barramento de eventos para que ele emita eventos direcionados ao microsserviço de consulta, como mostra o código a seguir.

**barramento-de-eventos/index.js**

```javascript
...
app.post("/eventos", (req, res) => {
  const evento = req.body;
  //envia o evento para o microsserviço de lembretes
  axios.post("http://localhost:4000/eventos", evento);
  //envia o evento para o microsserviço de observações
  axios.post("http://localhost:5000/eventos", evento);
  //envia o evento para o microsserviço de consulta
  axios.post("http://localhost:6000/eventos", evento);
  res.status(200).send({ msg: "ok" });
});
...
```

### Testando o microsserviço de consulta

A fim de testar o microsserviço de consulta, crie uma nova pasta na coleção existente no Postman. A seguir, crie uma nova requisição como ilustra a figura a seguir.

![Postman com uma nova pasta consulta na coleção e uma requisição GET para localhost:6000/lembretes destacada](img/p052-1.webp)

*Requisição GET ao microsserviço de consulta.*

Para realizar os testes, faça o seguinte.

* Crie dois lembretes.
* Crie duas observações associadas a cada um dos lembretes.
* Encerre a execução de ambos os microsserviços de lembretes e observações.
* Faça uma nova requisição ao microsserviço de consulta.

## Encerramento da parte 1
Duration: 3:00

Parabéns! Você concluiu a parte 1. Até aqui você:

* estudou definições acadêmicas e de mercado para Arquitetura de Software;
* comparou a arquitetura monolítica com a arquitetura baseada em microsserviços;
* conheceu a comunicação síncrona e as formas de comunicação assíncrona entre microsserviços;
* implementou os microsserviços de **lembretes**, **observações** e **consulta** com Node.js e Express;
* implementou um **barramento de eventos** próprio, que faz *broadcast* de cada evento recebido.

### Próximo passo

Continue na **parte 2** (codelab `mss-microsservicos-parte-2`, *Microsserviços, parte 2: classificação, eventos perdidos e Docker*), em que você cria o microsserviço de classificação de observações, trata eventos perdidos, discute estratégias de implantação e coloca cada microsserviço em um contêiner Docker.

### Referências

1. L. Bass, P. Clements e R. Kazman. *Software Architecture in Practice*. 3ª ed. Addison-Wesley Professional, 2012.
2. Dahl, R. *Node.js*. Disponível em: [https://nodejs.org/en/](https://nodejs.org/en/). Acesso em abril de 2021.
3. A. Fox e D. Patterson. *Engineering Software as a Service - An Agile Approach Using Cloud Computing*. 1ª ed. Strawberry Canyon LLC, 2018.
4. Martin Fowler. *Who Needs an Architect?* Disponível em: [https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf](https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf). Acesso em fevereiro de 2021.
5. TJ Holowaychuk. *Express - Node.js web application framework*. Disponível em: [https://expressjs.com](https://expressjs.com). Acesso em abril de 2021.
