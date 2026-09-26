summary: Entenda o que é estado, compare componentes de classe e funcionais e use o hook useState em um contador e na aplicação Estação Climática, com React, Vite, Bootstrap e a Geolocation API.
id: react-componentes-funcionais-usestate
categories: React,JavaScript
tags: react,usestate,hooks,estado,componentes funcionais,vite,bootstrap,geolocation
status: Published
authors: Rodrigo Bossini
last updated: 2026-03-21
pdf: react/novo/05_apostila_react_componentes_funcionais_useState.pdf
exercicios: react/novo/exercicio_personagem_rpg_enunciado.pdf,react/novo/exercicio_personagem_rpg_resolucao.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React: componentes funcionais e o hook useState

## Visão geral
Duration: 3:00

Neste codelab você estuda os principais aspectos da definição de componentes React utilizando funções e o hook `useState`: primeiro com um contador simples e depois com a aplicação **Estação Climática**, que descobre a estação do ano a partir da localização do usuário e da data atual.

### O que você vai aprender

* O que é o estado de uma aplicação e por que ele provoca novas renderizações
* As diferenças entre componentes definidos com classes e componentes funcionais
* Como criar um projeto React com o Vite
* A sintaxe do `useState` e como atualizar o estado corretamente
* Como usar várias variáveis de estado em um mesmo componente
* Como obter a localização do usuário com a Geolocation API
* Como montar a interface com classes do Bootstrap e ícones do Font Awesome
* Renderização condicional e tratamento de erros

### O que você vai precisar

* Node.js e npm instalados
* Um editor de código (por exemplo, o VS Code)
* Um navegador (os exemplos usam o Chrome e o Chrome Dev Tools)

## O que é estado?
Duration: 5:00

Em aplicações interativas, a interface gráfica precisa **mudar** ao longo do tempo em resposta a ações do usuário. Quando um botão é clicado, quando um formulário é preenchido ou quando dados são carregados de um servidor, algo na tela se atualiza. As informações que determinam **o que a tela exibe em um dado momento** constituem o **estado** da aplicação.

Formalmente, o estado é um conjunto de dados que um componente armazena e que pode mudar durante a vida da aplicação. Sempre que o estado muda, o componente é **renderizado novamente**, refletindo as novas informações na tela. Sem estado, teríamos apenas páginas estáticas, incapazes de reagir a interações.

Vejamos dois exemplos de aplicações que dependem de estado.

### Exemplo — Alternância de tema (claro / escuro)

Muitas aplicações oferecem a opção de alternar entre um tema claro e um tema escuro. A tela inteira muda de aparência quando o usuário clica em um botão. Nesse caso, o estado armazena **qual tema está ativo no momento**. Veja a figura a seguir.

![À esquerda, a tela "Minha Aplicação" em tema claro com o botão "Tema escuro" e a anotação tema = "claro"; após um clique, à direita, a mesma tela em tema escuro com o botão "Tema claro" e tema = "escuro"](img/estado-tema.webp)

*Um clique muda o estado `tema` e a tela é renderizada com o novo tema.*

Neste exemplo, o estado é composto por uma única informação: a variável `tema`, cujo valor pode ser `"claro"` ou `"escuro"`. Quando o usuário clica no botão, o estado muda e o componente é renderizado novamente com as cores correspondentes ao novo tema.

### Exemplo — Carrinho de compras

Em uma loja virtual, o carrinho de compras exibe a quantidade de itens adicionados pelo usuário. Cada vez que o usuário clica em "Adicionar ao carrinho", o número aumenta. Veja a figura a seguir.

![Dois produtos, Camiseta (R$ 49,90) e Tênis (R$ 199,90), com botões Adicionar; ao lado, o carrinho com itens = 0 e, após 2 cliques, com itens = 2](img/estado-carrinho.webp)

*A cada clique em Adicionar, o estado `itens` aumenta e o carrinho é renderizado de novo.*

Aqui, o estado contém o valor `itens`, que começa em `0`. A cada clique em Adicionar, o estado é atualizado (por exemplo, de `0` para `1`, de `1` para `2`) e o componente do carrinho é renderizado novamente, exibindo o novo total.

Esses dois exemplos ilustram um padrão fundamental: **o estado armazena dados que mudam ao longo do tempo, e cada mudança no estado provoca uma nova renderização do componente**. A seguir, veremos como o React implementa esse conceito.

## Funções vs. classes e o projeto com Vite
Duration: 6:00

Componentes React podem ser definidos de duas formas: utilizando **funções** (comuns ou *arrow functions*) ou utilizando **classes**. Independentemente da forma como um componente é definido, o seu funcionamento é sempre o mesmo: ele deve produzir HTML (normalmente utilizando JSX) que descreve o seu aspecto visual e lidar com eventos gerados pelas interações do usuário.

Versões do React anteriores à versão 16.8 tinham as características descritas na tabela a seguir.

| Funcionalidade | Componentes definidos utilizando classes | Componentes funcionais |
| --- | --- | --- |
| Produção de JSX | Sim, o método `render` se encarrega desta tarefa. | Sim, a própria função que define o componente se encarrega desta tarefa. |
| Execução de código em momentos específicos (ex.: inserção na árvore DOM). | Sim, usando os métodos do ciclo de vida. | Não |
| Uso do mecanismo de estado | Sim, um objeto JSON representa o estado de cada componente. | Não |

