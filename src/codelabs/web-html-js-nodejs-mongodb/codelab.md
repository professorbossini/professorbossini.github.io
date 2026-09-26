summary: Construa uma aplicação Full Stack de gerenciamento de filmes com Front End em HTML, CSS, JavaScript e Bootstrap, Back End em Node.js com Express e persistência no MongoDB Atlas, incluindo cadastro de usuários com bcrypt e login com JWT.
id: web-html-js-nodejs-mongodb
categories: MongoDB,Node.js,JavaScript
tags: html,javascript,node.js,express,mongodb,atlas,mongoose,axios,cors,dom,bootstrap,bcrypt,jwt,thunder client
status: Published
authors: Rodrigo Bossini
last updated: 2022-11-02
pdf: tti107_ads2001/09_apostila_html_js_nodejs_mongodb.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Aplicação Full Stack com HTML, JavaScript, Node.js e MongoDB

## Visão geral
Duration: 4:00

Neste material desenvolveremos uma aplicação com as seguintes características:

* **Front End**: HTML, CSS e Javascript
* **Back End**: Javascript com NodeJS
* **Base de dados**: NoSQL gerenciada pelo MongoDB.

Trata-se de uma aplicação própria para o gerenciamento de filmes. Veja a figura.

![Diagrama da solução: o navegador com a aplicação de filmes envia requisições HTTP ao Back End em Node.js, que lê e grava os dados em uma base gerenciada pelo MongoDB; o conjunto forma a aplicação Full Stack](img/fig-1-1.webp)

*Visão geral da aplicação Full Stack: Front End, Back End e MongoDB.*

### O que você vai aprender

* Criar um projeto Node.js com NPM, Express e nodemon
* Definir endpoints HTTP e testá-los com o navegador e com o Thunder Client
* Montar o Front End com HTML e Bootstrap e fazer requisições com a Axios
* Entender o mecanismo CORS e liberá-lo com o pacote `cors`
* Manipular a árvore DOM com Javascript
* Criar um cluster gratuito no MongoDB Atlas e acessá-lo com o Mongoose
* Cadastrar usuários com senha criptografada (bcrypt) e validação de unicidade
* Fazer login gerando um token JWT
* Usar barra de navegação, modais e alertas do Bootstrap
* Reutilizar código com funções auxiliares

### O que você vai precisar

* NodeJS (com NPM) instalado
* VS Code, com as extensões Thunder Client e Live Server (ou outra forma de servir o Front End)
* Google Chrome (ou outro navegador com ferramentas de desenvolvedor)
* Uma conta no MongoDB Atlas (criada ao longo do codelab)

## Back End: projeto Node.js e dependências
Duration: 8:00

### Instalando o NodeJS

Comece instalando o NodeJS:

