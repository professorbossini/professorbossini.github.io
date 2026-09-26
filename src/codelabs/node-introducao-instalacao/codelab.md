summary: Conheça o NodeJS, o npm e o npx, entenda o papel do NodeJS do lado do servidor e faça a instalação usando um gerenciador de versões (nvm).
id: node-introducao-instalacao
categories: Node.js,JavaScript
tags: nodejs,npm,npx,nvm,instalacao,repl,cowsay
status: Published
authors: Rodrigo Bossini
last updated: 2022-10-08
pdf: react/01_apostila_nodejs_introducao_e_instalacao.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# NodeJS: introdução e instalação

## Visão geral
Duration: 3:00

Neste codelab você conhece o **NodeJS**, o ambiente que viabiliza a execução de código Javascript do lado do servidor, e as ferramentas que o acompanham: o **npm** e o **npx**. Em seguida, você instala o NodeJS usando um gerenciador de versões e testa a instalação.

### O que você vai aprender

* O que são o NodeJS, o npm e o npx
* Por que o NodeJS permite usar uma única linguagem em toda a pilha de desenvolvimento
* Como a CLI do npm obtém pacotes do npm registry
* Como executar pacotes com e sem o npx, instalando-os global ou localmente
* Como instalar o NodeJS com o instalador oficial ou com um Node Version Manager (nvm)
* Como testar o NodeJS (REPL), o npm e o npx

### O que você vai precisar

* Um computador com Linux, MacOS ou Windows
* Acesso a um terminal
* Conexão com a internet para baixar o nvm, o NodeJS e os pacotes do npm registry

## NodeJS, npm e npx
Duration: 5:00

Ryan Dahl é o criador do NodeJS. A sua primeira versão foi disponibilizada em maio de 2009. Trata-se de um ambiente que viabiliza, entre outras coisas, a execução de código Javascript do lado do servidor. A sua instalação inclui o **Node Package Manager (npm)**, um gerenciador de pacotes por meio do qual podemos fazer a instalação de pacotes e bibliotecas diversas, os quais são obtidos do **npm registry**. A primeira versão do npm data de janeiro de 2010. Desde a sua versão 5.2, o npm inclui o **npx**, que é uma ferramenta que simplifica a execução de pacotes.

As páginas oficiais do NodeJS e do npm podem ser acessadas por meio dos links a seguir:

