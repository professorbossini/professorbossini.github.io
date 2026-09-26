summary: Construa um contador interativo com React, Vite e o hook useState, gere o build de produção e publique a aplicação no GitHub Pages com o pacote gh-pages.
id: react-contador-vite-github-pages
categories: React,Git,JavaScript
tags: react,vite,usestate,github pages,gh-pages,deploy,build,git
status: Published
authors: Rodrigo Bossini
last updated: 2026-03-20
pdf: react/novo/0x_apostila_react_contador_vite_github_pages.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React e Vite: contador publicado no GitHub Pages

## Visão geral
Duration: 3:00

Neste material, o objetivo principal é aprender a implantar uma aplicação React no **GitHub Pages**. Para isso, desenvolveremos uma aplicação simples — um contador interativo — que servirá como base para o processo de implantação. A construção da aplicação é breve e direta; o foco real está em entender o build de produção, a configuração do repositório e o passo a passo completo para colocar o projeto no ar.

Utilizaremos o **Vite** como ferramenta de build e o template React para criar o projeto.

A figura a seguir mostra como ficará a interface gráfica da aplicação finalizada.

![Aplicação Contador React exibindo o valor 0 em destaque e os botões vermelho "− Diminuir", cinza "Zerar" e verde "+ Aumentar", com o rodapé "Feito com React + Vite"](img/contador-final.webp)

*A aplicação de contador finalizada.*

### O que você vai aprender

* Criar uma aplicação React com o Vite
* Usar o hook `useState` para guardar o valor do contador
* Tratar cliques com o atributo `onClick`
* Estilizar a aplicação com CSS
* Gerar o build de produção e conferi-lo com `npm run preview`
* Criar um repositório no GitHub e enviar o código com Git
* Configurar a propriedade `base` do Vite e publicar com o pacote `gh-pages`
* Configurar o GitHub Pages e atualizar a aplicação publicada

### O que você vai precisar

* Node.js e npm instalados
* Git instalado e configurado
* Uma conta no GitHub
* Um editor de código (por exemplo, o VS Code) e um navegador

## Criando a aplicação e preparando o ambiente
Duration: 6:00

Utilizando um terminal, use o comando a seguir para criar a aplicação com Vite e o template React.

**Terminal**

```bash
npm create vite@latest contador -- --template react
```

A seguir, navegue até o diretório recém-criado.

**Terminal**

```bash
cd contador
```

Instale as dependências do projeto.

**Terminal**

```bash
npm install
```

Por fim, coloque a aplicação em funcionamento com o comando a seguir.

**Terminal**

```bash
npm run dev
```

O terminal mostrará uma URL, geralmente `http://localhost:5173`. Abra-a em seu navegador para visualizar a aplicação padrão do Vite.

Abra o projeto em seu editor de código. Caso use o VS Code, pode utilizar o comando a seguir.

**Terminal**

```bash
code .
```

### Limpando os arquivos iniciais

O Vite cria alguns arquivos de exemplo que não utilizaremos. Vamos limpar o projeto.

Apague todo o conteúdo do arquivo `src/App.css`. Em seguida, substitua o conteúdo do arquivo `src/App.jsx` pelo código a seguir.

**src/App.jsx**

```jsx
import './App.css'

function App() {
  return (
    <div>
      <h1>Contador</h1>
    </div>
  )
}

export default App
```

Também substitua o conteúdo do arquivo `src/index.css` pelo reset básico a seguir.

**src/index.css**

```css
* {
  margin: 0;               /* remove margem padrao */
  padding: 0;              /* remove padding padrao */
  box-sizing: border-box;  /* inclui borda no tamanho */
}
```

Salve os arquivos e verifique no navegador que a aplicação exibe apenas o texto **Contador**. Esse será o nosso ponto de partida.

## O estado do contador com useState
Duration: 6:00

Agora vamos fazer o contador funcionar de verdade. Para isso, utilizaremos o hook `useState`, que permite associar estado a um componente funcional. O `useState` recebe um valor inicial como argumento e retorna um array com dois elementos: o valor atual do estado e uma função para atualizá-lo.

