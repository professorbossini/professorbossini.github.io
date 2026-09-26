summary: Construa um gerenciador de tarefas full stack com CRUD completo: banco MySQL, API REST em Node.js com Express e mysql2/promise, e front-end em React com Vite, Bootstrap e axios.
id: react-crud-nodejs-mysql
categories: React,Node.js,MySQL
tags: react,node.js,express,mysql,crud,api rest,axios,bootstrap,vite,useeffect
status: Published
authors: Rodrigo Bossini
last updated: 2026-03-28
pdf: react/novo/apostila_react_nodejs_mysql_crud.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Gerenciador de Tarefas full stack: CRUD com React, Express e MySQL

## Visão geral
Duration: 5:00

Neste material, construiremos uma aplicação web completa para gerenciamento de tarefas. A aplicação permitirá ao usuário criar, visualizar, editar e excluir tarefas — o chamado **CRUD** (*Create, Read, Update, Delete*). Cada tarefa possuirá um título e uma descrição.

A aplicação será composta por três camadas distintas, ilustradas na figura a seguir.

![Três caixas ligadas por setas: Front-end (React + Vite, Bootstrap, porta 5173, no navegador) troca JSON via HTTP com o Back-end (Node.js + Express, API REST, porta 3000, no servidor), que troca dados via SQL com o Banco de Dados (MySQL, tabela tarefas, porta 3306, no armazenamento)](img/arquitetura.webp)

*Figura 1: Arquitetura da aplicação: front-end, back-end e banco de dados.*

* **Front-end (React):** a interface gráfica da aplicação. É executada no navegador e se comunica com o back-end por meio de requisições HTTP, enviando e recebendo dados no formato JSON.
* **Back-end (Node.js + Express):** o servidor que recebe as requisições do front-end, processa a lógica de negócio e interage com o banco de dados. Expõe uma API REST com endpoints para cada operação do CRUD.
* **Banco de Dados (MySQL):** armazena as tarefas de forma persistente. O back-end se comunica com o banco utilizando consultas SQL.

### As quatro operações do CRUD

A tabela a seguir resume as quatro operações que a aplicação realizará.

| Operação | Método | Endpoint | Descrição |
| --- | --- | --- | --- |
| Create | POST | `/tarefas` | Cria uma nova tarefa |
| Read | GET | `/tarefas` | Lista todas as tarefas |
| Update | PUT | `/tarefas/:id` | Atualiza uma tarefa |
| Delete | DELETE | `/tarefas/:id` | Exclui uma tarefa |

### Aparência esperada da aplicação

A figura a seguir ilustra como a aplicação se parecerá ao final deste material.

![Janela do navegador em localhost:5173 com o título "Gerenciador de Tarefas", um card "Nova Tarefa" com os campos Título e Descrição e o botão Adicionar, e três tarefas (Estudar React, Configurar MySQL, Deploy da aplicação), cada uma com os botões Editar e Excluir](img/aparencia.webp)

*Figura 2: Aparência esperada da aplicação finalizada.*

### O que você vai aprender

* Criar o banco de dados e a tabela de tarefas no MySQL
* Construir uma API REST com Node.js e Express, usando `mysql2/promise` com `async/await`
* Usar placeholders nas consultas SQL para evitar injeção de SQL
* Consumir a API em React com `axios`, `useState` e `useEffect`
* Criar, listar, editar e excluir tarefas a partir da interface
* Executar as três camadas da aplicação ao mesmo tempo

### O que você vai precisar (pré-requisitos)

Antes de iniciar, certifique-se de que os seguintes itens estão instalados:

* **Node.js** (versão 18+) e **npm**. Verifique com `node --version` e `npm --version`.
* **MySQL** (versão 8+). Verifique com `mysql --version`.
* Um editor de código como o **VS Code**.

## Configurando o banco de dados
Duration: 6:00

Começaremos pela camada mais inferior da arquitetura: o banco de dados MySQL.

### Criando o banco de dados e a tabela

Abra o terminal do MySQL e execute os comandos SQL a seguir.

**Terminal do MySQL**