A partir da versão 16.8 do React, graças ao mecanismo conhecido como **Hooks**, componentes funcionais também passaram a poder executar código em momentos específicos e a possuir estado. Veja a tabela a seguir.

| Funcionalidade | Componentes definidos utilizando classes | Componentes funcionais |
| --- | --- | --- |
| Produção de JSX | Sim, o método `render` se encarrega desta tarefa. | Sim, a própria função que define o componente se encarrega desta tarefa. |
| Execução de código em momentos específicos (ex.: inserção na árvore DOM). | Sim, usando os métodos do ciclo de vida. | Sim, utilizando Hooks. |
| Uso do mecanismo de estado | Sim, um objeto JSON representa o estado de cada componente. | Sim, utilizando Hooks como o hook `useState`. |

Atualmente, a documentação oficial do React recomenda o uso de **componentes funcionais com Hooks** como a forma padrão de se definir componentes. Componentes baseados em classes continuam funcionando, mas novas funcionalidades do React são desenvolvidas com foco em Hooks.

<aside class="positive">

**Link — Documentação oficial do React sobre Hooks:** [https://react.dev/reference/react/hooks](https://react.dev/reference/react/hooks)

</aside>

Neste material, estudaremos os principais aspectos sobre a definição de componentes React utilizando funções e o hook `useState`.

### Criando um projeto React com Vite

O **Vite** é a ferramenta recomendada atualmente para a criação de projetos React. Ele substitui o antigo `create-react-app`, oferecendo um ambiente de desenvolvimento mais rápido e moderno.

Utilizando um terminal, execute o comando a seguir para criar um novo projeto React.

**Terminal**

```bash
npm create vite@latest meu-projeto -- --template react
```

Navegue até o diretório recém-criado e instale as dependências.

**Terminal**

```bash
cd meu-projeto
npm install
```

Para colocar a aplicação em funcionamento, execute:

**Terminal**

```bash
npm run dev
```

Uma URL será exibida no terminal (normalmente `http://localhost:5173`). Abra-a no navegador para visualizar a aplicação.

Dentro da pasta `src`, os principais arquivos são:

* `main.jsx` — ponto de entrada da aplicação.
* `App.jsx` — componente principal.
* `App.css` / `index.css` — estilos.

## Introdução ao useState: um contador simples
Duration: 10:00

Antes de partirmos para a aplicação principal, vamos entender o hook `useState` com um exemplo simples: um **contador**. A figura a seguir mostra a aparência final da aplicação que construiremos nesta seção.

![Página com o título "Contador: 7" e os botões Incrementar, Decrementar e Zerar](img/contador.webp)

*O contador finalizado.*

O usuário poderá incrementar, decrementar e zerar o valor do contador clicando nos botões. A cada clique, o valor exibido será atualizado automaticamente pelo React.

### Preparando o projeto

Crie um novo projeto com Vite:

**Terminal**

```bash
npm create vite@latest contador -- --template react
cd contador
npm install
npm run dev
```

Apague todos os arquivos existentes dentro da pasta `src`. Crie um novo arquivo chamado `main.jsx`. Veja o código a seguir.

**src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div>
      <h1>Meu Contador</h1>
    </div>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('root')
)
root.render(<App />)
```

Visite a URL indicada no terminal e certifique-se de que a mensagem **Meu Contador** é exibida.

### Adicionando estado com useState

O hook `useState` permite que um componente funcional possua **estado**. Quando o estado é atualizado, o componente é renderizado novamente — automaticamente e muito rapidamente.

A sintaxe do `useState` é:

**Sintaxe**

```javascript
const [valor, setValor] = useState(valorInicial)
```

Onde:

* `valor` — a variável que armazena o estado atual.
* `setValor` — a função que deve ser utilizada para atualizar o estado.
* `valorInicial` — o valor que `valor` terá na primeira renderização.

<aside class="negative">

**Nota.** Nunca altere o estado diretamente (ex.: `valor = 10`). Sempre use a função de atualização (`setValor(10)`). Somente assim o React saberá que precisa re-renderizar o componente.

</aside>

Vamos adicionar um estado ao nosso contador. Atualize o arquivo `main.jsx`. O que mudou: o `import` de `useState`, a declaração do estado e o `<h1>`. Veja o código a seguir.

**src/main.jsx**

```jsx
import { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [contador, setContador] = useState(0)

  return (
    <div>
      <h1>Contador: {contador}</h1>
    </div>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('root')
)
root.render(<App />)
```

Observe que:

* Importamos `useState` do React.
* Criamos o estado `contador` com valor inicial `0`.
* Exibimos o valor do estado na expressão JSX usando `{contador}`.

Ao acessar a página, você verá **Contador: 0**. Porém, ainda não há como alterar o valor. Vamos adicionar botões.

### Adicionando botões para alterar o estado

Atualize o JSX retornado pelo componente. Veja o código a seguir.

**src/main.jsx**

```jsx
import { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [contador, setContador] = useState(0)

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Contador: {contador}</h1>
      <button onClick={() => setContador(contador + 1)}>
        Incrementar
      </button>
      {' '}
      <button onClick={() => setContador(contador - 1)}>
        Decrementar
      </button>
    </div>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('root')
)
root.render(<App />)
```

Agora, ao clicar em **Incrementar**, a função `setContador` é chamada com o novo valor (`contador + 1`). O React detecta que o estado mudou, executa a função `App` novamente e o novo valor é exibido na tela. O mesmo ocorre com o botão **Decrementar**.

### Adicionando um botão de reset

Vamos adicionar mais um botão para zerar o contador. Veja o código a seguir.

**src/main.jsx**

```jsx
import { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [contador, setContador] = useState(0)

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Contador: {contador}</h1>
      <button onClick={() => setContador(contador + 1)}>
        Incrementar
      </button>
      {' '}
      <button onClick={() => setContador(contador - 1)}>
        Decrementar
      </button>
      {' '}
      <button onClick={() => setContador(0)}>
        Zerar
      </button>
    </div>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('root')
)
root.render(<App />)
```

Com isso, temos um contador funcional completo. O ponto central é: **toda vez que chamamos `setContador`, o React re-renderiza o componente com o novo valor do estado.**

<aside class="positive">

**Nota.** É possível utilizar múltiplas chamadas a `useState` dentro de um mesmo componente. Cada chamada cria uma variável de estado independente. Veremos isso na próxima seção.

</aside>

## Aplicação Estação Climática: criando o projeto
Duration: 8:00

A aplicação que desenvolveremos determina a estação climática atual em função da localização do usuário e da data em que ela é acessada. A figura a seguir mostra a aparência final da aplicação.

![Cartão com o ícone de guarda-sol e a palavra "Verão", as coordenadas -22.9068, -43.1729, a hora 14:32:07 e o botão "Qual a minha estação?"](img/estacao-climatica.webp)

*A aplicação Estação Climática finalizada.*

O ícone e o nome da estação são exibidos de forma destacada. Logo abaixo, aparecem as coordenadas geográficas e a data atual. O botão permite ao usuário atualizar as informações. A tabela a seguir mostra os critérios que utilizaremos para determinar a estação climática.

| Hemisfério/Data | 21 de junho a 23 de setembro | 24 de setembro a 21 de dezembro | 22 de dezembro a 20 de março | 21 de março a 20 de junho |
| --- | --- | --- | --- | --- |
| Norte | Verão | Outono | Inverno | Primavera |
| Sul | Inverno | Primavera | Verão | Outono |

<aside class="positive">

**Nota.** Estamos considerando que localizações com valor de latitude menor do que zero estão no hemisfério Sul. As demais estão no hemisfério Norte.

</aside>

### Criando a aplicação e ajustando as dependências

Utilizando um terminal, crie a aplicação com Vite:

**Terminal**

```bash
npm create vite@latest estacao-climatica -- --template react
cd estacao-climatica
npm install
```

Uma das dependências da aplicação é o **Bootstrap**. Instale-o:

**Terminal**

```bash
npm install bootstrap
```

Também utilizaremos os ícones **Font Awesome**. Para isso, adicione um CDN ao arquivo `index.html` (na raiz do projeto). Veja o código a seguir.

**index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    <title>Estação Climática</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

Agora, apague todos os arquivos existentes na pasta `src`. Crie dois novos arquivos: `main.jsx` e `App.jsx`.

### Criando o ponto de entrada e o componente básico

O arquivo `src/main.jsx` é o ponto de entrada da aplicação. Veja o código a seguir.

**src/main.jsx**

```jsx
import 'bootstrap/dist/css/bootstrap.min.css'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root')
)
root.render(<App />)
```

O arquivo `src/App.jsx` conterá o componente principal. Comece com a versão mais simples. Veja o código a seguir.

**src/App.jsx**

```jsx
function App() {
  return (
    <div>
      Meu app
    </div>
  )
}

