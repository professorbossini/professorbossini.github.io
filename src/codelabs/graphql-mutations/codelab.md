summary: Use mutations GraphQL para inserir pessoas, livros e comentários, gere ids com uuid, envie valores por variáveis (no Playground e no Postman) e agrupe parâmetros com o tipo input.
id: graphql-mutations
categories: GraphQL,Node.js,JavaScript
tags: graphql,node.js,javascript,mutation,uuid,variaveis,input,postman,playground
status: Published
authors: Rodrigo Bossini
last updated: 2022-10-17
pdf: graphql/04-apostila-mutations-graphql.pdf
exercicios: graphql/04-exercicios-mutations-graphql.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# GraphQL: mutations e o tipo input

## Visão geral
Duration: 3:00

Até então, estudamos a operação **query** do GraphQL. Outro tipo de operação GraphQL se chama **mutation**. Trata-se de uma operação que permite realizar as demais operações de um CRUD básico: inserção, atualização e remoção. Trataremos de seus detalhes neste material.

### O que você vai aprender

* Definir mutations e seus resolvers
* Enviar operações GraphQL pelo Playground e pelo Postman
* Usar variáveis (`$nomeVariavel`) em vez de valores fixos nas operações
* Gerar ids com o pacote `uuid`
* Validar dados relacionados e lançar erros em resolvers
* Agrupar parâmetros com o tipo `input`

### O que você vai precisar

* O projeto do codelab "GraphQL: relações entre tipos"
* Node.js, um editor de código e, opcionalmente, o Postman

## Projeto da aula anterior e o modelo
Duration: 4:00

Abra um terminal e navegue até o diretório do projeto. Use o comando a seguir para abri-lo no VS Code.

**Terminal**

```bash
code .
```

A seguir, coloque o servidor em execução com

**Terminal**

```bash
npm run start
```

Lembre-se que o script `start` está configurado para executar o nodemon, responsável pelo live reload feito quando atualizamos os arquivos da aplicação.

O modelo da aplicação que estamos utilizando é aquele exibido pela figura a seguir. Lembre-se que no projeto feito até então, as operações Query implementam os relacionamentos em modo bidirecional.

![Grafo com os vértices Pessoa (id, nome, idade), Livro (id, título, edicao) e Comentário (id, texto, nota), ligados pelas arestas livros, autor, comentários e livro](img/fig-2-2-1.webp)

*Figura 2.2.1: o modelo da aplicação.*

## Mutation para inserir pessoas
Duration: 12:00

Digamos que desejamos permitir que novas pessoas sejam inseridas no sistema. Essa é uma operação que altera dados no servidor. Para implementá-la utilizaremos uma operação **mutation**. Sua definição é similar à definição de query. Pessoas têm os campos nome (obrigatório) e idade (opcional), além de suas coleções de livros e comentários. Nome e idade (opcionalmente) serão enviados pelo cliente. Ao final, devolvemos o usuário criado.

**src/index.js · Listagem 2.3.1**

```javascript
const typeDefs = `
 type Pessoa {
   id: ID!
   nome: String!
   idade: Int
   livros: [Livro!]!
   comentarios: [Comentario!]!
 },
 type Livro {
   id: ID!
   titulo: String!
   edicao: Int!
   autor: Pessoa!
   comentarios: [Comentario!]!
 },
 type Comentario {
   id: ID!
   texto: String!
   nota: Int!
   livro: Livro!
   autor: Pessoa!
 },
 type Query {
   livros: [Livro!]!
   pessoas: [Pessoa!]!
   comentarios: [Comentario!]!
 }

 type Mutation{
   inserirPessoa (nome: String!, idade: Int): Pessoa!
 }
`;
```

Como ocorre com as queries, precisamos definir um resolver associado à mutation que acabamos de definir. Note que a mutation devolve uma pessoa. Por isso, precisamos especificar quais campos desejamos obter na resposta, assim como se faz com as queries. Veja o teste inicial a seguir. Não se preocupe com o erro que será gerado pela falta de retorno. Estamos preocupados somente com a saída no log neste momento.

**src/index.js · Listagem 2.3.2**

