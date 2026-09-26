summary: Conheça o React Native, entenda como ele se relaciona com o React, compare Expo CLI e React Native CLI e crie seu primeiro app com o Expo, executando-o no navegador.
id: rn-introducao-hello-world
categories: React Native,Mobile
tags: react native,react,expo,javascript,jsx,hello world
status: Published
authors: Rodrigo Bossini
last updated: 2024-05-03
pdf: react_native/new/001_apostila_react_native_introducao_hello_world.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React Native: introdução e Hello World

## Visão geral
Duration: 3:00

**React Native** é um framework Open Source utilizado no desenvolvimento de aplicações para dispositivos móveis que podem ser executadas nas plataformas Android e iOS. Veja o seu site oficial.

[https://reactnative.dev/](https://reactnative.dev/)

Como o nome sugere, o uso do React Native implica o uso do **React**, uma biblioteca JavaScript amplamente utilizada no desenvolvimento de aplicações Front End, especialmente para a Web.

### O que você vai aprender

* A relação entre React e React Native
* Como uma aplicação React Native funciona em execução: componentes nativos, engine JavaScript e ponte
* As diferenças entre o Expo CLI e o React Native CLI
* Como criar um projeto com `create-expo-app` e executá-lo no navegador
* A estrutura básica de um projeto Expo
* Como fazer uma primeira alteração no componente `App`

### O que você vai precisar

* Node.js instalado (o `npx` e o `npm` vêm com ele)
* Visual Studio Code
* Um navegador e, opcionalmente, um celular com o aplicativo Expo Go ou um emulador

## React e React Native
Duration: 6:00

Vejamos alguns aspectos importantes sobre React e React Native.

| React | React Native |
| --- | --- |
| Biblioteca JavaScript usada na construção de interfaces gráficas. | Se desejamos desenvolver para dispositivos móveis, deixamos de usar a biblioteca react-dom. |
| Usado no desenvolvimento de aplicações Web. | O React Native oferece uma coleção de componentes que são compilados para componentes de interface gráfica nativos, próprios da plataforma (Android ou iOS) em que a aplicação estiver em execução. |
| Por si só, o React é **independente de plataforma**! Ele fornece ferramentas para a manipulação de estado, a construção de árvores virtuais etc. | Acesso a algumas APIs nativas por meio de JavaScript. |
| Em particular, quando desejamos utilizá-lo no desenvolvimento Web, usamos a biblioteca **react-dom**. Ela é capaz de manipular a árvore DOM, viabilizando o desenvolvimento Web. | |

### O que acontece em execução

Quando uma aplicação desenvolvida com React Native é colocada em execução, ela possui

* componentes React que descrevem a interface gráfica
* código JavaScript que implementa regras de negócio

Por um lado, componentes visuais são compilados para componentes nativos da plataforma, o que, em geral, provê bom desempenho à aplicação. No exemplo a seguir, temos um componente React Native cuja tela possui um gerenciador de leiaute que engloba um campo em que o usuário pode digitar texto. Observe como ele é compilado para código nativo dependente de plataforma.

![Três quadros lado a lado: à esquerda, o código JSX React Native com View e TextInput; no meio, o equivalente Android com View e EditText; à direita, o equivalente iOS com UIView e UITextField](img/p002-1.webp)

*O mesmo componente escrito em JSX (React Native) vira `View`/`EditText` no Android e `UIView`/`UITextField` no iOS.*

**Código JavaScript (JSX)**

```jsx
const App = ( ) => (
  <View>
    <TextInput/>
  </View>
)
```

Por outro lado, o código JavaScript que implementa regras de negócio não é compilado para código nativo. Ele é executado por um engine JavaScript que fica empacotado junto com a aplicação. Observe os detalhes mais importantes para este momento.

![Diagrama da aplicação instalável: componentes visuais compilados como nativos, o código JavaScript interpretado pelo engine, uma ponte e a API nativa de acesso a hardware](img/p002-2.webp)

*Anatomia de uma aplicação React Native em execução.*

* **Essa é a sua aplicação, o "instalável".**
* **Componentes visuais**: compilados como componentes nativos.
* **Código JavaScript da aplicação, interpretado pelo engine**: executa em thread separada da thread principal da aplicação, que é responsável pelo gerenciamento da interface gráfica. Isso evita o congelamento dela.
* **Engine JavaScript**: tipo o V8 do Chrome ou outros. É incluído junto com a aplicação. Ela não executa no navegador!
* **Ponte**: chamada a código nativo (semelhante ao recurso "native" do Java ou RPC). Sempre assíncrono.
* **API nativa** (geolocalização, sensores etc.): acesso a hardware.

## Expo CLI versus React Native CLI
Duration: 5:00

Aplicações React Native podem ser criadas de duas formas principais:

* usando o React Native CLI (Command Line Interface)
* utilizando o Expo

Vejamos os pontos mais importantes para agora.

| Expo CLI | React Native CLI |
| --- | --- |
| É um serviço gratuito provido por terceiros. | Ferramenta React Native oficial, mantida pela equipe React Native e pela comunidade. |
| Pouca configuração para começar o desenvolvimento. | Em geral, mais configurações iniciais são necessárias. |
| Provê um ambiente de desenvolvimento "gerenciado". A criação de aplicações é simples, codificação em altíssimo nível de abstração, inúmeros pacotes para acesso a recursos às APIs nativas. | Em geral, o acesso a recursos de hardware é um pouco mais difícil, com menos opções ou em nível mais baixo de abstração quando comparado com o Expo. |
| Há um conceito conhecido como "ejeção". A ideia é que, ainda que optemos por utilizar o Expo, a qualquer momento podemos "ejetar" de seu ambiente gerenciado, passando a utilizar o ambiente React Native comum. | Viabiliza a integração com código nativo. |

Algumas razões para ejetar:

* Necessidade de módulos nativos que o Expo não oferece
* Escrever código nativo personalizado, específico, que nenhum módulo Expo possui
* Integração com outras aplicações nativas

Neste material, optamos por utilizar o **Expo CLI**.

## Criando o primeiro projeto
Duration: 10:00

Agora, vamos criar nosso primeiro app React Native. Há um passo a passo no site oficial, que pode ser acessado a seguir, que vamos seguir, com eventuais variações, nesta seção.

[https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup)

Comece criando uma pasta. No Windows, você pode querer algo como

```text
C:\Usuários\seuUsuario\Documentos\react_native
```

E em sistemas Unix-like (Linux, Mac), você pode querer algo como

```text
/home/usuario/react_native
```

Após criar um diretório, abra um terminal e vincule-o ao diretório com

**Terminal**

```bash
cd path_do_diretorio
```

Utilizando o `npx`, executaremos o script `create-expo-app`, disponível na base npm registry. Observe.

**Terminal**

```bash
npx create-expo-app primeiro-projeto
```

Observe que uma pasta foi criada. Vincule o terminal atual a ela com

**Terminal**

```bash
cd primeiro-projeto
```

Abra o VS Code vinculado a ela com

**Terminal**

```bash
code .
```

Feche o terminal atual. Abra um terminal interno do VS Code clicando **Terminal >> New terminal**. No terminal interno do VS Code, execute

**Terminal do VS Code**

```bash
npm start
```

para colocar (ou tentar colocar) a aplicação em execução. Veja o resultado.

![Terminal do VS Code com o Metro Bundler iniciado, um QR Code e a lista de atalhos, como a para Android e w para web](img/p005-1.webp)

*O Metro Bundler em execução no terminal do VS Code.*

Os detalhes principais são os seguintes:

* O código QR exibido pode ser lido pela aplicação Expo, disponível no Google Play e na Apple Store. Quando fizer isso, a sua aplicação será executada no seu celular por intermédio do aplicativo Expo.
* A opção **a**, quando digitada direto no terminal, abre a aplicação num celular conectado à máquina ou num emulador disponível.
* A opção **w** coloca a aplicação para executar na web, ou seja, no seu navegador. Pode ser uma boa opção para testes iniciais.

## Executando no navegador
Duration: 6:00

No momento, desejamos testar na web. Entretanto, perceba que a opção **w** está desabilitada.

![Terminal do Expo com a linha "Press w, open web" em cinza e destacada por um retângulo vermelho](img/p006-1.webp)

*A opção w aparece desabilitada.*

Aperte **w**, com o foco no terminal mesmo, mesmo assim, para ver o resultado.

![Terminal do Expo com a mensagem pedindo a instalação de react-native-web, react-dom e @expo/metro-runtime, e o comando npx expo install correspondente destacado](img/p006-2.webp)

*O Expo explica quais dependências faltam para executar na web e como instalá-las.*

A explicação diz que há algumas dependências necessárias caso desejemos executar a aplicação na Web e que elas não estão instaladas no projeto no momento. Felizmente, a aplicação também mostra quais são elas e como instalá-las. Façamos isso.

Encerre a execução momentaneamente com **CTRL + C**. A seguir, use

**Terminal do VS Code**

```bash
npx expo install react-native-web react-dom @expo/metro-runtime
```

para instalar as dependências. Depois disso, execute o projeto novamente com

**Terminal do VS Code**

```bash
npm start
```

Observe que, agora, a opção **w** está habilitada.

![Terminal do Expo mostrando "Web is waiting on http://localhost:8081" e a linha "Press w, open web" habilitada e destacada](img/p007-1.webp)

*Agora a opção w está habilitada.*

Aperte **w** no terminal e veja o resultado.

![Navegador em localhost:8081 exibindo o texto "Open up App.js to start working on your app!"](img/p008-1.webp)

*A aplicação inicial executando no navegador.*

## Estrutura do projeto
Duration: 5:00

No VS Code, observe a estrutura básica da aplicação.

![Explorer do VS Code com a pasta PRIMEIRO-PROJETO contendo .vscode, assets, node_modules, .gitignore, App.js, app.json, babel.config.js, package-lock.json e package.json](img/p008-2.webp)

*Estrutura básica de um projeto criado com create-expo-app.*

* **assets**: recursos como figuras moram aqui.
* **node_modules**: contém as dependências da aplicação, obtidas da base npm registry quando a aplicação foi criada.
* **.gitignore**: arquivo tipicamente utilizado para instruir o Git a respeito dos arquivos que ele deve desconsiderar.
* **App.js**: arquivo JavaScript que contém a definição do componente principal da aplicação.
* **app.json**: configurações da aplicação, como seu nome, modo (retrato ou paisagem) padrão etc.
* **babel.config.js**: configurações do compilador JavaScript Babel. Ele viabiliza o uso de código JavaScript mais moderno, potencialmente ainda não disponível no engine que estivermos utilizando. Também compila expressões JSX. Também é capaz de aplicar transformações no código a fim de aprimorar o desempenho da aplicação.
* **package.json**: tem diversos propósitos, como
  * descrever textualmente as dependências do projeto
  * definir scripts de execução
  * definir dados sobre a aplicação, como a versão, nome etc.
* **package-lock.json**: gerado automaticamente quando o npm modifica a pasta `node_modules` e/ou o arquivo `package.json`. Ele descreve a árvore de dependências, incluindo a versão exata de cada dependência. Isso permite que desenvolvedores diferentes utilizem as mesmas versões. Garante também que os ambientes de desenvolvimento e de produção, por exemplo, utilizem as mesmas versões.

<aside class="positive">

**Nota.** Se você inspecionar o conteúdo do arquivo `package.json`, perceberá que a biblioteca **react-dom** está listada, muito embora não estejamos desenvolvendo para a web (apesar do teste inicial no navegador). Ocorre que, além dela, também consta a biblioteca **react-native-web**. Ela permite que aplicações React Native sejam compiladas para a Web e, por isso, usa a react-dom. A react-dom é, portanto, dependência da react-native-web.

</aside>

## Hello, React Native!
Duration: 4:00

Abra o arquivo `App.js` para fazermos uma pequena alteração: troque o texto exibido pelo componente `Text`.

**App.js**

```jsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello, React Native!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

<aside class="positive">

**Nota.** Pode ser boa ideia manter o VS Code em modo Auto save (**File >> Auto save** ou **Arquivo >> Salvamento automático**). Caso não faça isso, lembre-se de salvar seus arquivos de vez em quando, especialmente quando for testar a aplicação.

</aside>

Clique no botão atualizar do navegador para ver o resultado.

![Navegador em localhost:8081 com o botão de atualizar destacado e o texto "Hello, React Native!" destacado no centro da página](img/p011-1.webp)

*O texto alterado aparece após atualizar a página.*

## Encerramento
Duration: 3:00

Você criou e executou seu primeiro app React Native com o Expo, conheceu a estrutura básica do projeto e fez a primeira alteração no componente `App`.

### Próximos passos

* Continue com o codelab da aplicação de lembretes (`rn-lembretes`), que aprofunda componentes, estado e listas.

### Referências

* React Native. 2024. Disponível em [https://reactnative.dev/](https://reactnative.dev/). Acesso em 2024.
