summary: Aprenda o hook useEffect do React: efeitos colaterais, array de dependências, função de limpeza, timers com setInterval e renderização condicional, evoluindo a aplicação Estação Climática com componentes EstacaoClimatica e Loading.
id: react-useeffect
categories: React,JavaScript
tags: react,useeffect,hooks,efeitos colaterais,setinterval,limpeza,bootstrap,spinner
status: Published
authors: Rodrigo Bossini
last updated: 2026-03-21
pdf: react/novo/06_apostila_react_useEffect.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React: o hook useEffect

## Visão geral
Duration: 3:00

Neste codelab você estuda o hook `useEffect`, usado para efeitos colaterais em componentes funcionais: timers, limpeza de recursos e execução de código em momentos específicos. Primeiro, você observa na prática os comportamentos do `useEffect` em uma aplicação simples; depois, evolui a aplicação **Estação Climática**, construída no codelab `react-componentes-funcionais-usestate`.

### O que você vai aprender

* O que são efeitos colaterais (*side effects*) e sua relação com o ciclo de vida dos componentes de classe
* A sintaxe do `useEffect` e o papel do array de dependências
* Quando usar a função de limpeza e como ela evita *memory leaks*
* Como obter a localização automaticamente assim que a aplicação inicia
* Como dividir a aplicação em componentes e passar estado e funções via props
* Como criar um timer com `setInterval` e cancelá-lo com `clearInterval`
* Renderização condicional com um Spinner do Bootstrap e valores padrão de props

### O que você vai precisar

* Node.js e npm instalados
* O projeto `estacao-climatica` do codelab `react-componentes-funcionais-usestate`
* Um navegador com o Chrome Dev Tools (ou equivalente)

## Efeitos colaterais e o hook useEffect
Duration: 6:00

Em aplicações React, algumas operações não estão diretamente relacionadas com a produção de JSX. Exemplos incluem:

* Obter dados de uma API ou do navegador (ex.: geolocalização).
* Configurar timers com `setInterval` ou `setTimeout`.
* Registrar ou remover *event listeners*.
* Manipular o título da página.

Essas operações são chamadas de **efeitos colaterais** (*side effects*). Em componentes baseados em classes, elas eram realizadas nos métodos do ciclo de vida (`componentDidMount`, `componentDidUpdate` e `componentWillUnmount`). Em componentes funcionais, utilizamos o hook `useEffect`.

<aside class="positive">

