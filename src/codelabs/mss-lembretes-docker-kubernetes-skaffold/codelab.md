summary: Exercício prático de implantação da aplicação de lembretes baseada em microsserviços Node.js, usando Docker para gerar imagens e executar contêineres e Kubernetes para a implantação completa.
id: mss-lembretes-docker-kubernetes-skaffold
categories: Microsserviços,Docker,Kubernetes
tags: microsservicos,docker,kubernetes,skaffold,node.js,barramento de eventos,postman,thunder client
status: Published
authors: Rodrigo Bossini
last updated: 2023-08-09
pdf: topicos_avancados_em_backend/01_apostila_exercicio_mss_lembretes_docker_kubernetes_skaffold.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Exercício: lembretes com Docker, Kubernetes e Skaffold

## Visão geral
Duration: 3:00

Neste material, faremos a implantação de uma solução baseada em microsserviços utilizando o **Docker** e o **Kubernetes**. Depois disso, veremos como automatizar a execução de scripts do Kubernetes usando o **Skaffold**.

### O que você vai praticar

* Instalar as dependências de uma aplicação formada por vários microsserviços Node.js
* Testar os endpoints dos microsserviços com o Postman ou o Thunder Client
* Criar uma imagem Docker para cada microsserviço, incluindo o barramento de eventos
* Executar os microsserviços em contêineres com `docker run`
* Fazer a implantação completa da aplicação usando o Kubernetes

### O que você vai precisar

* Git, Node.js e npm
* Docker e um cluster Kubernetes local
* O Postman ou a extensão Thunder Client do VS Code

## Clonando e testando os microsserviços
Duration: 15:00

### 2.1 Clone do repositório

Comece fazendo um clone do repositório a seguir. Ele contém os microsserviços de que precisaremos.

**Terminal**

```bash
git clone https://github.com/professorbossini/mss_lembretes_pronto_para_exercicio_docker_kubernetes_skaffold.git
```

<aside class="positive">

Observe que o repositório possui uma **apostila**. Seguiremos alguns dos passos ali detalhados para realizar a implantação usando Docker + Kubernetes. As seções citadas a seguir (4.3.52, 4.3.62 etc.) são dessa apostila.

</aside>

### 2.2 Dependências

Instale as dependências de cada microsserviço com `npm i`.

**Terminal (na pasta de cada microsserviço)**

```bash
npm i
```

### 2.3 Testes

Realize os testes da seção **4.3.52** da apostila. Use o Postman ou o Thunder Client.

## Imagens e contêineres Docker
Duration: 20:00

### 2.4 Imagens

Use `docker build` para criar uma imagem para cada microsserviço, incluindo o barramento de eventos.

### 2.5 Contêineres

Coloque todos os microsserviços em execução com `docker run`.

### 2.6 Testes novamente

Realize novamente os testes da seção **4.3.52** da apostila.

## Implantação com Kubernetes
Duration: 30:00

### 2.7 Implantação completa

Siga os passos da apostila desde a seção **4.3.62** até a seção **4.3.72.3**, fazendo a implantação completa da aplicação usando o Kubernetes.

## Encerramento
Duration: 3:00

Parabéns! Se você chegou até aqui, a aplicação de lembretes está implantada com Docker e Kubernetes. Consulte a apostila do repositório para continuar explorando a solução.
