summary: Entenda o mecanismo props do React construindo uma lista de pedidos com Bootstrap e Font Awesome, refatorando-a em componentes reutilizáveis (Pedido, Cartao e Feedback) e usando a propriedade children.
id: react-props
categories: React,JavaScript
tags: react,props,componentes,children,bootstrap,font awesome,create-react-app
status: Published
authors: Rodrigo Bossini
last updated: 2022-10-08
pdf: react/04_apostila_react_props.pdf
exercicios: react/04_exercicios_react_props.pdf,react/04_exercicios_com_respostas_props.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React: componentes e props

## Visão geral
Duration: 4:00

Neste material, estudaremos mais sobre componentes React e sobre o mecanismo conhecido como **props** — que vem de **properties**. Trata-se de um mecanismo que permite a "entrega" de dados a componentes quando estes são utilizados por meio de sua tag. É análogo à passagem de argumentos entre funções, comum em qualquer linguagem de programação.

A Figura 1.1 destaca algumas das principais características de componentes React. Assim como um componente React pode utilizar elementos HTML comuns, ele também pode utilizar outros componentes React previamente definidos. Ou seja, componentes React podem ser **aninhados**. Uma vez que um componente React tenha sido definido, ele pode ser utilizado inúmeras vezes. Ou seja, componentes React são **reutilizáveis**. Um componente React pode ser **configurado** por meio de suas **prop**riedades. A cada vez que é utilizado, um componente React pode se apresentar de forma diferente devido a valores diferentes que lhe foram entregues.

![Página "Seus pedidos" com três cartões (SSD, Livro e Notebook), anotada com "Componentes podem ser aninhados", "Componentes podem ser reutilizados" e "Componentes podem ser configurados por meio de suas propriedades"](img/fig-1-1.webp)

*Figura 1.1: características de componentes React na aplicação que vamos construir.*

### O que você vai aprender

* Criar uma aplicação com o create-react-app
* Integrar o Bootstrap e os ícones do Font Awesome a uma aplicação React
* Construir uma lista de pedidos com o grid e os cartões do Bootstrap
* Refatorar código repetido em um componente próprio (`Pedido`)
* Usar o mecanismo **props** para configurar componentes
* Criar componentes genéricos com a propriedade `children` (`Cartao`)
* Passar funções via props (`Feedback`)

### O que você vai precisar

* Node.js e npm instalados
* O VS Code (ou outro editor de código)
* Conhecimentos básicos de componentes React e JSX

<aside class="negative">

Este material usa o **create-react-app** e `ReactDOM.render`, como era usual em 2021. O create-react-app hoje é considerado obsoleto; para novos projetos, use o Vite (veja o codelab `react-introducao`). Os conceitos de props e `children` continuam exatamente os mesmos.

</aside>

## Criando a aplicação
Duration: 6:00

Nesta seção, vamos ilustrar as características de componentes React destacadas desenvolvendo a aplicação que a Figura 1.1 exibe.

### Criando uma aplicação ReactJS

Use o comando

**Terminal**

```bash
npx create-react-app react-componentes-props
```

para criar a aplicação. Caso seja a primeira execução do create-react-app usando o npx e a versão do npm seja 7+, a mensagem da Figura 2.1.1 deverá ser exibida. Basta confirmar para prosseguir.

**Figura 2.1.1**

```text
Need to install the following packages:
  create-react-app
Ok to proceed? (y)
```

<aside class="positive">

**Nota.** A ferramenta **npx** faz o download do pacote executado — neste caso, o create-react-app — e o mantém instalado em sua memória "cache" — um simples diretório em seu sistema de arquivos. O diretório utilizado depende de onde o NodeJS está instalado. No Linux com NodeJS instalado usando o nvm, ele pode ser encontrado em um diretório cujo path é parecido com `/home/rodrigo/.npm/_npx/`. Os arquivos ali existentes não fazem parte de sua aplicação React. São arquivos referentes ao pacote instalado apenas.

</aside>

Depois de criar o projeto, use

**Terminal**

```bash
cd react-componentes-props
```

para navegar até o diretório recém-criado. Abra uma instância do VS Code vinculada ao diretório atual com

**Terminal**

```bash
code .
```

No VS Code, clique **Terminal >> New Terminal** para abrir um novo terminal. Use

**Terminal**

```bash
npm start
```

para colocar a aplicação em execução. A aplicação pode ser visualizada em `localhost:3000`.