**Link — Documentação oficial do useEffect:** [https://react.dev/reference/react/useEffect](https://react.dev/reference/react/useEffect)

</aside>

A tabela a seguir mostra a correspondência entre os métodos de ciclo de vida e o `useEffect`.

| Situação | Ciclo de vida (classes) | Hooks (funções) |
| --- | --- | --- |
| Executar código após a primeira renderização | `componentDidMount` | `useEffect(() => {...}, [])` |
| Executar código após cada atualização de estado | `componentDidUpdate` | `useEffect(() => {...})` ou `useEffect(() => {...}, [dep])` |
| Executar código quando o componente é removido do DOM | `componentWillUnmount` | Função de limpeza retornada pelo `useEffect` |

### Sintaxe do useEffect

A forma geral do `useEffect` é:

**Sintaxe**

```javascript
useEffect(() => {
  // codigo do efeito
  return () => {
    // funcao de limpeza (opcional)
  }
}, [dependencias])
```

Onde:

* O **primeiro argumento** é a função que contém o efeito colateral.
* A **função de limpeza** (retornada opcionalmente) é executada quando o componente é removido do DOM ou antes de o efeito ser re-executado.
* O **array de dependências** (segundo argumento) controla quando o efeito é executado.

O comportamento do `useEffect` varia de acordo com o array de dependências. Veja a tabela a seguir.

| Array de dependências | Comportamento |
| --- | --- |
| Sem array | O efeito executa após **toda** renderização. |
| `[]` (array vazio) | O efeito executa **apenas uma vez**, após a primeira renderização. |
| `[a, b]` | O efeito executa após a primeira renderização e **sempre que `a` ou `b` mudarem** de valor. |

A figura a seguir ilustra o funcionamento do `useEffect`.

![Diagrama em três colunas: Montagem (componente renderiza pela primeira vez e o useEffect executa o efeito), Atualização (estado muda, a função de limpeza executa se existir e o useEffect executa o efeito novamente, conforme o array de dependências) e Desmontagem (componente é removido do DOM e a função de limpeza executa)](img/ciclo-useeffect.webp)

*Montagem, atualização e desmontagem com o `useEffect`.*

<aside class="negative">

**Nota.** A função de limpeza é fundamental para evitar *memory leaks*. Sempre que um efeito alocar um recurso (timer, listener, subscription), a função de limpeza deve liberá-lo.

</aside>

## Na prática: preparando a aplicação de testes
Duration: 5:00

Antes de prosseguir com a aplicação Estação Climática, vamos construir uma aplicação simples para observar na prática os três comportamentos do `useEffect`. A aplicação terá um campo de texto e um contador com botão de incremento. A figura a seguir mostra a aparência da aplicação.

![Página "Efeitos Colaterais" com um campo de texto contendo "Olá mundo" e um botão "Contador: 3"](img/efeitos-app.webp)

*A aplicação usada para observar os efeitos.*

Cada interação do usuário (digitar no campo ou clicar no botão) provoca uma re-renderização do componente, o que nos permitirá observar quando cada forma do `useEffect` é executada.

### Criando o projeto

Crie um novo projeto com Vite:

**Terminal**

```bash
npm create vite@latest efeitos -- --template react
cd efeitos
npm install
```

Apague todos os arquivos da pasta `src` e crie o arquivo `src/main.jsx`. Veja o código a seguir.

**src/main.jsx**

```jsx
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root')
)
root.render(<App />)
```

Crie também o arquivo `src/App.jsx` com a estrutura inicial. Veja o código a seguir.

**src/App.jsx**

```jsx
import { useState } from 'react'

function App() {
  const [texto, setTexto] = useState('')
  const [contador, setContador] = useState(0)

  return (
    <div style={{ padding: '20px' }}>
      <h2>Efeitos Colaterais</h2>
      <div>
        <input
          type="text"
          placeholder="Digite algo..."
          value={texto}
          onChange={(e) =>
            setTexto(e.target.value)
          }
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <button onClick={() =>
          setContador(contador + 1)
        }>
          Contador: {contador}
        </button>
      </div>
    </div>
  )
}

export default App
```

Execute `npm run dev` e confirme que o campo de texto e o botão funcionam.

## Os três comportamentos do useEffect
Duration: 10:00

### Caso 1 — useEffect sem array de dependências

Quando o `useEffect` é chamado sem o segundo argumento (array de dependências), o efeito executa após **toda** renderização: a primeira e todas as subsequentes. Adicione o `useEffect` ao componente. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
import { useState, useEffect } from 'react'

function App() {
  const [texto, setTexto] = useState('')
  const [contador, setContador] = useState(0)

  useEffect(() => {
    console.log('Efeito executou (sem vetor)')
  })

  return (
    // ... (JSX como antes)
  )
}
```

Abra o Chrome Dev Tools (`CTRL + SHIFT + I`) e observe a aba **Console**. Você verá `"Efeito executou (sem vetor)"` aparecer:

* Quando a página carregar (primeira renderização).
* A cada letra digitada no campo de texto (pois `texto` muda e o componente re-renderiza).
* A cada clique no botão (pois `contador` muda e o componente re-renderiza).

Qualquer mudança de estado re-renderiza o componente, e o efeito executa novamente.

### Caso 2 — useEffect com array vazio []

Quando passamos um array vazio, o efeito executa **apenas uma vez**, logo após a primeira renderização. Altere o `useEffect`. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
useEffect(() => {
  console.log('Efeito executou (com vetor vazio)')
}, [])
```

Agora, observe o console. A mensagem `"Efeito executou (com vetor vazio)"` aparece **apenas uma vez**, quando a página carrega. Digitar no campo de texto ou clicar no botão **não** dispara o efeito novamente.

### Caso 3 — useEffect com dependência específica

Quando incluímos variáveis no array de dependências, o efeito executa após a primeira renderização **e** sempre que alguma das variáveis listadas mudar. Altere o `useEffect`. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
useEffect(() => {
  console.log(
    'Efeito executou (dep: contador):',
    contador
  )
}, [contador])
```

Agora, observe o console:

* Quando a página carrega: a mensagem aparece (primeira renderização).
* Ao clicar no botão: a mensagem aparece (pois `contador` mudou).
* Ao digitar no campo de texto: a mensagem **não** aparece, mesmo que o componente re-renderize, pois `contador` não mudou.

Experimente trocar a dependência para `[texto]`. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
useEffect(() => {
  console.log(
    'Efeito executou (dep: texto):',
    texto
  )
}, [texto])
```

Agora, o efeito executa a cada letra digitada, mas **não** ao clicar no botão.

## A função de limpeza
Duration: 6:00

### Caso 4 — A função de limpeza

A função de limpeza é executada **antes** da próxima execução do efeito e também quando o componente é removido do DOM. Vamos observar esse comportamento. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
useEffect(() => {
  console.log('Efeito executou (sem vetor)')
  return () => {
    console.log('Limpeza executou (sem vetor)')
  }
})
```

Observe o console. Sem array de dependências, a cada re-renderização a sequência será:

1. `"Limpeza executou (sem vetor)"` — a limpeza do efeito **anterior**.
2. `"Efeito executou (sem vetor)"` — o novo efeito.

Na primeira renderização, apenas `"Efeito executou (sem vetor)"` aparece (pois não há efeito anterior a limpar).

### Um exemplo concreto de limpeza: atualizando o título da aba

Vamos criar um exemplo útil: atualizar o título da aba do navegador com o valor do contador. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
useEffect(() => {
  document.title =
    `Contador: ${contador}`
  console.log(
    'Titulo atualizado (dep: contador):',
    contador
  )
  return () => {
    document.title = 'React App'
    console.log(
      'Limpeza: titulo restaurado'
    )
  }
}, [contador])
```

Agora:

* A cada clique no botão, o título da aba muda para **Contador: 1**, **Contador: 2**, etc.
* Antes de cada atualização, a limpeza restaura o título para **React App** (embora aconteça tão rápido que não é visível, o console mostra a sequência).
* Se o componente fosse removido do DOM, a limpeza restauraria o título.

### Resumo dos comportamentos

A tabela a seguir resume o que observamos.

| Forma | Quando executa | Exemplo de uso |
| --- | --- | --- |
| `useEffect(fn)` | Após toda renderização | Sincronizar com sistema externo a cada mudança |
| `useEffect(fn, [])` | Apenas após a primeira renderização | Buscar dados iniciais, registrar um listener |
| `useEffect(fn, [x])` | Após a primeira renderização e quando `x` mudar | Reagir a uma mudança específica de estado |
| `return () => {...}` | Antes da re-execução do efeito e ao remover o componente | Cancelar timers, remover listeners |

## Estação Climática: localização automática
Duration: 8:00

Nesta seção, evoluiremos a aplicação **Estação Climática** desenvolvida anteriormente. A figura a seguir mostra a aparência da aplicação.

![Cartão com o ícone de guarda-sol e a palavra "Verão", as coordenadas -22.9068, -43.1729, a hora 14:32:07 e o botão "Qual a minha estação?"](img/estacao-climatica.webp)

*A aplicação Estação Climática.*

Vamos refatorá-la para utilizar o `useEffect` e criar componentes auxiliares.

### Abrindo o projeto

Abra um terminal e navegue até o diretório do projeto criado anteriormente.

**Terminal**

```bash
cd estacao-climatica
npm run dev
```

A aplicação será disponibilizada em `http://localhost:5173`.

### Obtendo a localização automaticamente com useEffect

Na versão anterior da aplicação, o usuário precisava clicar no botão para obter a localização. Agora, desejamos que a localização seja solicitada **assim que a aplicação entrar em execução**. Para isso, utilizamos o `useEffect` com um array de dependências vazio (`[]`), que faz com que o efeito execute apenas uma vez, logo após a primeira renderização.

Atualize o arquivo `src/App.jsx`. Veja o código a seguir.

**src/App.jsx**

```jsx
import { useState, useEffect } from 'react'

function App() {
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [estacao, setEstacao] = useState(null)
  const [data, setData] = useState(null)
  const [icone, setIcone] = useState(null)
  const [mensagemDeErro, setMensagemDeErro] =
    useState(null)

  const obterEstacao = (dataAtual, lat) => {
    // ... (como definido anteriormente)
  }

  const icones = {
    // ... (como definido anteriormente)
  }

  const obterLocalizacao = () => {
    // ... (como definido anteriormente)
  }

  useEffect(() => {
    obterLocalizacao()
  }, [])

  return (
    // ... (JSX como antes)
  )
}

export default App
```

Observe que:

* Importamos `useEffect` junto com `useState`.
* O array vazio `[]` garante que o efeito execute **apenas uma vez**.
* Se o array de dependências fosse omitido, o efeito executaria após toda renderização, o que causaria um **loop infinito** neste caso.

Ao atualizar a aplicação no navegador, o resultado será diferente dependendo das configurações de permissão do usuário:

* Caso o navegador esteja configurado para permitir o acesso à localização, as informações serão exibidas imediatamente.
* Caso o navegador esteja configurado para bloquear o acesso, a aplicação exibirá a mensagem de erro.
* Caso ainda não exista opção previamente selecionada, o navegador perguntará ao usuário se ele permite ou bloqueia o acesso.

Para fazer testes, você pode configurar o navegador para que ele pergunte ao usuário. No Chrome, clique no ícone ao lado da barra de navegação e altere a opção **Location**.

### Registrando a execução dos efeitos no console

Para entender melhor a ordem de execução, vamos adicionar mensagens de log. Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
useEffect(() => {
  console.log('useEffect executou')
  obterLocalizacao()
}, [])

console.log('renderizou')

return (
```

Abra o Chrome Dev Tools (`CTRL + SHIFT + I`) e observe o console. Você verá que `"renderizou"` aparece **antes** de `"useEffect executou"`. Isso confirma que o efeito é executado **após** a renderização, e não durante.

Ao clicar no botão da aplicação (se ele ainda existir), novas linhas de `"renderizou"` aparecerão, mas não novas linhas de `"useEffect executou"`, pois o array de dependências vazio impede a re-execução.

Após o teste, remova as mensagens de log.

## Componente EstacaoClimatica e props
Duration: 8:00

### Refatorando: componente EstacaoClimatica

Nossa aplicação possui um único componente responsável por resolver todos os problemas. Vamos criar um componente cuja finalidade será apenas **exibir** os dados referentes à estação climática, uma vez que eles estiverem disponíveis. O componente principal continuará responsável por obter os dados e gerenciar o estado.

Crie o arquivo `src/EstacaoClimatica.jsx`. Veja o código a seguir.

**src/EstacaoClimatica.jsx**

```jsx
function EstacaoClimatica({
  icone, estacao, latitude, longitude,
  obterLocalizacao
}) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex align-items-center border rounded mb-2"
          style={{ height: '6rem' }}>
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
                ? `Coordenadas: ${latitude}, ${longitude}`
                : 'Clique no botão para saber a sua estação'
            }
          </p>
        </div>
        <button onClick={obterLocalizacao}
          className="btn btn-outline-primary w-100 mt-2">
          Qual a minha estação?
        </button>
      </div>
    </div>
  )
}