* NodeJS: [https://nodejs.org/en/](https://nodejs.org/en/)
* npm: [https://www.npmjs.com/](https://www.npmjs.com/)

### NodeJS do lado do servidor, comparação com alternativas

Uma das grandes vantagens que o uso do NodeJS traz é a possibilidade de se utilizar uma única linguagem de programação em toda a "pilha" de desenvolvimento: a linguagem Javascript nasceu originalmente no ambiente de navegadores, em que é utilizada para fazer validações, animações etc. no navegador. Com a chegada do NodeJS, a linguagem Javascript passa a ser utilizada também para tarefas que envolvem o acesso a bases de dados, o acesso ao sistema de arquivos e a produção de conteúdo dinamicamente, ou seja, em tempo de requisição. A figura a seguir mostra uma comparação entre o uso do NodeJS e de servidores de aplicação bastante comuns.

![Diagrama de desenvolvimento full stack: à esquerda, três navegadores executando código Javascript do lado do cliente (front end); à direita (back end), eles trocam requisições e respostas com um servidor PHP, um Apache Tomcat com código Java e um servidor NodeJS com código Javascript, cada um ligado a uma base de dados](img/fig-1-2-1.webp)

*Figura 1.2.1: no front end o código é sempre Javascript; no back end, o NodeJS permite usar Javascript no lugar de PHP ou Java.*

### npm CLI e npm registry

A figura a seguir, por outro lado, mostra a ideia geral do uso do npm. Ele possui uma **CLI** (*command line interface*) com a qual podemos interagir para obter pacotes, para criar projetos etc.

![À esquerda, a CLI do npm com comandos como npm init, npm install express, npm install nodemon --save-dev, npm uninstall express, npm run e npm run start; à direita, o npm registry, uma base de pacotes e scripts como express, nodemon, cloudinary, mocha e create-react-app; entre eles, setas de requisição e resposta](img/fig-1-3-1.webp)

*Figura 1.3.1: obtendo pacotes e executando scripts do npm registry usando o npm CLI.*

## Executando pacotes com npm e npx
Duration: 6:00

A ferramenta npx, por sua vez, simplifica a execução de pacotes. A título de ilustração, vamos usar um pacote que se chama **cowsay**. Quando executado, ele mostra a figura de uma vaca que "fala" uma frase que podemos especificar. Veja sua página oficial em [https://www.npmjs.com/package/cowsay](https://www.npmjs.com/package/cowsay).

### Usando npm (sem npx)

Usando npm (sem npx), instalamos o pacote com

**Terminal**

```bash
npm install -g cowsay
```

A seguir, ele é executado com

**Terminal**

```bash
cowsay muuu
```

Por ter sido instalado globalmente (opção `-g`), ele pode ser acessado diretamente na linha de comando. Caso tenha sido instalado localmente, navegamos até o diretório de executáveis com

**Terminal**

```bash
cd node_modules/.bin
```

<aside class="negative">

O diretório `.bin` é oculto: há um ponto antes do `bin`.

</aside>

A seguir, o script pode ser executado com

**Terminal**

```bash
node cowsay muuu
```

<aside class="positive">

**Nota.** Caso tenha feito a instalação do pacote globalmente, você pode desinstalá-lo com `npm uninstall -g cowsay`. Pacotes instalados localmente podem ser desinstalados com `npm uninstall cowsay`.

</aside>

### Usando npx

Usando a ferramenta npx, a execução do pacote é feita com o comando

**Terminal**

```bash
npx cowsay muu
```

Note que a instalação se dá automaticamente. Os arquivos do pacote utilizado ficam armazenados em uma memória cache do npx.

## Instalação do NodeJS
Duration: 15:00

O NodeJS pode ser instalado de diversas formas. Uma delas se dá por meio de seu instalador oficial. Uma outra se baseia no uso de um Node Version Manager, que é a alternativa pela qual optaremos. Ambas são descritas a seguir.

### Instalação com o instalador regular do Node

Uma maneira bastante simples para fazer a instalação do NodeJS é por meio do download do seu instalador, disponível no site oficial: [https://nodejs.org](https://nodejs.org). A instalação do NodeJS já implica a instalação do npm.

### Instalação usando um gerenciador de versões

Há ainda a possibilidade de fazer a instalação do NodeJS por meio de um **Node Version Manager (nvm)**, ou seja, um gerenciador de versões do NodeJS. Ele permite que tenhamos diversas versões do NodeJS instaladas e que alternemos entre elas conforme desejado. Além disso, os arquivos de instalação do NodeJS ficam no diretório do usuário do sistema operacional, o que quer dizer que seu uso tende a evitar problemas de permissão para acesso a determinados diretórios. Por essas razões, optaremos por essa forma de instalação.

O instalador de um nvm pode ser obtido nos links a seguir:

* Linux & MacOS: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
* Windows: [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

Uma vez instalado o nvm, o NodeJS pode ser instalado com

**Terminal**

```bash
nvm install versao-desejada
```

É interessante instalar a última versão LTS disponível na maior parte dos casos. As versões disponíveis para instalação podem ser listadas com

**Terminal (Linux & MacOS)**

```bash
nvm ls-remote
```

**Terminal (Windows)**

```bash
nvm list available
```

A última versão LTS disponível no momento em que esse documento foi escrito era a 14.17.3. A sua instalação pode ser feita com

**Terminal**

```bash
nvm install 14.17.3
```

A seguir, para colocá-la em uso, use:

**Terminal**

```bash
nvm use 14.17.3
```

<aside class="positive">

A versão 14.17.3 era a LTS mais recente quando a apostila foi escrita (julho de 2021). Use `nvm ls-remote` ou `nvm list available` para ver qual é a LTS atual e instale-a no lugar.

</aside>

### Testando a instalação

Para testar a sua instalação, abra um terminal e digite

**Terminal**

```bash
node
```

Isso abre o **REPL** (*Read, Evaluate, Print, Loop*) do NodeJS. Digite algo como

**REPL do NodeJS**

```javascript
console.log ("Hello, NodeJS")
```

Aperte CTRL+D ou CTRL+C duas vezes para sair do REPL.

Para testar o npm, use

**Terminal**

```bash
npm --version
```

Teste o npx com

**Terminal**

```bash
npx cowsay mu
```

O resultado esperado se parece com aquele exibido pela figura a seguir.

![Terminal após executar npx cowsay mu: a vaca desenhada em caracteres ASCII com um balão de fala contendo "mu"](img/fig-2-2-1.webp)

*Figura 2.2.1: resultado esperado do comando npx cowsay mu.*

## Encerramento
Duration: 3:00

Parabéns! Você conheceu o NodeJS, o npm e o npx e deixou o ambiente pronto para desenvolver com Javascript do lado do servidor.

### O que você fez

* Entendeu o papel do NodeJS no back end e como ele se compara a servidores PHP e Java
* Viu como a CLI do npm obtém pacotes do npm registry
* Executou o pacote cowsay com npm (instalação global ou local) e com npx
* Instalou o NodeJS com o nvm e testou o REPL, o npm e o npx

### Referências

* NodeJS: [https://nodejs.org/en/](https://nodejs.org/en/)
* npm: [https://www.npmjs.com/](https://www.npmjs.com/)
* cowsay: [https://www.npmjs.com/package/cowsay](https://www.npmjs.com/package/cowsay)
* nvm (Linux & MacOS): [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
* nvm-windows: [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)
