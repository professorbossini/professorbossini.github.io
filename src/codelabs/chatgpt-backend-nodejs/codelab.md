summary: Desenvolva um back end com NodeJS e express que recebe um prompt, repassa-o ao ChatGPT usando a biblioteca da OpenAI e devolve a resposta ao cliente, com a chave de API guardada no .env.
id: chatgpt-backend-nodejs
categories: IA,Node.js
tags: chatgpt,openai,nodejs,express,dotenv,nodemon,thunder client,prompt,completion
status: Published
authors: Rodrigo Bossini
last updated: 2023-10-27
pdf: chatgpt/01_apostila_chatgpt_backend_com_nodejs.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# ChatGPT: back end com NodeJS

## Visão geral
Duration: 4:00

Quando utilizamos o ChatGPT, aquilo que enviamos a ele recebe o nome de **prompt**. Em função do nosso prompt, o ChatGPT produz uma resposta, chamada **completion**. Veja.

![Um usuário envia ao ChatGPT o prompt "Por que o céu é azul?" e recebe a completion "O céu é azul por causa da luz do Sol"](img/p001-1.webp)

*O prompt vai do usuário ao ChatGPT; a completion volta como resposta.*

Neste material, vamos desenvolver uma aplicação **Back End com NodeJS** que se comunica com o ChatGPT. Ela oferece um único endpoint:

```text
POST /pergunte-ao-chatgpt
```

<aside class="positive">

**Nota.** Lembre-se que um endpoint é uma tripla composta por

* método do protocolo HTTP (POST, GET, DELETE etc.)
* padrão de acesso (`/livros`, `/pessoas`, `/pessoas/1`, `/pergunte-ao-chatgpt` etc.)
* funcionalidade acionada quando o endpoint é acessado (uma função Javascript)

</aside>

No corpo da requisição, enviamos um objeto JSON no seguinte formato.

```json
{"prompt": "Por que o céu é azul?"}
```

A aplicação repassa o prompt recebido ao ChatGPT. Ela inclui, também, a chave de acesso à API. Por sua vez, o ChatGPT produz uma resposta (completion) e a entrega ao Back End. O Back End, então, entrega a resposta produzida pelo ChatGPT à aplicação cliente. No material, para simular as requisições, vamos usar a **Thunder Client**, extensão do VS Code que opera como um cliente HTTP. Veja.

![O Thunder Client envia {"prompt": "Por que o céu é azul?"} ao Back End com NodeJS, que lê OPENAI_API_KEY do arquivo .env e repassa o prompt e a chave ao ChatGPT; a resposta volta ao Thunder Client como {"completion": "O céu é azul por causa da luz do Sol"}](img/p002-1.webp)

*Arquitetura da aplicação: cliente, back end, arquivo .env e ChatGPT.*

### O que você vai aprender

* Como criar um projeto NodeJS com npm e executá-lo com o nodemon
* Como guardar a chave de API em um arquivo `.env` com o pacote dotenv
* Como receber requisições com o express e testá-las com a Thunder Client
* Como usar a biblioteca da OpenAI para enviar um prompt ao ChatGPT
* O que são modelos, papéis (roles) e tokens, e como tratar a resposta

### O que você vai precisar

* NodeJS e npm instalados
* VS Code com a extensão Thunder Client
* Uma chave de API da OpenAI (veja o codelab "ChatGPT: criando uma conta e obtendo a chave de API")

## Novo projeto e nodemon
Duration: 8:00

Crie uma pasta para abrigar os arquivos deste novo projeto. No Windows, uma sugestão é

```text
C:\Users\usuario\Documents\dev\chatgpt_backend
```

Em sistemas Unix like, use

```text
/home/usuario/dev/chatgpt_backend
```

A seguir, abra o VS Code e clique em **File >> Open Folder** para mantê-lo vinculado à nova pasta. Por fim, ainda no VS Code, clique em **Terminal >> New Terminal** para abrir um novo terminal interno do VS Code, o que vai simplificar diversas tarefas. No terminal, execute

**Terminal**

```bash
npm init -y
```

para criar um projeto gerenciado pelo npm. Na prática, este comando apenas cria um arquivo chamado `package.json`. Ele é utilizado na definição de dependências do projeto, scripts de execução etc.

Crie também um arquivo `index.js`. Ele será o arquivo principal da aplicação.

![Explorer do VS Code com a pasta CHATGPT_JS_APOSTILA contendo index.js e package.json](img/p002-2.webp)

*O projeto com os arquivos index.js e package.json.*

Ainda no VS Code, clique em **File >> Auto Save** para que as suas edições sejam salvas automaticamente.