export default App
```

Execute `npm run dev` e visite a URL indicada. Certifique-se de que a mensagem **Meu app** é exibida.

## Detectando a localização do usuário
Duration: 6:00

Os principais navegadores implementam a **API Geolocation**, que permite obter a localização do usuário.

<aside class="positive">

**Link — Documentação da Geolocation API (MDN):** [https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

</aside>

Vamos fazer um primeiro teste. Atualize o `App.jsx` para utilizar a API e exibir a localização no console. Veja o código a seguir.

**src/App.jsx**

```jsx
function App() {
  window.navigator.geolocation.getCurrentPosition(
    (position) => console.log(position)
  )

  return (
    <div>
      Meu app
    </div>
  )
}

export default App
```

O navegador deverá exibir um alerta perguntando se você autoriza o acesso à sua localização. Clique em **Allow** (Permitir).

Abra o Chrome Dev Tools (`CTRL + SHIFT + I`) e clique na aba **Console** para visualizar o resultado. Você verá um objeto `GeolocationPosition` contendo, entre outras coisas, os valores de `latitude` e `longitude`.

<aside class="positive">

**Nota.** Também é possível utilizar localizações simuladas pelo navegador. No Chrome Dev Tools, aperte `CTRL + SHIFT + P`, digite **sensors** e escolha **Show sensors**. Na opção de **Location**, escolha a localização desejada (por exemplo, São Paulo).

</aside>

### Incluindo dados da localização na expressão JSX

Neste ponto, desejamos incluir informações referentes à localização do usuário na expressão JSX devolvida pelo componente. Entretanto, a operação de geolocalização é realizada de maneira **assíncrona** e os resultados são entregues em uma função **callback**. Isso significa que, quando o componente renderiza pela primeira vez, **a localização ainda não está disponível**.

A solução para este problema é justamente o uso do hook `useState`: quando a localização ficar disponível, atualizamos o estado do componente, o que faz com que ele seja renderizado novamente, agora com os dados de localização.

## Estado, estação e ícones
Duration: 10:00

### Definindo o estado do componente com useState

Vamos adicionar **múltiplas variáveis de estado** ao componente. Cada uma armazenará uma informação de interesse: latitude, longitude, estação climática, data e ícone. Veja o código a seguir.

**src/App.jsx**

```jsx
import { useState } from 'react'

