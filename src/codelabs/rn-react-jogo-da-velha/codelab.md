summary: Desenvolva no CodePen o jogo da velha do site oficial do React, aprendendo componentes de função e de classe, props, estado, JSX e a detecção de vencedor.
id: rn-react-jogo-da-velha
categories: React,JavaScript,React Native
tags: react,javascript,jsx,componentes,props,state,codepen,babel,jogo da velha
status: Published
authors: Rodrigo Bossini
last updated: 2021-02-12
pdf: react_native/old/01_apostila_react_jogo_da_velha.pdf
exercicios: react_native/old/01_exercicios_react_jogo_da_velha.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React: desenvolvendo um jogo da velha

## Visão geral
Duration: 3:00

Neste material iremos detalhar o desenvolvimento de um jogo da velha utilizando a biblioteca React. Trata-se da mesma aplicação disponível no site oficial do React. A cada clique a alternância entre jogadores ocorre automaticamente e o jogo detecta quando houver um vencedor. Veja a Figura 1.1.

![Tabuleiro vazio de jogo da velha, com três linhas de três quadrados, e o texto "Jogador: X" acima](img/fig-1-1.webp)

*Figura 1.1: O jogo da velha que vamos construir.*

### O que você vai aprender

* Criar um projeto no CodePen e configurar o Babel e o React
* Definir componentes React com funções e com classes
* Passar dados e funções entre componentes por meio de props
* Guardar o estado de um componente e atualizá-lo com `setState`
* Renderizar componentes com `ReactDOM.render`
* Detectar o vencedor e tratar cliques inválidos

### O que você vai precisar

* Um navegador e acesso à internet
* Uma conta no CodePen (sugestão: entrar com o GitHub)
* Noções de HTML, CSS e JavaScript

## Acesso ao CodePen
Duration: 5:00

### Acesso ao CodePen

Comece acessando o site CodePen, pois iremos desenvolver a aplicação diretamente no navegador. Ao longo do curso veremos o processo de instalação do ambiente e o desenvolvimento local.