export default EstacaoClimatica
```

Observe que o componente `EstacaoClimatica` é uma função que recebe os dados via **props** (desestruturados nos parâmetros). Ele não possui estado próprio.

### Passando estado via props

O componente `App` passa partes de seu estado ao componente `EstacaoClimatica` via props. Atualize o arquivo `App.jsx`. Veja o código a seguir.

**src/App.jsx**

```jsx
import { useState, useEffect } from 'react'
import EstacaoClimatica from './EstacaoClimatica'

function App() {
  // ... (estado e funcoes como antes)

  useEffect(() => {
    obterLocalizacao()
  }, [])

  return (
    <div className="container mt-2">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <EstacaoClimatica
            icone={icone}
            estacao={estacao}
            latitude={latitude}
            longitude={longitude}
            obterLocalizacao={obterLocalizacao}
          />
        </div>
      </div>
    </div>
  )
}

export default App
```

Observe que a função `obterLocalizacao` também é passada via props. Ela pertence ao componente `App`, pois é responsável por alterar o **seu** estado. O componente `EstacaoClimatica` apenas a invoca quando o botão é clicado.

## Um timer com useEffect e função de limpeza
Duration: 8:00

Suponha que desejamos que o horário, uma vez exibido, seja **incrementado a cada segundo**. Em JavaScript, utilizamos a função `setInterval` para agendar execuções periódicas e `clearInterval` para cancelá-las.

O componente `EstacaoClimatica` passará a ter um estado próprio (`dataAtual`) e um `useEffect` que configura o timer. Veja o código a seguir.

**src/EstacaoClimatica.jsx**

```jsx
import { useState, useEffect } from 'react'

