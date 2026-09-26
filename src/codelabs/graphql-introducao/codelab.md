summary: Entenda de onde vem o GraphQL (do conteúdo estático ao REST e suas limitações) e crie sua primeira API GraphQL com Node.js, Babel e GraphQL Yoga: queries, tipos escalares, tipos customizados e live reload com nodemon.
id: graphql-introducao
categories: GraphQL,Node.js,JavaScript
tags: graphql,node.js,javascript,babel,graphql yoga,rest,query,schema,resolvers,nodemon
status: Published
authors: Rodrigo Bossini
last updated: 2022-10-17
pdf: graphql/01-apostila-introducao-graphql.pdf
exercicios: graphql/01-exercicios-introducao-graphql.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# GraphQL: introdução e primeira API

## Visão geral
Duration: 3:00

Neste codelab você revê a evolução do desenvolvimento Web até a arquitetura REST, entende as limitações que motivaram o **GraphQL** e implementa sua primeira API GraphQL com **Node.js**.

### O que você vai aprender

* Conteúdo estático, CGI, Servlets e JSP
* Renderização do lado do cliente vs. do lado do servidor (SOFEA), Front End e Back End
* O que é REST e quais são as suas limitações
* O que é GraphQL: endpoint único, operações (query, mutation, subscription) e resolvers
* Configurar um projeto Node.js com Babel
* Criar um servidor com GraphQL Yoga, definir o schema (`typeDefs`) e os resolvers
* Usar os tipos escalares do GraphQL e definir tipos customizados
* Reiniciar o servidor automaticamente com o nodemon

### O que você vai precisar