```sql
CREATE DATABASE IF NOT EXISTS gerenciador_tarefas;

USE gerenciador_tarefas;

CREATE TABLE tarefas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

A tabela a seguir descreve cada coluna.

| Coluna | Tipo | Descrição |
| --- | --- | --- |
| `id` | `INT` | Identificador único, auto-incrementado. |
| `titulo` | `VARCHAR(255)` | Título da tarefa. Obrigatório. |
| `descricao` | `TEXT` | Descrição detalhada. Opcional. |
| `criado_em` | `TIMESTAMP` | Data/hora de criação. Automático. |

### Verificando a criação

Para confirmar que a tabela foi criada, execute:

**Terminal do MySQL**

```sql
DESCRIBE tarefas;
```

A figura a seguir representa visualmente a estrutura da tabela.

![Caixa com o título "tarefas" listando as colunas: id INT PK AUTO_INCREMENT, titulo VARCHAR(255) NOT NULL, descricao TEXT e criado_em TIMESTAMP](img/tabela-tarefas.webp)

*Figura 3: Representação visual da tabela `tarefas`.*

## Back-end: projeto e servidor inicial
Duration: 8:00

Agora construiremos o servidor que receberá as requisições do front-end e interagirá com o banco de dados MySQL. Utilizaremos **Promises** (com `async/await`) para todas as operações com o banco.

### Criando o projeto e instalando dependências

Crie uma pasta para o back-end e inicialize o projeto.

**Terminal**

```bash
mkdir backend
cd backend
npm init -y
```

Instale as dependências necessárias.

**Terminal**

```bash
npm install express mysql2 cors
```

| Pacote | Descrição |
| --- | --- |
| `express` | Framework web para Node.js. |
| `mysql2` | Driver MySQL com suporte nativo a Promises. |
| `cors` | Middleware que permite requisições entre origens diferentes. |

<aside class="positive">

**Nota.** O pacote `mysql2` oferece o modo `mysql2/promise`, que retorna Promises nas consultas. Isso permite o uso de `async/await`, tornando o código mais limpo do que callbacks.

</aside>

### Estrutura inicial do servidor

Crie o arquivo `server.js` na raiz do projeto `backend`. Veja o código a seguir.

**backend/server.js**

```javascript
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    mensagem: 'Servidor funcionando!'
  })
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})
```

Teste com `node server.js` e acesse `http://localhost:3000`.

### Configurando a conexão com o MySQL

Adicione a conexão com o banco usando Promises. As linhas novas são o `require` de `mysql2/promise`, a variável `conexao`, a função `conectar` e a chamada `conectar()`. Veja o código a seguir.

**backend/server.js**

```javascript
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')

const app = express()

app.use(cors())
app.use(express.json())

let conexao

async function conectar() {
  conexao = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sua_senha_aqui',
    database: 'gerenciador_tarefas'
  })
  console.log('Conectado ao MySQL!')
}

conectar()

app.get('/', (req, res) => {
  res.json({
    mensagem: 'Servidor funcionando!'
  })
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})
```

<aside class="negative">

**Atenção.** Substitua `'sua_senha_aqui'` pela senha do seu usuário MySQL. Em produção, use variáveis de ambiente.

</aside>

Observe que importamos `mysql2/promise` (e não apenas `mysql2`). Isso permite usar `await` diretamente nas consultas. A função `conectar` é `async` e utiliza `await` para aguardar a conexão.

## Back-end: rotas do CRUD
Duration: 12:00

### Rota para listar tarefas (GET)

Adicione a rota de listagem, entre a rota `/` e o `app.listen`. Veja o código.

**backend/server.js · trecho**

```javascript
app.get('/', (req, res) => {
  res.json({
    mensagem: 'Servidor funcionando!'
  })
})

app.get('/tarefas', async (req, res) => {
  try {
    const [linhas] =
      await conexao.query(
        'SELECT * FROM tarefas'
      )
    res.json(linhas)
  } catch (erro) {
    res.status(500).json({
      erro: 'Erro ao buscar tarefas'
    })
  }
})

app.listen(3000, () => {
```

O método `conexao.query()` retorna uma Promise que resolve para um array. O primeiro elemento contém as linhas retornadas. Utilizamos desestruturação (`const [linhas]`) para obtê-lo. O `try/catch` captura erros.

### Rota para criar tarefa (POST)

Adicione a rota de criação. Veja o código a seguir.

**backend/server.js · trecho**

