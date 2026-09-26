summary: Entenda como a comunicação na Web funciona com o protocolo HTTP: modelo cliente–servidor, anatomia de requisições e respostas, códigos de status, métodos GET, POST, PUT, PATCH e DELETE, URLs, a natureza stateless e o HTTPS.
id: mss-http
categories: Microsserviços
tags: http,https,cliente-servidor,rest,metodos http,codigos de status,url,stateless,web
status: Published
authors: Rodrigo Bossini
last updated: 2026-03-28
pdf: microsservicos/01_apostila_http.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# O protocolo HTTP: entendendo a comunicação na Web

## Visão geral
Duration: 3:00

O **HTTP** (*Hypertext Transfer Protocol*) é a "língua" que navegadores, servidores e APIs usam para conversar na Web. Neste codelab você entende, do zero, como essa conversa acontece: quem pede, quem responde, como as mensagens são escritas e o que cada parte significa.

### O que você vai aprender

* O que é a Internet e o que é um protocolo
* O modelo cliente–servidor e por que cliente e servidor são papéis exercidos por software
* A origem do HTTP e como ele funciona (modelo requisição–resposta)
* A anatomia de uma requisição e de uma resposta HTTP
* Os códigos de status e suas faixas
* Os métodos GET, POST, PUT, PATCH e DELETE, com exemplos completos
* As partes de uma URL
* O que significa o HTTP ser *stateless* e a diferença entre HTTP e HTTPS

### O que você vai precisar

* Apenas um navegador e curiosidade: este é um codelab conceitual

## A Internet: uma rede de redes
Duration: 4:00

A **Internet** é uma gigantesca rede mundial que conecta bilhões de dispositivos. Computadores, celulares, tablets, servidores e até geladeiras inteligentes podem trocar informações entre si por meio dessa rede.

No fundo, a Internet é uma **infraestrutura de comunicação**: cabos submarinos, fibras ópticas, torres de celular e satélites que transportam dados de um ponto a outro do planeta. Mas o que nos interessa agora é entender **como** dois programas se comunicam usando essa infraestrutura.

![Nuvem da Internet ligada por linhas tracejadas a um notebook, um celular, um tablet e dois servidores](img/internet.webp)

*A Internet conecta dispositivos de todos os tipos.*

Quando você abre um site no navegador, o seu computador está se comunicando com outro computador (um servidor) que pode estar do outro lado do mundo. Essa comunicação acontece por meio de **protocolos**: regras que ambos os lados combinam de seguir para que a conversa funcione.

> **Protocolo**
>
> Um protocolo é um conjunto de regras que define como dois sistemas devem trocar informações. Assim como as pessoas seguem convenções sociais para conversar (cumprimentar, esperar a vez, despedir-se), os computadores seguem protocolos para se comunicarem de forma organizada.

## Clientes e servidores
Duration: 5:00

Na Web, a comunicação segue um modelo chamado **cliente–servidor**. Funciona assim:

* O **cliente** é o programa que **faz pedidos** (requisições). Exemplo: o navegador.
* O **servidor** é o programa que **responde** aos pedidos. Exemplo: o Apache, o Nginx ou o Express.

O cliente envia uma **requisição** e o servidor devolve uma **resposta**. Sempre nessa ordem: primeiro o cliente pede, depois o servidor responde.

![Cliente (ex.: navegador) envia a requisição (1) ao servidor (ex.: Express), que devolve a resposta (2)](img/cliente-servidor.webp)

*O modelo cliente–servidor.*

O fluxo é sempre o mesmo: **(1)** o cliente envia uma requisição e **(2)** o servidor devolve uma resposta. Esse modelo é a base de toda a comunicação na Web.

### Cliente e servidor são software!

Um ponto **fundamental** que muitas vezes gera confusão: quando dizemos *cliente* e *servidor*, estamos nos referindo a **programas de computador** (software), e não necessariamente a máquinas físicas diferentes.

<aside class="positive">

**Conceito importante.** **Cliente** e **servidor** são **papéis** exercidos por **software**. Um programa é cliente quando faz uma requisição. Um programa é servidor quando recebe requisições e envia respostas. Ambos podem estar executando **na mesma máquina física**.

