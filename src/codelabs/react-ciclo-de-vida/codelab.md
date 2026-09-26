summary: Estude o ciclo de vida de componentes React definidos com classes (construtor, render, componentDidMount, componentDidUpdate e componentWillUnmount), passe estado via props, use timers com limpeza, exiba um spinner e defina valores padrão com defaultProps.
id: react-ciclo-de-vida
categories: React,JavaScript
tags: react,ciclo de vida,componentdidmount,componentdidupdate,componentwillunmount,props,defaultprops,primereact,create-react-app
status: Published
authors: Rodrigo Bossini
last updated: 2022-10-08
pdf: react/06_apostila_react_ciclo_de_vida_de_componentes.pdf
exercicios: react/06_exercicios_react_ciclo_de_vida_de_componentes.pdf,react/06_exercicios_com_respostas_react_ciclo_de_vida_de_componentes.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React: ciclo de vida de componentes

## Visão geral
Duration: 6:00

Componentes React definidos por meio de classes possuem um **ciclo de vida** que é caracterizado pela seguinte coleção de métodos. O construtor também faz parte dele.

- O construtor
- O método `render`
- O método `componentDidMount`
- O método `componentDidUpdate`
- O método `componentWillUnmount`

<aside class="positive">

**Nota.** Há outros métodos que fazem parte do ciclo de vida de componentes React. Alguns são obsoletos e outros são raramente utilizados. Veja o Link 1.1: [https://reactjs.org/docs/react-component.html](https://reactjs.org/docs/react-component.html)

</aside>

A Figura 1.1 ilustra o funcionamento do ciclo de vida de um componente React. É importante observar que cada componente tem o seu próprio ciclo de vida.

![Fluxograma: navegador obtém index.js, o construtor entra em execução, o método render entra em execução, o DOM é atualizado e o componente fica visível, componentDidMount entra em execução e o componente aguarda interações; a cada atualização, render executa, o componente é atualizado e componentDidUpdate executa; quando o componente começa a ser removido do DOM, componentWillUnmount executa e o componente é removido](img/fig-1-1.webp)

*Figura 1.1: o ciclo de vida de um componente React.*

Neste material, utilizamos a aplicação desenvolvida anteriormente (a Estação Climática, do codelab `react-componentes-com-classes`) para estudar as principais características do ciclo de vida de componentes React.

### O que você vai aprender

* Quando cada método do ciclo de vida é executado e para que serve
* Obter dados iniciais no `componentDidMount`
* Inicializar o estado sem escrever um construtor
* Dividir a aplicação em componentes e passar estado e funções via props
* Criar um timer com `setInterval` e liberá-lo no `componentWillUnmount`
* Exibir um Spinner do Bootstrap e definir valores padrão de props com `defaultProps`

### O que você vai precisar

* O projeto `estacao-climatica` do codelab `react-componentes-com-classes`
* Node.js, npm, o VS Code e o Google Chrome com o Chrome Dev Tools

<aside class="negative">

Este material usa componentes de classe, create-react-app e `ReactDOM.render`/`ReactDOM.unmountComponentAtNode`, como era usual em 2021. Com componentes funcionais, o mesmo papel é cumprido pelo hook `useEffect` (veja o codelab `react-useeffect`).

</aside>

## Testando os métodos do ciclo de vida
Duration: 10:00

### Abrindo o projeto

Abra um terminal e utilize

**Terminal**

```bash
cd diretorio-em-que-se-encontra-o-seu-projeto
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

### Registrando a execução de cada método

No arquivo `index.js`, inclua o conteúdo exibido no Bloco de Código 2.2.1. Implementamos os métodos do ciclo de vida do componente e exibimos uma mensagem de log, apenas para registrar a sua execução.

**src/index.js · Bloco de Código 2.2.1**

```jsx
class App extends React.Component {
…
  constructor(props) {
    super(props)
    this.state = {
      latitude: null,
      longitude: null,
      estacao: null,
      data: null,
      icone: null,
      mensagemDeErro: null
    }
    console.log('construtor')
  }
…
  componentDidMount(){
    console.log('componentDidMount')
  }

  componentDidUpdate (){
    console.log('componentDidUpdate')
  }

  componentWillUnmount (){
    console.log('componentWillUnmount')
  }

  render() {
    console.log("render")
    return (
      ...
```

Abra o Chrome Dev Tools (`CTRL + SHIFT + I`) e clique no botão da aplicação algumas vezes, como mostra a Figura 2.2.1. O resultado esperado aparece na Figura 2.2.2.

![Aplicação exibindo "Inverno", as coordenadas e a data, com o botão "Qual a minha estação?" destacado](img/fig-2-2-1.webp)

*Figura 2.2.1: clique no botão algumas vezes.*

![Console com "construtor", "render" e "componentDidMount" anotados como "Aplicação começou" e, em seguida, pares "render" e "componentDidUpdate" anotados como "Executa a cada clique no botão"](img/fig-2-2-2.webp)

*Figura 2.2.2: a ordem de execução dos métodos do ciclo de vida.*

O método `componentWillUnmount` somente é colocado em execução quando um componente é removido do DOM. Apenas com o intuito de simular o seu funcionamento, adicione o botão **Unmount** mostrado no Bloco de Código 2.2.2. Utilizamos o método `unmountComponentAtNode` de `ReactDOM` para fazer a remoção do `div` cujo id é `root`.

**src/index.js · Bloco de Código 2.2.2**

```jsx
...
<button onClick={this.obterLocalizacao} className="btn btn-outline-primary w-100 mt-2">Qual a minha estação?</button>
<button className="btn btn-outline-danger w-100 mt-2"
  onClick={() =>
    ReactDOM.unmountComponentAtNode(document.querySelector('#root'))}>
  Unmount
</button>
</div>
...
```

A Figura 2.2.3 mostra o resultado esperado no console.

![Console exibindo construtor, render, componentDidMount e, por último, componentWillUnmount destacado](img/fig-2-2-3.webp)

*Figura 2.2.3: `componentWillUnmount` executado ao remover o componente.*

Lembre-se que o componente principal da aplicação, representado por `App`, é filho da `div` cujo id é `root`. Quando ela é removida do DOM, todos os seus filhos também são. Isso quer dizer que, após clicar no botão de teste, o componente `App` será removido e a tela deverá ficar em branco. Depois do teste você pode remover o botão adicionado neste passo. Remova também os métodos do ciclo de vida e logs realizados pelo método `render` e pelo construtor. Eles poderão ser implementados no futuro, quando necessário.

## Para que serve cada método
Duration: 5:00

A Tabela 2.2.1 mostra exemplos de aplicações para cada método, incluindo o construtor, do ciclo de vida de componentes React.

**Tabela 2.2.1**

| Método / Construtor | Uso |
| --- | --- |
| Construtor | Executa uma única vez quando o componente é instanciado. Bom momento para fazer configurações iniciais que precisam ser feitas uma única vez. |
| `render` | Chamado logo depois de o componente ser instanciado e toda vez que ele tiver seu estado atualizado. Idealmente, o método `render` se encarrega apenas de produzir a expressão JSX, por questões de desempenho. |
| `componentDidMount` | Comumente utilizado para fazer a obtenção de dados iniciais, necessários para a exibição do componente, o que pode ser feito por meio de uma requisição HTTP, por exemplo. |
| `componentDidUpdate` | Obtenção de dados novos, possivelmente via novas requisições HTTP, em função de atualizações feitas no estado do componente. |
| `componentWillUnmount` | Hora certa para liberar recursos alocados. Um timer alocado pelo componente poderia ser desalocado aqui, por exemplo. |

<aside class="positive">

**Nota.** É recomendável reservar o construtor para atividades mais rápidas, como inicializar o estado do componente. O método `componentDidMount`, por outro lado, pode ser utilizado para atividades de inicialização um pouco mais demoradas, especialmente pelo fato de, no momento de sua execução, o componente já estar visível para o usuário. Em geral, é melhor mostrar um componente parcialmente visível para o usuário rapidamente do que demorar muito para mostrar um componente completo.

</aside>

## componentDidMount e estado sem construtor
Duration: 6:00

### Obtendo as informações do usuário com o método componentDidMount

Suponha que desejamos exibir a estação climática do usuário já no momento em que a aplicação entra em execução. Podemos fazê-lo, por exemplo, no método `componentDidMount`. Caso deseje, ele pode clicar no botão para atualizar as informações exibidas. Veja uma possível implementação do método `componentDidMount` no Bloco de Código 2.3.1.

**src/index.js · Bloco de Código 2.3.1**

```jsx
class App extends React.Component {
  ...
  componentDidMount(){
    this.obterLocalizacao()
  }
  ...
```

Ao atualizar a aplicação no navegador, o resultado será diferente dependendo das configurações de permissão do usuário:

- Caso o navegador esteja configurado para permitir o acesso à localização, as informações serão exibidas imediatamente.
- Caso o navegador esteja configurado para bloquear o acesso à localização, a aplicação deverá exibir o texto que diz ao usuário que ele precisará tentar novamente mais tarde.
- Caso ainda não exista opção previamente selecionada, o navegador deverá perguntar ao usuário se ele permite o acesso às suas informações de localização assim que a aplicação for carregada.

Para fazer testes, você pode configurar o navegador para que ele pergunte ao usuário se ele deseja permitir ou bloquear o acesso às suas informações de localização, como mostra a Figura 2.3.1.

![Painel de informações do site aberto pelo ícone ao lado da barra de endereço, com a opção Location alterada para "Ask (default)"](img/fig-2-3-1.webp)

*Figura 2.3.1: configurando o navegador para perguntar ao usuário.*

Atualize o navegador após fazer essa atualização.

### Inicialização do estado sem utilizar o construtor

É possível inicializar o estado da aplicação sem utilizar o construtor. Essa possibilidade pode ser de interesse por ser menos "verbosa". A inicialização de estado sem construtor é feita como mostra o Bloco de Código 2.4.1.

**src/index.js · Bloco de Código 2.4.1**

```jsx
class App extends React.Component {
  //o construtor deixa de ser escrito explicitamente, comentamos a sua definição
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     latitude: null,
  //     longitude: null,
  //     estacao: null,
  //     data: null,
  //     icone: null,
  //     mensagemDeErro: null
  //   }
  //   console.log('construtor')
  // }

  //inicializando o estado sem usar o construtor.
  state = {
    latitude: null,
    longitude: null,
    estacao: null,
    data: null,
    icone: null,
    mensagemDeErro: null
  }
```

## Refatorando: componente EstacaoClimatica
Duration: 12:00

Nossa aplicação possui um único componente responsável por resolver todos os problemas, o que viola diversos princípios do desenvolvimento, como a alta coesão. Como sabemos, essa prática tende a dar origem a código de difícil manutenção, baixo nível de reusabilidade etc. Por essa razão, vamos criar um componente cuja finalidade será apenas exibir os dados referentes à estação climática e data, uma vez que eles estiverem disponíveis.

- Começamos criando um arquivo chamado `EstacaoClimatica.js` na pasta `src`. Para tal, clique com direito sobre ela e escolha **New File**.
- A seguir, faça a definição do componente como mostra o Bloco de Código 2.5.1. Note que utilizamos a mesma definição existente no arquivo `index.js`, começando a partir da definição do cartão do Bootstrap. Assim, basta recortar esse trecho e colar no corpo do novo componente.

**src/EstacaoClimatica.js · Bloco de Código 2.5.1**

```jsx
import React from 'react'

export class EstacaoClimatica extends React.Component {
  render ( ){
    return (
      <div className="card">
        {/* o corpo do cartão */}
        <div className="card-body">
          {/* centraliza verticalmente, margem abaixo */}
          <div className="d-flex align-items-center border rounded mb-2" style={{ height: '6rem' }}>
            {/* ícone obtido do estado do componente */}
            <i className={`fas fa-5x ${this.state.icone}`}></i>
            {/* largura 75%, margem no à esquerda (start), fs aumenta a fonte */}
            <p className=" w-75 ms-3 text-center fs-1">{this.state.estacao}</p>
          </div>
          <div>
            <p className="text-center">
              {/* renderização condicional */}
              {
                this.state.latitude ?
                  `Coordenadas: ${this.state.latitude}, ${this.state.longitude}. Data: ${this.state.data}`
                :
                  this.state.mensagemDeErro ?
                    `${this.state.mensagemDeErro}`
                  :
                    'Clique no botão para saber a sua estação climática'
              }
            </p>
          </div>
          {/* botão azul (outline, 100% de largura e margem acima) */}
          <button onClick={this.obterLocalizacao} className="btn btn-outline-primary w-100 mt-2">Qual a minha estação?</button>
        </div>
      </div>
    )
  }
}
```

- A seguir, ajustamos o arquivo `index.js` para que o componente principal passe a fazer uso do componente recém-criado. Veja o Bloco de Código 2.5.2.

**src/index.js · Bloco de Código 2.5.2**

```jsx
...
import { EstacaoClimatica } from './EstacaoClimatica'

class App extends React.Component {
…
  render() {
    // console.log("render")
    return (
      // responsividade, margem acima
      <div className="container mt-2">
        {/* uma linha, conteúdo centralizado, display é flex */}
        <div className="row justify-content-center">
          {/* oito colunas das doze disponíveis serão usadas para telas médias em diante */}
          <div className="col-md-8">
            <EstacaoClimatica />
          </div>
        </div>
      </div>
    )
  }
...
```

- Salve ambos arquivos e atualize a aplicação no navegador. Repare que ele mostra um erro, que deve ser parecido com aquele que a Figura 2.5.1 destaca.

![Tela de erro do create-react-app: "TypeError: Cannot read property 'icone' of null" em EstacaoClimatica.render, apontando a linha que usa this.state.icone](img/fig-2-5-1.webp)

*Figura 2.5.1: o componente tenta ler um estado que não existe.*

O que acontece é que o componente `EstacaoClimatica` está tentando acessar os dados de interesse utilizando a expressão `this.state`. Ela se refere a seu estado em particular e não ao estado do componente principal. Além disso, ele ainda não foi definido. Aliás, cada componente tem seu próprio estado que, a princípio, não pode ser acessado pelos demais. Como o componente principal é responsável por obter os dados de interesse e os armazenar em seu próprio estado, precisamos de algum mecanismo que permita que ele os entregue ao componente `EstacaoClimatica` uma vez que estiverem disponíveis. Para tal, o componente `App` pode entregar partes de seu estado ao componente `EstacaoClimatica` utilizando o mecanismo **props**. A Figura 2.5.2 ilustra a ideia.

![Diagrama: o componente App, com this.state.latitude = -23.945672, contém o componente EstacaoClimatica, que exibe {props.latitude}; nota: "Componente App entrega partes de seu estado local ao componente EstacaoClimatica via props"](img/fig-2-5-2.webp)

*Figura 2.5.2: o estado do pai chega ao filho via props.*

## Passando estado via props
Duration: 10:00

Ajustamos, portanto, o componente `EstacaoClimatica` (arquivo `EstacaoClimatica.js`) para que ele acesse os dados de interesse por meio de seu objeto `props`. Em particular, repare que a função que entra em execução quando o botão é clicado permanece fazendo parte do componente `App`, já que ela altera seu estado. Assim, ela também deve ser passada via props. Veja o Bloco de Código 2.5.3.

**src/EstacaoClimatica.js · Bloco de Código 2.5.3**

```jsx
export class EstacaoClimatica extends React.Component {
  render(){
    return (
      <div className="card">
        {/* o corpo do cartão */}
        <div className="card-body">
          {/* centraliza verticalmente, margem abaixo */}
          <div className="d-flex align-items-center border rounded mb-2"
            style={{ height: '6rem' }}>
            {/* ícone obtido do estado do componente */}
            <i className={`fas fa-5x ${this.props.icone}`}></i>
            {/* largura 75%, margem no à esquerda (start), fs aumenta a fonte */}
            <p className=" w-75 ms-3 text-center fs-1">{this.props.estacao}</p>
          </div>
          <div>
            <p className="text-center">
              {/* renderização condicional */}
              {
                this.props.latitude ?
                  `Coordenadas: ${this.props.latitude}, ${this.props.longitude}. Data: ${this.props.data}`
                :
                  this.props.mensagemDeErro ?
                    `${this.props.mensagemDeErro}`
                  :
                    'Clique no botão para saber a sua estação climática'
              }
            </p>
          </div>
          {/* botão azul (outline, 100% de largura e margem acima) */}
          <button onClick={this.props.obterLocalizacao} className="btn btn-outline-primary w-100 mt-2">Qual a minha estação?</button>
        </div>
      </div>
    )
  }}
```

O Bloco de Código 2.5.4 mostra a forma como o componente `App` entrega partes do seu estado ao componente `EstacaoClimatica` via props, incluindo a função de obtenção de localização (que, a rigor, não faz parte de seu estado).

**src/index.js · Bloco de Código 2.5.4**

```jsx
…
class App extends React.Component {
…
  render() {
    // console.log("render")
    return (
      // responsividade, margem acima
      <div className="container mt-2">
        {/* uma linha, conteúdo centralizado, display é flex */}
        <div className="row justify-content-center">
          {/* oito colunas das doze disponíveis serão usadas para telas médias em diante */}
          <div className="col-md-8">
            <EstacaoClimatica
              icone={this.state.icone}
              estacao={this.state.estacao}
              latitude={this.state.latitude}
              longitude={this.state.longitude}
              data={this.state.data}
              mensagemDeErro={this.state.mensagemDeErro}
              obterLocalizacao={this.obterLocalizacao}
            />
          </div>
        </div>
      </div>
    )
  }
...
```

Repare que o componente `EstacaoClimatica` recebe partes do estado do componente `App` e as atualiza utilizando uma função que também pertence ao componente `App`. Assim, o componente `EstacaoClimatica` somente pode alterar o estado do componente `App` indiretamente, utilizando uma função que ele mesmo define e decide passar via props. Feita a atualização do estado do componente `App`, o novo valor é entregue ao componente `EstacaoClimatica` via props, que se atualiza. Veja a Figura 2.5.3.

![Diagrama de sequência ao longo do tempo entre App e EstacaoClimatica: App usa EstacaoClimatica entregando partes de seu estado (latitude=null) e a função obterLocalizacao; o botão é clicado e obterLocalizacao atualiza o estado de App; o novo valor (latitude=-23.97) é passado via props; o componente recebe o novo valor e se atualiza](img/fig-2-5-3.webp)

*Figura 2.5.3: o fluxo de dados entre os dois componentes.*

## Um timer e o componentWillUnmount
Duration: 12:00

Suponha que desejamos que o horário, uma vez exibido, seja incrementado a cada segundo. Utilizando Javascript "puro", podemos conseguir esse efeito usando a função `setInterval`. Lembre-se que ela recebe uma função e um valor numérico — em milissegundos — como parâmetro. A sua missão é agendar a execução da função, o que deve acontecer a cada intervalo de tempo especificado. Quando a repetição não for mais de interesse, devemos chamar a função `clearInterval`, a fim de evitar que a execução agendada prossiga indefinidamente. Isso será feito no método `componentWillUnmount`.

- Declaramos uma variável que referenciará o timer criado. É por meio dela que poderemos cancelar a sua execução, quando necessário. Veja o Bloco de Código 2.7.1.

**src/EstacaoClimatica.js · Bloco de Código 2.7.1**

```jsx
...
export class EstacaoClimatica extends React.Component {
...
  timer = null
...
```

O componente `EstacaoClimatica` será o responsável por atualizar a data a cada segundo. Por isso, ela passa a ser definida em seu estado, como mostra o Bloco de Código 2.7.2.

**src/EstacaoClimatica.js · Bloco de Código 2.7.2**

```jsx
export class EstacaoClimatica extends React.Component {
  state = {
    data: null
  }
...
```

- Definimos os métodos do ciclo de vida do componente `EstacaoClimatica`, registrando a sua execução no console. Além disso, o timer é colocado em execução assim que o componente é renderizado e cancelado quando ele estiver prestes a ser removido. Veja o Bloco de Código 2.7.3.

**src/EstacaoClimatica.js · Bloco de Código 2.7.3**

```jsx
export class EstacaoClimatica extends React.Component {
  timer = null

  componentDidMount(){
    console.log("componentDidMount")
    this.timer = setInterval (() => {
      this.setState({data: new Date().toLocaleTimeString()})
    }, 1000)
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    clearInterval(this.timer)
  }

  componentDidUpdate(){
    console.log ('componentDidUpdate')
  }

  render(){
    console.log ('render')
...
```

- O componente deixa de utilizar a data recebida via props e passa a utilizar aquela definida em seu estado. Veja o Bloco de Código 2.7.4. Além disso, ele deixa de verificar se uma mensagem de erro deve ser exibida, pois ele somente será renderizado caso o usuário tenha dado permissão de acesso à localização.

**src/EstacaoClimatica.js · Bloco de Código 2.7.4**

```jsx
...
<div>
  <p className="text-center">
    {/* renderização condicional */}
    {
      this.props.latitude ?
        `Coordenadas: ${this.props.latitude}, ${this.props.longitude}. Data: ${this.state.data}`
      :
        'Clique no botão para saber a sua estação climática'
    }
  </p>
</div>
...
```

- O componente `App`, por sua vez, deixa de passar data e mensagem de erro ao componente `EstacaoClimatica`. Ele decide o que exibir em função da variável `mensagemDeErro`, que faz parte de seu estado. O componente `EstacaoClimatica` somente será colocado na árvore caso não exista uma mensagem de erro armazenada. Caso contrário, um componente textual simples será exibido. Veja o Bloco de Código 2.7.5.

**src/index.js · Bloco de Código 2.7.5**

```jsx
class App extends React.Component {
…
  render() {
    // console.log("render")
    return (
      // responsividade, margem acima
      <div className="container mt-2">
        {/* uma linha, conteúdo centralizado, display é flex */}
        <div className="row justify-content-center">
          {/* oito colunas das doze disponíveis serão usadas para telas médias em diante */}
          <div className="col-md-8">
            {
              this.state.mensagemDeErro ?
                <p className="border rounded p-2 fs-1 text-center">
                  É preciso dar permissão para acesso à localização.
                  Atualize a página e tente de novo, ajustando a configuração
                  no seu navegador.
                </p>
              :
                <EstacaoClimatica
                  icone={this.state.icone}
                  estacao={this.state.estacao}
                  latitude={this.state.latitude}
                  longitude={this.state.longitude}
                  obterLocalizacao={this.obterLocalizacao}
                />
            }
          </div>
        </div>
      </div>
    )
  }
```

### Testando

Para testar, certifique-se de que o console do Chrome Dev Tools está aberto, como na Figura 2.7.1.

![Chrome Dev Tools com a aba Console selecionada e vazia](img/fig-2-7-1.webp)

*Figura 2.7.1: o console aberto.*

A seguir, instrua o navegador a pedir a permissão do usuário, como na Figura 2.7.2.

![Painel de informações do site com a permissão Location alterada para "Ask (default)"](img/fig-2-7-2.webp)

*Figura 2.7.2: configurando o navegador para pedir permissão.*

Atualize a página e observe o resultado no console, sem ainda clicar **Allow** ou **Block**. Como o usuário ainda não decidiu sobre a permissão, ainda não há mensagem de erro e, portanto, o componente `EstacaoClimatica` é adicionado ao DOM, o que faz com que seus métodos de ciclo de vida entrem em execução e o timer já comece a executar. Veja a Figura 2.7.3.

![Pedido de permissão ainda aberto (nem Block nem Allow clicados) sobre a aplicação, e o console mostrando render e componentDidMount seguidos de vários pares render e componentDidUpdate, pois o timer atualiza o estado a cada segundo](img/fig-2-7-3.webp)

*Figura 2.7.3: o timer já está em execução antes da decisão do usuário.*

Agora, clique no botão **Block**. Quando fizer isso, uma mensagem de erro será configurada no estado do componente principal. Com isso, ele será atualizado, o que inclui seus filhos. O componente `EstacaoClimatica` deixa de ser renderizado e, portanto, seu método `componentWillUnmount` entra em execução. É a chance que o React nos dá para liberar recursos alocados. Neste caso, desejamos interromper a execução do timer previamente configurado. Veja o resultado esperado na Figura 2.7.4.

![Aplicação exibindo "É preciso dar permissão para acesso à localização. Atualize a página e tente de novo, ajustando a configuração no seu navegador." e o console terminando com componentWillUnmount](img/fig-2-7-4.webp)

*Figura 2.7.4: o componente EstacaoClimatica foi removido do DOM e seu `componentWillUnmount` executou.*

## Exibindo um spinner
Duration: 8:00

Quando a aplicação inicia, antes de o usuário decidir se deseja liberar ou bloquear o acesso à sua localização, pode ser de interesse exibir um componente que indica que o aplicativo está aguardando esta decisão. Poderíamos utilizar, por exemplo, um **Spinner** do Bootstrap. Veja a sua documentação no Link 2.8.1.

**Link 2.8.1:** [https://getbootstrap.com/docs/5.0/components/spinners/](https://getbootstrap.com/docs/5.0/components/spinners/)

Para definir o novo componente, clique com o direito na pasta `src` e crie um arquivo chamado `Loading.js`. A sua definição é um tanto simples. Veja o Bloco de Código 2.8.1.

**src/Loading.js · Bloco de Código 2.8.1**

```jsx
import React, { Component } from 'react'

export default class Loading extends Component {
  render() {
    return (
      // centralizando nos dois eixos, borda e padding
      <div className="d-flex justify-content-center align-items-center border rounded p-3">
        {/* text-whatever troca a cor */}
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
          {/* deve ser utilizado somente por dispositivos de acessibilidade, como leitores de tela */}
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }
}
```

Para utilizar o novo componente, devemos ajustar o arquivo `index.js`. As verificações a serem realizadas são resumidas na Tabela 2.8.1.

**Tabela 2.8.1**

| Verificação | Significado | Exibir |
| --- | --- | --- |
| Ainda não há latitude e nem mensagem de erro | Usuário ainda não bloqueou e nem permitiu o acesso à sua localização | Componente `Loading` |
| Já existe mensagem de erro | Usuário bloqueou o acesso à sua localização | Texto com mensagem de erro |
| Já existe latitude | Usuário permitiu o acesso à sua localização | Componente `EstacaoClimatica` |

O Bloco de Código 2.8.2 mostra o arquivo `index.js` atualizado.

**src/index.js · Bloco de Código 2.8.2**

```jsx
import Loading from './Loading'
…
  render() {
    // console.log("render")
    return (
      // responsividade, margem acima
      <div className="container mt-2">
        {/* uma linha, conteúdo centralizado, display é flex */}
        <div className="row justify-content-center">
          {/* oito colunas das doze disponíveis serão usadas para telas médias em diante */}
          <div className="col-md-8">
            {
              (!this.state.latitude && !this.state.mensagemDeErro) ?
                <Loading />
              :
                this.state.mensagemDeErro ?
                  <p className="border rounded p-2 fs-1 text-center">
                    É preciso dar permissão para acesso à localização.
                    Atualize a página e tente de novo, ajustando a configuração
                    no seu navegador.
                  </p>
                :
                  <EstacaoClimatica
                    icone={this.state.icone}
                    estacao={this.state.estacao}
                    latitude={this.state.latitude}
                    longitude={this.state.longitude}
                    obterLocalizacao={this.obterLocalizacao}
                  />
            }
          </div>
        </div>
      </div>
    )
  }
```

## Valores padrão para props
Duration: 10:00

Suponha que desejamos exibir um texto abaixo do componente `Loading`, explicando ao usuário que ele precisa responder ao pedido de acesso à sua localização. Poderíamos fazê-lo como mostra o Bloco de Código 2.9.1.

**src/Loading.js · Bloco de Código 2.9.1**

```jsx
export default class Loading extends Component {
  render() {
    return (
      // centralizando nos dois eixos, borda e padding
      <div className="d-flex flex-column justify-content-center align-items-center border rounded p-3">
        {/* text-whatever troca a cor */}
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
          {/* deve ser utilizado somente por dispositivos de acessibilidade, como leitores de tela */}
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="text-primary">Por favor, responda à solicitação de localização</p>
      </div>
    )
  }
}
```

Entretanto, o componente `Loading` pode ser utilizado em outros contextos, que não necessariamente envolvem a localização do usuário. Talvez queiramos deixar em aberto a mensagem a ser exibida, permitindo que ela seja escolhida no contexto de uso do componente. Podemos fazê-lo facilmente via props. O Bloco de Código 2.9.2 ilustra o ajuste a ser feito no componente `Loading`.

**src/Loading.js · Bloco de Código 2.9.2**

```jsx
export default class Loading extends Component {
  render() {
    return (
      // centralizando nos dois eixos, borda e padding
      <div className="d-flex flex-column justify-content-center align-items-center border rounded p-3">
        {/* text-whatever troca a cor */}
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
          {/* deve ser utilizado somente por dispositivos de acessibilidade, como leitores de tela */}
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="text-primary">{this.props.mensagem}</p>
      </div>
    )
  }
}
```

Cabe ao componente principal, definido no arquivo `index.js`, decidir qual texto será exibido. Veja o Bloco de Código 2.9.3.

**src/index.js · Bloco de Código 2.9.3**

```jsx
...
<div className="col-md-8">
  {
    (!this.state.latitude && !this.state.mensagemDeErro)?
      <Loading mensagem="Por favor, responda à solicitação de localização"/>
    :
      this.state.mensagemDeErro ?
        <p className="border rounded p-2 fs-1 text-center">
          É preciso dar permissão para acesso à localização. Atualize a página e tente de novo, ajustando a configuração no seu navegador.
        </p>
      :
        <EstacaoClimatica
          icone={this.state.icone}
          estacao={this.state.estacao}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          obterLocalizacao={this.obterLocalizacao}
        />
  }
</div>
...
```

Suponha que desejamos tornar o componente `Loading` um pouco mais flexível, no seguinte sentido. Ele já permite que seja especificada a mensagem a ser utilizada. Entretanto, pode ser de interesse que ele tenha uma mensagem mais genérica a ser exibida por padrão, talvez um simples "Carregando". Poderíamos fazê-lo como destaca o Bloco de Código 2.9.4.

**src/Loading.js · Bloco de Código 2.9.4**

```jsx
export default class Loading extends Component {
  render() {
    return (
      // centralizando nos dois eixos, borda e padding
      <div className="d-flex flex-column justify-content-center align-items-center border rounded p-3">
        {/* text-whatever troca a cor */}
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
          {/* deve ser utilizado somente por dispositivos de acessibilidade, como leitores de tela */}
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="text-primary">{this.props.mensagem || 'Carregando'}</p>
      </div>
    )
  }
}
```

O React possui, no entanto, um mecanismo próprio para isso. Seu uso torna o código mais limpo e elegante. Componentes React possuem uma propriedade chamada **defaultProps**. Basta associarmos a ela um objeto JSON que possui todos os props de interesse associados a seus valores padrão. Uma vez feita a sua definição, o teste explícito feito anteriormente já não é necessário. Veja o Bloco de Código 2.9.5.

**src/Loading.js · Bloco de Código 2.9.5**

```jsx
import React, { Component } from 'react'

export default class Loading extends Component {
  render() {
    return (
      // centralizando nos dois eixos, borda e padding
      <div className="d-flex flex-column justify-content-center align-items-center border rounded p-3">
        {/* text-whatever troca a cor */}
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
          {/* deve ser utilizado somente por dispositivos de acessibilidade, como leitores de tela */}
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="text-primary">{this.props.mensagem}</p>
      </div>
    )
  }
}

//fora da classe que define o coponente
Loading.defaultProps = {
  mensagem: "Carregando"
}
```

No componente `App`, faça testes passando e deixando de passar o props `mensagem`, como destacam os blocos de código 2.9.6 e 2.9.7.

**src/index.js · Bloco de Código 2.9.6**

```jsx
<div className="col-md-8">
  {
    (!this.state.latitude && !this.state.mensagemDeErro)?
      <Loading/>
    :
      this.state.mensagemDeErro ?
        <p className="border rounded p-2 fs-1 text-center">
          É preciso dar permissão para acesso à localização. Atualize a página e tente de
          novo, ajustando a configuração no seu navegador.
        </p>
      :
        <EstacaoClimatica
          icone={this.state.icone}
          estacao={this.state.estacao}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          obterLocalizacao={this.obterLocalizacao}
        />
  }
</div>
```

**src/index.js · Bloco de Código 2.9.7**

```jsx
<div className="col-md-8">
  {
    (!this.state.latitude && !this.state.mensagemDeErro)?
      <Loading mensagem="Por favor, responda à solicitação de localização"/>
    :
      this.state.mensagemDeErro ?
        <p className="border rounded p-2 fs-1 text-center">
          É preciso dar permissão para acesso à localização. Atualize a página e tente de
          novo, ajustando a configuração no seu navegador.
        </p>
      :
        <EstacaoClimatica
          icone={this.state.icone}
          estacao={this.state.estacao}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          obterLocalizacao={this.obterLocalizacao}
        />
  }
</div>
```

<aside class="negative">

`defaultProps` em componentes de função foi descontinuado nas versões recentes do React; em componentes funcionais, use valores padrão nos parâmetros (por exemplo, `function Loading({ mensagem = 'Carregando' })`), como no codelab `react-useeffect`.

</aside>

## Exercícios
Duration: 30:00

**1.** O exercício consiste no desenvolvimento de um jogo cuja tela principal se assemelha com aquela exibida pela Figura 1.1.

![Cartão "Jogo de continhas" exibindo a conta 7 x 8 e os botões "Iniciar jogo" e "Encerrar jogo"](img/ex-fig-1-1.webp)

*Figura 1.1: a tela principal do jogo.*

A aplicação irá, a cada intervalo de tempo previamente definido, exibir uma conta cujo resultado deverá ser calculado pelo jogador. Além daquilo já exibido pela Figura 1.1, ela também deverá ter botões extras com possíveis respostas para que o usuário possa escolher. O desafio inicial consiste no desenvolvimento da parte visual, utilizando a biblioteca **PrimeReact**. O Link 1.1 dá acesso aos componentes da biblioteca.

**Link 1.1:** [https://www.primefaces.org/primereact/](https://www.primefaces.org/primereact/)

O Link 1.2 leva à página da **PrimeFlex**. Ela traz um grid system e classes utilitárias, muito semelhante ao Bootstrap.

**Link 1.2:** [https://www.primefaces.org/primeflex/](https://www.primefaces.org/primeflex/)

<details><summary>Ver resposta</summary>

Na versão com respostas, o enunciado acrescenta que a aplicação mostra, também, um gráfico com os números de acertos e erros ao longo do tempo, e propõe como desafio fazer a implementação utilizando a biblioteca PrimeReact. A tela esperada é a da figura a seguir.

![Dois cartões: "Resolva a continha se puder!", com a conta, as alternativas, o tempo restante e os botões Iniciar jogo, Encerrar jogo e Zerar pontuação; e "Sua pontuação", com um gráfico de linhas de acertos (azul) e erros (vermelho)](img/ex-resp-fig-1-1.webp)

*Figura 1.1 da versão com respostas: jogo e gráfico de pontuação.*

<aside class="negative">

A solução usa create-react-app, `ReactDOM.render`, PrimeReact 6, PrimeFlex 3 e Chart.js 3, nas versões de 2021 listadas no `package.json` ao final. Versões mais recentes dessas bibliotecas mudaram nomes de temas, classes e imports.

</aside>

#### 2.1 Criação da aplicação, execução e instalação das dependências

Comece criando a aplicação com

**Terminal**

```bash
npx create-react-app nome-do-app
```

Use

**Terminal**

```bash
cd nome-do-app
```

para navegar até o diretório recém-criado e

**Terminal**

```bash
code .
```

para abrir uma instância do VS Code vinculada ao diretório atual. Clique **Terminal >> New Terminal** no VS Code para utilizar um terminal embutido dele. Use

**Terminal**

```bash
npm start
```

para colocar seu aplicativo em execução.

Abra um novo terminal do VS Code clicando no botão **+**, como mostra a Figura 2.1.1.

![Painel TERMINAL do VS Code com o botão + (novo terminal) destacado](img/ex-fig-2-1-1.webp)

*Figura 2.1.1: abrindo um novo terminal.*

Apague todos os arquivos existentes na pasta `src`. A seguir, crie um arquivo chamado `index.js` nela. Seu conteúdo inicial aparece no Bloco de Código 2.1.1.

**src/index.js · Bloco de Código 2.1.1**

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class App extends Component {
  render() {
    return (
      <div>App</div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
```

Segundo a documentação do PrimeReact, que pode ser encontrada no Link 2.1.1, a sua instalação pode ser feita com os comandos a seguir.

**Link 2.1.1:** [https://primefaces.org/primereact/showcase/#/setup](https://primefaces.org/primereact/showcase/#/setup)

**Terminal**

```bash
npm install primereact
npm install primeicons
npm install react-transition-group
```

Feitas as instalações, devemos importar os arquivos CSS desejados. Além dos arquivos referentes à biblioteca primereact e à biblioteca de ícones primeicons, também precisamos importar um tema. Visite a documentação uma vez mais para verificar a vasta lista de temas gratuitos disponíveis e escolher o que preferir. Veja o Bloco de Código 2.1.2.

**src/index.js · Bloco de Código 2.1.2**

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//esse você pode escolher
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default class App extends Component {
...
```

PrimeReact é uma biblioteca de componentes que não inclui um "grid system" para responsividade e classes utilitárias para espaçamento, cores etc. Esses detalhes são resolvidos pela primeflex. Sua documentação pode ser encontrada no Link 2.1.2.

**Link 2.1.2:** [https://www.primefaces.org/primeflex/](https://www.primefaces.org/primeflex/)

A sua instalação pode ser feita com

**Terminal**

```bash
npm install primeflex
```

Feita a sua instalação, importe seu arquivo css como exibe o Bloco de Código 2.1.3.

**src/index.js · Bloco de Código 2.1.3**

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export default class App extends Component {
...
```

Os gráficos da PrimeReact têm como dependência a biblioteca chart.js. Ela pode ser instalada com

**Terminal**

```bash
npm install chart.js
```

#### 2.2 Componente Cartao

Tanto o jogo quanto o gráfico são exibidos como conteúdos de cartões. Por isso, vamos definir um componente `Cartao` independente. Veja o Bloco de Código 2.2.1. Ele deve ser definido em um novo arquivo chamado `Cartao.js`, que deve ser criado na pasta `src`.

**src/Cartao.js · Bloco de Código 2.2.1**

```jsx
import React, { Component } from 'react';
import { Card } from 'primereact/card';

export default class Cartao extends Component {
  render() {
    return (
      <Card title={this.props.titulo} style={styles.card}>
        <div className={`${styles.inner} ${this.props.className}`}>{this.props.children}</div>
      </Card>
    );
  }
}

const styles = {
  card: {
    //função css var pega a cor associada à variável especificada
    backgroundColor: 'var(--blue-100)',
  },
  //borda arredondada, background laranja, largura, padding, margin
  inner: 'border-round bg-orange-50 w-8 p-2 m-auto',
};

Cartao.defaultProps = {
  titulo: 'Resolva a continha se puder!'
}
```

#### 2.3 Componente para exibir mensagem

O componente que exibe a mensagem para iniciar o jogo é um tanto simples. Veja a sua definição no Bloco de Código 2.3.1. Crie um arquivo chamado `Mensagem.js` na pasta `src` para escrevê-la.

**src/Mensagem.js · Bloco de Código 2.3.1**

```jsx
import React, { Component } from 'react'

export default class Mensagem extends Component {
  render() {
    return (
      <div className={`${styles.texto} ${this.props.className}`}>
        {this.props.texto}
      </div>
    )
  }
}

const styles = {
  texto:
    //centraliza nos dois eixos, borda, background vermelho, sombra, altura
    'flex justify-content-center align-items-center border-round bg-red-100 shadow-2 h-4rem'
}
```

#### 2.4 Exibindo dois cartões e a mensagem com o grid system

O componente principal será responsável por exibir os dois cartões de maneira responsiva. Neste momento, vamos utilizar o grid system do PrimeFlex para fazer a exibição de dois cartões. O primeiro exibirá a mensagem. Veja o Bloco de Código 2.4.1. Estamos no arquivo `index.js`.

**src/index.js · Bloco de Código 2.4.1**

```jsx
...
import Cartao from './Cartao';
import Mensagem from './Mensagem';

export default class App extends Component {
  render() {
    return (
      //grid conteúdo centralizado horizontalmente
      <div className='grid justify-content-center'>
        {/*12 colunas. 6 para telas grandes */}
        <div className='col-12 lg:col-6'>
          {/* altura */}
          <Cartao className='h-18rem'>
            {/* garantindo altura para alternar entre mensagem e jogo */}
            <div className='h-12rem'>
              {/* centraliza e pega toda a altura que pode */}
              <div className='flex align-items-center h-full justify-content-center'>
                <Mensagem texto='Clique para iniciar' className='md:w-8 w-10' />
              </div>
            </div>
          </Cartao>
        </div>
        {/* 12 colunas. 6 para telas grandes */}
        <div className='col-12 lg:col-6'>
          <Cartao
            titulo="Sua pontuação"
            // altura igual à do outro
            className='h-18rem'>
          </Cartao>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
```

#### 2.5 Botões

A aplicação exibe três botões: **Iniciar Jogo**, **Encerrar Jogo** e **Zerar pontuação**. Eles serão definidos como um único componente. Clique com o direito em `src` para criar um arquivo cujo nome será `Botoes.js`. O Bloco de Código 2.5.1 mostra a definição do componente.

**src/Botoes.js · Bloco de Código 2.5.1**

```jsx
import React, { Component } from 'react';
import {Button} from 'primereact/button'

export default class Botoes extends Component {
  render() {
    return (
      // usa a classe que chegou via props e a que ele mesmo define
      <div className={`${this.props.className} ${styles.botoes}`}>
        <div className="flex justify-content-evenly">
          <Button
            label='Iniciar jogo'
            className='p-button-raised p-button-outlined'
            icon='pi pi-check'
            // função que será enviada via props
            onClick={this.props.fIniciar}
          />
          <Button
            label='Encerrar jogo'
            className='p-button-raised p-button-outlined p-button-danger'
            icon='pi pi-times'
            // função que será enviada via props
            onClick={this.props.fEncerrar}
          />
          <Button
            label='Zerar pontuação'
            className='p-button-raised p-button-outlined p-button-warning'
            icon='pi pi-times'
            // função que será enviada via props
            onClick={this.props.fZerar}
          />
        </div>
      </div>
    );
  }
}

const styles = {
  botoes: 'mt-5'
}
```

Ajuste o arquivo `index.js` para que os botões sejam exibidos, como no Bloco de Código 2.5.2.

**src/index.js · Bloco de Código 2.5.2**

```jsx
export default class App extends Component {
  render() {
    return (
      //grid conteúdo centralizado horizontalmente
      <div className='grid justify-content-center'>
        {/*12 colunas. 6 para telas grandes */}
        <div className='col-12 lg:col-6'>
          {/* altura */}
          <Cartao className='h-18rem'>
            {/* garantindo altura para alternar entre mensagem e jogo */}
            <div className='h-12rem'>
              {/* centraliza e pega toda a altura que pode */}
              <div className='flex align-items-center h-full justify-content-center'>
                <Mensagem texto='Clique para iniciar' className='md:w-8 w-10' />
              </div>
            </div>
            <Botoes />
          </Cartao>
        </div>
        {/* 12 colunas. 6 para telas grandes */}
        <div className='col-12 lg:col-6'>
          <Cartao
            titulo="Sua pontuação"
            // altura igual à do outro
            className='h-18rem'>
          </Cartao>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
```

#### 2.6 O componente Jogo

O componente `Jogo` será definido em um novo arquivo chamado `Jogo.js` que deve ser criado na pasta `src`. Ele resolve os seguintes problemas:

- Gera contas aleatórias, compostas por dois operandos e uma operação.
- Gera a resposta correta.
- Gera alternativas potencialmente incorretas.
- Faz a exibição do desafio e das alternativas durante cinco segundos, gerando uma nova combinação depois deste tempo.
- Exibe um timer de 5 segundos para cada desafio proposto.

**(Código inicial e estado do Jogo)** Seu código inicial é dado no Bloco de Código 2.6.1. Repare na definição de seu estado.

**src/Jogo.js · Bloco de Código 2.6.1**

```jsx
import React, { Component } from 'react';

export default class Jogo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // coleção para armazenar as alternativas
      alternativas: Array(5).fill(undefined),
      // tempo de duração da exibição de cada desafio
      intervaloAtualizacao: 5000,
      //valor inicial do intervalo dentro do qual os valores serão gerados
      valorInicial: 1,
      //valor final do intervalo dentro do qual os valores serão gerados
      valorFinal: 10,
      //variável que controla o tempo que resta para o usuário resolver o desafio exibido atualmente.
      tempoRestante: 5
    }
  }

  render() {
    return <div>Jogo</div>;
  }
}

//fora da classe
const styles = {};
```

**(Timers)** O jogo terá dois timers: um deles controla a troca do desafio a ser exibido para o usuário. O outro será para atualizar um contador segundo a segundo. Veja a sua definição no Bloco de Código 2.6.2.

**src/Jogo.js · Bloco de Código 2.6.2**

```jsx
export default class Jogo extends Component {
...
  timerGeral = null
  timerSegundoASegundo = null
…
}
```

**(Objeto para armazenar os símbolos e as operações)** Os desafios serão continhas de soma e subtração. Para cada desafio gerado, a aplicação precisa exibir o símbolo (+ ou -) apropriado e calcular o resultado, já que ele precisa constar na coleção de alternativas. O componente armazenará objetos JSON compostos pelo símbolo e pela respectiva operação, o que simplificará a geração de expressões aleatórias. Veja o Bloco de Código 2.6.3.

**src/Jogo.js · Bloco de Código 2.6.3**

```jsx
export default class Jogo extends Component {
  ...
  operacoes = [
    {simbolo: '+', operacao: (a, b) => a + b},
    {simbolo: '-', operacao: (a, b) => a - b},
  ]
…
}
```

**(Gerando um desafio)** Um desafio é uma conta no formato: `n1 op n2`. Por exemplo: `2 + 3`. Assim, a geração de um desafio consiste em

- gerar o primeiro operando no intervalo desejado
- gerar o segundo operando no intervalo desejado
- sortear uma das operações e "guardar" o seu símbolo para futura exibição
- calcular o resultado

A função do Bloco de Código 2.6.4 se encarrega disso.

**src/Jogo.js · Bloco de Código 2.6.4**

```jsx
export default class Jogo extends Component {
  ...
  gerarConta = () => {
    let n1 = Math.floor (Math.random() * this.state.valorFinal) + this.state.valorInicial;
    let n2 = Math.floor (Math.random() * this.state.valorFinal) + this.state.valorInicial;
    let oQueFazer = Math.floor(Math.random ()* this.operacoes.length)
    let simbolo = this.operacoes[oQueFazer]['simbolo']
    let resultado = this.operacoes[oQueFazer]['operacao'](n1, n2)
    return {n1, n2, simbolo, resultado}
  }
…
}
```

**(Gerando as alternativas)** Por padrão, a aplicação exibirá cinco alternativas para cada desafio. Evidentemente, a resposta certa deve estar incluída nas alternativas. A função que gera as alternativas opera da seguinte forma.

- Recebe a resposta certa como parâmetro.
- Constrói uma lista contendo a resposta certa.
- Gera mais quatro valores aleatórios dentro do intervalo de interesse e adiciona à lista, sem permitir valores duplicados.
- Devolve a lista.

A sua implementação aparece no Bloco de Código 2.6.5.

**src/Jogo.js · Bloco de Código 2.6.5**

```jsx
export default class Jogo extends Component {
...
  gerarAlternativas = (resultado) => {
    let aux = [resultado]
    while (aux.length < 5){
      let n = Math.floor (Math.random() * this.state.valorFinal) + this.state.valorInicial
      if (!aux.includes(n))
        aux.push(n)
    }
    return aux
  }
…
}
```

**(Gerando um jogo completo)** A geração de um jogo completo consiste em

- Gerar um desafio
- Gerar as alternativas
- Ajustar o estado do componente para que os novos valores sejam exibidos a cada ciclo de renderização.

No momento, a coleção de alternativas mantém a resposta correta sempre na primeira posição. É importante, portanto, gerar uma nova permutação para exibição. Para tal, utilizaremos uma biblioteca que se chama **underscore**. Veja a sua documentação no Link 2.6.1. Estamos interessados no método `shuffle`.

**Link 2.6.1:** [https://underscorejs.org/#shuffle](https://underscorejs.org/#shuffle)

A sua instalação pode ser feita com

**Terminal**

```bash
npm install underscore
```

Feita a instalação, ela pode ser importada com `import _ from 'underscore'`, como no Bloco de Código 2.6.6. Repare que usamos "_" (um underscore!) para acessar as funcionalidades da biblioteca. O nome pode ser qualquer um, no entanto.

**src/Jogo.js · Bloco de Código 2.6.6**

```jsx
import React, { Component } from 'react';
import _ from 'underscore'

export default class Jogo extends Component {
...
```

O Bloco de Código 2.6.7 gera um jogo como descrito.

**src/Jogo.js · Bloco de Código 2.6.7**

```jsx
export default class Jogo extends Component {
...
  gerarJogo = () => {
    this.setState({
      tempoRestante: 5
    })
    let {n1, n2, simbolo, resultado} = this.gerarConta()
    let alternativas = this.gerarAlternativas(resultado)
    this.setState({
      n1, n2, simbolo, resultado, alternativas: _.shuffle(alternativas), tempoRestante: 5
    })
  }
...
```

**(Começando a exibir o componente no método render)** Neste momento já temos condições de exibir o jogo. Começamos exibindo a região em que o desafio aparecerá. Veja o Bloco de Código 2.6.8.

**src/Jogo.js · Bloco de Código 2.6.8**

```jsx
export default class Jogo extends Component {
...
  render() {
    const conta = (
      <div>
        <div className={styles.conta}>
          <div className={styles.valor}>{this.state.n1}</div>
          <div className={styles.valor}>{this.state.simbolo}</div>
          <div className={styles.valor}>{this.state.n2}</div>
          <div className={styles.valor}>=</div>
          <div className={styles.valor}>...</div>
        </div>
      </div>
    )
    return (
      <div>
        {conta}
      </div>
    )
  }
}

//fora da classe
const styles = {
  // centraliza, borda, background laranja, sombra, altura
  conta:
    'flex justify-content-center align-items-center border-round bg-orange-200 shadow-2 h-4rem',
  // centraliza borda, altura e largura iguais
  valor:
    'flex justify-content-center align-items-center border-round border-1 border-400 h-3rem w-3rem',
};
```

Ajuste o arquivo `index.js` como no bloco a seguir para ver o resultado.

**src/index.js · Bloco de Código 2.6.8**

```jsx
import Jogo from './Jogo';

export default class App extends Component {
  render() {
    return (
      //grid conteúdo centralizado horizontalmente
      <div className='grid justify-content-center'>
        {/*12 colunas. 6 para telas grandes */}
        <div className='col-12 lg:col-6'>
          {/* altura */}
          <Cartao className='h-18rem'>
            {/* garantindo altura para alternar entre mensagem e jogo */}
            <div className='h-12rem'>
              {/* centraliza e pega toda a altura que pode */}
              {/* <div className='flex align-items-center h-full justify-content-center'>
                <Mensagem texto='Clique para iniciar' className='md:w-8 w-10' />
              </div> */}
              <Jogo/>
            </div>
            <Botoes />
          </Cartao>
        </div>
        {/* 12 colunas. 6 para telas grandes */}
        <div className='col-12 lg:col-6'>
          <Cartao
            titulo="Sua pontuação"
            // altura igual à do outro
            className='h-18rem'>
          </Cartao>
        </div>
      </div>
    );
  }
}
```

A seguir, ajustamos o arquivo `Jogo.js` para que as alternativas e o tempo restante também sejam exibidos. Veja o Bloco de Código 2.6.9.

**src/Jogo.js · Bloco de Código 2.6.9**

```jsx
export default class Jogo extends Component {
…
  render() {
    const conta = (
      <div>
        <div className={styles.conta}>
          <div className={styles.valor}>{this.state.n1}</div>
          <div className={styles.valor}>{this.state.simbolo}</div>
          <div className={styles.valor}>{this.state.n2}</div>
          <div className={styles.valor}>=</div>
          <div className={styles.valor}>...</div>
        </div>
      </div>
    )
    const alternativas = (
      <div className={styles.alternativas}>
        {this.state.alternativas.map((alternativa, indice) => (
          <Button
            key={indice}
            className={`${styles.valor} ${styles.alternativa}`} label={alternativa?.toString()}
          />
        ))}
      </div>
    )
    const tempoRestante = (
      <div className={styles.tempoRestante}>
        {this.state.tempoRestante}
      </div>
    )
    return (
      <div>
        {conta}
        {alternativas}
        {tempoRestante}
      </div>
    )
  }
}

//fora da classe
const styles = {
  // centraliza, borda, background laranja, sombra, altura
  conta:
    'flex justify-content-center align-items-center border-round bg-orange-200 shadow-2 h-4rem',
  // centraliza, espaçamento uniforme, borda, sombra, altura margin top
  alternativas:
    'flex justify-content-evenly align-items-center border-round shadow-2 h-4rem mt-2',
  // centraliza borda, altura e largura iguais
  valor:
    'flex justify-content-center align-items-center border-round border-1 border-400 h-3rem w-3rem',
  // outline no botão
  alternativa:
    'p-button-outlined',
  // centraliza, altura, tamanho da fonte
  tempoRestante:
    'flex justify-content-center align-items-center h-4rem text-3xl'
};
```

O resultado esperado aparece na Figura 2.6.1.

![Dois cartões: o primeiro com a região da conta, cinco botões de alternativas vazios, o número 5 do tempo restante e os três botões; o segundo, "Sua pontuação", vazio](img/ex-fig-2-6-1.webp)

*Figura 2.6.1: conta, alternativas e tempo restante exibidos.*

<aside class="positive">

O componente `Button` usado no Bloco de Código 2.6.9 vem da PrimeReact; o `Jogo.js` precisa de `import { Button } from 'primereact/button'`, como já fizemos em `Botoes.js`.

</aside>

**(Iniciando uma rodada)** O algoritmo para iniciar uma nova rodada é o seguinte.

- Encerrar a execução dos dois timers
- Agendar a geração de novos jogos a cada cinco segundos, fazendo uma geração imediata
- Agendar a atualização do contador segundo a segundo

A função do Bloco de Código 2.6.10 implementa este algoritmo.

**src/Jogo.js · Bloco de Código 2.6.10**

```jsx
export default class Jogo extends Component {
  ...
  iniciarRodada = () => {
    // encerramos a execução dos dois timers
    clearInterval(this.timerGeral)
    clearInterval(this.timerSegundoASegundo)
    //uma função para registrar o timer das rodadas
    //ela dispara a geração do jogo imediatamente e agenda as demais
    //o timer segundo a segundo também é iniciado aqui
    let fire = (f, t) => {
      f()
      this.timerSegundoASegundo = setInterval(() => {
        this.setState({tempoRestante: this.state.tempoRestante - 1})
      },1000);
      return setInterval(f, t)
    }
    this.timerGeral = fire(this.gerarJogo, this.state.intervaloAtualizacao)
  }
...
```

A função `iniciarRodada` pode ser chamada no método `componentDidMount`, como destaca o Bloco de Código 2.6.11.

**src/Jogo.js · Bloco de Código 2.6.11**

```jsx
export default class Jogo extends Component {
  ...
  componentDidMount(){
    this.iniciarRodada()
  }
...
```

Teste o aplicativo uma vez mais. O timer segundo a segundo deve ser exibido, bem como o desafio e as alternativas.

**(Encerrando o jogo: método componentWillUnmount)** Quando o usuário clicar no botão para encerrar o jogo, a ideia é que o componente `Jogo` seja removido da DOM e que o componente `Mensagem` tome o seu lugar. Por isso, precisamos tomar o cuidado de encerrar a execução dos timers quando isso acontecer. Veja o Bloco de Código 2.6.12.

**src/Jogo.js · Bloco de Código 2.6.12**

```jsx
export default class Jogo extends Component {
…
  encerrar = () => {
    clearInterval(this.timerGeral)
    clearInterval(this.timerSegundoASegundo)
  }

  componentWillUnmount(){
    this.encerrar()
  }
…
}
```

#### 2.7 Ajustes no componente App e no componente Jogo

O componente principal é o responsável por decidir o que renderizar, em função das interações do usuário. Além disso, ele precisa manter informações sobre os acertos e erros ocorridos no jogo para alimentar o gráfico.

**(O estado do componente App)** A definição do estado do componente `App` aparece no Bloco de Código 2.7.1.

**src/index.js · Bloco de Código 2.7.1**

```jsx
export default class App extends Component {
  state = {
    // jogo iniciado ou não?
    status: 'off',
    //número de acertos
    acertos: 0,
    //número de erros
    erros: 0,
    //número de tentativas
    contador: 0
  }
…
}
```

**(Funções para alterar status e pontuação)** O componente principal precisa que seu estado seja atualizado conforme o usuário interage com a aplicação. Como as interações são detectadas pelo componente `Jogo`, o componente principal define funções que alteram seu estado da maneira desejada e as entrega ao `Jogo` via props. Definiremos três funções:

- Uma função para atualizar o status do jogo (de `on` para `off` e vice-versa)
- Uma função para atualizar a pontuação (incrementar número de acertos ou erros e incrementar o contador)
- Uma função para zerar a pontuação

Veja o Bloco de Código 2.7.2.

**src/index.js · Bloco de Código 2.7.2**

```jsx
export default class App extends Component {
...
  alterarStatus = (status) => {
    this.setState({ status });
  };

  atualizarPontuacao = (acertou) => {
    this.setState(
      acertou
        ? { acertos: this.state.acertos + 1, contador: this.state.contador + 1}
        : { erros: this.state.erros + 1, contador: this.state.contador + 1}
    );
  };

  zerarPontuacao = () => {
    this.setState({
      acertos: 0,
      erros: 0,
    });
  };
…
}
```

O componente principal as entrega ao componente `Botoes` via props, como no Bloco de Código 2.7.3.

**src/index.js · Bloco de Código 2.7.3**

```jsx
export default class App extends Component {
…
  render() {
  …
    <Botoes
      fIniciar={() => this.alterarStatus('on')}
      fEncerrar={() => this.alterarStatus('off')}
      fZerar={() => this.zerarPontuacao()}
    />
...
```

A seguir, o componente passa a exibir `Mensagem` e `Jogo` de maneira mutuamente exclusiva. A exibição deles depende do status do jogo. Veja o Bloco de Código 2.7.4.

**src/index.js · Bloco de Código 2.7.4**

```jsx
export default class App extends Component {
…
  render() {
    return (
      //grid conteúdo centralizado horizontalmente
      <div className='grid justify-content-center'>
        {/*12 colunas. 6 para telas grandes */}
        <div className='col-12 lg:col-6'>
          {/* altura */}
          <Cartao className='h-18rem'>
            {/* garantindo altura para alternar entre mensagem e jogo */}
            <div className='h-12rem'>
              {this.state.status === 'on' ? (
                <Jogo
                  status={this.state.status}
                  fAtualizarPontuacao={this.atualizarPontuacao}
                />
              ) : (
                <div className='flex align-items-center h-full justify-content-center'>
                  <Mensagem texto='Clique para iniciar' className='w-6' />
                </div>
              )}
            </div>
            <Botoes
              fIniciar={() => this.alterarStatus('on')}
              fEncerrar={() => this.alterarStatus('off')}
              fZerar={() => this.zerarPontuacao()}
            />
          </Cartao>
        </div>
        {/* 12 colunas. 6 para telas grandes */}
        <div className='col-12 lg:col-6'>
          <Cartao
            titulo="Sua pontuação"
            // altura igual à do outro
            className='h-18rem'>
          </Cartao>
        </div>
      </div>
    );
```

Perceba que o componente `Jogo` recebe o status do jogo via props. Ele o utilizará em seu método `componentDidMount` de modo a iniciar uma rodada somente quando o status do jogo for igual a `'on'`. Veja o Bloco de Código 2.7.5.

**src/Jogo.js · Bloco de Código 2.7.5**

```jsx
export default class Jogo extends Component {
…
  componentDidMount(){
    //passado pelo componente principal
    if (this.props.status === 'on')
      this.iniciarRodada()
  }
...
```

Os botões que exibem as alternativas ainda não têm o tratamento de clique realizado. Quando um clique acontece neles, a pontuação do jogo precisa ser atualizada: se o valor existente no botão clicado for igual ao resultado armazenado no estado do componente, o usuário tem mais um acerto. Caso contrário, ele tem um erro. Além disso, iniciamos uma nova rodada sempre que o usuário clica para que ele tenha somente uma chance a cada rodada. Veja o Bloco de Código 2.7.6.

**src/Jogo.js · Bloco de Código 2.7.6**

```jsx
export default class Jogo extends Component {
…
  render() {
  …
    const alternativas = (
      <div className={styles.alternativas}>
        {this.state.alternativas.map((alternativa, indice) => (
          <Button
            key={indice}
            className={`${styles.valor} ${styles.alternativa}`} label={alternativa?.toString()}
            onClick={() => {
              this.iniciarRodada()
              this.props.fAtualizarPontuacao(this.state.resultado === alternativa)}
            }
          />
        ))}
      </div>
    )
  }
}
```

Para ter certeza de que tudo está funcionando, exiba os números de acerto e erro textualmente, como no Bloco de Código 2.7.7.

**src/index.js · Bloco de Código 2.7.7**

```jsx
export default class App extends Component {
…
  render() {
    …
      <Botoes
        fIniciar={() => this.alterarStatus('on')}
        fEncerrar={() => this.alterarStatus('off')}
        fZerar={() => this.zerarPontuacao()}
      />
      {`Acertos: ${this.state.acertos}`}
      {`Erros: ${this.state.erros}`}
    </Cartao>
  </div>
  …
  }
}
```

Teste novamente o app clicando nos três botões e acertando e errando tentativas. O resultado esperado é parecido com o que exibe a Figura 2.7.1.

![Cartão "Resolva a continha se puder!" com a conta 7 - 8, as alternativas -1, 6, 8, 5 e 7, o tempo restante 4, os três botões e o texto "Acertos: 4Erros: 2"](img/ex-fig-2-7-1.webp)

*Figura 2.7.1: o jogo contando acertos e erros.*

#### 2.8 Componente para exibição de um gráfico

O segundo cartão da aplicação exibe um gráfico de linha. Duas linhas são exibidas: uma delas mostra o número de acertos ao longo do tempo e a outra, o número de erros. Utilizaremos o componente `Chart` da PrimeReact para construir o gráfico. Veja a sua documentação no Link 2.8.1.

**Link 2.8.1:** [https://www.primefaces.org/primereact/showcase/#/linechart](https://www.primefaces.org/primereact/showcase/#/linechart)

**(Criação do componente e seu estado)** Começamos criando um arquivo chamado `GraficoLinha.js` na pasta `src`. Seu código inicial aparece no Bloco de Código 2.8.1. Seu estado armazena duas informações: uma delas se refere ao grau de suavização da curva dos gráficos. A outra indica se a área sob as linhas do gráfico deve ser preenchida.

**src/GraficoLinha.js · Bloco de Código 2.8.1**

```jsx
import React, { Component } from 'react';
import { Chart } from 'primereact/chart';

export default class GraficoLinha extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //suavizar as curvas
      tension: 0.4,
      //preencher a área sob o gráfico?
      fill: false,
    };
  }
}
```

**(Dados que caracterizam cada curva)** Cada curva do gráfico será caracterizada por

- coleção de valores
- título
- cor

O Bloco de Código 2.8.2 mostra a definição de um objeto que armazena essas informações.

**src/GraficoLinha.js · Bloco de Código 2.8.2**

```jsx
export default class GraficoLinha extends Component {
…
  colecoes = {
    acertos: {
      titulo: 'Acertos',
      dados: [],
      cor: '#2196F3',
    },
    erros: {
      titulo: 'Erros',
      dados: [],
      cor: '#F44336',
    },
  };
```

**(E o eixo x?)** Precisamos também de uma coleção de valores para representar o eixo x. Essa coleção é simplesmente 0, 1, 2, 3, 4…, pois representa o número de tentativas do usuário ao longo do tempo. Em função de cada valor desse, cada linha do gráfico mostra o número de acertos e o número de erros. Declaramos, portanto, a lista exibida pelo Bloco de Código 2.8.3.

**src/GraficoLinha.js · Bloco de Código 2.8.3**

```jsx
export default class GraficoLinha extends Component {
  ...
  contador = [];
}
```

**(A função de atualização das coleções do componente GraficoLinha)** A cada interação do usuário, os componentes são atualizados, incluindo o gráfico. O componente principal entregará a ele, via props, dados referentes a:

- acertos
- erros
- número de tentativas
- e um booleano indicando se o gráfico precisa ser reiniciado, o que acontece quando ambos os números de acertos e erros são iguais a 0.

O componente `GraficoLinha` define uma função que atualiza as suas coleções de acordo com esses valores. Veja o Bloco de Código 2.8.4.

**src/GraficoLinha.js · Bloco de Código 2.8.4**

```jsx
export default class GraficoLinha extends Component {
...
  atualizarDados = () => {
    this.colecoes = {
      acertos: {
        titulo: 'Acertos',
        dados: this.props.zerar
          ? []
          : [...this.colecoes.acertos.dados, this.props.acertos],
        cor: '#2196F3',
      },
      erros: {
        titulo: 'Erros',
        dados: this.props.zerar
          ? []
          : [...this.colecoes.erros.dados, this.props.erros],
        cor: '#F44336',
      },
      tension: 0.4,
      fill: false,
    };
    this.contador = this.props.zerar ? [] : [...this.contador, this.props.contador];
  };
...
```

**(A função render do componente GraficoLinha)** A função `render` atualiza as coleções e devolve um objeto do tipo `Chart`, da PrimeReact. Veja a sua documentação para mais detalhes sobre as opções utilizadas. Muitas delas são definidas na documentação da Chart.js, que pode ser encontrada no link a seguir. Os componentes da PrimeReact são apenas "wrappers" que simplificam o uso da Chart.js.

**Link:** [https://www.chartjs.org/](https://www.chartjs.org/)

A implementação da função `render` aparece no Bloco de Código 2.8.5.

**src/GraficoLinha.js · Bloco de Código 2.8.5**

```jsx
export default class GraficoLinha extends Component {
...
  render() {
    this.atualizarDados();
    return (
      <Chart
        options={{
          animation: {
            duration: 0,
          },
          scales: {
            y: {
              ticks: {
                stepSize: 1,
              },
            },
          },
        }}
        type='line'
        data={{
          labels: this.contador,
          datasets: [
            {
              label: this.colecoes.acertos.titulo,
              data: this.colecoes.acertos.dados,
              fill: this.state.fill,
              borderColor: this.colecoes.acertos.cor,
              tension: this.state.tension,
            },
            {
              label: this.colecoes.erros.titulo,
              data: this.colecoes.erros.dados,
              fill: this.state.fill,
              borderColor: this.colecoes.erros.cor,
              tension: this.state.tension,
            },
          ],
        }}
      />
    );
  }
…
}
```

**(Utilizando o componente GraficoLinha no componente principal)** O componente principal da aplicação passa a utilizar o componente `GraficoLinha` em seu segundo cartão. Veja o Bloco de Código 2.8.6. Ajuste também o componente para que ele deixe de exibir os números de acertos e erros textualmente.

**src/index.js · Bloco de Código 2.8.6**

```jsx
export default class App extends Component {
  render() {
    return (
      //grid conteúdo centralizado horizontalmente
      <div className='grid justify-content-center'>
        {/*12 colunas. 6 para telas grandes */}
        <div className='col-12 lg:col-6'>
          {/* altura */}
          <Cartao className='h-18rem'>
            {/* garantindo altura para alternar entre mensagem e jogo */}
            <div className='h-12rem'>
              {this.state.status === 'on' ? (
                <Jogo
                  status={this.state.status}
                  fAtualizarPontuacao={this.atualizarPontuacao}
                />
              ) : (
                <div className='flex align-items-center h-full justify-content-center'>
                  <Mensagem texto='Clique para iniciar' className='w-6' />
                </div>
              )}
            </div>
            <Botoes
              fIniciar={() => this.alterarStatus('on')}
              fEncerrar={() => this.alterarStatus('off')}
              fZerar={() => this.zerarPontuacao()}
            />
            {/* comentar esse trecho */}
            {/* {`Acertos: ${this.state.acertos}`}
            {`Erros: ${this.state.erros}`} */}
          </Cartao>
        </div>
        {/* 12 colunas. 6 para telas grandes */}
        <div className='col-12 lg:col-6'>
          <Cartao
            titulo="Sua pontuação"
            // altura igual à do outro
            className='h-18rem'>
            <GraficoLinha
              acertos={this.state.acertos}
              erros={this.state.erros}
              contador={this.state.contador}
              zerar={(!this.state.acertos && !this.state.erros)}
            />
          </Cartao>
        </div>
      </div>
    );
```

**(Herdando de PureComponent)** Note que, conforme o usuário clica nos botões, o gráfico gera um novo ponto, mesmo quando o jogo está parado. Isso ocorre pois seu ciclo de renderização dispara mesmo quando não há valores novos sendo entregues via props. Podemos ajustar isso fazendo com que a sua classe deixe de herdar de `Component` e passe a herdar de `PureComponent`. Veja o Bloco de Código 2.8.7.

**src/GraficoLinha.js · Bloco de Código 2.8.7**

```jsx
import React, { PureComponent } from 'react';
import { Chart } from 'primereact/chart';

export default class GraficoLinha extends PureComponent {
...
```

Interaja novamente com a aplicação e veja os resultados.

#### 2.9 Implantando a aplicação no Github Pages

O Github Pages permite que aplicações compostas por arquivos estáticos (HTML, CSS e Javascript) sejam implantadas. Cada usuário Github tem direito a uma página referente a seu perfil e cada um de seus repositórios tem direito a uma página também. Nesta seção, veremos como implantar a aplicação desenvolvida no Github Pages.

- Instale o pacote gh-pages com

**Terminal**

```bash
npm install gh-pages --save-dev
```

- Adicione a propriedade `homepage` a seu arquivo `package.json`. Ela deve conter o link da sua página. O padrão é `http://usuario.github.io/nome-app`. Exemplo: `https://professorbossini.github.io/pessoal_react_jogo_continhas/`

A seguir, criamos os scripts `predeploy` e `deploy`, ambos no arquivo `package.json`. O resultado esperado é parecido com aquele que exibe o Bloco de Código 2.9.1.

**package.json · Bloco de Código 2.9.1**

```json
{
  "homepage": "http://professorbossini.github.io/pessoal_react_jogo_continhas",
  "name": "jogo-continhas-de-matematica",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.14.1",
    "@testing-library/react": "^11.2.7",
    "@testing-library/user-event": "^12.8.3",
    "chart.js": "^3.5.1",
    "primeflex": "^3.0.1",
    "primeicons": "^4.1.0",
    "primereact": "^6.5.1",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-scripts": "4.0.3",
    "react-transition-group": "^4.4.2",
    "underscore": "^1.13.1",
    "web-vitals": "^1.1.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "gh-pages": "^3.2.3"
  }
}
```

<aside class="positive">

**Nota.** A opção `-d` do pacote gh-pages vem de "dist". Ela está sendo utilizada para indicar qual é o diretório em que se encontram os arquivos gerados no processo de build. Inspecione a estrutura da sua aplicação e verifique que há, de fato, um diretório chamado `build` na raiz.

</aside>

Se desejar, execute

**Terminal**

```bash
npx gh-pages --help
```

para obter mais informações sobre esta ferramenta. Visite, também, a sua documentação. Ela pode ser encontrada por meio do Link 2.9.1.

**Link 2.9.1:** [https://www.npmjs.com/package/gh-pages](https://www.npmjs.com/package/gh-pages)

A seguir, execute

**Terminal**

```bash
npm run deploy
```

</details>

## Referências
Duration: 3:00

Parabéns! Você acompanhou o ciclo de vida de componentes de classe, passou estado entre componentes via props, liberou recursos no `componentWillUnmount` e definiu valores padrão com `defaultProps`.

* React – A JavaScript library for building user interfaces. 2021. Disponível em [https://reactjs.org/](https://reactjs.org/). Acesso em agosto de 2021.