### Um componente simples

Apague todos os arquivos existentes na pasta `src`. A seguir, crie um arquivo chamado `index.js` na mesma pasta. Utilize o conteúdo do Bloco de Código 2.2.1 para criar um componente React simples.

**src/index.js · Bloco de Código 2.2.1**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  return <div>Um componente</div>
}

ReactDOM.render(
  <App />,
  document.querySelector('#root')
)
```

## Bootstrap e Font Awesome
Duration: 8:00

### Usando o Bootstrap

Neste exemplo, utilizaremos o Bootstrap para tratar dos aspectos visuais da aplicação. Ele pode ser integrado à aplicação de diferentes formas:

- Podemos importá-lo via CDN no arquivo `public/index.html`, como mostra o Bloco de Código 2.3.1.

**public/index.html · Bloco de Código 2.3.1**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
  </body>
</html>
```

- Também é possível instalar o Bootstrap com

**Terminal**

```bash
npm install bootstrap
```

Feita a sua instalação, é preciso importar o conteúdo desejado no arquivo `src/index.js`, como ilustra o Bloco de Código 2.3.2.

**src/index.js · Bloco de Código 2.3.2**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

const App = () => {
  return <div>Um componente</div>
}

ReactDOM.render(
  <App />,
  document.querySelector('#root')
)
```

- Finalmente, também é possível fazer uso do Bootstrap por meio de pacotes como o **react-bootstrap**. Trata-se de uma implementação dos componentes do Bootstrap usando componentes React. Assim, cada componente do Bootstrap pode ser utilizado como um componente React. Veja mais sobre ele no Link 2.3.1.

**Link 2.3.1:** [https://react-bootstrap.github.io/](https://react-bootstrap.github.io/)

Utilizaremos a segunda opção, ou seja, a instalação do bootstrap com npm. Por isso, ajuste seu código como destaca o Bloco de Código 2.3.2. Não é necessário, portanto, manter a alteração feita no arquivo `public/index.html`.

### Ícones do Font Awesome

**Font Awesome** é o nome de uma biblioteca que viabiliza o uso de ícones de alta qualidade. A sua página oficial pode ser encontrada por meio do Link 2.4.1.

**Link 2.4.1:** [https://fontawesome.com/](https://fontawesome.com/)

Podemos habilitar o seu uso no projeto de diferentes formas. A importação via CDN e a instalação usando o npm são dois exemplos. Utilizaremos o segundo. Para tal, use

**Terminal**

```bash
npm install --save @fortawesome/fontawesome-free
```

A seguir, ajuste o arquivo `index.js` como ilustra o Bloco de Código 2.4.1.

**src/index.js · Bloco de Código 2.4.1**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'

const App = () => {
  return <div>Um componente</div>
}

ReactDOM.render(
  <App />,
  document.querySelector('#root')
)
```

## Criando a lista de três pedidos
Duration: 12:00

Nesta seção, criamos a interface gráfica ilustrada na Figura 1.1.

- Começamos com um container responsivo do Bootstrap, como no Bloco de Código 2.5.1.

**src/index.js · Bloco de Código 2.5.1**

```jsx
const App = () => {
  return (
    // container principal
    <div className="container border rounded mt-2">

    </div>
  );
}
```

- A seguir, adicionamos o título, como mostra o Bloco de Código 2.5.2.

**src/index.js · Bloco de Código 2.5.2**

```jsx
const App = () => {
  return (
    // container principal
    <div className="container border rounded mt-2">
      {/* linha para o título */}
      <div className="row border-bottom m-2">
        <h1 className="display-5 text-center">Seus pedidos</h1>
      </div>
    </div>
  );
}
```

- A definição do primeiro pedido será feita em uma nova linha do bootstrap. Veja o Bloco de Código 2.5.3.

**src/index.js · Bloco de Código 2.5.3**

```jsx
const App = () => {
  return (
    // container principal
    <div className="container border rounded mt-2">
      {/* linha para o título */}
      <div className="row border-bottom m-2">
        <h1 className="display-5 text-center">Seus pedidos</h1>
      </div>

      {/* linha para o primeiro pedido pedido*/}
      <div className="row">

      </div>
    </div>
  );
}
```

- Podemos utilizar algumas classes do modelo grid do Bootstrap para lidar com a responsividade, como no Bloco de Código 2.5.4.

**src/index.js · Bloco de Código 2.5.4**