Conforme editamos o código, desejamos realizar novos testes considerando as novas atualizações. É pouco prático reiniciar o servidor manualmente a cada edição. Por isso, vamos utilizar o pacote **nodemon** (de *node monitor*). Ele monitora os arquivos envolvidos na execução do projeto e, quando um deles é atualizado, o nodemon reinicia a instância do NodeJS que representa o nosso servidor. Faça a sua instalação com

**Terminal**

```bash
npm install nodemon --save-dev
```

Para utilizar o nodemon, abra o `package.json` e crie um script chamado `start:dev`, como a seguir.

**package.json**

```json
{
  "name": "chatgpt_js_apostila",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start:dev": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

No terminal, use

**Terminal**

```bash
npm run start:dev
```

para colocar o projeto em funcionamento. Veja o resultado esperado.

![VS Code com o package.json aberto e, no terminal, o nodemon 3.0.1 iniciado com "starting node index.js" e "clean exit - waiting for changes before restart"](img/p004-1.webp)

*O nodemon executando o index.js e aguardando alterações.*

## Armazenando a chave de acesso: dotenv
Duration: 10:00

Não podemos deixar a chave de acesso à API fixa no código por, pelo menos, duas razões.

* **Controle de versão em repositórios públicos:** se utilizarmos um repositório público para o controle de versão, a chave ficará visível para todos na Internet.
* **Valor variável em função do ambiente:** em ambiente de desenvolvimento, podemos utilizar uma chave reservada apenas para teste. Em ambiente de produção, é provável que a chave seja outra, reservada apenas para produção. Assim, a chave é um valor que varia em função do ambiente. Ela é uma **variável de ambiente**. Queremos um jeito simples de trocar esse valor sem ter de ficar editando o código explicitamente sempre que fizermos uma nova implantação.

Para resolver esse problema, utilizaremos uma biblioteca chamada **dotenv**. Os passos são os seguintes.

* Definimos um arquivo chamado `.env` na raiz do projeto. Ele abriga as variáveis de ambiente no formato `CHAVE=VALOR`.
* Instalamos o pacote dotenv usando o npm.
* Importamos o pacote dotenv e chamamos seu método `config`. Ele é responsável por ler o conteúdo do arquivo `.env` e disponibilizar as variáveis ali definidas como variáveis de ambiente.
* No código Javascript, utilizamos o objeto global do Node (`process`) para acessar a variável de interesse, da seguinte forma: `process.env.CHAVE`.

Instale o módulo dotenv com

**Terminal**

```bash
npm install dotenv
```

Crie um arquivo `.env` na raiz do seu projeto.

![Explorer do VS Code com o arquivo .env criado na raiz do projeto, ao lado do package.json](img/p005-1.webp)

*O arquivo .env na raiz do projeto.*

Veja o seu conteúdo.

**.env**

```ini
OPENAI_API_KEY=sua chave aqui, sem espaços em branco ou aspas
```

No arquivo `index.js`, importe o pacote dotenv, chame a sua função `config` e exiba a chave para verificar se tudo deu certo.

**index.js**

```javascript
require('dotenv').config()
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
console.log(OPENAI_API_KEY)
```

Veja o resultado esperado.

![VS Code com o index.js acima e, no terminal, a saída do nodemon, com a indicação "sua chave deve aparecer aqui" na linha em que a chave é exibida](img/p006-1.webp)

*A chave lida do .env aparece no terminal.*

### .gitignore

Há dois conteúdos que devem ser excluídos do controle de versão:

* pasta `node_modules` (não se faz controle de versão de bibliotecas, pacotes, módulos, código compilado etc.)
* arquivo `.env` (ele contém a chave!)

Por isso, crie um arquivo chamado `.gitignore` na raiz da aplicação. Veja seu conteúdo.

**.gitignore**

```text
.env
node_modules
```

## Recebendo requisições com o express
Duration: 10:00

A fim de especificar nosso endpoint e receber requisições HTTP, vamos utilizar o pacote **express**. Faça a sua instalação com

**Terminal**

```bash
npm install express
```

No arquivo `index.js`, os passos são os seguintes:

* importar o express
* construir um objeto (que chamaremos de `app`) que viabiliza a definição de endpoints
* aplicar um middleware de transformação JSON
* definir o endpoint
* colocar o servidor em execução

Veja.

**index.js**

```javascript
require('dotenv').config()
//importamos o express
const express = require('express')
//construímos o objeto que viabiliza a especificação de endpoints
const app = express()
//aplicamos o middleware de transformação JSON
app.use(express.json())

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

