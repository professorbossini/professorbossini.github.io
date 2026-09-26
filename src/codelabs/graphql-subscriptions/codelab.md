summary: Entenda server polling, push notifications e publish-subscribe e implemente subscriptions GraphQL com createPubSub do GraphQL Yoga: um dado lançado a cada dois segundos e notificações de inserção, atualização e remoção de livros e comentários.
id: graphql-subscriptions
categories: GraphQL,Node.js,JavaScript
tags: graphql,node.js,javascript,subscription,pubsub,publish-subscribe,websockets,push,graphql yoga
status: Published
authors: Rodrigo Bossini
last updated: 2022-10-17
pdf: graphql/07-01-apostila-subscriptions-graphql.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# GraphQL: subscriptions

## Visão geral
Duration: 3:00

A especificação GraphQL define três tipos de operações: **queries**, **mutations** e **subscriptions**. Neste material estudaremos a última, subscriptions. Como veremos, trata-se de uma operação que permite a clientes que se registrem como interessados em modificações realizadas no servidor. Quando elas ocorrerem, clientes registrados são notificados automaticamente pelo servidor.

Este codelab reúne as duas partes da apostila de subscriptions: a parte 1 (`graphql/07-01-apostila-subscriptions-graphql.pdf`), com o conceito, o primeiro teste e a subscription de comentários, e a parte 2 (`graphql/07-02-apostila-subscriptions-graphql.pdf`), com as subscriptions de livros e os payloads com o tipo da operação.

### O que você vai aprender

* A diferença entre server polling e push notifications
* O padrão publish-subscribe
* Definir o tipo `Subscription` no schema e seus resolvers com a função `subscribe`
* Usar `createPubSub` do GraphQL Yoga e compartilhar o `pubSub` pelo context
* Publicar eventos nas mutations e filtrar notificações por id
* Enviar o tipo da operação (inserção, remoção, atualização) junto com os dados, em um payload

### O que você vai precisar

* O projeto do codelab "GraphQL: mutations de atualização"
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

## Polling, push e publish-subscribe
Duration: 6:00

Digamos que temos um cliente que deseja manter-se atualizado sobre uma determinada coleção existente no servidor. Utilizando **queries**, ele precisa fazer requisições de tempos em tempos para verificar se houve alguma alteração. Trata-se de um mecanismo conhecido como **server polling**. A figura a seguir ilustra o mecanismo de checagem contínua com queries.

<aside class="positive">

**Nota.** Uma possível tradução para *poll* é "checagem contínua".

</aside>

![Ao longo do tempo, o cliente pergunta repetidamente ao servidor se a coleção de pessoas sofreu alguma alteração; o servidor responde "Ainda não" várias vezes até responder "Agora sim. Segue uma cópia"](img/fig-2-3-1.webp)

*Figura 2.3.1: server polling com queries.*

As operações do tipo **subscription** da especificação GraphQL permitem que o cliente mantenha-se atualizado por meio de notificações enviadas pelo servidor. Ele entra em contato com o servidor uma única vez e o informa que está interessado em ficar sabendo de atualizações envolvendo uma ou mais coleções sempre que elas ocorrerem. O servidor mantém uma conexão aberta com o cliente (via **WebSockets**, uma conexão *full duplex*, com comunicação de ambos os lados e simultânea, sobre TCP; para saber mais, veja a RFC 6455) e, quando uma atualização acontece, o servidor se encarrega de avisar o cliente por meio do envio de uma notificação. Trata-se do modelo conhecido como **push notifications**. Veja a figura a seguir.

![O cliente informa uma única vez que está interessado em atualizações na coleção de pessoas; o servidor responde "Tá bom" e, a cada atualização, envia "Ei! Aconteceu uma atualização! Segue uma cópia"](img/fig-2-3-2.webp)

*Figura 2.3.2: push notifications com subscriptions.*

<aside class="positive">

**Nota.** Possíveis traduções para *push* são: empurrar, forçar, impulsionar. Neste contexto, a melhor tradução é "enviar".

</aside>

* A operação subscription da especificação GraphQL permite que clientes sejam notificados por servidores por meio do mecanismo **push**.
* Em particular, o padrão utilizado leva o nome de **publish-subscribe**. Neste padrão, servidores (os *publishers*) enviam mensagens para canais ou categorias definidas. Clientes interessados em mensagens (*subscribers*) indicam seu interesse somente nos canais ou categorias que de fato importam para eles. Cada mensagem enviada por um publisher para um canal somente é entregue para os subscribers que tenham se registrado naquele canal.