```javascript
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
    }
  },
  Mutation: {
    inserirPessoa (parent, args, ctx, info){
      console.log(args);
    }
  },
  //…demais definições já existentes estão aqui
};
```

Abra o Playground (em localhost:porta), especifique a operação mutation a seguir e clique em **Play**.

**GraphQL Playground · Listagem 2.3.3**

```graphql
mutation {
  inserirPessoa (nome:"Joao", idade:20){
    id
  }
}
```

Além dos erros exibidos (sobre o retorno do valor null não ser permitido) você deve ter visto algo como `{ nome: 'Joao', idade: 20 }`. Ou seja, os argumentos enviados se encontram no objeto `args`.

## Postman e variáveis
Duration: 10:00

<aside class="positive">

**Nota.** Pode ser interessante fazer as requisições usando um cliente como o **Postman**. Basta enviar uma requisição usando o método POST do protocolo HTTP (lembre-se que o conteúdo que especificamos na query, para qualquer operação GraphQL, é incluído no corpo da requisição, razão pela qual o método POST é utilizado). Veja o exemplo da figura a seguir. Pode ser interessante olhar a requisição HTTP gerada no console do Postman e, também, testar requisições utilizando outros métodos do protocolo HTTP.

</aside>

![Postman com uma requisição POST para localhost:4200, Body do tipo GraphQL com a query pessoas { nome } e o Console mostrando a requisição POST enviada](img/fig-2-3-1.webp)

*Figura 2.3.1: uma operação GraphQL enviada pelo Postman.*

### Variáveis

Note que os argumentos que estamos passando, até então, estão fixos nas operações (tanto query quanto mutation). Ocorre que aplicações, em geral, terão dados conhecidos somente em tempo de requisição (por exemplo, o usuário vai digitar o nome que deseja cadastrar somente quando a aplicação já estiver em execução) e assim seria necessário manipular a string de consulta no código da aplicação, algo obviamente inconveniente. Para resolver esse problema podemos utilizar a definição de **variáveis** (do lado do cliente) com `$nomeVariavel` e especificar um objeto JSON com os dados que substituirão as variáveis. Resumindo, precisamos:

1. Substituir o valor da variável na consulta por `$nomeVariavel`.
2. Declarar a variável como uma variável que a query aceita.
3. Especificar os valores a serem utilizados nas variáveis em um objeto à parte.

O exemplo a seguir (Figura 2.3.2) mostra como utilizar esse mecanismo com o Playground.

**GraphQL Playground · operação**

```graphql
mutation ($nome: String!, $idade:Int){
  inserirPessoa (nome: $nome, idade:$idade){
    nome
  }
}
```

**GraphQL Playground · QUERY VARIABLES**

```json
{
  "nome":"Ana",
  "idade": 17
}
```

O exemplo a seguir (Figura 2.3.3) mostra como fazer o mesmo usando o Postman (campos QUERY e GRAPHQL VARIABLES). Note que você pode definir um **nome diferente** para a operação se desejar.

**Postman · QUERY**

```graphql
mutation inserirPessoa ($nome: String!, $idade: Int){
    inserirPessoa (nome: $nome, idade: $idade){
        nome
    }
}
```

**Postman · GRAPHQL VARIABLES**

```json
{
    "nome": "Joao"
}
```

## Gerando ids com uuid
Duration: 8:00

Prosseguindo com a implementação da operação mutation que insere pessoas, o servidor precisa gerar um id para cada pessoa inserida. Para isso, usaremos um pacote chamado **uuid**. Ele pode ser instalado com

**Terminal**

```bash
npm install uuid@latest
```

Feita a instalação, é uma boa ideia reiniciar o servidor com

**Terminal**

```bash
npm run start
```

<aside class="positive">