//especificamos o endpoint de interesse
//POST /pergunte-ao-chatgpt
app.post('/pergunte-ao-chatgpt', (req, res) => {
  //respondemos um 'ok' só para testar
  res.send('ok')
})

//colocamos o servidor em execução na porta 4000
const PORT = 4000
app.listen(PORT, () => console.log(`Em execução na porta ${PORT}`))
```

Veja o resultado esperado.

![VS Code com o index.js usando express e, no terminal, a mensagem "Em execução na porta 4000"](img/p008-1.webp)

*O servidor em execução na porta 4000.*

### Testando o endpoint com a Thunder Client

A **Thunder Client** é uma extensão do VS Code que opera como um cliente HTTP. Caso ainda não possua, faça a sua instalação.

![Aba de extensões do VS Code com a Thunder Client selecionada e a observação "Se você ainda não tiver, vai aparecer um botão install aqui"](img/p008-2.webp)

*Instalando a extensão Thunder Client.*

Depois de fazer a instalação, você pode criar uma requisição para testar. Observe.

![Thunder Client com New Request, método POST e URL localhost:4000/pergunte-ao-chatgpt em destaque, o botão Send e a resposta com Status 200 OK e corpo "ok"](img/p009-1.webp)

*Uma requisição POST para localhost:4000/pergunte-ao-chatgpt devolve "ok".*

## Configurando o cliente da OpenAI
Duration: 6:00

A fim de conversar com o ChatGPT, precisamos instalar o pacote da **openai**. Faça isso com

**Terminal**

```bash
npm install openai
```

A seguir

* importamos a classe `OpenAI`
* utilizamos seu construtor para obter um objeto capaz de conversar com o ChatGPT. Ao construtor, entregamos a chave de API.

Veja.

**index.js**

```javascript
require('dotenv').config()
const { OpenAI } = require ('openai')
//importamos o express
const express = require('express')
//construímos o objeto que viabiliza a especificação de endpoints
const app = express()
//aplicamos o middleware de transformação JSON
app.use(express.json())

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openai = new OpenAI(OPENAI_API_KEY)

//especificamos o endpoint de interesse
//POST /pergunte-ao-chatgpt
app.post('/pergunte-ao-chatgpt', (req, res) => {
  //respondemos um 'ok' só para testar
  res.send('ok')
})

//colocamos o servidor em execução na porta 4000
const PORT = 4000
app.listen(PORT, () => console.log(`Em execução na porta ${PORT}`))
```

<aside class="positive">

A biblioteca da OpenAI também lê a variável de ambiente `OPENAI_API_KEY` automaticamente quando nenhuma chave é informada. A forma documentada de passar a chave explicitamente ao construtor é `new OpenAI({ apiKey: OPENAI_API_KEY })`.

</aside>

## Extraindo o prompt da requisição
Duration: 5:00

O primeiro passo da implementação do endpoint consiste em extrair o prompt que o cliente (Thunder Client) enviou ao Back End. O cliente deverá enviar um objeto JSON com uma única propriedade chamada `prompt`. Assim:

```json
{"prompt": "Por que o céu é azul?"}
```

Começamos extraindo o prompt e apenas devolvendo-o ao cliente, a fim de verificar se está tudo certo.

**index.js**

```javascript
// ...
app.post('/pergunte-ao-chatgpt', (req, res) => {
  //desestruturamos o corpo da requisição, pegando apenas o prompt
  const { prompt } = req.body
  console.log(prompt)
  //apenas devolvemos o prompt ao cliente, realizando um teste breve
  res.json({seuPrompt: prompt})
})
// ...
```

Faça um teste na Thunder Client.

![Thunder Client enviando no Body JSON {"prompt": "Por que o céu é azul?"} e recebendo {"seuPrompt": "Por que o céu é azul?"}](img/p011-1.webp)

*O endpoint devolve o prompt recebido.*

## Conversando com o ChatGPT
Duration: 12:00

A seguir, vamos utilizar o cliente da OpenAI para conversar com o ChatGPT. Os passos serão os seguintes.

### Escolha do modelo

Há modelos aprimorados para conversação, para a edição de imagens, para o tratamento de áudio etc. Veja a lista de modelos que se encontravam disponíveis no momento em que este documento foi escrito.

![Página Models da documentação da OpenAI listando GPT-4, GPT-3.5, GPT base, DALL·E, Whisper, Embeddings, Moderation e GPT-3 com suas descrições](img/p012-1.webp)

*Modelos disponíveis em outubro de 2023.*

Essa é a lista de modelos disponíveis existente no momento em que esse documento foi construído. É recomendável visitar o link oficial para conhecer os mais recentes: [https://platform.openai.com/docs/models/overview](https://platform.openai.com/docs/models/overview).

### Escolha do "papel" (role)

O papel pode ser `user`, `assistant` ou `system`.

| user | assistant | system |
| --- | --- | --- |
| É o mais comumente utilizado. Representa o usuário que está conversando com o ChatGPT. | É a "criatura" que interage com o usuário conforme ele envia mensagens. Não é muito utilizado. Pode ser interessante caso desejemos simular uma conversa prévia com o ChatGPT, associando mensagens ao assistant, o que o fará "pensar" que foi ele quem gerou aquelas respostas. | Serve para fornecer instruções ou configurar comportamentos que não são parte da conversa entre o user e o assistant. Pode ser usado para influenciar a conversa, configurando, por exemplo, um contexto em que a conversa deve acontecer, sem que as instruções sejam parte da conversa. |

### Número máximo de tokens

Um **token** é uma sequência de caracteres. Veja o que a documentação fala sobre eles.

> "A helpful rule of thumb is that one token generally corresponds to ~4 characters of text for common English text. This translates to roughly ¾ of a word (so 100 tokens ~= 75 words)."

Esse valor é importante pois o pagamento é feito por tokens. Quando limitamos o número máximo de tokens, estamos cuidando para que cada requisição não tenha custo muito alto.

Veja o código. Note que a função do endpoint passa a ser `async`, pois aguardamos (`await`) a resposta do ChatGPT.

**index.js**

```javascript
// ...
app.post('/pergunte-ao-chatgpt', async (req, res) => {
  const { prompt } = req.body
  //escolha dos parâmetros
  const model = 'gpt-3.5-turbo'
  const role = 'user'
  const max_tokens = 50
  //comunicação com o ChatGPT
  const completion = await openai.chat.completions.create({
    messages: [{ role: role, content: prompt}],
    model: model,
    max_tokens: max_tokens
  });
  res.json({seuPrompt: prompt})
})
// ...
```

## Tratando a resposta
Duration: 8:00

A seguir, precisamos tratar a resposta. Veja a estrutura que ela possui, segundo a documentação.

**Resposta (exemplo da documentação)**

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-3.5-turbo-0613",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "\n\nHello there, how may I assist you today?"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
```

