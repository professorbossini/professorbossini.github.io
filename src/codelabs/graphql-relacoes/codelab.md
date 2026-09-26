summary: Modele relações entre tipos customizados em uma API GraphQL com Node.js: pessoas, livros e comentários, com resolvers de tipo que usam o parâmetro parent para navegar nos dois sentidos de cada relação.
id: graphql-relacoes
categories: GraphQL,Node.js,JavaScript
tags: graphql,node.js,javascript,relacoes,resolvers,parent,grafo,graphql yoga,babel
status: Published
authors: Rodrigo Bossini
last updated: 2022-10-17
pdf: graphql/03-apostila-introducao-graphql.pdf
exercicios: graphql/03-exercicios-introducao-graphql.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# GraphQL: relações entre tipos

## Visão geral
Duration: 3:00

Neste material estudamos mais detalhes sobre **relações** entre tipos de dados customizados.

### O que você vai aprender

* Criar um novo projeto Node.js com Babel, nodemon e GraphQL Yoga
* Representar um modelo de dados como um grafo de relações
* Escrever resolvers de tipo (`Livro`, `Pessoa`, `Comentario`) que usam o parâmetro `parent`
* Implementar os dois lados de cada relação: livro e autor, livro e comentários, pessoa e comentários

### O que você vai precisar

* Node.js e um editor de código
* Os conceitos dos codelabs anteriores da série (schema, resolvers, argumentos e coleções)

## Novo projeto
Duration: 10:00

Começamos criando um novo projeto. Crie uma nova pasta no seu workspace. A seguir, use o seguinte comando para criar um projeto com o NPM. Mantenha todos os valores padrão.

**Terminal**

```bash
npm init
```

A seguir, instale o Babel com

**Terminal**

```bash
npm install babel-cli@latest babel-preset-env@latest
```

A seguir, criamos um arquivo chamado `.babelrc` na raiz do projeto a fim de configurar o uso do babel/preset-env. Veja o que a documentação diz sobre ele:

> "@babel/preset-env is a smart preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms (and optionally, browser polyfills) are needed by your target environment(s). This both makes your life easier and JavaScript bundles smaller!"

> **Polyfill**
>
> Um trecho de código (possivelmente em JavaScript) usado para que navegadores antigos tenham acesso a funcionalidades de especificações recentes.

O conteúdo do arquivo `.babelrc` é dado a seguir.

**.babelrc · Listagem 2.1.1**

```json
{
  "presets": [
    "env"
  ]
}
```

A seguir, vamos criar uma pasta chamada `src` e, dentro dela, um arquivo chamado `index.js`.

Lembre-se que pode ser interessante instalar um pacote para que não seja necessário reiniciar o servidor a cada alteração realizada. Uma boa opção é o nodemon. Ele pode ser instalado assim:

**Terminal**

```bash
npm install nodemon@latest --save-dev
```

Abra o arquivo `package.json` (ele foi criado com o comando `npm init` e descreve as dependências do projeto, entre outras coisas). Adicione um script chamado `start`, como a seguir.

**package.json · Listagem 2.1.2**

```json
{
  "name": "graphql-relacoes",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon src/index.js --exec babel-node"
  },
  "author": "",
  "license": "ISC"
}
```

<aside class="negative">

Na apostila, a linha do script `start` termina com uma vírgula. Em JSON, não pode haver vírgula depois do último item de um objeto: remova-a, como na listagem acima, ou o npm não conseguirá ler o arquivo.

</aside>

A instalação de uma implementação de GraphQL pode ser feita com

**Terminal**

```bash
npm i @graphql-yoga/node graphql
```

No arquivo `index.js`, adicione o conteúdo a seguir a fim de colocar um servidor em execução.

**src/index.js · Listagem 2.1.3**

```javascript
import { createServer } from '@graphql-yoga/node'

const typeDefs = `