Veja o código a seguir, que mostra o arquivo `src/App.jsx` com o estado do contador implementado. As linhas novas são o `import` do `useState`, a declaração do estado e o parágrafo que exibe `{contador}`.

**src/App.jsx**

```jsx
import './App.css'
import { useState } from 'react'

function App() {
  const [contador, setContador] = useState(0)

  return (
    <div>
      <h1>Contador</h1>
      <p>{contador}</p>
    </div>
  )
}

export default App
```

Neste código, a chamada `useState(0)` cria uma variável de estado chamada `contador` com valor inicial `0` e uma função `setContador` que será usada para atualizar esse valor. Quando o `setContador` é chamado com um novo valor, o React renderiza o componente novamente, exibindo o valor atualizado na tela.

Note que, na expressão JSX, utilizamos `{contador}` entre chaves para exibir o valor atual do estado diretamente na interface.

## Botões de incremento, decremento e reset
Duration: 8:00

Agora, adicionaremos três funções que alteram o estado do contador e três botões para chamá-las. Veja o código a seguir, em que as três funções são as linhas novas.

**src/App.jsx**

```jsx
import './App.css'
import { useState } from 'react'

function App() {
  const [contador, setContador] = useState(0)

  const incrementar = () => setContador(contador + 1)
  const decrementar = () => setContador(contador - 1)
  const reiniciar = () => setContador(0)

  return (
    <div>
      <h1>Contador</h1>
      <p>{contador}</p>
    </div>
  )
}

export default App
```

Cada uma dessas funções utiliza o `setContador` para definir um novo valor para o estado. A função `incrementar` soma 1 ao valor atual, a `decrementar` subtrai 1 e a `reiniciar` volta o valor para 0.

Agora, adicionamos os botões na expressão JSX, conectando cada um à respectiva função por meio do atributo `onClick`. Veja o código a seguir, em que toda a expressão JSX devolvida pelo `return` foi substituída.

**src/App.jsx**

```jsx
import './App.css'
import { useState } from 'react'

function App() {
  const [contador, setContador] = useState(0)

  const incrementar = () => setContador(contador + 1)
  const decrementar = () => setContador(contador - 1)
  const reiniciar = () => setContador(0)

  return (
    <div className="app">
      <h1>Contador React</h1>
      <div className="display">
        <span className="numero">{contador}</span>
      </div>
      <div className="botoes">
        <button className="btn diminuir"
          onClick={decrementar}>
          - Diminuir
        </button>
        <button className="btn zerar"
          onClick={reiniciar}>
          Zerar
        </button>
        <button className="btn aumentar"
          onClick={incrementar}>
          + Aumentar
        </button>
      </div>
      <p className="rodape">Feito com React + Vite</p>
    </div>
  )
}

export default App
```

Cada botão possui o atributo `onClick`, que recebe a referência para a função correspondente. Quando o usuário clica em um botão, a função é executada, o estado é atualizado e o React re-renderiza o componente automaticamente, refletindo o novo valor do contador na tela.

Repare que utilizamos `className` em vez de `class` para definir classes CSS. Isso ocorre porque `class` é uma palavra reservada do JavaScript. As classes CSS que referenciamos (`app`, `display`, `numero`, `botoes`, `btn`, etc.) serão definidas na próxima etapa.

## Estilizando a aplicação com CSS
Duration: 6:00

Agora, vamos deixar a aplicação com uma aparência agradável. Abra o arquivo `src/App.css` e adicione o código a seguir.

**src/App.css · parte 1 de 2**