```jsx
const App = () => {
  return (
    // container principal
    <div className="container border rounded mt-2">
      {/* linha para o título */}
      <div className="row border-bottom m-2">
        <h1 className="display-5 text-center">Seus pedidos</h1>
      </div>

      {/* linha para o primeiro pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">

        </div>
      </div>
    </div>
  );
}
```

- Cada pedido será definido como um cartão do Bootstrap, com cabeçalho e corpo. Veja o Bloco de Código 2.5.5.

**src/index.js · Bloco de Código 2.5.5**

```jsx
const App = () => {
  return (
    // container principal
    <div className="container border rounded mt-2">
      {/* linha para o título */}
      <div className="row border-bottom m-2">
        <h1 className="display-5 text-center">Seus pedidos</h1>
      </div>

      {/* linha para o primeiro pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">
          {/* cartão */}
          <div className="card">
            {/* cabeçalho do cartão */}
            <div className="card-header text-muted">22/04/2021</div>
            {/* corpo do cartão */}
            <div className="card-body d-flex">
              <div className="d-flex align-items-center">
                <i className="fas fa-hdd fa-2x"></i>
              </div>
              {/* flex-grow 1: tomar espaço remanescente */}
              <div className="flex-grow-1 ms-2 border">
                <h4 className="text-center">SSD</h4>
                <p className="text-center">SSD Kingston A400 - SATA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- O segundo pedido será definido de maneira análoga. Criamos uma linha do Bootstrap logo abaixo da linha do primeiro pedido. Veja o Bloco de Código 2.5.6.

**src/index.js · Bloco de Código 2.5.6**

```jsx
const App = () => {
  return (
    // container principal
    <div className="container border rounded mt-2">
      {/* linha para o título */}
      <div className="row border-bottom m-2">
        <h1 className="display-5 text-center">Seus pedidos</h1>
      </div>

      {/* linha para o primeiro pedido pedido*/}
      <div className="row ">
        ...
      </div>
      {/* linha para o segundo pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">
          {/* cartão */}
          <div className="card">
            {/* cabeçalho do cartão */}
            <div className="card-header text-muted">20/04/2021</div>
            {/* corpo do cartão */}
            <div className="card-body d-flex">
              <div className="d-flex align-items-center">
                <i className="fas fa-book fa-2x"></i>
              </div>
              {/* flex-grow 1: tomar espaço remanescente */}
              <div className="flex-grow-1 ms-2 border">
                <h4 className="text-center">Livro</h4>
                <p className="text-center">Concrete Mathematics - Donald Knuth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- O terceiro pedido é definido de maneira análoga aos demais, como no Bloco de Código 2.5.7.

**src/index.js · Bloco de Código 2.5.7**

```jsx
const App = () => {
  return (
    // container principal
    <div className="container border rounded mt-2">
      {/* linha para o título */}
      <div className="row border-bottom m-2">
        <h1 className="display-5 text-center">Seus pedidos</h1>
      </div>

      {/* linha para o primeiro pedido pedido*/}
      <div className="row ">
        ...
      </div>
      {/* linha para o segundo pedido pedido*/}
      <div className="row">
        ...
      </div>
      {/* linha para o terceiro pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">
          {/* cartão */}
          <div className="card">
            {/* cabeçalho do cartão */}
            <div className="card-header text-muted">21/01/2021</div>
            {/* corpo do cartão */}
            <div className="card-body d-flex">
              <div className="d-flex align-items-center">
                <i className="fas fa-laptop fa-2x"></i>
              </div>
              {/* flex-grow 1: tomar espaço remanescente */}
              <div className="flex-grow-1 ms-2 border">
                <h4 className="text-center">Notebook</h4>
                <p className="text-center">Notebook Dell - 8Gb - i5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

<aside class="positive">

Nos blocos em que aparece `...`, as reticências indicam trechos já mostrados anteriormente e que continuam iguais.

</aside>

## Refatorando: o componente Pedido
Duration: 8:00

O código HTML que define cada pedido é essencialmente igual aos demais, a menos do conteúdo. Trata-se de um bloco de código que desejamos reutilizar em diferentes partes da aplicação. Esse tipo de código deve ser definido como um componente React à parte. Vejamos como fazê-lo.

- Comece criando um arquivo chamado `Pedido.js` na pasta `src`. Seu conteúdo inicial aparece no Bloco de Código 2.6.1.

**src/Pedido.js · Bloco de Código 2.6.1**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'

const Pedido = () => {

}
```

- A seguir, recorte a definição do primeiro pedido existente no arquivo `index.js` e cole no arquivo `Pedido.js`, como mostra o Bloco de Código 2.6.2.

**src/Pedido.js · Bloco de Código 2.6.2**

```jsx
import React from 'react'

const Pedido = () => {
  return (
    <div className="card">
      {/* cabeçalho do cartão */}
      <div className="card-header text-muted">22/04/2021</div>
      {/* corpo do cartão */}
      <div className="card-body d-flex">
        <div className="d-flex align-items-center">
          <i className="fas fa-hdd fa-2x"></i>
        </div>
        {/* flex-grow 1: tomar espaço remanescente */}
        <div className="flex-grow-1 ms-2 border">
          <h4 className="text-center">SSD</h4>
          <p className="text-center">SSD Kingston A400 - SATA</p>
        </div>
      </div>
    </div>
  )
}

export default Pedido;
```

- O arquivo `index.js`, no momento, não possui mais a definição que foi recortada. Veja o Bloco de Código 2.6.3.

**src/index.js · Bloco de Código 2.6.3**

```jsx
...
      {/* linha para o primeiro pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">
          {/* essa região fica sem conteúdo algum, por enquanto*/}
        </div>
      </div>
...
```

- O nome de um componente React pode ser utilizado de maneira semelhante ao uso de uma tag HTML. Quando fazemos isso, a função que o define é colocada em execução, produzindo a expressão JSX que especificamos. Assim, o componente React `Pedido` pode ser utilizado no arquivo `index.js` como destaca o Bloco de Código 2.6.4.

**src/index.js · Bloco de Código 2.6.4**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import Pedido from './Pedido'
...
      {/* linha para o primeiro pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">
          <Pedido />
        </div>
      </div>
...
```

## O mecanismo props
Duration: 8:00

Embora tenhamos refatorado a aplicação criando um componente próprio para a representação de pedidos, ele ainda não é realmente reutilizável. Afinal, seu conteúdo, como nome, descrição e ícone referentes ao pedido, está fixo. Precisamos de um mecanismo que viabilize a especificação do conteúdo a ser utilizado pelo componente no momento em que o utilizamos.

Estamos falando do mecanismo conhecido como **props**. Trata-se de um mecanismo extremamente simples: quando utilizamos um componente por meio de sua tag, especificamos pares chave/valor que ele poderá utilizar internamente. Essas são as suas **propriedades**. Daí o nome. Funciona exatamente da mesma forma como a passagem de argumentos para uma função, quando a colocamos em execução. Os valores especificados são "empacotados" em um objeto JSON que pode ser acessado pelo componente. A Figura 2.7.1 ilustra a ideia.

![Diagrama: a tag Pedido com data, icone, titulo e descricao faz a função Pedido ser chamada com um objeto JSON contendo esses pares chave/valor; dentro do componente, props.data, props.icone, props.titulo e props.descricao são acessados com o operador ponto](img/fig-2-7-1.webp)

*Figura 2.7.1: as propriedades especificadas na tag chegam ao componente como um objeto.*

- Assim, podemos reutilizar o componente para definir os três pedidos da lista. A sua definição, feita no arquivo `Pedido.js`, aparece no Bloco de Código 2.7.1.

<aside class="positive">

**Nota.** O nome `props` é uma convenção. É possível utilizar qualquer outro identificador válido.

</aside>

**src/Pedido.js · Bloco de Código 2.7.1**

```jsx
import React from 'react'

const Pedido = (props) => {
  return (
    <div className="card">
      {/* cabeçalho do cartão */}
      <div className="card-header text-muted">{props.data}</div>
      {/* corpo do cartão */}
      <div className="card-body d-flex">
        <div className="d-flex align-items-center">
          <i className={props.icone}></i>
        </div>
        {/* flex-grow 1: tomar espaço remanescente */}
        <div className="flex-grow-1 ms-2 border">
          <h4 className="text-center">{props.titulo}</h4>
          <p className="text-center">{props.descricao}</p>
        </div>
      </div>
    </div>
  )
}

