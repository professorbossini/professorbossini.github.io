summary: Complete o CRUD da sua API GraphQL com mutations de atualização para pessoas, livros e comentários, usando novos tipos input com campos opcionais e Object.assign nos resolvers.
id: graphql-atualizacao
categories: GraphQL,Node.js,JavaScript
tags: graphql,node.js,javascript,mutation,atualizacao,input,object.assign,crud,postman
status: Published
authors: Rodrigo Bossini
last updated: 2022-10-17
pdf: graphql/06-01-apostila-mutations-graphql.pdf
exercicios: graphql/06-01-exercicios-mutations-graphql.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# GraphQL: mutations de atualização

## Visão geral
Duration: 2:00

A operação **mutation** do GraphQL permite realizar as demais operações de um CRUD básico: inserção, atualização e remoção. Já fizemos inserções e remoções; neste material, implementamos as **atualizações**, completando o CRUD.

### O que você vai aprender

* Definir mutations de atualização com novos tipos `input` de campos opcionais
* Implementar os resolvers com `Object.assign` e desestruturação de parâmetros
* Testar as atualizações com valores fixos e com variáveis

### O que você vai precisar

* O projeto do codelab "GraphQL: mutations de remoção e organização do projeto"
* Node.js, um editor de código e, opcionalmente, o Postman

## Projeto da aula anterior e o modelo
Duration: 3:00

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

## Definindo as mutations de atualização
Duration: 8:00

É possível que seja de interesse realizar operações de **atualização** de dados, o que irá completar a nossa implementação de um CRUD básico. Isso também pode ser feito por meio da especificação de mutations.

Começamos especificando as operações no arquivo `schema.graphql`. Teremos uma operação para cada tipo existente. Note que, além de especificar o id do "item" a ser atualizado, precisamos especificar os dados que desejamos atualizar. Para agrupá-los, definiremos novos objetos do tipo **input**. Não podemos reutilizar os já existentes pois eles possuem campos obrigatórios e, para o caso de atualizações, não necessariamente o usuário irá querer envolvê-los.

**src/schema.graphql · Listagem 2.3.1 (trecho)**

```graphql
type Mutation {
  inserirPessoa(pessoa: InserirPessoaInput!): Pessoa!
  removerPessoa(id: ID!): Pessoa!
  atualizarPessoa (id: ID!, pessoa: AtualizarPessoaInput!): Pessoa!
  inserirLivro(livro: InserirLivroInput!): Livro!
  removerLivro(id: ID!): Livro!
  atualizarLivro (id: ID!, livro: AtualizarLivroInput!): Livro!
  inserirComentario(comentario: InserirComentarioInput!): Comentario!
  removerComentario(id: ID!): Comentario!
  atualizarComentario(id: ID!, comentario: AtualizarComentarioInput!): Comentario!
}

input InserirPessoaInput {
  nome: String!
  idade: Int
}

input AtualizarPessoaInput {
  nome: String
  idade: Int
}

input InserirLivroInput {
  titulo: String!
  edicao: Int!
  autor: ID!
}

input AtualizarLivroInput {
  titulo: String
  edicao: Int
}

input InserirComentarioInput {
  texto: String!
  nota: Int!
  livro: ID!
  autor: ID!
}

input AtualizarComentarioInput {
  texto: String
  nota: Int
}
```

## Os resolvers de atualização
Duration: 10:00

A seguir, implementamos os resolvers para cada operação no arquivo `Mutation.js`. Suas implementações são semelhantes àquelas referentes à inserção e remoção de dados. Repare que o terceiro parâmetro (o contexto) pode ser desestruturado diretamente na assinatura (`{db}`), assim como `args` (`{id, livro}`).

**src/resolvers/Mutation.js · Listagem 2.3.2 (trecho)**

```text
...
},

  atualizarPessoa (parent, args, {db}, info){

    const pessoa = db.pessoas.find((p) => p.id === args.id);

    if (!pessoa)
      throw new Error ("Pessoa não existe");

    Object.assign(pessoa, { nome: args.pessoa.nome || pessoa.nome, idade: args.pessoa.idade || pessoa.idade});
    return pessoa;
  },

  inserirLivro(parent, args, ctx, info) {...
```

**src/resolvers/Mutation.js · Listagem 2.3.3 (trecho)**

```text
...
,
  atualizarLivro (parent, {id, livro}, ctx, info){
    const {db} = ctx;
    const livroExistente = db.livros.find (l => l.id === id);
    if (!livroExistente)
      throw new Error ("Livro não existe")
    Object.assign(livroExistente, { titulo: livro.titulo || livroExistente.titulo, edicao: livro.edicao || livroExistente.edicao});
    return livroExistente;
  },
  inserirComentario(parent, args, ctx, info) {...
```