* Node.js ([https://nodejs.org/en/](https://nodejs.org/en/))
* Um editor de código. Os exemplos usam o VS Code ([https://code.visualstudio.com](https://code.visualstudio.com))
* Um navegador

## Do conteúdo estático às JSPs
Duration: 6:00

Ao longo das últimas décadas, o desenvolvimento de aplicações Web evoluiu significativamente. Ainda nos anos 90, eram comuns as aplicações que somente ofereciam **conteúdo estático**. Ou seja, arquivos html, imagens etc. existentes previamente no servidor, antes mesmo de requisições serem realizadas. Veja a figura a seguir.

![Um navegador (cliente) faz uma requisição ao servidor, que responde com arquivos HTML pré-existentes, como real.html e golfo.html](img/fig-1-1.webp)

*Figura 1.1: conteúdo estático.*

A especificação **Common Gateway Interface (CGI)**, ainda nos anos 90, viabilizou a implementação de aplicações capazes de gerar conteúdo em tempo de requisição. Para isso, o desenvolvedor escreve código (comumente em PERL ou C/C++) que executa mediante requisições realizadas pelo cliente. Veja a figura a seguir.

![O servidor executa uma função em C, obter_noticias, que acessa a base de dados e escreve o HTML da resposta com fprintf](img/fig-1-2.webp)

*Figura 1.2: conteúdo gerado em tempo de requisição com CGI.*

Ainda nos anos 90, a linguagem Java passou a ser utilizada para o desenvolvimento de aplicações Web por meio da especificação de **Servlets**. Um Servlet é uma classe Java que possui métodos cuja execução ocorre mediante requisições realizadas por clientes. Assim como ocorre com a especificação CGI, também são capazes de produzir HTML em tempo de requisição, ou seja, conteúdo dinâmico. Graças à JVM, são aplicações facilmente portáveis.

Apesar disso, ficou evidente que escrever código HTML junto com código Java (ou qualquer outra linguagem de programação) é uma tarefa difícil e pouco produtiva. Em particular no caso da tecnologia Java, foi lançada a especificação **JSP & Servlets**. JSP é um mecanismo que visa simplificar essa tarefa: passa-se a escrever código Java em páginas HTML. Ao final, uma JSP é compilada e se torna um Servlet que gera código HTML. A vantagem é não ter de manter o código HTML dentro do código Java explicitamente. Veja a figura a seguir.

![Um Servlet obtém as notícias, as coloca na requisição e encaminha para uma JSP, que percorre a lista e gera o HTML devolvido ao cliente](img/fig-1-3.webp)

*Figura 1.3: JSP & Servlets.*

Eventualmente, ficou evidente que escrever código Java em páginas HTML era tão ruim quanto o oposto. Para lidar com esse problema, novas tecnologias foram desenvolvidas, como Expression Languages e a JSTL. Até os dias atuais as JSPs são utilizadas como opção para a camada de visualização.

## Renderização no cliente e REST
Duration: 8:00

### Renderização do lado do cliente vs. renderização do lado do servidor

Note que as especificações **CGI** e **JSP & Servlets** possuem algo em comum: o código HTML a ser exibido pelo cliente é gerado completamente do lado do servidor. Essa tarefa fica centralizada nele. Uma característica desta estratégia que pode ser indesejável é a sobrecarga de trabalho sob responsabilidade do servidor.

Nos dias de hoje, é comum o desenvolvimento de soluções em que a renderização (a geração do código HTML) ocorre do lado do cliente. Trata-se da aplicação da arquitetura **SOFEA – Service Oriented Front End Architecture**. Com isso, cabe ao servidor somente a execução das regras de negócio e a entrega dos resultados utilizando algum modelo de representação de dados (como XML ou JSON). Do lado do cliente, o navegador executa código JavaScript que gera ou atualiza o HTML a ser exibido para o usuário. Veja a figura a seguir.

![Desenvolvimento Full Stack: o servidor (Back End) devolve uma lista de notícias em JSON e o cliente (Front End) gera o HTML com um template que percorre as notícias](img/fig-1-4.webp)

*Figura 1.4: desenvolvimento Full Stack.*

Note que temos duas aplicações independentes. Em geral, aquela que executa do lado do cliente é chamada de **"Front End"**. A outra, do lado do servidor, se chama **"Back End"**. O desenvolvimento da solução como um todo muitas vezes leva o nome de **"Full Stack"**.

### REST

**REST** (*Representational State Transfer*) é uma arquitetura (uma coleção de princípios) utilizada para a integração de sistemas. Quando uma solução segue adequadamente os princípios REST, ela é chamada comumente de **Restful**.

Sistemas Restful lidam com a ideia de **recursos**. Um recurso pode ser uma página HTML, uma imagem, um arquivo de áudio. Cada recurso possui um identificador. Em um ambiente Web, é natural que o identificador de um recurso seja uma URL. Por exemplo, `http://mercedesbenz.com/carros` identifica a coleção de carros e `http://mercedesbenz.com/carros/1` identifica um carro específico (Figura 1.5 da apostila).

### Limitações da arquitetura REST

A integração entre serviços REST e clientes pode ser feita utilizando-se diferentes protocolos. Contudo, o protocolo **HTTP** é, certamente, o mais utilizado. Assim, um cliente interessado em obter recursos envia requisições GET, POST, PUT etc. para o serviço. Veja a figura a seguir.

![Um celular envia GET /carros/1 ao servidor e recebe um JSON com id, marca, ano, outros campos e foto, mas usa apenas a foto](img/fig-1-6.webp)

*Figura 1.6: o cliente recebe todos os dados do carro.*

Note que a aplicação cliente, aparentemente, precisa somente do nome da figura para eventualmente fazer uma nova requisição e baixá-la. O objeto JSON devolvido pelo servidor, contudo, possui todas as informações sobre o carro envolvido. Assim, há muitos dados sendo transportados desnecessariamente entre cliente e servidor.

Uma possível solução seria criar diferentes **endpoints**, cada qual associado a uma possível necessidade dos clientes. Veja o exemplo a seguir (Figura 1.7).

```text
GET /carros/1/foto
GET /carros/1/modelo
GET /carros/1/modelo-foto
```

Essa alternativa pode dar origem a uma **explosão de endpoints**, o que pode comprometer a **manutenabilidade** do sistema.

Outra alternativa seria projetar o serviço para que ele utilize parâmetros da requisição para identificar as necessidades do cliente. Veja o exemplo a seguir (Figura 1.8).

```text
GET /carros/1?dados=foto
GET /carros/1?foto=true&modelo=false
```

Note que essa alternativa também tende a comprometer a manutenabilidade do sistema, além de tornar a API mais difícil de entender.

Visite [https://openweathermap.org/forecast5](https://openweathermap.org/forecast5) (Link 1.1) para ver um exemplo de serviço REST. Inspecione a página e veja os exemplos de retorno do serviço.

## O que é GraphQL
Duration: 5:00

**GraphQL** (*Graph Query Language*) é uma linguagem de consulta utilizada para a implementação de APIs. Seu uso surge no contexto descrito, considerando as limitações da arquitetura REST. A ideia principal é permitir que o cliente especifique os dados que deseja receber do servidor sem que isso comprometa a manutenabilidade do sistema. GraphQL tem as seguintes características.

* Um **único endpoint** (algo como `POST /graphql`)
* O método POST é geralmente utilizado pois ele permite que o cliente especifique um corpo para a requisição, que inclui informações sobre o que o cliente deseja receber do servidor.

O exemplo a seguir (Figura 1.9) mostra uma consulta usando GraphQL.

```graphql
{
  query {
    carro {
      foto
      modelo
    }
  }
}
```

No exemplo, **query** é o tipo da operação. Há outros como **mutation** e **subscription**. **carro** é o endpoint desejado. **foto** e **modelo** são as propriedades desejadas para esta query.

A figura a seguir mostra a estrutura de uma aplicação que utiliza GraphQL. Perceba a existência das funções que recebem o nome de **resolvers**.

![O cliente envia POST /graphql ao servidor, onde as definições de Query, Mutation e Subscription são ligadas aos resolvers, que implementam as regras de negócio](img/fig-1-10.webp)

*Figura 1.10: estrutura de uma aplicação GraphQL.*

## Ambiente: Node.js, VS Code e Babel
Duration: 12:00

Utilizaremos o **Node.js** durante o desenvolvimento da aplicação que ilustra os principais conceitos de GraphQL. Ele pode ser instalado a partir de [https://nodejs.org/en/](https://nodejs.org/en/) (Link 2.1). Escolha o IDE de sua preferência. Os exemplos neste material usam o VS Code, que pode ser obtido em [https://code.visualstudio.com](https://code.visualstudio.com) (Link 2.2).

### Instalando extensões para o VS Code

As seguintes extensões podem ser úteis:

* **Babel ES6/ES7** – destaque de sintaxe ES6/ES7
* **Beautify** – ajuste de indentação
* **Docker** – utilizaremos no momento de implantação da aplicação
* **Duplicate Action** – para duplicar arquivos e pastas
* **GraphQL For VS Code** – destaque de sintaxe, "linting" entre outras coisas para GraphQL
* **npm** e **npm intellisense** – autocompleta código em módulos npm

### Diretório para o projeto

Crie um diretório para o projeto. No VS Code, clique **File >> Open Folder** para abrir a pasta como um projeto. A seguir, no VS Code, crie uma nova pasta chamada `graphql-introducao`.

### Instalação e configuração do Babel

**Babel** é um compilador JavaScript. Ele permite o desenvolvimento de código usando recursos de especificações recentes do JavaScript e o compila para versões com as quais os navegadores são capazes de lidar. Veja seu site oficial em [https://babeljs.io/](https://babeljs.io/) (Link 2.3.1).

Para fazer a sua instalação, começamos criando um novo projeto node. Abra um novo terminal vinculado ao diretório `graphql-introducao` e execute o seguinte comando

**Terminal**

```bash
npm init
```

O Node Package Manager irá fazer algumas perguntas sobre o projeto que está sendo criado. Aperte Enter em todas elas para manter os valores padrão.

Use o comando a seguir para fazer a instalação do Babel CLI e do pacote que permite alterar configurações sobre seu funcionamento.

**Terminal**

```bash
npm install babel-cli@latest babel-preset-env@latest
```

A seguir, crie um arquivo chamado `.babelrc` na pasta `graphql-introducao`. Ele conterá um objeto JSON com configurações sobre o funcionamento do Babel.

**.babelrc · Listagem 2.3.1**

```json
{
  "presets": [
    "env"
  ]
}
```

A seguir, crie uma pasta chamada `src` na pasta `graphql-introducao`. Dentro dela, crie um arquivo chamado `index.js`. Escreva nele um pequeno teste.

**src/index.js · Listagem 2.3.2**

```javascript
console.log("Olá, GraphQL")
```

Abra o arquivo `package.json` para criar um novo script. Indicaremos que o arquivo `index.js` deve ser executado pelo Babel.

**package.json · Listagem 2.3.3**

```json
{
  "name": "graphql-introducao",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "babel-node src/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "babel-cli": "^6.26.0",
    "babel-preset-env": "^1.7.0"
  }
}
```

Use o comando a seguir para testar o seu ambiente

**Terminal**

```bash
npm run start
```

## Primeira API GraphQL
Duration: 12:00

### Obtendo uma implementação de GraphQL

GraphQL é uma **especificação**. Para utilizá-la, precisamos obter uma implementação. Há implementações para Android, Spring, Node etc. Para fazer a instalação própria para o nosso ambiente, use o comando

**Terminal**

```bash
npm i @graphql-yoga/node graphql
```

### Definindo uma API GraphQL

Abra o arquivo `index.js` e importe a função `createServer`. Ela permitirá que coloquemos um servidor em execução.

**src/index.js · Listagem 2.5.1**

```javascript
import { createServer } from '@graphql-yoga/node'
```

A seguir, precisamos definir os tipos com os quais lidaremos na aplicação. Essa definição é chamada de **schema** na nomenclatura oficial. Definimos uma query chamada `hello` que devolve `String`.

**src/index.js · Listagem 2.5.2**

```javascript
const typeDefs = `
  type Query {
    hello: String
  }
`;
```

<aside class="positive">

**Nota.** Caso deseje garantir que uma String é sempre devolvida (e não null), adicione um ponto de exclamação ao tipo da query, como a seguir.

```javascript
const typeDefs = `
  type Query {
    hello: String!
  }
`;
```

</aside>

A seguir precisamos definir uma coleção de **resolvers**. Cada resolver é um objeto do tipo apropriado que contém uma função para lidar com uma query definida anteriormente. No momento, desejamos definir uma Query chamada `hello` que devolve uma String.

**src/index.js · Listagem 2.5.4**

```javascript
import { createServer } from '@graphql-yoga/node'

const typeDefs = `
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello() {
      return "Minha primeira API GraphQL!";
    },
  },
};
```

Agora podemos colocar um servidor apropriado em execução, que será construído pela função `createServer`. Sua construção é simples: ele é configurado com um objeto JSON que contém as definições de tipos e resolvers e colocado em execução com o método `start`. A função `start` pode receber uma função como parâmetro que será executada assim que o servidor "subir".

**src/index.js · Listagem 2.5.5**

```javascript
import { createServer } from '@graphql-yoga/node'
const typeDefs = `
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello() {
      return "Minha primeira API GraphQL!";
    },
  },
};

const server = createServer ({
  schema: {
    typeDefs,
    resolvers
  }
})

server.start(() => {
  'Servidor no ar...'
})
```

Execute o seguinte comando para colocar a aplicação em execução

**Terminal**

```bash
npm run start
```

Abra um navegador e acesse [http://localhost:4000/graphql](http://localhost:4000/graphql) (Link 2.5.1). Ele dará acesso ao que chamamos de **GraphQL Playground**. Trata-se de um ambiente que permite que testemos nossa API.

No playground, do lado esquerdo, digite o conteúdo a seguir. Especificamos o tipo da operação (query, neste caso) e a consulta a ser realizada (`hello`). Aperte o botão play para ver o resultado.

**GraphQL Playground · Listagem 2.5.6**

```graphql
query {
  hello
}
```

Para definir uma nova operação, o processo é análogo. Definimos um novo tipo e associamos um resolver a ele.

**src/index.js · Listagem 2.5.7**

```javascript
const typeDefs = `
  type Query {
    hello: String!
    name: String!
  }
`;

const resolvers = {
  Query: {
    hello() {
      return "Minha primeira API GraphQL!";
    },
    name() {
      return "Um nome aqui";
    },
  },
};
```

Para poder utilizar a nova consulta, precisamos parar o servidor. Execute-o novamente e use o código a seguir para utilizá-la.

**GraphQL Playground · Listagem 2.5.8**

```graphql
query {
  hello
  name
}
```

## Tipos escalares e live reload
Duration: 10:00

### Tipos de dados escalares GraphQL

Os tipos de dados pré-definidos na especificação GraphQL são os seguintes:

* `String`
* `Boolean`
* `Int`
* `Float`
* `ID` (uma espécie de string usada para identificar exclusivamente um elemento)

Vamos testar cada um deles definindo novas queries. O procedimento é o mesmo: definição de tipo e, então, definição de um resolver associado. Veja as definições de tipo.

**src/index.js · Listagem 2.5.9**

```javascript
const typeDefs = `
  type Query {
    hello: String!
    name: String!
    id: ID!
    location: String!
    age: Int!
    ofAge: Boolean!
    salary: Float
  }
`;
```

A seguir, definimos os resolvers.

**src/index.js · Listagem 2.5.10**

```javascript
const resolvers = {
  Query: {
    id() {
      return "umachave";
    },
    location() {
      return "SP";
    },
    age() {
      return 29;
    },
    ofAge() {
      return true;
    },
    salary() {
      return null; // corpo pode ficar vazio também
    },
    hello() {
      return "Minha primeira API GraphQL!";
    },
    name() {
      return "Um nome aqui";
    },
  },
};
```

Reinicie o servidor e teste cada nova query.

**GraphQL Playground · Listagem 2.5.11**

```graphql
query {
  hello
  name
  id
  location
  age
  ofAge
  salary
}
```

### Live Reload

Reiniciar o servidor a cada alteração do código pode ser contraproducente. Vamos instalar um pacote que se encarrega de reiniciar o servidor automaticamente a cada vez que um arquivo do projeto for alterado. Para instalar, use o seguinte comando

**Terminal**

```bash
npm install nodemon@latest --save-dev
```

A seguir, alteramos o script `start` para que o nodemon passe a ser utilizado. Usando o parâmetro `exec`, especificamos que o arquivo `index.js` deve ser executado pelo Babel e não pelo Node, que seria o padrão.

**package.json · Listagem 2.6.1**

```json
{
  "name": "graphql-introducao",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "nodemon src/index.js --exec babel-node",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "babel-cli": "^6.26.0",
    "babel-preset-env": "^1.7.0",
    "graphql-yoga": "^1.18.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.4"
  }
}
```

<aside class="positive">

Repare que a listagem da apostila mostra a dependência `graphql-yoga`. Se você instalou `@graphql-yoga/node` e `graphql` como indicado anteriormente, são essas as dependências que aparecerão no seu `package.json`; altere apenas o script `start`.

</aside>

## Tipos customizados
Duration: 10:00

Note que estamos utilizando somente tipos escalares, o que dá origem a uma gigantesca coleção de endpoints. É comum definir tipos de dados próprios para o domínio do problema em que se está trabalhando.

Para definir um novo tipo de dado, também usamos a palavra reservada `type`. Veja a definição de um tipo que representa livros.

**src/index.js · Listagem 2.7.1**

```javascript
const typeDefs = `
  type Livro {
    id: ID!
    titulo: String!
    genero: String!
    edicao: Int,
    preco: Float
  }
`;
```

A seguir, definimos uma Query que devolve um livro.

**src/index.js · Listagem 2.7.2**

```javascript
const typeDefs = `
  type Livro {
    id: ID!
    titulo: String!
    genero: String!
    edicao: Int,
    preco: Float
  },
  type Query {
    effectiveJava: Livro!
  }
`;
```

Vinculada à Query, temos uma função que implementa um resolver.

**src/index.js · Listagem 2.7.3**

```javascript
const resolvers = {
  Query: {
    effectiveJava() {
      return {
        id: '123456',
        titulo: 'Effective Java',
        genero: 'Técnico',
        edicao: 3,
        preco: 43.9
      }
    }
  }
};
```

Para testar, lembre-se de colocar o servidor em execução (se ele não estiver) com

**Terminal**

```bash
npm run start
```

Acesse o seu navegador para fazer uma consulta, como a seguir.

**GraphQL Playground · Listagem 2.7.4**

```graphql
query{
  effectiveJava{
    id
    titulo
    preco
  }
}
```

Faça um teste, tentando devolver `null` como valor de um campo que não admite esse valor.

**src/index.js · Listagem 2.7.5**

```javascript
const resolvers = {
  Query: {
    effectiveJava() {
      return {
        id: '123456',
        titulo: null,
        genero: 'Técnico',
        edicao: 3,
        preco: 43.9
      }
    }
  }
};
```

Você deverá ver um erro parecido com o que exibe a resposta a seguir (Figura 2.7.1).

**Resposta no GraphQL Playground**

```json
{
  "data": null,
  "errors": [
    {
      "message": "Cannot return null for non-nullable field Livro.titulo.",
      "locations": [
        {
          "line": 4,
          "column": 5
        }
      ],
      "path": [
        "effectiveJava",
        "titulo"
      ]
    }
  ]
}
```

## Exercícios
Duration: 15:00

1. Crie um tipo de dado para representar **pessoas**. Pessoas têm id, nome, idade, e-mail, endereço e telefone. Crie uma nova Query com nome `maria`. Escreva um resolver que devolva um objeto do tipo pessoa com dados fixos.

## Encerramento
Duration: 2:00

Você criou uma API GraphQL com schema, resolvers, tipos escalares e um tipo customizado. No próximo codelab da série, você vai trabalhar com argumentos e coleções.

### Referências

* Babel · The compiler for next generation JavaScript. 2020. Disponível em [https://babeljs.io](https://babeljs.io). Acesso em agosto de 2020.
* Node.js. 2020. Disponível em [https://nodejs.org](https://nodejs.org). Acesso em agosto de 2020.
* WILSON, Jim R. *Node.js 8 the Right Way*. 1st edition. The Pragmatic Programmers, LLC, 2018.