function App() {
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [estacao, setEstacao] = useState(null)
  const [data, setData] = useState(null)
  const [icone, setIcone] = useState(null)

  return (
    <div>
      Meu app
    </div>
  )
}

export default App
```

Observe que utilizamos `null` como valor inicial para todas as variáveis de estado. Isso indica que, no começo, nenhuma dessas informações está disponível.

### A função que determina a estação climática

A função a seguir obtém a estação climática atual de maneira simples, em função da data atual e da latitude. Adicione-a dentro do componente, antes do `return`. Veja o código a seguir.

**src/App.jsx**

```jsx
import { useState } from 'react'

function App() {
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [estacao, setEstacao] = useState(null)
  const [data, setData] = useState(null)
  const [icone, setIcone] = useState(null)

  const obterEstacao = (dataAtual, lat) => {
    const ano = dataAtual.getFullYear()
    const d1 = new Date(ano, 5, 21)  // 21/06
    const d2 = new Date(ano, 8, 24)  // 24/09
    const d3 = new Date(ano, 11, 22) // 22/12
    const d4 = new Date(ano, 2, 21)  // 21/03
    const sul = lat < 0

    if (dataAtual >= d1 && dataAtual < d2)
      return sul ? 'Inverno' : 'Verão'
    if (dataAtual >= d2 && dataAtual < d3)
      return sul ? 'Primavera' : 'Outono'
    if (dataAtual >= d3 || dataAtual < d4)
      return sul ? 'Verão' : 'Inverno'
    return sul ? 'Outono' : 'Primavera'
  }

  return (
    <div>
      Meu app
    </div>
  )
}

export default App
```

A lógica dessa função utiliza quatro datas de referência (`d1` a `d4`) que marcam o início de cada período. A variável `d4` (21 de março) é fundamental para separar corretamente o período de Verão/Inverno (22/12 a 20/03) do período de Outono/Primavera (21/03 a 20/06).

### Um objeto que mapeia estações climáticas a ícones

Dada uma estação climática, desejamos escolher um ícone relacionado a ela. Adicione o objeto de mapeamento logo após a função `obterEstacao`. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
const obterEstacao = (dataAtual, lat) => {
  // ... (como definido anteriormente)
}

const icones = {
  'Primavera': 'fa-seedling',
  'Verão': 'fa-umbrella-beach',
  'Outono': 'fa-tree',
  'Inverno': 'fa-snowman'
}

return (
```

### Obtendo localização, data e ícone a ser exibido

Quando o usuário interagir com a aplicação, desejamos:

* Consultar a localização atual e registrar uma função callback.
* Extrair a data atual do sistema.
* Definir a estação climática atual.
* Escolher o ícone apropriado.

A função a seguir realiza todas essas tarefas. Adicione-a logo após o objeto `icones`.

**src/App.jsx · trecho**

```jsx
const icones = {
  // ... (como definido anteriormente)
}

const obterLocalizacao = () => {
  window.navigator.geolocation.getCurrentPosition(
    (posicao) => {
      const dataAtual = new Date()
      const est = obterEstacao(
        dataAtual, posicao.coords.latitude
      )
      const ic = icones[est]

      setLatitude(posicao.coords.latitude)
      setLongitude(posicao.coords.longitude)
      setEstacao(est)
      setData(dataAtual.toLocaleTimeString())
      setIcone(ic)
    }
  )
}

return (
```

Observe que, em vez de `this.setState({...})` como fazíamos com componentes baseados em classes, chamamos cada função de atualização individualmente: `setLatitude`, `setLongitude`, etc. Cada chamada atualiza uma variável de estado específica.

## A expressão JSX produzida pelo componente
Duration: 10:00

Agora vamos construir a interface visual do componente, passo a passo. Começamos com a estrutura de responsividade usando classes do Bootstrap. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
return (
  // responsividade, margem acima
  <div className="container mt-2">
    {/* linha, conteudo centralizado */}
    <div className="row justify-content-center">
      {/* 8 colunas em telas medias em diante */}
      <div className="col-md-8">

      </div>
    </div>
  </div>
)
```

Os resultados serão exibidos em um cartão (*card*) do Bootstrap. Adicione-o dentro da coluna. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
<div className="col-md-8">
  {/* um cartao Bootstrap */}
  <div className="card">
    {/* o corpo do cartao */}
    <div className="card-body">

    </div>
  </div>
</div>
```