## Primeiro teste: lançamento de dados
Duration: 15:00

A fim de testar a operação subscription de GraphQL, vamos disponibilizar uma funcionalidade que simula o lançamento de um dado de tempos em tempos.

O primeiro passo é fazer a definição da operação no arquivo `schema.graphql`.

**src/schema.graphql · Listagem 2.4.1 (trecho)**

```graphql
# …
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

type Subscription {
  dado: Int!
}

input InserirPessoaInput {
  nome: String!
  idade: Int
}
# ...
```

A fim de manter a estrutura do projeto que construímos anteriormente, vamos criar um novo arquivo chamado `Subscription.js` na pasta `resolvers`. Seu conteúdo inicial é dado a seguir.

**src/resolvers/Subscription.js · Listagem 2.4.2**

```javascript
const Subscription = {

};
export default Subscription;
```

A seguir, precisamos incluir esse objeto de resolvers no objeto que utilizamos na construção do servidor, o que ocorre no arquivo `index.js`.

**src/index.js · Listagem 2.4.3**

```javascript
import {
  createServer,
} from '@graphql-yoga/node'
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription'
import Pessoa from './resolvers/Pessoa';
import Livro from './resolvers/Livro';
import Comentario from './resolvers/Comentario';
import db from './db';
const resolvers = {
  Query,
  Mutation,
  Subscription,
  Livro,
  Pessoa,
  Comentario,
};
const server = createServer({
  schema: {
    typeDefs: fs.readFileSync('./src/schema.graphql', 'utf-8'),
    resolvers
  },
  context: {db: db},

})
server.start()
```

### createPubSub

O GraphQL Yoga possui uma função chamada **createPubSub**. Ela constrói um objeto que implementa o modelo Publisher/Subscriber. Neste modelo, a entidade *Publisher* é responsável por registrar "acontecimentos" ou "eventos" associados a uma espécie de "canal", cujo nome podemos escolher. Podem existir múltiplos canais, cada qual com um nome diferente. Uma segunda entidade, a *Subscriber*, se vincula a um ou mais canais utilizando seu nome, de modo que, quando um acontecimento ou evento for registrado ela receba uma notificação.

O primeiro passo para utilizá-la é fazer a sua importação e "encaixá-la" na construção do servidor, como mais um parâmetro do objeto de contexto. Estamos no arquivo `index.js`.

**src/index.js · Listagem 2.4.4**

```javascript
import {
  createServer,
  createPubSub
} from '@graphql-yoga/node'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import Livro from './resolvers/Livro'
import Pessoa from './resolvers/Pessoa'
import Comentario from './resolvers/Comentario'
import * as fs from 'fs';

const pubSub = createPubSub()

const resolvers = {
  Query: Query,
  Mutation: Mutation,
  Subscription: Subscription,
  Livro: Livro,
  Pessoa: Pessoa,
  Comentario: Comentario
}

const server = createServer({
  schema: {
    typeDefs: fs.readFileSync('./src/schema.graphql', 'utf-8'),
    resolvers
  },
  context: {db: db, pubSub: pubSub},

})
server.start()
```

### O resolver dado

Passamos a definir o resolver associado ao tipo `dado` que criamos anteriormente. Ele tem uma função especial chamada **subscribe**. A nossa implementação faz o seguinte:

* A cada 2 segundos, gera um valor aleatório entre 1 e 6.
* Registra o número gerado junto ao canal "dado".
* Devolve um objeto que representa o canal de comunicação entre publisher e subscriber.

Estamos no arquivo `Subscription.js`.

**src/resolvers/Subscription.js · Listagem 2.4.5**

```javascript
const Subscription = {
  dado: {
    subscribe (parent, args, {pubSub}, info){
      setInterval(() => {
        //registra algo no canal "dado" a cada dois segundos
        pubSub.publish('dado', {dado: Math.floor(Math.random() * 6) + 1})
      }, 2000)
      //devolve o objeto que representa o canal de comunicação entre publisher e subscriber
      return pubSub.subscribe('dado')
    }
  }
};
export default Subscription;
```

No seu navegador, visite `localhost:4000/graphql` e faça o teste a seguir.