```javascript
app.post('/tarefas', async (req, res) => {
  try {
    const { titulo, descricao } = req.body
    const sql =
      'INSERT INTO tarefas'
      + ' (titulo, descricao)'
      + ' VALUES (?, ?)'
    const [resultado] =
      await conexao.query(
        sql, [titulo, descricao]
      )
    res.status(201).json({
      id: resultado.insertId,
      titulo,
      descricao
    })
  } catch (erro) {
    res.status(500).json({
      erro: 'Erro ao criar tarefa'
    })
  }
})
```

Observe que utilizamos `?` (*placeholders*) na consulta SQL para evitar **injeção de SQL**. O status `201` indica que o recurso foi criado. O `resultado.insertId` contém o `id` gerado pelo MySQL.

### Rota para atualizar tarefa (PUT)

Adicione a rota de atualização. Veja o código a seguir.

**backend/server.js · trecho**

```javascript
app.put('/tarefas/:id',
  async (req, res) => {
  try {
    const { id } = req.params
    const { titulo, descricao } = req.body
    const sql =
      'UPDATE tarefas'
      + ' SET titulo = ?, descricao = ?'
      + ' WHERE id = ?'
    await conexao.query(
      sql, [titulo, descricao, id]
    )
    res.json({ id, titulo, descricao })
  } catch (erro) {
    res.status(500).json({
      erro: 'Erro ao atualizar tarefa'
    })
  }
})
```

O `:id` na rota é um parâmetro de URL. Uma requisição PUT para `/tarefas/5` terá `req.params.id` igual a `5`.

### Rota para excluir tarefa (DELETE)

Adicione a rota de exclusão. Veja o código a seguir.

**backend/server.js · trecho**

```javascript
app.delete('/tarefas/:id',
  async (req, res) => {
  try {
    const { id } = req.params
    await conexao.query(
      'DELETE FROM tarefas WHERE id = ?',
      [id]
    )
    res.json({
      mensagem: 'Tarefa excluída'
    })
  } catch (erro) {
    res.status(500).json({
      erro: 'Erro ao excluir tarefa'
    })
  }
})
```

### Fluxo de uma requisição

A figura a seguir ilustra o caminho de uma requisição de criação.

![Fluxo da esquerda para a direita: Front-end (React) envia POST /tarefas ao Express (Rotas), que faz INSERT INTO pelo mysql2 (Promise), que envia SQL ao MySQL (Banco); na volta, o resultado vira JSON e a resposta chega ao front-end](img/fluxo-requisicao.webp)

*Figura 4: Fluxo de uma requisição de criação de tarefa.*

## Back-end: código completo
Duration: 5:00

Veja a seguir o código completo do arquivo `server.js`.

**backend/server.js**

```javascript
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')

const app = express()

app.use(cors())
app.use(express.json())

let conexao

async function conectar() {
  conexao = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sua_senha_aqui',
    database: 'gerenciador_tarefas'
  })
  console.log('Conectado ao MySQL!')
}

conectar()

app.get('/tarefas', async (req, res) => {
  try {
    const [linhas] =
      await conexao.query(
        'SELECT * FROM tarefas'
      )
    res.json(linhas)
  } catch (erro) {
    res.status(500).json({
      erro: 'Erro ao buscar tarefas'
    })
  }
})

app.post('/tarefas', async (req, res) => {
  try {
    const { titulo, descricao } = req.body
    const sql =
      'INSERT INTO tarefas'
      + ' (titulo, descricao)'
      + ' VALUES (?, ?)'
    const [resultado] =
      await conexao.query(
        sql, [titulo, descricao]
      )
    res.status(201).json({
      id: resultado.insertId,
      titulo,
      descricao
    })
  } catch (erro) {
    res.status(500).json({
      erro: 'Erro ao criar tarefa'
    })
  }
})

app.put('/tarefas/:id',
  async (req, res) => {
  try {
    const { id } = req.params
    const { titulo, descricao } = req.body
    const sql =
      'UPDATE tarefas'
      + ' SET titulo = ?, descricao = ?'
      + ' WHERE id = ?'
    await conexao.query(
      sql, [titulo, descricao, id]
    )
    res.json({ id, titulo, descricao })
  } catch (erro) {
    res.status(500).json({
      erro: 'Erro ao atualizar tarefa'
    })
  }
})

app.delete('/tarefas/:id',
  async (req, res) => {
  try {
    const { id } = req.params
    await conexao.query(
      'DELETE FROM tarefas WHERE id = ?',
      [id]
    )
    res.json({
      mensagem: 'Tarefa excluida'
    })
  } catch (erro) {
    res.status(500).json({
      erro: 'Erro ao excluir tarefa'
    })
  }
})

app.listen(3000, () => {
  console.log(
    'Servidor rodando na porta 3000'
  )
})
```