`;

const resolvers = {
  Query: {

  }
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

<aside class="positive">

**Nota.** Como a lista de definições de tipos está vazia, ainda não podemos colocar o servidor em execução.

</aside>

## O modelo de dados
Duration: 5:00

Matematicamente, uma **relação** é uma coleção de pares ordenados. Em particular, uma relação pode ser exibida graficamente por um **grafo**. Um grafo é definido em função de dois conjuntos: seus vértices e suas arestas. Um par ordenado é representado por uma aresta que liga dois vértices que fazem parte do par. Uma coleção de pares ordenados é representada por um grafo direcionado, já que a existência do par ordenado $(a, b)$ na relação não implica a existência do par $(b, a)$.

O modelo de dados que utilizaremos pode ser descrito textualmente da seguinte forma:

> Pessoas publicam livros. Quando isso ocorre, elas assumem o papel "autor". Um livro é publicado por um autor. Cada livro pode ter a ele associada uma coleção de comentários que são realizados por pessoas, que podem ou não ser autoras.

O grafo da figura a seguir mostra essa relação.

![Grafo com os vértices Pessoa (id, nome, idade), Livro (id, título, edicao) e Comentário (id, texto, nota), ligados pelas arestas livros e autor entre Pessoa e Livro, comentários e livro entre Livro e Comentário, e comentários e autor entre Pessoa e Comentário](img/fig-2-2-1.webp)

*Figura 2.2.1: o grafo das relações entre Pessoa, Livro e Comentário.*

## Tipos de dados e dados fictícios
Duration: 8:00

Utilizaremos a string `typeDefs` para fazer a definição dos três tipos de dados envolvidos no modelo da aplicação. A princípio deixaremos de lado as relações.

**src/index.js · Listagem 2.3.1**

```javascript
import {
  GraphQLServer
} from "graphql-yoga";

const typeDefs = `
 type Pessoa {
   id: ID!
   nome: String!
   idade: Int
 }
 type Livro {
   id: ID!
   titulo: String!
   edicao: Int!
 }

 type Comentario {
   id: ID!
   texto: String!
   nota: Int!
 }
`;