**GraphiQL · Listagem 2.4.6**

```graphql
subscription {
  dado
}
```

A figura a seguir mostra o resultado esperado. Observe que, a cada dois segundos, o valor do dado deve ser alterado.

![Yoga GraphiQL com a subscription dado à esquerda e, à direita, a resposta data com dado igual a 6](img/fig-2-4-1.webp)

*Figura 2.4.1: o valor do dado muda a cada dois segundos.*

## Subscription para novos comentários de um livro
Duration: 15:00

Passamos agora a implementar algumas operações do tipo subscription para possíveis atualizações envolvendo a base de dados de nossa aplicação. Começamos tratando a **inserção de comentários** para um determinado **livro**.

O primeiro passo é definir a nova operação no arquivo `schema.graphql`. Note que especificamos o **id** do livro cujos comentários nos interessam.

**src/schema.graphql · Listagem 2.5.1 (trecho)**

```graphql
type Mutation {
  inserirPessoa (pessoa: InserirPessoaInput): Pessoa!
  atualizarPessoa (id: ID!, pessoa: AtualizarPessoaInput!): Pessoa!
  inserirLivro (livro: InserirLivroInput): Livro!
  atualizarLivro (id: ID!, livro: AtualizarLivroInput!): Livro!
  inserirComentario(comentario: InserirComentarioInput): Comentario!
  atualizarComentario(id: ID!, comentario: AtualizarComentarioInput!): Comentario!
}

type Subscription {
  dado: Int!
  comentario (idLivro: ID!): Comentario!
}

input InserirPessoaInput{
  nome: String!
  idade: Int
}
# ...
```

O próximo passo é especificar o resolver no arquivo `Subscription.js`. Antes de mais nada, verificamos se o livro existe. Se não existir, não faz sentido registrar o novo evento e apenas geramos um erro. Caso contrário, usamos o `pubSub` para registrar o novo evento. Observe que o nome do canal é `comentario` mas que também especificamos o id do livro de interesse. Assim, subscribers interessados em eventos relacionados ao livro de id igual a 100 não serão notificados quando eventos envolvendo o livro de id igual a 101 acontecerem.

**src/resolvers/Subscription.js · Listagem 2.5.2**

```javascript
const Subscription = {
  dado: {
    subscribe (parent, args, {pubSub}, info){
      setInterval(() => {
        //registra algo no canal "dado" a cada dois segundos
        pubSub.publish('dado', {dado: Math.floor(Math.random() * 6) + 1})
      }, 2000)
      //devolve o objeto que representa o canal de comunicação entre publisher e subscriber
      return pubSub.subscribe('dado')
    }
  },
  comentario: {
    subscribe(parent, {idLivro}, {pubSub, db}, info){
      //antes de registrar o novo evento, verificamos se o livro realmente existe
      const livro = db.livros.find(l => l.id === idLivro)
      if (!livro)
        throw new Error ("Livro não existe")
      //se o livro existe, chegamos até aqui e fazemos o registro de novo evento
      //o segundo parâmetro garante que a notificação será feita por livro
      //ou seja, subscribers interessados em eventos envolvendo o livro de id 100 não serão notificados quando eventos envolvendo o livro de id 101 acontecerem
      return pubSub.subscribe('comentario', idLivro)
    }
  }
};
export default Subscription;
```

Resta dizer quando o método `publish` é chamado. Ele será chamado, a princípio, no momento em que um novo comentário for inserido para o livro especificado. Por isso, ele será chamado na mutation `inserirComentario`. Estamos no arquivo `Mutation.js`.

**src/resolvers/Mutation.js · Listagem 2.5.3 (trecho)**

```text
…
},
  inserirComentario(parent, args, ctx, info){
    if (!ctx.db.pessoas.some(p => p.id === args.comentario.autor) || !ctx.db.livros.some(l => l.id === args.comentario.livro)){
      throw new Error ("Autor e/ou livro inexistente(s)")
    }
    const comentario = {
      id: uuidv4(),
      texto: args.comentario.texto,
      nota: args.comentario.nota,
      livro: args.comentario.livro,
      autor: args.comentario.autor
    }
    ctx.db.comentarios.push(comentario)
    ctx.pubSub.publish(`comentario`, args.comentario.livro, {comentario})
    return comentario
  },
...
```