</aside>

Por exemplo, quando um desenvolvedor trabalha em uma aplicação React com Vite, o navegador (cliente) e o servidor de desenvolvimento do Vite (servidor) executam no mesmo computador. A figura a seguir ilustra esse cenário.

![Um único computador executando dois softwares: o navegador (cliente) em localhost:5173 e o servidor Vite na porta 5173, trocando requisição e resposta](img/mesma-maquina.webp)

*Cliente e servidor executando na mesma máquina.*

Perceba que ambos os programas estão dentro do **mesmo computador**. O navegador acessa o endereço `localhost:5173`, que significa "conecte-se a esta mesma máquina, na porta 5173".

<aside class="positive">

**Dica.** `localhost` é um endereço especial que sempre aponta para a própria máquina. Quando o navegador acessa `http://localhost:5173`, ele está se comunicando com um servidor que roda no mesmo computador — é como enviar uma carta para o seu próprio endereço.

</aside>

## O que é HTTP?
Duration: 5:00

### Origem e significado

A sigla **HTTP** significa **HyperText Transfer Protocol** (Protocolo de Transferência de Hipertexto). Ele foi criado por **Tim Berners-Lee** no início da década de 1990, no laboratório CERN (Organização Europeia para a Pesquisa Nuclear), na Suíça. O HTTP nasceu junto com a própria World Wide Web (WWW) e tinha um objetivo claro: permitir que documentos de hipertexto fossem transferidos pela rede.

![Linha do tempo: 1989, Tim Berners-Lee propõe a WWW; 1991, HTTP/0.9 versão inicial; 1996, HTTP/1.0 cabeçalhos e métodos; 1997, HTTP/1.1 conexões persistentes](img/linha-tempo.webp)

*A evolução inicial do HTTP.*

A primeira versão do HTTP era extremamente simples: o cliente enviava apenas o caminho do documento desejado, e o servidor respondia com o conteúdo. Com o tempo, o protocolo evoluiu para suportar cabeçalhos, diferentes métodos, códigos de status e muito mais.

> **O que é Hipertexto?**
>
> **Hipertexto** é um texto que contém **links** para outros textos. Quando você clica em um link em uma página web, está navegando por hipertexto. O formato mais comum de hipertexto na Web é o **HTML** (HyperText Markup Language).

### Como funciona o HTTP?

O HTTP é um protocolo **baseado em texto** e segue o modelo **requisição–resposta**:

1. O **cliente** envia uma **requisição** em formato textual ao servidor.
2. O **servidor** interpreta essa requisição e devolve uma **resposta**, também em formato textual.
3. Cada requisição é **independente** das anteriores (o HTTP é *stateless*).

A figura a seguir mostra uma visão geral de como ficam escritas uma requisição e uma resposta HTTP.

![O cliente envia GET /index.html HTTP/1.1 com Host www.exemplo.com e Accept text/html; o servidor responde HTTP/1.1 200 OK com Content-Type text/html e o corpo <html>Olá, mundo!</html>](img/req-resp.webp)

*Uma requisição e uma resposta HTTP.*

Observe que tanto a requisição quanto a resposta são compostas por **texto legível**. Essa é uma das características que torna o HTTP relativamente fácil de entender e depurar.

## Anatomia de requisições e respostas
Duration: 5:00

### Anatomia de uma requisição HTTP

Toda requisição HTTP é composta por três partes: a **linha de requisição**, os **cabeçalhos** e, opcionalmente, o **corpo**. A figura a seguir apresenta essa estrutura visualmente.

![Requisição HTTP dividida em linha de requisição GET /produtos/lista HTTP/1.1, cabeçalhos Host, Accept e User-Agent, e corpo opcional com um JSON de produto](img/anatomia-requisicao.webp)

*As partes de uma requisição HTTP.*

**Requisição HTTP**

```text
GET /produtos/lista HTTP/1.1
Host: www.loja.com.br
Accept: application/json
User-Agent: Mozilla/5.0

{"nome": "Camiseta", "preco": 49.90}
```