## Front-end: projeto, estado e busca
Duration: 8:00

Agora construiremos a interface gráfica utilizando React com Vite e Bootstrap.

### Criando o projeto e instalando dependências

Abra um novo terminal (mantenha o back-end rodando) e execute:

**Terminal**

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install bootstrap axios
```

| Pacote | Descrição |
| --- | --- |
| `bootstrap` | Framework CSS para estilização. |
| `axios` | Biblioteca para requisições HTTP. |

### Preparando os arquivos iniciais

Apague todos os arquivos da pasta `src`. Crie o arquivo `src/main.jsx`. Veja o código a seguir.

**frontend/src/main.jsx**

```jsx
import 'bootstrap/dist/css/bootstrap.min.css'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root')
)
root.render(<App />)
```

### Criando o componente App com o estado

Crie o arquivo `src/App.jsx` com a estrutura básica. Veja o código a seguir.

**frontend/src/App.jsx**

```jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL =
  'http://localhost:3000/tarefas'

function App() {
  const [tarefas, setTarefas] = useState([])
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] =
    useState('')

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        Gerenciador de Tarefas
      </h2>
    </div>
  )
}

export default App
```

Temos três variáveis de estado: `tarefas` (a lista obtida do banco), `titulo` e `descricao` (valores digitados nos campos).

### Buscando as tarefas com useEffect

Adicione a função `buscarTarefas` e o `useEffect`, logo após as variáveis de estado. Veja o código a seguir.

**frontend/src/App.jsx · trecho**

```jsx
const [descricao, setDescricao] =
  useState('')

const buscarTarefas = async () => {
  const resposta =
    await axios.get(API_URL)
  setTarefas(resposta.data)
}

useEffect(() => {
  buscarTarefas()
}, [])

return (
```

A função `buscarTarefas` faz uma requisição GET e armazena o resultado no estado. O `useEffect` com array vazio garante que seja chamada apenas uma vez, ao montar o componente.

## Front-end: formulário e criação de tarefas
Duration: 8:00

### Construindo o formulário

Adicione o formulário dentro do `return`, logo após o título. Veja o código a seguir.

**frontend/src/App.jsx · trecho**

```jsx
    <h2 className="text-center mb-4">
      Gerenciador de Tarefas
    </h2>

    <div className="card mb-4">
      <div className="card-body">
        <h5>Nova Tarefa</h5>
        <div className="row g-2">
          <div className="col-md-4">
            <input
              type="text"
              className=
                "form-control"
              placeholder=
                "Título"
              value={titulo}
              onChange={(e) =>
                setTitulo(
                  e.target.value)
              }
            />
          </div>
          <div className="col-md-5">
            <input
              type="text"
              className=
                "form-control"
              placeholder=
                "Descrição"
              value={descricao}
              onChange={(e) =>
                setDescricao(
                  e.target.value)
              }
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn
                btn-primary w-100"
              onClick=
                {adicionarTarefa}
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
)
```

### Função de adicionar tarefa

Adicione a função após o `useEffect`. Veja o código a seguir.

**frontend/src/App.jsx · trecho**

```jsx
useEffect(() => {
  buscarTarefas()
}, [])

const adicionarTarefa = async () => {
  if (!titulo.trim()) return
  await axios.post(API_URL, {
    titulo,
    descricao
  })
  setTitulo('')
  setDescricao('')
  buscarTarefas()
}