Para testar, faça a requisição a seguir no Playground.

**GraphiQL · Listagem 2.5.4**

```graphql
subscription{
  comentario(idLivro:"100"){
    id
    texto
    nota
  }
}
```

A seguir, faça a requisição a seguir usando o Postman. Feita a requisição, volte ao Playground para ver o resultado.

**Postman · Listagem 2.5.5**

```graphql
mutation{
    inserirComentario(comentario:{
        texto: "Mais um bom livro",
        nota: 5,
        autor: "1",
        livro: "100"
    }){
        id
    }
}
```

Teste também o envio de um novo comentário para um livro diferente. Note que não deve haver notificação neste caso.

**Postman · Listagem 2.5.6**

```graphql
mutation{
    inserirComentario(comentario:{
        texto: "Mais um bom livro",
        nota: 5,
        autor: "1",
        livro: "101"
    }){
        id
    }
}
```

## Subscription para novos livros
Duration: 10:00

*A partir daqui, o conteúdo é o da parte 2 da apostila.*

Suponha que desejamos ser notificados sempre que um novo livro for inserido, usando o modelo de notificação push. Para isso, basta criar uma nova subscription e ajustar os detalhes de maneira análoga ao que fizemos anteriormente. Os passos são os seguintes:

* Definir uma nova Subscription para livros
* Implementar o resolver associado
* Ajustar a operação de inserção de livros para que o publish seja executado ali

A listagem a seguir mostra a definição da nova Subscription. Estamos no arquivo `schema.graphql`.

**src/schema.graphql · Listagem 2.4.1 (parte 2)**

```graphql
type Subscription {
  dado: Int!
  comentario (idLivro: ID!): Comentario!
  livro: Livro!
}
```

A implementação do resolver é exibida a seguir. Agora estamos no arquivo `Subscription.js`.

**src/resolvers/Subscription.js · Listagem 2.4.2 (parte 2)**

```javascript
const Subscription = {
  dado: {
    subscribe (parent, args, {pubSub}, info){
      setInterval(() => {
        //registra algo no canal "dado" a cada dois segundos
        pubSub.publish('dado', {dado: Math.floor(Math.random() * 6) + 1})
      }, 2000)
      //devolve o objeto que representa o canal de comunicação entre publisher e subscriber
      return pubSub.subscribe('dado')
    }
  },
  comentario: {
    subscribe(parent, {idLivro}, {pubSub, db}, info){
      //antes de registrar o novo evento, verificamos se o livro realmente existe
      const livro = db.livros.find(l => l.id === idLivro)
      if (!livro)
        throw new Error ("Livro não existe")
      //se o livro existe, chegamos até aqui e fazemos o registro de novo evento
      //o segundo parâmetro garante que a notificação será feita por livro
      //ou seja, subscribers interessados em eventos envolvendo o livro de id 100 não serão notificados quando eventos envolvendo o livro de id 101 acontecerem
      return pubSub.subscribe('comentario', idLivro)
    }
  },
  livro: {
    subscribe (parent, args, {pubSub}, info){
      return pubSub.subscribe("livro")
    }
  }
};
export default Subscription;
```

Desejamos que cada inserção de livro resulte em uma nova notificação. Para ser condizente com o resolver que acabamos de criar, o método `publish` deve enviar o livro inserido para o canal que escolhemos no resolver. Estamos agora no arquivo `Mutation.js`.

**src/resolvers/Mutation.js · Listagem 2.4.3 (parte 2)**

```javascript
inserirLivro(parent, args, ctx, info) {
    const autorExiste = ctx.db.pessoas.some(
      (pessoa) => pessoa.id === args.livro.autor
    );
    if (!autorExiste) {
      throw new Error("Autor não existe")
    }
    const livro = {
      id: uuidv4(),
      titulo: args.livro.titulo,
      edicao: args.livro.edicao,
      autor: args.livro.autor
    };
    ctx.db.livros.push(livro);
    ctx.pubSub.publish('livro', { livro });
    return livro;
  },
```

O teste pode ser feito como mostram as listagens a seguir. Primeiro, enviamos uma requisição de Subscription. A seguir, fazemos a inserção de livro. Caso queira, execute a primeira no Playground e a segunda em outro cliente HTTP, como o Postman.

**GraphiQL · Listagem 2.4.4 (parte 2)**