const resolvers = {
  Query: {

  }
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

<aside class="negative">

A listagem da apostila importa `GraphQLServer` de `"graphql-yoga"`, mas o servidor é criado com `createServer`. Mantenha a importação da Listagem 2.1.3: `import { createServer } from '@graphql-yoga/node'`.

</aside>

A listagem a seguir mostra a definição de dados fictícios, feita fora de qualquer função.

**src/index.js · Listagem 2.3.2**

```javascript
const pessoas = [{
    id: '1',
    nome: 'Cormen',
    idade: 19
  },
  {
    id: '2',
    nome: 'Velleman',
    idade: 22
  }
]

const livros = [{
    id: '100',
    titulo: 'Introduction to Algorithms',
    edicao: 3
  },
  {
    id: '101',
    titulo: 'How to Prove it',
    edicao: 2
  }
]
```

A fim de especificar o autor de cada livro, adicionamos um novo campo ao tipo livro. O valor associado a esse campo será o id do seu autor.

**src/index.js · Listagem 2.3.3**

```javascript
const pessoas = [{
    id: '1',
    nome: 'Cormen',
    idade: 19
  },
  {
    id: '2',
    nome: 'Velleman'
  }
]

const livros = [{
    id: '100',
    titulo: 'Introduction to Algorithms',
    edicao: 3,
    autor: '1'
  },
  {
    id: '101',
    titulo: 'How to Prove it',
    edicao: 2,
    autor: '2'
  }
]
```

No schema, especificamos a propriedade `autor` para os livros.

**src/index.js · Listagem 2.3.4**

```javascript
const typeDefs = `
 type Pessoa {
   id: ID!
   nome: String!
   idade: Int
 },
 type Livro {
   id: ID!
   titulo: String!
   edicao: Int!
   autor: Pessoa!
 },

 type Comentario {
   id: ID!
   texto: String!
   nota: Int!
 }
`;
```

A seguir, definimos uma Query e seu resolver associado. Neste momento, ainda não lidamos diretamente com o relacionamento.

**src/index.js · Listagem 2.3.5**

```javascript
const typeDefs = `
 type Pessoa {
   id: ID!
   nome: String!
   idade: Int
 },
 type Livro {
   id: ID!
   titulo: String!
   edicao: Int!
 },

 type Comentario {
   id: ID!
   texto: String!
   nota: Int!
 },
 type Query {
   livros: [Livro!]!
 }
`;

const resolvers = {
  Query: {
    livros() {
      return livros;
    }
  }
};
```

Visite o playground em `localhost:4000/graphql` e faça o teste a seguir.

**GraphQL Playground · Listagem 2.3.6**

```graphql
query {
  livros{
    id
  }
}
```

## Livro e autor: os dois lados
Duration: 15:00

### O autor de um livro

Para permitir a busca por dados relacionados, definiremos uma nova propriedade no JSON de resolvers. Seu tipo é o mesmo do dado envolvido, neste caso `Livro`. A seguir, definimos uma função capaz de explicar como se dá a recuperação de dados relacionados. Neste exemplo, há um único dado relacionado identificado pela propriedade `autor`. Vamos escrever uma função com esse nome. Neste exemplo, utilizaremos o parâmetro `parent` da função. Antes de concluir a implementação, faça o teste a seguir.

**src/index.js · Listagem 2.3.7**

```javascript
const resolvers = {
  Query: {
    livros() {
      return livros;
    }
  },
  Livro: {
    autor(parent, args, ctx, info) {
      console.log("parent: " + JSON.stringify(parent));
    }
  }
};
```

Para que a função `autor` seja executada, devemos especificá-la explicitamente no Playground.

**GraphQL Playground · Listagem 2.3.8**

```graphql
query {
  livros{
    id,
    autor{
      nome
    }
  }
}
```

O console deve mostrar algo parecido com

**Terminal (saída)**

```text
parent: {"id":"100","titulo":"Introduction to Algorithms","edicao":3,"autor":1}
```

Ou seja, o livro do qual essa pessoa é autora. No playground, um erro deverá aparecer, já que o resolver ainda não devolve coisa alguma.

Com essa informação em mãos, podemos concluir a recuperação dos dados. A função `autor` será chamada uma vez para cada livro existente na coleção de livros. Para cada livro, devemos buscar a pessoa cujo id é igual ao valor existente na propriedade `autor` do livro.

**src/index.js · Listagem 2.3.9**

```javascript
const resolvers = {
  Query: {
    livros() {
      return livros;
    }
  },
  Livro: {
    autor(parent, args, ctx, info) {
      return pessoas.find((pessoa) => {
        return pessoa.id === parent.autor
      })
    }
  }
};
```

Para mais um teste, execute a consulta a seguir no playground.

**GraphQL Playground · Listagem 2.3.10**

```graphql
query {
  livros{
    id,
    autor{
      nome,
      idade
    }
  }
}
```

### Os livros de uma pessoa

O relacionamento na direção contrária (que indica quais são os livros de um determinado autor) é feito de maneira análoga. O primeiro passo é definir uma nova propriedade no tipo `Pessoa`. Ela faz referência a uma coleção de livros.

**src/index.js · Listagem 2.3.11**

```javascript
const typeDefs = `
 type Pessoa {
   id: ID!
   nome: String!
   idade: Int
   livros: [Livro!]!
 },
 type Livro {
   id: ID!
   titulo: String!
   edicao: Int!
   autor: Pessoa!
 },

 type Comentario {
   id: ID!
   texto: String!
   nota: Int!
 },
 type Query {
   livros: [Livro!]!
 }
`;
```

A seguir, adicionamos uma nova propriedade no objeto de resolvers chamada `Pessoa`. Sua finalidade é permitir que especifiquemos funções que serão executadas para resolver os dados relacionados de uma pessoa. Neste caso, precisamos especificar como se dá a busca de livros.

**src/index.js · Listagem 2.3.12**

```javascript
const resolvers = {
  Query: {
    livros() {
      return livros;
    }
  },
  Livro: {
    autor(parent, args, ctx, info) {
      return pessoas.find((pessoa) => {
        return pessoa.id === parent.autor
      })
    }
  },
  Pessoa: {
    livros(parent, args, ctx, info) {
      return livros.filter((livro) => {
        return livro.autor === parent.id
      })
    }
  }
};
```

Para testar, vamos especificar uma nova Query no schema e, a seguir, um resolver associado.

**src/index.js · Listagem 2.3.13**

```javascript
const typeDefs = `
 type Pessoa {
   id: ID!
   nome: String!
   idade: Int
   livros: [Livro!]!
 },
 type Livro {
   id: ID!
   titulo: String!
   edicao: Int!
   autor: Pessoa!
 },

 type Comentario {
   id: ID!
   texto: String!
   nota: Int!
 },
 type Query {
   livros: [Livro!]!
   pessoas: [Pessoa!]!
 }
`;
```

**src/index.js · Listagem 2.3.14**

```javascript
const resolvers = {
  Query: {
    livros() {
      return livros;
    },
    pessoas (){
      return pessoas;
    }
  },
  Livro: {
    autor(parent, args, ctx, info) {
      return pessoas.find((pessoa) => {
        return pessoa.id === parent.autor
      })
    }
  },
  Pessoa: {
    livros(parent, args, ctx, info) {
      return livros.filter((livro) => {
        return livro.autor === parent.id
      })
    }
  }
};
```

Use o código a seguir para testar no playground.

**GraphQL Playground · Listagem 2.3.15**

```graphql
query {
  pessoas{
    nome
    livros{
      titulo
    }
  }
}
```

## Livro e comentários
Duration: 15:00

A implementação dos relacionamentos existentes entre `Livro` e `Comentario` é análoga. Vamos começar definindo uma coleção fictícia de comentários.

**src/index.js · Listagem 2.3.16**

```javascript
const comentarios = [
  {
    id: "1001",
    texto: "excelente",
    nota: 5,
    livro: "101",
  },
  {
    id: "1002",
    texto: "Gostei muito",
    nota: 5,
    livro: "101",
  },
  {
    id: "1003",
    texto: "Bacana",
    nota: 4,
    livro: "100",
  },
];
```

Também devemos adicionar uma propriedade com o nome `livro` na definição do tipo `Comentario`.

**src/index.js · Listagem 2.3.17 (type Comentario)**

```graphql
type Comentario {
   id: ID!
   texto: String!
   nota: Int!
   livro: Livro!
 },
```

No objeto em que definimos os resolvers, criamos uma nova propriedade chamada `Comentario`. Assim, podemos definir uma função que explica como se dá a busca pelo livro de um determinado comentário.

**src/index.js · Listagem 2.3.18**

```javascript
const resolvers = {
  Query: {
    livros() {
      return livros;
    },
    pessoas() {
      return pessoas;
    },
  },
  Livro: {
    autor(parent, args, ctx, info) {
      return pessoas.find((pessoa) => {
        return pessoa.id === parent.autor;
      });
    },
  },
  Pessoa: {
    livros(parent, args, ctx, info) {
      return livros.filter((livro) => {
        return livro.autor === parent.id;
      });
    },
  },
  Comentario: {
    livro(parent, args, ctx, info) {
      return livros.find((livro) => {
        return livro.id === parent.livro;
      });
    },
  },
};
```

Para viabilizar o uso da nova estrutura, precisamos definir uma nova Query chamada `comentarios` bem como seu resolver associado.

**src/index.js · Listagem 2.3.19 (trechos)**

```text
type Query {
   livros: [Livro!]!
   pessoas: [Pessoa!]!
   comentarios: [Comentario!]!
 }

…

const resolvers = {
  Query: {
    livros() {
      return livros;
    },
    pessoas() {
      return pessoas;
    },
    comentarios() {
      return comentarios;
    },
  },
```

O código a seguir permite testar a nova query.

**GraphQL Playground · Listagem 2.3.20**

```graphql
query {
  comentarios {
    id
    texto
    nota
    livro{
      titulo
    }
  }
}
```

### Os comentários de um livro

Também podemos incluir os comentários de cada livro na busca por livros já existente. Para começar, na definição do tipo `Livro`, precisamos especificar uma propriedade chamada `comentarios`.

**src/index.js · Listagem 2.3.21 (type Livro)**

```graphql
type Livro {
   id: ID!
   titulo: String!
   edicao: Int!
   autor: Pessoa!
   comentarios: [Comentario!]!
 }
```

Na definição de `Livro` já existente no objeto que armazena os resolvers, adicionamos uma nova função com o nome `comentarios`. Ela explica como se dá a busca pelos comentários de um determinado livro.

**src/index.js · Listagem 2.3.22 (resolvers de Livro)**

```javascript
Livro: {
    autor(parent, args, ctx, info) {
      return pessoas.find((pessoa) => {
        return pessoa.id === parent.autor;
      });
    },
    comentarios(parent, args, ctx, info) {
      return comentarios.filter((comentario) => {
        return comentario.livro === parent.id
      })
    }
  },
```

Teste com a query a seguir.

**GraphQL Playground · Listagem 2.3.23**

```graphql
query {
  livros {
    titulo
    comentarios{
      texto
      nota
    }
  }
}
```

## Pessoa e comentários
Duration: 12:00

Vamos também implementar os dois lados do relacionamento existente entre `Pessoa` e `Comentario`. Começamos adaptando a coleção de comentários para que cada um deles tenha o id de seu autor. Por simplicidade, atribuímos todos os comentários existentes a uma única pessoa. Observe que os valores associados à propriedade `autor` devem ser strings.

**src/index.js · Listagem 2.3.24**

```javascript
const comentarios = [{
    id: "1001",
    texto: "excelente",
    nota: 5,
    livro: "101",
    autor: '1'
  },
  {
    id: "1002",
    texto: "Gostei muito",
    nota: 5,
    livro: "101",
    autor: '1'

  },
  {
    id: "1003",
    texto: "Bacana",
    nota: 4,
    livro: "100",
    autor: '1'
  },
];
```

Na definição do tipo `Comentario`, adicionamos o campo `autor`. Seu tipo é `Pessoa`.

**src/index.js · Listagem 2.3.25 (type Comentario)**

```graphql
type Comentario {
   id: ID!
   texto: String!
   nota: Int!
   livro: Livro!
   autor: Pessoa!
 },
```

No objeto de resolvers, na especificação de `Comentario`, precisamos de uma função que explica a busca do autor de um determinado comentário.

**src/index.js · Listagem 2.3.26 (resolvers de Comentario)**

```javascript
Comentario: {
    livro(parent, args, ctx, info) {
      return livros.find((livro) => {
        return livro.id === parent.livro;
      });
    },
    autor(parent, args, ctx, info) {
      return pessoas.find((pessoa) => {
        return pessoa.id === parent.autor
      })
    }
  },
```

A query a seguir pode ser usada no Playground para testar.

**GraphQL Playground · Listagem 2.3.27**

```graphql
query {
  comentarios {
    texto
    autor {
      nome
    }
    livro{
      titulo
    }
  }
}
```

### Os comentários de uma pessoa

Dada uma pessoa, pode ser de interesse encontrar todos os seus comentários. Ou seja, pode ser interessante implementar o outro lado da relação entre `Pessoa` e `Comentario`. O primeiro passo para isso é adicionar uma propriedade chamada `comentarios` na definição do tipo `Pessoa`.

**src/index.js · Listagem 2.3.28 (type Pessoa)**

```graphql
type Pessoa {
   id: ID!
   nome: String!
   idade: Int
   livros: [Livro!]!
   comentarios: [Comentario!]!
 },
```

No objeto de resolvers, na definição de `Pessoa`, definimos uma função que diz como se faz a busca pelos comentários de uma pessoa.

**src/index.js · Listagem 2.3.29 (resolvers de Pessoa)**

```javascript
Pessoa: {
    livros(parent, args, ctx, info) {
      return livros.filter((livro) => {
        return livro.autor === parent.id;
      });
    },
    comentarios(parent, args, ctx, info) {
      return comentarios.filter((comentario) => {
        return comentario.autor === parent.id
      })
    }
  },
```

A nova funcionalidade pode ser testada com a query a seguir.

**GraphQL Playground · Listagem 2.3.30**

```graphql
query {
  pessoas{
    nome
    comentarios{
      texto
      livro {
        titulo
      }
    }
  }
}
```

## Exercícios
Duration: 25:00

1. Crie queries/resolvers para o seguinte modelo de dados.
   * Funcionários têm nome e idade.
   * Setores têm tipo e descrição.
   * Um funcionário se associa a, no máximo, um setor.
   * Em um setor, trabalham diversos funcionários.

## Encerramento
Duration: 2:00

Você implementou todas as relações do grafo Pessoa, Livro e Comentário com resolvers de tipo. No próximo codelab da série, a API passa a alterar dados com **mutations**.

### Referências

* Babel · The compiler for next generation JavaScript. 2020. Disponível em [https://babeljs.io](https://babeljs.io). Acesso em agosto de 2020.
* GraphQL | A query language for your API. 2020. Disponível em [https://graphql.org](https://graphql.org). Acesso em agosto de 2020.
* Node.js. 2020. Disponível em [https://nodejs.org](https://nodejs.org). Acesso em agosto de 2020.
* WILSON, Jim R. *Node.js 8 the Right Way*. 1st edition. The Pragmatic Programmers, LLC, 2018.