[https://nodejs.org/en/](https://nodejs.org/en/)

A instalação do NodeJS traz consigo um software chamado **NPM** (Node Package Manager). Ele permite a instalação de pacotes para o ambiente NodeJS.

### Nova pasta, projeto e dependências

Crie uma pasta em seu sistema de arquivos e abra uma instância do VS Code vinculada a ela (clique **File >> Open Folder** no VS Code para isso).

A seguir, clique em **Terminal >> New Terminal**. No terminal, digite o comando a seguir para criar um novo projeto NodeJS.

**Terminal**

```bash
npm init -y
```

O NodeJS será responsável por lidar com requisições HTTP enviadas pelo Front End. Utilizaremos o pacote **express** para fazer esta manipulação com alto nível de abstração. Faça, portanto, a sua instalação.

**Terminal**

```bash
npm install express
```

Instale também o pacote **nodemon**, pois ele se encarrega de reiniciar o servidor a cada vez que um arquivo é editado, o que simplifica bastante o desenvolvimento.

**Terminal**

```bash
npm install nodemon --save-dev
```

Abra o arquivo `package.json` e faça o ajuste a seguir (o script `start`).

**package.json**

```json
{
  "name": "html_node_mongodb",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Crie um arquivo chamado `index.js` na raiz do projeto. Veja seu conteúdo inicial.

**index.js**

```javascript
console.log('Hello, NodeJS')
```

No terminal, use o comando a seguir para colocar a aplicação em funcionamento. Sempre que o arquivo for editado o nodemon reiniciará o servidor. Você deve ter visto a mensagem no terminal.

**Terminal**

```bash
npm start
```

## Manipulando requisições HTTP com o Express
Duration: 8:00

Agora, vamos utilizar o express para especificar URLs que poderão ser acessadas por meio de requisições HTTP pelo Front End. O código a seguir faz a configuração inicial.

**index.js**

```javascript
const express = require('express')
const app = express()
app.use(express.json())

app.listen(3000, () => console.log("up and running"))
```

Observe como podemos definir uma URL que, quando acessada, fará com que uma função Javascript seja executada.

**index.js**

```javascript
const express = require('express')
const app = express()
app.use(express.json())

//GET http://localhost:3000/hey
app.get('/hey', (req, res) => {
  res.send('hey')
})

app.listen(3000, () => console.log("up and running"))
```

Podemos realizar testes utilizando diferentes ferramentas. O próprio navegador é um candidato. Visite `localhost:3000/hey` usando o navegador que desejar e veja o resultado.

Um outro candidato é o **Thunder Client**. É uma extensão do VS Code que permite a realização de requisições HTTP. Você pode encontrá-lo no menu de extensões do VS Code e fazer a sua instalação, como na figura.

![Menu de extensões do VS Code com a busca por Thunder Client e o botão de instalação destacado](img/fig-2-3-1.webp)

*Instalação da extensão Thunder Client.*

Após realizar a sua instalação, no menu à esquerda, o VS Code deverá exibir um ícone que dá acesso a ele, como na figura a seguir. Clique nele e depois clique em **New Request**. Escolha o método **GET** e digite o endereço para a requisição. Clique em **Send** e veja o resultado.

![Thunder Client com uma requisição GET para localhost:3000/hey, o botão Send e a resposta hey com status 200 OK destacados](img/fig-2-3-2.webp)

*Requisição GET feita com o Thunder Client.*

## Base volátil e endpoints de filmes
Duration: 10:00

### Base de dados para armazenar filmes

Num primeiro momento, vamos armazenar todos os filmes em memória volátil. Ou seja, se o servidor for reiniciado, os dados serão perdidos. Mais adiante ajustamos isso. A seguir criamos uma coleção e armazenamos dois filmes que ficarão fixos por enquanto.

**index.js**

```javascript
const express = require('express')
const app = express()
app.use(express.json())

let filmes = [
  {
    titulo: "Forrest Gump - O Contador de Histórias",
    sinopse: "Quarenta anos da história dos Estados Unidos, vistos pelos olhos de Forrest Gump (Tom Hanks), um rapaz com QI abaixo da média e boas intenções."
  },
  {
    titulo: "Um Sonho de Liberdade",
    sinopse: "Em 1946, Andy Dufresne (Tim Robbins), um jovem e bem sucedido banqueiro, tem a sua vida radicalmente modificada ao ser condenado por um crime que nunca cometeu, o homicídio de sua esposa e do amante dela"
  }
]
…
```

### Endpoint para a obtenção da base de dados

A seguir, escrevemos um endpoint que permite a obtenção da coleção de filmes. Assim, qualquer cliente interessado, como o navegador, o Thunder Client ou a aplicação HTML/Javascript que escreveremos poderão acessá-la.

**index.js**

```javascript
…
let filmes = [
  …
]

app.get("/filmes", (req, res) => {
  res.json(filmes)
})
…
```

Faça um novo teste visitando `localhost:3000/filmes` em seu navegador. O resultado é parecido com aquele que a figura exibe.

![Navegador exibindo em localhost:3000/filmes o JSON formatado com os dois filmes, cada um com titulo e sinopse](img/fig-2-5-1-navegador.webp)

*A coleção de filmes exibida pelo navegador.*

<aside class="positive">

**Nota.** É possível que o seu navegador exiba a coleção de filmes sem a formatação exibida na figura. Para ajustar isso, basta visitar a loja de extensões do Google Chrome, por meio do link [https://chrome.google.com/webstore/category/extensions](https://chrome.google.com/webstore/category/extensions), e fazer a instalação da extensão chamada **JSON Viewer**.

</aside>

Use também o Thunder Client para testar, como na figura.

![Thunder Client com uma requisição GET para localhost:3000/filmes e a resposta com a lista de filmes em JSON](img/fig-2-5-1-thunder.webp)

*A coleção de filmes obtida pelo Thunder Client.*

### Endpoint para armazenar novos filmes

O endpoint a seguir permite que clientes interessados armazenem novos filmes.

**index.js**

```javascript
…
app.get("/filmes", (req, res) => {
  res.json(filmes)
})

app.post("/filmes", (req, res) => {
  //obtém os dados enviados pelo cliente
  const titulo = req.body.titulo
  const sinopse = req.body.sinopse
  //monta um objeto agrupando os dados. Ele representa um novo filme
  const filme = {titulo: titulo, sinopse: sinopse}
  //adiciona o novo filme à base
  filmes.push(filme)
  //responde ao cliente. Aqui, optamos por devolver a base inteira ao cliente, embora não seja obrigatório.
  res.json(filmes)
})

//GET http://localhost:3000/hey
app.get('/hey', (req, res) => {
  res.send('hey')
})
…
```

Use o Thunder Client para testar o novo endpoint: escolha o método **POST**, o endereço `http://localhost:3000/filmes` e, na aba **Body >> Json**, envie um filme como o seguinte.

**Thunder Client · Body (Json)**

```json
{
  "titulo": "Vingadores: Ultimato",
  "sinopse": "Os Vingadores unem forças para lutar contra Thanos, após o vilão eliminar metade dos seres vivos da galáxia."
}
```

![Thunder Client com a requisição POST para localhost:3000/filmes, o corpo JSON do novo filme e a resposta com os três filmes](img/fig-2-6-1.webp)

*Cadastro de um filme com o Thunder Client.*

No seu navegador, visite `localhost:3000/filmes` para ter certeza de que o novo filme foi, de fato, armazenado na base. O resultado esperado aparece na figura.

![Navegador exibindo em localhost:3000/filmes os três filmes, incluindo Vingadores: Ultimato](img/fig-2-6-2.webp)

*O novo filme aparece na coleção.*

## Front End: estrutura, responsividade e tabela
Duration: 8:00

### Estrutura inicial da aplicação

Passamos a implementar nosso Front End. Por simplicidade, seus arquivos ficarão armazenados na mesma pasta do Back End. Em geral, é mais comum que sejam projetos independentes, armazenados em pastas diferentes, desenvolvidos eventualmente por equipes diferentes, armazenados em repositórios de controle de versão diferentes. Mas vamos simplificar neste momento. Comece criando a estrutura ilustrada pela figura. Observe que criamos uma pasta chamada `front` na raiz do projeto e, dentro dela, a estrutura típica de uma aplicação Front End simples.

![Explorador do VS Code com a pasta front contendo css/styles.css, js/script.js e index.html, ao lado de node_modules, index.js e package.json](img/fig-2-7-1.webp)

*Estrutura de pastas do Front End.*

Veja o conteúdo inicial do arquivo `index.html`. Observe que já importamos o Bootstrap.

**front/index.html**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Filmes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.css" rel="stylesheet">
  </head>
  <body>
    <!-- também importamos nosso arquivo javascript -->
    <script src="js/script.js"></script>
  </body>
</html>
```

### Controle de responsividade

A seguir fazemos o controle de responsividade com o grid system do Bootstrap.

**front/index.html**

```html
…
  <body>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
        </div>
      </div>
    </div>
    <!-- também importamos nosso arquivo javascript -->
    <script src="js/script.js"></script>
  </body>
…
```

### Tabela para a exibição de filmes

Assim que a página for carregada, queremos exibir a lista de filmes existentes na base. Façamos isso utilizando uma tabela. Ela pode ser criada como no código a seguir. Observe como aplicamos as seguintes classes do Bootstrap:

* `table`: padding para as células, borda etc.
* `table-striped`: cores alternantes para as linhas
* `table-hover`: células trocam de cor conforme o mouse passa por cima delas
* `text-center`: texto dentro das células centralizado

Também aplicamos uma classe própria chamada `filmes`, que servirá como seletor em breve.

**front/index.html**

```html
…
<div class="container mt-5">
  <div class="row justify-content-center">
    <div class="col-md-8">
      <table class="table table-striped table-hover text-center filmes">
        <thead>
          <tr>
            <th>Título</th>
            <th>Sinopse</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  </div>
</div>
…
```

O resultado esperado se parece com aquele que a figura exibe. Observe.

![Página com uma tabela vazia contendo apenas os cabeçalhos Título e Sinopse](img/fig-2-9-1.webp)

*A tabela de filmes, ainda vazia.*

## Requisições HTTP com a Axios e CORS
Duration: 12:00

A aplicação Front End precisa enviar requisições HTTP ao Back End a fim de operar sobre a coleção de filmes lá armazenada. Para isso, vamos utilizar um pacote chamado **axios**. Ele pode ser importado via CDN, como mostra o código a seguir. Estamos no arquivo `index.html`.

**front/index.html**

```html
…
<body>
  <div class="container mt-5">
    …
  </div>
  <!-- também importamos nosso arquivo javascript -->
  <script src="js/script.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</body>
…
```

No arquivo `script.js`, definimos três constantes que armazenam o protocolo, URL base e endereço do endpoint para manipulação de filmes. Também definimos uma função que será executada sempre que a página for recarregada.

**front/js/script.js**

```javascript
const protocolo = 'http://'
const baseURL = 'localhost:3000'
const filmesEndpoint = '/filmes'

function obterFilmes() {
  console.log("testando...")
}
```

Precisamos especificar que a função deve ser colocada em execução quando a página terminar de carregar. Para tal, utilizamos o atributo `onload` do elemento `body`, no arquivo `index.html`.

**front/index.html**

```html
…
<body onload="obterFilmes()">
…
```

Para testar, abra o Chrome Dev Tools (CTRL + SHIFT + I). Atualize a página e veja o resultado, que deve ser parecido com aquele que a figura exibe.

![Aba Console do Chrome Dev Tools exibindo a mensagem testando...](img/fig-2-10-1.webp)

*A função obterFilmes executada ao carregar a página.*

Façamos uma requisição HTTP com a Axios. O que faremos é uma requisição idêntica àquela realizada pelo nosso navegador e àquela realizada pelo Thunder Client. A diferença é que estamos escrevendo código para realizá-la, ao invés de usar uma interface gráfica. No código a seguir, realizamos os seguintes passos.

* Marcamos a função como `async` para que possamos utilizar `await`, fazendo com que o processamento seja simplificado. Há muitos detalhes técnicos envolvidos cujas explicações não cabem neste momento.
* Montamos a URL usando um template de string (cadeia delimitada por crases) e a operação de interpolação (ao invés de concatenação) com o operador `${ }`.
* Usamos o método `get` da axios e, do resultado, extraímos o campo `data` que, segundo a sua documentação, representa o corpo da resposta. Neste caso, justamente os filmes.
* Exibimos a coleção de filmes no console.

Estamos no arquivo `script.js`.

**front/js/script.js**

```javascript
const protocolo = 'http://'
const baseURL = 'localhost:3000'
const filmesEndpoint = '/filmes'

async function obterFilmes() {
  const URLCompleta = `${protocolo}${baseURL}${filmesEndpoint}`
  const filmes = (await axios.get(URLCompleta)).data
  console.log(filmes)
}
```

Recarregue a página mais uma vez e veja o resultado no Chrome Dev Tools (CTRL + SHIFT + I). Você deverá ver um erro parecido com aquele que a figura exibe.

![Console do Chrome exibindo o erro Access to XMLHttpRequest at localhost:3000/filmes has been blocked by CORS policy, seguido de net::ERR_FAILED e AxiosError Network Error](img/fig-2-10-2.webp)

*A requisição é bloqueada pelo CORS.*

### O mecanismo CORS

O erro exibido envolve o mecanismo de segurança chamado **CORS** (Cross-Origin Resource Sharing). Trata-se de um mecanismo implementado pelos servidores Web que, por padrão, bloqueia requisições por recursos feitas a partir de um domínio diferente, caracterizado pela seguinte tripla:

* Protocolo
* Host
* Porta

No nosso caso, o Back End tem as seguintes características:

* Protocolo: http
* Host: localhost
* Porta: 3000

O Front, por sua vez, tem as seguintes características:

* Protocolo: http
* Host: localhost
* Porta: 5000 (ou outra, escolhida pelo Live Server)

Como eles diferem em pelo menos um desses três itens (neste caso, a porta), o mecanismo CORS entra em cena e bloqueia as requisições.

Como o servidor nos pertence, podemos desativar este mecanismo. Isso pode ser feito muito facilmente utilizando-se o pacote **cors**. Ele pode ser instalado assim:

**Terminal**

```bash
npm install cors
```

Depois disso, ajuste o arquivo `index.js`.

**index.js**

```javascript
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

let filmes = [
…
```

Faça um novo teste atualizando a página no seu navegador. A coleção de filmes deverá ser exibida como na figura.

![Console do Chrome exibindo um array com dois objetos de filme, cada um com titulo e sinopse](img/fig-2-10-3.webp)

*A coleção de filmes chega ao Front End.*

## A árvore DOM
Duration: 12:00

### O que é a árvore DOM

Operar dinamicamente significa realizar alguma tarefa em tempo de requisição, em tempo de execução etc. Em nossa aplicação, a coleção de filmes é armazenada numa base de dados e pode ser modificada ao longo do tempo. Por isso, precisamos ajustar a estrutura do elemento HTML `table` conforme o usuário interage com a aplicação, adicionando e removendo colunas, alterando dados das células etc. Para fazê-lo, precisamos entender quem é a criatura chamada **árvore DOM** (Document Object Model).

Quando nosso navegador visita uma página, o servidor para o qual enviou a requisição lhe entrega um documento HTML. O navegador se encarrega de

* construir uma árvore DOM de acordo com o documento HTML
* exibir a página de acordo com as propriedades da árvore DOM

A figura mostra a árvore DOM construída de acordo com o nosso documento HTML escrito até então. Observe que cada elemento HTML é representado por um objeto ou nó na árvore.

![Árvore DOM do documento: html na raiz com head (meta, title, link) e body; dentro do body, as divs container, row e col, a table com thead, tr, th Título e th Sinopse, tbody e os scripts](img/fig-2-11-1.webp)

*A árvore DOM do documento index.html.*

<aside class="positive">

**Nota.** Há uma variável implícita chamada `document` que faz referência à árvore DOM e que podemos utilizar para iniciar as buscas.

</aside>

### Manipulando a árvore DOM com Javascript

Agora que sabemos da existência da árvore DOM, concluímos que o nosso desejo de momento é manipulá-la, adicionando uma linha (elemento `tr`) a seu corpo (elemento `tbody`) para cada filme existente na base. Isso deve ser feito em tempo de requisição e, por isso, precisamos de Javascript. O processo será o seguinte:

* Fazemos uma busca na árvore para encontrar o elemento envolvido na manipulação que desejamos, declarando uma variável que o referencia
* Utilizando a variável, alteramos as propriedades de interesse do elemento encontrado

Falando mais especificamente sobre a aplicação de filmes, o que queremos fazer é

* Encontrar o corpo (`tbody`) da tabela na árvore DOM
* Para cada filme, adicionar uma linha (`tr`) a ele
* Para cada linha, adicionar duas células (`td`). Uma para o título e outra para a sinopse.

A figura mostra o que faremos. Para simplificar, exibimos apenas a tabela na árvore.

![Diagrama da subárvore da tabela: document.querySelector encontra a table, getElementsByTagName encontra o tbody, insertRow cria um tr e insertCell cria as células td com o título e a sinopse](img/fig-2-12-1.webp)

*Manipulação da subárvore da tabela.*

O código a seguir mostra essa implementação, incluindo um detalhe: iteramos sobre a coleção de filmes trazida da base, adicionando uma nova linha (`tr`) à tabela para cada filme.

**front/js/script.js**

```javascript
const protocolo = 'http://'
const baseURL = 'localhost:3000'
const filmesEndpoint = '/filmes'

async function obterFilmes() {
  const URLCompleta = `${protocolo}${baseURL}${filmesEndpoint}`
  const filmes = (await axios.get(URLCompleta)).data
  let tabela = document.querySelector('.filmes')
  let corpoTabela = tabela.getElementsByTagName('tbody')[0]
  for (let filme of filmes) {
    //insertRow(0) para adicionar sempre na primeira linha
    //se quiser adicionar na última, chame insertRow sem argumentos
    let linha = corpoTabela.insertRow(0)
    let celulaTitulo = linha.insertCell(0)
    let celulaSinopse = linha.insertCell(1)
    celulaTitulo.innerHTML = filme.titulo
    celulaSinopse.innerHTML = filme.sinopse
  }
}
```

Recarregue a página e verifique o resultado. Ele deve ser parecido com aquele exibido pela figura.

![Tabela com as linhas Forrest Gump - O Contador de Histórias e Um Sonho de Liberdade, com suas sinopses](img/fig-2-12-2.webp)

*A tabela preenchida com os filmes da base.*

Verifique também o seu Chrome Dev Tools. Ele deverá exibir as duas linhas (elementos `tr`) criadas, embora elas não existam no arquivo `index.html`. Veja a figura.

![Aba Elements do Chrome Dev Tools com o tbody expandido, mostrando dois elementos tr com suas células td destacados](img/fig-2-12-3.webp)

*As linhas criadas via Javascript aparecem na árvore DOM.*

Faça um novo teste com o Thunder Client, inserindo um novo filme, como na figura.

**Thunder Client · Body (Json)**

```json
{
  "titulo": "À Espera de um Milagre",
  "sinopse": "1935, no corredor da morte de uma prisão sulista. Paul Edgecomb (Tom Hanks) é o chefe de guarda da prisão, que temJohn Coffey (Michael Clarke Duncan) como um de seus prisioneiros. Aos poucos, desenvolve-se entre eles uma relação incomum, baseada na descoberta de que o prisioneiro possui um dom mágico que é, ao mesmo tempo, misterioso e milagroso."
}
```

![Thunder Client com a requisição POST para localhost:3000/filmes enviando À Espera de um Milagre e a resposta com a lista atualizada](img/fig-2-12-4.webp)

*Novo filme cadastrado pelo Thunder Client.*

Agora, recarregue a página no seu navegador e veja o resultado, que deve ser parecido com aquele exibido pela figura.

<aside class="positive">

**Nota.** Lembre-se que os dados da base ainda estão armazenados em meio volátil. Dependendo do momento em que você tiver reiniciado seu servidor ou feito as inserções, os resultados podem ser diferentes daqueles exibidos aqui, o que é natural.

</aside>

![Tabela de filmes com quatro linhas, incluindo À Espera de um Milagre e Vingadores: Ultimato](img/fig-2-12-5.webp)

*A tabela exibe os filmes recém-cadastrados.*

## Front End: cadastro de novos filmes
Duration: 15:00

### Botão e campos para o cadastro

Nesta seção, vamos permitir que o usuário cadastre novos filmes. Para isso, vamos adicionar dois campos para ele digitar o título e a sinopse do filme, além de um botão que, quando clicado, fará com que uma função entre em execução. Ela se encarrega de pegar os dados dos campos preenchidos pelo usuário e fazer uma requisição POST usando a axios. No arquivo `index.html`, adicione os elementos exibidos a seguir. Observe que adicionamos uma nova linha do Bootstrap para os três novos elementos. Por estarem na mesma "row", eles disputam espaço horizontalmente. Eles aparecem acima da tabela.

**front/index.html**

```html
…
<body onload="obterFilmes()">
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-4">
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="tituloInput" placeholder="Título do filme">
          <label for="tituloInput">Título do filme</label>
        </div>
      </div>
      <div class="col-md-8 col-lg-4">
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="sinopseInput" placeholder="Sinopse do filme">
          <label for="sinopseInput">Sinopse do filme</label>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <button class="btn btn-outline-primary w-100" onclick="cadastrarFilme()">Cadastrar</button>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <table class="table table-striped table-hover text-center filmes">
…
```

Observe que vinculamos a função `cadastrarFilme` ao botão mas ela não existe ainda. Vamos criá-la no arquivo `script.js`. Seu funcionamento será o seguinte:

* constrói a URL completa
* pega os campos `input` em que o usuário digita os dados dos filmes
* pega os dados dos filmes
* limpa os campos em que o usuário digitou
* envia os dados ao servidor
* remove os dados da tabela atual, na DOM, para que a nova coleção de filmes, atualizada, possa ser adicionada
* itera sobre a coleção de filmes atualizada, preenchendo a DOM

**front/js/script.js**

```javascript
…
async function cadastrarFilme(){
  //constrói a URL completa
  const URLCompleta = `${protocolo}${baseURL}${filmesEndpoint}`
  //pega os inputs que contém os valores que o usuário digitou
  let tituloInput = document.querySelector('#tituloInput')
  let sinopseInput = document.querySelector('#sinopseInput')
  //pega os valores digitados pelo usuário
  let titulo = tituloInput.value
  let sinopse = sinopseInput.value
  //limpa os campos que o usuário digitou
  tituloInput.value = ""
  sinopseInput.value = ""
  //envia os dados ao servidor (back end)
  const filmes = (await axios.post(URLCompleta, {titulo, sinopse})).data
  //limpa a tabela para preenchê-la com a coleção nova, atualizada
  let tabela = document.querySelector('.filmes')
  let corpoTabela = tabela.getElementsByTagName('tbody')[0]
  corpoTabela.innerHTML = ""
  for (let filme of filmes) {
    let linha = corpoTabela.insertRow(0)
    let celulaTitulo = linha.insertCell(0)
    let celulaSinopse = linha.insertCell(1)
    celulaTitulo.innerHTML = filme.titulo
    celulaSinopse.innerHTML = filme.sinopse
  }
}
```

No seu navegador, faça novos testes. Deve ser possível visualizar os novos filmes cadastrados.

### Alerta para campos vazios

Observe, porém, que o sistema permite o cadastro mesmo se o usuário deixar de digitar um dos campos ou mesmo os dois. Por essa razão, vamos adicionar um alerta inicialmente invisível que será exibido caso o usuário tente clicar no botão sem preencher pelo menos um dos campos. O método `cadastrarFilme` será ajustado da seguinte forma:

* se o usuário digitar os dois valores do filme, continua funcionando como antes
* se o usuário deixar de digitar pelo menos um dos campos
  * pega o elemento `alert` na árvore DOM
  * faz com que ele seja adicionado e exibido na DOM
  * configura um "timeout" de 2 segundos para que o alert seja removido da DOM e desapareça, caso o usuário não o feche antes desse tempo.

O código a seguir mostra a adição do alerta no arquivo `index.html`.

**front/index.html**

```html
…
<body onload="obterFilmes()">
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="d-none alert alert-danger alert-dismissible fade" role="alert">
          Preencha todos os campos.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-4">
        <div class="form-floating mb-3">
…
```

Será preciso importar o módulo Javascript do Bootstrap para que o alert funcione adequadamente. O código a seguir mostra como (o final do arquivo `index.html`).

**front/index.html**

```html
…
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script src="js/script.js"></script>
</body>
</html>
```

O código a seguir mostra a validação feita no método `cadastrarFilme`, arquivo `script.js`.

**front/js/script.js**

```javascript
…
async function cadastrarFilme(){
  const URLCompleta = `${protocolo}${baseURL}${filmesEndpoint}`
  let tituloInput = document.querySelector('#tituloInput')
  let sinopseInput = document.querySelector('#sinopseInput')
  let titulo = tituloInput.value
  let sinopse = sinopseInput.value
  // somente adiciona se o usuário tiver digitado os dois valores
  if (titulo && sinopse){
    tituloInput.value = ""
    sinopseInput.value = ""
    const filmes = (await axios.post(URLCompleta, { titulo, sinopse })).data
    let tabela = document.querySelector('.filmes')
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    corpoTabela.innerHTML = ""
    for (let filme of filmes) {
      let linha = corpoTabela.insertRow(0)
      let celulaTitulo = linha.insertCell(0)
      let celulaSinopse = linha.insertCell(1)
      celulaTitulo.innerHTML = filme.titulo
      celulaSinopse.innerHTML = filme.sinopse
    }
  }
  //senão, exibe o alerta por até 2 segundos
  else{
    let alert = document.querySelector('.alert')
    alert.classList.add('show')
    alert.classList.remove('d-none')
    setTimeout(() => {
      alert.classList.remove('show')
      alert.classList.add('d-none')
    }, 2000)
  }
}
```

## MongoDB e o Atlas
Duration: 15:00

### Armazenamento de dados em meio persistente

No momento, possuímos uma solução computacional composta por Front End e Back End. Estamos rumo ao desenvolvimento de uma aplicação **Full Stack**! Não temos, contudo, uma base de dados que permita o armazenamento de dados em meio persistente: nossos dados estão armazenados em uma coleção que fica na memória volátil alocada pelo sistema operacional e entregue ao NodeJS. Passaremos a utilizar o MongoDB para esse fim.

Uma definição para o MongoDB é a seguinte:

> **MongoDB**
>
> Uma base de dados NoSQL que armazena documentos organizados em coleções.

<aside class="positive">

**Nota.** Se você não conhece o modelo relacional e o padrão SQL, não se preocupe. Não é pré-requisito conhecê-los para lidar com o MongoDB.

</aside>

Fazendo uma analogia, os documentos seriam as linhas de uma tabela no modelo relacional. Uma coleção é análoga a uma tabela. É claro, sem as restrições e detalhes do modelo relacional.

A tabela a seguir mostra uma breve comparação entre bases SQL e NoSQL.

| Características | NoSQL | SQL |
| --- | --- | --- |
| Exemplos de sistemas gerenciadores de bancos de dados | MongoDB, HBase, Cassandra | MySQL, PostgreSQL, Microsoft SQL Server |
| Estrutura | Uma coleção pode armazenar documentos com estruturas diferentes. | Tabelas pré-definidas. |

### Uso do MongoDB com Atlas

Há algumas formas para se utilizar o MongoDB. Podemos fazer o download e executar localmente, por exemplo. Uma outra solução se chama **Atlas**. Trata-se de uma solução em nuvem gratuita que dá acesso a uma instância MongoDB remotamente. Neste material, utilizaremos a segunda opção.

Comece visitando [https://www.mongodb.com/](https://www.mongodb.com/). A seguir, clique em **Try Free**, como na figura.

![Barra superior do site do MongoDB com o botão Try Free destacado](img/fig-2-16-1.webp)

*Botão Try Free no site do MongoDB.*

Na tela seguinte, você deverá criar uma conta para você. Observe que também é possível fazer login com uma conta Google, caso deseje.

![Formulário Sign Up do MongoDB Atlas com nome, sobrenome, empresa, e-mail e senha, e as opções de cadastro com Google](img/fig-2-16-2.webp)

*Criação da conta no MongoDB Atlas.*

A tela seguinte explica que um e-mail de verificação foi enviado para você. A conta somente poderá ser utilizada caso você confirme o recebimento deste e-mail.

![Tela Great, now verify your email pedindo para verificar a caixa de entrada](img/fig-2-16-3.webp)

*Aviso de envio do e-mail de verificação.*

Visite a caixa de entrada do seu e-mail para visualizar a mensagem recebida e clicar no link nela existente, como na figura.

<aside class="positive">

**Nota.** É possível que a mensagem seja direcionada para o seu lixo eletrônico. Se necessário, não deixe de verificá-lo.

</aside>

![E-mail Email Address Verification do MongoDB com o botão Verify Email destacado](img/fig-2-16-4.webp)

*O e-mail de verificação.*

Você deverá ser direcionado para uma página parecida com aquela da figura. Clique em **Continue**.

![Tela Email successfully verified! com o botão Continue](img/fig-2-16-5.webp)

*E-mail verificado.*

Na tela seguinte, responda às perguntas e clique em **Finish**, como mostra a figura.

![Tela Welcome to Atlas! com perguntas sobre o objetivo, o tipo de aplicação e a linguagem preferida, e o botão Finish destacados](img/fig-2-16-6.webp)

*Questionário inicial do Atlas.*

Na tela seguinte, vamos criar um Cluster grátis. Basta clicar em **Create** (Starting at FREE).

![Tela Deploy a cloud database com as opções Serverless, Dedicated e Shared, com o botão Create da opção Shared FREE destacado](img/fig-2-16-7.webp)

*Escolha do cluster gratuito.*

O MongoDB nos permite escolher qual provedor de computação em nuvem será responsável por armazenar os nossos dados. Podemos escolher entre

* Amazon
* Google
* Microsoft

A escolha fica a seu critério. Neste material, vamos escolher o Google, armazenando os dados em São Paulo. Veja a figura.

<aside class="positive">

**Nota.** Se a opção escolhida agora não estiver disponível para você quando estiver realizando este passo a passo, não há problemas em escolher outra.

</aside>

![Tela Create a Shared Cluster com a opção Shared, o provedor Google Cloud, a região São Paulo e o botão Create Cluster destacados](img/fig-2-16-8.webp)

*Provedor Google Cloud e região São Paulo.*

Na tela a seguir, você deverá criar um usuário e senha. Esses são dados que a nossa aplicação (aquela que executa no NodeJS) utilizará para se conectar ao MongoDB. Observe que não são os mesmos dados que você utiliza para fazer login no site do MongoDB. Escolha usuário e senha e clique em **Create User**. Depois disso, adicione o ip `0.0.0.0` no campo **IP Address** e clique em **Add Entry**. Esse ip indica que o MongoDB admitirá requisições feitas a partir de hosts que tenham qualquer IP. Trata-se de um mecanismo de segurança que podemos utilizar para indicar, por exemplo, que o MongoDB somente deve atender requisições feitas a partir de nosso computador. Como estamos apenas realizando testes e aprendendo, vamos simplificar liberando todos os IPs.

![Tela de segurança do Atlas com os campos de usuário e senha, a opção My Local Environment e a lista de acesso com o IP 0.0.0.0 e o botão Add Entry destacados](img/fig-2-16-9.webp)

*Criação do usuário do banco e liberação de IPs.*

O botão **Finish and Close** deverá estar habilitado agora. Clique nele.

Na tela seguinte, clique em **Connect**. Ali poderemos encontrar as informações necessárias para que a nossa aplicação se conecte ao MongoDB.

![Página Database Deployments com o Cluster0 e o botão Connect destacado](img/fig-2-16-10.webp)

*O cluster criado e o botão Connect.*

A seguir, clique em **Connect your application**.

![Janela Connect to Cluster0 com a opção Connect your application destacada](img/fig-2-16-11.webp)

*Opção Connect your application.*

A seguir, copie o texto destacado na figura. Ele é chamado de **string de conexão** e contém as informações necessárias para que a nossa aplicação possa conversar com o MongoDB, como nome de usuário e senha, endereço do host etc. Depois, pode clicar em **Close**.

![Janela Connect to Cluster0 com o driver Node.js versão 4.1 or later e a string de conexão mongodb+srv com o botão de copiar destacado](img/fig-2-16-12.webp)

*A string de conexão.*

Abra o seu arquivo `index.js` e cole a string de conexão logo no começo. Deixe ela guardada ali por enquanto.

**index.js**

```javascript
//cole a sua string de conexão e deixe ela comentada aqui
//já já vamos utilizá-la no lugar certo
//mongodb+srv://<usuario>:<senha>@<seu-cluster>.mongodb.net/?retryWrites=true&w=majority
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
…
```

## Mongoose: conexão, cadastro e listagem
Duration: 15:00

### Usando o pacote Mongoose para acessar o MongoDB

Há um pacote chamado **mongoose** que torna simples o acesso a uma base de dados gerenciada pelo MongoDB. Ele pode ser instalado da seguinte forma. Execute o comando usando um terminal vinculado à raiz de seu projeto, a pasta em que se encontra o arquivo `package.json`.

**Terminal**

```bash
npm install mongoose
```

A seguir, vamos criar uma estrutura que descreve o que é um filme: um agrupamento de título e sinopse. No mongoose, ele é chamado de **schema**. Estamos no arquivo `index.js`.

**index.js**

```javascript
//cole a sua string de conexão e deixe ela comentada aqui
//já já vamos utilizá-la no lugar certo
//mongodb+srv://<usuario>:<senha>@<seu-cluster>.mongodb.net/?retryWrites=true&w=majority
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
app.use(cors())

const Filme = mongoose.model("Filme", mongoose.Schema({
  titulo: {type: String},
  sinopse: {type: String}
}))

let filmes = [
…
```

Agora a nossa aplicação precisa se conectar ao MongoDB para que filmes possam ser armazenados e obtidos. Vamos escrever uma função para isso. É agora que usamos a string de conexão. O código a seguir mostra a definição da função bem como a adaptação da chamada à função `listen` para que a conexão seja estabelecida assim que a aplicação entrar em funcionamento. Troque `<usuario>`, `<senha>` e `<seu-cluster>` pelos dados da string de conexão do seu próprio cluster, copiada no passo anterior.

**index.js**

```javascript
//pode tirar a sua string de conexão daqui agora
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
app.use(cors())

const Filme = mongoose.model("Filme", mongoose.Schema({
  titulo: {type: String},
  sinopse: {type: String}
}))

async function conectarAoMongoDB() {
  await mongoose.connect(`mongodb+srv://<usuario>:<senha>@<seu-cluster>.mongodb.net/?retryWrites=true&w=majority`)
}

let filmes = [
…
app.listen(3000, () => {
  try{
    conectarAoMongoDB()
    console.log("up and running")
  }
  catch (e){
    console.log('Erro', e)
  }
})
```

<aside class="negative">

Use a **sua** string de conexão, com o seu usuário, a sua senha e o endereço do seu cluster. Nunca publique a string com a senha real em repositórios ou sites.

</aside>

### Cadastrando filmes

Nesta seção, adaptaremos o endpoint de cadastro de filmes para que ele deixe de usar a base volátil e passe a usar a base gerenciada pelo MongoDB. Continuamos extraindo os dados da requisição, enviados pela aplicação cliente. Entretanto, substituímos a chamada à função `push` pelo método apropriado do mongoose: `save`. Depois disso, chamamos o método `find` do mongoose para obter a coleção completa. Ela é devolvida logo a seguir ao cliente, como antes.

**index.js**

```javascript
…
app.post("/filmes", async (req, res) => {
  //obtém os dados enviados pelo cliente
  const titulo = req.body.titulo
  const sinopse = req.body.sinopse
  //monta um objeto agrupando os dados. Ele representa um novo filme
  //a seguir, construímos um objeto Filme a partir do modelo do mongoose
  const filme = new Filme({titulo: titulo, sinopse: sinopse})
  //save salva o novo filme na base gerenciada pelo MongoDB
  await filme.save()
  const filmes = await Filme.find()
  res.json(filmes)
})
…
```

É possível que a aplicação cliente esteja apresentando algum erro no seu navegador. Atualize a página para obtê-la normalmente, como na figura.

![Aplicação de filmes com os campos Título do filme e Sinopse do filme, o botão Cadastrar e a tabela com dois filmes](img/fig-2-18-1.webp)

*A aplicação cliente atualizada.*

Vá em frente e cadastre um novo filme.

Visite a sua página no MongoDB. Como na figura, clique em **Browse Collections**.

![Página Database Deployments do Atlas com o botão Browse Collections do Cluster0 destacado](img/fig-2-18-2.webp)

*Botão Browse Collections.*

Se tudo deu certo, você deverá visualizar uma coleção chamada `filmes` e um documento com os dados (título e sinopse) do filme que você cadastrou.

![Aba Collections do Cluster0 com a coleção test.filmes selecionada e um documento com _id, titulo O Rei Leão e sinopse](img/fig-2-18-3.webp)

*O filme cadastrado na coleção filmes do MongoDB.*

Observe também a sua aplicação cliente, no navegador. Ela deverá exibir o filme que acabou de cadastrar, ignorando os demais, já que a lista foi construída em função daquilo que o MongoDB nos devolve.

![Aplicação de filmes exibindo apenas o filme O Rei Leão na tabela](img/fig-2-18-4.webp)

*A tabela exibe o que o MongoDB devolveu.*

### Obtendo os filmes a partir da base gerenciada pelo MongoDB

Nosso endpoint de obtenção da base ainda devolve a coleção que definimos localmente, em memória volátil. Vamos ajustar a sua implementação para que ela devolva a coleção existente no MongoDB.

**index.js**

```javascript
…
app.get("/filmes", async (req, res) => {
  const filmes = await Filme.find()
  res.json(filmes)
})
…
```

Atualize a aplicação cliente no navegador uma vez mais e observe que ela exibe os dados vindos do MongoDB.

![Aplicação de filmes carregada exibindo O Rei Leão, vindo do MongoDB](img/fig-2-19-1.webp)

*Os filmes agora vêm do MongoDB.*

Isso quer dizer que a coleção local, em memória volátil, já é desnecessária. Pode remover a sua definição.

**index.js**

```javascript
…
//pode apagar tudo isso
let filmes = [
  {
    titulo: "Forrest Gump - O Contador de Histórias",
    sinopse: "Quarenta anos da história dos Estados Unidos, vistos pelos olhos de Forrest Gump (Tom Hanks), um rapaz com QI abaixo da média e boas intenções."
  },
  {
    titulo: "Um Sonho de Liberdade",
    sinopse: "Em 1946, Andy Dufresne (Tim Robbins), um jovem e bem sucedido banqueiro, tem a sua vida radicalmente modificada ao ser condenado por um crime que nunca cometeu, o homicídio de sua esposa e do amante dela"
  }
]
//até aqui
…
```

## Renomeando arquivos
Duration: 4:00

Nossa solução computacional Full Stack possui dois arquivos Javascript: `script.js` e `index.js`. O primeiro executa do lado do cliente (Front End) e o segundo executa do lado do servidor (Back End). Para tornar os nomes mais intuitivos, vamos renomeá-los para `frontend.js` e `backend.js`, respectivamente. Veja o resultado na figura.

![Explorador do VS Code com front/js/frontend.js e backend.js na raiz destacados](img/fig-2-20-1.webp)

*Os arquivos renomeados.*

Agora precisamos ajustar alguns arquivos que ainda fazem referência aos nomes antigos. O primeiro será o `package.json`.

**package.json**

```json
{
  "name": "html_node_mongodb",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon backend.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "nodemon": "^2.0.20"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.1",
    "mongoose": "^6.6.5"
  }
}
```

Depois disso, se o seu servidor estiver em execução, será preciso reiniciá-lo. Aperte CTRL+C (duplo, se precisar) no terminal em que ele se encontra em execução e digite `npm start` novamente.

Ajustamos também o arquivo `index.html`, pois ele importa o arquivo Javascript do Front End ainda utilizando o seu nome antigo.

**front/index.html**

```html
…
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script src="js/frontend.js"></script>
</body>
</html>
```

## Back End: cadastro de usuários
Duration: 20:00

Nesta seção, possibilitamos que os usuários finais se cadastrem na aplicação a fim de que, a seguir, possam fazer login para acessar os recursos da aplicação, especialmente o cadastro de filmes. A listagem de filmes será liberada.

Começamos pelo cadastro. A figura mostra o que acontece quando o usuário tenta realizar um cadastro válido. Ela também ilustra que tomamos o cuidado de criptografar a senha antes de armazená-la. Observe que, a partir de agora, optamos por desabilitar o botão de cadastro de novos filmes. Ele será habilitado apenas para usuários que fizerem login no sistema.

![Diagrama do cenário de cadastro válido: o Front End envia login e senha ao Back End, que criptografa a senha e a armazena no MongoDB, e a interface confirma o cadastro](img/fig-2-21-1.webp)

*Cenário em que o usuário tenta fazer cadastro válido.*

A figura a seguir, por sua vez, ilustra o que acontece quando o usuário tenta fazer um cadastro inválido: talvez utilizando um login que já existe.

![Diagrama do cenário de cadastro inválido: o login já existe no MongoDB, o Back End responde com erro e o Front End exibe uma mensagem](img/fig-2-21-2.webp)

*Cenário em que o usuário tenta realizar um cadastro inválido.*

### Mongoose: plugin para validação de usuários únicos

Quando tentamos cadastrar um usuário repetido na base gerenciada pelo MongoDB, ele não permite que isso aconteça. Entretanto, essa validação somente acontece quando enviamos a requisição para cadastro de fato, com o método `save`. Agora vamos aprender como podemos utilizar um plugin para a Mongoose que faz essa validação antes de o método `save` ser chamado. Se desejar saber um pouco mais sobre ele, visite [https://www.npmjs.com/package/mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator).

Para utilizá-lo, faça a sua instalação com

**Terminal**

```bash
npm install mongoose-unique-validator
```

A seguir, vamos criar um modelo que descreve o que é um usuário. Já aproveitamos para aplicar o plugin que acabamos de instalar.

**backend.js**

```javascript
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const app = express()
app.use(express.json())
app.use(cors())

const Filme = mongoose.model("Filme", mongoose.Schema({
  titulo: {type: String},
  sinopse: {type: String}
}))

const usuarioSchema = mongoose.Schema({
  login: {type: String, required: true, unique: true},
  password: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)
…
```

Com o modelo pronto, podemos fazer a implementação do endpoint que cadastra usuários na base.

**backend.js**

```javascript
…
app.post("/filmes", async (req, res) => {
  //obtem os dados enviados pelo cliente
  const titulo = req.body.titulo
  const sinopse = req.body.sinopse
  //monta um objeto agrupando os dados. Ele representa um novo filme
  //a seguir, construímos um objeto Filme a partir do modelo do mongoose
  const filme = new Filme({titulo: titulo, sinopse: sinopse})
  //save salva o novo filme na base gerenciada pelo MongoDB
  await filme.save()
  const filmes = await Filme.find()
  res.json(filmes)
})

app.post('/signup', async (req, res) => {
  const login = req.body.login
  const password = req.body.password
  const usuario = new Usuario({
    login: login,
    password: password
  })
  const respMongo = await usuario.save()
  console.log(respMongo)
  res.end()
})
…
```

<aside class="negative">

Na apostila, a rota aparece como `'/signup,` (sem a aspa de fechamento). O correto é `'/signup'`, como no bloco acima.

</aside>

No Thunder Client, faça o teste da figura: uma requisição **POST** para `localhost:3000/signup` com o corpo a seguir. Observe que se você tentar enviar duas requisições com o mesmo usuário, a segunda resultará em erro.

**Thunder Client · Body (Json)**

```json
{
  "login": "admin",
  "password": "admin"
}
```

![Thunder Client com a requisição POST para localhost:3000/signup, o corpo com login admin e password admin, e a resposta 200 OK](img/fig-2-21-3.webp)

*Cadastro de usuário pelo Thunder Client.*

No terminal em que está em execução o servidor responsável pelo seu Back End, o resultado da primeira requisição deve ser parecido com aquele que a figura exibe.

![Terminal exibindo up and running e o documento salvo com login admin, password admin, _id ObjectId e __v 0](img/fig-2-21-4.webp)

*O documento salvo, exibido no terminal do servidor.*

Envie a mesma requisição mais uma vez, sem alterar coisa alguma. O resultado agora deve ser parecido com aquele da figura.

![Terminal exibindo o erro de validação Error, expected login to be unique. Value: admin, com kind unique e _message Usuario validation failed](img/fig-2-21-5.webp)

*Erro de validação: o login precisa ser único.*

Investigue cada trecho da mensagem de erro. Como bom desenvolvedor, você sempre analisa as mensagens de erro em busca de explicações antes mesmo de procurar no Google. Depois, se não der certo, você busca na documentação oficial. Por fim, você busca no Google, eventualmente em busca de bons posts no StackOverflow. Mas isso só acontece horas depois de ter tentado entender a mensagem de erro por conta e lendo a documentação oficial.

Visite a página oficial do MongoDB, em [https://www.mongodb.com/](https://www.mongodb.com/). Faça login e encontre uma tela parecida com aquela que a figura exibe.

![Página Database Deployments do Atlas com o botão Browse Collections destacado](img/fig-2-21-7.webp)

*Página do cluster no Atlas.*

Clique em **Browse Collections**. Observe que você possui uma coleção chamada `usuarios`. Nela deve existir um documento com os dados do usuário que você cadastrou, como mostra a figura.

![Coleção test.usuarios selecionada, com um documento contendo login admin e password admin em texto puro](img/fig-2-21-8.webp)

*O usuário armazenado na coleção usuarios.*

### Criptografando a senha antes de armazená-la no banco

O que desejamos agora é criptografar a senha antes de armazená-la no banco. Assim, nem mesmo funcionários que tenham acesso direto à base serão capazes de visualizar a senha dos usuários. Essa é uma medida de segurança muito comum e indispensável. Para fazer a criptografia, vamos usar o pacote **bcrypt**. Se desejar saber mais sobre ele, visite [https://www.npmjs.com/package/bcrypt](https://www.npmjs.com/package/bcrypt).

Faça a sua instalação com

**Terminal**

```bash
npm install bcrypt
```

Feita a sua instalação, utilizaremos seu método `hash` para gerar a senha criptografada. Observe que ele opera sobre o texto a ser criptografado e um número (10 neste exemplo). Esse número é o **salt round** do algoritmo de criptografia. De maneira resumida, ele representa um "fator de custo" e o resultado obtido varia da seguinte forma:

* quanto maior for o valor de salt round, mais tempo o processo de criptografia levará e, por outro lado, mais difícil a criptografia será de se "quebrar à força bruta".
* quanto menor for o valor de salt round, menor o tempo para que o valor criptografado seja gerado e, por outro lado, menos segura a criptografia será.

**backend.js**

```javascript
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const app = express()
app.use(express.json())
app.use(cors())
…
app.post('/signup', async (req, res) => {
  const login = req.body.login
  const password = req.body.password
  const criptografada = await bcrypt.hash(password, 10)
  const usuario = new Usuario({
    login: login,
    password: criptografada
  })
  const respMongo = await usuario.save()
  console.log(respMongo)
  res.end()
})
```

### Tratando erros com try/catch

Observe que quando um erro acontece, embora exibamos uma mensagem no console do servidor, o resultado sendo enviado ao cliente representa que tudo deu certo. Vamos ajustar isso com uma estrutura **try/catch**. Como o nome sugere, vamos tentar executar o fluxo principal (especificado no bloco `try`), em que o usuário é salvo com sucesso. Se algo der errado, capturamos o erro, deixamos de executar o fluxo principal e passamos a executar um fluxo alternativo, especificado no bloco `catch`. Repare como passamos a especificar os códigos HTTP mais apropriados para cada caso:

* **201 Created** quando o usuário for cadastrado com sucesso
* **409 Conflict** quando não for possível cadastrar

**backend.js**

```javascript
…
app.post('/signup', async (req, res) => {
  try {
    const login = req.body.login
    const password = req.body.password
    const criptografada = await bcrypt.hash(password, 10)
    const usuario = new Usuario({
      login: login,
      password: criptografada
    })
    const respMongo = await usuario.save()
    console.log(respMongo)
    res.status(201).end()
  } catch (error) {
    console.log(error)
    res.status(409).end()
  }
})
…
```

Tente cadastrar mais um usuário ainda utilizando o login utilizado previamente. O resultado deve ser parecido com aquele da figura.

![Thunder Client com a requisição POST para localhost:3000/signup com login admin e a resposta 409 Conflict destacada](img/fig-2-21-9.webp)

*Login repetido: status 409 Conflict.*

Agora faça nova tentativa como mostra a figura, alterando o login. Veja que o cadastro é feito corretamente e o cliente (Thunder Client) recebe o código apropriado.

**Thunder Client · Body (Json)**

```json
{
  "login": "novoadmin",
  "password": "admin"
}
```

![Thunder Client com a requisição POST para localhost:3000/signup usando outro login, novoadmin, e a resposta 201 Created destacada](img/fig-2-21-10.webp)

*Novo login: status 201 Created.*

Visite a sua página no MongoDB e observe o novo usuário cadastrado. Repare que a senha agora está criptografada.

![Coleção test.usuarios com o novo documento, cuja senha aparece como um hash do bcrypt](img/fig-2-21-11.webp)

*A senha armazenada já criptografada.*

## Back End: login com JWT
Duration: 20:00

### Endpoint para login: produzindo e devolvendo um token JWT

Quando o usuário tentar fazer login, vamos realizar uma consulta na base para verificar se se trata de um usuário autêntico. Para fazer a comparação, além de encontrá-lo na base, teremos de descriptografar a senha para viabilizar a comparação. Dependendo do resultado, devolveremos um token JWT (mais sobre isso a seguir) ao Front End e um status de resposta que indica que o login foi feito com sucesso.

Quando o login dá certo, portanto, o funcionamento é o seguinte:

* usuário digita login e senha válidos e clica em Login
* Back End recebe a requisição e pergunta ao MongoDB se o usuário existe na base
* MongoDB responde que sim
* Back End produz um token JWT e devolve ao Front End
* Front End habilita o cadastro de filmes e o botão de Login se torna um botão de Logoff.
* Front End armazena o token no **LocalStorage**, memória persistente gerenciada pelo navegador.

![Diagrama do login com usuário e senha válidos: o Back End consulta o MongoDB, gera o token JWT e o devolve; o Front End habilita o cadastro de filmes e guarda o token no LocalStorage](img/fig-2-21-12.webp)

*Cenário em que o usuário faz login com um par usuário/senha válido.*

Por outro lado, quando o login falha, o funcionamento é o seguinte:

* usuário digita login e senha e clica em Login
* Back End recebe a requisição e pergunta ao MongoDB se o usuário existe na base
* MongoDB responde que não
* Back End devolve resposta com status indicando que o login não aconteceu
* Front End mantém cadastro de filmes desabilitado. Botão de login permanece exibindo texto Login.
* Front End exibe uma mensagem de erro para o usuário
* O login não foi feito e, portanto, nenhum token foi gerado.

![Diagrama do login com par usuário/senha inválido: o Back End responde com erro, o Front End mantém o cadastro de filmes desabilitado e nada é armazenado no LocalStorage](img/fig-2-21-13.webp)

*Cenário em que o usuário tenta fazer login com um par usuário/senha inválido.*

Agora começamos a implementação no Back End. Se as senhas não forem iguais, devolvemos um código **401 (Unauthorized)** ao cliente e encerramos o atendimento da requisição por ali.

**backend.js**

```javascript
…
app.post('/signup', async (req, res) => {
  …
})

app.post('/login', async (req, res) => {
  //login/senha que o usuário enviou
  const login = req.body.login
  const password = req.body.password
  //tentamos encontrar no MongoDB
  const u = await Usuario.findOne({login: req.body.login})
  if(!u){
    //senão foi encontrado, encerra por aqui com código 401
    return res.status(401).json({mensagem: "login inválido"})
  }
  //se foi encontrado, comparamos a senha, após descriptográ-la
  const senhaValida = await bcrypt.compare(password, u.password)
  if (!senhaValida){
    return res.status(401).json({mensagem: "senha inválida"})
  }
  //deixa assim por enquanto, já já arrumamos
  res.end()
})
…
app.listen(3000, () => {
…
```

Para testar, comece verificando se seu servidor está em execução. Se não estiver, use `npm start` para colocá-lo em funcionamento.

A seguir, visite a sua página no MongoDB e apague todos os usuários cadastrados por lá. Assim não tem perigo de tentarmos utilizar um usuário com senha não criptografada ou com dados desatualizados, incompatíveis com a versão atual do app. Veja a figura. Basta clicar na latinha de lixo (passe o mouse por cima do nome da coleção se ela não estiver aparecendo) e, no pop-up que aparecer, digitar o nome da coleção e confirmar.

![Página Collections do Atlas com a coleção usuarios e o ícone de lixeira destacado](img/fig-2-21-14.webp)

*Apagando a coleção usuarios.*

Agora, use o Thunder Client para fazer novo cadastro de usuário como na figura (POST para `localhost:3000/signup` com login `admin` e senha `admin`).

![Thunder Client com a requisição POST para localhost:3000/signup, corpo com login admin e password admin e a resposta 201 Created](img/fig-2-21-15.webp)

*Novo cadastro do usuário admin.*

Depois de enviar a requisição, visite a sua página no MongoDB mais uma vez para verificar que o usuário foi de fato criado.

![Coleção test.usuarios com o documento do usuário admin e a senha criptografada](img/fig-2-21-16.webp)

*O usuário recriado no MongoDB.*

Para testar o login, use o Thunder Client novamente. Como mostra a figura, o código de resposta deve ser **200 OK** caso o login seja realizado com sucesso. Neste caso, utilizamos login e senha corretos.

![Thunder Client com a requisição POST para localhost:3000/login com login admin e password admin, e a resposta 200 OK](img/fig-2-21-17.webp)

*Login correto: 200 OK.*

A figura a seguir mostra que o código deve ser **401 Unauthorized**, caso utilizemos um par login/senha inválido. Neste exemplo, utilizamos uma senha incorreta de propósito.

**Thunder Client · Body (Json)**

```json
{
  "login": "admin",
  "password": "123456"
}
```

![Thunder Client com a requisição POST para localhost:3000/login com senha 123456, a resposta 401 Unauthorized e o corpo mensagem senha inválida](img/fig-2-21-18.webp)

*Senha incorreta: 401 Unauthorized.*

### Produção do JWT e entrega dele ao cliente

Uma vez que um login tenha sido realizado com sucesso, o servidor produzirá um **JSON Web Token (JWT)**. Trata-se de uma sequência de caracteres que pode codificar informações quaisquer. O detentor deste token estará autorizado a realizar operações junto ao servidor. Um JWT pode codificar informações como

* tempo de expiração
* id do usuário
* login do usuário

e qualquer outra informação de interesse.

O primeiro passo é instalar um pacote que viabilize o seu uso. Neste material, vamos utilizar o pacote **jsonwebtoken**. Ele pode ser instalado com

**Terminal**

```bash
npm install jsonwebtoken
```

<aside class="positive">

**Nota.** Se quiser saber mais detalhes técnicos sobre JWTs, visite [https://www.rfc-editor.org/rfc/rfc7519](https://www.rfc-editor.org/rfc/rfc7519) e [https://jwt.io/](https://jwt.io/).

</aside>

A produção do JWT é feita com o método `sign`. A ele entregaremos as seguintes informações:

* Um objeto contendo o e-mail do usuário
* Uma senha de conhecimento apenas do servidor
* Um objeto contendo informações sobre o tempo de validade do token.

**backend.js**

```javascript
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
…
app.post('/login', async (req, res) => {
  //login/senha que o usuário enviou
  const login = req.body.login
  const password = req.body.password
  //tentamos encontrar no MongoDB
  const u = await Usuario.findOne({login: req.body.login})
  if(!u){
    //senão foi encontrado, encerra por aqui com código 401
    return res.status(401).json({mensagem: "login inválido"})
  }
  //se foi encontrado, comparamos a senha, após descriptográ-la
  const senhaValida = await bcrypt.compare(password, u.password)
  if (!senhaValida){
    return res.status(401).json({mensagem: "senha inválida"})
  }
  //aqui vamos gerar o token e devolver para o cliente
  const token = jwt.sign(
    {login: login},
    //depois vamos mudar para uma chave secreta de verdade
    "chave-secreta",
    {expiresIn: "1h"}
  )
  res.status(200).json({token: token})
})
…
```

Faça um novo teste como na figura para obter o token.

![Thunder Client com a requisição POST para localhost:3000/login com login admin, a resposta 200 OK e o corpo com o campo token contendo um JWT](img/fig-2-21-19.webp)

*O token JWT devolvido pelo login.*

É interessante executar esse teste mais algumas vezes (apenas clique em **Send** mais algumas vezes) e observar que, a cada execução, o token é diferente. Ou seja, senhas iguais podem ter código hash diferente, o que é muito importante para a segurança do sistema.

## Front End: barra de navegação
Duration: 12:00

Nesta seção, vamos adicionar uma barra de navegação do Bootstrap para disponibilizar as opções de cadastro de usuário e controle de login. Para saber mais sobre barras de navegação e conhecer diversas sugestões da documentação oficial, visite [https://getbootstrap.com/docs/5.2/components/navbar/](https://getbootstrap.com/docs/5.2/components/navbar/).

As classes do Bootstrap que utilizaremos são as seguintes:

* `navbar`: ajustes de cores, display, padding etc.
* `navbar-expand-md`: se a tela for pelo menos média, a barra de navegação aparece por completo e botão hambúrguer desaparece.
* `bg-light`: cor de fundo (bg=background) igual a light (nome de cor que depende do tema)
* `navbar-brand`: padding, margem, cor etc. Aplicado ao logo da aplicação
* `navbar-toggler`: padding, fonte, cor aplicados ao botão hambúrguer
* `navbar-toggler-icon`: define a aparência do botão hambúrguer
* `collapse`: aplicada ao elemento que sofrerá o efeito "toggle" do botão
* `navbar-collapse`: aplicada ao elemento que sofrerá o efeito "toggle" do botão
* `navbar-nav`: display, padding, margin, remoção dos "bullets" de seus itens
* `nav-link`: display, padding, fonte etc.

Pensando em acessibilidade, também faremos uso da especificação **WAI-ARIA**, da seguinte forma:

* `aria-controls`: aplicada ao botão, indica que ele controla o elemento de id igual a `myNav`
* `aria-expanded`: explica se a barra está expandida ou não
* `aria-label`: descrição textual sobre o elemento
* `aria-current`: aplicado ao elemento "ativo" no momento

<aside class="positive">

**Nota.** Lembre-se que os atributos aria não causam efeito visual algum. Como diz a documentação oficial da especificação, eles desempenham o papel de CSS para pessoas com deficiência visual. Explicamos textualmente as características das páginas que as pessoas com deficiência não podem ver.

</aside>

No arquivo `index.html`, começamos especificando um novo container apenas para a barra de navegação. Nesta construção, desejamos que ela tenha a mesma largura da tela principal. Assim, o container a engloba.

**front/index.html**

```html
…
<body onload="obterFilmes()">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
      </div>
    </div>
  </div>
  <div class="container mt-5">
…
```

A seguir, adicionamos o "logo" (apenas o texto "Filmes") da aplicação e o botão que será responsável por contrair e expandir a barra de navegação.

**front/index.html**

```html
…
<body onload="obterFilmes()">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <nav class="navbar navbar-expand-md bg-light">
          <a class="navbar-brand" href="#">Filmes</a>
          <button class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#myNav"
            aria-controls="myNav" aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </nav>
      </div>
    </div>
  </div>
  <div class="container mt-5">
…
```

O resultado esperado para telas que não sejam pelo menos médias (768px) é aquele exibido pela figura. Observe que há um botão "hambúrguer" que, quando clicado, promete expandir uma coleção de itens que ainda não foram especificados. Por isso, um clique nesse botão agora nenhum efeito vai causar.

![Tela estreita com a barra de navegação mostrando Filmes à esquerda e o botão hambúrguer à direita, acima dos campos de cadastro](img/fig-2-22-1.webp)

*Barra de navegação em tela pequena, com o botão hambúrguer.*

Aumente um pouco a largura da janela do navegador, até que ela se torne pelo menos média. Como ainda não temos o menu de opções, o botão hambúrguer desaparece e nada mais é exibido.

![Tela média com a barra de navegação exibindo apenas Filmes, sem o botão hambúrguer](img/fig-2-22-2.webp)

*Em telas médias, o botão hambúrguer desaparece.*

Assim, especificamos a `div` que será contraída e expandida quando o botão hambúrguer for clicado. Ela contém a coleção de itens de interesse, cada qual representando uma opção na barra de navegação.

**front/index.html**

```html
…
</head>
<body onload="obterFilmes()">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <nav class="navbar navbar-expand-md bg-light">
          <a class="navbar-brand" href="#">Filmes</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#myNav"
            aria-controls="myNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="myNav">
            <div class="navbar-nav ms-auto">
              <a class="nav-link active me-2"
                aria-current="page" href="#">
                Login
              </a>
              <a class="nav-link active me-2" href="#">
                Novo usuário
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
  <div class="container mt-5">
…
```

<aside class="negative">

Na apostila, este trecho tem um `</div>` a mais logo antes de `<div class="container mt-5">`. Ele foi removido acima para que a estrutura fique equilibrada.

</aside>

Para telas que não sejam pelo menos médias, o resultado esperado é o mesmo: o botão hambúrguer continua sendo exibido. Entretanto, quando ele for clicado, o resultado obtido deve se parecer com aquele da figura. Ou seja, um clique no botão deve expandir o menu de opções. Um segundo clique deve contraí-lo.

![Tela estreita com o menu expandido pelo botão hambúrguer, mostrando os itens Login e Novo usuário](img/fig-2-22-3.webp)

*Menu expandido pelo botão hambúrguer.*

Para telas pelo menos médias, o resultado esperado é aquele da figura. Observe que o botão hambúrguer já não é exibido e o menu de opções fica sempre visível. O entendimento é que telas pelo menos médias têm espaço suficiente para exibir as opções ao usuário de modo que a sua interação com a página seja confortável. Cabe ao desenvolvedor decidir as medidas mais apropriadas (quando exibir as opções de maneira incondicional, por exemplo), o que é feito em função da natureza da aplicação, número de opções a serem exibidas etc.

![Tela média com a barra de navegação exibindo Login e Novo usuário à direita](img/fig-2-22-4.webp)

*Em telas médias, as opções ficam sempre visíveis.*

## Front End + Back End: cadastro de usuários
Duration: 25:00

Permitamos, a partir de agora, que usuários se cadastrem utilizando a interface gráfica produzida, integrada ao Back End. O cadastro será realizado junto ao endpoint `host:porta/signup`. Isso quer dizer que host e porta são de interesse para todas as nossas funções de acesso ao Back End, como aquela que cadastra os filmes, essa outra que cadastrará novos usuários e assim por diante. A parte final do endereço (`/filmes`, `/signup` etc.) é específica de cada função. Por isso, vamos começar ajustando o arquivo `frontend.js` como a seguir. Observe que o trecho `"/filmes"` passa a existir apenas no contexto das funções de obtenção e cadastro de filmes.

**front/js/frontend.js**

```javascript
const protocolo = 'http://'
const baseURL = 'localhost:3000'
// não deve existir mais aqui
//const filmesEndpoint = '/filmes'

async function obterFilmes() {
  //existe aqui
  const filmesEndpoint = '/filmes'
  const URLCompleta = `${protocolo}${baseURL}${filmesEndpoint}`
  …
}
…
async function cadastrarFilme() {
  //aqui também
  const filmesEndpoint = '/filmes'
  const URLCompleta = `${protocolo}${baseURL}${filmesEndpoint}`
  …
}
```

### O modal de cadastro

Quando o usuário clicar em "Novo usuário", a aplicação exibirá um **modal** do Bootstrap que permitirá que ele digite os valores de login e senha e clique num botão para fazer a requisição. Se quiser saber mais sobre os modais do Bootstrap, visite [https://getbootstrap.com/docs/5.2/components/modal/](https://getbootstrap.com/docs/5.2/components/modal/).

As classes Bootstrap que utilizaremos são as seguintes:

* `modal`: básica, aplicada a todos os modais, controla margem, padding, cores etc.
* `fade`: efeito de aparição e desaparecimento
* `modal-dialog`: controla a posição e largura
* `modal-content`: controla alinhamento, largura, cores etc. do conteúdo do modal
* `modal-header`: alinhamento do cabeçalho do modal
* `modal-title`: margem e altura da linha do título do modal
* `fs-5`: tamanho da fonte (1.25rem)
* `modal-body`: posição, alinhamento e padding do corpo do modal
* `modal-footer`: alinhamento, borda, cor etc. do rodapé do modal

Observe que um modal é definido de maneira completamente independente do restante da página. Num primeiro momento ele sequer é visível e apenas aparece quando acionado explicitamente, possivelmente por um clique em um botão. A documentação sugere que definamos nossos modais logo no começo da página.

**front/index.html**

```html
…
<body onload="obterFilmes()">
  <div class="modal fade" id="modalCadastro"
    aria-labelledby="modalCadastro" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Cadastro de usuário</h1>
        </div>
        <div class="modal-body">
        </div>
        <div class="modal-footer">
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <nav class="navbar navbar-expand-md bg-light">
…
```

Desejamos fazer com que o modal apareça quando o link "Novo usuário" for clicado. Para tal, vamos usar os seguintes atributos.

* `data-bs-toggle=modal`: acionar o modal
* `data-bs-target=#modalCadastro`: id do modal a ser acionado.

Eles são aplicados ao link "Novo usuário" da barra de navegação.

**front/index.html**

```html
…
<nav class="navbar navbar-expand-md bg-light">
  <a class="navbar-brand" href="#">Filmes</a>
  <button class="navbar-toggler" type="button"
    data-bs-toggle="collapse" data-bs-target="#myNav"
    aria-controls="myNav" aria-expanded="false"
    aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="myNav">
    <div class="navbar-nav ms-auto">
      <a class="nav-link active me-2" aria-current="page"
        href="#">Login</a>
      <a class="nav-link active me-2"
        data-bs-toggle="modal"
        data-bs-target="#modalCadastro"
        href="#">
        Novo usuário
      </a>
    </div>
  </div>
</nav>
…
```

Como mostra a figura, temos a esperança de clicar no link "Novo usuário" e visualizar o modal.

![Modal Cadastro de usuário aberto sobre a página, ainda sem campos, após clicar em Novo usuário](img/fig-2-23-1.webp)

*O modal de cadastro, ainda vazio.*

O corpo do modal terá um alert que somente será exibido depois de a interação do usuário acontecer, ou seja, depois de ele clicar em cadastrar no modal. Além disso, também terá um `form` com controles nos quais o usuário poderá digitar o novo login e senha associada.

<aside class="positive">

**Nota.** A classe `alert-modal-cadastro` é nossa, não é do Bootstrap. Ela somente servirá de seletor para fazermos referência ao alert em Javascript, quando necessário.

</aside>

**front/index.html**

```html
<div class="modal fade" id="modalCadastro" aria-labelledby="modalCadastro" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5">
          Cadastro de usuário
        </h1>
      </div>
      <div class="modal-body">
        <div class="d-none alert alert-dismissible fade
          alert-modal-cadastro" role="alert">
        </div>
        <form>
          <div class="mb-3">
            <label for="usuarioCadastroInput"
              class="col-form-label">Usuário</label>
            <input type="text" id="usuarioCadastroInput"
              class="form-control">
          </div>
          <div class="mb-3">
            <label for="passwordCadastroInput"
              class="col-form-label">Senha</label>
            <input type="password" id="passwordCadastroInput"
              class="form-control">
          </div>
        </form>
      </div>
      <div class="modal-footer">
      </div>
    </div>
  </div>
</div>
```

Clicar em "Novo usuário" deve resultar em algo parecido com aquilo que a figura exibe.

![Modal Cadastro de usuário com os campos Usuário e Senha](img/fig-2-23-2.webp)

*O modal com os campos de usuário e senha.*

Por fim, o rodapé do modal terá dois botões. Um para fazer o cadastro e outro para cancelar.

**front/index.html**

```html
…
<div class="modal-footer">
  <button type="button" class="btn btn-secondary"
    data-bs-dismiss="modal">
    Cancelar
  </button>
  <button onclick="cadastrarUsuario()" type="button"
    class="btn btn-primary">
    Cadastrar
  </button>
</div>
…
```

Clique novamente em "Novo usuário" para obter o resultado da figura.

![Modal Cadastro de usuário com os campos Usuário e Senha e os botões Cancelar e Cadastrar no rodapé](img/fig-2-23-3.webp)

*O modal completo, com os botões Cancelar e Cadastrar.*

### A função cadastrarUsuario

Observe que há uma função chamada `cadastrarUsuario` associada ao evento `onclick` do botão de cadastro. Passemos a defini-la, o que será feito no arquivo `frontend.js`. Começamos pegando referências aos elementos `input` da árvore DOM que supostamente contém os dados digitados pelo usuário. A seguir, deles extraímos os dados de fato e já aproveitamos para fazer o seguinte tratamento:

* se ambos existirem, faremos algo em breve
* caso contrário, exibimos um alert vermelho instruindo o usuário a digitar ambos

**front/js/frontend.js**

```javascript
…
async function cadastrarUsuario(){
  let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput')
  let passwordCadastroInput = document.querySelector('#passwordCadastroInput')
  let usuarioCadastro = usuarioCadastroInput.value
  let passwordCadastro = passwordCadastroInput.value
  if (usuarioCadastro && passwordCadastro) {
    //já já faremos algo
  }
  else{
    let alert = document.querySelector('.alert-modal-cadastro')
    alert.innerHTML = "Preencha todos os campos"
    alert.classList.add('show', 'alert-danger')
    alert.classList.remove('d-none')
    setTimeout(() => {
      alert.classList.remove('show')
      alert.classList.add('d-none')
    }, 2000)
  }
}
```

Clique em "Novo usuário" e "Cadastrar" sem digitar coisa alguma. Veja o resultado esperado na figura. A esperança é que o alerta vermelho desapareça automaticamente depois de dois segundos.

![Modal Cadastro de usuário exibindo o alerta vermelho Preencha todos os campos](img/fig-2-23-4.webp)

*Alerta exibido quando os campos estão vazios.*

O próximo passo é realizar a requisição destinada ao Back End. Uma vez feita a requisição e recebida a resposta, precisamos verificar seu status. Lembre-se que a resposta pode ter um de dois status:

* **201**: usuário criado com sucesso
* **409**: usuário não pôde ser criado

Se obtivermos uma resposta com status igual a 201, isso significa que o fluxo principal de execução foi concluído com sucesso. Caso contrário, um fluxo alternativo de execução deverá entrar em execução, no qual explicamos o que deve ser executado pelo fato de o principal ter falhado. Estamos falando da conhecida estrutura **try/catch**:

* O fluxo principal de execução é todo especificado no bloco `try`. Ou seja, tentamos executá-lo pois sabemos que ele envolve instruções que podem causar erros.
* O bloco `catch` fica responsável por representar o fluxo alternativo de execução. Caso um erro seja detectado em uma das linhas do bloco `try`, a partir dali nenhuma outra linha dele é executada e pulamos imediatamente para o bloco `catch`. Ali fazemos o tratamento do erro.

No código a seguir utilizamos a construção try/catch e especificamos o fluxo principal de execução no `try`, que consiste em

* limpar os campos em que o usuário digitou login e senha
* exibir um alerta verde indicando que o cadastro foi feito com sucesso
* depois de dois segundos o alerta desaparece
* depois de dois segundos o modal também desaparece

**front/js/frontend.js**

```javascript
if (usuarioCadastro && passwordCadastro) {
  try{
    const cadastroEndpoint = '/signup'
    const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
    await axios.post(
      URLCompleta,
      { login: usuarioCadastro, password: passwordCadastro }
    )
    usuarioCadastroInput.value = ""
    passwordCadastroInput.value = ""
    let alert = document.querySelector('.alert-modal-cadastro')
    alert.innerHTML = "Usuário cadastrado com sucesso!"
    //alert-success significa que o alerta é verde para esse tema
    alert.classList.add('show', 'alert-success')
    //alert-danger significa que o alerta é vermelho para esse tema
    alert.classList.remove('d-none', 'alert-danger')
    setTimeout(() => {
      alert.classList.remove('show')
      alert.classList.add('d-none')
      let modalCadastro = bootstrap.Modal.getInstance(document.querySelector('#modalCadastro'))
      modalCadastro.hide()
    }, 2000)
  }
  catch(error){
    //daqui a pouco fazemos esse
  }
}
else{
…
```

Faça um novo teste:

* Clique em Novo usuário
* Preencha os campos para cadastrar um novo usuário
* Clique em Cadastrar

![Modal Cadastro de usuário preenchido com o usuário joão e uma senha, com o botão Cadastrar destacado](img/fig-2-23-5.webp)

*Preenchendo o cadastro.*

![Modal Cadastro de usuário exibindo o alerta verde Usuário cadastrado com sucesso!](img/fig-2-23-6.webp)

*Alerta de sucesso no modal.*

Lembre-se que a esperança é a de que ambos alerta e modal desapareçam depois de dois segundos.

Visite também a sua base de dados no MongoDB e certifique-se de que o novo usuário foi realmente cadastrado, como mostra a figura.

![Coleção test.usuarios no Atlas com o documento do novo usuário e a senha criptografada](img/fig-2-23-7.webp)

*O novo usuário no MongoDB.*

Também precisamos tratar o caso em que o cadastro não pode ser realizado. Talvez o Back End entregue ao Front End uma resposta com status diferente de 201. Quando algo assim acontecer, vamos exibir um alerta para o usuário e fechar o modal.

**front/js/frontend.js**

```javascript
…
try{
  const cadastroEndpoint = '/signup'
  const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
  await axios.post(
    URLCompleta,
    {login: usuarioCadastro, password: passwordCadastro }
  )
  usuarioCadastroInput.value = ""
  passwordCadastroInput.value = ""
  let alert = document.querySelector('.alert-modal-cadastro')
  alert.innerHTML = "Usuário cadastrado com sucesso!"
  alert.classList.add('show', 'alert-success')
  alert.classList.remove('d-none', 'alert-danger')
  setTimeout(() => {
    alert.classList.remove('show')
    alert.classList.add('d-none')
    let modalCadastro = bootstrap.Modal.getInstance(document.querySelector('#modalCadastro'))
    modalCadastro.hide()
  }, 2000)
}
catch(error){
  let alert = document.querySelector('.alert-modal-cadastro')
  alert.innerHTML = "Não foi possível cadastrar"
  alert.classList.add('show', 'alert-danger')
  alert.classList.remove('d-none', 'alert-success')
  setTimeout(() => {
    alert.classList.remove('show')
    alert.classList.add('d-none')
    let modalCadastro = bootstrap.Modal.getInstance(document.querySelector('#modalCadastro'))
    modalCadastro.hide()
  }, 2000)
}
…
```

Faça um novo teste:

* Clique em Novo usuário
* Preencha o campo "Usuário" com um usuário que já existe na base
* Preencha a senha com qualquer valor
* Clique em Cadastrar

![Modal Cadastro de usuário com o usuário joão, que já existe, e o botão Cadastrar destacado](img/fig-2-23-8.webp)

*Tentando cadastrar um usuário que já existe.*

![Modal Cadastro de usuário exibindo o alerta vermelho Não foi possível cadastrar](img/fig-2-23-9.webp)

*Alerta de erro no modal.*

## Reutilizando código: alertas e modais
Duration: 15:00

Observe que a exibição do alerta, independente do contexto, consiste na execução dos seguintes passos:

* seleção do alerta de acordo com uma classe que foi a ele aplicada
* ajuste de seu conteúdo (`innerHTML`)
* adição de classes CSS de interesse, de acordo com o contexto
* remoção de classes CSS de interesse, de acordo com o contexto
* configuração de um timer para fazê-lo desaparecer, ajustando classes CSS

Por isso, vamos escrever uma função que encapsula essa lógica e reutilizá-la sempre que necessário. Reusabilidade de código é fundamental para a boa manutenção do sistema.

**front/js/frontend.js**

```javascript
…
//fora de qualquer outra função, pode ser no final, depois de todas
function exibirAlerta(seletor, innerHTML, classesToAdd, classesToRemove, timeout){
  let alert = document.querySelector(seletor)
  alert.innerHTML = innerHTML
  //... é o spread operator
  //quando aplicado a um array, ele "desmembra" o array
  //depois disso, passamos os elementos do array como argumentos para add e remove
  alert.classList.add(...classesToAdd)
  alert.classList.remove(...classesToRemove)
  setTimeout(() => {
    alert.classList.remove('show')
    alert.classList.add('d-none')
  }, timeout)
}
```

Agora podemos utilizá-la na função `cadastrarUsuario`.

**front/js/frontend.js**

```javascript
…
async function cadastrarUsuario(){
  let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput')
  let passwordCadastroInput = document.querySelector('#passwordCadastroInput')
  let usuarioCadastro = usuarioCadastroInput.value
  let passwordCadastro = passwordCadastroInput.value
  if (usuarioCadastro && passwordCadastro) {
    try{
      const cadastroEndpoint = '/signup'
      const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
      await axios.post(URLCompleta, { login: usuarioCadastro, password: passwordCadastro })
      usuarioCadastroInput.value = ""
      passwordCadastroInput.value = ""
      exibirAlerta('.alert-modal-cadastro', "Usuário cadastrado com sucesso!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
      let modalCadastro = bootstrap.Modal.getInstance(document.querySelector('#modalCadastro'))
      modalCadastro.hide()
    }
    catch(error){
      exibirAlerta('.alert-modal-cadastro', "Erro ao cadastrar usuário", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
      let modalCadastro = bootstrap.Modal.getInstance(document.querySelector('#modalCadastro'))
      modalCadastro.hide()
    }
  }
  else{
    exibirAlerta('.alert-modal-cadastro', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
  }
}
…
```

Lembre-se de que o primeiro alerta que utilizamos foi aquele que aparece quando o usuário tenta cadastrar um filme sem especificar ambos título e sinopse. Também podemos reutilizar a função ali. Para tal, precisamos começar ajustando a definição desse alerta no arquivo `index.html`.

**front/index.html**

```html
…
        </nav>
      </div>
    </div>
  </div>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <!-- tire isso -->
        <!-- <div class="d-none alert alert-danger alert-dismissible fade"
          role="alert">
          Preencha todos os campos.
          <button type="button" class="btn-close" data-bs-dismiss="alert"
            aria-label="Close"></button>
        </div> -->
        <!-- adicione isso -->
        <div class="d-none alert alert-dismissible fade alert-filme"
          role="alert">
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-4">
        <div class="form-floating mb-3">
…
```

Já no arquivo `frontend.js`, passamos a utilizar a função.

**front/js/frontend.js**

```javascript
…
async function cadastrarFilme() {
  //aqui também
  const filmesEndpoint = '/filmes'
  const URLCompleta = `${protocolo}${baseURL}${filmesEndpoint}`
  let tituloInput = document.querySelector('#tituloInput')
  let sinopseInput = document.querySelector('#sinopseInput')
  let titulo = tituloInput.value
  let sinopse = sinopseInput.value
  // somente adiciona se o usuário tiver digitado os dois valores
  if (titulo && sinopse) {
    tituloInput.value = ""
    sinopseInput.value = ""
    const filmes = (await axios.post(URLCompleta, { titulo, sinopse })).data
    let tabela = document.querySelector('.filmes')
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    corpoTabela.innerHTML = ""
    for (let filme of filmes) {
      let linha = corpoTabela.insertRow(0)
      let celulaTitulo = linha.insertCell(0)
      let celulaSinopse = linha.insertCell(1)
      celulaTitulo.innerHTML = filme.titulo
      celulaSinopse.innerHTML = filme.sinopse
    }
  }
  //senão, exibe o alerta por pelo menos 2 segundos
  else {
    exibirAlerta('.alert-filme', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none'], 2000)
  }
}
…
```

Observe que o código para a ocultação do modal também aparece diversas vezes. Vamos aplicar o mesmo princípio para escrevê-lo uma única vez, reutilizando-o a seguir. Comece escrevendo a função a seguir.

**front/js/frontend.js**

```javascript
…
function ocultarModal(seletor, timeout){
  setTimeout(() => {
    let modal = bootstrap.Modal.getInstance(document.querySelector(seletor))
    modal.hide()
  }, timeout)
}
```

A seguir, vamos reutilizá-la.

**front/js/frontend.js**

```javascript
…
async function cadastrarUsuario(){
  let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput')
  let passwordCadastroInput = document.querySelector('#passwordCadastroInput')
  let usuarioCadastro = usuarioCadastroInput.value
  let passwordCadastro = passwordCadastroInput.value
  if (usuarioCadastro && passwordCadastro) {
    try{
      const cadastroEndpoint = '/signup'
      const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
      await axios.post(URLCompleta, { login: usuarioCadastro, password: passwordCadastro })
      usuarioCadastroInput.value = ""
      passwordCadastroInput.value = ""
      exibirAlerta('.alert-modal-cadastro', "Usuário cadastrado com sucesso!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
      ocultarModal('#modalCadastro', 2000)
    }
    catch(error){
      exibirAlerta('.alert-modal-cadastro', "Erro ao cadastrar usuário", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
      ocultarModal('#modalCadastro', 2000)
    }
  }
  else{
    exibirAlerta('.alert-modal-cadastro', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
  }
}
```

<aside class="negative">

Na apostila, as duas chamadas a `ocultarModal` deste trecho usam `'#modalLogin'`, um modal que só será criado no próximo passo. Como aqui queremos fechar o modal de cadastro, o seletor correto é `'#modalCadastro'`, como no bloco acima.

</aside>

Faça novos testes:

* tente cadastrar um novo usuário válido: deve aparecer o alerta verde no modal
* tente cadastrar um novo usuário com login já existente: deve aparecer o alerta vermelho no modal
* tente cadastrar um novo filme deixando de preencher pelo menos um dos campos: deve aparecer o alerta vermelho

Podemos aproveitar e passar a exibir um alerta verde quando um filme for cadastrado com sucesso. Perceba o milagre da reutilização de código!

**front/js/frontend.js**

```javascript
…
async function cadastrarFilme() {
  //aqui também
  const filmesEndpoint = '/filmes'
  const URLCompleta = `${protocolo}${baseURL}${filmesEndpoint}`
  let tituloInput = document.querySelector('#tituloInput')
  let sinopseInput = document.querySelector('#sinopseInput')
  let titulo = tituloInput.value
  let sinopse = sinopseInput.value
  // somente adiciona se o usuário tiver digitado os dois valores
  if (titulo && sinopse) {
    tituloInput.value = ""
    sinopseInput.value = ""
    const filmes = (await axios.post(URLCompleta, { titulo, sinopse })).data
    let tabela = document.querySelector('.filmes')
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    corpoTabela.innerHTML = ""
    for (let filme of filmes) {
      let linha = corpoTabela.insertRow(0)
      let celulaTitulo = linha.insertCell(0)
      let celulaSinopse = linha.insertCell(1)
      celulaTitulo.innerHTML = filme.titulo
      celulaSinopse.innerHTML = filme.sinopse
    }
    exibirAlerta('.alert-filme', 'Filme cadastrado com sucesso', ['show', 'alert-success'], ['d-none'], 2000)
  }
  //senão, exibe o alerta por pelo menos 2 segundos
  else {
    exibirAlerta('.alert-filme', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none'], 2000)
  }
}
…
```

Cadastre um novo filme como na figura.

![Campos Título do filme e Sinopse do filme preenchidos com Star Wars - O Despertar da Força e o botão Cadastrar destacado](img/fig-2-23-10.webp)

*Cadastrando um novo filme.*

Veja o alerta esperado na figura.

![Alerta verde Filme cadastrado com sucesso acima dos campos, com o novo filme na tabela](img/fig-2-23-11.webp)

*Alerta de sucesso no cadastro de filme.*

## Front End + Back End: login
Duration: 20:00

Agora precisamos evitar que usuários que não tenham se autenticado junto ao sistema cadastrem novos filmes. O primeiro passo é desabilitar o botão de cadastro, como a seguir. Lembre-se que esse é o botão de cadastro de filmes. Estamos no arquivo `index.html`.

**front/index.html**

```html
…
<div class="row justify-content-center">
  <div class="col-md-8">
    <button
      class="btn btn-outline-primary w-100"
      onclick="cadastrarFilme()"
      disabled>
      Cadastrar
    </button>
  </div>
</div>
…
```

Veja o resultado esperado na figura.

![Aplicação de filmes com o botão Cadastrar desabilitado, em cinza claro](img/fig-2-24-1.webp)

*O botão de cadastro de filmes desabilitado.*

### O modal de login

O próximo passo é exibir um modal para quando o usuário clicar em login. Ele será definido também no arquivo `index.html` de modo completamente independente do outro. De novo, a documentação sugere que definamos nossos modais logo no começo do HTML. Por isso, vamos defini-lo logo depois do começo do `body`, antes daquele que já havíamos definido. A ordem em que os modais aparecem no arquivo `index.html` é irrelevante. O importante é que ambos apareçam antes de qualquer outro conteúdo. O novo modal é uma simples cópia do anterior, com alguns valores trocados, como id e textos. Por isso, pode até copiar e colar, apenas alterando os valores de interesse.

**front/index.html**

```html
…
<body onload="obterFilmes()">
  <!-- copie e cole o modal anterior e ajuste os trechos destacados a seguir -->
  <div class="modal fade" id="modalLogin" aria-labelledby="modalLogin"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Login</h1>
        </div>
        <div class="modal-body">
          <div class="d-none alert alert-dismissible fade alert-modal-login"
            role="alert">
          </div>
          <form>
            <div class="mb-3">
              <label for="usuarioLoginInput" class="col-form-label">
                Usuário
              </label>
              <input type="text" id="usuarioLoginInput" class="form-control">
            </div>
            <div class="mb-3">
              <label for="passwordLoginInput" class="col-form-label">
                Senha
              </label>
              <input type="password" id="passwordLoginInput"
                class="form-control">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary"
            data-bs-dismiss="modal">Cancelar</button>
          <button onclick="fazerLogin()" type="button"
            class="btn btn-primary">
            Login
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- esse é o modal que já existia antes -->
  <div class="modal fade" id="modalCadastro" aria-labelledby="modalCadastro" aria-hidden="true">
…
```

Lembre-se de associar o novo modal como alvo do botão de login, tal qual fizemos anteriormente com o botão de cadastro.

**front/index.html**

```html
…
<div class="collapse navbar-collapse" id="myNav">
  <div class="navbar-nav ms-auto">
    <a
      class="nav-link active me-2"
      aria-current="page"
      data-bs-toggle="modal"
      data-bs-target="#modalLogin"
      href="#">
      Login
    </a>
    <a
      class="nav-link active me-2"
      data-bs-toggle="modal"
      data-bs-target="#modalCadastro"
      href="#">
      Novo usuário
    </a>
  </div>
</div>
…
```

Clique no botão Login para obter o resultado da figura.

![Modal Login aberto com os campos Usuário e Senha e os botões Cancelar e Login](img/fig-2-24-2.webp)

*O modal de login.*

### A função fazerLogin

Como destacamos, o botão de login está associado a uma função que ainda não existe. Passemos a defini-la. Os primeiros passos serão

* obter referência ao elemento em que o usuário digita login
* obter referência ao elemento em que o usuário digita senha
* obter o login
* obter a senha
* verificar se os dois existem. Se for o caso, faremos algo em breve
* caso contrário, exibimos um alert instruindo o usuário a digitar os dois

Estamos no arquivo `frontend.js`.

**front/js/frontend.js**

```javascript
…
//só para ver que é possível, vamos definir essa função como um arrow function
//esse construção é análoga a
//async function fazerLogin(){}
//há algumas diferenças, mas não vamos entrar em detalhes agora
const fazerLogin = async () => {
  let usuarioLoginInput = document.querySelector('#usuarioLoginInput')
  let passwordLoginInput = document.querySelector('#passwordLoginInput')
  let usuarioLogin = usuarioLoginInput.value
  let passwordLogin = passwordLoginInput.value
  if (usuarioLogin && passwordLogin) {
    //já já fazemos isso
  }
  else{
    exibirAlerta('.alert-modal-login', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
  }
}
```

Tente fazer login sem preencher pelo menos um dos campos para obter o resultado da figura.

![Modal Login exibindo o alerta vermelho Preencha todos os campos](img/fig-2-24-3.webp)

*Alerta de campos vazios no login.*

Para fazer o login, precisamos realizar uma requisição POST direcionada ao Back End, enviando a ele os dados de autenticação (usuário e senha). Utilizemos a Axios uma vez mais para este fim. O fluxo principal de execução será o seguinte:

* montamos a URL completa
* disparamos a requisição POST direcionada ao Back End
* limpamos os dois campos no Front End
* exibimos um alerta de que o login foi realizado com sucesso
* após dois segundos, ocultamos o alerta e o modal
* pegamos uma referência ao link de login
* ajustamos seu texto para que agora seja "Logoff"
* pegamos uma referência ao botão de cadastro de filme e o habilitamos

Antes de escrever esse algoritmo, precisamos atribuir um id ao link de login e um id ao botão de cadastro de filmes para que eles possam ser referenciados posteriormente. A seguir, a atribuição de id ao link de login. Estamos na barra de navegação, no arquivo `index.html`.

**front/index.html**

```html
…
<div class="collapse navbar-collapse" id="myNav">
  <div class="navbar-nav ms-auto">
    <a
      id="loginLink"
      class="nav-link active me-2"
      aria-current="page"
      data-bs-toggle="modal"
      data-bs-target="#modalLogin"
      href="#">
      Login
    </a>
    <a
      class="nav-link active me-2"
      data-bs-toggle="modal"
      data-bs-target="#modalCadastro"
      href="#">
      Novo usuário
    </a>
  </div>
</div>
…
```

A seguir, atribuímos o id do botão de cadastro de filmes.

**front/index.html**

```html
…
<div class="row justify-content-center">
  <div class="col-md-8 col-lg-4">
    <div class="form-floating mb-3">
      <input type="text" class="form-control" id="tituloInput"
        placeholder="Título do filme">
      <label for="tituloInput">Título do filme</label>
    </div>
  </div>
  <div class="col-md-8 col-lg-4">
    <div class="form-floating mb-3">
      <input type="text" class="form-control" id="sinopseInput"
        placeholder="Sinopse do filme">
      <label for="sinopseInput">Sinopse do filme</label>
    </div>
  </div>
</div>
<div class="row justify-content-center">
  <div class="col-md-8">
    <button
      id="cadastrarFilmeButton"
      class="btn btn-outline-primary w-100"
      onclick="cadastrarFilme()"
      disabled>
      Cadastrar
    </button>
  </div>
</div>
<div class="row justify-content-center">
  <div class="col-md-8">
    <table class="table table-striped table-hover text-center filmes">
…
```

Agora podemos implementar o algoritmo descrito. Estamos no arquivo `frontend.js`.

**front/js/frontend.js**

```javascript
…
const fazerLogin = async () => {
  let usuarioLoginInput = document.querySelector('#usuarioLoginInput')
  let passwordLoginInput = document.querySelector('#passwordLoginInput')
  let usuarioLogin = usuarioLoginInput.value
  let passwordLogin = passwordLoginInput.value
  if (usuarioLogin && passwordLogin) {
    try{
      const loginEndpoint = '/login'
      const URLCompleta = `${protocolo}${baseURL}${loginEndpoint}`
      //já já vamos fazer algo com a resposta (pegar o token)
      const response = await axios.post(
        URLCompleta,
        {login: usuarioLogin, password: passwordLogin }
      )
      usuarioLoginInput.value = ""
      passwordLoginInput.value = ""
      exibirAlerta('.alert-modal-login', "Login efetuado com sucesso!",
        ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
      ocultarModal('#modalLogin', 2000)
      const cadastrarFilmeButton = document.querySelector('#cadastrarFilmeButton')
      cadastrarFilmeButton.disabled = false
    }
    catch(error){
      //daqui a pouco fazemos o tratamento de coisas ruins, ou seja,
      //especificamos o fluxo alternativo de execução
    }
  }
  else{
    exibirAlerta('.alert-modal-login', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
  }
}
```

Sabemos que coisas ruins podem acontecer (o servidor não responder, o par usuário/senha ser inválido etc.) e, portanto, precisamos especificar um fluxo alternativo de execução, o que fazemos no bloco `catch`. Por enquanto, vamos apenas exibir um alerta no modal. Aproveitamos também para trocar o texto do link de login para "Logout".

**front/js/frontend.js**

```javascript
const fazerLogin = async () => {
  let usuarioLoginInput = document.querySelector('#usuarioLoginInput')
  let passwordLoginInput = document.querySelector('#passwordLoginInput')
  let usuarioLogin = usuarioLoginInput.value
  let passwordLogin = passwordLoginInput.value
  if (usuarioLogin && passwordLogin) {
    try{
      const loginEndpoint = '/login'
      const URLCompleta = `${protocolo}${baseURL}${loginEndpoint}`
      //já já vamos fazer algo com a resposta (pegar o token)
      const response = await axios.post(URLCompleta, { login: usuarioLogin, password: passwordLogin })
      usuarioLoginInput.value = ""
      passwordLoginInput.value = ""
      exibirAlerta('.alert-modal-login', "Login efetuado com sucesso!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
      ocultarModal('#modalLogin', 2000)
      const loginLink = document.querySelector('#loginLink')
      loginLink.innerHTML = "Logout"
      const cadastrarFilmeButton = document.querySelector('#cadastrarFilmeButton')
      cadastrarFilmeButton.disabled = false
    }
    catch(error){
      //daqui a pouco fazemos o tratamento de coisas ruins, ou seja,
      //especificamos o fluxo alternativo de execução
      exibirAlerta('.alert-modal-login', "Erro ao fazer login", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
  }
  else{
    exibirAlerta('.alert-modal-login', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
  }
}
```

Faça um teste de login com um par usuário/senha que você sabe que existe na base. Se não lembrar de nenhum, basta cadastrar um novo! A figura mostra a realização do login.

![Modal Login preenchido com o usuário rodrigo e uma senha, com o botão Login destacado](img/fig-2-24-4.webp)

*Realizando o login.*

Observe, na figura, como o botão de login passa a exibir o texto **Logout**. Além disso, o botão para cadastro de filmes está habilitado.

![Barra de navegação exibindo Logout e o botão Cadastrar habilitado, ambos destacados](img/fig-2-24-5.webp)

*Após o login: link Logout e cadastro de filmes habilitado.*

Agora clique em atualizar no seu navegador. Observe que o botão de login/logout passa a exibir o texto Login novamente! O botão de cadastro também volta a ficar desabilitado.

![Página recarregada exibindo novamente Login na barra de navegação e o botão Cadastrar desabilitado](img/fig-2-24-6.webp)

*Após atualizar a página, o estado de login se perde.*

Isso acontece pois, quando atualizamos a página, a árvore DOM é completamente reconstruída pelo navegador. E isso é feito em função do HTML estático, que já está pronto no arquivo `.html`.

## Mantendo a sessão do usuário com o token
Duration: 8:00

O que desejamos fazer é manter a "sessão" do usuário. Ou seja, de alguma forma detectar que ele já fez login e controlar o status dos botões e links de acordo. Lembra que o Back End devolve um token ao Front End quando um login é realizado com sucesso? Pois é. Façamos um ajuste para que seja possível visualizá-lo. No arquivo `frontend.js`, faça o ajuste a seguir: estamos exibindo o corpo da resposta que o Back End entregou ao Front End (`console.log(response.data)`). Ele inclui o token. Também exibimos o erro no bloco `catch`.

**front/js/frontend.js**

```javascript
const fazerLogin = async () => {
  let usuarioLoginInput = document.querySelector('#usuarioLoginInput')
  let passwordLoginInput = document.querySelector('#passwordLoginInput')
  let usuarioLogin = usuarioLoginInput.value
  let passwordLogin = passwordLoginInput.value
  if (usuarioLogin && passwordLogin) {
    try{
      const loginEndpoint = '/login'
      const URLCompleta = `${protocolo}${baseURL}${loginEndpoint}`
      //já já vamos fazer algo com a resposta (pegar o token)
      const response = await axios.post(URLCompleta, { login: usuarioLogin, password: passwordLogin })
      console.log(response.data)
      usuarioLoginInput.value = ""
      passwordLoginInput.value = ""
      exibirAlerta('.alert-modal-login', "Login efetuado com sucesso!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
      ocultarModal('#modalLogin', 2000)
      const loginLink = document.querySelector('#loginLink')
      loginLink.innerHTML = "Logout"
      const cadastrarFilmeButton = document.querySelector('#cadastrarFilmeButton')
      cadastrarFilmeButton.disabled = false
    }
    catch(error){
      console.log(error)
      //daqui a pouco fazemos o tratamento de coisas ruins, ou seja,
      //especificamos o fluxo alternativo de execução
      exibirAlerta('.alert-modal-login', "Erro ao fazer login", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
  }
  else{
    exibirAlerta('.alert-modal-login', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
  }
}
```

Faça um login novamente e visualize o token no Chrome Dev Tools (CTRL + SHIFT + I), como mostra a figura.

![Aba Console do Chrome Dev Tools exibindo o objeto com o campo token contendo o JWT, com a aplicação logada acima](img/fig-2-25-1.webp)

*O token exibido no console.*

Utilizaremos o token para decidir se

* o link de login/logout exibe o texto Login ou Logout
* o botão de cadastro de filmes está habilitado ou desabilitado

Ocorre que o token também existe apenas na memória principal gerenciada pelo navegador. Caso clique em atualizar, ele será perdido. É aí que entra o mecanismo **localStorage**. É um recurso que permite que armazenemos dados em memória persistente, exclusivos da aplicação que estamos desenvolvendo. Ou seja, embora estejam armazenados em meio persistente, o navegador garante que somente a nossa aplicação (outras abas visitando outros links não podem) acesse esses dados.

## Encerramento
Duration: 5:00

Parabéns! Você construiu uma aplicação Full Stack de gerenciamento de filmes: um Front End em HTML, Bootstrap e Javascript que conversa via Axios com um Back End em Node.js e Express, que por sua vez persiste filmes e usuários no MongoDB Atlas por meio do Mongoose, com senhas criptografadas pelo bcrypt e login baseado em tokens JWT.

<aside class="positive">

A apostila termina apresentando o **localStorage** como o mecanismo para guardar o token e manter a sessão do usuário. Um bom próximo passo é gravar o token com `localStorage.setItem` após o login, lê-lo com `localStorage.getItem` quando a página carregar para ajustar o link Login/Logout e o botão de cadastro, e fazer o Back End exigir o token no endpoint de cadastro de filmes.

</aside>

### Código final dos arquivos Javascript

Os blocos a seguir reúnem, num só lugar, a última versão de cada trecho mostrado ao longo do codelab (com as correções indicadas nos avisos).

<details><summary>Ver backend.js completo</summary>

**backend.js**

```javascript
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())
app.use(cors())

const Filme = mongoose.model("Filme", mongoose.Schema({
  titulo: {type: String},
  sinopse: {type: String}
}))

const usuarioSchema = mongoose.Schema({
  login: {type: String, required: true, unique: true},
  password: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)

async function conectarAoMongoDB() {
  await mongoose.connect(`mongodb+srv://<usuario>:<senha>@<seu-cluster>.mongodb.net/?retryWrites=true&w=majority`)
}

app.get("/filmes", async (req, res) => {
  const filmes = await Filme.find()
  res.json(filmes)
})

app.post("/filmes", async (req, res) => {
  const titulo = req.body.titulo
  const sinopse = req.body.sinopse
  const filme = new Filme({titulo: titulo, sinopse: sinopse})
  await filme.save()
  const filmes = await Filme.find()
  res.json(filmes)
})

app.post('/signup', async (req, res) => {
  try {
    const login = req.body.login
    const password = req.body.password
    const criptografada = await bcrypt.hash(password, 10)
    const usuario = new Usuario({
      login: login,
      password: criptografada
    })
    const respMongo = await usuario.save()
    console.log(respMongo)
    res.status(201).end()
  } catch (error) {
    console.log(error)
    res.status(409).end()
  }
})

app.post('/login', async (req, res) => {
  const login = req.body.login
  const password = req.body.password
  const u = await Usuario.findOne({login: req.body.login})
  if(!u){
    return res.status(401).json({mensagem: "login inválido"})
  }
  const senhaValida = await bcrypt.compare(password, u.password)
  if (!senhaValida){
    return res.status(401).json({mensagem: "senha inválida"})
  }
  const token = jwt.sign(
    {login: login},
    "chave-secreta",
    {expiresIn: "1h"}
  )
  res.status(200).json({token: token})
})

//GET http://localhost:3000/hey
app.get('/hey', (req, res) => {
  res.send('hey')
})

app.listen(3000, () => {
  try{
    conectarAoMongoDB()
    console.log("up and running")
  }
  catch (e){
    console.log('Erro', e)
  }
})
```

</details>

<details><summary>Ver frontend.js completo</summary>

**front/js/frontend.js**

```javascript
const protocolo = 'http://'
const baseURL = 'localhost:3000'

async function obterFilmes() {
  const filmesEndpoint = '/filmes'
  const URLCompleta = `${protocolo}${baseURL}${filmesEndpoint}`
  const filmes = (await axios.get(URLCompleta)).data
  let tabela = document.querySelector('.filmes')
  let corpoTabela = tabela.getElementsByTagName('tbody')[0]
  for (let filme of filmes) {
    let linha = corpoTabela.insertRow(0)
    let celulaTitulo = linha.insertCell(0)
    let celulaSinopse = linha.insertCell(1)
    celulaTitulo.innerHTML = filme.titulo
    celulaSinopse.innerHTML = filme.sinopse
  }
}

async function cadastrarFilme() {
  const filmesEndpoint = '/filmes'
  const URLCompleta = `${protocolo}${baseURL}${filmesEndpoint}`
  let tituloInput = document.querySelector('#tituloInput')
  let sinopseInput = document.querySelector('#sinopseInput')
  let titulo = tituloInput.value
  let sinopse = sinopseInput.value
  if (titulo && sinopse) {
    tituloInput.value = ""
    sinopseInput.value = ""
    const filmes = (await axios.post(URLCompleta, { titulo, sinopse })).data
    let tabela = document.querySelector('.filmes')
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    corpoTabela.innerHTML = ""
    for (let filme of filmes) {
      let linha = corpoTabela.insertRow(0)
      let celulaTitulo = linha.insertCell(0)
      let celulaSinopse = linha.insertCell(1)
      celulaTitulo.innerHTML = filme.titulo
      celulaSinopse.innerHTML = filme.sinopse
    }
    exibirAlerta('.alert-filme', 'Filme cadastrado com sucesso', ['show', 'alert-success'], ['d-none'], 2000)
  }
  else {
    exibirAlerta('.alert-filme', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none'], 2000)
  }
}

async function cadastrarUsuario(){
  let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput')
  let passwordCadastroInput = document.querySelector('#passwordCadastroInput')
  let usuarioCadastro = usuarioCadastroInput.value
  let passwordCadastro = passwordCadastroInput.value
  if (usuarioCadastro && passwordCadastro) {
    try{
      const cadastroEndpoint = '/signup'
      const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
      await axios.post(URLCompleta, { login: usuarioCadastro, password: passwordCadastro })
      usuarioCadastroInput.value = ""
      passwordCadastroInput.value = ""
      exibirAlerta('.alert-modal-cadastro', "Usuário cadastrado com sucesso!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
      ocultarModal('#modalCadastro', 2000)
    }
    catch(error){
      exibirAlerta('.alert-modal-cadastro', "Erro ao cadastrar usuário", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
      ocultarModal('#modalCadastro', 2000)
    }
  }
  else{
    exibirAlerta('.alert-modal-cadastro', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
  }
}

const fazerLogin = async () => {
  let usuarioLoginInput = document.querySelector('#usuarioLoginInput')
  let passwordLoginInput = document.querySelector('#passwordLoginInput')
  let usuarioLogin = usuarioLoginInput.value
  let passwordLogin = passwordLoginInput.value
  if (usuarioLogin && passwordLogin) {
    try{
      const loginEndpoint = '/login'
      const URLCompleta = `${protocolo}${baseURL}${loginEndpoint}`
      const response = await axios.post(URLCompleta, { login: usuarioLogin, password: passwordLogin })
      console.log(response.data)
      usuarioLoginInput.value = ""
      passwordLoginInput.value = ""
      exibirAlerta('.alert-modal-login', "Login efetuado com sucesso!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
      ocultarModal('#modalLogin', 2000)
      const loginLink = document.querySelector('#loginLink')
      loginLink.innerHTML = "Logout"
      const cadastrarFilmeButton = document.querySelector('#cadastrarFilmeButton')
      cadastrarFilmeButton.disabled = false
    }
    catch(error){
      console.log(error)
      exibirAlerta('.alert-modal-login', "Erro ao fazer login", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
  }
  else{
    exibirAlerta('.alert-modal-login', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
  }
}

function exibirAlerta(seletor, innerHTML, classesToAdd, classesToRemove, timeout){
  let alert = document.querySelector(seletor)
  alert.innerHTML = innerHTML
  alert.classList.add(...classesToAdd)
  alert.classList.remove(...classesToRemove)
  setTimeout(() => {
    alert.classList.remove('show')
    alert.classList.add('d-none')
  }, timeout)
}

function ocultarModal(seletor, timeout){
  setTimeout(() => {
    let modal = bootstrap.Modal.getInstance(document.querySelector(seletor))
    modal.hide()
  }, timeout)
}
```

</details>

### Referências da apostila

* NodeJS: [https://nodejs.org/en/](https://nodejs.org/en/)
* MongoDB: [https://www.mongodb.com/](https://www.mongodb.com/)
* mongoose-unique-validator: [https://www.npmjs.com/package/mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator)
* bcrypt: [https://www.npmjs.com/package/bcrypt](https://www.npmjs.com/package/bcrypt)
* RFC 7519 (JWT): [https://www.rfc-editor.org/rfc/rfc7519](https://www.rfc-editor.org/rfc/rfc7519)
* jwt.io: [https://jwt.io/](https://jwt.io/)
* Navbar do Bootstrap: [https://getbootstrap.com/docs/5.2/components/navbar/](https://getbootstrap.com/docs/5.2/components/navbar/)
* Modal do Bootstrap: [https://getbootstrap.com/docs/5.2/components/modal/](https://getbootstrap.com/docs/5.2/components/modal/)