```graphql
subscription{
  livro{
    titulo
  }
}
```

**Postman · Listagem 2.4.5 (parte 2)**

```graphql
mutation {
    inserirLivro (livro: {
        titulo: "Outro livro",
        edicao: 2,
        autor: "1"
    }){
        id
    }
}
```

## Remoção e atualização de livros: payloads
Duration: 15:00

Podemos, também, ajustar a aplicação para que ela disponibilize operações de Subscription para remoções e atualizações. Note, contudo, que não basta ser notificado quando uma dessas operações ocorrer. O cliente precisa saber, também, qual delas ocorreu para poder se ajustar de acordo. Se um livro for removido, é possível que o cliente deseje removê-lo de sua interface gráfica, por exemplo. Caso seja atualizado, possivelmente desejará fazer alguma atualização também.

Por isso, vamos começar criando um novo tipo de dado que contém:

* o tipo da operação realizada
* os dados envolvidos

> **Payload**
>
> Nome tipicamente utilizado para fazer referência a um conjunto de dados transportado entre cliente e servidor. É a carga útil.

No arquivo `schema.graphql`, crie o novo tipo a seguir.

**src/schema.graphql · Listagem 2.5.1 (parte 2)**

```graphql
# …
type Subscription {
  dado: Int!
  comentario (idLivro: ID!): Comentario!
  livro: Livro!
}

type LivroSubscriptionPayload{
  mutation: String!
  data: Livro!
}

input InserirPessoaInput{
  nome: String!
  idade: Int
}
# ...
```

A seguir, alteramos o tipo de retorno da Subscription `livro`. Ela deixa de devolver um livro e devolve algo do tipo que acabamos de definir. Ainda estamos no arquivo `schema.graphql`.

**src/schema.graphql · Listagem 2.5.2 (parte 2)**

```graphql
# ...
type Mutation {
  inserirPessoa (pessoa: InserirPessoaInput): Pessoa!
  atualizarPessoa (id: ID!, pessoa: AtualizarPessoaInput!): Pessoa!
  inserirLivro (livro: InserirLivroInput): Livro!
  atualizarLivro (id: ID!, livro: AtualizarLivroInput!): Livro!
  inserirComentario(comentario: InserirComentarioInput): Comentario!
  atualizarComentario(id: ID!, comentario: AtualizarComentarioInput!): Comentario!
}

type Subscription {
  dado: Int!
  comentario (idLivro: ID!): Comentario!
  livro: LivroSubscriptionPayload!
}

type LivroSubscriptionPayload{
  mutation: String!
  data: Livro!
}
# ...
```

### Inserção

Começamos alterando a operação de inserção para que ela devolva o tipo de mutation realizada. Note que o resolver da Subscription não sofre alterações. Precisamos apenas alterar o trecho de código em que o publish acontece. Neste caso, no resolver de inserção de livros. O objeto devolvido deve ser composto por duas propriedades: `mutation` e `data`. Agora estamos no arquivo `Mutation.js`.

**src/resolvers/Mutation.js · Listagem 2.5.3 (parte 2)**

```javascript
inserirLivro (parent, args, ctx, info){
    const autorExiste = ctx.db.pessoas.some(p => p.id === args.livro.autor)
    if (!autorExiste)
      throw new Error ("Autor não existe")
    const livro = {
      id: uuidv4(),
      titulo: args.livro.titulo,
      edicao: args.livro.edicao,
      autor: args.livro.autor
    }
    ctx.db.livros.push(livro)
    ctx.pubSub.publish(`livro`, {livro: {
      mutation: "insercao",
      data: livro
    }})
    return livro
  },
```

A listagem a seguir mostra um teste que pode ser executado no Playground.

**GraphiQL · Listagem 2.5.4 (parte 2)**

```graphql
subscription{
  livro{
    mutation
    data{
      titulo
      edicao
    }
  }
}
```

Faça a inserção de um novo livro (pelo Postman, talvez) com o código a seguir e veja o resultado.

**Postman · Listagem 2.5.5 (parte 2)**

```graphql
mutation {
    inserirLivro (livro: {
        titulo: "Outro livro",
        edicao: 2,
        autor: "1"
    }){
        id
    }
}
```

### Remoção