function EstacaoClimatica({
  icone, estacao, latitude, longitude,
  obterLocalizacao
}) {
  const [dataAtual, setDataAtual] = useState(null)

  useEffect(() => {
    console.log('timer iniciado')
    const timer = setInterval(() => {
      setDataAtual(
        new Date().toLocaleTimeString()
      )
    }, 1000)

    return () => {
      console.log('timer cancelado')
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="card">
      <div className="card-body">
        {/* ... icone, estacao ... */}
        <div>
          <p className="text-center">
            {
              latitude
                ? `Coordenadas: ${latitude}, ${longitude}. Data: ${dataAtual}`
                : 'Clique no botão para saber a sua estação'
            }
          </p>
        </div>
        {/* ... botao ... */}
      </div>
    </div>
  )
}

export default EstacaoClimatica
```

Observe que:

* O `useEffect` configura o timer logo após a primeira renderização do componente.
* A **função de limpeza** (`return () => {...}`) cancela o timer quando o componente for removido do DOM.
* Sem a função de limpeza, o timer continuaria executando mesmo após o componente ser removido, causando um *memory leak*.

### Decidindo o que exibir com renderização condicional

O componente `App` agora decidirá o que exibir: se o usuário bloqueou o acesso, exibe uma mensagem de erro; caso contrário, exibe o componente `EstacaoClimatica`. Quando o componente `EstacaoClimatica` for removido do DOM (porque o usuário bloqueou), a função de limpeza do `useEffect` será executada, cancelando o timer.

Veja o código a seguir.

**src/App.jsx · trecho**

```jsx
return (
  <div className="container mt-2">
    <div className="row justify-content-center">
      <div className="col-md-8">
        {
          mensagemDeErro
            ? <p className="border rounded p-2 fs-4 text-center">
                É preciso dar permissão
                para acesso à localização.
                Atualize a página e tente
                novamente.
              </p>
            : <EstacaoClimatica
                icone={icone}
                estacao={estacao}
                latitude={latitude}
                longitude={longitude}
                obterLocalizacao=
                  {obterLocalizacao}
              />
        }
      </div>
    </div>
  </div>
)
```

Para testar, abra o Chrome Dev Tools e observe o console. Instrua o navegador a pedir permissão e atualize a página. Antes de decidir, você verá `"timer iniciado"` no console. Ao clicar em **Block**, o componente `EstacaoClimatica` será removido do DOM e `"timer cancelado"` aparecerá no console, confirmando que a função de limpeza foi executada.

## Um Spinner: o componente Loading
Duration: 8:00

Quando a aplicação inicia, antes de o usuário decidir se permite ou bloqueia o acesso à localização, podemos exibir um componente indicando que a aplicação aguarda essa decisão. Utilizaremos um **Spinner** do Bootstrap.

<aside class="positive">

**Link — Documentação do Spinner (Bootstrap):** [https://getbootstrap.com/docs/5.3/components/spinners/](https://getbootstrap.com/docs/5.3/components/spinners/)

</aside>

Crie o arquivo `src/Loading.jsx`. Veja o código a seguir.

**src/Loading.jsx**

```jsx
function Loading({ mensagem = 'Carregando' }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center border rounded p-3">
      <div className="spinner-border text-primary"
        style={{
          width: '3rem', height: '3rem'
        }}>
        <span className="visually-hidden">
          Carregando...
        </span>
      </div>
      <p className="text-primary mt-2">
        {mensagem}
      </p>
    </div>
  )
}

export default Loading
```

Observe que o valor padrão de `mensagem` é definido diretamente nos parâmetros da função (`mensagem = 'Carregando'`). Esse é o mecanismo moderno do JavaScript para definir **valores padrão de props**, substituindo o antigo `defaultProps` utilizado em componentes de classe.

Se o componente `App` não passar a prop `mensagem`, o valor `'Carregando'` será utilizado automaticamente.

### Integrando o Loading ao componente App

Atualize a renderização condicional no componente `App`. A tabela a seguir resume a lógica.

| Verificação | Significado | Exibir |
| --- | --- | --- |
| Ainda não há latitude e nem mensagem de erro | Usuário ainda não decidiu sobre a permissão | Componente `Loading` |
| Já existe mensagem de erro | Usuário bloqueou o acesso | Texto com mensagem de erro |
| Já existe latitude | Usuário permitiu o acesso | Componente `EstacaoClimatica` |

Veja o código a seguir.

**src/App.jsx**

```jsx
import { useState, useEffect } from 'react'
import EstacaoClimatica from './EstacaoClimatica'
import Loading from './Loading'

function App() {
  // ... (estado e funcoes como antes)

  useEffect(() => {
    obterLocalizacao()
  }, [])

  return (
    <div className="container mt-2">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {
            (!latitude && !mensagemDeErro)
              ? <Loading mensagem=
                  "Por favor, responda à solicitação de localização"
                />
              : mensagemDeErro
                ? <p className="border rounded p-2 fs-4 text-center">
                    É preciso dar permissão
                    para acesso à localização.
                    Atualize a página e tente
                    novamente.
                  </p>
                : <EstacaoClimatica
                    icone={icone}
                    estacao={estacao}
                    latitude={latitude}
                    longitude={longitude}
                    obterLocalizacao=
                      {obterLocalizacao}
                  />
          }
        </div>
      </div>
    </div>
  )
}

export default App
```

Para testar sem passar a prop `mensagem`, basta trocar por:

**src/App.jsx · trecho**

```jsx
<Loading />
```

Neste caso, o texto padrão "Carregando" será exibido.

## Código completo
Duration: 6:00

<aside class="positive">

Na apostila, algumas strings e classes CSS do código completo aparecem quebradas em várias linhas apenas para caber na página. Aqui elas estão em uma única linha, como nos trechos dos passos anteriores.

</aside>

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

**src/App.jsx**

```jsx
import { useState, useEffect } from 'react'
import EstacaoClimatica from './EstacaoClimatica'
import Loading from './Loading'

function App() {
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [estacao, setEstacao] = useState(null)
  const [icone, setIcone] = useState(null)
  const [mensagemDeErro, setMensagemDeErro] =
    useState(null)

  const obterEstacao = (dataAtual, lat) => {
    const ano = dataAtual.getFullYear()
    const d1 = new Date(ano, 5, 21)
    const d2 = new Date(ano, 8, 24)
    const d3 = new Date(ano, 11, 22)
    const d4 = new Date(ano, 2, 21)
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
    window.navigator.geolocation
      .getCurrentPosition(
        (posicao) => {
          const dataAtual = new Date()
          const est = obterEstacao(
            dataAtual,
            posicao.coords.latitude
          )
          setLatitude(posicao.coords.latitude)
          setLongitude(posicao.coords.longitude)
          setEstacao(est)
          setIcone(icones[est])
        },
        (erro) => {
          console.log(erro)
          setMensagemDeErro(
            'Tente novamente mais tarde'
          )
        }
      )
  }

  useEffect(() => {
    obterLocalizacao()
  }, [])

  return (
    <div className="container mt-2">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {
            (!latitude && !mensagemDeErro)
              ? <Loading mensagem=
                  "Por favor, responda à solicitação de localização"
                />
              : mensagemDeErro
                ? <p className="border rounded p-2 fs-4 text-center">
                    É preciso dar permissão
                    para acesso à localização.
                    Atualize a página e tente
                    novamente.
                  </p>
                : <EstacaoClimatica
                    icone={icone}
                    estacao={estacao}
                    latitude={latitude}
                    longitude={longitude}
                    obterLocalizacao=
                      {obterLocalizacao}
                  />
          }
        </div>
      </div>
    </div>
  )
}

export default App
```

**src/EstacaoClimatica.jsx**

```jsx
import { useState, useEffect } from 'react'

function EstacaoClimatica({
  icone, estacao, latitude, longitude,
  obterLocalizacao
}) {
  const [dataAtual, setDataAtual] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setDataAtual(
        new Date().toLocaleTimeString()
      )
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex align-items-center border rounded mb-2"
          style={{ height: '6rem' }}>
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
                ? `Coordenadas: ${latitude}, ${longitude}. Data: ${dataAtual}`
                : 'Clique no botão para saber a sua estação'
            }
          </p>
        </div>
        <button onClick={obterLocalizacao}
          className="btn btn-outline-primary w-100 mt-2">
          Qual a minha estação?
        </button>
      </div>
    </div>
  )
}