O primeiro elemento dentro do corpo do cartão contém o ícone e o nome da estação. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
<div className="card-body">
  {/* centraliza verticalmente, margem abaixo */}
  <div className="d-flex align-items-center border rounded mb-2"
    style={{ height: '6rem' }}>
    {/* icone obtido do estado */}
    <i className={`fas fa-5x ${icone}`}></i>
    {/* largura 75%, margem a esquerda */}
    <p className="w-75 ms-3 text-center fs-1">
      {estacao}
    </p>
  </div>
</div>
```

Logo a seguir, adicionamos um texto que usa **renderização condicional**: se a latitude já foi obtida, exibe as coordenadas e a data; caso contrário, exibe instruções para o usuário. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
<div className="card-body">
  <div className="d-flex align-items-center border rounded mb-2"
    style={{ height: '6rem' }}>
    <i className={`fas fa-5x ${icone}`}></i>
    <p className="w-75 ms-3 text-center fs-1">
      {estacao}
    </p>
  </div>
  <div>
    <p className="text-center">
      {
        latitude
          ? `Coordenadas: ${latitude}, ${longitude}. Data: ${data}`
          : 'Clique no botão para saber a sua estação climática'
      }
    </p>
  </div>
</div>
```

Finalmente, adicionamos um botão que, ao ser clicado, chama a função `obterLocalizacao`. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
<div className="card-body">
  {/* ... conteudo anterior ... */}
  <button onClick={obterLocalizacao}
    className="btn btn-outline-primary w-100 mt-2">
    Qual a minha estação?
  </button>
</div>
```

Observe a sequência de eventos que ocorre quando o usuário utiliza a aplicação:

1. O navegador obtém o arquivo JavaScript.
2. A função `App` é executada e a expressão JSX inicial é produzida (sem dados de localização).
3. O HTML resultante é inserido na DOM. A aplicação exibe as instruções iniciais.
4. O usuário clica no botão. A função `obterLocalizacao` solicita a localização ao navegador e registra uma callback.
5. A localização fica disponível e a callback é executada. Ela atualiza o estado do componente usando as funções `set...`
6. O React detecta as mudanças de estado e executa a função `App` novamente, produzindo uma nova expressão JSX com os dados da localização.
7. A tela é atualizada.

## Tratando erros
Duration: 6:00

O que ocorre caso o navegador não possa entregar a localização do usuário? Talvez o usuário tenha negado o acesso. Idealmente, a aplicação exibe um feedback textual explicando que um erro aconteceu.

Primeiro, adicione uma nova variável de estado para a mensagem de erro. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
const [icone, setIcone] = useState(null)
const [mensagemDeErro, setMensagemDeErro] = useState(null)
```

A seguir, atualize a função `obterLocalizacao` para especificar uma segunda callback, que será executada em caso de erro. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
const obterLocalizacao = () => {
  window.navigator.geolocation.getCurrentPosition(
    (posicao) => {
      const dataAtual = new Date()
      const est = obterEstacao(
        dataAtual, posicao.coords.latitude
      )
      const ic = icones[est]

      setLatitude(posicao.coords.latitude)
      setLongitude(posicao.coords.longitude)
      setEstacao(est)
      setData(dataAtual.toLocaleTimeString())
      setIcone(ic)
    },
    (erro) => {
      console.log(erro)
      setMensagemDeErro('Tente novamente mais tarde')
    }
  )
}
```

Como a função de erro atualiza o estado, o componente será renderizado novamente. Precisamos utilizar essa mensagem na expressão JSX. Usaremos uma **expressão condicional aninhada**. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
<p className="text-center">
  {
    latitude
      ? `Coordenadas: ${latitude}, ${longitude}. Data: ${data}`
      : mensagemDeErro
        ? mensagemDeErro
        : 'Clique no botão para saber a sua estação climática'
  }
</p>
```

Agora a lógica é:

1. Se `latitude` tem valor, exibe as coordenadas e a data.
2. Senão, se `mensagemDeErro` tem valor, exibe a mensagem de erro.
3. Senão, exibe a instrução padrão para o usuário.

Para testar, remova a permissão de acesso à localização no navegador: clique no ícone ao lado da barra de navegação e altere a opção **Location** para **Block**. Atualize a página e clique no botão.

## Código completo
Duration: 5:00

Veja a seguir o código completo do arquivo `src/App.jsx`.

**src/App.jsx**