Trata-se de um objeto JSON que possui uma chave `choices` associada a uma coleção JSON. A coleção possui objetos compostos por, entre outras coisas, uma chave chamada `message`. Por sua vez, ela está associada a um objeto que possui uma chave `content`. O valor associado a ela é o que nos interessa. Veja como podemos devolvê-la ao cliente. Há apenas uma "choice". Portanto, acessamos a coleção `choices` na posição 0.

<aside class="positive">

**Nota.** Poderíamos ter mais de uma "choice" ao variar o parâmetro `n`. Segundo a documentação, seu valor padrão é 1: "*n — integer or null, Optional, Defaults to 1. How many chat completion choices to generate for each input message.*" Leia mais em [https://platform.openai.com/docs/api-reference/chat/create](https://platform.openai.com/docs/api-reference/chat/create).

</aside>

**index.js**

```javascript
// ...
app.post('/pergunte-ao-chatgpt', async (req, res) => {
  const { prompt } = req.body
  //escolha dos parâmetros
  const model = 'gpt-3.5-turbo'
  const role = 'user'
  const max_tokens = 50
  //comunicação com o ChatGPT
  const completion = await openai.chat.completions.create({
    messages: [{ role: role, content: prompt}],
    model: model,
    max_tokens: max_tokens
  });
  res.json({completion: completion.choices[0].message.content})
})
// ...
```

Faça novo teste com a Thunder Client.

![Thunder Client enviando {"prompt": "Por que o céu é azul?. No máximo 30 palavras."} e recebendo {"completion": "A cor azul do céu ocorre devido à dispersão da luz solar pelas moléculas de ar presentes na atmosfera terrestre."}](img/p015-1.webp)

*A resposta do ChatGPT chega ao cliente.*

## Encerramento
Duration: 2:00

Parabéns! Você construiu um back end com NodeJS e express que recebe um prompt, conversa com o ChatGPT por meio da biblioteca da OpenAI e devolve a completion ao cliente, mantendo a chave de API fora do código.

### Referências

* OpenAI. OpenAI, 2023. Disponível em [https://openai.com/](https://openai.com/). Acesso em outubro de 2023.
* Modelos: [https://platform.openai.com/docs/models/overview](https://platform.openai.com/docs/models/overview)
* Chat completions: [https://platform.openai.com/docs/api-reference/chat/create](https://platform.openai.com/docs/api-reference/chat/create)