export default Pedido;
```

- O componente `Pedido` será utilizado três vezes no arquivo `index.js`. Uma vez para cada pedido da lista. Cada um tem conteúdo distinto, que será especificado via props. Veja o Bloco de Código 2.7.2.

**src/index.js · Bloco de Código 2.7.2**

```jsx
...
      {/* linha para o primeiro pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">
          <Pedido data="22/04/2021" icone="fas fa-hdd fa-2x" titulo="SSD"
            descricao="SSD Kingston A400 - SATA"/>
        </div>
      </div>
      {/* linha para o segundo pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">
          <Pedido data="20/04/2021" icone="fas fa-book fa-2x" titulo="Livro"
            descricao="Concrete Mathematics - Donald Knuth" />
        </div>
      </div>
      {/* linha para o terceiro pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">
          <Pedido data="21/01/2021" icone="fas fa-laptop fa-2x" titulo="Notebook"
            descricao="Notebook Dell - 8Gb - i5" />
        </div>
      </div>
...
```

## Nova refatoração: componente Cartao
Duration: 10:00

"Cartões" são elementos muito utilizados por aplicações para exibir conteúdo. Podemos promover ainda mais o nível de reusabilidade de nossos componentes criando um componente que seja capaz de representar cartões de maneira independente, não estando atrelado à exibição de pedidos. Para fazê-lo, crie um arquivo chamado `Cartao.js` na pasta `src`. Seu conteúdo aparece no Bloco de Código 2.8.1.

**src/Cartao.js · Bloco de Código 2.8.1**

```jsx
import React from 'react'

const Cartao = (props) => {
  return (
    <div className="card">
      {/* cabeçalho do cartão */}
      <div className="card-header text-muted">{props.cabecalho}</div>
      {/* corpo do cartão */}
      <div className="card-body">
        {props.children}
      </div>
    </div>
  )
}

