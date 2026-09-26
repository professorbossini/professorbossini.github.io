summary: Instale o Node.js por meio do NVM (Node Version Manager), evitando problemas de permissão e mantendo várias versões do Node lado a lado.
id: rn-instalacao-nodejs-nvm
categories: Node.js,React Native
tags: node.js,nvm,npm,instalacao,windows,expo
status: Published
authors: Rodrigo Bossini
last updated: 2021-02-22
pdf: react_native/old/02_apostila_react_native_introducao_instalacao_nvm.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Node.js: instalação com NVM

## Visão geral
Duration: 3:00

O Node.js é pré-requisito para o desenvolvimento com React Native e Expo. Este codelab mostra duas formas de instalá-lo e explica por que a instalação por meio do NVM costuma ser a melhor escolha.

### O que você vai aprender

* Como instalar o Node.js diretamente pelo instalador oficial
* Quais problemas essa instalação direta pode causar
* Como instalar e usar o NVM (Node Version Manager) para instalar versões do Node.js

### O que você vai precisar

* Um computador com Windows (o NVM indicado aqui é a versão para Windows)
* Acesso à internet e a um terminal (prompt de comando)

## Instalação direta do Node.js
Duration: 3:00

A instalação do NodeJS pode ser feita de maneira bastante simples. No link a seguir é possível baixar um arquivo para sua instalação.

[https://nodejs.org/en/](https://nodejs.org/en/)

No caso do sistema operacional Windows, trata-se de um simples `.exe`.

<aside class="negative">

Essa instalação direta do NodeJS pode causar problemas relacionados ao acesso a pastas e arquivos que requerem permissão de administrador.

</aside>

A instalação do Node inclui a instalação do **Node Package Manager** (npm). Ele permite a instalação de diversos pacotes, incluindo o Expo.

## Instalação com o NVM
Duration: 8:00

Há uma forma diferente para se instalar o NodeJS que evita esses problemas e que, inclusive, permite que múltiplas versões dele sejam mantidas instaladas simultaneamente e alternadas conforme a necessidade.

O primeiro passo é instalar um software conhecido como **NVM**, que significa **Node Version Manager**. Um NVM para o Windows pode ser obtido no link a seguir:

[https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

Uma vez feita a sua instalação, ele pode ser usado na linha de comando por meio do comando `nvm`. Note que ele, por si só, não inclui nenhuma instalação do NodeJS. O NVM é um software que permite a instalação do NodeJS, de acordo com as características descritas.

Na linha de comando, dá pra ver quais versões do Node estão disponíveis para instalação com o seguinte comando.

**Terminal**

```bash
nvm list available
```

E uma versão específica pode ser instalada com o comando a seguir.

**Terminal**

```bash
nvm install versaodesejada
```

Em geral, é interessante fazer a instalação da última versão **LTS** (Long Term Support) disponível. No momento em que esse documento foi escrito, a última versão LTS disponível do NodeJS era a 12.16.1. Para fazer a sua instalação, o comando correto é

**Terminal**

```bash
nvm install 12.16.1
```

## Encerramento
Duration: 3:00

Com o Node.js instalado pelo NVM, você tem o `node` e o `npm` disponíveis na linha de comando e pode alternar entre versões conforme a necessidade de cada projeto.

### Próximos passos

* Crie seu primeiro app React Native com o codelab `rn-introducao-hello-world`.