**Nota.** O padrão UUID é descrito na RFC que pode ser encontrada em [https://www.ietf.org/rfc/rfc4122.txt](https://www.ietf.org/rfc/rfc4122.txt) (Link 2.3.1). A documentação do pacote uuid pode ser encontrada em [https://www.npmjs.com/package/uuid](https://www.npmjs.com/package/uuid) (Link 2.3.2).

</aside>

Note que há diferentes implementações baseadas em mecanismos diferentes. Vamos utilizar, por exemplo, a versão 4. A função `inserirPessoa` constrói um objeto pessoa com um id aleatório e os valores existentes em `args`. A seguir, insere o objeto na coleção de pessoas e devolve a pessoa criada. A importação fica no topo do arquivo; o resolver fica no objeto `Mutation`.

**src/index.js · Listagem 2.3.4 (trechos)**

```javascript
import { v4 as uuidv4 } from "uuid";
Mutation: {
    inserirPessoa (parent, args, ctx, info){
      const pessoa = {
        id: uuidv4(),
        nome: args.nome,
        idade: args.idade
      }
      pessoas.push(pessoa);
      return pessoa;
    }
  },
```

Para testar a funcionalidade, utilize o código a seguir no Playground ou no Postman.

**GraphQL Playground · Listagem 2.3.5**

```graphql
mutation {
  inserirPessoa (nome:" Joao", idade:17){
    id
    nome
    idade
  }
}
```

## Inserção de livros e comentários
Duration: 15:00

### Inserção de livros

A operação de inserção de livros é análoga:

* definimos a operação
* definimos o resolver associado
* testamos no Playground ou Postman

A definição da operação é dada a seguir.

**src/index.js · Listagem 2.4.1 (type Mutation)**

```graphql
type Mutation{
   inserirPessoa (nome: String!, idade: Int): Pessoa!
   inserirLivro (titulo: String!, edicao: Int!, autor: ID!): Livro!
 }
```

A seguir, definimos o resolver associado. Note que o id de autor enviado pelo cliente deve existir na base. O resolver se encarrega de fazer essa verificação e "lançar" um erro caso o id não exista.

**src/index.js · Listagem 2.4.2 (resolvers de Mutation)**

```javascript
Mutation: {
    inserirPessoa (parent, args, ctx, info){
      const pessoa = {
        id: uuidv4(),
        nome: args.nome,
        idade: args.idade
      }
      pessoas.push(pessoa);
      return pessoa;
    },
    inserirLivro (parent, args, ctx, info){
      const autorExiste = pessoas.some((pessoa) => pessoa.id === args.autor);
      if (!autorExiste){
        throw new Error ("Autor não existe")
      }
      const livro = {
        id: uuidv4(),
        titulo: args.titulo,
        edicao: args.edicao,
        autor: args.autor
      };
      livros.push(livro);
      return livro;
    }
  },
```

Os testes podem ser realizados com valores fixos na operação e também com valores especificados à parte da operação, como vimos anteriormente.

**GraphQL Playground · Listagem 2.4.3**

```graphql
mutation{
  inserirLivro(autor: "1", titulo:"Algorithms II", edicao:3){
    id
    titulo
  }
}
```

**GraphQL Playground · Listagem 2.4.4 (operação)**

```graphql
mutation ($titulo: String!, $edicao: Int!, $autor: ID!){
    inserirLivro (titulo: $titulo, edicao: $edicao, autor: $autor){
        id
        titulo
    }
}
```

**Listagem 2.4.4 (variáveis)**

```json
{
    "titulo": "Algorithms II",
    "edicao": 3,
    "autor": "1"
}
```

### Inserção de comentários

Façamos, também, a inserção de comentários. As listagens a seguir mostram a definição da operação, o resolver associado, o teste com valores fixos na operação e o teste com valores definidos à parte, respectivamente.

**src/index.js · Listagem 2.5.1 (type Mutation)**

```graphql
type Mutation{
   inserirPessoa (nome: String!, idade: Int): Pessoa!
   inserirLivro (titulo: String!, edicao: Int!, autor: ID!): Livro!
   inserirComentario (texto: String!, nota: Int!, livro: ID!, autor: ID!): Comentario!
 }
```

**src/index.js · Listagem 2.5.2 (resolver de Mutation)**

```javascript
//esse é um resolver do tipo Mutation
inserirComentario (parent, args, ctx, info){
      if (!pessoas.some((pessoa) => pessoa.id === args.autor) ||
          !livros.some((livro) => livro.id === args.livro)){
            throw new Error ('Autor e/ou Livro inexistente')
      }
      const comentario = {
        id: uuidv4(),
        texto: args.texto,
        nota: args.nota,
        livro: args.livro,
        autor: args.autor
      }
      comentarios.push(comentario);
      return comentario;

}
```

**GraphQL Playground · Listagem 2.5.3**

```graphql
mutation{
  inserirComentario(texto:"bom", nota: 5, livro:"101", autor:"1"){
    id
    texto
    livro{
      titulo
      autor{
        nome
      }
    }
  }
}
```

**GraphQL Playground · Listagem 2.5.4 (operação)**

```graphql
mutation ($texto:String!, $nota:Int!, $livro:ID!, $autor:ID!) {
  inserirComentario (texto: $texto, nota:$nota, livro:$livro, autor:$autor){
    id
    livro{
      titulo
      autor{
        nome
      }
    }
  }
}
```

**Listagem 2.5.4 (variáveis)**

```json
{"texto":"Bom", "nota": 5, "livro": "100", "autor": "1"}
```

## O tipo input
Duration: 15:00

Repare que as mutations possuem um número grande de parâmetros. Conforme essa lista cresce, a manutenção pode se tornar mais complicada. O tipo **input** nos permite agrupar todos os parâmetros de uma operação e, a seguir, especificar que ela recebe somente um parâmetro.

### InserirPessoaInput

Para utilizar o tipo input, começamos identificando uma operação cujos parâmetros desejamos agrupar. Vamos começar com a operação `inserirPessoa`. O primeiro passo é especificar um agrupamento input com os seus parâmetros.

**src/index.js · Listagem 2.6.1**

```javascript
const typeDefs = `
 type Pessoa {
   id: ID!
   nome: String!
   idade: Int
   livros: [Livro!]!
   comentarios: [Comentario!]!
 },
 type Livro {
   id: ID!
   titulo: String!
   edicao: Int!
   autor: Pessoa!
   comentarios: [Comentario!]!
 },
 type Comentario {
   id: ID!
   texto: String!
   nota: Int!
   livro: Livro!
   autor: Pessoa!
 },
 type Query {
   livros: [Livro!]!
   pessoas: [Pessoa!]!
   comentarios: [Comentario!]!
 }

 type Mutation{
   inserirPessoa (nome: String!, idade: Int): Pessoa!
   inserirLivro (titulo: String!, edicao: Int!, autor: ID!): Livro!
   inserirComentario (texto: String!, nota: Int!, livro: ID!, autor: ID!): Comentario!
 }

 input InserirPessoaInput {
   nome: String!
   idade: Int
 }
`;
```

A seguir, alteramos a lista de parâmetros da operação envolvida para que ela receba um único parâmetro do tipo `InserirPessoaInput`.

**src/index.js · Listagem 2.6.2 (type Mutation)**

```graphql
type Mutation{
   inserirPessoa (pessoa: InserirPessoaInput): Pessoa!
   inserirLivro (titulo: String!, edicao: Int!, autor: ID!): Livro!
   inserirComentario (texto: String!, nota: Int!, livro: ID!, autor: ID!): Comentario!
 }
```

<aside class="positive">

**Nota.** Definições do tipo input podem conter somente escalares.

</aside>

Como é de se esperar, também é preciso atualizar o resolver associado ao tipo alterado. Para isso, basta acessar o objeto chamado `pessoa` que será uma propriedade do objeto `args`. Ele será enviado pelo cliente.

**src/index.js · Listagem 2.6.3 (resolver inserirPessoa)**

```javascript
inserirPessoa (parent, args, ctx, info){
      const pessoa = {
        id: uuidv4(),
        nome: args.pessoa.nome,
        idade: args.pessoa.idade
      }
      pessoas.push(pessoa);
      return pessoa;
    },
```

O teste pode ser realizado como a seguir.

**GraphQL Playground · Listagem 2.6.4**

```graphql
mutation{
  inserirPessoa(pessoa:{
    nome:"Ellen",
    idade:18
  }){
    id
    nome
  }
}
```

### InserirLivroInput

O procedimento é análogo para a mutation `inserirLivro`. As listagens a seguir mostram as alterações na definição do tipo, no resolver e o teste, respectivamente.

**src/index.js · Listagem 2.6.5**

```graphql
type Mutation{
   inserirPessoa (pessoa: InserirPessoaInput): Pessoa!
   inserirLivro (livro: InserirLivroInput): Livro!
   inserirComentario (texto: String!, nota: Int!, livro: ID!, autor: ID!): Comentario!
 }

 input InserirLivroInput{
  titulo: String!
  edicao: Int!
  autor: ID!
 }
```

**src/index.js · Listagem 2.6.6 (resolver inserirLivro)**

```javascript
inserirLivro (parent, args, ctx, info){
      const autorExiste = pessoas.some(
        (pessoa) => pessoa.id === args.livro.autor
      );
      if (!autorExiste){
        throw new Error ("Autor não existe")
      }
      const livro = {
        id: uuidv4(),
        titulo: args.livro.titulo,
        edicao: args.livro.edicao,
        autor: args.livro.autor
      };
      livros.push(livro);
      return livro;
    },
```

**GraphQL Playground · Listagem 2.6.7**

```graphql
mutation{
  inserirLivro(livro:{
    titulo:"Algorithms III",
    edicao:1,
    autor:1
  }){
    id
  }
}
```

### InserirComentarioInput

As listagens a seguir mostram a adaptação para a inserção de comentários, bem como um teste.

**src/index.js · Listagem 2.6.8**

```graphql
type Mutation{
   inserirPessoa (pessoa: InserirPessoaInput): Pessoa!
   inserirLivro (livro: InserirLivroInput): Livro!
   inserirComentario (comentario: InserirComentarioInput): Comentario!
 }

 input InserirLivroInput{
  titulo: String!
  edicao: Int!
  autor: ID!
 }

 input InserirPessoaInput {
   nome: String!
   idade: Int
 }

 input InserirComentarioInput {
   texto: String!
   nota: Int!
   livro: ID!
   autor: ID!
 }
```

<aside class="positive">

**Nota.** Uma possível vantagem para a definição de elementos input é a possibilidade de reutilizá-los em outras operações. Por exemplo, uma aplicação pode receber 10 parâmetros tanto para fazer a inserção quanto para fazer a atualização de uma entidade qualquer. Sem input, eles teriam de ser digitados duas vezes.

</aside>

**src/index.js · Listagem 2.6.9 (resolver inserirComentario)**

```javascript
inserirComentario (parent, args, ctx, info){
      if (!pessoas.some((pessoa) => pessoa.id === args.comentario.autor) ||
        !livros.some((livro) => livro.id === args.comentario.livro)){
            throw new Error ('Autor e/ou Livro inexistente')
      }
      const comentario = {
        id: uuidv4(),
        texto: args.comentario.texto,
        nota: args.comentario.nota,
        livro: args.comentario.livro,
        autor: args.comentario.autor
      }
      comentarios.push(comentario);
      return comentario;

    }
```

**GraphQL Playground · Listagem 2.6.10**

```graphql
mutation{
  inserirComentario(comentario:{
    texto:"Bom",
    nota:5,
    livro:100,
    autor: 1
  }){
    id
    autor{
      nome
    }
  }
}
```

## Exercícios
Duration: 20:00

1. Crie mutations para a inserção de funcionários e setores. Utilize elementos do tipo input.

## Encerramento
Duration: 2:00

Você implementou mutations de inserção com ids gerados pelo uuid, validou dados relacionados, usou variáveis e agrupou parâmetros com input. No próximo codelab da série, o código é reorganizado em arquivos e as mutations de remoção entram em cena.

### Referências

* Babel · The compiler for next generation JavaScript. 2020. Disponível em [https://babeljs.io](https://babeljs.io). Acesso em agosto de 2020.
* GraphQL | A query language for your API. 2020. Disponível em [https://graphql.org](https://graphql.org). Acesso em agosto de 2020.
* Node.js. 2020. Disponível em [https://nodejs.org](https://nodejs.org). Acesso em agosto de 2020.
* WILSON, Jim R. *Node.js 8 the Right Way*. 1st edition. The Pragmatic Programmers, LLC, 2018.