Para fazer este passo, será necessário implementar a mutation de remoção antes. A remoção é análoga. Note que as notificações são enviadas para o mesmo canal. Assim, o cliente pode se registrar uma única vez e ser notificado sobre todos os tipos de mutations realizadas, sendo capaz de diferenciá-las usando o tipo enviado. Comece ajustando o resolver que remove livros, no arquivo `Mutation.js`.

**src/resolvers/Mutation.js · Listagem 2.5.6 (parte 2)**

```javascript
removerLivro(parent, args, ctx, info) {
    const indice = ctx.db.livros.findIndex((l) => l.id === args.id)
    if (indice < 0)
      throw new Error("Livro não existe")
    const removido = ctx.db.livros.splice(indice, 1)[0];
    ctx.db.comentarios = ctx.db.comentarios.filter(c => {
      return c.livro !== args.id
    })
    ctx.pubSub.publish ('livro', {
      livro: {
        mutation: "remocao",
        data: removido
      }
    })
    return removido;
  },
```

Faça uma nova Subscription no Playground usando o código a seguir.

**GraphiQL · Listagem 2.5.7 (parte 2)**

```graphql
subscription{
  livro{
    mutation
    data{
      titulo
      edicao
    }
  }
}
```

Envie uma mutation para fazer uma remoção de livro, como a seguir, e veja o resultado.

**Postman · Listagem 2.5.8 (parte 2)**

```graphql
mutation{
  removerLivro(id: "100"){
    titulo
  }
}
```

### Atualização

Para fazer a atualização de livros, ajuste o resolver `atualizarLivro` no arquivo `Mutation.js`. Basta que ele use o método `publish` de `pubSub` para enviar uma notificação para o mesmo canal, fazendo uso da mutation apropriada.

**src/resolvers/Mutation.js · Listagem 2.5.9 (parte 2)**

```text
atualizarLivro (parent, {id, livro}, ctx, info){
    const {db} = ctx;
    const livroExistente = db.livros.find (l => l.id === id);
    if (!livroExistente)
      throw new Error ("Livro não existe")
    Object.assign(livroExistente, { titulo: livro.titulo || livroExistente.titulo, edicao: livro.edicao || livroExistente.edicao});
    ctx.pubSub.publish('livro', {
      livro: {
        mutation: "atualizacao",
        data: livroExistente
      }
    })
    return livroExistente;
```

A Subscription e a Mutation a seguir permitem verificar o resultado.

**GraphiQL · Listagem 2.5.10 (parte 2)**

```graphql
subscription{
  livro{
    mutation
    data{
      titulo
      edicao
    }
  }
}
```

**Postman · Listagem 2.5.11 (parte 2)**

```graphql
mutation{
  atualizarLivro(id:"100", livro:{
    titulo:"Livro atualizado"
  }){
    titulo
    autor{
      nome
    }
  }
}
```

## Inserção, remoção e atualização de comentários
Duration: 15:00

Nesta seção, adaptaremos a aplicação para que notificações sobre inserção, remoção e atualização de comentários também sejam viáveis. Elas serão enviadas para o mesmo canal e, portanto, assim como feito com livros, o objeto devolvido terá um campo (`mutation` foi o nome que escolhemos) que permite ao cliente identificar a operação realizada.

No arquivo `schema.graphql`, comece criando um novo tipo que agrupa o tipo da operação e os dados envolvidos. A seguir, ainda no mesmo arquivo, altere o tipo devolvido pela Subscription, em sua definição.

**src/schema.graphql · Listagem 2.6.1 (parte 2)**

```graphql
type ComentarioSubscriptionPayload {
  mutation: String!
  data: Comentario!
}

type Subscription {
  dado: Int!
  comentario (idLivro: ID!): ComentarioSubscriptionPayload!
  livro: LivroSubscriptionPayload!}
```

O próximo passo é fazer com que cada operação de manipulação de comentários faça uso do objeto `pubSub` disponível no contexto para enviar uma notificação apropriada. As listagens a seguir mostram os ajustes referentes às operações de inserção, remoção e atualização de comentários, respectivamente. Estamos no arquivo `Mutation.js`.

**src/resolvers/Mutation.js · Listagem 2.6.2 (parte 2)**