export default EstacaoClimatica
```

**src/Loading.jsx**

```jsx
function Loading({ mensagem = 'Carregando' }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center border rounded p-3">
      <div className="spinner-border text-primary"
        style={{
          width: '3rem', height: '3rem'
        }}>
        <span className="visually-hidden">
          Carregando...
        </span>
      </div>
      <p className="text-primary mt-2">
        {mensagem}
      </p>
    </div>
  )
}

export default Loading
```

## Referências
Duration: 3:00

Parabéns! Você usou o `useEffect` para executar código após a renderização, reagir a mudanças de estado, criar e cancelar timers e montar uma interface com renderização condicional.

* BOOTSTRAP. **Build fast, responsive sites.** 2024. Disponível em [https://getbootstrap.com/](https://getbootstrap.com/). Acesso em 2026.
* BOOTSTRAP. **Spinners.** 2024. Disponível em [https://getbootstrap.com/docs/5.3/components/spinners/](https://getbootstrap.com/docs/5.3/components/spinners/). Acesso em 2026.
* MDN WEB DOCS. **Geolocation API.** 2024. Disponível em [https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API). Acesso em 2026.
* MDN WEB DOCS. **setInterval.** 2024. Disponível em [https://developer.mozilla.org/en-US/docs/Web/API/setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval). Acesso em 2026.
* REACT. **The library for web and native user interfaces.** 2024. Disponível em [https://react.dev/](https://react.dev/). Acesso em 2026.
* REACT. **useEffect Hook.** 2024. Disponível em [https://react.dev/reference/react/useEffect](https://react.dev/reference/react/useEffect). Acesso em 2026.
* VITE. **Next Generation Frontend Tooling.** 2024. Disponível em [https://vite.dev/](https://vite.dev/). Acesso em 2026.
