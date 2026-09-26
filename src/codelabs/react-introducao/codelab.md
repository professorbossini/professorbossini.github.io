summary: Dê os primeiros passos com React: entenda o que são componentes, crie um projeto com Vite, conheça sua estrutura, defina seu primeiro componente e compare HTML com JSX, incluindo estilos, variáveis e funções.
id: react-introducao
categories: React,JavaScript
tags: react,jsx,vite,componentes,javascript,babel,estilos
status: Published
authors: Rodrigo Bossini
last updated: 2026-02-28
pdf: react/novo/03_apostila_react_introducao.pdf
exercicios: react/03_exercicios_react_introducao.pdf,react/03_exercicios_com_respostas_react_introducao.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React: componentes, JSX e Vite

## Visão geral
Duration: 3:00

React é uma biblioteca JavaScript de código aberto voltada à construção de interfaces gráficas e componentes visuais. Neste codelab você cria sua primeira aplicação React com o Vite, entende como o JSX é transformado em JavaScript comum e reproduz um formulário HTML em JSX.

### O que você vai aprender

* O que são componentes React e como eles compõem uma interface
* Como organizar um workspace e criar um projeto React com o Vite
* A estrutura de diretórios e arquivos de um projeto Vite
* Como colocar o servidor de desenvolvimento em execução
* Como definir um componente como uma função que retorna JSX
* O que é o JSX e como ele é transformado em chamadas JavaScript
* As diferenças entre HTML e JSX (`style`, camelCase, `htmlFor`, `className`, unidades)
* Como usar variáveis e funções dentro do JSX

### O que você vai precisar

* Node.js e npm instalados
* Um terminal
* O VS Code (ou outro editor de código)
* Um navegador

## Componentes React
Duration: 5:00

React é uma biblioteca Javascript de código aberto, voltada à construção de interfaces gráficas e componentes visuais. Criada em 2013 pelo Facebook, hoje é mantida também por um grupo de empresas e desenvolvedores independentes. **O cerne do React é caracterizado pela criação de componentes.** Entre outras coisas, cada componente tem como responsabilidade **"explicar" como se dá a exibição visual de partes de uma interface gráfica mais complexa.** Cada componente gerencia seu próprio **estado** e eles podem se comunicar por meio de um mecanismo conhecido como **props**. Componentes lidam também com eventos gerados pelo usuário. Ao construir uma interface gráfica, cabe ao desenvolvedor detectar quais partes merecem ser definidas por componentes independentes. Uma vez definidos, os componentes são combinados a fim de se obter a interface completa. Componentes React são usados por meio de um mecanismo semelhante a simples **tags HTML**. A imagem a seguir mostra a página oficial do React e destaca uma forma como ela poderia ser estruturada usando componentes.

![Página oficial do React com retângulos coloridos destacando a barra de ferramentas, o logo, a busca, a definição principal e três cards informativos](img/pagina-react-componentes.webp)

*A página oficial do React dividida em possíveis componentes.*

Na imagem, cada retângulo representa um possível componente React previamente definido. O código que dá origem a essa página poderia ser parecido com o trecho a seguir, onde cada componente é usado como uma tag HTML:

**Estrutura de componentes (ilustrativa)**

```jsx
<PaginaPrincipal>
  <Toolbar>
    <Logo />
    <ul>
      <li>Docs</li>
      <li>Tutorial</li>
      <li>Blog</li>
      <li>Community</li>
    </ul>
    <Busca />
    <ul>
      <li>v17.0.2</li>
      <li>Languages</li>
      <li>GitHub</li>
    </ul>
  </Toolbar>
  <DefinicaoPrincipal>
    <p>React</p>
    <p>A JavaScript library for building user interfaces</p>
    <button>Get Started</button>
    <button>Take the Tutorial</button>
  </DefinicaoPrincipal>
  <CardsInformativos>
    <Card titulo='Declarative'>
      React makes it painless to create interactive UIs.
    </Card>
    <Card titulo='Component-Based'>
      Build encapsulated components that manage their own state.
    </Card>
    <Card titulo='Learn Once, Write Anywhere'>
      Develop new features without rewriting existing code.
    </Card>
  </CardsInformativos>
</PaginaPrincipal>
```