export default Cartao;
```

Repare em dois detalhes: `props.cabecalho` e `props.children`. Deixamos em aberto o conteúdo do cabeçalho do cartão, o qual será entregue via props. Além disso, utilizamos a propriedade implícita chamada **children**. Ela representa os elementos "filhos" de um `Cartao`, especificados no momento de seu uso. A Figura 2.8.1 ilustra esse detalhe.

![Diagrama: a tag Cartao com cabecalho="Exemplo" e uma div filha faz a função Cartao ser chamada com um objeto contendo cabecalho e children; o componente exibe o conteúdo filho usando props.children](img/fig-2-8-1.webp)

*Figura 2.8.1: o conteúdo entre as tags de abertura e fechamento chega ao componente na propriedade `children`.*

O Bloco de Código 2.8.2 destaca o uso do componente `Cartao` no arquivo `index.js`.

**src/index.js · Bloco de Código 2.8.2**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import Pedido from './Pedido'
import Cartao from './Cartao'
...
      {/* linha para o primeiro pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">
          <Cartao cabecalho="22/04/2021">
            <Pedido icone="fas fa-hdd fa-2x" titulo="SSD" descricao="SSD Kingston A400 - SATA"/>
          </Cartao>
        </div>
      </div>
      {/* linha para o segundo pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">
          <Cartao cabecalho="20/04/2021">
            <Pedido icone="fas fa-book fa-2x" titulo="Livro" descricao="Concrete Mathematics - Donald Knuth" />
          </Cartao>
        </div>
      </div>
      {/* linha para o terceiro pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">
          <Cartao cabecalho="21/01/2021">
            <Pedido icone="fas fa-laptop fa-2x" titulo="Notebook" descricao="Notebook Dell - 8Gb - i5" />
          </Cartao>
        </div>
      </div>
```

A essa altura, a definição do componente `Pedido` ainda inclui os detalhes referentes à definição de um cartão Bootstrap. Para completar esse passo da refatoração, precisamos removê-las, como no Bloco de Código 2.8.3. Repare que agora as props são obtidas por **desestruturação** diretamente na lista de parâmetros.

**src/Pedido.js · Bloco de Código 2.8.3**

```jsx
const Pedido = ({icone, titulo, descricao}) => {
  return (
    <div className="d-flex">
      <div className="d-flex align-items-center">
        <i className={`${icone}`}></i>
      </div>
      <div className="flex-grow-1 ms-2 border">
        <h4 className="text-center">{titulo}</h4>
        <p className="text-center">{descricao}</p>
      </div>
    </div>
  )
}

export default Pedido
```

## Componente para Feedback
Duration: 8:00