**src/resolvers/Mutation.js · Listagem 2.3.4 (final do arquivo)**

```text
…
,
  atualizarComentario (parent, {id, comentario}, {db}, info){
    const comentarioExistente = db.comentarios.find (l => l.id === id);
    if (!comentarioExistente)
      throw new Error ("Comentario não existe")
    Object.assign (comentarioExistente, {
      texto: comentario.texto || comentarioExistente.texto,
      nota: comentario.nota || comentarioExistente.nota
    });
    return comentarioExistente;

  }
}
export default Mutation;
```

<aside class="positive">

`Object.assign(alvo, origem)` copia as propriedades de `origem` para o objeto `alvo`, alterando-o no lugar. Como o objeto encontrado com `find` é o mesmo que está na coleção, a coleção já fica atualizada. O operador `||` mantém o valor antigo quando o cliente não envia um campo.

</aside>

## Testando as atualizações
Duration: 10:00

Para verificar se as operações de atualização de dados estão funcionando adequadamente, faça uma query e dê uma olhada em cada coleção. A seguir, faça a atualização de alguns campos de um item de cada coleção usando uma mutation e execute a query novamente. Uma query que você pode executar é dada a seguir.

<aside class="positive">

**Nota.** Lembre-se que você pode usar qualquer cliente HTTP para realizar os testes, como o Postman: requisição POST para o endereço do servidor, com Body do tipo GraphQL.

</aside>

**GraphQL Playground ou Postman · Listagem 2.3.5**

```graphql
query {
    pessoas{
        id
        nome
        idade
    }
    comentarios {
        id
        texto
        nota
    }
    livros{
        id
        titulo
        edicao
    }

}
```

A listagem a seguir mostra alguns exemplos de mutations que você pode utilizar para atualizar dados nas coleções.

**GraphQL Playground ou Postman · Listagem 2.3.6**

```graphql
mutation {
    atualizarPessoa (id: "1", pessoa: {
        nome: "Sedgewick",
        idade: 22
    }){
        id
        nome
        idade
    }
    atualizarLivro (id: "100", livro: {
        titulo: "Algorithms II",
        edicao: 2
    }){
        id
        titulo
        edicao
    }
    atualizarComentario (id: "1001", comentario: {
        texto: "Muito bom mesmo",
        nota: 5
    }){
        id
        texto
        nota
    }
}
```

Lembre-se de executar novamente as queries para verificar o resultado nas coleções.

### Com variáveis

Também é possível realizar testes utilizando variáveis, de modo que os valores a serem utilizados não fiquem fixos nas operações GraphQL. Veja um exemplo a seguir.

**Listagem 2.3.7 (operação)**

```graphql
mutation ($id: ID!, $nome: String!, $idade: Int){
    atualizarPessoa (id: $id, pessoa: {
        nome: $nome,
        idade: $idade
    }){
        id
        nome
        idade
    }
}
```

**Listagem 2.3.7 (variáveis)**

```json
{
    "id": "1",
    "nome": "Novo nome...",
    "idade": 50
}
```

Caso necessário, a figura a seguir mostra como realizar essa mutation no Postman. O procedimento é análogo no Playground.

![Postman com requisição POST para localhost:4200, Body GraphQL com a mutation atualizarPessoa no campo QUERY e o objeto de variáveis no campo GRAPHQL VARIABLES](img/fig-2-3-2.webp)

*Figura 2.3.2: a mutation com variáveis no Postman.*

## Exercícios
Duration: 20:00

1. Conclua a definição de mutations para a sua aplicação, incluindo a operação de atualização.

## Encerramento
Duration: 2:00

Com as atualizações, sua API GraphQL tem um CRUD completo. No próximo codelab da série, você vai conhecer as **subscriptions**, que permitem ao servidor enviar dados ao cliente em tempo real.

### Referências

* Babel · The compiler for next generation JavaScript. 2020. Disponível em [https://babeljs.io](https://babeljs.io). Acesso em agosto de 2020.
* GraphQL | A query language for your API. 2020. Disponível em [https://graphql.org](https://graphql.org). Acesso em agosto de 2020.
* Node.js. 2020. Disponível em [https://nodejs.org](https://nodejs.org). Acesso em agosto de 2020.
* WILSON, Jim R. *Node.js 8 the Right Way*. 1st edition. The Pragmatic Programmers, LLC, 2018.