```javascript
inserirComentario(parent, args, ctx, info) {
    if (!ctx.db.pessoas.some((pessoa) => pessoa.id === args.comentario.autor) ||
      !ctx.db.livros.some((livro) => livro.id === args.comentario.livro)) {
      throw new Error('Autor e/ou Livro inexistente')
    }
    const comentario = {
      id: uuidv4(),
      texto: args.comentario.texto,
      nota: args.comentario.nota,
      livro: args.comentario.livro,
      autor: args.comentario.autor
    }
    ctx.db.comentarios.push(comentario);
    ctx.pubSub.publish (`comentario ${args.comentario.livro}`,{
      comentario: {
        mutation: "insercao",
        data: comentario
      }
    });
    return comentario;

  },
```

**src/resolvers/Mutation.js · Listagem 2.6.3 (parte 2)**

```javascript
removerComentario(parent, args, ctx, info) {
    const indice = ctx.db.comentarios.findIndex(c => c.id === args.id);
    if (indice < 0)
      throw new Error("Comentário não existe!")
    const removido = ctx.db.comentarios.splice(indice, 1)[0];
    ctx.pubSub.publish(`comentario ${removido.livro}`, {
      comentario: {
        mutation: "remocao",
        data: removido
      }
    });
    return removido

  },
```

**src/resolvers/Mutation.js · Listagem 2.6.4 (parte 2, final do arquivo)**

```text
atualizarComentario (parent, {id, comentario}, {db, pubSub}, info){
    const comentarioExistente = db.comentarios.find (l => l.id === id);
    if (!comentarioExistente)
      throw new Error ("Comentario não existe")
    Object.assign (comentarioExistente, {
      texto: comentario.texto || comentarioExistente.texto,
      nota: comentario.nota || comentarioExistente.nota
    });
    pubSub.publish(`comentario ${comentarioExistente.livro}`, {
      comentario: {
        mutation: "atualizacao",
        data: comentarioExistente
      }
    });
    return comentarioExistente;
  }
}
```

<aside class="negative">

**Canal e id precisam combinar.** O resolver da subscription se registra com `pubSub.subscribe('comentario', idLivro)`, isto é, canal `comentario` e o id do livro como segundo argumento, e a Listagem 2.5.3 publica com `publish('comentario', idDoLivro, payload)`. Nas listagens 2.6.2 a 2.6.4, o id está dentro do nome do canal (`` `comentario ${...}` ``). Para que a notificação chegue ao subscriber, use a mesma forma nos dois lados, por exemplo `ctx.pubSub.publish('comentario', args.comentario.livro, { comentario: { mutation: "insercao", data: comentario } })`.

</aside>

Para testar, faça a Subscription a seguir no Playground.

**GraphiQL · Listagem 2.6.5 (parte 2)**

```graphql
subscription{
  comentario(idLivro:"100"){
    mutation
    data{
      texto
      nota
    }
  }
}
```

A seguir, em algum cliente HTTP (Postman, o próprio Playground etc.) faça as Mutations a seguir.

**Postman · Listagem 2.6.6 (parte 2)**

```graphql
mutation {
    inserirComentario (comentario: {
        texto: "Outro bom livro",
        nota: 4,
        livro: "100",
        autor: "1"
    }){
        id
        texto
    }
}

mutation {
    atualizarComentario (id: "1003", comentario: {
        texto: "O livro em questão é bom mesmo"
    }){
        id
        texto
        livro{
            titulo
        }
    }
}

mutation {
    removerComentario (id: "1003"){
        id
        texto
        livro {
            titulo
        }
    }
}
```

## Encerramento
Duration: 2:00

Você usou subscriptions e o padrão publish-subscribe para que clientes sejam notificados em tempo real sobre inserções, atualizações e remoções de livros e comentários. Com isso, a série cobre os três tipos de operação do GraphQL: queries, mutations e subscriptions.

### Referências

* Babel · The compiler for next generation JavaScript. 2020. Disponível em [https://babeljs.io](https://babeljs.io). Acesso em agosto de 2020.
* GraphQL | A query language for your API. 2020. Disponível em [https://graphql.org](https://graphql.org). Acesso em agosto de 2020.
* Node.js. 2020. Disponível em [https://nodejs.org](https://nodejs.org). Acesso em agosto de 2020.
* WILSON, Jim R. *Node.js 8 the Right Way*. 1st edition. The Pragmatic Programmers, LLC, 2018.
* RFC 6455 – The WebSocket Protocol: [https://www.rfc-editor.org/rfc/rfc6455](https://www.rfc-editor.org/rfc/rfc6455)