return (
```

## Front-end: listar e excluir
Duration: 6:00

### Exibindo a lista de tarefas

Adicione o trecho após o card do formulário. Veja o código a seguir.

**frontend/src/App.jsx · trecho**

```jsx
{tarefas.map((tarefa) => (
  <div key={tarefa.id}
    className="card mb-2">
    <div className="card-body d-flex
      justify-content-between
      align-items-center">
      <div>
        <h5 className="mb-1">
          {tarefa.titulo}
        </h5>
        <p className="text-muted
          mb-0">
          {tarefa.descricao}
        </p>
      </div>
      <div>
        <button className="btn
          btn-warning btn-sm me-2">
          Editar
        </button>
        <button className="btn
          btn-danger btn-sm">
          Excluir
        </button>
      </div>
    </div>
  </div>
))}
```

O método `map` percorre o array e renderiza um card para cada tarefa.

### Função de excluir tarefa

Adicione a função e conecte-a ao botão. Veja o código a seguir.

**frontend/src/App.jsx · trecho**

```jsx
const excluirTarefa = async (id) => {
  await axios.delete(
    `${API_URL}/${id}`
  )
  buscarTarefas()
}
```

Atualize o botão **Excluir** para chamar a função. Veja o código a seguir.

**frontend/src/App.jsx · trecho**

```jsx
<button className="btn btn-danger btn-sm"
  onClick={() => excluirTarefa(tarefa.id)}
>
  Excluir
</button>
```

## Front-end: editar tarefas
Duration: 8:00

Adicione uma nova variável de estado. Veja o código a seguir.

**frontend/src/App.jsx · trecho**

```jsx
const [descricao, setDescricao] =
  useState('')
const [editandoId, setEditandoId] =
  useState(null)
```

Crie as funções de iniciar e salvar edição. Veja o código a seguir.

**frontend/src/App.jsx · trecho**

```jsx
const iniciarEdicao = (tarefa) => {
  setEditandoId(tarefa.id)
  setTitulo(tarefa.titulo)
  setDescricao(tarefa.descricao || '')
}

const salvarEdicao = async () => {
  if (!titulo.trim()) return
  await axios.put(
    `${API_URL}/${editandoId}`,
    { titulo, descricao }
  )
  setEditandoId(null)
  setTitulo('')
  setDescricao('')
  buscarTarefas()
}
```

Atualize o botão do formulário. Veja o código a seguir.

**frontend/src/App.jsx · trecho**

```jsx
<button
  className={`btn ${editandoId
    ? 'btn-success'
    : 'btn-primary'} w-100`}
  onClick={editandoId
    ? salvarEdicao
    : adicionarTarefa}
>
  {editandoId ? 'Salvar' : 'Adicionar'}
</button>
```

Atualize o botão **Editar** na lista. Veja o código a seguir.

**frontend/src/App.jsx · trecho**

```jsx
<button className="btn btn-warning
  btn-sm me-2"
  onClick={() => iniciarEdicao(tarefa)}
>
  Editar
</button>
```

### Diagrama de interação: edição

A sequência de eventos na edição de uma tarefa é a seguinte:

1. O usuário clica em "Editar".
2. Os campos do formulário são preenchidos com os dados da tarefa.
3. O usuário altera os valores.
4. O usuário clica em "Salvar".
5. A requisição PUT é enviada ao back-end.
6. A lista é atualizada.

## Front-end: código completo
Duration: 6:00

### src/main.jsx

**frontend/src/main.jsx**

```jsx
import 'bootstrap/dist/css/bootstrap.min.css'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root')
)
root.render(<App />)
```

### src/App.jsx

Veja a seguir o código completo do componente principal.

**frontend/src/App.jsx**

```jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL =
  'http://localhost:3000/tarefas'

