summary: Integre o Redux a uma aplicação React com a biblioteca react-redux: criadores de ação, reducers, Provider, connect e mapStateToProps em uma lista de pessoas com detalhes, usando PrimeReact e PrimeFlex.
id: react-react-redux
categories: Redux,React,JavaScript
tags: redux,react-redux,provider,connect,mapstatetoprops,reducers,actions,primereact,primeflex
status: Published
authors: Rodrigo Bossini
last updated: 2022-10-08
pdf: react/09_apostila_react_redux.pdf
exercicios: react/09_exercicios_extras_react_redux.pdf,react/09_exercicios_extras_com_respostas_react_redux.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React com Redux: react-redux

## Visão geral
Duration: 5:00

Como vimos, o Redux é uma biblioteca de manipulação de estado que opera de maneira completamente independente. Nesta seção, veremos como utilizá-lo especificamente em uma aplicação React. A aplicação exibirá uma lista de nomes de pessoas. Quando uma delas for clicada, a aplicação exibirá mais detalhes a seu respeito. Veja a Figura 3.1.

![Janela "React & Redux" com uma lista de nomes (Ana, Carlos, Cristina), cada um com um botão OK, e ao lado um quadro "Detalhes" com primeiro nome Ana, sobrenome Silva e endereço Rua B, 32](img/fig-3-1.webp)

*Figura 3.1: a aplicação que vamos construir.*

<aside class="positive">

**Antes de começar.** As partes 1 e 2 da apostila deste codelab (a introdução ao Redux com a analogia da empresa de cartões com cashback e a implementação em JavaScript puro no StackBlitz) são idênticas ao conteúdo do codelab `react-redux-fundamentos`. Faça-o primeiro: aqui seguimos a partir da parte 3, "Uma aplicação React com Redux".

</aside>

### O que você vai aprender

* Criar o projeto React com PrimeReact e PrimeFlex
* Integrar React e Redux com a biblioteca react-redux
* Organizar criadores de ação e reducers nas pastas `actions` e `reducers`
* Entregar o store aos componentes com o `Provider`
* Ligar componentes ao Redux com `connect` e `mapStateToProps`
* Disparar ações a partir de um componente e exibir o estado em outro

### O que você vai precisar

* Node.js, npm, Git, o VS Code e o Google Chrome
* Os fundamentos do Redux (codelab `react-redux-fundamentos`)

<aside class="negative">

Este material usa create-react-app, `ReactDOM.render`, `createStore` e `connect`, como era usual em 2021. Hoje, a recomendação oficial é usar o Redux Toolkit e os hooks `useSelector` e `useDispatch` da react-redux; `connect` continua funcionando.

</aside>

## Criando a aplicação
Duration: 8:00

As seções a seguir mostram duas formas diferentes para a criação da aplicação. Use a primeira caso nunca tenha feito a instalação da PrimeReact e da PrimeFlex. São as bibliotecas de componentes e de utilitários que utilizaremos. Vale a pena fazer uma primeira vez para aprender. Caso já saiba sobre o assunto e já tenha feito anteriormente, use a segunda.

### Possibilidade 1: novo projeto e instalação passo a passo da PrimeReact e da PrimeFlex

Crie um projeto com

**Terminal**

```bash
npx create-react-app react-redux-pessoas
```

Use

**Terminal**

```bash
cd react-redux-pessoas
```

para navegar até o diretório em que se encontra o seu projeto. Use

**Terminal**

```bash
code .
```

para obter uma instância do VS Code vinculada a esse diretório. No VS Code, clique **Terminal >> New Terminal** para obter um novo terminal interno do VS Code, o que simplifica o trabalho. Neste terminal, digite

**Terminal**

```bash
npm start
```

para colocar a aplicação em funcionamento. Uma janela do seu navegador padrão deve ser aberta fazendo uma requisição a `localhost:3000`.

Apague todos os arquivos existentes na pasta `src`. A seguir, crie uma pasta chamada `components`, subpasta de `src`. Definiremos todos os componentes dessa aplicação em arquivos dentro dela.

Na pasta `components`, crie um arquivo chamado `App.js`. Veja seu conteúdo inicial no Bloco de Código 3.1.1.1.

**src/components/App.js · Bloco de Código 3.1.1.1**

```jsx
import React from 'react'

const App = () => {
  return (
    <div>
      App
    </div>
  )
}

export default App
```

**(Dependências)** Utilizaremos componentes da biblioteca PrimeReact e os utilitários e grid system da PrimeFlex. As suas respectivas documentações podem ser visitadas a seguir.