Temos uma nova funcionalidade a ser implementada: cada pedido deve exibir botões para que o usuário possa confirmar se a entrega já ocorreu. Podemos, evidentemente, construir um componente React para isso. Ele será um componente que exibe dois botões. Um servirá para que o usuário confirme a entrega e, o outro, para dizer que a entrega ainda não aconteceu. Pensando em reusabilidade, deixaremos os textos que cada botão exibe bem como as funções que são chamadas quando clicados em aberto. Crie um arquivo chamado `Feedback.js` na pasta `src`. Seu conteúdo aparece no Bloco de Código 2.9.1.

**src/Feedback.js · Bloco de Código 2.9.1**

```jsx
import React from 'react';

const Feedback = props => {
  return (
    <div className="d-flex justify-content-evenly m-2">
      <button
        type="button"
        onClick={props.funcaoOK}
        className="btn btn-primary">
        {props.textoOK}
      </button>
      <button
        type="button"
        onClick={props.funcaoNOK}
        className="btn btn-danger">
        {props.textoNOK}
      </button>
    </div>
  )
}

export default Feedback;
```

No arquivo `index.js`, cada componente `Pedido` terá um "irmão" — filho do mesmo `Cartao` — do tipo `Feedback`. Veja o Bloco de Código 2.9.2.

**src/index.js · Bloco de Código 2.9.2**

```jsx
…
import Feedback from './Feedback'
…
const App = () => {
  const textoOK = "Já chegou"
  const textoNOK = "Ainda não chegou"
  const funcaoOK = () => alert ("Agradecemos a confirmação!")
  const funcaoNOK = () => alert ("Verificaremos o ocorrido!")
  const componenteFeedback = <Feedback textoOK={textoOK} funcaoOK={funcaoOK} textoNOK={textoNOK} funcaoNOK={funcaoNOK}/>;
  return (
…
      {/* linha para o primeiro pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">
          <Cartao cabecalho="22/04/2021">
            <Pedido icone="fas fa-hdd fa-2x" titulo="SSD" descricao="SSD Kingston A400 - SATA"/>
            {componenteFeedback}
          </Cartao>
        </div>
      </div>
      {/* linha para o segundo pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">
          <Cartao cabecalho="20/04/2021">
            <Pedido icone="fas fa-book fa-2x" titulo="Livro" descricao="Concrete Mathematics - Donald Knuth" />
            {componenteFeedback}
          </Cartao>
        </div>
      </div>
      {/* linha para o terceiro pedido pedido*/}
      <div className="row">
        {/* controle de colunas para responsividade*/}
        <div className="col-sm-8 col-md-6 m-2">
          <Cartao cabecalho="21/01/2021">
            <Pedido icone="fas fa-laptop fa-2x" titulo="Notebook" descricao="Notebook Dell - 8Gb - i5" />
            {componenteFeedback}
          </Cartao>
        </div>
      </div>
```

Repare que o mesmo elemento `componenteFeedback`, com seus textos e funções, é definido uma única vez e reutilizado nos três cartões.

## Exercícios
Duration: 30:00

**1.** Crie uma aplicação ReactJS que exibe uma lista de três comentários feitos por usuários de uma rede social. Ela pode ser parecida com o que exibe a Figura 1.1.

![Lista com três comentários em cartões, cada um com foto do usuário, nome de usuário, texto e hora, e abaixo de cada cartão os botões Aprovar e Não aprovar](img/exercicio-comentarios.webp)

*Figura 1.1: a lista de comentários esperada.*

As características desejadas são as seguintes.

**1.1** Cada comentário tem uma foto do usuário, seu nome, data e hora de realização e texto.

**1.2** Cada comentário deve ser exibido como um "cartão".

**1.3** Cada comentário pode ser aprovado ou reprovado.

**1.4** A aplicação deve possuir os seguintes componentes ReactJS.

- **ListaComentarios** — exibe conteúdo genérico, especificado por meio de sua propriedade `children`. Seu conteúdo deverá ser uma coleção de três comentários.
- **Cartao** — exibe conteúdo genérico, especificado por meio de sua propriedade `children`. O conteúdo de um cartão deve ser um comentário e botões para feedback.
- **Comentario** — representa um comentário. Suas características lhe são entregues via props.
- **Feedback** — um componente que exibe dois botões para o usuário dar o seu feedback.

<details><summary>Ver resposta</summary>

<aside class="negative">

A solução usa o pacote `faker`, que foi descontinuado em 2022. Hoje, o equivalente mantido pela comunidade é o `@faker-js/faker`, com uma API um pouco diferente. O código abaixo está como na lista original.