```jsx
import { useState } from 'react'

function App() {
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [estacao, setEstacao] = useState(null)
  const [data, setData] = useState(null)
  const [icone, setIcone] = useState(null)
  const [mensagemDeErro, setMensagemDeErro] =
    useState(null)

  const obterEstacao = (dataAtual, lat) => {
    const ano = dataAtual.getFullYear()
    const d1 = new Date(ano, 5, 21)  // 21/06
    const d2 = new Date(ano, 8, 24)  // 24/09
    const d3 = new Date(ano, 11, 22) // 22/12
    const d4 = new Date(ano, 2, 21)  // 21/03
    const sul = lat < 0

    if (dataAtual >= d1 && dataAtual < d2)
      return sul ? 'Inverno' : 'Verão'
    if (dataAtual >= d2 && dataAtual < d3)
      return sul ? 'Primavera' : 'Outono'
    if (dataAtual >= d3 || dataAtual < d4)
      return sul ? 'Verão' : 'Inverno'
    return sul ? 'Outono' : 'Primavera'
  }

  const icones = {
    'Primavera': 'fa-seedling',
    'Verão': 'fa-umbrella-beach',
    'Outono': 'fa-tree',
    'Inverno': 'fa-snowman'
  }

  const obterLocalizacao = () => {
    window.navigator.geolocation.getCurrentPosition(
      (posicao) => {
        const dataAtual = new Date()
        const est = obterEstacao(
          dataAtual, posicao.coords.latitude
        )
        const ic = icones[est]

        setLatitude(posicao.coords.latitude)
        setLongitude(posicao.coords.longitude)
        setEstacao(est)
        setData(dataAtual.toLocaleTimeString())
        setIcone(ic)
      },
      (erro) => {
        console.log(erro)
        setMensagemDeErro(
          'Tente novamente mais tarde'
        )
      }
    )
  }

  return (
    <div className="container mt-2">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div
                className="d-flex align-items-center border rounded mb-2"
                style={{ height: '6rem' }}
              >
                <i className={
                  `fas fa-5x ${icone}`
                }></i>
                <p className="w-75 ms-3 text-center fs-1">
                  {estacao}
                </p>
              </div>
              <div>
                <p className="text-center">
                  {
                    latitude
                      ? `Coordenadas: ${latitude}, ${longitude}. Data: ${data}`
                      : mensagemDeErro
                        ? mensagemDeErro
                        : 'Clique no botão para saber a sua estação climática'
                  }
                </p>
              </div>
              <button
                onClick={obterLocalizacao}
                className="btn btn-outline-primary w-100 mt-2"
              >
                Qual a minha estação?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
```

E o arquivo `src/main.jsx`:

**src/main.jsx**

```jsx
import 'bootstrap/dist/css/bootstrap.min.css'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root')
)
root.render(<App />)
```

<aside class="positive">

Na apostila, as strings longas do código completo aparecem quebradas em várias linhas apenas para caber na página. Aqui elas estão em uma única linha, como nos trechos anteriores; uma string entre aspas simples não pode ser quebrada em várias linhas em JavaScript.

</aside>

## Exercício: criador de personagem RPG
Duration: 30:00

Neste exercício, você construirá uma aplicação React que permite ao usuário **criar um personagem de RPG** e visualizá-lo em tempo real. A aplicação utilizará **Vite**, **Bootstrap** e **Font Awesome**.

### Descrição da aplicação

A aplicação possui duas áreas principais:

* **Formulário de criação** — onde o usuário preenche os dados do personagem: nome, classe e nível.
* **Card de visualização** — onde o personagem é exibido de forma estilizada, atualizando automaticamente conforme o usuário altera os dados no formulário.

O formulário contém:

* Um campo de texto para digitar o nome do personagem.
* Um menu de seleção (`<select>`) para escolher a classe: Guerreiro, Mago, Arqueiro ou Curandeiro.
* Botões **+** e **−** para incrementar e decrementar o nível (de 1 a 20).

O card de visualização exibe:

* Um ícone do Font Awesome que muda de acordo com a classe escolhida. Você é livre para escolher os ícones que preferir no site do Font Awesome.
* O nome do personagem.
* A classe selecionada.
* O nível atual, representado visualmente com uma barra de progresso do Bootstrap.

### Aparência esperada da aplicação

A figura a seguir ilustra como a aplicação deve se parecer. O ícone exibido no card é apenas ilustrativo — escolha os ícones que desejar no Font Awesome.

![Aplicação "Criador de Personagem RPG" com o formulário (nome Aldric, classe Guerreiro, nível 5 com botões − e +) e, abaixo, o card vermelho com um escudo, o nome Aldric, a classe Guerreiro, "Nível 5" e uma barra de progresso em 25% (5 / 20)](img/rpg-aparencia.webp)

*O card atualiza em tempo real conforme o formulário é preenchido.*

### Requisitos técnicos

* Crie o projeto utilizando **Vite** com o template React.
* Instale e utilize o **Bootstrap** para estilização.
* Utilize o **Font Awesome** para os ícones.
* A aplicação deve ter, no mínimo, **dois componentes**: um para o formulário e outro para o card de visualização.
* O nível não pode ser menor que **1** nem maior que **20**.
* Se o nome estiver vazio, o card deve exibir um texto padrão (por exemplo, "Sem nome").

<aside class="positive">

**Dica.** Pense em quais informações mudam ao longo do tempo na aplicação. Essas informações são candidatas a se tornarem variáveis de estado com `useState`.

</aside>

<aside class="positive">

**Dica.** O componente do card não precisa ter estado próprio. Ele pode receber os dados necessários via **props** do componente pai.

</aside>

<details><summary>Ver resposta</summary>

#### Criando o projeto e instalando dependências

Comece criando o projeto com Vite e instalando as dependências necessárias.

**Terminal**

```bash
npm create vite@latest personagem-rpg -- --template react
cd personagem-rpg
npm install
npm install bootstrap
```