- PrimeReact: [https://www.primefaces.org/primereact/](https://www.primefaces.org/primereact/)
- PrimeFlex: [https://www.primefaces.org/primeflex/](https://www.primefaces.org/primeflex/)

Faça a instalação da PrimeReact com

**Terminal**

```bash
npm install primereact
npm install primeicons
npm install react-transition-group
```

A PrimeFlex pode ser instalada com

**Terminal**

```bash
npm install primeflex
```

A seguir, importe o CSS da PrimeReact, PrimeIcons, PrimeFlex e um dos temas descritos na documentação, na página **Get Started**. Isso pode ser feito no arquivo `index.js`, que deve ser criado na pasta `src`. Veja o Bloco de Código 3.1.1.2.

**src/index.js · Bloco de Código 3.1.1.2**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import 'primereact/resources/themes/bootstrap4-light-purple/theme.css'

ReactDOM.render(
  <App />,
  document.querySelector('#root')
)
```

### Possibilidade 2: obtendo um modelo inicial que já contém as dependências instaladas

Caso não tenha realizado os passos anteriores, você pode obter uma cópia do projeto com as dependências configuradas. Há um modelo disponível aqui.

[https://github.com/professorbossini/pessoal_react_modelo_primereact_primeflex](https://github.com/professorbossini/pessoal_react_modelo_primereact_primeflex)

Para obter uma cópia para você, execute o seguinte comando usando um terminal vinculado ao diretório que representa o seu workspace (fora de qualquer outro projeto React!)

**Terminal**

```bash
git clone https://github.com/professorbossini/pessoal_react_modelo_primereact_primeflex react-redux-pessoas
```

O projeto obtido conterá um arquivo chamado `package.json` que descreve as dependências. Para fazer o seu download, navegue até a pasta do projeto com

**Terminal**

```bash
cd react-redux-pessoas
```

A seguir, use o seguinte comando para instalar as dependências.

**Terminal**

```bash
npm install
```

Neste momento já deve ser possível colocar o projeto em funcionamento com o seguinte comando.

**Terminal**

```bash
npm start
```

Deve ser possível acessar a aplicação no endereço `localhost:3000` a partir de agora.

A seguir, pode ser interessante alterar a URL associada ao remote `origin` utilizando uma URL de um repositório próprio seu. Assim você poderá fazer seu próprio controle de versão. Para tal, depois de criar um repositório no Github, use

**Terminal**

```bash
git remote set-url origin url-do-seu-repositorio-no-github
```

A partir de agora, as operações push envolvendo o remote `origin` serão direcionadas ao seu repositório remoto. Aliás, você já pode executar o seguinte comando para ter certeza de que tudo está configurado corretamente.

**Terminal**

```bash
git push -u origin master
```

## Componentes, bibliotecas e abordagens
Duration: 8:00

### Os componentes da aplicação

Nossa aplicação terá apenas dois componentes React. Veja a Figura 3.2.1.

![A tela da aplicação com a lista de pessoas identificada como PessoaLista e o quadro de detalhes identificado como PessoaDetalhe](img/fig-3-2-1.webp)

*Figura 3.2.1: os componentes PessoaLista e PessoaDetalhe.*

### As bibliotecas

Nas últimas aulas, já utilizamos diversos recursos do React. Quanto ao Redux, aprendemos a utilizar alguns de seus recursos e vimos que ele é independente de qualquer biblioteca, inclusive do próprio React. É muito comum, entretanto, escrever aplicações que fazem uso de ambas, como é o caso desta aplicação que estamos escrevendo agora. A integração entre ambas se dá por meio de uma outra biblioteca chamada **react-redux**. Veja a Figura 3.3.1.

![Integração entre ambas: React (biblioteca para criação de componentes visuais) ↔ React-Redux ↔ Redux (biblioteca para gerenciamento de estado)](img/fig-3-3-1.webp)

*Figura 3.3.1: a react-redux integra React e Redux.*

Visite a documentação da biblioteca react-redux por meio do Link 3.3.1: [https://react-redux.js.org/](https://react-redux.js.org/)

Use

**Terminal**

```bash
npm install redux
```

para fazer a instalação do Redux. A seguir, use

**Terminal**

```bash
npm install react-redux
```

para fazer a instalação da biblioteca de integração. Ela traz diversas funções utilitárias que simplificarão a integração entre React e Redux.

### Abordagens sem e com Redux

A Figura 3.4.1 mostra uma possível abordagem de implementação para esta aplicação sem utilizar o Redux. Os principais pontos são os seguintes.

I. O componente principal armazena uma lista de pessoas e a pessoa selecionada.

II. O componente principal envia para o componente `PessoaLista`, via props, a lista de pessoas e uma função a ser chamada quando uma pessoa for selecionada.

III. O componente `PessoaLista` chama a função recebida alterando o estado do componente principal.

IV. O componente principal envia para o componente `PessoaDetalhe`, via props, a pessoa selecionada para que ela possa ser exibida.

![O componente App guarda a lista pessoas e a pessoaSelecionada; entrega pessoas e onPessoaSelecionada a PessoaLista e pessoaSelecionada a PessoaDetalhe](img/fig-3-4-1.webp)

*Figura 3.4.1: a abordagem sem Redux.*

Utilizando o Redux, podemos definir reducers para

- criação da lista de pessoas
- seleção de pessoa

E um criador de ação utilizado quando uma pessoa for selecionada. Veja a Figura 3.4.2.

![Ao lado dos componentes React (PessoaLista e PessoaDetalhe dentro de App), o Redux contém os reducers para a lista de pessoas e para a seleção de pessoa e o criador de ação para seleção de pessoa](img/fig-3-4-2.webp)

*Figura 3.4.2: a abordagem com Redux.*

## Criador de ações e reducers
Duration: 8:00

### Pasta e arquivo index.js para o criador de ações

Crie uma pasta chamada `actions`, subpasta de `src`. Nela, crie um arquivo chamado `index.js`. Utilizando este nome, podemos importar o conteúdo especificando somente a pasta em que ele reside, não sendo necessário especificar o nome do arquivo. O Bloco de Código 3.5.1 mostra a definição do único criador de ações da aplicação.

**src/actions/index.js · Bloco de Código 3.5.1**

```javascript
//essa função cria uma ação
export const selecionarPessoa = (pessoa) => {
  //esse JSON é a ação criada
  return {
    type: "PESSOA_SELECIONADA",
    dados: pessoa
  }
}
```

### Os reducers

Crie uma pasta chamada `reducers` e, dentro dela, um arquivo chamado `index.js`. O primeiro reducer que definiremos se encarrega de produzir a lista de pessoas. Observe que ele é bastante simples e não requer nenhum parâmetro. Ele apenas devolve uma lista estática de pessoas. Veja o Bloco de Código 3.6.1.

**src/reducers/index.js · Bloco de Código 3.6.1**

```javascript
const pessoasReducer = () => {
  return [
    {
      nome: 'Cristina', sobrenome: "Silva", endereco: "Rua A, 34"
    },
    {
      nome: "João", sobrenome: "Alves", endereco: "Rua B, 43"
    },
    {
      nome: "Pedro", sobrenome: "Mendes", endereco: "Rua D, 200"
    }
  ]
}
```

A seguir, definimos o reducer para "pessoa selecionada". Ele recebe a pessoa selecionada e uma ação. Se a ação for do tipo adequado, apenas devolve seu objeto `dados`, já que ele armazena a pessoa selecionada. Caso contrário, devolve a pessoa previamente selecionada. Repare na sua simplicidade. Veja o Bloco de Código 3.6.2.

**src/reducers/index.js · Bloco de Código 3.6.2**

```javascript
const pessoasReducer = () => {
  return [
    {
      nome: 'Cristina', sobrenome: "Silva", endereco: "Rua A, 34"
    },
    {
      nome: "João", sobrenome: "Alves", endereco: "Rua B, 43"
    },
    {
      nome: "Pedro", sobrenome: "Mendes", endereco: "Rua D, 200"
    }
  ]
}

const pessoaSelecionadaReducer = (pessoaSelecionada = null, acao) => {
  if (acao.type === 'PESSOA_SELECIONADA'){
    return acao.dados
  }
  return pessoaSelecionada
}
```

Por fim, combinamos os reducers e exportamos o objeto resultante. Veja o Bloco de Código 3.6.3.

**src/reducers/index.js · Bloco de Código 3.6.3**

```javascript
import { combineReducers } from "redux"

const pessoasReducer = () => {
  return [
    {
      nome: 'Cristina', sobrenome: "Silva", endereco: "Rua A, 34"
    },
    {
      nome: "João", sobrenome: "Alves", endereco: "Rua B, 43"
    },
    {
      nome: "Pedro", sobrenome: "Mendes", endereco: "Rua D, 200"
    }
  ]
}

const pessoaSelecionadaReducer = (pessoaSelecionada = null, acao) => {
  if (acao.type == 'PESSOA_SELECIONADA'){
    return acao.dados
  }
  return pessoaSelecionada
}

export default combineReducers({
  pessoas: pessoasReducer,
  pessoaSelecionada: pessoaSelecionadaReducer
})
```

## O Provider e o componente PessoaLista
Duration: 8:00

### O Provider

`Provider` é um componente disponibilizado pela react-redux. Nossos componentes React precisam de acesso ao objeto `store` do Redux. Podemos entregá-lo aos componentes utilizando um `Provider`. Basta que uma tag `Provider` englobe os componentes React. Veja o Bloco de Código 3.7.1. Estamos no arquivo `src/index.js`.

**src/index.js · Bloco de Código 3.7.1**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
// escolha o tema que desejar
// https://primefaces.org/primereact/showcase/#/setup
//escolhemos esse aqui
import 'primereact/resources/themes/bootstrap4-light-purple/theme.css'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducers from './reducers'

ReactDOM.render(
  <Provider store={createStore(reducers)}>
    <App/>
  </Provider>,
  document.querySelector('#root')
)
```

### O componente PessoaLista

Crie um arquivo chamado `PessoaLista.js` na pasta `components` para definir o componente `PessoaLista`. Veja sua definição inicial no Bloco de Código 3.8.1.

**src/components/PessoaLista.js · Bloco de Código 3.8.1**

```jsx
import React, { Component } from 'react'

class PessoaLista extends Component{
  render(){
    return <div>
      Pessoas
    </div>
  }
}

export default PessoaLista
```

No componente `App` (arquivo `App.js`), utilize o componente `PessoaLista` como no Bloco de Código 3.8.2.

**src/components/App.js · Bloco de Código 3.8.2**

```jsx
import React from 'react'
import PessoaLista from './PessoaLista'

const App = () => {
  return (
    <div>
      <PessoaLista />
    </div>
  )
}

export default App
```

Para que o componente `PessoaLista` tenha acesso aos recursos do Redux, utilizamos a função `connect`. Quando chamada, ela devolve uma função que, então, colocamos em execução entregando-lhe como parâmetro o nome do componente. Veja o Bloco de Código 3.8.4. Estamos no arquivo `PessoaLista.js`.

**src/components/PessoaLista.js · Bloco de Código 3.8.4**

```jsx
import React, { Component } from 'react'
import { connect } from 'react-redux'

class PessoaLista extends Component{
  render(){
    return <div>
      Pessoas
    </div>
  }
}

export default connect()(PessoaLista)
```

## A função mapStateToProps
Duration: 10:00

A função `mapStateToProps` tem como finalidade fazer com que o estado gerenciado pelo Redux seja entregue aos componentes via props. O nome faz sentido. Entretanto, trata-se de uma convenção e seu nome pode ser qualquer um. Conheça mais sobre o funcionamento de `mapStateToProps` no Link 3.8.1: [https://react-redux.js.org/using-react-redux/connect-mapstate](https://react-redux.js.org/using-react-redux/connect-mapstate)

Veja uma definição inicial no Bloco de Código 3.9.1. Ali, apenas exibimos o estado para entender o que está acontecendo. Estamos no arquivo `PessoaLista.js`.

**src/components/PessoaLista.js · Bloco de Código 3.9.1**

```jsx
import React, { Component } from 'react'
import { connect } from 'react-redux'

class PessoaLista extends Component{
  render(){
    console.log (this.props)
    return <div>
      Pessoas
    </div>
  }
}

//esse nome é uma convenção apenas
const mapStateToProps = (state) => {
  return {pessoas: state.pessoas }
}

//A função connect é chamada
//Ela recebe mapStateToProps como parâmetro
//a expressão connect(mapStateToProps) resulta em uma função
//ela é chamada com PessoaLista como parâmetro
//O props de PessoaList passa a ter acesso ao estado
export default connect(mapStateToProps)(PessoaLista)
```

Neste momento, visite `localhost:3000` e abra o console do seu navegador. Você deverá ver um resultado parecido com aquele que a Figura 3.9.1 exibe.

![A aplicação exibindo "Pessoas" e o console mostrando um objeto com pessoaSelecionada: null e pessoas, um array com Cristina, João e Pedro](img/fig-3-9-1.webp)

*Figura 3.9.1: o estado completo exibido no console.*

Observe que o estado possui tanto a pessoa selecionada quanto a lista de pessoas. O componente `PessoaLista` está interessado apenas na lista de pessoas. Por isso, faremos com que a função devolva somente esta parte de interesse. Observe que exibimos o objeto `props` do componente no console do navegador. Veja o Bloco de Código 3.9.3.

**src/components/PessoaLista.js · Bloco de Código 3.9.3**

```jsx
import React, { Component } from 'react'
import { connect } from 'react-redux'

class PessoaLista extends Component{
  render(){
    console.log (this.props)
    return <div>
      Pessoas
    </div>
  }
}

const mapStateToProps = (state) => {
  return {pessoas: state.pessoas }
}

export default connect(mapStateToProps)(PessoaLista)
```

Visite novamente `localhost:3000` e verifique o resultado no console. Ele deve ser parecido com aquele que a Figura 3.9.2 exibe.

![Console mostrando o objeto props do componente, com dispatch e pessoas, o array com Cristina, João e Pedro](img/fig-3-9-2.webp)

*Figura 3.9.2: o props de PessoaLista com a lista de pessoas.*

Talvez seja mais didático armazenar a função que a `connect` produz e, num segundo passo, colocá-la em execução. Veja como fazê-lo no bloco a seguir.

**src/components/PessoaLista.js**

```jsx
import React, { Component } from 'react'
import { connect } from 'react-redux'

class PessoaLista extends Component{
  render(){
    console.log (this.props)
    return <div>
      Pessoas
    </div>
  }
}

//esse nome é uma convenção apenas
const mapStateToProps = (state) => {
  console.log(state)
  return {pessoas: state.pessoas }
}

//A função connect é chamada
//Ela recebe mapStateToProps como parâmetro
//a expressão connect(mapStateToProps) resulta em uma função
//ela é chamada com PessoaLista como parâmetro
//O props de PessoaLista passa a ter acesso ao estado
// export default connect(mapStateToProps)(PessoaLista)

// talvez mais didático
const resultadoDaConnect = connect(mapStateToProps)
//esta função tem acesso ao estado e ao componente
//assim, ela pode torná-lo disponível via props do componente
export default resultadoDaConnect (PessoaLista)
```

## Exibindo e selecionando pessoas
Duration: 12:00

### Exibindo a lista

A exibição da lista pode ser feita com uma expressão JSX simples. Lembre-se de utilizar os recursos da PrimeReact e da PrimeFlex. Repare que estamos usando o nome como chave. Para este momento, vamos considerar suficiente. Veja uma possível definição no Bloco de Código 3.10.1. Estamos no arquivo `PessoaLista.js`.

**src/components/PessoaLista.js · Bloco de Código 3.10.1**

```jsx
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'primereact/button'

class PessoaLista extends Component{
  render(){
    return (
      this.props.pessoas.map((pessoa => (
        //filhos em linha, margem abaixo de cada um, borda, centralizado horizontalmente
        <div key={pessoa.nome} className="flex flex-row mb-2 w-6
          border border-round border-1 border-400
          justify-content-center">
          {/* padding, largura */}
          <div className="p-2 w-6">
            <p className="text-center">
              {pessoa.nome}
            </p>
          </div>
          {/* flex e centralizando nos dois eixos */}
          <div className="flex flex-row justify-content-center
            align-items-center">
            <Button
              icon="pi pi-info-circle"
              className="p-button-rounded"
            />
          </div>
        </div>
      )))
    )
  }
}

//esse nome é uma convenção apenas
const mapStateToProps = (state) => {
  console.log(state)
  return {pessoas: state.pessoas }
}

const resultadoDaConnect = connect(mapStateToProps)
export default resultadoDaConnect (PessoaLista)
```

O resultado deve ser parecido com o que exibe a Figura 3.10.1. Como não estamos fazendo uso de nenhum mecanismo para ajuste de layout, como o próprio grid system, é natural que a exibição ocorra a partir do canto superior esquerdo, sem centralização.

![Lista com Cristina, João e Pedro, cada nome em um quadro com um botão redondo de informação](img/fig-3-10-1.webp)

*Figura 3.10.1: a lista de pessoas.*

### Selecionando uma pessoa da lista

Cada item na lista tem um botão associado. Quando clicado, um botão deve fazer com que os detalhes da pessoa associada sejam exibidos. Clicar em um botão, portanto, significa "selecionar uma pessoa". Isso será feito por meio da criação de uma ação do tipo `PESSOA_SELECIONADA`. Lembre-se que nosso criador de ações está definido no arquivo `src/actions/index.js`. Por ser definido em um arquivo chamado `index.js`, ele pode ser importado sem que o nome do arquivo seja especificado. O componente `PessoaLista` precisa de acesso a ele para que possa fazer o vínculo com os botões. Tal como feito com a lista de pessoas, o criador de ações será disponibilizado a ele via props, por meio do uso da função `connect`. Veja o Bloco de Código 3.11.1. Estamos no arquivo `PessoaLista.js`.

**src/components/PessoaLista.js · Bloco de Código 3.11.1**

```jsx
...
import { selecionarPessoa } from '../actions'

class PessoaLista extends Component{
  render(){
    console.log(this.props)
    return (
      this.props.pessoas.map((pessoa => (
        //filhos em linha, margem abaixo de cada um, borda, centralizado horizontalmente
        <div key={pessoa.nome} className="flex flex-row mb-2 w-6 border border-round border-1 border-400 justify-content-center">
          {/* padding, largura */}
          <div className="p-2 w-6">
            <p className="text-center">{pessoa.nome}</p>
          </div>
          {/* flex e centralizando nos dois eixos */}
          <div className="flex flex-row justify-content-center align-items-center">
            <Button
              icon="pi pi-info-circle"
              className="p-button-rounded"
            />
          </div>
        </div>
      )))
    )
  }
}

//esse nome é uma convenção apenas
const mapStateToProps = (state) => {
  return {pessoas: state.pessoas }
}

const resultadoDaConnect = connect(
  mapStateToProps,
  {selecionarPessoa}
)
export default resultadoDaConnect (PessoaLista)
```

A instrução `console.log(this.props)` deve fazer com que um objeto parecido com aquele exibido pela Figura 3.11.1 seja exibido no console do navegador. Repare que a função `selecionarPessoa` agora faz parte do objeto `props` do componente.

![Console mostrando o props de PessoaLista com pessoas (Array(3)) e selecionarPessoa (uma função)](img/fig-3-11-1.webp)

*Figura 3.11.1: `selecionarPessoa` disponível via props.*

A função `selecionarPessoa` pode ser vinculada ao botão como destaca o Bloco de Código 3.11.2. Repare que adicionamos uma instrução `console.log` ao corpo da função `mapStateToProps`. Ocorre que ela é chamada sempre que o estado é atualizado, o que é feito sempre que um botão é clicado. Assim, poderemos ver a pessoa atualmente selecionada sempre que clicarmos num botão.

**src/components/PessoaLista.js · Bloco de Código 3.11.2**

```jsx
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'primereact/button'
import { selecionarPessoa } from '../actions'

class PessoaLista extends Component{
  render(){
    console.log(this.props)
    return (
      this.props.pessoas.map((pessoa => (
        //filhos em linha, margem abaixo de cada um, borda, centralizado horizontalmente
        <div key={pessoa.nome} className="flex flex-row mb-2
          border border-round border-1 border-400 justify-content-center">
          {/* padding, largura */}
          <div className="p-2 w-6">
            <p className="text-center">{pessoa.nome}</p>
          </div>
          {/* flex e centralizando nos dois eixos */}
          <div className="flex flex-row justify-content-center align-items-center">
            <Button
              icon="pi pi-info-circle"
              className="p-button-rounded"
              onClick={() => this.props.selecionarPessoa(pessoa)}
            />
          </div>
        </div>
      )))
    )
  }
}

//esse nome é uma convenção apenas
const mapStateToProps = (state) => {
  console.log(state)
  return { pessoas: state.pessoas }
}

const resultadoDaConnect = connect(
  mapStateToProps,
  {selecionarPessoa}
)
export default resultadoDaConnect (PessoaLista)
```

Visite `localhost:3000` no seu navegador e clique em algum botão. No Chrome Dev Tools (`CTRL + SHIFT + I`), verifique se o resultado é parecido com o que exibe a Figura 3.11.2.

![Console mostrando o estado com pessoaSelecionada preenchida com Cristina (sobrenome Silva, endereço Rua A, 34) após o clique](img/fig-3-11-2.webp)

*Figura 3.11.2: a pessoa selecionada no estado.*

## O componente PessoaDetalhe
Duration: 12:00

É chegada a hora de implementar o componente `PessoaDetalhe`. Lembre-se de que ele será exibido de acordo com as seleções que o usuário fizer no componente `PessoaLista`: um botão clicado faz com que os dados da pessoa associada sejam exibidos por ele. Para defini-lo, crie um arquivo chamado `PessoaDetalhe.js` na pasta `components`. Veja o seu conteúdo inicial no Bloco de Código 3.12.1. Observe que criamos um componente usando uma função. Assim podemos estudar a forma como a função `connect` pode ser usada com componentes definidos dessa forma.

**src/components/PessoaDetalhe.js · Bloco de Código 3.12.1**

```jsx
import React from 'react'
import { connect } from 'react-redux'

const PessoaDetalhe = () => {
  return <div>
    PessoaDetalhe
  </div>
}

export default PessoaDetalhe
```

A seguir, definimos a função — comumente, mas não obrigatoriamente — chamada `mapStateToProps`. Ela recebe o estado inteiro e devolve as partes de interesse para esse componente. Elas serão disponibilizadas a ele por meio de seu objeto `props`. Veja o Bloco de Código 3.12.2.

**src/components/PessoaDetalhe.js · Bloco de Código 3.12.2**

```jsx
import React from 'react'
import { connect } from 'react-redux'

const PessoaDetalhe = () => {
  return <div>
    PessoaDetalhe
  </div>
}

const mapStateToProps = (state) => {
  return {
    // o componente poderá acessar o objeto referenciado por pessoa
    // usando seu objeto props
    pessoa: state.pessoaSelecionada
  }
}

export default PessoaDetalhe
```

Como fizemos anteriormente, chamamos a função `connect` entregando a ela a função `mapStateToProps`. Ela produz uma função que é chamada logo a seguir, recebendo o componente como parâmetro. Veja o Bloco de Código 3.12.3.

**src/components/PessoaDetalhe.js · Bloco de Código 3.12.3**

```jsx
import React from 'react'
import { connect } from 'react-redux'

const PessoaDetalhe = () => {
  return <div>
    PessoaDetalhe
  </div>
}

const mapStateToProps = (state) => {
  return {
    // o componente poderá acessar o objeto referenciado por pessoa
    // usando seu objeto props
    pessoa: state.pessoaSelecionada
  }
}

export default connect(mapStateToProps)(PessoaDetalhe)
```

O componente será filho do componente `App`, definido no arquivo `App.js`. Veja o Bloco de Código 3.12.4.

**src/components/App.js · Bloco de Código 3.12.4**

```jsx
import React from 'react'
import PessoaLista from './PessoaLista'
import PessoaDetalhe from './PessoaDetalhe'

const App = () => {
  return (
    <div className="grid border border-1 border-400 m-2">
      <div className="col-6">
        <PessoaLista />
      </div>
      <div className="col-6">
        <PessoaDetalhe />
      </div>
    </div>
  )
}

export default App
```

O resultado esperado aparece na Figura 3.12.1.

![A lista de pessoas à esquerda e o texto "PessoaDetalhe" à direita, dentro de um grid com borda](img/fig-3-12-1.webp)

*Figura 3.12.1: PessoaLista e PessoaDetalhe lado a lado.*

No arquivo `PessoaDetalhe.js`, faça o ajuste mostrado no Bloco de Código 3.12.5 (o componente passa a receber `props` e a exibir o nome da pessoa) e faça novos testes clicando nos botões no navegador. Você deverá ver o nome da pessoa selecionada.

**src/components/PessoaDetalhe.js · Bloco de Código 3.12.5**

```jsx
import React from 'react'
import { connect } from 'react-redux'

const PessoaDetalhe = (props) => {
  return <div>
    {props.pessoa?.nome}
  </div>
}

const mapStateToProps = (state) => {
  return {
    // o componente poderá acessar o objeto referenciado por pessoa
    // usando seu objeto props
    pessoa: state.pessoaSelecionada
  }
}

export default connect(mapStateToProps)(PessoaDetalhe)
```

Observe a notação `props.pessoa?.nome`. A notação `?.` caracteriza o uso do **operador de encadeamento opcional**. Estamos tomando o cuidado de somente acessar a propriedade `nome` de `pessoa.nome` caso, de fato, exista uma pessoa selecionada. Assim que a aplicação inicia, não há pessoa alguma selecionada e, portanto, o acesso sem verificação causaria um erro em tempo de execução. Veja mais sobre o operador de encadeamento opcional no Link 3.12.1: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

Resta fazer a exibição dos demais detalhes da pessoa selecionada. Observe, no Bloco de Código 3.12.6, como optamos por fazê-lo usando um `Card` da PrimeReact. Estamos no arquivo `PessoaDetalhe.js`.

**src/components/PessoaDetalhe.js · Bloco de Código 3.12.6**

```jsx
import React from 'react'
import { connect } from 'react-redux'
import { Card } from 'primereact/card'

const PessoaDetalhe = (props) => {
  return <Card title="Detalhes">
    <h3 className="text-center">{props.pessoa?.nome} {props.pessoa?.sobrenome}</h3>
    <p className="text-center">{props.pessoa?.endereco}</p>
  </Card>
}

const mapStateToProps = (state) => {
  return {
    // o componente poderá acessar o objeto referenciado por pessoa
    // usando seu objeto props
    pessoa: state.pessoaSelecionada
  }
}

export default connect(mapStateToProps)(PessoaDetalhe)
```

## Exercícios
Duration: 40:00

Considere uma instituição de ensino que possui o seguinte funcionamento.

### Departamento de Vestibular

1. Pessoas interessadas em se matricular realizam um vestibular. Para tal, elas informam seu nome e cpf.
2. Quando uma pessoa faz o vestibular, ela tem uma nota final atribuída, que varia de 0 a 10. Cada pessoa tem 70% de chance de tirar uma nota entre 6 e 10.
3. A instituição tem um departamento para armazenamento do histórico de vestibular. Cada entrada no histórico tem nome, cpf e nota final do candidato a que se refere.

### Departamento de matrícula

1. O departamento de matrícula permite que alunos aprovados no vestibular se matriculem. Ao se matricular, um aluno informa apenas o seu cpf.
2. Alunos somente podem ser matriculados caso tenham sido aprovados no vestibular.
3. O departamento de matrícula armazena um histórico de todos os alunos que fazem matrícula. Cada entrada no histórico possui o cpf de um aluno e o seu status. Alunos que tentam se matricular e que não foram aprovados no vestibular têm status "NM", de não matriculado. Alunos que tentam se matricular e que foram aprovados no vestibular têm o status "M", de matriculado.

### O que fazer

Escreva uma função de teste que oferece as seguintes opções.

1. **Realizar vestibular.** Esta funcionalidade captura nome e cpf de um candidato e, a seguir, simula a realização da prova do vestibular, armazenando seus dados e um valor gerado — neste momento — aleatoriamente variando no intervalo real [0, 10]. Lembre-se de seguir a distribuição de probabilidade estipulada.
2. **Realizar matrícula.** Esta funcionalidade captura o cpf de um candidato e, a seguir, tenta fazer a sua matrícula. A sua matrícula somente ocorre caso ele tenha sido considerado aprovado no vestibular. Aprovados são aqueles que têm nota maior ou igual a seis.
3. **Visualizar meu status.** Esta função captura o cpf de um candidato e exibe seu status (na lista de matrículas).
4. **Visualizar lista de aprovados.** Esta função exibe o cpf (na versão com respostas, os dados) de todos os alunos aprovados no vestibular.

0. **Sair do sistema.**

Faça a implementação utilizando a biblioteca Redux.

<details><summary>Ver resposta</summary>

#### 1. Novo projeto

Crie uma pasta para abrigar a sua solução. Com um terminal vinculado a ela, use

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

#### 2. Dependências

Instale as seguintes dependências. Usaremos o pacote **prompts** para obter dados digitados pelo usuário.

**Terminal**

```bash
npm install redux
npm install prompts
npm install --save-dev nodemon
```

#### 3. Novo arquivo e script de execução

Crie um arquivo chamado `index.js`. A seguir, abra o arquivo `package.json` e adicione o script `start` mostrado no Bloco de Código 3.1. Ele viabilizará a execução do projeto com `npm start`.

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

#### 4. Criador de ação: prestar vestibular

O primeiro criador de ação que definiremos cria uma ação que representa uma prova de vestibular realizada. Veja o Bloco de Código 4.1.

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

#### 5. Criador de ação: realizar matrícula

O criador de ação do Bloco de Código 5.1 cria uma ação que representa uma tentativa de matrícula.

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

#### 6. Reducer: "fatia" do estado que representa o histórico de vestibular

O reducer do Bloco de Código 6.1 se encarrega de receber uma ação que representa um vestibular realizado e armazená-la no histórico.

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

#### 7. Reducer: "fatia" do estado que representa o histórico de matrículas

O Bloco de Código 7.1 mostra um reducer responsável por manipular o histórico de matrículas.

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

#### 8. Combinando os reducers e criando o store do Redux

Lembre-se que o objeto "store" do Redux é uma abstração que engloba diferentes funções — incluindo os reducers — e o estado. Para construir um store, primeiro combinamos os reducers com `combineReducers`. Entregamos o seu resultado para a função `createStore`, produzindo assim o objeto store. Veja o Bloco de Código 8.1.

**index.js · Bloco de Código 8.1**

```javascript
const todosOsReducers = redux.combineReducers({
  historicoMatriculas,
  historicoVestibular
});
const store = redux.createStore(todosOsReducers);
```

#### 9. Função de teste

A função de teste oferecerá um menu para o usuário. Ele poderá escolher entre realizar vestibular, realizar matrícula, visualizar seu status de matrícula e visualizar a lista de aprovados no Vestibular. Veja a sua definição inicial no Bloco de Código 9.1.

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
  } while (response.op !== 0);};
```

<aside class="negative">

No PDF, os casos 3 e 4 do Bloco de Código 9.1 aparecem sem a chave de fechamento `}`, o que é um erro de sintaxe. As chaves foram acrescentadas acima, como nos blocos 9.4 e 9.5.

</aside>

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

## Referências
Duration: 3:00

Parabéns! Você integrou o Redux a uma aplicação React com `Provider`, `connect` e `mapStateToProps`.

* React – A JavaScript library for building user interfaces. 2021. Disponível em [https://reactjs.org/](https://reactjs.org/). Acesso em agosto de 2021.
* Redux - A predictable state container for JavaScript apps. | Redux. 2021. Disponível em [https://redux.js.org](https://redux.js.org). Acesso em outubro de 2021.