[https://codepen.io/](https://codepen.io/)

Uma sugestão é fazer login com seu GitHub, pois assim terá acesso aos seus projetos no futuro.

### Criando um CodePen

Do lado esquerdo do CodePen, clique em **Pen** (logo abaixo de **create**). Você deverá ver algo parecido com o que mostra a Figura 1.2.1.

![Editor do CodePen com três painéis escuros lado a lado, para HTML, CSS e JS, e os botões Save, Settings e Change View no topo](img/fig-1-2-1.webp)

*Figura 1.2.1: Um novo Pen no CodePen.*

Note que há regiões para escrever código HTML, CSS e JavaScript.

Além disso, no canto superior esquerdo, há a palavra **Untitled**, que indica que seu Pen (seu projeto) ainda não tem nome. Basta clicar no pequeno botão à frente do texto para editar o nome, dando Enter quando terminar.

Outro detalhe é o botão **Save**, que permite que você salve seus projetos para que depois possa acessá-los. Eles podem ser acessados na seção **Dashboard**.

## Definindo os componentes do jogo
Duration: 5:00

A construção de aplicações com React se baseia na definição de **componentes**. Cabe ao desenvolvedor, aplicando princípios como alta coesão e baixo acoplamento, definir quais serão os componentes de sua aplicação e como eles irão interagir. A Figura 1.3.1 mostra novamente a interface gráfica do jogo, destacando as partes que possivelmente merecem ser definidas como componentes independentes.

![Jogo em andamento com um quadrado destacado em vermelho, o tabuleiro destacado em azul e o jogo inteiro, com o status "Next player: O" e a lista de botões "Go to move", destacado em verde](img/fig-1-3-1.webp)

*Figura 1.3.1: Os componentes do jogo destacados por cores.*

As cores utilizadas na Figura 1.3.1 destacam os componentes que iremos considerar que compõem nosso jogo. Veja:

* **Vermelho**: um quadrado. Cada quadrado tem seu próprio estado (X ou O). O jogo tem nove desses.
* **Azul**: o tabuleiro. O jogo tem um único tabuleiro, composto pelos nove quadrados.
* **Verde**: o jogo inteiro é composto por um tabuleiro, por um texto que indica o status atual e por uma lista que viabiliza a volta para determinados estados ocorridos no passado.

## O componente Quadrado
Duration: 12:00

### Componentes React

React é uma biblioteca que, de certa forma, permite que o desenvolvedor estenda a linguagem HTML, adicionando a ela novas tags. Diferente do que ocorre com as tags já existentes na linguagem, aquelas que o desenvolvedor cria podem ter comportamento dinâmico, que ele mesmo pode especificar.

Uma nova "tag", na verdade, se chama **Componente**. Cabe ao programador especificar, entre outras coisas, seu nome e sua aparência. A programação utilizando React tem como um de seus fundamentos a definição de componentes.

Componentes podem ser definidos usando dois mecanismos diferentes: **funções** e **classes**. Neste material iremos utilizar ambos.

### O componente Quadrado

Comecemos criando um componente que representa um quadrado do jogo. Para tal, basta criar uma função JavaScript simples. Ela tem as seguintes características.

* Seu nome será o nome da tag que permitirá o uso do componente: se a função se chama `Quadrado`, então seu uso será feito assim: `<Quadrado />`.
* A função recebe um objeto, em geral, chamado `props`. Esse objeto permite que sejam enviados dados ao componente, de modo que seu comportamento possa ser definido em função do contexto em que está sendo utilizado.

A implementação da função `Quadrado` é dada na Listagem 1.4.1.1. Note que ela devolve algo parecido com HTML ou XML. Naturalmente é ali que estamos definindo a forma como esse componente será exibido. Trata-se de uma extensão para a sintaxe da linguagem JavaScript, chamada **JSX**. Em um contexto JSX, pode-se usar qualquer tipo de código JavaScript regular. Se quiser saber mais sobre JSX, visite o link a seguir.

[https://reactjs.org/docs/introducing-jsx.html](https://reactjs.org/docs/introducing-jsx.html)

**JS (CodePen) · Listagem 1.4.1.1**

```jsx
function Quadrado (props) {
  return (
    <button className="quadrado" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

<aside class="negative">

Na listagem impressa da apostila, a classe aparece como `className="square"`; o texto, a Figura 1.4.2.1 e o CSS a seguir usam `quadrado`, que é o nome correto para o estilo ser aplicado.

</aside>

Perceba que o objeto `props` recebido supostamente tem duas propriedades: `onClick` e `value`. Cabe ao componente que utilizar o componente `Quadrado`, no momento do uso, especificar os valores dessas propriedades. No final das contas, o objeto `props`, como era de se esperar, nada mais é do que um objeto JSON.

### Compilador Babel e React

Ao longo do desenvolvimento da aplicação, iremos utilizar recursos de especificações da linguagem JavaScript (ECMAScript 2016, ECMAScript 2017 etc.) para os quais alguns navegadores podem não oferecer suporte. Por isso, vamos utilizar o **Babel**, um compilador que conhece as mais recentes versões do JavaScript e as traduz para JavaScript antigo com que todos os navegadores conseguem trabalhar. Além disso, JSX, por exemplo, não é um recurso nativo do JavaScript. Trata-se de um recurso da biblioteca React. Assim, precisamos adicionar tanto o compilador Babel quanto a biblioteca React ao projeto.

No CodePen, para fazer esses ajustes, basta clicar na engrenagem ao lado de **JS** e escolher **Babel** como **JavaScript Preprocessor**. Além disso, cole os links a seguir nos campos apropriados. Quando terminar, clique em **Save & Close**. Veja as figuras 1.4.2.1 e 1.4.2.2.

```text
https://unpkg.com/react@17/umd/react.development.js
https://unpkg.com/react-dom@17/umd/react-dom.development.js
```

![Painel JS do CodePen com o botão de engrenagem destacado em vermelho, ao lado do código da função Quadrado](img/fig-1-4-2-1.webp)

*Figura 1.4.2.1: A engrenagem de configurações do painel JS.*

![Janela Pen Settings, aba JS, com JavaScript Preprocessor e os dois campos de scripts externos preenchidos com os links do React e do ReactDOM destacados em vermelho, e o botão Save & Close destacado](img/fig-1-4-2-2.webp)

*Figura 1.4.2.2: Babel como pré-processador e os scripts do React e do ReactDOM.*

### CSS para o componente Quadrado

Note que uma classe CSS foi aplicada ao componente e seu nome é `quadrado`. Sua definição é dada na Listagem 1.4.3.1. Adicione-a à região apropriada para CSS do CodePen.

**CSS (CodePen) · Listagem 1.4.3.1**

```css
.quadrado {
  background: #fff;
  border: 1px solid #999;
  font-size: 24px;
  float: left;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}
```

## Renderizando o Quadrado
Duration: 5:00

Precisamos indicar um elemento HTML em que o componente React será renderizado. Aquilo que ele devolve (os elementos que definem sua aparência visual) tomará o lugar do elemento HTML indicado. Em geral, um container `div` é utilizado.

Adicione o elemento HTML da Listagem 1.4.4.1.1 à região apropriada para HTML do CodePen.

**HTML (CodePen) · Listagem 1.4.4.1.1**

```html
<div id="root"></div>
```

Logo abaixo da definição do componente `Quadrado`, ou seja, na região apropriada para JavaScript do CodePen, adicione o código da Listagem 1.4.4.2.1. Ali estamos dizendo que o React deve renderizar o componente `Quadrado` no lugar do elemento HTML cujo id é `root`. Note que especificamos valores para as propriedades (props, lembra?) `onClick` e `value` do componente, apenas como teste.

**JS (CodePen) · Listagem 1.4.4.2.1**

```jsx
ReactDOM.render (
  <Quadrado
    onClick={
      () => {
        alert ('Clicou!');
      }
    }
    value={2 + 2}
  />,
  document.getElementById ("root")
);
```

Se tudo estiver certo, você deverá ver um único quadrado com o número quatro e com bordas. Clique nele para ver se o alerta aparece também.

## O componente Tabuleiro
Duration: 12:00

Agora passamos a especificar o componente que representa o tabuleiro do jogo. Ele é composto por nove Quadrados. A renderização de cada Quadrado é essencialmente a mesma, a menos do conteúdo de cada um deles, além da sua posição, que será importante para verificar se o jogo já acabou. Assim, a especificação de uso dos Quadrados por parte do Tabuleiro será escrita uma única vez, em um método auxiliar, que recebe como parâmetro o número que identifica o Quadrado a ser renderizado. Por essa razão, iremos definir o componente `Tabuleiro` por meio de uma **classe**.

### A classe Tabuleiro

Comece escrevendo a classe `Tabuleiro`, que deve ser subclasse de `React.Component`. Veja a Listagem 1.5.1.1.

**JS (CodePen) · Listagem 1.5.1.1**

```jsx
class Tabuleiro extends React.Component{

}
```

### O método auxiliar para renderizar cada quadrado

A seguir, ainda na classe `Tabuleiro`, vamos definir o método auxiliar que será chamado nove vezes, uma para cada Quadrado. Ele recebe um índice que será utilizado para indexar uma coleção chamada `quadrados`, recebida via props. A coleção armazena o conteúdo a ser exibido por cada quadrado. Por ser membro da classe, ela deve ter o acesso qualificado com `this`. Veja a Listagem 1.5.2.1.

**JS (CodePen), dentro da classe Tabuleiro · Listagem 1.5.2.1**

```jsx
renderizarQuadrado (i){
  return (
    <Quadrado
      value={this.props.quadrados[i]}
      onClick={() => {
        alert ('Clicou ' + (this.props.quadrados[i]))
      }}
    />
  );
}
```

### Renderização do Tabuleiro

Agora é preciso especificar a forma como o Tabuleiro será exibido. Quando um componente React é definido por meio de uma classe, o código que define sua aparência visual deve ser especificado e devolvido por meio de uma função chamada `render`. O tabuleiro possui três linhas, cada qual com três Quadrados. Veja a Listagem 1.5.3.1.

<aside class="positive">

**Obs.:** No contexto JSX, podemos utilizar JavaScript normalmente. Porém, toda expressão JavaScript que aparecer nesse contexto deve ser englobada por abrir e fechar chaves. Cada Quadrado está sendo adicionado ao Tabuleiro por meio da chamada ao método `renderizarQuadrado`. Uma chamada a um método é uma expressão JavaScript, razão pela qual usamos abrir e fechar chaves antes de fazer a chamada ao método.

</aside>

**JS (CodePen), dentro da classe Tabuleiro · Listagem 1.5.3.1**

```jsx
render (){
  return (
    <div>
      <div className="board-row">
        {this.renderizarQuadrado(0)}
        {this.renderizarQuadrado (1)}
        {this.renderizarQuadrado (2)}
      </div>
      <div className="board-row">
        {this.renderizarQuadrado (3)}
        {this.renderizarQuadrado (4)}
        {this.renderizarQuadrado (5)}
      </div>
      <div className="board-row">
        {this.renderizarQuadrado (6)}
        {this.renderizarQuadrado (7)}
        {this.renderizarQuadrado (8)}
      </div>
    </div>
  );
}
```

### CSS do Tabuleiro

Utilizamos um pseudo elemento em CSS para remover o efeito causado pela propriedade `float` usada anteriormente. Além disso, especificamos que cada linha deve ser exibida como um bloco, o que faz com que haja uma quebra de linha após a sua aparição. Veja a Listagem 1.5.4.1.

**CSS (CodePen) · Listagem 1.5.4.1**

```css
.board-row:after {
  clear: both;
  content: "";
  display: block;
}
```

<aside class="positive">

**Nota:** Quando aplicamos um pseudo elemento a um seletor, podemos estilizar uma parte específica do elemento selecionado. Para saber mais, veja o conteúdo do link [https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements).

</aside>

### Visualizando o Tabuleiro

Agora precisamos indicar que um componente do tipo `Tabuleiro` deve ser renderizado no lugar da `div` cujo id é `root`. Comente a chamada ao método `ReactDOM.render` existente e substitua-a pelo código da Listagem 1.5.5.1.

**JS (CodePen) · Listagem 1.5.5.1**

```jsx
ReactDOM.render (
  <Tabuleiro quadrados={Array(9).fill().map((value, pos) => pos)} />,
  document.getElementById("root")
);
```

Se tudo deu certo, você deverá estar vendo o que mostra a Figura 1.5.5.1. Clique nos quadrados para ver se tudo está funcionando.

![Tabuleiro de três por três com os números de 0 a 8 nos quadrados](img/fig-1-5-5-1.webp)

*Figura 1.5.5.1: O Tabuleiro exibindo a posição de cada Quadrado.*

## O componente Jogo
Duration: 6:00

A seguir, iremos definir o componente `Jogo`. Além de exibir um Tabuleiro, um Jogo também tem informações sobre o status do jogo e a lista de movimentos que permite navegar entre as jogadas.

### Esqueleto inicial do Jogo

A Listagem 1.6.1.1 mostra o esqueleto inicial do componente `Jogo`, com as partes mencionadas.

**JS (CodePen) · Listagem 1.6.1.1**

```jsx
class Jogo extends React.Component {
  render () {
    return (
      <div className="game">
        <div className="game-board">
          <Tabuleiro quadrados={Array(9).fill().map((value, pos) => pos)}/>
        </div>
      </div>
    );
  }
}
```

### CSS do componente Jogo

O esqueleto do componente `Jogo` definido até então já faz uso de algumas classes CSS. Veja sua definição na Listagem 1.6.2.1.

**CSS (CodePen) · Listagem 1.6.2.1**

```css
.game {
  display: flex;
  flex-direction: row;
}
```

### Exibindo o componente Jogo

A fim de verificar a exibição do componente `Jogo`, comente a chamada ao método `ReactDOM.render` existente e adicione o código a seguir.

**JS (CodePen)**

```jsx
ReactDOM.render (
  <Jogo />,
  document.getElementById("root")
);
```

## Lidando com o estado do jogo
Duration: 15:00

Quando um objeto `Quadrado` é clicado, ele precisa se lembrar do símbolo que exibe, que pode ser um X ou um O. No React, os componentes fazem isso por meio de seu **estado**. Há um mecanismo que permite que componentes funcionais (aqueles definidos utilizando-se funções) tenham estado. Eles serão utilizados em outro momento. Neste ponto, iremos redefinir o componente `Quadrado` utilizando uma classe, o que viabiliza de maneira muito simples a existência de seu estado: ele será armazenado em variáveis de instância.

### Quadrado como classe

Vamos reescrever o componente `Quadrado` conforme mostra a Listagem 1.7.1. A princípio, quando clicado, ele vai ficar exibindo o símbolo X. Lembre-se de comentar a definição do `Quadrado` feita anteriormente, usando uma função.

**JS (CodePen) · Listagem 1.7.1**

```jsx
class Quadrado extends React.Component {
  constructor (props){
    super (props);
    this.state = {
      value: null,
    };
  }

  render (){
    return (
      <button
        className="quadrado"
        onClick={() => {this.setState({value: 'X'})}}>
        {this.state.value}
      </button>
    );
  }
}
```

### O Tabuleiro guarda o estado

Podemos manter o estado do jogo em cada Quadrado. Para resolver o problema de verificar se houve ganho ou se o jogo acabou, o componente `Tabuleiro` poderia perguntar qual o estado de cada Quadrado ao longo das verificações. Porém, essa implementação pode ser inconveniente e difícil de se manter. Neste cenário, é mais apropriado que o Tabuleiro mantenha o estado do jogo e que ele informe a cada Quadrado o que exibir por meio de seu props. Faça os ajustes da Listagem 1.7.2.1 no componente `Tabuleiro`.

**JS (CodePen), classe Tabuleiro · Listagem 1.7.2.1**

```jsx
//ajusta construtor
constructor (props){
  super (props);
  this.state = {
    quadrados: Array(9).fill(null)
  };
}

//ajuste no método
renderizarQuadrado (i){
  return (
    <Quadrado
      value={this.state.quadrados[i]}
    />
  );
}
```

Note que neste instante os Quadrados continuam exibindo o símbolo X, baseado em seu estado. Isso será alterado em breve.

### Avisando o Tabuleiro sobre o clique

A seguir, precisamos alterar o que ocorre quando um Quadrado é clicado. O Tabuleiro é quem sabe quais Quadrados estão preenchidos. Os Quadrados precisam, de alguma forma, informar ao Tabuleiro que foram clicados. Eles não podem alterar o estado do Tabuleiro. Por isso, o Tabuleiro irá passar uma função a cada Quadrado que será chamada quando o clique acontecer. Ela, por sua vez, irá atualizar o estado do tabuleiro. Veja a alteração na Listagem 1.7.3.1.

**JS (CodePen), classe Tabuleiro · Listagem 1.7.3.1**

```jsx
//ajuste no método
renderizarQuadrado (i){
  return (
    <Quadrado
      value={this.state.quadrados[i]}
      onClick={() => this.handleClick(i)}
    />
  );
}
```

Agora precisamos fazer com que os Quadrados utilizem seus props, pois ali estão sendo entregues o valor que cada um deve exibir bem como a função a chamar. Veja a Listagem 1.7.4.1.

**JS (CodePen) · Listagem 1.7.4.1**

```jsx
//não precisa mais do construtor
class Quadrado extends React.Component {
  render (){
    return (
      <button
        className="quadrado"
        onClick={() => {this.props.onClick()}}>
        {this.props.value}
      </button>
    );
  }
}
```

Note que a função `handleClick` não existe ainda e, por isso, o código não funciona. Ela deve ser definida pelo componente `Tabuleiro`, como mostra a Listagem 1.7.5.1. Ele faz uma cópia do vetor de quadrados, preenche a posição `i` com X e reconfigura o estado do componente.

**JS (CodePen), classe Tabuleiro · Listagem 1.7.5.1**

```jsx
handleClick (i){
  //faz uma cópia do vetor
  const quadrados = this.state.quadrados.slice();
  quadrados[i] = 'X';
  this.setState ({quadrados: quadrados});
}
```

## Alternância de jogadores e vencedor
Duration: 15:00

### Alternando os jogadores

Agora iremos garantir a alternância dos jogadores. O jogador X será o primeiro, por padrão. Isso será indicado por uma variável no estado do componente `Tabuleiro`. Depois, a cada clique, o valor deve ser alterado, para que seja vez do outro jogador. Veja a Listagem 1.7.6.1.

**JS (CodePen), classe Tabuleiro · Listagem 1.7.6.1**

```jsx
constructor (props){
  super (props);
  this.state = {
    quadrados: Array(9).fill(null),
    xIsNext: true
  };
}

handleClick (i){
  //faz uma cópia do vetor
  const quadrados = this.state.quadrados.slice();
  quadrados[i] = this.state.xIsNext ? 'X' : 'O';
  this.setState ({
    quadrados: quadrados,
    xIsNext: !this.state.xIsNext
  });
}
```

### O status do jogo

Vamos alterar o texto que indica o status do jogo no componente `Tabuleiro`. Primeiro, será necessário alterar o método `render`, como na Listagem 1.7.7.1.

**JS (CodePen), classe Tabuleiro · Listagem 1.7.7.1**

```jsx
render (){
  const status = 'Jogador: ' + (this.state.xIsNext ? 'X' : 'O');
  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {this.renderizarQuadrado(0)}
        {this.renderizarQuadrado(1)}
        {this.renderizarQuadrado(2)}
      </div>
      <div className="board-row">
        {this.renderizarQuadrado(3)}
        {this.renderizarQuadrado(4)}
        {this.renderizarQuadrado(5)}
      </div>
      <div className="board-row">
        {this.renderizarQuadrado(6)}
        {this.renderizarQuadrado(7)}
        {this.renderizarQuadrado(8)}
      </div>
    </div>
  );
}
```

### Detectando o vencedor

A fim de decidir se houve ganho, vamos escrever a seguinte função. Ela pode ser definida de maneira independente dos componentes. Perceba que ela considera cada possível combinação que pode indicar ganho no jogo. Veja a Listagem 1.7.8.1.

**JS (CodePen) · Listagem 1.7.8.1**

```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    //atribuição via desestruturação
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

A função será usada pelo Tabuleiro. A cada rodada, ele atualiza o status e agora irá considerar a possibilidade de ganho, como na Listagem 1.7.9.1.

**JS (CodePen), classe Tabuleiro · Listagem 1.7.9.1**

```jsx
render (){
  const vencedor = calculateWinner (this.state.quadrados);
  let status;
  if (vencedor){
    status = 'Vencedor: ' + vencedor;
  }
  else{
    status = 'Jogador: ' + (this.state.xIsNext ? 'X' : 'O');
  }
  //o resto permanece o mesmo
```

### Encerrando a jogada

Veja que podemos encerrar a execução do método `handleClick` em dois casos: se o clique acontecer e houver vencedor e também no caso em que um clique for realizado em um quadrado já ocupado. Veja a Listagem 1.7.10.1.

**JS (CodePen), classe Tabuleiro · Listagem 1.7.10.1**

```jsx
handleClick (i){
  //faz uma cópia do vetor
  const quadrados = this.state.quadrados.slice();
  if (calculateWinner (quadrados)){
    alert ('Jogo já acabou');
    return;
  }
  if (quadrados[i]){
    alert ('Quadrado ocupado!')
    return;
  }
  quadrados[i] = this.state.xIsNext ? 'X' : 'O';
  this.setState ({
    quadrados: quadrados,
    xIsNext: !this.state.xIsNext,
  });
}
```

<aside class="negative">

Na apostila impressa, `handleClick` grava `'0'` (zero) para o segundo jogador, enquanto o status exibe a letra `'O'`. Aqui usamos `'O'` nos dois lugares, para o tabuleiro e o status mostrarem o mesmo símbolo.

</aside>

## Exercícios
Duration: 20:00

1. Adicione um botão ao jogo que permite reiniciá-lo, apagando todas as jogadas.
2. Adicione um botão ao jogo que, quando clicado, faz uma jogada com o jogador da vez, escolhendo uma casa aleatória que esteja vazia.

### Referências

* React: A JavaScript library for building user interfaces. 2020. Disponível em [https://reactjs.org/](https://reactjs.org/). Acesso em fevereiro de 2020.
* React Native: A framework for building native apps using React. 2020. Disponível em [https://facebook.github.io/react-native/](https://facebook.github.io/react-native/). Acesso em fevereiro de 2020.