Adicione o Font Awesome ao arquivo `index.html` na raiz do projeto. Veja o código a seguir.

**index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    <title>Personagem RPG</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

Apague todos os arquivos da pasta `src`. Criaremos três arquivos: `main.jsx`, `App.jsx` e `CardPersonagem.jsx`.

#### Criando o ponto de entrada

Crie o arquivo `src/main.jsx`. Veja o código a seguir.

**src/main.jsx**

```jsx
import 'bootstrap/dist/css/bootstrap.min.css'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root')
)
root.render(<App />)
```

#### Criando o componente App com as variáveis de estado

O componente `App` manterá o estado da aplicação e renderizará o formulário. Crie o arquivo `src/App.jsx`. Veja o código a seguir.

**src/App.jsx**

```jsx
import { useState } from 'react'

function App() {
  const [nome, setNome] = useState('')
  const [classe, setClasse] = useState('Guerreiro')
  const [nivel, setNivel] = useState(1)

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        Criador de Personagem RPG
      </h2>
    </div>
  )
}

export default App
```

Temos três variáveis de estado: `nome` (texto digitado pelo usuário), `classe` (opção selecionada) e `nivel` (valor numérico de 1 a 20).

#### Construindo o formulário — campo de nome

Dentro do `return`, adicionamos o campo de texto para o nome. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
return (
  <div className="container mt-4">
    <h2 className="text-center mb-4">
      Criador de Personagem RPG
    </h2>

    <div className="mb-3">
      <label className="form-label">
        Nome do Personagem
      </label>
      <input
        type="text"
        className="form-control"
        value={nome}
        onChange={(e) =>
          setNome(e.target.value)
        }
      />
    </div>
  </div>
)
```

Observe que o `value` do `input` está vinculado à variável de estado `nome`, e o evento `onChange` atualiza o estado a cada caractere digitado.

#### Construindo o formulário — seleção de classe

Logo após o campo de nome, adicione o menu de seleção de classe. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
<div className="mb-3">
  <label className="form-label">
    Nome do Personagem
  </label>
  <input ... />
</div>

<div className="mb-3">
  <label className="form-label">
    Classe
  </label>
  <select
    className="form-select"
    value={classe}
    onChange={(e) =>
      setClasse(e.target.value)
    }
  >
    <option>Guerreiro</option>
    <option>Mago</option>
    <option>Arqueiro</option>
    <option>Curandeiro</option>
  </select>
</div>
```

#### Construindo o formulário — controle de nível

Adicionamos os botões de incrementar e decrementar o nível. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
<div className="mb-3">
  <label className="form-label">
    Nível
  </label>
  <div className="d-flex align-items-center gap-2">
    <button
      className="btn btn-outline-primary"
      onClick={() =>
        setNivel(Math.max(1, nivel - 1))
      }
    >
      -
    </button>
    <span className="fs-5 fw-bold px-3">{nivel}</span>
    <button
      className="btn btn-outline-primary"
      onClick={() =>
        setNivel(Math.min(20, nivel + 1))
      }
    >
      +
    </button>
  </div>
</div>
```

Observe o uso de `Math.max(1, ...)` e `Math.min(20, ...)` para garantir que o nível fique sempre entre 1 e 20.

#### Criando o componente CardPersonagem

Agora criamos o componente que exibe o personagem. Ele recebe os dados via **props**. Crie o arquivo `src/CardPersonagem.jsx`. Veja o código a seguir.

**src/CardPersonagem.jsx**

```jsx
function CardPersonagem({ nome, classe, nivel }) {
  const classesConfig = {
    Guerreiro: {
      icone: 'fa-shield-alt',
      cor: '#B43232'
    },
    Mago: {
      icone: 'fa-hat-wizard',
      cor: '#5032B4'
    },
    Arqueiro: {
      icone: 'fa-bullseye',
      cor: '#329632'
    },
    Curandeiro: {
      icone: 'fa-hand-holding-heart',
      cor: '#C8A020'
    }
  }

  const config = classesConfig[classe]
  const porcentagem = (nivel / 20) * 100

  return (
    <div className="card"
      style={{ borderColor: config.cor }}>
      <div className="card-body text-center">
        <i
          className={`fas ${config.icone} fa-4x mb-3`}
          style={{ color: config.cor }}
        ></i>
        <h3>{nome || 'Sem nome'}</h3>
        <p className="text-muted">{classe}</p>
        <p>Nível {nivel}</p>
        <div className="progress"
          style={{ height: '20px' }}>
          <div
            className="progress-bar"
            style={{
              width: `${porcentagem}%`,
              backgroundColor: config.cor
            }}
          >
            {Math.round(porcentagem)}%
          </div>
        </div>
        <small className="text-muted">
          {nivel} / 20
        </small>
      </div>
    </div>
  )
}

export default CardPersonagem
```

O objeto `classesConfig` mapeia cada classe ao seu ícone e cor. A variável `porcentagem` calcula quanto da barra de progresso será preenchida. A expressão `nome || 'Sem nome'` garante que, caso o nome esteja vazio, o texto padrão é exibido.

#### Integrando o CardPersonagem ao App

Volte ao arquivo `App.jsx` e importe o componente `CardPersonagem`, passando os dados via props. Veja o código a seguir.

**src/App.jsx**

```jsx
import { useState } from 'react'
import CardPersonagem from './CardPersonagem'