</aside>

#### 1. Criando a aplicação e instalando dependências

Crie a aplicação com

**Terminal**

```bash
npx create-react-app lista-de-comentarios
```

A seguir, navegue até o diretório que abriga seu conteúdo com

**Terminal**

```bash
cd lista-de-comentarios
```

Apague todo o conteúdo da pasta `src` (somente dela) e crie um arquivo chamado `index.js`. Seu conteúdo inicial aparece no Bloco de Código 1.1.

**src/index.js · Bloco de Código 1.1**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'


const App = () => {

  return (
    <div>
    </div>

  )
}


ReactDOM.render(
  <App />,
  document.querySelector('#root')
)
```

A aplicação terá as seguintes dependências

- Bootstrap
- faker (para gerar conteúdos como fotos, textos, nomes, datas aleatoriamente)

Instale-as com

**Terminal**

```bash
npm install bootstrap
```

e

**Terminal**

```bash
npm install faker
```

Importe ambas no arquivo `index.js`, como mostra o Bloco de Código 1.2.

**src/index.js · Bloco de Código 1.2**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import faker from 'faker'
const App = () => {
...
```

#### 2. O componente Comentario

O componente `Comentario` se encarrega de exibir os dados (nome, texto, data e foto) que caracterizam um comentário. Veja a sua definição no Bloco de Código 2.1. Para criá-lo, crie um arquivo chamado `Comentario.js` na pasta `src`.

**src/Comentario.js · Bloco de Código 2.1**

```jsx
import React from 'react'

export default function Comentario({nome, texto, data, foto}) {
  return (
    // flex para filhos serem dispostos na horizontal, flex-direction é row por padrão
    <div className="d-flex">
      <img src={foto} />
      {/* margem à esquerda, zero padding e ajuste de position para que os filhos se posicionem de maneira "absoluta" */}
      <div className="ms-2 p-0 position-relative">
        <h2 className="border-bottom">{nome}</h2>
        <p>{texto}</p>
        {/* zero unidades de medida a partir de baixo e do começo (esquerda) */}
        <p style={{fontSize: '0.8rem'}} className=" text-muted position-absolute bottom-0 start-0 m-0">{data}</p>
      </div>
    </div>
  )
}
```

#### 3. O componente Cartao

O componente cartão é bastante simples. Ele apenas define detalhes como borda e sombra. O conteúdo que exibe é aquele recebido por meio da propriedade `children`. Veja o Bloco de Código 3.1. A sua definição deve ser feita em um arquivo chamado `Cartao.js` que deve ser criado na pasta `src`.

**src/Cartao.js · Bloco de Código 3.1**

```jsx
import React from 'react'

export default function Cartao(props) {
  return (
    <div className={estilos.principal}>
      {props.children}
    </div>
  )
}
const estilos = {
  principal: 'card border rounded m-2 p-2 shadow'
}
```

#### 4. O componente ListaComentarios

O componente `ListaComentarios` é semelhante ao componente `Cartao`. Ele exibirá o conteúdo que receber na propriedade `children`. Seu conteúdo será uma coleção de cartões. Veja o Bloco de Código 4.1.

**src/ListaComentarios.js · Bloco de Código 4.1**

```jsx
import React from 'react'

export default function ListaComentarios({children}) {
  return (
    <div className={estilos.principal}>
      {children}
    </div>
  )
}
const estilos = {
  principal: 'container border border-warning rounded my-3 p-3'
}
```

#### 5. O componente Feedback

O componente `Feedback` será construído de maneira bastante genérica. Ele possui dois botões cujos textos exibidos e funções associadas podem ser especificadas via props. Veja o Bloco de Código 5.1.

**src/Feedback.js · Bloco de Código 5.1**

```jsx
import React from 'react'

export default function Feedback({funcaoOK, funcaoNOK, textoOK, textoNOK}) {
  return (
    <div className="d-flex">
      <button className="mx-2 btn btn-outline-primary" onClick={funcaoOK}>{textoOK}</button>
      <button className="btn btn-outline-danger" onClick={funcaoNOK}>{textoNOK}</button>
    </div>
  )
}
```

#### 6. O componente principal

O componente principal, definido no arquivo `index.js`, tem como componente raiz um `ListaComentarios`. Ele especifica a coleção de cartões a serem exibidos, cada qual responsável por exibir um componente `Comentario` e um componente `Feedback`.

