summary: Evolua sua API GraphQL em Node.js para receber argumentos, trabalhar com coleções nos dois sentidos (servidor para cliente e cliente para servidor), filtrar resultados e modelar relações entre tipos.
id: graphql-argumentos-colecoes-relacoes
categories: GraphQL,Node.js,JavaScript
tags: graphql,node.js,javascript,argumentos,colecoes,relacoes,resolvers,parent,args,context,info
status: Published
authors: Rodrigo Bossini
last updated: 2022-10-17
pdf: graphql/02-apostila-introducao-graphql.pdf
exercicios: graphql/02-exercicios-introducao-graphql.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# GraphQL: argumentos, coleções e relações

## Visão geral
Duration: 3:00

Clientes de APIs GraphQL podem enviar **argumentos** com o intuito, por exemplo, de fazer cadastros, filtros etc. Além disso, também é possível lidar com **coleções** e especificar **relações** entre itens de interesse. Neste material, estudaremos estes três itens.

### O que você vai aprender

* Declarar argumentos em queries e usá-los nos resolvers
* Os quatro parâmetros recebidos por todo resolver: `parent`, `args`, `ctx` e `info`
* Devolver coleções de escalares e de tipos customizados
* Receber coleções enviadas pelo cliente
* Filtrar resultados com argumentos
* Modelar uma relação entre tipos (usuários que possuem livros)

### O que você vai precisar

* O projeto do codelab anterior ("GraphQL: introdução e primeira API")
* Node.js e um editor de código

## Projeto da aula anterior
Duration: 3:00

Abra o projeto da aula anterior para prosseguir com os testes deste material. Ele pode ser obtido em [https://github.com/professorbossini/maua_20202_graphql](https://github.com/professorbossini/maua_20202_graphql) (Link 2.1.1).

Para colocá-lo em execução, abra um terminal e use

**Terminal**

```bash
npm run start
```

## Hello, argumentos
Duration: 12:00

Começamos especificando uma nova query a fim de ilustrar o uso de **argumentos**. Ela devolve uma única String (de boas-vindas) incluindo um nome recebido como argumento. Para defini-la, usamos o operador parênteses. Note que o argumento pode ser opcional. Contudo, devemos especificar o tipo de dado esperado.

**src/index.js · Listagem 2.2.1**

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
    bemVindo (nome: String) : String!
    effectiveJava: Livro!
  }
`;
```

A seguir, definimos o seu resolver associado.

**src/index.js · Listagem 2.2.2**

