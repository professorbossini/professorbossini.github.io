summary: Entenda o ciclo do Redux (criadores de ação, ações, dispatch, reducers e state) com a analogia de uma empresa de cartões com cashback e implemente-o em JavaScript puro com createStore e combineReducers.
id: react-redux-fundamentos
categories: Redux,React,JavaScript
tags: redux,estado,actions,reducers,dispatch,store,combinereducers,javascript
status: Published
authors: Rodrigo Bossini
last updated: 2022-10-08
pdf: react/09_apostila_redux.pdf
exercicios: react/09_exercicios_redux.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Redux: fundamentos

## Visão geral
Duration: 4:00

A documentação oficial do Redux o define como

> "Um contêiner de estado previsível para aplicações Javascript"

Veja o Link 1.1: [https://redux.js.org/](https://redux.js.org/)

Vale destacar os seguintes pontos da documentação.

- Trata-se de uma biblioteca para manipulação de **estado centralizado**.
- Embora seja muito utilizado em aplicações React, não foi produzido com esse único propósito.

### O que você vai aprender

* As partes do ciclo do Redux: criador de ação, ação, dispatch, reducers e state
* Uma analogia com uma empresa de cartões de crédito que oferece cashback
* Escrever criadores de ação e reducers como funções JavaScript comuns
* Combinar reducers com `combineReducers` e criar o store com `createStore`
* Enviar ações com `store.dispatch` e ler o estado com `store.getState`

### O que você vai precisar

* Um navegador e uma conta no StackBlitz (opcionalmente, login com o Github)

## O ciclo básico do Redux
Duration: 6:00

O Redux possui um ciclo composto por algumas partes que levam um nome um tanto específico. Veja a Figura 1.1.1.

![Ciclo Redux: Criador de uma "ação" (no React, pode ser um componente) → Ação (um objeto JSON) → "dispatch" (ação enviada usando um hook) → Reducers (funções que manipulam a ação recebida, potencialmente alterando o estado) → State (estado gerenciado pelo Redux)](img/fig-1-1-1.webp)

*Figura 1.1.1: o ciclo do Redux.*

### Cashback oferecido por uma empresa de cartões de crédito: uma analogia

Para simplificar o entendimento de cada item do ciclo ilustrado, considere a seguinte analogia.

I. Uma empresa de cartão de crédito oferece "cashback" para compras feitas utilizando seus cartões.

II. Pessoas podem adquirir seus cartões de crédito. Para isso, assinam um contrato com a empresa. Elas pagam uma taxa por isso.

III. Após acumular uma quantidade de compras, os clientes podem realizar pedidos para obter seu cashback.

IV. A empresa paga os pedidos em dinheiro.

V. A empresa armazena o histórico de pedidos de cashback.

VI. A empresa armazena o histórico de contratos assinados.

VII. A empresa possui um caixa a partir do qual os pagamentos acontecem.

Veja a Figura 1.2.1.

![Uma cliente entrega uma solicitação a um atendente, que envia cópias da solicitação aos departamentos Pedidos de cashback, Pedidos de novos contratos e Caixa, cada um com seus próprios registros](img/fig-1-2-1.webp)

*Figura 1.2.1: o fluxo de uma solicitação na empresa.*

Na Figura 1.2.1, o que ocorre é o seguinte:

I. Um cliente tem uma solicitação. Ela pode ser de tipos diversos.

II. O cliente entrega a sua solicitação a um atendente.

III. O atendente entrega uma cópia da solicitação para cada departamento da empresa.

IV. Cada departamento que recebe a solicitação decide como manipulá-la.

V. Dependendo do tipo da solicitação, um departamento pode decidir ignorá-la. Por exemplo, o departamento de pedidos de cashback não está interessado em solicitações de novos contratos.

## Estado centralizado e solicitações
Duration: 6:00

### Uma equipe deseja desenvolver relatórios estatísticos

Suponha que há uma equipe nesta empresa que deseja desenvolver relatórios estatísticos sobre os contratos, pedidos de cashback e fluxo de caixa. Para tal, seria necessário consultar as bases de cada um dos departamentos a fim de obter os dados de interesse. Veja a Figura 1.3.1.

![A equipe de relatórios precisa consultar separadamente os registros de cada departamento (cashback, contratos e caixa)](img/fig-1-3-1.webp)

*Figura 1.3.1: dados espalhados pelos departamentos.*

A Figura 1.3.2 mostra uma alternativa: armazenar os dados de todos os departamentos em um único repositório centralizado.

![Os departamentos gravam seus dados em um único banco centralizado, consultado pela equipe de relatórios](img/fig-1-3-2.webp)

*Figura 1.3.2: um repositório centralizado.*

### Com o que se parece uma solicitação?

Neste exemplo, teremos três tipos de solicitações:

- **Criação de novo contrato.** Vamos supor que há uma taxa inicial a ser paga pelo contrato. Além disso, a pessoa interessada deve informar o seu nome.
- **Pedido de cashback.** Uma pessoa informa seu nome e o valor que deseja obter como cashback.
- **Cancelamento de contrato.** Uma pessoa pode cancelar seu contrato a qualquer momento. Para tal, ela informa seu nome.

A Figura 1.4.1 mostra a estrutura básica de uma solicitação.

![Uma solicitação composta por duas partes: type e dados](img/fig-1-4-1.webp)

*Figura 1.4.1: a estrutura de uma solicitação.*

<aside class="positive">

**Nota.** O nome `type` é obrigatório. As demais partes são decididas pelo desenvolvedor. Veja o que diz a documentação: "Actions must have a 'type' field that indicates the type of action being performed. Types can be defined as constants and imported from another module. It's better to use strings for type than Symbols because strings are serializable. Other than type, the structure of an action object is really up to you." Veja mais na página acessível por meio do Link 1.4.1: [https://redux.js.org/api/store](https://redux.js.org/api/store)

</aside>

A Figura 1.4.2 mostra os três tipos de solicitações que nos são de interesse.

![Três solicitações: CriarContrato (nome: João, taxa: R$50), Cashback (nome: João, valor: R$150) e CancelarContrato (nome: João)](img/fig-1-4-2.webp)

*Figura 1.4.2: os três tipos de solicitação.*

## Atendente e departamentos
Duration: 8:00

### Detalhes sobre um pedido de cashback

Como vimos, cabe ao atendente receber as solicitações e direcioná-las ao departamento adequado. Dada a existência da base centralizada, caberá a ele, também, consultá-la previamente e entregá-la ao departamento alvo da solicitação. Por exemplo, quando ele recebe uma solicitação de cashback, ele faz uma consulta à base e obtém todos os registros referentes a cashback. Depois disso, entrega a lista de registros de cashback e a nova solicitação ao departamento de pedidos de cashback que, por sua vez, decide se a base centralizada deve ou não ser atualizada. Veja a Figura 1.5.1.

![O atendente consulta os pedidos de cashback na base centralizada e os entrega, junto com a nova solicitação, ao departamento de pedidos de cashback, que decide se atualiza a base](img/fig-1-5-1.webp)

*Figura 1.5.1: o fluxo de um pedido de cashback.*

### Detalhes sobre um pedido de novo contrato

Ao receber solicitações dos tipos `NovoContrato` ou `CancelarContrato`, o atendente consulta a base de contratos existentes e a entrega ao departamento de novos contratos, incluindo a nova solicitação. Veja a Figura 1.6.1.

![O atendente entrega os contratos existentes e a nova solicitação ao departamento de contratos, que adiciona ou remove contratos da base centralizada](img/fig-1-6-1.webp)

*Figura 1.6.1: o fluxo de criação e cancelamento de contratos.*

### Detalhes de um pedido por cashback ou novo contrato: o departamento "caixa"

Pedidos de novos contratos e por cashback também são de interesse para o departamento "caixa". Veja a Figura 1.7.1.

![O caixa recebe pedidos de cashback, que retiram dinheiro, e novos contratos, que adicionam a taxa, atualizando o valor em caixa na base centralizada](img/fig-1-7-1.webp)

*Figura 1.7.1: o caixa também reage a cashback e novos contratos.*

### Associando os nomes do ciclo Redux com as partes da simulação

Cada parte retratada nas simulações feitas até então está associada a um conceito do ciclo Redux. Veja a Figura 1.8.1.

![O ciclo Redux sobre a simulação: o cliente é o criador de ação, a solicitação é a ação, o atendente é o dispatch, os departamentos (Pedidos de cashback, Pedidos de novos contratos e Caixa) são os reducers e a base centralizada é o state](img/fig-1-8-1.webp)

*Figura 1.8.1: cada parte da empresa corresponde a um conceito do Redux.*

## Projeto no StackBlitz e criadores de ação
Duration: 10:00

Nesta seção, implementaremos as funcionalidades da empresa descrita. Para tal, utilizaremos o ambiente **StackBlitz**. Encontre a sua página oficial por meio do Link 2.1: [https://stackblitz.com/](https://stackblitz.com/)

Pode ser de interesse fazer login com o seu Github, assim você poderá armazenar seus projetos.

### Novo projeto Javascript

Na tela inicial do StackBlitz, clique **Javascript — Blank Project**, como destaca a Figura 2.1.1.

![Tela "Create a new project" do StackBlitz com a opção JavaScript Blank project destacada](img/fig-2-1-1.webp)

*Figura 2.1.1: criando um projeto JavaScript em branco.*

### Adicionando o Redux como dependência

O Redux é uma biblioteca Javascript e precisa ser adicionado como dependência do projeto. Para tal, clique sob **DEPENDENCIES**, digite **redux** e aperte Enter. Veja a Figura 2.2.1.

![Editor do StackBlitz com a seção DEPENDENCIES destacada, já contendo redux](img/fig-2-2-1.webp)

*Figura 2.2.1: adicionando o Redux às dependências.*

### Um criador de ação para a criação de contratos

Uma das solicitações previstas no sistema é a criação de contratos. Isso é responsabilidade de um **criador de ações** que, neste caso, será uma simples função. Ela recebe nome e valor da taxa de criação de contrato e devolve uma **ação**. A ação é um simples objeto JSON contendo tipo e os dados de interesse. Veja o Bloco de Código 2.3.1. Estamos no arquivo `index.js`. Caso ele possua algum conteúdo inicial, apague tudo.

<aside class="positive">

**Nota:** lembre-se de clicar **Save** esporadicamente no canto superior esquerdo da tela.

</aside>

**index.js · Bloco de Código 2.3.1**

```javascript
//essa função é criadora de um tipo de ação
const criarContrato = (nome, taxa) => {
  //esse JSON que ela devolve é uma ação
  return {
    type: "CRIAR_CONTRATO",
    dados: {
      nome, taxa
    }
  }
}
```

### Um criador de ação para o cancelamento de contratos

O Bloco de Código 2.4.1 mostra uma função que desempenha o papel de criadora de ações. Ela cria ações para o cancelamento de contratos.

**index.js · Bloco de Código 2.4.1**

```javascript
//esta função é criadora de um tipo de ação
const cancelarContrato = (nome) => {
  //esse JSON que ela devolve é uma ação
  return {
    type: "CANCELAR_CONTRATO",
    dados: {
      nome
    }
  }
}
```

### Um criador de ações para solicitações de cashback

Por sua vez, a função exibida pelo Bloco de Código 2.5.1 cria ações para solicitações de cashback.

**index.js · Bloco de Código 2.5.1**

```javascript
//esta função é criadora de um tipo de ação
const solicitarCashback = (nome, valor) => {
  //esse JSON que ela devolve é uma ação
  return {
    type: "CASHBACK",
    dados: {
      nome, valor
    }
  }
}
```

### Partes do ciclo Redux implementadas até então

A Figura 2.6.1 mostra as partes do ciclo Redux que implementamos até então.

![Ciclo Redux com os três criadores de ação (solicitarCashback, cancelarContrato, criarContrato) e os três tipos de ação (SOLICITAR_CASHBACK, CANCELAR_CONTRATO, CRIAR_CONTRATO) já implementados](img/fig-2-6-1.webp)

*Figura 2.6.1: criadores de ação e ações implementados.*

## Reducers
Duration: 10:00

### Um reducer para o tratamento de solicitações de cashback

Um **reducer** é uma simples função que recebe partes do estado atual que lhe sejam de interesse e a ação a ser tratada. Cabe a ela devolver o estado atualizado de acordo com os parâmetros recebidos. O reducer para o tratamento de solicitações de cashback aparece no Bloco de Código 2.7.1. Repare que ele representa o departamento da empresa responsável por essa atividade.

**index.js · Bloco de Código 2.7.1**

```javascript
//esta função é um reducer
//quando chamada pela primeira vez, seu primeiro parâmetro será undefined
//já que não existirá histórico algum
//por isso, configuramos uma lista vazia como seu valor padrão
const historicoDePedidosDeCashback = (historicoDePedidosDeCashbackAtual = [], acao) => {
  //se a ação for CASHBACK, adicionamos o novo pedido à coleção existente
  if (acao.type === 'CASHBACK'){
    //uma cópia. Contém todos os existentes + o novo
    //não faça push
    return [
      ...historicoDePedidosDeCashbackAtual,
      acao.dados
    ]
  }
  //caso contrário, apenas ignoramos e devolvemos a coleção inalterada
  return historicoDePedidosDeCashbackAtual
}
```

### Um reducer para a manipulação do caixa

O reducer do Bloco de Código 2.8.1 implementa a lógica do departamento de caixa. Ele recebe o valor existente no caixa e o altera de acordo com o tipo da ação recebida.

**index.js · Bloco de Código 2.8.1**

```javascript
//caixa começa zerado
const caixa = (dinheiroEmCaixa = 0, acao) => {
  if (acao.type === "CASHBACK"){
    dinheiroEmCaixa -= acao.dados.valor
  }
  else if (acao.type === "CRIAR_CONTRATO"){
    dinheiroEmCaixa += acao.dados.taxa
  }
  return dinheiroEmCaixa
}
```

### Um reducer para a criação e cancelamento de contratos

O reducer — uma simples função, lembra? — do Bloco de Código 2.9.1 trata a criação e cancelamento de contratos.

**index.js · Bloco de Código 2.9.1**

```javascript
//lista começa vazia
const contratos = (listaDeContratosAtual = [], acao) => {
  if (acao.type === "CRIAR_CONTRATO")
    return [...listaDeContratosAtual, acao.dados]
  if (acao.type === "CANCELAR_CONTRATO")
    return listaDeContratosAtual.filter(c => c.nome !== acao.dados.nome)
  return listaDeContratosAtual
}
```

### Partes do ciclo Redux implementadas até então

A Figura 2.10.1 atualiza as partes do ciclo Redux que implementamos até então. Temos agora os reducers, veja.

![Ciclo Redux com os três criadores de ação, os três tipos de ação e os três reducers (contratos, caixa, historicoDePedidosDeCashback) implementados](img/fig-2-10-1.webp)

*Figura 2.10.1: agora também temos os reducers.*

## Utilizando o Redux
Duration: 10:00

Até o momento sequer fizemos uso do Redux. Escrevemos apenas algumas funções Javascript comuns. Passaremos a utilizá-lo nesta seção. Quando utilizamos o Redux, combinamos coleções de criadores de ações com reducers apropriados, obtendo um maquinário capaz de desempenhar o gerenciamento do estado centralizado. O primeiro passo é trazer o Redux para o contexto, como mostra o Bloco de Código 2.11.1. Você pode importá-lo na primeira linha de código do arquivo `index.js`, antes de definir qualquer função.

**index.js · Bloco de Código 2.11.1**

```javascript
const Redux = require ('redux')
...
```

A seguir, após a definição de todas as funções, desestruturamos o objeto `Redux` a fim de obter as funções `createStore` e `combineReducers`. Veja o Bloco de Código 2.11.2.

**index.js · Bloco de Código 2.11.2**

```javascript
...
//depois da definição de todas as funções
const { createStore, combineReducers } = Redux
```

O próximo passo é combinar todos os reducers utilizando a função `combineReducers`. Veja o Bloco de Código 2.11.3.

**index.js · Bloco de Código 2.11.3**

```javascript
//depois da definição de todas as funções
const { createStore, combineReducers } = Redux
const todosOsReducers = combineReducers({
  historicoDePedidosDeCashback,
  caixa,
  contratos
})
```

<aside class="positive">

**Nota:** o nome de cada "parte" do estado gerenciado pelo reducer será determinado pela chave escolhida quando `combineReducers` foi chamada. Neste caso, elas serão `historicoDePedidosDeCashback`, `caixa` e `contratos`. Se desejar trocar o nome, basta escolher outro nome. Veja o exemplo do Bloco de Código 2.11.4.

</aside>

**index.js · Bloco de Código 2.11.4 — apenas um exemplo**

```javascript
//depois da definição de todas as funções
const { createStore, combineReducers } = Redux
const todosOsReducers = combineReducers({
  historicoCashback: historicoDePedidosDeCashback,
  nossocaixa: caixa,
  osContratos: contratos
})
```

A seguir, construímos o chamado **store** do Redux, utilizando a função intuitivamente denominada `createStore`. Veja o Bloco de Código 2.11.5.

**index.js · Bloco de Código 2.11.5**

```javascript
//depois da definição de todas as funções
const { createStore, combineReducers } = Redux
const todosOsReducers = combineReducers({
  historicoDePedidosDeCashback,
  caixa,
  contratos
})
const store = createStore(todosOsReducers)
```

### Partes do ciclo Redux implementadas até então

A Figura 2.12.1 exibe a implementação completa do ciclo Redux. Observe que o objeto `store` que criamos possui um método chamado `getState`. O objeto devolvido por ele desempenha o papel de estado. Ele pode ser usado assim: `store.getState()`. E o item "dispatch"? Ele é um método do objeto `store` que passaremos a utilizar a seguir. Ele pode ser usado assim: `store.dispatch(acao)`.

![Ciclo Redux completo: criadores de ação, tipos de ação, o método dispatch do objeto store, os três reducers e o estado obtido com store.getState()](img/fig-2-12-1.webp)

*Figura 2.12.1: o ciclo Redux completo.*

<aside class="negative">

Nas versões atuais do Redux, `createStore` aparece como obsoleto (*deprecated*) e a recomendação oficial é usar o Redux Toolkit (`configureStore`). O `createStore` continua funcionando e é ótimo para entender o ciclo.

</aside>

## Enviando ações ao Redux
Duration: 8:00

O programa do Bloco de Código 2.13.1 realiza as seguintes tarefas em ordem:

- Cria um contrato para José
- Cria um contrato para Maria
- Solicita cashback de 10 para Maria
- Solicita cashback de 20 para José
- Cancela o contrato de Maria

Observe que a execução acontece automaticamente assim que o projeto é salvo. Ele pode ser salvo automaticamente ou você pode clicar **Save** no canto superior esquerdo. Abra o console do navegador (`CTRL + SHIFT + I` no Chrome, por exemplo) para visualizar o resultado.

**index.js · Bloco de Código 2.13.1**

```javascript
const acaoContratoJose = criarContrato('José', 50)
store.dispatch(acaoContratoJose)
console.log(store.getState())

const acaoContratoMaria = criarContrato ('Maria', 50)
store.dispatch(acaoContratoMaria)
console.log(store.getState())

const acaoCashbackMaria = solicitarCashback('Maria', 10)
store.dispatch(acaoCashbackMaria)
console.log(store.getState())

const acaoCashbackJose = solicitarCashback('José', 20)
store.dispatch(acaoCashbackJose)
console.log(store.getState())

const acaoCancelaContratoMaria = cancelarContrato ('Maria')
store.dispatch(acaoCancelaContratoMaria)
console.log(store.getState())
```

Ao final, o estado terá o histórico com os dois pedidos de cashback, o caixa com 70 (50 + 50 − 10 − 20) e apenas o contrato de José.

## Exercícios
Duration: 20:00

Escreva uma função chamada `transacao`. Ela deve

- Receber o objeto `store` como parâmetro.
- Definir um vetor com quatro nomes de pessoas.
- Definir um objeto JSON em que as chaves são os valores 0, 1 e 2 e os valores associados são as seguintes funções. Todas elas recebem um nome por parâmetro. As ações que criam envolvem esses nomes.
  - Associada ao valor 0, há uma função que cria uma ação de criação de contrato e faz "dispatch".
  - Associada ao valor 1, há uma função que cria uma ação de cancelamento de contrato e faz "dispatch".
  - Associada ao valor 2, há uma função que sorteia um valor real entre 10 e 30. A seguir, cria uma ação de solicitação de cashback com esse valor e faz "dispatch".

A função chamada `transacao`, depois de definir o mapa de funções, sorteia um valor entre 0 e 2 e chama a função associada a esse valor, passando como parâmetro o nome de uma pessoa cujo índice também deve ser sorteado.

No script principal, use `setInterval` para chamar a função `transacao` a cada cinco segundos.

## Referências
Duration: 3:00

Parabéns! Você implementou o ciclo completo do Redux em JavaScript puro. O próximo passo é integrar o Redux a uma aplicação React (codelab `react-react-redux`).

* React – A JavaScript library for building user interfaces. 2021. Disponível em [https://reactjs.org/](https://reactjs.org/). Acesso em agosto de 2021.
* Redux - A predictable state container for JavaScript apps. | Redux. 2021. Disponível em [https://redux.js.org](https://redux.js.org). Acesso em outubro de 2021.
