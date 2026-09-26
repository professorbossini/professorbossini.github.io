summary: Entenda o ciclo do Redux (criadores de ação, ações, dispatch, reducers e state) por meio de uma analogia com uma empresa de cartões com cashback e implemente-o em JavaScript puro no StackBlitz.
id: rn-redux
categories: Redux,JavaScript,React Native
tags: redux,javascript,estado centralizado,action,reducer,store,dispatch,combinereducers,createstore,stackblitz
status: Published
authors: Rodrigo Bossini
last updated: 2022-05-20
pdf: react_native/old/08_apostila_redux.pdf
exercicios: react_native/old/08_exercicios_redux.pdf,react_native/old/09_exercicios_extras_react_redux.pdf,react_native/old/09_exercicios_extras_com_respostas_react_redux.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Redux: o ciclo do estado centralizado

## Visão geral
Duration: 3:00

A documentação oficial do Redux o define como

> "Um contêiner de estado previsível para aplicações Javascript"

[https://redux.js.org/](https://redux.js.org/)

Vale destacar os seguintes pontos da documentação.

* Trata-se de uma biblioteca para manipulação de **estado centralizado**.
* Embora seja muito utilizado em aplicações React, não foi produzido com esse único propósito.

### O que você vai aprender

* As partes do ciclo Redux: criador de ação, ação, dispatch, reducers e state
* Uma analogia com uma empresa de cartões de crédito que oferece cashback
* Como escrever criadores de ação e reducers como funções JavaScript comuns
* Como combinar reducers com `combineReducers` e criar a store com `createStore`
* Como enviar ações com `store.dispatch` e ler o estado com `store.getState`

### O que você vai precisar

* Um navegador e acesso ao StackBlitz (sugestão: entrar com o GitHub)
* Noções de JavaScript (funções, objetos, arrays e o operador spread)

## O ciclo do Redux e uma analogia
Duration: 10:00

### Ciclo básico do Redux

O Redux possui um ciclo composto por algumas partes que levam um nome um tanto específico. Veja a Figura 1.1.1.

![Ciclo Redux em cinco caixas encadeadas: Criador de uma "ação" (no React, pode ser um componente), Ação (um objeto JSON), "dispatch" (ação enviada usando um hook), Reducers (funções que manipulam a ação recebida, potencialmente alterando o estado) e State (estado gerenciado pelo Redux)](img/fig-1-1-1.webp)

*Figura 1.1.1: O ciclo básico do Redux.*

### Cashback oferecido por uma empresa de cartões de crédito: uma analogia

Para simplificar o entendimento de cada item do ciclo ilustrado, considere a seguinte analogia.

1. Uma empresa de cartão de crédito oferece "cashback" para compras feitas utilizando seus cartões.
2. Pessoas podem adquirir seus cartões de crédito. Para isso, assinam um **contrato** com a empresa. Elas pagam uma taxa por isso.
3. Após acumular uma quantidade de compras, os clientes podem realizar **pedidos** para obter seu cashback.
4. A empresa paga os pedidos em **dinheiro**.
5. A empresa armazena o **histórico de pedidos de cashback**.
6. A empresa armazena o **histórico de contratos assinados**.
7. A empresa possui um **caixa** a partir do qual os pagamentos acontecem.

Veja a Figura 1.2.1.

![Um cliente entrega uma solicitação a um atendente, que envia cópias da solicitação aos departamentos de pedidos de cashback, pedidos de novos contratos e caixa](img/fig-1-2-1.webp)

*Figura 1.2.1: O fluxo de uma solicitação na empresa.*

Na Figura 1.2.1, o que ocorre é o seguinte:

1. Um cliente tem uma solicitação. Ela pode ser de tipos diversos.
2. O cliente entrega a sua solicitação a um atendente.
3. O atendente entrega uma cópia da solicitação para cada departamento da empresa.
4. Cada departamento que recebe a solicitação decide como manipulá-la.
5. Dependendo do tipo da solicitação, um departamento pode decidir ignorá-la. Por exemplo, o departamento de pedidos de cashback não está interessado em solicitações de novos contratos.

### Uma equipe deseja desenvolver relatórios estatísticos

Suponha que há uma equipe nesta empresa que deseja desenvolver relatórios estatísticos sobre os contratos, pedidos de cashback e fluxo de caixa. Para tal, seria necessário consultar as bases de cada um dos departamentos a fim de obter os dados de interesse. Veja a Figura 1.3.1.

![A equipe de relatórios precisa consultar separadamente as bases dos departamentos de pedidos de cashback, de novos contratos e do caixa](img/fig-1-3-1.webp)

*Figura 1.3.1: Dados espalhados pelos departamentos.*

A Figura 1.3.2 mostra uma alternativa: armazenar os dados de todos os departamentos em um único **repositório centralizado**.

![Os departamentos gravam seus dados (pedidos, contratos e caixa) em uma única base centralizada, consultada pela equipe de relatórios](img/fig-1-3-2.webp)

*Figura 1.3.2: Um repositório centralizado.*

## Solicitações e departamentos
Duration: 10:00

### Com o que se parece uma solicitação?

Neste exemplo, teremos três tipos de solicitações:

* **Criação de novo contrato.** Vamos supor que há uma taxa inicial a ser paga pelo contrato. Além disso, a pessoa interessada deve informar o seu nome.
* **Pedido de cashback.** Uma pessoa informa seu nome e o valor que deseja obter como cashback.
* **Cancelamento de contrato.** Uma pessoa pode cancelar seu contrato a qualquer momento. Para tal, ela informa seu nome.

A Figura 1.4.1 mostra a estrutura básica de uma solicitação.

![Uma caixa com duas partes: type em cima e dados embaixo](img/fig-1-4-1.webp)

*Figura 1.4.1: A estrutura de uma solicitação (ação).*

<aside class="positive">

**Nota.** O nome "type" é obrigatório. As demais partes são decididas pelo desenvolvedor. Veja o que diz a documentação: *"Actions must have a 'type' field that indicates the type of action being performed. Types can be defined as constants and imported from another module. It's better to use strings for type than Symbols because strings are serializable. Other than type, the structure of an action object is really up to you."* Veja mais em [https://redux.js.org/api/store](https://redux.js.org/api/store).

</aside>

A Figura 1.4.2 mostra os três tipos de solicitações que nos são de interesse.

![Três solicitações: CriarContrato com nome João e taxa R$50, Cashback com nome João e valor R$150, e CancelarContrato com nome João](img/fig-1-4-2.webp)

*Figura 1.4.2: Os três tipos de solicitação.*

### Um pedido de cashback: o atendente e o departamento de pedidos de cashback

Como vimos, cabe ao atendente receber as solicitações e direcioná-las ao departamento adequado. Dada a existência da base centralizada, caberá a ele, também, consultá-la previamente e entregá-la ao departamento alvo da solicitação. Por exemplo, quando ele recebe uma solicitação de cashback, ele faz uma consulta à base e obtém todos os registros referentes a cashback. Depois disso, entrega a lista de registros de cashback e a nova solicitação ao departamento de pedidos de cashback que, por sua vez, decide se a base centralizada deve ou não ser atualizada. Veja a Figura 1.5.1.

![Fluxo numerado: a cliente entrega um pedido de cashback (Maria, R$150) ao atendente, que consulta a base de cashback e entrega os pedidos existentes e a solicitação ao departamento de pedidos de cashback; se a solicitação é do tipo cashback, um novo pedido é acrescentado à lista, senão a lista segue igual, e o resultado volta para a base](img/fig-1-5-1.webp)

*Figura 1.5.1: O departamento de pedidos de cashback.*

### Um pedido de novo contrato: o atendente e o departamento de contratos

Ao receber solicitações dos tipos `NovoContrato` ou `CancelarContrato`, o atendente consulta a base de contratos existentes e a entrega ao departamento de novos contratos, incluindo a nova solicitação. Veja a Figura 1.6.1.

![Fluxo numerado: o atendente consulta a base de contratos e entrega os contratos existentes e a solicitação ao departamento de contratos, que acrescenta um contrato quando a solicitação é de criação, remove quando é de cancelamento e, nos demais casos, devolve a lista inalterada à base](img/fig-1-6-1.webp)

*Figura 1.6.1: O departamento de contratos.*

### Um pedido por cashback ou novo contrato: o atendente e o departamento caixa

Pedidos de novos contratos e por cashback também são de interesse para o departamento "caixa". Veja a Figura 1.7.1.

![Fluxo numerado: o atendente consulta o caixa e entrega o valor atual e a solicitação ao departamento caixa; se for cashback, o caixa diminui R$150; se for criação de contrato, aumenta R$50; nos demais casos, não muda](img/fig-1-7-1.webp)

*Figura 1.7.1: O departamento caixa.*

### Associando os nomes do ciclo Redux à simulação

Cada parte retratada nas simulações feitas até então está associada a um conceito do ciclo Redux. Veja a Figura 1.8.1.

![O ciclo Redux associado à simulação: o cliente é o criador da ação, a solicitação é a ação, o atendente faz o dispatch, os departamentos de pedidos de cashback, novos contratos e caixa são os reducers e a base centralizada é o state](img/fig-1-8-1.webp)

*Figura 1.8.1: Cliente, solicitação, atendente, departamentos e base centralizada no ciclo Redux.*

## O projeto no StackBlitz e os criadores de ação
Duration: 10:00

Nesta seção, implementaremos as funcionalidades da empresa descrita. Para tal, utilizaremos o ambiente **StackBlitz**. Encontre a sua página oficial no link a seguir.

[https://stackblitz.com/](https://stackblitz.com/)

Pode ser de interesse fazer login com o seu GitHub, assim você poderá armazenar seus projetos.

### Novo projeto JavaScript

Na tela inicial do StackBlitz, clique **JavaScript – Blank Project**, como destaca a Figura 2.1.1.

![Tela inicial do StackBlitz com a opção JavaScript Blank project destacada em vermelho entre as opções de novo projeto](img/fig-2-1-1.webp)

*Figura 2.1.1: Criando um projeto JavaScript em branco.*

### Adicionando o Redux como dependência

O Redux é uma biblioteca JavaScript e precisa ser adicionado como dependência do projeto. Para tal, clique sob **DEPENDENCIES**, digite "redux" e aperte Enter. Veja a Figura 2.2.1.

![Editor do StackBlitz com a seção DEPENDENCIES destacada, mostrando redux na versão 4.1.1 e o campo "Enter package name"](img/fig-2-2-1.webp)

*Figura 2.2.1: O Redux como dependência do projeto.*

### Um criador de ação para a criação de contratos

Uma das solicitações previstas no sistema é a criação de contratos. Isso é responsabilidade de um **criador de ações** que, neste caso, será uma simples função. Ela recebe nome e valor da taxa de criação de contrato e devolve uma **ação**. A ação é um simples objeto JSON contendo tipo e os dados de interesse. Veja o Bloco de Código 2.3.1. Estamos no arquivo `index.js`. Caso ele possua algum conteúdo inicial, apague tudo.

<aside class="positive">

**Nota:** Lembre-se de clicar **Save** esporadicamente no canto superior esquerdo da tela.

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

![Ciclo Redux com os três criadores de ação (criarContrato, cancelarContrato, solicitarCashback) ligados a "Criador de uma ação" e os três tipos de ação (CRIAR_CONTRATO, CANCELAR_CONTRATO, SOLICITAR_CASHBACK) ligados a "Ação"](img/fig-2-6-1.webp)

*Figura 2.6.1: Criadores de ação e ações implementados.*

## Os reducers
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

O reducer (uma simples função, lembra?) do Bloco de Código 2.9.1 trata a criação e cancelamento de contratos.

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

![Ciclo Redux com os três criadores de ação, os três tipos de ação e, ligados a "Reducers", os três reducers: historicoDePedidosDeCashback, caixa e contratos](img/fig-2-10-1.webp)

*Figura 2.10.1: Os reducers implementados.*

## A store e o dispatch
Duration: 12:00

### Utilizando o Redux

Até o momento sequer fizemos uso do Redux. Escrevemos apenas algumas funções JavaScript comuns. Passaremos a utilizá-lo nesta seção. Quando utilizamos o Redux, combinamos coleções de criadores de ações com reducers apropriados, obtendo um maquinário capaz de desempenhar o gerenciamento do estado centralizado. O primeiro passo é trazer o Redux para o contexto, como mostra o Bloco de Código 2.11.1. Você pode importá-lo na primeira linha de código do arquivo `index.js`, antes de definir qualquer função.

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

**Nota:** O nome de cada "parte" do estado gerenciado pelo reducer será determinado pela chave escolhida quando `combineReducers` foi chamada. Neste caso, elas serão `historicoDePedidosDeCashback`, `caixa` e `contratos`. Se desejar trocar o nome, basta escolher outro nome. Veja o exemplo do Bloco de Código 2.11.4.

</aside>

**index.js · Bloco de Código 2.11.4 (apenas um exemplo)**

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

### O ciclo completo

A Figura 2.12.1 exibe a implementação completa do ciclo Redux. Observe que o objeto `store` que criamos possui um método chamado `getState`. O objeto devolvido por ele desempenha o papel de estado. Ele pode ser usado assim: `store.getState()`. E o item "dispatch"? Ele é um método do objeto `store` que passaremos a utilizar a seguir. Ele pode ser usado assim: `store.dispatch(acao)`.

![Ciclo Redux completo: três criadores de ação, três tipos de ação, store.dispatch(acao) como método dispatch próprio do store do Redux, os três reducers e store.getState() como estado centralizado manipulado pelo Redux](img/fig-2-12-1.webp)

*Figura 2.12.1: O ciclo Redux implementado.*

### Sequência de ações enviadas ao Redux

O programa do Bloco de Código 2.13.1 realiza as seguintes tarefas em ordem:

* Cria um contrato para José
* Cria um contrato para Maria
* Solicita cashback de 10 para Maria
* Solicita cashback de 20 para José
* Cancela o contrato de Maria

Observe que a execução acontece automaticamente assim que o projeto é salvo. Ele pode ser salvo automaticamente ou você pode clicar **Save** no canto superior esquerdo. Abra o console do navegador (**CTRL + SHIFT + I** no Chrome, por exemplo) para visualizar o resultado.

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

## Exercícios
Duration: 20:00

1. Escreva uma função chamada `transacao`. Ela deve:

   * Receber o objeto `store` como parâmetro.
   * Definir um vetor com quatro nomes de pessoas.
   * Definir um objeto JSON em que as chaves são os valores 0, 1 e 2 e os valores associados são as seguintes funções. Todas elas recebem um nome por parâmetro. As ações que criam envolvem esses nomes.
     * Associada ao valor 0, há uma função que cria uma ação de criação de contrato e faz "dispatch".
     * Associada ao valor 1, há uma função que cria uma ação de cancelamento de contrato e faz "dispatch".
     * Associada ao valor 2, há uma função que sorteia um valor real entre 10 e 30. A seguir, cria uma ação de solicitação de cashback com esse valor e faz "dispatch".

   A função chamada `transacao`, depois de definir o mapa de funções, sorteia um valor entre 0 e 2 e chama a função associada a esse valor, passando como parâmetro o nome de uma pessoa cujo índice também deve ser sorteado.

   No script principal, use `setInterval` para chamar a função `transacao` a cada cinco segundos.

## Exercício extra: vestibular e matrícula
Duration: 30:00

Considere uma instituição de ensino que possui o seguinte funcionamento.

**Departamento de Vestibular**

1. Pessoas interessadas em se matricular realizam um vestibular. Para tal, elas informam seu nome e cpf.
2. Quando uma pessoa faz o vestibular, ela tem uma nota final atribuída, que varia de 0 a 10. Cada pessoa tem 70% de chance de tirar uma nota entre 6 e 10.
3. A instituição tem um departamento para armazenamento do histórico de vestibular. Cada entrada no histórico tem nome, cpf e nota final do candidato a que se refere.

**Departamento de matrícula**

1. O departamento de matrícula permite que alunos aprovados no vestibular se matriculem. Ao se matricular, um aluno informa apenas o seu cpf.
2. Alunos somente podem ser matriculados caso tenham sido aprovados no vestibular.
3. O departamento de matrícula armazena um histórico de todos os alunos que tentam fazer matrícula. Cada entrada no histórico possui o cpf de um aluno e o seu status. Alunos que tentam se matricular e que não foram aprovados no vestibular têm status "NM", de não matriculado. Alunos que tentam se matricular e que foram aprovados no vestibular têm o status "M", de matriculado.

Escreva uma função de teste que oferece as seguintes opções.

* **1. Realizar vestibular.** Esta funcionalidade captura nome e cpf de um candidato e, a seguir, simula a realização da prova do vestibular, armazenando seus dados e um valor gerado (neste momento) aleatoriamente variando no intervalo real [0, 10]. Lembre-se de seguir a distribuição de probabilidade estipulada.
* **2. Realizar matrícula.** Esta funcionalidade captura o cpf de um candidato e, a seguir, tenta fazer a sua matrícula. A sua matrícula somente ocorre caso ele tenha sido considerado aprovado no vestibular. Aprovados são aqueles que têm nota maior ou igual a seis. Lembre-se de controlar os status "M" e "NM".
* **3. Visualizar meu status.** Esta função captura o cpf de um candidato e exibe seu status na lista de matrículas.
* **4. Visualizar lista de aprovados.** Esta função exibe os dados de todos os alunos aprovados no vestibular.
* **0. Sair do sistema.**

Faça a implementação utilizando a biblioteca Redux.

<details><summary>Ver resposta</summary>

**1 (Novo projeto)** Crie uma pasta para abrigar a sua solução. Com um terminal vinculado a ela, use

**Terminal**

```bash
npm init -y
```

para criar o arquivo `package.json`. Use

**Terminal**

```bash
code .
```

para abrir uma instância do VS Code vinculada à pasta. No VS Code, clique **Terminal >> New Terminal** para obter um terminal interno.

**2 (Dependências)** Instale as seguintes dependências. Usaremos o pacote `prompts` para obter dados digitados pelo usuário.

**Terminal**

```bash
npm install redux
npm install prompts
npm install --save-dev nodemon
```

**3 (Novo arquivo e script de execução)** Crie um arquivo chamado `index.js`. A seguir, abra o arquivo `package.json` e adicione o script `start` do Bloco de Código 3.1. Ele viabilizará a execução do projeto com `npm start`.

**package.json · Bloco de Código 3.1**

```json
{
  "name": "sistema_vestibular_matricula",
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
    "prompts": "^2.4.2",
    "redux": "^4.1.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.14"
  }
}
```

No terminal interno do VS Code, use

**Terminal**

```bash
npm start
```

para colocar o aplicativo em execução. Se desejar, clique **Terminal >> New Terminal** novamente para obter outro terminal interno do VS Code.

**4 (Criador de ação: prestar vestibular)** O primeiro criador de ação que definiremos cria uma ação que representa uma prova de vestibular realizada. Veja o Bloco de Código 4.1.

**index.js · Bloco de Código 4.1**

```javascript
const redux = require ('redux')
const prompts = require ('prompts')

// função criadora de ação
// nome e cpf serão capturados via prompt
const realizarVestibular = (nome, cpf) => {
  // nota gerada aleatoriamente
  const entre6e10 = Math.random() <= 0.7;
  const nota = entre6e10 ? Math.random() * 4 + 6 : Math.random() * 5;
  // esse JSON é uma ação
  return {
    type: "REALIZAR_VESTIBULAR",
    payload: {
      nome,
      cpf,
      nota
    }
  };
};
```

**5 (Criador de ação: realizar matrícula)** O criador de ação do Bloco de Código 5.1 cria uma ação que representa uma tentativa de matrícula.

**index.js · Bloco de Código 5.1**

```javascript
// função criadora de ação
// cpf capturado via prompt
// status de acordo com a realização do vestibular
const realizarMatricula = (cpf, status) => {
  // esse JSON é uma ação
  return {
    type: "REALIZAR_MATRICULA",
    payload: {
      cpf, status
    }
  };
};
```

**6 (Reducer: "fatia" do estado que representa o histórico de vestibular)** O reducer do Bloco de Código 6.1 se encarrega de receber uma ação que representa um vestibular realizado e armazená-la no histórico.

**index.js · Bloco de Código 6.1**

```javascript
// essa função é um reducer
const historicoVestibular = (historicoVestibularAtual = [], acao) => {
  if (acao.type === "REALIZAR_VESTIBULAR") {
    return [...historicoVestibularAtual, acao.payload];
  }
  return historicoVestibularAtual;
};
```

**7 (Reducer: "fatia" do estado que representa o histórico de matrículas)** O Bloco de Código 7.1 mostra um reducer responsável por manipular o histórico de matrículas.

**index.js · Bloco de Código 7.1**

```javascript
// essa função é um reducer
const historicoMatriculas = (historicoMatriculasAtual = [], acao) => {
  if (acao.type === "REALIZAR_MATRICULA") {
    return [...historicoMatriculasAtual, acao.payload];
  }
  return historicoMatriculasAtual;
};
```

**8 (Combinando os reducers e criando o store do Redux)** Lembre-se que o objeto "store" do Redux é uma abstração que engloba diferentes funções (incluindo os reducers) e o estado. Para construir um store, primeiro combinamos os reducers com `combineReducers`. Entregamos o seu resultado para a função `createStore`, produzindo assim o objeto store. Veja o Bloco de Código 8.1.

**index.js · Bloco de Código 8.1**

```javascript
const todosOsReducers = redux.combineReducers({
  historicoMatriculas,
  historicoVestibular
});
const store = redux.createStore(todosOsReducers);
```

**9 (Função de teste)** A função de teste oferecerá um menu para o usuário. Ele poderá escolher entre realizar vestibular, realizar matrícula, visualizar seu status de matrícula e visualizar a lista de aprovados no vestibular. Veja a sua definição inicial no Bloco de Código 9.1.

**index.js · Bloco de Código 9.1**

```javascript
// função de teste
const main = async () => {
  const menu =
    "1-Realizar Vestibular\n2-Realizar Matrícula\n3-Visualizar meu status\n4-Visualizar lista de aprovados\n0-Sair"
  let response;
  do {
    response = await prompts({
      type: 'number',
      name: 'op',
      message: menu
    });
    try {
      switch (response.op) {
        case 1:{
          break;
        }
        case 2:{
          break;
        }
        case 3:{
          break;
        }
        case 4:{
          break;
        }
        case 0:
          console.log("Até logo");
          break;
        default:
          console.log("Opção inválida");
          break;
      }
    } catch (err) {
      console.log(err)
      console.log("Digite uma opção válida");
    }
  } while (response.op !== 0);
};
```

Na opção 1, capturamos nome e cpf do usuário e, a seguir, fazemos dispatch de uma ação para realização do vestibular. Veja o Bloco de Código 9.2.

**index.js · Bloco de Código 9.2**

```javascript
...
case 1:{
  const {nome} = await prompts({
    type: 'text',
    name: 'nome',
    message: "Digite seu nome"
  });
  const {cpf} = await prompts({
    type: 'text',
    name: 'cpf',
    message: "Digite seu cpf"
  });
  store.dispatch(realizarVestibular(nome, cpf));
  break;
}
...
```

Na opção 2, capturamos o cpf do usuário e verificamos se ele está aprovado. Se estiver, fazemos a sua matrícula e ele fica com status "M" no histórico. Caso contrário, ele fica com status "NM" no histórico. Veja o Bloco de Código 9.3.

**index.js · Bloco de Código 9.3**

```javascript
...
case 2:{
  const {cpf} = await prompts({
    type: 'text',
    name: 'cpf',
    message: "Digite seu cpf"
  });
  const aprovado = store.getState().historicoVestibular.find(
    aluno => aluno.cpf === cpf && aluno.nota >= 6)
  if (aprovado){
    store.dispatch(realizarMatricula(cpf, "M"))
    console.log ("Ok, matriculado!")
  }
  else{
    store.dispatch(realizarMatricula(cpf, "NM"))
    console.log ("Infelizmente você não foi aprovado no vestibular ainda.")
  }
  break;
}
...
```

Na opção 3, capturamos apenas o cpf do usuário. Se ele estiver matriculado ou se já tiver tentado se matricular, mostramos o seu status, que pode ser M ou NM. Caso contrário, mostramos uma mensagem que indica que ele não existe no histórico de matrículas. Veja o Bloco de Código 9.4.

**index.js · Bloco de Código 9.4**

```javascript
...
case 3:{
  const {cpf} = await prompts({
    type: 'text',
    name: 'cpf',
    message: "Digite seu cpf"
  });
  const aluno = store.getState().historicoMatriculas.find(
    aluno => aluno.cpf === cpf)
  if (aluno){
    console.log (`Seu status é: ${aluno.status}`)
  }
  else{
    console.log("Seu nome não consta na lista de matrículas")
  }
  break;
}
...
```

Na opção 4 mostramos a lista de aprovados no vestibular. Ou seja, aqueles que tiveram nota maior ou igual a 6. Veja o Bloco de Código 9.5.

**index.js · Bloco de Código 9.5**

```javascript
...
case 4:{
  const listaAprovados =
    store.getState().historicoVestibular.filter(aluno => aluno.nota >= 6);
  console.log(listaAprovados);
  break;
}
...
```

Ao final, apenas chamamos a função `main`. Veja o Bloco de Código 9.6.

**index.js · Bloco de Código 9.6**

```javascript
...
const main = async () => {
  ...
};

main()
```

</details>

### Referências

* React: A JavaScript library for building user interfaces. 2021. Disponível em [https://reactjs.org/](https://reactjs.org/). Acesso em agosto de 2021.
* Redux: A predictable state container for JavaScript apps. 2021. Disponível em [https://redux.js.org](https://redux.js.org). Acesso em outubro de 2021.