* **Linha de requisição** — contém o **método** HTTP (o que se deseja fazer), o **caminho** do recurso e a **versão** do protocolo.
* **Cabeçalhos** (*headers*) — pares chave-valor que fornecem informações extras: o tipo de conteúdo aceito, o endereço do servidor, dados sobre o navegador etc.
* **Corpo** (*body*) — contém os dados enviados ao servidor. É opcional e geralmente está presente em métodos como POST e PUT.

### Anatomia de uma resposta HTTP

A resposta segue uma estrutura semelhante.

![Resposta HTTP dividida em linha de status HTTP/1.1 200 OK, cabeçalhos Content-Type, Content-Length e Date, e corpo com uma lista JSON de produtos](img/anatomia-resposta.webp)

*As partes de uma resposta HTTP.*

**Resposta HTTP**

```text
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 85
Date: Sat, 21 Mar 2026 14:00:00 GMT

[{"nome": "Camiseta", "preco": 49.90}]
```

A diferença principal é que a primeira linha agora contém a **linha de status**, com um **código numérico** (200, 404, 500 etc.) que indica se a requisição foi bem-sucedida ou não.

## Códigos de status HTTP
Duration: 4:00

Toda resposta HTTP contém um **código de status** de três dígitos. Esse código indica ao cliente o resultado da requisição. Os códigos são organizados em cinco faixas.

![Faixas de códigos de status: 1xx informacional, 2xx sucesso, 3xx redirecionamento, 4xx erro do cliente e 5xx erro do servidor](img/faixas-status.webp)

*As cinco faixas de códigos de status.*

A tabela a seguir apresenta os códigos mais comuns no dia a dia.

| Código | Nome | Significado |
| --- | --- | --- |
| `200` | OK | Requisição bem-sucedida. |
| `201` | Created | Recurso criado com sucesso (usado com POST). |
| `204` | No Content | Sucesso, mas sem conteúdo na resposta (usado com DELETE). |
| `301` | Moved Permanently | O recurso mudou de endereço. |
| `400` | Bad Request | Requisição com dados inválidos. |
| `401` | Unauthorized | Autenticação necessária. |
| `403` | Forbidden | Acesso negado, mesmo autenticado. |
| `404` | Not Found | Recurso não encontrado. |
| `500` | Internal Server Error | Erro interno do servidor. |

<aside class="positive">

**Dica.** O código `404 Not Found` é provavelmente o mais famoso da internet. Ele aparece quando você tenta acessar uma página que não existe. Já o `500` é temido por desenvolvedores, pois indica que algo quebrou no servidor.

</aside>

## Os métodos HTTP
Duration: 4:00

O **método** HTTP indica a **ação** que o cliente deseja realizar. A tabela a seguir resume os cinco métodos mais utilizados.

| Método | Descrição | Envia corpo? |
| --- | --- | --- |
| `GET` | Solicita a leitura de um recurso. | Não |
| `POST` | Envia dados para criar um novo recurso. | Sim |
| `PUT` | Substitui completamente um recurso existente. | Sim |
| `PATCH` | Atualiza parcialmente um recurso existente. | Sim |
| `DELETE` | Solicita a remoção de um recurso. | Geralmente não |

A seguir, veremos cada método em detalhes, com exemplos que mostram a requisição e a resposta completas.

### Resumo visual — a analogia da estante de livros

Imagine que o servidor é uma **estante de livros** e cada livro é um recurso.

![Analogia da estante: GET consultar um livro, POST colocar um livro novo na estante, PUT trocar um livro inteiro por outro, PATCH corrigir apenas uma página do livro, DELETE retirar um livro da estante](img/estante.webp)

*Os métodos HTTP como ações sobre uma estante de livros.*

<aside class="positive">

**Dica.** Uma forma fácil de memorizar os métodos HTTP é associá-los às operações **CRUD**: **C**reate (POST), **R**ead (GET), **U**pdate (PUT/PATCH) e **D**elete (DELETE). Essas são as quatro operações básicas em qualquer sistema que manipula dados.

</aside>

## GET e POST
Duration: 5:00

### GET — buscando informações

O método `GET` é usado para **ler** informações. É o mais comum: toda vez que você digita uma URL e pressiona Enter, um `GET` é enviado.