```javascript
const resolvers = {
  Query: {
    bemVindo() {
      return "Bem vindo!"
    },

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

No Playground (localhost:porta) você pode testar o novo endpoint com a query a seguir.

**GraphQL Playground · Listagem 2.2.3**

```graphql
query{
  bemVindo
}
```

Note, contudo, que não estamos utilizando o argumento `nome` especificado. Para tal, podemos ajustar a consulta como a seguir.

**GraphQL Playground · Listagem 2.2.4**

```graphql
query{
  bemVindo (nome: "Maria")
}
```

### Os quatro parâmetros dos resolvers

Agora é necessário ajustar o resolver para que ele faça uso do argumento passado. Há quatro argumentos que são passados para todos os resolvers.

* **parent**: permite obter o objeto possuidor dos dados envolvidos (um usuário que possui muitos livros, por exemplo)
* **args**: contém os argumentos passados (é esse que vamos usar agora)
* **ctx** (de *context*): contém dados como o id de um usuário logado, por exemplo
* **info**: informações sobre o que foi enviado ao servidor (veremos em breve)

Faça o ajuste a seguir para verificar o que cada um deles é.

**src/index.js · Listagem 2.2.5**

```javascript
const resolvers = {
  Query: {
    bemVindo(parent, args, ctx, info) {
      console.log("parent: " + JSON.stringify(parent));
      console.log("args: " + JSON.stringify(args));
      console.log(ctx);
      console.log("info: " + JSON.stringify(info));
      return "Bem vindo!"
    },

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

Para testar, execute a query novamente no Playground e verifique a saída no console.

Desta forma, podemos acessar o argumento enviado como uma propriedade de `args`. Veja o trecho a seguir, que substitui o resolver `bemVindo`.

**src/index.js · Listagem 2.2.6 (resolver bemVindo)**

```javascript
bemVindo(parent, args, ctx, info) {
  return `
    Bem vindo ${args.nome ? args.nome : 'visitante'}
  `;
},
```

Faça testes enviando e deixando de enviar o argumento `nome`.

## Coleções do servidor para o cliente
Duration: 8:00

Pode ser necessário enviar **coleções** do cliente para o servidor ou vice-versa. Com GraphQL, podemos usar coleções de escalares e também de tipos customizados.

Começamos definindo uma nova query que devolve uma coleção (obrigatória, mesmo que vazia). Especificamos, inclusive, o tipo contido na coleção. Definimos uma query para uma coleção de notas.

**src/index.js · Listagem 2.3.1**

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
    notas: [Int!]!
    bemVindo (nome: String) : String!
    effectiveJava: Livro!
  }
`;
```

A seguir, como de costume, definimos um resolver que entrará em execução quando o cliente executar essa query.

**src/index.js · Listagem 2.3.2**

```javascript
const resolvers = {
  Query: {
    notas(parent, args, ctx, info) {
      return [10, 2, 7, 7, 8]
    },
    bemVindo(parent, args, ctx, info) {
      return `
        Bem vindo ${args.nome ? args.nome : 'visitante'}
      `;
    },

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

Para testar, execute a query a seguir no Playground.

**GraphQL Playground · Listagem 2.3.3**

```graphql
query{
  notas
}
```

## Coleções do cliente para o servidor
Duration: 8:00

Para ilustrar o envio de coleções do cliente para o servidor, vamos escrever um endpoint que soma uma quantidade arbitrária de valores. Começamos especificando a query.

**src/index.js · Listagem 2.3.4**

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
    adicionar (numeros: [Float!]!): Float!
    notas: [Int!]!
    bemVindo (nome: String) : String!
    effectiveJava: Livro!
  }
`;
```

O resolver é exibido a seguir.

**src/index.js · Listagem 2.3.5**

```javascript
const resolvers = {
  Query: {
    adicionar(parent, args, ctx, info) {
      return args.numeros.length === 0 ? 0 :
        args.numeros.reduce((ac, atual) => {
          return ac + atual;
        })
    },
    notas(parent, args, ctx, info) {
      return [10, 2, 7, 7, 8]
    },
    bemVindo(parent, args, ctx, info) {
      return `
        Bem vindo ${args.nome ? args.nome : 'visitante'}
      `;
    },

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

Para testar, execute a query a seguir no Playground.

**GraphQL Playground · Listagem 2.3.6**

```graphql
query{
  adicionar(numeros:[1, 2])
}
```

## Coleções de tipos customizados e filtros
Duration: 12:00

Também podemos lidar com coleções de tipos que nós mesmos definimos, como o tipo `Livro`. Para devolver uma coleção de livros, começamos definindo a query a seguir.

**src/index.js · Listagem 2.3.7**

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
    livros: [Livro!]!
    adicionar (numeros: [Float!]!): Float!
    notas: [Int!]!
    bemVindo (nome: String) : String!
    effectiveJava: Livro!
  }
`;
```

A seguir, no começo do arquivo, fora do escopo de qualquer outra definição, defina um vetor de livros fictício.

**src/index.js · Listagem 2.3.8**

```javascript
const livros = [
  {
    id: '1',
    titulo: 'Effective Java',
    genero: "Técnico",
    edicao: 3,
    preco: 39.99
  },
  {
    id: '2',
    titulo: "Concrete Mathematics",
    genero: "Técnico",
    edicao: 1,
    preco: 89.99
  }
];
```

O próximo passo é especificar um resolver condizente com a query especificada. Ele deve se chamar `livros` e devolver uma coleção de livros, como prometido.

**src/index.js · Listagem 2.3.9**

```javascript
const resolvers = {
  Query: {

    livros (parent, args, ctx, info) {
      return livros;
    },
    adicionar(parent, args, ctx, info) {
      return args.numeros.length === 0 ? 0 :
        args.numeros.reduce((ac, atual) => {
          return ac + atual;
        })
    },
    notas(parent, args, ctx, info) {
      return [10, 2, 7, 7, 8]
    },
    bemVindo(parent, args, ctx, info) {
      return `
        Bem vindo ${args.nome ? args.nome : 'visitante'}
      `;
    },

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

A listagem a seguir mostra como testar no Playground. Note que estamos buscando uma coleção de livros e cada um deles é composto por várias partes. Precisamos especificar explicitamente as partes de interesse.

**GraphQL Playground · Listagem 2.3.10**

```graphql
query{
  livros {
    id,
    edicao,
    titulo
  }
}
```

### Filtrando com um argumento

Podemos utilizar um argumento para **filtrar** o que é devolvido. Por exemplo, podemos especificar que somente desejamos os livros cujo preço seja menor ou igual a um valor específico. Para isso, ajuste a query como a seguir.

**src/index.js · Listagem 2.3.11 (type Query)**

```graphql
type Query {

    livros (precoMaximo: Float!): [Livro!]!
    adicionar (numeros: [Float!]!): Float!
    notas: [Int!]!
    bemVindo (nome: String) : String!
    effectiveJava: Livro!
  }
```

A seguir, use a função `filter` no resolver.

**src/index.js · Listagem 2.3.12 (resolver livros)**

```javascript
livros(parent, args, ctx, info) {
  return livros.filter((l) => {
    return l.preco <= args.precoMaximo
  });
},
```

Para testar, precisamos especificar o valor máximo desejado no Playground.

**GraphQL Playground · Listagem 2.3.13**

```graphql
query{
  livros (precoMaximo:40) {
    id,
    edicao,
    titulo
  }
}
```

## Relações
Duration: 12:00

É muito comum que existam **relações** entre tipos que definimos. Por exemplo, podemos dizer que um usuário é dono de muitos livros. Nesta seção veremos como GraphQL permite que lidemos com relações.

Começamos definindo um novo tipo para representar pessoas.

**src/index.js · Listagem 2.4.1**

```javascript
const typeDefs = `

  type Usuario{
    id: ID!,
    nome: String!,
    idade: Int!,
    livros: [Livro!]
  },
  type Livro {
    id: ID!
    titulo: String!
    genero: String!
    edicao: Int,
    preco: Float
  },
  type Query {

    livros (precoMaximo: Float!): [Livro!]!
    adicionar (numeros: [Float!]!): Float!
    notas: [Int!]!
    bemVindo (nome: String) : String!
    effectiveJava: Livro!
  }
`;
```

A seguir, vamos definir uma coleção de usuários. Cada usuário, por sua vez, terá uma coleção de livros. A definição é feita fora de qualquer função, tal qual fizemos com a coleção de livros.

**src/index.js · Listagem 2.4.2**

```javascript
const usuarios = [{
  id: '100',
  nome: 'Jose',
  livros: [{
      id: '1',
      titulo: 'Effective Java',
      genero: "Técnico",
      edicao: 3,
      preco: 39.99
    },
    {
      id: '2',
      titulo: "Concrete Mathematics",
      genero: "Técnico",
      edicao: 1,
      preco: 89.99
    }
  ]
}, {
  id: '101',
  nome: 'Maria',
  livros: [{
    id: '5',
    titulo: 'Programming Challenges',
    genero: "Técnico",
    edicao: 1,
    preco: 39.99
  }]
}]
```

A nova query que dá acesso aos usuários é exibida a seguir.

**src/index.js · Listagem 2.4.3**

```javascript
const typeDefs = `

  type Usuario{
    id: ID!,
    nome: String!,
    idade: Int!,
    livros: [Livro!]
  },
  type Livro {
    id: ID!
    titulo: String!
    genero: String!
    edicao: Int,
    preco: Float
  },
  type Query {
    usuarios: [Usuario!]!
    livros (precoMaximo: Float!): [Livro!]!
    adicionar (numeros: [Float!]!): Float!
    notas: [Int!]!
    bemVindo (nome: String) : String!
    effectiveJava: Livro!
  }
`;
```

O resolver associado simplesmente devolve a coleção de usuários.

**src/index.js · Listagem 2.4.4**

```javascript
const resolvers = {
  Query: {

    usuarios() {
      return usuarios;
    },
    livros(parent, args, ctx, info) {
      return livros.filter((l) => {
        return l.preco <= args.precoMaximo
      });
    },
    adicionar(parent, args, ctx, info) {
      return args.numeros.length === 0 ? 0 :
        args.numeros.reduce((ac, atual) => {
          return ac + atual;
        })
    },
    notas(parent, args, ctx, info) {
      return [10, 2, 7, 7, 8]
    },
    bemVindo(parent, args, ctx, info) {
      return `
        Bem vindo ${args.nome ? args.nome : 'visitante'}
      `;
    },

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

Para testar no Playground, precisamos especificar a query `usuarios` e, a seguir, especificar que desejamos os livros de cada usuário. Note que é necessário especificar cada propriedade desejada dos livros.

**GraphQL Playground · Listagem 2.4.5**

```graphql
query{
  usuarios{
    nome
    livros{
      id,
      titulo
    }
  }
}
```

## Exercícios
Duration: 20:00

1. Crie queries/resolvers para fazer as quatro operações aritméticas básicas envolvendo dois argumentos enviados pelo cliente.
2. Crie um endpoint que recebe uma coleção de valores numéricos e a devolve ordenada.

## Encerramento
Duration: 2:00

Você usou argumentos, coleções, filtros e relações em uma API GraphQL. No próximo codelab da série, as relações passam a ser resolvidas por resolvers próprios de cada tipo.

### Referências

* Babel · The compiler for next generation JavaScript. 2020. Disponível em [https://babeljs.io](https://babeljs.io). Acesso em agosto de 2020.
* Node.js. 2020. Disponível em [https://nodejs.org](https://nodejs.org). Acesso em agosto de 2020.
* WILSON, Jim R. *Node.js 8 the Right Way*. 1st edition. The Pragmatic Programmers, LLC, 2018.