- Comece importando os componentes como no Bloco de Código 6.1.

**src/index.js · Bloco de Código 6.1**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import Comentario from './Comentario'
import Cartao from './Cartao'
import Feedback from './Feedback'
import ListaComentarios from './ListaComentarios'
import 'bootstrap/dist/css/bootstrap.min.css'
import faker from 'faker'
const App = () => {
...
```

- O componente `ListaComentarios` tem a ele aplicada uma classe do tipo `container` do Bootstrap, o que visa tratar aspectos de responsividade. Assim, seu conteúdo utilizará as conhecidas classes `row` e `col-*` deste framework. Veja o Bloco de Código 6.2. Nele, começamos a definição do corpo do componente principal. Teremos três linhas, cada qual com o objetivo de exibir um dos comentários.

**src/index.js · Bloco de Código 6.2**

```jsx
...
const App = () => {
  return (
    <ListaComentarios>
      <div className="row">
        <div className="col-12">

        </div>
      </div>
      <div className="row">
        <div className="col-12">

        </div>
      </div>
      <div className="row">
        <div className="col-12">

        </div>
      </div>
    </ListaComentarios>

  )
}
...
```

- O componente `Feedback` é idêntico para todos os comentários. Por isso, definiremos seus textos e funções uma única vez. O próprio componente será definido uma única vez e reutilizado. Veja o Bloco de Código 6.3.

**src/index.js · Bloco de Código 6.3**

```jsx
...
const App = () => {
  const funcaoOK = () => alert('Comentário aprovado!')
  const funcaoNOK = () => alert('Comentário não aprovado!')
  const textoOK = 'Aprovar'
  const textoNOK = 'Não aprovar'
  const feedbackComponent = <Feedback funcaoOK={funcaoOK} funcaoNOK={funcaoNOK} textoOK={textoOK} textoNOK={textoNOK} />
  return (
    <ListaComentarios>
...
```

- A seguir, definimos um componente `Cartao` que será filho da primeira linha. Ele abriga um `Comentario` e um `Feedback`. Repare no uso das funções `faker` ao especificar as propriedades do `Comentario`. Veja o Bloco de Código 6.4.

**src/index.js · Bloco de Código 6.4**

```jsx
...
const App = () => {
  return (
    <ListaComentarios>
      <div className="row">
        <div className="col-12">
          <Cartao>
            <Comentario foto={faker.image.avatar()} nome={faker.internet.userName()} data={new Date(faker.time.recent()).toLocaleTimeString()} texto={faker.lorem.sentences()} />
            <div className="d-flex justify-content-center">
              {feedbackComponent}
            </div>
          </Cartao>
        </div>
      </div>
      <div className="row">
...
```

- O conteúdo das duas linhas restantes é exatamente o mesmo: um `Comentario` e um `Feedback`, ambos filhos do mesmo `Cartao`. Veja o Bloco de Código 6.5.

**src/index.js · Bloco de Código 6.5**

```jsx
...
    <ListaComentarios>
      <div className="row">
        <div className="col-12">
          <Cartao>
            <Comentario foto={faker.image.avatar()} nome={faker.internet.userName()} data={new Date(faker.time.recent()).toLocaleTimeString()} texto={faker.lorem.sentences()} />
            <div className="d-flex justify-content-center">
              {feedbackComponent}
            </div>
          </Cartao>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <Cartao>
            <Comentario foto={faker.image.avatar()} nome={faker.internet.userName()} data={new Date(faker.time.recent()).toLocaleTimeString()} texto={faker.lorem.sentences()} />
            <div className="d-flex justify-content-center">
              {feedbackComponent}
            </div>
          </Cartao>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <Cartao>
            <Comentario foto={faker.image.avatar()} nome={faker.internet.userName()} data={new Date(faker.time.recent()).toLocaleTimeString()} texto={faker.lorem.sentences()} />
            <div className="d-flex justify-content-center">
              {feedbackComponent}
            </div>
          </Cartao>
        </div>
      </div>
    </ListaComentarios>
```

</details>

## Referências
Duration: 3:00

Parabéns! Você usou props para configurar componentes, criou componentes genéricos com `children` e passou funções entre componentes. A seguir, estude componentes com estado (codelab `react-componentes-funcionais-usestate`).

* React – A JavaScript library for building user interfaces. 2021. Disponível em [https://reactjs.org/](https://reactjs.org/). Acesso em agosto de 2021.