```css
.app {
  display: flex;                       /* layout flexbox */
  flex-direction: column;              /* empilha na vertical */
  align-items: center;                 /* centraliza horizontalmente */
  justify-content: center;             /* centraliza verticalmente */
  min-height: 100vh;                   /* ocupa toda a tela */
  font-family: 'Segoe UI', sans-serif; /* fonte */
  background-color: #f0f2f5;           /* fundo cinza claro */
}

.app h1 {
  color: #444;                         /* cor do texto */
  margin-bottom: 20px;                 /* espaco abaixo */
  font-size: 1.8rem;                   /* tamanho da fonte */
}

.display {
  background-color: #e8edf3;           /* fundo azul suave */
  border-radius: 12px;                 /* cantos arredondados */
  padding: 30px 60px;                  /* espaco interno */
  margin-bottom: 24px;                 /* espaco abaixo */
  border: 1px solid #cdd5e0;           /* borda fina */
}

.numero {
  font-size: 3.5rem;                   /* fonte grande */
  font-weight: bold;                   /* negrito */
  color: #2c5282;                      /* azul escuro */
}

.botoes {
  display: flex;                       /* lado a lado */
  gap: 12px;                           /* espaco entre botoes */
}
```

Veja a continuação do arquivo `src/App.css` a seguir.

**src/App.css · parte 2 de 2**

```css
.btn {
  padding: 12px 24px;                  /* espaco interno */
  font-size: 1rem;                     /* tamanho da fonte */
  font-weight: bold;                   /* negrito */
  border: none;                        /* sem borda */
  border-radius: 8px;                  /* cantos arredondados */
  cursor: pointer;                     /* cursor de mao */
  color: white;                        /* texto branco */
  transition: opacity 0.2s;            /* transicao suave */
}

.btn:hover {
  opacity: 0.85;                       /* leve transparencia */
}

.diminuir {
  background-color: #e53e3e;           /* vermelho */
}

.zerar {
  background-color: #a0aec0;           /* cinza */
}

.aumentar {
  background-color: #38a169;           /* verde */
}

.rodape {
  margin-top: 30px;                    /* espaco acima */
  color: #aaa;                         /* cinza claro */
  font-size: 0.85rem;                  /* fonte menor */
}
```

Salve o arquivo e verifique o resultado no navegador. A aplicação deverá exibir o contador centralizado na tela, com o valor numérico destacado e três botões coloridos logo abaixo. Experimente clicar nos botões para verificar que tudo funciona corretamente.

### Código final completo

Para referência, veja o código completo e final do arquivo `src/App.jsx` a seguir.

**src/App.jsx**

```jsx
import './App.css'
import { useState } from 'react'

function App() {
  const [contador, setContador] = useState(0)

  const incrementar = () => setContador(contador + 1)
  const decrementar = () => setContador(contador - 1)
  const reiniciar = () => setContador(0)

  return (
    <div className="app">
      <h1>Contador React</h1>
      <div className="display">
        <span className="numero">{contador}</span>
      </div>
      <div className="botoes">
        <button className="btn diminuir"
          onClick={decrementar}>
          - Diminuir
        </button>
        <button className="btn zerar"
          onClick={reiniciar}>
          Zerar
        </button>
        <button className="btn aumentar"
          onClick={incrementar}>
          + Aumentar
        </button>
      </div>
      <p className="rodape">Feito com React + Vite</p>
    </div>
  )
}

export default App
```

## Fazendo o build da aplicação
Duration: 4:00

Até agora, trabalhamos no modo de desenvolvimento, usando o comando `npm run dev`. Nesse modo, o Vite disponibiliza um servidor local com *hot module replacement* (HMR), o que significa que as alterações feitas no código são refletidas imediatamente no navegador, sem precisar atualizar a página manualmente. Esse modo é ideal para desenvolvimento, mas não é adequado para colocar a aplicação no ar, pois os arquivos não estão otimizados.

Para gerar uma versão otimizada e pronta para produção, utilizamos o comando de build.

**Terminal**

```bash
npm run build
```

O Vite processará todos os arquivos do projeto e gerará uma pasta chamada `dist` na raiz do projeto. Essa pasta conterá os arquivos finais da aplicação, prontos para serem servidos por qualquer servidor web estático. Os arquivos gerados incluem o HTML principal e os arquivos JavaScript e CSS, que são minificados e possuem um *hash* no nome para controle de cache.