Saiba mais em [https://react.dev](https://react.dev).

## Criando o projeto com Vite
Duration: 10:00

O ambiente de desenvolvimento utilizado neste material é o **Vite**. Trata-se de uma ferramenta de build moderna que oferece inicialização instantânea do servidor local e *hot module replacement* (HMR) eficiente. Mais informações em [https://vitejs.dev/](https://vitejs.dev/).

<aside class="negative">

A ferramenta **create-react-app** já foi amplamente utilizada para criar projetos React, porém hoje é considerada obsoleta e não recebe mais manutenção ativa ([https://github.com/facebook/create-react-app](https://github.com/facebook/create-react-app)).

</aside>

### Seu workspace

É recomendável manter os projetos organizados em um diretório dedicado. Costuma-se chamá-lo de **workspace**, embora qualquer nome sirva. Procure criá-lo em um local que:

* não tenha espaços em branco e/ou caracteres especiais no caminho
* seja subdiretório do home do usuário, evitando problemas de permissão. No Linux: `/home/usuario/workspace`. No Windows: `C:\Users\usuario\Documents\workspace`

<aside class="negative">

**Nota.** No Windows, certifique-se de que o diretório escolhido não está dentro do OneDrive. Isso costuma ocorrer ao clicar em *Documents* na barra lateral do Windows Explorer.

</aside>

Com a pasta criada, abra um terminal e navegue até ela:

**Terminal**

```bash
cd path/do/seu/workspace
```

### Criando uma aplicação React com Vite

Para criar um novo projeto, use o comando a seguir no terminal:

**Terminal**

```bash
npm create vite@latest meu-primeiro-app-react -- --template react
```

Após a criação, entre no diretório e instale as dependências:

**Terminal**

```bash
cd meu-primeiro-app-react
npm install
```

Em seguida, abra o diretório no VS Code:

**Terminal**

```bash
code .
```

### Diretórios e arquivos do projeto

O Explorer do VS Code mostrará a estrutura do projeto, semelhante ao que se vê a seguir.

![Explorer do VS Code mostrando as pastas node_modules, public e src e os arquivos .gitignore, package-lock.json, package.json e README.md](img/explorer-vscode.webp)

*Estrutura do projeto no Explorer do VS Code.*

Os elementos principais são:

* **node_modules**: contém todas as dependências instaladas via `npm install`. Os arquivos da biblioteca React estão aqui.
* **public**: arquivos estáticos não processados pelo Vite — imagens, ícones, fontes etc.
* **src**: o código-fonte da aplicação. O Vite cria aqui `main.jsx`, `App.jsx`, `App.css`, `index.css` e uma pasta `assets`.
* **index.html**: no Vite, este arquivo fica na **raiz do projeto** — não dentro de `public`. É o ponto de entrada da aplicação e referencia `src/main.jsx`.
* **.gitignore**: arquivos e diretórios excluídos do controle de versão Git.
* **package.json**: dependências e scripts do projeto.
* **package-lock.json**: registra a versão exata de cada pacote.
* **vite.config.js**: arquivo de configuração do Vite.

<aside class="positive">

**Nota.** No Vite, os arquivos de componentes React utilizam a extensão `.jsx`, sinalizando que contêm código JSX. Isso é uma convenção recomendada e já adotada nos arquivos gerados automaticamente.

</aside>

## Executando e preparando o projeto
Duration: 6:00

### Colocando o projeto em execução

Para iniciar o servidor de desenvolvimento, use:

**Terminal**

```bash
npm run dev
```

O Vite iniciará um servidor local. O terminal exibirá o endereço de acesso — em geral `http://localhost:5173`. Abra esse endereço no navegador para ver a aplicação.

<aside class="positive">

**Nota.** Para interromper o servidor, pressione `Ctrl+C` no terminal. Para reiniciá-lo, basta executar `npm run dev` novamente.

</aside>

### Preparando o projeto para os experimentos

O Vite gera alguns arquivos iniciais que não usaremos neste momento. Apague `src/App.css` e `src/index.css`.

Em seguida, abra `src/App.jsx` e apague todo o seu conteúdo — o arquivo pode permanecer vazio.

Por fim, abra `src/main.jsx`. O Vite o gerou com o seguinte conteúdo:

**src/main.jsx**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Remova a linha `import './index.css'`, pois excluímos esse arquivo. O restante pode permanecer — em breve definiremos o componente `App` e o importaremos aqui, como o próprio Vite já faz.

<aside class="positive">

**Nota.** Ao salvar as alterações, o Vite detecta as mudanças automaticamente e atualiza o navegador via HMR (*Hot Module Replacement*), sem necessidade de recarregar manualmente a página.

</aside>

## Seu primeiro componente React
Duration: 6:00

A estratégia que adotaremos — e que o próprio Vite já usa por padrão — é definir o componente `App` no arquivo `src/App.jsx` e importá-lo no `main.jsx`. Isso mantém o código organizado e é a estrutura que seguiremos ao longo deste material.

Um componente React pode ser definido como uma função que retorna JSX. Crie (ou edite) `src/App.jsx` com o seguinte conteúdo:

**src/App.jsx**

```jsx
const App = () => {
  return <div>Meu primeiro componente React</div>
}

export default App
```

Agora edite `src/main.jsx` para que fique assim:

**src/main.jsx**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

Salve os dois arquivos e visite **http://localhost:5173**. O resultado deve ser semelhante ao que se vê a seguir.

![Janela do navegador exibindo o texto "Meu primeiro componente ReactJS"](img/primeiro-componente.webp)

*O primeiro componente exibido no navegador.*

<aside class="positive">

**Nota.** O componente `StrictMode` não altera o visual da aplicação. Ele ativa verificações e avisos extras durante o desenvolvimento, sendo desativado em builds de produção.

</aside>

<aside class="positive">

**Nota.** No React 17 e superiores, não é mais necessário importar o React explicitamente em cada arquivo para que o JSX funcione, graças ao novo JSX Transform. O Vite já vem configurado para isso.

</aside>

## JSX? Por quê?
Duration: 5:00

Quando escrevemos uma expressão JSX, estamos criando elementos HTML e inserindo-os na árvore DOM. Embora isso seja possível via chamadas de função JavaScript puras, o processo tende a ser trabalhoso. O JSX — sigla para **Javascript XML** — é uma extensão sintática do JavaScript que simplifica essa tarefa, funcionando como um **syntax sugar**. O Vite processa internamente as expressões JSX usando o **esbuild**, transformando-as em chamadas JavaScript que os navegadores conseguem interpretar, conforme o esquema a seguir.

![Esquema: código JavaScript "moderno" com JSX passa pelo Babel e vira código JavaScript "regular" com React.createElement, compreendido pelos navegadores](img/babel-esquema.webp)

*Transformação do JSX em JavaScript compreendido pelos navegadores.*

Por exemplo, a expressão a seguir:

**JSX**

```jsx
return <div>Meu primeiro componente React</div>
```

é transformada pelo compilador em algo equivalente a:

**JavaScript gerado**

```javascript
return React.createElement('div', null, 'Meu primeiro componente React')
```

Para explorar outras transformações, acesse o Babel Playground em [https://babeljs.io/repl](https://babeljs.io/repl), clique em **Try it out** e cole o código JSX, conforme mostrado a seguir.

![Babel Playground com o preset react marcado, o código JSX à esquerda e o resultado com React.createElement à direita](img/babel-playground.webp)

*O Babel Playground transformando JSX em JavaScript.*

## HTML versus JSX
Duration: 12:00

Nesta seção vamos construir o mesmo formulário de duas formas — primeiro em HTML puro e depois em JSX — e comparar as diferenças entre as duas abordagens.

### Criando o arquivo HTML de referência

O objetivo é ter um arquivo HTML simples que possamos abrir diretamente no navegador, sem qualquer processamento do React ou do Vite. Ele servirá como referência visual para o formulário que reproduziremos em JSX a seguir.

Crie um novo arquivo em qualquer pasta do seu sistema — fora do projeto Vite. Chame-o de `teste.html`. Abra-o no VS Code e insira o conteúdo a seguir:

**teste.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Teste HTML</title>
</head>
<body>
  <div style="margin: auto; width: 768px;
              background-color: #EEE; padding: 12px;
              border-radius: 8px">

    <label for="nome"
           style="display: block; margin-bottom: 4px">
      Nome:
    </label>

    <input type="text" id="nome"
      style="padding-top: 8px; padding-bottom: 8px;
             border-style: hidden; width: 100%;
             border-radius: 8px; outline: none;
             box-sizing: border-box" />

    <button style="margin-top: 12px; padding-top: 8px;
                   padding-bottom: 8px;
                   background-color: blueviolet;
                   color: white; border: none;
                   width: 100%; border-radius: 8px">
      Enviar
    </button>

  </div>
</body>
</html>
```

Com o arquivo salvo, abra-o no navegador — clique duas vezes sobre ele no explorador de arquivos do sistema operacional ou use a extensão **Live Server** do VS Code. O resultado esperado é o que se vê a seguir.

![Formulário com fundo cinza claro, rótulo "Nome:", campo de texto branco e botão roxo "Enviar"](img/formulario.webp)

*O formulário de referência renderizado pelo navegador.*

<aside class="positive">

**Nota.** Caso ainda não tenha a extensão Live Server instalada no VS Code, localize-a na aba de extensões (`Ctrl+Shift+X`) pelo nome "Live Server", de Ritwick Dey.

</aside>

### O equivalente em JSX

Agora vamos reproduzir o mesmo formulário no projeto Vite. Abra `src/App.jsx` e substitua seu conteúdo pelo seguinte:

**src/App.jsx**

```jsx
const App = () => {
  return (
    <div style={{margin: 'auto', width: 768,
                 backgroundColor: '#EEE',
                 padding: 12, borderRadius: 8}}>

      <label htmlFor='nome'
             style={{display: 'block', marginBottom: 4}}>
        Nome:
      </label>

      <input type='text' id='nome'
        style={{paddingTop: 8, paddingBottom: 8,
                borderStyle: 'hidden', width: '100%',
                borderRadius: 8, outline: 'none',
                boxSizing: 'border-box'}} />

      <button style={{marginTop: 12, paddingTop: 8,
                      paddingBottom: 8,
                      backgroundColor: 'blueviolet',
                      color: 'white', border: 'none',
                      width: '100%', borderRadius: 8}}>
        Enviar
      </button>

    </div>
  )
}

export default App
```

Salve e observe o resultado em `http://localhost:5173`. O visual deve ser idêntico ao do `teste.html` criado anteriormente.

### As principais diferenças

As principais diferenças entre as duas versões merecem atenção:

* **`style` como objeto JavaScript:** em JSX, o atributo `style` recebe um objeto JavaScript — daí as chaves duplas `{{ }}`. O primeiro par indica que o que vem a seguir é uma expressão JS; o segundo delimita o objeto em si.
* **Propriedades em camelCase:** nomes CSS com hífen viram camelCase em JSX. Por exemplo, `background-color` → `backgroundColor`, `border-radius` → `borderRadius`.
* **`htmlFor` em vez de `for`:** a palavra `for` é reservada em JavaScript. O atributo homônimo do `<label>` é escrito como `htmlFor` em JSX.
* **`className` em vez de `class`:** pelo mesmo motivo, `class` — palavra reservada em JS — é substituído por `className` em JSX.
* **Unidades de medida:** a documentação oficial do React explica o seguinte a respeito de valores numéricos em propriedades de estilo:

> "React will automatically append a 'px' suffix to certain numeric inline style properties. If you want to use units other than 'px', specify the value as a string with the desired unit."
>
> Fonte: react.dev — Common Components (style)

Ou seja, valores numéricos como `padding: 12` são convertidos automaticamente para `12px`. Para outras unidades, use string: `width: '100%'`, `fontSize: '1.2rem'` etc.

<aside class="positive">

**Nota.** Para usar CSS de arquivo externo, crie o arquivo — por exemplo, `styles.css` — dentro de `src` e importe-o no topo de `App.jsx` com `import './styles.css'`. Classes são aplicadas com `className="nome-da-classe"`.

</aside>

## Usando variáveis e funções em JSX
Duration: 6:00

Uma das vantagens do JSX é a possibilidade de intercalar código JavaScript diretamente na marcação, usando chaves simples `{ }`. O exemplo a seguir mostra como definir estilos e textos como constantes — inclusive como função — e referenciá-los no JSX:

**src/App.jsx**

```jsx
const App = () => {
  const estilosBotao = {
    marginTop: 12, paddingTop: 8, paddingBottom: 8,
    backgroundColor: 'blueviolet', color: 'white',
    border: 'none', width: '100%', borderRadius: 8
  }

  const textoDoRotulo = 'Nome:'

  const obterTextoDoBotao = () => {
    return 'Enviar'
  }

  return (
    <div style={{margin: 'auto', width: 768,
                 backgroundColor: '#EEE',
                 padding: 12, borderRadius: 8}}>

      <label htmlFor='nome'
             style={{display: 'block', marginBottom: 4}}>
        {textoDoRotulo}
      </label>

      <input type='text' id='nome'
        style={{paddingTop: 8, paddingBottom: 8,
                borderStyle: 'hidden', width: '100%',
                borderRadius: 8, outline: 'none',
                boxSizing: 'border-box'}} />

      <button style={estilosBotao}>
        {obterTextoDoBotao()}
      </button>

    </div>
  )
}

export default App
```

As expressões `{textoDoRotulo}` e `{obterTextoDoBotao()}` são resolvidas em tempo de execução — o React as substitui pelos seus valores antes de renderizar o HTML.

## Exercícios
Duration: 25:00

<aside class="negative">

**Atenção.** Esta lista de exercícios é da versão anterior deste material, que usava o **create-react-app** (`npx create-react-app`, `npm start`, porta 3000) e `ReactDOM.render`. As respostas foram mantidas como no original. No projeto Vite deste codelab, o componente fica em `src/App.jsx` e o `src/main.jsx` usa `createRoot`; além disso, arquivos da pasta `public` são acessados pelo caminho absoluto (por exemplo, `/doc2.jpg`), e não por `process.env.PUBLIC_URL`.

</aside>

**1.** Crie uma aplicação ReactJS com um único componente que exibe o conteúdo ilustrado pela Figura 1.1. As fotos podem ser obtidas a partir de um site com o **Unsplash** ou o **Pexels**.

![Caixa cinza com o título "Profissionais de saúde" e três cards lilás com fotos e nomes: José da Silva, Maria da Silva e Jaqueline Mendes; os números 1, 2 e 3 marcam o contêiner externo, o contêiner dos cards e um card](img/exercicio-profissionais.webp)

*Figura 1.1: o conteúdo que a aplicação deve exibir.*

<details><summary>Ver resposta</summary>

A aplicação pode ser criada com o comando

**Terminal**

```bash
npx create-react-app profissionais_de_saude
```

A seguir, use

**Terminal**

```bash
cd profissionais_de_saude
```

para navegar até a pasta criada.

Apague todos os arquivos da pasta `src`. Use, então,

**Terminal**

```bash
code .
```

para abrir uma instância do VS Code vinculada à pasta do projeto. No VS Code, clique **Terminal >> New Terminal** para abrir um terminal "embutido", o que facilita os trabalhos. Neste terminal, use

**Terminal**

```bash
npm start
```

para colocar a aplicação em execução. Ela pode ser visitada por meio do link `localhost:3000`.

O código inicial da aplicação é dado no Bloco de Código 1.1 (o `return` ainda está vazio: ele será preenchido nos próximos itens).

**src/index.js · Bloco de Código 1.1**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
const App = () => {

    return (

    )
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
```

</details>

Siga as seguintes instruções.

**1.1** Defina os estilos do elemento "1" usando uma função que devolve um objeto JSON.

<details><summary>Ver resposta</summary>

**src/index.js · Bloco de Código 1.2**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
const App = () => {

    const containerStyles = () => {
        return {width: 1280, margin: 'auto', border: '1px solid black', backgroundColor: "#EEE", borderRadius: 8, padding: 12, textAlign: 'center'};
    }
    return (
        <div style={containerStyles()}>
            <h2>Profissionais de saúde</h2>
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
```

</details>

**1.2** Defina os estilos do elemento "2" usando CSS In-line.

<details><summary>Ver resposta</summary>

**src/index.js · Bloco de Código 1.3**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
const App = () => {
    const containerStyles = () => {
        return {width: 1280, margin: 'auto', border: '1px solid black', backgroundColor: "#EEE", borderRadius: 8, padding: 12, textAlign: 'center'};
    }
    return (
        <div style={containerStyles()}>
            <h2>Profissionais de saúde</h2>
            <div style={{margin: 8, border: '1px solid #DDD', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>


            </div>
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
```

</details>

**1.3** Defina os estilos do elemento "3" usando uma classe CSS definida em um arquivo à parte.

<details><summary>Ver resposta</summary>

Crie um arquivo chamado `styles.css` na pasta `src`. Seu conteúdo é dado no Bloco de Código 1.4.

**src/styles.css · Bloco de Código 1.4**

```css
.profissional{
    border: 1px solid rgb(192, 153, 243);
    background-color: rgb(228, 221, 238);
    border-radius: 8px;
    padding: 8px;
}
.profissional img{
   height: 150px;
   border-radius: 8px;
}
```

O Bloco de Código 1.5 mostra como utilizá-lo.

**src/index.js · Bloco de Código 1.5**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
const App = () => {
    const containerStyles = () => {
        return {width: 1280, margin: 'auto', border: '1px solid black', backgroundColor: "#EEE", borderRadius: 8, padding: 12, textAlign: 'center'};
    }
    return (
        <div style={containerStyles()}>
            <h2>Profissionais de saúde</h2>
            <div style={{margin: 8, border: '1px solid #DDD', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                <div className="profissional">

                </div>

                <div className="profissional">

                </div>

                <div className="profissional">

                </div>
            </div>
        </div>
    )
}
ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
```

</details>

**1.4** Defina os nomes dos médicos em um objeto JSON.

<details><summary>Ver resposta</summary>

Veja o Bloco de Código 1.6.

**src/index.js · Bloco de Código 1.6**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
const App = () => {
    const containerStyles = () => {
        return {width: 1280, margin: 'auto', border: '1px solid black', backgroundColor: "#EEE", borderRadius: 8, padding: 12, textAlign: 'center'};
    }
    const docNames = {doc1: 'José da Silva', doc2: 'Maria da Silva', doc3: 'Jaqueline Mendes'};

    return (
        <div style={containerStyles()}>
            <h2>Profissionais de saúde</h2>
            <div style={{margin: 8, border: '1px solid #DDD', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>

                <div className="profissional">
                    <p>{docNames.doc1}</p>
                </div>

                <div className="profissional">
                    <p>{docNames.doc2}</p>
                </div>

                <div className="profissional">
                    <p>{docNames.doc3}</p>
                </div>
            </div>
        </div>
    )
}
ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
```

</details>

**1.5** Faça o download da primeira foto e armazene-a em uma pasta chamada `images`, subpasta de `src`. Pesquise como ela pode ser acessada usando uma instrução `import`.

<details><summary>Ver resposta</summary>

Crie a pasta conforme o enunciado. Faça o download da figura e altere seu nome para `doc1.jpg`. O Bloco de Código 1.7 mostra como acessá-la.

**src/index.js · Bloco de Código 1.7**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import doc1 from './images/doc1.jpg'
const App = () => {

    const containerStyles = () => {
        return {width: 1280, margin: 'auto', border: '1px solid black', backgroundColor: "#EEE", borderRadius: 8, padding: 12, textAlign: 'center'};
    }
    const docNames = {doc1: 'José da Silva', doc2: 'Maria da Silva', doc3: 'Jaqueline Mendes'};

    return (
        <div style={containerStyles()}>
            <h2>Profissionais de saúde</h2>
            <div style={{margin: 8, border: '1px solid #DDD', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>

                <div className="profissional">
                   <img src={doc1}/>
                   <p>{docNames.doc1}</p>
                </div>

                <div className="profissional">

                   <p>{docNames.doc2}</p>
                </div>

                <div className="profissional">

                   <p>{docNames.doc3}</p>
                </div>
            </div>
        </div>
    )
}
ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
```

</details>

**1.6** Faça o download da segunda foto e armazene-a na pasta `public`, que já existe no projeto. Pesquise como ela pode ser acessada usando a propriedade `env` do objeto global `process` do NodeJS: `process.env.nomeDaFoto.jpg`.

<details><summary>Ver resposta</summary>

Faça o download da figura e altere seu nome para `doc2.jpg`. O Bloco de Código 1.8 mostra como acessá-la.

**src/index.js · Bloco de Código 1.8**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import doc1 from './images/doc1.jpg'
const App = () => {
    const containerStyles = () => {
        return {width: 1280, margin: 'auto', border: '1px solid black', backgroundColor: "#EEE", borderRadius: 8, padding: 12, textAlign: 'center'};
    }
    const docNames = {doc1: 'José da Silva', doc2: 'Maria da Silva', doc3: 'Jaqueline Mendes'};
    return (
        <div style={containerStyles()}>
            <h2>Profissionais de saúde</h2>
            <div style={{margin: 8, border: '1px solid #DDD', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>

                <div className="profissional">
                   <img src={doc1}/>
                   <p>{docNames.doc1}</p>
                </div>

                <div className="profissional">
                   <img src={process.env.PUBLIC_URL+ 'doc2.jpg'}/>
                   <p>{docNames.doc2}</p>
                </div>

                <div className="profissional">

                   <p>{docNames.doc3}</p>
                </div>
            </div>
        </div>
    )
}
ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
```

</details>

**1.7** Acesse a terceira foto usando um link https comum.

<details><summary>Ver resposta</summary>

Veja o Bloco de Código 1.9.

**src/index.js · Bloco de Código 1.9**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import doc1 from './images/doc1.jpg'
const App = () => {

    const containerStyles = () => {
        return {width: 1280, margin: 'auto', border: '1px solid black', backgroundColor: "#EEE", borderRadius: 8, padding: 12, textAlign: 'center'};
    }
    const docNames = {doc1: 'José da Silva', doc2: 'Maria da Silva', doc3: 'Jaqueline Mendes'};

    return (
        <div style={containerStyles()}>
            <h2>Profissionais de saúde</h2>
            <div style={{margin: 8, border: '1px solid #DDD', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>

                <div className="profissional">
                   <img src={doc1}/>
                   <p>{docNames.doc1}</p>
                </div>

                <div className="profissional">
                   <img src={process.env.PUBLIC_URL+ 'doc2.jpg'}/>
                   <p>{docNames.doc2}</p>
                </div>

                <div className="profissional">
                   <img src='https://images.unsplash.com/photo-1591604021695-0c69b7c05981?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'/>
                   <p>{docNames.doc3}</p>
                </div>
            </div>
        </div>
    )
}
ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
```

</details>

## Referências
Duration: 3:00

Parabéns! Você criou seu primeiro projeto React com o Vite, definiu um componente e comparou HTML com JSX. Os próximos passos naturais são componentes funcionais com estado (hook `useState`) e efeitos colaterais (hook `useEffect`).

* META PLATFORMS. **React: the library for web and native user interfaces.** Disponível em: [https://react.dev](https://react.dev). Acesso em 2026.
* VITE. **Vite: a próxima geração de ferramentas de frontend.** Disponível em: [https://vite.dev/](https://vite.dev/). Acesso em 2026.