function App() {
  const [nome, setNome] = useState('')
  const [classe, setClasse] = useState('Guerreiro')
  const [nivel, setNivel] = useState(1)

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        Criador de Personagem RPG
      </h2>

      {/* formulario completo ... */}

      <CardPersonagem
        nome={nome}
        classe={classe}
        nivel={nivel}
      />
    </div>
  )
}

export default App
```

O componente `CardPersonagem` **não tem estado próprio**. Ele recebe `nome`, `classe` e `nivel` como props e renderiza as informações. Sempre que o estado de `App` muda, o React re-renderiza `App` e, consequentemente, `CardPersonagem` recebe as props atualizadas.

#### Código completo — src/App.jsx

Veja a seguir o código completo do componente principal.

**src/App.jsx**

```jsx
import { useState } from 'react'
import CardPersonagem from './CardPersonagem'

function App() {
  const [nome, setNome] = useState('')
  const [classe, setClasse] = useState('Guerreiro')
  const [nivel, setNivel] = useState(1)

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        Criador de Personagem RPG
      </h2>

      <div className="mb-3">
        <label className="form-label">
          Nome do Personagem
        </label>
        <input
          type="text"
          className="form-control"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Classe
        </label>
        <select
          className="form-select"
          value={classe}
          onChange={(e) =>
            setClasse(e.target.value)
          }
        >
          <option>Guerreiro</option>
          <option>Mago</option>
          <option>Arqueiro</option>
          <option>Curandeiro</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">
          Nível
        </label>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() =>
              setNivel(
                Math.max(1, nivel - 1)
              )
            }
          >
            -
          </button>
          <span className="fs-5 fw-bold px-3">
            {nivel}
          </span>
          <button
            className="btn btn-outline-primary"
            onClick={() =>
              setNivel(
                Math.min(20, nivel + 1)
              )
            }
          >
            +
          </button>
        </div>
      </div>

      <CardPersonagem
        nome={nome}
        classe={classe}
        nivel={nivel}
      />
    </div>
  )
}

export default App
```

#### Código completo — src/CardPersonagem.jsx

Veja a seguir o código completo do componente de visualização.

**src/CardPersonagem.jsx**

```jsx
function CardPersonagem({ nome, classe, nivel }) {
  const classesConfig = {
    Guerreiro: {
      icone: 'fa-shield-alt',
      cor: '#B43232'
    },
    Mago: {
      icone: 'fa-hat-wizard',
      cor: '#5032B4'
    },
    Arqueiro: {
      icone: 'fa-bullseye',
      cor: '#329632'
    },
    Curandeiro: {
      icone: 'fa-hand-holding-heart',
      cor: '#C8A020'
    }
  }

  const config = classesConfig[classe]
  const porcentagem = (nivel / 20) * 100

  return (
    <div className="card"
      style={{ borderColor: config.cor }}>
      <div className="card-body text-center">
        <i
          className={`fas ${config.icone} fa-4x mb-3`}
          style={{ color: config.cor }}
        ></i>
        <h3>{nome || 'Sem nome'}</h3>
        <p className="text-muted">{classe}</p>
        <p>Nível {nivel}</p>
        <div className="progress"
          style={{ height: '20px' }}>
          <div
            className="progress-bar"
            style={{
              width: `${porcentagem}%`,
              backgroundColor: config.cor
            }}
          >
            {Math.round(porcentagem)}%
          </div>
        </div>
        <small className="text-muted">
          {nivel} / 20
        </small>
      </div>
    </div>
  )
}

export default CardPersonagem
```

#### Código completo — src/main.jsx

**src/main.jsx**

```jsx
import 'bootstrap/dist/css/bootstrap.min.css'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root')
)
root.render(<App />)
```

Execute `npm run dev` e teste a aplicação. Ao digitar um nome, selecionar uma classe ou alterar o nível, o card deve atualizar instantaneamente, mostrando o ícone, a cor e a barra de progresso correspondentes.

</details>

## Referências
Duration: 3:00

Parabéns! Você usou componentes funcionais e o hook `useState` em um contador e na aplicação Estação Climática. O próximo passo é o hook `useEffect`, que continua esta mesma aplicação (codelab `react-useeffect`).

* BOOTSTRAP. **Build fast, responsive sites.** 2024. Disponível em [https://getbootstrap.com/](https://getbootstrap.com/). Acesso em 2026.
* MDN WEB DOCS. **Geolocation API.** 2024. Disponível em [https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API). Acesso em 2026.
* REACT. **Hooks Reference.** 2024. Disponível em [https://react.dev/reference/react/hooks](https://react.dev/reference/react/hooks). Acesso em 2026.
* REACT. **The library for web and native user interfaces.** 2024. Disponível em [https://react.dev/](https://react.dev/). Acesso em 2026.
* REACT. **useState Hook.** 2024. Disponível em [https://react.dev/reference/react/useState](https://react.dev/reference/react/useState). Acesso em 2026.
* VITE. **Next Generation Frontend Tooling.** 2024. Disponível em [https://vite.dev/](https://vite.dev/). Acesso em 2026.