Para verificar se o build funcionou corretamente antes de publicar, podemos usar o comando a seguir, que inicia um servidor local apontando para a pasta `dist`.

**Terminal**

```bash
npm run preview
```

O terminal mostrará uma URL (geralmente `http://localhost:4173`). Abra-a no navegador e verifique que a aplicação se comporta da mesma forma que no modo de desenvolvimento.

## GitHub Pages e pré-requisitos
Duration: 5:00

O **GitHub Pages** é um serviço gratuito de hospedagem de sites estáticos oferecido pelo GitHub. Ele permite que qualquer pessoa publique páginas web diretamente a partir de um repositório GitHub, sem precisar contratar um servidor ou configurar infraestrutura. É uma excelente opção para publicar aplicações front-end como a que desenvolvemos.

O funcionamento é simples: o GitHub lê os arquivos de um branch específico do seu repositório (geralmente chamado `gh-pages`) e os serve como um site estático, acessível por meio de uma URL pública no formato:

**URL pública**

```text
https://seu-usuario.github.io/nome-do-repositorio/
```

A seguir, veremos o passo a passo completo e detalhado para implantar a nossa aplicação de contador.

### Pré-requisitos

Antes de prosseguir, certifique-se de que os seguintes itens estão em ordem.

**Conta no GitHub.** Caso ainda não possua, acesse [https://github.com](https://github.com) e crie uma conta gratuitamente. Você precisará de um nome de usuário e um e-mail válido.

**Git instalado.** O Git é o sistema de controle de versão que usaremos para enviar o código ao GitHub. Para verificar se ele já está instalado, abra um terminal e execute o comando a seguir.

**Terminal**

```bash
git version
```

Se o Git estiver instalado, o terminal exibirá algo como `git version 2.43.0` (o número da versão pode variar). Caso o comando não seja reconhecido, instale o Git a partir de [https://git-scm.com/downloads](https://git-scm.com/downloads).

**Git configurado.** Caso seja a primeira vez que você usa o Git na sua máquina, é necessário configurar o seu nome e e-mail. Esses dados ficam registrados em cada commit que você fizer. Execute os dois comandos a seguir, substituindo pelos seus dados.

**Terminal**

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

**Node.js e npm instalados.** Já utilizamos ambos ao longo de todo o material, então eles já devem estar disponíveis. Caso queira confirmar, execute o comando a seguir.

**Terminal**

```bash
node --version
npm --version
```

Ambos devem exibir um número de versão.

## Passos 1 a 4: repositório e primeiro push
Duration: 10:00

### Passo 1 — Criar um repositório no GitHub

Acesse [https://github.com](https://github.com) e faça login na sua conta. No canto superior direito da página, clique no ícone **+** (o sinal de mais) e selecione a opção **New repository** (Novo repositório).

Na tela de criação do repositório, preencha os campos da seguinte forma:

* **Repository name:** digite `contador` (ou o nome que preferir — lembre-se desse nome, pois ele será usado mais adiante).
* **Description:** campo opcional. Pode escrever algo como "Aplicação de contador feita com React e Vite".
* **Visibilidade:** selecione **Public**. O GitHub Pages funciona com repositórios públicos em contas gratuitas.

<aside class="negative">

**Importante:** **não** marque nenhuma das opções da seção "Initialize this repository with". Não marque "Add a README file", não escolha `.gitignore` e não escolha licença. Queremos um repositório completamente vazio, pois já temos o projeto pronto localmente.

</aside>

Clique no botão verde **Create repository**.

Após a criação, o GitHub mostrará uma página com instruções. Nessa página, localize e copie a URL do repositório. Ela terá o formato a seguir (substitua `SEU-USUARIO` pelo seu nome de usuário real no GitHub).

**URL do repositório**

```text
https://github.com/SEU-USUARIO/contador.git
```

Mantenha essa URL copiada; você a usará no próximo passo.

### Passo 2 — Inicializar o Git no projeto local

Agora, precisamos transformar a pasta do nosso projeto em um repositório Git local e conectá-lo ao repositório remoto que acabamos de criar no GitHub.

Abra o terminal e certifique-se de estar dentro do diretório do projeto (`contador`). Caso não esteja, navegue até ele.

**Terminal**

```bash
cd contador
```

Inicialize o repositório Git local. Esse comando cria uma pasta oculta chamada `.git` dentro do projeto, que é onde o Git armazena todo o histórico de alterações.

**Terminal**

```bash
git init
```

O terminal exibirá uma mensagem confirmando que o repositório foi inicializado, algo como `Initialized empty Git repository in .../contador/.git/`.

### Passo 3 — Fazer o primeiro commit

Antes de enviar o código para o GitHub, precisamos registrar o estado atual dos arquivos em um commit. Um commit é como uma foto do projeto em um determinado momento.

Primeiro, adicione todos os arquivos do projeto à área de *staging* do Git. A área de staging é onde ficam os arquivos que serão incluídos no próximo commit.

**Terminal**

```bash
git add .
```

O ponto (`.`) indica que todos os arquivos e pastas do diretório atual devem ser adicionados. O Vite já cria um arquivo `.gitignore` que exclui automaticamente pastas como `node_modules` e `dist`, então não se preocupe com elas.

Agora, crie o commit com uma mensagem descritiva.

**Terminal**

```bash
git commit -m "primeiro commit"
```

O terminal exibirá um resumo dos arquivos incluídos no commit. A flag `-m` permite escrever a mensagem do commit diretamente na linha de comando.

### Passo 4 — Conectar ao repositório remoto e enviar o código

Renomeie o branch padrão para `main`. Algumas versões do Git criam o branch inicial com o nome `master`, mas o padrão atual do GitHub é `main`. O comando a seguir garante que estamos usando o nome correto.

**Terminal**

```bash
git branch -M main
```

A flag `-M` força a renomeação, mesmo que o branch já exista.

Agora, conecte o repositório local ao repositório remoto no GitHub. O comando a seguir registra o endereço do repositório remoto com o nome `origin` (esse é o nome convencional para o repositório remoto principal).

**Terminal**

```bash
git remote add origin https://github.com/SEU-USUARIO/contador.git
```

Substitua `SEU-USUARIO` pelo seu nome de usuário real no GitHub.

Finalmente, envie o código para o GitHub. O comando `push` transfere os commits do repositório local para o remoto.

**Terminal**

```bash
git push -u origin main
```

A flag `-u` (ou `--set-upstream`) configura o branch `main` local para rastrear o branch `main` remoto. Isso significa que, nos próximos pushes, bastará digitar apenas `git push`, sem precisar especificar `origin main` novamente.

<aside class="positive">

Se for a primeira vez que você faz push para o GitHub nesta máquina, o terminal poderá solicitar suas credenciais (usuário e senha ou token de acesso pessoal). Siga as instruções exibidas. Caso use autenticação por token, acesse [https://github.com/settings/tokens](https://github.com/settings/tokens) para gerar um.

</aside>

Após a conclusão, acesse o repositório no GitHub pelo navegador e confirme que os arquivos do projeto estão lá.

## Passos 5 a 8: configurando e executando o deploy
Duration: 10:00

### Passo 5 — Configurar a propriedade base no Vite

Quando a aplicação é publicada no GitHub Pages, ela não fica na raiz do domínio, mas sim em uma subpasta. Por exemplo, se o seu usuário é `joao` e o repositório é `contador`, a URL será `https://joao.github.io/contador/`. Repare na subpasta `/contador/` ao final.

Para que o Vite gere os caminhos dos arquivos corretamente (apontando para a subpasta em vez da raiz), precisamos configurar a propriedade `base` no arquivo de configuração do Vite.

Abra o arquivo `vite.config.js` (ele fica na raiz do projeto) e adicione a linha `base: '/contador/',`.

**vite.config.js**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/contador/',
})
```

Substitua `/contador/` pelo nome do seu repositório, caso tenha usado um nome diferente. O valor deve estar entre barras e corresponder exatamente ao nome do repositório.

Sem essa configuração, ao abrir a aplicação no GitHub Pages, os arquivos JavaScript e CSS não seriam encontrados, e a página ficaria em branco ou com erro.

### Passo 6 — Instalar o pacote gh-pages

O pacote `gh-pages` é uma ferramenta que automatiza o processo de publicação. Ele pega o conteúdo de uma pasta (no nosso caso, `dist`) e o envia para um branch específico do repositório remoto, sem que você precise fazer isso manualmente.

Instale-o como dependência de desenvolvimento com o comando a seguir.

**Terminal**

```bash
npm install gh-pages --save-dev
```

A flag `--save-dev` indica que esse pacote é necessário apenas durante o desenvolvimento, e não em produção. Ele será adicionado à seção `"devDependencies"` do seu `package.json`.

### Passo 7 — Adicionar os scripts de deploy no package.json

Para facilitar o processo de publicação, vamos adicionar dois novos scripts ao arquivo `package.json`. Abra o arquivo e localize a seção `"scripts"`. Adicione as duas linhas `predeploy` e `deploy` mostradas a seguir.

**package.json (trecho)**

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist",
  "lint": "eslint .",
  "preview": "vite preview"
},
```

Esses dois scripts funcionam em conjunto. O `predeploy` é uma convenção do npm: todo script com o prefixo `pre` é executado automaticamente antes do script correspondente. Ou seja, quando você rodar `npm run deploy`, o npm executará primeiro `npm run predeploy` (que faz o build) e, em seguida, o deploy em si.

O script `deploy` usa o comando `gh-pages -d dist`, que faz o seguinte: ele pega todo o conteúdo da pasta `dist` (gerada pelo build), cria (ou atualiza) um branch chamado `gh-pages` no repositório remoto e envia esses arquivos para lá. O GitHub Pages, por sua vez, serve os arquivos desse branch como um site estático.

### Passo 8 — Executar o deploy pela primeira vez

Com tudo configurado, execute o comando a seguir.

**Terminal**

```bash
npm run deploy
```

O processo levará alguns segundos. Você verá no terminal a saída do build (geração da pasta `dist`) seguida pela publicação dos arquivos. Ao final, o terminal exibirá a mensagem `Published`, confirmando que os arquivos foram enviados com sucesso para o branch `gh-pages`.

<aside class="negative">

Caso encontre um erro de autenticação, verifique se as suas credenciais do GitHub estão configuradas corretamente. Se usar HTTPS, o Git poderá solicitar o seu token de acesso pessoal.

</aside>

## Passos 9 e 10: publicando e salvando no main
Duration: 8:00

### Passo 9 — Configurar o GitHub Pages no repositório

Agora, precisamos informar ao GitHub que ele deve servir o conteúdo do branch `gh-pages` como um site. Siga os passos a seguir com atenção.

1. Abra o navegador e acesse o seu repositório no GitHub, ou seja, a página `https://github.com/SEU-USUARIO/contador`.
2. No menu superior do repositório, clique na aba **Settings** (Configurações). Ela fica à direita, ao lado de **Insights**.
3. No menu lateral esquerdo da página de configurações, localize a seção **Code and automation** e clique em **Pages**.
4. Na seção **Build and deployment**, você verá um campo chamado **Source**. Selecione a opção **Deploy from a branch**.
5. Logo abaixo, no campo **Branch**, aparecerá um seletor. Clique nele e selecione **gh-pages**. No campo ao lado (que indica a pasta), mantenha **/ (root)**.
6. Clique no botão **Save**.

Após salvar, o GitHub iniciará o processo de implantação. Isso pode levar de 1 a 3 minutos na primeira vez. Você pode acompanhar o progresso clicando na aba **Actions** do repositório, onde verá um workflow em execução.

Quando a implantação for concluída, a sua aplicação estará disponível na URL a seguir.

**URL da aplicação**

```text
https://SEU-USUARIO.github.io/contador/
```

Substitua `SEU-USUARIO` pelo seu nome de usuário no GitHub. Abra essa URL no navegador e confira a sua aplicação de contador funcionando na internet.

### Passo 10 — Confirmar as alterações no branch main

O comando `npm run deploy` enviou apenas o conteúdo da pasta `dist` para o branch `gh-pages`. Porém, as alterações que fizemos nos arquivos de configuração (`vite.config.js` e `package.json`) ainda não foram salvas no branch `main`. É importante mantê-lo atualizado para que o repositório reflita o estado real do seu projeto.

Adicione todas as alterações à área de staging.

**Terminal**

```bash
git add .
```

Crie um commit descrevendo o que foi feito.

**Terminal**

```bash
git commit -m "configura deploy no GitHub Pages"
```

Envie o commit para o repositório remoto.

**Terminal**

```bash
git push origin main
```

## Atualizações futuras e resolução de problemas
Duration: 5:00

### Atualizando a aplicação no futuro

Sempre que fizer alterações no código da aplicação e quiser que elas apareçam no site publicado, o fluxo de trabalho será o seguinte.

1. Faça as alterações desejadas no código-fonte (por exemplo, em `src/App.jsx` ou `src/App.css`).
2. Teste as alterações localmente com `npm run dev`.
3. Quando estiver satisfeito, publique a nova versão no GitHub Pages.

**Terminal**

```bash
npm run deploy
```

4. Em seguida, salve o código-fonte atualizado no branch `main`.

**Terminal**

```bash
git add .
git commit -m "descricao das alteracoes"
git push origin main
```

Aguarde 1 a 2 minutos e acesse a URL da aplicação novamente para verificar que as alterações estão no ar.

### Resumo do fluxo de implantação

A tabela a seguir resume os comandos e a ordem em que são executados durante o processo de implantação.

| Comando | O que faz |
| --- | --- |
| `npm run deploy` | Executa o build e publica a pasta `dist` no branch `gh-pages` do repositório remoto. |
| `git add .` | Adiciona todas as alterações locais à área de staging do Git. |
| `git commit -m "msg"` | Cria um registro (commit) com as alterações, acompanhado de uma mensagem descritiva. |
| `git push origin main` | Envia os commits locais do branch `main` para o repositório remoto no GitHub. |

### Possíveis problemas e soluções

**A página mostra conteúdo em branco.** Verifique se a propriedade `base` no arquivo `vite.config.js` está configurada com o nome correto do repositório, entre barras (por exemplo, `'/contador/'`). Após corrigir, execute `npm run deploy` novamente.

**Erro 404 ao acessar a URL.** Confirme que, nas configurações do GitHub Pages (**Settings > Pages**), o branch selecionado é `gh-pages` e a pasta é `/ (root)`. Aguarde alguns minutos, pois a primeira implantação pode demorar.

**Erro de autenticação no push.** Se o GitHub solicitar credenciais e a sua senha não funcionar, provavelmente é necessário usar um token de acesso pessoal em vez da senha. Gere um em [https://github.com/settings/tokens](https://github.com/settings/tokens) com a permissão `repo` e use-o no lugar da senha quando o terminal solicitar.

## Referências
Duration: 3:00

Parabéns! Sua aplicação React está publicada no GitHub Pages e você conhece o fluxo para atualizá-la.

* gh-pages. **Publicação em GitHub Pages facilitada.** Disponível em [https://www.npmjs.com/package/gh-pages](https://www.npmjs.com/package/gh-pages). Acesso em março de 2026.
* GitHub Pages. **Documentação oficial.** Disponível em [https://pages.github.com/](https://pages.github.com/). Acesso em março de 2026.
* React. **Documentação oficial.** Disponível em [https://react.dev/](https://react.dev/). Acesso em março de 2026.
* Vite. **Ferramenta de build para projetos web modernos.** Disponível em [https://vite.dev/](https://vite.dev/). Acesso em março de 2026.