function App() {
  const [tarefas, setTarefas] = useState([])
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] =
    useState('')
  const [editandoId, setEditandoId] =
    useState(null)

  const buscarTarefas = async () => {
    const resposta =
      await axios.get(API_URL)
    setTarefas(resposta.data)
  }

  useEffect(() => {
    buscarTarefas()
  }, [])

  const adicionarTarefa = async () => {
    if (!titulo.trim()) return
    await axios.post(API_URL, {
      titulo,
      descricao
    })
    setTitulo('')
    setDescricao('')
    buscarTarefas()
  }

  const excluirTarefa = async (id) => {
    await axios.delete(
      `${API_URL}/${id}`
    )
    buscarTarefas()
  }

  const iniciarEdicao = (tarefa) => {
    setEditandoId(tarefa.id)
    setTitulo(tarefa.titulo)
    setDescricao(tarefa.descricao || '')
  }

  const salvarEdicao = async () => {
    if (!titulo.trim()) return
    await axios.put(
      `${API_URL}/${editandoId}`,
      { titulo, descricao }
    )
    setEditandoId(null)
    setTitulo('')
    setDescricao('')
    buscarTarefas()
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        Gerenciador de Tarefas
      </h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">
            {editandoId
              ? 'Editar Tarefa'
              : 'Nova Tarefa'}
          </h5>
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Título"
                value={titulo}
                onChange={(e) =>
                  setTitulo(
                    e.target.value
                  )
                }
              />
            </div>
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Descrição"
                value={descricao}
                onChange={(e) =>
                  setDescricao(
                    e.target.value
                  )
                }
              />
            </div>
            <div className="col-md-3">
              <button
                className={`btn ${
                  editandoId
                    ? 'btn-success'
                    : 'btn-primary'
                } w-100`}
                onClick={
                  editandoId
                    ? salvarEdicao
                    : adicionarTarefa
                }
              >
                {editandoId
                  ? 'Salvar'
                  : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {tarefas.map((tarefa) => (
        <div
          key={tarefa.id}
          className="card mb-2"
        >
          <div className="card-body d-flex
            justify-content-between
            align-items-center"
          >
            <div>
              <h5 className="mb-1">
                {tarefa.titulo}
              </h5>
              <p className="text-muted
                mb-0">
                {tarefa.descricao}
              </p>
            </div>
            <div>
              <button
                className="btn
                  btn-warning
                  btn-sm me-2"
                onClick={() =>
                  iniciarEdicao(tarefa)
                }
              >
                Editar
              </button>
              <button
                className="btn
                  btn-danger btn-sm"
                onClick={() =>
                  excluirTarefa(
                    tarefa.id
                  )
                }
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
```

<aside class="positive">

Alguns valores de `className` estão quebrados em várias linhas, como na apostila. Em JSX isso é permitido: a quebra de linha dentro da string vira apenas um espaço entre as classes.

</aside>

## Executando a aplicação completa
Duration: 6:00

Para colocar toda a aplicação em funcionamento, siga os passos a seguir.

### Passo 1 — Iniciar o MySQL

Certifique-se de que o serviço do MySQL está em execução.

**Terminal**

```bash
sudo systemctl start mysql
```

### Passo 2 — Iniciar o back-end

**Terminal 1**

```bash
cd backend
node server.js
```

### Passo 3 — Iniciar o front-end

Abra outro terminal e execute:

**Terminal 2**

```bash
cd frontend
npm run dev
```

Acesse `http://localhost:5173`.

A figura a seguir ilustra os dois terminais necessários.

![Dois terminais, "Terminal 1: node server.js" e "Terminal 2: npm run dev", e o navegador em localhost:5173 ligado ao primeiro por HTTP e ao segundo por HTML/JS](img/dois-terminais.webp)

*Figura 6: Dois terminais necessários para a aplicação.*

### Testando o CRUD

1. **Criar:** digite um título e descrição e clique em "Adicionar".
2. **Ler:** ao atualizar a página, as tarefas são carregadas do banco.
3. **Atualizar:** clique em "Editar", altere os dados e clique em "Salvar".
4. **Excluir:** clique em "Excluir" para remover uma tarefa.

### Estrutura final dos diretórios

**Estrutura de diretórios do projeto**

```text
projeto/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── node_modules/
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   └── App.jsx
    ├── package.json
    └── node_modules/
```

## Referências
Duration: 3:00

Parabéns! Você construiu um CRUD completo com banco MySQL, API REST em Node.js e interface em React.

* AXIOS. **Promise based HTTP client for the browser and Node.js.** Disponível em [https://axios-http.com/](https://axios-http.com/). Acesso em março de 2026.
* BOOTSTRAP. **Build fast, responsive sites.** Disponível em [https://getbootstrap.com/](https://getbootstrap.com/). Acesso em março de 2026.
* EXPRESS. **Fast, unopinionated, minimalist web framework for Node.js.** Disponível em [https://expressjs.com/](https://expressjs.com/). Acesso em março de 2026.
* MYSQL. **MySQL Documentation.** Disponível em [https://dev.mysql.com/doc/](https://dev.mysql.com/doc/). Acesso em março de 2026.
* REACT. **The library for web and native user interfaces.** Disponível em [https://react.dev/](https://react.dev/). Acesso em março de 2026.
* REACT. **useEffect Hook.** Disponível em [https://react.dev/reference/react/useEffect](https://react.dev/reference/react/useEffect). Acesso em março de 2026.
* REACT. **useState Hook.** Disponível em [https://react.dev/reference/react/useState](https://react.dev/reference/react/useState). Acesso em março de 2026.
* VITE. **Next Generation Frontend Tooling.** Disponível em [https://vite.dev/](https://vite.dev/). Acesso em março de 2026.