**(1) Requisição do cliente**

```text
GET /usuarios/42 HTTP/1.1
Host: api.exemplo.com
Accept: application/json
```

**(2) Resposta do servidor**

```text
HTTP/1.1 200 OK
Content-Type: application/json

{"id": 42, "nome": "Ana"}
```

O cliente solicita os dados do usuário com identificador 42. O servidor responde com `200 OK` e o conteúdo em formato JSON. Observe que a requisição `GET` **não possui corpo**.

### POST — criando novos recursos

O método `POST` é usado para **enviar dados** ao servidor e **criar** algo novo (cadastrar um usuário, enviar um formulário etc.).

**(1) Requisição do cliente**

```text
POST /usuarios HTTP/1.1
Host: api.exemplo.com
Content-Type: application/json

{"nome": "Carlos",
  "email": "carlos@email.com"}
```

**(2) Resposta do servidor**

```text
HTTP/1.1 201 Created
Content-Type: application/json

{"id": 43, "nome": "Carlos"}
```

A requisição possui um **corpo** com os dados do novo usuário. O servidor responde com `201 Created`, indicando que o recurso foi criado com sucesso, e devolve os dados (incluindo o `id` gerado automaticamente).

## PUT, PATCH e DELETE
Duration: 5:00

### PUT — substituindo um recurso

O método `PUT` **substitui integralmente** um recurso existente. O corpo da requisição deve conter **todos os campos** do recurso, mesmo os que não mudaram.

**(1) Requisição do cliente**

```text
PUT /usuarios/43 HTTP/1.1
Host: api.exemplo.com
Content-Type: application/json

{"nome": "Carlos Silva", "email": "carlos@email.com"}
```

**(2) Resposta do servidor**

```text
HTTP/1.1 200 OK
Content-Type: application/json

{"id": 43, "nome": "Carlos Silva"}
```

O nome do usuário 43 é atualizado de "Carlos" para "Carlos Silva". Note que **todos os campos** são enviados, inclusive o `email` que não mudou.

### PATCH — atualizando parcialmente

O `PATCH` é semelhante ao `PUT`, mas atualiza **apenas os campos enviados** no corpo. Não é necessário enviar todos os dados.

**(1) Requisição do cliente**

```text
PATCH /usuarios/43 HTTP/1.1
Host: api.exemplo.com
Content-Type: application/json

{"email": "novo@email.com"}
```

**(2) Resposta do servidor**

```text
HTTP/1.1 200 OK
Content-Type: application/json

{"id": 43, "nome": "Carlos Silva", "email": "novo@email.com"}
```

Apenas o campo `email` é enviado. O servidor atualiza somente esse campo e retorna o recurso completo atualizado.

### DELETE — removendo recursos

O `DELETE` solicita a **remoção** de um recurso no servidor.

**(1) Requisição do cliente**

```text
DELETE /usuarios/43 HTTP/1.1
Host: api.exemplo.com
```

**(2) Resposta do servidor**

```text
HTTP/1.1 204 No Content
```

A requisição `DELETE` geralmente **não possui corpo**. O servidor responde com `204 No Content`, indicando que o recurso foi removido e não há conteúdo a retornar.

## URLs e recursos
Duration: 3:00

Cada "coisa" que o servidor disponibiliza (um usuário, um produto, uma imagem) é chamada de **recurso**. Para acessar um recurso, usamos uma **URL** (*Uniform Resource Locator*). A figura a seguir mostra as partes de uma URL.

![A URL https://api.loja.com:3000/produtos?categoria=roupas com setas indicando protocolo (esquema), host (domínio), porta, caminho (recurso) e query string (filtros)](img/url.webp)

*As partes de uma URL.*

* **Protocolo** — define como a comunicação acontece (`http` ou `https`).
* **Host** — o endereço do servidor.
* **Porta** — o "número da porta" do servidor (opcional; o padrão do HTTP é 80 e o do HTTPS é 443).
* **Caminho** — identifica o recurso desejado no servidor.
* **Query string** — parâmetros extras para filtrar ou configurar a requisição.

## Stateless e HTTPS
Duration: 5:00

### HTTP é sem estado (*stateless*)

Uma característica essencial do HTTP é que ele é **sem estado** (*stateless*). Isso significa que **cada requisição é independente**: o servidor não guarda nenhuma informação sobre requisições anteriores.

![O cliente envia GET /pagina1 e recebe 200 OK, depois envia GET /pagina2 e recebe 200 OK; o servidor diz: Não me lembro da requisição anterior!](img/stateless.webp)

*Para o servidor, cada requisição é independente.*

Para o servidor, cada requisição é como se fosse a primeira vez que o cliente fala com ele. Isso traz vantagens (simplicidade, escalabilidade), mas também desafios — por exemplo, como manter um usuário "logado" se o servidor não lembra das requisições anteriores?

<aside class="positive">

**Nota.** Para contornar a natureza *stateless* do HTTP, foram criados mecanismos como **cookies**, **tokens** e **sessões**. Eles permitem que o servidor reconheça o cliente em requisições subsequentes, mesmo sem o HTTP ter memória própria.

</aside>

### HTTP vs. HTTPS

O **HTTPS** é a versão **segura** do HTTP. A letra "S" vem de *Secure*. A diferença é que o HTTPS adiciona uma camada de **criptografia** (usando TLS/SSL) sobre a comunicação, protegendo os dados contra interceptação.

![Comparação: no HTTP os dados trafegam em texto puro (cadeado aberto); no HTTPS os dados trafegam criptografados (cadeado fechado)](img/http-https.webp)

*HTTP e HTTPS.*

Atualmente, o HTTPS é o padrão recomendado para qualquer site. Navegadores como o Chrome exibem um aviso de "Não seguro" para sites que ainda usam HTTP puro.

## HTTP na prática e resumo
Duration: 4:00

### Um exemplo completo

Para consolidar tudo o que aprendemos, vamos acompanhar o que acontece quando você digita `https://www.google.com` no navegador e pressiona Enter.

1. Você digita `https://www.google.com` e pressiona Enter.
2. O navegador descobre o endereço IP do servidor (DNS).
3. Uma conexão segura (TLS/SSL) é estabelecida.
4. O navegador envia: `GET / HTTP/1.1 | Host: www.google.com`
5. O servidor responde: `HTTP/1.1 200 OK` + HTML da página.
6. O navegador interpreta o HTML e renderiza a página na tela.

Tudo isso acontece em frações de segundo. O HTTP é a "língua" que o navegador e o servidor usam para se entender — e agora você sabe como essa conversa funciona!

### Resumo visual

A figura a seguir sintetiza os conceitos principais abordados neste material.

![Mapa mental do HTTP ligado a: Métodos (GET, POST, PUT, PATCH, DELETE), Códigos de Status (200, 201, 404, 500...), Requisição (linha, cabeçalhos e corpo), Resposta (status, cabeçalhos e corpo) e Stateless (cada requisição é independente)](img/resumo.webp)

*Os conceitos principais do HTTP.*

## Encerramento
Duration: 3:00

Parabéns! Agora você entende o modelo cliente–servidor, a estrutura das mensagens HTTP, os códigos de status, os métodos, as URLs, a natureza *stateless* do protocolo e o papel do HTTPS. Esses conceitos são a base para construir e consumir APIs e microsserviços.

### Referências

* BERNERS-LEE, T. *Information Management: A Proposal*. CERN, 1989. Disponível em [https://www.w3.org/History/1989/proposal.html](https://www.w3.org/History/1989/proposal.html). Acesso em março de 2026.
* MDN WEB DOCS. *An overview of HTTP*. 2024. Disponível em [https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview). Acesso em março de 2026.
* MDN WEB DOCS. *HTTP request methods*. 2024. Disponível em [https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods). Acesso em março de 2026.
* MDN WEB DOCS. *HTTP response status codes*. 2024. Disponível em [https://developer.mozilla.org/en-US/docs/Web/HTTP/Status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). Acesso em março de 2026.
* RFC 2616. *Hypertext Transfer Protocol – HTTP/1.1*. 1999. Disponível em [https://datatracker.ietf.org/doc/html/rfc2616](https://datatracker.ietf.org/doc/html/rfc2616). Acesso em março de 2026.
